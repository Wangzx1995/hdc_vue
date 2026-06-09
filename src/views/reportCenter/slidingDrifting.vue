<template>
    <div class="top">
        <div class="m-x m-t search-box" ref="searchBox">
            <div class="top-left">
                <el-form
                    ref="form"
                    label-position="top"
                    :model="searchForm"
                    inline
                >
                    <!-- 车牌号 -->
                    <el-form-item
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
                            multiple
                            collapse-tags
                            :placeholder="
                                $t('devLog.enterThreeLicensePlateNumbers')
                            "
                            v-model="searchForm.plateNums"
                        >
                            <el-option
                                v-for="item in plateArr"
                                :key="item.id"
                                :value="item.plateNum"
                                :label="item.plateNum"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 所属组织 -->
                    <el-form-item :label="$t('common.orgPath')" prop="orgId">
                        <TreeSelect
                            :placeholder="$t('common.select')"
                            :treeData="treeData"
                            style="width: 300px"
                            filter
                            v-model="searchForm.orgId"
                            :props="defaultProps"
                        >
                        </TreeSelect>
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
                    <!-- 时间范围 -->
                    <el-form-item
                        :label="$t('qualifiedProbability.timeFrame')"
                        prop="timeRange"
                    >
                        <el-date-picker
                            :clearable="false"
                            :picker-options="pickerOptions2"
                            :default-time="['00:00:00', '23:59:59']"
                            size="small"
                            v-model="timeRange"
                            type="datetimerange"
                            transfer
                            format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
                    </el-form-item>
                    <!-- 漂移速度(km/h) -->
                    <el-form-item
                        :label="$t('slidingDrifting.driftSpeed') + '(km/h)'"
                        prop="driftSpeed"
                    >
                        <el-input
                            :placeholder="$t('common.input')"
                            v-model.number="searchForm.driftSpeed"
                        >
                            <template slot="prepend">
                                <span class="fontBorder">></span></template
                            >
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="top-right">
                <el-button
                    class=""
                    type="primary"
                    :disabled="searchLoading"
                    :loading="searchLoading"
                    @click="getData(activeName)"
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

        <div class="m-x" ref="searchBtn">
            <el-button
                @click="goExport"
                :loading="loadingAll"
                :disabled="loadingAll"
            >
                <!-- 导出 -->
                {{ $t("common.export") }}
            </el-button>
        </div>
        <div class="m-x m-t">
            <el-table
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :height="tableHeight"
                :data="tableData"
                force-scroll="horizontal"
                style="width: 100%"
                v-show="activeName === '1'"
                border
                stripe
            >
                <!-- 车牌号 -->
                <el-table-column
                    prop="plateNum"
                    :label="$t('common.plateNum')"
                    width="120px"
                ></el-table-column>
                <!-- 所属组织 -->
                <el-table-column
                    prop="orgName"
                    :label="$t('common.orgPath')"
                    min-width="200px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 开始时间 -->
                <el-table-column
                    prop="startTime"
                    :label="$t('common.startTime')"
                    min-width="100px"
                ></el-table-column>
                <!-- 结束时间 -->
                <el-table-column
                    prop="endTime"
                    :label="$t('common.endTime')"
                    min-width="100px"
                ></el-table-column>
                <!-- 持续时长 -->
                <el-table-column
                    prop="durationTime"
                    :label="$t('vehicleTrackIntegrityRate.duration')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 开始位置 -->
                <el-table-column
                    prop="startPosition"
                    :label="$t('vehicleTrackIntegrityRate.startLocation')"
                    min-width="200px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 结束位置 -->
                <el-table-column
                    prop="endPosition"
                    :label="$t('vehicleTrackIntegrityRate.endLocation')"
                    min-width="200px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 漂移速度（km/h） -->
                <el-table-column
                    prop="speed"
                    :label="$t('slidingDrifting.driftSpeed') + '（km/h）'"
                    min-width="100px"
                    align="right"
                ></el-table-column>
            </el-table>
        </div>
        <div class="wrap-bottom m-t p-x" ref="searchPagination">
            <el-pagination
                :current-page="params.currentPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[20, 50, 100]"
                :disabled="searchLoading"
                :page-size="params.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import TimeUtil from "@/utils/time";
import { getAddressSingle, transferAddress } from "@/utils/getMapLocation";
export default {
    name: "groundTrackDrifting",
    components: {
        TreeSelect,
    },
    data() {
        const validateHeight = (rule, value, callback) => {
            if (!value || value < 3) {
                // 请输入大于等于3的值
                callback(
                    new Error(this.$t("slidingDrifting.validateHeightMsg1"))
                );
            } else if (!validateNum(value)) {
                // 只能输入数字值
                callback(
                    new Error(this.$t("slidingDrifting.validateHeightMsg2"))
                );
            } else {
                callback();
            }
        };
        return {
            loading: false,
            searchLoading: true,
            loadingAll: false,
            buttonClick: false,
            activeName: "1",
            startDate: "",
            endDate: "",
            searchForm: {
                orgId: "",
                plateNums: [],
                manufacturerType: 0,
                driftSpeed: "",
            },
            dateTimes: "",
            defaultProps: {
                children: "children",
                label: "name",
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                //orgId: null,
                //orderColumn: 'offlineDays', //排序列
                //orderDir: 'desc',   //排序方向
            },
            params2: {
                currentPage: 1, //页码，从1开始
                pageSize: 20,
            },
            date: new Date(new Date() - 24 * 60 * 60 * 1000),
            timeRange: [
                new Date(
                    TimeUtil.getDate(new Date() - 1 * 24 * 60 * 60 * 1000) +
                        " 00:00:00"
                ).getTime(),
                new Date(
                    TimeUtil.getDate(new Date() - 1 * 24 * 60 * 60 * 1000) +
                        " 23:59:59"
                ).getTime(),
            ],
            month: TimeUtil.oneMonthAgo(),
            total: 0,
            total2: 0,
            currentNodeId: null,
            modalOnline: false,
            tableHeight: 500,
            reportType: 0,
            onlineTimeList: [],
            totalHours: 0,
            totalMinutes: 0,
            totalSeconds: 0,
            treeData: [],
            tableData: [],
            tableData2: [],
            monthDayCount: 30,
            modalMap: false,
            rowData: {},
            treeArr: [],
            plateArr: [],
            query: "",
            rules: {
                gtOfflineDay: [{ validator: validateHeight, trigger: "blur" }],
            },
            pickerOptions2: {
                disabledDate(time) {
                    // 禁用以后的时间
                    return (
                        time.getTime() >
                        new Date(
                            TimeUtil.getDate(
                                new Date() - 1 * 24 * 60 * 60 * 1000
                            ) + " 23:59:59"
                        ).getTime()
                    );
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
        "searchForm.plateNums": {
            handler(val) {
                if (!val.length && this.query.length < 3) {
                    this.plateArr = [];
                }
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val.length < 3 && !this.searchForm.plateNums.length) {
                    this.plateArr = [];
                }
            },
            deep: true,
        },
    },
    methods: {
        getPlateNumList(params) {
            this.loading = true;
            this.$api.getCarList(params).then((res) => {
                this.plateArr = res.data.carList;
                this.loading = false;
            });
        },
        goExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
                return;
            }
            let param = {};
            console.log("this.timeRange--", this.timeRange);
            param["startDate"] = this.timeRange.length
                ? TimeUtil.getDateTime(this.timeRange[0])
                : "";
            param["endDate"] = this.timeRange.length
                ? TimeUtil.getDateTime(this.timeRange[1])
                : "";
            param = Object.assign(param, this.searchForm);
            this.loadingAll = true;
            this.$api.exportCarDriftDetails(param).then((res) => {
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
                                            document.createElement("iframe");
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
                        this.$t("common.exportFailed") + ":" +res.msg
                    );
                    this.loadingAll = false;
                }
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
        },
        // 重置表单
        handleReset(ref) {
            this.timeRange = [
                new Date(
                    TimeUtil.getDate(new Date() - 1 * 24 * 60 * 60 * 1000) +
                        " 00:00:00"
                ).getTime(),
                new Date(
                    TimeUtil.getDate(new Date() - 1 * 24 * 60 * 60 * 1000) +
                        " 23:59:59"
                ).getTime(),
            ];
            this.$refs["form"].resetFields();
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
                params.startDate = TimeUtil.getDateTime(this.timeRange[0]);
                params.endDate = TimeUtil.getDateTime(this.timeRange[1]);
            } else {
                params.startDate = "";
                params.endDate = "";
            }
            let groupParam = Object.assign(
                params,
                this.searchForm,
                this.params
            );
            this.$api
                .pageCarDriftDetails(groupParam)
                .then((res) => {
                    if (res.success == true) {
                        if (res.data.results.length) {
                            res.data.results.forEach((item) => {
                                item["durationTime"] = TimeUtil.formatSeconds(
                                    item["duration"]
                                );
                                item["startPosition"] = "";
                                item["endPosition"] = "";
                            });
                        }
                        console.log(res.data.results);
                        this.tableData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableData;
                        transferAddress(
                            this.tableData,
                            "startLongitude",
                            "startLatitude",
                            "startPosition",
                            true
                        );
                        transferAddress(
                            this.tableData,
                            "endLongitude",
                            "endLatitude",
                            "endPosition",
                            true
                        );

                        // this.tableData.forEach((item) => {
                        //     if (!item["startPosition"]) {
                        //         this.$api.getPosition({longitude: item.startLongitude,latitude: item.startLatitude,}).then((response) => {
                        //             this.$set(item,"startPosition",response.data["position"]);
                        //         });
                        //     }
                        //     if (!item["endPosition"]) {
                        //         this.$api.getPosition({longitude: item.endLongitude,latitude: item.endLatitude,}).then((response) => {
                        //             this.$set(item,"endPosition",response.data["position"]);
                        //         });
                        //     }
                        // });
                        this.total = res.data.totalRecords;
                        this.$nextTick(() => {
                            this.setTableHeight();
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                    let this_ = this;
                    setInterval(() => {
                        this_.searchLoading = false;
                    }, 2000);
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        remoteMethod(query) {
            this.query = query;
            if (query.length >= 3) {
                this.getPlateNumList({ plateNum: query });
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

        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchPagination.clientHeight -
                125;
        },
        goDetail(orgId, timeString) {
            this.$router.push({
                path: "qualifiedProbability/detail",
                query: {
                    orgId: orgId,
                    time: timeString,
                },
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
    },
    created() {
        this.getOrgTree();
        this.getData();
        // this.getPlateNumList()
        // this.changeMonthDayCount();
        console.log(new Date());
    },
};
</script>

<style lang="less" scoped>
.top {
    overflow-y: auto;
    .search-box {
        display: flex;
    }
    .top-right {
        display: flex;
        margin-top: 28px;
        height: 32px;
    }
    .top-left {
        width: calc(~"100% - 182px");
        .el-form-item {
            margin-bottom: 12px !important;
        }
    }

    .top-bottom {
        margin-bottom: 25px;
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
    border-top: 1px solid #e4e4e4;
}
</style>
