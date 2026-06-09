/**
 * Created by 黎芳琪 on 2018/1/12.
 */
import fetch from "@/utils/fetch";

/**
 * 获取列表
 * @param params
 */
const getDeviceManagerPage = function (params) {
    return fetch({
        url: "/hikDevice/page",
        method: "post",
        data: params,
    });
};
/**
 * 获取带升级信息的设备列表
 * @param params
 */
const getDeviceManagerUpgradeDevicePage = function (params) {
    return fetch({
        url: "/hikDevice/upgradeDevicePage",
        method: "post",
        data: params,
    });
};
/**
 * 获取设备详情
 * @param params
 */
const getBindCarLog = function (params) {
    return fetch({
        url: "/hikDevice/getBindCarLog",
        method: "post",
        data: params,
    });
};
/**
 * 获取车辆变更记录
 * @param params
 */
const getBindDeviceLog = function (params) {
    return fetch({
        url: "/carManage/getBindDeviceLog",
        method: "post",
        data: params,
    });
};
/**
 * 导出设备
 * @param deviceInfoDto
 */
const doExportDevice = function (deviceInfoDto) {
    return fetch({
        url: "/hikDevice/exportDeviceList",
        method: "post",
        data: deviceInfoDto,
    });
};
/**
 * 开启/关闭自动升级
 * @param params
 */
const updateAutogradeStatus = function (params) {
    return fetch({
        url: "/hikDevice/updateAutogradeStatus",
        method: "post",
        data: params,
    });
};
/**
 * 开启/关闭自动升级
 * @param params
 */
const updateDevicegradeStatus = function (params) {
    return fetch({
        url: "/hikDevice/updateDevicegradeStatus",
        method: "post",
        data: params,
    });
};
/**
 * 冻结/解冻设备
 * @param params
 */
const updateDeviceUseStatus = function (params) {
    return fetch({
        url: "/hikDevice/updateDeviceUseStatus",
        method: "post",
        data: params,
    });
};
/**
 * 重置设备信息获取状态
 * @param params
 */
const updateGetconfigStatus = function (params) {
    return fetch({
        url: "/hikDevice/updateGetconfigStatus",
        method: "post",
        data: params,
    });
};

/**
 * 开始升级-接入设备升级
 * @param deviceUpgradeDto
 */
const startUpgrade = function (deviceUpgradeDto) {
    return fetch({
        url: "/hikDevice/startUpgrade",
        method: "post",
        data: deviceUpgradeDto,
    });
};

/**
 * 开始升级-非接入设备升级
 * @param deviceUpgradeDto
 */
const startUpgradeNoAccessDev = function (deviceUpgradeDto) {
    return fetch({
        url: "/hikDevice/startUpgradeNoAccessDev",
        method: "post",
        data: deviceUpgradeDto,
    });
};

/**
 * 重新升级
 */
const reUpgrade = function (deviceUpgradeDto) {
    return fetch({
        url: "/hikDevice/reUpgrade",
        method: "post",
        data: deviceUpgradeDto,
    });
};

/**
 * 终止下发
 */
const stopUpgrade = function (params) {
    return fetch({
        url: "/hikDevice/stopUpgrade",
        method: "post",
        data: params,
    });
};

/**
 * 获取升级结果
 */
const getDevUpgradeResult = function (devUpgradeResultDto) {
    return fetch({
        url: "/hikDevice/getDevUpgradeResult",
        method: "post",
        data: devUpgradeResultDto,
    });
};

/**
 * 获取型号下拉框
 */
const getProductList = function () {
    return fetch({
        // url : 'hikDevice/getProductList',
        url: "/hikDevice/getDeviceModelCodeList",
        method: "post",
        data: {},
    });
};
/**
 * 获取设备导入模板
 */
const getDeviceTemplate = function (data) {
    return fetch({
        url: "/hikDevice/createTemplate",
        method: "post",
        data: { templateCode: "deviceInfo", ...data },
    });
};

/**
 * 删除设备
 * @param ids
 */
const deleteDevice = function (params) {
    return fetch({
        url: "/hikDevice/deleteDevice",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 冻结/解冻设备
 * @param params
 */
const updateHeartbeatBatch = function (params) {
    return fetch({
        url: "/hikDevice/updateDeviceHearbeat",
        method: "post",
        data: params,
    });
};
/**
 * 添加设备
 * @param params
 */
const addDeviceInfo = function (params) {
    return fetch({
        url: "/hikDevice/addDeviceInfo",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 编辑设备
 * @param params
 */
const editDeviceInfo = function (params) {
    return fetch({
        url: "/hikDevice/editDeviceInfo",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 查询最新的10个临时固件信息
 *
 * @param params
 */
const getLatestTempFirmwaresByProductKey = function (productKey) {
    return fetch({
        url: "/firmwareHdc2/getLatestTempFirmwaresByProductKey",
        method: "post",
        data: { productKey: productKey },
    });
};

//获取项目-分组二级树结构
const getGroupTreeHik = function () {
    return fetch({
        url: "hikDevice/getHikGroupTree",
        method: "post",
        data: {},
    });
};
const getGroupTreeHikVithCount = function () {
    return fetch({
        url: "equipmentInspection/getHikGroupTreeWithAlarmCount",
        method: "post",
        data: {},
    });
};
const getAlarmCounts = function () {
    return fetch({
        url: "equipmentInspection/getAlarmCounts",
        method: "post",
        data: {},
    });
};

//获取项目-分组-设备3级树结构
const getDeviceGroupTreeHik = function (data) {
    return fetch({
        url: "hikDevice/getHikDeviceGroupTree",
        method: "post",
        data: data,
    });
};

//添加分组
const addGroupHik = function (data) {
    return fetch({
        url: "hikDevice/addGroup",
        method: "post",
        data: data,
    });
};
//编辑分组
const updateGroupHik = function (data) {
    return fetch({
        url: "hikDevice/updateGroup",
        method: "post",
        data: data,
    });
};

//删除分组
const delGroupHik = function (data) {
    return fetch({
        url: "hikDevice/delGroup",
        method: "post",
        data: data,
    });
};

// 修改设备分组
const updateDeviceGroup = function (data) {
    return fetch({
        url: "hikDevice/updateHikDeviceGroup",
        method: "post",
        data: data,
    });
};

// 上传设备配置文件
const uploadConfigHik = function (data) {
    return fetch({
        url: "hikDevice/addUploadDeviceConfigFileCmd",
        method: "post",
        data: data,
    });
};

// 远程配置
const deviceConfigHik = function (data) {
    return fetch({
        url: "hikDevice/addDeviceConfigCmd",
        method: "post",
        data: data,
    });
};

// 查询参数命令
const queryConfigHik = function (data) {
    return fetch({
        url: "hikDevice/addQueryConfigCmd",
        method: "post",
        data: data,
    });
};

// 查询参数
const getDeviceParams = function (data) {
    return fetch({
        url: "hikDevice/getDeviceParamsByDeviceCode",
        method: "post",
        data: data,
    });
};

const getDeviceAbility = function (data) {
    return fetch({
        url: "hikDevice/getDeviceAbilityTree",
        method: "post",
        data: data,
    });
};

const getDeviceStatistic = function (data) {
    return fetch({
        url: "hikDevice/getDeviceStatistic",
        method: "post",
        data: data,
    });
};

const getDeviceChannelListByDeviceCode = function (params) {
    return fetch({
        url: "/hikDevice/getDeviceChannelListByDeviceCode",
        method: "post",
        data: params,
    });
};

const saveDeviceChannel = function (params) {
    return fetch({
        url: "/hikDevice/saveDeviceChannel",
        method: "post",
        data: params,
    });
};

//获取参数项
const getDeviceParamCommands = function (params) {
    return fetch({
        url: "/deviceParam/getDeviceParamCommands",
        method: "post",
        data: params,
    });
};

//获取设备参数模板
const getDeviceParamTemplatePage = function (params) {
    return fetch({
        url: "deviceParam/getDeviceParamTemplatePage",
        method: "post",
        data: params,
    });
};

//获取模板信息
const getDeviceParamGroupVoByTemplateId = function (params) {
    return fetch({
        url: "deviceParam/getDeviceParamGroupVoByTemplateId",
        method: "post",
        data: params,
    });
};

//保存模板
const publishDeviceParams = function (params) {
    return fetch({
        url: "deviceParam/publishDeviceParams",
        method: "post",
        data: params,
    });
};

//获取下发结果
const getDeviceSetParamLogPage = function (params) {
    return fetch({
        url: "deviceParam/getDeviceSetParamLogPage",
        method: "post",
        data: params,
    });
};

//获取的设备参数信息
const getDeviceParamsBycommandId = function (params) {
    return fetch({
        url: "deviceParam/getDeviceParams",
        method: "post",
        data: params,
    });
};

const getEquipmentInspectionPage = function (params) {
    return fetch({
        url: "equipmentInspection/page",
        method: "post",
        data: params,
    });
};
/**
 * 导出设备巡检数据
 * @param deviceInfoDto
 */
const doExportEQDeviceList = function (deviceInfoDto) {
    return fetch({
        url: "/equipmentInspection/exportEQDeviceList",
        method: "post",
        data: deviceInfoDto,
    });
};
const exportInspectionRecordHis = function (deviceInfoDto) {
    return fetch({
        url: "/equipmentInspection/exportInspectionRecordHis",
        method: "post",
        data: deviceInfoDto,
    });
};
//导出设备巡检信息
const exportInspectionRecord = function (deviceInfoDto) {
    return fetch({
        url: "/equipmentInspection/exportInspectionRecord",
        method: "post",
        data: deviceInfoDto,
        // headers:{
        //   'Content-Type':'application/json'
        // }
    });
};
//导出GPS信息
const equipmentInspectionExportGps = function (deviceInfoDto) {
    return fetch({
        url: "/equipmentInspection/exportGps",
        method: "post",
        data: deviceInfoDto,
        // headers:{
        //   'Content-Type':'application/json'
        // }
    });
};
//获取巡检历史信息
const getInspectionRecordByDevice = function (params) {
    return fetch({
        url: "/equipmentInspection/getInspectionRecordByDevice",
        method: "post",
        data: params,
    });
};
//故障台账导出
const doExportFaultRecord = function (deviceInfoDto) {
    return fetch({
        url: "faultManagement/exportFaultRecord",
        method: "post",
        data: deviceInfoDto,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
const getDeviceStatusPage = function (data) {
    return fetch({
        url: "/hikDevice/getDeviceStatusPage",
        method: "post",
        data: data,
    });
};
const exportDeviceStatus = function (data) {
    return fetch({
        url: "/hikDevice/exportDeviceStatus",
        method: "post",
        data: data,
    });
};

/**
 * 获取历史巡检记录
 */
const getEquipmentInspectionDataPage = function (data) {
    return fetch({
        url: "/equipmentInspectionData/page",
        method: "post",
        data: data,
    });
};
/**
 * 导出历史巡检记录
 */
const doExportEQDataDeviceList = function (data) {
    return fetch({
        url: "/equipmentInspectionData/export",
        method: "post",
        data: data,
    });
};
const syncDeviceConfig = function (data) {
    return fetch({
        url: "/deviceParam/syncDeviceConfig",
        method: "post",
        data: data,
    });
};
const sendDeviceConfigFiles1 = function (data) {
    return fetch({
        url: "/deviceParam/sendDeviceConfigFiles",
        method: "post",
        data: data,
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

// 生成客管序列号
const generateDeviceCode = function (params) {
    return fetch({
        url: "/hikDevice/generateDeviceCode",
        method: "post",
        data: params,
    });
};

// 获取协议类型
const getProtocol = function (params) {
    return fetch({
        url: "/hikDevice/getProtocol",
        method: "post",
        data: params,
    });
};
// 项目支持的协议类型
const projectProtocolCodes = function (params) {
    return fetch({
        url: "/hikDevice/projectProtocolCodes",
        method: "post",
        data: params,
    });
};
// 是否显示切换协议类型按钮
const switchProtocolButtonShow = function () {
    return fetch({
        url: "/hikDevice/switchProtocolButtonShow",
        method: "get",
    });
};
// 批量配置--平台配置
const configDeviceInfoBatch = function (params) {
    return fetch({
        url: "/hikDevice/configDeviceInfoBatch",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
// 设备是否支持远程访问设备web
const getRemoteDevWebUrlEnable = function (params) {
    return fetch({
        url: "/remoteDevWeb/getRemoteDevWebUrlEnable",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
// 设备是否支持远程访问设备web
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

/**
 * 清除项目中的无用型号
 */
const clearNoUseDeviceModel = function (params) {
    return fetch({
        url: "/hikDevice/clearNoUseDeviceModel",
        method: "get",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

const deviceManagerApiList = {
    clearNoUseDeviceModel,
    getRemoteDevWebUrlEnable,
    getRemoteDevWebUrl,
    projectProtocolCodes,
    switchProtocolButtonShow,
    configDeviceInfoBatch,
    sendDeviceConfigFiles1,
    syncDeviceConfig,
    exportDeviceStatus,
    getDeviceStatusPage,
    doExportEQDeviceList,
    exportInspectionRecordHis,
    exportInspectionRecord,
    equipmentInspectionExportGps,
    getInspectionRecordByDevice,
    doExportFaultRecord,
    getDeviceManagerPage,
    getDeviceManagerUpgradeDevicePage,
    getBindCarLog,
    getBindDeviceLog,
    doExportDevice,
    updateAutogradeStatus,
    updateDevicegradeStatus,
    updateGetconfigStatus,
    updateDeviceUseStatus,
    startUpgrade,
    startUpgradeNoAccessDev,
    reUpgrade,
    stopUpgrade,
    getDevUpgradeResult,
    getProductList,
    getDeviceTemplate,
    deleteDevice,
    updateHeartbeatBatch,
    addDeviceInfo,
    getLatestTempFirmwaresByProductKey,
    getGroupTreeHik,
    getDeviceGroupTreeHik,
    addGroupHik,
    updateGroupHik,
    delGroupHik,
    updateDeviceGroup,
    uploadConfigHik,
    deviceConfigHik,
    queryConfigHik,
    getDeviceParams,
    getDeviceAbility,
    getDeviceStatistic,
    getDeviceChannelListByDeviceCode,
    saveDeviceChannel,
    getDeviceParamCommands,
    getDeviceParamTemplatePage,
    getDeviceParamGroupVoByTemplateId,
    publishDeviceParams,
    getDeviceSetParamLogPage,
    getDeviceParamsBycommandId,
    editDeviceInfo,
    getEquipmentInspectionPage,
    getGroupTreeHikVithCount,
    getAlarmCounts,
    getEquipmentInspectionDataPage,
    doExportEQDataDeviceList,
    getOrgTree,
    generateDeviceCode,
    getProtocol,
};

export default deviceManagerApiList;
