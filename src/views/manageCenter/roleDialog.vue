<template>
    <div>
        <!-- :title="modalType === 'add' ? '添加角色' : '编辑角色'" -->
        <el-dialog
            :title="
                modalType === 'add'
                    ? $t('roleManage.addRole')
                    : $t('roleManage.editRole')
            "
            :visible.sync="roleDialogVisible"
            class="role-dialog"
            @close="close"
            :append-to-body="appendToBody"
        >
            <div v-loading="boxloading">
                <el-form
                    ref="formData"
                    :model="formData"
                    inline
                    :rules="formdataValidate"
                    class="p-t-sm"
                >
                    <!-- 角色名称 -->
                    <el-form-item
                        :label="$t('roleManage.roleName')"
                        prop="name"
                        required-right
                    >
                        <el-input
                            size="small"
                            v-model="formData.name"
                            :placeholder="$t('common.input')"
                            :maxlength="20"
                            clearable
                            style="width: 350px"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <el-tabs v-model="activeName" class="role-dialog-tab">
                    <!-- 平台权限 -->
                    <el-tab-pane
                        :label="$t('roleManage.platformPermission')"
                        name="model"
                    >
                        <el-input
                            class=""
                            v-model="organizationName"
                            :placeholder="$t('common.input')"
                            clearable
                        >
                            <i
                                slot="suffix"
                                @click="filterTree"
                                class="el-input__icon el-icon-search"
                            ></i>
                        </el-input>
                        <div style="height: 468px; overflow-y: auto">
                            <el-tree
                                :data.sync="modelList"
                                node-key="id"
                                :highlight-current="false"
                                :default-expand-all="true"
                                :props="defaultProps"
                                :filter-node-method="filterNode"
                                :default-checked-keys="editArr"
                                ref="simpleTree"
                                simple-data
                                style="height: 468px"
                                show-checkbox
                                @check="orgCheck"
                                @check-change="orgCheckChange"
                            ></el-tree>
                            <!-- :check-strictly="true"
                                @check="orgCheck" -->
                        </div>
                    </el-tab-pane>
                    <!-- APP权限 -->
                    <el-tab-pane
                        :label="$t('roleManage.appPermission')"
                        name="app"
                    >
                        <el-input
                            class=""
                            v-model="appName"
                            :placeholder="$t('common.input')"
                            clearable
                        >
                            <i
                                slot="suffix"
                                @click="filterTree"
                                class="el-input__icon el-icon-search"
                            ></i>
                        </el-input>
                        <div style="height: 468px; overflow-y: auto">
                            <el-tree
                                :data.sync="appList"
                                node-key="id"
                                :highlight-current="false"
                                :default-expand-all="true"
                                :props="defaultProps"
                                :filter-node-method="filterNode2"
                                :default-checked-keys="editAppArr"
                                ref="appTree"
                                simple-data
                                style="height: 468px"
                                show-checkbox
                            ></el-tree>
                            <!-- :check-strictly="true"
                                @check="orgCheck" -->
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="close">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button type="primary" @click="doSave()" :loading="loading">
                     <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { validateExpectSpecial, validateSpecial } from "@/utils/validate";
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
        },
        modalType: {
            type: String,
            default: "",
        },
        roleInfo: {
            type: Object,
            default: () => {},
        },
        appendToBody: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        organizationName(val) {
            this.filterTree(this.modelList, val, 0);
            this.$nextTick(() => {
                this.$refs.simpleTree.filter("show", !this.organizationName);
                // this.$nextTick(() => {
                //     this.editArr = JSON.parse(
                //         JSON.stringify(this.roleInfo.modelIds)
                //     );
                //     this.setCheckedKeys();
                // });
            });
        },
        appName(val) {
            this.$refs.appTree.filter(val);
            // this.filterTree(this.appList, val, 0);
            // this.$nextTick(() => {
            //     this.$refs.appTree.filter("show", !this.appName);
            //     this.$nextTick(() => {
            //         this.$nextTick(() => {
            //             this.$refs.appTree.setCheckedKeys(this.editAppArr);
            //         });
            //     });
            // });
        },
        dialogVisible: {
            handler(val) {
                this.boxloading = true;
                this.roleDialogVisible = val;
                if (val) {
                    this.organizationName = "";
                    this.loading = false;
                    this.formData.id = this.roleInfo.id;
                    this.formData.name = this.roleInfo.name;
                    this.checkedList = [];
                    this.copyList = [];
                    this.activeName = "model";
                    if (this.roleInfo.id) {
                        this.newAppPermissionByRoleId();
                    }
                    this.getAllModelList();
                    this.newLoginUserAppPermission();
                    this.$nextTick(() => {
                        if (this.roleInfo.modelIds) {
                            this.editArr = JSON.parse(
                                JSON.stringify(this.roleInfo.modelIds)
                            );
                        }
                    });
                } else {
                    this.$nextTick(() => {
                        this.editArr = [];
                    });
                }
            },
            deep: true,
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
        const checkName = (rule, value, callback) => {
            if (value) {
                if (validateExpectSpecial(value)) {
                    callback();
                } else {
                    // 角色名称只允许输入中文,英文和数字
                    callback(
                        new Error(this.$t("roleManage.checkRoleNameMsg1"))
                    );
                }
            } else {
                // 角色名称不能为空
                callback(new Error(this.$t("roleManage.checkRoleNameMsg2")));
            }
        };
        return {
            boxloading: false,
            roleDialogVisible: false,
            organizationName: "",
            loading: false,
            editArr: [],
            formData: {
                name: "",
                id: null,
            },
            formdataValidate: {
                name: [
                    {
                        required: true,
                        // message: "角色名称不能为空",
                        message: this.$t("roleManage.checkRoleNameMsg2"),
                        trigger: "blur",
                    },
                    {
                        type: "string",
                        min: 1,
                        max: 20,
                        // message: "角色名称长度不能超过20个字符",
                        message: this.$t("roleManage.checkRoleNameMsg3"),
                        trigger: "blur",
                    },
                    { validator: checkName, trigger: "blur" },
                    { validator: checkSpeccial, trigger: "change" },
                ],
            },
            defaultProps: {
                children: "children",
                label: "name",
            },
            activeName: "model",
            value1: true,
            select: [],
            checkedList: [],
            copyList: [], // 模拟剪贴板
            modelList: [], // 平台配置数据，接口获取
            channelList: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            ], // 通道
            appList: [],
            appName: "",
            editAppArr: [],
        };
    },
    methods: {
        // 获取平台配置数据
        getAllModelList() {
            this.$api.getAllModelList().then((res) => {
                if (res.success == true) {
                    this.modelList = res.data;
                    this.setParentNames(this.modelList);
                    // 平台配置数据初始化-编辑
                    // console.log(this.roleInfo,'this.roleInfo========')
                    if (this.roleInfo.modelIds) {
                        for (let i of this.modelList) {
                            for (let j of i.children) {
                                if (this.roleInfo.modelIds.includes(j.id)) {
                                    // j.isCheck=true;
                                    this.$set(j, "isCheck", true);
                                    this.checkedList.push(j.id);
                                } else {
                                    this.$set(j, "isCheck", false);
                                }
                            }
                        }
                    }
                    this.$nextTick(() => {
                        this.boxloading = false;
                    });
                    // console.log(this.modelList,'初始化=============')
                } else {
                    this.boxloading = false;
                    this.$message.error(res.msg);
                }
            });
        },
        // 获取当前用户的APP权限（web使用）
        newLoginUserAppPermission() {
            this.$api.newLoginUserAppPermission().then((res) => {
                if (res.success == true) {
                    this.appList = res.data;
                    this.boxloading = false;
                } else {
                    this.boxloading = false;
                    this.$message.error(res.msg);
                }
            });
        },
        // 根据roleId获取APP菜单权限（web使用）
        newAppPermissionByRoleId() {
            this.$api
                .newAppPermissionByRoleId({
                    roleId: this.roleInfo.id,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.editAppArr = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        setCheckedKeys() {
            this.$nextTick(() => {
                this.$refs.simpleTree.setCheckedKeys(this.editArr);
            });
        },
        filterNode(value, data) {
            return data[value];
        },
        filterNode2(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        filterTree(data, val, type) {
            data.forEach((item) => {
                if (item.name.indexOf(val) !== -1) {
                    this.$set(item, "show", true);
                    this.itemChildren(item);
                } else {
                    this.$set(item, "show", false);
                    if (item.children && item.children.length > 0) {
                        this.filterTree(item.children, val, 1);
                    }
                }
            });
        },
        itemChildren(val) {
            if (val.children && val.children.length > 0) {
                val.children.forEach((item) => {
                    item.show = true;
                    if (item.children && item.children.length > 0) {
                        this.itemChildren(item);
                    }
                });
            }
        },
        // 关闭弹窗
        close() {
            this.$emit("close", false);
        },
        handleNodeClick(data) {
            console.log(data);
        },
        setParentNames(nodes, id = null) {
            nodes.forEach((node) => {
                node.parentId = id;
                if (node.children && node.children.length > 0) {
                    this.setParentNames(node.children, node.id);
                }
            });
        },
        doSave() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    let modelDto = {
                        roleId: this.formData.id, // 角色id，编辑时需要加上
                        modelIds: this.$refs.simpleTree.getCheckedKeys(), // 平台权限的选择数组
                        appIds: this.$refs.appTree.getCheckedKeys(), // 平台权限的选择数组
                    };
                    let params = Object.assign({}, this.formData, modelDto);
                    // console.log(params,'验证成功');
                    // 添加-保存
                    if (this.modalType === "add") {
                        this.$api.addRole(params).then((res) => {
                            if (res.success == true) {
                                this.loading = false;
                                // 添加角色成功
                                this.$message.success(
                                    this.$t("roleManage.addRoleSuccess")
                                );
                                this.$emit("close", true);
                                this.$emit("getRoleList");
                            } else {
                                this.loading = false;
                                this.$message.error(res.msg);
                            }
                        });
                    } else if (this.modalType === "edit") {
                        this.$api.updateRole(params).then((res) => {
                            if (res.success == true) {
                                this.loading = false;
                                // 编辑角色成功
                                this.$message.success(
                                    this.$t("roleManage.editRoleSuccess")
                                );
                                this.$emit("close", true);
                            } else {
                                this.loading = false;
                                this.$message.error(res.msg);
                            }
                        });
                    }
                }
            });
        },
        findNodeInTree(tree, targetValue) {
            if (!tree || typeof tree !== "object") {
                return null;
            }

            if (tree.id === targetValue) {
                return tree;
            }

            for (let key in tree) {
                if (tree.hasOwnProperty(key) && typeof tree[key] === "object") {
                    const found = this.findNodeInTree(tree[key], targetValue);
                    if (found) {
                        return found;
                    }
                }
            }

            return null;
        },
        orgCheck(data, checkObj) {
            const isCheck =
                this.$refs.simpleTree.getCheckedNodes().indexOf(data) > -1;
            this.$refs.simpleTree.setCheckedKeys(checkObj.checkedKeys);
            if ((!isCheck || data.type !== 3) && data.name !== "查询") {
                return;
            }

            let parentNode = this.findNodeInTree(this.modelList, data.parentId);
            let obj = parentNode.children.find((item) => item.name === "查询");
            if (data.name === "查询" && !isCheck) {
                let selectedBtn = parentNode.children.reduce((prev, cur) => {
                    return prev.concat(cur.id);
                }, []);
                let checkedArr = checkObj.checkedKeys.filter((item) => {
                    return selectedBtn.includes(item) && obj.id !== item;
                });
                if (checkedArr && checkedArr.length) {
                    this.$message.warning("菜单权限启用，“查询”必选。", 1000);
                    this.$refs.simpleTree.setCheckedKeys([
                        ...new Set([...[data.id], ...checkObj.checkedKeys]),
                    ]);
                }
                return;
            }
            if (obj) {
                this.$refs.simpleTree.setCheckedKeys([
                    ...new Set([...[obj.id], ...checkObj.checkedKeys]),
                ]);
            }
        },
        orgCheckChange(data) {},
    },
    mounted() {},
};
</script>

<style lang="less" scoped>
.role-dialog {
    .role-dialog-tab {
        color: #1a1a1a;
    }
    .role-dialog-select {
        display: flex;
        align-items: center;
        .el-select {
            flex: 1;
        }
    }
    .el-row {
        display: flex;
        flex-wrap: wrap;
    }
    .el-form-item {
        margin-bottom: 12px;
    }
    .el-switch {
        height: 32px;
    }
    .app-box {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    .app-content {
        height: 81px;
        width: 33%;
    }
    .app-hide {
        display: none;
    }
}

/deep/.select-all {
    height: 32px;
    line-height: 32px;
    display: flex;
    .el-checkbox__input {
        padding: 4px;
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
<style lang="less">
.operate-select {
    .el-select-dropdown__wrap {
        position: relative;
        overflow: hidden;
        margin: 0px !important;
    }
    .el-scrollbar__view {
        position: relative;
        height: 274px;
        overflow: hidden;
        .option-box {
            height: 228px;
            overflow-y: auto;
        }
    }
    .copy-btn {
        width: 100%;
        background: #ffffff;
        border-top: 1px solid rgb(242, 242, 242);
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: absolute;
        top: 234px;
        .el-button {
            color: #4886ff;
            width: 58px;
        }
    }
}
</style>
