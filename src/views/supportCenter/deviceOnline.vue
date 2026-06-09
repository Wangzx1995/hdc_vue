<template>
    <div>
        <!-- 搜索 -->
        <div
            :dis-hover="true"
            :bordered="false"
            :padding="0"
            class="card-wrap card-filter card-collapsable"
        >
            <el-row
                type="flex"
                justify="center"
                align="bottom"
                class="p-a p-b-md"
            >
                <el-col flex>
                    <el-form
                        ref="searchForm"
                        :model="searchForm"
                        label-width="80"
                        inline
                        :rules="searchFormValidate"
                    >
                        <!-- 关键字 -->
                        <el-form-item
                            :label="$t('common.keywords')"
                            prop="deviceCode"
                        >
                            <G-DeviceSearch
                                :valueKey="'deviceCode'"
                                :value.sync="searchForm.deviceCode"
                            ></G-DeviceSearch>
                        </el-form-item>
                        <!-- 上线时间段 -->
                        <el-form-item
                            :label="$t('deviceOnline.onlineTimePeriod')"
                            prop="operateTimeArr"
                        >
                            <el-date-picker
                                size="small"
                                :editable="false"
                                v-model="searchForm.operateTimeArr"
                                :default-time="['00:00:00', '23:59:59']"
                                type="datetimerange"
                                :start-placeholder="$t('common.startTime')"
                                :end-placeholder="$t('common.endTime')"
                                style="width: 340px"
                                transfer
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                size="small"
                                :loading="searchLoading"
                                :disabled="searchLoading"
                                type="primary"
                                @click="search()"
                            >
                                <!-- 查询 -->
                                {{ $t("common.search") }}
                            </el-button>
                            <el-button
                                size="small"
                                type="default"
                                @click="handleReset('searchForm')"
                            >
                                <!-- 清除条件 -->
                                {{ $t("common.reset") }}
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <!-- 搜索 /-->
        <div :dis-hover="true" :bordered="false" :padding="0" class="card-wrap">
            <div class="p-x">
                <el-table
                    v-loading="searchLoading"
                    :element-loading-text="$t('common.desperatelyLoading')"
                    :data="listData"
                    :height="tableHeight"
                    ref="table"
                    border
                    stripe
                >
                    <!-- 车牌号 -->
                    <el-table-column
                        prop="plateNum"
                        :label="$t('common.plateNum')"
                    ></el-table-column>
                    <!-- 终端手机号 -->
                    <el-table-column
                        prop="deviceCode"
                        :label="$t('common.deviceCode')"
                    ></el-table-column>
                    <!-- 设备序列号 -->
                    <el-table-column
                        prop="deviceSerialNum"
                        :label="$t('common.deviceSerialNum')"
                    ></el-table-column>
                    <!-- VIN码 -->
                    <el-table-column
                        prop="vin"
                        :label="$t('common.vin')"
                    ></el-table-column>
                    <!-- 在线状态 -->
                    <el-table-column
                        prop="onlineStatus"
                        :label="$t('common.deviceStatus')"
                    >
                        <template slot-scope="scope">
                            <el-tag
                                type="success"
                                v-if="scope.row.onlineStatus == 1"
                            >
                                <!-- 在线 -->
                                {{ $t("common.deviceStatus_1") }}
                            </el-tag>
                            <el-tag
                                type="warning"
                                v-else-if="scope.row.onlineStatus == 2"
                            >
                                <!-- 休眠 -->
                                {{ $t("common.deviceStatus_2") }}
                            </el-tag>
                            <el-tag
                                type="info"
                                v-else-if="scope.row.onlineStatus == 0"
                            >
                                <!-- 离线 -->
                                {{ $t("common.deviceStatus_0") }}
                            </el-tag>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <!-- 上/下线时间 -->
                    <el-table-column
                        prop="createTime"
                        :label="$t('deviceOnline.upDownTime')"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.createTime">
                                {{
                                    $moment(scope.row.createTime).format(
                                        "YYYY-MM-DD HH:mm:ss"
                                    )
                                }}
                            </span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <!-- 上报时间 -->
                    <el-table-column
                        prop="collectTime"
                        :label="$t('deviceOnline.reportTime')"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.collectTime">
                                {{
                                    $moment(scope.row.collectTime).format(
                                        "YYYY-MM-DD HH:mm:ss"
                                    )
                                }}
                            </span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @size-change="PageSizeChange"
                    @current-change="pageChange"
                    :current-page="params.currentPage"
                    :page-sizes="[20, 50, 100]"
                    :page-size="params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import TimeUtil from "@/utils/time";
export default {
    name: "",
    components: {},
    data() {
        return {
            tableHeight: 500,
            searchLoading: false,
            searchForm: {
                // 搜索表单
                deviceCode: "",
                operateTimeArr: [],
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },
            listData: [], // @:data
            total: 0, // 数据总数
            searchFormValidate: {
                deviceCode: [
                    {
                        required: true,
                        // message: "请选择查询设备",
                        message: this.$t("deviceOnline.deviceCodeErrMsg"),
                        trigger: "change",
                    },
                ],
            },
        };
    },
    watch: {
        params: {
            handler(val) {
                let params = Object.assign(val, this.searchForm);
                this.getData(params);
            },
            deep: true,
        },
    },
    computed: {},
    methods: {
        search() {
            this.$refs.searchForm.validate((valid) => {
                if (valid) {
                    if (this.params.currentPage == 1) {
                        let params = Object.assign(
                            this.params,
                            this.searchForm
                        );
                        this.getData(params);
                    } else {
                        this.params.currentPage = 1;
                    }
                }
            });
        },

        /**
         * @params:category 分类 page：页码 limit:条数
         * */
        getData(params) {
            let _params = { ...params };
            this.searchLoading = true;
            if (
                this.searchForm.operateTimeArr &&
                this.searchForm.operateTimeArr.length > 0
            ) {
                _params.startTime = TimeUtil.getDateTime(
                    this.searchForm.operateTimeArr[0]
                );
                _params.endTime = TimeUtil.getDateTime(
                    this.searchForm.operateTimeArr[1]
                );
            } else {
                _params.startTime = "";
                _params.endTime = "";
            }
            delete _params.operateTimeArr;
            this.$api.pageDeviceOnline(_params).then((res) => {
                if (res.success == true) {
                    this.listData = res.data.results;
                    this.total = res.data.totalRecords;
                } else {
                    this.$message.error(res.msg);
                }
                this.searchLoading = false;
            });
        },
        /**
         * @on-change 页码改变的回调，返回改变后的页码
         * */
        pageChange(page) {
            this.params.currentPage = page;
        },
        /**
         * @on-page-size-change 切换每页条数时的回调，返回切换后的每页条数
         * */
        PageSizeChange(limit) {
            this.params.pageSize = limit;
        },
        /**
         * 重置表单
         * */
        handleReset(name) {
            this.$refs[name].resetFields();
            this.searchForm.startTime = "";
            this.searchForm.endTime = "";
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 201;
        },
    },
    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };
        // this.search();
    },
    created() {
        this.setTableHeight();
    },
};
</script>
<style lang="less" scoped>
div /deep/ .el-card__body {
    padding: 0 !important;
}
.el-form-item {
    margin-bottom: 0px !important;
}
</style>
