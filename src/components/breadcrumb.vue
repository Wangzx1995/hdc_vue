<template>
    <div class="breadcrumb-box p-l-md">
        <el-breadcrumb class="v-m">
            <i
                class="el-icon-back go-back-btn"
                @click="goBack"
                v-if="
                    breadcrumb.length > 2 ||
                    (this.$route.path.includes('conditionMonitoring') &&
                        breadcrumb.length >= 2)
                "
            ></i>
            <template v-for="item in breadcrumb">
                <el-breadcrumb-item
                    v-if="!item.isClick || breadcrumb.length <= 1"
                    >{{ item.name }}</el-breadcrumb-item
                >
                <!-- :href="item.path" -->
                <el-breadcrumb-item v-else :to="item.path">{{
                    item.name
                }}</el-breadcrumb-item>
            </template>
        </el-breadcrumb>
        <div>
            <span
                class="open-book m-r pointer"
                @click="openBook"
                v-show="
                    levelList.length &&
                    levelList[0] &&
                    (levelList[0].name == '轨迹回放' ||
                        levelList[0].name == '设备固件管理')
                "
            >
                <img src="./../../static/images/instructions.png" />
                <!-- <i class="el-icon-reading"></i> -->
                <span class="m-l-xs">操作指引</span>
            </span>
        </div>
        <el-dialog
            destroy-on-close
            :mask-closable="false"
            :styles="{ top: '20px' }"
            width="600px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="operaBookVisible"
            title="操作指引"
            class="opera-book"
        >
            <div>
                <div v-for="(item, index) in bookContent" :key="index">
                    <b class="book-title">{{ item.title }}：</b>
                    <img
                        :src="item.img"
                        alt=""
                        :style="{ height: item.imgSize }"
                        v-if="item.img"
                    />
                    <span v-if="item.text">{{ item.text }}</span>
                    <div v-if="item.children" class="book-child">
                        <div
                            v-for="(content, index) in item.children"
                            :key="'c_' + index"
                        >
                            <span>{{ content.title }}：</span>
                            <img :src="content.img" alt="" v-if="content.img" />
                            <span>{{ content.text }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <el-button type="text" @click="operaBookVisible = false"
                    >知道了</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>
<script>
import operaBook from "@/utils/operaBook";
export default {
    name: "breadcrumb",
    created() {
        // this.getBreadcrumb();
    },
    data() {
        return {
            operaBookVisible: false,
            bookContent: [], //操作指引内容
            levelList: null,
            breadcrumb: [],
            firstList: [
                {
                    path: "/dashboard",
                    name: "首页",
                },
                {
                    path: "/manageCenter",
                    name: "管理中心",
                },
                {
                    path: "/maintenanceCenter",
                    name: "维护中心",
                },
                {
                    path: "/reportCenter",
                    name: "报表中心",
                },
                {
                    path: "/supportCenter",
                    name: "帮助中心",
                },
                {
                    path: "/logManage",
                    name: "平台日志",
                },
            ],
            secondList: [
                {
                    path: "/maintenanceCenter/conditionMonitoring",
                    name: "设备巡检",
                    href: "/maintenanceCenter/conditionMonitoring",
                },
                {
                    path: "/maintenanceCenter/equipmentInspection",
                    name: "设备自检",
                    href: "/maintenanceCenter/equipmentInspection",
                },
                {
                    path: "/maintenanceCenter/faultAccount",
                    name: "故障台账",
                    href: "/maintenanceCenter/faultAccount",
                },
                {
                    path: "/maintenanceCenter/handleFault",
                    name: "待处理故障管理",
                    href: "/maintenanceCenter/handleFault",
                },
                {
                    path: "/maintenanceCenter/faultSubsidiary",
                    name: "设备故障汇总",
                    href: "/maintenanceCenter/faultSubsidiary",
                },
                {
                    path: "/manageCenter/deviceManage",
                    name: "设备管理",
                    href: "/manageCenter/deviceManage",
                },
                {
                    path: "/manageCenter/wifiManage",
                    name: "WIFI前缀名称管理",
                    href: "/manageCenter/wifiManage",
                },
                {
                    path: "/manageCenter/carManage",
                    name: "车辆管理",
                    href: "/manageCenter/carManage",
                },
                {
                    path: "/manageCenter/roleManage",
                    name: "角色管理",
                    href: "/manageCenter/roleManage",
                },
                {
                    path: "/manageCenter/userManage",
                    name: "用户管理",
                    href: "/manageCenter/userManage",
                },
                {
                    path: "/maintenanceCenter/deviceUpgrade",
                    name: "设备升级",
                    href: "/maintenanceCenter/deviceUpgrade",
                },
                {
                    path: "/maintenanceCenter/deviceConfiguration",
                    name: "设备配置",
                    href: "/maintenanceCenter/deviceConfiguration",
                },
                {
                    path: "/maintenanceCenter/parameterQuery",
                    name: "参数查询",
                    href: "/maintenanceCenter/parameterQuery",
                },
                {
                    path: "/maintenanceCenter/configurationTemplate",
                    name: "配置模板管理",
                    href: "/maintenanceCenter/configurationTemplate",
                },
                {
                    path: "/maintenanceCenter/antIrotationNet",
                    name: "防转网配置",
                    href: "/maintenanceCenter/antIrotationNet",
                },
                {
                    path: "/maintenanceCenter/intelligentParameterConfig",
                    name: "智能参数下发",
                    href: "/maintenanceCenter/intelligentParameterConfig",
                },
                {
                    path: "/reportCenter/vehicleTrackIntegrityRate",
                    name: "轨迹完整率统计",
                    href: "/reportCenter/vehicleTrackIntegrityRate",
                },
                {
                    path: "/reportCenter/vehicleOnlineRate",
                    name: "车辆上线率统计",
                    href: "/reportCenter/vehicleOnlineRate",
                },
                {
                    path: "/reportCenter/trackIncompleteDetails",
                    name: "轨迹不完整明细",
                    href: "/reportCenter/trackIncompleteDetails",
                },
                {
                    path: "/reportCenter/slidingDrifting",
                    name: "轨迹漂移明细",
                    href: "/reportCenter/slidingDrifting",
                },
                {
                    path: "/reportCenter/netLink",
                    name: "车辆入网率统计",
                    href: "/reportCenter/netLink",
                },
                {
                    path: "/reportCenter/vehicleOnlineTime",
                    name: "车辆在线时长统计",
                    href: "/reportCenter/vehicleOnlineTime",
                },
                {
                    path: "/reportCenter/vehicleOfflineLongTime",
                    name: "车辆离线统计",
                    href: "/reportCenter/vehicleOfflineLongTime",
                },
                {
                    path: "/reportCenter/deviceHealthCondition",
                    name: "设备健康状态统计",
                    href: "/reportCenter/deviceHealthCondition",
                },
                {
                    path: "/maintenanceCenter/ttsConfiguration",
                    name: "TTS配置",
                    href: "/maintenanceCenter/ttsConfiguration",
                },
                {
                    path: "/reportCenter/qualifiedProbability",
                    name: "数据合格率统计",
                    href: "/reportCenter/qualifiedProbability",
                },
                {
                    path: "/maintenanceCenter/firmware",
                    name: "设备固件管理",
                    href: "/maintenanceCenter/firmware",
                },
                // {
                //   path:'/configurationTemplate',
                //   name:'配置模板管理',
                //   href: '/resourceManagement/configurationTemplate'
                // },
                {
                    path: "/manageCenter/plateNumAndDeviceCode",
                    name: "车牌号/设备序列号异常统计",
                    href: "/manageCenter/plateNumAndDeviceCode",
                },
                {
                    path: "/maintenanceCenter/maintainRecord",
                    name: "维护记录",
                    href: "/maintenanceCenter/maintainRecord",
                },
                // {
                //   path:'/operationLog',
                //   name:'系统操作日志',
                //   href: '/logManage/operationLog'
                // },
                // {
                //   path:'/loginLog',
                //   name:'平台登录日志',
                //   href: '/logManage/loginLog'
                // },
                {
                    path: "/deviceLoadTaskManage",
                    name: "装车任务管理",
                    href: "/manageCenter/deviceLoadTaskManage",
                },
                {
                    path: "/manageCenter/deviceLoadReportVerify",
                    name: " 装车报告审核",
                    href: "/manageCenter/deviceLoadReportVerify",
                },
                {
                    path: "/reportCenter/groundTrackDrifting",
                    name: " 轨迹漂移率统计",
                    href: "/reportCenter/groundTrackDrifting",
                },
                {
                    path: "/maintenanceCenter/videoPlayback",
                    name: " 录像回放",
                    href: "/maintenanceCenter/videoPlayback",
                },
                {
                    path: "/maintenanceCenter/historyPlayback",
                    name: " 轨迹回放",
                    href: "/maintenanceCenter/historyPlayback",
                },
                {
                    path: "/maintenanceCenter/livePreview",
                    name: " 实时预览",
                    href: "/maintenanceCenter/livePreview",
                },
                {
                    path: "/maintenanceCenter/cardSwapRecord",
                    name: " 司机插拔卡记录",
                    href: "/maintenanceCenter/cardSwapRecord",
                },
                {
                    path: "/maintenanceCenter/faultTypeSubscribe",
                    name: "待处理故障类型订阅",
                    href: "/maintenanceCenter/faultTypeSubscribe",
                },
                {
                    path: "/maintenanceCenter/anomalyDetails",
                    name: "设备异常明细",
                    href: "/maintenanceCenter/anomalyDetails",
                },
                {
                    path: "/maintenanceCenter/alarmAttachLost",
                    name: "报警附件严重丢失统计",
                    href: "/maintenanceCenter/alarmAttachLost",
                },
                {
                    path: "/supportCenter/loginLog",
                    name: "平台登录日志",
                    href: "/supportCenter/loginLog",
                },
                {
                    path: "/supportCenter/operationLog",
                    name: "系统操作日志",
                    href: "/supportCenter/operationLog",
                },
                {
                    path: "/supportCenter/devOperationLog",
                    name: "设备操作日志",
                    href: "/supportCenter/devOperationLog",
                },
                {
                    path: "/supportCenter/deviceOnline",
                    name: "设备上下线日志",
                    href: "/supportCenter/deviceOnline",
                },
                {
                    path: "/supportCenter/devLog",
                    name: "设备日志",
                    href: "/supportCenter/devLog",
                },
            ],
            thirdList: [
                {
                    path: "configurationView/",
                    name: "配置查看",
                    href: "/maintenanceCenter/deviceConfiguration/configurationView",
                },
                //tts指令-我的配置任务
                {
                    path: "ttsConfigurationTask",
                    name: "我的配置任务",
                    href: "/maintenanceCenter/ttsConfiguration/ttsConfigurationTask",
                },
                //tts指令-我的配置任务-详情
                {
                    path: "ttsConfigurationTaskDetail",
                    name: "详情",
                    href: "/maintenanceCenter/ttsConfiguration/ttsConfigurationTask/ttsConfigurationTaskDetail",
                },
                //tts指令-未完成配置
                // {
                //   path:'ttsConfigurationNoView',
                //   name:'未完成配置',
                //   href:'/equipmentOperation/ttsConfiguration/ttsConfigurationNoView'
                // },

                //tts配置查看-详情/equipmentOperation/ttsConfiguration/ttsConfigurationView
                //  {
                //     path:'/ttsConfigurationTaskDetail',
                //     name:'详情',
                //     href: '/equipmentOperation/ttsConfiguration/ttsConfigurationView/ttsConfigurationTaskDetail'
                //   },
                {
                    path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeView",
                    name: "升级查看",
                    href: "/maintenanceCenter/deviceUpgrade/deviceUpgradeView",
                },
                {
                    path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeTask",
                    name: "我的升级任务",
                    href: "/maintenanceCenter/deviceUpgrade/deviceUpgradeTask",
                },
                {
                    path: "/maintenanceCenter/deviceUpgrade/firmware",
                    name: "设备固件管理",
                    href: "/maintenanceCenter/deviceUpgrade/firmware",
                },
                {
                    path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeNoComplete",
                    name: "未完成升级",
                    href: "/maintenanceCenter/deviceUpgrade/deviceUpgradeNoComplete",
                },
                {
                    path: "configuration/",
                    name: "配置",
                    href: "/maintenanceCenter/deviceConfiguration/configuration",
                },

                {
                    path: "/maintenanceCenter/deviceConfiguration/configurationTemplate",
                    name: "配置模板管理",
                    href: "/maintenanceCenter/deviceConfiguration/configurationTemplate",
                },
                {
                    path: "editTemplate/",
                    name: "编辑",
                    href: "/maintenanceCenter/configurationTemplate/editTemplate",
                },
                {
                    path: "editTemplate/",
                    name: "编辑",
                    href: "/maintenanceCenter/deviceConfiguration/configurationTemplate/editTemplate",
                },
                {
                    path: "configurationTask/",
                    name: "我的配置任务",
                    href: "/maintenanceCenter/deviceConfiguration/configurationTask",
                },
                {
                    path: "configurationTaskDetailNew/",
                    name: "详情",
                    href: "/maintenanceCenter/deviceConfiguration/configurationTask/configurationTaskDetailNew",
                },
                {
                    path: "faultAccount/",
                    name: "详情",
                    href: "/maintenanceCenter/faultSubsidiary/faultAccount",
                },
                {
                    path: "deviceLoadTaskDetail/",
                    name: "",
                    href: "/manageCenter/deviceLoadTaskManage/deviceLoadTaskDetail",
                },
                // {
                //     path: "/groundTrackDriftingDetail",
                //     name: "轨迹漂移明细",
                //     href: "/reportCenter/groundTrackDrifting/groundTrackDriftingDetail",
                // },
                {
                    path: "/maintenanceCenter/parameterQuery/module",
                    name: "查询模块",
                    href: "/maintenanceCenter/parameterQuery/module",
                },
            ],
        };
    },

    name: "breadcrumb",
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        getBreadcrumb() {
            const breadcrumb = [];
            this.firstList.map((i) => {
                if (this.$route.path.includes(i.path)) {
                    breadcrumb.push({ name: i.name, path: "", isClick: false });
                }
            });
            this.secondList.map((i) => {
                if (this.$route.path.includes(i.path)) {
                    breadcrumb.push({
                        name: i.name,
                        path: i.href,
                        isClick: true,
                    });
                }
            });
            this.thirdList.map((i) => {
                if (this.$route.path.includes(i.path)) {
                    breadcrumb.push({
                        name: i.name,
                        path: i.href,
                        isClick:
                            i.href !==
                            "/maintenanceCenter/deviceConfiguration/configuration",
                    });
                }
            });
            this.$route.meta.title &&
                breadcrumb.push({
                    name: this.$route.meta.title,
                    path: "",
                    isClick: false,
                });
            if (
                breadcrumb.length > 2 &&
                breadcrumb[breadcrumb.length - 1].name == "设备固件管理"
            )
                breadcrumb.splice(-2, 1);
            this.breadcrumb = breadcrumb;
            // 首页判断
            // if(this.$route.path.includes('/dashboard')){
            //     this.breadcrumb=[{name:'首页',path:'',isClick:false}]
            //   }
            const matched = this.$route.matched.filter((item) => item.name);
            // const first = matched[0];
            // if (first && (first.name !== '首页' || first.path !== '')) {
            //   matched = [{ name: '首页', path: '/' }].concat(matched)
            // }
            this.levelList = matched;
            // this.breadcrumb=this.$route.meta.breadcrumb
        },
        //打开操作指引
        openBook() {
            this.operaBookVisible = true;
            // this.bookContent = [...operaBook["historyPlayback"]];
            this.bookContent = [
                ...operaBook[this.$route.path.split("/").reverse()[0]],
            ];
        },
        defaultOrganizeIdChange(val) {
            let path = [
                "/maintenanceCenter/deviceUpgrade",
                "/maintenanceCenter/deviceConfiguration",
                "/maintenanceCenter/ttsConfiguration",
                "/reportCenter/deviceHealthCondition",
            ];
            if (!path.includes(val.path)) {
                this.$store.dispatch("RemoveDefaultOrganizeId");
            }
        },
    },
    // computed:{
    //   metaName:
    // },
    watch: {
        $route: {
            handler(val) {
                this.getBreadcrumb();
                this.defaultOrganizeIdChange(val);
            },
            immediate: true,
            deep: true,
        },
        "$route.meta": {
            handler(val) {
                this.getBreadcrumb();
            },
            deep: true,
        },
    },
};
</script>
<style lang="less" scoped>
.go-back-btn {
    font-size: 18px;
    cursor: pointer;
    margin-right: 8px;
    padding: 0px 4px;
    &:hover {
        background: rgba(0, 0, 0, 0.06);
    }
}
.el-breadcrumb {
    height: 18px;
    line-height: 18px;
    display: flex;
    align-items: center;
    font-size: 12px;
}
.breadcrumb-box {
    display: flex;
    justify-content: space-between;
}
.open-book {
    display: flex;
    img {
        height: 18px;
    }
}
</style>
