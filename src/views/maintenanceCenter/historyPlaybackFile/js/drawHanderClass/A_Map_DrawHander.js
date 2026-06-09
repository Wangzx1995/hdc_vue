import Base_DrawHander from "./Base_DrawHander";
export default class A_Map_DrawHander extends Base_DrawHander {
    labelMarkerMap = {};
    labelShapeMap = {};
    tagOverlays = null;
    shapeOverLays = null;
    allLabelsMap = {};
    checkedLabelIds = [];
    mapType = 'gaode';
    constructor(map) {
        super(map);
    }
    addLabel = (newCheckedLabel, showPointerLabel) => {
        let labelShapeArr = [];
        let labelMarkerArr = [];
        for (let labelId in newCheckedLabel) {
            let pointMarker = null;
            let shapeObj = null;
            if (this.labelMarkerMap[labelId]) {
                pointMarker = this.labelMarkerMap[labelId];
                let content = pointMarker.getExtData()["markerContentList"][showPointerLabel ? 0 : 1];
                pointMarker.setContent(content);
                shapeObj = this.labelShapeMap[labelId];
            } else {
                let result = this.getLabelObj(newCheckedLabel[labelId],showPointerLabel);
                pointMarker = result.pointMarker;
                shapeObj = result.shapeObj;
                this.labelMarkerMap[labelId] = pointMarker;
                this.labelShapeMap[labelId] = shapeObj;
            }
            pointMarker && labelMarkerArr.push(pointMarker);
            shapeObj && labelShapeArr.push(shapeObj);
            if (this.checkedLabelIds.indexOf(labelId) < 0) {
                this.checkedLabelIds.push(labelId);
            }
        }
        if (this.tagOverlays) {
            this.tagOverlays.addOverlays(labelMarkerArr);
        } else {
            this.tagOverlays = new AMap.OverlayGroup(labelMarkerArr);
            this.map.add(this.tagOverlays);
        }
        if (this.shapeOverLays) {
            this.shapeOverLays.addOverlays(labelShapeArr);
        } else {
            this.shapeOverLays = new AMap.OverlayGroup(labelShapeArr);
            this.map.add(this.shapeOverLays);
        }
    }
    deleteLabel = (deleteLabelArr) => {
        let labelMarkerArr = [];
        let labelShapeArr = [];
        deleteLabelArr.forEach(labelId => {
            let pointMarker = null;
            let shapeObj = null;
            if (this.labelMarkerMap[labelId]) {
                pointMarker = this.labelMarkerMap[labelId];
                shapeObj = this.labelShapeMap[labelId];
            }
            pointMarker && labelMarkerArr.push(pointMarker);
            shapeObj && labelShapeArr.push(shapeObj);
        });
        this.tagOverlays && this.tagOverlays.removeOverlays(labelMarkerArr);
        this.shapeOverLays && this.shapeOverLays.removeOverlays(labelShapeArr)
    }
    labelRowClick = (currentRow) => {
        let marker = this.labelMarkerMap[currentRow.id];
        let position = marker ? marker.getPosition() : "";
        position && this.map.setCenter(position,true);
    }
    changeLabelShow = (showPointerLabel) => {
        Object.values(this.labelMarkerMap).forEach((marker) => {
            let content = marker.getExtData()["markerContentList"][showPointerLabel ? 0 : 1];
            marker.setContent(content);
        });
    }
}