<template>
    <div>
        <el-row>
            <!-- 左边树 -->
            <el-col :span="4" class="p-a b-r">
                <div :class="{ loading_: searchLoading }">
                    <!-- <div class="screenNode">
            <span class="screenTitle">仅看有配置任务组织</span>
            <el-switch @change="getOrganizeTreeWithParamData"
                       v-model="screenTerm"
                       size="mini"></el-switch>
          </div> -->
                    <el-tree
                        ref="tree"
                        :data="treeData"
                        :default-expanded-keys="expandedList"
                        @node-click="handleNodeClick"
                        default-icon="el-icon-folder"
                        :filter-node-method="filterNode"
                        highlight-current
                        node-key="id"
                        :props="defaultProps"
                        :current-node-key="params.organizeId"
                        :style="{ height: treeHeight + 'px' }"
                    ></el-tree>
                </div>
            </el-col>
            <el-col :span="20">
                <div class="wrap">
                    <div class="title p-x-md p-y">
                        <div class="text-md">
                            <span>配置任务</span>
                        </div>
                    </div>
                    <div class="p-x-md m-b">
                        <div class="search">
                            <div>
                                <el-form
                                    inline
                                    label-position="top"
                                    ref="searchForm"
                                    :model="searchForm"
                                >
                                    <el-form-item
                                        prop="status"
                                        label="配置结果"
                                        v-show="searchWay == 1"
                                    >
                                        <el-select
                                            v-model="searchForm.status"
                                            clearable
                                        >
                                            <el-option
                                                v-for="item in statusList"
                                                :label="item.label"
                                                :value="item.value"
                                                :key="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item
                                        prop="plateNum"
                                        label="车牌号"
                                        v-show="searchWay == 1"
                                    >
                                        <el-input
                                            v-model="searchForm.plateNum"
                                            placeholder="请输入"
                                            clearable
                                        ></el-input>
                                    </el-form-item>
                                    <el-form-item
                                        prop="operationTime"
                                        label="操作时间"
                                    >
                                        <el-date-picker
                                            :default-time="[
                                                '00:00:00',
                                                '23:59:59',
                                            ]"
                                            size="small"
                                            v-model="searchForm.operationTime"
                                            type="datetimerange"
                                            placeholder="请选择"
                                            transfer
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            clearable
                                        ></el-date-picker>
                                    </el-form-item>
                                </el-form>
                                <el-button
                                    @click="goExport"
                                    v-show="searchWay == 1"
                                    :loading="loadingAll"
                                    :disabled="loadingAll"
                                    >导出</el-button
                                >
                                <el-button
                                    @click="goExport"
                                    v-show="searchWay == 2"
                                    :loading="loadingAll2"
                                    :disabled="loadingAll2"
                                    >导出</el-button
                                >
                            </div>
                            <div class="m-t p-t">
                                <el-button
                                    type="primary"
                                    :disabled="searchLoading"
                                    :loading="searchLoading"
                                    @click="
                                        params.currentPage = 1;
                                        getTableData();
                                    "
                                    >查询</el-button
                                >
                                <el-button
                                    type="default"
                                    @click="handleReset($refs.searchForm)"
                                    >清除条件</el-button
                                >
                                <div class="m-t-md m-b-md">
                                    <el-radio-group
                                        v-model="searchWay"
                                        @change="changeSearchWay"
                                    >
                                        <el-radio-button
                                            :disabled="searchLoading"
                                            label="1"
                                            >按设备查看</el-radio-button
                                        >
                                        <el-radio-button
                                            :disabled="searchLoading"
                                            label="2"
                                            >按任务查看</el-radio-button
                                        >
                                    </el-radio-group>
                                </div>
                            </div>
                        </div>
                        <!-- 配置下发任务-按设备查看 -->
                        <el-table
                            v-loading="searchLoading"
                            :element-loading-text="
                                $t('common.desperatelyLoading')
                            "
                            element-loading-color="#007213"
                            :data="tableData"
                            v-show="searchWay === '1'"
                            :height="tableHeight"
                            stripe
                        >
                            <el-table-column
                                prop="plateNum"
                                label="车牌号"
                                min-width="100px"
                            ></el-table-column>
                            <el-table-column
                                prop="organizeName"
                                label="所属组织"
                                min-width="100px"
                            ></el-table-column>
                            <el-table-column
                                prop="deviceCode"
                                label="终端手机号"
                                min-width="120px"
                            ></el-table-column>
                            <el-table-column
                                prop="updateTime"
                                label="操作时间"
                                min-width="160px"
                            ></el-table-column>
                            <el-table-column
                                prop="createName"
                                label="操作人员"
                                min-width="120px"
                            ></el-table-column>
                            <el-table-column
                                prop="configTitle"
                                label="配置主题"
                                min-width="120px"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="params"
                                label="配置内容"
                                min-width="240px"
                            >
                                <template slot-scope="scope">
                                    <el-popover
                                        placement="top"
                                        :open-delay="300"
                                        trigger="hover"
                                    >
                                        <span>{{ scope.row.params }}</span>
                                        <span slot="reference">{{
                                            scope.row.params
                                        }}</span>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="result"
                                label="配置结果"
                                min-width="160px"
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
                        </el-table>
                        <!-- 配置下发任务-按任务查看 -->
                        <el-table
                            v-loading="searchLoading"
                            :element-loading-text="
                                $t('common.desperatelyLoading')
                            "
                            element-loading-color="#007213"
                            :data="tableData"
                            v-show="searchWay === '2'"
                            :height="tableHeight"
                            border
                            stripe
                        >
                            <!-- <el-table-column prop="batchCode" label="批次号" fixed min-width="160px"></el-table-column> -->
                            <el-table-column
                                prop="configTitle"
                                label="标题"
                                min-width="120px"
                            ></el-table-column>
                            <el-table-column
                                prop="params"
                                label="配置内容"
                                min-width="240px"
                            >
                                <template slot-scope="scope">
                                    <el-popover
                                        placement="top"
                                        :open-delay="300"
                                        trigger="hover"
                                    >
                                        <span>{{ scope.row.params }}</span>
                                        <span slot="reference">{{
                                            scope.row.params
                                        }}</span>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="configProperty"
                                label="发布属性"
                                min-width="200px"
                            >
                                <template slot-scope="scope">
                                    {{ scope.row.configPropertyString || "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="updateTime"
                                label="操作时间"
                                min-width="160px"
                            ></el-table-column>
                            <el-table-column
                                label="成功/进行中/失败"
                                min-width="160px"
                            >
                                <template slot-scope="scope">
                                    {{
                                        `${scope.row.successNum}/${scope.row.ingNum}/${scope.row.failNum}`
                                    }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="createName"
                                label="操作人员"
                                min-width="100px"
                            ></el-table-column>
                            <el-table-column
                                label="操作"
                                fixed="right"
                                width="80px"
                            >
                                <template slot-scope="scope" width="100px">
                                    <a @click="taskDetail(scope.row.batchCode)"
                                        >详情</a
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div v-show="searchWay === '1'" class="p-x-md wrap-bottom">
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
                    <div v-show="searchWay === '2'" class="p-x-md wrap-bottom">
                        <el-pagination
                            :current-page="params2.currentPage"
                            @size-change="handleSizeChange2"
                            @current-change="handleCurrentChange2"
                            :page-sizes="[20, 50, 100]"
                            :page-size="params2.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total2"
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
    name: "configurationView",
    components: {},
    data() {
        return {
            screenTerm: false,
            searchLoading: true,
            expandedList: [],
            tableHeight: 500,
            treeHeight: 500,
            reconfigurationVisible: false,
            abortConfigurationVisible: false,
            searchWay: "",
            activeName: "first",
            statusList: [
                { value: "-5", label: "设备版本号不一致" },
                { value: "-4", label: "配置文件版本号不一致" },
                { value: "-3", label: "型号不一致" },
                { value: "-2", label: "命令被覆盖" },
                { value: "1", label: "成功" },
                { value: "2", label: "失败" },
                { value: "3", label: "命令未发送" },
                { value: "4", label: "命令已发送" },
                { value: "5", label: "配置文件下载完成" },
                { value: "6", label: "设备重启中" },
                { value: "7", label: "设备离线，等待下发命令" },
                { value: "8", label: "命令下发失败" },
                { value: "9", label: "手动终止任务" },
            ],
            configStatusList: {
                "-5": { name: "设备版本号不一致", color: "text-warning" },
                "-4": { name: "配置文件版本号不一致", color: "text-warning" },
                "-3": { name: "型号不一致", color: "text-warning" },
                "-2": { name: "命令被覆盖", color: "text-warning" },
                1: { name: "成功", color: "text-success" },
                2: { name: "失败", color: "text-error" },
                3: { name: "命令未发送", color: "text-warning" },
                4: { name: "命令已发送", color: "text-warning" },
                5: { name: "配置文件下载完成", color: "text-warning" },
                6: { name: "设备重启中", color: "text-warning" },
                7: { name: "设备离线，等待下发命令", color: "text-warning" },
                8: { name: "命令下发失败", color: "text-warning" },
                9: { name: "手动终止任务", color: "text-warning" },
            },
            cmdList: {
                1: "文件配置获取",
                2: "文件配置下发--HTTP协议",
                3: "HTTP终端配置参数查询",
                4: "TTS文本下发",
                5: "文件配置下发--部标协议",
                6: "协议配置--- 协议配置参数下发",
                7: "协议配置 --- 协议配置参数获取",
                8: "私有协议下发",
                9: "文件模板配置下发",
                10: "协议模板配置下发",
            },
            loadingAll: false,
            loadingAll2: false,
            searchForm: {
                status: "",
                plateNum: "",
                operationTime: [],
                beginTime: "",
                endTime: "",
            },
            ttsContent: {
                URGENCY: "紧急",
                DISPLAY: "终端显示屏显示",
                READ: "终端TTS播读",
                ADVERT: "广告屏显示",
                CAN: "CAN故障码信息",
            },
            deviceModelList: [],
            treeData: [],
            tableData: [],
            total: 0,
            total2: 0,
            params: {
                currentPage: 1, // 页码，从1开始
                pageSize: 20, // 分页大小
                organizeId: null,
            },
            params2: {
                currentPage: 1, // 页码，从1开始
                pageSize: 20, // 分页大小
                organizeId: null,
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
    methods: {
        // 终止配置
        stopConfig(batchNo, logId, plateNum, deviceCode) {
            let confirmText = "";
            if (plateNum) {
                confirmText = `此操作将会终止配置终端手机号为“${deviceCode}”的“${plateNum}”的配置，是否确认终止配置?`;
            } else {
                confirmText = `此操作将会终止配置终端手机号为“${deviceCode}”的配置，是否确认终止配置?`;
            }
            this.$confirm(confirmText, {
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
                        } else {
                            this.$message.error("设备终止配置失败:" + res.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        // 重新配置
        startConfig(batchNo, logId, plateNum, deviceCode, cmd) {
            let confirmText = "";
            if (plateNum) {
                confirmText = `此操作将会重新配置终端手机号为“${deviceCode}”的“${plateNum}”的配置，是否确认重新配置?`;
            } else {
                confirmText = `此操作将会重新配置终端手机号为“${deviceCode}”的配置，是否确认重新配置?`;
            }
            this.$confirm(confirmText, {
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
                            } else {
                                this.$message.error(
                                    "设备重新配置失败:" + res.msg
                                );
                            }
                        });
                })
                .catch(() => {});
        },
        filterNode(value, data) {
            if (value) {
                return data.icon == "el-icon-s-flag";
            } else {
                return true;
            }
        },
        taskDetail(batchCode) {
            this.$router.push({
                path: "/equipmentOperation/ttsConfiguration/ttsConfigurationView/ttsConfigurationTaskDetail",
                query: { batchCode, organizeId: this.params.organizeId },
            });
        },
        goExport() {
            let params = {};
            params = JSON.parse(JSON.stringify(this.searchForm));
            params.organizeId = this.params.organizeId;
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
            if (this.searchWay == 1) {
                if (this.total > 50000) {
                    this.$message.error(this.$t("common.unableEport50000"));
                } else {
                    this.loadingAll = true;
                    this.$api
                        .exportTTSDeviceParamLogResult(params)
                        .then((res) => {
                            if (res.success == true) {
                                const fileName = res.data.fileName;
                                const _this = this;
                                _this.getExportResultInterval =
                                    window.setInterval(() => {
                                        _this.$api
                                            .isExportFinished(fileName)
                                            .then((res1) => {
                                                if (
                                                    res1.success == true &&
                                                    res1.data == true
                                                ) {
                                                    const iframe =
                                                        document.createElement(
                                                            "iframe"
                                                        );
                                                    iframe.src =
                                                        (process.env.BASE_API ==
                                                        "/"
                                                            ? ""
                                                            : process.env
                                                                  .BASE_API) +
                                                        "/excel?fileName=" +
                                                        fileName;
                                                    iframe.style.display =
                                                        "none";
                                                    document.body.appendChild(
                                                        iframe
                                                    );
                                                    window.clearInterval(
                                                        _this.getExportResultInterval
                                                    );
                                                    _this.getExportResultInterval =
                                                        "";
                                                    _this.loadingAll = false;
                                                }
                                            });
                                    }, 2000);
                            } else {
                                this.$message.error(
                                this.$t("common.exportFailed") + ":" +res.msg
                            );
                                this.loadingAll = false;
                            }
                        });
                }
            } else {
                if (this.total2 > 50000) {
                    this.$message.error(this.$t("common.unableEport50000"));
                } else {
                    this.loadingAll2 = true;
                    this.$api.exportTTSBatchInfo(params).then((res) => {
                        if (res.success == true) {
                            const fileName = res.data.fileName;
                            const _this = this;
                            _this.getExportResultInterval_ = window.setInterval(
                                () => {
                                    _this.$api
                                        .isExportFinished(fileName)
                                        .then((res1) => {
                                            if (
                                                res1.success == true &&
                                                res1.data == true
                                            ) {
                                                const iframe =
                                                    document.createElement(
                                                        "iframe"
                                                    );
                                                iframe.src =
                                                    (process.env.BASE_API == "/"
                                                        ? ""
                                                        : process.env
                                                              .BASE_API) +
                                                    "/excel?fileName=" +
                                                    fileName;
                                                iframe.style.display = "none";
                                                document.body.appendChild(
                                                    iframe
                                                );
                                                window.clearInterval(
                                                    _this.getExportResultInterval_
                                                );
                                                _this.getExportResultInterval_ =
                                                    "";
                                                _this.loadingAll2 = false;
                                            }
                                        });
                                },
                                2000
                            );
                        } else {
                            this.$message.error(
                                this.$t("common.exportFailed") + ":" +res.msg
                            );
                            this.loadingAll2 = false;
                        }
                    });
                }
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
        handleSizeChange2(val) {
            this.params2.pageSize = val;
            this.getTableData();
        },
        handleCurrentChange2(val) {
            this.params2.currentPage = val;
            this.getTableData();
        },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
            }
        },
        changeSearchWay() {
            this.handleReset(this.$refs.searchForm);

            this.params.currentPage = 1;
            this.params.pageSize = 20;
            this.getTableData();
        },
        // 获取设备型号下拉列表数据
        getDeviceModelList() {
            this.$api.getProductListByOrgId().then((res) => {
                if (res.success == true) {
                    this.deviceModelList = [
                        { fieldNameEN: "", fieldNameCN: "全部" },
                    ];
                    res.data.forEach((item) => {
                        this.deviceModelList.push({
                            fieldNameEN: item,
                            fieldNameCN: item,
                        });
                    });
                } else {
                    this.$message.error("获取设备型号列表失败:" + res.msg);
                }
            });
        },
        // 获取设备配置组织树
        getOrganizeTreeWithParamData() {
            this.searchLoading = true;
            const param = { type: 4 };
            param.valid = this.screenTerm;
            this.$api.getTTSOrganizeTreeWithParamData(param).then((res) => {
                if (res.success == true) {
                    this.treeData = res.data.treeData;
                    this.expandedList = [];
                    if (this.treeData.length > 0) {
                        // this.params.organizeId = this.treeData[0].id;
                        this.params.organizeId = this.$store.state.tree
                            .showDeviceManageId
                            ? this.$store.state.tree.showDeviceManageId
                            : this.treeData[0].id;
                        this.params2.organizeId = this.$store.state.tree
                            .showDeviceManageId
                            ? this.$store.state.tree.showDeviceManageId
                            : this.treeData[0].id;
                        this.searchForm = this.$store.state.tree.showSearchForm
                            ? this.$store.state.tree.showSearchForm
                            : this.searchForm;

                        this.$nextTick(() => {
                            this.treeData.forEach((m) => {
                                this.expandedList.push(m.id);
                            });
                        });
                        this.getTableData();
                        this.getDeviceModelList();
                    } else {
                        this.tableData = [];
                        this.searchLoading = false;
                        this.tableData = [];
                    }
                } else {
                    this.$message.error("获取设备配置组织树失败" + res.msg);
                }
            });
        },
        handleNodeClick(data) {
            this.params.organizeId = data.id;
            this.params2.organizeId = data.id;
            this.$store.dispatch("showDeviceManageId", data.id);
            this.params.currentPage = 1;
            this.getTableData();
            this.getDeviceModelList();
        },
        // 获取table数据
        getTableData() {
            this.searchLoading = true;
            if (
                this.searchForm.operationTime &&
                this.searchForm.operationTime.length > 0
            ) {
                this.searchForm.beginTime = this.searchForm.operationTime[0];
                this.searchForm.endTime = this.searchForm.operationTime[1];
            } else {
                this.searchForm.beginTime = "";
                this.searchForm.endTime = "";
            }
            this.$store.dispatch("SetShowSearchForm", this.searchForm);
            this.$store.dispatch("SetTabName", this.searchWay);
            if (this.searchWay == 1) {
                const params = Object.assign({}, this.params, this.searchForm);
                this.$api
                    .getDeviceTTSParamLogPage(params)
                    .then((res) => {
                        if (res.success == true) {
                            // console.log(res.data.results);
                            this.tableData =
                                (res.data.results.length &&
                                    res.data.totalRecords) ||
                                (!res.data.results.length &&
                                    !res.data.totalRecords)
                                    ? res.data.results
                                    : this.tableData;
                            this.total = res.data.totalRecords;
                        } else {
                            this.$message.error(
                                "获取设备配置信息失败:" + res.msg
                            );
                        }
                        this.searchLoading = false;
                    })
                    .catch((err) => {
                        this.searchLoading = false;
                    });
            } else {
                const param = Object.assign({}, this.params2, this.searchForm);
                this.$api
                    .getTTSParamLogPage(param)
                    .then((res) => {
                        if (res.success == true) {
                            // console.log(res.data.results);
                            if (res.data.results.length) {
                                res.data.results.forEach((item) => {
                                    let ttsArr = [];
                                    if (item.configProperty) {
                                        item.configProperty
                                            .split(",")
                                            .forEach((item_) => {
                                                ttsArr.push(
                                                    this.ttsContent[item_]
                                                );
                                            });
                                        item["configPropertyString"] =
                                            ttsArr.join(",");
                                    } else {
                                        item["configPropertyString"] = "";
                                    }
                                });
                            }
                            console.log(res.data.results);
                            this.tableData =
                                (res.data.results.length &&
                                    res.data.totalRecords) ||
                                (!res.data.results.length &&
                                    !res.data.totalRecords)
                                    ? res.data.results
                                    : this.tableData;
                            this.total2 = res.data.totalRecords;
                        } else {
                            this.$message.error(
                                "获取设备配置信息失败:" + res.msg
                            );
                        }
                        this.searchLoading = false;
                    })
                    .catch((err) => {
                        this.searchLoading = false;
                    });
            }
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 340;
            this.treeHeight = document.body.clientHeight - 140;
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
        if (this.$store.state.tree.tabName) {
            this.searchWay = this.$store.state.tree.tabName;
        } else {
            this.searchWay = this.$route.query.searchWay
                ? this.$route.query.searchWay
                : "1";
        }
        this.setTableHeight();
        this.getOrganizeTreeWithParamData();
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
    .el-form-item {
        margin-bottom: 20px;
    }
    .marginBottom {
        margin-bottom: 1.5rem !important;
    }
}
.wrap-bottom {
    border-top: 1px solid #e4e4e4;
}
</style>
