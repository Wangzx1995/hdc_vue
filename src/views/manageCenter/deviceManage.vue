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
                                v-btn="'deviceManageAddGroup'"
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
                                <el-form-item
                                    :label="$t('common.superiorOrganization')"
                                    prop="parentId"
                                >
                                    <TreeSelect
                                        :placeholder="$t('common.select')"
                                        ref="treeId"
                                        node-key="id"
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
                                v-btn="'deviceManageEditGroup'"
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
                                v-btn="'deviceManageDeleteGroup'"
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
                                v-btn="'deviceManageDeleteGroup'"
                            />
                        </el-popover>
                    </div>
                    <div :style="editVisible ? 'pointer-events: none;' : ''">
                        <el-tree
                            class="m-t"
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
                                <el-form-item
                                    :label="$t('common.keywords')"
                                    prop="deviceCode"
                                >
                                    <G-DeviceSearch
                                        :valueKey="'deviceCode'"
                                        :value.sync="searchForm.deviceCode"
                                        :selectObj.sync="searchForm.selectObj"
                                        :organizeId="params.organizeId"
                                        :otherParams="{
                                            notInstaller: 1,
                                        }"
                                    ></G-DeviceSearch>
                                </el-form-item>
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
                                            :label="$t(item.text)"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
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
                                <el-form-item
                                    prop="hasOnline"
                                    :label="$t('common.hasOnline')"
                                >
                                    <el-select
                                        v-model="searchForm.hasOnline"
                                        :placeholder="$t('common.select')"
                                        clearable
                                    >
                                        <el-option
                                            v-for="(
                                                item, index
                                            ) in firstOnlineTimeArr"
                                            :key="index"
                                            :value="item.value"
                                            :label="$t(item.text)"
                                        ></el-option>
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
                                @click="addDevice"
                                :disabled="
                                    currentNode.defaultNode == 0 ||
                                    currentNode.source != 1
                                "
                                v-btn="'deviceManageAdd'"
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
                                @click="doBatchDelete"
                                :disabled="
                                    selection.length <= 0 ||
                                    currentNode.source != 1
                                "
                                v-btn="'deviceManageDelete'"
                                >{{ $t("common.delete") }}
                            </el-button>
                            <el-button
                                type="default"
                                @click="openTreeDialogVisible"
                                :disabled="
                                    selection.length <= 0 ||
                                    currentNode.source != 1
                                "
                                v-btn="'deviceManageMove'"
                                >{{ $t("common.move") }}
                            </el-button>
                            <el-button
                                type="default"
                                @click="goImport"
                                :disabled="currentNode.source != 1"
                                v-btn="'deviceManageImport'"
                                >{{ $t("common.import") }}
                                <el-tooltip>
                                    <div slot="content">
                                        <div>
                                            {{ $t("carManage.addMsg1") }}：<a
                                                href="https://vms.hikvisionauto.com:8040/"
                                                target="_blank"
                                                >https://vms.hikvisionauto.com:8040/</a
                                            >
                                        </div>
                                    </div>
                                    <i
                                        v-show="currentNode.source != 1"
                                        class="el-icon-question el-icon--right"
                                    ></i> </el-tooltip
                            ></el-button>
                            <el-button
                                type="default"
                                @click="goExport"
                                :disabled="loadingAll"
                                :loading="loadingAll"
                                v-btn="'deviceManageExport'"
                            >
                                <!-- 导出 -->
                                {{ $t("common.export") }}
                            </el-button>
                            <el-dropdown
                                trigger="click"
                                style="margin-left: 10px"
                                @command="handleCommand"
                                :disabled="currentNode.source != 1"
                            >
                                <el-button v-btn="'deviceManageBatchSettings'">
                                    <!-- 批量配置 -->
                                    {{ $t("deviceManage.batchConfiguration")
                                    }}<i
                                        class="el-icon-arrow-down el-icon--right"
                                    ></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="a">
                                        <!-- 配置选中设备 -->
                                        {{
                                            $t(
                                                "deviceManage.configureSelectedDevices"
                                            )
                                        }}
                                        <span v-if="selection.length"
                                            >({{ selection.length }})</span
                                        ></el-dropdown-item
                                    >
                                    <el-dropdown-item
                                        command="b"
                                        v-if="currentNode.parentId !== 0"
                                    >
                                        <!-- 配置整组设备 -->
                                        {{
                                            $t(
                                                "deviceManage.configureTheEntireSetOfDevices"
                                            )
                                        }}
                                    </el-dropdown-item>
                                    <el-dropdown-item command="c">
                                        <!-- 批量导入配置 -->
                                        {{
                                            $t(
                                                "deviceManage.batchImportconfiguration"
                                            )
                                        }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-badge
                                :value="syncNum"
                                class="item"
                                v-if="isShowBtn"
                            >
                                <el-button
                                    type="default"
                                    @click="showSync"
                                    :disabled="loadingAll"
                                    :loading="loadingAll"
                                >
                                    <!-- 显示同步 -->
                                    {{
                                        $t(
                                            "deviceManage.displaySynchronization"
                                        )
                                    }}
                                </el-button>
                            </el-badge>
                        </div>
                        <div>
                            <el-checkbox v-model="params.checked">
                                <!-- 包含下级组织设备 -->
                                {{
                                    $t(
                                        "deviceManage.includeEquipmentFromSubordinateOrganizations"
                                    )
                                }}
                            </el-checkbox>
                        </div>
                    </div>
                    <!-- 列表区域 -->
                    <!-- :span-method="objectSpanMethod" -->
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
                            row-key="id"
                            border
                            stripe
                            @selection-change="onSelectionChange"
                            @filter-change="filterChange"
                        >
                            <el-table-column
                                :reserve-selection="true"
                                type="selection"
                            ></el-table-column>
                            <el-table-column
                                prop="plateNum"
                                :label="$t('common.plateNum')"
                                width="140px"
                            >
                                <template slot-scope="scope">
                                    <div>
                                        {{ scope.row.plateNum }}
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
                                </template>
                            </el-table-column>
                            <!-- 所属组织 -->
                            <el-table-column
                                prop="organizeName"
                                :label="$t('common.orgPath')"
                                min-width="300px"
                                show-overflow-tooltip
                            ></el-table-column>
                            <!-- 终端手机号 -->
                            <el-table-column
                                prop="deviceCode"
                                :label="$t('common.deviceCode')"
                                min-width="120px"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        @click="showDetails(scope.row.id)"
                                        type="text"
                                        style="font-size: 12px"
                                    >
                                        {{ scope.row.deviceCode }}
                                    </el-button>
                                </template>
                            </el-table-column>
                            <!-- 设备序列号 -->
                            <el-table-column
                                prop="deviceSerialNum"
                                :label="$t('common.deviceSerialNum')"
                                min-width="125px"
                            >
                                <template slot-scope="scope">
                                    <span>
                                        {{ scope.row.deviceSerialNum }}
                                    </span>
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
                                            }}：{{ scope.row.deviceSerialNum }}
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
                                                    scope.row.deviceSerialNum
                                                )
                                            "
                                            class="m-r-sm"
                                            >{{ $t("carManage.goModify") }}</a
                                        >
                                        <i
                                            class="text-error el-icon-warning"
                                            slot="reference"
                                        ></i>
                                    </el-popover>
                                </template>
                            </el-table-column>
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
                                prop="softwareVersion"
                                :label="$t('common.softwareVersion')"
                                min-width="165"
                            ></el-table-column>
                            <!-- 入网时间 -->
                            <el-table-column
                                prop="firstOnlineTime"
                                :label="$t('carManage.onlineTime')"
                                min-width="165"
                            ></el-table-column>
                            <!-- 通道数 -->
                            <el-table-column
                                prop="videoChannelNum"
                                :label="$t('common.videoChannelNum')"
                                min-width="80px"
                                align="right"
                            ></el-table-column>
                            <!-- 设备厂商 -->
                            <el-table-column
                                prop="manufacturerNameString"
                                :label="$t('common.manufacturerNameString')"
                                min-width="120"
                            >
                                <template slot-scope="scope">
                                    <span>{{
                                        getLabelSelf(scope.row.manufacturerName)
                                    }}</span>
                                </template>
                            </el-table-column>
                            <!-- 设备状态 -->
                            <el-table-column
                                prop="deviceStatus"
                                :label="$t('common.deviceStatus')"
                                min-width="120px"
                                :render-header="renderHeader"
                                fixed="right"
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
                            <el-table-column
                                prop="iccId"
                                label="ICCID"
                                min-width="170px"
                            ></el-table-column>
                            <!-- SIM卡状态 -->
                            <el-table-column
                                prop="iccIdState"
                                :label="$t('common.iccIdState')"
                                min-width="120px"
                            ></el-table-column>
                            <!-- <el-table-column
                                prop="iccIdExpireTime"
                                label="SIM卡套餐到期时间"
                                min-width="140px"
                            ></el-table-column> -->
                            <!-- <el-table-column prop="protocolName" label="协议类型" min-width="160px"></el-table-column> -->
                            <!-- 操作 -->
                            <el-table-column
                                fixed="right"
                                :label="$t('common.operate')"
                                width="120px"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        type="text"
                                        class="text-info"
                                        @click="goEdit(scope.row)"
                                        :disabled="currentNode.source != 1"
                                        v-btn="'deviceManageEdit'"
                                        >{{ $t("common.edit") }}
                                    </el-button>
                                    <el-button
                                        type="text"
                                        class="text-info"
                                        @click="doDelete(scope.row.id)"
                                        :disabled="currentNode.source != 1"
                                        v-btn="'deviceManageDelete'"
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
        <!-- 同步结果 -->
        <el-dialog
            :title="$t('deviceManage.synchronizationResults')"
            :visible.sync="syncModel"
            :before-close="cancelSync"
            :width="'1080px'"
        >
            <div class="m-x-md m-b">
                <div class="wrap-top">
                    <div class="m-t" :class="{ hidden: !buttonClick }">
                        <el-form
                            :model="syncForm"
                            label-position="top"
                            inline
                            ref="syncForm"
                            label-width="100px"
                        >
                            <!-- 同步时间 -->
                            <el-form-item
                                :label="$t('deviceManage.synchronizationTime')"
                                type="flex"
                            >
                                <el-date-picker
                                    size="small"
                                    v-model="timeRange"
                                    type="daterange"
                                    :placeholder="$t('common.select')"
                                    transfer
                                    clearable
                                    format="yyyy-MM-dd"
                                ></el-date-picker>
                            </el-form-item>
                            <!-- 同步结果 -->
                            <el-form-item
                                prop="resultType"
                                :label="
                                    $t('deviceManage.synchronizationResults')
                                "
                            >
                                <el-select
                                    v-model="syncParams.resultType"
                                    :placeholder="$t('common.select')"
                                    clearable
                                >
                                    <!-- 成功 -->
                                    <el-option
                                        :value="1"
                                        :label="$t('deviceManage.resultType_1')"
                                    ></el-option>
                                    <!-- 设备添加异常 -->
                                    <el-option
                                        :value="2"
                                        :label="$t('deviceManage.resultType_2')"
                                    ></el-option>
                                    <!-- 接口异常 -->
                                    <el-option
                                        :value="3"
                                        :label="$t('deviceManage.resultType_3')"
                                    ></el-option>
                                    <!-- 设备型号存在 -->
                                    <el-option
                                        :value="4"
                                        :label="$t('deviceManage.resultType_4')"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <div
                                style="float: right; margin-top: 28px"
                                class="btn-style"
                            >
                                <el-button
                                    type="primary"
                                    :disabled="searchLoading"
                                    :loading="searchLoading"
                                    @click="
                                        params.currentPage = 1;
                                        getSyncInfo();
                                    "
                                >
                                    <!-- 查询 -->
                                    {{ $t("common.search") }}
                                </el-button>
                                <!-- 立即同步 -->
                                <!-- <el-button
                                    type="primary"
                                    :disabled="searchLoading"
                                    :loading="searchLoading"
                                    @click="eagerlyGetDevice()"
                                >
                                    {{ $t("deviceManage.synchronizeNow") }}
                                </el-button> -->
                            </div>
                        </el-form>
                    </div>
                </div>
                <el-table
                    v-loading="searchLoading"
                    :element-loading-text="$t('common.desperatelyLoading')"
                    element-loading-color="#007213"
                    :data="syncResultList"
                    border
                    stripe
                    @selection-change="onSelectionChange"
                    @filter-change="filterChange"
                    height="480"
                >
                    <!-- 同步时间 -->
                    <el-table-column
                        prop="synchronizationTime"
                        :label="$t('deviceManage.synchronizationTime')"
                        min-width="80px"
                    ></el-table-column>
                    <!-- 同步结果 -->
                    <el-table-column
                        prop="resultType"
                        :label="$t('deviceManage.synchronizationResults')"
                        min-width="80px"
                    >
                        <template slot-scope="scope">
                            <span
                                v-if="scope.row.resultType == 1"
                                style="color: green"
                            >
                                <!-- 成功 -->
                                {{ $t("deviceManage.resultType_1") }}
                            </span>
                            <span
                                v-if="scope.row.resultType == 2"
                                style="color: orange"
                            >
                                <!-- 设备添加异常 -->
                                {{ $t("deviceManage.resultType_2") }}
                            </span>
                            <span
                                v-if="scope.row.resultType == 3"
                                style="color: red"
                            >
                                <!-- 接口异常 -->
                                {{ $t("deviceManage.resultType_3") }}
                            </span>
                            <span
                                v-if="scope.row.resultType == 4"
                                style="color: red"
                            >
                                <!-- 设备型号不存在 -->
                                {{ $t("deviceManage.resultType_4") }}
                            </span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                        prop="factoryNo"
                        label="工厂号"
                        min-width="60px"
                    ></el-table-column> -->
                    <!-- 异常信息 -->
                    <el-table-column
                        :show-overflow-tooltip="true"
                        prop="resultInfo"
                        :label="$t('deviceManage.abnormalInformation')"
                        min-width="260px"
                    ></el-table-column>
                    <!-- 同步设备数 -->
                    <el-table-column
                        prop="deviceSum"
                        :label="$t('deviceManage.numberOfSynchronizedDevices')"
                        min-width="80px"
                    ></el-table-column>
                    <!-- 操作 -->
                    <el-table-column
                        :label="$t('common.operate')"
                        width="120px"
                    >
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                class="text-info"
                                @click="reSync(scope.row.id)"
                                v-if="
                                    scope.row.resultType == 3 ||
                                    scope.row.resultType == 4
                                "
                            >
                                <!-- 重新同步 -->
                                {{ $t("deviceManage.resynchronize") }}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- <div style="position:absolute; bottom:0; left:0;width: 100%;"> -->
            <div class="p-l-md p-r-md wrap-bottom">
                <el-pagination
                    :current-page="syncParams.currentPage"
                    @size-change="handleSyncSizeChange"
                    @current-change="handleSyncCurrentChange"
                    :page-sizes="[20, 50, 100]"
                    :page-size="syncParams.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="synctotal"
                >
                </el-pagination>
            </div>
            <!-- </div> -->

            <!-- <span slot="footer" class="dialog-footer">
              <el-button @click="cancelSync">关闭</el-button>
            </span> -->
        </el-dialog>
        <!-- 导入 -->
        <DeviceImport
            :isOpen="isDevImportModalOpen"
            @on-finish="importFinish"
            @on-error="importError"
            :importColumns="devImportColumns"
            :action="deviceUploadUrl"
            :title="devImportTitle"
            :importResultTitle="importResultTitle"
            @on-downloadTemplate="downDeviceTemplate"
            :moduleCode="moduleCode"
            :templateCode="templateCode"
            :groupId="params.organizeId"
            @on-cancel="doDeviceImportCancel"
        >
        </DeviceImport>
        <!-- 组织移动弹窗 -->
        <!-- 移动设备到组织 -->
        <el-dialog
            :title="$t('deviceManage.mobileDevicesToOrganizations')"
            :visible.sync="treeDialogVisible"
            :width="'500px'"
            @close="doCancel"
        >
            <el-input
                class="searchStyle"
                v-model="organizationName1"
                :placeholder="$t('common.input')"
                clearable
            >
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <div style="height: 500px; overflow-y: auto">
                <el-tree
                    class="m-x-md"
                    ref="tree2"
                    :data="treeData2"
                    :default-expanded-keys="TreeExpanded"
                    @node-click="handleDialogNodeClick2"
                    default-icon="el-icon-folder"
                    highlight-current
                    :filter-node-method="filterNode1"
                    node-key="id"
                    :props="defaultProps"
                    :current-node-key="dialogNode2.id"
                ></el-tree>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateCarOrgRelation">
                    <!-- 确 定 -->
                    {{ $t("common.ok") }}
                </el-button>
                <el-button
                    @click="
                        treeDialogVisible = false;
                        organizationName1 = '';
                    "
                >
                    <!-- 取 消 -->
                    {{ $t("common.cancel") }}
                </el-button>
            </span>
        </el-dialog>
        <el-dialog
            :title="
                deviceDetails.type === 'edit'
                    ? $t('common.edit') + $t('deviceManage.terminal')
                    : $t('common.add') + $t('deviceManage.terminal')
            "
            :visible="deviceVisible"
            @close="deviceVisibleClose"
            :custom-class="'no-padding-dialog'"
            :width="'1200px'"
        >
            <device-add
                v-if="deviceAddVisible"
                :deviceDetails="deviceDetails"
                @deviceVisibleClose="deviceVisibleClose"
                @handleSuccess="handleSuccess"
            ></device-add>
        </el-dialog>
        <el-dialog
            :title="settingTitle"
            :visible="settingVisible"
            @close="settingVisibleClose"
            :custom-class="'no-padding-dialog'"
            :width="'600px'"
        >
            <device-setting
                v-if="settingDialogVisible"
                :settingParam="settingParam"
                @settingVisibleClose="settingVisibleClose"
                @handleSuccess="handleSuccess"
            ></device-setting>
        </el-dialog>
    </div>
</template>

<script>
import DeviceImport from "@/components/importDialog";
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import TimeUtil from "@/utils/time";
import deviceAdd from "./deviceAdd";
import deviceSetting from "./deviceSetting";

import { toThousandslsFilter } from "../../filters/filters";
import "@/components/hui-pro/tree-select/theme/index.scss";
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
    // name: 'deviceManage',
    components: { DeviceImport, TreeSelect, deviceAdd, deviceSetting },
    data() {
        return {
            loading: false,
            fullscreenLoading: "", //全局加载
            isShowBtn: false,
            syncModel: false,
            syncResult: false,
            syncNum: 0,
            synctotal: 0,
            syncForm: {
                startDate: "",
                endDate: "",
            },
            syncParams: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                beginDate: "",
                endDate: "",
                resultType: "",
                factoryNo: "",
            },
            query: "",
            carLogs: [],
            timeRange: [],
            syncResultList: [],
            readIds: [],
            searchLoading: true,
            externModInfoVoListShow: false,
            processModal: false,
            filterTagLength: 0,
            loadingAll: false,
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
            firstOnlineTimeArr: [
                { text: "deviceManage.onlineAlready", value: "1" },
                { text: "deviceManage.notOnlineYet", value: "0" },
            ],
            deviceStatusList: [
                { text: "common.deviceStatus_1", value: 1 },
                { text: "common.deviceStatus_2", value: 2 },
                { text: "common.deviceStatus_0", value: 0 },
            ],
            defaultProps: {
                children: "children",
                label: "name",
                selectable: "selectable",
            },
            treeData: [],
            TreeExpanded: [],
            TreeExpandedId: [],
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
            tableData: [],
            deviceMessage: {},
            deviceModelList: [],
            agreementTypeList: [],
            searchForm: {
                vin: "",
                carId: "",
                deviceModelCode: "",
                softwareVersion: "",
                deviceCode: "",
                deviceType: "",
                protocol: "",
                hasOnline: "",
                deviceStatus: "",
                deviceSerialNum: "",
                plateArr: [],
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
                "/hikDevice/uploadImportDevFile",
            // 导入终端设备
            devImportTitle: this.$t("deviceManage.importTerminalDevices"),
            // 导入终端设备结果
            importResultTitle: this.$t(
                "deviceManage.importTerminalDevicesResults"
            ),
            moduleCode: "deviceInfo",
            templateCode: "deviceInfo",
            devImportColumns: [
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
                    // title: "设备序列号",
                    title: this.$t("common.deviceSerialNum"),
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
            pageSizeCar: 20, //车牌分页数量
            currentPageCar: 1, //车牌页码
            haveDataCar: true,
            totalPagesCar: "",
            deviceVisible: false,
            deviceAddVisible: false,
            deviceDetails: {},
            deviceDicList: [],
            settingVisible: false,
            settingDialogVisible: false,
            settingTitle: "",
            settingParam: {},
            dialogNode2: {},
        };
    },
    watch: {
        timeRange: {
            handler(val) {
                if (val && val.length > 0) {
                    this.syncParams.beginDate = TimeUtil.getDate(
                        this.timeRange[0]
                    );
                    this.syncParams.endDate = TimeUtil.getDate(
                        this.timeRange[1]
                    );
                } else {
                    this.syncParams.beginDate = "";
                    this.syncParams.endDate = "";
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
        "searchForm.carId": {
            handler(val) {
                if (!val && this.query.length < 3) {
                    this.searchForm.plateArr = [];
                }
            },
            deep: true,
        },
        query: {
            handler(val) {
                this.currentPageCar = 1;
                if (val.length < 3 && !this.searchForm.carId) {
                    this.searchForm.plateArr = [];
                }
            },
            deep: true,
        },
    },
    methods: {
        //  下拉加载更多
        selectLoadMore() {
            this.currentPageCar += 1;
            if (this.currentPageCar > this.totalPagesCar) return;
            this.getPlateNumList({ plateNum: this.query }); // 请求接口
        },
        //下拉框收取
        visibleHandler() {
            this.currentPageCar = 1; //手机号页码
            this.totalPagesCar = "";
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
                    // this.loading = false;
                    if (res.data.length < 20) {
                        this.haveDataCar = false;
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
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
        filterTree(data, val, type) {
            this.TreeExpanded = [];
            data.forEach((item) => {
                if (item.name.indexOf(val) !== -1) {
                    // item.show = true;
                    this.TreeExpanded.push(item.id);
                    this.$set(item, "show", true);
                    this.itemChildren(item, val);
                } else {
                    this.$set(item, "show", false);
                    if (item.children.length > 0) {
                        this.filterTree(item.children, val, 1);
                    }
                }
            });
        },
        itemChildren(dataChild, val) {
            if (dataChild.children.length > 0) {
                dataChild.children.forEach((item) => {
                    item.show = true;
                    if (item.name.indexOf(val) !== -1) {
                        this.TreeExpanded.push(item.id);
                    } else {
                        item.expand = false;
                    }
                    if (item.children.length > 0) {
                        this.itemChildren(item);
                    }
                });
            }
        },
        doCancel() {
            this.treeDialogVisible = false;
            this.organizationName1 = "";
        },

        getSyncAuth() {
            this.$api.ishasAuthShow().then((res) => {
                if ((res.success = true)) {
                    this.isShowBtn = res.data.result;
                    this.getErrorNum();
                }
            });
        },
        showSync() {
            // currentPage: 1, //页码，从1开始
            //     pageSize: 20, //分页大小
            //     beginDate: '',
            //     endDate: ''

            this.syncModel = true;
            //
            this.syncParams["currentPage"] = 1;
            this.syncParams["pageSize"] = 20;
            this.syncParams["beginDate"] = "";
            this.syncParams["endDate"] = "";
            this.getSyncInfo();
        },
        cancelSync() {
            this.timeRange = [];
            this.syncModel = false;
            this.toReadState();
        },
        getErrorNum() {
            this.$api.getErrorNum().then((res) => {
                if ((res.success = true)) {
                    this.syncNum = res.data.num;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        toReadState() {
            this.$api.readState(this.readIds).then((res) => {
                if ((res.success = true)) {
                    this.getErrorNum();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //立即同步
        eagerlyGetDevice() {
            this.$api.eagerlyFetchDevice().then((res) => {
                if ((res.success = true)) {
                    // 立即同步成功
                    this.$message.success(
                        this.$t("deviceManage.instantSynchronizationSuccessful")
                    );
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        getSyncInfo() {
            this.$api.syncInfoList(this.syncParams).then((res) => {
                if ((res.success = true)) {
                    this.synctotal = res.data.totalRecords; //显示同步的总数
                    let temp =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : temp;
                    this.syncResultList = temp;

                    this.readIds = temp
                        .slice(0, this.syncParams.pageSize)
                        .map((item) => {
                            if (item.resultType != 1) {
                                return item.id;
                            }
                        })
                        .filter((item) => item != undefined);
                    this.syncResult = true;
                    this.toReadState();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        reSync(id) {
            this.$api.reSync(id).then((res) => {
                if (res.success == true) {
                    // 重新同步成功
                    this.$message.success(
                        this.$t("deviceManage.resynchronizedSuccessfully")
                    );
                    this.getSyncInfo();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        filterNode(value, data) {
            return data[value];
        },
        filterNode1(value, data) {
            return data[value];
        },
        filterNodeTree(value, data) {
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
        handleSyncSizeChange(val) {
            this.syncParams.pageSize = val;
            this.getSyncInfo();
        },
        handleSyncCurrentChange(val) {
            this.syncParams.currentPage = val;
            this.getSyncInfo();
        },
        // 设备添加-路由跳转
        addDevice() {
            this.deviceDetails = {
                organizeId: this.params.organizeId,
                type: "add",
            };
            this.deviceVisible = true;
            this.deviceAddVisible = true;
            // this.$router.push({
            //     path: "/manageCenter/deviceManage/deviceAdd",
            //     query: {
            //         organizeId: this.params.organizeId,
            //         type: "add",
            //     },
            // });
        },
        // 设备编辑-路由跳转
        goEdit(row) {
            this.deviceDetails = {
                organizeId: this.params.organizeId,
                type: "edit",
                id: row.id,
            };
            this.$api
                .getDeviceInfo({
                    id: row.id,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.deviceVisible = true;
                        this.deviceAddVisible = true;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            // this.$router.push({
            //     path: "/manageCenter/deviceManage/deviceAdd",
            //     query: {
            //         organizeId: this.params.organizeId,
            //         type: "edit",
            //         id: row.id,
            //     },
            // });
        },
        deviceVisibleClose() {
            this.deviceVisible = false;
            setTimeout(() => {
                this.deviceAddVisible = false;
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
                            // this.$message.error('组织修改失败:' + err.status)
                            this.fullscreenLoading.close();
                            this.editVisible = false;
                        }
                    );
                })
                .catch(() => {
                    this.editVisible = !this.editVisible;
                });
        },
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
        renderHeader(h, { column, $index }) {
            let that = this;
            return h("span", { class: "poptip" }, [
                h("span", that.$t("common.deviceStatus")), //表格当前列标题
                h(
                    "Poptip",
                    {
                        props: {
                            placement: "top",
                            width: "80px",
                            trigger: "hover",
                            offset: 2,
                            transfer: true,
                            title: that.$t("common.deviceStatus"),
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
                            that.$t(
                                "deviceManage.renderHeaderDeviceStatusPoptip"
                            )
                        ),
                    ]
                ),
            ]);
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
        openTreeDialogVisible() {
            this.treeDialogVisible = true;
            this.dialogNode2 = {};
            this.$refs.tree2 && this.$refs.tree2.setCurrentKey(null);
        },
        // 设备组织-移动
        updateCarOrgRelation() {
            if (this.dialogNode2.defaultNode == 0) {
                this.$message.warning(this.$t("common.vehiclesNotAllowed"));
                return;
            }
            let ids = [];
            this.selection.forEach(function (item) {
                ids.push(item.id);
            });
            const param = {
                organizeId: this.dialogNode2.id,
                deviceIds: ids,
            };
            this.$api.updateCarOrgRelation(param).then((res) => {
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

        //-----导入设备-----
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
        downDeviceTemplate() {
            let params = {
                organizeId: this.params.organizeId,
            };
            this.$api.getDeviceTemplate(params).then((res) => {
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
            this.search();
            this.getDeviceModelList();
            this.$store.dispatch("SetDeviceManageId", data.id);
        },
        // 弹窗内点击选择组织树
        handleDialogNodeClick(data) {
            this.dialogNode = data;
        },
        // 弹窗内点击选择组织树
        handleDialogNodeClick2(data) {
            this.dialogNode2 = data;
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
                    let params = Object.assign(
                        {},
                        this.params,
                        this.searchForm
                    );
                    params.containChildOrg = this.params.checked ? 1 : 0;
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
            if (!params.organizeId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            this.searchLoading = true;
            this.$api
                .getDeviceManagerPage(params)
                .then((res) => {
                    if (res.success == true) {
                        // let listData = res.data.results;
                        // // 为数据添加rowspan字段，方便后面合并数据
                        // listData.forEach(item => {
                        //     item.rowspan = listData.filter(function(i) {
                        //         return i.plateNum == item.plateNum
                        //     }).length;
                        //     item.firstOnlineTime = item.firstOnlineTime ? item.firstOnlineTime : '--';
                        // });
                        // for (let i = 1; i < listData.length; i++) {
                        //     if (listData[i].plateNum == listData[i - 1].plateNum) {
                        //         listData[i].rowspan = 0
                        //     }
                        // }
                        this.listData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.listData;
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
                this.TreeExpanded = [];
                this.TreeExpandedId = [];
                this.treeData = [];
                if (res.success == true) {
                    this.treeData = JSON.parse(JSON.stringify(res.data));
                    this.treeData2 = JSON.parse(JSON.stringify(res.data));
                    this.treeDataId = JSON.parse(JSON.stringify(res.data));
                    if (this.treeDataId.length > 0) {
                        this.treeDataId.forEach((m) => {
                            this.TreeExpandedId.push(m.id);
                            if (m.children.length) {
                                m.children.forEach((item) => {
                                    this.TreeExpandedId.push(item.id);
                                });
                            }
                        });
                    }

                    if (res.data.length > 0) {
                        this.params.organizeId = this.$store.state.tree
                            .deviceManageId
                            ? this.$store.state.tree.deviceManageId
                            : res.data[0].id;
                        this.searchForm = this.$store.state.tree.searchForm
                            ? this.$store.state.tree.searchForm
                            : this.searchForm;
                        this.params = Object.assign(
                            this.params,
                            this.searchForm
                        );
                        this.getData(this.params);
                        this.getDeviceModelList();
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
                        // if(type){
                        //   this.filterTree(this.treeData,this.organizationName,0)
                        //   this.$nextTick(() =>{
                        //     this.$refs.tree.filter('show', !this.organizationName);
                        //   })
                        // }
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
        // 获取设备型号列表
        getDeviceModelList() {
            this.$api.getProductListByOrgId().then((res) => {
                if (res.success == true) {
                    this.deviceModelList = [
                        {
                            fieldNameEN: "",
                            fieldNameCN: this.$t("deviceManage.all"),
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
        // 获取协议类型列表
        getAgreementTypeList() {
            this.$api.getProtocol().then((res) => {
                if (res.success == true) {
                    this.agreementTypeList = res.data;
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
                let params = Object.assign(
                    {
                        carId: this.searchForm.carId,
                        organizeId: this.params.organizeId,
                        containChildOrg: this.params.checked == true ? 1 : 0,
                    },
                    this.searchForm
                );
                this.$api.doExportDevice(params).then((res) => {
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
                        this.$message.error(res.msg);
                        this.loadingAll = false;
                    }
                });
            }
        },
        // 多个删除
        doBatchDelete() {
            this.$confirm(
                this.$t("deviceManage.doBatchDeleteTitle1"),
                this.$t("deviceManage.doBatchDeleteTitle2"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    // 批量删除
                    let ids = [];
                    this.selection.forEach(function (item) {
                        ids.push(item.id);
                    });
                    let param = {
                        deviceIds: ids,
                    };
                    this.$api.deleteDevice(param).then((res) => {
                        if (res.success == true) {
                            this.$message.success(
                                this.$t("deviceManage.doBatchDeleteTitle3")
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
        doDelete(id) {
            this.$confirm(
                this.$t("deviceManage.doBatchDeleteTitle1"),
                this.$t("deviceManage.doBatchDeleteTitle2"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    let ids = [];
                    ids.push(id);
                    let param = {
                        deviceIds: ids,
                    };
                    this.$api.deleteDevice(param).then((res) => {
                        if (res.success == true) {
                            this.$message.success(
                                this.$t("deviceManage.doBatchDeleteTitle3")
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
        handleSuccess() {
            this.search();
            this.getDeviceModelList();
            this.$refs.table.clearSelection();
        },
        handleCommand(command) {
            switch (command) {
                case "a":
                    // 批量删除
                    let ids = [];
                    this.selection.forEach((item) => {
                        ids.push(item.id);
                    });
                    if (ids.length) {
                        this.settingTitle = `${this.$t(
                            "deviceManage.handleCommandText1"
                        )}${this.selection.length}${this.$t(
                            "deviceManage.handleCommandText2"
                        )}`;
                        this.settingParam = {
                            configType: 1,
                            deviceIds: ids,
                        };
                        this.settingVisible = true;
                        this.settingDialogVisible = true;
                    } else {
                        this.$message.warning(
                            this.$t("deviceManage.handleCommandText3")
                        );
                    }
                    break;
                case "b":
                    this.$api
                        .getDeviceManagerPage({
                            currentPage: 1,
                            pageSize: 1,
                            organizeId: this.currentNode.id,
                            containChildOrg: 1,
                        })
                        .then((res) => {
                            if (!!res.data.totalRecords) {
                                this.settingTitle = this.$t(
                                    "deviceManage.handleCommandText4"
                                );
                                this.settingParam = {
                                    configType: 2,
                                    organizeId: this.currentNode.id,
                                };
                                this.settingVisible = true;
                                this.settingDialogVisible = true;
                            } else {
                                this.$message.warning(
                                    this.$t("deviceManage.handleCommandText5")
                                );
                            }
                        });

                    break;
                case "c":
                    this.settingTitle = this.$t(
                        "deviceManage.handleCommandText6"
                    );
                    this.settingParam = {
                        configType: 3,
                    };
                    this.settingVisible = true;
                    this.settingDialogVisible = true;
                    break;
            }
        },
        settingVisibleClose() {
            this.settingVisible = false;
            setTimeout(() => {
                this.settingDialogVisible = false;
            }, 300);
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
        this.getOrgTree(false);
        this.getAgreementTypeList();
        this.getSyncAuth();
        this.getDictionList();
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
</style>
