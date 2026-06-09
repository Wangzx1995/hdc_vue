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
                v-show="searchState"
                type="flex"
                justify="center"
                align="bottom"
                class="p-t p-x"
            >
                <el-col flex>
                    <el-form
                        ref="searchForm"
                        :model="searchForm"
                        label-width="80"
                        inline
                        :rules="searchFormValidate"
                    >
                        <!-- 登录账号 -->
                        <el-form-item
                            :label="$t('loginLog.loginAccount')"
                            prop="userName"
                        >
                            <el-input
                                v-model="searchForm.userName"
                                :maxlength="20"
                                :placeholder="$t('common.input')"
                                class="w"
                                clearable
                            ></el-input>
                        </el-form-item>
                        <!-- 登录时间段 -->
                        <el-form-item
                            :label="$t('loginLog.loginTimePeriod')"
                            prop="operateTimeArr"
                        >
                            <el-date-picker
                                size="small"
                                :editable="false"
                                v-model="searchForm.operateTimeArr"
                                type="datetimerange"
                                :start-placeholder="$t('common.startTime')"
                                :end-placeholder="$t('common.endTime')"
                                style="width: 290px"
                                transfer
                                :default-time="['00:00:00', '23:59:59']"
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
            <div class="toolbar p-y p-x">
                <el-button
                    type="default"
                    :loading="loadingAll"
                    :disabled="loadingAll"
                    @click="handleExport()"
                >
                    <!-- 导出 -->
                    {{ $t("common.export") }}
                </el-button>
            </div>
            <div class="p-x">
                <el-table
                    v-loading="searchLoading"
                    :element-loading-text="$t('common.desperatelyLoading')"
                    :data="listData"
                    :height="tableHeight"
                    @sort-change="onSortChange"
                    stripe
                >
                    <!-- IP地址 -->
                    <el-table-column
                        prop="ip"
                        :label="$t('loginLog.ipAddress')"
                    ></el-table-column>
                    <!-- 登录账号 -->
                    <el-table-column
                        prop="userName"
                        :label="$t('loginLog.loginAccount')"
                    ></el-table-column>
                    <!-- 登录结果 -->
                    <el-table-column
                        prop="result"
                        :label="$t('loginLog.loginResults')"
                    >
                        <template slot-scope="scope">
                            <span
                                v-if="scope.row.result == 0"
                                class="text-error"
                            >
                                <!-- 失败 -->
                                {{ $t("common.failed") }}
                            </span>
                            <span
                                v-if="scope.row.result == 1"
                                class="text-success"
                            >
                                <!-- 成功 -->
                                {{ $t("common.success") }}
                            </span>
                        </template>
                    </el-table-column>
                    <!-- 原因 -->
                    <el-table-column
                        prop="description"
                        :label="$t('loginLog.description')"
                        show-overflow-tooltip
                    ></el-table-column>
                    <!-- 登录时间 -->
                    <el-table-column
                        prop="loginTime"
                        sortable
                        :label="$t('loginLog.loginTime')"
                    ></el-table-column>
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
import headBar from "@/views/layout/headbar";
import TimeUtil from "@/utils/time";
import { validateSpecial } from "@/utils/validate";
export default {
    name: "loginLogPage",
    components: {
        headBar,
    },
    data() {
        return {
            searchState: true,
            modalType: 0,
            searchLoading: true,
            tableHeight: 500,
            dataReady: false, // 判断异步数据加载完成，避免报错
            loading: false,
            loadingAll: false,
            searchForm: {
                // 搜索表单
                operateTimeArr: [],
                userName: "",
                startTime: "",
                endTime: "",
            },
            searchFormValidate: {},
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "loginTime", //排序列
                orderDir: "desc", //排序方向
            },
            listData: [], // @:data
            total: 0, // 数据总数
            selection: [], // 表格选中项
        };
    },
    watch: {
        params: {
            handler(val) {
                if (
                    this.searchForm.operateTimeArr != null &&
                    this.searchForm.operateTimeArr.length >= 2
                ) {
                    this.searchForm.startTime = TimeUtil.getDateTime(
                        this.searchForm.operateTimeArr[0]
                    );
                    this.searchForm.endTime = TimeUtil.getDateTime(
                        this.searchForm.operateTimeArr[1]
                    );
                } else {
                    this.searchForm.startTime = "";
                    this.searchForm.endTime = "";
                }
                let params = Object.assign(val, this.searchForm);
                this.getData(params);
            },
            deep: true,
        },
    },
    computed: {},
    methods: {
        handleExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                this.$api.doExportLoginLog(this.searchForm).then((res) => {
                    if (res.success == true) {
                        this.loadingExportDevOperateLog = true;
                        var fileName = res.data.fileName;
                        let run = () => {
                            this.$api
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
                                        this.loadingAll = false;
                                    } else if (
                                        res1.success == true &&
                                        res1.data == false
                                    ) {
                                        setTimeout(run, 1000 * 2);
                                    } else {
                                        this.loadingAll = false;
                                        this.$message.error(res.msg);
                                    }
                                });
                        };
                        run();
                    } else {
                        this.$message.error(res.msg);
                        this.loadingAll = false;
                    }
                });
            }
        },
        search() {
            this.$refs.searchForm.validate((valid) => {
                if (valid) {
                    if (
                        this.searchForm.operateTimeArr != null &&
                        this.searchForm.operateTimeArr.length >= 2
                    ) {
                        this.searchForm.startTime = TimeUtil.getDateTime(
                            this.searchForm.operateTimeArr[0]
                        );
                        this.searchForm.endTime = TimeUtil.getDateTime(
                            this.searchForm.operateTimeArr[1]
                        );
                    } else {
                        this.searchForm.startTime = "";
                        this.searchForm.endTime = "";
                    }
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
            this.loading = true;
            this.searchLoading = true;
            this.$api.getLoginLogPage(params).then((res) => {
                if (res.success == true) {
                    this.loading = false;
                    this.listData =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : this.listData;
                    this.total = res.data.totalRecords;
                    this.dataReady = true;
                } else {
                    this.loading = false;
                    this.$message.error(res.msg);
                }
                this.searchLoading = false;
            });
        },
        onSortChange(data) {
            let key = data.prop;
            let order = data.order;
            if (order == "descending") {
                order = "desc";
            } else if (order == "ascending") {
                order = "asc";
            }
            if (order != "normal") {
                this.params.orderColumn = key;
                this.params.orderDir = order;
            }
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
            this.searchForm.userName = "";
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 244;
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
        this.setTableHeight();
        this.getData(this.params);
    },
    destroyed() {},
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
