import fetch from '@/utils/fetch';

/**
 * 获取短信列表
 * @param areaDto
 */
const getSmsPage = function(data){
    return fetch({
        url : '/SmsManage/getSmsPage',
        method : 'post',
        data:data
    });
}

const getOutDevicePage = function(data){
    return fetch({
        url : '/device/getOutDevicePage',
        method : 'post',
        data:data
    });
}

const getUpgradeOutDevicePage = function(data){
    return fetch({
        url : '/device/getUpgradeOutDevicePage',
        method : 'post',
        data:data
    });
}

const getPhoneTemplate = function(data){
    return fetch({
        url : '/device/createOutDeviceTemplate',
        method : 'post',
        data:data
    });
}

const deleteIphone = function(data){
    return fetch({
        url : '/device/deleteIphone',
        method : 'post',
        data:data
    });
}

const sendSms = function(data){
    return fetch({
        url : '/device/sendSms',
        method : 'post',
        data:data
    });
}

const getDirectTreeList = function(){
    return fetch({
        url : '/device/getTreeList',
        method : 'post',
    });
}

const getDirectivePage = function(data){
    return fetch({
        url : '/directiveManage/getDirectivePage',
        method : 'post',
        data:data
    });
}

const deleteChildren = function(data){
    return fetch({
        url : '/directiveManage/deleteChildren',
        method : 'post',
        data:data
    });
}
const getParentList = function(){
    return fetch({
        url : '/directiveManage/getParentList',
        method : 'post',
    });
}

const addChildrenTree = function(data){
    return fetch({
        url : '/directiveManage/addChildrenTree',
        method : 'post',
        data:data
    });
}
const addParentTree = function(data){
    return fetch({
        url : '/directiveManage/addParentTree',
        method : 'post',
        data:data
    });
}

const seeSmsDetail = function(data){
    return fetch({
        url : '/device/seeSmsDetail',
        method : 'post',
        data:data
    });
}

const addPhoneNum = function(data){
    return fetch({
        url : '/device/addOutDevice',
        method : 'post',
        data:data
    });
}

const editPhoneNum = function(data){
    return fetch({
        url : '/device/editOutDevice',
        method : 'post',
        data:data
    });
}

const editChildrenTree = function(data){
    return fetch({
        url : '/directiveManage/editChildrenTree',
        method : 'post',
        data:data
    });
}
/**
 * 获取型号下拉框
 */
const getDeviceModelList=function(){
    return fetch({
        url : 'device/getDeviceModelList',
        method : 'post',
        data : {}
    });
}

//获取项目-分组二级树结构
const getGroupTree=function(){
    return fetch({
        url : 'device/getOutGroupTree',
        method : 'post',
        data : {}
    });
}


//获取项目-分组-设备3级树结构
const getDeviceGroupTree=function(data){
    return fetch({
        url : 'device/getOutDeviceGroupTree',
        method : 'post',
        data : data
    });
}

//添加分组
const addGroup=function(data){
    return fetch({
        url : 'device/addGroup',
        method : 'post',
        data : data
    });
}
//编辑分组
const updateGroup=function(data){
    return fetch({
        url : 'device/updateGroup',
        method : 'post',
        data : data
    });
}

//删除分组
const delGroup=function(data){
    return fetch({
        url : 'device/delGroup',
        method : 'post',
        data : data
    });
}

// 把设备移入分组
const addDevice2Group=function(data){
    return fetch({
        url : 'device/updateOutDeviceGroup',
        method : 'post',
        data : data
    });
}

// 删除设备升级次数缓存
const delUpgradeTimeCache=function(data){
    return fetch({
        url : 'device/delUpgradeTimeCache',
        method : 'post',
        data : data
    });
}

// 获取指定设备型号的设备版本列表
const getOutDeviceVersions=function(data){
    return fetch({
        url : 'device/getOutDeviceVersions',
        method : 'post',
        data : data
    });
}

// 添加批量上传设备配置文件命令
const addUploadDeviceConfigFileCmd=function(data){
    return fetch({
        url : 'device/addUploadDeviceConfigFileCmd',
        method : 'post',
        data : data
    });
}


// 添加批量远程配置命令
const addDeviceConfigCmd=function(data){
    return fetch({
        url : 'device/addDeviceConfigCmd',
        method : 'post',
        data : data
    });
}

// 添加批量远程配置命令
const addQueryConfigCmd=function(data){
    return fetch({
        url : 'device/addQueryConfigCmd',
        method : 'post',
        data : data
    });
}

// 获取临时配置文件列表
const getTempConfigs=function(data){
    return fetch({
        url : 'device/getTempConfigs',
        method : 'post',
        data : data
    });
}

// 获取固件列表
const getLatestFirmwareList=function(data){
    return fetch({
        url : 'firmwareHdc2/getLatestFirmwareList',
        method : 'post',
        data : data
    });
}

// 下发升级命令
const addUpgradeCmd=function(data){
    return fetch({
        url : 'device/addUpgradeCmd',
        method : 'post',
        data : data
    });
}

// 能力集
const getDeviceAbilityTree=function(data){
    return fetch({
        url : 'device/getDeviceAbilityTree',
        method : 'post',
        data : data
    });
}

// 修改设备开关
const updateDeviceLogSwitch=function(data){
    return fetch({
        url : 'device/updateDeviceLogSwitch',
        method : 'post',
        data : data
    });
}

//获取非接入配置文件列表
const getDeviceParamBinFilePage=function (param) {
    return fetch({
        url : 'device/getDeviceConfigFilePage',
        method : 'post',
        data : param
    });
}

//获取bin文件下载url
const getBinFileDownloadUrl = function (param) {
    return fetch({
        url : 'device/getConfigFileDownloadUrl',
        method : 'post',
        data : param
    });
}

//获取bin文件上传url
const addConfigFile = function (param) {
    return fetch({
        url : 'device/addConfigFile',
        method : 'post',
        data : param
    });
}

//通知设备上传参数配置文件
const doGetOutDeviceConfig = function (param) {
    return fetch({
        url : 'device/syncOutDeviceConfig',
        method : 'post',
        data : param
    });
}

//下发获取设备参数的命令
const addGetDeviceParamsCmd = function (param) {
    return fetch({
        url : 'device/addGetDeviceParamsCmd',
        method : 'post',
        data : param
    });
}

//获取设备参数信息
const getOutDeviceParams = function (param) {
    return fetch({
        url : 'device/getOutDeviceParams',
        method : 'post',
        data : param
    });
}
const doExportOutDevice = function (param) {
    return fetch({
        url : 'device/doExportOutDevice',
        method : 'post',
        data : param
    });
}

const getOutDeviceInfoById = function(param){
    return fetch({
        url : 'device/getOutDeviceInfoById',
        method : 'post',
        data : param
    });
}
const getOutDeviceConfigListTop5 = function(param){
    return fetch({
        url : 'device/getOutDeviceConfigListTop5',
        method : 'post',
        data : param
    });
}
const getBinDownloadUrl = function(param){
    return fetch({
        url : 'device/getBinDownloadUrl',
        method : 'post',
        data : param
    });
}
const getBinUploadUrl = function(){
    return fetch({
        url : 'device/getBinUploadUrl',
        method : 'post'
    });
}
const sendDeviceConfigFiles = function(param){
    return fetch({
        url : 'device/sendDeviceConfigFiles',
        method : 'post',
        data : param
    });
}
const getConfigCtrlPlugin = function(){
    return fetch({
        url : 'device/getConfigCtrlPlugin',
        method : 'post',
    });
}

const sendSmsManageApiList = {
    /*  area start  */
    getConfigCtrlPlugin,
    sendDeviceConfigFiles,
    getBinUploadUrl,
    getBinDownloadUrl,
    getOutDeviceConfigListTop5,
    doExportOutDevice,
    getSmsPage,
    getPhoneTemplate,
    deleteIphone,
    sendSms,
    getDirectTreeList,
    getDirectivePage,
    deleteChildren,
    getParentList,
    addChildrenTree,
    addParentTree,
    seeSmsDetail,
    addPhoneNum,
    editPhoneNum,
    editChildrenTree,
    getOutDevicePage,
    getUpgradeOutDevicePage,
    getDeviceModelList,
    getGroupTree,
    getDeviceGroupTree,
    addGroup,
    updateGroup,
    delGroup,
    addDevice2Group,
    delUpgradeTimeCache,
    getOutDeviceVersions,
    addUploadDeviceConfigFileCmd,
    addDeviceConfigCmd,
    addQueryConfigCmd,
    getTempConfigs,
    getLatestFirmwareList,
    addUpgradeCmd,
    getDeviceAbilityTree,
    updateDeviceLogSwitch,
    getDeviceParamBinFilePage,
    getBinFileDownloadUrl,
    addConfigFile,
    doGetOutDeviceConfig,
    addGetDeviceParamsCmd,
    getOutDeviceParams,
    getOutDeviceInfoById
    /*  area end    */
}

export default sendSmsManageApiList