<template>
    <div class="configuration-form">
        <el-form
            :label-width="`${labelWidth}px`"
            :model="newForm"
            :inline="true"
            ref="form"
        >
            <el-radio-group type="simple" v-model="chanNoActive">
                <el-radio-button
                    v-for="(item, index) in ADList"
                    :key="index"
                    :label="`通道${item.chanNo}`"
                />
            </el-radio-group>
            <div>
                <div v-for="(chanNoItem, index) in ADList" :key="index">
                    <div v-show="`通道${chanNoItem.chanNo}` === chanNoActive">
                        <el-collapse
                            v-model="activeCollapse"
                            @change="collapseChange"
                        >
                            <el-collapse-item
                                v-for="(infoItem, key) in chanNoItem.info"
                                :key="key"
                                :title="key.split('-')[1]"
                                :name="key.split('-')[1]"
                                arrowPlacement="right"
                            >
                                <div
                                    v-for="(levelItem, index2) in infoItem"
                                    :key="index2"
                                >
                                    <template
                                        v-if="
                                            newForm[
                                                `param954_${chanNoItem.chanNo}_${levelItem.type}`
                                            ]
                                        "
                                    >
                                        <h3>
                                            {{
                                                index2 === 0
                                                    ? "一级报警"
                                                    : "二级报警"
                                            }}
                                        </h3>
                                        <el-form-item
                                            label="报警使能"
                                            v-if="levelItem.enable"
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param954_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].enable
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警判断速度阈值"
                                            v-if="levelItem.speed"
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param954_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].speed
                                                "
                                                :min="levelItem.speed.min"
                                                :max="levelItem.speed.max"
                                                data-unit="km/h"
                                                @blur="
                                                    (e) => {
                                                        if (
                                                            e.target.value ===
                                                            ''
                                                        ) {
                                                            newForm[
                                                                `param954_${chanNoItem.chanNo}_${levelItem.type}`
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
                                            label="报警音量"
                                            v-if="levelItem.volume"
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param954_${chanNoItem.chanNo}_${levelItem.type}`
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
                                                                `param954_${chanNoItem.chanNo}_${levelItem.type}`
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
                                            label="算法置信度"
                                            v-if="levelItem.confidence"
                                        >
                                            <el-select
                                                v-model="
                                                    newForm[
                                                        `param954_${chanNoItem.chanNo}_${levelItem.type}`
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
                                        </el-form-item>
                                        <el-form-item
                                            label="算法灵敏度"
                                            v-if="levelItem.sensitivity"
                                        >
                                            <el-select
                                                v-model="
                                                    newForm[
                                                        `param954_${chanNoItem.chanNo}_${levelItem.type}`
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
                                            label="检测持续时间"
                                            v-if="levelItem.detectInterval"
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param954_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].detectInterval
                                                "
                                                :min="
                                                    levelItem.detectInterval.min
                                                "
                                                :max="
                                                    levelItem.detectInterval.max
                                                "
                                                data-unit="ms"
                                                @blur="
                                                    (e) => {
                                                        if (
                                                            e.target.value ===
                                                            ''
                                                        ) {
                                                            newForm[
                                                                `param954_${chanNoItem.chanNo}_${levelItem.type}`
                                                            ].info[0].detectInterval =
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
                                            label="标定检测区域"
                                            v-if="levelItem.area"
                                        >
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
            :before-close="handleClose"
            :append-to-body="true"
        >
            <el-switch
                v-model="isPlugin"
                active-text="插件"
                inactive-text="无插件"
                class="m-l"
                v-if="!isTemplate"
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
                <ADNoPlugin
                    ref="ADNoPlugin"
                    :playUrl="playUrl"
                    @cancelSurveyBol="cancelSurveyBol"
                    @saveSurveyBol="saveSurveyBol"
                    :isTemplate="isTemplate"
                ></ADNoPlugin>
            </div>
            <!-- <div class="h-full inline" style="height:100%;width:100%;" id="videoPlay"></div> -->
            <!--控件版本-->
            <div class="divHeight" v-show="openSurveyBol && isPlugin">
                <div id="AEStreamWebVersion" style="width: 0; height: 0"></div>

                <div
                    v-show="!noneVideoPlay"
                    class="h-full inline"
                    style="height: 100%; width: 100%"
                    id="videoPlay"
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
import ADNoPlugin from "@/components/webControlService/configuration/ad.vue";
export default {
    name: "AD-Params",
    mixins: [mixins],
    components: { ADNoPlugin },
    props: {},
    data() {
        return {
            isPlugin: false,
            playUrl: "",
            componentsName: "platformParams",
            setForm: {},
            chanNoActive: "",
            ADList: [],
            activeCollapse: [],
            openSurveyBol: false,
            dialogClick: false,
            noneVideoPlay: false, 
            notLastVerson: false,
            surveyObj: {},
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
                let box = document.getElementById("videoPlay");
                let offsetHeight = box.offsetHeight;
                let offsetWidth = box.offsetWidth;
                ocxWebControl.pageScroll(
                    this.videoPlayControl,
                    "videoPlay",
                    offsetWidth,
                    offsetHeight
                );
            }
        });
        
        window.addEventListener("resize", () => {
            if (this.videoPlayControl != null) {
                let box = document.getElementById("videoPlay");
                let offsetHeight = box.offsetHeight;
                let offsetWidth = box.offsetWidth;
                ocxWebControl.pageResize(
                    this.videoPlayControl,
                    "videoPlay",
                    offsetWidth,
                    offsetHeight
                );
            }
        });

        this.initConfig();
    },
    computed: {},
    watch: {
        isPlugin: {
            handler(val, oldVal) {
                if (this.videoPlayControl != null)
                    this.videoPlayControl.JS_DestroyWnd().then(
                        () => {},
                        () => {}
                    );

                if (val) {
                    this.$refs.ADNoPlugin.cancel(false);
                }

                this.openSurvey(this.surveyObj);
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
        newForm: {
            handler(val) {
                if (val) {
                    this.ADList.forEach((chanNoItem) => {
                        for (let typeName of Object.keys(chanNoItem.info)) {
                            chanNoItem.info[typeName].forEach((typeItem) => {
                                if (
                                    val[
                                        `param954_${chanNoItem.chanNo}_${typeItem.type}`
                                    ]
                                ) {
                                    let paramStr = `param954_${chanNoItem.chanNo}_${typeItem.type}`;
                                    let objName = `通道${
                                        chanNoItem.chanNo
                                    }>${this.getLabelByType(
                                        typeItem.type
                                    )}&${paramStr}`;
                                    if (!this.setForm.hasOwnProperty(objName)) {
                                        this.setForm[objName] = {
                                            info: [{ snapshot: {} }],
                                        };
                                    }
                                    this.setForm[objName].enable =
                                        val[paramStr].enable !=
                                        this.oldForm[paramStr].enable
                                            ? `${paramStr}.enable&报警使能switch&${val[paramStr].enable}`
                                            : null;
                                    this.setForm[objName].info[0].speed =
                                        val[paramStr].info[0].speed !=
                                        this.oldForm[paramStr].info[0].speed
                                            ? `${paramStr}.info.0.speed&报警判断速度阈值&${val[paramStr].info[0].speed}`
                                            : null;
                                    this.setForm[objName].info[0].volume =
                                        val[paramStr].info[0].volume !=
                                        this.oldForm[paramStr].info[0].volume
                                            ? `${paramStr}.info.0.volume&报警音量&${val[paramStr].info[0].volume}`
                                            : null;
                                    this.setForm[objName].info[0].confidence =
                                        val[paramStr].info[0].confidence !=
                                        this.oldForm[paramStr].info[0]
                                            .confidence
                                            ? `${paramStr}.info.0.confidence&算法置信度&${this.getLabelSelf(
                                                  typeItem.confidenceList,
                                                  val[paramStr].info[0]
                                                      .confidence
                                              )}&${
                                                  val[paramStr].info[0]
                                                      .confidence
                                              }`
                                            : null;
                                    this.setForm[objName].info[0].sensitivity =
                                        val[paramStr].info[0].sensitivity !=
                                        this.oldForm[paramStr].info[0]
                                            .sensitivity
                                            ? `${paramStr}.info.0.sensitivity&算法灵敏度&${this.getLabelSelf(
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
                                    ].info[0].detectInterval =
                                        val[paramStr].info[0].detectInterval !=
                                        this.oldForm[paramStr].info[0]
                                            .detectInterval
                                            ? `${paramStr}.info.0.detectInterval&检测持续时间&${val[paramStr].info[0].detectInterval}`
                                            : null;
                                    this.setForm[objName].info[0].area =
                                        JSON.stringify(
                                            val[paramStr].info[0].area
                                        ) !=
                                        JSON.stringify(
                                            this.oldForm[paramStr].info[0].area
                                        )
                                            ? `${paramStr}.info.0.area&标定检测区域&新区域&${val[paramStr].info[0].area}`
                                            : null;
                                }
                            });
                        }
                    });
                    this.$emit("setFormChange", {
                        AD: this.setForm,
                    });
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        handleClose(done) {
            if (!this.isPlugin) this.$refs.ADNoPlugin.cancel(true);
            else {
                done();
            }
        },
        initConfig() {
            this.$emit("setFormLoading", true);
            this.ADList = [];
            this.chanNoActive = `通道${this.capability.intelliDrive_AD[0].chanNo}`;
            this.capability.intelliDrive_AD.forEach((chanNoItem) => {
                let obj = {
                    chanNo: chanNoItem.chanNo,
                    info: {},
                };
                chanNoItem.info.forEach((infoItem) => {
                    /* --------------------算法灵敏度 start-------------------------*/
                    infoItem.sensitivityList = [];
                    if (infoItem.sensitivity) {
                        let sensitivityRange =
                            infoItem.sensitivity.max - infoItem.sensitivity.min;
                        let sensitivityLow =
                            infoItem.sensitivity.min +
                            parseInt(sensitivityRange / 6);
                        let sensitivityMiddle =
                            infoItem.sensitivity.min +
                            parseInt(sensitivityRange / 2);
                        let sensitivityHigh =
                            infoItem.sensitivity.min +
                            parseInt((sensitivityRange * 5) / 6);
                        infoItem.sensitivityRange = sensitivityRange;
                        infoItem.sensitivityList = [
                            {
                                value: sensitivityLow,
                                label: "低",
                            },
                            {
                                value: sensitivityMiddle,
                                label: "中",
                            },
                            {
                                value: sensitivityHigh,
                                label: "高",
                            },
                        ];
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
                        this.enumerationJSON["intelliDrive_AD_type"]
                    )) {
                        if (
                            this.enumerationJSON["intelliDrive_AD_type"][
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
                            954,
                            {
                                type: infoItem.type,
                                chanNo: chanNoItem.chanNo,
                            },
                            "AD"
                        )
                    );
                });
                this.ADList.push(obj);
            });
            Promise.all(initConfigList).then((result) => {
                this.$emit("setFormLoading", false);
                this.$emit("loadingSuccess");
            });
        },
        getLabelByType(type) {
            let label = "";
            for (let key of Object.keys(
                this.enumerationJSON["intelliDrive_AD_type"]
            )) {
                let index =
                    this.enumerationJSON["intelliDrive_AD_type"][key].indexOf(
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
        
        initWebControl(obj, id, height, width) {
            let that = this;
            return (obj = new WebControl({
                szPluginContainer: id,
                iServicePortStart: 14450, 
                iServicePortEnd: 14452, 
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
                                            
                                            let pluginVersion =
                                                oData.responseMsg.version.toString();
                                            let params = {
                                                pluginVersion: pluginVersion,
                                            };
                                            
                                            that.$api
                                                .comparePluginVersion(params)
                                                .then((res) => {
                                                    if (res.success) {
                                                        let isLastVerson =
                                                            res.data;
                                                        if (isLastVerson) {
                                                            
                                                            
                                                            
                                                            that.notLastVerson = false;
                                                        } else {
                                                            
                                                            
                                                            
                                                            
                                                            
                                                            
                                                            that.notLastVerson = true;
                                                            document.body.scrollTop =
                                                                document.documentElement.scrollTop = 0;
                                                            
                                                            
                                                            
                                                            
                                                            
                                                            
                                                            

                                                            that.$confirm(
                                                                "当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面",
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
                "当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面",
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
        openSurvey(surveyObj) {
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
            this.surveyObj = surveyObj;
            let areaArr =
                this.newForm[
                    `param954_${this.surveyObj.chanNo}_${this.surveyObj.type}`
                ].info[0].area;
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
                protocolType: this.isPlugin ? 0 : 3, 
            };
            this.$api.previewPlay(params).then((res) => {
                if (res.success) {
                    this.playUrl = res.data;
                } else {
                    
                }
                this.$nextTick(() => {
                    if (!this.isPlugin) {
                        this.$refs.ADNoPlugin.openHatPlugin(
                            this.playUrl,
                            areaContent,
                            !this.isTemplate
                        );
                    } else {
                        
                        this.noneVideoPlay = false;
                        let box = document.getElementById("videoPlay");
                        let offsetHeight = box.offsetHeight;
                        let offsetWidth = box.offsetWidth;
                        this.videoPlayControl = this.initWebOcx(
                            this.videoPlayControl,
                            "videoPlay",
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
                iServicePortStart: 14450, 
                iServicePortEnd: 14452, 
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
                                            funcName: "SetADAreaParams",
                                            arguments: {
                                                devSerialNum: "E61911993",
                                                deviceType: "AE-AC3141-A",
                                                
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
                                            
                                        }),
                                        obj
                                            .JS_RequestInterface({
                                                funcName: "StartRealPlay",
                                                arguments: {
                                                    playUrl: this_.playUrl,
                                                },
                                            })
                                            .then((oData) => {});
                                }
                            );
                        },
                        function () {
                            this.$message.error("控件服务启动失败！");
                        }
                    );
                },
                
                
                
                
                

                cbConnectError: () => {
                    obj = null;
                    this.noneVideoPlay = true;
                    this.videoPlayControl = null;
                    
                },
                cbConnectClose: (bNormalClose) => {
                    if (!bNormalClose) {
                        obj = null;
                        this.noneVideoPlay = true;
                        this.videoPlayControl = null;
                        
                        
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
        saveSurveyBol(adInfo) {
            let dataArr = [[]];
            adInfo.forEach((item) => {
                dataArr[0].push({
                    x: item.x,
                    y: item.y,
                });
            });

            this.newForm[
                `param954_${this.surveyObj.chanNo}_${this.surveyObj.type}`
            ].info[0].area = dataArr;
            this.$message.success("设置成功，点击下发至终端生效");
            this.openSurveyBol = false;
        },
        cbIntegrationCallBack(oData) {
            let dataArr = [[]];
            if (oData.responseMsg) {
                if (oData.responseMsg.event == "ADAreaParamsChanged") {
                    oData.responseMsg.msg.polygon.forEach((item) => {
                        dataArr[0].push({
                            x: item.x,
                            y: item.y,
                        });
                    });

                    this.newForm[
                        `param954_${this.surveyObj.chanNo}_${this.surveyObj.type}`
                    ].info[0].area = dataArr;
                    this.$message.success("设置成功，点击下发至终端生效");
                    this.openSurveyBol = false;
                } else if (oData.responseMsg.event == "CancelBtnClicked") {
                    this.openSurveyBol = false;
                    return;
                } else if (oData.responseMsg.event == "RealPlayBtnClicked") {
                    let params = {
                        deviceId: this.$route.query.deviceId || null,
                        channelNo: this.chanNoActive.split("通道")[1],
                        protocolType: this.isPlugin ? 0 : 3, 
                    };
                    this.$api.previewPlay(params).then((res) => {
                        if (res.success) {
                            this.playUrl = res.data;
                        } else {
                            this.$message.error("预览失败" + res.msg);
                        }
                        this.$nextTick(() => {
                            let box = document.getElementById("videoPlay");
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
            if (this.isPlugin && this.videoPlayControl)
                this.videoPlayControl.JS_DestroyWnd().then(
                    () => {},
                    () => {}
                );
            this.openSurveyBol = false;
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
