import fetch from "@/utils/fetch";

/**
 * 获取外设类型信息
 */
const newFirmwareGetPeripheralList = function (param) {
    return fetch({
        url: "/new/firmware/getPeripheralList",
        method: "post",
        data: param,
    });
};

/**
 * 查询固件信息
 */
const newFirmwarePage = function (param) {
    return fetch({
        url: "/new/firmware/page",
        method: "post",
        data: param,
    });
};

/**
 * 获取项目开放空间及使用情况
 */
const newFirmwareGetOmsProjectFileSpace = function (param) {
    return fetch({
        url: "/new/firmware/getOmsProjectFileSpace",
        method: "post",
        data: param,
    });
};

/**
 * 获取固件包版本号信息
 */
const newFirmwareGetFirmwareInfo = function (param) {
    return fetch({
        url: "/new/firmware/getFirmwareInfo",
        method: "post",
        data: param,
    });
};

/**
 * 添加固件信息
 */
const newFirmwareAddFirmware = function (param) {
    return fetch({
        url: "/new/firmware/addFirmware",
        method: "post",
        data: param,
    });
};

/**
 * 根据固件包唯一标识获取固件包文件信息
 */
const newFirmwareGetFirmwareFileInfoByFirmwareGuid = function (param) {
    return fetch({
        url: "/new/firmware/getFirmwareFileInfoByFirmwareGuid",
        method: "post",
        data: param,
    });
};

/**
 * 获取当前用户的所有下级用户信息
 */
const newFirmwareGetSubordinateUsersPage = function (param) {
    return fetch({
        url: "/new/firmware/getSubordinateUsersPage",
        method: "post",
        data: param,
    });
};

/**
 * 固件分享
 */
const newFirmwareShareOpen = function (param) {
    return fetch({
        url: "/new/firmware/shareOpen",
        method: "post",
        data: param,
    });
};

/**
 * 固件取消分享
 */
const newFirmwareShareClose = function (param) {
    return fetch({
        url: "/new/firmware/shareClose",
        method: "post",
        data: param,
    });
};

/**
 * 获取固件目前使用情况
 */
const newFirmwareGetFirmwaresUseInfo = function (param) {
    return fetch({
        url: "/new/firmware/getFirmwaresUseInfo",
        method: "post",
        data: param,
    });
};

/**
 * 删除固件
 */
const newFirmwareDelFirmwares = function (param) {
    return fetch({
        url: "/new/firmware/delFirmwares",
        method: "post",
        data: param,
    });
};

/**
 * 查询账号是否需要降版本验证码
 */
const whetherCheckLowVersionUpgrade = function (param) {
    return fetch({
        url: "/new/upgrade/whetherCheckLowVersionUpgrade",
        method: "get",
        data: param,
    });
};
const deviceUpgradeApiList = {
    newFirmwareGetPeripheralList,
    newFirmwarePage,
    newFirmwareGetOmsProjectFileSpace,
    newFirmwareGetFirmwareInfo,
    newFirmwareAddFirmware,
    newFirmwareGetFirmwareFileInfoByFirmwareGuid,
    newFirmwareGetSubordinateUsersPage,
    newFirmwareShareOpen,
    newFirmwareShareClose,
    newFirmwareGetFirmwaresUseInfo,
    newFirmwareDelFirmwares,
    whetherCheckLowVersionUpgrade,
};

export default deviceUpgradeApiList;
