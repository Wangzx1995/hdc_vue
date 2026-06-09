import fetch from "@/utils/fetch";

/**
 * 用户搜索下拉
 * @param areaDto
 */
const wifiConfigUserList = function (params) {
    return fetch({
        url: "/wifiConfig/userList",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 添加wifi配置
 * @param areaDto
 */
const wifiConfigAdd = function (params) {
    return fetch({
        url: "/wifiConfig/add",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * wifi分页查询
 * @param areaDto
 */
const wifiConfigPage = function (params) {
    return fetch({
        url: "/wifiConfig/page",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 修改wifi配置
 * @param areaDto
 */
const wifiConfigUpdate = function (params) {
    return fetch({
        url: "/wifiConfig/update",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 删除wifi配置
 * @param areaDto
 */
const wifiConfigDelete = function (params) {
    return fetch({
        url: "/wifiConfig/delete",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
const alarmManageApiList = {
    wifiConfigUserList,
    wifiConfigAdd,
    wifiConfigPage,
    wifiConfigUpdate,
    wifiConfigDelete,
};

export default alarmManageApiList;
