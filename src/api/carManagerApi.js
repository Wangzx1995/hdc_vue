/**
 * Created by 黄澄 on 2022/8/9.
 */
import fetch from "@/utils/fetch";

/**
 * 获取列表
 * @param params
 */
const getCarManagerPage = function (params) {
    return fetch({
        url: "/carManage/page",
        method: "post",
        data: params,
    });
};

// 获取车牌颜色列表
const getPlateColorList = function (params) {
    return fetch({
        url: "/carManage/plateColorList",
        method: "post",
        data: params,
    });
};
// 获取车牌颜色列表
const getCarTypeList = function (params) {
    return fetch({
        url: "/carManage/carType",
        method: "post",
        data: params,
    });
};
/**
 * 删除设备
 * @param ids
 */
const deleteCarInfos = function (params) {
    return fetch({
        url: "/carManage/delete",
        method: "DELETE",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 获取车辆详情
 * @param params
 */
const getCarDetails = function (params) {
    return fetch({
        url: "/carManage/details",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 添加车辆
 * @param params
 */
const addCarInfo = function (params) {
    return fetch({
        url: "/carManage/add",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 编辑车辆
 * @param params
 */
const editCarInfo = function (params) {
    return fetch({
        url: "/carManage/modify",
        method: "put",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * 获取车辆导入模板
 */
const generateCarTemplate = function (data) {
    return fetch({
        url: "/carManage/generateTemplate",
        method: "post",
        data: { templateCode: "carInfoImport", ...data },
    });
};
/**
 * 导出车辆
 * @param
 */
const doExportCar = function (params) {
    return fetch({
        url: "/carManage/export",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 移动车辆组织绑定关系
 */
const changeCarOrg = function (params) {
    return fetch({
        url: "/carManage/changeCarOrg",
        method: "put",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 校验用户是否有删除按钮权限
 */
const checkDeleteButtonEnable = function () {
    return fetch({
        url: "/carManage/checkDeleteButtonEnable",
        method: "get",
    });
};

//导出 导入失败的结果
const exportImportResult = function (params) {
    return fetch({
        url: "/carManage/exportImportResult",
        method: "post",
        data: params,
    });
};

//导出 导入失败的结果
const getOrganizeById = function (params) {
    return fetch({
        url: "/org/getOrganizeById",
        method: "post",
        data: params,
    });
};
const carManagerApiList = {
    getCarManagerPage,
    getPlateColorList,
    getCarTypeList,
    deleteCarInfos,
    getCarDetails, // 车辆详情
    addCarInfo, //添加车辆
    editCarInfo, //修改车辆
    generateCarTemplate, //导入车辆模板
    doExportCar, //导出车辆
    changeCarOrg, //移动车辆
    checkDeleteButtonEnable,
    exportImportResult,
    getOrganizeById,
};

export default carManagerApiList;
