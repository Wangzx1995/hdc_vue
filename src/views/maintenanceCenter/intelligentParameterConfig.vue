<template>
    <div class="intelligent-parameter-config">
        <el-form ref="searchForm" :model="searchForm" inline class="p-x p-t">
            <div class="wrap-top">
                <div>
                    <el-form-item
                        :label="$t('intelligentParameterConfig.name')"
                        prop="driverName"
                    >
                        <el-input
                            :placeholder="$t('common.input')"
                            v-model="searchForm.driverName"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        :label="$t('intelligentParameterConfig.IDNumber')"
                        prop="idNumber"
                    >
                        <el-input
                            :placeholder="$t('common.input')"
                            v-model="searchForm.idNumber"
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
                        {{ $t("common.search") }}
                    </el-button>
                    <el-button
                        type="default"
                        @click="handleReset($refs.searchForm)"
                    >
                        {{ $t("common.reset") }}
                    </el-button>
                </div>
            </div>
            <el-row class="m-b">
                <el-button
                    type="primary"
                    @click="disableParams(1)"
                    :disabled="!selection.length"
                >
                    {{
                        $t("intelligentParameterConfig.enable") +
                        $t("intelligentParameterConfig.intelligentParameters")
                    }}
                </el-button>
                <el-button
                    type="danger"
                    @click="disableParams(0)"
                    :disabled="!selection.length"
                >
                    {{
                        $t("intelligentParameterConfig.deactivate") +
                        $t("intelligentParameterConfig.intelligentParameters")
                    }}
                </el-button>
            </el-row>
        </el-form>
        <div class="p-x">
            <el-table
                v-loading="searchLoading"
                :data="listData"
                ref="table"
                :height="tableHeight"
                :row-key="'driverId'"
                @selection-change="onSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="40"
                    :reserve-selection="true"
                >
                </el-table-column>
                <el-table-column
                    :label="$t('intelligentParameterConfig.facialPhoto')"
                    width="82"
                >
                    <template slot-scope="scope">
                        <el-image
                            style="width: 60px; height: 60px"
                            :src="scope.row.photoUrl"
                            :preview-src-list="[scope.row.photoUrl]"
                            :fit="'scale-down'"
                        >
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="driverName"
                    :label="$t('intelligentParameterConfig.name')"
                    width="160"
                >
                </el-table-column>
                <el-table-column
                    prop="labelPhysiologyHabit"
                    :label="
                        $t('intelligentParameterConfig.labelPhysiologyHabit')
                    "
                >
                    <template slot-scope="scope">
                        <div
                            v-if="
                                scope.row.labelPhysiologyHabit &&
                                scope.row.labelPhysiologyHabit.length
                            "
                        >
                            {{
                                getLabelSelfArr(
                                    allLabelList,
                                    scope.row.labelPhysiologyHabit.split(","),
                                    "labelId",
                                    "labelName"
                                )
                            }}
                        </div>
                        <div v-else>--</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="labelNegative"
                    :label="$t('intelligentParameterConfig.labelNegative')"
                >
                    <template slot-scope="scope">
                        <div
                            v-if="
                                scope.row.labelNegative &&
                                scope.row.labelNegative.length
                            "
                        >
                            {{
                                getLabelSelfArr(
                                    allLabelList,
                                    scope.row.labelNegative.split(","),
                                    "labelId",
                                    "labelName"
                                )
                            }}
                        </div>
                        <div v-else>--</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="labelPositive"
                    :label="$t('intelligentParameterConfig.labelPositive')"
                >
                    <template slot-scope="scope">
                        <div
                            v-if="
                                scope.row.labelPositive &&
                                scope.row.labelPositive.length
                            "
                        >
                            {{
                                getLabelSelfArr(
                                    allLabelList,
                                    scope.row.labelPositive.split(","),
                                    "labelId",
                                    "labelName"
                                )
                            }}
                        </div>
                        <div v-else>--</div>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="
                        $t('intelligentParameterConfig.enable') +
                        $t('intelligentParameterConfig.intelligentParameters')
                    "
                    width="150"
                >
                    <template slot-scope="scope">
                        <div>
                            <el-switch
                                v-model="scope.row.enable"
                                :active-value="1"
                                :inactive-value="0"
                                @change="
                                    (val) => {
                                        enableChange(val, [scope.row.driverId]);
                                    }
                                "
                            ></el-switch>
                            <el-button
                                type="text"
                                @click="openDetail(scope.row)"
                            >
                                {{
                                    $t(
                                        "intelligentParameterConfig.parameterDetails"
                                    )
                                }}
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('common.operate')"
                    width="100"
                    fixed="right"
                >
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            class="text-info"
                            @click="goEdit(scope.row)"
                        >
                            {{ $t("intelligentParameterConfig.editLabel") }}
                        </el-button>
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
        <el-dialog
            :visible="editModal"
            :title="$t('intelligentParameterConfig.editLabel')"
            @close="closeEditModal"
            class="no-padding tree_style"
            :width="'825px'"
        >
            <div class="edit-modal">
                <el-image
                    style="width: 400px; height: 400px"
                    :src="editForm.photoUrl"
                    :fit="'scale-down'"
                >
                </el-image>
                <el-form
                    :label-position="'top'"
                    label-width="180px"
                    :model="editForm"
                    ref="editForm"
                    :rules="rules"
                >
                    <el-form-item
                        :label="
                            $t(
                                'intelligentParameterConfig.labelPhysiologyHabit'
                            )
                        "
                        prop="labelPhysiologyHabit"
                    >
                        <el-checkbox-group
                            v-model="editForm.labelPhysiologyHabit"
                        >
                            <el-checkbox
                                v-for="item in editLabelList"
                                :key="item.labelId"
                                :label="item.labelId"
                            >
                                {{ item.labelName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button type="default" @click="doCancel">
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button type="primary" :loading="loading" @click="doSave()">
                    {{ $t("common.ok") }}
                </el-button>
            </div>
        </el-dialog>
        <el-dialog
            :title="$t('intelligentParameterConfig.parameterDetails')"
            :append-to-body="true"
            :visible.sync="detailVisible"
            width="1200px"
        >
            <intelligent-parameter-config-dialog
                ref="intelligentParameterConfigDialog"
                :key="detailKey"
                :detailData="detailData"
                @closeDialog="detailVisible = false"
            >
            </intelligent-parameter-config-dialog>
            <div slot="footer">
                <el-button type="default" @click="detailVisible = false">
                    {{ $t("common.cancel") }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import intelligentParameterConfigDialog from "./intelligentParameterConfigDialog.vue";
export default {
    name: "wifiManage",
    components: { intelligentParameterConfigDialog },
    data() {
        return {
            searchLoading: true,
            loading: false,
            editModal: false,
            tableHeight: 500,
            searchForm: { driverName: "", idNumber: "" },
            params: { currentPage: 1, pageSize: 20 },
            listData: [],
            total: 0,
            editForm: {},
            selection: [],
            rules: {},
            allLabelList: [],
            editLabelList: [],
            detailData: {},
            detailKey: "",
            detailVisible: false,
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
        search() {
            this.$refs.searchForm.validate((valid) => {
                if (valid) {
                    let params = Object.assign(this.params, this.searchForm);
                    this.getData(params);
                }
            });
        },
        getData(params) {
            this.searchLoading = true;
            this.$api
                .getDriverInfoList(params)
                .then((res) => {
                    if (res.success == true) {
                        this.listData = res.data.results;
                        this.total = res.data.totalRecords;
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
        goEdit(data) {
            this.editModal = true;
            this.editForm = {
                labelPhysiologyHabit: (data.labelPhysiologyHabit
                    ? data.labelPhysiologyHabit.split(",")
                    : []
                ).map((i) => {
                    return Number(i);
                }),
                driverId: data.driverId,
                photoUrl: data.photoUrl,
            };
        },
        closeEditModal() {
            this.editModal = false;
        },
        disableParams(enable) {
            this.$confirm(
                this.$t("intelligentParameterConfig.disableParamsText", {
                    enable:
                        enable === 1
                            ? this.$t("intelligentParameterConfig.enable")
                            : this.$t("intelligentParameterConfig.deactivate"),
                }),
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.enableChange(enable, this.selection, true);
                })
                .catch(() => {});
        },
        enableChange(enable, driverIds, bol) {
            this.$api
                .editDriverLabelConfigEnable({
                    driverIds: driverIds,
                    enable: enable,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.$message.success(
                            `${
                                enable === 1
                                    ? this.$t(
                                          "intelligentParameterConfig.enable"
                                      )
                                    : this.$t(
                                          "intelligentParameterConfig.deactivate"
                                      )
                            }${this.$t("common.success")}`
                        );
                        this.search();
                        if (bol) {
                            this.$refs.table.clearSelection();
                            this.selection = [];
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        doSave() {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.$api
                        .editDriverLabelBind({
                            labelIds: this.editForm.labelPhysiologyHabit.join(),
                            driverId: this.editForm.driverId,
                        })
                        .then((res) => {
                            if (res.success == true) {
                                this.loading = false;
                                this.closeEditModal();
                                this.$message.success(
                                    this.$t("common.edit") +
                                        this.$t("common.success")
                                );
                                this.search();
                            } else {
                                this.loading = false;
                                this.$message.error(res.msg);
                            }
                        });
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
        onSelectionChange(selection) {
            this.selection = selection.reduce((prev, cur) => {
                return prev.concat(cur.driverId);
            }, []);
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        getLabelSelfArr(arr, val, key, label) {
            if (!val) {
                return "--";
            }
            let valArr = val.reduce((prev, cur) => {
                let attribute = arr.find((e) => e[key] == cur);
                if (attribute) {
                    return prev.concat(attribute[label]);
                } else {
                    return prev;
                }
            }, []);
            if (valArr.length) {
                return valArr.join("，");
            } else {
                return "--";
            }
        },
        getLabelMappingInfo() {
            this.$api
                .getLabelMappingInfo({ labelTypes: [1, 2, 3, 4] })
                .then((res) => {
                    if (res.success == true) {
                        this.allLabelList = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            this.$api
                .getLabelMappingInfo({ labelTypes: [1, 2] })
                .then((res) => {
                    if (res.success == true) {
                        this.editLabelList = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        openDetail(row) {
            this.detailKey = new Date().getTime();
            this.detailVisible = true;
            this.detailData = {
                ...row,
                time: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
            };
        },
        intelligentParameterConfigDialogSave() {
            this.$refs.intelligentParameterConfigDialog.editDriverLabelConfigSensitivity();
        },
    },
    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };
        this.getLabelMappingInfo();
        this.getData(this.params);
    },
    created() {
        this.setTableHeight();
    },
};
</script>
<style lang="less" scoped>
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
.edit-modal {
    display: flex;
    .el-image {
        border: 1px solid #e4e4e4;
    }
    .el-form {
        margin-left: 24px;
        flex: 1;
        .el-checkbox-group {
            display: flex;
            flex-direction: column;
            max-height: 356px;
            width: 360px;
            overflow: auto;
        }
    }
}
</style>
