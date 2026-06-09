<template>
    <div class="wrap">
        <div class="text-lg p-t p-x p-b">
            <span>{{ goHistoryList.plateNum || "--" }}</span>
        </div>
        <div
            class="text-sm p-x"
            style="padding-bottom: 1rem !important; color: #999"
        >
            <span class="version m-r">
                <!-- 所属组织 -->
                {{ $t("common.orgPath") }}：{{
                    goHistoryList.organizeName
                }}</span
            >
            <span class="version m-r"
                ><!-- 设备序列号 -->
                {{ $t("common.deviceSerialNum") }}：{{
                    goHistoryList.deviceSerialNum || "--"
                }}</span
            >
            <span class="version m-r"
                ><!-- 终端手机号 -->
                {{ $t("common.deviceCode") }}：{{
                    goHistoryList.deviceCode
                }}</span
            >
            <span class="version m-r">
                <!-- 设备型号 -->
                {{ $t("common.deviceModelCode") }}：{{
                    goHistoryList.deviceModelCode
                }}<span v-if="goHistoryList.protocolName"
                    >({{ goHistoryList.protocolName }})</span
                ></span
            >
            <span class="version m-r"
                ><!-- 设备厂商 -->
                {{ $t("common.manufacturerNameString") }}：{{
                    $route.query.manufacturerNameString || "--"
                }}</span
            >
            <span class="version m-r"
                ><!-- 安装服务商 -->
                {{ $t("conditionMonitoring.installationServiceProvider") }}：{{
                    $route.query.installServiceProvider || "--"
                }}</span
            >
        </div>
        <div class="p-x m-b">
            <div class="search">
                <div style="flex: 1">
                    <el-form
                        inline
                        label-position="top"
                        ref="searchForm"
                        :model="searchForm"
                    >
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
                        <!-- 配置结果 -->
                        <el-form-item
                            prop="schedule"
                            :label="$t('ttsConfiguration.configurationResult')"
                        >
                            <el-select v-model="searchForm.schedule" clearable>
                                <el-option
                                    v-for="(item, index) in statusList"
                                    :label="item.label"
                                    :value="item.value"
                                    :key="index"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 指令内容 -->
                        <el-form-item
                            prop="params"
                            :label="$t('ttsConfiguration.instructionContent')"
                        >
                            <el-input
                                v-model="searchForm.params"
                                :placeholder="$t('common.input')"
                                clearable
                            ></el-input>
                        </el-form-item>
                        <!-- 操作人员 -->
                        <el-form-item
                            prop="createName"
                            :label="$t('operationLog.operator')"
                        >
                            <el-input
                                v-model="searchForm.createName"
                                :placeholder="$t('common.input')"
                                clearable
                            ></el-input>
                        </el-form-item>
                        <!-- 标题 -->
                        <el-form-item
                            prop="configTitle"
                            :label="$t('ttsConfiguration.configurationTitle')"
                        >
                            <el-input
                                v-model="searchForm.configTitle"
                                :placeholder="$t('common.input')"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="m-t p-t" style="width: 211px">
                    <el-button
                        type="primary"
                        :disabled="searchLoading"
                        :loading="searchLoading"
                        @click="
                            params.currentPage = 1;
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
            <div class="top-bottom">
                <el-button
                    @click="goExport"
                    :loading="loadingAll"
                    :disabled="loadingAll"
                    v-btn="'ttsConfigurationExport'"
                >
                    <!-- 导出 -->
                    {{ $t("common.export") }}
                </el-button>
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
                :header-row-style="{ height: '40px' }"
                :row-style="{ height: '40px' }"
                @sort-change="handleSortChange"
            >
                <!-- 创建时间 -->
                <el-table-column
                    prop="createTime"
                    :label="$t('cardSwapRecord.createTime')"
                    fixed="left"
                    sortable="custom"
                    min-width="165px"
                >
                </el-table-column>
                <!-- 进度更新时间 -->
                <el-table-column
                    prop="updateTime"
                    :label="$t('ttsConfiguration.progressUpdateTime')"
                    sortable="custom"
                    min-width="165px"
                ></el-table-column>
                <!-- 标题 -->
                <el-table-column
                    prop="configTitle"
                    :label="$t('ttsConfiguration.configurationTitle')"
                    min-width="165px"
                >
                </el-table-column>
                <!-- 指令内容 -->
                <el-table-column
                    prop="params"
                    :label="$t('ttsConfiguration.instructionContent')"
                    min-width="300px"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span style="white-space: pre-wrap">{{
                            scope.row.params
                        }}</span>
                    </template>
                </el-table-column>
                <!-- 配置属性 -->
                <el-table-column
                    prop="configProperty"
                    :label="$t('ttsConfiguration.configureProperties')"
                    min-width="300px"
                >
                    <template slot-scope="scope">
                        {{ scope.row.configPropertyString }}
                    </template>
                </el-table-column>
                <!-- 操作人员 -->
                <el-table-column
                    prop="createName"
                    :label="$t('operationLog.operator')"
                    min-width="165px"
                >
                </el-table-column>
                <!-- 配置结果 -->
                <el-table-column
                    prop="result"
                    fixed="right"
                    :label="$t('ttsConfiguration.configurationResult')"
                    min-width="240px"
                >
                    <template slot-scope="scope">
                        <div>
                            <span
                                :class="
                                    configStatusList[scope.row.result] &&
                                    configStatusList[scope.row.result].color
                                "
                                v-if="configStatusList[scope.row.result]"
                                >●</span
                            >
                            {{
                                configStatusList[scope.row.result] &&
                                configStatusList[scope.row.result].name
                            }}
                        </div>
                    </template>
                </el-table-column>
                <!-- 失败原因 -->
                <el-table-column
                    prop="failReason"
                    fixed="right"
                    :label="$t('deviceLoadReportVerify.activeCodeErrorMessage')"
                    min-width="300px"
                ></el-table-column>
            </el-table>
        </div>
        <div class="p-x wrap-bottom">
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
import EditTemplate from "./editTemplate.vue";
export default {
    name: "configurationView",
    components: { EditTemplate },
    data() {
        return {
            loadingAll: false,
            orderBy: "", //排序
            tableHeight: 500,
            searchLoading: true,
            // expandedList: [],
            // templateIdList:[], //配置模板
            statusList: [
                {
                    value: "",
                    label: this.$t("common.all"), //"全部"
                },
                {
                    value: 1,
                    label: this.$t("common.success"), //"成功"
                },
                {
                    value: 2,
                    label: this.$t("common.failed"), // "失败"
                },
                {
                    value: 3,
                    label: this.$t("deviceHealthCondition.other"), //"其他"
                },
            ],
            configStatusList: {
                "-5": {
                    name: this.$t("ttsConfiguration.statusListText10"), // "设备版本号不一致",
                    color: "text-warning",
                },
                "-4": {
                    name: this.$t("ttsConfiguration.statusListText11"), //"配置文件版本号不一致",
                    color: "text-warning",
                },
                "-3": {
                    name: this.$t("ttsConfiguration.statusListText12"), //"型号不一致",
                    color: "text-warning",
                },
                "-2": {
                    name: this.$t("ttsConfiguration.statusListText13"), //"命令被覆盖",
                    color: "text-warning",
                },
                "": { name: "--" },
                1: {
                    name: this.$t("ttsConfiguration.statusListText1"), //"成功",
                    color: "text-success",
                },
                2: {
                    name: this.$t("ttsConfiguration.statusListText2"), //"失败",
                    color: "text-error",
                },
                3: {
                    name: this.$t("ttsConfiguration.statusListText3"), //"命令未发送",
                    color: "text-warning",
                },
                4: {
                    name: this.$t("ttsConfiguration.statusListText4"), //"命令已发送",
                    color: "text-warning",
                },
                5: {
                    name: this.$t("ttsConfiguration.statusListText5"), //"配置文件下载完成",
                    color: "text-warning",
                },
                6: {
                    name: this.$t("ttsConfiguration.statusListText6"), //"设备重启中",
                    color: "text-warning",
                },
                7: {
                    name: this.$t("ttsConfiguration.statusListText7"), //"设备离线，等待下发命令",
                    color: "text-warning",
                },
                8: {
                    name: this.$t("ttsConfiguration.statusListText8"), //"命令下发失败",
                    color: "text-warning",
                },
                9: {
                    name: this.$t("ttsConfiguration.statusListText9"), //"手动终止任务",
                    color: "text-warning",
                },
            },
            ttsContent: {
                URGENCY: this.$t("ttsConfiguration.ttsContentText1"), //"紧急",
                DISPLAY: this.$t("ttsConfiguration.ttsContentText2"), //"终端显示屏显示",
                READ: this.$t("ttsConfiguration.ttsContentText3"), //"终端TTS播读",
                ADVERT: this.$t("ttsConfiguration.ttsContentText4"), //"广告屏显示",
                CAN: this.$t("ttsConfiguration.ttsContentText5"), //"CAN故障码信息",
            },
            searchForm: {
                schedule: "",
                operationTime: [],
                params: "",
                createName: "",
                configTitle: "",
            },
            goHistoryList: [],
            tableData: [],
            total: 0,
            params: {
                currentPage: 1, // 页码，从1开始
                pageSize: 20, // 分页大小
                organizeId: this.$route.query.organizeId,
                orderColumn: "", //排序列
                orderDir: "",
            },
        };
    },
    methods: {
        //排序
        handleSortChange(val) {
            this.params.orderColumn = val.prop;
            if (val.order) {
                if (val.order === "descending") {
                    // this.orderBy = `${prop} desc`
                    this.orderBy = "desc";
                    this.getTableData();
                } else {
                    this.orderBy = "asc";
                    this.getTableData();
                    // this.orderBy = `${prop} asc`
                }
            } else {
                this.orderBy = "";
            }
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getTableData();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
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
            this.params.orderDir = this.orderBy;
            const paramList = {
                deviceId: this.$route.query.deviceId,
                deviceCode: this.$route.query.deviceCode,
            };
            const params = Object.assign(
                {},
                paramList,
                this.params,
                this.searchForm
            );
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
            // console.log('this.searchForm.type', this.searchForm.type);
            // this.$store.dispatch("SetShowSearchForm", this.searchForm);

            // 配置下发任务-按任务查看
            this.$api
                .getTTSHistory(params)
                .then((res) => {
                    if (res.success == true) {
                        // console.log(res.data.results);
                        if (res.data.results) {
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

                        this.tableData = res.data.results;

                        this.total = res.data.totalRecords;

                        this.goHistoryList.deviceId =
                            this.$route.query.deviceId;
                        this.goHistoryList.plateNum =
                            this.$route.query.plateNum;
                        this.goHistoryList.deviceCode =
                            this.$route.query.deviceCode;
                        this.goHistoryList.organizeName =
                            this.$route.query.organizeName;
                        this.goHistoryList.organizeId =
                            this.$route.query.organizeId;
                        this.goHistoryList.deviceSerialNum =
                            this.$route.query.deviceSerialNum;
                        this.goHistoryList.deviceModelCode =
                            this.$route.query.deviceModelCode;
                        this.goHistoryList.protocolName =
                            this.$route.query.protocolName;
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.searchLoading = false;
                    this.$api.eventTrackTrigger({
                        menu: "TTS_CONFIGURATION",
                        business: "TTS_CONFIG_HISTORY_INFO",
                        eventResult: res.success,
                    });
                })
                .catch((err) => {
                    this.searchLoading = false;
                });

            // 查询统计数据
            // this.getParamLogResultStatistics();
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 357;
        },
        goExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
                return;
            }
            this.loadingAll = true;
            this.params.orderDir = this.orderBy;
            const paramList = {
                deviceId: this.$route.query.deviceId,
                deviceCode: this.$route.query.deviceCode,
            };
            const params = Object.assign(
                {},
                paramList,
                this.params,
                this.searchForm
            );
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
            this.$api.exportTTSHistory(params).then((res) => {
                if (res.success == true) {
                    var fileName = res.data.fileName;
                    let _this = this;
                    _this.getExportResultInterval = window.setInterval(
                        function () {
                            _this.$api
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
                                        window.clearInterval(
                                            _this.getExportResultInterval
                                        );
                                        _this.getExportResultInterval = "";
                                        _this.loadingAll = false;
                                    }
                                });
                        },
                        2000
                    );
                } else {
                    this.$message.error(
                        this.$t("common.exportFailed") + ":" + res.msg
                    );
                    this.loadingAll = false;
                }
            });
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
.el-form-item {
    margin-bottom: 12px;
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
    .marginBottom {
        margin-bottom: 1.5rem !important;
    }
}
.wrap-bottom {
    border-top: 1px solid #e4e4e4;
}
.top-bottom {
    margin-bottom: 12px;
}
</style>
