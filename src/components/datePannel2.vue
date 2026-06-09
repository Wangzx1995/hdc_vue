日历面板
<template>
    <div class="date-pannel">
        <div class="title">
            <span
                :class="{
                    switch: true,
                    'el-icon-arrow-left': true,
                    'forbid-click': preStop,
                }"
                @click="changeMonth(-1)"
            ></span>
            <span>
                {{ currentYear }}&nbsp;年&nbsp;{{ currentMonth }}&nbsp;月</span
            >
            <span
                :class="{
                    switch: true,
                    'el-icon-arrow-right': true,
                    'forbid-click': afterStop,
                }"
                @click="changeMonth(1)"
            ></span>
        </div>
        <div class="content">
            <table
                cellspacing="0"
                cellpadding="0"
                class="date-table"
                @click="handleClick"
                @mousemove="handleMouseMove"
            >
                <tbody>
                    <tr style="padding: 0 0; width: 100%">
                        <div
                            style="
                                padding: 0 0.95rem;
                                background-color: rgb(245, 245, 245);
                            "
                        >
                            <th v-for="(week, key) in WEEKS" :key="key">
                                {{ week }}
                            </th>
                        </div>
                    </tr>
                    <tr
                        class="date-table__row"
                        v-for="(row, key) in rows"
                        :key="key"
                    >
                        <td
                            v-for="(cell, key) in row"
                            :key="key"
                            :class="{
                                'range-day': cell.inRange,
                                'start-day': cell.start,
                                'end-day': cell.end,
                                'select-day':
                                    selectDay == currentYM + '-' + cell.text,
                                'no-data-day': cell.noData,
                            }"
                        >
                            <div>
                                <span
                                    :class="{
                                        'has-content': cell.hasContent,
                                        'forbid-chose':
                                            cell.inTimeRange === false &&
                                            !cell.noData,
                                    }"
                                >
                                    {{
                                        nowDate ==
                                        currentYear +
                                            "-" +
                                            currentMonth +
                                            "-" +
                                            cell.text
                                            ? "今"
                                            : cell.text
                                    }}
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
const todayYear = new Date().getFullYear();
const todayMonth = new Date().getMonth() + 1;
const todayDate = new Date().getDate();
export default {
    props: {
        // 有视频数据
        currentCar: {
            type: Object,
            default: () => {
                return {};
            },
        },
        isRange: {
            type: Boolean,
            default: false,
        },
        selectDay: {
            type: String,
            default: "",
        },
        selectDayRange: {
            type: Object,
            default() {
                return {
                    minDate: "",
                    maxDate: "",
                };
            },
        },
    },
    data() {
        return {
            WEEKS: ["一", "二", "三", "四", "五", "六", "日"],
            currentYear: "",
            currentMonth: "",
            nowDate: "",
            preStop: false, //向前按钮禁用
            afterStop: false, //向后按钮禁用
            hasContent: {}, //有视频对象
            rows: [],
            rangeState: {
                endDate: null,
                selecting: false,
            },
            lastRow: null,
            lastColumn: null,
        };
    },
    computed: {
        minDate() {
            return this.isRange ? this.selectDayRange.minDate : "";
        },
        maxDate() {
            return this.isRange ? this.selectDayRange.maxDate : "";
        },
        currentYM() {
            return this.currentYear + "-" + this.currentMonth;
        },
        gpsTrackDay() {
            return this.$store.getters.getDataTimeRange.gpsTrackDay;
        },
    },
    watch: {
        "rangeState.endDate": {
            handler: function (newVal) {
                this.markRange(this.minDate, newVal);
            },
            immediate: true,
        },
        currentCar: {
            handler: function (newVal) {
                // this.currentYear = todayYear;
                // this.currentMonth = todayMonth;
                this.getOnlineDate();
            },
        },
    },
    methods: {
        changeMonth(day) {
            if (day < 0 && this.preStop) {
                return;
            }
            if (day > 0 && this.afterStop) {
                return;
            }
            let y = this.currentYear;
            let m = this.currentMonth + (day - 0);
            m == 0
                ? ((m = 12), (y = y - 1))
                : m == 13
                ? ((m = 1), (y = y + 1))
                : "";
            this.currentYear = y;
            this.currentMonth = m;
            // let now = new Date().getMonth() + 1;
            // if (now - this.currentMonth == 3 || now + 12 - this.currentMonth == 3) {
            //     this.preStop = true;
            // } else if (this.currentMonth - now == 3 || this.currentMonth + 12 - now == 3) {
            //     this.afterStop = true;
            // } else {
            //     this.preStop = false;
            //     this.afterStop = false;
            // }
            //创建月的数组
            this.createMonth(y, m);
        },
        createMonth(y, m) {
            let timeRangeMin =
                this.gpsTrackDay === undefined
                    ? "notPower"
                    : this.$moment().startOf("day").valueOf() -
                      (this.gpsTrackDay * 24 * 3600 * 1000 - 1);
            this.rows = [];
            //获取一个月有几天,只需要获取该月的最后一天是几号
            var dayNum = new Date(y, m, 0).getDate();
            let monthArr = [];
            let hasContentObj = this.hasContent;
            //遍历数组，赋值
            for (let i = 0; i < dayNum; i++) {
                monthArr.push({
                    text: i + 1,
                    hasContent:
                        hasContentObj[y + "-" + m + "-" + (i + 1)] ||
                        hasContentObj[
                            y +
                                "-" +
                                (m > 9 ? m : "0" + m) +
                                "-" +
                                (i + 1 > 9 ? i + 1 : "0" + (i + 1))
                        ],
                });
                if (
                    timeRangeMin !== "notPower" &&
                    this.$route.name === "轨迹回放"
                ) {
                    monthArr[monthArr.length - 1].inTimeRange =
                        this.$moment(
                            y +
                                "-" +
                                (m > 9 ? m : "0" + m) +
                                "-" +
                                (i + 1 > 9 ? i + 1 : "0" + (i + 1))
                        ).valueOf() > timeRangeMin;
                }
            }
            //本月的第一天是周几
            //此处注意ie和谷歌的兼容，   ie日期只支持 / / 的形式，而谷歌支持 - -  / /
            let week = new Date(y + "/" + m + "/1").getDay();
            week = week == 0 ? 6 : week - 1;
            monthArr.unshift(...new Array(week).fill({ noData: true }));
            //本月的最后一天是周几
            let week1 = new Date(y + "/" + m + "/" + dayNum).getDay();
            week1 = week1 == 0 ? 0 : 7 - week1;
            monthArr.push(...new Array(week1).fill({ noData: true }));
            let number = Math.ceil(monthArr.length / 7);
            //用slice方法，每四个截取一次
            for (var i = 0; i < number; i++)
                this.rows.push(monthArr.splice(0, 7));
        },
        handleClick(event) {
            let target = event.target;
            if (
                [...target.classList] instanceof Array &&
                [...target.classList].includes("forbid-chose")
            ) {
                return;
            }
            if (target.tagName === "SPAN") {
                target = target.parentNode.parentNode;
            }
            if (target.tagName === "DIV") {
                target = target.parentNode;
            }
            if (target.tagName !== "TD") return;
            const row = target.parentNode.rowIndex - 1;
            const column = this.selectionMode === "week" ? 1 : target.cellIndex;
            const cell = this.rows[row][column];
            // if (!cell.hasContent) return;
            if (
                JSON.stringify(cell) == "{}" ||
                cell.text === "" ||
                cell.text === undefined
            ) {
                return;
            }
            const newDate =
                this.currentYear + "-" + this.currentMonth + "-" + cell.text;
            if (!this.isRange) {
                //不是选时间范围，选某一天
                this.$emit("pick", newDate);
                return;
            }
            //选择时间范围
            if (!this.rangeState.selecting) {
                this.$emit("pick", { minDate: newDate, maxDate: null });
                this.rangeState.selecting = true;
                //设置start
                this.markRange(newDate, null);
            } else {
                if (new Date(newDate) >= new Date(this.minDate)) {
                    this.$emit("pick", {
                        minDate: this.minDate,
                        maxDate: newDate,
                    });
                } else {
                    this.$emit("pick", {
                        minDate: newDate,
                        maxDate: this.minDate,
                    });
                }
                this.rangeState.selecting = false;
            }
        },
        handleMouseMove(event) {
            if (!this.rangeState.selecting) return;
            let target = event.target;
            if (
                [...target.classList] instanceof Array &&
                [...target.classList].includes("forbid-chose")
            ) {
                return;
            }
            if (target.tagName === "SPAN") {
                target = target.parentNode.parentNode;
            }
            if (target.tagName === "DIV") {
                target = target.parentNode;
            }
            if (target.tagName !== "TD") return;

            const row = target.parentNode.rowIndex - 1;
            const column = target.cellIndex;
            // can not select disabled date
            // if (!this.rows[row][column].hasContent) return;

            // only update rangeState when mouse moves to a new cell
            // this avoids frequent Date object creation and improves performance
            if (row !== this.lastRow || column !== this.lastColumn) {
                this.lastRow = row;
                this.lastColumn = column;
                this.rangeState = {
                    selecting: true,
                    endDate:
                        this.currentYear +
                        "-" +
                        this.currentMonth +
                        "-" +
                        this.rows[row][column].text,
                };
            }
        },
        markRange(minDate, maxDate) {
            minDate = new Date(minDate);
            maxDate = maxDate ? new Date(maxDate) : minDate;
            if (minDate > maxDate) {
                let minDate0 = minDate;
                minDate = maxDate;
                maxDate = minDate0;
            }
            const rows = this.rows;
            for (let i = 0, k = rows.length; i < k; i++) {
                const row = rows[i];
                for (let j = 0, l = row.length; j < l; j++) {
                    if (this.showWeekNumber && j === 0) continue;
                    const cell = row[j];
                    const time = new Date(
                        this.currentYear +
                            "-" +
                            this.currentMonth +
                            "-" +
                            cell.text
                    );
                    cell.inRange =
                        minDate && time >= minDate && time <= maxDate;
                    cell.start = minDate && time.getTime() == minDate.getTime();
                    cell.end = maxDate && time.getTime() == maxDate.getTime();
                }
            }
            this.$forceUpdate();
        },
        //查询右侧有视频日期
        getOnlineDate() {
            // if (!this.currentCar.deviceCode) {
            //     if (!this.isRange) {
            //         this.$emit("pick", "");
            //     } else {
            //         this.$emit("pick", { minDate: "", maxDate: "" });
            //     }
            //     return;
            // }
            let params = { carNumber: this.currentCar.carNumber };
            let api = "getOnlineDateByCarNumber";
            this.hasContent = [];
            this.$api[api](params).then(
                (res) => {
                    if (res.success) {
                        if (res.data && res.data.length > 0) {
                            //将hasContent转化为对象
                            let hasContentArr = res.data;
                            let hasContentObj = {};
                            for (let key in hasContentArr) {
                                hasContentObj[hasContentArr[key]] = true;
                            }
                            this.hasContent = { ...hasContentObj };
                            if (!this.isRange) {
                                let selectDay = this.selectDay.split("-");
                                if (selectDay.length == 3) {
                                    let index =
                                        selectDay[0] +
                                        "-" +
                                        (selectDay[1] > 9
                                            ? selectDay[1]
                                            : "0" + selectDay[1]) +
                                        "-" +
                                        (selectDay[2] > 9
                                            ? selectDay[2]
                                            : "0" + selectDay[2]);
                                    if (!hasContentObj[index]) {
                                        if (!this.isRange) {
                                            this.$emit("pick", "");
                                        } else {
                                            this.$emit("pick", {
                                                minDate: "",
                                                maxDate: "",
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        this.createMonth(this.currentYear, this.currentMonth);
                        if (this.isRange) {
                            this.markRange(
                                this.selectDayRange.minDate,
                                this.selectDayRange.maxDate
                            );
                        }
                    } else {
                        if (!this.isRange) {
                            this.$emit("pick", "");
                        } else {
                            this.$emit("pick", { minDate: "", maxDate: "" });
                        }
                        this.$message({ type: "warning", message: res.msg });
                    }
                },
                () => {
                    if (!this.isRange) {
                        this.$emit("pick", "");
                    } else {
                        this.$emit("pick", { minDate: "", maxDate: "" });
                    }
                    this.$message({ type: "warning", message: res.msg });
                }
            );
        },
    },
    created() {
        let date = new Date();
        debugger;
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        this.nowDate = y + "-" + m + "-" + date.getDate();
        if (this.selectDayRange.minDate) {
            this.currentYear = Number(
                this.selectDayRange.minDate.split("-")[0]
            );
            this.currentMonth = Number(
                this.selectDayRange.minDate.split("-")[1]
            );
        } else {
            this.currentYear = y;
            this.currentMonth = m;
        }
        sub.commitSub(
            this.createMonth,
            this,
            [this.currentYear, this.currentMonth],
            "dataTimeRange.gpsTrackDay",
            "setDataTimeRange"
        );
    },
};
</script>

<style lang="less" scoped>
.forbid-chose {
    background: gainsboro !important;
    cursor: not-allowed !important;
}
.date-pannel {
    width: 100%;
    box-sizing: border-box;
    .title {
        height: 3rem;
        padding: 0 0.95rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: 1rem;
        line-height: 3rem;
        font-family: Helvetica;
        font-weight: 500;
        span.switch {
            line-height: 3rem;
            display: inline-block;
            width: 2rem;
            text-align: center;
            cursor: pointer;
            font-weight: 400;
        }
        span.forbid-click {
            cursor: not-allowed;
        }
    }
    .content {
        tr {
            width: 100%;
            display: flex;
            display: -ms-flexbox;
            padding: 0 0.95rem;
            th {
                width: 2rem;
                height: 2rem;
                line-height: 2rem;
                font-size: 0.9rem;
                text-align: center;
                border: none;
                font-weight: normal;
                color: rgba(0, 0, 0, 0.7);
            }
            td {
                font-family: Helvetica;
                font-size: 0.9rem;
                width: 2rem;
                height: 2rem !important;
                text-align: center;
                cursor: pointer;
                border: none;
                display: flex;
                justify-content: center;
                align-items: center;
                div {
                    font-family: Helvetica;
                    font-size: 0.9rem;
                    line-height: 2rem;
                    color: #aaa;
                    // cursor: not-allowed;
                    text-align: center;
                    span {
                        font-family: Helvetica;
                        font-size: 0.9rem;
                        display: inline-block;
                        color: rgba(0, 0, 0, 0.7);
                        width: 2rem;
                        height: 2rem !important;
                        margin: 0 auto;
                        text-align: center;
                    }
                    .has-content {
                        color: #409eff;
                        cursor: pointer;
                    }
                }
            }
            td.select-day div span {
                background: #409eff;
                color: #fff;
            }
            td.start-day div {
                // margin-left: 0.536rem;
                // border-top-left-radius: 50%;
                // border-bottom-left-radius: 50%;
                span {
                    color: #fff;
                    background: #409eff;
                }
            }
            td.end-day div {
                // margin-right: 0.54rem;
                // border-top-right-radius: 50%;
                // border-bottom-right-radius: 50%;
                span {
                    color: #fff;
                    background: #409eff;
                }
            }
            td.range-day div {
                width: 100%;
                background: #f2f6fc;
            }
            td.no-data-day {
                cursor: default;
            }
        }
    }
}
</style>
