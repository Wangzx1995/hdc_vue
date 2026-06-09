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
                                @click="goConfig(selectionIds)"
                                v-btn="'parameterQueryBatchQuery'"
                            >
                                <!-- 批量查询 -->
                                {{ $t("parameterQuery.batchQuery") }}
                                {{
                                    selection.length > 0
                                        ? "（" + selection.length + "）"
                                        : ""
                                }}</el-button
                            >
                            <el-button
                                type="default"
                                :disabled="searchLoading"
                                @click="goAllConfig"
                                v-btn="'parameterQueryWholeGroupQuery'"
                            >
                                <!-- 整组查询 -->
                                {{ $t("parameterQuery.groupQuery") }}
                            </el-button>
                            <el-button
                                type="default"
                                @click="openBulkImport"
                                v-btn="'parameterQueryBatchImportQuery'"
                            >
                                <!-- 批量导入查询 -->
                                {{ $t("parameterQuery.batchImportQuery") }}
                            </el-button>
                        </div>
                    </div>
                    <div ref="searchAlert" class="wrap-top p-x">
                        <div
                            class="w-full"
                            v-show="!closeFlag && !selection.length"
                            style="margin-top: 1rem"
                        >
                            <!-- 设备支持离线参数查询！ -->
                            <el-alert
                                :title="
                                    $t(
                                        'parameterQuery.supportsOfflineParameterQuery'
                                    ) + `！`
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
                            ref="table"
                            @filter-change="filterChange"
                            @cell-mouse-enter="cellMouseEnter"
                        >
                            <!-- @sort-change="changeSort" :default-sort="{prop: 'updateTime', order: 'descending'}" -->
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
                            <!-- 设备状态 -->
                            <el-table-column
                                fixed="right"
                                prop="deviceStatus"
                                :label="$t('common.deviceStatus')"
                                min-width="120px"
                                :render-header="renderHeader"
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
                            <!-- 操作 -->
                            <el-table-column
                                fixed="right"
                                :label="$t('common.operate')"
                                width="140px"
                            >
                                <template slot-scope="scope">
                                    <a
                                        class="m-r-sm colorBlue"
                                        @click="searchModule(scope.row)"
                                        v-btn="'parameterQueryQueryParam'"
                                    >
                                        <!-- 查询 -->
                                        {{ $t("common.search") }}
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
        <!-- //批量导入查询 -->
        <el-dialog
            :title="$t('parameterQuery.batchImportQuery')"
            :visible.sync="bulkImportVisible"
            :width="'900px'"
            @close="closeBulkImport"
        >
            <div class="bulk-import">
                <p>
                    <span>
                        <!-- 待查询车辆 -->
                        {{ $t("parameterQuery.vehicleQueried") }}
                        ：
                    </span>
                    <el-button
                        @click="doBulkImport(false)"
                        :loading="importLoading"
                    >
                        <i class="h-icon-refresh_sm"></i>
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
    </div>
</template>

<script>
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
            awakenTime: 0,
            awakenVisible: false,
            fileConfigurationVisible: false,
            fileForm: {
                fileType: 1,
                name: "",
                memo: "",
            },
            dSubAk: localStorage.getItem("dSubAk"),
        };
    },
    watch: {
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
            // 复制成功
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
        //获取车牌号下拉信息
        getPlateNumList(jsonData) {
            console.log("jsonData", jsonData.plateNum);
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
        //   console.log(val)
        //   // this.tableOrder=val.order
        //   if(val.order){
        //     if(val.order === 'descending') {
        //       this.tableOrder = 'desc'
        //       console.log(this.tableOrder)
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
        filterChange(val) {
            for (let i in val) {
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
        // 获取设备查询组织树
        getParamOrganizeTree() {
            this.$api.getParamOrganizeTree().then((res) => {
                this.TreeExpanded = [];
                this.treeData = [];
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
        //获取设备的设置时间
        getParamDeviceManage(params) {},
        /*获取table列表*/
        getData(params, falg) {
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
                        this.total = res.data.totalRecords;
                        this.$nextTick(() => {
                            this.setTableHeight();
                        });
                        if (falg) {
                            if (!this.total) {
                                // 无设备可以查询！
                                this.$message.warning(
                                    this.$t(
                                        "parameterQuery.noDevicesAvailableForQuerying"
                                    ) + "！"
                                );
                                this.searchLoading = false;
                                return;
                            } else if (this.total > 1000) {
                                // 参数查询最多支持同时查询1000个设备！
                                this.$message.warning(
                                    this.$t("parameterQuery.limit1000Devices") +
                                        "！"
                                );
                                this.searchLoading = false;
                                return;
                            }
                            this.$router.push({
                                path: "/maintenanceCenter/parameterQuery/module",
                                query: {
                                    deviceCode: this.searchForm.deviceCode,
                                    softwareVersion:
                                        this.searchForm.softwareVersion,
                                    deviceModelCode:
                                        this.searchForm.deviceModelCode,
                                    deviceStatus: this.searchForm.deviceStatus,
                                    organizeId: this.params.organizeId,
                                },
                            });
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                    if (!falg) {
                        this.searchLoading = false;
                    }
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        // 表格搜索
        search(falg) {
            if (this.$refs.searchForm) {
                this.$refs.searchForm.clearValidate();
            }
            if (!this.params.organizeId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            // this.params.orderDir = this.tableOrder
            let params = Object.assign(this.params, this.searchForm);
            this.$store.dispatch("SetCondtion", this.searchForm);
            delete params.selectObj;
            this.getData(params, falg);
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
        goConfig(ids) {
            if (ids && ids.length <= 0) {
                // 请选择查询的设备
                this.$message.warning(
                    this.$t("parameterQuery.pleaseSelectDevice")
                );
                return;
            }
            this.$router.push({
                path: "/maintenanceCenter/parameterQuery/module",
                query: {
                    deviceIds: ids,
                },
            });
        },
        goAllConfig() {
            this.search(true);
            // if (!this.tableData.length) {
            //     this.$message.warning("无设备可以查询！");
            //     return;
            // }
            // this.$router.push({
            //     path: "/maintenanceCenter/parameterQuery/module",
            //     query: {
            //         deviceCode: this.searchForm.deviceCode,
            //         softwareVersion: this.searchForm.softwareVersion,
            //         deviceModelCode: this.searchForm.deviceModelCode,
            //         deviceStatus: this.searchForm.deviceStatus,
            //         organizeId: this.params.organizeId,
            //     },
            // });
        },
        //批量导入查询
        openBulkImport() {
            this.bulkImportForm.plateArr = [];
            // this.searchForm.plateNum =
            //     this.searchForm.plateJson[this.searchForm.carId];
            this.bulkImportVisible = true;
            this.bulkImportForm.type = 1;
            this.bulkImportForm.plateNum = "";
            this.bulkImportForm.textarea = "";
            this.typeListSelected = this.$t("common.plateNum"); //"车牌号"
        },
        closeBulkImport() {
            this.bulkImportForm.plateArr = [];
        },
        doBulkImport(falg) {
            if (!this.bulkImportForm.textarea) {
                // 请输入待查询
                this.$message.warning(
                    `${this.$t("parameterQuery.enterToBeQueried")}
                    ${this.typeListSelected}`
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
                            this.deviceInfoList = res.data.modelVoList.reduce(
                                (prev, cur) => {
                                    return prev.concat(cur["checkDeviceInfos"]);
                                },
                                []
                            );
                            this.$router.push({
                                path: "/maintenanceCenter/parameterQuery/module",
                                query: {
                                    deviceIds: this.deviceInfoList.reduce(
                                        (prev, cur) => {
                                            return prev.concat(cur["deviceId"]);
                                        },
                                        []
                                    ),
                                },
                            });
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
            row
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
                                            carList: JSON.stringify([row]),
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
            } else if (type == "file") {
                if (this.dSubAk == "D_SUB_huifeng_1668791514298") {
                    this.fileConfigurationVisible = true;
                } else {
                    this.$router.push({
                        path: "/maintenanceCenter/deviceConfiguration/configurationDetail/fileIndex",
                        query: {
                            deviceId,
                            deviceCode,
                            organizeId: this.params.organizeId,
                        },
                    });
                }
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
        //查询
        searchModule(data) {
            this.$router.push({
                path: "/maintenanceCenter/parameterQuery/module",
                query: {
                    deviceIds: [data.id],
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
        clearSelection() {
            if (!this.selection.length) {
                return;
            }
            this.$refs.table.clearSelection();
            this.selection = [];
            // 取消成功
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
    },
    mounted() {
        this.setWrap();
        sessionStorage.removeItem("deviceInfoList");
        window.addEventListener("resize", this.canvasResize);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.canvasResize);
    },
    created() {
        this.getDictionList();
        this.getParamOrganizeTree();
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
