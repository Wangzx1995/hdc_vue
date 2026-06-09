import fetch from "@/utils/fetch";
import qs from "qs";

/**
 * 注册
 * @params username,password,email
 */
const register = (username, password, email) => {
    return fetch({
        url: "/user/register",
        method: "post",
        data: {
            username,
            password,
            email,
        },
    });
};
/**
 * token免登录
 * @params
 */
const LoginWithToken = (userDto) => {
    return fetch({
        url: "/login/loginWithToken",
        method: "post",
        data: JSON.parse(JSON.stringify(userDto)),
    });
};
/**
 * 跳转至车辆平台
 * @params
 */
const getJknRedirectUrl = (userDto) => {
    return fetch({
        url: "/jkn/getJknRedirectUrl",
        method: "post",
        data: userDto,
    });
};
/**
 * 跳转至车辆平台
 * @params
 */
const checkIconShow = (userDto) => {
    return fetch({
        url: "/jkn/checkIconShow",
        method: "post",
        data: userDto,
    });
};
/**
 * 获取车辆授权数提醒
 * @params
 */
const getOverdueInfo = function (params) {
    return fetch({
        url: "/jkn/getOverdueInfo",
        method: "post",
        data: params,
    });
};
/**
 * 登录
 * @params username,password
 */
const login = (username, password, veryCode) => {
    return fetch({
        url: "/login/login",
        method: "post",
        data: {
            username,
            password,
            veryCode,
        },
    });
};
/**
 * 登录
 * @params username,password
 */
const technicalSupportEngineerLogin = (params) => {
    return fetch({
        url: "/login/technicalSupportEngineerLogin",
        method: "post",
        data: params,
    });
};
/**
 * 登录
 * @params username,password
 */
const validateOverdueWithoutLogin = (params) => {
    return fetch({
        url: "/login/validateOverdueWithoutLogin",
        method: "post",
        data: params,
    });
};
const checkNeedVeryCode = () => {
    return fetch({
        url: "/login/isNeedVeryCode",
        method: "post",
    });
};

/**
 * 基础系统设置
 */
const basicSettings = function () {
    return fetch({
        url: "/sys/basicSettings",
        method: "get",
    });
};

/**
 * 获取公告code（登录前）
 */
const getNotice = function (params) {
    return fetch({
        url:
            "/sys/getNotice?" + qs.stringify(params, { arrayFormat: "repeat" }),
        method: "get",
    });
};
/**
 * 获取公告code（登录后）
 */
const getUpgrade = function (params) {
    return fetch({
        url:
            "/sys/getUpgrade?" +
            qs.stringify(params, { arrayFormat: "repeat" }),
        method: "get",
    });
};
/**
 * 获取通知List（登录前）upgradeNotice
 */
const getNoticeList = function (params) {
    return fetch({
        url:
            "/sys/getNoticeList?" +
            qs.stringify(params, { arrayFormat: "repeat" }),
        method: "get",
    });
};
/**
 * 设备升级锁定任务提示框
 */
const devUpgradeForceApplyInfo = function (params) {
    return fetch({
        url: "/upgradeTask/devUpgradeForceApplyInfo",
        method: "post",
        data: params,
    });
};
/**
 * 升级任务提示关闭-当日不再提示
 */
const closeDevUpgradeForceApplyInfo = function (params) {
    return fetch({
        url: "/upgradeTask/closeDevUpgradeForceApplyInfo",
        method: "post",
        data: params,
    });
};
/**
 * 获取更新通告（登录后）
 */
const getUpgradeList = function (params) {
    return fetch({
        url:
            "/sys/getUpgradeList?" +
            qs.stringify(params, { arrayFormat: "repeat" }),
        method: "get",
    });
};

/**
 * 登出
 */
const logout = (params) => {
    return fetch({
        url: "/login/logout",
        method: "post",
        data: params,
    });
};

/**
 * 获取用户信息
 * @params token
 */
const getUserInfo = (params) => {
    return fetch({
        url: "/user/getLoginUserInfo",
        method: "post",
        data: params,
    });
};

const getHdcUserInfo = (params) => {
    return fetch({
        url: "/user/getHdcUserInfo",
        method: "post",
        data: params,
    });
};

const setHdcUserInfoNeedRemind = function () {
    return fetch({
        url: "/user/setHdcUserInfoNeedRemind",
        method: "post",
    });
};
const setIgnoreHdcUserPwd = function () {
    return fetch({
        url: "/user/setIgnoreHdcUserPwd",
        method: "post",
    });
};
const setHdcUserPwd = function (pwd) {
    return fetch({
        url: "/user/setHdcUserPwd",
        method: "post",
        data: pwd,
    });
};

/**
 * 获取用户菜单
 * @params token
 */
const getUserMenus = (params) => {
    return fetch({
        url: "/menu/list",
        method: "post",
        data: params,
    });
};
/**
 * 获取用户列表
 * @param params
 */
const getUserPage = function (params) {
    return fetch({
        url: "/user/page",
        method: "post",
        data: params,
    });
};
//当前用户是否为平台用户
const getIsYWService = function (params) {
    return fetch({
        url: "/user/getIsYWService",
        method: "post",
        data: params,
    });
};

//当前编辑用户的详情
const getUserDetail = function (id) {
    return fetch({
        url: "/user/getUserDetail",
        method: "post",
        data: {
            id: id,
        },
    });
};

/**
 * 获取当前登录用户能操作的角色列表
 */
const getRoleList = function () {
    return fetch({
        url: "/role/getRoleList",
        method: "post",
        data: {},
    });
};
/**
 * 删除用户
 * @param ids
 */
const deleteUser = function (params) {
    return fetch({
        url: "/user/deleteUser",
        method: "post",
        data: params,
    });
};

/**
 * 重置密码
 * @param ids
 */
const resetPassword = function (passwordForm) {
    return fetch({
        url: "/user/resetPassword",
        method: "post",
        data: passwordForm,
    });
};
/**
 * 管理员重置子用户密码
 * @param ids
 */
const resetChildPassword = function (passwordForm) {
    return fetch({
        url: "/user/resetChildPassword",
        method: "post",
        data: passwordForm,
    });
};
/**
 * 更新公告
 * @param
 */
const getIsUpgrading = function (params) {
    return fetch({
        url: "/sys/isUpgrading",
        method: "post",
        data: params,
    });
};
/**
 * 修改密码
 * @param ids
 */
const updatePassword = function (passwordForm) {
    return fetch({
        url: "/user/updatePassword",
        method: "post",
        data: passwordForm,
    });
};
/**
 * 修改用户名
 */
const updateName = function (params) {
    return fetch({
        url: "/user/updateName",
        method: "post",
        data: params,
    });
};
/**
 * 验证密码强度
 * @param ids
 */
const checkPwdLevel = function (passwordForm) {
    return fetch({
        url: "/checkPwd/level ",
        method: "post",
        data: passwordForm,
    });
};
/**
 * 首次登录强制用户修改密码
 * @param ids
 */
const updateFirstPassword = function (passwordForm) {
    return fetch({
        url: "/user/updateFirstPassword",
        method: "post",
        data: passwordForm,
    });
};

/**
 * 添加用户
 * @param ids
 */
const addUser = function (userDto) {
    return fetch({
        url: "/user/addUser",
        method: "post",
        data: userDto,
    });
};
/**
 * 更新用户
 * @param ids
 */
const updateUser = function (userDto) {
    return fetch({
        url: "/user/updateUser",
        method: "post",
        data: userDto,
    });
};
/**
 * 角色列表
 * @param ids
 */
const getRolePage = function (roleDto) {
    return fetch({
        url: "/role/page",
        method: "post",
        data: roleDto,
    });
};
/**
 * 添加角色
 * @param roleDto
 */
const addRole = function (roleDto) {
    return fetch({
        url: "/role/add",
        method: "post",
        data: roleDto,
    });
};
/**
 * 更新角色
 * @param roleDto
 */
const updateRole = function (roleDto) {
    return fetch({
        url: "/role/update",
        method: "post",
        data: roleDto,
    });
};
/**
 * 删除角色
 * @param roleDto
 */
const deleteRole = function (roleIds) {
    return fetch({
        url: "/role/delete",
        method: "post",
        data: {
            roleIds: roleIds,
        },
    });
};
/**
 * 获取模块菜单
 * @param roleDto
 */
const getAllModelList = function () {
    return fetch({
        url: "/model/allModelList",
        method: "post",
    });
};
/**
 * 获取模块菜单
 * @param roleDto
 */
const getAllAppPermissionsInfoList = function () {
    return fetch({
        url: "/role/getAllAppPermissionsInfoList",
        method: "post",
    });
};

/**
 * 保存模块菜单
 * @param roleDto
 */
const saveModelList = function (roleId, modelIds) {
    return fetch({
        url: "/model/saveModelList",
        method: "post",
        data: {
            roleId: roleId,
            modelIds: modelIds,
        },
    });
};

/**
 * 获取上传文件的地址和相关参数
 * @param businessType
 */
const getFileUploadInfo = function (businessType) {
    return fetch({
        url: "/OSS/getFileUploadInfo",
        method: "post",
        data: { businessType: businessType },
    });
};
/**
 * 获取上传文件的地址和相关参数
 * @param businessType
 */
const getFileUploadInfoByOriginalFileName = function (params) {
    return fetch({
        url: "/OSS/getFileUploadInfoByOriginalFileName",
        method: "post",
        data: params,
    });
};
/**
 * 上传EXCEL
 * @param businessType
 */
const uploadExcel = function (formData) {
    return fetch({
        url: "/fileUpload",
        method: "post",
        data: formData,
    });
};
/**
 * 获取上传进度
 * @param businessType
 */
const getImportResult = function (batchCode, currentPage, pageSize) {
    return fetch({
        url: "/import/getImportResult",
        method: "post",
        data: {
            batchCode: batchCode,
            currentPage: currentPage,
            pageSize: pageSize,
        },
    });
};

/**
 * getSysInfoValue
 * @param businessType
 */
const getSysInfoValue = function (params) {
    return fetch({
        url: "/sys/getSysValue",
        method: "post",
        data: params,
    });
};
/**
 * getSysInfoValue
 * @param businessType
 */
const updateSysValue = function (params) {
    return fetch({
        url: "/sys/updateSysValue",
        method: "post",
        data: params,
    });
};
/**
 * 批量根据系统设置表参数名获取参数值
 * getSysInfoValues
 * @param businessType
 */
const getSysInfoValues = function (params) {
    return fetch({
        url: "/sys/getSysValues",
        method: "post",
        data: { parameterNames: params },
    });
};
/**
 * 批量修改系统设置
 * getSysInfoValues
 * @param businessType
 */
const updateSysValues = function (params) {
    return fetch({
        url: "/sys/updateDeviceUpgradeSysInfo",
        method: "post",
        data: params,
    });
};
/**
 * 查询导出是否结束
 * @param params
 */
const isExportFinished = function (fileName) {
    return fetch({
        url: "/export/isFinished",
        method: "post",
        data: {
            fileName: fileName,
        },
    });
};
/**
 * 设置开关型的APP权限
 */
const setAppPermission = function (params) {
    return fetch({
        url: "/role/setAppPermission",
        method: "post",
        data: params,
    });
};
/**
 * 设置通道型的APP权限
 */
const setAppPermissionWithChannelNoList = function (params) {
    return fetch({
        url: "/role/setAppPermissionWithChannelNoList",
        method: "post",
        data: params,
    });
};
/**
 * 获取对应角色中的资源权限
 */
const getRoleResources = function (roleId) {
    return fetch({
        url: "/role/getRoleResources",
        method: "post",
        data: {
            roleId: roleId,
        },
    });
};
const getAppPermissionByRoleId = function (roleId) {
    return fetch({
        url: "/role/getAppPermissionByRoleId",
        method: "post",
        data: {
            roleId: roleId,
        },
    });
};
/**
 * 获取短信验证码
 */
const getPhoneVeryCode = function (phone) {
    return fetch({
        url: "/login/getPhoneVeryCode",
        method: "post",
        data: {
            phone: phone,
        },
    });
};
/**
 * 短信验证码登录
 */
const loginWithPhone = function (phone, veryCode, username) {
    return fetch({
        url: "/login/loginWithPhone",
        method: "post",
        data: { phone: phone, veryCode: veryCode, username: username },
    });
};
const createQRCode = function () {
    return fetch({
        url: "/qrCode/createQRCode",
        method: "post",
    });
};
const checkQRCodeStatus = function (uuid) {
    return fetch({
        url: "/qrCode/checkQRCodeStatus",
        method: "post",
        data: { uuid: uuid },
    });
};
const QRCodeLogin = function (uuid) {
    return fetch({
        url: "/login/QRCodeLogin",
        method: "post",
        data: { qrCodeLoginToken: uuid },
    });
};
const cancelQrLogin = function (uuid) {
    return fetch({
        url: "/qrCode/cancelQrLogin",
        method: "post",
        data: { uuid: uuid },
    });
};
/**
 * 获取修改密码短信验证码
 */
const getPasswordPhoneVeryCode = function (phone) {
    return fetch({
        url: "/login/getPasswordPhoneVeryCode",
        method: "post",
        data: {
            phone: phone,
        },
    });
};
const resetPasswordWithVeryCode = function (data) {
    return fetch({
        url: "/login/resetPasswordWithVeryCode",
        method: "post",
        data: data,
    });
};
const getGroupNodesByUserId = function (userId) {
    return fetch({
        url: "/user/getGroupNodesByUserId",
        method: "post",
        data: { userId: userId },
    });
};
const getAppDownloadImg = function () {
    return fetch({
        url: "/login/getAppDownloadImg",
        method: "post",
    });
};

const getDictByType = function (type) {
    return fetch({
        url: "/sys/dict/find/type",
        method: "post",
        data: { type: type },
    });
};

// 用户管理-添加用户-树
const getAllOrganizeTree = function (userId) {
    return fetch({
        url: "/user/getAllOrganizeTree",
        method: "post",
        data: { userId: userId },
    });
};
// 多项目选择
const getUserProject = function (phone, veryCode, veryType) {
    return fetch({
        url: "/user/getUserProject",
        method: "post",
        data: { phone: phone, veryCode: veryCode, veryType: veryType },
    });
};
// 修改手机号验证码
const getModifyPhoneVeryCode = function (phone) {
    return fetch({
        url: "/user/getModifyPhoneVeryCode",
        method: "post",
        data: { phone: phone },
    });
};
//修改手机号
const updatePhone = function (params) {
    return fetch({
        url: "/user/updatePhone",
        method: "post",
        data: params,
    });
};
//修改手机号
const getUserTypeInfo = function (params) {
    return fetch({
        url: "/user/getUserTypeInfo",
        method: "post",
        data: params,
    });
};
//
const getFirmwareVersion = function (params) {
    return fetch({
        url: "/upgrade/getFirmwareVersion",
        method: "post",
        data: params,
    });
};
/**
 * 获取调查问卷地址
 */
const getQuestionnaireSurveyUrl = function (params) {
    return fetch({
        url: "/common/getQuestionnaireSurveyUrl",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 获取常见问题地址
 */
const getFAQUrl = function (params) {
    return fetch({
        url: "/common/getFAQUrl",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 获取字典项显示列表
 */
const getDictionList = function (params) {
    return fetch({
        url: "/common/getDictionList",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 右上角编辑用户信息
 */
const updateUserName = function (params) {
    return fetch({
        url: "/user/updateUserName",
        method: "post",
        data: params,
    });
};
/**
 * 获取常见问题地址
 */
const getLastLoginIpInfo = function () {
    return fetch({
        url: "/common/getLastLoginIpInfo",
        method: "get",
    });
};
/**
 * 获取当前用户的APP权限
 */
const getLoginUserAppPermission = function () {
    return fetch({
        url: "/role/getLoginUserAppPermission",
        method: "get",
    });
};

const checkUserTypeWhetherVMP = function () {
    return fetch({
        url: "/user/checkUserTypeWhetherVMP",
        method: "get",
    });
};
const getPhoneNoByUserName = function (data) {
    return fetch({
        url: "/login/getPhoneNoByUserName",
        method: "post",
        data: data,
    });
};

/**
 * 埋点触发
 */
const eventTrackTrigger = function (params) {
    return fetch({
        url: "/eventTrack/eventTrackTrigger",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
/**
 * 根据roleId获取APP菜单权限（web使用）
 */
const newAppPermissionByRoleId = function (params) {
    return fetch({
        url: "/role/newAppPermissionByRoleId",
        method: "get",
        params: params,
    });
};
/**
 * 根据roleId获取APP菜单权限（web使用）
 */
const newLoginUserAppPermission = function (params) {
    return fetch({
        url: "/role/newLoginUserAppPermission",
        method: "get",
        data: params,
    });
};

const getAiChatApplicationUrl = function (params) {
    return fetch({
        url: `/common/getAiChatApplicationUrl`,
        method: "get",
        data: params,
    });
};
/**
 * 获取定向卡配置pdf信息文档URL地址
 */
const getSimCardPdfUrl = function (params) {
    return fetch({
        url: "/common/getSimCardPdfUrl",
        method: "get",
        data: params,
    });
};
const mapGet = function (params) {
    return fetch({
        url: "/common/get",
        method: "post",
        data: params,
    });
};
const mapSet = function (params) {
    return fetch({
        url: `/common/set?value=${params}`,
        method: "post",
    });
};
const apiList = {
    getSimCardPdfUrl,
    getAiChatApplicationUrl,
    mapGet,
    mapSet,
    newAppPermissionByRoleId,
    newLoginUserAppPermission,
    eventTrackTrigger,
    getPhoneNoByUserName,
    checkUserTypeWhetherVMP,
    getLoginUserAppPermission,
    getLastLoginIpInfo,
    getDictionList,
    updateUserName,
    getFAQUrl,
    getQuestionnaireSurveyUrl,
    getFirmwareVersion,
    getModifyPhoneVeryCode,
    updatePhone,
    getUserProject,
    getFileUploadInfoByOriginalFileName,
    register,
    login,
    logout,
    checkNeedVeryCode,
    LoginWithToken,
    getJknRedirectUrl,
    checkIconShow,
    getOverdueInfo,
    basicSettings, //基础配置
    getNotice, //获取公告code(登录前)
    getUpgrade, //获取公告code(登录后)
    getNoticeList, //获取通知List(登录前)
    getUpgradeList, //获取更新通告(登录后)
    devUpgradeForceApplyInfo,
    closeDevUpgradeForceApplyInfo,
    //用户与角色
    getUserInfo,
    getUserMenus,
    getUserPage,
    getIsYWService,
    resetPassword,
    resetChildPassword,
    updatePassword,
    getIsUpgrading,
    checkPwdLevel,
    getUserDetail,
    getRoleList,
    deleteUser,
    updateUser,
    addUser,
    getRolePage,
    addRole,
    updateRole,
    deleteRole,
    getAllModelList,
    saveModelList,
    //获取文件上传路径和参数
    getFileUploadInfo,
    uploadExcel,
    getImportResult,
    //获取系统参数
    getSysInfoValue,
    updateSysValue,
    isExportFinished,
    updateFirstPassword,
    getSysInfoValues,
    updateSysValues,
    getRoleResources,
    getAllAppPermissionsInfoList,
    setAppPermission,
    setAppPermissionWithChannelNoList,
    getAppPermissionByRoleId,
    getPhoneVeryCode,
    loginWithPhone,
    createQRCode,
    checkQRCodeStatus,
    QRCodeLogin,
    cancelQrLogin,
    getPasswordPhoneVeryCode,
    resetPasswordWithVeryCode,
    getGroupNodesByUserId,
    getHdcUserInfo,
    setHdcUserInfoNeedRemind,
    setIgnoreHdcUserPwd,
    setHdcUserPwd,
    getAppDownloadImg,
    getDictByType,
    getAllOrganizeTree,
    updateName,
    getUserTypeInfo,
    validateOverdueWithoutLogin,
    technicalSupportEngineerLogin,
};

export default apiList;
