import { TrajectoryCorrectionAPI } from "@/utils/getMapLocation";
import moment from "moment";
import { getAddressSingle } from "@/utils/getMapLocation";
import { fromLonLat } from "ol/proj";
import gpsConverter from "@/utils/gpsConverter";
export default class Base_Map {
    renderWindowStr(type, param) {
        /* type种类：gps，报警点：alarm，长时间停留点：stay */
        let {
            speed,
            lngGaode,
            latGaode,
            collectTime,
            alarmClassName,
            alarmTypeName,
            alarmGrade,
            driverName,
            alarmTimeFormat,
            startAddress,
            collectTimeEnd,
            parkingDuration,
            endAddress,
            collectTimeStart,
            address,
            areaName,
            driveInDateString,
            driveOutDateString,
            lengthOfStay,
        } = param;
        return new Promise(async (resolve) => {
            let contentDom = document.createElement("div");
            contentDom.className = "info-class";
            let domclose = document.createElement("div");
            let string = `<i class="el-icon-close iclass pointer" id='infoClose'></i>`;
            domclose.innerHTML = string;
            contentDom.appendChild(domclose);
            let domContent = document.createElement("div");
            if (lngGaode !== undefined && latGaode !== undefined && !address) {
                address = await getAddressSingle([lngGaode, latGaode]);
            }
            let content = "";
            switch (type) {
                case "gps":
                    content = `
                    <div class="informClass">
                            <p>上报时间:${collectTime}</p>
                            <p>车速:${speed}km/h</p>
                            <p title='${address}'>位置:${address}</p>
                        </div>
                    `;
                    break;
                case "alarm":
                    content = `
                    <div class="informClass">
                            <p>上报时间:${alarmTimeFormat}</p>
                            <p>报警类型:${alarmClassName}</p>
                            <p>报警名称:${alarmTypeName}</p>
                            <p>风险等级:${
                                alarmGrade === "1"
                                    ? "严重"
                                    : alarmGrade === "2"
                                    ? "较重"
                                    : "一般"
                            }</p>
                            <p>车速:${speed}km/h</p>
                            ${driverName ? `<p>驾驶员:${driverName}</p>` : ``}
                            <p title='${address}'>报警位置:${address}</p>
                        </div>
                    `;
                    break;
                case "stay":
                    content = `<div class="informClass">
                            ${
                                collectTimeStart
                                    ? `<p>停车开始时间:${collectTimeStart}</p>`
                                    : ``
                            }
                            ${
                                collectTimeEnd
                                    ? `<p>停车结束时间:${collectTimeEnd}</p>`
                                    : ``
                            }
                            <p>停车时长:${parkingDuration}</p>
                            ${
                                startAddress
                                    ? `<p title='${startAddress}'>停车开始位置:${startAddress}</p>`
                                    : ``
                            }
                            ${
                                endAddress
                                    ? `<p title='${endAddress}'>停车结束位置:${endAddress}</p>`
                                    : ``
                            }
                        </div>
                    `;
                    break;
                case "region":
                    content = `<div class="informClass">
                                <div>${areaName}</div>
                                <p>进区域时间:${driveInDateString}</p>
                                <p>出区域时间:${driveOutDateString}</p>
                                <p>停车时长:${lengthOfStay}分</p>
                                <p title='${address}'>位置:${address}</p>
                            </div>
                        `;
                    break;
            }
            domContent.innerHTML = content;
            contentDom.appendChild(domContent);
            let sanjiao1 = document.createElement("div");
            sanjiao1.className = "triangle";
            contentDom.appendChild(sanjiao1);
            resolve(contentDom);
        });
    }
    async trajectoryCorrection(historyTrajectoryTempData) {
        let pointList = historyTrajectoryTempData.map(
            ({ latitude, longitude, collectTime, speed, direction }) => {
                return {
                    latitude: latitude,
                    longitude: longitude,
                    loc_time: Number(moment(collectTime).format("X")),
                    speed: speed,
                    direction: direction,
                    coord_type_input: "wgs84",
                };
            }
        );
        if (pointList.length === 0) {
            return;
        }
        let countTotal = Math.ceil(pointList.length / 2000);
        try {
            await this.rectificationAPI(pointList, countTotal, 2000);
            return Promise.resolve();
        } catch (err) {
            return Promise.reject();
        }
    }
    rectificationAPI(pointList, countTotal, size) {
        return new Promise(async (resolve, reject) => {
            let trajectoryCorrection = [];
            let length = 0;
            for (let i = 1; i <= countTotal; i++) {
                if (i !== countTotal) {
                    let tempList = pointList.slice((i - 1) * size, i * size);
                    length = length + tempList.length;
                    let parmas = {
                        point_list: JSON.stringify(tempList),
                        rectify_option:
                            "need_mapmatch:1|transport_mode:driving|denoise_grade:0|vacuate_grade:0",
                        coord_type_output: "gcj02",
                    };
                    try {
                        let res = await TrajectoryCorrectionAPI(parmas);
                        trajectoryCorrection = [
                            ...trajectoryCorrection,
                            ...res.points,
                        ];
                    } catch (err) {
                        reject();
                    }
                } else {
                    let tempList = [];
                    if (countTotal === 1) {
                        tempList = pointList.slice(0);
                    } else {
                        tempList = pointList.slice(i - 1 * size);
                    }
                    length = length + tempList.length;
                    let parmas = {
                        point_list: JSON.stringify(tempList),
                        rectify_option:
                            "need_mapmatch:1|transport_mode:driving|denoise_grade:0|vacuate_grade:0",
                        coord_type_output: "gcj02",
                    };
                    try {
                        let res = await TrajectoryCorrectionAPI(parmas);
                        trajectoryCorrection = [
                            ...trajectoryCorrection,
                            ...res.points,
                        ];
                        // let spliceIndexList = [];
                        trajectoryCorrection.forEach((_, index, array) => {
                            let gps = array[index];
                            if (gps.loc_time === null) {
                                array[index] = null;
                                return;
                            }
                            let collectTime = moment
                                .unix(gps.loc_time)
                                .format("YYYY-MM-DD HH:mm:ss");
                            let lngGaode = gps.longitude;
                            let latGaode = gps.latitude;
                            let { lng: longitude, lat: latitude } =
                                gpsConverter.gaode_gps(lngGaode, latGaode);
                            let [lng, lat] = fromLonLat([longitude, latitude]);
                            let obj = {
                                lng,
                                lat,
                                lngGaode,
                                latGaode,
                                latitude,
                                latitude,
                                collectTime,
                                createTime: collectTime,
                            };
                            Object.assign(gps, obj);
                        });
                        trajectoryCorrection = trajectoryCorrection.filter(
                            (item) => {
                                return item !== null;
                            }
                        );
                        Base_Map.trajectoryCorrection = trajectoryCorrection;
                        resolve();
                    } catch (err) {
                        reject();
                    }
                }
            }
        });
    }
    getColorByValueBase(setting) {
        let { colorList, valueList } = setting;
        let rangeMap = {};
        colorList.forEach((_, index) => {
            if (index === 0) {
                rangeMap[`0-${valueList[index]}`] = colorList[index];
            } else if (index === colorList.length - 1) {
                rangeMap[`${valueList[valueList.length - 1]}-150`] =
                    colorList[index];
            } else {
                rangeMap[`${valueList[index - 1]}-${valueList[index]}`] =
                    colorList[index];
            }
        });
        return function (speed) {
            let color;
            Object.keys(rangeMap).forEach((key) => {
                let [min, max] = key.split("-");
                if (speed >= Number(min) && speed < Number(max)) {
                    color = rangeMap[key];
                }
            });
            return color;
        };
    }
    getLongTime() {
        let nowDate = new Date();
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth() + 1;
        let today = nowDate.getDate();
        let hours = nowDate.getHours();
        let minutes = nowDate.getMinutes();
        let seconds = nowDate.getSeconds();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (today >= 1 && today <= 9) {
            today = "0" + today;
        }
        let currentdate =
            year +
            "-" +
            month +
            "-" +
            today +
            " " +
            hours +
            ":" +
            minutes +
            ":" +
            seconds;
        let longTime = new Date(
            currentdate.replace(new RegExp("-", "gm"), "/")
        ).getTime();
        return longTime;
    }
    // 由于需要按照不同速度绘制不同颜色的线，所以需要根据速度分组
    // 但是感觉这里也可以优化，比如当只有一种颜色时，就不用对整个数组进行循环遍历一次了
    casPath(path, valueList) {
        let lineList = [[], [], [], [], [], []];
        let lineOneFlag = false;
        let lineTwoFlag = false;
        let lineThreeFlag = false;
        let lineFourFlag = false;
        let lineFiveFlag = false;
        let lineSixFlag = false;
        path.forEach(({ speed, lng, lat, locateType }, index, array) => {
            switch (locateType) {
                case 1:
                    if (!lineOneFlag) { 
                        lineOneFlag = true;
                        lineTwoFlag = false;
                        lineThreeFlag = false;
                        lineFourFlag = false;
                        lineFiveFlag = false;
                        lineSixFlag = false;
                        lineList[0].push([]);
                        if (index !== 0) {
                            lineList[0][lineList[0].length - 1].push([
                                array[index - 1].lng,
                                array[index - 1].lat,
                            ]);
                        }
                        lineList[0][lineList[0].length - 1].push([lng, lat]);
                    } else {
                        lineList[0][lineList[0].length - 1].push([lng, lat]);
                    }
                    break;
                case 2:
                    if (!lineTwoFlag) {
                        lineOneFlag = false;
                        lineTwoFlag = true;
                        lineThreeFlag = false;
                        lineFourFlag = false;
                        lineFiveFlag = false;
                        lineSixFlag = false;
                        lineList[1].push([]);
                        if (index !== 0) {
                            lineList[1][lineList[1].length - 1].push([
                                array[index - 1].lng,
                                array[index - 1].lat,
                            ]);
                        }
                        lineList[1][lineList[1].length - 1].push([lng, lat]);
                    } else {
                        lineList[1][lineList[1].length - 1].push([lng, lat]);
                    }
                    break;
                case 3:
                    if (!lineThreeFlag) {
                        lineOneFlag = false;
                        lineTwoFlag = false;
                        lineThreeFlag = true;
                        lineFourFlag = false;
                        lineFiveFlag = false;
                        lineSixFlag = false;
                        lineList[2].push([]);
                        if (index !== 0) {
                            lineList[2][lineList[2].length - 1].push([
                                array[index - 1].lng,
                                array[index - 1].lat,
                            ]);
                        }
                        lineList[2][lineList[2].length - 1].push([lng, lat]);
                    } else {
                        lineList[2][lineList[2].length - 1].push([lng, lat]);
                    }
                    break;
                case 4:
                    if (!lineFourFlag) {
                        lineOneFlag = false;
                        lineTwoFlag = false;
                        lineThreeFlag = false;
                        lineFourFlag = true;
                        lineFiveFlag = false;
                        lineSixFlag = false;
                        lineList[3].push([]);
                        if (index !== 0) {
                            lineList[3][lineList[3].length - 1].push([
                                array[index - 1].lng,
                                array[index - 1].lat,
                            ]);
                        }
                        lineList[3][lineList[3].length - 1].push([lng, lat]);
                    } else {
                        lineList[3][lineList[3].length - 1].push([lng, lat]);
                    }
                    break;
                case 5:
                    if (!lineFiveFlag) {
                        lineOneFlag = false;
                        lineTwoFlag = false;
                        lineThreeFlag = false;
                        lineFourFlag = false;
                        lineFiveFlag = true;
                        lineSixFlag = false;
                        lineList[4].push([]);
                        if (index !== 0) {
                            lineList[4][lineList[4].length - 1].push([
                                array[index - 1].lng,
                                array[index - 1].lat,
                            ]);
                        }
                        lineList[4][lineList[4].length - 1].push([lng, lat]);
                    } else {
                        lineList[4][lineList[4].length - 1].push([lng, lat]);
                    }
                    break;
                case 6:
                    if (!lineSixFlag) {
                        lineOneFlag = false;
                        lineTwoFlag = false;
                        lineThreeFlag = false;
                        lineFourFlag = false;
                        lineFiveFlag = false;
                        lineSixFlag = true;
                        lineList[5].push([]);
                        if (index !== 0) {
                            lineList[5][lineList[5].length - 1].push([
                                array[index - 1].lng,
                                array[index - 1].lat,
                            ]);
                        }
                        lineList[5][lineList[5].length - 1].push([lng, lat]);
                    } else {
                        lineList[5][lineList[5].length - 1].push([lng, lat]);
                    }
                    break;
            }
            // if (speed <= valueList[0]) {
            //     if (!lineOneFlag) {
            //         lineOneFlag = true;
            //         lineTwoFlag = false;
            //         lineThreeFlag = false;
            //         lineFourFlag = false;
            //         lineList[0].push([]);
            //         if (index !== 0) {
            //             lineList[0][lineList[0].length - 1].push([
            //                 array[index - 1].lng,
            //                 array[index - 1].lat,
            //             ]);
            //         }
            //         lineList[0][lineList[0].length - 1].push([lng, lat]);
            //     } else {
            //         lineList[0][lineList[0].length - 1].push([lng, lat]);
            //     }
            // } else if (speed > valueList[0] && speed <= valueList[1]) {
            //     if (!lineTwoFlag) {
            //         lineOneFlag = false;
            //         lineTwoFlag = true;
            //         lineThreeFlag = false;
            //         lineFourFlag = false;
            //         lineList[1].push([]);
            //         if (index !== 0) {
            //             lineList[1][lineList[1].length - 1].push([
            //                 array[index - 1].lng,
            //                 array[index - 1].lat,
            //             ]);
            //         }
            //         lineList[1][lineList[1].length - 1].push([lng, lat]);
            //     } else {
            //         lineList[1][lineList[1].length - 1].push([lng, lat]);
            //     }
            // } else if (speed > valueList[1] && speed <= valueList[2]) {
            //     if (!lineThreeFlag) {
            //         lineOneFlag = false;
            //         lineTwoFlag = false;
            //         lineThreeFlag = true;
            //         lineFourFlag = false;
            //         lineList[2].push([]);
            //         if (index !== 0) {
            //             lineList[2][lineList[2].length - 1].push([
            //                 array[index - 1].lng,
            //                 array[index - 1].lat,
            //             ]);
            //         }
            //         lineList[2][lineList[2].length - 1].push([lng, lat]);
            //     } else {
            //         lineList[2][lineList[2].length - 1].push([lng, lat]);
            //     }
            // } else {
            //     if (!lineFourFlag) {
            //         lineOneFlag = false;
            //         lineTwoFlag = false;
            //         lineThreeFlag = false;
            //         lineFourFlag = true;
            //         lineList[3].push([]);
            //         if (index !== 0) {
            //             lineList[3][lineList[3].length - 1].push([
            //                 array[index - 1].lng,
            //                 array[index - 1].lat,
            //             ]);
            //         }
            //         lineList[3][lineList[3].length - 1].push([lng, lat]);
            //     } else {
            //         lineList[3][lineList[3].length - 1].push([lng, lat]);
            //     }
            // }
        });
        //防止出现线里面只有一个坐标，导致框架报错
        lineList.forEach((multiLine) => {
            multiLine.forEach((line) => {
                if (line.length === 1) {
                    line.push(line[0]);
                }
            });
        });
        // return lineList;
    }
    cashd = (direction) => {
        if (direction === undefined) {
            direction = 0;
        }
        return (Math.PI / 180) * direction;
    };

    constructor() {
        this.overlaysList = [
            "carMarkerPoint" /* 小车图标 */,
            "startMarkerPoint" /* 开始图标 */,
            "endMarkerPoint" /* 结束图标 */,
            "focusMarkerPoint" /* 聚焦点，比如点击GPS列表，地图上显示的点*/,
            "singMarker",
            "gpsMarkers",
            "alarmMarkers",
            "stayMarkers",
            "regionMarkers",
            "infoWindow",
        ];
    }
}
