/**
 * Created by 黎芳琪 on 2018/1/12.
 */
import fetch from '@/utils/fetch';

/**
 * 获取升级日志列表
 */
const getDevUpgradeLogPage=function(param){
    return fetch({
        url: '/hikDevice/pageDevUpgradeLog',
        method: 'post',
        data: param
    })
}
/**
 * 获取升级日志批次列表
 */
const getDeviceUpgradeLogBatchPage=function(param){
    return fetch({
        url: '/hikDevice/pageDeviceUpgradeLogBatch',
        method: 'post',
        data: param
    })
}


/**
 * 获取参数配置日志列表
 */
const getDeviceParamsCommandLogPage=function(param){
    return fetch({
        url: '/hikDevice/pageDeviceParamsCommandLog',
        method: 'post',
        data: param
    })
}
/**
 * 获取升级日志批次列表
 */
const getDeviceParamsCommandLogBatchPage=function(param){
    return fetch({
        url: '/hikDevice/pageDeviceParamsCommandLogBatch',
        method: 'post',
        data: param
    })
}
const getDeviceParamGroupVoByBatchCode=function(param){
    return fetch({
        url: '/hikDevice/getDeviceParamGroupVoByBatchCode',
        method: 'post',
        data: param
    })
}
const addFirmwareTemp=function(param){
    return fetch({
        url: '/hikDevice/addFirmwareTemp',
        method: 'post',
        data: param
    })
}

const deviceLogApiList = {
    getDevUpgradeLogPage,
    getDeviceUpgradeLogBatchPage,
    getDeviceParamsCommandLogPage,
    getDeviceParamsCommandLogBatchPage,
    getDeviceParamGroupVoByBatchCode,
    addFirmwareTemp
}

export default deviceLogApiList