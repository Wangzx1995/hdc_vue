<template>
    <div class="deviceLoadTask-manage">
        <el-form ref="searchForm" :model="searchForm" inline class="p-x p-t">
            <div class="wrap-top">
                <div>
                    <!-- 任务名称 -->
                    <el-form-item
                        :label="$t('deviceLoadTaskManage.taskName')"
                        prop="taskName"
                    >
                        <el-input
                            :placeholder="$t('common.input')"
                            v-model="searchForm.taskName"
                            class="w"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <!-- 企业 -->
                    <el-form-item
                        :label="$t('deviceLoadTaskManage.enterprise')"
                        prop="orgId"
                    >
                        <TreeSelect
                            :placeholder="$t('common.select')"
                            :treeData="treeData"
                            style="width: 300px"
                            filter
                            v-model="searchForm.orgId"
                            :props="defaultProps"
                            ref="TreeSelect"
                        >
                        </TreeSelect>
                    </el-form-item>
                    <!-- 状态 -->
                    <!-- <el-form-item
                        prop="taskStatus"
                        :label="$t('deviceLoadTaskManage.taskStatus')"
                    >
                        <el-select
                            v-model="searchForm.taskStatus"
                            :placeholder="$t('common.select')"
                            clearable
                        >
                            <el-option
                                v-for="item in taskStatusList"
                                :value="item.value"
                                :key="item.value"
                                :label="item.label"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <!-- 操作时间范围 -->
                    <el-form-item
                        prop="deviceCode"
                        :label="$t('deviceLoadTaskManage.operatingTimeRange')"
                    >
                        <el-date-picker
                            :default-time="['00:00:00', '23:59:59']"
                            size="small"
                            v-model="timeRange"
                            type="datetimerange"
                            transfer
                            clearable
                            :start-placeholder="$t('common.startTime')"
                            :end-placeholder="$t('common.endTime')"
                            format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
                    </el-form-item>
                </div>
                <div class="flex">
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
                    icon="el-icon-plus"
                    @click="goAdd"
                    v-btn="'deviceLoadTaskManageAdd'"
                >
                    <!-- 添加任务 -->
                    {{ $t("deviceLoadTaskManage.addTask") }}
                </el-button>
                <el-radio-group
                    style="float: right"
                    v-model="searchForm.taskStatus"
                    @change="
                        params.currentPage = 1;
                        search();
                    "
                >
                    <el-radio-button
                        v-for="item in taskStatusList"
                        :key="item.value"
                        :label="item.value"
                        >{{ item.label }}</el-radio-button
                    >
                </el-radio-group>
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
                @sort-change="sortChange"
            >
                <!-- 任务名称 -->
                <el-table-column
                    prop="taskName"
                    :label="$t('deviceLoadTaskManage.taskName')"
                    min-width="140px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 安装日期 -->
                <el-table-column
                    prop=""
                    :label="$t('deviceLoadTaskManage.installDate')"
                    min-width="120px"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.startTime && scope.row.endTime"
                            >{{ scope.row.startTime }}
                            <!-- 至 -->
                            {{ $t("deviceLoadTaskManage.to") }}
                            {{ scope.row.endTime }}</span
                        >
                        <span v-else>--</span></template
                    >
                </el-table-column>
                <!-- 企业 -->
                <el-table-column
                    prop="orgName"
                    :label="$t('deviceLoadTaskManage.enterprise')"
                    min-width="120px"
                ></el-table-column>
                <!-- 装车车辆数 -->
                <el-table-column
                    prop="carNum"
                    :label="$t('deviceLoadTaskManage.numberOfLoadedVehicles')"
                    width="120px"
                >
                </el-table-column>
                <!-- 操作时间 -->
                <el-table-column
                    prop="operateTime"
                    :label="$t('deviceLoadTaskManage.operateTime')"
                    sortable
                    width="170px"
                ></el-table-column>
                <!-- 状态 -->
                <el-table-column
                    prop="taskStatus"
                    :label="$t('deviceLoadTaskManage.taskStatus')"
                    width="120px"
                >
                    <!-- 0待启用    1启用中   2已关闭 -->
                    <template slot-scope="scope">
                        <div
                            class="task-status"
                            v-if="
                                scope.row.taskStatus === 0 ||
                                scope.row.taskStatus === 1 ||
                                scope.row.taskStatus === 2
                            "
                        >
                            <i :class="`status${scope.row.taskStatus}`"></i>
                            <span>
                                {{
                                    taskStatusList.find(
                                        (item) =>
                                            item.value ===
                                            Number(scope.row.taskStatus)
                                    ).label
                                }}
                            </span>
                        </div>
                        <div v-else>--</div>
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column
                    :label="$t('common.operate')"
                    width="200px"
                    fixed="right"
                >
                    <template slot-scope="scope">
                        <div class="text-nowrap operate">
                            <el-button
                                type="text"
                                class="text-info"
                                @click="goDetail(scope.row.id)"
                            >
                                <!-- 详情 -->
                                {{ $t("common.detail") }}
                            </el-button>
                            <el-button
                                type="text"
                                class="text-info"
                                @click="goEdit(scope.row.id)"
                                v-if="scope.row.taskStatus === 0"
                                v-btn="'deviceLoadTaskManageEdit'"
                            >
                                <!-- 编辑 -->
                                {{ $t("common.edit") }}
                            </el-button>
                            <el-button
                                type="text"
                                class="text-info"
                                @click="updateStatus(scope.row.id, 0)"
                                v-if="scope.row.taskStatus === 0"
                                v-btn="'deviceLoadTaskManageEnableTask'"
                            >
                                <!-- 启用任务 -->
                                {{ $t("deviceLoadTaskManage.startTask") }}
                            </el-button>
                            <el-button
                                type="text"
                                class="text-info"
                                @click="updateStatus(scope.row.id, 1)"
                                v-if="scope.row.taskStatus === 1"
                                v-btn="'deviceLoadTaskManageEndTask'"
                            >
                                <!-- 结束任务 -->
                                {{ $t("deviceLoadTaskManage.endTask") }}
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
        <el-dialog
            :title="`${$t('deviceLoadTaskManage.taskText1')}${
                dialogTaskStatus === 0
                    ? $t('deviceLoadTaskManage.startTask')
                    : $t('deviceLoadTaskManage.endTask')
            }${$t('deviceLoadTaskManage.taskText2')}？`"
            :visible.sync="dialogVisible"
            width="500px"
            top="25vh"
            :close-on-click-modal="true"
            :close-on-press-escape="true"
        >
            <i
                class="el-icon-warning"
                style="color: #e6a23c; font-size: 20px"
            ></i>
            <span v-if="dialogTaskStatus === 0">
                <!-- 启用任务后，无法修改任务信息，并将任务发送至对应装车师傅小程序账号中。 -->
                {{ $t("deviceLoadTaskManage.taskText3") }}
            </span>
            <span v-else>
                <!-- 结束任务后，会将任务从应装车师傅小程序账号中删除。 -->
                {{ $t("deviceLoadTaskManage.taskText4") }}
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button
                    @click="goUpdateStatus(true)"
                    v-if="dialogTaskStatus === 1"
                    v-btn="'deviceLoadTaskManageAdd'"
                >
                    <!-- 结束并复制 -->
                    {{ $t("deviceLoadTaskManage.taskText5") }}
                </el-button>
                <el-button
                    @click="goUpdateStatus(true)"
                    v-if="dialogTaskStatus === 0"
                    v-btn="'deviceLoadTaskManageAdd'"
                >
                    <!-- 启用并复制 -->
                    {{ $t("deviceLoadTaskManage.taskText6") }}
                </el-button>
                <el-button @click="dialogVisible = false">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button type="primary" @click="goUpdateStatus(false)">
                     <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import TimeUtil from "@/utils/time";
export default {
    name: "deviceLoadTaskManage",
    components: {
        TreeSelect,
    },
    data() {
        return {
            searchLoading: true,
            tableHeight: 500,
            timeRange: [],
            treeData: [],
            defaultProps: {
                children: "children",
                label: "name",
            },
            searchForm: {
                // 搜索表单
                taskName: "",
                orgId: "",
                startTime: "",
                endTime: "",
                taskStatus: "",
                orderColumn: "startTime",
                orderDir: "desc",
            },
            params: {
                currentPage: 1, // 页码，从1开始
                pageSize: 20, // 分页大小
            },
            listData: [], // @:data
            total: 0, // 数据总数
            taskStatusList: [
                {
                    // label: "全部",
                    label: this.$t("common.all"),
                    value: "",
                },
                {
                    // label: "待启用",
                    label: this.$t("deviceLoadTaskManage.taskStatusList0"),
                    value: 0,
                },
                {
                    // label: "启用中",
                    label: this.$t("deviceLoadTaskManage.taskStatusList1"),
                    value: 1,
                },
                {
                    // label: "已关闭",
                    label: this.$t("deviceLoadTaskManage.taskStatusList2"),
                    value: 2,
                },
            ],
            dialogVisible: false,
            dialogId: "",
            dialogTaskStatus: null,
        };
    },
    watch: {
        params: {
            handler(val) {
                const params = Object.assign(val, this.searchForm);
                this.getData(params);
            },
            deep: true,
        },
        timeRange: {
            handler(val) {
                if (val && val.length > 0) {
                    this.searchForm.startTime = TimeUtil.getDateTime(
                        this.timeRange[0]
                    );
                    this.searchForm.endTime = TimeUtil.getDateTime(
                        this.timeRange[1]
                    );
                } else {
                    this.searchForm.startTime = "";
                    this.searchForm.endTime = "";
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        sortChange(column, prop, order) {
            this.searchForm.orderDir = !column.order
                ? ""
                : column.order === "ascending"
                ? "asc"
                : "desc";
            this.searchForm.orderColumn = "operateTime";
            this.$nextTick(() => {
                this.search();
            });
        },
        // 获取组织树
        getOrgTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = res.data;
                    this.$nextTick(() => {
                        if (this.searchForm.orgId) {
                            this.$refs.TreeSelect.setValue(
                                this.searchForm.orgId
                            );
                        }
                    });
                }
            });
        },
        search() {
            this.$refs.searchForm.validate((valid) => {
                if (valid) {
                    if (this.params.currentPage == 1) {
                        const params = Object.assign(
                            this.params,
                            this.searchForm
                        );
                        this.$store.dispatch("SetCondtion", this.searchForm);
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
                .getDeviceLoadTaskPage(params)
                .then((res) => {
                    if (res.success == true) {
                        this.listData = [];
                        this.$nextTick(() => {
                            this.listData =
                                (res.data.results.length &&
                                    res.data.totalRecords) ||
                                (!res.data.results.length &&
                                    !res.data.totalRecords)
                                    ? res.data.results
                                    : this.listData;
                            this.total = res.data.totalRecords;
                            this.$forceUpdate();
                        });
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
            this.params.currentPage = 1;
            this.params.pageSize = limit;
        },
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
                this.timeRange = [];
                this.$store.dispatch("SetCondtion", this.searchForm);
            }
        },
        goAdd() {
            this.$router.push({
                path: "/manageCenter/deviceLoadTaskManage/deviceLoadTaskDetail",
                query: {
                    type: "add",
                },
            });
        },
        goDetail(taskId) {
            this.$router.push({
                path: "/manageCenter/deviceLoadTaskManage/deviceLoadTaskDetail",
                query: {
                    type: "detail",
                    taskId,
                },
            });
        },
        goEdit(taskId) {
            this.$router.push({
                path: "/manageCenter/deviceLoadTaskManage/deviceLoadTaskDetail",
                query: {
                    type: "edit",
                    taskId,
                },
            });
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 283 + 28;
        },
        updateStatus(id, taskStatus) {
            this.dialogId = id;
            this.dialogTaskStatus = taskStatus;
            this.dialogVisible = true;
            // this.$confirm(
            //     taskStatus === 0
            //         ? "启用任务后，无法修改任务信息，并将任务发送至对应装车师傅小程序账号中。"
            //         : "结束任务后，会将任务从应装车师傅小程序账号中删除。",

            //     `确定要${taskStatus === 0 ? "启用任务" : "结束任务"}吗？`,
            //     {
            //         type: "warning",
            //     }
            // )
            //     .then(() => {
            //         this.$api
            //             .updateStatus({
            //                 id: id,
            //                 taskStatus: taskStatus === 0 ? 1 : 2,
            //             })
            //             .then((res) => {
            //                 if (res.success == true) {
            //                     this.$message.success("操作成功");
            //                     this.search();
            //                 }
            //             });
            //     })
            //     .catch(() => {});
        },
        goUpdateStatus(flag) {
            this.$api
                .updateStatus({
                    id: this.dialogId,
                    taskStatus: this.dialogTaskStatus === 0 ? 1 : 2,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.dialogVisible = false;
                        if (flag) {
                            this.$router.push({
                                path: "/manageCenter/deviceLoadTaskManage/deviceLoadTaskDetail",
                                query: {
                                    type: "detail",
                                    taskId: this.dialogId,
                                    flag: flag,
                                },
                            });
                        } else {
                            this.$message.success(
                                this.$t("deviceLoadTaskManage.taskUpdateStatus")
                            );
                            this.search();
                        }
                    }
                });
        },
        endCopy() {},
    },
    mounted() {
        const that = this;
        this.setTableHeight();
        if (this.$store.state.tree.searchForm) {
            this.searchForm.taskName = this.$store.state.tree.searchForm
                .taskName
                ? this.$store.state.tree.searchForm.taskName
                : "";
            this.searchForm.orgId = this.$store.state.tree.searchForm.orgId
                ? this.$store.state.tree.searchForm.orgId
                : "";
            this.searchForm.startTime = this.$store.state.tree.searchForm
                .startTime
                ? this.$store.state.tree.searchForm.startTime
                : "";
            this.searchForm.endTime = this.$store.state.tree.searchForm.endTime
                ? this.$store.state.tree.searchForm.endTime
                : "";
            this.searchForm.taskStatus = this.$store.state.tree.searchForm
                .taskStatus
                ? this.$store.state.tree.searchForm.taskStatus
                : "";
            this.timeRange = this.$store.state.tree.searchForm.startTime
                ? [
                      this.$store.state.tree.searchForm.startTime,
                      this.$store.state.tree.searchForm.endTime,
                  ]
                : [];
        }

        this.getData({
            ...this.searchForm,
            ...this.params,
        });
        window.onresize = () =>
            (() => {
                that.setTableHeight();
            })();
    },
    created() {
        this.setTableHeight();

        this.getOrgTree();
    },
    destroyed() {
        this.$route.meta.title = undefined;
    },
};
</script>
<style lang="less" scoped>
.loading_ {
    pointer-events: none;
}
.deviceLoadTask-manage {
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .flex {
            display: flex;
        }
        .el-form-item {
            margin-bottom: 0px !important;
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
.task-status {
    display: flex;
    align-items: center;
    i {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 8px;
        &.status0 {
            background: #e6a23c;
        }
        &.status1 {
            background: #67c23a;
        }
        &.status2 {
            background: #909399;
        }
    }
}
.operate {
    .el-button {
        font-size: 12px !important;
    }
}
</style>
