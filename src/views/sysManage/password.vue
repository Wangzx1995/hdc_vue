<template>
    <div class="p-x-md p-y" v-loading.fullscreen.lock="fullscreenLoading">
        <el-form
            ref="resetPasswordForm"
            :model="resetPasswordForm"
            :rules="passwordformValidate"
            :label-width="'90px'"
            class="p-t-md p-x-md white"
        >
            <el-form-item label="原密码:" prop="oldPassword">
                <el-input
                    :disabled="loadingAll"
                    v-model="resetPasswordForm.oldPassword"
                    type="password"
                    placeholder="请输入原密码"
                    class="w-md"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
                <el-input
                    :disabled="loadingAll"
                    v-model="resetPasswordForm.password"
                    type="password"
                    placeholder="请输入密码"
                    class="w-md"
                    clearable
                ></el-input>
                <el-row
                    :gutter="1"
                    class="m-t-xs w-md text-center l-h-2x"
                    style="display: flex"
                >
                    <el-col :span="6"
                        ><div
                            :class="actLevel <= 0 ? 'accent error' : 'accent'"
                        >
                            风险
                        </div></el-col
                    >
                    <el-col :span="6"
                        ><div
                            :class="actLevel == 1 ? 'accent warning' : 'accent'"
                        >
                            弱
                        </div></el-col
                    >
                    <el-col :span="6"
                        ><div :class="actLevel == 2 ? 'accent info' : 'accent'">
                            中
                        </div></el-col
                    >
                    <el-col :span="6"
                        ><div
                            :class="actLevel == 3 ? 'accent success' : 'accent'"
                        >
                            强
                        </div></el-col
                    >
                </el-row>
            </el-form-item>
            <el-form-item label="确认密码:" prop="password2">
                <el-input
                    :disabled="loadingAll"
                    v-model="resetPasswordForm.password2"
                    type="password"
                    placeholder="请再次输入密码"
                    class="w-md"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    :disabled="loadingAll"
                    :loading="loading"
                    @click="doSavePassWord()"
                    class="m-b-md"
                    >确定</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {
    checkStrong,
    validateNoChinese,
    validateNumLetterSpecial,
} from "@/utils/validate";
import AES from "@/utils/secret";
export default {
    data() {
        const resetValidatePassCheck = (rule, value, callback) => {
            if (value == "") {
                callback(new Error("密码不能为空"));
            } else if (value != this.resetPasswordForm.password) {
                callback(new Error("两次密码不一致"));
            } else {
                callback();
            }
        };
        const checkPassStrong = (rule, value, callback) => {
            if (!value) {
                callback(new Error("密码不能为空"));
            } else if (!validateNumLetterSpecial(value)) {
                callback(new Error("仅能输入数字、字母、英文特殊字符"));
            } else {
                this.actLevel = checkStrong(value, null);
                if (this.actLevel < this.passLevel) {
                    callback(new Error("密码强度过低"));
                }
                callback();
            }
        };
        // const checkPassStrong = (rule, value, callback) => {
        //     if (value === "") {
        //         callback(new Error("密码不能为空"));
        //     } else {
        //         if (validateNoChinese(value)) {
        //             callback(new Error("密码不能出现中文"));
        //         } else {
        //             console.log(AES.encrypt(value));
        //             let params = { pwd: AES.encrypt(value) };
        //             this.$api.checkPwdLevel(params).then((res) => {
        //                 if (res.data < 0) {
        //                     callback(new Error("密码强度过低"));
        //                 } else {
        //                     this.actLevel = res.data;
        //                 }
        //             });
        //             // this.actLevel= checkStrong(value);
        //             // if(this.actLevel<this.passLevel){
        //             //     callback(new Error('密码强度过低'));
        //             // }
        //             callback();
        //         }
        //     }
        // };
        return {
            resetPasswordForm: {
                username: "",
                oldPassword: "",
                password: "",
                password2: "",
            },
            passLevel: 3,
            actLevel: 0,
            fullscreenLoading: false,
            loading: false,
            loadingAll: false,
            passwordformValidate: {
                oldPassword: [
                    {
                        required: true,
                        message: "密码不能为空",
                        trigger: "blur",
                    },
                    {
                        type: "string",
                        min: 8,
                        max: 20,
                        message: "密码长度必须在8~20个字符以内",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "密码不能为空",
                        trigger: "blur",
                    },
                    {
                        type: "string",
                        min: 8,
                        max: 20,
                        message: "密码长度必须在8~20个字符以内",
                        trigger: "blur",
                    },
                    { validator: checkPassStrong, trigger: "change" },
                    { validator: checkPassStrong, trigger: "blur" },
                ],
                password2: [
                    {
                        required: true,
                        message: "密码不能为空",
                        trigger: "blur",
                    },
                    {
                        type: "string",
                        min: 6,
                        max: 20,
                        message: "密码长度必须在8~20个字符以内",
                        trigger: "blur",
                    },
                    { validator: resetValidatePassCheck, trigger: "blur" },
                ],
            },
        };
    },
    methods: {
        doSavePassWord() {
            this.$refs.resetPasswordForm.validate((valid) => {
                if (valid) {
                    let sha256 = require("js-sha256").sha256;
                    let form = {};
                    form.name = this.resetPasswordForm.username;
                    form.password = sha256(this.resetPasswordForm.password);
                    form.oldPassword = sha256(
                        this.resetPasswordForm.oldPassword
                    );
                    this.$api.updateFirstPassword(form).then((res) => {
                        if (res.success == true) {
                            this.loading = false;
                            this.loadingAll = true;
                            this.$message.success(
                                "修改密码成功，页面将在5秒中之后跳转至登录页面"
                            );
                            let _this = this;
                            setTimeout(() => {
                                this.$store.dispatch("LogOut");
                                _this.$router.push("/");
                                this.loadingAll = false;
                                this.fullscreenLoading = false;
                            }, 5000);
                        } else {
                            this.loading = false;
                            this.$message.error("重置密码失败:" + res.msg);
                        }
                    });
                }
            });
        },
    },
    created() {
        this.resetPasswordForm.username = this.$route.query.username;
    },
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
.loading_ {
    pointer-events: none;
}
</style>
