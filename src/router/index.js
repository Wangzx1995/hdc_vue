//import Vue from "vue";
import Vue from "vue/dist/vue.esm.js";
import Router from "vue-router";
const _import = require("./_import_" + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router);
// const Router = require('vue-router')

//添加以下代码
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, resolve, reject) {
    //调用保存的push方法
    //但是保存的push方法是挂载在window的方法 所以要通过call修改this的指向
    if (resolve && reject) {
        originalPush.call(this, location, resolve, reject);
    } else {
        originalPush.call(
            this,
            location,
            () => {},
            () => {}
        );
    }
};

/* layout */
import Layout from "../views/layout/layout";
import emptyCom from "../views/layout/emptyCom";

// import DeviceManage from '../views/equipmentOperation/deviceManage';

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will not redirct in the levelbar
 * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
 * meta : `{ role: ['admin', 'editor'] }`  will control the page role
 **/
export const constantRouterMap = [
    {
        path: "/deepseek",
        component: _import("deepseek/deepseek"),
        hidden: true,
    },
    { path: "/login", component: _import("login/login"), hidden: true },
    {
        path: "/adminLogin",
        component: _import("login/technicalSupportEngineerLogin"),
        hidden: true,
    },
    {
        //忘记密码
        path: "/forgetPassword",
        component: _import("login/forgetPassword"),
        hidden: true,
    },
    {
        //修改密码
        path: "/modifyPwd",
        component: _import("sysManage/password"),
        hidden: true,
    },
    {
        //单页面登录
        path: "/signOnPage",
        component: _import("sysManage/signOnPage"),
        hidden: true,
    },
    { path: "/404", component: _import("404"), hidden: true },
    {
        path: "/privacyPolicy",
        component: _import("agreement/privacyPolicy"),
        hidden: true,
    },
    {
        path: "/serviceAgreement",
        component: _import("agreement/serviceAgreement"),
        hidden: true,
    },
    {
        path: "/personalInfo",
        component: _import("agreement/personalInfo"),
        hidden: true,
    },
    {
        path: "/",
        component: Layout,
        redirect: "/dashboard",
        icon: "ivu-icon ivu-icon-ios-home",
        name: "首页",
        noDropdown: true,
        hidden: false,
        children: [
            {
                path: "/dashboard",
                component: _import("dashboard/dashboard"),
                hidden: true,
            },
        ],
    },
    // {
    //     path: "/1",
    //     component: Layout,
    //     redirect: "noredirect",
    //     name: "",
    //     noDropdown: true,
    //     hidden: true,
    //     unshow: true,
    //     children: [
    //         // //WIFI前缀名称管理
    //         // {
    //         //     path: "/manageCenter/wifiManage",
    //         //     component: _import("manageCenter/wifiManage"),
    //         //     meta: { title: "" },
    //         //     hidden: true,
    //         // },
    //         // //车辆管理
    //         // {
    //         //     path: "/manageCenter/carManage",
    //         //     component: _import("manageCenter/carManage"),
    //         //     name: "carManage",
    //         //     meta: { title: "", keepAlive: false },
    //         //     hidden: true,
    //         // },
    //         // //设备管理
    //         // {
    //         //     path: "/manageCenter/deviceManage",
    //         //     component: _import("manageCenter/deviceManage"),
    //         //     hidden: true,
    //         // },
    //         // //管理中心-权限管理
    //         // {
    //         //     path: "/manageCenter/roleManage",
    //         //     component: _import("manageCenter/roleManage"),
    //         //     meta: { title: "" },
    //         //     hidden: true,
    //         // },
    //         // //用户管理
    //         // {
    //         //     path: "/manageCenter/userManage",
    //         //     component: _import("manageCenter/userManage"),
    //         //     meta: { title: "" },
    //         //     hidden: true,
    //         // },
    //         // //装车任务管理
    //         // {
    //         //     path: "/manageCenter/deviceLoadTaskManage",
    //         //     component: _import("manageCenter/deviceLoadTaskManage"),
    //         // },
    //         //装车任务管理 / 任务详情
    //         {
    //             path: "/manageCenter/deviceLoadTaskManage/deviceLoadTaskDetail",
    //             component: _import("manageCenter/deviceLoadTaskDetail"),
    //             hidden: true,
    //             meta: { title: "" },
    //         },
    //         // //装车报告审核
    //         // {
    //         //     path: "/manageCenter/deviceLoadReportVerify",
    //         //     component: _import("manageCenter/deviceLoadReportVerify"),
    //         //     meta: { title: "" },
    //         // },
    //         //装车报告审核 / 详情
    //         {
    //             path: "/manageCenter/deviceLoadReportVerify/deviceLoadReportVerifyDetail",
    //             component: _import("manageCenter/deviceLoadReportVerifyDetail"),
    //             hidden: true,
    //             meta: { title: "审核" },
    //         },
    //         // //车牌号/设备序列号异常统计
    //         // {
    //         //     path: "/manageCenter/plateNumAndDeviceCode",
    //         //     component: _import("manageCenter/plateNumAndDeviceCode"),
    //         //     meta: {},
    //         // },
    //         // //设备升级
    //         // {
    //         //     path: "/maintenanceCenter/deviceUpgrade",
    //         //     component: _import("maintenanceCenter/deviceUpgrade"),
    //         // },
    //         //设备升级 / 设备固件管理
    //         {
    //             path: "/maintenanceCenter/deviceUpgrade/firmware",
    //             component: _import("maintenanceCenter/firmware"),
    //             hidden: true,
    //             meta: { title: "设备固件管理" },
    //         },
    //         // //设备固件管理
    //         // {
    //         //     path: "/maintenanceCenter/firmware",
    //         //     component: _import("maintenanceCenter/firmware"),
    //         //     hidden: true,
    //         //     name: "设备固件管理",
    //         //     meta: { title: "" },
    //         // },
    //         //设备固件管理 / 小版本管理
    //         {
    //             path: "/maintenanceCenter/firmware/minorVersion",
    //             component: _import("maintenanceCenter/minorVersion"),
    //             hidden: true,
    //             meta: { title: "小版本管理" },
    //         },
    //         //设备升级 /设备固件管理 /小版本管理
    //         {
    //             path: "/maintenanceCenter/deviceUpgrade/firmware/minorVersion",
    //             component: _import("maintenanceCenter/minorVersion"),
    //             hidden: true,
    //             meta: { title: "小版本管理" },
    //         },
    //         //设备升级 / 我的升级任务
    //         {
    //             path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeTask",
    //             component: _import("maintenanceCenter/deviceUpgradeTask"),
    //             hidden: true,
    //             meta: { title: "" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeTask/deviceUpgradeTaskDetail",
    //             component: _import("maintenanceCenter/deviceUpgradeTaskDetail"),
    //             hidden: true,
    //             meta: { title: "详情" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeNoComplete",
    //             component: _import("maintenanceCenter/deviceUpgradeNoComplete"),
    //             hidden: true,
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceUpgrade/upgrade",
    //             component: _import("maintenanceCenter/upgrade"),
    //             hidden: true,
    //             meta: { title: "升级" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceUpgrade/history",
    //             component: _import("maintenanceCenter/history"),
    //             hidden: true,
    //             meta: { title: "升级历史" },
    //         },
    //         // //维护中心-配置
    //         // {
    //         //     path: "/maintenanceCenter/commonFirmware",
    //         //     component: _import("maintenanceCenter/commonFirmware"),
    //         //     hidden: true,
    //         // },
    //         // {
    //         //     path: "/maintenanceCenter/anomalyRemind",
    //         //     component: _import("maintenanceCenter/anomalyRemind"),
    //         //     hidden: true,
    //         // },
    //         // {
    //         //     path: "/maintenanceCenter/anomalyHandle",
    //         //     component: _import("maintenanceCenter/anomalyHandle"),
    //         //     hidden: true,
    //         // },
    //         // {
    //         //     path: "/maintenanceCenter/anomalyDetails",
    //         //     component: _import("maintenanceCenter/anomalyDetails"),
    //         //     hidden: true,
    //         //     meta: { title: "设备异常明细" },
    //         // },
    //         // {
    //         //     path: "/maintenanceCenter/anomalySummary",
    //         //     component: _import("maintenanceCenter/anomalySummary"),
    //         //     hidden: true,
    //         // },
    //         // {
    //         //     path: "/maintenanceCenter/maintainRecord",
    //         //     component: _import("maintenanceCenter/maintainRecord"),
    //         //     hidden: true,
    //         // },
    //         {
    //             path: "/maintenanceCenter/maintainRecord/maintainRecordDetail",
    //             component: _import("maintenanceCenter/maintainRecordDetail"),
    //             hidden: true,
    //             meta: { title: "详情" },
    //         },
    //         // {
    //         //     path: "/maintenanceCenter/maintainStatistic",
    //         //     component: _import("maintenanceCenter/maintainStatistic"),
    //         //     hidden: true,
    //         // },
    //         // {
    //         //     path: "/maintenanceCenter/scrapRemind",
    //         //     component: _import("maintenanceCenter/scrapRemind"),
    //         // },
    //         // {
    //         //     path: "/maintenanceCenter/parameterQuery",
    //         //     component: _import("maintenanceCenter/parameterQuery"),
    //         // },
    //         // {
    //         //     path: "/maintenanceCenter/deviceConfiguration",
    //         //     component: _import("maintenanceCenter/deviceConfiguration"),
    //         // },
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/configuration",
    //             component: _import("maintenanceCenter/configuration"),
    //             hidden: true,
    //             meta: { title: "配置" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/configurationDetail/agreementIndex",
    //             component: _import(
    //                 "maintenanceCenter/configurationDetail/agreementIndex"
    //             ),
    //             hidden: true,
    //             meta: { title: "协议配置" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/configurationDetail/bubiao",
    //             component: _import(
    //                 "maintenanceCenter/configurationDetail/agreementIndex"
    //             ),
    //             hidden: true,
    //             meta: { title: "部标配置" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/configurationDetail/fileIndex",
    //             component: _import(
    //                 "maintenanceCenter/configurationDetail/fileIndex"
    //             ),
    //             hidden: true,
    //             meta: { title: "文件配置" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/configurationDetail/privateProtocol",
    //             component: _import(
    //                 "maintenanceCenter/configurationDetail/privateProtocol"
    //             ),
    //             hidden: true,
    //             meta: { title: "协议配置" },
    //         },
    //         // {
    //         //     path: "/maintenanceCenter/configurationTemplate",
    //         //     component: _import("maintenanceCenter/configurationTemplate"),
    //         //     hidden: true,
    //         //     meta: { title: "" },
    //         // },
    //         {
    //             path: "/maintenanceCenter/configurationTemplate/editTemplate",
    //             component: _import("maintenanceCenter/editTemplate"),
    //             hidden: true,
    //             meta: { title: "编辑" },
    //         },
    //         {
    //             path: "/maintenanceCenter/configurationTemplate/protocolTemplate",
    //             component: _import(
    //                 "protocolConfiguration/components/protocolTemplate"
    //             ),
    //             hidden: true,
    //             meta: { title: "编辑" },
    //         },

    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/configurationView",
    //             component: _import("maintenanceCenter/configurationView"),
    //             hidden: true,
    //             meta: { title: "配置查看" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/configurationTask",
    //             component: _import("maintenanceCenter/configurationTask"),
    //             hidden: true,
    //             meta: { title: "我的配置任务" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/configurationTask/configurationTaskDetailNew",
    //             component: _import(
    //                 "maintenanceCenter/configurationTaskDetailNew"
    //             ),
    //             hidden: true,
    //             meta: { title: "详情" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/configurationTask/configurationTaskDetailNew/editTemplate",
    //             component: _import("maintenanceCenter/editTemplate"),
    //             hidden: true,
    //             meta: { title: "详情" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/showHistoryView",
    //             component: _import("maintenanceCenter/showHistoryView"),
    //             hidden: true,
    //             meta: { title: "历史" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/noConfiguration",
    //             component: _import("maintenanceCenter/noConfiguration"),
    //             hidden: true,
    //             meta: { title: "未完成配置" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/configurationView/configurationTaskDetail",
    //             component: _import("maintenanceCenter/configurationTaskDetail"),
    //             hidden: true,
    //             meta: { title: "详情" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/configurationView/configurationTTSDetail",
    //             component: _import("maintenanceCenter/configurationTTSDetail"),
    //             hidden: true,
    //             meta: { title: "详情" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/configuration/editTemplate",
    //             component: _import("maintenanceCenter/editTemplate"),
    //             hidden: true,
    //             meta: { title: "编辑" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/configuration/configurationTemplate",
    //             component: _import("maintenanceCenter/configurationTemplate"),
    //             hidden: true,
    //             meta: { title: "配置模板管理" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/configurationTemplate/editTemplate",
    //             component: _import("maintenanceCenter/editTemplate"),
    //             hidden: true,
    //             meta: { title: "编辑" },
    //         },
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/configurationTemplate/",
    //             component: _import("maintenanceCenter/configurationTemplate"),
    //             hidden: true,
    //             meta: { title: "" },
    //         },
    //         // {
    //         //     path: "/maintenanceCenter/ttsConfiguration",
    //         //     component: _import("maintenanceCenter/ttsConfiguration"),
    //         //     hidden: true,
    //         // },
    //         {
    //             path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationDetail",
    //             component: _import("maintenanceCenter/ttsConfigurationDetail"),
    //             hidden: true,
    //             meta: { title: "配置" },
    //         },
    //         {
    //             path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationView",
    //             component: _import("maintenanceCenter/ttsConfigurationView"),
    //             hidden: true,
    //             meta: { title: "配置查看" },
    //         },
    //         {
    //             path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationCustomize",
    //             component: _import(
    //                 "maintenanceCenter/ttsConfigurationCustomize"
    //             ),
    //             hidden: true,
    //             meta: { title: "自定义配置" },
    //         },
    //         {
    //             path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationTask",
    //             component: _import("maintenanceCenter/ttsConfigurationTask"),
    //             hidden: true,
    //         },
    //         {
    //             path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationTask/ttsConfigurationTaskDetail",
    //             component: _import(
    //                 "maintenanceCenter/ttsConfigurationTaskDetail"
    //             ),
    //             hidden: true,
    //         },
    //         {
    //             path: "/maintenanceCenter/ttsConfiguration/TTSshowHistoryView",
    //             component: _import("maintenanceCenter/TTSshowHistoryView"),
    //             hidden: true,
    //             meta: { title: "历史" },
    //         },
    //         {
    //             path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationNoView",
    //             component: _import("maintenanceCenter/ttsConfigurationNoView"),
    //             hidden: true,
    //             meta: { title: "未完成配置" },
    //         },
    //         // {
    //         //     path: "/maintenanceCenter/antIrotationNet",
    //         //     component: _import("maintenanceCenter/antIrotationNet"),
    //         //     hidden: true,
    //         //     meta: { title: "" },
    //         // },
    //         {
    //             path: "/maintenanceCenter/antIrotationNet/antIrotationNetTemplate",
    //             component: _import("maintenanceCenter/antIrotationNetTemplate"),
    //             hidden: true,
    //             meta: { title: "防转网模板管理" },
    //         },
    //         // //维护中心-检测
    //         // {
    //         //     path: "/maintenanceCenter/equipmentInspection",
    //         //     component: _import("maintenanceCenter/equipmentInspection"),
    //         //     hidden: true,
    //         // },
    //         {
    //             path: "/maintenanceCenter/equipmentInspection/equipmentInspectionHistory",
    //             component: _import(
    //                 "maintenanceCenter/equipmentInspectionHistory"
    //             ),
    //             hidden: true,
    //             meta: { title: "历史" },
    //         },
    //         // {
    //         //     path: "/maintenanceCenter/conditionMonitoring",
    //         //     component: _import("maintenanceCenter/conditionMonitoring"),
    //         //     hidden: true,
    //         // },
    //         // {
    //         //     path: "/maintenanceCenter/cardSwapRecord",
    //         //     component: _import("maintenanceCenter/cardSwapRecord"),
    //         //     hidden: true,
    //         //     meta: { title: "司机插拔卡记录" },
    //         // },
    //         // //维护中心-故障
    //         // {
    //         //     path: "/maintenanceCenter/handleFault",
    //         //     component: _import("maintenanceCenter/handleFault"),
    //         //     hidden: true,
    //         // },
    //         {
    //             path: "/maintenanceCenter/handleFault/handleFaultDetail",
    //             component: _import("maintenanceCenter/handleFaultDetail"),
    //             hidden: true,
    //             meta: { title: "详情" },
    //         },
    //         // {
    //         //     path: "/maintenanceCenter/faultAccount",
    //         //     component: _import("maintenanceCenter/faultAccount"),
    //         //     hidden: true,
    //         // },
    //         {
    //             path: "/maintenanceCenter/faultSubsidiary/faultAccount",
    //             component: _import("maintenanceCenter/faultAccount"),
    //             hidden: true,
    //             meta: { title: "详情" },
    //         },
    //         // {
    //         //     path: "/maintenanceCenter/faultSubsidiary",
    //         //     component: _import("maintenanceCenter/faultSubsidiary"),
    //         //     hidden: true,
    //         // },
    //         // {
    //         //     path: "/maintenanceCenter/faultTypeSubscribe",
    //         //     component: _import("maintenanceCenter/faultTypeSubscribe"),
    //         //     hidden: true,
    //         //     meta: { title: "待处理故障类型订阅" },
    //         // },
    //         // //联网考核-数据合格率统计
    //         // {
    //         //     path: "/reportCenter/qualifiedProbability",
    //         //     component: _import("reportCenter/qualifiedProbability"),
    //         //     hidden: true,
    //         // },
    //         {
    //             path: "/reportCenter/qualifiedProbability/carDetail",
    //             component: _import(
    //                 "reportCenter/qualifiedProbabilityCarDetail"
    //             ),
    //             hidden: true,
    //             meta: { title: "轨迹回放" },
    //         },
    //         // {
    //         //     path: "/reportCenter/trackIncompleteDetails",
    //         //     component: _import("reportCenter/trackIncompleteDetails"),
    //         //     hidden: true,
    //         //     meta: { title: "轨迹不完整明细" },
    //         // },
    //         // {
    //         //     path: "/reportCenter/netLink",
    //         //     component: _import("reportCenter/netLink"),
    //         //     hidden: true,
    //         //     meta: { title: "车辆入网率统计" },
    //         // },
    //         // //报表-设备健康状态
    //         // {
    //         //     path: "/reportCenter/deviceHealthCondition",
    //         //     component: _import("reportCenter/deviceHealthCondition"),
    //         //     hidden: true,
    //         // },
    //         // //联网考核-轨迹完整率统计
    //         // {
    //         //     path: "/reportCenter/vehicleTrackIntegrityRate",
    //         //     component: _import("reportCenter/vehicleTrackIntegrityRate"),
    //         //     hidden: true,
    //         //     meta: {},
    //         // },
    //         //轨迹回放
    //         {
    //             path: "/reportCenter/vehicleTrackIntegrityRate/carDetail",
    //             component: _import(
    //                 "reportCenter/vehicleTrackIntegrityRateCarDetail"
    //             ),
    //             hidden: true,
    //             meta: { title: "轨迹回放" },
    //         },
    //         // //联网考核-轨迹漂移率统计
    //         // {
    //         //     path: "/reportCenter/groundTrackDrifting",
    //         //     component: _import("reportCenter/groundTrackDrifting"),
    //         //     hidden: true,
    //         // },
    //         {
    //             path: "/reportCenter/groundTrackDrifting/carDetail",
    //             component: _import("reportCenter/groundTrackDriftingCarDetail"),
    //             hidden: true,
    //             meta: { title: "轨迹回放" },
    //         },
    //         {
    //             path: "/reportCenter/groundTrackDrifting/groundTrackDriftingDetail",
    //             component: _import("reportCenter/groundTrackDriftingDetail"),
    //             hidden: true,
    //             meta: { title: "轨迹漂移明细" },
    //         },
    //         // //联网考核-轨迹漂移明细
    //         // {
    //         //     path: "/reportCenter/slidingDrifting",
    //         //     component: _import("reportCenter/slidingDrifting"),
    //         //     hidden: true,
    //         //     meta: { title: "轨迹漂移明细" },
    //         // },
    //         // //联网考核-车辆上线率统计
    //         // {
    //         //     path: "/reportCenter/vehicleOnlineRate",
    //         //     component: _import("reportCenter/vehicleOnlineRate"),
    //         //     hidden: true,
    //         // },
    //         {
    //             path: "/reportCenter/vehicleOnlineRate/detail",
    //             component: _import("reportCenter/vehicleOnlineRateDetail"),
    //             hidden: true,
    //             meta: { title: "详情" },
    //         },
    //         // //联网考核-车辆离线统计
    //         // {
    //         //     path: "/reportCenter/vehicleOfflineLongTime",
    //         //     component: _import("reportCenter/vehicleOfflineLongTime"),
    //         //     hidden: true,
    //         // },
    //         // //联网考核-车辆在线时长统计
    //         // {
    //         //     path: "/reportCenter/vehicleOnlineTime",
    //         //     component: _import("reportCenter/vehicleOnlineTime"),
    //         //     hidden: true,
    //         //     meta: { title: "车辆在线时长统计" },
    //         // },
    //         // //平台日志-平台登录日志
    //         // {
    //         //     path: "/supportCenter/loginLog",
    //         //     component: _import("supportCenter/loginLog"),
    //         //     hidden: true,
    //         //     meta: { title: "平台登录日志" },
    //         // },
    //         // //平台日志-设备操作日志
    //         // {
    //         //     path: "/supportCenter/devOperationLog",
    //         //     component: _import("supportCenter/devOperationLog"),
    //         //     hidden: true,
    //         //     meta: { title: "设备操作日志" },
    //         // },
    //         //平台日志-系统操作日志
    //         // {
    //         //     path: "/supportCenter/operationLog",
    //         //     component: _import("supportCenter/operationLog"),
    //         //     hidden: true,
    //         //     meta: { title: "系统操作日志" },
    //         // },
    //         // //日志管理-系统日志
    //         // {
    //         //     path: "/supportCenter/devLog",
    //         //     component: _import("supportCenter/devLog"),
    //         //     hidden: true,
    //         //     meta: { title: "设备日志" },
    //         // },
    //         // //日志管理-系统日志
    //         // {
    //         //     path: "/supportCenter/devLogRecord",
    //         //     component: _import("supportCenter/devLogRecord"),
    //         //     hidden: true,
    //         //     meta: { title: "日志上传记录" },
    //         // },
    //         // //日志管理-设备上下线日志
    //         // {
    //         //     path: "/supportCenter/deviceOnline",
    //         //     component: _import("supportCenter/deviceOnline"),
    //         //     hidden: true,
    //         //     meta: { title: "设备上下线日志" },
    //         // },
    //         //协议配置
    //         {
    //             path: "/maintenanceCenter/deviceConfiguration/protocolConfiguration",
    //             component: _import("protocolConfiguration/index"),
    //             hidden: true,
    //             meta: { title: "协议配置" },
    //         },
    //         // //报警附件严重丢失统计
    //         // {
    //         //     path: "/maintenanceCenter/alarmAttachLost",
    //         //     component: _import("maintenanceCenter/alarmAttachLost"),
    //         //     hidden: true,
    //         //     meta: { title: "报警附件严重丢失统计" },
    //         // },
    //         // //录像回放
    //         // {
    //         //     path: "/maintenanceCenter/videoPlayback",
    //         //     component: _import("maintenanceCenter/videoPlayback"),
    //         //     hidden: true,
    //         //     name: "录像回放",
    //         //     meta: { title: "录像回放" },
    //         // },
    //         // //轨迹回放
    //         // {
    //         //     path: "/maintenanceCenter/historyPlayback",
    //         //     component: _import("maintenanceCenter/historyPlayback"),
    //         //     hidden: true,
    //         //     name: "轨迹回放",
    //         //     meta: { title: "轨迹回放" },
    //         // },
    //         // //实时预览
    //         // {
    //         //     path: "/maintenanceCenter/livePreview",
    //         //     component: _import("maintenanceCenter/livePreview"),
    //         //     hidden: true,
    //         //     name: "实时预览",
    //         //     meta: { title: "实时预览" },
    //         // },
    //         //参数查询
    //         {
    //             path: "/maintenanceCenter/parameterQuery/module",
    //             component: _import(
    //                 "maintenanceCenter/parameterQueryFile/module"
    //             ),
    //             hidden: true,
    //         },
    //     ],
    // },
];

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap,
});

export const asyncRouterMap = [{ path: "*", redirect: "/404", hidden: true }];
