<template>
    <div class="p-a-md">
        <div id="id" style="width: 0; height: 0"></div>
        <el-dialog
            title="全局标定检测区域"
            :visible.sync="dialogVisible"
        >
            <div class="divHeight">
                <!-- <div class="h-full inline" style="height:100%;width:100%;" id="videoPlay"></div> -->
                <!--控件版本-->
                <div id="AEStreamWebVersion" style="width: 0; height: 0"></div>
                <!-- 加入控件 -->
                <a
                    type="text"
                    style="float: right; line-height: 32px"
                    @click="reDownLoad"
                    v-if="notLastVerson"
                    >发现新控件版本</a
                >
                <div
                    v-if="!noneVideoPlay"
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
        </el-dialog>
        <el-form
            ref="PrivateWhdForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <div id="title" class="channels">
                <el-button
                    :type="item['chanNo'] == activeChannel ? 'info' : ''"
                    v-for="item in tabAndConfiguration"
                    @click="changeChannel(item['chanNo'], index)"
                    :key="item['chanNo']"
                    >通道{{ item["chanNo"] }}</el-button
                >
            </div>
            <el-tabs
                v-show="activeChannel == item['chanNo']"
                v-for="(item, index) in tabAndConfiguration"
                :key="index"
                v-model="activeName"
                :before-leave="beforeLeave"
                @tab-click="getPrivateProcotol(activeName, item, '', '')"
            >
                <el-tab-pane
                    label="WHD全局配置"
                    name="WHD全局配置"
                    v-if="
                        (deviceCapability['intelliDrive_WHD'][index][
                            'enable'
                        ] &&
                            deviceCapability['intelliDrive_WHD'][index][
                                'enable'
                            ].length) ||
                        deviceCapability['intelliDrive_WHD'][index][
                            'speedCalibration'
                        ]
                    "
                >
                    <template v-if="form['param938_']">
                        <div class="configurations">
                            <div
                                v-if="
                                    deviceCapability['intelliDrive_WHD'][index][
                                        'enable'
                                    ] &&
                                    deviceCapability['intelliDrive_WHD'][index][
                                        'enable'
                                    ].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item
                                    label="WHD全局报警使能"
                                    description="此项配置控制算法，不是统一配置子报警使能"
                                >
                                    <el-switch
                                        v-model="form['param938_'].enable"
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    deviceCapability['intelliDrive_WHD'][index][
                                        'info'
                                    ][0]['area']
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="WHD全局标定">
                                    <el-button
                                        style="margin-top: 5px"
                                        :disabled="dialogClick"
                                        @click="openDialog"
                                        >全局标定检测区域</el-button
                                    >
                                </el-form-item>
                            </div>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane
                    v-for="(item_, index_) in item['tabList']"
                    :key="index_"
                    :name="item_['name']"
                    :label="item_['name']"
                >
                    <div class="alarmLevelBox">
                        <el-button
                            v-for="(_item, _index) in item_['types']"
                            :key="_index"
                            @click="
                                changeAlarmLevel(_item, _index, index, index_)
                            "
                            :type="_item == chooseType ? 'primary' : 'default'"
                            >{{ !_index ? "一级报警" : "二级报警" }}</el-button
                        >
                    </div>
                    <template v-if="form['param938_' + chooseType]">
                        <div class="configurations">
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex][
                                        'enable'
                                    ] &&
                                    item_['capabilitys'][chooseIndex]['enable']
                                        .length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label=" 报警使能">
                                    <el-switch
                                        v-model="
                                            form['param938_' + chooseType][
                                                'info'
                                            ][0].enable
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex]['speed']
                                "
                                class="configuration-item"
                            >
                                <el-form-item
                                    label="报警判断速度阈值"
                                    :prop="
                                        'param938_' +
                                        chooseType +
                                        '.info.0.speed'
                                    "
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: item_['capabilitys'][
                                                chooseIndex
                                            ]['speed']['min'],
                                            max: item_['capabilitys'][
                                                chooseIndex
                                            ]['speed']['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${item_['capabilitys'][chooseIndex]['speed']['min']}~${item_['capabilitys'][chooseIndex]['speed']['max']}`"
                                        v-model.number="
                                            form['param938_' + chooseType][
                                                'info'
                                            ][0]['speed']
                                        "
                                        ><span slot="suffix"
                                            >km/h</span
                                        ></el-input
                                    >
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex][
                                        'confidence'
                                    ]
                                "
                                class="configuration-item"
                            >
                                <el-form-item
                                    label="算法置信度"
                                    :prop="
                                        'param938_' +
                                        chooseType +
                                        '.info.0.confidence'
                                    "
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: item_['capabilitys'][
                                                chooseIndex
                                            ]['confidence']['min'],
                                            max: item_['capabilitys'][
                                                chooseIndex
                                            ]['confidence']['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${item_['capabilitys'][chooseIndex]['confidence']['min']}~${item_['capabilitys'][chooseIndex]['confidence']['max']}`"
                                        v-model.number="
                                            form['param938_' + chooseType][
                                                'info'
                                            ][0]['confidence']
                                        "
                                        ><span slot="suffix">%</span></el-input
                                    >
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex][
                                        'sensitivity'
                                    ]
                                "
                                class="configuration-item"
                            >
                                <!-- <el-form-item
                                    label="算法灵敏度"
                                    :prop="
                                        'param938_' +
                                        chooseType +
                                        '.info.0.sensitivity'
                                    "
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: item_['capabilitys'][
                                                chooseIndex
                                            ]['sensitivity']['min'],
                                            max: item_['capabilitys'][
                                                chooseIndex
                                            ]['sensitivity']['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${item_['capabilitys'][chooseIndex]['sensitivity']['min']}~${item_['capabilitys'][chooseIndex]['sensitivity']['max']}`"
                                        v-model.number="
                                            form['param938_' + chooseType][
                                                'info'
                                            ][0]['sensitivity']
                                        "
                                    ></el-input>
                                </el-form-item> -->
                                <el-form-item label="算法灵敏度">
                                    <el-select
                                        v-model="
                                            form['param938_' + chooseType][
                                                'info'
                                            ][0]['sensitivity']
                                        "
                                    >
                                        <el-option
                                            v-for="_item in item_[
                                                'capabilitys'
                                            ][chooseIndex]['sensitivityList']"
                                            :value="_item.value"
                                            :key="_item.value"
                                            :label="_item.label"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex][
                                        'volumeEnable'
                                    ] &&
                                    item_['capabilitys'][chooseIndex][
                                        'volumeEnable'
                                    ].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="音量使能">
                                    <el-switch
                                        v-model="
                                            form['param938_' + chooseType][
                                                'info'
                                            ][0]['volumeEnable']
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex]['volume']
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="报警音量">
                                    <el-slider
                                        v-model="
                                            form['param938_' + chooseType][
                                                'info'
                                            ][0]['volume']
                                        "
                                        :min="
                                            item_['capabilitys'][chooseIndex][
                                                'volume'
                                            ]['min']
                                        "
                                        :max="
                                            item_['capabilitys'][chooseIndex][
                                                'volume'
                                            ]['max']
                                        "
                                        :step="1"
                                        show-input
                                    ></el-slider>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex][
                                        'snapshot'
                                    ] &&
                                    item_['capabilitys'][chooseIndex][
                                        'snapshot'
                                    ]['upload'] &&
                                    item_['capabilitys'][chooseIndex][
                                        'snapshot'
                                    ]['upload'].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="报警图片上传使能">
                                    <el-switch
                                        v-model="
                                            form['param938_' + chooseType][
                                                'info'
                                            ][0]['snapshot']['upload']
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex]['clip'] &&
                                    item_['capabilitys'][chooseIndex]['clip'][
                                        'upload'
                                    ] &&
                                    item_['capabilitys'][chooseIndex]['clip'][
                                        'upload'
                                    ].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="报警视频上传使能">
                                    <el-switch
                                        v-model="
                                            form['param938_' + chooseType][
                                                'info'
                                            ][0]['clip']['upload']
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex][
                                        'uploadEventPlatform'
                                    ] &&
                                    item_['capabilitys'][chooseIndex][
                                        'uploadEventPlatform'
                                    ].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="事件上传平台设置">
                                    <el-select
                                        multiple
                                        multiple-nowrap
                                        v-model="
                                            form['param938_' + chooseType][
                                                'info'
                                            ][0]['uploadEventPlatform']
                                        "
                                    >
                                        <el-option
                                            v-for="_item in item_[
                                                'capabilitys'
                                            ][chooseIndex][
                                                'uploadEventPlatform'
                                            ]"
                                            :value="_item"
                                            :key="_item"
                                            :label="'第' + _item + '中心'"
                                        ></el-option>
                                    </el-select>
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
// 事件节流
function throttle(fn, delay) {
    let valid = true;
    return function () {
        if (!valid) {
            //休息时间 暂不接客
            return false;
        }
        // 工作时间，执行函数并且在间隔期内把状态位设为无效
        valid = false;
        setTimeout(() => {
            fn.call(this, event);
            valid = true;
        }, delay);
    };
}
import { WebControl } from "web-control";
import { validateNum } from "@/utils/validate";
import ocxWebControl from "@/utils/ocxWebControl";
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
                    this.activeChannel = val["intelliDrive_DBA"][0]["chanNo"];
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
        originalForm: {
            handler(val) {
                if (val) {
                    this.copyForm = val;
                }
            },
            deep: true,
            immediate: true,
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
                    this.getPrivateProcotol(
                        this.activeName,
                        this.tabAndConfiguration[this.chanNoIndex],
                        "",
                        "",
                        true
                    );
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
        dialogVisible: {
            handler(newVal) {
                if (!newVal) {
                    this.dialogClick = newVal;
                    this.SurveyBol();
                }
            },
        },
        "form.param938_": {
            handler(val) {
                if (val && !Boolean(this.isTemplate) && this.activeChannel) {
                    this.formData[
                        "param938_." + this.activeChannel + ".enable.useless"
                    ] =
                        val["enable"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_"
                        ]["enable"]
                            ? `param938_.${
                                  this.activeChannel
                              }.enable.useless&主动安全设置/WHD/通道${
                                  this.activeChannel
                              }/WHD全局配置&${val["enable"] ? "开启" : "关闭"}`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param938_1": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param938_1." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_1"
                        ]["info"][0]["enable"]
                            ? `param938_1.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_1"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_1." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_1"
                        ]["info"][0]["speed"]
                            ? `param938_1.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_1"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param938_1." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_1"
                        ]["info"][0]["confidence"]
                            ? `param938_1.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/一级报警/算法置信度&${
                                  val["info"][0]["confidence"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_1"
                                  ]["info"][0]["confidence"]
                              }`
                            : "";
                    this.formData[
                        "param938_1." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_1"
                        ]["info"][0]["sensitivity"]
                            ? `param938_1.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param938"][
                                              this.activeChannel
                                          ]["param938_1"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param938_1." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_1"
                        ]["info"][0]["volume"]
                            ? `param938_1.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_1"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param938_1." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_1"
                        ]["info"][0]["volumeEnable"]
                            ? `param938_1.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_1"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_1." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_1"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param938_1.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_1"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_1." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_1"
                        ]["info"][0]["clip"]["upload"]
                            ? `param938_1.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_1"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_1." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_1"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param938_1.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param938"][
                                  this.activeChannel
                              ]["param938_1"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param938_2": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param938_2." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_2"
                        ]["info"][0]["enable"]
                            ? `param938_2.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_2"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_2." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_2"
                        ]["info"][0]["speed"]
                            ? `param938_2.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_2"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param938_2." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_2"
                        ]["info"][0]["confidence"]
                            ? `param938_2.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/二级报警/算法置信度&${
                                  val["info"][0]["confidence"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_2"
                                  ]["info"][0]["confidence"]
                              }`
                            : "";
                    this.formData[
                        "param938_2." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_2"
                        ]["info"][0]["sensitivity"]
                            ? `param938_2.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param938"][
                                              this.activeChannel
                                          ]["param938_2"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param938_2." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_2"
                        ]["info"][0]["volume"]
                            ? `param938_2.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_2"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param938_2." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_2"
                        ]["info"][0]["volumeEnable"]
                            ? `param938_2.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_2"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_2." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_2"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param938_2.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_2"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_2." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_2"
                        ]["info"][0]["clip"]["upload"]
                            ? `param938_2.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_2"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_2." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_2"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param938_2.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param938"][
                                  this.activeChannel
                              ]["param938_2"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param938_3": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param938_3." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_3"
                        ]["info"][0]["enable"]
                            ? `param938_3.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_3"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_3." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_3"
                        ]["info"][0]["speed"]
                            ? `param938_3.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_3"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param938_3." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_3"
                        ]["info"][0]["confidence"]
                            ? `param938_3.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/一级报警/算法置信度&${
                                  val["info"][0]["confidence"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_3"
                                  ]["info"][0]["confidence"]
                              }`
                            : "";
                    this.formData[
                        "param938_3." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_3"
                        ]["info"][0]["sensitivity"]
                            ? `param938_3.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param938"][
                                              this.activeChannel
                                          ]["param938_3"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param938_3." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_3"
                        ]["info"][0]["volume"]
                            ? `param938_3.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_3"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param938_3." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_3"
                        ]["info"][0]["volumeEnable"]
                            ? `param938_3.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_3"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_3." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_3"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param938_3.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_3"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_3." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_3"
                        ]["info"][0]["clip"]["upload"]
                            ? `param938_3.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_3"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_3." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_3"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param938_3.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param938"][
                                  this.activeChannel
                              ]["param938_3"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param938_4": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param938_4." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_4"
                        ]["info"][0]["enable"]
                            ? `param938_4.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_4"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_4." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_4"
                        ]["info"][0]["speed"]
                            ? `param938_4.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_4"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param938_4." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_4"
                        ]["info"][0]["confidence"]
                            ? `param938_4.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/二级报警/算法置信度&${
                                  val["info"][0]["confidence"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_4"
                                  ]["info"][0]["confidence"]
                              }`
                            : "";
                    this.formData[
                        "param938_4." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_4"
                        ]["info"][0]["sensitivity"]
                            ? `param938_4.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/双手脱离方向盘/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param938"][
                                              this.activeChannel
                                          ]["param938_4"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param938_4." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_4"
                        ]["info"][0]["volume"]
                            ? `param938_4.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_4"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param938_4." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_4"
                        ]["info"][0]["volumeEnable"]
                            ? `param938_4.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_4"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_4." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_4"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param938_4.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_4"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_4." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_4"
                        ]["info"][0]["clip"]["upload"]
                            ? `param938_4.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_4"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_4." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_4"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param938_4.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/单手脱离方向盘/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param938"][
                                  this.activeChannel
                              ]["param938_4"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param938_5": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param938_5." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_5"
                        ]["info"][0]["enable"]
                            ? `param938_5.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_5"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_5." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_5"
                        ]["info"][0]["speed"]
                            ? `param938_5.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_5"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param938_5." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_5"
                        ]["info"][0]["confidence"]
                            ? `param938_5.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/一级报警/算法置信度&${
                                  val["info"][0]["confidence"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_5"
                                  ]["info"][0]["confidence"]
                              }`
                            : "";
                    this.formData[
                        "param938_5." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_5"
                        ]["info"][0]["sensitivity"]
                            ? `param938_5.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param938"][
                                              this.activeChannel
                                          ]["param938_5"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param938_5." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_5"
                        ]["info"][0]["volume"]
                            ? `param938_5.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_5"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param938_5." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_5"
                        ]["info"][0]["volumeEnable"]
                            ? `param938_5.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_5"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_5." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_5"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param938_5.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_5"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_5." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_5"
                        ]["info"][0]["clip"]["upload"]
                            ? `param938_5.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_5"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_5." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_5"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param938_5.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param938"][
                                  this.activeChannel
                              ]["param938_5"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param938_6": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param938_6." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_6"
                        ]["info"][0]["enable"]
                            ? `param938_6.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_6"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_6." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_6"
                        ]["info"][0]["speed"]
                            ? `param938_6.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_6"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param938_6." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_6"
                        ]["info"][0]["confidence"]
                            ? `param938_6.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/二级报警/算法置信度&${
                                  val["info"][0]["confidence"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_6"
                                  ]["info"][0]["confidence"]
                              }`
                            : "";
                    this.formData[
                        "param938_6." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_6"
                        ]["info"][0]["sensitivity"]
                            ? `param938_6.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param938"][
                                              this.activeChannel
                                          ]["param938_6"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param938_6." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_6"
                        ]["info"][0]["volume"]
                            ? `param938_6.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_6"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param938_6." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_6"
                        ]["info"][0]["volumeEnable"]
                            ? `param938_6.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_6"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_6." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_6"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param938_6.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_6"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_6." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_6"
                        ]["info"][0]["clip"]["upload"]
                            ? `param938_6.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param938"][this.activeChannel][
                                      "param938_6"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param938_6." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param938"][this.activeChannel][
                            "param938_6"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param938_6.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/WHD/玩手机/通道${
                                  this.activeChannel
                              }/玩手机/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param938"][
                                  this.activeChannel
                              ]["param938_6"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
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
            tabIndex: 0,
            deviceId: this.$route.query.deviceId || "",
            activeName: "",
            dialogVisible: false,
            notLastVerson: false,
            noneVideoPlay: false,
            dialogClick: false,
            deviceCapability: {},
            form: {},
            copyForm: {},
            formData: {},
            dictionaryData: {},
            tabAndConfiguration: [],
            activeChannel: "",
            chooseType: "",
            chooseIndex: "",
            chanNoIndex: 0,
            childConfigParams: false,
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
        this.$emit("setMenuActiveRefFormName", "PrivateWhdForm");
        //this.makeTabList()
    },
    methods: {
        beforeLeave(activeName, oldActiveName) {
            this.$refs.PrivateWhdForm.validate((valid) => {
                if (!valid) {
                    this.$message.warning("当前表单验证不通过，请先完善！");
                    return new Promise((resolve, reject) => {
                        valid == true;
                    })
                        .then(() => {
                            resolve();
                        })
                        .catch(reject(err));
                }
            });
        },
        getPrivateProcotol(
            activeName,
            item,
            chooseType,
            chooseIndex,
            bol,
            index_
        ) {
            this.activeName = activeName;
            if (chooseType !== "" && chooseIndex !== "") {
                this.chooseType = chooseType;
                this.chooseIndex = chooseIndex;
                this.tabIndex = index_;
            } else {
                item["tabList"].forEach((item_) => {
                    if (item_["name"] === activeName) {
                        if (!bol) {
                            this.chooseType = item_["types"][0];
                            this.chooseIndex = 0;
                            this.tabIndex = item_.index;
                        }
                    }
                });
            }
            let params = {
                deviceId: this.deviceId,
                param: {
                    type:
                        this.activeName == "WHD全局配置" ? 1 : this.chooseType,
                    chanNo: this.activeChannel,
                },
                msgId: 938,
            };
            this.chooseType =
                this.activeName == "WHD全局配置" ? 1 : this.chooseType;
            if (
                !this.form["param938"] ||
                !this.form["param938"][this.activeChannel] ||
                !this.form["param938"][this.activeChannel][
                    "param938_" + this.chooseType
                ]
            ) {
                if (Boolean(this.isTemplate)) return;
                this.$api.getEHomeConfig(params).then((res) => {
                    if (res && res.data && res.data.param) {
                        let formData = JSON.parse(res.data.param);
                        formData["chanNo"] = this.activeChannel;

                        let obj =
                            this.tabAndConfiguration[this.chanNoIndex].tabList[
                                this.tabIndex
                            ].capabilitys[this.chooseIndex];
                        if (obj.sensitivity) {
                            if (
                                formData.info[0].sensitivity <
                                obj.sensitivity.min +
                                    parseInt(obj.sensitivityRange / 3)
                            ) {
                                formData.info[0].sensitivity =
                                    obj.sensitivityList[0].value;
                            } else if (
                                formData.info[0].sensitivity >
                                obj.sensitivity.min +
                                    parseInt((obj.sensitivityRange * 2) / 3)
                            ) {
                                formData.info[0].sensitivity =
                                    obj.sensitivityList[2].value;
                            } else {
                                formData.info[0].sensitivity =
                                    obj.sensitivityList[1].value;
                            }
                        }
                        if (obj.confidence) {
                            if (
                                formData.info[0].confidence <
                                obj.confidence.min +
                                    parseInt(obj.confidenceRange / 3)
                            ) {
                                formData.info[0].confidence =
                                    obj.confidenceList[0].value;
                            } else if (
                                formData.info[0].confidence >
                                obj.confidence.min +
                                    parseInt((obj.confidenceRange * 2) / 3)
                            ) {
                                formData.info[0].confidence =
                                    obj.confidenceList[2].value;
                            } else {
                                formData.info[0].confidence =
                                    obj.confidenceList[1].value;
                            }
                        }
                        if (this.form["param938_"]) {
                            formData["enable"] =
                                this.form["param938_"]["enable"];
                            formData["info"][0]["area"] =
                                this.form["param938_"]["info"][0]["area"];
                        } else {
                            this.$set(this.form, `param938_`, formData);
                            this.$set(
                                this.copyForm,
                                `param938_`,
                                JSON.parse(JSON.stringify(formData))
                            );
                            if (!this.copyForm["param938"])
                                this.$set(
                                    this.copyForm,
                                    "param938",
                                    JSON.parse(JSON.stringify({}))
                                );
                            if (
                                this.copyForm["param938"] &&
                                !this.copyForm["param938"][this.activeChannel]
                            )
                                this.$set(
                                    this.copyForm["param938"],
                                    this.activeChannel,
                                    JSON.parse(JSON.stringify({}))
                                );
                            if (
                                this.copyForm["param938"] &&
                                this.copyForm["param938"][this.activeChannel] &&
                                !this.copyForm["param938"][this.activeChannel][
                                    `param938_`
                                ]
                            )
                                this.$set(
                                    this.copyForm["param938"][
                                        this.activeChannel
                                    ],
                                    `param938_`,
                                    JSON.parse(JSON.stringify(formData))
                                );
                        }
                        this.$set(
                            this.form,
                            `param938_${
                                this.activeName == "WHD全局配置"
                                    ? ""
                                    : this.chooseType
                            }`,
                            formData
                        );
                        if (!this.form["param938"])
                            this.$set(this.form, "param938", {});
                        if (
                            this.form["param938"] &&
                            !this.form["param938"][this.activeChannel]
                        )
                            this.$set(
                                this.form["param938"],
                                this.activeChannel,
                                {}
                            );
                        if (
                            this.form["param938"] &&
                            this.form["param938"][this.activeChannel] &&
                            !this.form["param938"][this.activeChannel][
                                `param938_${
                                    this.activeName == "WHD全局配置"
                                        ? ""
                                        : this.chooseType
                                }`
                            ]
                        )
                            this.$set(
                                this.form["param938"][this.activeChannel],
                                `param938_${
                                    this.activeName == "WHD全局配置"
                                        ? ""
                                        : this.chooseType
                                }`,
                                formData
                            );
                        this.$set(
                            this.copyForm,
                            `param938_${this.chooseType}`,
                            JSON.parse(JSON.stringify(formData))
                        );
                        if (!this.copyForm["param938"])
                            this.$set(
                                this.copyForm,
                                "param938",
                                JSON.parse(JSON.stringify({}))
                            );
                        if (
                            this.copyForm["param938"] &&
                            !this.copyForm["param938"][this.activeChannel]
                        )
                            this.$set(
                                this.copyForm["param938"],
                                this.activeChannel,
                                JSON.parse(JSON.stringify({}))
                            );
                        if (
                            this.copyForm["param938"] &&
                            this.copyForm["param938"][this.activeChannel] &&
                            !this.copyForm["param938"][this.activeChannel][
                                `param938_${this.chooseType}`
                            ]
                        )
                            this.$set(
                                this.copyForm["param938"][this.activeChannel],
                                `param938_${
                                    this.activeName == "WHD全局配置"
                                        ? ""
                                        : this.chooseType
                                }`,
                                JSON.parse(JSON.stringify(formData))
                            );
                        this.childConfigParams = false;
                    } else {
                        this.$message.error("协议获取失败");
                        this.childConfigParams = false;
                    }
                });
            } else {
                this.childConfigParams = false;
            }
            console.log(item);
        },
        //切换通道号
        changeChannel(chanNo, index) {
            this.form = Object.assign(
                {},
                this.form,
                this.form["param938"][chanNo]
            );
            this.activeChannel = chanNo;
            this.activeName =
                (this.deviceCapability["intelliDrive_DBA"][index]["enable"] &&
                    this.deviceCapability["intelliDrive_DBA"][index]["enable"]
                        .length) ||
                this.deviceCapability["intelliDrive_DBA"][index][
                    "speedCalibration"
                ]
                    ? "WHD全局配置"
                    : this.tabAndConfiguration[index]["tabList"][0]["name"];
            this.chooseType =
                (this.deviceCapability["intelliDrive_DBA"][index]["enable"] &&
                    this.deviceCapability["intelliDrive_DBA"][index]["enable"]
                        .length) ||
                this.deviceCapability["intelliDrive_DBA"][index][
                    "speedCalibration"
                ]
                    ? ""
                    : this.tabAndConfiguration[index]["tabList"][0]["types"][0];
            this.chooseIndex = 0;
            this.chanNoIndex = index;
            this.getPrivateProcotol(
                this.activeName,
                this.tabAndConfiguration[this.chanNoIndex],
                "",
                ""
            );
        },
        //切换报警等级
        changeAlarmLevel(item, _index, index, index_) {
            this.$refs.PrivateWhdForm.validate((valid) => {
                if (!valid) {
                    this.$message.warning("当前表单验证不通过，请先完善！");
                } else {
                    this.chooseType = item;
                    this.chooseIndex = _index;
                    this.tabIndex = index_;
                    console.log(index);
                    this.getPrivateProcotol(
                        this.activeName,
                        this.tabAndConfiguration[index],
                        this.chooseType,
                        this.chooseIndex,
                        false,
                        index_
                    );
                }
            });
        },
        makeTabList() {
            this.tabAndConfiguration = [];
            this.deviceCapability["intelliDrive_WHD"].forEach((item, index) => {
                this.tabAndConfiguration[index] = {};
                this.tabAndConfiguration[index]["chanNo"] = item["chanNo"];
                this.tabAndConfiguration[index]["tabList"] = [];
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "双手脱离方向盘",
                    1,
                    2
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "单手脱离方向盘",
                    3,
                    4
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "玩手机",
                    5,
                    6
                );
            });
            console.log(this.tabAndConfiguration);
            this.activeName =
                (this.deviceCapability["intelliDrive_WHD"][0]["enable"] &&
                    this.deviceCapability["intelliDrive_WHD"][0]["enable"]
                        .length) ||
                this.deviceCapability["intelliDrive_WHD"][0]["speedCalibration"]
                    ? "WHD全局配置"
                    : this.tabAndConfiguration[0]["tabList"][0]["name"];
            this.activeChannel = this.tabAndConfiguration[0]["chanNo"];
            this.chooseType =
                this.tabAndConfiguration[0]["tabList"][0]["types"][0];
            this.chooseIndex = 0;
            this.chanNoIndex = 0;
            this.tabAndConfiguration.forEach((i) => {
                i.tabList.forEach((j, index) => {
                    j.index = index;
                    j.capabilitys.forEach((k) => {
                        /* --------------------算法灵敏度 start-------------------------*/
                        k.sensitivityList = [];
                        if (k.sensitivity) {
                            let sensitivityRange =
                                k.sensitivity.max - k.sensitivity.min;
                            let sensitivityLow =
                                k.sensitivity.min +
                                parseInt(sensitivityRange / 6);
                            let sensitivityMiddle =
                                k.sensitivity.min +
                                parseInt(sensitivityRange / 2);
                            let sensitivityHigh =
                                k.sensitivity.min +
                                parseInt((sensitivityRange * 5) / 6);
                            k.sensitivityRange = sensitivityRange;
                            k.sensitivityList = [
                                {
                                    value: sensitivityLow,
                                    label: "高",
                                },
                                {
                                    value: sensitivityMiddle,
                                    label: "中",
                                },
                                {
                                    value: sensitivityHigh,
                                    label: "低",
                                },
                            ];
                        }

                        /* --------------------算法灵敏度 end-------------------------*/
                        /* --------------------算法置信度 start-------------------------*/
                        k.confidenceList = [];
                        if (k.confidence) {
                            let confidenceRange =
                                k.confidence.max - k.confidence.min;
                            let confidenceLow =
                                k.confidence.min +
                                parseInt(confidenceRange / 6);
                            let confidenceMiddle =
                                k.confidence.min +
                                parseInt(confidenceRange / 2);
                            let confidenceHigh =
                                k.confidence.min +
                                parseInt((confidenceRange * 5) / 6);
                            k.confidenceRange = confidenceRange;
                            k.confidenceList = [
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
                    });
                });
            });
        },
        //生成tab列表页
        tabListPublic(item, targetArr, name, type1, type2) {
            if (
                item["supportType"].indexOf(type1) != -1 &&
                item["supportType"].indexOf(type2) != -1
            ) {
                let capability = [];
                item["info"].forEach((item_) => {
                    if (item_["type"] == type1 || item_["type"] == type2) {
                        capability.push(item_);
                    }
                });
                targetArr.push({
                    name: name,
                    types: [type1, type2],
                    capabilitys: capability,
                });
            } else if (item["supportType"].indexOf(type1) != -1) {
                let capability = [];
                item["info"].forEach((item_) => {
                    if (item_["type"] == type1) {
                        capability.push(item_);
                    }
                });
                targetArr.push({
                    name: name,
                    types: [type1],
                    capabilitys: capability,
                });
            } else if (item["supportType"].indexOf(type2) != -1) {
                let capability = [];
                item["info"].forEach((item_) => {
                    if (item_["type"] == type2) {
                        capability.push(item_);
                    }
                });
                targetArr.push({
                    name: name,
                    types: [type2],
                    capabilitys: capability,
                });
            }
        },
        SurveyBol() {
            // console.log(this.videoPlayControl);
            this.videoPlayControl.JS_DestroyWnd().then(
                () => {},
                () => {
                    console.log("控件销毁失败");
                }
            );
            this.dialogVisible = false;
        },
        openDialog: throttle(function (e) {
            this.dialogClick = true;
            this.dialogVisible = true;
            let areaContent = [];
            let areaArr = this.form["param938_"]["info"][0]["area"];
            areaArr.forEach((item) => {
                item.forEach((item_) => {
                    areaContent.push({
                        x: parseInt(item_.x),
                        y: parseInt(item_.y),
                    });
                });
            });
            console.log(areaContent);
            let params = {
                deviceId: this.$route.query.deviceId || null,
                channelNo: this.activeChannel,
            };
            this.$api.previewPlay(params).then((res) => {
                if (res.success) {
                    this.playUrl = res.data;
                    //
                } else {
                    this.$message.error("预览失败" + res.msg);
                }
                this.$nextTick(() => {
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
                    // setTimeout(() => {
                    //   this.webVersionControl = this.initWebControl(this.webVersionControl, "AEStreamWebVersion",0, 0);
                    // }, 2000);
                });
                // console.log(res)
            });
            this.dialogVisible = true;
        }, 1000),
        reDownLoad() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            this.$confirm(
                "当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面",
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    customClass: "MessageTop",
                    onConfirm: () => {
                        this.downloadOcx();
                    },
                    onCancel: () => {},
                }
            );
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
        // 检查版本
        initWebControl(obj, id, height, width) {
            let that = this;
            return (obj = new WebControl({
                szPluginContainer: id,
                iServicePortStart: 14450, // 对应 LocalServiceConfig.xml 中的ServicePortStart值
                iServicePortEnd: 14452, // 对应 LocalServiceConfig.xml 中的ServicePortEnd值
                szClassId: "58BC9428-61BE-4F39-ABA3-89452662A4A0",
                cbConnectSuccess: () => {
                    console.log(obj);
                    obj.JS_StartService("window", {
                        dllPath: "./WebVersion.dll",
                    }).then(
                        () => {
                            console.log("加载WebVerion.dll");
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
                                                            that.$message.info(
                                                                "当前Web控件版本已经是最新的！"
                                                            );
                                                            that.notLastVerson = false;
                                                        } else {
                                                            that.notLastVerson = true;
                                                            document.body.scrollTop =
                                                                document.documentElement.scrollTop = 0;
                                                            that.$confirm(
                                                                "当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面。",
                                                                {
                                                                    confirmButtonText:
                                                                        this.$t("common.ok"),
                                                                    cancelButtonText:
                                                                        this.$t("common.cancel"),
                                                                    customClass:
                                                                        "MessageTop",
                                                                    onConfirm:
                                                                        () => {
                                                                            that.downloadOcx();
                                                                        },
                                                                    onCancel:
                                                                        () => {},
                                                                }
                                                            );
                                                            // that.$Modal.confirm({
                                                            //   content: '<h3 class="m-b-sm">当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面</h3>',
                                                            //   styles: 'MessageTop',
                                                            //   onOk: () => {
                                                            //     that.downloadOcx();
                                                            //   },
                                                            //   onCancel: () => { }
                                                            // });
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
                                            console.log(oData);
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
                                                console.log(oData);
                                            });
                                }
                            );
                        },
                        function () {
                            this.$message.error("控件服务启动失败！");
                        }
                    );
                },
                // getBSDArea(){
                //   this.videoPlayControl.obj.JS_RequestInterface({
                //     funcName:'BSDAreaParamsChanged',
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
        cbIntegrationCallBack(oData) {
            console.log(oData);
            let dataArr = [[]];
            if (oData.responseMsg) {
                if (oData.responseMsg.event == "WHDAreaParamsChanged") {
                    oData.responseMsg.msg.polygon.forEach((item) => {
                        dataArr[0].push({
                            x: item.x,
                            y: item.y,
                        });
                        this.form["param938_"]["info"][0]["area"] = dataArr;
                    });
                    this.dialogVisible = false;
                    this.formData[
                        "param938_." +
                            this.activeChannel +
                            ".info.0.area.useless.useless.useless"
                    ] = `param938_.${this.activeChannel}.info.0.area.useless.useless.useless&主动安全设置/WHD/玩手机/WHD全局标定检测区域/全局检测标定区域&新区域`;
                    this.$message.success("设置成功，点击下发至终端生效");
                    this.$emit("changeData", this.formData);
                } else if (oData.responseMsg.event == "CancelBtnClicked") {
                    this.dialogVisible = false;
                    return;
                } else if (oData.responseMsg.event == "RealPlayBtnClicked") {
                    let params = {
                        deviceId: this.$route.query.deviceId || null,
                        channelNo: this.activeChannel,
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
                                .then((oData) => {
                                    console.log(oData);
                                });
                        });
                        console.log(res);
                    });
                }
            } else {
                this.$message.error("标定区画设置失败");
            }
        },
    },
    mounted() {
        // let script = document.createElement('script');
        // script.src = '/static/js/jsWebControl-1.0.0.min.js';
        // document.head.appendChild(script);
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
        }),
            //监听窗口拉伸
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
.divHeight {
    height: 500px;
    width: 800;
}
</style>
