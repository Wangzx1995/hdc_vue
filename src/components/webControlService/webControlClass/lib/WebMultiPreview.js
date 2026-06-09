
import Vue from 'vue'
import BaseWebControl from "../base/BaseWebControl";


/**
 * 
 * @class 多屏预览
 * @constructor
 * @introduce  
 * 
 */
class WebMultiPreview extends BaseWebControl {
    constructor(domId, cb) {
        super(domId);
        this.initIng = true;
        (async () => {
            this.CONFIG = {
                protocol: 0,
                streamType: 1,
                code: 0,
                streamChangeIndex: -1,
            }
            this.initNoneWebCon("loading");
            try {
                this.playControl = await this.initWebOcx();
                this.playControlState = "show";
                this.reInitSize();
                this.disconnectOnLoad();
                cb("success");
            } catch (msg) {
                if (msg === '控件未启动') {
                    Vue.prototype.$message.error(msg);
                }
                cb("error");
            }
        })()
    }
    /**
     * @function(控件初始化)
     * 
     */
    initWebOcx() {
        return new Promise((resove, reject) => {
            let playControl = new WebControl({
                szPluginContainer: this.domId,
                iServicePortStart: 14430,
                iServicePortEnd: 14439,
                szClassId: "29DDBC9A-8AEA-4827-9C3A-805D697CF38F",
                cbConnectSuccess: () => {
                    playControl.JS_StartService("window", {
                        dllPath: "./WebMultiPreview.dll"
                    }).then(() => {
                        playControl.JS_SetWindowControlCallback({
                            cbIntegrationCallBack: this.cbIntegrationCallBack
                        });
                        playControl.JS_CreateWnd(this.domId, this.offsetWidth, this.offsetHeight).then(() => {
                            this.initIng = false;
                            this.removeNodes();
                            /* 判断当前dom是否为初始化的dom,若不是，则不初始化 */
                            let newDom = document.getElementById(this.domId);
                            if (!newDom) {
                                playControl.JS_Disconnect();
                                return;
                            }
                            if (newDom.attributes['timeFlag'] !== this.dom.attributes['timeFlag']) {
                                playControl.JS_Disconnect();
                                return;
                            }
                            resove(playControl);
                        }).catch(() => {
                            this.initIng = false;
                            reject("控件连接失败!");
                        })
                    }).catch(() => {
                        this.initIng = false;
                        reject("控件连接失败!");
                    })
                },
                cbConnectError: () => {
                    this.initIng = false;
                    this.removeNodes();
                    this.initNoneWebCon("noneWebCon");
                    this.disconnectWebOcx();
                    reject("控件未启动")
                },
                cbConnectClose: () => {
                    this.removeNodes();
                }
            });
        })
    }
    /**
     * @function(开始预览)
     * @param({
                channel-通道号,
                devSerialNum -终端ID,
                url  -取流url,
                productKey - 产品密钥,
                plate -车牌号,
                channelName-通道名称
            })
     */
    startPreview(param) {
        let params = { ...param, ...this.CONFIG };
        this.playControl.JS_RequestInterface({
            funcName: "startPreview",
            arguments: params
        }).then(() => { });
    }
    /**
     * @function(停止预览)
     */
    stopPreview() {
        this.playControl.JS_RequestInterface({
            funcName: "stopAllPreview",
            arguments: {}
        }).then(() => { });
    }
    /**
     * @function(控件初始化完成回调函数绑定)
     * 
     */
    cbPreviewIntegrationCallBack(oData) {
        if (oData.responseMsg.event == 'startPreviewNotify') {
            let data = oData.responseMsg.msg;
            let params = {
                deviceCode: data.devSerialNum,
                channelNum: data.channel,
                productKey: data.productKey,
                streamType: data.streamType,
                protocolType: data.protocol,
                requestIp: JSON.parse(window.sessionStorage.getItem('requestIp'))
            }
            let args = {
                url: '',
                devSerialNum: data.devSerialNum,
                name: data.name,
                channel: data.channel,
                productKey: data.productKey,
                protocol: data.protocol,//协议类型StartRealPlay
                streamType: data.streamType,//码流类型，0-主码流；1-子码流（默认）
                streamChangeIndex: data.streamChangeIndex,
                plate: data.plate,
                channelName: data.channelName,
                code: 0,
            }
            Vue.prototype.$api.getPreviewUrl(params).then((res) => {
                let errorCode = ''
                if (res.code == "device_offline" || res.code == "EC.device.not.online" || res.code == "device_dormancy") {
                    errorCode = 0x01000000
                }
                if (res.success == true) {
                    if (!!res.data) {
                        args.url = res.data;
                        this.playControl.JS_RequestInterface({
                            funcName: "startPreview",
                            arguments: args
                        }).then(function (oData) { });
                    } else {
                        Vue.prototype.$message.error("获取url失败！");

                        this.playControl.JS_RequestInterface({
                            funcName: "notifyError",
                            arguments: {
                                msg: 'startPreviewNotify',
                                errorCode: errorCode,
                                errorMsg: res.msg
                            }
                        }).then(function (oData) { });
                    }
                } else {
                    Vue.prototype.$message.error(res.msg);
                    this.playControl.JS_RequestInterface({
                        funcName: "notifyError",
                        arguments: {
                            msg: 'startPreviewNotify',
                            errorCode: errorCode,
                            errorMsg: res.msg
                        }
                    }).then(function (oData) { });
                }
            }).catch(() => { });
        }
        if (oData.responseMsg.event == 'changeStreamNotify') {
            let data = oData.responseMsg.msg;
            let params = {
                deviceCode: data.devSerialNum,
                channelNum: data.channel,
                productKey: data.productKey,
                streamType: data.streamType,
                protocolType: data.protocol,
                requestIp: JSON.parse(window.sessionStorage.getItem('requestIp')),
                channelName: data.channelName,
            };
            Vue.prototype.$api.getPreviewUrl(params).then((res) => {
                let errorCode = ''
                if (res.code == "device_offline" || res.code == "EC.device.not.online" || res.code == "device_dormancy") {
                    errorCode = 0x01000000
                }
                if (res.success == true) {
                    if (res.data != null || res.data != undefined) {
                        var url = res.data;
                        if (url.length == 0) {
                            Vue.prototype.$message.error('获取url失败，没有返回预览url！');
                            this.playControl.JS_RequestInterface({
                                funcName: "notifyError",
                                arguments: {
                                    msg: 'changeStreamNotify',
                                    errorCode: errorCode,
                                    errorMsg: res.msg
                                }
                            }).then(function (oData) { });
                        } else {
                            //重新取流预览
                            this.playControl.JS_RequestInterface({
                                funcName: "startPreview",
                                arguments: {
                                    url: url,
                                    devSerialNum: data.devSerialNum,
                                    name: data.name,
                                    channel: data.channel,
                                    productKey: data.productKey,
                                    protocol: data.protocol,//协议类型
                                    streamType: data.streamType,//码流类型，0-主码流；1-子码流（默认）
                                    streamChangeIndex: data.streamChangeIndex,
                                    plate: data.plate,
                                    code: 0,
                                    channelName: data.channelName
                                }
                            }).then(function (oData) { });
                        }
                    } else {
                        Vue.prototype.$message.error('获取url失败！' + res.msg);
                        this.playControl.JS_RequestInterface({
                            funcName: "notifyError",
                            arguments: {
                                msg: 'changeStreamNotify',
                                errorCode: errorCode,
                                errorMsg: res.msg
                            }
                        }).then(function (oData) { });
                    }
                } else {
                    Vue.prototype.$message.error('获取url失败！' + res.msg);
                    this.playControl.JS_RequestInterface({
                        funcName: "notifyError",
                        arguments: {
                            msg: 'stopPreviewNotify',
                            errorCode: errorCode,
                            errorMsg: res.msg
                        }
                    }).then(function (oData) { });
                }
            }).catch(() => { });
        }
    }

}
export default {
    name: 'WebMultiPreview',
    control: WebMultiPreview
}