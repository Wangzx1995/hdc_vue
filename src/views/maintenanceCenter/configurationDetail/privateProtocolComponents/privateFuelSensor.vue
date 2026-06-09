<template>
    <div class="p-a-md">
        <h2>基本信息</h2>
        <el-form
            ref="PrivatefuelSensorForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <template v-if="form['param981']">
                <el-row type="flex" justify="space-between">
                    <el-col :span="7">
                        <el-form-item
                            label="传感器"
                            class="m-r-md p-r"
                            prop="param981.type"
                        >
                            <el-select v-model="form['param981'].type">
                                <el-option
                                    v-for="item_ in dictionaryData[
                                        'fuelSensorList'
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
                            label="油箱深度"
                            prop="param981.fuelTankDepth"
                            :rules="{
                                validator: checkNumber.bind({
                                    type: 'int',
                                    min: deviceCapability[
                                        'intelliDrive_sensor'
                                    ]['fuelSensor']['fuelTankDepth'][
                                        'min'
                                    ],
                                    max: deviceCapability[
                                        'intelliDrive_sensor'
                                    ]['fuelSensor']['fuelTankDepth'][
                                        'max'
                                    ],
                                }),
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                tips-placement="top-end"
                                :tips="`键入值范围为${deviceCapability['intelliDrive_sensor']['fuelSensor']['fuelTankDepth']['min']}~${deviceCapability['intelliDrive_sensor']['fuelSensor']['fuelTankDepth']['max']}`"
                                v-model.number="
                                    form['param981']['fuelTankDepth']
                                "
                            ><span slot="suffix">mm</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item
                            label="油箱体积"
                            prop="param981.fuelTankVolume"
                            :rules="{
                                validator: checkNumber.bind({
                                    type: 'int',
                                    min: deviceCapability[
                                        'intelliDrive_sensor'
                                    ]['fuelSensor']['fuelTankVolume'][
                                        'min'
                                    ],
                                    max: deviceCapability[
                                        'intelliDrive_sensor'
                                    ]['fuelSensor']['fuelTankVolume'][
                                        'max'
                                    ],
                                }),
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                tips-placement="top-end"
                                :tips="`键入值范围为${deviceCapability['intelliDrive_sensor']['fuelSensor']['fuelTankVolume']['min']}~${deviceCapability['intelliDrive_sensor']['fuelSensor']['fuelTankVolume']['max']}`"
                                v-model.number="
                                    form['param981']['fuelTankVolume']
                                "
                            ><span slot="suffix">L</span></el-input>
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
        "form.param981": {
            handler(val) {
                if (val && !this.isTemplate) {
                    this.formData["param981.type"] =
                        val.type !== this.copyForm.param981.type
                            ? `param981.type&传感器设置/油量传感器/传感器&${
                                  this.dictionaryData["fuelSensorList"].find(
                                      (e) => e.id === val.type
                                  ).label
                              }&${this.copyForm.param981.type}`
                            : "";
                    this.formData["param981.fuelTankDepth"] =
                        val.fuelTankDepth !==
                        this.copyForm.param981.fuelTankDepth
                            ? `param981.fuelTankDepth&传感器设置/油量传感器/转速标定&${val.fuelTankDepth}&${this.copyForm.param981.fuelTankDepth}`
                            : "";
                    this.formData["param981.fuelTankVolume"] =
                        val.fuelTankVolume !==
                        this.copyForm.param981.fuelTankVolume
                            ? `param981.fuelTankVolume&传感器设置/油量传感器/停止转速标定&${val.fuelTankVolume}&${this.copyForm.param981.fuelTankVolume}`
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
        this.$emit("setMenuActiveRefFormName", "PrivatefuelSensorForm");
    },
    methods: {
        getPrivateProcotol() {
            const param981 = {
                deviceId: this.deviceId,
                param: "",
                msgId: 981,
            };
            if (!this.form.param981) {
                if (this.isTemplate) return;
                this.$api.getEHomeConfig(param981).then((res) => {
                    if (res && res.data && res.data.param) {
                        const formData = JSON.parse(res.data.param);
                        this.$set(this.form, "param981", formData);
                        this.$set(
                            this.copyForm,
                            "param981",
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
