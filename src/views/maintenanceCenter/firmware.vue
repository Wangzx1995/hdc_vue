<template>
    <div class="firmware-box">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="p-x">
            <!-- 主机 -->
            <el-tab-pane :label="$t('firmware.host')" name="main"></el-tab-pane>
            <!-- 外设 -->
            <el-tab-pane
                :label="$t('firmware.peripherals')"
                name="peripheral"
            ></el-tab-pane>
        </el-tabs>
        <div ref="searchBox" class="search-module">
            <div class="search-form-content">
                <el-form :model="searchForm" ref="searchForm" inline>
                    <!-- 设备型号 -->
                    <el-form-item
                        :label="$t('common.deviceModelCode')"
                        prop="deviceModelCode"
                        v-if="activeName === 'main'"
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
                    <!-- 外设名称 -->
                    <el-form-item
                        :label="$t('firmware.peripheralName')"
                        prop="peripheralType"
                        v-else
                    >
                        <el-select
                            style="width: 100%"
                            v-model="searchForm.peripheralType"
                            :placeholder="$t('common.select')"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in deviceTypeList"
                                :key="index"
                                :value="item.sysDictCode"
                                :label="item.sysDictName"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 是否分享给子账号 -->
                    <el-form-item
                        :label="$t('firmware.shareWithSubAccount')"
                        prop="shareOpen"
                        v-if="isAdmin"
                    >
                        <el-select v-model="searchForm.shareOpen" clearable>
                            <el-option
                                value=""
                                :label="$t('common.all')"
                            ></el-option>
                            <el-option
                                :value="Number(0)"
                                :label="$t('common.not')"
                            ></el-option>
                            <el-option
                                :value="Number(1)"
                                :label="$t('common.yes')"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 备注 -->
                    <el-form-item :label="$t('firmware.notes')" prop="remark">
                        <el-input
                            clearable
                            v-model="searchForm.remark"
                            :placeholder="$t('common.input')"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <el-button
                    type="primary"
                    :loading="searchLoading"
                    :disabled="searchLoading"
                    @click="
                        params.currentPage = 1;
                        search();
                        newFirmwareGetOmsProjectFileSpace();
                    "
                >
                    <!-- 查询 -->
                    {{ $t("common.search") }}
                </el-button>
                <el-button type="default" @click="handleReset()">
                    <!-- 清除条件 -->
                    {{ $t("common.reset") }}
                </el-button>
            </div>
        </div>
        <div ref="searchBtn" class="p-x">
            <el-button
                type="primary"
                @click="openFirmwareUpload"
                v-btn="'firmwareUploadFirmware'"
            >
                <!-- 上传固件包 -->
                {{ $t("firmware.uploadFirmwarePackage") }}
            </el-button>
            <el-button
                type="default"
                @click="beforeDeleteSelectFirmware"
                v-btn="'firmwareDeleteFirmware'"
            >
                <!-- 删除 -->
                {{ $t("common.delete") }}
            </el-button>
        </div>
        <div class="m-b m-y p-x">
            <el-table
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :data="tableData"
                @selection-change="onSelectionChange"
                :height="tableHeight"
                border
                stripe
            >
                <el-table-column
                    fixed
                    type="selection"
                    :selectable="selectable"
                ></el-table-column>
                <!-- 上传时间 -->
                <el-table-column
                    fixed
                    prop="createTime"
                    :label="$t('devLog.uploaded')"
                    min-width="165px"
                >
                    <template slot-scope="scope">
                        {{
                            $moment(scope.row.createTime).format(
                                "YYYY-MM-DD HH:mm:ss"
                            )
                        }}
                    </template>
                </el-table-column>
                <!-- 设备型号 -->
                <el-table-column
                    prop="deviceModelCode"
                    :label="$t('common.deviceModelCode')"
                    min-width="160px"
                    :show-overflow-tooltip="true"
                    v-if="activeName === 'main'"
                >
                </el-table-column>
                <!-- 接入协议 -->
                <el-table-column
                    prop="protocolName"
                    :label="$t('common.protocolName')"
                    min-width="100px"
                    :show-overflow-tooltip="true"
                    v-if="activeName === 'main'"
                >
                </el-table-column>
                <!-- '设备版本号' : '外设版本号' -->
                <el-table-column
                    prop="firmwareVersion"
                    :label="
                        activeName === 'main'
                            ? $t('firmware.deviceVersionNumber')
                            : $t('firmware.peripheralVersionNumber')
                    "
                    min-width="165px"
                    key="firmwareVersion"
                ></el-table-column>
                <!-- 是否分享给子账号 -->
                <el-table-column
                    :label="$t('firmware.shareWithSubAccount')"
                    min-width="160px"
                    :render-header="renderHeader"
                    v-if="isAdmin"
                >
                    <template slot-scope="scope">
                        <h-switch
                            v-model="scope.row.shareOpen"
                            :active-value="1"
                            :inactive-value="0"
                            :before-change="
                                (value, done) => beforeChange(value, done)
                            "
                            @change="enableChange(scope.row)"
                        >
                        </h-switch>
                    </template>
                </el-table-column>
                <!-- 外设名称 -->
                <el-table-column
                    prop="peripheralTypeName"
                    :label="$t('firmware.peripheralName')"
                    min-width="160px"
                    key="peripheralTypeName"
                    v-if="activeName === 'peripheral'"
                ></el-table-column>
                <!-- 上传人员 -->
                <el-table-column
                    prop="createName"
                    :label="$t('firmware.uploadPersonnel')"
                    min-width="100px"
                ></el-table-column>
                <!-- 大小(MB) -->
                <el-table-column
                    prop="fileSize"
                    :label="$t('firmware.size') + '(MB)'"
                    min-width="100px"
                    align="right"
                >
                    <template slot-scope="scope">
                        <div v-if="scope.row.fileSize">
                            {{
                                Math.ceil(
                                    (scope.row.fileSize / 1024 / 1024) * 100
                                ) / 100
                            }}
                        </div>
                        <div v-else>--</div>
                    </template>
                </el-table-column>
                <!-- 固件名称 -->
                <el-table-column
                    prop="originalFileName"
                    :label="$t('firmware.firmwareName')"
                    min-width="160px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 备注 -->
                <el-table-column
                    prop="remark"
                    :label="$t('firmware.notes')"
                    fixed="right"
                    show-overflow-tooltip
                    min-width="160px"
                ></el-table-column>
                <!-- 操作 -->
                <el-table-column
                    fixed="right"
                    :label="$t('common.operate')"
                    width="100px"
                >
                    <template slot-scope="scope">
                        <a
                            @click="downLoad(scope.row.downloadUrl)"
                            class="m-r-sm"
                            :disabled="
                                scope.row.downloadUrl &&
                                scope.row.downloadUrl.indexOf('ftp') != -1
                            "
                            v-btn="'firmwareDownloadFirmware'"
                        >
                            <!-- 下载 -->
                            {{ $t("common.download") }}
                        </a>
                        <!-- <span>|</span> -->
                        <a
                            v-if="
                                isAdmin ||
                                (!isAdmin && scope.row.shareOpen === 0)
                            "
                            @click="beforeDeleteFirmware(scope.row.id)"
                            v-btn="'firmwareDeleteFirmware'"
                        >
                            <!-- 删除 -->
                            {{ $t("common.delete") }}
                        </a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div ref="searchPagination" class="wrap-bottom m-x">
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
            <div class="progress-box">
                <span>
                    <!-- 存储空间 -->
                    {{ $t("firmware.storage") }}
                </span>
                <el-progress
                    :stroke-width="8"
                    :percentage="
                        omsProjectFileSpace.percentage > 100
                            ? 100
                            : omsProjectFileSpace.percentage
                    "
                    :color="customColorMethod"
                ></el-progress>
                <span>{{ omsProjectFileSpace.totalFileSize }}</span>
                <span> / </span>
                <span>{{ omsProjectFileSpace.projectFileSpaceSize }}G</span>
                <!-- 您可免费存储固件包的空间大小，请及时维护固件包 -->
                <el-tooltip
                    :content="$t('firmware.storageContent')"
                    placement="left"
                >
                    <i class="el-icon-warning-outline"></i>
                </el-tooltip>
            </div>
        </div>
        <div v-if="showFirmwareUpload">
            <FirmwareUpload
                :defaultType="activeName"
                @close="closeFirmwareUpload"
                :visible="firmwareVisible"
                :isAdmin="isAdmin"
                type="big"
            ></FirmwareUpload>
        </div>
    </div>
</template>

<script>
import FirmwareUpload from "@/components/coreManage/firmwareUpload";
//import params from './configurationDetail/components/audioVedioSettings/params';
export default {
    name: "firmware",
    components: { FirmwareUpload },
    data() {
        return {
            omsProjectFileSpace: {
                totalFileSize: 0,
                projectFileSpaceSize: 0,
                percentage: 0,
            },
            activeName: "main",
            closeFlag: false,
            isAdmin: false,
            searchLoading: true,
            tableHeight: 500,
            selection: [],
            firmwareVisible: false,
            showFirmwareUpload: false,
            deviceModelList: [],
            searchForm: {
                peripheralType: "",
                firmwareType: "",
                shareOpen: "",
                deviceModelCode: "",
                remark: "",
            },
            tableData: [],
            params: {
                currentPage: 1,
                pageSize: 20,
                orderColumn: "createTime", //排序列
                orderDir: "desc", //排序方向
            },
            total: 0,
            dialogVisible: false,
            deviceTypeList: [],
        };
    },
    methods: {
        //自定义表头
        renderHeader(h, { column, $index }) {
            return h("span", { class: "poptip" }, [
                h("span", this.$t("firmware.shareWithSubAccount")), //表格当前列标题
                h(
                    "Poptip",
                    {
                        props: {
                            placement: "top",
                            width: "80px",
                            trigger: "hover",
                            offset: 2,
                            transfer: true,
                            title: this.$t("firmware.shareWithSubAccount"),
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
                            // "分享后所有子账号均能查看到该固件包"
                            this.$t("firmware.shareWithSubAccountSec")
                        ),
                    ]
                ),
            ]);
        },
        selectable(row, index) {
            return this.isAdmin || (!this.isAdmin && row.shareOpen === 0);
        },
        openFirmwareUpload() {
            this.showFirmwareUpload = true;
            this.firmwareVisible = true;
        },
        closeFirmwareUpload(data) {
            this.firmwareVisible = false;
            setTimeout(() => {
                this.showFirmwareUpload = false;
            }, 300);
            if (data) {
                this.search();
                this.newFirmwareGetOmsProjectFileSpace();
            }
        },
        /* 跳转至小版本管理页 */
        goMinorVersion(id, deviceModelCode, deviceType, firmwareType) {
            this.$nextTick(() => {
                if (this.$route.fullPath == "/maintenanceCenter/firmware") {
                    this.$router.push({
                        path: "/maintenanceCenter/firmware/minorVersion",
                        query: {
                            id: id,
                            deviceModelCode: deviceModelCode,
                            deviceType: deviceType,
                            firmwareType: firmwareType,
                        },
                    });
                } else {
                    this.$router.push({
                        path: "/maintenanceCenter/deviceUpgrade/firmware/minorVersion",
                        query: {
                            id: id,
                            deviceModelCode: deviceModelCode,
                            deviceType: deviceType,
                            firmwareType: firmwareType,
                        },
                    });
                }
            });
        },
        /*获取固件信息列表*/
        getFirmware(params) {
            this.searchLoading = true;
            this.$api
                .newFirmwarePage(params)
                .then((res) => {
                    // console.log(res.data.results)
                    if (res.success == true) {
                        this.tableData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableData;
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
        // 表格查询
        search() {
            if (this.$route.path.indexOf("deviceUpgrade") < 0) {
                this.$store.dispatch("SetCondtion", this.searchForm);
            }
            let params = Object.assign(this.params, this.searchForm, {
                type: this.activeName,
            });
            this.getFirmware(params);
        },
        // 获取设备型号下拉列表数据
        getDeviceModelList() {
            this.$api.getProductList_upgrade().then((res) => {
                if (res.success == true) {
                    this.deviceModelList = [
                        {
                            fieldNameEN: "",
                            fieldNameCN: this.$t("common.all"),
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
        // 删除固件
        beforeDeleteFirmware(id) {
            this.$api
                .newFirmwareGetFirmwaresUseInfo({ ids: [id] })
                .then((res) => {
                    if (res.success == true) {
                        let sum = res.data.reduce((prev, cur) => {
                            return prev + cur.useNum;
                        }, 0);
                        if (sum > 0) {
                            this.secondaryConfirmation(sum, [id]);
                        } else {
                            this.$confirm(
                                // "删除固件后，无法恢复，是否确认删除？",
                                this.$t("firmware.beforeDeleteFirmwareText1") +
                                    "？",
                                // "确定要删除该固件吗？",
                                this.$t("firmware.beforeDeleteFirmwareText2") +
                                    "？",
                                {
                                    confirmButtonText: this.$t("common.ok"),
                                    cancelButtonText: this.$t("common.cancel"),
                                    type: "warning",
                                }
                            )
                                .then(() => {
                                    this.deleteFirmware([id]);
                                })
                                .catch(() => {});
                        }
                    }
                });
        },
        secondaryConfirmation(sum, ids, falg) {
            this.$confirm(
                // `当前有<span style='color:#f56c6c'>${sum}</span>台设备正在使用${
                //     falg ? "这些" : "此"
                // }固件包升级，删除后可能会导致升级失败，是否确认删除？`,
                `${this.$t(
                    "firmware.secondaryConfirmationText1"
                )}<span style='color:#f56c6c'>${sum}</span>${this.$t(
                    "firmware.secondaryConfirmationText2"
                )}${
                    falg
                        ? this.$t("firmware.secondaryConfirmationText3")
                        : this.$t("firmware.secondaryConfirmationText4")
                }${this.$t("firmware.secondaryConfirmationText5")}？`,
                this.$t("firmware.secondaryConfirmationText6") + "？",
                {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: this.$t(
                        "firmware.secondaryConfirmationText7"
                    ), //仍然删除
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.deleteFirmware(ids);
                })
                .catch(() => {});
        },
        deleteFirmware(ids) {
            this.$api.newFirmwareDelFirmwares({ ids: ids }).then((res) => {
                if (res.success == true) {
                    // 固件删除成功！
                    this.$message.success(
                        this.$t("firmware.deleteFirmwareText1")
                    );
                    this.search();
                    this.newFirmwareGetOmsProjectFileSpace();
                } else {
                    // 固件删除失败
                    this.$message.error(
                        this.$t("firmware.deleteFirmwareText2") + res.msg
                    );
                }
                this.$api.eventTrackTrigger({
                    menu: "FIRMWARE_MANAGE",
                    business: "FIRMWARE_DELETE",
                    eventResult: res.success,
                });
            });
        },

        // 批量删除固件
        beforeDeleteSelectFirmware() {
            let ids = [];
            this.selection.forEach((i) => {
                ids.push(i.id);
            });
            if (this.selection.length == 0) {
                // 请先选择固件！
                this.$message.warning(this.$t("firmware.firstSelectFirmware"));
                return;
            }
            this.$api
                .newFirmwareGetFirmwaresUseInfo({ ids: ids })
                .then((res) => {
                    if (res.success == true) {
                        let sum = res.data.reduce((prev, cur) => {
                            return prev + cur.useNum;
                        }, 0);
                        if (sum > 0) {
                            this.secondaryConfirmation(sum, ids, true);
                        } else {
                            this.$confirm(
                                // "删除固件后，无法恢复，是否确认删除？",
                                this.$t("firmware.beforeDeleteFirmwareText1") +
                                    "？",
                                // "确定要批量删除这些固件吗？",
                                this.$t("firmware.deleteTheseFirmware") + "？",
                                {
                                    confirmButtonText: this.$t("common.ok"),
                                    cancelButtonText: this.$t("common.cancel"),
                                    type: "warning",
                                }
                            )
                                .then(() => {
                                    this.deleteFirmware(ids);
                                })
                                .catch(() => {});
                        }
                    }
                });
        },
        // 多选事件
        onSelectionChange(selection) {
            this.selection = selection;
        },
        handleReset() {
            this.$refs.searchForm.resetFields();
            this.searchForm.shareOpen = "";
            if (this.$route.path.indexOf("deviceUpgrade") < 0) {
                this.$store.dispatch("SetCondtion", this.searchForm);
            }
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.search();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.search();
        },
        downLoad(url) {
            if (url.indexOf("ftp") != -1) {
                window.open(url);
            } else {
                let iframe = document.createElement("iframe");
                iframe.src = url;
                iframe.style.display = "none";
                document.body.appendChild(iframe);
            }
            this.$api.eventTrackTrigger({
                menu: "FIRMWARE_MANAGE",
                business: "FIRMWARE_DOWNLOAD",
                eventResult: true,
            });
            // window.open(url);
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchPagination.clientHeight -
                154;
        },
        getUserTypeInfo() {
            this.$api.getUserTypeInfo().then((res) => {
                if (res.success == true) {
                    this.isAdmin = res.data.type === 2;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        getDeviceType() {
            this.$api.newFirmwareGetPeripheralList().then((res) => {
                if (res.success == true) {
                    this.deviceTypeList = [
                        { sysDictCode: "", sysDictName: "全部" },
                    ];
                    res.data.forEach((item) => {
                        this.deviceTypeList.push(item);
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //关闭提示文案
        closeAlert() {
            this.closeFlag = true;
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        beforeChange(value, done) {
            this.$confirm(
                value
                    ? this.$t("firmware.beforeChangeText1") //"关闭分享给子账号，当前账号的子账号都无法看到此固件包"
                    : this.$t("firmware.beforeChangeText2"), //"开启分享给子账号，当前账号的子账号都能使用到此固件包",
                //   `确定要${value ? "关闭" : "开启"}分享给子账号吗？`,
                `${this.$t("firmware.beforeChangeText3")}${
                    value
                        ? this.$t("firmware.beforeChangeText4")
                        : this.$t("firmware.beforeChangeText5")
                }${this.$t("firmware.beforeChangeText6")}？`,
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    done();
                })
                .catch(() => {});
        },
        enableChange(obj) {
            if (obj.shareOpen == 1) {
                this.$api
                    .newFirmwareShareOpen({
                        ids: [obj.id],
                        shareOpen: obj.shareOpen,
                    })
                    .then((res) => {
                        if (res.success == true) {
                            // 修改成功
                            this.$message.success(
                                this.$t("common.modifiedSuccess")
                            );
                        }
                    });
            } else {
                this.$api
                    .newFirmwareShareClose({
                        ids: [obj.id],
                    })
                    .then((res) => {
                        if (res.success == true) {
                            // 修改成功
                            this.$message.success(
                                this.$t("common.modifiedSuccess")
                            );
                        }
                    });
            }
        },
        handleClick() {
            this.handleReset();
            this.params.currentPage = 1;
            this.search();
        },
        newFirmwareGetOmsProjectFileSpace() {
            this.$api.newFirmwareGetOmsProjectFileSpace().then((res) => {
                if (res.success == true) {
                    this.omsProjectFileSpace = {
                        totalFileSize: 0,
                        projectFileSpaceSize:
                            Math.ceil(
                                (res.data.projectFileSpaceSize /
                                    1024 /
                                    1024 /
                                    1024) *
                                    10
                            ) / 10,
                        percentage: Math.ceil(
                            (res.data.totalFileSize /
                                res.data.projectFileSpaceSize) *
                                100
                        ),
                    };
                    if (res.data.totalFileSize < 1024) {
                        this.omsProjectFileSpace.totalFileSize =
                            res.data.totalFileSize + "B";
                    } else if (
                        res.data.totalFileSize >= 1024 &&
                        res.data.totalFileSize < 1024 * 1024
                    ) {
                        this.omsProjectFileSpace.totalFileSize =
                            Math.floor((res.data.totalFileSize / 1024) * 10) /
                                10 +
                            "KB";
                    } else if (
                        res.data.totalFileSize >= 1024 * 1024 &&
                        res.data.totalFileSize < 1024 * 1024 * 1024
                    ) {
                        this.omsProjectFileSpace.totalFileSize =
                            Math.floor(
                                (res.data.totalFileSize / 1024 / 1024) * 10
                            ) /
                                10 +
                            "MB";
                    } else if (res.data.totalFileSize >= 1024 * 1024 * 1024) {
                        this.omsProjectFileSpace.totalFileSize =
                            Math.floor(
                                (res.data.totalFileSize / 1024 / 1024 / 1024) *
                                    10
                            ) /
                                10 +
                            "G";
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        customColorMethod(percentage) {
            if (percentage < 80) {
                return "#67c23a";
            } else {
                return "#f56c6c";
            }
        },
    },
    mounted() {
        this.getDeviceType();
        this.newFirmwareGetOmsProjectFileSpace();
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };
        if (this.$store.state.tree.searchForm) {
            this.searchForm.firmwareType = this.$store.state.tree.searchForm
                .firmwareType
                ? this.$store.state.tree.searchForm.firmwareType
                : "";
            this.searchForm.deviceModelCode = this.$store.state.tree.searchForm
                .deviceModelCode
                ? this.$store.state.tree.searchForm.deviceModelCode
                : "";
            this.searchForm.shareOpen =
                this.$store.state.tree.searchForm.shareOpen === 0 ||
                this.$store.state.tree.searchForm.shareOpen === 1
                    ? this.$store.state.tree.searchForm.shareOpen
                    : "";
        }
        this.search();
    },
    created() {
        this.getUserTypeInfo();
        this.getDeviceModelList();
    },
};
</script>

<style lang="less" scoped>
/deep/.firmware-box {
    height: 100%;
    position: relative;
    // padding: 0 12px;
    .el-tabs__header {
        margin: 0px;
    }
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .el-form-item {
            margin-bottom: 12px !important;
        }
    }
    .wrap-bottom {
        border-top: 1px solid #e4e4e4 !important;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .progress-box {
            display: flex;
            .el-progress {
                margin-left: 8px;
                width: 200px;
                display: flex;
                align-items: center;
                .el-progress-bar {
                    padding-right: 40px;
                    margin-right: -40px;
                }
                .el-progress__text {
                    font-size: 12px !important;
                }
            }
            .el-icon-warning-outline {
                margin-left: 8px;
                font-size: 16px;
                display: flex;
                align-items: center;
            }
        }
    }
    .instructions {
        position: absolute;
        top: 0px;
        right: 21px;
        display: flex;
        align-items: center;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        color: #000000;
        cursor: pointer;
        img {
            margin-right: 4px;
        }
    }
}
.instructions-content {
    color: #606266;

    // color: #000000;
}
.el-switch {
    width: 40px;
}
</style>
