// AES加密算法
import CryptoJS from "crypto-js";
const keyStatic = '1grLx91U40VawzhR'
//随机生成指定数量的32进制key
export default {
    //创建密钥
    generatekey(num) {
        let library = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let key = "";
        for (let i = 0; i < num; i++) {
            let randomPoz = Math.floor(Math.random() * library.length);
            key += library.substring(randomPoz, randomPoz + 1);
        }
        return key;
    },
    //加密
    encrypt(word, keyStr) {
        if(!word) return "";
        // 判断是否存在keyStr，不存在就用默认的keyStr（注意：这个keyStr必需要前后端统一，不然双方加密解密后会不相同。调用generatekey方法生成）
        keyStr = keyStr ? keyStr : keyStatic;
        let key = CryptoJS.enc.Utf8.parse(keyStr);
        let srcs = CryptoJS.enc.Utf8.parse(word);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    },
    //解密
    decrypt(word, keyStr) {
        if(!word) return "";
        keyStr = keyStr ? keyStr : keyStatic;
        let key = CryptoJS.enc.Utf8.parse(keyStr);
        let decrypt = CryptoJS.AES.decrypt(word, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    }
};