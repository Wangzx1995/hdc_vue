import api from "@/api/api";
import utils from "@/utils/base";

import { asyncRouterMap, constantRouterMap } from "@/router/index";
const _import = require("../../router/_import_" + process.env.NODE_ENV);
// const _import = require("../../router/_import");
import Layout from "../../views/layout/layout";
import emptyCom from "../../views/layout/emptyCom";
const permission = {
    state: {
        routers: constantRouterMap,
        routersMenus: [],
        addRouters: [],
        buttonPermissions: [],
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        },
        SET_ROUTERSMENUS: (state, routers) => {
            state.routersMenus = routers;
        },
        SET_BUTTONPERMISSIONS: (state, permissions) => {
            state.buttonPermissions = permissions;
        },
    },
    actions: {
        getButtonPermissions({ commit, state }) {
            return new Promise((resolve, reject) => {
                resolve(state.buttonPermissions);
            });
        },
        GenerateRoutes({ commit }) {
            return new Promise((resolve, reject) => {
                api.getUserMenus()
                    .then((response) => {
                        const accessedRoutersList = [];
                        commit(
                            "SET_ROUTERSMENUS",
                            utils.toFlatArray(response.data)
                        );
                        commit(
                            "SET_BUTTONPERMISSIONS",
                            utils
                                .toFlatArray(response.data)
                                .filter((item) => item.type === 3)
                                .reduce((prev, cur) => {
                                    return prev.concat(cur["path"]);
                                }, [])
                        );
                        response.data.forEach((item, index) => {
                            item.component = Layout;
                            accessedRoutersList.push({
                                component: _import("layout/layout"),
                                path: item.path,
                                name: item.name,
                                redirect: item.redirect,
                                children: [],
                            });
                            if (item.children.length > 0) {
                                item.children.forEach((com, i) => {
                                    accessedRoutersList[index].children.push({
                                        component: _import("layout/emptyCom"),
                                        path: com.path,
                                        name: com.name,
                                        redirect: com.redirect,
                                        children: [],
                                    });
                                    if (com.children.length > 0) {
                                        com.children.forEach((k) => {
                                            let a =
                                                k.component.charAt(0) == "/"
                                                    ? k.component.replace(
                                                          /^./,
                                                          ""
                                                      )
                                                    : k.component;
                                            accessedRoutersList[index].children[
                                                i
                                            ].children.push({
                                                component: _import(a),
                                                name: k.name,
                                                path: item.path + "/" + k.path,
                                            });
                                        });
                                    }
                                });
                            }
                        });
                        // 这里对后端返回的菜单进行解析
                        // if (accessedRoutersList.length) {
                        //     accessedRoutersList.forEach((item, index) => {
                        //         item.component = Layout;
                        //         if (item.children) {
                        //             item.children.forEach((com, i) => {
                        //                 com.component = emptyCom;
                        //                 if (com.children.length) {
                        //                     com.children.forEach((com_) => {
                        //                         com_.component = _import(
                        //                             com_.component
                        //                         );
                        //                     });
                        //                 }
                        //             });
                        //         }
                        //     });
                        // }
                        accessedRoutersList.push({
                            path: "*",
                            redirect: "/404",
                            hidden: true,
                        });
                        let a = {
                            path: "/1",
                            component: _import("layout/layout"),
                            redirect: "noredirect",
                            name: "",
                            noDropdown: true,
                            hidden: true,
                            unshow: true,
                            children: [
                                {
                                    path: "/manageCenter/deviceLoadTaskManage/deviceLoadTaskDetail",
                                    component: _import(
                                        "manageCenter/deviceLoadTaskDetail"
                                    ),
                                    hidden: true,
                                    meta: { title: "" },
                                },

                                {
                                    path: "/manageCenter/deviceLoadReportVerify/deviceLoadReportVerifyDetail",
                                    component: _import(
                                        "manageCenter/deviceLoadReportVerifyDetail"
                                    ),
                                    hidden: true,
                                    meta: { title: "审核" },
                                },

                                {
                                    path: "/maintenanceCenter/deviceUpgrade/firmware",
                                    component: _import(
                                        "maintenanceCenter/firmware"
                                    ),
                                    hidden: true,
                                    meta: { title: "设备固件管理" },
                                },

                                {
                                    path: "/maintenanceCenter/firmware/minorVersion",
                                    component: _import(
                                        "maintenanceCenter/minorVersion"
                                    ),
                                    hidden: true,
                                    meta: { title: "小版本管理" },
                                },

                                {
                                    path: "/maintenanceCenter/deviceUpgrade/firmware/minorVersion",
                                    component: _import(
                                        "maintenanceCenter/minorVersion"
                                    ),
                                    hidden: true,
                                    meta: { title: "小版本管理" },
                                },

                                {
                                    path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeTask",
                                    component: _import(
                                        "maintenanceCenter/deviceUpgradeTask"
                                    ),
                                    hidden: true,
                                    meta: { title: "" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeTask/deviceUpgradeTaskDetail",
                                    component: _import(
                                        "maintenanceCenter/deviceUpgradeTaskDetail"
                                    ),
                                    hidden: true,
                                    meta: { title: "详情" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeNoComplete",
                                    component: _import(
                                        "maintenanceCenter/deviceUpgradeNoComplete"
                                    ),
                                    hidden: true,
                                },
                                {
                                    path: "/maintenanceCenter/deviceUpgrade/upgrade",
                                    component: _import(
                                        "maintenanceCenter/upgrade"
                                    ),
                                    hidden: true,
                                    meta: { title: "升级" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceUpgrade/history",
                                    component: _import(
                                        "maintenanceCenter/history"
                                    ),
                                    hidden: true,
                                    meta: { title: "升级历史" },
                                },

                                {
                                    path: "/maintenanceCenter/maintainRecord/maintainRecordDetail",
                                    component: _import(
                                        "maintenanceCenter/maintainRecordDetail"
                                    ),
                                    hidden: true,
                                    meta: { title: "详情" },
                                },

                                {
                                    path: "/maintenanceCenter/deviceConfiguration/configuration",
                                    component: _import(
                                        "maintenanceCenter/configuration"
                                    ),
                                    hidden: true,
                                    meta: { title: "配置" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceConfiguration/configurationDetail/agreementIndex",
                                    component: _import(
                                        "maintenanceCenter/configurationDetail/agreementIndex"
                                    ),
                                    hidden: true,
                                    meta: { title: "协议配置" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceConfiguration/configurationDetail/bubiao",
                                    component: _import(
                                        "maintenanceCenter/configurationDetail/agreementIndex"
                                    ),
                                    hidden: true,
                                    meta: { title: "部标配置" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceConfiguration/configurationDetail/fileIndex",
                                    component: _import(
                                        "maintenanceCenter/configurationDetail/fileIndex"
                                    ),
                                    hidden: true,
                                    meta: { title: "文件配置" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceConfiguration/configurationDetail/privateProtocol",
                                    component: _import(
                                        "maintenanceCenter/configurationDetail/privateProtocol"
                                    ),
                                    hidden: true,
                                    meta: { title: "协议配置" },
                                },

                                {
                                    path: "/maintenanceCenter/configurationTemplate/editTemplate",
                                    component: _import(
                                        "maintenanceCenter/editTemplate"
                                    ),
                                    hidden: true,
                                    meta: { title: "编辑" },
                                },
                                {
                                    path: "/maintenanceCenter/configurationTemplate/protocolTemplate",
                                    component: _import(
                                        "protocolConfiguration/components/protocolTemplate"
                                    ),
                                    hidden: true,
                                    meta: { title: "编辑" },
                                },

                                {
                                    path: "/maintenanceCenter/deviceConfiguration/configurationView",
                                    component: _import(
                                        "maintenanceCenter/configurationView"
                                    ),
                                    hidden: true,
                                    meta: { title: "配置查看" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceConfiguration/configurationTask",
                                    component: _import(
                                        "maintenanceCenter/configurationTask"
                                    ),
                                    hidden: true,
                                    meta: { title: "我的配置任务" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceConfiguration/configurationTask/configurationTaskDetailNew",
                                    component: _import(
                                        "maintenanceCenter/configurationTaskDetailNew"
                                    ),
                                    hidden: true,
                                    meta: { title: "详情" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceConfiguration/configurationTask/configurationTaskDetailNew/editTemplate",
                                    component: _import(
                                        "maintenanceCenter/editTemplate"
                                    ),
                                    hidden: true,
                                    meta: { title: "详情" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceConfiguration/showHistoryView",
                                    component: _import(
                                        "maintenanceCenter/showHistoryView"
                                    ),
                                    hidden: true,
                                    meta: { title: "历史" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceConfiguration/noConfiguration",
                                    component: _import(
                                        "maintenanceCenter/noConfiguration"
                                    ),
                                    hidden: true,
                                    meta: { title: "未完成配置" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceConfiguration/configurationView/configurationTaskDetail",
                                    component: _import(
                                        "maintenanceCenter/configurationTaskDetail"
                                    ),
                                    hidden: true,
                                    meta: { title: "详情" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceConfiguration/configurationView/configurationTTSDetail",
                                    component: _import(
                                        "maintenanceCenter/configurationTTSDetail"
                                    ),
                                    hidden: true,
                                    meta: { title: "详情" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceConfiguration/configuration/editTemplate",
                                    component: _import(
                                        "maintenanceCenter/editTemplate"
                                    ),
                                    hidden: true,
                                    meta: { title: "编辑" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceConfiguration/configuration/configurationTemplate",
                                    component: _import(
                                        "maintenanceCenter/configurationTemplate"
                                    ),
                                    hidden: true,
                                    meta: { title: "配置模板管理" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceConfiguration/configurationTemplate/editTemplate",
                                    component: _import(
                                        "maintenanceCenter/editTemplate"
                                    ),
                                    hidden: true,
                                    meta: { title: "编辑" },
                                },
                                {
                                    path: "/maintenanceCenter/deviceConfiguration/configurationTemplate/",
                                    component: _import(
                                        "maintenanceCenter/configurationTemplate"
                                    ),
                                    hidden: true,
                                    meta: { title: "" },
                                },

                                {
                                    path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationDetail",
                                    component: _import(
                                        "maintenanceCenter/ttsConfigurationDetail"
                                    ),
                                    hidden: true,
                                    meta: { title: "配置" },
                                },
                                {
                                    path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationView",
                                    component: _import(
                                        "maintenanceCenter/ttsConfigurationView"
                                    ),
                                    hidden: true,
                                    meta: { title: "配置查看" },
                                },
                                {
                                    path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationCustomize",
                                    component: _import(
                                        "maintenanceCenter/ttsConfigurationCustomize"
                                    ),
                                    hidden: true,
                                    meta: { title: "自定义配置" },
                                },
                                {
                                    path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationTask",
                                    component: _import(
                                        "maintenanceCenter/ttsConfigurationTask"
                                    ),
                                    hidden: true,
                                },
                                {
                                    path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationTask/ttsConfigurationTaskDetail",
                                    component: _import(
                                        "maintenanceCenter/ttsConfigurationTaskDetail"
                                    ),
                                    hidden: true,
                                },
                                {
                                    path: "/maintenanceCenter/ttsConfiguration/TTSshowHistoryView",
                                    component: _import(
                                        "maintenanceCenter/TTSshowHistoryView"
                                    ),
                                    hidden: true,
                                    meta: { title: "历史" },
                                },
                                {
                                    path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationNoView",
                                    component: _import(
                                        "maintenanceCenter/ttsConfigurationNoView"
                                    ),
                                    hidden: true,
                                    meta: { title: "未完成配置" },
                                },

                                {
                                    path: "/maintenanceCenter/antIrotationNet/antIrotationNetTemplate",
                                    component: _import(
                                        "maintenanceCenter/antIrotationNetTemplate"
                                    ),
                                    hidden: true,
                                    meta: { title: "防转网模板管理" },
                                },

                                {
                                    path: "/maintenanceCenter/equipmentInspection/equipmentInspectionHistory",
                                    component: _import(
                                        "maintenanceCenter/equipmentInspectionHistory"
                                    ),
                                    hidden: true,
                                    meta: { title: "历史" },
                                },

                                {
                                    path: "/maintenanceCenter/handleFault/handleFaultDetail",
                                    component: _import(
                                        "maintenanceCenter/handleFaultDetail"
                                    ),
                                    hidden: true,
                                    meta: { title: "详情" },
                                },

                                {
                                    path: "/maintenanceCenter/faultSubsidiary/faultAccount",
                                    component: _import(
                                        "maintenanceCenter/faultAccount"
                                    ),
                                    hidden: true,
                                    meta: { title: "详情" },
                                },

                                {
                                    path: "/reportCenter/qualifiedProbability/carDetail",
                                    component: _import(
                                        "reportCenter/qualifiedProbabilityCarDetail"
                                    ),
                                    hidden: true,
                                    meta: { title: "轨迹回放" },
                                },

                                {
                                    path: "/reportCenter/vehicleTrackIntegrityRate/carDetail",
                                    component: _import(
                                        "reportCenter/vehicleTrackIntegrityRateCarDetail"
                                    ),
                                    hidden: true,
                                    meta: { title: "轨迹回放" },
                                },

                                {
                                    path: "/reportCenter/groundTrackDrifting/carDetail",
                                    component: _import(
                                        "reportCenter/groundTrackDriftingCarDetail"
                                    ),
                                    hidden: true,
                                    meta: { title: "轨迹回放" },
                                },
                                {
                                    path: "/reportCenter/groundTrackDrifting/groundTrackDriftingDetail",
                                    component: _import(
                                        "reportCenter/groundTrackDriftingDetail"
                                    ),
                                    hidden: true,
                                    meta: { title: "轨迹漂移明细" },
                                },

                                {
                                    path: "/reportCenter/vehicleOnlineRate/detail",
                                    component: _import(
                                        "reportCenter/vehicleOnlineRateDetail"
                                    ),
                                    hidden: true,
                                    meta: { title: "详情" },
                                },

                                {
                                    path: "/maintenanceCenter/deviceConfiguration/protocolConfiguration",
                                    component: _import(
                                        "protocolConfiguration/index"
                                    ),
                                    hidden: true,
                                    meta: { title: "协议配置" },
                                },

                                {
                                    path: "/maintenanceCenter/parameterQuery/module",
                                    component: _import(
                                        "maintenanceCenter/parameterQueryFile/module"
                                    ),
                                    hidden: true,
                                },
                            ],
                        };
                        accessedRoutersList.push(a);
                        commit("SET_ROUTERS", accessedRoutersList);
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
    },
};

export default permission;
