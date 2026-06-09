<template>
    <div class="user-manage">
        <el-form
            ref="searchForm"
            :model="searchForm"
            inline
            :rules="searchFormValidate"
            class="p-x p-t"
        >
            <div class="wrap-top">
                <div>
                    <!-- 账户名 -->
                    <el-form-item :label="$t('userManage.name')" prop="name">
                        <el-input
                            :placeholder="$t('common.input')"
                            v-model="searchForm.name"
                            class="w"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <!-- 姓名 -->
                    <el-form-item
                        :label="$t('userManage.nickName')"
                        prop="nickName"
                    >
                        <el-input
                            v-model="searchForm.nickName"
                            :placeholder="$t('common.input')"
                            class="w"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <!-- 用户状态 -->
                    <el-form-item
                        :label="$t('userManage.isFreezed')"
                        prop="isFreezed"
                    >
                        <el-select
                            v-model="searchForm.isFreezed"
                            class="w"
                            transfer
                            clearable
                        >
                            <!-- 全部 -->
                            <el-option
                                :value="-1"
                                :key="-1"
                                :label="$t('userManage.isFreezedMsg1')"
                            ></el-option>
                            <!-- 启用 -->
                            <el-option
                                :value="0"
                                :key="0"
                                :label="$t('userManage.isFreezedMsg2')"
                            ></el-option>
                            <!-- 停用 -->
                            <el-option
                                :value="1"
                                :key="1"
                                :label="$t('userManage.isFreezedMsg3')"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 手机号码 -->
                    <el-form-item
                        :label="$t('userManage.phoneNo')"
                        prop="phoneNo"
                    >
                        <el-input
                            v-model="searchForm.phoneNo"
                            :placeholder="$t('common.input')"
                            class="w"
                            clearable
                        ></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-button
                        :loading="searchLoading"
                        :disabled="searchLoading"
                        type="primary"
                        @click="
                            params.currentPage = 1;
                            search();
                        "
                    >
                        <!-- 查询 -->
                        {{ $t("common.search") }}
                    </el-button>
                    <el-button
                        type="default"
                        @click="handleReset($refs.searchForm)"
                    >
                        <!-- 清除条件 -->
                        {{ $t("common.reset") }}
                    </el-button>
                </div>
            </div>
            <el-row class="m-y">
                <el-button
                    type="primary"
                    :disabled="userType == 0"
                    @click="goAdd2"
                    v-btn="'userManageAdd'"
                >
                    <!-- 添加 -->
                    {{ $t("common.add") }}
                </el-button>
                <!-- <el-button type="default" :disabled="selection.length == 0" @click="doBatchDelete">删除</el-button> -->
            </el-row>
        </el-form>
        <div class="p-x">
            <el-table
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :data="listData"
                ref="table"
                border
                stripe
                :height="tableHeight"
                @selection-change="onSelectionChange"
            >
                <!-- 账户名 -->
                <el-table-column
                    prop="name"
                    :label="$t('userManage.name')"
                    min-width="160px"
                ></el-table-column>
                <!-- 姓名 -->
                <el-table-column
                    prop="nickName"
                    :label="$t('userManage.nickName')"
                    min-width="160px"
                ></el-table-column>
                <!-- 角色列表 -->
                <el-table-column
                    prop="roleList"
                    :label="$t('userManage.roleNameList')"
                    min-width="500px"
                >
                    <template slot-scope="scope">
                        {{ scope.row.roleNameList }}
                    </template>
                </el-table-column>
                <!-- 手机号码 -->
                <el-table-column
                    prop="phoneNo"
                    :label="$t('userManage.phoneNo')"
                    width="140px"
                ></el-table-column>
                <!-- 用户状态 -->
                <el-table-column
                    prop="isFreezed"
                    :label="$t('userManage.isFreezed')"
                    width="100px"
                >
                    <template slot-scope="scope">
                        <el-tag
                            type="success"
                            v-if="scope.row.isFreezed == 0"
                            class="cursor-default"
                        >
                            <!-- 启用 -->
                            {{ $t("userManage.isFreezedMsg2") }}
                        </el-tag>
                        <el-tag type="info" v-else class="cursor-default">
                            <!-- 停用 -->
                            {{ $t("userManage.isFreezedMsg3") }}
                        </el-tag>
                    </template>
                </el-table-column>
                <!-- 创建人 -->
                <el-table-column
                    prop="createName"
                    :label="$t('userManage.createName')"
                    min-width="160px"
                ></el-table-column>
                <!-- 操作 -->
                <el-table-column
                    :label="$t('common.operate')"
                    width="180px"
                    fixed="right"
                >
                    <template slot-scope="scope">
                        <div
                            v-show="scope.row.isSysMust != 1"
                            class="text-nowrap"
                        >
                            <el-button
                                v-if="!enableSMS"
                                type="text"
                                class="text-info"
                                @click="resetPwd(scope.row.id)"
                            >
                                <!-- 重置密码 -->
                                {{ $t("userManage.resetPassword") }}
                            </el-button>
                            <el-button
                                type="text"
                                class="text-info"
                                @click="goEdit2(scope.row.id)"
                                v-btn="'userManageEdit'"
                            >
                                <!-- 编辑 -->
                                {{ $t("common.edit") }}
                            </el-button>
                            <el-button
                                type="text"
                                class="text-info"
                                :disabled="userType == 0"
                                @click="doDelete(scope.row.id)"
                                v-btn="'userManageDelete'"
                            >
                                <!-- 删除 -->
                                {{ $t("common.delete") }}
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="p-x m-t wrap-bottom">
            <el-pagination
                @size-change="PageSizeChange"
                @current-change="pageChange"
                :current-page="params.currentPage"
                :page-sizes="[20, 50, 100]"
                :page-size="params.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>
        <!-- 重置密码 -->
        <el-dialog
            :append-to-body="true"
            :close-on-click-modal="false"
            :visible="resetModel"
            :title="$t('userManage.resetPassword')"
            @close="resetModelClose"
            :width="'340px'"
            custom-class="edit-user"
        >
            <el-form
                :model="resetForm"
                ref="resetForm"
                :rules="resetFormValidate"
                label-width="100px"
                label-position="top"
                v-if="passwordHidden"
            >
                <!-- 当前管理员密码 -->
                <el-form-item
                    :label="$t('userManage.adminPassword')"
                    prop="adminPassword"
                >
                    <el-input
                        size="small"
                        v-model="resetForm.adminPassword"
                        type="password"
                        class="w-md"
                        clearable
                    ></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item :label="$t('login.password')" prop="password">
                    <el-input
                        v-if="resetModel"
                        v-model="resetForm.password"
                        type="password"
                        :placeholder="$t('forgetPassword.rulesMsg4')"
                        show-password
                        class="w-md"
                        @input="changePsd"
                        clearable
                    ></el-input>
                    <el-row
                        :gutter="1"
                        class="m-t-xs w-md text-center l-h-2x"
                        style="display: flex"
                    >
                        <el-col :span="6"
                            ><div
                                :class="
                                    actLevel <= 0 ? 'accent error' : 'accent'
                                "
                            >
                                <!-- 风险 -->
                                {{ $t("login.risk") }}
                            </div></el-col
                        >
                        <el-col :span="6">
                            <div
                                :class="
                                    actLevel == 1 ? 'accent warning' : 'accent'
                                "
                            >
                                <!-- 弱 -->
                                {{ $t("login.strength1") }}
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div
                                :class="
                                    actLevel == 2 ? 'accent info' : 'accent'
                                "
                            >
                                <!-- 中 -->
                                {{ $t("login.strength2") }}
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div
                                :class="
                                    actLevel == 3 ? 'accent success' : 'accent'
                                "
                            >
                                <!-- 强 -->
                                {{ $t("login.strength3") }}
                            </div>
                        </el-col>
                    </el-row>
                </el-form-item>
                <!-- 确认密码 -->
                <el-form-item
                    :label="$t('userManage.confirmPassword')"
                    prop="password2"
                >
                    <el-input
                        v-model="resetForm.password2"
                        type="password"
                        :placeholder="
                            $t('userManage.confirmPasswordPlaceholder')
                        "
                        show-password
                        @input="changePsd"
                        class="w-md"
                        clearable
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="default" @click="resetCancel">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button
                    type="primary"
                    :loading="loading"
                    @click="resetSave()"
                >
                    <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </div>
        </el-dialog>
        <!-- 验证用户权限 -->
        <el-dialog
            :visible="saveInfoModal"
            class="save-info-dialog"
            :title="$t('common.addSuccess')"
            :show-close="false"
        >
            <div v-if="!enableSMS" class="info-bar p-a-sm">
                <i
                    class="el-icon-circle-check"
                    style="color: #1db84c; font-size: 20px; margin-right: 6px"
                ></i>
                <!-- 用户添加成功 -->
                {{ $t("userManage.userAddedSuccessfully") }}
            </div>
            <div v-if="enableSMS" class="info-bar p-a-sm">
                <i
                    class="el-icon-circle-check"
                    style="color: #1db84c; font-size: 20px; margin-right: 6px"
                ></i>
                <!-- 用户添加成功，您添加的用户可使用以下方式来登录平台/APP -->
                {{ $t("userManage.userAddedSuccessfullyLogin") }}
            </div>
            <div class="info-content m-t-md">
                <div class="info-content-left" ref="container">
                    <h3>
                        <!-- 账户名密码登录 -->
                        {{ $t("userManage.accountNamePasswordLogin") }}
                    </h3>
                    <p>
                        <!-- 平台地址 -->
                        {{ $t("userManage.platformAddress") }}
                        ：{{ saveInfo.platformUrl }}
                    </p>
                    <p>
                        <!-- 账户名 -->
                        {{ $t("userManage.name") }}
                        ：{{ saveInfo.name }}
                    </p>
                    <h3 v-if="enableSMS" class="m-t-md">
                        <!-- 手机号码验证码登录 -->
                        {{ $t("userManage.mobileCodeLogin") }}
                    </h3>
                    <p v-if="enableSMS">
                        <!-- 手机号码 -->
                        {{ $t("userManage.phoneNo") }}
                        ：{{ saveInfo.phoneNo }}
                    </p>
                </div>
                <div v-if="enableSMS" class="info-content-right">
                    <img :src="saveInfo.appQr" alt="" />
                    <span>
                        <!-- 扫码下载运维APP -->
                        {{ $t("userManage.scanTheCodeApp") }}
                    </span>
                </div>
            </div>
            <div class="info-manage m-t-md">
                <a class="m-r-md" @click="copy">
                    <!-- 复制 -->
                    {{ $t("userManage.copy") }}
                </a>
                <a @click="cutPic">
                    <!-- 截图 -->
                    {{ $t("userManage.cutPic") }}
                </a>
            </div>
            <div slot="footer">
                <el-button
                    type="primary"
                    :loading="loading"
                    @click="closeSaveInfoModal()"
                >
                    <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </div>
        </el-dialog>
        <!-- 删除用户 -->
        <el-dialog
            width="700px"
            @close="deleteVisible = false"
            class="el-no-padding-y"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="deleteVisible"
            :title="$t('userManage.deleteUser')"
        >
            <div class="el-dialog-user-delete">
                <span
                    class="font-14 m-y"
                    style="line-height: 22px; color: #000"
                >
                    <!-- 是否一起删除当前用户的子用户 -->
                    {{ $t("userManage.deleteUserText1") }}
                </span>
                <el-radio-group
                    v-model="deleteParams.deleteAllChildren"
                    class="m-y"
                >
                    <el-radio :label="0" class="m-b">
                        <span>
                            <!-- 不删除子用户，子用户自动合并至当前删除用户的父节点 -->
                            {{ $t("userManage.deleteUserText2") }}
                        </span>
                    </el-radio>
                    <el-radio :label="1">
                        <span style="line-height: 22px">
                            <!-- 删除子用户，并删除子用户创建的所有用户 -->
                            {{ $t("userManage.deleteUserText3") }}
                        </span>
                    </el-radio>
                </el-radio-group>
                <div class="img-delete m-b" style="width: 100%; height: 200px">
                    <img
                        height="100%"
                        :src="
                            deleteParams.deleteAllChildren == 1
                                ? '/static/images/user1.svg'
                                : '/static/images/user2.svg'
                        "
                    />
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteVisible = false">
                    <!-- 取 消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button
                    type="primary"
                    :loading="loading"
                    @click="deleteUsers()"
                >
                    <!-- 确 定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </span>
        </el-dialog>
        <userManageDialog
            ref="userManageDialog"
            :userManageDialog.sync="userManageDialog"
            :modalType="modalType"
            :userType="userType"
            :userId="userId"
            @search="search"
            @resetPwd="resetPwd"
        ></userManageDialog>
    </div>
</template>
<script>
//import Vue from "vue";
import Vue from "vue/dist/vue.esm.js";
// const Vue = require('vue');
import VueClipboard from "vue-clipboard2"; // 剪贴
import html2canvas from "html2canvas"; // 截图
import userManageDialog from "./userManageDialog";
Vue.use(VueClipboard);
import {
    checkStrong,
    validatePhoneNo,
    validateNumberAndEnglishStartWithEnglish,
    validateExpectSpecial,
    validateNumLetterSpecial,
} from "@/utils/validate";
import { validateSpecial } from "@/utils/validate";
export default {
    name: "userManage",
    components: { userManageDialog },
    data() {
        const checkSpeccial = (rule, value, callback) => {
            if (value != undefined && value.length > 0) {
                if (validateSpecial(value)) {
                    callback(
                        new Error(
                            this.$t("userManage.checkSpeccial") +
                                "：\\/:*?\"<|'&%>"
                        )
                    );
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        const checkPhoneNo = (rule, value, callback) => {
            if (value != undefined && value.length > 0) {
                if (validateSpecial(value)) {
                    // 请勿输入字符
                    callback(
                        new Error(
                            this.$t("userManage.checkSpeccial") +
                                "：\\/:*?\"<|'&%>"
                        )
                    );
                } else if (value.length < 4) {
                    // 请输入至少4位手机号码
                    callback(new Error(this.$t("userManage.checkPhoneNo")));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        const validateresetFormPassCheck = (rule, value, callback) => {
            if (value == "") {
                // 密码不能为空
                callback(new Error(this.$t("userManage.checkPassStrong1")));
            } else if (value != this.resetForm.password) {
                // 两次密码不一致
                callback(new Error(this.$t("userManage.checkPassStrong2")));
            } else {
                callback();
            }
        };
        const checkPassStrong = (rule, value, callback) => {
            if (!value) {
                // 密码不能为空
                callback(new Error(this.$t("userManage.checkPassStrong1")));
            } else if (!validateNumLetterSpecial(value)) {
                // 仅能输入数字、字母、英文特殊字符
                callback(new Error(this.$t("userManage.checkPassStrong3")));
            } else {
                this.actLevel = checkStrong(value, this.editForm.name);
                if (this.actLevel < this.passLevel) {
                    // 密码强度过低
                    callback(new Error(this.$t("userManage.checkPassStrong4")));
                }
                callback();
            }
        };
        return {
            userId: null,
            userManageDialog: false,
            dataPermission: localStorage.getItem("dataPermission"),
            subType: localStorage.getItem("userSubType"),
            searchLoading: true,
            loading: false,
            resetModel: false, //重置密码弹窗
            saveInfoModal: false,
            treeData: [],
            expandedList: [],
            passLevel: 3,
            tableHeight: 500,
            userType: 1,
            actLevel: 0,
            modalType: 0,
            dataReady: false, // 判断异步数据加载完成，避免报错
            passwordType: "password", // 默认password框
            enableSMS: true, //是否开启短信验证
            resetForm: {
                //重置密码
                adminPassword: "",
                password: "",
                password2: "",
                id: "",
            },
            resetFormValidate: {
                //重置密码验证
                adminPassword: [
                    {
                        required: true,
                        // message: "密码不能为空",
                        message: this.$t("userManage.checkPassStrong1"),
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        // message: "密码不能为空",
                        message: this.$t("userManage.checkPassStrong1"),
                        trigger: "blur",
                    },
                    {
                        type: "string",
                        min: 8,
                        max: 20,
                        // message: "密码长度必须在8~20个字符以内",
                        message: this.$t("userManage.checkPassStrong5"),
                        trigger: "blur",
                    },
                    { validator: checkPassStrong, trigger: "change" },
                    { validator: checkPassStrong, trigger: "blur" },
                ],
                password2: [
                    {
                        required: true,
                        // message: "密码不能为空",
                        message: this.$t("userManage.checkPassStrong1"),
                        trigger: "blur",
                    },
                    {
                        type: "string",
                        min: 8,
                        max: 20,
                        // message: "密码长度必须在8~20个字符以内",
                        message: this.$t("userManage.checkPassStrong5"),
                        trigger: "blur",
                    },
                    { validator: validateresetFormPassCheck, trigger: "blur" },
                ],
            },
            editForm: {
                // 添加、编辑表单
                id: "",
                name: "",
                password: "",
                password2: "",
                roleIds: [],
                roleList: [],
                tanentId: null,
                tanentList: [],
                isFreezed: 0,
                nickName: "",
                phoneNo: null,
                type: 4,
                isTenant: false,
                groupIds: [],
                seeSameLevel: 0,
                enableValidityPeriod: 1,
                accountValidityPeriod: "",
                loginTypeSupportList: [],
                loginAuthTypeSupportList: [],
                // dSubAk:localStorage.getItem('dSubAk')
            },
            searchForm: {
                // 搜索表单
                name: "",
                isFreezed: -1,
                nickName: "",
                phoneNo: "",
            },
            searchFormValidate: {
                name: [{ validator: checkSpeccial, trigger: "change" }],
                nickName: [{ validator: checkSpeccial, trigger: "change" }],
                phoneNo: [{ validator: checkPhoneNo, trigger: "input" }],
            },
            allRoleList: [], //角色List
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "name", //排序列
                orderDir: "asc", //排序方向
            },
            listData: [], // @:data
            total: 0, // 数据总数
            selection: [], // 表格选中项
            editType: "",
            pwdEditable: false, // 密码是否可编辑
            telEditable: false, // 手机是否可编辑
            defaultProps: {
                children: "children",
                label: "name",
                disabled: "forbidden",
            },
            saveInfo: {
                appQr: "",
                name: "",
                phoneNo: "",
                platformUrl: "",
            },
            loginTypeSupportArray: [],
            loginAuthTypeSupportArray: [],
            editLoading: false,
            passwordHidden: true,
            deleteVisible: false, //删除用户弹窗
            deleteParams: {
                deleteAllChildren: 1,
                userIds: [],
            },
        };
    },
    watch: {
        params: {
            handler(val) {
                let params = Object.assign(val, this.searchForm);
                this.getData(params);
            },
            deep: true,
        },
    },
    computed: {
        state() {
            return this.$store.state.app;
        },
        userName() {
            return this.$store.state.user.name;
        },
    },
    methods: {
        resetModelClose() {
            this.resetModel = false;
            setTimeout(() => {
                this.handleReset(this.$refs.resetForm);
                this.passwordHidden = false;
                setTimeout(() => {
                    this.passwordHidden = true;
                }, 100);
            }, 300);
        },
        //获取系统基础设置
        getSetting() {
            this.$api.basicSettings().then((res) => {
                if (res.success == true) {
                    this.enableSMS = res.data.enableSMS;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        treeCheck() {
            this.editForm.groupIds = this.$refs.tree.getCheckedKeys();
        },
        copy() {
            let container = this.$refs.container.innerText;
            this.$copyText(container).then(() => {
                // this.$message.success("信息已复制到剪贴板，可贴粘。");
                this.$message.success(this.$t("userManage.copyText"));
            });
        },
        cutPic() {
            html2canvas(this.$refs.container, {
                backgroundColor: null,
            }).then((canvas) => {
                let dataURL = canvas.toDataURL("image/png");
                //"截图"
                this.downloadIamge(dataURL, this.$t("userManage.cutPic"));
            });
        },
        //获取用户是否为平台用户
        getIsYWService() {
            this.$api.getIsYWService().then((res) => {
                this.userType = res.data;
            });
        },
        //下载图片地址和图片名
        downloadIamge(imgsrc, name) {
            var image = new Image();
            // 解决跨域 Canvas 污染问题
            image.setAttribute("crossOrigin", "anonymous");
            image.onload = function () {
                var canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                var context = canvas.getContext("2d");
                context.drawImage(image, 0, 0, image.width, image.height);
                var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
                var a = document.createElement("a"); // 生成一个a元素
                var event = new MouseEvent("click"); // 创建一个单击事件
                a.download = name || "photo"; // 设置图片名称
                a.href = url; // 将生成的URL设置为a.href属性
                a.dispatchEvent(event); // 触发a的单击事件
            };
            image.src = imgsrc;
        },
        search() {
            this.$refs.searchForm.validate((valid) => {
                if (valid) {
                    if (this.params.currentPage == 1) {
                        let params = Object.assign(
                            this.params,
                            this.searchForm
                        );
                        this.getData(params);
                    } else {
                        this.params.currentPage = 1;
                    }
                }
            });
        },
        getData(params) {
            this.searchLoading = true;
            this.$api
                .getUserPage(params)
                .then((res) => {
                    if (res.success == true) {
                        res.data.results.forEach(function (item) {
                            if (item.type == 1) {
                                item._disabled = true;
                            }
                        });
                        this.listData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.listData;
                        this.listData.map((row) => {
                            let list = [];
                            row.roleList.map((i) => {
                                list.push(i.name);
                            });
                            row.roleNameList = list.join("、");
                        });
                        this.total = res.data.totalRecords;
                        this.dataReady = true;
                        this.selection = [];
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.searchLoading = false;
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        onSelectionChange(selection) {
            this.selection = selection;
        },
        pageChange(page) {
            this.params.currentPage = page;
        },
        PageSizeChange(limit) {
            this.params.currentPage = 1;
            this.params.pageSize = limit;
        },
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
            }
        },
        goAdd2() {
            if (
                !this.$store.state.permission.routersMenus.find(
                    (i) => i.id === 295
                )
            ) {
                this.$message.warning(
                    // "当前用户无角色管理权限，请联系管理员处理"
                    this.$t("userManage.noMenuPermissions")
                );
                return;
            }
            this.modalType = -1;
            this.userManageDialog = true;
            this.$nextTick(() => {
                this.$refs.userManageDialog.$refs.editForm.resetFields();
                this.$refs.userManageDialog.$refs.box.scrollTo(0, 0);
                setTimeout(() => {
                    this.$refs.userManageDialog.setDefaultValue();
                }, 300);
            });
        },
        //组织树添加禁用选项
        addDisabled(dataArr, type) {
            dataArr.forEach((item) => {
                item["forbidden"] = type;
                if (item["children"].length) {
                    let childType = type ? true : false;
                    this.addDisabled(item["children"], childType);
                }
            });
        },
        //重置密码
        resetPwd(id) {
            this.actLevel = 0;
            this.handleReset(this.$refs.resetForm);
            this.resetForm.id = id;
            this.resetModel = true;
        },
        resetCancel() {
            this.resetModel = false;
        },
        resetSave() {
            this.$refs.resetForm.validate((valid) => {
                if (valid) {
                    let form = JSON.parse(JSON.stringify(this.resetForm));
                    let sha256 = require("js-sha256").sha256;
                    form.adminPassword = sha256(form.adminPassword);
                    form.password = sha256(form.password);
                    delete form.password2;
                    this.$api.resetChildPassword(form).then((res) => {
                        if (res.success == true) {
                            // this.$message.success("用户密码重置成功");
                            this.$message.success(
                                this.$t("userManage.resetChildPasswordSuccess")
                            );
                            this.resetModel = false;
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                }
            });
        },
        goEdit2(id) {
            if (
                !this.$store.state.permission.routersMenus.find(
                    (i) => i.id === 295
                )
            ) {
                this.$message.warning(
                    // "当前用户无角色管理权限，请联系管理员处理"
                    this.$t("userManage.noMenuPermissions")
                );
                return;
            }
            this.handleReset(this.$refs.editForm);
            this.modalType = 0;
            this.userManageDialog = true;
            this.$nextTick(() => {
                this.$refs.userManageDialog.getEditForm(id);
                this.$refs.userManageDialog.$refs.box.scrollTo(0, 0);
            });

            // this.$api.getUserDetail(id).then((res) => {
            //     if (res.success == true) {
            //         res.data.password = "Aa345678";
            //         res.data.password2 = "Aa345678";
            //         _this.loading = false;
            //         _this.editForm = res.data;
            //         _this.dataPermission = res.data.dataPermission;
            //         if (_this.editForm.roleIds.indexOf(1) >= 0) {
            //             //开发者角色
            //             _this.editForm.isTenant = true;
            //         }
            //     } else {
            //         _this.loading = false;
            //         _this.$message.error(res.msg);
            //     }
            //     resolve();
            // });
        },
        doDelete(id) {
            this.deleteVisible = true;
            this.deleteParams = {
                userIds: [id],
                deleteAllChildren: 1,
            };
            this.editLoading = false;
            // this.$confirm("用户删除后将无法恢复", "确定要删除该用户吗？", {
            //     confirmButtonText: this.$t("common.ok"),
            //     cancelButtonText: this.$t("common.cancel"),
            //     type: "warning",
            // })
            //     .then(() => {
            //         // 删除用户
            //         let ids = [id];
            //         this.$api.deleteUser(ids).then((res) => {
            //             if (res.success == true) {
            //                 this.loading = false;
            //                 this.$message.success("用户已删除成功");
            //                 this.search();
            //             } else {
            //                 this.loading = false;
            //                 this.$message.error("用户删除失败" + res.msg);
            //             }
            //         });
            //     })
            //     .catch(() => {});
        },
        doBatchDelete() {
            // this.$confirm("用户删除后将无法恢复", "确定要删除这些用户吗？", {
            this.$confirm(
                this.$t("userManage.userDeleteMsg1"),
                this.$t("userManage.userDeleteMsg2"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    // 批量删除
                    let ids = [];
                    this.selection.forEach(function (item) {
                        ids.push(item.id);
                    });
                    this.$api.deleteUser(ids).then((res) => {
                        if (res.success == true) {
                            this.loading = false;
                            this.selection = [];
                            // 用户已删除成功
                            this.$message.success(
                                this.$t("userManage.userDeleteMsg3")
                            );
                            this.search();
                        } else {
                            this.loading = false;
                            this.$message.error(res.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        closeSaveInfoModal() {
            this.saveInfoModal = false;
        },
        doSave() {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    if (this.modalType == -1) {
                        let sha256 = require("js-sha256").sha256;
                        let form = JSON.parse(JSON.stringify(this.editForm));
                        form.password = sha256(this.editForm.password);
                        form.password2 = sha256(this.editForm.password2);
                        // 添加
                        this.$api.addUser(form).then((res) => {
                            if (res.success == true) {
                                this.loading = false;
                                // 添加用户成功
                                this.$message.success(
                                    this.$t("userManage.addUserSuccess")
                                );
                                this.saveInfo = res.data;
                                this.saveInfoModal = true;
                                this.search();
                            } else {
                                this.loading = false;
                                this.$message.error(res.msg);
                            }
                        });
                    } else if (this.modalType == 0) {
                        // 编辑用户
                        let editForm = JSON.parse(
                            JSON.stringify(this.editForm)
                        );
                        delete editForm.password;
                        delete editForm.password2;
                        this.$api.updateUser(editForm).then((res) => {
                            if (res.success == true) {
                                this.loading = false;
                                // 编辑用户成功
                                this.$message.success(
                                    this.$t("userManage.editUserSuccess")
                                );
                                this.search();
                            } else {
                                this.loading = false;
                                this.$message.error(res.msg);
                            }
                            let this_ = this;
                            setTimeout(() => {
                                this_.dataPermission =
                                    localStorage.getItem("dataPermission");
                            }, 10);
                            // this.$nextTick(() =>{
                            //   this.dataPermission = localStorage.getItem('dataPermission')
                            // })
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        doCancel() {
            this.loading = false;
            this.dataPermission = localStorage.getItem("dataPermission");
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 283 + 28;
        },
        changePsd() {
            this.$forceUpdate();
        },
        getDictionList() {
            this.$api
                .getDictionList({
                    dictType: "loginTypeSupport",
                })
                .then((res) => {
                    if (res.success == true) {
                        this.loginTypeSupportArray = res.data;
                    }
                });
            this.$api
                .getDictionList({
                    dictType: "loginAuthTypeSupport",
                })
                .then((res) => {
                    if (res.success == true) {
                        this.loginAuthTypeSupportArray = res.data;
                    }
                });
        },
        enableValidityPeriodChange(val) {
            this.editForm.accountValidityPeriod = "";
        },
        deleteUsers() {
            this.editLoading = true;
            this.$api
                .deleteUser(this.deleteParams)
                .then((res) => {
                    if (res.success == true) {
                        // 删除成功
                        this.$message.success(this.$t("common.deleteSuccess"));
                        this.selection = [];
                        this.params.currentPage = 1;
                        this.getData(this.params);
                        this.deleteParams = {
                            deleteAllChildren: 1,
                            userIds: [],
                        };
                        this.deleteVisible = false;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .finally(() => {
                    this.editLoading = false;
                });
        },
        getUserInfo() {
            this.$api.getHdcUserInfo().then((res) => {
                if (res.success == true) {
                    this.userId = res.data.id;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
    },
    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };
        this.getDictionList();
    },
    created() {
        this.getUserInfo();
        this.getSetting();
        this.getIsYWService();
        this.setTableHeight();
        this.getData(this.params);
        let params = { parameterName: "LowestLevelOfPassSecurity" };
        this.$api.getSysInfoValue(params).then((res) => {
            if (res.success == true) {
                this.passLevel = res.data.value;
            }
        });
        this.$api.getRoleList().then((res) => {
            if (res.success == true) {
                this.allRoleList = res.data;
            } else {
                this.$message.error(res.msg);
            }
        });
    },
};
</script>

<style lang="less" scoped>
.description {
    color: #ffa900;
    padding-top: 4px;
    line-height: 1;
    display: flex;
    align-items: center;
    & > span {
        font-size: 12px;
        line-height: 1;
        white-space: nowrap;
    }
}
.loading_ {
    pointer-events: none;
}
.user-manage {
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .el-form-item {
        margin-bottom: 0px !important;
    }
    .wrap-bottom {
        width: 100%;
        border-top: 1px solid #e4e4e4;
    }
}
div /deep/ .el-card__body {
    padding: 0 !important;
}
.save-info-dialog {
    width: 1100px;
    margin: 0 auto;
    /deep/ .el-dialog__body {
        color: #4d4d4d;
        padding: 16px 24px;
        .info-bar {
            display: flex;
            align-items: center;
            background: rgb(239, 247, 255);
        }
        .info-content {
            display: flex;
            .info-content-left {
                flex: 1;
            }
            .info-content-right {
                width: 130px;
                display: flex;
                align-items: center;
                flex-direction: column;
                img {
                    width: 130px;
                    height: 130px;
                }
            }
        }
        .info-manage {
            display: flex;
            justify-content: center;
        }
    }
}

.el-tree--highlight-current {
    overflow-y: hidden;
}
</style>
<style lang="less">
.edit-user {
    .el-form {
        .el-form-item {
            margin-bottom: 22px !important;
        }
        .el-input {
            width: 310px;
        }
    }
}
.user-add-modal {
    .el-dialog__body {
        padding-bottom: 0px;
    }
    .el-form-item__label {
        line-height: 32px;
    }
}
</style>
