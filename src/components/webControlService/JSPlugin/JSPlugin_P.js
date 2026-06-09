/**
 *
 * 预览
 *
 *  */
import control from "./lib/control.vue";
import JSPlugin_Base from "./lib/JSPlugin_Base";
import Vue from "vue";

const ERROR_STREAM_TRANS = 1001; //码流传输过程异常
const ERROR_STREAM_PLAYBACK_END = 1002; //回放结束
const CONNECTION_CLOSED = 1003; //连接被动断开
const ERROR_VIDEO_CODING = 2001; //视频编码格式不支持
const ERROR_CAPTURE_MEMORY = 2002; //内存不足，抓图失败
const ANNOUNCE_DEV_CONN_STATUS = 3003; //媒体与设备交互通知

class JSPlugin_P extends JSPlugin_Base {
    constructor(domId, option = {}, deviceChannelList = {}, setting) {
        let channelLength = deviceChannelList.channelList
            ? Math.max(...deviceChannelList.channelList)
            : 1;
        let t_option = {};
        if (channelLength === 1) {
            t_option = { iCurrentSplit: 1 };
        } else if (channelLength <= 4 && channelLength > 1) {
            t_option = { iCurrentSplit: 2 };
        } else if (channelLength > 4 && channelLength <= 9) {
            t_option = { iCurrentSplit: 3 };
        } else {
            t_option = { iCurrentSplit: 4 };
        }
        Object.assign(option, t_option);
        super(domId, option);
        this.deviceChannelList = deviceChannelList;
        this.tipsList = [];
        this.controlList = [];
        this.activeControlList = [];
        this.setting = setting || {};
        this.flag = false;
        this.deviceStatus = 1;
        this.parentWnd = document.getElementsByClassName("parent-wnd")[0];
        this.initControlFn();
        this.initCallBack();
        this.initControl();
        this.setWindowControlCallback();
        this.initChannelName();
    }
    initControl() {
        let Task = Vue.extend(control);
        [...this.parentWnd.children].forEach((dom, index) => {
            let taskvm = new Task({
                propsData: {
                    domId: this.domId,
                    iWndNum: index,
                    controlFn: this.controlFn,
                    getPreviewUrl: this.getPreviewUrl.bind(this),
                    setting: this.setting,
                },
            });
            this.controlList.push(taskvm);
            // if (!this.deviceChannelList.channelList) {
            //     return;
            // }
            // this.activeControlList = this.controlList.filter((_i, index) => {
            //     return this.deviceChannelList.channelList.includes(index + 1);
            // });
            this.activeControlList = this.controlList.slice(0, 1);
            this.activeControlList.forEach((control) => {
                control.deviceChannelList = this.deviceChannelList;
            });
            dom.appendChild(taskvm.$mount().$el);
            dom.classList.remove("active-livePreview");
        });
        if (
            this.deviceChannelList.channelList &&
            this.deviceChannelList.channelList.length
        ) {
            this.parentWnd.children[
                this.deviceChannelList.channelList[0] - 1
            ].classList.add("active-livePreview");
            // let taskvm2 = new Task({
            //     propsData: {
            //         domId: this.domId,
            //         iWndNum: this.deviceChannelList.channelList[0] - 1,
            //         controlFn: this.controlFn,
            //         getPreviewUrl: this.getPreviewUrl.bind(this),
            //         setting: this.setting,
            //     },
            // });
            // // this.parentWnd.children[
            // //     this.deviceChannelList.channelList[0] - 1
            // // ].appendChild(taskvm2.$mount().$el);
            // const div = document.createElement("div");
            // div.setAttribute("id", "loading-wrapper");
            // this.parentWnd.children[
            //     this.deviceChannelList.channelList[0] - 1
            // ].append(div);
            // taskvm2.$mount("#loading-wrapper");
        }
    }
    initControlFn() {
        this.controlFn = {
            play: this.play.bind(this),
            stop: this.stop.bind(this),
            capturePicture: this.capturePicture.bind(this),
            fullScreenSingle: this.fullScreenSingle.bind(this),
            fullScreenDisplay: this.fullScreenDisplay.bind(this),
            setVolume: this.setVolume.bind(this),
            openSound: this.openSound.bind(this),
            closeSound: this.closeSound.bind(this),
            setPlayAngle: this.setPlayAngle.bind(this),
            startSave: this.startSave.bind(this),
            stopSave: this.stopSave.bind(this),
            setBackgroundUrl: this.setBackgroundUrl.bind(this),
            openZoom: this.openZoom.bind(this),
            closeZoom: this.closeZoom.bind(this),
        };
    }
    initCallBack() {
        this.callback = {
            mouseEvent: function () {},
            loadEventHandler: function () {},
            windowEventSelect: function () {},
            windowEventOver: function () {},
            windowEventOut: function () {},
            windowEventUp: function () {},
            windowFullCcreenChange: function () {},
            firstFrameDisplay: function () {},
            performanceLack: function () {},
            zoomEventResponse: function () {},
            pluginErrorHandler: async (iWndIndex, iErrorCode, iErrorData) => {
                let control = this.controlList[iWndIndex];
                let isReTry = false;
                switch (iErrorCode) {
                    case ERROR_STREAM_TRANS:
                        control.setText("码流传输过程异常");
                        control.stop_h();
                        break;
                    case CONNECTION_CLOSED:
                        if (
                            this.deviceStatus == 1 &&
                            control.status != "Fail"
                        ) {
                            control.setText("链接断开，设备未推流");
                        }
                        control.isPlay = false;
                        if (control.playSetTimeout) {
                            clearInterval(control.playSetTimeout);
                            control.playSetTimeout = null;
                        }
                        break;
                    case ANNOUNCE_DEV_CONN_STATUS:
                        let content = iErrorData.content;
                        let text = "";
                        if (content.indexOf("Status=Succ") > -1) {
                            control.status = "Succ";
                            return;
                        }
                        if (content.indexOf("Status=Fail") > -1) {
                            control.status = "Fail";
                            text = "取流失败，设备未推流";
                            if (content.indexOf("DevRsp=-1") > -1) {
                                text = "设备未及时连接媒体";
                                isReTry = true;
                            } else if (content.indexOf("DevRsp=1") > -1) {
                                text = "设备应答当前通道取流失败";
                                isReTry = true;
                            } else if (content.indexOf("DevRsp=2") > -1) {
                                text = "设备应答当前通道取流消息有误";
                                isReTry = true;
                            } else if (content.indexOf("DevRsp=3") > -1) {
                                text = "设备当前通道不支持取流，请联系设备厂商";
                            }
                        } else if (content.indexOf("Status=Break") > -1) {
                            control.status = "Fail";
                            text = "网络波动，设备断开与媒体服务连接";
                            isReTry = true;
                        }
                        control.setText(text, false, false, isReTry);
                        control.isPlay = false;
                        if (control.playSetTimeout) {
                            clearInterval(control.playSetTimeout);
                            control.playSetTimeout = null;
                        }
                        break;
                }
            },
        };
        let windowEventOver = (iWndIndex) => {
            let activeInstant = this.activeControlList.find(({ iWndNum }) => {
                return iWndNum === iWndIndex;
            });
            if (!activeInstant) {
                return;
            }
            activeInstant.fadeIn("bt");
            if (activeInstant.isPlay) {
                activeInstant.fadeIn("hd");
            }
        };
        let windowEventOut = (iWndIndex) => {
            let activeInstant = this.activeControlList.find(({ iWndNum }) => {
                return iWndNum === iWndIndex;
            });
            if (!activeInstant) {
                return;
            }
            activeInstant.fadeOut("bt");
            activeInstant.fadeOut("hd");
        };
        this.callback.windowEventOver = windowEventOver;
        this.callback.windowEventOut = windowEventOut;
    }
    async setDeviceChannelList(deviceChannelList) {
        this.deviceChannelList = deviceChannelList;
        // this.initControl();
        let channelLength = Math.max(...deviceChannelList.channelList);
        // if (channelLength === 1) {
        //     await this.arrangeWindow(1);
        // } else if (channelLength <= 4 && channelLength > 1) {
        //     await this.arrangeWindow(1);
        // } else if (channelLength > 4 && channelLength <= 9) {
        //     await this.arrangeWindow(1);
        // } else {
        //     await this.arrangeWindow(1);
        // }
        await this.arrangeWindow(1);
        this.activeControlList = this.controlList.filter((_i, index) => {
            return this.deviceChannelList.channelList.includes(index + 1);
        });
        this.activeControlList.forEach((control) => {
            control.deviceChannelList = this.deviceChannelList;
        });
        this.initChannelName();
        return Promise.resolve();
    }
    async setWindowControlCallback() {
        try {
            this.playControl.EventCallback = this.callback;
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    getPreviewUrl(params) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$api
                .getPreviewUrl(params)
                .then((res) => {
                    if (res.success) {
                        resolve(res.data);
                    } else {
                        if (res.code === "EC.device.not.offline") {
                            // reject({error:"设备离线或休眠"});
                            reject("设备离线或休眠");
                        } else {
                            reject({ msg: "获取url失败，" + res.msg });
                        }
                        Vue.prototype.$message.error("获取url失败，" + res.msg);
                    }
                })
                .catch(() => {
                    reject({ msg: "获取url失败", isReplay: true });
                });
        });
    }
    toggleStreamTypeAll(streamType) {
        this.activeControlList.forEach((control) => {
            if (control.isPlay && control.streamType !== streamType) {
                control.stop_h().then(() => {
                    control.play_h();
                });
            }
            control.streamType = streamType;
        });
    }
    playAll() {
        this.activeControlList.forEach((control) => {
            control.play_h();
        });
    }
    async stopRealPlayAll() {
        try {
            this.activeControlList.forEach((task) => {
                task.isPlay = false;
                task.voiceState = false;
                task.streamType = 1;
                task.setTextNull();
                task.state = 1;
                task.toggleing = false;
                task.clearInterval_h();
                task.setControlBackgroundUrl(true)
            });
            await this.playControl.HATJS_StopRealPlayAll();
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    capturePictureAll() {
        this.activeControlList.forEach((control) => {
            if (control.isPlay) {
                control.capturePicture_h();
            }
        });
    }
    setControlFn(controlFn) {
        Object.assign(this.controlFn, controlFn);
    }
    setCallBack(callback) {
        Object.assign(this.callback, callback);
    }
    initChannelName() {
        let { channelNamelist } = this.deviceChannelList;
        this.activeControlList.forEach(({ iWndNum }) => {
            let dom = document.getElementById(`jsplugin-channelName${iWndNum}`);
            if (dom && channelNamelist && channelNamelist.length) {
                let findItem = channelNamelist.find((item) => {
                    return item.channelNum - 1 === iWndNum;
                });
                if (findItem) {
                    dom.innerHTML = findItem.channelName;
                }
            }
        });
        if (
            this.deviceChannelList.channelList &&
            this.deviceChannelList.channelList.length
        ) {
            [...this.parentWnd.children].forEach((dom, index) => {
                dom.classList.remove("active-livePreview");
                if (index === this.deviceChannelList.channelList[0] - 1) {
                    dom.classList.add("active-livePreview");
                }
            });
        }
    }
    // 设备离线通知，需要在页面上显示离线消息
    offlineNotify() {
        this.activeControlList.forEach((control) => {
            control.setText("设备离线，预览失败");
            control.clearInterval_h();
        });
        this.deviceStatus = 0;
    }
    onlineNotify() {
        this.deviceStatus = 1;
    }
    reInitSize() {
        this.reSizeResize();
    }
}
export default JSPlugin_P;
