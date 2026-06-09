<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="wrap">
                    <div class="wrap-top p-x">
                        <div class="m-t">
                            <el-form
                                :model="searchForm"
                                inline
                                ref="searchForm"
                            >
                                <!-- 自检上报时间段 -->
                                <el-form-item
                                    prop=""
                                    :label="
                                        $t(
                                            'equipmentInspection.selfInspectionReportingTimePeriod'
                                        )
                                    "
                                >
                                    <el-date-picker
                                        size="small"
                                        :clearable="false"
                                        v-model="timeRange"
                                        :picker-options="pickerOptions"
                                        type="daterange"
                                        :start-placeholder="
                                            $t('common.startTime')
                                        "
                                        :end-placeholder="$t('common.endTime')"
                                        transfer
                                        format="yyyy-MM-dd"
                                    ></el-date-picker>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="m-t">
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
                            <!-- 自检上报时间段 -->
                            <el-table-column
                                prop="createTime"
                                :label="
                                    $t(
                                        'equipmentInspection.selfInspectionReportingTimePeriod'
                                    )
                                "
                                width=""
                            ></el-table-column>
                            <!-- 车牌号 -->
                            <el-table-column
                                prop="plateNum"
                                :label="$t('common.plateNum')"
                                width=""
                            ></el-table-column>
                            <!-- 所属组织 -->
                            <el-table-column
                                prop="organizeName"
                                :label="$t('common.orgPath')"
                                width=""
                            ></el-table-column>
                            <!-- 终端手机号 -->
                            <el-table-column
                                prop="deviceCode"
                                :label="$t('common.deviceCode')"
                                width=""
                            ></el-table-column>
                            <!-- 设备序列号 -->
                            <el-table-column
                                prop="deviceSerialNum"
                                :label="$t('common.deviceSerialNum')"
                                width=""
                            ></el-table-column>
                            <!-- VIN码 -->
                            <el-table-column
                                prop="vin"
                                :label="$t('common.vin')"
                                width=""
                            ></el-table-column>
                            <!-- 设备型号 -->
                            <el-table-column
                                prop="deviceModelCode"
                                :label="$t('common.deviceModelCode')"
                                width=""
                            ></el-table-column>
                            <!-- 接入协议 -->
                            <el-table-column
                                prop="protocolName"
                                :label="$t('common.protocolName')"
                            >
                            </el-table-column>
                            <!-- 操作 -->
                            <el-table-column
                                :label="$t('common.operate')"
                                width=""
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        type="text"
                                        class="text-info"
                                        @click="showDetails(scope.row.idString)"
                                    >
                                        <!-- 详情 -->
                                        {{ $t("common.detail") }}
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
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
            :custom-class="'zijian'"
        >
            <div slot="title" class="zijian-title">
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
                <el-scrollbar wrap-class="demo-scrollbar-wrap-2">
                    <p class="listTitle">
                        <!-- 严重异常 -->
                        {{ $t("equipmentInspection.fatalException") }}
                    </p>
                    <el-row justify="space-between" type="flex">
                        <el-col :span="23" class="m-l">
                            <el-table
                                ref="singleTable"
                                :data="detailsTableMajor"
                                highlight-current-row
                                style="width: 100%"
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
                        <el-col :span="23" class="m-l">
                            <el-table
                                ref="singleTable"
                                :data="detailsTableOrdinary"
                                highlight-current-row
                                style="width: 100%"
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
                        <el-col :span="23" class="m-l">
                            <el-table
                                ref="singleTable"
                                :data="detailsTableNote"
                                highlight-current-row
                                style="width: 100%"
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
    </div>
</template>
<script>
import TimeUtil from "@/utils/time";
require("@/assets/style/base.scss");
export default {
    name: "equipment",
    data() {
        return {
            pickerOptions: {
                disabledDate(time) {
                    // 禁用的时间
                    const nowDate = new Date().getTime();
                    const three = 91 * 24 * 3600 * 1000;
                    const threeMonths = nowDate - three;
                    return (
                        time.getTime() > Date.now() ||
                        time.getTime() < threeMonths
                    );
                },
            },
            searchLoading: false,
            config: "jsonshow",
            tableHeight: 500,
            loadingAll: false, // 导出
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
                beginDate: this.$moment(
                    new Date(new Date() - 90 * 24 * 60 * 60 * 1000)
                )
                    .startOf("day")
                    .format("YYYY-MM-DD HH:mm:ss"),
                endDate: this.$moment(new Date())
                    .endOf("day")
                    .format("YYYY-MM-DD HH:mm:ss"),
                organizeId: this.$route.query.organizeId,
                deviceCode: this.$route.query.deviceCode,
                // idString: this.$route.query.idString,
            },
            timeRange: [
                new Date(new Date() - 90 * 24 * 60 * 60 * 1000),
                new Date(),
            ],
            jsonData: "",
            params: {
                currentPage: 1, // 页码，从1开始
                pageSize: 20, // 分页大小
            },
            listData: [],
            total: 0, // 数据总数
        };
    },
    watch: {
        timeRange: {
            handler(val) {
                if (val.length > 0) {
                    this.searchForm.beginDate = this.timeRange[0]
                        ? this.$moment(this.timeRange[0])
                              .startOf("day")
                              .format("YYYY-MM-DD HH:mm:ss")
                        : "";
                    this.searchForm.endDate = this.timeRange[1]
                        ? this.$moment(this.timeRange[1])
                              .endOf("day")
                              .format("YYYY-MM-DD HH:mm:ss")
                        : "";
                } else {
                    this.searchForm.beginDate = "";
                    this.searchForm.endDate = "";
                }
            },
            deep: true,
        },
    },
    methods: {
        handleTabClick(name) {
            this.config = name.name;
        },
        search() {
            this.searchLoading = true;
            const params = Object.assign(this.params, this.searchForm);
            this.$api.getSelfCheckPage(params).then((res) => {
                if (res.success == true) {
                    res.data.results.forEach((item) => {
                        item.createTime = TimeUtil.parseTime(item.createTime);
                    });
                    this.searchLoading = false;
                    this.listData =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : this.listData;
                    this.total = res.data.totalRecords;
                } else {
                    this.searchLoading = false;
                    this.$message.error(res.msg);
                }
            });
        },
        pageChange(page) {
            this.params.currentPage = page;
            this.search();
        },
        PageSizeChange(limit) {
            this.params.pageSize = limit;
            this.search();
        },
        /**
         * 重置表单
         * */
        handleReset(name) {
            this.timeRange = [
                new Date(new Date() - 90 * 24 * 60 * 60 * 1000),
                new Date(),
            ];
        },
        showDetails(id) {
            const params = { idString: id };
            this.$api.getDevParamsDetailById(params).then((res) => {
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
                    this.showDetailBol = true;
                } else {
                    this.$message.error(res ? res.msg : "");
                }
            });
        },
        getCnNames() {
            // const params = {}
            // this.$api.getCnNames(params).then(res => {
            //   if (res.success == true) {
            //     this.dictionary = res.data
            //   }
            // })
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
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 192;
        },
        goExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.$api.doExportEQDeviceList(this.searchForm).then((res) => {
                    if (res.success == true) {
                        this.loadingAll = true;
                        const fileName = res.data.fileName;
                        const _this = this;
                        _this.getExportResultInterval = window.setInterval(
                            () => {
                                _this.$api
                                    .isExportFinished(fileName)
                                    .then((res1) => {
                                        if (
                                            res1.success == true &&
                                            res1.data == true
                                        ) {
                                            const iframe =
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
    },
    mounted() {
        const that = this;
        window.onresize = () =>
            (() => {
                that.setTableHeight();
            })();
    },
    created() {
        this.search();
        this.setTableHeight();
        this.getCnNames();
    },
};
</script>
<style scoped lang="less">
.start-config-content {
    height: calc(~"100% - 59px");
    overflow-y: hidden;
    .el-scrollbar {
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }
}
.listTitle {
    padding: 10px 0 10px 1.5rem;
    color: black;
    font-weight: 600;
}
.jsonContent {
    height: calc(~"100% - 59px");
    overflow-y: auto;
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
        .el-form-item {
            margin-bottom: 12px !important;
        }
    }
    .wrap-bottom {
        border-top: 1px solid #e4e4e4;
    }
    .hidden {
        height: 86px;
        overflow: hidden;
    }
}
.equipment-inspection {
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
</style>
<style lang="less">
.zijian {
    .el-dialog__body {
        padding-top: 0px;
        height: calc(~"100% - 70px");
        pre {
            margin: 0px !important;
        }
    }
    .el-dialog__header {
        background: #000000;
        padding: 20px;
        .zijian-title {
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
</style>
