import fetch from "@/utils/fetch";

/**
 * 获取各种报警数据的统计数据
 * @param params
 */
const getAnomalyStatistics = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getAnomalyStatistics",
        method: "post",
        data: params,
    });
};

/**
 * 获取设备巡检列表
 * @param params
 */
const equipmentInspectionPage = function (params) {
    return fetch({
        url: "/new/equipmentInspection/page",
        method: "post",
        data: params,
    });
};

/**
 * 获取设备巡检详情--设备概览
 * @param params
 */
const equipmentInspectionSituation = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/situation",
        method: "post",
        data: params,
    });
};

/**
 * 巡检详情--设备上下线记录
 * @param params
 */
const equipmentInspectionDeviceOnlineRecord = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/deviceOnlineRecord",
        method: "post",
        data: params,
    });
};
/**
 * 获取设备巡检详情--设备概览--重启设备
 * @param params
 */
const equipmentInspectionReboot = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/reboot",
        method: "post",
        data: params,
    });
};
/**
 * 获取设备巡检详情--设备概览--简单恢复出厂设置
 * @param params
 */
const equipmentInspectionFactoryReset = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/factoryReset",
        method: "post",
        data: params,
    });
};
/**
 * 获取设备巡检详情--存储状态
 * @param params
 */
const equipmentInspectionStorageStatus = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/storageStatus",
        method: "post",
        data: params,
    });
};

/**
 * 获取设备巡检详情--存储状态--获取当前存储介质参数,用于格式化
 * @param params
 */
const equipmentInspectionStorageParam = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/storageParam",
        method: "post",
        data: params,
    });
};

/**
 * 获取设备巡检详情--存储状态--下发格式化指令
 * @param params
 */
const equipmentInspectionFormatHdd = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/formatHdd",
        method: "post",
        data: params,
    });
};

/**
 * 获取设备巡检详情--存储状态--查看格式化记录
 * @param params
 */
const equipmentInspectionFormatLog = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/format/log",
        method: "post",
        data: params,
    });
};
/**
 * 获取设备巡检详情--视频状态
 * @param params
 */
const equipmentInspectionVideoInfo = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/VideoInfo",
        method: "post",
        data: params,
    });
};

/**
 * 获取设备巡检详情--网络信号
 * @param params
 */
const equipmentInspectionNetworkInfo = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/networkInfo",
        method: "post",
        data: params,
    });
};
/**
 * 巡检详情--设备上下线状态
 * @param params
 */
const newEquipmentInspectionDeviceOnlineInfo = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/deviceOnlineInfo",
        method: "post",
        data: params,
    });
};

/**
 * 巡检详情--定位状态
 * @param params
 */
const equipmentInspectionLocationInfo = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/locationInfo",
        method: "post",
        data: params,
    });
};

/**
 * 巡检详情--架设状态
 * @param params
 */
const equipmentInspectionAlgInfo = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/algInfo",
        method: "post",
        data: params,
    });
};

/**
 * 巡检详情--多中心连接状态
 * @param params
 */
const equipmentInspectionDevicePlatformInfo = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/devicePlatformInfo",
        method: "post",
        data: params,
    });
};

/**
 * 巡检详情--设备信息及版本信息显示
 * @param params
 */
const equipmentInspectionGetEquipmentDeviceInfo = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentDeviceInfo",
        method: "post",
        data: params,
    });
};
/**
 * 获取设备巡检详情--录像及灾备状态
 * @param params
 */
const equipmentInspectionVideoRecordStatus = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/videoRecordStatus",
        method: "post",
        data: params,
    });
};
/**
 * 巡检详情--获取设备故障台账信息,分页获取
 * @param params
 */
const equipmentInspectionGetFaultRecordInfo = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/getFaultRecordInfo",
        method: "post",
        data: params,
    });
};

/**
 * 巡检详情--获取设备异常信息,分页获取
 * @param params
 */
const equipmentInspectionGetAnomalyRecordInfo = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/getAnomalyRecordInfo",
        method: "post",
        data: params,
    });
};

/**
 *巡检详情--获取设备升级信息显示
 * @param params
 */
const equipmentInspectionUpgradeInfo = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/upgradeInfo",
        method: "post",
        data: params,
    });
};

/**
 *巡检详情--根据设备、时间段 , 查询所有的巡检异常记录
 * @param params
 */
const equipmentInspectionGetInspectionRecordByDevice = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getInspectionRecordByDevice",
        method: "post",
        data: params,
    });
};
/**
 巡检详情--根据设备、时间段 , 查询所有的巡检异常记录---所有巡检故障信息
 * @param params
 */
const equipmentInspectionGetInspectionRecordByDeviceAllFault = function (
    params
) {
    return fetch({
        url: "/new/equipmentInspection/getInspectionRecordByDeviceAllFault",
        method: "post",
        data: params,
    });
};

/**
 获取各种报警数据的统计数据--巡检列表查询条件故障统计数据
 * @param params
 */
const equipmentInspectionGetAlarmCountsByOrg = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getAlarmCountsByOrg",
        method: "post",
        data: params,
    });
};

const hatcUserApiList = {
    getAnomalyStatistics,
    equipmentInspectionPage,
    equipmentInspectionSituation,
    equipmentInspectionDeviceOnlineRecord,
    equipmentInspectionReboot,
    equipmentInspectionFactoryReset,
    equipmentInspectionStorageStatus,
    equipmentInspectionStorageParam,
    equipmentInspectionFormatHdd,
    equipmentInspectionFormatLog,
    equipmentInspectionVideoInfo,
    equipmentInspectionNetworkInfo,
    newEquipmentInspectionDeviceOnlineInfo,
    equipmentInspectionLocationInfo,
    equipmentInspectionAlgInfo,
    equipmentInspectionDevicePlatformInfo,
    equipmentInspectionGetEquipmentDeviceInfo,
    equipmentInspectionVideoRecordStatus,
    equipmentInspectionGetFaultRecordInfo,
    equipmentInspectionGetAnomalyRecordInfo,
    equipmentInspectionUpgradeInfo,
    equipmentInspectionGetInspectionRecordByDevice,
    equipmentInspectionGetInspectionRecordByDeviceAllFault,
    equipmentInspectionGetAlarmCountsByOrg,
};

export default hatcUserApiList;
