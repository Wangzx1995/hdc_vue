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
                                    prop="deviceCode"
                                >
                                    <G-DeviceSearch
                                        :valueKey="'deviceCode'"
                                        :value.sync="searchForm.deviceCode"
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
                                        v-model="searchForm.deviceModelCode"
                                        :placeholder="$t('common.select')"
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
                                    prop="softwareVersion"
                                    :label="$t('common.softwareVersion')"
                                >
                                    <el-input
                                        v-model="searchForm.softwareVersion"
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
                                    goConfig(selectProductKey, selectionIds)
                                "
                                v-btn="'deviceConfigurationBatchConfiguration'"
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
                                :disabled="searchLoading"
                                @click="goAllConfig"
                                v-btn="
                                    'deviceConfigurationWholeGroupConfiguration'
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
                                @click="openBulkImport"
                                v-btn="
                                    'deviceConfigurationBatchImportConfiguration'
                                "
                            >
                                <!-- 批量导入配置 -->
                                {{
                                    $t("deviceManage.batchImportconfiguration")
                                }}
                            </el-button>
                            <el-button
                                type="default"
                                @click="goExport"
                                :loading="loadingAll"
                                v-btn="'deviceConfigurationExport'"
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
                                    type="default"
                                    @click="goTemplate"
                                    v-btn="
                                        'deviceConfigurationConfigureTemplateManagement'
                                    "
                                >
                                    <!-- 配置模板管理 -->
                                    {{
                                        $t(
                                            "deviceConfiguration.configureTemplateManagement"
                                        )
                                    }}
                                </el-button>
                            </el-badge>
                            <!-- <el-badge :is-dot="redIcon">
                            <el-button type="default" @click="goDetail">配置查看</el-button>
                          </el-badge> -->
                            <el-badge :is-dot="redIcon">
                                <el-button
                                    type="default"
                                    @click="goTask"
                                    v-btn="
                                        'deviceConfigurationMyConfigurationTasks'
                                    "
                                >
                                    <!-- 我的配置任务 -->
                                    {{
                                        $t(
                                            "ttsConfiguration.myConfigurationTask"
                                        )
                                    }}
                                </el-button>
                            </el-badge>
                            <el-badge :is-dot="redIcon">
                                <el-button
                                    type="default"
                                    @click="goNoConfiguration"
                                    v-btn="
                                        'deviceConfigurationUnfinishedConfigurationTasks'
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
                    <div ref="searchAlert" class="wrap-top p-x">
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
                            row-key="id"
                            @select-all="selectAll"
                            ref="table"
                            @filter-change="filterChange"
                            @cell-mouse-enter="cellMouseEnter"
                        >
                            <!-- @sort-change="changeSort" :default-sort="{prop: 'updateTime', order: 'descending'}" -->
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
                                                    scope.row.id,
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
                                        <!-- {{ scope.row.plateNum || "--" }} -->
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
                                prop="deviceParamLastTimeVo.lastOne.time"
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
                                            h(
                                                'Poptip',
                                                {
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
                                                            'margin-left':
                                                                '4px',
                                                        },
                                                    }),
                                                    h(
                                                        'span',
                                                        { slot: 'content' },
                                                        $t(
                                                            'deviceConfiguration.configureProgressUpdateTimeText'
                                                        )
                                                        // '鼠标移至时间可展示不同配置类型的进度更新时间及配置结果'
                                                    ),
                                                ]
                                            ),
                                        ]);
                                    }
                                "
                            >
                                <template slot-scope="scope">
                                    <el-popover
                                        ref="popover"
                                        placement="top"
                                        trigger="hover"
                                    >
                                        <p>
                                            <!-- 文件配置 -->
                                            {{
                                                $t(
                                                    "deviceConfiguration.fileConfiguration"
                                                )
                                            }}：
                                        </p>
                                        <div>
                                            <!-- 进度更新时间 -->
                                            {{
                                                $t(
                                                    "ttsConfiguration.progressUpdateTime"
                                                )
                                            }}：{{
                                                (scope.row
                                                    .deviceParamLastTimeVo &&
                                                    scope.row
                                                        .deviceParamLastTimeVo
                                                        .binLastOne &&
                                                    scope.row
                                                        .deviceParamLastTimeVo
                                                        .binLastOne.time) ||
                                                "--"
                                            }}
                                            <span
                                                v-if="
                                                    scope.row
                                                        .deviceParamLastTimeVo &&
                                                    scope.row
                                                        .deviceParamLastTimeVo
                                                        .binLastOne &&
                                                    scope.row
                                                        .deviceParamLastTimeVo
                                                        .binLastOne.status
                                                "
                                                class="m-l"
                                            >
                                                <span
                                                    :class="
                                                        statusList[
                                                            scope.row
                                                                .deviceParamLastTimeVo
                                                                .binLastOne
                                                                .status
                                                        ] &&
                                                        statusList[
                                                            scope.row
                                                                .deviceParamLastTimeVo
                                                                .binLastOne
                                                                .status
                                                        ].color
                                                    "
                                                    >●</span
                                                >
                                                {{
                                                    statusList[
                                                        scope.row
                                                            .deviceParamLastTimeVo
                                                            .binLastOne.status
                                                    ] &&
                                                    statusList[
                                                        scope.row
                                                            .deviceParamLastTimeVo
                                                            .binLastOne.status
                                                    ].name
                                                }}
                                            </span>
                                        </div>
                                        <p class="m-t-sm">
                                            <!-- 协议配置 -->
                                            {{
                                                $t(
                                                    "configurationTemplate.protocolConfiguration"
                                                )
                                            }}：
                                        </p>
                                        <div>
                                            <!-- 进度更新时间 -->
                                            {{
                                                $t(
                                                    "ttsConfiguration.progressUpdateTime"
                                                )
                                            }}：{{
                                                (scope.row
                                                    .deviceParamLastTimeVo &&
                                                    scope.row
                                                        .deviceParamLastTimeVo
                                                        .protocolLastOne &&
                                                    scope.row
                                                        .deviceParamLastTimeVo
                                                        .protocolLastOne
                                                        .time) ||
                                                "--"
                                            }}
                                            <span
                                                v-if="
                                                    scope.row
                                                        .deviceParamLastTimeVo &&
                                                    scope.row
                                                        .deviceParamLastTimeVo
                                                        .protocolLastOne &&
                                                    scope.row
                                                        .deviceParamLastTimeVo
                                                        .protocolLastOne.status
                                                "
                                                class="m-l"
                                            >
                                                <span
                                                    :class="
                                                        statusList[
                                                            scope.row
                                                                .deviceParamLastTimeVo
                                                                .protocolLastOne
                                                                .status
                                                        ] &&
                                                        statusList[
                                                            scope.row
                                                                .deviceParamLastTimeVo
                                                                .protocolLastOne
                                                                .status
                                                        ].color
                                                    "
                                                    >●</span
                                                >
                                                {{
                                                    statusList[
                                                        scope.row
                                                            .deviceParamLastTimeVo
                                                            .protocolLastOne
                                                            .status
                                                    ] &&
                                                    statusList[
                                                        scope.row
                                                            .deviceParamLastTimeVo
                                                            .protocolLastOne
                                                            .status
                                                    ].name
                                                }}
                                            </span>
                                        </div>
                                    </el-popover>
                                    <span v-popover:popover>{{
                                        scope.row.deviceParamLastTimeVo &&
                                        scope.row.deviceParamLastTimeVo
                                            .lastOne &&
                                        scope.row.deviceParamLastTimeVo.lastOne
                                            .time
                                    }}</span>
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
                            <!-- 末次配置状态 -->
                            <el-table-column
                                prop="paramStatus"
                                :label="
                                    $t(
                                        'ttsConfiguration.lastConfigurationStatus'
                                    )
                                "
                                min-width="160px"
                                show-overflow-tooltip
                                fixed="right"
                            >
                                <template slot-scope="scope">
                                    <div
                                        v-if="
                                            scope.row.deviceParamLastTimeVo &&
                                            scope.row.deviceParamLastTimeVo
                                                .lastOne &&
                                            scope.row.deviceParamLastTimeVo
                                                .lastOne.status
                                        "
                                    >
                                        <span
                                            :class="
                                                statusList[
                                                    scope.row
                                                        .deviceParamLastTimeVo
                                                        .lastOne.status
                                                ] &&
                                                statusList[
                                                    scope.row
                                                        .deviceParamLastTimeVo
                                                        .lastOne.status
                                                ].color
                                            "
                                            >●</span
                                        >
                                        {{
                                            statusList[
                                                scope.row.deviceParamLastTimeVo
                                                    .lastOne.status
                                            ] &&
                                            statusList[
                                                scope.row.deviceParamLastTimeVo
                                                    .lastOne.status
                                            ].name
                                        }}
                                    </div>
                                    <div v-else>{{ "--" }}</div>
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
                                            scope.row.deviceParamLastTimeVo
                                                .lastOne.failReason
                                        "
                                        :title="
                                            scope.row.deviceParamLastTimeVo
                                                .lastOne.failReason
                                        "
                                    >
                                        {{
                                            scope.row.deviceParamLastTimeVo
                                                .lastOne.failReason
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
                                width="165px"
                            >
                                <template slot-scope="scope">
                                    <a
                                        class="m-r-sm colorBlue"
                                        @click="uploadFile(scope.row.id)"
                                        v-if="
                                            scope.row.deviceStatus === 1 ||
                                            (scope.row.deviceStatus === 2 &&
                                                scope.row.dormantStatus == 2)
                                        "
                                        v-btn="
                                            'deviceConfigurationUploadCalibrationFile'
                                        "
                                    >
                                        <!-- 上传 -->
                                        {{ $t("common.upload") }}
                                    </a>
                                    <el-popover
                                        placement="bottom"
                                        trigger="click"
                                        title=""
                                        popper-class="popover_a_class"
                                        @show="
                                            getRemoteDevWebUrlEnable(
                                                scope.row,
                                                scope
                                            )
                                        "
                                    >
                                        <a
                                            class="popover_a"
                                            v-if="
                                                scope.row.deviceStatus === 1 ||
                                                (scope.row.deviceStatus === 2 &&
                                                    scope.row.dormantStatus ==
                                                        2)
                                            "
                                            @click="
                                                goConfiguration(
                                                    scope.row.id,
                                                    scope.row.deviceCode,
                                                    scope.row.deviceStatus,
                                                    scope.row.dormantStatus,
                                                    scope.row.deviceModelCode,
                                                    'agree',
                                                    scope.row
                                                )
                                            "
                                        >
                                            <!-- 协议配置 -->
                                            {{
                                                $t(
                                                    "configurationTemplate.protocolConfiguration"
                                                )
                                            }}
                                        </a>
                                        <a
                                            class="popover_a"
                                            v-if="
                                                !(
                                                    scope.row.deviceStatus ===
                                                        1 ||
                                                    (scope.row.deviceStatus ===
                                                        2 &&
                                                        scope.row
                                                            .dormantStatus == 2)
                                                )
                                            "
                                            @click="
                                                goConfiguration(
                                                    scope.row.id,
                                                    scope.row.deviceCode,
                                                    scope.row.deviceStatus,
                                                    scope.row.dormantStatus,
                                                    scope.row.deviceModelCode,
                                                    'agree',
                                                    scope.row,
                                                    1
                                                )
                                            "
                                        >
                                            <!-- 镜像配置 -->
                                            {{
                                                $t(
                                                    "configurationTemplate.mirroringConfiguration"
                                                )
                                            }}
                                        </a>
                                        <a
                                            class="popover_a"
                                            v-if="
                                                scope.row.deviceStatus === 1 ||
                                                (scope.row.deviceStatus === 2 &&
                                                    scope.row.dormantStatus ==
                                                        2)
                                            "
                                            @click="
                                                goConfiguration(
                                                    scope.row.id,
                                                    scope.row.deviceCode,
                                                    scope.row.deviceStatus,
                                                    scope.row.dormantStatus,
                                                    scope.row.deviceModelCode,
                                                    'file',
                                                    scope.row
                                                )
                                            "
                                        >
                                            <!-- 文件配置 -->
                                            {{
                                                $t(
                                                    "configurationTemplate.fileConfiguration"
                                                )
                                            }}
                                        </a>
                                        <a
                                            class="popover_a"
                                            @click="
                                                goConfiguration(
                                                    scope.row.id,
                                                    scope.row.deviceCode,
                                                    scope.row.deviceStatus,
                                                    scope.row.dormantStatus,
                                                    scope.row.deviceModelCode,
                                                    'template',
                                                    scope.row
                                                )
                                            "
                                        >
                                            <!-- 模板配置 -->
                                            {{
                                                $t(
                                                    "configurationTemplate.templateConfiguration"
                                                )
                                            }}
                                        </a>
                                        <a
                                            class="popover_a"
                                            @click="remoteAccess(scope.row)"
                                            v-btn="
                                                'deviceConfigurationRemoteConfiguration'
                                            "
                                            v-if="
                                                scope.row.deviceStatus === 1 &&
                                                scope.row.remoteAccessUrl
                                            "
                                        >
                                            <!-- Web配置 -->
                                            {{
                                                $t(
                                                    "configurationTemplate.webConfiguration"
                                                )
                                            }}
                                        </a>
                                        <el-button
                                            style="font-size: 12px"
                                            class="colorBlue"
                                            slot="reference"
                                            type="text"
                                            v-btn="
                                                'deviceConfigurationConfigure'
                                            "
                                        >
                                            <!-- 配置 -->
                                            {{
                                                $t(
                                                    "ttsConfiguration.configuration"
                                                )
                                            }}
                                            <i class="el-icon-arrow-down"></i
                                        ></el-button>
                                    </el-popover>
                                    <a
                                        class="m-r-sm colorBlue"
                                        @click="showHistory(scope.row)"
                                        v-btn="
                                            'deviceConfigurationQueryConfigurationHistory'
                                        "
                                    >
                                        <!-- 历史 -->
                                        {{ $t("equipmentInspection.history") }}
                                    </a>
                                    <a
                                        v-show="
                                            scope.row.deviceStatus === 2 &&
                                            scope.row.dormantStatus != 2
                                        "
                                        class="m-r-sm colorBlue"
                                        @click="
                                            openAwaken(
                                                scope.row.id,
                                                scope.row.deviceCode,
                                                scope.row.deviceStatus,
                                                scope.row.dormantStatus
                                            )
                                        "
                                    >
                                        <!-- 唤醒 -->
                                        {{ $t("videoPlayback.awaken") }}
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
        <!-- //批量导入配置 -->
        <el-dialog
            :title="$t('deviceManage.batchImportconfiguration')"
            :visible.sync="bulkImportVisible"
            :width="'900px'"
            @close="closeBulkImport"
        >
            <div class="bulk-import">
                <p>
                    <!-- 待配置车辆 -->
                    <span>{{ $t("deviceManage.deviceSettingTest1") }}： </span
                    ><el-button
                        @click="doBulkImport(false)"
                        :loading="importLoading"
                    >
                        <i class="el-icon-refresh_sm"></i>
                        <!-- 检查内容 -->
                        {{ $t("deviceManage.deviceSettingTest2") }}
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
                        <el-select
                            v-model="bulkImportForm.plateNum"
                            :placeholder="`${typeListSelected}${$t(
                                'ttsConfiguration.plateNumPlaceholderText1'
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
                            'ttsConfiguration.plateNumPlaceholderText2'
                        )}${typeListSelected}，${$t(
                            'ttsConfiguration.plateNumPlaceholderText3'
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
                    <i class="h-icon-info"></i>
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
        <!-- 参数配置 -->
        <el-dialog
            :fullscreen="true"
            :custom-class="'protocol-dialog'"
            :title="$t('videoPlayback.parameterConfiguration')"
            :visible="protocolConfigurationVisibile"
            @close="protocolConfigurationVisibile = false"
            class="no-padding no-border"
        >
            <protocol-configuration
                :deviceModelCode="protocolConfigurationQuery.deviceModelCode"
                :organizeId="protocolConfigurationQuery.organizeId"
                :deviceId="protocolConfigurationQuery.deviceId"
                :carList="protocolConfigurationQuery.carList"
            ></protocol-configuration>
        </el-dialog>
        <el-dialog
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            append-to-body
            width="450px"
            title=""
            :visible.sync="awakenVisible"
            :custom-class="'awaken-dialog'"
        >
            <div class="awaken-dialog">
                <i class="el-icon-warning"></i>
                <div class="right-box">
                    <div class="title-box m-b">
                        <p>
                            <!-- 确定要唤醒设备吗？ -->
                            {{ $t("videoPlayback.wakeUpDeviceNow") }}？
                        </p>
                        <p>
                            <!-- 当前车辆ACC关，下发唤醒指令会导致电源电量过度消耗，可能会导致车辆无法启动,是否继续唤醒？ -->
                            {{ $t("videoPlayback.wakeUpDeviceNowText") }}？
                        </p>
                    </div>
                    <el-form>
                        <!-- 唤醒时长 -->
                        <el-form-item
                            :label="$t('videoPlayback.awakenTime') + '：'"
                        >
                            <el-input-number
                                v-model="awakenTime"
                                :min="1"
                                :max="999"
                            ></el-input-number>
                            <!-- 分钟 -->
                            {{ $t("videoPlayback.minute") }}
                            <span class="tip-msg">
                                <!-- 请输入唤醒时长（1-999分钟） -->
                                {{ $t("videoPlayback.awakenTimePlaceholder") }}
                            </span>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer">
                <el-button @click="awakenVisible = false">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button
                    @click="awakenDevice"
                    :loading="loading"
                    type="primary"
                >
                    <!-- 唤醒 -->
                    {{ $t("videoPlayback.awaken") }}
                </el-button>
            </div>
        </el-dialog>
        <!-- 文件配置 -->
        <el-dialog
            :title="$t('configurationTemplate.fileConfiguration')"
            :visible.sync="fileConfigurationVisible"
            width="500px"
            @close="fileConfigClose"
        >
            <div>
                <el-form
                    label-position="top"
                    :model="fileForm"
                    :rules="fileRules"
                    ref="fileForm"
                >
                    <!-- 文件类型 -->
                    <el-form-item
                        :label="$t('configurationTemplate.fileType')"
                        prop="fileType"
                    >
                        <el-select
                            v-model="fileForm.fileType"
                            :placeholder="$t('common.select')"
                            style="width: 100%"
                        >
                            <el-option
                                :label="item.sysDictName"
                                :value="item.sysDictCode"
                                v-for="(item, index) in fileTypeList"
                                :key="index"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 模板名称 -->
                    <el-form-item
                        :label="$t('configurationTemplate.templateName')"
                        prop="templateName"
                    >
                        <el-input
                            :placeholder="$t('common.input')"
                            v-model="fileForm.templateName"
                            :maxlength="20"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="备注信息" prop="templateRemark">
                        <el-input
                            type="textarea"
                            :placeholder="$t('common.input')"
                            v-model="fileForm.templateRemark"
                            :rows="3"
                            :maxlength="100"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="fileConfigClose">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button
                    type="primary"
                    :loading="fileConfigLoading"
                    @click="fileConfig"
                >
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
import protocolConfiguration from "@/views/protocolConfiguration/index.vue";

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
    components: { protocolConfiguration },
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
            radio: 1,
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

            bulkImportVisible: false,
            loading: false,
            searchLoading: true,
            filterTagLength: 0,
            tableOrder: null,
            // fileterArr:[1],
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
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                // orderColumn: 'deviceParamLastTimeVo.lastOne.time', //排序列
                // orderDir: 'asc',   //排序方向
                organizeId: null,
                checked: true,
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
                plateNum: "",
                carId: "",
                deviceModelCode: "",
                deviceSerialNum: "",
                deviceStatus: "",
                deviceCode: "",
                softwareVersion: "",
                plateJson: {},
                plateArr: [],
                vin: "",
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
            selectionIds: [],
            plSelection: [],
            selectProductKey: "",
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
            allProductKey: "",
            redIcon: false,
            redIconstyle: false,
            timer: null,
            organizationName: "",
            query: "",
            query2: "",
            pageSizeCar: 20, //车牌分页数量
            currentPageCar: 1, //车牌页码
            haveDataCar: true,
            totalPagesCar: "",
            nowHoverCellRow: "",
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
            deviceListVisible: false,
            deviceInfoList: [],
            deviceModelCode: "",
            protocolConfigurationVisibile: false,
            protocolConfigurationQuery: {},
            deviceDicList: [],
            awakenDeviceId: null,
            awakenTime: 0,
            awakenVisible: false,
            fileConfigurationVisible: false,
            fileTypeList: [
                {
                    label: this.$t(
                        "deviceConfiguration.calibrationResultsDocument"
                    ), //"标定成果物文件",
                    value: 1,
                },
            ],
            fileForm: {
                fileType: "",
                templateName: "",
                templateRemark: "",
                deviceId: "",
            },
            fileRules: {
                fileType: [
                    {
                        required: true,
                        // message: "请选择文件类型",
                        message:
                            this.$t("common.select") +
                            this.$t("configurationTemplate.fileType"),
                        trigger: "change",
                    },
                ],
                templateName: [
                    {
                        required: true,
                        // message: "请输入模板名称",
                        message:
                            this.$t("common.input") +
                            this.$t("configurationTemplate.templateName"),
                        trigger: "blur",
                    },
                ],
            },
            fileConfigLoading: false,
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
    },
    methods: {
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
            // if (col.label === "车牌号") {
            if (col.label === this.$t("common.plateNum")) {
                this.nowHoverCellRow = row.id;
            } else {
                this.nowHoverCellRow = "";
            }
        },
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
                    //  this.searchForm.plateArr = res.data
                    this.totalPagesCar = res.data.totalPages;
                    let temp =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : temp;
                    temp.forEach((item) => {
                        item.html = `<span>${item.plateNum}</span>`;
                    });
                    this.searchForm.plateArr = this.setHightLight(
                        (this.currentPageCar === 1
                            ? []
                            : this.searchForm.plateArr
                        ).concat(temp),
                        jsonData.plateNum
                    );
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
        // 设置高亮
        setHightLight(arr, keyword) {
            if (arr && arr.length > 0 && keyword) {
                arr = arr.filter((item) => {
                    let reg = new RegExp(keyword, "g");
                    let replaceString = `<span class='option-high'>${keyword.trim()}</span>`;
                    if (item.html.match(reg)) {
                        item.html = item.html.replace(reg, replaceString);
                        return item;
                    }
                });
                return arr;
            }
            if (!keyword) {
                return arr;
            }
        },
        //  下拉加载更多
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
                let params = Object.assign(
                    { organizeId: this.params.organizeId },
                    this.searchForm
                );
                params["containChildOrg"] = this.params.checked ? 1 : 0;
                this.$api.exportParamDeviceList(params).then((res) => {
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
                                            this.$api.eventTrackTrigger({
                                                menu: "DEVICE_CONFIGURATION",
                                                business:
                                                    "DEVICE_CONFIG_INFO_EXPORT",
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
        // changeSort(val){
        //   // this.tableOrder=val.order
        //   if(val.order){
        //     if(val.order === 'descending') {
        //       this.tableOrder = 'desc'
        //     }else{
        //       this.tableOrder = 'asc'
        //     }
        //   } else{
        //     this.tableOrder = ''
        //   }
        //   if(this.params.organizeId){
        //     this.search()
        //   }
        // },
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
                let params = {
                    deviceIds: this.selectionIds,
                    organizeId: this.params.organizeId,
                };
                this.syncHttpDeviceConfigParams(params);
            } else if (val == 2) {
                // 查询整组设备
                let params = {
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
            for (let i in val) {
                this.filterTagLength = val[i].length;
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
            this.$api.getParamOrganizeTree().then((res) => {
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
                        if (this.$store.state.tree.deviceConfigurationId) {
                            this.TreeExpanded.push(
                                this.$store.state.tree.deviceConfigurationId
                            );
                        }
                        this.checkOrgDeviceModelInfo();
                        this.getDeviceModelList();
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
        handleNodeClick(data) {
            this.params.currentPage = 1;
            this.currentNode = data;
            this.params.organizeId = data.id;
            this.checkOrgDeviceModelInfo();
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
            this.plSelection = selection.filter((i) => {
                return i.rowspan != 0;
            });
            this.selection = selection;

            let list = [];
            this.selection.forEach((i) => {
                list.push(i.id);
            });
            this.selectionIds = list;

            if (selection.length > 0) {
                this.selectProductKey = selection[0].deviceModelCode;
                // this.selectSoftwareVersion=selection[0].softwareVersion
            } else {
                this.selectProductKey = "";
                // this.selectSoftwareVersion=''
            }
            this.$nextTick(() => {
                this.setTableHeight();
            });
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
                        this.$message.warning(
                            this.$t(
                                "deviceConfiguration.batchConfigurationText"
                            ) //"批量配置操作只能选择一种设备型号"
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
        //获取设备的设置时间
        getParamDeviceManage(params) {},
        /*获取table列表*/
        getData(params) {
            this.searchLoading = true;
            this.$api
                .getParamDevicePage(params)
                .then((res) => {
                    //this.tableData = res.data.results;
                    if (res.success == true) {
                        let tableData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableData;
                        // 为数据添加rowspan字段，方便后面合并数据
                        tableData.forEach((item) => {
                            if (!item.deviceParamLastTimeVo["lastOne"]) {
                                // item.deviceParamLastTimeVo = {}
                                item.deviceParamLastTimeVo["lastOne"] = {};
                                item.deviceParamLastTimeVo["lastOne"]["time"] =
                                    "--";
                            }
                        });
                        tableData.forEach((item) => {
                            item.rowspan = tableData.filter(function (i) {
                                return i.plateNum == item.plateNum;
                            }).length;
                        });
                        for (let i = 1; i < tableData.length; i++) {
                            if (
                                tableData[i].plateNum ==
                                tableData[i - 1].plateNum
                            ) {
                                tableData[i].rowspan = 0;
                            }
                        }
                        this.tableData = tableData;
                        this.tableData.forEach((item) => {
                            this.$api
                                .getParamDeviceByPageId({ deviceId: item.id })
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
                                        ]["lastOne"] = {};
                                        response.data[0][
                                            "deviceParamLastTimeVo"
                                        ]["lastOne"]["time"] = "--";
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
            if (this.$refs.searchForm) {
                this.$refs.searchForm.clearValidate();
            }
            if (!this.params.organizeId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            // this.params.orderDir = this.tableOrder
            let params = Object.assign(this.params, this.searchForm);
            params["containChildOrg"] = this.params.checked ? 1 : 0;
            delete params.selectObj;
            this.$store.dispatch("SetCondtion", this.searchForm);
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
        goTemplate() {
            this.$router.push({
                path: "/maintenanceCenter/deviceConfiguration/configurationTemplate",
                query: {
                    organizeId: this.params.organizeId,
                },
            });
        },
        goConfig(deviceModelCode, ids) {
            // 批量配置操作只能选择一种设备型号
            if (this.selection.length > 0) {
                const deviceModelCode = this.selection[0].deviceModelCode;
                let isSame = true;
                this.selection.map((i) => {
                    if (i.deviceModelCode != deviceModelCode) {
                        isSame = false;
                    }
                });
                if (!isSame) {
                    // this.$message.warning("批量配置操作只能选择一种设备型号");
                    this.$message.warning(
                        this.$t("deviceConfiguration.batchConfigurationText")
                    );
                    return;
                }
            }
            if (ids && ids.length <= 0) {
                // this.$message.warning("请选择配置的设备");
                this.$message.warning(
                    this.$t("ttsConfiguration.selectConfiguredDevice")
                );
                return;
            }
            this.$router.push({
                path: "/maintenanceCenter/deviceConfiguration/configuration",
                query: {
                    deviceModelCode,
                    // organizeId: this.params.organizeId,
                    deviceIds: ids,
                    // plateNum:this.searchForm.plateNum,
                    // deviceCode:this.searchForm.deviceCode,
                    // deviceSerialNum:this.searchForm.deviceSerialNum,
                    // deviceStatus:this.searchForm.deviceStatus
                    business: "DEVICE_CONFIG_BATCH",
                },
            });
        },
        goAllConfig() {
            // if(!this.allProductKey){
            //   this.$message.warning('该组织树下的设备型号不一致，不能整组配置！')
            //   return
            // }
            if (this.allProductKey) {
                this.$router.push({
                    path: "/maintenanceCenter/deviceConfiguration/configuration",
                    query: {
                        type: 1,
                        deviceModelCode: this.allProductKey,
                        organizeId: this.params.organizeId,
                        plateNum: this.searchForm.plateNum,
                        softwareVersion: this.searchForm.softwareVersion,
                        deviceSerialNum: this.searchForm.deviceSerialNum,
                        deviceCode: this.searchForm.deviceCode,
                        deviceStatus: this.searchForm.deviceStatus,
                        business: "DEVICE_CONFIG_GROUP",
                    },
                });
            } else {
                if (!this.searchForm.deviceModelCode) {
                    this.isValidate = true;
                    this.$refs.searchForm.validateField("deviceModelCode");
                    this.isValidate = false;
                    return;
                }
                if (!this.tableData.length) {
                    // this.$message.warning("无设备可以配置！");
                    this.$message.warning(
                        this.$t("deviceConfiguration.noDeviceCanBeConfigured")
                    );
                    return;
                }
                this.$router.push({
                    path: "/maintenanceCenter/deviceConfiguration/configuration",
                    query: {
                        type: 1,
                        deviceModelCode: this.searchForm.deviceModelCode,
                        organizeId: this.params.organizeId,
                        plateNum: this.searchForm.plateNum,
                        softwareVersion: this.searchForm.softwareVersion,
                        deviceSerialNum: this.searchForm.deviceSerialNum,
                        deviceCode: this.searchForm.deviceCode,
                        deviceStatus: this.searchForm.deviceStatus,
                        business: "DEVICE_CONFIG_GROUP",
                    },
                });
            }
        },
        //批量导入配置
        openBulkImport() {
            this.bulkImportForm.plateArr = [];
            // this.searchForm.plateNum =
            //     this.searchForm.plateJson[this.searchForm.carId];
            this.bulkImportVisible = true;
            this.bulkImportForm.type = 1;
            this.bulkImportForm.plateNum = "";
            this.bulkImportForm.textarea = "";
            this.typeListSelected = this.$t("common.plateNum"); //"车牌号";
        },
        closeBulkImport() {
            this.bulkImportForm.plateArr = [];
        },
        doBulkImport(falg) {
            if (!this.bulkImportForm.textarea) {
                // 请输入待配置
                this.$message.warning(
                    `${this.$t("ttsConfiguration.plateNumPlaceholderText4")}${
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
                                    path: "/maintenanceCenter/deviceConfiguration/configuration",
                                    query: {
                                        deviceModelCode:
                                            this.deviceInfoList[0]
                                                .deviceModelCode,
                                        // organizeId: this.params.organizeId,
                                        deviceIds:
                                            this.deviceInfoList[0].checkDeviceInfos.reduce(
                                                (prev, cur) => {
                                                    return prev.concat(
                                                        cur["deviceId"]
                                                    );
                                                },
                                                []
                                            ),
                                        business: "DEVICE_CONFIG_BATCH_IMPORT",
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
        selectCar(val) {
            this.bulkImportForm.textarea += `，${val}`;
            this.plateNumBlur();
            this.bulkImportForm.plateNum = "";
        },
        goConfiguration(
            deviceId,
            deviceCode,
            deviceStatus,
            dormantStatus,
            deviceModelCode,
            type,
            row,
            offline = 0
        ) {
            if (type == "agree") {
                let params = {
                    deviceId: deviceId,
                };
                this.$api.getDeviceConfigParamWay(params).then((res) => {
                    if (res && res.data) {
                        this.$api
                            .getDeviceEHomeCapacity({
                                deviceId: deviceId,
                                param: "",
                                msgId: 4401,
                            })
                            .then((res2) => {
                                if (res2 && res2.data && res2.data.param) {
                                    this.$router.push({
                                        path: "/maintenanceCenter/deviceConfiguration/protocolConfiguration",
                                        query: {
                                            deviceModelCode:
                                                row.deviceModelCode,
                                            organizeId: this.params.organizeId,
                                            deviceId: deviceId, //浙A4204
                                            deviceCode: deviceCode,
                                            carList: JSON.stringify([row]),
                                            offline: offline,
                                            plateNum: row.plateNum,
                                            deviceSerialNum:
                                                row.deviceSerialNum,
                                            vin: row.vin,
                                        },
                                    });
                                } else {
                                    this.$router.push({
                                        path: "/maintenanceCenter/deviceConfiguration/configurationDetail/agreementIndex",
                                        query: {
                                            deviceId,
                                            deviceCode,
                                            organizeId: this.params.organizeId,
                                        },
                                    });
                                }
                            });
                    } else {
                        if (!offline) {
                            this.$router.push({
                                path: "/maintenanceCenter/deviceConfiguration/configurationDetail/agreementIndex",
                                query: {
                                    deviceId,
                                    deviceCode,
                                    organizeId: this.params.organizeId,
                                },
                            });
                        } else {
                            // this.$message.error(
                            //     "当前设备镜像配置功能不可用，请确认设备支持能力或稍后再试。"
                            // );
                            this.$message.error(
                                this.$t(
                                    "deviceConfiguration.mirrorConfigurationText"
                                )
                            );
                        }
                    }
                });
            } else if (type == "file") {
                this.$router.push({
                    path: "/maintenanceCenter/deviceConfiguration/configurationDetail/fileIndex",
                    query: {
                        deviceId,
                        deviceCode,
                        organizeId: this.params.organizeId,
                    },
                });
            } else if (type == "bubiao") {
                this.$router.push({
                    path: "/maintenanceCenter/deviceConfiguration/configurationDetail/bubiao",
                    query: {
                        deviceId,
                        deviceCode,
                        organizeId: this.params.organizeId,
                        isBubiao: true,
                    },
                });
            } else if (type == "offline") {
                let params = {
                    deviceId: deviceId,
                };
                this.$api.getDeviceConfigParamWay(params).then((res) => {
                    if (res && res.data) {
                        // this.$message.warning("程序员正在加班开发中...");
                        this.$message.warning(
                            this.$t(
                                "deviceConfiguration.programmersAreWorkingOvertime"
                            )
                        );
                    } else {
                        // this.$message.error(
                        //     "您的设备不支持离线查询和配置功能，请联系分公司销售"
                        // );
                        this.$message.error(
                            this.$t(
                                "deviceConfiguration.deviceNotSupportOfflineQuery"
                            )
                        );
                    }
                });
            } else {
                this.$router.push({
                    path: "/maintenanceCenter/deviceConfiguration/configuration",
                    query: {
                        deviceIds: deviceId,
                        deviceCode,
                        deviceModelCode,
                        organizeId: this.params.organizeId,
                        business: "DEVICE_CONFIG_SINGLE",
                    },
                });
            }
        },
        uploadFile(deviceId) {
            this.$api
                .getDictionList({
                    dictType: "configFileType",
                })
                .then((res) => {
                    if (res.success == true) {
                        this.fileConfigurationVisible = true;
                        this.fileTypeList = res.data.filter(
                            (i) => i.sysDictCode != 0
                        );
                        this.fileForm.deviceId = deviceId;
                    }
                });
        },
        //历史
        showHistory(data) {
            this.$router.push({
                path: "/maintenanceCenter/deviceConfiguration/showHistoryView",
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
                    vin: data.vin,
                    isTemplate: true,
                },
            });
        },
        openAwaken(deviceId) {
            this.awakenVisible = true;
            this.awakenTime = 0;
            this.awakenDeviceId = deviceId;
        },
        //唤醒
        awakenDevice() {
            this.loading = true;
            let params = {
                deviceId: this.awakenDeviceId,
                time: this.awakenTime,
            };
            this.$api
                .awakenDevice(params)
                .then((res) => {
                    if (res.success) {
                        this.loading = false;
                        this.awakenVisible = false;
                        // this.$message.success(
                        //     "已向设备下发唤醒指令，静待1分钟左右设备将重新上线"
                        // );
                        this.$message.success(
                            this.$t("videoPlayback.issueWakeupCommand")
                        );
                    } else {
                        this.loading = false;
                        // 下发唤醒失败！
                        this.$message.error(
                            this.$t("videoPlayback.wakeupFailed")
                        );
                    }
                })
                .catch((err) => {
                    this.loading = false;
                    // 下发唤醒失败！
                    this.$message.error(this.$t("videoPlayback.wakeupFailed"));
                });
        },
        // goDetail() {
        //   this.$router.push({
        //     path: '/equipmentOperation/deviceConfiguration/configurationView'
        //   })
        // },
        goTask() {
            this.$router.push({
                path: "/maintenanceCenter/deviceConfiguration/configurationTask",
            });
        },
        goNoConfiguration() {
            this.$router.push({
                path: "/maintenanceCenter/deviceConfiguration/noConfiguration",
            });
        },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
                this.$store.dispatch("SetCondtion", this.searchForm);
            }
        },
        selectable(row, index) {
            if (this.selectProductKey) {
                return row.deviceModelCode === this.selectProductKey;
            } else {
                return true;
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
            let scrollHeight = this.$refs.wrap.scrollHeight;
            if (this.$refs.wrap.scrollHeight > 80) {
                this.iconShow = true;
            } else {
                this.iconShow = false;
            }
        },
        checkOrgDeviceModelInfo() {
            const params = {
                organizeId: this.params.organizeId,
            };
            this.$api.checkOrgDeviceModelInfo(params).then((res) => {
                if (res.success == true) {
                    this.allProductKey = res.data.deviceModelCode;
                    this.search();
                } else {
                    this.search();
                }
            });
        },
        // getDevConfigModifyStatus() {
        //     this.$api.getDevConfigModifyStatus().then((res) => {
        //         if (res.success == true) {
        //             this.redIcon = res.data.count > 0 ? true : false;
        //         } else {
        //         }
        //     });
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
        clearSelection() {
            if (!this.selection.length) {
                return;
            }
            this.$refs.table.clearSelection();
            this.selection = [];
            this.$message.success(this.$t("devLog.cancelSuccessfully"));
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
        handleSelectionSizeChange(val) {
            this.selectionParams.pageSize = val;
            // this.search();
        },
        handleSelectionCurrentChange(val) {
            this.selectionParams.currentPage = val;
            // this.search();
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
            // this.$refs.table.toggleRowSelection(row, false);
            this.setTableHeight();
        },
        //关闭提示文案
        closeAlert() {
            this.closeFlag = true;
            this.$nextTick(() => {
                this.setTableHeight();
            });
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
                path: "/maintenanceCenter/deviceConfiguration/configuration",
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
                    business: "DEVICE_CONFIG_BATCH_IMPORT",
                },
            });
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
        typeChange(val) {
            this.bulkImportForm.textarea = "";
            let obj = this.typeList.find((item) => item.value == val);
            this.typeListSelected = obj.label;
        },
        radioChange(val) {
            if (val === 1) {
                this.awakenTime = 30;
            } else {
                this.awakenTime = null;
            }
        },
        openFileConfigurationVisible() {
            this.fileConfigurationVisible = true;
        },
        fileConfigClose() {
            this.$refs.fileForm.resetFields();
            this.fileConfigurationVisible = false;
            this.fileForm = {
                fileType: "",
                templateName: "",
                templateRemark: "",
                deviceId: "",
            };
        },
        fileConfig() {
            this.$refs.fileForm.validate((valid) => {
                if (valid) {
                    this.fileConfigLoading = true;
                    this.$api
                        .getConfigFileFromDevice(this.fileForm)
                        .then((res) => {
                            if (res.success == true) {
                                this.$message.success(
                                    this.$t(
                                        "deviceConfiguration.instructionsHaveBeenIssued"
                                    ), // "已下发指令让设备上传文件，请耐心等待！可前往配置模版-文件配置中查看上传进度！",
                                    3000
                                );
                                this.fileConfigClose();
                            } else {
                                this.$message.error(res.msg);
                            }
                            this.fileConfigLoading = false;
                        });
                }
            });
        },
        getRemoteDevWebUrlEnable(data, scope) {
            if (data.deviceStatus !== 1) {
                return;
            }
            this.$api
                .getRemoteDevWebUrlEnable({
                    deviceId: data.id,
                })
                .then((res) => {
                    if (res.success == true) {
                        if (res.data) {
                            this.$set(this.tableData, scope.$index, {
                                ...data,
                                ...{
                                    remoteAccessUrl: true,
                                },
                            });
                        }
                    }
                });
        },
        remoteAccess(data) {
            this.$api
                .getRemoteDevWebUrl({
                    deviceId: data.id,
                })
                .then((res) => {
                    if (res.success == true) {
                        window.open(res.data);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
    },
    mounted() {
        this.setWrap();
        // this.timer = setInterval(() => {
        //     //创建定时器
        //     this.getDevConfigModifyStatus();
        // }, 30000);
        sessionStorage.removeItem("deviceInfoList");

        window.addEventListener("resize", this.canvasResize);
        this.$nextTick(() => {
            this.canvasResize();
        });
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.canvasResize);
    },
    created() {
        this.getDictionList();
        this.getParamOrganizeTree();
        // this.getDevConfigModifyStatus();
        this.$store.dispatch("SetTabName", "protocol");
    },
};
</script>
<style lang="less">
.popover_a_class {
    width: 100px;
    min-width: 100px !important;
}
.option-high {
    color: #1890ff;
    text-align: center;
    line-height: 32px;
}
.upload-log-dialog {
    .el-dialog__body {
        padding: 0px !important;
    }
    .dialog-footer {
        border-top: 1px solid #ebebeb;
        display: flex;
        justify-content: flex-end;
        padding: 12px !important;
    }
}
.selection-dialog {
    .el-table__fixed-body-wrapper {
        tr {
            height: 36px !important;
        }
    }
}
.protocol-dialog {
    .el-dialog__body {
        padding: 0px !important;
        height: calc(~"100% - 36px");
        .el-dialog__body-wrapper {
            height: 100%;
        }
    }
}
.awaken-dialog {
    .el-dialog__body {
        padding: 0px 20px !important;
    }
}
</style>
<style lang="less" scoped>
// .colorBlue {
//   color: #0099FF;
// }
.colorBlue {
    color: #4886ff;
}
.popover_a {
    display: flex;
    justify-content: center;
    color: #555555;
    padding: 5px 0;
}
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

/deep/.el-alert {
    .el-alert__content,
    .el-alert__title {
        width: 100%;
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
.select-alert {
    background: #e6f7ff !important;
    // border: 1px solid rgba(145, 213, 255, 1) !important;
    border-radius: 2px;
    color: #000000;
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
/deep/.awaken-dialog {
    display: flex;
    padding-right: 12px;
    .el-icon-warning {
        font-size: 26px;
        margin-right: 12px;
        color: #ff952c;
    }
    .right-box {
        .title-box {
            p:nth-child(1) {
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 12px;
            }
        }
    }
    .el-input-number {
        line-height: 30px;
    }
    .el-form-item {
        margin-bottom: 0px;
    }
    .el-form-item__content {
        line-height: 36px;
    }
    .tip-msg {
        display: block;
        font-size: 12px;
        line-height: 10px;
        color: #ccc;
    }
    .slider-box {
        display: flex;
        align-items: center;
        & > div {
            flex: 1;
        }
        .dis-span {
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
            height: 6px;
            width: 50px;
            background-color: #c0c4cc;
        }
    }
}
</style>
