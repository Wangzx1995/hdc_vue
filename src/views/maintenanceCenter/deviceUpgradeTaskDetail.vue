<template>
    <div class="device-upgrade-detail">
        <div class="task-detail-top">
            <div class="detail-data">
                <h2>
                    <!-- 目标版本号 -->
                    {{ $t("deviceUpgrade.targetVersion") }}：{{
                        devUpgradeLogData.firmwareVersion
                    }}
                </h2>
                <div>
                    <span>
                        <!-- 固件类型 -->
                        {{ $t("firmware.firmwareType") }}：{{
                            // "主机" : "外设"
                            devUpgradeLogData.type === "main"
                                ? $t("firmware.host")
                                : $t("firmware.peripherals")
                        }}</span
                    >
                    <span>
                        <!-- 操作人员 -->
                        {{ $t("operationLog.operator") }}：{{
                            devUpgradeLogData.createName
                        }}</span
                    >
                    <span>
                        <!-- 型号 -->
                        {{
                            // devUpgradeLogData.type === "main" ? "设备" : "主机"
                            devUpgradeLogData.type === "main"
                                ? $t("deviceUpgrade.device")
                                : $t("firmware.host")
                        }}{{ $t("deviceUpgrade.model") }}：
                        {{
                            devUpgradeLogData.deviceModelCode
                                ? devUpgradeLogData.deviceModelCode
                                : "--"
                        }}</span
                    >
                    <span>
                        {{
                            // devUpgradeLogData.type === "main" ? "" : "主机"
                            devUpgradeLogData.type === "main"
                                ? ""
                                : $t("firmware.host")
                        }}
                        <!-- 接入协议 -->
                        {{ $t("common.protocolName") }}：{{
                            devUpgradeLogData.protocolName
                                ? devUpgradeLogData.protocolName
                                : "--"
                        }}</span
                    >
                </div>
                <div>
                    <span>
                        <!-- 操作时间 -->
                        {{ $t("operationLog.operationTime") }}：{{
                            $moment(devUpgradeLogData.createTime).format(
                                "YYYY-MM-DD HH:mm:ss"
                            )
                        }}</span
                    >
                    <span
                        style="width: 600px"
                        :title="devUpgradeLogData.upgradeReason"
                    >
                        <!-- 升级原因 -->
                        {{ $t("deviceUpgrade.reasonForUpgrade") }}：{{
                            devUpgradeLogData.upgradeReason
                        }}</span
                    >
                </div>
            </div>
            <div class="detail-num">
                <div>
                    <span>
                        <!-- 升级统计 -->
                        {{ $t("dashboard.itemsTitle5") }}：</span
                    >

                    {{ $t("dashboard.carTotal") }}：{{
                        devUpgradeLogData.taskDevRecordTotalNum
                    }}
                    | {{ $t("common.success") }}：{{
                        devUpgradeLogData.taskDevSuccessNum
                    }}
                    | {{ $t("common.progress") }}：{{
                        devUpgradeLogData.taskDevIngNum
                    }}
                    | {{ $t("common.failed") }}：{{
                        devUpgradeLogData.taskDevFailNum
                    }}
                    | {{ $t("common.termination") }}：{{
                        devUpgradeLogData.taskDevEndNum
                    }}
                </div>
                <el-popover
                    placement="left"
                    width="500"
                    trigger="click"
                    @show="initEcharts"
                >
                    <div>
                        <!-- 失败原因分析 -->
                        {{ $t("deviceUpgrade.failureAnalysis") }}
                    </div>
                    <div id="echarts-box" v-show="isShowEcharts"></div>
                    <div class="no-data" v-show="!isShowEcharts">
                        <!-- 暂无数据 -->
                        {{ $t("common.noData") }}
                    </div>
                    <el-button
                        type="text"
                        slot="reference"
                        icon="el-icon-pie-chart"
                    >
                        <!-- 失败原因分析 -->
                        {{ $t("deviceUpgrade.failureAnalysis") }}
                    </el-button>
                </el-popover>
            </div>
        </div>
        <div class="wrap">
            <div ref="searchBox" class="search-module">
                <div class="search-form-content">
                    <el-form :model="searchForm" ref="searchForm" inline>
                        <el-form-item
                            :label="$t('common.keywords')"
                            prop="deviceId"
                        >
                            <G-DeviceSearch
                                :valueKey="'deviceId'"
                                :value.sync="searchForm.deviceId"
                                :organizeId="$route.query.organizeId"
                            ></G-DeviceSearch>
                        </el-form-item>
                        <!-- 升级状态 -->
                        <el-form-item
                            :label="$t('deviceUpgrade.upgradeState')"
                            prop="upgradeState"
                        >
                            <el-select
                                v-model="searchForm.upgradeState"
                                :placeholder="$t('common.select')"
                                clearable
                                @change="upgradeStateChange"
                            >
                                <el-option
                                    v-for="(
                                        item, index
                                    ) in upgradeStateSelectList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 升级状态 -->
                        <el-form-item
                            :label="
                                $t(
                                    'deviceLoadReportVerify.activeCodeErrorMessage'
                                )
                            "
                            v-if="searchForm.upgradeState == '[5]'"
                            prop="errorReason"
                        >
                            <el-input
                                v-model="searchForm.errorReason"
                                :placeholder="$t('common.input')"
                                maxlength="50"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div>
                    <el-button
                        :loading="searchLoading"
                        :disabled="searchLoading"
                        type="primary"
                        @click="
                            params.currentPage = 1;
                            getPageDevUpgradeLog();
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
            <div class="p-x">
                <el-button
                    type="primary"
                    @click="startAllUpgrade"
                    v-btn="'deviceUpgradeFailedReUpgrade'"
                >
                    <!-- 失败设备重新升级 -->
                    {{ $t("deviceUpgrade.failedDeviceReupgrade") }}
                </el-button>
                <el-button
                    type="default"
                    @click="stopAllUpgrade"
                    v-btn="'deviceUpgradeEndTasks'"
                >
                    <!-- 终止升级 -->
                    {{ $t("deviceUpgrade.terminateUpgrade") }}
                </el-button>
                <!-- <el-button type="default" @click="getUpdate">重获设备升级状态</el-button> -->
                <el-button
                    class="exportDownload"
                    :loading="loadingAll"
                    :disabled="loadingAll"
                    @click="exportDevUpgradeLog"
                    v-btn="'deviceUpgradeExport'"
                >
                    <!-- 导出 -->
                    {{ $t("common.export") }}
                </el-button>
            </div>
            <div class="m-y p-x">
                <el-table
                    ref="table"
                    :data="tableData"
                    v-loading="searchLoading"
                    :height="tableHeight"
                    border
                >
                    <!-- 车牌号 -->
                    <el-table-column
                        prop="plateNum"
                        :label="$t('common.plateNum')"
                        fixed
                        min-width="100px"
                    ></el-table-column>
                    <!-- 所属组织 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="orgPath"
                        :label="$t('common.orgPath')"
                        min-width="240px"
                    ></el-table-column>
                    <!-- 升级前版本号 -->
                    <el-table-column
                        prop="originalVersion"
                        :label="$t('deviceUpgrade.beforeUpgradeVersion')"
                        min-width="165px"
                    ></el-table-column>
                    <!-- 当前版本号 -->
                    <el-table-column
                        prop="currentVersion"
                        :label="$t('deviceUpgrade.currentVersion')"
                        min-width="165px"
                    ></el-table-column>
                    <!-- 进度更新时间 -->
                    <el-table-column
                        prop="upgradeStateTime"
                        :label="$t('deviceUpgrade.upgradeStateTime')"
                        min-width="165px"
                    >
                        <template slot-scope="scope">
                            {{
                                $moment(scope.row.upgradeStateTime).format(
                                    "YYYY-MM-DD HH:mm:ss"
                                )
                            }}
                        </template>
                    </el-table-column>
                    <!-- 设备序列号 -->
                    <el-table-column
                        prop="deviceSerialNum"
                        :label="$t('common.deviceSerialNum')"
                        min-width="110px"
                    ></el-table-column>
                    <!-- VIN码 -->
                    <el-table-column
                        prop="vin"
                        :label="$t('common.vin')"
                        min-width="110px"
                    ></el-table-column>
                    <!-- 终端手机号 -->
                    <el-table-column
                        prop="deviceCode"
                        :label="$t('common.deviceCode')"
                        min-width="120px"
                    ></el-table-column>
                    <!-- 外设名称 -->
                    <el-table-column
                        v-if="devUpgradeLogData.type == 'peripheral'"
                        prop="peripheralType"
                        :label="$t('common.peripheralName')"
                        min-width="165px"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.peripheralType">
                                {{
                                    deviceTypeList.find(
                                        (i) =>
                                            i.sysDictCode ==
                                            scope.row.peripheralType
                                    )
                                        ? deviceTypeList.find(
                                              (i) =>
                                                  i.sysDictCode ==
                                                  scope.row.peripheralType
                                          ).sysDictName
                                        : "--"
                                }}
                            </span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <!-- 升级次数 -->
                    <el-table-column
                        prop="omsUpgradeTaskDevLogListStr"
                        :label="$t('deviceUpgrade.numberUpgrades')"
                        min-width="110px"
                    >
                        <template slot-scope="scope">
                            <el-popover
                                placement="left"
                                width="350"
                                trigger="click"
                                v-if="
                                    scope.row.omsUpgradeTaskDevLogList &&
                                    scope.row.omsUpgradeTaskDevLogList.length
                                "
                            >
                                <div class="timeline-top">
                                    <!-- 升级次数 -->
                                    {{ $t("deviceUpgrade.numberUpgrades") }}
                                </div>
                                <el-tabs :tab-position="'left'">
                                    <el-tab-pane
                                        :label="`${$t(
                                            'conditionMonitoring.the'
                                        )}${
                                            scope.row.omsUpgradeTaskDevLogList
                                                .length - index
                                        }${$t('deviceUpgrade.orderUpgrade')}（${
                                            item.upgradeMode === 1
                                                ? $t('deviceUpgrade.automatic')
                                                : $t(
                                                      'deviceUpgrade.handMovement'
                                                  )
                                        }）`"
                                        v-for="(item, index) in scope.row
                                            .omsUpgradeTaskDevLogList"
                                        :key="index"
                                    >
                                        <el-timeline>
                                            <el-timeline-item
                                                v-for="(
                                                    activity, index
                                                ) in item.activities"
                                                :key="index"
                                                :color="activity.color"
                                                :timestamp="activity.timestamp"
                                                :title="activity.content"
                                            >
                                                {{ activity.content }}
                                            </el-timeline-item>
                                        </el-timeline>
                                    </el-tab-pane>
                                </el-tabs>
                                <el-button slot="reference" type="text">
                                    {{
                                        JSON.parse(
                                            scope.row
                                                .omsUpgradeTaskDevLogListStr
                                        ).length
                                    }}</el-button
                                >
                            </el-popover>

                            <span v-else> -- </span>
                        </template>
                    </el-table-column>
                    <!-- 设备状态 -->
                    <el-table-column
                        fixed="right"
                        prop="deviceStatus"
                        :label="$t('common.deviceStatus')"
                        min-width="120px"
                    >
                        <template slot-scope="scope">
                            <el-tag
                                type="success"
                                v-if="scope.row.deviceStatus === 1"
                            >
                                <!-- 在线 -->
                                {{ $t("common.deviceStatus_1") }}
                            </el-tag>
                            <el-tag
                                type="warning"
                                v-else-if="
                                    scope.row.deviceStatus === 2 &&
                                    scope.row.dormantStatus == 2
                                "
                            >
                                <!-- 休眠 -->
                                {{ $t("common.deviceStatus_2") }}
                            </el-tag>
                            <el-tag
                                class="littleYellow"
                                v-else-if="
                                    scope.row.deviceStatus === 2 &&
                                    scope.row.dormantStatus != 2
                                "
                            >
                                <!-- 休眠 -->
                                {{ $t("common.deviceStatus_2") }}
                            </el-tag>
                            <el-tag
                                type="info"
                                v-else-if="scope.row.deviceStatus === 0"
                            >
                                <!-- 离线 -->
                                {{ $t("common.deviceStatus_0") }}
                            </el-tag>
                            <span v-else>
                                --
                                <el-tooltip
                                    content="设备被删除或设备未连接平台更新状态"
                                >
                                    <i class="text-error el-icon-question"></i>
                                </el-tooltip>
                            </span>
                        </template>
                    </el-table-column>
                    <!-- 升级状态 -->
                    <el-table-column
                        prop="upgradeState"
                        :label="$t('deviceUpgrade.upgradeState')"
                        min-width="130px"
                        fixed="right"
                    >
                        <template slot-scope="scope">
                            <div
                                class="device-upgrade-status"
                                v-if="scope.row.upgradeState >= 0"
                            >
                                <upgradeProgress
                                    :upgradeData="scope.row"
                                ></upgradeProgress>
                            </div>
                            <div v-else>--</div>
                        </template>
                    </el-table-column>
                    <!-- 失败原因 -->
                    <el-table-column
                        prop="errorReason"
                        :label="
                            $t('deviceLoadReportVerify.activeCodeErrorMessage')
                        "
                        fixed="right"
                        min-width="160px"
                        show-overflow-tooltip
                    ></el-table-column>
                    <!-- 操作 -->
                    <el-table-column
                        fixed="right"
                        :label="$t('common.operate')"
                        width="100px"
                    >
                        <template slot-scope="scope">
                            <a
                                @click="
                                    stopUpgrade(
                                        scope.row.taskId,
                                        scope.row.id,
                                        scope.row.plateNum,
                                        scope.row.deviceCode
                                    )
                                "
                                v-if="
                                    scope.row.upgradeState == 1 ||
                                    scope.row.upgradeState == 2 ||
                                    scope.row.upgradeState == 3
                                "
                                v-btn="'deviceUpgradeEndTasks'"
                            >
                                <!-- 终止升级 -->
                                {{ $t("deviceUpgrade.terminateUpgrade") }}
                            </a>
                            <a
                                @click="
                                    startUpgrade(
                                        scope.row.taskId,
                                        scope.row.id,
                                        scope.row.plateNum,
                                        scope.row.deviceCode
                                    )
                                "
                                v-if="
                                    scope.row.upgradeState == 5 &&
                                    scope.row.taskDevId == scope.row.id
                                "
                                v-btn="'deviceUpgradeFailedReUpgrade'"
                            >
                                <!-- 重新升级 -->
                                {{ $t("deviceUpgrade.upgradeAgain") }}
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="wrap-bottom p-x">
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
            <!-- 版本升级进度详情 -->
            <el-dialog
                :title="$t('deviceUpgrade.versionUpgradeProgressDetails')"
                :visible="progressDetailVisible"
                @close="close"
                class="progress-dialog"
            >
                <el-steps
                    direction="vertical"
                    :disorder="true"
                    :space="70"
                    style="line-height: 30px !important"
                >
                    <el-step
                        v-for="(item, index) in allVersion"
                        :description="item.version"
                        :key="index"
                        :status="statusArr[item.upgradeState - 1]"
                    ></el-step>
                </el-steps>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import upgradeProgress from "@/components/upgradeProgress";
export default {
    name: "deviceUpgradeTaskDetails",
    components: { upgradeProgress },
    data() {
        return {
            tableHeight: 500,
            loadingAll: false,
            searchLoading: false,
            searchForm: {
                deviceId: "",
                upgradeState: "",
                // plateNum: "",
                errorReason: "",
                taskId: this.$route.query.taskId,
                // queryType: 2,
            },
            tableData: [],
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                // orderColumn: "plateNum", //排序列
                // orderDir: "asc", //排序方向
            },
            total: 0,
            devUpgradeLogData: {
                totalNum: "", // 总数
                successNum: "", // 成功数
                failNum: "", // 失败数
                stopNum: "", // 终止数
                ingNum: "", // 进行中数
            },
            upgradeStateSelectList: [
                {
                    label: this.$t("upgradeProgress.notStarted"), //"未开始",
                    value: "[0]",
                },
                {
                    label: this.$t("upgradeProgress.inProgress"), //"进行中",
                    value: "[1,2,3]",
                },
                {
                    label: this.$t("upgradeProgress.upgradeSuccessful"), //"升级成功",
                    value: "[4]",
                },
                {
                    label: this.$t("upgradeProgress.upgradeFailed"), //"升级失败",
                    value: "[5]",
                },
                {
                    label: this.$t("upgradeProgress.upgradeTermination"), //"升级终止",
                    value: "[6]",
                },
            ],
            upgradeStateList: {
                0: {
                    //  name: "未开始",
                    name: this.$t("upgradeProgress.notStarted"),
                    color: "#cbcbcb",
                },
                1: {
                    // name: "进行中",
                    name: this.$t("upgradeProgress.inProgress"),
                    color: "#36CBCB",
                },
                2: {
                    // name: "进行中",
                    name: this.$t("upgradeProgress.inProgress"),
                    color: "#36CBCB",
                },
                3: {
                    // name: "进行中",
                    name: this.$t("upgradeProgress.inProgress"),
                    color: "#36CBCB",
                },
                4: {
                    // name: "升级成功",
                    name: this.$t("upgradeProgress.upgradeSuccessful"),
                    color: "#52C41A",
                },
                5: {
                    // name: "升级失败",
                    name: this.$t("upgradeProgress.upgradeFailed"),
                    color: "#FF7777",
                },
                6: {
                    // name: "升级终止",
                    name: this.$t("upgradeProgress.upgradeTermination"),
                    color: "#FF952C",
                },
            },
            progressDetailVisible: false,
            active: 1,
            param: {
                taskId: "",
                deviceCode: "",
            },
            allVersion: [],
            statusArr: ["wait", "process", "success", "error"],
            chart: null,
            isShowEcharts: false,
            deviceTypeList: [],
        };
    },
    methods: {
        close() {
            this.progressDetailVisible = false;
            this.allVersion = [];
        },
        /*升级进度详情*/
        progressDetail(id) {
            this.progressDetailVisible = true;
            this.param.taskId = this.$route.query.taskId;
            this.param.deviceCode = id;
            this.$api.getDevVersionUpgradeStatus(this.param).then((res) => {
                if (res.success == true) {
                    res.data.forEach((item) => {
                        this.allVersion.push(item);
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 重查进度
        reprogress(id) {
            let params = { deviceId: id };
            this.$api.getUpgradeStatusFromDev(params).then((res) => {
                if (res.success == true) {
                    // "查询成功"
                    this.$message.success(
                        this.$t("common.search") + this.$t("common.success")
                    );
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 导出数据
        exportDevUpgradeLog() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                let params = Object.assign(this.params, this.searchForm, {
                    upgradeStates: this.searchForm.upgradeState
                        ? JSON.parse(this.searchForm.upgradeState)
                        : [],
                });
                delete params.upgradeState;
                this.$api.newUpgradeExportUpgradeTask(params).then((res) => {
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
            }
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getPageDevUpgradeLog();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getPageDevUpgradeLog();
        },
        // 获取统计数据
        getDevUpgradeLogData() {
            const params = {
                taskId: this.$route.query.taskId,
            };
            // if (!this.$route.query.organizeId) return;
            this.$api.newUpgradeGetUpgradeTaskVoById(params).then((res) => {
                if (res.success == true) {
                    this.devUpgradeLogData = res.data;
                    this.devUpgradeLogData.upgradeReason =
                        this.devUpgradeLogData.omsUpgradeTaskReasonInfoList
                            .reduce((prev, cur) => {
                                return prev.concat(cur["reason"]);
                            }, [])
                            .join("、");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        upgradeStateChange() {
            this.searchForm.errorReason = "";
        },
        // 设备升级信息
        getPageDevUpgradeLog() {
            this.searchLoading = true;
            let params = Object.assign(this.params, this.searchForm, {
                upgradeStates: this.searchForm.upgradeState
                    ? JSON.parse(this.searchForm.upgradeState)
                    : [],
            });
            delete params.upgradeState;
            this.$api.newUpgradeGetUpgradeTaskDevVoPage(params).then((res) => {
                if (res.success == true) {
                    this.tableData = res.data.results;
                    this.total = res.data.totalRecords;

                    this.searchLoading = false;
                    this.tableData.forEach((item) => {
                        if (item.omsUpgradeTaskDevLogListStr) {
                            item.omsUpgradeTaskDevLogList = JSON.parse(
                                item.omsUpgradeTaskDevLogListStr
                            );
                            item.omsUpgradeTaskDevLogList.forEach((k) => {
                                this.setActive(k);
                            });
                        }
                    });
                    this.$nextTick(() => {
                        this.setTableHeight();
                        this.$refs.table.doLayout();
                    });
                } else {
                    this.$message.error(res.msg);
                }
                this.$api.eventTrackTrigger({
                    menu: "DEVICE_UPGRADE",
                    business: "DEVICE_UPGRADE_TASK_INFO",
                    eventResult: res.success,
                });
            });
        },
        setActive(item) {
            if (item.upgradeState > 0 && item.upgradeState < 5) {
                item.activities = [
                    {
                        // content: "等待升级",
                        content: this.$t("upgradeProgress.waitingForUpgrade"),
                        timestamp: item.createTime
                            ? this.$moment(item.createTime).format(
                                  "YYYY-MM-DD HH:mm:ss"
                              )
                            : "",
                        color: "#52C41A",
                    },
                    {
                        // content: "下发命令",
                        content: this.$t("upgradeProgress.issueCommand"),
                        timestamp: item.sendCmdTime
                            ? this.$moment(item.sendCmdTime).format(
                                  "YYYY-MM-DD HH:mm:ss"
                              )
                            : "",
                        color: item.sendCmdTime ? "#52C41A" : "#e4e7ed",
                    },
                    {
                        // content: "升级成功",
                        content: this.$t("upgradeProgress.upgradeSuccessful"),
                        timestamp: item.upgradeEndTime
                            ? this.$moment(item.upgradeEndTime).format(
                                  "YYYY-MM-DD HH:mm:ss"
                              )
                            : "",
                        color:
                            item.upgradeState === 4
                                ? this.upgradeStateList[item.upgradeState].color
                                : "#e4e7ed",
                    },
                ];
                if (item.upgradeResultCmdTime) {
                    item.activities.splice(2, 0, {
                        // content: "固件烧写完成",
                        content: this.$t(
                            "upgradeProgress.firmwareBurningCompleted"
                        ),
                        timestamp: item.upgradeResultCmdTime
                            ? this.$moment(item.upgradeResultCmdTime).format(
                                  "YYYY-MM-DD HH:mm:ss"
                              )
                            : "",
                        color: item.upgradeResultCmdTime
                            ? "#52C41A"
                            : "#e4e7ed",
                    });
                }
            } else if (item.upgradeState >= 5) {
                item.activities = [
                    {
                        // content: "等待升级",
                        content: this.$t("upgradeProgress.waitingForUpgrade"),
                        timestamp: item.createTime
                            ? this.$moment(item.createTime).format(
                                  "YYYY-MM-DD HH:mm:ss"
                              )
                            : "",
                        color: "#52C41A",
                    },
                ];
                if (item.sendCmdTime) {
                    item.activities.push({
                        // content: "下发命令",
                        content: this.$t("upgradeProgress.issueCommand"),
                        timestamp: this.$moment(item.sendCmdTime).format(
                            "YYYY-MM-DD HH:mm:ss"
                        ),
                        color: "#52C41A",
                    });
                }
                if (item.upgradeResultCmdTime) {
                    item.activities.push({
                        // content: "固件烧写完成",
                        content: this.$t(
                            "upgradeProgress.firmwareBurningCompleted"
                        ),
                        timestamp: this.$moment(
                            item.upgradeResultCmdTime
                        ).format("YYYY-MM-DD HH:mm:ss"),
                        color: "#52C41A",
                    });
                }
                item.activities.push({
                    content: `${this.upgradeStateList[item.upgradeState].name}${
                        item.upgradeState === 5
                            ? item.errorReason
                                ? "(" + item.errorReason + ")"
                                : ""
                            : ""
                    }`,
                    timestamp: item.upgradeEndTime
                        ? this.$moment(item.upgradeEndTime).format(
                              "YYYY-MM-DD HH:mm:ss"
                          )
                        : "",
                    color: this.upgradeStateList[item.upgradeState].color,
                });
            }
        },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
                this.searchForm.upgradeState = "";
            }
        },
        // 终止升级
        stopUpgrade(taskId, taskDevId, plateNum, deviceCode) {
            this.$confirm(
                // plateNum
                //     ? `此操作将会终止手机号为“${deviceCode}”的“${plateNum}”的升级，是否确认终止升级?`
                //     : `此操作将会终止手机号为“${deviceCode}”的升级，是否确认终止升级?`,
                plateNum
                    ? this.$t("deviceUpgrade.stopUpgradeText1", {
                          plateNum: plateNum,
                          deviceCode: deviceCode,
                      })
                    : this.$t("deviceUpgrade.stopUpgradeText2", {
                          deviceCode: deviceCode,
                      }),
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    let params = {
                        taskDevIds: [taskDevId],
                    };
                    this.$api.newUpgradeStopUpgrade(params).then((res) => {
                        if (res.success == true) {
                            this.getPageDevUpgradeLog(); //设备升级信息
                            this.getDevUpgradeLogData(); //获取统计信息
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        // 重新升级
        startUpgrade(taskId, taskDevId, plateNum, deviceCode) {
            this.$confirm(
                // plateNum
                //     ? `此操作将会重新升级“${plateNum}”的“${deviceCode}”，是否确认重新升级?`
                //     : `此操作将会重新升级“${deviceCode}”，是否确认重新升级?`,
                plateNum
                    ? this.$t("deviceUpgrade.reUpgradeText1", {
                          plateNum: plateNum,
                          deviceCode: deviceCode,
                      })
                    : this.$t("deviceUpgrade.reUpgradeText2", {
                          deviceCode: deviceCode,
                      }),
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    let params = {
                        taskDevIds: [taskDevId],
                    };
                    this.$api.newUpgradeReUpgrade(params).then((res) => {
                        if (res.success == true) {
                            this.getPageDevUpgradeLog();
                            this.getDevUpgradeLogData();
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        // 全部重新升级
        startAllUpgrade() {
            this.$confirm(
                // `此操作将会重新升级当前任务下的所有升级失败设备，是否确认重新升级?`,
                this.$t("deviceUpgrade.startAllUpgradeText"),
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    let params = {
                        taskId: this.$route.query.taskId,
                    };
                    this.$api.newUpgradeReUpgrade(params).then((res) => {
                        if (res.success == true) {
                            this.getPageDevUpgradeLog();
                            this.getDevUpgradeLogData();
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        //重新获取设备升级状态
        // getUpdate(){
        //   let params={
        //         taskId: this.$route.query.taskId
        //       }
        //   this.$api.getRefreshUpgradeStatus(params).then(res =>{
        //     if(res.success == true) {
        //       this.$message.success('刷新成功，请稍后点击查询按钮查看设备最新的升级状态！')
        //     }else{
        //       this.$message.error('重获设备升级状态失败:' + res.msg);
        //     }
        //   })
        // },
        // 全部终止升级
        stopAllUpgrade() {
            this.$confirm(
                // `此操作将会终止升级当前任务下的所有未开始升级设备，是否确认终止升级?`,
                this.$t("deviceUpgrade.stopAllUpgradeText"),
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    let params = {
                        taskId: this.$route.query.taskId,
                    };
                    this.$api.newUpgradeStopUpgrade(params).then((res) => {
                        if (res.success == true) {
                            this.getPageDevUpgradeLog();
                            this.getDevUpgradeLogData();
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 380;
        },
        getTaskErrorAnalysisById() {
            return new Promise((resolve, reject) => {
                const params = {
                    taskId: this.$route.query.taskId,
                };
                this.$api
                    .newUpgradeGetTaskErrorAnalysisById(params)
                    .then((res) => {
                        if (res.success == true) {
                            if (res.data && res.data.length) {
                                this.isShowEcharts = true;
                                resolve(res.data);
                            } else {
                                this.isShowEcharts = false;
                                reject();
                            }
                        } else {
                            this.$message.error(res.msg);
                            reject();
                        }
                    });
            });
        },
        initEcharts() {
            this.getTaskErrorAnalysisById().then((errData) => {
                this.chart = this.$echarts.init(
                    document.getElementById("echarts-box")
                ); //初始加载动节点
                this.chart.clear();
                this.chart.resize();
                let data = [];
                let newData = [];
                let sum = 0;
                errData.sort(function (a, b) {
                    return b.errorNum - a.errorNum;
                });
                if (errData.length > 5) {
                    newData = errData.slice(0, 5);
                    const newArray = errData.filter((_, index) => index > 4);
                    newData.push({
                        errorNum: newArray.reduce((prev, cur) => {
                            return prev + cur.errorNum;
                        }, 0),
                        errorReason: this.$t("deviceHealthCondition.other"), //"其他",
                    });
                } else {
                    newData = errData;
                }

                newData.forEach((item) => {
                    data.push({
                        value: item.errorNum,
                        name: item.errorReason || "--",
                    });
                });
                sum = errData.reduce((prev, cur) => {
                    return prev + cur.errorNum;
                }, 0);
                let option = {
                    // 图形中间文字
                    title: [
                        {
                            text: this.$t(
                                "deviceUpgrade.totalNumberOfFailures"
                            ), //"失败总数",
                            top: "42%",
                            left: "27%",
                            textAlign: "center",
                            textStyle: {
                                fontSize: 14,
                                fontWeight: "normal",
                            },
                        },
                        {
                            text: sum,
                            top: "52%",
                            left: "27%",
                            textAlign: "center",
                            textStyle: {
                                fontSize: 26,
                                color: "black",
                                fontWeight: "bolder",
                            },
                        },
                    ],
                    tooltip: {
                        show: true,
                    },
                    legend: {
                        orient: "vertical",
                        right: "left",
                        y: "center",
                        icon: "circle",
                        formatter: function (name) {
                            var total = 0;
                            var target;
                            for (var i = 0, l = data.length; i < l; i++) {
                                total += data[i].value;
                                if (data[i].name == name) {
                                    target = data[i].value;
                                }
                            }
                            var arr = [
                                "{a|" +
                                    (name.length > 8
                                        ? name.substr(0, 8) + "..."
                                        : name) +
                                    "}{b|  | " +
                                    Math.floor((target / total) * 100 * 10) /
                                        10 +
                                    "%}{c|" +
                                    target +
                                    "}",
                            ];
                            return arr.join("\n");
                        },
                        tooltip: {
                            show: true,
                        },
                        textStyle: {
                            rich: {
                                a: {
                                    align: "left",
                                    padding: [0, 0, 0, 4],
                                },
                                b: {
                                    padding: [0, 0, 0, 4],
                                    color: "#999999",
                                },
                                c: {
                                    padding: [0, 0, 0, 20],
                                },
                            },
                        },
                    },
                    series: [
                        {
                            type: "pie",
                            color: [
                                "#f2637b",
                                "#fad337",
                                "#3aa0ff",
                                "#36cbcb",
                                "#4dcb73",
                                "#975fe4",
                            ],
                            center: ["28%", "50%"],
                            radius: ["55%", "70%"],
                            avoidLabelOverlap: false,
                            padAngle: 5,
                            itemStyle: {
                                borderRadius: 10,
                            },
                            label: {
                                show: false,
                                position: "right",
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: "rgba(0, 0, 0, 0.5)",
                                },
                            },
                            labelLine: {
                                show: false,
                            },
                            data: data,
                        },
                    ],
                };
                this.chart.setOption(option);
            });
        },
        getDeviceType() {
            this.$api.newFirmwareGetPeripheralList().then((res) => {
                if (res.success == true) {
                    this.deviceTypeList = [];
                    res.data.forEach((item) => {
                        this.deviceTypeList.push(item);
                    });
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
        if (this.$route.query.upgradeState) {
            this.searchForm.upgradeState = this.$route.query.upgradeState;
        }
        this.getDeviceType();
        this.setTableHeight();
        this.getPageDevUpgradeLog();
        this.getDevUpgradeLogData();
    },
};
</script>
<style lang="less">
.device-upgrade-detail {
    .el-tag--dark {
        border: none;
        width: 76px;
        text-align: center;
        line-height: 24px !important;
    }
}
</style>
<style scoped lang="less">
.device-upgrade-detail {
    .veisionText {
        color: #4d4d4d;
    }
    .veisionTextgray {
        color: #7f7f7f;
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
    .wrap {
        // height: 100%;
        display: flex;
        flex-direction: column;
        .wrap-top {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .el-form-item {
                margin-bottom: 14px !important;
            }
        }
        .wrap-bottom {
            border-top: 1px solid #e4e4e4;
        }
    }
    .link-btn {
        display: flex;
        .el-button--text span {
            color: #4886ff;
        }
    }
}
/deep/.progress-dialog {
    .el-step__description {
        width: 200px;
    }
    //1-未开始
    .el-step__head.is-wait {
        border-color: #999999;
        .el-step__icon-inner {
            color: #999999;
        }
    }
    .el-step__description.is-wait {
        color: #999999;
    }
    //2-进行中
    .el-step__head.is-process {
        border-color: #448aff;
        .el-step__icon-inner {
            color: #448aff;
        }
    }
    .el-step__description.is-process {
        color: #448aff;
    }
    //3-升级成功
    .el-step__head.is-success {
        border-color: #00c853;
        .el-step__icon-inner {
            color: #00c853;
        }
    }
    .el-step__description.is-success {
        color: #00c853;
    }
    //4-升级失败
    .el-step__head.is-error {
        border-color: #d50000;
        background-color: #ffffff;
        .el-step__icon-inner {
            color: #d50000;
        }
    }
    .el-step__description.is-error {
        color: #d50000;
    }
}

.task-detail-top {
    display: flex;
    padding: 14px;
    border-bottom: 1px solid #e9e9e9;
    .detail-data {
        flex: 1;
        h2 {
            height: 28px;
            font-size: 18px;
            line-height: 28px;
        }
        & > div {
            margin-top: 8px;
            & > span {
                display: inline-block;
                height: 22px;
                line-height: 22px;
                width: 300px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
    .detail-num {
        width: 500px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        & > div {
            height: 22px;
            line-height: 22px;
            margin-bottom: 8px;
            font-size: 14px;
            & > span {
                font-size: 12px;
                font-weight: 500;
            }
        }
    }
}
.timeline-top {
    display: flex;
    margin-bottom: 8px;
    font-weight: bold;
}
.el-timeline {
    padding-left: 8px;
    /deep/.el-timeline-item {
        padding-bottom: 8px;
        .el-timeline-item__wrapper {
            height: 44px;
            display: flex;
            flex-direction: column;
        }
        .el-timeline-item__content {
            display: inline-block;
            height: 22px;
            line-height: 22px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .el-timeline-item__timestamp {
            margin-top: 0px;
            display: inline-block;
            height: 22px;
            line-height: 22px;
            min-width: 100px;
        }
    }
}
.el-tabs {
    /deep/.el-tabs__item {
        padding: 0px 8px 0 0;
    }
}
/deep/#echarts-box {
    width: 450px;
    height: 300px;
}
.no-data {
    width: 100%;
    background-position: center top;
    padding: 160px 0 0 0;
    text-align: center;
}
.el-icon-question {
    cursor: pointer;
    font-size: 14px;
}
</style>
