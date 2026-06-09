<template>
    <div class="wrap">
        <div class="wrap-top" ref="searchBox">
            <div class="m-t" :class="{ hidden: !buttonClick }" ref="wrap">
                <el-form
                    ref="form"
                    label-position="top"
                    :model="searchForm"
                    inline
                >
                    <el-form-item label="车牌号" prop="carId">
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
                    <el-form-item label="丢失率(%)" prop="numberRange">
                        <input-number-range
                            v-model="searchForm.numberRange"
                        ></input-number-range>
                    </el-form-item>
                    <el-form-item label="统计周期" prop="statisticDay">
                        <el-date-picker
                            :picker-options="pickerOptions"
                            v-model="searchForm.statisticDay"
                            type="week"
                            format="yyyy 第 WW 周"
                            placeholder="选择周"
                            :clearable="false"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="deviceSerialNum" label="设备序列号">
                        <el-input
                            v-model.trim="searchForm.deviceSerialNum"
                            placeholder="请输入设备序列号"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="deviceCode" label="终端手机号">
                        <el-input
                            v-model.trim="searchForm.deviceCode"
                            placeholder="请输入终端手机号"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="normalCard" label="SIM卡类型">
                        <el-select
                            v-model="searchForm.normalCard"
                            placeholder="请选择"
                            clearable
                        >
                            <el-option :value="''" :label="'全部'"></el-option>
                            <el-option :value="0" :label="'定向卡'"></el-option>
                            <el-option :value="1" :label="'正常卡'"></el-option>
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
                    @click="
                        params.currentPage = 1;
                        getData(true);
                    "
                    >查询</el-button
                >
                <el-button type="default" @click="handleReset($refs.searchForm)"
                    >清除条件</el-button
                >
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
        <div class="wrap-top" ref="searchBtn">
            <div>
                <el-button
                    @click="goExport"
                    :disabled="loadingAll"
                    :loading="loadingAll"
                    v-btn="'alarmAttachLostExport'"
                    >导出</el-button
                >
            </div>
        </div>
        <!-- <div ref="searchAlert" class="wrap-top">
            <el-alert
                style="margin-top: 1rem"
                title="附件丢失率大于等于设置的“附件丢失率赋值”的才会被统计进入附件丢失严重报表！"
                :closable="true"
                type="success"
                simple
                @close="closeAlert"
            ></el-alert>
        </div> -->
        <el-table
            class="m-t"
            @sort-change="sortChange"
            v-loading="searchLoading"
            :element-loading-text="$t('common.desperatelyLoading')"
            element-loading-color="#007213"
            :height="tableHeight"
            :data="tableData"
            force-scroll="horizontal"
            style="width: 100%"
            border
            stripe
        >
            <el-table-column
                prop="plateNum"
                label="车牌号"
                width="140px"
                fixed="left"
            ></el-table-column>
            <el-table-column
                prop="orgName"
                label="所属组织"
                show-overflow-tooltip
                width="200px"
                fixed="left"
            ></el-table-column>
            <el-table-column
                prop="attachLostRate"
                label="报警附件丢失率"
                sortable
                width="150px"
                fixed="left"
            >
                <template slot-scope="scope">
                    <span> {{ scope.row.attachLostRate }}% </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="alarmAttachUploadNum"
                label="报警上传附件数"
                min-width="120px"
            >
            </el-table-column>
            <el-table-column
                prop="alarmAttachTotalNum"
                label="报警附件总数"
                min-width="120px"
            >
            </el-table-column>
            <el-table-column prop="alarmNum" label="报警数" min-width="120px">
            </el-table-column>
            <el-table-column
                prop="normalCard"
                label="SIM卡类型"
                min-width="120px"
            >
                <template slot="header" slot-scope="scope">
                    <div>
                        <span> SIM卡类型 </span>
                        <el-tooltip effect="light">
                            <div slot="content">
                                <div
                                    style="
                                        display: flex;
                                        align-items: center;
                                        font-size: 1rem;
                                        color: #ffa900;
                                    "
                                >
                                    <i class="iconfont icon-jinggao"></i>
                                    SIM卡类型：若安装时，设备绑定的物联网卡，需联系运营商开通相关的域名或IP
                                </div>
                                <div
                                    style="
                                        padding: 1rem 0;
                                        font-size: 1rem;
                                        color: #000;
                                    "
                                >
                                    808协议接入
                                </div>
                                <el-table
                                    :data="msgTableData1"
                                    style="width: 500px"
                                    class="domainName-table"
                                >
                                    <el-table-column
                                        prop="name"
                                        label="域名/IP(推荐使用域名)"
                                        width="260"
                                    >
                                    </el-table-column>
                                    <el-table-column prop="msg" label="描述">
                                    </el-table-column>
                                    <el-table-column
                                        prop="need"
                                        label="是否必需"
                                        width="110"
                                    >
                                    </el-table-column>
                                </el-table>
                                <div class="m-t" style="float: right">
                                    <el-button type="primary" @click="copyText"
                                        >复制域名/IP</el-button
                                    >
                                </div>
                            </div>
                            <i class="el-icon-question"> </i>
                        </el-tooltip>
                    </div>
                </template>
                <template slot-scope="scope">
                    <span v-if="scope.row.normalCard === 0"> 定向卡 </span>
                    <span v-else-if="scope.row.normalCard === 1"> 正常卡 </span>
                    <span v-else> -- </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="deviceVersion"
                label="设备版本号"
                min-width="180px"
            >
            </el-table-column>
            <el-table-column
                prop="deviceModelCode"
                label="设备型号"
                min-width="180px"
                :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
                prop="deviceSerialNum"
                label="设备序列号"
                min-width="120px"
            >
            </el-table-column>
            <el-table-column prop="deviceCode" label="终端手机号" width="120px">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100px">
                <template slot-scope="scope">
                    <a
                        @click="goTrend(scope.row.deviceCode)"
                        v-btn="'alarmAttachLostAttachmentLossRate'"
                        >趋势</a
                    >
                </template>
            </el-table-column>
        </el-table>
        <div class="wrap-bottom p-x" ref="searchPagination">
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
            title="附件丢失率趋势"
            :visible.sync="dialogVisible"
            :width="'1200px'"
        >
            <div>
                <div class="echarts-warn">
                    <i class="el-icon-warning"></i>
                    <span>附件丢失率趋势仅展示严重丢失的数据</span>
                </div>
                <div id="echarts-box"></div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import inputNumberRange from "@/components/inputNumberRange.vue";
import timer from "@/utils/time";
export default {
    name: "maintainRecord",
    components: { inputNumberRange },
    data() {
        return {
            msgTableData1: [
                {
                    name: "iot81.hikvisionauto.com或47.110.152.146",
                    msg: "JT/T 808设备接入（接入18884端口）；\n固件下载、参数配置文件对应的IP，19999端口；\n预览、录像回放；",
                    need: "必需",
                },
                {
                    name: "47.114.190.241",
                    msg: "设备上传调试日志到ftp服务器；\n设备上传录像文件到ftp（万一客户平台无法下载录像文件，可通过运维平台下载；）",
                    need: "必需",
                },
                {
                    name: "*.aliyuncs.com",
                    msg: "设备上传各类日志到对象存储服务，通过运维平台去操作设备上传的日志；",
                    need: "按实际情况配置",
                },
            ],
            closeFlag: true,
            loading: false,
            searchLoading: false,
            searchForm: {
                plateArr: [],
                plateJson: {},
                carId: "",
                plateNum: "",
                deviceCode: "",
                deviceSerialNum: "",
                orderDir: "desc",
                numberRange: [],
                statisticDay: this.$moment()
                    .subtract(this.$moment().format("E") - 1 + 7, "days")
                    .format("YYYY-MM-DD"),
                normalCard: "",
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },
            total: 0,
            tableHeight: 500,
            tableData: [],
            buttonClick: false,
            iconShow: false,
            query: "",
            pickerOptions: {
                firstDayOfWeek: 1,
                disabledDate(time) {
                    let day = Date.now();
                    let limit = timer.getMon(day);
                    let limitTime = new Date(limit);
                    return time.getTime() > limitTime.getTime() - 8.64e7;
                },
            },
            chart: null,
            dialogVisible: false,
            trendData: [],
            loadingAll: false,
        };
    },
    computed: {},
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
        "searchForm.numberRange": {
            handler(val) {
                this.searchForm.maxAttachLostRate = val[1];
                this.searchForm.minAttachLostRate = val[0];
            },
            immediate: true,
        },
        // "searchForm.week": {
        //     handler(val) {
        //         if (val) {
        //             this.searchForm.startTime =
        //                 this.$moment(val).format("YYYY-MM-DD");
        //             this.searchForm.endTime = this.$moment(val)
        //                 .add(7, "d")
        //                 .format("YYYY-MM-DD");
        //         } else {
        //             this.searchForm.startTime = "";
        //             this.searchForm.endTime = "";
        //         }
        //     },
        //     immediate: true,
        // },
    },
    methods: {
        //对接接口的排序方法
        sortChange(column, prop, order) {
            this.searchForm.orderDir = !column.order
                ? ""
                : column.order === "ascending"
                ? "asc"
                : "desc";
            this.searchForm.orderColumn = !column.prop ? "" : column.prop;
            this.getData();
        },
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
        // 重置表单
        handleReset(ref) {
            this.$refs["form"].resetFields();
            this.$store.dispatch("SetCondtion", this.searchForm);
        },
        //查询
        getData(isSetCondtion) {
            this.searchLoading = true;
            let params = {};
            let carParam = Object.assign(params, this.searchForm, this.params);
            delete carParam.carId;
            delete carParam.plateArr;
            delete carParam.plateJson;
            delete carParam.numberRange;
            if (carParam.statisticDay) {
                carParam.statisticDay = this.$moment(carParam.statisticDay)
                    .subtract(
                        this.$moment(carParam.statisticDay).format("E") - 1,
                        "days"
                    )
                    .format("YYYY-MM-DD");
            }
            this.$api
                .getCarAlarmAttachLostStatisticPage(carParam)
                .then((res) => {
                    if (res.success == true) {
                        if (isSetCondtion) {
                            this.$store.dispatch("SetCondtion", {
                                ...this.searchForm,
                            });
                        }
                        this.tableData = res.data.results;
                        this.total = res.data.totalRecords;
                        this.$nextTick(() => {
                            this.setTableHeight();
                        });
                    } else {
                        this.$message.error("获取列表数据失败:" + res.msg);
                    }
                    this.searchLoading = false;
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        //查询重叠
        handleClick() {
            this.buttonClick = !this.buttonClick;
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                // this.$refs.searchAlert.clientHeight -
                this.$refs.searchPagination.clientHeight -
                97;
        },
        setWrap() {
            if (this.$refs.wrap.scrollHeight > 74) {
                this.iconShow = true;
            } else {
                this.iconShow = false;
                this.buttonClick = false;
            }
        },
        goExport() {
            //导出
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                let params = {};
                let carParam = Object.assign(
                    params,
                    this.searchForm,
                    this.params
                );
                delete carParam.carId;
                delete carParam.plateArr;
                delete carParam.plateJson;
                delete carParam.numberRange;
                if (carParam.statisticDay) {
                    carParam.statisticDay = this.$moment(carParam.statisticDay)
                        .subtract(
                            this.$moment(carParam.statisticDay).format("E") - 1,
                            "days"
                        )
                        .format("YYYY-MM-DD");
                }
                this.$api
                    .exportAttachLostStatisticPage(carParam)
                    .then((res) => {
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
                                                        : process.env
                                                              .BASE_API) +
                                                    "/excel?fileName=" +
                                                    fileName;
                                                iframe.style.display = "none";
                                                document.body.appendChild(
                                                    iframe
                                                );
                                                window.clearInterval(
                                                    _this.getExportResultInterval
                                                );
                                                _this.getExportResultInterval =
                                                    "";
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
        goTrend(deviceCode) {
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.initEcharts(deviceCode);
            });
        },
        initEcharts(deviceCode) {
            this.chart = this.$echarts.init(
                document.getElementById("echarts-box")
            ); //初始加载动节点
            this.chart.clear();
            this.chart.resize();
            let that = this;
            let option = {
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "5%",
                    containLabel: true,
                },
                xAxis: {
                    type: "category",
                    data: [],
                    axisLabel: {
                        interval: 0,
                        rotate: 40,
                    },
                },
                yAxis: {
                    type: "value",
                    axisLabel: {
                        formatter: function (value, index) {
                            return `${value}%`;
                        },
                        interval: 0,
                    },
                    min: 0,
                    max: 100,
                },
                series: [
                    {
                        data: [],
                        type: "bar",
                        barWidth: 50,
                        itemStyle: {
                            // 柱状图颜色
                            color: "#5B8FF9",
                        },
                    },
                ],
                tooltip: {
                    trigger: "item",
                    formatter: function (data, index) {
                        return (
                            `附件丢失率：${
                                that.trendData[data.dataIndex].attachLostRate ||
                                0
                            }%<br/>` +
                            `报警数：${
                                that.trendData[data.dataIndex].alarmNum || 0
                            }<br/>` +
                            `报警附件总数：${
                                that.trendData[data.dataIndex]
                                    .alarmAttachTotalNum || 0
                            }<br/>` +
                            `报警上传附件数：${
                                that.trendData[data.dataIndex]
                                    .alarmAttachUploadNum || 0
                            }<br/>` +
                            `设备版本号：${
                                that.trendData[data.dataIndex].deviceVersion ||
                                "--"
                            }<br/>` +
                            `SIM卡类型：${
                                that.trendData[data.dataIndex].normalCard === 0
                                    ? "定向卡"
                                    : that.trendData[data.dataIndex]
                                          .normalCard === 1
                                    ? "正常卡"
                                    : "--"
                            }<br/>`
                        );
                    },
                },
            };
            this.$api
                .carAlarmAttachLostTrend({
                    deviceCode: deviceCode,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.trendData = res.data.reverse();
                        this.trendData.forEach((item) => {
                            item.xData = `${this.$moment(
                                item.statisticTime.substring(0, 10)
                            )
                                .subtract(7, "days")
                                .format("YYYY.MM.DD")}-${this.$moment(
                                item.statisticTime.substring(0, 10)
                            )
                                .subtract(1, "days")
                                .format("YYYY.MM.DD")}`;
                            option.xAxis.data.push(item.xData);
                            option.series[0].data.push(
                                item.attachLostRate || 0
                            );
                        });
                        this.chart.setOption(option);
                    } else {
                        this.$message.error("获取列表数据失败:" + res.msg);
                    }
                });
        },
        closeAlert() {
            setTimeout(() => {
                this.setTableHeight();
            }, 300);
        },
        copyText() {
            let address = {
                808: [
                    {
                        IP: "iot81.hikvisionauto.com或47.110.152.146",
                        Desc: "808接入18884端口；固件下载、参数配置文件对应的IP，19999端口；预览、录像回放",
                    },
                    {
                        IP: "47.114.190.241",
                        Desc: "设备打印日志上传、录像文件上传（万一客户平台无法下载录像文件，可通过运维平台下载）",
                    },
                ],
            };
            let content = "";
            for (let key in address) {
                content = content + key + "协议\n";
                let sim = address[key];
                sim.forEach((item) => {
                    content += item.IP + "\n";
                });
            }
            this.$copyText(content).then(
                () => {
                    this.$message.success("信息已复制到剪贴板，可贴粘");
                },
                () => {
                    this.$message.error("复制失败，请重试");
                }
            );
        },
    },
    mounted() {
        this.setWrap();
        this.getData(true);
        const that = this;
        window.onresize = () =>
            (() => {
                that.setWrap();
                that.setTableHeight();
            })();
    },
    created() {},
};
</script>
<style lang="less">
.operate-select {
    .el-select-dropdown__wrap {
        position: relative;
        overflow: hidden;
    }
    .el-scrollbar__view {
        position: relative;
        height: 204px;
        overflow: hidden;
        .option-box {
            height: 164px;
            overflow-y: auto;
        }
    }
    .copy-btn {
        width: 100%;
        background: #ffffff;
        border-top: 1px solid rgb(242, 242, 242);
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: absolute;
        top: 164px;
        .el-button {
            color: #4886ff;
        }
    }
}
</style>
<style lang="less" scoped>
#echarts-box {
    width: 100%;
    height: 500px;
}
.echarts-warn {
    display: flex;
    align-items: center;
    i {
        color: #e6a23c;
        margin-right: 4px;
    }
}
.wrap {
    padding: 0px 12px;
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
        .el-form-item {
            margin-bottom: 12px !important;
        }
    }
    .wrap-bottom {
        height: 4rem;
        border-top: 1px solid #e4e4e4;
    }
    .hidden {
        height: 74px;
        overflow: hidden;
    }
}
.el-table {
    .status {
        font-size: 14px;
        font-weight: 600;
        display: block;
        text-align: center;
        display: flex;
        align-items: center;
        i {
            display: block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
        }
        &.status-1 > i {
            background: #52c41a;
        }
        &.status-2 > i {
            background: #faad14;
        }
        &.status-3 > i {
            background: #ff7777;
        }
    }
}
</style>
