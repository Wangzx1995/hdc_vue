
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label
}

/**
 * 时长格式化：XXX 分钟
 * @time {number} 秒
* */
export function timeDuration(time) {
  const duration = Number(time)
  if (duration < 60) {
    return pluralize(~~(duration), ' 秒')
  } else if (duration < 3600) {
    return pluralize(~~(duration / 60), ' 分钟')
  } else if (duration < 86400) {
    return pluralize(~~(duration / 3600), ' 小时')
  } else {
    return pluralize(~~(duration / 86400), ' 天')
  }
}

/**
 * 时间格式化：XXX 分钟前
 * @time {number} 秒
 * */
export function timeAgo(time, option) {
    if(typeof time == 'string') {
        time = new Date(Date.parse(time)) / 1000;
    }
    if(time.toString().length < 13) {
        time = +time * 1000
    }
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) { // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前 ' + parseTime(d, '{h}:{i}');
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    }
}

/**
 * 时间格式化：{y}-{m}-{d} {h}:{i}:{s}
 * */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  if(time == undefined || time == null || time == 0) {
      return '';
  }
  if ((time + '').length === 10) {
    time = +time * 1000
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    date = new Date(parseInt(time))
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 *  数字 保留n位小数并格式化输出（不足的部分补0）
 *  */
export function formatFloat(value, n) {
    var f = Math.round(value*Math.pow(10,n))/Math.pow(10,n);
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        s += '.';
    }
    for(var i = s.length - s.indexOf('.'); i <= n; i++){
        s += "0";
    }
    return s;
}

/**
 *  数字 格式化
 *  */
export function nFormatter(num, digits) {
  const si = [
        { value: 1E18, symbol: 'E' },
        { value: 1E15, symbol: 'P' },
        { value: 1E12, symbol: 'T' },
        { value: 1E9, symbol: 'G' },
        { value: 1E6, symbol: 'M' },
        { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 *  阿拉伯数字 转大写
 *  */
export function chineseNumber(num) {
  const dx = [ '零', '一', '二', '三', '四', '五', '六', '七', '八', '九' ];
  let no = '';
  for (let i=0; i < num.length; i++) {
    if((/^[0-9]*$/).test(num[i])) {
      no += dx[parseInt(num[i])];
    } else {
      no += num[i];
    }
  }
  return no.toString()
}

/**
 * Html转文本
 * */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * 截取字符串长度
 * @param string
 * @param length
 */
export function subString(str, len) {
    if(!str){
       return '';
    }
    let ext = '';
    if (str.length > len) {
        ext = '...';
    }
  return str.substring(0, len) + ext;
}

/**
 * 解析消息类型
 * @param val
 */
export function parseMsgType(val){
  var msgTypeName="";
  switch(val){
    case 1:
      msgTypeName="活动消息";
      break;
    case 2:
      msgTypeName="提醒消息";
      break;
    case 3:
      msgTypeName="更新消息";
      break;
    case 4:
      msgTypeName="系统消息";
      break;
      case 5:
          msgTypeName="异常下线";
          break;
    default:
      msgTypeName="未定义";
      break;
  }
  return msgTypeName;
}

/**
 * 解析会员类型
 * @param val
 */
export function parseMemberType(val){
    var memberTypeName="";
    switch(val){
        case 1:
            memberTypeName="普通会员";
            break;
        case 2:
            memberTypeName="企业会员";
            break;
        case 3:
            memberTypeName="运维会员";
            break;
        default:
            memberTypeName="未定义";
            break;
    }
    return memberTypeName;
}
/**
 * 解析会员类型
 * @param val
 */
export function parseMemberUseStatus(val){
    var memberUseStatus="";
    switch(val){
        case 0:
            memberUseStatus="停用";
            break;
        case 1:
            memberUseStatus="启用";
            break;
        default:
            memberUseStatus="未知";
            break;
    }
    return memberUseStatus;
}

/**
 * 解析：车辆充电枪状态
 * @param 0：未连接，1：已连接
 */
export function parsePowerStatus(val){
    var statusText="";
    switch(val){
        case 0:
            statusText="未连接";
            break;
        case 1:
            statusText="已连接";
            break;
        default:
            statusText="未知";
            break;
    }
    return statusText;
}

/**
 * 解析：锁状态
 * @param 0：关闭，1：打开
 */
export function parseLockStatus(val){
    var statusText="";
    switch(val){
        case 0:
            statusText="关闭";
            break;
        case 1:
            statusText="打开";
            break;
        default:
            statusText="未知";
            break;
    }
    return statusText;
}

/**
 * 解析：还车状态
 * @param val
 */
export function parseTripReturnStatus(val){
    var statusText = "";
    switch(val){
        case 0:
            statusText = "未还车";
            break;
        case 1:
            statusText = "APP还车";
            break;
        case 2:
            statusText = "人工还车";
            break;
        default:
            statusText = "还车状态未知";
            break;
    }
    return statusText;
}

/**
 * 解析：预约状态
 * @param 1：预约中；2：预约转单；3：预约失败；4：预约取消；5：预约超时
 */
export function parseReserveStatus(val){
    var statusText = "";
    switch(val){
        case 1:
            statusText = "预约中";
            break;
        case 2:
            statusText = "预约转单";
            break;
        case 3:
            statusText = "预约失败";
            break;
        case 4:
            statusText = "预约取消";
            break;
        case 5:
            statusText = "预约超时";
            break;
        default:
            statusText = "预约状态未知";
            break;
    }
    return statusText;
}

/**
 * 解析：还车状态
 * @param // 0：未结算;1：已结算;2：运维免单;3：人工结算
 */
export function parsePaymentStatus(val){
    var statusText = "";
    switch(val){
        case 0:
            statusText = "未结算";
            break;
        case 1:
            statusText = "已结算";
            break;
        case 2:
            statusText = "运维免单";
            break;
        case 3:
            statusText = "人工结算";
            break;
        default:
            statusText = "结算状态未知";
            break;
    }
    return statusText;
}

/**
 * 解析：违章处理状态
 * @param // 0：未查证;1：违章查证中;2：违章处理中;3：违章查证完成
 */
export function parseLllegalStatus(val){
    var statusText = "";
    switch(val){
        case 0:
            statusText = "未查证";
            break;
        case 1:
            statusText = "违章查证中";
            break;
        case 2:
            statusText = "违章处理中";
            break;
        case 3:
            statusText = "违章查证完成";
            break;
        default:
            statusText = "违章查证状态未知";
            break;
    }
    return statusText;
}

/**
 * 解析：网点类型
 * @param val
 */
export function parseServicePointType(val){
    var statusText = "";
    switch(val){
        case 1:
            statusText = "普通网点";
            break;
        case 2:
            statusText = "企业网点";
            break;
        default:
            statusText = "未定义";
            break;
    }
    return statusText;
}

/**
 * 解析：网点类型
 * @param val
 */
export function parseOrderType(val){
    var statusText = "";
    switch(val){
        case 1:
            statusText = "普通订单";
            break;
        case 2:
            statusText = "运维订单";
            break;
        default:
            statusText = "未定义";
            break;
    }
    return statusText;
}

/**
 * 解析：车辆状态
 * @param val
 * return 0：空闲，1：预约，2：租赁，3：运维，4：故障，5；离线，6：亏电
 */
export function parseCarStatus(val){
    var statusText = "";
    switch(val){
        case 0:
            statusText = "空闲";
            break;
        case 1:
            statusText = "预约";
            break;
        case 2:
            statusText = "租赁";
            break;
        case 3:
            statusText = "运维";
            break;
        case 4:
            statusText = "故障";
            break;
        case 5:
            statusText = "离线";
            break;
        case 6:
            statusText = "亏电";
            break;
        default:
            statusText = "未知";
            break;
    }
    return statusText;
}

/**
 * 数字转周天
 * 1：一，2：二，3：三，4：四，5：五，6：六，7：日
 */
export function number2WeekDay(num){
  const dx = [ '一', '二', '三', '四', '五', '六', '日'];
  let no = '';
  num = num.toString();
  for (let i=0; i < num.length; i++) {
    if((/^[1-7]*$/).test(num[i])) {
      no += dx[parseInt(num[i])-1];
    } else {
      no += num[i];
    }
  }
  return no.toString()
}

/**
 * 数字转时间单位
 * 0：秒，1：分，2：小时，3：天，4：周，5：月，6：年
 */
export function number2TimeUnit(num){
  const dx = [ '秒', '分', '小时', '天', '周', '月', '年'];
  let no = '';
  num = num.toString();
  for (let i=0; i < num.length; i++) {
    if((/^[1-7]*$/).test(num[i])) {
      no += dx[parseInt(num[i])];
    } else {
      no += num[i];
    }
  }
  return no.toString()
}


/**
 * 数字转换
 * 超过1万转简写，如：12809 => 1.28万
 */
export function parseNumber(num){
    let suffix = '';
    if(num == null || num == undefined || num == '') {
        num = 0;
    }
    if(typeof num != 'Number') {
        num = parseInt(num);
    }
    if(num > 9999) {
        num = (num/10000).toFixed(2);
        suffix = '万'
    }
    return num + suffix;
}

/**
 * 公里数转换
 *
 */
export function parseMileage(num){
    let suffix = '米';
    if(num == null || num == undefined || num == '') {
        num = 0;
    }
    if(typeof num != 'Number') {
        num = parseInt(num);
    }
    if(num > 999) {
        num = (num/1000).toFixed(2);
        suffix = '公里'
    }
    return num + suffix;
}

/**
 * 目标值为空时展示的数据
 * @param value             需要判断的值
 * @param emptyResult       为空时的返回值
 * @param notEmptyResult    不为空时的返回值
 * @returns {*}
 */
export function undefinedValue(value, emptyResult, notEmptyResult){
  if(value == undefined || value===""){
    if(emptyResult == undefined){
      return '--';
    }
    return emptyResult;
  }else{
    if(notEmptyResult == undefined){
      return value;
    }
    return notEmptyResult;
  }
}

/**
 * 清除空格
 * @param (String, 'G')
 * @returns {*}
 */
export function trim(str,is_global) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g,"");
    if(is_global.toLowerCase()=="g")
    {
        result = result.replace(/\s/g,"");
    }
    return result;
}

/**
 * 文件大小，入参单位B,出参B、KB、MB、GB
 * @param fileSize
 * @returns {*}
 */
export function fileSize(fileSize) {
	if (!fileSize) {
		return '';
	}
	if (fileSize < 0) {
		return '0';
	}
	let formatedFileSize = fileSize / 1024;
	if (formatedFileSize < 1) {
		return fileSize + 'B';
	}
	if (formatedFileSize < 1024) {
		return formatFloat(formatedFileSize, 2) + 'KB';
	}
	formatedFileSize /= 1024;
	if (formatedFileSize < 1024) {
		return formatFloat(formatedFileSize, 2) + 'MB';
	}
	formatedFileSize /= 1024;
	return formatFloat(formatedFileSize, 2) + 'GB';
}

export function intervalTime(startTime, endTime) {
	if (!(startTime instanceof Date)) {
		startTime = new Date(startTime.replace(/-/g, '/'))
	}
	if (!(endTime instanceof Date)) {
		endTime = new Date(endTime.replace(/-/g, '/'));
	}
	var interval = endTime - startTime;  //时间差的毫秒数
	var str = '';
	//计算出相差天数
	var days = Math.floor(interval / (24 * 3600 * 1000));
	if (days > 0) {
		str += days + "天";
	}
	//计算出小时数
	var leave1 = interval % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
	var hours = Math.floor(leave1 / (3600 * 1000));
	if (hours > 0) {
		str += hours + "小时";
	}
	//计算相差分钟数
	var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
	var minutes = Math.floor(leave2 / (60 * 1000));
	if (minutes > 0) {
		str += minutes + "分钟";
	}
	//计算相差秒数
	var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
	var seconds = Math.round(leave3 / 1000);
	if (seconds >= 0) {
		str += seconds + "秒";
	}
	return str;
}
/* 秒转时分秒 */
export function secondToString(time) {
	if (time == 0 || time) {
		let h = (time - time % 3600) / 3600;
		time = time - h * 3600
		let m = (time - time % 60) / 60;
		let s = time - m * 60
		return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s)
	} else {
		return false;
	}
}
/* 秒转时分秒  中文 */

export function formatSeconds(value) {
	if (value === '' || value === null || value === undefined) {
		return ''
	}
	var theTime = parseInt(value);// 秒  
	var theTime1 = 0;// 分  
	var theTime2 = 0;// 小时  
	if (theTime > 60) {
		theTime1 = parseInt(theTime / 60);
		theTime = parseInt(theTime % 60);
		if (theTime1 > 60) {
			theTime2 = parseInt(theTime1 / 60);
			theTime1 = parseInt(theTime1 % 60);
		}
	}
	var result = "" + parseInt(theTime) + "秒";
	if (theTime1 > 0) {
		result = "" + parseInt(theTime1) + "分" + result;
	}
	if (theTime2 > 0) {
		result = "" + parseInt(theTime2) + "小时" + result;
	}
	return result;
}