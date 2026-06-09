import fetch from "@/utils/fetch";

/**
 * 据关键字查询设备及车辆信息
 */
const newUpgradeGetDevByKeywords = function (param) {
    return fetch({
        url: "/common/getDevByKeywords",
        method: "post",
        data: param,
    });
};

/**
 * 设备升级列表查询接口
 */
const newUpgradePage = function (param) {
    return fetch({
        url: "/new/upgrade/page",
        method: "post",
        data: param,
    });
};

/**
 * 获取降版本操作短信验证码
 */
const newUpgradeGetPhoneVeryCode = function (param) {
    return fetch({
        url: "/new/upgrade/getPhoneVeryCode",
        method: "post",
        data: param,
    });
};

/**
 * 创建升级任务
 */
const newUpgradeCreateUpgradeTask = function (param) {
    return fetch({
        url: "/new/upgrade/createUpgradeTask",
        method: "post",
        data: param,
    });
};

/**
 * 重新升级
 */
const newUpgradeReUpgrade = function (param) {
    return fetch({
        url: "/new/upgrade/reUpgrade",
        method: "post",
        data: param,
    });
};

/**
 * 我的升级任务明细列表
 */
const newUpgradeGetUpgradeTaskDevVoPage = function (param) {
    return fetch({
        url: "/new/upgrade/getUpgradeTaskDevVoPage",
        method: "post",
        data: param,
    });
};

/**
 * 我的升级任务列表
 */
const newUpgradeGetUpgradeTaskVoPage = function (param) {
    return fetch({
        url: "/new/upgrade/getUpgradeTaskVoPage",
        method: "post",
        data: param,
    });
};

/**
 * 终止升级
 */
const newUpgradeStopUpgrade = function (param) {
    return fetch({
        url: "/new/upgrade/stopUpgrade",
        method: "post",
        data: param,
    });
};

/**
 * 获取有升级任务的组织信息
 */
const newUpgradeGetOrganizeTreeWithUpgradeData = function (param) {
    return fetch({
        url: "/new/upgrade/getOrganizeTreeWithUpgradeData",
        method: "post",
        data: param,
    });
};

/**
 * 根据任务ID获取升级任务信息
 */
const newUpgradeGetUpgradeTaskVoById = function (param) {
    return fetch({
        url: "/new/upgrade/getUpgradeTaskVoById",
        method: "post",
        data: param,
    });
};

/**
 * 获取指定任务升级失败原因分析数据
 */
const newUpgradeGetTaskErrorAnalysisById = function (param) {
    return fetch({
        url: "/new/upgrade/getTaskErrorAnalysisById",
        method: "post",
        data: param,
    });
};

/**
 * 升级历史
 */
const newUpgradeGetUpgradeTaskDevLogVoPage = function (param) {
    return fetch({
        url: "/new/upgrade/getUpgradeTaskDevLogVoPage",
        method: "post",
        data: param,
    });
};

/**
 * 获取未完成升级
 */
const newUpgradeGetUpgradeNotCompletedPage = function (param) {
    return fetch({
        url: "/new/upgrade/getUpgradeNotCompletedPage",
        method: "post",
        data: param,
    });
};

/**
 * 恢复升级任务
 */
const newUpgradeReUpgradeTask = function (param) {
    return fetch({
        url: "/new/upgrade/reUpgradeTask",
        method: "post",
        data: param,
    });
};
const deviceUpgradeApiList = {
    newUpgradeGetDevByKeywords,
    newUpgradePage,
    newUpgradeGetPhoneVeryCode,
    newUpgradeCreateUpgradeTask,
    newUpgradeReUpgrade,
    newUpgradeGetUpgradeTaskDevVoPage,
    newUpgradeGetUpgradeTaskVoPage,
    newUpgradeStopUpgrade,
    newUpgradeGetOrganizeTreeWithUpgradeData,
    newUpgradeGetUpgradeTaskVoById,
    newUpgradeGetTaskErrorAnalysisById,
    newUpgradeGetUpgradeTaskDevLogVoPage,
    newUpgradeGetUpgradeNotCompletedPage,
    newUpgradeReUpgradeTask,
};

export default deviceUpgradeApiList;
