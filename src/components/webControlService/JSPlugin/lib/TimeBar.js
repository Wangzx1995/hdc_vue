/*****************************************************
FileName: timebar
Description: 时间条   不兼容IE浏览器
Author: Chenxiangzhen
Date: 2011.04.18
*****************************************************/

/*************************************************
Function:		bindAsEventListener
Description:	绑定对象到函数
Input:			object 对象, fun 函数
Output:			无
return:			关联后的函数

*************************************************/
class videoRect {
    constructor(that) {
        this.num = 0;
        that.FileInfoSet.forEach((flieList) => {
            if (flieList.length > 0) {
                this.num++;
            }
        });
        this.timeBar = that;
        this.m_ctx = that.m_ctx;
        this.m_startTime = new Time();
        this.m_startTime.setTimeByMis(
            that.m_tCurrentMidTime.m_iMilliseconds - 175000
        );
        this.M_X = this.TimeToX(this.m_startTime);
        this.m_endTime = new Time();
        this.m_endTime.setTimeByMis(
            that.m_tCurrentMidTime.m_iMilliseconds + 175000
        );
        this.E_X = this.TimeToX(this.m_endTime);
        this.T_E_X = undefined;
        this.T_M_X = undefined;
        this.draw();
    }
    draw(reflash = false) {
        let height = this.num === 2 ? 88 : 60;
        if (reflash) {
            this.casX();
        }
        let m_x = this.T_M_X || this.M_X;
        let e_x = this.T_E_X || this.E_X;

        this.m_ctx.fillStyle = "#797a7e";
        this.m_ctx.globalAlpha = 0.3;
        this.m_ctx.fillRect(m_x, 0, e_x - m_x, height + 1);
        this.m_ctx.globalAlpha = 1;
        this.m_ctx.strokeStyle = "#ff8f21";

        this.m_ctx.lineWidth = 2;
        this.m_ctx.beginPath();

        this.m_ctx.moveTo(m_x, 2);
        this.m_ctx.lineTo(m_x + 4, 2);
        this.m_ctx.moveTo(m_x, 1);
        this.m_ctx.lineTo(m_x, height);
        this.m_ctx.lineTo(m_x + 4, height);

        this.m_ctx.moveTo(e_x - 4, 2);
        this.m_ctx.lineTo(e_x, 2);

        this.m_ctx.lineTo(e_x, height);
        this.m_ctx.lineTo(e_x - 4, height);

        this.m_ctx.stroke();
        this.m_startTime.setTimeByMis(this.XtoTime(this.M_X));
        this.m_endTime.setTimeByMis(this.XtoTime(this.E_X));
    }
    judgeInType(event) {
        let { offsetX } = event;
        let M_X_L = this.M_X - 5;
        let M_X_R = this.M_X + 10;
        let E_X_L = this.E_X - 10;
        let E_X_R = this.E_X + 5;
        if (offsetX >= M_X_L && offsetX <= M_X_R) {
            return {
                flag: true,
                type: "left",
            };
        } else if (offsetX >= E_X_L && offsetX <= E_X_R) {
            return {
                flag: true,
                type: "right",
            };
        } else {
            return {
                flag: false,
            };
        }
    }
    casX() {
        this.M_X = this.TimeToX(this.m_startTime);
        this.E_X = this.TimeToX(this.m_endTime);
    }
    XtoTime(X) {
        let iXLeftSeconds =
            ((X - this.timeBar.m_iMiddleLinePos) / this.timeBar.m_iCellWidth) *
            (3600 * this.timeBar.m_fCellTime);
        return (
            iXLeftSeconds * 1000 +
            this.timeBar.m_tCurrentMidTime.m_iMilliseconds
        );
    }
    TimeToX(m_time) {
        let iXLeftSeconds = parseInt(
            (m_time.m_iMilliseconds -
                this.timeBar.m_tCurrentMidTime.m_iMilliseconds) /
                1000
        );
        return (
            this.timeBar.m_iMiddleLinePos +
            parseInt(
                parseFloat(iXLeftSeconds / (3600 * this.timeBar.m_fCellTime)) *
                    this.timeBar.m_iCellWidth
            )
        );
    }
}
let bindAsEventListener = function (object, fun) {
    let args = Array.prototype.slice.call(arguments).slice(2);
    return function (event) {
        return fun.apply(object, [event || window.event].concat(args));
    };
};
/*************************************************
Function:		bind
Description:	绑定对象到函数
Input:			object 对象, fun 函数
Output:			无
return:			关联后的函数
*************************************************/
let bind = function (object, fun) {
    return function () {
        return fun.apply(object, arguments);
    };
};
/*************************************************
Function:		addEventHandler
Description:	添加事件
Input:			oTarget 目标对象, sEventType 事件, fnHandler 函数
Output:			无
return:			无
*************************************************/
let addEventHandler = function (oTarget, sEventType, fnHandler) {
    oTarget["on" + sEventType] = fnHandler;
};

let removeEventHandler = function (oTarget, sEventType, fnHandler) {
    oTarget["on" + sEventType] = null;
};
/*************************************************
Function:		getObjLeft
Description:	获取对象相对网页的左上角坐标
Input:			obj 对象
Output:			无
return:			坐标
*************************************************/
function getObjLeft(obj) {
    let x = obj.offsetLeft;
    while ((obj = obj.offsetParent)) {
        x += obj.offsetLeft;
    }
    return x;
}

/*************************************************
Function:		getObjTop
Description:	获取对象相对网页的左上角坐标
Input:			obj 对象
Output:			无
return:			坐标
*************************************************/
function getObjTop(obj) {
    let y = obj.offsetTop;
    while ((obj = obj.offsetParent)) {
        y += obj.offsetTop;
    }
    return y;
}
/*************************************************
 * Class ScaleInfo
 * @author chenxiangzhen
 * @created 2011-04-06
 * @version v1.0
 * @function 工具类，时间刻度信息
 *************************************************/
function ScaleInfo(x, y, iSeconds) {
    this.m_ix = x;
    this.m_iy = y;
    this.m_ixMin;
    this.m_ixMax;
    this.m_iHour = parseInt(iSeconds / 3600, 10);
    this.m_iMinute = parseInt((iSeconds % 3600) / 60, 10);
    this.m_iSecond = parseInt((iSeconds % 3600) % 60, 10);
    this.m_szTime = "";
    if (this.m_iHour < 10 && this.m_iMinute < 10) {
        this.m_szTime = "0" + this.m_iHour + ":0" + this.m_iMinute;
    } else if (this.m_iHour < 10 && this.m_iMinute >= 10) {
        this.m_szTime = "0" + this.m_iHour + ":" + this.m_iMinute;
    } else if (this.m_iHour >= 10 && this.m_iMinute >= 10) {
        this.m_szTime = "" + this.m_iHour + ":" + this.m_iMinute;
    } else {
        this.m_szTime = "" + this.m_iHour + ":0" + this.m_iMinute;
    }
}
/*************************************************
Function:		setPos
Description:	设置刻度的位置
Input:			x 横坐标, y 纵坐标
Output:			无
return:			无
*************************************************/
ScaleInfo.prototype.setPos = function (x, y) {
    // this.x = x;
    if (x < this.m_ixMin) {
        x = this.m_ixMax - (this.m_ixMin - x);
    } else if (x > this.m_ixMax) {
        x = this.m_ixMin + (x - this.m_ixMax);
    }
    this.m_ix = x;
    this.m_iy = y;
};
/*************************************************
Function:		setPosRange
Description:	设置刻度显示的范围
Input:			ixMin 最小横坐标, ixMax 最大横坐标
Output:			无
return:			无
*************************************************/
ScaleInfo.prototype.setPosRange = function (ixMin, ixMax) {
    this.m_ixMin = ixMin;
    this.m_ixMax = ixMax;
};
/*************************************************
Function:		isInRange
Description:	是否在范围内
Input:			ixMin 最小横坐标, ixMax 最大横坐标
Output:			无
return:			bool
*************************************************/
ScaleInfo.prototype.isInRange = function (iMin, iMax) {
    if (this.m_ix >= iMin && this.m_ix <= iMax) {
        return true;
    } else {
        return false;
    }
};
/*************************************************
Function:		update
Description:	更新刻度时间
Input:			iSeconds
Output:			无
return:			无
*************************************************/
ScaleInfo.prototype.update = function (iSeconds) {
    this.m_iHour = parseInt(iSeconds / 3600, 10);
    this.m_iMinute = parseInt((iSeconds % 3600) / 60, 10);
    this.m_iSecond = parseInt((iSeconds % 3600) % 60, 10);
    if (this.m_iHour < 10 && this.m_iMinute < 10) {
        this.m_szTime = "0" + this.m_iHour + ":0" + this.m_iMinute;
    } else if (this.m_iHour < 10 && this.m_iMinute >= 10) {
        this.m_szTime = "0" + this.m_iHour + ":" + this.m_iMinute;
    } else if (this.m_iHour >= 10 && this.m_iMinute >= 10) {
        this.m_szTime = "" + this.m_iHour + ":" + this.m_iMinute;
    } else {
        this.m_szTime = "" + this.m_iHour + ":0" + this.m_iMinute;
    }
};
/*************************************************
 * Class Time
 * @author chenxiangzhen
 * @created 2011-04-06
 * @version v1.0
 * @function 工具类，时间相关信息
 *************************************************/
function Time() {
    let tCurrentTime = new Date();
    this.m_iYear = tCurrentTime.getFullYear();
    this.m_iMonth = tCurrentTime.getMonth() + 1;
    this.m_iDay = tCurrentTime.getDate();
    this.m_iHour = tCurrentTime.getHours();
    this.m_iMinute = tCurrentTime.getMinutes();
    this.m_iSecond = tCurrentTime.getSeconds();
    this.m_iMilliseconds = tCurrentTime.getTime(); //返回 1970 年 1 月 1 日至今的毫秒数
}
/*************************************************
Function:		setTimeByMis
Description:	设置时间
Input:			iMilliseconds: 1970 年 1 月 1 日至今的毫秒数
Output:			无
return:			无
*************************************************/
Time.prototype.setTimeByMis = function (iMilliseconds) {
    let tSetTime = new Date(iMilliseconds);
    this.m_iYear = tSetTime.getFullYear();
    this.m_iMonth = tSetTime.getMonth() + 1;
    this.m_iDay = tSetTime.getDate();
    this.m_iHour = tSetTime.getHours();
    this.m_iMinute = tSetTime.getMinutes();
    this.m_iSecond = tSetTime.getSeconds();
    this.m_iMilliseconds = iMilliseconds;
};
/*************************************************
Function:		getStringTime
Description:	获取时间字符串
Input:			无
Output:			无
return:			string  yyyy-MM-dd HH:mm:ss
*************************************************/
Time.prototype.getStringTime = function () {
    let szYear = "" + this.m_iYear;

    let szMonth;
    if (this.m_iMonth < 10) {
        szMonth = "0" + this.m_iMonth;
    } else {
        szMonth = "" + this.m_iMonth;
    }

    let szDay;
    if (this.m_iDay < 10) {
        szDay = "0" + this.m_iDay;
    } else {
        szDay = "" + this.m_iDay;
    }

    let szHour;
    if (this.m_iHour < 10) {
        szHour = "0" + this.m_iHour;
    } else {
        szHour = "" + this.m_iHour;
    }

    let szMinute;
    if (this.m_iMinute < 10) {
        szMinute = "0" + this.m_iMinute;
    } else {
        szMinute = "" + this.m_iMinute;
    }

    let szSecond;
    if (this.m_iSecond < 10) {
        szSecond = "0" + this.m_iSecond;
    } else {
        szSecond = "" + this.m_iSecond;
    }
    let szCurrentTime =
        szYear +
        "-" +
        szMonth +
        "-" +
        szDay +
        " " +
        szHour +
        ":" +
        szMinute +
        ":" +
        szSecond;
    return szCurrentTime;
};
/*************************************************
Function:		parseTime
Description:	通过时间字符串设置时间
Input:			szTime 时间 yyyy-MM-dd HH:mm:ss
Output:			无
return:			无
*************************************************/
Time.prototype.parseTime = function (szTime) {
    let aDate = szTime.split(" ")[0].split("-");
    let aTime = szTime.split(" ")[1].split(":");

    this.m_iYear = parseInt(aDate[0], 10);
    this.m_iMonth = parseInt(aDate[1], 10);
    this.m_iDay = parseInt(aDate[2], 10);

    this.m_iHour = parseInt(aTime[0], 10);
    this.m_iMinute = parseInt(aTime[1], 10);
    this.m_iSecond = parseInt(aTime[2], 10);

    let tTime = new Date();
    tTime.setFullYear(this.m_iYear);
    tTime.setMonth(this.m_iMonth - 1, this.m_iDay);

    tTime.setHours(this.m_iHour);
    tTime.setMinutes(this.m_iMinute);
    tTime.setSeconds(this.m_iSecond);
    tTime.setMilliseconds(0);

    this.m_iMilliseconds = tTime.getTime();
};
/*************************************************
 * Class FileInfo
 * @author chenxiangzhen
 * @created 2011-04-06
 * @version v1.0
 * @function 工具类，录像文件相关信息
 *************************************************/
function FileInfo(
    iX,
    iY,
    iWidth,
    iHeight,
    iType,
    cColor,
    tStartTime,
    tStopTime,
    tFileSize,
    tAvEncoding,
    tiWndNum
) {
    this.m_iX = iX;
    this.m_ixMin = 0;
    this.m_ixMax = 0;
    this.m_iY = iY;
    this.m_iWidth = iWidth;
    this.m_iHeight = iHeight;
    this.m_cColor = cColor;
    this.m_iType = iType;
    this.m_tStartTime = tStartTime;
    this.m_tStopTime = tStopTime;
    this.m_fileSize = tFileSize;
    this.m_avEncoding = tAvEncoding;
    this.m_iWndNum = tiWndNum;
}
/*************************************************
	Function:		isInRange
	Description:	是否在范围之内
	Input:			left 左起始点 right 右终点
	Output:			无
	return:			无
*************************************************/
FileInfo.prototype.isInRange = function (left, right) {
    if (this.m_iX + this.m_iWidth <= left || this.m_iX >= right) {
        return false;
    } else {
        return true;
    }
};
/*************************************************
	Function:		setPos
	Description:	设置位置内
	Input:			iX iY左起始点坐标 iWidth 宽度 iHeight高度
	Output:			无
	return:			无
*************************************************/
FileInfo.prototype.setPos = function (iX, iY, iWidth, iHeight) {
    this.m_iX = iX;
    this.m_iWidth = iWidth;
    this.m_iY = iY;
    this.m_iHeight = iHeight;
};
/*************************************************
	Function:		setPosRange
	Description:	设置范围
	Input:			ixMin, ixMax
	Output:			无
	return:			无
*************************************************/
FileInfo.prototype.setPosRange = function (ixMin, ixMax) {
    this.m_ixMin = ixMin;
    this.m_ixMax = ixMax;
};
/*************************************************
	Function:		draw
	Description:	画文件信息
	Input:			g 设备资源
	Output:			无
	return:			无
*************************************************/
FileInfo.prototype.draw = function (g, index) {
    let obj = {
        0: {
            y: 35,
            w: 24,
        },
        1: {
            y: 63,
            w: 24,
        },
    };
    if (this.isInRange(this.m_ixMin, this.m_ixMax)) {
        let colorOld = g.fillStyle;
        g.fillStyle = this.m_cColor;
        if (
            this.m_iX >= this.m_ixMin &&
            this.m_iX + this.m_iWidth <= this.m_ixMax
        ) {
            g.fillRect(this.m_iX, obj[index].y, this.m_iWidth, obj[index].w);
        } else if (
            this.m_iX < this.m_ixMax &&
            this.m_iX + this.m_iWidth > this.m_ixMax
        ) {
            g.fillRect(
                this.m_iX,
                obj[index].y,
                this.m_ixMax - this.m_iX,
                obj[index].w
            );
        } else {
            g.fillRect(
                this.m_ixMin,
                obj[index].y,
                this.m_iX + this.m_iWidth - this.m_ixMin,
                obj[index].w
            );
        }
        g.fillStyle = colorOld;
    }
};
FileInfo.prototype.isInTimeRange = function (m_tCurrentMidTime) {
    // console.log(m_tCurrentMidTime.m_iMilliseconds,this.m_tStartTime.m_iMilliseconds,'!!!!!');
    // console.log(m_tCurrentMidTime.m_iMilliseconds <= this.m_tStopTime.m_iMilliseconds && m_tCurrentMidTime.m_iMilliseconds >= this.m_tStartTime.m_iMilliseconds, '@@@');
    return (
        m_tCurrentMidTime.m_iMilliseconds <= this.m_tStopTime.m_iMilliseconds &&
        m_tCurrentMidTime.m_iMilliseconds >= this.m_tStartTime.m_iMilliseconds
    );
};
/*************************************************
 * Class TimeBar
 * @author chenxiangzhen
 * @created 2011-04-06
 * @version v1.0
 * @function 工具类，时间条
 *************************************************/
function TimeBar(canvas /*, iWidth, iHeight*/) {
    // console.log(canvas, canvas.width, canvas.height, "初始化timeBar");
    if (arguments.length >= 3) {
        canvas.width = arguments[1];
        canvas.height = arguments[2];
    } else {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    this.m_canvas = canvas;
    this.m_ctx = canvas.getContext("2d");

    this.m_iMinFileWidth = 1; //文件的最小宽度

    this.backgroundColor = "#212021"; //时间条背景颜色
    this.partLineColor = "rgb(48,48,48)"; //分割线颜色
    this.channelNameColor = "rgb(255, 255, 255)"; //通道名称颜色
    this.timeScaleColor = "rgb(255, 255, 255)"; //时间条刻度颜色
    this.middleLineColor = "#ff4200"; //中轴线颜色
    this.middleLineTimeColor = "rgb(255, 255, 255)"; //中轴时间颜色
    this.defaultFileColor = "#007aec"; //默认录像类型颜色
    this.cmdFileColor = "rgb(21, 184, 155)"; //命令触发录像颜色
    this.scheFileColor = "rgb(99, 125, 236)"; //录像计划颜色
    this.alarmFileColor = "rgb(248, 71, 126)"; //警告录像颜色
    this.manualFileColor = "rgb(247, 199, 5)"; //手动录像颜色

    this.m_fMidTimeFont = "10px Avenir"; //中线时间字体及大小
    this.m_fCurTimeFont = "12px Verdana"; //鼠标当前时间字体及大小
    this.m_fScaleFont = "10px Avenir"; //刻度字体及大小  sans-serif
    this.m_fChannelNameFont = "14px Verdana"; //通道名称字体

    canvas.style.backgroundColor = this.backgroundColor;

    this.m_szCurChannelName = ""; //当前通道名称
    this.m_fCellTime = parseFloat(1.0); //每个代表几个小时
    this.ScaleInfo = new Array();
    this.ScaleInfoNum = parseInt(24 / this.m_fCellTime, 10); //总的刻度数量
    this.ScaleInfoDisNum = 12; //显示的刻度数量

    //初始化刻度
    for (let i = 0; i < this.ScaleInfoNum; i++) {
        this.ScaleInfo.push(
            new ScaleInfo(0, 0, parseInt(i * 3600 * this.m_fCellTime))
        );
    }
    this.m_iMaxWndNum = 2; //最大窗口数
    this.m_iSelWnd = 1; //选中的窗口号

    this.FileInfoSet = new Array(this.m_iMaxWndNum); //文件信息集合
    //初始化文件信息集合
    for (let i = 0; i < this.m_iMaxWndNum; i++) {
        this.FileInfoSet[i] = new Array();
    }
    this.m_iHeight = parseInt(canvas.height, 10);
    this.m_iWidth = parseInt(canvas.width, 10);
    this.m_iFileListStartPos = 0; // 文件列表起始位置
    this.m_iBlankHeight = 4; // 中间及底边空白宽度
    this.m_iTimeRectHeight = 40; //parseInt(this.m_iHeight * 4 / 7)  时间块的高度
    this.m_iFileRectHeight =
        this.m_iHeight - this.m_iTimeRectHeight - this.m_iBlankHeight * 2; //文件块的高度

    this.m_iMiddleLinePos = parseInt(
        (this.m_iFileListStartPos + this.m_iWidth) / 2 - 35,
        10
    ); //中轴线的位置
    this.m_iCellWidth = Math.floor(
        (this.m_iWidth - this.m_iFileListStartPos) / this.ScaleInfoDisNum
    ); //每个像素的秒数
    this.m_iCellMilliseconds = parseInt(
        (3600 * this.m_fCellTime * 1000) / this.m_iCellWidth,
        10
    ); //每个像素的毫秒数

    this.m_tCurrentMidTime = new Time(); //当前中轴线的时间
    this.m_ctx.font = this.m_fMidTimeFont;
    this.m_iTextWidth = this.m_ctx.measureText(
        this.m_tCurrentMidTime.getStringTime()
    ).width;

    this.m_tMouseCurTime = new Time(); //当前鼠标点的时间
    this.m_ctx.font = this.m_fCurTimeFont;
    this.m_iCurTextWidth = this.m_ctx.measureText(
        this.m_tMouseCurTime.getStringTime()
    ).width;
    this.m_iCanvasLeft = getObjLeft(this.m_canvas);
    this.m_iCanvasTop = getObjTop(this.m_canvas);

    //初始化时间刻度信息
    for (let i = 0; i < this.ScaleInfoNum; i++) {
        // 计算与中轴线的时间差（只计算时分秒）
        let seconds =
            (this.ScaleInfo[i].m_iHour - this.m_tCurrentMidTime.m_iHour) *
                3600 +
            (this.ScaleInfo[i].m_iMinute - this.m_tCurrentMidTime.m_iMinute) *
                60 +
            (this.ScaleInfo[i].m_iSecond - this.m_tCurrentMidTime.m_iSecond);
        let iScalePos =
            this.m_iMiddleLinePos +
            parseInt(
                parseFloat(seconds / (3600 * this.m_fCellTime)) *
                    this.m_iCellWidth
            );
        // 设置刻度位置范围
        this.ScaleInfo[i].setPosRange(
            this.m_iFileListStartPos,
            this.m_iFileListStartPos +
                parseInt(this.m_iCellWidth * this.ScaleInfoNum)
        );
        this.ScaleInfo[i].setPos(iScalePos, this.m_iTimeRectHeight);
    }

    //注册消息响应
    this.m_ieventX = 0;
    this.m_iMousePosX = 0;
    this.reactDrag = {};
    this.m_bMOuseDown = false;
    this.m_bMouseOver = false;
    this.m_iMove = 0;
    this.m_iMiddleLineTime = 0;
    this.Start = function (oEvent) {
        this.m_iMove = 0;
        this.m_ieventX = oEvent.clientX;
        this.m_iMiddleLineTime = this.m_tCurrentMidTime.m_iMilliseconds;
        this.m_bMOuseDown = true;
        let arg3 = this.videoRect
            ? this.videoRect.judgeInType(oEvent).type
            : null;
        addEventHandler(
            document,
            "mousemove",
            bindAsEventListener(this, this.Move, arg3)
        );
        addEventHandler(
            document,
            "mouseup",
            bindAsEventListener(this, this.Stop, arg3)
        );
        addEventHandler(
            parent.document,
            "mouseup",
            bindAsEventListener(this, this.Stop, arg3)
        ); //解决鼠标在父页面释放时不能响应的问题
        //焦点丢失
        addEventHandler(
            window,
            "blur",
            bindAsEventListener(
                this,
                bindAsEventListener(this, this.Stop, arg3)
            )
        );
        //阻止默认动作
        oEvent.preventDefault();
        removeEventHandler(
            canvas,
            "mousemove",
            bindAsEventListener(this, this.onMouseMove)
        );
    };

    this.mouseUpCallbackFunc = function () {};
    this.Stop = function (e, ifreactMove) {
        document.body.style.cursor = "default";
        // this.m_canvas.style.cursor = "url(../ui/images/H_point1.cur),pointer";
        this.m_bMOuseDown = false;
        let playFile = [null, null];
        this.FileInfoSet.forEach((infoList, index) => {
            infoList.forEach((file) => {
                if (file.isInTimeRange(this.m_tCurrentMidTime)) {
                    playFile[index] = {
                        startTime: file.m_tStartTime.getStringTime(),
                        stopTime: file.m_tStopTime.getStringTime(),
                        fileSize: file.m_fileSize,
                        avEncoding: file.m_avEncoding,
                    };
                }
            });
        });
        if (!ifreactMove) {
            // this.m_tCurrentMidTime.setTimeByMis(this.m_tMouseCurTime.m_iMilliseconds);
            this.mouseUpCallbackFunc(
                playFile,
                this.m_tCurrentMidTime.getStringTime()
            );
        }
        removeEventHandler(
            document,
            "mousemove",
            bindAsEventListener(this, this.Move)
        );
        removeEventHandler(
            document,
            "mouseup",
            bindAsEventListener(this, this.Stop)
        );
        removeEventHandler(
            window,
            "blur",
            bindAsEventListener(this, this.Stop)
        );

        if (this.videoRect && this.videoRect.T_M_X) {
            this.videoRect.M_X = this.videoRect.T_M_X;
            this.videoRect.T_M_X = undefined;
        }
        if (this.videoRect && this.videoRect.T_E_X) {
            this.videoRect.E_X = this.videoRect.T_E_X;
            this.videoRect.T_E_X = undefined;
        }
        addEventHandler(
            canvas,
            "mousemove",
            bindAsEventListener(this, this.onMouseMove)
        );
        this.repaint();
    };
    this.onMouseMoveIn = true;
    this.Move = function (oEvent, type) {
        this.m_iMove = oEvent.clientX - this.m_ieventX;
        document.body.style.cursor = "url(../ui/images/H_point.cur),pointer";
        this.m_canvas.style.cursor = "url(../ui/images/H_point.cur),pointer";
        if (this.m_bMOuseDown) {
            //清除选择
            window.getSelection
                ? window.getSelection().removeAllRanges()
                : document.selection.empty();
            if (!type) {
                this.m_tCurrentMidTime.setTimeByMis(
                    this.m_iMiddleLineTime -
                        this.m_iMove * this.m_iCellMilliseconds
                );
            } else {
                if (type === "left") {
                    let M_X = this.videoRect.M_X + this.m_iMove;
                    let startTime = this.videoRect.XtoTime(M_X);
                    let endTime = this.videoRect.XtoTime(this.videoRect.E_X);
                    if (endTime - startTime >= 10 * 60 * 1000) {
                        startTime = endTime - 10 * 60 * 1000;
                    } else if (startTime >= endTime) {
                        startTime = endTime - 1000;
                    }
                    let temp = new Time();
                    temp.setTimeByMis(startTime);
                    M_X = this.videoRect.TimeToX(temp);
                    this.videoRect.T_M_X = M_X;
                } else if (type === "right") {
                    let E_X = this.videoRect.E_X + this.m_iMove;
                    let endTime = this.videoRect.XtoTime(E_X);
                    let startTime = this.videoRect.XtoTime(this.videoRect.M_X);
                    if (endTime - startTime >= 10 * 60 * 1000) {
                        endTime = startTime + 10 * 60 * 1000;
                    } else if (startTime >= endTime) {
                        endTime = startTime + 1000;
                    }
                    let temp = new Time();
                    temp.setTimeByMis(endTime);
                    E_X = this.videoRect.TimeToX(temp);
                    this.videoRect.T_E_X = E_X;
                }
            }
            this.repaint();
        }
    };
    this.reactMove = (type, oEvent) => {
        this.m_iMove = oEvent.clientX - this.m_ieventX;
        if (type === "left") {
            this.videoRect.T_M_X = this.videoRect.M_X + this.m_iMove;
        } else {
            this.videoRect.T_E_X = this.videoRect.E_X + this.m_iMove;
        }
        this.repaint();
    };
    // this.m_canvas.style.cursor = "url(../ui/images/H_point1.cur),pointer";
    this.onMouseMove = function (oEvent) {
        this.m_iMousePosX = oEvent.clientX - this.m_iCanvasLeft;
        this.m_tMouseCurTime.setTimeByMis(
            (this.m_iMousePosX - this.m_iMiddleLinePos) *
                this.m_iCellMilliseconds +
                this.m_tCurrentMidTime.m_iMilliseconds
        );
        if (this.videoRect) {
            if (
                (this.videoRect.M_X >= oEvent.offsetX &&
                    this.videoRect.M_X <= oEvent.offsetX + 5) ||
                (this.videoRect.E_X >= oEvent.offsetX - 5 &&
                    this.videoRect.E_X <= oEvent.offsetX)
            ) {
                this.m_canvas.style.cursor = "e-resize";
            } else {
                this.m_canvas.style.cursor = "default";
            }
        }
        // this.repaint();
        // let szCurMouseTime = this.m_tMouseCurTime.getStringTime();
        // this.m_ctx.fillStyle = this.middleLineTimeColor;
        // this.m_ctx.font = this.m_fCurTimeFont;
        // this.m_ctx.fillText(szCurMouseTime, this.m_iMousePosX - parseInt(this.m_iCurTextWidth / 2), parseInt(this.m_iTimeRectHeight / 4));
    };

    this.onMouseOut = function (oEvent) {
        this.repaint();
    };
       // 滚轮滚动缩放
       this.onMouseWheel = function(oEvent) {
        this.mousewheelCallbackFunc(oEvent)
    };
    addEventHandler(canvas, "mousedown", bindAsEventListener(this, this.Start));

    addEventHandler(
        canvas,
        "mousemove",
        bindAsEventListener(this, this.onMouseMove)
    );
    addEventHandler(
        canvas,
        "mouseout",
        bindAsEventListener(this, this.onMouseOut)
    );
    addEventHandler(canvas, "wheel", bindAsEventListener(this, this.onMouseWheel));

    //this.setMidLineTime('2011-04-20 10:00:00');
    this.repaint();
}

TimeBar.prototype.setReactDragCall = function (callback) {
    this.reactDrag = callback;
};

TimeBar.prototype.cancelDownLoadMode = function () {
    this.videoRect = undefined;
    this.repaint();
};
/*************************************************
Function:		repaint
Description:	重绘
Input:			无
Output:			无
return:			无
*************************************************/
TimeBar.prototype.repaint = function (reactDraw) {
    let szCurrentTime = this.m_tCurrentMidTime.getStringTime();

    this.updateScalePos();
    this.updateFileListPos();

    this.m_ctx.clearRect(0, 0, this.m_iWidth, this.m_iHeight);

    //画中轴时间
    this.m_ctx.fillStyle = this.middleLineTimeColor;
    this.m_ctx.font = this.m_fMidTimeFont;
    this.m_iTextWidth = this.m_ctx.measureText(szCurrentTime).width;
    // this.m_ctx.fillText(szCurrentTime, (this.m_iMiddleLinePos - parseInt(this.m_iTextWidth / 2)), parseInt(this.m_iTimeRectHeight / 2) + 5);

    //画通道名称分割线
    // this.m_ctx.strokeStyle = this.partLineColor;
    // this.m_ctx.lineWidth = 1;
    // this.m_ctx.beginPath();
    // this.m_ctx.moveTo(this.m_iFileListStartPos, this.m_iTimeRectHeight);
    // this.m_ctx.lineTo(this.m_iFileListStartPos, this.m_iHeight);
    // this.m_ctx.stroke();

    //画文件两条横轴和纵轴
    // this.m_ctx.lineWidth = this.m_iBlankHeight;
    // this.m_ctx.beginPath();
    // this.m_ctx.moveTo(0,0);
    // this.m_ctx.lineTo(this.m_iWidth, 0);
    // this.m_ctx.stroke();

    this.m_ctx.beginPath();
    this.m_ctx.moveTo(0, 30);
    this.m_ctx.lineTo(0, 35);
    this.m_ctx.lineTo(this.m_iWidth, 35);
    this.m_ctx.lineTo(this.m_iWidth, 30);
    this.m_ctx.closePath();
    this.m_ctx.fillStyle = "#181811";
    this.m_ctx.fill();

    this.m_ctx.beginPath();
    this.m_ctx.moveTo(0, 59);
    this.m_ctx.lineTo(0, 63);
    this.m_ctx.lineTo(this.m_iWidth, 63);
    this.m_ctx.lineTo(this.m_iWidth, 59);
    this.m_ctx.closePath();
    this.m_ctx.fillStyle = "#181811";
    this.m_ctx.fill();

    this.m_ctx.beginPath();
    this.m_ctx.moveTo(0, 85);
    this.m_ctx.lineTo(0, 90);
    this.m_ctx.lineTo(this.m_iWidth, 85);
    this.m_ctx.lineTo(this.m_iWidth, 90);
    this.m_ctx.closePath();
    this.m_ctx.fillStyle = "#181811";
    this.m_ctx.fill();

    // this.m_ctx.beginPath();
    // this.m_ctx.moveTo(0, this.m_iHeight - this.m_iBlankHeight / 2);
    // this.m_ctx.lineTo(this.m_iWidth, this.m_iHeight - this.m_iBlankHeight / 2);
    // this.m_ctx.stroke();

    // this.m_ctx.beginPath();
    // this.m_ctx.moveTo(0, this.m_iHeight - (this.m_iFileRectHeight + 8) / 2);
    // this.m_ctx.lineTo(this.m_iWidth, this.m_iHeight - (this.m_iFileRectHeight + 8) / 2);
    // this.m_ctx.stroke();

    this.m_ctx.fillStyle = this.channelNameColor;
    // this.m_ctx.font = this.m_fChannelNameFont;
    // this.m_ctx.fillText(this.m_szCurChannelName, 0, this.m_iTimeRectHeight + this.m_iBlankHeight + parseInt(this.m_iFileRectHeight / 2) + 5, 90);

    this.m_ctx.strokeStyle = this.timeScaleColor;
    this.m_ctx.font = this.m_fScaleFont;
    this.m_ctx.lineWidth = 1;
    let record = (this.ScaleInfo[0].m_ix - this.ScaleInfo[1].m_ix) / 5;
    //画时间刻度
    for (let i = 0; i < this.ScaleInfoNum; i++) {
        this.m_ctx.beginPath();
        this.m_ctx.moveTo(this.ScaleInfo[i].m_ix, 15);
        this.m_ctx.lineTo(this.ScaleInfo[i].m_ix, 30);
        for (let j = 1; j <= 4; j++) {
            this.m_ctx.moveTo(this.ScaleInfo[i].m_ix + j * record, 20);
            this.m_ctx.lineTo(this.ScaleInfo[i].m_ix + j * record, 30);
        }
        this.m_ctx.stroke();
        this.m_ctx.fillText(
            this.ScaleInfo[i].m_szTime,
            this.ScaleInfo[i].m_ix - 15,
            13
        );
    }
    //画文件信息区域
    this.FileInfoSet.forEach((fileInfo, index) => {
        fileInfo.forEach((record) => {
            record.draw(this.m_ctx, index);
        });
    });
    // for (let i = 0; i < this.FileInfoSet[this.m_iSelWnd].length; i++) {
    // 	this.FileInfoSet[this.m_iSelWnd][i].draw(this.m_ctx);
    // }
    //画中轴线
    this.m_ctx.strokeStyle = this.middleLineColor;
    this.m_ctx.lineWidth = 2;
    this.m_ctx.beginPath();
    this.m_ctx.moveTo(this.m_iMiddleLinePos, 0);
    this.m_ctx.lineTo(this.m_iMiddleLinePos, this.m_iHeight);
    this.m_ctx.stroke();
    this.videoRect && this.videoRect.draw(reactDraw);
};

TimeBar.prototype.enterDownloadMode = function () {
    if (this.videoRect) {
        return;
    }
    this.videoRect = new videoRect(this);
};

/*************************************************
Function:		updateScalePos
Description:	更新刻度
Input:			无
Output:			无
return:			无
*************************************************/
TimeBar.prototype.updateScalePos = function () {
    if (this.ScaleInfo.length == 0) {
        return;
    }
    // 以00:00移动的距离为准
    let seconds =
        (this.ScaleInfo[0].m_iHour - this.m_tCurrentMidTime.m_iHour) * 3600 +
        (this.ScaleInfo[0].m_iMinute - this.m_tCurrentMidTime.m_iMinute) * 60 +
        (this.ScaleInfo[0].m_iSecond - this.m_tCurrentMidTime.m_iSecond);
    let iPos0 =
        this.m_iMiddleLinePos +
        parseInt(
            parseFloat(seconds / (3600 * this.m_fCellTime)) * this.m_iCellWidth
        );
    if (iPos0 < this.ScaleInfo[0].m_ixMin) {
        iPos0 = this.ScaleInfo[0].m_ixMax - (this.ScaleInfo[0].m_ixMin - iPos0);
    } else if (iPos0 > this.ScaleInfo[0].m_ixMax) {
        iPos0 = this.ScaleInfo[0].m_ixMin + (iPos0 - this.ScaleInfo[0].m_ixMax);
    }
    let iMoved = iPos0 - this.ScaleInfo[0].m_ix;
    //没有移动直接返回
    if (iMoved == 0) {
        return;
    }

    // 更新所有的刻度
    for (let i = 0; i < this.ScaleInfoNum; i++) {
        let iScalePos = this.ScaleInfo[i].m_ix + iMoved;
        // 设置刻度位置范围
        this.ScaleInfo[i].setPosRange(
            this.m_iFileListStartPos,
            this.m_iFileListStartPos +
                parseInt(this.m_iCellWidth * this.ScaleInfoNum)
        );
        this.ScaleInfo[i].setPos(iScalePos, this.m_iTimeRectHeight);
    }
};

/*************************************************
Function:		updateFileListPos
Description:	更新文件
Input:			无
Output:			无
return:			无
*************************************************/
TimeBar.prototype.updateFileListPos = function () {
    this.FileInfoSet.forEach((fileInfo) => {
        let iFileLength = fileInfo.length;
        if (iFileLength == 0) {
            return;
        }
        let tStartTime = fileInfo[0].m_tStartTime;
        let seconds = parseInt(
            (tStartTime.m_iMilliseconds -
                this.m_tCurrentMidTime.m_iMilliseconds) /
                1000
        );
        let iFile0Pos =
            this.m_iMiddleLinePos +
            parseInt(
                parseFloat(seconds / (3600 * this.m_fCellTime)) *
                    this.m_iCellWidth
            );
        let iMoved = iFile0Pos - fileInfo[0].m_iX;
        //没有移动直接返回
        if (iMoved == 0) {
            return;
        }

        // 更新所有
        for (let i = 0; i < iFileLength; i++) {
            let iX = fileInfo[i].m_iX + iMoved;
            let iY = fileInfo[i].m_iY;
            let iWidth = fileInfo[i].m_iWidth;
            let iHeight = fileInfo[i].m_iHeight;
            fileInfo[i].setPos(iX, iY, iWidth, iHeight);
        }
    });
};

/*************************************************
Function:		resize
Description:	重置大小
Input:			iWidth宽度, iHeight高度
Output:			无
return:			无
*************************************************/
TimeBar.prototype.resize = function (iWidth, iHeight) {
    this.m_canvas.height = iHeight;
    this.m_canvas.width = iWidth;
    this.m_iHeight = iHeight;
    this.m_iWidth = iWidth;
    this.m_iTimeRectHeight = parseInt((this.m_iHeight * 4) / 7);
    this.m_iFileRectHeight =
        this.m_iHeight - this.m_iTimeRectHeight - this.m_iBlankHeight * 2;
    this.m_iMiddleLinePos = parseInt(
        (this.m_iFileListStartPos + this.m_iWidth) / 2 - 70,
        10
    );
    this.m_iCellWidth = Math.floor(
        (this.m_iWidth - this.m_iFileListStartPos) / this.ScaleInfoDisNum
    );
    this.m_iCellMilliseconds = parseInt(
        (3600 * this.m_fCellTime * 1000) / this.m_iCellWidth,
        10
    );

    //初始化时间刻度信息
    for (let i = 0; i < this.ScaleInfoNum; i++) {
        // 计算与中轴线的时间差（只计算时分秒）
        let seconds =
            (this.ScaleInfo[i].m_iHour - this.m_tCurrentMidTime.m_iHour) *
                3600 +
            (this.ScaleInfo[i].m_iMinute - this.m_tCurrentMidTime.m_iMinute) *
                60 +
            (this.ScaleInfo[i].m_iSecond - this.m_tCurrentMidTime.m_iSecond);
        let iScalePos =
            this.m_iMiddleLinePos +
            parseInt(
                parseFloat(seconds / (3600 * this.m_fCellTime)) *
                    this.m_iCellWidth
            );
        // 设置刻度位置范围
        this.ScaleInfo[i].setPosRange(
            this.m_iFileListStartPos,
            this.m_iFileListStartPos +
                parseInt(this.m_iCellWidth * this.ScaleInfoNum)
        );
        this.ScaleInfo[i].setPos(iScalePos, this.m_iTimeRectHeight);
    }

    //初始化文件列表信息
    this.FileInfoSet.forEach((infoList) => {
        infoList.forEach((_, index, array) => {
            let FileInfoSetSel = array[index];
            let iXLeftSeconds = parseInt(
                (FileInfoSetSel.m_tStartTime.m_iMilliseconds -
                    this.m_tCurrentMidTime.m_iMilliseconds) /
                    1000
            );
            let iFilePosLeft =
                this.m_iMiddleLinePos +
                parseInt(
                    parseFloat(iXLeftSeconds / (3600 * this.m_fCellTime)) *
                        this.m_iCellWidth
                );

            /*let iXRightSeconds = (tStopTime.m_iHour - this.m_tCurrentMidTime.m_iHour) * 3600 + (tStopTime.m_iMinute - this.m_tCurrentMidTime.m_iMinute) * 60 + (tStopTime.m_iSecond - this.m_tCurrentMidTime.m_iSecond);*/
            let iXRightSeconds = parseInt(
                (FileInfoSetSel.m_tStopTime.m_iMilliseconds -
                    this.m_tCurrentMidTime.m_iMilliseconds) /
                    1000
            );

            let iFilePosRight =
                this.m_iMiddleLinePos +
                parseInt(
                    parseFloat(iXRightSeconds / (3600 * this.m_fCellTime)) *
                        this.m_iCellWidth
                );
            if (iFilePosRight - iFilePosLeft < this.m_iMinFileWidth) {
                iFilePosRight = iFilePosLeft + this.m_iMinFileWidth;
            }
            FileInfoSetSel.setPos(
                iFilePosLeft,
                this.m_iTimeRectHeight + parseInt(this.m_iBlankHeight / 2),
                iFilePosRight - iFilePosLeft,
                this.m_iFileRectHeight + 2
            );
        });
    });
    this.repaint(true);
};

/*************************************************
Function:		SetSpantype
Description:	设置时间条的显示样式
Input:			无
Output:			无
return:			无
*************************************************/
TimeBar.prototype.SetSpantype = function (iSpanType) {
    switch (iSpanType) {
        case 6: //每2小时一格
            this.ScaleInfoDisNum = 12;
            this.m_fCellTime = parseFloat(2.0);
            break;
        case 7: //每小时一格
            this.ScaleInfoDisNum = 12;
            this.m_fCellTime = parseFloat(1.0);
            break;
        case 8: //每半小时一格
            this.ScaleInfoDisNum = 12;
            this.m_fCellTime = parseFloat(0.5);
            break;
        case 9: //每半小时一格
            this.ScaleInfoDisNum = 8;
            this.m_fCellTime = parseFloat(0.5);
            break;
        case 10: //每10分钟一格
            this.ScaleInfoDisNum = 12;
            this.m_fCellTime = parseFloat(1 / 6);
            break;
        case 11: //每5分钟一格
            this.ScaleInfoDisNum = 12;
            this.m_fCellTime = parseFloat(1 / 12);
            break;
        case 12: //每5分钟一格
            this.ScaleInfoDisNum = 6;
            this.m_fCellTime = parseFloat(1 / 12);
            break;
        default:
            this.ScaleInfoDisNum = 12;
            this.m_fCellTime = parseFloat(1.0);
            return;
    }
    this.ScaleInfoNum = parseInt(24 / this.m_fCellTime, 10);
    this.m_iCellWidth = Math.floor(
        (this.m_iWidth - this.m_iFileListStartPos) / this.ScaleInfoDisNum
    );
    this.m_iCellMilliseconds = parseInt(
        (3600 * this.m_fCellTime * 1000) / this.m_iCellWidth,
        10
    );

    //初始化刻度
    this.ScaleInfo.length = 0;
    for (let i = 0; i < this.ScaleInfoNum; i++) {
        this.ScaleInfo.push(
            new ScaleInfo(0, 0, parseInt(i * 3600 * this.m_fCellTime))
        );
    }

    //初始化时间刻度信息
    for (let i = 0; i < this.ScaleInfoNum; i++) {
        // 计算与中轴线的时间差（只计算时分秒）
        let seconds =
            (this.ScaleInfo[i].m_iHour - this.m_tCurrentMidTime.m_iHour) *
                3600 +
            (this.ScaleInfo[i].m_iMinute - this.m_tCurrentMidTime.m_iMinute) *
                60 +
            (this.ScaleInfo[i].m_iSecond - this.m_tCurrentMidTime.m_iSecond);
        let iScalePos =
            this.m_iMiddleLinePos +
            parseInt(
                parseFloat(seconds / (3600 * this.m_fCellTime)) *
                    this.m_iCellWidth
            );
        // 设置刻度位置范围
        this.ScaleInfo[i].setPosRange(
            this.m_iFileListStartPos,
            this.m_iFileListStartPos +
                parseInt(this.m_iCellWidth * this.ScaleInfoNum)
        );
        this.ScaleInfo[i].setPos(iScalePos, this.m_iTimeRectHeight);
    }

    //初始化文件列表信息
    this.FileInfoSet.forEach((fileInfoArr) => {
        fileInfoArr.forEach((fileInfo) => {
            let FileInfoSetSel = fileInfo;
            let iXLeftSeconds = parseInt(
                (FileInfoSetSel.m_tStartTime.m_iMilliseconds -
                    this.m_tCurrentMidTime.m_iMilliseconds) /
                    1000
            );
            let iFilePosLeft =
                this.m_iMiddleLinePos +
                parseInt(
                    parseFloat(iXLeftSeconds / (3600 * this.m_fCellTime)) *
                        this.m_iCellWidth
                );

            /*let iXRightSeconds = (tStopTime.m_iHour - this.m_tCurrentMidTime.m_iHour) * 3600 + (tStopTime.m_iMinute - this.m_tCurrentMidTime.m_iMinute) * 60 + (tStopTime.m_iSecond - this.m_tCurrentMidTime.m_iSecond);*/
            let iXRightSeconds = parseInt(
                (FileInfoSetSel.m_tStopTime.m_iMilliseconds -
                    this.m_tCurrentMidTime.m_iMilliseconds) /
                    1000
            );

            let iFilePosRight =
                this.m_iMiddleLinePos +
                parseInt(
                    parseFloat(iXRightSeconds / (3600 * this.m_fCellTime)) *
                        this.m_iCellWidth
                );
            if (iFilePosRight - iFilePosLeft < this.m_iMinFileWidth) {
                iFilePosRight = iFilePosLeft + this.m_iMinFileWidth;
            }
            FileInfoSetSel.setPos(
                iFilePosLeft,
                this.m_iTimeRectHeight + parseInt(this.m_iBlankHeight / 2),
                iFilePosRight - iFilePosLeft,
                this.m_iFileRectHeight + 2
            );
        });
    });
    this.repaint(true);
};
/*************************************************
Function:		addFile
Description:	添加文件
Input:			StartTime 开始时间, StopTime 结束时间, iType 类型, iWndNum 默认当前窗口 添加到某个窗口
Output:			无
return:			无
*************************************************/
TimeBar.prototype.addFile = function (
    StartTime,
    StopTime,
    iType /*, iWndNum*/
) {
    let tStartTime = new Time();
    let tStopTime = new Time();
    tStartTime.parseTime(StartTime);
    tStopTime.parseTime(StopTime);
    let fileColor;
    switch (iType) {
        case 1:
            fileColor = this.scheFileColor;
            break;
        case 2:
            fileColor = this.alarmFileColor;
            break;
        case 3:
            fileColor = this.cmdFileColor;
            break;
        case 4:
            fileColor = this.manualFileColor;
            break;
        default:
            fileColor = this.defaultFileColor;
            break;
    }
    /*let iXLeftSeconds = (tStartTime.m_iHour - this.m_tCurrentMidTime.m_iHour) * 3600 + (tStartTime.m_iMinute - this.m_tCurrentMidTime.m_iMinute) * 60 + (tStartTime.m_iSecond - this.m_tCurrentMidTime.m_iSecond);*/
    let iXLeftSeconds = parseInt(
        (tStartTime.m_iMilliseconds - this.m_tCurrentMidTime.m_iMilliseconds) /
            1000
    );
    let iFilePosLeft =
        this.m_iMiddleLinePos +
        parseInt(
            parseFloat(iXLeftSeconds / (3600 * this.m_fCellTime)) *
                this.m_iCellWidth
        );
    /*let iXRightSeconds = (tStopTime.m_iHour - this.m_tCurrentMidTime.m_iHour) * 3600 + (tStopTime.m_iMinute - this.m_tCurrentMidTime.m_iMinute) * 60 + (tStopTime.m_iSecond - this.m_tCurrentMidTime.m_iSecond);*/
    let iXRightSeconds = parseInt(
        (tStopTime.m_iMilliseconds - this.m_tCurrentMidTime.m_iMilliseconds) /
            1000
    );

    let iFilePosRight =
        this.m_iMiddleLinePos +
        parseInt(
            parseFloat(iXRightSeconds / (3600 * this.m_fCellTime)) *
                this.m_iCellWidth
        );
    let fileInfo = new FileInfo(
        iFilePosLeft,
        this.m_iTimeRectHeight + parseInt(this.m_iBlankHeight / 2),
        iFilePosRight - iFilePosLeft,
        this.m_iFileRectHeight + 2,
        iType,
        fileColor,
        tStartTime,
        tStopTime
    );
    fileInfo.setPosRange(
        this.m_iFileListStartPos,
        this.m_iFileListStartPos +
            parseInt(this.m_iCellWidth * this.ScaleInfoNum)
    );
    if (arguments.length >= 4) {
        this.FileInfoSet[arguments[3]].push(fileInfo);
    } else {
        this.FileInfoSet[this.m_iSelWnd].push(fileInfo);
    }
};

TimeBar.prototype.clearFile = function () {
    this.clearWndFileList(0);
    this.clearWndFileList(1);
    // this.repaint();
};

// TimeBar.prototype.addFileList = function (StartTime, StopTime, iType/*, iWndNum*/) {
TimeBar.prototype.addFileList = function (fileInfoList) {
    fileInfoList.forEach((fileList, index) => {
        fileList.forEach(
            ({ startTime, stopTime, iWndNum, iType, fileSize, avEncoding }) => {
                let tStartTime = new Time();
                let tStopTime = new Time();
                tStartTime.parseTime(startTime);
                tStopTime.parseTime(stopTime);
                let fileColor;
                switch (iType) {
                    case 1:
                        fileColor = this.scheFileColor;
                        break;
                    case 2:
                        fileColor = this.alarmFileColor;
                        break;
                    case 3:
                        fileColor = this.cmdFileColor;
                        break;
                    case 4:
                        fileColor = this.manualFileColor;
                        break;
                    default:
                        fileColor = this.defaultFileColor;
                        break;
                }
                /*let iXLeftSeconds = (tStartTime.m_iHour - this.m_tCurrentMidTime.m_iHour) * 3600 + (tStartTime.m_iMinute - this.m_tCurrentMidTime.m_iMinute) * 60 + (tStartTime.m_iSecond - this.m_tCurrentMidTime.m_iSecond);*/
                let iXLeftSeconds = parseInt(
                    (tStartTime.m_iMilliseconds -
                        this.m_tCurrentMidTime.m_iMilliseconds) /
                        1000
                );
                let iFilePosLeft =
                    this.m_iMiddleLinePos +
                    parseInt(
                        parseFloat(iXLeftSeconds / (3600 * this.m_fCellTime)) *
                            this.m_iCellWidth
                    );

                /*let iXRightSeconds = (tStopTime.m_iHour - this.m_tCurrentMidTime.m_iHour) * 3600 + (tStopTime.m_iMinute - this.m_tCurrentMidTime.m_iMinute) * 60 + (tStopTime.m_iSecond - this.m_tCurrentMidTime.m_iSecond);*/
                let iXRightSeconds = parseInt(
                    (tStopTime.m_iMilliseconds -
                        this.m_tCurrentMidTime.m_iMilliseconds) /
                        1000
                );

                let iFilePosRight =
                    this.m_iMiddleLinePos +
                    parseInt(
                        parseFloat(iXRightSeconds / (3600 * this.m_fCellTime)) *
                            this.m_iCellWidth
                    );
                let fileInfo = new FileInfo(
                    iFilePosLeft,
                    this.m_iTimeRectHeight + parseInt(this.m_iBlankHeight / 2),
                    iFilePosRight - iFilePosLeft,
                    this.m_iFileRectHeight + 2,
                    iType,
                    fileColor,
                    tStartTime,
                    tStopTime,
                    fileSize,
                    avEncoding,
                    iWndNum
                );
                fileInfo.setPosRange(
                    this.m_iFileListStartPos,
                    this.m_iFileListStartPos +
                        parseInt(this.m_iCellWidth * this.ScaleInfoNum)
                );

                this.FileInfoSet[index].push(fileInfo);
            }
        );
    });
};

/*************************************************
Function:		clearWndFileList
Description:	清空某个窗口的文件信息
Input:			iWndNum 窗口号 0-15 默认当前选中窗口
Output:			无
return:			无
*************************************************/
TimeBar.prototype.clearWndFileList = function () /*iWndNum*/ {
    let iWndParam;
    if (arguments.length == 0) {
        iWndParam = this.m_iSelWnd;
    } else {
        iWndParam = arguments[0];
    }
    if (iWndParam < 0) {
        iWndParam = 0;
    }
    if (iWndParam >= 16) {
        iWndParam = 15;
    }
    this.FileInfoSet[iWndParam].length = 0;
};

/*************************************************
Function:		setMidLineTime
Description:	设置中轴线时间
Input:			szTime yyyy-MM-dd HH:mm:ss
Output:			无
return:			无
*************************************************/
TimeBar.prototype.setMidLineTime = function (szTime) {
    let tCurTime = new Time();
    tCurTime.parseTime(szTime);
    this.m_tCurrentMidTime.setTimeByMis(tCurTime.m_iMilliseconds);
    /*this.updateScalePos();
	this.updateFileListPos();*/
    this.repaint();
};

/*************************************************
Function:		setMouseUpCallback
Description:	设置鼠标弹起回调函数
Input:			func 回调函数 function(tStartTime, tStopTime)
Output:			无
return:			无
*************************************************/
TimeBar.prototype.setMouseUpCallback = function (callbackFunc) {
    this.mouseUpCallbackFunc = callbackFunc;
};
TimeBar.prototype.setMouseWheelCallback = function(callbackFunc) {
    this.mousewheelCallbackFunc = callbackFunc;
};

export { TimeBar, Time };
