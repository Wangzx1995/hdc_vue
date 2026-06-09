<template>
    <div class="p-a-md">
        <h2>违规报警模型列表</h2>
        <el-form
            ref="PrivateInvalidAlarmForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <template v-if="form['param1303']">
                <el-tabs
                    v-model="activeName"
                    :before-leave="beforeLeave"
                    @tab-click="getPrivateProcotol(activeName)"
                >
                    <el-tab-pane
                        v-for="(item, index) in dictionaryData['alarmInfoList']"
                        :key="index"
                        :label="item.label"
                        :name="item.modelType + 'tab'"
                    >
                        <template v-if="activeName == item.modelType + 'tab'">
                            <el-row type="flex" justify="space-between">
                                <el-col :span="7">
                                    <el-form-item
                                        label="限制模型使能"
                                        :prop="
                                            'param1303.alarmList.' +
                                            index +
                                            '.enabled'
                                        "
                                    >
                                        <el-select
                                            v-model="
                                                form['param1303'].alarmList[
                                                    index
                                                ]['enabled']
                                            "
                                            transfer
                                            multiple
                                            clearable
                                            collapse-tags
                                        >
                                            <el-option
                                                v-for="item in item.enabledList"
                                                :key="item.id"
                                                :label="item.label"
                                                :value="item.id"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item
                                        label="限制优先级"
                                        class="m-r-md p-r"
                                        :rules="{
                                            validator: checkNumber.bind({
                                                type: 'int',
                                                min: deviceCapability['zhatu'][
                                                    'alarmInfo'
                                                ][index]['priority']['min'],
                                                max: deviceCapability['zhatu'][
                                                    'alarmInfo'
                                                ][index]['priority']['max'],
                                            }),
                                            trigger: 'blur',
                                        }"
                                        :prop="
                                            'param1303.alarmList.' +
                                            index +
                                            '.priority'
                                        "
                                    >
                                        <el-input
                                            tips-placement="top-end"
                                            :tips="`键入值范围为${deviceCapability['zhatu']['alarmInfo'][index]['priority']['min']}~${deviceCapability['zhatu']['alarmInfo'][index]['priority']['max']}`"
                                            v-model.number="
                                                form['param1303'].alarmList[
                                                    index
                                                ]['priority']
                                            "
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item
                                        label="限制速度"
                                        class="m-r-md p-r"
                                        :rules="{
                                            validator: checkNumber.bind({
                                                type: 'int',
                                                min: deviceCapability['zhatu'][
                                                    'alarmInfo'
                                                ][index]['limitSpeed']['min'],
                                                max: deviceCapability['zhatu'][
                                                    'alarmInfo'
                                                ][index]['limitSpeed']['max'],
                                            }),
                                            trigger: 'blur',
                                        }"
                                        :prop="
                                            'param1303.alarmList.' +
                                            index +
                                            '.limitSpeed'
                                        "
                                    >
                                        <el-input
                                            tips-placement="top-end"
                                            :tips="`键入值范围为${deviceCapability['zhatu']['alarmInfo'][index]['limitSpeed']['min']}~${deviceCapability['zhatu']['alarmInfo'][index]['limitSpeed']['max']}`"
                                            v-model.number="
                                                form['param1303'].alarmList[
                                                    index
                                                ]['limitSpeed']
                                            "
                                            ><span slot="suffix"
                                                >km/h</span
                                            ></el-input
                                        >
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row type="flex" justify="space-between">
                                <el-col :span="7">
                                    <el-form-item
                                        label="触发速度"
                                        class="m-r-md p-r"
                                        :rules="{
                                            validator: checkNumber.bind({
                                                type: 'int',
                                                min: deviceCapability['zhatu'][
                                                    'alarmInfo'
                                                ][index]['triggerSpeed']['min'],
                                                max: deviceCapability['zhatu'][
                                                    'alarmInfo'
                                                ][index]['triggerSpeed']['max'],
                                            }),
                                            trigger: 'blur',
                                        }"
                                        :prop="
                                            'param1303.alarmList.' +
                                            index +
                                            '.triggerSpeed'
                                        "
                                    >
                                        <el-input
                                            tips-placement="top-end"
                                            :tips="`键入值范围为${deviceCapability['zhatu']['alarmInfo'][index]['triggerSpeed']['min']}~${deviceCapability['zhatu']['alarmInfo'][index]['triggerSpeed']['max']}`"
                                            v-model.number="
                                                form['param1303'].alarmList[
                                                    index
                                                ]['triggerSpeed']
                                            "
                                            ><span slot="suffix"
                                                >km/h</span
                                            ></el-input
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
                                                    'alarmInfo'
                                                ][index]['continueTime']['min'],
                                                max: deviceCapability['zhatu'][
                                                    'alarmInfo'
                                                ][index]['continueTime']['max'],
                                            }),
                                            trigger: 'blur',
                                        }"
                                        :prop="
                                            'param1303.alarmList.' +
                                            index +
                                            '.continueTime'
                                        "
                                    >
                                        <el-input
                                            tips-placement="top-end"
                                            :tips="`键入值范围为${deviceCapability['zhatu']['alarmInfo'][index]['continueTime']['min']}~${deviceCapability['zhatu']['alarmInfo'][index]['continueTime']['max']}`"
                                            v-model.number="
                                                form['param1303'].alarmList[
                                                    index
                                                ]['continueTime']
                                            "
                                            ><span slot="suffix"
                                                >s</span
                                            ></el-input
                                        >
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item
                                        label="限制掩码"
                                        class="m-r-md p-r"
                                        :rules="{
                                            validator: checkNumber.bind({
                                                type: 'int',
                                                min: deviceCapability['zhatu'][
                                                    'alarmInfo'
                                                ][index]['mask']['min'],
                                                max: deviceCapability['zhatu'][
                                                    'alarmInfo'
                                                ][index]['mask']['max'],
                                            }),
                                            trigger: 'blur',
                                        }"
                                        :prop="
                                            'param1303.alarmList.' +
                                            index +
                                            '.mask'
                                        "
                                    >
                                        <el-input
                                            tips-placement="top-end"
                                            :tips="`键入值范围为${deviceCapability['zhatu']['alarmInfo'][index]['mask']['min']}~${deviceCapability['zhatu']['alarmInfo'][index]['mask']['max']}`"
                                            v-model.number="
                                                form['param1303'].alarmList[
                                                    index
                                                ]['mask']
                                            "
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </template>
                    </el-tab-pane>
                </el-tabs>
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
        "form.param1303": {
            handler(val) {
                if (!val || !val.alarmList || !val.alarmList.length) {
                    return;
                }
                val.alarmList.forEach((item) => {
                    let name = JSON.parse(
                        JSON.stringify(this.dictionaryData["alarmInfoList"])
                    ).find((e) => e.modelType === item.modelType).label;
                    this.formData[
                        "param1303.alarmList_" + item.alarmIndex + ".enabled"
                    ] =
                        JSON.parse(
                            JSON.stringify(
                                val.alarmList[item.alarmIndex]["enabled"]
                            )
                        ).join(",") !==
                        JSON.parse(
                            JSON.stringify(
                                this.copyForm.param1303.alarmList[
                                    item.alarmIndex
                                ]["enabled"]
                            )
                        ).join(",")
                            ? `param1303.alarmList.${
                                  item.alarmIndex
                              }.enabled&渣土车设置/业务报警/${name}/限制模型使能&${this.getValue(
                                  item.alarmIndex,
                                  val.alarmList[item.alarmIndex]["enabled"]
                              )}&${
                                  this.copyForm.param1303.alarmList[
                                      item.alarmIndex
                                  ]["enabled"]
                              }`
                            : "";
                    this.formData[
                        "param1303.alarmList_" + item.alarmIndex + ".priority"
                    ] =
                        val.alarmList[item.alarmIndex]["priority"] !==
                        this.copyForm.param1303.alarmList[item.alarmIndex][
                            "priority"
                        ]
                            ? `param1303.alarmList.${
                                  item.alarmIndex
                              }.priority&渣土车设置/业务报警/${name}/限制优先级&${
                                  val.alarmList[item.alarmIndex]["priority"]
                              }&${
                                  this.copyForm.param1303.alarmList[
                                      item.alarmIndex
                                  ]["priority"]
                              }`
                            : "";
                    this.formData[
                        "param1303.alarmList_" + item.alarmIndex + ".limitSpeed"
                    ] =
                        val.alarmList[item.alarmIndex]["limitSpeed"] !==
                        this.copyForm.param1303.alarmList[item.alarmIndex][
                            "limitSpeed"
                        ]
                            ? `param1303.alarmList.${
                                  item.alarmIndex
                              }.limitSpeed&渣土车设置/业务报警/${name}/限制速度&${
                                  val.alarmList[item.alarmIndex]["limitSpeed"]
                              }&${
                                  this.copyForm.param1303.alarmList[
                                      item.alarmIndex
                                  ]["limitSpeed"]
                              }`
                            : "";
                    this.formData[
                        "param1303.alarmList_" +
                            item.alarmIndex +
                            ".triggerSpeed"
                    ] =
                        val.alarmList[item.alarmIndex]["triggerSpeed"] !==
                        this.copyForm.param1303.alarmList[item.alarmIndex][
                            "triggerSpeed"
                        ]
                            ? `param1303.alarmList.${
                                  item.alarmIndex
                              }.triggerSpeed&渣土车设置/业务报警/${name}/触发速度&${
                                  val.alarmList[item.alarmIndex]["triggerSpeed"]
                              }&${
                                  this.copyForm.param1303.alarmList[
                                      item.alarmIndex
                                  ]["triggerSpeed"]
                              }`
                            : "";
                    this.formData[
                        "param1303.alarmList_" +
                            item.alarmIndex +
                            ".continueTime"
                    ] =
                        val.alarmList[item.alarmIndex]["continueTime"] !==
                        this.copyForm.param1303.alarmList[item.alarmIndex][
                            "continueTime"
                        ]
                            ? `param1303.alarmList.${
                                  item.alarmIndex
                              }.continueTime&渣土车设置/业务报警/${name}/持续时间&${
                                  val.alarmList[item.alarmIndex]["continueTime"]
                              }&${
                                  this.copyForm.param1303.alarmList[
                                      item.alarmIndex
                                  ]["continueTime"]
                              }`
                            : "";
                    this.formData[
                        "param1303.alarmList_" + item.alarmIndex + ".mask"
                    ] =
                        val.alarmList[item.alarmIndex]["mask"] !==
                        this.copyForm.param1303.alarmList[item.alarmIndex][
                            "mask"
                        ]
                            ? `param1303.alarmList.${
                                  item.alarmIndex
                              }.mask&渣土车设置/业务报警/${name}/限制掩码&${
                                  val.alarmList[item.alarmIndex]["mask"]
                              }&${
                                  this.copyForm.param1303.alarmList[
                                      item.alarmIndex
                                  ]["mask"]
                              }`
                            : "";
                    this.$emit("formDataChange", this.formData);
                });
                if (val && !this.isTemplate) {
                    // this.formData["param1303.alarmList"] =
                    //     val.alarmList !== this.copyForm.param1303.alarmList
                    //         ? `param1303.alarmList.${
                    //       item.alarmIndex
                    //   }.priority&渣土车设置/工作模式/工作模式&${val.alarmList}&${this.copyForm.param1303.alarmList}`
                    //         : "";
                    // this.$emit("formDataChange", this.formData);
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
        this.$emit("setMenuActiveRefFormName", "PrivateInvalidAlarmForm");
    },
    mounted() {
        this.activeName =
            this.dictionaryData["alarmInfoList"][0].modelType + "tab";
    },
    methods: {
        beforeLeave(activeName, oldActiveName) {
            this.$refs.PrivateInvalidAlarmForm.validate((valid) => {
                if (!valid) {
                    this.$message.warning("当前表单验证不通过，请先完善！");
                    return new Promise((resolve, reject) => {
                        valid == true;
                    })
                        .then(() => {
                            resolve();
                        })
                        .catch(reject(err));
                }
            });
        },
        getValue(alarmIndex, arrValue) {
            let arr = [];
            arrValue.forEach((item) => {
                arr.push(
                    this.dictionaryData["alarmInfoList"][
                        alarmIndex
                    ].enabledList.find((e) => e.id === item).label
                );
            });
            return arr.join();
        },
        getPrivateProcotol() {
            const param1303 = {
                deviceId: this.deviceId,
                param: "",
                msgId: 1303,
            };
            if (!this.form.param1303) {
                if (this.isTemplate) return;
                this.$api.getEHomeConfig(param1303).then((res) => {
                    if (res && res.data && res.data.param) {
                        const formData = JSON.parse(res.data.param);
                        formData.alarmList.forEach((i, index) => {
                            i.alarmIndex = index;
                            if (!i.enabled) {
                                i.enabled = [];
                            }
                        });
                        this.$set(this.form, "param1303", formData);
                        this.$set(
                            this.copyForm,
                            "param1303",
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
