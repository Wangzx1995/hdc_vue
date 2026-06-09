import fetch from "@/utils/fetch";

/**
 * 获取设备上下线日志列表
 * @param areaDto
 */
const getEfcPage = function (params) {
    return fetch({
        url: '/efcHDC/page',
        method: 'post',
        data: params
    });
}
/**
 * 删除电子围栏
 * @param uuidList
 */
const deleteEfcInfos = function (params) {
    return fetch({
        url: '/efcHDC/delEfcInfos',
        method: 'post',
        data: params
    });
}

/**
 * 添加电子围栏
 * @param params
 */
const insertOrUpdateEfcInfo = function (params) {
    return fetch({
        url: '/efcHDC/insertOrUpdateEfcInfo',
        method: 'post',
        data: params
    });
}

/**
 * 获取电子围栏绑定的设备
 * 
 * @param params
 */
const getBindDevices = function (params) {
    return fetch({
        url: '/efcHDC/getBindDevices',
        method: 'post',
        data: params
    });
}
/**
 * 批量删除电子围栏绑定的设备
 * 
 * @param params
 */
const delEfcBindDevices = function (params) {
    return fetch({
        url: '/efcHDC/delEfcBindDevices',
        method: 'post',
        data: params
    });
}
/**
 * 查询未绑定的设备
 * 
 * @param params
 */
const getDevicesWithoutBind = function (params) {
    return fetch({
        url: '/efcHDC/getDevicesWithoutBind',
        method: 'post',
        data: params
    });
}
/**
 * 绑定的设备
 * 
 * @param params
 */
const insertOrUpdateEfcBindDevices = function (params) {
    return fetch({
        url: '/efcHDC/insertOrUpdateEfcBindDevices',
        method: 'post',
        data: params
    });
}
/**
 * 重新加载
 * 
 * @param params
 */
const reloadEfcInfo = function () {
    return fetch({
        url: '/efcHDC/reloadEfcInfo',
        method: 'post'
    });
}
const efcApiList = {
    /*  area start  */
    getEfcPage,
    deleteEfcInfos,
    insertOrUpdateEfcInfo,
    getBindDevices,
    delEfcBindDevices,
    getDevicesWithoutBind,
    insertOrUpdateEfcBindDevices,
    reloadEfcInfo
    /*  area end    */

}

export default efcApiList