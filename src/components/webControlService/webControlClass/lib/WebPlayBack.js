
import Vue from 'vue'
import BaseWebControl from "../base/BaseWebControl";
/**
 * 
 * @class 视频回放
 * @constructor(domId,Vue对象，加载成功回调，拖动进度条回调函数，定时通知web端的回调函数)
 * @introduce  
 * 
 */
class WebPlayBack extends BaseWebControl {
    constructor(domId, that, cb, startPlaybackNotifyFN, playbackTrackNotifyFN) {
        super(domId);
        this.initIng = true;
        (async () => {
            this.$that = that;
            this.startPlaybackNotifyFN = startPlaybackNotifyFN;
            this.playbackTrackNotifyFN = playbackTrackNotifyFN;
            this.initNoneWebCon("loading");
            try {
                this.playControl = await this.initWebOcx();
                cb("sucess");
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
                        dllPath: "./WebPlayBack.dll"
                    }).then(() => {
                        playControl.JS_SetWindowControlCallback({
                            cbIntegrationCallBack: this.cbIntegrationCallBack
                        });
                        playControl.JS_CreateWnd(this.domId, this.offsetWidth, this.offsetHeight).then(() => {
                            this.removeNodes();
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
                            resove(playControl);
                        }).catch(() => {
                            this.initIng = false;
                            reject("控件连接失败!");
                        });
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
   * @function(设置回放文件)
   * @param({
   *          carId
   *          devSerialNum，
   *          channel,
   *          channelName，
   *          productKey，
   *          startTime，
   *          endTime，
   *          fileSize，
   *          requestIp，
   *          plate，
          })
   */
    setFileInfo(fileInfo) {
        this.carId = fileInfo.carId;
        delete fileInfo.carId;
        this.playControl.JS_RequestInterface({
            funcName: "setPlaybackFileInfo",
            arguments: fileInfo,
        }).then(() => {
            this.startPlaybackDll(fileInfo);
        });
    }
    /**
    * @function(开始回放,回调函数调用，外部设置文件调用setFileInfo)
    */
    startPlaybackDll(fileInfo) {
        let { devSerialNum, channel, productKey, startTime, endTime, fileSize, plate, channelName } = fileInfo;
        let params = {
            deviceCode: devSerialNum,
            channelNum: channel,
            channelName: channelName,
            productKey: productKey,
            startTime: startTime,
            endTime: endTime,
            fileSize: fileSize,
            plate: plate,
        }
        Vue.prototype.$api.getPlayBackUrl(params).then((res) => {
            let errorCode = ''
            if (res.code == "device_offline" || res.code == "EC.device.not.online" || res.code == "device_dormancy") {
                errorCode = 0x01000000
            }
            if (res.success == true) {
                if (res.data != null || res.data != undefined) {
                    let url = res.data;
                    if (url.length == 0) {
                        this.playControl.JS_RequestInterface({
                            funcName: "notifyError",
                            arguments: {
                                msg: 'startPlaybackNotify',
                                errorCode: errorCode,
                                errorMsg: res.msg
                            }
                        }).then((oData) => {
                            Vue.prototype.$message.error('获取url失败！');
                        });
                    } else {
                        this.playControl.JS_RequestInterface({
                            funcName: "startPlayback",
                            arguments: {
                                url: url,
                                code: 0,
                                playTimeSync: true,
                                ...fileInfo
                            }
                        }).then(function (oData) { });
                    }
                } else {
                    this.playControl.JS_RequestInterface({
                        funcName: "notifyError",
                        arguments: {
                            msg: 'startPlaybackNotify',
                            errorCode: errorCode,
                            errorMsg: res.msg
                        }
                    }).then((oData) => {
                        Vue.prototype.$message.error('获取url失败！');
                    });
                }
            } else {
                this.playControl.JS_RequestInterface({
                    funcName: "notifyError",
                    arguments: {
                        msg: 'startPlaybackNotify',
                        errorCode: errorCode,
                        errorMsg: res.msg
                    }
                }).then((oData) => {
                    Vue.prototype.$message.error(res.msg);
                });
            }
        });
    }

    /**
     * @function(控件初始化完成回调函数绑定)
     * 
     */
    cbIntegrationCallBack = async (oData) => {
        if (oData.responseMsg.event == 'startPlaybackNotify') {
            let info = oData.responseMsg.msg;
            this.startPlaybackDll(info);
            if (!(this.startPlaybackNotifyFN instanceof Function)) return;
            /**
            * 拖动进度条回调
            * @param(控件回调参数，this指向VUE实例)
            * 
           */
            this.startPlaybackNotifyFN.call(this.$that, info);
        }
        if (oData.responseMsg.event == 'playbackTrackNotify') {
            let info = oData.responseMsg.msg;
            if (!(this.playbackTrackNotifyFN instanceof Function)) return;
            /**
            * 每隔一段时间播放回调
            * @param(当控件回调参数，this指向VUE实例)
            * 
           */
            this.playbackTrackNotifyFN.call(this.$that, info);
        }
        if (await this.getDeviceInfoByDeviceCodeOfMonitorAPI(this.carId)) {
            return;
        }
        this.playControl.JS_RequestInterface({
            funcName: "notifyError",
            arguments: {
                "msg": "startPlaybackNotify",
                "errorCode": 0x01000000,
                "errorMsg": "设备离线"
            },
        })
    }
}
export default {
    name: 'WebPlayBack',
    control: WebPlayBack
}