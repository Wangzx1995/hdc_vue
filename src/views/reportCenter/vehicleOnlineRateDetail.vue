<template>
    <div class="wrap">
        <div class="p-x-md p-t-md">
            <div class="icon-box">
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
            <el-table
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :height="tableHeight"
                :data="tableData"
                force-scroll="horizontal"
                style="width: 100%"
                @sort-change="handleSortChange"
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
                <!-- 在线时长（h） -->
                <el-table-column
                    align="right"
                    sortable
                    prop="onlineTimeHour"
                    :label="$t('vehicleOnlineRate.onlineDuration') + '（h）'"
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
        <div class="wrap-bottom p-l p-r">
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
export default {
    name: "vehicleOnlineRateDetail",
    data() {
        return {
            searchLoading: true,
            tableHeight: 500,
            tableData: [],
            total: 0,
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                organizeId: +this.$route.query.organizeId,
                month: this.$route.query.month,
                orderDir: "",
                orderColumn: "",
            },
            monthDayCount: 30,
        };
    },
    computed: {
        monthDay() {
            return [...Array(this.monthDayCount).keys()].map((i) => i + 1);
        },
    },
    methods: {
        handleSortChange(column, prop, order) {
            this.params.orderDir = !column.order
                ? ""
                : column.order == "ascending"
                ? "asc"
                : "desc";
            this.params.orderColumn = !column.prop ? "" : column.prop;
            this.getData();
        },
        changeMonthDayCount() {
            let arr = this.$route.query.month.split("-");
            this.monthDayCount = new Date(arr[0], arr[1], 0).getDate();
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getData();
        },
        getData() {
            this.searchLoading = true;
            this.$api
                .pageCarOnlineGroupByCar(this.params)
                .then((res) => {
                    if (res.success == true) {
                        res.data.results.forEach((item) => {
                            item.onlineTimeHour = item.onlineTimeHour
                                ? Number(item.onlineTimeHour.toFixed(2))
                                : 0.0;
                            // item.upLineDay = item.upLineDay ? (item.upLineDay).toFixed(2) : '0.00'
                        });
                        this.tableData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableData;
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
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 195;
        },
    },
    mounted() {
        this.$route.meta.title = this.$route.query.orgName;
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };
    },
    created() {
        this.setTableHeight();
        this.getData();
        this.changeMonthDayCount();
    },
};
</script>

<style lang="less" scoped>
.wrap {
    .wrap-bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        border-top: 1px solid #e4e4e4;
    }
    i {
        font-size: 20px;
    }
}
.icon-box {
    display: flex;
    align-items: center;
    margin-right: 24px;
    justify-content: flex-end;
    i {
        margin-left: 24px;
    }
}
</style>
