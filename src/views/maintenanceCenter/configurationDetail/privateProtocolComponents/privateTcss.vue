<template>
    <div class="p-a-md">
        <h2>货箱检测列表</h2>
        <el-form
            ref="PrivateTcssForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <template v-if="form['param1305']">
                <el-tabs v-model="activeName">
                    <el-tab-pane
                        v-for="(item, index) in dictionaryData['tcssList']"
                        :key="index"
                        :label="item.label"
                        :name="item.tcssType + 'tab'"
                    >
                        <template v-if="activeName == item.tcssType + 'tab'">
                            <el-row type="flex" justify="space-between">
                                <el-col :span="7">
                                    <el-form-item
                                        label="采集类型"
                                        class="m-r-md p-r"
                                        :prop="
                                            'param1305.tcssList.' +
                                            index +
                                            '.acquireType'
                                        "
                                    >
                                        <el-select
                                            v-model="
                                                form['param1305'].tcssList[
                                                    index
                                                ]['acquireType']
                                            "
                                        >
                                            <el-option
                                                v-for="item_ in item.acquireTypeList"
                                                :key="item_.id"
                                                :value="item_.id"
                                                :label="item_.label"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item
                                        label="手动设置状态"
                                        class="m-r-md p-r"
                                    >
                                        <el-select
                                            :disabled="
                                                form['param1305'].tcssList[
                                                    index
                                                ]['acquireType'] != 0
                                            "
                                            v-model="
                                                form['param1305'].tcssList[
                                                    index
                                                ]['manualStatus']
                                            "
                                        >
                                            <el-option
                                                v-for="item_ in item.manualStatusList"
                                                :key="item_.id"
                                                :value="item_.id"
                                                :label="item_.label"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item
                                        label="当前状态"
                                        class="m-r-md p-r"
                                        :prop="
                                            'param1305.tcssList.' +
                                            index +
                                            '.curStatus'
                                        "
                                    >
                                        <el-select
                                            :disabled="true"
                                            v-model="
                                                form['param1305'].tcssList[
                                                    index
                                                ]['curStatus']
                                            "
                                        >
                                            <el-option
                                                v-for="item_ in item.curStatusList"
                                                :key="item_.id"
                                                :value="item_.id"
                                                :label="item_.label"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </template>
                    </el-tab-pane>
                </el-tabs>
                <h2 id="title">静态手动设置</h2>
                <el-row type="flex" justify="space-between">
                    <el-col :span="7">
                        <el-form-item
                            label="静态手动设置使能"
                            class="m-r-md p-r"
                        >
                            <el-switch
                                v-model="form['param1305'].staticEnable"
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item
                            label="静态手动速度"
                            class="m-r-md p-r"
                            :rules="{
                                validator: checkNumber.bind({
                                    type: 'int',
                                    min: deviceCapability['zhatu'][
                                        'containerStatus'
                                    ]['staticSpeed']['min'],
                                    max: deviceCapability['zhatu'][
                                        'containerStatus'
                                    ]['staticSpeed']['max'],
                                }),
                                trigger: 'blur',
                            }"
                            prop="param1305.staticSpeed"
                        >
                            <el-input
                                tips-placement="top-end"
                                :tips="`键入值范围为${deviceCapability['zhatu']['containerStatus']['staticSpeed']['min']}~${deviceCapability['zhatu']['containerStatus']['staticSpeed']['max']}`"
                                v-model.number="form['param1305'].staticSpeed"
                                ><span slot="suffix">km/h</span></el-input
                            >
                            <span class="prompt"
                                >0-20表示静止, 20以上表示运动</span
                            >
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item
                            label="持续时间"
                            class="m-r-md p-r"
                            :rules="{
                                validator: checkNumber.bind({
                                    type: 'int',
                                    min: deviceCapability['zhatu'][
                                        'containerStatus'
                                    ]['staticContinue']['min'],
                                    max: deviceCapability['zhatu'][
                                        'containerStatus'
                                    ]['staticContinue']['max'],
                                }),
                                trigger: 'blur',
                            }"
                            prop="param1305.staticContinue"
                        >
                            <el-input
                                tips-placement="top-end"
                                :tips="`键入值范围为${deviceCapability['zhatu']['containerStatus']['staticContinue']['min']}~${deviceCapability['zhatu']['containerStatus']['staticContinue']['max']}`"
                                v-model.number="
                                    form['param1305'].staticContinue
                                "
                                ><span slot="suffix">s</span></el-input
                            >
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row type="flex" justify="space-between">
                    <el-col :span="7">
                        <el-form-item
                            label="速度阈值"
                            class="m-r-md p-r"
                            :rules="{
                                validator: checkNumber.bind({
                                    type: 'int',
                                    min: deviceCapability['zhatu'][
                                        'containerStatus'
                                    ]['speedThreshold']['min'],
                                    max: deviceCapability['zhatu'][
                                        'containerStatus'
                                    ]['speedThreshold']['max'],
                                }),
                                trigger: 'blur',
                            }"
                            prop="param1305.speedThreshold"
                        >
                            <el-input
                                tips-placement="top-end"
                                :tips="`键入值范围为${deviceCapability['zhatu']['containerStatus']['speedThreshold']['min']}~${deviceCapability['zhatu']['containerStatus']['speedThreshold']['max']}`"
                                v-model.number="
                                    form['param1305'].speedThreshold
                                "
                                ><span slot="suffix">km/h</span></el-input
                            >
                        </el-form-item>
                    </el-col>
                    <el-col :span="7"> </el-col>
                    <el-col :span="7"> </el-col>
                </el-row> -->
                <h2>车厢状态OSD开关</h2>
                <el-row
                    type="flex"
                    justify="space-between"
                    v-for="(item, index) in dictionaryData['osdEnableList'][0]"
                    :key="index"
                >
                    <el-col :span="7">
                        <el-form-item
                            label="通道号"
                            class="m-r-md p-r"
                            :prop="'param1305.osdEnable.' + index + '.chanNo'"
                        >
                            <el-select
                                disabled
                                v-model="
                                    form['param1305'].osdEnable[index].chanNo
                                "
                            >
                                <el-option
                                    v-for="item_ in dictionaryData[
                                        'osdEnableList'
                                    ][0]"
                                    :key="item_.id"
                                    :value="item_.id"
                                    :label="item_.label"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item
                            label="叠加状态"
                            class="m-r-md p-r"
                            :prop="'param1305.osdEnable.' + index + '.enable'"
                        >
                            <el-switch
                                v-model="
                                    form['param1305'].osdEnable[index].enable
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7"> </el-col>
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
        "form.param1305": {
            handler(val) {
                if (val && !this.isTemplate) {
                    val.tcssList.forEach((item, index) => {
                        let name = JSON.parse(
                            JSON.stringify(this.dictionaryData["tcssList"])
                        ).find((e) => e.tcssType === item.tcssType).label;
                        this.formData[
                            "param1305.tcssList_" + index + ".acquireType"
                        ] =
                            val.tcssList[index]["acquireType"] !==
                            this.copyForm.param1305.tcssList[index][
                                "acquireType"
                            ]
                                ? `param1305.tcssList.${index}.acquireType&渣土车设置/货箱状态/货箱监测列表/${name}/采集类型&${
                                      this.dictionaryData["tcssList"][index][
                                          "acquireTypeList"
                                      ].find(
                                          (e) =>
                                              e.id ===
                                              val.tcssList[index]["acquireType"]
                                      ).label
                                  }&${
                                      this.copyForm.param1305.tcssList[index][
                                          "acquireType"
                                      ]
                                  }`
                                : "";
                        this.formData[
                            "param1305.tcssList_" + index + ".manualStatus"
                        ] =
                            val.tcssList[index]["manualStatus"] !==
                            this.copyForm.param1305.tcssList[index][
                                "manualStatus"
                            ]
                                ? `param1305.tcssList.${index}.manualStatus&渣土车设置/货箱状态/货箱监测列表/${name}/手动设置状态&${
                                      this.dictionaryData["tcssList"][index][
                                          "manualStatusList"
                                      ].find(
                                          (e) =>
                                              e.id ===
                                              val.tcssList[index][
                                                  "manualStatus"
                                              ]
                                      ).label
                                  }&${
                                      this.copyForm.param1305.tcssList[index][
                                          "manualStatus"
                                      ]
                                  }`
                                : "";
                    });
                    val.osdEnable.forEach((item, index) => {
                        this.formData[
                            "param1305.osdEnable_" + index + ".chanNo"
                        ] =
                            val.osdEnable[index]["chanNo"] !==
                            this.copyForm.param1305.osdEnable[index]["chanNo"]
                                ? `param1305.osdEnable.${index}.chanNo&渣土车设置/货箱状态/通道号&${
                                      `通道` + val.osdEnable[index]["chanNo"]
                                  }&${
                                      this.copyForm.param1305.osdEnable[index][
                                          "chanNo"
                                      ]
                                  }`
                                : "";
                        this.formData[
                            "param1305.osdEnable_" + index + ".enable"
                        ] =
                            val.osdEnable[index]["enable"] !==
                            this.copyForm.param1305.osdEnable[index]["enable"]
                                ? `param1305.osdEnable.${index}.enable&渣土车设置/货箱状态/通道号&${
                                      val.osdEnable[index]["enable"]
                                          ? "开启"
                                          : "关闭"
                                  }&${
                                      this.copyForm.param1305.osdEnable[index][
                                          "enable"
                                      ]
                                  }`
                                : "";
                    });
                    this.formData["param1305.staticEnable"] =
                        val.staticEnable !==
                        this.copyForm.param1305.staticEnable
                            ? `param1305.staticEnable&渣土车配置/货箱状态/静态手动设置使能&${
                                  val.staticEnable ? "开启" : "关闭"
                              }&${this.copyForm.param1305.staticEnable}`
                            : "";
                    this.formData["param1305.staticSpeed"] =
                        val.staticSpeed !== this.copyForm.param1305.staticSpeed
                            ? `param1305.staticSpeed&渣土车配置/货箱状态/静态手动速度&${val.staticSpeed}&${this.copyForm.param1305.staticSpeed}`
                            : "";
                    this.formData["param1305.staticContinue"] =
                        val.staticContinue !==
                        this.copyForm.param1305.staticContinue
                            ? `param1305.staticContinue&渣土车配置/货箱状态/持续时间&${val.staticContinue}&${this.copyForm.param1305.staticContinue}`
                            : "";
                    // this.formData["param1305.speedThreshold"] =
                    //     val.speedThreshold !==
                    //     this.copyForm.param1305.speedThreshold
                    //         ? `param1305.speedThreshold&渣土车配置/货箱状态/速度阈值&${val.speedThreshold}&${this.copyForm.param1305.speedThreshold}`
                    //         : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
    },
    data() {
        return {
            activeName: "0tab",
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
        this.$emit("setMenuActiveRefFormName", "PrivateTcssForm");
    },
    mounted() {
        this.activeName = this.dictionaryData["tcssList"][0].tcssType + "tab";
    },
    methods: {
        getValue(arr, value) {
            return arr.find((e) => e.id === value).label;
        },
        getPrivateProcotol() {
            const param1305 = {
                deviceId: this.deviceId,
                param: "",
                msgId: 1305,
            };
            if (!this.form.param1305) {
                if (this.isTemplate) return;
                this.$api.getEHomeConfig(param1305).then((res) => {
                    // if (res && res.data) {
                    //     const formData = {
                    //         speedThreshold: 33,
                    //         tcssList: [
                    //             {
                    //                 index: 1,
                    //                 tcssType: 1,
                    //                 acquireType: 1,
                    //                 manualStatus: 2,
                    //                 curStatus: 3,
                    //             },
                    //             {
                    //                 index: 1,
                    //                 tcssType: 2,
                    //                 acquireType: 4,
                    //                 manualStatus: 5,
                    //                 curStatus: 6,
                    //             },
                    //             {
                    //                 index: 1,
                    //                 tcssType: 3,
                    //                 acquireType: 7,
                    //                 manualStatus: 8,
                    //                 curStatus: 9,
                    //             },
                    //         ],
                    //         staticEnable: 1,
                    //         staticSpeed: 24,
                    //         staticContinue: 43,
                    //         osdEnable: [
                    //             {
                    //                 chanNo: 3,
                    //                 enable: 1,
                    //             },
                    //             {
                    //                 chanNo: 14,
                    //                 enable: 0,
                    //             },
                    //         ],
                    //     };
                    //     this.$set(this.form, "param1305", formData);
                    //     this.$set(
                    //         this.copyForm,
                    //         "param1305",
                    //         JSON.parse(JSON.stringify(formData))
                    //     );
                    //     this.childConfigParams = false;
                    // } else {
                    //     this.$message.error("协议获取失败");
                    //     this.childConfigParams = false;
                    // }
                    if (res && res.data && res.data.param) {
                        const formData = {
                            ...{
                                staticEnable: 0,
                                tcssList: [],
                            },
                            ...JSON.parse(res.data.param),
                        };
                        this.$set(this.form, "param1305", formData);
                        this.$set(
                            this.copyForm,
                            "param1305",
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
