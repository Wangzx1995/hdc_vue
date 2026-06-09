<template>
    <div class="p-a-md">
        <h2>基本信息</h2>
        <el-form
            ref="PrivateProgrammeForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <template v-if="form['param32']">
                <div class="configurations">
                    <div class="configuration-item">
                        <el-form-item
                            label="支持配置工程车的车辆类型"
                            prop="param32.type"
                            description="切换车辆类型后，需要重启设备，才能切换算法和更新能力"
                        >
                            <el-select v-model="form['param32'].type">
                                <el-option
                                    v-for="item_ in dictionaryData[
                                        'schemeTypeList'
                                    ]"
                                    :label="item_.name"
                                    :value="item_.type"
                                    :key="item_.type"
                                ></el-option>
                            </el-select>
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
        "form.param32": {
            handler(val) {
                if (val && !this.isTemplate) {
                    this.formData["param32.type"] =
                        val.type !== this.copyForm.param32.type
                            ? `param32.type&渣土车配置/方案配置/支持配置工程车的车辆类型&${
                                  this.dictionaryData["schemeTypeList"].find(
                                      (e) => e.type === val.type
                                  ).name
                              }&${this.copyForm.param32.type}`
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
        // this.getByIsApi(1)
        // console.log(this.isTemplate)
        this.$emit("setMenuActiveRefFormName", "PrivateProgrammeForm");
    },
    methods: {
        getPrivateProcotol() {
            const param32 = {
                deviceId: this.deviceId,
                param: "",
                msgId: 32,
            };
            if (!this.form.param32) {
                if (this.isTemplate) return;
                this.$api.getEHomeConfig(param32).then((res) => {
                    if (res && res.data && res.data.param) {
                        const formData = JSON.parse(res.data.param);
                        this.$set(this.form, "param32", formData);
                        this.$set(
                            this.copyForm,
                            "param32",
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
