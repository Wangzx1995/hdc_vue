import { oTool } from "./tool/tool";
import { StreamClient } from "./streamClient/streamClient";
import { JSPlayCtrl } from "./playctrl/JSPlaySDKInterface";
import { StorageManager } from "./storage/storage";
import { ESCanvas } from "./draw/ESCanvas";
// import {oUtils} from "../../common/utils";

/**
 * @synopsis 插件类
 *
 * @param options [IN] ： 插件初始化配置对象
 *
 * @note [ADD]新建 zhengmaqiang
 */

let HATMediaJsPlugin = (function () {
    let that = null;
    // 常量
    const DECODE_ALL = 0;  //解码所有帧
    const DECODE_VODEO_KEYFRAME = 1;  //只解码I帧
    const MEDIAHEADLENGTH = 40;  //媒体头长度
    const PLAYCTRLRECBUFFER = 1024 * 1024 * 4;

    //错误码
    //取流
    const ERROR_STREAM_TRANS = 1001;     //码流传输过程异常
    const ERROR_STREAM_PLAYBACK_END = 1002;  //回放结束
    const CONNECTION_CLOSED = 1003;  //连接被动断开
    //播放
    const ERROR_VIDEO_CODING = 2001;     //视频编码格式不支持
    const ERROR_CAPTURE_MEMORY = 2002;    //内存不足，抓图失败
    //存储
    //const ERROR_MAX_FILE_SIZE = 3001;     //文件大小超限

    //初始化取流库
    let oStreamClient = new StreamClient();  //1.0-websockt取流版本号, 0-秘钥套件
    //初始化转封装库
    let oStorageManager = null;
    //jsplugin对象
    let oJSPlugin = null;

    //私有成员变量，用Symbol模拟成员变量
    const OPTIONS = Symbol("OPTIONS");  //构造函数对象参数
    const CURRENTPLAYRATE = Symbol("CURRENTPLAYRATE");  //当前回放倍速
    const CURRENTSOUNDWND = Symbol("CURRENTSOUNDWND");  //当前声音开启的窗口索引
    const MAXWNDNUM = Symbol("MAXWNDNUM");  //最大窗口数目
    const WNDSTATUSLIST = Symbol("MAXWNDNUM");  //窗口状态列表
    const DRAWCANVAS = Symbol("DRAWCANVAS");  //视频叠加绘制画布
    const SHAPEID = Symbol("SHAPEID");  //记录绘制图形的ID
    const WINDOWFULL = Symbol("WINDOWFULL");  //窗口是否全屏
    const SINGLEWINDOW = Symbol("SINGLEWINDOW");  //窗口是否全屏
    const FILETMP = Symbol("FILETMP");  //临时文件
    const STATUSTMP = Symbol("STATUSTMP");  //临时状态
    const UPGRADESTATUSURL = Symbol("UPGRADESTATUSURL");  //升级状态url
    const CURWNDINDEX = Symbol("CURWNDINDEX");  //当前窗口索引
    const CALLBACKFUNCTION = Symbol("CALLBACKFUNCTION");    //画图回调函数
    const CALLBACKFUNCTIONS = Symbol("CALLBACKFUNCTIONS");  //画图回调函数CALLBACKFUNCTION的数组
    const EVENTCALLBACK = Symbol("EVENTCALLBACK");  //事件回调
    const PLUGINVERSION = Symbol("PLUGINVERSION");  //无插件版本
    const CANFULLSCREEN = Symbol("CANFULLSCREEN");  //是否可以全屏
    const DRAWWNDINDEX = Symbol("DRAWWNDINDEX");  //当前要绘制的窗口，非选中窗口
    const CURDRAWWNDINDEX = Symbol("CURDRAWWNDINDEX");  //当前实际绘制的窗口

    //监听浏览器标签切换、最小化
    function listenBrowserVisibility() {
        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                for (let i = 0; i < 16; i++) {
                    if (that[WNDSTATUSLIST][i] && that[WNDSTATUSLIST][i].bLoad) {
                        that[WNDSTATUSLIST][i].oPlayCtrl.PlayM4_IsVisible(false);  //如果tab不在active状态，设置到播放库，不解码
                    }
                }
            } else {
                for (let i = 0; i < 16; i++) {
                    if (that[WNDSTATUSLIST][i] && that[WNDSTATUSLIST][i].bLoad) {
                        that[WNDSTATUSLIST][i].oPlayCtrl.PlayM4_IsVisible(true);
                    }
                }
            }
        }, false);
    }

    //创建插件播放窗口
    function createWindows(iWidth, iHeight) {
        if (iWidth && iHeight) {
            that[OPTIONS].iWidth = iWidth;
            that[OPTIONS].iHeight = iHeight;
        }
        //计算单个窗口宽高且修正
        let iFixWidth = that[OPTIONS].iWidth % that[OPTIONS].iCurrentSplit;
        let iFixHeight = that[OPTIONS].iHeight % that[OPTIONS].iCurrentSplit;
        let iPerWidth = (that[OPTIONS].iWidth - iFixWidth - that[OPTIONS].iCurrentSplit * 2) / that[OPTIONS].iCurrentSplit;
        let iPerHeight = (that[OPTIONS].iHeight - iFixHeight - that[OPTIONS].iCurrentSplit * 2) / that[OPTIONS].iCurrentSplit;
        let iWndWidth = (that[OPTIONS].iWidth - iFixWidth) / that[OPTIONS].iCurrentSplit;
        let iWndHeight = (that[OPTIONS].iHeight - iFixHeight) / that[OPTIONS].iCurrentSplit;
        let iType = that[OPTIONS].iCurrentSplit;
        if (that[OPTIONS].szIframeId && $("#" + that[OPTIONS].szIframeId).length) { //定义了iframeId
            oJSPlugin = $("#" + that[OPTIONS].szId, $("#" + that[OPTIONS].szIframeId)[0].contentWindow.document);
        } else {
            if (typeof that[OPTIONS].szId === "string") {
                oJSPlugin = $("#" + that[OPTIONS].szId);
            } else {
                oJSPlugin = that[OPTIONS].szId;
            }
        }
        //构造页面dom
        let szHtml = '<div class="parent-wnd" style="overflow:hidden;width:100%; height:100%; position: relative;">';
        for (let i = 0; i < that[MAXWNDNUM]; i++) {
            iWidth = iPerWidth + ((i % iType === (iType - 1)) ? iFixWidth : 0);
            iHeight = iPerHeight + (((i + iType) >= Math.pow(iType, 2)) ? iFixHeight : 0);
            let iPlayWndWidth = iWndWidth + ((i % iType === (iType - 1)) ? iFixWidth : 0);
            let iPlayWndHeight = iWndHeight + (((i + iType) >= Math.pow(iType, 2)) ? iFixHeight : 0);
            szHtml += '<div style="float:left; background-color: ' + that.oPluginColor.subBackgroundColor + '; position: relative; width: ' + iPlayWndWidth + 'px; height: ' + iPlayWndHeight + 'px;">'
                + '<img style="display:none;" id="playImg' + i + '" src="">'
                + '<canvas id="' + that[OPTIONS].szId + 'canvas_play' + i + '" class="play-window" style="border:1px solid ' + that.oPluginColor.borderColor + ';" wid="'
                + i + '" width="' + iWidth + '" height="' + iHeight + '"></canvas>'
                + '<canvas id="' + that[OPTIONS].szId + 'canvas_draw' + i + '"  class="draw-window" style="position:absolute; top:0; left:0;" wid="' + i + '" width='
                + iPlayWndWidth + ' height=' + iPlayWndHeight + '></canvas>'
                + '</div>';
        }
        szHtml += "</div>";
        oJSPlugin.html(szHtml);
        oJSPlugin.find(".parent-wnd").eq(0).children().eq(0).find(".play-window").eq(0).css("border", "1px solid " + that.oPluginColor.selectBorderColor);  //默认选中第一个窗口
    }

    //事件回调初始化
    function initCallbackEvent() {
        //插件相关事件回调
        that.EventCallback = (function () {
            return {
                loadEventHandler: function () {
                    window.loadEventHandler && window.loadEventHandler();
                },
                zoomEventResponse: function (/*iMode, aPoint*/) {  //电子放大回调
                    /*if (iMode === 1) {
                        let szXml = "";
                        window.ZoomInfoCallback && window.ZoomInfoCallback(szXml);
                    }*/
                },
                windowEventSelect: function (iWndIndex, bForce) {  //插件选中窗口回调
                    if (that[CURWNDINDEX] === iWndIndex && !bForce) {
                        return;
                    }
                    that[CURWNDINDEX] = iWndIndex;
                    //如果设置了非默认的固定绘制窗口
                    if (that[DRAWWNDINDEX] >= 0 && that[DRAWWNDINDEX] <= (that[MAXWNDNUM] - 1)) {
                        if (that[CURDRAWWNDINDEX] === that[DRAWWNDINDEX]) {
                            return;
                        }
                        iWndIndex = that[DRAWWNDINDEX];
                    }
                    that[CURDRAWWNDINDEX] = iWndIndex; //记录下当前绘制区域的窗口索引
                    if (0 <= iWndIndex) {
                        that[CALLBACKFUNCTION] = that[CALLBACKFUNCTIONS][iWndIndex];
                    }
                    // 切换窗口通道后，需要更新画布，这样画图信息才对
                    $(".draw-window").unbind();
                    that[DRAWCANVAS].setDrawStatus(false);
                    that[DRAWCANVAS] = null;
                    that[DRAWCANVAS] = new ESCanvas(that[OPTIONS].szId + "canvas_draw" + iWndIndex);
                    that[DRAWCANVAS].setShapeType("Rect");
                    that[DRAWCANVAS].setDrawStyle("#ff0000", "", 0);

                    if (that[WNDSTATUSLIST][iWndIndex].bEZoom || that[WNDSTATUSLIST][iWndIndex].bSetDrawCallback) {
                        if (that[WNDSTATUSLIST][iWndIndex].bEZoom) {
                            that[DRAWCANVAS].setDrawStatus(true, function (oRECT) {
                                if (oRECT.startPos && oRECT.endPos) {
                                    if (oRECT.startPos[0] > oRECT.endPos[0]) {
                                        that[WNDSTATUSLIST][iWndIndex].oPlayCtrl.PlayM4_SetDisplayRegion(null, false);
                                    } else {
                                        that[WNDSTATUSLIST][iWndIndex].oPlayCtrl.PlayM4_SetDisplayRegion({
                                            left: oRECT.startPos[0],
                                            top: oRECT.startPos[1],
                                            right: oRECT.endPos[0],
                                            bottom: oRECT.endPos[1]
                                        }, true);
                                    }
                                }
                            });
                        } else if (that[WNDSTATUSLIST][iWndIndex].bSetDrawCallback) {
                            that[DRAWCANVAS].setDrawStatus(true, function (oRECT) {
                                that[CALLBACKFUNCTION](oRECT);
                            });
                        }
                    }
                    if (that[EVENTCALLBACK].onGetSelectWndInfo) {
                        that[EVENTCALLBACK].onGetSelectWndInfo(iWndIndex);
                    }
                },
                pluginErrorHandler: function (iWndIndex, iErrorCode, oError) {  //插件错误回调
                    if (that[EVENTCALLBACK].onPluginEventHandler) {
                        that[EVENTCALLBACK].onPluginEventHandler(iWndIndex, iErrorCode, oError);
                    }
                },
                windowEventOver: function (iWndIndex) {
                    if (that[EVENTCALLBACK].onWindowEventOver) {
                        that[EVENTCALLBACK].onWindowEventOver(iWndIndex);
                    }
                },
                windowEventOut: function (iWndIndex) {
                    if (that[EVENTCALLBACK].onWindowEventOut) {
                        that[EVENTCALLBACK].onWindowEventOut(iWndIndex);
                    }
                },
                windowEventUp: function (iWndIndex) {
                    if (that[EVENTCALLBACK].onWindowEventUp) {
                        that[EVENTCALLBACK].onWindowEventUp(iWndIndex);
                    }
                },
                windowFullCcreenChange: function (bFull) {
                    if (that[EVENTCALLBACK].onWindowFullCcreenChange) {
                        that[EVENTCALLBACK].onWindowFullCcreenChange(bFull);
                    }
                },
                firstFrameDisplay: function (iWndIndex) {
                    if (that[EVENTCALLBACK].onFirstFrameDisplay) {
                        that[EVENTCALLBACK].onFirstFrameDisplay(iWndIndex);
                    }
                },
                performanceLack: function () {
                    if (that[EVENTCALLBACK].onPerformanceLack) {
                        that[EVENTCALLBACK].onPerformanceLack();
                    }
                },
                mouseEvent: function (iWndIndex, iMouseEventType, iMouseX, iMouseY) {
                    if (that[EVENTCALLBACK].onMouseEvent) {
                        that[EVENTCALLBACK].onMouseEvent({
                            eventType: iMouseEventType,
                            point: [iMouseX, iMouseY],
                            wndIndex: iWndIndex
                        });
                    }
                }
            };
        })();
    }

    //事件初始化
    function initEvent() {
        //事件回调初始化
        initCallbackEvent();
        oJSPlugin.find(".parent-wnd").eq(0).children().each(function (i) {
            let self = this;
            let bMouseDown = false;
            $(self).unbind().bind("mousedown", function (e) {
                oJSPlugin.find(".parent-wnd").eq(0).find(".play-window").css("border", "1px solid " + that.oPluginColor.borderColor);
                oJSPlugin.find(".parent-wnd").eq(0).children().eq(i).find(".play-window").eq(0).css("border", "1px solid " + that.oPluginColor.selectBorderColor);
                that.EventCallback.windowEventSelect(parseInt(oJSPlugin.find(".parent-wnd").eq(0).children().eq(i).find(".play-window").eq(0).attr("wid"), 10));

                bMouseDown = true;
                let iMouseX = e.offsetX / that[DRAWCANVAS].m_iCanvasWidth;
                let iMouseY = e.offsetY / that[DRAWCANVAS].m_iCanvasHeight;
                if (e.button === 2) {
                    that.EventCallback.mouseEvent(i, 4, iMouseX, iMouseY);
                } else if (e.button === 0) {
                    that.EventCallback.mouseEvent(i, 1, iMouseX, iMouseY);
                }
                e.stopPropagation();
            });
            $(self).bind("mousemove", function (e) {
                let iMouseX = e.offsetX / that[DRAWCANVAS].m_iCanvasWidth;
                let iMouseY = e.offsetY / that[DRAWCANVAS].m_iCanvasHeight;
                if (bMouseDown) {
                    that.EventCallback.mouseEvent(i, 7, iMouseX, iMouseY);
                } else {
                    that.EventCallback.mouseEvent(i, 6, iMouseX, iMouseY);
                }
                e.stopPropagation();
            });
            $(self).bind("mousewheel", function (e) {
                let iMouseX = e.offsetX / that[DRAWCANVAS].m_iCanvasWidth;
                let iMouseY = e.offsetY / that[DRAWCANVAS].m_iCanvasHeight;
                that.EventCallback.mouseEvent(i, 8, iMouseX, iMouseY);
                e.stopPropagation();
            });
            $(self).bind("mouseover", function (e) {
                that.EventCallback.windowEventOver(i);
                e.stopPropagation();
            });
            $(self).bind("mouseout", function (e) {
                that.EventCallback.windowEventOut(i);
                e.stopPropagation();
            });
            $(self).bind("mouseup", function (e) {
                bMouseDown = false;
                that.EventCallback.windowEventUp(i);
                let iMouseX = e.offsetX / that[DRAWCANVAS].m_iCanvasWidth;
                let iMouseY = e.offsetY / that[DRAWCANVAS].m_iCanvasHeight;
                if (e.button === 2) {
                    that.EventCallback.mouseEvent(i, 5, iMouseX, iMouseY);
                } else if (e.button === 0) {
                    that.EventCallback.mouseEvent(i, 3, iMouseX, iMouseY);
                }
                //e.stopPropagation();  //防止mouseup事件无法冒泡
            });
            $(self).bind("dblclick", function (e) {
                if (!that[WNDSTATUSLIST][that[CURWNDINDEX]].bPlay/* || that[OPTIONS].iType !== 2*/) {
                    return;
                }
                if (!that[CANFULLSCREEN]) {
                    return;
                }
                let bFullscreen = document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || false;
                let element = $(self).get(0);
                if (!bFullscreen) {
                    if (element.requestFullScreen) {
                        element.requestFullScreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    }
                    that[SINGLEWINDOW] = $(self);
                } else {
                    if (oJSPlugin.find(".parent-wnd").eq(0).width() === $(window).width()) {
                        return;
                    }
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    }
                    that[SINGLEWINDOW] = null;
                    that[WINDOWFULL] = false;
                }
                let iMouseX = e.offsetX / that[DRAWCANVAS].m_iCanvasWidth;
                let iMouseY = e.offsetX / that[DRAWCANVAS].m_iCanvasHeight;
                that.EventCallback.mouseEvent(i, 2, iMouseX, iMouseY);
                e.stopPropagation();
            });
        });
        //监听全屏变化事件
        if (typeof document.fullScreen !== "undefined") {
            document.addEventListener("fullscreenchange", function () {
                let bFullscreen = document.fullscreen || false;
                that.EventCallback.windowFullCcreenChange(bFullscreen);
            });
        } else if (typeof document.webkitIsFullScreen !== "undefined") {
            document.addEventListener("webkitfullscreenchange", function () {
                let bFullscreen = document.webkitIsFullScreen || false;
                that.EventCallback.windowFullCcreenChange(bFullscreen);
            });
        } else if (typeof document.mozFullScreen !== "undefined") {
            document.addEventListener("mozfullscreenchange", function () {
                let bFullscreen = document.mozFullScreen || false;
                that.EventCallback.windowFullCcreenChange(bFullscreen);
            });
        }
    }

    //更新窗口
    function updateWnd(bChangeWnd) {
        if (that[OPTIONS].aCustom && that[OPTIONS].aCustom.length > 0) { //如果当前是二分屏，暂定为1.5
            arrangeCustomWindow();
        } else {
            let iLen = oJSPlugin.find(".parent-wnd").eq(0).children().length;
            let iFixWidth = that[OPTIONS].iWidth % that[OPTIONS].iCurrentSplit;
            let iFixHeight = that[OPTIONS].iHeight % that[OPTIONS].iCurrentSplit;
            let iPerWidth = (that[OPTIONS].iWidth - iFixWidth - that[OPTIONS].iCurrentSplit * 2) / that[OPTIONS].iCurrentSplit;
            let iPerHeight = (that[OPTIONS].iHeight - iFixHeight - that[OPTIONS].iCurrentSplit * 2) / that[OPTIONS].iCurrentSplit;
            let iWndWidth = (that[OPTIONS].iWidth - iFixWidth) / that[OPTIONS].iCurrentSplit;
            let iWndHeight = (that[OPTIONS].iHeight - iFixHeight) / that[OPTIONS].iCurrentSplit;
            let iType = that[OPTIONS].iCurrentSplit;
            for (let i = 0; i < iLen; i++) {
                let iWidth = iPerWidth + ((i % iType === (iType - 1)) ? iFixWidth : 0);
                let iHeight = iPerHeight + (((i + iType) >= Math.pow(iType, 2)) ? iFixHeight : 0);
                let iPlayWndWidth = iWndWidth + ((i % iType === (iType - 1)) ? iFixWidth : 0);
                let iPlayWndHeight = iWndHeight + (((i + iType) >= Math.pow(iType, 2)) ? iFixHeight : 0);
                oJSPlugin.find(".parent-wnd").eq(0).children().eq(i).width(iPlayWndWidth);
                oJSPlugin.find(".parent-wnd").eq(0).children().eq(i).height(iPlayWndHeight);
                oJSPlugin.find(".parent-wnd").eq(0).children().eq(i).find(".draw-window").attr("width", iPlayWndWidth);
                oJSPlugin.find(".parent-wnd").eq(0).children().eq(i).find(".draw-window").attr("height", iPlayWndHeight);
                oJSPlugin.find(".parent-wnd").eq(0).children().eq(i).find(".play-window").attr("width", iWidth);
                oJSPlugin.find(".parent-wnd").eq(0).children().eq(i).find(".play-window").attr("height", iHeight);
            }
            if (that[DRAWCANVAS] && bChangeWnd) { //改变分屏时重设一下
                //窗口大小更新时，对当前DRAWCANVAS进行大小重绘,光样式改变会导致绘制坐标的异常。其他DRAWCANVAS会在窗口选择时重绘
                that[DRAWCANVAS].resizeCanvas();
            }
            oJSPlugin.find(".parent-wnd").eq(that[CURWNDINDEX]).find(".play-window").css("border", "1px solid " + that.oPluginColor.borderColor);
            oJSPlugin.find(".parent-wnd").eq(that[CURWNDINDEX]).children().eq(0).find(".play-window").eq(0).css("border", "1px solid " + that.oPluginColor.selectBorderColor);  //默认选中第一个窗口
        }
    }
    /**
     * @synopsis 自定义窗口模式(目前仅支持2分屏)
     *
     * @param {object} aCustom 窗口类型
     *
     * @returns {none} 无
     */
    function arrangeCustomWindow() {
        let iWidthSplit = that[OPTIONS].iCurrentSplit;
        let iHeightSplit = that[OPTIONS].iCurrentSplit;
        let aWindows = that[OPTIONS].aCustom;
        if (aWindows) {
            iWidthSplit = 1 / aWindows[0].width;
            iHeightSplit = 1 / aWindows[0].height;
        }
        let iLen = oJSPlugin.find(".parent-wnd").eq(0).children().length;
        let iFixWidth = that[OPTIONS].iWidth % iWidthSplit;
        let iFixHeight = that[OPTIONS].iHeight % iHeightSplit;
        let iPerWidth = (that[OPTIONS].iWidth - iFixWidth - iWidthSplit * 2) / iWidthSplit;
        let iPerHeight = (that[OPTIONS].iHeight - iFixHeight - iHeightSplit * 2) / iHeightSplit;
        let iWndWidth = (that[OPTIONS].iWidth - iFixWidth) / iWidthSplit;
        let iWndHeight = (that[OPTIONS].iHeight - iFixHeight) / iHeightSplit;
        for (let i = 0; i < iLen; i++) {
            let iWidth = iPerWidth + ((i % iWidthSplit === (iWidthSplit - 1)) ? iFixWidth : 0);
            let iHeight = iPerHeight + (((i + iHeightSplit) >= Math.pow(iHeightSplit, 2)) ? iFixHeight : 0);
            let iPlayWndWidth = iWndWidth + ((i % iWidthSplit === (iWidthSplit - 1)) ? iFixWidth : 0);
            let iPlayWndHeight = iWndHeight + (((i + iHeightSplit) >= Math.pow(iHeightSplit, 2)) ? iFixHeight : 0);
            oJSPlugin.find(".parent-wnd").eq(0).children().eq(i).width(iPlayWndWidth);
            oJSPlugin.find(".parent-wnd").eq(0).children().eq(i).height(iPlayWndHeight);
            oJSPlugin.find(".parent-wnd").eq(0).children().eq(i).find(".draw-window").attr("width", iPlayWndWidth);
            oJSPlugin.find(".parent-wnd").eq(0).children().eq(i).find(".draw-window").attr("height", iPlayWndHeight);
            oJSPlugin.find(".parent-wnd").eq(0).children().eq(i).find(".play-window").attr("width", iWidth);
            oJSPlugin.find(".parent-wnd").eq(0).children().eq(i).find(".play-window").attr("height", iHeight);
        }
        oJSPlugin.find(".parent-wnd").eq(that[CURWNDINDEX]).find(".play-window").css("border", "1px solid " + that.oPluginColor.borderColor);
        oJSPlugin.find(".parent-wnd").eq(that[CURWNDINDEX]).children().eq(0).find(".play-window").eq(0).css("border", "1px solid " + that.oPluginColor.selectBorderColor);  //默认选中第一个窗口
    }

    //创建播放库worker回调
    function cbPlayCtrlCallback(szUrl, oParams, iWndNum, szStartTime, szStopTime, resolve, reject) {
        if (!$("#" + that[WNDSTATUSLIST][iWndNum].windowID).length) {
            return;
        }
        let bPlayback = false;
        if (szStartTime && szStopTime) {
            bPlayback = true;
        }
        that[WNDSTATUSLIST][iWndNum].bLoad = true;
        oStreamClient.openStream(szUrl, oParams, function (data) {
            if (!that[WNDSTATUSLIST][iWndNum].oPlayCtrl) {
                return;
            }
            if (data.bHead && !that[WNDSTATUSLIST][iWndNum].bPlay) {  //判断是否开启预览，用于初始化播放库，回放跳片段是会返回媒体头，不能只判断是否为媒体头
                that[WNDSTATUSLIST][iWndNum].bPlay = true;
                that[WNDSTATUSLIST][iWndNum].aHead = new Uint8Array(data.buf);
                that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_OpenStream(data.buf, MEDIAHEADLENGTH, 1024 * 1024 * 2);
                if (that[WNDSTATUSLIST][iWndNum].szSecretKey !== "") {
                    setTimeout(function () {
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetSecretKey(1, that[WNDSTATUSLIST][iWndNum].szSecretKey, 128);
                        that[WNDSTATUSLIST][iWndNum].szSecretKey = "";
                    }, 100);
                }
                if (that[WNDSTATUSLIST][iWndNum].aHead[8] === 4) {
                    that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetStreamOpenMode(0);  //设置取流模式   0实时流 1文件流
                } else {
                    that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetStreamOpenMode(1);  //设置取流模式   0实时流 1文件流
                }
                that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetInputBufSize(PLAYCTRLRECBUFFER);
                that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_Play(that[WNDSTATUSLIST][iWndNum].windowID);
            } else {
                let aBuffer = new Uint8Array(data.buf);  //拷贝一份数据进行使用
                let iBufferLen = that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_GetInputBufSize();
                let iYUVBufferLen = that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_GetYUVBufSize();
                if (iYUVBufferLen === 2 && !that[WNDSTATUSLIST][iWndNum].bFirstFrame) {  //渲染yuv的buffer为2才开始绘制
                    that[WNDSTATUSLIST][iWndNum].bFirstFrame = true;
                    that.EventCallback.firstFrameDisplay(iWndNum);
                }
                let iDecodeType = that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_GetDecodeFrameType();
                if (iBufferLen > PLAYCTRLRECBUFFER * 0.5 && iBufferLen < PLAYCTRLRECBUFFER * 0.8 && that[WNDSTATUSLIST][iWndNum].iRate === 1) {
                    if (iDecodeType !== DECODE_VODEO_KEYFRAME && !that[WNDSTATUSLIST][iWndNum].bFrameForward) {  //单帧允许缓冲区到达阈值
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetDecodeFrameType(DECODE_VODEO_KEYFRAME);
                    }
                    that.EventCallback.performanceLack();
                } else if (iBufferLen >= PLAYCTRLRECBUFFER * 0.8) {
                    //aBuffer = new Uint8Array([0x01, 0x02, 0x03, 0x04]);  //超出解码缓冲阈值，停止送流
                }
                if (iYUVBufferLen > 10 && iYUVBufferLen < 15 && !that[WNDSTATUSLIST][iWndNum].bFrameForward) {  //单帧允许缓冲区到达阈值
                    if (iDecodeType !== DECODE_VODEO_KEYFRAME) {
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetDecodeFrameType(DECODE_VODEO_KEYFRAME);
                    }
                    that.EventCallback.performanceLack();
                } else if (iYUVBufferLen > 15) {
                    //aBuffer = new Uint8Array([0x01, 0x02, 0x03, 0x04]);  //超出渲染缓冲阈值，停止送流
                }
                if (iYUVBufferLen < 10 && iBufferLen < PLAYCTRLRECBUFFER * 0.5 && that[WNDSTATUSLIST][iWndNum].iRate === 1) {  //正常播放才会恢复全解，否则解不过来
                    if (iDecodeType !== DECODE_ALL) {
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetDecodeFrameType(DECODE_ALL);
                    }
                }
                if (data.statusString) {
                    that.EventCallback.pluginErrorHandler(iWndNum, ERROR_STREAM_TRANS, data);
                } else if (data.type && data.type === "exception") {
                    that.EventCallback.pluginErrorHandler(iWndNum, ERROR_STREAM_PLAYBACK_END, data);
                } else if (data.type === "videoNotSupport") {
                    that.EventCallback.pluginErrorHandler(iWndNum, ERROR_VIDEO_CODING, data);
                } else {
                    that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_InputData(aBuffer, aBuffer.length);
                }
                //aBuffer = null;
            }
            if (that[WNDSTATUSLIST][iWndNum].szStorageUUID) {  //存在存储ID 则发送数据
                oStorageManager.inputData(that[WNDSTATUSLIST][iWndNum].szStorageUUID, data.buf);
            }
            data = null;
        }, function () {
            if (that[WNDSTATUSLIST][iWndNum].bPlay) {
                that.EventCallback.pluginErrorHandler(iWndNum, CONNECTION_CLOSED);
                that[WNDSTATUSLIST][iWndNum].bPlay = false;
                that[WNDSTATUSLIST][iWndNum].bFrameForward = false;
                that[WNDSTATUSLIST][iWndNum].iRate = 1;
                if (that[WNDSTATUSLIST][iWndNum].oPlayCtrl) {
                    that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_Stop();
                    that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_CloseStream();
                }
            }
        }).then(function (id) {  //websocket onopen事件触发
            that[WNDSTATUSLIST][iWndNum].szStreamUUID = id;  //保存取流ID
            oStreamClient.startPlay(id, szStartTime, szStopTime, oParams).then(function () {
                if (bPlayback) {
                    that[WNDSTATUSLIST][iWndNum].szPlayType = "playback";
                    //that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetStreamOpenMode(1);  //设置取流模式   0实时流 1文件流
                    //回放初始设置调整为正常取流速度 设置正常1倍倍率
                    that[WNDSTATUSLIST][iWndNum].iRate = 1;
                    that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_PlayRate(that[WNDSTATUSLIST][iWndNum].iRate);
                } else {
                    that[WNDSTATUSLIST][iWndNum].szPlayType = "realplay";
                    //that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetStreamOpenMode(0);  //设置取流模式   0实时流 1文件流
                }
                resolve();
            }, function (oError) {
                //预览取流失败
                reject(oError);
            });
        }, function (oError) {  //websocekt 未进入onopen
            //开启流失败
            reject(oError);
        });
    }

    //JSDecoder类
    class JSDecoder {
        constructor(options) {
            that = this;
            //默认参数对象
            let defaults = {
                szId: "playWnd",  //jsplugin插件对应的界面ID
                iType: 1,
                iWidth: 400,  //jsplugin宽
                iHeight: 300,  //jsplugin高
                iMaxSplit: 4,  //最大支持分割数
                iCurrentSplit: 2,  //当前分割数
                szBasePath: "./"  //基础路径
            };
            this[OPTIONS] = $.extend(defaults, options);  //合并参数
            let oStyle = {
                border: "#343434",
                borderSelect: "#FFCC00",
                background: "#4C4B4B"
            };
            oStyle = $.extend(oStyle, options.oStyle);  //合并样式参数
            this[OPTIONS].oStyle = oStyle;

            this.oPluginColor = {
                backgroundColor: this[OPTIONS].szBackgroundColor ? this[OPTIONS].szBackgroundColor : this[OPTIONS].oStyle.background,
                subBackgroundColor: this[OPTIONS].szSubBackgroundColor ? this[OPTIONS].szSubBackgroundColor : this[OPTIONS].oStyle.background,
                borderColor: this[OPTIONS].szBorderColor ? this[OPTIONS].szBorderColor : this[OPTIONS].oStyle.border,
                selectBorderColor: this[OPTIONS].szSelectBorderColor ? this[OPTIONS].szSelectBorderColor : this[OPTIONS].oStyle.borderSelect
            };
            if (this[OPTIONS].iCurrentSplit > this[OPTIONS].iMaxSplit) {
                this[OPTIONS].iCurrentSplit = this[OPTIONS].iMaxSplit;
            }
            this[CURRENTPLAYRATE] = 1;  //单帧之前的倍率
            this[CURRENTSOUNDWND] = -1;  //-1表示当前无窗口开启声音
            this[MAXWNDNUM] = this[OPTIONS].iMaxSplit * this[OPTIONS].iMaxSplit;  //最大窗口数目
            this[SHAPEID] = "";  //记录绘制图形的id
            this[WINDOWFULL] = false;
            this[SINGLEWINDOW] = null;
            this[FILETMP] = null;  //临时文件
            this[STATUSTMP] = "";  //临时状态
            this[UPGRADESTATUSURL] = "";  //升级状态url
            this[CURWNDINDEX] = -1;  //当前窗口索引

            this[CALLBACKFUNCTION] = null;  // 画图回调函数
            this[CALLBACKFUNCTIONS] = []; // CALLBACKFUNCTION回调的数组，区分窗格号
            this[EVENTCALLBACK] = {};  //事件回调
            this[CANFULLSCREEN] = true; // 默认可以全屏
            this[PLUGINVERSION] = "V1.2.0 build20181011";
            //初始化转封装库
            oStorageManager = new StorageManager(this[OPTIONS].szBasePath + "/transform");
            //获取jsplugin对象
            if (that[OPTIONS].szIframeId && $("#" + that[OPTIONS].szIframeId).length) { //定义了iframeId
                oJSPlugin = $("#" + that[OPTIONS].szId, $("#" + that[OPTIONS].szIframeId)[0].contentWindow.document);
            } else {
                if (typeof that[OPTIONS].szId === "string") {
                    oJSPlugin = $("#" + that[OPTIONS].szId);
                } else {
                    oJSPlugin = that[OPTIONS].szId;
                }
            }
            //窗口状态列表
            this[WNDSTATUSLIST] = [];
            for (let i = 0; i < this[MAXWNDNUM]; i++) {
                this[WNDSTATUSLIST][i] = {};
                this[WNDSTATUSLIST][i].bSelect = false;  //窗口是否被选中
                this[WNDSTATUSLIST][i].bPlay = false;  //当前窗口是否在播放状态
                this[WNDSTATUSLIST][i].bPause = false;
                this[WNDSTATUSLIST][i].bRecord = false;  //当前窗口是否在录像状态
                this[WNDSTATUSLIST][i].oPlayCtrl = null;  //当前窗口绑定的播放库对象
                this[WNDSTATUSLIST][i].szPlayType = "";  //当前窗口播放类型, realplay/playback
                this[WNDSTATUSLIST][i].szStorageUUID = "";  //对应窗口存储UUID
                this[WNDSTATUSLIST][i].szStreamUUID = "";  //对应窗口码流UUID
                this[WNDSTATUSLIST][i].aHead = [];  //当前窗口码流对应的媒体头信息
                this[WNDSTATUSLIST][i].bLoad = false;  //当前窗口js播放库是否已加载
                this[WNDSTATUSLIST][i].windowID = that[OPTIONS].szId + "canvas_play" + i;  //当前窗口对应的canvas id
                this[WNDSTATUSLIST][i].drawID = that[OPTIONS].szId + "canvas_draw" + i;  //叠加在视频上的画布id
                this[WNDSTATUSLIST][i].iRate = 1;  //当前创建播放倍率
                this[WNDSTATUSLIST][i].bEZoom = false;
                this[WNDSTATUSLIST][i].bSetDrawCallback = false;
                this[WNDSTATUSLIST][i].szSecretKey = "";  //设置秘钥
                this[WNDSTATUSLIST][i].bFrameForward = false;  //单帧
                this[WNDSTATUSLIST][i].iDecodeType = DECODE_ALL;
                this[WNDSTATUSLIST][i].bFirstFrame = false;
            }
            //监听浏览器视图是否可见
            listenBrowserVisibility();
            //创建插件窗口
            createWindows();
            //视频叠加绘制画布初始化, 需要将画图事件回调传入
            this[DRAWCANVAS] = new ESCanvas(that[OPTIONS].szId + "canvas_draw0");
            if (this[OPTIONS].iType === 0) {
                oJSPlugin.hide();
            }
            //事件初始化
            initEvent();
            that.EventCallback.windowEventSelect(0);
        }
        /**
         * @synopsis 更新窗口样式
         *
         * @param {object} oStyle 窗口样式
         *
         * @returns {none} 无
         */
        HATJS_UpdateWindowStyle(oStyle) {
            this[OPTIONS].oStyle = oStyle;
            this.oPluginColor = {
                backgroundColor: this[OPTIONS].szBackgroundColor ? this[OPTIONS].szBackgroundColor : this[OPTIONS].oStyle.background,
                subBackgroundColor: this[OPTIONS].szSubBackgroundColor ? this[OPTIONS].szSubBackgroundColor : this[OPTIONS].oStyle.background,
                borderColor: this[OPTIONS].szBorderColor ? this[OPTIONS].szBorderColor : this[OPTIONS].oStyle.border,
                selectBorderColor: this[OPTIONS].szSelectBorderColor ? this[OPTIONS].szSelectBorderColor : this[OPTIONS].oStyle.borderSelect
            };
            updateWnd();
        }
        /**
         * @synopsis 设置字符叠加信息
         *
         * @param {array} szId [IN]：id
         * @param {array} iWidth [IN]：宽
         * @param {array} iHeight [IN]：高
         *
         * @returns {object} Promise
         */
        HATJS_CreateWnd(szId, iWidth, iHeight) {
            let oPromise = new Promise(function (resolve) {
                createWindows(iWidth, iHeight);
                that[DRAWCANVAS].updateCanvas(that[OPTIONS].szId + "canvas_draw0");
                that[DRAWCANVAS].clearAllShape();
                if (iHeight === 0 || iWidth === 0) {
                    oJSPlugin.hide();
                } else {
                    oJSPlugin.show();
                }
                that.EventCallback.windowEventSelect(0);
                initEvent();
                that[FILETMP] = null;
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 显示窗口
         *
         * @returns {none} 无
         */
        HATJS_ShowWnd() {
            let oPromise = new Promise(function (resolve) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 隐藏窗口
         *
         * @returns {none} 无
         */
        HATJS_HideWnd() {
            let oPromise = new Promise(function (resolve) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 设置窗口遮挡区域
         *
         * @param {string} szPosition [IN]：覆盖位置
         * @param {number} iSize [IN]：覆盖大小
         *
         * @returns {object} Promise
         */
        HATJS_SetWndCover(/*szPosition, iSize*/) {
            let oPromise = new Promise(function (resolve) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 设置窗口控制回调
         *
         * @param {object} options [IN]：可选参数
         *
         * @returns {none} 无
         */
        HATJS_SetWindowControlCallback(options) {
            $.extend(that[EVENTCALLBACK], options);
            that[EVENTCALLBACK] && that[DRAWCANVAS].setDrawEventCallback(that[EVENTCALLBACK].onDrawEvent);
        }
        /**
         * @synopsis 改变窗口类型
         *
         * @param {number} iWndType 窗口类型
         * @param {number} aCustom [IN]：自定义分割模式
         *
         * @returns {none} 无
         */
        HATJS_ArrangeWindow(iWndType, aCustom) {
            let oPromise = new Promise(function (resolve) {
                if (iWndType < that[OPTIONS].iMaxSplit) {
                    that[OPTIONS].iCurrentSplit = iWndType;
                } else {
                    that[OPTIONS].iCurrentSplit = that[OPTIONS].iMaxSplit;
                }
                //解决firefox切换画面分割有画面残留的问题;
                if (oTool.isFirefox()) {
                    for (let i = 0; i < that[OPTIONS].iMaxSplit * that[OPTIONS].iMaxSplit; i++) {
                        if (that[WNDSTATUSLIST][i].oPlayCtrl) {
                            that[WNDSTATUSLIST][i].oPlayCtrl.PlayM4_ClearCanvas();
                        }
                    }
                }
                if (aCustom) { //如果自定义分屏
                    that[OPTIONS].aCustom = aCustom;
                } else {
                    that[OPTIONS].aCustom = [];
                }
                updateWnd(true);
                that.EventCallback.windowEventSelect(0);
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 设置解密秘钥
         *
         * @param {number} iWndNum [IN]: 窗口索引
         * @param {string} szSecretKey [IN]: 秘钥
         *
         * @returns {number} 0--成功， -1--失败
         */
        HATJS_SetSecretKey(iWndNum, szSecretKey) {
            let oPromise = new Promise(function (resolve, reject) {
                if (iWndNum < 0) {
                    reject();
                    return;
                }
                if (szSecretKey === "" || typeof szSecretKey === "undefined") {
                    reject();
                    return;
                }
                that[WNDSTATUSLIST][iWndNum].szSecretKey = szSecretKey;
                resolve();
            });
            return oPromise;
        }

        /**
         * @synopsis 设置解密秘钥
         *
         * @param {string} szSecretKey [IN]: 秘钥
         * @param {string} bEncrypted [IN]: 是否加密
         *
         * @returns {number} 0--成功， -1--失败
         */
        HATJS_SetOriginalString(/*szSecretKey, bEncrypted*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 获取秘钥
         *
         * @param {string} iKeyType [IN]: 秘钥类型
         * @param {string} szOriginalKey [IN]: 源秘钥
         * @param {string} bEncrypted [IN]: 源秘钥是否加密
         *
         * @returns {number} 0--成功， -1--失败
         */
        HATJS_GetEncryptString(/*iKeyType*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve("");
            });
            return oPromise;
        }
        /**
         * @synopsis 设置解密秘钥
         *
         * @param {number} iKeyType [IN]: 秘钥类型
         * @param {string} bEncrypted [IN]: 是否加密
         * @param {string} szSecretKey [IN]: 秘钥
         *
         * @returns {number} 0--成功， -1--失败
         */
        HATJS_GetDecryptString(/*iKeyType, bEncrypted, szSecretKey*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve("");
            });
            return oPromise;
        }
        /**
         * @synopsis 销毁插件
         * @returns {none} 无
         */
        HATJS_DestroyPlugin() {
            let oPromise = new Promise(function (resolve) {
                that[WNDSTATUSLIST].forEach(function (obj) {
                    if (obj.bPlay) {
                        obj.oPlayCtrl.PlayM4_CloseStream();
                    }
                    if (obj.oPlayCtrl) {
                        obj.oPlayCtrl.PlayM4_Destroy();
                        obj.oPlayCtrl = null;
                        obj.bLoad = false;
                    }
                });
                that[DRAWCANVAS].setShapeType("");
                resolve();
            });
            return oPromise;
        }

        /**
         * @synopsis 开启回放或预览
         *
         * @param {string} szUrl 播放地址
         * @param {object} oParams 取流参数信息
         * @param {number} iWndNum 窗口号
         * @param {string} szStartTime 回放开始时间
         * @param {string} szStopTime 回放结束时间
         *
         * @returns {none} 无
         */
        HATJS_Play(szUrl, oParams, iWndNum, szStartTime, szStopTime) {
            let oPromise = new Promise(function (resolve, reject) {
                if (iWndNum < 0 || iWndNum > (that[MAXWNDNUM] - 1)) {  //判断窗口号
                    reject();
                    return;
                }
                if (that[WNDSTATUSLIST][iWndNum].bFrameForward) {  //单帧
                    reject();
                    return;
                }
                if (that[WNDSTATUSLIST][iWndNum].bPlay) {  //后续预览回放需要考虑全面
                    that.HATJS_Stop(iWndNum);
                    //reject();
                    //return;
                }
                setTimeout(function () {
                    that[WNDSTATUSLIST][iWndNum].bFirstFrame = false;
                    that[WNDSTATUSLIST][iWndNum].iDecodeType = DECODE_ALL;
                    //判断当前窗口播放库worker是否已创建
                    if (that[WNDSTATUSLIST][iWndNum].oPlayCtrl) {
                        cbPlayCtrlCallback(szUrl, oParams, iWndNum, szStartTime, szStopTime, resolve, reject);
                    } else {
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl = new JSPlayCtrl(that[OPTIONS].szBasePath + "/playctrl/", function (oParam) {
                            if (oParam.cmd === "loaded" && !that[WNDSTATUSLIST][iWndNum].bLoad) {
                                cbPlayCtrlCallback(szUrl, oParams, iWndNum, szStartTime, szStopTime, resolve, reject);
                            } else if (oParam.cmd === "OnebyOne") {
                                if (!oParam.status) {
                                    //暂停取流
                                    if (!that[WNDSTATUSLIST][iWndNum].bPause) {
                                        oStreamClient.pause(that[WNDSTATUSLIST][iWndNum].szStreamUUID);
                                        that[WNDSTATUSLIST][iWndNum].bPause = true;
                                    }
                                } else {
                                    //恢复取流
                                    if (that[WNDSTATUSLIST][iWndNum].bPause) {
                                        oStreamClient.resume(that[WNDSTATUSLIST][iWndNum].szStreamUUID);
                                        that[WNDSTATUSLIST][iWndNum].bPause = false;
                                    }
                                }
                            } else if (oParam.cmd === "GetFrameData") {
                                that.EventCallback.pluginErrorHandler(iWndNum, ERROR_VIDEO_CODING);
                            }
                        }, iWndNum);
                    }
                }, 200);
            });
            return oPromise;
        }
        /**
         * @synopsis 倒放
         *
         * @param {string} szUrl [IN]：播放Url
         * @param {string} oParams [IN]：播放参数
         * @param {number} iWndNum [IN]：窗口索引
         * @param {string} szStartTime [IN]：开始时间
         * @param {string} szStopTime [IN]：结束时间
         *
         * @returns {object} Promise
         */
        HATJS_ReversePlay(/*szUrl, oParams, iWndNum, szStartTime, szStopTime*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 设置转码参数
         *
         * @param {string} iWndNum [IN]：窗口索引
         * @param {string} szXml [IN]：转码参数
         *
         * @returns {object} Promise
         */
        HATJS_SetTrsPlayBackParam(/*iWndNum, szXml*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 停止播放或预览
         *
         * @param {number} iWndNum 窗口号
         *
         * @returns {none} 无
         */
        HATJS_Stop(iWndNum) {
            let oPromise = new Promise(function (resolve, reject) {
                if (iWndNum < 0 || iWndNum > (that[MAXWNDNUM] - 1)) {  //判断窗口号
                    reject();
                    return;
                }
                if (that[WNDSTATUSLIST][iWndNum].szStorageUUID) {  //正在录像，先关闭录像进行下载
                    that.HATJS_StopSave(iWndNum);
                }
                if (that[WNDSTATUSLIST][iWndNum].bEZoom) {
                    that.HATJS_DisableZoom(iWndNum);
                }
                if (that[CURRENTSOUNDWND] === iWndNum) {
                    that[CURRENTSOUNDWND] = -1;
                }
                oStreamClient.stop(that[WNDSTATUSLIST][iWndNum].szStreamUUID).then(function () {
                    that[WNDSTATUSLIST][iWndNum].bPlay = false;
                    that[WNDSTATUSLIST][iWndNum].bFrameForward = false;
                    that[WNDSTATUSLIST][iWndNum].iRate = 1;
                    if (that[WNDSTATUSLIST][iWndNum].oPlayCtrl) {
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_Stop();
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_CloseStream();
                    }
                    setTimeout(function () {
                        resolve();
                    }, 500);
                }, function () {
                    setTimeout(function () {
                        reject();
                    }, 500);
                });
            });
            return oPromise;
        }
        /**
         * @synopsis 定位回放
         *
         * @param {number} iWndNum 窗口号
         * @param {string} szStartTime 定位开始时间
         * @param {string} szStopTime 定位结束时间
         *
         * @returns {none} 无
         */
        HATJS_Seek(iWndNum, szStartTime, szStopTime) {
            let oPromise = new Promise(function (resolve, reject) {
                if (iWndNum < 0 || iWndNum > (that[MAXWNDNUM] - 1)) {  //判断窗口号
                    reject();
                    return;
                }
                if (!that[WNDSTATUSLIST][iWndNum].bPlay) {  //后续预览回放需要考虑全面
                    reject();
                    return;
                }
                oStreamClient.seek(that[WNDSTATUSLIST][iWndNum].szStreamUUID, szStartTime, szStopTime).then(function () {
                    resolve();
                }, function (oError) {
                    reject(oError);
                });
            });
            return oPromise;
        }
        /**
         * @synopsis 关闭所有预览
         *
         * @param {number} iWndNum 窗口号
         *
         * @returns {none} 无
         */
        HATJS_StopRealPlayAll() {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                //停止所有取流
                oStreamClient.stopAll();
                that[WNDSTATUSLIST].forEach(function (obj, index) {
                    if (obj.bPlay) {
                        if (obj.szStorageUUID) {  //正在录像，先关闭录像进行下载
                            that.HATJS_StopSave(index);
                        }
                        if (obj.bEZoom) {
                            that.HATJS_DisableZoom(index);
                        }
                        obj.oPlayCtrl.PlayM4_Stop();
                        obj.oPlayCtrl.PlayM4_CloseStream();
                    }
                    obj.bPlay = false;
                });
                that[CURRENTSOUNDWND] = -1;
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 暂停
         *
         * @param {number} iWndNum 窗口号
         *
         * @returns {none} 无
         */
        HATJS_Pause(iWndNum) {
            let oPromise = new Promise(function (resolve, reject) {
                if (iWndNum < 0 || iWndNum > (that[MAXWNDNUM] - 1)) {  //判断窗口号
                    reject();
                    return;
                }
                if (!that[WNDSTATUSLIST][iWndNum].bPlay) {  //后续预览回放需要考虑全面
                    reject();
                    return;
                }
                if (that[WNDSTATUSLIST][iWndNum].bFrameForward) {  //单帧时不能暂停
                    reject();
                    return;
                }
                //暂停取流
                oStreamClient.pause(that[WNDSTATUSLIST][iWndNum].szStreamUUID).then(function () {
                    that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_Pause(true);
                    that[WNDSTATUSLIST][iWndNum].bPause = true;
                    resolve();
                }, function (oError) {
                    reject(oError);
                });
            });
            return oPromise;
        }

        /**
         * @synopsis 恢复
         *
         * @param {number} iWndNum 窗口号
         *
         * @returns {none} 无
         */
        HATJS_Resume(iWndNum) {
            let oPromise = new Promise(function (resolve, reject) {
                if (iWndNum < 0 || iWndNum > (that[MAXWNDNUM] - 1)) {  //判断窗口号
                    reject();
                    return;
                }
                if (!that[WNDSTATUSLIST][iWndNum].bPlay) {  //后续预览回放需要考虑全面
                    reject();
                    return;
                }
                //恢复取流
                oStreamClient.resume(that[WNDSTATUSLIST][iWndNum].szStreamUUID).then(function () {
                    if (that[CURRENTPLAYRATE] !== 1) {
                        that[WNDSTATUSLIST][iWndNum].iRate = that[CURRENTPLAYRATE];
                        oStreamClient.setPlayRate(that[WNDSTATUSLIST][iWndNum].szStreamUUID, that[WNDSTATUSLIST][iWndNum].iRate);
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_PlayRate(that[WNDSTATUSLIST][iWndNum].iRate);
                        if (that[CURRENTPLAYRATE] > 1) {
                            that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetDecodeFrameType(DECODE_VODEO_KEYFRAME);
                        } else {
                            that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetDecodeFrameType(DECODE_ALL);
                        }
                    }
                    if (that[WNDSTATUSLIST][iWndNum].bFrameForward) {
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_Play(that[WNDSTATUSLIST][iWndNum].windowID);
                        that[WNDSTATUSLIST][iWndNum].bFrameForward = false;
                    } else {
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_Pause(false);  //TODO 添加标识参数
                    }
                    that[WNDSTATUSLIST][iWndNum].bPause = false;
                    resolve();
                }, function (oError) {
                    reject(oError);
                });
            });
            return oPromise;
        }

        /**
         * @synopsis 慢放
         *
         * @param {number} iWndNum 窗口号
         *
         * @returns {none} 无
         */
        HATJS_Slow(iWndNum) {
            let oPromise = new Promise(function (resolve, reject) {
                if (iWndNum < 0 || iWndNum > (that[MAXWNDNUM] - 1)) {  //判断窗口号
                    reject();
                    return;
                }
                if (!that[WNDSTATUSLIST][iWndNum].bPlay) {  //后续预览回放需要考虑全面
                    reject();
                    return;
                }
                if (that[WNDSTATUSLIST][iWndNum].szPlayType !== "playback") {
                    reject();
                    return;
                }
                if (that[WNDSTATUSLIST][iWndNum].iRate === -8) {
                    reject();
                    return;
                }
                if (that[WNDSTATUSLIST][iWndNum].bFrameForward) {  //单帧
                    reject();
                    return;
                }
                if (that[WNDSTATUSLIST][iWndNum].iRate < 0 && that[WNDSTATUSLIST][iWndNum].iRate > -8) {
                    that[WNDSTATUSLIST][iWndNum].iRate *= 2;
                }
                if (that[WNDSTATUSLIST][iWndNum].iRate === 1) {
                    that[WNDSTATUSLIST][iWndNum].iRate *= -2;
                }
                if (that[WNDSTATUSLIST][iWndNum].iRate > 1) {
                    that[WNDSTATUSLIST][iWndNum].iRate /= 2;
                }
                oStreamClient.setPlayRate(that[WNDSTATUSLIST][iWndNum].szStreamUUID, that[WNDSTATUSLIST][iWndNum].iRate).then(function () {
                    if (that[WNDSTATUSLIST][iWndNum].iRate < 2) {  //判断倍速  如果小于0全解  大于0只解I帧
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetDecodeFrameType(DECODE_ALL);
                    } else {
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetDecodeFrameType(DECODE_VODEO_KEYFRAME);
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetIFrameDecInterval(0);
                    }
                    that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_PlayRate(that[WNDSTATUSLIST][iWndNum].iRate);
                    resolve();
                }, function (oError) {
                    reject(oError);
                });
            });
            return oPromise;
        }

        /**
         * @synopsis 快放
         *
         * @param {number} iWndNum 窗口号
         *
         * @returns {none} 无
         */
        HATJS_Fast(iWndNum) {
            let oPromise = new Promise(function (resolve, reject) {
                if (iWndNum < 0 || iWndNum > (that[MAXWNDNUM] - 1)) {  //判断窗口号
                    reject();
                    return;
                }
                if (!that[WNDSTATUSLIST][iWndNum].bPlay) {  //后续预览回放需要考虑全面
                    reject();
                    return;
                }
                if (that[WNDSTATUSLIST][iWndNum].szPlayType !== "playback") {
                    reject();
                    return;
                }
                if (that[WNDSTATUSLIST][iWndNum].bFrameForward) {  //单帧
                    reject();
                    return;
                }
                if (that[WNDSTATUSLIST][iWndNum].iRate === 8) {
                    reject();
                    return;
                }
                if (that[WNDSTATUSLIST][iWndNum].iRate === -2) {
                    that[WNDSTATUSLIST][iWndNum].iRate = 1;
                } else if (that[WNDSTATUSLIST][iWndNum].iRate < -2) {
                    that[WNDSTATUSLIST][iWndNum].iRate /= 2;
                } else if (that[WNDSTATUSLIST][iWndNum].iRate > 0 && that[WNDSTATUSLIST][iWndNum].iRate < 8) {
                    that[WNDSTATUSLIST][iWndNum].iRate *= 2;
                }
                oStreamClient.setPlayRate(that[WNDSTATUSLIST][iWndNum].szStreamUUID, that[WNDSTATUSLIST][iWndNum].iRate).then(function () {
                    if (that[WNDSTATUSLIST][iWndNum].iRate < 2) {  //判断倍速  如果小于2全解  大于等于2只解I帧
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetDecodeFrameType(DECODE_ALL);
                    } else {
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetDecodeFrameType(DECODE_VODEO_KEYFRAME);
                        if (that[WNDSTATUSLIST][iWndNum].iRate === 8) {
                            that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetIFrameDecInterval(2);
                        } else {
                            that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetIFrameDecInterval(0);
                        }
                    }
                    that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_PlayRate(that[WNDSTATUSLIST][iWndNum].iRate);
                    resolve();
                }, function (oError) {
                    reject(oError);
                });
            });
            return oPromise;
        }
        /**
         * @synopsis 透传
         *
         * @param {number} iWndNum 窗口号
         * @param {string} szCmd 透传的命令码
         *
         * @returns {none} 无
         */
        HATJS_Transmission(iWndNum, szCmd) {
            let oPromise = new Promise(function (resolve, reject) {
                if (iWndNum < 0 || iWndNum > (that[MAXWNDNUM] - 1)) {  //判断窗口号
                    reject();
                    return;
                }
                if (!that[WNDSTATUSLIST][iWndNum].szStreamUUID) {
                    reject();
                    return;
                }
                //暂停取流
                oStreamClient.transmission(that[WNDSTATUSLIST][iWndNum].szStreamUUID, szCmd).then(function (oResponse) {
                    resolve(oResponse);
                }, function (oError) {
                    reject(oError);
                });
            });
            return oPromise;
        }

        /**
         * @synopsis 单帧播放
         *
         * @param {number} iWndNum 窗口号
         *
         * @returns {none} 无
         */
        HATJS_FrameForward(iWndNum) {
            let oPromise = new Promise(function (resolve, reject) {
                if (iWndNum < 0 || iWndNum > (that[MAXWNDNUM] - 1)) {  //判断窗口号
                    reject();
                    return;
                }
                if (!that[WNDSTATUSLIST][iWndNum].bPlay) {  //后续预览回放需要考虑全面
                    reject();
                    return;
                }
                if (that[WNDSTATUSLIST][iWndNum].iRate !== 1) {
                    that[WNDSTATUSLIST][iWndNum].iRate = 1;
                    that[CURRENTPLAYRATE] = that[WNDSTATUSLIST][iWndNum].iRate;
                    oStreamClient.setPlayRate(that[WNDSTATUSLIST][iWndNum].szStreamUUID, that[WNDSTATUSLIST][iWndNum].iRate).then(function () {
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_PlayRate(that[WNDSTATUSLIST][iWndNum].iRate);
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetDecodeFrameType(DECODE_ALL);
                        that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_OneByOne();
                        that[WNDSTATUSLIST][iWndNum].bFrameForward = true;
                    }, function (oError) {
                        reject(oError);
                    });
                } else {
                    that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_PlayRate(that[WNDSTATUSLIST][iWndNum].iRate);
                    that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetDecodeFrameType(DECODE_ALL);
                    that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_OneByOne();
                    that[WNDSTATUSLIST][iWndNum].bFrameForward = true;
                }
                resolve();
            });
            return oPromise;
        }

        /**
         * @synopsis 获取osd时间
         *
         * @param {number} iWndNum 窗口号
         *
         * @returns {none} 无
         */
        HATJS_GetOSDTime(iWndNum) {
            let oPromise = new Promise(function (resolve, reject) {
                if (iWndNum < 0 || iWndNum > (that[MAXWNDNUM] - 1)) {  //判断窗口号
                    reject();
                    return;
                }
                if (!that[WNDSTATUSLIST][iWndNum].bPlay) {  //后续预览回放需要考虑全面
                    reject();
                    return;
                }
                let iRet = that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_GetOSDTime(function (szTime) {
                    // 做下兼容，safari下需要用“/”分隔
                    let szSplit = (oTool.isSafari() || oTool.isEdge()) ? "/" : " ";
                    let iTime = Date.parse(szTime.replace(/-/g, szSplit)) / 1000;
                    resolve(iTime);
                });
                if (iRet !== 1) {
                    reject();
                    return;
                }
            });
            return oPromise;
        }

        /**
         * @synopsis 开启声音
         *
         * @param {number} iWndNum 窗口号
         *
         * @returns {none} 无
         */
        HATJS_OpenSound(iWndNum) {
            let oPromise = new Promise(function (resolve, reject) {
                if (iWndNum < 0 || iWndNum > (that[MAXWNDNUM] - 1)) {  //判断窗口号
                    reject();
                    return;
                }
                if (!that[WNDSTATUSLIST][iWndNum].bPlay) {  //后续预览回放需要考虑全面
                    reject();
                    return;
                }
                if (that[CURRENTSOUNDWND] === iWndNum) {  //点击的窗口已开启声音  无效操作
                    reject();
                    return;
                }
                if (that[CURRENTSOUNDWND] !== -1) {
                    that[WNDSTATUSLIST][that[CURRENTSOUNDWND]].oPlayCtrl.PlayM4_StopSound();//先关闭原先开启的声音
                }
                if (that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_PlaySound(iWndNum) !== 1) {
                    reject();
                    return;
                }
                that[CURRENTSOUNDWND] = iWndNum;
                resolve();
            });
            return oPromise;
        }

        /**
         * @synopsis 关闭声音
         *
         * @param {number} iWndNum 窗口号
         *
         * @returns {none} 无
         */
        HATJS_CloseSound() {
            let oPromise = new Promise(function (resolve, reject) {
                let iWndNum = that[CURRENTSOUNDWND];
                if (iWndNum < 0 || iWndNum > (that[MAXWNDNUM] - 1)) {  //判断窗口号
                    reject();
                    return;
                }
                if (!that[WNDSTATUSLIST][iWndNum].bPlay) {  //后续预览回放需要考虑全面
                    reject();
                    return;
                }
                if (that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_StopSound() !== 1) {
                    reject();
                    return;
                }
                that[CURRENTSOUNDWND] = -1;
                resolve();
            });
            return oPromise;
        }

        /**
         * @synopsis 获取音量
         *
         * @param {number} iWndNum 窗口号
         *
         * @returns {none} 无
         */
        HATJS_GetVolume(iWndNum) {
            let oPromise = new Promise(function (resolve) {
                that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_GetVolume(function (iVolume) {
                    resolve(iVolume);
                });
            });
            return oPromise;
        }

        /**
         * @synopsis 设置音量
         *
         * @param {number} iWndNum 窗口号
         * @param {number} iVolume 需要设置的音量
         *
         * @returns {none} 无
         */
        HATJS_SetVolume(iWndNum, iVolume) {
            let oPromise = new Promise(function (resolve, reject) {
                if (that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetVolume(iVolume) !== 1) {
                    reject();
                    return;
                }
                resolve();
            });
            return oPromise;
        }

        /**
         * @synopsis 打开电子放大
         *
         * @param {number} iWndNum 窗口号
         * @param {number} iType [IN]：放大类型
         *
         * @returns {none} 无
         */
        HATJS_EnableZoom(iWndNum/*, iType*/) {
            let oPromise = new Promise(function (resolve, reject) {
                if (iWndNum < 0 || iWndNum > (that[MAXWNDNUM] - 1)) {  //判断窗口号
                    reject();
                    return;
                }
                if (!that[WNDSTATUSLIST][iWndNum].bPlay) {  //后续预览回放需要考虑全面
                    reject();
                    return;
                }
                $(".draw-window").unbind();
                that[DRAWCANVAS] = new ESCanvas(that[OPTIONS].szId + "canvas_draw" + iWndNum);
                that[DRAWCANVAS].setShapeType("Rect");
                that[DRAWCANVAS].setDrawStyle("#ff0000", "", 0);
                that[DRAWCANVAS].setDrawStatus(true, function (oRECT) {
                    if (oRECT.startPos && oRECT.endPos) {
                        if (oRECT.startPos[0] > oRECT.endPos[0]) {
                            that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetDisplayRegion(null, false);
                        } else {
                            that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetDisplayRegion({
                                left: oRECT.startPos[0],
                                top: oRECT.startPos[1],
                                right: oRECT.endPos[0],
                                bottom: oRECT.endPos[1]
                            }, true);
                        }
                    }
                });
                that[WNDSTATUSLIST][iWndNum].bEZoom = true;
                resolve();
            });
            return oPromise;
        }

        /**
         * @synopsis 关闭电子放大
         *
         * @param {number} iWndNum 窗口号
         *
         * @returns {none} 无
         */
        HATJS_DisableZoom(iWndNum) {
            let oPromise = new Promise(function (resolve, reject) {
                if (iWndNum < 0 || iWndNum > (that[MAXWNDNUM] - 1)) {  //判断窗口号
                    reject();
                    return;
                }
                if (!that[WNDSTATUSLIST][iWndNum].bPlay) {  //后续预览回放需要考虑全面
                    reject();
                    return;
                }
                that[DRAWCANVAS].setDrawStatus(false);
                if (that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_SetDisplayRegion(null, false) !== 1) {
                    reject();
                    return;
                }
                that[WNDSTATUSLIST][iWndNum].bEZoom = false;
                // 开启电子放大时，画布重建，DRAWCANVAS对象上的事件事件清除了，需要重新绑定
                that[EVENTCALLBACK] && that[EVENTCALLBACK].onDrawEvent && that[DRAWCANVAS].setDrawEventCallback(that[EVENTCALLBACK].onDrawEvent);
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 抓图
         *
         * @param {number} iWndNum 窗口号
         * @param {string} szName 抓图类型
         * @param {string} szType 文件名称
         *
         * @returns {none} 无
         */
        HATJS_CapturePicture(iWndNum, szName, szType) {
            let oPromise = new Promise(function (resolve, reject) {
                if (iWndNum < 0 || iWndNum > (that[MAXWNDNUM] - 1)) {  //判断窗口号
                    reject();
                    return;
                }
                if (!that[WNDSTATUSLIST][iWndNum].bPlay) {  //后续预览回放需要考虑全面
                    reject();
                    return;
                }
                if (!szType) {
                    szType = "JPEG";
                }
                if (szType === "BMP") {
                    let iError = that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_GetBMP(function (aData) {
                        if (aData === 6) {
                            reject(ERROR_CAPTURE_MEMORY);
                        } else {
                            oTool.downloadFile(aData, szName + ".BMP");
                            resolve();
                        }
                    });
                    if (iError !== 1) {
                        reject(ERROR_CAPTURE_MEMORY);
                    }
                } else if (szType === "JPEG") {
                    let iError = that[WNDSTATUSLIST][iWndNum].oPlayCtrl.PlayM4_GetJPEG(function (aData) {
                        if (aData === 6) {
                            reject(ERROR_CAPTURE_MEMORY);
                        } else {
                            oTool.downloadFile(aData, szName + ".jpeg");
                            resolve();
                        }
                    });
                    if (iError !== 1) {
                        reject(ERROR_CAPTURE_MEMORY);
                    }
                }
            });
            return oPromise;
        }

        /**
         * @synopsis 开始录像
         *
         * @param {number} iWndNum 窗口号
         * @param {string} szFileName 文件名
         *
         * @returns {none} 无
         */
        HATJS_StartSave(iWndNum, szFileName) {
            let oPromise = new Promise(function (resolve, reject) {
                if (iWndNum < 0 || iWndNum > (that[MAXWNDNUM] - 1)) {  //判断窗口号
                    reject();
                    return;
                }
                if (!that[WNDSTATUSLIST][iWndNum].bPlay) {  //后续预览回放需要考虑全面
                    reject();
                    return;
                }
                if (szFileName.indexOf(".mp4") < 0) {
                    szFileName = szFileName + ".mp4";
                }
                let aData = that[WNDSTATUSLIST][iWndNum].aHead;
                let iType = 0;
                if (that[WNDSTATUSLIST][iWndNum].szPlayType === "playback") {
                    iType = 1;
                }
                oStorageManager.startRecord(szFileName, aData, 2, iType, {
                    cbEventHandler: function (iErrorType) {
                        that.EventCallback.pluginErrorHandler(iWndNum, iErrorType);
                    }
                }).then(function (szUUID) {
                    that[WNDSTATUSLIST][iWndNum].szStorageUUID = szUUID;
                    resolve();
                }, function () {
                    reject();
                });
            });
            return oPromise;
        }

        /**
         * @synopsis 停止录像
         *
         * @param {number} iWndNum 窗口号
         *
         * @returns {none} 无
         */
        HATJS_StopSave(iWndNum) {
            let oPromise = new Promise(function (resolve, reject) {
                if (!that[WNDSTATUSLIST][iWndNum].szStorageUUID) {  //存在存储ID 则发送数据
                    reject();
                    return;
                }
                oStorageManager.stopRecord(that[WNDSTATUSLIST][iWndNum].szStorageUUID).then(function () {
                    that[WNDSTATUSLIST][iWndNum].szStorageUUID = "";  //关闭录像  删除存储ID
                    resolve();
                }, function (iError) {
                    reject(iError);
                });
            });
            return oPromise;
        }
        /**
         * @synopsis 开始对讲
         *
         * @param {number} szOpenUrl [IN]：打开对讲url
         * @param {number} szCloseUrl [IN]：关闭对讲url
         * @param {number} szDataUrl [IN]：数据url
         * @param {number} szAuth [IN]：认证信息
         * @param {number} iAudioType [IN]：音频类型
         * @param {number} iBitRate [IN]：比特率
         * @param {number} iSampleRate [IN]：采样率
         * @param {number} iSoundChannel [IN]：对讲通道
         * @param {number} iDeviceCastChannelNum [IN]：设备对讲通道数
         *
         * @returns {object} Promise
         */
        HATJS_StartTalk(/*szOpenUrl, szCloseUrl, szDataUrl, szAuth, iAudioType, iBitRate, iSampleRate, iSoundChannel, iDeviceCastChannelNum*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve();
            });
            return oPromise;
        }

        /**
         * @synopsis 停止对讲
         *
         * @returns {object} Promise
         */
        HATJS_StopTalk() {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 设置预览类型
         *
         * @param {number} iMode [IN]：预览类型
         *
         * @returns {object} Promise
         */
        HATJS_SetPlayMode(/*iMode*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 设置窗口是否支持双击全屏
         *
         * @param {number} iMode [IN]：是否支持双击全屏的模式
         *
         * @returns {object} Promise
         */
        HATJS_SetFullScreenCapability(iMode) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                that[CANFULLSCREEN] = !!iMode;
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 全屏
         *
         * @param {bool} bFullScreen 是否全屏
         *
         * @returns {object} Promise
         */
        HATJS_FullScreenDisplay(bFullScreen) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                if (bFullScreen) {
                    //that[WINDOWFULL] = bFullScreen;
                    let element = oJSPlugin.get(0);
                    if (element.requestFullScreen) {
                        element.requestFullScreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    }
                }
                that[WINDOWFULL] = bFullScreen;
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 单窗口全屏
         *
         * @param {int} iWnd 窗口索引
         *
         * @returns {object} Promise
         */
        HATJS_FullScreenSingle(iWnd) {
            if (!that[WNDSTATUSLIST][iWnd].bPlay) {
                return;
            }
            let bFullscreen = document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || false;
            let element = oJSPlugin.find(".parent-wnd").eq(0).children().eq(iWnd).get(0);
            if (!bFullscreen) {
                if (element.requestFullScreen) {
                    element.requestFullScreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                }
                that[SINGLEWINDOW] = oJSPlugin.find(".parent-wnd").eq(0).children().eq(iWnd);
            } else {
                if (oJSPlugin.find(".parent-wnd").eq(0).width() === $(window).width()) {  //插件全屏时单窗口全屏无效
                    return;
                }
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
                that[SINGLEWINDOW] = null;
                that[WINDOWFULL] = false;
            }
        }
        /**
         * @synopsis 启用规则信息
         *
         * @param {bool} iWndNum 窗口索引
         * @param {bool} iType 类型
         * @param {bool} bEnabled 是否启用
         *
         * @returns {object} Promise
         */
        HATJS_EnableIVS(/*iWndNum, iType, bEnabled*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 设置鹰眼参数
         *
         * @param {number} iWndNum [IN]：窗口索引
         * @param {number} iType [IN]：形状
         *
         * @returns {object} Promise
         */
        HATJS_SRInit(/*iWndNum, iType*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 3.3.52	设置鹰眼PTZ
         *
         * @param {bool} iWndNum 窗口索引
         * @param {bool} iDirection 方向, 0向上，1向下，2向左，3向右，4Zoomin,5 Zoomout
         * @param {bool} iStep 是否启用
         *
         * @returns {object} Promise
         */
        HATJS_SRPTZ(/*iWndNum, iDirection, iStep*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 设置回放窗口绘图模式
         *
         * @param {bool} iWndNum 窗口索引
         * @param {number} iType [IN]：回放模式
         *
         * @returns {object} Promise
         */
        HATJS_SetPlaybackDrawType(/*iWndNum, iType*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 获取本地配置
         *
         * @returns {none} 无
         */
        HATJS_GetLocalConfig() {
            let oLocalConfig = {
                protocolType: 0,
                streamType: 0,
                packgeSize: 1,
                playWndType: 0,
                buffNumberType: 2,
                recordPath: "",
                capturePath: "",
                playbackFilePath: "",
                playbackPicPath: "",
                downloadPath: "",
                snapScenePicPath: "",
                snapViewPicPath: "",
                ivsMode: -1,
                realPlayAll: 0,
                captureFileFormat: 0,
                osdPosInfo: 0,
                osdPicInfo: 1,
                showWizard: 1,
                secretKey: "",
                showFireBox: 0,
                showFireDistance: 0,
                showFireMaxTemperature: 0,
                showFireMaxTemperaturePos: 0,
                showTemperaturePoint: 0,
                showTemperatureLine: 0,
                showTemperatureBox: 0,
                captureIncludeTemperatureInfo: 0
            };
            let oPromise = new Promise(function (resolve) {
                resolve(oLocalConfig);
            });
            return oPromise;
        }
        /**
         * @synopsis 获取本地配置
         *
         * @param {object} oLocalConfig 配置参数对象
         *
         * @returns {none} 无
         */
        HATJS_SetLocalConfig(/*oLocalConfig*/) {
            let oPromise = new Promise(function (resolve) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 获取最近一次错误
         *
         * @returns {object} Promise
         */
        HATJS_GetLastError() {
            let iRet = 0;
            let oPromise = new Promise(function (resolve, reject) {
                if (iRet < 0) {
                    reject();
                } else {
                    resolve(iRet);
                }
            });
            return oPromise;
        }
        /**
         * @synopsis 打开文件选择框
         *
         * @param {object} iSelectMode 文件选择模式
         * @param {object} szFileType 文件类型
         *
         * @returns {none} 无
         */
        HATJS_OpenFileBrowser(iSelectMode, szFileType) {
            let oPromise = new Promise(function (resolve) {
                that[FILETMP] = null;
                let input = window.document.createElement('input');
                input.type = "file";
                if (szFileType.toLowerCase() === "bmp") {
                    input.accept = "image/bmp";
                }
                if (iSelectMode === 0) {
                    input.setAttribute("webkitdirectory", "");
                }
                input.addEventListener('change', function () {
                    let szFileName = "";
                    if (iSelectMode === 1) {
                        that[FILETMP] = input.files[0];
                        szFileName = input.files[0].name;
                    } else if (iSelectMode === 0) {
                        that[FILETMP] = input.files;
                    }
                    resolve(szFileName);
                });
                let click = document.createEvent("MouseEvents");
                click.initEvent("click", true, true);
                input.dispatchEvent(click);
            });
            return oPromise;
        }
        /**
         * @synopsis 打开目录
         *
         * @param {number} szDir [IN]：目录
         *
         * @returns {object} Promise
         */
        HATJS_OpenDirectory(/*szDir*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 打开目录
         *
         * @param {string} szUploadUrl [IN]：上传url
         * @param {number} szStatusUrl [IN]：状态url
         * @param {number} szAuth [IN]：认证信息
         * @param {number} szFilePath [IN]：文件路径
         * @param {bool} bNeedToken [IN]：url是否需要带上token参数，session3.0版本发送的请求需要有sessionTag或者token
         *
         * @returns {object} Promise
         */
        HATJS_StartAsynUpload(szUploadUrl, szStatusUrl, szAuth, szFilePath, bNeedToken) {
            let oPromise = new Promise(function (resolve, reject) {
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            that[STATUSTMP] = xhr.responseText;
                            resolve();
                        } else {
                            // let subState = oTool.getStatusCode(xhr);
                            reject(xhr);
                        }
                    }
                };
                if (bNeedToken) {
                    if (szUploadUrl.indexOf("?") >= 0) {
                        szUploadUrl += "&token=" + szAuth;
                    } else {
                        szUploadUrl += "?token=" + szAuth;
                    }
                }
                xhr.open('put', szUploadUrl, true);
                xhr.send(that[FILETMP]);
            });
            return oPromise;
        }
        /**
         * @synopsis 停止异步上传
         *
         * @returns {object} Promise
         */
        HATJS_StopAsynUpload() {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                //that[FILETMP] = null;  //解决密码错误导入上传失败问题
                that[STATUSTMP] = "";
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 文件同步上传
         *
         * @param {string} szUploadUrl [IN]：上传url
         * @param {number} szAuth [IN]：认证信息
         * @param {number} szFilePath [IN]：文件路径
         * @param {string} szContentType [IN]：content-type
         * @param {bool} bNeedToken [IN]：url是否需要带上token参数，session3.0版本发送的请求需要有sessionTag或者token
         * @returns {object} Promise
         */
        HATJS_UploadFile(szUploadUrl, szAuth, szFilePath, szContentType, bNeedToken) {
            let oPromise = new Promise(function (resolve, reject) {
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status !== 200) {
                            // reject(oTool.parseXmlFromStr(xhr.responseText));
                            //增加错误回调
                            reject({
                                readyState: 4,
                                status: xhr.status,
                                responseXML: (xhr.responseText ? oTool.parseXmlFromStr(xhr.responseText) : null),
                                errorInfo: xhr.responseText
                            });
                        } else {
                            resolve();
                        }
                    }
                };
                if (bNeedToken) {
                    if (szUploadUrl.indexOf("?") >= 0) {
                        szUploadUrl += "&token=" + szAuth;
                    } else {
                        szUploadUrl += "?token=" + szAuth;
                    }
                }
                xhr.open('put', szUploadUrl, false);
                if (szContentType) { //修改，上传传了Content-Type以上层为主
                    xhr.setRequestHeader("Content-Type", szContentType);
                } else {
                    xhr.setRequestHeader("Content-Type", "oct/stream");
                }
                xhr.send(that[FILETMP]);
            });
            return oPromise;
        }
        /**
         * @synopsis 获取文件同步上传错误信息
         *
         * @returns {object} Promise
         */
        HATJS_GetUploadErrorInfo() {
            let oPromise = new Promise(function (resolve, reject) {
                if (typeof that[STATUSTMP] === "string" && that[STATUSTMP].length > 0) {
                    resolve(that[STATUSTMP]);
                } else {
                    reject();
                }
            });
            return oPromise;
        }
        /**
         * @synopsis 文件同步下载
         *
         * @param {number} szDownloadUrl [IN]：上传url
         * @param {number} szAuth [IN]：认证信息
         * @param {number} szXmlContent [IN]：带给设备的xml信息
         * @param {number} iMethod [IN]：http方法
         * @param {number} iDecode [IN]：是否加密
         *
         * @returns {object} Promise
         */
        HATJS_DownloadFile(szDownloadUrl/*, szAuth, szXmlContent, iMethod, iDecode*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                $("body").append('<a id="jsplugin_download_a" href="' + szDownloadUrl + '"><li id="jsplugin_download_li"></li></a>');
                $("#jsplugin_download_li").trigger("click");
                $("#jsplugin_download_a").remove();
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 文件同步下载
         *
         * @param {number} szDownloadUrl [IN]：上传url
         * @param {number} szAuth [IN]：认证信息
         * @param {number} szXmlContent [IN]：带给设备的xml信息
         * @param {number} iMethod [IN]：http方法
         * @param {number} iDecode [IN]：是否加密
         *
         * @returns {object} Promise
         */
        HATJS_DownloadFileNoPlugin(szDownloadUrl/*, szAuth, szXmlContent, iMethod, iDecode*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                $("body").append('<a id="jsplugin_download_a" href="' + szDownloadUrl + '"><li id="jsplugin_download_li"></li></a>');
                $("#jsplugin_download_li").trigger("click");
                $("#jsplugin_download_a").remove();
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 开始升级
         *
         * @param {string} szUpgradeUrl [IN]：上传url
         * @param {number} szStatusUrl [IN]：认证信息
         * @param {number} szAuth [IN]：文件路径
         * @param {number} szFilepath [IN]：认证信息
         * @param {number} szUpgradeFlag [IN]：升级标志
         * @param {bool} bNeedToken [IN]：url是否需要带上token参数，session3.0版本发送的请求需要有sessionTag或者token
         *
         * @returns {object} Promise
         */
        HATJS_StartUpgrade(szUpgradeUrl, szStatusUrl, szAuth, szFilepath, szUpgradeFlag, bNeedToken) {
            let oPromise = new Promise(function (resolve, reject) {
                if (!szUpgradeUrl) {
                    reject();
                    return;
                }
                //if (!szStatusUrl) {
                //    reject();
                //    return;
                //}
                that[STATUSTMP] = 0;
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            that[STATUSTMP] = 100;
                            resolve();
                        } else {
                            that[STATUSTMP] = 1;
                            let oXmlDoc = oTool.parseXmlFromStr(xhr.responseText);
                            if ($(oXmlDoc).find("subStatusCode").text() === "lowPrivilege") {
                                reject(403);
                            } else if (($(oXmlDoc).find("MErrDevSelfEx").length > 0) || ($(oXmlDoc).find("MErrCode").length > 0)) {
                                var iMErrDevSelfEx = parseInt($(oXmlDoc).find("MErrDevSelfEx").text(), 10);
                                var iMErrCode = parseInt($(oXmlDoc).find("MErrCode").text(), 10);
                                //console.log("MErrDevSelfEx " + $(oXmlDoc).find("MErrDevSelfEx").text());
                                //console.log("MErrCode " + $(oXmlDoc).find("MErrCode").text());
                                if (iMErrDevSelfEx > 0) {
                                    reject(iMErrDevSelfEx); // iMErrDevSelfEx转后是十进制
                                } else if (iMErrCode > 0) {
                                    reject(iMErrCode);  // iMErrCode转后是十进制
                                } else {
                                    reject();
                                }
                            } else {
                                reject();
                            }
                        }
                    }
                };
                if (bNeedToken) {
                    if (szUpgradeUrl.indexOf("?") >= 0) {
                        szUpgradeUrl += "&token=" + szAuth;
                    } else {
                        szUpgradeUrl += "?token=" + szAuth;
                    }
                }
                xhr.open('put', szUpgradeUrl, true);
                xhr.send(that[FILETMP]);
                that[UPGRADESTATUSURL] = szStatusUrl;
                // 去除3s后reslove的处理, 上层在HATJS_StartUpgrade调用完后直接做后续处理
                // 因为这里resolve后, 后续在3s内如果走进onreadystatechange中的reject, 就不执行reject的动作了
                /*setTimeout(function () {
                    resolve();
                }, 3000);*/
            });
            return oPromise;
        }
        /**
         * @synopsis 停止升级
         *
         * @returns {object} Promise
         */
        HATJS_StopUpgrade() {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                that[FILETMP] = null;
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 获取升级状态
         *
         * @returns {object} Promise
         */
        HATJS_GetUpgradeStatus() {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                if (that[STATUSTMP] === 100) {
                    resolve(0);
                }
                resolve(that[STATUSTMP]);
            });
            return oPromise;
        }
        /**
         * @synopsis 获取升级进度
         *
         * @returns {object} Promise
         */
        HATJS_GetUpgradeProgress() {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                let iProgress = 0;
                if (!that[UPGRADESTATUSURL]) {
                    resolve(iProgress);
                }
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            iProgress = parseInt($(oTool.parseXmlFromStr(xhr.responseText)).find("percent").text(), 10);
                        }
                    }
                };
                xhr.open('get', that[UPGRADESTATUSURL], false);
                xhr.send(null);
                if (that[STATUSTMP] === 100) {
                    resolve(100);
                }
                resolve(iProgress);
            });
            return oPromise;
        }
        /**
         * @synopsis 导出日志
         *
         * @param {number} szLogXml [IN]：日志xml信息
         * @param {number} szFileName [IN]：文件名
         * @param {number} iFileType [IN]：文件类型
         *
         * @returns {object} Promise
         */
        HATJS_ExportDeviceLog(szLogXml, szFileName, iFileType) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                let aResults = []; //存储所有日志
                let aLoglist_all = []; //转化成二位数组
                aResults = aResults.concat($(szLogXml).find('searchMatchItem').toArray());//aResults.concat((0, _jquery2.default)(szLogXml).find('searchMatchItem').toArray());
                for (let i = 0; i < aResults.length; i++) {
                    aLoglist_all[i] = [];
                    aLoglist_all[i][0] = $(aResults[i]).find('logtime').text().replace("T", " ").replace("Z", "");
                    aLoglist_all[i][1] = $(aResults[i]).find('majortype').text();
                    aLoglist_all[i][2] = $(aResults[i]).find('minortype').text();
                    aLoglist_all[i][3] = $(aResults[i]).find('channelid').text();
                    aLoglist_all[i][4] = $(aResults[i]).find('userName').text();
                    aLoglist_all[i][5] = $(aResults[i]).find('remoteaddress').text();
                }
                let textLog = []; //数组中转化为长字符串
                function creatItem(str) {
                    //字符串中插入空格
                    textLog.push(str);
                    let a = str.slice("");
                    if (/^[\u4e00-\u9fa5]/.test(str)) {
                        for (let _i2 = 0; _i2 < 30 - a.length * 2; _i2++) {
                            textLog.push(" ");
                        }
                    } else {
                        for (let _i3 = 0; _i3 < 30 - a.length; _i3++) {
                            textLog.push(" ");
                        }
                    }
                }

                //创建表头
                creatItem(" ");
                creatItem($(szLogXml).find('laLogTime').text());
                creatItem($(szLogXml).find('laLogMajorType').text());
                creatItem($(szLogXml).find('laLogMinorType').text());
                creatItem($(szLogXml).find('laLogChannel').text());
                creatItem($(szLogXml).find('laLogRemoteUser').text());
                creatItem($(szLogXml).find('laLogRemoteIP').text());
                textLog.push("\r\n");
                for (let _i4 = 0; _i4 < aLoglist_all.length; _i4++) {
                    let num = (_i4 + 1).toString();
                    creatItem(num);
                    for (let j = 0; j < 6; j++) {
                        creatItem(aLoglist_all[_i4][j]);
                    }
                    textLog.push("\r\n");
                }
                textLog = textLog.join("");
                let BOM = "\uFEFF";
                let blob;
                if (iFileType === 5) {
                    blob = new Blob([BOM + textLog], { type: 'text/csv' });
                } else {
                    blob = new Blob([textLog], { type: "text/plain" });
                    szFileName = "Log.txt";
                }
                let url = (window.URL || window.webkitURL).createObjectURL(blob);
                let link = window.document.createElement('a');
                link.href = url;
                link.download = szFileName;
                let click = document.createEvent("MouseEvents");
                click.initEvent("click", true, true);
                link.dispatchEvent(click);
                resolve();
            });
            return oPromise;
        }
        outCsv(szTableXml, ReportTitle, aLogName, aLoglist_all) {
            var CSV = '';
            /*标题*/
            //CSV += ReportTitle + '\r\n\n';
            var row = "";
            //创建表头
            for (let j = 0; j < aLogName.length; j++) {
                row += $(szTableXml).find(aLogName[j]).eq(0).text() + ',';
            }
            //截取对象内的数据。
            row = row.slice(0, -1);
            // 附加带换行符的标签行
            CSV += row + '\r\n';
            for (let _i4 = 0; _i4 < aLoglist_all.length; _i4++) {
                // let num = (_i4 + 1).toString();
                // row += '"' + num + '",';
                row = "";
                for (let j = 0; j < aLogName.length; j++) {
                    row += '"' + aLoglist_all[_i4][j] + '",';
                }
                row.slice(0, row.length - 1);
                CSV += row + '\r\n';
            }
            if (CSV === '') {
                return;
            }
            // 定义一个文件名一个文件名
            var fileName = "";
            fileName += ReportTitle;
            // if browser is IE
            var csvContent = "\ufeff";
            if (window.navigator.msSaveOrOpenBlob) {
                var uriie = csvContent + CSV;
                var blob = new Blob([decodeURIComponent(encodeURI(uriie))], {
                    type: "data:text/csv;charset=utf-8,"
                });
                navigator.msSaveBlob(blob, fileName + '.csv');
            } else {
                csvContent = "data:text/csv;charset=utf-8,\ufeff";
                var uriother = csvContent + CSV;
                // 第一种实现
                var encodedUri = encodeURI(uriother).replace(/&/g, '%26').replace(/\+/g, '%2B').replace(/\s/g, '%20').replace(/#/g, '%23');
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", fileName + ".csv");
                document.body.appendChild(link);
                link.click();
            }
        }

        /**
         * @synopsis 导出报告
         *
         * @param {number} szTableXml [IN]：报告xml信息
         * @param {number} szFileName [IN]：文件名
         * @param {number} iFileType [IN]：文件类型
         *
         * @returns {object} Promise
         */
        HATJS_ExportReport(szTableXml, szFileName, iFileType) {
            let oPromise = new Promise(resolve => {
                let aResults = []; //存储所有日志
                let aLoglist_all = []; //转化成二位数组
                let aLogName = $(szTableXml).find('NameList').text().split(',');
                aResults = aResults.concat($(szTableXml).find('tDataItem').toArray()); //aResults.concat((0, _jquery2.default)(szLogXml).find('searchMatchItem').toArray());
                for (let i = 0; i < aResults.length; i++) {
                    aLoglist_all[i] = [];
                    for (let j = 0; j < aLogName.length; j++) {
                        aLoglist_all[i][j] = $(aResults[i]).find(aLogName[j]).text();
                        if (aLogName[j] === "logtime") {
                            aLoglist_all[i][j] = aLoglist_all[i][j].replace("T", " ").replace("Z", "");
                        }
                    }
                }
                let textLog = []; //数组中转化为长字符串
                if (iFileType === 1) {
                    this.outCsv(szTableXml, szFileName, aLogName, aLoglist_all);
                } else {
                    function creatItem(str) {
                        //字符串中插入空格
                        textLog.push(str);
                        let a = str.slice("");
                        if (/^[\u4e00-\u9fa5]/.test(str)) {
                            for (let _i2 = 0; _i2 < 30 - a.length * 2; _i2++) {
                                textLog.push(" ");
                            }
                        } else {
                            for (let _i3 = 0; _i3 < 30 - a.length; _i3++) {
                                textLog.push(" ");
                            }
                        }
                    }
                    //创建表头
                    creatItem(" ");
                    for (let j = 0; j < aLogName.length; j++) {
                        creatItem($(szTableXml).find(aLogName[j]).eq(0).text());
                    }
                    textLog.push("\r\n");
                    for (let _i4 = 0; _i4 < aLoglist_all.length; _i4++) {
                        let num = (_i4 + 1).toString();
                        creatItem(num);
                        for (let j = 0; j < aLogName.length; j++) {
                            creatItem(aLoglist_all[_i4][j]);
                        }
                        textLog.push("\r\n");
                    }
                    textLog = textLog.join("");
                    let blob;
                    blob = new Blob([textLog], {
                        type: "text/plain"
                    });
                    let url = (window.URL || window.webkitURL).createObjectURL(blob);
                    let link = window.document.createElement('a');
                    link.href = url;
                    link.download = szFileName;
                    let click = document.createEvent("MouseEvents");
                    click.initEvent("click", true, true);
                    link.dispatchEvent(click);
                }
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 开始下载
         *
         * @param {number} szURL [IN]：下载url
         * @param {number} szAuth [IN]：文件路径
         * @param {number} szFileName [IN]：认证信息
         * @param {number} szDownXml [IN]：下载额外xml信息
         *
         * @returns {object} Promise
         */
        HATJS_StartAsyncDownload(szURL, szAuth, szFileName, szDownXml) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                let szPlaybackURI = $(oTool.parseXmlFromStr(szDownXml)).find("playbackURI").eq(0).text();
                let szDownloadUrl = szURL + (szURL.indexOf("?") >= 0 ? "&" : "?") + "playbackURI=" + szPlaybackURI;
                /*let szFileFormat = ".mp4";
                if (szURL.indexOf("picture/Streaming/tracks") > 0) {
                    szDownloadUrl = szURL;
                    szFileFormat = ".jpg";
                }
                let iFileNameStartIndex = szDownloadUrl.indexOf("&name=") + 6;
                let iFileNameEndIndex = szDownloadUrl.indexOf("&size=");
                szFileName = szDownloadUrl.substring(iFileNameStartIndex, iFileNameEndIndex);*/
                $("body").append('<a id="jsplugin_download_a" href="' + szDownloadUrl + '" download=' + szFileName + '><li id="jsplugin_download_li"></li></a>');
                $("#jsplugin_download_li").trigger("click");
                $("#jsplugin_download_a").remove();
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 停止下载
         *
         * @param {number} iDownloadID [IN]：下载id
         *
         * @returns {object} Promise
         */
        HATJS_StopAsyncDownload(/*iDownloadID*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 获取下载状态
         *
         * @param {number} iDownloadID [IN]：下载id
         *
         * @returns {object} Promise
         */
        HATJS_GetDownloadStatus(/*iDownloadID*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 获取下载进度
         *
         * @param {number} iDownloadID [IN]：下载id
         *
         * @returns {object} Promise
         */
        HATJS_GetDownloadProgress(/*iDownloadID*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 启用客流量统计
         *
         * @param {number} iWndNum [IN]：窗口索引
         * @param {number} iEnable [IN]：是否启用统计
         *
         * @returns {object} Promise
         */
        HATJS_EnablePDC(/*iWndNum, iEnable*/) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 调整窗口位置
         *
         * @param {number} iWidth [IN]：窗口宽度
         * @param {number} iHeight [IN]：窗口高度
         *
         * @returns {object} Promise
         */
        HATJS_Resize(iWidth, iHeight) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                setTimeout(() => {
                    let bFullscreen = document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || false;
                    if (that[WINDOWFULL] && bFullscreen) {
                        iWidth = $(window).width();
                        iHeight = $(window).height();
                        oJSPlugin.find("div").eq(0).css({
                            width: iWidth,
                            height: iHeight
                        });
                        // that[WINDOWFULL] = false;
                    } else {
                        oJSPlugin.find("div").eq(0).css({
                            width: iWidth,
                            height: iHeight
                        });
                    }
                    that[OPTIONS].iWidth = iWidth;
                    that[OPTIONS].iHeight = iHeight;
                    //解决firefox全屏切换有画面残留的问题;
                    if (oTool.isFirefox()) {
                        for (let i = 0; i < that[OPTIONS].iMaxSplit * that[OPTIONS].iMaxSplit; i++) {
                            if (that[WNDSTATUSLIST][i].oPlayCtrl) {
                                that[WNDSTATUSLIST][i].oPlayCtrl.PlayM4_ClearCanvas();
                            }
                        }
                    }
                    updateWnd();

                    if (that[SINGLEWINDOW] && bFullscreen) {
                        iWidth = $(window).width();
                        iHeight = $(window).height();
                        that[SINGLEWINDOW].css({
                            width: iWidth,
                            height: iHeight
                        });
                        that[SINGLEWINDOW].find("canvas").attr("width", iWidth - 2);
                        that[SINGLEWINDOW].find("canvas").attr("height", iHeight - 2);
                        //that[SINGLEWINDOW] = null;
                    }
                    if (!bFullscreen) {
                        that[SINGLEWINDOW] = null;
                        that[WINDOWFULL] = false;
                    }
                    that[DRAWCANVAS].resizeCanvas();
                    that[DRAWCANVAS].canvasRedraw();
                }, 80);
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 设置绘图回调
         *
         * @param {number} iWndNum [IN]：窗口索引
         * @param {string} bEnable [IN]设置绘图回调使能
         * @param {string} szType [IN]图形类型
         * @param {string} bDisplay [IN]是否显示图形
         * @param {function} fCurrentCallback [IN]绘图回调
         *
         * @returns {object} Promise
         */
        HATJS_SetDrawCallback(iWndNum, bEnable, szType, bDisplay, fCurrentCallback) {
            let oPromise = new Promise(function (resolve, reject) {
                that[CALLBACKFUNCTION] = null;
                that[CALLBACKFUNCTIONS][iWndNum] = null;
                if (!that[WNDSTATUSLIST][iWndNum].bPlay) {  //后续预览回放需要考虑全面
                    reject();
                    return;
                }
                if (bEnable) {
                    $(".draw-window").unbind();
                    that[CALLBACKFUNCTION] = fCurrentCallback;
                    that[CALLBACKFUNCTIONS][iWndNum] = fCurrentCallback;
                    that[DRAWCANVAS] = new ESCanvas(that[OPTIONS].szId + "canvas_draw" + iWndNum);
                    that[DRAWCANVAS].setShapeType("Rect");
                    that[DRAWCANVAS].setDrawStyle("#ff0000", "", 0);
                    that[DRAWCANVAS].setDrawStatus(true, function (oRECT) {
                        fCurrentCallback(oRECT);
                    });
                    that[WNDSTATUSLIST][iWndNum].bSetDrawCallback = true;
                } else {
                    that[DRAWCANVAS].setDrawStatus(false);
                    that[WNDSTATUSLIST][iWndNum].bSetDrawCallback = false;
                    // 设置绘图回调后，画布重建，DRAWCANVAS对象上的事件事件清除了，需要重新绑定
                    that[EVENTCALLBACK] && that[EVENTCALLBACK].onDrawEvent && that[DRAWCANVAS].setDrawEventCallback(that[EVENTCALLBACK].onDrawEvent);
                }
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 设置绘图状态
         *
         * @param {array} bDraw [IN]是否开启绘图
         *
         * @returns {object} Promise
         */
        HATJS_SetDrawStatus(bDraw) {
            let oPromise = new Promise(function (resolve, reject) {
                if (!that[DRAWCANVAS]) {
                    reject();
                    return;
                }
                that[DRAWCANVAS].setDrawStatus(bDraw);
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 清除绘图信息
         *
         * @returns {object} Promise
         */
        HATJS_ClearRegion() {
            let oPromise = new Promise(function (resolve, reject) {
                if (!that[DRAWCANVAS]) {
                    reject();
                    return;
                }
                that[DRAWCANVAS].clearAllShape();
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 设置绘图状态
         *
         * @param {string} szType [IN]图形类型
         * @param {object} oInfo [IN]绘图信息
         *
         * @returns {object} Promise
         */
        HATJS_SetDrawShapeInfo(szType, oInfo) {
            let oPromise = new Promise(function (resolve, reject) {
                if (typeof szType === "undefined" || szType === "") {
                    reject();
                    return;
                }
                if ("" !== oInfo.id && "Rect" === szType) {
                    that[DRAWCANVAS].deleteRepeatByIdAndType(oInfo.id, "Rect");
                }
                that[DRAWCANVAS].setShapeType(szType);
                that[DRAWCANVAS].setDrawStatus(true);
                that[DRAWCANVAS].setDrawMutiShapeOneTime(false);
                that[DRAWCANVAS].setDrawStyle(oInfo.drawColor || "", oInfo.fillColor || oInfo.drawColor || "", oInfo.translucent || 0);
                if (oInfo.maxShapeSupport && oInfo.maxShapeSupport > 0) {
                    if (oInfo.id) {
                        let iShapeLength = that[DRAWCANVAS].getAllShapesInfo().length;
                        that[DRAWCANVAS].setMaxShapeSupport(iShapeLength + 1);
                    } else {
                        that[DRAWCANVAS].setMaxShapeSupport(oInfo.maxShapeSupport);
                    }
                }
                that[DRAWCANVAS].setCurrentShapeInfo({
                    szId: oInfo.id,
                    szTips: oInfo.tips,
                    lineType: oInfo.lineType,
                    iMinClosed: oInfo.minPointSupport || oInfo.minClosed || 3,
                    iMaxPointNum: oInfo.maxPointSupport || oInfo.pointNumMax || 11,
                    iPolygonType: 1,
                    szDrawColor: oInfo.drawColor || "",
                    szFillColor: oInfo.fillColor || oInfo.drawColor || "",
                    iTranslucent: oInfo.translucent || 0,
                    iRedrawMode: oInfo.redrawMode || 0,
                    type: oInfo.type   //
                });
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 设置移动侦测信息
         *
         * @param {object} oGrid [IN]网格绘图信息
         *
         * @returns {object} Promise
         */
        HATJS_SetGridInfo(oGrid) {
            let oPromise = new Promise(function (resolve, reject) {
                if (oGrid === null || typeof oGrid === 'undefined') {
                    reject();
                    return;
                }
                let szDrawColor = "#ff0000";
                if (oGrid.drawColor) {
                    szDrawColor = oGrid.drawColor;
                }
                that[DRAWCANVAS].setDrawStyle(szDrawColor);
                that[DRAWCANVAS].setShapesInfoByType("Grid", [{
                    gridMap: oGrid.gridMap,
                    gridColNum: oGrid.gridColNum,
                    gridRowNum: oGrid.gridRowNum
                }]);
                that[DRAWCANVAS].setShapeType("Grid");
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 获取移动侦测信息
         *
         * @returns {object} Promise
         */
        HATJS_GetGridInfo() {
            let oPromise = new Promise(function (resolve, reject) {
                if (!that[DRAWCANVAS]) {
                    reject();
                }
                let oShape = that[DRAWCANVAS].getShapesInfoByType("Grid")[0];
                if (!oShape) {
                    reject();
                }
                resolve({
                    gridColNum: oShape.gridColNum,
                    gridRowNum: oShape.gridRowNum,
                    gridMap: oShape.gridMap
                });
            });
            return oPromise;
        }
        /**
         * @synopsis 设置矩形信息
         *
         * @param {array} aRects [IN]：矩形信息
         *
         * @returns {object} Promise
         */
        HATJS_SetRectInfo(aRects) {
            let oPromise = new Promise(function (resolve, reject) {
                if (typeof aRects === "undefined" || !aRects.length) {
                    reject();
                    return;
                }
                if (aRects[0] && aRects[0].maxShapeSupport && aRects[0].maxShapeSupport > 0) {
                    that[DRAWCANVAS].setMaxShapeSupport(aRects[0].maxShapeSupport);
                } else {
                    that[DRAWCANVAS].setMaxShapeSupport(25);
                }
                that[DRAWCANVAS].setDrawMutiShapeOneTime(false);
                let aShapesInfo = [];
                if (aRects.length > 0) {
                    for (let i = 0, iLen = aRects.length; i < iLen; i++) {
                        let aPoints = aRects[i].points;
                        if (aPoints.length > 0) {
                            aShapesInfo.push(aRects[i]);
                        }
                    }
                }
                if (aShapesInfo.length > 0) {
                    that[DRAWCANVAS].setShapesInfoByType("Rect", aShapesInfo);
                    resolve();
                } else {
                    reject();
                }
            });
            return oPromise;
        }
        /**
         * @synopsis 设置矩形信息
         *
         * @returns {object} Promise
         */
        HATJS_GetRectInfo() {
            let oPromise = new Promise(function (resolve, reject) {
                if (!that[DRAWCANVAS]) {
                    reject();
                }
                let aShapesInfo = [];
                let aShapes = that[DRAWCANVAS].getShapesInfoByType("Rect");
                for (let i = 0, iLen = aShapes.length; i < iLen; i++) {
                    let oShape = aShapes[i];
                    let oRect = {
                        id: oShape.id,
                        points: oShape.points,
                        closed: oShape.closed,
                        tips: oShape.tips
                    };
                    aShapesInfo.push(oRect);
                }
                resolve(aShapesInfo);
            });
            return oPromise;
        }
        /**
         * @synopsis 设置多边形信息
         *
         * @param {array} aPolygons [IN]多边形信息
         *
         * @returns {object} Promise
         */
        HATJS_SetPolygonInfo(aPolygons) {
            //console.log("HATJS_SetPolygonInfo");
            let oPromise = new Promise(function (resolve, reject) {
                if (typeof aPolygons === "undefined" || !aPolygons.length) {
                    //console.log("undefined");
                    reject();
                    return;
                }
                that[DRAWCANVAS].setMaxShapeSupport(25);
                that[DRAWCANVAS].setDrawMutiShapeOneTime(false);
                that[DRAWCANVAS].setShapeType("");

                let aShapesInfo = [];
                //console.log("length: " + aPolygons.length);
                if (aPolygons.length > 0) {
                    for (let i = 0, iLen = aPolygons.length; i < iLen; i++) {
                        let aPoints = aPolygons[i].aPoint;
                        //console.log("length1: " + aPoints.length);
                        if (aPoints.length > 0) {
                            that[DRAWCANVAS].setCurrentShapeInfo({ szId: aPolygons[i].id });
                            aShapesInfo.push(aPolygons[i]);
                        }
                    }
                }
                if (aShapesInfo.length > 0) {
                    that[DRAWCANVAS].setShapesInfoByType("Polygon", aShapesInfo);
                    resolve();
                } else {
                    reject();
                }
            });
            return oPromise;
        }
        /**
         * @synopsis 获取多边形信息
         *
         * @returns {object} Promise
         */
        HATJS_GetPolygonInfo() {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                let aShapesInfo = [];
                let aShapes = that[DRAWCANVAS].getShapesInfoByType("Polygon");
                for (let i = 0, iLen = aShapes.length; i < iLen; i++) {
                    let oShape = aShapes[i];
                    let oPolygon = {
                        id: oShape.id,
                        points: oShape.points,
                        closed: oShape.closed,
                        tips: oShape.tips,
                        drawColor: oShape.drawColor
                    };
                    aShapesInfo.push(oPolygon);
                }
                resolve(aShapesInfo);
            });
            return oPromise;
        }
        /**
         * @synopsis 设置线信息
         *
         * @param {array} aLines [IN]线信息
         *
         * @returns {object} Promise
         */
        HATJS_SetLineInfo(aLines) {
            let oPromise = new Promise(function (resolve, reject) {
                if (typeof aLines === "undefined" || !aLines.length) {
                    reject();
                    return;
                }
                let aShapesInfo = [];
                that[DRAWCANVAS].setMaxShapeSupport(25);
                that[DRAWCANVAS].setDrawMutiShapeOneTime(false);
                if (aLines.length > 0) {
                    for (let i = 0, iLen = aLines.length; i < iLen; i++) {
                        let aShapes = that[DRAWCANVAS].getShapesInfoByType("Line");
                        for (let j = 0, iLength = aShapes.length; j < iLength; j++) {
                            let oShape = aShapes[j];
                            if (aLines[i].id === oShape.id) {
                                that[DRAWCANVAS].deleteRepeatByIdAndType(aLines[i].id, "Line");
                            }
                        }
                        let aPoints = aLines[i].aPoint;
                        if (aPoints.length > 0) {
                            aShapesInfo.push(aLines[i]);
                        }
                    }
                }
                if (aShapesInfo.length > 0) {
                    that[DRAWCANVAS].setShapesInfoByType("Line", aShapesInfo);
                    that[DRAWCANVAS].setShapeType('');//由于此方法是直接绘制一条完整直线上去，所以绘制完后将绘制图形类型置空
                    resolve();
                } else {
                    reject();
                }
            });
            return oPromise;
        }
        /**
         * @synopsis 获取线信息
         *
         * @returns {object} Promise
         */
        HATJS_GetLineInfo() {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                let aShapesInfo = [];
                let aShapes = that[DRAWCANVAS].getShapesInfoByType("Line");
                for (let i = 0, iLen = aShapes.length; i < iLen; i++) {
                    let oShape = aShapes[i];
                    let oLine = {
                        id: oShape.id,
                        lineType: oShape.lineType,
                        points: oShape.points,
                        tips: oShape.tips,
                        direction: oShape.direction,
                        closed: oShape.closed,
                        pdcArrow: oShape.pdcArrow
                    };
                    aShapesInfo.push(oLine);
                }
                resolve(aShapesInfo);
            });
            return oPromise;
        }
        /**
         * @synopsis 设置字符叠加信息
         *
         * @param {array} oOverlayInfo [IN]：字符叠加信息
         *
         * @returns {object} Promise
         */
        HATJS_SetTextOverlay(oOverlayInfo) {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                that[DRAWCANVAS] = null;
                that[DRAWCANVAS] = new ESCanvas(that[OPTIONS].szId + "canvas_draw" + that[CURWNDINDEX]); //前端需要实现预览界面不同窗口的osd配置
                that[DRAWCANVAS].setMaxShapeSupport(25);
                that[DRAWCANVAS].clearShapeByType("RectOSD");
                that[DRAWCANVAS].setDrawStyle("#ff0000", "#343434", 0.7);
                let szText = "";
                let szEnabled = "";
                let fStartX = 0;
                let fStartY = 0;
                if (oOverlayInfo.channelName) {
                    szText = oOverlayInfo.channelName.name;
                    szEnabled = oOverlayInfo.channelName.enable.toString();
                    fStartX = oOverlayInfo.channelName.point[0];
                    fStartY = oOverlayInfo.channelName.point[1];
                    that[DRAWCANVAS].addOSDShape(szText, szEnabled, fStartX, fStartY, {
                        szOSDType: "overlay-ch",
                        szAlignment: oOverlayInfo.channelName.alignment || "0"  // 默认 0-自定义
                    });
                }
                if (oOverlayInfo.date) {
                    let iDateType = oOverlayInfo.date.dateType;
                    let bDisplayWeek = oOverlayInfo.date.showWeekDay;
                    let szTimeFormat = oOverlayInfo.date.timeFormat;
                    let szWeek = "";
                    let szTimeFormatText = "";
                    szText = "";
                    szEnabled = oOverlayInfo.date.enable.toString();
                    fStartX = oOverlayInfo.date.point[0];
                    fStartY = oOverlayInfo.date.point[1];
                    let aWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    let date = new Date();
                    if (bDisplayWeek) {
                        szWeek = aWeek[date.getDay()];
                    }
                    if (szTimeFormat === "24hour") {
                        szTimeFormatText = "";
                    } else {
                        szTimeFormatText = "AM/PM";
                    }
                    switch (iDateType) {
                        case 0:
                            szText = "YYYY-MM-DD " + szWeek + " hh:mm:ss " + szTimeFormatText;
                            break;
                        case 1:
                            szText = "MM-DD-YYYY " + szWeek + " hh:mm:ss " + szTimeFormatText;
                            break;
                        case 2:
                            szText = "CHR-YYYY-MM-DD " + szWeek + " hh:mm:ss " + szTimeFormatText;
                            break;
                        case 3:
                            szText = "CHR-MM-DD-YYYY " + szWeek + " hh:mm:ss " + szTimeFormatText;
                            break;
                        case 4:
                            szText = "DD-MM-YYYY " + szWeek + " hh:mm:ss " + szTimeFormatText;
                            break;
                        case 5:
                            szText = "CHR-DD-MM-YYYY " + szWeek + " hh:mm:ss " + szTimeFormatText;
                            break;
                        default:
                            break;
                    }
                    that[DRAWCANVAS].addOSDShape(szText, szEnabled, fStartX, fStartY, {
                        szOSDType: "overlay-date",
                        szDateStyle: iDateType.toString(),
                        szDisplayWeek: bDisplayWeek.toString(),
                        szClockType: szTimeFormat,
                        szAlignment: oOverlayInfo.date.alignment || "0"  // 默认 0-自定义
                    });
                }
                if (oOverlayInfo.text) {
                    let szId = "";
                    let iTextLength = oOverlayInfo.text.length;
                    szText = "";
                    szEnabled = "";
                    fStartX = 0;
                    fStartY = 0;
                    for (let i = 0; i < iTextLength; i++) {
                        szId = oOverlayInfo.text[i].id;
                        szText = oOverlayInfo.text[i].text;
                        szEnabled = oOverlayInfo.text[i].enable.toString();
                        fStartX = oOverlayInfo.text[i].point[0];
                        fStartY = oOverlayInfo.text[i].point[1];
                        that[DRAWCANVAS].addOSDShape(szText, szEnabled, fStartX, fStartY, {
                            szOSDType: "overlay-text",
                            szId: szId,
                            szAlignment: oOverlayInfo.text[i].alignment || "0"  // 默认 0-自定义
                        });
                    }
                }
                // 画布重建，DRAWCANVAS对象上的事件事件清除了，需要重新绑定
                that[EVENTCALLBACK] && that[EVENTCALLBACK].onDrawEvent && that[DRAWCANVAS].setDrawEventCallback(that[EVENTCALLBACK].onDrawEvent);
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 设置字符叠加信息
         *
         * @returns {object} Promise
         */
        HATJS_GetTextOverlay() {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                let oOverlayInfo = {};
                let aText = [];
                let aShapes = that[DRAWCANVAS].getShapesInfoByType("RectOSD");
                for (let i = 0, len = aShapes.length; i < len; i++) {
                    let oOSD = aShapes[i];
                    if (oOSD.szOSDType === "overlay-ch") {
                        oOverlayInfo.channelName = {
                            enable: oOSD.szEnabled === "true",
                            name: oOSD.szText,
                            alignment: oOSD.szAlignment || "0",
                            point: [oOSD.iPositionX, oOSD.iPositionY]
                        };
                    }
                    if (oOSD.szOSDType === "overlay-date") {
                        oOverlayInfo.date = {
                            enable: oOSD.szEnabled === "true",
                            alignment: oOSD.szAlignment || "0",
                            dateType: parseInt(oOSD.szDateStyle, 10),
                            timeFormat: oOSD.szClockType,
                            showWeekDay: oOSD.szDisplayWeek === "true",
                            point: [oOSD.iPositionX, oOSD.iPositionY]
                        };
                    }
                    if (oOSD.szOSDType === "overlay-text") {
                        aText.push({
                            id: oOSD.szId,
                            enable: oOSD.szEnabled === "true",
                            alignment: oOSD.szAlignment || "0",
                            text: oOSD.szText,
                            point: [oOSD.iPositionX, oOSD.iPositionY]
                        });
                    }
                }
                oOverlayInfo.text = aText;
                resolve(oOverlayInfo);
            });
            return oPromise;
        }
        /**
         * @synopsis 设置点信息
         *
         * @param {array} aPoints [IN]点信息
         *
         * @returns {object} Promise
         */
        HATJS_SetPointInfo(aPoints) {
            let oPromise = new Promise(function (resolve, reject) {
                if (typeof aPoints === "undefined" || !aPoints.length) {
                    reject();
                    return;
                }
                let aShapesInfo = [];
                that[DRAWCANVAS].setMaxShapeSupport(25);
                that[DRAWCANVAS].setDrawMutiShapeOneTime(false);
                if (aPoints.length > 0) {
                    for (let i = 0, iLen = aPoints.length; i < iLen; i++) {
                        let aShapes = that[DRAWCANVAS].getShapesInfoByType("Point");
                        for (let j = 0, iLength = aShapes.length; j < iLength; j++) {
                            let oShape = aShapes[j];
                            if (aPoints[i].id === oShape.id) {
                                that[DRAWCANVAS].deleteRepeatByIdAndType(aPoints[i].id, "Point");
                            }
                        }
                        let aPointsInfo = aPoints[i].aPoint;
                        if (aPointsInfo.length > 0) {
                            //aPoints[i].points = [aPointsInfo];
                            aShapesInfo.push(aPoints[i]);
                        }
                    }
                }
                if (aShapesInfo.length > 0) {
                    that[DRAWCANVAS].setShapesInfoByType("Point", aShapesInfo);
                    resolve();
                } else {
                    reject();
                }
            });
            return oPromise;
        }
        /**
         * @synopsis 获取点信息
         *
         * @returns {object} Promise
         */
        HATJS_GetPointInfo() {
            let oPromise = new Promise(function (resolve/*, reject*/) {
                let aShapesInfo = [];
                let aShapes = that[DRAWCANVAS].getShapesInfoByType("Point");
                for (let i = 0, iLen = aShapes.length; i < iLen; i++) {
                    let oShape = aShapes[i];
                    let oLine = {
                        id: oShape.id,
                        point: oShape.points,
                        tips: oShape.tips,
                        type: oShape.type,
                        drawColor: oShape.drawColor
                    };
                    aShapesInfo.push(oLine);
                }
                resolve(aShapesInfo);
            });
            return oPromise;
        }
        /**
         * @synopsis 根据类型删除图形
         *
         * @param {string} szType [IN]：类型
         * @param {array} aId [IN]：图形id数组
         * @returns {object} Promise
         */
        HATJS_ClearShapeByType(szType, aId) {
            let oPromise = new Promise(function (resolve, reject) {
                if (!that[DRAWCANVAS]) {
                    reject();
                    return;
                }
                // 删除选中的图形, 并返回图形ID
                if (szType === "Choosed") {
                    let iDeleteId = that[DRAWCANVAS].deleteChoosedShape();
                    resolve(iDeleteId);
                } else if (aId && aId.length > 0) {
                    for (let i = 0, iLen = aId.length; i < iLen; i++) {
                        that[DRAWCANVAS].deleteTargetShape(szType, aId[i]);
                    }
                    resolve();
                } else {    // 删除指定类型的图形
                    that[DRAWCANVAS].clearShapeByType(szType);
                    resolve();
                }
            });
            return oPromise;
        }
        /**
         * @synopsis 图片方式预览
         *
         * @param {int} iWnd [IN]：窗口号
         *
         * @param {string} szUrl [IN]：图片url
         *
         * @returns {object} Promise
         */
        HATJS_PlayWithImg(iWnd, szUrl) {
            if (this[OPTIONS].iType === 0) {
                return Promise.resolve();
            }
            var canvas = $("#" + this[OPTIONS].szId + "canvas_play" + iWnd);
            var iWidth = canvas.width();
            var iHeight = canvas.height();
            canvas.hide();
            var img = $("#playImg" + iWnd);
            img.show();
            img.css({
                width: iWidth + "px",
                height: iHeight + "px",
                border: "1px solid " + that.oPluginColor.borderColor,
                position: "absolute",
                left: 0
            });

            return new Promise((resolve, reject) => {
                function onload() {
                    img.unbind("load", onload);
                    img.unbind("error", onerror);
                    resolve();
                }

                function onerror() {
                    img.unbind("error", onerror);
                    img.unbind("load", onload);
                    reject();
                }
                img.bind("load", onload);
                img.bind("error", onerror);
                img.attr("src", szUrl);
            });
        }
        /**
         * @synopsis 设置是否以https进行取流
         *
         * @returns {object} Promise
         */
        HATJS_SetIsHttps() {
            let oPromise = new Promise(function (resolve) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 设置重连信息
         *
         * @returns {object} Promise
         */
        HATJS_SetReconnectInfo() {
            let oPromise = new Promise(function (resolve) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 检测是否需要更新
         *
         * @returns {object} Promise
         */
        HATJS_CheckUpdate() {
            let oPromise = new Promise(function (resolve) {
                resolve(false);
            });
            return oPromise;
        }
        /**
         * @synopsis 根据ID选中多边形
         *
         * @param {int} szType 图形类型
         * @param {int} iShapeId 图形id
         *
         * @returns {object} Promise
         */
        HATJS_SelectShape(szType, iShapeId) {
            let oPromise = new Promise(function (resolve, reject) {
                // 暂时只支持Polygon
                if (!szType) {
                    reject();
                    return;
                }
                that[DRAWCANVAS].selectShapeById(szType, "" + iShapeId);
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 获取视频分辨率
         *
         * @returns {object} Promise
         */
        HATJS_GetPictureSize() {
            let oPromise = new Promise(function (resolve) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 设置原始分辨率, 根据分辨率比例显示窗口
         *
         * @returns {object} Promise
         */
        HATJS_SetOriginResolution() {
            let oPromise = new Promise(function (resolve) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 设置窗口模式
         *
         * @returns {object} Promise
         */
        HATJS_SetPlayWndMode() {
            let oPromise = new Promise(function (resolve) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 更新窗口样式
         *
         * @param {object} oStyle 窗口样式
         *
         * @returns {object} Promise
         */
        HATJS_UpdateWindowStyle(oStyle) {
            let oPromise = new Promise(function (resolve) {
                that[OPTIONS].oStyle = oStyle;
                updateWnd();

                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 抠窗口区域
         *
         * @param {int} iLeft 左侧距离
         * @param {int} iTop 顶部距离
         * @param {int} iWidth 宽
         * @param {int} iHeight 高
         *
         * @returns {object} Promise
         */
        HATJS_CuttingPartWindow() {
            let oPromise = new Promise(function (resolve) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 抠窗口区域
         *
         * @param {int} iLeft 左侧距离
         * @param {int} iTop 顶部距离
         * @param {int} iWidth 宽
         * @param {int} iHeight 高
         *
         * @returns {object} Promise
         */
        HATJS_RepairPartWindow() {
            let oPromise = new Promise(function (resolve) {
                resolve();
            });
            return oPromise;
        }
        /**
         * @synopsis 清楚canvas所有功能
         *
         * @returns {object} Promise
         */
        HATJS_ClearAllCanvas() {
            let oPromise = new Promise(function (resolve) {
                $(".draw-window").each(function () {
                    $(this)[0].getContext("2d").clearRect(0, 0, $(this).width(), $(this).height());
                });
                resolve();
            });
            return oPromise;
        }

        /**
         * @synopsis 销毁所有
         *
         * @returns {object} Promise
         */
        HATJS_DestroyAll() {
            this.HATJS_DestroyPlugin();
            return Promise.resolve();
        }

        /**
         * @synopsis 设置回调类型
         *
         * @returns {object} Promise
         */
        HATJS_SetPackageType() {
            return Promise.resolve();
        }
        /**
         * @synopsis 设置非默认的绘制窗口索引
         *
         * @param {int} iWndIndex 窗口索引
         *
         * @returns {object} Promise
         */
        HATJS_SetSnapDrawWndIndex(iWndIndex) {
            that[DRAWWNDINDEX] = iWndIndex;
            if (that[DRAWWNDINDEX] < 0 || that[DRAWWNDINDEX] > (that[MAXWNDNUM] - 1)) {
                iWndIndex = that[CURWNDINDEX];
            }
            that.EventCallback.windowEventSelect(iWndIndex, true);
            return Promise.resolve();
        }

        HATJS_GetSlfPointList() {
            let oPromise = new Promise(function (resolve) {
                resolve();
            });
            return oPromise;
        }

        HATJS_GetSlfVersion() {
            let oPromise = new Promise(function (resolve) {
                resolve();
            });
            return oPromise;
        }

        HATJS_ExistGetSlfPointList() {
            let oPromise = new Promise(function (resolve) {
                resolve();
            });
            return oPromise;
        }

        HATJS_GetIpcImportErrorInfo() {
            let oPromise = new Promise(function (resolve) {
                resolve();
            });
            return oPromise;
        }

        /**
         * @synopsis 设置选中窗口
         * @param {int} iWndIndex 窗口索引
         * @returns {object} Promise
         */
        HATJS_SetWindowSelected(iWndIndex) {
            oJSPlugin.find(".parent-wnd").eq(0).find(".play-window").css("border", "1px solid " + that.oPluginColor.borderColor);
            oJSPlugin.find(".parent-wnd").eq(0).children().eq(iWndIndex).find(".play-window").eq(0).css("border", "1px solid " + that.oPluginColor.selectBorderColor);
            that.EventCallback.windowEventSelect(iWndIndex);
            return Promise.resolve();
        }
    }
    return JSDecoder;
})();

export { HATMediaJsPlugin };
