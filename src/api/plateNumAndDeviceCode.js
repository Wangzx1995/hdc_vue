import fetch from "@/utils/fetch";

/**
 * 获取表格数据
 * @param params
 */
const getTableData = (params) => {
    return fetch({
        url: "/deviceAbnormal/page",
        method: "post",
        data: params,
    });
};
/**
 * 获取异常数量
 * @param params
 */
const getAbnormalNum = (params) => {
    return fetch({
        url: "/deviceAbnormal/countAbnormal",
        method: "post",
        data: params,
    });
};
/**
 * 查询组织选项
 * @param params
 */
const getOrgTree = (params) => {
    return fetch({
        url: "/deviceAbnormal/getOrgTree",
        method: "post",
        data: params,
    });
};
/**
 * 导出功能
 * @param params
 */
const exportDeviceData = (params) => {
    return fetch({
        url: "/deviceAbnormal/exportDeviceDataAbnormal",
        method: "post",
        data: params,
    });
};
/**
 * 设备序列号批量修改值
 * @param params
 */
const batchUpdateDataAbnormal = (ids) => {
    return fetch({
        url: "/deviceAbnormal/batchUpdateDataAbnormal",
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(ids),
    });
};
/**
 * 设备序列号批量修改值
 * @param params
 */
const updateDataAbnormal = (params) => {
    return fetch({
        url: "/deviceAbnormal/updateDataAbnormal",
        method: "post",
        data: params,
    });
};

/**
 * 车牌号批量修改值
 * @param params
 */
const batchUpdatePlateDataAbnormal = (ids) => {
    return fetch({
        url: "/deviceAbnormal/batchUpdatePlateDataAbnormal",
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(ids),
    });
};
const plateNumAndDeviceCodeApi = {
    getTableData,
    getAbnormalNum,
    getOrgTree,
    exportDeviceData,
    batchUpdateDataAbnormal,
    updateDataAbnormal,
    batchUpdatePlateDataAbnormal,
};

export default plateNumAndDeviceCodeApi;
