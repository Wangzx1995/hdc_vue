import fetch from "@/utils/fetch";

/**
 * 装车任务列表
 */
const getDeviceLoadTaskPage = function (param) {
    return fetch({
        url: "/deviceLoadTask/page",
        method: "post",
        data: param,
    });
};

/**
 * 装车师傅下拉搜索
 */
const getLoadUsers = function (param) {
    return fetch({
        url: "/deviceLoadTask/getLoadUsers",
        method: "get",
        params: param,
    });
};

/**
 * 安装检测项
 */
const getAllCheckList = function (param) {
    return fetch({
        url: "/deviceLoadTask/getAllCheckList",
        method: "get",
        data: param,
    });
};

/**
 * 新建装车任务
 */
const deviceLoadTaskAdd = function (param) {
    return fetch({
        url: "/deviceLoadTask/add",
        method: "post",
        data: param,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 更新装车任务
 */
const deviceLoadTaskUpdate = function (param) {
    return fetch({
        url: "/deviceLoadTask/update",
        method: "post",
        data: param,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 装车任务详情
 */
const getDeviceLoadTaskDetails = function (param) {
    return fetch({
        url: "/deviceLoadTask/getDetails",
        method: "get",
        params: param,
    });
};

/**
 * 装车报告列表
 */
const getDeviceLoadReportPage = function (param) {
    return fetch({
        url: "/deviceLoadReport/page",
        method: "post",
        data: param,
    });
};

/**
 * 装车报告详情
 */
const getReportDetail = function (param) {
    return fetch({
        url: "/deviceLoadReport/getReportDetail",
        method: "get",
        params: param,
    });
};

/**
 * 报告审核通过
 */
const finishVerify = function (param) {
    return fetch({
        url: "/deviceLoadReport/finishVerify",
        method: "post",
        data: param,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 撤回报告
 */
const revokeVerify = function (param) {
    return fetch({
        url: "/deviceLoadReport/revoke",
        method: "post",
        data: param,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 撤回报告
 */
const sendActiveCode = function (param) {
    return fetch({
        url: "/deviceLoadReport/sendActiveCode",
        method: "post",
        data: param,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 待处理故障订阅查询
 */
const getSubscribe = function (params) {
    return fetch({
        url: "/faultSubscribe/getSubscribe",
        method: "post",
        data: params,
        // headers: {
        //   "Content-Type": "application/json",
        // },
    });
};
/**
 * 待处理故障订阅设置
 */
const faultSubscribeSubmit = function (params) {
    return fetch({
        url: "/faultSubscribe/submit",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 更新装车任务状态
 */
const updateStatus = function (params) {
    return fetch({
        url: "/deviceLoadTask/updateStatus",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 批量重新下发激活码
 */
const batchSendActiveCode = function (param) {
    return fetch({
        url: "/deviceLoadReport/batchSendActiveCode",
        method: "post",
        data: param,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 处理 无需审核 的记录
 */
const handleIgnoreReport = function (param) {
    return fetch({
        url: "/deviceLoadReport/handleIgnoreReport",
        method: "post",
        data: param,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
const deviceTaskApiList = {
    handleIgnoreReport,
    batchSendActiveCode,
    getDeviceLoadTaskPage,
    getLoadUsers,
    getAllCheckList,
    deviceLoadTaskAdd,
    deviceLoadTaskUpdate,
    getDeviceLoadTaskDetails,
    getDeviceLoadReportPage,
    getReportDetail,
    finishVerify,
    revokeVerify,
    sendActiveCode,
    getSubscribe,
    faultSubscribeSubmit,
    updateStatus,
};

export default deviceTaskApiList;
