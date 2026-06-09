<template>
    <div class="configuration-form">
        <el-form
            :label-width="`${labelWidth}px`"
            :model="newForm"
            :inline="true"
            ref="form"
        >
            <h3>
                音频编码<i class="el-icon-warning"></i>
                <span class="warning-msg">
                    该配置项修改后需要重启设备才生效！
                </span>
            </h3>
            <el-collapse v-model="collapseActiveName">
                <el-collapse-item
                    v-for="(tabItem, index) in audioList"
                    :key="index"
                    :title="tabItem.label"
                    :name="tabItem.label"
                    arrowPlacement="right"
                    v-show="
                        newForm[`param2510_${tabItem.chanNo}_${tabItem.type}`]
                    "
                >
                    <template
                        v-if="
                            newForm[
                                `param2510_${tabItem.chanNo}_${tabItem.type}`
                            ]
                        "
                    >
                        <el-form-item
                            label="音频编码格式"
                            v-if="tabItem.hasOwnProperty('audioEncodeMode')"
                        >
                            <el-select
                                v-model="
                                    newForm[
                                        `param2510_${tabItem.chanNo}_${tabItem.type}`
                                    ].audioEncodeMode
                                "
                            >
                                <el-option
                                    v-for="item in tabItem.audioEncodeModeList"
                                    :label="item.label"
                                    :value="item.value"
                                    :key="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-collapse-item>
            </el-collapse>
        </el-form>
    </div>
</template>
<script>
import mixins from "@/mixins/mixins";
export default {
    name: "audioParams",
    mixins: [mixins],
    components: {},
    props: {},
    data() {
        return {
            componentsName: "platformParams",
            collapseActiveName: "",
            setForm: {},
            audioList: [],
        };
    },
    activated() {
        this.$nextTick(() => {
            this.labelWidthResize();
        });
    },
    mounted() {
        this.initConfig();
    },
    computed: {},
    watch: {
        newForm: {
            handler(val) {
                if (val) {
                    this.audioList.forEach((tabItem) => {
                        if (
                            val[`param2510_${tabItem.chanNo}_${tabItem.type}`]
                        ) {
                            let objName = `${tabItem.label}&param2510_${tabItem.chanNo}_${tabItem.type}`;
                            if (!this.setForm.hasOwnProperty(objName)) {
                                this.setForm[objName] = {};
                            }
                            this.setForm[objName].audioEncodeMode =
                                val[
                                    `param2510_${tabItem.chanNo}_${tabItem.type}`
                                ].audioEncodeMode !==
                                this.oldForm[
                                    `param2510_${tabItem.chanNo}_${tabItem.type}`
                                ].audioEncodeMode
                                    ? `param2510_${tabItem.chanNo}_${
                                          tabItem.type
                                      }.audioEncodeMode&音频编码格式number&${this.getLabelSelf(
                                          tabItem.audioEncodeModeList,
                                          val[
                                              `param2510_${tabItem.chanNo}_${tabItem.type}`
                                          ].audioEncodeMode
                                      )}&${
                                          val[
                                              `param2510_${tabItem.chanNo}_${tabItem.type}`
                                          ].audioEncodeMode
                                      }`
                                    : null;
                        }
                    });
                    this.$emit("setFormChange", {
                        音频设置: this.setForm,
                    });
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        getLabelSelf(arr, val) {
            let obj = arr.find((e) => e.value === val);
            if (obj) {
                return obj.label;
            }
        },
        initConfig() {
            this.$emit("setFormLoading", true);
            let initConfigList = [];
            this.audioList = [];
            this.capability.audio.chanInfo.forEach((chanItem) => {
                chanItem.info.forEach((typeItem) => {
                    initConfigList.push(
                        this.getEHomeConfig(2510, {
                            type: typeItem.type,
                            chanNo: chanItem.chanNo,
                        })
                    );
                    if (
                        typeItem.audioEncodeMode &&
                        typeItem.audioEncodeMode.length
                    ) {
                        typeItem.audioEncodeModeList = this.getEnumerationValue(
                            typeItem.audioEncodeMode,
                            "audio_chanInfo_audioEncodeMode"
                        );
                    }
                    typeItem.chanNo = chanItem.chanNo;
                    typeItem.label = `通道${chanItem.chanNo}${
                        this.enumerationJSON["audio_chanInfo_type"].find(
                            (e) => e.value === typeItem.type
                        ).label
                    }`;
                    this.audioList.push(typeItem);
                });
            });
            this.collapseActiveName = this.audioList[0].label;
            Promise.all(initConfigList).then((result) => {
                this.$emit("setFormLoading", false);
                this.$emit("loadingSuccess");
            });
        },
    },
};
</script>
<style lang="less" scoped>
@import "./configurationForm.less";
/deep/.el-collapse {
    .el-collapse-item__content {
        padding-top: 20px;
    }
}
</style>
