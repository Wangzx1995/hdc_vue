import i18n from "@/i18n/i18n.js";

export default {
    uploadMethodList: [
        {
            // label: "立即上传",
            label: i18n.t("devLog.uploadNow"),
            value: 0,
        },
        {
            // label: "持续上传",
            label: i18n.t("devLog.continuouslyUpload"),
            value: 1,
        },
        {
            // label: "实时上传",
            label: i18n.t("devLog.realTimeUpload"),
            value: 2,
        },
    ],
    uploadTypeList: [
        {
            // label: "按类型",
            label: i18n.t("devLog.byType"),
            value: 0,
        },
        // {
        //     label: "按地址",
        //     value: 1,
        // },
    ],
    logTypeList: [
        {
            // label: "操作日志",
            label: i18n.t("devLog.logTypeLabel1"),
            value: 1,
        },
        {
            // label: "GPS记录日志",
            label: i18n.t("devLog.logTypeLabel2"),
            value: 2,
        },
        {
            // label: "设备打印调试日志",
            label: i18n.t("devLog.logTypeLabel3"),
            value: 3,
        },
        {
            // label: "IPC打印日志",
            label: i18n.t("devLog.logTypeLabel4"),
            value: 4,
        },
        {
            // label: "smart硬盘信息",
            label: i18n.t("devLog.logTypeLabel5"),
            value: 5,
        },
    ],
};
