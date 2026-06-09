import fetch from "@/utils/fetch";
import qs from "qs";

/**
 * 添加组织
 */
const addOrg = function (params) {
    return fetch({
        url: "/org/addOrg",
        method: "post",
        data: params,
    });
};

/**
 * 修改组织
 */
const updateOrg = function (params) {
    return fetch({
        url: "/org/updateOrg",
        method: "post",
        data: params,
    });
};
/**
 * 获取组织绑定用户
 */
const whetherOrgDistributeOtherUser = function (params) {
    return fetch({
        url: "/org/whetherOrgDistributeOtherUser",
        method: "post",
        data: params,
    });
};
/**
 * 删除组织
 */
const delOrg = function (params) {
    return fetch({
        url: "/org/delOrg",
        method: "post",
        data: params,
    });
};

/**
 * 修改车辆组织绑定关系
 */
const updateCarOrgRelation = function (params) {
    return fetch({
        url: "/hikDevice/changeDeviceOrg",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 查询设备详情
 */
const getDeviceInfo = function (params) {
    return fetch({
        url: "hikDevice/getDeviceInfoById",
        method: "post",
        data: params,
    });
};
/**
 * 设备升级查询分组树
 */
const getOrganizeTreeWithUpgradeData = function (params) {
    return fetch({
        url: "/upgradeTask/getOrganizeTreeWithUpgradeData",
        method: "post",
        data: params,
    });
};

/**
 * 设备配置分组树
 */
const getParamOrganizeTree = function (params) {
    return fetch({
        url: "/deviceParam/getParamOrganizeTree",
        method: "post",
        data: params,
    });
};

/**
 * 设备配置型号列表
 */
const getParamProductList = function (params) {
    return fetch({
        url: "/deviceParam/getProductList",
        method: "post",
        data: params,
    });
};

/**
 * 设备配置列表
 */
const getParamDevicePage = function (params) {
    return fetch({
        url: "/deviceParam/getParamDevicePage",
        method: "post",
        data: params,
    });
};

/**
 * 查询统计数据
 */
const getDevUpgradeLogData = function (params) {
    return fetch({
        url: "/upgradeTask/getDevUpgradeLogData",
        method: "post",
        data: params,
    });
};
/**
 * 导出统计数据
 */
const exportDevUpgradeLog = function (params) {
    return fetch({
        url: "/upgradeTask/exportDevUpgradeLog",
        method: "post",
        data: params,
    });
};
/**
 * 升级查看详情导出
 */
const exportDevUpgradeLogOneBatch = function (params) {
    return fetch({
        url: "/upgradeTask/exportDevUpgradeLogOneBatch",
        method: "post",
        data: params,
    });
};
/**
 * 设备重新升级
 */
const reUpgrade = function (params) {
    return fetch({
        url: "/upgrade/reUpgrade",
        method: "post",
        data: params,
    });
};

/**
 * 上传主机固件
 */
const upgradeAddFirmwareTemp = function (params) {
    return fetch({
        url: "/upgrade/addFirmwareTemp",
        method: "post",
        data: params,
    });
};
/**
 * 上传外设固件
 */
const upgradeAddPeripheralFirmwareTemp = function (params) {
    return fetch({
        url: "/upgrade/addPeripheralFirmwareTemp",
        method: "post",
        data: params,
    });
};

/**
 * 升级查看：升级数据产生变化则出现红点标识
 */
const getDevUpgradeLogModifyStatus = function (params) {
    return fetch({
        url: "/upgradeTask/getDevUpgradeLogModifyStatus",
        method: "post",
        data: params,
    });
};

/**
 * 配置查看：配置数据产生变化则出现红点标识
 */
const getDevConfigModifyStatus = function (params) {
    return fetch({
        url: "/deviceParamTask/getDevConfigModifyStatus",
        method: "post",
        data: params,
    });
};

/**
 * 根据组织id判断组织下的设备是否相同型号
 */
const checkOrgDeviceModelInfo = function (params) {
    return fetch({
        url: "/hikDevice/checkOrgDeviceModelInfo",
        method: "post",
        data: params,
    });
};

/**
 * 获取905协议外设名称
 */
const get905PeripheraNameList = function (params) {
    return fetch({
        url: "/upgrade/get905PeripheraNameList",
        method: "post",
        data: params,
    });
};
/**
 * 获取905/808协议外设名称
 */
const getDeviceType = function () {
    return fetch({
        url: "/upgrade/getDeviceType",
        method: "post",
    });
};
/**
 * 设备配置任务-按设备配置结果
 */
const getDeviceParamLogResultVoPage = function (params) {
    return fetch({
        url: "/deviceParamTask/getDeviceParamLogResultVoPage",
        method: "post",
        data: params,
    });
};
/**
 * 设备配置-我的配置任务
 */
const getParamBatchPage = function (params) {
    return fetch({
        url: "/deviceEHomeConfig/getParamBatchPage",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 设备配置任务-未完成配置
 */
const getConfigParamLatest = function (params) {
    return fetch({
        url: "/deviceEHomeConfig/getConfigParamLatest",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 设备配置-历史
 */
const getConfigParamHistory = function (params) {
    return fetch({
        url: "/deviceEHomeConfig/getConfigParamHistory",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 设备配置任务-按批次下发配置结果
 */
const getBatchParamLogResultVoPage = function (params) {
    return fetch({
        url: "/deviceParamTask/getBatchParamLogResultVoPage",
        method: "post",
        data: params,
    });
};

/**
 * 数据报表-车辆轨迹-按车辆
 */
const pageCarTrackCompleteness = function (params) {
    return fetch({
        url: "/report/pageCarTrackCompleteness",
        method: "post",
        data: params,
    });
};

/**
 * 数据报表-车辆轨迹-按组织
 */
const pageCarTrackCompletenessGroupByOrg = function (params) {
    return fetch({
        url: "/report/pageCarTrackCompletenessGroupByOrg",
        method: "post",
        data: params,
    });
};
/**
 * 数据报表-轨迹不完整率
 */
const incompletePage = function (params) {
    return fetch({
        url: "/report/incompletePage",
        method: "post",
        data: params,
    });
};
/**
 * 数据报表-车辆轨迹-导出-车辆
 */
const exportCarTrackCompleteness = function (params) {
    return fetch({
        url: "/report/exportCarTrackCompleteness",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 数据报表-车辆轨迹-导出-组织
 */
const exportCarTrackCompletenessGroupByOrg = function (params) {
    return fetch({
        url: "/report/exportCarTrackCompletenessGroupByOrg",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 报表-树
 */
const getReportOrgTree = function (params) {
    return fetch({
        url: "/report/getOrgTree",
        method: "post",
        data: params,
    });
};
/**
 * 报表-设备故障概览
 */
const getFaultView = function (params) {
    return fetch({
        url: "/report/faultOverview",
        method: "post",
        data: params,
    });
};
/**
 * 报表-设备健康状况
 */
const getDeviceHealthStatus = function (params) {
    return fetch({
        url: "/report/getDeviceHealthStatus",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 参数配置详情统计
 */
const getParamLogResultStatistics = function (params) {
    return fetch({
        url: "/deviceParamTask/getParamLogResultStatistics",
        method: "post",
        data: params,
    });
};

/**
 * 查询分组树(任务中使用)
 */
const getOrganizeTreeWithParamData = function (params) {
    return fetch({
        url: "/deviceParam/getOrganizeTreeWithParamData",
        method: "post",
        data: params,
    });
};
// 设备操作-设备管理-组织树
const getOrgTree = function (params) {
    return fetch({
        url: "/org/getOrgTree",
        method: "post",
        data: params,
    });
};
//设备自检列表
const getSelfCheckPage = function (params) {
    return fetch({
        url: "/selfcheck/page",
        method: "post",
        data: params,
    });
};
//设备自检列表 - 新
const getSelfCheckPageNew = function (params) {
    return fetch({
        url: "/selfcheck/newestPage",
        method: "post",
        data: params,
    });
};
//设备自检列表 - 新2
const selfcheckDeviceInfoList = function (params) {
    return fetch({
        url: "/selfcheck/deviceInfoList",
        method: "post",
        data: params,
    });
};
//司机插拔卡记录车辆列表
const driverCarList = function (params) {
    return fetch({
        url: "/driver/carList",
        method: "post",
        data: params,
    });
};

//司机插拔卡记录列表
const drivePage = function (params) {
    return fetch({
        url: "/driver/page",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
//司机插拔卡记录导出
const exportRecordDrive = function (params) {
    return fetch({
        url: "/driver/exportRecord",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
//设备自检详情
const getJsonById = function (params) {
    return fetch({
        url: "/selfcheck/getNewestDevParamsDetailById",
        method: "post",
        data: params,
    });
};
//设备自检历史详情
const getDevParamsDetailById = function (params) {
    return fetch({
        url: "/selfcheck/getDevParamsDetailById",
        method: "post",
        data: params,
    });
};
//设备自检字典
const getCnNames = function (params) {
    return fetch({
        url: "/selfcheck/getCnNames",
        method: "post",
        data: params,
    });
};
//设备操作-设备管理-组织树（含有parentName）
const deviceGetOrgTree = function (params) {
    return fetch({
        url: "/hikDevice/getOrgTree",
        method: "post",
        data: params,
    });
};
// 获取组织车辆
const getCarNode = function (params) {
    return fetch({
        url: "/org/getCarNode",
        method: "post",
        data: params,
    });
};
//故障管理-组织树
const getFaultManagementOrgTree = function (params) {
    return fetch({
        url: "/faultManagement/getOrgTree",
        method: "post",
        data: params,
    });
};
//获取故障类型统计数
const getFaultTypeCount = function (params) {
    return fetch({
        url: "/faultManagement/getFaultTypeCount",
        method: "post",
        data: params,
    });
};
//获取故障列表
const getFaultPage = function (params) {
    return fetch({
        url: "/faultManagement/getFaultPage",
        method: "post",
        data: params,
    });
};
//待处理故障类型选项
const getAllFaultType = function (params) {
    return fetch({
        url: "/faultManagement/getAllFaultType",
        method: "post",
        data: params,
    });
};
//待处理故障类型选项-新
const getAllSubscribeFaultType = function (params) {
    return fetch({
        url: "/faultManagement/getAllSubscribeFaultType",
        method: "post",
        data: params,
    });
};
//故障车辆位置-单车
const getFaultCarLocation = function (params) {
    return fetch({
        url: "/faultManagement/getFaultCarLocation",
        method: "post",
        data: params,
    });
};
/**
 * 故障车辆位置-地图多车
 * @param {*} params
 * @returns
 */
const getFaultCarLocationPage = function (params) {
    return fetch({
        url: "/faultManagement/getFaultCarLocationPage",
        method: "post",
        data: params,
    });
};
//待处理故障导出
const exportMaintainFault = function (params) {
    return fetch({
        url: "faultManagement/exportMaintainFault",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

//故障列表导出
const doExportFaultData = function (params) {
    return fetch({
        url: "/faultManagement/exportFaultData",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
//故障列表详情导出
const exportMaintainFaultDetail = function (params) {
    return fetch({
        url: "/faultManagement/exportMaintainFaultDetail",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
//获取故障详情
const getFaultDetail = function (params) {
    return fetch({
        url: "/faultManagement/getFaultDetail",
        method: "post",
        data: params,
    });
};
/**
 * 生成维护任务
 * @param {*} params
 * @returns
 */
const addMaintenanceRecord = function (params) {
    return fetch({
        url: "/faultManagement/addMaintenanceRecord",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
const newAddMaintenanceRecord = function (params) {
    return fetch({
        url: "/new/equipmentInspection/getEquipmentInspection/addMaintenanceRecord",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 维修记录上传文件要求
 * @param {*} params
 * @returns
 */
const requirementFiles = function (params) {
    return fetch({
        url: "/faultManagement/requirementFiles",
        method: "post",
        data: params,
    });
};
//获取故障明细列表
const getFaultDetailPage = function (params) {
    return fetch({
        url: "/faultDetail/page",
        method: "post",
        data: params,
    });
};
//故障明细导出
const exportFaultDetail = function (params) {
    return fetch({
        url: "/faultDetail/exportFaultDetail",
        method: "post",
        data: params,
    });
};
/**
 * TTS配置文本下发
 */
const saveTtsTextConfig = function (params) {
    return fetch({
        url: "/deviceFileConfig/saveTtsTextConfig",
        method: "post",
        data: params,
    });
};

/**
 * 查询车辆运行时长统计
 */
const pageCarOnlineTime = function (params) {
    return fetch({
        url: "/report/pageCarOnlineTime",
        method: "post",
        data: params,
    });
};

/**
 * 查询车辆运行时长统计(月)
 */
const pageCarOnlineTimeOnMonth = function (params) {
    return fetch({
        url: "/report/pageCarOnlineTimeOnMonth",
        method: "post",
        data: params,
    });
};

/**
 * 车辆上线率统计(按车辆查看)
 */
const pageCarOnlineGroupByCar = function (params) {
    return fetch({
        url: "/report/pageCarOnlineGroupByCar",
        method: "post",
        data: params,
    });
};

/**
 * 车辆上线率统计(按组织查看)
 */
const pageCarOnlineRate = function (params) {
    return fetch({
        url: "/report/pageCarOnlineRate",
        method: "post",
        data: params,
    });
};

/**
 * 车辆上线率统计(按组织查看)-导出
 */
const exportCarOnlineRate = function (params) {
    return fetch({
        url: "/report/exportCarOnlineRate",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 车辆上线率统计(按车辆查看)-导出
 */
const exportCarOnlineRateGroupByCar = function (params) {
    return fetch({
        url: "/report/exportCarOnlineRateGroupByCar",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 导出车辆在线运行时长统计-日
 */
const exportCarOnlineTime = function (params) {
    return fetch({
        url: "/report/exportCarOnlineTime",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 配置查看导出
 */
const exportDeviceParamLogResult = function (params) {
    return fetch({
        url: "/deviceParamTask/exportDeviceParamLogResult",
        method: "post",
        data: params,
    });
};
/**
 * 导出车辆在线运行时长统计-月
 */
const exportCarOnlineTimeOnMonth = function (params) {
    return fetch({
        url: "/report/exportCarOnlineTimeOnMonth",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 车辆长时间离线统计
 */
const getPageCarOfflineLongTime = function (params) {
    return fetch({
        url: "/report/pageCarOfflineLongTime",
        method: "post",
        data: params,
    });
};
/**
 * 车辆从未上线统计
 */
const getPageCarNeverOnline = function (params) {
    return fetch({
        url: "/report/pageCarNeverOnline",
        method: "post",
        data: params,
    });
};
/**
 * 车辆长时间离线导出
 */
const exportCarOfflineLongTime = function (params) {
    return fetch({
        url: "/report/exportCarOfflineLongTime",
        method: "post",
        data: params,
    });
};
/**
 * 车辆从未上线导出
 */
const exportCarNeverOnline = function (params) {
    return fetch({
        url: "/report/exportCarNeverOnline",
        method: "post",
        data: params,
    });
};
//数据合格率数据-按组织
const pageCarDataQualificationGroupByOrg = function (params) {
    return fetch({
        url: "/report/pageCarDataQualificationGroupByOrg",
        method: "post",
        data: params,
    });
};
//数据合格率数据-按车辆
const pageCarDataQualification = function (params) {
    return fetch({
        url: "/report/pageCarDataQualification",
        method: "post",
        data: params,
    });
};
//车辆下拉列表
const getCarList = function (params) {
    return fetch({
        url: "/report/carList",
        method: "post",
        data: params,
    });
};
//车辆下拉列表
const getVideoCarList = function (params) {
    return fetch({
        url: "/video/carList",
        method: "post",
        data: params,
    });
};
//车辆下拉模糊查询列表
const carDropDown = function (params) {
    return fetch({
        url: "/carManage/carDropDown",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
//轨迹漂移率按车辆导出
const exportCarDriftData = function (params) {
    return fetch({
        url: "/report/exportCarDriftData",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
//轨迹漂移率按组织导出
const exportCarDriftDataGroupByOrg = function (params) {
    return fetch({
        url: "/report/exportCarDriftDataGroupByOrg",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
//数据合格率按组织导出、
const exportCarDataQualificationGroupByOrg = function (params) {
    return fetch({
        url: "/report/exportCarDataQualificationGroupByOrg",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
//数据合格率按车辆导出、
const exportCarDataQualification = function (params) {
    return fetch({
        url: "/report/exportCarDataQualification",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
//漂移率统计分页查询-按组织
const pageCarDriftDataGroupByOrg = function (params) {
    return fetch({
        url: "/report/pageCarDriftDataGroupByOrg",
        method: "post",
        data: params,
    });
};
//漂移率统计分页查询-按车辆
const pageCarDriftData = function (params) {
    return fetch({
        url: "/report/pageCarDriftData",
        method: "post",
        data: params,
    });
};
//
//漂移明细查询
const pageCarDriftDetails = function (params) {
    return fetch({
        url: "/report/pageCarDriftDetails",
        method: "post",
        data: params,
    });
};
//轨迹漂移明细导出
const exportCarDriftDetails = function (params) {
    return fetch({
        url: "/report/exportCarDriftDetails",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
////漂移定位查询
const getPosition = function (params) {
    return fetch({
        url: "/report/getPosition",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 首页-设备概览
 */
const getDeviceStatusStatistics = function (params) {
    return fetch({
        url: "/homepage/getDeviceStatusStatistics",
        method: "post",
        data: params,
    });
};
//获取当前用户的平台使用期限
const getValidateOverdue = function (params) {
    return fetch({
        url: "/login/validateOverdue",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 首页-获取首页配置
 */
const getHomeSettings = function (params) {
    return fetch({
        url: "/home/getHomeSettings",
        method: "post",
        data: params,
    });
};
/**
 * 首页-保存首页配置
 */
const saveHomeSettings = function (params) {
    return fetch({
        url: "/home/saveHomeSettings",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 首页-车辆上线数统计
 */
const getCarUpLineNum = function (params) {
    return fetch({
        url: "/homepage/getCurrentCarUpLineNum",
        method: "post",
        data: params,
    });
};

/**
 * 首页-待处理故障数
 */
const getWaitingHandleNum = function (params) {
    return fetch({
        url: "/homepage/getUnresolvedFaultNum",
        method: "post",
        data: params,
    });
};

/**
 * 首页-车辆上线率趋势
 */
const carOnlineRateTrend = function (params) {
    return fetch({
        url: "/homepage/carOnlineRateTrend",
        method: "post",
        data: params,
    });
};
/**
 * 首页-车辆长时间离线黑榜
 */
const carOfflineLongTimeBlackList = function (params) {
    return fetch({
        url: "/homepage/carOfflineLongTimeBlackList",
        method: "post",
        data: params,
    });
};
/**
 * 首页-故障数趋势
 */
const faultNumTrend = function (params) {
    return fetch({
        url: "/homepage/faultNumTrend",
        method: "post",
        data: params,
    });
};

/**
 * 首页-设备故障数黑榜
 */
const deviceFaulteBlackList = function (params) {
    return fetch({
        url: "/homepage/deviceFaultNumBlackList",
        method: "post",
        data: params,
    });
};
/**
 * 首页-运行时长趋势
 */
const carOnlineTimeTrend = function (params) {
    return fetch({
        url: "/homepage/carOnlineTimeTrend",
        method: "post",
        data: params,
    });
};
/**
 * 首页-运行时长黑榜
 */
const carOnlineTimeBlackList = function (params) {
    return fetch({
        url: "/homepage/carOnlineTimeBlackList",
        method: "post",
        data: params,
    });
};
/**
 * 首页-车辆轨迹完整率趋势
 */
const carTrackCompletenessTrend = function (params) {
    return fetch({
        url: "/homepage/carTrackCompletenessTrend",
        method: "post",
        data: params,
    });
};
/**
 * 首页-车辆轨迹完整率黑榜
 */
const carTrackCompletenessBlackList = function (params) {
    return fetch({
        url: "/homepage/carTrackCompletenessBlackList",
        method: "post",
        data: params,
    });
};
/**
 * 首页-升级配置
 * 设备升级成功率
 */
const getUpgradeStatistics = function () {
    return fetch({
        url: "/homepage/getUpgradeStatistics",
        method: "post",
    });
};
/**
 * 首页-升级配置
 * 设备版本升级成功率
 */
const getUpgradeStatisticsOnVersion = function () {
    return fetch({
        url: "/homepage/getUpgradeStatisticsOnVersion",
        method: "post",
    });
};
/**
 * 首页-升级任务
 */
const getUpdateData = function (params) {
    return fetch({
        url: "/homepage/recentOrgUpgrade",
        method: "post",
        data: params,
    });
};
/**
 * 首页-配置任务
 */
const getSettingData = function (params) {
    return fetch({
        url: "/homepage/recentOrgConfig",
        method: "post",
        data: params,
    });
};

/**
 * 首页-待处理故障列表
 */
const getFaultList = function (params) {
    return fetch({
        url: "/homepage/unresolvedDeviceFault",
        method: "post",
        data: params,
    });
};

/**
 * 文件配置---从设备获取BIN文件
 */
const getBinFileFromDevice = function (params) {
    return fetch({
        url: "/deviceFileConfig/getBinFileFromDevice",
        method: "post",
        data: params,
    });
};
/**
 * 文件配置---获取最新文件配置
 */
const getCurrentDeviceBinFile = function (params) {
    return fetch({
        url: "/deviceFileConfig/getCurrentDeviceBinFile",
        method: "post",
        data: params,
    });
};
/**
 * 文件配置---获取设备最新BIN文件信息和URL
 */
const getDeviceBinFile = function (params) {
    return fetch({
        url: "/deviceFileConfig/getDeviceBinFile",
        method: "post",
        data: params,
    });
};

/**
 * 设备型号
 */
const getProductListByOrgId = function (params) {
    return fetch({
        // url: "hikDevice/getProductListByOrgId",
        url: "/hikDevice/getDeviceModelCodeList",
        method: "post",
        data: params,
    });
};
/**
 * 获取dsubAkList
 */

const getProductListByDSubAK = function (params) {
    return fetch({
        // url: "hikDevice/getProductListByDSubAK",
        url: "/hikDevice/getDeviceModelCodeList",
        method: "post",
        data: params,
    });
};
/**
 *
 * 配置模板
 */
const getParamBatchTemplateList = function (params) {
    return fetch({
        url: "/deviceEHomeConfig/getParamBatchTemplateList",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 设备序列号/设备手机号
 */
const getDeviceDropDown = function (params) {
    return fetch({
        url: "/carManage/deviceDropDown",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 文件配置---控件版本比对
 */
const comparePluginVersion = function (params) {
    return fetch({
        url: "/deviceFileConfig/comparePluginVersion",
        method: "post",
        data: params,
    });
};

/**
 * 文件配置---获取待下载的BIN文件URL
 */
const getBinFileDownloadUrl = function (params) {
    return fetch({
        url: "/deviceFileConfig/getBinFileDownloadUrl",
        method: "post",
        data: params,
    });
};

/**
 * 文件配置---获取控件URL
 */
const getBinFileConfigDownloadUrl = function (params) {
    return fetch({
        url: "/deviceFileConfig/getConfigCtrlPlugin",
        method: "post",
        data: params,
    });
};

/**
 * 文件配置---获取待下发的BIN文件信息和URL
 */
const getBinFileConfigUploadUrl = function (params) {
    return fetch({
        url: "/deviceFileConfig/getBinUploadUrl",
        method: "post",
        data: params,
    });
};
/**
 * 文件配置---获取待下发的批量BIN文件信息和URL
 */
const getBatchBinUploadUrl = function (params) {
    return fetch({
        url: "/deviceFileConfig/getBatchBinUploadUrl",
        method: "post",
        data: params,
    });
};
/**
 * 文件配置---下发BIN文件至设备
 */
const saveBinFileToDevice = function (params) {
    return fetch({
        url: "/deviceFileConfig/saveBinFileToDevice",
        method: "post",
        data: params,
    });
};

/**
 * 文件配置---根据ID获取设备信息
 */
const filegetParamDeviceById = function (params) {
    return fetch({
        url: "/deviceParam/getParamDeviceById",
        method: "post",
        data: params,
    });
};

/**
 * 设备配置列表---根据ID获取设备信息
 */
const getParamDeviceByPageId = function (params) {
    return fetch({
        url: "/deviceParam/getParamDeviceByPageId",
        method: "post",
        data: params,
    });
};
/**
 * 协议配置---获取设备所有配置参数
 */
const getDeviceConfigParams = function (params) {
    return fetch({
        url: "/deviceParamConfig/getDeviceConfigParams",
        method: "post",
        data: params,
    });
};

/**
 * 协议配置---获取设备所有配置参数
 */
const getDeviceConfigParamsByIsApi = function (params) {
    return fetch({
        url: "/deviceParamConfig/getDeviceConfigParamsByIsApi",
        method: "post",
        data: params,
        timeout: 300000,
    });
};
/**
 * 协议配置---控车协议解码
 */
const checkZtControlPwd = function (params) {
    return fetch({
        url: "/deviceParamConfig/checkZtControlPwd",
        method: "post",
        data: params,
    });
};
/**
 * 协议配置---BSD获取预览URL
 */
const previewPlay = function (params) {
    return fetch({
        url: "/hikDevice/preview/play",
        method: "post",
        data: params,
    });
};
/**
 * 协议配置---下发配置参数至设备
 */
const saveDeviceConfigParamsToDevice = function (params) {
    return fetch({
        url: "/deviceParamConfig/saveDeviceConfigParamsToDevice",
        method: "post",
        data: params,
    });
};

/**
 * 非接入方式日志开关
 */
const updateDeviceLogSwitch = function (params) {
    return fetch({
        url: "/deviceConfig/updateDeviceLogSwitch",
        method: "post",
        data: params,
    });
};

/**
 * 状态监控-异常类型
 */
const getExceptionType = function (params) {
    return fetch({
        url: "/equipmentInspection/getAbnormalState",
        method: "post",
        data: params,
    });
};

/**
 * 状态监控-待处理故障表格获取
 */
const getMaintainFaultPage = function (params) {
    return fetch({
        url: "/faultManagement/getMaintainFaultPage",
        method: "post",
        data: params,
    });
};

/**
 * HTTP终端参数查询---获取设备的HTTP配置参数
 */
const getHttpDeviceConfigParams = function (params) {
    return fetch({
        url: "/deviceHttpConfig/getHttpDeviceConfigParams",
        method: "post",
        data: params,
    });
};

/**
 * HTTP终端参数查询---通知设备以HTTP形式上报配置参数
 */
const syncHttpDeviceConfigParams = function (params) {
    return fetch({
        url: "/deviceHttpConfig/syncHttpDeviceConfigParams",
        method: "post",
        data: params,
    });
};

/**
 * 模板配置---模板查询
 */
const hikDevParamTempPage = function (params) {
    return fetch({
        url: "/hikDevParamTemp/page",
        method: "post",
        data: params,
    });
};
/**
 * 模板配置---模板删除
 */
const hikDevParamTempDelete = function (params) {
    return fetch({
        url: "/hikDevParamTemp/delete",
        method: "post",
        data: params,
    });
};
/**
 * 模板配置--查询车辆
 */
const hikDevParamTempCarList = function (params) {
    return fetch({
        url: "/hikDevParamTemp/carList",
        method: "post",
        data: params,
    });
};
/**
 * 模板配置-设备强制应用模板
 */
const forceApply = function (params) {
    return fetch({
        url: "/hikDevParamTemp/forceApply",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 模板配置---添加模板
 */
const hikDevParamTempAdd = function (params) {
    return fetch({
        url: "/hikDevParamTemp/add",
        method: "post",
        data: params,
    });
};
/**
 * 唤醒设备
 */
const awakenDevice = function (params) {
    return fetch({
        url: "deviceFileConfig/awakenDevice",
        method: "post",
        data: params,
    });
};
/**
 * 获取粤标用户标志
 */
const getGuangdongUserSing = function (params) {
    return fetch({
        url: "deviceFileConfig/getGuangdongUserSing",
        method: "post",
        data: params,
    });
};
/**
 * 从设备获取配置文件
 */
const getConfigFileFromDevice = function (params) {
    return fetch({
        url: "/deviceFileConfig/getConfigFileFromDevice",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 页面保活
 */
const refreshSession = function (data) {
    return fetch({
        url: "/upgrade/refreshSession",
        method: "post",
    });
};
/**
 * 查询设备是否支持私有协议
 */
const getDeviceConfigParamWay = function (params) {
    return fetch({
        url: "/deviceEHomeConfig/getDeviceConfigParamWay",
        method: "post",
        data: params,
        timeout: 300000,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 私有协议---查询参数
 */
const getEHomeConfig = function (data) {
    return fetch({
        url: "/deviceEHomeConfig/getEHomeConfig",
        method: "post",
        data: data,
        timeout: 300000,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 私有协议下发
 */
const saveEHomeConfig = function (data) {
    return fetch({
        url: "/deviceEHomeConfig/saveEHomeConfig",
        method: "post",
        data: data,
        timeout: 300000,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 私有协议获取设备的全部能力集
 */
const getDeviceEHomeCapacity = function (data) {
    return fetch({
        url: "/deviceEHomeConfig/getDeviceEHomeCapacity",
        method: "post",
        data: data,
        timeout: 300000,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 手动触发参数镜像更新
 */
const touchImageTask = function (data) {
    return fetch({
        url: "/deviceEHomeConfig/touchImageTask",
        method: "post",
        data: data,
        timeout: 300000,
    });
};
/**
 * 配置任务---终止配置任务
 */
const stopDeviceConfigTask = function (params) {
    return fetch({
        url: "/deviceParamTask/stopDeviceConfigTask",
        method: "post",
        data: params,
    });
};

/**
 * 配置任务---重新配置任务
 */
const saveDeviceConfigParamsToDeviceAgain = function (params) {
    return fetch({
        url: "/deviceParamTask/saveDeviceConfigParamsToDeviceAgain",
        method: "post",
        data: params,
    });
};

/**
 * 模板配置---根据模板下发配置至设备
 */
const sendDeviceSetParamByTemplate = function (params) {
    return fetch({
        url: "/deviceParamConfig/sendDeviceSetParamByTemplate",
        method: "post",
        data: params,
    });
};

/**
 * 模板配置---根据模板ID获取模板信息
 */
const tempQueryById = function (params) {
    return fetch({
        url: "/hikDevParamTemp/queryById",
        method: "post",
        data: params,
    });
};

/**
 * 模板配置---编辑模板
 */
const hikDevParamTempUpdate = function (params) {
    return fetch({
        url: "/hikDevParamTemp/update",
        method: "post",
        data: params,
    });
};

/**
 * 升级-导出
 */
const exportDeviceUpgradeList = function (params) {
    return fetch({
        url: "/upgrade/exportDeviceUpgradeList",
        method: "post",
        data: params,
    });
};
const newUpgradeExportDeviceUpgradeList = function (params) {
    return fetch({
        url: "/new/upgrade/exportDeviceUpgradeList",
        method: "post",
        data: params,
    });
};

const newUpgradeExportUpgradeTask = function (params) {
    return fetch({
        url: "/new/upgrade/exportUpgradeTask",
        method: "post",
        data: params,
    });
};
const newUpgradeExportUpgradeNotCompleted = function (params) {
    return fetch({
        url: "/new/upgrade/exportUpgradeNotCompleted",
        method: "post",
        data: params,
    });
};
/**
 * 设备配置-导出
 */
const exportParamDeviceList = function (params) {
    return fetch({
        url: "/deviceParam/exportParamDevice",
        method: "post",
        data: params,
        timeout: 900000,
    });
};
/**
 * 状态监控-详情
 */
const reboot = function (params) {
    return fetch({
        url: "/deviceControl/system/reboot",
        method: "post",
        data: params,
    });
};
/**
 *
 * @param {*} params
 * @returns
 * 状态监控-自定义列显示保存
 */
const saveUserVisibleColumn = function (params) {
    return fetch({
        url:
            "/common/saveUserVisibleColumn?" +
            qs.stringify(params, { arrayFormat: "repeat" }),
        method: "get",
    });
};
/**
 *
 * @param {*} params
 * @returns
 * 状态监控-自定义列显示获取
 */
const getUserVisibleColumn = function (params) {
    return fetch({
        url:
            "/common/getUserVisibleColumn?" +
            qs.stringify(params, { arrayFormat: "repeat" }),
        method: "get",
    });
};
/**
 * 状态监控-详情-简单恢复出厂设置
 */
const factoryReset = function (params) {
    return fetch({
        url: "/deviceControl/system/factoryReset",
        method: "post",
        data: params,
    });
};

/**
 * 状态监控-详情-查询存储介质信息
 */
const contentMgmtStorage = function (params) {
    return fetch({
        url: "/deviceControl/ContentMgmt/Storage",
        method: "post",
        data: params,
    });
};

/**
 * 状态监控-详情-查询格式化
 */
const contentMgmtStorageFormat = function (params) {
    return fetch({
        url: "/deviceControl/ContentMgmt/Storage/hdd/Format",
        method: "post",
        data: params,
    });
};

/**
 * 协议配置---获取车辆车牌类型
 */
const getVehiclePlateType = function (params) {
    return fetch({
        url: "/deviceParamConfig/getVehiclePlateType",
        method: "post",
        data: params,
    });
};

/**
 * 状态监控-详情-设备详细信息
 */
const systemDeviceInfo = function (params) {
    return fetch({
        url: "/deviceControl/system/deviceInfo",
        method: "post",
        data: params,
    });
};

/**
 * 查询定位状态信息
 */
const systemLocationStatus = function (params) {
    return fetch({
        url: "/deviceControl/System/LocationStatus",
        method: "post",
        data: params,
    });
};
/**
 * 查询最新巡检记录
 */
const getInspection = function (params) {
    return fetch({
        url: "/deviceControl/system/inspection",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 查询视频信息和上下线信息(原)
 * 查询录像状态（现）
 */
const systemVideoInfo = function (params) {
    return fetch({
        url: "/deviceControl/System/VideoInfo",
        method: "post",
        data: params,
    });
};
/**
 * 获取自定义扩展信息接口
 */
const customExpandInfo = function (params) {
    return fetch({
        url: "/deviceControl/System/CustomExpandInfo",
        method: "post",
        data: params,
    });
};
/**
 * 获取设备信息及其他
 */
const deviceManage = function (params) {
    return fetch({
        url: "/deviceControl/system/deviceInfoV2",
        method: "post",
        data: params,
    });
};
/**
 * 状态监控-故障类型-详情-当前故障类型
 */
const getCurrentFaultType = function (plateNum) {
    return fetch({
        url: "/faultManagement/getFaultTypeList ",
        method: "post",
        data: {
            plateNum,
        },
    });
};

/**
 * 状态监控-故障类型-详情-当前设备序列号
 */
const getCurrentEquipmentSerialNumber = function (plateNum) {
    return fetch({
        url: "/faultManagement/getDeviceCodeByPlateNum ",
        method: "post",
        data: {
            plateNum,
        },
    });
};

/**
 * 数据报表-设备健康状态统计-echarts状态分布图(故障项分布)
 */
const getFaultTypeStatistics = function (params) {
    return fetch({
        url: "/report/faultTypeStatistics",
        method: "post",
        data: params,
    });
};
/**
 * 数据报表-设备健康状态统计-故障类型分布
 */
const faultGroupStatistics = function (params) {
    return fetch({
        url: "/report/faultGroupStatistics",
        method: "post",
        data: params,
    });
};
/**
 * 数据报表-设备健康状态统计-完好率趋势
 */
const deviceIntactRateTrend = function (params) {
    return fetch({
        url: "/report/deviceIntactRateTrend",
        method: "post",
        data: params,
    });
};
/**
 * 数据报表-设备健康状态统计-设备故障黑榜
 */
const getDeviceFaultNumBlackList = function (params) {
    return fetch({
        url: "/report/deviceFaultNumBlackList",
        method: "post",
        data: params,
    });
};
/**
 * 数据报表-维修记录-维护人员
 */
const faultMaintenanceUserList = function (params) {
    return fetch({
        url: "/faultMaintenance/userList",
        method: "post",
        data: params,
    });
};
/**
 * 数据报表-维修记录-维护人员
 */
const faultMaintenancePage = function (params) {
    return fetch({
        url: "/faultMaintenance/page",
        method: "post",
        data: params,
    });
};
/**
 * 数据报表-维修记录-终止维护
 */
const faultMaintenanceTerminal = function (params) {
    return fetch({
        url: "/faultMaintenance/terminal",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 数据报表-维修记录-详情查看
 */
const faultMaintenanceGetDetails = function (params) {
    return fetch({
        url: "/faultMaintenance/getDetails",
        method: "post",
        data: params,
        // headers: {
        //   "Content-Type": "application/json",
        // },
    });
};

/**
 * 查询格式化记录
 */
const formatLog = function (params) {
    return fetch({
        url: "/deviceControl/ehome/hdd/format/log",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 私有协议格式化方式--获得设备是否支持私有协议格式化能力
 */
const formatCapacity = function (params) {
    return fetch({
        url: "/deviceControl/system/ehome/formatCapacity",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 私有协议格式化方式--获取当前存储模式参数
 */
const ehomeStorage = function (params) {
    return fetch({
        url: "/deviceControl/ehome/storage",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 私有协议格式化方式--配置格式化单个硬盘
 */
const hddFormat = function (params) {
    return fetch({
        url: "/deviceControl/ehome/hdd/format",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 首页-入网率统计信息
 */
const getCarNetworkAccessInfo = function (params) {
    return fetch({
        url: "/homepage/getCarNetworkAccessInfo",
        method: "post",
        data: params,
    });
};
/**
 * 首页-平台版本
 */
const getVersion = function (params) {
    return fetch({
        url: "/common/version",
        method: "post",
        data: params,
    });
};
/**
 * 首页-平台版本
 */
const operationModelList = function (params) {
    return fetch({
        url: "/logs/operationModelList",
        method: "post",
        data: params,
    });
};
/**
 * 显示CQMS 按钮
 */
const getCqmsIcon = function (params) {
    return fetch({
        url: "/common/getCqmsIcon",
        method: "post",
        data: params,
    });
};
/**
 * 获取访问链接
 */
const getCqmsUrl = function (params) {
    return fetch({
        url: "/common/getCqmsUrl",
        method: "post",
        data: params,
    });
};
/**
 * 巡检详情--设备信息显示
 */
const equipmentInspectionDeviceInfo = function (params) {
    return fetch({
        url: "/equipmentInspection/getEquipmentDeviceInfo",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 *巡检详情--各平台连接状态显示
 */
const equipmentInspectionDevicePlatformInfo = function (params) {
    return fetch({
        url: "/equipmentInspection/devicePlatformInfo",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 巡检详情--设备上下线记录
 */
const equipmentInspectionDeviceOnlineInfo = function (params) {
    return fetch({
        url: "/equipmentInspection/deviceOnlineInfo",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 巡检详情--设备上下线记录
 */
const getRemoteDevWebUrl = function (params) {
    return fetch({
        url: "/remoteDevWeb/getRemoteDevWebUrl",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
const treeApiList = {
    getRemoteDevWebUrl,
    equipmentInspectionDeviceInfo,
    equipmentInspectionDevicePlatformInfo,
    equipmentInspectionDeviceOnlineInfo,
    getCurrentFaultType,
    getCurrentEquipmentSerialNumber,
    addOrg,
    updateOrg,
    delOrg,
    whetherOrgDistributeOtherUser,
    updateCarOrgRelation,
    getOrganizeTreeWithUpgradeData,
    getParamOrganizeTree,
    getParamProductList,
    getParamDevicePage,
    getDevUpgradeLogData,
    getFaultTypeStatistics,
    getDeviceFaultNumBlackList,
    reUpgrade,
    upgradeAddFirmwareTemp,
    upgradeAddPeripheralFirmwareTemp,
    getDevUpgradeLogModifyStatus,
    getDevConfigModifyStatus,
    checkOrgDeviceModelInfo,
    get905PeripheraNameList,
    getDeviceType,
    getDeviceParamLogResultVoPage,
    getParamBatchPage, //我的配置任务
    getConfigParamLatest, //未完成配置
    getConfigParamHistory, //历史
    getBatchParamLogResultVoPage,
    pageCarTrackCompleteness,
    pageCarTrackCompletenessGroupByOrg,
    incompletePage,
    exportCarTrackCompleteness,
    exportCarTrackCompletenessGroupByOrg,
    getReportOrgTree,
    getParamLogResultStatistics,
    getOrganizeTreeWithParamData,
    saveTtsTextConfig,
    pageCarOnlineTime,
    pageCarOnlineTimeOnMonth,
    exportCarOnlineRate,
    exportCarOnlineRateGroupByCar,
    pageCarOnlineRate,
    pageCarOnlineGroupByCar,
    exportCarOnlineTime,
    exportDeviceParamLogResult,
    exportCarOnlineTimeOnMonth,
    getDeviceStatusStatistics,
    getCarUpLineNum,
    carOnlineRateTrend,
    carOfflineLongTimeBlackList,
    carOnlineTimeTrend,
    carOnlineTimeBlackList,
    carTrackCompletenessTrend,
    carTrackCompletenessBlackList,
    getBinFileFromDevice,
    getCurrentDeviceBinFile,
    getDeviceBinFile,
    getProductListByOrgId,
    getProductListByDSubAK,
    getParamBatchTemplateList, //配置模板
    getDeviceDropDown,
    comparePluginVersion,
    getBinFileDownloadUrl,
    getBatchBinUploadUrl,
    getBinFileConfigDownloadUrl,
    getBinFileConfigUploadUrl,
    saveBinFileToDevice,
    filegetParamDeviceById,
    getDeviceConfigParams,
    getParamDeviceByPageId,
    saveDeviceConfigParamsToDevice,
    updateDeviceLogSwitch,
    getHttpDeviceConfigParams,
    syncHttpDeviceConfigParams,
    hikDevParamTempPage,
    hikDevParamTempDelete,
    hikDevParamTempCarList,
    forceApply,
    hikDevParamTempAdd,
    awakenDevice,
    getGuangdongUserSing,
    getConfigFileFromDevice,
    stopDeviceConfigTask,
    getEHomeConfig,
    getDeviceConfigParamWay,
    saveEHomeConfig,
    getDeviceEHomeCapacity,
    touchImageTask,
    saveDeviceConfigParamsToDeviceAgain,
    sendDeviceSetParamByTemplate,
    tempQueryById,
    hikDevParamTempUpdate,
    exportDeviceUpgradeList,
    newUpgradeExportDeviceUpgradeList,
    newUpgradeExportUpgradeTask,
    newUpgradeExportUpgradeNotCompleted,
    exportParamDeviceList,
    reboot,
    saveUserVisibleColumn,
    getUserVisibleColumn,
    factoryReset,
    getDeviceConfigParamsByIsApi,
    checkZtControlPwd,
    previewPlay,
    contentMgmtStorage,
    contentMgmtStorageFormat,
    getVehiclePlateType,
    systemDeviceInfo,
    systemLocationStatus,
    getInspection,
    systemVideoInfo,
    customExpandInfo,
    deviceManage,
    getOrgTree,
    getSelfCheckPage,
    getSelfCheckPageNew,
    selfcheckDeviceInfoList,
    driverCarList,
    drivePage,
    exportRecordDrive,
    getJsonById,
    getDevParamsDetailById,
    getCnNames,
    deviceGetOrgTree,
    getCarNode,
    refreshSession,
    getDeviceConfigParamWay,
    getDeviceInfo,
    exportDevUpgradeLog,
    exportDevUpgradeLogOneBatch,
    getPageCarOfflineLongTime,
    getPageCarNeverOnline,
    exportCarOfflineLongTime,
    exportCarNeverOnline,
    getCarList,
    getVideoCarList,
    carDropDown, //下拉模糊查询车牌
    pageCarDataQualificationGroupByOrg,
    pageCarDataQualification,
    exportCarDataQualificationGroupByOrg,
    exportCarDataQualification,
    exportCarDriftData,
    exportCarDriftDataGroupByOrg,
    pageCarDriftDataGroupByOrg,
    pageCarDriftData,
    pageCarDriftDetails,
    exportCarDriftDetails,
    getPosition,
    getFaultManagementOrgTree,
    getFaultTypeCount,
    getFaultPage,
    getWaitingHandleNum,
    getUpdateData,
    getUpgradeStatistics,
    getUpgradeStatisticsOnVersion,
    getSettingData,
    getFaultList,
    deviceFaulteBlackList,
    faultNumTrend,
    getFaultDetail,
    getDeviceHealthStatus,
    getFaultView,
    getExceptionType,
    getHomeSettings,
    getValidateOverdue,
    saveHomeSettings,
    doExportFaultData,
    getMaintainFaultPage,
    getAllFaultType,
    getAllSubscribeFaultType,
    exportMaintainFault,
    exportMaintainFaultDetail,
    getFaultCarLocation,
    getFaultCarLocationPage,
    addMaintenanceRecord,
    newAddMaintenanceRecord,
    requirementFiles,
    getFaultDetailPage,
    exportFaultDetail,
    faultGroupStatistics,
    deviceIntactRateTrend,
    faultMaintenanceUserList,
    faultMaintenancePage,
    faultMaintenanceTerminal,
    faultMaintenanceGetDetails,
    formatLog,
    formatCapacity,
    ehomeStorage,
    hddFormat,
    getCarNetworkAccessInfo,
    getVersion,
    operationModelList,
    getCqmsIcon,
    getCqmsUrl,
};

export default treeApiList;
