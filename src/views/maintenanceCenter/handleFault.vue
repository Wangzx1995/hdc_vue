<template>
    <div>
        <!--左边树右边列表-->
        <el-row>
            <el-col :span="4" class="p-a b-r">
                <div :class="{ loading_: searchLoading }">
                    <el-input
                        class="searchBottom"
                        v-model="organizationName"
                        :placeholder="$t('common.inputOrganizationName')"
                        clearable
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
                        :current-node-key="params.organizeId"
                        :filter-node-method="filterNode"
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
                                <!-- 车牌号 -->
                                <el-form-item
                                    prop="plateNum"
                                    :label="$t('common.plateNum')"
                                >
                                    <el-input
                                        v-model.trim="searchForm.plateNum"
                                        :placeholder="$t('common.input')"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                                <!-- 待处理故障类型 -->
                                <el-form-item
                                    :label="$t('handleFault.pendingFaultType')"
                                >
                                    <TreeSelect
                                        :treeData="allFaultType"
                                        show-checkbox
                                        style="width: 300px"
                                        collapse-tags
                                        check-model="child"
                                        filter
                                        v-model="searchForm.faultTypes"
                                    >
                                    </TreeSelect>
                                </el-form-item>
                                <!-- 故障开始时间段 -->
                                <el-form-item
                                    :label="
                                        $t('handleFault.faultStartTimePeriod')
                                    "
                                >
                                    <el-date-picker
                                        size="small"
                                        v-model="time"
                                        :default-time="['00:00:00', '23:59:59']"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        type="datetimerange"
                                        :start-placeholder="
                                            $t('common.startTime')
                                        "
                                        :end-placeholder="$t('common.endTime')"
                                    />
                                </el-form-item>
                            </el-form>
                            <div
                                v-if="activeName == 'second'"
                                class="drawPosition"
                            ></div>
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
                    <div class="p-x">
                        <div
                            v-show="activeName == 'second'"
                            :style="{ height: mapHeight + 'px' }"
                            style="width: 100%; margin-bottom: 5px"
                            id="container1"
                        ></div>
                    </div>
                    <div class="p-x" ref="searchBtn">
                        <el-button
                            type="primary"
                            class="goExport"
                            @click="makeMaintenances()"
                            v-btn="'handleFaultMaintenanceTasks'"
                        >
                            <!-- 生成维护任务 -->
                            {{ $t("handleFault.generateMaintenanceTasks") }}
                            {{
                                selectionIds.length
                                    ? "(" + selectionIds.length + ")"
                                    : ""
                            }}</el-button
                        >
                        <el-button
                            class="goExport"
                            @click="goExport"
                            :loading="loadingAll"
                            :disabled="loadingAll"
                            v-btn="'handleFaultExport'"
                        >
                            <!-- 导出 -->
                            {{ $t("common.export") }}
                        </el-button>
                        <el-radio-group
                            style="float: right"
                            v-model.number="searchForm.maintenanceStatus"
                            @change="changeRadioType"
                        >
                            <el-radio-button
                                :disabled="searchLoading"
                                :label="0"
                            >
                                <!-- 全部 -->
                                {{ $t("common.all") }}
                            </el-radio-button>
                            <el-radio-button
                                :disabled="searchLoading"
                                :label="1"
                            >
                                <!-- 没有维护任务 -->
                                {{ $t("handleFault.noMaintenanceTask") }}
                            </el-radio-button>
                            <el-radio-button
                                :disabled="searchLoading"
                                :label="2"
                            >
                                <!-- 有维护任务 -->
                                {{ $t("handleFault.haveMaintenanceTask") }}
                            </el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="m-x p-y table">
                        <el-table
                            @sort-change="sortChange"
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
                            border
                            stripe
                        >
                            <el-table-column
                                type="selection"
                                :selectable="selectable"
                            ></el-table-column>
                            <!-- 车牌号 -->
                            <el-table-column
                                prop="plateNum"
                                :label="$t('common.plateNum')"
                                width="150px"
                            >
                                <template slot-scope="scope">
                                    <div style="display: inline-block">
                                        {{ scope.row.plateNum }}
                                        <span
                                            v-show="scope.row.freeze == 1"
                                            class="freeze-icon"
                                            >{{ $t("carManage.freeze") }}</span
                                        >
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
                                        <img
                                            v-if="
                                                scope.row.maintenanceStatus == 1
                                            "
                                            style="height: 19px"
                                            src="/static/images/img_siting.png"
                                        />
                                    </div>
                                </template>
                            </el-table-column>
                            <!-- 所属组织 -->
                            <el-table-column
                                prop="orgName"
                                :label="$t('common.orgPath')"
                                min-width="120px"
                            ></el-table-column>
                            <!-- 待解决故障数 -->
                            <el-table-column
                                sortable="custom"
                                prop="unresolvedNum"
                                :label="
                                    $t('handleFault.unresolvedFaultsNumbers')
                                "
                                width="136px"
                                align="right"
                            ></el-table-column>
                            <!-- 最后故障时间 -->
                            <el-table-column
                                sortable="custom"
                                prop="updateTime"
                                :label="$t('handleFault.lastFailureTime')"
                                width="170px"
                            ></el-table-column>
                            <!-- 操作 -->
                            <el-table-column
                                prop="action"
                                :label="$t('common.operate')"
                                width="240"
                                fixed="right"
                            >
                                <template slot-scope="scope">
                                    <a
                                        style="margin-right: 20px"
                                        v-if="scope.row.maintenanceStatus == 0"
                                        @click="makeMaintenance(scope.row)"
                                        v-btn="'handleFaultMaintenanceTasks'"
                                    >
                                        <!-- 生成维护任务 -->
                                        {{
                                            $t(
                                                "handleFault.generateMaintenanceTasks"
                                            )
                                        }}
                                    </a>
                                    <a
                                        style="margin-right: 20px"
                                        v-if="activeName == 'first'"
                                        @click="showPosition(scope.row.carId)"
                                        v-btn="'handleFaultVehicleLocation'"
                                    >
                                        <!-- 位置 -->
                                        {{ $t("handleFault.position") }}
                                    </a>
                                    <a @click="goDetail(scope.row)">
                                        <!-- 详情 -->
                                        {{ $t("common.detail") }}
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
            :title="title"
            :visible.sync="dialogVisible"
            :width="'576px'"
            @close="handleExit"
        >
            <el-form
                content-width="480px"
                inline
                label-position="top"
                ref="taskForm"
            >
                <div>
                    <!-- 上传平台信息 -->
                    <el-form-item
                        :label="$t('handleFault.uploadPlatformInformation')"
                    >
                        <el-checkbox
                            :disabled="item.disabled"
                            v-for="item in taskList"
                            :key="item.fileType"
                            v-model="item.isCheckd"
                            >{{ item.fileTypeName }}</el-checkbox
                        >
                    </el-form-item>
                </div>
                <div>
                    <!-- 备注信息 -->
                    <el-form-item
                        :label="$t('handleFault.memo')"
                        prop="comment"
                    >
                        <el-input
                            style="width: 480px"
                            v-model="taskForm.comment"
                            type="textarea"
                            :maxlength="500"
                            show-word-limit
                            :autosize="{
                                minRows: 2,
                                maxRows: 6,
                            }"
                            clearable
                            :placeholder="$t('common.input')"
                        >
                        </el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleExit">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button
                    type="primary"
                    @click="handleSure"
                    :disabled="loadingBtu"
                >
                    <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </span>
        </el-dialog>
        <!-- 详情 -->
        <el-dialog
            :title="$t('common.detail')"
            :visible.sync="dialogTableVisible"
            :width="'850px'"
        >
            <el-table
                :data="tableDataDialog"
                label-width="auto"
                height="600"
                border
            >
                <!-- 处理状态 -->
                <el-table-column
                    prop="status"
                    :label="$t('anomalyDetails.processingStatus')"
                    min-width="100px"
                >
                    <template slot-scope="scope">
                        <span :class="scope.row.status == 0 ? 'red' : 'green'"
                            >●</span
                        >
                        {{ showStatus(scope.row.status) }}
                    </template>
                </el-table-column>
                <!-- 故障类型 -->
                <el-table-column
                    prop="faultTypeString"
                    :label="$t('deviceHealthCondition.faultType')"
                    min-width="120px"
                ></el-table-column>
                <!-- 设备序列号 -->
                <el-table-column
                    prop="serialNumber"
                    :label="$t('common.deviceSerialNum')"
                    min-width="140px"
                >
                    <template slot-scope="scope">
                        <el-button
                            @click="showDetails(scope.row.id)"
                            type="link"
                        >
                            {{ scope.row.deviceSerialNum }}
                        </el-button>
                        <el-popover
                            placement="top"
                            v-for="item in scope.row.dataAbnormalList"
                            :key="item.id"
                            v-show="
                                item.type == 1 &&
                                item.deviceValue != scope.row.deviceSerialNum
                            "
                            :open-delay="300"
                            trigger="hover"
                        >
                            <p class="marginBottom">
                                <!-- 设备序列号异常 -->
                                {{ $t("carManage.deviceSerialNumAbnormal") }}
                            </p>
                            <div class="marginBottom">
                                {{
                                    $t("carManage.platformDeviceSerialNum")
                                }}：{{ scope.row.deviceSerialNum }}
                            </div>
                            <div>
                                <!-- 设备端设备序列号 -->
                                {{ $t("carManage.deviceDeviceSerialNum") }}
                                ：{{ item.deviceValue }}
                            </div>
                            <a
                                @click="toChange(2, scope.row.deviceSerialNum)"
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
                <!-- 故障开始时间 -->
                <el-table-column
                    sortable
                    prop="collectTime"
                    :label="$t('maintainRecord.faultStartTime')"
                    min-width="140px"
                ></el-table-column>
                <!-- 故障可能原因 -->
                <el-table-column
                    prop="faultReason"
                    :label="$t('handleFault.faultReason')"
                    min-width="140px"
                ></el-table-column>
                <!-- 解决建议 -->
                <el-table-column
                    prop="faultSolution"
                    :label="$t('handleFault.faultSolution')"
                    width="150"
                    fixed="right"
                ></el-table-column>
            </el-table>
        </el-dialog>
        <!--位置-->
        <el-dialog
            :title="$t('handleFault.position')"
            :visible.sync="singlePositionVisible"
            :width="'850px'"
            @close="closeSinglePosition"
        >
            <div style="width: 100%; height: 500px" id="container"></div
        ></el-dialog>
    </div>
</template>
<script>
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import TimeUtil from "@/utils/time";
import timeCom from "@/components/timeCom";
import AttendenceRecord from "@/components/AttendenceRecord";
import {
    BaiduMap,
    BmControl,
    BmCityList,
    BmMarker,
    BmlMarkerClusterer,
    BmCircle,
    BmPolyline,
    BmPolygon,
} from "vue-baidu-map";
require("@/assets/style/base.scss");
export default {
    name: "faultManagement",
    components: {
        TimeUtil,
        timeCom,
        AttendenceRecord,
        BaiduMap,
        BmMarker,
        BmlMarkerClusterer,
        BmCircle,
        BmPolyline,
        BmPolygon,
        TreeSelect,
    },
    data() {
        return {
            dialogVisible: false,
            taskForm: {
                comment: "",
            },
            title: "",
            taskList: [],
            dashboard: this.$route.query.dashboard,
            map: null,
            mouseTool: null, //框选查车绘制框工具
            areaSearchCar: false, //框选查车
            highLightCarList: [], //高亮车辆列表
            areaSearchCarModel: false,
            positionArr: [], //故障车辆位置
            dialogTableVisible: false,
            center: { lng: "", lat: "" },
            singlePosition: {
                lng: "",
                lat: "",
            },
            singlePositionVisible: false,
            mapDragging: true, //允许地图拖动
            areaDragging: false, //允许区域拖动
            zoom: 15,
            enableDraw: false,
            activeName: "first",
            allFaultType: [],
            requireFiles: [],
            moreHidden: false,
            defaultProps: {
                children: "children",
                label: "name",
            },
            tableDataDialog: [],
            status: 0,
            mapHeight: 300,
            tableHeight: 500,
            treeHeight: 500,
            //设备列表
            loadingAll: false,
            searchLoading: false,
            time: this.$store.state.tree.time
                ? [
                      TimeUtil.getDateTime(this.$store.state.tree.time[0]),
                      TimeUtil.getDateTime(this.$store.state.tree.time[1]),
                  ]
                : [new Date(new Date() - 7 * 24 * 60 * 60 * 1000), new Date()],
            searchForm: {
                // 搜索表单
                faultTypes: [],
                plateNum: "",
                startTime: "",
                endTime: "",
                plateNums: [],
                maintenanceStatus: 0,
                orderColumn: "",
                orderDir: "",
            },
            faultTypeList: [],
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                organizeId: "",
                treeLevel: "",
            },
            carLocationParams: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                organizeId: "",
            },
            // 窗口内设备列表
            deviceModelList: [],
            tableData: [], // @:data
            total: 0, // 数据总数
            selection: [], // 表格选中项
            file: null,
            treeData: [],
            expandedList: [],
            selectionIds: [],
            filterObj: {},
            filterTagShow: 0,
            organizationName: "",
            polylinePath: [],
            overlays: [],
            mouseLocation: { lng: 0, lat: 0 },
            buttonClick: false,
            iconShow: false,
            loadingBtu: false,
            map2: null,
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
        time: {
            handler(val) {
                this.searchForm.startTime = TimeUtil.getDateTime(val[0]);
                this.searchForm.endTime = TimeUtil.getDateTime(val[1]);
            },
            immediate: true,
        },
    },
    methods: {
        handleClick() {
            this.buttonClick = !this.buttonClick;
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        //对接接口的排序方法
        sortChange(column, prop, order) {
            this.searchForm.orderDir = !column.order
                ? ""
                : column.order === "ascending"
                ? "asc"
                : "desc";
            this.searchForm.orderColumn = !column.prop
                ? ""
                : column.prop == "unresolvedNum"
                ? "unresolved_fault"
                : "t_update_time";
            this.search();
        },
        handleExit() {
            this.dialogVisible = false;
            this.taskForm.comment = "";
            this.taskList.forEach((item) => {
                item["isCheckd"] = true;
            });
        },
        handleSure() {
            this.loadingBtu = true;
            let chooseArr = this.taskList.filter((item) => {
                return item.isCheckd == true;
            });
            let typesArr = [];
            chooseArr.forEach((item) => {
                if (item.isCheckd) {
                    typesArr.push(item.fileType);
                }
            });
            this.taskForm = Object.assign(this.taskForm, {
                requireFiles: typesArr,
            });
            this.$api.addMaintenanceRecord(this.taskForm).then((res) => {
                if (res.success) {
                    // 生成维护任务成功！
                    this.$message.success(
                        this.$t("handleFault.generateMaintenanceTasks") +
                            this.$t("common.success")
                    );
                    this.getData();
                    this.dialogVisible = false;
                    this.taskForm.comment = "";
                    this.loadingBtu = false;
                    this.$api.eventTrackTrigger({
                        menu: "HANDLE_FAULT",
                        business: "HANDLE_FAULT_TASKS",
                        eventResult: res.success,
                    });
                } else {
                    this.$message.error(`${res.msg}`);
                    this.dialogVisible = false;
                    this.taskForm.comment = "";
                    this.loadingBtu = false;
                }
            });
        },
        //批量生成维护任务
        makeMaintenances(item) {
            console.log(this.selectionIds);
            if (this.selectionIds.length) {
                this.dialogVisible = true;
                this.title = `${this.$t(
                    "handleFault.generateMaintenanceTasks"
                )}（${this.selectionIds.length}）`;
                this.taskForm = Object.assign(
                    {},
                    this.taskForm,
                    { cars: this.selectionIds },
                    { organizeId: this.params.organizeId }
                );
            } else {
                // 请至少选择一辆车生成维护任务！
                this.$message.info(this.$t("handleFault.makeMaintenancesInfo"));
            }
        },
        //单个生成维护任务
        makeMaintenance(item) {
            let cars = [
                {
                    plateNum: item.plateNum,
                    treeLevel: item.treeLevel,
                },
            ];
            this.dialogVisible = true;
            this.title = this.$t("handleFault.generateMaintenanceTasks");
            this.taskForm = Object.assign(
                {},
                this.taskForm,
                { cars: cars },
                { organizeId: this.params.organizeId }
            );
        },
        changeRadioType() {
            if (!this.params.organizeId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            this.params.currentPage = 1;
            this.getData();
        },
        //获取维修记录上传文件要求
        getRequirementFiles() {
            this.$api.requirementFiles().then((res) => {
                if (res.success) {
                    res.data.forEach((item) => {
                        item["isCheckd"] = true;
                        if (item["fileType"] == 1 || item["fileType"] == 2) {
                            item["disabled"] = true;
                        } else {
                            item["disabled"] = false;
                        }
                    });
                    this.taskList = res.data;
                } else {
                    this.$message.error(`${res.msg}`);
                }
            });
        },
        selectable(row, index) {
            return row.maintenanceStatus == 0;
        },
        //修改车牌号
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
        drawEnded({ type, obj }) {
            this.areaSearchCarModel = true;
            this.areaSearchCarModelLoading = true;
            this.rectangle = obj;
            this.mouseTool.close();
            let bounds = obj.getBounds();
            let northeast = bounds.northeast;
            let southwest = bounds.southwest;
            // 初始化矩形对角线northeast经纬度大大，southwest经纬度小小
            let shapeDetail = [
                { lng: northeast.lng, lat: northeast.lat },
                { lng: southwest.lng, lat: southwest.lat },
            ];
            //判断有哪些车辆在区域内
            let carIds = [];
            //高亮点
            debugger;
            let highlight = this.highLightCarList;
            highlight.forEach((item) => {
                let { lng, lat } = item;
                if (
                    lng > southwest.lng &&
                    lat > southwest.lat &&
                    lng < northeast.lng &&
                    lat < northeast.lat
                ) {
                    carIds.push(item.id);
                }
            });
            debugger;
            //聚合点
            let markersMap = this.markersMap;
            for (let key in markersMap) {
                let { lng, lat } = markersMap[key].getPosition();
                if (
                    lng > southwest.lng &&
                    lat > southwest.lat &&
                    lng < northeast.lng &&
                    lat < northeast.lat
                ) {
                    let car = this.vehicleMaps[key];
                    carIds.push(car.id);
                }
            }
            let param = {
                carIds,
            };
            this.$api
                .findCarInfo(param)
                .then(
                    (res) => {
                        if (res.success == true) {
                            this.innerCar = res.data;
                            this.areaSearchCarModelLoading = true;
                        }
                        this.areaSearchCarModelLoading = false;
                    },
                    (res) => {
                        this.areaSearchCarModelLoading = false;
                    }
                )
                .catch(() => {
                    this.areaSearchCarModelLoading = false;
                });
        },
        //取消画框查车
        cancelAreaSearch() {
            this.areaSearchCarModel = false;
            this.areaSearchCar = false;
            this.innerCar = [];
            this.map.remove(this.rectangle);
        },
        //重新画框查车
        resetAreaSearch() {
            this.areaSearchCarModel = false;
            this.innerCar = [];
            this.map.remove(this.rectangle);
            this.mouseTool.rectangle({
                strokeColor: "blue",
                strokeWeight: 2,
                strokeOpacity: 0.5,
                fillColor: "#fff",
                fillOpacity: 0.5,
                cursor: "pointer",
                //同Polygon的Option设置
            });
        },
        showStatus(status) {
            if (status == 0) {
                // return "待维护";
                return this.$t("maintainRecord.toBeMaintained");
            } else {
                // return "已解决";
                return this.$t("handleFault.resolved");
            }
        },
        showPosition(id) {
            this.$api.getFaultCarLocation({ carId: id }).then((res) => {
                if (res.success == true) {
                    if (res.data.lng && res.data.lat) {
                        this.singlePositionVisible = true;
                        this.$nextTick(() => {
                            this.map2 = new AMap.Map("container", {
                                viewMode: "2D", // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D',
                                zoom: 11, //初始化地图层级
                                resizeEnable: true,
                                //center: [116.397428, 39.90923] //初始化地图中心点
                                center: [res.data.lng, res.data.lat], //初始化地图中心点
                            });
                            let marker = new AMap.Marker({
                                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                                position: [res.data.lng, res.data.lat],
                                //position:[116.397428, 39.90923],
                                anchor: "bottom-center",
                                offset: new AMap.Pixel(0, 0),
                            });
                            this.map2.add(marker);
                            this.map2.setFitView();
                        });
                    } else {
                        // this.$message.error("暂无位置信息");
                        this.$message.error(
                            this.$t("handleFault.noLocationInformation")
                        );
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        closeSinglePosition() {
            if (this.map2) {
                this.map2.destroy(); // 销毁地图实例
                this.map2 = null; // 清除引用，帮助垃圾回收
            }
        },
        //切换标签页
        // handleClick(tab, event) {
        //   //this.$store.dispatch('RemoveCondition')
        //   //this.$store.dispatch('RemoveTime')
        //   //this.activeName = tab.name;
        //   //this.setTableHeight()
        //   //this.handleReset(this.$refs.searchForm);
        //   // this.enableDraw = false;
        //   // if(this.activeName=='first'){
        //   //   this.searchForm.plateNums = []
        //   // }else{
        //   //   this.getFaultCarLocationPage()
        //   // }
        //   // this.search()
        // },
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
        goDetail(data) {
            if (this.activeName == "first") {
                this.$router.push({
                    path: "/maintenanceCenter/handleFault/handleFaultDetail",
                    query: {
                        organizeId: this.params.organizeId,
                        treeLevel: data.treeLevel,
                        plateNum: data.plateNum,
                        faultTypes: this.searchForm.faultTypes.join("~"),
                        time:
                            this.time && this.time.length
                                ? [
                                      TimeUtil.getDateTime(this.time[0]),
                                      TimeUtil.getDateTime(this.time[1]),
                                  ].join("~")
                                : "",
                    },
                });
            } else {
                this.dialogTableVisible = true;
                this.getTableData(data.plateNum);
            }
        },
        getTableData(plateNum) {
            let params = {
                status: 0,
                plateNum: plateNum,
                faultTypes: this.searchForm.faultTypes,
                startTime: this.searchForm.startTime,
                endTime: this.searchForm.endTime,
            };
            this.$api.getFaultDetail(params).then((res) => {
                if (res.success == true) {
                    this.tableDataDialog = res.data.results;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //地图渲染完毕触发
        handler({ BMap, map }) {
            this.zoom = 14;
            // 初始化一个矩形
            this.overlays = [
                { lng: this.center.lng - 0.01, lat: this.center.lat - 0.01 },
                { lng: this.center.lng - 0.01, lat: this.center.lat + 0.01 },
                { lng: this.center.lng + 0.01, lat: this.center.lat + 0.01 },
                { lng: this.center.lng + 0.01, lat: this.center.lat - 0.01 },
            ];
            //初始化矩形对角线
            this.polylinePath = [
                { lng: this.center.lng + 0.01, lat: this.center.lat + 0.01 },
                { lng: this.center.lng - 0.01, lat: this.center.lat - 0.01 },
            ];
        },
        /*更新矩形对角线 */
        updatePolylinePath(e) {
            this.polylinePath = e.target.getPath(); //获取所有折线可编辑点坐标
            //对角线中间有可编辑点，为保证对角线始终是一条直线，我们只取折线的起点和终点两个点
            this.polylinePath = [
                this.polylinePath[0],
                this.polylinePath[this.polylinePath.length - 1],
            ];
            if (!this.polylinePath || !this.polylinePath.length) {
                return;
            }

            let ysMarker = this.polylinePath[0];
            let zxMarker = this.polylinePath[this.polylinePath.length - 1];
            // 根据对角线的两个点，计算出矩形的四点，更新矩形
            this.overlays = [
                {
                    lat: ysMarker.lat,
                    lng: ysMarker.lng,
                },
                {
                    lat: ysMarker.lat,
                    lng: zxMarker.lng,
                },
                {
                    lat: zxMarker.lat,
                    lng: zxMarker.lng,
                },
                {
                    lat: zxMarker.lat,
                    lng: ysMarker.lng,
                },
            ];
            //判断哪些点在区域内
            this.pointSelect();
        },
        pointSelect() {
            this.searchForm.plateNums = [];
            for (let key in this.positionArr) {
                let { lng, lat } = this.positionArr[key];
                if (
                    lng > this.polylinePath[this.polylinePath.length - 1].lng &&
                    lat > this.polylinePath[this.polylinePath.length - 1].lat &&
                    lng < this.polylinePath[0].lng &&
                    lat < this.polylinePath[0].lat
                ) {
                    let car = this.positionArr[key];
                    this.searchForm.plateNums.push(car.plateNum);
                }
            }
            this.getData();
        },
        //根据鼠标移动的起点和终点位置，计算出经纬度差，再给原始矩形的四个点加上经纬度差
        moveEvent(e) {
            if (this.areaDragging) {
                if (
                    this.mouseLocation.lng == 0 &&
                    this.mouseLocation.lat == 0
                ) {
                    this.mouseLocation.lng = e.point.lng;
                    this.mouseLocation.lat = e.point.lat;
                    return;
                }
                let newLng = e.point.lng,
                    newLat = e.point.lat,
                    lngDiff = newLng - this.mouseLocation.lng,
                    latDiff = newLat - this.mouseLocation.lat;
                this.overlays.forEach((item) => {
                    item.lng += lngDiff;
                    item.lat += latDiff;
                    item.lng = Math.floor(item.lng * 100000) / 100000;
                    item.lat = Math.floor(item.lat * 100000) / 100000;
                });
                this.polylinePath.forEach((item) => {
                    item.lng += lngDiff;
                    item.lat += latDiff;
                    item.lng = Math.floor(item.lng * 100000) / 100000;
                    item.lat = Math.floor(item.lat * 100000) / 100000;
                });
                this.mouseLocation.lng = newLng;
                this.mouseLocation.lat = newLat;
                this.pointSelect();
                return;
            }
            if (this.mouseLocation.lng != 0 || this.mouseLocation.lat != 0) {
                this.mouseLocation.lng = 0;
                this.mouseLocation.lat = 0;
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
                let params = Object.assign({}, this.params, this.searchForm);
                this.$api.exportMaintainFault(params).then((res) => {
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
        // // 行合并
        // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        //     if(this.filterTagShow == 0) {
        //         if (row.rowspan != 0) {
        //             if (columnIndex === 0) {
        //                 return {
        //                     rowspan: row.rowspan,
        //                     colspan: 1
        //                 };
        //             }
        //         }else {
        //             if (columnIndex === 0) {
        //                 return {
        //                     rowspan: row.rowspan,
        //                     colspan: 0
        //                 };
        //             }
        //         }
        //     } else {
        //         return {
        //             rowspan: 1,
        //             colspan: 1
        //         };
        //     }
        // },
        // 多选事件
        onSelectionChange(selection) {
            let list = [];
            selection.forEach((i) => {
                list.push({ plateNum: i.plateNum, treeLevel: i.treeLevel });
            });
            this.selectionIds = list;
            console.log(this.selectionIds);
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
        filterTag(value, row) {
            return row.deviceStatus === value;
        },
        filterGpsTag(value, row) {
            return row.gpsStatus === value;
        },
        filterStorageStatusTag(value, row) {
            return row.storageStatus === value;
        },
        filterChange(obj) {
            this.filterTagShow = 0;
            Object.assign(this.filterObj, obj);
            for (let i in this.filterObj) {
                this.filterTagShow += this.filterObj[i].length;
            }
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchPagination.clientHeight -
                111;
            this.treeHeight = document.body.clientHeight - 154;
        },
        setWrap() {
            let scrollHeight = this.$refs.wrap.scrollHeight;
            if (this.$refs.wrap.scrollHeight > 74) {
                this.iconShow = true;
            } else {
                this.iconShow = false;
            }
        },
        //获取地图页的位置信息
        getFaultCarLocationPage() {
            this.positionArr = [];
            this.carLocationParams.organizeId = this.params.organizeId;
            this.carLocationParams = Object.assign(
                {},
                this.searchForm,
                this.params
            );
            this.$api
                .getFaultCarLocationPage(this.carLocationParams)
                .then((res) => {
                    if (res.success == true) {
                        let markerArr = res.data.results;
                        let markerLat = 0;
                        let markerLng = 0;
                        let markerLatAndLng = [];
                        let markers = [];
                        markerArr.forEach((item) => {
                            markerLat += item.lat;
                            markerLng += item.lng;
                            markerLatAndLng.push([item.lat, item.lng]);
                        });
                        if (this.map) {
                            this.map.clearMap();
                            if (markerLatAndLng.length) {
                                //this.map.setCenter([levelMarkerLng,levelMarkerLat])
                                for (
                                    let i = 0;
                                    i < markerLatAndLng.length;
                                    i++
                                ) {
                                    let lnglat = markerLatAndLng[i];
                                    // 创建点实例
                                    let marker = new AMap.Marker({
                                        position: new AMap.LngLat(
                                            lnglat[1],
                                            lnglat[0]
                                        ),
                                        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                                    });
                                    markers.push(marker);
                                    let overlayGroups = new AMap.OverlayGroup(
                                        markers
                                    );
                                    this.map.remove(overlayGroups);
                                    this.map.add(overlayGroups);
                                    this.map.setFitView();
                                }
                            } else {
                                this.map.setCenter([120.5552208, 30.52048536]);
                            }
                        } else {
                            this.map = new AMap.Map("container1", {
                                zoom: 10,
                                //center: [levelMarkerLng, levelMarkerLat],
                                resizeEnable: true,
                            });
                            if (markerLatAndLng.length) {
                                //this.map.setCenter([levelMarkerLng,levelMarkerLat])
                                for (
                                    let i = 0;
                                    i < markerLatAndLng.length;
                                    i++
                                ) {
                                    let lnglat = markerLatAndLng[i];
                                    // 创建点实例
                                    let marker = new AMap.Marker({
                                        position: new AMap.LngLat(
                                            lnglat[1],
                                            lnglat[0]
                                        ),
                                        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                                    });
                                    markers.push(marker);
                                    let overlayGroups = new AMap.OverlayGroup(
                                        markers
                                    );
                                    this.map.remove(overlayGroups);
                                    this.map.add(overlayGroups);
                                    this.map.setFitView();
                                }
                            } else {
                                this.map.setCenter([120.5552208, 30.52048536]);
                            }
                        }
                        this.mouseTool = new AMap.MouseTool(this.map);
                        this.mouseTool.on("draw", this.drawEnded);
                    } else {
                        if (this.map) {
                            this.map.clearMap();
                        }
                        this.$message.error(res.msg);
                    }
                });
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
            this.$store.dispatch("SetCondtion", this.searchForm);
            this.$store.dispatch("SetTime", this.time);
            this.getData();
            //this.getFaultCarLocation()
        },
        //获取表格数据
        getData() {
            this.searchLoading = true;
            if (this.time && this.time.length > 0) {
                this.searchForm.startTime = TimeUtil.getDateTime(this.time[0]);
                this.searchForm.endTime = TimeUtil.getDateTime(this.time[1]);
            } else {
                this.searchForm.startTime = "";
                this.searchForm.endTime = "";
            }

            if (!this.enableDraw) {
                this.searchForm.plateNums = [];
            }
            let params = Object.assign({}, this.searchForm, this.params);
            this.$api.getMaintainFaultPage(params).then((res) => {
                if (res.success == true) {
                    let listData =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : listData;
                    //为数据添加rowspan字段，方便后面合并数据
                    // listData.forEach(item => {
                    //     item.rowspan = listData.filter(function(i){return i.plateNum == item.plateNum}).length;
                    // });
                    // for(let i=1;i<listData.length;i++) {
                    //     if(listData[i].plateNum ==listData[i-1].plateNum){
                    //         listData[i].rowspan = 0
                    //     }
                    // }
                    this.tableData = listData;
                    this.total = res.data.totalRecords;
                    this.selection = [];
                    this.$nextTick(() => {
                        this.setTableHeight();
                    });
                } else {
                    this.$message.error(res.msg);
                }
                this.searchLoading = false;
            });
        },
        //切换每页条数时的回调，返回切换后的每页条数
        PageSizeChange(limit) {
            this.params.pageSize = limit;
        },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
                (this.searchForm.plateNum = ""),
                    (this.searchForm.faultTypes = []);
                this.searchForm.plateNums = [];
                this.$store.dispatch("SetCondtion", this.searchForm);
            }
            this.searchForm.faultTypes = [];
            (this.time = [
                new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                new Date(),
            ]),
                this.$store.dispatch("RemoveCurrentType");
        },
        handleNodeClick(data) {
            console.log(data);
            this.$store.dispatch("RemoveCurrentType");
            this.moreHidden = false;
            this.params.organizeId = data.id;
            this.params.treeLevel = data.treeLevel;

            this.params.currentPage = 1;
            this.searchForm.plateNum = "";
            this.$store.dispatch("SetDeviceFaultId", data.id);
            this.search();
            if (this.activeName == "second") {
                this.getFaultCarLocationPage();
            }
            //this.getProductList();
            //this.getFaultCarLocation();
        },
        //获取树结构
        getFaultManagementOrgTree(type) {
            this.searchLoading = true;
            this.treeData = [];
            this.expandedList = [];
            this.$api.getOrgTree().then((res) => {
                this.setTableHeight();
                if (res.success == true) {
                    this.treeData = res.data;
                    if (res.data && res.data.length > 0) {
                        this.params.organizeId = this.$store.state.tree
                            .devicFaultId
                            ? this.$store.state.tree.devicFaultId
                            : res.data[0].id;
                        this.params.treeLevel = res.data[0].treeLevel;
                        this.searchForm = this.$store.state.tree.searchForm
                            ? this.$store.state.tree.searchForm
                            : this.searchForm;
                        this.search();
                        this.$nextTick(() => {
                            this.treeData.forEach((m) => {
                                this.expandedList.push(m.id);
                            });
                            this.$refs["tree"].setCurrentKey(
                                this.params.organizeId
                            );
                            this.getAllFaultType();
                        });
                        //this.getFaultCarLocation();
                    }
                } else {
                    this.$message.error(res.msg);
                }
                this.searchLoading = false;
            });
        },
        //获取待处理故障类型
        getAllFaultType() {
            this.$api
                .getAllSubscribeFaultType({
                    organizeId: this.params.organizeId,
                })
                .then((res) => {
                    if (res.success == true) {
                        let allFaultType = res.data;
                        allFaultType.map((i) => {
                            let flag = true;
                            let indexCurrent;
                            this.allFaultType.forEach((item, index) => {
                                if (i.faultGroup == -item.id) {
                                    flag = false;
                                    indexCurrent = index;
                                }
                            });
                            if (flag) {
                                let obj = {};
                                obj.id = -i.faultGroup;
                                obj.label = i.faultGroupDesc;
                                obj.children = [];
                                obj.children.push({
                                    id: i.faultType,
                                    label: i.faultName,
                                });
                                this.allFaultType.push(obj);
                            } else {
                                this.allFaultType[indexCurrent].children.push({
                                    id: i.faultType,
                                    label: i.faultName,
                                });
                            }
                        });
                        setTimeout(() => {
                            //设置延迟执行
                            this.searchForm.faultTypes.forEach(
                                (item, index) => {
                                    this.faultTypeList.push(item);
                                }
                            );
                            this.searchForm.faultTypes = this.faultTypeList;
                        }, 100);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
    },
    mounted() {
        let that = this;
        this.setWrap();
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
                this.setWrap();
            })();
        };
    },
    created() {
        this.getFaultManagementOrgTree(0);
        this.getRequirementFiles();
    },
};
</script>
<style lang="less" scoped>
#container {
    //width: 100%;
    height: 300px;
}
.searchBottom {
    margin-bottom: 12px;
}
.wrap {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .draw {
            display: flex;
            .drawPosition {
                margin-top: 2rem;
            }
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

.loading_ {
    pointer-events: none;
}

.el-table__empty-block {
    height: 300px !important;
}

.red {
    color: red;
}
.green {
    color: limegreen;
}
</style>
