
import Vue from 'vue'
import { downloadHanderForControl } from '@/utils/exportUtil'
import BaseWebControl from "../base/BaseWebControl";

/**
 *
 * @class 云端回放
 * @constructor (attachmentInfo:{carNumber-车牌号,createTimeFormat-接收时间,alarmTypeName-报警种类,carPlateColor-车牌颜色})
 *
 */
class WebCloudPlayBack extends BaseWebControl {
    constructor(domId, cb) {
        super(domId);
        this.initIng = true;
        this.index = 0;
        (async () => {
            this.initNoneWebCon("loading");
            try {
                this.playControl = await this.initWebOcx();
                this.playControlState = "show";
                this.reInitSize();
                this.disconnectOnLoad();
                cb("success")
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
        return new Promise((resolve, reject) => {
            let playControl = new WebControl({
                szPluginContainer: this.domId,
                iServicePortStart: 14430,
                iServicePortEnd: 14439,
                szClassId: "29DDBC9A-8AEA-4827-9C3A-805D697CF38F",
                cbConnectSuccess: () => {
                    playControl.JS_StartService("window", {
                        dllPath: "./WebCloudPlayBack.dll"
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
                            resolve(playControl);
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
                    reject("控件未启动");
                },
                cbConnectClose: () => {
                    this.removeNodes();
                }
            });
        });
    }
    /**
     * @function(控件生成之后修改视频，附件信息)
     * @param (attachmentInfo:{carNumber-车牌号,createTimeFormat-接收时间,alarmTypeName-报警种类,carPlateColor-车牌颜色})
     *
     */
    startPlayback(alarmSign, attachmentInfo) {
        this.hideWebOcx();
        this.removeNodes();
        this.initNoneWebCon("loading");
        this.attachmentInfo = attachmentInfo;
        this.alarmSign = alarmSign;
        Vue.prototype.$api.getAlarmMedia({ alarmSign: this.alarmSign,deviceCode:this.attachmentInfo.deviceCode }).then((res) => {
            if (res.success == true) {
                let result = res.data.filter((item) => {
                    return item.fileType === 2
                })
                console.log('result=====', result);
                if (result.length > 0) {
                    this.removeNodes();
                    this.showWebOcx();
                } else {
                    this.removeNodes();
                    this.initNoneWebCon("noneVideo");
                }
            } else {
                Vue.prototype.$message({
                    message: res.msg,
                    type: 'error'
                });
            }
        })
    }
    /**
     * @function(停止云端回放)
     * @param
     *
     */
    stopPlayback() {
        if (this.playControl) {
            this.playControl.JS_RequestInterface({
                funcName: "stopPlayback",
                arguments: {}
            })
        }
    }
    /**
     * @function(当前播放视频索引)
     * @param
     *
     */
    setIndex(index){
        this.index = index;
    }
    /**
     * @function(控件初始化完成回调函数绑定)
     *
     */
    cbIntegrationCallBack = async (oData) => {
        if (oData.responseMsg.event == 'startPlaybackNotify') {
            Vue.prototype.$api.getAlarmMedia({ alarmSign: this.alarmSign,deviceCode:this.attachmentInfo.deviceCode }).then((res) => {
                if (res.success == true) {
                    if (res.data.length > 0) {
                        let files = res.data.filter((item) => {
                            return item.fileType === 2
                        });
                        console.log('files====',files);
                        if (files.length > 0) {
                            this.playControl.JS_RequestInterface({
                                funcName: "startPlayback",
                                arguments: {
                                    "url": files[this.index].url,
                                    "code": 0
                                },
                            })
                        }
                    }
                } else {
                    Vue.prototype.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }
            })
        }
        if (oData.responseMsg.event == 'startDownloadNotify') {
            let res = await Vue.prototype.$api.getAlarmMedia({ alarmSign: this.alarmSign,deviceCode:this.attachmentInfo.deviceCode })
            if (res.success == true) {
                if (res.data.length > 0) {
                    let tempList = res.data.filter((item) => {
                        return item.fileType === 2;
                    });
                    await downloadHanderForControl(this.attachmentInfo, tempList, this.index); //新增当前视频索引
                    this.playControl.JS_RequestInterface({
                        funcName: "notifyDownResult",
                        arguments: {},
                    }).then((oData) => { });
                }
            } else {
                Vue.prototype.$message({
                    message: res.msg,
                    type: 'error'
                });
            }
        }
    }
}
export default {
    name: 'WebCloudPlayBack',
    control: WebCloudPlayBack
}
