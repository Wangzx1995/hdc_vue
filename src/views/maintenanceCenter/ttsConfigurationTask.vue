<template>
    <div class="wrap">
        <div class="title p-x p-y">
            <div class="text-lg">
                <span>
                    <!-- 我的配置任务 -->
                    {{ $t("ttsConfiguration.myConfigurationTask") }}
                </span>
            </div>
        </div>
        <div class="p-x m-b">
            <div class="search">
                <div>
                    <el-form inline ref="searchForm" :model="searchForm">
                        <!-- 创建时间段 -->
                        <el-form-item
                            prop="operationTime"
                            :label="$t('ttsConfiguration.createTimePeriod')"
                        >
                            <el-date-picker
                                :default-time="['00:00:00', '23:59:59']"
                                size="small"
                                v-model="searchForm.operationTime"
                                type="datetimerange"
                                :start-placeholder="$t('common.startTime')"
                                :end-placeholder="$t('common.endTime')"
                                transfer
                                value-format="yyyy-MM-dd HH:mm:ss"
                                clearable
                            ></el-date-picker>
                        </el-form-item>
                    </el-form>
                    <el-button
                        @click="goExport"
                        :loading="loadingAll2"
                        :disabled="loadingAll2"
                        class="m-b"
                        v-btn="'ttsConfigurationExport'"
                    >
                        <!-- 导出 -->
                        {{ $t("common.export") }}
                    </el-button>
                </div>
                <div>
                    <el-button
                        type="primary"
                        :disabled="searchLoading"
                        :loading="searchLoading"
                        @click="
                            params2.currentPage = 1;
                            getTableData();
                        "
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

            <!-- 配置下发任务-按任务查看 -->
            <el-table
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :data="tableData"
                :height="tableHeight"
                border
                stripe
            >
                <!-- 标题 -->
                <el-table-column
                    prop="configTitle"
                    :label="$t('ttsConfiguration.configurationTitle')"
                    min-width="120px"
                ></el-table-column>
                <!-- 配置内容 -->
                <el-table-column
                    prop="params"
                    :label="$t('ttsConfiguration.configurationContent')"
                    min-width="240px"
                >
                    <template slot-scope="scope">
                        <el-popover
                            placement="top"
                            :popper-class="'table-popover'"
                            :open-delay="300"
                            trigger="hover"
                        >
                            <span>{{ scope.row.params }}</span>
                            <span slot="reference">{{ scope.row.params }}</span>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 发布属性 -->
                <el-table-column
                    prop="configProperty"
                    :label="$t('ttsConfiguration.publishAttributes')"
                    min-width="200px"
                >
                    <template slot-scope="scope">
                        {{ scope.row.configPropertyString }}
                    </template>
                </el-table-column>
                <!-- 创建时间 -->
                <el-table-column
                    prop="createTime"
                    :label="$t('cardSwapRecord.createTime')"
                    min-width="160px"
                ></el-table-column>
                <!-- 成功/进行中/失败 -->
                <el-table-column
                    min-width="160px"
                    :label="
                        $t('common.success') +
                        '/' +
                        $t('common.progress') +
                        '/' +
                        $t('common.failed')
                    "
                >
                    <template slot-scope="scope">
                        {{
                            `${scope.row.successNum}/${scope.row.ingNum}/${scope.row.failNum}`
                        }}
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('common.operate')"
                    fixed="right"
                    width="80px"
                >
                    <template slot-scope="scope">
                        <a @click="taskDetail(scope.row.batchCode)">
                            <!-- 详情 -->
                            {{ $t("common.detail") }}
                        </a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="p-x wrap-bottom">
            <el-pagination
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
    </div>
</template>

<script>
export default {
    name: "configurationView",
    components: {},
    data() {
        return {
            searchLoading: true,
            tableHeight: 500,
            loadingAll2: false,
            searchForm: {
                status: "",
                plateNum: "",
                operationTime: [],
                beginTime: "",
                endTime: "",
            },
            ttsContent: {
                URGENCY: this.$t("ttsConfiguration.ttsContentText1"), //"紧急",
                DISPLAY: this.$t("ttsConfiguration.ttsContentText2"), //"终端显示屏显示",
                READ: this.$t("ttsConfiguration.ttsContentText3"), //"终端TTS播读",
                ADVERT: this.$t("ttsConfiguration.ttsContentText4"), //"广告屏显示",
                CAN: this.$t("ttsConfiguration.ttsContentText5"), //"CAN故障码信息",
            },
            tableData: [],
            total2: 0,
            params2: {
                currentPage: 1, // 页码，从1开始
                pageSize: 20, // 分页大小
                organizeId: this.$route.query.organizeId,
            },
        };
    },
    methods: {
        taskDetail(batchCode) {
            this.$router.push({
                path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationTask/ttsConfigurationTaskDetail",
                query: { batchCode, organizeId: this.params2.organizeId },
            });
        },
        goExport() {
            let params = {};
            params = JSON.parse(JSON.stringify(this.searchForm));
            params.organizeId = this.params2.organizeId;
            if (
                this.searchForm.operationTime &&
                this.searchForm.operationTime.length > 0
            ) {
                params.beginTime = this.searchForm.operationTime[0];
                params.endTime = this.searchForm.operationTime[1];
            } else {
                params.beginTime = "";
                params.endTime = "";
            }
            if (this.total2 > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll2 = true;
                this.$api.exportTTSBatchInfo(params).then((res) => {
                    if (res.success == true) {
                        const fileName = res.data.fileName;
                        const _this = this;
                        _this.getExportResultInterval_ = window.setInterval(
                            () => {
                                _this.$api
                                    .isExportFinished(fileName)
                                    .then((res1) => {
                                        if (
                                            res1.success == true &&
                                            res1.data == true
                                        ) {
                                            const iframe =
                                                document.createElement(
                                                    "iframe"
                                                );
                                            iframe.src =
                                                (process.env.BASE_API == "/"
                                                    ? ""
                                                    : process.env.BASE_API) +
                                                "/excel?fileName=" +
                                                fileName;
                                            iframe.style.display = "none";
                                            document.body.appendChild(iframe);
                                            window.clearInterval(
                                                _this.getExportResultInterval_
                                            );
                                            _this.getExportResultInterval_ = "";
                                            _this.loadingAll2 = false;
                                        }
                                    });
                            },
                            2000
                        );
                    } else {
                        this.$message.error(
                            this.$t("common.exportFailed") + ":" + res.msg
                        );
                        this.loadingAll2 = false;
                    }
                });
            }
        },
        handleSizeChange2(val) {
            this.params2.pageSize = val;
            this.getTableData();
        },
        handleCurrentChange2(val) {
            this.params2.currentPage = val;
            this.getTableData();
        },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
            }
        },
        // 获取table数据
        getTableData() {
            this.searchLoading = true;
            if (
                this.searchForm.operationTime &&
                this.searchForm.operationTime.length > 0
            ) {
                this.searchForm.beginTime = this.searchForm.operationTime[0];
                this.searchForm.endTime = this.searchForm.operationTime[1];
            } else {
                this.searchForm.beginTime = "";
                this.searchForm.endTime = "";
            }
            //   this.$store.dispatch('SetShowSearchForm', this.searchForm);
            const param = Object.assign({}, this.params2, this.searchForm);
            this.$api
                .getTTSParamLogPage(param)
                .then((res) => {
                    if (res.success == true) {
                        // console.log(res.data.results);
                        if (res.data.results.length) {
                            res.data.results.forEach((item) => {
                                let ttsArr = [];
                                if (item.configProperty) {
                                    item.configProperty
                                        .split(",")
                                        .forEach((item_) => {
                                            ttsArr.push(this.ttsContent[item_]);
                                        });
                                    item["configPropertyString"] =
                                        ttsArr.join(",");
                                } else {
                                    item["configPropertyString"] = "--";
                                }
                            });
                        }
                        this.tableData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableData;
                        this.total2 = res.data.totalRecords;
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.searchLoading = false;
                    this.$api.eventTrackTrigger({
                        menu: "TTS_CONFIGURATION",
                        business: "TTS_CONFIG_TASK_INFO",
                        eventResult: res.success,
                    });
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 307;
        },
    },
    mounted() {
        const that = this;
        window.onresize = () =>
            (() => {
                that.setTableHeight();
            })();
    },
    created() {
        this.setTableHeight();
        this.getTableData();
    },
};
</script>

<style lang="less" scoped>
.loading_ {
    pointer-events: none;
}
.screenNode {
    text-align: right;
    height: 30px;
    line-height: 30px;
    .screenTitle {
        float: left;
        font-weight: 600;
    }
}
.title {
    display: flex;
    justify-content: space-between;
    .title-right {
        display: flex;
        div {
            border-right: 1px solid #9ea3b1;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            &:first-child {
                padding-left: 0;
            }
            &:last-child {
                border: none;
            }
        }
    }
}
.search {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .el-form-item {
        margin-bottom: 20px;
    }
    .marginBottom {
        margin-bottom: 1.5rem !important;
    }
}
.wrap-bottom {
    border-top: 1px solid #e4e4e4;
}
</style>
<style lang="less">
.table-popover {
    max-width: 98% !important;
    span {
        display: block !important;
        max-width: 100% !important;
        word-break: break-all;
    }
}
</style>
