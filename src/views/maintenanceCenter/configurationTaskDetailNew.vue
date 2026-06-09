<template>
    <div>
        <div>
            <div class="task-detail-top">
                <div class="detail-data">
                    <h2>
                        <!-- 详情 -->
                        {{ $t("common.detail") }}
                    </h2>
                    <div>
                        <span>
                            <!-- 配置模板 -->
                            {{
                                $t("deviceConfiguration.configurationTemplate")
                            }}：{{
                                configurationData.templateName
                                    ? configurationData.templateName
                                    : "--"
                            }}</span
                        >
                        <span>
                            <!-- 配置类型 -->
                            {{
                                $t("deviceConfiguration.configurationType")
                            }}：{{
                                configurationData.cmd
                                    ? cmdList[configurationData.cmd]
                                    : "--"
                            }}</span
                        >
                        <span>
                            <!-- 配置时间 -->
                            {{
                                $t("deviceConfiguration.configurationTime")
                            }}：{{ configurationData.createTime }}</span
                        >
                        <span class="version">
                            <!-- 配置详情 -->
                            {{
                                $t("deviceConfiguration.configurationDetails")
                            }}：
                            <a
                                v-if="this.$route.query.paramsBefore"
                                @click="taskDetail(configurationData)"
                            >
                                <!-- 查看 -->
                                {{ $t("deviceConfiguration.view") }}
                            </a>
                            <a
                                v-else-if="
                                    this.$route.query.id &&
                                    this.$route.query.type !== '2' &&
                                    configurationData.cmd !== 9
                                "
                                @click="
                                    taskTemplateDetail(configurationData.cmd)
                                "
                            >
                                <!-- 查看 -->
                                {{ $t("deviceConfiguration.view") }}
                            </a>
                            <!-- 当前批次无配置详情 -->
                            <el-tooltip
                                v-else
                                :content="
                                    $t(
                                        'deviceConfiguration.noConfigurationDetails'
                                    )
                                "
                                placement="top"
                            >
                                <span>
                                    <a disabled>
                                        <!-- 查看 -->
                                        {{ $t("deviceConfiguration.view") }}
                                    </a>
                                </span>
                            </el-tooltip>
                        </span>
                    </div>
                </div>
                <div class="detail-num">
                    <div>
                        <span>配置统计：</span>
                        <!-- 成功 -->
                        {{ $t("common.success") }}：{{
                            paramLogResultStatistics.successNum || 0
                        }}
                        |
                        <!-- 进行中 -->
                        {{ $t("common.progress") }}：{{
                            paramLogResultStatistics.ingNum || 0
                        }}
                        |
                        <!-- 失败 -->
                        {{ $t("common.failed") }}：{{
                            paramLogResultStatistics.failNum || 0
                        }}
                    </div>
                    <!-- <el-popover
                        placement="left"
                        width="500"
                        trigger="click"
                        @show="initEcharts"
                    >
                        <div>失败原因分析</div>
                        <div id="echarts-box" v-show="isShowEcharts"></div>
                        <div class="no-data" v-show="!isShowEcharts">
                            暂无数据
                        </div>
                        <el-button
                            type="text"
                            slot="reference"
                            icon="el-icon-pie-chart"
                            >失败原因分析</el-button
                        >
                    </el-popover> -->
                </div>
            </div>
            <div class="wrap">
                <div ref="searchBox" class="search-module">
                    <div class="search-form-content">
                        <el-form inline ref="searchForm" :model="searchForm">
                            <el-form-item
                                :label="$t('common.keywords')"
                                prop="deviceCode"
                            >
                                <G-DeviceSearch
                                    :valueKey="'deviceCode'"
                                    :value.sync="searchForm.deviceCode"
                                ></G-DeviceSearch>
                            </el-form-item>
                            <!-- 配置结果 -->
                            <el-form-item
                                prop="status"
                                :label="
                                    $t('ttsConfiguration.configurationResult')
                                "
                            >
                                <el-select
                                    v-model="searchForm.status"
                                    clearable
                                >
                                    <el-option
                                        v-for="(
                                            item, index
                                        ) in configurationResultlList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="index"
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
                <div class="p-x">
                    <el-button
                        type="primary"
                        @click="startAllConfig"
                        v-btn="'deviceConfigurationFailedDeviceReconfiguration'"
                    >
                        <!-- 失败设备重新配置 -->
                        {{ $t("ttsConfiguration.failedDeviceReconfiguration") }}
                    </el-button>
                    <el-button
                        type="default"
                        @click="stopAllConfig"
                        v-btn="'deviceConfigurationTerminateConfiguration'"
                    >
                        <!-- 终止配置 -->
                        {{ $t("ttsConfiguration.terminateConfiguration") }}
                    </el-button>
                </div>
            </div>
            <div class="m-y p-x">
                <el-table
                    border
                    :data="tableData"
                    :height="tableHeight"
                    @sort-change="handleSortChange"
                >
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
                        min-width="120px"
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
                        min-width="160px"
                        show-overflow-tooltip
                    ></el-table-column>
                    <!-- 进度更新时间 -->
                    <el-table-column
                        prop="updateTime"
                        :label="$t('ttsConfiguration.progressUpdateTime')"
                        min-width="140px"
                        sortable
                    ></el-table-column>
                    <!-- 配置结果 -->
                    <el-table-column
                        prop="result"
                        :label="$t('ttsConfiguration.configurationResult')"
                        min-width="140px"
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
                    >
                        <template slot-scope="scope">
                            <el-tooltip
                                v-if="scope.row.failReason"
                                popper-class="workorder-reason-popper"
                                effect="light"
                                :content="scope.row.failReason"
                                placement="top"
                                :disabled="isShowTooltip"
                            >
                                <div
                                    @mouseover="onMouseOver(scope.row.id)"
                                    style="
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                    "
                                >
                                    <span :ref="scope.row.id">{{
                                        scope.row.failReason
                                    }}</span>
                                </div>
                            </el-tooltip>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('common.operate')"
                        width="100px"
                        fixed="right"
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
                                    'deviceConfigurationFailedDeviceReconfiguration'
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
                                v-btn="
                                    'deviceConfigurationTerminateConfiguration'
                                "
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
        </div>
        <!-- 配置详情 -->
        <el-dialog
            :title="$t('deviceConfiguration.configurationDetails')"
            top="2%"
            :visible.sync="dialogTableVisible"
            :width="'1300px'"
        >
            <div v-if="dialogTableVisible">
                <div v-if="!isIsApi" style="height: 500px; overflow-y: auto">
                    <protocolTemplate
                        :id="$route.query.id"
                        :isTemplate="true"
                    ></protocolTemplate>
                </div>
                <EditTemplate
                    v-else
                    :dialogTableVisible="dialogTableVisible"
                ></EditTemplate>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="noVisible">
                    <!-- 关 闭 -->
                    {{ $t("common.close") }}
                </el-button>
            </span>
        </el-dialog>
        <!-- 配置详情 -->
        <el-dialog
            :title="$t('deviceConfiguration.configurationDetails')"
            :visible.sync="dialogTableVisible1"
            :width="'800px'"
            @close="noVisibleTable"
        >
            <div>
                <el-table
                    border
                    :data="gridData"
                    :is-show-page="false"
                    height="400"
                    style="width: 100%"
                >
                    <!-- 序号 -->
                    <el-table-column
                        type="index"
                        width="50"
                        :label="$t('equipmentInspection.serialNumber')"
                    ></el-table-column>
                    <!-- 修改项 -->
                    <el-table-column
                        prop="name"
                        :label="$t('plateNumAndDeviceCode.modified')"
                    ></el-table-column>
                    <!-- 修改后参数 -->
                    <el-table-column
                        prop="content"
                        :label="$t('deviceConfiguration.modifiedParameters')"
                    ></el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="noVisibleTable">
                    <!-- 关 闭 -->
                    {{ $t("common.close") }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import protocolTemplate from "@/views/protocolConfiguration/components/protocolTemplate.vue";
import EditTemplate from "./editTemplate.vue";
import enumerationJSON from "@/views/protocolConfiguration/components/configuration/enumerationJSON/enumeration.json";
export default {
    name: "configurationDetails",
    components: { EditTemplate, protocolTemplate },
    data() {
        return {
            eventDisplayList:
                enumerationJSON["intelliDrive_sensor_eventDisplay"],
            historyCmd: "",
            dialogTableVisible: false,
            dialogTableVisible1: false,
            gridData: [],
            paramsBefore: [],
            orderBy: "", //排序
            type: this.$route.query.type,
            id: this.$route.query.id,
            configurationData: {
                organizeId: this.$route.query.organizeId,
                batchCode: this.$route.query.batchCode,
                cmd: this.$route.query.cmd,
                templateName: this.$route.query.templateName,
                createTime: this.$route.query.createTime,
            },
            cmdList: {
                1: this.$t("deviceConfiguration.cmdListText1"), //"文件配置获取",
                2: this.$t("deviceConfiguration.cmdListText2"), //"文件配置下发",
                3: this.$t("deviceConfiguration.cmdListText3"), //"HTTP终端配置参数查询",
                4: this.$t("deviceConfiguration.cmdListText4"), //"TTS文本下发",
                5: this.$t("deviceConfiguration.cmdListText5"), //"文件配置下发",
                6: this.$t("deviceConfiguration.cmdListText6"), //"协议配置下发",
                7: this.$t("deviceConfiguration.cmdListText7"), //"协议配置下发",
                8: this.$t("deviceConfiguration.cmdListText8"), //"协议配置下发",
                9: this.$t("deviceConfiguration.cmdListText9"), //"文件模板配置下发",
                10: this.$t("deviceConfiguration.cmdListText10"), //"协议模板配置下发",
            },
            configurationResultlList: [
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
            searchForm: {
                status: "",
                deviceCode: "",
                organizeId: this.$route.query.organizeId,
                batchCode: this.$route.query.batchCode,
                type: 2,
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "updateTime", //排序列
                orderDir: "desc",
            },
            tableData: [],
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
            paramLogResultStatistics: {
                totalNum: "", // 总数
                successNum: "", // 成功数
                failNum: "", // 失败数
                stopNum: "", // 终止数
                ingNum: "", // 进行中数
            },
            total: 0,
            tableHeight: 500,
            isIsApi: false,
            isShowTooltip: false,
        };
    },
    watch: {
        dialogTableVisible: {
            handler(val) {
                if (!this.dialogTableVisible) {
                    // this.$router.go(0)
                }
            },
            deep: true,
        },
    },
    methods: {
        //排序
        handleSortChange(val) {
            if (val.order) {
                if (val.order === "descending") {
                    this.orderBy = "desc";
                } else {
                    this.orderBy = "asc";
                }
            } else {
                this.orderBy = "";
            }
            this.search();
        },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
            }
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
        stopConfig(batchNo, logId, plateNum, deviceCode) {
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
                    let params = {
                        batchNo,
                        logId,
                    };
                    this.$api.stopDeviceConfigTask(params).then((res) => {
                        if (res.success == true) {
                            this.search();
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        // 重新配置
        startConfig(batchNo, logId, plateNum, deviceCode, cmd) {
            let confirmText = "";
            if (plateNum) {
                // confirmText = `此操作将会重新配置终端手机号为“${deviceCode}”的“${plateNum}”的配置，是否确认重新配置?`;
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
                    let params = {
                        batchNo,
                        logId,
                        cmd,
                    };
                    this.$api
                        .saveDeviceConfigParamsToDeviceAgain(params)
                        .then((res) => {
                            if (res.success == true) {
                                this.search();
                                // this.getParamLogResultStatistics();
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                })
                .catch(() => {});
        },
        stopAllConfig() {
            if (this.tableData.length <= 0) {
                // this.$message.warning("该批次号下无设备！");
                this.$message.warning(
                    this.$t("ttsConfiguration.startAllConfigText1")
                );
                return;
            }
            this.$confirm(
                // `此操作将会终止配置当前任务下的所有未开始配置设备，是否确认终止配置?`,
                this.$t("deviceConfiguration.stopAllConfigText1"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    let params = {
                        batchNo: this.$route.query.batchCode,
                    };
                    this.$api.stopDeviceConfigTask(params).then((res) => {
                        if (res.success == true) {
                            this.search();
                        } else {
                            this.$message.error(res.msg);
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
                // `此操作将会重新配置当前任务下的所有失败配置设备，是否确认重新配置？`,
                this.$t("deviceConfiguration.startAllConfigText1"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    let params = {
                        batchNo: this.$route.query.batchCode,
                        cmd: _cmd,
                    };
                    this.$api
                        .saveDeviceConfigParamsToDeviceAgain(params)
                        .then((res) => {
                            if (res.success == true) {
                                this.search();
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                })
                .catch(() => {});
        },
        //配置详情-详情
        taskDetail(data) {
            this.paramsBefore = JSON.parse(this.$route.query.paramsBefore);
            if (data.cmd === 8) {
                this.paramsBefore.forEach((firstTitle) => {
                    firstTitle.children.forEach((secondTitle) => {
                        if (secondTitle.title === "显示输出") {
                            for (let key of Object.keys(secondTitle.children)) {
                                let objData = JSON.parse(
                                    secondTitle.children[key].split("&")[2]
                                );
                                let valArr = objData.splitChanBinds.reduce(
                                    (prev, cur) => {
                                        if (cur.chanNo) {
                                            return prev.concat(
                                                `通道${cur.chanNo}`
                                            );
                                        } else {
                                            return prev;
                                        }
                                    },
                                    []
                                );
                                let val = {
                                    name: `${firstTitle.title}>${
                                        secondTitle.title
                                    }>${
                                        this.eventDisplayList.find(
                                            (e) => e.value === Number(key)
                                        ).label
                                    }`,
                                    content: `使能:${
                                        objData.enable ? "开启" : "关闭"
                                    }> 分屏:${
                                        objData.splitType
                                    }分屏> 输出分类:${valArr.join()}`,
                                };
                                this.gridData.push(val);
                            }
                        } else {
                            secondTitle.children.forEach((item) => {
                                let val = {
                                    name: `${firstTitle.title}>${secondTitle.title}>${item.label}`,
                                    content: item.showValue,
                                };
                                if (item.type === "switch") {
                                    val.content =
                                        item.showValue == 0 ? "关闭" : "开启";
                                }
                                this.gridData.push(val);
                            });
                        }
                    });
                });
            } else {
                for (let i in this.paramsBefore) {
                    if (this.paramsBefore[i]) {
                        if (this.paramsBefore[i]) {
                            //this.gridData.push(this.paramsBefore[i].split('&').slice(1));
                            let obj = {
                                name: this.paramsBefore[i]
                                    .split("&")[1]
                                    .replace("amp;", ""),
                                content: this.paramsBefore[i]
                                    .split("&")[2]
                                    .replace("amp;", ""),
                            };
                            if (
                                obj.name.indexOf(
                                    "中心/定位上传设置/拐点补传角度"
                                ) > -1
                            ) {
                                obj.name += "<=180度）";
                                obj.content = this.paramsBefore[i]
                                    .split("&")[3]
                                    .replace("amp;", "");
                            }
                            this.gridData.push(obj);
                        }
                    }
                }
            }
            this.dialogTableVisible1 = true;
        },
        //关闭弹窗
        noVisible() {
            this.dialogTableVisible = false;
        },
        noVisibleTable() {
            this.gridData = [];
            this.dialogTableVisible1 = false;
        },

        taskTemplateDetail(cmd) {
            this.historyCmd = cmd;
            this.dialogTableVisible = true;
            // this.$router.push({
            //   path: '/equipmentOperation/deviceConfiguration/configurationTask/configurationTaskDetailNew/editTemplate',
            //   query: {
            //     dialogTableVisible: this.dialogTableVisible,
            //     historyId: this.id,
            //     historyType :this.type}
            // })
        },
        getToptext() {
            //根据批次号查询信息（顶部）
            const param = {
                organizeId: this.$route.query.organizeId,
                batchNo: this.$route.query.batchCode,
            };
            this.$api.getParamBatchPage(param).then((res) => {
                if (res.success == true) {
                    this.configurationData.batchCode =
                        res.data.results[0].batchCode;
                    this.configurationData.cmd = res.data.results[0].cmd;
                    this.configurationData.templateName =
                        res.data.results[0].templateName;
                    this.configurationData.createTime =
                        res.data.results[0].createTime;
                    this.configurationData.configTitle =
                        res.data.results[0].configTitle;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        search() {
            this.params.orderDir = this.orderBy;
            let params = Object.assign({}, this.params, this.searchForm);
            this.$api.getDeviceParamLogResultVoPage(params).then((res) => {
                if (res.success == true) {
                    this.tableData =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : this.tableData;
                    this.total = res.data.totalRecords;
                    // this.tableData.forEach((item) => {
                    //     item.failReason =
                    //         "msgId：931 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':4519,'messageType':-1904,'result':3};msgId：2223 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':26162,'messageType':-1904,'result':3};msgId：307 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':31478,'messageType':-1904,'result':3};msgId：193 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':29336,'messageType':-1904,'result':3};msgId：951 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':10800,'messageType':-1904,'result':3};msgId：951 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':31958,'messageType':-1904,'result':3};msgId：951 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':19130,'messageType':-1904,'result':3};msgId：951 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':21810,'messageType':-1904,'result':3};msgId：951 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':29541,'messageType':-1904,'result':3};msgId：951 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':31110,'messageType':-1904,'result':3};msgId：951 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':11374,'messageType':-1904,'result':3};msgId：37 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':32420,'messageType':-1904,'result':3};msgId：706 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':1783,'messageType':-1904,'result':3};msgId：706 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':10479,'messageType':-1904,'result':3};msgId：706 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':4602,'messageType':-1904,'result':3};msgId：706 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':22278,'messageType':-1904,'result':3};msgId：706 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':21570,'messageType':-1904,'result':3};msgId：706 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':7198,'messageType':-1904,'result':3};msgId：706 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':9202,'messageType':-1904,'result':3};msgId：902 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':27124,'messageType':-1904,'result':3};msgId：902 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':6294,'messageType':-1904,'result':3};msgId：902 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':4774,'messageType':-1904,'result':3};msgId：902 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':11229,'messageType':-1904,'result':3};msgId：902 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':1412,'messageType':-1904,'result':3};msgId：902 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':22917,'messageType':-1904,'result':3};msgId：902 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':10595,'messageType':-1904,'result':3};msgId：902 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':27101,'messageType':-1904,'result':3};msgId：902 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':27012,'messageType':-1904,'result':3};msgId：2206 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':27795,'messageType':-1904,'result':3};msgId：2206 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':2863,'messageType':-1904,'result':3};msgId：904 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':18015,'messageType':-1904,'result':3};msgId：902 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':18442,'messageType':-1904,'result':3};msgId：902 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':932,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':15103,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':26358,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':10295,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':17124,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':22813,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':28569,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':26421,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':1151,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':2014,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':13883,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':28637,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':31722,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':21014,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':6229,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':17833,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':16855,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':30228,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':31995,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':978,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':4207,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':4430,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':3946,'messageType':-1904,'result':3};msgId：906 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':32751,'messageType':-1904,'result':3};msgId：921 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':18638,'messageType':-1904,'result':3};msgId：939 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':5865,'messageType':-1904,'result':3};msgId：939 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':14148,'messageType':-1904,'result':3};msgId：939 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':6164,'messageType':-1904,'result':3};msgId：939 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':18959,'messageType':-1904,'result':3};msgId：939 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':10909,'messageType':-1904,'result':3};msgId：939 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':28476,'messageType':-1904,'result':3};msgId：958 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':8217,'messageType':-1904,'result':3};msgId：925 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':30834,'messageType':-1904,'result':3};msgId：949 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':20078,'messageType':-1904,'result':3};msgId：189 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':23805,'messageType':-1904,'result':3};msgId：189 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':7900,'messageType':-1904,'result':3};msgId：189 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':1938,'messageType':-1904,'result':3};msgId：189 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':9837,'messageType':-1904,'result':3};msgId：189 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':13265,'messageType':-1904,'result':3};msgId：189 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':29005,'messageType':-1904,'result':3};msgId：189 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':5450,'messageType':-1904,'result':3};msgId：189 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':24594,'messageType':-1904,'result':3};msgId：189 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':7184,'messageType':-1904,'result':3};msgId：189 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':1549,'messageType':-1904,'result':3};msgId：189 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':19150,'messageType':-1904,'result':3};msgId：189 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':27454,'messageType':-1904,'result':3};msgId：189 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':10248,'messageType':-1904,'result':3};msgId：189 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':20541,'messageType':-1904,'result':3};msgId：189 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':32031,'messageType':-1904,'result':3};msgId：189 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':22060,'messageType':-1904,'result':3};msgId：2206 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':32433,'messageType':-1904,'result':3};msgId：2206 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':27871,'messageType':-1904,'result':3};msgId：2206 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':28239,'messageType':-1904,'result':3};msgId：2206 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':25812,'messageType':-1904,'result':3};msgId：2206 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':17122,'messageType':-1904,'result':3};msgId：2206 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':379,'messageType':-1904,'result':3};msgId：2206 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':630,'messageType':-1904,'result':3};msgId：2206 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':16153,'messageType':-1904,'result':3};msgId：2511 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':26714,'messageType':-1904,'result':3};msgId：2511 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':13443,'messageType':-1904,'result':3};msgId：2206 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':21583,'messageType':-1904,'result':3};msgId：2206 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':6314,'messageType':-1904,'result':3};msgId：2206 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':25923,'messageType':-1904,'result':3};msgId：2210 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':3832,'messageType':-1904,'result':3};msgId：2210 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':21271,'messageType':-1904,'result':3};msgId：2210 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':13248,'messageType':-1904,'result':3};msgId：2210 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':6349,'messageType':-1904,'result':3};msgId：2210 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':3844,'messageType':-1904,'result':3};msgId：2210 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':29733,'messageType':-1904,'result':3};msgId：2210 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':2722,'messageType':-1904,'result':3};msgId：2210 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':27084,'messageType':-1904,'result':3};msgId：2210 下发失败，响应内容：{'msgId':0,'rval':-1,'msgSequence':3135,'messageType':-1904,'result':3};";
                    // });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //
        // 获取统计数据
        getParamLogResultStatistics() {
            const params = {
                organizeId: this.$route.query.organizeId,
                type: 2,
                batchCode: this.$route.query.batchCode,
            };
            this.$api.getParamLogResultStatistics(params).then((res) => {
                if (res.success == true) {
                    this.paramLogResultStatistics = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 346;
        },
        onMouseOver(str) {
            // 内容超出，显示文字提示内容
            let tag = this.$refs[str];
            let parentWidth = tag.parentNode.offsetWidth; // 获取元素父级可视宽度
            let contentWidth = tag.offsetWidth; // 获取元素可视宽度
            this.isShowTooltip = contentWidth <= parentWidth;
        },
    },
    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };
        if (this.$route.query.param) {
            let param = JSON.parse(this.$route.query.param);
            this.isIsApi = !!param.configParams;
        }
    },
    created() {
        this.setTableHeight();
        this.getToptext();
        this.search();
        this.getParamLogResultStatistics();
    },
};
</script>

<style scoped lang="less">
.wrap {
    // height: 100%;
    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;
    .wrap-top {
        display: flex;
        flex-direction: row;
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
}
.wrap-bottom {
    border-top: 1px solid #e4e4e4;
}
.search {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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
                margin-right: 24px;
                display: inline-block;
                height: 22px;
                line-height: 22px;
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
</style>
<style>
.workorder-reason-popper {
    max-height: 300px;
    overflow: auto;
}
.workorder-reason-popper .popper__arrow {
    display: none;
}
</style>
