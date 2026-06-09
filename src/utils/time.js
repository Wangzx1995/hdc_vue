import "date-format-lite";

const DATE_TIME_FORMATTER = "YYYY-MM-DD hh:mm:ss";
const DATE_FORMATTER = "YYYY-MM-DD";
const TIME_FORMATTER = "hh:mm:ss";

export default {
    name: "time",
    /**
     * @param {Number} millisecond 时间差：秒
     * @returns format as "00:00:00"
     */
    formatTime(millisecond) {
        let seconds = Math.round(millisecond);
        let result = [];
        let count = 2;
        while (count >= 0) {
            let current = Math.floor(seconds / 60 ** count);
            result.push(current);
            seconds -= current * 60 ** count;
            --count;
        }
        return result.map((item) => (item <= 9 ? `0${item}` : item)).join(":");
    },
    /**
     * 格式化时间
     * @param {string} time 时间
     * @param {string} formatter 格式
     * @return {string}
     */
    format(time, formatter) {
        return time ? time.date(formatter) : "";
    },

    /**
     * 年-月-日 时:分:秒
     * @param {string} time 时间
     * @return {string}
     */
    getDateTime(time) {
        return this.format(time, DATE_TIME_FORMATTER);
    },

    /**
     * 年-月-日
     * @param {string} time 时间
     * @return {string}
     */
    getDate(time) {
        return this.format(time, DATE_FORMATTER);
    },

    /**
     * 时:分:秒
     * @param {string} time 时间
     * @return {string}
     */
    getTime(time) {
        return this.format(time, TIME_FORMATTER);
    },

    /**
     * 在 time 基础上加 unit 秒、分钟...
     * @param {string} time 时间
     * @param {string} num 数量
     * @param {string} unit 单位（eg: seconds, minutes, hours, days, weeks, months, years）
     */
    add(time, num, unit) {
        return this.format(time).add(num, unit);
    },

    /**
     * 年-月-日 时:分:秒
     * @param {string} time 时间
     * @param {string} formatter 格式
     * @return {string}
     */
    parseTime(time, formatter) {
        if (arguments.length === 0) {
            return null;
        }
        if (time == undefined || time == null || time == 0) {
            return "";
        }
        if ((time + "").length === 10) {
            time = +time * 1000;
        }

        const format = formatter || "{y}-{m}-{d} {h}:{i}:{s}";
        let date;
        if (typeof time == "object") {
            date = time;
        } else {
            if (("" + time).length === 10) time = parseInt(time) * 1000;
            date = new Date(time);
        }
        const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay(),
        };
        const time_str = format.replace(
            /{(y|m|d|h|i|s|a)+}/g,
            (result, key) => {
                let value = formatObj[key];
                if (key === "a")
                    return ["一", "二", "三", "四", "五", "六", "日"][
                        value - 1
                    ];
                if (result.length > 0 && value < 10) {
                    value = "0" + value;
                }
                return value || 0;
            }
        );
        return time_str;
    },

    /**
     * 年-月-日 时:分:秒
     * @param {string} time 时间
     * @param {string} option 格式
     * @return {string}
     */
    timeAgo(time, option) {
        if (typeof time == "string") {
            time = new Date(Date.parse(time)) / 1000;
        }
        if (time.toString().length < 13) {
            time = +time * 1000;
        }
        const d = new Date(time);
        const now = Date.now();

        const diff = (now - d) / 1000;

        if (diff < 30) {
            return "刚刚";
        } else if (diff < 3600) {
            // less 1 hour
            return Math.ceil(diff / 60) + "分钟前";
        } else if (diff < 3600 * 24) {
            return Math.ceil(diff / 3600) + "小时前";
        } else if (diff < 3600 * 24 * 2) {
            return "1天前 " + parseTime(d, "{h}:{i}");
        }
        if (option) {
            return parseTime(time, option);
        } else {
            return (
                d.getMonth() +
                1 +
                "月" +
                d.getDate() +
                "日" +
                d.getHours() +
                "时" +
                d.getMinutes() +
                "分"
            );
        }
    },
    oneMonthAgo() {
        let dt = new Date();
        return new Date(dt.setMonth(dt.getMonth(), 1));
    },
    formatSeconds(value) {
        let secondTime = parseInt(value); // 秒
        let minuteTime = 0; // 分
        let hourTime = 0; // 小时
        let dayTime = 0; // 天
        let result = "";
        if (value < 60) {
            result = secondTime + "秒";
        } else {
            if (secondTime >= 60) {
                // 如果秒数大于60，将秒数转换成整数
                // 获取分钟，除以60取整数，得到整数分钟
                minuteTime = parseInt(secondTime / 60);
                // 获取秒数，秒数取佘，得到整数秒数
                secondTime = parseInt(secondTime % 60);
                // 如果分钟大于60，将分钟转换成小时
                if (minuteTime >= 60) {
                    // 获取小时，获取分钟除以60，得到整数小时
                    hourTime = parseInt(minuteTime / 60);
                    // 获取小时后取佘的分，获取分钟除以60取佘的分
                    minuteTime = parseInt(minuteTime % 60);
                    if (hourTime >= 24) {
                        // 获取天数， 获取小时除以24，得到整数天
                        dayTime = parseInt(hourTime / 24);
                        // 获取小时后取余小时，获取分钟除以24取余的分；
                        hourTime = parseInt(hourTime % 24);
                    }
                }
            }
            if (secondTime > 0) {
                secondTime =
                    parseInt(secondTime) >= 10 ? secondTime : "0" + secondTime;
                result = "" + secondTime + "秒";
            }
            if (minuteTime > 0) {
                minuteTime =
                    parseInt(minuteTime) >= 10 ? minuteTime : "0" + minuteTime;
                result = "" + minuteTime + "分" + result;
            }
            if (hourTime > 0) {
                result = "" + parseInt(hourTime) + "小时" + result;
            }
            if (dayTime > 0) {
                result = "" + parseInt(dayTime) + "天" + result;
            }
        }
        return result;
    },

    /**
     * 时间戳转字符串
     * @param {timestamp} time 时间
     * @return {string}
     */
    timeToString(timestamp) {
        if (timestamp === null || timestamp === undefined || timestamp === "") {
            return "";
        }
        var time = new Date(timestamp); //先将时间戳转为Date对象，然后才能使用Date的方法
        var year = time.getFullYear(),
            month = time.getMonth() + 1, //月份是从0开始的
            day = time.getDate(),
            hour = time.getHours(),
            minute = time.getMinutes(),
            second = time.getSeconds();
        return (
            year +
            "-" +
            this.add0(month) +
            "-" +
            this.add0(day) +
            " " +
            this.add0(hour) +
            ":" +
            this.add0(minute) +
            ":" +
            this.add0(second)
        );
    },
    /**
     * 时间戳转字符串
     * @param {timestamp} time 时间
     * @return {string}
     */
    timeToString2(timestamp) {
        if (timestamp === null || timestamp === undefined || timestamp === "") {
            return "";
        }
        var time = new Date(timestamp); //先将时间戳转为Date对象，然后才能使用Date的方法
        var year = time.getFullYear(),
            month = time.getMonth() + 1, //月份是从0开始的
            day = time.getDate();
        return year + "-" + this.add0(month) + "-" + this.add0(day);
    },
    getToday(hour) {
        let date = new Date();
        let hh = date.getHours() + hour;
        if (hh < 0 || hh >= 24) {
            date = new Date(date.getTime() + hour * 60 * 60 * 1000);
            hh = date.getHours();
        }
        let yy = date.getFullYear();
        let MM = date.getMonth() + 1;
        let dd = date.getDate();
        let mm = date.getMinutes();
        let ss = date.getSeconds();
        if (hour == 0) {
            return (
                yy +
                "-" +
                (MM < 10 ? "0" + MM : MM) +
                "-" +
                (dd < 10 ? "0" + dd : dd)
            );
        } else {
            return (
                yy +
                "-" +
                (MM < 10 ? "0" + MM : MM) +
                "-" +
                (dd < 10 ? "0" + dd : dd) +
                " " +
                (hh < 10 ? "0" + hh : hh) +
                ":" +
                (mm < 10 ? "0" + mm : mm) +
                ":" +
                (ss < 10 ? "0" + ss : ss)
            );
        }
    },
    /**
     * 补零
     * @param {string}
     * @return {string}
     */
    add0(m) {
        return m < 10 ? "0" + m : m;
    },

    /**
     * 计算时间差
     * @param startTime
     * @param endTime
     */
    intervalTime(startTime, endTime) {
        var interval = endTime - startTime; //时间差的毫秒数
        var str = "";
        //计算出相差天数
        var days = Math.floor(interval / (24 * 3600 * 1000));
        if (days > 0) {
            str += days + "天";
        }
        //计算出小时数
        var leave1 = interval % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
        if (hours > 0) {
            str += hours + "小时";
        }
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000));
        if (minutes > 0) {
            str += minutes + "分钟";
        }
        //计算相差秒数
        var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000);
        if (seconds >= 0) {
            str += seconds + "秒";
        }
        return str;
    },
    /**
     * 计算时间差
     * @param startTime
     * @param endTime
     */
    intervalMinTime(startTime, endTime) {
        var interval = endTime - startTime; //时间差的毫秒数
        var str = "";
        //计算出小时数
        var leave1 = interval % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
        if (hours > 0) {
            str += hours + "小时";
        }
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000));
        if (minutes > 0) {
            str += minutes + "分钟";
        }
        return str;
    },
    //时分秒转秒
    stringToSecond(time) {
        //HH:mm:ss
        if (!time) {
            return false;
        }
        let arr = time.split(":");
        return (arr[0] - 0) * 3600 + (arr[1] - 0) * 60 + (arr[2] - 0);
    },
    //秒转时分秒
    secondToString(time) {
        if (time == 0 || time) {
            let h = (time - (time % 3600)) / 3600;
            time = time - h * 3600;
            let m = (time - (time % 60)) / 60;
            let s = time - m * 60;
            return (
                (h < 10 ? "0" + h : h) +
                ":" +
                (m < 10 ? "0" + m : m) +
                ":" +
                (s < 10 ? "0" + s : s)
            );
        } else {
            return false;
        }
    },
    getMon(date) {
        let nowTemp = new Date(date); //当前时间
        let oneDayLong = 24 * 60 * 60 * 1000; //一天的毫秒数
        let c_time = nowTemp.getTime(); //当前时间的毫秒时间
        let c_day = nowTemp.getDay() || 7; //当前时间的星期几
        let m_time = c_time - (c_day - 1) * oneDayLong; //当前周一的毫秒时间
        let monday = new Date(m_time); //设置周一时间对象
        let m_year = monday.getFullYear();
        let m_month = monday.getMonth() + 1;
        m_month = m_month < 10 ? "0" + m_month : m_month;
        let m_date = monday.getDate();
        m_date = m_date < 10 ? "0" + m_date : m_date;
        return m_year + "-" + m_month + "-" + m_date;
    },
};
