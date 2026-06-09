/**
 * @desc 单通道回放调用流程 init ->getVideoAndsetFileInfos即可,兼容老版本功能
 * @desc 多通道回放调用做了拆分 ->getVideoMultiple -> setPlaybackMultiChanFiles -> startPlaybackDllMultiChan
 *
 *
 *  */

import Vue from "vue";
import BaseWebControl from "../base/BaseWebControl";
import moment from "moment";
let message = Vue.prototype.$message;
let api = Vue.prototype.$api;

class WebPlayBack_TimeBase extends BaseWebControl {
    constructor(domId, cb, option) {
        super(domId);
        this.initIng = true;
        let baseOption = {
            //是否有多通道下载权限
            downloadShow: false,
            //startPlaybackNotify回调
            startPlaybackNotifyFN: null,
            //playbackTrackNotify回调
            playbackTrackNotifyFN: null,
            //playbackDownloadNotify回调
            playbackDownloadNotifyFN: null
        };
        option = { ...baseOption, ...option };
        this.option = option;
        (async () => {
            this.initNoneWebCon("loading");
            try {
                this.playControl = await this.initWebOcx();
                this.playControlState = "show";
                this.reInitSize();
                this.disconnectOnLoad();
                cb("success");
            } catch (msg) {
                if (msg === "控件未启动") {
                    message.error(msg);
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
        return new Promise((resolve, reject) => {
            let playControl = new WebControl({
                szPluginContainer: this.domId,
                iServicePortStart: 14430,
                iServicePortEnd: 14439,
                szClassId: "29DDBC9A-8AEA-4827-9C3A-805D697CF38F",
                cbConnectSuccess: () => {
                    playControl
                        .JS_StartService("window", {
                            dllPath: "./WebPlayBack_TimeBase.dll"
                        })
                        .then(() => {
                            playControl.JS_SetWindowControlCallback({
                                cbIntegrationCallBack: this.cbIntegrationCallBack
                            });
                            playControl
                                .JS_CreateWnd(this.domId, this.offsetWidth, this.offsetHeight)
                                .then(() => {
                                    this.removeNodes();
                                    this.setDownloadShow(playControl);
                                    this.initIng = false;
                                    let newDom = document.getElementById(this.domId);
                                    if (!newDom) {
                                        playControl.JS_Disconnect();
                                        return;
                                    }
                                    if (newDom.attributes["timeFlag"] !== this.dom.attributes["timeFlag"]) {
                                        playControl.JS_Disconnect();
                                        return;
                                    }
                                    resolve(playControl);
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
                }
            });
        });
    }
    /**
     * @function(播放)(车辆内部封装)
     * @param{
                carId: this.alarmData.carId,
                channelList: this.channelList,
                channelNo:'',
                deviceCode: this.alarmData.deviceCode,
                startTime: startTime,
                endTime: endTime,
                productKey: res.data.productKey,
                plate: this.alarmData.carNumber
            },
     * 
     * 
     */
    getVideoAndsetFileInfos(params) {
        let { startTime, endTime, deviceCode, productKey, plate, channelList, channelNo } = params;
        let getListSinger = param => {
            return new Promise((resovle, reject) => {
                api.getVideoList(param)
                    .then(res => {
                        if (res.success) {
                            resovle(res.data);
                        } else {
                            message.error(res.msg);
                            reject();
                        }
                    })
                    .catch(() => {
                        reject();
                    });
            });
        };
        let pList = [];
        if (channelNo) {
            let tempParam = deepCopy(params);
            delete tempParam.channelList;
            pList.push(getListSinger(tempParam));
        } else {
            channelList.forEach(channel => {
                let tempParam = deepCopy(params);
                tempParam.channelNo = channel;
                delete tempParam.channelList;
                pList.push(getListSinger(tempParam));
            });
        }
        let videoBackList = [];
        Promise.all(pList)
            .then(async resList => {
                resList.forEach(videoList => {
                    let fileList = [];
                    if (JSON.stringify(videoList) !== "{}") {
                        for (let key in videoList) {
                            let timeVideo = videoList[key];
                            timeVideo.forEach((item, index) => {
                                videoList[key][index].startTimeStamp = moment(item.startTime).valueOf();
                                videoList[key][index].endTimeStamp = moment(item.endTime).valueOf();
                                fileList.push(videoList[key][index]);
                            });
                        }
                        videoBackList.push({
                            channel: fileList[0].channelNo,
                            channelName: channelList.find(({ channel }) => {
                                return channel === fileList[0].channel;
                            }).channelName,
                            files: []
                        });
                        videoBackList[videoBackList.length - 1].files = fileList;
                    }
                });
                videoBackList = this.formatVideoList(videoBackList, startTime, endTime);
                let fileInfo = {
                    infos: videoBackList,
                    minTime: startTime,
                    maxTime: endTime,
                    devSerialNum: deviceCode,
                    productKey,
                    plate
                };
                if (videoBackList.length === 0) {
                    message.info("暂无录像");
                }
                let firstPlayTime = await this.setPlaybackMultiChanFiles(fileInfo);
                if (!firstPlayTime) {
                    return;
                }
                this.startPlaybackDllAtTime(firstPlayTime);
            })
            .catch(e => {
                reject();
            });
    }
    /**
     * @function(设置播放文件列表)(新版本，支持多通道回放，内部接口调用)
     * @param{
                infos: [{
                            "channel": 1,
                            "channelName": "前视",
                            "files": [{
                            "startTime": "2020-10-26 00:01:03",
                            "endTime": "2020-10-26 10:04:03",
                            "fileSize ": 131072
                            }]
                        }],
                devSerialNum: "101099911112",
                productKey: "905_2014_fpvnFSjV",
                minTime: "2020-10-26 00:00:00",
                maxTime: "2020-10-26 12:05:03",
                plate: "浙A88888"
            }
    */
    setPlaybackMultiChanFiles(videoBackList) {
        this.videoBackList = videoBackList;
        return new Promise((resove, reject) => {
            debugger
            if (!videoBackList.minTime) {
                return resove()
            }
            this.playControl
                .JS_RequestInterface({
                    funcName: "setPlaybackMultiChanFiles",
                    arguments: videoBackList
                })
                .then(() => {
                    let firstTime = null;
                    let fileList = [];
                    videoBackList.infos.forEach(({ files }) => {
                        if (files.length > 0) {
                            fileList.push(files[0]);
                        }
                    });
                    if (fileList.length === 1) {
                        firstTime = fileList[0].startTime;
                    } else if (fileList.length === 2) {
                        let startTimeStamp = Math.min(fileList[0].startTimeStamp, fileList[1].startTimeStamp);
                        firstTime = moment(startTimeStamp).format("YYYY-MM-DD HH:mm:ss");
                    }
                    resove(firstTime);
                })
                .catch(() => {
                    reject();
                });
        });
    }
    setCurrentCarId(id){
        this.carId = id
    }
    /**
     * @function(选定时刻，进行播放)
     * @param {String,YYYY-MM-DD HH:mm:ss} currentPlayTime
     */
    startPlaybackDllAtTime(currentPlayTime) {
        let currentPlayTimeS = moment(currentPlayTime).valueOf();
        let fileList = [];
        this.videoBackList.infos.forEach(({ files }) => {
            let findFile = files.find(file => {
                return file.startTimeStamp <= currentPlayTimeS && file.endTimeStamp >= currentPlayTimeS;
            });
            if (!findFile) {
                return
            }
            let tempFile = deepCopy(findFile);
            tempFile.startTime = currentPlayTime;
            Object.assign(tempFile, {
                devSerialNum: this.videoBackList.devSerialNum,
                plate: this.videoBackList.plate,
                productKey: this.videoBackList.productKey,
                channel: findFile.channelNo
            });
            fileList.push(tempFile);
        });
        fileList.forEach(file => {
            this.startPlaybackDll(file);
        });
    }
    /**
     * @function(开始回放,回调函数调用，外部设置文件调用setFileInfo)
     * @param({
     */
    startPlaybackDll(params) {
        let { devSerialNum, channel, productKey, startTime, endTime, fileSize, plate, channelName } = params;
        let avEncoding = {};
        this.videoBackList.infos.forEach(item => {
            if (item.channel == channel && item.files) {
                let file = item.files.find(itemin => {
                    return itemin.fileSize === fileSize && itemin.endTime === endTime;
                });
                if (file) {
                    avEncoding = file.avEncoding;
                }
            }
        });
        let paramsAPI = {
            deviceCode: devSerialNum,
            channelNum: channel,
            channelName: channelName,
            productKey: productKey,
            startTime: startTime,
            endTime: endTime,
            fileSize: fileSize,
            plate: plate,
            protocolType: 0,
            ...avEncoding
        };
        Vue.prototype.$api.getPlayBackUrl(paramsAPI).then(res => {
            let errorCode = "";
            if (res.code == "device_offline" || res.code == "EC.device.not.online" || res.code == "device_dormancy") {
                errorCode = 0x01000000;
            }
            if (res.success == true) {
                if (res.data != null || res.data != undefined) {
                    let url = res.data;
                    if (url.length == 0) {
                        this.playControl
                            .JS_RequestInterface({
                                funcName: "notifyError",
                                arguments: {
                                    msg: "startPlaybackNotify",
                                    errorCode: errorCode,
                                    errorMsg: res.msg
                                }
                            })
                            .then(oData => {
                                message.error("获取url失败！");
                            });
                    } else {
                        this.playControl
                            .JS_RequestInterface({
                                funcName: "startPlayback",
                                arguments: {
                                    url: url,
                                    code: 0,
                                    playTimeSync: true,
                                    ...params
                                }
                            })
                            .then(function(oData) {
                                console.log(oData);
                            });
                    }
                } else {
                    this.playControl
                        .JS_RequestInterface({
                            funcName: "notifyError",
                            arguments: {
                                msg: "startPlaybackNotify",
                                errorCode: errorCode,
                                errorMsg: res.msg
                            }
                        })
                        .then(oData => {
                            message.error("获取url失败！");
                        });
                }
            } else {
                this.playControl
                    .JS_RequestInterface({
                        funcName: "notifyError",
                        arguments: {
                            msg: "startPlaybackNotify",
                            errorCode: errorCode,
                            errorMsg: res.msg
                        }
                    })
                    .then(oData => {
                        message.error(res.msg);
                    });
            }
        });
    }
    /**
     * @function(控件初始化完成回调函数绑定)
     *
     */
    cbIntegrationCallBack = async oData => {
        if (oData.responseMsg.event === "startPlaybackNotify") {
            let info = oData.responseMsg.msg;
            /**
             * 成功播放的回调
             * @param(控件对象，控件回调参数)
             *
             */
            this.startPlaybackDll(info);
            let { startPlaybackNotifyFN } = this.option;
            if (!(startPlaybackNotifyFN instanceof Function)) return;
            startPlaybackNotifyFN(info);
        }
        if (oData.responseMsg.event === "playbackTrackNotify") {
            let info = oData.responseMsg.msg;
            /**
             *
             * @param(控件对象，控件回调参数)
             *
             */
            let { playbackTrackNotifyFN } = this.option;
            if (!(playbackTrackNotifyFN instanceof Function)) return;
            playbackTrackNotifyFN(info);
        }
        if (oData.responseMsg.event === "playbackErrorNotify") {
            if (await this.getDeviceInfoByDeviceCodeOfMonitorAPI(this.carId)) {
                return;
            }
            this.playControl.JS_RequestInterface({
                funcName: "notifyError",
                arguments: {
                    msg: "startPlaybackNotify",
                    errorCode: 0x01000000,
                    errorMsg: "设备离线"
                }
            });
        }
        if (oData.responseMsg.event === "playbackDownloadNotify") {
            let info = oData.responseMsg.msg;
            /**
             * 框选下载的回调
             * @param(控件对象，控件回调参数)
             *
             */
            let { playbackDownloadNotifyFN } = this.option;
            if (!(playbackDownloadNotifyFN instanceof Function)) return;
            playbackDownloadNotifyFN(info);
        }
    };
    /**
     * @function(进入下载框选模式)
     */
    enterDownloadMode() {
        this.playControl.JS_RequestInterface({
            funcName: "enterDownloadMode",
            arguments: {}
        });
    }
    /**
     * @function(停止时间轴回放)
     * @param
     *
     */
    stopPlayback() {
        if (this.playControl) {
            this.playControl.JS_RequestInterface({
                funcName: "stopPlayback",
                arguments: {}
            });
        }
    }
    /**
     * @function(录像列表对象收敛，除去超出查询时间范围内的录像)
     */
    formatVideoList(videoBackList, startTime, endTime) {
        videoBackList.forEach(({ infos }) => {
            if (infos && infos.length > 0) {
                let info = infos[0];
                let s_startTimeStamp = moment(startTime).valueOf();
                let e_endTimeStamp = moment(endTime).valueOf();
                if (info.startTimeStamp < s_startTimeStamp) {
                    info.startTimeStamp = s_startTimeStamp;
                    info.startTime = this.searchVideoForm.startTime;
                }
                let infoLast = infos[infos.length - 1];
                if (infoLast.endTime > e_endTimeStamp) {
                    infoLast.endTimeStamp = e_endTimeStamp;
                    info.endTime = this.searchVideoForm.endTime;
                }
            }
        });
        return videoBackList;
    }
    getCurrentTime() {
        return new Promise((resolve, reject) => {
            this.playControl.JS_RequestInterface({
                funcName: "getCurrentTime",
                arguments: {}
            }).then((e) => {
                let content = e.responseMsg.content;
                if (content && content.currentTime) {
                    resolve(content.currentTime);
                }
                else {
                    resolve(null)
                }
            }).catch((e) => {
                reject(e);
            })
        })
    }
}
export default {
    name: "WebPlayBack_TimeBase",
    control: WebPlayBack_TimeBase
};
