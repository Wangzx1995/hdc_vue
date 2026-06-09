<template>
    <div class="p-a-md">
        <div
            :style="{ height: height + 'px' }"
            class="showPassword"
            v-show="!valitePas"
        >
            <div class="passwordChild">
                <div class="passwordBox">
                    <el-input
                        v-model="checkPassword"
                        :type="passwordType"
                        prefix-icon="el-icon-lock"
                        placeholder="请输入密码解锁"
                        autoComplete="on"
                    >
                        <i
                            slot="suffix"
                            class="el-input__icon"
                            style="margin-top: 2px"
                            :class="passwordIcon"
                            @mousedown="onMousedownClick"
                            @mouseup="onMouseupClick"
                        ></i>
                    </el-input>
                </div>
                <div class="passwordBox">
                    <el-button
                        style="width: 100%;"
                        type="primary"
                        :loading="loading"
                        @click.native.prevent="makeSure"
                        >确认</el-button
                    >
                </div>
            </div>
        </div>
        <div v-show="valitePas">
            <h2>车辆管控模式</h2>
            <el-form
                ref="PrivateVehicleCtrlForm"
                label-position="top"
                :model="form"
                label-width="120px"
                style="margin-top: 10px"
            >
                <template v-if="form['param960']">
                    <div class="configurations">
                        <div
                            v-if="
                                deviceCapability['zhatu']['vehicleControl'][
                                    'vehCtrlMode'
                                ]
                            "
                            class="configuration-item"
                        >
                            <el-form-item
                                label="车辆管控模式"
                                prop="param960.vehCtrlMode"
                            >
                                <el-switch
                                    v-model="form['param960'].controlEnable"
                                    :active-value="Number(1)"
                                    :inactive-value="Number(0)"
                                ></el-switch>
                            </el-form-item>
                        </div>
                    </div>
                    <h2
                        class="maginBottom"
                        v-if="
                            deviceCapability['zhatu']['vehicleControl'][
                                'vehCtrlList'
                            ] && form['param960'].controlEnable
                        "
                    >
                        控车内容
                    </h2>
                    <div
                        v-if="
                            deviceCapability['zhatu']['vehicleControl'][
                                'vehCtrlList'
                            ] && form['param960'].controlEnable
                        "
                    >
                        <el-row
                            type="flex"
                            justify="space-between"
                            v-for="(item, index) in dictionaryData[
                                'vehCtrlModesList'
                            ]"
                            :key="item.id"
                        >
                            <div
                                :class="{ lineHeight: item.id == 2 }"
                                class="carLabel"
                            >
                                {{ item.label }}：
                            </div>
                            <el-col
                                :class="{ carInput: item.id == 2 }"
                                :span="7"
                            >
                                <el-form-item
                                    v-if="item.id === 1"
                                    label="控车状态"
                                    class="m-r-md p-r"
                                    :prop="'param960.lock'"
                                >
                                    <el-select v-model="form['param960'].lock">
                                        <el-option
                                            label="取消限制"
                                            :value="Number(0)"
                                        ></el-option>
                                        <el-option
                                            label="限制"
                                            :value="Number(1)"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    v-if="item.id === 3"
                                    label="控车状态"
                                    class="m-r-md p-r"
                                    :prop="'param960.liftLimit'"
                                >
                                    <el-select
                                        v-model="form['param960'].liftLimit"
                                    >
                                        <el-option
                                            label="取消限制"
                                            :value="Number(0)"
                                        ></el-option>
                                        <el-option
                                            label="限制"
                                            :value="Number(1)"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    label="控车状态"
                                    v-if="item.id == 2"
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: deviceCapability['zhatu'][
                                                'vehicleControl'
                                            ]['vehCtrlList'][index][
                                                'ctrlSpeed'
                                            ]['min'],
                                            max: deviceCapability['zhatu'][
                                                'vehicleControl'
                                            ]['vehCtrlList'][index][
                                                'ctrlSpeed'
                                            ]['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                    :prop="'param960.speedLimit'"
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${deviceCapability['zhatu']['vehicleControl']['vehCtrlList'][index]['ctrlSpeed']['min']}~${deviceCapability['zhatu']['vehicleControl']['vehCtrlList'][index]['ctrlSpeed']['max']}`"
                                        v-model.number="
                                            form['param960'].speedLimit
                                        "
                                        ><span slot="suffix"
                                            >km/h</span
                                        ></el-input
                                    >
                                    <span v-if="item.id == 2" class="prompt"
                                        >0-不限速
                                        {{
                                            deviceCapability["zhatu"][
                                                "vehicleControl"
                                            ]["vehCtrlList"][index][
                                                "ctrlSpeed"
                                            ]["min"] !== 0
                                                ? deviceCapability["zhatu"][
                                                      "vehicleControl"
                                                  ]["vehCtrlList"][index][
                                                      "ctrlSpeed"
                                                  ]["min"]
                                                : 1
                                        }}-{{
                                            deviceCapability["zhatu"][
                                                "vehicleControl"
                                            ]["vehCtrlList"][index][
                                                "ctrlSpeed"
                                            ]["max"]
                                        }}-具体限速值，单位km/h</span
                                    >
                                </el-form-item>
                                <!-- </div> -->
                            </el-col>
                            <el-col :span="7"></el-col>
                            <el-col :span="7"></el-col>
                        </el-row>
                    </div>
                </template>
            </el-form>
        </div>
    </div>
</template>

<script>
import { validateNum } from "@/utils/validate";
import AES from "@/utils/secret";
export default {
    mounted() {
        const that = this;
        window.onresize = () =>
            (() => {
                that.setTableHeight();
            })();
        console.log(
            JSON.parse(JSON.stringify(this.dictionaryData["vehCtrlModesList"]))
        );
    },
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
                    if (this.valitePas) {
                        this.childConfigParams = val;
                        this.getPrivateProcotol();
                    }
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
        "form.param960": {
            handler(val) {
                if (val && !this.isTemplate) {
                    this.formData["param960.controlEnable"] =
                        val.controlEnable !==
                        this.copyForm.param960.controlEnable
                            ? `param960.controlEnable&渣土车配置/控车参数/车辆管控模式&${
                                  val.controlEnable ? "开启" : "关闭"
                              }&${this.copyForm.param960.controlEnable}`
                            : "";
                    this.formData["param960.lock"] =
                        val.lock !== this.copyForm.param960.lock
                            ? `param960.vehicleControl&渣土车配置/控车参数/锁车指令&${
                                  val.lock ? "限制" : "取消限制"
                              }&${this.copyForm.param960.lock}`
                            : "";
                    this.formData["param960.speedLimit"] =
                        val.speedLimit !== this.copyForm.param960.speedLimit
                            ? `param960.vehicleControl&渣土车配置/控车参数/限速指令&${val.speedLimit}&${this.copyForm.param960.speedLimit}`
                            : "";
                    this.formData["param960.liftLimit"] =
                        val.liftLimit !== this.copyForm.param960.liftLimit
                            ? `param960.vehicleControl&渣土车配置/控车参数/限举指令&${
                                  val.liftLimit ? "限制" : "取消限制"
                              }&${this.copyForm.param960.liftLimit}`
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
            loading: false,
            valitePas: false,
            height: 500,
            checkPassword: "",
            passwordType: "password",
            passwordIcon: "el-icon-view",
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
                    callback();
                }
            },
        };
    },
    created() {
        this.$emit("setMenuActiveRefFormName", "PrivateVehicleCtrlForm");
        this.setTableHeight();
    },
    methods: {
        setTableHeight() {
            this.height = document.body.clientHeight - 460;
        },
        onMousedownClick() {
            this.passwordType = "text";
            this.passwordIcon = "el-icon-view";
        },
        onMouseupClick() {
            this.passwordType = "password";
            this.passwordIcon = "el-icon-view";
        },
        makeSure() {
            const params = { controlPwd: AES.encrypt(this.checkPassword) };
            this.$api.checkZtControlPwd(params).then((res) => {
                console.log(res);
                if (res.success) {
                    this.valitePas = true;
                    this.getPrivateProcotol();
                    // this.$emit('aesEncrypt', AES.encrypt(this.checkPassword))
                } else {
                    this.$message.error(`解锁失败：${res.msg}`);
                }
            });
        },
        getPrivateProcotol() {
            const param960 = {
                deviceId: this.deviceId,
                param: "",
                msgId: 960,
            };
            if (!this.form.param960) {
                if (this.isTemplate) return;
                this.$api.getEHomeConfig(param960).then((res) => {
                    // const formData = {
                    //     controlEnable: 1,
                    //     vehicleControlAuthen: 0,
                    //     liftLimit: 0,
                    //     lock: 1,
                    //     speedLimit: 0,
                    // };
                    // this.$set(this.form, "param960", formData);
                    // this.$set(
                    //     this.copyForm,
                    //     "param960",
                    //     JSON.parse(JSON.stringify(formData))
                    // );
                    // this.childConfigParams = false;
                    if (res && res.data && res.data.param) {
                        const formData = JSON.parse(res.data.param);
                        this.$set(this.form, "param960", formData);
                        this.$set(
                            this.copyForm,
                            "param960",
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
.maginBottom {
    margin-bottom: 10px;
}
.showPassword {
    width: 100%;
    height: 100%;
    display: table;
    text-align: center;
    .passwordChild {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        padding-left: 50%;
    }
}
.passwordBox {
    width: 400px;
    height: 32px;
    margin-bottom: 10px;
    margin-left: -200px;
}
.carLabel {
    line-height: 86px;
    font-weight: 600;
}
.carInput {
    margin-top: 36px;
}
.lineHeight {
    line-height: 154px;
}
</style>
