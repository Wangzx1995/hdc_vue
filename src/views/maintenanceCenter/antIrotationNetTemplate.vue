<template>
    <div>
        <div class="wrap">
            <div class="wrap-top p-x p-t">
                <el-form
                    :model="searchForm"
                    ref="searchForm"
                    inline
                    label-position="top"
                >
                    <!-- 防转网模板名称 -->
                    <el-form-item
                        :label="$t('antIrotationNet.templateName')"
                        prop="name"
                    >
                        <el-input v-model="searchForm.name"></el-input>
                    </el-form-item>
                </el-form>
                <div class="m-t p-t-sm">
                    <el-button
                        type="primary"
                        :loading="searchLoading"
                        :disabled="searchLoading"
                        @click="
                            params.currentPage = 1;
                            getIplockPage(0);
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
                </div>
            </div>
            <div class="p-x">
                <el-button
                    type="default"
                    :disabled="subType == 1"
                    @click="addNewTemplate"
                    v-btn="'antIrotationNetAddAntiTransferNetworkTemplate'"
                    >+
                    <!-- 添加防转网模板 -->
                    {{ $t("antIrotationNet.addAntiTransferNetworkTemplate") }}
                </el-button>
            </div>
            <div class="m-y p-x">
                <el-table
                    force-scroll="true"
                    v-loading="searchLoading"
                    ref="singleTable2"
                    :data="tableData"
                    :height="tableHeight"
                    style="width: 100%"
                    border
                >
                    <!-- <el-table-column type="radio"></el-table-column> -->
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table :data="props.row.ipLockParamsInfoList">
                                <!-- 是否锁定 -->
                                <el-table-column
                                    prop="forceLock"
                                    :label="$t('antIrotationNet.forceLock')"
                                    width="120"
                                    :render-header="renderHeader"
                                >
                                    <template slot-scope="scope">
                                        <i
                                            v-for="(
                                                item, index
                                            ) in dataAgo.ipLockParamsInfoList"
                                            :key="
                                                'item1_' +
                                                item.id +
                                                props.$index
                                            "
                                            @click="doLockChange(item)"
                                            v-show="
                                                item.forceLock == 0 &&
                                                props.$index === editIndex &&
                                                scope.$index === index
                                            "
                                            class="el-icon-unlock Iunlock"
                                        ></i>
                                        <i
                                            v-for="(
                                                item, index
                                            ) in dataAgo.ipLockParamsInfoList"
                                            :key="
                                                'item2_' +
                                                item.id +
                                                props.$index
                                            "
                                            @click="doLockChange(item)"
                                            v-show="
                                                item.forceLock == 1 &&
                                                props.$index === editIndex &&
                                                scope.$index === index
                                            "
                                            class="el-icon-lock Ilock"
                                        ></i>
                                        <i
                                            v-show="
                                                scope.row.forceLock == 0 &&
                                                props.$index !== editIndex
                                            "
                                            class="el-icon-unlock Iunlock"
                                        ></i>
                                        <i
                                            v-show="
                                                scope.row.forceLock == 1 &&
                                                props.$index !== editIndex
                                            "
                                            class="el-icon-lock Ilock"
                                        ></i>
                                    </template>
                                </el-table-column>
                                <!-- 中心名称 -->
                                <el-table-column
                                    prop="coreNum"
                                    :label="
                                        $t('conditionMonitoring.centerName')
                                    "
                                    width="80"
                                >
                                    <template slot-scope="scope">
                                        <div>
                                            <!-- 中心 -->
                                            {{ $t("conditionMonitoring.center")
                                            }}{{ scope.row.coreNum + 1 }}
                                        </div>
                                    </template>
                                </el-table-column>
                                <!-- 使能 -->
                                <el-table-column
                                    prop="coreEnable"
                                    :label="$t('conditionMonitoring.enable')"
                                    width="80"
                                >
                                    <template slot-scope="scope">
                                        <div v-if="props.$index !== editIndex">
                                            <!-- "开启" "关闭" -->
                                            {{
                                                scope.row.coreEnable
                                                    ? $t("common.open")
                                                    : $t("common.close")
                                            }}
                                        </div>
                                        <div v-if="props.$index === editIndex">
                                            <el-switch
                                                v-show="scope.$index === index"
                                                v-for="(
                                                    item, index
                                                ) in dataAgo.ipLockParamsInfoList"
                                                :key="
                                                    'item_' +
                                                    item.id +
                                                    props.$index
                                                "
                                                v-model="item.coreEnable"
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                            ></el-switch>
                                        </div>
                                    </template>
                                </el-table-column>
                                <!-- 平台类型 -->
                                <el-table-column
                                    prop="protocolType"
                                    :label="$t('antIrotationNet.platformType')"
                                    width=""
                                >
                                    <template slot-scope="scope">
                                        <div v-if="props.$index !== editIndex">
                                            {{ scope.row.protocolTypeName }}
                                        </div>
                                        <div v-if="props.$index === editIndex">
                                            <el-select
                                                v-show="scope.$index === index"
                                                v-for="(
                                                    item, index
                                                ) in dataAgo.ipLockParamsInfoList"
                                                :key="
                                                    'item_' +
                                                    item.id +
                                                    props.$index
                                                "
                                                v-model="item.protocolType"
                                            >
                                                <el-option
                                                    v-for="item in protocolTypeList"
                                                    :key="item.sysDictCode"
                                                    :label="item.sysDictName"
                                                    :value="item.sysDictCode"
                                                >
                                                </el-option>
                                            </el-select>
                                        </div>
                                    </template>
                                </el-table-column>
                                <!-- 协议类型 -->
                                <el-table-column
                                    prop="protocolVersion"
                                    :label="$t('antIrotationNet.protocol')"
                                    width=""
                                >
                                    <template slot-scope="scope">
                                        <div v-if="props.$index !== editIndex">
                                            {{ scope.row.protocolVersionName }}
                                        </div>
                                        <div v-if="props.$index === editIndex">
                                            <el-select
                                                v-show="scope.$index === index"
                                                v-for="(
                                                    item, index
                                                ) in dataAgo.ipLockParamsInfoList"
                                                :key="
                                                    'item_' +
                                                    item.id +
                                                    props.$index
                                                "
                                                v-model="item.protocolVersion"
                                            >
                                                <el-option
                                                    v-for="item in protocolVersionOptions"
                                                    :key="item.sysDictCode"
                                                    :label="item.sysDictName"
                                                    :value="item.sysDictCode"
                                                >
                                                </el-option>
                                            </el-select>
                                        </div>
                                    </template>
                                </el-table-column>
                                <!-- 地址格式类型 -->
                                <el-table-column
                                    prop="addressFormatType"
                                    :label="
                                        $t('antIrotationNet.addressFormatType')
                                    "
                                    width="260"
                                >
                                    <template slot-scope="scope">
                                        <div v-if="props.$index !== editIndex">
                                            <!-- "IP地址"
                                                    : "域名" -->
                                            {{
                                                scope.row.addressFormatType ===
                                                0
                                                    ? $t("loginLog.ipAddress")
                                                    : $t(
                                                          "antIrotationNet.domainName"
                                                      )
                                            }}
                                        </div>
                                        <div v-if="props.$index === editIndex">
                                            <el-select
                                                v-show="scope.$index === index"
                                                v-for="(
                                                    item, index
                                                ) in dataAgo.ipLockParamsInfoList"
                                                v-model="item.addressFormatType"
                                                :key="
                                                    'item_' +
                                                    index +
                                                    props.$index
                                                "
                                            >
                                                <!-- IP地址 -->
                                                <el-option
                                                    :label="
                                                        $t('loginLog.ipAddress')
                                                    "
                                                    :value="0"
                                                ></el-option>
                                                <!-- 域名 -->
                                                <el-option
                                                    :label="
                                                        $t(
                                                            'antIrotationNet.domainName'
                                                        )
                                                    "
                                                    :value="1"
                                                ></el-option>
                                            </el-select>
                                        </div>
                                    </template>
                                </el-table-column>
                                <!-- 服务器地址 -->
                                <el-table-column
                                    prop="addressHostname"
                                    :label="$t('antIrotationNet.serverAddress')"
                                    width=""
                                >
                                    <template slot-scope="scope">
                                        <div v-if="props.$index !== editIndex">
                                            {{
                                                scope.row.addressFormatType ===
                                                1
                                                    ? scope.row.addressHostname
                                                    : scope.row.addressIp
                                            }}
                                        </div>
                                        <div v-if="props.$index === editIndex">
                                            <el-input
                                                style="width: 100%"
                                                v-show="
                                                    scope.$index === index &&
                                                    item.addressFormatType === 1
                                                "
                                                v-for="(
                                                    item, index
                                                ) in dataAgo.ipLockParamsInfoList"
                                                :key="
                                                    'item1_' +
                                                    item.id +
                                                    props.$index
                                                "
                                                class="el-input--width"
                                                v-model="item.addressHostname"
                                                :placeholder="
                                                    $t('common.input')
                                                "
                                            ></el-input>
                                            <h-ip-input
                                                v-show="
                                                    scope.$index === index &&
                                                    item.addressFormatType === 0
                                                "
                                                v-for="(
                                                    item, index
                                                ) in dataAgo.ipLockParamsInfoList"
                                                :key="
                                                    'item2_' +
                                                    item.id +
                                                    props.$index
                                                "
                                                class="el-input--width"
                                                v-model="item.addressIp"
                                                :placeholder="
                                                    $t('common.input')
                                                "
                                            ></h-ip-input>
                                        </div>
                                    </template>
                                </el-table-column>
                                <!-- 端口 -->
                                <el-table-column
                                    prop="addressPort"
                                    :label="$t('antIrotationNet.port')"
                                    width=""
                                >
                                    <template slot-scope="scope">
                                        <div v-if="props.$index !== editIndex">
                                            {{ scope.row.addressPort }}
                                        </div>
                                        <div v-if="props.$index === editIndex">
                                            <el-input
                                                v-show="scope.$index === index"
                                                v-for="(
                                                    item, index
                                                ) in dataAgo.ipLockParamsInfoList"
                                                :key="
                                                    'item_' +
                                                    index +
                                                    index +
                                                    props.$index
                                                "
                                                class="el-input--width"
                                                v-model="item.addressPort"
                                                :placeholder="
                                                    $t('common.input')
                                                "
                                            ></el-input>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                    <!-- 防转网模板名称 -->
                    <el-table-column
                        class="originalList"
                        prop="name"
                        :label="$t('antIrotationNet.templateName')"
                        min-width="140px"
                    >
                        <template slot-scope="props">
                            <div v-if="props.$index !== editIndex">
                                {{ props.row.ipLockInfo.name }}
                            </div>
                            <div v-if="props.$index === editIndex">
                                <el-input
                                    class="el-input--width"
                                    v-model="dataAgo.ipLockInfo.name"
                                    :placeholder="$t('common.input')"
                                ></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- 创建人 -->
                    <el-table-column
                        class="originalList"
                        prop="createName"
                        :label="$t('antIrotationNet.createName')"
                        width=""
                    >
                        <template slot-scope="props">
                            <div>{{ props.row.ipLockInfo.createName }}</div>
                        </template>
                    </el-table-column>
                    <!-- 时间 -->
                    <el-table-column
                        class="originalList"
                        sortable
                        prop="ipLockInfo.updateTime"
                        :label="$t('antIrotationNet.updateTime')"
                        width=""
                    >
                        <template slot-scope="props">
                            <div>{{ props.row.ipLockInfo.updateTime }}</div>
                        </template>
                    </el-table-column>
                    <!-- 启用状态 -->
                    <el-table-column
                        class="originalList"
                        prop="useEnable"
                        :label="$t('userManage.enableStatus')"
                        width=""
                    >
                        <template slot-scope="props">
                            <el-switch
                                @change="(val) => useEnableDo(val, props.row)"
                                v-model="props.row.ipLockInfo.useEnable"
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                                v-btn="
                                    'antIrotationNetEnable&DisableAntiTransferNetworkTemplate'
                                "
                            ></el-switch>
                        </template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column
                        class="originalList"
                        :label="$t('common.operate')"
                        width=""
                    >
                        <template slot-scope="props">
                            <el-button
                                :disabled="subType == 1"
                                v-if="props.$index !== editIndex"
                                type="text"
                                class="text-info"
                                @click="goEdit(props.row, props.$index)"
                                v-btn="
                                    'antIrotationNetEditAntiTransferNetworkTemplate'
                                "
                            >
                                <!-- 编辑 -->
                                {{ $t("common.edit") }}
                            </el-button>
                            <el-button
                                :disabled="subType == 1"
                                v-if="props.$index === editIndex"
                                type="text"
                                class="text-info"
                                @click="makeSure(props.row.ipLockInfo.id)"
                            >
                                <!-- 确定 -->
                                {{ $t("common.ok") }}
                            </el-button>
                            <el-button
                                :disabled="subType == 1"
                                v-if="props.$index !== editIndex"
                                type="text"
                                class="text-info"
                                @click="
                                    doDelete(
                                        props.row.ipLockInfo.id,
                                        props.$index
                                    )
                                "
                                v-btn="
                                    'antIrotationNetDeleteAntiTransferNetworkTemplate'
                                "
                            >
                                <!-- 删除 -->
                                {{ $t("common.delete") }}
                            </el-button>
                            <el-button
                                :disabled="subType == 1"
                                v-if="props.$index === editIndex"
                                type="text"
                                class="text-info"
                                @click="
                                    editOut(
                                        props.row.ipLockInfo.id,
                                        props.$index
                                    )
                                "
                            >
                                <!-- 取消 -->
                                {{ $t("common.cancel") }}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="wrap-bottom p-x">
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
</template>
<script>
import TimeUtil from "@/utils/time";
import {
    validateNum,
    domainName,
    validateSpecial,
    validateIP,
} from "@/utils/validate";
export default {
    name: "antIrotationNetTemplate",
    data() {
        return {
            tableHeight: 500,
            searchLoading: true,
            total: 0,
            editIndex: "",
            dataAgo: "",
            searchForm: {
                name: "",
            },
            subType: localStorage.getItem("userSubType"),
            newData: {
                ipLockInfo: {
                    name: "",
                    createName: "",
                    useEnable: 0,
                    updateTime: "",
                    id: "",
                },
                ipLockParamsInfoList: [
                    {
                        forceLock: 1,
                        coreNum: 0,
                        addressFormatType: 0,
                        addressHostname: "",
                        addressIp: "",
                        addressPort: 0,
                        coreEnable: 0,
                        protocolType: "",
                        protocolVersion: "",
                    },
                    {
                        forceLock: 1,
                        coreNum: 1,
                        addressFormatType: 0,
                        addressHostname: "",
                        addressIp: "",
                        addressPort: 0,
                        coreEnable: 0,
                        protocolType: "",
                        protocolVersion: "",
                    },
                    {
                        forceLock: 1,
                        coreNum: 2,
                        addressFormatType: 0,
                        addressHostname: "",
                        addressIp: "",
                        addressPort: 0,
                        coreEnable: 0,
                        protocolType: "",
                        protocolVersion: "",
                    },
                    {
                        forceLock: 1,
                        coreNum: 3,
                        addressFormatType: 0,
                        addressHostname: "",
                        addressIp: "",
                        addressPort: 0,
                        coreEnable: 0,
                        protocolType: "",
                        protocolVersion: "",
                    },
                    {
                        forceLock: 1,
                        coreNum: 4,
                        addressFormatType: 1,
                        addressHostname: "",
                        addressIp: "",
                        addressPort: 0,
                        coreEnable: 0,
                        protocolType: "",
                        protocolVersion: "",
                    },
                    {
                        forceLock: 1,
                        coreNum: 5,
                        addressFormatType: 0,
                        addressHostname: "",
                        addressIp: "",
                        addressPort: 0,
                        coreEnable: 0,
                        protocolType: "",
                        protocolVersion: "",
                    },
                ],
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "updateTime", //排序列
                orderDir: "desc", //排序方向
                // organizeId: null,
            },
            tableData: [],
            copyData: "",
            protocolTypeList: [],
            protocolVersionOptions: [],
            addNow: this.$route.query.type,
        };
    },
    created() {
        this.setTableHeight();
        this.getIplockPage(0);
        this.findProtocolType();
        this.findProtocolVersion();
        this.copyData = JSON.parse(JSON.stringify(this.newData));
    },
    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };
    },
    methods: {
        //自定义表头
        renderHeader(h, { column, $index }) {
            return h("span", { class: "poptip" }, [
                // h("span", "是否锁定"), //表格当前列标题
                h("span", this.$t("antIrotationNet.forceLock")), //表格当前列标题
                h(
                    "Poptip",
                    {
                        props: {
                            placement: "top",
                            width: "80px",
                            trigger: "hover",
                            offset: 2,
                            transfer: true,
                            // title:'是否锁定'
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
                            // "仅对锁定的中心进行防转网生效，未锁定的中心不生效"
                            this.$t("antIrotationNet.forceLockText")
                        ),
                    ]
                ),
            ]);
        },
        //锁定模板中心操作
        doLockChange(item) {
            item.forceLock = item.forceLock == 1 ? 0 : 1;
        },
        //新增模板
        addNewTemplate() {
            if (!this.tableData[0] || this.tableData[0].ipLockInfo.id !== "") {
                this.newData = JSON.parse(JSON.stringify(this.copyData));
                this.tableData.unshift(this.newData);
                this.tableData = Object.assign(this.tableData, this.newData);
                this.dataAgo = this.newData;
                this.editIndex = 0;
                this.toggleRowExpansion([this.tableData[0]], true);
            } else {
                // this.$message.warning("请先保存或删除上一个新增模板");
                this.$message.warning(
                    this.$t("antIrotationNet.addNewTemplateText")
                );
                return;
            }
        },
        //模板状态修改
        useEnableDo(val, data) {
            let params = {
                id: data.ipLockInfo.id,
                useEnable: val,
            };
            this.$api.editIpLockUseEnable(params).then((res) => {
                if (res.success == true) {
                    // this.$message.success("模板状态修改成功！");
                    this.$message.success(
                        this.$t("antIrotationNet.useEnableDoText1")
                    );
                } else {
                    // this.$message.error("模板状态修改失败：" + res.msg);
                    this.$message.error(
                        this.$t("antIrotationNet.useEnableDoText2") +
                            "：" +
                            res.msg
                    );
                }
                this.getIplockPage(0);
            });
        },
        // 表格高度设置
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 281;
        },
        //新增模板 /ipLock/addIpLock
        addIpLock() {},
        //编辑模板 /ipLock/editIpLock
        editIpLock() {},
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
            }
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getIplockPage(0);
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getIplockPage(0);
        },
        //编辑
        goEdit(item, index) {
            // console.log(document.querySelector('.el-table__row'))
            if (this.editIndex !== "") {
                // this.$message.error("仅允许编辑单个模板");
                this.$message.error(
                    this.$t("antIrotationNet.useEnableDoText3")
                );
                return;
            }
            this.dataAgo = JSON.parse(JSON.stringify(this.tableData[index]));
            if (
                !document
                    .getElementsByClassName("el-icon-arrow-right")
                    [
                        index
                    ].parentNode.parentNode.parentNode.parentNode.classList.contains(
                        "expanded"
                    )
            ) {
                this.toggleRowExpansion([this.tableData[index]], true);
            }
            this.editIndex = index;
        },
        //确认编辑/ipLock/editIpLock||确认添加/ipLock/addIpLock
        makeSure(id) {
            //模板名称校验
            let iotAutoNumber = 0; //统计模板中有多少个域名设置为iot81.hikvisionauto.com
            if (this.dataAgo["ipLockInfo"].name !== "") {
                if (validateSpecial(this.dataAgo["ipLockInfo"].name)) {
                    // this.$message.info("模板名称不能存在特殊字符");
                    this.$message.info(
                        this.$t("antIrotationNet.makeSureText1")
                    );
                    return;
                }
            } else {
                // this.$message.info("模板名称不能为空");
                this.$message.info(this.$t("antIrotationNet.makeSureText2"));
                return;
            }
            let flag = false;
            for (let i = 0; i < 6; i++) {
                if (this.dataAgo["ipLockParamsInfoList"][i].forceLock === 0) {
                    flag = true;
                }
                if (this.dataAgo["ipLockParamsInfoList"][i].coreEnable === 1) {
                    flag = true;
                }
                if (this.dataAgo["ipLockParamsInfoList"][i].protocolType) {
                    flag = true;
                }
                if (this.dataAgo["ipLockParamsInfoList"][i].addressHostname) {
                    flag = true;
                }
                if (
                    this.dataAgo["ipLockParamsInfoList"][i].addressPort != 0 &&
                    this.dataAgo["ipLockParamsInfoList"][i].addressPort != ""
                ) {
                    flag = true;
                }
                if (this.dataAgo["ipLockParamsInfoList"][i].coreEnable) {
                    if (
                        this.dataAgo["ipLockParamsInfoList"][i].protocolType ===
                        ""
                    ) {
                        // this.$message.info(
                        //     "已启用使能的中心“平台类型”不能为空"
                        // );
                        this.$message.info(
                            this.$t("antIrotationNet.makeSureText3")
                        );
                        return;
                    }
                    if (
                        this.dataAgo["ipLockParamsInfoList"][i]
                            .protocolVersion === ""
                    ) {
                        // this.$message.info(
                        //     "已启用使能的中心“协议类型”不能为空"
                        // );
                        this.$message.info(
                            this.$t("antIrotationNet.makeSureText4")
                        );
                        return;
                    }
                }
                if (this.dataAgo["ipLockParamsInfoList"][i].addressFormatType) {
                    this.dataAgo["ipLockParamsInfoList"][i].addressIp = "";
                } else {
                    this.dataAgo["ipLockParamsInfoList"][i].addressHostname =
                        "";
                }
                if (this.dataAgo["ipLockParamsInfoList"][i].addressHostname) {
                    if (
                        this.dataAgo["ipLockParamsInfoList"][i]
                            .addressHostname == "iot81.hikvisionauto.com"
                    ) {
                        iotAutoNumber += 1;
                    }
                    if (
                        domainName(
                            this.dataAgo["ipLockParamsInfoList"][i]
                                .addressHostname
                        )
                    ) {
                        // this.$message.info("域名地址格式错误");
                        this.$message.info(
                            this.$t("antIrotationNet.makeSureText5")
                        );
                        return;
                    } else if (
                        this.dataAgo["ipLockParamsInfoList"][i].addressHostname
                            .length > 128
                    ) {
                        // this.$message.info("域名地址长度不能超过128个字符");
                        this.$message.info(
                            this.$t("antIrotationNet.makeSureText6")
                        );
                        return;
                    }
                }
                if (this.dataAgo["ipLockParamsInfoList"][i].addressIp) {
                    if (
                        !validateIP(
                            this.dataAgo["ipLockParamsInfoList"][i].addressIp
                        )
                    ) {
                        // this.$message.info("IP地址格式错误");
                        this.$message.info(
                            this.$t("antIrotationNet.makeSureText7")
                        );
                        return;
                    }
                }
                if (
                    this.dataAgo["ipLockParamsInfoList"][i].addressPort !== ""
                ) {
                    if (
                        !validateNum(
                            this.dataAgo["ipLockParamsInfoList"][i].addressPort
                        )
                    ) {
                        // this.$message.info("端口号必须为数字组合");
                        this.$t("antIrotationNet.makeSureText8");
                        return;
                    }
                    if (
                        this.dataAgo["ipLockParamsInfoList"][i].addressPort >
                        65535
                    ) {
                        // this.$message.info("端口号超出范围0~65535");
                        this.$t("antIrotationNet.makeSureText9");
                        return;
                    }
                } else {
                    // this.$message.info("端口号不能为空");
                    this.$t("antIrotationNet.makeSureText10");
                    return;
                }
            }
            if (iotAutoNumber > 1) {
                // `仅允许一个中心配置iot81.hikvisionauto.com平台，请检查各中心配置的平台域名!`
                this.$message.info(this.$t("antIrotationNet.makeSureText11"));
                return;
            }
            if (!flag) {
                // this.$message.info(`所有中心都锁定并且参数都为空，不允许保存!`);
                this.$message.info(this.$t("antIrotationNet.makeSureText12"));
                return;
            }
            if (id) {
                this.$api.ipLockEdit(this.dataAgo).then((res) => {
                    if (res.success == true) {
                        this.$message.success(this.$t("common.editSuccess"));
                        this.getIplockPage(1);
                        this.editIndex = "";
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            } else {
                this.$api.ipLockAdd(this.dataAgo).then((res) => {
                    if (res.success == true) {
                        this.$message.success(this.$t("common.addSuccess"));
                        this.getIplockPage(1);
                        this.editIndex = "";
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            }
        },
        toggleRowExpansion(rows, bol) {
            if (rows) {
                rows.forEach((row) => {
                    this.$refs.singleTable2.toggleRowExpansion(row, bol);
                });
            }
        },
        //删除
        doDelete(id, index) {
            if (id !== "") {
                // 此操作将删除该模板, 是否继续?
                this.$confirm(this.$t("antIrotationNet.makeSureText13"), {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                })
                    .then(() => {
                        this.$api.ipLockDelete({ id: id }).then((res) => {
                            if (res.success == true) {
                                this.$message({
                                    type: "success",
                                    message: this.$t("common.deleteSuccess"),
                                });
                            } else {
                                this.$message.error(res.msg);
                            }
                            this.getIplockPage(0);
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: "success",
                            message: this.$t("carManage.cancelDelete"), //"已取消删除!",
                        });
                    });
            } else {
                this.tableData.splice(index, 1);
            }
        },
        //取消编辑||取消添加
        editOut(id, index) {
            if (id !== "") {
                this.editIndex = "";
                if (
                    !document
                        .getElementsByClassName("el-icon-arrow-right")
                        [
                            index
                        ].parentNode.parentNode.parentNode.parentNode.classList.contains(
                            "expanded"
                        )
                ) {
                    this.toggleRowExpansion([this.tableData[index]], false);
                }
            } else {
                this.tableData.splice(index, 1);
                this.editIndex = "";
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
        getIplockPage(type) {
            let params = Object.assign(this.searchForm, this.params);
            this.searchLoading = true;
            this.tableData = [];
            this.editIndex = "";
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
                                        item_.protocolTypeName =
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
                                        item_.protocolVersionName =
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
                    if (type) {
                        this.toggleRowExpansion([this.tableData[0]]);
                    }
                    this.$nextTick(() => {
                        if (this.addNow && !this.tableData.length) {
                            this.addNewTemplate();
                        }
                    });
                    this.total = res.data.totalRecords;
                } else {
                }
                this.searchLoading = false;
            });
        },
    },
};
</script>

<style lang="less" scoped>
.wrap {
    height: 100%;
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
    }
}
.Ilock {
    color: #1890ff;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
}
.Iunlock {
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
}
</style>
