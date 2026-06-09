<template>
    <div class="p-a-md">
        <h2>基本参数</h2>
        <el-form
            ref="PrivateShutDownForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <template v-if="form['param192']">
                <div class="configurations">
                    <div class="configuration-item">
                        <el-form-item
                            v-if="deviceCapability['generic']['shutdownDelay']"
                            label="延时关机时间(单位：秒)"
                            prop="param192.shutdownDelay"
                        >
                            <el-select v-model="form['param192'].shutdownDelay">
                                <el-option
                                    v-for="item in deviceCapability['generic'][
                                        'shutdownDelay'
                                    ]"
                                    :value="item"
                                    :key="item"
                                    :label="item + '秒'"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            v-if="
                                !deviceCapability['generic']['shutdownDelay'] &&
                                deviceCapability['generic'][
                                    'shutdownDelayCustom'
                                ]
                            "
                            label="延时关机时间(单位：秒)"
                            prop="param192.shutdownDelay"
                            :rules="{
                                validator: checkNumber.bind({
                                    type: 'int',
                                    min: deviceCapability['generic'][
                                        'shutdownDelayCustom'
                                    ]['min'],
                                    max: deviceCapability['generic'][
                                        'shutdownDelayCustom'
                                    ]['max'],
                                }),
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                v-model.number="form['param192'].shutdownDelay"
                                tips-placement="top-end"
                                :tips="`键入值范围为${deviceCapability['generic']['shutdownDelayCustom']['min']}~${deviceCapability['generic']['shutdownDelayCustom']['max']}`"
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
        form: {
            handler(val) {
                if (val) {
                    this.$emit("change", val);
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
        "form.param192": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData["param192.shutdownDelay"] =
                        val["shutdownDelay"] !==
                        this.copyForm["param192"]["shutdownDelay"]
                            ? `param192.shutdownDelay&车辆设备/延时关机时间/&${val["shutdownDelay"]}秒&${this.copyForm["param192"]["shutdownDelay"]}秒`
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
        };
    },
    created() {
        // this.getByIsApi(1)
        //console.log(this.isTemplate)
        this.$emit("setMenuActiveRefFormName", "PrivateShutDownForm");
    },
    methods: {
        getPrivateProcotol() {
            let param = {
                deviceId: this.deviceId,
                param: "",
                msgId: 192,
            };
            if (!this.form["param192"]) {
                if (Boolean(this.isTemplate)) return;
                this.$api.getEHomeConfig(param).then((res) => {
                    if (res && res.data && res.data.param) {
                        let formData = JSON.parse(res.data.param);
                        this.$set(this.form, "param192", formData);
                        this.$set(
                            this.copyForm,
                            "param192",
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
