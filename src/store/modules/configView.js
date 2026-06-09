import { coverAttr } from "@/utils/objUtil/findAttr";

// 页面之间数据传输配置
const configStore = {
    state: {
        timeOut: null, //和ifMessage配套使用
        ifMessage: false,
        userActionOpen: false, //用户操作弹框是否打开
        dealVisible: false,
        isLoginOut: false, //用户是否退出
        downLoadOpen: false, //下载弹窗是否打开
        about: false, //关于弹窗是否打开
        unhanderOpen: false, //待处理报警弹窗是否打开
        messageOpen: false, //待处理报警弹窗是否打开
        routeInfo: "", //当前页面route信息
        routeInfoNow: "",
        lastPath: "", //path的最后一级
        resetPassword: false,
        updateTipVisible: false, //升级引导是否展示
        qrcodeVisible: false, //APP二维码是否展示
        feedbackDialogVisible: false, //意见反馈窗口是否打开
        downloadManual: false, //操作手册窗口是否打开
        hasNote: false, //是否有短信下发功能
        isShowMenu: false, //导航栏是否弹出
        isShowUserInfo: false,
        isShowDownLoad: false,
        tipFlash: 0,
        menuIndex: 0,
        dealToastList: [],
        /*
         * 项目额外权限
         * 1 微信机器人报警推送
         * 2 冷链传感器
         * 3 正反转传感器
         * 4 设备主动对讲
         * 5 下发短信功能
         * */
        extraPermission: [],
        //运输任务修改途经点名称弹窗
        transportReNameDialog: {
            show: false,
            type: "", //add-start,add-pass,add-end,re-pass,
        },
        //初始值为null,方便进行发布订阅 采用sub类作为发布订阅中介
        //设计背景，目前获取权限等接口都是放在headbar里，如果headbar和业务组件是平级的情况，这个时候刷新页面接口的先后顺序就会有问题，可能配置还没获取到，就直接发请求了。
        dataTimeRange: {
            logDay: null, //日志周期性天数配置
            alarmAccessoryDay: null, //报警附件周期性配置
            alarmStructureDay: null, //报警结构化周期性配置
            parkingDay: null, //停车天数周期性配置
            mileageDay: null, //里程周期性天数配置
            tripDay: null, //趟次周期性天数配置
            regionalAccessDay: null, //区域进出天数周期性配置	区域进出统计共用该参数
            attendanceDay: null, //考勤天数周期性配置	人脸比对记录共用该参数
            forwardAndReverseDay: null, //正反转天数周期配置
            signalStatusDay: null, //信号状态天数周期配置
            gpsTrackDay: null, //GPS轨迹天数周期配置
            oilQuantityDay: null, //油量天数周期配置
            loadDay: null, //载重天数周期配置
            temperatureAndHumidityDay: null, //温湿度天数周期配置	冷链相关的操作共用该参数
            overSpeedDay: null, //超速使用
        },
        messageCenetrMenu: "", //导航栏是否弹出
        //系统更新提醒是否有未读消息
        systemUpdateReminder: 0,
        renewalUpdateReminder: 0,
        localized: false, //是否是本地化部署
        AmapAddressUrl: "", //高德地图逆地理编码接口地址
        status: window.sessionStorage.getItem("status") || 0, //待处理报警上班状态
        userHeight: 310, //用户中心的高度，有时候添加一项，所有需要裁剪控件的地方高度都要改，并且本地化和阿里云高度还不一致，统一存储在store中
    },
    mutations: {
        setMessage(state, data) {
            if (data) {
                if (state.timeOut) {
                    window.clearTimeout(state.timeOut);
                }
                state.ifMessage = true;
                state.timeOut = setTimeout(() => {
                    state.ifMessage = false;
                    state.timeOut = null;
                }, 2000);
            }
        },
        setDealToastList(state, data) {
            state.dealToastList = data;
        },
        setTipFlash(state) {
            state.tipFlash++;
        },
        setUserActionOpen(state, data) {
            state.userActionOpen = data;
        },
        setDealVisible(state, data) {
            state.dealVisible = data;
        },
        setIsLoginOut(state, data) {
            state.isLoginOut = data;
        },
        setDownLoadOpen(state, data) {
            state.downLoadOpen = data;
        },
        setDownloadManual(state, data) {
            state.downloadManual = data;
        },
        setAbout(state, data) {
            state.about = data;
        },
        setUnhanderOpen(state, data) {
            state.unhanderOpen = data;
        },
        setMessageOpen(state, data) {
            state.messageOpen = data;
        },
        setRouteInfo(state, data) {
            state.routeInfo = data;
            if (data) {
                let pathArr = data.split("/");
                let path = pathArr[pathArr.length - 1];
                path ? (state.lastPath = path) : "";
            }
        },
        setRouteInfoNow(state, data) {
            state.routeInfoNow = data;
        },
        setResetPassword(state, data) {
            state.resetPassword = data;
        },
        setUpdateTipVisible(state, data) {
            state.updateTipVisible = data;
        },
        setQrcodeVisible(state, data) {
            state.qrcodeVisible = data;
        },
        setFeedbackDialogVisible(state, data) {
            state.feedbackDialogVisible = data;
        },
        setHasNote(state, data) {
            state.hasNote = data;
        },
        setIsShowMenu(state, data) {
            state.isShowMenu = data;
        },
        setIsShowUserInfo(state, data) {
            state.isShowUserInfo = data;
        },
        setIsShowDownLoad(state, data) {
            state.isShowDownLoad = data;
        },
        setMenuIndex(state, data) {
            state.menuIndex = data;
        },
        setExtraPermission(state, data) {
            state.extraPermission = data;
        },
        setTransportReNameDialog(state, data) {
            state.transportReNameDialog = data;
        },
        setMessageCenetrMenu(state, data) {
            state.messageCenetrMenu = data;
        },
        setSystemUpdateReminder(state, data) {
            state.systemUpdateReminder = data;
        },
        setRenewalUpdateReminder(state, data) {
            state.renewalUpdateReminder = data;
        },
        setLocalized(state, data) {
            state.localized = data;
        },
        setDataTimeRange(state, data) {
            coverAttr(state.dataTimeRange, data);
        },
        setAmapAddressUrl(state, data) {
            state.AmapAddressUrl = data;
        },
        setStatus(state, data) {
            state.status = data;
        },
        getDealToastList(state) {
            return state.dealToastList;
        },
        setUserHeight(state, data) {
            state.userHeight = data;
        },
    },
    getters: {
        getIfMessage(state) {
            return state.ifMessage;
        },
        getDealToastList(state) {
            return state.dealToastList;
        },
        getUserActionOpen(state) {
            return state.userActionOpen;
        },
        getDealVisible(state) {
            return state.dealVisible;
        },
        getIsLoginOut(state) {
            return state.isLoginOut;
        },
        getDownLoadOpen(state) {
            return state.downLoadOpen;
        },
        getAbout(state) {
            return state.about;
        },
        getUnhanderOpen(state) {
            return state.unhanderOpen;
        },
        getMessageOpen(state) {
            return state.messageOpen;
        },
        getRouteInfo(state) {
            return state.routeInfo;
        },
        getRouteInfoNow(state) {
            return state.routeInfoNow;
        },
        getRouteLastPath(state) {
            return state.lastPath;
        },
        getResetPassword(state) {
            return state.resetPassword;
        },
        getUpdateTipVisible(state) {
            return state.updateTipVisible;
        },
        getQrcodeVisible(state) {
            return state.qrcodeVisible;
        },
        getFeedbackDialogVisible(state) {
            return state.feedbackDialogVisible;
        },
        getHasNote(state) {
            return state.hasNote;
        },
        getIsShowMenu(state) {
            return state.isShowMenu;
        },
        getIsShowUserInfo(state) {
            return state.isShowUserInfo;
        },
        getIsShowDownLoad(state) {
            return state.isShowDownLoad;
        },

        getMenuIndex(state) {
            return state.menuIndex;
        },
        getDownloadManual(state) {
            return state.downloadManual;
        },
        getExtraPermission(state) {
            return state.extraPermission;
        },
        getTipFlash(state) {
            return state.tipFlash;
        },
        getMessageCenetrMenu(state) {
            return state.messageCenetrMenu;
        },
        getSystemUpdateReminder(state) {
            return state.systemUpdateReminder;
        },
        getRenewalUpdateReminder(state) {
            return state.renewalUpdateReminder;
        },
        getLocalized(state) {
            return state.localized;
        },
        getDataTimeRange(state) {
            //发布订阅模式
            return state.dataTimeRange;
        },
        getAmapAddressUrl(state) {
            return state.AmapAddressUrl;
        },
        getUserHeight(state) {
            return state.userHeight;
        },
    },
};

export default configStore;
