<template>
    <div class="configuration-form">
        <el-form
            :label-width="`${labelWidth}px`"
            :model="newForm"
            :inline="true"
            ref="form"
        >
            <div v-show="show188">
                <h3>压缩能力设置</h3>

                <el-collapse v-model="collapseActiveName">
                    <el-collapse-item
                        v-for="(tabItem, index) in videoList"
                        :key="index"
                        :title="tabItem.label"
                        :name="tabItem.label"
                        arrowPlacement="right"
                        v-show="
                            newForm[
                                `param188_${tabItem.chanNo}_${tabItem.type}`
                            ]
                        "
                    >
                        <template slot="title">
                            <div class="slot-title">
                                <span>{{ tabItem.label }}</span>
                                <el-button
                                    type="text"
                                    @click.stop="openDialog(tabItem.label)"
                                    >应用至其他通道</el-button
                                >
                            </div>
                        </template>
                        <template
                            v-if="
                                newForm[
                                    `param188_${tabItem.chanNo}_${tabItem.type}`
                                ]
                            "
                        >
                            <el-form-item
                                label="分辨率"
                                v-if="tabItem.hasOwnProperty('resolution')"
                            >
                                <el-select
                                    v-model="
                                        newForm[
                                            `param188_${tabItem.chanNo}_${tabItem.type}`
                                        ].resolution
                                    "
                                >
                                    <el-option
                                        v-for="item in tabItem.resolutionList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="分辨率"
                                v-if="tabItem.hasOwnProperty('res')"
                            >
                                <el-select
                                    v-model="
                                        newForm[
                                            `param188_${tabItem.chanNo}_${tabItem.type}`
                                        ].res
                                    "
                                >
                                    <el-option
                                        v-for="item in tabItem.resList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="帧率"
                                v-if="tabItem.hasOwnProperty('frameRate')"
                            >
                                <el-select
                                    v-model="
                                        newForm[
                                            `param188_${tabItem.chanNo}_${tabItem.type}`
                                        ].frameRate
                                    "
                                >
                                    <el-option
                                        v-for="item in tabItem.frameRate"
                                        :label="item"
                                        :value="item"
                                        :key="item"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="视频编码格式"
                                v-if="tabItem.hasOwnProperty('encodeMode')"
                            >
                                <el-select
                                    v-model="
                                        newForm[
                                            `param188_${tabItem.chanNo}_${tabItem.type}`
                                        ].encodeMode
                                    "
                                >
                                    <el-option
                                        v-for="item in tabItem.encodeModeList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="码率"
                                v-if="tabItem.hasOwnProperty('bitRate')"
                            >
                                <el-select
                                    v-model="
                                        newForm[
                                            `param188_${tabItem.chanNo}_${tabItem.type}`
                                        ].bitRate
                                    "
                                >
                                    <el-option
                                        v-for="item in tabItem.bitRateList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="码率类型"
                                v-if="tabItem.hasOwnProperty('bitRateType')"
                            >
                                <el-select
                                    v-model="
                                        newForm[
                                            `param188_${tabItem.chanNo}_${tabItem.type}`
                                        ].bitRateType
                                    "
                                    @change="
                                        (val) =>
                                            bitRateTypeChange(
                                                val,
                                                tabItem.chanNo,
                                                tabItem.type
                                            )
                                    "
                                >
                                    <el-option
                                        v-for="item in tabItem.bitRateTypeList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                v-show="
                                    tabItem.hasOwnProperty('bitRateType') &&
                                    newForm[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].bitRateType === 0
                                "
                                label="画面质量"
                                v-if="tabItem.hasOwnProperty('imageQuality')"
                            >
                                <el-select
                                    v-model="
                                        newForm[
                                            `param188_${tabItem.chanNo}_${tabItem.type}`
                                        ].imageQuality
                                    "
                                >
                                    <el-option
                                        v-for="item in tabItem.imageQualityList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="码流类型"
                                v-if="tabItem.hasOwnProperty('videoType')"
                            >
                                <el-select
                                    v-model="
                                        newForm[
                                            `param188_${tabItem.chanNo}_${tabItem.type}`
                                        ].videoType
                                    "
                                >
                                    <el-option
                                        v-for="item in tabItem.videoTypeList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div v-show="show2205">
                <h3 v-show="reverseList.length">
                    图像镜像设置<i class="el-icon-warning"></i>
                    <span class="warning-msg"
                        >该配置项修改需要关闭通道对应算法使能才会生效！</span
                    >
                </h3>
                <el-collapse v-model="reverseCollapseActiveName">
                    <el-collapse-item
                        v-for="(tabItem, index) in reverseList"
                        :key="index"
                        :title="tabItem.label"
                        :name="tabItem.label"
                        arrowPlacement="right"
                        v-show="newForm[`param2205_${tabItem.chanNo}_reverse`]"
                    >
                        <template
                            v-if="
                                newForm[`param2205_${tabItem.chanNo}_reverse`]
                            "
                        >
                            <el-form-item
                                label="图像镜像"
                                v-if="tabItem.hasOwnProperty('reverse')"
                            >
                                <span slot="label" class="label-slot"
                                    >图像镜像
                                    <el-tooltip
                                        content="配置图像镜像时，对应通道的算法使能需关闭"
                                    >
                                        <i
                                            class="el-icon-question"
                                        ></i> </el-tooltip
                                ></span>
                                <el-select
                                    v-model="
                                        newForm[
                                            `param2205_${tabItem.chanNo}_reverse`
                                        ].reverse
                                    "
                                >
                                    <el-option
                                        v-for="item in tabItem.reverseList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-form>
        <el-dialog
            title="批量应用"
            :visible.sync="dialogVisible"
            @close="close"
            :width="'460px'"
            :append-to-body="true"
        >
            <div class="global-setting">
                <el-card class="card-left">
                    <div slot="header" class="clearfix">
                        <span>模板配置</span>
                    </div>
                    <el-checkbox-group v-model="paramsCheckList">
                        <el-checkbox
                            label="resolution"
                            v-if="globalSetting.hasOwnProperty('resolution')"
                            >分辨率
                        </el-checkbox>
                        <el-checkbox
                            label="res"
                            v-if="globalSetting.hasOwnProperty('res')"
                            >分辨率
                        </el-checkbox>
                        <el-checkbox
                            label="frameRate"
                            v-if="globalSetting.hasOwnProperty('frameRate')"
                            >帧率
                        </el-checkbox>
                        <el-checkbox
                            label="encodeMode"
                            v-if="globalSetting.hasOwnProperty('encodeMode')"
                            >视频编码格式
                        </el-checkbox>
                        <el-checkbox
                            label="bitRate"
                            v-if="globalSetting.hasOwnProperty('bitRate')"
                            >码率
                        </el-checkbox>
                        <el-checkbox
                            label="bitRateType"
                            v-if="globalSetting.hasOwnProperty('bitRateType')"
                            >码率类型
                        </el-checkbox>
                        <el-checkbox
                            label="imageQuality"
                            v-if="globalSetting.hasOwnProperty('imageQuality')"
                            >画面质量
                        </el-checkbox>
                        <el-checkbox
                            label="videoType"
                            v-if="globalSetting.hasOwnProperty('videoType')"
                            >码流类型
                        </el-checkbox>
                    </el-checkbox-group>
                </el-card>
                <el-card class="card-right">
                    <div slot="header" class="clearfix">
                        <span>应用至</span>
                    </div>
                    <el-checkbox-group
                        v-model="chanNoCheckList"
                        v-for="(item, index) in checkVideoList"
                        :key="index"
                    >
                        <el-checkbox :label="item.label">{{
                            item.label
                        }}</el-checkbox>
                    </el-checkbox-group>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="send">确 定</el-button>
                <el-button @click="close">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import mixins from "@/mixins/mixins";
export default {
    name: "videoParams",
    mixins: [mixins],
    components: {},
    props: {},
    data() {
        return {
            componentsName: "platformParams",
            collapseActiveName: "",
            reverseCollapseActiveName: "",
            setForm: {},
            videoList: [],
            reverseList: [],
            show188: false,
            show2205: false,
            dialogVisible: false,
            globalSetting: "",
            paramsCheckList: [],
            chanNoCheckList: [],
            checkVideoList: [],
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
                    this.videoList.forEach((tabItem) => {
                        if (val[`param188_${tabItem.chanNo}_${tabItem.type}`]) {
                            let objName = `压缩能力设置>${tabItem.label}&param188_${tabItem.chanNo}_${tabItem.type}`;
                            if (!this.setForm.hasOwnProperty(objName)) {
                                this.setForm[objName] = {};
                            }
                            this.setForm[objName].resolution =
                                val[
                                    `param188_${tabItem.chanNo}_${tabItem.type}`
                                ].resolution !==
                                    this.oldForm[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].resolution ||
                                (this.isTemplate &&
                                    val[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].hasOwnProperty("resolution"))
                                    ? `param188_${tabItem.chanNo}_${
                                          tabItem.type
                                      }.resolution&分辨率number&${this.getLabelSelf(
                                          tabItem.resolutionList,
                                          val[
                                              `param188_${tabItem.chanNo}_${tabItem.type}`
                                          ].resolution
                                      )}&${
                                          val[
                                              `param188_${tabItem.chanNo}_${tabItem.type}`
                                          ].resolution
                                      }`
                                    : null;
                            this.setForm[objName].res =
                                val[
                                    `param188_${tabItem.chanNo}_${tabItem.type}`
                                ].res !==
                                    this.oldForm[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].res ||
                                (this.isTemplate &&
                                    val[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].hasOwnProperty("res"))
                                    ? `param188_${tabItem.chanNo}_${
                                          tabItem.type
                                      }.res&分辨率number&${this.getLabelSelf(
                                          tabItem.resList,
                                          val[
                                              `param188_${tabItem.chanNo}_${tabItem.type}`
                                          ].res
                                      )}&${
                                          val[
                                              `param188_${tabItem.chanNo}_${tabItem.type}`
                                          ].res
                                      }`
                                    : null;
                            this.setForm[objName].frameRate =
                                val[
                                    `param188_${tabItem.chanNo}_${tabItem.type}`
                                ].frameRate !==
                                    this.oldForm[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].frameRate ||
                                (this.isTemplate &&
                                    val[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].hasOwnProperty("frameRate"))
                                    ? `param188_${tabItem.chanNo}_${
                                          tabItem.type
                                      }.frameRate&帧率number&${
                                          val[
                                              `param188_${tabItem.chanNo}_${tabItem.type}`
                                          ].frameRate
                                      }`
                                    : null;
                            this.setForm[objName].encodeMode =
                                val[
                                    `param188_${tabItem.chanNo}_${tabItem.type}`
                                ].encodeMode !==
                                    this.oldForm[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].encodeMode ||
                                (this.isTemplate &&
                                    val[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].hasOwnProperty("encodeMode"))
                                    ? `param188_${tabItem.chanNo}_${
                                          tabItem.type
                                      }.encodeMode&视频编码格式number&${this.getLabelSelf(
                                          tabItem.encodeModeList,
                                          val[
                                              `param188_${tabItem.chanNo}_${tabItem.type}`
                                          ].encodeMode
                                      )}&${
                                          val[
                                              `param188_${tabItem.chanNo}_${tabItem.type}`
                                          ].encodeMode
                                      }`
                                    : null;

                            this.setForm[objName].bitRateType =
                                val[
                                    `param188_${tabItem.chanNo}_${tabItem.type}`
                                ].bitRateType !==
                                    this.oldForm[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].bitRateType ||
                                (this.isTemplate &&
                                    val[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].hasOwnProperty("bitRateType"))
                                    ? `param188_${tabItem.chanNo}_${
                                          tabItem.type
                                      }.bitRateType&码率类型number&${this.getLabelSelf(
                                          tabItem.bitRateTypeList,
                                          val[
                                              `param188_${tabItem.chanNo}_${tabItem.type}`
                                          ].bitRateType
                                      )}&${
                                          val[
                                              `param188_${tabItem.chanNo}_${tabItem.type}`
                                          ].bitRateType
                                      }`
                                    : null;
                            this.setForm[objName].bitRate =
                                val[
                                    `param188_${tabItem.chanNo}_${tabItem.type}`
                                ].bitRate !==
                                    this.oldForm[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].bitRate ||
                                (this.isTemplate &&
                                    val[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].hasOwnProperty("bitRate"))
                                    ? `param188_${tabItem.chanNo}_${
                                          tabItem.type
                                      }.bitRate&码率number&${this.getLabelSelf(
                                          tabItem.bitRateList,
                                          val[
                                              `param188_${tabItem.chanNo}_${tabItem.type}`
                                          ].bitRate
                                      )}&${
                                          val[
                                              `param188_${tabItem.chanNo}_${tabItem.type}`
                                          ].bitRate
                                      }`
                                    : null;
                            this.setForm[objName].videoType =
                                val[
                                    `param188_${tabItem.chanNo}_${tabItem.type}`
                                ].videoType !==
                                    this.oldForm[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].videoType ||
                                (this.isTemplate &&
                                    val[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].hasOwnProperty("videoType"))
                                    ? `param188_${tabItem.chanNo}_${
                                          tabItem.type
                                      }.videoType&码流类型number&${this.getLabelSelf(
                                          tabItem.videoTypeList,
                                          val[
                                              `param188_${tabItem.chanNo}_${tabItem.type}`
                                          ].videoType
                                      )}&${
                                          val[
                                              `param188_${tabItem.chanNo}_${tabItem.type}`
                                          ].videoType
                                      }`
                                    : null;
                            this.setForm[objName].imageQuality =
                                val[
                                    `param188_${tabItem.chanNo}_${tabItem.type}`
                                ].imageQuality !==
                                    this.oldForm[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].imageQuality ||
                                (this.isTemplate &&
                                    val[
                                        `param188_${tabItem.chanNo}_${tabItem.type}`
                                    ].hasOwnProperty("imageQuality"))
                                    ? `param188_${tabItem.chanNo}_${
                                          tabItem.type
                                      }.imageQuality&画面质量number&${this.getLabelSelf(
                                          tabItem.imageQualityList,
                                          val[
                                              `param188_${tabItem.chanNo}_${tabItem.type}`
                                          ].imageQuality
                                      )}&${
                                          val[
                                              `param188_${tabItem.chanNo}_${tabItem.type}`
                                          ].imageQuality
                                      }`
                                    : null;
                        }
                    });
                    this.reverseList.forEach((tabItem) => {
                        if (val[`param2205_${tabItem.chanNo}_reverse`]) {
                            let objName = `图像镜像设置>${tabItem.label}&param2205_${tabItem.chanNo}_reverse`;
                            if (!this.setForm.hasOwnProperty(objName)) {
                                this.setForm[objName] = {};
                            }
                            this.setForm[objName].reverse =
                                val[`param2205_${tabItem.chanNo}_reverse`]
                                    .reverse !==
                                    this.oldForm[
                                        `param2205_${tabItem.chanNo}_reverse`
                                    ].reverse ||
                                (this.isTemplate &&
                                    val[
                                        `param2205_${tabItem.chanNo}_reverse`
                                    ].hasOwnProperty("reverse"))
                                    ? `param2205_${
                                          tabItem.chanNo
                                      }_reverse.reverse&图像镜像number&${this.getLabelSelf(
                                          tabItem.reverseList,
                                          val[
                                              `param2205_${tabItem.chanNo}_reverse`
                                          ].reverse
                                      )}&${
                                          val[
                                              `param2205_${tabItem.chanNo}_reverse`
                                          ].reverse
                                      }`
                                    : null;
                        }
                    });
                    this.$emit("setFormChange", {
                        视频参数设置: this.setForm,
                    });
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        getLabelSelf(arr, val) {
            if (!arr) {
                return;
            }
            let attribute = arr.find((e) => e.value === val);
            if (attribute) {
                return attribute.label;
            } else {
                return null;
            }
        },
        initConfig() {
            this.$emit("setFormLoading", true);
            let initConfigList = [];
            this.videoList = this.capability.compress[0].info;
            this.reverseList = JSON.parse(
                JSON.stringify(
                    this.videoList
                        .filter((item) => item.type === 0)
                        .filter((item) => item.reverse)
                )
            );
            this.videoList.forEach((item) => {
                initConfigList.push(
                    this.getEHomeConfig(
                        188,
                        {
                            streamType: item.type,
                            chanNo: item.chanNo,
                        },
                        item
                    )
                );
                item.label = `通道${item.chanNo}${
                    this.enumerationJSON["compress_type"].find(
                        (e) => e.value === item.type
                    ).label
                }`;
                if (item.resolution && item.resolution.length) {
                    item.resolutionList = this.getEnumerationValue(
                        item.resolution,
                        "compress_resolution"
                    );
                }
                if (item.res && item.res.length) {
                    item.resList = this.getEnumerationValue(
                        item.res,
                        "compress_res"
                    );
                }
                if (item.encodeMode && item.encodeMode.length) {
                    item.encodeModeList = this.getEnumerationValue(
                        item.encodeMode,
                        "compress_encodeMode"
                    );
                }
                if (item.bitRateType && item.bitRateType.length) {
                    item.bitRateTypeList = this.getEnumerationValue(
                        item.bitRateType,
                        "compress_bitRateType"
                    );
                }
                if (item.videoType && item.videoType.length) {
                    item.videoTypeList = this.getEnumerationValue(
                        item.videoType,
                        "compress_videoType"
                    );
                }
                if (item.bitRate && item.bitRate.length) {
                    item.bitRateList = this.getEnumerationValue(
                        item.bitRate,
                        "compress_bitRate"
                    );
                }
                if (item.imageQuality && item.imageQuality.length) {
                    item.imageQualityList = this.getEnumerationValue(
                        item.imageQuality,
                        "compress_imageQuality"
                    );
                }
            });
            this.reverseList.forEach((item) => {
                item.label = `通道${item.chanNo}`;
                if (item.reverse && item.reverse.length) {
                    item.reverseList = this.getEnumerationValue(
                        item.reverse,
                        "compress_reverse"
                    );
                }
                initConfigList.push(
                    this.getEHomeConfig(2205, {
                        chanNo: item.chanNo,
                        type: "reverse",
                    })
                );
            });
            if (this.videoList.length) {
                this.collapseActiveName = this.videoList[0].label;
            }
            if (this.reverseList.length) {
                this.reverseCollapseActiveName = this.reverseList[0].label;
            }
            Promise.all(initConfigList).then((result) => {
                this.$emit("setFormLoading", false);
                this.$emit("loadingSuccess");
                for (let key of Object.keys(this.newForm)) {
                    if (key.indexOf("param188_") > -1) {
                        this.show188 = true;
                    }
                    if (
                        key.indexOf("param2205_") > -1 &&
                        key.indexOf("reverse") > -1
                    ) {
                        this.show2205 = true;
                    }
                }
            });
        },
        bitRateTypeChange(val, chanNo, type) {
            this.newForm[`param188_${chanNo}_${type}`].imageQuality =
                this.oldForm[`param188_${chanNo}_${type}`].imageQuality;
        },
        openDialog(label) {
            this.dialogVisible = true;
            this.globalSetting = this.videoList.find((i) => i.label === label);
            let arr = [
                "resolution",
                "res",
                "frameRate",
                "encodeMode",
                "bitRate",
                "bitRateType",
                "imageQuality",
                "videoType",
            ];
            arr.forEach((i) => {
                if (this.globalSetting.hasOwnProperty(i)) {
                    this.paramsCheckList.push(i);
                }
            });
            this.checkVideoList = this.videoList.filter((item) => {
                return (
                    item.type === this.globalSetting.type &&
                    item.label !== this.globalSetting.label
                );
            });
            this.chanNoCheckList = this.checkVideoList.reduce((prev, cur) => {
                return prev.concat(cur.label);
            }, []);
        },
        close() {
            this.dialogVisible = false;
            setTimeout(() => {
                this.globalSetting = {};
                this.paramsCheckList = [];
                this.chanNoCheckList = [];
                this.checkVideoList = [];
            }, 300);
        },
        send() {
            this.videoList.forEach((tabItem) => {
                if (this.chanNoCheckList.find((e) => e === tabItem.label)) {
                    this.paramsCheckList.forEach((k) => {
                        if (
                            this.newForm[
                                `param188_${tabItem.chanNo}_${tabItem.type}`
                            ]
                        ) {
                            this.newForm[
                                `param188_${tabItem.chanNo}_${tabItem.type}`
                            ][k] =
                                this.newForm[
                                    `param188_${this.globalSetting.chanNo}_${this.globalSetting.type}`
                                ][k];
                        }
                    });
                }
            });
            this.close();
        },
        radioChange(val) {
            this.globalSetting = this.videoList.find((i) => i.label === val);
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
.global-setting {
    display: flex;
    justify-content: space-between;
    /deep/.el-card {
        .el-card__body {
            max-height: 300px;
            overflow-y: auto;
        }
    }
    .el-radio-group,
    /deep/.el-checkbox {
        display: flex;
        margin-bottom: 8px;
        .el-checkbox__input {
            display: flex;
            align-items: center;
        }
    }
    .card-left {
        width: 200px;
        margin-right: 20px;
    }
    .card-right {
        flex: 1;
    }
}
.slot-title {
    width: 100%;
    padding-right: 24px;
    display: flex;
    justify-content: space-between;
}
</style>
