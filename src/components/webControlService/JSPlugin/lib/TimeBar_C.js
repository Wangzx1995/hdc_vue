import { TimeBar, Time } from "./TimeBar";
import moment from "moment";

class TimeBar_C {
    constructor(js_canvas, mouseCallBackFn) {
        this.domId = js_canvas;
        this.canvasContent = null;
        this.initCanvas();
        this.mouseCallBackFn = mouseCallBackFn;
        this.iSpanType = 7;
    }
    initCanvas() {
        this.canvasContent = document.getElementById(this.domId);
        this.timeBar = new TimeBar(this.canvasContent);
        this.timeBar.setMouseUpCallback(this.mouseCallBack);
        this.timeBar.setMouseWheelCallback(this.mouseWheelCallBack);
        setTimeout(() => {
            this.initResize();
            document.getElementById("up").addEventListener("click", () => {
                if (this.iSpanType >= 12) {
                    return;
                }
                this.iSpanType++;
                this.timeBar.SetSpantype(this.iSpanType);
            });
            document.getElementById("down").addEventListener("click", () => {
                if (this.iSpanType <= 6) {
                    return;
                }
                this.iSpanType--;
                this.timeBar.SetSpantype(this.iSpanType);
            });
        }, 0);
    }
    upEvent() {
        if (this.iSpanType >= 12) {
            return;
        }
        this.iSpanType++;
        this.timeBar.SetSpantype(this.iSpanType);
    }
    downEvent() {
        if (this.iSpanType <= 6) {
            return;
        }
        this.iSpanType--;
        this.timeBar.SetSpantype(this.iSpanType);
    }
    mouseCallBack = (playFile, startTime) => {
        // let currentFileInfo = deepCopy(playFile);
        // currentFileInfo.forEach((_i, index, array) => {
        //     if (array[index]) {
        //         array[index].startTime = startTime;
        //     }
        // });
        this.mouseCallBackFn(startTime);
    };
     //滚轮滚动缩放时间轴
     mouseWheelCallBack = (oEvent) => {
        if(oEvent.deltaY > 0){
            if (this.iSpanType >= 12) {
                return;
            }
            this.iSpanType++;
            this.timeBar.SetSpantype(this.iSpanType);
        }else{
            if (this.iSpanType <= 6) {
                return;
            }
            this.iSpanType--;
            this.timeBar.SetSpantype(this.iSpanType);
        }
    };
    clearFileList() {
        this.timeBar.clearFile();
    }
    clearDom() {
        let list = [0, 1];
        list.forEach((text) => {
            let dom = document.getElementById(`text${text}`);
            if (dom) {
                dom.innerHTML = "";
            }
        });
    }
    reinitTimeBar() {
        this.clearFileList();
        this.resizeHander();
        this.clearDom();
    }
    addFileList(fileList) {
        let currentFileInfo = [null, null];
        let tempIndex = 0;
        let minTime = Infinity;
        fileList.forEach((info, index) => {
            if (info.length) {
                let time = moment(info[0].startTime).valueOf();
                if (time < minTime) {
                    minTime = time;
                    tempIndex = index;
                } else if (time === minTime) {
                    tempIndex = 2;
                }
                let dom = document.getElementById(`text${index}`);
                dom.innerText = info[0].channelName;
                dom.title = info[0].channelName;
            }
        });
        if (minTime !== Infinity) {
            if (tempIndex === 2) {
                currentFileInfo[0] = fileList[0][0];
                currentFileInfo[1] = fileList[1][0];
            } else {
                currentFileInfo[tempIndex] = fileList[tempIndex][0];
            }
        }
        let currentPlayTime = moment(minTime).format("YYYY-MM-DD HH:mm:ss");
        this.timeBar.addFileList(fileList);
        this.setMidLineTime(currentPlayTime);
        return {
            currentFileInfo,
            currentPlayTime,
        };
    }
    initResize() {
        window.addEventListener("resize", () => {
            setTimeout(() => {
                let offsetWidth = this.canvasContent.parentElement.offsetWidth;
                this.timeBar.resize(offsetWidth, 90);
            }, 0);
        });
    }
    resizeHander() {
        let offsetWidth = this.canvasContent.parentElement.offsetWidth;
        this.timeBar.resize(offsetWidth, 90);
    }
    setMidLineTime(time) {
        this.timeBar.setMidLineTime(time);
    }
    findFile(currentPlayTime) {
        let time = new Time();
        let playFile = [null, null];
        time.setTimeByMis(moment(currentPlayTime).valueOf());
        this.timeBar.FileInfoSet.forEach((infoList, index) => {
            infoList.forEach((file, j) => {
                if (file.isInTimeRange(time)) {
                    playFile[index] = {
                        startTime: file.m_tStartTime.getStringTime(),
                        stopTime: file.m_tStopTime.getStringTime(),
                        fileSize: file.m_fileSize,
                        avEncoding: file.m_avEncoding,
                        j,
                    };
                }
            });
        });
        return playFile;
    }
    setReactDragCall(callback) {
        this.timeBar.setReactDragCall(callback);
    }
    enterDownloadMode() {
        this.timeBar.enterDownloadMode();
    }
    cancelDownLoadMode() {
        this.timeBar.cancelDownLoadMode();
    }
    getRectTimeAndFile() {
        if (!this.timeBar.videoRect) {
            return null;
        }
        let endTime = moment(
            this.timeBar.videoRect.XtoTime(this.timeBar.videoRect.E_X)
        ).format("YYYY-MM-DD HH:mm:ss");
        let startTime = moment(
            this.timeBar.videoRect.XtoTime(this.timeBar.videoRect.M_X)
        ).format("YYYY-MM-DD HH:mm:ss");
        let channel = [];
        this.timeBar.FileInfoSet.forEach((fileInfo) => {
            fileInfo.forEach((item) => {
                if (
                    item.isInRange(
                        this.timeBar.videoRect.M_X,
                        this.timeBar.videoRect.E_X
                    )
                ) {
                    if (!channel.includes(item.m_iWndNum)) {
                        channel.push(item.m_iWndNum);
                    }
                }
            });
        });
        return {
            startTime,
            endTime,
            channel,
        };
    }
}
export { TimeBar_C };
