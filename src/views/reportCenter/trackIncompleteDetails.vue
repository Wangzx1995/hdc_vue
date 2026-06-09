<template>
    <div class="top">
        <div class="m-x m-t" ref="searchBox">
            <div class="top-left">
                <el-form
                    ref="form"
                    label-position="top"
                    :model="searchForm"
                    inline
                    :rules="rules"
                >
                    <!-- 时间段 -->
                    <el-form-item
                        :label="$t('vehicleTrackIntegrityRate.timeSlot')"
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
                    <!-- 车牌号 -->
                    <el-form-item
                        :label="$t('common.plateNum')"
                        prop="plateNums"
                        v-if="!dialogPlateNum"
                    >
                        <el-select
                            :remote-method="remoteMethod"
                            :loading="loading"
                            filterable
                            style="width: 300px"
                            reserve-keyword
                            remote
                            clearable
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
        <div class="m-x">
            <el-table
                @sort-change="sortChange"
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
                    min-width="100px"
                ></el-table-column>
                <!-- 组织名称 -->
                <el-table-column
                    prop="orgName"
                    :label="$t('vehicleTrackIntegrityRate.orgName')"
                    min-width="100px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 所属组织 -->
                <el-table-column
                    prop="orgPath"
                    :label="$t('common.orgPath')"
                    min-width="100px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 开始时间 -->
                <el-table-column
                    sortable="custom"
                    prop="startTime_"
                    :label="$t('common.startTime')"
                    min-width="150px"
                ></el-table-column>
                <!-- 结束时间 -->
                <el-table-column
                    sortable="custom"
                    prop="endTime_"
                    :label="$t('common.endTime')"
                    min-width="150px"
                ></el-table-column>
                <!-- 持续时长 -->
                <el-table-column
                    prop="durationTime"
                    :label="$t('vehicleTrackIntegrityRate.duration')"
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 不完整里程（km） -->
                <el-table-column
                    prop="mileage"
                    :label="
                        $t('vehicleTrackIntegrityRate.incompleteMileage') +
                        '（km）'
                    "
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 开始位置 -->
                <el-table-column
                    prop="startLocation"
                    :label="$t('vehicleTrackIntegrityRate.startLocation')"
                    min-width="100px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 结束位置 -->
                <el-table-column
                    prop="endLocation"
                    :label="$t('vehicleTrackIntegrityRate.endLocation')"
                    min-width="100px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 开始里程（km） -->
                <el-table-column
                    prop="startMileage"
                    :label="
                        $t('vehicleTrackIntegrityRate.startMileage') + '（km）'
                    "
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 结束里程（km） -->
                <el-table-column
                    prop="endMileage"
                    :label="
                        $t('vehicleTrackIntegrityRate.endMileage') + '（km）'
                    "
                    min-width="100px"
                    align="right"
                ></el-table-column>
                <!-- 设备序列号 -->
                <el-table-column
                    prop="deviceSerialNum"
                    :label="$t('common.deviceSerialNum')"
                    min-width="100px"
                    show-overflow-tooltip
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
export default {
    name: "groundTrackDrifting",
    components: {
        TreeSelect,
    },
    props: ["dialogTime", "dialogPlateNum"],
    data() {
        const validateHeight = (rule, value, callback) => {
            if (!value.length) {
                // 车牌号不能为空
                callback(new Error(this.$t("carManage.checkPlateNum2")));
            } else {
                callback();
            }
        };
        return {
            loading: false,
            searchLoading: false,
            loadingAll: false,
            buttonClick: false,
            activeName: "1",
            startDate: "",
            endDate: "",
            timeRange: [],
            searchForm: {
                plateNums: this.dialogPlateNum ? [this.dialogPlateNum] : [],
                orgId: "",
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
            month: TimeUtil.oneMonthAgo(),
            total: 0,
            total2: 0,
            currentNodeId: null,
            modalOnline: false,
            tableHeight: 500,
            treeHeight: 500,
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
                plateNums: [
                    {
                        required: true,
                        validator: validateHeight,
                        trigger: "blur",
                    },
                ],
            },
            pickerOptions2: {
                disabledDate(time) {
                    // 禁用以后的时间
                    return (
                        time.getTime() >
                        new Date(new Date().toLocaleDateString()).getTime() +
                            24 * 60 * 60 * 1000 -
                            1
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
        dialogPlateNum: {
            handler(val) {
                this.getPlateNumList({ plateNum: val });
                this.query = val;
            },
            deep: true,
        },
        dialogTime: {
            handler(val) {
                this.timeRange = val
                    ? JSON.parse(val)
                    : [
                          new Date(
                              TimeUtil.getDate(
                                  new Date() - 7 * 24 * 60 * 60 * 1000
                              ) + " 00:00:00"
                          ).getTime(),
                          new Date(
                              TimeUtil.getDate(new Date()) + " 23:59:59"
                          ).getTime(),
                      ];
            },
            deep: true,
        },
    },
    methods: {
        //对接接口的排序方法
        sortChange(column, prop, order) {
            console.log(column, prop, order);
            this.searchForm.orderDir = !column.order
                ? ""
                : column.order === "ascending"
                ? "asc"
                : "desc";
            this.searchForm.orderColumn = !column.prop
                ? ""
                : column.prop === "startTime_"
                ? "startTime"
                : "endTime";
            this.getData();
        },
        getPlateNumList(params) {
            this.loading = true;
            this.$api.getCarList(params).then((res) => {
                this.plateArr = res.data.carList;
                this.loading = false;
                this.$nextTick(() => {
                    if (this.dialogPlateNum == this.query) {
                        this.searchForm.plateNums = [this.dialogPlateNum];
                        console.log(this.searchForm.plateNums);
                        this.getData();
                    }
                });
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
        // 重置表单
        handleReset(ref) {
            this.$refs["form"].resetFields();
            this.timeRange = [
                new Date(
                    TimeUtil.getDate(new Date() - 7 * 24 * 60 * 60 * 1000) +
                        " 00:00:00"
                ).getTime(),
                new Date(TimeUtil.getDate(new Date()) + " 23:59:59").getTime(),
            ];
        },
        getData(activeName) {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (activeName === "1") {
                        this.params.currentPage = 1;
                    } else if (activeName === "2") {
                        this.params2.currentPage = 1;
                    }
                    this.searchLoading = true;
                    let params = {};
                    if (this.timeRange && this.timeRange.length > 0) {
                        params.startDate = TimeUtil.getDateTime(
                            this.timeRange[0]
                        );
                        params.endDate = TimeUtil.getDateTime(
                            this.timeRange[1]
                        );
                        this.startDate = TimeUtil.getDateTime(
                            this.timeRange[0]
                        );
                        this.endDate = TimeUtil.getDateTime(this.timeRange[1]);
                    } else {
                        params.startDate = "";
                        params.endDate = "";
                        this.startDate = "";
                        this.endDate = "";
                    }
                    let carParam = Object.assign(
                        params,
                        this.searchForm,
                        this.params
                    );
                    this.$api
                        .incompletePage(carParam)
                        .then((res) => {
                            if (res.success == true) {
                                if (res.data.results.length) {
                                    res.data.results.forEach((item) => {
                                        item["startTime_"] =
                                            TimeUtil.getDateTime(
                                                item["startTime"]
                                            );
                                        item["endTime_"] = TimeUtil.getDateTime(
                                            item["endTime"]
                                        );
                                    });
                                }
                                this.tableData =
                                    (res.data.results.length &&
                                        res.data.totalRecords) ||
                                    (!res.data.results.length &&
                                        !res.data.totalRecords)
                                        ? res.data.results
                                        : this.tableData2;

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
        this.$nextTick(() => {
            this.setTableHeight();
        });
    },
    created() {
        this.getOrgTree();
        // this.timeRange = this.$route.query.time ? JSON.parse(this.$route.query.time) : [new Date(new Date()-7*24*60*60*1000),new Date()];

        // this.timeRange = this.$route.query.time ? JSON.parse(this.$route.query.time) : [new Date((TimeUtil.getDate(new Date()-7*24*60*60*1000)+' 00:00:00')).getTime(),new Date()];
        console.log(this.dialogTime);
        console.log(this.dialogPlateNum);
        this.timeRange = this.dialogTime
            ? JSON.parse(this.dialogTime)
            : [
                  new Date(
                      TimeUtil.getDate(new Date() - 7 * 24 * 60 * 60 * 1000) +
                          " 00:00:00"
                  ).getTime(),
                  new Date(
                      TimeUtil.getDate(new Date()) + " 23:59:59"
                  ).getTime(),
              ];
        if (this.dialogPlateNum) {
            this.getPlateNumList({ plateNum: this.dialogPlateNum });
        } else {
            // this.getData();
        }
        this.query = this.dialogPlateNum ? this.dialogPlateNum : "";
    },
};
</script>

<style lang="less" scoped>
.top {
    height: calc(100% - 47px) !important;
    .top-right {
        float: right;
        margin-top: -44px;
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
/deep/.el-select {
    .el-input__inner {
        height: 32px !important;
    }
}
.wrap-bottom {
    border-top: 1px solid #e4e4e4;
}
</style>
