<template>
    <div class="configuration-form">
        <el-form
            :label-width="`${labelWidth}px`"
            :model="newForm"
            :inline="true"
            :rules="rules"
            ref="form"
        >
            <el-radio-group type="simple" v-model="chanNoActive">
                <el-radio-button
                    v-for="(item, index) in WHDList"
                    :key="index"
                    :label="`通道${item.chanNo}`"
                />
            </el-radio-group>
            <div>
                <div v-for="(chanNoItem, index) in WHDList" :key="index">
                    <div v-show="`通道${chanNoItem.chanNo}` === chanNoActive">
                        <div
                            v-if="
                                newForm[
                                    `param938_${chanNoItem.chanNo}_${firstType}`
                                ]
                            "
                        >
                            <h3>WHD全局参数</h3>
                            <el-form-item
                                label="WHD算法使能"
                                v-if="
                                    newForm[
                                        `param938_${chanNoItem.chanNo}_${firstType}`
                                    ].hasOwnProperty('enable')
                                "
                            >
                                <h-switch
                                    v-model="
                                        newForm[
                                            `param938_${chanNoItem.chanNo}_${firstType}`
                                        ].enable
                                    "
                                    :active-value="Number(1)"
                                    :inactive-value="Number(0)"
                                    :before-change="
                                        (value, done) =>
                                            beforeChange(value, done)
                                    "
                                    @change="
                                        (val) => enableChange(val, chanNoItem)
                                    "
                                ></h-switch>
                            </el-form-item>
                            <el-form-item
                                label="联动抓拍的通道"
                                v-if="
                                    chanNoItem.linkChannel &&
                                    chanNoItem.linkChannel.length &&
                                    chanNoItem.maxLinkChannel
                                "
                            >
                                <el-select
                                    v-model="
                                        newForm[
                                            `param938_${chanNoItem.chanNo}_${firstType}`
                                        ].linkChannel
                                    "
                                    :multiple-limit="
                                        chanNoItem.maxLinkChannel || 0
                                    "
                                    multiple
                                    collapse-tags
                                >
                                    <el-option
                                        v-for="item in chanNoItem.linkChannel"
                                        :label="`通道${item}`"
                                        :value="item"
                                        :key="item"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="WHD全局标定">
                                <el-button
                                    style="width: 100%"
                                    @click="openSurvey(chanNoItem)"
                                    >WHD全局标定</el-button
                                >
                                <!-- {
                                            chanNo: chanNoItem.chanNo,
                                            type: levelItem.type,
                                        } -->
                            </el-form-item>
                        </div>
                        <el-collapse
                            v-if="
                                newForm[
                                    `param938_${chanNoItem.chanNo}_${firstType}`
                                ] &&
                                newForm[
                                    `param938_${chanNoItem.chanNo}_${firstType}`
                                ].enable
                            "
                            v-model="activeCollapse"
                            @change="collapseChange"
                        >
                            <el-collapse-item
                                v-for="(infoItem, key) in chanNoItem.info"
                                :key="key"
                                :title="key.split('-')[1]"
                                :name="key.split('-')[1]"
                                arrowPlacement="right"
                                :class="{
                                    'template-hide': setTemplateHide(
                                        chanNoItem,
                                        infoItem
                                    ),
                                }"
                            >
                                <div
                                    v-for="(levelItem, index2) in infoItem"
                                    :key="index2"
                                >
                                    <template
                                        v-if="
                                            newForm[
                                                `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                            ]
                                        "
                                    >
                                        <h3>
                                            {{
                                                index2 === 0
                                                    ? "一级报警"
                                                    : "二级报警"
                                            }}
                                            <template
                                                v-if="
                                                    infoItem.length > 1 &&
                                                    levelItem.speed
                                                "
                                            >
                                                <i class="el-icon-warning"></i>
                                                <span class="warning-msg"
                                                    >二级报警的判断速度阈值必须比一级报警的判断速度阈值≥20</span
                                                >
                                            </template>
                                        </h3>
                                        <el-form-item
                                            label="报警使能"
                                            v-if="levelItem.enable"
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].enable
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警判断速度阈值"
                                            :prop="`param938_${chanNoItem.chanNo}_${levelItem.type}.info[0].speed`"
                                            :rules="rules.speed"
                                            v-if="levelItem.speed"
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].speed
                                                "
                                                :min="levelItem.speed.min"
                                                :max="levelItem.speed.max"
                                                @change="
                                                    (e) =>
                                                        speedBlur(
                                                            chanNoItem,
                                                            key
                                                        )
                                                "
                                                data-unit="km/h"
                                                @blur="
                                                    (e) => {
                                                        if (
                                                            e.target.value ===
                                                            ''
                                                        ) {
                                                            newForm[
                                                                `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                            ].info[0].speed =
                                                                Number(
                                                                    e.target
                                                                        .ariaValueMin
                                                                );
                                                        }
                                                    }
                                                "
                                            ></el-input-number>
                                        </el-form-item>
                                        <el-form-item
                                            label="音量使能"
                                            v-if="levelItem.volumeEnable"
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].volumeEnable
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警音量"
                                            v-if="levelItem.volume"
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].volume
                                                "
                                                :min="levelItem.volume.min"
                                                :max="levelItem.volume.max"
                                                @blur="
                                                    (e) => {
                                                        if (
                                                            e.target.value ===
                                                            ''
                                                        ) {
                                                            newForm[
                                                                `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                            ].info[0].volume =
                                                                Number(
                                                                    e.target
                                                                        .ariaValueMin
                                                                );
                                                        }
                                                    }
                                                "
                                            ></el-input-number>
                                        </el-form-item>

                                        <el-form-item
                                            label="抓图张数"
                                            v-if="
                                                levelItem.snapshot &&
                                                levelItem.snapshot.number
                                            "
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].snapshot.number
                                                "
                                                :min="
                                                    levelItem.snapshot.number
                                                        .min
                                                "
                                                :max="
                                                    levelItem.snapshot.number
                                                        .max
                                                "
                                                data-unit="张"
                                                @blur="
                                                    (e) => {
                                                        if (
                                                            e.target.value ===
                                                            ''
                                                        ) {
                                                            newForm[
                                                                `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                            ].info[0].snapshot.number =
                                                                Number(
                                                                    e.target
                                                                        .ariaValueMin
                                                                );
                                                        }
                                                    }
                                                "
                                            ></el-input-number>
                                        </el-form-item>
                                        <el-form-item
                                            label="抓图间隔"
                                            v-if="
                                                levelItem.snapshot &&
                                                levelItem.snapshot.interval
                                            "
                                        >
                                            <el-select
                                                v-model="
                                                    newForm[
                                                        `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].snapshot.interval
                                                "
                                            >
                                                <el-option
                                                    v-for="item in levelItem
                                                        .snapshot.interval"
                                                    :label="`${item * 100}毫秒`"
                                                    :value="item"
                                                    :key="item"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- <el-form-item
                                            label="算法置信度"
                                            v-if="
                                                newForm[
                                                    `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                ].info[0].hasOwnProperty(
                                                    'confidence'
                                                )
                                            "
                                        >
                                            <el-select
                                                v-model="
                                                    newForm[
                                                        `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].confidence
                                                "
                                            >
                                                <el-option
                                                    v-for="item in levelItem.confidenceList"
                                                    :label="item.label"
                                                    :value="item.value"
                                                    :key="item.value"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item> -->
                                        <el-form-item
                                            label="算法灵敏度"
                                            introduction="灵敏度越高越容易触发报警"
                                            v-if="levelItem.sensitivity"
                                        >
                                            <span
                                                slot="label"
                                                class="label-slot"
                                                >算法灵敏度
                                                <el-tooltip
                                                    content="灵敏度越高越容易触发报警"
                                                >
                                                    <i
                                                        class="el-icon-question"
                                                    ></i> </el-tooltip
                                            ></span>
                                            <el-select
                                                v-model="
                                                    newForm[
                                                        `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].sensitivity
                                                "
                                            >
                                                <el-option
                                                    v-for="item in levelItem.sensitivityList"
                                                    :label="item.label"
                                                    :value="item.value"
                                                    :key="item.value"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警图片上传使能"
                                            v-if="
                                                levelItem.snapshot &&
                                                levelItem.snapshot.upload
                                            "
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].snapshot.upload
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                                @change="
                                                    (val) =>
                                                        uploadChange(
                                                            val,
                                                            'snapshot',
                                                            chanNoItem.chanNo,
                                                            levelItem.type
                                                        )
                                                "
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警视频上传使能"
                                            v-if="
                                                levelItem.clip &&
                                                levelItem.clip.upload
                                            "
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].clip.upload
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                                @change="
                                                    (val) =>
                                                        uploadChange(
                                                            val,
                                                            'clip',
                                                            chanNoItem.chanNo,
                                                            levelItem.type
                                                        )
                                                "
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警抑制时间"
                                            v-if="levelItem.inhibitionTime"
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].inhibitionTime
                                                "
                                                :min="
                                                    levelItem.inhibitionTime
                                                        .rangeMin
                                                "
                                                :max="
                                                    levelItem.inhibitionTime
                                                        .rangeMax
                                                "
                                                data-unit="s"
                                                @blur="
                                                    (e) => {
                                                        if (
                                                            e.target.value ===
                                                            ''
                                                        ) {
                                                            newForm[
                                                                `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                            ].info[0].inhibitionTime =
                                                                Number(
                                                                    e.target
                                                                        .ariaValueMin
                                                                );
                                                        }
                                                    }
                                                "
                                            ></el-input-number>
                                        </el-form-item>
                                        <el-form-item
                                            label="事件上传平台使能"
                                            v-if="levelItem.uploadEventPlatform"
                                        >
                                            <el-select
                                                v-model="
                                                    newForm[
                                                        `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0]
                                                        .uploadEventPlatform
                                                "
                                                multiple
                                                collapse-tags
                                            >
                                                <el-option
                                                    v-for="item in levelItem[
                                                        'uploadEventPlatform'
                                                    ]"
                                                    :label="
                                                        Number(item) - 1 ===
                                                        Number(
                                                            capability.network
                                                                .isHikPlatform
                                                        )
                                                            ? '海康云平台'
                                                            : '第' +
                                                              item +
                                                              '中心'
                                                    "
                                                    :value="item"
                                                    :key="item"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item
                                            label="标定检测区域"
                                            v-if="false"
                                        >
                                            <!-- v-if="levelItem.area" -->
                                            <el-button
                                                @click="
                                                    openSurvey({
                                                        chanNo: chanNoItem.chanNo,
                                                        type: levelItem.type,
                                                    })
                                                "
                                                >设置</el-button
                                            >
                                        </el-form-item>
                                        <el-form-item
                                            label="联动抓拍的通道"
                                            v-if="
                                                levelItem.snapshot &&
                                                levelItem.snapshot
                                                    .linkChannel &&
                                                levelItem.snapshot.linkChannel
                                                    .length
                                            "
                                        >
                                            <el-select
                                                v-model="
                                                    newForm[
                                                        `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].snapshot
                                                        .linkChannel
                                                "
                                                :multiple-limit="
                                                    levelItem.snapshot
                                                        .maxLinkChannel || 0
                                                "
                                                multiple
                                                collapse-tags
                                            >
                                                <el-option
                                                    v-for="item in levelItem
                                                        .snapshot.linkChannel"
                                                    :label="`通道${item}`"
                                                    :value="item"
                                                    :key="item"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </template>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </div>
            </div>
        </el-form>
        <div id="id" style="width: 0; height: 0"></div>
        <el-dialog
            title="标定检测区域"
            :visible.sync="openSurveyBol"
            size="small"
            :before-close="handleClose"
            append-to-body
        >
            <el-switch
                v-model="isPlugin"
                active-text="插件"
                inactive-text="无插件"
                class="m-l"
                v-if="!isTemplate"
                :disabled="pluginLoading"
            >
            </el-switch>
            <!-- 加入控件 -->
            <a
                type="text"
                class="m-r"
                style="float: right; line-height: 32px"
                @click="reDownLoad"
                v-if="notLastVerson && !isTemplate"
                >发现新控件版本</a
            >
            <div class="divHeight" v-if="openSurveyBol && !isPlugin">
                <WHDNoPlugin
                    v-if="openSurveyBol"
                    ref="WHDNoPlugin"
                    :playUrl="playUrl"
                    @cancelSurveyBol="cancelSurveyBol"
                    @saveSurveyBol="saveSurveyBol"
                    :isTemplate="isTemplate"
                ></WHDNoPlugin>
                <!-- <div class="h-full inline" style="height:100%;width:100%;" id="videoPlay_WHD"></div> -->
                <!--控件版本-->
            </div>
            <div class="divHeight" v-show="openSurveyBol && isPlugin">
                <div id="AEStreamWebVersion" style="width: 0; height: 0"></div>

                <div
                    v-show="!noneVideoPlay"
                    class="h-full inline"
                    style="height: 100%; width: 100%"
                    id="videoPlay_WHD"
                ></div>
                <div
                    v-if="noneVideoPlay"
                    class="h-full flex-layout flex-middle flex-center"
                >
                    <div class="text-center">
                        <h4>Web控件未运行</h4>
                        <p class="text-xs text-muted m-y text-center">
                            请尝试以下办法：
                        </p>
                        <div class="text-xs text-center">
                            <span
                                >1）本机尚未安装Web控件，请先安装，安装完成后刷新当前页面！</span
                            >
                            <a @click="downloadOcx">安装</a>
                            <a @click="refreshPage">刷新</a>
                        </div>
                        <div class="text-xs text-center">
                            <span
                                >2）本机已安装Web控件，请先启动服务后刷新当前页面！</span
                            >
                            <a @click="wakeUpOcx">启动</a>
                            <a @click="refreshPage">刷新</a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="openSurveyBol=false">确 定</el-button>
        <el-button @click="openSurveyBol = false">取 消</el-button> -->
            <!-- </span> -->
        </el-dialog>
    </div>
</template>
<script>
import { WebControl } from "web-control";
import mixins from "@/mixins/mixins";
import ocxWebControl from "@/utils/ocxWebControl";
import WHDNoPlugin from "@/components/webControlService/configuration/whd.vue";
export default {
    name: "WHD-Params",
    mixins: [mixins],
    components: { WHDNoPlugin },
    props: {},
    data() {
        const validateNumber = (rule, value, callback) => {
            if (
                this.newForm[rule.field.split(".")[0]].info[0].enable &&
                value < this.getSpeedValue()
            ) {
                callback(new Error(`WHD速度阈值不能小于BSD速度阈值`));
            } else {
                callback();
            }
        };
        return {
            isPlugin: false,
            playUrl: "",
            componentsName: "platformParams",
            setForm: {},
            chanNoActive: "",
            WHDList: [],
            activeCollapse: [],
            openSurveyBol: false,
            dialogClick: false,
            noneVideoPlay: false, // 是否显示控件
            notLastVerson: false,
            surveyObj: {},
            typeObj: {},
            firstType: null,
            rules: {
                speed: [
                    {
                        required: false,
                        validator: validateNumber,
                        trigger: "change",
                    },
                ],
            },
            pluginLoading: false,
            pluginTimeout: null,
        };
    },
    activated() {
        this.$nextTick(() => {
            this.labelWidthResize();
        });
    },
    mounted() {
        setTimeout(() => {
            if (null == this.webVersionControl) {
                this.webVersionControl = this.initWebControl(
                    this.webVersionControl,
                    "AEStreamWebVersion",
                    0,
                    0
                );
            }
        }, 2000);
        window.addEventListener("scroll", () => {
            if (this.videoPlayControl != null) {
                let box = document.getElementById("videoPlay_WHD");
                let offsetHeight = box.offsetHeight;
                let offsetWidth = box.offsetWidth;
                ocxWebControl.pageScroll(
                    this.videoPlayControl,
                    "videoPlay_WHD",
                    offsetWidth,
                    offsetHeight
                );
            }
        });
        //监听窗口拉伸
        window.addEventListener("resize", () => {
            if (this.videoPlayControl != null) {
                let box = document.getElementById("videoPlay_WHD");
                let offsetHeight = box.offsetHeight;
                let offsetWidth = box.offsetWidth;
                ocxWebControl.pageResize(
                    this.videoPlayControl,
                    "videoPlay_WHD",
                    offsetWidth,
                    offsetHeight
                );
            }
        });
        this.initConfig();
    },
    computed: {
        setTemplateHide() {
            return function (chanNoItem, infoItem) {
                if (this.isTemplate || this.$route.query.isTemplate) {
                    let bol = false;
                    infoItem.forEach((infoItem) => {
                        if (
                            this.newForm[
                                `param938_${chanNoItem.chanNo}_${infoItem.type}`
                            ]
                        ) {
                            bol = true;
                        }
                    });
                    return !bol;
                } else {
                    return false;
                }
            };
        },
    },
    watch: {
        isPlugin: {
            handler(val, oldVal) {
                if (this.pluginTimeout) {
                    clearTimeout(this.pluginTimeout);
                    this.pluginTimeout = null;
                }
                if (this.videoPlayControl != null) {
                    this.pluginLoading = false;
                    this.videoPlayControl.JS_DestroyWnd().then(
                        () => {},
                        () => {}
                    );
                }

                if (val) {
                    this.pluginLoading = true;
                    this.$refs.WHDNoPlugin.cancel(false);
                }

                this.openSurvey(this.surveyObj);
                this.pluginTimeout = setTimeout(() => {
                    this.pluginLoading = false;
                }, 2000);
            },
            deep: true,
        },
        openSurveyBol: {
            handler(newVal) {
                if (!newVal) {
                    this.dialogClick = newVal;
                    this.SurveyBol();
                }
            },
        },
        chanNoActive(val) {
            this.activeCollapse = [];
            let obj = this.WHDList.find(
                (item) => item.chanNo == Number(val.split("通道")[1])
            );
            this.setActiveCollapse();
        },
        newForm: {
            handler(val) {
                if (val) {
                    this.WHDList.forEach((chanNoItem) => {
                        let _type = Object.entries(chanNoItem.info)[0][0].split(
                            "-"
                        )[0];
                        if (val[`param938_${chanNoItem.chanNo}_${_type}`]) {
                            if (
                                !this.setForm.hasOwnProperty(
                                    `通道${chanNoItem.chanNo}>WHD全局参数&param938_${chanNoItem.chanNo}_${_type}`
                                )
                            ) {
                                this.setForm[
                                    `通道${chanNoItem.chanNo}>WHD全局参数&param938_${chanNoItem.chanNo}_${_type}`
                                ] = {};
                            }
                            this.setForm[
                                `通道${chanNoItem.chanNo}>WHD全局参数&param938_${chanNoItem.chanNo}_${_type}`
                            ].enable =
                                val[`param938_${chanNoItem.chanNo}_${_type}`]
                                    .enable !=
                                this.oldForm[
                                    `param938_${chanNoItem.chanNo}_${_type}`
                                ].enable
                                    ? `param938_${
                                          chanNoItem.chanNo
                                      }_${_type}.enable&WHD算法使能switch&${
                                          val[
                                              `param938_${chanNoItem.chanNo}_${_type}`
                                          ].enable
                                      }`
                                    : null;
                            this.setForm[
                                `通道${chanNoItem.chanNo}>WHD全局参数&param938_${chanNoItem.chanNo}_${_type}`
                            ].linkChannel = this.isEqual(
                                val[`param938_${chanNoItem.chanNo}_${_type}`]
                                    .linkChannel,
                                this.oldForm[
                                    `param938_${chanNoItem.chanNo}_${_type}`
                                ].linkChannel
                            )
                                ? `param938_${
                                      chanNoItem.chanNo
                                  }_${_type}.linkChannel&联动抓拍的通道array&
                                  &${this.getLinkChannel(
                                      val[
                                          `param938_${chanNoItem.chanNo}_${_type}`
                                      ].linkChannel
                                  )}&${
                                      val[
                                          `param938_${chanNoItem.chanNo}_${_type}`
                                      ].linkChannel
                                  }`
                                : null;
                        }
                        for (let typeName of Object.keys(chanNoItem.info)) {
                            chanNoItem.info[typeName].forEach((typeItem) => {
                                if (
                                    val[
                                        `param938_${chanNoItem.chanNo}_${typeItem.type}`
                                    ]
                                ) {
                                    let paramStr = `param938_${chanNoItem.chanNo}_${typeItem.type}`;
                                    let objName = `通道${
                                        chanNoItem.chanNo
                                    }>${this.getLabelByType(
                                        typeItem.type
                                    )}&${paramStr}`;
                                    if (!this.setForm.hasOwnProperty(objName)) {
                                        this.setForm[objName] = {
                                            info: [{ snapshot: {}, clip: {} }],
                                        };
                                    }
                                    this.setForm[objName].info[0].enable =
                                        val[paramStr].info[0].enable !=
                                            this.oldForm[paramStr].info[0]
                                                .enable ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty("enable"))
                                            ? `${paramStr}.info.0.enable&报警使能switch&${val[paramStr].info[0].enable}`
                                            : null;
                                    this.setForm[objName].info[0].speed =
                                        val[paramStr].info[0].speed !=
                                            this.oldForm[paramStr].info[0]
                                                .speed ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty("speed"))
                                            ? `${paramStr}.info.0.speed&报警判断速度阈值number&${val[paramStr].info[0].speed}`
                                            : null;
                                    this.setForm[objName].info[0].volumeEnable =
                                        val[paramStr].info[0].volumeEnable !=
                                            this.oldForm[paramStr].info[0]
                                                .volumeEnable ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty(
                                                "volumeEnable"
                                            ))
                                            ? `${paramStr}.info.0.volumeEnable&音量使能switch&${val[paramStr].info[0].volumeEnable}`
                                            : null;
                                    this.setForm[objName].info[0].volume =
                                        val[paramStr].info[0].volume !=
                                            this.oldForm[paramStr].info[0]
                                                .volume ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty("volume"))
                                            ? `${paramStr}.info.0.volume&报警音量number&${val[paramStr].info[0].volume}`
                                            : null;
                                    // this.setForm[objName].info[0].confidence =
                                    //     val[paramStr].info[0].confidence !=
                                    //     this.oldForm[paramStr].info[0]
                                    //         .confidence
                                    //         ? `${paramStr}.info.0.confidence&算法置信度&${this.getLabelSelf(
                                    //               typeItem.confidenceList,
                                    //               val[paramStr].info[0]
                                    //                   .confidence
                                    //           )}&${
                                    //               val[paramStr].info[0]
                                    //                   .confidence
                                    //           }`
                                    //         : null;
                                    this.setForm[objName].info[0].sensitivity =
                                        val[paramStr].info[0].sensitivity !=
                                            this.oldForm[paramStr].info[0]
                                                .sensitivity ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty(
                                                "sensitivity"
                                            ))
                                            ? `${paramStr}.info.0.sensitivity&算法灵敏度number&${this.getLabelSelf(
                                                  typeItem.sensitivityList,
                                                  val[paramStr].info[0]
                                                      .sensitivity
                                              )}&${
                                                  val[paramStr].info[0]
                                                      .sensitivity
                                              }`
                                            : null;
                                    this.setForm[
                                        objName
                                    ].info[0].snapshot.upload =
                                        val[paramStr].info[0].snapshot.upload !=
                                            this.oldForm[paramStr].info[0]
                                                .snapshot.upload ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].snapshot.hasOwnProperty(
                                                "upload"
                                            ))
                                            ? `${paramStr}.info.0.snapshot.upload&报警图片上传使能switch&${val[paramStr].info[0].snapshot.upload}`
                                            : null;
                                    this.setForm[objName].info[0].clip.upload =
                                        val[paramStr].info[0].clip.upload !=
                                            this.oldForm[paramStr].info[0].clip
                                                .upload ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].clip.hasOwnProperty(
                                                "upload"
                                            ))
                                            ? `${paramStr}.info.0.clip.upload&报警视频上传使能switch&${val[paramStr].info[0].clip.upload}`
                                            : null;
                                    this.setForm[
                                        objName
                                    ].info[0].snapshot.number =
                                        val[paramStr].info[0].snapshot.number !=
                                            this.oldForm[paramStr].info[0]
                                                .snapshot.number ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].snapshot.hasOwnProperty(
                                                "number"
                                            ))
                                            ? `${paramStr}.info.0.snapshot.number&抓图张数number&${val[paramStr].info[0].snapshot.number}`
                                            : null;
                                    this.setForm[
                                        objName
                                    ].info[0].snapshot.interval =
                                        val[paramStr].info[0].snapshot
                                            .interval !=
                                            this.oldForm[paramStr].info[0]
                                                .snapshot.interval ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].snapshot.hasOwnProperty(
                                                "interval"
                                            ))
                                            ? `${paramStr}.info.0.snapshot.interval&抓图间隔number&${
                                                  Number(
                                                      val[paramStr].info[0]
                                                          .snapshot.interval
                                                  ) * 100
                                              }毫秒&${
                                                  val[paramStr].info[0].snapshot
                                                      .interval
                                              }`
                                            : null;

                                    this.setForm[
                                        objName
                                    ].info[0].inhibitionTime =
                                        val[paramStr].info[0].inhibitionTime !=
                                            this.oldForm[paramStr].info[0]
                                                .inhibitionTime ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty(
                                                "inhibitionTime"
                                            ))
                                            ? `${paramStr}.info.0.inhibitionTime&报警抑制时间number&${val[paramStr].info[0].inhibitionTime}`
                                            : null;
                                    this.setForm[
                                        objName
                                    ].info[0].uploadEventPlatform =
                                        this.isEqual(
                                            val[paramStr].info[0]
                                                .uploadEventPlatform,
                                            this.oldForm[paramStr].info[0]
                                                .uploadEventPlatform
                                        ) ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty(
                                                "uploadEventPlatform"
                                            ))
                                            ? `${paramStr}.info.0.uploadEventPlatform&事件上传平台使能array&${this.getUploadEventPlatform(
                                                  val[paramStr].info[0]
                                                      .uploadEventPlatform
                                              )}&${
                                                  val[paramStr].info[0]
                                                      .uploadEventPlatform
                                              }`
                                            : null;
                                    this.setForm[objName].info[0].area =
                                        JSON.stringify(
                                            val[paramStr].info[0].area
                                        ) !=
                                            JSON.stringify(
                                                this.oldForm[paramStr].info[0]
                                                    .area
                                            ) ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty("area"))
                                            ? `${paramStr}.info.0.area&标定检测区域&新区域&${JSON.stringify(
                                                  val[paramStr].info[0].area
                                              )}`
                                            : null;
                                    this.setForm[
                                        objName
                                    ].info[0].snapshot.linkChannel =
                                        this.isEqual(
                                            val[paramStr].info[0].snapshot
                                                .linkChannel,
                                            this.oldForm[paramStr].info[0]
                                                .snapshot.linkChannel
                                        ) ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].snapshot.hasOwnProperty(
                                                "linkChannel"
                                            ))
                                            ? `${paramStr}.info.0.snapshot.linkChannel&联动抓拍的通道array&${this.getLinkChannel(
                                                  val[paramStr].info[0].snapshot
                                                      .linkChannel
                                              )}&${
                                                  val[paramStr].info[0].snapshot
                                                      .linkChannel
                                              }`
                                            : null;
                                }
                            });
                        }
                    });
                    this.$emit("setFormChange", {
                        WHD: this.setForm,
                    });
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        getSpeedValue() {
            let speedArr = [-1];
            for (let key of Object.keys(this.newForm)) {
                if (key.indexOf("param920") > -1) {
                    this.newForm[key].info.forEach((item) => {
                        if (item.enable && typeof item.speed === "number") {
                            speedArr.push(item.speed);
                        }
                    });
                }
            }
            return Math.max(...speedArr);
        },
        handleClose(done) {
            if (!this.isPlugin) this.$refs.WHDNoPlugin.cancel(true);
            else {
                done();
            }
        },
        initConfig() {
            this.$emit("setFormLoading", true);
            let initConfigList = [];
            this.WHDList = [];
            this.chanNoActive = `通道${this.capability.intelliDrive_WHD[0].chanNo}`;
            this.capability.intelliDrive_WHD.forEach((chanNoItem) => {
                let obj = {
                    ...chanNoItem,
                    info: {},
                };
                chanNoItem.info.forEach((infoItem) => {
                    /* --------------------算法灵敏度 start-------------------------*/
                    infoItem.sensitivityList = [];
                    if (infoItem.sensitivity) {
                        // let sensitivityRange =
                        //     infoItem.sensitivity.max - infoItem.sensitivity.min;
                        // let sensitivityLow =
                        //     infoItem.sensitivity.min +
                        //     parseInt(sensitivityRange / 6);
                        // let sensitivityMiddle =
                        //     infoItem.sensitivity.min +
                        //     parseInt(sensitivityRange / 2);
                        // let sensitivityHigh =
                        //     infoItem.sensitivity.min +
                        //     parseInt((sensitivityRange * 5) / 6);
                        // infoItem.sensitivityRange = sensitivityRange;
                        // infoItem.sensitivityList = [
                        //     {
                        //         value: sensitivityLow,
                        //         label: "低",
                        //     },
                        //     {
                        //         value: sensitivityMiddle,
                        //         label: "中",
                        //     },
                        //     {
                        //         value: sensitivityHigh,
                        //         label: "高",
                        //     },
                        // ];
                        switch (infoItem.type) {
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                                infoItem.sensitivityList = [
                                    {
                                        value: 8,
                                        label: "低",
                                    },
                                    {
                                        value: 5,
                                        label: "中",
                                    },
                                    {
                                        value: 3,
                                        label: "高",
                                    },
                                ];
                                break;
                            case 5:
                            case 6:
                                infoItem.sensitivityList = [
                                    {
                                        value: 6,
                                        label: "低",
                                    },
                                    {
                                        value: 4,
                                        label: "中",
                                    },
                                    {
                                        value: 3,
                                        label: "高",
                                    },
                                ];
                                break;
                        }
                    }
                    /* --------------------算法灵敏度 end-------------------------*/
                    /* --------------------算法置信度 start-------------------------*/
                    infoItem.confidenceList = [];
                    if (infoItem.confidence) {
                        let confidenceRange =
                            infoItem.confidence.max - infoItem.confidence.min;
                        let confidenceLow =
                            infoItem.confidence.min +
                            parseInt(confidenceRange / 6);
                        let confidenceMiddle =
                            infoItem.confidence.min +
                            parseInt(confidenceRange / 2);
                        let confidenceHigh =
                            infoItem.confidence.min +
                            parseInt((confidenceRange * 5) / 6);
                        infoItem.confidenceRange = confidenceRange;
                        infoItem.confidenceList = [
                            {
                                value: confidenceLow,
                                label: "低",
                            },
                            {
                                value: confidenceMiddle,
                                label: "中",
                            },
                            {
                                value: confidenceHigh,
                                label: "高",
                            },
                        ];
                    }
                    /* --------------------算法置信度 end-------------------------*/
                    for (let key of Object.keys(
                        this.enumerationJSON["intelliDrive_WHD_type"]
                    )) {
                        if (
                            this.enumerationJSON["intelliDrive_WHD_type"][
                                key
                            ].indexOf(infoItem.type) > -1
                        ) {
                            if (!obj.info.hasOwnProperty(key)) {
                                obj.info[key] = [];
                            }
                            obj.info[key].push(infoItem);
                            if (!this.activeCollapse.length) {
                                this.activeCollapse.push(key.split("-")[1]);
                            }
                        }
                    }
                    initConfigList.push(
                        this.getEHomeConfig(
                            938,
                            {
                                type: infoItem.type,
                                chanNo: chanNoItem.chanNo,
                            },
                            "WHD"
                        )
                    );
                });
                this.WHDList.push(obj);
            });
            Promise.all(initConfigList).then((result) => {
                this.$emit("setFormLoading", false);
                this.$emit("loadingSuccess");
                this.typeObj = {};
                this.WHDList.forEach((item) => {
                    this.typeObj[item.chanNo] = Object.entries(
                        item.info
                    ).reduce((prev, cur) => {
                        let arr = [];
                        cur[1].forEach((k) => {
                            arr.push(k.type);
                        });
                        return prev.concat(arr);
                    }, []);
                });
                let chanNo = this.chanNoActive.split("通道")[1];
                this.firstType = Number(
                    this.typeObj[chanNo].find((type) => {
                        if (this.newForm[`param938_${chanNo}_${type}`]) {
                            return type + "";
                        }
                    })
                );
                for (let key of Object.keys(
                    this.enumerationJSON["intelliDrive_WHD_type"]
                )) {
                    if (
                        this.enumerationJSON["intelliDrive_WHD_type"][
                            key
                        ].indexOf(this.firstType) > -1 &&
                        !this.activeCollapse.length
                    ) {
                        this.activeCollapse.push(key.split("-")[1]);
                    }
                }
                this.setActiveCollapse();
            });
        },
        setActiveCollapse() {
            let chanNo = this.chanNoActive.split("通道")[1];
            if (this.typeObj && this.typeObj[chanNo]) {
                this.firstType = Number(
                    this.typeObj[chanNo].find((type) => {
                        if (this.newForm[`param938_${chanNo}_${type}`]) {
                            return type;
                        }
                    })
                );
                for (let key of Object.keys(
                    this.enumerationJSON["intelliDrive_WHD_type"]
                )) {
                    if (
                        this.enumerationJSON["intelliDrive_WHD_type"][
                            key
                        ].indexOf(this.firstType) > -1 &&
                        !this.activeCollapse.length
                    ) {
                        this.activeCollapse.push(key.split("-")[1]);
                    }
                }
            }
        },
        getLabelByType(type) {
            let label = "";
            for (let key of Object.keys(
                this.enumerationJSON["intelliDrive_WHD_type"]
            )) {
                let index =
                    this.enumerationJSON["intelliDrive_WHD_type"][key].indexOf(
                        type
                    );
                if (index === 0) {
                    label = key + ">一级报警";
                } else if (index === 1) {
                    label = key + ">二级报警";
                }
            }
            return label.split("-")[1];
        },
        getLabelSelf(arr, val) {
            let obj = arr.find((e) => e.value === val);
            if (obj) {
                return obj.label;
            }
        },
        getLabelSelfArr(arr, val) {
            return val
                .reduce((prev, cur) => {
                    return prev.concat(arr.find((e) => e.value === cur).label);
                }, [])
                .join("，");
        },
        collapseChange(val) {
            if (val.length) {
                setTimeout(() => {
                    this.labelWidthResize();
                }, 300);
            }
        },
        // 检查版本
        initWebControl(obj, id, height, width) {
            let that = this;
            return (obj = new WebControl({
                szPluginContainer: id,
                iServicePortStart: 14450, // 对应 LocalServiceConfig.xml 中的ServicePortStart值
                iServicePortEnd: 14452, // 对应 LocalServiceConfig.xml 中的ServicePortEnd值
                szClassId: "58BC9428-61BE-4F39-ABA3-89452662A4A0",
                cbConnectSuccess: () => {
                    obj.JS_StartService("window", {
                        dllPath: "./WebVersion.dll",
                    }).then(
                        () => {
                            obj.JS_CreateWnd("id", width, height).then(
                                function () {
                                    obj.JS_RequestInterface({
                                        funcName: "GetControlVersion",
                                        arguments: {},
                                    }).then((oData) => {
                                        if (oData.responseMsg.error === 0) {
                                            //获取版本号成功
                                            let pluginVersion =
                                                oData.responseMsg.version.toString();
                                            let params = {
                                                pluginVersion: pluginVersion,
                                            };
                                            //调用比对接口
                                            that.$api
                                                .comparePluginVersion(params)
                                                .then((res) => {
                                                    if (res.success) {
                                                        let isLastVerson =
                                                            res.data;
                                                        if (isLastVerson) {
                                                            // that.$message.info(
                                                            //     "当前Web控件版本已经是最新的！"
                                                            // );
                                                            that.notLastVerson = false;
                                                        } else {
                                                            // that.$confirm('当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面。', {
                                                            //   confirmButtonText: '确定',
                                                            //   cancelButtonText: '取消',
                                                            //   onConfirm:() => { that.downloadOcx(); },
                                                            //   onCancel:() => {}
                                                            // })
                                                            that.notLastVerson = true;
                                                            document.body.scrollTop =
                                                                document.documentElement.scrollTop = 0;
                                                            // that.$Modal.confirm({
                                                            //   content: '<h3 class="m-b-sm">当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面</h3>',
                                                            //   onOk: () => {
                                                            //       that.downloadOcx();
                                                            //   },
                                                            //   onCancel: () => {}
                                                            // });
                                                            that.$confirm(
                                                                "当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面。",
                                                                this.$t(
                                                                    "common.prompt"
                                                                ),
                                                                {
                                                                    confirmButtonText:
                                                                        this.$t(
                                                                            "common.ok"
                                                                        ),
                                                                    cancelButtonText:
                                                                        this.$t(
                                                                            "common.cancel"
                                                                        ),
                                                                    type: "warning",
                                                                }
                                                            )
                                                                .then(() => {
                                                                    that.downloadOcx();
                                                                })
                                                                .catch(
                                                                    () => {}
                                                                );
                                                        }
                                                    } else {
                                                        that.$message.error(
                                                            "调用控件版本比对接口失败！"
                                                        );
                                                    }
                                                });
                                        } else {
                                            that.$message.error(
                                                "查询控件版本号失败！"
                                            );
                                        }
                                    });
                                }
                            );
                        },
                        function () {
                            that.$message.error("查询版本控件启动失败!!!!");
                        }
                    );
                },
                cbConnectError: () => {
                    obj = null;
                    this.webVersionControl = null;
                },
                cbConnectClose: () => {
                    obj = null;
                    this.webVersionControl = null;
                },
            }));
        },
        // 安装
        downloadOcx() {
            this.$api.getBinFileConfigDownloadUrl().then((res) => {
                let url = "";
                if (res.success && !!res.data) {
                    url = res.data;
                    let elemIF = document.createElement("iframe");
                    elemIF.src = url;
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                    setTimeout(() => {
                        document.body.removeChild(elemIF);
                    }, 2000);
                } else {
                    this.$message.error("获取控件URL失败:" + res.msg);
                }
            });
        },
        refreshPage() {
            location.reload();
        },
        wakeUpOcx() {
            WebControl.JS_WakeUp("HATConfigCtrlPlugin://");
        },
        reDownLoad() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            this.$confirm(
                "当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面。",
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.downloadOcx();
                })
                .catch(() => {});
        },
        openSurvey(chanNoItem) {
            if (
                !this.isTemplate &&
                (this.deviceInfo.deviceStatus == 0 ||
                    (this.deviceInfo.deviceStatus == 2 &&
                        this.deviceInfo.dormantStatus == 1))
            ) {
                this.$message.warning(
                    `设备处于${
                        this.deviceInfo.deviceStatus == 0 ? "离线" : "深休眠"
                    }状态，无法进行标定操作！`
                );
                return;
            }
            this.surveyObj = chanNoItem;
            let areaArr =
                this.newForm[`param938_${chanNoItem.chanNo}_${this.firstType}`]
                    .info[0].area;
            this.dialogClick = true;
            this.openSurveyBol = true;
            let areaContent = [];

            areaArr.forEach((item, index) => {
                item.forEach((item_) => {
                    areaContent.push({
                        x: parseInt(item_.x),
                        y: parseInt(item_.y),
                    });
                });
            });
            let params = {
                deviceId: this.$route.query.deviceId || null,
                channelNo: this.chanNoActive.split("通道")[1],
                protocolType: this.isPlugin ? 0 : 3, //取流协议类型：0-RTSP，1-RTMP，2-HLS，3-WEBSOCKET，4-HTTP_FLV
            };
            this.$api.previewPlay(params).then((res) => {
                if (res.success) {
                    this.playUrl = res.data;
                } else {
                    // this.$message.error("预览失败" + res.msg);
                }
                this.$nextTick(() => {
                    if (!this.isPlugin) {
                        this.$refs.WHDNoPlugin.openHatPlugin(
                            this.playUrl,
                            areaContent,
                            !this.isTemplate,
                            "private"
                        );
                    } else {
                        // 插件忽略 202306
                        this.noneVideoPlay = false;
                        let box = document.getElementById("videoPlay_WHD");
                        let offsetHeight = box.offsetHeight;
                        let offsetWidth = box.offsetWidth;
                        this.videoPlayControl = this.initWebOcx(
                            this.videoPlayControl,
                            "videoPlay_WHD",
                            offsetWidth,
                            offsetHeight,
                            areaContent
                        );
                        setTimeout(() => {
                            this.webVersionControl = this.initWebControl(
                                this.webVersionControl,
                                "AEStreamWebVersion",
                                0,
                                0
                            );
                        }, 2000);
                    }
                });
            });
        },
        initWebOcx(obj, id, width, height, item) {
            let this_ = this;
            return (obj = new WebControl({
                szPluginContainer: id,
                iServicePortStart: 14450, // 对应 LocalServiceConfig.xml 中的ServicePortStart值
                iServicePortEnd: 14452, // 对应 LocalServiceConfig.xml 中的ServicePortEnd值
                szClassId: "58BC9428-61BE-4F39-ABA3-89452662A4A0",
                cbConnectSuccess: () => {
                    obj.JS_StartService("window", {
                        dllPath: "./WebAreaCalibration.dll",
                    }).then(
                        () => {
                            this_.setCallbacks();
                            obj.JS_CreateWnd(id, width, height).then(
                                function () {
                                    obj
                                        .JS_RequestInterface({
                                            funcName: "SetWHDAreaParams",
                                            arguments: {
                                                devSerialNum: "E61911993",
                                                deviceType: "AE-AC3141-A",
                                                // areas:item,
                                                defaultPolygon: [
                                                    { x: 298, y: 253 },
                                                    { x: 159, y: 507 },
                                                    { x: 291, y: 682 },
                                                    { x: 456, y: 507 },
                                                ],
                                                polygon: item,
                                            },
                                        })
                                        .then(function (oData) {
                                            //showCBInfo(JSON.stringify(oData.responseMsg));
                                        }),
                                        obj
                                            .JS_RequestInterface({
                                                funcName: "StartRealPlay",
                                                arguments: {
                                                    playUrl: this_.playUrl,
                                                },
                                            })
                                            .then((oData) => {
                                                this_.pluginLoading = false;
                                            });
                                }
                            );
                        },
                        function () {
                            this.$message.error("控件服务启动失败！");
                        }
                    );
                },
                // getWHDArea(){
                //   this.videoPlayControl.obj.JS_RequestInterface({
                //     funcName:'WHDAreaParamsChanged',
                //   })
                // },

                cbConnectError: () => {
                    obj = null;
                    this.noneVideoPlay = true;
                    this.videoPlayControl = null;
                    //this.$message.error('控件连接失败！');
                },
                cbConnectClose: (bNormalClose) => {
                    if (!bNormalClose) {
                        obj = null;
                        this.noneVideoPlay = true;
                        this.videoPlayControl = null;
                        //this.$message.error('控件连接异常断开');
                        //obj.JS_WakeUp("HATWebCtrlPlugin://");
                    }
                    return null;
                },
            }));
        },
        setCallbacks() {
            if (this.videoPlayControl) {
                this.videoPlayControl.JS_SetWindowControlCallback({
                    cbIntegrationCallBack: this.cbIntegrationCallBack,
                });
            }
        },
        cancelSurveyBol() {
            this.openSurveyBol = false;
        },
        saveSurveyBol(whdInfo) {
            let dataArr = [[]];
            whdInfo.forEach((item) => {
                dataArr[0].push({
                    x: item.x,
                    y: item.y,
                });
            });
            for (let infoItem in this.surveyObj.info) {
                this.surveyObj.info[infoItem].forEach((typeItem) => {
                    this.newForm[
                        `param938_${this.surveyObj.chanNo}_${typeItem.type}`
                    ].info[0].area = dataArr;
                });
            }
            this.$message.success("设置成功，点击下发至终端生效");
            this.openSurveyBol = false;
        },
        cbIntegrationCallBack(oData) {
            let dataArr = [[]];
            if (oData.responseMsg) {
                if (oData.responseMsg.event == "WHDAreaParamsChanged") {
                    oData.responseMsg.msg.polygon.forEach((item) => {
                        dataArr[0].push({
                            x: item.x,
                            y: item.y,
                        });
                    });
                    for (let infoItem in this.surveyObj.info) {
                        this.surveyObj.info[infoItem].forEach((typeItem) => {
                            this.newForm[
                                `param938_${this.surveyObj.chanNo}_${typeItem.type}`
                            ].info[0].area = dataArr;
                        });
                    }
                    this.$message.success("设置成功，点击下发至终端生效");
                    this.openSurveyBol = false;
                } else if (oData.responseMsg.event == "CancelBtnClicked") {
                    this.openSurveyBol = false;
                    return;
                } else if (oData.responseMsg.event == "RealPlayBtnClicked") {
                    // let params = {
                    //     deviceId: this.$route.query.deviceId || null,
                    //     channelNo: this.activeChannel,
                    // };
                    let params = {
                        deviceId: this.$route.query.deviceId || null,
                        channelNo: this.chanNoActive.split("通道")[1],
                        protocolType: this.isPlugin ? 0 : 3, //取流协议类型：0-RTSP，1-RTMP，2-HLS，3-WEBSOCKET，4-HTTP_FLV
                    };
                    this.$api.previewPlay(params).then((res) => {
                        if (res.success) {
                            this.playUrl = res.data;
                        } else {
                            this.$message.error("预览失败" + res.msg);
                        }
                        this.$nextTick(() => {
                            let box = document.getElementById("videoPlay_WHD");
                            this.videoPlayControl
                                .JS_RequestInterface({
                                    funcName: "StartRealPlay",
                                    arguments: {
                                        playUrl: this.playUrl,
                                    },
                                })
                                .then((oData) => {});
                        });
                    });
                }
            } else {
                this.$message.error("标定区画设置失败");
            }
        },
        SurveyBol() {
            // 插件忽略 202306
            if (this.isPlugin && this.videoPlayControl)
                this.videoPlayControl.JS_DestroyWnd().then(
                    () => {},
                    () => {}
                );
            this.openSurveyBol = false;
        },
        speedBlur(chanNoItem, key) {
            if (chanNoItem.info[key].length > 1 && !this.isTemplate) {
                if (
                    this.newForm[
                        `param938_${chanNoItem.chanNo}_${chanNoItem.info[key][1].type}`
                    ].info[0].speed -
                        this.newForm[
                            `param938_${chanNoItem.chanNo}_${chanNoItem.info[key][0].type}`
                        ].info[0].speed <
                    20
                ) {
                    this.$message.error(
                        `${
                            key.split("-")[1]
                        }一级报警与二级报警报警判断速度阈值小于20！`
                    );
                }
            }
        },
        uploadChange(val, attr, chanNo, type) {
            this.newForm[`param938_${chanNo}_${type}`].info[0][attr].save = val;
            this.$emit("formDataChange", `param938_${chanNo}_${type}`, {
                ...this.newForm[`param938_${chanNo}_${type}`],
            });
        },
        beforeChange(value, done) {
            if (value === 1) {
                this.$confirm(
                    "算法使能关闭后算法将不再运行，本次修改的报警项配置不再保留。",
                    "确定要关闭WHD算法使能吗？",
                    {
                        confirmButtonText: this.$t("common.ok"),
                        cancelButtonText: this.$t("common.cancel"),
                        type: "warning",
                    }
                )
                    .then(() => {
                        let chanNo = this.chanNoActive.split("通道")[1];
                        this.WHDList.forEach((chanNoItem) => {
                            if (Number(chanNoItem.chanNo) === Number(chanNo)) {
                                for (let typeName of Object.keys(
                                    chanNoItem.info
                                )) {
                                    chanNoItem.info[typeName].forEach(
                                        (typeItem) => {
                                            if (
                                                this.newForm[
                                                    `param938_${chanNo}_${typeItem.type}`
                                                ] &&
                                                this.oldForm[
                                                    `param938_${chanNo}_${typeItem.type}`
                                                ]
                                            ) {
                                                this.newForm[
                                                    `param938_${chanNo}_${typeItem.type}`
                                                ] = JSON.parse(
                                                    JSON.stringify(
                                                        this.oldForm[
                                                            `param938_${chanNo}_${typeItem.type}`
                                                        ]
                                                    )
                                                );
                                            }
                                        }
                                    );
                                }
                            }
                        });
                        done();
                    })
                    .catch(() => {});
            } else {
                done();
            }
        },
        enableChange(val, chanNoItem) {
            for (let typeItem of Object.keys(chanNoItem.info)) {
                chanNoItem.info[typeItem].forEach((levelItem) => {
                    if (
                        this.newForm[
                            `param938_${chanNoItem.chanNo}_${levelItem.type}`
                        ]
                    ) {
                        this.newForm[
                            `param938_${chanNoItem.chanNo}_${levelItem.type}`
                        ].enable = val;
                        this.$emit(
                            "formDataChange",
                            `param938_${chanNoItem.chanNo}_${levelItem.type}`,
                            {
                                ...this.newForm[
                                    `param938_${chanNoItem.chanNo}_${levelItem.type}`
                                ],
                            }
                        );
                    }
                });
            }
        },
    },
};
</script>
<style lang="less" scoped>
@import "./configurationForm.less";
.el-radio-group {
    margin-bottom: 20px;
}
.divHeight {
    height: 500px;
    width: 800;
}
</style>
