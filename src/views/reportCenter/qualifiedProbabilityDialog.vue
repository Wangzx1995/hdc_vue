<template>
    <div>
        <div class="dialog-body">
            <div class="wrap-top">
                <el-form
                    ref="form"
                    label-position="top"
                    :model="searchForm"
                    inline
                >
                    <el-form-item label="车牌号" prop="carId">
                        <el-select
                            :remote-method="remoteMethod"
                            :loading="loading"
                            filterable
                            style="width: 220px"
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
                    <el-form-item label="操作时间" prop="timeRange">
                        <el-date-picker
                            :picker-options="pickerOptions"
                            :default-time="['00:00:00', '23:59:59']"
                            size="small"
                            v-model="timeRange"
                            type="datetimerange"
                            placeholder="请选择时间段"
                            transfer
                            clearable
                            format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
                    </el-form-item>
                </el-form>
                <div class="flex">
                    <el-button
                        class=""
                        type="primary"
                        :disabled="searchLoading"
                        :loading="searchLoading"
                        @click="getData(true)"
                        >查询</el-button
                    >
                    <el-button
                        type="default"
                        @click="handleReset($refs.searchForm)"
                        >清除条件</el-button
                    >
                </div>
            </div>
            <el-table
                @sort-change="sortChange"
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :height="tableHeight"
                :data="tableData"
                force-scroll="horizontal"
                style="width: 100%"
                stripe
            >
                <el-table-column
                    prop="plateNum"
                    label="车牌号"
                    width="140px"
                    fixed="left"
                ></el-table-column>
                <el-table-column
                    prop="createTime"
                    label="上报时间"
                    width="200px"
                ></el-table-column>
                <el-table-column
                    prop="createTime"
                    label="上报类型"
                    width="200px"
                ></el-table-column>
                <el-table-column
                    prop="orgPath"
                    label="是否合格"
                    width="200px"
                ></el-table-column>
                <el-table-column
                    prop="orgPath"
                    label="不合格原因"
                    width="200px"
                ></el-table-column>
                <el-table-column
                    prop="orgPath"
                    label="状态"
                    width="200px"
                ></el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="接收时间"
                    width="200px"
                ></el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="GPS速度"
                    width="200px"
                >
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="行车记录仪速度"
                    width="200px"
                >
                </el-table-column>
                <el-table-column prop="updateTime" label="经纬度" width="200px">
                </el-table-column>
                <el-table-column prop="updateTime" label="总里程" width="200px">
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="地理位置"
                    width="200px"
                >
                </el-table-column>
                <el-table-column prop="updateTime" label="方向角" width="200px">
                </el-table-column>
                <el-table-column prop="updateTime" label="海拔" width="200px">
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="定位信号强度"
                    width="200px"
                >
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="网络信号强度"
                    width="200px"
                >
                </el-table-column>
            </el-table>
        </div>
        <div class="wrap-bottom p-x-md">
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
        <div class="dialog-footer">
            <el-button @click="cancel()">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </div>
</template>
<script>
import TimeUtil from "@/utils/time";
export default {
    name: "maintainRecord",
    components: {},
    data() {
        return {
            startTime: "",
            endTime: "",
            loading: false,
            searchLoading: false,
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
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },
            total: 0,
            timeRange: [],
            tableHeight: 300,
            tableData: [],
            query: "",
            pickerOptions: {
                disabledDate(time) {
                    // 禁用以后的时间
                    return time.getTime() > Date.now();
                },
            },
        };
    },
    computed: {},
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
        // 重置表单
        handleReset(ref) {
            this.timeRange = [];
            this.searchForm.organizeId = "";
            this.$refs["form"].resetFields();
            this.$store.dispatch("SetCondtion", this.searchForm);
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
            let carParam = Object.assign(params, this.searchForm, this.params);
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
                    } else {
                        this.$message.error("获取列表数据失败:" + res.msg);
                    }
                    this.searchLoading = false;
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        submit() {},
        cancel() {
            this.$emit("cancel", false);
        },
    },
    mounted() {
        this.getData(true);
    },
    created() {},
};
</script>

<style lang="less" scoped>
.dialog-body {
    padding: 12px 12px 0;
    .wrap-top {
        display: flex;
        justify-content: space-between;
        .flex {
            margin-top: 28px;
        }
    }
}
</style>
<style lang="less">
.track-playback-dialog {
    .el-dialog__body {
        padding: 0px !important;
    }
    .dialog-footer {
        border-top: 1px solid #ebebeb;
        display: flex;
        justify-content: flex-end;
        padding: 12px !important;
    }
}
</style>
