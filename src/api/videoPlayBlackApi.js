import fetch from "@/utils/fetch";

/**
 * 根据车辆id查询抓拍图片
 */

const getDownloadCarPhotoInfo = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "download/getDownloadCarPhotoInfo",
        method: "post",
        data: params,
    });
};

/**
 * 根据条件查询指定抓拍抓拍图片
 */

const getDownloadCarPhotoList = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "download/getDownloadCarPhotoList",
        method: "post",
        data: params,
    });
};

/**
 * 删除抓拍图片
 */
const deleteDownloadCarPhoto = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "download/deleteDownloadCarPhoto",
        method: "post",
        data: params,
    });
};

/**
 * 根据车辆id和能力集获取设备信息
 */
const getVideoPlayDeviceInfoByCarId = function (params) {
    return fetch({
        url: "/video/getDeviceInfoByCarId",
        method: "post",
        data: params,
    });
};

//文件下载列表
const getUserDownloadList = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/download/getUserDownloadList",
        method: "post",
        data: params,
    });
};
//查询有视频日期
const getOnlineDate = function (params) {
    return fetch({
        // headers:{"Content-Type":"application/json"},
        url: "/logs/getOnlineDate",
        method: "post",
        data: params,
    });
};
const getOnlineDateByCarNumber = function (params) {
    return fetch({
        // headers:{"Content-Type":"application/json"},
        url: "/logs/getOnlineDateByCarNumber",
        method: "post",
        data: params,
    });
};

//轨迹回放GPS点下载
const exportGps = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/monitor/exportGps",
        method: "post",
        data: params,
    });
};

//轨迹回放模板保存
const saveGpsTemplate = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/monitor/saveGpsTemplate",
        method: "post",
        data: params,
    });
};
//新建运输任务
const addTransportTasks = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/transportTasksController/addTransportTasks",
        method: "post",
        data: params,
    });
};
//修改运输任务
const updateTransportTasks = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/transportTasksController/updateTransportTasks",
        method: "post",
        data: params,
    });
};
//删除运输任务
const deleteTransportTasks = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/transportTasksController/deleteTransportTasks",
        method: "post",
        data: params,
    });
};
//分页获取运输任务
const getTransportTasksPage = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/transportTasksController/getTransportTasksPage",
        method: "post",
        data: params,
    });
};
const getEleFenceByTransportTasksId = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/transportTasksController/getEleFenceByTransportTasksId",
        method: "post",
        data: params,
    });
};
const transportTasksCreateTemplate = function (params) {
    return fetch({
        // headers:{"Content-Type":"application/json"},
        url: "/transportTasksController/createTemplate",
        method: "post",
        data: params,
    });
};
const getTransportTasksDetails = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/transportTasksController/getTransportTasksDetails",
        method: "post",
        data: params,
    });
};
const getTransportTasksList = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/transportTasksController/getTransportTasksList",
        method: "post",
        data: params,
    });
};
//获取某段轨迹车辆信息
const carTraceDataStats = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/monitor/carTraceDataStats",
        method: "post",
        data: params,
    });
};

//获取某段轨迹车辆长时间停留点
const pageLongStay = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/longStay/pageLongStay",
        method: "post",
        data: params,
    });
};

//获取某段轨迹车辆长时间停留点不分页
const pageAllLongStay = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/longStay/pageAllLongStay",
        method: "post",
        data: params,
    });
};

//查询轨迹列表
const queryGpsTemplateList = function (params) {
    return fetch({
        url: "/monitor/queryGpsTemplateList",
        method: "post",
        data: params,
    });
};

//查询轨迹详情
const queryGpsTemplateDetail = function (params) {
    return fetch({
        url: "/monitor/queryGpsTemplateDetail",
        method: "post",
        data: params,
    });
};

//删除轨迹模板
const delGpsTemplate = function (params) {
    return fetch({
        url: "/monitor/delGpsTemplate",
        method: "post",
        data: params,
    });
};

//查询GPS模板分页
const pageQueryGpsTemplateList = function (params) {
    return fetch({
        url: "monitor/pageQueryGpsTemplateList",
        method: "post",
        data: params,
    });
};

//添加下载次数
const addDownloadCount = function (params) {
    return fetch({
        url: "download/addDownloadCount",
        method: "post",
        data: params,
    });
};

//删除下载记录
const deleteDownload = function (params) {
    return fetch({
        url: "download/delete",
        method: "post",
        data: params,
    });
};
//视频录像列表
const getVideoList = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/video/getVideoList",
        method: "post",
        data: params,
    });
};
//视频录像列表
const getPlayBackUrl = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/video/playback",
        method: "post",
        data: params,
    });
};
//视频录像列表
const getVideoDownloadUrl = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/video/downLoadVideoFile",
        method: "post",
        data: params,
    });
};
//视频录像列表
const videoGetMultiFileVideoDownloadUrl = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/video/getMultiFileVideoDownloadUrl",
        method: "post",
        data: params,
    });
};
//视频录像列表
const getFileUploadStatus = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/video/getFileUploadStatus",
        method: "post",
        data: params,
    });
};

//下载列表
const getDownloadPage = function (params) {
    return fetch({
        url: "/download/getDownloadPage",
        method: "post",
        data: params,
    });
};
//文件下载-批量
const getDownloadUrl = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/download/getDownloadUrl",
        method: "post",
        data: params,
    });
};
//文件删除
const deleteDownloadData = function (params) {
    return fetch({
        url: "/download/deleteDownloadData",
        method: "post",
        data: params,
    });
};
//文件下载类型枚举
const getDownStatusEnum = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/download/getDownStatusEnum",
        method: "get",
        data: params,
    });
};

//重新上传-录像
const reUploadVideo = function (params) {
    return fetch({
        url: "/download/reUploadVideo",
        method: "post",
        data: params,
    });
};
//文件类型枚举
const getDownTypeEnum = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/download/getDownTypeEnum",
        method: "get",
        data: params,
    });
};
//获取某段轨迹车辆信息
const carTraceListPage = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/video/getGpsTrackPage",
        method: "post",
        data: params,
    });
};
const videoPlayBlackApiList = {
    /*  area start  */
    getDownTypeEnum,
    reUploadVideo,
    getDownStatusEnum,
    getDownloadUrl,
    deleteDownloadData,
    getFileUploadStatus,
    getVideoDownloadUrl,
    videoGetMultiFileVideoDownloadUrl,
    getPlayBackUrl,
    getVideoList,
    pageLongStay,
    pageAllLongStay,
    deleteDownloadCarPhoto,
    getDownloadCarPhotoList,
    getDownloadCarPhotoInfo,
    getVideoPlayDeviceInfoByCarId,
    getUserDownloadList,
    getOnlineDate,
    exportGps,
    saveGpsTemplate,
    carTraceDataStats,
    queryGpsTemplateList,
    queryGpsTemplateDetail,
    delGpsTemplate,
    pageQueryGpsTemplateList,
    addDownloadCount,
    deleteDownload,
    addTransportTasks,
    updateTransportTasks,
    getTransportTasksPage,
    getEleFenceByTransportTasksId,
    getOnlineDateByCarNumber,
    deleteTransportTasks,
    transportTasksCreateTemplate,
    getTransportTasksDetails,
    getTransportTasksList,
    getDownloadPage,
    carTraceListPage,
    /*  area end    */
};

export default videoPlayBlackApiList;
