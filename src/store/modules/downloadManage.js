// 导出状态配置
const downloadManage = {
    state: {
        videoDownloadArr: [],
        downloadVideoTimer: null,
        downLoadingStatusMap: {}, // 下载集合
        uploadingList:[],//上传队列
    },
    mutations: {
        setVideoDownloadArr(state, arr) {
            state.videoDownloadArr = arr;
        },
        setDownloadVideoTimer(state, interval) {
            state.downloadVideoTimer = interval;
        },
        closeDownloadVideoTimer(state) {
            state.downloadVideoTimer = null;
            window.clearInterval(state.downloadVideoTimer);
        },
        setDownLoadingStatusMap(state, fn) {
            fn(state.downLoadingStatusMap);
        },
        setUploadingList(state, fn) {
            fn(state.uploadingList);
        }
    },
};

export default downloadManage;
