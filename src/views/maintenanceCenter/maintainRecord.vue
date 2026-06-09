<template>
    <div class="top wrap">
        <div ref="searchBox" class="search-module p-t" style="padding: 0">
            <div
                class="search-form-content"
                :class="{ hidden: !buttonClick }"
                ref="wrap"
            >
                <el-form ref="form" :model="searchForm" inline>
                    <!-- 发布时间段 -->
                    <el-form-item
                        :label="$t('maintainRecord.releaseTimePeriod')"
                        prop="timeRange"
                    >
                        <el-date-picker
                            :picker-options="pickerOptions2"
                            :default-time="['00:00:00', '23:59:59']"
                            size="small"
                            v-model="timeRange"
                            type="datetimerange"
                            :start-placeholder="$t('common.startTime')"
                            :end-placeholder="$t('common.endTime')"
                            transfer
                            clearable
                            format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
                    </el-form-item>
                    <!-- 车牌号 -->
                    <el-form-item :label="$t('common.plateNum')" prop="carId">
                        <el-select
                            :remote-method="remoteMethod"
                            :loading="loading"
                            filterable
                            reserve-keyword
                            remote
                            clearable
                            collapse-tags
                            :placeholder="
                                $t('devLog.enterThreeLicensePlateNumbers')
                            "
                            v-model="searchForm.carId"
                        >
                            <el-option
                                v-for="item in searchForm.plateArr"
                                :key="item.id"
                                :value="item.id"
                                :label="item.plateNum"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 所属组织 -->
                    <el-form-item
                        :label="$t('common.orgPath')"
                        prop="organizeId"
                    >
                        <TreeSelect
                            :placeholder="$t('common.select')"
                            ref="TreeSelect"
                            :treeData="treeData"
                            style="width: 300px"
                            filter
                            v-model="searchForm.organizeId"
                            :props="defaultProps"
                        >
                        </TreeSelect>
                    </el-form-item>
                    <!-- 维护状态 -->
                    <el-form-item
                        :label="$t('maintainRecord.maintenanceStatus')"
                        prop="status"
                    >
                        <el-select
                            v-model="searchForm.status"
                            :placeholder="$t('common.select')"
                            clearable
                        >
                            <!-- 全部 -->
                            <el-option
                                value=""
                                :label="$t('common.all')"
                            ></el-option>
                            <!-- 待维护 -->
                            <el-option
                                :value="Number(0)"
                                :label="$t('maintainRecord.toBeMaintained')"
                            ></el-option>
                            <!-- 已维护 -->
                            <el-option
                                :value="Number(1)"
                                :label="$t('maintainRecord.maintained')"
                            ></el-option>
                            <!-- 终止 -->
                            <el-option
                                :value="Number(2)"
                                :label="$t('maintainRecord.termination')"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 维护人员 -->
                    <el-form-item
                        :label="$t('maintainRecord.maintenanceStaff')"
                        prop="userId"
                    >
                        <el-select
                            v-model="searchForm.userId"
                            :placeholder="$t('common.select')"
                            filterable
                            clearable
                        >
                            <el-option
                                v-for="item in safeguardPersons"
                                :label="item.name"
                                :key="item.id"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div ref="searchBtn" class="search-btn">
                <el-button
                    type="primary"
                    :disabled="searchLoading"
                    :loading="searchLoading"
                    @click="
                        params.currentPage = 1;
                        getData(true);
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
                <el-button
                    :icon="
                        !buttonClick
                            ? 'el-icon-d-arrow-left'
                            : 'el-icon-d-arrow-right'
                    "
                    @click="handleClick"
                    v-if="iconShow"
                />
            </div>
        </div>
        <div class="top-bottom" ref="searchBtn">
            <el-button
                style="margin-left: 0px"
                @click="stopDids"
                :disabled="loadingAll2"
                v-btn="'maintainRecordBatchTerminationMaintenance'"
            >
                <!-- 终止 -->
                {{ $t("maintainRecord.termination") }}
            </el-button>
        </div>
        <el-table
            @sort-change="sortChange"
            @selection-change="handleSelectionChange"
            v-loading="searchLoading"
            :element-loading-text="$t('common.desperatelyLoading')"
            element-loading-color="#007213"
            :height="tableHeight"
            :data="tableData"
            force-scroll="horizontal"
            style="width: 100%"
            border
            stripe
        >
            <el-table-column
                type="selection"
                :selectable="selectable"
            ></el-table-column>
            <!-- 发布时间 -->
            <el-table-column
                sortable="custom"
                prop="createTime"
                :label="$t('maintainRecord.releaseTime')"
                min-width="120px"
            ></el-table-column>
            <!-- 车牌号 -->
            <el-table-column
                prop="plateNum"
                :label="$t('common.plateNum')"
                width="140px"
            ></el-table-column>
            <!-- 所属组织 -->
            <el-table-column
                prop="orgPath"
                :label="$t('common.orgPath')"
                min-width="300px"
            ></el-table-column>
            <!-- 状态变更时间 -->
            <el-table-column
                sortable="custom"
                prop="updateTime"
                :label="$t('maintainRecord.stateChangeTime')"
                width="170px"
            ></el-table-column>
            <!-- 维护人员 -->
            <el-table-column
                prop="maintenanerName"
                :label="$t('maintainRecord.maintenanceStaff')"
                width="100px"
            >
            </el-table-column>
            <!-- 备注信息 -->
            <el-table-column
                prop="comment"
                :label="$t('maintainRecord.memo')"
                min-width="200px"
                show-overflow-tooltip
            ></el-table-column>
            <!-- 维护状态 -->
            <el-table-column
                prop="maintenanceStatus"
                :label="$t('maintainRecord.maintenanceStatus')"
                width="100px"
            >
                <template slot-scope="scope">
                    <div>
                        {{
                            // scope.row.maintenanceStatus == 1
                            //     ? "已维护"
                            //     : scope.row.maintenanceStatus == 2
                            //     ? "终止"
                            //     : "待维护"
                            scope.row.maintenanceStatus == 1
                                ? $t("maintainRecord.maintained")
                                : scope.row.maintenanceStatus == 2
                                ? $t("maintainRecord.termination")
                                : $t("maintainRecord.toBeMaintained")
                        }}
                    </div>
                </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
                fixed="right"
                :label="$t('common.operate')"
                width="180px"
            >
                <template slot-scope="scope">
                    <a
                        class="m-r-sm colorBlue"
                        v-if="scope.row.maintenanceStatus === 0"
                        @click="stopDid(scope.row)"
                        v-btn="'maintainRecordTerminateMaintenance'"
                    >
                        <!-- 终止 -->
                        {{ $t("maintainRecord.termination") }}
                    </a>
                    <a
                        class="m-r-sm colorBlue"
                        v-if="scope.row.maintenanceStatus === 1"
                        @click="showDetail(scope.row)"
                    >
                        <!-- 详情 -->
                        {{ $t("common.detail") }}
                    </a>
                </template>
            </el-table-column>
        </el-table>
        <div class="wrap-bottom" ref="searchPagination">
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
</template>

<script>
import TimeUtil from "@/utils/time";
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
export default {
    name: "maintainRecord",
    components: {
        TreeSelect,
    },
    data() {
        return {
            startTime: "",
            endTime: "",
            loading: false,
            searchLoading: false,
            safeguardPersons: [],
            searchForm: {
                organizeId: "",
                carId: "",
                plateNum: "",
                orderDir: "desc",
                maintenanceStatus: 0,
                status: "",
                userId: "",
                plateArr: [],
                plateJson: {},
            },
            dateTimes: "",
            defaultProps: {
                children: "children",
                label: "name",
            },
            loadingAll2: false,
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                //organizeId: null,
                //orderColumn: 'offlineDays', //排序列
                //orderDir: 'desc',   //排序方向
            },
            params2: {
                currentPage: 1, //页码，从1开始
                pageSize: 20,
            },
            total: 0,
            timeRange: [
                new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                new Date(),
            ],
            month: TimeUtil.oneMonthAgo(),
            tableHeight: 500,
            reportType: 0,
            onlineTimeList: [],
            treeData: [],
            tableData: [],
            monthDayCount: 30,
            modalMap: false,
            rowData: {},
            treeArr: [],
            buttonClick: false,
            iconShow: false,
            query: "",
            ids: [],
            pickerOptions2: {
                disabledDate(time) {
                    // 禁用以后的时间
                    return time.getTime() > Date.now();
                },
            },
        };
    },
    computed: {
        monthDay() {
            return [...Array(this.monthDayCount).keys()].map((i) => i + 1);
        },
    },
    watch: {
        "searchForm.carId": {
            handler(val) {
                if (!val && this.query.length < 3) {
                    this.searchForm.plateArr = [];
                }
                this.searchForm.plateNum =
                    this.searchForm.plateJson[this.searchForm.carId] || "";
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val.length < 3 && !this.searchForm.plateNum) {
                    this.searchForm.plateArr = [];
                }
            },
            deep: true,
        },
        ids: {
            handler(val) {
                this.loadingAll2 = val.length ? false : true;
            },
            immediate: true,
        },
    },
    methods: {
        //对接接口的排序方法
        sortChange(column, prop, order) {
            this.searchForm.orderDir = !column.order
                ? ""
                : column.order === "ascending"
                ? "asc"
                : "desc";
            this.searchForm.orderColumn = !column.prop ? "" : column.prop;
            this.getData();
        },
        getPlateNumList(params) {
            this.loading = true;
            this.$api.getCarList(params).then((res) => {
                this.searchForm.plateArr = res.data.carList;
                if (this.searchForm.plateArr.length) {
                    res.data.carList.forEach((item) => {
                        this.searchForm.plateJson[item.id] = item.plateNum;
                    });
                }
                this.loading = false;
            });
        },
        remoteMethod(query) {
            this.query = query;
            if (query.length >= 3) {
                this.getPlateNumList({ plateNum: query });
            }
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getData();
        },
        selectable(row, index) {
            return row.maintenanceStatus === 0;
        },
        handleSelectionChange(selection) {
            this.ids = [];
            selection.forEach((item) => {
                this.ids.push(item.id);
            });
        },
        // 重置表单
        handleReset(ref) {
            this.timeRange = [
                new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                new Date(),
            ];
            this.searchForm.organizeId = "";
            this.$refs["form"].resetFields();
            this.$store.dispatch("SetCondtion", this.searchForm);
        },
        //获取当前用户的组织
        getOrgTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = res.data;
                    this.$nextTick(() => {
                        this.getData();
                        if (this.searchForm.organizeId) {
                            this.$refs.TreeSelect.setValue(
                                this.searchForm.organizeId
                            );
                        }
                    });
                }
            });
        },
        //终止维护-单个
        stopDid(item) {
            this.$confirm(
                // "确认终止该维护任务吗？"
                this.$t("maintainRecord.stopDidText1"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    let params = { ids: [item.id] };
                    this.$api.faultMaintenanceTerminal(params).then((res) => {
                        if (res.success) {
                            // 终止任务成功！
                            this.$message.success(
                                this.$t("maintainRecord.stopDidText2") + "!"
                            );
                            this.getData();
                        } else {
                            // 终止任务失败
                            this.$message.error(
                                `${this.$t("maintainRecord.stopDidText3")}:${
                                    res.msg
                                }`
                            );
                        }
                    });
                })
                .catch(() => {});
        },
        //终止维护-批量
        stopDids() {
            if (!this.ids.length) {
                // 请至少选择一个待维护任务
                this.$message.info(this.$t("maintainRecord.stopDidText4"));
            } else {
                // this.$confirm(`确认批量终止${this.ids.length}个维护任务吗？`, {
                this.$confirm(
                    `${this.$t("maintainRecord.stopDidText5")}${
                        this.ids.length
                    }${this.$t("maintainRecord.stopDidText6")}？`,
                    {
                        confirmButtonText: this.$t("common.ok"),
                        cancelButtonText: this.$t("common.cancel"),
                        type: "warning",
                    }
                )
                    .then(() => {
                        let params = { ids: this.ids };
                        this.$api
                            .faultMaintenanceTerminal(params)
                            .then((res) => {
                                if (res.success) {
                                    // 批量终止任务成功！
                                    this.$message.success(
                                        this.$t("maintainRecord.stopDidText7") +
                                            `！`
                                    );
                                    this.getData();
                                } else {
                                    // 批量终止任务失败
                                    this.$message.error(
                                        `${this.$t(
                                            "maintainRecord.stopDidText8"
                                        )}:${res.msg}`
                                    );
                                }
                            });
                    })
                    .catch(() => {});
            }
        },
        //查看详情
        showDetail(item) {
            this.$router.push({
                path: "/maintenanceCenter/maintainRecord/maintainRecordDetail",
                query: {
                    id: item.id,
                },
            });
        },
        //查询
        getData(isSetCondtion) {
            this.searchLoading = true;
            let params = {};
            if (this.timeRange && this.timeRange.length > 0) {
                params.startTime = TimeUtil.getDateTime(this.timeRange[0]);
                params.endTime = TimeUtil.getDateTime(this.timeRange[1]);
                this.startTime = TimeUtil.getDateTime(this.timeRange[0]);
                this.endTime = TimeUtil.getDateTime(this.timeRange[1]);
            } else {
                params.startTime = "";
                params.endTime = "";
                this.startTime = "";
                this.endTime = "";
            }
            this.$store.dispatch("SetTime", this.timeRange);
            // this.searchForm = this.$store.state.tree.searchForm
            //     ? this.$store.state.tree.searchForm
            //     : this.searchForm;
            let carParam = Object.assign(params, this.searchForm, this.params);
            //carParam['organizeId'] = ''
            this.$api
                .faultMaintenancePage(carParam)
                .then((res) => {
                    if (res.success == true) {
                        if (isSetCondtion) {
                            this.$store.dispatch("SetCondtion", {
                                ...this.searchForm,
                            });
                        }
                        this.tableData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableData;
                        this.total = res.data.totalRecords;
                        this.$nextTick(() => {
                            this.setTableHeight();
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
        // 获取维修人员
        getuserList() {
            this.$api.faultMaintenanceUserList().then((res) => {
                if (res.success == true) {
                    this.safeguardPersons = res.data;
                } else {
                    this.$message.error(`${res.msg}`);
                }
            });
        },
        //查询重叠
        handleClick() {
            this.buttonClick = !this.buttonClick;
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchPagination.clientHeight -
                97;
        },
        setWrap() {
            if (this.$refs.wrap.scrollHeight > 46) {
                this.iconShow = true;
            } else {
                this.iconShow = false;
            }
        },
    },
    mounted() {
        this.setWrap();
        const that = this;
        window.onresize = () =>
            (() => {
                that.setTableHeight();
                that.setWrap();
            })();
    },
    created() {
        if (this.$store.state.tree.searchForm) {
            this.searchForm.plateNum = this.$store.state.tree.searchForm
                .plateNum
                ? this.$store.state.tree.searchForm.plateNum
                : [];
            this.searchForm.organizeId = this.$store.state.tree.searchForm
                .organizeId
                ? this.$store.state.tree.searchForm.organizeId
                : [];
            this.searchForm.status =
                this.$store.state.tree.searchForm.status === 0 ||
                this.$store.state.tree.searchForm.status === 1 ||
                this.$store.state.tree.searchForm.status === 2
                    ? this.$store.state.tree.searchForm.status
                    : "";
            this.searchForm.userId = this.$store.state.tree.searchForm.userId
                ? this.$store.state.tree.searchForm.userId
                : [];
            this.timeRange = this.$store.state.tree.searchForm.startTime
                ? [
                      new Date(this.$store.state.tree.searchForm.startTime),
                      new Date(this.$store.state.tree.searchForm.endTime),
                  ]
                : this.timeRange;
        }
        this.getuserList();
        this.getOrgTree();
    },
};
</script>

<style lang="less" scoped>
.top {
    padding: 0px 14px;
    .top-right {
        float: right;
        margin-top: -57px;
    }
    .top-bottom {
        margin-bottom: 1rem;
    }
}

.marginBottom {
    margin-bottom: 1rem;
}
.wrap {
    height: calc(~"100% - 33px");
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .flex {
            display: flex;
        }
        .el-form-item {
            margin-bottom: 12px !important;
        }
    }
    .hidden {
        height: 46px;
        overflow: hidden;
    }
    .wrap-bottom {
        border-top: 1px solid #e4e4e4;
    }
}
</style>
