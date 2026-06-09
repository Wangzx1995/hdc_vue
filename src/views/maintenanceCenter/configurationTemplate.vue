<template>
    <div>
        <div class="wrap">
            <el-tabs v-model="config" @tab-click="handleTabClick" class="p-x">
                <!-- 协议配置 -->
                <el-tab-pane
                    :disabled="searchLoading"
                    :label="$t('configurationTemplate.protocolConfiguration')"
                    name="protocol"
                ></el-tab-pane>
                <!-- 文件配置 -->
                <el-tab-pane
                    :disabled="searchLoading"
                    :label="$t('configurationTemplate.fileConfiguration')"
                    name="file"
                ></el-tab-pane>
            </el-tabs>
            <div ref="searchBox" class="wrap-top p-x">
                <el-form :model="searchForm" ref="searchForm" inline>
                    <!-- 设备型号 -->
                    <el-form-item
                        :label="$t('common.deviceModelCode')"
                        prop="deviceModelCode"
                    >
                        <el-select
                            v-model="searchForm.deviceModelCode"
                            filterable
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in deviceModelList"
                                :key="index"
                                :value="item.fieldNameEN"
                                :label="item.fieldNameCN"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button
                        type="primary"
                        :disabled="searchLoading"
                        :loading="searchLoading"
                        @click="
                            params.currentPage = 1;
                            search();
                        "
                    >
                        <!-- 查询 -->
                        {{ $t("common.search") }}
                    </el-button>
                    <el-button type="default" @click="handleReset()">
                        <!-- 清除条件 -->
                        {{ $t("common.reset") }}
                    </el-button>
                </div>
            </div>
            <div ref="searchAlert" class="wrap-top p-x">
                <div
                    class="w-full"
                    v-show="!closeFlag"
                    style="margin-top: 1rem"
                >
                    <!-- 推荐使用协议配置，更齐全操作更便捷。支持离线托管，设备在线时平台自动下发配置任务，无需等待！ -->
                    <el-alert
                        :title="$t('configurationTemplate.elAlert')"
                        :closable="true"
                        type="success"
                        simple
                        @close="closeAlert"
                    ></el-alert>
                </div>
            </div>
            <div class="m-y p-x">
                <el-table
                    ref="table1"
                    v-loading="searchLoading"
                    :element-loading-text="$t('common.desperatelyLoading')"
                    element-loading-color="#007213"
                    @selection-change="onSelectionChange"
                    row-key="id"
                    :data="tableData"
                    :height="tableHeight"
                    v-show="config == 'protocol'"
                    border
                    stripe
                >
                    <!-- 上传时间 -->
                    <el-table-column
                        prop="createTime"
                        :label="$t('devLog.uploaded')"
                        width="170px"
                    ></el-table-column>
                    <!-- 设备型号 -->
                    <el-table-column
                        prop="deviceModelName"
                        :label="$t('common.deviceModelCode')"
                        min-width="120px"
                    ></el-table-column>
                    <!-- 设备版本号 -->
                    <el-table-column
                        prop="version"
                        :label="$t('common.softwareVersion')"
                        min-width="120px"
                    ></el-table-column>
                    <!-- 模板名称 -->
                    <el-table-column
                        prop="templateName"
                        :label="$t('configurationTemplate.templateName')"
                        min-width="120px"
                    ></el-table-column>
                    <!-- 备注 -->
                    <el-table-column
                        prop="templateRemark"
                        :label="$t('firmware.notes')"
                        min-width="160px"
                    ></el-table-column>
                    <!-- 开启强制应用模板 -->
                    <el-table-column
                        prop="openStatus"
                        min-width="160px"
                        :render-header="
                            (h) => {
                                return h('span', { class: 'poptip' }, [
                                    h(
                                        'span',
                                        $t(
                                            'configurationTemplate.mandatoryApplicationTemplate'
                                        )
                                    ), //表格当前列标题
                                    h(
                                        'Poptip',
                                        {
                                            props: {
                                                placement: 'top',
                                                width: '80px',
                                                trigger: 'hover',
                                                offset: 2,
                                                transfer: true,
                                                title: '',
                                            },
                                            style: {
                                                'font-weight': '400',
                                            },
                                        },
                                        [
                                            h('Icon', {
                                                //筛选图标
                                                props: {
                                                    type: 'information-circled',
                                                    color: '#B9BCCD',
                                                    size: '12',
                                                },
                                                style: {
                                                    'margin-left': '4px',
                                                },
                                            }),
                                            h(
                                                'span',
                                                { slot: 'content' },
                                                // '设备开机后检查配置项是否修改，若修改则强制下发该配置模板'
                                                $t(
                                                    'configurationTemplate.mandatoryApplicationTemplateDesc'
                                                )
                                            ),
                                        ]
                                    ),
                                ]);
                            }
                        "
                    >
                        <template slot-scope="scope">
                            <el-switch
                                v-btn="
                                    'configurationTemplateEnable&DisableTemplates'
                                "
                                @change="
                                    changeOpenStatus(scope.row, scope.$index)
                                "
                                v-model="scope.row.openStatus"
                            ></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('common.operate')"
                        width="120px"
                        fixed="right"
                    >
                        <template slot-scope="scope">
                            <a
                                @click="
                                    goEdit(
                                        scope.row.templateType,
                                        scope.row.id,
                                        organizeId
                                    )
                                "
                                v-btn="'configurationTemplateEditTemplates'"
                            >
                                <!-- 编辑 -->
                                {{ $t("common.edit") }}
                            </a>
                            <a
                                @click="
                                    goDelete(
                                        scope.row.templateType,
                                        scope.row.id
                                    )
                                "
                                v-btn="'configurationTemplateDeleteTemplates'"
                                class="m-r-sm"
                            >
                                <!-- 删除 -->
                                {{ $t("common.delete") }}
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table
                    ref="table2"
                    v-loading="searchLoading"
                    :element-loading-text="$t('common.desperatelyLoading')"
                    element-loading-color="#007213"
                    @selection-change="onSelectionChange"
                    row-key="id"
                    :data="tableData"
                    :height="tableHeight"
                    v-show="config == 'file'"
                    border
                    stripe
                >
                    <!-- <el-table-column
                        type="selection"
                        :reserve-selection="true"
                    ></el-table-column> -->
                    <!-- 上传时间 -->
                    <el-table-column
                        prop="createTime"
                        :label="$t('devLog.uploaded')"
                        width="170px"
                    ></el-table-column>
                    <!-- 设备型号 -->
                    <el-table-column
                        prop="deviceModelName"
                        :label="$t('common.deviceModelCode')"
                        min-width="120px"
                    ></el-table-column>
                    <!-- 文件类型 -->
                    <el-table-column
                        prop="fileType"
                        :label="$t('configurationTemplate.fileType')"
                        min-width="120px"
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
                        prop="version"
                        :label="$t('common.softwareVersion')"
                        min-width="120px"
                    ></el-table-column>
                    <!-- 模板名称 -->
                    <el-table-column
                        prop="templateName"
                        :label="$t('configurationTemplate.templateName')"
                        min-width="120px"
                    ></el-table-column>
                    <!-- 配置文件版本号 -->
                    <el-table-column
                        prop="configVersion"
                        :label="$t('configurationTemplate.configVersion')"
                        min-width="120px"
                    ></el-table-column>
                    <!-- 上传状态 -->
                    <el-table-column
                        prop="fileType"
                        :label="$t('configurationTemplate.uploadStatus')"
                        min-width="120px"
                    >
                        <template slot-scope="scope">
                            <div class="status-box">
                                <span v-if="scope.row.uploadStatus === 1"
                                    ><i class="status-1"></i
                                    >{{ uploadStatusList[1] }}</span
                                >
                                <span v-else-if="scope.row.uploadStatus === 2"
                                    ><i class="status-2"></i
                                    >{{ uploadStatusList[2] }}</span
                                >
                                <span v-else-if="scope.row.uploadStatus === 3"
                                    ><i class="status-3"></i
                                    >{{ uploadStatusList[3] }}
                                </span>
                                <span v-else-if="scope.row.uploadStatus === 4"
                                    ><i class="status-2"></i
                                    >{{ uploadStatusList[4] }}</span
                                >
                                <span v-else><i class="status-0"></i>--</span>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- 备注 -->
                    <el-table-column
                        prop="templateRemark"
                        :label="$t('firmware.notes')"
                        min-width="160px"
                    ></el-table-column>
                    <el-table-column
                        :label="$t('common.operate')"
                        width="140px"
                        fixed="right"
                    >
                        <template slot-scope="scope">
                            <a
                                @click="
                                    goDelete(
                                        scope.row.templateType,
                                        scope.row.id
                                    )
                                "
                                class="m-r-sm"
                            >
                                <!-- 删除 -->
                                {{ $t("common.delete") }}
                            </a>
                            <a
                                v-if="Number(scope.row.fileType) == 0"
                                @click="
                                    goEdit(
                                        scope.row.templateType,
                                        scope.row.id,
                                        organizeId
                                    )
                                "
                                class="m-r-sm"
                            >
                                <!-- 编辑 -->
                                {{ $t("common.edit") }}
                            </a>
                            <a
                                v-if="
                                    Number(scope.row.fileType) == 0 ||
                                    scope.row.uploadStatus === 3
                                "
                                @click="downLoad(scope.row)"
                            >
                                <!-- 下载 -->
                                {{ $t("common.download") }}
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div ref="searchPagination" class="wrap-bottom p-x">
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
        <!-- 请选择车辆 -->
        <el-dialog
            :visible="customBol"
            :title="$t('configurationTemplate.pleaseSelectVehicle')"
            fill="blue"
            @close="doExit"
            :width="'500px'"
            class="modal-nopadding"
        >
            <div>
                <el-form
                    ref="form"
                    label-position="top"
                    :model="forceApplyForm"
                    :rules="rules"
                    inline
                >
                    <!-- 车牌号 -->
                    <el-form-item :label="$t('common.plateNum')" prop="carIds">
                        <el-select
                            :remote-method="remoteMethod"
                            :loading="loading"
                            filterable
                            style="width: 300px"
                            reserve-keyword
                            remote
                            multiple
                            collapse-tags
                            :placeholder="
                                $t('devLog.enterThreeLicensePlateNumbers')
                            "
                            v-model="forceApplyForm.carIds"
                        >
                            <!-- 已被绑定 -->
                            <el-option
                                v-for="item in plateArr"
                                :key="item.id"
                                :value="item.id"
                                :label="
                                    item.show
                                        ? item.plateNum
                                        : item.plateNum +
                                          '（' +
                                          $t(
                                              'configurationTemplate.alreadyBound'
                                          ) +
                                          '）'
                                "
                                :disabled="!item.show"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button type="default" @click="doExit">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button
                    :loading="updateCustomJsonBol"
                    :disabled="updateCustomJsonBol"
                    type="primary"
                    @click="doSave"
                >
                    <!-- 保存 -->
                    {{ $t("common.save") }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
// import TreeSelect from '@/components/hui-pro/tree-select/src/tree-select.vue';
// import '@/components/hui-pro/tree-select/theme/index.scss'
export default {
    name: "firmware",
    data() {
        const checkArray = function (rule, value, callback) {
            if (value.length != 0) {
                callback();
            } else {
                // 请至少选择一台车辆
                callback(
                    new Error(
                        this.$t("configurationTemplate.selectLeastOneVehicle")
                    )
                );
            }
        };
        return {
            forceApplyForm: {
                templateId: "",
                openStatus: false,
                carIds: [],
            },
            openStatusIndex: "",
            customBol: false,
            loading: false,
            updateCustomJsonBol: false,
            plateArr: [],
            searchLoading: true,
            tableHeight: 500,
            config: "",
            selection: [],
            firmwareVisible: false,
            deviceModelList: [],
            searchForm: {
                deviceModelCode: "",
            },
            organizeId: this.$route.query.organizeId,
            tableData: [],
            params: {
                currentPage: 1,
                pageSize: 20,
            },
            total: 0,
            rules: {
                carIds: [
                    {
                        required: true,
                        validator: checkArray.bind({ type: "array" }),
                        trigger: "change",
                    },
                ],
            },
            closeFlag: false,
            fileTypeList: [],
            uploadStatusList: [
                "--",
                this.$t("configurationTemplate.uploadStatusListText1"), // "命令下发成功",
                this.$t("configurationTemplate.uploadStatusListText2"), //"设备响应失败/暂不支持",
                this.$t("configurationTemplate.uploadStatusListText3"), //"文件上传成功",
                this.$t("configurationTemplate.uploadStatusListText4"), //"文件上传失败",
            ],
        };
    },

    watch: {
        "forceApplyForm.carIds": {
            handler(val) {
                if (!val.length && this.query.length < 3) {
                    this.plateArr = [];
                }
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val.length < 3 && !this.forceApplyForm.carIds.length) {
                    this.plateArr = [];
                }
            },
            deep: true,
        },
    },
    methods: {
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
                let goPath = organizeId
                    ? "/maintenanceCenter/deviceConfiguration/configurationTemplate/editTemplate"
                    : "/maintenanceCenter/configurationTemplate/editTemplate";
                this.$router.push({
                    path: goPath,
                    query: {
                        type,
                        id,
                        organizeId,
                    },
                });
            }
        },
        //切换模板是否开始
        changeOpenStatus(item, index) {
            if (item["openStatus"]) {
                this.customBol = true;
                this.forceApplyForm.templateId = item["id"];
                this.forceApplyForm.openStatus = item["openStatus"];
                this.openStatusIndex = index;
            } else {
                this.forceApplyForm.templateId = item["id"];
                this.forceApplyForm.openStatus = item["openStatus"];
                this.openStatusIndex = index;
                this.$api.forceApply(this.forceApplyForm).then((res) => {
                    if (res.success) {
                        // 关闭成功！
                        this.$message.success(
                            this.$t("configurationTemplate.closeSuccess")
                        );
                    } else {
                        // 关闭失败！
                        this.$message.success(
                            this.$t("configurationTemplate.closeFail")
                        );
                    }
                });
            }
        },
        doSave() {
            this.$refs["form"].validate((valid, invalidFields) => {
                if (valid) {
                    this.$api.forceApply(this.forceApplyForm).then((res) => {
                        if (res.success) {
                            this.customBol = false;
                            this.$message.success(
                                this.$t(
                                    "configurationTemplate.successfullyOpened"
                                )
                            );
                            let params = Object.assign(
                                {},
                                {
                                    templateType:
                                        this.config == "protocol" ? 1 : 2,
                                },
                                this.searchForm,
                                this.params
                            );
                            this.hikDevParamTempPage(params);
                        } else {
                            this.$refs["form"].focusFirstField();
                            this.customBol = false;
                            this.tableData[this.openStatusIndex][
                                "openStatus"
                            ] = false;
                            this.$message.error(`${res.msg}`);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        doExit() {
            this.$refs["form"].resetFields();
            this.customBol = false;
            this.tableData[this.openStatusIndex]["openStatus"] = false;
        },
        remoteMethod(query) {
            this.query = query;
            if (query.length >= 3) {
                this.getPlateNumList({ plateNum: query });
            }
        },
        getPlateNumList(params) {
            this.loading = true;
            this.$api.hikDevParamTempCarList(params).then((res) => {
                this.plateArr = res.data.carList;
                this.loading = false;
            });
        },
        goDelete(type, id) {
            // this.$confirm("模板删除后将无法恢复", "确定要删除该模板吗？", {
            this.$confirm(
                this.$t("configurationTemplate.goDeleteText1"),
                this.$t("configurationTemplate.goDeleteText2"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    let params = { id: id };
                    this.$api.hikDevParamTempDelete(params).then((res) => {
                        if (res.success == true) {
                            // 模板已删除成功
                            this.$message.success(
                                this.$t("configurationTemplate.goDeleteText3")
                            );
                        } else {
                            this.$message.error(
                                this.$t("configurationTemplate.goDeleteText4") +
                                    ":" +
                                    res.msg
                            );
                        }
                        this.search();
                    });
                })
                .catch(() => {});
        },
        handleTabClick() {
            this.params.currentPage = 1;
            this.searchForm.deviceModelCode = "";
            if (
                this.$route.path === "/maintenanceCenter/configurationTemplate"
            ) {
                this.$store.dispatch("SetCondtion", this.searchForm);
                this.$store.dispatch("SetTabName", this.config);
            }
            this.search();
            this.clearSelection();
            this.selection = [];
        },
        /*获取固件信息列表*/
        hikDevParamTempPage(params) {
            this.searchLoading = true;
            this.$api
                .hikDevParamTempPage(params)
                .then((res) => {
                    if (res.success == true) {
                        this.tableData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableData;
                        this.total = res.data.totalRecords;
                        this.searchLoading = false;
                        this.$nextTick(() => {
                            this.setTableHeight();
                        });
                    } else {
                        this.$message.error(res.msg);
                        this.searchLoading = false;
                    }
                })
                .catch((err) => {
                    this.searchLoading = false;
                });

            // let this_ = this;
            // let promise = new Promise((resolve,reject) =>{
            //     this_.$api.hikDevParamTempPage(params).then((res)=>{
            //         if(res.success == true){
            //           resolve(res.data);
            //         }else{
            //           reject(res.msg);
            //         }
            //      })
            //   })
            //   .then(function onFulfilled(data){
            //       this_.tableData = data.results;
            //       this_.total = data.totalRecords;
            //       this_.searchLoading = false;
            //   }).catch(function onRejected(error){
            //     this_.$message.error('查询固件信息列表失败:' + error);
            //     return false;
            //   })
        },
        // 表格查询
        search() {
            if (
                this.$route.path === "/maintenanceCenter/configurationTemplate"
            ) {
                this.$store.dispatch("SetCondtion", this.searchForm);
            }

            let params = Object.assign(this.params, this.searchForm, {
                templateType: this.config == "protocol" ? 1 : 2,
            });
            this.hikDevParamTempPage(params);
        },
        // 获取设备型号下拉列表数据
        getDeviceModelList() {
            this.$api.getProductList_upgrade().then((res) => {
                if (res.success == true) {
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
                    this.$message.error(res.msg);
                }
            });
        },
        handleReset() {
            this.searchForm.deviceModelCode = "";
            // this.$refs.searchForm.resetFields();
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.search();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.search();
        },
        downLoad(param) {
            let templateContent = param.templateContent;
            let url = JSON.parse(templateContent).url;
            if (url.indexOf("ftp") != -1) {
                window.open(url);
            } else {
                let fileKey = JSON.parse(templateContent).fileKey;
                let dealForm = { fileKey: fileKey };
                //获取下载url,不可直接取页面url,防止url过期
                this.$api.getBinFileDownloadUrl(dealForm).then((res) => {
                    if (res.success == true) {
                        let downloadUrl = res.data;
                        var iframe = document.createElement("iframe");
                        iframe.src = downloadUrl;
                        iframe.style.display = "none";
                        document.body.appendChild(iframe);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            }
        },
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
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                (this.$refs.searchBox.clientHeight || 0) -
                (this.$refs.searchAlert.clientHeight || 0) -
                (this.$refs.searchPagination.clientHeight || 0) -
                166;
        },
        //关闭提示文案
        closeAlert() {
            this.closeFlag = true;
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        // 多选事件
        onSelectionChange(selection) {
            this.selection = selection;
        },
        batchDelete() {
            this.$confirm(
                this.$t("configurationTemplate.goDeleteText1"), //"模板删除后将无法恢复",
                this.$t("configurationTemplate.goDeleteText5"), //"确定要批量删除选中模板吗？",
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    let params = {
                        ids: this.selection.reduce((prev, cur) => {
                            return prev.concat(cur.id);
                        }, []),
                    };
                    this.$api.hikDevParamTempDelete(params).then((res) => {
                        if (res.success == true) {
                            // 模板已批量删除成功
                            this.$message.success(
                                this.$t("configurationTemplate.goDeleteText6")
                            );
                        } else {
                            this.$message.error(res.msg);
                        }
                        this.search();
                    });
                })
                .catch(() => {});
        },
        clearSelection() {
            this.$refs.table1.clearSelection();
            this.$refs.table2.clearSelection();
        },
    },
    mounted() {
        const that = this;
        this.getDictionList();
        window.addEventListener("resize", this.setTableHeight);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.setTableHeight);
    },
    created() {
        if (this.$route.path === "/maintenanceCenter/configurationTemplate") {
            this.searchForm = this.$store.state.tree.searchForm
                ? this.$store.state.tree.searchForm
                : this.searchForm;
            if (this.$store.state.tree.tabName) {
                this.config = this.$store.state.tree.tabName;
            } else {
                this.config = this.$route.query.config
                    ? this.$route.query.config
                    : "protocol";
            }
        } else {
            this.config = this.$route.query.config
                ? this.$route.query.config
                : "protocol";
        }
        this.search();
        this.getDeviceModelList();
    },
};
</script>

<style lang="less" scoped>
/deep/.el-tabs {
    .el-tabs__header {
        margin: 0 0 12px !important;
    }
}
.wrap {
    height: 100%;
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .el-form-item {
            margin-bottom: 0px !important;
        }
    }
    .wrap-bottom {
        border-top: 1px solid #e4e4e4 !important;
    }
}
.status-box {
    display: flex;
    align-items: center;
    white-space: nowrap;
    span {
        display: flex;
        align-items: center;
        span {
            display: inline-block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 120px;
        }
    }
    i {
        display: block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 8px;
    }
    .status-0 {
        background: #cccccc;
    }
    .status-1 {
        background: #ff952c;
    }
    .status-2 {
        background: #ff7777;
    }
    .status-3 {
        background: #77ca67;
    }
}
</style>
