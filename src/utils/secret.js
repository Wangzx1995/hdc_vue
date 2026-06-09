/**
 * 工具类
 */
import CryptoJS from "crypto-js";
export default {
    //加密
    encrypt(data) {
        data = data ? data : "1";
        var key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");
        var encrypted = CryptoJS.AES.encrypt(data, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        });
        let encryptedData = encrypted.toString();
        // 对编码的字符串转化base64
        return encryptedData;
    },
    dEncrypt(word) {
        // data = data ? data : '1';
        // var key = CryptoJS.enc.Utf8.parse('1grLx91U40VawzhR');
        // var iv = CryptoJS.enc.Utf8.parse('1grLx91U40VawzhR');
        // var decrypted = CryptoJS.AES.decrypt(data, key, {iv:iv,mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
        // return decrypted.toString(CryptoJS.enc.Utf8);
        if (!word) return "";
        let keyStr = "abcdefgabcdefg12";
        let key = CryptoJS.enc.Utf8.parse(keyStr);
        let decrypt = CryptoJS.AES.decrypt(word, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        });
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    },
    //,
    //解密
    // decrypt(word, keyStr){
    //     keyStr = keyStr ? keyStr : '1';
    //     var key = CryptoJS.enc.Utf8.parse(keyStr);
    //     var decrypt = CryptoJS.AES.decrypt(word, key, {iv:'0000000000000000',mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    //     return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    // }
};
