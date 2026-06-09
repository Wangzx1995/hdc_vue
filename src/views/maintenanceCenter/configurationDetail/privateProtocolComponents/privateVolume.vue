<template>
    <div class="p-a-md">
        <h2>基本参数{{ activeName }}</h2>
        <el-form
            ref="PrivateVolumeForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <el-tabs
                v-model="activeName"
                :before-leave="beforeLeave"
                @tab-click="getPrivateProcotol(activeName)"
            >
                <el-tab-pane
                    v-for="(item, index) in tabAndConfiguration"
                    :name="item['name']"
                    :label="item['name']"
                    :key="index"
                >
                    <template>
                        <div class="configurations">
                            <div
                                v-if="
                                    item.name === '报警音频' &&
                                    form['param2205_audioOutput'] &&
                                    form['param2205_audioOutput']['type'] &&
                                    deviceCapability['generic'][
                                        'audioOutput'
                                    ] &&
                                    deviceCapability['generic']['audioOutput']
                                        .length
                                "
                                class="configuration-item"
                            >
                                <el-form-item
                                    label="音频输出口类型"
                                    prop="param2205_audioOutput.value"
                                >
                                    <el-select
                                        v-model="
                                            form['param2205_audioOutput'].value
                                        "
                                    >
                                        <el-option
                                            v-for="item in dictionaryData[
                                                'audioOutPutList'
                                            ]"
                                            :value="item.id"
                                            :key="item.id"
                                            :label="item.label"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    item.name === '系统音频' &&
                                    form['param2205_voiceCallOutput'] &&
                                    form['param2205_voiceCallOutput']['type'] &&
                                    deviceCapability['generic'][
                                        'voiceCallOutput'
                                    ] &&
                                    deviceCapability['generic'][
                                        'voiceCallOutput'
                                    ].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item
                                    label="音频输出口类型"
                                    prop="param2205_voiceCallOutput.value"
                                >
                                    <el-select
                                        v-model="
                                            form['param2205_voiceCallOutput']
                                                .value
                                        "
                                    >
                                        <el-option
                                            v-for="item in dictionaryData[
                                                'voiceCallOutputList'
                                            ]"
                                            :value="item.id"
                                            :key="item.id"
                                            :label="item.label"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    item.name === '系统音频' &&
                                    form['param2205_volume'] &&
                                    form['param2205_volume']['type'] &&
                                    deviceCapability['generic']['volume']
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="音量">
                                    <!-- <el-input v-model="form['param2205_volume'].value"></el-input> -->
                                    <el-slider
                                        v-model.number="
                                            form['param2205_volume'].value
                                        "
                                        :min="
                                            deviceCapability['generic'][
                                                'volume'
                                            ]['min']
                                        "
                                        :max="
                                            deviceCapability['generic'][
                                                'volume'
                                            ]['max']
                                        "
                                        :step="1"
                                        show-input
                                    ></el-slider>
                                </el-form-item>
                            </div>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </div>
</template>

<script>
import { validateNum } from "@/utils/validate";
export default {
    props: {
        allCapability: {
            type: Object,
            default: () => {
                return {};
            },
        },
        formDetail: {
            type: Object,
            default: () => {
                return {};
            },
        },
        originalForm: {
            type: Object,
            default: () => {
                return {};
            },
        },
        setStatisticsData: {
            type: Object,
            default: () => {
                return {};
            },
        },
        allEnumerationData: {
            type: Object,
            default: () => {
                return {};
            },
        },
        setConfigParams: {
            type: Boolean,
            default: false,
        },
        isTemplate: {
            type: String,
        },
    },
    watch: {
        allCapability: {
            handler(val) {
                if (val) {
                    console.log(val);
                    this.deviceCapability = val;
                    this.makeTabList();
                }
            },
            deep: true,
            immediate: true,
        },
        formDetail: {
            handler(val) {
                if (val) {
                    this.form = val;
                }
            },
            deep: true,
            immediate: true,
        },
        originalForm: {
            handler(val) {
                if (val) {
                    this.copyForm = val;
                }
            },
            deep: true,
            immediate: true,
        },
        form: {
            handler(val) {
                if (val) {
                    this.$emit("change", val);
                }
            },
            deep: true,
            immediate: true,
        },
        copyForm: {
            handler(val) {
                if (val) {
                    this.$emit("changeCopy", val);
                }
            },
            deep: true,
            immediate: false,
        },
        setStatisticsData: {
            handler(val) {
                if (val) {
                    this.formData = val;
                }
            },
            deep: true,
            immediate: true,
        },
        allEnumerationData: {
            handler(val) {
                if (val) {
                    this.dictionaryData = val;
                }
            },
            deep: true,
            immediate: true,
        },
        setConfigParams: {
            handler(val) {
                if (val) {
                    this.childConfigParams = val;
                    this.getPrivateProcotol(this.activeName);
                }
            },
            deep: true,
            immediate: true,
        },
        childConfigParams: {
            handler(val) {
                this.$emit("changeConfigParams", val);
            },
            deep: true,
            immediate: true,
        },
        "form.param2205_audioOutput": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData["param2205_audioOutput.value"] =
                        val["value"] !==
                        this.copyForm["param2205_audioOutput"]["value"]
                            ? `param2205_audioOutput.value&车辆设备/报警音频/音频输出口类型&${
                                  this.dictionaryData["audioOutPutJson"][
                                      val["value"]
                                  ]
                              }&${
                                  this.dictionaryData["audioOutPutJson"][
                                      this.copyForm["param2205_audioOutput"][
                                          "value"
                                      ]
                                  ]
                              }`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param2205_voiceCallOutput": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData["param2205_voiceCallOutput.value"] =
                        val["value"] !==
                        this.copyForm["param2205_voiceCallOutput"]["value"]
                            ? `param2205_voiceCallOutput.value&车辆设备/音量设置/系统音频/音频输出口类型&${
                                  this.dictionaryData["voiceCallOutputJson"][
                                      val["value"]
                                  ]
                              }&${
                                  this.dictionaryData["voiceCallOutputJson"][
                                      this.copyForm[
                                          "param2205_voiceCallOutput"
                                      ]["value"]
                                  ]
                              }`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param2205_volume": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData["param2205_volume.value"] =
                        Number(val["value"]) !==
                        Number(this.copyForm["param2205_volume"]["value"])
                            ? `param2205_volume.value&车辆设备/音量设置/系统音频/音量&${Number(
                                  val["value"]
                              )}&${Number(
                                  this.copyForm["param2205_volume"]["value"]
                              )}`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
    },
    data() {
        return {
            deviceId: this.$route.query.deviceId || "",
            deviceCapability: {},
            form: {},
            copyForm: {},
            formData: {},
            dictionaryData: {},
            tabAndConfiguration: [],
            childConfigParams: false,
            activeName: "",
            checkNumber: function (rule, value, callback) {
                if (value !== "" && value !== null && value !== undefined) {
                    if (!validateNum(value)) {
                        callback(new Error("请输入正确的整数"));
                    } else if (value < this.min) {
                        callback(new Error(`最小值为${this.min}`));
                    } else if (value > this.max) {
                        callback(new Error(`最大值为${this.max}`));
                    } else {
                        callback();
                    }
                } else {
                    // callback(new Error("请输入"));
                    callback();
                }
            },
        };
    },
    created() {
        // this.getByIsApi(1)
        //console.log(this.isTemplate)
        this.$emit("setMenuActiveRefFormName", "PrivateVolumeForm");
        // this.$api.getEHomeConfig({deviceId : this.deviceId,
        //         param:'',
        //         msgId:192}).then(res =>{

        // })
    },
    methods: {
        getPrivateProcotol(activeName) {
            this.activeName = activeName;
            if (activeName == "报警音频") {
                if (
                    !this.form["param2205_audioOutput"] ||
                    !this.form["param2205_audioOutput"]["type"]
                ) {
                    let params = {
                        deviceId: this.deviceId,
                        param: {
                            chanNo: 1,
                            type: "audioOutput",
                        },
                        msgId: 2205,
                    };
                    if (Boolean(this.isTemplate)) return;
                    this.$api.getEHomeConfig(params).then((res) => {
                        console.log(res);
                        if (res && res.data && res.data.param) {
                            this.$set(
                                this.form,
                                "param2205_audioOutput",
                                JSON.parse(res.data.param)
                            );
                            this.$set(
                                this.copyForm,
                                "param2205_audioOutput",
                                JSON.parse(
                                    JSON.stringify(JSON.parse(res.data.param))
                                )
                            );
                            console.log(this.form);
                            console.log(this.copyForm);
                            this.childConfigParams = false;
                        } else {
                            this.$message.error("协议获取失败");
                            this.childConfigParams = false;
                        }
                    });
                } else {
                    this.childConfigParams = false;
                }
            } else {
                if (
                    !this.form["param2205_voiceCallOutput"] ||
                    !this.form["param2205_voiceCallOutput"]["type"]
                ) {
                    let params = {
                        deviceId: this.deviceId,
                        param: {
                            chanNo: 1,
                            type: "voiceCallOutput",
                        },
                        msgId: 2205,
                    };
                    if (Boolean(this.isTemplate)) return;
                    this.$api.getEHomeConfig(params).then((res) => {
                        if (res && res.data && res.data.param) {
                            this.$set(
                                this.form,
                                "param2205_voiceCallOutput",
                                JSON.parse(res.data.param)
                            );
                            this.$set(
                                this.copyForm,
                                "param2205_voiceCallOutput",
                                JSON.parse(
                                    JSON.stringify(JSON.parse(res.data.param))
                                )
                            );
                        } else {
                            // this.$message.error("协议获取失败");
                            this.childConfigParams = false;
                        }
                    });
                } else {
                    this.childConfigParams = false;
                }
                if (
                    !this.form["param2205_volume"] ||
                    !this.form["param2205_volume"]["type"]
                ) {
                    let params = {
                        deviceId: this.deviceId,
                        param: {
                            chanNo: 1,
                            type: "volume",
                        },
                        msgId: 2205,
                    };
                    if (Boolean(this.isTemplate)) return;
                    this.$api.getEHomeConfig(params).then((res) => {
                        if (res && res.data && res.data.param) {
                            let resJosn = {};
                            for (let key in JSON.parse(res.data.param)) {
                                if (key == "value") {
                                    resJosn[key] = Number(
                                        JSON.parse(res.data.param)[key]
                                    );
                                } else {
                                    resJosn[key] = JSON.parse(res.data.param)[
                                        key
                                    ];
                                }
                            }
                            this.$set(this.form, "param2205_volume", resJosn);
                            this.$set(
                                this.copyForm,
                                "param2205_volume",
                                JSON.parse(JSON.stringify(resJosn))
                            );
                            this.childConfigParams = false;
                        } else {
                            // this.$message.error("协议获取失败");
                            this.childConfigParams = false;
                        }
                    });
                } else {
                    this.childConfigParams = false;
                }
            }
        },
        beforeLeave() {},
        makeTabList() {
            this.tabAndConfiguration = [];
            if (this.deviceCapability["generic"]) {
                // for (let key in this.deviceCapability["generic"]) {
                //     if (
                //         key == "audioOutput" ||
                //         key == "voiceCallOutput" ||
                //         key == "volume"
                //     ) {
                //         this.tabAndConfiguration.push({});
                //     }
                // }
                for (let key in this.deviceCapability["generic"]) {
                    switch (key) {
                        case "audioOutput":
                            this.tabAndConfiguration.push({ name: "报警音频" });
                            // this.tabAndConfiguration[0]["name"] = "报警音频";
                            break;
                        case "voiceCallOutput":
                            if (
                                !this.tabAndConfiguration.find(
                                    (item) => item.name === "系统音频"
                                )
                            ) {
                                this.tabAndConfiguration.push({
                                    name: "系统音频",
                                });
                            }
                            // this.tabAndConfiguration[1]["name"] = "系统音频";
                            break;
                        case "volume":
                            if (
                                !this.tabAndConfiguration.find(
                                    (item) => item.name === "系统音频"
                                )
                            ) {
                                this.tabAndConfiguration.push({
                                    name: "系统音频",
                                });
                            }
                            // this.tabAndConfiguration[1]["name"] = "系统音频";
                            break;
                    }
                }
                this.activeName = this.tabAndConfiguration[0]["name"];
            }
        },
    },
};
</script>

<style lang="less" scoped>
.configuration-detail-submit {
    width: 100%;
    border-right: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;
    display: flex;
    position: fixed;
    bottom: 0;
    z-index: 500;
    right: 1%;
    background: white;
}
.maginBottom {
    margin-bottom: 10px;
}
</style>
