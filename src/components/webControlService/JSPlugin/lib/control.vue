<template>
    <div class="contentAll">
        <div class="header" ref="hd">
            <span class="title-channel" :title="channelName"
                ><span>{{ channelName }}</span></span
            >
            <span>
                {{ time_n }}秒后<span v-if="state === 1">结束，</span>
                <span
                    class="text-info pointer"
                    @click="continuePlay"
                    v-if="state === 1"
                    >继续</span
                >
                <span v-if="state === 2">即将续播</span>
            </span>
        </div>
        <div class="tips">
            <div
                class="recordStyle flex-layout flex-middle"
                v-if="recordTime !== ''"
            >
                <div class="circle"></div>
                <span class="m-l-xs">
                    {{ recordTime }}
                </span>
            </div>
            <div>
                <div class="text-center" v-show="text">{{ channelName }}</div>
                <div>
                    <span v-show="loadingText"
                        ><i class="el-icon-loading"></i
                    ></span>
                    <span>{{ text }}</span>
                    <span v-show="isReTry"
                        >，<span class="text-info pointer" @click="play_h()"
                            >请重试</span
                        ></span
                    >
                </div>
            </div>
        </div>
        <div
            :class="controlType === 'back' ? 'contentbt' : 'contentbt-pre'"
            ref="bt"
        >
            <div class="contentIn">
                <div class="leftContent">
                    <img
                        :src="`/static/images/control/${
                            isPlay ? 'pause' : 'play'
                        }.png`"
                        @click.stop="isPlay ? stop_h() : play_h()"
                        :title="isPlay ? '停止' : '播放'"
                        v-show="controlType === 'pre'"
                    />
                    <div
                        class="stream"
                        @click="toggleStreamType"
                        v-show="controlType === 'pre'"
                    >
                        <span :title="streamType ? '切换高清' : '切换标清'">{{
                            streamType ? "标清" : "高清"
                        }}</span>
                    </div>
                </div>
                <div class="rightContent">
                    <span
                        :class="
                            zoomIn
                                ? 'el-icon-zoom-in zoom-in control-icon'
                                : 'el-icon-zoom-in control-icon'
                        "
                        @click.stop="zoomCanvas"
                        notDb="true"
                    ></span>

                    <img
                        src="/static/images/control/rotate.svg"
                        @click.stop="rotateCanvas"
                        title="旋转"
                    />
                    <img
                        :src="`/static/images/control/${
                            voiceState ? 'voice.svg' : 'noVoice.svg'
                        }`"
                        @click.stop="toggleVoice"
                        :title="voiceState ? '静音' : '开启声音'"
                    />
                    <img
                        src="/static/images/control/carmera.svg"
                        @click.stop="capturePicture_h"
                        title="抓图"
                    />
                    <img
                        v-show="controlType === 'back'"
                        :src="`/static/images/control/record-${
                            record ? 'open' : 'close'
                        }.svg`"
                        @click.stop="record ? stopSave_h() : startSave_h()"
                        title="录屏"
                    />
                    <img
                        src="/static/images/control/bigger.svg"
                        @click.stop="fullScreenSingle_h"
                        title="全屏"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { debounce } from "@/utils/controlFn.js";
import Timer from "@/utils/time";

export default {
    props: {
        controlType: {
            type: String,
            default: "pre",
        },
        domId: {
            type: String,
        },
        iWndNum: {
            type: Number,
            default: 0,
        },
        controlFn: {
            type: Object,
            default: () => {
                return {};
            },
        },
        getPreviewUrl: {
            type: Function,
        },
        getPlayBackUrl: {
            type: Function,
        },
        setPlayTime: {
            type: Function,
        },
        setting: {
            type: Object,
        },
        changePlayState: {
            type: Function,
        },
        rePlay: {
            type: Function,
        },
    },
    data() {
        return {
            recordInterVal: null,
            recordTimeNumber: 0,
            rate: 1,
            keyFrameOpen: false,
            isPlay: false,
            isPause: false,
            isReTry: false, //是否显示请重试
            streamType: 1, //1 标清子码流， 0 主码流,
            rotate: 0,
            zoomIn: false, //是否开启电子放大
            text: "",
            time_n: 180,
            playSetInterval: null,
            state: 1,
            voiceState: false,
            loadingText: false,
            record: false,
            timeOut: null,
            toggleing: false,
            timeBar: null,
            deviceChannelList: {},
            play_b_getUrl_id: 0,
        };
    },
    methods: {
        startSave_h() {
            if (!this.isPlay && !this.toggleing) {
                this.setText(`请先开启${this.textName}`, false, true);
                return;
            }
            let fileName = `${
                this.deviceChannelList.previewCarNum ||
                this.deviceChannelList.plate
            }_${this.channelName}_${this.$moment().format(
                "YYYY-MM-DD HH:mm:ss"
            )}`;
            this.startSave(this.iWndNum, fileName);
            this.record = true;
        },
        stopSave_h() {
            this.stopSave(this.iWndNum);
            this.record = false;
        },
        /**
         *
         * @param {*} text 显示的文字
         * @param {*} loading 是否显示loading图标
         * @param {*} autoNone 是否自动消失
         * @param {*} isReTry 是否显示“请重试”
         */
        setText(text, loading = false, autoNone = false, isReTry = false) {
            console.log("setText", text);
            this.setTextNull();
            this.text = text;
            this.isReTry = isReTry;
            loading && (this.loadingText = true);
            if (autoNone) {
                if (this.timeOut) {
                    window.clearTimeout(this.timeOut);
                    this.timeOut = null;
                }
                this.timeOut = setTimeout(() => {
                    this.setTextNull();
                }, 1000);
            }
            this.setBackgroundUrl(this.iWndNum, false);
        },
        setTextNull() {
            this.text = "";
            this.loadingText = false;
            if (this.timeOut) {
                window.clearTimeout(this.timeOut);
                this.timeOut = null;
            }
        },
        setControlBackgroundUrl(flag) {
            this.setBackgroundUrl(this.iWndNum, flag);
        },
        continuePlay() {
            this.state = 2;
        },
        fadeIn(type) {
            this.$refs[type].style.display = "flex";
        },
        fadeOut(type) {
            this.$refs[type].style.display = "none";
        },
        async play_h() {
            this.controlType === "pre" ? this.play_p() : this.rePlay();
        },
        async play_p() {
            if (this.toggleing) {
                return;
            }
            this.toggleing = true;
            this.setText("获取数据中...", true);
            let tempC = deepCopy(this.deviceChannelList);
            tempC.channelNum = this.iWndNum + 1;
            tempC.streamType = this.streamType;
            this.zoomInClose();
            try {
                let url = await this.getPreviewUrl(tempC);
                // return
                if (url.error) {
                    this.setText(url.error);
                    return;
                }
                // url = "wss://wstest1.hikvisionauto.com:10650/JT808_5370789321_1_1_uuid=98f41442b6a3fb5798f41442b6a3fb57c_realplay"
                await this.play({ url, channel: this.iWndNum });
                this.setText();
                setTimeout(() => {
                    this.openSound_h();
                }, 1000);
                this.isPlay = true;
                this.clearInterval_h();
                this.time_n = this.setting.lastTime;
                this.playSetInterval = setInterval(this.intervalFn, 1000);
                this.setTextNull();
                this.toggleing = false;
                return Promise.resolve();
            } catch (e) {
                if (!this.text || this.text == "获取数据中...") {
                    if (typeof e == "object") {
                        this.setText(
                            e.error || e.msg,
                            false,
                            false,
                            e.isReplay
                        );
                    } else {
                        if (e == "url超时或被重复使用")
                            this.setText(e, false, false, true);
                    }
                }
                this.toggleing = false;
                return Promise.reject(e);
            }
        },
        awaitTime(time = 500) {
            return new Promise((resovle) => {
                setTimeout(() => {
                    resovle();
                }, time);
            });
        },
        async play_b_getUrl(fileInfo) {
            console.log("play_b_getUrl");
            if (!fileInfo) {
                return Promise.resolve(null);
            }
            this.play_b_getUrl_id++;
            fileInfo.autoLimit = true;
            let { fileSize, startTime, stopTime, avEncoding, currentPlayTime } =
                fileInfo;
            this.setText("获取数据中...", true);
            let tempC = deepCopy(this.deviceChannelList);
            Object.assign(
                tempC,
                {
                    channelNo: tempC.channelList[this.iWndNum],
                    streamType: this.streamType,
                    fileSize,
                    startTime: currentPlayTime ? currentPlayTime : startTime,
                    endTime: stopTime,
                    protocolType: 3,
                },
                avEncoding
            );
            try {
                let play_b_getUrl_id = this.play_b_getUrl_id;
                let url = await this.getPlayBackUrl(tempC);
                console.log(url);
                //人为等待500ms，设置500ms缓冲，避免同一时间下发多个wss连接指令
                await this.awaitTime();
                if (play_b_getUrl_id === this.play_b_getUrl_id) {
                    fileInfo.url = url;
                    return Promise.resolve(fileInfo);
                } else {
                    return Promise.resolve(null);
                }
            } catch (e) {
                console.log("play_b_getUrl", e);
                if (!this.text || this.text == "获取数据中...") {
                    if (typeof e == "object") {
                        this.setText(
                            e.error || e.msg,
                            false,
                            false,
                            e.isReplay
                        );
                    } else {
                        if (e == "url超时或被重复使用")
                            this.setText(e, false, false, true);
                    }
                }
                return Promise.resolve(null);
            }
        },
        checkedSpeed() {
            if (!this.isPlay || this.rate === 1) {
                return;
            }
            for (let i = 1; i <= this.rate / 2; i++) {
                this["fast"](this.iWndNum);
            }
        },
        checkedKeyFrame() {
            this.keyFrameOpen && this.keyFrame(this.iWndNum);
        },
        checkedSound() {
            this.voiceState && this.openSound_h();
        },
        async play_b_play(fileInfo) {
            try {
                if (!fileInfo) {
                    this.toggleing = false;
                    return Promise.resolve();
                }
                let { url, startTime, stopTime, currentPlayTime } = fileInfo;
                delete fileInfo.url;
                if (currentPlayTime) {
                    delete fileInfo.currentPlayTime;
                }
                await this.play({
                    url,
                    channel: this.iWndNum,
                    startTime: currentPlayTime ? currentPlayTime : startTime,
                    stopTime,
                });
                setTimeout(() => {
                    this.openSound_h();
                }, 1000);
                this.isPlay = true;
                this.setText();
                this.checkedSpeed();
                this.checkedKeyFrame();
                this.checkedSound();
                this.time_n = this.setting.lastTime;
                this.playSetInterval = setInterval(this.intervalFn, 1000);
                this.setTextNull();
                this.toggleing = false;
                return Promise.resolve();
            } catch (e) {
                console.log("play_b_play", this.text);
                if (!this.text || this.text == "获取数据中...") {
                    if (typeof e == "object") {
                        this.setText(e.error || e.msg);
                    } else {
                        if (e == "url超时或被重复使用")
                            this.setText(e, false, false, true);
                    }
                }
                this.toggleing = false;
                return Promise.reject(e);
            }
        },
        async stop_h() {
            if (this.toggleing) {
                return;
            }
            try {
                this.clearInterval_h();
                await this.stop(this.iWndNum);
                this.isPlay = false;
                this.isPause = false;
                if (this.controlType === "pre") {
                    this.voiceState = false;
                }
                this.record = false;
                this.fadeOut("hd");
                this.toggleing = false;
                this.zoomInClose();
                return Promise.resolve();
            } catch (e) {
                this.toggleing = false;
                return Promise.reject();
            }
        },
        async pause_h() {
            try {
                await this.pause(this.iWndNum);
                clearInterval(this.playSetInterval);
                this.playSetInterval = null;
                this.isPause = true;
                this.isPlay = false;
                return Promise.resolve();
            } catch (e) {
                return Promise.reject(e);
            }
        },
        async resume_h() {
            try {
                await this.resume(this.iWndNum);
                this.playSetInterval = setInterval(this.intervalFn, 1000);
                this.isPause = false;
                this.isPlay = true;
                this.setText();
                // this.checkedSpeed();
                return Promise.resolve();
            } catch (e) {
                return Promise.reject(e);
            }
        },
        async openSound_h() {
            if (!this.isPlay && !this.toggleing) {
                this.setText(`请先开启${this.textName}`, false, true);
                return;
            }
            try {
                await this.openSound(this.iWndNum);
                await this.setVolume(this.iWndNum, this.setting.voice);
                return Promise.resolve();
            } catch (e) {
                return Promise.reject(e);
            }
        },
        async closeSound_h() {
            try {
                await this.closeSound(this.iWndNum);
                return Promise.resolve();
            } catch (e) {
                return Promise.reject(e);
            }
        },
        async capturePicture_h() {
            if (!this.isPlay && !this.toggleing) {
                this.setText(`请先开启${this.textName}`, false, true);
                return;
            }
            try {
                let fileName = `${
                    this.deviceChannelList.previewCarNum ||
                    this.deviceChannelList.plate
                }_${this.channelName}_${this.$moment().format(
                    "YYYY-MM-DD HH:mm:ss"
                )}`;
                await this.capturePicture(this.iWndNum, fileName);
            } catch (e) {
                // this.setText("请先开始预览");
            }
        },
        async fullScreenSingle_h() {
            // if (!this.isPlay) {
            //     this.setText("请先开启预览", false, true);
            //     return;
            // }
            try {
                await this.fullScreenSingle(this.iWndNum);
            } catch (e) {
                this.setText(`请先开启${this.textName}`, false, true);
            }
        },
        async toggleVoice() {
            if (this.voiceState) {
                try {
                    await this.closeSound_h();
                    this.voiceState = false;
                } catch (e) {
                    console.error(e);
                }
            } else {
                if (!this.isPlay) {
                    this.setText(`请先开启${this.textName}`, false, true);
                    return;
                }
                try {
                    await this.openSound_h();
                    this.voiceState = true;
                } catch (e) {
                    console.error(e);
                }
            }
        },
        async toggleStreamType() {
            this.streamType = this.streamType === 1 ? 0 : 1;
            try {
                if (this.isPlay) {
                    await this.stop_h();
                }
                await this.play_h();
            } catch (e) {}
        },
        rotateCanvas() {
            if (!this.isPlay && !this.toggleing) {
                this.setText(`请先开启${this.textName}`, false, true);
                return;
            }
            this.rotate = this.rotate + 90;
            this.setPlayAngle(this.iWndNum, this.rotate);
        },
        //电子放大
        zoomCanvas() {
            this.zoomIn = !this.zoomIn;
            if (this.zoomIn) {
                this.zoomInOpen();
            } else {
                this.zoomInClose();
            }
        },
        zoomInOpen() {
            // this.fadeOut("tips")
            this.openZoom(this.iWndNum);
            this.zoomIn = true;
        },
        zoomInClose() {
            // this.fadeIn("tips")
            this.closeZoom(this.iWndNum);
            this.zoomIn = false;
        },
        intervalFn() {
            this.time_n--;
            if (this.time_n === 0) {
                if (this.state === 2) {
                    this.time_n = this.setting.lastTime;
                    this.state = 1;
                } else {
                    this.stop_h();
                    this.setText("播放倒计时结束");
                }
            }
        },
        clearInterval_h() {
            if (this.playSetInterval) {
                clearInterval(this.playSetInterval);
                this.playSetInterval = null;
            }
            this.time_n = this.setting.lastTime;
            this.state = 1;
        },
    },
    watch: {
        record(value) {
            if (value) {
                this.recordInterVal = setInterval(() => {
                    this.recordTimeNumber++;
                }, 1000);
            } else {
                if (this.recordInterVal) {
                    clearInterval(this.recordInterVal);
                    this.recordInterVal = false;
                }
                this.recordTimeNumber = 0;
            }
        },
        controlFn: {
            handler(controlFn) {
                Object.keys(controlFn).forEach((method) => {
                    this[method] = controlFn[method];
                });
            },
            immediate: true,
        },
        isPlay() {
            if (this.controlType === "back") {
                this.changePlayState();
            }
        },
        rate(value, oldVal) {
            let temp = value / oldVal;
            let fn = temp > 1 ? "fast" : "slow";
            temp = temp > 1 ? temp : oldVal / value;
            for (let i = 1; i <= temp / 2; i++) {
                this[fn](this.iWndNum);
            }
        },
        keyFrameOpen(keyFrameOpen) {
            if (keyFrameOpen) {
                this.keyFrame(this.iWndNum);
            } else {
                this.disabledKeyFrame(this.iWndNum);
            }
        },
    },
    computed: {
        recordTime() {
            if (this.record) {
                return Timer.formatTime(this.recordTimeNumber);
            } else {
                return "";
            }
        },
        textName() {
            if (this.controlType === "pre") {
                return "预览";
            } else {
                return "回放";
            }
        },
        channelName() {
            let deviceChannelList = this.deviceChannelList;
            if (
                checkKeys(deviceChannelList) &&
                deviceChannelList.channelNamelist
            ) {
                let findItem = deviceChannelList.channelNamelist.find(
                    ({ channelNum }) => {
                        if (this.controlType === "pre") {
                            return channelNum - 1 === this.iWndNum;
                        } else {
                            return (
                                channelNum ===
                                this.deviceChannelList.channelList[this.iWndNum]
                            );
                        }
                    }
                );
                if (findItem) {
                    return findItem.channelName;
                } else {
                    return "";
                }
            } else {
                return "";
            }
        },
        iVolume() {
            return Math.ceil((this.offsetY / 49) * 100);
        },
    },
    mounted() {
        // setTimeout(() => {
        //     this.deviceChannelList.test = 1;
        // },1500);
    },
};
</script>

<style lang="less" scoped>
.circle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: red;
}
.recordStyle {
    font-size: 14px;
    position: absolute;
    top: 12%;
    left: 5%;
    color: red;
}
.contentAll {
    top: 0;
    position: absolute;
    width: 100%;
    height: 100%;
}

.progress {
    width: 8px;
    height: 50px;
    background: gray;
    position: absolute;
    border-radius: 10px;
    top: -49px;
    left: 5px;

    .line {
        position: absolute;
        width: 100%;
        height: 4px;
        background: white;
    }
}

.header {
    z-index: 1000;
    padding: 0px 2%;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.6);
    display: none;
    width: 100%;
    height: 30px;
    position: absolute;
    top: 0;
    color: white;
    align-items: center;
}

.contentbt-pre {
    display: none;
    position: absolute;
    width: 100%;
    padding-left: 1px;
    padding-right: 1px;
    bottom: 1px;
    height: 30px;

    img {
        &:hover {
            background: rgba(245, 245, 245, 0.397);
        }

        padding: 2px;
        // margin: 0px 8px;
        cursor: pointer;
        box-sizing: content-box;
        width: 18px;
        height: 18px;
    }

    .leftContent {
        display: flex;
        align-items: center;
        text-align: left;
        width: 50%;

        .stream {
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            &:hover {
                background: rgba(245, 245, 245, 0.397);
            }

            line-height: 15px;
            color: white;
            font-size: 12px;
            height: 20px;
            width: 30px;
        }
    }

    .rightContent {
        display: flex;
    }

    .contentIn {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(0, 0, 0, 0.3);
    }
}

.contentbt {
    display: none;
    position: absolute;
    width: 100%;
    padding-left: 1px;
    padding-right: 1px;
    bottom: 1px;
    height: 30px;

    .contentIn {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(0, 0, 0, 0.3);
    }

    img {
        &:hover {
            background: rgba(245, 245, 245, 0.397);
        }

        padding: 2px;
        margin: 0px 8px;
        cursor: pointer;
        box-sizing: content-box;
        width: 18px;
        height: 18px;
    }

    .leftContent {
        display: flex;
        align-items: center;
        text-align: left;

        .stream {
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            &:hover {
                background: rgba(245, 245, 245, 0.397);
            }

            line-height: 15px;
            color: white;
            font-size: 12px;
            height: 20px;
            width: 30px;
            margin-left: 20px;
        }
    }

    .rightContent {
        display: flex;
    }
}

.title-channel {
    max-width: 70px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.tips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    color: white;
    flex: 1;
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;

    //>div {
    //    display: flex;
    //}
}
</style>
