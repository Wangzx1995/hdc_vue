<template>
    <div class="wrap">
        <div class="p-x-md">
            <div class="wrap-top p-t">
                <div class="text-md">
                    <span>
                        <!-- 详情 -->
                        {{ $t("common.detail") }}
                    </span>
                </div>
                <div class="text-md title">
                    <div>
                        <span>
                            <!-- 成功 -->
                            {{ $t("common.success") }}:
                            {{ paramLogResultStatistics.successNum || 0 }}</span
                        >
                    </div>
                    <div>
                        <span>
                            <!-- 进行中 -->
                            {{ $t("common.progress") }}:
                            {{ paramLogResultStatistics.ingNum || 0 }}</span
                        >
                    </div>
                    <div>
                        <span>
                            <!-- 失败 -->
                            {{ $t("common.failed") }}:
                            {{ paramLogResultStatistics.failNum || 0 }}</span
                        >
                    </div>
                </div>
            </div>
            <div>
                <div class="detail p-b m-b">
                    <div class="detail-items p-b-sm">
                        <div class="detail-item m-r-md">
                            <span class="item-title">
                                <!-- 标题 -->
                                {{
                                    $t("ttsConfiguration.configurationTitle")
                                }}：</span
                            ><span :title="configDetail.configTitle">{{
                                configDetail.configTitle || "--"
                            }}</span>
                        </div>
                        <div class="detail-item m-r-md">
                            <span class="item-title">
                                <!-- 发布属性 -->
                                {{
                                    $t("ttsConfiguration.publishAttributes")
                                }}：</span
                            ><span class="item-content">{{
                                configDetail.configPropertyString || "--"
                            }}</span>
                        </div>
                        <div class="detail-item m-r-md">
                            <span class="item-title">
                                <!-- 创建时间 -->
                                {{ $t("cardSwapRecord.createTime") }}：</span
                            ><span class="item-content">{{
                                configDetail.createTime || "--"
                            }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="item-title">
                                <!-- 操作人员 -->
                                {{ $t("operationLog.operator") }}：</span
                            ><span class="item-content">{{
                                configDetail.createName || "--"
                            }}</span>
                        </div>
                    </div>
                    <div class="detail-items">
                        <div class="detail-item">
                            <span class="item-title">
                                <!-- 配置内容 -->
                                {{
                                    $t("ttsConfiguration.configurationContent")
                                }}：</span
                            ><span
                                :title="configDetail.params"
                                class="item-content-ellipsis"
                                >{{ configDetail.params || "--" }}</span
                            >
                        </div>
                    </div>
                </div>
                <div ref="searchBox" class="search-module" style="padding: 0">
                    <div class="search-form-content">
                        <el-form inline ref="searchForm" :model="searchForm">
                            <!-- 配置结果说明 -->
                            <el-form-item
                                prop="status"
                                :label="
                                    $t(
                                        'ttsConfiguration.configurationResultExplanation'
                                    )
                                "
                            >
                                <el-select
                                    v-model="searchForm.status"
                                    clearable
                                >
                                    <!-- 全部 -->
                                    <el-option
                                        value=""
                                        key=""
                                        :label="$t('common.all')"
                                    ></el-option>
                                    <!-- 成功 -->
                                    <el-option
                                        :value="1"
                                        :key="1"
                                        :label="$t('common.success')"
                                    ></el-option>
                                    <!-- 失败 -->
                                    <el-option
                                        :value="2"
                                        :key="2"
                                        :label="$t('common.failed')"
                                    ></el-option>
                                    <!-- 其他 -->
                                    <el-option
                                        :value="3"
                                        :key="3"
                                        :label="
                                            $t('deviceHealthCondition.other')
                                        "
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                :label="$t('common.keywords')"
                                prop="deviceCode"
                            >
                                <G-DeviceSearch
                                    :valueKey="'deviceCode'"
                                    :value.sync="searchForm.deviceCode"
                                ></G-DeviceSearch>
                            </el-form-item>
                            <!-- 所属组织 -->
                            <el-form-item
                                prop="organizeId"
                                :label="$t('common.orgPath')"
                            >
                                <el-select
                                    v-model="searchForm.id"
                                    clearable
                                    @change="changeOrganizeId"
                                    :placeholder="$t('common.select')"
                                >
                                    <el-option
                                        v-for="(item, index) in organizeList"
                                        :key="index"
                                        :value="item.id"
                                        :label="item.name"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div>
                        <el-button
                            type="primary"
                            @click="
                                params.currentPage = 1;
                                search();
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
                <div class="m-b">
                    <el-button
                        type="primary"
                        @click="startAllConfig"
                        v-btn="'ttsConfigurationFailedDeviceReconfiguration'"
                    >
                        <!-- 失败设备重新配置 -->
                        {{ $t("ttsConfiguration.failedDeviceReconfiguration") }}
                    </el-button>
                    <el-button
                        type="primary"
                        @click="batchTerminationConfiguration"
                        v-btn="'ttsConfigurationTerminateConfiguration'"
                    >
                        <!-- 批量终止配置 -->
                        {{
                            $t("ttsConfiguration.batchTerminationConfiguration")
                        }}
                    </el-button>
                </div>
                <el-table
                    ref="table"
                    id="detailTable"
                    :data="tableData"
                    class="m-b"
                    :height="tableHeight"
                    row-key="id"
                    border
                    @sort-change="handleSortChange"
                    @selection-change="onSelectionChange"
                >
                    <el-table-column
                        type="selection"
                        :reserve-selection="true"
                        :selectable="selectable"
                    ></el-table-column>
                    <!-- 车牌号 -->
                    <el-table-column
                        prop="plateNum"
                        :label="$t('common.plateNum')"
                        min-width="100px"
                    ></el-table-column>
                    <!-- 所属组织 -->
                    <el-table-column
                        prop="organizeName"
                        :label="$t('common.orgPath')"
                        min-width="100px"
                        show-overflow-tooltip
                    ></el-table-column>
                    <!-- 终端手机号 -->
                    <el-table-column
                        prop="deviceCode"
                        :label="$t('common.deviceCode')"
                        min-width="120px"
                    ></el-table-column>
                    <!-- 设备序列号 -->
                    <el-table-column
                        prop="deviceSerialNum"
                        :label="$t('common.deviceSerialNum')"
                        min-width="120px"
                    ></el-table-column>
                    <!-- VIN码 -->
                    <el-table-column
                        prop="vin"
                        :label="$t('common.vin')"
                        min-width="120px"
                    ></el-table-column>
                    <!-- 设备型号 -->
                    <el-table-column
                        prop="deviceModelCode"
                        :label="$t('common.deviceModelCode')"
                        min-width="160px"
                        :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <!-- 接入协议 -->
                    <el-table-column
                        prop="protocolName"
                        :label="$t('common.protocolName')"
                        min-width="100px"
                        :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <!-- 设备版本号 -->
                    <el-table-column
                        prop="version"
                        :label="$t('common.softwareVersion')"
                        min-width="120px"
                    ></el-table-column>
                    <!-- 进度更新时间 -->
                    <el-table-column
                        prop="updateTime"
                        :label="$t('ttsConfiguration.progressUpdateTime')"
                        min-width="160px"
                        sortable="custom"
                    ></el-table-column>
                    <!-- 配置结果 -->
                    <el-table-column
                        prop="result"
                        :label="$t('ttsConfiguration.configurationResult')"
                        min-width="160px"
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
                        :label="$t('plateNumAndDeviceCode.failureReason')"
                        min-width="200px"
                    ></el-table-column>
                    <!-- 设备状态 -->
                    <el-table-column
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
                            <span v-else> -- </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('common.operate')"
                        width="100px"
                    >
                        <template slot-scope="scope">
                            <a
                                @click="
                                    startConfig(
                                        scope.row.batchCode,
                                        scope.row.id,
                                        scope.row.plateNum,
                                        scope.row.deviceCode,
                                        scope.row.cmd
                                    )
                                "
                                v-if="
                                    scope.row.result == '2' ||
                                    scope.row.result == '8'
                                "
                                v-btn="
                                    'ttsConfigurationFailedDeviceReconfiguration'
                                "
                            >
                                <!-- 重新配置 -->
                                {{ $t("ttsConfiguration.reconfigure") }}
                            </a>
                            <a
                                @click="
                                    stopConfig(
                                        scope.row.batchCode,
                                        scope.row.id,
                                        scope.row.plateNum,
                                        scope.row.deviceCode
                                    )
                                "
                                v-if="
                                    scope.row.result == '3' ||
                                    scope.row.result == '4' ||
                                    scope.row.result == '6' ||
                                    scope.row.result == '7'
                                "
                                v-btn="'ttsConfigurationTerminateConfiguration'"
                            >
                                <!-- 终止配置 -->
                                {{
                                    $t(
                                        "ttsConfiguration.terminateConfiguration"
                                    )
                                }}
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
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
    </div>
</template>

<script>
export default {
    name: "configurationDetails",
    components: {},
    data() {
        return {
            orderBy: "", //排序
            configDetail: {
                configTitle: "",
                params: "",
                configProperty: "",
                createTime: "",
                createName: "",
            },
            searchForm: {
                status: "",
                plateNum: "",
                batchCode: this.$route.query.batchCode,
                deviceSerialNum: "",
                type: 2,
                organizeId: "",
                id: "",
                organizeName: "",
            },
            params: {
                currentPage: 1, // 页码，从1开始
                pageSize: 20, // 分页大小
                orderColumn: "updateTime", //排序列
                orderDir: "desc",
            },
            tableData: [],
            organizeList: [],
            ttsContent: {
                URGENCY: this.$t("ttsConfiguration.ttsContentText1"), //"紧急",
                DISPLAY: this.$t("ttsConfiguration.ttsContentText2"), //"终端显示屏显示",
                READ: this.$t("ttsConfiguration.ttsContentText3"), //"终端TTS播读",
                ADVERT: this.$t("ttsConfiguration.ttsContentText4"), //"广告屏显示",
                CAN: this.$t("ttsConfiguration.ttsContentText5"), //"CAN故障码信息",
            },
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
            tableHeight: 500,
            paramLogResultStatistics: {
                totalNum: "", // 总数
                successNum: "", // 成功数
                failNum: "", // 失败数
                stopNum: "", // 终止数
                ingNum: "", // 进行中数
            },
            total: 0,
            isGo: false,
            selectionIds: [],
        };
    },
    methods: {
        batchTerminationConfiguration() {
            if (this.selectionIds && this.selectionIds.length <= 0) {
                // this.$message.warning("请选择批量终止配置的设备");
                this.$message.warning(
                    this.$t(
                        "ttsConfiguration.batchTerminationConfigurationText1"
                    )
                );
                return;
            }
            this.$confirm(
                // "此操作将会对选中的设备进行批量终止配置操作，是否确认？",
                this.$t("ttsConfiguration.batchTerminationConfigurationText2"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.$api
                        .batchSaveTTSConfig(this.selectionIds)
                        .then((res) => {
                            if (res.success == true) {
                                this.$refs.table.clearSelection();
                                setTimeout(() => {
                                    this.search();
                                }, 500);
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                })
                .catch(() => {});
        },
        // 多选事件
        onSelectionChange(selection) {
            let list = [];
            selection.forEach((i) => {
                list.push({
                    batchCode: i.batchCode,
                    logId: i.id,
                    type: 0,
                });
            });
            this.selectionIds = list;
        },
        selectable(row, index) {
            if (
                row.result == "3" ||
                row.result == "4" ||
                row.result == "6" ||
                row.result == "7"
            ) {
                return true;
            } else {
                return false;
            }
        },
        //排序
        handleSortChange(val) {
            if (val.order) {
                if (val.order === "descending") {
                    this.orderBy = "desc";
                    this.search();
                } else {
                    this.orderBy = "asc";
                    this.search();
                }
            } else {
                this.orderBy = "";
            }
        },
        //获取所属组织列表
        getOrganizeList() {
            this.$api
                .getTTSBatchOrganizeInfo({
                    batchCode: this.$route.query.batchCode,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.organizeList = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        // 获得选中的批次信息
        getConfigDetail() {
            this.$api
                .getTTSBatchInfo({
                    batchCode: this.$route.query.batchCode,
                })
                .then((res) => {
                    if (res.success == true) {
                        let ttsArr = [];
                        if (res.data.configProperty) {
                            res.data.configProperty
                                .split(",")
                                .forEach((item_) => {
                                    ttsArr.push(this.ttsContent[item_]);
                                });
                        }

                        if (res.data["configProperty"]) {
                            res.data["configPropertyString"] = ttsArr.join(",");
                        }
                        this.configDetail = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
            }
            this.searchForm.id = "";
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.search();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.search();
        },
        // 终止配置
        stopConfig(batchCode, logId, plateNum, deviceCode) {
            let confirmText = "";
            if (plateNum) {
                // confirmText = `此操作将会终止配置终端手机号为“${deviceCode}”的“${plateNum}”的配置，是否终止重新配置?`;
                confirmText = this.$t("ttsConfiguration.stopConfigText1", {
                    deviceCode: deviceCode,
                    plateNum: plateNum,
                });
            } else {
                // confirmText = `此操作将会终止配置终端手机号为“${deviceCode}”的配置，是否终止重新配置?`;
                confirmText = this.$t("ttsConfiguration.stopConfigText2", {
                    deviceCode: deviceCode,
                });
            }
            this.$confirm(confirmText, {
                confirmButtonText: this.$t("common.ok"),
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
            })
                .then(() => {
                    const params = {
                        batchCode,
                        logId,
                        type: 0,
                    };
                    this.$api.saveTTSConfigAgain(params).then((res) => {
                        if (res.success == true) {
                            this.search();
                        } else {
                            // this.$message.error("设备终止配置失败:" + res.msg);
                            this.$message.error(
                                this.$t("ttsConfiguration.stopConfigText6") +
                                    ":" +
                                    res.msg
                            );
                        }
                    });
                })
                .catch(() => {});
        },
        // 重新配置
        startConfig(batchCode, logId, plateNum, deviceCode, cmd) {
            let confirmText = "";
            if (plateNum) {
                // confirmText = ``;
                confirmText = this.$t("ttsConfiguration.stopConfigText3", {
                    deviceCode: deviceCode,
                    plateNum: plateNum,
                });
            } else {
                // confirmText = `此操作将会重新配置终端手机号为“${deviceCode}”的配置，是否确认重新配置?`;
                confirmText = this.$t("ttsConfiguration.stopConfigText4", {
                    deviceCode: deviceCode,
                });
            }
            this.$confirm(confirmText, {
                confirmButtonText: this.$t("common.ok"),
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
            })
                .then(() => {
                    const params = {
                        batchCode,
                        logId,
                        type: 1,
                    };
                    this.$api.saveTTSConfigAgain(params).then((res) => {
                        if (res.success == true) {
                            this.search();
                            //this.getConfigDetail()
                        } else {
                            // 设备重新配置失败
                            this.$message.error(
                                this.$t("ttsConfiguration.stopConfigText7") +
                                    ":" +
                                    res.msg
                            );
                        }
                    });
                })
                .catch(() => {});
        },
        startAllConfig() {
            let _cmd = "";
            if (this.tableData.length <= 0) {
                // this.$message.warning("该批次号下无设备！");
                this.$message.warning(
                    this.$t("ttsConfiguration.startAllConfigText1")
                );
                return;
            } else {
                _cmd = this.tableData[0].cmd;
            }
            this.$confirm(
                // "此操作将会重新配置当前任务下的所有失败设备，是否确认重新配置？",
                this.$t("ttsConfiguration.startAllConfigText2"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    const params = {
                        batchCode: this.$route.query.batchCode,
                        type: 1,
                    };
                    this.$api.saveTTSConfigAgain(params).then((res) => {
                        if (res.success == true) {
                            this.search();
                        } else {
                            // 设备重新配置失败
                            this.$message.error(
                                this.$t("ttsConfiguration.stopConfigText7") +
                                    ":" +
                                    res.msg
                            );
                        }
                    });
                })
                .catch(() => {});
        },
        search() {
            this.params.orderDir = this.orderBy;
            const params = Object.assign({}, this.params, this.searchForm);
            delete params.id;
            this.$api.getDeviceTTSParamLogPage(params).then((res) => {
                if (res.success == true) {
                    this.tableData =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : this.tableData;
                    this.total = res.data.totalRecords;
                    // this.getTTSCountInfo();
                    if (this.isGo && res.data.totalRecords === 0) {
                        // 批次信息正在下发中，请稍后查看。
                        this.$msgbox({
                            title: this.$t("common.prompt"),
                            type: "info",
                            message: this.$t(
                                "ttsConfiguration.startAllConfigText3"
                            ),
                        });
                    }
                    this.isGo = false;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 获取统计数据
        getTTSCountInfo() {
            const params = {
                batchCode: this.$route.query.batchCode,
            };
            this.$api.getTTSCountInfo(params).then((res) => {
                if (res.success == true) {
                    this.paramLogResultStatistics = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 425;
        },
        changeOrganizeId(val) {
            if (val) {
                this.searchForm.organizeId = val;
                this.organizeList.map((i) => {
                    if (i.id == val) {
                        this.searchForm.organizeName = i.name;
                    }
                });
            } else {
                this.searchForm.organizeName = "";
                this.searchForm.organizeId = "";
                // this.searchForm.organizeId = this.$route.query.organizeId;
            }
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
        if (this.$route.query.isGo) {
            let isGoo = this.$route.query.isGo;
            this.isGo = isGoo;
            this.search();
        } else {
            this.search();
        }
        this.getOrganizeList(); //获取所属组织列表
        this.getConfigDetail();
        this.getTTSCountInfo();
    },
};
</script>

<style scoped lang="less" scoped>
.wrap {
    height: calc(~"100% - 35px");
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    .wrap-top {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .title {
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
    .wrap-bottom {
        height: 4rem;
        border-top: 1px solid #e4e4e4;
    }
    .detail {
        border-bottom: 1px solid #ccc;
        .detail-items {
            display: flex;
            flex-direction: row;
            align-items: center;
            .detail-item {
                overflow: hidden;
                display: flex;
                // text-overflow: ellipsis;
                flex-direction: row;
                align-items: center;
                font-size: 12px;
                .item-title {
                    color: #999;
                }
                .item-content-ellipsis {
                    width: 600px;
                    display: inline-block;
                    overflow: hidden;
                    white-space: nowrap;
                    /*当文本溢出包含元素时，以省略号表示超出的文本*/
                    text-overflow: ellipsis;
                }
            }
        }
    }
}
.search {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
</style>
