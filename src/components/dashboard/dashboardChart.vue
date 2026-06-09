<template>
    <div v-show="showItem" style="background-color: white">
        <div class="task-item m-sm">
            <span class="marginTop">
                <!-- 本月升级统计 -->
                {{ $t("dashboard.monthUpgradeStatistics") }}
            </span>
        </div>
        <div>
            <el-row type="flex" justify="space-between">
                <el-col :span="9">
                    <div id="main10" style="width: 100%; height: 400px"></div>
                </el-col>
                <el-col :span="15">
                    <div id="main12" style="width: 98%; height: 400px"></div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
export default {
    name: "dashboardChart",
    data() {
        return {
            show: true,
            showItem: false,
            searching: false,
            markLineOption: null,
            dateList: "",
            dateData: "",
            title: "",
            idName: "",
            max: "",
            formatter: "",
            axisLabelFormatter: "",
        };
    },
    props: {
        showItemBoolean: {
            type: Boolean,
            default: false,
        },
        showItems: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    watch: {
        showItemBoolean: {
            handler(val) {
                document.getElementsByTagName("canvas")[0].style.width =
                    document.getElementById("main10").clientWidth + "px";
                document.getElementsByTagName("canvas")[1].style.width =
                    document.getElementById("main12").clientWidth + "px";
            },
            deep: true,
            immediate: false,
        },
        showItems: {
            handler(val) {
                this.getData();
                if (val.length) {
                    val.forEach((item) => {
                        if (item["id"] == 5) {
                            this.showItem = item["showBol"];
                        }
                    });
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        myEchartspie(dateData, title, idName) {
            let myChart = this.$echarts.init(document.getElementById(idName));
            let option = {
                // 图形中间文字
                title: [
                    {
                        // text: "升级成功率",
                        text: this.$t("dashboard.upgradeSuccessRate"),
                        subtext: title,
                        top: "45%",
                        left: "center",
                        itemGap: 10, //主副标题的间距
                        textStyle: {
                            fontSize: 12,
                            fontWeight: "normal",
                        },
                        subtextStyle: {
                            fontSize: 26,
                            color: "black",
                            fontWeight: "bolder",
                        },
                    },
                    {
                        top: "4%",
                        left: "6%",
                        textStyle: {
                            fontSize: 14,
                            fontWeight: "normal",
                        },
                        text: this.$t("dashboard.equipUpgradeSuccessRate"), //"设备升级成功率",
                    },
                ],
                tooltip: {
                    trigger: "item",
                    formatter: "{b}:{c} ({d}%)",
                },
                //图列，底部文字
                legend: {
                    bottom: "3%",
                    left: "center",
                    icon: "circle",
                    formatter: function (name) {
                        //修改关键
                        let str;
                        let target;
                        str = name.replace("设备", "");
                        target = str.replace("升级", "");
                        let arr = [target];
                        return arr.join("\n");
                    },
                },
                series: [
                    {
                        type: "pie",
                        color: ["#389EFD", "#F9D135", "#955DE2", "#F04864"],
                        radius: ["30%", "55%"],
                        avoidLabelOverlap: true,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: "#fff",
                            borderWidth: 2,
                        },
                        // label: {
                        //     textStyle: {
                        //         fontSize: window.window.screen.width * 0.006,
                        //     },
                        // },
                        labelLine: {
                            show: true,
                        },
                        data: dateData,
                    },
                ],
            };
            myChart.setOption(option);
            this.searching = false;
        },
        myEcharts(
            dateList,
            dateData,
            title,
            idName,
            max,
            formatter,
            axisLabelFormatter,
            markLineOption
        ) {
            var myChart = this.$echarts.init(document.getElementById(idName));
            var option = {
                color: ["#389EFD"],
                title: {
                    top: "4%",
                    textStyle: {
                        fontSize: 14,
                        fontWeight: "normal",
                    },
                    text: title,
                },
                tooltip: {
                    trigger: "axis",
                    formatter: formatter,
                },
                grid: {
                    left: "2%",
                    right: "5%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: "category",
                        // boundaryGap: false,
                        data: dateList,
                        axisLabel: {
                            rotate: 60,
                        },
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                        min: 0,
                        max: max,
                        axisLabel: {
                            formatter: "{value}%",
                        },
                    },
                ],
                series: [
                    {
                        type: "bar",
                        barWidth: "40%",
                        data: dateData,
                    },
                ],
            };
            myChart.setOption(option);
            window.addEventListener("resize", () => {
                myChart.resize();
            });
            this.searching = false;
        },
        getData() {
            let dateList = [];
            let dateData = [];
            let dateDataPie = [];
            this.searching = true;

            //模拟获取到的数据
            this.$api
                .getUpgradeStatistics()
                .then((res) => {
                    if (res.success == true) {
                        let total = res.data.totalNum;
                        let tarValue = 0;
                        for (var i in res.data) {
                            if (i == "successNum") {
                                tarValue = res.data[i];
                            }
                        }
                        let p = 0;
                        if (tarValue == 0) {
                            p = 0;
                        } else {
                            p = (tarValue / total) * 100;
                        }

                        let titlePie = Math.round(p * 100) / 100 + "%";

                        for (let index in res.data) {
                            if (index == "failNum" && res.data[index] !== 0) {
                                dateDataPie.push({
                                    value: res.data[index],
                                    name: this.$t("dashboard.dateDataPieText1"), //"升级失败设备",
                                    id: 1,
                                });
                            }
                            if (index == "ingNum" && res.data[index] !== 0) {
                                dateDataPie.push({
                                    value: res.data[index],
                                    name: this.$t("dashboard.dateDataPieText2"), //"升级进行中设备",
                                    id: 3,
                                });
                            }
                            if (index == "stopNum" && res.data[index] !== 0) {
                                dateDataPie.push({
                                    value: res.data[index],
                                    name: this.$t("dashboard.dateDataPieText3"), // "升级终止设备",
                                    id: 2,
                                });
                            }
                            if (
                                index == "successNum" &&
                                res.data[index] !== 0
                            ) {
                                dateDataPie.push({
                                    value: res.data[index],
                                    name: this.$t("dashboard.dateDataPieText4"), // "升级成功设备",
                                    id: 4,
                                });
                            }
                        }
                        dateDataPie.sort(function (a, b) {
                            return b.id - a.id;
                        });
                        dateDataPie.forEach((item, index) => {
                            Object.assign(item, {
                                label: {
                                    // 单独显示该数据项
                                    show: true,
                                    formatter: "{b}: \n {c} ({d}%)",
                                    position: "outer",
                                    color: "#595959", // 提示文字颜色
                                    fontSize: 12, // 提示文字大小
                                },
                            });
                        });
                        this.$nextTick(() => {
                            this.myEchartspie(dateDataPie, titlePie, "main10");
                        });
                    } else {
                        this.$message.error(res.msg);
                        this.searching = false;
                    }
                })
                .catch((err) => {
                    this.searching = false;
                });

            //模拟柱状图数据
            this.$api
                .getUpgradeStatisticsOnVersion()
                .then((res) => {
                    if (res.success == true) {
                        const data = res.data;
                        data.map((i) => {
                            // if(i.softwareVersion == undefined) {
                            //   i.softwareVersion =''
                            // }
                            if (!i.softwareVersion) {
                                i.softwareVersion = "";
                            }
                            dateList.push(i.softwareVersion);
                            dateData.push(i.successRate * 100);
                        });

                        this.markLineOption = null;
                        this.myEcharts(
                            dateList,
                            dateData,
                            this.$t("dashboard.dateDataPieText5"), //"设备版本升级成功率",
                            "main12",
                            null,
                            "{b}<br />: {c}%",
                            null,
                            this.markLineOption
                        );
                    } else {
                        this.$message.error(res.msg);
                        this.searching = false;
                    }
                })
                .catch((err) => {
                    this.searching = false;
                });
        },
        canvasResize() {
            document.getElementsByTagName("canvas")[0].style.width =
                document.getElementById("main10").clientWidth + "px";
            document.getElementsByTagName("canvas")[1].style.width =
                document.getElementById("main12").clientWidth + "px";
        },
    },
    mounted() {
        this.getData();
        window.addEventListener("resize", this.canvasResize);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.canvasResize);
    },
};
</script>
<style scoped lang="less">
.task-item {
    font-size: 14px;
    border-bottom: 1px solid #dfdfdf;
    height: 40px;
    line-height: 40px;
    .config-detail {
        color: #4886ff;
        cursor: pointer;
        float: right;
        margin-right: 20px;
    }
    .marginTop {
        font-weight: bold;
        margin-left: 20px;
    }
}
</style>
