/**
 * Created by jinjinhui on 2020/6/29.
 */
import fetch from "@/utils/fetch";

/**
 * 获取型号下拉框
 */
const getDeviceModelList_DeviceParamTask = function () {
    return fetch({
        url: "/deviceParamTask/getDeviceModelList",
        method: "post",
        data: {},
    });
};
/**
 * 故障台账列表
 */
const faultRecordPage = function (param) {
    return fetch({
        url: "/faultManagement/getFaultRecordPage",
        method: "post",
        data: param,
    });
};
/**
 * 获取参数设置日志批次列表
 */
const getDeviceParamLogBatchPage_DeviceParamTask = function (param) {
    return fetch({
        url: "/deviceParamTask/pageDeviceParamLogBatch",
        method: "post",
        data: param,
    });
};

/**
 * 获取参数设置统计信息
 * @param param
 */
const getDeviceParamLogStatistics_DeviceParamTask = function (param) {
    return fetch({
        url: "/deviceParamTask/deviceParamLogStatistics",
        method: "post",
        data: param,
    });
};

/**
 * 取消设备下发获取参数命令
 * @param param
 */
const cancelDeviceParamCmd = function (param) {
    return fetch({
        url: "/deviceParamTask/cancelDeviceParamCmd",
        method: "post",
        data: param,
    });
};

/**
 * 获取参数设置日志批次详情
 * @param param
 */
const getDeviceParamLogPage_ParamTask = function (param) {
    return fetch({
        url: "/deviceParamTask/pageDeviceParamLogDetail",
        method: "post",
        data: param,
    });
};

/**
 * 获取任务批次中的配置文件下载url
 * @param param
 */
const getConfigFileUrlFromParamLog = function (param) {
    return fetch({
        url: "/deviceParamTask/getConfigFileUrlFromParamLog",
        method: "post",
        data: param,
    });
};

/**
 * 获取配置文件上传任务详情
 * @param param
 */
const getUploadConfigFileLogPage = function (param) {
    return fetch({
        url: "/deviceParamTask/pageUploadFileLogDetail",
        method: "post",
        data: param,
    });
};

/**
 * 获取上传配置文件任务列表
 * @param param
 */
const getDeviceParamLogBatchPage_DeviceUploadConfigFileTask = function (param) {
    return fetch({
        url: "/deviceParamTask/pageDevUploadConfigFile",
        method: "post",
        data: param,
    });
};

/**
 * 获取下载配置文件任务列表
 * @param params
 */
const getDeviceParamLogBatchPage_DeviceDownloadConfigFileTask = function (
    param
) {
    return fetch({
        url: "/deviceParamTask/pageDevDownloadConfigFile",
        method: "post",
        data: param,
    });
};

/**
 * 获取下载配置文件任务详情
 * @param param
 */
const getDownloadConfigFileLogPage = function (param) {
    return fetch({
        url: "/deviceParamTask/pageDownloadFileLogDetail",
        method: "post",
        data: param,
    });
};

/**
 * 获取参数设置批次列表
 * @param param
 */
const getDeviceOperateParamLogBatchPage_DeviceParamTask = function (param) {
    return fetch({
        url: "/deviceParam/getDeviceSetParamLogBatchPage",
        method: "post",
        data: param,
    });
};

/**
 * 获取参数设置批次详情
 * @param param
 */
const getDeviceParamOperateLogPage_ParamTask = function (param) {
    return fetch({
        url: "/deviceParam/getDeviceSetParamLogPage",
        method: "post",
        data: param,
    });
};

/**
 * 获取参数配置统计信息
 * @param param
 */
const getDeviceParamOperateLogStatistics_DeviceParamTask = function (param) {
    return fetch({
        url: "/deviceParam/getDeviceSetParamLogStatistics",
        method: "post",
        data: param,
    });
};

/**
 * 勾选参数进行查询
 * @param param
 */
const exportEHomeQueryImageTask = function (param) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/deviceEHomeQuery/exportEHomeQueryImageTask",
        method: "post",
        data: param,
    });
};

const upgradeTaskApiList = {
    /*  area start  */
    exportEHomeQueryImageTask,
    getDeviceModelList_DeviceParamTask,
    getDeviceParamLogBatchPage_DeviceParamTask,
    faultRecordPage,
    getDeviceParamLogStatistics_DeviceParamTask,
    cancelDeviceParamCmd,
    getConfigFileUrlFromParamLog,
    getDeviceParamLogPage_ParamTask,
    getDeviceOperateParamLogBatchPage_DeviceParamTask,
    getDeviceParamOperateLogStatistics_DeviceParamTask,
    getDeviceParamOperateLogPage_ParamTask,
    getDeviceParamLogBatchPage_DeviceUploadConfigFileTask,
    getUploadConfigFileLogPage,
    getDeviceParamLogBatchPage_DeviceDownloadConfigFileTask,
    getDownloadConfigFileLogPage,
    /*  area end    */
};

export default upgradeTaskApiList;
