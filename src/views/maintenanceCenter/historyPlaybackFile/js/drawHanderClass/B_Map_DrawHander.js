import Base_DrawHander from "./Base_DrawHander";
export default class B_Map_DrawHander extends Base_DrawHander {
    labelMarkerMap = {};
    labelShapeMap = {};
    allLabelsMap = {};
    checkedLabelIds = [];
    mapType = 'baidu';
    constructor(map) {
        super(map);
    }
    addLabel = (newCheckedLabel,showPointerLabel) => {
        let labelShapeArr = [];
        let labelMarkerArr = [];
        for (let labelId in newCheckedLabel) {
            let pointMarker = null;
            let shapeObj = null;
            if (this.labelMarkerMap[labelId]) {
                pointMarker = this.labelMarkerMap[labelId];
                shapeObj = this.labelShapeMap[labelId];
                pointMarker = this.labelMarkerMap[labelId];
                let content = pointMarker["markerContentList"][showPointerLabel ? 0 : 1];
                pointMarker.setContent(content);
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
        [...labelMarkerArr, ...labelShapeArr].forEach((item) => {
            this.map.addOverlay(item);
        })
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
        [...labelMarkerArr, ...labelShapeArr].forEach((item) => {
            this.map.removeOverlay(item);
        })
    }
    labelRowClick = (currentRow) => {
        let marker = this.labelMarkerMap[currentRow.id];
        let position = marker ? marker.getPosition() : "";
        position && this.map.setCenter(position);
    }
    changeLabelShow = (showPointerLabel) => {
        Object.values(this.labelMarkerMap).forEach((marker) => {
            let content = marker["markerContentList"][showPointerLabel ? 0 : 1];
            marker.setContent(content);
        });
    }
}