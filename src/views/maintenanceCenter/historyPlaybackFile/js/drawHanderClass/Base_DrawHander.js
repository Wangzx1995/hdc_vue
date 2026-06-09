
import gpsConverter from "@/utils/gpsConverter";
import {labelMarkerIconMap} from "@/utils/global";
export default class Base_DrawHander {
    gpsConverter = gpsConverter;
    markerIcon = labelMarkerIconMap;
    constructor(map) {
        this.map = map;
    }
    createMarkerContentList(tagName, url) {
        let arr = [];
        let htmlShow = `<div class="custom-tag-marker"  title="${tagName
            }"><span class="tag-name"><span class="marker-icon" style="background-image:url(${url})"></span></span><span class="tag-name-text">${tagName
            }</span></div>`;
        let htmlNoShow = `
        <div class="custom-tag-marker"  title="${tagName
            }"><span class="tag-name"><span class="marker-icon" style="background-image:url(${url})"></span></span></div>`
        arr.push(htmlShow);
        arr.push(htmlNoShow);
        return arr;
    }
    getLabelObj = (label, showPointerLabel) => {
        let getPointCenter = (shapeDetail) => {
            let lngAll = 0;
            let latAll = 0;
            shapeDetail.map(({ lng, lat }) => {
                lngAll += lng;
                latAll += lat;
            });
            point = { lng: lngAll / shapeDetail.length, lat: latAll / shapeDetail.length };
            return point
        }
        let shapeObj = null;
        let point = {};
        let shapeDetail = {};
        if (label.shapeDetail && label.shapeDetail != "" && label.shapeDetail != "{}") {
            shapeDetail = JSON.parse(label.shapeDetail);
        } else {
            return {};
        }
        switch (label.shapeType) {
            case 1:
                shapeObj = this[`drawCircle_${this.mapType}`](shapeDetail);
                point = { lng: shapeDetail.center.lng, lat: shapeDetail.center.lat };
                break;
            case 2:
                shapeObj = this[`drawPolygon_${this.mapType}`](shapeDetail);
                point = getPointCenter(shapeDetail);
                break;
            case 4:
                shapeObj = this[`drawRectangle_${this.mapType}`](shapeDetail);
                point = getPointCenter(shapeDetail);
                break;
            case 5:
                point = { lng: shapeDetail.center.lng, lat: shapeDetail.center.lat }
        }
        let pointMarker = this[`drawMarker_${this.mapType}`]({ ...label, point }, showPointerLabel);
        return {
            shapeObj,
            pointMarker
        };
    }
    drawMarker_gaode = (info, showPointerLabel) => {
        let { point: { lng, lat }, id, tagName, shapeType, labelPointCategory } = info;
        let { lng: lngGaode, lat: latGaode } = this.gpsConverter.gps_gaode(lng, lat);
        let url = this.markerIcon[labelPointCategory];
        let markerContentList = this.createMarkerContentList(tagName, url);
        let markerContent = markerContentList[showPointerLabel ? 0 : 1];
        let extData = {
            id: id,
            tagName: tagName,
            shapeType: shapeType,
            labelPointCategory: labelPointCategory,
            markerContentList
        };
        let marker = new AMap.Marker({
            position: new AMap.LngLat(lngGaode, latGaode),
            offset: new AMap.Pixel(0, 0),
            content: markerContent,
            label: tagName,
            extData
        });
        return marker;
    }
    drawCircle_gaode = (shapeDetail) => {
        let { center: { lng, lat }, radius } = shapeDetail;
        if (!lng || !lat) return null;
        let { lng: lngGaode, lat: latGaode } = this.gpsConverter.gps_gaode(lng, lat);
        let circle = new AMap.Circle({
            center: [lngGaode, latGaode],
            radius: radius, //半径
            strokeColor: "#9751ff",
            strokeWeight: 2,
            strokeOpacity: 1,
            fillOpacity: 0.5,
            fillColor: "#fff"
        });
        return circle
    }
    drawRectangle_gaode = (shapeDetail) => {
        let rectangleLine = [];
        shapeDetail.map(label => {
            let gpsGD = this.gpsConverter.gps_gaode(label.lng, label.lat);
            rectangleLine.push(gpsGD);
        });
        let point1 = rectangleLine[0];
        let point2 = rectangleLine[1];
        let [lngMin, lngMax] = point1.lng > point2.lng ? [point2.lng, point1.lng] : [point1.lng, point2.lng];
        let [latMin, latMax] = point1.lat > point2.lat ? [point2.lat, point1.lat] : [point1.lat, point2.lat];
        let rectangle = new AMap.Rectangle({
            bounds: new AMap.Bounds(new AMap.LngLat(lngMin, latMin), new AMap.LngLat(lngMax, latMax)),
            strokeColor: "#9751ff",
            strokeWeight: 2,
            strokeOpacity: 1,
            fillColor: "#fff",
            fillOpacity: 0.5,
            cursor: "pointer"
        });
        return rectangle
    }
    drawPolygon_gaode = (shapeDetail) => {
        let objGD = [];
        shapeDetail.map(label => {
            let gpsGD = this.gpsConverter.gps_gaode(label.lng, label.lat);
            objGD.push([gpsGD.lng, gpsGD.lat]);
        });
        let polygon = new AMap.Polygon({
            path: objGD,
            strokeColor: "#9751ff",
            strokeWeight: 2,
            strokeOpacity: 1,
            fillOpacity: 0.5,
            fillColor: "#fff"
        });
        return polygon
    }
    drawMarker_baidu = (info, showPointerLabel) => {
        let { point: { lng, lat }, id, tagName, shapeType, labelPointCategory } = info;
        let { lng: lngBaidu, lat: latBaidu } = this.gpsConverter.gps_baidu(lng, lat);
        let url = this.markerIcon[labelPointCategory];
        let markerContentList = this.createMarkerContentList(tagName, url);
        let markerContent = markerContentList[showPointerLabel ? 0 : 1];
        let label = new BMap.Label(markerContent, {
            position: new BMap.Point(lngBaidu, latBaidu),
        });
        label.setStyle({
            border: "none",
            backgroundColor: 'none'
        })
        label.markerContentList = markerContentList;
        return label
    }
    drawCircle_baidu = (shapeDetail) => {
        let { center: { lng, lat }, radius } = shapeDetail;
        if (!lng || !lat) return null;
        let { lng: lngBaidu, lat: latBaidu } = this.gpsConverter.gps_baidu(lng, lat);
        let circle = new BMap.Circle(new BMap.Point(lngBaidu, latBaidu), radius, {
            strokeColor: "#9751ff",
            strokeWeight: 2,
            strokeOpacity: 1,
            fillOpacity: 0.5,
            fillColor: "#fff"
        })
        return circle
    }
    drawRectangle_baidu = (shapeDetail) => {
        let rectangleLine = [];
        shapeDetail.map(({ lng, lat }) => {
            rectangleLine.push(this.gpsConverter.gps_baidu(lng, lat));
        });
        let point1 = rectangleLine[0];
        let point2 = rectangleLine[1];
        let [lngMin, lngMax] = point1.lng > point2.lng ? [point2.lng, point1.lng] : [point1.lng, point2.lng];
        let [latMin, latMax] = point1.lat > point2.lat ? [point2.lat, point1.lat] : [point1.lat, point2.lat];
        let path = [
            new BMap.Point(lngMin, latMin),
            new BMap.Point(lngMin, latMax),
            new BMap.Point(lngMax, latMax),
            new BMap.Point(lngMax, latMin),
        ]
        let rectangle = new BMap.Polygon(
            path,
            {
                strokeColor: "#9751ff",
                strokeWeight: 2,
                strokeOpacity: 1,
                fillColor: "#fff",
                fillOpacity: 0.5,
                cursor: "pointer"
            }
        );
        return rectangle
    }
    drawPolygon_baidu = (shapeDetail) => {
        let path = [];
        shapeDetail.map(({ lng, lat }) => {
            let { lng: lngBaidu, lat: latBaidu } = this.gpsConverter.gps_baidu(lng, lat);
            path.push(new BMap.Point(lngBaidu, latBaidu));
        });
        let polygon = new AMap.Polygon({
            path,
            strokeColor: "#9751ff",
            strokeWeight: 2,
            strokeOpacity: 1,
            fillOpacity: 0.5,
            fillColor: "#fff"
        });
        return polygon
    }
}