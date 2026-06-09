import fetch from "@/utils/fetch";

//获取某段轨迹车辆信息
const getGpsTrackPage = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/trackPlayback/getGpsTrackPage",
        method: "post",
        data: params,
    });
};

//获取表头信息
const getTableConfig = function (params) {
    return fetch({
        url: "/tableConfig/getTableConfig",
        method: "post",
        data: params,
    });
};

//设置表头信息
const updateTableConfig = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/tableConfig/updateTableConfig",
        method: "post",
        data: params,
    });
};

//获取GPS轨迹枚举
//type状态常量值：1、定位点过滤；2、定位类型；3、上传类型；4、Acc状态
const getGpsTrackEnum = function (params) {
    return fetch({
        url: "/trackPlayback/getGpsTrackEnum",
        method: "post",
        data: params,
    });
};

//导出GPS轨迹信息
const exportGpsTrack = function (params) {
    return fetch({
        headers: { "Content-Type": "application/json" },
        url: "/trackPlayback/exportGpsTrack",
        method: "post",
        data: params,
    });
};
//获取车辆上线时间
const getOnlineDateByDeviceCode = function (params) {
    return fetch({
        url: "/trackPlayback/getOnlineDateByDeviceCode",
        method: "post",
        data: params,
    });
};
const historyPlaybackApiList = {
    getGpsTrackPage,
    getTableConfig,
    updateTableConfig,
    getGpsTrackEnum,
    exportGpsTrack,
    getOnlineDateByDeviceCode,
};

export default historyPlaybackApiList;
