<template>
    <div>
        <!-- 搜索 -->
        <div
            :dis-hover="true"
            :bordered="false"
            class="card-wrap card-filter card-collapsable"
        >
            <el-row
                v-show="searchState"
                type="flex"
                justify="center"
                align="bottom"
                class="p-t p-x"
            >
                <el-col>
                    <el-form
                        ref="searchForm"
                        :model="searchForm"
                        inline
                        :rules="searchFormValidate"
                    >
                        <!-- 操作类型 -->
                        <el-form-item
                            :label="$t('operationLog.operationType')"
                            prop="controlTypeName"
                        >
                            <el-select
                                size="small"
                                clearable
                                v-model="searchForm.controlTypeName"
                                class="w"
                                :placeholder="$t('common.select')"
                                transfer
                            >
                                <el-option
                                    v-for="item in controlTypeNameList"
                                    :value="item.fieldNameCN"
                                    :key="item.fieldNameCN"
                                    :label="item.fieldNameCN"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 终端手机号 -->
                        <el-form-item
                            :label="$t('common.deviceCode')"
                            prop="deviceCode"
                        >
                            <el-input
                                v-model="searchForm.deviceCode"
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
        <div :dis-hover="true" :bordered="false" class="card-wrap">
            <div class="toolbar p-y p-x">
                <el-button
                    type="default"
                    @click="handleExport()"
                    :disabled="loadingAll"
                    :loading="loadingExportDevOperateLog"
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
                    :force-scroll="true"
                    ref="table"
                    @select="onSelect"
                    @selection-change="onSelectionChange"
                    @sort-change="onSortChange"
                    border
                    stripe
                >
                    <!-- 操作类型 -->
                    <el-table-column
                        prop="controlTypeName"
                        :label="$t('operationLog.operationType')"
                    ></el-table-column>
                    <!-- 终端手机号 -->
                    <el-table-column
                        prop="deviceCode"
                        :label="$t('common.deviceCode')"
                    ></el-table-column>
                    <!-- 车牌号 -->
                    <el-table-column
                        prop="carNumber"
                        :label="$t('common.plateNum')"
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
                    >
                        <template slot-scope="scope">
                            <a
                                v-if="scope.row.controlTypeName == '直连操作'"
                                class="text-link"
                                @click="goDetail(scope.row.operateResult)"
                            >
                                <!-- 查看详情 -->
                                {{ $t("devOperationLog.viewDetails") }}
                            </a>
                            <span v-else>{{ scope.row.operateResult }}</span>
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
import { validateSpecial } from "@/utils/validate";
export default {
    name: "sysLog",
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
            loadingAll: false,
            tableOrder: null,
            detailModel: false,
            searchLoading: true,
            searchState: true,
            tableHeight: 500,
            modalType: 0,
            dataReady: false, // 判断异步数据加载完成，避免报错
            controlTypeNameList: [],
            detailForm: { operateResult: "" },
            searchForm: {
                // 搜索表单
                deviceCode: "",
                carNumber: "",
                operateTimeArr: [],
                controlTypeName: this.$t("common.all"),
                startTime: "",
                endTime: "",
            },
            loadingExportDevOperateLog: false,
            searchFormValidate: {
                deviceCode: [{ validator: checkSpeccial, trigger: "change" }],
                controlTypeName: [
                    { validator: checkSpeccial, trigger: "change" },
                ],
                carNumber: [{ validator: checkSpeccial, trigger: "change" }],
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "operateTime", //排序列
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
                let params = Object.assign(val, this.searchForm);
                this.getData(params);
            },
            deep: true,
        },
        // searchForm:{
        //     handler(val){
        //         console.log(this.searchForm)
        //     },deep:true
        // }
    },
    computed: {},
    methods: {
        handleExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.$api.doExportDevOperateLog(this.searchForm).then((res) => {
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
                                        this.loadingExportDevOperateLog = false;
                                    } else if (
                                        res1.success == true &&
                                        res1.data == false
                                    ) {
                                        setTimeout(run, 1000 * 2);
                                    } else {
                                        this.loadingExportDevOperateLog = false;
                                        this.$message.error(res.msg);
                                    }
                                });
                        };
                        run();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            }
        },
        goDetail(data) {
            this.handleReset("detailForm");
            this.detailForm.operateResult = data;
            this.detailModel = true;
        },
        doClose() {
            this.detailModel = false;
        },
        search() {
            this.$refs.searchForm.validate((valid) => {
                console.log();
                if (valid) {
                    if (this.searchForm.operateTimeArr.length > 0) {
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
            this.searchLoading = true;
            this.$api.getPageDevControlg(params).then((res) => {
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
        getAppOpLogType() {
            this.$api.getAppOpLogType().then((res) => {
                if (res.success == true) {
                    this.controlTypeNameList = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        /**
         * 多选
         * selection：已选项数据 row：刚选择的项数据
         */
        onSelect(selection, row) {
            // console.log(selection,row)
        },
        onSelectionChange(selection) {
            this.selection = selection;
        },
        onSortChange(column, prop, order) {
            this.params.orderDir = !column.order
                ? ""
                : column.order == "ascending"
                ? "asc"
                : "desc";
            this.params.orderColumn = !column.prop ? "" : column.prop;
            // this.getData(this.params)
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
        this.getAppOpLogType();
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
