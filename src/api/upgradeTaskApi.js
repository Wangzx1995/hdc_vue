/**
 * Created by chenhu5 on 2017/12/15.
 */
import fetch from '@/utils/fetch';

/**
 * 获取型号下拉框
 */
const getDeviceModelList_UpgradeTask=function(){
    return fetch({
        url : '/upgradeTask/getDeviceModelList',
        method : 'post',
        data : {}
    });
}

/**
 * 获取升级日志批次列表
 */
const getDeviceUpgradeLogBatchPage_UpgradeTask=function(param){
    return fetch({
        url: '/upgradeTask/pageDeviceUpgradeLogBatch',
        method: 'post',
        data: param
    })
}

/**
 * 重新升级
 */
const reUpgrade_UpgradeTask = function(deviceUpgradeDto){
    return fetch({
        url : '/upgradeTask/reUpgrade',
        method : 'post',
        data : deviceUpgradeDto
    });
}

/**
 * 终止下发
 */
const stopUpgrade_UpgradeTask = function(params){
    return fetch({
        url : '/upgradeTask/stopUpgrade',
        method : 'post',
        data : params
    });
}

/**
 * 获取升级日志
 */
const getDevUpgradeLogPage_UpgradeTask=function(param){
    return fetch({
        url: '/upgradeTask/pageDevUpgradeLog',
        method: 'post',
        data: param
    })
}

/**
 * 设备终止升级
 */
const stopUpgrade=function(param){
  return fetch({
      url: '/upgrade/stopUpgrade',
      method: 'post',
      data: param
  })
}
/**
 * 重新获取设备升级状态
 */
 const getRefreshUpgradeStatus = function(param){
    return fetch({
        url: '/upgrade/refreshUpgradeStatusByBatchCode',
        method: 'post',
        data: param
    })
}
/*查询设备版本升级进度*/
const getDevVersionUpgradeStatus=function(param){
    return fetch({
        url: '/upgradeTask/getDevVersionUpgradeStatus',
        method: 'post',
        data: param
    })
}


const upgradeTaskApiList = {
    /*  area start  */
    getDeviceModelList_UpgradeTask,
    getDeviceUpgradeLogBatchPage_UpgradeTask,
    reUpgrade_UpgradeTask,
    stopUpgrade_UpgradeTask,
    getDevUpgradeLogPage_UpgradeTask,
    stopUpgrade,
    getDevVersionUpgradeStatus,
    getRefreshUpgradeStatus
    /*  area end    */

}

export default upgradeTaskApiList