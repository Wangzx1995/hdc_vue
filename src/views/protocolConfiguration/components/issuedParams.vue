<template>
    <div class="issued-params">
        <div class="configuration-form">
            <el-form
                :label-width="`${labelWidth}px`"
                :model="form"
                :inline="true"
                ref="form"
            >
                <div v-for="(first, index1) in issuedFormList" :key="index1">
                    <div class="first-title">{{ first.title }}</div>
                    <div>
                        <div
                            v-for="(second, index2) in first.children"
                            :key="index2"
                        >
                            <template v-if="second.children.length">
                                <div class="second-title">
                                    {{ second.title }}
                                </div>
                                <div>
                                    <el-form-item
                                        v-for="(
                                            third, index3
                                        ) in second.children"
                                        :key="index3"
                                        :label="third.label"
                                    >
                                        <template slot="label">
                                            <div class="label-solt">
                                                <i
                                                    class="el-icon-remove"
                                                    @click="
                                                        deleteFormItem(third)
                                                    "
                                                ></i>
                                                <span>
                                                    {{ third.label }}
                                                </span>
                                            </div>
                                        </template>
                                        <template
                                            v-if="third.type === 'switch'"
                                        >
                                            <el-switch
                                                disabled
                                                v-model="third.value"
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                            ></el-switch>
                                        </template>
                                        <template v-else>
                                            <el-input
                                                :title="third.showValue"
                                                v-if="
                                                    third.hasOwnProperty(
                                                        'showValue'
                                                    )
                                                "
                                                disabled
                                                v-model="third.showValue"
                                            />
                                            <el-input
                                                v-else
                                                disabled
                                                v-model="third.value"
                                            />
                                        </template>
                                    </el-form-item>
                                </div>
                            </template>
                            <template v-if="second.title === '显示输出'">
                                <div class="second-title">
                                    {{ second.title }}
                                </div>
                                <div>
                                    <el-tabs
                                        v-model="eventDisplayActiveName"
                                        type="border-card"
                                    >
                                        <el-tab-pane
                                            v-for="(
                                                item, index
                                            ) in eventDisplayList"
                                            :key="item.value"
                                            :name="item.label"
                                        >
                                            <div
                                                class="label-solt"
                                                slot="label"
                                            >
                                                <i
                                                    class="el-icon-remove"
                                                    @click="
                                                        deleteFormItem(item)
                                                    "
                                                ></i>
                                                <span>
                                                    {{ item.label }}
                                                </span>
                                            </div>
                                            <div>
                                                <el-form-item
                                                    label="使能"
                                                    v-if="
                                                        item.formData.hasOwnProperty(
                                                            'enable'
                                                        )
                                                    "
                                                >
                                                    <el-switch
                                                        v-model="
                                                            item.formData.enable
                                                        "
                                                        :active-value="
                                                            Number(1)
                                                        "
                                                        :inactive-value="
                                                            Number(0)
                                                        "
                                                    ></el-switch>
                                                </el-form-item>
                                                <el-form-item
                                                    label="分屏"
                                                    v-if="
                                                        item.formData.hasOwnProperty(
                                                            'splitType'
                                                        )
                                                    "
                                                >
                                                    <el-input
                                                        disabled
                                                        :value="
                                                            getJsonLabel(
                                                                'intelliDrive_sensor_splitType',
                                                                item.formData
                                                                    .splitType
                                                            )
                                                        "
                                                    />
                                                </el-form-item>
                                            </div>
                                            <div>
                                                <split-type-box
                                                    :isDetail="true"
                                                    :value="item.value"
                                                    :splitChanBinds="
                                                        item.formData
                                                            .splitChanBinds
                                                    "
                                                    :splitType="
                                                        item.formData.splitType
                                                    "
                                                    :splitChans="
                                                        capability
                                                            .intelliDrive_sensor
                                                            .eventDisplay[index]
                                                            .splitChans
                                                    "
                                                ></split-type-box>
                                            </div>
                                        </el-tab-pane>
                                    </el-tabs>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </el-form>
        </div>
        <el-empty
            v-if="!issuedFormList.length"
            description="暂无待下发参数项"
            :size="'lg'"
        ></el-empty>
        <StartConfig
            :visible.sync="startConfigVisible"
            :organizeId="Number($route.query.organizeId)"
            :batchCode="batchCode"
            @reload="reload"
        ></StartConfig>
    </div>
</template>
<script>
import enumerationJSON from "./configuration/enumerationJSON/enumeration.json";
import utils from "./configuration/enumerationJSON/utils.js";
import splitTypeBox from "./configuration/configurationForm/splitTypeBox.vue";
import StartConfig from "@/components/coreManage/startConfig";
export default {
    name: "",
    inject: ["reload"],
    components: { splitTypeBox, StartConfig },
    props: {
        setForm: {
            type: Object,
            default: () => {},
        },
        formData: {
            type: Object,
            default: () => {},
        },
        capability: {
            type: Object,
            default: () => {},
        },
        activeTabName: {
            type: String,
        },
        tabPosition: {
            type: String,
        },
        carIds: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            enumerationJSON,
            issuedFormList: [],
            maxLabelWidth: 200,
            labelWidth: null,
            a: "",
            form: {},
            eventDisplayList: [],
            eventDisplayActiveName: "",
            paramsLength: 0,
            startConfigVisible: false,
            batchCode: "",
            timer: null,
            templateVisible: false,
            templateParams: [],
        };
    },
    mounted() {
        window.addEventListener("resize", this.labelWidthResize);
        this.$nextTick(() => {
            this.labelWidthResize();
        });
    },
    computed: {},
    watch: {
        setForm: {
            handler(val) {
                if (val) {
                    let newForm = this.removeEmpty(val);
                    this.paramsLength = 0;
                    let list = [];
                    for (let bigTitle of Object.keys(newForm)) {
                        let bigObj = {
                            title: bigTitle.split("/")[0],
                            children: [],
                        };
                        for (let smallTitle of Object.keys(newForm[bigTitle])) {
                            let smallObj = {
                                title: smallTitle.split("&")[0],
                                children: [],
                                checked: true,
                            };
                            if (smallTitle.indexOf("param950") > -1) {
                                smallObj.children =
                                    newForm[bigTitle][smallTitle];
                                let arr = [];
                                for (let key of Object.keys(
                                    newForm[bigTitle][smallTitle]
                                )) {
                                    arr.push(Number(key));
                                }
                                this.eventDisplayList =
                                    this.getEnumerationValue(
                                        arr,
                                        "intelliDrive_sensor_eventDisplay"
                                    );
                                this.eventDisplayActiveName =
                                    this.eventDisplayList[0].label;
                                this.eventDisplayList.forEach((item) => {
                                    item.param = `param950_${item.value}`;
                                    item.formData = JSON.parse(
                                        newForm[bigTitle][smallTitle][
                                            item.value
                                        ].split("&")[2]
                                    );
                                });
                                this.paramsLength++;
                            } else {
                                let itemObj = newForm[bigTitle][smallTitle];
                                if (
                                    (smallTitle.indexOf("级报警&param901") >
                                        -1 ||
                                        smallTitle.indexOf("级报警&param905") >
                                            -1 ||
                                        smallTitle.indexOf("级报警&param920") >
                                            -1 ||
                                        smallTitle.indexOf("级报警&param938") >
                                            -1 ||
                                        smallTitle.indexOf("级报警&param983") >
                                            -1 ||
                                        smallTitle.indexOf("级报警&param954") >
                                            -1 ||
                                        smallTitle.indexOf("级报警&param989") >
                                            -1 ||
                                        smallTitle.indexOf("级报警&param991") >
                                            -1 ||
                                        smallTitle.indexOf("级报警&param6016") >
                                            -1) &&
                                    newForm[bigTitle][smallTitle]["info"] &&
                                    newForm[bigTitle][smallTitle]["info"].length
                                ) {
                                    if (itemObj.hasOwnProperty("enable")) {
                                        let enableData = itemObj["enable"];
                                        let enableObj = {
                                            data: enableData,
                                            label: enableData
                                                .split("&")[1]
                                                .replace("switch", ""),
                                            showValue: enableData
                                                .split("&")
                                                .reverse()[0],
                                            value: Number(
                                                enableData
                                                    .split("&")
                                                    .reverse()[0]
                                            ),
                                            param: enableData
                                                .split("&")[0]
                                                .split(".")[0],
                                            type: "switch",
                                        };
                                        smallObj.children.push(enableObj);
                                        this.paramsLength++;
                                    }
                                    if (itemObj.hasOwnProperty("cameraPos")) {
                                        let cameraPosData =
                                            itemObj["cameraPos"];
                                        let cameraPosObj = {
                                            data: cameraPosData,
                                            label: cameraPosData
                                                .split("&")[1]
                                                .replace("number", ""),
                                            showValue: cameraPosData
                                                .split("&")
                                                .reverse()[1],
                                            value: Number(
                                                cameraPosData
                                                    .split("&")
                                                    .reverse()[0]
                                            ),
                                            param: cameraPosData
                                                .split("&")[0]
                                                .split(".")[0],
                                            type: "number",
                                        };
                                        smallObj.children.push(cameraPosObj);
                                        this.paramsLength++;
                                    }
                                    itemObj = itemObj.info[0];
                                }
                                for (let item of Object.keys(itemObj)) {
                                    if (
                                        (smallTitle.indexOf("级报警&param901") >
                                            -1 ||
                                            smallTitle.indexOf(
                                                "级报警&param905"
                                            ) > -1 ||
                                            smallTitle.indexOf(
                                                "级报警&param920"
                                            ) > -1 ||
                                            smallTitle.indexOf(
                                                "级报警&param938"
                                            ) > -1 ||
                                            smallTitle.indexOf(
                                                "级报警&param983"
                                            ) > -1 ||
                                            smallTitle.indexOf(
                                                "级报警&param954"
                                            ) > -1 ||
                                            smallTitle.indexOf(
                                                "级报警&param989"
                                            ) > -1 ||
                                            smallTitle.indexOf(
                                                "级报警&param991"
                                            ) > -1 ||
                                            smallTitle.indexOf(
                                                "级报警&param6016"
                                            ) > -1) &&
                                        (item === "snapshot" || item === "clip")
                                    ) {
                                        for (let snapshotItem of Object.keys(
                                            itemObj[item]
                                        )) {
                                            let data =
                                                itemObj[item][snapshotItem];
                                            let obj = {
                                                data: data,
                                                label: data.split("&")[1],
                                                showValue: data
                                                    .split("&")
                                                    .reverse()[0],
                                                value: data
                                                    .split("&")
                                                    .reverse()[0],
                                                param: data
                                                    .split("&")[0]
                                                    .split(".")[0],
                                            };
                                            //判断是输入框还是开关按钮
                                            if (
                                                obj.label.indexOf("switch") > -1
                                            ) {
                                                obj.type = "switch";
                                                obj.label = obj.label.replace(
                                                    "switch",
                                                    ""
                                                );
                                                obj.value = Number(obj.value);
                                            }
                                            if (
                                                obj.label.indexOf("number") > -1
                                            ) {
                                                obj.label = obj.label.replace(
                                                    "number",
                                                    ""
                                                );
                                                obj.value = Number(obj.value);
                                            }
                                            if (data.split("&").length > 3) {
                                                obj.showValue = data
                                                    .split("&")
                                                    .reverse()[1];
                                            }
                                            if (
                                                obj.label.indexOf("array") > -1
                                            ) {
                                                obj.label = obj.label.replace(
                                                    "array",
                                                    ""
                                                );
                                                obj.value =
                                                    obj.value === ""
                                                        ? []
                                                        : obj.value.split(",");
                                            }
                                            smallObj.children.push(obj);
                                            this.paramsLength++;
                                        }
                                    } else if (
                                        smallTitle.indexOf("param1315") > -1
                                    ) {
                                        for (let gsensorItem of Object.keys(
                                            itemObj[item][0]
                                        )) {
                                            let data = "";
                                            if (
                                                gsensorItem ===
                                                "EventTriggerList"
                                            ) {
                                                data =
                                                    itemObj[item][0][
                                                        gsensorItem
                                                    ][0]["volume"];
                                            } else {
                                                data =
                                                    itemObj[item][0][
                                                        gsensorItem
                                                    ];
                                            }
                                            let obj = {
                                                data: data,
                                                label: data.split("&")[1],
                                                showValue: data
                                                    .split("&")
                                                    .reverse()[0],
                                                value: data
                                                    .split("&")
                                                    .reverse()[0],
                                                param: data
                                                    .split("&")[0]
                                                    .split(".")[0],
                                            };
                                            //判断是输入框还是开关按钮
                                            if (
                                                obj.label.indexOf("switch") > -1
                                            ) {
                                                obj.type = "switch";
                                                obj.label = obj.label.replace(
                                                    "switch",
                                                    ""
                                                );
                                                obj.value = Number(obj.value);
                                            }
                                            if (
                                                obj.label.indexOf("number") > -1
                                            ) {
                                                obj.label = obj.label.replace(
                                                    "number",
                                                    ""
                                                );
                                                obj.value = Number(obj.value);
                                            }
                                            if (data.split("&").length > 3) {
                                                obj.showValue = data
                                                    .split("&")
                                                    .reverse()[1];
                                            }

                                            smallObj.children.push(obj);
                                            this.paramsLength++;
                                        }
                                    } else if (
                                        smallTitle.indexOf("param2209") > -1
                                    ) {
                                        let data = itemObj[item].channelName;
                                        let obj = {
                                            data: data,
                                            label: data.split("&")[1],
                                            showValue: data
                                                .split("&")
                                                .reverse()[0],
                                            value: data.split("&").reverse()[0],
                                            param: data
                                                .split("&")[0]
                                                .split(".")[0],
                                        };
                                        smallObj.children.push(obj);
                                        this.paramsLength++;
                                    } else {
                                        let data = itemObj[item];
                                        let obj = {
                                            data: data,
                                            label: data.split("&")[1],
                                            showValue: data
                                                .split("&")
                                                .reverse()[0],
                                            value: data.split("&").reverse()[0],
                                            param: data
                                                .split("&")[0]
                                                .split(".")[0],
                                        };
                                        //判断是输入框还是开关按钮
                                        if (obj.label.indexOf("switch") > -1) {
                                            obj.type = "switch";
                                            obj.label = obj.label.replace(
                                                "switch",
                                                ""
                                            );
                                            obj.value = Number(obj.value);
                                        }
                                        //如果是下拉框，则需要将value转换为label展示
                                        if (data.split("&").length > 3) {
                                            obj.showValue = data
                                                .split("&")
                                                .reverse()[1];
                                        }
                                        if (obj.label.indexOf("number") > -1) {
                                            obj.label = obj.label.replace(
                                                "number",
                                                ""
                                            );
                                            obj.value = Number(obj.value);
                                        }
                                        if (obj.label.indexOf("array") > -1) {
                                            obj.label = obj.label.replace(
                                                "array",
                                                ""
                                            );
                                            obj.value =
                                                obj.value === ""
                                                    ? []
                                                    : obj.value.split(",");
                                        }
                                        if (
                                            obj.label.indexOf("objArray") > -1
                                        ) {
                                            obj.label = obj.label.replace(
                                                "objArray",
                                                ""
                                            );
                                            obj.value =
                                                obj.value === ""
                                                    ? []
                                                    : JSON.parse(obj.value);
                                        }
                                        if (
                                            obj.label === "标定检测区域" ||
                                            obj.label.indexOf("灵敏度配置") > -1
                                        ) {
                                            obj.value = JSON.parse(obj.value);
                                        }
                                        if (
                                            obj.param.indexOf("param2205") > -1
                                        ) {
                                            obj.param = data
                                                .split("&")[0]
                                                .replace(".", "_");
                                        }
                                        smallObj.children.push(obj);
                                        this.paramsLength++;
                                    }
                                }
                            }
                            bigObj.children.push(smallObj);
                        }
                        list.push(bigObj);
                    }
                    this.issuedFormList = list;
                    this.issuedFormList.forEach((firstItem) => {
                        if (firstItem.title === "平台参数") {
                            firstItem.children.forEach((secondItem) => {
                                if (secondItem.title.indexOf("部标平台") > -1) {
                                    secondItem.indexNum = Number(
                                        secondItem.title.substring(6, 7)
                                    );
                                } else {
                                    secondItem.indexNum = 99;
                                }
                            });
                            firstItem.children.sort(function (a, b) {
                                return a.indexNum - b.indexNum;
                            });
                        }
                        if (firstItem.title === "视频参数设置") {
                            firstItem.children.forEach((secondItem) => {
                                secondItem.indexNum =
                                    Number(
                                        secondItem.title
                                            .split(">")[1]
                                            .substring(2, 3)
                                    ) +
                                    (secondItem.title.indexOf("子") > -1
                                        ? 0.5
                                        : 0) +
                                    (secondItem.title.indexOf("图像镜像设置") >
                                    -1
                                        ? 100
                                        : 0);
                            });
                            firstItem.children.sort(function (a, b) {
                                return a.indexNum - b.indexNum;
                            });
                        }
                    });
                    // console.log(
                    //     "🚀 ~ handler ~ issuedFormList:",
                    //     JSON.parse(JSON.stringify(this.issuedFormList))
                    // );
                    this.$emit("paramsLengthChange", this.paramsLength);
                }
            },
            deep: true,
            // immediate: true,
        },
        activeTabName(newVal) {
            if (newVal === "third") {
                this.$nextTick(() => {
                    this.labelWidthResize();
                });
            }
        },
    },
    methods: {
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
        formatParams(issuedFormList) {
            let params = {};
            issuedFormList.forEach((first) => {
                first.children.forEach((second) => {
                    if (second.title === "显示输出") {
                        for (let key of Object.keys(second.children)) {
                            params[`param950_${key}`] = JSON.parse(
                                second.children[key].split("&")[2]
                            );
                        }
                    } else {
                        second.children.forEach((item) => {
                            if (!params.hasOwnProperty(item.param)) {
                                if (item.param.indexOf("param2205") > -1) {
                                    params[item.param] = JSON.parse(
                                        JSON.stringify(
                                            this.formData[
                                                item.param.substring(
                                                    0,
                                                    item.param.lastIndexOf("_")
                                                )
                                            ]
                                        )
                                    );
                                } else {
                                    if (item.param.indexOf("param2209") > -1) {
                                        params[
                                            `${item.param}_${
                                                item.data.split(".")[1]
                                            }`
                                        ] = JSON.parse(
                                            JSON.stringify(
                                                this.formData[item.param][
                                                    `${item.data.split(".")[1]}`
                                                ]
                                            )
                                        );
                                    } else {
                                        params[item.param] = JSON.parse(
                                            JSON.stringify(
                                                this.formData[item.param]
                                            )
                                        );
                                    }
                                }
                            }
                            if (item.param.indexOf("param971_") > -1) {
                                params[item.param] = {
                                    ...params[item.param],
                                    type: Number(item.param.split("_")[1]),
                                    chanNo: Number(item.param.split("_")[2]),
                                };
                            }
                            if (item.param.indexOf("param2205") > -1) {
                                params[item.param] = {
                                    chanNo: Number(item.param.split("_")[1]),
                                    type: item.data.split("&")[0].split(".")[1],
                                    value: item.value,
                                };
                            } else if (item.param.indexOf("param2209") > -1) {
                                let paramArr = item.data
                                    .split("&")[0]
                                    .split(".");
                                params[`${item.param}_${paramArr[1]}`][
                                    paramArr[2]
                                ] = item.value;
                            } else if (
                                item.param.indexOf("param901") > -1 ||
                                item.param.indexOf("param905") > -1 ||
                                item.param.indexOf("param920") > -1 ||
                                item.param.indexOf("param938") > -1 ||
                                item.param.indexOf("param983") > -1 ||
                                item.param.indexOf("param954") > -1 ||
                                item.param.indexOf("param989") > -1 ||
                                item.param.indexOf("param991") > -1 ||
                                item.param.indexOf("param6016") > -1
                            ) {
                                let paramArr = item.data
                                    .split("&")[0]
                                    .split(".");
                                if (paramArr.length === 2) {
                                    params[item.param][paramArr[1]] =
                                        item.value;
                                } else if (paramArr.length === 4) {
                                    params[item.param][paramArr[1]][
                                        paramArr[2]
                                    ][paramArr[3]] = item.value;
                                } else if (paramArr.length === 5) {
                                    params[item.param][paramArr[1]][
                                        paramArr[2]
                                    ][paramArr[3]][paramArr[4]] = item.value;
                                }
                            } else {
                                let paramArr = item.data
                                    .split("&")[0]
                                    .split(".");
                                if (paramArr.length === 2) {
                                    params[item.param][paramArr[1]] =
                                        item.value;
                                } else if (paramArr.length === 3) {
                                    params[item.param][paramArr[1]][
                                        paramArr[2]
                                    ] = item.value;
                                } else if (paramArr.length === 4) {
                                    params[item.param][paramArr[1]][
                                        paramArr[2]
                                    ][paramArr[3]] = item.value;
                                } else if (paramArr.length === 5) {
                                    params[item.param][paramArr[1]][
                                        paramArr[2]
                                    ][paramArr[3]][paramArr[4]] = item.value;
                                } else if (paramArr.length === 6) {
                                    params[item.param][paramArr[1]][
                                        paramArr[2]
                                    ][paramArr[3]][paramArr[4]][paramArr[5]] =
                                        item.value;
                                } else if (paramArr[0].indexOf("6004") > -1) {
                                    params[item.param] = {
                                        ...item.value,
                                        algorithmType: Number(
                                            item.param.split("_")[1]
                                        ),
                                        sentivityType: Number(
                                            item.param.split("_")[2]
                                        ),
                                    };
                                }
                            }
                        });
                    }
                });
            });
            if (
                params.hasOwnProperty("param192") &&
                params.hasOwnProperty("param2205_1_audio_volume")
            ) {
                params["param192"].volume =
                    params["param2205_1_audio_volume"].value;
            }
            if (params.hasOwnProperty("param2209")) {
                delete params["param2209"];
            }
            if (
                params.hasOwnProperty(
                    "param2205_1_horizonVanishLine_horizonVanishLine"
                )
            ) {
                let point = JSON.parse(
                    params["param2205_1_horizonVanishLine_horizonVanishLine"]
                        .value
                );
                params["param2205_1_horizonVanishLine_horizonVanishLine"] = {
                    chanNo: 1,
                    type: "horizonVanishLine",
                    value: point[0],
                };
                params["param2205_1_verticalVanishLine_verticalVanishLine"] = {
                    chanNo: 1,
                    type: "verticalVanishLine",
                    value: point[1],
                };
                // delete params[
                //     "param2205_1_horizonVanishLine_horizonVanishLine"
                // ];
            }
            if (params.hasOwnProperty("param2222")) {
                if (params.param2222.hasOwnProperty("mileageRadio")) {
                    params.param2222.mileageRadio = Math.floor(
                        Number(params.param2222.mileageRadio * 100)
                    );
                }
            }
            if (params.hasOwnProperty("param924")) {
                if (params.param924.hasOwnProperty("daylightStartTime")) {
                    params.param924.daylightStartTime = this.minTime(
                        params.param924.daylightStartTime
                    );
                }
                if (params.param924.hasOwnProperty("daylightEndTime")) {
                    params.param924.daylightEndTime = this.minTime(
                        params.param924.daylightEndTime
                    );
                }
                if (params.param924.hasOwnProperty("allDayDrivingTimeMax")) {
                    params.param924.allDayDrivingTimeMax = Math.floor(
                        Number(params.param924.allDayDrivingTimeMax * 3600)
                    );
                }
                if (params.param924.hasOwnProperty("deltaWarnTime")) {
                    params.param924.deltaWarnTime = Math.floor(
                        Number(params.param924.deltaWarnTime * 60)
                    );
                }
                if (params.param924.hasOwnProperty("daylightDrivingTimeMax")) {
                    params.param924.daylightDrivingTimeMax = Math.floor(
                        Number(params.param924.daylightDrivingTimeMax * 60)
                    );
                }
                if (params.param924.hasOwnProperty("restTimeMin")) {
                    params.param924.restTimeMin = Math.floor(
                        Number(params.param924.restTimeMin * 60)
                    );
                }
                if (params.param924.hasOwnProperty("nightDrivingTimeMax")) {
                    params.param924.nightDrivingTimeMax = Math.floor(
                        Number(params.param924.nightDrivingTimeMax * 60)
                    );
                }
                if (params.param924.hasOwnProperty("nightDrivingRestTime")) {
                    params.param924.nightDrivingRestTime = Math.floor(
                        Number(params.param924.nightDrivingRestTime * 60)
                    );
                }
            }
            if (params.hasOwnProperty("param993")) {
                if (params.param993.banTime && params.param993.banTime.length) {
                    params.param993.banTime.forEach((item) => {
                        if (item.hasOwnProperty("advanceWarningTime")) {
                            item.advanceWarningTime =
                                item.advanceWarningTime * 60;
                        }
                        if (item.hasOwnProperty("warningPeriod")) {
                            item.warningPeriod = item.warningPeriod * 60;
                        }
                    });
                }
            }
            for (let key of Object.keys(params)) {
                if (key.indexOf("param901") > -1) {
                    if (
                        params[key].info[0].hasOwnProperty("distanceBeyongLane")
                    ) {
                        params[key].info[0].distanceBeyongLane =
                            params[key].info[0].distanceBeyongLane * 1000;
                    }
                    if (params[key].info[0].hasOwnProperty("nearCarDistance")) {
                        params[key].info[0].nearCarDistance =
                            params[key].info[0].nearCarDistance * 1000;
                    }
                    if (
                        params[key].info[0].hasOwnProperty("collisionDistance")
                    ) {
                        params[key].info[0].collisionDistance =
                            params[key].info[0].collisionDistance * 1000;
                    }
                }
            }
            return params;
        },
        minTime(time) {
            if (time && time.indexOf(":") > 0) {
                var min = time.split(":")[0];
                var sec = time.split(":")[1];
                return Number(min * 60) + Number(sec);
            }
        },
        removeEmpty(obj) {
            const finalObj = {};
            Object.keys(obj).forEach((key) => {
                if (
                    obj[key] &&
                    typeof obj[key] === "object" &&
                    !Array.isArray(obj[key])
                ) {
                    const nestedObj = this.removeEmpty(obj[key]);
                    if (Object.keys(nestedObj).length) {
                        finalObj[key] = nestedObj;
                    }
                } else if (Array.isArray(obj[key])) {
                    if (obj[key].length) {
                        obj[key].forEach((x) => {
                            const nestedObj = this.removeEmpty(x);
                            if (Object.keys(nestedObj).length) {
                                finalObj[key] = finalObj[key]
                                    ? [...finalObj[key], nestedObj]
                                    : [nestedObj];
                            }
                        });
                    }
                } else if (
                    // obj[key] !== "" &&
                    // obj[key] !== undefined &&
                    obj[key] !== null
                ) {
                    finalObj[key] = obj[key];
                }
            });
            return finalObj;
        },
        labelWidthResize() {
            let boxWidth = this.$refs.form.$el.offsetWidth - 8 - 28;
            let num = Math.floor(boxWidth / (200 + this.maxLabelWidth));
            this.labelWidth = boxWidth / num - 200;
        },
        deleteFormItem(item) {
            this.$emit("deleteFormItem", item);
            if (item.param.indexOf("param950") > -1) {
                setTimeout(() => {
                    this.$emit("deleteFormItem", item);
                }, 100);
            }
        },
        getEnumerationValue(arr, name) {
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
        saveEHomeConfig(templateObj) {
            if (this.tabPosition === "tab3") {
                //模板配置
                this.$confirm(
                    `确认要将该“${templateObj.templateName}”下发至设备吗?`,
                    this.$t("common.prompt"),
                    {
                        confirmButtonText: this.$t("common.issued"),
                        cancelButtonText: this.$t("common.cancel"),
                        type: "warning",
                    }
                ).then(() => {
                    let params = {
                        productKey: this.$route.query.productKey,
                        organizeId: Number(this.$route.query.organizeId),
                        deviceIds: [Number(this.$route.query.deviceId)],
                        paramType: 1,
                        templateId: templateObj.id,
                    };
                    this.$api
                        .sendDeviceSetParamByTemplate(params)
                        .then((res) => {
                            if (res.success == true) {
                                this.startConfigVisible = true;
                                this.batchCode = res.data;
                            } else {
                                this.$message.error("下发终端失败:" + res.msg);
                            }
                            this.$api.eventTrackTrigger({
                                menu: "DEVICE_CONFIGURATION",
                                business: "DEVICE_CONFIG_SINGLE",
                                eventResult: res.success,
                            });
                        });
                });
            } else {
                let deviceIds = [];
                let params = this.getParams(this.issuedFormList);
                if (this.tabPosition === "tab2") {
                    deviceIds = this.carIds;
                } else {
                    deviceIds = [Number(this.$route.query.deviceId)];
                }
                this.$confirm(`确认要下发至终端吗?`, this.$t("common.prompt"), {
                    confirmButtonText: this.$t("common.issued"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }).then(() => {
                    this.$api
                        .saveEHomeConfig({
                            deviceIds: deviceIds,
                            params2: params,
                            params: JSON.stringify(params),
                            paramBefore: JSON.stringify(this.issuedFormList),
                        })
                        .then((res) => {
                            if (res.success) {
                                this.startConfigVisible = true;
                                this.batchCode = res.data;
                            } else {
                                this.$message.error(
                                    "下发配置参数至设备失败:" + res.msg
                                );
                            }
                            this.updateBol = false;
                            this.$api.eventTrackTrigger({
                                menu: "DEVICE_CONFIGURATION",
                                business:
                                    deviceIds.length > 1
                                        ? "DEVICE_CONFIG_BATCH"
                                        : "DEVICE_CONFIG_SINGLE",
                                eventResult: res.success,
                            });
                        });
                });
            }
        },
        getParams(issuedFormList) {
            let params = [];
            let formatParamsObj = this.formatParams(issuedFormList);
            for (let key of Object.keys(formatParamsObj)) {
                let msgId = utils.getMsgId(
                    Number(key.split("_")[0].split("param")[1])
                );
                params.push({
                    msgId: msgId,
                    param: formatParamsObj[key],
                });
            }
            if (this.tabPosition === "tab2") {
                params.forEach((item) => {
                    if (
                        item.msgId === 706 ||
                        item.msgId === 704 ||
                        item.msgId === 702
                    ) {
                        delete item.param.serial;
                        delete item.param.id;
                    }
                });
            }
            params.forEach((item) => {
                if (item.msgId === 921) {
                    item.param.cameraPosition = item.param.cameraPos;
                }
                if (item.msgId === 9) {
                    if (!item.param.plateType) {
                        item.param.plateType = 0;
                    }
                }
                if (item.msgId === 39) {
                    item.param.currIccid = "";
                    item.param.lockIccid = "";
                }
            });
            return params;
        },
        getTemplateParams(menuList) {
            this.templateParams = this.getParams(menuList);
            let show2205 = false;
            this.templateParams.forEach((item) => {
                item.params = JSON.parse(JSON.stringify(item.param));
                delete item.param;
                if (item.msgId === 2206) {
                    show2205 = true;
                }
            });
            if (show2205) {
                let typeArr = [];
                this.templateParams.forEach((item) => {
                    if (item.msgId === 2206) {
                        typeArr.push(item.params.type);
                    }
                });
                if (
                    typeArr.indexOf("voiceCallOutput") > -1 ||
                    typeArr.indexOf("audioOutput") > -1 ||
                    typeArr.indexOf("volume") > -1
                ) {
                    this.templateParams.push({
                        msgId: 2206,
                        params: {
                            chanNo: this.formData["param2205_1_audio"].chanNo,
                            type: "voiceCallOutput",
                            value: this.formData["param2205_1_audio"]
                                .voiceCallOutput,
                        },
                    });
                    this.templateParams.push({
                        msgId: 2206,
                        params: {
                            chanNo: this.formData["param2205_1_audio"].chanNo,
                            type: "audioOutput",
                            value: this.formData["param2205_1_audio"]
                                .audioOutput,
                        },
                    });
                    this.templateParams.push({
                        msgId: 2206,
                        params: {
                            chanNo: this.formData["param2205_1_audio"].chanNo,
                            type: "volume",
                            value: this.formData["param2205_1_audio"].volume,
                        },
                    });
                }
            }
        },
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.labelWidthResize);
    },
};
</script>
<style lang="less" scoped>
@import "./configuration/configurationForm/configurationForm.less";
.issued-params {
    padding: 14px;
    overflow-y: auto;
    .first-title {
        position: relative;
        padding-left: 8px;
        font-size: 16px;
        font-weight: bold;
        &:before {
            position: absolute;
            top: 50%;
            transform: translatey(-50%);
            left: 0;
            content: "";
            width: 4px;
            height: 100%;
            background-color: #2e87ff !important;
        }
        & + div {
            padding: 0 14px 14px;
            .second-title {
                font-size: 14px;
                margin: 8px 0;
                font-weight: bold;
            }
        }
    }
    /deep/.el-form-item__label,
    /deep/.el-tabs {
        width: 100%;
        .label-solt {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            i {
                cursor: pointer;
                color: #409eff;
                font-size: 16px;
                &:hover {
                    color: #66b1ff;
                }
                margin-right: 4px;
            }
        }
    }
}
</style>
<style lang="less">
.save-as-template-dialog {
    .el-dialog__body {
        padding: 0;
    }
}
</style>
