<template>
    <div class="device-upgrade-view">
        <div class="content-box">
            <!-- 左边树 -->
            <div
                class="p-a b-r left-content"
                style="position: relative"
                :class="isShowTree ? 'isShowTree' : 'isHideTree'"
            >
                <div class="screenNode">
                    <span class="screenTitle">
                        <!-- 仅看有升级任务组织 -->
                        {{ $t("deviceUpgrade.onlySeeUpgradeTaskOrganization") }}
                    </span>
                    <el-tooltip
                        class="item"
                        :content="$t('ttsConfiguration.dataLoading')"
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
                            :expand-on-click-node="false"
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
                <div class="btn" @click="changeShowTree()">
                    <i
                        :class="
                            isShowTree
                                ? 'el-icon-arrow-left'
                                : 'el-icon-arrow-right'
                        "
                    ></i>
                </div>
            </div>
            <!-- 右边表 -->
            <div :class="isShowTree ? 'isShowTable' : 'isHideTable'">
                <div class="wrap">
                    <div class="title p-t p-x-md">
                        <div
                            class="text-md"
                            style="display: flex; align-items: center"
                        >
                            <span>
                                <!-- 未完成升级 -->
                                {{ $t("deviceUpgrade.upgradeNotCompleted") }}
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
                                <!-- 展示设备最后一次升级未成功结果 -->
                                {{
                                    $t(
                                        "deviceUpgrade.lastUnsuccessfulUpgradeResult"
                                    )
                                }}
                            </span>
                        </div>
                    </div>
                    <div ref="searchBox" class="wrap-top p-x-md search-module">
                        <div
                            class="search-form-content"
                            :class="{ hidden: !buttonClick }"
                            ref="wrap"
                        >
                            <el-form
                                :model="searchForm"
                                ref="searchForm"
                                inline
                            >
                                <el-form-item
                                    :label="$t('common.keywords')"
                                    prop="deviceId"
                                >
                                    <G-DeviceSearch
                                        :valueKey="'deviceId'"
                                        :value.sync="searchForm.deviceId"
                                        :selectObj.sync="searchForm.selectObj"
                                        :organizeId="params.organizeId"
                                    ></G-DeviceSearch>
                                </el-form-item>
                                <!-- 升级状态 -->
                                <el-form-item
                                    :label="$t('deviceUpgrade.upgradeState')"
                                    prop="upgradeState"
                                >
                                    <el-select
                                        v-model="searchForm.upgradeState"
                                        :placeholder="$t('common.select')"
                                        clearable
                                        @change="setTableHeight"
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
                                <!-- 失败原因 -->
                                <el-form-item
                                    :label="
                                        $t(
                                            'deviceLoadReportVerify.activeCodeErrorMessage'
                                        )
                                    "
                                    v-if="searchForm.upgradeState == '[5]'"
                                    prop="errorReason"
                                >
                                    <el-input
                                        v-model="searchForm.errorReason"
                                        :placeholder="$t('common.input')"
                                        :maxlength="50"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                                <!-- 操作时间段 -->
                                <el-form-item
                                    :label="
                                        $t('operationLog.operationTimePeriod')
                                    "
                                    prop="operationTime"
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
                                        clearable
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                    ></el-date-picker>
                                </el-form-item>
                                <!-- 固件类型-->
                                <el-form-item
                                    :label="$t('firmware.firmwareType')"
                                    prop="type"
                                >
                                    <el-select
                                        v-model="searchForm.type"
                                        clearable
                                    >
                                        <!-- 全部 -->
                                        <el-option
                                            :label="$t('common.all')"
                                            value=""
                                        ></el-option>
                                        <!-- 主机 -->
                                        <el-option
                                            :label="$t('firmware.host')"
                                            value="main"
                                        ></el-option>
                                        <!-- 外设 -->
                                        <el-option
                                            :label="$t('firmware.peripherals')"
                                            value="peripheral"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <!-- 操作人员 -->
                                <el-form-item
                                    :label="$t('operationLog.operator')"
                                    prop="userName"
                                >
                                    <el-input
                                        v-model="searchForm.userName"
                                        :placeholder="$t('common.input')"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                                <!-- 设备型号 -->
                                <el-form-item
                                    prop="deviceModelCode"
                                    :label="$t('common.deviceModelCode')"
                                >
                                    <el-select
                                        v-model="searchForm.deviceModelCode"
                                        filterable
                                        clearable
                                    >
                                        <el-option
                                            v-for="(
                                                item, index
                                            ) in deviceModelList"
                                            :key="index"
                                            :value="item.fieldNameEN"
                                            :label="item.fieldNameCN"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <!-- 目标版本号 -->
                                <el-form-item
                                    :label="$t('deviceUpgrade.targetVersion')"
                                    prop="firmwareVersion"
                                >
                                    <el-input
                                        v-model="searchForm.firmwareVersion"
                                        :placeholder="$t('common.input')"
                                        clearable
                                    ></el-input>
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
                    <div class="p-x-md m-b">
                        <div class="m-b">
                            <el-button
                                type="primary"
                                :loading="allUpgradeLoading"
                                :disabled="
                                    searchLoading ||
                                    !selectionArr.filter((item) => {
                                        if (item.upgradeState === 5) {
                                            return item;
                                        }
                                    }).length
                                "
                                @click="reUpgrade()"
                                v-btn="'deviceUpgradeFailedReUpgrade'"
                            >
                                <!-- 批量重新升级 -->
                                {{ $t("deviceUpgrade.batchUpgradeAgain")
                                }}{{
                                    selection.length > 0 &&
                                    selectionArr.filter((item) => {
                                        if (item.upgradeState === 5) {
                                            return item;
                                        }
                                    }).length
                                        ? "（" +
                                          selectionArr.filter((item) => {
                                              if (item.upgradeState === 5) {
                                                  return item;
                                              }
                                          }).length +
                                          "）"
                                        : ""
                                }}</el-button
                            >
                            <el-button
                                type="primary"
                                :loading="allUpgradeLoading"
                                :disabled="
                                    searchLoading ||
                                    !selectionArr.filter((item) => {
                                        if (
                                            item.upgradeState === 1 ||
                                            item.upgradeState === 2 ||
                                            item.upgradeState === 3
                                        ) {
                                            return item;
                                        }
                                    }).length
                                "
                                @click="allStopUpgrade()"
                                v-btn="'deviceUpgradeEndTasks'"
                            >
                                <!-- 批量终止升级 -->
                                {{ $t("deviceUpgrade.batchTerminationUpgrade")
                                }}{{
                                    selection.length > 0 &&
                                    selectionArr.filter((item) => {
                                        if (
                                            item.upgradeState === 1 ||
                                            item.upgradeState === 2 ||
                                            item.upgradeState === 3
                                        ) {
                                            return item;
                                        }
                                    }).length
                                        ? "（" +
                                          selectionArr.filter((item) => {
                                              if (
                                                  item.upgradeState === 1 ||
                                                  item.upgradeState === 2 ||
                                                  item.upgradeState === 3
                                              ) {
                                                  return item;
                                              }
                                          }).length +
                                          "）"
                                        : ""
                                }}</el-button
                            >
                            <el-button
                                class="exportDownload"
                                @click="exportDevUpgradeLog"
                                :disabled="loadingAll"
                                :loading="loadingAll"
                                v-btn="'deviceUpgradeExport'"
                            >
                                <!-- 导出 -->
                                {{ $t("common.export") }}
                            </el-button>
                            <el-button @click="customShow">
                                <!-- 表头设置 -->
                                {{ $t("conditionMonitoring.headerSettings") }}
                            </el-button>
                        </div>
                        <el-table
                            ref="table"
                            v-loading="searchLoading"
                            v-if="!customBol"
                            :element-loading-text="
                                $t('common.desperatelyLoading')
                            "
                            border
                            stripe
                            element-loading-color="#007213"
                            :data="tableData"
                            row-key="id"
                            key="device"
                            :height="tableHeight"
                            @selection-change="onSelectionChange"
                        >
                            <el-table-column
                                type="selection"
                                :selectable="selectable"
                                :reserve-selection="true"
                            ></el-table-column>
                            <!-- 车牌号 -->
                            <el-table-column
                                fixed
                                prop="plateNum"
                                :label="$t('common.plateNum')"
                                width="150px"
                            ></el-table-column>
                            <!-- 所属组织 -->
                            <el-table-column
                                v-if="copyUpdateCustomJson.orgPath"
                                prop="orgPath"
                                :label="$t('common.orgPath')"
                                width="160px"
                                show-overflow-tooltip
                            ></el-table-column>
                            <!-- 升级前版本号 -->
                            <el-table-column
                                v-if="copyUpdateCustomJson.originalVersion"
                                prop="originalVersion"
                                :label="
                                    $t('deviceUpgrade.beforeUpgradeVersion')
                                "
                                width="155px"
                                show-overflow-tooltip
                            ></el-table-column>
                            <!-- 当前版本号 -->
                            <el-table-column
                                v-if="copyUpdateCustomJson.currentVersion"
                                prop="currentVersion"
                                :label="$t('deviceUpgrade.currentVersion')"
                                width="155px"
                                show-overflow-tooltip
                            ></el-table-column>
                            <!-- 目标版本号 -->
                            <el-table-column
                                v-if="copyUpdateCustomJson.firmwareVersion"
                                prop="firmwareVersion"
                                :label="$t('deviceUpgrade.targetVersion')"
                                width="155px"
                                show-overflow-tooltip
                            ></el-table-column>
                            <!-- 进度更新时间 -->
                            <el-table-column
                                v-if="copyUpdateCustomJson.upgradeStateTime"
                                prop="upgradeStateTime"
                                :label="$t('deviceUpgrade.upgradeStateTime')"
                                width="180px"
                            >
                                <template slot-scope="scope">
                                    {{
                                        $moment(
                                            scope.row.upgradeStateTime
                                        ).format("YYYY-MM-DD HH:mm:ss")
                                    }}
                                </template>
                            </el-table-column>
                            <!-- 固件类型-->
                            <el-table-column
                                v-if="copyUpdateCustomJson.type"
                                prop="type"
                                :label="$t('firmware.firmwareType')"
                                width="100px"
                            >
                                <template slot-scope="scope">
                                    <span v-if="scope.row.type === 'main'">
                                        <!-- 主机 -->
                                        {{ $t("firmware.host") }}
                                    </span>
                                    <span
                                        v-if="scope.row.type === 'peripheral'"
                                    >
                                        <!-- 外设 -->
                                        {{ $t("firmware.peripherals") }}
                                    </span>
                                </template>
                            </el-table-column>
                            <!-- 设备型号 -->
                            <el-table-column
                                v-if="copyUpdateCustomJson.deviceModelCode"
                                prop="deviceModelCode"
                                :label="$t('common.deviceModelCode')"
                                min-width="160px"
                                :show-overflow-tooltip="true"
                            >
                            </el-table-column>
                            <!-- 接入协议 -->
                            <el-table-column
                                v-if="copyUpdateCustomJson.protocolName"
                                prop="protocolName"
                                :label="$t('common.protocolName')"
                                min-width="100px"
                                :show-overflow-tooltip="true"
                            >
                            </el-table-column>
                            <!-- 终端手机号 -->
                            <el-table-column
                                v-if="copyUpdateCustomJson.deviceCode"
                                prop="deviceCode"
                                :label="$t('common.deviceCode')"
                                width="160px"
                            ></el-table-column>
                            <!-- 设备序列号 -->
                            <el-table-column
                                v-if="copyUpdateCustomJson.deviceSerialNum"
                                prop="deviceSerialNum"
                                :label="$t('common.deviceSerialNum')"
                                width="120px"
                            ></el-table-column>
                            <!-- VIN码 -->
                            <el-table-column
                                v-if="copyUpdateCustomJson.vin"
                                prop="vin"
                                :label="$t('common.vin')"
                                width="120px"
                            ></el-table-column>
                            <!-- 操作时间 -->
                            <el-table-column
                                v-if="copyUpdateCustomJson.beginTime"
                                prop="beginTime"
                                :label="$t('operationLog.operationTime')"
                                width="180px"
                            >
                                <template slot-scope="scope">
                                    <span v-if="scope.row.createTime">
                                        {{
                                            $moment(
                                                scope.row.createTime
                                            ).format("YYYY-MM-DD HH:mm:ss")
                                        }}
                                    </span>
                                    <span v-else>--</span>
                                </template>
                            </el-table-column>
                            <!-- 操作人员 -->
                            <el-table-column
                                v-if="copyUpdateCustomJson.createName"
                                prop="createName"
                                :label="$t('operationLog.operator')"
                                width="100px"
                                show-overflow-tooltip
                            ></el-table-column>
                            <!-- 设备状态 -->
                            <el-table-column
                                v-if="copyUpdateCustomJson.deviceStatus"
                                fixed="right"
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
                                    <span v-else>--</span>
                                </template>
                            </el-table-column>
                            <!-- 升级状态 -->
                            <el-table-column
                                v-if="copyUpdateCustomJson.upgradeResult"
                                prop="upgradeState"
                                :label="$t('deviceUpgrade.upgradeState')"
                                min-width="130px"
                                fixed="right"
                            >
                                <template slot-scope="scope">
                                    <upgradeProgress :upgradeData="scope.row">
                                    </upgradeProgress>
                                </template>
                            </el-table-column>
                            <!-- 失败原因 -->
                            <el-table-column
                                v-if="copyUpdateCustomJson.errorReason"
                                prop="errorReason"
                                :label="
                                    $t(
                                        'deviceLoadReportVerify.activeCodeErrorMessage'
                                    )
                                "
                                width="100px"
                                fixed="right"
                                show-overflow-tooltip
                            ></el-table-column>
                            <!-- 操作 -->
                            <el-table-column
                                fixed="right"
                                :label="$t('common.operate')"
                                width="120px"
                            >
                                <template slot-scope="scope">
                                    <a
                                        @click="
                                            stopUpgrade(
                                                scope.row.taskId,
                                                scope.row.taskDevId,
                                                scope.row.plateNum,
                                                scope.row.deviceCode
                                            )
                                        "
                                        v-if="
                                            scope.row.upgradeState == 1 ||
                                            scope.row.upgradeState == 2 ||
                                            scope.row.upgradeState == 3
                                        "
                                        v-btn="'deviceUpgradeEndTasks'"
                                    >
                                        <!-- 终止升级 -->
                                        {{
                                            $t("deviceUpgrade.terminateUpgrade")
                                        }}
                                    </a>
                                    <a
                                        @click="
                                            startUpgrade(
                                                scope.row.taskId,
                                                scope.row.taskDevId,
                                                scope.row.plateNum,
                                                scope.row.deviceCode
                                            )
                                        "
                                        v-if="scope.row.upgradeState == 5"
                                        v-btn="'deviceUpgradeFailedReUpgrade'"
                                    >
                                        <!-- 重新升级 -->
                                        {{ $t("deviceUpgrade.upgradeAgain") }}
                                    </a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="bottom p-x-md">
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
            </div>
        </div>
        <!-- 表头设置 -->
        <el-dialog
            :visible="customBol"
            :title="$t('conditionMonitoring.headerSettings')"
            fill="blue"
            @close="customBol = false"
            class="modal-nopadding"
        >
            <div>
                <el-row>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.orgPath">
                            <!-- 所属组织 -->
                            {{ $t("common.orgPath") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.type">
                            <!-- 固件类型 -->
                            {{ $t("firmware.firmwareType") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.originalVersion">
                            <!-- 升级前版本号 -->
                            {{ $t("deviceUpgrade.beforeUpgradeVersion") }}
                        </el-checkbox>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.firmwareVersion">
                            <!-- 目标版本号 -->
                            {{ $t("deviceUpgrade.targetVersion") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.currentVersion">
                            <!-- 当前版本号 -->
                            {{ $t("deviceUpgrade.currentVersion") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.deviceModelCode">
                            <!-- 设备型号 -->
                            {{ $t("common.deviceModelCode") }}
                        </el-checkbox>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.deviceCode">
                            <!-- 终端手机号 -->
                            {{ $t("common.deviceCode") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.deviceSerialNum">
                            <!-- 设备序列号 -->
                            {{ $t("common.deviceSerialNum") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.vin">
                            <!-- VIN码 -->
                            {{ $t("common.vin") }}
                        </el-checkbox></el-col
                    >
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.beginTime">
                            <!-- 操作时间 -->
                            {{ $t("operationLog.operationTime") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.createName">
                            <!-- 操作人员 -->
                            {{ $t("operationLog.operator") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.upgradeResult">
                            <!-- 升级状态 -->
                            {{ $t("deviceUpgrade.upgradeState") }}
                        </el-checkbox>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.errorReason">
                            <!-- 失败原因 -->
                            {{
                                $t(
                                    "deviceLoadReportVerify.activeCodeErrorMessage"
                                )
                            }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.deviceStatus">
                            <!-- 设备状态 -->
                            {{ $t("common.deviceStatus") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.protocolName">
                            <!-- 接入协议 -->
                            {{ $t("common.protocolName") }}
                        </el-checkbox>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer">
                <el-button size="small" type="default" @click="doDefault">
                    <!-- 恢复默认 -->
                    {{ $t("sortHeader.restoreDefault") }}
                </el-button>
                <el-button
                    :loading="updateCustomJsonBol"
                    :disabled="updateCustomJsonBol"
                    size="small"
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
require("@/assets/style/base.scss");
function throttle(fn, interval = 500) {
    let last = 0;
    return function (...args) {
        let now = +new Date();
        if (now - last > interval) {
            last = now;
            fn.call(this, args);
        }
    };
}
import upgradeProgress from "@/components/upgradeProgress";

export default {
    name: "deviceUpgradeNoComplete",
    components: { upgradeProgress },
    data() {
        return {
            allUpgradeLoading: false,
            selectionArr: [],
            updateCustomJsonBol: false,
            screenTerm: false,
            okTree: false,
            searchLoading: true,
            loadingAll: false,
            expandedList: [],
            expandedList1: [],
            popoverVisible: false,
            buttonClick: false, //按钮重叠
            iconShow: false,
            popoverIng: 0,
            popoverFail: 0,
            tableHeight: 0,
            treeHeight: 500,
            customBol: false,
            customJson: {
                orgPath: true,
                originalVersion: true,
                currentVersion: true,
                firmwareVersion: true,
                upgradeStateTime: true,
                peripheralType: true,
                type: true,
                peripheralVersion: true,
                deviceModelCode: true,
                deviceSerialNum: true,
                vin: true,
                deviceCode: true,
                beginTime: true,
                createName: true,
                upgradeResult: true,
                deviceStatus: true,
                errorReason: true,
                protocolName: true,
            },
            updateCustomJson: "", //配置自定义列表
            copyUpdateCustomJson: "",
            searchForm: {
                upgradeState: "",
                deviceId: "",
                operationTime: [],
                queryType: 1,
                type: "",
                errorReason: "",
                deviceModelCode: "",
                userName: "",
                firmwareVersion: "",
            },
            treeData: [],
            treeData1: [],
            copyTableData: [],
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
            upgradeStateSelectList: [
                {
                    label: this.$t("upgradeProgress.notStarted"), //"未开始",
                    value: "[0]",
                },
                {
                    label: this.$t("upgradeProgress.inProgress"), //"进行中",
                    value: "[1,2,3]",
                },
                // {
                //     label: this.$t("upgradeProgress.upgradeSuccessful"), //"升级成功",
                //     value: "[4]",
                // },
                {
                    label: this.$t("upgradeProgress.upgradeFailed"), //"升级失败",
                    value: "[5]",
                },
                // {
                //     label: this.$t("upgradeProgress.upgradeTermination"), //"升级终止",
                //     value: "[6]",
                // },
            ],
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                organizeId: null,
            },
            // params2: {
            //   currentPage: 1, //页码，从1开始
            //   pageSize: 20, //分页大小
            //   organizeId: null
            // },
            total: 0,
            total2: 0,
            tableData: [],
            deviceModelList: [],
            // devUpgradeLogData:{
            //   totalNum: '', // 总数
            //   successNum: '', // 成功数
            //   failNum: '', // 失败数
            //   stopNum: '', // 终止数
            //   ingNum: '', // 进行中数
            // },
            organizationName: "",
            organizationName1: "",
            selection: [],
            selectUpgradeStatus: "",
            deviceTypeList: [],
            isShowTree: true,
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
            // this.$refs.tree1.filter1([val,this.screenTerm]);

            this.$refs.tree1.filter([val, this.screenTerm]);
            // this.filterTree1(this.treeData1,val,0)
            // this.$nextTick(() =>{
            //   this.$refs.tree1.filter('show', !this.organizationName1);
            // })
        },
    },
    methods: {
        //查询重置
        handleClick() {
            this.buttonClick = !this.buttonClick;
            this.setTableHeight();
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
                        this.filterTree1(item.children, val, 1);
                    }
                }
            });
        },
        itemChildren1(val) {
            if (val.children) {
                if (val.children) {
                    val.children.forEach((item) => {
                        item.show = true;
                        if (item.children) {
                            this.itemChildren1(item);
                        }
                    });
                }
            }
        },
        filterNode(value, data) {
            return data[value];
        },
        filterNode1(value, data) {
            if (!value) {
                return data.unFinishCount > 0;
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
        getScreenData() {
            this.organizationName = "";
            this.organizationName1 = "";
            if (this.screenTerm) {
                this.$refs.tree1.filter([
                    this.organizationName1,
                    this.screenTerm,
                ]);
                this.params.organizeId = this.treeData1[0].id;
                this.$store.dispatch(
                    "SetShowDeviceManageId",
                    this.params.organizeId
                );
                this.getTableData();
            } else {
                this.params.organizeId = this.treeData[0].id;
                this.$store.dispatch(
                    "SetShowDeviceManageId",
                    this.params.organizeId
                );
                this.getTableData();
            }
        },
        // 重查进度
        reSearchProgress(id) {
            let params = { deviceId: id };
            this.$api.getUpgradeStatusFromDev(params).then((res) => {
                if (res.success == true) {
                    // "查询成功"
                    this.$message.success(
                        this.$t("common.search") + this.$t("common.success")
                    );
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // changeWay(){

        //   this.handleReset(this.$refs.searchForm);
        //   this.params.currentPage=1
        //   this.params.pageSize= 20
        //   this.getTableData()
        //   // this.getDevUpgradeLogData()
        // },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getTableData();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getTableData();
        },
        // 终止升级
        stopUpgrade(taskId, taskDevId, plateNum, deviceCode) {
            //此处需确认
            let confirmText = "";
            if (plateNum) {
                // confirmText = `此操作将会终止终端手机号为“${deviceCode}”的“${plateNum}”的升级，是否确认终止升级?`;
                confirmText = this.$t("deviceUpgrade.stopUpgradeText1", {
                    plateNum: plateNum,
                    deviceCode: deviceCode,
                });
            } else {
                // confirmText = `此操作将会终止终端手机号为“${deviceCode}”的升级，是否确认终止升级?`;
                confirmText = this.$t("deviceUpgrade.stopUpgradeText2", {
                    deviceCode: deviceCode,
                });
            }
            this.$confirm(confirmText, this.$t("common.prompt"), {
                confirmButtonText: this.$t("common.ok"),
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
            })
                .then(() => {
                    let params = {
                        taskDevIds: [taskDevId],
                    };
                    this.$api.newUpgradeStopUpgrade(params).then((res) => {
                        if (res.success == true) {
                            this.$refs.table.clearSelection();
                            this.getTableData();
                            this.getDeviceUpgradOrgTeeData();
                            // this.getDevUpgradeLogData()
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        // 重新升级
        startUpgrade(taskId, taskDevId, plateNum, deviceCode) {
            let confirmText = "";
            if (plateNum) {
                // confirmText = `此操作将会重新升级“${plateNum}”的“${deviceCode}”，是否确认重新升级?`;
                confirmText = this.$t("deviceUpgrade.reUpgradeText1", {
                    plateNum: plateNum,
                    deviceCode: deviceCode,
                });
            } else {
                // confirmText = `此操作将会重新升级“${deviceCode}”，是否确认重新升级?`;
                confirmText = this.$t("deviceUpgrade.reUpgradeText2", {
                    deviceCode: deviceCode,
                });
            }
            this.$confirm(confirmText, this.$t("common.prompt"), {
                confirmButtonText: this.$t("common.ok"),
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
            })
                .then(() => {
                    let params = {
                        taskDevIds: [taskDevId],
                    };
                    this.$api.newUpgradeReUpgrade(params).then((res) => {
                        if (res.success == true) {
                            this.$refs.table.clearSelection();
                            this.getTableData();
                            this.getDeviceUpgradOrgTeeData();
                            // this.getDevUpgradeLogData()
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        getTableData() {
            if (!this.params.organizeId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            this.searchLoading = true;
            let params = Object.assign(this.params, this.searchForm, {
                upgradeStates: this.searchForm.upgradeState
                    ? JSON.parse(this.searchForm.upgradeState)
                    : [],
            });
            delete params.upgradeState;
            delete params.selectObj;
            if (
                this.searchForm.operationTime &&
                this.searchForm.operationTime.length
            ) {
                params.beginTime = this.searchForm.operationTime[0];
                params.endTime = this.searchForm.operationTime[1];
            } else {
                params.beginTime = "";
                params.endTime = "";
            }
            // this.$store.dispatch("SetShowSearchForm", this.searchForm);
            this.$api
                .newUpgradeGetUpgradeNotCompletedPage(params)
                .then((res) => {
                    if (res.success == true) {
                        this.tableData = res.data.results;
                        this.copyTableData = JSON.parse(
                            JSON.stringify(this.tableData)
                        );
                        this.total = res.data.totalRecords;
                        this.$nextTick(() => {
                            this.setTableHeight();
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.searchLoading = false;
                    this.$api.eventTrackTrigger({
                        menu: "DEVICE_UPGRADE",
                        business: "DEVICE_UPGRADE_UNFINISH_INFO",
                        eventResult: res.success,
                    });
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        // 设备升级信息
        // getPageDevUpgradeLog(){
        //   let params = Object.assign(this.params, this.searchForm);
        //   if(this.searchForm.operationTime.length>0) {
        //     params.beginTime=this.searchForm.operationTime[0]
        //     params.endTime=this.searchForm.operationTime[1]
        //   } else {
        //     params.beginTime= ''
        //     params.endTime= ''
        //   }
        //    this.$api.getDevUpgradeLogPage_UpgradeTask(params).then((res) =>{
        //       if(res.success == true) {
        //         this.tableData = res.data.results;
        //         this.total=res.data.totalRecords;
        //       } else {
        //           this.$message.error('获取设备升级信息失败:' + res.msg);
        //       }
        //   });
        // },
        // getPageDeviceUpgradeLogBatch(){
        //   let params = Object.assign(this.params2, this.searchForm2);
        //   if(this.searchForm2.operationTime.length>0) {
        //     params.beginTime=this.searchForm2.operationTime[0]
        //     params.endTime=this.searchForm2.operationTime[1]
        //   } else {
        //     params.beginTime= ''
        //     params.endTime= ''
        //   }
        //   this.$api.getDeviceUpgradeLogBatchPage_UpgradeTask(params).then((res) =>{
        //       if(res.success == true) {
        //         this.tableData2 = res.data.results;
        //         this.total2=res.data.totalRecords;
        //       } else {
        //           this.$message.error('获取设备升级信息失败:' + res.msg);
        //       }
        //   });
        // },
        // 获取组织树
        getOrgTree(type) {
            this.$api.deviceGetOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = JSON.parse(JSON.stringify(res.data));
                    if (this.treeData.length > 0) {
                        if (!!this.$route.query.selectObj) {
                            let obj = JSON.parse(this.$route.query.selectObj);
                            this.params.organizeId = obj.organizeId
                                ? Number(obj.organizeId)
                                : this.params.organizeId;

                            this.expandedList.push(Number(obj.organizeId));

                            this.searchForm.plateNum = obj.plateNum
                                ? obj.plateNum
                                : this.searchForm.plateNum;
                        } else {
                            // this.params.organizeId = this.$store.state.tree
                            //     .showDeviceManageId
                            //     ? this.$store.state.tree.showDeviceManageId
                            //     : this.treeData[0].id;
                            // this.searchForm = this.$store.state.tree
                            //     .showSearchForm
                            //     ? this.$store.state.tree.showSearchForm
                            //     : this.searchForm;
                            this.params.organizeId = this.treeData[0].id;
                            this.searchForm = this.searchForm;
                        }
                        this.$nextTick(() => {
                            this.treeData.forEach((m) => {
                                this.expandedList.push(m.id);
                            });
                            if (!!this.$route.query.selectObj) {
                                this.$refs.tree.setCurrentKey(
                                    Number(this.params.organizeId)
                                );
                            }
                        });
                        this.getTableData();
                        this.getDeviceModelList();
                        // this.getDevUpgradeLogData()
                        if (type) {
                            this.filterTree1(
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
                    } else {
                        this.searchLoading = false;
                    }
                } else {
                    this.searchLoading = false;
                    this.$message.error(res.msg);
                }
            });
        },

        // 获取设备升级组织树
        getDeviceUpgradOrgTeeData(type) {
            this.$api.newUpgradeGetOrganizeTreeWithUpgradeData().then((res) => {
                if (res.success == true) {
                    this.treeData1 = res.data.treeData;
                    this.expandedList1 = res.data.expandedList;
                    this.$nextTick(() => {
                        this.$refs.tree1.filter();
                    });
                    // this.$refs.tree1.filter([this.organizationName1,this.screenTerm]);
                    this.$nextTick(() => {
                        this.okTree = true;
                    });
                    if (this.treeData1.length > 0) {
                        if (!!this.$route.query.selectObj) {
                            let obj = JSON.parse(this.$route.query.selectObj);
                            this.params.organizeId = obj.organizeId
                                ? Number(obj.organizeId)
                                : this.params.organizeId;
                            this.searchForm.plateNum = obj.plateNum
                                ? obj.plateNum
                                : this.searchForm.plateNum;
                        } else {
                            // this.params.organizeId = this.$store.state.tree
                            //     .showDeviceManageId
                            //     ? this.$store.state.tree.showDeviceManageId
                            //     : this.treeData1[0].id;
                            // this.searchForm = this.$store.state.tree
                            //     .showSearchForm
                            //     ? this.$store.state.tree.showSearchForm
                            //     : this.searchForm;
                            this.params.organizeId = this.params.organizeId
                                ? this.params.organizeId
                                : this.treeData1[0].id;
                            this.searchForm = this.searchForm;
                            this.$refs["tree"].setCurrentKey(
                                this.params.organizeId
                            );
                        }

                        // this.filterTree1(this.treeData1, this.expandedList1);
                        // this.$nextTick(() => {
                        //   this.$refs.tree.filter("show", !this.expandedList1);
                        // });

                        // this.getDeviceModelList()
                        // this.getDevUpgradeLogData()
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 获取设备型号下拉列表数据
        getDeviceModelList() {
            this.$api.getProductListByOrgId().then((res) => {
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
        handleNodeClick(data) {
            this.params.organizeId = data.id;
            // this.params2.organizeId=data.id;
            this.params.currentPage = 1;
            this.$store.dispatch("SetShowDeviceManageId", data.id);
            // this.params2.currentPage=1;
            // this.getPageDevUpgradeLog();
            // this.getPageDeviceUpgradeLogBatch();
            this.getTableData();
            // this.getDevUpgradeLogData()
            this.getDeviceModelList();
            if (data.unFinishCount + data.failedCount > 0) {
                //this.popoverVisible=true
                this.popoverIng = data.unFinishCount;
                this.popoverFail = data.failedCount;
            } else {
                //this.popoverVisible=false
                this.popoverIng = 0;
                this.popoverFail = 0;
            }
        },
        // 导出数据
        exportDevUpgradeLog() {
            if (!this.params.organizeId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                let params = Object.assign(this.params, this.searchForm, {
                    upgradeStates: this.searchForm.upgradeState
                        ? JSON.parse(this.searchForm.upgradeState)
                        : [],
                });
                delete params.upgradeState;
                delete params.selectObj;
                if (
                    this.searchForm.operationTime &&
                    this.searchForm.operationTime.length
                ) {
                    params.beginTime = this.searchForm.operationTime[0];
                    params.endTime = this.searchForm.operationTime[1];
                } else {
                    params.beginTime = "";
                    params.endTime = "";
                }
                this.$api
                    .newUpgradeExportUpgradeNotCompleted(params)
                    .then((res) => {
                        if (res.success == true) {
                            var fileName = res.data.fileName;
                            let _this = this;
                            _this.getExportResultInterval = window.setInterval(
                                function () {
                                    _this.$api
                                        .isExportFinished(fileName)
                                        .then((res1) => {
                                            if (
                                                res1.success == true &&
                                                res1.data == true
                                            ) {
                                                var iframe =
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
                                                    _this.getExportResultInterval
                                                );
                                                _this.getExportResultInterval =
                                                    "";
                                                _this.loadingAll = false;
                                            }
                                        });
                                },
                                2000
                            );
                        } else {
                            this.$message.error(
                                this.$t("common.exportFailed") + ":" + res.msg
                            );
                            this.loadingAll = false;
                        }
                    });
            }
        },
        //表头设置
        customShow() {
            this.updateCustomJson = JSON.parse(
                JSON.stringify(this.copyUpdateCustomJson)
            );
            this.tableData = [];
            setTimeout(() => {
                this.tableData = JSON.parse(JSON.stringify(this.copyTableData));
            }, 1);
            this.customBol = true;
        },
        //获取表头设置
        getUserVisibleColumn() {
            let params = {
                path: "upgradeTask/pageDevUpgradeLog",
            };
            this.$api.getUserVisibleColumn(params).then((res) => {
                if (res.success) {
                    if (res.data) {
                        this.copyUpdateCustomJson = JSON.parse(res.data);
                        this.updateCustomJson = JSON.parse(
                            JSON.stringify(res.data)
                        );
                        // this.getTableData();
                    } else {
                        this.copyUpdateCustomJson = JSON.parse(
                            JSON.stringify(this.customJson)
                        );
                        this.updateCustomJson = JSON.parse(
                            JSON.stringify(this.customJson)
                        );
                    }
                    this.customBol = false;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //恢复列显示默认
        doDefault() {
            let params = {
                path: "upgradeTask/pageDevUpgradeLog",
                showColumns: JSON.stringify(this.customJson),
            };
            this.$api.saveUserVisibleColumn(params).then((res) => {
                if (res.success == true) {
                    // this.$message.success(`表头设置恢复默认成功`);
                    this.$message.success(
                        this.$t(
                            "conditionMonitoring.headerSettingsDefaultSuccessfully"
                        )
                    );
                    this.getUserVisibleColumn();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //保存列显示
        doSave: throttle(function (e) {
            this.updateCustomJsonBol = true;
            let params = {
                path: "upgradeTask/pageDevUpgradeLog",
                showColumns: JSON.stringify(this.updateCustomJson),
            };

            this.$api.saveUserVisibleColumn(params).then((res) => {
                if (res.success) {
                    // this.$message.success(`保存表头设置成功`);
                    this.$message.success(
                        this.$t(
                            "conditionMonitoring.headerSettingsSuccessfully"
                        )
                    );
                    this.getUserVisibleColumn();
                } else {
                    this.$message.error(res.msg);
                }
                this.updateCustomJsonBol = false;
            });
        }),
        // 获取统计数据
        // getDevUpgradeLogData(){
        //   const params = {
        //     organizeId: this.params.organizeId,
        //     containChildren: 0,
        //     latest:1
        //   }
        //   this.$api.getDevUpgradeLogData(params).then((res) =>{
        //     if(res.success == true) {
        //       this.devUpgradeLogData = res.data
        //     } else {
        //       this.$message.error('获取统计数据失败' + res.msg);
        //     }
        //   }).catch(err =>{

        //   });
        // },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
                this.searchForm.deviceId = "";
                this.searchForm.selectObj = {};
            }
        },
        setTableHeight() {
            this.$nextTick(() => {
                this.tableHeight =
                    document.body.clientHeight -
                    238 -
                    this.$refs.searchBox.offsetHeight;
                this.treeHeight = document.body.clientHeight - 200;
            });
        },
        setWrap() {
            if (this.$refs.wrap.scrollHeight > 86) {
                this.iconShow = true;
            } else {
                this.iconShow = false;
            }
        },
        onSelectionChange(selection) {
            this.selectionArr = selection;
            if (selection.length > 0) {
                this.selectUpgradeStatus = selection[0].upgradeState;
            } else {
                this.selectUpgradeStatus = "";
            }
            this.selection = selection.reduce((prev, cur) => {
                return prev.concat(cur["id"]);
            }, []);
        },
        selectable(row, index) {
            let upgradeStatusArr = [1, 2, 3, 5];
            if (upgradeStatusArr.indexOf(row.upgradeState) > -1) {
                return true;
            } else {
                return false;
            }
        },
        reUpgrade() {
            this.$confirm(
                // `此操作将会批量对${
                //     this.selectionArr.filter((item) => {
                //         if (item.upgradeState === 5) {
                //             return item;
                //         }
                //     }).length
                // }个设备进行重新升级，是否确认批量重新升级?`,
                this.$t("deviceUpgrade.reUpgradeText3", {
                    num: this.selectionArr.filter((item) => {
                        if (item.upgradeState === 5) {
                            return item;
                        }
                    }).length,
                }),
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.allUpgradeLoading = true;
                    this.$api
                        .newUpgradeReUpgrade({
                            taskDevIds: this.selectionArr
                                .filter((item) => {
                                    if (item.upgradeState === 5) {
                                        return item;
                                    }
                                })
                                .reduce((prev, cur) => {
                                    return prev.concat(cur["taskDevId"]);
                                }, []),
                        })
                        .then((res) => {
                            if (res.success) {
                                this.getTableData();
                                this.getDeviceUpgradOrgTeeData();
                                this.$refs.table.clearSelection();
                                this.selection = [];
                            } else {
                                this.$message.error(res.msg);
                            }
                            this.allUpgradeLoading = false;
                        });
                })
                .catch(() => {});
        },
        allStopUpgrade() {
            this.$confirm(
                // `此操作将会批量对${
                //     this.selectionArr.filter((item) => {
                //         if (
                //             item.upgradeState === 1 ||
                //             item.upgradeState === 2 ||
                //             item.upgradeState === 3
                //         ) {
                //             return item;
                //         }
                //     }).length
                // }个设备进行终止升级，是否确认批量终止升级?`,
                this.$t("deviceUpgrade.reUpgradeText3", {
                    num: this.selectionArr.filter((item) => {
                        if (
                            item.upgradeState === 1 ||
                            item.upgradeState === 2 ||
                            item.upgradeState === 3
                        ) {
                            return item;
                        }
                    }).length,
                }),
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.allUpgradeLoading = true;
                    this.$api
                        .newUpgradeStopUpgrade({
                            taskDevIds: this.selectionArr
                                .filter((item) => {
                                    if (
                                        item.upgradeState === 1 ||
                                        item.upgradeState === 2 ||
                                        item.upgradeState === 3
                                    ) {
                                        return item;
                                    }
                                })
                                .reduce((prev, cur) => {
                                    return prev.concat(cur["taskDevId"]);
                                }, []),
                        })
                        .then((res) => {
                            if (res.success) {
                                this.getTableData();
                                this.getDeviceUpgradOrgTeeData();
                                this.$refs.table.clearSelection();
                                this.selection = [];
                            } else {
                                this.$message.error(res.msg);
                            }
                            this.allUpgradeLoading = false;
                        });
                })
                .catch(() => {});
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
        changeShowTree() {
            this.isShowTree = !this.isShowTree;
        },
    },
    mounted() {
        this.setWrap();
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
                this.setWrap();
            })();
        };
    },
    created() {
        if (!!this.$route.query.selectObj) {
            let obj = JSON.parse(this.$route.query.selectObj);
            this.searchForm.deviceId = obj.id;
            this.searchForm.selectObj = {
                ...obj,
                deviceId: obj.id,
                html: `<span>${obj.plateNum || "--"}</span>；<span>${
                    obj.deviceCode || "--"
                }</span>；<span>${obj.deviceSerialNum || "--"}</span>；<span>${
                    obj.vin || "--"
                }</span>`,
                title: `${obj.plateNum || "--"}；${obj.deviceCode || "--"}；${
                    obj.deviceSerialNum || "--"
                }；${obj.vin || "--"}`,
            };
        }
        this.getDeviceType();
        // this.setTableHeight();
        this.getDeviceUpgradOrgTeeData();
        this.getOrgTree();

        this.getUserVisibleColumn();
    },
};
</script>

<style scoped lang="less">
.device-upgrade-view {
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
    .loading_ {
        pointer-events: none;
    }
    .exportDownload {
    }
    .wrap {
        height: 100%;
        // display: flex;
        // flex-direction: column;
        // justify-content: space-between;
        .wrap-top {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .flex {
                display: flex;
            }
        }
    }
    .bottom {
        border-top: 1px solid #e4e4e4;
    }
    .hidden {
        height: 46px;
        overflow: hidden;
    }
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
.content-box {
    display: flex;
    .left-content {
        width: 320px;
        position: inherit;
    }
    .isShowTable {
        width: calc(~"100% - 320px");
    }
    .isHideTable {
        width: calc(~"100% - 1px");
    }
}
.isShowTree {
    width: 320px;
}

.isHideTree {
    width: 0rem !important;
    padding: 0 !important;
    .screenNode,
    .one,
    .two {
        display: none;
    }
}
.btn {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 40px;
    border: 1px solid #e9e9e9;
    border-left: none;
    position: absolute;
    right: -16px;
    top: 50%;
    border-radius: 0 4px 4px 0;

    &:hover {
        color: #409eff;
    }
}
</style>
<style lang="less">
.device-upgrade-view {
    .el-tag--dark {
        border: none;
        width: 76px;
        text-align: center;
        line-height: 24px !important;
    }
}
</style>
