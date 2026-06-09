<template>
    <div class="new-device-manage">
        <el-row>
            <!-- 左边树 -->
            <el-col :span="4" class="p-a b-r">
                <el-input
                    class=""
                    v-model="organizationName"
                    :placeholder="$t('common.inputOrganizationName')"
                    clearable
                >
                    <i
                        slot="suffix"
                        @click="filterTree"
                        class="searchIcon el-input__icon el-icon-search"
                    ></i>
                </el-input>
                <div :class="{ loading_: searchLoading }" class="m-t">
                    <div>
                        <el-popover
                            placement="bottom"
                            width="250"
                            v-model="addVisible"
                        >
                            <p class="m-b-sm text-width">
                                <!-- 上级组织 -->
                                {{ $t("common.superiorOrganization") }}：{{
                                    currentNode.name
                                }}
                            </p>
                            <el-form>
                                <el-form-item>
                                    <el-input
                                        :placeholder="
                                            $t('common.inputOrganizationName')
                                        "
                                        v-model="addOrganizeVal"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-form>
                            <div style="text-align: right; margin: 0">
                                <el-button
                                    type="link"
                                    size="mini"
                                    @click="addOrganize"
                                    >{{ $t("common.ok") }}</el-button
                                >
                            </div>
                            <el-button
                                size="mini"
                                slot="reference"
                                icon="el-icon-plus"
                                :disabled="
                                    !params.organizeId ||
                                    currentNode.source != 1
                                "
                                v-btn="'carManageAddGroup'"
                            />
                        </el-popover>
                        <el-popover
                            placement="bottom"
                            width="350"
                            v-model="editVisible"
                            @show="editOrganizeVal = currentNode.name"
                            trigger="manual"
                        >
                            <el-form
                                ref="form"
                                label-position="top"
                                prop="name"
                            >
                                <!-- 所属组织 -->
                                <el-form-item
                                    :label="$t('common.belongingOrganization')"
                                >
                                    <el-input
                                        :placeholder="
                                            $t('common.inputOrganizationName')
                                        "
                                        v-model="editOrganizeVal"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                                <!-- 上级组织 -->
                                <el-form-item
                                    :label="$t('common.superiorOrganization')"
                                    prop="parentId"
                                >
                                    <TreeSelect
                                        :placeholder="$t('common.select')"
                                        ref="treeId"
                                        @node-click="handleDialogNodeClick"
                                        :treeData="treeDataId"
                                        highlight-current
                                        filter
                                        v-model="moveOrgList.parentId"
                                        :props="defaultProps"
                                        :current-node-key="dialogNode.id"
                                    >
                                    </TreeSelect>
                                </el-form-item>
                            </el-form>
                            <div style="text-align: right; margin: 0">
                                <el-button
                                    type="link"
                                    size="mini"
                                    @click="editOrganize"
                                    >{{ $t("common.ok") }}</el-button
                                >
                                <el-button
                                    type="link"
                                    size="mini"
                                    @click="cancelEdit"
                                    >{{ $t("common.cancel") }}</el-button
                                >
                            </div>
                            <el-button
                                size="mini"
                                slot="reference"
                                icon="el-icon-edit"
                                :disabled="
                                    !params.organizeId ||
                                    currentNode.defaultNode == 0 ||
                                    currentNode.source != 1
                                "
                                @click="editVisibleClick()"
                                v-btn="'carManageEditGroup'"
                            />
                        </el-popover>
                        <el-popover
                            placement="bottom"
                            width="250"
                            v-model="deleteVisible"
                            v-if="currentNode.totalDevNum"
                        >
                            <p class="m-b-sm">
                                <!-- 当前组织包含车辆，不能删除，可移出车辆后删除。 -->
                                {{ $t("common.deletePointOut1") }}
                            </p>
                            <div style="text-align: right; margin: 0">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteVisible = false"
                                    >{{ $t("common.gotIt") }}</el-button
                                >
                            </div>
                            <el-button
                                size="mini"
                                slot="reference"
                                icon="el-icon-delete"
                                :disabled="
                                    !params.organizeId ||
                                    currentNode.source != 1 ||
                                    currentNode.defaultNode == 0
                                "
                                v-btn="'carManageDeleteGroup'"
                            />
                        </el-popover>
                        <el-popover
                            @show="showPopover"
                            placement="bottom"
                            width="250"
                            v-model="deleteVisible"
                            v-else
                        >
                            <p class="m-b-sm">{{ deletePointOut }}</p>
                            <div style="text-align: right; margin: 0">
                                <el-button
                                    type="default"
                                    size="mini"
                                    @click="deleteVisible = false"
                                    >{{ $t("common.cancel") }}</el-button
                                >
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteOrganize"
                                    >{{ $t("common.delete") }}</el-button
                                >
                            </div>
                            <el-button
                                size="mini"
                                slot="reference"
                                icon="el-icon-delete"
                                :disabled="
                                    !params.organizeId ||
                                    currentNode.source != 1 ||
                                    currentNode.defaultNode == 0
                                "
                                v-btn="'carManageDeleteGroup'"
                            />
                        </el-popover>
                    </div>
                    <div :style="editVisible ? 'pointer-events: none;' : ''">
                        <el-tree
                            class="m-t"
                            ref="tree"
                            :data="treeData"
                            :default-expanded-keys="TreeExpanded"
                            :expand-on-click-node="false"
                            @node-click="handleNodeClick"
                            :highlight-current="true"
                            node-key="id"
                            :filter-node-method="filterNode"
                            :props="defaultProps"
                            :current-node-key="params.organizeId"
                            :style="{ height: treeHeight + 'px' }"
                        >
                        </el-tree>
                    </div>
                </div>
            </el-col>
            <!-- 右边表 -->
            <el-col :span="20" class="">
                <div class="wrap">
                    <!-- 搜索区域 -->
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
                                <!-- 关键字 -->
                                <el-form-item
                                    :label="$t('common.keywords')"
                                    prop="plateNum"
                                >
                                    <G-DeviceSearch
                                        :valueKey="'plateNum'"
                                        :value.sync="searchForm.plateNum"
                                        :selectObj.sync="searchForm.selectObj"
                                        :organizeId="params.organizeId"
                                        :otherParams="{
                                            queryCar: 1,
                                            notInstaller: 1,
                                        }"
                                    ></G-DeviceSearch>
                                </el-form-item>
                                <!-- 车辆类型 -->
                                <el-form-item
                                    class="item"
                                    prop="carType"
                                    :label="$t('carManage.carType')"
                                >
                                    <el-select
                                        v-model="searchForm.carType"
                                        :placeholder="$t('common.select')"
                                        clearable
                                    >
                                        <el-option-group
                                            v-for="(
                                                group, index
                                            ) in carTypeList"
                                            :key="index"
                                            :label="group.carType"
                                        >
                                            <el-option
                                                v-for="item in group.carSubTypes"
                                                :key="item.value"
                                                :label="item.typeName"
                                                :value="item.typeCode"
                                            >
                                            </el-option>
                                        </el-option-group>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="search-btn">
                            <el-button
                                type="primary"
                                :disabled="searchLoading"
                                :loading="searchLoading"
                                @click="
                                    params.currentPage = 1;
                                    search();
                                "
                                >{{ $t("common.search") }}
                            </el-button>
                            <el-button
                                type="default"
                                @click="handleReset($refs.searchForm)"
                                >{{ $t("common.reset") }}</el-button
                            >
                            <el-button
                                :icon="
                                    !buttonClick
                                        ? 'el-icon-d-arrow-left'
                                        : 'el-icon-d-arrow-right'
                                "
                                @click="handleClick"
                                v-if="iconShow"
                            ></el-button>
                        </div>
                    </div>
                    <div class="wrap-top p-x" ref="searchBtn">
                        <div>
                            <el-button
                                type="primary"
                                @click="addCar"
                                :disabled="
                                    currentNode.defaultNode == 0 ||
                                    currentNode.source != 1
                                "
                                v-btn="'carManageAdd'"
                                >{{ $t("common.add") }}
                                <el-tooltip>
                                    <div slot="content">
                                        <div v-show="currentNode.source != 1">
                                            {{ $t("carManage.addMsg1") }}：<a
                                                href="https://vms.hikvisionauto.com:8040/"
                                                target="_blank"
                                                >https://vms.hikvisionauto.com:8040/</a
                                            >
                                        </div>
                                        <div
                                            v-show="
                                                currentNode.defaultNode == 0 &&
                                                currentNode.source == 1
                                            "
                                        >
                                            {{ $t("carManage.addMsg2") }}
                                        </div>
                                    </div>
                                    <i
                                        v-show="
                                            currentNode.defaultNode == 0 ||
                                            currentNode.source != 1
                                        "
                                        class="el-icon-question el-icon--right"
                                    ></i>
                                </el-tooltip>
                            </el-button>
                            <el-button
                                type="default"
                                @click="doBatchCar"
                                :disabled="
                                    selection.length <= 0 ||
                                    currentNode.source != 1
                                "
                                v-btn="'carManageDelete'"
                                >{{ $t("common.delete") }}
                            </el-button>
                            <el-button
                                type="default"
                                @click="treeDialogVisible = true"
                                :disabled="
                                    selection.length <= 0 ||
                                    currentNode.source != 1
                                "
                                v-btn="'carManageMove'"
                                >{{ $t("common.move") }}
                            </el-button>
                            <el-button
                                type="default"
                                @click="goImport"
                                :disabled="
                                    currentNode.source != 1 ||
                                    currentNode.defaultNode == 0
                                "
                                v-btn="'carManageImport'"
                                >{{ $t("common.import") }}
                                <el-tooltip>
                                    <div slot="content">
                                        <div v-show="currentNode.source != 1">
                                            {{ $t("carManage.addMsg1") }}：<a
                                                href="https://vms.hikvisionauto.com:8040/"
                                                target="_blank"
                                                >https://vms.hikvisionauto.com:8040/</a
                                            >
                                        </div>
                                        <div
                                            v-show="
                                                currentNode.defaultNode == 0 &&
                                                currentNode.source == 1
                                            "
                                        >
                                            {{ $t("carManage.addMsg2") }}
                                        </div>
                                    </div>
                                    <i
                                        v-show="
                                            currentNode.defaultNode == 0 ||
                                            currentNode.source != 1
                                        "
                                        class="el-icon-question el-icon--right"
                                    ></i> </el-tooltip
                            ></el-button>
                            <el-button
                                type="default"
                                @click="goExport"
                                :disabled="loadingAll"
                                :loading="loadingAll"
                                v-btn="'carManageExport'"
                            >
                                <!-- 导出 -->
                                {{ $t("common.export") }}
                            </el-button>
                        </div>
                        <!-- 包含下级组织车辆 -->
                        <div style="display: flex; align-items: center">
                            <el-checkbox v-model="params.checked">{{
                                $t("deviceSearch.includingVehicles")
                            }}</el-checkbox>
                        </div>
                    </div>
                    <!-- 列表区域 -->
                    <div class="m-y p-x">
                        <el-table
                            ref="table"
                            v-loading="searchLoading"
                            :element-loading-text="
                                $t('common.desperatelyLoading')
                            "
                            element-loading-color="#007213"
                            :data="listData"
                            :height="tableHeight"
                            row-key="carId"
                            border
                            stripe
                            @selection-change="onSelectionChange"
                            @filter-change="filterChange"
                        >
                            <el-table-column
                                :reserve-selection="true"
                                type="selection"
                            ></el-table-column>
                            <!-- 车牌号 -->
                            <el-table-column
                                prop="plateNum"
                                :label="$t('common.plateNum')"
                                width="140px"
                            >
                                <template slot-scope="scope">
                                    <div
                                        style="
                                            display: flex;
                                            flex-direction: row;
                                        "
                                    >
                                        <el-button
                                            @click="
                                                showPlateNumDetails(scope.row)
                                            "
                                            type="text"
                                            style="font-size: 12px"
                                        >
                                            {{ scope.row.plateNum || "--" }}
                                        </el-button>
                                        <div
                                            v-for="(o, index) in scope.row
                                                .deviceList"
                                            :key="index"
                                            style="
                                                display: flex;
                                                align-items: center;
                                            "
                                        >
                                            <el-popover
                                                placement="top"
                                                v-for="item in o.dataAbnormalList"
                                                :key="item.id"
                                                v-show="
                                                    item.type == 2 &&
                                                    item.deviceValue !=
                                                        scope.row.plateNum
                                                "
                                                :open-delay="300"
                                                trigger="hover"
                                            >
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
                                        </div>
                                        <span
                                            v-show="scope.row.freeze == 1"
                                            class="freeze-icon"
                                            >{{ $t("carManage.freeze") }}</span
                                        >
                                    </div>
                                </template>
                            </el-table-column>
                            <!-- 所属组织 -->
                            <el-table-column
                                prop="orgPath"
                                :label="$t('common.orgPath')"
                                show-overflow-tooltip
                                min-width="240px"
                            >
                            </el-table-column>
                            <!-- 车牌颜色 -->
                            <el-table-column
                                prop="plateColorName"
                                :label="$t('carManage.plateColor')"
                                width="160px"
                            >
                            </el-table-column>
                            <!-- 车辆类型 -->
                            <el-table-column
                                prop="carTypeName"
                                :label="$t('carManage.carType')"
                                width="160px"
                            >
                            </el-table-column>
                            <!-- 终端手机号 -->
                            <el-table-column
                                prop="deviceCode'"
                                :label="$t('common.deviceCode')"
                                width="140px"
                            >
                                <template slot-scope="scope">
                                    <div
                                        v-for="(val, index) in scope.row
                                            .deviceList"
                                        :key="index"
                                    >
                                        <div
                                            class="devRow"
                                            :style="
                                                index ==
                                                scope.row.deviceList.length - 1
                                                    ? 'border-bottom: none;'
                                                    : 'border-bottom: 1px solid #ebebeb;'
                                            "
                                        >
                                            {{ val.deviceCode || "--" }}
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <!-- 设备序列号 -->
                            <el-table-column
                                prop="deviceSerialNum"
                                :label="$t('common.deviceSerialNum')"
                                width="140px"
                            >
                                <template slot-scope="scope">
                                    <div
                                        class="devRow"
                                        :style="
                                            index ==
                                            scope.row.deviceList.length - 1
                                                ? 'border-bottom: none;'
                                                : 'border-bottom: 1px solid #ebebeb;'
                                        "
                                        v-for="(val, index) in scope.row
                                            .deviceList"
                                        :key="index"
                                    >
                                        <el-button
                                            @click="showDetails(val.id)"
                                            type="text"
                                            style="font-size: 12px"
                                        >
                                            {{ val.deviceSerialNum || "--" }}
                                        </el-button>
                                        <el-popover
                                            placement="top"
                                            v-for="item in val.dataAbnormalList"
                                            :key="item.id"
                                            v-show="
                                                item.type == 1 &&
                                                item.deviceValue !=
                                                    val.deviceSerialNum
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
                                                }}：{{ val.deviceSerialNum }}
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
                                                        val.deviceSerialNum
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
                            >
                                <template slot-scope="scope">
                                    <div
                                        v-for="(val, index) in scope.row
                                            .deviceList"
                                        :key="index"
                                    >
                                        <div
                                            class="devRow"
                                            :style="
                                                index ==
                                                scope.row.deviceList.length - 1
                                                    ? 'border-bottom: none;'
                                                    : 'border-bottom: 1px solid #ebebeb;'
                                            "
                                        >
                                            {{ val.vin || "--" }}
                                        </div>
                                    </div>
                                </template>
                                <!-- <template slot-scope="scope">
                                    <div>
                                        {{
                                            getArrStr(
                                                scope.row.deviceList,
                                                "vin"
                                            )
                                        }}
                                    </div>
                                </template> -->
                            </el-table-column>
                            <!-- 入网时间 -->
                            <el-table-column
                                prop="onlineTime"
                                :label="$t('carManage.onlineTime')"
                                width="165px"
                            ></el-table-column>
                            <!-- 最近定位上报时间 -->
                            <el-table-column
                                prop="lastGpsTime"
                                :label="$t('carManage.time')"
                                width="165px"
                            >
                                <template slot-scope="scope">
                                    <div
                                        v-for="(val, index) in scope.row
                                            .deviceList"
                                        :key="index"
                                    >
                                        <div
                                            class="devRow"
                                            :style="
                                                index ==
                                                scope.row.deviceList.length - 1
                                                    ? 'border-bottom: none;'
                                                    : 'border-bottom: 1px solid #ebebeb;'
                                            "
                                        >
                                            {{ val.lastGpsTime || "--" }}
                                        </div>
                                    </div>
                                </template>
                                <!-- <template slot-scope="scope">
                                    <div>
                                        {{
                                            getArrStr(
                                                scope.row.deviceList,
                                                "lastGpsTime"
                                            )
                                        }}
                                    </div>
                                </template> -->
                            </el-table-column>
                            <!-- 操作 -->
                            <el-table-column
                                :label="$t('common.operate')"
                                width="120px"
                                fixed="right"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        type="text"
                                        class="text-info colorBlue"
                                        @click="goEdit(scope.row)"
                                        :disabled="currentNode.source != 1"
                                        v-btn="'carManageEdit'"
                                        >{{ $t("common.edit") }}
                                    </el-button>
                                    <el-button
                                        type="text"
                                        class="text-info colorBlue"
                                        @click="
                                            doDelete(
                                                scope.row.carId,
                                                scope.row.deviceList
                                            )
                                        "
                                        :disabled="currentNode.source != 1"
                                        v-btn="'carManageDelete'"
                                        >{{ $t("common.delete") }}
                                    </el-button>
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
        <!-- 设备详情 -->
        <el-dialog
            :title="$t('carManage.deviceDetails')"
            :visible="processModal"
            :close-on-press-escape="false"
            @close="processModal = false"
            class="no-padding no-border"
        >
            <div style="height: 500px; overflow-y: auto">
                <div
                    :class="{ borderBottom: externModInfoVoListShow }"
                    class="device-contents"
                >
                    <!-- 主机信息 -->
                    <p class="device-title">
                        {{ $t("common.hostInformation") }}
                    </p>
                    <el-row>
                        <el-col :span="6">
                            <div class="device-box">
                                <!-- 设备型号 -->
                                <span class="device-label">{{
                                    $t("common.deviceModelCode")
                                }}</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.deviceModelCode"
                                >
                                    {{ deviceMessage.deviceModelCode || "--" }}
                                </p>
                            </div>
                            <div class="device-box">
                                <!-- 设备序列号 -->
                                <span class="device-label">{{
                                    $t("common.deviceSerialNum")
                                }}</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.deviceSerialNum"
                                >
                                    {{ deviceMessage.deviceSerialNum || "--" }}
                                </p>
                            </div>
                            <div class="device-box">
                                <!-- 车牌号 -->
                                <span class="device-label">{{
                                    $t("common.plateNum")
                                }}</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.plateNum"
                                >
                                    {{ deviceMessage.plateNum || "--" }}
                                </p>
                            </div>
                            <div class="device-box">
                                <!-- 生产订单号 -->
                                <span class="device-label">{{
                                    $t("common.productionNo")
                                }}</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.productionNo"
                                >
                                    {{ deviceMessage.productionNo || "--" }}
                                </p>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="device-box">
                                <!-- 终端手机号 -->
                                <span class="device-label">{{
                                    $t("common.deviceCode")
                                }}</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.deviceCode"
                                >
                                    {{ deviceMessage.deviceCode || "--" }}
                                </p>
                            </div>
                            <div class="device-box">
                                <!-- 版本号 -->
                                <span class="device-label">{{
                                    $t("common.softwareVersion")
                                }}</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.softwareVersion"
                                >
                                    {{ deviceMessage.softwareVersion || "--" }}
                                </p>
                            </div>
                            <div class="device-box">
                                <!-- 组织 -->
                                <span class="device-label">{{
                                    $t("common.orgPath")
                                }}</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.organizeName"
                                >
                                    {{ deviceMessage.organizeName || "--" }}
                                </p>
                            </div>
                            <div class="device-box">
                                <!-- 销售订单号 -->
                                <span class="device-label">{{
                                    $t("common.salesNo")
                                }}</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.salesNo"
                                >
                                    {{ deviceMessage.salesNo || "--" }}
                                </p>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="device-box">
                                <!-- 设备名称 -->
                                <span class="device-label">{{
                                    $t("common.deviceName")
                                }}</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.deviceName"
                                >
                                    {{ deviceMessage.deviceName || "--" }}
                                </p>
                            </div>
                            <div class="device-box">
                                <!-- 语言类型 -->
                                <span class="device-label">{{
                                    $t("common.languageType")
                                }}</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.language"
                                >
                                    {{ deviceMessage.language || "--" }}
                                </p>
                            </div>
                            <div class="device-box">
                                <!-- 添加人 -->
                                <span class="device-label">{{
                                    $t("common.addPeopleName")
                                }}</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.userName"
                                >
                                    {{ deviceMessage.userName || "--" }}
                                </p>
                            </div>
                            <div class="device-box">
                                <!-- 出货时设备版本号 -->
                                <span class="device-label">{{
                                    $t("common.saleDeviceVersion")
                                }}</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.saleDeviceVersion"
                                >
                                    {{
                                        deviceMessage.saleDeviceVersion || "--"
                                    }}
                                </p>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="device-box">
                                <!-- 设备状态 -->
                                <span class="device-label">{{
                                    $t("common.deviceStatus")
                                }}</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.deviceStatusName"
                                >
                                    {{ deviceMessage.deviceStatusName || "--" }}
                                </p>
                            </div>
                            <div class="device-box">
                                <!-- 心跳周期 -->
                                <span class="device-label">{{
                                    $t("common.heartbeat")
                                }}</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.heartbeat"
                                >
                                    {{ deviceMessage.heartbeat || "--" }}
                                </p>
                            </div>
                            <div class="device-box">
                                <span class="device-label">ICCID</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.iccId"
                                >
                                    {{ deviceMessage.iccId || "--" }}
                                </p>
                            </div>
                            <!-- <div class="device-box">
                                <span class="device-label">定制单号</span>
                                <p class="device-content">
                                    {{ deviceMessage.customOrder || "--" }}
                                </p>
                            </div> -->
                            <div class="device-box">
                                <!-- 项目名称 -->
                                <span class="device-label">{{
                                    $t("common.projectName")
                                }}</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.projectName"
                                >
                                    {{ deviceMessage.projectName || "--" }}
                                </p>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="device-box">
                                <!-- 接入协议 -->
                                <span class="device-label">{{
                                    $t("common.protocolName")
                                }}</span>
                                <p
                                    class="device-content"
                                    :title="deviceMessage.protocolName"
                                >
                                    {{ deviceMessage.protocolName || "--" }}
                                </p>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div
                    v-show="externModInfoVoListShow"
                    class="deviceExternalMessage"
                >
                    <!-- 外设信息 -->
                    <p class="device-title">
                        {{ $t("common.peripheralInformation") }}
                    </p>
                    <el-table
                        :data="deviceMessage.externModInfoVoList"
                        style="width: 100%; margin: auto"
                        border
                    >
                        <!-- 外设类型 -->
                        <el-table-column
                            prop="type"
                            :label="$t('common.peripheralType')"
                            width=""
                        ></el-table-column>
                        <!-- 外设名称 -->
                        <el-table-column
                            prop="name"
                            show-overflow-tooltip
                            :label="$t('common.peripheralName')"
                            width="150"
                        ></el-table-column>
                        <!-- 外设版本号 -->
                        <el-table-column
                            prop="versionInfo"
                            :label="$t('common.peripheralVersionInfo')"
                        ></el-table-column>
                    </el-table>
                </div>
                <p v-show="carLogs && carLogs.length" class="device-title">
                    <!-- 车辆变更记录 -->
                    {{ $t("common.vehicleChangeRecord") }}
                </p>
                <el-table
                    v-show="carLogs && carLogs.length"
                    :data="carLogs"
                    border
                    height="360"
                    style="width: 100%"
                >
                    <!-- 更换时间 -->
                    <el-table-column
                        prop="createTime"
                        :label="$t('common.vehicleChangeCreateTime')"
                    ></el-table-column>
                    <!-- 更换前车牌号 -->
                    <el-table-column
                        prop="oldPlateNum"
                        :label="$t('common.vehicleChangeOldPlateNum')"
                    ></el-table-column>
                    <!-- 更换后车牌号 -->
                    <el-table-column
                        prop="newPlateNum"
                        :label="$t('common.vehicleChangeNewPlateNum')"
                    ></el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!-- 车辆详情 -->
        <el-dialog
            :title="$t('carManage.vehicleDetails')"
            :visible="processModalPlate"
            :close-on-press-escape="false"
            @close="processModalPlate = false"
            class="no-padding no-border"
        >
            <div>
                <div
                    :class="{ borderBottom: externModInfoVoListShow }"
                    class="device-contents"
                >
                    <!-- 车辆信息 -->
                    <p class="device-title">
                        {{ $t("carManage.vehicleInformation") }}
                    </p>
                    <el-row>
                        <el-col :span="4">
                            <div class="device-box">
                                <!-- 车牌号 -->
                                <span class="device-label">
                                    {{ $t("common.plateNum") }}</span
                                >
                                <p
                                    class="device-content"
                                    :title="carMessage.plateNum || '--'"
                                >
                                    {{ carMessage.plateNum || "--" }}
                                </p>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="device-box">
                                <!-- 所属组织 -->
                                <span class="device-label">
                                    {{ $t("common.orgPath") }}</span
                                >
                                <p
                                    class="device-content"
                                    :title="carMessage.orgPath || '--'"
                                >
                                    {{ carMessage.orgPath || "--" }}
                                </p>
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="device-box">
                                <!-- 车牌颜色 -->
                                <span class="device-label">
                                    {{ $t("carManage.plateColor") }}</span
                                >
                                <p class="device-content">
                                    {{ carMessage.plateColorName || "--" }}
                                </p>
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="device-box">
                                <!-- 车辆类型 -->
                                <span class="device-label">{{
                                    $t("carManage.carType")
                                }}</span>
                                <p class="device-content">
                                    {{ carMessage.carTypeName || "--" }}
                                </p>
                            </div>
                        </el-col>
                    </el-row>
                    <p
                        v-show="deviceLogs && deviceLogs.length"
                        class="device-title"
                    >
                        <!-- 设备变更记录 -->
                        {{ $t("carManage.equipmentChangeRecord") }}
                    </p>
                    <el-table
                        v-show="deviceLogs && deviceLogs.length"
                        :data="deviceLogs"
                        height="360"
                        border
                        style="width: 100%"
                    >
                        <!-- 更换时间 -->
                        <el-table-column
                            prop="createTime"
                            :label="$t('common.vehicleChangeCreateTime')"
                        ></el-table-column>
                        <!-- 更换前设备序列号 -->
                        <el-table-column
                            prop="oldDeviceSerialNum"
                            :label="
                                $t('common.vehicleChangeoldDeviceSerialNum')
                            "
                        ></el-table-column>
                        <!-- 更换后设备序列号 -->
                        <el-table-column
                            prop="newDeviceSerialNum"
                            :label="
                                $t('common.vehicleChangenewDeviceSerialNum')
                            "
                        ></el-table-column>
                    </el-table>
                </div>
            </div>
        </el-dialog>
        <!-- 导入 -->
        <CarImport
            :isOpen="isDevImportModalOpen"
            @on-finish="importFinish"
            @on-error="importError"
            :importColumns="devImportColumns"
            :action="deviceUploadUrl"
            :title="devImportTitle"
            :isCarManage="true"
            :importResultTitle="importResultTitle"
            @on-downloadTemplate="downCarTemplate"
            :templateCode="templateCode"
            :orgId="params.organizeId"
            :carOrg="carOrg"
            @on-cancel="doCarImportCancel"
        >
        </CarImport>
        <!-- 移动车辆到组织 -->
        <el-dialog
            :title="$t('carManage.moveVehiclesToTheOrganization')"
            :visible.sync="treeDialogVisible"
            :width="'500px'"
            @close="doCancel"
        >
            <el-input
                class="searchStyle"
                v-model="organizationName1"
                :placeholder="$t('common.inputOrganizationName')"
                clearable
            >
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <div style="height: 500px; overflow-y: auto">
                <el-tree
                    class="m-x-md"
                    ref="tree2"
                    :data="treeData2"
                    default-expand-all
                    @node-click="handleDialogNodeClick"
                    default-icon="el-icon-folder"
                    highlight-current
                    :filter-node-method="filterNode1"
                    node-key="id"
                    :props="defaultProps"
                    :current-node-key="dialogNode.id"
                ></el-tree>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateCarOrgRelation">{{
                    $t("common.ok")
                }}</el-button>
                <el-button
                    @click="
                        treeDialogVisible = false;
                        organizationName1 = '';
                    "
                    >{{ $t("common.cancel") }}</el-button
                >
            </span>
        </el-dialog>
        <el-dialog
            :title="
                carDetails.type === 'edit'
                    ? $t('carManage.editVehicle')
                    : $t('carManage.addVehicle')
            "
            :visible="carVisible"
            @close="carVisibleClose"
            :custom-class="'no-padding-dialog'"
            :width="'1100px'"
        >
            <car-add
                v-if="carAddVisible"
                :carDetails="carDetails"
                @carVisibleClose="carVisibleClose"
                @handleSuccess="search"
            ></car-add>
        </el-dialog>
    </div>
</template>

<script>
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import CarImport from "@/components/importCarDialog";
import carAdd from "./carAdd";
import TimeUtil from "@/utils/time";
import { sort } from "semver";
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
Vue.directive("selectLoadMoreSerialNum", {
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
    name: "carManage",
    components: {
        CarImport,
        TreeSelect,
        carAdd,
    },
    data() {
        return {
            loading: false,
            searchLoading: true,
            externModInfoVoListShow: false,
            processModal: false,
            filterTagLength: 0,
            loadingAll: false,
            fullscreenLoading: "", //整页加载
            treeDialogVisible: false,
            selection: [],
            addOrganizeVal: "",
            editOrganizeVal: "",
            addVisible: false,
            editVisible: false,
            deleteVisible: false,
            deletePointOut: this.$t("common.deletePointOut2"), //"确定要删除该组织吗？",
            buttonClick: false,
            iconShow: false,
            processModalPlate: false,
            carMessage: {},
            carLogs: [],
            deviceLogs: [],
            defaultProps: {
                children: "children",
                label: "name",
            },
            treeData: [],
            TreeExpanded: [],
            treeData2: [],
            treeDataId: [],
            moveOldId: "", //组织移动的时候原来id
            moveOrgTreeId: "", //组织修改移动更新的父节点
            moveOrgList: {
                id: "",
                parentId: "",
                name: "",
            },
            listData: [],
            deviceMessage: {},
            // deviceModelList: [],

            agreementTypeList: [],
            carTypeList: [],
            searchForm: {
                orgId: "", //所属组织
                plateNum: "", //车牌号
                organizedName: "",
                carType: "",
                deviceCode: "", //设备终端手机号
                deviceSerialNum: "", //设备序列号
                deviceCodeList: [],
                deviceSerialNumList: [],
                selectObj: {},
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "plateNum", //排序列
                orderDir: "asc", //排序方向
                organizeId: null,
                checked: true,
            },
            total: 0,
            tableHeight: 500,
            treeHeight: 500,
            currentNode: {},
            dialogNode: {},
            //导入
            isDevImportModalOpen: false,
            deviceUploadUrl:
                (process.env.BASE_API == "/" ? "" : process.env.BASE_API) +
                "/carManage/import",
            devImportTitle: this.$t("carManage.importVehicleInformation"), //导入车辆信息
            importResultTitle: this.$t(
                "carManage.importVehicleInformationResults"
            ), //导入车辆信息结果
            templateCode: "carInfoImport",
            devImportColumns: [
                // { prop: "columnNum", label: "行号" },
                // { prop: "mainColumn", label: "车牌号" },
                // { prop: "msg", label: "导入结果" },
                { prop: "columnNum", label: this.$t("carManage.lineNumber") },
                { prop: "mainColumn", label: this.$t("common.plateNum") },
                { prop: "msg", label: this.$t("carManage.importResults") },
            ],
            devImportColumns2: [
                {
                    // title: "行号",
                    title: this.$t("carManage.lineNumber"),
                    key: "columnNum",
                    sortable: false,
                    render: (h, params) => {
                        return h("div", params.row.columnNum);
                    },
                },
                {
                    // title: "车牌号",
                    title: this.$t("common.plateNum"),
                    key: "mainColumn",
                    sortable: false,
                },
                {
                    // title: "导入结果",
                    title: this.$t("carManage.importResults"),
                    key: "msg",
                    sortable: false,
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "span",
                                {
                                    props: {
                                        type: "text-info",
                                        size: "small",
                                    },
                                    class:
                                        params.row.msg == "成功"
                                            ? "text-success"
                                            : "text-error",
                                },
                                params.row.msg
                            ),
                        ]);
                    },
                },
            ],
            organizationName: "",
            organizationName1: "",
            query: "",
            pageSizeCode: 20, // 手机号分页数量
            currentPageCode: 1, //手机号页码
            haveDataCode: true,
            totalPagesCode: "",
            pageSizeSerialNum: 20, // 序列号分页数量
            currentPageSerialNum: 1, //序列号页码
            haveDataSerialNum: true,
            totalPagesSerialNum: "",
            carVisible: false,
            carAddVisible: false,
            carDetails: {},
            carOrg: "",
        };
    },
    watch: {
        isDevImportModalOpen: {
            handler(val) {
                if (val) {
                    this.$api
                        .getOrganizeById({ orgId: this.currentNode.id })
                        .then((res) => {
                            if (res.code == "success") {
                                this.carOrg = res.data.orgPath;
                            } else {
                                this.carOrg = "";
                            }
                        });
                }
            },
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
        organizationName1(val) {
            this.filterTree(this.treeData2, val, 0);
            this.$nextTick(() => {
                this.$refs.tree2.filter("show", !this.organizationName1);
            });
        },
        addVisible: {
            handler(val) {
                this.addOrganizeVal = "";
            },
            deep: true,
        },
        currentNode: {
            handler(val) {
                this.editOrganizeVal = val.name || "";
                this.dialogNode = val;
            },
            deep: true,
        },
        "params.checked": {
            handler(val) {
                this.params.currentPage = 1;
                this.search();
            },
            deep: true,
        },

        "searchForm.deviceCode": {
            handler(val) {
                if (!val.length && this.query.length < 3) {
                    this.searchForm.deviceCodeList = [];
                }
            },
            deep: true,
        },
        "searchForm.deviceSerialNum": {
            handler(val) {
                if (!val.length && this.query.length < 3) {
                    this.searchForm.deviceSerialNumList = [];
                }
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val.length < 3 && !this.searchForm.deviceCode.length) {
                    this.searchForm.deviceCodeList = [];
                }
                if (val.length < 3 && !this.searchForm.deviceSerialNum.length) {
                    this.searchForm.deviceSerialNumList = [];
                }
            },
            deep: true,
        },
    },
    methods: {
        // 重置表单
        handleReset(ref) {
            this.$refs["form"].resetFields();
        },
        //下拉框收取
        visibleHandler() {
            (this.currentPageCode = 1), //手机号页码
                (this.totalPagesCode = ""),
                (this.currentPageSerialNum = 1);
            this.totalPagesSerialNum = "";
        },
        //  下拉加载更多
        selectLoadMore() {
            this.currentPageCode += 1;
            if (this.currentPageCode > this.totalPagesCode) return;
            this.getDeviceCodeList({ deviceCode: this.query }); // 请求接口
        },
        selectLoadMoreSerialNum() {
            this.currentPageSerialNum += 1;
            if (this.currentPageSerialNum > this.totalPagesSerialNum) return;
            this.getDeviceSerialNumList({ deviceSerialNum: this.query }); // 请求接口
        },
        //远程搜索
        remoteMethod(query) {
            this.currentPageCode = 1;
            this.query = query;
            this.haveDataCode = true;
            if (query.length >= 3) {
                this.getDeviceCodeList({ deviceCode: query });
            }
        },

        //远程搜索
        goRemoteMethod(query) {
            this.currentPageSerialNum = 1;
            this.query = query;
            this.haveDataSerialNum = true;
            if (query.length >= 3) {
                this.getDeviceSerialNumList({ deviceSerialNum: query });
            }
        },

        // 获取终端手机号列表
        getDeviceCodeList(jsonData) {
            // this.loading = true;
            let param = {
                orgId: this.params.organizeId,
                bind: false,
                pageSize: this.pageSizeCode,
                currentPage: this.currentPageCode,
            };
            let params = Object.assign({}, param, jsonData);
            this.$api.getDeviceDropDown(params).then((res) => {
                if (res.success == true) {
                    // this.searchForm.deviceCodeList = res.data
                    this.totalPagesCode = res.data.totalPages;
                    let temp =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : temp;
                    this.searchForm.deviceCodeList = (
                        this.currentPageCode === 1
                            ? []
                            : this.searchForm.deviceCodeList
                    ).concat(temp);
                    // this.loading = false;
                    if (res.data.length < 20) {
                        this.haveDataCode = false;
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 获取设备序列号列表
        getDeviceSerialNumList(jsonData) {
            // this.loading = true;
            let param = {
                orgId: this.params.organizeId,
                bind: false,
                pageSize: this.pageSizeSerialNum,
                currentPage: this.currentPageSerialNum,
            };
            let params = Object.assign({}, param, jsonData);
            this.$api.getDeviceDropDown(params).then((res) => {
                if (res.success == true) {
                    this.totalPagesSerialNum = res.data.totalPages;
                    let temp =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : temp;
                    this.searchForm.deviceSerialNumList = (
                        this.currentPageSerialNum === 1
                            ? []
                            : this.searchForm.deviceSerialNumList
                    ).concat(temp);
                    // this.searchForm.deviceSerialNumList = res.data
                    // this.loading = false;
                    if (res.data.length < 20) {
                        this.haveDataSerialNum = false;
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 获取车辆类型列表
        getCarTypeList() {
            this.$api.getCarTypeList().then((res) => {
                if (res.success == true) {
                    this.carTypeList = res.data;
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
                        this.filterTree(item.children, val, 1);
                    }
                }
            });
        },
        doCancel() {
            this.treeDialogVisible = false;
            this.organizationName1 = "";
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
        filterNode1(value, data) {
            return data[value];
        },
        filterChange(val) {
            for (let i in val) {
                this.filterTagLength = val[i].length;
            }
        },
        showDetails(id) {
            let params = { id: id };
            this.$api.getDeviceInfo(params).then((res) => {
                if (res.success == true) {
                    this.deviceMessage = res.data;
                    if (res.data.externModInfoVoList.length) {
                        this.externModInfoVoListShow = true;
                    } else {
                        this.externModInfoVoListShow = false;
                    }
                } else {
                    this.$message.error(res.msg);
                }
                this.processModal = true;
            });
            //获取车辆变更记录
            this.$api.getBindCarLog(params).then((res) => {
                if (res.success) {
                    this.carLogs = res.data;
                } else {
                    this.$message.error(`${res.msg}`);
                }
            });
        },
        showPlateNumDetails(item) {
            this.carMessage = item;
            this.processModalPlate = true;
            this.$api.getBindDeviceLog({ id: item.carId }).then((res) => {
                //获取设备变更记录
                if (res.success) {
                    this.deviceLogs = res.data;
                } else {
                    this.$message.error(`${res.msg}`);
                }
            });
        },
        //获取车辆变更记录
        filterTag(value, row) {
            return row.deviceStatus === value;
        },
        filterTagTime(value, row) {
            return row.firstOnlineTime === value;
        },
        handleSizeChange(val) {
            this.params.currentPage = 1;
            this.params.pageSize = val;
            this.search();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.search();
        },
        // 车辆添加-路由跳转
        addCar() {
            this.carDetails = {
                orgId: this.params.organizeId,
                type: "add",
                organizedName: this.searchForm.organizedName,
            };
            this.carVisible = true;
            this.carAddVisible = true;
            // this.$router.push({
            //     path: "/manageCenter/carManage/carAdd",
            //     query: {
            //         orgId: this.params.organizeId,
            //         type: "add",
            //         organizedName: this.searchForm.organizedName,
            //     },
            // });
        },
        // 车辆编辑-路由跳转
        goEdit(row) {
            this.carDetails = {
                orgId: row.orgId,
                type: "edit",
                carId: row.carId,
                organizedName: row.orgName,
            };
            this.carVisible = true;
            this.carAddVisible = true;
            // this.$router.push({
            //     path: "/manageCenter/carManage/carAdd",
            //     query: {
            //         orgId: row.orgId,
            //         type: "edit",
            //         carId: row.carId,
            //         organizedName: row.orgName,
            //     },
            // });
        },
        carVisibleClose() {
            this.carVisible = false;
            setTimeout(() => {
                this.carAddVisible = false;
            }, 300);
        },
        // 组织树更改-添加
        addOrganize() {
            if (!this.addOrganizeVal) {
                this.$message.warning(
                    this.$t("common.organizationCannotEmpty")
                );
                return;
            }
            if (this.addOrganizeVal.length > 32) {
                this.$message.warning(this.$t("common.organizationLength32"));
                return;
            }
            const params = {
                parentId: this.params.organizeId,
                name: this.addOrganizeVal,
            };
            this.$api.addOrg(params).then((res) => {
                if (res.success == true) {
                    this.$message.success(
                        this.$t("common.organization") +
                            this.$t("common.addSuccess")
                    );
                    this.addVisible = false;
                    this.getOrgTree(true);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //组织树编辑-按钮
        editVisibleClick() {
            this.editOrganizedId();
            this.moveOrgList.parentId = this.currentNode.parentId;
            this.moveOrgList.name = this.editOrganizeVal;
            this.editVisible = !this.editVisible;
            this.moveOrgTreeId = this.currentNode.parentId;
            if (!this.editVisible) {
                this.moveOrgList.parentId = "";
            }
        },
        cancelEdit() {
            this.editVisible = false;
            this.fullscreenLoading.close();
        },
        // 组织树更改-编辑
        editOrganizedId() {
            this.moveOldId = this.currentNode.id;
            this.setAllChoose(this.treeDataId);
            this.orgTreeSetting(this.treeDataId);
        },
        //重置组织树为全部可选
        setAllChoose(data) {
            data.forEach((item) => {
                this.$set(item, "selectable", true);
                if (item["children"].length) {
                    this.setAllChoose(item["children"]);
                }
            });
        },
        //递归现在的组织树
        orgTreeSetting(data) {
            data.forEach((item) => {
                if (item.id == this.moveOldId) {
                    item.selectable = false;
                    this.orgChildrenSetting(item);
                } else {
                    if (item.children.length > 0) {
                        this.orgTreeSetting(item.children);
                    }
                }
            });
        },
        //递归现在组织树的子节点
        orgChildrenSetting(val) {
            if (val.children.length > 0) {
                val.children.forEach((item) => {
                    item.selectable = false;
                    if (item.children.length > 0) {
                        this.orgChildrenSetting(item);
                    }
                });
            }
        },
        //修改编辑组织树确定按钮
        editOrganize() {
            if (!this.editOrganizeVal) {
                this.$message.warning(
                    this.$t("common.organizationCannotEmpty")
                );
                return;
            }
            if (this.editOrganizeVal.length > 32) {
                this.$message.warning(this.$t("common.organizationLength32"));
                return;
            }
            if (!this.moveOrgList.parentId) {
                this.$message.warning(this.$t("common.organizationEditError"));
                return;
            }
            this.moveOrgList.id = this.params.organizeId;
            this.moveOrgList.name = this.editOrganizeVal;
            // if(this.moveOrgList.id == this.dialogNode.id) {
            // }
            this.$confirm(
                this.$t("common.editOrganizeMsg1") +
                    this.currentNode.name +
                    this.$t("common.editOrganizeMsg2"),
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.editVisible = false;
                    const params = this.moveOrgList;
                    this.fullscreenLoading = this.$loading({
                        lock: true,
                        text: this.$t("common.organizeModifying"),
                        spinner: "el-icon-loading",
                        background: "rgba(0,0,0,0.7)",
                    });

                    this.$api.updateOrg(params).then(
                        (res) => {
                            if (res.success == true) {
                                this.fullscreenLoading.close();
                                this.$message.success(
                                    this.$t("common.organizationalEditSuccess")
                                );
                                this.editVisible = false;
                                this.getOrgTree(true);
                                this.moveOrgTreeId = "";
                            } else {
                                this.fullscreenLoading.close();
                                this.editVisible = false;
                                this.$message.error(res.msg);
                            }
                        },
                        (err) => {
                            this.fullscreenLoading.close();
                            this.editVisible = false;
                        }
                    );
                })
                .catch(() => {
                    this.editVisible = !this.editVisible;
                });
        },
        // // 组织树更改-编辑
        // editOrganize() {
        //   if (!this.editOrganizeVal) {
        //     this.$message.warning("所属组织不能为空！");
        //     return;
        //   }
        //   if (this.editOrganizeVal.length > 32) {
        //     this.$message.warning("所属组织最多为三十二个字符！");
        //     return;
        //   }
        //   const params = {
        //     id: this.params.organizeId,
        //     name: this.editOrganizeVal,
        //     parentId: this.currentNode.parentId
        //   };
        //   this.$api.updateOrg(params).then((res) => {
        //     if (res.success == true) {
        //       this.$message.success("组织修改成功");
        //       this.editVisible = false;
        //       this.getOrgTree(true);
        //     } else {
        //       this.$message.error("组织修改失败:" + res.msg);
        //     }
        //   });
        // },
        // 组织树更改-删除
        showPopover() {
            const params = {
                id: this.params.organizeId,
            };
            this.$api.whetherOrgDistributeOtherUser(params).then((res) => {
                if (res.data) {
                    //组织绑定了用户，是否确认删除？
                    this.deletePointOut = this.$t("common.deletePointOut3");
                } else {
                    //确定要删除该组织吗？
                    this.deletePointOut = this.$t("common.deletePointOut2");
                }
            });
        },
        deleteOrganize() {
            const params = {
                id: this.params.organizeId,
            };
            this.$api.delOrg(params).then((res) => {
                if (res.success == true) {
                    this.$store.dispatch(
                        "RemoveDeviceManageId",
                        this.params.organizeId
                    );
                    this.$message.success(
                        this.$t("common.organizationalDeleteSuccess")
                    );
                    this.deleteVisible = false;
                    this.getOrgTree(true);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 组织树更改-移动
        updateCarOrgRelation() {
            if (this.dialogNode.defaultNode == 0) {
                this.$message.warning(this.$t("common.vehiclesNotAllowed"));
                return;
            }
            let ids = [];
            this.selection.forEach(function (item) {
                ids.push(item.carId);
            });
            const param = {
                orgId: this.dialogNode.id,
                carIds: ids,
            };
            this.$api.changeCarOrg(param).then((res) => {
                if (res.success == true) {
                    this.$message.success(
                        this.$t("common.vehicleOrganizationModifiedSuccess")
                    );
                    this.treeDialogVisible = false;
                    this.organizationName1 = "";
                    this.initTree();
                    this.search();
                    this.$refs.table.clearSelection();
                    this.selection = [];
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //-----导入车辆模板-----
        goImport() {
            this.isDevImportModalOpen = true;
        },
        importFinish() {
            this.isDevImportModalOpen = false;
            this.search();
            this.getOrgTree(false);
        },
        importError() {
            this.isDevImportModalOpen = false;
        },
        downCarTemplate() {
            let params = {
                orgId: this.params.organizeId,
            };
            this.$api.generateCarTemplate(params).then((res) => {
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
        doCarImportCancel() {
            this.isDevImportModalOpen = false;
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
        // 点击选择组织树
        handleNodeClick(data) {
            // for (let key in this.searchForm) {
            //     this.searchForm[key] = ''
            // }
            //this.$store.dispatch('RemoveCondition')
            this.params.currentPage = 1;
            this.currentNode = data;
            this.params.organizeId = data.id;
            this.searchForm.organizedName = data.name;
            this.search();
            // this.getDeviceModelList();
            //this.getDeviceCodeList();
            this.$store.dispatch("SetDeviceManageId", data.id);
        },
        // 弹窗内点击选择组织树
        handleDialogNodeClick(data) {
            this.dialogNode = data;
        },
        handleClick() {
            this.buttonClick = !this.buttonClick;
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        // 多选事件
        onSelectionChange(selection) {
            this.selection = selection;
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
            this.$refs.searchForm.validate((valid) => {
                if (valid) {
                    // if (this.params.currentPage == 1) {
                    this.searchForm.orgId = this.params.organizeId;
                    let params = Object.assign(
                        {},
                        this.params,
                        this.searchForm
                    );
                    params["containChildOrg"] = this.params.checked ? 1 : 0;
                    delete params.selectObj;
                    this.getData(params);
                    this.$store.dispatch("SetCondtion", this.searchForm);
                    // } else {
                    //   this.params.currentPage = 1;
                    // }
                }
            });
        },
        getData(params) {
            if (!this.params.organizeId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            this.searchLoading = true;
            const param = {
                orgId: this.params.organizeId,
                currentPage: this.params.currentPage,
                pageSize: this.params.pageSize,
                pageSize: this.params.pageSize,
                plateNum: params.plateNum,
                deviceCode: params.deviceCode,
                deviceSerialNum: params.deviceSerialNum,
                carType: params.carType,
                containChildOrg: params.containChildOrg,
            };
            this.$api
                .getCarManagerPage(param)
                .then((res) => {
                    if (res.success == true) {
                        this.listData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.listData;
                        this.total = res.data.totalRecords; //数量
                        this.$nextTick(() => {
                            this.$refs.table.doLayout();
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
        // 表格高度设置
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchPagination.clientHeight -
                111;
            this.treeHeight = document.body.clientHeight - 197;
        },
        setWrap() {
            if (this.$refs.wrap.scrollHeight > 80) {
                this.iconShow = true;
            } else {
                this.iconShow = false;
            }
        },
        // 获取组织树
        getOrgTree(type) {
            this.$api.deviceGetOrgTree().then((res) => {
                this.setTableHeight();
                this.TreeExpanded = [];
                this.treeData = [];
                if (res.success == true) {
                    this.treeData = JSON.parse(JSON.stringify(res.data));
                    this.treeData2 = JSON.parse(JSON.stringify(res.data));
                    this.treeDataId = JSON.parse(JSON.stringify(res.data));

                    if (res.data.length > 0) {
                        this.params.organizeId = Number(
                            this.$store.state.tree.deviceManageId
                                ? this.$store.state.tree.deviceManageId
                                : res.data[0].id
                        );
                        this.searchForm.organizedName = res.data[0].name;
                        this.searchForm = this.$store.state.tree.searchForm
                            ? this.$store.state.tree.searchForm
                            : this.searchForm;
                        this.params = Object.assign(
                            this.params,
                            this.searchForm
                        );
                        this.getData(this.params);
                        // this.getDeviceModelList();
                        //this.getDeviceCodeList();
                        this.$nextTick(() => {
                            this.treeData.forEach((m) => {
                                this.TreeExpanded.push(m.id);
                            });
                            this.currentNode = this.$refs.tree.getNode(
                                this.$store.state.tree.deviceManageId
                                    ? this.$store.state.tree.deviceManageId
                                    : res.data[0].id
                            ).data;
                            this.$refs["tree"].setCurrentKey(
                                this.params.organizeId
                            );
                        });
                    } else {
                        this.searchLoading = false;
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        initTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = JSON.parse(JSON.stringify(res.data));
                    this.treeData2 = JSON.parse(JSON.stringify(res.data));
                    this.treeDataId = JSON.parse(JSON.stringify(res.data));
                    setTimeout(() => {
                        this.currentNode = this.$refs.tree.getNode(
                            this.$store.state.tree.deviceManageId
                                ? this.$store.state.tree.deviceManageId
                                : res.data[0].id
                        ).data;
                    }, 1);
                } else {
                    this.$message.error(res.msg);
                }
            });
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
                const param = {
                    orgId: this.params.organizeId,
                    plateNum: this.searchForm.plateNum,
                    deviceCode: this.searchForm.deviceCode,
                    deviceSerialNum: this.searchForm.deviceSerialNum,
                    containChildOrg: this.params.checked ? 1 : 0,
                };
                let params = Object.assign(param, this.searchForm);
                this.$api.doExportCar(params).then((res) => {
                    if (res.success == true) {
                        if (this.total > 0) {
                            this.$message({
                                showClose: true,
                                message: this.$t("carManage.exportLoading"),
                            });
                        }
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
                        this.$message.error(res.msg);
                        this.loadingAll = false;
                    }
                });
            }
        },
        // 多个删除
        doBatchCar() {
            let messageText = "";
            let list = [];
            let numList = [];
            this.selection.forEach(function (item) {
                list.push(item.deviceList);
            });
            list.forEach((m) => {
                numList.push(m.length);
            });
            const __all_element_zero = (e) => e === 0;
            if (numList.every(__all_element_zero)) {
                messageText = this.$t("carManage.doBatchCarMsg1");
            } else {
                messageText = this.$t("carManage.doBatchCarMsg2");
            }
            this.$confirm(messageText, this.$t("common.prompt"), {
                confirmButtonText: this.$t("common.ok"),
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
            })
                .then(() => {
                    // 批量删除
                    let ids = [];
                    this.selection.forEach(function (item) {
                        ids.push(item.carId);
                    });
                    let param = {
                        carIds: ids,
                    };
                    this.$api.deleteCarInfos(param).then((res) => {
                        if (res.success == true) {
                            this.$message.success(
                                this.$t("carManage.doBatchCarMsg3")
                            );
                            this.$refs.table.clearSelection();
                            this.selection = [];
                        } else {
                            this.$message.error(res.msg);
                        }
                        this.selection = [];
                        this.search();
                    });
                })
                .catch(() => {});
        },
        // 单个删除
        doDelete(id, list) {
            let messageText = "";
            if (list.length !== 0) {
                messageText = this.$t("carManage.doBatchCarMsg2");
            } else {
                messageText = this.$t("carManage.doBatchCarMsg1");
            }
            this.$confirm(messageText, this.$t("common.prompt"), {
                confirmButtonText: this.$t("common.ok"),
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
            })
                .then(() => {
                    // 批量删除
                    let ids = [];
                    ids.push(id);
                    let param = {
                        carIds: ids,
                    };
                    this.$api.deleteCarInfos(param).then((res) => {
                        if (res.success == true) {
                            this.$message.success(
                                this.$t("carManage.doBatchCarMsg3")
                            );
                            this.$refs.table.clearSelection();
                            this.selection = [];
                            this.initTree();
                        } else {
                            this.$message.error(res.msg);
                        }
                        this.search();
                    });
                })
                .catch(() => {});
        },
        getArrStr(deviceList, key) {
            let arr = deviceList.reduce((prev, cur) => {
                if (cur[key]) {
                    return prev.concat(cur[key]);
                } else {
                    return;
                }
            }, []);
            return arr && arr.length ? arr.join() : "--";
        },
    },
    activated() {},
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
        this.getOrgTree(false);
        this.getCarTypeList();
    },
};
</script>

<style lang="less" scoped>
.text-width {
    word-wrap: break-word;
    word-break: break-all;
}

.searchIcon {
    cursor: pointer;
}

.btn-style {
    float: right;
    margin-top: 15px;
}

.item {
    margin-bottom: 3px;
    margin-left: 8px;
}

.el-icon-warning {
    font-size: 14px;
    cursor: pointer;
}

.marginBottom {
    margin-bottom: 0.5rem;
}
.devRow {
    display: flex;
    background: rgba(255, 255, 255, 0);
    text-align: center;
    align-items: center;
}
.borderBottom {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.device-contents {
    .device-title {
        padding: 6px 0 12px;
        font-size: 14;
        font-weight: 800;
    }

    .device-box {
        margin-bottom: 20px;

        .device-content {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-weight: 600;
            height: 21px;
        }
    }
}

.searchStyle {
    width: 434px;
    margin-left: 21px;
    margin-bottom: 8px;
}

.new-device-manage {
    .treeHeightDev {
        min-height: calc(~"100vh - 9rem");
        overflow-x: scroll;
    }

    .loading_ {
        pointer-events: none;
    }

    .dialog-center {
        width: 20rem;
        margin: auto;
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
        }

        .wrap-bottom {
            border-top: 1px solid #e4e4e4;
        }

        .hidden {
            height: 46px;
            overflow: hidden;
        }
    }
}
.colorBlue {
    color: #0099ff !important;
}
</style>
