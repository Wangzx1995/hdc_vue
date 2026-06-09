<template>
    <div class="wrap">
        <div class="title wrap-top">
            <div class="text-lg">
                <span>
                    <!-- 我的配置任务 -->
                    {{ $t("ttsConfiguration.myConfigurationTask") }}
                </span>
            </div>
        </div>
        <div class="wrap">
            <div ref="searchBox" class="search-module">
                <div
                    class="search-form-content"
                    :class="{ hidden: !buttonClick }"
                    ref="wrap"
                >
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
                        <!-- 配置模板 -->
                        <el-form-item
                            prop="templateId"
                            :label="
                                $t('deviceConfiguration.configurationTemplate')
                            "
                        >
                            <el-select
                                v-model="searchForm.templateId"
                                clearable
                            >
                                <el-option
                                    v-for="item in templateIdList"
                                    :label="item.templateName"
                                    :value="item.templateId"
                                    :key="item.templateId"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 配置类型 -->
                        <el-form-item
                            prop="cmd"
                            :label="$t('deviceConfiguration.configurationType')"
                        >
                            <el-select v-model="searchForm.cmd" clearable>
                                <el-option
                                    v-for="item in cmdSearchList"
                                    :label="item.label"
                                    :value="item.value"
                                    :key="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 任务状态 -->
                        <el-form-item
                            prop="schedule"
                            :label="$t('deviceConfiguration.schedule')"
                        >
                            <el-select v-model="searchForm.schedule" clearable>
                                <!-- 全部 -->
                                <el-option
                                    value=""
                                    key=""
                                    :label="$t('common.all')"
                                ></el-option>
                                <!-- 进行中 -->
                                <el-option
                                    :value="0"
                                    :key="0"
                                    :label="$t('common.progress')"
                                ></el-option>
                                <!-- 已完成 -->
                                <el-option
                                    :value="1"
                                    :key="1"
                                    :label="$t('common.completed')"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div ref="searchBtn" class="search-btn">
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

            <!-- 配置下发任务-按任务查看 -->
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
                    <!-- 创建时间 -->
                    <el-table-column
                        prop="createTime"
                        :label="$t('cardSwapRecord.createTime')"
                        min-width="160px"
                    >
                    </el-table-column>
                    <!-- 配置模板 -->
                    <el-table-column
                        prop="templateName"
                        :label="$t('deviceConfiguration.configurationTemplate')"
                        min-width="180px"
                    ></el-table-column>
                    <!-- 配置类型 -->
                    <el-table-column
                        prop="cmd"
                        :label="$t('deviceConfiguration.configurationType')"
                        min-width="120px"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.cmd ? cmdList[scope.row.cmd] : "--" }}
                        </template>
                    </el-table-column>
                    <!-- 任务状态 -->
                    <el-table-column
                        prop="result"
                        :label="$t('deviceConfiguration.schedule')"
                        min-width="120px"
                    >
                        <template slot-scope="scope">
                            {{ resultList[scope.row.result] }}
                        </template>
                    </el-table-column>
                    <!-- 进度更新时间 -->
                    <el-table-column
                        prop="updateTime"
                        :label="$t('deviceUpgrade.upgradeStateTime')"
                        min-width="160px"
                    ></el-table-column>
                    <!-- 成功/进行中/失败 -->
                    <el-table-column
                        :label="
                            $t('common.success') +
                            '/' +
                            $t('common.progress') +
                            '/' +
                            $t('common.failed')
                        "
                        min-width="220px"
                    >
                        <template slot-scope="scope">
                            {{
                                `${scope.row.successNum}/${scope.row.ingNum}/${scope.row.failNum}`
                            }}
                        </template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column
                        :label="$t('common.operate')"
                        fixed="right"
                        min-width="80px"
                    >
                        <template slot-scope="scope" width="100px">
                            <a
                                v-if="scope.row.paramsBefore"
                                @click="
                                    taskDetail(
                                        scope.row.batchCode,
                                        scope.row.cmd,
                                        scope.row.templateName,
                                        scope.row.createTime,
                                        scope.row.configTitle,
                                        scope.row.paramsBefore
                                    )
                                "
                            >
                                <!-- 详情 -->
                                {{ $t("common.detail") }}
                            </a>
                            <a
                                v-else-if="scope.row.templateId"
                                @click="
                                    taskTemplateDetail(
                                        scope.row.batchCode,
                                        scope.row.cmd,
                                        scope.row.templateName,
                                        scope.row.createTime,
                                        scope.row.configTitle,
                                        scope.row.templateType,
                                        scope.row.templateId,
                                        scope.row.params
                                    )
                                "
                            >
                                <!-- 详情 -->
                                {{ $t("common.detail") }}
                            </a>
                            <a
                                v-else
                                @click="
                                    taskDetailNo(
                                        scope.row.batchCode,
                                        scope.row.cmd,
                                        scope.row.templateName,
                                        scope.row.createTime,
                                        scope.row.configTitle
                                    )
                                "
                            >
                                <!-- 详情 -->
                                {{ $t("common.detail") }}
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
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
export default {
    name: "configurationView",
    components: {},
    data() {
        return {
            screenTerm: false,
            searchLoading: true,
            templateIdList: [
                {
                    templateId: "",
                    templateName: this.$t("common.all"), //"全部",
                },
            ], //配置模板
            cmdSearchList: [
                {
                    value: "",
                    label: this.$t("common.all"), //"全部",
                },
                {
                    value: "5",
                    label: this.$t(
                        "deviceConfiguration.fileConfigurationDistribution"
                    ), //"文件配置下发"
                },
                {
                    value: "6",
                    label: this.$t(
                        "deviceConfiguration.protocolConfigurationIssuance"
                    ), //"协议配置下发"
                },
                {
                    value: "9",
                    label: this.$t(
                        "deviceConfiguration.distributionOfFileTemplateConfiguration"
                    ), //"文件模板配置下发"
                },
                {
                    value: "10",
                    label: this.$t(
                        "deviceConfiguration.protocolTemplateConfigurationDistribution"
                    ), //"协议模板配置下发"
                },
            ],
            tableHeight: 500,
            buttonClick: false,
            iconShow: false,
            cmdList: {
                // 2: '文件配置下发--HTTP协议',
                5: this.$t("deviceConfiguration.fileConfigurationDistribution"), //"文件配置下发",
                6: this.$t("deviceConfiguration.protocolConfigurationIssuance"), //"协议配置下发",
                9: this.$t(
                    "deviceConfiguration.distributionOfFileTemplateConfiguration"
                ), //"文件模板配置下发"
                10: this.$t(
                    "deviceConfiguration.protocolTemplateConfigurationDistribution"
                ), //"协议模板配置下发"
            },
            resultList: {
                0: this.$t("common.progress"), //"进行中",
                1: this.$t("common.completed"), //"已完成",
                2: this.$t("common.progress"), //"进行中",
            },
            searchForm: {
                templateId: "",
                operationTime: [],
                cmd: "",
                schedule: "",
            },
            tableData: [],
            total: 0,
            params: {
                currentPage: 1, // 页码，从1开始
                pageSize: 20, // 分页大小
                organizeId: null,
            },
        };
    },
    methods: {
        // 获取配置模板列表数据
        getTemplateList() {
            const params = {
                templateId: this.searchForm.templateId,
                schedule: this.searchForm.templateId,
                cmd: this.searchForm.cmd,
            };
            if (this.searchForm.operationTime.length > 0) {
                params.beginTime = this.searchForm.operationTime[0];
                params.endTime = this.searchForm.operationTime[1];
            } else {
                params.beginTime = "";
                params.endTime = "";
            }
            this.$api.getParamBatchTemplateList(params).then((res) => {
                if (res.success == true) {
                    let data = res.data.filter((obj) => obj);
                    let dataLest = [];
                    dataLest = data.map((item) => {
                        // console.log(item)
                        return Object.assign(
                            {},
                            { templateId: item.id },
                            { templateName: item.templateName }
                        );
                    });
                    this.templateIdList = [
                        { templateId: "", templateName: this.$t("common.all") },
                        ...dataLest,
                    ];
                } else {
                    this.$message.error(res.msg);
                }
            });
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
            this.$confirm(confirmText, this.$t("common.prompt"), {
                confirmButtonText: this.$t("common.ok"),
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
            })
                .then(() => {
                    const params = {
                        batchNo,
                        logId,
                    };
                    this.$api.stopDeviceConfigTask(params).then((res) => {
                        if (res.success == true) {
                            this.getTableData();
                            // this.getParamLogResultStatistics();
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
            this.$confirm(confirmText, this.$t("common.prompt"), {
                confirmButtonText: this.$t("common.ok"),
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
            })
                .then(() => {
                    const params = {
                        batchNo,
                        logId,
                        cmd,
                    };
                    this.$api
                        .saveDeviceConfigParamsToDeviceAgain(params)
                        .then((res) => {
                            if (res.success == true) {
                                this.getTableData();
                                // this.getParamLogResultStatistics();
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                })
                .catch(() => {});
        },
        taskDetail(
            batchCode,
            cmd,
            templateName,
            createTime,
            configTitle,
            paramsBefore
        ) {
            this.$router.push({
                path: "/maintenanceCenter/deviceConfiguration/configurationTask/configurationTaskDetailNew",
                query: {
                    batchCode,
                    organizeId: this.params.organizeId,
                    cmd,
                    templateName,
                    createTime,
                    configTitle,
                    paramsBefore,
                },
            });
        },
        taskDetailNo(batchCode, cmd, templateName, createTime, configTitle) {
            this.$router.push({
                path: "/maintenanceCenter/deviceConfiguration/configurationTask/configurationTaskDetailNew",
                query: {
                    batchCode,
                    organizeId: this.params.organizeId,
                    cmd,
                    templateName,
                    createTime,
                    configTitle,
                },
            });
        },
        //详情-模板
        taskTemplateDetail(
            batchCode,
            cmd,
            templateName,
            createTime,
            configTitle,
            type,
            id,
            param
        ) {
            this.$router.push({
                path: "/maintenanceCenter/deviceConfiguration/configurationTask/configurationTaskDetailNew",
                query: {
                    batchCode,
                    organizeId: this.params.organizeId,
                    cmd,
                    templateName,
                    createTime,
                    configTitle,
                    type,
                    id,
                    param,
                    isTemplate: true,
                },
            });
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
                // this.$store.dispatch('SetShowSearchForm', this.searchForm);
            }
        },
        // 获取table数据
        getTableData() {
            this.searchLoading = true;
            const params = Object.assign({}, this.params, this.searchForm);
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

            // 配置下发任务-按任务查看
            // console.log(params)
            this.$api
                .getParamBatchPage(params)
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
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.searchLoading = false;
                    this.$api.eventTrackTrigger({
                        menu: "DEVICE_CONFIGURATION",
                        business: "DEVICE_CONFIG_TASK_INFO",
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
            this.tableHeight = this.buttonClick
                ? document.body.clientHeight - 302
                : document.body.clientHeight - 256;
        },
        //查询重叠
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
    },
    mounted() {
        this.setWrap();
        const that = this;
        window.onresize = () =>
            (() => {
                that.setTableHeight();
                that.setWrap();
            })();
        //监听浏览器返回
        // if (window.history && window.history.pushState) {
        //     history.pushState(null, null, document.URL);
        //     window.addEventListener('popstate', this.goPageBefore, false);
        // }
    },

    created() {
        // if(this.$store.state.tree.tabName){
        //   this.searchWay = this.$store.state.tree.tabName
        // }else{
        //   this.searchWay = this.$route.query.searchWay ? this.$route.query.searchWay : '1'
        // }
        this.setTableHeight();
        // this.getOrganizeTreeWithParamData()
        this.getTemplateList();
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
    padding: 12px 14px 0;
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
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .flex {
            display: flex;
        }
        .el-form-item {
            margin-bottom: 12px !important;
        }
    }
    .wrap-bottom {
        height: 4rem;
        margin-top: 14px;
        border-top: 1px solid #e4e4e4;
    }
    .hidden {
        height: 46px;
        overflow: hidden;
    }
}
</style>
