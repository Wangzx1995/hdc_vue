import fetch from "@/utils/fetch";
// import creatData from '@/mock/json/getTree.js'

const getMultiFileVideoDownloadValue = function (params) {
    return fetch({
        url: "/monitor/getMultiFileVideoDownloadValue",
        method: "post",
        data: params,
    });
};
const getTrackPlayBackPersonaliseSet = function (params) {
    return fetch({
        url: "/monitor/getTrackPlayBackPersonaliseSet",
        method: "post",
        data: params,
    });
};
/**
 * 下发抓图命令--单通道
 * @param params
 */
const screenShots = function (params) {
    return fetch({
        url: "/monitor/screenShots",
        method: "post",
        data: params,
    });
};

/**
 * 下发抓图命令--多通道
 * @param params
 */
const screenShotsList = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/monitor/screenShotsList",
        method: "post",
        data: params,
    });
};

const findRegionAndEnterpriseTree = function (params) {
    return fetch({
        url: "/enterpriseGroup/findRegionAndEnterpriseTree",
        method: "post",
        data: params,
    });
};

// const getEnterpriseTreeCarList= function (params) {
// 	return fetch({
// 		url: '/car/carList',
// 		method: 'post',
// 		data: params
// 	});
// }

/**
 * 获取录像列表
 * @param params
 */
const getVideoList = function (params) {
    return fetch({
        url: "/monitor/getVideoList",
        method: "post",
        data: params,
    });
};
const urlgetMultiFileVideoDownloadUrl = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/video/getMultiFileVideoDownloadUrl",
        method: "post",
        data: params,
    });
};

/**
 * 获取音频列表
 * @param params
 */
const getVoiceList = function (params) {
    return fetch({
        url: "/monitor/getVoiceList",
        method: "post",
        data: params,
    });
};

/**
 * 获取电子围栏
 * @param params
 */
const getMonitorEleFenceList = function (params) {
    return fetch({
        url: "/monitor/getEleFenceList",
        method: "post",
        data: params,
    });
};

/**
 * 获取图片列表
 * @param params
 */
const getPicList = function (params) {
    return fetch({
        url: "/monitor/getPicList",
        method: "post",
        data: params,
    });
};

/**
 * 获取最新的gps信息
 * @param params
 */
const getLastGpsInfo = function (params) {
    return fetch({
        url: "/monitor/getLastGpsInfo",
        method: "post",
        data: params,
    });
};

// /**
//  * 获取gps列表通过终端手机号
//  * @param params
//  */
// const getGpsList = function(params) {
// 	return fetch({
// 		url: '/monitor/getGpsList',
// 		method: 'post',
// 		data: params
// 	});
// }

/**
 * 获取gps列表通过车辆carId
 * @param params
 */
const getGpsListByCarId = function (params) {
    return fetch({
        url: "/monitor/getGpsListByCarId",
        method: "post",
        data: params,
    });
};

/**
 * 获取预览url
 * @param params
 */
const getIntercomUrl = function (params) {
    return fetch({
        url: "/monitor/getIntercomUrl",
        method: "post",
        data: params,
    });
};

/**
 * 获取监听url
 * @param params
 */
const getListenUrl = function (params) {
    return fetch({
        url: "/monitor/getListenUrl",
        method: "post",
        data: params,
    });
};

/**
 * 锁车
 * @param params
 */
const lockCar = function (params) {
    return fetch({
        url: "/monitor/lockCar",
        method: "post",
        data: params,
    });
};

/**
 * 重启
 * @param params
 */
const rebootCar = function (params) {
    return fetch({
        url: "/monitor/rebootCar",
        method: "post",
        data: params,
    });
};

/**
 * 发起回拨
 * @param params
 */
const callback = function (params) {
    return fetch({
        url: "/monitor/callback",
        method: "post",
        data: params,
    });
};

// /**
//  * 根据车辆id获取车辆信息
//  * @param params
//  */
// const getCarListByCarIds = function (params) {
// 	return fetch({
// 		url: '/monitor/getCarListByCarIds',
// 		method: 'post',
// 		data: params
// 	});
// }

// /**
//  * 获取系统配置的地图中心
//  */
// const getSystemDefaultRegion = function () {
// 	return fetch({
// 		url: '/region/getSystemDefaultRegion',
// 		method: 'post'
// 	});
// }

/**
 * 获取默认区域的车辆列表
 */
const getCarListFromDefaultRegion = function (params) {
    //
    // let cardata = creatData.getCarListFromDefaultRegion(params);
    // return new Promise(resolve=>{
    // 	resolve(cardata)
    // })
    return fetch({
        url: "/monitor/getCarListFromDefaultRegion",
        method: "post",
        data: params,
    });
};

// /**
//  * 获取默认区域的车辆数量
//  */
// const getCarCountFromDefaultRegion = function (params) {
// 	return fetch({
// 		url: '/monitor/getCarCountFromDefaultRegion',
// 		method: 'post',
// 		data: params
// 	});
// }

/**
 * 获取临时组列表
 * @param params
 */
const getTempGroupList = function (params) {
    return fetch({
        url: "/monitor/getTempGroupTree",
        method: "post",
        data: params,
    });
};

/**
 * 根据picId获取图片url
 * @param params
 */
const getPicUrlByPicId = function (params) {
    return fetch({
        url: "/monitor/syncPicUrlByPicId",
        method: "post",
        data: params,
    });
};

/**
 * 获取语音回放url
 * @param params
 */
const getVoiceUrl = function (params) {
    return fetch({
        url: "/monitor/getVoiceUrl",
        method: "post",
        data: params,
    });
};

/**
 * 获取回放url
 * @param params
 */
const getPlayBackUrl = function (params) {
    return fetch({
        url: "/monitor/getPlayBackUrl",
        method: "post",
        data: params,
    });
};

/**
 * 添加临时组
 * @param params
 */
const addTempGroup = function (params) {
    return fetch({
        url: "/monitor/addTempGroup",
        method: "post",
        data: params,
    });
};

/**
 * 编辑临时组
 * @param params
 */
const editTempGroup = function (params) {
    return fetch({
        url: "/monitor/editTempGroup",
        method: "post",
        data: params,
    });
};

/**
 * 删除临时分组
 * @param params
 */
const deleteTempGroup = function (params) {
    return fetch({
        url: "/monitor/deleteTempGroup",
        method: "post",
        data: params,
    });
};

/**
 * 多车跟踪
 * @param params
 */
const startTrackTrajectory = function (params) {
    return fetch({
        url: "/monitor/startTrackTrajectory",
        method: "post",
        data: params,
    });
};

// /**
//  * 获取企业列表
//  * @param params
//  */
// const getBusinessList = function (params) {
// 	return fetch({
// 		url: '/enterprise/simpleList',
// 		method: 'post',
// 		data: params
// 	});
// }

// /**
//  * 车辆列表与临时组列表绑定
//  * @param params
//  */
// const addCarIntoTempGroup = function (params) {
// 	return fetch({
// 		url: '/monitor/addCarIntoTempGroup',
// 		method: 'post',
// 		data: params
// 	});
// }

/**
 * 从临时组中将车辆移除出去
 * @param params
 */
const deleteCarFromTempGroup = function (params) {
    return fetch({
        url: "/monitor/deleteCarFromTempGroup",
        method: "post",
        data: params,
    });
};

/**
 * 根据车辆id获取车辆定位信息
 * @param params
 */
const getCarLocationByCarIds = function (params) {
    // let data = creatData.getCarLocationByCarIds(params);
    // return new Promise(resolve=>{
    // 	resolve(data)
    // })
    return fetch({
        url: "/monitor/getCarLocationByCarIds",
        method: "post",
        data: params,
    });
};

/**
 * 获取待添加到临时组的车辆列表
 * @param params
 */
const getTempGroupCarPageInfo = function (params) {
    return fetch({
        url: "/monitor/getTempGroupCarPageInfo",
        method: "post",
        data: params,
    });
};

/**
 * 根据车辆id获取驾驶员信息
 * @param params
 */
const getDriverInfoVoByCarId = function (params) {
    return fetch({
        url: "/monitor/getDriverInfoVoByCarId",
        method: "post",
        data: params,
    });
};

//根据车辆deviceCode获取当前车辆休眠状态
const getSleepByDeevicecode = function (params) {
    return fetch({
        url: "/enterpriseGroup/getSimpleTreeVoCache",
        method: "post",
        data: params,
    });
};

//根据车辆id获取设备集合
const getDeviceListByCarId = function (params) {
    return fetch({
        url: "/monitor/getDeviceListByCarId",
        method: "post",
        data: params,
    });
};

// const deviceFileUpLoad = function(params) {
//     return fetch({
//         url: '/monitor/upLoadFile',
//         method: 'post',
//         data: params
//     });
// }

const getMonitorBroadcastUrl = function (params) {
    return fetch({
        url: "/monitor/getBroadcastUrl",
        method: "post",
        data: params,
    });
};

const getVideoDownloadUrl = function (params) {
    return fetch({
        url: "/monitor/getVideoDownloadUrl",
        method: "post",
        data: params,
    });
};



// const getDeviceChannelTree = function () {
// 	return fetch({
// 		url: '/monitorVideo/getDeviceChannelTree',
// 		method: 'post'
// 	});
// }

const getPreviewUrlByChannelId = function (params) {
    return fetch({
        url: "/monitorVideo/getPreviewUrlByChannelId",
        method: "post",
        data: params,
    });
};

const getPluginVersion = function (params) {
    return fetch({
        url: "/project/getPluginVersion",
        method: "post",
        data: params,
    });
};

//获取车辆数据统计
const getCarStatusCount = function (params) {
    return fetch({
        url: "/monitor/getCarStatusCount",
        method: "post",
        data: params,
    });
};

const comparePluginVersion = function (params) {
    return fetch({
        url: "/project/comparePluginVersion",
        method: "post",
        data: params,
    });
};

/**
 * 获取登录日志列表
 * @param params
 */
const getCarInfoByCarIdMonitor = function (params) {
    return fetch({
        url: "/monitor/findCarInfoDetail",
        method: "post",
        data: params,
    });
};

//通过车辆id获取车辆驾驶员信息,有当班司机返回当班司机,没有的话返回所有绑定的驾驶员
const getDriverListByCarId = function (params) {
    return fetch({
        url: "/monitor/getDriverListByCarId",
        method: "post",
        data: params,
    });
};

//获取实时轨迹点
const getLastGpsInfoByCarId = function (params) {
    return fetch({
        url: "/monitor/getLastGpsInfoByCarId",
        method: "post",
        data: params,
    });
};

//过车查询
const findPassingCar = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/monitor/findPassingCar",
        method: "post",
        data: params,
    });
};

//获取当前车辆的GPS信息
const getCarGpsShadowList = function (params) {
    return fetch({
        url: "/monitor/getCarGpsShadowList",
        method: "post",
        data: params,
    });
};

//导出当前车辆的GPS信息
const exportCarListGpsShadow = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/monitor/exportCarListGpsShadow",
        method: "post",
        data: params,
    });
};

//通过车辆id集合获取车辆和驾驶员对应关系
const getCarAndDriverInfo = function (params) {
    // let data = creatData.getCarAndDriverInfo(params)
    // return new Promise(resolve=>{
    // 	resolve(data)
    // })
    return fetch({
        url: "/enterpriseGroup/getCarAndDriverInfo",
        method: "post",
        data: params,
    });
};
//获取实时轨迹点
const getLastGpsInfos = function (params) {
    return fetch({
        url: "/monitor/getLastGpsInfos",
        method: "post",
        data: params,
    });
};

//唤醒
const wakeUpSleepingDevice = function (params) {
    return fetch({
        url: "/monitor/wakeUpSleepingDevice",
        method: "post",
        data: params,
    });
};

//获取轨迹回放表头
const getTrackPlayBackHead = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/monitor/getTrackPlayBackPersonaliseSet",
        method: "post",
        data: params,
    });
};
//添加轨迹回放表头
const addTrackPlayBackHead = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/monitor/addTrackPlayBackPersonaliseSet",
        method: "post",
        data: params,
    });
};
//更新轨迹回放表头
const updateTrackPlayBackHead = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/monitor/updateTrackPlayBackPersonaliseSet",
        method: "post",
        data: params,
    });
};
//获取监控组中绑定的监控员
const getBindUser = function (params) {
    return fetch({
        // headers:{"Content-Type":"application/json"},
        url: "/monitoringGroup/getBindUser",
        method: "post",
        data: params,
    });
};
//获取监控组
const getGroupPage = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/monitoringGroup/getGroupPage",
        method: "post",
        data: params,
    });
};
// 新增监控组
const addMonitorGroup = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/monitoringGroup/addGroup",
        method: "post",
        data: params,
    });
};
// 编辑监控组
const editMonitorGroup = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/monitoringGroup/editGroup",
        method: "post",
        data: params,
    });
};
// 删除监控组
const delMonitorGroup = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/monitoringGroup/deleteGroup",
        method: "post",
        data: params,
    });
};
// 批量删除监控组
const delMonitorGroupList = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/monitoringGroup/deleteGroupList",
        method: "post",
        data: params,
    });
};
// 获取全部监控组数据
const getAllGroupList = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/monitoringGroup/getGroupList",
        method: "post",
        data: params,
    });
};

//根据车辆id和能力集获取设备
const getDeviceInfoByCarId = function (params) {
    return fetch({
    	url: '/video/getDeviceInfoByCarId',
    	method: 'post',
    	data: params
    });
};
/**
 * 获取登录日志列表
 * @param params
 */
const getPreviewUrl = function (params) {
    return fetch({
        url: "/video/getPreviewUrl",
        method: "post",
        data: params,
    });
    // return Promise.resolve({
    //     code: "success",
    //     data: "wss://ws.hikvisionauto.com:10650/JT808_11122331111_1_1_uuid=372F3DE8-7AB9-4043-A17C-D8D39EB8539_realplay",
    //     msg: "",
    //     success: true,
    // });
};

const monitorApiList = {
    // getTrackPlayBackPersonaliseSet,
    urlgetMultiFileVideoDownloadUrl,
    comparePluginVersion,
    getPluginVersion,
    // getEnterpriseTreeCarList,
    getVideoDownloadUrl,
    getMonitorBroadcastUrl,
    screenShots,
    screenShotsList,
    getPreviewUrl,
    getVideoList,
    getMonitorEleFenceList,
    getVoiceList,
    getPicList,
    // getGpsList,
    getGpsListByCarId,
    getLastGpsInfo,
    getIntercomUrl,
    getListenUrl,
    lockCar,
    rebootCar,
    callback,
    startTrackTrajectory,
    getCarLocationByCarIds,
    // getCarListByCarIds,
    // getSystemDefaultRegion,
    getCarListFromDefaultRegion,
    // getCarCountFromDefaultRegion,
    getTempGroupList,
    getPicUrlByPicId,
    getVoiceUrl,
    getPlayBackUrl,
    addTempGroup,
    editTempGroup,
    deleteTempGroup,
    // getBusinessList,
    // addCarIntoTempGroup,
    deleteCarFromTempGroup,
    getTempGroupCarPageInfo,
    getDriverInfoVoByCarId,
    getDeviceInfoByCarId,
    getSleepByDeevicecode,
    findRegionAndEnterpriseTree,
    // deviceFileUpLoad,
    // getDeviceChannelTree,
    getPreviewUrlByChannelId,
    getCarStatusCount,
    getCarInfoByCarIdMonitor,
    getDriverListByCarId,
    findPassingCar,
    getCarGpsShadowList,
    exportCarListGpsShadow,
    getCarAndDriverInfo,
    getDeviceListByCarId,
    getLastGpsInfoByCarId,
    getLastGpsInfos,
    wakeUpSleepingDevice,
    getTrackPlayBackHead,
    addTrackPlayBackHead,
    updateTrackPlayBackHead,
    getMultiFileVideoDownloadValue,
    getBindUser,
    getGroupPage,
    addMonitorGroup,
    editMonitorGroup,
    delMonitorGroup,
    delMonitorGroupList,
    getAllGroupList,
    /*  monitor end    */
};

export default monitorApiList;
