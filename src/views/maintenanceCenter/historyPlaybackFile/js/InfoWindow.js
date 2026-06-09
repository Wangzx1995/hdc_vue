

export default class infoWindow extends BMap.Overlay {
    constructor(point, domStr, utilMethods, areaId) {
        super();
        const bodyModel = `<div class="bm-overlay"><div style="height:100%"><div id='body' style='height:100%'></div><span class="triangle"></span><i class="el-icon-close iclass"></i></div></div>`
        this.domBody = this.parseToDOM(bodyModel.trim());
        this.point = point;
        this.dom = this.parseToDOM(domStr.trim());
        this.utilMethods = utilMethods;
        this.areaId = areaId;
    }
    initialize(map) {
        this.map = map;
        this.domBody.childNodes[0].childNodes[0].appendChild(this.dom);
        map.getPanes().floatPane.appendChild(this.domBody);
        return this.domBody;
    }
    draw() {
        let pixel = this.map.pointToOverlayPixel(this.point);
        this.domBody.style.left = (pixel.x - 120) + "px";
        this.domBody.style.top = (pixel.y - 165) + "px";
        this.domBody.childNodes[0].childNodes[2].addEventListener('click', () => {
            this.unload();
        })
    }
    parseToDOM(str) {
        let div = document.createElement("div");
        if (typeof str == "string") div.innerHTML = str;
        return div.childNodes[0];
    }
    unload() {
        this.map.removeOverlay(this);
        this.areaId && this.utilMethods['toggleCheck'](this.areaId, false);
        Object.keys(this).forEach((item) => {
            delete this[item];
        })
    }
}
