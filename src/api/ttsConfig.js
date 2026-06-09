import fetch from "@/utils/fetch";

/**
 * 获得TTS常用指令列表
 * @param params
 */
const getTTSCmdList = function (params) {
    return fetch({
        url: "/deviceTTSConfig/getTTSCmdList",
        method: "post",
        data: params,
    });
};

/**
 * 新增TTS常用指令
 * @param params
 */
const saveTTSCmd = function (params) {
    return fetch({
        url: "/deviceTTSConfig/saveTTSCmd",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 勾选设备--TTS自定义下发
 * @param params
 */
const customSaveTTS = function (params) {
    return fetch({
        url: "/deviceTTSConfig/customSaveTTS",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 删除TTS常用指令
 * @param params
 */
const deleteTTSCmd = function (params) {
    return fetch({
        url: "/deviceTTSConfig/deleteTTSCmd",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 勾选设备--TTS下发
 * @param params
 */
const saveTTSConfig = function (params) {
    return fetch({
        url: "/deviceTTSConfig/saveTTSConfig",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * TTS配置-配置查看-车辆列表查询
 * @param params
 */
const getDeviceTTSParamLogPage = function (params) {
    return fetch({
        url: "/deviceTTSConfig/getDeviceTTSParamLogPage",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * TTS配置-配置查看-任务列表
 * @param params
 */
const getTTSParamLogPage = function (params) {
    return fetch({
        url: "/deviceTTSConfig/getTTSParamLogPage",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * TTS配置-配置查看-历史
 * @param params
 */
const getTTSHistory = function (params) {
    return fetch({
        url: "/deviceTTSConfig/getTTSHistory",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * TTS配置-配置查看-历史
 * @param params
 */
const exportTTSHistory = function (params) {
    return fetch({
        url: "/deviceTTSConfig/exportTTSHistory",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * TTS配置-未完成配置导出
 * @param params
 */
const exportTtsUnfinishedLog = function (params) {
    return fetch({
        url: "/deviceTTSConfig/exportTtsUnfinishedLog",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * TTS配置- 配置查看-统计
 * @param params
 */
const getTTSCountInfo = function (params) {
    return fetch({
        url: "/deviceTTSConfig/getTTSCountInfo",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * TTS配置-TTS下发-整组配置
 * @param params
 */
const saveTTSConfigGroup = function (params) {
    return fetch({
        url: "/deviceTTSConfig/saveTTSConfigGroup",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * TTS配置-TTS配置查看-详情-组织列表
 */
const getTTSBatchOrganizeInfo = function (params) {
    return fetch({
        url: "/deviceTTSConfig/getTTSBatchOrganizeInfo",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 获得选中的批次信息
 */
const getTTSBatchInfo = function (params) {
    return fetch({
        url: "/deviceTTSConfig/getTTSBatchInfo",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * TTS配置-TTS配置查看-详情-重新配置
 */
const saveTTSConfigAgain = function (params) {
    return fetch({
        url: "/deviceTTSConfig/saveTTSConfigAgain",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * TTS配置-TTS配置查看-详情-重新配置
 */
const batchSaveTTSConfig = function (params) {
    return fetch({
        url: "/deviceTTSConfig/batchSaveTTSConfig",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * TTS配置-设备列表查询
 */
const getTTSDevicePage = function (params) {
    return fetch({
        url: "/deviceTTSConfig/getTTSDevicePage",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * TTS配置-获取设备配置时间及结果
 */
const getParamDeviceById = function (params) {
    return fetch({
        url: "/deviceTTSConfig/getParamDeviceById",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * TTS配置-获取组织列表
 */
const getTTSParamOrganizeTree = function (params) {
    return fetch({
        url: "/deviceTTSConfig/getParamOrganizeTree",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * TTS配置-配置查看-有配置任务组织
 */
const getTTSOrganizeTreeWithParamData = function (params) {
    return fetch({
        url: "/deviceTTSConfig/getOrganizeTreeWithParamData",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * TTS配置下发导出
 */
const exportTTSDeviceParamLogResult = function (params) {
    return fetch({
        url: "/deviceTTSConfig/exportDeviceParamLogResult",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * TTS配置-任务导出
 */
const exportTTSBatchInfo = function (params) {
    return fetch({
        url: "/deviceTTSConfig/exportTTSBatchInfo",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 生成TTS批量导入配置模板
 */
const generateTTSTemplate = function (data) {
    return fetch({
        url: "/deviceTTSConfig/generateTTSTemplate",
        method: "post",
        data: { templateCode: "ttsBatchConfigImport", ...data },
    });
};
const ipLockApiList = {
    generateTTSTemplate,
    getTTSCmdList,
    saveTTSCmd,
    customSaveTTS,
    deleteTTSCmd,
    saveTTSConfig,
    getDeviceTTSParamLogPage,
    getTTSParamLogPage,
    getTTSHistory, //历史
    exportTTSHistory,
    exportTtsUnfinishedLog,
    getTTSCountInfo,
    saveTTSConfigGroup,
    getTTSBatchOrganizeInfo,
    getTTSBatchInfo,
    saveTTSConfigAgain,
    batchSaveTTSConfig,
    getTTSDevicePage,
    getParamDeviceById,
    getTTSParamOrganizeTree,
    getTTSOrganizeTreeWithParamData,
    exportTTSDeviceParamLogResult,
    exportTTSBatchInfo,
};
export default ipLockApiList;
