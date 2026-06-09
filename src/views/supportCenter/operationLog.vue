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
                        <!-- 操作人员 -->
                        <el-form-item
                            :label="$t('operationLog.operator')"
                            prop="operatorName"
                        >
                            <el-input
                                size="small"
                                v-model="searchForm.operatorName"
                                :placeholder="$t('common.input')"
                                class="w"
                                clearable
                            ></el-input>
                        </el-form-item>
                        <!-- 操作时间段 -->
                        <el-form-item
                            :label="$t('operationLog.operationTimePeriod')"
                            prop="operateTimeArr"
                        >
                            <el-date-picker
                                size="small"
                                @onPick="onPickTime"
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
                        <!-- 操作模块 -->
                        <el-form-item
                            :label="$t('operationLog.operationModule')"
                            prop="modelCode"
                        >
                            <el-select
                                size="small"
                                clearable
                                v-model="searchForm.modelCode"
                                class="w"
                                :placeholder="$t('common.select')"
                                transfer
                            >
                                <el-option
                                    v-for="item in operationModelList"
                                    :value="item.id"
                                    :key="item.id"
                                    :label="item.cnName"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 操作结果 -->
                        <el-form-item
                            :label="$t('operationLog.operationResult')"
                            prop="operateResult"
                        >
                            <el-input
                                size="small"
                                v-model="searchForm.operateResult"
                                :placeholder="$t('common.input')"
                                class="w"
                                clearable
                            ></el-input>
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
                    ref="table"
                    @sort-change="onSortChange"
                    border
                    stripe
                >
                    <!-- 操作类型 -->
                    <el-table-column :label="$t('operationLog.operationType')">
                        <template slot-scope="scope">
                            <span v-if="scope.row.operateType == '1'">
                                <!-- 添加 -->
                                {{ $t("common.add") }}
                            </span>
                            <span v-else-if="scope.row.operateType == '2'">
                                <!-- 删除 -->
                                {{ $t("common.delete") }}
                            </span>
                            <span v-else-if="scope.row.operateType == '3'">
                                <!-- 修改 -->
                                {{ $t("common.edit") }}
                            </span>
                            <span v-else-if="scope.row.operateType == '4'">
                                <!-- 操作 -->
                                {{ $t("common.operate") }}
                            </span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <!-- 操作模块 -->
                    <el-table-column
                        prop="modelName"
                        :label="$t('operationLog.operationModule')"
                    ></el-table-column>
                    <!-- IP地址 -->
                    <el-table-column
                        prop="ip"
                        :label="$t('loginLog.ipAddress')"
                    ></el-table-column>
                    <!-- 操作人员 -->
                    <el-table-column
                        prop="operatorName"
                        :label="$t('operationLog.operator')"
                    ></el-table-column>
                    <!-- 操作时间 -->
                    <el-table-column
                        prop="operateTime"
                        sortable
                        :label="$t('operationLog.operationTime')"
                    ></el-table-column>
                    <!-- 操作结果 -->
                    <el-table-column
                        prop="operateResult"
                        :label="$t('operationLog.operationResult')"
                        show-overflow-tooltip
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
import TimeUtil from "@/utils/time";
import { validateSpecial } from "@/utils/validate";
export default {
    name: "deviceControlLog",
    components: {},
    data() {
        const checkSpeccial = (rule, value, callback) => {
            if (value != undefined && value.length > 0) {
                if (validateSpecial(value)) {
                    callback(new Error(this.$t("operationLog.checkSpeccial")));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            operationModelList: [],
            modelList: [],
            tableOrder: null,
            searchState: true,
            modalType: 0,
            tableHeight: 500,
            dataReady: false, // 判断异步数据加载完成，避免报错
            searchLoading: true,
            loadingAll: false,
            searchForm: {
                // 搜索表单
                operateType: "",
                operateTimeArr: [],
                operatorName: "",
                operateStart: "",
                operateEnd: "",
                modelCode: "",
                operateResult: "",
            },
            searchFormValidate: {
                operatorName: [{ validator: checkSpeccial, trigger: "change" }],
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "operateTime", //排序列
                orderDir: "desc", //排序方向
                modelCode: "",
            },
            listData: [], // @:data
            total: 0, // 数据总数
            selection: [], // 表格选中项
        };
    },
    watch: {
        params: {
            handler(val) {
                if (val && this.searchForm.operateTimeArr.length > 0) {
                    this.searchForm.operateStart = TimeUtil.getDateTime(
                        this.searchForm.operateTimeArr[0]
                    );
                    this.searchForm.operateEnd = TimeUtil.getDateTime(
                        this.searchForm.operateTimeArr[1]
                    );
                }
                let params = Object.assign(val, this.searchForm);
                this.getData(params);
            },
            deep: true,
        },
    },
    computed: {},
    methods: {
        onPickTime(min, max) {
            console.log(min);
            console.log(max);
        },
        handleExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                let _params = { ...this.searchForm };
                let obj = this.operationModelList.find((item) => {
                    return item.id === this.searchForm.modelCode;
                });
                if (obj) {
                    _params.modelCode = obj.modelCode;
                }
                this.$api.doExportOperateLog(_params).then((res) => {
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
                        this.searchForm.operateTimeArr &&
                        this.searchForm.operateTimeArr.length > 0
                    ) {
                        this.searchForm.operateStart = TimeUtil.getDateTime(
                            this.searchForm.operateTimeArr[0]
                        );
                        this.searchForm.operateEnd = TimeUtil.getDateTime(
                            this.searchForm.operateTimeArr[1]
                        );
                    } else {
                        this.searchForm.operateStart = "";
                        this.searchForm.operateEnd = "";
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
            let _params = { ...params };
            this.searchLoading = true;
            let obj = this.operationModelList.find((item) => {
                return item.id === params.modelCode;
            });
            if (obj) {
                _params.modelCode = obj.modelCode;
            }
            if (
                this.searchForm.operateTimeArr &&
                this.searchForm.operateTimeArr.length > 0
            ) {
                _params.operateStart = TimeUtil.getDateTime(
                    this.searchForm.operateTimeArr[0]
                );
                _params.operateEnd = TimeUtil.getDateTime(
                    this.searchForm.operateTimeArr[1]
                );
            } else {
                _params.operateStart = "";
                _params.operateEnd = "";
            }
            this.$api.getOperationLogPage(_params).then((res) => {
                if (res.success == true) {
                    this.listData =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : this.listData;
                    this.total = res.data.totalRecords;
                    this.dataReady = true;
                } else {
                    this.$message.error(res.msg);
                }
                this.searchLoading = false;
            });
        },
        onSortChange(column, prop, order) {
            this.params.orderDir = !column.order
                ? ""
                : column.order == "ascending"
                ? "asc"
                : "desc";
            this.params.orderColumn = !column.prop ? "" : column.prop;
            this.getData(this.params);
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
            this.searchForm.operateStart = "";
            this.searchForm.operateEnd = "";
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 244;
        },
        /**
         * @params:category 分类 page：页码 limit:条数
         * */
        getOperationModelList(params) {
            this.$api.operationModelList(params).then((res) => {
                if (res.success == true) {
                    this.operationModelList = res.data;
                    this.getData(this.params);
                } else {
                    this.$message.error(res.msg);
                }
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
        this.getOperationModelList();
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
