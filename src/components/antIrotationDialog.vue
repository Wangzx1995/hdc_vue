<template>
    <div>
        <el-dialog
            :visible="thisModal"
            :title="title"
            class="modal-nopadding"
            @close="doCancel"
        >
            <div>
                <div>
                    <el-table
                        ref="singleTable2"
                        :data="tableData"
                        highlight-current-row
                        :height="tableHeight"
                        @current-change="onSelectionChange"
                        style="width: 100%; margin-top: 20px"
                        border
                        stripe
                    >
                        <!-- <el-table-column type="radio"></el-table-column> -->
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-table
                                    :data="props.row.ipLockParamsInfoList"
                                    stripe
                                >
                                    <!-- 中心名称 -->
                                    <el-table-column
                                        prop="coreNum"
                                        :label="
                                            $t('conditionMonitoring.centerName')
                                        "
                                    >
                                        <template slot-scope="scope">
                                            <div>
                                                <!-- 中心 -->
                                                {{
                                                    $t(
                                                        "conditionMonitoring.center"
                                                    )
                                                }}{{ scope.row.coreNum + 1 }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <!-- 使能 -->
                                    <el-table-column
                                        prop="coreEnable"
                                        :label="
                                            $t('conditionMonitoring.enable')
                                        "
                                        width="120"
                                    >
                                        <template slot-scope="scope">
                                            <div>
                                                <!-- "开启" "关闭" -->
                                                {{
                                                    scope.row.coreEnable
                                                        ? $t("common.open")
                                                        : $t("common.close")
                                                }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <!-- 平台类型 -->
                                    <el-table-column
                                        prop="protocolTypeName"
                                        :label="
                                            $t('antIrotationNet.platformType')
                                        "
                                        width="160"
                                    >
                                        <template slot-scope="scope">
                                            <div>
                                                {{ scope.row.protocolTypeName }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <!-- 协议类型 -->
                                    <el-table-column
                                        prop="protocolVersionName"
                                        :label="$t('antIrotationNet.protocol')"
                                        width="120"
                                    >
                                        <template slot-scope="scope">
                                            <div>
                                                {{
                                                    scope.row
                                                        .protocolVersionName
                                                }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <!-- 服务器地址 -->
                                    <el-table-column
                                        prop="addressHostname"
                                        :label="
                                            $t('antIrotationNet.serverAddress')
                                        "
                                        width="120"
                                    >
                                        <template slot-scope="scope">
                                            <div>
                                                {{
                                                    scope.row
                                                        .addressFormatType === 1
                                                        ? scope.row
                                                              .addressHostname
                                                        : scope.row.addressIp
                                                }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <!-- 端口 -->
                                    <el-table-column
                                        prop="addressPort"
                                        :label="$t('antIrotationNet.port')"
                                        width="120"
                                    ></el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <!-- 防转网模板名称 -->
                        <el-table-column
                            prop="name"
                            :label="$t('antIrotationNet.templateName')"
                            width="360"
                        >
                            <template slot-scope="props">
                                <div>{{ props.row.ipLockInfo.name }}</div>
                            </template>
                        </el-table-column>
                        <!-- 创建人 -->
                        <el-table-column
                            prop="createName"
                            :label="$t('antIrotationNet.createName')"
                            width="120"
                        >
                            <template slot-scope="props">
                                <div>{{ props.row.ipLockInfo.createName }}</div>
                            </template>
                        </el-table-column>
                        <!-- 时间 -->
                        <el-table-column
                            prop="updateTime"
                            :label="$t('antIrotationNet.updateTime')"
                        >
                            <template slot-scope="props">
                                <div>{{ props.row.ipLockInfo.updateTime }}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="p-l-md p-r-md wrap-bottom">
                    <el-pagination
                        :current-page="paramsDialog.currentPage"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[20, 50, 100]"
                        :page-size="paramsDialog.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                    >
                    </el-pagination>
                </div>
                <div class="configuration-detail-submit p-y-sm p-x-md">
                    <div style="margin-left: auto">
                        <p style="display: inline-block">
                            <el-button type="default" @click="setCurrent">
                                <!-- 取消 -->
                                {{ $t("common.cancel") }}
                            </el-button>
                            <el-button
                                type="primary"
                                :loading="loading"
                                @click="applyIpLock"
                            >
                                <!-- 应用 -->
                                {{ $t("antIrotationNet.application") }}
                            </el-button>
                        </p>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import TimeUtil from "@/utils/time";
export default {
    name: "antIrotationDialog",
    props: {
        //模态框打开/关闭状态
        openDialogBol: {
            type: Boolean,
            default: false,
        },
        selectionNum: {
            type: Number,
            default: 0,
        },
        organizeIdTitle: {
            type: Number,
            default: 0,
        },
        totalNum: {
            type: Number,
            default: 0,
        },
        loadingUse: {
            type: Boolean,
            default: false,
        },
        // organizeIdTo:{
        //     type:Number,
        //     default:0
        // }
    },
    data() {
        return {
            paramsDialog: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                useRecord: 1, // 是否使用
            },
            params: {
                useEnable: 1,
            },
            selection: "",
            loading: this.loadingUse,
            total: 0,
            title: this.$t("antIrotationNet.entireAntiRotationNetwork"), //"整组防转网",
            tableData: [],
            thisModal: this.openDialogBol,
            protocolTypeList: [],
            protocolVersionOptions: [],
            tableHeight: 400,
            ipLockId: "",
            // organizeId:''
        };
    },
    watch: {
        openDialogBol: {
            handler(val) {
                this.thisModal = val;
                if (this.organizeIdTitle) {
                    // this.title = `整组防转网(统计中。。。)`;
                    this.title = `${this.$t(
                        "antIrotationNet.entireAntiRotationNetwork"
                    )}(${this.$t("antIrotationNet.inStatistics")}。。。)`;
                    this.$api
                        .getExistIpLockDevice({
                            organizeId: this.organizeIdTitle,
                        })
                        .then((res) => {
                            if (res.success) {
                                // this.title = `整组防转网（${res.data.recordTotleNum}）`;
                                this.title = `${this.$t(
                                    "antIrotationNet.entireAntiRotationNetwork"
                                )}（${res.data.recordTotleNum}）`;
                            }
                        });
                } else {
                    // this.title = `批量防转网（${this.selectionNum}）`;
                    this.title = `${this.$t(
                        "antIrotationNet.batchAntiRotationNetwork"
                    )}（${this.selectionNum}）`;
                }
            },
        },
        loadingUse: {
            handler(val) {
                this.loading = val;
            },
        },
        // selectionNum:{
        //     handler(val){

        //     }
        // },
        // organizeIdTitle:{
        //      handler(val){
        //         if(val){
        //             // this.title = '整组防转网'
        //         }
        //     }
        // }
    },
    created() {
        this.getIplockPage();
        this.findProtocolType();
        this.findProtocolVersion();
    },
    methods: {
        doCancel() {
            this.thisModal = false;
            this.$emit("closeDia", this.thisModal);
        },
        //取消选择
        setCurrent(row) {
            this.$refs.singleTable2.setCurrentRow(row);
            this.$emit("ipLockId", "");
            this.doCancel();
        },
        //IP锁定模板应用
        applyIpLock() {
            if (this.ipLockId) {
                this.$emit("ipLockId", this.ipLockId);
            } else {
                // this.$message.warning("请选择一个模板");
                this.$message.warning(
                    this.$t("antIrotationNet.pleaseChooseATemplate")
                );
                this.$emit("ipLockId", "");
                return;
            }
        },
        //平台类型列表
        findProtocolType() {
            let params = {
                type: "ipLockProtocolType",
            };
            this.$api.findTypes(params).then((res) => {
                if (res.success == true) {
                    this.protocolTypeList = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //获取选中模板
        onSelectionChange(selection) {
            if (selection.ipLockInfo) {
                this.ipLockId = selection.ipLockInfo.id;
            } else {
                this.ipLockId = "";
            }
        },
        //获取协议列表
        findProtocolVersion() {
            let params = {
                type: "ipLockProtocolVersion",
            };
            this.$api.findTypes(params).then((res) => {
                if (res.success == true) {
                    this.protocolVersionOptions = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //获取模板列表
        getIplockPage() {
            let params = Object.assign(this.paramsDialog, this.params);
            this.$api.getIplockPage(params).then((res) => {
                if (res.success == true) {
                    res.data.results.forEach((item) => {
                        item["ipLockInfo"].updateTime = TimeUtil.getDateTime(
                            item["ipLockInfo"].updateTime
                        );
                        item["ipLockParamsInfoList"].forEach((item_) => {
                            if (item_.protocolType) {
                                for (
                                    let i = 0;
                                    i < this.protocolTypeList.length;
                                    i++
                                ) {
                                    if (
                                        item_.protocolType ==
                                        this.protocolTypeList[i].sysDictCode
                                    ) {
                                        item_["protocolTypeName"] =
                                            this.protocolTypeList[
                                                i
                                            ].sysDictName;
                                    }
                                }
                            } else {
                                item_.protocolTypeName = "--";
                            }
                            if (item_.protocolVersion) {
                                for (
                                    let i = 0;
                                    i < this.protocolVersionOptions.length;
                                    i++
                                ) {
                                    if (
                                        item_.protocolVersion ==
                                        this.protocolVersionOptions[i]
                                            .sysDictCode
                                    ) {
                                        item_["protocolVersionName"] =
                                            this.protocolVersionOptions[
                                                i
                                            ].sysDictName;
                                    }
                                }
                            } else {
                                item_.protocolVersionName = "--";
                            }
                        });
                    });
                    this.tableData =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : this.tableData;
                    this.$emit("canUseTemplate", this.tableData);
                    this.total = res.data.totalRecords;
                } else {
                }
            });
        },
        selectable(selection) {
            this.selection = selection;
        },
        handleSizeChange(val) {
            this.paramsDialog.pageSize = val;
            this.getIplockPage();
        },
        handleCurrentChange(val) {
            this.paramsDialog.currentPage = val;
            this.getIplockPage();
        },
    },
};
</script>
<style lang="less" scoped>
.configuration-detail-submit {
    text-align: right;
}
</style>
