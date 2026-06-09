import store from "../store";
import fetch from "@/utils/fetch";
import gpsConverter from "./gpsConverter";
import axios from "axios";
const localized = store.getters.getLocalized;
const baseUrl = store.getters.getAmapAddressUrl || "https://restapi.amap.com";
const geocoder = new AMap.Geocoder({ extensions: "all" });
const geoc = new BMap.Geocoder();
import vue from "vue";
const fetchAddress = (lnglat, isMultiple) => {
    let url = `${baseUrl}/v3/geocode/regeo?platform=JS&logversion=2.0&key=ace026dad536bf4b10666f75ccb47cc2&extensions=all&output=json&location=`;
    if (isMultiple) {
        lnglat = lnglat.join("|");
        url = url + lnglat + "&batch=true";
    } else {
        url = url + lnglat[0] + "," + lnglat[1];
    }
    let p = new Promise((resolve, reject) => {
        axios.get(url).then(
            (res) => {
                let result = res.data;
                if (result.status == 1 && result.info == "OK") {
                    resolve(result);
                } else {
                    reject("");
                }
            },
            (rej) => {
                reject(rej);
            }
        );
    });
    return p;
};
//轨迹纠偏
const TrajectoryCorrectionAPI = (params) => {
    return fetch({
        baseURL: "/apis",
        url: "/rectify/v1/track",
        method: "post",
        data: {
            ak: "mqBAL7rHSTr9Lfkr1Qfjxq2WGKcY8IO7",
            ...params,
        },
    });
};
/**
 * 解析围栏信息
 * detail 围栏信息；convertFun坐标转换方法
 */
const resolveFenceInfo = (eleFenceVo, convertFun) => {
    let shapeDetail = JSON.parse(eleFenceVo.shapeDetail);
    let shapeType = eleFenceVo.shapeType;
    let mapForm = "";
    if (shapeType == 1 || shapeType == 5) {
        //圆形
        mapForm = {};
        let { lng, lat } = gpsConverter[convertFun](
            shapeDetail.center.lng,
            shapeDetail.center.lat
        );
        mapForm = {
            center: { lng, lat },
            radius: shapeDetail.radius,
        };
    } else if (shapeType == 2) {
        //多边形
        mapForm = [];
        shapeDetail.map((item) => {
            //转火星坐标系
            let { lng, lat } = gpsConverter[convertFun](item.lng, item.lat);
            item.lng = lng;
            item.lat = lat;
            mapForm.push({ lng, lat });
        });
    } else if (shapeType == 3) {
        //路线
        mapForm = [];
        shapeDetail.map((item) => {
            //转火星坐标系
            let { lng, lat } = gpsConverter[convertFun](
                item.longitude,
                item.latitude
            );
            item.lng = lng;
            item.lat = lat;
            mapForm.push({ lng, lat });
        });
    } else if (shapeType == 4) {
        mapForm = [];
        //矩形，判断是不是对角线，如果是对角线，需要转化成四个点
        if (shapeDetail.length == 2) {
            let rectangleLine = shapeDetail;
            let minLng = 0,
                maxLng = 0,
                minLat = 0,
                maxLat = 0;
            minLng =
                rectangleLine[0].lng > rectangleLine[1].lng
                    ? rectangleLine[1].lng
                    : rectangleLine[0].lng;
            maxLng =
                rectangleLine[0].lng > rectangleLine[1].lng
                    ? rectangleLine[0].lng
                    : rectangleLine[1].lng;
            minLat =
                rectangleLine[0].lat > rectangleLine[1].lat
                    ? rectangleLine[1].lat
                    : rectangleLine[0].lat;
            maxLat =
                rectangleLine[0].lat > rectangleLine[1].lat
                    ? rectangleLine[0].lat
                    : rectangleLine[1].lat;
            shapeDetail = [
                { lng: minLng, lat: maxLat },
                { lng: maxLng, lat: maxLat },
                { lng: maxLng, lat: minLat },
                { lng: minLng, lat: minLat },
            ];
        }
        shapeDetail.map((item) => {
            //转火星坐标系
            let { lng, lat } = gpsConverter[convertFun](item.lng, item.lat);
            item.lng = lng;
            item.lat = lat;
            mapForm.push({ lng, lat });
        });
    }
    return mapForm;
};

/**
 * 批量转换将经纬度转为地理位置
 * lnglat:经纬度信息
 * isSingle:转换单个还是多个
 * isNeedTransfer：是否需要转换GPS
 */
const transferAddress = async (
    lnglatInfos,
    lngName = "lng",
    latName = "lat",
    addressName = "location",
    isNeedTransfer
) => {
    return new Promise((reslove, reject) => {
        lnglatInfos.forEach((item, index) => {
            let { lng: lngGCJ, lat: latGCJ } = gpsConverter.gps_gaode(
                item[lngName],
                item[latName]
            );
            let { lng: lngBaidu, lat: latBaidu } = gpsConverter.gaode_baidu(
                lngGCJ,
                latGCJ
            );
            geoc.getLocation(
                new BMap.Point(lngBaidu, latBaidu),
                function (result) {
                    item[addressName] = transAddressFnBaidu(result);
                    if (index === lnglatInfos.length - 1) {
                        reslove();
                    }
                }
            );
        });
    });

    // let lnglats = [];
    // let addressObj = {}; //没有经纬度的数据
    // //要将没有经纬度的数据过滤出来，因为一组数据里面如果有一个经纬度解析不出来，一组都会解析失败
    // //拆分时记住每个index，后面再合并回去
    // lnglatInfos.forEach((item, index) => {
    //     if (!item[lngName] || !item[latName]) {
    //         addressObj[index] = true;
    //     } else {
    //         if (isNeedTransfer) {
    //             let { lng, lat } = gpsConverter.gps_gaode(
    //                 item[lngName],
    //                 item[latName]
    //             );
    //             lnglats.push([lng, lat]);
    //         } else {
    //             lnglats.push([item[lngName], item[latName]]);
    //         }
    //     }
    // });
    // //一次只能解析20条，如果数据超过20条，需要分多次解析
    // let times = Math.ceil(lnglats.length / 20);
    // let pArr = [];
    // for (let i = 0; i < times; i++) {
    //     let lnglatArr = lnglats.slice(i * 20, (i + 1) * 20);
    //     let p = new Promise((resolve, reject) => {
    //         getAddress(lnglatArr).then(
    //             (res) => {
    //                 resolve(res);
    //             },
    //             (rej) => {
    //                 reject();
    //             }
    //         );
    //     });
    //     pArr.push(p);
    // }
    // return Promise.all(pArr).then(
    //     (res) => {
    //         let loaction = [];
    //         for (let i = 0; i < times; i++) {
    //             loaction = loaction.concat(res[i]);
    //         }
    //         //将之前拆出来的没有经纬度的数据再塞回去，避免解析数据错位
    //         for (let key in addressObj) {
    //             loaction.splice(key, 0, {});
    //         }
    //         for (let i = 0; i < loaction.length; i++) {
    //             let address = transAddressFn(loaction[i]);
    //             vue.set(lnglatInfos[i], addressName, address);
    //             // lnglatInfos[i][addressName] = address
    //         }
    //     },
    //     (rej) => {
    //     }
    // );
};
const transAddressFnBaidu = (regeocode) => {
    let address = "";
    if (regeocode.address) {
        address = address + regeocode.address;
    }
    if (regeocode.content && regeocode.content.poi_desc) {
        address = address + regeocode.content.poi_desc;
    }
    return address;
};
let getAddress = async (lnglats) => {
    let p = new Promise((resolve, reject) => {
        if (localized) {
            fetchAddress(lnglats, true).then(
                (res) => {
                    let location = res.regeocodes;
                    resolve(location);
                },
                (rej) => {
                    let pArr = dealMultiFail(lnglats);
                    Promise.all(pArr).then(
                        (result) => {
                            resolve(result);
                        },
                        (r) => {
                            resolve(result);
                        }
                    );
                }
            );
        } else {
            geocoder.getAddress(lnglats, (status, result) => {
                if (status === "complete" && result.info === "OK") {
                    let location = result.regeocodes;
                    resolve(location);
                } else {
                    let pArr = dealMultiFail(lnglats);
                    Promise.all(pArr).then(
                        (result) => {
                            resolve(result);
                        },
                        (r) => {
                            resolve(r);
                        }
                    );
                }
            });
        }
    });
    return p;
};
let dealMultiFail = (lnglats) => {
    //如果一组数据解析失败，将这组数据一个个进行解析
    let pArr = [];
    for (let i = 0; i < lnglats.length; i++) {
        let lnglat = lnglats[i];
        let p = new Promise((resolve, reject) => {
            getAddressSingle(lnglat).then(
                (res) => {
                    resolve(res);
                },
                (rej) => {
                    reject();
                }
            );
        });
        pArr.push(p);
    }
};
const getAddressSingle = async (lnglat, isNeedTransfer = false) => {
    return new Promise((reslove, reject) => {
        geoc.getLocation(
            new BMap.Point(lnglat[0], lnglat[1]),
            function (result) {
                reslove(transAddressFnBaidu(result));
            }
        );
    });
    // if (isNeedTransfer) {
    //     let { lng, lat } = gpsConverter.gps_gaode(lnglat[0], lnglat[1]);
    //     lnglat = [lng, lat];
    // }
    // let p = new Promise((res, rej) => {
    //     if (localized) {
    //         fetchAddress(lnglat).then(
    //             (result) => {
    //                 let location = formatAddress(result);
    //                 res(location);
    //             },
    //             (rej) => {
    //                 res("");
    //             }
    //         );
    //     } else {
    //         geocoder.getAddress(lnglat, (status, result) => {
    //             if (status === "complete" && result.info === "OK") {
    //                 let location = formatAddress(result);
    //                 res(location);
    //             } else {
    //                 res("");
    //             }
    //         });
    //     }
    // });
    // return p;
};
const formatAddress = (result) => {
    if (!result || !result.regeocode) {
        return "";
    }
    let address = transAddressFn(result.regeocode);
    return address;
};
const transAddressFn = (regeocode) => {
    let address = "";
    if (regeocode.formattedAddress) {
        address = address + regeocode.formattedAddress;
    } else {
        if (regeocode.addressComponent) {
            address =
                address +
                (regeocode.addressComponent.country
                    ? regeocode.addressComponent.country
                    : "") +
                regeocode.addressComponent.province +
                regeocode.addressComponent.city +
                regeocode.addressComponent.district +
                regeocode.addressComponent.township;
            if (
                (!regeocode.roads || regeocode.roads.length == 0) &&
                (!regeocode.pois || regeocode.pois.length == 0)
            ) {
                address =
                    address +
                    regeocode.addressComponent.street +
                    regeocode.addressComponent.streetNumber;
            }
        }
        if (regeocode.roads && regeocode.roads.length > 0) {
            address =
                address +
                regeocode.roads[0].name +
                regeocode.roads[0].direction +
                "方向" +
                (regeocode.pois.length
                    ? ""
                    : regeocode.roads[0].distance + "米");
        }
        if (regeocode.pois && regeocode.pois.length > 0) {
            let distance = regeocode.pois[0].distance
                ? parseInt(regeocode.pois[0].distance)
                : regeocode.pois[0].distance;
            address =
                address +
                regeocode.pois[0].name +
                regeocode.pois[0].direction +
                "方向" +
                distance +
                "米";
        }
    }
    return address;
};
/**
 * 查询历史轨迹，分页查询，每次查询3000条
 * @param {*} historyTrajectoryForm 查询参数
 * @param {*} isErrorMess 是否在接口返回报错时进行错误提示，默认为提示
 * @returns
 */
const getGpsData = (historyTrajectoryForm, isErrorMess = true) => {
    let queryState = {
        queryCount: 0,
        queryTotal: null,
    };
    let gpsList = [];
    return new Promise((reslove, reject) => {
        let promisePage = async (params, resolve) => {
            try {
                let res = await vue.prototype.$api.carTraceListPage(params);
                if (res.success) {
                    queryState.queryCount++;
                    gpsList = [...gpsList, ...res.data.results];
                    if (queryState.queryCount === 1) {
                        queryState.queryTotal = res.data.totalPages;
                        params.queryData = true;
                    }
                    // if (queryState.queryCount === queryState.queryTotal) {
                        resolve(gpsList);
                    // } else {
                    //     params.currentPage++;
                    //     promisePage(params, resolve);
                    // }
                } else {
                    if (isErrorMess) vue.prototype.$message.error(res.msg);
                    resolve(gpsList);
                }
            } catch (e) {
                reject(e);
            }
        };
        let params = {
            ...historyTrajectoryForm,
            ...{
                pageSize: 3000,
                currentPage: 1,
                queryData: false,
            },
        };
        promisePage(params, reslove);
    });
};
export {
    TrajectoryCorrectionAPI,
    resolveFenceInfo,
    transferAddress,
    formatAddress,
    getAddressSingle,
    getGpsData,
};
