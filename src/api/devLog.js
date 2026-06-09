import fetch from "@/utils/fetch";

/**
 *  根据关键字查询车辆设备信息
 */
const getCarDevByKeywords = function (data) {
    return fetch({
        url: "/devLog/getCarDevByKeywords",
        method: "get",
        params: data,
    });
};
/**
 *  分页获取日志上传记录
 */
const getDevLogPage = function (data) {
    return fetch({
        url: "/devLog/getDevLogPage",
        method: "post",
        data: data,
    });
};
/**
 *  添加获取设备日志任务
 */
const addDevLogTask = function (data) {
    return fetch({
        url: "/devLog/addDevLogTask",
        method: "post",
        data: data,
    });
};
/**
 *  分页获取设备日志任务记录
 */
const getDevLogTaskPage = function (data) {
    return fetch({
        url: "/devLog/getDevLogTaskPage",
        method: "post",
        data: data,
    });
};
/**
 *  获取OSS下载URL
 */
const getDevLogDownUrl = function (data) {
    return fetch({
        url: "/devLog/getDevLogDownUrl",
        method: "get",
        params: data,
    });
};
/**
 *  获取下载FPT文件
 */
const getFtpDevLogDown = function (data) {
    return fetch({
        url: "/devLog/getFtpDevLogDown",
        method: "get",
        params: data,
    });
};
/**
 *  分页获取设备信息
 */
const getDevLogDevicePage = function (data) {
    return fetch({
        url: "/devLog/getDevLogDevicePage",
        method: "get",
        params: data,
    });
};
/**
 *  重新上传接口
 */
const reUpload = function (data) {
    return fetch({
        url: "/devLog/reUpload",
        method: "post",
        data: data,
    });
};
/**
 *  通过秘钥打开下载
 */
const authDownload = function (params) {
    return fetch({
        url: "/devLog/authDownload",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 */
const getCarAlarmAttachLostStatisticPage = function (params) {
    return fetch({
        url: "/carAlarmAttachLostStatistic/page",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 */
const carAlarmAttachLostTrend = function (params) {
    return fetch({
        url: "/carAlarmAttachLostStatistic/carAlarmAttachLostTrend",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
const exportAttachLostStatisticPage = function (params) {
    return fetch({
        url: "/carAlarmAttachLostStatistic/exportAttachLostStatisticPage",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
const apiList = {
    getCarDevByKeywords,
    getDevLogPage,
    addDevLogTask,
    getDevLogTaskPage,
    getDevLogDownUrl,
    getFtpDevLogDown,
    getDevLogDevicePage,
    reUpload,
    authDownload,
    getCarAlarmAttachLostStatisticPage,
    carAlarmAttachLostTrend,
    exportAttachLostStatisticPage,
};

export default apiList;
