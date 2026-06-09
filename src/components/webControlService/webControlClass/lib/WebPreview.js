import Vue from "vue";
import BaseWebControl from "../base/BaseWebControl";
/**
 *
 * @class 车辆预览
 * @constructor(domId)
 * @introduce
 *
 */
class WebPreview extends BaseWebControl {
    constructor(domId, cb) {
        super(domId);
        this.initIng = true;
        (async () => {
            this.CONFIG = {
                protocol: 0, //协议类型，默认0
                streamType: 1, //1-默认子码流,0-主码流
                code: 0,
                streamChangeIndex: -1,
                requestIp: JSON.parse(
                    window.sessionStorage.getItem("requestIp")
                ),
            };
            this.initNoneWebCon("loading");
            try {
                this.playControl = await this.initWebOcx();
                this.playControlState = "show";
                this.reInitSize();
                this.disconnectOnLoad();
                this.playControl.JS_RequestInterface({
                    funcName: "setPreviewLayout",
                    arguments: {
                        display: {
                            mainControl: { show: true },
                            subControl: { show: true, screenshotShow: false },
                        },
                    },
                });
                cb("success");
            } catch (msg) {
                if (msg === "控件未启动") {
                    Vue.prototype.$message.error(msg);
                }
                cb("error");
            }
        })();
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
                    playControl
                        .JS_StartService("window", {
                            dllPath: "./WebPreview.dll",
                        })
                        .then(() => {
                            playControl.JS_SetWindowControlCallback({
                                cbIntegrationCallBack:
                                    this.cbIntegrationCallBack,
                            });
                            playControl
                                .JS_CreateWnd(
                                    this.domId,
                                    this.offsetWidth,
                                    this.offsetHeight
                                )
                                .then(() => {
                                    this.removeNodes();
                                    this.initIng = false;
                                    /* 判断当前dom是否为初始化的dom,若不是，则不初始化 */
                                    let newDom = document.getElementById(
                                        this.domId
                                    );
                                    if (!newDom) {
                                        playControl.JS_Disconnect();
                                        return;
                                    }
                                    if (
                                        newDom.attributes["timeFlag"] !==
                                        this.dom.attributes["timeFlag"]
                                    ) {
                                        playControl.JS_Disconnect();
                                        return;
                                    }
                                    resove(playControl);
                                })
                                .catch(() => {
                                    this.initIng = false;
                                    reject("控件连接失败!");
                                });
                        })
                        .catch(() => {
                            this.initIng = false;
                            reject("控件连接失败!");
                        });
                },
                cbConnectError: () => {
                    this.initIng = false;
                    this.removeNodes();
                    this.initNoneWebCon("noneWebCon");
                    this.disconnectWebOcx();
                    reject("控件未启动");
                },
                cbConnectClose: () => {
                    this.removeNodes();
                    this.initNoneWebCon("noneWebCon");
                    this.disconnectWebOcx();
                },
            });
        });
    }
    /**
     * @function 设置预览布局，准备文件
     * @param {Number} carId 车辆id
     * @param {Object} option 配置项 {playAll:是否播放全部通道 :boolean}
     */
    setPreviewLayout(deviceCode, option, deviceId, channelCheckObj) {
        if (!deviceId) {
            return;
        }
        let defaultOption = {
            playAll: false,
        };
        option = { ...defaultOption, ...option };
        let { playAll, plate } = option;
        let obj = { deviceId: deviceId, abilityCode: "preview" };
        if (deviceId) {
            Object.assign(obj, { deviceId: deviceId });
        }
        Vue.prototype.$api
            .getDeviceInfoByCarId({
                deviceCode: deviceCode,
            })
            .then((res) => {
                if (res.success) {
                    let deviceInfo = res.data;
                    // let channelListTotal = res.data.channelList;
                    let channelListTotal = res.data.channelList.filter(
                        (item) => {
                            return item.channelNum == channelCheckObj;
                        }
                    );
                    let channelList = [];
                    channelListTotal.forEach((item) => {
                        channelList.push({
                            channel: item.channelNum,
                            channelName: item.channelName,
                        });
                    });
                    let channelCount = channelList.length;
                    if (channelCount === 0) {
                        Vue.prototype.$message.error("通道数为0，预览失败");
                        return;
                    }
                    if (channelCount >= 9) {
                        Vue.prototype.$message.info(
                            '当前预览最多支持8路通道，可前往 "多屏预览"查看更多'
                        );
                        channelList = channelList.slice(0, 8);
                        channelCount = 8;
                    }
                    let type = 1;
                    let params = {
                        layout: type,
                        deviceId: deviceInfo.id,
                        devSerialNum: String(deviceInfo.id),
                        productKey: deviceInfo.productKey,
                        channels: channelList,
                        plate,
                        display: {
                            mainControl: { show: true },
                            subControl: { show: true, screenshotShow: false },
                        },
                    };
                    this.playControl
                        .JS_RequestInterface({
                            funcName: "setPreviewLayout",
                            arguments: params,
                        })
                        .then(() => {
                            this.startPreview({
                                deviceId: deviceInfo.id,
                                devSerialNum: String(deviceInfo.id),
                                productKey: deviceInfo.productKey,
                                channelNum: channelCheckObj,
                                protocolType: this.CONFIG.protocolType,
                                streamType: this.CONFIG.streamType,
                            });
                        });
                } else {
                    Vue.prototype.$message.error(res.msg);
                }
            });
    }
    /**
     * @function 单通道开始预览,一般在类里自调用,很少外部调用
     * @param {Object} params 媒体播放参数
     *  deviceCode, channelNum, productKey, protocolType，streamType,
     */
    startPreview(params) {
        let param = JSON.parse(JSON.stringify(params));
        param.protocolType = 0;
        Vue.prototype.$api.getPreviewUrl(param).then((res) => {
            let errorCode = "";
            if (
                res.code == "device_offline" ||
                res.code == "EC.device.not.online" ||
                res.code == "device_dormancy"
            ) {
                errorCode = 0x01000000;
            }
            if (res.success == true) {
                let url = res.data;
                if (url === undefined || !url.length) {
                    this.playControl
                        .JS_RequestInterface({
                            funcName: "notifyError",
                            arguments: {
                                msg: "startPreviewNotify",
                                errorCode: errorCode,
                                errorMsg: res.msg,
                            },
                        })
                        .then(() => {
                            if (
                                res.code == "device_offline" ||
                                res.code == "EC.device.not.online" ||
                                res.code == "device_dormancy"
                            ) {
                                this.$message.error("车辆离线或休眠！");
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                } else {
                    this.playControl.JS_RequestInterface({
                        funcName: "startPreview",
                        arguments: {
                            url: url,
                            devSerialNum: params.devSerialNum,
                            channel: params.channelNum,
                            productKey: params.productKey,
                            protocol: params.protocolType,
                            streamType: params.streamType,
                            code: this.CONFIG.code,
                            deviceId: params.deviceId,
                            channelNum: params.channelNum,
                        },
                    });
                }
            } else {
                this.playControl
                    .JS_RequestInterface({
                        funcName: "notifyError",
                        arguments: {
                            msg: "startPreviewNotify",
                            errorCode: errorCode,
                            errorMsg: res.msg,
                        },
                    })
                    .then((oData) => {
                        Vue.prototype.$message.error("获取url失败，" + res.msg);
                        // if (
                        //     res.code == "device_offline" ||
                        //     res.code == "EC.device.not.online" ||
                        //     res.code == "device_dormancy"
                        // ) {
                        //     Vue.prototype.$message.error("车辆离线或休眠！");
                        // } else {
                        //     Vue.prototype.$message.error(
                        //         "获取url失败，没有返回预览url！"
                        //     );
                        // }
                    });
            }
        });
    }
    /**
     * @function 停止当前所有通道预览
     */
    stopAllPreview() {
        this.playControl &&
            this.playControl.JS_RequestInterface({
                funcName: "stopAllPreview",
            });
    }
    /**
     * @function(控件初始化完成回调函数绑定)
     *
     */
    cbIntegrationCallBack = (oData) => {
        if (oData.responseMsg.event == "startPreviewNotify") {
            let data = oData.responseMsg.msg;
            let params = {
                deviceId: data.devSerialNum,
                devSerialNum: data.devSerialNum,
                productKey: data.productKey,
                channelNum: data.channel,
                protocolType: data.protocol,
                streamType: data.streamType,
            };
            this.startPreview(params);
        }
        if (oData.responseMsg.event == "changeStreamNotify") {
            let data = oData.responseMsg.msg;
            let params = {
                deviceId: data.devSerialNum,
                devSerialNum: data.devSerialNum,
                productKey: data.productKey,
                channelNum: data.channel,
                protocolType: data.protocol,
                streamType: data.streamType,
            };
            this.startPreview(params);
        }
        if (oData.responseMsg.event == "startScreenShotNotify") {
            let data = oData.responseMsg.msg.channels;
            let params = { channelNums: [], deviceCode: "" };
            if (data && data.length > 0) {
                data.forEach((item) => {
                    params.deviceCode = item.devSerialNum;
                    params.channelNums.push(item.channel);
                });
            }
            Vue.prototype.$api
                .screenShotsList(params)
                .then((res) => {
                    this.playControl.JS_RequestInterface({
                        funcName: "startScreenShot",
                        arguments: {
                            msg: "result",
                        },
                    });
                    if (res.success) {
                        Vue.prototype.$message({
                            message: "请到下载任务-图片下载中查看",
                            type: "success",
                        });
                    } else {
                        Vue.prototype.$message.error(res.msg);
                    }
                })
                .catch(() => {
                    this.playControl.JS_RequestInterface({
                        funcName: "startScreenShot",
                        arguments: {
                            msg: "result",
                        },
                    });
                });
        }
    };
    /**
     * @function 通知控件设备上线，让设备自动去取流
     */
    onlineNotify() {
        this.playControl
            .JS_RequestInterface({
                funcName: "notifyError",
                arguments: {
                    msg: "startPreviewNotify",
                    errorCode: 0x01000001,
                    errorMsg: "设备上线",
                },
            })
            .then((oData) => {});
    }
    /**
     * @function 通知控件设备离线，让设备停止取流
     */
    offlineNotify() {
        this.playControl
            .JS_RequestInterface({
                funcName: "notifyError",
                arguments: {
                    msg: "startPreviewNotify",
                    errorCode: 0x01000000,
                    errorMsg: "设备离线",
                },
            })
            .then((oData) => {});
    }
    reInitSize() {
        this.reSizeResize();
    }
}
export default {
    name: "WebPreview",
    control: WebPreview,
};
