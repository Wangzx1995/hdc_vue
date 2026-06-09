/**
 *
 * 回放
 *
 *  */
import moment from "moment";
import control from "./lib/control.vue";
import JSPlugin_Base from "./lib/JSPlugin_Base";
import Vue from "vue";

const ERROR_STREAM_TRANS = 1001; //码流传输过程异常
const ERROR_STREAM_PLAYBACK_END = 1002; //回放结束
const CONNECTION_CLOSED = 1003; //连接被动断开
const ERROR_VIDEO_CODING = 2001; //视频编码格式不支持
const ERROR_CAPTURE_MEMORY = 2002; //内存不足，抓图失败
const ANNOUNCE_DEV_CONN_STATUS = 3003; //媒体与设备交互通知

class JSPlugin_B extends JSPlugin_Base {
    constructor(domId, option = {}, setting) {
        Object.assign(option, {
            iMaxSplit: 2,
            iCurrentSplit: 1,
            aCustom: [{ width: 1, height: 1 }],
        });
        super(domId, option);
        this.setPlayTime = null;
        this.tipsList = [];
        this.controlList = [];
        this.activeControlList = [];
        this.setting = setting || {};
        this.deviceStatus = 1;
        this.parentWnd = document.getElementsByClassName("parent-wnd")[0];
        this.initControlFn();
        this.initCallBack();
        this.initControl();
        this.setWindowControlCallback();
        this.setPlayControl();
        this.toggleTextPosition();
        this.timeBar = null;
        this.playState = false;
        (this.timeBarFileInfo = null),
            (this.checkCount = [
                {
                    playTimeStamp: null,
                    count: 0,
                    i: 0,
                    j: 0,
                    file: null,
                    ifInOneS: false,
                },
                {
                    playTimeStamp: null,
                    count: 0,
                    i: 0,
                    j: 0,
                    file: null,
                    ifInOneS: false,
                },
            ]);
        // this.initChannelName();
    }
    setTimeBar(timeBar) {
        this.timeBar = timeBar;
    }
    initControl() {
        let Task = Vue.extend(control);
        [...this.parentWnd.children].forEach((dom, index) => {
            let taskvm = new Task({
                propsData: {
                    jsPlugin: this,
                    controlType: "back",
                    domId: this.domId,
                    iWndNum: index,
                    controlFn: this.controlFn,
                    getPlayBackUrl: this.getPlayBackUrl.bind(this),
                    changePlayState: this.changePlayState.bind(this),
                    rePlay: JSPlugin_B.rePlay.bind(this),
                    setting: this.setting,
                },
            });
            this.controlList.push(taskvm);
            this.activeControlList = this.controlList.slice(0, 1);
            dom.appendChild(taskvm.$mount().$el);
            dom.innterHtml = "";
        });
    }
    changePlayState() {
        let playControl = this.activeControlList.find((control) => {
            return control.isPlay;
        });
        if (playControl) {
            this.playState = true;
        } else {
            this.playState = false;
            this.clearPlayInterval();
        }
    }
    initControlFn() {
        this.controlFn = {
            play: this.play.bind(this),
            stop: this.stop.bind(this),
            fast: this.fast.bind(this),
            slow: this.slow.bind(this),
            capturePicture: this.capturePicture.bind(this),
            fullScreenSingle: this.fullScreenSingle.bind(this),
            fullScreenDisplay: this.fullScreenDisplay.bind(this),
            setVolume: this.setVolume.bind(this),
            openSound: this.openSound.bind(this),
            closeSound: this.closeSound.bind(this),
            setPlayAngle: this.setPlayAngle.bind(this),
            startSave: this.startSave.bind(this),
            stopSave: this.stopSave.bind(this),
            getOSDTime: this.getOSDTime.bind(this),
            getOSDTimeAllIWndNum: this.getOSDTimeAllIWndNum.bind(this),
            resume: this.resume.bind(this),
            pause: this.pause.bind(this),
            keyFrame: this.keyFrame.bind(this),
            disabledKeyFrame: this.disabledKeyFrame.bind(this),
            stopRealPlayAll: this.stopRealPlayAll.bind(this),
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
                        if (control.playSetInterval) {
                            clearInterval(control.playSetInterval);
                            control.playSetInterval = null;
                        }
                        break;
                    case ANNOUNCE_DEV_CONN_STATUS:
                        let content = iErrorData.content;
                        let text = "";
                        console.log("content: " + content);
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
                            text = "设备断开与媒体服务连接";
                            isReTry = true;
                        }
                        control.setText(text, false, false, isReTry);
                        control.isPlay = false;
                        if (control.playSetInterval) {
                            clearInterval(control.playSetInterval);
                            control.playSetInterval = null;
                        }
                        break;
                }
            },
        };
        let windowEventOver = (iWndIndex) => {
            if (!this.activeControlList[iWndIndex]) {
                return;
            }
            this.activeControlList[iWndIndex].fadeIn("bt");
            if (this.activeControlList[iWndIndex].isPlay) {
                this.activeControlList[iWndIndex].fadeIn("hd");
            }
        };
        let windowEventOut = (iWndIndex) => {
            if (!this.activeControlList[iWndIndex]) {
                return;
            }
            this.activeControlList[iWndIndex].fadeOut("bt");
            this.activeControlList[iWndIndex].fadeOut("hd");
        };
        this.callback.windowEventOver = windowEventOver;
        this.callback.windowEventOut = windowEventOut;
    }
    async setDeviceChannelList(deviceChannelList) {
        this.deviceChannelList = deviceChannelList;
        // this.setting.speedType = 1;
        // this.setting.coverType = 3;
        let channelLength = deviceChannelList.channelList.length;
        if (channelLength <= 1) {
            this.activeControlList = this.controlList.slice(0, 1);
            await this.arrangeWindow(1, [{ width: 1, height: 1 }]);
        } else {
            this.activeControlList = this.controlList.slice(0, 2);
            await this.arrangeWindow(1, [{ width: 0.5, height: 1 }]);
        }
        this.controlList.forEach((control) => {
            control.deviceChannelList = deviceChannelList;
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
    getPlayBackUrl(params) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$api
                .getPlayBackUrl(params)
                .then((res) => {
                    if (res.success) {
                        Vue.prototype.$api.eventTrackTrigger({
                            menu: "VIDEO_PLAYBACK",
                            business: "VIDEO_PLAYBACK_PLAY",
                            eventResult: res.success,
                        });
                        resolve(res.data);
                    } else {
                        if (res.code == "EC.device.not.online") {
                            reject({ msg: "设备离线，回放失败" });
                        } else {
                            reject({ msg: "获取回放url失败" + res.msg });
                        }
                    }
                })
                .catch((e) => {
                    reject({ msg: "获取回放url失败", isReplay: true });
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
    togglePlay(currentFileInfo) {
        if (this.activeControlList.length === 2) {
            if (
                !this.activeControlList[0].isPlay &&
                !this.activeControlList[0].isPause &&
                !this.activeControlList[1].isPlay &&
                !this.activeControlList[1].isPause
            ) {
                this.playAll(currentFileInfo);
                return;
            }
        }
        this.activeControlList.forEach((control, index) => {
            if (control.isPause) {
                control.resume_h();
            } else {
                control.play_b_getUrl(currentFileInfo[index]).then((file) => {
                    control.play_b_play(file);
                });
            }
        });
        if (!this.playFrame) {
            setTimeout(() => {
                this.initPlayInterval();
            }, 0);
        }
    }
    togglePause() {
        this.activeControlList.forEach((control) => {
            if (control.isPlay) {
                control.pause_h();
            }
        });
        if (this.playFrame) {
            cancelAnimationFrame(this.playFrame);
            this.playFrame = null;
        }
    }
    clearPlayInterval() {
        if (this.playFrame) {
            cancelAnimationFrame(this.playFrame);
            this.playFrame = null;
        }
    }
    clearFileFlag() {
        this.timeBarFileInfo.forEach((fileInfo) => {
            fileInfo.forEach((file) => {
                delete file.autoLimit;
            });
        });
    }
    async checkPlayfn(playTimeStamp) {
        let stopfileList = [null, null];
        for (let i = 0; i <= this.timeBarFileInfo.length - 1; i++) {
            let files = this.timeBarFileInfo[i];
            if (files) {
                for (let j = 0; j <= files.length - 1; j++) {
                    if (stopfileList[i]) {
                        //真傻逼用了return,赏个两个嘴巴子
                        continue;
                    }
                    let file = files[j];
                    let stopTimeStamp = moment(file.stopTime).valueOf() + 999;
                    let startTimeStamp = moment(file.startTime).valueOf();
                    //设备送流送的太垃圾了，会小于停止时间也就算了，还会大于停止时间，而且有可能还会大于下个的开始时间，垃圾！
                    if (
                        playTimeStamp < stopTimeStamp &&
                        playTimeStamp > startTimeStamp
                    ) {
                        if (
                            !this.activeControlList[i].isPlay &&
                            !file.autoLimit
                        ) {
                            this.activeControlList[i]
                                .play_b_getUrl(file)
                                .then((url) => {
                                    this.activeControlList[i].play_b_play(url);
                                });
                            file.autoLimit = true;
                        }
                        //送流送到最后1000毫秒直接结束,感觉目前这样写效果好一点
                        if (stopTimeStamp - playTimeStamp <= 1 * 1000) {
                            stopfileList[i] = { file, i, j };
                            this.clearPlayInterval();
                        } else if (stopTimeStamp - playTimeStamp <= 3 * 1000) {
                            if (
                                this.checkCount[i].playTimeStamp !==
                                playTimeStamp
                            ) {
                                let changeFile = {
                                    count: 0,
                                    playTimeStamp,
                                    file,
                                    i,
                                    j,
                                    ifInOneS:
                                        stopTimeStamp - playTimeStamp <=
                                        1 * 1500,
                                };
                                this.checkCount[i] = changeFile;
                            } else {
                                this.checkCount[i].count++;
                                if (this.checkCount[i].count >= 5) {
                                    stopfileList[i] = { file, i, j };
                                    this.clearPlayInterval();
                                }
                            }
                        }
                    }
                }
            }
        }
        let fileNotNull = stopfileList.filter((file) => {
            return file !== null;
        });
        if (!fileNotNull.length) {
            return;
        }
        //当fileNotNull长度是1的时候查看另一路的情况
        if (fileNotNull.length === 1) {
            let i = fileNotNull[0].i;
            let anIndex = i === 0 ? 1 : 0;
            if (this.checkCount[anIndex].playTimeStamp) {
                if (
                    this.checkCount[anIndex].count >= 2 ||
                    this.checkCount[anIndex].ifInOneS
                ) {
                    fileNotNull.push({
                        file: this.checkCount[anIndex].file,
                        i: this.checkCount[anIndex].i,
                        j: this.checkCount[anIndex].j,
                    });
                }
            }
        }
        this.checkCount = [
            {
                playTimeStamp: null,
                count: 0,
                i: 0,
                j: 0,
                file: null,
                ifInOneS: false,
            },
            {
                playTimeStamp: null,
                count: 0,
                i: 0,
                j: 0,
                file: null,
                ifInOneS: false,
            },
        ];
        if (fileNotNull.length === 1) {
            let stopfile = fileNotNull[0];
            let anIndex = stopfile.i === 1 ? 0 : 1;
            if (
                !this.activeControlList[anIndex] ||
                !this.activeControlList[anIndex].isPlay
            ) {
                this.stopRealPlayAll();
                if (!this.timeBarFileInfo[stopfile.i][stopfile.j + 1]) {
                    return;
                }
                let file = [null, null];
                file[stopfile.i] =
                    this.timeBarFileInfo[stopfile.i][stopfile.j + 1];
                setTimeout(() => {
                    this.playAll(file);
                }, 500);
            } else {
                this.activeControlList[stopfile.i].stop_h();
                setTimeout(() => {
                    this.initPlayInterval();
                }, 500);
            }
        }
        if (fileNotNull.length === 2) {
            let file = [null, null];
            fileNotNull.forEach((stopfile) => {
                if (this.timeBarFileInfo[stopfile.i][stopfile.j + 1]) {
                    file[stopfile.i] =
                        this.timeBarFileInfo[stopfile.i][stopfile.j + 1];
                }
            });
            this.stopRealPlayAll();
            let notNullFileLength = file.filter((item) => {
                return item !== null;
            }).length;
            if (notNullFileLength.length === 2) {
                if (file[0].startTime !== file[1].startTime) {
                    if (moment(file[0].startTime) > moment(file[1].startTime)) {
                        file[0] = null;
                    } else {
                        file[1] = null;
                    }
                }
            }
            if (notNullFileLength === 0) {
                return;
            }
            setTimeout(() => {
                this.playAll(file);
            }, 1000);
        }
    }
    initPlayInterval() {
        //需要放在异步进程
        setTimeout(() => {
            let fn = () => {
                this.playFrame = requestAnimationFrame(fn);
                let szTime = this.getOSDTimeAllIWndNum();
                if (this.timeBar && this.timeBar.timeBar.m_bMOuseDown) {
                    return;
                }
                if (!szTime) {
                    return;
                }
                let playTimeStamp = moment(szTime);
                let currentPlayTime = playTimeStamp.format(
                    "YYYY-MM-DD HH:mm:ss"
                );
                // console.log(currentPlayTime, "当前播放时间");
                this.checkPlayfn(szTime, currentPlayTime);
                JSPlugin_B.playFn(currentPlayTime);
            };
            this.playFrame = requestAnimationFrame(fn);
        }, 1000);
    }
    playAll(currentFileInfo) {
        console.log("playAll");
        this.activeControlList.forEach((control, index) => {
            control.setText("");
        });
        if (this.timeBarFileInfo) {
            currentFileInfo.forEach((fileInfo, index) => {
                if (fileInfo === null && this.activeControlList[index]) {
                    this.activeControlList[index].setText(
                        "当前时间点没有文件",
                        false,
                        true
                    );
                }
            });
        }
        if (currentFileInfo[0] === null && currentFileInfo[1] === null) {
            return;
        }
        this.clearPlayInterval();
        this.clearFileFlag();
        let promiseList = [];
        setTimeout(() => {
            this.activeControlList.forEach((control, index) => {
                promiseList.push(control.play_b_getUrl(currentFileInfo[index]));
            });
            Promise.all(promiseList).then((fileList) => {
                fileList.forEach((file, index) => {
                    if (file) {
                        this.activeControlList[index].play_b_play(file);
                    }
                });
                this.initPlayInterval();
            });
        }, 100);
    }
    async stopRealPlayAll() {
        try {
            this.clearPlayInterval();
            this.activeControlList.forEach((task) => {
                task.isPlay = false;
                task.isPause = false;
                // task.voiceState = false;
                task.streamType = 1;
                task.record = false;
                task.setTextNull();
                task.state = 1;
                task.toggleing = false;
                task.clearInterval_h();
                task.setControlBackgroundUrl(true);
            });
            await this.playControl.HATJS_StopRealPlayAll();
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    toggleSpeed(n_rate) {
        this.activeControlList.forEach((control) => {
            control.rate = n_rate;
        });
    }
    togglekeyFrame(n_keyFrame) {
        this.activeControlList.forEach((control) => {
            control.keyFrameOpen = n_keyFrame;
        });
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
    pauseAll() {
        this.activeControlList.forEach((control) => {
            control.pause_h();
        });
    }
    resumeAll() {
        this.activeControlList.forEach((control) => {
            control.resume_h();
        });
    }
    clearInterval() {
        this.activeControlList.forEach((control) => {
            control.clearInterval_h();
        });
    }
    initChannelName() {
        let { channelNamelist, channelList } = this.deviceChannelList;
        if (!channelNamelist) {
            return;
        }
        this.activeControlList.forEach((_, index) => {
            let dom = document.getElementById(`jsplugin-channelName${index}`);
            if (dom) {
                let findItem = channelNamelist.find((item) => {
                    return item.channelNum === channelList[index];
                });
                if (findItem) {
                    dom.innerHTML = findItem.channelName;
                }
            }
        });
    }
    async offlineNotify() {
        this.activeControlList.forEach((task) => {
            task.setText("设备离线，回放失败");
        });
        this.deviceStatus = 0;
    }
    onlineNotify() {
        this.activeControlList.forEach((task) => {
            task.setText("");
        });
        this.deviceStatus = 1;
    }
}
export default JSPlugin_B;
