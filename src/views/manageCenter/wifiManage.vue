<template>
    <div class="user-manage">
        <el-form ref="searchForm" :model="searchForm" inline class="p-x p-t">
            <div class="wrap-top">
                <div>
                    <!-- 账户名称 -->
                    <el-form-item
                        :label="$t('wifiManage.nameOfAccount') + ':'"
                        prop="userName"
                    >
                        <el-input
                            :placeholder="
                                $t('common.input') +
                                $t('wifiManage.nameOfAccount')
                            "
                            v-model="searchForm.userName"
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
                        >{{ $t("common.search") }}</el-button
                    >
                    <el-button
                        type="default"
                        @click="handleReset($refs.searchForm)"
                        >{{ $t("common.reset") }}</el-button
                    >
                </div>
            </div>
            <el-row class="m-b">
                <el-button
                    type="primary"
                    @click="goAdd"
                    v-btn="'wifiManageAdd'"
                >
                    {{ $t("common.add") }}</el-button
                >
                <!-- <el-button type="default" :disabled="selection.length == 0" @click="doBatchDelete">删除</el-button> -->
            </el-row>
        </el-form>
        <div class="p-x">
            <el-table
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                :data="listData"
                ref="table"
                border
                stripe
                :height="tableHeight"
            >
                <!-- WIFI前缀名称 -->
                <el-table-column
                    prop="wifiName"
                    :label="$t('wifiManage.wifiPrefixName')"
                    width="160px"
                ></el-table-column>
                <!-- 账户名称 -->
                <el-table-column
                    prop="isFreezed"
                    :label="$t('wifiManage.nameOfAccount')"
                >
                    <template slot-scope="scope">
                        <div class="tag-box">
                            <el-tag
                                v-for="item in scope.row.wifiUsers"
                                :key="item.userId"
                                >{{ item.userName }}</el-tag
                            >
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('common.operate')"
                    width="120px"
                    fixed="right"
                >
                    <template slot-scope="scope">
                        <div
                            v-show="scope.row.isSysMust != 1"
                            class="text-nowrap"
                        >
                            <el-button
                                type="text"
                                class="text-info"
                                @click="goEdit(scope.row)"
                                v-btn="'wifiManageEdit'"
                                >{{ $t("common.edit") }}</el-button
                            >
                            <el-button
                                type="text"
                                class="text-info"
                                @click="doDelete(scope.row.id)"
                                v-btn="'wifiManageDelete'"
                                >{{ $t("common.delete") }}</el-button
                            >
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
        <!-- 编辑 -->
        <el-dialog
            :visible="editModal"
            :title="
                (modalType == -1 ? $t('common.add') : $t('common.edit')) +
                $t('wifiManage.wifiPrefixName')
            "
            @close="closeEditModal"
            class="no-padding tree_style"
            :width="'825px'"
        >
            <div v-if="showEditForm">
                <el-form
                    ref="editForm"
                    :model="editForm"
                    :rules="formValidate"
                    label-width="100px"
                    label-position="top"
                >
                    <!-- WIFI前缀名称 -->
                    <el-form-item
                        :label="$t('wifiManage.wifiPrefixName') + ':'"
                        prop="wifiName"
                    >
                        <el-input
                            size="small"
                            v-model.trim="editForm.wifiName"
                            :maxlength="10"
                            style="width: 310px"
                            type="text"
                            :placeholder="
                                $t('common.input') +
                                $t('wifiManage.wifiPrefixName')
                            "
                            class="w-md"
                            clearable
                            auto-complete="off"
                            @blur="wifiNameBlur"
                        ></el-input>
                        <el-popover placement="top" width="366" trigger="hover">
                            <div class="wifi">
                                <img src="/static/images/wifi.png" />
                                <span>
                                    {{ $t("wifiManage.prompt") }}
                                </span>
                                <span class="demo">
                                    {{
                                        editForm.wifiName ||
                                        $t("wifiManage.wifiPrefixName")
                                    }}-XXXX
                                </span>
                            </div>
                            <el-button
                                class="wifi-btn"
                                type="text"
                                slot="reference"
                                >{{
                                    $t("wifiManage.viewStyleExamples")
                                }}</el-button
                            >
                        </el-popover>
                    </el-form-item>
                    <!-- 分配用户 -->
                    <el-form-item
                        :label="$t('wifiManage.assigningUsers') + ':'"
                        prop="userIds"
                    >
                        <div style="height: 400px">
                            <el-transfer
                                style="height: 400px"
                                v-model="editForm.userIds"
                                :filterable="true"
                                :titles="[
                                    $t('wifiManage.toBeAdded'),
                                    $t('wifiManage.added'),
                                ]"
                                :props="{
                                    key: 'userId',
                                    label: 'userName',
                                }"
                                :data="leftData"
                            />
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button type="default" @click="doCancel">{{
                    $t("common.cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    :loading="loading"
                    @click="doSave()"
                    >{{ $t("common.ok") }}</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "wifiManage",
    components: {},
    data() {
        const validateName = (rule, value, callback) => {
            var pattern = /^[A-Za-z0-9-_]+$/;
            if (!value) {
                callback(new Error(this.$t("wifiManage.wifiName_message_2")));
            } else {
                if (pattern.test(value)) {
                    callback();
                } else {
                    callback(
                        new Error(this.$t("wifiManage.wifiName_message_3"))
                    );
                }
            }
        };
        return {
            searchLoading: true,
            loading: false,
            editModal: false,
            showEditForm: false,
            tableHeight: 500,
            modalType: 0,
            searchForm: {
                userName: "",
            },
            params: {
                currentPage: 1,
                pageSize: 20,
            },
            listData: [],
            total: 0,
            editForm: {
                id: "",
                wifiName: "",
                userIds: [],
            },
            formValidate: {
                wifiName: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: validateName,
                    },
                    {
                        type: "string",
                        min: 0,
                        max: 10,
                        message: this.$t("wifiManage.wifiName_message_1"),
                        trigger: "blur",
                    },
                ],
                userIds: [
                    {
                        required: true,
                        type: "array",
                        message: this.$t("wifiManage.userIds_message"),
                        trigger: "change",
                    },
                ],
            },
            leftData: [],
            rightData: [],
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
    computed: {},
    methods: {
        wifiNameBlur(val) {
            // this.editForm.wifiName = this.editForm.wifiName.toUpperCase();
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
                .wifiConfigPage(params)
                .then((res) => {
                    if (res.success == true) {
                        this.listData = res.data.results;
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
        pageChange(page) {
            this.params.currentPage = page;
        },
        PageSizeChange(limit) {
            this.params.pageSize = limit;
        },
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
            }
        },
        goAdd() {
            this.rightData = [];
            this.editForm.wifiName = "";
            this.editForm.userIds = [];
            this.modalType = -1;
            this.editModal = true;
            this.showEditForm = true;
        },
        goEdit(data) {
            this.rightData = data.wifiUsers;
            this.rightData.map((item) => {
                item.belongArea = "root";
            });
            this.editForm.id = data.id;
            this.editForm.wifiName = data.wifiName;
            this.editForm.userIds = data.wifiUsers.reduce((prev, cur) => {
                return prev.concat(cur["userId"]);
            }, []);
            this.modalType = 0;
            this.editModal = true;
            this.showEditForm = true;
        },
        closeEditModal() {
            this.editModal = false;
            setTimeout(() => {
                this.showEditForm = false;
            }, 300);
        },
        doDelete(id) {
            this.$confirm(
                this.$t("wifiManage.deleteTitle"),
                this.$t("wifiManage.deleteMsg"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    // 删除用户
                    this.$api.wifiConfigDelete({ id: id }).then((res) => {
                        if (res.success == true) {
                            this.loading = false;
                            this.$message.success(
                                this.$t("common.deleteSuccess")
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
        doSave() {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    if (this.modalType == -1) {
                        delete this.editForm.id;
                        this.$api.wifiConfigAdd(this.editForm).then((res) => {
                            if (res.success == true) {
                                this.loading = false;
                                this.closeEditModal();
                                this.$message.success(
                                    this.$t("common.addSuccess")
                                );
                                this.search();
                            } else {
                                this.loading = false;
                                this.$message.error(res.msg);
                            }
                        });
                    } else if (this.modalType == 0) {
                        // 编辑用户
                        this.$api
                            .wifiConfigUpdate(this.editForm)
                            .then((res) => {
                                if (res.success == true) {
                                    this.loading = false;
                                    this.closeEditModal();
                                    this.$message.success(
                                        this.$t("common.editSuccess")
                                    );
                                    this.search();
                                } else {
                                    this.loading = false;
                                    this.$message.error(res.msg);
                                }
                            });
                    }
                } else {
                    return false;
                }
            });
        },
        doCancel() {
            this.loading = false;
            this.editModal = false;
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 253;
        },

        getLeftData() {
            this.$api.wifiConfigUserList().then((res) => {
                if (res.success == true) {
                    this.leftData = res.data;
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
        this.getData(this.params);
        this.getLeftData();
    },
    created() {
        this.setTableHeight();
    },
};
</script>
<style lang="less" scoped>
.loading_ {
    pointer-events: none;
}
.user-manage {
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .el-form-item {
            margin-bottom: 12px !important;
        }
    }
    .wrap-bottom {
        width: 100%;
        border-top: 1px solid #e4e4e4;
    }
}
div /deep/ .el-card__body {
    padding: 0 !important;
}
.wifi {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    .demo {
        position: absolute;
        height: 48px;
        top: 46px;
        line-height: 48px;
        font-size: 18px;
        left: 28px;
        color: #000000;
    }
}
.wifi-btn {
    color: #409eff;
}
.tag-box {
    .el-tag {
        height: 24px;
        line-height: 22px;
        margin: 0 8px 0px 0;
    }
}
/deep/.el-transfer {
    .el-transfer-panel {
        height: 100%;
        width: 300px;
    }
    .el-scrollbar {
        height: 100% !important;
    }
    .el-transfer-panel__body {
        height: calc(~"100% - 55px");
    }
    .el-transfer-panel__list {
        height: calc(~"100% - 51px");
    }
}
</style>
