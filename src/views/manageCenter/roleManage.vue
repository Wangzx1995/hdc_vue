<template>
    <div class="role-manage">
        <el-form
            ref="searchForm"
            :model="searchForm"
            inline
            :rules="searchFormValidate"
            class="p-x p-t"
        >
            <el-row>
                <div class="wrap-top">
                    <!-- 角色名称 -->
                    <el-form-item
                        :label="$t('roleManage.roleName')"
                        prop="name"
                    >
                        <el-input
                            v-model="searchForm.name"
                            :placeholder="$t('common.input')"
                            class="w-lg"
                            clearable
                        ></el-input>
                    </el-form-item>
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
            </el-row>
            <el-row class="m-y">
                <el-button
                    type="primary"
                    @click="goAdd"
                    v-btn="'roleManageAdd'"
                >
                    <!-- 添加 -->
                    {{ $t("common.add") }}
                </el-button>
                <el-button
                    type="default"
                    :disabled="selection.length == 0"
                    @click="doBatchDelete"
                    v-btn="'roleManageDelete'"
                >
                    <!-- 删除 -->
                    {{ $t("common.delete") }}
                </el-button>
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
                @sort-change="sortChange"
            >
                <el-table-column type="selection" prop="id"></el-table-column>
                <!-- 角色名称 -->
                <el-table-column
                    prop="name"
                    :label="$t('roleManage.roleName')"
                    width="200px"
                    sortable
                ></el-table-column>
                <!-- 角色权限列表 -->
                <el-table-column
                    prop="purview"
                    :label="$t('roleManage.roleNameList')"
                    min-width="140px"
                >
                    <template slot-scope="scope">
                        {{ scope.row.roleNameList }}
                    </template>
                </el-table-column>
                <!-- 角色用户数 -->
                <el-table-column
                    prop="userCount"
                    :label="$t('roleManage.userCount')"
                    width="100px"
                >
                    <template slot-scope="scope">
                        <div
                            v-show="scope.row.isSysMust != '1'"
                            class="text-nowrap"
                        >
                            {{ scope.row.userCount }}
                        </div>
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column
                    :label="$t('common.operate')"
                    width="100px"
                    fixed="right"
                >
                    <template slot-scope="scope">
                        <div
                            v-show="scope.row.isSysMust != '1'"
                            class="text-nowrap"
                        >
                            <el-button
                                type="text"
                                class="text-info"
                                @click="goEdit(scope.row)"
                                v-btn="'roleManageEdit'"
                            >
                                <!-- 编辑 -->
                                {{ $t("common.edit") }}
                            </el-button>
                            <el-button
                                type="text"
                                class="text-info"
                                @click="doDelete(scope.row.id)"
                                v-btn="'roleManageDelete'"
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

        <RoleDialog
            :dialogVisible="dialogVisible"
            :modalType="modalType"
            :roleInfo="roleInfo"
            @close="close"
        ></RoleDialog>
    </div>
</template>
<script>
import { validateSpecial } from "@/utils/validate";
import RoleDialog from "./roleDialog";

export default {
    name: "list",
    components: { RoleDialog },
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
        return {
            searchLoading: true,
            dialogVisible: false,
            modalType: "add",
            roleInfo: {},
            loading: false,
            tableHeight: 500,
            dataReady: false, // 判断异步数据加载完成，避免报错
            name: "",
            searchForm: {
                name: "",
            },
            searchFormValidate: {
                name: [{ validator: checkSpeccial, trigger: "change" }],
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "", //排序列
                orderDir: "", //排序方向
            },
            listData: [],
            total: 0, // 数据总数
            selection: [], // 表格选中项
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
    methods: {
        close(load) {
            this.dialogVisible = false;
            if (load) this.search();
        },
        sortChange(column, prop, order) {
            this.params.orderDir = !column.order
                ? ""
                : column.order === "ascending"
                ? "asc"
                : "desc";
            this.params.orderColumn = !column.prop ? "" : "name";
            // this.search()
        },
        /**
         * 重置表单
         * */
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
            }
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
        /**
         * @params:category 分类 page：页码 limit:条数
         * */
        getData(params) {
            this.searchLoading = true;
            this.$api
                .getRolePage(params)
                .then((res) => {
                    if (res.success == true) {
                        res.data.results.forEach(function (item) {
                            if (item.id == 1) {
                                item._disabled = true;
                            }
                        });
                        this.listData = res.data.results;
                        // 拼接角色权限列表
                        this.listData.map((row) => {
                            row.roleNameList = row.modelList
                                .filter((item) => item.type === 2)
                                .reduce((prev, cur) => {
                                    return prev.concat(cur["cnName"]);
                                }, [])
                                .join("、");
                        });
                        this.total = res.data.totalRecords;
                        this.dataReady = true;
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
        /**
         * @on-change 页码改变的回调，返回改变后的页码
         * */
        pageChange(page) {
            this.params.currentPage = page;
        },
        /**
         * @on-page-size-change 切换每页条数时的回调，返回切换后的每页条数
         * */
        PageSizeChange(limit) {
            this.params.currentPage = 1;
            this.params.pageSize = limit;
        },
        /**
         * 添加单条数据
         * */
        goAdd() {
            this.modalType = "add";
            this.dialogVisible = true;
            this.roleInfo = {};
            // this.handleReset(this.$refs.editForm);
            // this.modalType = -1;
            // this.editForm.id=null,
            // this.editForm.modelIds=[];
            // this.distributonPower(this.editForm);
            // this.editModal = true;
        },
        /**
         * 编辑单条数据
         * */
        goEdit(roleInfo) {
            this.modalType = "edit";
            this.dialogVisible = true;
            this.roleInfo = JSON.parse(JSON.stringify(roleInfo));
            // this.modalType = 0;
            // this.handleReset(this.$refs.editForm);
            // this.editForm = JSON.parse(JSON.stringify(roleInfo));
            // this.distributonPower(this.editForm);
            // this.editModal = true;
        },
        /**
         * 删除单条数据
         * */
        doDelete(id) {
            // 确定要删除该角色吗？
            this.$confirm(
                this.$t("roleManage.deleteRoleMsg1"),
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    // 删除角色
                    var roleIds = [];
                    roleIds.push(id);
                    this.$api.deleteRole(roleIds).then((res) => {
                        if (res.success == true) {
                            this.loading = false;
                            this.$message.success(
                                this.$t("roleManage.deleteRoleMsg2")
                            );
                            this.getData(this.params);
                            this.search();
                        } else {
                            this.loading = false;
                            this.$message.error(res.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        /**
         * 批量删除-删除多条数据
         * */
        doBatchDelete() {
            // this.$confirm("角色删除后将无法恢复", "确定要删除这些角色吗？", {
            this.$confirm(
                this.$t("roleManage.deleteRoleMsg3"),
                this.$t("roleManage.deleteRoleMsg4"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    let ids = [];
                    this.selection.forEach(function (item) {
                        ids.push(item.id);
                    });
                    this.$api.deleteRole(ids).then((res) => {
                        if (res.success == true) {
                            this.loading = false;
                            this.selection = [];
                            this.$message.success(
                                this.$t("roleManage.deleteRoleMsg2")
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
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 283 + 28;
        },
    },
    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };
    },
    created() {
        this.setTableHeight();
        this.getData(this.params);
    },
};
</script>
<style lang="less" scoped>
.role-manage {
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .el-form-item {
            margin-bottom: 0px !important;
        }
    }
    .wrap-bottom {
        width: 100%;
        border-top: 1px solid #e4e4e4;
    }
}
</style>
