<template>
    <div class="device-upgrade-view">
        <div class="wrap">
            <div ref="searchBox" class="search-module">
                <div
                    class="search-form-content"
                    :class="{ hidden: !buttonClick }"
                    ref="wrap"
                >
                    <el-form :model="searchForm" ref="searchForm" inline>
                        <el-form-item
                            :label="$t('common.keywords')"
                            prop="deviceId"
                        >
                            <G-DeviceSearch
                                :valueKey="'deviceId'"
                                :value.sync="searchForm.deviceId"
                                :organizeId="params.organizeId"
                            ></G-DeviceSearch>
                        </el-form-item>
                        <!-- 任务状态 -->
                        <el-form-item
                            prop="taskStateList"
                            :label="$t('deviceUpgrade.taskStatus')"
                        >
                            <el-select
                                v-model="searchForm.taskStateList"
                                :placeholder="$t('common.select')"
                            >
                                <el-option
                                    v-for="(item, index) in taskStateSearchList"
                                    :key="index"
                                    :value="item.value"
                                    :label="item.name"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 设备型号 -->
                        <el-form-item
                            prop="deviceModelCode"
                            :label="$t('common.deviceModelCode')"
                        >
                            <el-select
                                v-if="userHdcType == 2 || userHdcType == 4"
                                v-model="searchForm.deviceModelCode"
                                :placeholder="$t('common.select')"
                                clearable
                                filterable
                            >
                                <el-option
                                    v-for="(item, index) in deviceModelList"
                                    :key="index"
                                    :value="item.fieldNameEN"
                                    :label="item.fieldNameCN"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 操作时间段 -->
                        <el-form-item
                            :label="$t('operationLog.operationTimePeriod')"
                            prop="operationTime"
                        >
                            <el-date-picker
                                :default-time="['00:00:00', '23:59:59']"
                                size="small"
                                v-model="searchForm.operationTime"
                                type="datetimerange"
                                :start-placeholder="$t('common.startTime')"
                                :end-placeholder="$t('common.endTime')"
                                transfer
                                clearable
                                value-format="yyyy-MM-dd HH:mm:ss"
                            ></el-date-picker>
                        </el-form-item>
                        <!-- 项目 -->
                        <el-form-item
                            v-if="userHdcType == 2"
                            class="widthProduct"
                            prop="productKey"
                            :label="$t('deviceUpgrade.project')"
                        >
                            <el-select
                                v-model="searchForm.dsubAk"
                                :placeholder="$t('common.select')"
                                clearable
                            >
                                <el-option
                                    v-for="(item, index) in dsubAkLists"
                                    :key="index"
                                    :value="item.dSubAK"
                                    :label="item.projectName"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div ref="searchBtn" class="search-btn">
                    <el-button
                        type="primary"
                        :loading="searchLoading"
                        :disabled="searchLoading"
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
                    <el-button
                        :icon="
                            !buttonClick
                                ? 'el-icon-d-arrow-left'
                                : 'el-icon-d-arrow-right'
                        "
                        @click="handleClick"
                        v-if="iconShow"
                    />
                </div>
            </div>
            <div class="p-x">
                <el-table
                    v-loading="searchLoading"
                    :element-loading-text="$t('common.desperatelyLoading')"
                    element-loading-color="#007213"
                    :data="tableData"
                    :height="tableHeight"
                    border
                    stripe
                >
                    <!-- 操作时间 -->
                    <el-table-column
                        prop="createTime"
                        :label="$t('operationLog.operationTime')"
                        min-width="160px"
                    >
                        <template slot-scope="scope">
                            {{
                                $moment(scope.row.createTime).format(
                                    "YYYY-MM-DD HH:mm:ss"
                                )
                            }}
                        </template>
                    </el-table-column>
                    <!-- 主机型号 -->
                    <el-table-column
                        prop="deviceModelCode"
                        :label="$t('firmware.hostModel')"
                        width="120px"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <!-- 主机接入协议 -->
                    <el-table-column
                        prop="protocolName"
                        :label="$t('deviceUpgrade.hostAccessProtocol')"
                        min-width="100px"
                    >
                    </el-table-column>
                    <!-- 目标版本号 -->
                    <el-table-column
                        prop="firmwareVersion"
                        :label="$t('deviceUpgrade.targetVersion')"
                        min-width="200px"
                    ></el-table-column>
                    <!-- 固件类型-->
                    <el-table-column
                        prop="type"
                        :label="$t('firmware.firmwareType')"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.type === 'main'">
                                <!-- 主机 -->
                                {{ $t("firmware.host") }}
                            </span>
                            <span v-if="scope.row.type === 'peripheral'">
                                <!-- 外设 -->
                                {{ $t("firmware.peripherals") }}
                            </span>
                        </template>
                    </el-table-column>
                    <!-- 外设名称 -->
                    <el-table-column
                        prop="peripheralType"
                        :label="$t('firmware.peripheralName')"
                        width="160px"
                    >
                        <template slot-scope="scope">
                            <span
                                v-if="
                                    scope.row.peripheralType &&
                                    scope.row.type === 'peripheral'
                                "
                            >
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
                    <!-- 升级总数 -->
                    <el-table-column
                        prop="taskDevRecordTotalNum"
                        :label="$t('deviceUpgrade.upgradesTotalNumber')"
                        align="right"
                    >
                        <template slot-scope="scope">
                            <!-- <span v-if="scope.row.taskState !== 7">
                                {{ scope.row.taskDevRecordTotalNum }}</span
                            > -->
                            <el-button
                                type="text"
                                v-if="scope.row.taskState !== 7"
                                @click="goDetail(scope.row)"
                            >
                                {{ scope.row.taskDevRecordTotalNum }}
                            </el-button>
                            <span v-else style="color: #f56c6c">
                                <!-- 升级异常 -->
                                {{ $t("deviceUpgrade.upgradeException") }}
                            </span>
                        </template>
                    </el-table-column>
                    <!-- 升级成功 -->
                    <el-table-column
                        prop="taskDevSuccessNum"
                        :label="$t('upgradeProgress.upgradeSuccessful')"
                        align="right"
                    >
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                v-if="scope.row.taskDevSuccessNum"
                                @click="goDetail(scope.row, [4])"
                                >{{ scope.row.taskDevSuccessNum }}</el-button
                            >
                            <span v-else> -- </span>
                        </template>
                    </el-table-column>
                    <!-- 进行中 -->
                    <el-table-column
                        prop="taskDevIngNum"
                        :label="$t('upgradeProgress.inProgress')"
                        align="right"
                    >
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                v-if="scope.row.taskDevIngNum"
                                @click="goDetail(scope.row, [1, 2, 3])"
                                >{{ scope.row.taskDevIngNum }}</el-button
                            >
                            <span v-else> -- </span>
                        </template>
                    </el-table-column>
                    <!-- 升级失败 -->
                    <el-table-column
                        prop="taskDevFailNum"
                        :label="$t('upgradeProgress.upgradeFailed')"
                        align="right"
                    >
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                style="color: #f56c6c"
                                v-if="scope.row.taskDevFailNum"
                                @click="goDetail(scope.row, [5])"
                                >{{ scope.row.taskDevFailNum }}</el-button
                            >
                            <span v-else> -- </span>
                        </template>
                    </el-table-column>
                    <!-- 升级终止 -->
                    <el-table-column
                        prop="taskDevEndNum"
                        :label="$t('upgradeProgress.upgradeTermination')"
                        align="right"
                    >
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                v-if="scope.row.taskDevEndNum"
                                @click="goDetail(scope.row, [6])"
                                >{{ scope.row.taskDevEndNum }}</el-button
                            >
                            <span v-else> -- </span>
                        </template>
                    </el-table-column>
                    <!-- 任务状态 -->
                    <el-table-column
                        prop="taskState"
                        :label="$t('deviceUpgrade.taskStatus')"
                        width="120px"
                    >
                        <template slot-scope="scope">
                            <div
                                class="device-taskState"
                                v-if="
                                    scope.row.taskState > 0 &&
                                    scope.row.taskState <= 6
                                "
                            >
                                <el-popover
                                    placement="left"
                                    width="200"
                                    trigger="hover"
                                >
                                    <div class="timeline-top">
                                        <span>
                                            <!-- 任务进度 -->
                                            {{
                                                $t("deviceUpgrade.taskProgress")
                                            }}
                                        </span>
                                    </div>
                                    <el-timeline>
                                        <el-timeline-item
                                            v-for="(
                                                activity, index
                                            ) in taskStateList.slice(0, 4)"
                                            :key="index"
                                            :color="
                                                scope.row.taskState >=
                                                Math.min(...activity.value)
                                                    ? '#52C41A'
                                                    : '#cbcbcb'
                                            "
                                        >
                                            {{ activity.name }}
                                        </el-timeline-item>
                                    </el-timeline>
                                    <div
                                        slot="reference"
                                        class="taskState-content"
                                    >
                                        <i
                                            :class="`taskState${scope.row.taskState}`"
                                        ></i>
                                        <span>{{
                                            getName(scope.row.taskState, "name")
                                        }}</span>
                                    </div>
                                </el-popover>
                            </div>
                            <div
                                v-else-if="scope.row.taskState === 7"
                                class="taskState-content"
                            >
                                <i :class="`taskState7`"></i>
                                <span>{{
                                    getName(scope.row.taskState, "name")
                                }}</span>
                            </div>
                            <span v-else> -- </span>
                        </template>
                    </el-table-column>
                    <!-- 更新时间 -->
                    <el-table-column
                        prop="statisticsRefreshTime"
                        :label="$t('common.updateTime')"
                        min-width="160px"
                    >
                        <template slot-scope="scope">
                            {{
                                $moment(scope.row.statisticsRefreshTime).format(
                                    "YYYY-MM-DD HH:mm:ss"
                                )
                            }}
                        </template>
                    </el-table-column>
                    <!-- 升级原因 -->
                    <el-table-column
                        prop="statisticsRefreshTime"
                        :label="$t('deviceUpgrade.reasonForUpgrade')"
                        min-width="160px"
                        show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.omsUpgradeTaskReasonInfoList
                                    .reduce((prev, cur) => {
                                        return prev.concat(cur["reason"]);
                                    }, [])
                                    .join(",")
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('common.operate')"
                        width="120px"
                        fixed="right"
                    >
                        <template slot-scope="scope">
                            <a @click="goDetail(scope.row)">
                                <!-- 详情 -->
                                {{ $t("common.detail") }}
                            </a>
                            <a
                                v-if="scope.row.taskState === 7"
                                @click="reUpgradeTask(scope.row)"
                            >
                                <!-- 恢复任务 -->
                                {{ $t("deviceUpgrade.recoveryTask") }}
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="bottom p-x">
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
    </div>
</template>

<script>
export default {
    name: "deviceUpgradeTask",
    components: {},
    data() {
        return {
            screenTerm: false,
            userHdcType: localStorage.getItem("userHdcType"),
            dSubAk: localStorage.getItem("dSubAk"),
            dAK: localStorage.getItem("dAk"),
            searchLoading: true,
            loadingAll: false,
            buttonClick: false,
            iconShow: false,
            expandedList: [],
            popoverVisible: false,
            popoverIng: 0,
            popoverFail: 0,
            tableHeight: 500,
            searchForm: {
                taskStateList: "[]",
                operationTime: [],
                queryType: 1,
                deviceModelCode: "",
                deviceId: "",
                dsubAk: "",
            },
            dsubAkText: "",
            dsubAkLists: [],
            treeData: [],
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                organizeId: null,
                orderColumn: "id", //排序列
                orderDir: "desc", //排序方向
            },
            total: 0,
            tableData: [],
            deviceModelList: [],
            organizationName: "",
            deviceTypeList: [],
            taskStateList: [
                {
                    name: this.$t("deviceUpgrade.taskAnalysis"), //"任务分析",
                    value: [1, 2],
                },
                {
                    name: this.$t("deviceUpgrade.taskGeneration"), // "任务生成",
                    value: [3, 4],
                },
                {
                    name: this.$t("deviceUpgrade.taskExecution"), //"任务执行",
                    value: [5],
                },
                {
                    name: this.$t("deviceUpgrade.taskAccomplished"), //"任务完成",
                    value: [6],
                },
                {
                    name: this.$t("deviceUpgrade.taskException"), //"任务异常",
                    value: [7],
                },
            ],
            taskStateSearchList: [
                {
                    name: this.$t("common.all"), // "全部",
                    value: "[]",
                },
                {
                    name: this.$t("deviceUpgrade.taskAccomplished"), //"任务完成",
                    value: "[6]",
                },
                {
                    name: this.$t("deviceUpgrade.taskNotCompleted"), //"任务未完成",
                    value: "[1, 2, 3, 4, 5, 7]",
                },
            ],
        };
    },
    watch: {
        organizationName(val) {
            this.$refs.tree.filter([val, this.screenTerm]);
        },
        "searchForm.dsubAk": {
            handler(val) {
                this.dsubAkText = val;
                this.getProductListByDSubAK();
            },
            deep: true,
        },
    },
    methods: {
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getTableData();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getTableData();
        },
        //详情
        goDetail(val, upgradeState) {
            let taskId = val.id;
            let operationTime = val.beginTime;
            let totalNum = val.totalNum;
            let successNum = val.successNum;
            let failNum = val.failNum;
            let stopNum = val.stopNum;
            let ingNum = val.ingNum;
            let firmwareTypeName = val.firmwareTypeName;
            let deviceModelCode = val.deviceModelCode;
            let updateVersion = val.updateVersion;
            let protocolName = val.protocolName;
            this.$router.push({
                path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeTask/deviceUpgradeTaskDetail",
                query: {
                    taskId,
                    organizeId: this.params.organizeId,
                    operationTime,
                    totalNum,
                    successNum,
                    failNum,
                    stopNum,
                    ingNum,
                    firmwareTypeName,
                    deviceModelCode,
                    updateVersion,
                    protocolName,
                    upgradeState: JSON.stringify(upgradeState),
                },
            });
        },
        //查询
        getTableData() {
            this.searchLoading = true;
            let params = Object.assign(this.params, this.searchForm, {
                taskStateList: JSON.parse(this.searchForm.taskStateList),
            });
            if (
                this.searchForm.operationTime &&
                this.searchForm.operationTime.length
            ) {
                params.beginTime = this.searchForm.operationTime[0];
                params.endTime = this.searchForm.operationTime[1];
            } else {
                params.beginTime = "";
                params.endTime = "";
            }
            this.$store.dispatch("SetShowSearchForm", this.searchForm);
            this.searchLoading = true;
            this.$api
                .newUpgradeGetUpgradeTaskVoPage(params)
                .then((res) => {
                    if (res.success == true) {
                        // console.log(res)
                        this.tableData = res.data.results;
                        this.tableData.forEach((item) => {
                            if (
                                item.upgradeState > 0 &&
                                item.upgradeState < 5
                            ) {
                                item.activities = [
                                    {
                                        // content: "等待升级",
                                        content: this.$t(
                                            "upgradeProgress.waitingForUpgrade"
                                        ),
                                        timestamp: this.$moment(
                                            item.sendCmdTime
                                        ).format("YYYY-MM-DD HH:mm:ss"),
                                        color: "#52C41A",
                                    },
                                    {
                                        // content: "下发命令",
                                        content: this.$t(
                                            "upgradeProgress.issueCommand"
                                        ),
                                        timestamp: item.sendCmdTime
                                            ? this.$moment(
                                                  item.sendCmdTime
                                              ).format("YYYY-MM-DD HH:mm:ss")
                                            : "",
                                        color: item.sendCmdTime
                                            ? "#52C41A"
                                            : "#e4e7ed",
                                    },
                                    {
                                        // content: "固件烧写完成",
                                        content: this.$t(
                                            "upgradeProgress.firmwareBurningCompleted"
                                        ),
                                        timestamp: item.upgradeResultCmdTime
                                            ? this.$moment(
                                                  item.upgradeResultCmdTime
                                              ).format("YYYY-MM-DD HH:mm:ss")
                                            : "",
                                        color: item.upgradeResultCmdTime
                                            ? "#52C41A"
                                            : "#e4e7ed",
                                    },
                                    {
                                        // content: "升级成功",
                                        content: this.$t(
                                            "upgradeProgress.upgradeSuccessful"
                                        ),
                                        timestamp: item.upgradeEndTime
                                            ? this.$moment(
                                                  item.upgradeEndTime
                                              ).format("YYYY-MM-DD HH:mm:ss")
                                            : "",
                                        color:
                                            item.upgradeState === 4
                                                ? "#36CBCB"
                                                : "#e4e7ed",
                                    },
                                ];
                            } else if (item.upgradeState >= 5) {
                                item.activities = [
                                    {
                                        // content: "等待升级",
                                        content: this.$t(
                                            "upgradeProgress.waitingForUpgrade"
                                        ),
                                        timestamp: this.$moment(
                                            item.createTime
                                        ).format("YYYY-MM-DD HH:mm:ss"),
                                        color: "#52C41A",
                                    },
                                ];
                                if (item.sendCmdTime) {
                                    item.activities.push({
                                        // content: "下发命令",
                                        content: this.$t(
                                            "upgradeProgress.issueCommand"
                                        ),
                                        timestamp: this.$moment(
                                            item.sendCmdTime
                                        ).format("YYYY-MM-DD HH:mm:ss"),
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
                                    content: `${
                                        this.upgradeStateList[item.upgradeState]
                                            .name
                                    }${
                                        item.upgradeState === 5
                                            ? "(" + item.errorReason + ")"
                                            : ""
                                    }`,
                                    timestamp: item.upgradeEndTime
                                        ? this.$moment(
                                              item.upgradeEndTime
                                          ).format("YYYY-MM-DD HH:mm:ss")
                                        : "",
                                    color: this.upgradeStateList[
                                        item.upgradeState
                                    ].color,
                                });
                            }
                        });
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
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
            }
        },
        // 获取设备型号下拉列表数据
        getDeviceModelList() {
            this.$api.getProductListByDSubAK().then((res) => {
                if (res.success) {
                    this.deviceModelList = [
                        { fieldNameEN: "", fieldNameCN: this.$t("common.all") },
                    ];
                    res.data.forEach((item) => {
                        this.deviceModelList.push({
                            fieldNameEN: item,
                            fieldNameCN: item,
                        });
                    });
                } else {
                    this.$message.error(`${res.msg}`);
                }
            });
        },
        setTableHeight() {
            this.tableHeight = this.buttonClick
                ? document.body.clientHeight - 240
                : document.body.clientHeight - 194;
        },
        //获取当前用户的项目数;
        getPlatformUserProject() {
            this.$api
                .getPlatformUserProject({ dAK: JSON.parse(this.dAK) })
                .then((res) => {
                    if (res.success) {
                        this.dsubAkLists = [
                            { dSubAK: "", projectName: this.$t("common.all") },
                            ...res.data,
                        ];
                    } else {
                        this.$message.error(`${res.msg}`);
                    }
                });
        },
        //获取特定项目编号下的设备型号
        getProductListByDSubAK() {
            if (this.dsubAkText) {
                this.$api.getProductListByDSubAK().then((res) => {
                    if (res.success) {
                        this.deviceModelList = [
                            {
                                fieldNameEN: "",
                                fieldNameCN: this.$t("common.all"),
                            },
                        ];
                        res.data.forEach((item) => {
                            this.deviceModelList.push({
                                fieldNameEN: item,
                                fieldNameCN: item,
                            });
                        });
                    } else {
                        this.$message.error(`${res.msg}`);
                    }
                });
            } else {
                this.deviceModelList = [
                    { fieldNameEN: "", fieldNameCN: this.$t("common.all") },
                ];
            }
        },

        //查询重置
        handleClick() {
            this.buttonClick = !this.buttonClick;
            this.setTableHeight();
        },
        setWrap() {
            let scrollHeight = this.$refs.wrap.scrollHeight;
            if (this.$refs.wrap.scrollHeight > 46) {
                this.iconShow = true;
            } else {
                this.iconShow = false;
            }
        },
        reUpgradeTask(data) {
            this.$api
                .newUpgradeReUpgradeTask({
                    taskId: data.id,
                })
                .then((res) => {
                    if (res.success) {
                        // this.$message.success("恢复任务成功");
                        this.$message.success(
                            this.$t("deviceUpgrade.recoveryTask") +
                                this.$t("common.success")
                        );
                        this.getTableData();
                    } else {
                        this.$message.error(res.msg);
                    }
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
        getName(val, key) {
            return this.taskStateList.find((item) => {
                return item.value.find((k) => k === val);
            })[key];
        },
    },
    mounted() {
        this.setWrap();

        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
                this.setWrap();
            })();
        };
    },
    created() {
        if (this.userHdcType == 2) {
            this.getPlatformUserProject();
        } else {
            this.getDeviceModelList();
        }
        this.getDeviceType();
        this.setTableHeight();
        this.getTableData();
    },
};
</script>

<style scoped lang="less">
.device-upgrade-view {
    .title {
        display: flex;
        justify-content: space-between;
    }
    .wrap {
        height: 100%;
        .wrap-top {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .flex {
                display: flex;
            }
            .el-form-item {
                margin-bottom: 12px;
            }
        }
        .hidden {
            height: 46px;
            overflow: hidden;
        }
    }
    .bottom {
    }
    /deep/.el-pagination {
        display: flex;
        .el-pager {
            height: 28px;
        }
    }
    .el-table {
        .el-button--text {
            font-size: 12px;
        }
    }
}
.timeline-top {
    display: flex;
    margin-bottom: 12px;
    & > span {
        font-size: 14px;
    }
}
.el-timeline-item {
    padding-bottom: 8px;
}
.taskState-content {
    display: flex;
    justify-content: start;
    align-items: center;
    i {
        margin-right: 4px;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }
    .taskState1,
    .taskState2 {
        background: #ff952c;
    }
    .taskState3,
    .taskState4 {
        background: #52c41a;
    }
    .taskState5 {
        background: #36cbcb;
    }
    .taskState6 {
        background: #cbcbcb;
    }
    .taskState7 {
        background: #ff7777;
    }
}
</style>
<style lang="less">
.device-taskState {
}
</style>
