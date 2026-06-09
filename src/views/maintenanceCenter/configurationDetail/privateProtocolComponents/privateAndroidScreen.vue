<template>
    <div class="p-a-md">
        <h2>基本信息</h2>
        <el-form
            ref="PrivateAndroidScreenForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <template v-if="form['param1311']">
                <div>
                    <div class="configurations">
                        <div
                            v-if="
                                deviceCapability['zhatu']['androidScreen'][
                                    'screenType'
                                ]
                            "
                            class="configuration-item"
                        >
                            <el-form-item
                                label="安卓屏类型"
                                prop="param1311.screenType"
                            >
                                <el-select
                                    v-model="form['param1311'].screenType"
                                >
                                    <el-option
                                        v-for="item_ in dictionaryData[
                                            'screenTypeList'
                                        ]"
                                        :label="item_.label"
                                        :value="item_.id"
                                        :key="item_.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                    <h2
                        id="title"
                        v-if="
                            deviceCapability['zhatu']['androidScreen'][
                                'certType'
                            ] ||
                            deviceCapability['zhatu']['androidScreen'][
                                'defaultCert'
                            ]
                        "
                    >
                        安卓屏证件显示控制
                    </h2>
                    <div class="configurations">
                        <div
                            v-if="
                                deviceCapability['zhatu']['androidScreen'][
                                    'certType'
                                ]
                            "
                            class="configuration-item"
                        >
                            <el-form-item
                                label="证件类型"
                                prop="param1311.certType"
                            >
                                <el-select
                                    multiple
                                    v-model="form['param1311'].certType"
                                >
                                    <el-option
                                        v-for="item_ in dictionaryData[
                                            'certTypeList'
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
                                deviceCapability['zhatu']['androidScreen'][
                                    'defaultCert'
                                ]
                            "
                            class="configuration-item"
                        >
                            <el-form-item
                                label="默认证件"
                                prop="param1311.defaultCert"
                            >
                                <el-select
                                    v-model="form['param1311'].defaultCert"
                                >
                                    <el-option
                                        v-for="item_ in dictionaryData[
                                            'defaultCertList'
                                        ]"
                                        :label="item_.label"
                                        :value="item_.id"
                                        :key="item_.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                    <h2
                        id="title"
                        v-if="
                            deviceCapability['zhatu']['androidScreen'][
                                'defaultShow'
                            ] ||
                            deviceCapability['zhatu']['androidScreen'][
                                'notifyCtrl'
                            ]
                        "
                    >
                        安卓屏设置控制
                    </h2>
                    <div class="configurations">
                        <div
                            v-if="
                                deviceCapability['zhatu']['androidScreen'][
                                    'defaultShow'
                                ]
                            "
                            class="configuration-item"
                        >
                            <el-form-item
                                label="安卓屏默认界面"
                                prop="param1311.defaultShow"
                            >
                                <el-select
                                    v-model="form['param1311'].defaultShow"
                                >
                                    <el-option
                                        v-for="item_ in dictionaryData[
                                            'defaultShowList'
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
                                deviceCapability['zhatu']['androidScreen'][
                                    'notifyCtrl'
                                ]
                            "
                            class="configuration-item"
                        >
                            <el-form-item
                                label="安卓屏控制"
                                prop="param1311.notifyCtrl"
                            >
                                <el-select
                                    v-model="form['param1311'].notifyCtrl"
                                >
                                    <el-option
                                        v-for="item_ in dictionaryData[
                                            'notifyCtrlList'
                                        ]"
                                        :label="item_.label"
                                        :value="item_.id"
                                        :key="item_.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
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
        "form.param1311": {
            handler(val) {
                if (val && !this.isTemplate) {
                    this.formData["param1311.screenType"] =
                        val.screenType !== this.copyForm.param1311.screenType
                            ? `param1311.screenType&渣土车配置/安卓屏控制/安卓屏类型&${
                                  this.dictionaryData["screenTypeList"].find(
                                      (e) => e.id === val.screenType
                                  ).label
                              }&${this.copyForm.param1311.screenType}`
                            : "";
                    this.formData["param1311.certType"] =
                        val.certType.join(",") !==
                        this.copyForm.param1311.certType.join(",")
                            ? `param1311.certType&渣土车配置/安卓屏控制/证件类型&${val.certType
                                  .reduce((prev, cur) => {
                                      return prev.concat(
                                          this.dictionaryData[
                                              "certTypeList"
                                          ].find((e) => e.id === cur).label
                                      );
                                  }, [])
                                  .join(",")}&${
                                  this.copyForm.param1311.certType
                              }`
                            : "";

                    this.formData["param1311.defaultCert"] =
                        val.defaultCert !== this.copyForm.param1311.defaultCert
                            ? `param1311.defaultCert&渣土车配置/安卓屏控制/默认证件&${
                                  this.dictionaryData["defaultCertList"].find(
                                      (e) => e.id === val.defaultCert
                                  ).label
                              }&${this.copyForm.param1311.defaultCert}`
                            : "";
                    this.formData["param1311.defaultShow"] =
                        val.defaultShow !== this.copyForm.param1311.defaultShow
                            ? `param1311.defaultShow&渣土车配置/安卓屏控制/安卓屏默认界面&${
                                  this.dictionaryData["defaultShowList"].find(
                                      (e) => e.id === val.defaultShow
                                  ).label
                              }&${this.copyForm.param1311.defaultShow}`
                            : "";
                    this.formData["param1311.notifyCtrl"] =
                        val.notifyCtrl !== this.copyForm.param1311.notifyCtrl
                            ? `param1311.notifyCtrl&渣土车配置/安卓屏控制/安卓屏控制&${
                                  this.dictionaryData["notifyCtrlList"].find(
                                      (e) => e.id === val.notifyCtrl
                                  ).label
                              }&${this.copyForm.param1311.notifyCtrl}`
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
        this.$emit("setMenuActiveRefFormName", "PrivateAndroidScreenForm");
    },
    methods: {
        getPrivateProcotol() {
            const param1311 = {
                deviceId: this.deviceId,
                param: "",
                msgId: 1311,
            };
            if (!this.form.param1311) {
                if (this.isTemplate) return;
                this.$api.getEHomeConfig(param1311).then((res) => {
                    if (res && res.data && res.data.param) {
                        const formData = {
                            ...{ certType: [] },
                            ...JSON.parse(res.data.param),
                        };
                        this.$set(this.form, "param1311", formData);
                        this.$set(
                            this.copyForm,
                            "param1311",
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
