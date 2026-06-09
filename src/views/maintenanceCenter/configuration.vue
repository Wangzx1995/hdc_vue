<template>
    <div class="configuration" v-loading="loading">
        <div class="p-a-md">
            <div class="">
                <span class="text-md">
                    <!-- 选择配置类型 -->
                    {{ $t("deviceConfiguration.selectConfigurationType") }}
                </span>
            </div>
            <div class="title">
                <div>
                    <el-radio-group
                        v-model="searchForm.templateType"
                        type="simple"
                        @change="
                            params.currentPage = 1;
                            hikDevParamTempPage();
                        "
                    >
                        <el-radio-button :label="1">
                            <!-- 协议配置 -->
                            {{
                                $t(
                                    "configurationTemplate.protocolConfiguration"
                                )
                            }}
                        </el-radio-button>
                        <el-radio-button :label="2">
                            <!-- 文件配置 -->
                            {{ $t("configurationTemplate.fileConfiguration") }}
                        </el-radio-button>
                    </el-radio-group>
                </div>
            </div>
            <div
                class="title m-y"
                v-if="
                    searchForm.templateType == 1 || searchForm.templateType == 2
                "
            >
                <span class="text-md">
                    <!-- 选择参数模板 -->
                    {{ $t("deviceConfiguration.selectParameterTemplate") }}
                </span>
            </div>
            <div class="title m-y" v-if="searchForm.templateType == 3">
                <span class="text-md">
                    <!-- 设备配置详情 -->
                    {{
                        $t("deviceConfiguration.equipmentConfigurationDetails")
                    }}
                </span>
            </div>
            <el-table
                border
                ref="table"
                :data="tableData"
                highlight-current-row
                class="m-y"
                @current-change="radioChange"
                :height="tableHeight"
                v-if="
                    searchForm.templateType == 1 || searchForm.templateType == 2
                "
            >
                <!-- 上传时间 -->
                <el-table-column
                    key="1"
                    prop="createTime"
                    :label="$t('devLog.uploaded')"
                    min-width="180px"
                ></el-table-column>
                <!-- 设备型号 -->
                <el-table-column
                    key="2"
                    prop="deviceModelName"
                    :label="$t('common.deviceModelCode')"
                    min-width="120px"
                ></el-table-column>
                <!-- 文件类型 -->
                <el-table-column
                    key="3"
                    prop="fileType"
                    :label="$t('configurationTemplate.fileType')"
                    min-width="120px"
                    v-if="searchForm.templateType == 2"
                >
                    <template slot-scope="scope">
                        <span
                            >{{
                                fileTypeList.find(
                                    (e) =>
                                        Number(e.sysDictCode) ==
                                        Number(scope.row.fileType)
                                )
                                    ? fileTypeList.find(
                                          (e) =>
                                              Number(e.sysDictCode) ==
                                              Number(scope.row.fileType)
                                      ).sysDictName
                                    : "--"
                            }}
                        </span>
                    </template>
                </el-table-column>
                <!-- 设备版本号 -->
                <el-table-column
                    key="4"
                    prop="version"
                    :label="$t('common.softwareVersion')"
                    min-width="120px"
                ></el-table-column>
                <!-- 模板名称 -->
                <el-table-column
                    key="5"
                    prop="templateName"
                    :label="$t('configurationTemplate.templateName')"
                    min-width="120px"
                ></el-table-column>
                <!-- 配置文件版本号 -->
                <el-table-column
                    key="6"
                    prop="configVersion"
                    :label="$t('configurationTemplate.configVersion')"
                    min-width="120px"
                    v-if="searchForm.templateType == 2"
                ></el-table-column>
                <!-- 备注 -->
                <el-table-column
                    key="8"
                    prop="templateRemark"
                    :label="$t('firmware.notes')"
                    min-width="160px"
                ></el-table-column>
                <!-- 操作 -->
                <el-table-column
                    key="9"
                    :label="$t('common.operate')"
                    fixed="right"
                    width="80px"
                >
                    <template slot-scope="scope">
                        <div>
                            <el-button
                                v-if="
                                    searchForm.templateType == 1 ||
                                    (searchForm.templateType == 2 &&
                                        Number(scope.row.fileType) == 0)
                                "
                                type="text"
                                @click="
                                    goEdit(
                                        scope.row.templateType,
                                        scope.row.id,
                                        organizeId
                                    )
                                "
                            >
                                <!-- 编辑 -->
                                {{ $t("common.edit") }}
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-form
                ref="form"
                label-position="top"
                :model="form"
                :rules="rules"
                content-width="450px"
                v-if="searchForm.templateType == 3"
            >
                <!-- 配置内容 -->
                <el-form-item
                    :label="$t('ttsConfiguration.configurationContent')"
                    prop="configTxtContent"
                >
                    <el-input
                        v-model="form.configTxtContent"
                        :placeholder="$t('common.input')"
                        type="textarea"
                        :count="200"
                        :rows="6"
                    ></el-input>
                </el-form-item>
            </el-form>
        </div>
        <el-footer>
            <div class="footer">
                <div
                    class="footer-pagination p-x-md"
                    :class="searchForm.templateType == 3 ? 'no-border' : ''"
                >
                    <el-pagination
                        v-if="
                            searchForm.templateType == 1 ||
                            searchForm.templateType == 2
                        "
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
                <div class="footer-button p-r-md">
                    <el-button type="default" @click="goBack">
                        <!-- 返回 -->
                        {{ $t("common.return") }}
                    </el-button>
                    <el-button type="primary" @click="startConfig">
                        <!-- 下发至终端 -->
                        {{ $t("deviceUpgrade.issuedToTerminal") }}
                    </el-button>
                </div>
            </div>
        </el-footer>
        <StartConfig
            :visible.sync="startConfigVisible"
            :organizeId="organizeId ? organizeId : null"
            :batchCode="batchCode"
            :configType="searchForm.templateType == 3 ? 'tts' : null"
            :deviceInfoList="deviceInfoList"
            @continueConfig="continueConfig"
        >
        </StartConfig>

        <!-- 批量导入 -->
        <el-dialog
            :title="`${$t('ttsConfiguration.batchImport')}${typeListSelected}`"
            :visible.sync="deviceListVisible"
            :width="'500px'"
        >
            <div class="device-list">
                <div>
                    <i class="el-icon-info"></i>
                    <span>
                        <!-- 你导入的{{
                            typeListSelected
                        }}有多种设备型号，请选择其中一种进行配置 -->
                        {{
                            $t("deviceConfiguration.chooseOneToConfig", {
                                typeListSelected: typeListSelected,
                            })
                        }}
                    </span>
                </div>
                <p>
                    <!-- 设备型号列表 -->
                    {{ $t("deviceUpgrade.equipmentModelList") }}
                </p>
                <el-radio-group v-model="deviceModelCode">
                    <el-radio
                        :disabled="item.disabled"
                        :label="item.deviceModelCode"
                        v-for="item in deviceInfoList"
                        :key="item.deviceModelCode"
                        ><span :title="item.deviceModelCode">{{
                            item.deviceModelCode
                        }}</span
                        >&nbsp;&nbsp;[{{ item.checkDeviceInfos.length }}]
                        <!-- 辆 -->
                        {{ $t("deviceUpgrade.theVehicle") }}</el-radio
                    >
                </el-radio-group>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deviceListVisible = false">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button type="primary" @click="doDeviceList">
                    <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import StartConfig from "@/components/coreManage/startConfig";
export default {
    name: "Config",
    components: { StartConfig },
    data() {
        return {
            typeListSelected: this.$route.query.typeListSelected,
            radio: "1",
            form: {
                configTxtTitle: "",
                deviceIds: this.$route.query.deviceIds || null,
                configTxtContent: "",
                configProp: 0,
                configTypes: ["display", "read"],
                organizeId: this.$route.query.organizeId,
            },
            rules: {
                configTxtContent: [
                    {
                        required: true,
                        // message: "请输入配置内容",
                        message:
                            this.$t("common.select") +
                            this.$t("ttsConfiguration.configurationContent"),
                        trigger: "blur",
                    },
                    {
                        max: 200,
                        // message: "长度在200个字符内",
                        message: this.$t(
                            "deviceConfiguration.lengthWithin200Characters"
                        ),
                        trigger: "blur",
                    },
                ],
            },
            tableHeight: 500,
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                deviceModelCode: this.$route.query.deviceModelCode,
            },
            total: 0,
            firmwareVisible: false,
            searchForm: {
                templateType: 1,
                protocolType: 1,
            },
            tableData: [],
            selectId: "",
            selection: {},
            startConfigVisible: false,
            organizeId: +this.$route.query.organizeId,
            deviceInfoList: [],
            batchCode: "",
            deviceList: [],
            deviceListVisible: false,
            deviceModelCode: "",
            loading: false,
            fileTypeList: [],
        };
    },
    watch: {
        "searchForm.templateType": {
            handler(val) {
                this.setTableHeight();
            },
        },
    },

    methods: {
        getDictionList() {
            this.$api
                .getDictionList({
                    dictType: "configFileType",
                })
                .then((res) => {
                    if (res.success == true) {
                        this.fileTypeList = res.data;
                    }
                });
        },
        beforeCurrentChange(val, oldVal) {},
        beforeSizeChange(val, oldVal) {},
        goEdit(type, id, organizeId) {
            if (type === 3) {
                this.$router.push({
                    path: "/maintenanceCenter/configurationTemplate/protocolTemplate",
                    query: {
                        isTemplate: true,
                        type,
                        id,
                        organizeId,
                    },
                });
            } else {
                this.$router.push({
                    path: "/maintenanceCenter/deviceConfiguration/configuration/editTemplate",
                    query: {
                        type,
                        id,
                    },
                });
            }
            // this.$router.push({
            //     path: "/maintenanceCenter/deviceConfiguration/configuration/editTemplate",
            //     query: {
            //         type,
            //         id,
            //     },
            // });
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.hikDevParamTempPage();
            // this.handleCurrentChange(val)
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.hikDevParamTempPage();
        },
        goBack() {
            this.$router.push("/maintenanceCenter/deviceConfiguration");
        },
        // 设备升级 下发终端
        startConfig() {
            if (
                this.searchForm.templateType == 1 ||
                this.searchForm.templateType == 2
            ) {
                if (!this.selectId) {
                    // this.$message.warning("请先选择模板！");
                    this.$message.warning(
                        this.$t("deviceConfiguration.startConfigText2")
                    );
                    return;
                }
                this.$confirm(
                    // `确认要将该“${this.selection.templateName}”下发至设备吗?`,
                    this.$t("deviceConfiguration.startConfigText1", {
                        templateName: this.selection.templateName,
                    }),
                    {
                        confirmButtonText: this.$t("common.issued"),
                        cancelButtonText: this.$t("common.cancel"),
                        type: "warning",
                    }
                )
                    .then(() => {
                        const params = {};
                        if (!this.$route.query.type) {
                            // let deviceList = []
                            // deviceList.push(this.$route.query.deviceIds)
                            // console.log("========================")
                            // console.log(deviceList)
                            params["protocolType"] =
                                this.searchForm.templateType == 2 ? 1 : "";
                            params["deviceModelCode"] =
                                this.$route.query.deviceModelCode;
                            // params["organizeId"] =
                            //     this.$route.query.organizeId;
                            params["deviceIds"] = this.deviceList;
                            params["paramType"] =
                                this.searchForm["templateType"];
                            params["templateId"] = this.selectId;
                        } else {
                            params["protocolType"] =
                                this.searchForm.templateType == 2 ? 1 : "";
                            params["deviceModelCode"] =
                                this.$route.query.deviceModelCode;
                            params["organizeId"] = this.$route.query.organizeId;
                            params["plateNum"] = this.$route.query.plateNum;
                            params["softwareVersion"] =
                                this.$route.query.softwareVersion;
                            params["deviceSerialNum"] =
                                this.$route.query.deviceSerialNum;
                            params["deviceCode"] = this.$route.query.deviceCode;
                            params["deviceStatus"] =
                                this.$route.query.deviceStatus;
                            params["paramType"] =
                                this.searchForm["templateType"];
                            params["templateId"] = this.selectId;
                        }
                        this.$api
                            .sendDeviceSetParamByTemplate(params)
                            .then((res) => {
                                if (res.success == true) {
                                    if (this.deviceInfoList.length) {
                                        this.deviceInfoList.forEach((item) => {
                                            if (
                                                item.deviceModelCode ===
                                                params.deviceModelCode
                                            ) {
                                                item.disabled = true;
                                            }
                                        });
                                        sessionStorage.setItem(
                                            "deviceInfoList",
                                            JSON.stringify(this.deviceInfoList)
                                        );
                                    }
                                    this.startConfigVisible = true;
                                    this.batchCode = res.data;
                                } else {
                                    this.$message.error(
                                        this.$t(
                                            "deviceConfiguration.startConfigText3"
                                        ) +
                                            ":" +
                                            res.msg
                                    );
                                }
                                this.$api.eventTrackTrigger({
                                    menu: "DEVICE_CONFIGURATION",
                                    business: this.$route.query.business,
                                    eventResult: res.success,
                                });
                            });
                    })
                    .catch(() => {});
            } else {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm(
                            this.$t("deviceConfiguration.startConfigText4"),
                            {
                                confirmButtonText: this.$t("common.ok"),
                                cancelButtonText: this.$t("common.cancel"),
                                type: "warning",
                            }
                        )
                            .then(() => {
                                this.$refs.form.validate((valid) => {
                                    if (valid) {
                                        this.$api
                                            .saveTtsTextConfig(this.form)
                                            .then((res) => {
                                                if (res.success == true) {
                                                    this.startConfigVisible = true;
                                                    this.batchCode = res.data;
                                                } else {
                                                    this.$message.error(
                                                        this.$t(
                                                            "deviceConfiguration.startConfigText5"
                                                        ) + res.msg
                                                    );
                                                }
                                                this.$api.eventTrackTrigger({
                                                    menu: "DEVICE_CONFIGURATION",
                                                    business:
                                                        this.$route.query
                                                            .business,
                                                    eventResult: res.success,
                                                });
                                            });
                                    }
                                });
                            })
                            .catch(() => {});
                    }
                });
            }
        },
        radioChange(selection) {
            if (selection) {
                this.selection = selection;
                this.selectId = selection.id;
            } else {
                this.selection = {};
                this.selectId = "";
            }
        },
        /*获取模板信息列表*/
        hikDevParamTempPage() {
            this.loading = true;
            let params = Object.assign(this.params, this.searchForm);
            if (this.searchForm.templateType == 2) {
                params.uploadStatus = 3;
            }
            this.$api.hikDevParamTempPage(params).then((res) => {
                if (res.success == true) {
                    this.tableData =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : this.tableData;
                    this.total = res.data.totalRecords;
                } else {
                    this.$message.error(res.msg);
                }
                this.loading = false;
            });
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 376;
        },
        beforeunloadHandler(e) {
            sessionStorage.removeItem("deviceInfoList");
        },
        continueConfig() {
            this.deviceModelCode = this.deviceInfoList.filter((item) => {
                return item.disabled === false;
            })[0].deviceModelCode;
            this.deviceListVisible = true;
        },
        doDeviceList() {
            let deviceArr = this.deviceInfoList.find(
                (item) => item.deviceModelCode === this.deviceModelCode
            );
            this.$router.replace({
                query: {
                    typeListSelected: this.typeListSelected,
                    deviceModelCode: deviceArr.deviceModelCode,
                    organizeId: this.organizeId,
                    deviceIds: deviceArr.checkDeviceInfos.reduce(
                        (prev, cur) => {
                            return prev.concat(cur["deviceId"]);
                        },
                        []
                    ),
                },
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
        let deviceInfoList = sessionStorage.getItem("deviceInfoList");
        this.deviceInfoList = deviceInfoList ? JSON.parse(deviceInfoList) : [];
        this.getDictionList();
    },
    created() {
        this.setTableHeight();
        this.hikDevParamTempPage();
        if (this.$route.query.deviceIds) {
            this.deviceList = this.$route.query.deviceIds;
        }
    },
};
</script>

<style scoped lang="less">
.configuration {
    .title {
        display: flex;
        justify-content: space-between;
    }
    .footer {
        width: calc(~"100% - 40px");
        height: 4rem;
        position: absolute;
        bottom: 4.2rem;
        .footer-pagination {
            border-top: 1px solid #e4e4e4 !important;
            border-bottom: 1px solid #e4e4e4 !important;
            height: 4rem;
            &.no-border {
                border-top: none !important;
            }
        }
        .footer-button {
            position: absolute;
            right: 0;
            line-height: 4rem;
        }
    }
}
.device-list {
    & > div:first-child {
        display: flex;
        align-items: center;
        color: #faad14;
        i {
            font-size: 26px;
        }
        span {
            line-height: 26px;
        }
    }
    p {
        color: #575757;
        margin: 12px 0;
    }
    .el-radio-group {
        display: flex;
        flex-direction: column;
    }
    /deep/.el-radio {
        margin-left: 0px !important;
        margin-bottom: 12px;
        max-width: 400px !important;
        display: flex;
        align-items: center;
        .el-radio__label {
            display: flex;
            align-items: center;
            span {
                max-width: 380px;
                display: inline-block;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
}
.el-message-box__title {
    word-break: break-all !important;
}
</style>
