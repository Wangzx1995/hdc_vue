<template>
    <div class="forget-password lock-screen">
        <div class="login-box">
            <div class="login-header text-center p-x-0 p-y-lg p-b-md">
                <img
                    v-if="!!state.app.logo"
                    :src="state.app.logo"
                    height="90"
                    class="p-t-md"
                    alt=""
                />
                <h1 class="m-t text-lg text-white _300">
                    <span>{{ state.app.name }}</span
                    >{{ state.app.title }}
                </h1>
            </div>
            <div class="login-panel vm-panel light p-y-lg animated fadeIn">
                <h3 class="login-title text-md m-b-md _300 text-center">
                    <!-- 忘记密码 -->
                    {{ $t("forgetPassword.forgotPassword") }}
                </h3>
                <div class="forget-password-form">
                    <el-tabs v-model="activeName" @tab-click="tabClick">
                        <!-- 通过手机号找回 -->
                        <el-tab-pane
                            :label="
                                $t('forgetPassword.retrieveThroughPhoneNumber')
                            "
                            name="phoneNo"
                        ></el-tab-pane>
                        <!-- 通过账户名找回 -->
                        <el-tab-pane
                            :label="
                                $t('forgetPassword.retrieveThroughAccountName')
                            "
                            name="userName"
                        ></el-tab-pane>
                    </el-tabs>
                    <el-form
                        :model="forgetPasswordForm"
                        :rules="forgetPasswordRules"
                        ref="forgetPasswordForm"
                        class="no-margin, no-verify"
                    >
                        <el-form-item
                            prop="phoneNo"
                            v-if="activeName == 'phoneNo'"
                        >
                            <el-input
                                v-model="forgetPasswordForm.phoneNo"
                                :placeholder="$t('login.cellPhoneNumber')"
                                @change="resetVery"
                            >
                                <template slot="prepend">+86</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item
                            prop="userName"
                            v-if="activeName == 'userName' && !getPhone"
                        >
                            <el-input
                                v-model="forgetPasswordForm.userName"
                                :placeholder="$t('common.input')"
                                @change="resetVery"
                            >
                            </el-input>
                        </el-form-item>
                        <div
                            v-if="activeName == 'userName' && getPhone"
                            style="margin-bottom: 20px; font-size: 14px"
                        >
                            <!-- 手机号 -->
                            {{ $t("login.cellPhoneNumber") }}
                            ：{{ getPhoneVal }}
                        </div>
                        <el-form-item
                            prop="phoneVeryCode"
                            v-if="
                                (activeName == 'userName' && getPhone) ||
                                activeName == 'phoneNo'
                            "
                        >
                            <el-row :gutter="18" type="flex" align="middle">
                                <el-col :span="14">
                                    <el-input
                                        v-model="
                                            forgetPasswordForm.phoneVeryCode
                                        "
                                        :maxlength="8"
                                        :placeholder="
                                            $t('login.verificationCode')
                                        "
                                    />
                                </el-col>
                                <el-col :span="10">
                                    <el-button
                                        class="verCode"
                                        type="primary"
                                        v-if="!gettingVerCode"
                                        @click="getPhoneVeryCode()"
                                    >
                                        <!-- 获取验证码 -->
                                        {{ $t("login.obtainVerificationCode") }}
                                    </el-button>
                                    <el-button
                                        class="verCode"
                                        type="primary"
                                        v-else
                                        disabled
                                        >{{ leftSeconds }}s</el-button
                                    >
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item
                            prop="password"
                            v-if="
                                (activeName == 'userName' && getPhone) ||
                                activeName == 'phoneNo'
                            "
                        >
                            <!-- placeholder="请输入新密码" -->
                            <el-input
                                v-model="forgetPasswordForm.password"
                                :placeholder="
                                    $t('forgetPassword.enterNewPassword')
                                "
                                @input="handlePassword"
                                :maxlength="20"
                            ></el-input>
                        </el-form-item>
                        <div
                            class="password-safty"
                            v-show="showLevel"
                        >
                            <span :class="{ risk: passwordLevel == 0 }">
                                <!-- 风险 -->
                                {{ $t("login.risk") }}
                            </span>
                            <span :class="{ weak: passwordLevel == 1 }">
                                <!-- 弱 -->
                                {{ $t("login.strength1") }}
                            </span>
                            <span :class="{ mid: passwordLevel == 2 }">
                                <!-- 中 -->
                                {{ $t("login.strength2") }}
                            </span>
                            <span :class="{ power: passwordLevel == 3 }">
                                <!-- 强 -->
                                {{ $t("login.strength3") }}
                            </span>
                        </div>
                        <div class="submit-password">
                            <el-button
                                type="primary"
                                :loading="loading"
                                @click.native.prevent="submitPassword"
                                v-if="
                                    (activeName == 'userName' && getPhone) ||
                                    activeName == 'phoneNo'
                                "
                            >
                                <!-- 确认 -->
                                {{ $t("login.confirm") }}
                            </el-button>
                            <el-button
                                type="primary"
                                :loading="loading"
                                @click.native.prevent="nextStep"
                                v-else
                            >
                                <!-- 下一步 -->
                                {{ $t("common.nextStep") }}
                            </el-button>
                        </div>
                    </el-form>
                </div>
            </div>
            <div
                v-show="enableQRLogin"
                style="display: flex; justify-content: center"
            >
                <div class="appDownloadImg">
                    <img :src="android_qr_url" :alt="$t('login.downloadApp')" />
                    <div>
                        <!-- 设备运维APP -->
                        {{ $t("login.equipmentApp") }}
                    </div>
                </div>
            </div>
        </div>
        <!-- 多项目选择 -->
        <el-dialog
            :title="$t('login.selectItem')"
            :visible.sync="eventSelectVisible"
            @close="closeSelect"
            :width="'600px'"
        >
            <div
                v-for="item in eventSelectAll"
                :key="item.accountname"
                class="eventSelectItem"
            >
                <div>
                    <span>
                        <!-- 项目名 -->
                        {{ $t("login.itemName") }}
                        ：{{ item.projectName }}</span
                    >
                    <a class="selectEvent" @click="handleModifyPassword(item.userName)">
                        <!-- 选择 -->
                        {{ $t("login.select") }}
                    </a>
                </div>
                <div>
                    <span>
                        <!-- 账户名 -->
                        {{ $t("login.accountName") }}
                        ：{{ item.userName }}</span
                    >
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { checkStrong, validateNumLetterSpecial } from "@/utils/validate";
// import AES from "@/utils/AES";
import AES from "@/utils/secret";

export default {
    name: "forgetPassword",
    components: {},
    props: {},
    data() {
        const validateName = (rule, value, callback) => {
            if (!value) {
                // 用户名不能为空
                callback(new Error(this.$t("forgetPassword.validateNameMsg1")));
            } else if (value.length < 3) {
                // 用户名不能小于3个字符
                callback(new Error(this.$t("forgetPassword.validateNameMsg2")));
            } else {
                callback();
            }
        };
        const validateCode = (rule, value, callback) => {
            if (!value) {
                // 验证码不能为空
                callback(new Error(this.$t("forgetPassword.validateCodeMsg1")));
            } else if (value.length < 4) {
                // 验证码长度不能小于4位
                callback(new Error(this.$t("forgetPassword.validateCodeMsg2")));
            } else {
                callback();
            }
        };
        const validatePhone = (rule, value, callback) => {
            var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            if (!value) {
                // 手机号错误
                callback(new Error(this.$t("forgetPassword.validatePhoneMsg")));
            } else if (!myreg.test(value)) {
                // 手机号错误
                callback(new Error(this.$t("forgetPassword.validatePhoneMsg")));
            } else {
                callback();
            }
        };
        const validatePassword = (rule, value, callback) => {
            if (!value || value === "" || value === undefined) {
                // 密码不能为空
                callback(
                    new Error(this.$t("forgetPassword.validatePasswordMsg1"))
                );
            } else if (value.length < 8 || value.length > 20) {
                // 密码长度必须为8-20位
                callback(
                    new Error(this.$t("forgetPassword.validatePasswordMsg2"))
                );
            } else if (!validateNumLetterSpecial(value)) {
                // 仅能输入数字、字母、英文特殊字符
                callback(
                    new Error(this.$t("forgetPassword.validatePasswordMsg3"))
                );
            } else {
                let actLevel = checkStrong(
                    value,
                    this.forgetPasswordForm.userName
                );
                this.passwordLevel = actLevel;
                if (actLevel < 2) {
                    callback(
                        // 密码强度过低，请输入数字、大小字母或英文字符
                        new Error(
                            this.$t("forgetPassword.validatePasswordMsg4")
                        )
                    );
                }
                callback();
            }
        };
        return {
            enableQRLogin: true,
            android_qr_url: "",
            getPhoneVal: "",
            getPhone: false,
            showLevel: false,
            activeName: "phoneNo",
            projectName: "",
            logo: "",
            loading: false,
            carManageUrl: "", //车队管理app
            deviceMaintainUrl: "", //设备运维app
            forgetPassword: false,
            forgetPasswordForm: {
                userName: "",
                username: "",
                phoneNo: "",
                phoneVeryCode: "",
                password: "",
            }, //忘记密码输入框
            forgetPasswordRules: {
                username: [
                    {
                        required: true,
                        message:
                            this.$t("common.input") +
                            this.$t("login.accountName"),
                        trigger: "blur",
                        validator: validateName,
                    },
                ],
                phoneNo: [
                    {
                        required: true,
                        trigger: "blur",
                        message:
                            this.$t("common.input") +
                            this.$t("login.cellPhoneNumber"),
                    },
                    {
                        trigger: "blur",
                        message: this.$t("forgetPassword.rulesMsg1"),
                        validator: validatePhone,
                    },
                ],
                phoneVeryCode: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: validateCode,
                    },
                ],
                password: [
                    {
                        required: true,
                        message: this.$t("forgetPassword.validatePasswordMsg1"),
                        trigger: "blur",
                    },
                    {
                        type: "string",
                        min: 8,
                        max: 20,
                        message: this.$t("forgetPassword.rulesMsg2"),
                        trigger: "blur",
                    },
                    { validator: validatePassword, trigger: "blur" },
                    { validator: validatePassword, trigger: "change" },
                ],
            },
            passwordLevel: 0, //密码风险等级0危险，1弱，2中，3强
            gettingVerCode: false, //是否获得验证码
            leftSeconds: 60, //多久后可以再次获取验证码
            intervalVercode: null,
            eventSelectVisible: false,
            eventSelectAll: [],
        };
    },
    mounted() {
        this.basicSettings();
        this.getAppDownloadImg();
    },
    computed: {
        state() {
            return this.$store.state.app;
        },
    },
    watch: {},
    methods: {
        tabClick() {
            this.forgetPasswordForm = {
                userName: "",
                username: "",
                phoneNo: "",
                phoneVeryCode: "",
                password: "",
            };
            this.showLevel = false;
            this.getPhone = false;
            this.getPhoneVal = "";
            this.$refs.forgetPasswordForm.resetFields();
        },
        //基础配置
        basicSettings() {
            this.$api.basicSettings().then((res) => {
                if (res.success == true) {
                    this.enableQRLogin = res.data.enableQRLogin;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //获取APP下载二维码
        getAppDownloadImg() {
            this.$api.getAppDownloadImg().then((res) => {
                if (res.success == true) {
                    let data = res.data;
                    this.android_qr_url = data.android_qr;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 关闭项目选择弹框
        closeSelect() {
            this.eventSelectVisible = false;
        },
        resetVery() {
            if (!this.gettingVerCode) {
                return;
            }
            clearInterval(this.intervalVercode);
            this.gettingVerCode = false;
            this.leftSeconds = 60;
        },
        //获取验证码
        getPhoneVeryCode() {
            if (this.activeName == "phoneNo") {
                this.$refs.forgetPasswordForm.validateField(
                    "phoneNo",
                    (result) => {
                        if (result) {
                            var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                            if (!this.forgetPasswordForm.phoneNo) {
                                this.$message({
                                    type: "warning",
                                    message: this.$t(
                                        "forgetPassword.rulesMsg1"
                                    ),
                                });
                                return;
                            }
                            if (!myreg.test(this.forgetPasswordForm.phoneNo)) {
                                this.$message({
                                    type: "warning",
                                    message: this.$t(
                                        "forgetPassword.validatePhoneMsg"
                                    ),
                                });
                                return;
                            }
                        } else {
                            this.handleVery();
                        }
                    }
                );
            } else if (this.activeName == "userName") {
                this.handleVery();
            }
        },
        handleVery() {
            this.gettingVerCode = true;
            this.intervalVercode = setInterval(() => {
                this.leftSeconds--;
                if (this.leftSeconds == 0) {
                    clearInterval(this.intervalVercode);
                    this.gettingVerCode = false;
                    this.leftSeconds = 60;
                }
            }, 1000);
            this.$api
                .getPasswordPhoneVeryCode(this.forgetPasswordForm.phoneNo)
                .then((response) => {
                    if (response.success) {
                        this.$message({
                            type: "success",
                            message: this.$t(
                                "forgetPassword.verificationCodeSentSuccessfully"
                            ),
                        });
                    } else {
                        this.$message.error(response.msg);
                        clearInterval(this.intervalVercode);
                        this.gettingVerCode = false;
                        this.leftSeconds = 60;
                    }
                })
                .catch((error) => {
                    clearInterval(this.intervalVercode);
                    this.gettingVerCode = false;
                    this.leftSeconds = 60;
                });
        },
        //忘记密码提交
        submitPassword() {
            this.$refs.forgetPasswordForm.validate((valid) => {
                if (valid) {
                    if (this.passwordLevel <= 1) {
                        this.$message({
                            type: "warning",
                            message: this.$t("login.validatePass3"),
                        });
                        return;
                    }
                    let phone = this.forgetPasswordForm.phoneNo;
                    let veryCode = this.forgetPasswordForm.phoneVeryCode;
                    let veryType = "12";
                    //获取手机号对应的项目，如果多个项目，则展示选择项目弹窗，如果只有一个项目，直接选择当前项目登录
                    this.$api
                        .getUserProject(phone, veryCode, veryType)
                        .then(
                            (res) => {
                                this.loading = false;
                                if (res.success == true && res.data) {
                                    let projectData = res.data ? res.data : [];
                                    if (projectData.length > 1) {
                                        this.eventSelectAll = projectData;
                                        this.eventSelectVisible = true;
                                    } else if (projectData.length == 1) {
                                        this.handleModifyPassword(
                                            projectData[0].userName
                                        );
                                    } else {
                                        // "没有找到该手机号对应的项目"
                                        this.$message.warning(
                                            this.$t(
                                                "forgetPassword.noCorrespondingProject"
                                            )
                                        );
                                    }
                                } else {
                                    this.$message.error(res.msg);
                                }
                            },
                            (res) => {
                                this.loading = false;
                                this.$message.error(res.msg);
                            }
                        )
                        .catch(() => {
                            this.loading = false;
                        });
                } else {
                    if (this.forgetPasswordForm.phoneNo == "") {
                        this.$message({
                            type: "warning",
                            message:
                                this.$t("common.input") +
                                this.$t("login.cellPhoneNumber"),
                        });
                        return false;
                    }
                    let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                    if (!phoneReg.test(this.forgetPasswordForm.phoneNo)) {
                        this.$message({
                            type: "warning",
                            message: this.$t("forgetPassword.rulesMsg1"),
                        });
                        return false;
                    }
                    if (this.forgetPasswordForm.phoneVeryCode == "") {
                        this.$message({
                            type: "warning",
                            message: this.$t("forgetPassword.rulesMsg3"),
                        });
                        return false;
                    }
                    if (this.forgetPasswordForm.password == "") {
                        this.$message({
                            type: "warning",
                            message: this.$t("forgetPassword.rulesMsg4"),
                        });
                        return false;
                    }
                    if (
                        this.forgetPasswordForm.password.length < 8 ||
                        this.forgetPasswordForm.password.length > 20
                    ) {
                        this.$message({
                            type: "warning",
                            message: this.$t("forgetPassword.rulesMsg2"),
                        });
                        return false;
                    }
                    if (
                        !validateNumLetterSpecial(
                            this.forgetPasswordForm.password
                        )
                    ) {
                        this.$message({
                            type: "warning",
                            message: this.$t(
                                "forgetPassword.validatePasswordMsg3"
                            ),
                        });
                        return false;
                    }
                    if (this.passwordLevel <= 1) {
                        this.$message({
                            type: "warning",
                            message: this.$t("login.validatePass3"),
                        });
                        return false;
                    }
                }
            });
        },
        handleModifyPassword(userName) {
            let sha256 = require("js-sha256").sha256;
            let params = {
                phone: this.forgetPasswordForm.phoneNo,
                password: sha256(this.forgetPasswordForm.password),
                veryCode: this.forgetPasswordForm.phoneVeryCode,
                username: userName,
            };
            this.$api
                .resetPasswordWithVeryCode(params)
                .then((response) => {
                    if (response.success) {
                        this.$message({
                            type: "success",
                            message: this.$t("common.modifiedSuccess"),
                        });
                        this.$router.push({ path: "/login" });
                    } else {
                        this.$message.error(response.msg);
                    }
                })
                .catch((error) => {});
            this.forgetPassword = false;
        },
        nextStep() {
            if (this.forgetPasswordForm.userName == "") {
                this.$message({
                    type: "warning",
                    message:
                        this.$t("common.input") + this.$t("login.accountName"),
                });
                return false;
            }

            this.$api
                .getPhoneNoByUserName({
                    username: this.forgetPasswordForm.userName,
                })
                .then((response) => {
                    if (response.success) {
                        this.getPhone = true;
                        this.forgetPasswordForm.phoneNo = AES.dEncrypt(
                            response.data
                        );
                        this.getPhoneVal = this.changePhone(
                            this.forgetPasswordForm.phoneNo
                        );
                        this.$nextTick(() => {
                            this.$refs.forgetPasswordForm.resetFields();
                        });
                    } else {
                        this.$message.error(response.msg);
                    }
                });
        },
        changePhone(val) {
            let start = val.slice(0, 3);
            let end = val.slice(-4);
            return start + "****" + end;
        },
        handlePassword(val) {
            this.showLevel = true;
            let passwordLevel = checkStrong(
                val,
                this.forgetPasswordForm.username
            );
            this.passwordLevel = passwordLevel <= 0 ? 0 : passwordLevel;
        },
    },
};
</script>
<style lang="less" scoped>
.forget-password {
    .login-title {
        color: #4886ff;
        font-size: 22px !important;
    }
    .vm-panel {
        padding: 40px;
        width: 345.5px;
        border-radius: 4px;
        background: #f2f2f2;
        .el-form-item {
            margin-top: -1px;
            .el-input__prefix {
                left: 0;
                right: auto;
                line-height: 40px;
                z-index: 4;
            }
            .el-input__inner {
                padding-left: 40px;
                padding-right: 7px;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
            }
        }
        .forget-password-form {
            /deep/.el-form-item {
                position: relative;
                line-height: 40px;
                font-size: 12px;
                vertical-align: top;
                zoom: 1;
            }
            /deep/.el-form-item__content {
                display: inline-block;
                width: 100%;
                position: relative;
                vertical-align: middle;
                line-height: normal;
                .el-input__inner {
                    padding-left: 10px;
                    padding-right: 7px;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    height: 40px;
                    line-height: 40px;
                }
            }
            .el-button--small {
                padding: 11px 15px;
                width: 100%;
            }
            .submit-password .el-button {
                width: 100%;
            }
            .password-safty {
                display: flex;
                margin-bottom: 10px;
                justify-content: space-between;
                font-size: 13px;
                span {
                    display: inline-block;
                    flex: 1;
                    margin-right: 1px;
                    text-align: center;
                    height: 35px;
                    line-height: 35px;
                    background: rgb(221, 221, 224);
                }
                .risk {
                    background: #fb5678;
                    color: #fff;
                }
                .weak {
                    background: #fdb44d;
                    color: #fff;
                }
                .mid {
                    background: #4886ff;
                    color: #fff;
                }
                .power {
                    background: #72b94f;
                    color: #fff;
                }
            }
            .no-password {
                display: inline-block;
                height: 38px;
                position: absolute;
                background: #f9f9f9;
                left: 10px;
                top: 1px;
                font: 400 14px/38px Arial;
            }
        }
    }
}
.qr-code {
    width: 345.5px;
    margin: 30px auto;
    display: flex;
    justify-content: space-between;
    .qr-code-content {
        width: 110px;
        .qr-code-pic {
            height: 110px;
            img {
                width: auto;
                height: auto;
                max-width: 100%;
                max-height: 100%;
            }
        }
        .qr-code-text {
            margin-top: 10px;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
        }
    }
}
.login-box {
    position: absolute;
    top: 50%;
    margin-top: -450px;
    left: 50%;
    margin-left: -223px;
    width: auto;
    height: 620px;
    padding: 30px 50px;
    h1 {
        font-size: 22px !important;
    }
}

.login-header {
    padding: 30px 50px;
}
.eventSelectItem {
    border-bottom: 1px solid rgb(235, 235, 235);
    margin-top: 10px;
    padding-bottom: 5px;
    &:last-child {
        border: none;
    }
}
.appDownloadImg {
    margin: 30px;
    margin-left: 87.5px;
    margin-right: 87.5px;
    float: left;
}
.appDownloadImg img {
    width: 110px;
}
.appDownloadImg div {
    color: white;
    font-size: 12px;
    font-weight: 900;
    text-align: center;
}
.verCode {
    width: 100px;
    padding: 8px 0;
}
</style>
