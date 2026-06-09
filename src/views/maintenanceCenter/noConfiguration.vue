<template>
    <div>
        <el-row>
            <!-- 左边树 -->
            <el-col :span="4" class="p-a b-r">
                <div class="screenNode">
                    <span class="screenTitle">
                        <!-- 仅看有配置任务组织 -->
                        {{
                            $t(
                                "ttsConfiguration.onlySeeConfiguredTaskOrganization"
                            )
                        }}
                    </span>
                    <!-- 数据加载中,请稍后... -->
                    <el-tooltip
                        class="item"
                        :content="$t('ttsConfiguration.dataLoading') + '...'"
                        placement="top-start"
                        v-show="!okTree"
                    >
                        <el-switch
                            @change="getScreenData"
                            v-model="screenTerm"
                            size="mini"
                            disabled
                        ></el-switch>
                    </el-tooltip>
                    <el-switch
                        v-show="okTree"
                        @change="getScreenData"
                        v-model="screenTerm"
                        size="mini"
                        :disabled="!params.organizeId"
                    ></el-switch>
                </div>
                <div class="one" v-show="!screenTerm">
                    <el-input
                        class="m-t"
                        v-model="organizationName"
                        :placeholder="$t('common.inputOrganizationName')"
                        clearable
                    >
                        <i
                            slot="suffix"
                            @click="filterTree"
                            class="el-input__icon el-icon-search"
                        ></i>
                    </el-input>
                    <div :class="{ loading_: searchLoading }">
                        <el-tree
                            class="m-t"
                            ref="tree"
                            :data="treeData"
                            :default-expanded-keys="expandedList"
                            @node-click="handleNodeClick"
                            default-icon="el-icon-folder"
                            highlight-current
                            node-key="id"
                            :filter-node-method="filterNode"
                            :props="defaultProps"
                            :current-node-key="params.organizeId"
                            :style="{ height: treeHeight + 'px' }"
                            slot="reference"
                            :expand-on-click-node="false"
                        ></el-tree>
                    </div>
                </div>
                <div class="two" v-show="screenTerm && okTree">
                    <el-input
                        class="m-t"
                        v-model="organizationName1"
                        :placeholder="$t('common.inputOrganizationName')"
                        clearable
                    >
                        <i
                            slot="suffix"
                            @click="filterTree1"
                            class="el-input__icon el-icon-search"
                        ></i>
                    </el-input>
                    <div :class="{ loading_: searchLoading }">
                        <el-tree
                            class="m-t"
                            ref="tree1"
                            :data="treeData1"
                            :default-expanded-keys="expandedList1"
                            @node-click="handleNodeClick"
                            default-icon="el-icon-folder"
                            highlight-current
                            node-key="id"
                            :filter-node-method="filterNode1"
                            :props="defaultProps"
                            :current-node-key="params.organizeId"
                            :style="{ height: treeHeight + 'px' }"
                            slot="reference"
                        >
                            <span slot-scope="{ node, data }">
                                <i class="el-icon-s-flag"></i>
                                <span class="tree-node-span">{{
                                    node.label
                                }}</span>
                            </span>
                        </el-tree>
                    </div>
                </div>
            </el-col>
            <el-col :span="20">
                <div class="wrap">
                    <div class="title p-t p-x-md">
                        <div
                            class="text-lg"
                            style="display: flex; align-items: center"
                        >
                            <span>
                                <!-- 未完成配置 -->
                                {{
                                    $t(
                                        "ttsConfiguration.batchImportIncompleteConfiguration"
                                    )
                                }}
                            </span>
                            <i
                                class="el-icon-warning"
                                style="
                                    color: #409eff;
                                    font-size: 16px;
                                    margin-left: 24px;
                                "
                            ></i>
                            <span class="text-sm">
                                <!-- 展示设备最后一次配置未成功结果 -->
                                {{
                                    $t(
                                        "ttsConfiguration.lastUnsuccessfulConfiguration"
                                    )
                                }}
                            </span>
                        </div>
                    </div>
                    <div class="search-module" ref="searchBox">
                        <div
                            class="search-form-content"
                            :class="{ hidden: !buttonClick }"
                            ref="wrap"
                        >
                            <el-form
                                inline
                                ref="searchForm"
                                :model="searchForm"
                            >
                                <el-form-item
                                    :label="$t('common.keywords')"
                                    prop="deviceCode"
                                >
                                    <G-DeviceSearch
                                        :valueKey="'deviceCode'"
                                        :value.sync="searchForm.deviceCode"
                                        :organizeId="params.organizeId"
                                    ></G-DeviceSearch>
                                </el-form-item>
                                <!-- 创建时间段 -->
                                <el-form-item
                                    prop="operationTime"
                                    :label="
                                        $t('ttsConfiguration.createTimePeriod')
                                    "
                                >
                                    <el-date-picker
                                        :default-time="['00:00:00', '23:59:59']"
                                        size="small"
                                        v-model="searchForm.operationTime"
                                        type="datetimerange"
                                        :start-placeholder="
                                            $t('common.startTime')
                                        "
                                        :end-placeholder="$t('common.endTime')"
                                        transfer
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        clearable
                                    ></el-date-picker>
                                </el-form-item>
                                <!-- 配置结果 -->
                                <el-form-item
                                    prop="status"
                                    :label="
                                        $t(
                                            'ttsConfiguration.configurationResult'
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
                                                $t(
                                                    'deviceHealthCondition.other'
                                                )
                                            "
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
                    <!-- 配置下发任务-按设备查看 -->
                    <div class="p-x-md m-b">
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
                            @sort-change="handleSortChange"
                        >
                            <!-- 创建时间 -->
                            <el-table-column
                                prop="createTime"
                                :label="$t('cardSwapRecord.createTime')"
                                sortable="custom"
                                fixed
                                min-width="160px"
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
                            <!-- 操作人员 -->
                            <el-table-column
                                prop="createName"
                                :label="$t('operationLog.operator')"
                                min-width="120px"
                            ></el-table-column>
                            <!-- 配置类型 -->
                            <el-table-column
                                prop="cmd"
                                :label="
                                    $t('deviceConfiguration.configurationType')
                                "
                                min-width="240px"
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
                                sortable="custom"
                                :label="
                                    $t('ttsConfiguration.progressUpdateTime')
                                "
                                min-width="160px"
                            ></el-table-column>
                            <!-- 配置结果 -->
                            <el-table-column
                                prop="result"
                                :label="
                                    $t('ttsConfiguration.configurationResult')
                                "
                                min-width="160px"
                                fixed="right"
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
                                show-overflow-tooltip
                                prop="failReason"
                                :label="
                                    $t('plateNumAndDeviceCode.failureReason')
                                "
                                min-width="160px"
                                fixed="right"
                            ></el-table-column>
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
    </div>
</template>

<script>
export default {
    name: "noConfiguration",
    components: {},
    data() {
        return {
            organizationName: "",
            organizationName1: "",
            screenTerm: false,
            okTree: false,
            searchLoading: true,
            orderBy: "", //排序
            expandedList: [],
            expandedList1: [],
            treeHeight: 500,
            tableHeight: 500,
            buttonClick: false, //按钮重叠
            iconShow: false,
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
                type: "1",
                status: "",
                plateNum: "",
                operationTime: [],
                productKey: "",
                deviceSerialNum: "",
                deviceCode: "",
            },
            treeData: [],
            treeData1: [],
            paramLogResultStatistics: {
                totalNum: "", // 总数
                successNum: "", // 成功数
                failNum: "", // 失败数
                stopNum: "", // 终止数
                ingNum: "", // 进行中数
            },
            tableData: [],
            total: 0,
            params: {
                type: "1",
                currentPage: 1, // 页码，从1开始
                pageSize: 20, // 分页大小
                organizeId: null,
                orderColumn: "", //排序列
                orderDir: "",
            },
            defaultProps: {
                children: "children",
                label: "name",
                icon: (data, node) => {
                    if (data.unFinishCount > 0) {
                        data.icon = "el-icon-s-flag";
                    }
                    return data.icon;
                },
            },
        };
    },
    watch: {
        organizationName(val) {
            this.filterTree(this.treeData, val, 0);
            this.$nextTick(() => {
                this.$refs.tree.filter("show", !this.organizationName);
                if (!val) {
                    const nodes = this.$refs.tree.store._getAllNodes();
                    nodes.forEach((item) => {
                        if (item.data.id !== this.treeData[0].id) {
                            item.expanded = false;
                        }
                    });
                }
            });
        },
        organizationName1(val) {
            this.$refs.tree1.filter([val, this.screenTerm]);
        },
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
        filterTree(data, val, type) {
            data.forEach((item) => {
                if (item.name.indexOf(val) !== -1) {
                    // item.show = true;
                    this.$set(item, "show", true);
                    this.itemChildren(item);
                } else {
                    this.$set(item, "show", false);
                    if (item.children.length > 0) {
                        this.filterTree(item.children, val, 1);
                    }
                }
            });
        },
        itemChildren(val) {
            if (val.children.length > 0) {
                val.children.forEach((item) => {
                    item.show = true;
                    if (item.children.length > 0) {
                        this.itemChildren(item);
                    }
                });
            }
        },
        filterTree1(data, val, type) {
            data.forEach((item) => {
                if (item.name.indexOf(val) !== -1) {
                    // item.show = true;
                    this.$set(item, "show", true);
                    if (item.children) {
                        this.itemChildren1(item);
                    }
                } else {
                    this.$set(item, "show", false);
                    if (item.children) {
                        if (item.children.length > 0) {
                            this.filterTree1(item.children, val, 1);
                        }
                    }
                }
            });
        },
        itemChildren1(val) {
            if (val.children) {
                if (val.children.length > 0) {
                    val.children.forEach((item) => {
                        item.show = true;
                        if (item.children) {
                            if (item.children.length > 0) {
                                this.itemChildren1(item);
                            }
                        }
                    });
                }
            }
        },
        filterNode(value, data) {
            return data[value];
        },
        filterNode1(value, data) {
            // console.log(value)
            // console.log(data)
            // return data[value];
            if (!value[0] && !value[1]) {
                return true;
            } else if (!value[0] && value[1]) {
                return data.unFinishCount > 0;
            } else if (value[0] && !value[1]) {
                return data.name.indexOf(value[0]) !== -1;
            } else {
                return (
                    data.name.indexOf(value[0]) !== -1 && data.unFinishCount > 0
                );
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

        // 筛选组织树
        getScreenData() {
            // this.organizationName = ''
            // this.organizationName1 = ''
            // this.getTableData()
            // this.$refs.tree.filter([this.organizationName,this.screenTerm]);
            // if(this.screenTerm) {
            //   console.log("选择了")
            //     this.treeData = []
            //     this.getOrganizeTreeWithParamData();
            //   }  else{
            //     this.treeData = []
            //     this.getOrgTree()
            //   }
            // this.getOrganizeTreeWithParamData();
            this.organizationName = "";
            this.organizationName1 = "";
            if (this.screenTerm) {
                this.$refs.tree1.filter([
                    this.organizationName1,
                    this.screenTerm,
                ]);
                this.params.organizeId = this.treeData1[0].id;
                // this.$store.dispatch(
                //     "SetShowDeviceManageId",
                //     this.params.organizeId
                // );
                this.$refs["tree1"].setCurrentKey(this.params.organizeId);
                this.getTableData();
            } else {
                this.params.organizeId = this.treeData[0].id;
                // this.$store.dispatch(
                //     "SetShowDeviceManageId",
                //     this.params.organizeId
                // );
                this.$refs["tree"].setCurrentKey(this.params.organizeId);
                this.getTableData();
            }
        },
        // 获取设备配置组织树
        getDeviceUpgradOrgTeeData() {
            this.searchLoading = true;
            const param = {};
            param.valid = true;
            param.type = 1;
            this.$api.getOrganizeTreeWithParamData(param).then((res) => {
                if (res.success == true) {
                    this.treeData1 = res.data.treeData;
                    this.expandedList1 = res.data.expandedList;
                    // this.$refs.tree1.filter();
                    this.$nextTick(() => {
                        this.okTree = true;
                    });

                    if (this.treeData1.length > 0) {
                        // this.params.organizeId = this.$store.state.tree.showDeviceManageId ? this.$store.state.tree.showDeviceManageId : this.treeData1[0].id;
                        // this.searchForm= this.$store.state.tree.showSearchForm ? this.$store.state.tree.showSearchForm : this.searchForm;
                        this.params.organizeId = this.treeData1[0].id;
                        // this.searchForm = this.searchForm;
                        // this.getTableData()
                        // this.getParamLogResultStatistics();
                        // this.getDeviceModelList()
                    } else {
                        this.tableData = [];
                        this.searchLoading = false;
                        this.tableData = [];
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },

        // 获取组织树
        getOrgTree(type) {
            this.$api.deviceGetOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = JSON.parse(JSON.stringify(res.data));
                    if (this.treeData.length > 0) {
                        // this.params.organizeId = this.$store.state.tree
                        //     .showDeviceManageId
                        //     ? this.$store.state.tree.showDeviceManageId
                        //     : this.treeData[0].id;
                        // this.searchForm = this.$store.state.tree.showSearchForm
                        //     ? this.$store.state.tree.showSearchForm
                        //     : this.searchForm;
                        this.params.organizeId = this.treeData[0].id;
                        this.$nextTick(() => {
                            this.treeData.forEach((m) => {
                                this.expandedList.push(m.id);
                            });
                        });
                        this.getTableData();
                        if (type) {
                            this.filterTree(
                                this.treeData,
                                this.organizationName,
                                0
                            );
                            this.$nextTick(() => {
                                this.$refs.tree.filter(
                                    "show",
                                    !this.organizationName
                                );
                            });
                        }
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //  getOrgTree(type) {
        //         this.$api.deviceGetOrgTree().then((res) => {
        //             if (res.success == true) {
        //                 this.treeData = JSON.parse(JSON.stringify(res.data));
        //                 if(this.treeData.length>0) {
        //                       this.params.organizeId = this.$store.state.tree.showDeviceManageId ? this.$store.state.tree.showDeviceManageId : this.treeData[0].id;
        //                       console.log(this.$store.state.tree.showSearchForm)
        //                       this.searchForm = this.$store.state.tree.showSearchForm ? this.$store.state.tree.showSearchForm : this.searchForm;
        //                       this.$nextTick(() => {
        //                         this.treeData.forEach(m => {
        //                           console.log('m.children', m.id)
        //                           this.expandedList.push(m.id)
        //                         })
        //                       });
        //                       this.getTableData()
        //                     }
        //                 } else {
        //                     this.$message.error('获取组织树失败:' + res.msg);
        //                 }
        //         })
        //     },
        handleNodeClick(data) {
            this.params.organizeId = data.id;
            this.$store.dispatch("showDeviceManageId", data.id);
            this.params.currentPage = 1;
            this.getTableData();
        },

        // 获取table数据
        getTableData() {
            if (!this.params.organizeId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            this.searchLoading = true;
            const params = Object.assign({}, this.params, this.searchForm);
            if (
                this.searchForm &&
                this.searchForm.operationTime &&
                this.searchForm.operationTime.length > 0
            ) {
                params.beginTime = this.searchForm.operationTime[0];
                params.endTime = this.searchForm.operationTime[1];
            } else {
                params.beginTime = "";
                params.endTime = "";
            }

            this.$store.dispatch("SetShowSearchForm", this.searchForm);
            // 配置下发任务-按任务查看
            this.$api
                .getConfigParamLatest(params)
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
                        this.searchLoading = false;
                    } else {
                        this.$message.error(res.msg);
                        this.searchLoading = false;
                    }
                    this.$api.eventTrackTrigger({
                        menu: "DEVICE_CONFIGURATION",
                        business: "DEVICE_CONFIG_UNFINISH_INFO",
                        eventResult: res.success,
                    });
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        setTableHeight() {
            this.tableHeight = this.buttonClick
                ? document.body.clientHeight - 306
                : document.body.clientHeight - 260;
            this.treeHeight = document.body.clientHeight - 200;
        },
        //查询重置
        handleClick() {
            this.buttonClick = !this.buttonClick;
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        setWrap() {
            let scrollHeight = this.$refs.wrap.scrollHeight;
            if (this.$refs.wrap.scrollHeight > 80) {
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
                this.setWrap();
            })();
    },
    created() {
        this.setTableHeight();
        this.getDeviceUpgradOrgTeeData();
        this.getOrgTree();
    },
};
</script>

<style lang="less" scoped>
.loading_ {
    pointer-events: none;
}
.marginBottom {
    margin-bottom: 0.5rem;
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
.wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .flex {
            display: flex;
            margin-top: 26px;
        }
    }
    .hidden {
        height: 46px;
        overflow: hidden;
    }
}
// .search {
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   .el-form-item {
//     margin-bottom: 20px;
//   }
//   .marginBottom {
//     margin-bottom: 1.5rem !important;
//   }
// }
.wrap-bottom {
    border-top: 1px solid #e4e4e4;
}
</style>
