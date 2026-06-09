
import Vue from 'vue'
import BaseWebControl from "../base/BaseWebControl";
/**
 * 
 * @class 对讲
 * @constructor
 * @introduce  intercomState:对讲目前状态,intercomTime:对讲时长
 * 
 */
class WebVoiceTalk extends BaseWebControl {
    constructor(domId, cb) {
        super(domId);
        this.initIng = true;
        (async () => {
            this.intercomInterval = null;
            this.intercomTime = 0;
            this.intercomState = null;
            this.talkCarInfo = null;
            try {
                this.playControl = await this.initWebOcx();
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
        return new Promise((reslove, reject) => {
            let playControl = new WebControl({
                szPluginContainer: this.domId,
                iServicePortStart: 14430,
                iServicePortEnd: 14439,
                szClassId: "29DDBC9A-8AEA-4827-9C3A-805D697CF38F",
                cbConnectSuccess: () => {
                    playControl.JS_StartService("window", {
                        dllPath: "./WebVoiceTalk.dll"
                    }).then(() => {
                        playControl.JS_SetWindowControlCallback({
                            cbIntegrationCallBack: this.cbIntegrationCallBack
                        });
                        playControl.JS_CreateWnd(this.domId, 0, 0).then(() => {
                            this.initIng = false;
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
                            reslove(playControl);
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
                    this.disconnectWebOcx();
                    reject("控件未启动")
                },
                cbConnectClose: () => {
                    // this.intercomTime = 0;
                    // this.intercomState = null;
                    // this.intercomInterval = null;
                }
            });
        })
    }
    /**
     * @function(开始对讲)
     * 注：alarmId用于区分该对讲是否是紧急报警弹窗的报警
     */
    startIntercom(carId, talkCarInfo) {
        this.talkCarInfo = talkCarInfo;
        return new Promise((resove, reject) => {
            let params = {
                carId: carId,
                requestIp: JSON.parse(window.sessionStorage.getItem('requestIp'))
            }
            this.intercomState = "start";
            Vue.prototype.$api.getIntercomUrl(params).then((res) => {
                if (res.success) {
                    let url = res.data;
                    if (!!url) {
                        this.playControl.JS_RequestInterface({
                            funcName: "startVoiceTalk",
                            arguments: {
                                url: url,
                                code: 0,
                                type: 0
                            }
                        }).then((oData) => {
                            /* 对讲的错误统一在回调中执行 */
                            if (oData.responseMsg.error === 0) {
                                this.intercomState = "SUCCESS";
                                this.intercomInterval = setInterval(() => {
                                    this.intercomTime++;
                                }, 1000);
                                Vue.prototype.$message({
                                    message: "获取对讲URL成功，请勿摘下耳机/麦克风,请开始讲话！",
                                    type: 'success'
                                });
                                resove();
                            } else {
                                reject();
                            }
                        }).catch(() => {
                            reject();
                        })
                    } else {
                        Vue.prototype.$message.error("获取url为空");
                        window.clearInterval(this.intercomInterval);
                        this.intercomState = null;
                        this.intercomInterval = null;
                        this.intercomTime = 0;
                        this.talkCarInfo = null;
                        reject();
                    }
                } else {
                    if (res.code == "device_offline" || res.code == "EC.device.not.online" || res.code == "device_dormancy") {
                        Vue.prototype.$message.error("车辆离线或休眠！");
                    } else {
                        Vue.prototype.$message.error(res.msg);
                    }
                    window.clearInterval(this.intercomInterval);
                    this.intercomState = null;
                    this.intercomInterval = null;
                    this.intercomTime = 0;
                    this.talkCarInfo = null;
                    reject();
                }
            }).catch(() => {
                window.clearInterval(this.intercomInterval);
                this.intercomState = null;
                this.intercomInterval = null;
                this.intercomTime = 0;
                this.talkCarInfo = null;
                reject();
            });
        })
    }
    /**
     * @function(开始监听)
     */
    startListen(carId) {
        return new Promise((resove, reject) => {
            let params = {
                carId: carId,
                requestIp: JSON.parse(window.sessionStorage.getItem('requestIp'))
            }
            this.intercomState = "start";
            Vue.prototype.$api.getListenUrl(params).then((res) => {
                if (res.success) {
                    let url = res.data;
                    if (!!url) {
                        this.playControl.JS_RequestInterface({
                            funcName: "startVoiceTalk",
                            arguments: {
                                url: url,
                                code: 0,
                                type: 2//0-对讲,1-广播,2-监听
                            }
                        }).then((oData) => {
                            /* 对讲的错误统一在回调中执行 */
                            if (oData.responseMsg.error === 0) {
                                this.intercomState = "SUCCESS";
                                this.intercomInterval = setInterval(() => {
                                    this.intercomTime++;
                                }, 1000);
                                Vue.prototype.$message({
                                    message: "获取监听URL成功，请勿摘下耳机！",
                                    type: 'success'
                                });
                                resove();
                            } else {
                                reject();
                            }
                        }).catch(() => {
                            reject();
                        })
                    } else {
                        Vue.prototype.$message.error("获取url为空");
                        window.clearInterval(this.intercomInterval);
                        this.intercomState = null;
                        this.intercomInterval = null;
                        this.intercomTime = 0;
                        reject();
                    }
                } else {
                    if (res.code == "device_offline" || res.code == "EC.device.not.online" || res.code == "device_dormancy") {
                        Vue.prototype.$message.error("车辆离线或休眠！");
                    } else {
                        Vue.prototype.$message.error(res.msg);
                    }
                    window.clearInterval(this.intercomInterval);
                    this.intercomState = null;
                    this.intercomInterval = null;
                    this.intercomTime = 0;
                    reject();
                }
            }).catch(() => {
                window.clearInterval(this.intercomInterval);
                this.intercomState = null;
                this.intercomInterval = null;
                this.intercomTime = 0;
                reject();
            });
        })
    }
    /**
   * @function(结束对讲)
   * 
   */
    stopIntercom() {
        return new Promise((reslove, reject) => {
            if (this.playControl) {
                this.playControl.JS_RequestInterface({
                    funcName: "stopVoiceTalk",
                    arguments: {}
                }).then((oData) => {
                    window.clearInterval(this.intercomInterval);
                    this.intercomState = null;
                    this.intercomInterval = null;
                    this.intercomTime = 0;
                    this.talkCarInfo = null;
                    reslove();
                }).catch(() => {
                    reject();
                })
            }

        })
    }
    /**
     * @function(控件初始化完成回调函数绑定)
     * 
     */
    cbIntegrationCallBack = (oData) => {
        
        console.log("cbIntegrationCallBack")
        if (oData.responseMsg.event == 'voiceTalkErrorNotify') {
            if (oData.responseMsg.msg.code != 0) {
                this.stopIntercom();
                Vue.prototype.$message.error(oData.responseMsg.msg.msg || oData.responseMsg.msg.errorMsg);
            }
        }
    }
}
export default {
    name: 'WebVoiceTalk',
    control: WebVoiceTalk
}