
import A_Map_DrawHander from '../drawHanderClass/A_Map_DrawHander';
import Base_Map from './Base_Map'
import { carIcon, startIcon, endIcon, squreIcon, alarmIcon, stayOnlineIcon, stayOutlineIcon, regionIcon } from './util'
import { initRangingTool } from "@/utils/gaodeMap";
/**
 * 
 * 类里的覆盖物统一有固定的命名方案
 * 
 *  */
export default class A_Map extends Base_Map {
    constructor(map, utilMethods, mapOption) {
        super(map, utilMethods, mapOption);
        this.initData();
        this.A_Map_DrawHander = new A_Map_DrawHander(map);
        this.initDrawProxy();
    }
    initDrawProxy() {
        for (let key in this.A_Map_DrawHander) {
            if (this.A_Map_DrawHander[key] instanceof Function) {
                this[key] = (...arg) => {
                    this.A_Map_DrawHander[key].call(this.A_Map_DrawHander, ...arg);
                }
            }
        }
    }
    drawMarker = (type, info) => {
        let { lngGaode, latGaode, direction, stayType, areaId } = info;
        switch (type) {
            case 'car':
                if (!this.carMarker) {
                    /* 小车绘制 */
                    this.carMarker = new AMap.Marker({
                        position: [lngGaode, latGaode],
                        offset: new AMap.Pixel(-18, -20),
                        icon: carIcon,
                        angle: direction,
                        zIndex: 250
                    });
                    this.map.add(this.carMarker);
                } else {
                    this.carMarker.setPosition([lngGaode, latGaode]);
                    this.carMarker.setAngle(direction);
                }
                break;
            case 'start':
                this.startMarker = new AMap.Marker({
                    position: [lngGaode, latGaode],
                    offset: new AMap.Pixel(-15, -30),
                    icon: startIcon,
                });
                this.map.add(this.startMarker);
                break;
            case 'end':
                this.endMarker = new AMap.Marker({
                    position: [lngGaode, latGaode],
                    offset: new AMap.Pixel(-15, -30),
                    icon: endIcon,
                });
                this.map.add(this.endMarker);
                break;
        }
        if (/^(focus\-)/.test(type)) {
            this.removeOverlay('focusMarker');
            let focusType = type.split('-')[1];
            let focusIcon = (focusType === 'stay') ? `stay${stayType === 0 ? 'Online' : 'Outline'}` : focusType;
            this.focusMarker = new AMap.Marker({
                position: [lngGaode, latGaode],
                offset: new AMap.Pixel(-12, -20),
                icon: { 'alarm': alarmIcon, 'stayOnline': stayOnlineIcon, 'stayOutline': stayOutlineIcon, 'region': regionIcon }[focusIcon],
            });
            this.focusMarker.on("click", () => {
                this.drawInfoWindow({ type: focusType, data: info });
                this.toggleCheck(areaId, true)
            });
            this.map.add(this.focusMarker);
        }
    }
    drawAllPath = (path, { polylineColorType, valueList, colorList, polylineWidth }) => {
        let lineList = [[], [], [], []];
        let lineOneFlag = false;
        let lineTwoFlag = false;
        let lineThreeFlag = false;
        let lineFourFlag = false;
        path.forEach(({ speed, lngGaode, latGaode }, index, array) => {
            if (speed <= valueList[0]) {
                if (!lineOneFlag) {
                    lineOneFlag = true;
                    lineTwoFlag = false;
                    lineThreeFlag = false;
                    lineFourFlag = false;
                    lineList[0].push([]);
                    if (index !== 0) {
                        lineList[0][lineList[0].length - 1].push([array[index - 1].lngGaode, array[index - 1].latGaode]);
                    }
                    lineList[0][lineList[0].length - 1].push([lngGaode, latGaode]);
                } else {
                    lineList[0][lineList[0].length - 1].push([lngGaode, latGaode]);
                }
            } else if (speed > valueList[0] && speed <= valueList[1]) {
                if (!lineTwoFlag) {
                    lineOneFlag = false;
                    lineTwoFlag = true;
                    lineThreeFlag = false;
                    lineFourFlag = false;
                    lineList[1].push([]);
                    if (index !== 0) {
                        lineList[1][lineList[1].length - 1].push([array[index - 1].lngGaode, array[index - 1].latGaode]);
                    }
                    lineList[1][lineList[1].length - 1].push([lngGaode, latGaode]);
                } else {
                    lineList[1][lineList[1].length - 1].push([lngGaode, latGaode]);
                }
            } else if (speed > valueList[1] && speed <= valueList[2]) {
                if (!lineThreeFlag) {
                    lineOneFlag = false;
                    lineTwoFlag = false;
                    lineThreeFlag = true;
                    lineFourFlag = false;
                    lineList[2].push([]);
                    if (index !== 0) {
                        lineList[2][lineList[2].length - 1].push([array[index - 1].lngGaode, array[index - 1].latGaode]);
                    }
                    lineList[2][lineList[2].length - 1].push([lngGaode, latGaode]);
                } else {
                    lineList[2][lineList[2].length - 1].push([lngGaode, latGaode]);
                }
            } else {
                if (!lineFourFlag) {
                    lineOneFlag = false;
                    lineTwoFlag = false;
                    lineThreeFlag = false;
                    lineFourFlag = true;
                    lineList[3].push([]);
                    if (index !== 0) {
                        lineList[3][lineList[3].length - 1].push([array[index - 1].lngGaode, array[index - 1].latGaode]);
                    }
                    lineList[3][lineList[3].length - 1].push([lngGaode, latGaode]);
                } else {
                    lineList[3][lineList[3].length - 1].push([lngGaode, latGaode]);
                }
            }
        });
        this.allPathLayer = new AMap.OverlayGroup();
        lineList.forEach((_path, index) => {
            let polyline = new AMap.Polyline({
                path: _path,
                strokeWeight: polylineWidth * 3,
                strokeColor: polylineColorType === 1 ? '#409eff' : colorList[index],
                lineJoin: "round",
            })
            this.allPathLayer.addOverlay(polyline);
        })
        this.map.add(this.allPathLayer);
        this.polyPathLine = this.allPathLayer.getOverlays();
    }
    drawAllPathPointer = () => {
        if (this.allPathLayer) {
            this.allPathLayer.getOverlays().forEach((polyline) => {
                polyline.setOptions({ showDir: true })
            });
            this.pathPointerLayer = true
        }
    }
    drawInfoWindow = async (renderWindowInfo) => {
        let { type, data } = renderWindowInfo;
        let content = await this.renderWindowStr(type, { ...data, position: [data.lngGaode, data.latGaode] });
        let handerCommon = () => {
            this.infoWindow = null;
        };
        let handerRegion = () => {
            this.infoWindow = null;
            /* 如果是区域弹框，区域弹框要和区域绑定 */
            this.toggleCheck(data.areaId, false);
        }
        if (!this.infoWindow) {
            if (type === 'region') {
                this.infoWindow = new AMap.InfoWindow({
                    content,
                });
                this.infoWindow.open(this.map, [data.lngGaode, data.latGaode]);
                this.infoWindow.on('close', handerRegion);
            } else {
                this.infoWindow = new AMap.InfoWindow({
                    content,
                });
                this.infoWindow.open(this.map, [data.lngGaode, data.latGaode]);
                this.infoWindow.on('close', handerCommon);
            }
        } else {
            if (type === 'region') {
                this.infoWindow.close();
                setTimeout(() => {
                    this.infoWindow = new AMap.InfoWindow({
                        content,
                    });
                    this.infoWindow.open(this.map, [data.lngGaode, data.latGaode]);
                    this.infoWindow.on('close', handerRegion);
                }, 50)
            } else {
                this.infoWindow.setContent(content);
                this.infoWindow.setPosition([data.lngGaode, data.latGaode]);
                this.infoWindow.on('close', handerCommon);
            }
        }
    }
    drawGpsMarkers = (historyTrajectoryTempData) => {
        this.gpsMarkers = new AMap.MassMarks(
            historyTrajectoryTempData.map(({ lngGaode, latGaode, speed, collectTime }) => {
                return {
                    lnglat: [lngGaode, latGaode],
                    speed,
                    collectTime
                };
            }),
            {
                zIndex: 3040,
                style: {
                    url: squreIcon,
                    size: new AMap.Size(6, 6),
                    anchor: new AMap.Pixel(3, 4),
                }
            }
        );
        this.gpsMarkers.setMap(this.map);
        /* 点击事件绑定 */
        this.gpsMarkers.on("click", async ({ data }) => {
            this.drawInfoWindow({ type: 'gps', data: { ...data, lngGaode: data.lnglat[0], latGaode: data.lnglat[1] } });
        });
    }
    drawAlarmMarkers = (alarmList) => {
        this.alarmMarkers = new AMap.MassMarks(
            alarmList.map(({ lngGaode, latGaode, speed, alarmTimeFormat, alarmClassName, alarmGrade, driverName, alarmTypeName }) => {
                return {
                    lnglat: [lngGaode, latGaode],
                    speed,
                    alarmTimeFormat,
                    alarmClassName,
                    alarmGrade,
                    driverName,
                    alarmTypeName
                };
            }),
            {
                zIndex: 3060,
                style: {
                    url: alarmIcon,
                    size: new AMap.Size(20, 20),
                    anchor: new AMap.Pixel(13, 13)
                }
            }
        );
        this.alarmMarkers.setMap(this.map);
        this.alarmMarkers.on("click", async ({ data }) => {
            this.drawInfoWindow({ type: 'alarm', data: { ...data, lngGaode: data.lnglat[0], latGaode: data.lnglat[1] } });
        });
    }
    drawStayMarkers = (stayList) => {
        let stayTypeList = [
            {
                url: stayOnlineIcon,
                size: new AMap.Size(30, 33),
                anchor: new AMap.Pixel(15, 20),
            },
            {
                url: stayOutlineIcon,
                size: new AMap.Size(30, 33),
                anchor: new AMap.Pixel(15, 20),
            }
        ];
        this.stayMarkers = new AMap.MassMarks(
            stayList.map(({ lngGaode, latGaode, startTimeFormat, endTimeFormat, stayTimeString, stayType, address, endAddress }) => {
                return {
                    lnglat: [lngGaode, latGaode],
                    startTimeFormat,
                    endTimeFormat,
                    stayTimeString,
                    stayType,
                    address,
                    endAddress,
                    style: stayType ? 1 : 0
                };
            }),
            {
                zIndex: 3050,
                style: stayTypeList
            }
        );
        this.stayMarkers.setMap(this.map);
        /* 点击事件绑定 */
        this.stayMarkers.on("click", async ({ data }) => {
            this.drawInfoWindow({ type: 'stay', data: { ...data, lngGaode: data.lnglat[0], latGaode: data.lnglat[1] } });
        });
    }
    drawRegionMarkers = (regionList) => {
        if (!this.regionMarkers) {
            this.regionMarkers = new AMap.MassMarks(
                regionList.map(({ lngGaode, latGaode, areaId, areaName, driveInDateString, driveOutDateString, lengthOfStay, driveInLocation }) => {
                    return {
                        lnglat: [lngGaode, latGaode],
                        areaId,
                        areaName,
                        driveInDateString,
                        driveOutDateString,
                        lengthOfStay,
                        address: driveInLocation,
                    };
                }),
                {
                    style: {
                        url: regionIcon,
                        size: new AMap.Size(16, 20),
                        anchor: new AMap.Pixel(8, 16)
                    }
                }
            );
            this.regionMarkers.setMap(this.map);
            this.regionMarkers.on("click", async ({ data }) => {
                this.drawInfoWindow({ type: 'region', data: { ...data, lngGaode: data.lnglat[0], latGaode: data.lnglat[1] } });
                setTimeout(() => {
                    this.toggleCheck(data.areaId, true);
                }, 100)
            });
        } else {
            this.regionMarkers.show();
        }
    }
    drawTrajectoryLine = (historyTrajectoryTempData) => {
        return new Promise(async (resolve, reject) => {
            if (!Base_Map.trajectoryCorrection_Gaode) {
                try {
                    await this.trajectoryCorrection(historyTrajectoryTempData);
                    this.trajectoryLine = new AMap.Polyline({
                        path: Base_Map.trajectoryCorrection_Gaode.map(({ lngGaode, latGaode }) => {
                            return [lngGaode, latGaode];
                        }),
                        zIndex: 300,
                        borderWeight: 5,
                        strokeColor: "red",
                        strokeWeight: 7,
                        lineJoin: "round",
                    });
                    this.map.add(this.trajectoryLine);
                    resolve();
                } catch (e) {
                    reject(e);
                };
            } else {
                this.trajectoryLine = new AMap.Polyline({
                    path: Base_Map.trajectoryCorrection_Gaode.map(({ lngGaode, latGaode }) => {
                        return [lngGaode, latGaode];
                    }),
                    zIndex: 300,
                    borderWeight: 5,
                    strokeColor: "red",
                    strokeWeight: 7,
                    lineJoin: "round",
                });
                this.map.add(this.trajectoryLine);
                resolve();
            }
        })
    }
    removeOverlay = (name) => {
        if (!checkKeys(this[name])) {
            return;
        }
        /* 图层销毁方案，一开始设计的是图层，后面优化改成line方案，但是名称需要和百度统一，则使用layer */
        if (/allPathLayer$/.test(name)) {
            this.map.remove(this[name]);
            /* 海量点销毁方案 */
        } else if (/Markers$/.test(name)) {
            this[name].clear();
            /* 覆盖物，矢量图层销毁方案 */
        } else if (/(Marker|Line)$/.test(name)) {
            this.map.remove(this[name]);
        } else if (name === 'infoWindow') {
            this[name].close();
        } else if (name === 'rangeingTool') {
            this[name].turnOff(true);
        }
        this[name] = null;
    }
    setFitView = (...args) => {
        this.map.setFitView(...args);
    }
    clear = () => {
        this.overlaysList.forEach((name) => {
            this.removeOverlay(name);
        })
        this.A_Map_DrawHander.checkedLabelIds.forEach((id) => {
            this.toggleCheck(id, false);
        });
        this.map.clearMap();
        this.A_Map_DrawHander = new A_Map_DrawHander(this.map);
    }
    setCenter = ({ lngGaode, latGaode }) => {
        this.map.setCenter([lngGaode, latGaode], true);
    }
    setSatelliteLayer = (showState) => {
        if (showState) {
            if (!this.satelliteLayer) {
                this.satelliteLayer = new AMap.TileLayer.Satellite();
                this.satelliteLayer.setMap(this.map);
            } else {
                this.satelliteLayer.show();
            }
        } else {
            this.satelliteLayer && this.satelliteLayer.hide();
        }
    }
    setTrafficLayer = (showState) => {
        if (showState) {
            if (!this.trafficLayer) {
                this.trafficLayer = new AMap.TileLayer.Traffic();
                this.trafficLayer.setMap(this.map);
            } else {
                this.trafficLayer.show();
            }
        } else {
            this.trafficLayer && this.trafficLayer.hide();
        }
    }
    initRangingTool = () => {
        this.rangeingTool = initRangingTool(this.map);
        this.rangeingTool.turnOn();
    }
    setLevel = (levelList) => {
        this.map.setFeatures(levelList);
    }
    /* 存在性能问题，使用官方直线提代，后期看看能不能突破，支持轨迹线颜色渐变，效果更佳 */
    drawAllPath_byCanvas = (path, { polylineColorType, valueList, colorList, polylineWidth }) => {
        let getColorByValue = this.getColorByValueBase({ valueList, colorList });
        let baseOption =
        {
            opacity: 1,
            zIndex: 2,
            alwaysRender: true
        };
        let pointPath = path.map(({ lngGaode, latGaode }) => {
            return [lngGaode, latGaode]
        })
        /* 用于setfitView */
        this.polyPathLine = new AMap.Polyline({
            path: pointPath,
        });
        let canvas = document.createElement('canvas');
        this.allPathLayer = new AMap.CustomLayer(canvas, baseOption);
        let _this = this;
        let render = () => {
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return;
            }
            canvas.width = this.map.getSize().width;
            canvas.height = this.map.getSize().height;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.beginPath();
            ctx.lineWidth = polylineWidth * 3;
            ctx.lineCap = 'round';
            ctx.globalAlpha = 0.5;
            if (pointPath.length !== 0) { // 绘制带速度颜色的轨迹 
                for (let i = 0, len = pointPath.length; i < len - 2; i += 1) {
                    let pixel = _this.map.lngLatToContainer(pointPath[i]);
                    let nextPixel = _this.map.lngLatToContainer(pointPath[i + 1]);
                    ctx.moveTo(pixel.x, pixel.y);
                    let grd = ctx.createLinearGradient(pixel.x, pixel.y, nextPixel.x,
                        nextPixel.y);
                    let nowValue = path[i].speed
                    let nextValue = path[i + 1].speed
                    grd.addColorStop(0, polylineColorType === 1 ? '#409eff' : getColorByValue(nowValue));
                    grd.addColorStop(1, polylineColorType === 1 ? '#409eff' : getColorByValue(nextValue));
                    ctx.strokeStyle = grd;
                    ctx.lineTo(nextPixel.x, nextPixel.y);
                }
            }
            ctx.stroke();
        };
        this.allPathLayer.render = render;
        this.allPathLayer.setMap(this.map);
    }
    /* 存在性能问题，使用官方方案提代 */
    drawAllPathPointer_byCanvas = (path) => {
        let baseOption =
        {
            zIndex: 20,
            alwaysRender: true,
            zooms: [2, 30]
        };
        let pointPath = path.map(({ lngGaode, latGaode }) => {
            return [lngGaode, latGaode]
        })
        let option = { ...baseOption };
        let canvas = document.createElement('canvas');
        canvas.width = this.map.getSize().width;
        canvas.height = this.map.getSize().height;
        this.pathPointerLayer = new AMap.CustomLayer(canvas, option);
        let render = () => {
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return;
            }
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            if (pointPath.length !== 0) {
                for (let i = 0, len = pointPath.length; i < len - 1; i += 1) {
                    const pixel = this.map.lngLatToContainer(pointPath[i]);
                    const nextPixel = this.map.lngLatToContainer(pointPath[i + 1]);
                    ctx.beginPath();
                    // 根据渲染像素距离渲染箭头
                    if (Math.abs(nextPixel.x - pixel.x) > 10 || Math.abs(nextPixel.y - pixel.y) > 10) {
                        // 箭头一共需要5个点：起点、终点、中心点、箭头端点1、箭头端点2
                        const midPixel = new AMap.Pixel(
                            (pixel.x + nextPixel.x) / 2,
                            (pixel.y + nextPixel.y) / 2,
                        );
                        // 起点终点距离
                        const distance = (((nextPixel.x - pixel.x) ** 2) +
                            ((nextPixel.y - pixel.y) ** 2)) ** 0.5;
                        // 箭头长度
                        const pointerLong = 4;
                        const aPixel = {};
                        const bPixel = {};
                        if (nextPixel.x - pixel.x === 0) {
                            if (nextPixel.y - pixel.y > 0) {
                                aPixel.x = midPixel.x - (pointerLong * (0.5 ** 0.5));
                                aPixel.y = midPixel.y - (pointerLong * (0.5 ** 0.5));
                                bPixel.x = midPixel.x + (pointerLong * (0.5 ** 0.5));
                                bPixel.y = midPixel.y - (pointerLong * (0.5 ** 0.5));
                            } else if (nextPixel.y - pixel.y < 0) {
                                aPixel.x = midPixel.x - (pointerLong * (0.5 ** 0.5));
                                aPixel.y = midPixel.y + (pointerLong * (0.5 ** 0.5));
                                bPixel.x = midPixel.x + (pointerLong * (0.5 ** 0.5));
                                bPixel.y = midPixel.y + (pointerLong * (0.5 ** 0.5));
                            }
                        } else {
                            const k0 = (
                                (
                                    (-(2 ** 0.5) * distance * pointerLong) +
                                    (2 * (nextPixel.y - pixel.y) * midPixel.y)
                                ) / (2 * (nextPixel.x - pixel.x))) + midPixel.x;
                            const k1 = -((nextPixel.y - pixel.y) / (nextPixel.x - pixel.x));
                            const a = (k1 ** 2) + 1;
                            const b = (2 * k1 * (k0 - midPixel.x)) - (2 * midPixel.y);
                            const c = (((k0 - midPixel.x) ** 2) + (midPixel.y ** 2)) - (
                                pointerLong ** 2);

                            aPixel.y = (-b + (((b * b) - (4 * a * c)) ** 0.5)) / (2 * a);
                            bPixel.y = (-b - (((b * b) - (4 * a * c)) ** 0.5)) / (2 * a);
                            aPixel.x = (k1 * aPixel.y) + k0;
                            bPixel.x = (k1 * bPixel.y) + k0;
                        }
                        ctx.moveTo(aPixel.x, aPixel.y);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = '#eee';
                        ctx.lineTo(midPixel.x, midPixel.y);
                        ctx.lineTo(bPixel.x, bPixel.y);
                        ctx.lineCap = 'round';
                        ctx.stroke();
                    }
                }
            }
        };
        this.pathPointerLayer.render = render;
        this.pathPointerLayer.setMap(this.map);
    }
}