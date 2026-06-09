<template>
    <div class="p-a-md">
        <h2>基本信息</h2>
        <el-form
            ref="PrivateLedForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <template v-if="form['param1307']">
                <div class="configurations">
                    <div
                        v-if="
                            deviceCapability['zhatu']['externalInfo'][
                                'acquireType'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="采集类型"
                            prop="param1307.acquireType"
                        >
                            <el-select v-model="form['param1307'].acquireType">
                                <el-option
                                    v-for="item_ in dictionaryData[
                                        'acquireTypeList'
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
                            deviceCapability['zhatu']['externalInfo'][
                                'lightAdjust'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="外屏亮度调节"
                            prop="param1307.lightAdjust"
                        >
                            <el-select v-model="form['param1307'].lightAdjust">
                                <el-option
                                    v-for="item_ in dictionaryData[
                                        'lightAdjustList'
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
                            deviceCapability['zhatu']['externalInfo'][
                                'showMask'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="显示类型"
                            prop="param1307.showMask"
                        >
                            <el-select
                                multiple
                                v-model="form['param1307'].showMask"
                            >
                                <el-option
                                    v-for="item_ in dictionaryData[
                                        'showMaskList'
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
                            deviceCapability['zhatu']['externalInfo'][
                                'advertShowCtrl'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="广告显示控制"
                            prop="param1307.advertShowCtrl"
                        >
                            <el-select
                                v-model="form['param1307'].advertShowCtrl"
                            >
                                <el-option
                                    v-for="item_ in dictionaryData[
                                        'advertShowCtrlList'
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
                            deviceCapability['zhatu']['externalInfo'][
                                'checkTime'
                            ]
                        "
                        class="configuration-item"
                    >
                        <el-form-item
                            label="稽查时间"
                            prop="param1307.checkTime"
                            :rules="{
                                validator: checkNumber.bind({
                                    type: 'int',
                                    min: deviceCapability['zhatu'][
                                        'externalInfo'
                                    ]['checkTime']['min'],
                                    max: deviceCapability['zhatu'][
                                        'externalInfo'
                                    ]['checkTime']['max'],
                                }),
                                trigger: 'blur',
                            }"
                        >
                            <el-input
                                tips-placement="top-end"
                                :tips="`键入值范围为${deviceCapability['zhatu']['externalInfo']['checkTime']['min']}~${deviceCapability['zhatu']['externalInfo']['checkTime']['max']}`"
                                v-model.number="form['param1307']['checkTime']"
                                ><span slot="suffix">s</span></el-input
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
        "form.param1307": {
            handler(val) {
                if (val && !this.isTemplate) {
                    this.formData["param1307.acquireType"] =
                        val.acquireType !== this.copyForm.param1307.acquireType
                            ? `param1307.acquireType&渣土车配置/外屏参数/采集类型&${
                                  this.dictionaryData["acquireTypeList"].find(
                                      (e) => e.id === val.acquireType
                                  ).label
                              }&${this.copyForm.param1307.acquireType}`
                            : "";
                    this.formData["param1307.lightAdjust"] =
                        val.lightAdjust !== this.copyForm.param1307.lightAdjust
                            ? `param1307.lightAdjust&渣土车配置/外屏参数/外屏亮度调节&${
                                  this.dictionaryData["lightAdjustList"].find(
                                      (e) => e.id === val.lightAdjust
                                  ).label
                              }&${this.copyForm.param1307.lightAdjust}`
                            : "";
                    this.formData["param1307.showMask"] =
                        val.showMask.join(",") !==
                        this.copyForm.param1307.showMask.join(",")
                            ? `param1307.showMask&渣土车配置/外屏参数/显示类型&${val.showMask.reduce(
                                  (prev, cur) => {
                                      return prev.concat(
                                          this.dictionaryData[
                                              "showMaskList"
                                          ].find((e) => e.id === cur).label
                                      );
                                  },
                                  []
                              ).join(",")}&${this.copyForm.param1307.showMask}`
                            : "";
                    this.formData["param1307.advertShowCtrl"] =
                        val.advertShowCtrl !==
                        this.copyForm.param1307.advertShowCtrl
                            ? `param1307.advertShowCtrl&渣土车配置/外屏参数/广告显示控制&${
                                  this.dictionaryData[
                                      "advertShowCtrlList"
                                  ].find((e) => e.id === val.advertShowCtrl)
                                      .label
                              }&${this.copyForm.param1307.advertShowCtrl}`
                            : "";
                    this.formData["param1307.checkTime"] =
                        val.checkTime !== this.copyForm.param1307.checkTime
                            ? `param1307.checkTime&渣土车配置/外屏参数/稽查时间&${val.checkTime}&${this.copyForm.param1307.checkTime}`
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
        this.$emit("setMenuActiveRefFormName", "PrivateLedForm");
    },
    methods: {
        getPrivateProcotol() {
            const param1307 = {
                deviceId: this.deviceId,
                param: "",
                msgId: 1307,
            };
            if (!this.form.param1307) {
                if (this.isTemplate) return;
                this.$api.getEHomeConfig(param1307).then((res) => {
                    // const formData = {
                    //     acquireType: 0,
                    //     lightAdjust: 2,
                    //     advertShowCtrl: 1,
                    //     showMask: 10,
                    //     checkTime: 8888,
                    // };
                    // this.$set(this.form, "param1307", formData);
                    // this.$set(
                    //     this.copyForm,
                    //     "param1307",
                    //     JSON.parse(JSON.stringify(formData))
                    // );
                    // this.childConfigParams = false;
                    if (res && res.data && res.data.param) {
                        const formData = {
                            ...{
                                showMask: [],
                            },
                            ...JSON.parse(res.data.param),
                        };
                        this.$set(this.form, "param1307", formData);
                        this.$set(
                            this.copyForm,
                            "param1307",
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
