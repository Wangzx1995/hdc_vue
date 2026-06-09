<template>
    <div class="wrap">
        <div class="wrap-top">
            <div class="m-t" ref="wrap">
                <el-form
                    ref="form"
                    label-position="top"
                    :model="searchForm"
                    inline
                >
                    <!-- 所属组织 -->
                    <el-form-item
                        :label="$t('common.orgPath')"
                        prop="organizeId"
                    >
                         <TreeSelect
                            :placeholder="$t('common.select')"
                            ref="TreeSelect"
                            :treeData="treeData"
                            style="width: 300px"
                            filter
                            v-model="searchForm.organizeId"
                            :props="defaultProps"
                            @node-click="nodeClick"
                        >
                        </TreeSelect>
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
                                v-for="(item, index) in deviceModelList"
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
                    <!-- 车牌号 -->
                    <el-form-item :label="$t('common.plateNum')" prop="carId">
                        <el-select
                            :remote-method="remoteMethod"
                            :loading="loading"
                            filterable
                            style="width: 220px"
                            reserve-keyword
                            remote
                            clearable
                            collapse-tags
                            :placeholder="
                                $t('devLog.enterThreeLicensePlateNumbers')
                            "
                            v-model="searchForm.carId"
                        >
                            <el-option
                                v-for="item in searchForm.plateArr"
                                :key="item.id"
                                :value="item.id"
                                :label="item.plateNum"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div class="m-t-lg flex">
                <el-button
                    class=""
                    type="primary"
                    :disabled="searchLoading"
                    :loading="searchLoading"
                    @click="getData(true)"
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
            </div>
        </div>
        <div class="top-bottom">
            <el-button
                type="primary"
                @click="uploadLog"
                :disabled="!selection.length"
            >
                <!-- 批量上传日志 -->
                {{ $t("devLog.batchUploadLog") }}
            </el-button>
        </div>
        <div
            ref="searchAlert"
            style="margin: 14px 0"
            class="wrap-top"
            v-show="selection.length"
        >
            <!-- 升级支持离线托管，设备在线时平台自动下发升级任务，无需等待！ -->
            <el-alert
                :title="$t('devLog.batchUploadLogAlert')"
                :closable="false"
                type="success"
                simple
                @close="setTableHeight"
                class="select-alert"
            >
                <div slot="title" class="alert-title">
                    <div>
                        <span>
                            {{ $t("devLog.selectTableMsg1") }}
                            {{ selection.length }}
                            {{ $t("devLog.selectTableMsg2") }}
                        </span>
                        <el-button type="text" @click="openSelection">
                            <!-- 查看 -->
                            {{ $t("devLog.selectTableMsg3") }}
                        </el-button>
                        <el-button type="text" @click="clearSelection">
                            <!-- 取消选择 -->
                            {{ $t("devLog.selectTableMsg4") }}
                        </el-button>
                    </div>
                </div>
            </el-alert>
        </div>
        <el-table
            @selection-change="handleSelectionChange"
            v-loading="searchLoading"
            :element-loading-text="$t('common.desperatelyLoading')"
            element-loading-color="#007213"
            :height="tableHeight"
            :data="tableData"
            force-scroll="horizontal"
            row-key="deviceCode"
            style="width: 100%"
            ref="table"
            border
            stripe
        >
            <el-table-column
                type="selection"
                :reserve-selection="true"
            ></el-table-column>
            <!-- 车牌号 -->
            <el-table-column
                prop="plateNum"
                :label="$t('common.plateNum')"
                width="140px"
            ></el-table-column>
            <!-- 所属组织 -->
            <el-table-column
                prop="orgPath"
                :label="$t('common.orgPath')"
                show-overflow-tooltip
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
            >
            </el-table-column>
            <!-- 设备序列号 -->
            <el-table-column
                prop="deviceSerialNum"
                :label="$t('common.deviceSerialNum')"
            >
            </el-table-column>
            <!-- 终端手机号 -->
            <el-table-column prop="deviceCode" :label="$t('common.deviceCode')">
            </el-table-column>
            <!-- 设备状态 -->
            <el-table-column :label="$t('common.deviceStatus')" width="100px">
                <template slot-scope="scope">
                    <div>
                        <el-tag
                            type="success"
                            v-if="scope.row.onlineStatus == 1"
                        >
                            <!-- 在线 -->
                            {{ $t("common.deviceStatus_1") }}
                        </el-tag>
                        <el-tag
                            type="warning"
                            v-else-if="scope.row.onlineStatus == 2"
                        >
                            <!-- 休眠 -->
                            {{ $t("common.deviceStatus_2") }}
                        </el-tag>
                        <el-tag
                            type="info"
                            v-else-if="scope.row.onlineStatus == 0"
                        >
                            <!-- 离线 -->
                            {{ $t("common.deviceStatus_0") }}
                        </el-tag>
                        <span v-else>--</span>
                    </div>
                </template>
            </el-table-column>
            <!-- 最近一次上传时间 -->
            <el-table-column :label="$t('devLog.lastUploadTime')" width="200px">
                <template slot-scope="scope">
                    <span v-if="scope.row.lastUploadTime">
                        {{
                            $moment(scope.row.lastUploadTime).format(
                                "YYYY-MM-DD HH:mm:ss"
                            )
                        }}
                    </span>
                    <span v-else> -- </span>
                </template>
            </el-table-column>
        </el-table>
        <div>
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
        <el-dialog
            :title="`${$t('devLog.selectTableMsg3')}(${selection.length})`"
            :visible.sync="selectionVisible"
            :width="'1200px'"
        >
            <div v-if="selectionVisible" class="wrap selection-box">
                <div class="wrap-top" ref="searchSelectionBox">
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
                <div>
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
                        <el-table-column label="序号" type="index" width="50">
                        </el-table-column>
                        <!-- 车牌号 -->
                        <el-table-column
                            prop="plateNum"
                            :label="$t('common.plateNum')"
                            width="140px"
                        ></el-table-column>
                        <!-- 所属组织 -->
                        <el-table-column
                            prop="orgPath"
                            :label="$t('common.orgPath')"
                            show-overflow-tooltip
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
                        >
                        </el-table-column>
                        <!-- 设备序列号 -->
                        <el-table-column
                            prop="deviceSerialNum"
                            :label="$t('common.deviceSerialNum')"
                        >
                        </el-table-column>
                        <!-- 终端手机号 -->
                        <el-table-column
                            prop="deviceCode"
                            :label="$t('common.deviceCode')"
                        >
                        </el-table-column>
                        <!-- 操作 -->
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
                <div class="p-x-md wrap-bottom">
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
        <!-- 上传日志 -->
        <el-dialog
            :title="$t('devLog.uploadLogs')"
            :visible.sync="uploadLogVisible"
            :close-on-click-modal="false"
            :width="'600px'"
            :custom-class="'upload-log-dialog'"
        >
            <upload-log
                :key="timer"
                @cancel="cancel"
                :deviceCode="ids"
                :business="'DEVICE_LOG_ADD_TASK_BATCH'"
            ></upload-log>
        </el-dialog>
    </div>
</template>

<script>
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import uploadLog from "./uploadLog";
import "@/components/hui-pro/tree-select/theme/index.scss";
export default {
    name: "maintainRecord",
    components: {
        TreeSelect,
        uploadLog,
    },
    data() {
        return {
            timer: null,
            uploadLogVisible: false,
            loading: false,
            searchLoading: false,
            searchForm: {
                organizeId: "",
                carId: "",
                plateNum: "",
                softwareVersion: "",
                deviceModelCode: "",
                plateArr: [],
                plateJson: {},
            },
            deviceModelList: [],
            defaultProps: {
                children: "children",
                label: "name",
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },
            total: 0,
            tableHeight: 500,
            treeData: [],
            tableData: [],
            query: "",
            ids: [],
            selectionVisible: false,
            selection: [],
            selectionParams: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },
            selectionData: [],
            selectionForm: {
                plateNum: "",
            },
        };
    },
    watch: {
        "searchForm.carId": {
            handler(val) {
                if (!val && this.query.length < 3) {
                    this.searchForm.plateArr = [];
                }
                this.searchForm.plateNum =
                    this.searchForm.plateJson[this.searchForm.carId] || "";
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val.length < 3 && !this.searchForm.plateNum) {
                    this.searchForm.plateArr = [];
                }
            },
            deep: true,
        },
    },
    methods: {
        getPlateNumList(params) {
            this.loading = true;
            this.$api.getCarList(params).then((res) => {
                this.searchForm.plateArr = res.data.carList;
                if (this.searchForm.plateArr.length) {
                    res.data.carList.forEach((item) => {
                        this.searchForm.plateJson[item.id] = item.plateNum;
                    });
                }
                this.loading = false;
            });
        },
        remoteMethod(query) {
            this.query = query;
            if (query.length >= 3) {
                this.getPlateNumList({ plateNum: query });
            }
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getData();
        },
        handleSelectionChange(selection) {
            this.ids = [];
            selection.forEach((item) => {
                this.ids.push(item.deviceCode);
            });
            this.selection = selection;
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        // 重置表单
        handleReset(ref) {
            this.$refs["form"].resetFields();
            this.searchForm.organizeId = this.treeData[0].id;
        },
        //获取当前用户的组织
        getOrgTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = res.data;
                    this.$nextTick(() => {
                        this.searchForm.organizeId = res.data[0].id;
                        this.getDeviceModelList();
                        this.getData();
                    });
                }
            });
        },
        //查询
        getData(isReset) {
            if (isReset) {
                this.params.currentPage = 1;
            }
            this.searchLoading = true;
            let params = {};
            let carParam = Object.assign(params, this.searchForm, this.params);
            delete carParam.plateArr;
            delete carParam.plateJson;
            this.$api
                .getDevLogDevicePage(carParam)
                .then((res) => {
                    if (res.success == true) {
                        this.tableData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableData;
                        this.total = res.data.totalRecords;
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.searchLoading = false;
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                166 -
                140 -
                56 -
                (this.selection.length ? 48 : 0);
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
                this.$refs.table.selection.find((item) => item.id === row.id),
                false
            );
            this.selectionData.map((item, index) => {
                if (item.deviceCode === row.deviceCode) {
                    this.selectionData.splice(index, 1);
                }
            });
            this.selection.map((item, index) => {
                if (item.deviceCode === row.deviceCode) {
                    this.selection.splice(index, 1);
                }
            });
            if (this.selection.length === 0) {
                this.selectProductKey = "";
            }
            let list = [];
            this.selection.forEach((i) => {
                list.push(i.deviceCode);
            });
            this.selectionIds = list;
            // this.$refs.table.toggleRowSelection(row, false);
        },
        handleSelectionSizeChange(val) {
            this.selectionParams.pageSize = val;
        },
        handleSelectionCurrentChange(val) {
            this.selectionParams.currentPage = val;
        },
        uploadLog() {
            this.timer = new Date().getTime();
            this.uploadLogVisible = true;
        },
        cancel() {
            this.uploadLogVisible = false;
        },
        nodeClick() {
            this.getDeviceModelList();
            this.searchForm.deviceModelCode = "";
        },
    },
    mounted() {
        // this.getDeviceModelList();
        const that = this;
        window.onresize = () =>
            (() => {
                that.setTableHeight();
            })();
    },
    created() {
        this.setTableHeight();
        this.getOrgTree();
    },
};
</script>

<style lang="less" scoped>
.wrap {
    height: 100%;
    padding: 0px 16px;
    .top-bottom {
        margin-bottom: 1rem;
    }
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .flex {
            display: flex;
        }
    }
    .wrap-bottom {
        height: 4rem;
        border-top: 1px solid #e4e4e4;
    }
    .select-alert {
        background: #e6f7ff !important;
        // border: 1px solid rgba(145, 213, 255, 1) !important;
        border-radius: 2px;
        color: #000000;
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
}
</style>
