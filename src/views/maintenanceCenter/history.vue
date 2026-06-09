<template>
    <div class="history">
        <div class="p-x-md p-y">
            <div class="text-lg p-b-sm">
                <span>{{ $route.query.plateNum || "--" }}</span>
            </div>
            <div
                class="text-sm"
                style="padding-bottom: 1rem !important; color: #999"
            >
                <span class="version m-r-md">
                    <!-- 所属组织 -->
                    {{ $t("common.orgPath") }}：{{ $route.query.orgPath }}</span
                >
                <span class="version m-r-md">
                    <!-- 设备序列号 -->
                    {{ $t("common.deviceSerialNum") }}：{{
                        $route.query.deviceSerialNum || "--"
                    }}</span
                >
                <span class="version m-r-md">
                    <!-- 终端手机号 -->
                    {{ $t("common.deviceCode") }}：{{
                        $route.query.deviceCode || "--"
                    }}</span
                >
                <span class="version m-r-md">
                    <!-- VIN码 -->
                    {{ $t("common.vin") }}：{{ $route.query.vin || "--" }}</span
                >
                <span class="version m-r-md">
                    <!-- 设备型号 -->
                    {{ $t("common.deviceModelCode") }}：{{
                        $route.query.deviceModelCode
                    }}{{
                        $route.query.protocolName
                            ? `(${$route.query.protocolName})`
                            : ""
                    }}</span
                >
                <span class="version m-r-md">
                    <!-- 设备厂商 -->
                    {{ $t("common.manufacturerNameString") }}：{{
                        $route.query.manufacturerNameString || "--"
                    }}</span
                >
                <span class="version m-r-md">
                    <!-- 安装服务商 -->
                    {{
                        $t("conditionMonitoring.installationServiceProvider")
                    }}：{{ $route.query.installerString || "--" }}</span
                >
            </div>
            <div class="search">
                <div>
                    <el-form inline ref="searchForm" :model="params">
                        <!-- 创建时间段 -->
                        <el-form-item
                            prop="operationTime"
                            :label="$t('ttsConfiguration.createTimePeriod')"
                        >
                            <el-date-picker
                                :default-time="['00:00:00', '23:59:59']"
                                size="small"
                                v-model="params.operationTime"
                                type="datetimerange"
                                transfer
                                :start-placeholder="$t('common.startTime')"
                                :end-placeholder="$t('common.endTime')"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                clearable
                            ></el-date-picker>
                        </el-form-item>
                        <!-- 升级状态 -->
                        <el-form-item
                            :label="$t('deviceUpgrade.upgradeState')"
                            prop="upgradeState"
                        >
                            <el-select
                                v-model="params.upgradeState"
                                :placeholder="$t('common.select')"
                                clearable
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
                    </el-form>
                </div>
                <div>
                    <el-button
                        type="primary"
                        :disabled="searchLoading"
                        :loading="searchLoading"
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
            <div
                v-if="Number($route.query.upgradeState) === 5"
                style="margin-bottom: 1rem"
            >
                <el-button type="default" class="btn" @click="goHistory">
                    <!-- 查看未完成升级 -->
                    {{ $t("deviceUpgrade.viewIncompleteUpgrade") }}
                </el-button>
            </div>
            <el-table
                ref="table"
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :data="tableData"
                :height="tableHeight"
                stripe
            >
                <!-- 创建时间 -->
                <el-table-column
                    fixed
                    prop="createTime"
                    :label="$t('cardSwapRecord.createTime')"
                    min-width="180px"
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
                <!-- 升级前版本号 -->
                <el-table-column
                    prop="originalVersion"
                    :label="$t('deviceUpgrade.beforeUpgradeVersion')"
                    min-width="150px"
                ></el-table-column>
                <!-- 目标版本号 -->
                <el-table-column
                    prop="firmwareVersion"
                    :label="$t('deviceUpgrade.targetVersion')"
                    min-width="150px"
                ></el-table-column>
                <!-- 固件类型-->
                <el-table-column
                    prop="firmwareTypeName"
                    :label="$t('firmware.firmwareType')"
                    min-width="150px"
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
                    :label="$t('firmware.peripheralName')"
                    prop="peripheralType"
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
                <!-- 进度更新时间 -->
                <el-table-column
                    prop="upgradeStateTime"
                    :label="$t('deviceUpgrade.upgradeStateTime')"
                    min-width="160px"
                >
                    <template slot-scope="scope">
                        {{
                            $moment(scope.row.upgradeStateTime).format(
                                "YYYY-MM-DD HH:mm:ss"
                            )
                        }}
                    </template>
                </el-table-column>
                <!-- 操作人员 -->
                <el-table-column
                    prop="createName"
                    :label="$t('operationLog.operator')"
                    min-width="100px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 固件包备注 -->
                <el-table-column
                    prop="firmwareRemark"
                    fixed="right"
                    :label="$t('deviceUpgrade.firmwareNotes')"
                    min-width="160px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 升级状态 -->
                <el-table-column
                    prop="upgradeState"
                    :label="$t('deviceUpgrade.upgradeState')"
                    min-width="130px"
                    fixed="right"
                >
                    <template slot-scope="scope">
                        <upgradeProgress :upgradeData="scope.row">
                            <span>
                                <!-- "自动": "手动" -->
                                {{
                                    scope.row.upgradeMode === 1
                                        ? $t("deviceUpgrade.automatic")
                                        : $t("deviceUpgrade.handMovement")
                                }}
                            </span>
                        </upgradeProgress>
                    </template>
                </el-table-column>
                <!-- 失败原因 -->
                <el-table-column
                    prop="errorReason"
                    fixed="right"
                    :label="$t('deviceLoadReportVerify.activeCodeErrorMessage')"
                    min-width="160px"
                    show-overflow-tooltip
                ></el-table-column>
            </el-table>
        </div>
        <div class="footer-pagination p-x-md">
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
import upgradeProgress from "@/components/upgradeProgress";
export default {
    name: "history",
    components: { upgradeProgress },
    data() {
        return {
            searchLoading: true,
            tableHeight: 500,
            tableData: [],
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "id", //排序列
                orderDir: "desc", //排序方向
                deviceId: this.$route.query.deviceId,
                queryType: 2,
                upgradeState: "",
                operationTime: [],
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
            total: 0,
            deviceTypeList: [],
        };
    },
    methods: {
        goHistory() {
            this.$api
                .getDeviceInfo({
                    id: this.$route.query.deviceId,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.$router.push({
                            path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeNoComplete",
                            query: {
                                selectObj: JSON.stringify(res.data),
                                plateNum: this.$route.query.plateNum,
                                deviceId: this.$route.query.deviceId,
                                organizeId: +this.$route.query.treeLevel,
                            },
                        });
                    }
                });
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getPageDevUpgradeLog();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getPageDevUpgradeLog();
        },
        // 设备升级信息
        getPageDevUpgradeLog() {
            const params = Object.assign({}, this.params, {
                upgradeStates: this.params.upgradeState
                    ? JSON.parse(this.params.upgradeState)
                    : [],
            });
            delete params.upgradeState;
            if (
                this.params.operationTime &&
                this.params.operationTime.length > 0
            ) {
                params.beginTime = this.params.operationTime[0];
                params.endTime = this.params.operationTime[1];
            } else {
                params.beginTime = "";
                params.endTime = "";
            }
            delete params.operationTime;
            this.searchLoading = true;
            this.$api
                .newUpgradeGetUpgradeTaskDevLogVoPage(params)
                .then((res) => {
                    if (res.success == true) {
                        this.tableData = res.data.results;
                        this.total = res.data.totalRecords;
                        this.$refs.table.doLayout();
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.searchLoading = false;
                    this.$api.eventTrackTrigger({
                        menu: "DEVICE_UPGRADE",
                        business: "DEVICE_UPGRADE_HISTORY_INFO",
                        eventResult: res.success,
                    });
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                288 -
                (Number(this.$route.query.upgradeState) === 5 ? 46 : 0);
        },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
            }
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
        this.getDeviceType();
        this.setTableHeight();
        this.getPageDevUpgradeLog();
    },
};
</script>
<style lang="less" scoped>
.search {
    display: flex;
    justify-content: space-between;
}
.timeline-top {
    display: flex;
    margin-bottom: 8px;
    & > span,
    .el-button {
        font-size: 14px;
        flex: 1;
    }
}
.footer-pagination {
    border-top: 1px solid #e4e4e4;
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
</style>
<style lang="less">
.history {
    .el-tag--dark {
        border: none;
        width: 76px;
        text-align: center;
        line-height: 24px !important;
    }
}
.device-upgrade-status {
    .el-tag--dark {
        border: none;
        width: 76px;
        text-align: center;
        line-height: 24px !important;
    }
}
</style>
