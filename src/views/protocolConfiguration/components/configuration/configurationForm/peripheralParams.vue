<template>
    <div class="configuration-form">
        <el-form
            :label-width="`${labelWidth}px`"
            :model="newForm"
            :inline="true"
            ref="form"
        >
            <div v-if="platformList.length">
                <el-collapse v-model="collapseActiveName">
                    <el-collapse-item
                        v-for="(tabItem, index) in platformList"
                        :key="index"
                        :title="tabItem.label"
                        :name="tabItem.label"
                        arrowPlacement="right"
                    >
                        <!-- v-if="newForm[`param705_${index}`]" -->
                        <template>
                            <el-tabs v-model="tabItem.activeName">
                                <el-tab-pane
                                    v-for="(chanNoItem, index2) in warnOutObj[
                                        tabItem.name
                                    ]"
                                    :key="index2"
                                    :label="`通道${chanNoItem.chanNo}`"
                                    :name="chanNoItem.chanNo + ''"
                                >
                                    <template
                                        v-if="
                                            newForm[
                                                `param948_${tabItem.type}_${chanNoItem.chanNo}`
                                            ]
                                        "
                                    >
                                        <el-form-item
                                            label="使能"
                                            v-if="chanNoItem.enable"
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param948_${tabItem.type}_${chanNoItem.chanNo}`
                                                    ].enable
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警器类型"
                                            v-if="chanNoItem.deviceList"
                                        >
                                            <el-select
                                                v-model="
                                                    newForm[
                                                        `param948_${tabItem.type}_${chanNoItem.chanNo}`
                                                    ].alarmIndex
                                                "
                                            >
                                                <el-option
                                                    v-for="item in chanNoItem.deviceList"
                                                    :label="item.name"
                                                    :value="item.alarmIndex"
                                                    :key="item.alarmIndex"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </template>
                                </el-tab-pane>
                            </el-tabs>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div
                v-if="
                    newForm['param981'] &&
                    capability.intelliDrive_sensor &&
                    capability.intelliDrive_sensor.fuelSensor
                "
            >
                <h3>油耗传感器</h3>
                <el-form-item
                    label="传感器类型"
                    v-if="
                        capability.intelliDrive_sensor &&
                        capability.intelliDrive_sensor.fuelSensor &&
                        capability.intelliDrive_sensor.fuelSensor.fuelSensorList
                    "
                >
                    <el-select v-model="newForm['param981'].type">
                        <el-option
                            v-for="item in capability.intelliDrive_sensor
                                .fuelSensor.fuelSensorList"
                            :label="item.name"
                            :value="item.type"
                            :key="item.type"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="油箱深度"
                    v-if="
                        capability.intelliDrive_sensor &&
                        capability.intelliDrive_sensor.fuelSensor &&
                        capability.intelliDrive_sensor.fuelSensor.fuelTankDepth
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param981'].fuelTankDepth"
                        :min="
                            capability.intelliDrive_sensor.fuelSensor
                                .fuelTankDepth.min
                        "
                        :max="
                            capability.intelliDrive_sensor.fuelSensor
                                .fuelTankDepth.max
                        "
                        data-unit="mm"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param981'].fuelTankDepth = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
                <el-form-item
                    label="油箱体积"
                    v-if="
                        capability.intelliDrive_sensor &&
                        capability.intelliDrive_sensor.fuelSensor &&
                        capability.intelliDrive_sensor.fuelSensor.fuelTankVolume
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param981'].fuelTankVolume"
                        :min="
                            capability.intelliDrive_sensor.fuelSensor
                                .fuelTankVolume.min
                        "
                        :max="
                            capability.intelliDrive_sensor.fuelSensor
                                .fuelTankVolume.max
                        "
                        data-unit="0.01L"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param981'].fuelTankVolume = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param979'] &&
                    capability.intelliDrive_sensor &&
                    capability.intelliDrive_sensor.turnSensor
                "
            >
                <h3>正反转传感器</h3>
                <el-form-item
                    label="传感器类型"
                    v-if="
                        capability.intelliDrive_sensor &&
                        capability.intelliDrive_sensor.turnSensor &&
                        capability.intelliDrive_sensor.turnSensor.turnSensorList
                    "
                >
                    <el-select v-model="newForm['param979'].type">
                        <el-option
                            v-for="item in capability.intelliDrive_sensor
                                .turnSensor.turnSensorList"
                            :label="item.name"
                            :value="item.type"
                            :key="item.type"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="转速标定"
                    v-if="
                        capability.intelliDrive_sensor &&
                        capability.intelliDrive_sensor.turnSensor &&
                        capability.intelliDrive_sensor.turnSensor
                            .turnSpeedCalibration
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param979'].speedCalibration"
                        :min="
                            capability.intelliDrive_sensor.turnSensor
                                .turnSpeedCalibration.min
                        "
                        :max="
                            capability.intelliDrive_sensor.turnSensor
                                .turnSpeedCalibration.max
                        "
                        data-unit="r/min"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param979'].speedCalibration =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
                <el-form-item
                    label="静止标定"
                    v-if="
                        capability.intelliDrive_sensor &&
                        capability.intelliDrive_sensor.turnSensor &&
                        capability.intelliDrive_sensor.turnSensor
                            .turnStopCalibration
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param979'].stopCalibration"
                        :min="
                            capability.intelliDrive_sensor.turnSensor
                                .turnStopCalibration.min
                        "
                        :max="
                            capability.intelliDrive_sensor.turnSensor
                                .turnStopCalibration.max
                        "
                        data-unit="s/r"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param979'].stopCalibration =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param1307'] &&
                    capability['zhatu'] &&
                    capability['zhatu']['externalInfo']
                "
            >
                <h3>外屏参数</h3>
                <el-form-item
                    label="采集类型"
                    v-if="
                        capability.zhatu &&
                        capability.zhatu.externalInfo &&
                        capability.zhatu.externalInfo.acquireType
                    "
                >
                    <el-select v-model="newForm['param1307'].acquireType">
                        <el-option
                            v-for="item in enumeration[
                                'zhatu_externalInfo_acquireType'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="外屏亮度调节"
                    v-if="
                        capability.zhatu &&
                        capability.zhatu.externalInfo &&
                        capability.zhatu.externalInfo.lightAdjust
                    "
                >
                    <el-select v-model="newForm['param1307'].lightAdjust">
                        <el-option
                            v-for="item in enumeration[
                                'zhatu_externalInfo_lightAdjust'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="显示类型"
                    v-if="
                        capability.zhatu &&
                        capability.zhatu.externalInfo &&
                        capability.zhatu.externalInfo.showMask
                    "
                >
                    <el-select
                        v-model="newForm['param1307'].showMask"
                        multiple
                        collapse-tags
                    >
                        <el-option
                            v-for="item in enumeration[
                                'zhatu_externalInfo_showMask'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                            :disabled="item.value === 0 ? true : false"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="广告显示控制"
                    v-if="
                        capability.zhatu &&
                        capability.zhatu.externalInfo &&
                        capability.zhatu.externalInfo.advertShowCtrl
                    "
                >
                    <el-select v-model="newForm['param1307'].advertShowCtrl">
                        <el-option
                            v-for="item in enumeration[
                                'zhatu_externalInfo_advertShowCtrl'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="稽查时间"
                    v-if="
                        capability.zhatu &&
                        capability.zhatu.externalInfo &&
                        capability.zhatu.externalInfo.checkTime
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param1307'].checkTime"
                        :min="capability.zhatu.externalInfo.checkTime.min"
                        :max="capability.zhatu.externalInfo.checkTime.max"
                        data-unit="s"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param1307'].checkTime = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param1311'] &&
                    capability.zhatu &&
                    capability.zhatu.androidScreen
                "
            >
                <h3>安卓屏控制</h3>
                <el-form-item
                    label="安卓屏类型"
                    v-if="
                        capability.zhatu &&
                        capability.zhatu.androidScreen &&
                        capability.zhatu.androidScreen.screenType
                    "
                >
                    <el-select v-model="newForm['param1311'].screenType">
                        <el-option
                            v-for="item in enumeration[
                                'zhatu_androidScreen_screenType'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="证件类型"
                    v-if="
                        capability.zhatu &&
                        capability.zhatu.androidScreen &&
                        capability.zhatu.androidScreen.certType
                    "
                >
                    <el-select
                        v-model="newForm['param1311'].certType"
                        multiple
                        collapse-tags
                    >
                        <el-option
                            v-for="item in enumeration[
                                'zhatu_androidScreen_certType'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="默认证件"
                    v-if="
                        capability.zhatu &&
                        capability.zhatu.androidScreen &&
                        capability.zhatu.androidScreen.defaultCert
                    "
                >
                    <el-select v-model="newForm['param1311'].defaultCert">
                        <el-option
                            v-for="item in enumeration[
                                'zhatu_androidScreen_defaultCert'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="安卓屏默认界面"
                    v-if="
                        capability.zhatu &&
                        capability.zhatu.androidScreen &&
                        capability.zhatu.androidScreen.defaultShow
                    "
                >
                    <el-select v-model="newForm['param1311'].defaultShow">
                        <el-option
                            v-for="item in enumeration[
                                'zhatu_androidScreen_defaultShow'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="安卓屏控制"
                    v-if="
                        capability.zhatu &&
                        capability.zhatu.androidScreen &&
                        capability.zhatu.androidScreen.notifyCtrl
                    "
                >
                    <el-select v-model="newForm['param1311'].notifyCtrl">
                        <el-option
                            v-for="item in enumeration[
                                'zhatu_androidScreen_notifyCtrl'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>
<script>
import mixins from "@/mixins/mixins";
export default {
    name: "peripheralParams",
    mixins: [mixins],
    components: {},
    props: {},
    data() {
        return {
            componentsName: "platformParams",
            collapseActiveName: "",
            setForm: {},
            platformList: [],
            warnOutObj: {},
        };
    },
    activated() {
        this.$nextTick(() => {
            this.labelWidthResize();
        });
    },
    mounted() {
        this.initConfig();
    },
    computed: {},
    watch: {
        newForm: {
            handler(val) {
                if (val) {
                    this.platformList.forEach((tabItem) => {
                        this.warnOutObj[tabItem.name].forEach((chanNoItem) => {
                            if (
                                val[
                                    `param948_${tabItem.type}_${chanNoItem.chanNo}`
                                ]
                            ) {
                                let objName = `${tabItem.label}>通道${chanNoItem.chanNo}&param948_${tabItem.type}_${chanNoItem.chanNo}`;
                                if (!this.setForm.hasOwnProperty(objName)) {
                                    this.setForm[objName] = {};
                                }
                                this.setForm[objName].enable =
                                    val[
                                        `param948_${tabItem.type}_${chanNoItem.chanNo}`
                                    ].enable !==
                                        this.oldForm[
                                            `param948_${tabItem.type}_${chanNoItem.chanNo}`
                                        ].enable ||
                                    (this.isTemplate &&
                                        val[
                                            `param948_${tabItem.type}_${chanNoItem.chanNo}`
                                        ].hasOwnProperty("enable"))
                                        ? `param948_${tabItem.type}_${
                                              chanNoItem.chanNo
                                          }.enable&使能switch&${
                                              val[
                                                  `param948_${tabItem.type}_${chanNoItem.chanNo}`
                                              ].enable
                                          }`
                                        : null;
                                this.setForm[objName].alarmIndex =
                                    val[
                                        `param948_${tabItem.type}_${chanNoItem.chanNo}`
                                    ].alarmIndex !==
                                        this.oldForm[
                                            `param948_${tabItem.type}_${chanNoItem.chanNo}`
                                        ].alarmIndex ||
                                    (this.isTemplate &&
                                        val[
                                            `param948_${tabItem.type}_${chanNoItem.chanNo}`
                                        ].hasOwnProperty("alarmIndex"))
                                        ? `param948_${tabItem.type}_${
                                              chanNoItem.chanNo
                                          }.alarmIndex&报警器类型number&${this.getAlarmIndex(
                                              chanNoItem.deviceList,
                                              val[
                                                  `param948_${tabItem.type}_${chanNoItem.chanNo}`
                                              ].alarmIndex
                                          )}&${
                                              val[
                                                  `param948_${tabItem.type}_${chanNoItem.chanNo}`
                                              ].alarmIndex
                                          }`
                                        : null;
                            }
                        });
                    });
                    if (val.param981) {
                        if (
                            !this.setForm.hasOwnProperty("油耗传感器&param981")
                        ) {
                            this.setForm["油耗传感器&param981"] = {};
                        }
                        this.setForm["油耗传感器&param981"].type =
                            val["param981"].type !=
                                this.oldForm["param981"].type ||
                            (this.isTemplate &&
                                val["param981"].hasOwnProperty("type"))
                                ? `param981.type&传感器类型number&${this.getFuelSensorListLabel(
                                      this.capability.intelliDrive_sensor
                                          .fuelSensor.fuelSensorList,
                                      val["param981"].type
                                  )}&${val["param981"].type}`
                                : null;
                        this.setForm["油耗传感器&param981"].fuelTankDepth =
                            val["param981"].fuelTankDepth !=
                                this.oldForm["param981"].fuelTankDepth ||
                            (this.isTemplate &&
                                val["param981"].hasOwnProperty("fuelTankDepth"))
                                ? `param981.fuelTankDepth&油箱深度number&${val["param981"].fuelTankDepth}`
                                : null;
                        this.setForm["油耗传感器&param981"].fuelTankVolume =
                            val["param981"].fuelTankVolume !=
                                this.oldForm["param981"].fuelTankVolume ||
                            (this.isTemplate &&
                                val["param981"].hasOwnProperty(
                                    "fuelTankVolume"
                                ))
                                ? `param981.fuelTankVolume&油箱体积number&${val["param981"].fuelTankVolume}`
                                : null;
                    }
                    if (val.param979) {
                        if (
                            !this.setForm.hasOwnProperty(
                                "正反转传感器&param979"
                            )
                        ) {
                            this.setForm["正反转传感器&param979"] = {};
                        }
                        this.setForm["正反转传感器&param979"].type =
                            val["param979"].type !=
                                this.oldForm["param979"].type ||
                            (this.isTemplate &&
                                val["param979"].hasOwnProperty("type"))
                                ? `param979.type&传感器类型number&${this.getFuelSensorListLabel(
                                      this.capability.intelliDrive_sensor
                                          .turnSensor.turnSensorList,
                                      val["param979"].type
                                  )}&${val["param979"].type}`
                                : null;
                        this.setForm["正反转传感器&param979"].speedCalibration =
                            val["param979"].speedCalibration !=
                                this.oldForm["param979"].speedCalibration ||
                            (this.isTemplate &&
                                val["param979"].hasOwnProperty(
                                    "speedCalibration"
                                ))
                                ? `param979.speedCalibration&转速标定number&${val["param979"].speedCalibration}`
                                : null;
                        this.setForm["正反转传感器&param979"].stopCalibration =
                            val["param979"].stopCalibration !=
                                this.oldForm["param979"].stopCalibration ||
                            (this.isTemplate &&
                                val["param979"].hasOwnProperty(
                                    "stopCalibration"
                                ))
                                ? `param979.stopCalibration&静止标定number&${val["param979"].stopCalibration}`
                                : null;
                    }
                    if (val.param1307) {
                        if (
                            !this.setForm.hasOwnProperty("外屏参数&param1307")
                        ) {
                            this.setForm["外屏参数&param1307"] = {};
                        }
                        this.setForm["外屏参数&param1307"].acquireType =
                            val["param1307"].acquireType !=
                                this.oldForm["param1307"].acquireType ||
                            (this.isTemplate &&
                                val["param1307"].hasOwnProperty("acquireType"))
                                ? `param1307.acquireType&采集类型number&${this.getLabel(
                                      "zhatu_externalInfo_acquireType",
                                      val["param1307"].acquireType
                                  )}&${val["param1307"].acquireType}`
                                : null;
                        this.setForm["外屏参数&param1307"].lightAdjust =
                            val["param1307"].lightAdjust !=
                                this.oldForm["param1307"].lightAdjust ||
                            (this.isTemplate &&
                                val["param1307"].hasOwnProperty("lightAdjust"))
                                ? `param1307.lightAdjust&外屏亮度调节number&${this.getLabel(
                                      "zhatu_externalInfo_lightAdjust",
                                      val["param1307"].lightAdjust
                                  )}&${val["param1307"].lightAdjust}`
                                : null;
                        this.setForm["外屏参数&param1307"].showMask =
                            this.isEqual(
                                val["param1307"].showMask,
                                this.oldForm["param1307"].showMask
                            ) ||
                            (this.isTemplate &&
                                val["param1307"].hasOwnProperty("showMask"))
                                ? `param1307.showMask&显示类型array&${this.getLabelSelfArr(
                                      this.enumeration[
                                          "zhatu_externalInfo_showMask"
                                      ],
                                      val["param1307"].showMask
                                  )}&${val["param1307"].showMask}`
                                : null;
                        this.setForm["外屏参数&param1307"].advertShowCtrl =
                            val["param1307"].advertShowCtrl !=
                                this.oldForm["param1307"].advertShowCtrl ||
                            (this.isTemplate &&
                                val["param1307"].hasOwnProperty(
                                    "advertShowCtrl"
                                ))
                                ? `param1307.advertShowCtrl&广告显示控制number&${this.getLabel(
                                      "zhatu_externalInfo_advertShowCtrl",
                                      val["param1307"].advertShowCtrl
                                  )}&${val["param1307"].advertShowCtrl}`
                                : null;
                        this.setForm["外屏参数&param1307"].checkTime =
                            val["param1307"].checkTime !=
                                this.oldForm["param1307"].checkTime ||
                            (this.isTemplate &&
                                val["param1307"].hasOwnProperty("checkTime"))
                                ? `param1307.checkTime&广告显示控制number&${val["param1307"].checkTime}`
                                : null;
                    }
                    if (val.param1311) {
                        if (
                            !this.setForm.hasOwnProperty("安卓屏控制&param1311")
                        ) {
                            this.setForm["安卓屏控制&param1311"] = {};
                        }
                        this.setForm["安卓屏控制&param1311"].screenType =
                            val["param1311"].screenType !=
                                this.oldForm["param1311"].screenType ||
                            (this.isTemplate &&
                                val["param1311"].hasOwnProperty("screenType"))
                                ? `param1311.screenType&安卓屏类型number&${this.getLabel(
                                      "zhatu_androidScreen_screenType",
                                      val["param1311"].screenType
                                  )}&${val["param1311"].screenType}`
                                : null;
                        this.setForm["安卓屏控制&param1311"].certType =
                            this.isEqual(
                                val["param1311"].certType,
                                this.oldForm["param1311"].certType
                            ) ||
                            (this.isTemplate &&
                                val["param1311"].hasOwnProperty("certType"))
                                ? `param1311.certType&证件类型array&${this.getLabelSelfArr(
                                      this.enumeration[
                                          "zhatu_androidScreen_certType"
                                      ],
                                      val["param1311"].certType
                                  )}&${val["param1311"].certType}`
                                : null;
                        this.setForm["安卓屏控制&param1311"].defaultCert =
                            val["param1311"].defaultCert !=
                                this.oldForm["param1311"].defaultCert ||
                            (this.isTemplate &&
                                val["param1311"].hasOwnProperty("defaultCert"))
                                ? `param1311.defaultCert&默认证件number&${this.getLabel(
                                      "zhatu_androidScreen_defaultCert",
                                      val["param1311"].defaultCert
                                  )}&${val["param1311"].defaultCert}`
                                : null;
                        this.setForm["安卓屏控制&param1311"].defaultShow =
                            val["param1311"].defaultShow !=
                                this.oldForm["param1311"].defaultShow ||
                            (this.isTemplate &&
                                val["param1311"].hasOwnProperty("defaultShow"))
                                ? `param1311.defaultShow&安卓屏默认界面number&${this.getLabel(
                                      "zhatu_androidScreen_defaultShow",
                                      val["param1311"].defaultShow
                                  )}&${val["param1311"].defaultShow}`
                                : null;
                        this.setForm["安卓屏控制&param1311"].notifyCtrl =
                            val["param1311"].notifyCtrl !=
                                this.oldForm["param1311"].notifyCtrl ||
                            (this.isTemplate &&
                                val["param1311"].hasOwnProperty("notifyCtrl"))
                                ? `param1311.notifyCtrl&安卓屏控制number&${this.getLabel(
                                      "zhatu_androidScreen_notifyCtrl",
                                      val["param1311"].notifyCtrl
                                  )}&${val["param1311"].notifyCtrl}`
                                : null;
                    }
                    this.$emit("setFormChange", {
                        外设设置: this.setForm,
                    });
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        getFuelSensorListLabel(arr, val) {
            let attribute = arr.find((e) => e.type === val);
            if (attribute) {
                return attribute.name;
            } else {
                return null;
            }
        },
        getAlarmIndex(list, val) {
            let attribute = list.find((e) => e.alarmIndex === val);
            if (attribute) {
                return attribute.name;
            } else {
                return null;
            }
        },
        initConfig() {
            this.$emit("setFormLoading", true);
            let initConfigList = [
                this.getEHomeConfig(1307),
                this.getEHomeConfig(1311),
                this.getEHomeConfig(981),
                this.getEHomeConfig(979),
            ];

            this.platformList = [];
            this.warnOutObj = JSON.parse(
                JSON.stringify(this.capability.peripheral_warn_out)
            );
            if (
                this.warnOutObj &&
                this.warnOutObj.alarmOutput &&
                this.warnOutObj.alarmOutput.length
            ) {
                this.warnOutObj.alarmInside = JSON.parse(
                    JSON.stringify(this.warnOutObj.alarmOutput)
                );
                this.warnOutObj.alarmOutput.forEach((item) => {
                    item.deviceList = item.deviceList.filter(
                        (i) => i.type === 1
                    );
                });
                this.warnOutObj.alarmInside.forEach((item) => {
                    item.deviceList = item.deviceList.filter(
                        (i) => i.type === 2
                    );
                });
            }
            let bol = false;
            this.capability.peripheral_warn_out.alarmOutput.forEach((i) => {
                i.deviceList.some((k) => {
                    if (k.type === 2) {
                        bol = true;
                        return true;
                    }
                });
            });
            for (let key of Object.keys(this.warnOutObj)) {
                if (key === "alarmOutput") {
                    this.platformList.push({
                        label: "声光报警器(外置)",
                        name: "alarmOutput",
                        activeName: this.warnOutObj[key][0].chanNo + "",
                        type: 1,
                    });
                    this.warnOutObj[key].forEach((item) => {
                        initConfigList.push(
                            this.getEHomeConfig(948, {
                                type: 1,
                                chanNo: item.chanNo,
                            })
                        );
                    });
                }
                if (key === "alarmInside" && bol) {
                    this.platformList.push({
                        label: "声光报警器(内置)",
                        name: "alarmInside",
                        activeName: this.warnOutObj[key][0].chanNo + "",
                        type: 2,
                    });
                    this.warnOutObj[key].forEach((item) => {
                        if (item.deviceList.length) {
                            initConfigList.push(
                                this.getEHomeConfig(948, {
                                    type: 2,
                                    chanNo: item.chanNo,
                                })
                            );
                        }
                    });
                }
            }
            if (this.platformList.length) {
                this.collapseActiveName = this.platformList[0].label;
            }
            Promise.all(initConfigList).then((result) => {
                this.$emit("setFormLoading", false);
                this.$emit("loadingSuccess");
            });
        },
    },
};
</script>
<style lang="less" scoped>
@import "./configurationForm.less";
/deep/.el-select {
    .el-tag {
        .el-tag--maxwidth {
            max-width: 64px !important;
        }
    }
}
</style>
