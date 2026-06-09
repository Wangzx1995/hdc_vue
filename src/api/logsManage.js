import fetch from '@/utils/fetch';

const getDeviceUpgradeBatchByPage = function(data){
    return fetch({
        url : '/outDevLoginLogs/getDeviceUpgradeBatchByPage',
        method : 'post',
        data:data
    });
}

const getDeviceUploadConfigBatchByPage = function(data){
    return fetch({
        url : '/outDevLoginLogs/getDeviceUploadConfigBatchByPage',
        method : 'post',
        data:data
    });
}

const getDeviceConfigBatchByPage = function(data){
    return fetch({
        url : '/outDevLoginLogs/getDeviceConfigBatchByPage',
        method : 'post',
        data:data
    });
}

const getDeviceUploadConfigLogByPage = function(data){
    return fetch({
        url : '/outDevLoginLogs/getDeviceUploadConfigLogByPage',
        method : 'post',
        data:data
    });
}

const getDeviceConfigLogByPage = function(data){
    return fetch({
        url : '/outDevLoginLogs/getDeviceConfigLogByPage',
        method : 'post',
        data:data
    });
}

const getDeviceQueryParamsBatchByPage = function(data){
    return fetch({
        url : '/outDevLoginLogs/getDeviceQueryParamsBatchByPage',
        method : 'post',
        data:data
    });
}

const getQueryParamsLogByPage = function(data){
    return fetch({
        url : '/outDevLoginLogs/getQueryParamsLogByPage',
        method : 'post',
        data:data
    });
}

/**
 * 获取未接入设备升级日志列表
 * @param areaDto
 */
const getOutScheduleLog= function (params) {
    return fetch({
        url: '/outDevLoginLogs/getOutScheduleLog',
        method: 'post',
        data:params
    });
}

const logsManageApiList = {
    getOutScheduleLog,
    getDeviceUpgradeBatchByPage,
    getDeviceUploadConfigBatchByPage,
	getDeviceConfigBatchByPage,
	getDeviceUploadConfigLogByPage,
	getDeviceConfigLogByPage,
    getDeviceQueryParamsBatchByPage,
    getQueryParamsLogByPage
}

export default logsManageApiList