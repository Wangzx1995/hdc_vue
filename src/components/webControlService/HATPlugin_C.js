/* eslint-disable */
//import Vue from "vue";
import Vue from "vue/dist/vue.esm.js";
import { HATMediaJsPlugin } from "../../../static/jsplugin/HATMediaJsPlugin-1.0.0.js";

const ERROR_STREAM_TRANS = 1001; // 码流传输过程异常
const ERROR_STREAM_PLAYBACK_END = 1002; // 回放结束
const CONNECTION_CLOSED = 1003; // 连接被动断开
const ERROR_VIDEO_CODING = 2001; // 视频编码格式不支持
const ERROR_CAPTURE_MEMORY = 2002; // 内存不足，抓图失败

class HATPlugin_C {
    constructor(domId, deviceChannelList = {}, option = {}, setting) {
        this.domId = domId;
        this.dom = document.getElementById(domId);
        this.offsetHeight = this.dom.offsetHeight;
        this.offsetWidth = this.dom.offsetWidth;
        this.tipsList = [];
        this.controlList = [];
        this.activeControlList = [];
        this.setting = setting || {};
        const baseOpition = {
            szBasePath: "/static/jsplugin",
            szId: this.domId,
            iWidth: this.offsetWidth,
            iHeight: this.offsetHeight,
            iMaxSplit: 4,
            iCurrentSplit: 1,
            oStyle: {
                border: "#343434",
                borderSelect: "#343434",
                background: "#4C4B4B",
                coverType: 0,
            },
        };
        this.deviceChannelList = deviceChannelList;
        // const channelLength = deviceChannelList.channelList.length;
        // if (channelLength === 1) {
        //     baseOpition.iCurrentSplit = 1;
        // } else if (channelLength <= 4 && channelLength > 1) {
        //     baseOpition.iCurrentSplit = 2;
        // } else if (channelLength > 4 && channelLength <= 9) {
        //     baseOpition.iCurrentSplit = 3;
        // } else {
        //     baseOpition.iCurrentSplit = 4;
        // }
        const lastOption = { ...baseOpition, ...option };
        this.playControl = new HATMediaJsPlugin(lastOption);
        this.parentWnd = document.getElementsByClassName("parent-wnd")[0];
        this.initControlFn();
        this.initCallBack();
        this.setWindowControlCallback();
        this.bindResize();
    }
    static judgeSuitable() {
        const Sys = {};
        const ua = navigator.userAgent.toLowerCase();
        let s;
        (s = ua.match(/rv:([\d.]+)\) like gecko/))
            ? (Sys.ie = s[1])
            : (s = ua.match(/msie ([\d\.]+)/))
                ? (Sys.ie = s[1])
                : (s = ua.match(/edge\/([\d\.]+)/))
                    ? (Sys.edge = s[1])
                    : (s = ua.match(/firefox\/([\d\.]+)/))
                        ? (Sys.firefox = s[1])
                        : (s = ua.match(/(?:opera|opr).([\d\.]+)/))
                            ? (Sys.opera = s[1])
                            : (s = ua.match(/chrome\/([\d\.]+)/))
                                ? (Sys.chrome = s[1])
                                : (s = ua.match(/version\/([\d\.]+).*safari/))
                                    ? (Sys.safari = s[1])
                                    : 0;
        // 根据关系进行判断
        if (Sys.ie) return "IE: " + Sys.ie;
        if (Sys.edge) return "EDGE: " + Sys.edge;
        if (Sys.firefox) return "Firefox: " + Sys.firefox;
        if (Sys.chrome) return "Chrome: " + Sys.chrome;
        if (Sys.opera) return "Opera: " + Sys.opera;
        if (Sys.safari) return "Safari: " + Sys.safari;
        return "Unkonwn";
    }
    static getExploreName() {
        const userAgent = navigator.userAgent;
        if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
            return "Opera";
        } else if (
            userAgent.indexOf("compatible") > -1 &&
            userAgent.indexOf("MSIE") > -1
        ) {
            return "IE";
        } else if (userAgent.indexOf("Edge") > -1) {
            return "Edge";
        } else if (userAgent.indexOf("Firefox") > -1) {
            return "Firefox";
        } else if (
            userAgent.indexOf("Safari") > -1 &&
            userAgent.indexOf("Chrome") == -1
        ) {
            return "Safari";
        } else if (
            userAgent.indexOf("Chrome") > -1 &&
            userAgent.indexOf("Safari") > -1
        ) {
            return "Chrome";
        } else if (!!window.ActiveXObject || "ActiveXObject" in window) {
            return "IE>=11";
        } else {
            return "Unkonwn";
        }
    }
    initControlFn() {
        this.controlFn = {
            play: this.play.bind(this),
            stop: this.stop.bind(this),
            // capturePicture: this.capturePicture.bind(this),
            // fullScreenSingle: this.fullScreenSingle.bind(this),
            // fullScreenDisplay: this.fullScreenDisplay.bind(this),
            // setVolume: this.setVolume.bind(this),
            // openSound: this.openSound.bind(this),
            // closeSound: this.closeSound.bind(this),
            // setPlayAngle: this.setPlayAngle.bind(this),
        };
    }
    initCallBack() {
        this.callback = {
            mouseEvent() { },
            loadEventHandler() { },
            windowEventSelect() { },
            windowEventOver() { },
            windowEventOut() { },
            windowEventUp() { },
            windowFullCcreenChange() { },
            firstFrameDisplay() { },
            performanceLack() { },
            zoomEventResponse() { },
            pluginErrorHandler: async (iWndIndex, iErrorCode) => {
                // const control = this.controlList[iWndIndex];
                // switch (iErrorCode) {
                //     case ERROR_STREAM_TRANS:
                //         control.setText("码流传输过程异常");
                //         control.stop_h();
                //         break;
                //     case CONNECTION_CLOSED:
                //         control.setText("连接异常断开");
                //         control.isPlay = false;
                //         if (control.playSetTimeout) {
                //             clearInterval(control.playSetTimeout);
                //             control.playSetTimeout = null;
                //         }
                //         // await this.awaitFn();
                //         // control.play_h();
                //         break;
                //     // case ERROR_VIDEO_CODING:
                //     //         control.setText('视频编码格式不支持');
                //     //         control.stop_h();
                //     // break;
                //     // case ERROR_CAPTURE_MEMORY:
                //     //     control.setText('内存不足，抓图失败');
                //     //     control.stop_h();
                //     // break;
                // }
            },
        };
        // const windowEventOver = (iWndIndex) => {
        //     this.controlList[iWndIndex].fadeIn("bt");
        //     if (this.controlList[iWndIndex].isPlay) {
        //         this.controlList[iWndIndex].fadeIn("hd");
        //     }
        // };
        // const windowEventOut = (iWndIndex) => {
        //     this.controlList[iWndIndex].fadeOut("bt");
        //     this.controlList[iWndIndex].fadeOut("hd");
        // };
        // this.callback.windowEventOver = windowEventOver;
        // this.callback.windowEventOut = windowEventOut;
    }
    bindResize() {
        window.addEventListener("scroll", this.reSizeScroll);
        window.addEventListener("resize", this.reSizeResize);
    }
    unBindResize() {
        window.removeEventListener("scroll", this.reSizeScroll);
        window.removeEventListener("resize", this.reSizeResize);
    }
    reSizeScroll = async () => {
        this.offsetHeight = this.dom.offsetHeight;
        this.offsetWidth = this.dom.offsetWidth - 1;
        this.resize(this.offsetWidth, this.offsetHeight);
    };
    reSizeResize = async () => {
        this.offsetHeight = this.dom.offsetHeight;
        this.offsetWidth = this.dom.offsetWidth - 1;
        this.resize(this.offsetWidth, this.offsetHeight);
    };
    async resize(iWidth, iHeight) {
        try {
            await this.playControl.HATJS_Resize(iWidth, iHeight);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async getPluginVersion() {
        try {
            const res = await this.playControl.HATJS_GetSdkVersion();
            return Promise.resolve(res);
        } catch (e) {
            return Promise.reject(e);
        }
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
                        reject("获取流失败");
                    }
                })
                .catch(() => {
                    reject("获取流失败");
                });
        });
    }
    getPlayBackUrl(params) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$api
                .getPlayBackUrl(params)
                .then((res) => {
                    if (res.success) {
                        resolve(res.data);
                    } else {
                        console.error(res.msg);
                        reject("预览无可用流");
                    }
                })
                .catch((e) => {
                    console.error(e);
                    reject("预览无可用流");
                });
        });
    }

    play(playParams) {
        const { url, channel, szStartTime, szStopTime } = playParams;
        try {

            const res = this.playControl.HATJS_Play(
                url,
                {
                    playURL: url,
                },
                0
            );
            return Promise.resolve(res);

        } catch (e) {
            console.error(e);
            return Promise.reject("播放失败");
        }
    }
    stop(iWind) {
        try {
            this.playControl.HATJS_Stop(iWind);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    destroyWorker() {
        try {
            this.playControl.HATJS_DestroyAll();
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    stopRealPlayAll() {
        try {
            let res = this.playControl.HATJS_Stop(0);
            return Promise.resolve(res);
        } catch (e) {
            return Promise.reject(e);
        }
    }
    awaitFn(time = 1) {
        return new Promise((resovle) => {
            setTimeout(() => {
                resovle();
            }, time * 1000);
        });
    }
    async setPolygonInfo(aPolygons) {
        try {
            await this.playControl.HATJS_SetPolygonInfo(aPolygons);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async setLineInfo(aPolygons) {
        try {
            await this.playControl.HATJS_SetLineInfo(aPolygons);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async setCircleInfo(aPolygons) {
        try {
            await this.playControl.HATJS_SetCircleInfo(aPolygons);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async setRectInfo(aPolygons) {
        try {
            await this.playControl.HATJS_SetRectInfo(aPolygons);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async setMoveStatus(aPolygons) {
        try {
            await this.playControl.setMoveStatus(aPolygons);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async getPolygonInfo() {
        try {
            const res = await this.playControl.HATJS_GetPolygonInfo();
            return Promise.resolve(res);
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async getPointInfo() {
        try {
            const res = await this.playControl.HATJS_GetPointInfo();
            return Promise.resolve(res);
        } catch (e) {
            return Promise.reject(e);
        }
    }
    clearRegion() {
        this.playControl.HATJS_ClearRegion();

    }
}
export default HATPlugin_C;
