/**
 * Created by jiachenpan on 16/11/18.
 */

/* 是否是公司邮箱*/
export function isHikEmail(str) {
    const reg = /^[a-z0-9](?:[-_.+]?[a-z0-9]+)*@hikauto\.com$/i;
    return reg.test(str.trim());
}

/* 合法uri*/
export function validateURL(textval) {
    const urlregex =
        /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|(:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|dav|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    const urlG = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]))*/g;
    return urlG.test(textval);
}
/* 合法uri*/
export function validateFTP(textval) {
    const urlG = /^ftp:\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]))*/g;
    return urlG.test(textval);
}
/* 合法Ip*/
export function validateIP(textval) {
    const ipregex =
        /(?:(?:(?:25[0-5]|2[0-4]\d|(?:(?:1\d{2})|(?:[1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|(?:(?:1\d{2})|(?:[1-9]?\d))))/;
    return ipregex.test(textval);
}
/**
 * 身份证号校验
 * @param idCardNo
 * @returns {boolean}
 */
export function validateVinIdCardNo(idCardNo) {
    const idCardNoRegex =
        /^([1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)$/;
    return idCardNoRegex.test(idCardNo);
}

/**
 * VIN校验
 * @param vin
 * @returns {boolean}
 */
export function validateVin(vin) {
    const vinRegex = /^[a-zA-Z0-9]{17}$/;
    return vinRegex.test(vin);
}
/**
 * 车牌号校验
 * @param vin
 * @returns {boolean}
 */
export function validatePlateNum(plateNum) {
    const vinRegex =
        /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领甬A-Z]{1}[港A-Z]{1}[D|F]{1}[A-Z0-9]{5})$|^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领甬A-Z]{1}[港A-Z]{1}[A-Z0-9]{5}[D|F]{1})$|^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领甬A-Z]{1}[港A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$|^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领甬]{1}[A-Z]{1}[A-Z0-9]{6})$/;
    // const vinRegex = /^([京津沪渝冀豫云辽⿊湘皖鲁新苏浙赣鄂桂⽢晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽⿊湘皖鲁新苏浙赣鄂桂⽢晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/;
    return vinRegex.test(plateNum);
}
export function validatePlateNum2(plateNum) {
    const vinRegex =
        /^([甬]{1}[港]{1}[D|F]{1}[A-Z0-9]{5})$|^([甬]{1}[港]{1}[A-Z0-9]{5}[D|F]{1})$|^([甬]{1}[港]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/;
    return vinRegex.test(plateNum);
}
/**
 * 中英文和数字
 * @param str
 * @returns {boolean}
 */
export function validateExpectSpecial(str) {
    const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
    return reg.test(str);
}
/**
 * 校验特殊字符
 * @param str
 * @returns {boolean}
 */
export function validateSpecial(str) {
    const reg = /[\/:*?"<|'&%>]/;
    return reg.test(str);
}

/**
 * 英文和数字
 * @param str
 * @returns {boolean}
 */
export function validateNumberAndEnglish(str) {
    const reg = /^[A-Za-z0-9]+$/;
    return reg.test(str);
}

/**
 * 英文和数字
 * @param str
 * @returns {boolean}
 */
export function validateNumberAndEnglishStartWithEnglish(str) {
    // const reg = /^[a-zA-Z][A-Za-z0-9\_\@]+$/;
    const reg = /^[A-Za-z0-9\_\@]+$/;
    return reg.test(str);
}
/**
 * 不允许出现中文字符
 * @param str
 * @returns {boolean}
 */
export function validateNoChinese(str) {
    const reg = /[\u4E00-\u9FA5]/g;
    return reg.test(str);
}
/**
 * 英文数字和下划线
 * @param str
 * @returns {boolean}
 */
export function validateProjectCode(str) {
    const reg = /^[A-Za-z0-9_]+$/;
    return reg.test(str);
}
/**
 * 英文数字点'@'和下划线
 * @param str
 * @returns {boolean}
 */
export function validateTempSpecialNum(str) {
    const reg = /[^\w\.\:\/]/gi;
    return reg.test(str);
}
/**
 * 域名
 * @param str
 * @returns {boolean}
 */
export function domainName(str) {
    // const reg = /^(?=^.{3,255}$)(a-zA-ZQ-9)(-a-zA-Z0-9){0,62}(\.(a-zA-ZQ-9)(-a-zA-Z0-9){0,62})+$/;
    const reg = /[^\w\.\:\/\-]/gi;
    return reg.test(str);
}
/**
 * 中英文和数字和下划线
 * @param str
 * @returns {boolean}
 */
export function validateTempSpecial(str) {
    const reg = /^[A-Za-z0-9\_\-\.\u4e00-\u9fa5]+$/;
    return reg.test(str);
}
/**
 * 版本号校验
 * @param vin
 * @returns {boolean}
 */
export function validateVersion(version) {
    const vinRegex = /^V[1-9]{1}[0-9]*\.[0-9]+\.[0-9]+$/;
    if (vinRegex.test(version)) {
        const vArr = version.split("V")[1].split(".");
        if (vArr[0] > 255) {
            return false;
        }
        if (vArr[1] > 255) {
            return false;
        }
        if (vArr[2] > 255) {
            return false;
        }
        return true;
    }
    return false;
}

/**
 * 版本号对比
 *  @param versionOcx , versionText, 例如V1.0.0
 * 	@returns versionOcx > versionText,返回1 ,versionOcx == versionText,返回0,versionOcx < versionText,返回-1
 */
export function compareVersion(versionOcx, versionText) {
    let result = null;
    if (versionOcx && versionText) {
        let vOcxArr = versionOcx.split("V")[1].split("."); //截取出V后的数字,返回数组
        let vTextArr = versionText.split("V")[1].split(".");
        let minL = Math.min(vOcxArr.length, vTextArr.length); //返回版本号长度最小的,作为循环次数

        for (let i = 0; i < minL; i++) {
            if (vOcxArr[i] > vTextArr[i]) {
                result = 1;
                break;
            } else if (vOcxArr[i] < vTextArr[i]) {
                result = -1;
                break;
            } else if (vOcxArr[i] === vTextArr[i]) {
                //相等,判断第二位
                result = 0;
            }
        }
        return result;
    } else {
        result = -1;
        return result;
    }
}
/**
 * Build号校验
 * @param build
 * @returns {boolean}
 */
export function validateBuild(build) {
    const buildRegex = /^build([0-9]{6}|[0-9]{8})$/;
    if (buildRegex.test(build)) {
        return true;
    }
    return false;
}

/**
 * 版本号+Build号校验
 * @param versionBuild
 * @returns {boolean}
 */
export function validateVersionBuild(versionBuild) {
    const versionBuildRegex =
        /^V[1-9]{1}[0-9]*\.[0-9]+\.[0-9]+ build([0-9]{6}|[0-9]{6})$/;
    if (versionBuildRegex.test(versionBuild)) {
        return true;
    }
    return false;
}
// 7位版本号
export function sevenId(val) {
    const terminal = /^[A-Z0-9]{7}$/;
    if (terminal.test(val)) {
        return true;
    }
    return false;
}
// 30位版本号
export function thirtynId(val) {
    const terminal = /^[A-Z0-9]+$/;
    if (terminal.test(val)) {
        return true;
    }
    return false;
}
// 十位BCD码
export function tenBcd(val) {
    const terminal = /^[0-9]+$/;
    if (terminal.test(val)) {
        return true;
    }
    return false;
}
/**
 * 手机号校验
 * @param phoneNo
 * @returns {boolean}
 */
export function validatePhoneNo(phoneNo) {
    const vinRegex = /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
    const regex = /^((13|14|15|16|17|18|19)[0-9]{1}\d{10})$/;
    return vinRegex.test(phoneNo) || regex.test(phoneNo);
}
export function validateMailboxSuffix(mail) {
    const vinRegex = /^@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/;
    return vinRegex.test(mail);
}
/**
 * 固定电话校验
 * @param phoneNo
 * @returns {boolean}
 */
export function validateFixedTelephone(phoneNo) {
    const vinRegex = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
    return vinRegex.test(phoneNo);
}
/**
 * 手机号码运营商判断
 * @param phoneNo 1移动 2联通 3电信 0 未知
 * @returns {boolean}
 */
export function validateIsChinaMobile(phoneNo) {
    const phoneNo1 = phoneNo.substring(0, 3);
    const phoneNo2 = phoneNo.substring(0, 4);
    const phoneNo3 = phoneNo.substring(0, 5);
    const isChinaMobile =
        /^134|135|136|137|138|139|150|151|152|158|159|182|183|184|157|187|188|147|178|147|198[0-9]{1}|148[0-9]{1}|1440[0-9]{1}$/;
    const isChinaUniom =
        /^130|131|132|155|156|185|186|145|166[0-9]{1}|146[0-9]{1}$/;
    const isChinaTelcom =
        /^133|153|189|180|181|149|1740[1-5]{1}|199[0-9]{1}|1410[0-9]{1}$/;
    if (
        isChinaMobile.test(phoneNo1) ||
        isChinaMobile.test(phoneNo2) ||
        isChinaMobile.test(phoneNo3)
    ) {
        return 1;
    } else if (
        isChinaUniom.test(phoneNo1) ||
        isChinaUniom.test(phoneNo2) ||
        isChinaUniom.test(phoneNo3)
    ) {
        return 2;
    } else if (
        isChinaTelcom.test(phoneNo1) ||
        isChinaTelcom.test(phoneNo2) ||
        isChinaTelcom.test(phoneNo3)
    ) {
        return 3;
    }
    return 0;
}
/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
}

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
}

const dangerPwd = [
    "admin@123",
    "P@ssw0rd",
    "1qazxsw2",
    "Password123",
    "qwe123!@#",
    "admin123",
    "q1w2e3r4",
    "Huawei@123",
    "12345qwert!@#$%",
    "1qaz#EDC5tgb",
    "root123!@#",
    "abcd123456",
    "root@123",
    "123qwe!@#",
    "123qweasd",
    "welcome@123",
    "1q2w3e4r",
    "system123",
    "!@#$qwerASDF",
    "4rfv$RFV",
    "cyidc!@#",
    "huawei@123",
    "1qaz2wsx",
    "Admin@123",
    "Administrator",
    "Admin321",
    "Linux123",
    "root2012",
    "root@2012",
    "admin@2012",
    "root@root",
    "root@root",
    "iptv@123",
    "admin1234",
    "admin12345",
    "admin888",
    "admin@123456",
    "admin@321",
    "admin_!@#",
    "admin_!@#$",
    "admin_1234",
    "adminsec1234",
    "Abc123",
    "hik12345+",
];
// 函数返回密码的强度级别(-1：太短；0：风险；1：弱；2：中；3：强).风险密码暂无需求
export function checkStrong(sPW, name) {
    if (sPW.length < 8) {
        return -1; // 密码太短
    } else if (isDangerPwd(sPW, name)) {
        // 判断是否风险密码
        return 0;
    } else {
        let Modes = 0;
        for (let i = 0; i < sPW.length; i++) {
            Modes |= CharMode(sPW.charCodeAt(i)); // 判断字符类型
        }
        // 判断是否为（数字+小写字母）或（数字+大写字母）
        if (Modes == 3 || Modes == 5) {
            return 1;
        } else {
            const modeNum = bitTotal(Modes); // 计算出当前密码当中一共有多少种模式
            switch (modeNum) {
                case 1:
                    return 1;
                case 2:
                    return 2;
                case 3:
                    return 3;
                default:
                    return 3;
            }
        }
    }
}

/** 必须包含数字 中英文三种 */
export function checkEnglishNumberAll(sPW) {
    let Modes = 0;
    for (let i = 0; i < sPW.length; i++) {
        Modes |= CharMode(sPW.charCodeAt(i)); // 判断字符类型
    }
    // 判断是否为（数字+小写字母）或（数字+大写字母）
    if (Modes == 3 || Modes == 5) {
        return 1;
    } else {
        const modeNum = bitTotal(Modes); // 计算出当前密码当中一共有多少种模式
        switch (modeNum) {
            case 1:
                return 1;
            case 2:
                return 2;
            case 3:
                return 3;
            default:
                return 3;
        }
    }
}

/* 英文、数字*/
export function validateEnglishNumber(str) {
    const reg = /^[A-Za-z0-9]+$/;
    return reg.test(str);
}
/* 数字*/
export function validateNumber(str) {
    const reg = /^[0-9]+$/;
    return reg.test(str);
}
/* 整数和小数 */
export function validateNumberAndDecimals(str) {
    const reg = /^\d+(\.\d+)?$/;
    return reg.test(str);
}
/* 整数*/
export function validateNum(str) {
    const reg = /(^[1-9]([0-9]*)$|^[0-9]$)/;
    return reg.test(str);
}
export function validateNumberOne(str) {
    const reg = /(^[1-9]([0-9]*)$|^[0-9]$)|(^[0-9]{1,2}[\.]{1}[0-9]{1}$)/;
    return reg.test(str);
}
//只允许输入数字、字母、特殊字符!@#$%^&*()+-`~\|{}[]:;"',<>./?=
export function validateNumLetterSpecial(str) {
    const reg = /^[0-9a-zA-Z!@#$%^&*()+\-_`~\\|{}\[\]:;"',<>./?=]+$/;
    return reg.test(str);
}
// 验证是否为风险密码
function isDangerPwd(sPW, name) {
    // 风险密码
    for (let i = 0; i < dangerPwd.length; i++) {
        if (sPW == dangerPwd[i]) return true;
    }
    // 密码只有一种字符
    let Modes = 0;
    for (let i = 0; i < sPW.length; i++) {
        Modes |= CharMode(sPW.charCodeAt(i));
    }
    if (bitTotal(Modes) == 1) return true;
    // 密码为用户名或用户名倒写
    if (!(name == null || name == "")) {
        if (name == sPW || name.split("").reverse().join("") == sPW) {
            return true;
        }
    }
    return false;
}
/**
 * 验证密码强度和判断风险密码
 * CharMode函数 测试某个字符是属于哪一类.
 * bitTotal计算出当前密码当中一共有多少种模式
 * checkStrong函数返回密码的强度级别(0：太短；1：风险；2：弱；3：中；4：强)
 * isDangerPwd验证是否为风险密码
 */
// 测试某个字符是属于哪一类
function CharMode(iN) {
    if (iN >= 48 && iN <= 57) {
        // 数字
        return 1;
    }
    if (iN >= 65 && iN <= 90) {
        // 大写
        return 2;
    }
    if (iN >= 97 && iN <= 122) {
        // 小写
        return 4;
    } else {
        return 8;
    } // 特殊字符
}
// 计算出当前密码当中一共有多少种模式
function bitTotal(num) {
    let modes = 0;
    for (let i = 0; i < 4; i++) {
        if (num & 1) {
            modes++;
        }
        num >>>= 1;
    }
    return modes;
}
