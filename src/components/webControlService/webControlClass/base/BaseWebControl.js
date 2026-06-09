import noneWebCon from '@/components/noneWebCon.vue'
import ocxWebControl from '@/utils/ocxWebControl';
import Vue from 'vue'
import { compareVersion } from '@/utils/validate';
import store from "@/store"




let uid = 0;

/**
 *
 * @class 控件基类
 * @constructor
 *
 */
class BaseWebControl {
    constructor(domId) {
        this.domId = domId;
        this.dom = document.getElementById(domId);
        this.removeNodes();
        /* 拿到DOM之后对该DOM增加一个标志位，用来判断控件异步加载之后是否要显示，如果当控件加载完之后，该dom不存在或者标志位不一致，则不显示，可以避免控件加载的问题 */
        this.dom.setAttribute('timeFlag', new Date().getTime());
        this.offsetHeight = this.dom.offsetHeight;
        this.offsetWidth = this.dom.offsetWidth;
        this.positionInfo = this.dom.getBoundingClientRect();
        this.playControl = null;
        this.initIng = false;
        this.playControlState = null;
    }
    /**
    *
    * @function(取消控件尺寸监听，用于页面组件摧毁)
    *
    */
    cancelReSize() {
        window.removeEventListener('scroll', this.reSizeScroll, true);
        window.removeEventListener('resize', this.reSizeResize, true);
    }
    /**
    * @type(静态方法)
    * @function(初始化控件版本,判断是否需要更新)
    *
    */
    static initWebVersion() {
        console.log(store)
        let downloadOcxUrl = ""
        let downloadData = (url) => {
            let elemIF = document.createElement("iframe");
            elemIF.src = url;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
            setTimeout(() => {
                document.body.removeChild(elemIF);
            }, 2000);
        }
        let downloadOcx = () => {
            if(downloadOcxUrl){
                downloadData(downloadOcxUrl)
            }else{
                Vue.prototype.$api.getPluginVersion().then((res) => {
                    if (res.success) {
                        downloadOcxUrl = res.data.pluginDownloadUrl;
                        downloadData(downloadOcxUrl)
                    } else {
                        this.$message.error("获取控件下载地址失败");
                    }
                });
            }
        }
        let infoUserUpdate = (type) => {
            if (type == 1) {
                /* 控件版本小于后台记录最低版本时提示用户必须更新,控件小于后台保存的最新的版本时,提示更新 */
                Vue.prototype.$confirm('控件版本低,是否立即下载控件的最新版？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showClose: false,
                    closeOnClickModal: false,
                    customClass: 'MessageBoxTop',
                    closeOnPressEscape: false,
                    type: 'warning'
                }).then(() => {
                    /* 向后台询问最新的控件url */
                    downloadOcx();
                }).catch(() => { });
            } else {
                Vue.prototype.$alert('控件版本太低，部分功能不可用，请马上更新控件。', '提示', {
                    confirmButtonText: '确定',
                    // cancelButtonText: '取消',
                    showClose: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    customClass: 'MessageBoxTop',
                    type: 'warning'
                }).then(() => {
                    /* 向后台询问最新的控件url */
                    downloadOcx();
                }).catch(() => { });
            }
        };
        (function () {
            /* id唯一标识 */
            uid++;
            let dom = document.createElement('div');
            dom.id = `index${uid}`;
            dom.style.width = 0;
            dom.style.height = 0;
            document.body.appendChild(dom);
            let playControl = new WebControl({
                szPluginContainer: dom.id,
                iServicePortStart: 14430,
                iServicePortEnd: 14439,
                szClassId: "29DDBC9A-8AEA-4827-9C3A-805D697CF38F",
                cbConnectSuccess: () => {
                    playControl.JS_StartService("window", {
                        dllPath: "./WebVersion.dll"
                    }).then(() => {
                        playControl.JS_CreateWnd(dom.id, 0, 0).then(() => {
                            /* 0表示中文 */
                            playControl.JS_RequestInterface({
                                funcName: "setLanguage",
                                arguments: {
                                    type: 0
                                }
                            }).then(() => { });
                            playControl.JS_RequestInterface({
                                funcName: "getVersion",
                                arguments: {}
                            }).then((oData) => {
                                if (oData.responseMsg.error === 0) {
                                    let version = oData.responseMsg.version.toString();
                                    if (!!version) {
                                        version = version.substring(0, version.indexOf("_"));
                                    }
                                    Vue.prototype.$api.getPluginVersion().then((res) => {
                                        if (res.success) {
                                            downloadOcxUrl = res.data.pluginDownloadUrl
                                            let pluginMinVersion = res.data.pluginMinVersion;  /* 最低版本 */
                                            let pluginVersion = res.data.pluginVersion;  /* 最新版本 */
                                            /*  如果控件版本小于最低版本,提示强制更新
                                            version > pluginMinVersion,返回1 ,version == pluginMinVersion,返回0,version < pluginMinVersion,返回-1 */
                                            if (compareVersion(version, pluginMinVersion) == -1) {
                                                infoUserUpdate(-1);
                                            } else {
                                                if (compareVersion(version, pluginVersion) == -1) {
                                                    /*    如果控件版本小于最近版本,提示更新 */
                                                    infoUserUpdate(1);
                                                }
                                            }
                                        } else {
                                            Vue.prototype.$message.error(res.msg);
                                        }
                                    })
                                } else {
                                    infoUserUpdate(-1);
                                }
                                setTimeout(() => {
                                    playControl && playControl.JS_Disconnect();
                                }, 500)
                            });
                        });
                    }).catch(() => {
                        Vue.prototype.$message.error('查询控件版本服务启动失败！');
                        setTimeout(() => {
                            playControl && playControl.JS_Disconnect();
                        }, 500)
                    })
                }
            });
        })();
    }
    /*------------------------------------------------------类内部自调用方法  -----------------------------------*/
    /**
     * @function(设置控件是否有多通道下载功能)
    */
    setDownloadShow(control) {
        let { downloadShow } = this.option;
        let playControl = control || this.playControl;
        playControl && playControl.JS_RequestInterface({
            funcName: "setPlayBackLayout",
            arguments: {
                display: {
                    mainControl: {
                        downloadShow
                    }
                }
            }
        });
    }
    /**
     * @function(ie浏览器页面刷新自动销毁)
    */
    disconnectOnLoad() {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            window.addEventListener("beforeunload", () => {
                this.disconnectWebOcx();
            });
        }
    }
    /**
     * @function(判断设备是否在线)
     * @param(carId)
    */
    async getDeviceInfoByDeviceCodeOfMonitorAPI(carId) {
        try {
            let res = await Vue.prototype.$api.getDeviceInfoByDeviceCodeOfMonitor({ carId: carId, abilityCode: 'preview' });
            console.log(res, "结果")
            if (res.data.deviceStatus == 1) {
                return true
            } else {
                return false
            }
        } catch (e) {
            return true
        }
    }
    /**
     * @function(初始化无视频或控件组件)
     * @param(type:"loading","noneVideo","noneWebCon")
     */
    initNoneWebCon(type) {
        let Task = Vue.extend(noneWebCon);
        /*Task实例可选props{height:String,width:String,showType:String}
        let taskvm = new Task({propsData:{
            height: '---'
        }}); */
        let taskvm = new Task(
            {
                propsData: {
                    width: (this.offsetWidth / 16) + "rem",
                    height: (this.offsetHeight / 16) + "rem",
                    showType: type
                }
            }
        );
        this.dom.appendChild(taskvm.$mount().$el);
    }
    /**
    * @function(清除节点)
    *
    */
    removeNodes() {
        if (this.dom) {
            this.dom.innerHTML = '';
        }
    }
    /**
    * @function(外部手动调整尺寸)
    *
    */
    pageResizeAdjust(offsetWidth, offsetHeight) {
        offsetWidth = offsetWidth || this.dom.offsetWidth;
        offsetHeight = offsetHeight || this.dom.offsetHeight;
        ocxWebControl.pageResize(this.playControl, this.domId, offsetWidth, offsetHeight);
    }
    /**
    * @function(调整尺寸方法)
    *
    */
    reSizeScroll = () => {
        if (this.playControlState === null || this.playControlState === 'hide') {
            return;
        }
        this.offsetHeight = this.dom.offsetHeight;
        this.offsetWidth = this.dom.offsetWidth;
        ocxWebControl.pageScroll(this.playControl, this.domId, this.offsetWidth, this.offsetHeight);
    }
    /**
    * @function(调整尺寸方法)
    *
    */
    reSizeResize = () => {
        if (this.playControlState === null || this.playControlState === 'hide') {
            return;
        }
        
        this.offsetHeight = this.dom.offsetHeight;
        this.offsetWidth = this.dom.offsetWidth;
        ocxWebControl.pageScroll(this.playControl, this.domId, this.offsetWidth, this.offsetHeight);
    }
    /**
    *
    * @function(监听页面滚动，调整控件尺寸)
    *
    */
    reInitSize() {
        window.addEventListener('scroll', this.reSizeScroll);
        window.addEventListener('resize', this.reSizeResize);
    }
    /**
   *
   * @function(取消控件尺寸监听，用于页面组件摧毁)
   *
   */
    cancelReSize() {
        window.removeEventListener('scroll', this.reSizeScroll);
        window.removeEventListener('resize', this.reSizeResize);
    }
    /**
   *
   * @function(将活动的控件放入VUEX托管，下载任务打开时方便隐藏当前活动窗口的控件)
   * @introduce(暂时不用，等以后整个系统控件全部替换再考虑使用)
   */
    addActiveControl() {
        if (this.playControl) {
            Vue.prototype.$store.commit("addObx", this);
        }
    }
    /**
    *
    * @function(移除vuex的托管)
    *
    */
    removeActiveControl() {
        if (this.playControl) {
            Vue.prototype.$store.commit('removeObx', this);
        }
    }

    /*---------------------------------------------------------类外部调用方法API  ---------------------------------*/

    /**
    * @function(显示控件)
    *
    */
    showWebOcx() {
        if (this.playControl) {
            this.playControl.JS_ShowWnd();
            this.playControlState = 'show';
            this.reSizeScroll();
            this.reSizeResize();
        }
    }
    /**
     * @function(隐藏控件)
     *
     */
    hideWebOcx() {
        if (this.playControl) {
            this.playControl.JS_HideWnd();
            this.playControlState = 'hide';
        }
    }
    /**
     * @function(断开连接)
     *
     */
    disconnectWebOcx() {
        if (this.playControl) {
            this.playControl.JS_Disconnect();
            this.cancelReSize();
        }

        // this.removeActiveControl();
        Object.keys(this).forEach((item) => {
            delete this[item];
        })
    }
    /**
   * @function(销毁窗口)
   *
   */
    destroyWnd() {
        if (this.playControl) {
            this.playControl.JS_DestroyWnd();
        }
    }
    /**
     * @function(裁剪控件)
     * @param(x,y距离左顶点的距离、高度,width:裁剪宽度,height:裁剪高度)
     *
     */
    cuttingPartWindow(x, y, width, height) {
        if (this.playControl) {
            this.playControl.JS_CuttingPartWindow(x, y, width, height);
        }
    }
    /**
     * @function(还原控件)
     * @param(x,y距离左顶点的距离、高度,height:裁剪高度,width:裁剪宽度)
     *
     */
    repairPartWindow(x, y, width, height) {
        if (this.playControl) {
            this.playControl.JS_RepairPartWindow(x, y, width, height);
        }
    }
}
export default BaseWebControl
