<template>
    <div>
        <el-dialog
            :visible="thisModal"
            :title="title"
            class="modal-nopadding"
            @close="close"
        >
            <div>
                <div>
                    <el-table
                        stripe
                        border
                        ref="singleTable2"
                        :data="tableData"
                        highlight-current-row
                        :height="tableHeight"
                        style="width: 100%; margin-top: 20px"
                    >
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-table
                                    stripe
                                    border
                                    :data="props.row.changeList"
                                >
                                    <!-- 修改记录 -->
                                    <el-table-column
                                        prop="coreNum"
                                        :label="
                                            $t('antIrotationNet.modifyRecord')
                                        "
                                        width="100"
                                    >
                                        <template slot-scope="scope">
                                            <div>{{ scope.row.fixType }}</div>
                                        </template>
                                    </el-table-column>
                                    <!-- 中心名称 -->
                                    <el-table-column
                                        prop="coreEnable"
                                        :label="
                                            $t('conditionMonitoring.centerName')
                                        "
                                        width="100"
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
                                        prop="protocolType"
                                        :label="
                                            $t('conditionMonitoring.enable')
                                        "
                                        width="80"
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
                                        prop="protocolType"
                                        :label="
                                            $t('antIrotationNet.platformType')
                                        "
                                        width="120"
                                    >
                                        <template slot-scope="scope">
                                            <div>
                                                {{
                                                    protocolTypeList[
                                                        scope.row.protocolType
                                                    ] || "--"
                                                }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <!-- 协议类型 -->
                                    <el-table-column
                                        prop="protocolVersion"
                                        :label="$t('antIrotationNet.protocol')"
                                        width="120"
                                    >
                                        <template slot-scope="scope">
                                            <div>
                                                {{
                                                    protocolVersionOptions[
                                                        scope.row
                                                            .protocolVersion
                                                    ] || "--"
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
                                    >
                                        <template slot-scope="scope">
                                            <div>
                                                {{
                                                    scope.row.ipAddress || "--"
                                                }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <!-- 端口 -->
                                    <el-table-column
                                        prop="addressPort"
                                        :label="$t('antIrotationNet.port')"
                                        width="100"
                                    ></el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <!-- 防御记录 -->
                        <el-table-column
                            prop="name"
                            :label="$t('antIrotationNet.defenseRecord')"
                        >
                            <template slot-scope="scope">
                                <div>{{ scope.row.ipLockName }}</div>
                            </template>
                        </el-table-column>
                        <!-- 防御时间 -->
                        <el-table-column
                            prop="createTime"
                            :label="$t('antIrotationNet.defenseTime')"
                            width="150"
                        >
                            <template slot-scope="scope">
                                <div>{{ scope.row.createTime }}</div>
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
        ipLockNumDialog: {
            type: Boolean,
            default: false,
        },
        ipLockNum: {
            type: Number,
            default: 0,
        },
        deviceId: {
            type: [String, Number],
            default: "",
        },
    },
    data() {
        return {
            paramsDialog: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "id", //排序列
                orderDir: "desc", //排序方向
            },
            params: {
                deviceId: "",
            },
            selection: "",
            total: 0,
            title: this.$t("antIrotationNet.defenseFrequency"), //"防御次数",
            tableData: [],
            thisModal: this.ipLockNumDialog,
            tableHeight: 400,
            ipLockId: "",
            protocolTypeList: [],
            protocolVersionOptions: [],
            contrastList: [
                "coreEnable",
                "protocolType",
                "protocolVersion",
                "ipAddress",
                "addressPort",
            ], // 对比列表的数据项
        };
    },
    watch: {
        ipLockNumDialog: {
            handler(val) {
                this.thisModal = val;
                this.title = `${this.$t("antIrotationNet.defenseFrequency")}（${
                    this.ipLockNum
                }）`;
                this.params.deviceId = this.deviceId;
                if (val) {
                    this.getData();
                }
            },
        },
    },
    created() {
        this.findProtocolType();
        this.findProtocolVersion();
    },
    methods: {
        close() {
            this.thisModal = false;
            this.$emit("close", this.thisModal);
        },
        // 获取表格数据
        getData() {
            let params = Object.assign(this.paramsDialog, this.params);
            this.$api.getIpLockExecuteLog(params).then((res) => {
                if (res.success == true) {
                    res.data.results.forEach((item) => {
                        // 格式化时间
                        item["createTime"] = TimeUtil.getDateTime(
                            item["createTime"]
                        );
                        // eval字符串
                        let deviceParams = eval(item.deviceParams);
                        let lockParams = eval(item.lockParams);
                        // 处理空数据
                        deviceParams.map((item, i) => {
                            if (!item.coreNum) {
                                item.coreNum = i;
                            }
                            item.ipAddress = item.addressFormatType
                                ? item.addressHostname
                                : item.addressIp;
                        });
                        lockParams.map((item, i) => {
                            if (!item.coreNum) {
                                item.coreNum = i;
                            }
                            item.ipAddress = item.addressFormatType
                                ? item.addressHostname
                                : item.addressIp;
                        });
                        // 比较后获取changeList，更改记录
                        let list = [];
                        deviceParams.forEach((i) => {
                            lockParams.forEach((j) => {
                                if (i.coreNum == j.coreNum) {
                                    // let keys=Object.keys(j)
                                    for (
                                        var key = 0;
                                        key < this.contrastList.length;
                                        key++
                                    ) {
                                        if (
                                            i[this.contrastList[key]] !=
                                            j[this.contrastList[key]]
                                        ) {
                                            list.push(
                                                Object.assign(i, {
                                                    // fixType: "修改前",
                                                    fixType: this.$t(
                                                        "antIrotationNet.beforeModification"
                                                    ),
                                                })
                                            );
                                            list.push(
                                                Object.assign(j, {
                                                    // fixType: "修改后",
                                                    fixType: this.$t(
                                                        "antIrotationNet.afterModification"
                                                    ),
                                                })
                                            );
                                            break;
                                        }
                                    }
                                }
                            });
                        });
                        item["changeList"] = list;
                    });
                    this.tableData =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : this.tableData;
                    this.total = res.data.totalRecords;
                }
            });
        },
        handleSizeChange(val) {
            this.paramsDialog.pageSize = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.paramsDialog.currentPage = val;
            this.getData();
        },
        //平台类型列表
        findProtocolType() {
            let params = {
                type: "ipLockProtocolType",
            };
            this.$api.findTypes(params).then((res) => {
                if (res.success == true) {
                    let obj = {};
                    res.data.map((i) => {
                        obj[i.sysDictCode] = i.sysDictName;
                    });
                    this.protocolTypeList = obj;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //获取协议列表
        findProtocolVersion() {
            let params = {
                type: "ipLockProtocolVersion",
            };
            this.$api.findTypes(params).then((res) => {
                if (res.success == true) {
                    let obj = {};
                    res.data.map((i) => {
                        obj[i.sysDictCode] = i.sysDictName;
                    });
                    this.protocolVersionOptions = obj;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
    },
};
</script>
<style lang="less" scoped>
.el-scrollbar__wrap {
    margin-right: -12px !important;
}
</style>
