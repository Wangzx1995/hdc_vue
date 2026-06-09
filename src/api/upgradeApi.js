/**
 * Created by chenhu5 on 2017/12/15.
 */
import fetch from "@/utils/fetch";

/**
 * 获取型号下拉框
 */
const getProductList_upgrade = function () {
    return fetch({
        // url: "/upgrade/getProductList",
        url: "/hikDevice/getDeviceModelCodeList",
        method: "post",
        data: {},
    });
};

/**
 * 查询最新的10个临时固件信息
 *
 * @param params
 */
const getLatestTempFirmwaresByProductKey_upgrade = function (param) {
    return fetch({
        url: "/upgrade/getLatestTempFirmwaresByProductKey",
        method: "post",
        data: param,
    });
};

const addFirmwareTemp_upgrade = function (param) {
    return fetch({
        url: "",
        method: "post",
        data: param,
    });
};

/**
 * 开始升级-接入设备升级
 * @param deviceUpgradeDto
 */
const startUpgrade_upgrade = function (deviceUpgradeDto) {
    return fetch({
        url: "/upgrade/startUpgrade",
        method: "post",
        data: deviceUpgradeDto,
    });
};
/**
 * 判断当前批次内是否包含升级任务
 */
const pickCheckUpgradeTask = function (params) {
    return fetch({
        url: "/upgrade/checkUpgradeTask",
        method: "post",
        data: params,
    });
};
/**
 * 开始升级-非接入设备升级
 * @param deviceUpgradeDto
 */
const startUpgradeNoAccessDev_upgrade = function (deviceUpgradeDto) {
    return fetch({
        url: "/upgrade/startUpgradeNoAccessDev",
        method: "post",
        data: deviceUpgradeDto,
    });
};

/**
 * 获取带升级信息的设备列表
 * @param params
 */
const getDeviceManagerUpgradeDevicePage_upgrade = function (params) {
    return fetch({
        url: "/upgrade/upgradeDevicePage",
        method: "post",
        data: params,
    });
};

//获取项目-分组二级树结构(接入)
const getGroupTreeHik_upgrade = function () {
    return fetch({
        url: "/upgrade/getHikGroupTree",
        method: "post",
        data: {},
    });
};

//获取项目-分组二级树结构（非接入）
const getGroupTree_upgrade = function () {
    return fetch({
        url: "upgrade/getOutGroupTree",
        method: "post",
        data: {},
    });
};

const getUpgradeOutDevicePage_upgrade = function (data) {
    return fetch({
        url: "/upgrade/getUpgradeOutDevicePage",
        method: "post",
        data: data,
    });
};

const refreshSession = function (data) {
    return fetch({
        url: "/upgrade/refreshSession",
        method: "post",
    });
};

const deleteFirmwareTemp_upgrade = function (id) {
    return fetch({
        url: "/upgrade/deleteFirmwareTemp",
        method: "post",
        data: {
            id: id,
        },
    });
};

const deleteFirmwareTemp_upgrade_nem = function (data) {
    return fetch({
        url: "/upgrade/deleteFirmwareTemp",
        method: "post",
        data: data,
    });
};

// 小版本固件列表
const getMinorFirmware = function (data) {
    return fetch({
        url: "/upgrade/getMinorFirmware",
        method: "post",
        data: data,
    });
};

/*上传小版本固件*/
const uploadMinorFirmware = function (param) {
    return fetch({
        url: "/upgrade/uploadMinorFirmware",
        method: "post",
        data: param,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/*重新查询进度*/
const getUpgradeStatusFromDev = function (param) {
    return fetch({
        url: "/upgrade/getUpgradeStatusFromDev",
        method: "POST",
        data: param,
    });
};
/*批量输入升级车牌号，根据设备型号进行分组显示*/
const checkPlateNumModelList = function (param) {
    return fetch({
        url: "/upgrade/checkPlateNumModelList",
        method: "POST",
        data: param,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/*未完成升级--批量重新升级*/
const reUpgradeByIds = function (param) {
    return fetch({
        url: "/upgrade/reUpgradeByIds",
        method: "POST",
        data: param,
    });
}; /*未完成升级--批量停止升级*/
const stopUpgradeByIds = function (param) {
    return fetch({
        url: "/upgrade/stopUpgradeByIds",
        method: "POST",
        data: param,
    });
};
/*固件包分享给子用户*/
const updateShareOpen = function (param) {
    return fetch({
        url: "/upgrade/updateShareOpen",
        method: "POST",
        data: param,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/*终端外设信息*/
const outDevInfo = function (param) {
    return fetch({
        url: "/upgrade/outDevInfo",
        method: "POST",
        data: param,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/*根据类型查询设备下拉列表*/
const deviceSearchDropDown = function (param) {
    return fetch({
        url: "/upgrade/deviceSearchDropDown",
        method: "POST",
        data: param,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/*批量输入的设备，根据设备型号进行分组显示*/
const getGroupDeviceByModelCodeDto = function (param) {
    return fetch({
        url: "/upgrade/getGroupDeviceByModelCodeDto",
        method: "POST",
        data: param,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
const upgradeApiList = {
    /*  area start  */
    getGroupDeviceByModelCodeDto,
    deviceSearchDropDown,
    updateShareOpen,
    outDevInfo,
    getProductList_upgrade,
    getLatestTempFirmwaresByProductKey_upgrade,
    addFirmwareTemp_upgrade,
    startUpgrade_upgrade,
    pickCheckUpgradeTask,
    startUpgradeNoAccessDev_upgrade,
    getDeviceManagerUpgradeDevicePage_upgrade,
    getGroupTreeHik_upgrade,
    getGroupTree_upgrade,
    getUpgradeOutDevicePage_upgrade,
    refreshSession,
    deleteFirmwareTemp_upgrade,
    deleteFirmwareTemp_upgrade_nem,
    getMinorFirmware,
    uploadMinorFirmware,
    getUpgradeStatusFromDev,
    checkPlateNumModelList,
    reUpgradeByIds,
    stopUpgradeByIds,
    /*  area end    */
};

export default upgradeApiList;
