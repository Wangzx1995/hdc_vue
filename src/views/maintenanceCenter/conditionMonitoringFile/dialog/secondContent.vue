<template>
    <div class="second-content" v-loading="echartLoading">
        <div class="search-box">
            <el-tooltip
                content="将导出巡检历史数据及GPS数据"
                placement="top-start"
            >
                <el-button
                    class="export-btn"
                    @click="exportEchart"
                    :loading="
                        loadingAll ||
                        !!getExportResultInterval_ ||
                        !!getExportResultInterval ||
                        !!getExportResultInterval2_
                    "
                    :disabled="loadingAll"
                    v-btn="'conditionMonitoringExportOriginalRecords'"
                >
                    导出
                </el-button>
            </el-tooltip>
            <el-date-picker
                v-model="timerange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                class="datetimerange"
                :clearable="false"
                @change="init()"
            >
            </el-date-picker>
            <div>
                故障类型：{{ fault.typeCount }} 种｜巡检故障次数：{{
                    fault.faultCount
                }}
                次
            </div>
        </div>
        <div id="fault-chart"></div>
    </div>
</template>
<script>
export default {
    name: "",
    components: {},
    props: {
        detailData: {
            type: Object,
            default: () => {},
        },
        faultTypeArr: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    data() {
        return {
            echartLoading: false,
            loadingAll: false,
            getExportResultInterval: null,
            getExportResultInterval_: null,
            getExportResultInterval2_: null,
            myChart: null,
            categoriesArr: [],
            echartsData: [],
            timerange: [
                this.$moment(new Date()).subtract(6, "day"),
                this.$moment(new Date()),
            ],
            fault: {
                typeCount: 0,
                faultCount: 0,
            },
            signalType: [6, 7, 8],
            pickerOptions: {
                onPick: ({ maxDate, minDate }) => {
                    this.choiceDate = minDate.getTime();
                    if (maxDate) this.choiceDate = "";
                },
                disabledDate: (time) => {
                    if (this.choiceDate) {
                        const minTime = this.choiceDate - 6 * 8.64e7;
                        const maxTime = this.choiceDate + 6 * 8.64e7;
                        return (
                            time.getTime() < minTime ||
                            time.getTime() > maxTime ||
                            time.getTime() < Date.now() - 90 * 8.64e7
                        );
                    } else {
                        return time.getTime() < Date.now() - 90 * 8.64e7;
                    }
                },
            },
        };
    },
    mounted() {
        this.init();
    },
    computed: {},
    watch: {
        faultTypeArr: {
            handler(val) {
                this.params = val;
                this.myEchars();
            },
            deep: true,
        },
    },
    methods: {
        //设备上下线记录
        equipmentInspectionDeviceOnlineRecord(params) {
            return new Promise((resolve, reject) => {
                this.$api
                    .equipmentInspectionDeviceOnlineRecord(params)
                    .then((res) => {
                        if (res.success == true) {
                            resolve(res.data.deviceOnlineSectionVoList);
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
            });
        },
        //根据设备、时间段 , 查询所有的巡检异常记录
        equipmentInspectionGetInspectionRecordByDeviceAllFault(params) {
            return new Promise((resolve, reject) => {
                this.$api
                    .equipmentInspectionGetInspectionRecordByDeviceAllFault(
                        params
                    )
                    .then((res) => {
                        if (res.success == true) {
                            resolve(res.data.record);
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
            });
        },
        init() {
            this.echartLoading = true;
            let params = {
                deviceCode: this.detailData.deviceCode,
                startTime: this.$moment(this.timerange[0])
                    .startOf("day")
                    .format("YYYY-MM-DD HH:mm:ss"),
                endTime: this.$moment(this.timerange[1])
                    .endOf("day")
                    .format("YYYY-MM-DD HH:mm:ss"),
            };
            this.categoriesArr = [];
            this.echartsData = [];
            Promise.all([
                this.equipmentInspectionDeviceOnlineRecord(params),
                this.equipmentInspectionGetInspectionRecordByDeviceAllFault(
                    params
                ),
            ])
                .then((result) => {
                    this.categoriesArr = ["上线状态"];
                    if (result && result[0] && result[0].length) {
                        result[0].forEach((item) => {
                            this.echartsData.push({
                                name: item.deviceStatus === 1 ? "在线" : "休眠",
                                value: [
                                    0,
                                    Math.max(
                                        +this.$moment(this.timerange[0])
                                            .startOf("day")
                                            .format("x"),
                                        +new Date(item.startTime)
                                    ),
                                    Math.min(
                                        +this.$moment(this.timerange[1])
                                            .endOf("day")
                                            .format("x"),
                                        +new Date(item.endTime)
                                    ),
                                    // +new Date(item.startTime),
                                    // +new Date(item.endTime),
                                ],
                                startTime: item.startTime,
                                endTime: item.endTime,
                            });
                        });
                    }
                    if (result && result[1] && result[1].length) {
                        this.fault.faultCount = result[1]
                            .filter(
                                (item) =>
                                    this.signalType.indexOf(item.type) < 0 &&
                                    item.inspectionFaultRecords &&
                                    item.inspectionFaultRecords.length
                            )
                            .reduce((prev, cur) => {
                                return (prev +=
                                    cur.inspectionFaultRecords.length);
                            }, 0);
                        this.fault.typeCount = result[1].filter(
                            (item) =>
                                item.inspectionFaultRecords &&
                                item.inspectionFaultRecords.length &&
                                this.signalType.indexOf(item.type) < 0
                        ).length;
                        this.categoriesArr = [
                            ...new Set(this.categoriesArr),
                            ...new Set(
                                result[1].reduce((prev, cur) => {
                                    return prev.concat(cur["typeName"]);
                                }, [])
                            ),
                        ];
                        result[1].forEach((i) => {
                            i.inspectionFaultRecords.forEach((item) => {
                                this.echartsData.push({
                                    name:
                                        this.signalType.indexOf(item.type) < 0
                                            ? "故障"
                                            : "信号传入",
                                    value: [
                                        this.categoriesArr.findIndex(
                                            (k) => k === item.typeName
                                        ),
                                        // +new Date(item.startTime),
                                        // +new Date(item.endTime),
                                        Math.max(
                                            +this.$moment(this.timerange[0])
                                                .startOf("day")
                                                .format("x"),
                                            +new Date(item.startTime)
                                        ),
                                        Math.min(
                                            +this.$moment(this.timerange[1])
                                                .endOf("day")
                                                .format("x"),
                                            +new Date(item.endTime)
                                        ),
                                    ],
                                    reason: item.reason,
                                    advice: item.advice,
                                    startTime: item.startTime,
                                    endTime: item.endTime,
                                });
                            });
                        });
                    }
                    // if (result && result[1] && result[1].length) {
                    //     this.fault.faultCount = result[1].length;
                    //     this.fault.typeCount = [
                    //         ...new Set(
                    //             result[1].reduce((prev, cur) => {
                    //                 return prev.concat(cur["typeName"]);
                    //             }, [])
                    //         ),
                    //     ].length;
                    //     this.categoriesArr = [
                    //         ...new Set(this.categoriesArr),
                    //         ...new Set(
                    //             result[1].reduce((prev, cur) => {
                    //                 return prev.concat(cur["typeName"]);
                    //             }, [])
                    //         ),
                    //     ];
                    //     result[1].forEach((item) => {
                    //         this.echartsData.push({
                    //             name:
                    //                 this.signalType.indexOf(item.type) < 0
                    //                     ? "故障"
                    //                     : "信号传入",
                    //             value: [
                    //                 this.categoriesArr.findIndex(
                    //                     (k) => k === item.typeName
                    //                 ),
                    //                 // +new Date(item.startTime),
                    //                 // +new Date(item.endTime),
                    //                 Math.max(
                    //                     +this.$moment(this.timerange[0])
                    //                         .startOf("day")
                    //                         .format("x"),
                    //                     +new Date(item.startTime)
                    //                 ),
                    //                 Math.min(
                    //                     +this.$moment(this.timerange[1])
                    //                         .endOf("day")
                    //                         .format("x"),
                    //                     +new Date(item.endTime)
                    //                 ),
                    //             ],
                    //             reason: item.reason,
                    //             advice: item.advice,
                    //             startTime: item.startTime,
                    //             endTime: item.endTime,
                    //         });
                    //     });
                    // }
                    this.myEchars();
                    setTimeout(() => {
                        this.echartLoading = false;
                    }, 300);
                })
                .catch(() => {
                    this.echartLoading = false;
                });
        },
        myEchars() {
            this.myChart = this.$echarts.init(
                document.getElementById("fault-chart")
            );
            let that = this;
            function renderItem(params, api) {
                var categoryIndex = api.value(0);
                var start = api.coord([api.value(1), categoryIndex]);
                var end = api.coord([api.value(2), categoryIndex]);
                var height =
                    api.size([0, 1])[1] - (25 - that.categoriesArr.length);
                var rectShape = that.$echarts.graphic.clipRectByRect(
                    {
                        x: start[0],
                        y: start[1] - height / 2,
                        width: end[0] - start[0],
                        height: height,
                    },
                    {
                        x: params.coordSys.x,
                        y: params.coordSys.y,
                        width: params.coordSys.width,
                        height: params.coordSys.height,
                    }
                );

                return (
                    rectShape && {
                        type: "rect",
                        transition: ["shape"],
                        shape: rectShape,
                        style: api.style(),
                    }
                );
            }

            var option = {
                grid: {
                    show: true,
                    left: 150,
                    right: 70,
                    bottom: 60,
                    top: 25,
                    backgroundColor: "rgba(224,224,224,0.30)",
                },
                tooltip: {
                    enterable: true, //滚动条
                    extraCssText:
                        "max-width:60%;max-height:83%; overflow: auto; ", //滚动条
                    position: function (point, params, dom, rect, size) {
                        //其中point为当前鼠标的位置，
                        //size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
                        // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
                        // 提示框位置
                        var x = 0; // x坐标位置
                        var y = 0; // y坐标位置
                        // 当前鼠标位置
                        var pointX = point[0];
                        var pointY = point[1];
                        // 提示框大小
                        var boxWidth = size.contentSize[0];
                        var boxHeight = size.contentSize[1];
                        // boxWidth > pointX 说明鼠标左边放不下提示框
                        if (boxWidth > pointX) {
                            x = 5;
                        } else {
                            // 左边放的下
                            x = pointX - boxWidth;
                        }
                        // boxHeight > pointY 说明鼠标上边放不下提示框
                        if (boxHeight > pointY) {
                            y = 5;
                        } else {
                            // 上边放得下
                            y = pointY - boxHeight;
                        }
                        return [x, y];
                    },
                    formatter: function (params) {
                        let str = that.categoriesArr[params.value[0]] + "<br/>";
                        if (params.name === "故障") {
                            str +=
                                "开始时间：" +
                                params.data.startTime +
                                "<br/>" +
                                "异常原因：" +
                                (params.data.reason || "--") +
                                "<br/>解决建议：" +
                                (params.data.advice.replace(/\n/g, "<br>") ||
                                    "--");
                        } else {
                            str +=
                                "时间范围：" +
                                params.data.startTime +
                                " 至 " +
                                params.data.endTime;
                        }
                        return str;
                    },
                },
                legend: {
                    show: true,
                    data: ["故障", "信号传入", "在线", "休眠"],
                    right: "70",
                },
                xAxis: {
                    type: "time",
                    show: true,
                    min: +new Date(
                        this.$moment(this.timerange[0])
                            .startOf("day")
                            .format("YYYY-MM-DD HH:mm:ss")
                    ),
                    max: +new Date(
                        this.$moment(this.timerange[1])
                            .endOf("day")
                            .format("YYYY-MM-DD HH:mm:ss")
                    ),
                    axisPointer: {
                        type: "shadow",
                    },
                    axisLabel: {
                        showMaxLabel: true,
                        formatter: function (val) {
                            return that.$moment(val).format("MM-DD HH:mm"); // 格式化
                        },
                        color: "#333",
                    },
                    axisLine: {
                        // x轴线段
                        show: true,
                        lineStyle: {
                            type: "solid",
                            color: "#cccccc",
                        },
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: "dashed",
                            color: "#cccccc",
                        },
                    },
                },
                yAxis: {
                    data: that.categoriesArr,
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        // y轴颜色
                        show: true,
                        lineStyle: {
                            color: "#cccccc",
                        },
                    },
                    axisLabel: {
                        // 文字颜色
                        textStyle: {
                            color: "#000000",
                        },
                        // rich: {
                        //     a1: {
                        //         backgroundColor: {
                        //             image: "/static/images/conditionMonitoring/fault.svg",
                        //         },
                        //         width: 12,
                        //         height: 12,
                        //     },
                        // },
                        // formatter: (params, i) => {
                        //     return [
                        //         (params == "上线状态" ? "" : "{a1|}") +
                        //             "  " +
                        //             params,
                        //     ];
                        // },
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            width: 25 - this.categoriesArr.length,
                            type: "solid",
                            color: "#ffffff",
                        },
                    },
                },
                series: [
                    {
                        name: "故障",
                        type: "custom",
                        renderItem: renderItem,
                        itemStyle: {
                            opacity: 1,
                            color: "#FFA39E",
                        },
                        encode: {
                            x: [1, 2],
                            y: 0,
                        },
                        data: this.echartsData.filter(
                            (item) => item.name === "故障"
                        ),
                    },
                    {
                        name: "信号传入",
                        type: "custom",
                        renderItem: renderItem,
                        itemStyle: {
                            opacity: 1,
                            color: "#1B8BF1",
                        },
                        encode: {
                            x: [1, 2],
                            y: 0,
                        },
                        data: this.echartsData.filter(
                            (item) => item.name === "信号传入"
                        ),
                    },
                    {
                        name: "在线",
                        type: "custom",
                        renderItem: renderItem,
                        itemStyle: {
                            opacity: 1,
                            color: "#52C41A",
                        },
                        encode: {
                            x: [1, 2],
                            y: 0,
                        },
                        data: this.echartsData.filter(
                            (item) => item.name === "在线"
                        ),
                    },

                    {
                        name: "休眠",
                        type: "custom",
                        renderItem: renderItem,
                        itemStyle: {
                            opacity: 1,
                            color: "#FFCC00",
                        },
                        encode: {
                            x: [1, 2],
                            y: 0,
                        },
                        data: this.echartsData.filter(
                            (item) => item.name === "休眠"
                        ),
                    },
                ],
                dataZoom: [
                    {
                        show: true,
                        filterMode: "none",
                        bottom: "10",
                        showDataShadow: true,
                        start: 0,
                        end: 100,
                    },
                    {
                        type: "inside",
                        start: 0,
                        end: 100,
                    },
                    {
                        show: true,
                        yAxisIndex: 0,
                        filterMode: "none",
                        width: 30,
                        height: "80%",
                        showDataShadow: true,
                        top: "50",
                        right: "20",
                    },
                ],
                // dataZoom: {
                //     show: true, // 为true 滚动条出现
                //     realtime: true, // 实时更新
                //     type: "slider", // 有type这个属性，滚动条在最下面，也可以不行，写y：36，这表示距离顶端36px，一般就是在图上面。
                //     // height: 12, // 表示滚动条的高度，也就是粗细
                //     // start: 20, // 表示默认展示20%～80%这一段。
                //     // height: "30%",
                //     bottom: "0%",
                //     moveHandleSize: 48,
                // },
            };
            this.myChart.setOption(option);
            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                this.myChart.resize();
            });
            this.$nextTick(() => {
                setTimeout(() => {
                    this.myChart.resize();
                }, 1);
            });
        },
        exportEchart() {
            this.loadingAll = true;
            let params = {
                deviceCode: this.detailData.deviceCode,
                startTime: this.$moment(this.timerange[0])
                    .startOf("day")
                    .format("YYYY-MM-DD"),
                endTime: this.$moment(this.timerange[1])
                    .endOf("day")
                    .format("YYYY-MM-DD"),
            };
            this.$api.exportInspectionRecordHis(params).then((res) => {
                if (res.success == true) {
                    let fileName = res.data.fileName;
                    let _this = this;
                    _this.getExportResultInterval = window.setInterval(
                        function () {
                            _this.$api
                                .isExportFinished(fileName)
                                .then((res1) => {
                                    if (res1.success == true) {
                                        if (res1.data == true) {
                                            let iframe =
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
                                    } else {
                                        _this.loadingAll = false;
                                        window.clearInterval(
                                            _this.getExportResultInterval
                                        );
                                        _this.getExportResultInterval = "";
                                    }
                                });
                        },
                        2000
                    );
                    _this.$api
                        .equipmentInspectionExportGps(params)
                        .then((_res) => {
                            if (_res.success == true) {
                                let fileName_ = _res.data.fileName;
                                _this.getExportResultInterval2_ =
                                    window.setInterval(function () {
                                        _this.$api
                                            .isExportFinished(fileName_)
                                            .then((res_1) => {
                                                if (res_1.success == true) {
                                                    if (res_1.data == true) {
                                                        let iframe_ =
                                                            document.createElement(
                                                                "iframe"
                                                            );
                                                        iframe_.src =
                                                            (process.env
                                                                .BASE_API == "/"
                                                                ? ""
                                                                : process.env
                                                                      .BASE_API) +
                                                            "/excel?fileName=" +
                                                            fileName_;
                                                        iframe_.style.display =
                                                            "none";
                                                        document.body.appendChild(
                                                            iframe_
                                                        );
                                                        window.clearInterval(
                                                            _this.getExportResultInterval2_
                                                        );
                                                        _this.getExportResultInterval2_ =
                                                            "";
                                                        _this.loadingAll = false;
                                                    }
                                                } else {
                                                    _this.$message.error(
                                                        "导出GPS失败"
                                                    );
                                                    _this.loadingAll = false;
                                                    window.clearInterval(
                                                        _this.getExportResultInterval2_
                                                    );
                                                    _this.getExportResultInterval2_ =
                                                        "";
                                                }
                                            });
                                    }, 2000);
                            } else {
                                _this.$message.error(res.msg);
                                _this.loadingAll = false;
                            }
                        });
                } else {
                    this.$message.error(res.msg);
                    let _this = this;
                    _this.$api
                        .equipmentInspectionExportGps(params)
                        .then((_res) => {
                            if (_res.success == true) {
                                let fileName_ = _res.data.fileName;
                                _this.getExportResultInterval_ =
                                    window.setInterval(function () {
                                        _this.$api
                                            .isExportFinished(fileName_)
                                            .then((res_1) => {
                                                if (res_1.success == true) {
                                                    if (res_1.data == true) {
                                                        let iframe_ =
                                                            document.createElement(
                                                                "iframe"
                                                            );
                                                        iframe_.src =
                                                            (process.env
                                                                .BASE_API == "/"
                                                                ? ""
                                                                : process.env
                                                                      .BASE_API) +
                                                            "/excel?fileName=" +
                                                            fileName_;
                                                        iframe_.style.display =
                                                            "none";
                                                        document.body.appendChild(
                                                            iframe_
                                                        );
                                                        window.clearInterval(
                                                            _this.getExportResultInterval_
                                                        );
                                                        _this.getExportResultInterval_ =
                                                            "";
                                                        _this.loadingAll = false;
                                                    }
                                                } else {
                                                    _this.$message.error(
                                                        "导出GPS失败"
                                                    );
                                                    _this.loadingAll = false;
                                                    window.clearInterval(
                                                        _this.getExportResultInterval_
                                                    );
                                                    _this.getExportResultInterval_ =
                                                        "";
                                                }
                                            });
                                    }, 2000);
                            } else {
                                _this.$message.error(res.msg);
                                _this.loadingAll = false;
                            }
                        });
                }
            });
        },
    },
};
</script>
<style lang="less" scoped>
.second-content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .search-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
    }
}
#fault-chart {
    margin-top: 14px;
    height: calc(~"100% - 32px - 14px");
    width: 100%;
    background-color: #fff;
}
</style>
