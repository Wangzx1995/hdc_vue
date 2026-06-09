/**
 * Created by yusijiayf1 on 2019/10/23.
 */
import fetch from '@/utils/fetch';

const getFirmwarePage2=(params)=>{
    return fetch({
        url : 'firmwareHdc2/page',
        method : 'post',
        data : params
    });
}

const getFirmDeviceModelList2=(id)=>{
    return fetch({
        url : 'firmwareHdc2/getDeviceModelList',
        method : 'post',
        data : {
            tenantId:id
        }
    });
}

const addFirmware2=(params)=>{
    return fetch({
        url : 'firmwareHdc2/add',
        method : 'post',
        data : params
    });
}

const updateFirmware2=(params)=>{
    return fetch({
        url : 'firmwareHdc2/update',
        method : 'post',
        data : params
    });
}

const deleteFirmware2=(ids)=>{
    return fetch({
        url : 'firmwareHdc2/delete',
        method : 'post',
        data : {
            ids:ids
        }
    });
}

const deployFirmware2=(id)=>{
    return fetch({
        url : 'firmwareHdc2/deploy',
        method : 'post',
        data : {
            id:id
        }
    });
}

const stopUpdate2=(id)=>{
    return fetch({
        url : 'firmwareHdc2/stopUpdate',
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
const getEarlyVersions2=(firmwareInfoId,projectCode)=>{
    return fetch({
        url : 'firmwareHdc2/getEarlyVersions',
        method : 'post',
        data : {firmwareInfoId:firmwareInfoId,projectCode:projectCode}
    });
}

/**
 * 添加固件包
 * @type {{}}
 */
const addPackage2=(dto)=>{
    return fetch({
        url : 'firmwareHdc2/addPackage',
        method : 'post',
        data : dto
    });
}

/**
 * 获取升级时筛选出的固件列表
 * @type {{}}
 */
const getFirmwarePackagePage2=(firmwareInfoId)=>{
    return fetch({
        url : 'firmwareHdc2/getFirmwarePackagePage',
        method : 'post',
        data : {firmwareInfoId:firmwareInfoId}
    });
}

/**
 * 获取升级时筛选出的固件列表
 * @type {{}}
 */
const deletePackages2=(ids)=>{
    return fetch({
        url : 'firmwareHdc2/deletePackages',
        method : 'post',
        data : {ids:ids}
    });
}

/**
 * 获取租户的项目列表
 */
const getTenantProjectList2=(ids)=>{
    return fetch({
        url : 'firmwareHdc2/getProjectListByTenantID',
        method : 'post'
    });
}

/**
 * 设置固件关联的设备
 */
const setFirmwareDevice=(data)=>{
    return fetch({
        url : 'firmwareHdc2/setFirmwareDevice',
        method : 'post',
        data : data
    });
}


const getLatestTempFirmwaresByProductKey=(data)=>{
    return fetch({
        url : 'firmwareHdc2/getLatestTempFirmwaresByProductKey',
        method : 'post',
        data : data
    });
}

const firmwareApiList2 = {
    getFirmwarePage2,
    getFirmDeviceModelList2,
    addFirmware2,
    deleteFirmware2,
    updateFirmware2,
    deployFirmware2,
    getEarlyVersions2,
    addPackage2,
    stopUpdate2,
    getFirmwarePackagePage2,
    deletePackages2,
    getTenantProjectList2,
    setFirmwareDevice,
    getLatestTempFirmwaresByProductKey
}

export default firmwareApiList2