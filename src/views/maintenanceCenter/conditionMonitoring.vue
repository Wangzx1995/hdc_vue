<template>
    <div class="condition-monitoring">
        <div class="batch_num_eq p-x b-b">
            <div layout>
                <div class="batch_num_eq_border">
                    {{ $t("conditionMonitoring.devicesTotalNumber") }}
                    ：{{ totalInfo.totalCount }}
                </div>
                <div class="batch_num_eq_border">
                    {{ $t("conditionMonitoring.faultyDevicesTotalNumber") }}
                    ：{{ totalInfo.totalAlarmCount }}
                </div>
                <div>
                    {{ $t("conditionMonitoring.failureRate") }}
                    ：{{ totalInfo.failureRate }}
                </div>
            </div>
            <div class="batch_time_eq">
                {{ $t("conditionMonitoring.statisticalTime") }}
                ：{{ totalInfo.time }}
            </div>
        </div>
        <div class="content-box">
            <div
                class="left-content p-a b-r"
                :class="isShowTree ? 'isShowTree' : 'isHideTree'"
            >
                <el-input
                    class="searchBottom"
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
                        :default-expanded-keys="expandedList"
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
            <div :class="isShowTree ? 'isShowTable' : 'isHideTable'">
                <div class="wrap">
                    <div ref="searchBox" class="search-module p-x-md">
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

                                <el-form-item
                                    prop="deviceStatusList"
                                    :label="$t('common.deviceStatus')"
                                >
                                    <el-select
                                        multiple
                                        collapse-tags
                                        v-model="searchForm.deviceStatusList"
                                        :placeholder="$t('common.select')"
                                        clearable
                                    >
                                        <el-option
                                            v-for="(
                                                item, index
                                            ) in deviceStatusList"
                                            :key="index"
                                            :value="item.value"
                                            :label="item.text"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item
                                    prop="version"
                                    :label="$t('common.softwareVersion')"
                                >
                                    <el-input
                                        v-model="searchForm.version"
                                        :placeholder="$t('common.input')"
                                        :maxlength="20"
                                        clearable
                                    ></el-input>
                                </el-form-item>

                                <el-form-item
                                    prop="storageStatusList"
                                    :label="
                                        $t('conditionMonitoring.storageStatus')
                                    "
                                >
                                    <el-select
                                        multiple
                                        collapse-tags
                                        v-model="searchForm.storageStatusList"
                                        :placeholder="$t('common.select')"
                                        clearable
                                    >
                                        <el-option
                                            v-for="(item, index) in storeArr"
                                            :key="index"
                                            :label="item.text"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item
                                    prop="lostVideoChannelStatusList"
                                    :label="
                                        $t(
                                            'conditionMonitoring.videoSignalStatus'
                                        )
                                    "
                                >
                                    <el-select
                                        multiple
                                        collapse-tags
                                        v-model="
                                            searchForm.lostVideoChannelStatusList
                                        "
                                        :placeholder="$t('common.select')"
                                        clearable
                                    >
                                        <el-option
                                            v-for="(
                                                item, index
                                            ) in videoStatusArr"
                                            :key="index"
                                            :label="item.text"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item
                                    prop="gpsStatusList"
                                    :label="
                                        $t(
                                            'conditionMonitoring.positioningStatus'
                                        )
                                    "
                                >
                                    <el-select
                                        multiple
                                        collapse-tags
                                        v-model="searchForm.gpsStatusList"
                                        :placeholder="$t('common.select')"
                                        clearable
                                    >
                                        <el-option
                                            v-for="(
                                                item, index
                                            ) in gpsStatusArr"
                                            :key="index"
                                            :label="item.text"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item
                                    prop="adasStatus"
                                    :label="
                                        $t(
                                            'conditionMonitoring.ADASCalibrationStatus'
                                        )
                                    "
                                >
                                    <el-select
                                        multiple
                                        collapse-tags
                                        v-model="searchForm.adasStatus"
                                        :placeholder="$t('common.select')"
                                        clearable
                                        class="adas-status"
                                    >
                                        <el-option
                                            v-for="(
                                                item, index
                                            ) in adasStatusList"
                                            :key="index"
                                            :label="item.text"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div ref="searchBtn" class="search-btn">
                            <el-button
                                type="primary"
                                :loading="searchLoading"
                                @click="
                                    params.currentPage = 1;
                                    search();
                                "
                            >
                                {{ $t("common.search") }}
                            </el-button>
                            <el-button
                                type="default"
                                @click="handleReset($refs.searchForm)"
                            >
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
                    <div class="wrap-top p-x-md" ref="searchBtn">
                        <div>
                            <el-button
                                @click="goExport"
                                :disabled="loadingAll"
                                :loading="loadingAll"
                                v-btn="'conditionMonitoringExport'"
                            >
                                {{ $t("common.export") }}
                            </el-button>
                            <el-button @click="customShow">
                                {{ $t("conditionMonitoring.headerSettings") }}
                            </el-button>
                        </div>
                        <div class="fault-count">
                            <span>
                                {{
                                    $t(
                                        "conditionMonitoring.organizationalFailuresNumber"
                                    )
                                }}
                                ：
                            </span>
                            <el-checkbox-group
                                v-model="searchForm.faultStatus"
                                @change="faultChange"
                            >
                                <el-checkbox label="all">
                                    {{ $t("conditionMonitoring.allDevices") }}
                                </el-checkbox>
                                <el-checkbox label="storageStatusQuery">
                                    {{
                                        $t("conditionMonitoring.storageFailure")
                                    }}
                                    ({{
                                        alarmCountsByOrg.storageStatusCount
                                    }})</el-checkbox
                                >
                                <el-checkbox label="gpsStatusQuery">
                                    {{
                                        $t("conditionMonitoring.locateFailure")
                                    }}
                                    ({{
                                        alarmCountsByOrg.gpsStatusCount
                                    }})</el-checkbox
                                >
                                <el-checkbox
                                    label="lostVideoChannelStatusQuery"
                                >
                                    {{
                                        $t(
                                            "conditionMonitoring.videoSignalFailure"
                                        )
                                    }}
                                    ({{
                                        alarmCountsByOrg.lostVideoChannelStatusCount
                                    }})</el-checkbox
                                >
                                <el-checkbox label="recordStatusQuery">
                                    {{
                                        $t(
                                            "conditionMonitoring.pictureRecordingFailure"
                                        )
                                    }}
                                    ({{
                                        alarmCountsByOrg.videoRecordCount
                                    }})</el-checkbox
                                >
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div class="p-x-md p-y">
                        <el-table
                            ref="table"
                            id="clickTable"
                            v-if="!customBol"
                            border
                            v-loading="searchLoading"
                            :element-loading-text="
                                $t('common.desperatelyLoading')
                            "
                            element-loading-color="#007213"
                            :data="tableData"
                            :height="tableHeight"
                            label-width="auto"
                            @selection-change="onSelectionChange"
                            @filter-change="filterChange"
                            @row-click="rowClick"
                            highlight-current-row
                            @cell-mouse-enter="cellMouseEnter"
                        >
                            <el-table-column
                                prop="plateNum"
                                :label="$t('common.plateNum')"
                                fixed
                                min-width="160px"
                            >
                                <template slot-scope="scope">
                                    <div v-if="scope.row.plateNum">
                                        <div
                                            :class="{
                                                copy:
                                                    nowHoverCellRow2 ===
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
                                        <el-popover
                                            placement="top"
                                            v-for="item in scope.row
                                                .abnormalVos"
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

                            <el-table-column
                                v-if="copyUpdateCustomJson.signalIntensity"
                                prop="signalIntensity"
                                :label="
                                    $t(
                                        'conditionMonitoring.networkSignalStatus'
                                    )
                                "
                                min-width="100px"
                                key="signalIntensity"
                            >
                                <template slot-scope="scope">
                                    <el-popover
                                        ref="popover1"
                                        placement="top"
                                        trigger="hover"
                                        :open-delay="300"
                                        :content="
                                            $t(
                                                'conditionMonitoring.dataUpdateTime'
                                            ) +
                                            '：' +
                                            (scope.row.signalIntensityTime ||
                                                '--')
                                        "
                                    ></el-popover>
                                    <signal
                                        v-popover:popover1
                                        v-if="
                                            scope.row.signalIntensity >= 0 &&
                                            scope.row.signalIntensity <= 5
                                        "
                                        :strength="scope.row.signalIntensity"
                                    ></signal>
                                    <div v-else>
                                        {{ $t("common.unknown") }}
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                v-if="copyUpdateCustomJson.storageStatus"
                                prop="storageStatus"
                                :label="$t('conditionMonitoring.storageStatus')"
                                min-width="140px"
                                column-key="storageStatus"
                                :render-header="
                                    (h) => {
                                        return h('span', { class: 'poptip' }, [
                                            h(
                                                'span',
                                                $t(
                                                    'conditionMonitoring.storageStatus'
                                                )
                                            ),
                                            h(
                                                'Poptip',
                                                {
                                                    props: {
                                                        placement: 'top',
                                                        width: '80px',
                                                        trigger: 'hover',
                                                        offset: 2,
                                                        transfer: true,
                                                        title: $t(
                                                            'conditionMonitoring.storageStatus'
                                                        ),
                                                    },
                                                    style: {
                                                        'font-weight': '400',
                                                    },
                                                },
                                                [
                                                    h('Icon', {
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
                                                            'conditionMonitoring.storageStatusDesc'
                                                        )
                                                    ),
                                                ]
                                            ),
                                        ]);
                                    }
                                "
                            >
                                <template slot-scope="scope">
                                    <el-popover
                                        ref="popover6"
                                        placement="top"
                                        :open-delay="200"
                                        trigger="hover"
                                        :content="
                                            $t(
                                                'conditionMonitoring.dataUpdateTime'
                                            ) +
                                            '：' +
                                            (scope.row.storageStatusTime ||
                                                '--') +
                                            ' ' +
                                            scope.row.storageDetail
                                        "
                                    ></el-popover>
                                    <div
                                        v-if="
                                            !scope.row.showNothing &&
                                            scope.row.storageDetails &&
                                            scope.row.storageDetails.length > 0
                                        "
                                    >
                                        <span
                                            v-for="(
                                                item, index
                                            ) in scope.row.storageDetails.filter(
                                                (k) =>
                                                    k.status > 0 && k.type > -1
                                            )"
                                            :key="index"
                                            class="imgHeight"
                                            :title="item.name"
                                        >
                                            <el-tooltip placement="top">
                                                <div slot="content">
                                                    {{
                                                        item.name +
                                                        "(" +
                                                        item.capacity +
                                                        "GB)"
                                                    }}<br />{{
                                                        $t(
                                                            "conditionMonitoring.dataUpdateTime"
                                                        ) +
                                                        "：" +
                                                        (scope.row
                                                            .storageStatusTime ||
                                                            "--") +
                                                        " " +
                                                        scope.row.storageDetail
                                                    }}
                                                </div>
                                                <img
                                                    v-if="
                                                        item.status > 0 &&
                                                        item.type > -1
                                                    "
                                                    :src="
                                                        getImage(
                                                            item.type,
                                                            item.status,
                                                            item.name
                                                        )
                                                    "
                                                />
                                            </el-tooltip>
                                        </span>
                                    </div>
                                    <div
                                        class="text-nowrap text-muted"
                                        v-if="scope.row.showNothing"
                                        v-popover:popover6
                                    >
                                        ●

                                        {{
                                            $t(
                                                "conditionMonitoring.doesNotExist"
                                            )
                                        }}
                                    </div>

                                    <div
                                        class="text-nowrap text-success"
                                        v-if="
                                            scope.row.storageStatus == 1 &&
                                            !scope.row.storageDetails
                                        "
                                        v-popover:popover6
                                    >
                                        ●

                                        {{ $t("conditionMonitoring.normal") }}
                                    </div>
                                    <div
                                        class="text-nowrap text-error"
                                        v-else-if="
                                            scope.row.storageStatus == 0 &&
                                            !scope.row.storageDetails
                                        "
                                        v-popover:popover6
                                    >
                                        ●

                                        {{ $t("conditionMonitoring.abnormal") }}
                                    </div>
                                    <div
                                        class="text-nowrap text-muted"
                                        v-if="
                                            !scope.row.storageDetails &&
                                            scope.row.storageStatus != 1 &&
                                            scope.row.storageStatus != 0
                                        "
                                        v-popover:popover6
                                    >
                                        ●

                                        {{ $t("common.unknown") }}
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                v-if="copyUpdateCustomJson.gpsStatus"
                                prop="gpsStatus"
                                :label="
                                    $t('conditionMonitoring.positioningStatus')
                                "
                                min-width="120px"
                                column-key="gpsStatus"
                            >
                                <template slot-scope="scope">
                                    <el-popover
                                        ref="popover5"
                                        placement="top"
                                        :open-delay="200"
                                        trigger="hover"
                                        :content="
                                            $t(
                                                'conditionMonitoring.positioningTime'
                                            ) +
                                            '：' +
                                            ((scope.row.hdcGpsDataVo &&
                                                scope.row.hdcGpsDataVo
                                                    .collectTime) ||
                                                '--') +
                                            $t(
                                                'conditionMonitoring.latAndLong'
                                            ) +
                                            '：' +
                                            ((scope.row.hdcGpsDataVo &&
                                                scope.row.hdcGpsDataVo
                                                    .longitude) ||
                                                '--') +
                                            ',' +
                                            ((scope.row.hdcGpsDataVo &&
                                                scope.row.hdcGpsDataVo
                                                    .latitude) ||
                                                '--') +
                                            $t(
                                                'conditionMonitoring.directionAngle'
                                            ) +
                                            '：' +
                                            ((scope.row.hdcGpsDataVo &&
                                                scope.row.hdcGpsDataVo
                                                    .direction) ||
                                                '--') +
                                            '°'
                                        "
                                    ></el-popover>
                                    <div
                                        class="text-nowrap text-success"
                                        v-if="scope.row.gpsStatus == 1"
                                        v-popover:popover5
                                    >
                                        ●

                                        {{ $t("conditionMonitoring.normal") }}
                                    </div>
                                    <div
                                        class="text-nowrap text-error"
                                        v-else-if="scope.row.gpsStatus == 0"
                                        v-popover:popover5
                                    >
                                        ●

                                        {{ $t("conditionMonitoring.abnormal") }}
                                    </div>
                                    <div
                                        class="text-nowrap text-muted"
                                        v-else
                                        v-popover:popover5
                                    >
                                        ●

                                        {{ $t("common.unknown") }}
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                v-if="
                                    copyUpdateCustomJson.lostVideoChannelStatus
                                "
                                column-key="lostVideoChannelStatus"
                                prop="lostVideoChannelStatus"
                                :label="
                                    $t('conditionMonitoring.videoSignalStatus')
                                "
                                min-width="120px"
                                :render-header="
                                    (h) => {
                                        return h('span', { class: 'poptip' }, [
                                            h(
                                                'span',
                                                $t(
                                                    'conditionMonitoring.videoSignalStatus'
                                                )
                                            ),
                                            h(
                                                'Poptip',
                                                {
                                                    props: {
                                                        placement: 'top',
                                                        width: '80px',
                                                        trigger: 'hover',
                                                        offset: 2,
                                                        transfer: true,
                                                        title: $t(
                                                            'conditionMonitoring.videoSignalStatus'
                                                        ),
                                                    },
                                                    style: {
                                                        'font-weight': '400',
                                                    },
                                                },
                                                [
                                                    h('Icon', {
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
                                                            'conditionMonitoring.storageStatusDesc'
                                                        )
                                                    ),
                                                ]
                                            ),
                                        ]);
                                    }
                                "
                            >
                                <template slot-scope="scope">
                                    <el-popover
                                        :open-delay="300"
                                        ref="popover2"
                                        placement="top"
                                        trigger="hover"
                                        :content="
                                            $t(
                                                'conditionMonitoring.dataUpdateTime'
                                            ) +
                                            '：' +
                                            (scope.row
                                                .lostVideoChannelStatusTime ||
                                                '--')
                                        "
                                    ></el-popover>

                                    <div
                                        class="text-nowrap text-success ownStyle"
                                        v-popover:popover2
                                        v-if="
                                            scope.row.lostVideoChannelStatus ==
                                            1
                                        "
                                    >
                                        ●

                                        {{ $t("conditionMonitoring.normal") }}
                                    </div>
                                    <div
                                        class="text-nowrap text-error ownStyle"
                                        v-popover:popover2
                                        v-else-if="
                                            scope.row.lostVideoChannelStatus ==
                                                0 &&
                                            scope.row
                                                .lostVideoChannelStatusDetailList &&
                                            scope.row
                                                .lostVideoChannelStatusDetailList
                                                .length
                                        "
                                    >
                                        <span
                                            v-for="(item, index) in scope.row
                                                .lostVideoChannelStatusDetailList"
                                            v-bind:key="index"
                                            :class="
                                                item.status == 0
                                                    ? 'text-error'
                                                    : 'text-success'
                                            "
                                            >{{ item.channelNum }}
                                        </span>
                                        <div
                                            class="text-nowrap text-error ownStyle"
                                            v-popover:popover2
                                            v-if="
                                                !scope.row
                                                    .lostVideoChannelStatusDetailList
                                                    .length
                                            "
                                        >
                                            ●

                                            {{ $t("common.unknown") }}
                                        </div>
                                    </div>
                                    <div
                                        class="text-nowrap text-error ownStyle"
                                        v-popover:popover2
                                        v-else-if="
                                            scope.row.lostVideoChannelStatus ==
                                                0 &&
                                            scope.row
                                                .lostVideoChannelStatusDetailList &&
                                            !scope.row
                                                .lostVideoChannelStatusDetailList
                                                .length
                                        "
                                    >
                                        <div
                                            class="text-nowrap text-error ownStyle"
                                            v-popover:popover2
                                        >
                                            ●

                                            {{
                                                $t(
                                                    "conditionMonitoring.abnormal"
                                                )
                                            }}
                                        </div>
                                    </div>
                                    <div
                                        class="text-nowrap text-muted ownStyle"
                                        v-popover:popover2
                                        v-else
                                    >
                                        ●

                                        {{ $t("common.unknown") }}
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                v-if="copyUpdateCustomJson.recordStatus"
                                column-key="recordStatus"
                                prop="recordStatus"
                                :label="
                                    $t(
                                        'conditionMonitoring.videoRecordingStatus'
                                    )
                                "
                                min-width="120px"
                                :render-header="
                                    (h) => {
                                        return h('span', { class: 'poptip' }, [
                                            h(
                                                'span',
                                                $t(
                                                    'conditionMonitoring.videoRecordingStatus'
                                                )
                                            ),
                                            h(
                                                'Poptip',
                                                {
                                                    props: {
                                                        placement: 'top',
                                                        width: '80px',
                                                        trigger: 'hover',
                                                        offset: 2,
                                                        transfer: true,
                                                        title: $t(
                                                            'conditionMonitoring.videoRecordingStatus'
                                                        ),
                                                    },
                                                    style: {
                                                        'font-weight': '400',
                                                    },
                                                },
                                                [
                                                    h('Icon', {
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
                                                            'conditionMonitoring.storageStatusDesc'
                                                        )
                                                    ),
                                                ]
                                            ),
                                        ]);
                                    }
                                "
                            >
                                <template slot-scope="scope">
                                    <el-popover
                                        ref="popover12"
                                        placement="top"
                                        :open-delay="200"
                                        trigger="hover"
                                        :content="
                                            $t(
                                                'conditionMonitoring.recordingTime'
                                            ) +
                                            '：' +
                                            (scope.row.recordStatusTime || '--')
                                        "
                                    ></el-popover>
                                    <div
                                        class="text-nowrap text-success"
                                        v-if="scope.row.recordStatus == 1"
                                        v-popover:popover12
                                    >
                                        ●

                                        {{ $t("conditionMonitoring.normal") }}
                                    </div>
                                    <div
                                        class="text-nowrap text-error"
                                        v-else-if="scope.row.recordStatus == 0"
                                        v-popover:popover12
                                    >
                                        ●

                                        {{ $t("conditionMonitoring.abnormal") }}
                                    </div>
                                    <div
                                        class="text-nowrap text-muted"
                                        v-else
                                        v-popover:popover12
                                    >
                                        ●

                                        {{ $t("common.unknown") }}
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                v-if="
                                    copyUpdateCustomJson.rightTurnSignalStatus
                                "
                                prop="rightTurnSignalStatus"
                                :label="$t('conditionMonitoring.rightTurn')"
                                min-width="100px"
                                column-key="rightTurnSignalStatus"
                            >
                                <template slot-scope="scope">
                                    <el-popover
                                        ref="popover8"
                                        placement="top"
                                        :open-delay="200"
                                        trigger="hover"
                                        :content="
                                            $t('common.updateTime') +
                                            '：' +
                                            (scope.row
                                                .rightTurnSignalUpdateTime ||
                                                '--')
                                        "
                                    ></el-popover>
                                    <div
                                        class="text-nowrap text-success"
                                        v-if="
                                            scope.row.rightTurnSignalStatus == 1
                                        "
                                        v-popover:popover8
                                    >
                                        ●

                                        {{
                                            $t(
                                                "conditionMonitoring.wireConnection"
                                            )
                                        }}
                                    </div>
                                    <div
                                        class="text-nowrap text-error"
                                        v-else-if="
                                            scope.row.rightTurnSignalStatus == 0
                                        "
                                        v-popover:popover8
                                    >
                                        ●

                                        {{ $t("conditionMonitoring.notWired") }}
                                    </div>
                                    <div
                                        class="text-nowrap text-muted"
                                        v-else
                                        v-popover:popover8
                                    >
                                        ●

                                        {{ $t("common.unknown") }}
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                v-if="copyUpdateCustomJson.leftTurnSignalStatus"
                                prop="leftTurnSignalStatus"
                                :label="$t('conditionMonitoring.leftTurn')"
                                min-width="100px"
                                column-key="leftTurnSignalStatus"
                            >
                                <template slot-scope="scope">
                                    <el-popover
                                        ref="popover9"
                                        placement="top"
                                        :open-delay="200"
                                        trigger="hover"
                                        :content="
                                            $t('common.updateTime') +
                                            '：' +
                                            (scope.row
                                                .leftTurnSignalUpdateTime ||
                                                '--')
                                        "
                                    ></el-popover>
                                    <div
                                        class="text-nowrap text-success"
                                        v-if="
                                            scope.row.leftTurnSignalStatus == 1
                                        "
                                        v-popover:popover9
                                    >
                                        ●

                                        {{
                                            $t(
                                                "conditionMonitoring.wireConnection"
                                            )
                                        }}
                                    </div>
                                    <div
                                        class="text-nowrap text-error"
                                        v-else-if="
                                            scope.row.leftTurnSignalStatus == 0
                                        "
                                        v-popover:popover9
                                    >
                                        ●

                                        {{ $t("conditionMonitoring.notWired") }}
                                    </div>
                                    <div
                                        class="text-nowrap text-muted"
                                        v-else
                                        v-popover:popover9
                                    >
                                        ●

                                        {{ $t("common.unknown") }}
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                v-if="copyUpdateCustomJson.brakeSignalStatus"
                                prop="brakeSignalStatus"
                                :label="
                                    $t('deviceLoadReportVerify.brakeStatus')
                                "
                                min-width="100px"
                                column-key="brakeSignalStatus"
                            >
                                <template slot-scope="scope">
                                    <el-popover
                                        ref="popover10"
                                        placement="top"
                                        :open-delay="200"
                                        trigger="hover"
                                        :content="
                                            $t('common.updateTime') +
                                            '：' +
                                            (scope.row.brakeSignalUpdateTime ||
                                                '--')
                                        "
                                    ></el-popover>
                                    <div
                                        class="text-nowrap text-success"
                                        v-if="scope.row.brakeSignalStatus == 1"
                                        v-popover:popover10
                                    >
                                        ●

                                        {{
                                            $t(
                                                "conditionMonitoring.wireConnection"
                                            )
                                        }}
                                    </div>
                                    <div
                                        class="text-nowrap text-error"
                                        v-else-if="
                                            scope.row.brakeSignalStatus == 0
                                        "
                                        v-popover:popover10
                                    >
                                        ●

                                        {{ $t("conditionMonitoring.notWired") }}
                                    </div>
                                    <div
                                        class="text-nowrap text-muted"
                                        v-else
                                        v-popover:popover10
                                    >
                                        ●

                                        {{ $t("common.unknown") }}
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                v-if="copyUpdateCustomJson.adasStatus"
                                prop="adasStatus"
                                :label="
                                    $t(
                                        'conditionMonitoring.ADASCalibrationStatus'
                                    )
                                "
                                min-width="160px"
                            >
                                <template slot-scope="scope">
                                    <span v-if="scope.row.adasStatus > -1">
                                        {{
                                            adasStatusList.find(
                                                (e) =>
                                                    e.value ===
                                                    scope.row.adasStatus
                                            ).text
                                        }}
                                    </span>
                                    <span v-else>--</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                v-if="copyUpdateCustomJson.deviceCode"
                                prop="deviceCode"
                                :label="$t('common.deviceCode')"
                                min-width="140px"
                            >
                                <template slot-scope="scope">
                                    <div v-if="scope.row.deviceCode">
                                        <div
                                            :class="{
                                                copy:
                                                    nowHoverCellRow ===
                                                    scope.row.id,
                                            }"
                                            class="flex-box"
                                            @click.stop="
                                                copyCarNumber(
                                                    scope.row.deviceCode
                                                )
                                            "
                                        >
                                            <div>
                                                {{ scope.row.deviceCode }}
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else style="padding-left: 12px">
                                        --
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                v-if="copyUpdateCustomJson.deviceSerialNum"
                                prop="deviceSerialNum"
                                :label="$t('common.deviceSerialNum')"
                                min-width="140px"
                            >
                                <template slot-scope="scope">
                                    <div>
                                        {{ scope.row.deviceSerialNum }}
                                        <el-popover
                                            placement="top"
                                            v-for="item in scope.row
                                                .abnormalVos"
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

                            <el-table-column
                                v-if="copyUpdateCustomJson.vin"
                                prop="vin"
                                :label="$t('common.vin')"
                                min-width="140px"
                            ></el-table-column>

                            <el-table-column
                                v-if="copyUpdateCustomJson.deviceModelCode"
                                prop="deviceModelCode"
                                :label="$t('common.deviceModelCode')"
                                min-width="160px"
                                :show-overflow-tooltip="true"
                            >
                            </el-table-column>

                            <el-table-column
                                v-if="copyUpdateCustomJson.protocolName"
                                prop="protocolName"
                                :label="$t('common.protocolName')"
                                min-width="100px"
                                :show-overflow-tooltip="true"
                            >
                            </el-table-column>

                            <el-table-column
                                v-if="copyUpdateCustomJson.softwareVersion"
                                prop="softwareVersion"
                                :label="$t('common.softwareVersion')"
                                min-width="160px"
                            ></el-table-column>

                            <el-table-column
                                v-if="copyUpdateCustomJson.deviceStatus"
                                fixed="right"
                                column-key="deviceStatusChecked"
                                prop="deviceStatus"
                                :label="$t('common.deviceStatus')"
                                min-width="80px"
                                filter-placement="bottom"
                                key="deviceStatus"
                            >
                                <template slot-scope="scope">
                                    <el-popover
                                        ref="popover7"
                                        placement="top"
                                        :open-delay="300"
                                        trigger="hover"
                                        :content="
                                            $t(
                                                'conditionMonitoring.dataUpdateTime'
                                            ) +
                                            '：' +
                                            (scope.row.deviceStatusTime
                                                ? $moment(
                                                      scope.row.deviceStatusTime
                                                  ).format(
                                                      'YYYY-MM-DD HH:mm:ss'
                                                  )
                                                : '--')
                                        "
                                    ></el-popover>
                                    <el-tag
                                        v-if="scope.row.deviceStatus == 1"
                                        type="success"
                                        v-popover:popover7
                                    >
                                        {{ $t("common.deviceStatus_1") }}
                                    </el-tag>
                                    <el-tag
                                        v-else-if="scope.row.deviceStatus == 2"
                                        type="warning"
                                        v-popover:popover7
                                    >
                                        {{ $t("common.deviceStatus_2") }}
                                    </el-tag>
                                    <el-tag
                                        type="info"
                                        v-else-if="scope.row.deviceStatus == 0"
                                        v-popover:popover7
                                    >
                                        {{ $t("common.deviceStatus_0") }}
                                    </el-tag>
                                </template>
                            </el-table-column>

                            <el-table-column
                                prop="action"
                                :label="$t('common.operate')"
                                min-width="80px"
                                fixed="right"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        type="text"
                                        class="text-info"
                                        @click.stop="openDetail(scope.row)"
                                    >
                                        {{ $t("common.detail") }}
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="p-x-md wrap-bottom" ref="searchPagination">
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

        <el-dialog
            :visible="customBol"
            :title="$t('conditionMonitoring.headerSettings')"
            fill="blue"
            @close="customBol = false"
            class="modal-nopadding"
            width="800px"
        >
            <div>
                <el-row>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.signalIntensity">
                            {{ $t("conditionMonitoring.networkSignalStatus") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.storageStatus">
                            {{ $t("conditionMonitoring.storageStatus") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.gpsStatus">
                            {{ $t("conditionMonitoring.positioningStatus") }}
                        </el-checkbox>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-checkbox
                            v-model="updateCustomJson.lostVideoChannelStatus"
                        >
                            {{ $t("conditionMonitoring.videoSignalStatus") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.recordStatus">
                            {{ $t("conditionMonitoring.videoRecordingStatus") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox
                            v-model="updateCustomJson.rightTurnSignalStatus"
                        >
                            {{ $t("conditionMonitoring.rightTurn") }}
                        </el-checkbox>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-checkbox
                            v-model="updateCustomJson.leftTurnSignalStatus"
                        >
                            {{ $t("conditionMonitoring.leftTurn") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox
                            v-model="updateCustomJson.brakeSignalStatus"
                        >
                            {{ $t("deviceLoadReportVerify.brakeStatus") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.deviceStatus">
                            {{ $t("common.deviceStatus") }}
                        </el-checkbox>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.deviceSerialNum">
                            {{ $t("common.deviceSerialNum") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.deviceCode">
                            {{ $t("common.deviceCode") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.deviceModelCode">
                            {{ $t("common.deviceModelCode") }}
                        </el-checkbox>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.protocolName">
                            {{ $t("common.protocolName") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.vin">
                            {{ $t("common.vin") }}
                        </el-checkbox>
                    </el-col>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.softwareVersion">
                            {{ $t("common.softwareVersion") }}
                        </el-checkbox>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-checkbox v-model="updateCustomJson.adasStatus">
                            {{
                                $t("conditionMonitoring.ADASCalibrationStatus")
                            }}
                        </el-checkbox>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer">
                <el-button size="small" type="default" @click="doDefault">
                    {{ $t("sortHeader.restoreDefault") }}
                </el-button>
                <el-button
                    :loading="updateCustomJsonBol"
                    :disabled="updateCustomJsonBol"
                    size="small"
                    type="primary"
                    @click="doSave"
                >
                    {{ $t("common.save") }}
                </el-button>
            </div>
        </el-dialog>
        <el-drawer
            ref="drawerDetail"
            :visible.sync="drawerShow"
            :with-header="false"
            :size="880"
            :destroy-on-close="true"
            :modal="false"
            :wrapperClosable="false"
            :custom-class="'conditionMonitoring-drawer'"
        >
            <drawer-detail
                @closeDrawer="closeDrawer"
                @seeMore="seeMore"
                :detailData="detailData"
                :key="drawerKey"
            ></drawer-detail>
        </el-drawer>

        <el-dialog
            :title="$t('common.detail')"
            :fullscreen="true"
            :append-to-body="true"
            :visible.sync="detailVisible"
            width="30%"
            custom-class="conditionMonitoring-detail-dialog"
        >
            <detail-dialog
                :key="detailKey"
                :detailData="detailData"
                @closeDialog="detailVisible = false"
            ></detail-dialog>
        </el-dialog>
    </div>
</template>
<script>
import signal from "@/views/maintenanceCenter/historyPlaybackFile/vue/signal.vue";
import TimeUtil from "@/utils/time";
import timeCom from "@/components/timeCom";
import AttendenceRecord from "@/components/AttendenceRecord";
import conditionMonitoringDetail from "./conditionMonitoringDetail";
import conditionMonitoringPatrol from "./conditionMonitoringPatrol";
import drawerDetail from "./conditionMonitoringFile/drawer/drawerDetail.vue";
import detailDialog from "./conditionMonitoringFile/dialog/detailDialog.vue";
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
export default {
    name: "equipment",
    components: {
        TimeUtil,
        timeCom,
        AttendenceRecord,
        conditionMonitoringDetail,
        conditionMonitoringPatrol,
        drawerDetail,
        detailDialog,
        signal,
    },
    data() {
        return {
            drawerKey: "",
            detailKey: "",
            drawerShow: false,
            isShowTree: true,
            updateCustomJsonBol: false,
            defaultProps: {
                children: "children",
                label: "name",
            },
            title: "设备管理",
            customBol: false,
            customDialog: false,
            customJson: {
                signalIntensity: true,
                storageStatus: true,
                gpsStatus: true,
                lostVideoChannelStatus: true,
                recordStatus: true,
                rightTurnSignalStatus: false,
                leftTurnSignalStatus: false,
                brakeSignalStatus: false,
                deviceOnlineVo: true,
                deviceSerialNum: true,
                deviceCode: true,
                deviceModelCode: true,
                softwareVersion: true,
                vin: true,
                deviceStatus: true,
                protocolName: true,
            },
            updateCustomJson: "",
            copyUpdateCustomJson: "",
            organizationName: "",
            buttonClick: false,
            iconShow: false,
            tableHeight: 0,
            treeHeight: 500,

            alarmCountsByOrg: {
                storageStatusCount: 0,
                gpsStatusCount: 0,
                lostVideoChannelStatusCount: 0,
                videoRecordCount: 0,
            },
            totalInfo: {
                totalCount: 0,
                totalAlarmCount: 0,
                lostVideoChannelStatusCount: 0,
                occlusionChannelStatusCount: 0,
                storageStatusCount: 0,
                gpsStatusCount: 0,
                signalIntensity0Count: 0,
                videoRecordCount: 0,
            },

            loadingAll: false,
            searchLoading: false,
            videoStatusArr: [
                {
                    text: this.$t("conditionMonitoring.normal"),
                    value: 1,
                },
                {
                    text: this.$t("conditionMonitoring.abnormal"),
                    value: 0,
                },
                {
                    text: this.$t("common.unknown"),
                    value: 2,
                },
            ],
            storeArr: [
                {
                    text: this.$t("conditionMonitoring.normal"),
                    value: 1,
                },
                {
                    text: this.$t("conditionMonitoring.abnormal"),
                    value: 0,
                },
                {
                    text: this.$t("common.unknown"),
                    value: 2,
                },
            ],
            gpsStatusArr: [
                {
                    text: this.$t("conditionMonitoring.normal"),
                    value: 1,
                },
                {
                    text: this.$t("conditionMonitoring.abnormal"),
                    value: 0,
                },
                {
                    text: this.$t("common.unknown"),
                    value: 2,
                },
            ],
            deviceStatusList: [
                {
                    text: this.$t("common.deviceStatus_1"),
                    value: 1,
                },
                {
                    text: this.$t("common.deviceStatus_2"),
                    value: 2,
                },
                {
                    text: this.$t("common.deviceStatus_0"),
                    value: 0,
                },
            ],
            adasStatusList: [
                {
                    text: this.$t("conditionMonitoring.adasStatusListText0"),
                    value: 0,
                },
                {
                    text: this.$t("conditionMonitoring.adasStatusListText1"),
                    value: 1,
                },
                {
                    text: this.$t("conditionMonitoring.adasStatusListText2"),
                    value: 2,
                },
                {
                    text: this.$t("conditionMonitoring.adasStatusListText3"),
                    value: 3,
                },
                {
                    text: this.$t("conditionMonitoring.adasStatusListText4"),
                    value: 4,
                },
            ],
            searchForm: {
                deviceModelCode: "",
                lostVideoChannelStatusList: [],
                storageStatusList: [],
                gpsStatusList: [],
                deviceSerialNum: "",
                deviceStatusList: [],
                version: "",
                adasStatus: [],
                deviceCode: "",
                selectObj: {},
                faultStatus: ["all"],
            },
            params: {
                currentPage: 1,
                pageSize: 20,

                organizeId: "",
            },
            modalOnline: false,
            onlineTimeList: [],
            totalHours: 0,
            totalMinutes: 0,
            totalSeconds: 0,

            deviceModelList: [],
            tableData: [],
            copyTableData: [],
            total: 0,
            selection: [],
            file: null,
            /** 设备组织 **/
            treeData: [],
            expandedList: [],
            selectionIds: [],
            filterObj: {},
            filterTagShow: 0,
            exceptionTypeList: [],
            carVisible: false,
            carAddVisible: false,
            carDetails: {},
            patrolVisible: false,
            patrolAddVisible: false,
            patrolDetails: {},
            detailData: {},
            detailVisible: false,
            nowHoverCellRow: "",
            nowHoverCellRow2: "",
            nowHover: "",
            hoverRow: "",
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
    },
    methods: {
        copyCarNumber(carNumber) {
            let oInput = document.createElement("input");
            oInput.value = carNumber;
            document.body.appendChild(oInput);
            oInput.select();
            document.execCommand("Copy");
            oInput.remove();

            this.$message.success(
                this.$t("conditionMonitoring.replicatingSuccess")
            );
        },
        cellMouseEnter(row, col) {
            this.nowHover = row.id;
            this.hoverRow = row;

            if (col.label === this.$t("common.deviceCode")) {
                this.nowHoverCellRow = row.id;
            } else if (col.label === this.$t("common.plateNum")) {
                this.nowHoverCellRow2 = row.id;
            } else {
                this.nowHoverCellRow = "";
                this.nowHoverCellRow2 = "";
            }
        },

        getUserVisibleColumn() {
            let params = {
                path: "equipmentInspection/page",
            };
            this.$api.getUserVisibleColumn(params).then((res) => {
                if (res.success) {
                    if (res.data) {
                        this.copyUpdateCustomJson = JSON.parse(res.data);
                        this.updateCustomJson = JSON.parse(
                            JSON.stringify(res.data)
                        );
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

        doDefault() {
            let params = {
                path: "equipmentInspection/page",
                showColumns: JSON.stringify(this.customJson),
            };
            this.$api.saveUserVisibleColumn(params).then((res) => {
                if (res.success == true) {
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

        doSave: throttle(function (e) {
            this.updateCustomJsonBol = true;
            let params = {
                path: "equipmentInspection/page",
                showColumns: JSON.stringify(this.updateCustomJson),
            };
            this.$api.saveUserVisibleColumn(params).then((res) => {
                if (res.success) {
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
        filterTree(data, val, type) {
            data.forEach((item) => {
                if (item.name.indexOf(val) !== -1) {
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
        handleClick() {
            this.buttonClick = !this.buttonClick;
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },

        getExceptionType() {
            this.$api.getExceptionType().then((res) => {
                if (res.success == true) {
                    let arr = res.data;
                    arr.forEach((item) => {
                        if (item.sysDictCode != 22) {
                            this.exceptionTypeList.push(item);
                        }
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        filterNode(value, data) {
            return data[value] == true;
        },
        carVisibleClose() {
            this.carVisible = false;
            setTimeout(() => {
                this.carAddVisible = false;
            }, 300);
        },
        patrolVisibleClose() {
            this.patrolVisible = false;
            setTimeout(() => {
                this.patrolAddVisible = false;
            }, 300);
        },
        changeAlarmDev() {
            if (!this.params.organizeId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            this.params.currentPage = 1;
            this.search();
        },

        onSelectionChange(selection) {
            let list = [];
            selection.forEach((i) => {
                list.push(i.id);
            });
            this.selectionIds = list;
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.search();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.search();
        },
        filterTag(value, row) {
            return row.deviceStatus === value;
        },
        filterGpsTag(value, row) {
            return row.gpsStatus === value;
        },
        filterVideoTag(value, row) {
            return row.lostVideoChannelStatus === value;
        },
        filterStorageStatusTag(value, row) {
            return row.storageStatus === value;
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
        filterChange(obj) {
            this.filterTagShow = 0;
            Object.assign(this.filterObj, obj);
            for (let i in this.filterObj) {
                this.filterTagShow += this.filterObj[i].length;
            }
        },
        showModalOnline(data) {
            this.onlineTimeList = data.deviceOnlineSectionVoList;
            this.totalHours = data.totalHours;
            this.totalMinutes = data.totalMinutes;
            this.totalSeconds = data.totalSeconds;
            this.modalOnline = true;
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchPagination.clientHeight -
                160;
            this.treeHeight = document.body.clientHeight - 199;
        },
        setWrap() {
            if (this.$refs.wrap.scrollHeight > 46) {
                this.iconShow = true;
            } else {
                this.iconShow = false;
            }
        },
        getProductList() {
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
        search() {
            if (!this.params.organizeId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            let params = Object.assign({}, this.params, this.searchForm);
            params.faultStatus.forEach((k) => {
                params[k] = 0;
            });
            delete params.all;
            delete params.faultStatus;
            delete params.selectObj;
            this.getData(params);
            this.$store.dispatch("SetCondtion", this.searchForm);
        },
        getData(params) {
            this.searchLoading = true;
            this.$api.equipmentInspectionPage(params).then((res) => {
                if (res.success == true) {
                    this.tableData = [];
                    this.$nextTick(() => {
                        let listData = res.data.results;

                        listData.forEach((item) => {
                            item.rowspan = listData.filter(function (i) {
                                return i.plateNum == item.plateNum;
                            }).length;
                            if (
                                item.storageStatus != 1 &&
                                item.storageStatus != 0
                            ) {
                                item.storageStatus = -1;
                            }
                            if (item.gpsStatus != 1 && item.gpsStatus != 0) {
                                item.gpsStatus = -1;
                            }
                            if (
                                item.lostVideoChannelStatus != 1 &&
                                item.lostVideoChannelStatus != 0
                            ) {
                                item.lostVideoChannelStatus = -1;
                            }
                            if (
                                item.storageDetails &&
                                item.storageDetails.length > 0
                            ) {
                                item.showNothing = true;
                                for (
                                    let i = 0;
                                    i < item.storageDetails.length;
                                    i++
                                ) {
                                    if (
                                        item.storageDetails[i].status != 0 &&
                                        item.storageDetails[i].type > -1
                                    ) {
                                        item.showNothing = false;
                                        item.storageDetail = "";
                                        break;
                                    } else {
                                        item.showNothing = true;

                                        item.storageDetail = this.$t(
                                            "conditionMonitoring.storageCardAndHardDriveNotExist"
                                        );
                                    }
                                }
                            } else {
                                item.storageDetail = "";
                            }
                        });
                        for (let i = 1; i < listData.length; i++) {
                            if (
                                listData[i].plateNum == listData[i - 1].plateNum
                            ) {
                                listData[i].rowspan = 0;
                            }
                        }
                        this.tableData = listData;
                        this.copyTableData = JSON.parse(
                            JSON.stringify(this.tableData)
                        );
                        this.total = res.data.totalRecords;
                        this.selection = [];
                        this.$refs.table.doLayout();
                        this.$nextTick(() => {
                            this.setTableHeight();
                        });
                    });
                } else {
                    this.$message.error(res.msg);
                }
                this.searchLoading = false;
            });
        },
        /**
         * 多选
         * selection：已选项数据 row：刚选择的项数据
         */

        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
                this.$store.dispatch("SetCondtion", this.searchForm);
            }
        },

        handleNodeClick(data) {
            this.params.organizeId = data.id;
            this.params.currentPage = 1;
            this.search();
            this.equipmentInspectionGetAlarmCountsByOrg();
            this.getProductList();
            this.$store.dispatch("SetDeviceManageId", data.id);
        },

        getGroupTree() {
            this.searchLoading = true;
            this.$api.getOrgTree().then((res) => {
                this.expandedList = [];
                this.setTableHeight();
                if (res.success == true) {
                    this.treeData = res.data;
                    if (res.data.length > 0) {
                        this.params.organizeId = this.$store.state.tree
                            .deviceManageId
                            ? this.$store.state.tree.deviceManageId
                            : res.data[0].id;
                        this.searchForm = this.$store.state.tree.searchForm
                            ? this.$store.state.tree.searchForm
                            : this.searchForm;

                        this.$nextTick(() => {
                            this.treeData.forEach((m) => {
                                this.expandedList.push(m.id);
                            });
                            this.$refs["tree"].setCurrentKey(
                                this.params.organizeId
                            );
                        });
                        this.search();
                        this.getProductList();
                        this.equipmentInspectionGetAlarmCountsByOrg();
                    } else {
                        this.searchLoading = false;
                    }
                } else {
                    this.searchLoading = false;
                    this.$message.error(res.msg);
                }
            });
        },
        /** 项目组织管理end **/
        getAnomalyStatistics() {
            this.$api.getAnomalyStatistics().then((res) => {
                if (res.success == true) {
                    this.totalInfo = {
                        ...this.totalInfo,
                        ...res.data,
                        time: TimeUtil.getDateTime(new Date()),
                        failureRate:
                            (
                                (!!res.data.totalCount
                                    ? res.data.totalAlarmCount /
                                      res.data.totalCount
                                    : 0) * 100
                            ).toFixed(1) + "%",
                    };
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        /** 巡检列表查询条件故障统计数据 **/
        equipmentInspectionGetAlarmCountsByOrg() {
            this.$api
                .equipmentInspectionGetAlarmCountsByOrg({
                    orgId: this.params.organizeId,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.alarmCountsByOrg = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
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
                params.faultStatus.forEach((k) => {
                    params[k] = 0;
                });
                delete params.all;
                delete params.faultStatus;
                delete params.selectObj;
                this.$api.doExportEQDeviceList(params).then((res) => {
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
        getNameType(typeName, name) {
            if (typeName == "BACK" || typeName == "UD") {
                return "";
            }
            var startIndex = name.indexOf(typeName);
            var num = null;
            if (startIndex !== -1) {
                num = name.substring(
                    startIndex + typeName.length,
                    startIndex + typeName.length + 1
                );
            } else {
                num = name;
            }
            if (isNaN(Number(num))) {
                return "";
            } else {
                return num > 2 ? "" : num;
            }
        },
        getImage(type, status, name) {
            let typeObj = {
                0: "TF",
                1: "SD",
                2: "SSD",
                3: "HDD",
                4: "BACK",
                5: "BACK",
                6: "UD",
            };
            let imageUrl = `/static/images/conditionMonitoring/${
                typeObj[type]
            }${this.getNameType(typeObj[type], name)}${
                status == 1 || status == 5 ? "" : "_error"
            }.svg`;
            return imageUrl;
        },
        changeShowTree() {
            this.isShowTree = !this.isShowTree;
        },
        rowClick(row, column) {
            this.drawerKey = new Date().getTime();
            this.drawerShow = true;
            this.detailData = row;
        },
        closeDrawer() {
            this.$refs.drawerDetail.closeDrawer();
        },
        seeMore() {
            setTimeout(() => {
                this.closeDrawer();
            }, 300);
            this.detailKey = new Date().getTime();
            this.detailData = {
                ...this.detailData,
                time: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
            };
            this.detailVisible = true;
        },
        openDetail(row) {
            this.detailKey = new Date().getTime();
            this.detailVisible = true;
            this.detailData = {
                ...row,
                time: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
            };
        },
        faultChange(val) {
            if (!val || !val.length) {
                this.searchForm.faultStatus = ["all"];
            } else {
                if (val[val.length - 1] === "all") {
                    this.searchForm.faultStatus = ["all"];
                } else {
                    this.searchForm.faultStatus = val.filter(
                        (item) => item !== "all"
                    );
                }
            }
            this.params.currentPage = 1;
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
    },
    created() {
        this.getGroupTree();
        this.getAnomalyStatistics();
        this.getExceptionType();
        this.getUserVisibleColumn();
    },
};
</script>
<style lang="less" scoped>
.imgHeight {
    display: inline-block;
    height: 24px;
    margin: 0 4px 4px 0;
    img {
        height: 24px;
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
        }
        .el-form-item {
            margin-bottom: 12px !important;
        }
    }
    .hidden {
        height: 46px;
        overflow: hidden;
    }
    .wrap-bottom {
        border-top: 1px solid #e4e4e4;
    }
}
.marginBottom {
    margin-bottom: 0.5rem;
}
.el-icon-warning {
    cursor: pointer;
    font-size: 14px;
}
.height {
    height: 29px;
}

.searchBottom {
    margin-bottom: 8px;
}
.condition-monitoring {
    .treeHeight {
        height: calc(~"100vh - 7rem");
        overflow-x: scroll;
    }
    .loading_ {
        pointer-events: none;
    }
    .bg-template {
        background-color: #e6f7ff;
    }
    .template-bottom {
        position: fixed;
        bottom: 0;
        right: 0;
        left: 12.5rem;
        overflow-x: hidden;
    }
    .split {
        color: #d3d3d3;
        margin: 0 5px;
    }
    .template-content {
        margin-bottom: 4.5rem;
    }
    .batch {
        margin-left: 30px;
        margin-right: 50px;
    }
    .batch_return {
        float: left;
        font-size: 18px;
    }
    .batch_time_eq {
        float: right;
        font-size: 12px;
        margin-right: 0 !important;
        line-height: 24px;
        height: 24px;
    }
    .batch_num_eq {
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
    }
    .batch_num_eq div {
        margin-right: 10px;
    }
    .batch_num_eq_border {
        padding-right: 10px;
        border-right: solid 1px;
    }

    .poptip {
        padding: 8px;
    }
    .ivu-poptip-body {
        padding: 8px;
    }
    .datepicker-style {
        height: 24px;
    }
    .ivu-input {
        height: 24px;
    }
    .ivu-input-default {
        height: 24px;
    }
    .ivu-input-prefix i {
        line-height: 24px;
    }
    .ivu-input-suffix i {
        line-height: 24px;
    }
    .el-table__empty-block {
        height: 300px !important;
    }
    .signal-intensity {
        display: flex;
        color: rgb(24, 144, 255);
        img {
            width: 20px;
            margin-right: 6px;
        }
    }
}
/deep/.adas-status {
    .el-input {
        width: 250px !important;
    }
}
.content-box {
    display: flex;
    .left-content {
        width: 320px;
        position: relative;
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
    .searchBottom,
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
.flex-box {
    display: inline-block;
    cursor: pointer;
    padding: 2px 12px;
}
.copy {
    background: rgb(254, 228, 196);
}
.fault-count {
    display: flex;
    align-items: center;
    & > span {
        margin-right: 30px;
    }
    .el-checkbox-group {
        display: flex;
        align-items: center;
    }
}
</style>
<style lang="less">
.condition-monitoring {
    .el-drawer__wrapper {
        width: 880px;
        left: auto !important;
        right: 0;
        overflow: visible;
    }
}
.conditionMonitoring-dialog {
    .el-dialog__body {
        height: calc(~"100% - 60px");
        .condition-monitoring-detail {
            height: 100%;
            overflow-y: auto;
        }
    }
}
</style>
