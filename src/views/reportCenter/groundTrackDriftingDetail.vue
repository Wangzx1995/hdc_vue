<template>
    <div class="top">
        <div>
            <div class="top-left">
                <el-form
                    ref="form"
                    label-position="top"
                    :model="searchForm"
                    inline
                >
                    <el-form-item label="车牌号" prop="plateNums">
                        <span>{{ searchForm.plateNum }} </span>
                    </el-form-item>
                    <el-form-item label="所属组织" prop="orgId">
                        <span>{{ searchForm.orgName }} </span>
                    </el-form-item>
                    <el-form-item label="时间范围" prop="timeRange">
                        <el-date-picker
                            :clearable="false"
                            :picker-options="pickerOptions2"
                            :default-time="['00:00:00', '23:59:59']"
                            size="small"
                            v-model="timeRange"
                            type="datetimerange"
                            placeholder="请选择时间段"
                            transfer
                            format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
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
                    >查询</el-button
                >
                <el-button type="default" @click="handleReset($refs.searchForm)"
                    >清除条件</el-button
                >
            </div>
        </div>

        <div>
            <el-table
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :height="tableHeight"
                :data="tableData"
                force-scroll="horizontal"
                style="width: 100%"
                v-show="activeName === '1'"
                stripe
            >
                <!-- <el-table-column
                    prop="plateNum"
                    label="车牌号"
                    width="120px"
                ></el-table-column>
                <el-table-column
                    prop="orgName"
                    label="所属组织"
                    min-width="200px"
                ></el-table-column> -->
                <el-table-column
                    prop="startTime"
                    label="开始时间"
                    min-width="100px"
                ></el-table-column>
                <el-table-column
                    prop="endTime"
                    label="结束时间"
                    min-width="100px"
                ></el-table-column>
                <el-table-column
                    prop="durationTime"
                    label="持续时间"
                    min-width="100px"
                ></el-table-column>
                <el-table-column
                    prop="startPosition"
                    label="开始位置"
                    min-width="200px"
                ></el-table-column>
                <el-table-column
                    prop="endPosition"
                    label="结束位置"
                    min-width="200px"
                ></el-table-column>
                <el-table-column
                    prop="speed"
                    label="漂移速度（km/h）"
                    min-width="100px"
                ></el-table-column>
            </el-table>
        </div>
        <div class="wrap-bottom p-x-md">
            <el-pagination
                style="border-top: 1px solid #e4e4e4"
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
import { getAddressSingle } from "@/utils/getMapLocation";
export default {
    name: "groundTrackDrifting",
    components: {
        TreeSelect,
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
            buttonClick: false,
            activeName: "1",
            startDate: "",
            endDate: "",
            searchForm: {
                orgId: "",
                plateNums: [],
                manufacturerType: 0,
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
    watch: {},
    methods: {
        getPlateNumList(params) {
            this.loading = true;
            this.$api.getCarList(params).then((res) => {
                this.plateArr = res.data.carList;
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
        },
        // 重置表单
        handleReset(ref) {
            this.timeRange = [
                Number(this.$route.query.timeRange[0]),
                Number(this.$route.query.timeRange[1]),
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
                            });
                        }
                        console.log(res.data.results);
                        this.tableData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableData;
                        this.tableData.forEach((item) => {
                            if (!item["startPosition"]) {
                                getAddressSingle(
                                    [item.startLongitude, item.startLatitude],
                                    true
                                ).then((result) => {
                                    this.$set(item, "startPosition", result);
                                });
                            }
                            if (!item["endPosition"]) {
                                getAddressSingle(
                                    [item.endLongitude, item.endLatitude],
                                    true
                                ).then((result) => {
                                    this.$set(item, "endPosition", result);
                                });
                            }
                        });
                        this.total = res.data.totalRecords;
                    } else {
                        this.$message.error("获取列表数据失败:" + res.msg);
                    }
                    this.$nextTick(() => {
                        this.searchLoading = false;
                    });
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
            this.tableHeight = document.body.clientHeight - 249;
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
        this.getData();
    },
    created() {
        this.setTableHeight();
        this.getOrgTree();
        // this.getPlateNumList()
        // this.changeMonthDayCount();
        this.searchForm = { ...this.$route.query };
        this.timeRange = [
            Number(this.$route.query.timeRange[0]),
            Number(this.$route.query.timeRange[1]),
        ];
        let limit = JSON.parse(JSON.stringify(this.timeRange));
        this.pickerOptions2 = {
            disabledDate(time) {
                // 禁用以后的时间
                return time.getTime() > limit[1] || time.getTime() < limit[0];
            },
        };
    },
};
</script>

<style lang="less" scoped>
.top {
    padding: 20px 30px 0px 30px;

    .top-right {
        float: right;
        margin-top: -57px;
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
    .wrap-bottom {
        position: absolute;
        bottom: 0;
        border-top: 1px solid #e4e4e4;
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
</style>
