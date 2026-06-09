<template>
    <div class="p-a-md">
        <h2>基本信息</h2>
        <el-form
            ref="PrivateWorkModeForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <template v-if="form['param1301']">
                <div class="configurations">
                    <div
                        v-if="deviceCapability['zhatu']['workMode']"
                        class="configuration-item"
                    >
                        <el-form-item
                            label="工作模式"
                            prop="param1301.workMode"
                        >
                            <el-select v-model="form['param1301'].workMode">
                                <el-option
                                    v-for="item_ in dictionaryData[
                                        'workModeList'
                                    ]"
                                    :label="item_.label"
                                    :value="item_.id"
                                    :key="item_.value"
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
        "form.param1301": {
            handler(val) {
                if (val && !this.isTemplate) {
                    this.formData["param1301.workMode"] =
                        val.workMode !== this.copyForm.param1301.workMode
                            ? `param1301.workMode&渣土车配置/工作模式/工作模式&${
                                  this.dictionaryData["workModeList"].find(
                                      (e) => e.id === val.workMode
                                  ).label
                              }&${this.copyForm.param1301.workMode}`
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
        this.$emit("setMenuActiveRefFormName", "PrivateWorkModeForm");
    },
    methods: {
        getPrivateProcotol() {
            const param1301 = {
                deviceId: this.deviceId,
                param: "",
                msgId: 1301,
            };
            if (!this.form.param1301) {
                if (this.isTemplate) return;
                this.$api.getEHomeConfig(param1301).then((res) => {
                    // if (res && res.data) {
                    //     const formData = {
                    //         workMode: 1,
                    //     };
                    //     this.$set(this.form, "param1301", formData);
                    //     this.$set(
                    //         this.copyForm,
                    //         "param1301",
                    //         JSON.parse(JSON.stringify(formData))
                    //     );
                    //     this.childConfigParams = false;
                    // } else {
                    //     this.$message.error("协议获取失败");
                    //     this.childConfigParams = false;
                    // }
                    if (res && res.data && res.data.param) {
                        const formData = JSON.parse(res.data.param);
                        this.$set(this.form, "param1301", formData);
                        this.$set(
                            this.copyForm,
                            "param1301",
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
