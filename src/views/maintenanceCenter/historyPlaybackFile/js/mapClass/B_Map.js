
import Base_Map from './Base_Map';
import { carIcon, startIcon, endIcon, alarmIcon, stayOnlineIcon, stayOutlineIcon, regionIcon } from './util'
import InfoWindow from "../InfoWindow";
import B_Map_DrawHander from '../drawHanderClass/B_Map_DrawHander';
import gpsConverter from '@/utils/gpsConverter';
export default class B_Map extends Base_Map {
    constructor(map, utilMethods, mapOption) {
        super(map, utilMethods, mapOption);
        this.initData();
        this.B_Map_DrawHander = new B_Map_DrawHander(map);
        this.initDrawProxy();
        this.levelJosn = {
            'bg': [{
                "featureType": "land",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "water",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "green",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off"
                }
            }],
            'building': [{
                "featureType": "building",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off"
                }
            }],
            "road": [{
                "featureType": "road",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off"
                }
            }],
            "point": [{
                "featureType": "districtlabel",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "districtlabel",
                "elementType": "labels.icon",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "poilabel",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "poilabel",
                "elementType": "labels.icon",
                "stylers": {
                    "visibility": "off"
                }
            }]
        }
    }
    initDrawProxy() {
        for (let key in this.B_Map_DrawHander) {
            if (this.B_Map_DrawHander[key] instanceof Function) {
                this[key] = (...arg) => {
                    this.B_Map_DrawHander[key].call(this.B_Map_DrawHander, ...arg);
                }
            }
        }
    }
    drawMarker = (type, info) => {
        let { lngBaidu, latBaidu, direction, areaId } = info;
        switch (type) {
            case 'car':
                if (!this.carMarker) {
                    this.carMarker = new BMap.Marker(new BMap.Point(lngBaidu, latBaidu), {
                        icon: new BMap.Icon(carIcon, new BMap.Size(35, 35)),
                        rotation: direction,
                        zIndex: 100,
                    });
                    this.map.addOverlay(this.carMarker);
                } else {
                    this.carMarker.setRotation(direction);
                    this.carMarker.setPosition(new BMap.Point(lngBaidu, latBaidu));
                }
                break;
            case 'start':
                this.startMarker = new BMap.Marker(new BMap.Point(lngBaidu, latBaidu), {
                    icon: new BMap.Icon(startIcon, new BMap.Size(40, 40)),
                    offset: new BMap.Size(10, 10)
                })
                this.map.addOverlay(this.startMarker)
                break;
            case 'end':
                this.endMarker = new BMap.Marker(new BMap.Point(lngBaidu, latBaidu), {
                    icon: new BMap.Icon(endIcon, new BMap.Size(40, 40)),
                    offset: new BMap.Size(10, 10)
                })
                this.map.addOverlay(this.endMarker)
                break;
        }
        if (/^(focus\-)/.test(type)) {
            this.removeOverlay('focusMarker');
            let focusType = type.split('-')[1];
            let focusIcon = (focusType === 'stay') ? `stay${stayType === 0 ? 'Online' : 'Outline'}` : focusType;
            this.focusMarker = new BMap.Marker(
                new BMap.Point(lngBaidu, latBaidu),
                {
                    icon: new BMap.Icon({ 'alarm': alarmIcon, 'stayOnline': stayOnlineIcon, 'stayOutline': stayOutlineIcon, 'region': regionIcon }[focusIcon], new BMap.Size(30, 30)),
                });
            this.focusMarker.addEventListener("click", () => {
                this.drawInfoWindow({ type: focusType, data: info });
                this.toggleCheck(areaId, true)
            });
            this.map.addOverlay(this.focusMarker);
        }
    }
    drawAllPath = (path, { polylineColorType, valueList, colorList, polylineWidth }) => {
        let getColorByValue = this.getColorByValueBase({ valueList, colorList });
        let totalPoints = path.map(({ lngBaidu, latBaidu }) => {
            return new BMap.Point(lngBaidu, latBaidu)
        })
        this.polyPathLine = new AMap.Polyline({
            path: totalPoints,
        });
        let _this = this;
        let update = function () {
            const ctx = this.canvas.getContext('2d');
            if (!ctx) {
                return;
            }
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.globalAlpha = 0.5;
            ctx.lineCap = 'round';
            ctx.lineWidth = polylineWidth * 3;
            if (totalPoints.length !== 0) { // 绘制带速度颜色的轨迹 
                for (let i = 0, len = totalPoints.length; i < len - 2; i += 1) {
                    let pixel = _this.map.pointToPixel(totalPoints[i]);
                    let nextPixel = _this.map.pointToPixel(totalPoints[i + 1]);
                    ctx.beginPath();
                    ctx.moveTo(pixel.x, pixel.y);
                    let grd = ctx.createLinearGradient(pixel.x, pixel.y, nextPixel.x,
                        nextPixel.y);
                    let nowValue = path[i].speed
                    let nextValue = path[i + 1].speed
                    grd.addColorStop(0, polylineColorType === 1 ? '#409eff' : getColorByValue(nowValue));
                    grd.addColorStop(1, polylineColorType === 1 ? '#409eff' : getColorByValue(nextValue));
                    ctx.strokeStyle = grd;
                    ctx.lineTo(nextPixel.x, nextPixel.y);
                    ctx.stroke();
                }
            }
        }
        this.allPathLayer = new BMap.CanvasLayer({
            update,
            paneName: 'vertexPane',
            zIndex: 90
        });
        this.map.addOverlay(this.allPathLayer);
    }
    drawAllPathPointer = (path) => {
        let totalPoints = path.map(({ lngBaidu, latBaidu }) => {
            return new BMap.Point(lngBaidu, latBaidu)
        })
        let _this = this;
        let update = function () {
            const ctx = this.canvas.getContext('2d');
            if (!ctx) {
                return;
            }
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.globalAlpha = 0.5;
            if (totalPoints.length !== 0) {
                for (let i = 0, len = totalPoints.length; i < len - 1; i += 1) {
                    const pixel = _this.map.pointToPixel(totalPoints[i]);
                    const nextPixel = _this.map.pointToPixel(totalPoints[i + 1]);
                    ctx.beginPath();
                    // 根据渲染像素距离渲染箭头
                    if (Math.abs(nextPixel.x - pixel.x) > 10 || Math.abs(nextPixel.y - pixel
                        .y) > 10) {
                        // 箭头一共需要5个点：起点、终点、中心点、箭头端点1、箭头端点2
                        const midPixel = new BMap.Pixel(
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
                            } else {
                                // continue;
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
        }
        this.pathPointerLayer = new BMap.CanvasLayer({
            update,
            paneName: 'vertexPane',
            zIndex: 100
        });
        this.map.addOverlay(this.pathPointerLayer);
    }
    drawInfoWindow = async (renderWindowInfo) => {
        let { type, data } = renderWindowInfo;
        let content = await this.renderWindowStr(type, { ...data, position: [data.lngBaidu, data.latBaidu] });
        checkKeys(this.infoWindow) && this.infoWindow.unload();
        this.infoWindow = new InfoWindow(new BMap.Point(data.lngBaidu, data.latBaidu), content, this.utilMethods, data.areaId);
        this.map.addOverlay(this.infoWindow);
    }
    drawGpsMarkers = (historyTrajectoryTempData) => {
        this.gpsMarkers = new BMap.PointCollection(
            historyTrajectoryTempData.map(({ lngBaidu, latBaidu, collectTime, speed }) => {
                let bPoint = new BMap.Point(lngBaidu, latBaidu);
                bPoint.data = { collectTime, speed };
                return bPoint;
            }),
            { shape: BMAP_POINT_SHAPE_SQUARE, size: BMAP_POINT_SIZE_SMALL, color: '#1296db' }
        );
        this.gpsMarkers.addEventListener("click", async e => {
            let {
                data,
                lng,
                lat
            } = e.point;
            this.drawInfoWindow({ type: 'gps', data: { ...data, lngBaidu: lng, latBaidu: lat } });
        });
        this.map.addOverlay(this.gpsMarkers);
    }
    drawAlarmMarkers = (alarmList) => {
        this.alarmMarkers = alarmList.map(({ lngBaidu, latBaidu, speed, alarmTimeFormat, alarmClassName, alarmGrade, driverName, alarmTypeName }) => {
            let bPoint = new BMap.Point(lngBaidu, latBaidu);
            let data = { speed, alarmTimeFormat, alarmClassName, alarmGrade, driverName, alarmTypeName };
            let marker = new BMap.Marker(bPoint, {
                icon: new BMap.Icon(alarmIcon, new BMap.Size(40, 40)),
                offset: new BMap.Size(10, 10)
            })
            marker.addEventListener("click", async e => {
                let {
                    lng,
                    lat
                } = e.point;
                this.drawInfoWindow({ type: 'alarm', data: { ...data, lngBaidu: lng, latBaidu: lat } });
            });
            this.map.addOverlay(marker);
            return marker;
        });
    }
    drawStayMarkers = (stayList) => {
        this.stayMarkers = stayList.map(({ lngBaidu, latBaidu, startTimeFormat, endTimeFormat, stayTimeString, stayType, address, endAddress }) => {
            let bPoint = new BMap.Point(lngBaidu, latBaidu);
            let data = { startTimeFormat, endTimeFormat, stayTimeString, stayType, address, endAddress };
            let marker = new BMap.Marker(bPoint, {
                icon: new BMap.Icon(stayType ? stayOutlineIcon : stayOnlineIcon, new BMap.Size(40, 40)),
                offset: new BMap.Size(10, 10)
            })
            marker.addEventListener("click", async e => {
                let {
                    lng,
                    lat
                } = e.point;
                this.drawInfoWindow({ type: 'stay', data: { ...data, lngBaidu: lng, latBaidu: lat } });
            });
            this.map.addOverlay(marker);
            return marker;
        });
    }
    drawRegionMarkers = (regionList) => {
        this.regionMarkers = regionList.map(({ lngBaidu, latBaidu, areaName, areaId, driveInDateString, driveOutDateString, lengthOfStay, driveInLocation }) => {
            let bPoint = new BMap.Point(lngBaidu, latBaidu);
            let data = { areaId, areaName, driveInDateString, driveOutDateString, lengthOfStay, driveInLocation };
            let marker = new BMap.Marker(bPoint, {
                icon: new BMap.Icon(regionIcon, new BMap.Size(40, 40)),
                offset: new BMap.Size(10, 10)
            })
            marker.addEventListener("click", async e => {
                let {
                    lng,
                    lat
                } = e.point;
                this.drawInfoWindow({ type: 'region', data: { ...data, lngBaidu: lng, latBaidu: lat } });
                setTimeout(() => {
                    this.toggleCheck(data.areaId, true);
                }, 100)
            });
            this.map.addOverlay(marker);
            return marker;
        });
    }
    drawTrajectoryLine = (historyTrajectoryTempData) => {
        return new Promise(async (resolve) => {
            if (!Base_Map.trajectoryCorrection_Gaode) {
                await this.trajectoryCorrection(historyTrajectoryTempData).catch(() => { });
            }
            if (Base_Map.trajectoryCorrection_Gaode && Base_Map.trajectoryCorrection_Gaode.length > 0) {
                this.trajectoryLine = new BMap.Polyline(
                    Base_Map.trajectoryCorrection_Gaode.map(({ lngGaode, latGaode }) => {
                        let { lng, lat } = gpsConverter.gaode_baidu(lngGaode, latGaode);
                        return new BMap.Point(lng, lat);
                    }),
                    {
                        strokeColor: "rgb(206, 36, 36)",
                        strokeWeight: 7,
                        lineJoin: "round",
                        strokeOpacity: 0.6,
                    }
                );
                this.map.addOverlay(this.trajectoryLine);
            }
            resolve();
        });
    }
    setFitView = (...arg) => {
        this.map.setFitView(...arg);
    }
    setSatelliteLayer = (showState) => {
        if (showState) {
            this.map.setMapType(BMAP_SATELLITE_MAP);

        } else {
            this.map.setMapType(BMAP_NORMAL_MAP);
        }
    }
    setTrafficLayer = (showState) => {
        if (showState) {
            if (!this.trafficControl) {
                this.trafficControl = new BMapLib.TrafficControl({
                    showPanel: false
                });      
            }
            this.map.addControl(this.trafficControl);
            this.trafficControl.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT);  
            this.trafficControl.showTraffic();
        } else {
            this.trafficControl && this.trafficControl.hideTraffic();
        }
    }
    setLevel = (levelList) => {
        let JosnList = [];
        ["bg", "point", "road", "building"].forEach((type) => {
            if (!levelList.includes(type)) {
                JosnList = [...JosnList, ...this.levelJosn[type]];
            }
        });
        this.map.setMapStyleV2({
            styleJson: JosnList
        });
    }
    initRangingTool = () => {
        this.rangeingTool = new BMapLib.DistanceTool(this.map);
        this.rangeingTool.open();
    }
    clear = () => {
        this.overlaysList.forEach((name) => {
            this.removeOverlay(name);
        })
        this.B_Map_DrawHander.checkedLabelIds.forEach((id) => {
            this.toggleCheck(id, false);
        });
        this.map.clearOverlays();
        this.B_Map_DrawHander = new B_Map_DrawHander(this.map);
    }
    setCenter = ({ lngBaidu, latBaidu }) => {
        setTimeout(() => {
            this.map.setCenter(new BMap.Point(lngBaidu, latBaidu));
        }, 50)
    }
    clearInfoWindow = () => {
        checkKeys(this.infoWindow) && this.infoWindow.unload();
    }
    hideAllPathPointer = () => {
        if (this.customLayerPathPoint) {
            this.map.removeTileLayer(this.customLayerPathPoint);
            this.customLayerPathPoint = null;
        }
    }
    removeOverlay = (name) => {
        if (!checkKeys(this[name])) {
            return;
        }
        /* 图层销毁方案 */
        if (/Layer$/.test(name)) {
            // if (name === 'allPathLayer') {
            //     this.removeOverlay('polyPathLine');
            // }
            this.map.removeTileLayer(this[name]);
            /* 海量点销毁方案 */
        } else if (/Markers$/.test(name)) {
            if (name === 'gpsMarkers') {
                this.map.removeOverlay(this[name]);
            } else {
                /* 除了gps点，其他的都没用海量点，原因是不支持自定义icon，但是可以使用自定义图层，后面可以进行优化 */
                this[name].forEach((overlay) => {
                    this.map.removeOverlay(overlay);
                });
            }
            /* 覆盖物，矢量图层销毁方案 */
        } else if (/(Marker|Line)$/.test(name)) {
            this.map.removeOverlay(this[name]);
        } else if (name === 'infoWindow') {
            this.infoWindow.unload();
        } else if (name === 'rangeingTool') {
            debugger
            this.rangeingTool.close();
        }
        this[name] = null;
    }
}