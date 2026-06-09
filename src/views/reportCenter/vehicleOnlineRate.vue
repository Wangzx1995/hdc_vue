<template>
    <div class="vehicle-online-rate">
        <div class="wrap">
            <div class="m-x tab-box" ref="searchBtn">
                <div>
                    <el-tabs v-model="activeName" @tab-click="changeWay">
                        <!-- 按组织查看 -->
                        <el-tab-pane
                            :disabled="searchLoading"
                            :label="
                                $t('qualifiedProbability.viewByOrganization')
                            "
                            name="1"
                        ></el-tab-pane>
                        <!-- 按车辆查看 -->
                        <el-tab-pane
                            :disabled="searchLoading"
                            :label="$t('qualifiedProbability.viewByVehicle')"
                            name="2"
                        ></el-tab-pane>
                    </el-tabs>
                </div>
                <div class="wrap-top-right">
                    <el-date-picker
                        v-model="month"
                        type="month"
                        :disabled="searchLoading"
                        :clearable="false"
                        format="yyyy-MM"
                        :picker-options="pickerOptions"
                    ></el-date-picker>
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
            </div>
            <div class="m-x" ref="searchBox">
                <div class="wrap-top" v-show="activeName == '1'">
                    <div class="">
                        <el-form
                            :model="searchForm1"
                            inline
                            label-position="top"
                            ref="searchForm1"
                        >
                            <!-- 所属组织 -->
                            <el-form-item
                                :label="$t('common.orgPath')"
                                prop="organizeId"
                            >
                                <TreeSelect
                                    :placeholder="$t('common.select')"
                                    :treeData="treeData"
                                    style="width: 300px"
                                    filter
                                    v-model="searchForm1.organizeId"
                                    :props="defaultProps"
                                >
                                </TreeSelect>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="m-t p-t">
                        <el-button
                            type="primary"
                            :loading="searchLoading"
                            @click="
                                params.currentPage = 1;
                                getData();
                            "
                        >
                            <!-- 查询 -->
                            {{ $t("common.search") }}
                        </el-button>
                        <el-button
                            type="default"
                            @click="handleReset($refs.searchForm1)"
                        >
                            <!-- 清除条件 -->
                            {{ $t("common.reset") }}
                        </el-button>
                    </div>
                </div>
                <div class="wrap-top" v-show="activeName == '2'">
                    <div>
                        <el-form
                            :model="searchForm"
                            label-position="top"
                            inline
                            ref="searchForm"
                        >
                            <!-- 所属组织 -->
                            <el-form-item
                                :label="$t('common.orgPath')"
                                prop="organizeId"
                            >
                                <TreeSelect
                                    :placeholder="$t('common.select')"
                                    :treeData="treeData"
                                    style="width: 300px"
                                    filter
                                    v-model="searchForm.organizeId"
                                    :props="defaultProps"
                                >
                                </TreeSelect>
                            </el-form-item>
                            <!-- 车牌号 -->
                            <el-form-item
                                style="margin-left: -8px"
                                :label="$t('common.plateNum')"
                                prop="plateNums"
                            >
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
                                    :placeholder="
                                        $t(
                                            'devLog.enterThreeLicensePlateNumbers'
                                        )
                                    "
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
                            <!-- 设备厂商 -->
                            <el-form-item
                                :label="$t('common.manufacturerNameString')"
                                prop="manufacturerType"
                            >
                                <el-select
                                    v-model="searchForm.manufacturerType"
                                    :placeholder="$t('common.select')"
                                    clearable
                                >
                                    <el-option
                                        :value="Number(0)"
                                        :label="$t('common.all')"
                                    ></el-option>
                                    <el-option
                                        :value="Number(1)"
                                        :label="$t('common.hikvision')"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="m-t p-t btn-box">
                        <div>
                            <i class="el-icon-error text-error"></i
                            ><span
                                >：
                                <!-- 当天上线小于30min/未上线 -->
                                {{ $t("vehicleOnlineRate.notOnline30min") }}
                            </span>
                            <i class="el-icon-success text-success"></i
                            ><span
                                >：
                                <!-- 当天有上线 -->
                                {{ $t("vehicleOnlineRate.onlineToday") }}
                            </span>
                        </div>
                        <el-button
                            type="primary"
                            :disabled="searchLoading"
                            :loading="searchLoading"
                            @click="
                                params2.currentPage = 1;
                                getData();
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
                    <!-- 组织名称 -->
                    <el-table-column
                        prop="orgName"
                        :label="$t('vehicleTrackIntegrityRate.orgName')"
                        min-width="120px"
                        show-overflow-tooltip
                    ></el-table-column>
                    <!-- 所属组织 -->
                    <el-table-column
                        prop="orgPath"
                        :label="$t('common.orgPath')"
                        min-width="100px"
                        show-overflow-tooltip
                    ></el-table-column>
                    <!-- 上线率（%） -->
                    <el-table-column
                        sortable
                        align="right"
                        prop="onlineRate"
                        :label="$t('vehicleOnlineRate.onlineRate') + '（%）'"
                        min-width="120px"
                    ></el-table-column>
                    <!-- 操作 -->
                    <el-table-column
                        prop="orgId"
                        :label="$t('common.operate')"
                        min-width="100px"
                    >
                        <template slot-scope="scope">
                            <a
                                @click="
                                    goDetail(scope.row.orgId, scope.row.orgName)
                                "
                            >
                                <!-- 详情 -->
                                {{ $t("common.detail") }}
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table
                    ref="mainTable"
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
                    <!-- 车牌号 -->
                    <el-table-column
                        prop="plateNum"
                        :label="$t('common.plateNum')"
                        fixed
                        min-width="100px"
                    ></el-table-column>
                    <!-- 组织名称 -->
                    <el-table-column
                        prop="orgName"
                        :label="$t('vehicleTrackIntegrityRate.orgName')"
                        min-width="140px"
                        show-overflow-tooltip
                    ></el-table-column>
                    <!-- 所属组织 -->
                    <el-table-column
                        prop="orgPath"
                        :label="$t('common.orgPath')"
                        min-width="100px"
                        show-overflow-tooltip
                    ></el-table-column>
                    <!-- 在线时长（h） -->
                    <el-table-column
                        align="right"
                        sortable
                        prop="onlineTimeHour"
                        :label="
                            $t('vehicleOnlineRate.onlineDuration') + '（h）'
                        "
                        min-width="160px"
                    ></el-table-column>
                    <!-- 上线天数 -->
                    <el-table-column
                        align="right"
                        sortable
                        prop="upLineDay"
                        :label="$t('vehicleOnlineRate.onlineDays')"
                        min-width="140px"
                    ></el-table-column>
                    <el-table-column
                        v-for="(item, index) in monthDay"
                        :label="String(item)"
                        :key="String(monthDay.length) + index"
                        :fixed="item == monthDay.length ? 'right' : false"
                        align="right"
                    >
                        <template slot-scope="scope">
                            <div
                                v-for="i in scope.row.upLineStatusList"
                                :key="i.index"
                            >
                                <i
                                    v-if="i.day == item && i.isUpline == 1"
                                    class="el-icon-success text-success"
                                ></i>
                                <i
                                    v-else-if="i.day == item && i.isUpline == 0"
                                    class="el-icon-error text-error"
                                ></i>
                                <span v-else-if="i.day == item">--</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="p-x m-t wrap-bottom" ref="searchPagination">
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
    </div>
</template>

<script>
import TimeUtil from "@/utils/time";
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
export default {
    name: "vehicleTrackIntegrityRate",
    components: {
        TreeSelect,
    },
    data() {
        return {
            loading: true,
            searchLoading: true,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > TimeUtil.oneMonthAgo();
                },
            },
            loadingAll: false,
            tableHeight: 500,
            activeName: "1",
            month: new Date(),
            searchForm: {
                plateNum: "",
                plateNums: [],
                plateArr: [],
                manufacturerType: 0,
                organizeId: "",
            },
            searchForm1: {
                organizeId: "",
            },

            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "", //排序列
                orderDir: "",
            },
            params2: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "", //排序列
                orderDir: "",
            },
            tableData: [],
            tableData2: [],
            total: 0,
            total2: 0,
            monthDayCount: 30,
            treeData: [],
            defaultProps: {
                children: "children",
                label: "name",
            },
            query: "",
        };
    },
    computed: {
        monthDay() {
            return [...Array(this.monthDayCount).keys()].map((i) => i + 1);
        },
    },
    watch: {
        month: {
            handler(val) {
                // if(val.includes('/')){
                //   let arr = this.month.split('/')
                //   this.month=arr.join('-')
                // }else {
                this.params.currentPage = 1;
                this.params2.currentPage = 1;
                this.changeMonthDayCount();
                this.getData();
                // }
            },
            deep: true,
        },
        tableData2: {
            handler() {
                this.$nextTick(() => {
                    this.$refs.mainTable.doLayout();
                });
            },
            deep: true,
        },
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
        //远程搜索
        remoteMethod(query) {
            this.query = query;
            if (query.length >= 3) {
                this.getPlateNumList({ plateNum: query });
            }
        },
        //获取车牌号
        getPlateNumList(params) {
            this.loading = true;
            this.$api.getCarList(params).then((res) => {
                this.searchForm.plateArr = res.data.carList;
                this.loading = false;
            });
        },
        //获取组织选项
        getOrgTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = res.data;
                    //this.treeDataToArr(res.data)
                }
            });
        },
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
            this.params2.orderColumn = !column.prop
                ? ""
                : column.prop == "onlineTimeHour"
                ? "onlineTime"
                : column.prop;
            this.getData();
        },
        changeMonthDayCount() {
            let arr = TimeUtil.format(this.month, "YYYY-MM").split("-");
            this.monthDayCount = new Date(arr[0], arr[1], 0).getDate();
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
        goExport() {
            if (!this.month) {
                // this.$message.warning("请先选择日期");
                this.$message.warning(
                    this.$t("vehicleOnlineRate.pleaseSelectDateFirst")
                );
                return;
            }
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                let param = {};
                for (let key in this.searchForm) {
                    if (key != "plateArr") {
                        param[key] = this.searchForm[key];
                    }
                }
                let params = {};
                params.month = TimeUtil.format(this.month, "YYYY-MM");
                params.organizeId = this.searchForm1.organizeId;

                if (this.activeName == "1") {
                    this.$api.exportCarOnlineRate(params).then((res) => {
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
                            this.$message.error(
                                this.$t("common.exportFailed") + ":" + res.msg
                            );
                            this.loadingAll = false;
                        }
                    });
                } else if (this.activeName == "2") {
                    let carParam = Object.assign(params, param);
                    this.$api
                        .exportCarOnlineRateGroupByCar(carParam)
                        .then((res) => {
                            if (res.success == true) {
                                var fileName = res.data.fileName;
                                let _this = this;
                                _this.getExportResultInterval =
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
                                                        _this.getExportResultInterval
                                                    );
                                                    _this.getExportResultInterval =
                                                        "";
                                                    _this.loadingAll = false;
                                                }
                                            });
                                    }, 2000);
                            } else {
                                this.$message.error(
                                    this.$t("common.exportFailed") +
                                        ":" +
                                        +res.msg
                                );
                                this.loadingAll = false;
                            }
                        });
                }
            }
        },
        goDetail(id, orgName) {
            this.$router.push({
                path: "/reportCenter/vehicleOnlineRate/detail",
                query: {
                    organizeId: id,
                    orgName,
                    month: TimeUtil.format(this.month, "YYYY-MM"),
                },
            });
        },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
            }
        },
        changeWay() {
            this.searchForm.manufacturerType = 0;
            this.searchForm.plateNums = [];
            this.searchForm.plateArr = [];
            this.tableData = [];
            this.tableData2 = [];
            this.total = 0;
            this.total2 = 0;
            this.params.currentPage = 1;
            this.params2.currentPage = 1;
            this.params.pageSize = 20;
            this.params2.pageSize = 20;
            this.getData();
        },
        getData() {
            if (!this.month) {
                // this.$message.warning("请选择月份");
                this.$message.warning(
                    this.$t("vehicleOnlineRate.pleaseSelectMonthFirst")
                );
                return;
            }
            this.searchLoading = true;
            let params = {};
            params.month = TimeUtil.format(this.month, "YYYY-MM");
            if (this.activeName == "2") {
                // 按车辆
                let param = {};
                for (let key in this.searchForm) {
                    if (key != "plateArr") {
                        param[key] = this.searchForm[key];
                    }
                }
                let carParam = Object.assign(params, param, this.params2);
                this.$api
                    .pageCarOnlineGroupByCar(carParam)
                    .then((res) => {
                        if (res.success == true) {
                            res.data.results.forEach((item) => {
                                item.onlineTimeHour = item.onlineTimeHour
                                    ? Number(item.onlineTimeHour.toFixed(2))
                                    : 0.0;
                                // item.upLineDay = item.upLineDay ? Number(item.upLineDay.toFixed(2)):0.00
                            });
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
                            this.$message.error(res.msg);
                        }
                        this.searchLoading = false;
                    })
                    .catch((err) => {
                        this.searchLoading = false;
                    });
            } else {
                //按组织
                let groupParam = Object.assign(
                    params,
                    this.searchForm1,
                    this.params
                );
                this.$api
                    .pageCarOnlineRate(groupParam)
                    .then((res) => {
                        if (res.success == true) {
                            res.data.results.forEach((item) => {
                                item.onlineRate = item.onlineRate
                                    ? Number((item.onlineRate * 100).toFixed(2))
                                    : 0.0;
                            });
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
                            this.$message.error(res.msg);
                        }
                        this.searchLoading = false;
                    })
                    .catch((err) => {
                        this.searchLoading = false;
                    });
            }
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchPagination.clientHeight -
                97;
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
        this.changeMonthDayCount();
        this.getData();
        this.getOrgTree();
    },
};
</script>

<style lang="less" scoped>
/deep/.el-tabs {
    .el-tabs__header {
        margin: 0 0 12px !important;
    }
}
.tab-box {
    position: relative;
}
.wrap {
    height: 100%;
    .wrap-bottom {
        border-top: 1px solid #e4e4e4;
    }
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .wrap-top-right {
        position: absolute;
        right: 0px;
        top: 5px;
        display: flex;
        .goExport {
            margin-left: 10px;
        }
    }
    i {
        font-size: 20px;
    }
}
.btn-box {
    display: flex;
    align-items: flex-start;
    & > div {
        display: flex;
        align-items: center;
        margin-right: 24px;
        margin-top: 6px;
        i {
            margin-left: 24px;
        }
    }
}
/deep/.el-select {
    .el-input__inner {
        height: 32px !important;
    }
}
</style>
