//播放控件方法集合

export default {
    name: 'WebControl', 
    // 设置窗口控制回调
    setCallbacks(obj) {
        obj.JS_SetWindowControlCallback({
            cbIntegrationCallBack: this.cbIntegrationCallBack
        });
    },
    // 推送消息
    cbIntegrationCallBack(oData) {
        console.log(oData);
        if(oData.responseMsg.event == 'StartRealPlayByChann'){
            //StartRealPlay
            console.log(this.webControl);
        }
    },
    // 设置窗口裁剪
    setWndCutting(obj,id, width, height) {
        var iWidth = document.body.offsetWidth;    //可视区域宽度
        var iHeight = document.body.offsetHeight;  //可视区域高度
        var oDivRect = document.getElementById(id).getBoundingClientRect();
        var iCoverLeft = (oDivRect.left < 0) ? Math.abs(oDivRect.left): 0;
        var iCoverTop = (oDivRect.top < 0) ? Math.abs(oDivRect.top): 0;
        var iCoverRight = (oDivRect.right - iWidth > 0) ? Math.round(oDivRect.right - iWidth) : 0;
        var iCoverBottom = (oDivRect.bottom - iHeight > 0) ? Math.round(oDivRect.bottom - iHeight) : 0;

        iCoverLeft = (iCoverLeft > width) ? width : iCoverLeft;
        iCoverTop = (iCoverTop > height) ? height : iCoverTop;
        iCoverRight = (iCoverRight > width) ? width : iCoverRight;
        iCoverBottom = (iCoverBottom > height) ? height : iCoverBottom;

        //if (iCoverLeft != 0 || iCoverTop != 0 || iCoverRight != 0 || iCoverBottom != 0) {// 快速操作下无法还原
            obj.JS_RepairPartWindow(0, 0, width, height);
        //}
        if (iCoverLeft != 0) {
            obj.JS_CuttingPartWindow(0, 0, iCoverLeft, height);
        }
        if (iCoverTop != 0) {
            obj.JS_CuttingPartWindow(0, 0, width, iCoverTop);
        }
        if (iCoverRight != 0) {
            obj.JS_CuttingPartWindow(width - iCoverRight, 0, iCoverRight, height);
        }
        if (iCoverBottom != 0) {
            obj.JS_CuttingPartWindow(0, height - iCoverBottom, width, iCoverBottom);
        }
    },
    //关闭控件
    closeOcx(obj){
        if (obj != null) {
            obj.JS_Disconnect().then( ()=> {
                console.log("JS_Disconnect");
            }, function () {});
        }
    },
    //页面滚动调用的方法
    pageScroll(obj,id, width, height){
        if(obj != null){
            obj.JS_Resize(width, height);
            this.setWndCutting(obj,id, width, height);
        }
    },
    //页面变化调用的方法
    pageResize(obj,id, width, height){
        if(obj != null){
            obj.JS_Resize(width, height);
            this.setWndCutting(obj,id, width, height);
        }
    }
}



