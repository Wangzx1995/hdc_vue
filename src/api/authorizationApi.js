/**
 * Created by 金锦辉 on 2019/3/4.
 */
import fetch from '@/utils/fetch';

/**
 * 获取开发者拥有权限的设备型号
 * @param params
 */
const getTenantDeviceModelPage = function (params) {
    return fetch({
        url: '/auth/getTenantDeviceModelPage',
        method: 'post',
        data: params
    })
}

/**
 * 查询所有已经授权的开发者
 * @param params
 */
const queryAllRentedTenant = function (params) {
    return fetch({
        url: '/auth/queryAllRentedTenant',
        method: 'post',
        data: params
    })
}

const getDeviceByDeviceModel = function(params){
    return fetch({
        url: '/auth/getDeviceByDeviceModel',
        method: 'post',
        data: params
    })
}

const rentTenantDeviceInterface = function(params){
    return fetch({
        url: '/auth/rentTenantDeviceInterface',
        method: 'post',
        data: params
    })
}

const rentTenantProjectInterface = function(params){
    return fetch({
        url: '/auth/rentTenantProjectInterface',
        method: 'post',
        data: params
    })
}

const rentTenantProductKeyInterface = function (params) {
    return fetch({
        url: '/auth/rentTenantProductKeyInterface',
        method: 'post',
        data: params
    })
}

const getTanentVoByDeveloperAccount = function(params){
    return fetch({
        url: '/auth/getTanentVoByDeveloperAccount',
        method: 'post',
        data: params
    })
}

const getAuthInfoListByDeviceModel = function(params){
    return fetch({
        url: '/auth/getAuthInfoListByDeviceModel',
        method: 'post',
        data: params
    })
}

/**
 * 获取所有租户
 */
const getTanentList = function () {
    return fetch({
        url: '/auth/getTanentList',
        method: 'post'
    });
}

/**
 * 取消授权
 */
const doCancelRentSubmit = function(params){
    return fetch({
        url: '/auth/cancelRentInterface',
        method: 'post',
        data: params
    });
}

const hatcUserApiList = {
    getTenantDeviceModelPage,
    queryAllRentedTenant,
    getDeviceByDeviceModel,
    rentTenantDeviceInterface,
    rentTenantProductKeyInterface,
    getTanentVoByDeveloperAccount,
    getAuthInfoListByDeviceModel,
    getTanentList,
    doCancelRentSubmit,
    rentTenantProjectInterface
}

export default hatcUserApiList