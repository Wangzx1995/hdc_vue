import fetch from "@/utils/fetch";

/**
 * 查询用户设置的安装审核验收单
 * @param data
 */
const getInstallCheckSettingByUser = function (data) {
    return fetch({
        url: "/deviceInstallCheck/getInstallCheckSettingByUser",
        method: "post",
        data,
    });
};

/**
 * 查询所有安装审核验收项
 */
const getAllInstallCheckStandard = function (data) {
    return fetch({
        url: "/deviceInstallCheck/getAllInstallCheckStandard",
        method: "post",
        data,
    });
};
/**
 * 获取当前账户下所有的项目
 */
const getPlatformUserProject = function(params){
  return fetch({
    url: "/user/getPlatformUserProject",
    method: "post",
    data:params,
});
}
/**
 * 保存用户设置的安装审核验收单
 */
const updateUserInstallCheckSetting = function (data) {
    return fetch({
        url: "/deviceInstallCheck/updateUserInstallCheckSetting",
        method: "post",
        data,
    });
};

const alarmManageApiList = {
    getInstallCheckSettingByUser,
    getAllInstallCheckStandard,
    getPlatformUserProject,
    updateUserInstallCheckSetting,
};

export default alarmManageApiList;
