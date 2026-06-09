import fetch from '@/utils/fetch';

/**
 * 获取报警列表
 * @param areaDto
 */
const getAlarmVoPage = function(data){
    return fetch({
        url : '/alarm/page',
        method : 'post',
        data:data
    });
}
/**
 * 标记已读
 * @param areaDto
 */
const readAlarm = function(data){
    return fetch({
        url : '/alarm/readAlarm',
        method : 'post',
        data:data
    });
}
/**
 * 标记已读
 * @param areaDto
 */
const getUnReadAlarmCount = function(data){
    return fetch({
        url : '/alarm/getUnReadAlarmCount',
        method : 'post',
        data:data
    });
}

const alarmManageApiList = {
    /*  area start  */
    getAlarmVoPage,
    readAlarm,
    getUnReadAlarmCount
    /*  area end    */
}

export default alarmManageApiList