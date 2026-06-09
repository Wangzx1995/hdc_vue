<template>
    <div class="vm-login">
        <el-dialog
            :title="diaTitle"
            :visible="noticeBol"
            :width="'580px'"
            @close="noticeBol = false"
        >
            <template slot="title">
                <div
                    class="m-l-sm"
                    style="color: #000; font-size: 20px; font-weight: 800"
                >
                    {{ diaTitle }}
                </div>
            </template>
            <div
                class="p-r-sm"
                v-for="(item, index) in contantList"
                :key="index"
                :style="
                    index == contantList.length - 1
                        ? 'border-bottom: none;'
                        : 'border-bottom: 1px solid #ebebeb;'
                "
            >
                <div class="content-text" v-html="item.content"></div>
            </div>

            <span
                slot="footer"
                class="dialog-footer"
                style="
                    justify-content: space-between;
                    display: flex;
                    align-items: center;
                "
            >
                <el-checkbox v-model="noTice">
                    <!-- 不再提醒 -->
                    {{ $t("login.doNotRemindAgain") }}
                </el-checkbox>
                <el-button type="primary" @click="closeDialog()">
                    <!-- 知道了 -->
                    {{ $t("common.gotIt") }}
                </el-button>
            </span>
        </el-dialog>
        <PromptUser
            :showManage="JSON.stringify(validateOverdueManages)"
        ></PromptUser>
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
            <div
                class="login-panel vm-panel light p-y-md box-shadow animated fadeIn pos-rlt"
            >
                <!-- 注释掉登陆页面的二维码 -->
                <img
                    v-if="this.enableQRLogin"
                    class="ewmImage m-t-sm m-r-sm"
                    :src="qrImageLogo"
                    @click="changeTab(3)"
                    height="30"
                    width="30"
                    alt=""
                />
                <img
                    class="ewmImage m-t-sm m-r-sm"
                    v-show="loginType == 3"
                    :src="qrImageLogo"
                    @click="changeTab(1)"
                    height="30"
                    width="30"
                    alt=""
                />
                <!-- //短信登陆关闭 -->
                <el-row
                    v-show="this.enableSMS === false"
                    class="text text-center p-b-md"
                    v-if="loginType != 3"
                    justify="center"
                >
                    <el-col :span="24">
                        <span
                            :class="loginType == 1 ? 'checked' : 'passwordType'"
                            @click="changeTab(1)"
                        >
                            <!-- 账户密码登录 -->
                            {{ $t("login.accountPasswordLogin") }}
                        </span>
                    </el-col>
                </el-row>
                <!-- //短信登陆开启 -->
                <el-row
                    v-show="this.enableSMS === true"
                    class="text text-center p-b-md"
                    v-if="loginType != 3"
                    justify="center"
                >
                    <el-col :span="12">
                        <span
                            :class="loginType == 1 ? 'checked' : 'passwordType'"
                            @click="changeTab(1)"
                        >
                            <!-- 账户密码登录 -->
                            {{ $t("login.accountPasswordLogin") }}
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <span
                            :class="loginType == 2 ? 'checked' : 'passwordType'"
                            @click="changeTab(2)"
                        >
                            <!-- 手机号登录 -->
                            {{ $t("login.phoneNumberLogin") }}
                        </span>
                    </el-col>
                </el-row>
                <div v-if="loginType == 1">
                    <div class="login-form">
                        <el-form
                            :model="loginForm"
                            :rules="loginRules"
                            ref="loginForm"
                            :show-message="false"
                            :class="[
                                loginForm.verify == true ? '' : 'no-verify',
                            ]"
                        >
                            <el-form-item prop="username" class="m-b-sm">
                                <!-- placeholder="账户名（非手机号）" -->
                                <el-input
                                    v-model="loginForm.username"
                                    type="text"
                                    prefix-icon="el-icon-user-solid"
                                    :placeholder="
                                        $t('login.AccountNameNotPhoneNumber')
                                    "
                                    @keyup.enter.native="handleLogin"
                                    autocomplete="on"
                                ></el-input>
                            </el-form-item>
                            <el-form-item prop="password" class="m-b-0">
                                <!-- placeholder="密码" -->
                                <el-input
                                    v-model="loginForm.password"
                                    :type="passwordType"
                                    prefix-icon="el-icon-lock"
                                    :placeholder="$t('login.password')"
                                    @keyup.enter.native="handleLogin"
                                    autocomplete="on"
                                    show-password
                                >
                                </el-input>
                            </el-form-item>
                            <el-form-item
                                prop="veryCode"
                                v-if="loginForm.verify"
                                class="m-y-sm"
                            >
                                <!-- placeholder="验证码" -->
                                <el-input
                                    v-model="loginForm.veryCode"
                                    type="text"
                                    prefix-icon="el-icon-picture"
                                    :placeholder="$t('login.verificationCode')"
                                    @keyup.enter.native="handleLogin"
                                    autoComplete="on"
                                    class="input-verify w-md"
                                ></el-input>
                                <div class="img-verify">
                                    <!-- 看不清,换一张 -->
                                    <img
                                        :src="imgUrl"
                                        :alt="$t('login.canNotSeeClearly')"
                                        :title="$t('login.canNotSeeClearly')"
                                        @click="getVeryCode()"
                                        style="max-width: 100px"
                                    />
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="m-t-sm m-b-0 remember-password">
                        <el-checkbox v-model="remember">
                            <!-- 记住账户名 -->
                            {{ $t("login.rememberTheAccountName") }}
                        </el-checkbox>
                        <div v-show="this.enableSMS === true">
                            <!-- <span class="text-info pointer" @click="getPassword"
                                >忘记密码</span
                            > -->
                            <span
                                class="text-info pointer"
                                @click="forgetPassword"
                            >
                                <!-- 忘记密码 -->
                                {{ $t("login.forgotPassword") }}
                            </span>
                        </div>
                    </div>
                    <div class="m-t m-b-0 login-form">
                        <el-button
                            size="small"
                            :max-width="500"
                            type="primary"
                            :loading="loading"
                            @click.native.prevent="handleLogin"
                        >
                            <!-- 登录 -->
                            {{ $t("login.logOn") }}
                        </el-button>
                    </div>
                </div>
                <div class="login-form" v-if="loginType == 2">
                    <el-form
                        :model="phoneLoginForm"
                        :rules="phoneLoginRules"
                        ref="phoneLoginForm"
                        :show-message="false"
                        :class="[loginForm.verify == true ? '' : 'no-verify']"
                    >
                        <el-form-item prop="phone" class="m-b-sm">
                            <!-- placeholder="手机号" -->
                            <el-input
                                v-model="phoneLoginForm.phone"
                                type="text"
                                prefix-icon="el-icon-mobile-phone"
                                :placeholder="$t('login.cellPhoneNumber')"
                                @keyup.enter.native="selectProject"
                                autoComplete="on"
                            ></el-input>
                        </el-form-item>
                        <el-form-item prop="veryCode" class="m-b-sm">
                            <el-row :gutter="5">
                                <el-col :span="15">
                                    <!-- placeholder="验证码" -->
                                    <el-input
                                        v-model="phoneLoginForm.veryCode"
                                        type="text"
                                        class="w-md"
                                        prefix-icon="el-icon-message"
                                        :placeholder="
                                            $t('login.verificationCode')
                                        "
                                        @keyup.enter.native="selectProject"
                                        autoComplete="on"
                                    ></el-input>
                                </el-col>
                                <el-col :span="6">
                                    <el-button
                                        size="small"
                                        style="width: 116px"
                                        :disabled="blackTime > 0"
                                        v-show="blackTime <= 0"
                                        @click.native.prevent="getPhoneCode"
                                    >
                                        <!-- 获取验证码 -->
                                        {{ $t("login.obtainVerificationCode") }}
                                    </el-button>
                                    <el-button
                                        class="text-info text-sm"
                                        size="small"
                                        style="
                                            width: 116px;
                                            margin-left: 0px !important;
                                        "
                                        :disabled="blackTime > 0"
                                        v-show="blackTime > 0"
                                        >{{ blackTime }} s</el-button
                                    >

                                    <!-- <span class="pull-right text-info blackTime text-sm" v-show="blackTime > 0">{{blackTime}} s</span> -->
                                </el-col>
                            </el-row>
                        </el-form-item>

                        <!--<div class="text-right">
                            <span class="text-info pointer" @click="getPassword">忘记密码</span>
                        </div>-->
                        <div class="m-t m-b-1">
                            <el-button
                                size="small"
                                :max-width="500"
                                type="primary"
                                :loading="loading"
                                @click.native.prevent="selectProject"
                            >
                                <!-- 登录 -->
                                {{ $t("login.logOn") }}
                            </el-button>
                        </div>
                    </el-form>
                </div>
                <div
                    v-show="(loginType == 3) & (qrStatus == 0)"
                    class="text-center"
                >
                    <p class="text-sm">
                        <!-- 使用运维APP扫码登录 -->
                        {{ $t("login.usingAppLogin") }}
                    </p>
                    <div class="showewmImage">
                        <img :src="qrUrl" alt="" />
                    </div>
                </div>
                <div
                    v-show="(loginType == 3) & (qrStatus == 1)"
                    class="m-t-md text-center"
                >
                    <i class="text-success text-2x el-icon-success"></i>
                    <h3>
                        <!-- 扫码成功 -->
                        {{ $t("login.scanCodeSuccess") }}
                        !
                    </h3>
                    <p class="text-m m-y">
                        <!-- 请在手机上点击确认以登录 -->
                        {{ $t("login.confirmPhone") }}
                    </p>
                    <div class="m-t m-b-0">
                        <el-button
                            type="text"
                            class="w-full"
                            @click.native.prevent="cancelQrLogin"
                        >
                            <!-- 取消登录 -->
                            {{ $t("login.cancelLogin") }}
                        </el-button>
                    </div>
                </div>
                <div
                    v-show="(loginType == 3) & (qrStatus == 2)"
                    class="m-t-md text-center"
                >
                    <i class="el-icon-error text-2x text-success"></i>
                    <h3 class="m-t">
                        <!-- 二维码已失效 -->
                        {{ $t("login.theQRCodeHasExpired") }}！
                    </h3>
                    <p class="text-m">
                        <!-- 请点击刷新按钮 -->
                        {{ $t("login.clickTheRefreshButton") }}
                    </p>
                    <div class="m-t m-b-0">
                        <el-button
                            shape="circle"
                            type="primary"
                            @click.native.prevent="refreshQr"
                            ><i class="el-icon-refresh" />
                            <!--刷新 -->
                            {{ $t("login.refresh") }}
                        </el-button>
                    </div>
                </div>
            </div>
            <div
                v-show="this.enableQRLogin"
                style="display: flex; justify-content: center"
            >
                <div class="appDownloadImg">
                    <!-- APP 下载二维码 -->
                    <img :src="android_qr_url" :alt="$t('login.downloadApp')" />
                    <div>
                        <!-- 设备运维APP -->
                        {{ $t("login.equipmentApp") }}
                    </div>
                </div>
                <!-- <div class="appDownloadImg">
                    <img :src="android_qr_url" alt="Android APP 下载二维码" />
                    <div>Android APP</div>
                </div> 
                <div class="appDownloadImg">
                    <img :src="ios_qr_url" alt="iOS APP 下载二维码" />
                    <div>iOS APP</div>
                </div>-->
            </div>
        </div>
        <div
            class="m-t-md p-a text-center text-muted text-white pos-abt pos-b pos-l pos-r"
        >
            <!-- {{ state.app.copyright }} -->
            <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                style="color: rgba(255, 255, 255) !important"
            >
                <!-- 浙ICP备17037656号-1 -->
                {{ $t("login.ICP") }}
            </a>
        </div>

        <!--忘记密码-->
        <el-dialog
            :visible="setPasswordModal"
            :title="$t('login.forgotPassword')"
            class="no-padding"
            @close="closeSetPassword"
            :styles="{ top: '150px' }"
            :width="'500px'"
        >
            <div class="login-form m-t-md forget-password text-left w-xxl">
                <el-form
                    :model="passwordModal"
                    :rules="passwordModalRules"
                    ref="passwordModal"
                    :show-message="false"
                    class="no-verify"
                >
                    <div>
                        <el-form-item
                            prop="phone"
                            style="margin-bottom: 0px !important"
                        >
                            <!-- 手机号 -->
                            <el-input
                                v-model="passwordModal.phone"
                                type="text"
                                :placeholder="$t('login.cellPhoneNumber')"
                                autoComplete="new-password"
                            >
                                <span slot="prepend">+86</span>
                            </el-input>
                        </el-form-item>
                        <el-form-item
                            prop="veryCode"
                            class="m-t-md"
                            style="margin-bottom: 0px !important"
                        >
                            <el-row :gutter="5">
                                <el-col :span="15">
                                    <!-- placeholder="验证码" -->
                                    <el-input
                                        v-model="passwordModal.veryCode"
                                        type="text"
                                        class="w-md"
                                        :placeholder="
                                            $t('login.verificationCode')
                                        "
                                        autoComplete="new-password"
                                    ></el-input>
                                </el-col>
                                <el-col :span="6">
                                    <el-button
                                        style="width: 116px"
                                        :disabled="passwordBlackTime > 0"
                                        v-show="passwordBlackTime <= 0"
                                        @click.native.prevent="
                                            getPasswordPhoneCode
                                        "
                                    >
                                        <!-- 获取验证码 -->
                                        {{ $t("login.obtainVerificationCode") }}
                                    </el-button>
                                    <el-button
                                        class="text-sm text-info"
                                        style="
                                            width: 116px;
                                            margin-left: 0px !important;
                                        "
                                        :disabled="passwordBlackTime > 0"
                                        v-show="passwordBlackTime > 0"
                                        >{{ passwordBlackTime }} s</el-button
                                    >
                                    <!-- <span class="pull-right text-info passwordBlackTime text-sm" v-show="passwordBlackTime > 0">{{passwordBlackTime}} s</span> -->
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item
                            prop="password"
                            class="m-t-md"
                            style="margin-bottom: 0px !important"
                        >
                            <!-- 请输入新密码 -->
                            <el-input
                                v-model="passwordModal.password"
                                type="password"
                                :placeholder="$t('login.inputPassword')"
                                autoComplete="new-password"
                            ></el-input>
                            <el-row
                                :gutter="1"
                                class="m-t-xs text-center l-h-2x"
                            >
                                <el-col :span="6"
                                    ><div
                                        :class="
                                            actLevel <= 0
                                                ? 'accent error'
                                                : 'accent'
                                        "
                                    >
                                        <!-- 风险 -->
                                        {{ $t("login.risk") }}
                                    </div>
                                </el-col>
                                <el-col :span="6"
                                    ><div
                                        :class="
                                            actLevel == 1
                                                ? 'accent warning'
                                                : 'accent'
                                        "
                                    >
                                        <!-- 弱 -->
                                        {{ $t("login.strength1") }}
                                    </div>
                                </el-col>
                                <el-col :span="6"
                                    ><div
                                        :class="
                                            actLevel == 2
                                                ? 'accent info'
                                                : 'accent'
                                        "
                                    >
                                        <!-- 中 -->
                                        {{ $t("login.strength2") }}
                                    </div>
                                </el-col>
                                <el-col :span="6"
                                    ><div
                                        :class="
                                            actLevel == 3
                                                ? 'accent success'
                                                : 'accent'
                                        "
                                    >
                                        <!-- 强 -->
                                        {{ $t("login.strength3") }}
                                    </div>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <div class="m-t m-b-0">
                            <el-button
                                :max-width="500"
                                type="primary"
                                class="w-full"
                                @click.native.prevent="selectProject2"
                            >
                                <!-- 确认 -->
                                {{ $t("login.confirm") }}
                            </el-button>
                        </div>
                    </div>
                </el-form>
                <!--</div>-->
            </div>
            <div slot="footer"></div>
            <!-- </Modal> -->
        </el-dialog>
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
                    <a class="selectEvent" @click="selectLogin(item.userName)">
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
import { checkStrong, isHikEmail, validatePhoneNo } from "@/utils/validate";
import Storage from "@/utils/storage";
import PromptUser from "@/components/promptUser.vue";
import { sha256 } from "js-sha256";
import { mapGetters } from "vuex";
export default {
    name: "VmLogin",
    computed: {
        state() {
            return this.$store.state.app;
        },
    },
    data() {
        const validateName = async (rule, value, callback) => {
            if (!value) {
                callback(new Error(this.$t("login.validateName1")));
                if (this.formSubmit == true) {
                    //this.$message.destroy();
                    await this.$message.error(this.$t("login.validateName1"));
                }
            } else if (value.length < 3) {
                callback(new Error(this.$t("login.validateName2")));
                if (this.formSubmit == true) {
                    //this.$message.destroy();
                    await this.$message.error(this.$t("login.validateName2"));
                }
            } else {
                callback();
            }
        };
        const validatePass = (rule, value, callback) => {
            if (!value) {
                callback(new Error(this.$t("login.validatePass1")));
                if (this.formSubmit == true) {
                    // this.$message.destroy();
                    setTimeout(() => {
                        this.$message.error(this.$t("login.validatePass1"));
                    }, 300);
                }
            } else if (value.length < 6) {
                // callback(new Error('密码长度不能小于6位'));

                if (this.formSubmit == true) {
                    //this.$message.destroy();
                    // setTimeout(() => {
                    //     this.$message.error('密码强度过低');
                    // },300)
                    setTimeout(() => {
                        this.$message.error(this.$t("login.validatePass2"));
                    }, 300);
                }
            } else {
                callback();
            }
        };
        const checkPassStrong = (rule, value, callback) => {
            if (value === "") {
                callback(new Error(this.$t("login.validatePass1")));
                // await this.$message.error('密码不能为空');
                setTimeout(() => {
                    this.$message.error(this.$t("login.validatePass1"));
                }, 300);
                // this.$notify({
                //     // title: '消息',
                //     message: '密码不能为空',
                //     size:'small',
                //     offset: 100
                // });
            } else {
                if (value.length < 8) {
                    callback(new Error(this.$t("login.validatePass2")));
                    setTimeout(() => {
                        this.$message.error(this.$t("login.validatePass2"));
                    }, 300);
                } else {
                    this.actLevel = checkStrong(value);
                    if (this.actLevel < this.passLevel) {
                        callback(new Error(this.$t("login.validatePass3")));
                        setTimeout(() => {
                            this.$message.error(this.$t("login.validatePass3"));
                        }, 300);
                    } else {
                        callback();
                    }
                }
            }
        };
        const validateCode = (rule, value, callback) => {
            if (!value) {
                callback(new Error(this.$t("login.validateCode1")));
                if (this.formSubmit == true) {
                    //this.$message.destroy();
                    setTimeout(() => {
                        this.$message.error(this.$t("login.validateCode1"));
                    }, 200);
                }
            } else if (value.length < 4) {
                callback(new Error(this.$t("login.validateCode2")));
                if (this.formSubmit == true) {
                    //this.$message.destroy();
                    setTimeout(() => {
                        this.$message.error(this.$t("login.validateCode2"));
                    }, 200);
                }
            } else {
                callback();
            }
        };
        const validateCodePassward = (rule, value, callback) => {
            if (!value) {
                callback(new Error(this.$t("login.validateCode1")));
                setTimeout(() => {
                    this.$message.error(this.$t("login.validateCode1"));
                }, 200);
            } else if (value.length < 4) {
                callback(new Error(this.$t("login.validateCode2")));
                setTimeout(() => {
                    this.$message.error(this.$t("login.validateCode2"));
                }, 200);
            } else {
                callback();
            }
        };
        const checkPhone = (rule, value, callback) => {
            if (!value) {
                callback(new Error(this.$t("login.checkPhone1")));
                if (this.formSubmit == true) {
                    //this.$message.destroy();
                    setTimeout(() => {
                        this.$message.error(this.$t("login.checkPhone1"));
                    }, 100);
                }
            } else if (value.length != 11 || !validatePhoneNo(value)) {
                callback(new Error(this.$t("login.checkPhone2")));
                if (this.formSubmit == true) {
                    // this.$message.destroy();
                    setTimeout(() => {
                        this.$message.error(this.$t("login.checkPhone2"));
                    }, 100);
                }
            } else {
                callback();
            }
        };
        const checkPhonePassWord = (rule, value, callback) => {
            if (!value) {
                callback(new Error(this.$t("login.checkPhone1")));
                setTimeout(() => {
                    this.$message.error(this.$t("login.checkPhone1"));
                }, 100);
            } else if (value.length != 11 || !validatePhoneNo(value)) {
                callback(new Error(this.$t("login.checkPhone2")));
                setTimeout(() => {
                    this.$message.error(this.$t("login.checkPhone2"));
                }, 100);
            } else {
                callback();
            }
        };
        return {
            noticeBol: false,
            noTiceList: [],
            contantList: [],
            contantSplit: [],
            diaTitle: "",
            codeTice: "", //公告code
            borBottom: false, //是否有下划线
            enableSMS: true,
            enableQRLogin: true,
            enableBigData: false, //是否有车辆上线率
            eventSelectVisible: false,
            passwordType: "password",
            carousel: 0,
            loginType: 1, //1表示密码登录,2手机号登录,3二维码登录
            blackTime: 0, //验证码倒计时60s
            passwordBlackTime: 0, //验证码倒计时60s
            setPasswordModal: false,
            actLevel: 0,
            passLevel: 3,
            current: 0,
            qrStatus: 0,
            validateOverdueManages: {},
            loginForm: {
                username: "",
                password: "",
                veryCode: "",
                verify: false,
            },
            phoneLoginForm: {
                phone: "",
                veryCode: "",
                username: "",
            },
            passwordModal: {
                phone: "",
                password: "",
                veryCode: "",
                username: "",
            },
            loginRules: {
                username: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: validateName,
                    },
                ],
                password: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: validatePass,
                    },
                ],
                veryCode: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: validateCode,
                    },
                ],
            },
            phoneLoginRules: {
                phone: [
                    { required: true, trigger: "blur", validator: checkPhone },
                ],
                veryCode: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: validateCode,
                    },
                ],
            },
            passwordModalRules: {
                phone: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: checkPhonePassWord,
                    },
                ],
                veryCode: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: validateCodePassward,
                    },
                ],
                password: [
                    // { required: true, trigger: 'blur', validator: validatePass }

                    { validator: checkPassStrong, trigger: "blur" },
                    //{ validator:checkPassStrong, trigger: 'change' }
                ],
            },
            remember: Storage.get("remember") || false,
            noTice: false,
            loading: false,
            imgUrl: "",
            qrUrl: "",
            qrTimeInterval: "",
            uuid: "",
            qrImageLogo: "/static/images/qr_in_logo.png",
            android_qr_url: "",
            ios_qr_url: "",
            eventSelectAll: [],
        };
    },
    components: { PromptUser },
    methods: {
        //基础配置
        basicSettings() {
            this.$api.basicSettings().then((res) => {
                if (res.success == true) {
                    this.enableSMS = res.data.enableSMS;
                    this.enableQRLogin = res.data.enableQRLogin;
                    this.enableBigData = res.data.enableBigData;
                    if (this.enableBigData) {
                        //0:checked
                        localStorage.setItem("enableBigData", 0);
                    } else {
                        //1:not checked
                        localStorage.setItem("enableBigData", 1);
                    }
                    // localStorage.setItem('enableBigData',this.enableBigData)
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //获取公告code（登录前）
        getNotice() {
            const params = {
                sysCode: "HDC",
            };
            this.$api.getNotice(params).then((res) => {
                if (res.success == true) {
                    this.codeTice = res.data;
                    const result = localStorage.getItem("codeTice");
                    // console.log(JSON.parse(result))
                    if (this.codeTice !== result) {
                        this.getNoticeList();
                    } else {
                    }
                } else {
                    // this.$message.error('获取公告信息失败:' + res.msg)
                }
            });
        },
        //获取通知List（登录前）
        getNoticeList() {
            const params = {
                sysCode: "HDC",
            };
            this.$api.getNoticeList(params).then((res) => {
                if (res.success == true) {
                    this.noTiceList = res.data;
                    let messageText = "";
                    this.contantList = this.noTiceList;
                    this.contantList.forEach((item) => {
                        item.content = item.content
                            .replace(/(\n|\r|\r\n|↵)/g, "<br/>")
                            .replace(new RegExp(" ", "gm"), "&nbsp");
                    });
                    // .replace(/\s+/g, '&nbsp')
                    //         .replace(/(\n|\r|\r\n|↵)/g, '<br />')
                    // this.contantList = this.noTiceList.map((item, index) => {
                    //     let end = item.content.split("\n").length - 2;
                    //     if (item.noticeType == 0) {
                    //         messageText =
                    //             item.content.indexOf("\n") != -1
                    //                 ? item.content.split("\n").splice(1, end)
                    //                 : [item.content];
                    //     }
                    //     if (item.noticeType == 1 || item.noticeType == 2) {
                    //         // messageText = [item.content]
                    //         messageText = item.content.split("\n");
                    //         messageText.map((v, o) => {
                    //             if (v == "") {
                    //                 messageText[o] = "\n";
                    //             }
                    //         });
                    //         // messageText[12] = '\n';
                    //         console.log("messageText===", messageText);
                    //     }
                    //     return Object.assign(
                    //         {},
                    //         { content: messageText },
                    //         { noticeType: item.noticeType },
                    //         { named: "尊敬的客户：" },
                    //         { time: item.content.split("\n").pop() }
                    //     );
                    // });
                    if (this.noTiceList.length == 1) {
                        if (this.noTiceList[0].noticeType == 0) {
                            // 放假通知公告
                            this.diaTitle = this.$t("login.diaTitle1");
                        }
                        if (this.noTiceList[0].noticeType == 1) {
                            // 停机更新通知公告
                            this.diaTitle = this.$t("login.diaTitle2");
                        }
                        // if (this.noTiceList[0].noticeType == 2) {
                        //     this.diaTitle = "版本更新公告";
                        // }
                        this.$nextTick(() => {
                            this.noticeBol = true;
                        });
                    }
                    if (this.noTiceList.length > 1) {
                        this.borBottom = true;
                        // 通知公告
                        this.diaTitle = this.$t("login.diaTitle3");
                        this.$nextTick(() => {
                            this.noticeBol = true;
                        });
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        /**
         * 关闭公告弹窗
         */
        closeDialog() {
            if (this.noTice === true) {
                localStorage.setItem("codeTice", this.codeTice);
                this.noticeBol = false;
                // Storage.set('codeTice', this.codeTice);
            } else {
                this.noticeBol = false;
            }
        },
        // 关闭项目选择弹框
        closeSelect() {
            this.eventSelectVisible = false;
            //this.$store.commit('SET_EVENTSELECTVISIBLE', false);
        },
        // 选择某一项目登录
        selectLogin(userName) {
            if (this.loginType == 1) {
                this.passwordModal.username = userName;
                this.getPasswordNext();
            } else {
                this.phoneLoginForm.username = userName;
                this.phoneHandleLogin();
            }
            this.eventSelectVisible = false;
        },
        inputPress() {
            return false;
        },
        cancelQrLogin() {
            clearInterval(this.qrTimeInterval);
            this.$api.cancelQrLogin(this.uuid).then((res) => {
                if (res.success == true) {
                    this.qrImageLogo = "/static/images/qr_out_logo.png";
                } else {
                    this.$message.error(res.msg);
                }
            });
            this.refreshQr();
        },
        refreshQr() {
            clearInterval(this.qrTimeInterval);
            this.qrUrl = "";
            this.qrStatus = 0;
            this.uuid = "";
            this.$api.createQRCode().then((res) => {
                if (res.success == true) {
                    this.uuid = res.data;
                    //console.log(this.uuid)
                    this.qrUrl =
                        (process.env.BASE_API == "/"
                            ? "."
                            : process.env.BASE_API) +
                        "/qrCode.images?uuid=" +
                        this.uuid +
                        "&r=" +
                        Math.random();
                    this.qrTimeInterval = setInterval(() => {
                        this.$api.checkQRCodeStatus(this.uuid).then((res) => {
                            if (res.success == true) {
                                if (res.data.status == 2) {
                                    this.qrLandleLogin(
                                        res.data.qrCodeLoginToken
                                    );
                                    clearInterval(this.qrTimeInterval);
                                } else if (res.data.status == 0) {
                                    //console.log('未扫码')
                                    this.qrStatus = 0;
                                } else if (res.data.status == 1) {
                                    // console.log('已扫码')
                                    this.qrImageLogo =
                                        "/static/images/qr_out_logo.png";
                                    this.qrStatus = 1;
                                } else {
                                    //console.log('二维码失效')
                                    this.qrStatus = 2;
                                    clearInterval(this.qrTimeInterval);
                                }
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                    }, 2 * 1000);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        changeTab(loginType) {
            this.loginType = loginType;
            clearInterval(this.qrTimeInterval);
            if (loginType == 1) {
                //账户名密码登录
                this.handleReset("loginForm");
                this.qrImageLogo = "/static/images/qr_in_logo.png";
            } else if (loginType == 2) {
                //手机号登录
                this.handleReset("phoneLoginForm");
                this.qrImageLogo = "/static/images/qr_in_logo.png";
            } else if (loginType == 3) {
                //扫码登录
                this.refreshQr();
                this.qrImageLogo = "/static/images/qr_out_logo.png";
            } else {
            }
        },
        handleLogin() {
            localStorage.removeItem("searchTimes");
            localStorage.removeItem("firstLogin");
            this.formSubmit = true;
            this.validateOverdueManages = {};
            if (this.loginType == 2) {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.$store
                            .dispatch("Login", this.loginForm)
                            .then((response) => {
                                this.loading = false;
                                if (
                                    response.code !== "200" &&
                                    response.success === false
                                ) {
                                    //this.$message.error(response.msg);
                                    if (
                                        response.code ==
                                            "userBindYunApp.openApp" ||
                                        response.code ==
                                            "userBindYunApp.noOpsOrOvertime"
                                    ) {
                                        this.validateOverdueManages = {
                                            showWarn: true,
                                            surplus: 0,
                                            useDate: "",
                                        };
                                    } else {
                                        this.$message.error(response.msg);
                                    }
                                    if (
                                        response.code == "cms.user.locked" ||
                                        response.data.loginErrorTimes >= 3
                                    ) {
                                        this.loginForm.verify = true;
                                        this.getVeryCode();
                                    }
                                    return false;
                                }

                                /**
                                 * 自动保存
                                 */
                                if (this.remember === true) {
                                    Storage.set("remember", true);
                                    Storage.set(
                                        "username",
                                        this.loginForm.username
                                    );
                                } else {
                                    Storage.set("remember", false);
                                    Storage.set("username", "");
                                }
                                localStorage.setItem(
                                    "userSubType",
                                    response.data.userInfo.subType || 999
                                );
                                //this.getUserMenus();  //获取菜单权限,跳转到第一个菜单
                                this.$router.push({ path: "/" });
                                window.location.reload();
                            })
                            .catch((response) => {
                                this.loading = false;
                            });
                    }
                });
            } else {
                // if (this.loginForm.username.length === 0) {
                //     this.$message.error("账户名不能为空");
                //     return;
                // }
                // if (this.loginForm.password.length === 0) {
                //     this.$message.error(this.$t("login.validatePass1"));
                //     return;
                // }
                // if (this.loginForm.password.length < 6) {
                //     this.$message.error(this.$t("login.validatePass2"));
                //     return;
                // }
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.$store
                            .dispatch("Login", this.loginForm)
                            .then((response) => {
                                this.loading = false;
                                if (
                                    response.code !== "200" &&
                                    response.success === false
                                ) {
                                    if (
                                        response.code ==
                                        "userBindYunApp.overtime"
                                    ) {
                                        this.validateOverdueWithoutLogin();
                                    }
                                    if (
                                        response.code ==
                                            "userBindYunApp.openApp" ||
                                        response.code ==
                                            "userBindYunApp.noOpsOrOvertime"
                                    ) {
                                        this.validateOverdueManages = {
                                            showWarn: true,
                                            surplus: 0,
                                            useDate: "",
                                        };
                                    } else {
                                        this.$message.error(response.msg);
                                    }
                                    if (
                                        response.code == "cms.user.locked" ||
                                        response.data.loginErrorTimes >= 3
                                    ) {
                                        this.loginForm.verify = true;
                                        this.getVeryCode();
                                    }

                                    return false;
                                }

                                /**
                                 * 自动保存
                                 */
                                if (this.remember === true) {
                                    Storage.set("remember", true);
                                    Storage.set(
                                        "username",
                                        this.loginForm.username
                                    );
                                } else {
                                    Storage.set("remember", false);
                                    Storage.set("username", "");
                                }
                                localStorage.setItem(
                                    "userSubType",
                                    response.data.userInfo.subType || 999
                                );
                                //this.getUserMenus();  //获取菜单权限,跳转到第一个菜单
                                this.$router.push({ path: "/" });
                                window.location.reload();
                            })
                            .catch((response) => {
                                this.loading = false;
                            });
                    } else {
                        return false;
                    }
                });
            }
            this.formSubmit = false;
        },
        qrLandleLogin(uuid) {
            this.validateOverdueManages = {};
            this.formSubmit = true;
            this.loading = true;
            localStorage.removeItem("firstLogin");
            this.$store
                .dispatch("QrLogin", uuid)
                .then((response) => {
                    this.loading = false;
                    if (response.code !== "200" && response.success === false) {
                        //
                        if (
                            response.code == "userBindYunApp.openApp" ||
                            response.code == "userBindYunApp.noOpsOrOvertime"
                        ) {
                            this.validateOverdueManages = {
                                showWarn: true,
                                surplus: 0,
                                useDate: "",
                            };
                        } else {
                            this.$message.error(response.msg);
                        }

                        // if(response.code == 'cms.user.locked' || response.data.loginErrorTimes>=3 ){
                        //     this.loginForm.verify=true;
                        //     this.getVeryCode();
                        // }
                        return false;
                    }

                    /**
                     * 自动保存
                     */
                    // if ( this.remember === true ) {
                    //     Storage.set('remember', true);
                    //     Storage.set('username', uuid);
                    // } else {
                    //     Storage.set('remember', false);
                    //     Storage.set('username', '');
                    // }
                    //this.getUserMenus();  //获取菜单权限,跳转到第一个菜单
                    this.$router.push({ path: "/" });
                    window.location.reload();
                })
                .catch((response) => {
                    this.loading = false;
                });
            this.formSubmit = false;
        },
        // 展示项目
        selectProject() {
            localStorage.removeItem("searchTimes");
            let phone =
                this.loginType == 1
                    ? this.passwordModal.phone
                    : this.phoneLoginForm.phone;
            let veryCode =
                this.loginType == 1
                    ? this.passwordModal.veryCode
                    : this.phoneLoginForm.veryCode;
            let veryType = this.loginType == 1 ? "12" : "11"; //登录 11，忘记密码12
            this.formSubmit = true;
            this.$refs.phoneLoginForm.validate((valid) => {
                if (valid) {
                    if (phone && veryCode && veryType) {
                        this.$api
                            .getUserProject(phone, veryCode, veryType)
                            .then((res) => {
                                if (res.success) {
                                    if (res.data.length > 1) {
                                        this.eventSelectVisible = true;
                                        this.eventSelectAll = res.data;
                                    } else if (res.data.length == 1) {
                                        if (this.loginType == 1) {
                                            this.passwordModal.username =
                                                res.data[0].userName;
                                            Storage.set(
                                                "username",
                                                res.data[0].userName
                                            );
                                            this.getPasswordNext();
                                        } else {
                                            this.phoneLoginForm.username =
                                                res.data[0].userName;
                                            Storage.set(
                                                "username",
                                                res.data[0].userName
                                            );
                                            this.phoneHandleLogin();
                                        }
                                    } else {
                                        // 当前手机号下无项目！
                                        this.$message.error(
                                            this.$t("login.noProjects") + "！"
                                        );
                                    }
                                } else {
                                    this.$message.error(res.msg);
                                }
                            });
                    } else {
                        return false;
                    }
                }
            });
        },
        selectProject2() {
            this.$refs.passwordModal.validate((valid) => {
                if (valid) {
                    localStorage.removeItem("searchTimes");
                    let phone =
                        this.loginType == 1
                            ? this.passwordModal.phone
                            : this.phoneLoginForm.phone;
                    let veryCode =
                        this.loginType == 1
                            ? this.passwordModal.veryCode
                            : this.phoneLoginForm.veryCode;
                    let veryType = this.loginType == 1 ? "12" : "11"; //登录 11，忘记密码12
                    if (phone && veryCode && veryType) {
                        this.$api
                            .getUserProject(phone, veryCode, veryType)
                            .then((res) => {
                                if (res.success) {
                                    if (res.data.length > 1) {
                                        this.eventSelectVisible = true;
                                        this.eventSelectAll = res.data;
                                    } else if (res.data.length == 1) {
                                        if (this.loginType == 1) {
                                            this.passwordModal.username =
                                                res.data[0].userName;
                                            Storage.set(
                                                "username",
                                                res.data[0].userName
                                            );
                                            this.getPasswordNext();
                                        } else {
                                            this.phoneLoginForm.username =
                                                res.data[0].userName;
                                            Storage.set(
                                                "username",
                                                res.data[0].userName
                                            );
                                            this.phoneHandleLogin();
                                        }
                                    } else {
                                        // 当前手机号下无项目！
                                        this.$message.error(
                                            this.$t("login.noProjects") + "！"
                                        );
                                        this.formSubmit = false;
                                    }
                                } else {
                                    this.$message.error(res.msg);
                                    this.formSubmit = false;
                                }
                            });
                    } else {
                        return false;
                    }
                }
            });
        },
        phoneHandleLogin() {
            this.validateOverdueManages = {};
            this.formSubmit = true;
            Storage.set("username", this.phoneLoginForm.username);
            localStorage.removeItem("firstLogin");
            this.$refs.phoneLoginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.$store
                        .dispatch("LoginWithPhone", this.phoneLoginForm)
                        .then((response) => {
                            this.loading = false;
                            if (
                                response.code !== "200" &&
                                response.success === false
                            ) {
                                if (
                                    response.code == "userBindYunApp.openApp" ||
                                    response.code ==
                                        "userBindYunApp.noOpsOrOvertime"
                                ) {
                                    this.validateOverdueManages = {
                                        showWarn: true,
                                        surplus: 0,
                                        useDate: "",
                                    };
                                } else {
                                    this.$message.error(response.msg);
                                }
                                return false;
                            }

                            /**
                             * 自动保存
                             */
                            if (this.remember === true) {
                                Storage.set("remember", true);
                                Storage.set(
                                    "username",
                                    this.phoneLoginForm.username
                                );
                                // Storage.set('username', this.phoneLoginForm.phone);
                            } else {
                                Storage.set("remember", false);
                                Storage.set("username", "");
                            }
                            //this.getUserMenus();  //获取菜单权限,跳转到第一个菜单
                            this.$router.push({ path: "/" });
                            window.location.reload();
                        })
                        .catch((response) => {
                            this.loading = false;
                        });
                } else {
                    return false;
                }
            });
            this.formSubmit = false;
        },
        /**
         * 重置表单
         * */
        handleReset(name) {
            this.$nextTick(() => {
                // console.log(this.$refs);
                // console.log(name);
                // console.log(this.$refs.name);
                this.$refs[name].resetFields();
            });
        },
        getVeryCode() {
            this.imgUrl =
                (process.env.BASE_API == "/" ? "." : process.env.BASE_API) +
                "/veryCode.images?r=" +
                Math.random();
        },
        checkNeedVeryCode() {
            this.$store
                .dispatch("CheckNeedVeryCode")
                .then((response) => {
                    if (
                        (response.code !== 200 ||
                            response.code !== "success") &&
                        response.success === false
                    ) {
                        this.$message.error(response.msg);
                        this.loginForm.verify = false;
                        return false;
                    } else {
                        if (response.data) {
                            this.loginForm.verify = true;
                            this.getVeryCode();
                        } else {
                            this.loginForm.verify = false;
                        }
                    }
                })
                .catch((response) => {
                    this.loginForm.verify = false;
                });
        },
        //获取验证码
        getPhoneCode() {
            this.$api
                .getPhoneVeryCode(this.phoneLoginForm.phone)
                .then((res) => {
                    if (res.success == true) {
                        // 短信发送成功
                        this.$message.success(this.$t("login.SMSSentSuccess"));
                        this.blackTime = 60;
                        let timeInterval = setInterval(() => {
                            this.blackTime = this.blackTime - 1;
                            if (this.blackTime == 0) {
                                clearInterval(timeInterval);
                            }
                        }, 1000);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        //获取验证码
        validateOverdueWithoutLogin() {
            this.$api
                .validateOverdueWithoutLogin({
                    username: this.loginForm.username,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.validateOverdueManages = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        getPasswordPhoneCode() {
            this.$api
                .getPasswordPhoneVeryCode(this.passwordModal.phone)
                .then((res) => {
                    if (res.success == true) {
                        // 短信发送成功
                        this.$message.success(this.$t("login.SMSSentSuccess"));
                        this.passwordBlackTime = 60;
                        let timeInterval = setInterval(() => {
                            this.passwordBlackTime = this.passwordBlackTime - 1;
                            if (this.passwordBlackTime == 0) {
                                clearInterval(timeInterval);
                            }
                        }, 1000);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        //打开忘记密码
        getPassword() {
            // this.handleReset ('passwordModal');
            console.log("===this.passwordBlackTime", this.passwordBlackTime);
            this.passwordBlackTime = 0;
            this.setPasswordModal = true;
            this.actLevel = 0;
        },
        closeSetPassword() {
            console.log("***********");
            this.handleReset("passwordModal");
            this.setPasswordModal = false;
            this.actLevel = 0;
            this.passwordBlackTime = 0;
        },
        //点击下一步
        getPasswordNext() {
            this.$refs.passwordModal.validate((valid) => {
                if (valid) {
                    let sha256 = require("js-sha256").sha256;
                    let ll = {
                        phone: this.passwordModal.phone,
                        password: sha256(this.passwordModal.password),
                        veryCode: this.passwordModal.veryCode,
                        username: this.passwordModal.username,
                    };

                    this.$api.resetPasswordWithVeryCode(ll).then((res) => {
                        if (res.success == true) {
                            // 修改密码成功！
                            this.$message.success(
                                this.$t("login.passwordChangedSuccess")
                            );
                            this.setPasswordModal = false;
                        } else {
                            this.$refs.passwordModal.focusFirstField();
                            this.$message.error(res.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
            // this.current = this.current + 1 ;
        },
        //获取用户权限,如果没有车辆定位监控,隐藏tab页
        getUserMenus() {
            this.$api.getUserMenus().then((res) => {
                if (res.success == true) {
                    let data = res.data;
                    if (data.length > 0) {
                        data.forEach((item, index) => {
                            //将第一个URL作为登录跳转页面
                            if (index == 0) {
                                //如果只有一级菜单跳到一级菜单,否则跳到二级菜单
                                if (item.children.length > 0) {
                                    this.$router.push({
                                        path: item.children[0].component,
                                    });
                                } else {
                                    this.$router.push({ path: item.component });
                                }
                            }
                        });
                    } else {
                        // 无菜单权限,请联系管理员进行配置!
                        this.$message.info(this.$t("login.noMenuPermission"));
                    }
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
                    this.ios_qr_url = data.ios_qr;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        forgetPassword() {
            this.$router.push({ path: "/forgetPassword" });
        },
    },
    created() {
        // localStorage.removeItem('codeTice');
        this.codeTice = localStorage.getItem("codeTice");
        this.basicSettings();
        this.getNotice();
        let data = this.$route.query;
        if (data.upc) {
            this.$router.push({
                path: "/signOnPage",
                query: data,
            });
        }
        this.remember = Storage.get("remember") || false;
        if (this.remember == true) {
            this.loginForm.username = Storage.get("username");
        } else {
            this.loginForm.username = "";
            Storage.set("username", "");
        }
        this.checkNeedVeryCode();
        this.getAppDownloadImg();
        this.$store.dispatch("RemoveDefaultMaintenanceCar");
    },
};
</script>
<style scoped lang="less">
//     div /deep/.el-    {
// 	/* 修改为您想要的文字大小 */
//     font-size: 20px!important;
// }
.login-form {
    /deep/.el-input {
        .el-input__icon {
            line-height: 40px;
        }
    }
}
.noticeTitle {
    color: #000;
    font-size: 16px;
    letter-spacing: 1px;
    text-align: left;
}
.noticeC {
    font-size: 16px;
    text-align: justify;
    letter-spacing: 1px;
    line-height: 24px;
    // margin: 10px 5px;
}
.noticeTime {
    font-size: 16px;
    text-align: right;
    letter-spacing: 1px;
}
.borerStyle {
    border-bottom: 2px solid #000;
}
.login,
.lock-screen {
    /*display: flex;
        justify-content: center;
        align-items: center;*/
    position: absolute;
    height: 100%;
    width: 100%;
}
.login-box {
    position: absolute;
    top: 50%;
    margin-top: -400px;
    left: 50%;
    margin-left: -300px;
    width: auto;
    height: 620px;
}
.vm-login {
    button,
    input {
        font-size: 0.875rem;
    }
    h1 {
        font-size: 22px !important;
    }
}
.vm-login,
.vm-register {
    /*margin-top: -150px;*/
    width: auto;
    height: 620px;
    display: inline-block;
    .login-title {
        color: #4886ff;
        font-size: 22px !important;
    }
    .vm-panel {
        padding: 90px;
        width: 500px;
        border-radius: 4px;
        background: #f2f2f2;
        .ivu-form-item-content {
            margin-top: -1px;
            .ivu-icon {
                left: 0;
                right: auto;
                line-height: 40px;
                z-index: 4;
            }
            .ivu-input {
                padding-left: 32px;
                padding-right: 7px;
                border-radius: 0;
            }
        }
        .ivu-form-item {
            &:first-child .ivu-input {
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
            }
            &:last-child .ivu-input {
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
            }
        }
        .no-verify {
            .ivu-form-item {
                &:nth-child(2) .ivu-input {
                    border-bottom-left-radius: 4px;
                    border-bottom-right-radius: 4px;
                }
            }
        }
        .ivu-input:hover,
        .ivu-input:active,
        .ivu-input:focus {
            z-index: 3;
        }
        .ivu-form-item-error .ivu-input {
            z-index: 2;
        }
        .input-verify {
            .ivu-input {
                padding-right: 100px;
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
            }
        }
        .img-verify {
            position: absolute;
            top: 2px;
            right: 5px;
            width: 96px;
            height: 36px;
            z-index: 3;
            cursor: pointer;
        }
    }
}
.passwordType {
    padding: 4px 10px;
    cursor: pointer;
}
.checked {
    padding: 4px 10px;
    color: #1890ff;
    border-bottom: 2px solid #1890ff;
    cursor: pointer;
}
.blackTime {
    margin-top: 3px;
    margin-right: -31px;
    z-index: 9999;
}
.passwordBlackTime {
    margin-top: 3px;
    margin-right: -31px;
    z-index: 9999;
}
.pointer {
    cursor: pointer;
}
.setPassword {
    padding: 60px;
}
.ewmImage {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
}
.showewmImage {
    height: 222px;
    width: 322px;
    text-align: center;
}
.showewmImage img {
    height: 140px;
    width: 140px;
    margin-top: 40px;
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
}
.forget-password {
    margin: 0 auto;
}
.remember-password {
    display: flex;
    justify-content: space-between;
    height: 24px;
    line-height: 24px;
}
.selectEvent {
    float: right;
    margin-right: 20px;
}
.eventSelectItem {
    border-bottom: 1px solid rgb(235, 235, 235);
    margin-top: 10px;
    padding-bottom: 5px;
    &:last-child {
        border: none;
    }
}
.content-text {
    text-align: left;
}
</style>
