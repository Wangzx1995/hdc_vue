<template>
    <div>
        <el-row>
            <!-- 左边树 -->
            <el-col :span="4" class="p-a b-r">
                <el-input
                    class="marginBottom"
                    v-model="organizationName"
                    :placeholder="$t('common.inputOrganizationName')"
                    clearable
                >
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <div :class="{ loading_: searchLoading }">
                    <el-tree
                        ref="tree"
                        :data="treeData"
                        :default-expanded-keys="TreeExpanded"
                        @node-click="handleNodeClick"
                        default-icon="el-icon-folder"
                        highlight-current
                        node-key="id"
                        :filter-node-method="filterNode"
                        :props="defaultProps"
                        :current-node-key="params.organizeId"
                        :style="{ height: treeHeight + 'px' }"
                        :expand-on-click-node="false"
                    ></el-tree>
                </div>
            </el-col>

            <el-col :span="20">
                <div class="wrap">
                    <div ref="searchBox" class="search-module">
                        <div
                            class="search-form-content"
                            :class="{ hidden: !buttonClick }"
                            ref="wrap"
                        >
                            <el-form
                                :model="searchForm"
                                :rules="rules"
                                inline
                                ref="searchForm"
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
                                <!-- 设备型号 -->
                                <el-form-item
                                    prop="deviceModelCode"
                                    :label="$t('common.deviceModelCode')"
                                >
                                    <el-select
                                        @change="productChange"
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
                                <!-- 设备版本号 -->
                                <el-form-item
                                    prop="firmwareVersion"
                                    :label="$t('common.softwareVersion')"
                                >
                                    <el-input
                                        v-model="searchForm.firmwareVersion"
                                        :placeholder="$t('common.input')"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                                <!-- 设备状态 -->
                                <el-form-item
                                    prop="deviceStatus"
                                    :label="$t('common.deviceStatus')"
                                >
                                    <el-select
                                        v-model="searchForm.deviceStatus"
                                        :placeholder="$t('common.select')"
                                        clearable
                                    >
                                        <el-option
                                            v-for="(
                                                item, index
                                            ) in deviceStatusList"
                                            :key="index"
                                            :value="item.value"
                                            :label="item.label"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <!-- 产品型号 -->
                                <el-form-item
                                    prop="realDeviceModelCode"
                                    :label="$t('deviceUpgrade.productModel')"
                                >
                                    <el-input
                                        v-model="searchForm.realDeviceModelCode"
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
                    <div class="wrap-top p-x" ref="searchBtn">
                        <div class="flex">
                            <el-button
                                type="primary"
                                :disabled="searchLoading"
                                @click="
                                    goUpgrade(selectProductKey, selectionIds)
                                "
                                v-btn="'deviceUpgradeBatchUpgrade'"
                            >
                                <!-- 批量升级 -->
                                {{ $t("deviceUpgrade.batchUpgrade")
                                }}{{
                                    selection.length > 0
                                        ? "（" + selection.length + "）"
                                        : ""
                                }}</el-button
                            >
                            <el-button
                                type="default"
                                :disabled="searchLoading || treeBoolean"
                                @click="goAllUpgrade()"
                                v-btn="'deviceUpgradeWholeGroupUpgrade'"
                            >
                                <!-- 整组升级 -->
                                {{ $t("deviceUpgrade.wholeGroupUpgrade") }}
                            </el-button>
                            <el-button
                                type="default"
                                @click="openBulkImport"
                                v-btn="'deviceUpgradeBatchImportUpgrade'"
                            >
                                <!-- 批量导入升级 -->
                                {{ $t("deviceUpgrade.batchImportUpgrade") }}
                            </el-button>
                            <el-button
                                type="default"
                                @click="goExport"
                                :loading="loadingAll"
                                v-btn="'deviceUpgradeExport'"
                            >
                                <!-- 导出 -->
                                {{ $t("common.export") }}
                            </el-button>
                        </div>
                        <div>
                            <el-badge>
                                <el-checkbox
                                    v-model="params.checked"
                                    style="margin-right: 10px"
                                >
                                    <!-- 包含下级组织车辆 -->
                                    {{ $t("deviceSearch.includingVehicles") }}
                                </el-checkbox>
                            </el-badge>

                            <el-badge :is-dot="redIconstyle">
                                <el-button
                                    :disabled="searchLoading"
                                    type="default"
                                    @click="goFirmWare"
                                    v-btn="'deviceUpgradeFirmwarePackManage'"
                                >
                                    <!-- 设备固件管理 -->
                                    {{
                                        $t(
                                            "deviceUpgrade.deviceFirmwareManagement"
                                        )
                                    }}
                                </el-button>
                            </el-badge>
                            <el-badge :is-dot="redIcon">
                                <el-button
                                    :disabled="searchLoading"
                                    type="default"
                                    @click="goDetail"
                                    v-btn="'deviceUpgradeQueryMyTasks'"
                                >
                                    <!-- 我的升级任务 -->
                                    {{ $t("deviceUpgrade.myUpgradeTask") }}
                                </el-button>
                            </el-badge>
                            <el-badge :is-dot="redIcon">
                                <el-button
                                    :disabled="searchLoading"
                                    type="default"
                                    @click="goNoComplete"
                                    v-btn="'deviceUpgradeQueryUnfinishedTasks'"
                                >
                                    <!-- 未完成升级 -->
                                    {{
                                        $t("deviceUpgrade.upgradeNotCompleted")
                                    }}
                                </el-button>
                            </el-badge>
                        </div>
                    </div>
                    <div class="wrap-top p-x" ref="searchAlert">
                        <div
                            class="w-full"
                            v-show="!closeFlag && !selection.length"
                            style="margin-top: 1rem"
                        >
                            <!-- 升级支持离线托管，设备在线时平台自动下发升级任务，无需等待！ -->
                            <el-alert
                                :title="$t('deviceUpgrade.elAlert')"
                                :closable="true"
                                type="warning"
                                show-icon
                                simple
                                @close="closeAlert"
                            ></el-alert>
                        </div>
                        <div
                            class="w-full"
                            v-show="selection.length"
                            style="margin-top: 1rem"
                        >
                            <el-alert
                                :closable="false"
                                type="success"
                                simple
                                @close="closeAlert"
                                class="select-alert"
                            >
                                <div slot="title" class="alert-title">
                                    <div>
                                        <span>
                                            {{ $t("devLog.selectTableMsg1") }}
                                            {{ selection.length }}
                                            {{ $t("devLog.selectTableMsg2") }}
                                        </span>
                                        <el-button
                                            type="text"
                                            @click="openSelection"
                                        >
                                            <!-- 查看 -->
                                            {{ $t("devLog.selectTableMsg3") }}
                                        </el-button>
                                        <el-button
                                            type="text"
                                            @click="clearSelection"
                                        >
                                            <!-- 取消选择 -->
                                            {{ $t("devLog.selectTableMsg4") }}
                                        </el-button>
                                    </div>
                                </div>
                            </el-alert>
                        </div>
                    </div>
                    <div class="m-y p-x">
                        <!-- @sort-change="changeSort" @filter-change="filterChange" -->
                        <el-table
                            v-loading="searchLoading"
                            border
                            stripe
                            :element-loading-text="
                                $t('common.desperatelyLoading')
                            "
                            element-loading-color="#007213"
                            :data="tableData"
                            label-width="auto"
                            :row-key="'deviceId'"
                            @selection-change="onSelectionChange"
                            :height="tableHeight"
                            @select-all="selectAll"
                            ref="table"
                            @cell-mouse-enter="cellMouseEnter"
                        >
                            <el-table-column
                                type="selection"
                                :reserve-selection="true"
                                :selectable="selectable"
                            ></el-table-column>
                            <!-- 车牌号 -->
                            <el-table-column
                                fixed
                                prop="plateNum"
                                :label="$t('common.plateNum')"
                                min-width="160px"
                            >
                                <template slot-scope="scope">
                                    <div v-if="scope.row.plateNum">
                                        <div
                                            :class="{
                                                copy:
                                                    nowHoverCellRow ===
                                                    scope.row.deviceId,
                                            }"
                                            class="flex-box"
                                            @click.stop="
                                                copyCarNumber(
                                                    scope.row.plateNum
                                                )
                                            "
                                        >
                                            <div>{{ scope.row.plateNum }}</div>
                                        </div>
                                        <!-- {{ scope.row.plateNum }} -->
                                        <el-popover
                                            placement="top"
                                            v-for="item in scope.row
                                                .dataAbnormalList"
                                            :key="item.id"
                                            v-show="
                                                item.type == 2 &&
                                                item.deviceValue !=
                                                    scope.row.plateNum
                                            "
                                            :open-delay="300"
                                            trigger="hover"
                                        >
                                            <p class="marginBottom">
                                                <!-- 车牌号异常 -->
                                                {{
                                                    $t(
                                                        "deviceManage.abnormalLicensePlateNumber"
                                                    )
                                                }}
                                            </p>
                                            <div class="marginBottom">
                                                {{
                                                    $t(
                                                        "carManage.platformPlateNum"
                                                    )
                                                }}：{{ scope.row.plateNum }}
                                            </div>
                                            <div>
                                                {{
                                                    $t(
                                                        "carManage.devicePlateNum"
                                                    )
                                                }}：{{ item.deviceValue }}
                                            </div>
                                            <a
                                                @click="
                                                    toChange(
                                                        1,
                                                        scope.row.plateNum
                                                    )
                                                "
                                                class="m-r-sm"
                                                >{{
                                                    $t("carManage.goModify")
                                                }}</a
                                            >
                                            <i
                                                class="text-error el-icon-warning"
                                                slot="reference"
                                            ></i>
                                        </el-popover>
                                        <span
                                            v-if="scope.row.freeze == 1"
                                            class="freeze-icon"
                                            >{{ $t("carManage.freeze") }}</span
                                        >
                                    </div>
                                    <div v-else style="padding-left: 12px">
                                        --
                                    </div>
                                </template>
                            </el-table-column>
                            <!-- 所属组织 -->
                            <el-table-column
                                prop="orgPath"
                                :label="$t('common.orgPath')"
                                show-overflow-tooltip
                                min-width="300px"
                            ></el-table-column>
                            <!-- 设备版本号 -->
                            <el-table-column
                                prop="firmwareVersion"
                                :label="$t('common.softwareVersion')"
                                min-width="165px"
                            ></el-table-column>
                            <!-- 进度更新时间 -->
                            <el-table-column
                                prop="upgradeStateTime"
                                :label="$t('deviceUpgrade.upgradeStateTime')"
                                min-width="165px"
                            >
                                <template slot-scope="scope">
                                    <span v-if="scope.row.upgradeStateTime">
                                        {{
                                            $moment(
                                                scope.row.upgradeStateTime
                                            ).format("YYYY-MM-DD HH:mm:ss")
                                        }}
                                    </span>
                                    <span v-else>--</span>
                                </template>
                            </el-table-column>
                            <!-- 终端外设 -->
                            <el-table-column
                                :label="$t('deviceUpgrade.terminalPeripherals')"
                                min-width="100px"
                            >
                                <template slot-scope="scope">
                                    <el-popover
                                        placement="bottom"
                                        :width="
                                            outDevInfo && outDevInfo.length
                                                ? 600
                                                : 100
                                        "
                                        trigger="hover"
                                        @show="
                                            showOutDevInfo(scope.row.deviceId)
                                        "
                                    >
                                        <div
                                            v-if="
                                                !(
                                                    outDevInfo &&
                                                    outDevInfo.length
                                                )
                                            "
                                        >
                                            <!-- 暂无数据 -->
                                            {{ $t("common.noData") }}
                                        </div>
                                        <div class="out-dev-info-box">
                                            <div
                                                class="out-dev-info"
                                                v-for="(
                                                    item, index
                                                ) in outDevInfo"
                                                :key="index"
                                            >
                                                <div>
                                                    <span>
                                                        <!-- 外设类型 -->
                                                        {{
                                                            $t(
                                                                "common.peripheralType"
                                                            )
                                                        }}：
                                                    </span>
                                                    <span
                                                        :title="item.outDevType"
                                                    >
                                                        {{
                                                            item.outDevType ||
                                                            "--"
                                                        }}</span
                                                    >
                                                </div>
                                                <div>
                                                    <span>
                                                        <!-- 外设名称 -->
                                                        {{
                                                            $t(
                                                                "common.peripheralName"
                                                            )
                                                        }}：
                                                    </span>
                                                    <span
                                                        :title="item.outDevName"
                                                    >
                                                        {{
                                                            item.outDevName ||
                                                            "--"
                                                        }}</span
                                                    >
                                                </div>
                                                <div class="out-dev-info-ver">
                                                    <span>
                                                        <!-- 外设版本 -->
                                                        {{
                                                            $t(
                                                                "common.peripheralVersion"
                                                            )
                                                        }}：
                                                    </span>
                                                    <span
                                                        :title="
                                                            item.outDevVersion
                                                        "
                                                    >
                                                        {{
                                                            item.outDevVersion ||
                                                            "--"
                                                        }}</span
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                        <i
                                            class="el-icon-set-up out-dev-info-icon"
                                            slot="reference"
                                        ></i>
                                    </el-popover>
                                </template>
                            </el-table-column>
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
                            <!-- 产品型号 -->
                            <el-table-column
                                prop="realDeviceModelCode"
                                :label="$t('deviceUpgrade.productModel')"
                                min-width="400px"
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
                                min-width="125px"
                            >
                                <template slot-scope="scope">
                                    <div>
                                        {{ scope.row.deviceSerialNum }}
                                        <el-popover
                                            placement="top"
                                            v-for="item in scope.row
                                                .dataAbnormalList"
                                            :key="item.id"
                                            v-show="
                                                item.type == 1 &&
                                                item.deviceValue !=
                                                    scope.row.deviceSerialNum
                                            "
                                            :open-delay="300"
                                            trigger="hover"
                                        >
                                            <p class="marginBottom">
                                                {{
                                                    $t(
                                                        "carManage.deviceSerialNumAbnormal"
                                                    )
                                                }}
                                            </p>
                                            <div class="marginBottom">
                                                {{
                                                    $t(
                                                        "carManage.platformDeviceSerialNum"
                                                    )
                                                }}：{{
                                                    scope.row.deviceSerialNum
                                                }}
                                            </div>
                                            <div>
                                                {{
                                                    $t(
                                                        "carManage.deviceDeviceSerialNum"
                                                    )
                                                }}：{{ item.deviceValue }}
                                            </div>
                                            <a
                                                @click="
                                                    toChange(
                                                        2,
                                                        scope.row
                                                            .deviceSerialNum
                                                    )
                                                "
                                                class="m-r-sm"
                                                >{{
                                                    $t("carManage.goModify")
                                                }}</a
                                            >
                                            <i
                                                class="text-error el-icon-warning"
                                                slot="reference"
                                            ></i>
                                        </el-popover>
                                    </div>
                                </template>
                            </el-table-column>
                            <!-- VIN码 -->
                            <el-table-column
                                prop="vin"
                                :label="$t('common.vin')"
                                min-width="120px"
                            ></el-table-column>
                            <!-- 升级状态 -->
                            <el-table-column
                                prop="upgradeState"
                                :label="$t('deviceUpgrade.upgradeState')"
                                fixed="right"
                                min-width="160px"
                            >
                                <template slot-scope="scope">
                                    <upgradeProgress :upgradeData="scope.row">
                                        <el-button
                                            type="text"
                                            v-if="scope.row.upgradeState === 5"
                                            @click="reUpgrade(scope.row)"
                                            v-btn="
                                                'deviceUpgradeFailedReUpgrade'
                                            "
                                        >
                                            <!-- 重新升级 -->
                                            {{
                                                $t("deviceUpgrade.upgradeAgain")
                                            }}
                                        </el-button>
                                        <el-button
                                            type="text"
                                            v-if="scope.row.upgradeState < 4"
                                            @click="stopUpgrade(scope.row)"
                                            v-btn="'deviceUpgradeEndTasks'"
                                        >
                                            <!-- 终止升级 -->
                                            {{
                                                $t(
                                                    "deviceUpgrade.terminateUpgrade"
                                                )
                                            }}
                                        </el-button>
                                    </upgradeProgress>
                                </template>
                            </el-table-column>
                            <!-- 失败原因 -->
                            <el-table-column
                                prop="errorReason"
                                :label="
                                    $t('plateNumAndDeviceCode.failureReason')
                                "
                                fixed="right"
                                min-width="120px"
                                show-overflow-tooltip
                            ></el-table-column>
                            <!-- 设备状态 -->
                            <el-table-column
                                fixed="right"
                                prop="deviceStatus"
                                :label="$t('common.deviceStatus')"
                                min-width="120px"
                                :render-header="renderHeader"
                            >
                                <template slot-scope="scope">
                                    <G-DeviceStatus :deviceInfo="scope.row">
                                    </G-DeviceStatus>
                                </template>
                            </el-table-column>
                            <!-- 操作 -->
                            <el-table-column
                                fixed="right"
                                :label="$t('common.operate')"
                                width="120px"
                            >
                                <template slot-scope="scope">
                                    <a
                                        class="m-r-sm"
                                        @click="
                                            goSingleUpgrade(
                                                scope.row.deviceModelCode,
                                                scope.row
                                            )
                                        "
                                        v-btn="'deviceUpgradeUpgrade'"
                                    >
                                        <!-- 升级 -->
                                        {{ $t("deviceUpgrade.upgrade") }}
                                    </a>
                                    <a
                                        @click="
                                            goHistory(
                                                scope.row.deviceId,
                                                scope.row.upgradeState,
                                                scope.row.plateNum,
                                                scope.row.treeLevel,
                                                scope.row.orgPath,
                                                scope.row.vin,
                                                scope.row.deviceSerialNum,
                                                scope.row.deviceCode,
                                                scope.row.deviceModelCode,
                                                scope.row.protocolName,
                                                scope.row
                                                    .manufacturerNameString,
                                                scope.row.installerString,
                                                scope.row.accessProtocol
                                            )
                                        "
                                        v-btn="'deviceUpgradeHistory'"
                                    >
                                        <!-- 历史 -->
                                        {{ $t("equipmentInspection.history") }}
                                    </a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="p-x wrap-bottom" ref="searchPagination">
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
        <el-dialog
            :title="`${$t('devLog.selectTableMsg3')}(${selection.length})`"
            :visible.sync="selectionVisible"
            :width="'1200px'"
        >
            <div v-if="selectionVisible" class="wrap selection-box">
                <div class="wrap-top p-x" ref="searchSelectionBox">
                    <el-form
                        :inline="true"
                        ref="selectionForm"
                        :model="selectionForm"
                    >
                        <!-- 车牌号 -->
                        <el-form-item
                            class="widthVersion"
                            prop="plateNum"
                            :label="$t('common.plateNum')"
                        >
                            <el-input
                                v-model="selectionForm.plateNum"
                                :placeholder="$t('common.input')"
                                clearable
                            ></el-input>
                        </el-form-item>
                        <!-- 设备版本号 -->
                        <el-form-item
                            class="widthVersion"
                            prop="firmwareVersion"
                            :label="$t('common.softwareVersion')"
                        >
                            <el-input
                                v-model="selectionForm.firmwareVersion"
                                :placeholder="$t('common.input')"
                                clearable
                            ></el-input>
                        </el-form-item>
                        <!-- 设备序列号 -->
                        <el-form-item
                            class="widthVersion"
                            prop="deviceSerialNum"
                            :label="$t('common.deviceSerialNum')"
                        >
                            <el-input
                                v-model="selectionForm.deviceSerialNum"
                                :placeholder="$t('common.input')"
                                clearable
                            ></el-input>
                        </el-form-item>
                        <!-- 终端手机号 -->
                        <el-form-item
                            class="widthVersion"
                            prop="deviceCode"
                            :label="$t('common.deviceCode')"
                        >
                            <el-input
                                v-model="selectionForm.deviceCode"
                                :placeholder="$t('common.input')"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-form>
                    <div style="margin-top: 36px">
                        <el-button type="primary" @click="selectionSearch">
                            <!-- 查询 -->
                            {{ $t("common.search") }}
                        </el-button>
                        <el-button type="default" @click="selectionReset">
                            <!-- 清除条件 -->
                            {{ $t("common.reset") }}
                        </el-button>
                    </div>
                </div>
                <div class="selection-deviceModelCode">
                    <!-- 设备型号 -->
                    {{ $t("common.deviceModelCode") }}：<span
                        v-if="selectionData.length"
                    >
                        {{ selection[0].deviceModelCode
                        }}<span v-if="selection[0].protocolName"
                            >({{ selection[0].protocolName }})</span
                        > </span
                    ><span v-else>--</span>
                </div>
                <div class="m-y p-x">
                    <el-table
                        border
                        :data="
                            selectionData.slice(
                                (selectionParams.currentPage - 1) *
                                    selectionParams.pageSize,
                                selectionParams.currentPage *
                                    selectionParams.pageSize
                            )
                        "
                        style="width: 100%"
                        :row-key="'deviceId'"
                        :height="400"
                    >
                        <!-- 序号 -->
                        <el-table-column
                            :label="$t('equipmentInspection.serialNumber')"
                            type="index"
                            width="50"
                        >
                        </el-table-column>
                        <!-- 车牌号 -->
                        <el-table-column
                            prop="plateNum"
                            :label="$t('common.plateNum')"
                            min-width="160px"
                        >
                        </el-table-column>
                        <!-- 所属组织 -->
                        <el-table-column
                            prop="organizeName"
                            :label="$t('common.orgPath')"
                            min-width="300px"
                            show-overflow-tooltip
                        ></el-table-column>
                        <!-- 设备版本号 -->
                        <el-table-column
                            prop="softwareVersion"
                            :label="$t('common.softwareVersion')"
                            min-width="165px"
                            show-overflow-tooltip
                        >
                        </el-table-column>
                        <!-- 设备序列号 -->
                        <el-table-column
                            prop="deviceSerialNum"
                            :label="$t('common.deviceSerialNum')"
                            min-width="125px"
                        >
                        </el-table-column>
                        <!-- 终端手机号 -->
                        <el-table-column
                            prop="deviceCode"
                            :label="$t('common.deviceCode')"
                            min-width="120px"
                        >
                        </el-table-column>
                        <el-table-column
                            :label="$t('common.operate')"
                            width="100"
                        >
                            <template slot-scope="scope">
                                <a @click="deleteSelection(scope.row)">
                                    <!-- 移除 -->
                                    {{ $t("devLog.remove") }}
                                </a>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="p-x wrap-bottom">
                    <el-pagination
                        :current-page="selectionParams.currentPage"
                        @size-change="handleSelectionSizeChange"
                        @current-change="handleSelectionCurrentChange"
                        :page-sizes="[20, 50, 100]"
                        :page-size="selectionParams.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="selectionData.length"
                    >
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
        <!-- 批量导入升级 -->
        <el-dialog
            :title="$t('deviceUpgrade.batchImportUpgrade')"
            :visible.sync="bulkImportVisible"
            :width="'900px'"
            @close="closeBulkImport"
        >
            <div class="bulk-import">
                <p>
                    <span>
                        <!-- 待升级车辆 -->
                        {{ $t("deviceUpgrade.vehicleUpgraded") }}： </span
                    ><el-button
                        @click="doBulkImport(false)"
                        :loading="importLoading"
                    >
                        <i class="el-icon-refresh_sm"></i>
                        <!-- 检查内容 -->
                        {{ $t("parameterQuery.inspectionContent") }}
                    </el-button>
                </p>
                <div>
                    <div class="type-select">
                        <el-select
                            v-model="bulkImportForm.type"
                            :placeholder="$t('common.select')"
                            @change="typeChange"
                        >
                            <el-option
                                :label="item.label"
                                :value="item.value"
                                :key="item.value"
                                v-for="item in typeList"
                            ></el-option>
                        </el-select>
                        <!-- :placeholder="`${typeListSelected}查询，请输入至少三位${typeListSelected}`" -->
                        <el-select
                            v-model="bulkImportForm.plateNum"
                            :placeholder="`${typeListSelected}${$t(
                                'common.search'
                            )}，${$t(
                                'parameterQuery.enterLeastThree'
                            )}${typeListSelected}`"
                            remote
                            :remote-method="remoteMethod2"
                            filterable
                            clearable
                            v-selectLoadMore="selectLoadMore2"
                            @visible-change="visibleHandler"
                            @change="selectCar"
                        >
                            <template slot="prefix"
                                ><span
                                    ><i class="iconfont icon-chaxun"></i></span
                            ></template>
                            <el-option
                                v-for="item in bulkImportForm.plateArr"
                                :key="item.id"
                                :value="item.value"
                                :label="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                    <!-- :placeholder="`输入${typeListSelected}，请用逗号或分号分隔`" -->
                    <el-input
                        type="textarea"
                        :rows="10"
                        :spellcheck="false"
                        :placeholder="`${$t(
                            'common.input'
                        )}${typeListSelected}，${$t(
                            'parameterQuery.pleaseSeparate'
                        )}`"
                        v-model="bulkImportForm.textarea"
                        @blur="plateNumBlur"
                    >
                    </el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="bulkImportVisible = false">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button
                    type="primary"
                    @click="doBulkImport(true)"
                    :loading="importLoading"
                >
                    <!-- 下一步 -->
                    {{ $t("common.nextStep") }}
                </el-button>
            </span>
        </el-dialog>
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
                        }}有多种设备型号，请选择其中一种进行升级 -->
                        {{
                            $t("deviceUpgrade.chooseOneToUpgrade", {
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
                        {{ $t("deviceUpgrade.theVehicle") }}
                    </el-radio>
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
//import Vue from "vue";
import Vue from "vue/dist/vue.esm.js";
import upgradeProgress from "@/components/upgradeProgress";

/**
 * select 下拉框 底部触发指令
 */
Vue.directive("selectLoadMore", {
    bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(
            ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function () {
            if (this.scrollHeight - this.scrollTop < this.clientHeight + 1) {
                binding.value();
            }
        });
    },
});
export default {
    name: "deviceUpgrade",
    components: { upgradeProgress },
    data() {
        const validateName = (rule, value, callback) => {
            if (this.isValidate && !value) {
                // 请选择一种设备型号！
                callback(new Error(this.$t("deviceUpgrade.selectDeviceModel")));
            } else {
                callback();
            }
        };
        return {
            typeListSelected: this.$t("common.plateNum"), //"车牌号",
            typeList: [
                {
                    label: this.$t("common.plateNum"), //"车牌号",
                    value: 1,
                },
                {
                    label: this.$t("common.deviceCode"), //"终端手机号",
                    value: 2,
                },
                {
                    label: this.$t("common.deviceSerialNum"), //"设备序列号",
                    value: 3,
                },
                {
                    label: this.$t("common.vin"), //"VIN码",
                    value: 4,
                },
            ],
            rules: {
                deviceModelCode: [
                    {
                        required: false,
                        trigger: "change",
                        validator: validateName,
                    },
                ],
            },
            isValidate: false,
            importLoading: false,
            deviceListVisible: false,
            selectionVisible: false,
            bulkImportVisible: false,
            treeBoolean: false,
            searchLoading: true,
            tableOrder: null,
            filterTagLength: 0,
            loading: false,
            loadingAll: false,
            tableHeight: 500,
            treeHeight: 500,
            buttonClick: false,
            iconShow: false,
            treeData: [],
            TreeExpanded: [],
            defaultProps: {
                children: "children",
                label: "name",
            },
            currentNode: {},
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "", //排序列
                orderDir: "", //排序方向
                organizeId: null,
                checked: true,
            },
            selectionParams: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },
            query: "",
            query2: "",
            selectIs: 1, //版本号选择is/no
            tableData: [],
            deviceModelList: [],
            listMaterial: {},
            deviceStatusList: [
                {
                    value: "",
                    label: this.$t("common.all"), //"全部"
                },
                {
                    value: 0,
                    label: this.$t("common.deviceStatus_0"), //"离线"
                },
                {
                    value: 1,
                    label: this.$t("common.deviceStatus_1"), //"在线"
                },
                {
                    value: 2,
                    label: this.$t("common.deviceStatus_2"), // "休眠"
                },
            ],
            searchForm: {
                realDeviceModelCode: "", //产品型号
                deviceModelCode: "", //设备型号
                firmwareVersion: "", //设备版本号
                deviceSerialNum: "", //设备序列号
                deviceCode: "", //终端手机号
                deviceStatus: "", //设备状态
                carId: "",
                plateNum: "",
                plateJson: {},
                plateArr: [],
                upgradeState: "", //末次升级状态
                errorReason: "", //失败原因
                vin: "",
                deviceIds: "",
                selectObj: {},
            },
            bulkImportForm: {
                carId: "",
                plateNum: "",
                plateJson: {},
                plateArr: [],
                textarea: "",
                type: 1,
            },
            total: 0,
            selection: [],
            plSelection: [],
            selectionIds: [],
            selectProductKey: "",
            selectSoftwareVersion: "",
            allProductKey: "",
            redIcon: false,
            redIconstyle: false,
            timer: null,
            organizationName: "",
            pageSizeCar: 20, //车牌分页数量
            currentPageCar: 1, //车牌页码
            haveDataCar: true,
            totalPagesCar: "",
            closeFlag: false,
            nowHoverCellRow: "",
            nowHover: "",
            hoverRow: "",
            selectionData: [],
            selectionForm: {
                plateNum: "",
                firmwareVersion: "",
                deviceSerialNum: "",
                deviceCode: "",
                deviceStatus: "",
            },
            deviceInfoList: [],
            deviceModelCode: "",
            outDevInfo: [],
            deviceDicList: [],
        };
    },
    watch: {
        "params.checked": {
            handler(val) {
                this.params.currentPage = 1;
                this.search();
            },
            deep: true,
        },
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
        "searchForm.carId": {
            handler(val) {
                if (!val && this.query.length < 3) {
                    this.searchForm.plateArr = [];
                }
                this.searchForm.plateNum =
                    this.searchForm.plateJson[this.searchForm.carId];
            },
            deep: true,
        },
        "bulkImportForm.carId": {
            handler(val) {
                if (!val && this.query.length < 3) {
                    this.bulkImportForm.plateArr = [];
                }
                this.bulkImportForm.plateNum =
                    this.bulkImportForm.plateJson[this.bulkImportForm.carId];
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val.length < 3 && !this.searchForm.carId) {
                    this.searchForm.plateArr = [];
                }
            },
            deep: true,
        },
        query2: {
            handler(val) {
                if (val.length < 3 && !this.bulkImportForm.carId) {
                    this.bulkImportForm.plateArr = [];
                }
            },
            deep: true,
        },
    },
    methods: {
        copyCarNumber(carNumber) {
            let oInput = document.createElement("input");
            oInput.value = carNumber;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象;
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.remove();
            // 复制成功
            this.$message.success(
                this.$t("conditionMonitoring.replicatingSuccess")
            );
        },
        cellMouseEnter(row, col) {
            this.nowHover = row.deviceId;
            this.hoverRow = row;
            if (col.label === this.$t("common.plateNum")) {
                this.nowHoverCellRow = row.deviceId;
            } else {
                this.nowHoverCellRow = "";
            }
        },

        //筛选
        filterHandler(value, row, column) {
            const property = column["property"];
            return row[property] === value;
        },
        filterTag(value, row) {
            return row.deviceStatus === value;
        },
        filterNode(value, data) {
            return data[value];
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
        filterChange(val) {
            for (let i in val) {
                this.filterTagLength = val[i].length;
            }
        },
        //自定义表头
        renderHeader(h, { column, $index }) {
            return h("span", { class: "poptip" }, [
                h("span", this.$t("common.deviceStatus")), //表格当前列标题
                h(
                    "Poptip",
                    {
                        props: {
                            placement: "top",
                            width: "80px",
                            trigger: "hover",
                            offset: 2,
                            transfer: true,
                            title: this.$t("common.deviceStatus"),
                        },
                        style: {
                            "font-weight": "400",
                        },
                    },
                    [
                        h("Icon", {
                            props: {
                                type: "information-circled",
                                color: "#B9BCCD",
                                size: "12",
                            },
                            style: {
                                "margin-left": "4px",
                                "margin-top": "10px",
                            },
                        }),
                        h(
                            "span",
                            { slot: "content" },
                            this.$t("common.deviceStatusDesc")
                            // "绿色为在线，深黄色是深休眠，浅黄色是浅休眠，灰色为离线"
                        ),
                    ]
                ),
            ]);
        },
        changeSort(val) {
            this.tableOrder = val.order;
        },
        //异常去 修改
        toChange(type, val) {
            if (type == 1) {
                this.$router.push({
                    path: "/manageCenter/plateNumAndDeviceCode",
                    query: {
                        plateNum: val,
                    },
                });
            } else {
                this.$router.push({
                    path: "/manageCenter/plateNumAndDeviceCode",
                    query: {
                        deviceCode: val,
                    },
                });
            }
        },
        // 导出
        goExport() {
            if (!this.params.organizeId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                if (this.total > 0) {
                    this.$message({
                        showClose: true,
                        message: this.$t(
                            "deviceUpgrade.deviceUpgradeListDataIsBeingPrepared"
                        ), //"设备升级列表数据正在准备中，该过程可能持续几分钟，请耐心等待….",
                    });
                }
                let params = Object.assign(
                    { organizeId: this.params.organizeId },
                    this.searchForm
                );
                params["containChildOrg"] = this.params.checked ? 1 : 0;
                delete params.selectObj;
                this.$api
                    .newUpgradeExportDeviceUpgradeList(params)
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
                                                _this.$api.eventTrackTrigger({
                                                    menu: "DEVICE_UPGRADE",
                                                    business:
                                                        "DEVICE_UPGRADE_INFO_EXPORT",
                                                    eventResult: true,
                                                });
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
        beforeDestroy() {
            clearInterval(this.timer);
            this.timer = null;
        },
        //设备型号选择
        productChange(val) {},
        handleSizeChange(val) {
            this.params.currentPage = 1;
            this.params.pageSize = val;
            this.search();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.search();
        },
        handleSelectionSizeChange(val) {
            this.selectionParams.pageSize = val;
        },
        handleSelectionCurrentChange(val) {
            this.selectionParams.currentPage = val;
        },
        checkOrgDeviceModelInfo() {
            const params = {
                organizeId: this.params.organizeId,
            };
            this.allProductKey = "";
            this.treeBoolean = true;
            this.$api.checkOrgDeviceModelInfo(params).then((res) => {
                if (res.success == true) {
                    this.allProductKey = res.data.deviceModelCode;
                } else {
                }
                this.treeBoolean = false;
            });
        },
        getDevUpgradeLogModifyStatus() {
            this.$api.getDevUpgradeLogModifyStatus().then((res) => {
                if (res.success == true) {
                    this.redIcon = res.data.count > 0 ? true : false;
                } else {
                }
            });
        },

        //获取车牌号下拉信息
        getPlateNumList(jsonData, isDialog) {
            // this.loading = true;
            let param = {
                orgId: this.params.organizeId,
                pageSize: this.pageSizeCar,
                currentPage: this.currentPageCar,
            };
            let params = Object.assign({}, param, jsonData);
            if (isDialog) {
                delete params.orgId;
            }
            this.$api.carDropDown(params).then((res) => {
                if (res.success == true) {
                    // this.searchForm.plateArr = res.data
                    this.totalPagesCar = res.data.totalPages;
                    let temp =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : temp;
                    this.searchForm.plateArr = (
                        this.currentPageCar === 1
                            ? []
                            : this.searchForm.plateArr
                    ).concat(temp);
                    if (res.data.length < 20) {
                        this.haveDataCar = false;
                    }
                    if (this.searchForm.plateArr.length) {
                        res.data.results.forEach((item) => {
                            this.searchForm.plateJson[item.id] = item.plateNum;
                        });
                    }

                    // this.loading = false;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //获取车牌号下拉信息
        getPlateNumList2(jsonData, isDialog) {
            // this.loading = true;
            let param = {
                type: this.bulkImportForm.type,
                pageSize: this.pageSizeCar,
                currentPage: this.currentPageCar,
            };
            let params = Object.assign({}, param, jsonData);
            if (isDialog) {
                delete params.orgId;
            }
            this.$api.deviceSearchDropDown(params).then((res) => {
                if (res.success == true) {
                    // this.searchForm.plateArr = res.data
                    this.totalPagesCar = res.data.totalPages;
                    let temp =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : temp;
                    this.bulkImportForm.plateArr = (
                        this.currentPageCar === 1
                            ? []
                            : this.bulkImportForm.plateArr
                    ).concat(temp);
                    if (res.data.length < 20) {
                        this.haveDataCar = false;
                    }
                    if (this.bulkImportForm.plateArr.length) {
                        res.data.results.forEach((item) => {
                            this.bulkImportForm.plateJson[item.id] =
                                item.plateNum;
                        });
                    }

                    // this.loading = false;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //下拉加载更多
        selectLoadMore() {
            this.currentPageCar += 1;
            if (this.currentPageCar > this.totalPagesCar) return;
            this.getPlateNumList({ plateNum: this.query }); // 请求接口
        },
        //下拉加载更多
        selectLoadMore2() {
            this.currentPageCar += 1;
            if (this.currentPageCar > this.totalPagesCar) return;
            this.getPlateNumList2({ value: this.query }); // 请求接口
        },
        //下拉框收取
        visibleHandler() {
            this.currentPageCar = 1; //手机号页码
            this.totalPagesCar = "";
            this.bulkImportForm.plateArr = [];
        },
        //远程搜索
        remoteMethod(query) {
            this.currentPageCar = 1;
            this.query = query;
            this.haveDataCar = true;
            if (query.length >= 3) {
                this.getPlateNumList({ plateNum: query });
            }
        },
        //远程搜索
        remoteMethod2(query2) {
            this.currentPageCar = 1;
            this.query2 = query2;
            this.haveDataCar = true;
            if (query2.length >= 3) {
                this.getPlateNumList2({ value: query2 }, true);
            }
        },
        // 获取设备升级组织树
        getDeviceUpgradOrgTeeData() {
            this.$api.getGroupTreeHik_upgrade().then((res) => {
                this.TreeExpanded = [];
                this.treeData = [];
                if (res.success == true) {
                    this.treeData = res.data;
                    if (res.data.length > 0) {
                        // this.params.organizeId = res.data[0].id;
                        this.params.organizeId = this.$store.state.tree
                            .deviceUpgradeId
                            ? this.$store.state.tree.deviceUpgradeId
                            : res.data[0].id;
                        this.searchForm = this.$store.state.tree.searchForm
                            ? this.$store.state.tree.searchForm
                            : this.searchForm;
                        if (this.$store.state.tree.defaultOrganizeId) {
                            this.params.organizeId =
                                this.$store.state.tree.defaultOrganizeId;
                            this.TreeExpanded.push(
                                this.$store.state.tree.defaultOrganizeId
                            );
                        }
                        this.currentNode = res.data[0];
                        this.$nextTick(() => {
                            this.treeData.forEach((m) => {
                                this.TreeExpanded.push(m.id);
                            });
                            this.$refs["tree"].setCurrentKey(
                                this.params.organizeId
                            );
                        });
                        if (this.$store.state.tree.deviceUpgradeId) {
                            this.TreeExpanded.push(
                                this.$store.state.tree.deviceUpgradeId
                            );
                        }

                        this.setDeault();
                        this.getDeviceModelList();
                        this.checkOrgDeviceModelInfo();
                    } else {
                        this.searchLoading = false;
                    }
                } else {
                    this.searchLoading = false;
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
        //左边树
        handleNodeClick(data) {
            this.currentNode = data;
            this.params.currentPage = 1;
            this.params.organizeId = data.id;
            // for(let key in this.searchForm){
            //   this.searchForm[key] = ''
            // }
            this.search();
            this.checkOrgDeviceModelInfo();
            this.getDeviceModelList();
            this.$store.dispatch("SetDeviceUpgradeId", data.id);
            this.$store.dispatch("SetDefaultOrganizeId", data.id);
        },
        //查询重置
        handleClick() {
            this.buttonClick = !this.buttonClick;
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        // 多选事件
        onSelectionChange(selection) {
            this.plSelection = selection.filter((i) => {
                return i.rowspan != 0;
            });
            this.selection = selection;

            let list = [];
            this.selection.forEach((i) => {
                list.push(i.deviceId);
            });
            this.selectionIds = list;

            if (selection.length > 0) {
                this.selectProductKey = selection[0].deviceModelCode;
                // this.selectSoftwareVersion=selection[0].firmwareVersion
            } else {
                this.selectProductKey = "";
                // this.selectSoftwareVersion=''
            }
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        selectable(row, index) {
            if (this.selectProductKey) {
                return row.deviceModelCode === this.selectProductKey;
            } else {
                return true;
            }
        },
        selectAll(selection, selected) {
            if (this.$refs.table.store.states.isAllSelected) {
                if (this.tableData.length > 0) {
                    const deviceModelCode = this.tableData[0].deviceModelCode;
                    let isSame = true;
                    this.tableData.map((i) => {
                        if (i.deviceModelCode != deviceModelCode) {
                            isSame = false;
                        }
                    });
                    if (!isSame) {
                        selection.forEach((item) => {
                            this.$nextTick(() => {
                                this.$refs.table &&
                                    this.$refs.table.toggleRowSelection(
                                        item,
                                        false
                                    );
                            });
                        });
                        // 批量升级操作只能选择一种设备型号
                        this.$message.warning(
                            this.$t(
                                "deviceUpgrade.batchUpgradeSelectOneDeviceModel"
                            )
                        );
                    } else {
                        this.plSelection = this.tableData.filter((i) => {
                            return i.rowspan != 0;
                        });
                    }
                }
            } else {
                this.plSelection = [];
            }
        },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
                this.$store.dispatch("SetCondtion", this.searchForm);
            }
        },
        // 表格搜索
        search() {
            if (this.$refs.searchForm) {
                this.$refs.searchForm.clearValidate();
            }
            if (!this.params.organizeId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            let params = Object.assign(this.params, this.searchForm);
            params["containChildOrg"] = this.params.checked ? 1 : 0;

            delete params.selectObj;

            this.getData(params);
            this.$store.dispatch("SetCondtion", this.searchForm);
        },
        /*获取table列表*/
        getData(params) {
            this.searchLoading = true;
            this.$api
                .newUpgradePage(params)
                .then((res) => {
                    if (res.success == true) {
                        this.tableData = res.data.results;
                        this.total = res.data.totalRecords;
                        this.$nextTick(() => {
                            this.setTableHeight();
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.searchLoading = false;
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        //批量升级
        goUpgrade(deviceModelCode, ids) {
            // 批量升级操作只能选择一种设备型号
            if (this.selection.length > 0) {
                const deviceModelCode = this.selection[0].deviceModelCode;
                let isSame = true;
                this.selection.map((i) => {
                    if (i.deviceModelCode != deviceModelCode) {
                        isSame = false;
                    }
                });
                if (!isSame) {
                    // 批量升级操作只能选择一种设备型号
                    this.$message.warning(
                        this.$t(
                            "deviceUpgrade.batchUpgradeSelectOneDeviceModel"
                        )
                    );
                    return;
                }
            }
            if (ids && ids.length <= 0) {
                // 请选择升级的设备
                this.$message.warning(
                    this.$t("deviceUpgrade.selectUpgradedDevice")
                );
                return;
            }
            this.$router.push({
                path: "/maintenanceCenter/deviceUpgrade/upgrade",
                query: {
                    deviceModelCode,
                    organizeId: this.params.organizeId,
                    deviceIds: ids,
                    business: "DEVICE_UPGRADE_BATCH",
                },
            });
        },
        //整组升级
        goAllUpgrade() {
            if (this.allProductKey) {
                this.$router.push({
                    path: "/maintenanceCenter/deviceUpgrade/upgrade",
                    query: {
                        deviceModelCode: this.allProductKey,
                        organizeId: this.params.organizeId,
                        deviceStatus: this.searchForm.deviceStatus,
                        deviceCode: this.searchForm.deviceCode,
                        firmwareVersion: this.searchForm.firmwareVersion,
                        realDeviceModelCode:
                            this.searchForm.realDeviceModelCode,
                        business: "DEVICE_UPGRADE_GROUP",
                    },
                });
            } else {
                if (!this.searchForm.deviceModelCode) {
                    this.isValidate = true;
                    this.$refs.searchForm.validateField("deviceModelCode");
                    this.isValidate = false;
                    return;
                }
                if (!(this.tableData && this.tableData.length)) {
                    // 无设备可以升级！
                    this.$message.warning(
                        this.$t("deviceUpgrade.noDevicesCanBeUpgraded")
                    );
                    return;
                }
                this.$router.push({
                    path: "/maintenanceCenter/deviceUpgrade/upgrade",
                    query: {
                        organizeId: this.params.organizeId,
                        deviceId: this.searchForm.deviceId,
                        deviceModelCode: this.searchForm.deviceModelCode,
                        deviceStatus: this.searchForm.deviceStatus,
                        firmwareVersion: this.searchForm.firmwareVersion,
                        realDeviceModelCode:
                            this.searchForm.realDeviceModelCode,
                        business: "DEVICE_UPGRADE_GROUP",
                    },
                });
            }
        },
        //单个升级
        goSingleUpgrade(deviceModelCode, data) {
            this.$router.push({
                path: "/maintenanceCenter/deviceUpgrade/upgrade",
                query: {
                    deviceModelCode,
                    organizeId: this.params.organizeId,
                    deviceIds: [data.deviceId],
                    business: "DEVICE_UPGRADE_SINGLE",
                },
            });
        },
        //历史
        goHistory(
            deviceId,
            upgradeState,
            plateNum,
            treeLevel,
            orgPath,
            vin,
            deviceSerialNum,
            deviceCode,
            deviceModelCode,
            protocolName,
            manufacturerNameString,
            installerString,
            accessProtocol
        ) {
            this.$router.push({
                path: "/maintenanceCenter/deviceUpgrade/history",
                query: {
                    plateNum: plateNum,
                    upgradeState: upgradeState,
                    deviceId: deviceId,
                    organizeId: this.params.organizeId,
                    treeLevel: treeLevel,
                    orgPath: orgPath,
                    vin: vin,
                    deviceSerialNum: deviceSerialNum,
                    deviceCode: deviceCode,
                    deviceModelCode: deviceModelCode,
                    protocolName: protocolName,
                    manufacturerNameString: manufacturerNameString,
                    installerString: installerString,
                    accessProtocol: accessProtocol,
                },
            });
        },

        //设备固件管理
        goFirmWare() {
            this.$router.push({
                path: "/maintenanceCenter/deviceUpgrade/firmware",
                // query: {
                //     organizeId: this.params.organizeId,
                // },
            });
        },
        //我的升级任务
        goDetail() {
            this.$router.push({
                path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeTask",
                // query: { organizeId: this.params.organizeId },
            });
        },
        //未完成升级
        goNoComplete() {
            this.$router.push({
                path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeNoComplete",
            });
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchAlert.clientHeight -
                this.$refs.searchPagination.clientHeight -
                111;
            this.treeHeight = document.body.clientHeight - 149;
        },
        //关闭提示文案
        closeAlert() {
            this.closeFlag = true;
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
        clearSelection() {
            if (!this.selection.length) {
                return;
            }
            this.$refs.table.clearSelection();
            this.selection = [];
            // 取消成功
            this.$message.success(this.$t("devLog.cancelSuccessfully"));
        },
        openBulkImport() {
            this.bulkImportForm.plateArr = [];
            // this.bulkImportForm.plateNum =
            //     this.bulkImportForm.plateJson[this.bulkImportForm.carId];
            this.bulkImportVisible = true;
            this.bulkImportForm.type = 1;
            this.bulkImportForm.plateNum = "";
            this.bulkImportForm.textarea = "";
            this.typeListSelected = this.$t("common.plateNum");
        },
        closeBulkImport() {
            this.bulkImportForm.plateArr = [];
        },
        openSelection() {
            this.selectionParams.currentPage = 1;
            this.selectionParams.pageSize = 20;
            this.selectionVisible = true;
            this.selectionForm = {
                plateNum: "",
                firmwareVersion: "",
                deviceSerialNum: "",
                deviceCode: "",
                deviceStatus: "",
            };
            this.selectionData = JSON.parse(JSON.stringify(this.selection));
        },
        selectionSearch() {
            this.selectionParams.currentPage = 1;
            this.selectionData = JSON.parse(JSON.stringify(this.selection));
            for (key in this.selectionForm) {
                if (
                    key === "deviceStatus" &&
                    (this.selectionForm["deviceStatus"] === 0 ||
                        this.selectionForm["deviceStatus"] === 1 ||
                        this.selectionForm["deviceStatus"] === 2)
                ) {
                    this.selectionData = this.selectionData.filter(
                        (item) => item[key] === this.selectionForm[key]
                    );
                } else if (this.selectionForm[key]) {
                    this.selectionData = this.selectionData.filter((item) => {
                        return (
                            item[key] &&
                            item[key].indexOf(this.selectionForm[key]) > -1
                        );
                    });
                }
            }
        },
        selectionReset() {
            this.$refs.selectionForm.resetFields();
        },
        deleteSelection(row) {
            this.$refs.table.toggleRowSelection(
                this.$refs.table.selection.find(
                    (item) => item.deviceId === row.deviceId
                ),
                false
            );
            this.selectionData.map((item, index) => {
                if (item.deviceId === row.deviceId) {
                    this.selectionData.splice(index, 1);
                }
            });
            this.selection.map((item, index) => {
                if (item.deviceId === row.deviceId) {
                    this.selection.splice(index, 1);
                }
            });
            if (this.selection.length === 0) {
                this.selectProductKey = "";
            }
            let list = [];
            this.selection.forEach((i) => {
                list.push(i.deviceId);
            });
            this.selectionIds = list;
        },
        doBulkImport(falg) {
            if (!this.bulkImportForm.textarea) {
                // 请输入待升级
                this.$message.warning(
                    `${this.$t("deviceUpgrade.pleaseEnterToUpgrade")}${
                        this.typeListSelected
                    }`
                );
                return;
            }
            this.importLoading = true;
            this.$api
                .getGroupDeviceByModelCodeDto({
                    type: this.bulkImportForm.type,
                    values: this.bulkImportForm.textarea.split("，"),
                })
                .then((res) => {
                    if (res.success == true) {
                        if (res.data.message) {
                            this.$message.warning(res.data.message);
                            let plateNumArr =
                                this.bulkImportForm.textarea.split("，");
                            let newPlateNumArr = plateNumArr.filter(
                                (x) =>
                                    !res.data.nonexistentList.some(
                                        (y) => y === x
                                    )
                            );
                            this.bulkImportForm.textarea = [
                                ...new Set(newPlateNumArr),
                            ]
                                .filter((item) => item)
                                .join("，");
                        }
                        if (res.data.modelVoList.length && falg) {
                            this.deviceInfoList = res.data.modelVoList;
                            if (this.deviceInfoList.length > 1) {
                                this.deviceInfoList.forEach((item) => {
                                    item.disabled = false;
                                });
                                this.deviceModelCode =
                                    this.deviceInfoList[0].deviceModelCode;
                                this.deviceListVisible = true;
                            } else {
                                this.$router.push({
                                    path: "/maintenanceCenter/deviceUpgrade/upgrade",
                                    query: {
                                        deviceModelCode:
                                            this.deviceInfoList[0]
                                                .deviceModelCode,
                                        organizeId: this.params.organizeId,
                                        deviceIds:
                                            this.deviceInfoList[0].checkDeviceInfos.reduce(
                                                (prev, cur) => {
                                                    return prev.concat(
                                                        cur["deviceId"]
                                                    );
                                                },
                                                []
                                            ),
                                        business: "DEVICE_UPGRADE_BATCH_IMPORT",
                                    },
                                });
                            }
                        }
                        this.importLoading = false;
                    } else {
                        this.$message.error(res.msg);
                        this.importLoading = false;
                    }
                });
        },
        getRepeatArr(arr) {
            var temp = [];
            arr.forEach((item) => {
                if (
                    arr.indexOf(item) !== arr.lastIndexOf(item) &&
                    temp.indexOf(item) === -1
                ) {
                    temp.push(item);
                }
            });
            return temp;
        },
        selectCar(val) {
            this.bulkImportForm.textarea += `，${val}`;
            this.plateNumBlur();
            this.bulkImportForm.plateNum = "";
            this.searchForm.plateArr = [];
        },
        plateNumBlur() {
            this.bulkImportForm.textarea = this.bulkImportForm.textarea
                .replace(/\r\n|\n/g, "，")
                .replace(/\s/g, "")
                .replace(/\,|\;|\；|\。|\./g, "，");
            let plateNumArr = this.bulkImportForm.textarea
                .split("，")
                .filter((item) => !!item);
            let repeatArr = this.getRepeatArr(plateNumArr);
            this.bulkImportForm.textarea = [...new Set(plateNumArr)]
                .filter((item) => item)
                .join("，");
            if (repeatArr.length) {
                this.$message.warning(
                    `${repeatArr[0]}${
                        repeatArr.length > 1
                            ? this.$t("deviceManage.deviceSettingTest12") +
                              repeatArr.length +
                              this.$t("deviceLoadTaskManage.individual") +
                              this.typeListSelected
                            : ""
                    }${this.$t("deviceManage.deviceSettingTest14")}`
                );
            }
        },
        doDeviceList() {
            let deviceArr = this.deviceInfoList.find(
                (item) => item.deviceModelCode === this.deviceModelCode
            );
            sessionStorage.setItem(
                "deviceInfoList",
                JSON.stringify(this.deviceInfoList)
            );
            this.$router.push({
                path: "/maintenanceCenter/deviceUpgrade/upgrade",
                query: {
                    typeListSelected: this.typeListSelected,
                    deviceModelCode: deviceArr.deviceModelCode,
                    organizeId: this.params.organizeId,
                    deviceIds: deviceArr.checkDeviceInfos.reduce(
                        (prev, cur) => {
                            return prev.concat(cur["deviceId"]);
                        },
                        []
                    ),
                    business: "DEVICE_UPGRADE_BATCH_IMPORT",
                },
            });
        },
        showOutDevInfo(deviceId) {
            this.outDevInfo = {};
            this.$api.outDevInfo({ deviceId: deviceId }).then((res) => {
                if (res.success == true) {
                    this.outDevInfo = res.data;
                }
            });
        },
        getLabelSelf(val) {
            let attribute = this.deviceDicList.find(
                (e) => Number(e.sysDictCode) === Number(val)
            );
            if (attribute) {
                return attribute.sysDictName;
            } else {
                return "--";
            }
        },
        getDictionList() {
            this.$api
                .getDictionList({
                    dictType: "deviceLimitType",
                })
                .then((res) => {
                    if (res.success == true) {
                        this.deviceDicList = res.data;
                    }
                });
        },
        typeChange(val) {
            this.bulkImportForm.textarea = "";
            let obj = this.typeList.find((item) => item.value == val);
            this.typeListSelected = obj.label;
        },
        reUpgrade(date) {
            this.$confirm(
                // date.plateNum
                //     ? `此操作将会重新升级“${date.plateNum}”的“${date.deviceCode}”，是否确认重新升级?`
                //     : `此操作将会重新升级“${date.deviceCode}”，是否确认重新升级?`,
                date.plateNum
                    ? this.$t("deviceUpgrade.reUpgradeText1", {
                          plateNum: date.plateNum,
                          deviceCode: date.deviceCode,
                      })
                    : this.$t("deviceUpgrade.reUpgradeText2", {
                          deviceCode: date.deviceCode,
                      }),
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.$api
                        .newUpgradeReUpgrade({
                            taskDevIds: [date.taskDevId],
                        })
                        .then((res) => {
                            if (res.success == true) {
                                this.search();
                                // 已发送重新升级命令
                                this.$message.success(
                                    this.$t(
                                        "deviceUpgrade.sentReupgradeCommand"
                                    )
                                );
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                })
                .catch(() => {});
        },
        stopUpgrade(date) {
            this.$confirm(
                // date.plateNum
                //     ? `此操作将会终止手机号为“${date.deviceCode}”的“${date.plateNum}”的升级，是否确认终止升级?`
                //     : `此操作将会终止手机号为“${date.deviceCode}”的升级，是否确认终止升级?`,
                date.plateNum
                    ? this.$t("deviceUpgrade.stopUpgradeText1", {
                          plateNum: date.plateNum,
                          deviceCode: date.deviceCode,
                      })
                    : this.$t("deviceUpgrade.stopUpgradeText2", {
                          deviceCode: date.deviceCode,
                      }),
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.$api
                        .newUpgradeStopUpgrade({
                            taskDevIds: [date.taskDevId],
                        })
                        .then((res) => {
                            if (res.success == true) {
                                this.search();
                                // 终止成功
                                this.$message.success(
                                    this.$t(
                                        "deviceUpgrade.terminationSuccessful"
                                    )
                                );
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                })
                .catch(() => {});
        },
        setDeault() {
            let deviceUpgradeItem = JSON.parse(
                sessionStorage.getItem("deviceUpgradeItem")
            );
            if (deviceUpgradeItem) {
                this.searchForm.deviceId = deviceUpgradeItem.id;
                this.searchForm.selectObj = {
                    ...deviceUpgradeItem,
                    deviceId: deviceUpgradeItem.id,
                    html: `<span>${
                        deviceUpgradeItem.plateNum || "--"
                    }</span>；<span>${
                        deviceUpgradeItem.deviceCode || "--"
                    }</span>；<span>${
                        deviceUpgradeItem.deviceSerialNum || "--"
                    }</span>；<span>${deviceUpgradeItem.vin || "--"}</span>`,
                    title: `${deviceUpgradeItem.plateNum || "--"}；${
                        deviceUpgradeItem.deviceCode || "--"
                    }；${deviceUpgradeItem.deviceSerialNum || "--"}；${
                        deviceUpgradeItem.vin || "--"
                    }`,
                };
                // sessionStorage.removeItem("deviceUpgradeItem");
            }
            this.search();
        },
    },
    mounted() {
        this.setWrap();
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
                that.setWrap();
            })();
        };
        // this.timer = setInterval(() => {
        //     //创建定时器
        //     this.getDevUpgradeLogModifyStatus();
        // }, 30000);
        sessionStorage.removeItem("deviceInfoList");
    },
    created() {
        this.getDictionList();
        this.getDeviceUpgradOrgTeeData();
        // this.getDevUpgradeLogModifyStatus();
    },
};
</script>

<style lang="less" scoped>
.out-dev-info-box {
    max-height: 200px;
    overflow-y: auto;
    padding-right: 12px;
}
.out-dev-info {
    display: flex;
    flex-wrap: wrap;
    // flex-direction: column;
    &:not(:first-child) {
        border-top: 1px dashed #ccc;
        padding-top: 12px;
    }
    & > div {
        display: flex;
        width: 50%;
        margin-bottom: 12px;
        &.out-dev-info-ver {
            width: 100%;
            span:nth-child(2) {
                width: calc(~"100% - 80px");
                white-space: wrap;
            }
        }
        span:nth-child(1) {
            width: 80px;
            text-align: right;
        }
        span:nth-child(2) {
            width: calc(~"100% - 80px");
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
}
.out-dev-info-icon {
    font-size: 20px;
    cursor: pointer;
    &:hover {
        color: #409eff;
    }
}
.loading_ {
    pointer-events: none;
}
.el-icon-warning {
    cursor: pointer;
    font-size: 14px;
}
.marginBottom {
    margin-bottom: 0.5rem;
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
        }
        .el-form-item {
            margin-bottom: 20px !important;
        }
    }
    .wrap-bottom {
        border-top: 1px solid #e4e4e4;
    }
    .hidden {
        height: 46px;
        overflow: hidden;
    }
}
.flex-box {
    display: inline-block;
    cursor: pointer;
    padding: 2px 12px;
}
.copy {
    background: rgb(254, 228, 196);
}
.select-alert {
    background: #e6f7ff !important;
    border: 2px solid #91d5ff !important;
    border-radius: 2px;
    color: #000000 !important;
    padding: 6px 10px;
}
/deep/.el-alert {
    .el-alert__content,
    .el-alert__title {
        width: 100%;
        // height: 24px;
        // line-height: 24px;
    }
}
.alert-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > div > span {
        margin-right: 12px;
    }
    .el-button {
        color: #409eff;
        height: 18px;
    }
}
/deep/.bulk-import {
    font-size: 14px;
    p {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    & > div {
        border: 1px solid rgba(217, 217, 217, 1);
        border-radius: 2px;
    }
    .el-textarea {
        border-top: 1px solid rgba(217, 217, 217, 1);
    }
    .el-select {
        width: 100% !important;
    }
    .el-textarea__inner,
    .el-input__inner {
        border: none;
    }
    .type-select {
        display: flex;
        .el-select:nth-child(1) {
            width: 150px !important;
            border-right: 1px solid rgba(217, 217, 217, 1);
        }
    }
    .el-input__prefix {
        display: flex;
        align-items: center;
    }
}
/deep/.selection-box {
    .el-form-item {
        margin-bottom: 1rem !important;
    }
    .selection-deviceModelCode {
        color: #4d4d4d;
        padding-left: 16px;
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
.littleYellow {
    border: 1px solid rgba(255, 149, 44, 1);
    background-color: rgba(255, 149, 44, 0.8);
    color: white;
    position: relative;
    display: inline-block;
    height: 24px;
    box-sizing: border-box;
    padding: 0 8px;
    border-radius: 2px;
    font-size: 14px;
    line-height: 24px;
    white-space: nowrap;
}
.search-btn {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    width: 263px;
}
</style>
