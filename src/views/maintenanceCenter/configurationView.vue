<template>
    <div>
        <el-row>
            <!-- 左边树 -->
            <el-col :span="4" class="p-a b-r">
                <div :class="{ loading_: searchLoading }">
                    <div class="screenNode">
                        <span class="screenTitle">仅看有配置任务组织</span>
                        <el-switch
                            @change="getScreenData"
                            v-model="screenTerm"
                            size="mini"
                        ></el-switch>
                    </div>
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
                    <div class="title p-x-md p-t">
                        <div class="text-md">
                            <span>配置查看</span>
                        </div>
                        <div class="text-md title-right">
                            <div>
                                <span
                                    >进行中:
                                    {{
                                        paramLogResultStatistics.ingNum || 0
                                    }}</span
                                >
                            </div>
                            <div>
                                <span
                                    >失败:
                                    {{
                                        paramLogResultStatistics.failNum || 0
                                    }}</span
                                >
                            </div>
                        </div>
                    </div>
                    <div class="p-x-md m-b">
                        <el-tabs
                            v-model="searchForm.type"
                            @tab-click="changeWay"
                        >
                            <el-tab-pane
                                :disabled="searchLoading"
                                name="1"
                                label="配置下发任务"
                            ></el-tab-pane>
                            <el-tab-pane
                                :disabled="searchLoading"
                                name="3"
                                label="配置获取任务"
                            ></el-tab-pane>
                            <!-- <el-tab-pane :disabled="searchLoading"
                           name="2"
                           label="TTS文本下发任务"></el-tab-pane> -->
                        </el-tabs>
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
                                        v-if="
                                            (searchForm.type == 1 &&
                                                searchWay == 1) ||
                                            searchForm.type == 3 ||
                                            searchForm.type == 2
                                        "
                                    >
                                        <el-select
                                            v-model="searchForm.status"
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
                                    <el-form-item
                                        prop="plateNum"
                                        label="车牌号"
                                        v-if="
                                            (searchForm.type == 1 &&
                                                searchWay == 1) ||
                                            searchForm.type == 3 ||
                                            searchForm.type == 2
                                        "
                                    >
                                        <el-input
                                            v-model="searchForm.plateNum"
                                            placeholder="请输入"
                                            clearable
                                        ></el-input>
                                    </el-form-item>
                                    <!-- <el-form-item prop="productKey" label="设备型号" v-if="searchForm.type==2">
                                <el-select v-model="searchForm.productKey" placeholder="请选择" clearable>
                                  <el-option v-for="(item, index) in deviceModelList" :key="index" :value="item.fieldNameEN" :label="item.fieldNameCN"></el-option>
                                </el-select>  
                              </el-form-item> -->
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
                                    :class="{
                                        marginBottom: searchForm.type != 1,
                                    }"
                                    v-if="
                                        (searchForm.type == 1 &&
                                            searchWay != 2) ||
                                        searchForm.type == 2 ||
                                        searchForm.type == 3
                                    "
                                    @click="goExport"
                                    :loading="loadingAll"
                                    :disabled="loadingAll"
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
                                        v-if="searchForm.type == 1"
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
                            v-show="
                                searchWay === '1' && searchForm.type === '1'
                            "
                            :height="tableHeight2"
                            stripe
                        >
                            <el-table-column
                                prop="createTime"
                                label="操作时间"
                                fixed
                                min-width="160px"
                            ></el-table-column>
                            <el-table-column
                                prop="plateNum"
                                label="车牌号"
                                min-width="100px"
                            ></el-table-column>
                            <el-table-column
                                prop="deviceSerialNum"
                                label="设备序列号"
                                min-width="120px"
                            ></el-table-column>
                            <el-table-column
                                prop="deviceCode"
                                label="终端手机号"
                                min-width="120px"
                            ></el-table-column>
                            <el-table-column
                                prop="deviceModelCode"
                                label="设备型号"
                                min-width="160px"
                                :show-overflow-tooltip="true"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="protocolName"
                                label="接入协议"
                                min-width="100px"
                                :show-overflow-tooltip="true"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="version"
                                label="设备版本号"
                                min-width="120px"
                            ></el-table-column>
                            <!-- <el-table-column
                                prop="projectCode"
                                label="定制单号"
                                min-width="120px"
                            ></el-table-column> -->
                            <el-table-column
                                prop="createName"
                                label="操作人员"
                                min-width="120px"
                            ></el-table-column>
                            <el-table-column
                                prop="cmd"
                                label="配置类型"
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
                            <el-table-column
                                prop="updateTime"
                                label="进度更新时间"
                                min-width="160px"
                            ></el-table-column>
                            <el-table-column
                                prop="result"
                                :label="
                                    searchForm.type == '3'
                                        ? '获取结果'
                                        : '配置结果'
                                "
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
                            <el-table-column
                                prop="failReason"
                                label="配置结果说明"
                                min-width="200px"
                                fixed="right"
                            ></el-table-column>
                            <el-table-column
                                label="操作"
                                fixed="right"
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
                                        v-show="
                                            scope.row.result == '2' ||
                                            scope.row.result == '7' ||
                                            scope.row.result == '8'
                                        "
                                        v-btn="
                                            'deviceConfigurationFailedDeviceReconfiguration'
                                        "
                                        >重新配置</a
                                    >
                                    <a
                                        @click="
                                            stopConfig(
                                                scope.row.batchCode,
                                                scope.row.id,
                                                scope.row.plateNum,
                                                scope.row.deviceCode
                                            )
                                        "
                                        v-show="
                                            scope.row.result == '3' ||
                                            scope.row.result == '4' ||
                                            scope.row.result == '6'
                                        "
                                        v-btn="
                                            'deviceConfigurationTerminateConfiguration'
                                        "
                                        >终止配置</a
                                    >
                                    <!-- <el-popover
                                    v-show="scope.row.result == '2' || scope.row.result == '7' || scope.row.result == '8'"
                                    :ref="`popover-${scope.$index}`"
                                    trigger="click"
                                    placement="top"
                                    width="300"
                                    v-model="reconfigurationVisible">
                                    <p class="popover-text">此操作将会重新配置批次号“XXXXX”下的所有配置失败设备，是否确认重新配置？</p>
                                    <div style="text-align: right; margin: 0">
                                        <el-button type="link" size="mini" @click="reconfigurationVisible = false">确定</el-button>
                                        <el-button size="mini" type="text" @click="reconfigurationVisible = false">取消</el-button>
                                    </div>
                                    <a slot="reference">重新配置</a>
                                </el-popover>
                                <el-popover
                                   v-show="scope.row.result == '3' || scope.row.result == '4' || scope.row.result == '6'"
                                    :ref="`popover-${scope.$index}`"
                                    trigger="click"
                                    placement="top"
                                    width="160"
                                    v-model="abortConfigurationVisible">
                                    <p class="popover-text">此操作将会终止配置批次号“XXXXX”下的所有未开始配置设备，是否确认终止配置？</p>
                                    <div style="text-align: right; margin: 0">
                                        <el-button type="link" size="mini" @click="abortConfigurationVisible = false">确定</el-button>
                                        <el-button size="mini" type="text" @click="abortConfigurationVisible = false">取消</el-button>
                                    </div>
                                    <a slot="reference">终止配置</a>
                                </el-popover> -->
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
                            v-show="
                                searchWay === '2' && searchForm.type === '1'
                            "
                            :height="tableHeight2"
                            stripe
                        >
                            <!-- <el-table-column prop="batchCode" label="批次号" fixed min-width="160px"></el-table-column> -->
                            <el-table-column
                                prop="fileKey"
                                label="文件名"
                                min-width="160px"
                            ></el-table-column>
                            <el-table-column
                                prop="deviceModelCode"
                                label="设备型号"
                                min-width="160px"
                                :show-overflow-tooltip="true"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="protocolName"
                                label="接入协议"
                                min-width="100px"
                                :show-overflow-tooltip="true"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="createName"
                                label="操作人员"
                                min-width="100px"
                            ></el-table-column>
                            <el-table-column
                                prop="cmd"
                                label="配置类型"
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
                            <el-table-column
                                prop="createTime"
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
                                label="操作"
                                fixed="right"
                                width="80px"
                            >
                                <template slot-scope="scope" width="100px">
                                    <a
                                        @click="
                                            taskDetail(
                                                scope.row.batchCode,
                                                scope.row.cmd
                                            )
                                        "
                                        >详情</a
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- TTS文本下发任务 -->
                        <el-table
                            v-loading="searchLoading"
                            :element-loading-text="
                                $t('common.desperatelyLoading')
                            "
                            element-loading-color="#007213"
                            :data="tableData"
                            v-show="searchForm.type === '2'"
                            :height="tableHeight"
                            stripe
                        >
                            <el-table-column
                                prop="createTime"
                                label="操作时间"
                                min-width="160px"
                            ></el-table-column>
                            <el-table-column
                                prop="plateNum"
                                label="车牌号"
                                min-width="80px"
                            ></el-table-column>
                            <el-table-column
                                prop="organizeName"
                                label="所属组织"
                                min-width="100px"
                            ></el-table-column>
                            <el-table-column
                                prop="deviceCode"
                                label="终端手机号"
                                min-width="100px"
                            ></el-table-column>
                            <el-table-column
                                prop="createName"
                                label="操作人员"
                                min-width="120px"
                            ></el-table-column>
                            <el-table-column
                                prop="configTitle"
                                label="配置主题"
                                min-width="100px"
                            ></el-table-column>
                            <el-table-column
                                prop="params"
                                show-overflow-tooltip
                                label="配置内容"
                                min-width="100px"
                            ></el-table-column>
                            <el-table-column label="配置结果" min-width="160px">
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
                            <!-- <el-table-column prop="result" label="操作" width="120px">
                           <template slot-scope="scope">
                              <a @click="ttsDetail(scope.row.batchCode)">详情</a>
                            </template>
                        </el-table-column> -->
                        </el-table>
                        <!-- 配置获取任务 -->
                        <el-table
                            v-loading="searchLoading"
                            :element-loading-text="
                                $t('common.desperatelyLoading')
                            "
                            element-loading-color="#007213"
                            :data="tableData"
                            v-show="searchForm.type === '3'"
                            :height="tableHeight"
                            stripe
                        >
                            <el-table-column
                                prop="createTime"
                                label="操作时间"
                                min-width="160px"
                            ></el-table-column>
                            <el-table-column
                                prop="plateNum"
                                label="车牌号"
                                min-width="100px"
                            ></el-table-column>
                            <el-table-column
                                prop="deviceSerialNum"
                                label="设备序列号"
                                min-width="120px"
                            ></el-table-column>
                            <el-table-column
                                prop="deviceCode"
                                label="终端手机号"
                                min-width="120px"
                            ></el-table-column>
                            <el-table-column
                                prop="deviceModelCode"
                                label="设备型号"
                                min-width="160px"
                                :show-overflow-tooltip="true"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="protocolName"
                                label="接入协议"
                                min-width="100px"
                                :show-overflow-tooltip="true"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="version"
                                label="设备版本号"
                                min-width="120px"
                            ></el-table-column>
                            <!-- <el-table-column
                                prop="projectCode"
                                label="定制单号"
                                min-width="120px"
                            ></el-table-column> -->
                            <el-table-column
                                prop="createName"
                                label="操作人员"
                                min-width="100px"
                            ></el-table-column>
                            <el-table-column
                                prop="cmd"
                                label="配置类型"
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
                            <el-table-column
                                prop="updateTime"
                                label="进度更新时间"
                                min-width="160px"
                            ></el-table-column>
                            <el-table-column
                                prop="result"
                                label="获取结果"
                                min-width="180px"
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
    name: "configurationView",
    components: {},
    data() {
        return {
            screenTerm: false,
            searchLoading: true,
            expandedList: [],
            tableHeight: 500,
            tableHeight2: 500,
            treeHeight: 500,
            reconfigurationVisible: false,
            abortConfigurationVisible: false,
            searchWay: "",
            activeName: "first",
            statusList: [
                { value: -5, label: "设备版本号不一致" },
                { value: -4, label: "配置文件版本号不一致" },
                { value: -3, label: "型号不一致" },
                { value: -2, label: "命令被覆盖" },
                { value: 1, label: "成功" },
                { value: 2, label: "失败" },
                { value: 3, label: "命令未发送" },
                { value: 4, label: "命令已发送" },
                { value: 5, label: "配置文件下载完成" },
                { value: 6, label: "设备重启中" },
                { value: 7, label: "设备离线，等待下发命令" },
                { value: 8, label: "命令下发失败" },
                //{ value: 9, label: '手动终止任务' }
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
            searchForm: {
                type: "1",
                status: "",
                plateNum: "",
                operationTime: [],
                productKey: "",
            },
            deviceModelList: [],
            treeData: [],
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
                confirmText = `此操作将会终止配置终端手机号为“${deviceCode}”的“${plateNum}”的配置，是否终止重新配置?`;
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
                            this.getParamLogResultStatistics();
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
                                this.getParamLogResultStatistics();
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
        ttsDetail(batchCode) {
            this.$router.push({
                path: "/maintenanceCenter/deviceConfiguration/configurationView/configurationTTSDetail",
                query: { batchCode, organizeId: this.params.organizeId },
            });
        },
        taskDetail(batchCode, cmd) {
            this.$router.push({
                path: "/maintenanceCenter/deviceConfiguration/configurationView/configurationTaskDetail",
                query: { batchCode, organizeId: this.params.organizeId, cmd },
            });
        },
        goExport() {
            let params = {};
            // params.organizeId=this.params.organizeId
            // params.plateNum=this.params.plateNum
            params = JSON.parse(JSON.stringify(this.searchForm));
            params.organizeId = this.params.organizeId;
            if (this.searchForm.operationTime.length > 0) {
                params.beginTime = this.searchForm.operationTime[0];
                params.endTime = this.searchForm.operationTime[1];
            } else {
                params.beginTime = "";
                params.endTime = "";
            }
            // if(!this.date){
            //   this.$message.warning('请选择日期')
            //   return
            // }
            // params.date=TimeUtil.getDate(this.date)
            // params.month=null
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                if (params.type == 2) params.type = "5";
                this.$api.exportDeviceParamLogResult(params).then((res) => {
                    if (res.success == true) {
                        const fileName = res.data.fileName;
                        const _this = this;
                        _this.getExportResultInterval = window.setInterval(
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
                                                    : process.env.BASE_API) +
                                                "/excel?fileName=" +
                                                fileName;
                                            iframe.style.display = "none";
                                            document.body.appendChild(iframe);
                                            window.clearInterval(
                                                _this.getExportResultInterval
                                            );
                                            _this.getExportResultInterval = "";
                                            _this.loadingAll = false;
                                        }
                                    });
                            },
                            2000
                        );
                    } else {
                        this.$message.error(
                                this.$t("common.exportFailed") + ":" +res.msg
                            );
                        this.loadingAll = false;
                    }
                });
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
        changeWay() {
            this.searchLoading = true;
            this.tableData = [];
            // this.handleReset(this.$refs.searchForm)
            this.params.currentPage = 1;
            this.params.pageSize = 20;
            this.getOrganizeTreeWithParamData();
            // this.getTableData()
            this.getParamLogResultStatistics();
        },
        changeSearchWay() {
            this.handleReset(this.$refs.searchForm);
            this.params.currentPage = 1;
            this.params.pageSize = 20;
            this.getTableData();
            this.getParamLogResultStatistics();
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
        // 筛选组织树
        getScreenData() {
            // this.$refs.tree.filter(this.screenTerm);
            this.getOrganizeTreeWithParamData();
        },
        // 获取设备配置组织树
        getOrganizeTreeWithParamData() {
            this.searchLoading = true;
            const param = {};
            param.valid = this.screenTerm;
            if (this.searchForm.type == "1") {
                param.type = 1;
            } else if (this.searchForm.type == "3") {
                param.type = 3;
            } else {
                param.type = 5;
            }
            this.$api.getOrganizeTreeWithParamData(param).then((res) => {
                if (res.success == true) {
                    this.treeData = res.data.treeData;
                    this.expandedList = res.data.expandedList;
                    if (this.treeData.length > 0) {
                        this.params.organizeId = this.$store.state.tree
                            .showDeviceManageId
                            ? this.$store.state.tree.showDeviceManageId
                            : this.treeData[0].id;
                        this.searchForm = this.$store.state.tree.showSearchForm
                            ? this.$store.state.tree.showSearchForm
                            : this.searchForm;
                        this.getTableData();
                        this.getParamLogResultStatistics();
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
            this.$store.dispatch("showDeviceManageId", data.id);
            this.params.currentPage = 1;
            this.getTableData();
            this.getParamLogResultStatistics();
            this.getDeviceModelList();
        },
        // 获取统计数据
        getParamLogResultStatistics() {
            const params = {
                organizeId: this.params.organizeId,
                type: this.searchForm.type == "2" ? 4 : +this.searchForm.type,
                status: this.searchForm.status,
                plateNum: this.searchForm.plateNum,
                operationTime: this.searchForm.operationTime,
                beginTime:
                    this.searchForm.operationTime.length > 0
                        ? this.searchForm.operationTime[0]
                        : "",
                endTime:
                    this.searchForm.operationTime.length > 0
                        ? this.searchForm.operationTime[1]
                        : "",
            };
            this.$api.getParamLogResultStatistics(params).then((res) => {
                if (res.success == true) {
                    this.paramLogResultStatistics = res.data;
                } else {
                    this.$message.error("获取统计数据失败" + res.msg);
                }
            });
        },
        // 获取table数据
        getTableData() {
            this.searchLoading = true;
            const params = Object.assign({}, this.params, this.searchForm);
            if (this.searchForm.operationTime.length > 0) {
                params.beginTime = this.searchForm.operationTime[0];
                params.endTime = this.searchForm.operationTime[1];
            } else {
                params.beginTime = "";
                params.endTime = "";
            }
            this.$store.dispatch("SetShowSearchForm", this.searchForm);
            this.$store.dispatch("SetTabName", this.searchWay);
            // 配置下发任务-按任务查看
            if (this.searchForm.type == "1") {
                if (this.searchWay == 1) {
                    this.$api
                        .getDeviceParamLogResultVoPage(params)
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
                    this.$api
                        .getBatchParamLogResultVoPage(params)
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
                }
            } else if (this.searchForm.type == "2") {
                // tts下发
                params.type = 5;
                this.$api
                    .getDeviceParamLogResultVoPage(params)
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
                // 配置下发任务-按设备查看 配置获取任务
                this.$api
                    .getDeviceParamLogResultVoPage(params)
                    .then((res) => {
                        if (res.success == true) {
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
            }
            // 查询统计数据
            this.getParamLogResultStatistics();
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 380;
            this.tableHeight2 = document.body.clientHeight - 380;
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
