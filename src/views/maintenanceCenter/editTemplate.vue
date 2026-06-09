<template>
    <div class="edit-template">
        <div class="p-a-md">
            <el-row
                layout
                class="configuration-module"
                v-if="type == 1 || type == 3"
            >
                <el-col :span="4">
                    <el-menu
                        v-if="isapiData['menuList'].length"
                        :default-active="componentName"
                        class="menu-vertical"
                        unique-opened
                        ref="menu"
                    >
                        <el-submenu
                            v-for="item in sideBarItem"
                            :title="item.title"
                            v-bind:key="item.index"
                            :index="item.index"
                        >
                            <template slot="title">{{ item.title }}</template>
                            <el-menu-item
                                :index="i.value"
                                v-for="i in item.children"
                                v-bind:key="i.index"
                                @click="changeLabel(i)"
                                >{{ i.label }}</el-menu-item
                            >
                        </el-submenu>
                    </el-menu>
                    <el-menu
                        v-if="privateData['menuList'].length"
                        :default-active="componentName"
                        class="menu-vertical"
                        unique-opened
                        ref="menu"
                    >
                        <el-submenu
                            v-for="item in sideBarItem"
                            :title="item.title"
                            v-bind:key="item.index"
                            :index="item.index"
                        >
                            <template slot="title">{{ item.title }}</template>
                            <el-menu-item
                                :index="i.value"
                                v-for="i in item.children"
                                v-bind:key="i.index"
                                @click="changeLabel(i)"
                                >{{ i.label }}</el-menu-item
                            >
                        </el-submenu>
                    </el-menu>
                    <el-menu
                        v-if="
                            !isapiData['menuList'].length &&
                            !privateData['menuList'].length
                        "
                        :default-active="componentName"
                        class="menu-vertical aaa"
                        unique-opened
                        ref="menu"
                    >
                        <el-submenu
                            v-for="item in sideBarItem"
                            :title="item.title"
                            v-bind:key="item.index"
                            :index="item.index"
                        >
                            <template slot="title">{{ item.title }}</template>
                            <el-menu-item
                                :index="i.value"
                                v-for="i in item.children"
                                v-bind:key="i.index"
                                @click="changeLabel(i)"
                                :disabled="
                                    i.value !== componentName && notAllTab
                                "
                                >{{ i.label }}</el-menu-item
                            >
                        </el-submenu>
                    </el-menu>
                </el-col>
                <el-col :span="20">
                    <div class="configuration-detail-content">
                        <div class="configuration-detail-item">
                            <component
                                @setMenuActiveRefFormName="
                                    getMenuActiveRefFormName
                                "
                                :allEnumerationData="enumerationData"
                                :centerHasIot="hasIotHikvision"
                                @changeChannels="getChannel"
                                :is="componentName"
                                :formDetail="initData"
                                :detail="initData"
                                :postChannel="channelForm"
                                @change="changeVal"
                                v-if="detailShow"
                                :allCapability="privateData['capability']"
                                ref="component"
                                isTemplate="true"
                            ></component>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row v-else-if="type == 2">
                <div class="h-full w-full text-center divHeight">
                    <div
                        v-show="!noneVideoPlay"
                        class="h-full inline"
                        style="height: 100%; width: 100%"
                        id="videoPlay"
                    ></div>
                    <div
                        v-show="noneVideoPlay"
                        class="h-full flex-layout flex-middle flex-center"
                    >
                        <div class="text-center">
                            <h4>Web控件未运行</h4>
                            <p class="text-xs text-muted m-y text-center">
                                请尝试以下办法：
                            </p>
                            <div class="text-xs text-center">
                                <span
                                    >1）本机尚未安装Web控件，请先安装，安装完成后刷新当前页面！</span
                                >
                                <a @click="downloadOcx">安装</a>
                                <a @click="refreshPage">刷新</a>
                            </div>
                            <div class="text-xs text-center">
                                <span
                                    >2）本机已安装Web控件，请先启动服务后刷新当前页面！</span
                                >
                                <a @click="wakeUpOcx">启动</a>
                                <a @click="refreshPage">刷新</a>
                            </div>
                        </div>
                    </div>
                </div>
            </el-row>
        </div>
        <div class="bottom" v-if="!dialogTableVisible">
            <div
                class="configuration-detail-submit p-x-md"
                v-if="!noneVideoPlay || type == 1"
            >
                <el-button type="default" @click="goBack(1)">返回</el-button>
                <el-button type="default" @click="saveTemp()">保存</el-button>
                <!-- <el-button >取消</el-button> -->
            </div>
        </div>
    </div>
</template>

<script>
import AES from "@/utils/secret";
import EmptyBox from "@/components/coreManage/emptyBox";
// import SaveTemplate from '@/components/coreManage/saveTemplate'
import VehicleRegistration from "./configurationDetail/components/vehicle/registration";
import VehicleDeviceSetting from "./configurationDetail/components/vehicle/deviceSetting";
import VehicleInfo from "./configurationDetail/components/vehicle/vehicleInfo";
import VehicleTerminalLink from "./configurationDetail/components/vehicle/terminalLink";
import VehicleCANsetting from "./configurationDetail/components/vehicle/CANsetting";
import CallBarring from "./configurationDetail/components/telephoneMonitor/callBarring";
import TeleNumber from "./configurationDetail/components/telephoneMonitor/teleNumber";
import DataUp from "./configurationDetail/components/gnssSettings/dataUp";
import GnssSetting from "./configurationDetail/components/gnssSettings/gnssSetting";
import Params from "./configurationDetail/components/audioVedioSettings/params";
import ChannelList from "./configurationDetail/components/audioVedioSettings/channelList";
import ChannelParams from "./configurationDetail/components/audioVedioSettings/channelParams";
import VedioParams from "./configurationDetail/components/audioVedioSettings/vedioParams";
import AlarmAbility from "./configurationDetail/components/audioVedioSettings/alarmAbility";
import ALarmParams from "./configurationDetail/components/audioVedioSettings/aLarmParams";
import WakeupMode from "./configurationDetail/components/audioVedioSettings/wakeupMode";
import BasicSetting from "./configurationDetail/components/locateUpload/basicSetting";
import IntervalSetting from "./configurationDetail/components/locateUpload/intervalSetting";
import Service from "./configurationDetail/components/serviceSettings/service";
import AuthenticateIC from "./configurationDetail/components/serviceSettings/authenticateIC";
import SecService from "./configurationDetail/components/serviceSettings/secService";
import DiskFormat from "./configurationDetail/components/storageSettings/diskFormat";
import BasicAlarm from "./configurationDetail/components/alarmSettings/basicAlarm";
import Violation from "./configurationDetail/components/alarmSettings/violation";
import Overspeed from "./configurationDetail/components/alarmSettings/overspeed";
import FatigueDriving from "./configurationDetail/components/alarmSettings/fatigueDriving";
import Crash from "./configurationDetail/components/alarmSettings/crash";
import AlarmVolumn from "./configurationDetail/components/alarmSettings/alarmVolumn";
import Elefence from "./configurationDetail/components/alarmSettings/elefence";
import Adas from "./configurationDetail/components/safeSettings/adas";
import Dsm from "./configurationDetail/components/safeSettings/dsm";
import Bsd from "./configurationDetail/components/safeSettings/bsd";
import TirePressure from "./configurationDetail/components/safeSettings/tirePressure";
import AngularVelocity from "./configurationDetail/components/safeSettings/angularVelocity";
import PreviewSetting from "./configurationDetail/components/imageVideo/previewSetting";
import CaptureSetting from "./configurationDetail/components/imageVideo/captureSetting";
import Ipc from "./configurationDetail/components/imageVideo/ipc";
import VedioSetting from "./configurationDetail/components/imageVideo/vedioSetting";
import CvbsParams from "./configurationDetail/components/imageVideo/cvbsParams";
import ManyCenter from "./configurationDetail/components/manyCenter/manyCenter";
import PraviteAdas from "./configurationDetail/components/safePraviteSettings/adas";
import PraviteDba from "./configurationDetail/components/safePraviteSettings/dba";
import PraviteBsd from "./configurationDetail/components/safePraviteSettings/bsd";
import PublicAdas from "./configurationDetail/components/safePublicSetting/adas";
import PublicDba from "./configurationDetail/components/safePublicSetting/dba";
import PublicBsd from "./configurationDetail/components/safePublicSetting/bsd";
// import PublicWhd from './configurationDetail/components/safePublicSetting/whd.vue'
import PublicVehicleRegistration from "./configurationDetail/components/vehiclePublic/registration";
import PublicVehicleDeviceSetting from "./configurationDetail/components/vehiclePublic/deviceSetting";
import PublicVehicleInfo from "./configurationDetail/components/vehiclePublic/vehicleInfo";
import PublicVehicleTerminalLink from "./configurationDetail/components/vehiclePublic/terminalLink";
import PublicVehicleCANsetting from "./configurationDetail/components/vehiclePublic/CANsetting";
import PublicShutDown from "./configurationDetail/components/vehiclePublic/shutDown";
import PublicVolume from "./configurationDetail/components/vehiclePublic/volume";
import PublicCallBarring from "./configurationDetail/components/telephoneMonitorPublic/callBarring";
import PublicTeleNumber from "./configurationDetail/components/telephoneMonitorPublic/teleNumber";
import PublicDataUp from "./configurationDetail/components/gnssSettingsPublic/dataUp";
import PublicGnssSetting from "./configurationDetail/components/gnssSettingsPublic/gnssSetting";
import PublicParams from "./configurationDetail/components/audioVedioSettingsPublic/params";
import PublicChannelList from "./configurationDetail/components/audioVedioSettingsPublic/channelList";
import PublicChannelParams from "./configurationDetail/components/audioVedioSettingsPublic/channelParams";
import PublicVedioParams from "./configurationDetail/components/audioVedioSettingsPublic/vedioParams";
import PublicAlarmAbility from "./configurationDetail/components/audioVedioSettingsPublic/alarmAbility";
import PublicALarmParams from "./configurationDetail/components/audioVedioSettingsPublic/aLarmParams";
import PublicWakeupMode from "./configurationDetail/components/audioVedioSettingsPublic/wakeupMode";
import PublicBasicSetting from "./configurationDetail/components/locateUploadPublic/basicSetting";
import PublicIntervalSetting from "./configurationDetail/components/locateUploadPublic/intervalSetting";
import PublicService from "./configurationDetail/components/serviceSettingsPublic/service";
import PublicAuthenticateIC from "./configurationDetail/components/serviceSettingsPublic/authenticateIC";
import PublicSecService from "./configurationDetail/components/serviceSettingsPublic/secService";
// import PublicApn from './configurationDetail/components/serviceSettingsPublic/apn'
import PublicDiskFormat from "./configurationDetail/components/storageSettingsPublic/diskFormat";
import PublicBasicAlarm from "./configurationDetail/components/alarmSettingsPublic/basicAlarm";
import PublicViolation from "./configurationDetail/components/alarmSettingsPublic/violation";
import PublicOverspeed from "./configurationDetail/components/alarmSettingsPublic/overspeed";
import PublicFatigueDriving from "./configurationDetail/components/alarmSettingsPublic/fatigueDriving";
import PublicCrash from "./configurationDetail/components/alarmSettingsPublic/crash";
import PublicAlarmVolumn from "./configurationDetail/components/alarmSettingsPublic/alarmVolumn";
import PublicElefence from "./configurationDetail/components/alarmSettingsPublic/elefence";
import AdasPublic from "./configurationDetail/components/safeSettingsPublic/adas";
import DsmPublic from "./configurationDetail/components/safeSettingsPublic/dsm";
import BsdPublic from "./configurationDetail/components/safeSettingsPublic/bsd";
import WhdPublic from "./configurationDetail/components/safePublicSetting/whd";
import TirePressurePublic from "./configurationDetail/components/safeSettingsPublic/tirePressure";
import AngularVelocityPublic from "./configurationDetail/components/safeSettingsPublic/angularVelocity";
import PublicPreviewSetting from "./configurationDetail/components/imageVideoPublic/previewSetting";
import PublicCaptureSetting from "./configurationDetail/components/imageVideoPublic/captureSetting";
import PublicIpc from "./configurationDetail/components/imageVideoPublic/ipc";
import PublicVedioSetting from "./configurationDetail/components/imageVideoPublic/vedioSetting";
import PublicCvbsParams from "./configurationDetail/components/imageVideoPublic/cvbsParams";
import firstCenterPublic from "./configurationDetail/components/manyCenterPublic/firstCenter";
import secondCenterPublic from "./configurationDetail/components/manyCenterPublic/secondCenter";
import thirdCenterPublic from "./configurationDetail/components/manyCenterPublic/thirdCenter";
import forthCenterPublic from "./configurationDetail/components/manyCenterPublic/forthCenter";
import fifthCenterPublic from "./configurationDetail/components/manyCenterPublic/fifthCenter.vue";
import sixthCenterPublic from "./configurationDetail/components/manyCenterPublic/sixthCenter";
import PublicManyCenter from "./configurationDetail/components/manyCenterPublic/manyCenter";
import PublicSerial from "./configurationDetail/components/outerSettingPublic/serial";
import PublicProgramMgr from "./configurationDetail/components/outerSettingPublic/programMgr";
import PublicWorkMode from "./configurationDetail/components/muckCarPublic/workMode";
import PublicVehctrl from "./configurationDetail/components/muckCarPublic/vehctrl";
import PublicTcss from "./configurationDetail/components/muckCarPublic/tcss";
import PublicLed from "./configurationDetail/components/muckCarPublic/led";
import PublicInvalidAlarm from "./configurationDetail/components/muckCarPublic/invalidAlarm";
import PublicGsensor from "./configurationDetail/components/muckCarPublic/gsensor";
import PublicCtrl from "./configurationDetail/components/muckCarPublic/ctrl";
import PublicEcu from "./configurationDetail/components/muckCarPublic/ecu";
import PublicVideo from "./configurationDetail/components/pictureVideoPublic/video";
//私有协议模板数据
import PrivateAdas from "./configurationDetail/privateProtocolComponents/privateAdas";
import PrivateBsd from "./configurationDetail/privateProtocolComponents/privateBsd";
import PrivateDba from "./configurationDetail/privateProtocolComponents/privateDba";
import PrivateEventDisplay from "./configurationDetail/privateProtocolComponents/privateEventDisplay";
import PrivateFirstCenter from "./configurationDetail/privateProtocolComponents/privateFirstCenter";
import PrivateFifthCenter from "./configurationDetail/privateProtocolComponents/privateFifthCenter";
import PrivateForthCenter from "./configurationDetail/privateProtocolComponents/privateForthCenter";
import PrivateIOOutput from "./configurationDetail/privateProtocolComponents/privateIOOutput";
import PrivateOverSpeed from "./configurationDetail/privateProtocolComponents/privateOverSpeed";
import PrivateOvertimeDriving from "./configurationDetail/privateProtocolComponents/privateOvertimeDriving";
import PrivateRegister from "./configurationDetail/privateProtocolComponents/privateRegister";
import PrivateSecondCenter from "./configurationDetail/privateProtocolComponents/privateSecondCenter";
import PrivateShutDown from "./configurationDetail/privateProtocolComponents/privateShutDown";
import PrivateSixthCenter from "./configurationDetail/privateProtocolComponents/privateSixthCenter";
import PrivateThirdCenter from "./configurationDetail/privateProtocolComponents/privateThirdCenter";
import PrivateVehicleInfo from "./configurationDetail/privateProtocolComponents/privateVehicleInfo";
import PrivateVideo from "./configurationDetail/privateProtocolComponents/privateVideo";
import PrivateVolume from "./configurationDetail/privateProtocolComponents/privateVolume";
import PrivateWhd from "./configurationDetail/privateProtocolComponents/privateWhd";
import { WebControl } from "web-control";
export default {
    components: {
        EmptyBox,
        // SaveTemplate,
        VehicleRegistration,
        VehicleDeviceSetting,
        VehicleInfo,
        VehicleTerminalLink,
        VehicleCANsetting,
        CallBarring,
        TeleNumber,
        DataUp,
        GnssSetting,
        Params,
        ChannelList,
        ChannelParams,
        VedioParams,
        AlarmAbility,
        ALarmParams,
        WakeupMode,
        BasicSetting,
        //车辆参数不需要模板
        IntervalSetting,
        Service,
        AuthenticateIC,
        SecService,
        DiskFormat,
        BasicAlarm,
        Violation,
        Overspeed,
        FatigueDriving,
        Crash,
        AlarmVolumn,
        Elefence,
        Adas,
        PreviewSetting,
        Dsm,
        Bsd,
        TirePressure,
        AngularVelocity,
        CaptureSetting,
        Ipc,
        VedioSetting,
        CvbsParams,
        ManyCenter,
        PraviteAdas,
        PraviteDba,
        PraviteBsd,
        PublicAdas,
        PublicDba,
        PublicBsd,
        WhdPublic,
        PublicVehicleRegistration,
        PublicVehicleDeviceSetting,
        PublicVehicleInfo,
        PublicVehicleTerminalLink,
        PublicVehicleCANsetting,
        PublicShutDown,
        PublicVolume,
        PublicCallBarring,
        PublicTeleNumber,
        PublicDataUp,
        PublicGnssSetting,
        PublicParams,
        PublicChannelList,
        PublicChannelParams,
        PublicVedioParams,
        PublicAlarmAbility,
        PublicALarmParams,
        PublicWakeupMode,
        PublicBasicSetting,
        PublicIntervalSetting,
        PublicService,
        PublicAuthenticateIC,
        PublicSecService,
        PublicDiskFormat,
        // PublicApn,
        PublicBasicAlarm,
        PublicViolation,
        PublicOverspeed,
        PublicFatigueDriving,
        PublicCrash,
        PublicAlarmVolumn,
        PublicElefence,
        AdasPublic,
        DsmPublic,
        BsdPublic,
        TirePressurePublic,
        AngularVelocityPublic,
        PublicPreviewSetting,
        PublicCaptureSetting,
        PublicIpc,
        PublicVedioSetting,
        PublicCvbsParams,
        PublicManyCenter,
        firstCenterPublic,
        secondCenterPublic,
        thirdCenterPublic,
        forthCenterPublic,
        fifthCenterPublic,
        sixthCenterPublic,
        PublicSerial,
        PublicProgramMgr,
        PublicWorkMode,
        PublicVehctrl,
        PublicTcss,
        PublicLed,
        PublicInvalidAlarm,
        PublicGsensor,
        PublicCtrl,
        PublicEcu,
        PublicVideo,
        //私有协议组件
        PrivateAdas,
        PrivateBsd,
        PrivateDba,
        PrivateEventDisplay,
        PrivateFirstCenter,
        PrivateFifthCenter,
        PrivateForthCenter,
        PrivateIOOutput,
        PrivateOverSpeed,
        PrivateOvertimeDriving,
        PrivateRegister,
        PrivateSecondCenter,
        PrivateShutDown,
        PrivateSixthCenter,
        PrivateThirdCenter,
        PrivateVehicleInfo,
        PrivateVideo,
        PrivateVolume,
        PrivateWhd,
    },
    props: [
        "dialogTableVisible",
        "historyId",
        "historyType",
        "historyParamsBefore",
    ],
    data() {
        return {
            noneVideoPlay: false, // 是否显示控件
            type: this.$route.query.type,
            id: this.$route.query.id,
            organizeId: this.$route.query.organizeId,
            detailShow: false,
            componentName: "",
            notAllTab: true,
            channelForm: {},
            // 初始化data
            initData: {},
            initFileData: {},
            sideBarItem: [
                {
                    title: "车辆设备",
                    index: "1",
                    children: [
                        {
                            label: "注册参数",
                            value: "VehicleRegistration",
                            commandIdList: ["0081", "0082", "0083", "0084"],
                        },
                        // {
                        //   label: '设备设置',
                        //   value: 'VehicleDeviceSetting',
                        //   commandId: '0076',
                        // },
                        {
                            label: "车辆信息",
                            value: "VehicleInfo",
                            commandIdList: [
                                "IsApiRegisterInfo",
                                "IsApiVehicleRecord",
                                "IsApiDriverCard",
                            ],
                        },
                        {
                            label: "终端链路",
                            value: "VehicleTerminalLink",
                            commandIdList: [
                                "0001",
                                "0002",
                                "0003",
                                "0004",
                                "0005",
                                "0006",
                                "0007",
                            ],
                        },
                        {
                            label: "CAN设置",
                            value: "VehicleCANsetting",
                            commandIdList: [
                                "0100",
                                "0101",
                                "0102",
                                "0103",
                                "0110",
                            ],
                        },
                    ],
                },
                {
                    title: "图像视频设置",
                    index: "2",
                    children: [
                        {
                            label: "预览设置",
                            value: "PreviewSetting",
                            commandIdList: [
                                "0070",
                                "0071",
                                "0072",
                                "0073",
                                "0074",
                            ],
                        },
                        {
                            label: "抓拍设置",
                            value: "CaptureSetting",
                            commandIdList: ["0064", "0065"],
                        },
                        // {
                        //   label: 'IPC',
                        //   value: 'Ipc'
                        // },
                        // {
                        //   label: '视频设置',
                        //   value: 'VedioSetting'
                        // },
                        // {
                        //   label: 'CVBS参数',
                        //   value: 'CvbsParams'
                        // }
                    ],
                },
                {
                    title: "主动安全设置-苏标",
                    index: "3",
                    children: [
                        {
                            label: "ADAS",
                            value: "Adas",
                            commandIdList: ["F364"],
                        },
                        {
                            label: "DSM",
                            value: "Dsm",
                            commandIdList: ["F365"],
                        },
                        {
                            label: "BSD",
                            value: "Bsd",
                            commandIdList: ["F367"],
                        },
                        {
                            label: "胎压",
                            value: "TirePressure",
                            commandIdList: ["F366"],
                        },
                        {
                            label: "角速度加速度",
                            value: "AngularVelocity",
                            commandIdList: ["F368"],
                        },
                    ],
                },
                {
                    title: "主动安全设置",
                    index: "3.1",
                    children: [
                        {
                            label: "ADAS",
                            value: "PraviteAdas",
                            commandIdList: [
                                "IsApiFcwInfoList",
                                "IsApiHmwInfoList",
                                "IsApiLdwInfoList",
                                "IsApiPcwInfoList",
                                "IsApiTsrInfoList",
                            ],
                        },
                        {
                            label: "DBA",
                            value: "PraviteDba",
                            commandIdList: [],
                        },
                        {
                            label: "BSD",
                            value: "PraviteBsd",
                            commandIdList: [],
                        },
                    ],
                },
                {
                    title: "报警设置",
                    index: "4",
                    children: [
                        {
                            label: "基础报警",
                            value: "BasicAlarm",
                            commandIdList: [
                                "0050",
                                "0051",
                                "0052",
                                "0053",
                                "0054",
                            ],
                        },
                        // {
                        //   label: '违规行驶时段',
                        //   value: 'Violation'
                        // },
                        {
                            label: "超速报警",
                            value: "Overspeed",
                            commandIdList: ["0055", "0056"],
                        },
                        {
                            label: "疲劳驾驶",
                            value: "FatigueDriving",
                            commandIdList: [
                                "0057",
                                "0058",
                                "0059",
                                "005A",
                                "005C",
                                "IsApiFatigueDrive",
                            ],
                        },
                        {
                            label: "碰撞侧翻报警",
                            value: "Crash",
                            commandIdList: ["005D", "005E"],
                        },
                        // {
                        //   label: '报警音量',
                        //   value: 'AlarmVolumn'
                        // },
                        {
                            label: "电子围栏",
                            value: "Elefence",
                            commandIdList: ["0031"],
                        },
                    ],
                },
                // {
                //   title:'存储设置',
                //   index: '5',
                //   children:[
                // {
                //   label: '磁盘格式化',
                //   value: 'DiskFormat'
                // }
                //   ]
                // },
                {
                    title: "服务器设置",
                    index: "6",
                    children: [
                        {
                            label: "服务器配置",
                            value: "Service",
                            commandIdList: [
                                "0010",
                                "0011",
                                "0012",
                                "0013",
                                "0014",
                                "0015",
                                "0016",
                                "0017",
                            ],
                        },
                        {
                            label: "IC卡认证",
                            value: "AuthenticateIC",
                            commandIdList: ["001A", "001B", "001C", "001D"],
                        },
                        // {
                        //   label: '从服务器参数',
                        //   value: 'SecService'
                        // }
                    ],
                },
                {
                    title: "定位上传设置",
                    index: "7",
                    children: [
                        {
                            label: "基础设置",
                            value: "BasicSetting",
                            commandIdList: ["0020", "0021", "0030"],
                        },
                        {
                            label: "上报间隔设置",
                            value: "IntervalSetting",
                            commandIdList: [
                                "0027",
                                "0028",
                                "0029",
                                "0022",
                                "002C",
                                "002D",
                                "002E",
                                "002F",
                            ],
                        },
                    ],
                },
                {
                    title: "通话监听设置",
                    index: "8",
                    children: [
                        {
                            label: "通话限制参数",
                            value: "CallBarring",
                            commandIdList: [
                                "0045",
                                "0046",
                                "0047",
                                "0048",
                                "0049",
                            ],
                        },
                        {
                            label: "相关电话号码参数",
                            value: "TeleNumber",
                            commandIdList: [
                                "0040",
                                "0041",
                                "0042",
                                "0043",
                                "0044",
                            ],
                        },
                    ],
                },
                {
                    title: "GNSS设置",
                    index: "9",
                    children: [
                        {
                            label: "数据上传",
                            value: "DataUp",
                            commandIdList: [
                                "0094",
                                "0095",
                                "0093",
                                "0092",
                                "0091",
                            ],
                        },
                        {
                            label: "GNSS定位模式",
                            value: "GnssSetting",
                            commandIdList: ["0090"],
                        },
                    ],
                },
                {
                    title: "音视频设置",
                    index: "10",
                    children: [
                        {
                            label: "音视频参数",
                            value: "Params",
                            commandIdList: ["0075"],
                        },
                        {
                            label: "音视频通道列表",
                            value: "ChannelList",
                            commandIdList: ["0076"],
                        },
                        {
                            label: "单独视频通道参数",
                            value: "ChannelParams",
                            commandIdList: ["0077"],
                        },
                        {
                            label: "特殊报警录像参数",
                            value: "VedioParams",
                            commandIdList: ["0079"],
                        },
                        {
                            label: "视频相关报警使能",
                            value: "AlarmAbility",
                            commandIdList: ["007A"],
                        },
                        {
                            label: "图像分析报警参数",
                            value: "ALarmParams",
                            commandIdList: ["007B"],
                        },
                        {
                            label: "终端休眠唤醒模式",
                            value: "WakeupMode",
                            commandIdList: ["007C"],
                        },
                    ],
                },
                {
                    title: "多中心设置",
                    index: "11",
                    children: [
                        {
                            label: "多中心配置",
                            value: "ManyCenter",
                            commandIdList: ["IsApiPlatform"],
                        },
                    ],
                },
            ],
            sideBarItem2: [
                {
                    title: "车辆设备",
                    index: "1",
                    children: [
                        {
                            label: "注册参数",
                            value: "PublicVehicleRegistration",
                            commandIdList: ["0081", "0082", "0083", "0084"],
                        },
                        // {
                        //   label: '设备设置',
                        //   value: 'VehicleDeviceSetting',
                        //   commandId: '0076',
                        // },
                        {
                            label: "车辆信息",
                            value: "PublicVehicleInfo",
                            commandIdList: [
                                "IsApiRegisterInfo",
                                "IsApiVehicleRecord",
                                "IsApiDriverCard",
                            ],
                        },
                        // {
                        //   label: '终端链路',
                        //   value: 'PublicVehicleTerminalLink',
                        //   commandIdList: ['0001','0002','0003','0004','0005','0006','0007'],
                        // },
                        // {
                        //   label: 'CAN设置',
                        //   value: 'PublicVehicleCANsetting',
                        //   commandIdList: ['0100','0101','0102','0103','0110']
                        // },
                        {
                            label: "延时关机时间",
                            value: "PublicShutDown",
                            commandIdList: [],
                        },
                        {
                            label: "音量设置",
                            value: "PublicVolume",
                            commandIdList: [],
                        },
                    ],
                },
                // {
                //   title:'图像视频设置',
                //   index: '2',
                //   children:[
                //     {
                //       label: '预览设置',
                //       value: 'PublicPreviewSetting',
                //       commandIdList: ['0070','0071','0072','0073','0074']
                //     },
                //     {
                //       label: '抓拍设置',
                //       value: 'PublicCaptureSetting',
                //       commandIdList: ['0064','0065']
                //     },
                // {
                //   label: 'IPC',
                //   value: 'Ipc'
                // },
                // {
                //   label: '视频设置',
                //   value: 'VedioSetting'
                // },
                // {
                //   label: 'CVBS参数',
                //   value: 'CvbsParams'
                // }
                //   ]
                // },
                // {
                //   title:'主动安全设置-苏标',
                //   index: '3',
                //   children:[
                //     {
                //       label: 'ADAS',
                //       value: 'AdasPublic',
                //       commandIdList: ['F364']
                //     },
                //     {
                //       label: 'DSM',
                //       value: 'DsmPublic',
                //       commandIdList: ['F365']
                //     },
                //     {
                //       label: 'BSD',
                //       value: 'BsdPublic',
                //       commandIdList: ['F367']
                //     },
                //     {
                //       label: '胎压',
                //       value: 'TirePressurePublic',
                //       commandIdList: ['F366']
                //     },
                //     {
                //       label: '角速度加速度',
                //       value: 'AngularVelocityPublic',
                //       commandIdList: ['F368']
                //     }
                //   ]
                // },
                // {
                //   title:'主动安全设置',
                //   index: '3.1',
                //   children:[
                //     {
                //       label: 'ADAS',
                //       value: 'PraviteAdas',
                //       commandIdList: ['IsApiFcwInfoList', 'IsApiHmwInfoList', 'IsApiLdwInfoList', 'IsApiPcwInfoList', 'IsApiTsrInfoList']
                //     },
                //     {
                //       label: 'DBA',
                //       value:'PraviteDba',
                //       commandIdList: ['IsApiDbaInfoList']
                //     },
                //     {
                //       label: 'BSD',
                //       value:'PraviteBsd',
                //       commandIdList: []
                //     },
                //   ]
                // },
                {
                    title: "主动安全设置",
                    index: "3.1",
                    children: [
                        {
                            label: "ADAS",
                            value: "PublicAdas",
                            commandIdList: [
                                "IsApiFcwInfoList",
                                "IsApiHmwInfoList",
                                "IsApiLdwInfoList",
                                "IsApiPcwInfoList",
                                "IsApiTsrInfoList",
                            ],
                        },
                        {
                            label: "DBA",
                            value: "PublicDba",
                            commandIdList: [
                                "IsApiDriverAbsentedInfo",
                                "IsApiDriverBlockCameraInfo",
                                "IsApiDriverCallingInfo",
                                "IsApiDriverEyeClosedInfo",
                                "IsApiDriverInattentionInfo",
                                "IsApiDriverSafetyBeltInfo",
                                "IsApiDriverSmokingInfo",
                                "IsApiDriverSunglassesInfo",
                                "IsApiDriverYawnInfo",
                            ],
                        },
                        {
                            label: "BSD",
                            value: "PublicBsd",
                            commandIdList: [],
                        },
                        {
                            label: "WHD/玩手机",
                            value: "WhdPublic",
                            commandIdList: [],
                        },
                    ],
                },
                // {
                //   title:'报警设置',
                //   index: '4',
                //   children:[
                //     {
                //       label: '基础报警',
                //       value: 'PublicBasicAlarm',
                //       commandIdList: ['0050','0051','0052','0053','0054']
                //     },
                //     // {
                //     //   label: '违规行驶时段',
                //     //   value: 'Violation'
                //     // },
                //     {
                //       label: '超速报警',
                //       value: 'PublicOverspeed',
                //       commandIdList: ['0056','005B','0055']
                //     },
                //     {
                //       label: '疲劳驾驶',
                //       value: 'PublicFatigueDriving',
                //       commandIdList: ['0057','0058','0059','005A','005C','IsApiFatigueDrive']
                //     },
                //     {
                //       label: '碰撞侧翻报警',
                //       value: 'PublicCrash',
                //       commandIdList: ['005D','005E']
                //     },
                //     // {
                //     //   label: '报警音量',
                //     //   value: 'AlarmVolumn'
                //     // },
                //     {
                //       label: '电子围栏',
                //       value: 'PublicElefence',
                //       commandIdList: ['0031']
                //     },
                //   ]
                // },
                // {
                //   title:'存储设置',
                //   index: '5',
                //   children:[
                // {
                //   label: '磁盘格式化',
                //   value: 'DiskFormat'
                // }
                //   ]
                // },
                // {
                //   title:'服务器设置',
                //   index: '6',
                //   children:[
                //     {
                //       label: '服务器配置',
                //       value: 'PublicService',
                //       commandIdList: ['0010','0011','0012','0013','0014','0015','0016','0017']
                //     },
                //     {
                //       label: 'IC卡认证',
                //       value: 'PublicAuthenticateIC',
                //       commandIdList: ['001A','001B','001C','001D']
                //     },
                // {
                //   label:'APN设置',
                //   value:'PublicApn',
                //   commandIdList:[]
                // }
                // {
                //   label: '从服务器参数',
                //   value: 'SecService'
                // }
                //   ]
                // },
                // {
                //   title:'定位上传设置',
                //   index: '7',
                //   children:[
                //     {
                //       label: '基础设置',
                //       value: 'PublicBasicSetting',
                //       commandIdList: ['0020','0021','0030']
                //     },
                //     {
                //       label: '上报间隔设置',
                //       value: 'PublicIntervalSetting',
                //       commandIdList: ['0027','0028','0029','0022','002C','002D','002E','002F']
                //     }
                //   ]
                // },
                // {
                //   title:'通话监听设置',
                //   index: '8',
                //   children:[
                //     {
                //       label: '通话限制参数',
                //       value: 'PublicCallBarring',
                //       commandIdList: ['0045','0046','0047','0048','0049']
                //     },
                //     {
                //       label: '相关电话号码参数',
                //       value: 'PublicTeleNumber',
                //       commandIdList: ['0040','0041','0042','0043','0044']
                //     }
                //   ]
                // },
                // {
                //   title:'GNSS设置',
                //   index: '9',
                //   children:[
                //     {
                //       label: '数据上传',
                //       value: 'PublicDataUp',
                //       commandIdList: ['0094','0095','0093','0092','0091']
                //     },
                //     {
                //       label: 'GNSS定位模式',
                //       value: 'PublicGnssSetting',
                //       commandIdList: ['0090']
                //     }
                //   ]
                // },
                // {
                //   title:'音视频设置',
                //   index: '10',
                //   children:[
                //     {
                //       label: '音视频参数',
                //       value: 'PublicParams',
                //       commandIdList: ['0075']
                //     },
                //     {
                //       label: '音视频通道列表',
                //       value: 'PublicChannelList',
                //       commandIdList: ['0076']
                //     },
                //     {
                //       label: '单独视频通道参数',
                //       value: 'PublicChannelParams',
                //       commandIdList: ['0077']
                //     },
                //     {
                //       label: '特殊报警录像参数',
                //       value: 'PublicVedioParams',
                //       commandIdList: ['0079']
                //     },
                //     {
                //       label: '视频相关报警使能',
                //       value: 'PublicAlarmAbility',
                //       commandIdList: ['007A']
                //     },
                //     {
                //       label: '图像分析报警参数',
                //       value: 'PublicALarmParams',
                //       commandIdList: ['007B']
                //     },
                //     {
                //       label: '终端休眠唤醒模式',
                //       value: 'PublicWakeupMode',
                //       commandIdList: ['007C']
                //     },
                //   ]
                // },
                {
                    title: "多中心设置",
                    index: "11",
                    children: [
                        {
                            label: "多中心配置",
                            value: "PublicManyCenter",
                            commandIdList: ["IsApiPlatform"],
                        },
                    ],
                },
                {
                    title: "外设输出设置",
                    index: "12",
                    children: [
                        {
                            label: "声光报警器",
                            value: "PublicSerial",
                            commandIdList: ["IsApiSerialInfo"],
                        },
                        {
                            label: "视频输出设置",
                            value: "PublicProgramMgr",
                            commandIdList: ["IsApiProgramMgrInfo"],
                        },
                    ],
                },
            ],
            aesPassword: "",
            saveTempalteData: {
                menuList: [],
                configParams: [],
            },
            hasIotHikvision: null,
            adasChannelKeys: [
                "IsApiFcwInfoList",
                "IsApiHmwInfoList",
                "IsApiLdwInfoList",
                "IsApiPcwInfoList",
                "IsApiTsrInfoList",
                "IsApiAdasGlobal",
            ],
            adasTriChannels: [
                "IsApiFcwTriggerInfo",
                "IsApiHmwTriggerInfo",
                "IsApiLdwTriggerInfo",
                "IsApiPcwTriggerInfo",
                "IsApiTsrTriggerInfo",
            ],
            dbaChannelKeys: [
                "IsApiDriverAbsentedInfo",
                "IsApiDriverBlockCameraInfo",
                "IsApiDriverCallingInfo",
                "IsApiDriverEyeClosedInfo",
                "IsApiDriverInattentionInfo",
                "IsApiDriverSafetyBeltInfo",
                "IsApiDriverSmokingInfo",
                "IsApiDriverSunglassesInfo",
                "IsApiRapidAccelerationInfo",
                "IsApiRapidDecelerationInfo",
                "IsApiRapidTurnInfo",
                "IsApiDriverAbnormaInfo",
                "IsApiDriveTimeInfo",
                "IsApiDriveChangeInfo",
            ],
            dbaTriChannels: [
                "IsApiDriverEyeClosedTriggerList",
                "IsApiDriverCallingTriggerList",
                "IsApiDriverSmokingTriggerList",
                "IsApiDriverInattentionTriggerList",
                "IsApiDriverAbsentedTriggerList",
                "IsApiDriverBlockCameraTriggerList",
                "IsApiDriverSafetyBeltTriggerList",
                "IsApiDriverSunglassesTriggerList",
                "IsApiDBAGlobal",
                "IsApiRapidAccelerationTriggerList",
                "IsApiRapidDecelerationTriggerList",
                "IsApiRapidTurnTriggerList",
                "IsApiDriverAbnormaTriggerList",
                "IsApiDriveTimeTriggerList",
                "IsApiDriveChangeTriggerList",
            ],
            bsdChannelKeys: [
                "IsApiBsdInfo",
                "IsApiBsdTriggerList",
                "IsApiWhdNoHandInfo",
                "IsApiWhdSingleHandInfo",
                "IsApiWhdPlayMobilePhoneInfo",
                "IsApiWhdNoHandTriggerList",
                "IsApiWhdSingleHandTriggerList",
                "IsApiWhdPlayMobilePhoneTriggerList",
                "IsApiWhdInfo",
            ],
            centerOthers: [
                "IsApiPlatformOthers0",
                "IsApiPlatformOthers1",
                "IsApiPlatformOthers2",
                "IsApiPlatformOthers3",
                "IsApiPlatformOthers4",
                "IsApiPlatformOthers5",
            ],
            allChannelKeys: [],
            isapiData: {
                menuList: [],
                configParams: [],
            },
            privateData: {
                menuList: [],
                ehomeParams: [],
                capability: "",
            },
            enumerationData: {
                //配置页面下拉框枚举
                verifyInternetList: [],
                verifyInternetJson: {},
                bandInternetList: [],
                bandInternetJson: {},
                pulseSettingSpeedSourceList: [],
                pulseSettingSpeedSourceJson: {},
                audioOutPutList: [],
                audioOutPutJson: {},
                voiceCallOutputList: [],
                voiceCallOutputJson: {},
                reportStrategyList0: [],
                reportStrategyJson0: {},
                reportStrategyList1: [],
                reportStrategyJson1: {},
                reportStrategyList2: [],
                reportStrategyJson2: {},
                reportStrategyList3: [],
                reportStrategyJson3: {},
                reportStrategyList4: [],
                reportStrategyJson4: {},
                reportStrategyList5: [],
                reportStrategyJson5: {},
                accessProtocolList0: [],
                accessProtocolJson0: {},
                extensionProtocolList0: [[], [], [], []],
                extensionProtocolJson0: [{}, {}, {}, {}],
                accessProtocolList1: [],
                accessProtocolJson1: {},
                extensionProtocolList1: [[], [], [], []],
                extensionProtocolJson1: [{}, {}, {}, {}],
                accessProtocolList2: [],
                accessProtocolJson2: {},
                extensionProtocolList2: [[], [], [], []],
                extensionProtocolJson2: [{}, {}, {}, {}],
                accessProtocolList3: [],
                accessProtocolJson3: {},
                extensionProtocolList3: [[], [], [], []],
                extensionProtocolJson3: [{}, {}, {}, {}],
                accessProtocolList4: [],
                accessProtocolJson4: {},
                extensionProtocolList4: [[], [], [], []],
                extensionProtocolJson4: [{}, {}, {}, {}],
                accessProtocolList5: [],
                accessProtocolJson5: {},
                extensionProtocolList5: [[], [], [], []],
                extensionProtocolJson5: [{}, {}, {}, {}],
                plateColorGenericList: [],
                plateColorGenericJson: {},
                plateTypeGenericList: [],
                plateTypeGenericJson: {},
                bsdDetectList0: [],
                bsdDetectJson0: {},
                bsdDetectList1: [],
                bsdDetectJson1: {},
                bsdDetectList2: [],
                bsdDetectJson2: {},
                bsdDetectList3: [],
                bsdDetectJson3: {},
                bsdDetectList4: [],
                bsdDetectJson4: {},
                bsdDetectList5: [],
                bsdDetectJson5: {},
                bsdDetectList6: [],
                bsdDetectJson6: {},
                bsdDetectList7: [],
                bsdDetectJson7: {},
                bsdDetectList8: [],
                bsdDetectJson8: {},
                resList1_0: [],
                resJson1_0: {},
                resList1_1: [],
                resJson1_1: {},
                resList2_0: [],
                resJson2_0: {},
                resList2_1: [],
                resJson2_1: {},
                resList3_0: [],
                resJson3_0: {},
                resList3_1: [],
                resJson3_1: {},
                resList4_0: [],
                resJson4_0: {},
                resList4_1: [],
                resJson4_1: {},
                resList5_0: [],
                resJson5_0: {},
                resList5_1: [],
                resJson5_1: {},
                resList6_0: [],
                resJson6_0: {},
                resList6_1: [],
                resJson6_1: {},
                resList7_0: [],
                resJson7_0: {},
                resList7_1: [],
                resJson7_1: {},
                resList8_0: [],
                resJson8_0: {},
                resList8_1: [],
                resJson8_1: {},
                resList9_0: [],
                resJson9_0: {},
                resList9_1: [],
                resJson9_1: {},
                resList10_0: [],
                resJson10_0: {},
                resList10_1: [],
                resJson10_1: {},
                resList11_0: [],
                resJson11_0: {},
                resList11_1: [],
                resJson11_1: {},
                resList12_0: [],
                resJson12_0: {},
                resList12_1: [],
                resJson12_1: {},
                resList13_0: [],
                resJson13_0: {},
                resList13_1: [],
                resJson13_1: {},
                resList14_0: [],
                resJson14_0: {},
                resList14_1: [],
                resJson14_1: {},
                resList11_0: [],
                resJson15_0: {},
                resList15_1: [],
                resJson15_1: {},
                resList16_0: [],
                resJson16_0: {},
                resList16_1: [],
                resJson16_1: {},
            },
            menuActiveRefFormName: "",
        };
    },
    watch: {
        initData: {
            handler(val) {
                if (
                    val["IsApiPlatform"] &&
                    val["IsApiPlatform"]["platformInfoList"] &&
                    val["IsApiPlatform"]["platformInfoList"].length
                ) {
                    for (
                        let i = 0;
                        i < val["IsApiPlatform"]["platformInfoList"].length;
                        i++
                    ) {
                        if (
                            val["IsApiPlatform"]["platformInfoList"][i][
                                "serverInfoList"
                            ][0].hostName == "iot81.hikvisionauto.com"
                        ) {
                            this.hasIotHikvision =
                                this.hasIotHikvision != null
                                    ? this.hasIotHikvision
                                    : i;
                            break;
                        } else {
                            this.hasIotHikvision = null;
                        }
                    }
                }
                // this.tempalteData = JSON.parse(JSON.stringify(val))
            },
            deep: true,
            immediate: true,
        },
        dialogTableVisible: {
            handler(val) {
                if (!val) {
                    if (val == undefined) {
                    } else {
                        if (
                            this.videoPlayControl !== undefined &&
                            this.videoPlayControl !== null
                        ) {
                            //this.videoPlayControl.JS_Disconnect();
                            this.videoPlayControl.JS_DestroyWnd().then(
                                () => {},
                                () => {
                                    // console.log('控件销毁失败');
                                }
                            );
                            this.videoPlayControl = null;
                            this.noneVideoPlay = false;
                        }
                    }
                } else {
                    this.getDeviceConfigParams();
                }
            },
            deep: true,
            immediate: true,
        },
    },
    created() {
        // console.log(this.dialogTableVisible)
        // if(this.dialogTableVisible == undefined){
        //   this.dialogTableVisible == this.$route.query.dialogTableVisible
        // }
        // console.log(this.$route.query)
        // if(!this.$route.query.id){
        //   this.id = this.historyId
        //   this.type = this.historyType
        //   // this.dialogTableVisible == this.$route.query.dialogTableVisible
        // }
        // this.sideBarItem = this.isapiData['menuList'].length ? this.isapiData['menuList'] : this.sideBarItem;
        // this.componentName = this.isapiData['menuList'].length ? this.isapiData['menuList'][0]['children'][0]['value'] : 'VehicleRegistration';
        // this.templateDataSplit();
        this.allChannelKeys = [
            ...this.adasChannelKeys,
            ...this.adasTriChannels,
            ...this.dbaChannelKeys,
            ...this.dbaTriChannels,
            ...this.bsdChannelKeys,
            ...this.centerOthers,
        ];
        //this.getTemplate()
    },
    methods: {
        //ISAPI数据保存为模板
        makeTemplateData() {
            this.saveTempalteData["menuList"] = this.isapiData["menuList"];
            for (let key in this.initData) {
                if (key.indexOf("_") == -1) {
                    //不属于路口报警协议
                    if (key.indexOf("Capability") == -1) {
                        if (key == "IsApiZtVehctrl") {
                            let isapiInfo = {
                                IsApiZtVehctrl: this.initData["IsApiZtVehctrl"],
                            };
                            let isapiCap = {
                                IsApiZtVehctrlCapability:
                                    this.initData["IsApiZtVehctrlCapability"],
                            };
                            this.saveTempalteData["configParams"].push({
                                protocol: [isapiInfo, isapiCap],
                                params: "",
                                channelId: -1,
                                controlPwd: this.aesPassword,
                            });
                        } else if (key == "IsApiPlatform") {
                            this.initData["IsApiPlatform"][
                                "platformInfoList"
                            ].forEach((item, index) => {
                                let isapiInfo = {
                                    IsApiPlatform: { platformInfoList: [] },
                                };
                                let isapiOther = {};
                                let isapiCap = {};
                                isapiInfo["IsApiPlatform"][
                                    "platformInfoList"
                                ].push(item);
                                isapiOther[
                                    "IsApiLocationReportOthers" + index
                                ] = item["IsApiLocationReportOthers" + index];
                                isapiCap["IsApiPlatformCapability"] =
                                    this.initData["IsApiPlatformCapability"];
                                this.saveTempalteData["configParams"].push({
                                    protocol: [isapiInfo, isapiOther, isapiCap],
                                    params: "",
                                    channelId: -1,
                                    controlPwd: "",
                                });
                            });
                        } else if (this.initData[key] === "") {
                        } else {
                            if (this.allChannelKeys.indexOf(key) == -1) {
                                let isapiInfo = {};
                                let isapiCap = {};
                                isapiInfo[key] = this.initData[key];
                                isapiCap[key + "Capability"] =
                                    this.initData[key + "Capability"];
                                this.saveTempalteData["configParams"].push({
                                    protocol: [isapiInfo, isapiCap],
                                    params: "",
                                    channelId: -1,
                                    controlPwd: "",
                                });
                            }
                        }
                    }
                } else {
                    if (key.substring(0, 18) == "IsApiZtGsensorTurn") {
                        let isapiInfo = {};
                        let isapiCap = {};
                        let isapiTurnTri = {};
                        isapiInfo[key.substring(0, 18)] = this.initData[key];
                        isapiCap["IsApiZtGsensorTurnCapability"] =
                            this.initData["IsApiZtGsensorTurnCapability"];
                        isapiTurnTri["IsApiZtGsensorTriggers"] =
                            this.initData[
                                "IsApiZtGsensorTriggers_" +
                                    key.substring(19, 20)
                            ];
                        this.saveTempalteData["configParams"].push({
                            protocol: [isapiInfo, isapiCap, isapiTurnTri],
                            params: JSON.stringify({
                                GsensorTurnType:
                                    this.initData[key]["gsensorTurnType"],
                            }),
                            channelId: -1,
                            controlPwd: "",
                        });
                    }
                }
            }
            for (let key in this.channelForm) {
                //channel_
                let channelId = key.substring(8, 9);
                for (let key_ in this.channelForm[key]) {
                    if (
                        key_ != "IsApiAdasGlobal" &&
                        key_ != "IsApiDBAGlobal" &&
                        key_ != "IsApiWhdInfo"
                    ) {
                        if (
                            key_ == "IsApiFcwInfoList" ||
                            key_ == "IsApiHmwInfoList" ||
                            key_ == "IsApiLdwInfoList" ||
                            key_ == "IsApiPcwInfoList" ||
                            key_ == "IsApiTsrInfoList"
                        ) {
                            let isapiInfo = {};
                            let isapiTriInfo = {};
                            let isapiCap = {};
                            isapiInfo[key_] = this.channelForm[key][key_];
                            isapiCap[key_ + "Capability"] =
                                this.channelForm[key][key_ + "Capability"];
                            isapiTriInfo[key_.substring(0, 8) + "TriggerInfo"] =
                                this.channelForm[key][
                                    key_.substring(0, 8) + "TriggerInfo"
                                ];
                            this.saveTempalteData["configParams"].push({
                                protocol: [isapiInfo, isapiTriInfo, isapiCap],
                                params: "",
                                channelId: channelId,
                                controlPwd: "",
                            });
                        } else {
                            let isapiInfo = {};
                            let isapiTriInfo = {};
                            let isapiCap = {};
                            isapiInfo[key_] = this.channelForm[key][key_];
                            isapiCap[key_ + "Capability"] =
                                this.channelForm[key][key_ + "Capability"];
                            isapiTriInfo[
                                key_.substring(0, key_.length - 4) +
                                    "TriggerList"
                            ] =
                                this.channelForm[key][
                                    key_.substring(0, key_.length - 4) +
                                        "TriggerList"
                                ];
                            this.saveTempalteData["configParams"].push({
                                protocol: [isapiInfo, isapiTriInfo, isapiCap],
                                params: "",
                                channelId: channelId,
                                controlPwd: "",
                            });
                        }
                    } else {
                        let isapiInfo = {};
                        isapiInfo[key_] = this.channelForm[key][key_];
                        this.saveTempalteData["configParams"].push({
                            protocol: [isapiInfo],
                            params: "",
                            channelId: channelId,
                            controlPwd: "",
                        });
                    }
                }
            }
        },
        //ISAPI模板返回数据拆分
        templateDataSplit() {
            let channelData = {};
            let formData = {};
            this.isapiData["configParams"].forEach((item) => {
                if (item["channelId"] != -1) {
                    if (
                        channelData["channel_" + item["channelId"]] == undefined
                    ) {
                        channelData["channel_" + item["channelId"]] = {};
                    }
                    item["protocol"].forEach((item_) => {
                        for (let key in item_) {
                            channelData["channel_" + item["channelId"]][key] =
                                item_[key];
                        }
                    });
                    channelData = Object.assign({}, channelData, channelData);
                } else {
                    let index_ = 0;
                    item["protocol"].forEach((item_) => {
                        for (let key in item_) {
                            if (key == "IsApiZtGsensorTurn") {
                                formData[
                                    key + "_" + item_[key]["gsensorTurnType"]
                                ] = item_[key];
                                formData["IsApiZtGsensorTurnCapability"] =
                                    item_["IsApiZtGsensorTurnCapability"];
                                index_++;
                            } else if (
                                key != "IsApiZtGsensorTriggers" ||
                                key != "IsApiZtGsensorTurnCapability" ||
                                key != "IsApiPlatformCapability"
                            ) {
                                if (key == "IsApiPlatform") {
                                    if (
                                        formData["IsApiPlatform"] == undefined
                                    ) {
                                        formData["IsApiPlatform"] = {};
                                        formData["IsApiPlatform"][
                                            "platformInfoList"
                                        ] = [];
                                    }
                                    formData["IsApiPlatform"][
                                        "platformInfoList"
                                    ].push(
                                        item_["IsApiPlatform"][
                                            "platformInfoList"
                                        ][0]
                                    );
                                    formData["IsApiPlatformCapability"] =
                                        item_["IsApiPlatformCapability"];
                                } else {
                                    formData[key] = item_[key];
                                }
                            }
                            if (key == "IsApiZtGsensorTriggers") {
                                formData[
                                    "IsApiZtGsensorTriggers_" +
                                        item_[key]["eventRuleTriggerList"][0][
                                            "ruleID"
                                        ]
                                ] = item_[key];
                            }
                            if (key == "IsApiZtVehctrl") {
                                this.aesPassword = item.controlPwd;
                            }
                        }
                    });
                }
            });
            this.channelForm = channelData;
            this.initData = formData;
            this.detailShow = true;
        },
        //私有协议模板返回数据差分
        privateTemplateDataSplit() {
            let formData = {};
            this.componentName = "";
            this.privateData["ehomeParams"].forEach((item) => {
                if (item["markKey"].includes("192")) {
                    formData["param192"] = item["params"];
                    this.$nextTick(() => {
                        this.componentName = "PrivateShutDown";
                    });
                } else if (item["markKey"].includes("2205")) {
                    formData[`param${item["markKey"]}`] = item["params"];
                    this.$nextTick(() => {
                        this.componentName = this.componentName
                            ? this.componentName
                            : "PrivateVolume";
                    });
                } else if (item["markKey"].includes("705")) {
                    formData[
                        `param${item["markKey"]}_${item["params"]["platformOrder"]}`
                    ] = item["params"];
                    this.$nextTick(() => {
                        this.componentName = this.componentName
                            ? this.componentName
                            : "PrivateFirstCenter";
                    });
                } else if (item["markKey"].includes("901")) {
                    if (!formData["param901"]) {
                        formData["param901"] = {};
                        formData["param901"][item["markKey"].split("_")[1]] =
                            {};
                        if (item["markKey"].split("_").length === 2) {
                            formData[`param901_`] = item["params"];
                            formData["param901"][item["markKey"].split("_")[1]][
                                `param901_`
                            ] = item["params"];
                        } else {
                            formData[
                                `param901_${item["params"]["info"][0]["type"]}`
                            ] = item["params"];
                            formData["param901"][item["markKey"].split("_")[1]][
                                `param901_${item["params"]["info"][0]["type"]}`
                            ] = item["params"];
                        }
                    } else {
                        if (
                            !formData["param901"][item["markKey"].split("_")[1]]
                        ) {
                            formData["param901"][
                                item["markKey"].split("_")[1]
                            ] = {};
                            if (item["markKey"].split("_").length === 2) {
                                formData[`param901_`] = item["params"];
                                formData["param901"][
                                    item["markKey"].split("_")[1]
                                ][`param901_`] = item["params"];
                            } else {
                                formData[
                                    `param901_${item["params"]["info"][0]["type"]}`
                                ] = item["params"];
                                formData["param901"][
                                    item["markKey"].split("_")[1]
                                ][
                                    `param901_${item["params"]["info"][0]["type"]}`
                                ] = item["params"];
                            }
                        } else {
                            if (item["markKey"].split("_").length === 2) {
                                formData[`param901_`] = item["params"];
                                formData["param901"][
                                    item["markKey"].split("_")[1]
                                ][`param901_`] = item["params"];
                            } else {
                                formData[
                                    `param901_${item["params"]["info"][0]["type"]}`
                                ] = item["params"];
                                formData["param901"][
                                    item["markKey"].split("_")[1]
                                ][
                                    `param901_${item["params"]["info"][0]["type"]}`
                                ] = item["params"];
                            }
                        }
                    }
                    this.$nextTick(() => {
                        this.componentName = this.componentName
                            ? this.componentName
                            : "PrivateAdas";
                    });
                } else if (item["markKey"].includes("905")) {
                    if (!formData["param905"]) {
                        formData["param905"] = {};
                        formData["param905"][item["markKey"].split("_")[1]] =
                            {};
                        if (item["markKey"].split("_").length === 2) {
                            formData[`param905_`] = item["params"];
                            formData["param905"][item["markKey"].split("_")[1]][
                                `param905_`
                            ] = item["params"];
                        } else {
                            formData[
                                `param905_${item["params"]["info"][0]["type"]}`
                            ] = item["params"];
                            formData["param905"][item["markKey"].split("_")[1]][
                                `param905_${item["params"]["info"][0]["type"]}`
                            ] = item["params"];
                        }
                    } else {
                        if (
                            !formData["param905"][item["markKey"].split("_")[1]]
                        ) {
                            formData["param905"][
                                item["markKey"].split("_")[1]
                            ] = {};
                            if (item["markKey"].split("_").length === 2) {
                                formData[`param905_`] = item["params"];
                                formData["param905"][
                                    item["markKey"].split("_")[1]
                                ][`param905_`] = item["params"];
                            } else {
                                formData[
                                    `param905_${item["params"]["info"][0]["type"]}`
                                ] = item["params"];
                                formData["param905"][
                                    item["markKey"].split("_")[1]
                                ][
                                    `param905_${item["params"]["info"][0]["type"]}`
                                ] = item["params"];
                            }
                        } else {
                            if (item["markKey"].split("_").length === 2) {
                                formData[`param905_`] = item["params"];
                                formData["param905"][
                                    item["markKey"].split("_")[1]
                                ][`param905_`] = item["params"];
                            } else {
                                formData[
                                    `param905_${item["params"]["info"][0]["type"]}`
                                ] = item["params"];
                                formData["param905"][
                                    item["markKey"].split("_")[1]
                                ][
                                    `param905_${item["params"]["info"][0]["type"]}`
                                ] = item["params"];
                            }
                        }
                    }
                    this.$nextTick(() => {
                        this.componentName = this.componentName
                            ? this.componentName
                            : "PrivateDba";
                    });
                } else if (item["markKey"].includes("920")) {
                    if (!formData["param920"]) {
                        formData["param920"] = {};
                        formData["param920"][item["markKey"].split("_")[1]] =
                            {};
                        if (item["markKey"].split("_").length === 2) {
                            formData[`param920_`] = item["params"];
                            formData["param920"][item["markKey"].split("_")[1]][
                                `param920_`
                            ] = item["params"];
                        } else {
                            formData[`param920_`] = item["params"];
                            formData[
                                `param920_${item["params"]["info"][0]["type"]}`
                            ] = item["params"];
                            formData["param920"][item["markKey"].split("_")[1]][
                                `param920_${item["params"]["info"][0]["type"]}`
                            ] = item["params"];
                        }
                    } else {
                        if (
                            !formData["param920"][item["markKey"].split("_")[1]]
                        ) {
                            formData["param920"][
                                item["markKey"].split("_")[1]
                            ] = {};
                            if (item["markKey"].split("_").length === 2) {
                                formData[`param920_`] = item["params"];
                                formData["param920"][
                                    item["markKey"].split("_")[1]
                                ][`param920_`] = item["params"];
                            } else {
                                formData[`param920_`] = item["params"];
                                formData[
                                    `param920_${item["params"]["info"][0]["type"]}`
                                ] = item["params"];
                                formData["param920"][
                                    item["markKey"].split("_")[1]
                                ][
                                    `param920_${item["params"]["info"][0]["type"]}`
                                ] = item["params"];
                            }
                        } else {
                            if (item["markKey"].split("_").length === 2) {
                                formData[`param920_`] = item["params"];
                                formData["param920"][
                                    item["markKey"].split("_")[1]
                                ][`param920_`] = item["params"];
                            } else {
                                formData[
                                    `param920_${item["params"]["info"][0]["type"]}`
                                ] = item["params"];
                                formData["param920"][
                                    item["markKey"].split("_")[1]
                                ][
                                    `param920_${item["params"]["info"][0]["type"]}`
                                ] = item["params"];
                            }
                        }
                    }
                    this.$nextTick(() => {
                        this.componentName = this.componentName
                            ? this.componentName
                            : "PrivateBsd";
                    });
                } else if (item["markKey"].includes("938")) {
                    if (!formData["param938"]) {
                        formData["param938"] = {};
                        formData["param938"][item["markKey"].split("_")[1]] =
                            {};
                        if (item["markKey"].split("_").length === 2) {
                            formData[`param938_`] = item["params"];
                            formData["param938"][item["markKey"].split("_")[1]][
                                `param938_`
                            ] = item["params"];
                        } else {
                            formData[
                                `param938_${item["params"]["info"][0]["type"]}`
                            ] = item["params"];
                            formData["param938"][item["markKey"].split("_")[1]][
                                `param938_${item["params"]["info"][0]["type"]}`
                            ] = item["params"];
                        }
                    } else {
                        if (
                            !formData["param938"][item["markKey"].split("_")[1]]
                        ) {
                            formData["param938"][
                                item["markKey"].split("_")[1]
                            ] = {};
                            if (item["markKey"].split("_").length === 2) {
                                formData[`param938_`] = item["params"];
                                formData["param938"][
                                    item["markKey"].split("_")[1]
                                ][`param938_`] = item["params"];
                            } else {
                                formData[
                                    `param938_${item["params"]["info"][0]["type"]}`
                                ] = item["params"];
                                formData["param938"][
                                    item["markKey"].split("_")[1]
                                ][
                                    `param938_${item["params"]["info"][0]["type"]}`
                                ] = item["params"];
                            }
                        } else {
                            if (item["markKey"].split("_").length === 2) {
                                formData[`param938_`] = item["params"];
                                formData["param938"][
                                    item["markKey"].split("_")[1]
                                ][`param938_`] = item["params"];
                            } else {
                                formData[
                                    `param938_${item["params"]["info"][0]["type"]}`
                                ] = item["params"];
                                formData["param938"][
                                    item["markKey"].split("_")[1]
                                ][
                                    `param938_${item["params"]["info"][0]["type"]}`
                                ] = item["params"];
                            }
                        }
                    }
                    this.$nextTick(() => {
                        this.componentName = this.componentName
                            ? this.componentName
                            : "PrivateWhd";
                    });
                } else if (item["markKey"].includes("188")) {
                    formData[
                        `param188_${item["params"]["chanNo"]}_${item["params"]["streamType"]}`
                    ] = item["params"];
                    this.$nextTick(() => {
                        this.componentName = this.componentName
                            ? this.componentName
                            : "PrivateVideo";
                    });
                } else if (item["markKey"].includes("948")) {
                    formData[`param948_${item["params"]["chanNo"]}`] =
                        item["params"];
                    this.$nextTick(() => {
                        this.componentName = this.componentName
                            ? this.componentName
                            : "PrivateIOOutput";
                    });
                } else if (item["markKey"].includes("950")) {
                    formData[`param950_${item["params"]["type"]}`] =
                        item["params"];
                    this.$nextTick(() => {
                        this.componentName = this.componentName
                            ? this.componentName
                            : "PrivateEventDisplay";
                    });
                } else {
                    formData[`param${item["markKey"]}`] = item["params"];
                    this.$nextTick(() => {
                        this.componentName = this.componentName
                            ? this.componentName
                            : item["markKey"].includes("957")
                            ? "PrivateOverSpeed"
                            : "PrivateOvertimeDriving";
                    });
                }
            });
            this.initData = formData;
            this.detailShow = true;
        },
        //接收子组件的form表单ref属性
        getMenuActiveRefFormName(val) {
            this.menuActiveRefFormName = val;
        },
        //私有协议枚举
        privateEnumDataGet() {
            for (let key in this.privateData["capability"]) {
                switch (key) {
                    case "network":
                        for (let key_ in this.privateData["capability"][key]) {
                            switch (key_) {
                                case "internet":
                                    if (
                                        this.privateData["capability"][key][
                                            key_
                                        ][0]["verify"] &&
                                        this.privateData["capability"][key][
                                            key_
                                        ][0]["verify"].length
                                    ) {
                                        this.privateData["capability"][key][
                                            key_
                                        ][0]["verify"].forEach((item) => {
                                            switch (item) {
                                                case 0:
                                                    this.enumerationData[
                                                        "verifyInternetList"
                                                    ].push({
                                                        id: item,
                                                        label: "自动选择",
                                                    });
                                                    this.enumerationData[
                                                        "verifyInternetJson"
                                                    ][item] = "自动选择";
                                                    break;
                                                case 1:
                                                    this.enumerationData[
                                                        "verifyInternetList"
                                                    ].push({
                                                        id: item,
                                                        label: "CHAP",
                                                    });
                                                    this.enumerationData[
                                                        "verifyInternetJson"
                                                    ][item] = "CHAP";
                                                    break;
                                                case 2:
                                                    this.enumerationData[
                                                        "verifyInternetList"
                                                    ].push({
                                                        id: item,
                                                        label: "PAP",
                                                    });
                                                    this.enumerationData[
                                                        "verifyInternetJson"
                                                    ][item] = "PAP";
                                                    break;
                                            }
                                        });
                                    }
                                    if (
                                        this.privateData["capability"][key][
                                            key_
                                        ][0]["band"] &&
                                        this.privateData["capability"][key][
                                            key_
                                        ][0]["band"].length
                                    ) {
                                        this.privateData["capability"][key][
                                            key_
                                        ][0]["band"].forEach((item) => {
                                            switch (item) {
                                                case 0:
                                                    this.enumerationData[
                                                        "bandInternetList"
                                                    ].push({
                                                        id: item,
                                                        label: "自动切换",
                                                    });
                                                    this.enumerationData[
                                                        "bandInternetJson"
                                                    ][item] = "自动切换";
                                                    break;
                                                case 1:
                                                    this.enumerationData[
                                                        "bandInternetList"
                                                    ].push({
                                                        id: item,
                                                        label: "ADJUST切换",
                                                    });
                                                    this.enumerationData[
                                                        "bandInternetJson"
                                                    ][item] = "ADJUST切换";
                                                    break;
                                                case 2:
                                                    this.enumerationData[
                                                        "bandInternetList"
                                                    ].push({
                                                        id: item,
                                                        label: "强制2G",
                                                    });
                                                    this.enumerationData[
                                                        "bandInternetJson"
                                                    ][item] = "强制2G";
                                                    break;
                                                case 3:
                                                    this.enumerationData[
                                                        "bandInternetList"
                                                    ].push({
                                                        id: item,
                                                        label: "强制3G",
                                                    });
                                                    this.enumerationData[
                                                        "bandInternetJson"
                                                    ][item] = "强制3G";
                                                    break;
                                                case 4:
                                                    this.enumerationData[
                                                        "bandInternetList"
                                                    ].push({
                                                        id: item,
                                                        label: "强制4G",
                                                    });
                                                    this.enumerationData[
                                                        "bandInternetJson"
                                                    ][item] = "强制4G";
                                                    break;
                                                case 5:
                                                    this.enumerationData[
                                                        "bandInternetList"
                                                    ].push({
                                                        id: item,
                                                        label: "强制5G",
                                                    });
                                                    this.enumerationData[
                                                        "bandInternetJson"
                                                    ][item] = "强制5G";
                                                    break;
                                            }
                                        });
                                    }
                                    break;
                                case "platformInfo":
                                    if (
                                        this.privateData["capability"][key][
                                            key_
                                        ]
                                    ) {
                                        let number = 0;
                                        for (
                                            let i = 0;
                                            i <
                                            this.privateData["capability"][key][
                                                key_
                                            ].length;
                                            i++
                                        ) {
                                            if (
                                                this.privateData["capability"][
                                                    key
                                                ][key_][i]["locationReport"] &&
                                                this.privateData["capability"][
                                                    key
                                                ][key_][i]["locationReport"][
                                                    "reportStrategy"
                                                ] &&
                                                this.privateData["capability"][
                                                    key
                                                ][key_][i]["locationReport"][
                                                    "reportStrategy"
                                                ].length
                                            ) {
                                                this.privateData["capability"][
                                                    key
                                                ][key_][i]["locationReport"][
                                                    "reportStrategy"
                                                ].forEach((item) => {
                                                    switch (item) {
                                                        case 1:
                                                            this.enumerationData[
                                                                "reportStrategyList" +
                                                                    i
                                                            ].push({
                                                                id: item,
                                                                label: "定时汇报",
                                                            });
                                                            this.enumerationData[
                                                                "reportStrategyJson" +
                                                                    i
                                                            ][item] =
                                                                "定时汇报";
                                                            break;
                                                        case 2:
                                                            this.enumerationData[
                                                                "reportStrategyList" +
                                                                    i
                                                            ].push({
                                                                id: item,
                                                                label: "定距汇报",
                                                            });
                                                            this.enumerationData[
                                                                "reportStrategyJson" +
                                                                    i
                                                            ][item] =
                                                                "定距汇报";
                                                            break;
                                                        case 3:
                                                            this.enumerationData[
                                                                "reportStrategyList" +
                                                                    i
                                                            ].push({
                                                                id: item,
                                                                label: "定时汇报和定距汇报",
                                                            });
                                                            this.enumerationData[
                                                                "reportStrategyJson" +
                                                                    i
                                                            ][item] =
                                                                "定时汇报和定距汇报";
                                                            break;
                                                    }
                                                });
                                            }
                                            if (
                                                this.privateData["capability"][
                                                    key
                                                ][key_][i]["platformDetail"] &&
                                                this.privateData["capability"][
                                                    key
                                                ][key_][i]["platformDetail"]
                                                    .length
                                            ) {
                                                this.privateData["capability"][
                                                    key
                                                ][key_][i][
                                                    "platformDetail"
                                                ].forEach((item) => {
                                                    switch (
                                                        item["accessProtocol"]
                                                    ) {
                                                        case 0:
                                                            this.enumerationData[
                                                                "accessProtocolList" +
                                                                    i
                                                            ].push({
                                                                id: item[
                                                                    "accessProtocol"
                                                                ],
                                                                label: "JT808_2011",
                                                            });
                                                            this.enumerationData[
                                                                "accessProtocolJson" +
                                                                    i
                                                            ][
                                                                item[
                                                                    "accessProtocol"
                                                                ]
                                                            ] = "JT808_2011";
                                                            item[
                                                                "extensionProtocol"
                                                            ].forEach(
                                                                (item_) => {
                                                                    switch (
                                                                        item_
                                                                    ) {
                                                                        case 0:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "不使用",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "不使用";
                                                                            break;
                                                                        case 4:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "苏标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "苏标协议";
                                                                            break;
                                                                        case 5:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "浙标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "浙标协议";
                                                                            break;
                                                                        case 6:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "陕标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "陕标协议";
                                                                            break;
                                                                        case 7:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "渝标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "渝标协议";
                                                                            break;
                                                                        case 8:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "川标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "川标协议";
                                                                            break;
                                                                        case 9:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "RTSM",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "RTSM";
                                                                            break;
                                                                        case 10:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "HATC",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "HATC";
                                                                            break;
                                                                        case 11:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "宇通V+平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "宇通V+平台";
                                                                            break;
                                                                        case 12:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "沪标平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "沪标平台";
                                                                            break;
                                                                        case 13:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "粤标平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "粤标平台";
                                                                            break;
                                                                        case 14:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "黑标平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "黑标平台";
                                                                            break;
                                                                        case 55:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "中联",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "中联";
                                                                            break;
                                                                        case 56:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "辽标平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "辽标平台";
                                                                            break;
                                                                        case 99:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "其他平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "其他平台";
                                                                            break;
                                                                    }
                                                                }
                                                            );
                                                            break;
                                                        case 1:
                                                            this.enumerationData[
                                                                "accessProtocolList" +
                                                                    i
                                                            ].push({
                                                                id: item[
                                                                    "accessProtocol"
                                                                ],
                                                                label: "JT905",
                                                            });
                                                            this.enumerationData[
                                                                "accessProtocolJson" +
                                                                    i
                                                            ][
                                                                item[
                                                                    "accessProtocol"
                                                                ]
                                                            ] = "JT905";
                                                            item[
                                                                "extensionProtocol"
                                                            ].forEach(
                                                                (item_) => {
                                                                    switch (
                                                                        item_
                                                                    ) {
                                                                        case 0:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "不使用",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "不使用";
                                                                            break;
                                                                        case 4:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "苏标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "苏标协议";
                                                                            break;
                                                                        case 5:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "浙标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "浙标协议";
                                                                            break;
                                                                        case 6:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "陕标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "陕标协议";
                                                                            break;
                                                                        case 7:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "渝标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "渝标协议";
                                                                            break;
                                                                        case 8:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "川标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "川标协议";
                                                                            break;
                                                                        case 9:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "RTSM",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "RTSM";
                                                                            break;
                                                                        case 10:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "HATC",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "HATC";
                                                                            break;
                                                                        case 11:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "宇通V+平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "宇通V+平台";
                                                                            break;
                                                                        case 12:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "沪标平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "沪标平台";
                                                                            break;
                                                                        case 13:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "粤标平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "粤标平台";
                                                                            break;
                                                                        case 14:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "黑标平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "黑标平台";
                                                                            break;
                                                                        case 55:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "中联",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "中联";
                                                                            break;
                                                                        case 56:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "辽标平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "辽标平台";
                                                                            break;
                                                                        case 99:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "其他平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "其他平台";
                                                                            break;
                                                                    }
                                                                }
                                                            );
                                                            break;
                                                        case 2:
                                                            this.enumerationData[
                                                                "accessProtocolList" +
                                                                    i
                                                            ].push({
                                                                id: item[
                                                                    "accessProtocol"
                                                                ],
                                                                label: "JT808_2019",
                                                            });
                                                            this.enumerationData[
                                                                "accessProtocolJson" +
                                                                    i
                                                            ][
                                                                item[
                                                                    "accessProtocol"
                                                                ]
                                                            ] = "JT808_2019";
                                                            item[
                                                                "extensionProtocol"
                                                            ].forEach(
                                                                (item_) => {
                                                                    switch (
                                                                        item_
                                                                    ) {
                                                                        case 0:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "不使用",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "不使用";
                                                                            break;
                                                                        case 4:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "苏标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "苏标协议";
                                                                            break;
                                                                        case 5:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "浙标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "浙标协议";
                                                                            break;
                                                                        case 6:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "陕标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "陕标协议";
                                                                            break;
                                                                        case 7:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "渝标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "渝标协议";
                                                                            break;
                                                                        case 8:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "川标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "川标协议";
                                                                            break;
                                                                        case 9:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "RTSM",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "RTSM";
                                                                            break;
                                                                        case 10:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "HATC",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "HATC";
                                                                            break;
                                                                        case 11:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "宇通V+平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "宇通V+平台";
                                                                            break;
                                                                        case 12:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "沪标平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "沪标平台";
                                                                            break;
                                                                        case 13:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "粤标平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "粤标平台";
                                                                            break;
                                                                        case 14:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "黑标平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "黑标平台";
                                                                            break;
                                                                        case 55:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "中联",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "中联";
                                                                            break;
                                                                        case 56:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "辽标平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "辽标平台";
                                                                            break;
                                                                        case 99:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "其他平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "其他平台";
                                                                            break;
                                                                    }
                                                                }
                                                            );
                                                            break;
                                                        case 3:
                                                            this.enumerationData[
                                                                "accessProtocolList" +
                                                                    i
                                                            ].push({
                                                                id: item[
                                                                    "accessProtocol"
                                                                ],
                                                                label: "JT808_2013",
                                                            });
                                                            this.enumerationData[
                                                                "accessProtocolJson" +
                                                                    i
                                                            ][
                                                                item[
                                                                    "accessProtocol"
                                                                ]
                                                            ] = "JT808_2013";
                                                            item[
                                                                "extensionProtocol"
                                                            ].forEach(
                                                                (item_) => {
                                                                    switch (
                                                                        item_
                                                                    ) {
                                                                        case 0:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "不使用",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "不使用";
                                                                            break;
                                                                        case 4:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "苏标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "苏标协议";
                                                                            break;
                                                                        case 5:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "浙标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "浙标协议";
                                                                            break;
                                                                        case 6:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "陕标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "陕标协议";
                                                                            break;
                                                                        case 7:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "渝标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "渝标协议";
                                                                            break;
                                                                        case 8:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "川标协议",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "川标协议";
                                                                            break;
                                                                        case 9:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "RTSM",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "RTSM";
                                                                            break;
                                                                        case 10:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "HATC",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "HATC";
                                                                            break;
                                                                        case 11:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "宇通V+平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "宇通V+平台";
                                                                            break;
                                                                        case 12:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "沪标平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "沪标平台";
                                                                            break;
                                                                        case 13:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "粤标平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "粤标平台";
                                                                            break;
                                                                        case 14:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "黑标平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "黑标平台";
                                                                            break;
                                                                        case 55:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "中联",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "中联";
                                                                            break;
                                                                        case 56:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "辽标平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "辽标平台";
                                                                            break;
                                                                        case 99:
                                                                            this.enumerationData[
                                                                                "extensionProtocolList" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ].push(
                                                                                {
                                                                                    id: item_,
                                                                                    label: "其他平台",
                                                                                }
                                                                            );
                                                                            this.enumerationData[
                                                                                "extensionProtocolJson" +
                                                                                    i
                                                                            ][
                                                                                item[
                                                                                    "accessProtocol"
                                                                                ]
                                                                            ][
                                                                                item_
                                                                            ] =
                                                                                "其他平台";
                                                                            break;
                                                                    }
                                                                }
                                                            );
                                                            break;
                                                    }
                                                });
                                            }
                                        }
                                    }
                                    break;
                            }
                        }
                        break;
                    case "generic":
                        if (
                            this.privateData["capability"][key] &&
                            this.privateData["capability"][key]["vehicleDetail"]
                        ) {
                            if (
                                this.privateData["capability"][key][
                                    "vehicleDetail"
                                ]["plateColor"] &&
                                this.privateData["capability"][key][
                                    "vehicleDetail"
                                ]["plateColor"].length
                            ) {
                                this.privateData["capability"][key][
                                    "vehicleDetail"
                                ]["plateColor"].forEach((item) => {
                                    switch (item) {
                                        case 0:
                                            this.enumerationData[
                                                "plateColorGenericList"
                                            ].push({
                                                id: item,
                                                label: "未上牌",
                                            });
                                            this.enumerationData[
                                                "plateColorGenericJson"
                                            ][item] = "未上牌";
                                            break;
                                        case 1:
                                            this.enumerationData[
                                                "plateColorGenericList"
                                            ].push({
                                                id: item,
                                                label: "蓝",
                                            });
                                            this.enumerationData[
                                                "plateColorGenericJson"
                                            ][item] = "蓝";
                                            break;
                                        case 2:
                                            this.enumerationData[
                                                "plateColorGenericList"
                                            ].push({
                                                id: item,
                                                label: "黄",
                                            });
                                            this.enumerationData[
                                                "plateColorGenericJson"
                                            ][item] = "黄";
                                            break;
                                        case 3:
                                            this.enumerationData[
                                                "plateColorGenericList"
                                            ].push({
                                                id: item,
                                                label: "黑",
                                            });
                                            this.enumerationData[
                                                "plateColorGenericJson"
                                            ][item] = "黑";
                                            break;
                                        case 4:
                                            this.enumerationData[
                                                "plateColorGenericList"
                                            ].push({
                                                id: item,
                                                label: "白",
                                            });
                                            this.enumerationData[
                                                "plateColorGenericJson"
                                            ][item] = "白";
                                            break;
                                        case 5:
                                            this.enumerationData[
                                                "plateColorGenericList"
                                            ].push({
                                                id: item,
                                                label: "绿",
                                            });
                                            this.enumerationData[
                                                "plateColorGenericJson"
                                            ][item] = "绿";
                                            break;
                                        case 6:
                                            this.enumerationData[
                                                "plateColorGenericList"
                                            ].push({
                                                id: item,
                                                label: "黄绿",
                                            });
                                            this.enumerationData[
                                                "plateColorGenericJson"
                                            ][item] = "黄绿";
                                            break;
                                        case 99:
                                            this.enumerationData[
                                                "plateColorGenericList"
                                            ].push({
                                                id: item,
                                                label: "其他",
                                            });
                                            this.enumerationData[
                                                "plateColorGenericJson"
                                            ][item] = "其他";
                                            break;
                                    }
                                });
                            }
                            if (
                                this.privateData["capability"][key][
                                    "vehicleDetail"
                                ]["plateType"] &&
                                this.privateData["capability"][key][
                                    "vehicleDetail"
                                ]["plateType"].length
                            ) {
                                this.privateData["capability"][key][
                                    "vehicleDetail"
                                ]["plateType"].forEach((item) => {
                                    switch (item) {
                                        case 1:
                                            this.enumerationData[
                                                "plateTypeGenericList"
                                            ].push({
                                                id: item,
                                                label: "小型车辆",
                                            });
                                            this.enumerationData[
                                                "plateTypeGenericJson"
                                            ][item] = "小型车辆";
                                            break;
                                        case 2:
                                            this.enumerationData[
                                                "plateTypeGenericList"
                                            ].push({
                                                id: item,
                                                label: "大型车辆",
                                            });
                                            this.enumerationData[
                                                "plateTypeGenericJson"
                                            ][item] = "大型车辆";
                                            break;
                                        case 3:
                                            this.enumerationData[
                                                "plateTypeGenericList"
                                            ].push({
                                                id: item,
                                                label: "挂车",
                                            });
                                            this.enumerationData[
                                                "plateTypeGenericJson"
                                            ][item] = "挂车";
                                            break;
                                        case 4:
                                            this.enumerationData[
                                                "plateTypeGenericList"
                                            ].push({
                                                id: item,
                                                label: "营运载客汽车",
                                            });
                                            this.enumerationData[
                                                "plateTypeGenericJson"
                                            ][item] = "营运载客汽车";
                                            break;
                                        case 5:
                                            this.enumerationData[
                                                "plateTypeGenericList"
                                            ].push({
                                                id: item,
                                                label: "危险货物运输车辆",
                                            });
                                            this.enumerationData[
                                                "plateTypeGenericJson"
                                            ][item] = "危险货物运输车辆";
                                            break;
                                        case 6:
                                            this.enumerationData[
                                                "plateTypeGenericList"
                                            ].push({
                                                id: item,
                                                label: "货车",
                                            });
                                            this.enumerationData[
                                                "plateTypeGenericJson"
                                            ][item] = "货车";
                                            break;
                                        case 7:
                                            this.enumerationData[
                                                "plateTypeGenericList"
                                            ].push({
                                                id: item,
                                                label: "重型厢式货车",
                                            });
                                            this.enumerationData[
                                                "plateTypeGenericJson"
                                            ][item] = "重型厢式货车";
                                            break;
                                        case 8:
                                            this.enumerationData[
                                                "plateTypeGenericList"
                                            ].push({
                                                id: item,
                                                label: "校车",
                                            });
                                            this.enumerationData[
                                                "plateTypeGenericJson"
                                            ][item] = "校车";
                                            break;
                                        case 9:
                                            this.enumerationData[
                                                "plateTypeGenericList"
                                            ].push({
                                                id: item,
                                                label: "特种工程车",
                                            });
                                            this.enumerationData[
                                                "plateTypeGenericJson"
                                            ][item] = "特种工程车";
                                            break;
                                        case 10:
                                            this.enumerationData[
                                                "plateTypeGenericList"
                                            ].push({
                                                id: item,
                                                label: "重型载货汽车",
                                            });
                                            this.enumerationData[
                                                "plateTypeGenericJson"
                                            ][item] = "重型载货汽车";
                                            break;
                                        case 11:
                                            this.enumerationData[
                                                "plateTypeGenericList"
                                            ].push({
                                                id: item,
                                                label: "半挂牵引车",
                                            });
                                            this.enumerationData[
                                                "plateTypeGenericJson"
                                            ][item] = "半挂牵引车";
                                            break;
                                        case 12:
                                            this.enumerationData[
                                                "plateTypeGenericList"
                                            ].push({
                                                id: item,
                                                label: "散装物料车",
                                            });
                                            this.enumerationData[
                                                "plateTypeGenericJson"
                                            ][item] = "散装物料车";
                                            break;
                                        case 13:
                                            this.enumerationData[
                                                "plateTypeGenericList"
                                            ].push({
                                                id: item,
                                                label: "教练车",
                                            });
                                            this.enumerationData[
                                                "plateTypeGenericJson"
                                            ][item] = "教练车";
                                            break;
                                    }
                                });
                            }
                        }
                        if (
                            (this.privateData["capability"][key] &&
                                this.privateData["capability"][key][
                                    "audioOutput"
                                ]) ||
                            (this.privateData["capability"][key] &&
                                this.privateData["capability"][key][
                                    "voiceCallOutput"
                                ])
                        ) {
                            if (
                                this.privateData["capability"][key][
                                    "audioOutput"
                                ] &&
                                this.privateData["capability"][key][
                                    "audioOutput"
                                ].length
                            ) {
                                this.privateData["capability"][key][
                                    "audioOutput"
                                ].forEach((item) => {
                                    switch (item) {
                                        case 0:
                                            this.enumerationData[
                                                "audioOutPutList"
                                            ].push({
                                                id: String(item),
                                                label: "ADAS相机",
                                            });
                                            this.enumerationData[
                                                "audioOutPutJson"
                                            ][String(item)] = "ADAS相机";
                                            break;
                                        case 1:
                                            this.enumerationData[
                                                "audioOutPutList"
                                            ].push({
                                                id: String(item),
                                                label: "DBA相机",
                                            });
                                            this.enumerationData[
                                                "audioOutPutJson"
                                            ][String(item)] = "DBA相机";
                                            break;
                                        case 2:
                                            this.enumerationData[
                                                "audioOutPutList"
                                            ].push({
                                                id: String(item),
                                                label: "外置扬声器（报警终端）",
                                            });
                                            this.enumerationData[
                                                "audioOutPutJson"
                                            ][String(item)] =
                                                "外置扬声器（报警终端）";
                                            break;
                                        case 3:
                                            this.enumerationData[
                                                "audioOutPutList"
                                            ].push({
                                                id: String(item),
                                                label: "手麦",
                                            });
                                            this.enumerationData[
                                                "audioOutPutJson"
                                            ][String(item)] = "手麦";
                                            break;
                                        case 4:
                                            this.enumerationData[
                                                "audioOutPutList"
                                            ].push({
                                                id: String(item),
                                                label: "内置扬声器",
                                            });
                                            this.enumerationData[
                                                "audioOutPutJson"
                                            ][String(item)] = "内置扬声器";
                                            break;
                                        case 9:
                                            this.enumerationData[
                                                "audioOutPutList"
                                            ].push({
                                                id: String(item),
                                                label: "ADAS和DBA相机",
                                            });
                                            this.enumerationData[
                                                "audioOutPutJson"
                                            ][String(item)] = "ADAS和DBA相机";
                                            break;
                                        case 16:
                                            this.enumerationData[
                                                "audioOutPutList"
                                            ].push({
                                                id: String(item),
                                                label: "自适应",
                                            });
                                            this.enumerationData[
                                                "audioOutPutJson"
                                            ][String(item)] = "自适应";
                                            break;
                                    }
                                });
                            }
                            if (
                                this.privateData["capability"][key][
                                    "voiceCallOutput"
                                ] &&
                                this.privateData["capability"][key][
                                    "voiceCallOutput"
                                ].length
                            ) {
                                this.privateData["capability"][key][
                                    "voiceCallOutput"
                                ].forEach((item) => {
                                    switch (item) {
                                        case 0:
                                            this.enumerationData[
                                                "voiceCallOutputList"
                                            ].push({
                                                id: String(item),
                                                label: "手麦",
                                            });
                                            this.enumerationData[
                                                "voiceCallOutputJson"
                                            ][String(item)] = "ADAS相机";
                                            break;
                                        case 1:
                                            this.enumerationData[
                                                "voiceCallOutputList"
                                            ].push({
                                                id: item,
                                                label: "外置扬声器",
                                            });
                                            this.enumerationData[
                                                "voiceCallOutputJson"
                                            ][String(item)] = "外置扬声器";
                                            break;
                                        case 2:
                                            this.enumerationData[
                                                "voiceCallOutputList"
                                            ].push({
                                                id: String(item),
                                                label: "内置扬声器",
                                            });
                                            this.enumerationData[
                                                "voiceCallOutputJson"
                                            ][String(item)] = "内置扬声器";
                                            break;
                                        case 3:
                                            this.enumerationData[
                                                "voiceCallOutputList"
                                            ].push({
                                                id: String(item),
                                                label: "ADAS相机",
                                            });
                                            this.enumerationData[
                                                "voiceCallOutputJson"
                                            ][String(item)] = "ADAS相机";
                                            break;
                                        case 4:
                                            this.enumerationData[
                                                "voiceCallOutputList"
                                            ].push({
                                                id: String(item),
                                                label: "DBA相机",
                                            });
                                            this.enumerationData[
                                                "voiceCallOutputJson"
                                            ][String(item)] = "DBA相机";
                                            break;
                                        case 9:
                                            this.enumerationData[
                                                "voiceCallOutputList"
                                            ].push({
                                                id: String(item),
                                                label: "ADAS和DBA相机",
                                            });
                                            this.enumerationData[
                                                "voiceCallOutputJson"
                                            ][String(item)] = "ADAS和DBA相机";
                                            break;
                                        case 16:
                                            this.enumerationData[
                                                "voiceCallOutputList"
                                            ].push({
                                                id: String(item),
                                                label: "自适应",
                                            });
                                            this.enumerationData[
                                                "voiceCallOutputJson"
                                            ][String(item)] = "自适应";
                                            break;
                                    }
                                });
                            }
                        }
                        break;
                    case "intelliDrive_sensor":
                        if (
                            this.privateData["capability"][key] &&
                            this.privateData["capability"][key][
                                "pulseSetting"
                            ] &&
                            this.privateData["capability"][key]["pulseSetting"]
                                .length
                        ) {
                            this.privateData["capability"][key][
                                "pulseSetting"
                            ][0]["speedSource"].forEach((item) => {
                                switch (item) {
                                    case 0:
                                        this.enumerationData[
                                            "pulseSettingSpeedSourceList"
                                        ].push({
                                            id: item,
                                            label: "自动更新",
                                        });
                                        this.enumerationData[
                                            "pulseSettingSpeedSourceJson"
                                        ][key] = "自动更新";
                                        break;
                                    case 1:
                                        this.enumerationData[
                                            "pulseSettingSpeedSourceList"
                                        ].push({
                                            id: item,
                                            label: "GPS",
                                        });
                                        this.enumerationData[
                                            "pulseSettingSpeedSourceJson"
                                        ][key] = "GPS";
                                        break;
                                    case 2:
                                        this.enumerationData[
                                            "pulseSettingSpeedSourceList"
                                        ].push({
                                            id: item,
                                            label: "硬线手动",
                                        });
                                        this.enumerationData[
                                            "pulseSettingSpeedSourceJson"
                                        ][key] = "硬线手动";
                                        break;
                                    case 3:
                                        this.enumerationData[
                                            "pulseSettingSpeedSourceList"
                                        ].push({
                                            id: item,
                                            label: "硬线自动",
                                        });
                                        this.enumerationData[
                                            "pulseSettingSpeedSourceJson"
                                        ][key] = "硬线自动";
                                        break;
                                    case 4:
                                        this.enumerationData[
                                            "pulseSettingSpeedSourceList"
                                        ].push({
                                            id: item,
                                            label: "CAN速度",
                                        });
                                        this.enumerationData[
                                            "pulseSettingSpeedSourceJson"
                                        ][key] = "CAN速度";
                                        break;
                                }
                            });
                        }
                        break;
                    case "intelliDrive_ADAS":
                        break;
                    case "intelliDrive_DBA":
                        break;
                    case "intelliDrive_BSD":
                        if (
                            this.privateData["capability"][key] &&
                            this.privateData["capability"][key].length
                        ) {
                            this.privateData["capability"][key].forEach(
                                (item) => {
                                    if (
                                        item["cameraPos"] &&
                                        item["cameraPos"].length
                                    ) {
                                        let positionList = [];
                                        let positionJson = {};
                                        item["cameraPos"].forEach((item_) => {
                                            switch (item_) {
                                                case 0:
                                                    positionList.push({
                                                        id: item_,
                                                        label: "平视前置",
                                                    });
                                                    positionJson[item_] =
                                                        "平视前置";
                                                    break;
                                                case 1:
                                                    positionList.push({
                                                        id: item_,
                                                        label: "平视后置",
                                                    });
                                                    positionJson[item_] =
                                                        "平视后置";
                                                    break;
                                                case 2:
                                                    positionList.push({
                                                        id: item_,
                                                        label: "俯视前置",
                                                    });
                                                    positionJson[item_] =
                                                        "俯视前置";
                                                    break;
                                                case 3:
                                                    positionList.push({
                                                        id: item_,
                                                        label: "俯视后置",
                                                    });
                                                    positionJson[item_] =
                                                        "俯视后置";
                                                    break;
                                            }
                                        });
                                        this.$set(
                                            this.enumerationData,
                                            "bsdcameraPosList" + item["chanNo"],
                                            positionList
                                        );
                                        this.$set(
                                            this.enumerationData,
                                            "bsdcameraPosJson" + item["chanNo"],
                                            positionJson
                                        );
                                    }
                                }
                            );
                            for (
                                let i = 0;
                                i < this.privateData["capability"][key].length;
                                i++
                            ) {
                                if (
                                    this.privateData["capability"][key][i][
                                        "info"
                                    ] &&
                                    this.privateData["capability"][key][i][
                                        "info"
                                    ].length
                                ) {
                                    this.privateData["capability"][key][i][
                                        "info"
                                    ].forEach((item) => {
                                        if (
                                            item["detect"] &&
                                            item["detect"].length
                                        ) {
                                            item["detect"].forEach((item_) => {
                                                switch (item_) {
                                                    case 1:
                                                        this.enumerationData[
                                                            "bsdDetectList" +
                                                                item["type"]
                                                        ].push({
                                                            id: item_,
                                                            label: "行人",
                                                        });
                                                        this.enumerationData[
                                                            "bsdDetectJson" +
                                                                item["type"]
                                                        ][item_] = "行人";
                                                        break;
                                                    case 2:
                                                        this.enumerationData[
                                                            "bsdDetectList" +
                                                                item["type"]
                                                        ].push({
                                                            id: item_,
                                                            label: "自行车",
                                                        });
                                                        this.enumerationData[
                                                            "bsdDetectJson" +
                                                                item["type"]
                                                        ][item_] = "自行车";
                                                        break;
                                                    case 3:
                                                        this.enumerationData[
                                                            "bsdDetectList" +
                                                                item["type"]
                                                        ].push({
                                                            id: item_,
                                                            label: "摩托车",
                                                        });
                                                        this.enumerationData[
                                                            "bsdDetectJson" +
                                                                item["type"]
                                                        ][item_] = "摩托车";
                                                        break;
                                                    case 4:
                                                        this.enumerationData[
                                                            "bsdDetectList" +
                                                                item["type"]
                                                        ].push({
                                                            id: item_,
                                                            label: "机动车",
                                                        });
                                                        this.enumerationData[
                                                            "bsdDetectJson" +
                                                                item["type"]
                                                        ][item_] = "机动车";
                                                        break;
                                                    case 5:
                                                        this.enumerationData[
                                                            "bsdDetectList" +
                                                                item["type"]
                                                        ].push({
                                                            id: item_,
                                                            label: "非机动车",
                                                        });
                                                        this.enumerationData[
                                                            "bsdDetectJson" +
                                                                item["type"]
                                                        ][item_] = "非机动车";
                                                        break;
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        }
                        break;
                    case "intelliDrive_WHD":
                        break;
                    case "compress":
                        if (
                            this.privateData["capability"][key] &&
                            this.privateData["capability"][key].length
                        ) {
                            if (
                                this.privateData["capability"][key][0][
                                    "info"
                                ] &&
                                this.privateData["capability"][key][0]["info"]
                                    .length
                            ) {
                                this.privateData["capability"][key][0][
                                    "info"
                                ].forEach((item) => {
                                    if (
                                        item["resolution"] &&
                                        item["resolution"].length
                                    ) {
                                        item["resolution"].forEach((item_) => {
                                            switch (item_) {
                                                case 0:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "4096*2160",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "4096*2160";
                                                    break;
                                                case 1:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "2560*1440",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "2560*1440";
                                                    break;
                                                case 2:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "1920*1280",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "1920*1280";
                                                    break;
                                                case 3:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "1920*1080",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "1920*1080";
                                                    break;
                                                case 4:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "1280*720",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "1280*720";
                                                    break;
                                                case 5:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "720*576",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "720*576";
                                                    break;
                                                case 6:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "640*480",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "640*480";
                                                    break;
                                                case 7:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "704*576",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "704*576";
                                                    break;
                                                case 8:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "960*576",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "960*576";
                                                    break;
                                                case 9:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "352*576",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "352*576";
                                                    break;
                                                case 10:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "352*288",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "352*288";
                                                    break;
                                                case 11:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "1280*960",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "1280*960";
                                                    break;
                                                case 12:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "2944*1656",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "2944*1656";
                                                    break;
                                                case 13:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "3072*2048",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "3072*2048";
                                                    break;
                                                case 14:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "3072*1728",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "3072*1728";
                                                    break;
                                                case 15:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "320*240",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "320*240";
                                                    break;
                                                case 16:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "640*360",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "640*360";
                                                    break;
                                                case 17:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "2560*1600",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "2560*1600";
                                                    break;
                                                case 18:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "2304*1296",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "2304*1296";
                                                    break;
                                                case 19:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "3840*2160",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "3840*2160";
                                                    break;
                                                case 20:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "720*480",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "720*480";
                                                    break;
                                                case 21:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "2880*1620",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "2880*1620";
                                                    break;
                                                case 22:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "1024*576",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "1024*576";
                                                    break;
                                                case 23:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "2304*1296",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "2304*1296";
                                                    break;
                                                case 24:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "1440*900",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "1440*900";
                                                    break;
                                                case 25:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "1920*1200",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "1920*1200";
                                                    break;
                                                case 26:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "1280*1280",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "1280*1280";
                                                    break;
                                                case 27:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "2048*2048",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "2048*2048";
                                                    break;
                                                case 28:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ].push({
                                                        id: item_,
                                                        label: "3072*2048",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item["chanNo"] +
                                                            "_" +
                                                            item["type"]
                                                    ][item_] = "3072*2048";
                                                    break;
                                            }
                                        });
                                    }
                                });
                            }
                        }
                        break;
                    case "intelliDrive_warn":
                        break;
                }
            }
        },
        getChannel(val) {
            this.channelForm = val;
        },
        // 保存模板
        saveTemp() {
            if (this.type == 1) {
                this.saveAgreement();
            } else if (this.type == 2) {
                this.saveFile();
            } else if (this.type == 3) {
                this.$refs.component.$refs[this.menuActiveRefFormName].validate(
                    (valid, invalidFields) => {
                        if (!valid) {
                            this.$message.info(
                                "当前配置界面内有不符合规范的配置项，请检查修改后存为模板！"
                            );
                        } else {
                            let params = {
                                templateType: this.type,
                                id: this.id,
                                templateContent: JSON.stringify(
                                    this.privateData
                                ),
                            };
                            this.$api
                                .hikDevParamTempUpdate(params)
                                .then((res) => {
                                    if (res.success == true) {
                                        this.$message.success("编辑模板成功！");
                                        this.goBack(1);
                                    } else {
                                        this.$message.error(
                                            "编辑模板失败:" + res.msg
                                        );
                                    }
                                });
                        }
                    }
                );
            }
        },
        saveAgreement() {
            this.$refs.component.$refs[this.componentName].validate((valid) => {
                if (valid) {
                    if (this.isapiData["menuList"].length) {
                        this.makeTemplateData();
                        let params = {
                            templateType: this.type,
                            id: this.id,
                            templateContent: JSON.stringify(
                                this.saveTempalteData
                            ),
                        };
                        this.$api.hikDevParamTempUpdate(params).then((res) => {
                            if (res.success == true) {
                                this.$message.success("编辑模板成功！");
                                this.goBack(1);
                            } else {
                                this.$message.error("编辑模板失败:" + res.msg);
                            }
                        });
                    } else {
                        let params = {
                            templateType: this.type,
                            id: this.id,
                            templateContent: JSON.stringify(this.initData),
                        };
                        this.$api.hikDevParamTempUpdate(params).then((res) => {
                            if (res.success == true) {
                                this.$message.success("编辑模板成功！");
                                this.goBack(1);
                            } else {
                                this.$message.error("编辑模板失败:" + res.msg);
                            }
                        });
                    }
                }
            });
        },
        saveFile() {
            this.$api.getBatchBinUploadUrl().then((res) => {
                if (res.success == true) {
                    let data = res.data;
                    // let argumentsList = {}
                    // for(let item in data){
                    //    argumentsList[item] = data[item]
                    //   }
                    if (this.videoPlayControl != null) {
                        this.setCallbacks(this.videoPlayControl);
                        this.videoPlayControl
                            .JS_RequestInterface({
                                funcName: "startUpload",
                                // arguments: argumentsList

                                arguments: {
                                    host: data.host,
                                    fileKey: data.fileName, //文件名，随机字符串
                                    fileName: data.fileName, //文件名，随机字符串
                                    OSSAccessKeyId: data.OSSAccessKeyId,
                                    policy: data.policy,
                                    Signature: data.Signature,
                                },
                            })
                            .then(function (oData) {
                                // showCBInfo(JSON.stringify(oData.responseMsg));
                            });
                    } else {
                        this.$message.error("控件未初始化");
                    }
                } else {
                    this.$message.error("获取BIN上传URL失败:" + res.msg);
                }
            });
        },
        // 回调设置
        setCallbacks(obj) {
            obj.JS_SetWindowControlCallback({
                cbIntegrationCallBack: this.cbIntegrationCallBack,
            });
        },
        cbIntegrationCallBack(oData) {
            //回调文件上传完成
            if (oData.responseMsg.event == "UploadFinishedNotify") {
                let data = oData.responseMsg.msg;
                if (null == data) {
                    this.$message.error("控件返回值异常，请稍后重试");
                    return;
                }
                let code = data.code;
                if (code != null && code === 0) {
                    this.initFileData.fileKey = data.fileKey;
                    let params = {
                        templateType: this.type,
                        id: this.id,
                        templateContent: JSON.stringify(this.initFileData),
                    };
                    this.$api.hikDevParamTempUpdate(params).then((res) => {
                        if (res.success == true) {
                            this.$message.success("编辑模板成功！");
                            that.refreshPage();
                        } else {
                            this.$message.error("编辑模板失败:" + res.msg);
                        }
                    });
                    //
                } else {
                    return;
                }
            }
        },
        changeVal(val) {
            if (val) {
                this.initData = val;
            }
        },
        changeLabel(val) {
            if (this.type == 1) {
                this.$refs.component.$refs[this.componentName].validate(
                    (valid) => {
                        if (valid) {
                            this.componentName = val.value;
                        } else {
                            this.$message.warning(
                                `当前表单验证不通过，请先完善！`
                            );
                            this.$refs.menu.activeIndex = this.componentName;
                        }
                    }
                );
            } else {
                this.componentName = val.value;
            }
        },
        goBack(type) {
            if (type == 1) {
                this.$router.go(-1);
            } else {
                this.$router.push({
                    path: "/maintenanceCenter/deviceConfiguration/configurationTemplate",
                    query: {
                        organizeId: this.organizeId,
                    },
                });
            }
        },
        // 获取设备所有配置参数
        getDeviceConfigParams() {
            if (!this.$route.query.id) {
                this.id = this.historyId;
                this.type = this.historyType;
            }
            let params = {
                id: this.id,
            };
            let form = {};
            this.isapiData = {
                menuList: [],
                configParams: [],
            };
            this.privateData = {
                menuList: [],
                ehomeParams: [],
                capability: "",
            };
            this.$api.tempQueryById(params).then((res) => {
                if (res.success == true) {
                    if (this.type == 1) {
                        if (
                            res.data &&
                            JSON.parse(res.data.templateContent)["menuList"] &&
                            JSON.parse(res.data.templateContent)["menuList"]
                                .length
                        ) {
                            this.isapiData = JSON.parse(
                                res.data.templateContent
                            );
                            this.sideBarItem = this.isapiData["menuList"].length
                                ? this.isapiData["menuList"]
                                : this.sideBarItem;
                            this.templateDataSplit();
                            this.$nextTick(() => {
                                this.componentName = this.isapiData["menuList"]
                                    .length
                                    ? this.isapiData["menuList"][0][
                                          "children"
                                      ][0]["value"]
                                    : "VehicleRegistration";
                            });
                        } else {
                            for (let x in JSON.parse(
                                res.data.templateContent
                            )) {
                                form[x] = JSON.parse(res.data.templateContent)[
                                    x
                                ];
                            }
                            this.initData = form;
                            // console.log(this.initData);
                            if (res.data.componentName) {
                                this.$nextTick(() => {
                                    this.componentName = res.data.componentName;
                                });
                                this.notAllTab = true;
                            } else {
                                this.componentName = "VehicleRegistration";
                                this.notAllTab = false;
                            }
                            this.$nextTick(() => {
                                this.detailShow = true;
                            });
                        }
                    } else if (this.type == 2) {
                        this.initFileData = JSON.parse(
                            res.data.templateContent
                        );
                        this.$nextTick(() => {
                            this.downLoadFile(this.initFileData);
                        });
                    } else if (this.type == 3) {
                        this.privateData = JSON.parse(res.data.templateContent);
                        this.sideBarItem = this.privateData["menuList"].length
                            ? this.privateData["menuList"]
                            : this.sideBarItem;
                        this.privateTemplateDataSplit();
                        this.privateEnumDataGet();
                        // this.$nextTick(()=>{
                        //   this.componentName = this.isapiData['menuList'].length ? this.isapiData['menuList'][0]['children'][0]['value'] : 'VehicleRegistration';
                        // })
                    }
                } else {
                    this.$message.error(
                        "根据模板ID获取模板信息失败:" + res.msg
                    );
                }
            });
        },
        //配置文件配置
        downLoadFile(params) {
            this.noneVideoPlay = false;
            let dealForm = { fileKey: params.fileKey };
            //获取播放url,不可直接取页面url,防止url过期
            this.$api.getBinFileDownloadUrl(dealForm).then((res) => {
                if (res.success == true) {
                    if (this.videoPlayControl == null) {
                        // let params = {
                        //   "fileKey": data.fileKey,
                        //   "deviceType": data.deviceModelCode,
                        //   "customNum": data.projectCode,
                        //   "url": res.data,
                        //   "configVersion": data.configVersion,
                        //   "hardwareVersion": data.version,
                        //   "versionDate": data.versionDate,
                        // };
                        this.$nextTick(() => {
                            let box = document.getElementById("videoPlay");
                            let offsetHeight = box.offsetHeight;
                            let offsetWidth = box.offsetWidth;
                            // console.log(box)
                            if (this.videoPlayControl)
                                this.videoPlayControl.JS_DestroyWnd();

                            this.videoPlayControl = this.initWebOcx(
                                this.videoPlayControl,
                                "videoPlay",
                                offsetWidth,
                                offsetHeight,
                                params
                            );
                        });
                    }
                } else {
                    this.$message.error("获取BIN URL失败:" + res.msg);
                }
            });
        },
        /**初始化回放控件-云端回放
         * @param {object} obj 控件实例化对象,每个播放窗口都具有唯一的obj
         * @param {string} id 控件id,用id控件唯一标示
         * @param {int} width 控件宽度,整数
         * @param {int} height 控件高度,整数
         */
        initWebOcx(obj, id, width, height, item) {
            return (obj = new WebControl({
                szPluginContainer: id,
                iServicePortStart: 14450, // 对应 LocalServiceConfig.xml 中的ServicePortStart值
                iServicePortEnd: 14452, // 对应 LocalServiceConfig.xml 中的ServicePortEnd值
                szClassId: "58BC9428-61BE-4F39-ABA3-89452662A4A0",
                cbConnectSuccess: () => {
                    obj.JS_StartService("window", {
                        dllPath: "./WebParamConfig.dll",
                    }).then(
                        () => {
                            obj.JS_CreateWnd(id, width, height).then(
                                function () {
                                    obj.JS_RequestInterface({
                                        funcName: "startDownload",
                                        arguments: {
                                            fileKey: item.fileKey,
                                            deviceType: item.deviceType,
                                            customNum: item.customNum,
                                            url: item.url,
                                            configVersion: item.configVersion,
                                            hardwareVersion:
                                                item.hardwareVersion,
                                            versionDate: item.versionDate,
                                        },
                                    }).then(function (oData) {
                                        //showCBInfo(JSON.stringify(oData.responseMsg));
                                    });
                                }
                            );
                        },
                        function () {
                            this.$message.error("控件服务启动失败！");
                        }
                    );
                },
                cbConnectError: () => {
                    obj = null;
                    this.noneVideoPlay = true;
                    this.videoPlayControl = null;
                    //this.$message.error('控件连接失败！');
                },
                cbConnectClose: (bNormalClose) => {
                    if (!bNormalClose) {
                        obj = null;
                        this.noneVideoPlay = true;
                        this.videoPlayControl = null;
                        //this.$message.error('控件连接异常断开');
                        //obj.JS_WakeUp("HATWebCtrlPlugin://");
                    }
                    return null;
                },
            }));
        },
        // 安装
        downloadOcx() {
            this.$api.getBinFileConfigDownloadUrl().then((res) => {
                let url = "";
                if (res.success && !!res.data) {
                    url = res.data;
                    let elemIF = document.createElement("iframe");
                    elemIF.src = url;
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                    setTimeout(() => {
                        document.body.removeChild(elemIF);
                    }, 2000);
                } else {
                    this.$message.error("获取控件URL失败:" + res.msg);
                }
            });
        },
        // 刷新
        refreshPage() {
            location.reload();
        },
        // 启动
        wakeUpOcx() {
            WebControl.JS_WakeUp("HATConfigCtrlPlugin://");
            // WebControl.JS_WakeUp("HATWebCtrlPlugin://");
        },
    },
    mounted() {
        if (
            this.dialogTableVisible === undefined ||
            this.dialogTableVisible === "" ||
            this.dialogTableVisible === null
        ) {
            this.getDeviceConfigParams();
        }

        // let script = document.createElement('script');
        // script.src = '/static/js/jsWebControl-1.0.0.min.js';
        // document.head.appendChild(script);

        //监听页面滚动
        window.addEventListener("scroll", () => {
            if (this.videoPlayControl != null) {
                let box = document.getElementById("videoPlay");
                let offsetHeight = box.offsetHeight;
                let offsetWidth = box.offsetWidth;
                ocxWebControl.pageScroll(
                    this.videoPlayControl,
                    "videoPlay",
                    offsetWidth,
                    offsetHeight
                );
            }
        }),
            //监听窗口拉伸
            window.addEventListener("resize", () => {
                if (this.videoPlayControl != null) {
                    let box = document.getElementById("videoPlay");
                    let offsetHeight = box.offsetHeight;
                    let offsetWidth = box.offsetWidth;
                    ocxWebControl.pageResize(
                        this.videoPlayControl,
                        "videoPlay",
                        offsetWidth,
                        offsetHeight
                    );
                }
            });
    },
    beforeDestroy() {
        if (this.videoPlayControl != null) {
            //this.videoPlayControl.JS_Disconnect();
            this.videoPlayControl.JS_DestroyWnd().then(
                () => {},
                () => {
                    // console.log('控件销毁失败');
                }
            );
            this.videoPlayControl = null;
            this.noneVideoPlay = false;
        }
    },
};
</script>

<style lang="less" scoped>
.edit-template {
    .configuration-module {
        display: flex;
        border: 1px solid #f0f0f0;
        margin-bottom: 4rem;
        .menu-vertical {
            height: 100%;
        }
        .configuration-detail-content {
            height: 100%;
            display: flex;
            flex-direction: column;
            .configuration-detail-item {
                flex-grow: 1;
            }
        }
    }
    .el-submenu.is-opened {
        background-color: #ebebeb !important;
    }
    .divHeight {
        height: calc(~"100vh - 21.5rem");
        margin-bottom: 4rem;
    }
    .bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        .configuration-detail-submit {
            height: 4rem;
            width: 100%;
            border-top: 1px solid #f0f0f0;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
    }
}
</style>
