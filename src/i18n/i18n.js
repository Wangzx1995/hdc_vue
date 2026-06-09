import Vue from "vue";
import locale from "element-ui/lib/locale";
import VueI18n from "vue-i18n";
import messages from "./langs";
Vue.use(VueI18n);
const DEFAULT_LANG = "zh-CN";
//从localStorage获取语言选择。
const i18n = new VueI18n({
    // console.log(navigator.language);
    locale: DEFAULT_LANG, //初始未选择默认 cn 中文, zh-Cn 简体中文, zh-SG 新加坡中文,由于中文多样化,匹配zh
    messages,
    silentTranslationWarn: true,
});
locale.i18n((key, value) => i18n.t(key, value)); //兼容element
export const setLanguage = (lang) => {
    if (lang === undefined) {
        lang = window.localStorage.getItem("omsLanguage");
        //如果localStorage 没有存储,获取浏览器语言
        if (lang === null) {
            lang = navigator.language; //获取浏览器语言
            //判断是否是英语,校验是否包含en
            if (lang.indexOf("en") > -1) {
                lang = "en-US";
            }

            if (messages[lang] === undefined) {
                //如果浏览器语言不在语言包中,默认展示中文
                lang = DEFAULT_LANG;
            }
        }
    }
    window.localStorage.setItem("omsLanguage", lang);
    i18n.locale = lang;
};
setLanguage();
export default i18n;
