const backgroundUrl = "/static/images/video_bg.svg";

class JSPlugin_Base {
    constructor(domId, option = {}) {
        this.domId = domId;
        this.dom = document.getElementById(domId);
        this.offsetHeight = this.dom.offsetHeight;
        this.offsetWidth = this.dom.offsetWidth;
        let baseOpition = {
            szBasePath: "/static/jsplugin",
            szId: this.domId,
            iWidth: this.offsetWidth,
            iHeight: this.offsetHeight,
            iMaxSplit: 4,
            iCurrentSplit: 2,
            oStyle: {
                border: "#131a24",
                borderSelect: "#333333",
                background: "#333333",
                backgroundUrl: backgroundUrl,
            },
            customClass: "my-plugin-back-style",
            coverType: 3,
            usedBy: "car",
        };
        let lastOption = { ...baseOpition, ...option };
        this.playControl = new HATMediaJsPlugin(lastOption);
        this.bindResize();
    }
    static judgeSuitable() {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
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
    async arrangeWindow(iWndType, aCustom) {
        try {
            await this.playControl.HATJS_ArrangeWindow(iWndType, aCustom);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async getPluginVersion() {
        try {
            let res = await this.playControl.HATJS_GetPluginVersion();
            return Promise.resolve(res);
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async frameForward(iWndNum) {
        try {
            await this.playControl.HATJS_FrameForward(iWndNum);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async keyFrame(iWndNum) {
        try {
            await this.playControl.HATJS_KeyFrame(iWndNum);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async disabledKeyFrame(iWndNum) {
        try {
            await this.playControl.HATJS_DisabledKeyFrame(iWndNum);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async resume(iWndNum) {
        try {
            await this.playControl.HATJS_Resume(iWndNum);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async pause(iWndNum) {
        try {
            await this.playControl.HATJS_Pause(iWndNum);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async play(playParams) {
        let { url, channel, startTime, stopTime } = playParams;
        try {
            await this.playControl.HATJS_Play(
                url,
                {
                    playURL: url,
                },
                channel,
                startTime,
                stopTime
            );

            return Promise.resolve();
        } catch (e) {
            console.log(e);

            return Promise.reject(e);
        }
    }
    getOSDTimeAllIWndNum() {
        return this.playControl.HATJS_GetOSDTimeAllIWndNum();
    }
    async getOSDTime(iWndNum) {
        try {
            let { szTimeStamp } = await this.playControl.HATJS_GetOSDTime(
                iWndNum
            );
            return Promise.resolve(szTimeStamp);
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async stop(iWind) {
        try {
            this.setBackgroundUrl(iWind, true);
            await this.playControl.HATJS_Stop(iWind);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async capturePicture(iWind, szPictureName, szType) {
        try {
            await this.playControl.HATJS_CapturePicture(
                iWind,
                szPictureName,
                szType
            );
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async openSound(iWndNum) {
        try {
            await this.playControl.HATJS_OpenSound(iWndNum);
            this.activeControlList.forEach((control) => {
                if (control.iWndNum === iWndNum) {
                    control.voiceState = true;
                } else {
                    control.voiceState = false;
                }
            });
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async closeSound() {
        try {
            await this.playControl.HATJS_CloseSound();
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async getVolume(iWndNum) {
        try {
            let res = await this.playControl.HATJS_GetVolume(iWndNum);
            return Promise.resolve(res);
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async setVolume(iWndNum, iVolume) {
        try {
            this.playControl.HATJS_SetVolume(iWndNum, iVolume);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async openZoom(iWndNum) {
        try {
            console.log("openZoom", iWndNum);
            this.playControl.HATJS_EnableZoom(iWndNum);
            return Promise.resolve();
        } catch (e) {
            debugger;
            return Promise.reject(e);
        }
    }
    async closeZoom(iWndNum) {
        try {
            this.playControl.HATJS_DisableZoom(iWndNum);
            return Promise.resolve();
        } catch (e) {
            debugger;
            return Promise.reject(e);
        }
    }
    async destroyWorker() {
        try {
            await this.playControl.HATJS_DestroyPlugin();
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async selectWnd(iWndNum) {
        try {
            await this.playControl.HATJS_SelectWnd(iWndNum);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async fullScreenDisplay(bFullScreen) {
        try {
            await this.playControl.HATJS_FullScreenDisplay(bFullScreen);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async fullScreenSingle(iWind) {
        try {
            await this.playControl.HATJS_FullScreenSingle(iWind);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async resize(iWidth, iHeight) {
        try {
            await this.playControl.HATJS_Resize(iWidth, iHeight);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async setOptions(option) {
        try {
            await this.playControl.HATJS_SetOptions(option);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async fast(iWndNum) {
        try {
            await this.playControl.HATJS_Fast(iWndNum);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async slow(iWndNum) {
        try {
            await this.playControl.HATJS_Slow(iWndNum);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async startSave(iWndNum, fileName) {
        try {
            await this.playControl.HATJS_StartSave(iWndNum, fileName);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async stopSave(iWndNum) {
        try {
            await this.playControl.HATJS_StopSave(iWndNum);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    setPlayControl() {
        this.playControl.HATJS_SetWinConrtol();
    }
    wait() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }
    toggleTextPosition() {
        this.playControl.HATJS_SetTextPositon(this.setting.textPosition);
    }
    setPlayAngle(iWndNum, angle) {
        this.playControl.HATJS_SetPlayAngle(iWndNum, angle);
    }
    updateCoverType(coverType) {
        this.playControl.HATJS_UpdateCoverType(coverType);
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
        this.offsetWidth = this.dom.offsetWidth;
        this.resize(this.offsetWidth, this.offsetHeight);
    };
    reSizeResize = async () => {
        this.offsetHeight = this.dom.offsetHeight;
        this.offsetWidth = this.dom.offsetWidth;
        this.resize(this.offsetWidth, this.offsetHeight);
    };
    setBackgroundUrl(iWndNum, flag) {
        let url = flag ? backgroundUrl : "";
        this.playControl &&
            this.playControl.HATJS_SetBackgroundUrl &&
            this.playControl.HATJS_SetBackgroundUrl(iWndNum, url);
    }
}
export default JSPlugin_Base;
