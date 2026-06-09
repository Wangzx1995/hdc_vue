<template>
    <!-- <div style="height: 100%"> -->
    <div v-loading="allLoading" class="protocol-configuration">
        <el-tabs
            v-model="activeTabName"
            class="main-tab"
            :label-max-width="300"
            :before-leave="tabBeforeLeave"
        >
            <el-tab-pane label="参数配置" name="first">
                <configuration
                    ref="configuration"
                    :deviceInfo="deviceInfo"
                    :capability="capability"
                    :enumeration="enumeration"
                    :paramsLength="paramsLength"
                    :carIds="carIds"
                    @newFormChange="newFormChange"
                    @setFormChange="setFormChange"
                    @formDataChange="formDataChange"
                    @tabPositionChange="tabPositionChange"
                    @formValidate="formValidate"
                    @templateObjChange="templateObjChange"
                    @loadingSuccess="loadingSuccess"
                ></configuration>
            </el-tab-pane>
            <el-tab-pane
                :label="`待下发设备(${carIds.length})`"
                name="second"
                v-if="tabPosition === 'tab2'"
            >
                <issued-equipment
                    :activeTabName="activeTabName"
                    @carIdsChange="carIdsChange"
                ></issued-equipment>
            </el-tab-pane>
            <el-tab-pane
                :label="`待下发给设备参数项(${paramsLength})`"
                name="third"
            >
                <issued-params
                    ref="issuedParams"
                    :tabPosition="tabPosition"
                    :activeTabName="activeTabName"
                    :setForm="setForm"
                    :formData="formData"
                    :carIds="carIds"
                    :capability="capability"
                    @paramsLengthChange="paramsLengthChange"
                    @deleteFormItem="deleteFormItem"
                ></issued-params>
            </el-tab-pane>
        </el-tabs>
        <div class="operate">
            <div>
                <!-- <span>开启开机监测模板：</span>
                <el-switch v-model="value"></el-switch>
                <i class="iconfont icon-jinggao"></i>
                <span>开启后，设备开机监测到不一致时强制应用该模板参数</span> -->
            </div>
            <div>
                <span>设备状态：</span>
                <!-- 
                    * 1：深度休眠
                    * 2：浅休眠 
                -->
                <span :class="`status-${deviceInfo.deviceStatus}`">{{
                    deviceInfo.deviceStatus === 1
                        ? "在线"
                        : deviceInfo.deviceStatus === 2
                        ? deviceInfo.dormantStatus === 1
                            ? "深休眠"
                            : "浅休眠"
                        : "离线"
                }}</span>
                <span>最新获取时间：</span>
                <span>{{ deviceInfo.nowTime }}</span>
                <el-button @click="cancel">取消</el-button>
                <!-- <el-button
                    :disabled="!paramsLength"
                    @click="saveAsTemplate"
                    v-if="showSaveAsTemplate"
                    >保存为模板</el-button
                > -->
                <el-tooltip
                    content="若近期有更换过终端手机号，或下发配置后，导致设备能力发生变化，请重新获取镜像参数更新！"
                    placement="top"
                >
                    <el-button icon="el-icon-warning" @click="touchImageTask">
                        获取镜像参数
                    </el-button>
                </el-tooltip>

                <el-button
                    :loading="initConfigLoading"
                    @click="refreshConfiguration"
                    v-if="
                        showRefreshConfiguration &&
                        !Number($route.query.offline)
                    "
                    >获取最新配置</el-button
                >
                <el-button
                    v-if="showRefreshConfiguration"
                    @click="openTemplateDialog"
                    >保存为模板</el-button
                >
                <el-button type="primary" @click="nextStep" v-if="showNextStep"
                    >下一步</el-button
                >
                <el-button
                    :disabled="disabledConfigurationForm"
                    type="primary"
                    @click="setConfigurationForm"
                    v-if="showSetConfigurationForm"
                    >下发至终端</el-button
                >
            </div>
        </div>
        <div class="information" v-if="tabPosition !== 'tab2'">
            <span> 车牌号：{{ $route.query.plateNum || "--" }} </span>
            <span> 终端手机号：{{ $route.query.deviceCode || "--" }} </span>
            <span>
                设备序列号：{{ $route.query.deviceSerialNum || "--" }}
            </span>
            <span> VIN码：{{ $route.query.vin || "--" }} </span>
        </div>
        <el-dialog
            title="保存为模板"
            :visible.sync="templateDialogVisible"
            :width="'600px'"
            :custom-class="'add-car-dialog'"
        >
            <templateDialog
                ref="templateDialog"
                :key="timer"
                :menuList="menuList"
                :formData="newForm"
                :capability="capability"
                :setForm="setForm"
                @handleSuccess="handleSuccess"
                @closeTemplate="closeTemplate"
                @getAllMenuTree="getAllMenuTree"
            ></templateDialog>
        </el-dialog>
    </div>
</template>
<script>
import templateDialog from "./components/templateDialog.vue";
import configuration from "./components/configuration.vue";
import issuedEquipment from "./components/issuedEquipment.vue";
import issuedParams from "./components/issuedParams.vue";
import enumerationJSON from "./components/configuration/enumerationJSON/enumeration.json";
export default {
    name: "",
    components: {
        configuration,
        issuedEquipment,
        issuedParams,
        templateDialog,
    },
    props: {
        // deviceModelCode: {
        //     type: [String, Number],
        //     default: "",
        // },
        // productKey: {
        //     type: [String, Number],
        //     default: "",
        // },
        // organizeId: {
        //     type: [String, Number],
        //     default: "",
        // },
        // deviceId: {
        //     type: [String, Number],
        //     default: "",
        // },
        // carList: {
        //     type: String,
        //     default: "",
        // },
    },
    data() {
        return {
            enumerationJSON,
            activeTabName: "first",
            value: true,
            setForm: {},
            newForm: {},
            formData: {},
            capability: {},
            enumeration: {},
            deviceId: this.$route.query.deviceId,
            tabPosition: "tab1",
            paramsLength: 0,
            initConfigLoading: false,
            allLoading: false,
            validate: true,
            errorMsg: "",
            carIds: [],
            templateObj: {},
            deviceInfo: {},
            templateConfigurationType:
                this.$route.query.templateConfigurationType,
            templateDialogVisible: false,
            timer: null,
            menuList: [],
        };
    },
    mounted() {
        if (!this.templateConfigurationType) {
            this.getDeviceEHomeCapacity();
        }
        this.getParamDeviceById();
    },
    computed: {
        showRefreshConfiguration() {
            return (
                this.activeTabName === "first" &&
                (this.tabPosition === "tab1" || this.tabPosition === "tab2")
            );
        },
        showNextStep() {
            return (
                this.activeTabName !== "third" && this.tabPosition !== "tab3"
            );
        },
        showSetConfigurationForm() {
            return (
                this.activeTabName === "third" || this.tabPosition === "tab3"
            );
        },
        showSaveAsTemplate() {
            return (
                this.activeTabName === "third" && this.tabPosition === "tab2"
            );
        },
        disabledConfigurationForm() {
            if (this.tabPosition === "tab3") {
                return !this.templateObj.id;
            } else {
                return !this.paramsLength;
            }
        },
    },
    watch: {},
    methods: {
        tabPositionChange(val) {
            this.tabPosition = val;
            this.$nextTick(() => {
                if (val === "tab3") {
                    document.getElementById("tab-third").style.display = "none";
                } else {
                    document.getElementById("tab-third").style.display =
                        "inline-block";
                }
            });
        },
        newFormChange(newForm) {
            this.newForm = JSON.parse(
                JSON.stringify({ ...this.newForm, ...newForm })
            );
        },
        setFormChange(setForm) {
            this.setForm = JSON.parse(
                JSON.stringify({ ...this.setForm, ...setForm })
            );
        },
        formDataChange(obj, val) {
            if (!this.formData.hasOwnProperty(obj)) {
                this.formData[obj] = {};
            }
            this.formData[obj] = { ...this.formData[obj], ...val };
        },
        // 获取设备详情
        getParamDeviceById() {
            let params = {
                deviceId: this.$route.query.deviceId,
            };
            return new Promise((resolve, reject) => {
                this.$api.filegetParamDeviceById(params).then((res) => {
                    if (res.success == true) {
                        this.deviceInfo =
                            res.data.length > 0 ? res.data[0] : {};
                        this.deviceInfo.nowTime = this.$moment().format(
                            "YYYY-MM-DD HH:mm:ss"
                        );
                        if (
                            this.deviceInfo.deviceStatus === 1 ||
                            (this.deviceInfo.deviceStatus === 2 &&
                                this.deviceInfo.dormantStatus === 2)
                        ) {
                            resolve();
                        } else {
                            if (
                                !this.templateConfigurationType &&
                                !Number(this.$route.query.offline)
                            ) {
                                this.$message.error(
                                    `设备不在线，无法获取设备参数信息`
                                );
                            }

                            this.initConfigLoading = false;
                            reject();
                        }
                    } else {
                        this.$message.error("获取设备信息失败:" + res.msg);
                        this.initConfigLoading = false;
                        reject();
                    }
                });
            });
        },
        getDeviceEHomeCapacity() {
            this.allLoading = true;
            Promise.all([
                this.$api.getDeviceEHomeCapacity({
                    deviceId: this.deviceId,
                    param: "",
                    msgId: 4401,
                }),
                this.$api.getEHomeConfig({
                    deviceId: this.deviceId,
                    param: "",
                    msgId: 4302,
                }),
            ])
                .then((res) => {
                    if (res[0] && res[0].data && res[0].data.param) {
                        this.capability = {
                            ...JSON.parse(res[0].data.param),
                            zhatu: {},
                        };
                        if (this.capability.intelliDrive_VAD) {
                            this.capability.intelliDrive_VSD =
                                this.capability.intelliDrive_VAD;
                            this.capability.intelliDrive_VSD[0].chanNo = 1;
                        }
                        if (this.capability.intelliDrive_DBA) {
                            this.capability.intelliDrive_DSM =
                                this.capability.intelliDrive_DBA;
                        }
                        // -----------------自定义能力-----------
                        // this.capability.intelliDrive_sensor.surveillanceRecordMode =
                        //     {
                        //         radioMode: [0, 1, 2, 3],
                        //         checkMode: {
                        //             remoteTime: {
                        //                 enable: 1,
                        //                 awaken: {
                        //                     rangeMax: 228600,
                        //                     rangeMin: 1800,
                        //                 },
                        //             },
                        //             sentryMode: 1,
                        //             motionDetect: 1,
                        //         },
                        //     };
                        // -----------------自定义能力-----------
                    } else {
                        this.$message.error("获取设备能力集失败，请重试。");
                    }
                    if (res[1] && res[1].data && res[1].data.param) {
                        this.capability = {
                            ...this.capability,
                            zhatu: JSON.parse(res[1].data.param),
                        };
                    } else {
                        // this.$message.error("获取渣土车能力集失败，请重试。");
                    }
                    if (
                        this.capability.network &&
                        this.capability.network.platformInfo &&
                        this.capability.network.platformInfo.length
                    ) {
                        let BBplatformList =
                            this.capability.network.platformInfo.filter(
                                (item) =>
                                    item.platformType === 1 &&
                                    !item.platformOption
                            );

                        this.capability.network.isHikPlatform =
                            BBplatformList.findIndex(
                                (item) => item.isHikPlatform === 1
                            );
                    }
                    if (
                        this.capability.audio &&
                        Array.isArray(this.capability.audio)
                    ) {
                        this.capability.audio = this.capability.audio[0];
                    }
                    this.allLoading = false;
                    this.setEnumeration();
                })
                .catch(() => {
                    this.allLoading = false;
                });
        },
        getEnumerationValue(arr, name) {
            return arr.reduce((prev, cur) => {
                let obj = this.enumerationJSON[name].find(
                    (e) => e.value === cur
                );
                if (obj) {
                    return prev.concat(
                        this.enumerationJSON[name].find((e) => e.value === cur)
                    );
                } else {
                    return prev;
                }
            }, []);
        },
        setEnumeration() {
            for (const key in this.capability) {
                switch (key) {
                    case "generic":
                        if (this.capability[key].vehicleDetail) {
                            if (this.capability[key].vehicleDetail.plateColor) {
                                this.enumeration[
                                    "generic_vehicleDetail_plateColor"
                                ] = this.getEnumerationValue(
                                    this.capability[key].vehicleDetail
                                        .plateColor,
                                    "generic_vehicleDetail_plateColor"
                                );
                            }
                            if (this.capability[key].vehicleDetail.plateType) {
                                this.enumeration[
                                    "generic_vehicleDetail_plateType"
                                ] = this.getEnumerationValue(
                                    this.capability[key].vehicleDetail
                                        .plateType,
                                    "generic_vehicleDetail_plateType"
                                );
                            }
                        }
                        if (this.capability[key].shutdownDelay) {
                            this.enumeration["generic_shutdownDelayCustom"] =
                                [];
                            this.capability[key].shutdownDelay.forEach(
                                (item) => {
                                    this.enumeration[
                                        "generic_shutdownDelayCustom"
                                    ].push({
                                        label: item,
                                        value: item,
                                    });
                                }
                            );
                        }
                        if (this.capability[key].schemeType) {
                            this.enumeration["generic_schemeType"] = [];
                            this.capability[key].schemeType.forEach((item) => {
                                this.enumeration["generic_schemeType"].push({
                                    label: item.name,
                                    value: item.type,
                                });
                            });
                        }
                        if (this.capability[key].voiceCallOutput) {
                            this.enumeration["generic_voiceCallOutput"] =
                                this.getEnumerationValue(
                                    this.capability[key].voiceCallOutput,
                                    "generic_voiceCallOutput"
                                );
                        }
                        if (this.capability[key].audioOutput) {
                            this.enumeration["generic_audioOutput"] =
                                this.getEnumerationValue(
                                    this.capability[key].audioOutput,
                                    "generic_audioOutput"
                                );
                        }
                        if (this.capability[key].GPSCompensation) {
                            if (
                                this.capability[key].GPSCompensation
                                    .combinePositionMode
                            ) {
                                this.enumeration[
                                    "generic_GPSCompensation_combinePositionMode"
                                ] = this.getEnumerationValue(
                                    this.capability[key].GPSCompensation
                                        .combinePositionMode,
                                    "generic_GPSCompensation_combinePositionMode"
                                );
                            }
                            if (
                                this.capability[key].GPSCompensation
                                    .compensationMode
                            ) {
                                this.enumeration[
                                    "generic_GPSCompensation_compensationMode"
                                ] = this.getEnumerationValue(
                                    this.capability[key].GPSCompensation
                                        .compensationMode,
                                    "generic_GPSCompensation_compensationMode"
                                );
                            }
                            if (
                                this.capability[key].GPSCompensation
                                    .positionMode
                            ) {
                                this.enumeration[
                                    "generic_GPSCompensation_positionMode"
                                ] = this.getEnumerationValue(
                                    this.capability[key].GPSCompensation
                                        .positionMode,
                                    "generic_GPSCompensation_positionMode"
                                );
                            }
                            if (this.capability[key].GPSCompensation.Gmouse) {
                                this.enumeration[
                                    "generic_GPSCompensation_Gmouse"
                                ] = this.getEnumerationValue(
                                    this.capability[key].GPSCompensation.Gmouse,
                                    "generic_GPSCompensation_Gmouse"
                                );
                            }
                        }
                        if (this.capability[key].outputFrameRate) {
                            if (this.capability[key].outputFrameRate.length) {
                                this.capability[key].outputFrameRate.forEach(
                                    (item) => {
                                        item.formatList =
                                            this.getEnumerationValue(
                                                item.format,
                                                "generic_outputFrameRate_format"
                                            );
                                    }
                                );
                            }
                        }
                        if (this.capability[key].positioning) {
                            if (this.capability[key].positioning.positionType) {
                                this.enumeration[
                                    "generic_positioning_positionType"
                                ] = this.getEnumerationValue(
                                    this.capability[key].positioning
                                        .positionType,
                                    "generic_positioning_positionType"
                                );
                            }
                        }
                        break;
                    case "intelliDrive_sensor":
                        if (this.capability[key].pulseSetting) {
                            if (
                                this.capability[key].pulseSetting[0].speedSource
                            ) {
                                this.enumeration[
                                    "intelliDrive_sensor_pulseSetting_speedSource"
                                ] = this.getEnumerationValue(
                                    this.capability[key].pulseSetting[0]
                                        .speedSource,
                                    "intelliDrive_sensor_pulseSetting_speedSource"
                                );
                            }
                            if (
                                this.capability[key].pulseSetting[0]
                                    .pulseCalibrationMode
                            ) {
                                let pulseCalibrationModeArr =
                                    this.capability[
                                        key
                                    ].pulseSetting[0].pulseCalibrationMode.join(
                                        ","
                                    );
                                pulseCalibrationModeArr =
                                    pulseCalibrationModeArr.replace("0", "2");
                                pulseCalibrationModeArr =
                                    pulseCalibrationModeArr.split(",");
                                pulseCalibrationModeArr.forEach(
                                    (item, index) => {
                                        pulseCalibrationModeArr[index] =
                                            Number(item);
                                    }
                                );
                                this.enumeration[
                                    "intelliDrive_sensor_pulseSetting_pulseCalibrationMode"
                                ] = this.getEnumerationValue(
                                    pulseCalibrationModeArr,
                                    "intelliDrive_sensor_pulseSetting_pulseCalibrationMode"
                                );
                            }
                            if (this.capability[key].pulseSetting[0].PWM) {
                                this.enumeration[
                                    "intelliDrive_sensor_pulseSetting_PWM"
                                ] = this.getEnumerationValue(
                                    this.capability[key].pulseSetting[0].PWM,
                                    "intelliDrive_sensor_pulseSetting_PWM"
                                );
                            }
                        }
                        break;
                    case "intelliDrive_face":
                        if (this.capability[key].length) {
                            if (this.capability[key][0].faceContrastMode) {
                                this.enumeration[
                                    "intelliDrive_face_faceContrastMode"
                                ] = this.getEnumerationValue(
                                    this.capability[key][0].faceContrastMode,
                                    "intelliDrive_face_faceContrastMode"
                                );
                            }
                        }
                        break;
                    case "network":
                        if (this.capability[key].internet) {
                            if (this.capability[key].internet[0].verify) {
                                this.enumeration["network_internet_verify"] =
                                    this.getEnumerationValue(
                                        this.capability[key].internet[0].verify,
                                        "network_internet_verify"
                                    );
                            }
                            if (this.capability[key].internet[0].band) {
                                this.enumeration["network_internet_band"] =
                                    this.getEnumerationValue(
                                        this.capability[key].internet[0].band,
                                        "network_internet_band"
                                    );
                            }
                        }
                        if (this.capability[key].platformInfo) {
                            this.capability[key].platformInfo.forEach(
                                (item, index) => {
                                    if (item.platformType === 1) {
                                        if (item.platformDetail) {
                                            this.enumeration[
                                                `network_platformInfo_${index}_platformDetail_extensionProtocol`
                                            ] = {};
                                            this.enumeration[
                                                `network_platformInfo_${index}_platformDetail_accessProtocol`
                                            ] = {};
                                            let accessProtocolArr = [];
                                            item.platformDetail.forEach((k) => {
                                                accessProtocolArr.push(
                                                    k.accessProtocol
                                                );
                                                this.enumeration[
                                                    `network_platformInfo_${index}_platformDetail_extensionProtocol`
                                                ][k.accessProtocol] =
                                                    this.getEnumerationValue(
                                                        k.extensionProtocol,
                                                        "network_platformInfo_platformDetail_extensionProtocol"
                                                    );
                                            });
                                            this.enumeration[
                                                `network_platformInfo_${index}_platformDetail_accessProtocol`
                                            ]["list"] =
                                                this.getEnumerationValue(
                                                    accessProtocolArr,
                                                    "network_platformInfo_platformDetail_accessProtocol"
                                                );
                                        }
                                        if (item.locationReport) {
                                            if (
                                                item.locationReport
                                                    .reportStrategy
                                            ) {
                                                this.enumeration[
                                                    `network_platformInfo_${index}_locationReport_reportStrategy`
                                                ] = this.getEnumerationValue(
                                                    item.locationReport
                                                        .reportStrategy,
                                                    "network_platformInfo_locationReport_reportStrategy"
                                                );
                                            }
                                            if (
                                                item.locationReport.reportPlan
                                            ) {
                                                this.enumeration[
                                                    `network_platformInfo_${index}_locationReport_reportPlan`
                                                ] = this.getEnumerationValue(
                                                    item.locationReport
                                                        .reportPlan,
                                                    "network_platformInfo_locationReport_reportPlan"
                                                );
                                            }
                                        }
                                    }
                                }
                            );
                        }
                        break;
                    case "zhatu":
                        for (const zhatuKey in this.capability["zhatu"]) {
                            switch (zhatuKey) {
                                case "workMode":
                                    if (
                                        this.capability[key][zhatuKey] &&
                                        this.capability[key][zhatuKey].length
                                    ) {
                                        this.enumeration["zhatu_workMode"] =
                                            this.getEnumerationValue(
                                                this.capability[key][zhatuKey],
                                                "zhatu_workMode"
                                            );
                                    }
                                    break;
                                case "externalInfo":
                                    if (
                                        this.capability[key][zhatuKey]
                                            .acquireType &&
                                        this.capability[key][zhatuKey]
                                            .acquireType.length
                                    ) {
                                        this.enumeration[
                                            "zhatu_externalInfo_acquireType"
                                        ] = this.getEnumerationValue(
                                            this.capability[key][zhatuKey]
                                                .acquireType,
                                            "zhatu_externalInfo_acquireType"
                                        );
                                    }
                                    if (
                                        this.capability[key][zhatuKey]
                                            .lightAdjust &&
                                        this.capability[key][zhatuKey]
                                            .lightAdjust.length
                                    ) {
                                        this.enumeration[
                                            "zhatu_externalInfo_lightAdjust"
                                        ] = this.getEnumerationValue(
                                            this.capability[key][zhatuKey]
                                                .lightAdjust,
                                            "zhatu_externalInfo_lightAdjust"
                                        );
                                    }
                                    if (
                                        this.capability[key][zhatuKey]
                                            .advertShowCtrl &&
                                        this.capability[key][zhatuKey]
                                            .advertShowCtrl.length
                                    ) {
                                        this.enumeration[
                                            "zhatu_externalInfo_advertShowCtrl"
                                        ] = this.getEnumerationValue(
                                            this.capability[key][zhatuKey]
                                                .advertShowCtrl,
                                            "zhatu_externalInfo_advertShowCtrl"
                                        );
                                    }
                                    if (
                                        this.capability[key][zhatuKey]
                                            .showMask &&
                                        this.capability[key][zhatuKey].showMask
                                            .length
                                    ) {
                                        this.enumeration[
                                            "zhatu_externalInfo_showMask"
                                        ] = this.getEnumerationValue(
                                            this.capability[key][zhatuKey]
                                                .showMask,
                                            "zhatu_externalInfo_showMask"
                                        );
                                    }
                                    break;
                                case "androidScreen":
                                    if (
                                        this.capability[key][zhatuKey]
                                            .screenType &&
                                        this.capability[key][zhatuKey]
                                            .screenType.length
                                    ) {
                                        this.enumeration[
                                            "zhatu_androidScreen_screenType"
                                        ] = this.getEnumerationValue(
                                            this.capability[key][zhatuKey]
                                                .screenType,
                                            "zhatu_androidScreen_screenType"
                                        );
                                    }
                                    if (
                                        this.capability[key][zhatuKey]
                                            .defaultShow &&
                                        this.capability[key][zhatuKey]
                                            .defaultShow.length
                                    ) {
                                        this.enumeration[
                                            "zhatu_androidScreen_defaultShow"
                                        ] = this.getEnumerationValue(
                                            this.capability[key][zhatuKey]
                                                .defaultShow,
                                            "zhatu_androidScreen_defaultShow"
                                        );
                                    }
                                    if (
                                        this.capability[key][zhatuKey]
                                            .certType &&
                                        this.capability[key][zhatuKey].certType
                                            .length
                                    ) {
                                        this.enumeration[
                                            "zhatu_androidScreen_certType"
                                        ] = this.getEnumerationValue(
                                            this.capability[key][zhatuKey]
                                                .certType,
                                            "zhatu_androidScreen_certType"
                                        );
                                    }
                                    if (
                                        this.capability[key][zhatuKey]
                                            .defaultCert &&
                                        this.capability[key][zhatuKey]
                                            .defaultCert.length
                                    ) {
                                        this.enumeration[
                                            "zhatu_androidScreen_defaultCert"
                                        ] = this.getEnumerationValue(
                                            this.capability[key][zhatuKey]
                                                .defaultCert,
                                            "zhatu_androidScreen_defaultCert"
                                        );
                                    }
                                    if (
                                        this.capability[key][zhatuKey]
                                            .notifyCtrl &&
                                        this.capability[key][zhatuKey]
                                            .notifyCtrl.length
                                    ) {
                                        this.enumeration[
                                            "zhatu_androidScreen_notifyCtrl"
                                        ] = this.getEnumerationValue(
                                            this.capability[key][zhatuKey]
                                                .notifyCtrl,
                                            "zhatu_androidScreen_notifyCtrl"
                                        );
                                    }
                                    break;
                            }
                        }
                        break;
                }
            }
        },
        getFormValidate() {
            return new Promise((resolve, reject) => {
                this.$refs["configuration"].$refs["configuration-tab1"].$refs[
                    "tab1-form"
                ]
                    .formValidate()
                    .then(() => {
                        resolve();
                    })
                    .catch(() => {
                        reject();
                    });
            });
        },
        nextStep() {
            if (this.activeTabName === "first") {
                this.getFormValidate()
                    .then(() => {
                        this.activeTabName =
                            this.tabPosition === "tab2" ? "second" : "third";
                        setTimeout(() => {
                            this.$refs.issuedParams.labelWidthResize();
                        }, 0);
                    })
                    .catch(() => {
                        this.$message.error(`当前表单校验不通过，请检查！`);
                    });
            } else {
                this.activeTabName = "third";
                setTimeout(() => {
                    this.$refs.issuedParams.labelWidthResize();
                }, 0);
            }
        },
        tabBeforeLeave() {
            return new Promise((resolve, reject) => {
                this.getFormValidate()
                    .then(() => {
                        resolve();
                    })
                    .catch(() => {
                        this.$message.error(`当前表单校验不通过，请检查！`);
                        reject();
                    });
            });
        },
        refreshConfiguration() {
            this.validate = true;
            this.errorMsg = "";
            this.initConfigLoading = true;
            this.getParamDeviceById().then(() => {
                this.$refs.configuration.initConfig();
                setTimeout(() => {
                    this.initConfigLoading = false;
                }, 1000);
            });
        },
        setConfigurationForm() {
            this.$refs.issuedParams.saveEHomeConfig(this.templateObj);
        },
        paramsLengthChange(paramsLength) {
            this.paramsLength = paramsLength;
        },
        deleteFormItem(item) {
            this.$refs.configuration.deleteFormItem(item);
        },
        formValidate(validate, errorMsg) {
            this.validate = validate;
            this.errorMsg = errorMsg;
        },
        carIdsChange(ids) {
            this.carIds = ids;
        },
        templateObjChange(templateObj) {
            this.templateObj = templateObj;
        },
        saveAsTemplate() {
            this.$refs.issuedParams.openDialog();
        },
        cancel() {
            this.$router.push({
                path: "/maintenanceCenter/deviceConfiguration",
            });
        },
        handleSuccess() {},
        closeTemplate() {
            this.templateDialogVisible = false;
        },
        openTemplateDialog() {
            this.menuList =
                this.$refs["configuration"].$refs[
                    "configuration-tab1"
                ].menuList;
            this.timer = new Date().getTime();
            this.templateDialogVisible = true;
        },
        getAllMenuTree() {
            this.$refs["configuration"].$refs[
                "configuration-tab1"
            ].getAllMenuTree();
        },
        loadingSuccess() {
            this.$refs["templateDialog"] &&
                this.$refs["templateDialog"].getAllMenuTree();
        },
        touchImageTask() {
            this.$confirm(
                `1、重新获取镜像参数会导致备份的镜像和能力集均被清空，需等下一次备份完成后才可使用镜像功能。<br/>2、推荐设备在线时再点击获取镜像参数按钮，无需等待托管，直接可进行备份镜像操作。`,
                "是否重新获取镜像参数？",
                {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    if (!Number(this.$route.query.offline)) {
                        this.$message.success(
                            "镜像参数更新中，预计需要2-3分钟，请耐心等待！",
                            2000
                        );
                    }
                    this.$api
                        .touchImageTask({
                            deviceCode: this.$route.query.deviceCode,
                        })
                        .then((res) => {
                            if (
                                res.success &&
                                Number(this.$route.query.offline)
                            ) {
                                this.$message.success(
                                    "已生成托管任务，待设备上线后获取最新镜像参数！"
                                );
                            }
                        });
                })
                .catch(() => {});
        },
    },
};
</script>
<style lang="less" scoped>
.protocol-configuration {
    position: relative;
    .information {
        position: absolute;
        top: 0px;
        right: 14px;
        span {
            display: inline-block;
            line-height: 40px;
            height: 40px;
            font-size: 12px;
            margin-right: 12px;
        }
    }
}
/deep/.main-tab {
    height: calc(~"100% - 48px");
    & > .el-tabs__header {
        // box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.08);
        margin: 0px;
        & > .el-tabs__nav-wrap {
            padding-left: 14px;
        }
    }
    & > .el-tabs__content {
        height: calc(~"100% - 44px");
        padding: 0px;
        .el-tab-pane {
            height: 100%;
            & > div {
                height: 100%;
            }
        }
    }
}
.operate {
    box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.08);
    height: 48px;
    padding: 0 36px;
    display: flex;
    justify-content: space-between;
    position: relative;
    // background: #ffffff;
    & > div {
        display: flex;
        align-items: center;
        font-size: 12px;
        &:nth-child(1) {
            & > span:nth-child(1) {
                font-size: 14px;
            }
            & > span:nth-child(4) {
                color: #888888;
            }
            .icon-jinggao {
                font-size: 24px;
                color: #faad14;
                margin-left: 8px;
            }
        }
        &:nth-child(2) {
            .el-button + .el-button {
                margin-left: 16px;
            }
            & > span:nth-child(2) {
                margin-right: 16px;
                color: #4d4d4d;
                &.status-1 {
                    color: #22b01e;
                }
                &.status-2 {
                    color: #faad14;
                }
            }
            & > span:nth-child(4) {
                margin-right: 16px;
            }
        }
    }
}
</style>
<style lang="less">
.add-car-dialog {
    .el-dialog__body {
        padding: 0;
    }
}
</style>
