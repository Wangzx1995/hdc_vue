<template>
    <div>
        <el-row justify="center" type="flex">
            <el-col :span="24">
                <div class="wrap">
                    <div class="text-lg p-t-md p-x-md p-b-sm">
                        <span>{{ goHistoryList.plateNum || "--" }}</span>
                    </div>
                    <div
                        class="text-sm p-x-md"
                        style="padding-bottom: 1rem !important; color: #999"
                    >
                        <span class="version m-r-md"
                            ><!-- 所属组织 -->
                            {{ $t("common.orgPath") }}：{{
                                goHistoryList.organizeName
                            }}</span
                        >
                        <span class="version m-r-md"
                            ><!-- 设备序列号 -->
                            {{ $t("common.deviceSerialNum") }}：{{
                                goHistoryList.deviceSerialNum
                            }}</span
                        >
                        <span class="version m-r-md"
                            ><!-- 终端手机号 -->
                            {{ $t("common.deviceCode") }}：{{
                                goHistoryList.deviceCode
                            }}</span
                        >
                        <span class="version m-r-md"
                            ><!-- VIN码 -->
                            {{ $t("common.vin") }}：{{
                                goHistoryList.vin
                            }}</span
                        >
                        <span class="version m-r-md"
                            ><!-- 设备型号 -->
                            {{ $t("common.deviceModelCode") }}：{{
                                goHistoryList.deviceModelCode
                            }}<span v-if="goHistoryList.protocolName"
                                >({{ goHistoryList.protocolName }})</span
                            ></span
                        >
                        <span class="version m-r-md"
                            ><!-- 设备厂商 -->
                            {{ $t("common.manufacturerNameString") }}：{{
                                $route.query.manufacturerNameString || "--"
                            }}</span
                        >
                        <span class="version m-r-md"
                            ><!-- 安装服务商 -->
                            {{
                                $t(
                                    "conditionMonitoring.installationServiceProvider"
                                )
                            }}：{{
                                $route.query.installServiceProvider || "--"
                            }}</span
                        >
                    </div>
                    <div class="p-x-md m-b">
                        <div class="search">
                            <div>
                                <el-form
                                    inline
                                    ref="searchForm"
                                    :model="searchForm"
                                >
                                    <!-- 创建时间段 -->
                                    <el-form-item
                                        prop="operationTime"
                                        :label="
                                            $t(
                                                'ttsConfiguration.createTimePeriod'
                                            )
                                        "
                                    >
                                        <el-date-picker
                                            :default-time="[
                                                '00:00:00',
                                                '23:59:59',
                                            ]"
                                            size="small"
                                            v-model="searchForm.operationTime"
                                            type="datetimerange"
                                            :start-placeholder="
                                                $t('common.startTime')
                                            "
                                            :end-placeholder="
                                                $t('common.endTime')
                                            "
                                            transfer
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            clearable
                                        ></el-date-picker>
                                    </el-form-item>
                                    <!-- 配置结果 -->
                                    <el-form-item
                                        prop="schedule"
                                        :label="
                                            $t(
                                                'ttsConfiguration.configurationResult'
                                            )
                                        "
                                    >
                                        <el-select
                                            v-model="searchForm.schedule"
                                            clearable
                                        >
                                            <el-option
                                                v-for="(
                                                    item, index
                                                ) in statusList"
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

                        <!-- 配置下发任务-按任务查看 -->
                        <el-table
                            v-loading="searchLoading"
                            :element-loading-text="
                                $t('common.desperatelyLoading')
                            "
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
                            >
                            </el-table-column>
                            <!-- 配置类型 -->
                            <el-table-column
                                prop="cmd"
                                :label="
                                    $t('deviceConfiguration.configurationType')
                                "
                            >
                                <template slot-scope="scope">
                                    {{
                                        scope.row.cmd
                                            ? cmdList[scope.row.cmd]
                                            : "--"
                                    }}
                                </template>
                            </el-table-column>
                            <!-- 进度更新时间 -->
                            <el-table-column
                                prop="updateTime"
                                :label="
                                    $t('ttsConfiguration.progressUpdateTime')
                                "
                                sortable="custom"
                            >
                            </el-table-column>
                            <!-- 操作人员 -->
                            <el-table-column
                                prop="createName"
                                :label="$t('operationLog.operator')"
                            >
                            </el-table-column>
                            <!-- 配置结果 -->
                            <el-table-column
                                prop="result"
                                fixed="right"
                                :label="
                                    $t('ttsConfiguration.configurationResult')
                                "
                            >
                                <template slot-scope="scope">
                                    <div>
                                        <span
                                            :class="
                                                configStatusList[
                                                    scope.row.result
                                                ] &&
                                                configStatusList[
                                                    scope.row.result
                                                ].color
                                            "
                                            v-if="
                                                configStatusList[
                                                    scope.row.result
                                                ]
                                            "
                                            >●</span
                                        >
                                        {{
                                            configStatusList[
                                                scope.row.result
                                            ] &&
                                            configStatusList[scope.row.result]
                                                .name
                                        }}
                                    </div>
                                </template>
                            </el-table-column>
                            <!-- 失败原因 -->
                            <el-table-column
                                prop="failReason"
                                :label="
                                    $t('plateNumAndDeviceCode.failureReason')
                                "
                                width="160px"
                                fixed="right"
                                show-overflow-tooltip
                            ></el-table-column>
                            <!-- 操作 -->
                            <el-table-column
                                :label="$t('common.operate')"
                                fixed="right"
                                width="120px"
                            >
                                <template slot-scope="scope">
                                    <a
                                        v-if="scope.row.paramsBefore"
                                        @click="taskDetail(scope.row)"
                                    >
                                        <!-- 配置详情 -->
                                        {{
                                            $t(
                                                "deviceConfiguration.configurationDetails"
                                            )
                                        }}
                                    </a>
                                    <a
                                        v-else-if="
                                            scope.row.templateId &&
                                            scope.row.templateType !== '2' &&
                                            scope.row.cmd !== 9
                                        "
                                        @click="
                                            taskTemplateDetail(
                                                scope.row.templateType,
                                                scope.row.templateId,
                                                scope.row.cmd
                                            )
                                        "
                                    >
                                        <!-- 配置详情 -->
                                        {{
                                            $t(
                                                "deviceConfiguration.configurationDetails"
                                            )
                                        }}
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
                                                <!-- 配置详情 -->
                                                {{
                                                    $t(
                                                        "deviceConfiguration.configurationDetails"
                                                    )
                                                }}
                                            </a>
                                        </span>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="p-x-md wrap-bottom">
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
            </el-col>
        </el-row>
        <!-- 配置详情 -->
        <el-dialog
            :title="$t('deviceConfiguration.configurationDetails')"
            :visible.sync="dialogTableVisible"
            :width="'1300px'"
        >
            <div v-if="dialogTableVisible">
                <div
                    v-if="historyType === 3"
                    style="height: 500px; overflow-y: auto"
                >
                    <protocolTemplate :id="historyId"></protocolTemplate>
                </div>

                <EditTemplate
                    v-else
                    :dialogTableVisible="dialogTableVisible"
                    :historyId="historyId"
                    :historyType="historyType"
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
            :width="'1300px'"
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
                <el-button @click="dialogTableVisible1 = false">
                    <!-- 关 闭 -->
                    {{ $t("common.close") }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import EditTemplate from "./editTemplate.vue";
import protocolTemplate from "@/views/protocolConfiguration/components/protocolTemplate.vue";
import enumerationJSON from "@/views/protocolConfiguration/components/configuration/enumerationJSON/enumeration.json";
export default {
    name: "configurationView",
    components: { EditTemplate, protocolTemplate },
    data() {
        return {
            eventDisplayList:
                enumerationJSON["intelliDrive_sensor_eventDisplay"],
            dialogTableVisible: false,
            dialogTableVisible1: false,
            gridData: [],
            paramsBefore: [],
            tableHeight: 500,
            screenTerm: false,
            searchLoading: true,
            historyId: "",
            historyType: "",
            historyParamsBefore: [],
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
            cmdList: {
                // 2: '文件配置下发--HTTP协议',
                1: this.$t("deviceConfiguration.fileConfigurationRetrieval"), //"文件配置获取",
                2: this.$t("deviceConfiguration.fileConfigurationDistribution"), //"文件配置下发",
                3: this.$t("deviceConfiguration.HTTPTerminalConfiguration"), //"HTTP终端配置参数查询",
                4: this.$t("deviceConfiguration.TTSTextDistribution"), //"TTS文本下发",
                5: this.$t("deviceConfiguration.fileConfigurationDistribution"), //"文件配置下发",
                6: this.$t("deviceConfiguration.protocolConfigurationIssuance"), //"协议配置下发",
                7: this.$t("deviceConfiguration.protocolConfigurationIssuance"), //"协议配置下发",
                8: this.$t("deviceConfiguration.protocolConfigurationIssuance"), //"协议配置下发",
                9: this.$t(
                    "deviceConfiguration.distributionOfFileTemplateConfiguration"
                ), //"文件模板配置下发"
                10: this.$t(
                    "deviceConfiguration.protocolTemplateConfigurationDistribution"
                ), //"协议模板配置下发"
            },
            loadingAll: false,
            searchForm: {
                schedule: "",
                operationTime: [],
            },
            treeData: [],
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
            historyCmd: "",
        };
    },
    methods: {
        //排序
        handleSortChange(column, prop, order) {
            this.params.orderDir = !column.order
                ? ""
                : column.order == "ascending"
                ? "asc"
                : "desc";
            this.params.orderColumn = !column.prop ? "" : column.prop;
            this.getTableData();
        },
        taskDetail(data) {
            // 1：上传配置文件，2：下载配置文件，3：查询参数，4：TTS，5：协议配置查询，6：协议配置下发，7-参数查询，8-私有协议下发，9-文件模板配置下发，10-协议模板配置下发
            this.paramsBefore = [];
            this.gridData = [];
            this.paramsBefore = JSON.parse(data.paramsBefore);
            if (data.cmd === 8) {
                this.paramsBefore.forEach((firstTitle) => {
                    firstTitle.children.forEach((secondTitle) => {
                        if (
                            firstTitle.title === "设备参数" &&
                            secondTitle.title === "显示输出"
                        ) {
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
                                let content = item.showValue;
                                if (item.type === "switch") {
                                    content =
                                        Number(item.showValue) === 1
                                            ? "开启"
                                            : "关闭";
                                }
                                this.gridData.push({
                                    name: `${firstTitle.title}>${secondTitle.title}>${item.label}`,
                                    content: content,
                                });
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
            this.historyType = "";
        },

        taskTemplateDetail(type, id, cmd) {
            this.historyCmd = "";
            this.historyId = "";
            this.historyType = "";
            this.historyId = id;
            this.historyType = type;
            this.historyCmd = cmd;
            this.dialogTableVisible = true;
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
            //   this.$store.dispatch('SetShowSearchForm', this.searchForm);

            // 配置下发任务-按任务查看
            this.$api
                .getConfigParamHistory(params)
                .then((res) => {
                    if (res.success == true) {
                        // console.log(res.data.results);
                        this.tableData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableData;
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
                        this.goHistoryList.vin = this.$route.query.vin;
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.searchLoading = false;
                    this.$api.eventTrackTrigger({
                        menu: "DEVICE_CONFIGURATION",
                        business: "DEVICE_CONFIG_HISTORY_INFO",
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
            this.tableHeight = document.body.clientHeight - 295;
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
        // this.paramsBefore =JSON.parse(this.$route.query.paramsBefore)
        // console.log(this.paramsBefore)
        // console.log()
        // for(let i in this.paramsBefore) {
        //   console.log(i)
        //   if(this.paramsBefore[i]){
        //     this.gridData.push(
        //       {
        //         name:this.paramsBefore[i].split('&')[1],
        //         content:this.paramsBefore[i].split('&')[2],
        //       }
        //     )
        //   }
        // }
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
    .marginBottom {
        margin-bottom: 1.5rem !important;
    }
}
.wrap-bottom {
    border-top: 1px solid #e4e4e4;
}
</style>
