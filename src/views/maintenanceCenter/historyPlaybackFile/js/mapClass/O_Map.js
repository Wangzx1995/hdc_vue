import {
    carIcon,
    startIcon,
    endIcon,
    alarmIcon,
    stayOnlineIcon,
    directionIcon,
    regionIcon,
} from "./util";
import { labelMarkerIconMap } from "@/utils/global";
import TileLayer from "ol/layer/Tile.js";
import VectorSource from "ol/source/Vector";
import * as filters from "@/filters/filters";
import { Style, Stroke, Icon, Text } from "ol/style";
import { LineString, MultiLineString, Point, Circle, Polygon } from "ol/geom";
import TileGrid from "ol/tilegrid/TileGrid";
import { Map, View, Feature } from "ol";
import Select from "ol/interaction/Select.js";
import WebGLPointsLayer from "ol/layer/WebGLPoints";
import VectorLayer from "ol/layer/Vector";
import moment from "moment";
import Overlay from "ol/Overlay.js";
import Base_Map from "./Base_Map";
import { fromLonLat, transformExtent } from "ol/proj";
import { TileImage, XYZ } from "ol/source";
import measure from "./measure";
import { getVectorContext } from "ol/render.js";
import gcj02Mecator from "./gcj02Mecator";
import bd09Mecator from "./bd09Mecator";
import { getAddressSingle } from "@/utils/getMapLocation";
import { lineString, bboxClip } from "@turf/turf";
import vue from "vue";
export default class O_Map extends Base_Map {
    constructor(mapId, playInfo, utilMethods, colorList) {
        /* this.playInfo = {
            isPlay: false,
            path: [],
            timeTotal: 0,
            timeGap: 0,
            playGap: 1,
            speed: 8,
            frontIndex: 0,
            lineF: null,
            playMode:1,
            playInfo:'normal'
        }; */
        super();
        this.toggleCheck = utilMethods.toggleCheck;
        this.makerClick = utilMethods.makerClick;
        //和页面数据互通
        this.playInfo = playInfo;
        //常量
        this.nowMapType = ["gaode_base", "n_route"];
        this.labelMarkerMap = {};
        this.labelShapeMap = {};
        this.checkedLabelIds = [];
        this.carMarkerPoint_clone = null;
        this.routeLine_clone = null;
        this.gpsMarkers = new VectorSource();
        //图层组件初始化
        this.preInitLayer();
        this.initMap(mapId);
        //图层显示层级自下而上
        this.initRouteLineLayer(); //0 轨迹图层
        this.initGpsMakersLayer(colorList); //1 GPS点图层
        this.initRouteTrakLineLayer(); //2 轨迹纠偏线图层
        this.initMarkerLayer(); //3 起点，终点
        this.initMarkerTagLayer(); //3 区域点
        this.initAlarmMakersLayer(); // 4 报警海量点
        this.initStayMakersLayer(); // 4 停留点
        this.initRegionMakersLayer(); // 4 区域进出点
        this.initMarkerPlayLayer(); //5 小车播放点，聚焦点
        this.initInfoWindow();
        this.initClickSelect();
    }
    //initapi
    initInfoWindow() {
        let infoWindow = new Overlay({
            element: undefined,
            positioning: "bottom-center",
        });
        this.infoWindow = infoWindow;
        this.map.addOverlay(infoWindow);
        this.infoWindowShow = false;
    }
    //注册点击事件
    initClickSelect() {
        let selectClick = new Select();
        this.map.addInteraction(selectClick);
        selectClick.on("select", async (e) => {
            let features = e.target.getFeatures().getArray();
            if (features.length > 0) {
                let coor = features[0].getGeometry().getCoordinates();
                let type = features[0].values_.name;
                let info = features[0].values_.info;
                if (type === "stay") {
                    let startAddress = await getAddressSingle([
                        info.startLngGaode,
                        info.startLatGaode,
                    ]);
                    let endAddress = await getAddressSingle([
                        info.endLngGaode,
                        info.endLatGaode,
                    ]);
                    let parkingDuration = filters.formatSeconds(
                        info.parkingDuration
                    );
                    Object.assign(info, {
                        startAddress,
                        endAddress,
                        parkingDuration,
                    });
                }
                this.drawInfoWindow({ type, data: info, position: coor });
                this.makerClick(info);
            }
        });
    }
    //百度地图图层
    initBaidumap(type) {
        var resolutions = [];
        var maxZoom = 18;
        // 计算百度使用的分辨率
        for (var i = 0; i <= maxZoom + 1; i++) {
            resolutions[i] = Math.pow(2, maxZoom - i);
        }
        var tilegrid = new TileGrid({
            origin: [0, 0], // 设置原点坐标
            resolutions: resolutions, // 设置分辨率,
            tileSize: [256, 256],
        });
        var baiduSource = new TileImage({
            projection: bd09Mecator,
            tileGrid: tilegrid,
            tilePixelRatio: 2,
            tileUrlFunction: function (tileCoord, pixelRatio, proj) {
                let z = tileCoord[0];
                let x = tileCoord[1];
                let y = -tileCoord[2] - 1;
                if (x < 0) x = "M" + -x;
                if (y < 0) y = "M" + -y;
                let num = Math.ceil(Math.random() * 3);
                let url = "";
                switch (type) {
                    case "base":
                        url = `https://maponline${num}.bdimg.com/tile/?qt=vtile&styles=pl&scaler=2&udt=20230818&from=jsapi3_0&x=${x}&y=${y}&z=${z}`;
                        break;
                    case "weixin":
                        url = `https://maponline${num}.bdimg.com/starpic/?qt=satepc&u=x=${x};y=${y};z=${z};v=009;type=sate&fm=46&udt=20231009`;
                        break;
                    case "route":
                        // url = `https://traffic.map.baidu.com/traffic/?qt=vtraffic&z=${z}&x=${x}&y=${y}&udt=2023224&fn=BMap.cbkBMAP_CUSTOM_LAYER_1_default_1622_362_13_13`
                        url = `http://itsmap2.baidu.com/traffic/TrafficTileService?time=16969244733310&label=web2D&v=016&level=${z}&x=${x}&y=${y}&scaler=1`;
                        break;
                }
                return url;
            },
        });
        let mapLayer = new TileLayer({
            visible: false,
            source: baiduSource,
            id: `baidu_${type}`,
        });
        return mapLayer;
    }
    //初始化图层
    preInitLayer() {
        this.gaode_base = new TileLayer({
            visible: true,
            source: new XYZ({
                wrapX: true,
                projection: gcj02Mecator,
                url: "https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&scl=1&ltype=7&x={x}&y={y}&z={z}",
            }),
            id: "gaode_base",
        });
        this.gaode_route = new TileLayer({
            visible: false,
            source: new XYZ({
                projection: gcj02Mecator,
                url:
                    "http://tm.amap.com/trafficengine/mapabc/traffictile?v=1.0&;t=1&x={x}&y={y}&z={z}&&t=" +
                    this.getLongTime(),
            }),
            id: "gaode_route",
        });
        this.gaode_weixin = new TileLayer({
            visible: false,
            source: new XYZ({
                projection: gcj02Mecator,
                url: "https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}",
            }),
            id: "gaode_weixin",
        });
        this.baidu_base = this.initBaidumap("base");
        this.baidu_weixin = this.initBaidumap("weixin");
        this.baidu_route = this.initBaidumap("route");
        this.layerArray = [
            this.gaode_base,
            this.gaode_weixin,
            this.gaode_route,
            this.baidu_base,
            this.baidu_weixin,
            this.baidu_route,
        ];
        this.baseLayerArray = [
            this.gaode_base,
            this.gaode_weixin,
            this.baidu_base,
            this.baidu_weixin,
        ];
    }
    initMap(mapId) {
        this.map = new Map({
            controls: [],
            target: mapId,
            layers: this.layerArray,
            view: new View({
                center: fromLonLat([121.437663, 31.181022]), //地图初始中心点
                projection: "EPSG:3857",
                zoom: 6,
                constrainResolution: true,
                //2.关闭无级缩放地图
                smoothResolutionConstraint: false,
                // constrainResolution: true,
                maxZoom: 18,
                // smoothResolutionConstraint: false
            }),
        });
    }
    //点图层(起点，终点)
    initMarkerLayer() {
        this.singMarker = new VectorSource();
        this.singMarkerLayer = new VectorLayer({
            source: this.singMarker,
            zIndex: 3,
            // declutter: true
        });
        this.map.addLayer(this.singMarkerLayer);
    }
    initMarkerTagLayer() {
        this.tagMarker = new VectorSource();
        this.tagMarkerLayer = new VectorLayer({
            source: this.tagMarker,
            zIndex: 3,
            // declutter: true
        });
        this.map.addLayer(this.tagMarkerLayer);
    }
    //小车播放层（小车图标）
    initMarkerPlayLayer() {
        this.playMarker = new VectorSource();
        this.playMarkerLayer = new VectorLayer({
            visible: true,
            source: this.playMarker,
            zIndex: 5,
        });
        this.map.addLayer(this.playMarkerLayer);
    }
    //轨迹图层
    initRouteLineLayer() {
        this.routeLine = new VectorSource({});
        this.routeLineLayer = new VectorLayer({
            source: this.routeLine,
            zIndex: 0,
            declutter: true,
        });
        this.map.addLayer(this.routeLineLayer);
    }
    //纠偏线图层
    initRouteTrakLineLayer() {
        this.routeTrakLine = new VectorSource({});
        this.routeTrakLineLayer = new VectorLayer({
            source: this.routeTrakLine,
            zIndex: 2,
            declutter: true,
        });
        this.map.addLayer(this.routeTrakLineLayer);
    }
    //GPS海量点图层
    initGpsMakersLayer(colorList) {
        if (this.gpsMarkersLayer) {
            this.map.removeLayer(this.gpsMarkersLayer);
            this.gpsMarkersLayer = null;
        }
        this.gpsMarkersLayer = new WebGLPointsLayer({
            zIndex: 1,
            source: this.gpsMarkers,
            visible: false,
            style: {
                symbol: {
                    color: [
                        "match",
                        ["get", "locateType"],
                        0,
                        colorList[1],
                        1,
                        colorList[2],
                        2,
                        colorList[3],
                        3,
                        colorList[4],
                        4,
                        colorList[5],
                        5,
                        colorList[6],
                        6,
                        colorList[7],
                        7,
                        colorList[8],
                        colorList[0],
                    ],
                    symbolType: "circle",
                    size: 12,
                    opacity: 1,
                },
            },
        });
        this.map.addLayer(this.gpsMarkersLayer);
    }
    //长时间停留点图层
    initStayMakersLayer() {
        this.stayMarkers = new VectorSource();
        this.stayMarkersLayer = new WebGLPointsLayer({
            zIndex: 4,
            source: this.stayMarkers,
            style: {
                symbol: {
                    symbolType: "image",
                    size: 30,
                    opacity: 1,
                    src: stayOnlineIcon,
                    color: "white",
                },
            },
        });
        this.map.addLayer(this.stayMarkersLayer);
    }
    //报警点图层
    initAlarmMakersLayer() {
        this.alarmMarkers = new VectorSource();
        this.alarmMarkersLayer = new WebGLPointsLayer({
            zIndex: 4,
            source: this.alarmMarkers,
            style: {
                symbol: {
                    symbolType: "image",
                    size: 20,
                    // opacity: 0.5,
                    src: alarmIcon,
                    color: "white",
                },
            },
        });
        this.map.addLayer(this.alarmMarkersLayer);
    }
    //进出区域图层
    initRegionMakersLayer() {
        this.regionMarkers = new VectorSource();
        this.regionMarkersLayer = new WebGLPointsLayer({
            zIndex: 4,
            source: this.regionMarkers,
            style: {
                symbol: {
                    symbolType: "image",
                    size: 20,
                    opacity: 1,
                    src: regionIcon,
                },
            },
        });
        this.map.addLayer(this.regionMarkersLayer);
    }
    toggleNowMap() {
        let baseType = this.nowMapType[0];
        this.layerArray.forEach((layer) => {
            if (layer.values_.id === baseType) {
                layer.setVisible(true);
            } else {
                layer.setVisible(false);
            }
        });
        let routeif = this.nowMapType[1].split("_")[0];
        let baseMap = baseType.split("_")[0];
        if (routeif === "n") {
            if (baseMap === "gaode") {
                this.gaode_route.setVisible(false);
            } else {
                this.baidu_route.setVisible(false);
            }
        } else {
            if (baseMap === "baidu") {
                this.baidu_route.setVisible(true);
            } else {
                this.gaode_route.setVisible(true);
            }
        }
    }
    measure() {
        measure.measure(this.map, "LineString");
    }
    changBaseMap(type, route) {
        if (typeof type === "string") {
            let baseType = this.nowMapType[0].split("_")[1];
            let res = `${type}_${baseType}`;
            vue.set(this.nowMapType, 0, res);
        }
        if (typeof type === "boolean") {
            let arr = this.nowMapType[0].split("_");
            arr[1] = arr[1] === "base" ? "weixin" : "base";
            let string = arr.join("_");
            vue.set(this.nowMapType, 0, string);
        }
        if (route !== undefined) {
            let res = this.nowMapType[1].split("_");
            res[0] = res[0] === "n" ? "y" : "n";
            vue.set(this.nowMapType, 1, res.join("_"));
        }
        debugger;
        this.toggleNowMap();
    }
    // 如果前后两个点的经纬度一样，则过滤掉一个点，无需绘制
    filterGps(path) {
        if (!path || !path.length) {
            return [];
        }
        // forEach 和filter虽然代码写起来简单一些，但是相当于整个GPS数组循环了两遍，无需这么写
        path.forEach((_, index, array) => {
            if (index === 0) {
                return;
            }
            let front = array[index - 1];
            let target = array[index];
            if (target.lng === front.lng && target.lat === front.lat) {
                array[index - 1].flag = "filter";
            }
        });
        let result = path.filter((item) => {
            return item.flag !== "filter";
        });
        //只有一个点的时候会框架会报错
        if (result.length === 1) {
            result.push(result[0]);
        }
        return result;
    }
    getPointExtent() {
        let view = this.map.getView();
        let mapsize = this.map.getSize();
        return view.calculateExtent(mapsize);
    }
    getPointsByLine(coords) {
        let geometry = new LineString(coords).transform(
            "EPSG:4326",
            "EPSG:3857"
        );
        coords = geometry.getCoordinates();
        let this_ = this;
        let styles = [];
        let distance_ = 75; //首个点放置在距离起点1/2间隔的位置
        let pix_start = this_.map.getPixelFromCoordinate(coords[0]);
        let pix_end;
        for (let i = 1; i < coords.length; i++) {
            let coord_, coord_pix;
            let style_;
            pix_end = this_.map.getPixelFromCoordinate(coords[i]);
            let dis_start2end = Math.sqrt(
                Math.pow(pix_start[0] - pix_end[0], 2) +
                    Math.pow(pix_start[1] - pix_end[1], 2)
            ); //计算收尾在屏幕上的距离
            if (dis_start2end > distance_) {
                //距离大于间隔
                //计算距离开始点位的像素值
                coord_pix = [
                    (distance_ * (pix_end[0] - pix_start[0])) / dis_start2end +
                        pix_start[0],
                    (distance_ * (pix_end[1] - pix_start[1])) / dis_start2end +
                        pix_start[1],
                ];
                //计算经纬度
                coord_ = this_.map.getCoordinateFromPixel(coord_pix);
                //生成样式
                style_ = new Style({
                    //箭头点的位置
                    geometry: new Point(coord_),
                    //箭头点的样式
                    image: new Icon({
                        src: directionIcon,
                        opacity: 0.8,
                        anchor: [0.5, 0.5],
                        rotateWithView: false,
                        // 读取 rotations 中计算存放的方向信息
                        rotation:
                            Math.PI +
                            Math.atan2(
                                pix_end[1] - pix_start[1],
                                pix_end[0] - pix_start[0]
                            ),
                        scale: 0.5,
                    }),
                });
                //下次循环开始点为当前点
                pix_start = coord_pix;
                distance_ = 150;
                i--;
            } else if (dis_start2end == distance_) {
                //距离等于间隔
                //生成样式
                style_ = new Style({
                    //箭头点的位置
                    geometry: new Point(coords[i]),
                    //箭头点的样式
                    image: new Icon({
                        src: directionIcon,
                        rotateWithView: true,
                        rotation:
                            Math.PI +
                            Math.atan2(
                                pix_end[1] - pix_start[1],
                                pix_end[0] - pix_start[0]
                            ),
                        scale: 0.5,
                        // imgSize:[this.style.line_width,this.style.line_width]
                    }),
                });
                pix_start = pix_end;
                distance_ = 150;
            } else {
                //距离小于间隔
                distance_ = distance_ - dis_start2end;
                pix_start = pix_end;
            }
            style_ && styles.push(style_);
        }
        return styles;
    }
    getPointsStyle(geometry, that, polylineShowType, resolution) {
        let styles = [];
        if (polylineShowType === 2) {
            let extent = transformExtent(
                that.getPointExtent(),
                "EPSG:3857",
                "EPSG:4326"
            );
            let coord = geometry
                .clone()
                .transform("EPSG:3857", "EPSG:4326")
                .getCoordinates();
            let line_clip_arr = bboxClip(lineString(coord), extent);
            if (line_clip_arr && line_clip_arr.geometry) {
                if (line_clip_arr.geometry.type == "LineString") {
                    let style_ = that.getPointsByLine(
                        line_clip_arr.geometry.coordinates,
                        resolution
                    );
                    styles.push(...style_);
                } else if (line_clip_arr.geometry.type == "MultiLineString") {
                    line_clip_arr.geometry.coordinates.forEach((coords) => {
                        let style_ = that.getPointsByLine(coords, resolution);
                        styles.push(...style_);
                    });
                }
            }
        }
        return styles;
    }
    addPath(
        path,
        {
            polylineColorType,
            valueList,
            colorList,
            polylineWidth,
            polylineShowType,
            locateType,
        },
        ifLast
    ) {
        let that = this;
        this.playInfo.path.push(...path);
        let filterGps = this.filterGps(path);
        let gps = filterGps.map(({ lng, lat }) => {
            return [lng, lat];
        });
        if (!this.routeLine_clone) {
            this.routeLine_clone = new LineString(gps);
        } else {
            this.routeLine_clone.setCoordinates([
                ...this.routeLine_clone.getCoordinates(),
                ...gps,
            ]);
        }
        //蓝色的话绘制两条线，已经走过的
        if (polylineColorType === 1) {
            if (ifLast) {
                let styleFunction_last = function (feature, resolution) {
                    const styles = [
                        new Style({
                            stroke: new Stroke({
                                color:
                                    polylineShowType === 1 ? "gray" : "#409eff",
                                width: polylineWidth * 2,
                            }),
                        }),
                    ];
                    if (that.playInfo.isPlay) {
                        return styles;
                    }
                    let style = that.getPointsStyle(
                        that.routeLine_clone,
                        that,
                        polylineShowType,
                        resolution
                    );
                    styles.push(...style);
                    return styles;
                };
                this.routeLine.getFeatures()[0].setStyle(styleFunction_last);
                return;
            }
            let styleFunction = function (feature, resolution) {
                const styles = [
                    new Style({
                        stroke: new Stroke({
                            color: polylineShowType === 1 ? "gray" : "#409eff",
                            width: polylineWidth * 2,
                        }),
                    }),
                ];
                return styles;
            };
            if (this.routeLine.getFeatures.length === 0) {
                let featureLine = new Feature(new LineString(gps));
                featureLine.setStyle(styleFunction);
                this.routeLine.addFeature(featureLine);
            } else {
                this.routeLine
                    .getFeatures()[0]
                    .getGeometry()
                    .appendCoordinate(gps);
            }
            this.map
                .getView()
                .fit(this.routeLine.getExtent(), this.map.getSize());
        } else {
            if (ifLast) {
                let styleFunction_last = function (feature, resolution) {
                    const styles = [
                        new Style({
                            stroke: new Stroke({
                                color: colorList[feature.id_],
                                width: polylineWidth * 2,
                            }),
                        }),
                    ];
                    if (that.playInfo.isPlay) {
                        return styles;
                    }
                    let style = that.getPointsStyle(
                        that.routeLine_clone,
                        that,
                        polylineShowType,
                        resolution
                    );
                    styles.push(...style);
                    return styles;
                };
                let featureList = this.routeLine.getFeatures();
                featureList.forEach((feature, index) => {
                    if (index === 0) {
                        feature.setStyle(styleFunction_last);
                        feature.changed();
                    }
                });
                return;
            }
            let lineList = this.casPath(filterGps, valueList);

            let styleFunction = function (feature, resolution) {
                const styles = [
                    new Style({
                        stroke: new Stroke({
                            color: colorList[feature.id_],
                            width: polylineWidth * 2,
                        }),
                    }),
                ];
                return styles;
            };
            lineList.forEach((muLine, index) => {
                let feature = null;
                if (!this.routeLine.getFeatureById(index)) {
                    feature = new Feature(new MultiLineString(muLine));
                    feature.setId(index);
                    this.routeLine.addFeature(feature);
                } else {
                    feature = this.routeLine.getFeatureById(index);
                    let coordinates = feature.getGeometry().getCoordinates();
                    coordinates = [...coordinates, ...muLine];
                    feature.getGeometry().setCoordinates(coordinates);
                }
                feature.setStyle(styleFunction);
            });
            this.routeLine.changed();
            this.map
                .getView()
                .fit(this.routeLine.getExtent(), this.map.getSize());
        }
    }
    addAllPath(
        path,
        {
            polylineColorType,
            valueList,
            colorList,
            polylineWidth,
            polylineShowType,
        },
        color
    ) {
        let that = this;
        if (polylineColorType === 1) {
            let feature = new Feature(
                new LineString(
                    path.map(({ lng, lat }) => {
                        return [lng, lat];
                    })
                )
            );
            let styleFunction_last = function (feature, resolution) {
                const styles = [
                    new Style({
                        stroke: new Stroke({
                            color: color,
                            width: polylineWidth * 2,
                        }),
                    }),
                ];
                if (that.playInfo.isPlay) {
                    return styles;
                }
                let style = that.getPointsStyle(
                    that.routeLine_clone,
                    that,
                    polylineShowType,
                    resolution
                );
                styles.push(...style);
                return styles;
            };
            feature.setStyle(styleFunction_last);
            this.routeLine.addFeature(feature);
        } else {
            let lineList = this.casPath(path, valueList);
            let styleFunction = function (feature, resolution) {
                const styles = [
                    new Style({
                        stroke: new Stroke({
                            color: colorList[feature.id_],
                            width: polylineWidth * 2,
                        }),
                    }),
                ];
                return styles;
            };
            let styleFunction_last = function (feature, resolution) {
                const styles = [
                    new Style({
                        stroke: new Stroke({
                            color: colorList[feature.id_],
                            width: polylineWidth * 2,
                        }),
                    }),
                ];
                if (that.playInfo.isPlay) {
                    return styles;
                }
                let style = that.getPointsStyle(
                    that.routeLine_clone,
                    that,
                    polylineShowType,
                    resolution
                );
                styles.push(...style);
                return styles;
            };
            lineList.forEach((muLine, index) => {
                let feature = new Feature(new MultiLineString(muLine));
                feature.setId(index);
                this.routeLine.addFeature(feature);
                if (index === 0) {
                    feature.setStyle(styleFunction_last);
                } else {
                    feature.setStyle(styleFunction);
                }
            });
        }
        this.routeLine.changed();
        this.map.getView().fit(this.routeLine.getExtent(), this.map.getSize());
    }
    drawMarker = (type, info) => {
        switch (type) {
            case "car":
                let carStyle = new Style({
                    image: new Icon({
                        src: carIcon,
                        scale: 1,
                        rotateWithView: true,
                        rotation: this.cashd(info.direction),
                    }),
                    zIndex: 10,
                });
                if (!this.carMarkerPoint) {
                    let carMarkerPoint = new Feature({
                        geometry: new Point([info.lng, info.lat]),
                    });
                    carMarkerPoint.setStyle(carStyle);
                    this.carMarkerPoint = carMarkerPoint;
                    this.playMarker.addFeature(this.carMarkerPoint);
                    this.playMarker.changed();
                } else {
                    this.carMarkerPoint
                        .getGeometry()
                        .setCoordinates([info.lng, info.lat]);
                    this.carMarkerPoint.setStyle(carStyle);
                    this.carMarkerPoint.changed();
                }
                break;
            case "start":
                if (this.startMarkerPoint) {
                    return;
                }
                let startMarkerPoint = new Feature({
                    geometry: new Point([info.lng, info.lat]),
                });
                startMarkerPoint.setStyle(
                    new Style({
                        image: new Icon({
                            src: startIcon,
                            anchor: [14, 40],
                            anchorXUnits: "pixels",
                            anchorYUnits: "pixels",
                        }),
                        zIndex: 1,
                    })
                );
                this.startMarkerPoint = startMarkerPoint;
                this.singMarker.addFeature(this.startMarkerPoint);
                this.singMarker.changed();
                break;
            case "end":
                let endMarkerPoint = new Feature({
                    geometry: new Point([info.lng, info.lat]),
                });
                endMarkerPoint.setStyle(
                    new Style({
                        image: new Icon({
                            src: endIcon,
                            anchor: [14, 40],
                            anchorXUnits: "pixels",
                            anchorYUnits: "pixels",
                        }),
                        zIndex: 2,
                    })
                );
                this.endMarkerPoint = endMarkerPoint;
                this.singMarker.addFeature(this.endMarkerPoint);
                this.singMarker.changed();
                break;
        }
        if (/^(focus\-)/.test(type)) {
            this.removeOverlay("focusMarkerPoint");
            let focusType = type.split("-")[1];
            let focusIcon = "";
            if (focusType === "stay") {
                focusIcon = stayOnlineIcon;
            } else if (focusType === "alarm") {
                focusIcon = alarmIcon;
            }
            let focusMarkerPoint = new Feature({
                geometry: new Point([info.lng, info.lat]),
            });
            focusMarkerPoint.setStyle(
                new Style({
                    image: new Icon({
                        src: focusIcon,
                        scale: 1,
                    }),
                })
            );
            this.focusMarkerPoint = focusMarkerPoint;
            this.playMarker.addFeature(this.focusMarkerPoint);
            this.playMarker.changed();
        }
    };
    drawRegionMarkers = (regionList) => {
        let featureList = regionList.map((item) => {
            let feature = new Feature({
                geometry: new Point([item.lng, item.lat]),
                name: `region`,
                info: item,
            });
            return feature;
        });
        this.regionMarkers.addFeatures(featureList);
        this.regionMarkersLayer.setSource(this.regionMarkers);
    };
    drawInfoWindow = async ({ type, data, position }) => {
        let dom = await this.createInfoWindowDom(type, data);
        this.infoWindowShow = true;
        this.infoWindow.setPosition(position);
        this.infoWindow.setElement(dom);
        document.getElementById("infoClose").addEventListener("click", () => {
            this.infoWindowShow = false;
            this.infoWindow.setPosition(undefined);
            if (type === "region") {
                this.toggleCheck(data.areaId, false);
            }
        });
    };
    toggleGpsMarkers = (show) => {
        this.gpsMarkers.changed();
        this.gpsMarkersLayer.setVisible(show);
        this.gpsMarkersLayer.show = show;
    };
    drawAlarmMarkers = (alarmList) => {
        let featureList = alarmList.map((item) => {
            let feature = new Feature({
                geometry: new Point([item.lng, item.lat]),
                name: `alarm`,
                info: item,
            });
            return feature;
        });
        this.alarmMarkers.addFeatures(featureList);
        this.alarmMarkers.changed();
    };
    drawStayMarkers = (stayList) => {
        let featureList = stayList.map((item) => {
            let feature = new Feature({
                geometry: new Point([item.startLng, item.startLat]),
                name: `stay`,
                info: item,
            });
            return feature;
        });
        this.stayMarkers.addFeatures(featureList);
        this.stayMarkers.changed();
    };
    calculatePlayInfo() {
        this.playInfo.timeTotal =
            moment(
                this.playInfo.path[this.playInfo.path.length - 1].createTime
            ).valueOf() - moment(this.playInfo.path[0].createTime).valueOf();
        this.playInfo.timeGap = Math.floor(
            this.playInfo.timeTotal / (this.playInfo.path.length - 1)
        );
        this.playInfo.filterGps = this.filterGps(this.playInfo.path);
        let featureList = this.playInfo.filterGps.map(
            ({
                lng,
                lat,
                collectTime,
                speed,
                lngGaode,
                latGaode,
                gpsValid,
                createTime,
                locateType,
            }) => {
                let wheatherNormal = 1; // 1是正常
                if (gpsValid === 1) {
                    let collectTimeStamp = moment(collectTime).valueOf();
                    let createTimeStamp = moment(createTime).valueOf();
                    if (
                        createTimeStamp > collectTimeStamp &&
                        createTimeStamp - collectTimeStamp > 10 * 60 * 1000
                    ) {
                        wheatherNormal = 0;
                    }
                } else {
                    wheatherNormal = 0;
                }
                return new Feature({
                    geometry: new Point([lng, lat]),
                    name: `gps`,
                    info: { collectTime, speed, lngGaode, latGaode },
                    wheatherNormal,
                    locateType,
                });
            }
        );
        this.gpsMarkers.addFeatures(featureList);
        this.gpsMarkers.changed();
    }
    reinitPlayInfo = () => {
        this.playInfo = {};
    };
    removeOverlay = (name) => {
        if (!checkKeys(this[name])) {
            return;
        }
        if (/Point$/.test(name)) {
            if (name === "carMarkerPoint" || name === "focusMarkerPoint") {
                this.playMarker.removeFeature(this[name]);
                this.playMarkerLayer.changed();
            } else {
                this.singMarker.removeFeature(this[name]);
                this.singMarkerLayer.changed();
            }
            this[name] = null;
        } else if (/Markers$/.test(name)) {
            this[name].clear();
            this[name].changed();
        } else if (/Line$/.test(name)) {
            this[name].clear();
            this[name].changed();
        } else if (/Marker$/.test(name)) {
            this[name].clear();
            this[name].changed();
        } else if (name === "infoWindow") {
            this.infoWindow.setPosition(undefined);
            this.infoWindow.setElement(undefined);
            this.infoWindowShow = false;
        }
    };
    play = async ({
        polylineWidth,
        polylineColorType,
        filterGps,
        polylineShowType,
    }) => {
        this.playInfo.isPlay = true;
        if (!this.carMarkerPoint) {
            this.drawMarker("car", this.playInfo.path[0]);
            await this.wait();
            this.map
                .getView()
                .setCenter(this.carMarkerPoint.getGeometry().getCoordinates());
            //异步等待1000毫秒,不然小车点出不来
            await this.wait();
        }
        if (polylineColorType === 1) {
            let runLine = new Feature(new LineString([]));
            runLine.setId("runLine");
            runLine.setStyle(
                new Style({
                    stroke: new Stroke({
                        width: polylineWidth * 2,
                        color: "#409eff",
                    }),
                    zIndex: 10,
                })
            );
            this.routeLine.addFeature(runLine);
        } else {
            if (this.routeLine.getFeatureById("runLine")) {
                this.routeLine.removeFeature(
                    this.routeLine.getFeatureById("runLine")
                );
            }
        }
        this.carMarkerPoint_clone = this.carMarkerPoint.getGeometry().clone();
        this.carMarkerPoint.setGeometry(null);
        this.removeOverlay("focusMarkerPoint");
        // this.singMarkerLayer.setVisible(false);
        this.gpsMarkersLayer.setVisible(false);
        this.addPostrender();
    };
    wait() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }
    stop = () => {
        if (!this.playInfo.isPlay) {
            return;
        }
        this.playInfo.isPlay = false;
        this.playMarkerLayer.un("postrender", this.moveFeature);
        this.carMarkerPoint.setGeometry(this.carMarkerPoint_clone);
        this.carMarkerPoint.changed();
        this.carMarkerPoint_clone = null;
        // this.singMarkerLayer.setVisible(true);
        // this.routeLine.removeFeature(this.routeLine.getFeatureById('runLine'));
        this.gpsMarkersLayer.show && this.gpsMarkersLayer.setVisible(true);
    };
    moveFeature = (event) => {
        let index = this.playInfo.frontIndex;
        if (index === this.playInfo.path.length - this.playInfo.playGap) {
            this.stop();
            return;
        }
        let nextIndex = this.playInfo.frontIndex + this.playInfo.playGap;
        let directionF = this.playInfo.path[index].direction;
        let directionN = this.playInfo.path[nextIndex].direction;
        let caRadius = directionN - directionF;
        let currentLine = new LineString([
            [this.playInfo.path[index].lng, this.playInfo.path[index].lat],
            [
                this.playInfo.path[nextIndex].lng,
                this.playInfo.path[nextIndex].lat,
            ],
        ]);
        this.playInfo.playRate =
            this.playInfo.playRate + 0.005 * this.playInfo.speed;
        if (this.playInfo.playRate > 1) {
            this.playInfo.playRate = 1;
        }
        let currentCoordinate = currentLine.getCoordinateAt(
            this.playInfo.playRate
        );
        this.carMarkerPoint_clone.setCoordinates(currentCoordinate);
        let runLine = this.routeLine.getFeatureById("runLine");
        if (runLine) {
            if (runLine.getGeometry().getCoordinates().length === 0) {
                let linePath = this.playInfo.path
                    .slice(0, this.playInfo.frontIndex)
                    .map(({ lng, lat }) => {
                        return [lng, lat];
                    });
                runLine.getGeometry().setCoordinates(linePath);
            }
            runLine.getGeometry().appendCoordinate(currentCoordinate);
            this.routeLine.changed();
        }
        let stayStyle = new Style({
            image: new Icon({
                src: carIcon,
                rotation: this.cashd(
                    directionF + caRadius * this.playInfo.playRate
                ),
            }),
            zIndex: 20,
        });
        let vectorContext = getVectorContext(event);
        vectorContext.setStyle(stayStyle);
        this.carMarkerPoint.setStyle(stayStyle);
        vectorContext.drawGeometry(this.carMarkerPoint_clone);
        if (this.playInfo.playMode === 1) {
            this.map.getView().setCenter(currentCoordinate);
        }
        if (this.playInfo.indexType === "trak") {
            this.removeOverlay("infoWindow");
        }
        if (this.infoWindowShow) {
            this.infoWindow.setPosition(currentCoordinate);
        }
        if (this.playInfo.playRate >= 1) {
            this.playInfo.playRate = 0;
            if (this.playInfo.frontIndex < this.playInfo.path.length - 1) {
                this.playInfo.frontIndex = Math.min(
                    this.playInfo.frontIndex + this.playInfo.playGap,
                    this.playInfo.path.length - 1
                );
                let nextGps = this.playInfo.path[this.playInfo.frontIndex];
                if (this.infoWindowShow) {
                    this.drawInfoWindow({
                        type: "gps",
                        data: nextGps,
                        position: [nextGps.lng, nextGps.lat],
                    });
                }
            }
        }
        this.map.render();
    };
    addPostrender = () => {
        this.playMarkerLayer.on("postrender", this.moveFeature);
    };
    drawInfoWindow = async ({ type, data, position }) => {
        let dom = await this.createInfoWindowDom(type, data);
        this.infoWindowShow = true;
        this.infoWindow.setPosition(position);
        this.infoWindow.setElement(dom);
        document.getElementById("infoClose").addEventListener("click", () => {
            this.infoWindowShow = false;
            this.infoWindow.setPosition(undefined);
            this.infoWindow.setElement(undefined);
            if (type === "region") {
                this.toggleCheck(data.areaId, false);
            }
        });
    };
    labelRowClick = (currentRow) => {
        let marker = this.labelMarkerMap[currentRow.id];
        if (!marker) {
            return;
        }
        this.map.getView().setCenter(marker.getGeometry().getCoordinates());
    };
    createInfoWindowDom = async (type, info) => {
        let resDom = await this.renderWindowStr(type, info);
        return resDom;
    };
    drawTrajectoryLine = (historyTrajectoryTempData) => {
        return new Promise(async (resolve) => {
            if (!Base_Map.trajectoryCorrection) {
                await this.trajectoryCorrection(
                    historyTrajectoryTempData
                ).catch(() => {});
            }
            if (
                Base_Map.trajectoryCorrection &&
                Base_Map.trajectoryCorrection.length > 0
            ) {
                let path = Base_Map.trajectoryCorrection.map(({ lng, lat }) => {
                    return [lng, lat];
                });
                let feature = new Feature(new LineString(path));
                feature.setStyle(
                    new Style({
                        stroke: new Stroke({
                            width: 3,
                            color: "red",
                        }),
                    })
                );
                this.routeTrakLine.addFeature(feature);
                this.routeTrakLine.changed();
            }
            resolve();
        });
    };
    clear() {
        // let playInfo = {
        //     isPlay: false,
        //     path: [],
        //     timeTotal: 0,
        //     timeGap: 0,
        //     playGap: 1,
        //     speed: 8,
        //     frontIndex: 0,
        //     lineF: null,
        //     playMode: 2,
        //     playRate: 0
        // };
        this.playInfo.path.length = 0;
        this.playRate = 0;
        this.playInfo.isPlay = false;
        this.playMarkerLayer.un("postrender", this.moveFeature);
        // Object.assign(this.playInfo, playInfo);
        Object.keys(this).forEach((key) => {
            if (
                /(Markers|Line|Marker)$/.test(key) &&
                !(this[key] instanceof Function)
            ) {
                this.removeOverlay(key);
            }
        });
        this.carMarkerPoint = null;
        this.startMarkerPoint = null;
        this.endMarkerPoint = null;
        this.focusMarkerPoint = null;
        this.carMarkerPoint_clone = null;
        this.routeLine_clone = null;
        this.infoWindow.setPosition(undefined);
        this.infoWindowShow = false;
    }
    addLabel_R = (newCheckedLabel, showPointerLabel) => {
        let labelShapeArr = [];
        let labelMarkerArr = [];
        for (let labelId in newCheckedLabel) {
            let pointMarker = null;
            let shapeObj = null;
            if (this.labelMarkerMap[labelId]) {
                pointMarker = this.labelMarkerMap[labelId];
                shapeObj = this.labelShapeMap[labelId];
            } else {
                let result = this.getFeature(
                    newCheckedLabel[labelId],
                    showPointerLabel
                );
                pointMarker = result.pointFeature;
                shapeObj = result.shapeFeature;
                this.labelMarkerMap[labelId] = pointMarker;
                this.labelShapeMap[labelId] = shapeObj;
            }
            pointMarker && labelMarkerArr.push(pointMarker);
            shapeObj && labelShapeArr.push(shapeObj);
            if (this.checkedLabelIds.indexOf(labelId) < 0) {
                this.checkedLabelIds.push(labelId);
            }
        }
        this.tagMarker.addFeatures(labelShapeArr);
        this.tagMarker.addFeatures(labelMarkerArr);
        this.tagMarker.changed();
    };
    deleteLabel_R = (deleteLabelArr) => {
        deleteLabelArr.forEach((labelId) => {
            let pointMarker = null;
            let shapeObj = null;
            if (this.labelMarkerMap[labelId]) {
                pointMarker = this.labelMarkerMap[labelId];
                shapeObj = this.labelShapeMap[labelId];
                if (pointMarker) {
                    this.tagMarker.removeFeature(pointMarker);
                    delete this.labelMarkerMap[labelId];
                }
                if (shapeObj) {
                    this.tagMarker.removeFeature(shapeObj);
                    delete this.labelShapeMap[labelId];
                }
                delete this.labelMarkerMap[labelId];
            }
        });
        this.tagMarker.changed();
    };
    getFeature = (label, showPointerLabel) => {
        let getPointCenter = (shapeDetail) => {
            let lngAll = 0;
            let latAll = 0;
            shapeDetail.map(({ lng, lat }) => {
                lngAll += lng;
                latAll += lat;
            });
            let point = {
                lng: lngAll / shapeDetail.length,
                lat: latAll / shapeDetail.length,
            };
            return point;
        };
        let point = {};
        let shapeFeature = null;
        let pointFeature = {};
        let shapeDetail = {};
        if (
            label.shapeDetail &&
            label.shapeDetail != "" &&
            label.shapeDetail != "{}"
        ) {
            shapeDetail = JSON.parse(label.shapeDetail);
        } else {
            return {};
        }
        switch (label.shapeType) {
            case 1:
                let {
                    center: { lng, lat },
                    radius,
                } = shapeDetail;
                if (!lng || !lat) return null;
                // let { lng: lngGaode, lat: latGaode } = gpsConverter.gps_gaode(lng, lat);
                let [lng_p, lat_p] = fromLonLat([lng, lat]);
                let circle = new Circle([lng_p, lat_p], radius);
                shapeFeature = new Feature(circle);
                point = {
                    lng: shapeDetail.center.lng,
                    lat: shapeDetail.center.lat,
                };
                break;
            case 2:
                let gpsList = shapeDetail.map((label) => {
                    let gpsGD = fromLonLat([label.lng, label.lat]);
                    // let gpsGD = gpsConverter.gps_gaode(label.lng, label.lat);
                    return gpsGD;
                });
                let polygon = new Polygon([gpsList]);
                shapeFeature = new Feature(polygon);
                point = getPointCenter(shapeDetail);
                break;
            case 4:
                let rectangleLine = [];
                shapeDetail.map(({ lng, lat }) => {
                    let [lng_p, lat_p] = fromLonLat([lng, lat]);
                    let item = {
                        lng_p,
                        lat_p,
                    };
                    rectangleLine.push(item);
                });
                let point1 = rectangleLine[0];
                let point2 = rectangleLine[1];
                let [lngMin, lngMax] =
                    point1.lng_p > point2.lng_p
                        ? [point2.lng_p, point1.lng_p]
                        : [point1.lng_p, point2.lng_p];
                let [latMin, latMax] =
                    point1.lat_p > point2.lat_p
                        ? [point2.lat_p, point1.lat_p]
                        : [point1.lat_p, point2.lat_P];
                let path = [
                    [
                        [lngMin, latMin],
                        [lngMin, latMax],
                        [lngMax, latMax],
                        [lngMax, latMin],
                    ],
                ];
                let rect = new Polygon(path);
                shapeFeature = new Feature(rect);
                point = getPointCenter(shapeDetail);
                break;
            case 5:
                point = {
                    lng: shapeDetail.center.lng,
                    lat: shapeDetail.center.lat,
                };
        }
        let { id, tagName, shapeType, labelPointCategory } = label;
        let position_point = fromLonLat([point.lng, point.lat]);
        let point_i = new Point(position_point);
        pointFeature = new Feature({
            geometry: point_i,
            name: "regonPoint",
            label,
        });
        let style = this.createStyle(
            tagName,
            labelPointCategory,
            showPointerLabel
        );
        pointFeature.setStyle(style);
        return {
            shapeFeature,
            pointFeature,
        };
    };
    createStyle = (tagName, labelPointCategory, showPointerLabel) => {
        let url = labelMarkerIconMap[labelPointCategory];
        let stay_o = {
            image: new Icon({
                src: url,
                anchor: [0.6, 0.6],
                scale: 0.4,
            }),
        };
        if (showPointerLabel) {
            stay_o.text = new Text({
                textAlign: "center",
                textBaseline: "middle",
                offsetY: 20,
                font: "bold 12px 微软雅黑",
                text: tagName,
            });
        }
        return new Style(stay_o);
    };
    setCenter = (positon) => {
        this.map.getView().setCenter(positon);
    };
    changeLabelShow = (showPointerLabel) => {
        let pointList = this.tagMarker.getFeatures().filter((feature) => {
            return feature.values_.name === "regonPoint";
        });
        pointList.forEach((feature) => {
            let label = feature.values_.label;
            let { tagName, labelPointCategory } = label;
            let style = this.createStyle(
                tagName,
                labelPointCategory,
                showPointerLabel
            );
            feature.setStyle(style);
        });
        this.tagMarker.changed();
    };
}
