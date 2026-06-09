import fetch from "@/utils/fetch";
import Qs from "qs";
/**
 * IP锁定获取组织树
 * @param params
 */
const getIpLockTree = function (params) {
    return fetch({
        url: "/ipLock/getOrgTree",
        method: "post",
        data: params,
    });
};
/**
 * IP锁定模板列表
 * @param params
 */
const getIpLockItem = function (params) {
    return fetch({
        url: "/ipLock/getIpLockItem",
        method: "post",
        data: params,
    });
};
/**
 * IP锁定查询设备
 * @param params
 */
const getIpLockDevicePage = function (params) {
    return fetch({
        url: "/ipLock/ipLockDevicePage",
        method: "post",
        data: params,
    });
};
/**
 * IP锁定模板查询
 * @param params
 */
const getIplockPage = function (params) {
    return fetch({
        url: "/ipLock/ipLockPage",
        method: "post",
        data: params,
    });
};
/**
 * IP锁定字典获取
 * @param params
 */
const findTypes = function (params) {
    return fetch({
        url: "/sys/dict/find/type",
        method: "post",
        data: params,
    });
};
/**
 * 防转网设置
 * @param params
 */
const updateDeviceIpLock = function (params) {
    return fetch({
        url: "/ipLock/updateDeviceIpLock",
        method: "post",
        data: params,
        timeout: 900000,
    });
};
/**
 * 获取要执行的设备数和已经被设置模板的设备数
 * @param params
 */
const getExistIpLockDevice = function (params) {
    return fetch({
        url: "/ipLock/getExistIpLockDevice",
        method: "post",
        data: params,
    });
};

/**
 * 编辑防转网模板
 * @param params
 */
const ipLockEdit = function (params) {
    return fetch({
        url: "/ipLock/editIpLock",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 新增防转网模板
 * @param params
 */
const ipLockAdd = function (params) {
    return fetch({
        url: "/ipLock/addIpLock",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 删除防转网模板
 * @param params
 */
const ipLockDelete = function (params) {
    return fetch({
        url: "/ipLock/delIpLock",
        method: "post",
        data: params,
    });
};
/**
 * 控制防转网模板启用状态
 * @param params
 */
const editIpLockUseEnable = function (params) {
    return fetch({
        url: "/ipLock/editIpLockUseEnable",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 获取防御日志
 * @param params
 */
const getIpLockExecuteLog = function (params) {
    return fetch({
        url: "/ipLock/getIpLockExecuteLog",
        method: "post",
        data: params,
    });
};
/**
 * 批量应用/停用
 * @param params
 */
const updateIpLockCapacity = function (params) {
    return fetch({
        url: "/ipLock/updateIpLockCapacity",
        method: "post",
        data: params,
    });
};

/**
 * 用户是否支持锁定功能
 * @param params
 */
const ipLockDeviceLockUserCheck = function (params) {
    return fetch({
        url: "/ipLock/ipLockDeviceLockUserCheck",
        method: "post",
        data: params,
    });
};
/**
 * 防转网锁定-解锁功能
 * @param params
 */
const ipLockDeviceLockPlatform = function (params) {
    return fetch({
        url: "/ipLock/ipLockDeviceLockPlatform",
        method: "post",
        data: params,
    });
};

/**
 * 获取驾驶员信息列表
 * @param params
 */
const getDriverInfoList = function (params) {
    return fetch({
        url: "/intelligentParameterConfig/getDriverInfoList",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 驾驶员编辑标签
 * @param params
 */
const editDriverLabelBind = function (params) {
    return fetch({
        url: "/intelligentParameterConfig/editDriverLabelBind",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 开启/关闭 智能参数下发
 * @param params
 */
const editDriverLabelConfigEnable = function (params) {
    return fetch({
        url: "/intelligentParameterConfig/editDriverLabelConfigEnable",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 获取标签信息
 * @param params
 */
const getLabelMappingInfo = function (params) {
    return fetch({
        url: "/intelligentParameterConfig/getLabelMappingInfo",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 根据驾驶员ID获取智能参数展示
 * @param params
 */
const getIntelligentParamByDriverId = function (params) {
    return fetch({
        url: "/intelligentParameterConfig/getIntelligentParamByDriverId",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 设置智能参数模板灵敏度
 * @param params
 */
const editDriverLabelConfigSensitivity = function (params) {
    return fetch({
        url: "/intelligentParameterConfig/editDriverLabelConfigSensitivity",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
const ipLockApiList = {
    getIpLockTree,
    getIpLockItem,
    getIpLockDevicePage,
    getIplockPage,
    findTypes,
    updateDeviceIpLock,
    ipLockEdit,
    ipLockAdd,
    ipLockDelete,
    editIpLockUseEnable,
    getIpLockExecuteLog,
    getExistIpLockDevice,
    updateIpLockCapacity,
    ipLockDeviceLockUserCheck,
    ipLockDeviceLockPlatform,
    getDriverInfoList,
    editDriverLabelBind,
    editDriverLabelConfigEnable,
    getLabelMappingInfo,
    getIntelligentParamByDriverId,
    editDriverLabelConfigSensitivity,
};
export default ipLockApiList;
