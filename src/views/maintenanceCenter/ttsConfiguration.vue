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
                                inline
                                ref="searchForm"
                            >
                                <el-form-item
                                    :label="$t('common.keywords')"
                                    prop="deviceCode"
                                >
                                    <G-DeviceSearch
                                        :valueKey="'deviceCode'"
                                        :value.sync="searchForm.deviceCode"
                                        :selectObj.sync="searchForm.selectObj"
                                        :organizeId="params.organizeId"
                                    ></G-DeviceSearch>
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
                                <!-- 设备版本号 -->
                                <el-form-item
                                    prop="softwareVersion"
                                    :label="$t('common.softwareVersion')"
                                >
                                    <el-input
                                        v-model="searchForm.softwareVersion"
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
                                        :placeholder="$t('common.select')"
                                        clearable
                                        filterable
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
                                <!-- </div> -->
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
                                @click="goConfig(selectionIds)"
                                v-btn="'ttsConfigurationBatchConfiguration'"
                            >
                                <!-- 批量配置 -->
                                {{ $t("deviceManage.batchConfiguration")
                                }}{{
                                    selection.length > 0
                                        ? "（" + selection.length + "）"
                                        : ""
                                }}</el-button
                            >
                            <el-button
                                type="default"
                                :disabled="
                                    searchLoading || tableData.length == 0
                                "
                                @click="goAllConfig"
                                v-btn="
                                    'ttsConfigurationWholeGroupConfiguration'
                                "
                            >
                                <!-- 整组配置 -->
                                {{
                                    $t(
                                        "ttsConfiguration.wholeGroupConfiguration"
                                    )
                                }}
                            </el-button>
                            <el-button
                                type="default"
                                v-show="true"
                                @click="customizeTTS"
                                :disabled="!params.organizeId"
                                v-btn="'ttsConfigurationCustomConfiguration'"
                            >
                                <!-- 自定义配置 -->
                                {{ $t("ttsConfiguration.customConfiguration") }}
                            </el-button>
                            <el-button
                                type="default"
                                @click="goImport"
                                v-btn="'ttsConfigurationBatchImport'"
                            >
                                <!-- 批量导入 -->
                                {{ $t("ttsConfiguration.batchImport") }}
                            </el-button>
                        </div>
                        <div>
                            <el-badge :is-dot="redIcon">
                                <el-button
                                    type="default"
                                    @click="goTask"
                                    v-btn="
                                        'ttsConfigurationMyConfigurationTasks'
                                    "
                                >
                                    <!-- 我的配置任务 -->
                                    {{
                                        $t(
                                            "ttsConfiguration.myConfigurationTask"
                                        )
                                    }}
                                </el-button>
                                <el-button
                                    type="default"
                                    @click="goTaskNo"
                                    v-btn="
                                        'ttsConfigurationUnfinishedConfigurationTasks'
                                    "
                                >
                                    <!-- 未完成配置 -->
                                    {{
                                        $t(
                                            "ttsConfiguration.batchImportIncompleteConfiguration"
                                        )
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
                            <!-- 配置支持离线托管，设备在线时平台自动下发配置任务，无需等待！ -->
                            <el-alert
                                :title="
                                    $t('ttsConfiguration.ttsConfigurationAlert')
                                "
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
                                type="warning"
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
                        <!-- :default-sort="{prop: 'deviceParamLastTimeVo.ttsLastOne.time', order: 'descending'}" -->
                        <el-table
                            border
                            stripe
                            v-loading="searchLoading"
                            :element-loading-text="
                                $t('common.desperatelyLoading')
                            "
                            element-loading-color="#007213"
                            :data="tableData"
                            :height="tableHeight"
                            label-width="auto"
                            @selection-change="onSelectionChange"
                            @select-all="selectAll"
                            row-key="id"
                            ref="table"
                            @sort-change="changeSort"
                            @filter-change="filterChange"
                            @cell-mouse-enter="cellMouseEnter"
                        >
                            <el-table-column
                                type="selection"
                                :reserve-selection="true"
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
                                                    scope.row.id,
                                                'no-padding':
                                                    !scope.row.plateNum,
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
                                            v-show="scope.row.freeze == 1"
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
                            ></el-table-column>
                            <!-- 配置进度更新时间 -->
                            <el-table-column
                                prop="deviceParamLastTimeVo.ttsLastOne.time"
                                :label="
                                    $t(
                                        'ttsConfiguration.configureProgressUpdateTime'
                                    )
                                "
                                min-width="165px"
                                :render-header="
                                    (h) => {
                                        return h('span', { class: 'poptip' }, [
                                            h(
                                                'span',
                                                $t(
                                                    'ttsConfiguration.configureProgressUpdateTime'
                                                )
                                            ), //表格当前列标题
                                            h('Poptip', {
                                                props: {
                                                    placement: 'top',
                                                    width: '80px',
                                                    trigger: 'hover',
                                                    offset: 2,
                                                    transfer: true,
                                                },
                                                style: {
                                                    'font-weight': '400',
                                                },
                                            }),
                                        ]);
                                    }
                                "
                            >
                                <template slot-scope="scope">
                                    <span
                                        v-if="
                                            scope.row.deviceParamLastTimeVo
                                                .ttsLastOne
                                        "
                                        >{{
                                            scope.row.deviceParamLastTimeVo
                                                .ttsLastOne.time
                                        }}</span
                                    >
                                </template>
                            </el-table-column>
                            <!-- 终端手机号 -->
                            <el-table-column
                                prop="deviceCode"
                                :label="$t('common.deviceCode')"
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
                            <!-- sortable="custom" -->
                            <!-- 末次配置状态 -->
                            <el-table-column
                                prop="paramStatus"
                                :label="
                                    $t(
                                        'ttsConfiguration.lastConfigurationStatus'
                                    )
                                "
                                fixed="right"
                                min-width="160px"
                                show-overflow-tooltip
                            >
                                <template slot-scope="scope">
                                    <div
                                        v-if="
                                            scope.row.deviceParamLastTimeVo &&
                                            scope.row.deviceParamLastTimeVo
                                                .ttsLastOne &&
                                            scope.row.deviceParamLastTimeVo
                                                .ttsLastOne.status
                                        "
                                        class="one"
                                    >
                                        <span
                                            class="two"
                                            :class="
                                                statusList[
                                                    scope.row
                                                        .deviceParamLastTimeVo
                                                        .ttsLastOne.status
                                                ] &&
                                                statusList[
                                                    scope.row
                                                        .deviceParamLastTimeVo
                                                        .ttsLastOne.status
                                                ].color
                                            "
                                            >●</span
                                        >
                                        {{
                                            statusList[
                                                scope.row.deviceParamLastTimeVo
                                                    .ttsLastOne.status
                                            ] &&
                                            statusList[
                                                scope.row.deviceParamLastTimeVo
                                                    .ttsLastOne.status
                                            ].name
                                        }}
                                    </div>
                                    <div v-else>--</div>
                                </template>
                            </el-table-column>
                            <!-- 配置失败原因 -->
                            <el-table-column
                                prop="failReason"
                                :label="
                                    $t(
                                        'ttsConfiguration.reasonForConfigurationFailure'
                                    )
                                "
                                min-width="120px"
                                fixed="right"
                            >
                                <template slot-scope="scope">
                                    <div
                                        class="overflow-box"
                                        v-if="
                                            scope.row.deviceParamLastTimeVo &&
                                            scope.row.deviceParamLastTimeVo
                                                .ttsLastOne &&
                                            scope.row.deviceParamLastTimeVo
                                                .ttsLastOne.failReason
                                        "
                                        :title="
                                            scope.row.deviceParamLastTimeVo &&
                                            scope.row.deviceParamLastTimeVo
                                                .ttsLastOne &&
                                            scope.row.deviceParamLastTimeVo
                                                .ttsLastOne.failReason
                                        "
                                    >
                                        {{
                                            scope.row.deviceParamLastTimeVo &&
                                            scope.row.deviceParamLastTimeVo
                                                .ttsLastOne &&
                                            scope.row.deviceParamLastTimeVo
                                                .ttsLastOne.failReason
                                        }}
                                    </div>
                                    <div v-else>--</div>
                                </template>
                            </el-table-column>
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
                                            goConfiguration(
                                                [scope.row.id],
                                                scope.row.deviceStatus,
                                                scope.row.dormantStatus
                                            )
                                        "
                                        v-btn="'ttsConfigurationConfigure'"
                                    >
                                        <!-- 配置 -->
                                        {{
                                            $t("ttsConfiguration.configuration")
                                        }}
                                    </a>
                                    <a
                                        class="m-r-sm colorBlue"
                                        @click="showHistory(scope.row)"
                                        v-btn="
                                            'ttsConfigurationConfigurationHistory'
                                        "
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
            :custom-class="'selection-dialog'"
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
                            prop="softwareVersion"
                            :label="$t('common.softwareVersion')"
                        >
                            <el-input
                                v-model="selectionForm.softwareVersion"
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
                    <div style="margin-top: 32px">
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
                        >{{ selection[0].deviceModelCode
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
        <!-- 导入 -->
        <!-- :title="'批量导入'"
            :label="'设备标识'"
            :importResultTitle="'批量导入结果'" -->
        <importDialog
            :isOpen="isDevImportModalOpen"
            @on-finish="importFinish"
            @on-error="importError"
            :importColumns="[]"
            :action="deviceUploadUrl"
            :title="$t('ttsConfiguration.batchImport')"
            :importResultTitle="$t('ttsConfiguration.batchImportResults')"
            :moduleCode="''"
            :showWarning="true"
            @on-downloadTemplate="downDeviceTemplate"
            :templateCode="'ttsBatchConfigImport'"
            @on-cancel="doDeviceImportCancel"
        >
        </importDialog>
    </div>
</template>

<script>
import importDialog from "@/components/importDialog";
//import Vue from "vue";
import Vue from "vue/dist/vue.esm.js";

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
    name: "deviceManage2",
    components: { importDialog },
    data() {
        return {
            isDevImportModalOpen: false,
            deviceUploadUrl:
                (process.env.BASE_API == "/" ? "" : process.env.BASE_API) +
                "/deviceTTSConfig/importTTSTemplate",
            loading: false,
            searchLoading: true,
            filterTagLength: 0,
            tableOrder: null,
            // orderBy:'',//排序
            httpOption: "",
            tableHeight: 500,
            treeHeight: 500,
            buttonClick: false,
            loadingAll: false,
            iconShow: false,
            treeData: [],
            TreeExpanded: [],
            defaultProps: {
                children: "children",
                label: "name",
            },
            currentNode: {},
            params: {
                currentPage: 1, // 页码，从1开始
                pageSize: 20, // 分页大小
                orderColumn: "plateNum", // 排序列
                orderDir: "asc", // 排序方向
                organizeId: null,
            },
            tableData: [],
            deviceModelList: [],
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
                carId: "",
                plateNum: "",
                deviceSerialNum: "",
                deviceStatus: "",
                deviceCode: "",
                softwareVersion: "",
                deviceModelCode: "",
                plateJson: {},
                plateArr: [],
                selectObj: {},
            },
            total: 0,
            selection: [],
            selectionIds: [],
            plSelection: [],
            selectSoftwareVersion: "",
            statusList: {
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
            redIcon: false,
            redIconstyle: false,
            timer: null,
            organizationName: "",
            pageSizeCar: 20, //车牌分页数量
            currentPageCar: 1, //车牌页码
            haveDataCar: true,
            totalPagesCar: "",
            closeFlag: false,
            selectionParams: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },
            selectionData: [],
            selectionForm: {
                plateNum: "",
                softwareVersion: "",
                deviceSerialNum: "",
                deviceCode: "",
                deviceStatus: "",
            },
            selectionVisible: false,
            nowHoverCellRow: "",
            deviceDicList: [],
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
        "searchForm.carId": {
            handler(val) {
                if (!val && this.query && this.query.length < 3) {
                    this.searchForm.plateArr = [];
                }
                this.searchForm.plateNum =
                    this.searchForm.plateJson[this.searchForm.carId];
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val && val.length < 3 && !this.searchForm.carId) {
                    this.searchForm.plateArr = [];
                }
            },
            deep: true,
        },
    },
    methods: {
        //获取车牌号下拉信息
        getPlateNumList(jsonData) {
            // this.loading = true;
            let param = {
                orgId: this.params.organizeId,
                pageSize: this.pageSizeCar,
                currentPage: this.currentPageCar,
            };
            let params = Object.assign({}, param, jsonData);
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
        //下拉加载更多
        selectLoadMore() {
            this.currentPageCar += 1;
            if (this.currentPageCar > this.totalPagesCar) return;
            this.getPlateNumList({ plateNum: this.query }); // 请求接口
        },
        //下拉框收取
        visibleHandler() {
            (this.currentPageCar = 1), //手机号页码
                (this.totalPagesCar = "");
        },
        //远程搜索
        remoteMethod(query) {
            this.currentPageCar = 1;
            this.query = query;
            this.haveDataCar = true;
            if (query.length >= 3) {
                this.getPlateNumList({ plateNum: query });
            } else {
                this.searchForm.plateArr = [];
            }
        },
        //批量设置TTS
        customizeTTS() {
            this.$router.push({
                path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationCustomize",
                query: {
                    organizeId: this.params.organizeId,
                },
            });
        },
        // 获取设备型号下拉列表数据
        getDeviceModelList() {
            this.$api.getProductListByOrgId().then((res) => {
                if (res.success == true) {
                    this.deviceModelList = [
                        {
                            fieldNameEN: "",
                            fieldNameCN: this.$t("common.all"), //"全部"
                        },
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
        filterTree(data, val, type) {
            data.forEach((item) => {
                if (item.name.indexOf(val) !== -1) {
                    // item.show = true;
                    this.$set(item, "show", true);
                    this.itemChildren(item);
                } else {
                    this.$set(item, "show", false);
                    if (item.children.length > 0) {
                        this.filterTree(
                            item.children,
                            this.organizationName,
                            1
                        );
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
        filterNode(value, data) {
            return data[value];
        },
        changeSort(val) {
            this.tableOrder = val.order;
        },
        httpOptionChange(val) {
            // 仅查询勾选的设备

            if (val == 1) {
                if (this.selectionIds.length <= 0) {
                    // this.$message.warning("请选择需要查询的设备");
                    this.$message.warning(
                        this.$t("ttsConfiguration.selectDevice")
                    );
                    this.httpOption = "";
                    return;
                }
                const params = {
                    deviceIds: this.selectionIds,
                    organizeId: this.params.organizeId,
                };
                this.syncHttpDeviceConfigParams(params);
            } else if (val == 2) {
                // 查询整组设备
                const params = {
                    organizeId: this.params.organizeId,
                };
                this.syncHttpDeviceConfigParams(params);
            }
        },
        syncHttpDeviceConfigParams(params) {
            this.$api.syncHttpDeviceConfigParams(params).then((res) => {
                if (res.success == true) {
                    // this.$message("查询结果请点击:“配置-HTTP终端参数查询”");
                    this.$message(this.$t("ttsConfiguration.httpOptionText1"));
                    this.httpOption = "";
                } else {
                    // 通知设备以HTTP形式上报配置参数失败
                    this.$message.error(
                        this.$t("ttsConfiguration.httpOptionText2") +
                            ":" +
                            res.msg
                    );
                    this.httpOption = "";
                }
            });
        },
        filterChange(val) {
            for (const i in val) {
                this.filterTagLength = val[i].length;
                // console.log(val[i].length,'val[i].length')
            }
        },
        filterTag(value, row) {
            return row.deviceStatus === value;
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.search();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.search();
        },
        // 获取设备配置组织树
        getParamOrganizeTree() {
            this.$api.getTTSParamOrganizeTree().then((res) => {
                this.TreeExpanded = [];
                this.treeData = [];
                this.setTableHeight();
                if (res.success == true) {
                    this.treeData = res.data;
                    if (res.data.length > 0) {
                        // this.params.organizeId = res.data[0].id;
                        this.params.organizeId = this.$store.state.tree
                            .deviceConfigurationId
                            ? this.$store.state.tree.deviceConfigurationId
                            : res.data[0].id;
                        this.searchForm = this.$store.state.tree.searchForm
                            ? JSON.parse(
                                  JSON.stringify(
                                      this.$store.state.tree.searchForm
                                  )
                              )
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
                        if (this.$store.state.tree.deviceConfigurationId) {
                            this.TreeExpanded.push(
                                this.$store.state.tree.deviceConfigurationId
                            );
                        }
                        this.search();
                        this.getDeviceModelList();
                    } else {
                        this.searchLoading = false;
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleNodeClick(data) {
            this.params.currentPage = 1;
            this.currentNode = data;
            this.params.organizeId = data.id;
            this.search();
            this.getDeviceModelList();
            this.$store.dispatch("SetDeviceConfigurationId", data.id);
            this.$store.dispatch("SetDefaultOrganizeId", data.id);
        },
        handleClick() {
            this.buttonClick = !this.buttonClick;
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        // 多选事件
        onSelectionChange(selection) {
            this.plSelection = selection;
            this.selection = selection;

            const list = [];
            this.selection.forEach((i) => {
                list.push(i.id);
            });
            this.selectionIds = list;
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        selectAll(selection, selected) {
            if (selected) {
                if (this.tableData.length > 0) {
                    this.plSelection = this.tableData;
                }
            } else {
                this.plSelection = [];
            }
        },
        // 获取设备的设置时间
        getParamDeviceManage(params) {},
        /* 获取table列表*/
        getData(params) {
            this.searchLoading = true;
            this.$api
                .getTTSDevicePage(params)
                .then((res) => {
                    // this.tableData = res.data.results;
                    if (res.success == true) {
                        // const tableData = res.data.results;
                        // tableData.forEach(item => {
                        //   item.rowspan = tableData.filter(i => i.plateNum == item.plateNum).length;

                        // });
                        // for (let i = 1; i < tableData.length; i++) {
                        //   if (tableData[i].plateNum == tableData[i - 1].plateNum) {
                        //     tableData[i].rowspan = 0
                        //   }
                        // }

                        this.tableData = res.data.results;
                        this.tableData.forEach((item) => {
                            this.$api
                                .getParamDeviceById({ deviceId: item.id })
                                .then((response) => {
                                    if (
                                        JSON.stringify(
                                            response.data[0][
                                                "deviceParamLastTimeVo"
                                            ]
                                        ) == "{}"
                                    ) {
                                        response.data[0][
                                            "deviceParamLastTimeVo"
                                        ]["ttsLastOne"] = {};
                                        response.data[0][
                                            "deviceParamLastTimeVo"
                                        ]["ttsLastOne"]["time"] = "--";
                                    }
                                    this.$set(
                                        item,
                                        "deviceParamLastTimeVo",
                                        response.data[0][
                                            "deviceParamLastTimeVo"
                                        ]
                                    );
                                });
                        });
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
        // 表格搜索
        search() {
            if (!this.params.organizeId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            const params = Object.assign(this.params, this.searchForm);
            this.$store.dispatch("SetCondtion", this.searchForm);
            delete params.selectObj;
            this.getData(params);
        },
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
        // goTemplate() {
        //   this.$router.push({
        //     path: '/equipmentOperation/deviceConfiguration/configurationTemplate',
        //     query: {
        //       organizeId: this.params.organizeId
        //     }
        //   })
        // },
        //自定义表头
        renderHeader(h, { column, $index }) {
            return h("span", { class: "poptip" }, [
                h(
                    "span",
                    this.$t("common.deviceStatus") //"设备状态"
                ), //表格当前列标题
                h(
                    "Poptip",
                    {
                        props: {
                            placement: "top",
                            width: "80px",
                            trigger: "hover",
                            offset: 2,
                            transfer: true,
                            title: this.$t("common.deviceStatus"), //"设备状态",
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
                            // "绿色为在线，深黄色是深休眠，浅黄色是浅休眠，灰色为离线"
                            this.$t("common.deviceStatusDesc")
                        ),
                    ]
                ),
            ]);
        },
        configuration(deviceId) {
            this.$router.push({
                path: "/maintenanceCenter/deviceConfiguration/configuration",
                query: {
                    organizeId: this.params.organizeId,
                },
            });
        },
        goConfig(ids) {
            if (ids && ids.length <= 0) {
                // this.$message.warning("请选择配置的设备");
                this.$message.warning(
                    this.$t("ttsConfiguration.selectConfiguredDevice")
                );
                return;
            }
            this.routeChange(ids, "config", "TTS_CONFIG_BATCH");
        },
        goAllConfig() {
            if (this.total >= 50000) {
                this.$message.warning(this.$t("common.unableEport50000"));
            } else {
                this.$router.push({
                    path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationDetail",
                    query: {
                        organizeId: this.params.organizeId,
                        type: "allConfig",
                        ...this.searchForm,
                        business: "TTS_CONFIG_GROUP",
                    },
                });
            }
        },
        goConfiguration(deviceId, deviceStatus, dormantStatus) {
            if (deviceStatus == 2 && dormantStatus != 2) {
                this.$confirm(
                    this.$t("videoPlayback.wakeUpDeviceNowText"), // "当前车辆ACC关，下发唤醒指令会导致电源电量过度消耗，可能会导致车辆无法启动,是否继续唤醒？",
                    {
                        confirmButtonText: this.$t("videoPlayback.awaken"), // "唤醒",
                        cancelButtonText: this.$t("common.cancel"),
                        type: "warning",
                    }
                )
                    .then(() => {
                        const params = { deviceId };
                        this.$api
                            .awakenDevice(params)
                            .then((res) => {
                                if (res.success) {
                                    // "已向设备下发唤醒指令，静待1分钟左右设备将重新上线！"
                                    this.$message.success(
                                        this.$t(
                                            "videoPlayback.issueWakeupCommand"
                                        )
                                    );
                                    this.routeChange(deviceId, "config");
                                } else {
                                    // 下发唤醒失败！
                                    this.$message.error(
                                        this.$t("videoPlayback.wakeupFailed")
                                    );
                                    this.routeChange(deviceId, "config");
                                }
                            })
                            .catch((err) => {
                                // 下发唤醒失败！
                                this.$message.error(
                                    this.$t("videoPlayback.wakeupFailed")
                                );
                                this.routeChange(deviceId, "config");
                            });
                    })
                    .catch(() => {
                        this.routeChange(deviceId, "config");
                    });
            } else {
                this.routeChange(deviceId, "config");
            }
        },
        //历史
        showHistory(data) {
            this.$router.push({
                path: "/maintenanceCenter/ttsConfiguration/TTSshowHistoryView",
                query: {
                    deviceId: data.id,
                    plateNum: data.plateNum,
                    deviceCode: data.deviceCode,
                    organizeName: data.organizeName,
                    organizeId: this.params.organizeId,
                    deviceSerialNum: data.deviceSerialNum,
                    deviceModelCode: data.deviceModelCode,
                    protocolName: data.protocolName,
                    manufacturerNameString: this.getLabelSelf(
                        data.manufacturerName
                    ),
                    installServiceProvider: data.installServiceProvider,
                    accessProtocol: data.accessProtocol,
                },
            });
        },
        routeChange(deviceId, type, business = "TTS_CONFIG_SINGLE") {
            this.$router.push({
                path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationDetail",
                query: {
                    deviceId,
                    organizeId: this.params.organizeId,
                    type,
                    business,
                },
            });
        },
        goTaskNo() {
            this.$router.push({
                path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationNoView",
                query: {
                    organizeId: this.params.organizeId,
                },
            });
        },
        goTask() {
            this.$router.push({
                path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationTask",
                query: {
                    organizeId: this.params.organizeId,
                },
            });
        },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
                this.$store.dispatch("SetCondtion", this.searchForm);
            }
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
        setWrap() {
            const scrollHeight = this.$refs.wrap.scrollHeight;
            if (this.$refs.wrap.scrollHeight > 74) {
                this.iconShow = true;
            } else {
                this.iconShow = false;
            }
        },
        // getDevConfigModifyStatus() {
        //     this.$api.getDevConfigModifyStatus().then((res) => {
        //         if (res.success == true) {
        //             this.redIcon = res.data.count > 0;
        //         } else {
        //         }
        //     });
        // },
        //关闭提示文案
        closeAlert() {
            this.closeFlag = true;
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        openSelection() {
            this.selectionParams.currentPage = 1;
            this.selectionParams.pageSize = 20;
            this.selectionVisible = true;
            this.selectionForm = {
                plateNum: "",
                softwareVersion: "",
                deviceSerialNum: "",
                deviceCode: "",
                deviceStatus: "",
            };
            this.selectionData = JSON.parse(JSON.stringify(this.selection));
        },
        clearSelection() {
            if (!this.selection.length) {
                return;
            }
            this.$refs.table.clearSelection();
            this.selection = [];
            // this.$message.success("取消成功!");
            this.$message.success(this.$t("devLog.cancelSuccessfully"));
        },
        handleSelectionSizeChange(val) {
            this.selectionParams.pageSize = val;
            // this.search();
        },
        handleSelectionCurrentChange(val) {
            this.selectionParams.currentPage = val;
            // this.search();
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
                this.$refs.table.selection.find((item) => item.id === row.id),
                false
            );
            this.selectionData.map((item, index) => {
                if (item.id === row.id) {
                    this.selectionData.splice(index, 1);
                }
            });
            this.selection.map((item, index) => {
                if (item.id === row.id) {
                    this.selection.splice(index, 1);
                }
            });
            if (this.selection.length === 0) {
                this.selectProductKey = "";
            }
            let list = [];
            this.selection.forEach((i) => {
                list.push(i.id);
            });
            this.selectionIds = list;
            this.setTableHeight();
        },
        copyCarNumber(carNumber) {
            let oInput = document.createElement("input");
            oInput.value = carNumber;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象;
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.remove();
            // this.$message.success("复制成功");
            this.$message.success(
                this.$t("conditionMonitoring.replicatingSuccess")
            );
        },
        cellMouseEnter(row, col) {
            this.nowHover = row.id;
            this.hoverRow = row;
            if (col.label === this.$t("common.plateNum")) {
                this.nowHoverCellRow = row.id;
            } else {
                this.nowHoverCellRow = "";
            }
        },
        canvasResize() {
            this.setTableHeight();
            this.setWrap();
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
        downDeviceTemplate() {
            this.$api.generateTTSTemplate().then((res) => {
                if (res.success == true) {
                    let fileName = res.data.fileName;
                    let iframe = document.createElement("iframe");
                    iframe.src =
                        (process.env.BASE_API == "/"
                            ? ""
                            : process.env.BASE_API) +
                        "/excel?fileName=" +
                        fileName;
                    iframe.style.display = "none";
                    document.body.appendChild(iframe);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        doDeviceImportCancel() {
            this.isDevImportModalOpen = false;
        },
        goImport() {
            this.isDevImportModalOpen = true;
        },
        importFinish() {
            this.isDevImportModalOpen = false;
            this.search();
        },
        importError() {
            this.isDevImportModalOpen = false;
        },
    },
    mounted() {
        this.setWrap();
        window.addEventListener("resize", this.canvasResize);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.canvasResize);
    },
    created() {
        this.getDictionList();
        this.getParamOrganizeTree();
        // this.getDevConfigModifyStatus();
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

.el-icon-warning {
    cursor: pointer;
    font-size: 14px;
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
            margin-bottom: 12px !important;
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
.select-alert {
    background: #e6f7ff !important;
    // border: 1px solid rgba(145, 213, 255, 1) !important;
    border-radius: 2px;
    color: #000000;
}
.flex-box {
    display: inline-block;
    cursor: pointer;
    padding: 2px 12px;
}
.no-padding {
    padding: 0 !important;
}
.copy {
    background: rgb(254, 228, 196);
}
.overflow-box {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
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
</style>
