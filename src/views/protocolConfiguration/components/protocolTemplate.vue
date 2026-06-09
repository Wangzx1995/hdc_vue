<template>
    <div class="tab1-content">
        <div class="top-content">
            <div class="tab1-menu">
                <el-menu
                    ref="elMenu"
                    v-if="defaultActive"
                    :default-active="defaultActive"
                    @select="menuSelect"
                >
                    <el-menu-item
                        v-for="(item, index) in menuList"
                        :key="index"
                        :index="item.value"
                    >
                        {{ item.label }}
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="tab1-form">
                <component
                    v-for="item in menuList"
                    :key="item.value"
                    :newForm.sync="newForm"
                    :oldForm.sync="oldForm"
                    :ref="`component_${item.value}`"
                    :is="item.value"
                    :enumeration="enumeration"
                    :ehomeParams="ehomeParams"
                    :capability="capability"
                    :isTemplateBol="isTemplateBol"
                    @setFormChange="setFormChange"
                    @formDataChange="formDataChange"
                    v-show="defaultActive === item.value"
                ></component>
            </div>
        </div>
        <div class="operate" v-if="!id">
            <el-button @click="goBack">返回</el-button>
            <el-button @click="saveAsTemplate">保存</el-button>
        </div>
    </div>
</template>
<script>
import enumerationJSON from "./configuration/enumerationJSON/enumeration.json";
import utils from "./configuration/enumerationJSON/utils.js";
import vehicleParams from "./configuration/configurationForm/vehicleParams.vue";
import deviceParams from "./configuration/configurationForm/deviceParams.vue";
import platformParams from "./configuration/configurationForm/platformParams.vue";
import alarmParams from "./configuration/configurationForm/alarmParams.vue";
import peripheralParams from "./configuration/configurationForm/peripheralParams.vue";
import ADASParams from "./configuration/configurationForm/ADAS-Params.vue";
import DSMParams from "./configuration/configurationForm/DSM-Params.vue";
import BSDParams from "./configuration/configurationForm/BSD-Params.vue";
import WHDParams from "./configuration/configurationForm/WHD-Params.vue";
import WIWParams from "./configuration/configurationForm/WIW-Params.vue";
import ADParams from "./configuration/configurationForm/AD-Params.vue";
import VSDParams from "./configuration/configurationForm/VSD-Params.vue";
import PDAParams from "./configuration/configurationForm/PDA-Params.vue";
import videoParams from "./configuration/configurationForm/videoParams.vue";
import audioParams from "./configuration/configurationForm/audioParams.vue";

export default {
    name: "",
    components: {
        vehicleParams,
        deviceParams,
        platformParams,
        alarmParams,
        peripheralParams,
        ADASParams,
        DSMParams,
        BSDParams,
        WHDParams,
        WIWParams,
        ADParams,
        VSDParams,
        PDAParams,
        videoParams,
        audioParams,
    },
    props: {
        id: {
            type: [String, Number],
            default: "",
        },
        isTemplateBol: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            enumerationJSON,
            defaultActive: "",
            menuList: [],
            capability: {},
            ehomeParams: [],
            enumeration: {},
            setForm: {},
            issuedFormList: [],
            formData: {},
            newForm: {},
            oldForm: {},
        };
    },
    mounted() {
        this.getDeviceConfigParams();
    },
    computed: {},
    watch: {},
    methods: {
        removeEmpty(obj) {
            const finalObj = {};
            Object.keys(obj).forEach((key) => {
                if (
                    obj[key] &&
                    typeof obj[key] === "object" &&
                    !Array.isArray(obj[key])
                ) {
                    const nestedObj = this.removeEmpty(obj[key]);
                    if (Object.keys(nestedObj).length) {
                        finalObj[key] = nestedObj;
                    }
                } else if (Array.isArray(obj[key])) {
                    if (obj[key].length) {
                        obj[key].forEach((x) => {
                            const nestedObj = this.removeEmpty(x);
                            if (Object.keys(nestedObj).length) {
                                finalObj[key] = finalObj[key]
                                    ? [...finalObj[key], nestedObj]
                                    : [nestedObj];
                            }
                        });
                    }
                } else if (
                    // obj[key] !== "" &&
                    // obj[key] !== undefined &&
                    obj[key] !== null
                ) {
                    finalObj[key] = obj[key];
                }
            });
            return finalObj;
        },
        menuSelect(val) {
            this.defaultActive = val;
            this.$nextTick(() => {
                this.$refs[
                    `component_${this.defaultActive}`
                ][0].labelWidthResize();
            });
        },
        getMenuListValue(label) {
            return this.enumerationJSON["menu_list"].find((e) => {
                if (e.label === label || e.oldLabel === label) {
                    return e;
                }
            }).value;
        },
        getDeviceConfigParams() {
            this.$api
                .tempQueryById({ id: this.id ? this.id : this.$route.query.id })
                .then((res) => {
                    if (res.success) {
                        let templateContent = JSON.parse(
                            res.data.templateContent
                        );
                        this.menuList = templateContent.menuList;
                        this.menuList.forEach((item) => {
                            item.value = this.getMenuListValue(item.title);
                            item.label = item.title;
                        });
                        if (this.menuList.length) {
                            this.defaultActive = this.menuList[0].value;
                            this.$forceUpdate();
                        }
                        this.capability = templateContent.capability;
                        this.setEnumeration();
                        this.ehomeParams = JSON.parse(
                            JSON.stringify(templateContent.ehomeParams)
                        );
                        let msgIdArr = [
                            ...new Set(
                                this.ehomeParams.reduce((prev, cur) => {
                                    return prev.concat(cur["msgId"]);
                                }, [])
                            ),
                        ];
                        console.log("🚀 ~ .then ~ msgIdArr:", msgIdArr);
                        if (
                            msgIdArr &&
                            msgIdArr.length &&
                            msgIdArr.length == 1 &&
                            msgIdArr[0] == 6005
                        ) {
                            this.$message.warning(
                                "为您提供更好的使用体验，已修改算法参数，详细修改内容暂不开放",
                                5000
                            );
                        }
                    }
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
        setFormChange(setForm) {
            this.setForm = JSON.parse(
                JSON.stringify({ ...this.setForm, ...setForm })
            );
        },
        goBack() {
            this.$router.push({
                path: "/maintenanceCenter/configurationTemplate",
            });
        },
        formDataChange(obj, val) {
            if (!this.formData.hasOwnProperty(obj)) {
                this.formData[obj] = {};
            }
            this.formData[obj] = { ...this.formData[obj], ...val };
        },
        getParams(issuedFormList) {
            let params = [];
            let formatParamsObj = this.formatParams(issuedFormList);
            for (let key of Object.keys(formatParamsObj)) {
                let msgId = utils.getMsgId(
                    Number(key.split("_")[0].split("param")[1])
                );
                params.push({
                    msgId: msgId,
                    param: formatParamsObj[key],
                });
            }
            if (this.tabPosition === "tab2") {
                params.forEach((item) => {
                    if (item.msgId === 706) {
                        delete item.param.serial;
                        delete item.param.id;
                    }
                    if (item.msgId === 704) {
                        delete item.param.serial;
                    }
                });
            }
            return params;
        },
        minTime(time) {
            if (time && time.indexOf(":") > 0) {
                var min = time.split(":")[0];
                var sec = time.split(":")[1];
                return Number(min * 60) + Number(sec);
            }
        },
        formatParams() {
            let newFormData = JSON.parse(JSON.stringify(this.newForm));
            for (let key of Object.keys(newFormData)) {
                if (key.indexOf("param2222") > -1) {
                    newFormData[key].mileageRadio = Math.floor(
                        Number(newFormData[key].mileageRadio * 100)
                    );
                }
                if (key.indexOf("param924") > -1) {
                    if (newFormData[key].hasOwnProperty("daylightStartTime")) {
                        newFormData[key].daylightStartTime = this.minTime(
                            newFormData[key].daylightStartTime
                        );
                    }
                    if (newFormData[key].hasOwnProperty("daylightEndTime")) {
                        newFormData[key].daylightEndTime = this.minTime(
                            newFormData[key].daylightEndTime
                        );
                    }
                    if (
                        newFormData[key].hasOwnProperty("allDayDrivingTimeMax")
                    ) {
                        newFormData[key].allDayDrivingTimeMax = Math.floor(
                            Number(newFormData[key].allDayDrivingTimeMax * 3600)
                        );
                    }
                    if (newFormData[key].hasOwnProperty("deltaWarnTime")) {
                        newFormData[key].deltaWarnTime = Math.floor(
                            Number(newFormData[key].deltaWarnTime * 60)
                        );
                    }
                    if (
                        newFormData[key].hasOwnProperty(
                            "daylightDrivingTimeMax"
                        )
                    ) {
                        newFormData[key].daylightDrivingTimeMax = Math.floor(
                            Number(newFormData[key].daylightDrivingTimeMax * 60)
                        );
                    }
                    if (newFormData[key].hasOwnProperty("restTimeMin")) {
                        newFormData[key].restTimeMin = Math.floor(
                            Number(newFormData[key].restTimeMin * 60)
                        );
                    }
                    if (
                        newFormData[key].hasOwnProperty("nightDrivingTimeMax")
                    ) {
                        newFormData[key].nightDrivingTimeMax = Math.floor(
                            Number(newFormData[key].nightDrivingTimeMax * 60)
                        );
                    }
                    if (
                        newFormData[key].hasOwnProperty("nightDrivingRestTime")
                    ) {
                        newFormData[key].nightDrivingRestTime = Math.floor(
                            Number(newFormData[key].nightDrivingRestTime * 60)
                        );
                    }
                }
                if (key.indexOf("param2209") > -1) {
                    for (let chanNo of Object.keys(newFormData[key])) {
                        newFormData[`param2209_${chanNo}`] =
                            newFormData["param2209"][chanNo];
                    }
                    delete newFormData["param2209"];
                }
                if (key.indexOf("param2205") > -1) {
                    if (key.indexOf("reverse") > -1) {
                        newFormData[key] = {
                            chanNo: Number(key.split("_")[1]),
                            type: key.split("_")[2],
                            value: newFormData[key][key.split("_")[2]],
                        };
                    }
                    if (key.indexOf("sleepReportTimeInterval") > -1) {
                        newFormData[key] = {
                            chanNo: Number(key.split("_")[1]),
                            type: key.split("_")[2],
                            value: newFormData[key][key.split("_")[2]],
                        };
                    }
                    if (key.indexOf("audio") > -1) {
                        for (let item of Object.keys(newFormData[key])) {
                            if (item !== "chanNo") {
                                newFormData[`param2205_1_${item}`] = {
                                    chanNo: 1,
                                    type: item,
                                    value: newFormData[key][item],
                                };
                            }
                        }
                        delete newFormData[`param2205_1_audio`];
                    }
                    if (key.indexOf("horizonVanishLine") > -1) {
                        newFormData["param2205_1_horizonVanishLine"] = {
                            chanNo: newFormData["param2205_1_horizonVanishLine"]
                                .chanNo,
                            type: "horizonVanishLine",
                            value: newFormData["param2205_1_horizonVanishLine"][
                                "horizonVanishLine"
                            ],
                        };
                    }
                    if (key.indexOf("verticalVanishLine") > -1) {
                        newFormData["param2205_1_verticalVanishLine"] = {
                            chanNo: newFormData[
                                "param2205_1_verticalVanishLine"
                            ].chanNo,
                            type: "verticalVanishLine",
                            value: newFormData[
                                "param2205_1_verticalVanishLine"
                            ]["verticalVanishLine"],
                        };
                    }
                }
                if (key.indexOf("param901") > -1) {
                    if (
                        newFormData[key].info[0].hasOwnProperty(
                            "distanceBeyongLane"
                        )
                    ) {
                        newFormData[key].info[0].distanceBeyongLane =
                            newFormData[key].info[0].distanceBeyongLane * 1000;
                    }
                    if (
                        newFormData[key].info[0].hasOwnProperty(
                            "nearCarDistance"
                        )
                    ) {
                        newFormData[key].info[0].nearCarDistance =
                            newFormData[key].info[0].nearCarDistance * 1000;
                    }
                    if (
                        newFormData[key].info[0].hasOwnProperty(
                            "collisionDistance"
                        )
                    ) {
                        newFormData[key].info[0].collisionDistance =
                            newFormData[key].info[0].collisionDistance * 1000;
                    }
                }
                if (key.indexOf("param993") > -1) {
                    if (
                        newFormData[key].banTime &&
                        newFormData[key].banTime.length
                    ) {
                        newFormData[key].banTime.forEach((item) => {
                            if (item.hasOwnProperty("advanceWarningTime")) {
                                item.advanceWarningTime =
                                    item.advanceWarningTime * 60;
                            }
                            if (item.hasOwnProperty("warningPeriod")) {
                                item.warningPeriod = item.warningPeriod * 60;
                            }
                        });
                    }
                }
            }
            return newFormData;
        },
        saveAsTemplate() {
            let ehomeParams = [];
            let formatFormData = this.formatParams();
            for (let key of Object.keys(formatFormData)) {
                let msgId = utils.getMsgId(
                    Number(key.split("_")[0].split("param")[1])
                );
                ehomeParams.push({
                    msgId: msgId,
                    params: formatFormData[key],
                });
            }
            let params = {
                templateType: 1,
                id: this.id ? this.id : this.$route.query.id,
                templateContent: JSON.stringify({
                    menuList: this.menuList,
                    ehomeParams: ehomeParams,
                    capability: this.capability,
                }),
            };
            this.$api.hikDevParamTempUpdate(params).then((res) => {
                if (res.success == true) {
                    this.goBack();
                    this.$message.success("编辑模板成功！");
                } else {
                    this.$message.error("编辑模板失败:" + res.msg);
                }
            });
        },
    },
};
</script>
<style lang="less" scoped>
.tab1-content {
    height: 100%;
    .top-content {
        height: calc(~"100% - 48px");
        display: flex;
    }
    .tab1-menu {
        width: 240px;
        border-right: 1px solid #e9e9e9;
        .el-menu {
            background: transparent;
            height: 100%;
            overflow-y: auto;
        }
        .el-menu-item {
            &::before {
                border-left: 0px;
            }
            &::after {
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                border-right: 2px solid #2080f7;
                content: "";
                transform: scaleY(0.0001);
                transition: all 0.3s linear;
            }
        }
        .el-menu-item.is-active {
            background-color: #e7f7ff;
            color: #1890ff;
            &::after {
                transform: scaleY(1);
            }
        }
    }
    .tab1-form {
        width: calc(~"100% - 240px");
        padding: 14px;
        overflow-y: overlay;
    }
    .operate {
        box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.08);
        height: 48px;
        padding: 0 36px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
</style>
