<template>
    <div>
        <div>
            <div class="wrap-top p-x-md">
                <div class="m-t">
                    <el-form
                        :model="searchForm"
                        inline
                        label-position="top"
                        ref="searchForm"
                    >
                        <!-- 故障类型 -->
                        <el-form-item
                            :label="$t('deviceHealthCondition.faultType')"
                        >
                            <TreeSelect
                                :placeholder="$t('common.select')"
                                :treeData="allFaultType"
                                show-checkbox
                                filter
                                style="width: 300px"
                                collapse-tags
                                check-model="child"
                                v-model="searchForm.faultTypes"
                            >
                            </TreeSelect>
                        </el-form-item>
                        <!-- 故障开始时间段 -->
                        <el-form-item
                            :label="$t('handleFault.faultStartTimePeriod')"
                        >
                            <el-date-picker
                                size="small"
                                v-model="time"
                                :default-time="['00:00:00', '23:59:59']"
                                type="datetimerange"
                                :start-placeholder="$t('common.startTime')"
                                :end-placeholder="$t('common.endTime')"
                            />
                        </el-form-item>
                    </el-form>
                </div>
                <div class="m-t-lg">
                    <el-button
                        type="primary"
                        :loading="searchLoading"
                        @click="
                            params.currentPage = 1;
                            search();
                        "
                    >
                        <!-- 查询 -->
                        {{ $t("common.search") }}
                    </el-button>
                    <el-button type="default" @click="handleReset()">
                        <!-- 清除条件 -->
                        {{ $t("common.reset") }}
                    </el-button>
                </div>
            </div>
            <div class="p-x-md">
                <el-button
                    class="goExport"
                    @click="goExport"
                    :loading="loadingAll"
                    :disabled="loadingAll"
                >
                    <!-- 导出 -->
                    {{ $t("common.export") }}
                </el-button>
            </div>
            <div>
                <div class="m-x-md p-y table">
                    <el-table
                        v-loading="searchLoading"
                        :element-loading-text="$t('common.desperatelyLoading')"
                        element-loading-color="#007213"
                        :data="tableData"
                        :height="tableHeight"
                        label-width="auto"
                        @sort-change="handleSortChange"
                        border
                        stripe
                    >
                        <!-- 处理状态 -->
                        <el-table-column
                            prop="status"
                            :label="$t('anomalyDetails.processingStatus')"
                            min-width="60px"
                        >
                            <template slot-scope="scope">
                                <span
                                    :class="
                                        scope.row.status == 0 ? 'red' : 'green'
                                    "
                                    >●</span
                                >
                                {{ showStatus(scope.row.status) }}
                            </template>
                        </el-table-column>
                        <!-- 故障类型 -->
                        <el-table-column
                            prop="faultTypeString"
                            :label="$t('deviceHealthCondition.faultType')"
                            min-width="120px"
                        ></el-table-column>
                        <!-- 设备序列号 -->
                        <el-table-column
                            prop="serialNumber"
                            :label="$t('common.deviceSerialNum')"
                            min-width="100px"
                        ></el-table-column>
                        <!-- 终端手机号 -->
                        <el-table-column
                            prop="deviceCode"
                            :label="$t('common.deviceCode')"
                            min-width="80px"
                        ></el-table-column>
                        <!-- 设备型号 -->
                        <el-table-column
                            prop="modelName"
                            :label="$t('common.deviceModelCode')"
                            min-width="100px"
                        ></el-table-column>
                        <!-- 故障开始时间 -->
                        <el-table-column
                            sortable
                            prop="collectTime"
                            :label="$t('maintainRecord.faultStartTime')"
                            min-width="100px"
                        ></el-table-column>
                        <!-- 故障可能原因 -->
                        <el-table-column
                            prop="faultReason"
                            :label="$t('handleFault.faultReason')"
                            min-width="280px"
                        ></el-table-column>
                        <!-- 解决建议 -->
                        <el-table-column
                            prop="faultSolution"
                            :label="$t('handleFault.faultSolution')"
                            width="200"
                            fixed="right"
                        ></el-table-column>
                    </el-table>
                    <div class="p-x-md wrap-bottom">
                        <el-pagination
                            :current-page="params.currentPage"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[20, 50, 100]"
                            :page-size="params.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                        >
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import TimeUtil from "@/utils/time";
export default {
    name: "handleFaultDetail",
    components: {
        TreeSelect,
    },
    data() {
        return {
            searchForm: {
                faultTypes: this.$route.query.faultTypes
                    ? this.$route.query.faultTypes.split("~")
                    : [],
                startTime: "",
                endTime: "",
            },
            searchLoading: false,
            loadingAll: false,
            time: this.$route.query.time
                ? this.$route.query.time.split("~")
                : [],
            allFaultType: [],
            total: 0,
            params: {
                pageSize: 20,
                currentPage: 1,
                status: 0,
                organizeId: this.$route.query.organizeId,
                plateNum: this.$route.query.plateNum,
                treeLevel: this.$route.query.treeLevel,
            },
            tableData: [],
            tableHeight: 500,
        };
    },
    methods: {
        //排序
        handleSortChange(column, prop, order) {
            this.params.orderDir = !column.order
                ? ""
                : column.order == "ascending"
                ? "asc"
                : "desc";
            this.params.orderColumn = !column.prop ? "" : column.prop;
            this.getData();
        },
        showStatus(status) {
            if (status == 0) {
                // return "待维护";
                return this.$t("maintainRecord.toBeMaintained");
            } else {
                // return "已解决";
                return this.$t("handleFault.resolved");
            }
        },
        getTableHeight() {
            this.tableHeight = document.body.clientHeight - 297;
        },
        // 重置表单
        handleReset() {
            this.searchForm.faultTypes = [];
            this.time = [];
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getData();
        },
        search() {
            this.getData();
        },
        getData() {
            this.searchLoading = true;
            if (this.time && this.time.length > 0) {
                this.searchForm.startTime = TimeUtil.getDateTime(this.time[0]);
                this.searchForm.endTime = TimeUtil.getDateTime(this.time[1]);
            } else {
                this.searchForm.startTime = "";
                this.searchForm.endTime = "";
            }
            let params = Object.assign(this.params, this.searchForm);
            this.$api.getFaultDetail(params).then((res) => {
                if (res.success == true) {
                    this.total = res.data.totalRecords;
                    this.tableData =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : this.tableData;
                } else {
                    this.$message.error(res.msg);
                }
                this.searchLoading = false;
            });
        },
        // 导出
        goExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                if (this.time && this.time.length > 0) {
                    this.searchForm.startTime = TimeUtil.getDateTime(
                        this.time[0]
                    );
                    this.searchForm.endTime = TimeUtil.getDateTime(
                        this.time[1]
                    );
                } else {
                    this.searchForm.startTime = "";
                    this.searchForm.endTime = "";
                }
                let params = Object.assign(this.params, this.searchForm);
                this.$api.exportMaintainFaultDetail(params).then((res) => {
                    if (res.success == true) {
                        var fileName = res.data.fileName;
                        let _this = this;
                        _this.getExportResultInterval = window.setInterval(
                            function () {
                                _this.$api
                                    .isExportFinished(fileName)
                                    .then((res1) => {
                                        if (
                                            res1.success == true &&
                                            res1.data == true
                                        ) {
                                            var iframe =
                                                document.createElement(
                                                    "iframe"
                                                );
                                            iframe.src =
                                                (process.env.BASE_API == "/"
                                                    ? ""
                                                    : process.env.BASE_API) +
                                                "/excel?fileName=" +
                                                fileName;
                                            iframe.style.display = "none";
                                            document.body.appendChild(iframe);
                                            window.clearInterval(
                                                _this.getExportResultInterval
                                            );
                                            _this.getExportResultInterval = "";
                                            _this.loadingAll = false;
                                        }
                                    });
                            },
                            2000
                        );
                    } else {
                        this.$message.error(
                            this.$t("common.exportFailed") + ":" + res.msg
                        );
                        this.loadingAll = false;
                    }
                });
            }
        },
        //获取待处理故障类型
        getAllFaultType() {
            this.$api
                .getAllSubscribeFaultType({
                    organizeId: this.$route.query.organizeId,
                })
                .then((res) => {
                    if (res.success == true) {
                        const allFaultType = res.data;
                        allFaultType.map((i) => {
                            let flag = true;
                            let indexCurrent;
                            this.allFaultType.forEach((item, index) => {
                                if (i.faultGroup == -item.id) {
                                    flag = false;
                                    indexCurrent = index;
                                }
                            });
                            if (flag) {
                                let obj = {};
                                obj.id = -i.faultGroup;
                                obj.label = i.faultGroupDesc;
                                obj.children = [];
                                obj.children.push({
                                    id: i.faultType,
                                    label: i.faultName,
                                });
                                this.allFaultType.push(obj);
                            } else {
                                this.allFaultType[indexCurrent].children.push({
                                    id: i.faultType,
                                    label: i.faultName,
                                });
                            }
                        });
                        this.$nextTick(() => {
                            this.searchForm.faultTypes = this.$route.query
                                .faultTypes
                                ? this.$route.query.faultTypes.split("~")
                                : [];
                        });
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
                that.getTableHeight();
            })();
        };
    },
    created() {
        this.getTableHeight();
        this.getAllFaultType();
        this.search();
    },
};
</script>

<style scoped lang="less">
.wrap-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.red {
    color: red;
}
.green {
    color: limegreen;
}
</style>
