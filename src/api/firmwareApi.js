/**
 * Created by chenhu5 on 2017/12/15.
 */
import fetch from '@/utils/fetch';

const getFirmwarePage=(params)=>{
    return fetch({
        url : 'firmwareHdc/page',
        method : 'post',
        data : params
    });
}


const getFirmDeviceModelList=(id)=>{
    return fetch({
        url : 'firmwareHdc/getDeviceModelList',
        method : 'post',
        data : {
            tenantId:id
        }
    });
}

const addFirmware=(params)=>{
    return fetch({
        url : 'firmwareHdc/add',
        method : 'post',
        data : params
    });
}
const updateFirmware=(params)=>{
    return fetch({
        url : 'firmwareHdc/update',
        method : 'post',
        data : params
    });
}

const deleteFirmware=(ids)=>{
    return fetch({
        url : 'firmwareHdc/delete',
        method : 'post',
        data : {
            ids:ids
        }
    });
}
const deployFirmware=(id)=>{
    return fetch({
        url : 'firmwareHdc/deploy',
        method : 'post',
        data : {
            id:id
        }
    });
}

const stopUpdate=(id)=>{
    return fetch({
        url : 'firmwareHdc/stopUpdate',
        method : 'post',
        data : {
            id:id
        }
    });
}

/**
 * 获取升级时筛选出的固件列表
 * @type {{}}
 */
const getEarlyVersions=(firmwareInfoId,projectCode)=>{
    return fetch({
        url : 'firmwareHdc/getEarlyVersions',
        method : 'post',
        data : {firmwareInfoId:firmwareInfoId,projectCode:projectCode}
    });
}

/**
 * 添加固件包
 * @type {{}}
 */
const addPackage=(dto)=>{
    return fetch({
        url : 'firmwareHdc/addPackage',
        method : 'post',
        data : dto
    });
}

/**
 * 获取升级时筛选出的固件列表
 * @type {{}}
 */
const getFirmwarePackagePage=(firmwareInfoId)=>{
    return fetch({
        url : 'firmwareHdc/getFirmwarePackagePage',
        method : 'post',
        data : {firmwareInfoId:firmwareInfoId}
    });
}

/**
 * 获取升级时筛选出的固件列表
 * @type {{}}
 */
const deletePackages=(ids)=>{
    return fetch({
        url : 'firmwareHdc/deletePackages',
        method : 'post',
        data : {ids:ids}
    });
}

/**
 * 创建白名单导入模板
 * @param params
 */
const getDeviceWhiteListTemplate=()=>{
    return fetch({
        url : 'firmwareHdc/createTemplate',
        method : 'post',
        data : {
            templateCode:"deviceWhiteList"
        }
    });
}


/**
 * 查询白名单列表
 * */
const pageDeviceWhiteList = function (params) {
    return fetch({
        url: '/firmwareHdc/pageDeviceWhiteList',
        method: 'post',
        data: params
    });
}

/**
 * 编辑保存白名单的设备信息
 * */
const updateDeviceWhiteInfo = function (data) {
    return fetch({
        url: '/firmwareHdc/updateDeviceWhiteInfo',
        method: 'post',
        data: data
    });
}

/**
 * 批量删除白名单里的设备
 */
const deleteDeviceWhiteInfos = function (deviceCodes) {
    return fetch({
        url: '/firmwareHdc/deleteDeviceWhiteInfos',
        method: 'post',
        data: {deviceCodes: deviceCodes}
    });
}

const firmwareApiList = {
    /*  area start  */
    getFirmwarePage,
    getFirmDeviceModelList,
    addFirmware,
    deleteFirmware,
    updateFirmware,
    deployFirmware,
    getEarlyVersions,
    addPackage,
    stopUpdate,
    getFirmwarePackagePage,
    deletePackages,
    getDeviceWhiteListTemplate,
    pageDeviceWhiteList,
    updateDeviceWhiteInfo,
    deleteDeviceWhiteInfos
    /*  area end    */

}

export default firmwareApiList