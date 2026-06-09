<template>
    <div>
        <el-row>
            <el-col :span="4" class="b-r">
                <div :class="{ loading_: searchLoading }" class="p-a">
                    <el-input
                        v-model="organizationName"
                        :placeholder="$t('common.inputOrganizationName')"
                        clearable
                        style="margin-bottom: 0.5rem"
                    >
                        <i
                            slot="suffix"
                            class="el-input__icon el-icon-search"
                        ></i>
                    </el-input>
                    <el-tree
                        ref="tree"
                        :data="treeData"
                        :default-expanded-keys="expandedList"
                        @node-click="handleNodeClick"
                        default-icon="el-icon-folder"
                        highlight-current
                        node-key="id"
                        :props="defaultProps"
                        :current-node-key="currentNodeId"
                        :filter-node-method="filterNode"
                        :style="{ height: treeHeight + 'px' }"
                        :expand-on-click-node="false"
                    ></el-tree>
                </div>
            </el-col>
            <el-col :span="20">
                <div class="wrap" ref="searchBox">
                    <div ref="searchBox" class="search-module">
                        <div class="search-form-content" ref="wrap">
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
                                <!-- 自检上报时间段 -->
                                <el-form-item
                                    prop="time"
                                    :label="
                                        $t(
                                            'equipmentInspection.selfInspectionReportingTimePeriod'
                                        )
                                    "
                                >
                                    <el-date-picker
                                        :picker-options="pickerOptions2"
                                        :clearable="false"
                                        size="small"
                                        v-model="searchForm.time"
                                        type="daterange"
                                        :start-placeholder="
                                            $t('common.startTime')
                                        "
                                        :end-placeholder="$t('common.endTime')"
                                        format="yyyy-MM-dd"
                                    ></el-date-picker>
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
                                @click="handleReset('searchForm')"
                            >
                                <!-- 清除条件 -->
                                {{ $t("common.reset") }}
                            </el-button>
                        </div>
                    </div>
                </div>
                <div class="p-x">
                    <div class="scrollable scrollable-xs">
                        <el-table
                            v-loading="searchLoading"
                            :element-loading-text="
                                $t('common.desperatelyLoading')
                            "
                            element-loading-color="#007213"
                            :data="listData"
                            :height="tableHeight"
                            border
                            stripe
                            style="width: 100%"
                        >
                            <!-- 车牌号 -->
                            <el-table-column
                                prop="plateNum"
                                :label="$t('common.plateNum')"
                                width="140px"
                                fixed="left"
                            >
                                <template slot-scope="scope">
                                    <div v-if="scope.row.plateNum">
                                        <div class="flex-box">
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
                            ></el-table-column>
                            <!-- 最新自检时间 -->
                            <el-table-column
                                prop="selfCheckUpdateTime"
                                :label="
                                    $t(
                                        'equipmentInspection.latestSelfCheckTime'
                                    )
                                "
                                width="170px"
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
                            <!-- 终端手机号 -->
                            <el-table-column
                                prop="deviceCode"
                                :label="$t('common.deviceCode')"
                                width="140px"
                            ></el-table-column>
                            <!-- 设备序列号 -->
                            <el-table-column
                                prop="deviceSerialNum"
                                :label="$t('common.deviceSerialNum')"
                                width="140px"
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
                                width="140px"
                            ></el-table-column>
                            <!-- 操作 -->
                            <el-table-column
                                :label="$t('common.operate')"
                                width="120px"
                                fixed="right"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        type="text"
                                        :disabled="!scope.row.idString"
                                        @click="
                                            showDetails(
                                                scope.row.id,
                                                scope.row.idString
                                            )
                                        "
                                        v-btn="
                                            'equipmentInspectionQuerySelfInspectionDetails'
                                        "
                                    >
                                        <!-- 详情 -->
                                        {{ $t("common.detail") }}
                                    </el-button>
                                    <el-button
                                        type="text"
                                        class="text-info"
                                        @click="
                                            showHistory(
                                                scope.row.deviceCode,
                                                scope.row.idString
                                            )
                                        "
                                        v-btn="
                                            'equipmentInspectionQueryHistoricalRecords'
                                        "
                                    >
                                        <!-- 历史 -->
                                        {{ $t("equipmentInspection.history") }}
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="p-x wrap-bottom" ref="searchPagination">
                    <el-pagination
                        @size-change="PageSizeChange"
                        @current-change="pageChange"
                        :current-page="params.currentPage"
                        :page-sizes="[20, 50, 100]"
                        :page-size="params.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                    >
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
        <!-- 自检结果 -->
        <el-dialog
            :fullscreen="true"
            :title="$t('equipmentInspection.selfInspectionResults')"
            :visible="showDetailBol"
            @close="showDetailBol = false"
            class="no-padding no-border"
            append-to-body
            custom-class="self-inspection-results"
        >
            <div slot="title" class="fullscreen-title">
                <h2>
                    <!-- 自检结果 -->
                    {{ $t("equipmentInspection.selfInspectionResults") }}
                </h2>
                <el-button
                    icon="el-icon-close"
                    type="text"
                    @click="showDetailBol = false"
                >
                    <!-- 关闭 -->
                    {{ $t("common.close") }}
                </el-button>
            </div>
            <el-tabs v-model="config" @tab-click="handleTabClick">
                <!-- 报文 -->
                <el-tab-pane
                    :label="$t('equipmentInspection.message')"
                    name="jsonshow"
                ></el-tab-pane>
                <!-- 列表 -->
                <el-tab-pane
                    :label="$t('equipmentInspection.list')"
                    name="list"
                ></el-tab-pane>
            </el-tabs>
            <div v-show="config == 'list'" class="start-config-content">
                <el-scrollbar wrap-class="demo-scrollbar-wrap-22">
                    <p class="listTitle">
                        <!-- 严重异常 -->
                        {{ $t("equipmentInspection.fatalException") }}
                    </p>
                    <el-row justify="space-between" type="flex">
                        <el-col :span="24">
                            <el-table
                                ref="singleTable"
                                :data="detailsTableMajor"
                                highlight-current-row
                                style="width: 100%"
                                border
                            >
                                <!-- 序号 -->
                                <el-table-column
                                    prop="order"
                                    :label="
                                        $t('equipmentInspection.serialNumber')
                                    "
                                    width="50"
                                ></el-table-column>
                                <!-- 自检项 -->
                                <el-table-column
                                    prop="title"
                                    show-overflow-tooltip
                                    :label="
                                        $t(
                                            'equipmentInspection.selfInspectionItems'
                                        )
                                    "
                                    width="140"
                                ></el-table-column>
                                <!-- 内容 -->
                                <el-table-column
                                    :label="$t('equipmentInspection.content')"
                                    show-overflow-tooltip
                                >
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.content }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                    <p class="listTitle">
                        <!-- 普通异常 -->
                        {{ $t("equipmentInspection.ordinaryAnomaly") }}
                    </p>
                    <el-row justify="space-between" type="flex">
                        <el-col :span="24">
                            <el-table
                                ref="singleTable"
                                :data="detailsTableOrdinary"
                                highlight-current-row
                                style="width: 100%"
                                border
                            >
                                <!-- 序号 -->
                                <el-table-column
                                    prop="order"
                                    :label="
                                        $t('equipmentInspection.serialNumber')
                                    "
                                    width="50"
                                ></el-table-column>
                                <!-- 自检项 -->
                                <el-table-column
                                    prop="title"
                                    show-overflow-tooltip
                                    :label="
                                        $t(
                                            'equipmentInspection.selfInspectionItems'
                                        )
                                    "
                                    width="140"
                                ></el-table-column>
                                <!-- 内容 -->
                                <el-table-column
                                    :label="$t('equipmentInspection.content')"
                                    show-overflow-tooltip
                                >
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.content }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                    <p class="listTitle">
                        <!-- 信息记录 -->
                        {{ $t("equipmentInspection.informationRecords") }}
                    </p>
                    <el-row justify="space-between" type="flex">
                        <el-col :span="24">
                            <el-table
                                ref="singleTable"
                                :data="detailsTableNote"
                                highlight-current-row
                                style="width: 100%"
                                border
                            >
                                <!-- 序号 -->
                                <el-table-column
                                    prop="order"
                                    :label="
                                        $t('equipmentInspection.serialNumber')
                                    "
                                    width="50"
                                ></el-table-column>
                                <!-- 自检项 -->
                                <el-table-column
                                    prop="title"
                                    show-overflow-tooltip
                                    :label="
                                        $t(
                                            'equipmentInspection.selfInspectionItems'
                                        )
                                    "
                                    width="140"
                                ></el-table-column>
                                <!-- 内容 -->
                                <el-table-column
                                    :label="$t('equipmentInspection.content')"
                                    show-overflow-tooltip
                                >
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.content }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </el-scrollbar>
            </div>
            <div class="jsonContent" v-show="config == 'jsonshow'">
                <pre> {{ jsonData }} </pre>
            </div>
        </el-dialog>
        <!-- 当日上线/离线时间 -->
        <el-dialog
            :width="'600px'"
            :visible.sync="modalOnline"
            :title="$t('vehicleOnlineTime.dailyOnlineOfflineTime')"
        >
            <AttendenceRecord
                :onlineTimeList="onlineTimeList"
                :totalHours="totalHours"
                :totalMinutes="totalMinutes"
                :totalSeconds="totalSeconds"
            ></AttendenceRecord>
            <div slot="footer"></div>
        </el-dialog>
    </div>
</template>
<script>
import TimeUtil from "@/utils/time";
import timeCom from "@/components/timeCom";
import AttendenceRecord from "@/components/AttendenceRecord";
require("@/assets/style/base.scss");
export default {
    name: "equipment",
    components: { TimeUtil, timeCom, AttendenceRecord },
    data() {
        return {
            searchLoading: false,
            config: "jsonshow",
            displayHistoryChecked: false,
            currentDeviceCode: "",
            currentProductKey: "",
            tableHeight: 500,
            treeHeight: 500,
            defaultProps: {
                children: "children",
                label: "name",
            },
            currentNodeId: null,
            totalInfo: {
                totalAlarmCount: 0,
                time: TimeUtil.getDateTime(new Date()),
                lostVideoChannelStatusCount: 0,
                storageStatusCount: 0,
                gpsStatusCount: 0,
                signalIntensity0Count: 0,
            },
            //设备列表
            searchState: true,
            loading: false,
            dataReady: false, // 判断异步数据加载完成，避免报错
            loadingAll: false,
            dictionary: [],
            majorDic: [], //严重异常
            ordinaryDic: [], //普通异常
            noteDic: [], //信息记录
            showDetailBol: false,
            detailsData: "",
            detailsTableMajor: [],
            detailsTableOrdinary: [],
            detailsTableNote: [],
            detailsTableA: "",
            detailsTableB: "",
            searchForm: {
                // 搜索表单
                // tenantId: '',
                time: [],
                selfCheckUpdateTimeBegin: "",
                selfCheckUpdateTimeEnd: "",
                selectObj: {},
            },
            timeRange: [
                new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                new Date(),
            ],
            jsonData: "",
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                // orderColumn: 'deviceCode', //排序列
                // orderDir: 'asc',   //排序方向
                organizeId: "",
            },
            searchFormValidate: {},
            modalOnline: false,
            onlineTimeList: [],
            totalHours: 0,
            totalMinutes: 0,
            totalSeconds: 0,
            // 窗口内设备列表
            allProductList: [],
            allList: [],
            listData: [], // @:data
            total: 0, // 数据总数
            selection: [], // 表格选中项
            file: null,
            /** 设备组织 **/
            treeData: [],
            expandedList: [],
            checkedTreeData: "",
            groupID: null, //选中的节点ID
            loadingAll: false,
            organizationName: "",
            pickerOptions2: {
                disabledDate(time) {
                    // 禁用以后的时间
                    return time.getTime() > Date.now();
                },
            },
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
        // params: {
        //     handler (val) {
        //         let params=Object.assign(val,this.searchForm);
        //         this.getData(params);
        //     },
        //     deep: true
        // },
        // organizationName(val) {
        //     this.$refs.tree.filter(val, !this.organizationName);
        // },
        // timeRange: {
        //     handler (val) {
        //         if(val.length > 0) {
        //             if((val[1].getTime()-val[0].getTime()) > 90*24*60*60*1000){
        //               this.$message.info('请将查询时间间隔保持在90天以内');
        //               this.timeRange = [];
        //               return
        //             }else{
        //               this.searchForm.beginDate=TimeUtil.getDate(this.timeRange[0])
        //               this.searchForm.endDate=TimeUtil.getDate(this.timeRange[1])
        //             }
        //         } else {
        //             this.searchForm.beginDate= ''
        //             this.searchForm.endDate= ''
        //         }
        //     },
        //     deep: true,
        // }
    },
    computed: {},
    methods: {
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
        handleTabClick(name) {
            this.config = name.name;
        },
        filterNode(value, data) {
            return data[value];
        },
        filterTag(value, row) {
            // console.log(value, row)
            return row.deviceStatus === value;
        },
        filterChange(obj) {
            for (const key in obj) {
                this.searchForm[key] = obj[key];
            }
            this.search();
        },
        showModalOnline(data) {
            this.onlineTimeList = data.deviceOnlineSectionVoList;
            this.totalHours = data.totalHours;
            this.totalMinutes = data.totalMinutes;
            this.totalSeconds = data.totalSeconds;
            this.modalOnline = true;
        },
        resetGpsStatusChecked() {
            this.searchForm.gpsStatusChecked = [];
            this.search();
        },
        resetStorageStatusChecked() {
            this.searchForm.storageStatusChecked = [];
            this.search();
        },
        resetDeviceStatusChecked() {
            this.searchForm.deviceStatusChecked = [];
            this.search();
        },
        getGpsStatusChecked() {
            this.search();
        },
        getStorageStatusChecked() {
            this.search();
        },
        getDeviceStatusChecked() {
            this.search();
        },
        searchAlarm() {
            this.searchForm.gpsStatusChecked = [];
            this.searchForm.storageStatusChecked = [];
            this.searchForm.deviceStatusChecked = [];
            this.searchForm.selectAlarmDev = 0;
            this.search();
            document
                .getElementById("searchAlarm")
                .setAttribute("class", "ivu-btn ivu-btn-primary");
            document
                .getElementById("searchAll")
                .setAttribute("class", "ivu-btn");
        },
        searchAll() {
            this.searchForm.gpsStatusChecked = [];
            this.searchForm.storageStatusChecked = [];
            this.searchForm.deviceStatusChecked = [];
            this.searchForm.selectAlarmDev = 1;
            this.search();
            document
                .getElementById("searchAll")
                .setAttribute("class", "ivu-btn ivu-btn-primary");
            document
                .getElementById("searchAlarm")
                .setAttribute("class", "ivu-btn");
        },
        pkChange() {
            let params = Object.assign(this.params, this.searchForm);
            this.getData(params);
        },
        getProductList() {
            this.$api.getProductList().then((res) => {
                if (res.success == true) {
                    this.allProductList = [];
                    res.data.forEach((item) => {
                        this.allProductList.push({
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
            } else {
                this.$refs.searchForm.validate((valid, invalidFields) => {
                    if (valid) {
                        this.searchLoading = true;
                        this.searchForm.selfCheckUpdateTimeBegin = this
                            .searchForm.time[0]
                            ? this.$moment(this.searchForm.time[0])
                                  .startOf("day")
                                  .format("YYYY-MM-DD HH:mm:ss")
                            : "";
                        this.searchForm.selfCheckUpdateTimeEnd = this.searchForm
                            .time[1]
                            ? this.$moment(this.searchForm.time[1])
                                  .endOf("day")
                                  .format("YYYY-MM-DD HH:mm:ss")
                            : "";
                        let params = Object.assign(
                            {},
                            this.params,
                            this.searchForm
                        );
                        delete params.selectObj;
                        delete params.time;
                        this.$api
                            .selfcheckDeviceInfoList(params)
                            .then((res) => {
                                if (res.success == true) {
                                    res.data.results.forEach((item) => {
                                        item.createTime = TimeUtil.parseTime(
                                            item.createTime
                                        );
                                    });
                                    this.searchLoading = false;
                                    this.listData =
                                        (res.data.results.length &&
                                            res.data.totalRecords) ||
                                        (!res.data.results.length &&
                                            !res.data.totalRecords)
                                            ? res.data.results
                                            : this.listData;
                                    this.total = res.data.totalRecords;
                                    this.$nextTick(() => {
                                        this.setTableHeight();
                                    });
                                } else {
                                    this.searchLoading = false;
                                    this.$message.error(res.msg);
                                }
                            });
                        this.$store.dispatch("SetCondtion", this.searchForm);
                    }
                });
            }
        },
        /**
         * @params:category 分类 page：页码 limit:条数
         * */
        getData(params) {
            if (this.groupID == null) {
                return;
            }
            this.loading = true;
            this.$api.getEquipmentInspectionPage(params).then((res) => {
                if (res.success == true) {
                    this.listData =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : this.listData;
                    this.total = res.data.totalRecords;
                    this.dataReady = true;
                    this.selection = [];
                } else {
                    this.$message.error(res.msg);
                }
                this.loading = false;
            });
        },
        /**
         * 多选
         * selection：已选项数据 row：刚选择的项数据
         */
        onSelect(selection, row) {},
        onSelectionChange(selection) {
            this.selection = selection;
        },
        onSortChange(data) {
            let column = data.column;
            let key = data.key;
            let order = data.order;
            if (order != "normal") {
                this.params.orderColumn = key;
                this.params.orderDir = order;
            }
        },
        /**
         * @on-change 页码改变的回调，返回改变后的页码
         * */
        pageChange(page) {
            // if(this.searchForm.deviceModelCode==null||this.searchForm.deviceModelCode==''){
            //     this.$message.error('请选择一个所属产品');
            //     return false;
            // }
            this.params.currentPage = page;
            this.search();
        },
        /**
         * @on-page-size-change 切换每页条数时的回调，返回切换后的每页条数
         * */
        PageSizeChange(limit) {
            this.params.pageSize = limit;
            this.search();
        },
        /**
         * 重置表单
         * */
        handleReset(name) {
            this.$refs[name].resetFields();
            this.$store.dispatch("SetCondtion", this.searchForm);
            // this.searchForm.time = [
            //     new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
            //     new Date(),
            // ];
        },
        //车牌号异常
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
        showDetails(id, idString) {
            let params = { idString: idString };
            this.$api.getJsonById(params).then((res) => {
                if (res.success == true) {
                    let detailsData = "";
                    let keyArr = [];
                    detailsData = JSON.parse(res.data);
                    this.jsonData = JSON.parse(JSON.stringify(detailsData));
                    let majorData = {};
                    let ordinaryData = {};
                    let noteData = {};
                    for (let key in detailsData) {
                        this.majorDic.forEach((item) => {
                            if (item["dictCode"] == key)
                                majorData[key] = detailsData[key];
                        });
                    }
                    for (let key in detailsData) {
                        this.ordinaryDic.forEach((item) => {
                            if (item["dictCode"] == key)
                                ordinaryData[key] = detailsData[key];
                        });
                    }
                    for (let key in detailsData) {
                        this.noteDic.forEach((item) => {
                            if (item["dictCode"] == key)
                                noteData[key] = detailsData[key];
                        });
                    }
                    this.detailsTableMajor = [];
                    this.detailsTableOrdinary = [];
                    this.detailsTableNote = [];
                    let majors = [];
                    let ordinarys = [];
                    let notes = [];
                    for (let x in majorData) {
                        majors.push(x);
                    }
                    for (let x in ordinaryData) {
                        ordinarys.push(x);
                    }
                    for (let x in noteData) {
                        notes.push(x);
                    }
                    if (majors && majors.length) {
                        majors.forEach((item, index) => {
                            for (let i = 0; i < this.dictionary.length; i++) {
                                if (item == this.dictionary[i].dictCode) {
                                    this.detailsTableMajor.push({
                                        order: index + 1,
                                        title: this.dictionary[i].dictName,
                                        content: detailsData[item],
                                        dictType: this.dictionary[i].dictType,
                                    });
                                }
                            }
                        });
                    }
                    if (ordinarys && ordinarys.length) {
                        ordinarys.forEach((item, index) => {
                            for (let i = 0; i < this.dictionary.length; i++) {
                                if (item == this.dictionary[i].dictCode) {
                                    this.detailsTableOrdinary.push({
                                        order: index + 1,
                                        title: this.dictionary[i].dictName,
                                        content: detailsData[item],
                                        dictType: this.dictionary[i].dictType,
                                    });
                                }
                            }
                        });
                    }
                    if (notes && notes.length) {
                        notes.forEach((item, index) => {
                            for (let i = 0; i < this.dictionary.length; i++) {
                                if (item == this.dictionary[i].dictCode) {
                                    this.detailsTableNote.push({
                                        order: index + 1,
                                        title: this.dictionary[i].dictName,
                                        content: detailsData[item],
                                        dictType: this.dictionary[i].dictType,
                                    });
                                }
                            }
                        });
                    }
                    //console.log(keyArr)
                    //JSON数据的key分成两个数组
                    // let arrA_B = [];
                    // for(let i = 0;i < keyArr.length;i+=Math.ceil(keyArr.length/2)){
                    //   arrA_B.push(keyArr.slice(i,i+Math.ceil(keyArr.length/2)))
                    // }
                    // let tableA = [];
                    // let tableB = [];
                    // console.log(arrA_B)
                    // if(arrA_B[0] && arrA_B[0].length){
                    //   arrA_B[0].forEach((item,index) =>{
                    //     for(let i = 0;i < this.dictionary.length;i++){
                    //         if(item == this.dictionary[i].dictCode){
                    //           tableA.push({order:index+1,title:this.dictionary[i].dictName,content:detailsData[item],dictType:this.dictionary[i].dictType})
                    //         }
                    //       }
                    //   });
                    // }
                    // if(arrA_B[1] && arrA_B[1].length){
                    //   arrA_B[1].forEach((item,index) =>{
                    //     for(let i = 0;i < this.dictionary.length;i++){
                    //       if(item == this.dictionary[i].dictCode){
                    //         tableB.push({order:arrA_B[0].length+index+1,title:this.dictionary[i].dictName,content:detailsData[item],dictType:this.dictionary[i].dictType})
                    //       }
                    //     }
                    //   })
                    // }
                    // console.log(tableB);
                    // this.detailsTableA = tableA;
                    // this.detailsTableB = tableB;
                    this.showDetailBol = true;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        showHistory(deviceCode, idString) {
            this.$router.push({
                path: "/maintenanceCenter/equipmentInspection/equipmentInspectionHistory",
                query: {
                    deviceCode,
                    organizeId: this.params.organizeId,
                    idString: idString,
                },
            });
        },
        getCnNames() {
            let params = {};
            this.$api.getCnNames(params).then((res) => {
                if (res.success == true) {
                    this.dictionary = res.data;
                    this.ordinaryDic = this.dictionary.filter((item) => {
                        return item["dictType"] == 1;
                    });
                    this.majorDic = this.dictionary.filter((item) => {
                        return item["dictType"] == 2;
                    });
                    this.noteDic = this.dictionary.filter((item) => {
                        return item["dictType"] == 3;
                    });
                }
            });
        },
        /** 组织管理start **/
        //组装树结构
        // renderContent (h, { root, node, data }) {
        //         var nodeIcon;
        //         if(data.defaultNote ==0){
        //             nodeIcon = 'android-home';
        //         }else if(data.defaultNote == 1){
        //             nodeIcon = 'android-folder';
        //         }

        //         return h('Poptip', { props:{ placement:"right-end",transfer: true,content: data.desc,trigger:'hover'}},[
        //                     h('span', {
        //                         style: {
        //                             display: 'inline-block',
        //                             width: '100%',
        //                             cursor: 'pointer'
        //                         },
        //                         on: {
        //                             click: (e) => {
        //                                 this.$refs.myTree.handleSelect(node.nodeKey); //手动选择树节点
        //                                 this.treeChange(data);
        //                             }
        //                         }
        //                     }, [
        //                         h('span', [
        //                             h('Icon', {
        //                                 props: {
        //                                     type: nodeIcon
        //                                 },
        //                                 style: {
        //                                     marginRight: '8px'
        //                                 }
        //                             }),
        //                             h('span',{
        //                                 class:data.selected == true ? 'ivu-tree-title-selected' : ''
        //                             }, data.title)
        //                         ])
        //                     ])
        //             ]);
        //         },
        //选中树回调
        // treeChange(data){
        //     this.checkedTreeData = data;
        //     this.groupID = data.id;
        //     this.searchForm.groupID = data.id;
        //     if(!this.searchForm.deviceModelCode){
        //         this.listData = [];
        //         this.total = 0;
        //         this.params.currentPage = 1;
        //     } else {
        //         this.search();
        //     }
        // },
        setCurrentNode() {
            this.$refs.tree.setCurrentNode(this.treeData[0]);
        },
        handleNodeClick(data) {
            //   this.checkedTreeData = data;
            //     this.groupID = data.id;
            //     this.searchForm.groupID = data.id;
            //     if(!this.searchForm.deviceModelCode){
            //         this.listData = [];
            //         this.total = 0;
            //         this.params.currentPage = 1;
            //     } else {
            //         this.search();
            //     }
            // for (let key in this.searchForm) {
            //     this.searchForm[key] = "";
            // }
            // this.searchForm.time = [
            //     new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
            //     new Date(),
            // ];
            // if (this.searchForm.time.length > 0) {
            //     this.searchForm.beginDate = TimeUtil.getDate(
            //         this.searchForm.time[0]
            //     );
            //     this.searchForm.endDate = TimeUtil.getDate(
            //         this.searchForm.time[1]
            //     );
            // } else {
            //     this.searchForm.beginDate = "";
            //     this.searchForm.endDate = "";
            // }
            this.currentNodeId = data.id;
            this.params.organizeId = data.id;
            this.params.currentPage = 1;
            this.search();
            this.$store.dispatch("SetDeviceManageId", data.id);
        },
        //获取树结构
        getGroupTree() {
            // this.$api.getGroupTreeHikVithCount().then((res) => {
            //     if (res.success == true) {
            //         this.treeData = res.data;
            //         if(this.treeData!=null){
            //         this.setCurrentNode();
            //         this.handleNodeClick(this.treeData[0])
            //         // this.treeChange(this.treeData[0]);
            //         // this.checkedTreeData = this.treeData[0];
            //         this.treeData[0].selected=true;
            //         }
            //     } else {
            //         this.$message.error('获取组织树列表失败:' + res.msg)
            //     }
            // })
            this.searchLoading = true;
            this.$api.getOrgTree().then((res) => {
                this.treeData = [];
                this.expandedList = [];
                this.setTableHeight();
                if (res.success == true) {
                    this.treeData = res.data;
                    this.searchLoading = false;
                    if (res.data.length > 0) {
                        this.currentNodeId = this.$store.state.tree
                            .deviceManageId
                            ? this.$store.state.tree.deviceManageId
                            : res.data[0].id;
                        this.params.organizeId = this.$store.state.tree
                            .deviceManageId
                            ? this.$store.state.tree.deviceManageId
                            : res.data[0].id;
                        this.searchForm = this.$store.state.tree.searchForm
                            ? this.$store.state.tree.searchForm
                            : this.searchForm;
                        this.searchForm.time[0] = TimeUtil.getDate(
                            this.searchForm.time[0]
                        );
                        this.searchForm.time[1] = TimeUtil.getDate(
                            this.searchForm.time[1]
                        );
                        // this.currentNode = res.data[0]
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
                    }
                    // if(this.treeData!=null){
                    // this.setCurrentNode();
                    // this.handleNodeClick(this.treeData[0])
                    // // this.treeChange(this.treeData[0]);
                    // // this.checkedTreeData = this.treeData[0];
                    // // this.treeData[0].selected=true;
                    // }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        /** 项目组织管理end **/
        getAlarmCounts() {
            this.$api.getAlarmCounts().then((res) => {
                if (res.success == true) {
                    this.totalInfo.totalAlarmCount = res.data.totalAlarmCount;
                    this.totalInfo.lostVideoChannelStatusCount =
                        res.data.lostVideoChannelStatusCount;
                    this.totalInfo.storageStatusCount =
                        res.data.storageStatusCount;
                    this.totalInfo.gpsStatusCount = res.data.gpsStatusCount;
                    this.totalInfo.signalIntensity0Count =
                        res.data.signalIntensity0Count;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchPagination.clientHeight -
                82;
            this.treeHeight = document.body.clientHeight - 149;
        },
        goExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.$api.doExportEQDeviceList(this.searchForm).then((res) => {
                    if (res.success == true) {
                        this.loadingAll = true;
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

        /** 打开历史巡检窗口 **/
        openHistoryCheckedWin(row) {
            this.currentDeviceCode = row.deviceCode;
            this.currentProductKey = row.deviceModelCode;
            this.displayHistoryChecked = true;
        },
        /** 关闭历史巡检窗口 **/
        closeHistoryCheckedWin() {
            this.displayHistoryChecked = false;
        },
    },
    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };
    },
    created() {
        // this.getUserInfo();
        this.getProductList();
        this.getGroupTree();
        // this.getAlarmCounts();
        this.getCnNames();
    },
};
</script>
<style scoped lang="less">
.demo-scrollbar-wrap-22 {
    width: 100%;
    height: 100%;
}
.start-config-content {
    padding: 10px 0;
    height: calc(~"100% - 44px");
    .el-scrollbar {
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }
}
.listTitle {
    padding: 10px 0 10px 0;
    color: black;
    font-weight: 600;
}
.jsonContent {
    height: calc(~"100% - 58px");
    pre {
        height: calc(~"100% - 14px");
        overflow-y: auto;
    }
}
.loading_ {
    pointer-events: none;
}
.el-icon-warning {
    cursor: pointer;
    font-size: 14px;
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
        height: 74px;
        overflow: hidden;
    }
}
.equipment-inspection {
    .treeHeight {
        height: calc(~"100vh - 7rem");
        overflow-x: scroll;
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
    .template-content {
        margin-bottom: 4.5rem;
    }
    .batch {
        /*font-size: 18px; font-weight:900; float:left; margin-left: 50px;*/
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
        margin-left: 20px;
        margin-top: 5px;
    }
    .batch_num_eq {
        font-size: 16px;
        float: right;
        margin-top: 10px;
    }
    .batch_num_eq div {
        float: left;
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
}
.flex-box {
    display: inline-block;
    padding: 2px 12px;
}
</style>
<style lang="less">
.self-inspection-results {
    .el-dialog__body {
        padding: 0 20px;
        height: calc(~"100% - 70px");
        .el-tabs__header {
            margin: 0px;
        }
    }
    .el-dialog__header {
        background: #000000;
        padding: 20px;
        .fullscreen-title {
            display: flex;
            color: #ffffff;
            justify-content: space-between;
            .el-button {
                color: #ffffff;
            }
            h2 {
                font-size: 20px;
            }
        }
        .el-dialog__headerbtn {
            display: none;
        }
    }
}
.el-form-item__error {
    padding-top: 0px;
}
</style>
