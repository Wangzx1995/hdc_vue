<template>
    <div>
        <!-- :title="modalType == -1 ? '添加用户' : '编辑用户'" -->
        <el-dialog
            :title="
                modalType == -1
                    ? $t('userManage.addUser')
                    : $t('userManage.editUser')
            "
            :visible.sync="userManageDialogVisible"
            @close="close"
            :width="'1500px'"
            :top="'50px'"
            :custom-class="'user-manage-dialog'"
        >
            <div class="user-manage-content" ref="box">
                <el-form
                    ref="editForm"
                    :model="editForm"
                    :rules="formValidate"
                    label-width="120px"
                    :inline="true"
                >
                    <div class="basic-msg">
                        <h2>
                            <!-- 基础信息 -->
                            {{ $t("userManage.basicInformation") }}
                        </h2>
                        <div class="edit-form">
                            <div class="form-box">
                                <div>
                                    <!-- 常用信息 -->
                                    {{ $t("userManage.commonInformation") }}
                                </div>
                                <div>
                                    <!-- 账户名 -->
                                    <el-form-item
                                        :label="$t('userManage.name') + ':'"
                                        prop="name"
                                    >
                                        <el-input
                                            :disabled="userType == 0"
                                            size="small"
                                            v-model="editForm.name"
                                            :maxlength="16"
                                            type="text"
                                            :placeholder="
                                                $t('common.input') +
                                                $t('userManage.name')
                                            "
                                            class="w-md"
                                            clearable
                                            auto-complete="new-password"
                                        ></el-input>
                                    </el-form-item>
                                    <!-- 姓名 -->
                                    <el-form-item
                                        :label="$t('userManage.nickName') + ':'"
                                        prop="nickName"
                                    >
                                        <el-input
                                            :disabled="userType == 0"
                                            size="small"
                                            v-model="editForm.nickName"
                                            :maxlength="16"
                                            type="text"
                                            :placeholder="
                                                $t('common.input') +
                                                $t('userManage.nickName')
                                            "
                                            class="w-md"
                                            clearable
                                        ></el-input>
                                    </el-form-item>
                                    <!-- 手机号码 -->
                                    <el-form-item
                                        :label="$t('userManage.phoneNo') + ':'"
                                        prop="phoneNo"
                                    >
                                        <el-input
                                            size="small"
                                            v-model="editForm.phoneNo"
                                            type="text"
                                            :placeholder="
                                                $t('common.input') +
                                                $t('userManage.phoneNo')
                                            "
                                            class="w-md"
                                            :disabled="
                                                modalType == -1 ? false : true
                                            "
                                            :clearable="modalType == -1"
                                        ></el-input>
                                    </el-form-item>
                                    <input type="hidden" />
                                    <!-- 密码 -->
                                    <el-form-item
                                        :label="
                                            $t('userManage.password') + ':'
                                        "
                                        prop="password"
                                    >
                                        <el-input
                                            v-if="userManageDialogVisible"
                                            :disabled="modalType == 0"
                                            v-model.trim="editForm.password"
                                            ref="passwordInput"
                                            show-password
                                            :placeholder="
                                                $t('common.input') +
                                                $t('userManage.password')
                                            "
                                            @input="changePsd"
                                            class="w-md"
                                            :maxlength="20"
                                            clearable
                                            auto-complete="new-password"
                                        ></el-input>
                                        <el-button
                                            style="
                                                position: absolute;
                                                right: 0;
                                                top: 8px;
                                            "
                                            v-if="modalType == 0"
                                            type="text"
                                            @click="resetPwd(editForm.id)"
                                        >
                                            <!-- 重置 -->
                                            {{ $t("userManage.reset") }}
                                        </el-button>
                                    </el-form-item>
                                    <!-- 确认密码 -->
                                    <el-form-item
                                        :label="
                                            $t('userManage.confirmPassword') +
                                            ':'
                                        "
                                        prop="password2"
                                    >
                                        <el-input
                                            v-if="userManageDialogVisible"
                                            :disabled="modalType == 0"
                                            v-model.trim="editForm.password2"
                                            :maxlength="20"
                                            show-password
                                            class="w-md"
                                            @input="changePsd"
                                            :placeholder="
                                                $t(
                                                    'userManage.confirmPasswordPlaceholder'
                                                )
                                            "
                                            clearable
                                        >
                                        </el-input>
                                    </el-form-item>
                                    <!-- 启用状态 -->
                                    <el-form-item
                                        :label="
                                            $t('userManage.enableStatus') + ':'
                                        "
                                        prop="isFreezed"
                                    >
                                        <el-radio-group
                                            size="small"
                                            v-model="editForm.isFreezed"
                                        >
                                            <el-radio :label="0">
                                                <!-- 启用 -->
                                                {{
                                                    $t(
                                                        "userManage.isFreezedMsg2"
                                                    )
                                                }}
                                            </el-radio>
                                            <el-radio :label="1">
                                                <!-- 停用 -->
                                                {{
                                                    $t(
                                                        "userManage.isFreezedMsg3"
                                                    )
                                                }}
                                            </el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <!-- 是否为装车师傅账号 -->
                                    <el-form-item
                                        :label="
                                            $t(
                                                'userManage.loadingMasterAccount'
                                            ) + ':'
                                        "
                                        prop="userIdentityType"
                                    >
                                        <el-radio-group
                                            size="small"
                                            v-model="editForm.userIdentityType"
                                        >
                                            <el-radio :label="0">
                                                <!-- 否 -->
                                                {{ $t("common.not") }}
                                            </el-radio>
                                            <el-radio :label="1">
                                                <!-- 是 -->
                                                {{ $t("common.yes") }}
                                            </el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="form-box">
                                <div>
                                    <!-- 安全信息 -->
                                    {{ $t("userManage.securityInformation") }}
                                </div>
                                <div>
                                    <!-- 账户有效期 -->
                                    <el-form-item
                                        :label="
                                            $t(
                                                'userManage.accountValidityPeriod'
                                            ) + ':'
                                        "
                                        prop="accountValidityPeriod"
                                    >
                                        <el-date-picker
                                            v-model="
                                                editForm.accountValidityPeriod
                                            "
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            :placeholder="$t('common.select')"
                                        >
                                        </el-date-picker>
                                        <div class="alarm-msg">
                                            <i class="el-icon-warning"></i>
                                            <!-- 账号过期后将无法登录 -->
                                            {{
                                                $t(
                                                    "userManage.accountValidityPeriodWarning"
                                                )
                                            }}
                                        </div>
                                    </el-form-item>
                                    <el-form-item
                                        v-if="
                                            (modalType == -1 ||
                                                (modalType !== -1 &&
                                                    editForm.createId)) &&
                                            (subType == 2 ||
                                                subType == 3 ||
                                                (subType == 1 &&
                                                    modalType !== -1 &&
                                                    userId !==
                                                        editForm.createId))
                                        "
                                        label=""
                                        prop="seeSameLevel"
                                    >
                                        <span style="padding-right: 4px">
                                            <!-- 允许查看同级账号下防转网数据 -->
                                            {{ $t("userManage.allowViewing") }}
                                            :
                                        </span>
                                        <el-radio-group
                                            size="small"
                                            v-model="editForm.seeSameLevel"
                                        >
                                            <el-radio :label="0">
                                                <!-- 否 -->
                                                {{ $t("common.not") }}
                                            </el-radio>
                                            <el-radio :label="1">
                                                <!-- 是 -->
                                                {{ $t("common.yes") }}
                                            </el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="form-box">
                                <div>
                                    <!-- 登录限制 -->
                                    {{ $t("userManage.loginRestriction") }}
                                </div>
                                <div>
                                    <!-- 登录方式 -->
                                    <el-form-item
                                        :label="
                                            $t('userManage.loginTypeSupport') +
                                            ':'
                                        "
                                        prop="loginTypeSupportList"
                                    >
                                        <el-checkbox-group
                                            v-model="
                                                editForm.loginTypeSupportList
                                            "
                                            style="width: 320px"
                                            @change="loginTypeChange"
                                        >
                                            <el-checkbox
                                                v-for="item in loginTypeSupportArray"
                                                :key="item.id"
                                                :label="item.sysDictCode"
                                                >{{
                                                    item.sysDictName
                                                }}</el-checkbox
                                            >
                                        </el-checkbox-group>
                                    </el-form-item>
                                    <!-- 认证方式 -->
                                    <el-form-item
                                        class="login-auth"
                                        :label="
                                            $t(
                                                'userManage.loginAuthTypeSupport'
                                            ) + ':'
                                        "
                                        prop="loginAuthTypeSupportList"
                                    >
                                        <el-checkbox-group
                                            v-model="
                                                editForm.loginAuthTypeSupportList
                                            "
                                        >
                                            <el-checkbox
                                                :class="
                                                    !editForm.loginTypeSupportList.includes(
                                                        'WEB'
                                                    ) &&
                                                    item.sysDictCode ===
                                                        'appScanQR'
                                                        ? 'hide'
                                                        : ''
                                                "
                                                v-for="item in loginAuthTypeSupportArray"
                                                :key="item.id"
                                                :label="item.sysDictCode"
                                                >{{
                                                    item.sysDictName
                                                }}</el-checkbox
                                            >
                                        </el-checkbox-group>
                                    </el-form-item>
                                    <!-- 是否允许登录 -->
                                    <el-form-item
                                        :label="
                                            $t('userManage.enablePlatform') +
                                            ':'
                                        "
                                        prop="enablePlatform"
                                        v-if="authorityCenter"
                                    >
                                        <el-checkbox-group
                                            v-model="editForm.enablePlatform"
                                        >
                                            <el-checkbox :label="1">
                                                <!-- 车辆授权中心 -->
                                                {{
                                                    $t(
                                                        "userManage.vehicleAuthorizationCenter"
                                                    )
                                                }}
                                            </el-checkbox>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="select-role"
                        v-if="
                            modalType === -1 ||
                            (modalType !== -1 && userId === editForm.createId)
                        "
                    >
                        <h2>
                            <!-- 选择角色 -->
                            {{ $t("userManage.selectCharacter") }}
                        </h2>
                        <div class="select-role-box">
                            <div class="role-permission">
                                <div class="add-role">
                                    <span>
                                        <!-- 选择角色 -->
                                        {{ $t("userManage.selectCharacter") }}
                                        <span
                                            v-if="
                                                editForm.roleIds.length &&
                                                allRoleList.length
                                            "
                                            >({{
                                                editForm.roleIds.length
                                            }})</span
                                        >
                                        <!-- 可选择多个角色，权限取并集 -->
                                        <el-tooltip
                                            class="item"
                                            effect="dark"
                                            :content="
                                                $t(
                                                    'userManage.selectCharacterMsg1'
                                                )
                                            "
                                        >
                                            <i
                                                class="el-icon-warning"
                                            ></i> </el-tooltip></span
                                    ><el-button
                                        type="text"
                                        @click="addRole"
                                        v-btn="'userManageAddRole'"
                                    >
                                        <!-- 添加角色 -->
                                        {{ $t("userManage.addRole") }}
                                    </el-button>
                                </div>
                                <el-form-item label="" prop="roleIds">
                                    <div class="role-box-div">
                                        <div class="search-box">
                                            <el-input
                                                v-model="roleSearchKey"
                                                :placeholder="
                                                    $t('userManage.selectRole')
                                                "
                                                clearable
                                                @input="searchRole"
                                            ></el-input>
                                        </div>
                                        <div class="role-scroll">
                                            <el-checkbox-group
                                                class="role-checkbox"
                                                v-model="editForm.roleIds"
                                                @change="roleIdsChange"
                                                v-if="allRoleList.length"
                                            >
                                                <el-checkbox
                                                    v-for="item in allRoleList"
                                                    :key="item.id"
                                                    :label="item.id"
                                                    >{{
                                                        item.name
                                                    }}</el-checkbox
                                                >
                                            </el-checkbox-group>
                                            <el-empty
                                                v-else
                                                :image="emptyImage"
                                                :image-size="56"
                                                :description="
                                                    allRoleListCopy &&
                                                    allRoleListCopy.length
                                                        ? $t('common.noData')
                                                        : $t(
                                                              'userManage.selectCharacterMsg2'
                                                          )
                                                "
                                            ></el-empty>
                                        </div>
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="platform-permission">
                                <div class="add-role">
                                    <span>
                                        <!-- 平台权限预览 -->
                                        {{
                                            $t(
                                                "userManage.platformPermissionPreview"
                                            )
                                        }}
                                    </span>
                                </div>
                                <div class="tree-box">
                                    <el-tree
                                        :data.sync="modelList"
                                        node-key="id"
                                        :highlight-current="false"
                                        :default-expand-all="true"
                                        :props="defaultProps"
                                        ref="simpleTree"
                                        simple-data
                                        show-checkbox
                                    ></el-tree>
                                </div>
                            </div>
                            <div class="platform-permission">
                                <div class="add-role">
                                    <span>
                                        <!-- APP权限预览 -->
                                        {{
                                            $t(
                                                "userManage.appPermissionPreview"
                                            )
                                        }}
                                    </span>
                                </div>
                                <div class="tree-box">
                                    <el-tree
                                        :data.sync="appList"
                                        node-key="id"
                                        :highlight-current="false"
                                        :default-expand-all="true"
                                        :props="defaultProps"
                                        ref="appTree"
                                        simple-data
                                        show-checkbox
                                    ></el-tree>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 2：车队长，  车队长不显示资源树 -->
                    <div
                        class="select-group"
                        v-if="
                            dataPermission != 2 &&
                            (modalType === -1 ||
                                (modalType !== -1 &&
                                    userId === editForm.createId))
                        "
                    >
                        <h2>
                            <!-- 管理权限 -->
                            {{ $t("userManage.administrativePrivileges") }}
                        </h2>
                        <div class="add-role">
                            <span>
                                <!-- 资源权限 -->
                                {{ $t("userManage.resourcePermissions") }}

                                <!-- 勾选组织后，组织内新增车辆默认授权，无需二次维护 -->
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    :content="
                                        $t('userManage.resourcePermissionsMsg')
                                    "
                                >
                                    <i class="el-icon-warning"></i> </el-tooltip
                            ></span>
                        </div>
                        <el-form-item label="" prop="groupIds">
                            <div class="group-tree">
                                <div class="organization-tree-search">
                                    <el-input
                                        v-model="organizationName"
                                        :placeholder="
                                            $t('common.inputOrganizationName')
                                        "
                                        clearable
                                    >
                                    </el-input>
                                </div>
                                <div class="tree-box">
                                    <el-tree
                                        ref="tree"
                                        :data="treeData"
                                        show-checkbox
                                        :default-expanded-keys="expandedList"
                                        :filter-node-method="filterNode"
                                        node-key="id"
                                        :default-checked-keys="
                                            editForm.groupIds
                                        "
                                        @check="treeCheck"
                                        :props="defaultProps2"
                                    ></el-tree>
                                </div>
                            </div>
                        </el-form-item>
                    </div>
                </el-form>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="close">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button type="primary" :loading="loading" @click="doSave()">
                    <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </span>
        </el-dialog>
        <RoleDialog
            :append-to-body="true"
            :dialogVisible="dialogVisible"
            :roleInfo="{}"
            :modalType="'add'"
            @close="closeAddRole"
            @getRoleList="getRoleList"
        ></RoleDialog>
    </div>
</template>

<script>
import {
    checkStrong,
    validatePhoneNo,
    validateNumberAndEnglishStartWithEnglish,
    validateExpectSpecial,
    validateNumLetterSpecial,
} from "@/utils/validate";
import { validateSpecial } from "@/utils/validate";
import RoleDialog from "./roleDialog";
import { debounce } from "@/utils/controlFn.js";
import { mapGetters } from "vuex";
import waterMark from "@/utils/waterMark";
export default {
    props: {
        userManageDialog: {
            type: Boolean,
            default: false,
        },
        modalType: {
            type: Number,
            default: 0,
        },
        userType: {
            type: Number,
            default: 0,
        },
        userId: {
            type: Number,
            default: 0,
        },
    },
    components: { RoleDialog },
    watch: {
        userManageDialog: {
            handler(val) {
                this.userManageDialogVisible = val;
                if (val) {
                    this.roleSearchKey = "";
                    this.organizationName = "";
                    this.getDictionList();
                    this.getAllModelList();
                    this.newLoginUserAppPermission();
                    // this.getAllAppPermissionsInfoList();
                    this.getAllOrganizeTree();
                    this.allRoleList = [];
                    this.allRoleListCopy = [];
                    if (this.modalType == -1) {
                        this.getRoleList();
                    } else {
                        waterMark.set();
                    }
                }
            },
            deep: true,
        },
        organizationName(val) {
            this.filterTree(this.treeData, val, 0);
            this.$nextTick(() => {
                this.$refs.tree.filter("show", !this.organizationName);
                if (!val) {
                    const nodes = this.$refs.tree.store._getAllNodes();
                    nodes.forEach((item) => {
                        item.expanded = true;
                    });
                }
            });
        },
    },
    data() {
        const checkSpeccial = (rule, value, callback) => {
            if (value != undefined && value.length > 0) {
                if (validateSpecial(value)) {
                    // 请勿输入字符
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
        const validatePassCheck = (rule, value, callback) => {
            if (value == "") {
                // 密码不能为空
                callback(new Error(this.$t("userManage.checkPassStrong1")));
            } else if (value != this.editForm.password) {
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
        const checkPhone = (rule, value, callback) => {
            if (value) {
                if (value.length == 11 && validatePhoneNo(value)) {
                    callback();
                } else {
                    // 不是有效的手机号码
                    callback(
                        new Error(
                            this.$t("userManage.userManageDialogFormMsg1")
                        )
                    );
                }
            } else {
                callback();
            }
        };
        const checkName = (rule, value, callback) => {
            if (value) {
                if (validateNumberAndEnglishStartWithEnglish(value)) {
                    callback();
                } else {
                    callback(
                        // 账户名只允许输入英文、数字、下划线和@
                        new Error(
                            this.$t("userManage.userManageDialogFormMsg2")
                        )
                    );
                }
            } else {
                // 账户名不能为空
                callback(
                    new Error(this.$t("userManage.userManageDialogFormMsg3"))
                );
            }
        };
        const checkNickName = (rule, value, callback) => {
            if (value) {
                if (validateExpectSpecial(value)) {
                    callback();
                } else {
                    // 姓名只允许输入中英文和数字
                    callback(
                        new Error(
                            this.$t("userManage.userManageDialogFormMsg4")
                        )
                    );
                }
            } else {
                callback();
            }
        };
        const treeValite = (rule, value, callback) => {
            if (this.dataPermission == 2) {
                callback();
            } else {
                this.$nextTick(() => {
                    if (
                        this.editForm.groupIds &&
                        this.editForm.groupIds.length
                    ) {
                        callback();
                    } else {
                        // 资源权限不能为空
                        callback(
                            new Error(
                                this.$t("userManage.userManageDialogFormMsg5")
                            )
                        );
                    }
                });
            }
        };
        return {
            emptyImage: require("@/assets/images/icon_empty.png"),
            userManageDialogVisible: this.userManageDialog,
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
                userIdentityType: 0,
                enablePlatform: [],
            },
            appModelList: [],
            actLevel: 0,
            passLevel: 3,
            channelList: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            ], // 通道
            formValidate: {
                name: [
                    {
                        required: true,
                        // message: "账户名不能为空",
                        message: this.$t("userManage.userManageDialogFormMsg3"),
                        trigger: "blur",
                    },
                    {
                        type: "string",
                        min: 4,
                        max: 16,
                        // message: "账户名长度不能小于4个字符，大于16个字符",
                        message: this.$t("userManage.userManageDialogFormMsg6"),
                        trigger: "blur",
                    },
                    { validator: checkName, trigger: "blur" },
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
                        // message: "确认密码不能为空",
                        message: this.$t("userManage.checkPassStrong6"),
                        trigger: "blur",
                    },
                    {
                        type: "string",
                        min: 8,
                        max: 20,
                        // message: "确认密码长度必须在8~20个字符以内",
                        message: this.$t("userManage.checkPassStrong7"),
                        trigger: "blur",
                    },
                    { validator: validatePassCheck, trigger: "blur" },
                ],
                nickName: [
                    {
                        required: true,
                        // message: "姓名不能为空",
                        message: this.$t("userManage.userManageDialogFormMsg7"),
                        trigger: "blur",
                    },
                    {
                        min: 1,
                        max: 16,
                        // message: "姓名不能超过16个字符",
                        message: this.$t("userManage.userManageDialogFormMsg8"),
                        trigger: "blur",
                    },
                    { validator: checkNickName, trigger: "blur" },
                    { validator: checkSpeccial, trigger: "change" },
                ],
                phoneNo: [
                    {
                        required: true,
                        type: "string",
                        // message: "手机号码不能为空",
                        message: this.$t("userManage.userManageDialogFormMsg9"),
                        trigger: "blur",
                    },
                    {
                        validator: checkPhone,
                        // message: "不是有效的手机号码",
                        message: this.$t("userManage.userManageDialogFormMsg1"),
                        trigger: "blur",
                    },
                ],
                roleIds: [
                    {
                        required: true,
                        type: "array",
                        // message: "选择角色不能为空",
                        message: this.$t(
                            "userManage.userManageDialogFormMsg10"
                        ),
                        trigger: "blur",
                    },
                ],
                isFreezed: [
                    {
                        required: true,
                        type: "number",
                        // message: "启用状态不能为空",
                        message: this.$t(
                            "userManage.userManageDialogFormMsg11"
                        ),
                        trigger: "blur",
                    },
                ],
                groupIds: {
                    required: true,
                    validator: treeValite,
                    trigger: "change",
                },
                loginTypeSupportList: [
                    {
                        required: true,
                        type: "array",
                        // message: "登录方式不能为空",
                        message: this.$t(
                            "userManage.userManageDialogFormMsg12"
                        ),
                        trigger: "blur",
                    },
                ],
                loginAuthTypeSupportList: [
                    {
                        required: true,
                        type: "array",
                        // message: "认证方式不能为空",
                        message: this.$t(
                            "userManage.userManageDialogFormMsg13"
                        ),
                        trigger: "blur",
                    },
                ],
            },
            subType: localStorage.getItem("userSubType"),
            dataPermission: localStorage.getItem("dataPermission"),
            loginTypeSupportArray: [],
            loginAuthTypeSupportArray: [],
            allRoleList: [],
            allRoleListCopy: [],
            modelList: [],
            defaultProps: {
                children: "children",
                label: "name",
            },
            defaultProps2: {
                children: "children",
                label: "name",
                disabled: "forbidden",
            },
            dialogVisible: false,
            treeData: [],
            expandedList: [],
            loading: false,
            roleSearchKey: "",
            organizationName: "",
            appList: [],
            editAppArr: [],
        };
    },
    computed: {
        ...mapGetters(["authorityCenter"]),
    },
    mounted() {},
    methods: {
        filterTree(data, val, type) {
            data.forEach((item) => {
                if (item.name.indexOf(val) !== -1) {
                    // item.show = true;
                    this.$set(item, "show", true);
                    this.itemChildren(item);
                } else {
                    this.$set(item, "show", false);
                    if (item.children.length > 0) {
                        this.filterTree(
                            item.children,
                            this.organizationName,
                            1
                        );
                    }
                }
            });
        },
        itemChildren(val) {
            if (val.children.length > 0) {
                val.children.forEach((item) => {
                    item.show = true;
                    if (item.children.length > 0) {
                        this.itemChildren(item);
                    }
                });
            }
        },
        filterNode(value, data) {
            return data[value];
        },
        // 关闭弹窗
        close() {
            this.userManageDialogVisible = false;
            this.$emit("update:userManageDialog", false);
            waterMark.clear();
            setTimeout(() => {
                this.formReset();
            }, 300);
        },
        setDefaultValue() {
            this.editForm.loginTypeSupportList =
                this.loginTypeSupportArray.reduce((prev, cur) => {
                    return prev.concat(cur["sysDictCode"]);
                }, []);
            this.editForm.loginAuthTypeSupportList =
                this.loginAuthTypeSupportArray.reduce((prev, cur) => {
                    return prev.concat(cur["sysDictCode"]);
                }, []);
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
        getRoleList() {
            this.$api.getRoleList().then((res) => {
                if (res.success == true) {
                    this.allRoleList = res.data;
                    this.allRoleListCopy = res.data;
                    this.$nextTick(() => {
                        if (this.modalType !== -1) {
                            this.editForm.roleIds =
                                this.editForm.roleIds.filter((item) =>
                                    this.allRoleList.find(
                                        (value) => value.id === item
                                    )
                                );
                        }
                        this.roleIdsChange(this.editForm.roleIds);
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        changePsd() {
            this.$forceUpdate();
        },
        disabledFn(treeData) {
            // 采用遍历+递归设置disabled:true
            treeData.forEach((item) => {
                this.$set(item, "disabled", true);
                if (item.children) {
                    this.disabledFn(item.children);
                }
            });
        },
        // 获取平台配置数据
        getAllModelList() {
            this.modelList = [];
            this.$api.getAllModelList().then((res) => {
                if (res.success == true) {
                    this.modelList = res.data;
                    this.disabledFn(this.modelList);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        roleIdsChange(val) {
            let arr = [];
            val.forEach((item) => {
                let obj = this.allRoleList.find((k) => k.id === item);
                if (obj) {
                    arr = [
                        ...new Set([
                            ...arr,
                            ...this.allRoleList.find((k) => k.id === item)
                                .modelIds,
                        ]),
                    ];
                }
            });
            this.$refs.simpleTree && this.$refs.simpleTree.setCheckedKeys(arr);
            this.$refs.appTree && this.$refs.appTree.setCheckedKeys([]);
            this.getAppPermissionByRoleId(val);
        },
        // 获取app配置数据
        getAllAppPermissionsInfoList() {
            this.appModelList = [];
            this.$api.getAllAppPermissionsInfoList().then((res) => {
                if (res.success == true) {
                    this.appModelList = res.data;
                    for (let i of this.appModelList) {
                        for (let j of i.children) {
                            this.$set(j, "checkList", []);
                        }
                    }
                    this.getLoginUserAppPermission();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 获取当前用户的APP权限（web使用）
        newLoginUserAppPermission() {
            this.$api.newLoginUserAppPermission().then((res) => {
                if (res.success == true) {
                    this.appList = res.data;
                    this.disabledFn(this.appList);
                } else {
                    this.boxloading = false;
                    this.$message.error(res.msg);
                }
            });
        },
        getLoginUserAppPermission() {
            this.$api.getLoginUserAppPermission().then((res) => {
                if (res.success == true) {
                    for (let i of this.appModelList) {
                        for (let j of i.children) {
                            for (let k of res.data.appPermissionsVoList) {
                                if (k.id == j.id) {
                                    // 下拉
                                    if (j.hasChannel == 1) {
                                        this.$set(
                                            j,
                                            "optionList",
                                            j.optionList && j.optionList.length
                                                ? [
                                                      ...new Set([
                                                          ...j.optionList,
                                                          ...k.channelNoList,
                                                      ]),
                                                  ]
                                                : k.channelNoList
                                        );
                                    } else {
                                        // // switch
                                        // j.isCheck=true
                                        this.$set(j, "isShow", true);
                                    }
                                }
                            }
                        }
                    }
                    this.appModelList.forEach((item) => {
                        item.isShow = 0;
                        item.children.forEach((k) => {
                            if (k.hasChannel == 1) {
                                item.isShow +=
                                    k.optionList && k.optionList.length ? 1 : 0;
                            } else {
                                item.isShow += k.isShow ? 1 : 0;
                            }
                        });
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        getAppPermissionByRoleId(val) {
            this.editAppArr = [];
            val.forEach((roleId) => {
                this.$api
                    .newAppPermissionByRoleId({ roleId: roleId })
                    .then((res) => {
                        if (res.success == true) {
                            this.editAppArr = [
                                ...new Set([...this.editAppArr, ...res.data]),
                            ];
                            this.$nextTick(() => {
                                this.$refs.appTree.setCheckedKeys(
                                    this.editAppArr
                                );
                            });
                        } else {
                            _this.$message.error(res.msg);
                        }
                    });
            });
        },
        addRole() {
            this.dialogVisible = true;
        },
        closeAddRole() {
            this.dialogVisible = false;
        },
        treeCheck() {
            this.editForm.groupIds = this.$refs.tree.getCheckedKeys();
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
        getAllOrganizeTree() {
            this.treeData = [];
            this.expandedList = [];
            this.$api.getAllOrganizeTree().then((res) => {
                if (res.success == true) {
                    if (res.data.length) {
                        if (this.userType == 0) {
                            this.addDisabled(res.data, true);
                        } else {
                            this.addDisabled(res.data, false);
                        }
                    }
                    this.treeData = res.data;
                    this.$nextTick(() => {
                        this.treeData.forEach((m) => {
                            this.expandedList.push(m.id);
                        });
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        resetPwd() {
            this.$emit("resetPwd", this.editForm.id);
        },
        formReset() {
            this.editForm = {
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
                enablePlatform: [],
                userIdentityType: 0,
            };
            this.$refs.simpleTree && this.$refs.simpleTree.setCheckedKeys([]);
            this.$refs.appTree && this.$refs.appTree.setCheckedKeys([]);
            this.getAppPermissionByRoleId([]);
            if (this.$refs.tree) {
                this.$refs.tree.setCheckedKeys([]);
            }
            this.$refs.editForm.resetFields();
        },
        getEditForm(id) {
            this.$api.getUserDetail(id).then((res) => {
                if (res.success == true) {
                    res.data.password = "Aa345678";
                    res.data.password2 = "Aa345678";
                    this.loading = false;
                    this.editForm = { ...res.data, enablePlatform: [] };
                    if (res.data.authorityCenter) {
                        this.editForm.enablePlatform.push(1);
                    }
                    this.dataPermission = res.data.dataPermission;
                    if (this.editForm.roleIds.indexOf(1) >= 0) {
                        //开发者角色
                        this.editForm.isTenant = true;
                    }
                    if (this.modalType !== -1) {
                        this.getRoleList();
                    }
                } else {
                    this.loading = false;
                    this.$message.error(res.msg);
                }
            });
        },
        doSave() {
            this.$refs.editForm.validate((valid, obj) => {
                if (valid) {
                    this.loading = true;
                    if (this.modalType == -1) {
                        let sha256 = require("js-sha256").sha256;
                        let form = JSON.parse(JSON.stringify(this.editForm));
                        form.authorityCenter =
                            form.enablePlatform.indexOf(1) > -1 ? 1 : 0;
                        delete form.enablePlatform;
                        form.password = sha256(this.editForm.password);
                        form.password2 = sha256(this.editForm.password2);
                        // 添加
                        this.$api
                            .addUser(form)
                            .then((res) => {
                                if (res.success == true) {
                                    this.loading = false;
                                    this.editModal = false;
                                    this.$message.success(
                                        this.$t("userManage.addUserSuccess")
                                    );
                                    this.close();
                                    this.$emit("search");
                                } else {
                                    this.loading = false;
                                    this.$message.error(res.msg);
                                }
                            })
                            .catch(() => {
                                this.loading = false;
                            });
                    } else if (this.modalType == 0) {
                        // 编辑用户
                        let editForm = JSON.parse(
                            JSON.stringify(this.editForm)
                        );
                        editForm.authorityCenter =
                            editForm.enablePlatform.indexOf(1) > -1 ? 1 : 0;
                        delete editForm.enablePlatform;
                        delete editForm.password;
                        delete editForm.password2;
                        this.$api
                            .updateUser(editForm)
                            .then((res) => {
                                if (res.success == true) {
                                    this.loading = false;
                                    this.editModal = false;
                                    this.$message.success(
                                        this.$t("userManage.editUserSuccess")
                                    );
                                    this.close();
                                    this.$emit("search");
                                } else {
                                    this.loading = false;
                                    this.$message.error(res.msg);
                                }
                                setTimeout(() => {
                                    this.dataPermission =
                                        localStorage.getItem("dataPermission");
                                }, 10);
                            })
                            .catch(() => {
                                this.loading = false;
                            });
                    }
                } else if (obj.roleIds) {
                    // 选择角色不能为空
                    this.$message.error(
                        this.$t("userManage.userManageDialogFormMsg10")
                    );
                } else if (obj.groupIds) {
                    // 资源权限不能为空
                    this.$message.error(
                        this.$t("userManage.userManageDialogFormMsg5")
                    );
                }
            });
        },
        searchRole() {
            debounce(this.filterRole, this.roleSearchKey ? 500 : 0);
        },
        filterRole() {
            if (!this.roleSearchKey) {
                this.allRoleList = JSON.parse(
                    JSON.stringify(this.allRoleListCopy)
                );
            } else {
                this.allRoleList = this.allRoleListCopy.filter((item) => {
                    return (
                        item.name
                            .toLowerCase()
                            .indexOf(this.roleSearchKey.toLowerCase()) > -1
                    );
                });
            }
        },
        loginTypeChange(val) {
            if (!val.includes("WEB")) {
                this.editForm.loginAuthTypeSupportList =
                    this.editForm.loginAuthTypeSupportList.filter(
                        (item) => item !== "appScanQR"
                    );
            }
        },
    },
};
</script>

<style lang="less" scoped>
.user-manage-content {
    max-height: calc(~"100vh - 250px");
    overflow-y: auto;
    background: #f4f4f4;
    h2 {
        font-size: 16px;
        font-weight: 600;
        padding: 16px 0;
        border-bottom: 1px solid #d7dde4;
    }
    /deep/.basic-msg {
        padding: 0 20px;
        background: #ffffff;
        .edit-form {
            padding-top: 20px;
            .el-form-item__label {
                line-height: 32px;
            }
        }
        .el-form-item__content {
            width: 320px;
            .el-input {
                width: 280px;
            }
        }
        .form-box {
            display: flex;
            justify-content: flex-start;
            & > div:nth-child(1) {
                width: 72px;
                font-weight: 600;
                line-height: 32px;
            }
            & > div:nth-child(2) {
                flex: 1;
            }
        }
        .login-auth {
            .el-form-item__content {
                width: 500px !important;
            }
        }
        .alarm-msg {
            color: #ffa900;
        }
    }
    .add-role {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
    }
    /deep/.select-role {
        margin-top: 16px;
        padding: 0 20px 20px;
        background: #ffffff;
        .select-role-box {
            margin-top: 16px;
            display: flex;
        }
        .el-checkbox__input.is-disabled + span.el-checkbox__label {
            color: #606266;
        }
        .role-permission {
            margin-right: 16px;
            width: 400px;
            & > .el-form-item {
                width: 100%;
                & > .el-form-item__content {
                    width: 100%;
                    .el-input__inner {
                        border-color: #dcdfe6 !important;
                    }
                }
            }

            .role-box-div {
                border: 1px solid #d7dde4 !important;
                height: 500px;
                .search-box {
                    padding: 8px 16px;
                    border-bottom: 1px solid #d7dde4;
                }
                .role-scroll {
                    height: 450px;
                    overflow-y: auto;
                    padding: 8px 16px;
                }
                .role-checkbox {
                    .el-checkbox {
                        position: relative;
                        display: flex;
                        align-items: center;
                        width: 100%;
                        margin-right: 0px;
                        border: 1px solid #d7dde4 !important;
                        padding: 8px;
                        margin-bottom: 8px;
                    }
                    .el-checkbox__input {
                        position: absolute;
                        right: 18px;
                        top: 10px;
                    }
                }
            }
        }
        .platform-permission {
            width: 500px;
            margin-right: 16px;
            .tree-box {
                border: 1px solid #d7dde4 !important;
                height: 500px;
                overflow-y: auto;
            }
        }
        .app-permission {
            flex: 1;
            .el-switch {
                height: 32px;
            }
            .permission-box {
                padding: 0 16px;
                border: 1px solid #d7dde4 !important;
                height: 500px;
                overflow-y: auto;
                padding-bottom: 20px;
            }
        }
    }
    .select-group {
        margin-top: 16px;
        padding: 0 20px;
        background: #ffffff;
        .add-role {
            margin-top: 16px;
        }
        .group-tree {
            border: 1px solid #d7dde4 !important;
            width: 400px;
            height: 500px;
            /deep/.organization-tree-search {
                padding: 8px 16px;
                border-bottom: 1px solid #d7dde4;
                .el-input__inner {
                    border-color: #dcdfe6 !important;
                }
            }
            .tree-box {
                height: 449px;
                overflow-y: auto;
            }
        }
    }
}
/deep/.role-dialog-select {
    .el-tag {
        .el-tag__close {
            display: none;
        }
    }
}
</style>
<style lang="less">
.user-manage-dialog {
    .el-dialog__body {
        padding: 0px;
    }
    .app-hide {
        display: none;
    }
}
.user-manage-option-box {
    height: 100%;
    overflow-y: auto;
    .el-select-dropdown__item {
        display: none;
    }
    .selected {
        display: block !important;
    }
}
</style>
