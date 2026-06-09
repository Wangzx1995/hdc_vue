<template>
    <div class="p-a-md">
        <h2>基本参数</h2>
        <el-form
            ref="PrivateVehicleInfoForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <template v-if="form['param8']">
                <div class="configurations">
                    <div
                        v-if="
                            deviceCapability['generic']['vehicleDetail'][
                                'plateNum'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item label="车牌号" prop="param8.plateNum">
                            <el-input
                                v-model="form['param8'].plateNum"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['generic']['vehicleDetail'][
                                'plateColor'
                            ] &&
                            deviceCapability['generic']['vehicleDetail'][
                                'plateColor'
                            ].length
                        "
                        class="configuration-item"
                    >
                        <el-form-item label="车牌颜色" prop="param8.plateColor">
                            <el-select v-model="form['param8'].plateColor">
                                <el-option
                                    v-for="item_ in dictionaryData[
                                        'plateColorGenericList'
                                    ]"
                                    :label="item_.label"
                                    :value="item_.id"
                                    :key="item_.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['generic']['vehicleDetail'][
                                'plateType'
                            ] &&
                            deviceCapability['generic']['vehicleDetail'][
                                'plateType'
                            ].length
                        "
                        class="configuration-item"
                    >
                        <el-form-item label="车牌类型" prop="param8.plateType">
                            <el-select v-model="form['param8'].plateType">
                                <el-option
                                    v-for="item_ in dictionaryData[
                                        'plateTypeGenericList'
                                    ]"
                                    :label="item_.label"
                                    :value="item_.id"
                                    :key="item_.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['generic']['vehicleDetail']['VIN']
                        "
                        class="configuration-item"
                    >
                        <el-form-item label="车辆VIN号" prop="param8.VIN">
                            <el-input v-model="form['param8'].VIN"></el-input>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['generic']['vehicleDetail'][
                                'provinceID'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="省域ID"
                            prop="param8.provinceID"
                            :rules="{
                                validator: checkString.bind({
                                    type: 'int',
                                    min: deviceCapability['generic'][
                                        'vehicleDetail'
                                    ]['provinceID']['min'],
                                    max: deviceCapability['generic'][
                                        'vehicleDetail'
                                    ]['provinceID']['max'],
                                }),
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                v-model="form['param8'].provinceID"
                                tips-placement="top-end"
                                :tips="`键入长度范围为${deviceCapability['generic']['vehicleDetail']['provinceID']['min']}~${deviceCapability['generic']['vehicleDetail']['provinceID']['max']}`"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['generic']['vehicleDetail'][
                                'cityID'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="市域ID"
                            prop="param8.cityID"
                            :rules="{
                                validator: checkString.bind({
                                    type: 'int',
                                    min: deviceCapability['generic'][
                                        'vehicleDetail'
                                    ]['cityID']['min'],
                                    max: deviceCapability['generic'][
                                        'vehicleDetail'
                                    ]['cityID']['max'],
                                }),
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                v-model="form['param8'].cityID"
                                tips-placement="top-end"
                                :tips="`键入长度范围为${deviceCapability['generic']['vehicleDetail']['cityID']['min']}~${deviceCapability['generic']['vehicleDetail']['cityID']['max']}`"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['generic']['vehicleDetail'][
                                'engineNum'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item label="发动机号" prop="param8.engineNum">
                            <el-input
                                v-model="form['param8'].engineNum"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['generic']['vehicleDetail'][
                                'manufacturerID'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="制造商ID"
                            prop="param8.manufacturerID"
                            :rules="{
                                validator: checkString.bind({
                                    type: 'int',
                                    min: deviceCapability['generic'][
                                        'vehicleDetail'
                                    ]['manufacturerID']['min'],
                                    max: deviceCapability['generic'][
                                        'vehicleDetail'
                                    ]['manufacturerID']['max'],
                                }),
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                v-model="form['param8'].manufacturerID"
                                tips-placement="top-end"
                                :tips="`键入长度范围为${deviceCapability['generic']['vehicleDetail']['manufacturerID']['min']}~${deviceCapability['generic']['vehicleDetail']['manufacturerID']['max']}`"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['generic']['vehicleDetail'][
                                'terminalType'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="终端类型"
                            prop="param8.terminalType"
                            :rules="{
                                validator: checkString.bind({
                                    type: 'int',
                                    min: deviceCapability['generic'][
                                        'vehicleDetail'
                                    ]['terminalType']['min'],
                                    max: deviceCapability['generic'][
                                        'vehicleDetail'
                                    ]['terminalType']['max'],
                                }),
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                v-model="form['param8'].terminalType"
                                tips-placement="top-end"
                                :tips="`键入长度范围为${deviceCapability['generic']['vehicleDetail']['terminalType']['min']}~${deviceCapability['generic']['vehicleDetail']['terminalType']['max']}`"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['intelliDrive_sensor'] &&
                            deviceCapability['intelliDrive_sensor'][
                                'pulseSetting'
                            ] &&
                            deviceCapability['intelliDrive_sensor'][
                                'pulseSetting'
                            ][0]['pulseCalibrationMode'] &&
                            deviceCapability['intelliDrive_sensor'][
                                'pulseSetting'
                            ][0]['pulseCalibrationMode'].length
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            v-if="form['param930']"
                            label="脉冲系数校准模式"
                            prop="param930.pulseCalibrationMode"
                        >
                            <el-select
                                v-model="form['param930'].pulseCalibrationMode"
                            >
                                <el-option
                                    :value="1"
                                    key="1"
                                    label="自动"
                                ></el-option>
                                <el-option
                                    :value="2"
                                    key="2"
                                    label="手动"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['intelliDrive_sensor'] &&
                            deviceCapability['intelliDrive_sensor'][
                                'pulseSetting'
                            ] &&
                            deviceCapability['intelliDrive_sensor'][
                                'pulseSetting'
                            ][0]['pulseCoefficient']
                        "
                        class="configuration-item"
                        :rules="{
                            validator: checkNumber.bind({
                                type: 'int',
                                min: deviceCapability['intelliDrive_sensor'][
                                    'pulseSetting'
                                ][0]['pulseCoefficient'][0],
                                max: deviceCapability['intelliDrive_sensor'][
                                    'pulseSetting'
                                ][0]['pulseCoefficient'][1],
                            }),
                            trigger: 'blur',
                        }"
                    >
                        <el-form-item
                            v-if="form['param930']"
                            label="脉冲系数"
                            prop="param930.pulseCoefficient"
                            :rules="{
                                validator: checkNumber.bind({
                                    type: 'int',
                                    min: deviceCapability[
                                        'intelliDrive_sensor'
                                    ]['pulseSetting'][0]['pulseCoefficient'][
                                        'min'
                                    ],
                                    max: deviceCapability[
                                        'intelliDrive_sensor'
                                    ]['pulseSetting'][0]['pulseCoefficient'][
                                        'max'
                                    ],
                                }),
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                v-model="form['param930'].pulseCoefficient"
                                tips-placement="top-end"
                                :tips="`键入值范围为${deviceCapability['intelliDrive_sensor']['pulseSetting'][0]['pulseCoefficient']['min']}~${deviceCapability['intelliDrive_sensor']['pulseSetting'][0]['pulseCoefficient']['max']}`"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                        deviceCapability['intelliDrive_sensor'] && 
                            deviceCapability['intelliDrive_sensor'][
                                'pulseSetting'
                            ] &&
                            deviceCapability['intelliDrive_sensor'][
                                'pulseSetting'
                            ][0]['speedSource']
                        "
                        class="configuration-item"
                        :rules="{
                            validator: checkNumber.bind({
                                type: 'int',
                                min: deviceCapability['intelliDrive_sensor'][
                                    'pulseSetting'
                                ][0]['speedSource'][0],
                                max: deviceCapability['intelliDrive_sensor'][
                                    'pulseSetting'
                                ][0]['speedSource'][1],
                            }),
                            trigger: 'blur',
                        }"
                    >
                        <el-form-item
                            v-if="form['param930']"
                            label="速度来源"
                            prop="param930.speedSource"
                        >
                            <el-select v-model="form['param930'].speedSource">
                                <el-option
                                    v-for="item_ in dictionaryData[
                                        'pulseSettingSpeedSourceList'
                                    ]"
                                    :label="item_.label"
                                    :value="item_.id"
                                    :key="item_.value"
                                ></el-option>
                            </el-select>
                            <!-- <el-input v-model="form['param930'].speedSource" tips-placement="top-end" :tips="`键入值范围为${deviceCapability['generic']['pulseSetting']['speedSource']['min']}~${deviceCapability['generic']['pulseSetting']['speedSource']['max']}`"></el-input> -->
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            form['param2222'] &&
                            deviceCapability['intelliDrive_sensor'][
                                'initialMileage'
                            ] &&
                            deviceCapability['intelliDrive_sensor'][
                                'initialMileage'
                            ]['initialMileage']
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="初始里程"
                            prop="param2222.initialMileage"
                        >
                            <el-input
                                v-model="form['param2222'].initialMileage"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            form['param2222'] &&
                            deviceCapability['intelliDrive_sensor'][
                                'initialMileage'
                            ] &&
                            deviceCapability['intelliDrive_sensor'][
                                'initialMileage'
                            ]['mileageRadio']
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="里程补传系数"
                            prop="param2222.mileageRadio"
                            :rules="{
                                validator: checkNumber.bind({
                                    type: 'int',
                                    min: deviceCapability[
                                        'intelliDrive_sensor'
                                    ]['initialMileage']['mileageRadio']['min'],
                                    max: deviceCapability[
                                        'intelliDrive_sensor'
                                    ]['initialMileage']['mileageRadio']['max'],
                                }),
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                v-model="form['param2222'].mileageRadio"
                                tips-placement="top-end"
                                :tips="`键入值范围为${deviceCapability['intelliDrive_sensor']['initialMileage']['mileageRadio']['min']}~${deviceCapability['intelliDrive_sensor']['initialMileage']['mileageRadio']['max']}`"
                            ></el-input>
                        </el-form-item>
                    </div>
                </div>
                <h2
                    class="maginBottom"
                    v-if="deviceCapability['generic']['driverInfo']"
                >
                    IC卡写卡
                </h2>
                <div
                    class="configurations"
                    v-if="
                        deviceCapability['generic']['driverInfo'] &&
                        form['param10']
                    "
                >
                    <div
                        v-if="
                            deviceCapability['generic']['driverInfo'][
                                'driverName'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="驾驶员姓名"
                            prop="param10.driverName"
                        >
                            <el-input
                                v-model="form['param10'].driverName"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['generic']['driverInfo'][
                                'qualCert'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="从业资格证号"
                            prop="param10.qualCert"
                            :rules="{
                                validator: validQualCert,
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                v-model="form['param10'].qualCert"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['generic']['driverInfo'][
                                'identityID'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="身份证号"
                            prop="param10.identityID"
                        >
                            <el-input
                                v-model="form['param10'].identityID"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['generic']['driverInfo'][
                                'licenseNumber'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="驾驶证信息"
                            prop="param10.licenseNumber"
                            :rules="{
                                validator: validQualCert,
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                v-model="form['param10'].licenseNumber"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['generic']['driverInfo'][
                                'certificationOrgan'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="IC卡发证机构"
                            prop="param10.certificationOrgan"
                        >
                            <el-input
                                v-model="form['param10'].certificationOrgan"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['generic']['driverInfo'][
                                'validTime'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="IC卡有效期"
                            prop="param10.validTime"
                        >
                            <el-date-picker
                                v-model="form['param10'].validTime"
                                type="date"
                                placeholder="请选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions"
                            />
                        </el-form-item>
                    </div>
                </div>
            </template>
        </el-form>
    </div>
</template>

<script>
import { validateNum } from "@/utils/validate";
export default {
    props: {
        allCapability: {
            type: Object,
            default: () => {
                return {};
            },
        },
        formDetail: {
            type: Object,
            default: () => {
                return {};
            },
        },
        originalForm: {
            type: Object,
            default: () => {
                return {};
            },
        },
        setStatisticsData: {
            type: Object,
            default: () => {
                return {};
            },
        },
        allEnumerationData: {
            type: Object,
            default: () => {
                return {};
            },
        },
        setConfigParams: {
            type: Boolean,
            default: false,
        },
        isTemplate: {
            type: String,
        },
    },
    watch: {
        allCapability: {
            handler(val) {
                if (val) {
                    console.log(val);
                    this.deviceCapability = val;
                }
            },
            deep: true,
            immediate: true,
        },
        formDetail: {
            handler(val) {
                if (val) {
                    this.form = val;
                }
            },
            deep: true,
            immediate: true,
        },
        originalForm: {
            handler(val) {
                if (val) {
                    this.copyForm = val;
                }
            },
            deep: true,
            immediate: true,
        },
        copyForm: {
            handler(val) {
                if (val) {
                    this.$emit("changeCopy", val);
                }
            },
            deep: true,
            immediate: false,
        },
        setStatisticsData: {
            handler(val) {
                if (val) {
                    this.formData = val;
                }
            },
            deep: true,
            immediate: true,
        },
        allEnumerationData: {
            handler(val) {
                if (val) {
                    this.dictionaryData = val;
                }
            },
            deep: true,
            immediate: true,
        },
        setConfigParams: {
            handler(val) {
                if (val) {
                    this.childConfigParams = val;
                    this.getPrivateProcotol();
                }
            },
            deep: true,
            immediate: true,
        },
        childConfigParams: {
            handler(val) {
                this.$emit("changeConfigParams", val);
            },
            deep: true,
            immediate: true,
        },
        "form.param8": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData["param8.plateNum"] =
                        val["plateNum"] !== this.copyForm["param8"]["plateNum"]
                            ? `param8.plateNum&车辆设备/车辆信息/车牌号&${val["plateNum"]}&${this.copyForm["param8"]["plateNum"]}`
                            : "";
                    this.formData["param8.plateColor"] =
                        val["plateColor"] !==
                        this.copyForm["param8"]["plateColor"]
                            ? `param8.plateColor&车辆设备/车辆信息/车牌颜色&${
                                  this.dictionaryData["plateColorGenericJson"][
                                      val["plateColor"]
                                  ]
                              }&${this.copyForm["param8"]["plateColor"]}`
                            : "";
                    this.formData["param8.plateType"] =
                        val["plateType"] !==
                        this.copyForm["param8"]["plateType"]
                            ? `param8.plateType&车辆设备/车辆信息/车牌类型&${
                                  this.dictionaryData["plateTypeGenericJson"][
                                      val["plateType"]
                                  ]
                              }&${this.copyForm["param8"]["plateType"]}`
                            : "";
                    this.formData["param8.VIN"] =
                        val["VIN"] !== this.copyForm["param8"]["VIN"]
                            ? `param8.VIN&车辆设备/车辆信息/车辆VIN号&${val["VIN"]}&${this.copyForm["param8"]["VIN"]}`
                            : "";
                    this.formData["param8.provinceID"] =
                        val["provinceID"] !==
                        this.copyForm["param8"]["provinceID"]
                            ? `param8.manufacturerID&车辆设备/车辆信息/省域ID&${val["provinceID"]}&${this.copyForm["param8"]["provinceID"]}`
                            : "";
                    this.formData["param8.cityID"] =
                        val["cityID"] !== this.copyForm["param8"]["cityID"]
                            ? `param8.cityID&车辆设备/车辆信息/省域ID&${val["cityID"]}&${this.copyForm["param8"]["cityID"]}`
                            : "";
                    this.formData["param8.engineNum"] =
                        val["engineNum"] !==
                        this.copyForm["param8"]["engineNum"]
                            ? `param8.engineNum&车辆设备/车辆信息/发动机号&${val["engineNum"]}&${this.copyForm["param8"]["engineNum"]}`
                            : "";
                    this.formData["param8.manufacturerID"] =
                        val["manufacturerID"] !==
                        this.copyForm["param8"]["manufacturerID"]
                            ? `param8.manufacturerID&车辆设备/车辆信息/制造商ID&${val["manufacturerID"]}&${this.copyForm["param8"]["manufacturerID"]}`
                            : "";
                    this.formData["param8.terminalType"] =
                        val["terminalType"] !==
                        this.copyForm["param8"]["terminalType"]
                            ? `param8.terminalType&车辆设备/车辆信息/终端类型&${val["terminalType"]}&${this.copyForm["param8"]["terminalType"]}`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param930": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData["param930.pulseCalibrationMode"] =
                        val["pulseCalibrationMode"] !==
                        this.copyForm["param930"]["pulseCalibrationMode"]
                            ? `param930.pulseCalibrationMode&车辆设备/车辆信息/脉冲系数校准模式&${
                                  val["pulseCalibrationMode"] == 1
                                      ? "自动"
                                      : "手动"
                              }&${
                                  this.copyForm["param930"][
                                      "pulseCalibrationMode"
                                  ]
                              }`
                            : "";
                    this.formData["param930.pulseCoefficient"] =
                        val["pulseCoefficient"] !==
                        this.copyForm["param930"]["pulseCoefficient"]
                            ? `param930.pulseCoefficient&车辆设备/车辆信息/脉冲系数校准模式&${val["pulseCoefficient"]}&${this.copyForm["param930"]["pulseCoefficient"]}`
                            : "";
                    this.formData["param930.speedSource"] =
                        val["speedSource"] !==
                        this.copyForm["param930"]["speedSource"]
                            ? `param930.speedSource&车辆设备/车辆信息/速度来源&${
                                  this.dictionaryData[
                                      "pulseSettingSpeedSourceJson"
                                  ][val["speedSource"]]
                              }&${
                                  this.dictionaryData[
                                      this.copyForm["param930"]["speedSource"]
                                  ]
                              }`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param2222": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData["param2222.initialMileage"] =
                        val["initialMileage"] !==
                        this.copyForm["param2222"]["initialMileage"]
                            ? `param2222.initialMileage&车辆设备/车辆信息/初始里程&${val["initialMileage"]}&${this.copyForm["param2222"]["initialMileage"]}`
                            : "";
                    this.formData["param2222.mileageRadio"] =
                        val["mileageRadio"] !==
                        this.copyForm["param2222"]["mileageRadio"]
                            ? `param2222.mileageRadio&车辆设备/车辆信息/里程补偿系数&${val["mileageRadio"]}&${this.copyForm["param2222"]["mileageRadio"]}`
                            : "";
                    this.formData["param2222.speedSource"] =
                        val["speedSource"] !==
                        this.copyForm["param2222"]["speedSource"]
                            ? `param2222.speedSource&车辆设备/车辆信息/脉冲系数校准模式&${this.dictionaryData["pulseSettingSpeedSourceJson"]["speedSource"]}`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param10": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData["param10.driverName"] =
                        val["driverName"] !==
                        this.copyForm["param10"]["driverName"]
                            ? `param10.driverName&车辆设备/车辆信息/IC卡写卡/驾驶员姓名&${val["driverName"]}`
                            : "";
                    this.formData["param10.qualCert"] =
                        val["qualCert"] !== this.copyForm["param10"]["qualCert"]
                            ? `param10.qualCert&车辆设备/车辆信息/IC卡写卡/从业资格证号&${val["qualCert"]}`
                            : "";
                    this.formData["param10.identityID"] =
                        val["identityID"] !==
                        this.copyForm["param10"]["identityID"]
                            ? `param10.identityID&车辆设备/车辆信息/IC卡写卡/身份证号&${val["identityID"]}`
                            : "";
                    this.formData["param10.licenseNumber"] =
                        val["licenseNumber"] !==
                        this.copyForm["param10"]["licenseNumber"]
                            ? `param10.licenseNumber&车辆设备/车辆信息/IC卡写卡/驾驶证信息&${val["licenseNumber"]}`
                            : "";
                    this.formData["param10.certificationOrgan"] =
                        val["certificationOrgan"] !==
                        this.copyForm["param10"]["certificationOrgan"]
                            ? `param10.certificationOrgan&车辆设备/车辆信息/IC卡写卡/IC卡发证机构&${val["certificationOrgan"]}`
                            : "";
                    this.formData["param10.validTime"] =
                        val["validTime"] !==
                        this.copyForm["param10"]["validTime"]
                            ? `param10.validTime&车辆设备/车辆信息/IC卡写卡/IC卡有效期&${val["validTime"]}`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
    },
    data() {
        return {
            deviceId: this.$route.query.deviceId || "",
            deviceCapability: {},
            form: {},
            copyForm: {},
            formData: {},
            dictionaryData: {},
            childConfigParams: false,
            checkNumber: function (rule, value, callback) {
                if (value !== "" && value !== null && value !== undefined) {
                    if (!validateNum(value)) {
                        callback(new Error("请输入正确的整数"));
                    } else if (value < this.min) {
                        callback(new Error(`最小值为${this.min}`));
                    } else if (value > this.max) {
                        callback(new Error(`最大值为${this.max}`));
                    } else {
                        callback();
                    }
                } else {
                    // callback(new Error("请输入"));
                    callback();
                }
            },
            checkString: function (rule, value, callback) {
                if (value !== "" && value !== null && value !== undefined) {
                    if (value.length < this.min) {
                        callback(new Error(`最小长度为${this.min}`));
                    } else if (value.length > this.max) {
                        callback(new Error(`最大长度为${this.max}`));
                    } else {
                        callback();
                    }
                } else {
                    // callback(new Error("请输入"));
                    callback();
                }
            },
            validQualCert: function (rule, value, callback) {
                const title = /^[\a-\z\A-\Z0-9]+$/;
                if (value !== "" && value !== null && value !== undefined) {
                    if (value.length !== 18) {
                        callback(new Error(`请输入18位正确的号码`));
                    } else if (!title.test(value)) {
                        callback(new Error(`只能输入数字和英文`));
                    } else {
                        callback();
                    }
                } else {
                    // callback(new Error("请输入"));
                    callback();
                }
            },
            pickerOptions: {
                disabledDate(time) {
                    // 这个是当前日期后的日期不可选
                    return time.getTime() < Date.now();
                },
            },
        };
    },
    created() {
        // this.getByIsApi(1)
        //console.log(this.isTemplate)
        this.$emit("setMenuActiveRefFormName", "PrivateVehicleInfoForm");
    },
    methods: {
        getPrivateProcotol() {
            let param8 = {
                deviceId: this.deviceId,
                param: "",
                msgId: 8,
            };
            let param930 = {
                deviceId: this.deviceId,
                param: "",
                msgId: 930,
            };
            let param10 = {
                deviceId: this.deviceId,
                param: "",
                msgId: 10,
            };
            let param2222 = {
                deviceId: this.deviceId,
                param: "",
                msgId: 2222,
            };
            if (!this.form["param8"]) {
                if (Boolean(this.isTemplate)) return;
                this.$api.getEHomeConfig(param8).then((res) => {
                    if (res && res.data && res.data.param) {
                        let formData = JSON.parse(res.data.param);
                        this.$set(this.form, "param8", formData);
                        this.$set(
                            this.copyForm,
                            "param8",
                            JSON.parse(JSON.stringify(formData))
                        );
                        this.childConfigParams = false;
                    } else {
                        this.$message.error("协议获取失败");
                        this.childConfigParams = false;
                    }
                });
            } else {
                this.childConfigParams = false;
            }
            if (!this.form["param930"]) {
                if (Boolean(this.isTemplate)) return;
                this.$api.getEHomeConfig(param930).then((res) => {
                    if (res && res.data && res.data.param) {
                        let formData = JSON.parse(res.data.param);
                        this.$set(this.form, "param930", formData);
                        this.$set(
                            this.copyForm,
                            "param930",
                            JSON.parse(JSON.stringify(formData))
                        );
                        this.childConfigParams = false;
                    } else {
                        // this.$message.error("协议获取失败");
                        this.childConfigParams = false;
                    }
                });
            } else {
                this.childConfigParams = false;
            }
            if (!this.form["param10"]) {
                if (Boolean(this.isTemplate)) return;
                this.$api.getEHomeConfig(param10).then((res) => {
                    if (res && res.data && res.data.param) {
                        let formData = JSON.parse(res.data.param);
                        this.$set(this.form, "param10", formData);
                        this.$set(
                            this.copyForm,
                            "param10",
                            JSON.parse(JSON.stringify(formData))
                        );
                        this.childConfigParams = false;
                    } else {
                        this.$message.error("协议获取失败");
                        this.childConfigParams = false;
                    }
                });
            } else {
                this.childConfigParams = false;
            }
            if (!this.form["param2222"]) {
                if (Boolean(this.isTemplate)) return;
                this.$api.getEHomeConfig(param2222).then((res) => {
                    if (res && res.data && res.data.param) {
                        let formData = JSON.parse(res.data.param);
                        this.$set(this.form, "param2222", formData);
                        this.$set(
                            this.copyForm,
                            "param2222",
                            JSON.parse(JSON.stringify(formData))
                        );
                        this.childConfigParams = false;
                    } else {
                        // this.$message.error("协议获取失败");
                        this.childConfigParams = false;
                    }
                });
            } else {
                this.childConfigParams = false;
            }
        },
    },
};
</script>

<style lang="less" scoped>
.configuration-detail-submit {
    width: 100%;
    border-right: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;
    display: flex;
    position: fixed;
    bottom: 0;
    z-index: 500;
    right: 1%;
    background: white;
}
.maginBottom {
    margin-bottom: 10px;
}
</style>
