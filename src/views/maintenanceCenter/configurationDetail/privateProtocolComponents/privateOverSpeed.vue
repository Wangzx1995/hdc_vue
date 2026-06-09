<template>
    <div class="p-a-md">
        <h2>基本参数</h2>
        <el-form
            ref="PrivateOverSpeedForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <template v-if="form['param957']">
                <div class="configurations">
                    <div
                        v-if="
                            deviceCapability['intelliDrive_warn'][
                                'overSpeed'
                            ] &&
                            deviceCapability['intelliDrive_warn']['overSpeed'][
                                'duration'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="超速持续时间"
                            prop="param957.duration"
                            :rules="{
                                validator: checkNumber.bind({
                                    type: 'int',
                                    min: deviceCapability['intelliDrive_warn'][
                                        'overSpeed'
                                    ]['duration']['min'],
                                    max: deviceCapability['intelliDrive_warn'][
                                        'overSpeed'
                                    ]['duration']['max'],
                                }),
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                tips-placement="top-end"
                                :tips="`键入值范围为${deviceCapability['intelliDrive_warn']['overSpeed']['duration']['min']}~${deviceCapability['intelliDrive_warn']['overSpeed']['duration']['max']}`"
                                v-model.number="form['param957']['duration']"
                                ><span slot="suffix">S</span></el-input
                            >
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['intelliDrive_warn'][
                                'overSpeed'
                            ] &&
                            deviceCapability['intelliDrive_warn']['overSpeed'][
                                'speedDifference'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="超速速度差值"
                            prop="param957.speedDifference"
                            :rules="{
                                validator: checkNumber.bind({
                                    type: 'int',
                                    min: deviceCapability['intelliDrive_warn'][
                                        'overSpeed'
                                    ]['speedDifference']['min'],
                                    max: deviceCapability['intelliDrive_warn'][
                                        'overSpeed'
                                    ]['speedDifference']['max'],
                                }),
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                tips-placement="top-end"
                                :tips="`键入值范围为${deviceCapability['intelliDrive_warn']['overSpeed']['speedDifference']['min']}~${deviceCapability['intelliDrive_warn']['overSpeed']['speedDifference']['max']}`"
                                v-model.number="
                                    form['param957']['speedDifference']
                                "
                                ><span slot="suffix">Km/h</span></el-input
                            >
                        </el-form-item>
                    </div>
                    <div
                        v-if="
                            deviceCapability['intelliDrive_warn'][
                                'overSpeed'
                            ] &&
                            deviceCapability['intelliDrive_warn']['overSpeed'][
                                'speedThreshold'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="超速阈值"
                            prop="param957.speedThreshold"
                            :rules="{
                                validator: checkNumber.bind({
                                    type: 'int',
                                    min: deviceCapability['intelliDrive_warn'][
                                        'overSpeed'
                                    ]['speedThreshold']['min'],
                                    max: deviceCapability['intelliDrive_warn'][
                                        'overSpeed'
                                    ]['speedThreshold']['max'],
                                }),
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                tips-placement="top-end"
                                :tips="`键入值范围为${deviceCapability['intelliDrive_warn']['overSpeed']['speedThreshold']['min']}~${deviceCapability['intelliDrive_warn']['overSpeed']['speedThreshold']['max']}`"
                                v-model.number="
                                    form['param957']['speedThreshold']
                                "
                                ><span slot="suffix">Km/h</span></el-input
                            >
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
        "form.param957": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData["param957.duration"] =
                        val["duration"] !==
                        this.copyForm["param957"]["duration"]
                            ? `param957.duration&报警设置/超速报警/超速持续时间&${val["duration"]}秒&${this.copyForm["param957"]["duration"]}秒`
                            : "";
                    this.formData["param957.speedDifference"] =
                        val["speedDifference"] !==
                        this.copyForm["param957"]["speedDifference"]
                            ? `param957.speedDifference&报警设置/超速报警/超速预警差值&${val["speedDifference"]}Km/h&${this.copyForm["param957"]["speedDifference"]}Km/h`
                            : "";
                    this.formData["param957.speedThreshold"] =
                        val["speedThreshold"] !==
                        this.copyForm["param957"]["speedThreshold"]
                            ? `param957.speedThreshold&报警设置/超速报警/超速阈值&${val["speedThreshold"]}Km/h&${this.copyForm["param957"]["speedThreshold"]}Km/h`
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
        this.$emit("setMenuActiveRefFormName", "PrivateOverSpeedForm");
    },
    methods: {
        getPrivateProcotol() {
            let param = {
                deviceId: this.deviceId,
                param: "",
                msgId: 957,
            };
            if (!this.form["param957"]) {
                if (Boolean(this.isTemplate)) return;
                this.$api.getEHomeConfig(param).then((res) => {
                    if (res && res.data && res.data.param) {
                        let formData = JSON.parse(res.data.param);
                        this.$set(this.form, "param957", formData);
                        this.$set(
                            this.copyForm,
                            "param957",
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
