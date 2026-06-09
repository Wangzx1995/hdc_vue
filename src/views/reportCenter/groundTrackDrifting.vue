<template>
    <div class="top">
        <div class="top-left m-x" ref="searchBox">
            <el-form ref="form" label-position="top" :model="searchForm" inline>
                <el-tabs v-model="activeName" @tab-click="changeWay">
                    <el-tab-pane
                        :disabled="searchLoading"
                        label="按组织查看"
                        name="1"
                    >
                        <el-form-item label="所属组织" prop="orgId">
                            <TreeSelect
                                :treeData="treeData"
                                style="width: 300px"
                                filter
                                v-model="searchForm.orgId"
                                :props="defaultProps"
                            >
                            </TreeSelect>
                        </el-form-item>
                        <el-form-item label="时间范围" prop="timeRange">
                            <el-date-picker
                                :picker-options="pickerOptions2"
                                size="small"
                                v-model="timeRange"
                                type="daterange"
                                placeholder="请选择时间段"
                                transfer
                                :clearable="false"
                                format="yyyy-MM-dd"
                            ></el-date-picker>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane
                        :disabled="searchLoading"
                        label="按车辆查看"
                        name="2"
                    >
                        <el-form-item label="车牌号" prop="plateNums">
                            <!-- <el-input ></el-input> -->
                            <el-select
                                :remote-method="remoteMethod"
                                :loading="loading"
                                filterable
                                style="width: 300px"
                                reserve-keyword
                                remote
                                clearable
                                multiple
                                collapse-tags
                                placeholder="请输入至少三位车牌号"
                                v-model="searchForm.plateNums"
                            >
                                <el-option
                                    v-for="item in searchForm.plateArr"
                                    :key="item.id"
                                    :value="item.plateNum"
                                    :label="item.plateNum"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="时间范围" prop="timeRange">
                            <el-date-picker
                                :picker-options="pickerOptions2"
                                size="small"
                                v-model="timeRange"
                                type="daterange"
                                placeholder="请选择时间段"
                                transfer
                                :clearable="false"
                                format="yyyy-MM-dd"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="设备厂商" prop="manufacturerType">
                            <el-select
                                v-model="searchForm.manufacturerType"
                                placeholder="请选择"
                                clearable
                            >
                                <el-option
                                    :value="Number(0)"
                                    label="全部"
                                ></el-option>
                                <el-option
                                    :value="Number(1)"
                                    label="海康威视"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </div>
        <div class="top-right m-x">
            <el-button
                class=""
                type="primary"
                :disabled="searchLoading"
                :loading="searchLoading"
                @click="getData(activeName)"
                >查询</el-button
            >
            <el-button type="default" @click="handleReset($refs.searchForm)"
                >清除条件</el-button
            >
        </div>
        <div class="top-bottom m-x m-b" ref="searchBtn">
            <el-button
                v-show="activeName == '1' || activeName == '2'"
                @click="goExport"
                :loading="loadingAll"
                :disabled="loadingAll"
                v-btn="'groundTrackDriftingExport'"
                >导出</el-button
            >
        </div>
        <div class="m-x">
            <el-table
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :height="tableHeight"
                :data="tableData"
                force-scroll="horizontal"
                style="width: 100%"
                v-show="activeName === '1'"
                @sort-change="handleSortChange"
                border
                stripe
            >
                <el-table-column
                    prop="orgName"
                    label="所属组织"
                    min-width="300px"
                ></el-table-column>
                <el-table-column
                    sortable
                    prop="driftRate"
                    label="轨迹漂移率(%)"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <el-table-column
                    prop="locateNum"
                    label="定位总数"
                    min-width="100px"
                    align="right"
                >
                </el-table-column>
                <el-table-column
                    prop="driftTimes"
                    label="漂移次数"
                    min-width="100px"
                    align="right"
                >
                </el-table-column>
                <el-table-column
                    prop="carNum"
                    label="车辆数"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <el-table-column
                    prop="driftCarNum"
                    label="漂移车辆数"
                    min-width="100px"
                    align="right"
                ></el-table-column>
            </el-table>
            <el-table
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :height="tableHeight"
                :data="tableData2"
                force-scroll="horizontal"
                style="width: 100%"
                v-show="activeName === '2'"
                @sort-change="handleSortChange2"
                border
                stripe
            >
                <el-table-column
                    prop="plateNum"
                    label="车牌号"
                    width="120px"
                ></el-table-column>
                <el-table-column
                    prop="orgName"
                    label="所属组织"
                    min-width="300px"
                ></el-table-column>
                <el-table-column
                    sortable
                    prop="driftRate"
                    label="轨迹漂移率(%)"
                    min-width="120px"
                    align="right"
                ></el-table-column>
                <el-table-column
                    prop="locateNum"
                    label="定位总数"
                    min-width="100px"
                    align="right"
                >
                </el-table-column>
                <el-table-column
                    prop="driftTimes"
                    label="漂移次数"
                    min-width="100px"
                    align="right"
                >
                    <template slot-scope="scope">
                        <a
                            v-if="scope.row.driftTimes"
                            @click="
                                openDialog({
                                    plateNum: scope.row.plateNum,
                                    orgId: scope.row.orgId,
                                    orgName: scope.row.orgName,
                                })
                            "
                            >{{ scope.row.driftTimes }}</a
                        >
                        <span v-else>{{ scope.row.driftTimes }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <a
                            @click="goPlayback(scope.row)"
                            v-btn="'groundTrackDriftingTrackReplay'"
                            >轨迹回放</a
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="wrap-bottom p-x m-t" ref="searchPagination">
            <el-pagination
                v-show="activeName === '1'"
                :current-page="params.currentPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[20, 50, 100]"
                :page-size="params.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
            <el-pagination
                v-show="activeName === '2'"
                :current-page="params2.currentPage"
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                :page-sizes="[20, 50, 100]"
                :page-size="params2.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total2"
            >
            </el-pagination>
        </div>
    </div>
</template>
<script>
import TimeUtil from "@/utils/time";
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import groundTrackDriftingDetail from "./groundTrackDriftingDetail.vue";
export default {
    name: "groundTrackDrifting",
    components: {
        TreeSelect,
        groundTrackDriftingDetail,
    },
    data() {
        const validateHeight = (rule, value, callback) => {
            if (!value || value < 3) {
                callback(new Error("请输入大于等于3的值"));
            } else if (!validateNum(value)) {
                callback(new Error("只能输入数字值"));
            } else {
                callback();
            }
        };
        return {
            loading: false,
            searchLoading: true,
            loadingAll: false,
            activeName: "1",
            startDate: "",
            endDate: "",
            searchForm: {
                orgId: "",
                plateNums: [],
                manufacturerType: 0,
                plateArr: [],
            },
            defaultProps: {
                children: "children",
                label: "name",
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                //orgId: null,
                orderColumn: "offlineDays", //排序列
                orderDir: "desc", //排序方向
            },
            params2: {
                currentPage: 1, //页码，从1开始
                pageSize: 20,
                orderColumn: "offlineDays", //排序列
                orderDir: "desc",
            },
            date: new Date(new Date() - 24 * 60 * 60 * 1000),
            timeRange: [
                new Date(new Date() - 1 * 24 * 60 * 60 * 1000),
                new Date(new Date() - 1 * 24 * 60 * 60 * 1000),
            ],
            total: 0,
            total2: 0,
            tableHeight: 500,
            treeData: [],
            tableData: [],
            tableData2: [],
            treeArr: [],
            query: "",
            pickerOptions2: {
                disabledDate(time) {
                    // 禁用以后的时间
                    return time.getTime() > Date.now();
                },
            },
            currentParams: {},
        };
    },
    watch: {
        "searchForm.plateNums": {
            handler(val) {
                if (!val.length && this.query.length < 3) {
                    this.searchForm.plateArr = [];
                }
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val.length < 3 && !this.searchForm.plateNums.length) {
                    this.searchForm.plateArr = [];
                }
            },
            deep: true,
        },
    },
    methods: {
        openDialog(currentParams) {
            this.$router.push({
                path: "/reportCenter/groundTrackDrifting/groundTrackDriftingDetail",
                query: {
                    ...currentParams,
                    ...{
                        timeRange: [
                            new Date(
                                TimeUtil.getDate(this.timeRange[0]) +
                                    " 00:00:00"
                            ).getTime(),
                            new Date(
                                TimeUtil.getDate(this.timeRange[1]) +
                                    " 23:59:59"
                            ).getTime(),
                        ],
                    },
                },
            });
        },
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
        handleSortChange2(column, prop, order) {
            this.params2.orderDir = !column.order
                ? ""
                : column.order == "ascending"
                ? "asc"
                : "desc";
            this.params2.orderColumn = !column.prop ? "" : column.prop;
            this.getData();
        },
        getPlateNumList(params) {
            this.loading = true;
            this.$api.getCarList(params).then((res) => {
                this.searchForm.plateArr = res.data.carList;
                this.loading = false;
            });
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getData();
        },
        handleSizeChange2(val) {
            this.params2.pageSize = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getData();
        },
        handleCurrentChange2(val) {
            this.params2.currentPage = val;
            this.getData();
        },
        changeWay(val) {
            this.params.currentPage = 1;
            this.params.pageSize = 20;
            this.params2.currentPage = 1;
            this.params2.pageSize = 20;
            this.getData();
            this.$store.dispatch("SetTabName", this.activeName);
        },
        // 重置表单
        handleReset() {
            this.timeRange = [
                new Date(new Date() - 1 * 24 * 60 * 60 * 1000),
                new Date(new Date() - 1 * 24 * 60 * 60 * 1000),
            ];
            this.$refs["form"].resetFields();
            this.$store.dispatch("SetCondtion", this.searchForm);
            this.$store.dispatch("SetTime", this.timeRange);
        },
        remoteMethod(query) {
            this.query = query;
            if (query.length >= 3) {
                this.getPlateNumList({ plateNum: query });
            }
        },
        goExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                let param = {};
                if (this.activeName == 1) {
                    param["orgId"] = this.searchForm.orgId;
                    param["startDate"] = this.timeRange.length
                        ? TimeUtil.getDate(this.timeRange[0])
                        : "";
                    param["endDate"] = this.timeRange.length
                        ? TimeUtil.getDate(this.timeRange[1])
                        : "";
                } else {
                    param["startDate"] = this.timeRange.length
                        ? TimeUtil.getDate(this.timeRange[0])
                        : "";
                    param["endDate"] = this.timeRange.length
                        ? TimeUtil.getDate(this.timeRange[1])
                        : "";
                    param["plateNums"] = this.searchForm.plateNums;
                    param["manufacturerType"] =
                        this.searchForm.manufacturerType;
                }
                if (this.activeName == 2) {
                    //按车辆导出
                    this.loadingAll = true;
                    this.$api.exportCarDriftData(param).then((res) => {
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
                                                        : process.env
                                                              .BASE_API) +
                                                    "/excel?fileName=" +
                                                    fileName;
                                                iframe.style.display = "none";
                                                document.body.appendChild(
                                                    iframe
                                                );
                                                window.clearInterval(
                                                    _this.getExportResultInterval
                                                );
                                                _this.getExportResultInterval =
                                                    "";
                                                _this.loadingAll = false;
                                            }
                                        });
                                },
                                2000
                            );
                        } else {
                            this.$message.error("导出失败:" + res.msg);
                            this.loadingAll = false;
                        }
                    });
                } else {
                    this.loadingAll = true;
                    this.$api
                        .exportCarDriftDataGroupByOrg(param)
                        .then((res) => {
                            if (res.success == true) {
                                var fileName = res.data.fileName;
                                let _this = this;
                                _this._getExportResultInterval =
                                    window.setInterval(function () {
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
                                                        (process.env.BASE_API ==
                                                        "/"
                                                            ? ""
                                                            : process.env
                                                                  .BASE_API) +
                                                        "/excel?fileName=" +
                                                        fileName;
                                                    iframe.style.display =
                                                        "none";
                                                    document.body.appendChild(
                                                        iframe
                                                    );
                                                    window.clearInterval(
                                                        _this._getExportResultInterval
                                                    );
                                                    _this._getExportResultInterval =
                                                        "";
                                                    _this.loadingAll = false;
                                                }
                                            });
                                    }, 2000);
                            } else {
                                this.$message.error("导出失败:" + res.msg);
                                this.loadingAll = false;
                            }
                        });
                }
            }
        },
        getData(activeName) {
            if (activeName === "1") {
                this.params.currentPage = 1;
            } else if (activeName === "2") {
                this.params2.currentPage = 1;
            }
            this.searchLoading = true;
            let params = {};
            if (this.timeRange && this.timeRange.length > 0) {
                params.startDate = TimeUtil.getDate(this.timeRange[0]);
                params.endDate = TimeUtil.getDate(this.timeRange[1]);
                this.startDate = TimeUtil.getDate(this.timeRange[0]);
                this.endDate = TimeUtil.getDate(this.timeRange[1]);
            } else {
                params.startDate = "";
                params.endDate = "";
                this.startDate = "";
                this.endDate = "";
            }
            this.$store.dispatch("SetCondtion", this.searchForm);
            this.$store.dispatch("SetTime", [
                TimeUtil.getDate(this.timeRange[0]),
                TimeUtil.getDate(this.timeRange[1]),
            ]);
            this.searchForm = this.$store.state.tree.searchForm
                ? this.$store.state.tree.searchForm
                : this.searchForm;
            this.timeRange = this.$store.state.tree.time
                ? this.$store.state.tree.time
                : this.timeRange;
            console.log("this.searchForm ==", this.searchForm.manufacturerType);
            if (this.activeName == "2") {
                // 按车辆
                params.plateNums = this.searchForm.plateNums;
                params.manufacturerType = this.searchForm.manufacturerType;

                let carParam = Object.assign(params, this.params2);

                this.$api
                    .pageCarDriftData(carParam)
                    .then((res) => {
                        if (res.success == true) {
                            this.tableData2 =
                                (res.data.results.length &&
                                    res.data.totalRecords) ||
                                (!res.data.results.length &&
                                    !res.data.totalRecords)
                                    ? res.data.results
                                    : this.tableData2;
                            this.total2 = res.data.totalRecords;
                            this.$nextTick(() => {
                                this.setTableHeight();
                            });
                        } else {
                            this.$message.error("获取列表数据失败:" + res.msg);
                        }
                        this.searchLoading = false;
                    })
                    .catch((err) => {
                        this.searchLoading = false;
                    });
            } else {
                //按组织
                params.orgId = this.searchForm.orgId;

                let groupParam = Object.assign(params, this.params);
                this.$api
                    .pageCarDriftDataGroupByOrg(groupParam)
                    .then((res) => {
                        if (res.success == true) {
                            this.tableData =
                                (res.data.results.length &&
                                    res.data.totalRecords) ||
                                (!res.data.results.length &&
                                    !res.data.totalRecords)
                                    ? res.data.results
                                    : this.tableData;
                            this.total = res.data.totalRecords;
                            this.$nextTick(() => {
                                this.setTableHeight();
                            });
                        } else {
                            this.$message.error("获取列表数据失败:" + res.msg);
                        }
                        this.searchLoading = false;
                    })
                    .catch((err) => {
                        this.searchLoading = false;
                    });
            }
        },
        // 获取组织树
        getOrgTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = res.data;
                    this.treeDataToArr(res.data);
                }
            });
        },
        treeDataToArr(val, type) {
            if (type) {
                this.treeArr = [];
            }
            val.forEach((item) => {
                this.treeArr.push({
                    id: item.id,
                    name: item.name,
                });
                if (item.children.length > 0) {
                    this.treeDataToArr(item.children, "");
                }
            });
        },
        //轨迹回放
        goPlayback(item) {
            console.log(item);
            let startDate = "";
            let endDate = "";
            if (this.timeRange && this.timeRange.length > 0) {
                startDate = TimeUtil.getDate(this.timeRange[0]);
                endDate = TimeUtil.getDate(this.timeRange[1]);
            } else {
                this.timeRange = [
                    new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                    new Date(),
                ];
                startDate = TimeUtil.getDate(this.timeRange[0]);
                endDate = TimeUtil.getDate(this.timeRange[1]);
            }
            this.$router.push({
                path: "/reportCenter/groundTrackDrifting/carDetail",
                query: {
                    deviceCode: item.deviceCode,
                    plateNum: item.plateNum,
                    startDate,
                    endDate,
                },
            });
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchPagination.clientHeight -
                111;
        },
    },
    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };
        // this.getData();
    },
    created() {
        this.getOrgTree();
        // this.getPlateNumList()
        // this.changeMonthDayCount();
        if (this.$store.state.tree.tabName) {
            this.activeName = this.$store.state.tree.tabName;
        }
        this.timeRange = this.$store.state.tree.time
            ? this.$store.state.tree.time
            : this.timeRange;
        this.searchForm = this.$store.state.tree.searchForm
            ? this.$store.state.tree.searchForm
            : this.searchForm;
        console.log(
            "this.$store.state.tree.SetCondtion==",
            this.searchForm.manufacturerType
        );
        this.getData();
    },
};
</script>

<style lang="less" scoped>
/deep/.el-tabs {
    .el-tabs__header {
        margin: 0 0 12px !important;
    }
}
.top {
    position: relative;
    .top-left {
        .el-form-item {
            margin-bottom: 12px !important;
        }
    }
    .top-right {
        position: absolute;
        top: 84px;
        right: 14px;
    }
}
.blockInline {
    display: inline-block;
}
.loading_ {
    pointer-events: none;
}
.marginBottom {
    margin-bottom: 1rem;
}
.wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    .exportDownload {
        margin: -8px 0 16px;
    }

    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .wrap-top-right {
        display: flex;
        flex-direction: row-reverse;
    }
    a[disabled] {
        pointer-events: all;
    }
}
.wrap-bottom {
    width: 100%;
    border-top: 1px solid #e4e4e4;
}
.search-box {
    display: flex;
    justify-content: space-between;
    .top-right {
        margin-top: 28px;
    }
}
/deep/.el-select {
    .el-input__inner {
        height: 32px !important;
    }
}
</style>
