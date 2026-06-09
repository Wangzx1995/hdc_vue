<template>
    <div class="top">
        <div class="top-left m-x" ref="searchBox">
            <el-form ref="form" label-position="top" :model="searchForm" inline>
                <el-tabs v-model="activeName" @tab-click="changeWay">
                    <!-- 按组织查看 -->
                    <el-tab-pane
                        :disabled="searchLoading"
                        :label="$t('qualifiedProbability.viewByOrganization')"
                        name="1"
                    >
                        <!-- 所属组织 -->
                        <el-form-item
                            :label="$t('common.orgPath')"
                            prop="orgId"
                        >
                            <TreeSelect
                                :treeData="treeData"
                                style="width: 300px"
                                ref="asyncTree"
                                filter
                                v-model="searchForm.orgId"
                                :props="defaultProps"
                            >
                            </TreeSelect>
                        </el-form-item>
                        <!-- 时间范围 -->
                        <el-form-item
                            :label="$t('qualifiedProbability.timeFrame')"
                            prop="timeRange"
                        >
                            <el-date-picker
                                :picker-options="pickerOptions2"
                                size="small"
                                v-model="timeRange"
                                type="daterange"
                                :placeholder="$t('common.select')"
                                transfer
                                clearable
                                format="yyyy-MM-dd"
                            ></el-date-picker>
                        </el-form-item>
                        <!-- 数据合格率(%) -->
                        <el-form-item
                            :label="
                                $t(
                                    'qualifiedProbability.dataQualificationRate'
                                ) + '(%)'
                            "
                            prop="numberRange"
                        >
                            <input-number-range
                                v-model="searchForm.numberRange"
                            ></input-number-range>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 按车辆查看 -->
                    <el-tab-pane
                        :disabled="searchLoading"
                        :label="$t('qualifiedProbability.viewByVehicle')"
                        name="2"
                    >
                        <!-- 所属组织 -->
                        <el-form-item
                            :label="$t('common.orgPath')"
                            prop="orgId2"
                        >
                            <TreeSelect
                                :treeData="treeData"
                                style="width: 300px"
                                ref="asyncTree"
                                filter
                                v-model="searchForm.orgId2"
                                :props="defaultProps"
                            >
                            </TreeSelect>
                        </el-form-item>
                        <!-- 车牌号 -->
                        <el-form-item
                            :label="$t('common.plateNum')"
                            prop="plateNums"
                        >
                            <el-select
                                :remote-method="remoteMethod"
                                :loading="loading"
                                filterable
                                style="width: 300px; height: 32px"
                                reserve-keyword
                                remote
                                clearable
                                multiple
                                collapse-tags
                                :placeholder="
                                    $t('devLog.enterThreeLicensePlateNumbers')
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
                        <!-- 时间范围 -->
                        <el-form-item
                            :label="$t('qualifiedProbability.timeFrame')"
                            prop="timeRange"
                        >
                            <el-date-picker
                                :picker-options="pickerOptions2"
                                size="small"
                                v-model="timeRange"
                                type="daterange"
                                transfer
                                clearable
                                format="yyyy-MM-dd"
                            ></el-date-picker>
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
                        <!-- 数据合格率 -->
                        <el-form-item
                            :label="
                                $t(
                                    'qualifiedProbability.dataQualificationRate'
                                ) + '(%)'
                            "
                            prop="numberRange"
                        >
                            <input-number-range
                                v-model="searchForm.numberRange"
                            ></input-number-range>
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
            >
                <!-- 查询 -->
                {{ $t("common.search") }}
            </el-button>
            <el-button type="default" @click="handleReset($refs.searchForm)">
                <!-- 清除条件 -->
                {{ $t("common.reset") }}
            </el-button>
        </div>
        <div class="top-bottom m-x m-b" ref="searchBtn">
            <el-button
                v-show="activeName == '1'"
                @click="goExport"
                :loading="loadingAll"
                :disabled="loadingAll"
            >
                <!-- 导出 -->
                {{ $t("common.export") }}
            </el-button>
            <el-button
                style="margin-left: 0px"
                v-show="activeName == '2'"
                @click="goExport"
                :loading="loadingAll2"
                :disabled="loadingAll2"
            >
                <!-- 导出 -->
                {{ $t("common.export") }}
            </el-button>
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
                ref="table1"
                border
                stripe
            >
                <!-- 所属组织 -->
                <el-table-column
                    prop="orgName"
                    :label="$t('common.orgPath')"
                    min-width="300px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 合格数 -->
                <el-table-column
                    prop="qualificationNum"
                    :label="$t('qualifiedProbability.qualifiedQuantity')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 总记录数 -->
                <el-table-column
                    prop="totalNum"
                    :label="$t('qualifiedProbability.totalNumberRecords')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 合格率(%) -->
                <el-table-column
                    sortable
                    prop="qualificationRate"
                    :label="$t('qualifiedProbability.passRate') + '(%)'"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 未定位数 -->
                <el-table-column
                    prop="unlocateNum"
                    :label="$t('qualifiedProbability.unlocateNum')"
                    min-width="100px"
                    align="right"
                >
                </el-table-column>
                <!-- 经度错误数 -->
                <el-table-column
                    sortable
                    prop="longitudeErrorNum"
                    :label="$t('qualifiedProbability.longitudeErrorNum')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 纬度错误数 -->
                <el-table-column
                    sortable
                    prop="latitudeErrorNum"
                    :label="$t('qualifiedProbability.latitudeErrorNum')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 速度错误数 -->
                <el-table-column
                    sortable
                    prop="speedErrorNum"
                    :label="$t('qualifiedProbability.speedErrorNum')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 高度错误数 -->
                <el-table-column
                    sortable
                    prop="heightErrorNum"
                    :label="$t('qualifiedProbability.heightErrorNum')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 方向错误数 -->
                <el-table-column
                    sortable
                    prop="directionErrorNum"
                    :label="$t('qualifiedProbability.directionErrorNum')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 卫星时间错误数 -->
                <el-table-column
                    sortable
                    prop="timeErrorNum"
                    :label="$t('qualifiedProbability.timeErrorNum')"
                    min-width="120px"
                    align="right"
                ></el-table-column>
                <!-- 操作 -->
                <el-table-column
                    prop="orgId"
                    fixed="right"
                    :label="$t('common.operate')"
                    width="100px"
                >
                    <template slot-scope="scope">
                        <a
                            @click="
                                goDetail(
                                    scope.row.orgId,
                                    `${startDate}~${endDate}`
                                )
                            "
                        >
                            <!-- 详情 -->
                            {{ $t("common.detail") }}
                        </a>
                    </template>
                </el-table-column>
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
                ref="table2"
                border
                stripe
            >
                <!-- 车牌号 -->
                <el-table-column
                    prop="plateNum"
                    :label="$t('common.plateNum')"
                    min-width="140px"
                ></el-table-column>
                <!-- 所属组织 -->
                <el-table-column
                    prop="orgName"
                    :label="$t('common.orgPath')"
                    min-width="120px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 合格数 -->
                <el-table-column
                    prop="qualificationNum"
                    :label="$t('qualifiedProbability.qualifiedQuantity')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 总记录数 -->
                <el-table-column
                    prop="totalNum"
                    :label="$t('qualifiedProbability.totalNumberRecords')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 合格率(%) -->
                <el-table-column
                    sortable
                    prop="qualificationRate"
                    :label="$t('qualifiedProbability.passRate') + '(%)'"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 未定位数 -->
                <el-table-column
                    prop="unlocateNum"
                    :label="$t('qualifiedProbability.unlocateNum')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 经度错误数 -->
                <el-table-column
                    sortable
                    prop="longitudeErrorNum"
                    :label="$t('qualifiedProbability.longitudeErrorNum')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 纬度错误数 -->
                <el-table-column
                    sortable
                    prop="latitudeErrorNum"
                    :label="$t('qualifiedProbability.latitudeErrorNum')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 速度错误数 -->
                <el-table-column
                    sortable
                    prop="speedErrorNum"
                    :label="$t('qualifiedProbability.speedErrorNum')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 高度错误数 -->
                <el-table-column
                    sortable
                    prop="heightErrorNum"
                    :label="$t('qualifiedProbability.heightErrorNum')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 方向错误数 -->
                <el-table-column
                    sortable
                    prop="directionErrorNum"
                    :label="$t('qualifiedProbability.directionErrorNum')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 卫星时间错误数 -->
                <el-table-column
                    sortable
                    prop="timeErrorNum"
                    :label="$t('qualifiedProbability.timeErrorNum')"
                    min-width="120px"
                    align="right"
                ></el-table-column>
                <!-- 终端手机号 -->
                <el-table-column
                    prop="deviceCodes"
                    :label="$t('common.deviceCode')"
                    min-width="100px"
                ></el-table-column>
                <!-- 操作 -->
                <el-table-column
                    fixed="right"
                    :label="$t('common.operate')"
                    width="100px"
                >
                    <template slot-scope="scope">
                        <a @click="goPlayback(scope.row)">
                            <!-- 轨迹回放 -->
                            {{ $t("qualifiedProbability.trackPlayback") }}
                        </a>
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
        <!-- 轨迹回放 -->
        <el-dialog
            :title="$t('qualifiedProbability.trackPlayback')"
            :visible.sync="trackPlaybackVisible"
            :close-on-click-modal="false"
            :width="'1200px'"
            :custom-class="'track-playback-dialog'"
        >
            <qualified-probability-dialog
                :key="timer"
                @cancel="cancel"
            ></qualified-probability-dialog>
        </el-dialog>
    </div>
</template>

<script>
import TimeUtil from "@/utils/time";
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import InputNumberRange from "@/components/inputNumberRange.vue";
import qualifiedProbabilityDialog from "./qualifiedProbabilityDialog.vue";

export default {
    name: "qualifiedProbability",
    components: {
        TreeSelect,
        InputNumberRange,
        qualifiedProbabilityDialog,
    },
    data() {
        const validateHeight = (rule, value, callback) => {
            if (!value || value < 3) {
                // 请输入大于等于3的值
                callback(
                    new Error(
                        this.$t("qualifiedProbability.validateHeightMsg1")
                    )
                );
            } else if (!validateNum(value)) {
                // 只能输入数字值
                callback(
                    new Error(
                        this.$t("qualifiedProbability.validateHeightMsg2")
                    )
                );
            } else {
                callback();
            }
        };
        return {
            timer: null,
            trackPlaybackVisible: false,
            loading: false,
            searchLoading: true,
            loadingAll: false,
            loadingAll2: false,
            buttonClick: false,
            activeName: "1",
            startDate: "",
            endDate: "",
            searchForm: {
                numberRange: [],
                orgId: "",
                orgId2: "",
                plateNums: [],
                manufacturerType: 0,
                plateArr: [],
                maxQualificationRate: "",
                minQualificationRate: "",
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
                orderColumn: "", //排序列
                orderDir: "", //排序方向
            },
            params2: {
                currentPage: 1, //页码，从1开始
                pageSize: 20,
                orderColumn: "", //排序列
                orderDir: "",
            },
            date: new Date(new Date() - 24 * 60 * 60 * 1000),
            timeRange: [],
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
            query: "",
            rules: {
                gtOfflineDay: [{ validator: validateHeight, trigger: "blur" }],
            },
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
        "searchForm.numberRange": {
            handler(val) {
                this.searchForm.maxQualificationRate = val[1];
                this.searchForm.minQualificationRate = val[0];
            },
            immediate: true,
        },
    },
    methods: {
        //排序
        handleSortChange(column, prop, order) {
            console.log(column.order);
            this.params.orderDir = !column.order
                ? ""
                : column.order == "ascending"
                ? "asc"
                : "desc";
            this.params.orderColumn = !column.prop ? "" : column.prop;
            console.log(this.params.orderDir);
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
            // this.timeRange = [
            //     new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
            //     new Date(),
            // ];
            this.$store.dispatch("RemoveCondition");
            this.$store.dispatch("RemoveTime");
            this.$store.dispatch("SetTabName", this.activeName);
            this.getData();
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        // 重置表单
        handleReset(ref) {
            this.timeRange = [
                new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                new Date(),
            ];
            this.$refs["form"].resetFields();
            this.$store.dispatch("SetCondtion", this.searchForm);
            this.$store.dispatch("SetTime", this.timeRange);
        },
        goExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                let param = {};
                if (this.activeName == 1) {
                    param["orgId"] = this.searchForm.orgId | "";
                    param["startDate"] =
                        this.timeRange && this.timeRange.length
                            ? TimeUtil.getDate(this.timeRange[0])
                            : "";
                    param["endDate"] =
                        this.timeRange && this.timeRange.length
                            ? TimeUtil.getDate(this.timeRange[1])
                            : "";
                    param = Object.assign(param, this.searchForm);
                } else {
                    param["orgId"] = this.searchForm.orgId2;
                    param["startDate"] =
                        this.timeRange && this.timeRange.length
                            ? TimeUtil.getDate(this.timeRange[0])
                            : "";
                    param["endDate"] =
                        this.timeRange && this.timeRange.length
                            ? TimeUtil.getDate(this.timeRange[1])
                            : "";
                    param["plateNums"] = this.searchForm.plateNums;
                    param["manufacturerType"] =
                        this.searchForm.manufacturerType;
                    param["maxQualificationRate"] =
                        this.searchForm.maxQualificationRate;
                    param["minQualificationRate"] =
                        this.searchForm.minQualificationRate;
                }
                console.log("this.searchForm.orgId2==", this.searchForm.orgId2);
                if (this.activeName == 2) {
                    //按车辆导出
                    this.loadingAll2 = true;
                    this.$api.exportCarDataQualification(param).then((res) => {
                        if (res.success == true) {
                            var fileName = res.data.fileName;
                            let _this = this;
                            _this.getExportResultInterval2 = window.setInterval(
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
                                                    _this.getExportResultInterval2
                                                );
                                                _this.getExportResultInterval2 =
                                                    "";
                                                _this.loadingAll2 = false;
                                            }
                                        });
                                },
                                2000
                            );
                        } else {
                            this.$message.error(
                                this.$t("common.exportFailed") + ":" +res.msg
                            );
                            this.loadingAll2 = false;
                        }
                    });
                } else {
                    this.loadingAll = true;
                    this.$api
                        .exportCarDataQualificationGroupByOrg(param)
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
            this.$store.dispatch("SetTime", [params.startDate, params.endDate]);
            if (this.activeName == "2") {
                // 按车辆
                params.orgId = this.searchForm.orgId2;
                params.plateNums = this.searchForm.plateNums;
                params.manufacturerType = this.searchForm.manufacturerType;
                params.maxQualificationRate =
                    this.searchForm.maxQualificationRate;
                params.minQualificationRate =
                    this.searchForm.minQualificationRate;
                let carParam = Object.assign(params, this.params2);
                this.$api
                    .pageCarDataQualification(carParam)
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
                                this.$refs.table2.doLayout();
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
                let paramsOrg = {};
                if (this.timeRange && this.timeRange.length > 0) {
                    paramsOrg.startDate = TimeUtil.getDate(this.timeRange[0]);
                    paramsOrg.endDate = TimeUtil.getDate(this.timeRange[1]);
                    this.startDate = TimeUtil.getDate(this.timeRange[0]);
                    this.endDate = TimeUtil.getDate(this.timeRange[1]);
                } else {
                    paramsOrg.startDate = "";
                    paramsOrg.endDate = "";
                    this.startDate = "";
                    this.endDate = "";
                }
                let groupParam = Object.assign(
                    paramsOrg,
                    this.params,
                    this.searchForm
                );
                this.$api
                    .pageCarDataQualificationGroupByOrg(groupParam)
                    .then((res) => {
                        if (res.success == true) {
                            console.log(res);
                            this.tableData =
                                (res.data.results.length &&
                                    res.data.totalRecords) ||
                                (!res.data.results.length &&
                                    !res.data.totalRecords)
                                    ? res.data.results
                                    : this.tableData;
                            this.total = res.data.totalRecords;
                            this.$nextTick(() => {
                                this.$refs.table1.doLayout();
                                this.setTableHeight();
                            });
                        } else {
                            this.$message.error(res.msg);
                        }
                        searchLoading = false;
                    })
                    .catch((err) => {
                        this.searchLoading = false;
                    });
            }
        },
        // 获取组织树
        // this.params.organizeId = this.$store.state.tree.devicFaultId ? this.$store.state.tree.devicFaultId : res.data[0].id;
        // this.searchForm = this.$store.state.tree.searchForm ? this.$store.state.tree.searchForm : this.searchForm;
        getOrgTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = res.data;
                    this.$nextTick(() => {
                        this.searchForm = this.$store.state.tree.searchForm
                            ? this.$store.state.tree.searchForm
                            : this.searchForm;
                        this.timeRange = this.$store.state.tree.time
                            ? this.$store.state.tree.time
                            : [
                                  new Date(
                                      new Date() - 7 * 24 * 60 * 60 * 1000
                                  ),
                                  new Date(),
                              ];
                        this.getData();
                    });
                }
            });
        },
        // treeDataToArr(val,type){
        //   if(type){
        //     this.treeArr = [];
        //   }
        //   val.forEach(item =>{
        //     this.treeArr.push({
        //       id:item.id,
        //       name:item.name
        //     })
        //     if(item.children.length > 0){
        //       this.treeDataToArr(item.children,'')
        //     }
        //   })
        // },

        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchPagination.clientHeight -
                111;
        },
        goDetail(orgId, timeString) {
            this.activeName = "2";
            this.searchForm.orgId2 = orgId;
            this.searchForm.plateNums = [];
            this.searchForm.manufacturerType = 0;
            this.getData();
            // this.$router.push({
            //     path: "qualifiedProbability/detail",
            //     query: {
            //         orgId: orgId,
            //         time: timeString,
            //     },
            // });
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
                path: "/reportCenter/qualifiedProbability/carDetail",
                query: {
                    deviceCode: item.deviceCodes,
                    plateNum: item.plateNum,
                    startDate,
                    endDate,
                },
            });
        },
        openDialog() {
            this.timer = new Date().getTime();
            this.trackPlaybackVisible = true;
        },
        cancel() {
            this.trackPlaybackVisible = false;
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
        this.timeRange = this.$store.state.tree.time
            ? this.$store.state.tree.time
            : this.timeRange;
        if (this.$store.state.tree.tabName) {
            this.activeName = this.$store.state.tree.tabName;
        }
        this.getOrgTree();
        // this.getData();
        //this.getPlateNumList()
        // this.changeMonthDayCount();
        console.log(new Date());
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
/deep/.el-tabs {
    .el-tab-pane {
        padding-right: 204px;
    }
}
/deep/.el-select {
    .el-input__inner {
        height: 32px !important;
    }
}
</style>
