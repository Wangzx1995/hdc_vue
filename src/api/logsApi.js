import fetch from "@/utils/fetch";

/**
 * 获取设备上下线日志列表
 * @param areaDto
 */
const getDeviceOnlineLogPage = function (params) {
    return fetch({
        url: "/logs/deviceOnlineLogPage",
        method: "post",
        data: params,
    });
};
/**
 * 获取系统日志列表
 * @param areaDto
 */
const getSysLogPage = function (params) {
    return fetch({
        url: "/logs/sysLogPage",
        method: "post",
        data: params,
    });
};
/**
 * 获取远程操作日志列表
 * @param areaDto
 */
const getDeviceCtrLogPage = function (params) {
    return fetch({
        url: "/logs/deviceCtrLogPage",
        method: "post",
        data: params,
    });
};
/**
 * 获取运营操作日志列表
 * @param areaDto
 */
const getOperationLogPage = function (params) {
    return fetch({
        url: "/logs/operationLogPage",
        method: "post",
        data: params,
    });
};

//设备操作日志查询
const getPageDevControlg = function (data) {
    return fetch({
        url: "/logs/pageDevControl",
        method: "post",
        data: data,
    });
};
const getAppOpLogType = function () {
    return fetch({
        url: "/logs/getAppOpLogType",
        method: "post",
    });
};

/**
 * 获取登录日志列表
 * @param areaDto
 */
const getLoginLogPage = function (params) {
    return fetch({
        url: "/logs/loginLogPage",
        method: "post",
        data: params,
    });
};

/**
 * 导出设备操作日志
 * @param params
 */
const doExportDevOperateLog = function (params) {
    return fetch({
        url: "/logs/exportDevOperateLog",
        method: "post",
        data: params,
    });
};

/**
 * 导出系统操作日志
 * @param params
 */
const doExportOperateLog = function (params) {
    return fetch({
        url: "/logs/exportOperateLog",
        method: "post",
        data: params,
    });
};

/**
 * 导出用户登录日志
 * @param params
 */
const doExportLoginLog = function (params) {
    return fetch({
        url: "/logs/exportLoginLog",
        method: "post",
        data: params,
    });
};

/**
 * 查询上下线日志
 * @param params
 */
const pageDeviceOnline = function (params) {
    return fetch({
        url: "/deviceOnline/pageDeviceOnline",
        method: "post",
        data: params,
    });
};
const logsApiList = {
    /*  area start  */
    getAppOpLogType,
    getDeviceOnlineLogPage,
    getSysLogPage,
    getDeviceCtrLogPage,
    getOperationLogPage,
    getPageDevControlg,
    getLoginLogPage,
    doExportDevOperateLog,
    doExportOperateLog,
    doExportLoginLog,
    pageDeviceOnline,
    /*  area end    */
};

export default logsApiList;
