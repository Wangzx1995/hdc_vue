import enumerationJSON from "../views/protocolConfiguration/components/configuration/enumerationJSON/enumeration.json";
import { validateNumber } from "@/utils/validate";
export default {
    // inject: ["formType"],
    props: {
        newForm: {
            type: Object,
            default: () => {},
        },
        oldForm: {
            type: Object,
            default: () => {},
        },
        deviceInfo: {
            type: Object,
            default: () => {},
        },
        capability: {
            type: Object,
            default: () => {},
        },
        enumeration: {
            type: Object,
            default: () => {},
        },
        tabPosition: {
            type: String,
        },
        ehomeParams: {
            type: Array,
            default: () => [],
        },
        isTemplateBol: {
            type: Boolean,
            default: false,
        },
    },
    activated() {
        this.labelWidthResize();
    },
    mounted() {
        window.addEventListener("resize", this.labelWidthResize);
        this.$nextTick(() => {
            this.labelWidthResize();
        });
    },
    data() {
        return {
            validateNumber,
            enumerationJSON,
            // newForm: {},
            // oldForm: {},
            deviceId: this.$route.query.deviceId,
            minLabelWidth: 200,
            labelWidth: null,
            isTemplate: this.isTemplateBol
                ? this.isTemplateBol
                : this.$route.query.isTemplate === "true"
                ? true
                : false,
            collapseChangeBtn: false,
            IsTemplateParamsGet: true,
        };
    },
    computed: {},
    watch: {
        newForm: {
            handler(val) {
                this.$emit("newFormChange", val);
            },
            deep: true,
        },
    },
    methods: {
        getUploadEventPlatform(val) {
            let valArr = val.reduce((prev, cur) => {
                return prev.concat(
                    Number(cur) - 1 ===
                        Number(this.capability.network.isHikPlatform)
                        ? "海康云平台"
                        : `第${cur}中心`
                );
            }, []);
            if (valArr.length) {
                return valArr.join("，");
            } else {
                return "空";
            }
        },
        getLinkChannel(val) {
            let valArr = val.reduce((prev, cur) => {
                return prev.concat(`通道${cur}`);
            }, []);
            if (valArr.length) {
                return valArr.join("，");
            } else {
                return "空";
            }
        },
        getJsonLabel(obj, val) {
            let attribute = this.enumerationJSON[obj].find(
                (e) => e.value === val
            );
            if (attribute) {
                return attribute.label;
            } else {
                return null;
            }
        },
        getLabelSelfArr(arr, val) {
            let valArr = val.reduce((prev, cur) => {
                let attribute = arr.find((e) => e.value === Number(cur));
                if (attribute) {
                    return prev.concat(attribute.label);
                } else {
                    return prev;
                }
            }, []);
            if (valArr.length) {
                return valArr.join("，");
            } else {
                return "";
            }
        },
        resetFormItem(val) {
            if (val === "tab2") {
                if (this.newForm["param8"]) {
                    this.newForm["param8"] = JSON.parse(
                        JSON.stringify(this.oldForm["param8"])
                    );
                }
                if (this.newForm["param10"]) {
                    this.newForm["param10"] = JSON.parse(
                        JSON.stringify(this.oldForm["param10"])
                    );
                }
                if (
                    this.capability.network &&
                    this.capability.network.platformInfo
                ) {
                    let platformList =
                        this.capability.network.platformInfo.filter(
                            (item) => item.platformType === 1
                        );
                    platformList.forEach((item, index) => {
                        if (this.newForm[`param705_${index}`]) {
                            if (item.serial) {
                                this.newForm[`param705_${index}`].serial =
                                    JSON.parse(
                                        JSON.stringify(
                                            this.oldForm[`param705_${index}`]
                                                .serial
                                        )
                                    );
                            }
                            if (item.id) {
                                this.newForm[`param705_${index}`].id =
                                    JSON.parse(
                                        JSON.stringify(
                                            this.oldForm[`param705_${index}`].id
                                        )
                                    );
                            }
                        }
                    });
                }
            } else if (val === "tab3") {
                // this.newForm = JSON.parse(JSON.stringify(this.oldForm));
            }
        },
        deleteFormItem(item) {
            if (item.param.indexOf("param950") > -1) {
                this.newForm[item.param] = JSON.parse(
                    JSON.stringify(this.oldForm[item.param])
                );
                return;
            }
            let paramArr = item.data.split("&")[0].split(".");

            if (paramArr.length === 2) {
                if (item.param.indexOf("param2205") > -1) {
                    this.newForm[paramArr[0]][paramArr[1]] =
                        this.oldForm[paramArr[0]][paramArr[1]];
                } else {
                    this.newForm[item.param][paramArr[1]] =
                        this.oldForm[item.param][paramArr[1]];
                }
            } else if (paramArr.length === 3) {
                this.newForm[item.param][paramArr[1]][paramArr[2]] =
                    this.oldForm[item.param][paramArr[1]][paramArr[2]];
            } else if (paramArr.length === 4) {
                this.newForm[item.param][paramArr[1]][paramArr[2]][
                    paramArr[3]
                ] =
                    this.oldForm[item.param][paramArr[1]][paramArr[2]][
                        paramArr[3]
                    ];
            } else if (paramArr.length === 5) {
                this.newForm[item.param][paramArr[1]][paramArr[2]][paramArr[3]][
                    paramArr[4]
                ] =
                    this.oldForm[item.param][paramArr[1]][paramArr[2]][
                        paramArr[3]
                    ][paramArr[4]];
            } else if (paramArr.length === 6) {
                this.newForm[item.param][paramArr[1]][paramArr[2]][paramArr[3]][
                    paramArr[4]
                ][paramArr[5]] =
                    this.oldForm[item.param][paramArr[1]][paramArr[2]][
                        paramArr[3]
                    ][paramArr[4]][paramArr[5]];
            } else if (paramArr[0].indexOf("6004") > -1) {
                this.newForm[item.param] = this.oldForm[item.param];
                // params[item.param] = {
                //     ...item.value,
                //     algorithmType: Number(
                //         item.param.split("_")[1]
                //     ),
                //     sentivityType: Number(
                //         item.param.split("_")[2]
                //     ),
                // };
            }
        },
        getEnumerationValue(arr, name) {
            if (!arr || !arr.length) {
                return [];
            }
            return arr.reduce((prev, cur) => {
                let obj = this.enumerationJSON[name].find(
                    (e) => e.value === cur
                );
                if (obj) {
                    return prev.concat(
                        this.enumerationJSON[name].find((e) => e.value === cur)
                    );
                } else {
                    return prev;
                }
            }, []);
        },
        getLabelSelf(arr, val) {
            let attribute = arr.find((e) => e.value === val);
            if (attribute) {
                return attribute.label;
            } else {
                return null;
            }
        },
        getLabel(obj, val) {
            if (!this.enumeration[obj]) {
                return null;
            }
            let attribute = this.enumeration[obj].find((e) => e.value === val);
            if (attribute) {
                return attribute.label;
            } else {
                return null;
            }
        },
        labelWidthResize() {
            if (!this.$refs.form || this.collapseChangeBtn) {
                return;
            }
            let paddingWidth =
                this.componentsName === "platformParams" ? 32 : 0;
            let boxWidth = this.$refs.form.$el.offsetWidth - 8 - paddingWidth;
            let num = Math.floor(boxWidth / (195 + this.minLabelWidth));
            this.labelWidth = boxWidth / num - 195;
        },
        changeMinToSec(t) {
            if (t < 0) {
                return "";
            }
            t > 1440 && (t -= 1440);
            var e = t % 60;
            e < 10 && (e = "0" + e);
            var r = Math.floor(t / 60);
            return r < 10 && (r = "0" + r), r + ":" + e;
        },
        getEHomeConfig(msgId, param = "", capability) {
            if (!this.isTemplate) {
                return new Promise((resolve, reject) => {
                    this.$api
                        .getEHomeConfig({
                            deviceId: this.deviceId,
                            param: param,
                            msgId: msgId,
                        })
                        .then((res) => {
                            if (res && res.data && res.data.param) {
                                let formValue = JSON.parse(res.data.param);
                                switch (msgId) {
                                    case 2205:
                                        let obj2205 = {};
                                        let objType = "";
                                        switch (formValue.type) {
                                            case "volume":
                                            case "voiceCallOutput":
                                            case "audioOutput":
                                            case "alarmFollowSystem":
                                                objType = "audio";
                                                break;
                                            case "reverse":
                                                objType = "reverse";
                                                break;
                                            case "sleepReportTimeInterval":
                                                objType =
                                                    "sleepReportTimeInterval";
                                                break;
                                            case "horizonVanishLine":
                                                objType = "horizonVanishLine";
                                                break;
                                            case "verticalVanishLine":
                                                objType = "verticalVanishLine";
                                                break;
                                        }
                                        obj2205 = {};
                                        obj2205[formValue.type] = Number(
                                            formValue.value
                                        );
                                        obj2205["chanNo"] = formValue.chanNo;
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}_${formValue.chanNo}_${objType}`,
                                            {
                                                ...this.newForm[
                                                    `param${msgId}_${formValue.chanNo}_${objType}`
                                                ],
                                                ...obj2205,
                                            }
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}_${formValue.chanNo}_${objType}`,
                                            {
                                                ...this.oldForm[
                                                    `param${msgId}_${formValue.chanNo}_${objType}`
                                                ],
                                                ...obj2205,
                                            }
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}_${formValue.chanNo}_${objType}`,
                                            {
                                                ...this.newForm[
                                                    `param${msgId}_${formValue.chanNo}_${objType}`
                                                ],
                                                ...obj2205,
                                            }
                                        );
                                        break;
                                    case 703:
                                    case 705:
                                        formValue.platformOrder =
                                            param.platformOrder;
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}_${param.platformOrder}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}_${param.platformOrder}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}_${param.platformOrder}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                    case 950:
                                        delete this.newForm[
                                            `param${msgId}_${param.type}`
                                        ];
                                        delete this.oldForm[
                                            `param${msgId}_${param.type}`
                                        ];
                                        setTimeout(() => {
                                            this.$set(
                                                this.newForm,
                                                `param${msgId}_${param.type}`,
                                                JSON.parse(
                                                    JSON.stringify(formValue)
                                                )
                                            );
                                            this.$set(
                                                this.oldForm,
                                                `param${msgId}_${param.type}`,
                                                JSON.parse(
                                                    JSON.stringify(formValue)
                                                )
                                            );
                                            this.$emit(
                                                "formDataChange",
                                                `param${msgId}_${param.type}`,
                                                JSON.parse(
                                                    JSON.stringify(formValue)
                                                )
                                            );
                                            this.showEventDisplayList();
                                        }, 100);
                                        break;
                                    case 948:
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}_${param.type}_${param.chanNo}`,
                                            JSON.parse(
                                                JSON.stringify(
                                                    formValue.list[0]
                                                )
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}_${param.type}_${param.chanNo}`,
                                            JSON.parse(
                                                JSON.stringify(
                                                    formValue.list[0]
                                                )
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}_${param.type}_${param.chanNo}`,
                                            JSON.parse(
                                                JSON.stringify(
                                                    formValue.list[0]
                                                )
                                            )
                                        );
                                        break;
                                    case 971:
                                        if (param.type) {
                                            this.$set(
                                                this.newForm,
                                                `param${msgId}_${param.type}_${param.chanNo}`,
                                                JSON.parse(
                                                    JSON.stringify({
                                                        ...formValue,
                                                        type: param.type,
                                                        chanNo: param.chanNo,
                                                    })
                                                )
                                            );
                                            this.$set(
                                                this.oldForm,
                                                `param${msgId}_${param.type}_${param.chanNo}`,
                                                JSON.parse(
                                                    JSON.stringify({
                                                        ...formValue,
                                                        type: param.type,
                                                        chanNo: param.chanNo,
                                                    })
                                                )
                                            );
                                            this.$emit(
                                                "formDataChange",
                                                `param${msgId}_${param.type}_${param.chanNo}`,
                                                JSON.parse(
                                                    JSON.stringify({
                                                        ...formValue,
                                                        type: param.type,
                                                        chanNo: param.chanNo,
                                                    })
                                                )
                                            );
                                        } else {
                                            this.$set(
                                                this.newForm,
                                                `param${msgId}`,
                                                JSON.parse(
                                                    JSON.stringify(formValue)
                                                )
                                            );
                                            this.$set(
                                                this.oldForm,
                                                `param${msgId}`,
                                                JSON.parse(
                                                    JSON.stringify(formValue)
                                                )
                                            );
                                            this.$emit(
                                                "formDataChange",
                                                `param${msgId}`,
                                                JSON.parse(
                                                    JSON.stringify(formValue)
                                                )
                                            );
                                        }
                                        break;
                                    case 901:
                                    case 905:
                                    case 920:
                                    case 938:
                                    case 954:
                                    case 989:
                                    case 983:
                                    case 991:
                                    case 6016:
                                        if (param.type !== "") {
                                            const chanNoObj = this.capability[
                                                `intelliDrive_${capability}`
                                            ].find(
                                                (obj) =>
                                                    obj.chanNo === param.chanNo
                                            );
                                            const typeObj = chanNoObj.info.find(
                                                (obj) => obj.type === param.type
                                            );
                                            if (
                                                typeObj &&
                                                typeObj.sensitivityList &&
                                                typeObj.sensitivityList
                                                    .length &&
                                                !typeObj.newSensitivity &&
                                                (capability === "WHD" ||
                                                    (capability === "DSM" &&
                                                        (param.type === 0 ||
                                                            param.type === 7 ||
                                                            param.type === 34 ||
                                                            param.type === 35 ||
                                                            param.type === 36 ||
                                                            param.type === 37 ||
                                                            param.type === 38 ||
                                                            param.type === 39 ||
                                                            param.type === 2 ||
                                                            param.type === 16 ||
                                                            param.type === 3 ||
                                                            param.type === 8 ||
                                                            param.type === 40 ||
                                                            param.type === 1 ||
                                                            param.type === 15 ||
                                                            param.type === 6 ||
                                                            param.type === 19 ||
                                                            param.type === 12 ||
                                                            param.type === 23 ||
                                                            param.type === 5 ||
                                                            param.type === 18 ||
                                                            param.type === 26 ||
                                                            param.type === 27)))
                                            ) {
                                                if (
                                                    !typeObj.sensitivityList.find(
                                                        (e) =>
                                                            e.value ===
                                                            formValue.info[0]
                                                                .sensitivity
                                                    )
                                                ) {
                                                    typeObj.sensitivityList.push(
                                                        {
                                                            value: formValue
                                                                .info[0]
                                                                .sensitivity,
                                                            label: `自定义值(${formValue.info[0].sensitivity})`,
                                                        }
                                                    );
                                                }
                                            } else if (
                                                capability === "VSD" ||
                                                (capability === "DSM" &&
                                                    typeObj.newSensitivity &&
                                                    typeObj.newSensitivity
                                                        .length)
                                            ) {
                                            } else {
                                                if (
                                                    typeObj.sensitivity &&
                                                    typeObj.sensitivityList &&
                                                    typeObj.sensitivityList
                                                        .length &&
                                                    (typeObj.sensitivity.min !==
                                                        1 ||
                                                        typeObj.sensitivity
                                                            .max !== 3)
                                                ) {
                                                    if (
                                                        formValue.info[0]
                                                            .sensitivity <
                                                        typeObj.sensitivity
                                                            .min +
                                                            parseInt(
                                                                typeObj.sensitivityRange /
                                                                    3
                                                            )
                                                    ) {
                                                        formValue.info[0].sensitivity =
                                                            typeObj.sensitivityList[0].value;
                                                    } else if (
                                                        formValue.info[0]
                                                            .sensitivity >
                                                        typeObj.sensitivity
                                                            .min +
                                                            parseInt(
                                                                (typeObj.sensitivityRange *
                                                                    2) /
                                                                    3
                                                            )
                                                    ) {
                                                        formValue.info[0].sensitivity =
                                                            typeObj.sensitivityList[2].value;
                                                    } else {
                                                        formValue.info[0].sensitivity =
                                                            typeObj.sensitivityList[1].value;
                                                    }
                                                }
                                            }

                                            if (typeObj.confidence) {
                                                if (
                                                    formValue.info[0]
                                                        .confidence <
                                                    typeObj.confidence.min +
                                                        parseInt(
                                                            typeObj.confidenceRange /
                                                                3
                                                        )
                                                ) {
                                                    formValue.info[0].confidence =
                                                        typeObj.confidenceList[0].value;
                                                } else if (
                                                    formValue.info[0]
                                                        .confidence >
                                                    typeObj.confidence.min +
                                                        parseInt(
                                                            (typeObj.confidenceRange *
                                                                2) /
                                                                3
                                                        )
                                                ) {
                                                    formValue.info[0].confidence =
                                                        typeObj.confidenceList[2].value;
                                                } else {
                                                    formValue.info[0].confidence =
                                                        typeObj.confidenceList[1].value;
                                                }
                                            }
                                        }
                                        formValue.chanNo = param.chanNo;
                                        if (capability === "BSD") {
                                            formValue.cameraPos =
                                                formValue.cameraPosition;
                                        }
                                        if (capability === "ADAS") {
                                            if (
                                                formValue.info[0].hasOwnProperty(
                                                    "distanceBeyongLane"
                                                )
                                            ) {
                                                formValue.info[0].distanceBeyongLane =
                                                    formValue.info[0]
                                                        .distanceBeyongLane /
                                                    1000;
                                            }
                                            if (
                                                formValue.info[0].hasOwnProperty(
                                                    "nearCarDistance"
                                                )
                                            ) {
                                                formValue.info[0].nearCarDistance =
                                                    formValue.info[0]
                                                        .nearCarDistance / 1000;
                                            }
                                            if (
                                                formValue.info[0].hasOwnProperty(
                                                    "collisionDistance"
                                                )
                                            ) {
                                                formValue.info[0].collisionDistance =
                                                    formValue.info[0]
                                                        .collisionDistance /
                                                    1000;
                                            }
                                        }
                                        if (
                                            !formValue.info[0].hasOwnProperty(
                                                "snapshot"
                                            )
                                        ) {
                                            formValue.info[0].snapshot = {};
                                        }
                                        if (
                                            !formValue.info[0].hasOwnProperty(
                                                "clip"
                                            )
                                        ) {
                                            formValue.info[0].clip = {};
                                        }
                                        this.$set(
                                            this.newForm,
                                            param.type === ""
                                                ? `param${msgId}_${param.chanNo}`
                                                : `param${msgId}_${param.chanNo}_${param.type}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            param.type === ""
                                                ? `param${msgId}_${param.chanNo}`
                                                : `param${msgId}_${param.chanNo}_${param.type}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            param.type === ""
                                                ? `param${msgId}_${param.chanNo}`
                                                : `param${msgId}_${param.chanNo}_${param.type}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                    case 188:
                                        // formValue.chanNo = param.chanNo;
                                        // formValue.streamType = param.streamType;
                                        let newFormValue = {
                                            chanNo: param.chanNo,
                                            streamType: param.streamType,
                                        };
                                        for (let key of Object.keys(
                                            capability
                                        )) {
                                            if (formValue.hasOwnProperty(key)) {
                                                newFormValue[key] =
                                                    formValue[key];
                                            }
                                        }
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}_${param.chanNo}_${param.streamType}`,
                                            JSON.parse(
                                                JSON.stringify(newFormValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}_${param.chanNo}_${param.streamType}`,
                                            JSON.parse(
                                                JSON.stringify(newFormValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}_${param.chanNo}_${param.streamType}`,
                                            JSON.parse(
                                                JSON.stringify(newFormValue)
                                            )
                                        );
                                        break;
                                    case 2510:
                                        formValue.chanNo = param.chanNo;
                                        formValue.type = param.type;
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}_${param.chanNo}_${param.type}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}_${param.chanNo}_${param.type}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}_${param.chanNo}_${param.type}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                    case 715:
                                        formValue.platformOrder =
                                            param.platformOrder;
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                    case 1315:
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}_${param.gsensorTurnType}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}_${param.gsensorTurnType}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}_${param.gsensorTurnType}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                    case 1307:
                                        if (
                                            !formValue.hasOwnProperty(
                                                "showMask"
                                            )
                                        ) {
                                            formValue.showMask = [];
                                        }
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                    case 1311:
                                        if (
                                            !formValue.hasOwnProperty(
                                                "certType"
                                            )
                                        ) {
                                            formValue.certType = [];
                                        }
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                    case 1303:
                                        formValue.alarmList.forEach((item) => {
                                            if (
                                                !item.hasOwnProperty("enabled")
                                            ) {
                                                item.enabled = [];
                                            }
                                        });
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                    case 2222:
                                        if (
                                            formValue.hasOwnProperty(
                                                "mileageRadio"
                                            )
                                        ) {
                                            formValue.mileageRadio = Number(
                                                (
                                                    formValue.mileageRadio / 100
                                                ).toFixed(2)
                                            );
                                        }
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                    case 924:
                                        if (
                                            formValue.hasOwnProperty(
                                                "daylightStartTime"
                                            )
                                        ) {
                                            formValue.daylightStartTime =
                                                this.changeMinToSec(
                                                    formValue.daylightStartTime
                                                );
                                        }
                                        if (
                                            formValue.hasOwnProperty(
                                                "daylightEndTime"
                                            )
                                        ) {
                                            formValue.daylightEndTime =
                                                this.changeMinToSec(
                                                    formValue.daylightEndTime
                                                );
                                        }
                                        if (
                                            formValue.hasOwnProperty(
                                                "allDayDrivingTimeMax"
                                            )
                                        ) {
                                            formValue.allDayDrivingTimeMax =
                                                Number(
                                                    (
                                                        formValue.allDayDrivingTimeMax /
                                                        3600
                                                    ).toFixed(0)
                                                );
                                        }
                                        if (
                                            formValue.hasOwnProperty(
                                                "deltaWarnTime"
                                            )
                                        ) {
                                            formValue.deltaWarnTime = Number(
                                                (
                                                    formValue.deltaWarnTime / 60
                                                ).toFixed(0)
                                            );
                                        }
                                        if (
                                            formValue.hasOwnProperty(
                                                "daylightDrivingTimeMax"
                                            )
                                        ) {
                                            formValue.daylightDrivingTimeMax =
                                                Number(
                                                    (
                                                        formValue.daylightDrivingTimeMax /
                                                        60
                                                    ).toFixed(0)
                                                );
                                        }
                                        if (
                                            formValue.hasOwnProperty(
                                                "restTimeMin"
                                            )
                                        ) {
                                            formValue.restTimeMin = Number(
                                                (
                                                    formValue.restTimeMin / 60
                                                ).toFixed(0)
                                            );
                                        }
                                        if (
                                            formValue.hasOwnProperty(
                                                "nightDrivingTimeMax"
                                            )
                                        ) {
                                            formValue.nightDrivingTimeMax =
                                                Number(
                                                    (
                                                        formValue.nightDrivingTimeMax /
                                                        60
                                                    ).toFixed(0)
                                                );
                                        }
                                        if (
                                            formValue.hasOwnProperty(
                                                "nightDrivingRestTime"
                                            )
                                        ) {
                                            formValue.nightDrivingRestTime =
                                                Number(
                                                    (
                                                        formValue.nightDrivingRestTime /
                                                        60
                                                    ).toFixed(0)
                                                );
                                        }
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                    case 306:
                                        if (formValue.mtu === 0) {
                                            formValue.mtu = 1500;
                                        }
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                    case 36:
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}_${param.type}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}_${param.type}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}_${param.type}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                    case 903:
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}_${param.chanNo}`,
                                            JSON.parse(
                                                JSON.stringify({
                                                    ...formValue,
                                                    chanNo: param.chanNo,
                                                })
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}_${param.chanNo}`,
                                            JSON.parse(
                                                JSON.stringify({
                                                    ...formValue,
                                                    chanNo: param.chanNo,
                                                })
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}_${param.chanNo}`,
                                            JSON.parse(
                                                JSON.stringify({
                                                    ...formValue,
                                                    chanNo: param.chanNo,
                                                })
                                            )
                                        );
                                        break;
                                    case 2209:
                                        let obj2209 = {};
                                        obj2209[`${param.chanNo}`] = formValue;
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify({
                                                    ...this.newForm[
                                                        `param${msgId}`
                                                    ],
                                                    ...obj2209,
                                                })
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify({
                                                    ...this.oldForm[
                                                        `param${msgId}`
                                                    ],
                                                    ...obj2209,
                                                })
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify({
                                                    ...this.newForm[
                                                        `param${msgId}`
                                                    ],
                                                    ...obj2209,
                                                })
                                            )
                                        );
                                        break;
                                    case 8:
                                        if (formValue.plateType === 0) {
                                            formValue.plateType = "";
                                        }
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                    case 38:
                                        formValue.platformLockStatus.jtStandardList =
                                            formValue.platformLockStatus.jtStandard
                                                .filter(
                                                    (i) => i.lockStatus === 1
                                                )
                                                .reduce((prev, cur) => {
                                                    return prev.concat(
                                                        cur.index
                                                    );
                                                }, []);
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                    case 6004:
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}_${param.algorithmType}_${param.sentivityType}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}_${param.algorithmType}_${param.sentivityType}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}_${param.algorithmType}_${param.sentivityType}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                    case 993:
                                        if (
                                            formValue &&
                                            formValue.banTime &&
                                            formValue.banTime.length
                                        ) {
                                            formValue.banTime.forEach(
                                                (item) => {
                                                    if (
                                                        item.hasOwnProperty(
                                                            "advanceWarningTime"
                                                        )
                                                    ) {
                                                        item.advanceWarningTime =
                                                            item.advanceWarningTime /
                                                            60;
                                                    }
                                                    if (
                                                        item.hasOwnProperty(
                                                            "warningPeriod"
                                                        )
                                                    ) {
                                                        item.warningPeriod =
                                                            item.warningPeriod /
                                                            60;
                                                    }
                                                }
                                            );
                                        }

                                        this.$set(
                                            this.newForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                    default:
                                        this.$set(
                                            this.newForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$set(
                                            this.oldForm,
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        this.$emit(
                                            "formDataChange",
                                            `param${msgId}`,
                                            JSON.parse(
                                                JSON.stringify(formValue)
                                            )
                                        );
                                        break;
                                }
                                this.$forceUpdate();
                                this.$nextTick(() => {
                                    this.labelWidthResize();
                                });
                            } else {
                                // if (msgId === 6016) {
                                //     let formValue = {
                                //         enable: 1,
                                //         algorithmBrakeEnable:1,
                                //         mcuBrakeEnable:1,
                                //         info: [
                                //             {
                                //                 enable: 1,
                                //                 volume: 33,
                                //                 volumeEnable: 1,
                                //                 type: param.type,
                                //                 uploadEvent: 1,
                                //                 newSensitivity: 1,
                                //                 speed: 11,
                                //                 inhibitionTime: 55,
                                //                 snapshot: {
                                //                     upload: 1,
                                //                     linkChannel: [1, 2],
                                //                     number: 1,
                                //                     interval: 4,
                                //                 },
                                //                 clip: {
                                //                     upload: 1,
                                //                     perRecord: 2,
                                //                     afterRecord: 3,
                                //                 },
                                //             },
                                //         ],
                                //     };
                                //     if (
                                //         !formValue.info[0].hasOwnProperty(
                                //             "snapshot"
                                //         )
                                //     ) {
                                //         formValue.info[0].snapshot = {};
                                //     }
                                //     if (
                                //         !formValue.info[0].hasOwnProperty(
                                //             "clip"
                                //         )
                                //     ) {
                                //         formValue.info[0].clip = {};
                                //     }
                                //     this.$set(
                                //         this.newForm,
                                //         param.type === ""
                                //             ? `param${msgId}_${param.chanNo}`
                                //             : `param${msgId}_${param.chanNo}_${param.type}`,
                                //         JSON.parse(JSON.stringify(formValue))
                                //     );
                                //     this.$set(
                                //         this.oldForm,
                                //         param.type === ""
                                //             ? `param${msgId}_${param.chanNo}`
                                //             : `param${msgId}_${param.chanNo}_${param.type}`,
                                //         JSON.parse(JSON.stringify(formValue))
                                //     );
                                //     this.$emit(
                                //         "formDataChange",
                                //         param.type === ""
                                //             ? `param${msgId}_${param.chanNo}`
                                //             : `param${msgId}_${param.chanNo}_${param.type}`,
                                //         JSON.parse(JSON.stringify(formValue))
                                //     );
                                // }
                                console.log("🚀 ~ error:", `${msgId}获取失败`);
                            }
                            resolve("success");
                        });
                });
            } else {
                if (this.IsTemplateParamsGet) {
                    this.IsTemplateParamsGet = false;
                    this.ehomeParams.forEach((item) => {
                        let name = capability;
                        if (item.msgId - 1 === 901) {
                            name = "ADAS";
                        } else if (item.msgId - 1 === 905) {
                            name = "DSM";
                        } else if (item.msgId - 1 === 920) {
                            name = "BSD";
                        } else if (item.msgId - 1 === 938) {
                            name = "WHD";
                        } else if (item.msgId - 1 === 983) {
                            name = "WIW";
                        } else if (item.msgId - 1 === 954) {
                            name = "AD";
                        } else if (item.msgId - 1 === 989) {
                            name = "VSD";
                        } else if (item.msgId - 1 === 991) {
                            name = "PDA";
                        }
                        this.setTemplateParams(
                            item.msgId - 1,
                            item.params,
                            name
                        );
                    });
                }
            }
        },
        setTemplateParams(msgId, formValue, capability) {
            if (this.newForm.hasOwnProperty(`param${msgId}`) && msgId != 2209) {
                return;
            }
            switch (msgId) {
                case 2205:
                    let obj2205 = {};
                    let objType = "";
                    switch (formValue.type) {
                        case "volume":
                        case "voiceCallOutput":
                        case "audioOutput":
                        case "alarmFollowSystem":
                            objType = "audio";
                            break;
                        case "reverse":
                            objType = "reverse";
                            break;
                        case "sleepReportTimeInterval":
                            objType = "sleepReportTimeInterval";
                            break;
                        case "horizonVanishLine":
                            objType = "horizonVanishLine";
                            break;
                        case "verticalVanishLine":
                            objType = "verticalVanishLine";
                            break;
                    }
                    obj2205 = {};
                    obj2205[formValue.type] = Number(formValue.value);
                    obj2205["chanNo"] = formValue.chanNo;
                    this.$set(
                        this.newForm,
                        `param${msgId}_${formValue.chanNo}_${objType}`,
                        {
                            ...this.newForm[
                                `param${msgId}_${formValue.chanNo}_${objType}`
                            ],
                            ...obj2205,
                        }
                    );
                    this.$set(
                        this.oldForm,
                        `param${msgId}_${formValue.chanNo}_${objType}`,
                        {
                            ...this.oldForm[
                                `param${msgId}_${formValue.chanNo}_${objType}`
                            ],
                            ...obj2205,
                        }
                    );
                    this.$emit(
                        "formDataChange",
                        `param${msgId}_${formValue.chanNo}_${objType}`,
                        {
                            ...this.newForm[
                                `param${msgId}_${formValue.chanNo}_${objType}`
                            ],
                            ...obj2205,
                        }
                    );
                    break;
                case 703:
                case 705:
                    this.$set(
                        this.newForm,
                        `param${msgId}_${formValue.platformOrder}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$set(
                        this.oldForm,
                        `param${msgId}_${formValue.platformOrder}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$emit(
                        "formDataChange",
                        `param${msgId}_${formValue.platformOrder}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    break;
                case 950:
                    this.$set(
                        this.newForm,
                        `param${msgId}_${formValue.type}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$set(
                        this.oldForm,
                        `param${msgId}_${formValue.type}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$emit(
                        "formDataChange",
                        `param${msgId}_${formValue.type}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    if (this.componentName === "deviceParams") {
                        this.showEventDisplayList();
                    }
                    break;
                case 948:
                    this.$set(
                        this.newForm,
                        `param${msgId}_${formValue.type}_${formValue.chanNo}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$set(
                        this.oldForm,
                        `param${msgId}_${formValue.type}_${formValue.chanNo}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$emit(
                        "formDataChange",
                        `param${msgId}_${formValue.type}_${formValue.chanNo}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    break;
                case 971:
                    if (formValue.type) {
                        this.$set(
                            this.newForm,
                            `param${msgId}_${formValue.type}_${formValue.chanNo}`,
                            JSON.parse(JSON.stringify(formValue))
                        );
                        this.$set(
                            this.oldForm,
                            `param${msgId}_${formValue.type}_${formValue.chanNo}`,
                            JSON.parse(JSON.stringify(formValue))
                        );
                        this.$emit(
                            "formDataChange",
                            `param${msgId}_${formValue.type}_${formValue.chanNo}`,
                            JSON.parse(JSON.stringify(formValue))
                        );
                    } else {
                        this.$set(
                            this.newForm,
                            `param${msgId}`,
                            JSON.parse(JSON.stringify(formValue))
                        );
                        this.$set(
                            this.oldForm,
                            `param${msgId}`,
                            JSON.parse(JSON.stringify(formValue))
                        );
                        this.$emit(
                            "formDataChange",
                            `param${msgId}`,
                            JSON.parse(JSON.stringify(formValue))
                        );
                    }
                    break;
                case 901: //ADAS
                case 905: //DSM
                case 920: //BSD
                case 938: //WHD
                case 983: //WIW
                case 954: //AD
                case 989: //VSD
                case 991: //PDA
                    if (formValue.info[0].type !== "") {
                        const chanNoObj = this.capability[
                            `intelliDrive_${capability}`
                        ].find((obj) => obj.chanNo === formValue.chanNo);
                        const typeObj = chanNoObj.info.find(
                            (obj) => obj.type === formValue.info[0].type
                        );
                        if (
                            typeObj &&
                            typeObj.sensitivityList &&
                            typeObj.sensitivityList.length &&
                            !typeObj.newSensitivity &&
                            (capability === "WHD" ||
                                (capability === "DSM" &&
                                    (formValue.info[0].type === 0 ||
                                        formValue.info[0].type === 7 ||
                                        formValue.info[0].type === 34 ||
                                        formValue.info[0].type === 35 ||
                                        formValue.info[0].type === 36 ||
                                        formValue.info[0].type === 37 ||
                                        formValue.info[0].type === 38 ||
                                        formValue.info[0].type === 39 ||
                                        formValue.info[0].type === 2 ||
                                        formValue.info[0].type === 16 ||
                                        formValue.info[0].type === 3 ||
                                        formValue.info[0].type === 8 ||
                                        formValue.info[0].type === 40 ||
                                        formValue.info[0].type === 1 ||
                                        formValue.info[0].type === 15 ||
                                        formValue.info[0].type === 6 ||
                                        formValue.info[0].type === 19 ||
                                        formValue.info[0].type === 12 ||
                                        formValue.info[0].type === 23 ||
                                        formValue.info[0].type === 5 ||
                                        formValue.info[0].type === 18 ||
                                        formValue.info[0].type === 26 ||
                                        formValue.info[0].type === 27)))
                        ) {
                            if (
                                !typeObj.sensitivityList.find(
                                    (e) =>
                                        e.value ===
                                        formValue.info[0].sensitivity
                                )
                            ) {
                                typeObj.sensitivityList.push({
                                    value: formValue.info[0].sensitivity,
                                    label: `自定义值(${formValue.info[0].sensitivity})`,
                                });
                            }
                        } else if (capability === "VSD") {
                        } else {
                            if (
                                typeObj.sensitivity &&
                                typeObj.sensitivityList &&
                                typeObj.sensitivityList.length &&
                                (typeObj.sensitivity.min !== 1 ||
                                    typeObj.sensitivity.max !== 3)
                            ) {
                                if (
                                    formValue.info[0].sensitivity <
                                    typeObj.sensitivity.min +
                                        parseInt(typeObj.sensitivityRange / 3)
                                ) {
                                    formValue.info[0].sensitivity =
                                        typeObj.sensitivityList[0].value;
                                } else if (
                                    formValue.info[0].sensitivity >
                                    typeObj.sensitivity.min +
                                        parseInt(
                                            (typeObj.sensitivityRange * 2) / 3
                                        )
                                ) {
                                    formValue.info[0].sensitivity =
                                        typeObj.sensitivityList[2].value;
                                } else {
                                    formValue.info[0].sensitivity =
                                        typeObj.sensitivityList[1].value;
                                }
                            }
                        }
                        if (typeObj.confidence) {
                            if (
                                formValue.info[0].confidence <
                                typeObj.confidence.min +
                                    parseInt(typeObj.confidenceRange / 3)
                            ) {
                                formValue.info[0].confidence =
                                    typeObj.confidenceList[0].value;
                            } else if (
                                formValue.info[0].confidence >
                                typeObj.confidence.min +
                                    parseInt((typeObj.confidenceRange * 2) / 3)
                            ) {
                                formValue.info[0].confidence =
                                    typeObj.confidenceList[2].value;
                            } else {
                                formValue.info[0].confidence =
                                    typeObj.confidenceList[1].value;
                            }
                        }
                    }
                    if (
                        capability === "BSD" &&
                        formValue.info[0].detect &&
                        formValue.info[0].detect.length
                    ) {
                        formValue.info[0].detect = formValue.info[0].detect.map(
                            (v) => +v
                        );
                    }
                    if (
                        (capability === "DSM" ||
                            capability === "BSD" ||
                            capability === "ADAS" ||
                            capability === "WHD") &&
                        formValue.info[0].uploadEventPlatform &&
                        formValue.info[0].uploadEventPlatform.length
                    ) {
                        formValue.info[0].uploadEventPlatform =
                            formValue.info[0].uploadEventPlatform.reduce(
                                (prev, cur) => {
                                    if (cur !== "") {
                                        return prev.concat(+cur);
                                    }
                                },
                                []
                            );
                    }
                    formValue.chanNo = formValue.chanNo;
                    if (capability === "ADAS") {
                        if (
                            formValue.info[0].hasOwnProperty(
                                "distanceBeyongLane"
                            )
                        ) {
                            formValue.info[0].distanceBeyongLane =
                                formValue.info[0].distanceBeyongLane / 1000;
                        }
                        if (
                            formValue.info[0].hasOwnProperty("nearCarDistance")
                        ) {
                            formValue.info[0].nearCarDistance =
                                formValue.info[0].nearCarDistance / 1000;
                        }
                        if (
                            formValue.info[0].hasOwnProperty(
                                "collisionDistance"
                            )
                        ) {
                            formValue.info[0].collisionDistance =
                                formValue.info[0].collisionDistance / 1000;
                        }
                    }
                    this.$set(
                        this.newForm,
                        formValue.type === ""
                            ? `param${msgId}_${formValue.chanNo}`
                            : `param${msgId}_${formValue.chanNo}_${formValue.info[0].type}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$set(
                        this.oldForm,
                        formValue.type === ""
                            ? `param${msgId}_${formValue.chanNo}`
                            : `param${msgId}_${formValue.chanNo}_${formValue.info[0].type}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$emit(
                        "formDataChange",
                        formValue.type === ""
                            ? `param${msgId}_${formValue.chanNo}`
                            : `param${msgId}_${formValue.chanNo}_${formValue.info[0].type}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    break;
                case 188:
                    if (!capability) {
                        return;
                    }
                    // formValue.chanNo = formValue.chanNo;
                    // formValue.streamType = formValue.streamType;
                    let newFormValue = {
                        chanNo: formValue.chanNo,
                        streamType: formValue.streamType,
                    };
                    for (let key of Object.keys(capability)) {
                        if (formValue.hasOwnProperty(key)) {
                            newFormValue[key] = formValue[key];
                        }
                    }
                    this.$set(
                        this.newForm,
                        `param${msgId}_${formValue.chanNo}_${formValue.streamType}`,
                        JSON.parse(JSON.stringify(newFormValue))
                    );
                    this.$set(
                        this.oldForm,
                        `param${msgId}_${formValue.chanNo}_${formValue.streamType}`,
                        JSON.parse(JSON.stringify(newFormValue))
                    );
                    this.$emit(
                        "formDataChange",
                        `param${msgId}_${formValue.chanNo}_${formValue.streamType}`,
                        JSON.parse(JSON.stringify(newFormValue))
                    );
                    break;
                case 2510:
                    formValue.chanNo = formValue.chanNo;
                    formValue.type = formValue.type;
                    this.$set(
                        this.newForm,
                        `param${msgId}_${formValue.chanNo}_${formValue.type}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$set(
                        this.oldForm,
                        `param${msgId}_${formValue.chanNo}_${formValue.type}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$emit(
                        "formDataChange",
                        `param${msgId}_${formValue.chanNo}_${formValue.type}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    break;
                case 715:
                    formValue.platformOrder = formValue.platformOrder;
                    this.$set(
                        this.newForm,
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$set(
                        this.oldForm,
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$emit(
                        "formDataChange",
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    break;
                case 2222:
                    if (formValue.hasOwnProperty("mileageRadio")) {
                        formValue.mileageRadio = Number(
                            (formValue.mileageRadio / 100).toFixed(2)
                        );
                    }
                    this.$set(
                        this.newForm,
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$set(
                        this.oldForm,
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$emit(
                        "formDataChange",
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    break;
                case 924:
                    if (this.newForm.hasOwnProperty(`param${msgId}`)) {
                        return;
                    }
                    var regex =
                        /^(?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]$/;
                    if (
                        formValue.hasOwnProperty("daylightStartTime") &&
                        !regex.test(formValue.daylightStartTime)
                    ) {
                        formValue.daylightStartTime = this.changeMinToSec(
                            formValue.daylightStartTime
                        );
                    }
                    if (
                        formValue.hasOwnProperty("daylightEndTime") &&
                        !regex.test(formValue.daylightEndTime)
                    ) {
                        formValue.daylightEndTime = this.changeMinToSec(
                            formValue.daylightEndTime
                        );
                    }
                    if (formValue.hasOwnProperty("allDayDrivingTimeMax")) {
                        formValue.allDayDrivingTimeMax = Number(
                            (formValue.allDayDrivingTimeMax / 3600).toFixed(0)
                        );
                    }
                    if (formValue.hasOwnProperty("deltaWarnTime")) {
                        formValue.deltaWarnTime = Number(
                            (formValue.deltaWarnTime / 60).toFixed(0)
                        );
                    }
                    if (formValue.hasOwnProperty("daylightDrivingTimeMax")) {
                        formValue.daylightDrivingTimeMax = Number(
                            (formValue.daylightDrivingTimeMax / 60).toFixed(0)
                        );
                    }
                    if (formValue.hasOwnProperty("restTimeMin")) {
                        formValue.restTimeMin = Number(
                            (formValue.restTimeMin / 60).toFixed(0)
                        );
                    }
                    if (formValue.hasOwnProperty("nightDrivingTimeMax")) {
                        formValue.nightDrivingTimeMax = Number(
                            (formValue.nightDrivingTimeMax / 60).toFixed(0)
                        );
                    }
                    if (formValue.hasOwnProperty("nightDrivingRestTime")) {
                        formValue.nightDrivingRestTime = Number(
                            (formValue.nightDrivingRestTime / 60).toFixed(0)
                        );
                    }
                    this.$set(
                        this.newForm,
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$set(
                        this.oldForm,
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$emit(
                        "formDataChange",
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    break;
                case 306:
                    if (formValue.mtu === 0) {
                        formValue.mtu = 1500;
                    }
                    this.$set(
                        this.newForm,
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$set(
                        this.oldForm,
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$emit(
                        "formDataChange",
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    break;
                case 36:
                    this.$set(
                        this.newForm,
                        `param${msgId}_${formValue.type}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$set(
                        this.oldForm,
                        `param${msgId}_${formValue.type}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$emit(
                        "formDataChange",
                        `param${msgId}_${formValue.type}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    break;
                case 903:
                    this.$set(
                        this.newForm,
                        `param${msgId}_${formValue.chanNo}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$set(
                        this.oldForm,
                        `param${msgId}_${formValue.chanNo}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$emit(
                        "formDataChange",
                        `param${msgId}_${formValue.chanNo}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    break;
                case 6004:
                    this.$set(
                        this.newForm,
                        `param${msgId}_${formValue.algorithmType}_${formValue.sentivityType}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$set(
                        this.oldForm,
                        `param${msgId}_${formValue.algorithmType}_${formValue.sentivityType}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$emit(
                        "formDataChange",
                        `param${msgId}_${formValue.algorithmType}_${formValue.sentivityType}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    break;
                case 2209:
                    let obj2209 = {};
                    obj2209[`${formValue.chanNo}`] = formValue;
                    this.$set(
                        this.newForm,
                        `param${msgId}`,
                        JSON.parse(
                            JSON.stringify({
                                ...this.newForm[`param${msgId}`],
                                ...obj2209,
                            })
                        )
                    );
                    this.$set(
                        this.oldForm,
                        `param${msgId}`,
                        JSON.parse(
                            JSON.stringify({
                                ...this.oldForm[`param${msgId}`],
                                ...obj2209,
                            })
                        )
                    );
                    this.$emit(
                        "formDataChange",
                        `param${msgId}`,
                        JSON.parse(
                            JSON.stringify({
                                ...this.newForm[`param${msgId}`],
                                ...obj2209,
                            })
                        )
                    );
                    console.log(
                        "🚀 ~ setTemplateParams ~ this.newForm:",
                        JSON.parse(JSON.stringify(this.newForm))
                    );
                    break;
                case 993:
                    if (this.newForm.hasOwnProperty(`param${msgId}`)) {
                        return;
                    }
                    if (
                        formValue &&
                        formValue.banTime &&
                        formValue.banTime.length
                    ) {
                        formValue.banTime.forEach((item) => {
                            if (item.hasOwnProperty("advanceWarningTime")) {
                                item.advanceWarningTime =
                                    item.advanceWarningTime / 60;
                            }
                            if (item.hasOwnProperty("warningPeriod")) {
                                item.warningPeriod = item.warningPeriod / 60;
                            }
                        });
                    }

                    this.$set(
                        this.newForm,
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$set(
                        this.oldForm,
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$emit(
                        "formDataChange",
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    break;
                default:
                    if (msgId == 1303) {
                        formValue.alarmList.forEach((item) => {
                            item.enabled = item.enabled.map((v) => +v);
                        });
                    }
                    if (msgId == 1307) {
                        formValue.showMask = formValue.showMask.map((v) => +v);
                    }
                    if (msgId == 1311) {
                        formValue.certType = formValue.certType.map((v) => +v);
                    }
                    this.$set(
                        this.newForm,
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$set(
                        this.oldForm,
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    this.$emit(
                        "formDataChange",
                        `param${msgId}`,
                        JSON.parse(JSON.stringify(formValue))
                    );
                    break;
            }
            // console.log(
            //     "🚀 newFormnewForm:",
            //     JSON.parse(JSON.stringify(this.newForm))
            // );
        },
        formValidate() {
            return new Promise((resolve, reject) => {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        },
        validateRange(rule, value, callback) {
            if (value !== "" && value !== null && value !== undefined) {
                if (!this.validateNumber(value)) {
                    callback(new Error("请输入正确的数字"));
                } else if (value.length < rule.min) {
                    callback(new Error(`${rule.name}最小长度为${rule.min}`));
                } else if (value.length > rule.max) {
                    callback(new Error(`${rule.name}最大长度为${rule.max}`));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        },
        isEqual(arr1, arr2) {
            if (!arr1 && !arr2) {
                return false;
            } else if (arr1.length !== arr2.length) {
                return true;
            } else if (arr1 && arr1.length && arr2 && arr2.length) {
                var sortedArr1 = arr1.map(Number).slice().sort();
                var sortedArr2 = arr2.map(Number).slice().sort();
                if (sortedArr1.length !== sortedArr2.length) return true;
                for (var i = 0; i < sortedArr1.length; i++) {
                    if (sortedArr1[i] !== sortedArr2[i]) return true;
                }
                return false;
            } else {
                return false;
            }
        },
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.labelWidthResize, true);
    },
};
