/**
 * 拖拽改变div大小
 * callback: 移动以后的回调函数
 * callback2：准备移动时的回调函数，可以阻止后续的移动事件
 */
const dragTwoRowDiv = (
    contentId,
    topBoxId,
    resizeId,
    downBoxId,
    callback,
    options,
    callback2
) => {
    let commonOptions = {
        minHeight: 32,
        ifTopBoxHeight: true,
        extraDownHeight: 0,
    };
    if (options && typeof options === "object") {
        commonOptions = { ...commonOptions, ...options };
    }
    let { minHeight, ifTopBoxHeight, extraDownHeight } = commonOptions;
    let resize = document.getElementById(resizeId);
    let topBox = document.getElementById(topBoxId);
    let downBox = document.getElementById(downBoxId);
    let box = document.getElementById(contentId);
    let resizeHeight = resize.offsetHeight;
    let height = minHeight;
    resize.onmousedown = function (e) {
        if (typeof callback2 === "function") {
            let flagg = callback2();
            if (!flagg) return;
        }
        let maxHeight = box.clientHeight; //总体高度
        let startY = e.clientY;
        resize.top = resize.offsetTop;
        let downHeight = downBox.clientHeight; //底部高度
        document.onmousemove = function (e) {
            let endY = e.clientY;
            let lenAll = startY - endY + (downHeight + extraDownHeight);
            if (lenAll + resizeHeight >= maxHeight) {
                lenAll = maxHeight - resizeHeight;
            }
            if (lenAll - extraDownHeight <= minHeight)
                lenAll = minHeight + extraDownHeight;
            let trueTopBoxHeight =
                maxHeight - lenAll - resizeHeight + extraDownHeight;
            let trueDownBoxHeight = lenAll - extraDownHeight;
            if (ifTopBoxHeight) {
                topBox.style.height = trueTopBoxHeight + "px";
            }
            downBox.style.height = trueDownBoxHeight + "px";
            height = trueDownBoxHeight;
            const event = new Event("resize");
            window.dispatchEvent(event);
            callback(height);
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            resize.releaseCapture && resize.releaseCapture();
            callback(height);
        };
        resize.setCapture && resize.setCapture();

        return false;
    };
};

/**
 * 拖拽改变元素位置
 *
 *  */
const dragMoveDiv = (dom, allowPDom) => {
    if (!dom) {
        return;
    }
    dom.onmousemove = function () {
        dom.style.cursor = "move";
    };
    dom.onmousedown = function (e) {
        e = e || window.event;
        if (e.target !== e.currentTarget) {
            let find_node = [allowPDom, ...allowPDom.children].find((node) => {
                return node === e.target;
            });
            if (!find_node) {
                return false;
            }
        }
        // 初始位置
        let offleft = Number(dom.style.left.split("p")[0]);
        let offBottom = Number(dom.style.bottom.split("p")[0]);
        // 鼠标点击位置
        let startX = e.clientX;
        let startY = e.clientY;
        document.onmousemove = function (event) {
            event = event || window.event;
            // 鼠标停止位置
            let endX = event.clientX;
            let endY = event.clientY;
            // 移动距离
            let moveX = endX - startX;
            let moveY = -(endY - startY);
            // 元素最终位置
            let lastX = offleft + moveX;
            let lastY = offBottom + moveY;
            let maxX = dom.parentNode.offsetWidth - dom.offsetWidth;
            let maxY = dom.parentNode.offsetHeight - dom.offsetHeight;
            lastX = Math.max(lastX, 0);
            lastX = Math.min(lastX, maxX);
            lastY = Math.max(lastY, 0);
            lastY = Math.min(lastY, maxY);
            dom.style.left = lastX + "px";
            dom.style.bottom = lastY + "px";
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
        return false;
    };
};

export { dragTwoRowDiv, dragMoveDiv };
