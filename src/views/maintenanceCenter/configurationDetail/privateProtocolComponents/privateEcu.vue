<template>
    <div class="p-a-md">
        <h2>基本信息</h2>
        <el-form
            ref="PrivateEcuForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <template v-if="form['param965']">
                <div class="configurations">
                    <div
                        v-if="
                            deviceCapability['zhatu']['engineVehicleControl'][
                                'ecuType'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="ECU方案"
                            prop="param965.schemeType"
                        >
                            <el-select v-model="form['param965'].schemeType">
                                <el-option
                                    v-for="item_ in dictionaryData[
                                        'ecuTypeList'
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
                            deviceCapability['zhatu']['engineVehicleControl'][
                                'ecuValue'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="ECU车型值"
                            prop="param965.vehicleType"
                            :rules="{
                                validator: checkNumber.bind({
                                    type: 'int',
                                    min: deviceCapability['zhatu'][
                                        'engineVehicleControl'
                                    ]['ecuValue']['min'],
                                    max: deviceCapability['zhatu'][
                                        'engineVehicleControl'
                                    ]['ecuValue']['max'],
                                }),
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                tips-placement="top-end"
                                :tips="`键入值范围为${deviceCapability['zhatu']['engineVehicleControl']['ecuValue']['min']}~${deviceCapability['zhatu']['engineVehicleControl']['ecuValue']['max']}`"
                                v-model.number="form['param965']['vehicleType']"
                            ></el-input>
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
        "form.param965": {
            handler(val) {
                if (val && !this.isTemplate) {
                    this.formData["param965.schemeType"] =
                        val.schemeType !== this.copyForm.param965.schemeType
                            ? `param965.schemeType&渣土车配置/发动机控车/ECU方案&${
                                  this.dictionaryData["ecuTypeList"].find(
                                      (e) => e.id === val.schemeType
                                  ).label
                              }&${this.copyForm.param965.schemeType}`
                            : "";
                    this.formData["param965.vehicleType"] =
                        val.vehicleType !== this.copyForm.param965.vehicleType
                            ? `param965.vehicleType&渣土车配置/发动机控车/ECU车型值&${val.vehicleType}&${this.copyForm.param965.vehicleType}`
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
        this.$emit("setMenuActiveRefFormName", "PrivateEcuForm");
    },
    methods: {
        getPrivateProcotol() {
            const param965 = {
                deviceId: this.deviceId,
                param: "",
                msgId: 965,
            };
            if (!this.form.param965) {
                if (this.isTemplate) return;
                this.$api.getEHomeConfig(param965).then((res) => {
                    // const formData = {
                    //     ecuType: 3,
                    //     ecuValue: 222,
                    // };
                    // this.$set(this.form, "param965", formData);
                    // this.$set(
                    //     this.copyForm,
                    //     "param965",
                    //     JSON.parse(JSON.stringify(formData))
                    // );
                    // this.childConfigParams = false;
                    if (res && res.data && res.data.param) {
                        const formData = JSON.parse(res.data.param);
                        this.$set(this.form, "param965", formData);
                        this.$set(
                            this.copyForm,
                            "param965",
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
