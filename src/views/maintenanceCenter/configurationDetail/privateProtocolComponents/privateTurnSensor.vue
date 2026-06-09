<template>
    <div class="p-a-md">
        <h2>基本信息</h2>
        <el-form
            ref="PrivateTurnSensorForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <template v-if="form['param979']">
                <el-row type="flex" justify="space-between">
                    <el-col :span="7">
                        <el-form-item
                            label="传感器"
                            class="m-r-md p-r"
                            prop="param979.type"
                        >
                            <el-select v-model="form['param979'].type">
                                <el-option
                                    v-for="item_ in dictionaryData[
                                        'turnSensorList'
                                    ]"
                                    :label="item_.label"
                                    :value="item_.id"
                                    :key="item_.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item
                            label="转速标定"
                            prop="param979.speedCalibration"
                            :rules="{
                                validator: checkNumber.bind({
                                    type: 'int',
                                    min: deviceCapability[
                                        'intelliDrive_sensor'
                                    ]['turnSensor']['turnSpeedCalibration'][
                                        'min'
                                    ],
                                    max: deviceCapability[
                                        'intelliDrive_sensor'
                                    ]['turnSensor']['turnSpeedCalibration'][
                                        'max'
                                    ],
                                }),
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                tips-placement="top-end"
                                :tips="`键入值范围为${deviceCapability['intelliDrive_sensor']['turnSensor']['turnSpeedCalibration']['min']}~${deviceCapability['intelliDrive_sensor']['turnSensor']['turnSpeedCalibration']['max']}`"
                                v-model.number="
                                    form['param979']['speedCalibration']
                                "
                            ><span slot="suffix">r/min</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item
                            label="停止转速标定"
                            prop="param979.stopCalibration"
                            :rules="{
                                validator: checkNumber.bind({
                                    type: 'int',
                                    min: deviceCapability[
                                        'intelliDrive_sensor'
                                    ]['turnSensor']['turnStopCalibration'][
                                        'min'
                                    ],
                                    max: deviceCapability[
                                        'intelliDrive_sensor'
                                    ]['turnSensor']['turnStopCalibration'][
                                        'max'
                                    ],
                                }),
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                tips-placement="top-end"
                                :tips="`键入值范围为${deviceCapability['intelliDrive_sensor']['turnSensor']['turnStopCalibration']['min']}~${deviceCapability['intelliDrive_sensor']['turnSensor']['turnStopCalibration']['max']}`"
                                v-model.number="
                                    form['param979']['stopCalibration']
                                "
                            ><span slot="suffix">s/r</span></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
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
            default: () => ({}),
        },
        formDetail: {
            type: Object,
            default: () => ({}),
        },
        originalForm: {
            type: Object,
            default: () => ({}),
        },
        setStatisticsData: {
            type: Object,
            default: () => ({}),
        },
        allEnumerationData: {
            type: Object,
            default: () => ({}),
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
        "form.param979": {
            handler(val) {
                if (val && !this.isTemplate) {
                    this.formData["param979.type"] =
                        val.type !== this.copyForm.param979.type
                            ? `param979.type&传感器设置/正反转传感器/传感器&${
                                  this.dictionaryData["turnSensorList"].find(
                                      (e) => e.id === val.type
                                  ).label
                              }&${this.copyForm.param979.type}`
                            : "";
                    this.formData["param979.speedCalibration"] =
                        val.speedCalibration !==
                        this.copyForm.param979.speedCalibration
                            ? `param979.speedCalibration&传感器设置/正反转传感器/转速标定&${val.speedCalibration}&${this.copyForm.param979.speedCalibration}`
                            : "";
                    this.formData["param979.stopCalibration"] =
                        val.stopCalibration !==
                        this.copyForm.param979.stopCalibration
                            ? `param979.stopCalibration&传感器设置/正反转传感器/停止转速标定&${val.stopCalibration}&${this.copyForm.param979.stopCalibration}`
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
            checkNumber(rule, value, callback) {
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
            checkString(rule, value, callback) {
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
        };
    },
    created() {
        this.$emit("setMenuActiveRefFormName", "PrivateTurnSensorForm");
    },
    methods: {
        getPrivateProcotol() {
            const param979 = {
                deviceId: this.deviceId,
                param: "",
                msgId: 979,
            };
            if (!this.form.param979) {
                if (this.isTemplate) return;
                this.$api.getEHomeConfig(param979).then((res) => {
                    if (res && res.data && res.data.param) {
                        const formData = JSON.parse(res.data.param);
                        this.$set(this.form, "param979", formData);
                        this.$set(
                            this.copyForm,
                            "param979",
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
        },
    },
};
</script>

<style lang="less" scoped></style>
