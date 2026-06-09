<template>
    <div class="p-a-md">
        <div id="id" style="width: 0; height: 0"></div>
        <el-dialog
            title="标定检测区域"
            :visible.sync="openSurveyBol"
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
            <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="openSurveyBol=false">确 定</el-button>
        <el-button @click="openSurveyBol = false">取 消</el-button> -->
            <!-- </span> -->
        </el-dialog>
        <el-form
            ref="PrivateWiwForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <div id="title" class="channels">
                <el-button
                    :type="item['chanNo'] == activeChannel ? 'info' : ''"
                    v-for="(item, index) in tabAndConfiguration"
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
                <!-- <el-tab-pane label="WIW全局配置" name="WIW全局配置" v-if="(deviceCapability['intelliDrive_WIW'][index]['enable'] && deviceCapability['intelliDrive_WIW'][index]['enable'].length) || deviceCapability['intelliDrive_WIW'][index]['speedCalibration']">
          <template v-if="form['param983_']">
            <div class="configurations">
              <div v-if="deviceCapability['intelliDrive_WIW'][index]['enable'] && deviceCapability['intelliDrive_WIW'][index]['enable'].length" class="configuration-item">
                <el-form-item label="WIW全局报警使能" description="此项配置控制算法，不是统一配置子报警使能">
                  <el-switch v-model="form['param983_'].enable" :active-value="Number(1)" :inactive-value="Number(0)"></el-switch>
                </el-form-item>
              </div>
              <div v-if="deviceCapability['intelliDrive_WIW'][index]['speedCalibration']" class="configuration-item">
                <el-form-item label="WIW全局标定">
                  <el-button>WIW全局标定</el-button>
                </el-form-item>
              </div>
            </div>
          </template>
        </el-tab-pane> -->
                <el-tab-pane
                    v-for="(item_, index_) in item['tabList']"
                    :key="index_ + 'name'"
                    :name="item_['name']"
                    :label="item_['name']"
                >
                    <div class="alarmLevelBox" v-show="false">
                        <el-button
                            v-for="(_item, _index) in item_['types']"
                            :key="_index + 'types'"
                            @click="
                                changeAlarmLevel(_item, _index, index, index_)
                            "
                            :type="_item == chooseType ? 'primary' : 'default'"
                            >{{ !_index ? "一级报警" : "二级报警" }}</el-button
                        >
                    </div>
                    <template v-if="form['param983_' + chooseType]">
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
                                        v-model.number="
                                            form['param983_' + chooseType][
                                                'info'
                                            ][0]['enable']
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
                                        'param983_' +
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
                                            form['param983_' + chooseType][
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
                                        'staticWarnEnable'
                                    ] &&
                                    item_['capabilitys'][chooseIndex][
                                        'staticWarnEnable'
                                    ].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="静止报警使能">
                                    <el-switch
                                        v-model="
                                            form['param983_' + chooseType][
                                                'info'
                                            ][0]['staticWarnEnable']
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
                                            form['param983_' + chooseType][
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
                                            form['param983_' + chooseType][
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
                                    (form['param983_'] &&
                                        form['param983_']['cameraPos'] !=
                                            undefined) ||
                                    (form['param983_']['cameraPos'] != null &&
                                        chooseType ==
                                            item_['types'][chooseIndex] &&
                                        deviceCapability['intelliDrive_WIW'][
                                            chanNoIndex
                                        ]['cameraPos'] &&
                                        deviceCapability['intelliDrive_WIW'][
                                            chanNoIndex
                                        ]['cameraPos'].length)
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="相机位置">
                                    <el-select
                                        v-model="form['param983_']['cameraPos']"
                                    >
                                        <el-option
                                            v-for="_item in dictionaryData[
                                                'WIWcameraPosList' +
                                                    activeChannel
                                            ]"
                                            :value="_item.id"
                                            :key="_item.id"
                                            :label="_item.label"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex][
                                        'installHeight'
                                    ]
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="相机安装高度">
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${item_['capabilitys'][chooseIndex]['installHeight']['min']}~${item_['capabilitys'][chooseIndex]['installHeight']['max']}`"
                                        v-model.number="
                                            form['param983_' + chooseType][
                                                'info'
                                            ][0]['installHeight']
                                        "
                                        ><span slot="suffix">米</span></el-input
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
                                <!-- <el-form-item
                                    label="算法置信度"
                                    :prop="
                                        'param983_' +
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
                                            form['param983_' + chooseType][
                                                'info'
                                            ][0]['confidence']
                                        "
                                        ><span slot="suffix">%</span></el-input
                                    >
                                </el-form-item> -->
                                <el-form-item label="算法置信度">
                                    <el-select
                                        v-model="
                                            form['param983_' + chooseType][
                                                'info'
                                            ][0]['confidence']
                                        "
                                    >
                                        <el-option
                                            v-for="_item in item_[
                                                'capabilitys'
                                            ][chooseIndex]['confidenceList']"
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
                                        'sensitivity'
                                    ]
                                "
                                class="configuration-item"
                            >
                                <!-- <el-form-item
                                    label="算法灵敏度"
                                    :prop="
                                        'param983_' +
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
                                            form['param983_' + chooseType][
                                                'info'
                                            ][0]['sensitivity']
                                        "
                                    ></el-input>
                                </el-form-item> -->
                                <el-form-item label="算法灵敏度">
                                    <el-select
                                        v-model="
                                            form['param983_' + chooseType][
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
                                    item_['capabilitys'][chooseIndex]['angle']
                                "
                                class="configuration-item"
                            >
                                <el-form-item
                                    label="转向角"
                                    :prop="
                                        'param983_' +
                                        chooseType +
                                        '.info.0.angle'
                                    "
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: item_['capabilitys'][
                                                chooseIndex
                                            ]['angle']['min'],
                                            max: item_['capabilitys'][
                                                chooseIndex
                                            ]['angle']['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${item_['capabilitys'][chooseIndex]['angle']['min']}~${item_['capabilitys'][chooseIndex]['angle']['max']}`"
                                        v-model.number="
                                            form['param983_' + chooseType][
                                                'info'
                                            ][0]['angle']
                                        "
                                        ><span slot="suffix">°</span></el-input
                                    >
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
                                            form['param983_' + chooseType][
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
                                            form['param983_' + chooseType][
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
                                        'turnSignal'
                                    ] &&
                                    item_['capabilitys'][chooseIndex][
                                        'turnSignal'
                                    ].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="转向灯关联使能">
                                    <el-switch
                                        v-model="
                                            form['param983_' + chooseType][
                                                'info'
                                            ][0]['turnSignal']
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
                                        'turnAngle'
                                    ] &&
                                    item_['capabilitys'][chooseIndex][
                                        'turnAngle'
                                    ] &&
                                    item_['capabilitys'][chooseIndex][
                                        'turnAngle'
                                    ].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="转向角关联使能">
                                    <el-switch
                                        v-model="
                                            form['param983_' + chooseType][
                                                'info'
                                            ][0]['turnAngle']
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
                                            form['param983_' + chooseType][
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
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex][
                                        'sensitivity'
                                    ]
                                "
                                class="configuration-item"
                            >
                                <el-form-item
                                    label="持续时长"
                                    :prop="
                                        'param983_' +
                                        chooseType +
                                        '.info.0.duration'
                                    "
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: item_['capabilitys'][
                                                chooseIndex
                                            ]['duration']['min'],
                                            max: item_['capabilitys'][
                                                chooseIndex
                                            ]['duration']['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${item_['capabilitys'][chooseIndex]['duration']['min']}~${item_['capabilitys'][chooseIndex]['duration']['max']}`"
                                        v-model.number="
                                            form['param983_' + chooseType][
                                                'info'
                                            ][0]['duration']
                                        "
                                    ></el-input>
                                </el-form-item>
                            </div>
                            <!-- <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex][
                                        'detect'
                                    ] &&
                                    item_['capabilitys'][chooseIndex]['detect']
                                        .length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="检测类型">
                                    <el-select
                                        multiple
                                        multiple-nowrap
                                        v-model="
                                            form['param983_' + chooseType][
                                                'info'
                                            ][0]['detect']
                                        "
                                    >
                                        <el-option
                                            v-for="_item in dictionaryData[
                                                'WIWDetectList' + chooseType
                                            ]"
                                            :value="_item.id"
                                            :key="_item.id"
                                            :label="_item.label"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </div> -->
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex]['area']
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="标定检测区域">
                                    <el-button
                                        :disabled="dialogClick"
                                        @click="openSurvey"
                                        >设置</el-button
                                    >
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
import { validateNum, validateNumberOne } from "@/utils/validate";
import EmptyBox from "@/components/coreManage/emptyBox";
import ocxWebControl from "@/utils/ocxWebControl";
export default {
    components: { EmptyBox },
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
                    this.activeChannel = val["intelliDrive_WIW"][0]["chanNo"];
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
        openSurveyBol: {
            handler(newVal) {
                if (!newVal) {
                    this.dialogClick = newVal;
                    this.SurveyBol();
                }
            },
        },
        "form.param983_1": {
            handler(val) {
                console.log("1111111111111111111", val);
                if (val && !Boolean(this.isTemplate)) {
                    let targetTypeArrays = [];
                    let copyTargetTypeArrays = [];
                    // if (val["info"][0]["detect"].length) {
                    //     val["info"][0]["detect"].forEach((item) => {
                    //         targetTypeArrays.push(
                    //             this.dictionaryData["WIWDetectJson1"][item]
                    //         );
                    //     });
                    // } else {
                    //     targetTypeArrays = [];
                    // }
                    // if (
                    //     this.copyForm["param983"][this.activeChannel][
                    //         "param983_1"
                    //     ]["info"][0]["detect"].length
                    // ) {
                    //     this.copyForm["param983"][this.activeChannel][
                    //         "param983_1"
                    //     ]["info"][0]["detect"].forEach((item) => {
                    //         copyTargetTypeArrays.push(
                    //             this.dictionaryData["WIWDetectJson1"][item]
                    //         );
                    //     });
                    // } else {
                    //     copyTargetTypeArrays = [];
                    // }
                    this.formData[
                        "param983_1." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_1"
                        ]["info"][0]["enable"]
                            ? `param983_1.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/左后方注水报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_1"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param983_1." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_1"
                        ]["info"][0]["speed"]
                            ? `param983_1.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/左后方注水报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_1"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param983_1." +
                            this.activeChannel +
                            ".info.0.staticWarnEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["staticWarnEnable"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_1"
                        ]["info"][0]["staticWarnEnable"]
                            ? `param983_1.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/左后方注水报警/报警使能&${
                                  val["info"][0]["staticWarnEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_1"
                                  ]["info"][0]["staticWarnEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param983_1." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_1"
                        ]["info"][0]["confidence"]
                            ? `param983_1.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/左后方注水报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param983"][
                                              this.activeChannel
                                          ]["param983_1"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param983_1." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_1"
                        ]["info"][0]["sensitivity"]
                            ? `param983_1.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/左后方注水报警/算法灵敏度&${
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
                                          this.copyForm["param983"][
                                              this.activeChannel
                                          ]["param983_1"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param983_1." +
                            this.activeChannel +
                            ".info.0.duration.useless.useless.useless"
                    ] =
                        val["info"][0]["duration"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_1"
                        ]["info"][0]["duration"]
                            ? `param983_1.${
                                  this.activeChannel
                              }.info.0.duration.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/左后方注水报警/持续时间&${
                                  val["info"][0]["duration"]
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_1"
                                  ]["info"][0]["duration"]
                              }`
                            : "";
                    this.formData[
                        "param983_1." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_1"
                        ]["info"][0]["volume"]
                            ? `param983_1.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/左后方注水报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_1"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param983_1." +
                            this.activeChannel +
                            ".info.0.installHeight.useless.useless.useless"
                    ] =
                        val["info"][0]["installHeight"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_1"
                        ]["info"][0]["installHeight"]
                            ? `param983_1.${
                                  this.activeChannel
                              }.info.0.installHeight.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/左后方注水报警/相机高度&${
                                  val["info"][0]["installHeight"]
                              }米&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_1"
                                  ]["info"][0]["installHeight"]
                              }米`
                            : "";
                    this.formData[
                        "param983_1." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_1"
                        ]["info"][0]["volumeEnable"]
                            ? `param983_1.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/左后方注水报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_1"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param983_1." +
                            this.activeChannel +
                            ".info.0.angle.useless.useless.useless"
                    ] =
                        val["info"][0]["angle"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_1"
                        ]["info"][0]["angle"]
                            ? `param983_1.${
                                  this.activeChannel
                              }.info.0.angle.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/左后方注水报警/转向角&${
                                  val["info"][0]["angle"]
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_1"
                                  ]["info"][0]["angle"]
                              }`
                            : "";
                    this.formData[
                        "param983_1." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_1"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param983_1.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/左后方注水报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_1"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param983_1." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_1"
                        ]["info"][0]["clip"]["upload"]
                            ? `param983_1.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/左后方注水报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_1"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param983_1." +
                            this.activeChannel +
                            ".info.0.turnSignal.useless.useless.useless"
                    ] =
                        val["info"][0]["turnSignal"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_1"
                        ]["info"][0]["turnSignal"]
                            ? `param983_1.${
                                  this.activeChannel
                              }.info.0.turnSignal.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/左后方注水报警/转向灯关联使能&${
                                  val["info"][0]["turnSignal"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_1"
                                  ]["info"][0]["turnSignal"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param983_1." +
                            this.activeChannel +
                            ".info.0.turnAngle.useless.useless.useless"
                    ] =
                        val["info"][0]["turnAngle"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_1"
                        ]["info"][0]["turnAngle"]
                            ? `param983_1.${
                                  this.activeChannel
                              }.info.0.turnAngle.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/左后方注水报警/转向角&${
                                  val["info"][0]["turnAngle"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_1"
                                  ]["info"][0]["turnAngle"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param983_1." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_1"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param983_1.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/左后方注水报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param983"][
                                  this.activeChannel
                              ]["param983_1"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    // this.formData[
                    //     "param983_1." +
                    //         this.activeChannel +
                    //         ".info.0.detect.useless.useless.useless"
                    // ] =
                    //     val["info"][0]["detect"].toString() !=
                    //     this.copyForm["param983"][this.activeChannel][
                    //         "param983_1"
                    //     ]["info"][0]["detect"].toString()
                    //         ? `param983_1.${
                    //               this.activeChannel
                    //           }.info.0.detect.useless.useless.useless&主动安全设置/WIW/通道${
                    //               this.activeChannel
                    //           }/左后方注水报警/检测类型&${targetTypeArrays
                    //               .splice(",")
                    //               .join("、")}&${copyTargetTypeArrays
                    //               .splice(",")
                    //               .join("、")}`
                    //         : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param983_2": {
            handler(val) {
                console.log("222222222222222222222", val);
                if (val && !Boolean(this.isTemplate)) {
                    let targetTypeArrays = [];
                    let copyTargetTypeArrays = [];
                    // if (val["info"][0]["detect"].length) {
                    //     val["info"][0]["detect"].forEach((item) => {
                    //         targetTypeArrays.push(
                    //             this.dictionaryData["WIWDetectJson2"][item]
                    //         );
                    //     });
                    // } else {
                    //     targetTypeArrays = [];
                    // }
                    // if (
                    //     this.copyForm["param983"][this.activeChannel][
                    //         "param983_2"
                    //     ]["info"][0]["detect"].length
                    // ) {
                    //     this.copyForm["param983"][this.activeChannel][
                    //         "param983_2"
                    //     ]["info"][0]["detect"].forEach((item) => {
                    //         copyTargetTypeArrays.push(
                    //             this.dictionaryData["WIWDetectJson2"][item]
                    //         );
                    //     });
                    // } else {
                    //     copyTargetTypeArrays = [];
                    // }
                    this.formData[
                        "param983_2." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_2"
                        ]["info"][0]["enable"]
                            ? `param983_2.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/右后方注水报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_2"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param983_2." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_2"
                        ]["info"][0]["speed"]
                            ? `param983_2.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/右后方注水报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_2"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param983_2." +
                            this.activeChannel +
                            ".info.0.staticWarnEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["staticWarnEnable"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_2"
                        ]["info"][0]["staticWarnEnable"]
                            ? `param983_2.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/右后方注水报警/报警使能&${
                                  val["info"][0]["staticWarnEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_2"
                                  ]["info"][0]["staticWarnEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param983_2." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_2"
                        ]["info"][0]["confidence"]
                            ? `param983_2.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/右后方注水报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param983"][
                                              this.activeChannel
                                          ]["param983_2"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param983_2." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_2"
                        ]["info"][0]["sensitivity"]
                            ? `param983_2.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/右后方注水报警/算法灵敏度&${
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
                                          this.copyForm["param983"][
                                              this.activeChannel
                                          ]["param983_2"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param983_2." +
                            this.activeChannel +
                            ".info.0.duration.useless.useless.useless"
                    ] =
                        val["info"][0]["duration"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_2"
                        ]["info"][0]["duration"]
                            ? `param983_2.${
                                  this.activeChannel
                              }.info.0.duration.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/右后方注水报警/持续时长&${
                                  val["info"][0]["duration"]
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_2"
                                  ]["info"][0]["duration"]
                              }`
                            : "";
                    this.formData[
                        "param983_2." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_2"
                        ]["info"][0]["volume"]
                            ? `param983_2.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/右后方注水报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_2"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param983_2." +
                            this.activeChannel +
                            ".info.0.installHeight.useless.useless.useless"
                    ] =
                        val["info"][0]["installHeight"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_2"
                        ]["info"][0]["installHeight"]
                            ? `param983_2.${
                                  this.activeChannel
                              }.info.0.installHeight.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/右后方注水报警/相机高度&${
                                  val["info"][0]["installHeight"]
                              }米&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_2"
                                  ]["info"][0]["installHeight"]
                              }米`
                            : "";
                    this.formData[
                        "param983_2." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_2"
                        ]["info"][0]["volumeEnable"]
                            ? `param983_2.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/右后方注水报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_2"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param983_2." +
                            this.activeChannel +
                            ".info.0.angle.useless.useless.useless"
                    ] =
                        val["info"][0]["angle"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_2"
                        ]["info"][0]["angle"]
                            ? `param983_2.${
                                  this.activeChannel
                              }.info.0.angle.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/右后方注水报警/转向角&${
                                  val["info"][0]["angle"]
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_2"
                                  ]["info"][0]["angle"]
                              }`
                            : "";
                    this.formData[
                        "param983_2." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_2"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param983_2.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/右后方注水报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_2"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param983_2." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_2"
                        ]["info"][0]["clip"]["upload"]
                            ? `param983_2.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/右后方注水报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_2"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param983_2." +
                            this.activeChannel +
                            ".info.0.turnSignal.useless.useless.useless"
                    ] =
                        val["info"][0]["turnSignal"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_2"
                        ]["info"][0]["turnSignal"]
                            ? `param983_2.${
                                  this.activeChannel
                              }.info.0.turnSignal.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/右后方注水报警/转向灯关联使能&${
                                  val["info"][0]["turnSignal"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_2"
                                  ]["info"][0]["turnSignal"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param983_2." +
                            this.activeChannel +
                            ".info.0.turnAngle.useless.useless.useless"
                    ] =
                        val["info"][0]["turnAngle"] !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_2"
                        ]["info"][0]["turnAngle"]
                            ? `param983_2.${
                                  this.activeChannel
                              }.info.0.turnAngle.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/右后方注水报警/转向角&${
                                  val["info"][0]["turnAngle"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param983"][this.activeChannel][
                                      "param983_2"
                                  ]["info"][0]["turnAngle"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param983_2." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param983"][this.activeChannel][
                            "param983_2"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param983_2.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/WIW/通道${
                                  this.activeChannel
                              }/右后方注水报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param983"][
                                  this.activeChannel
                              ]["param983_2"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    // this.formData[
                    //     "param983_2." +
                    //         this.activeChannel +
                    //         ".info.0.detect.useless.useless.useless"
                    // ] =
                    //     val["info"][0]["detect"].toString() !=
                    //     this.copyForm["param983"][this.activeChannel][
                    //         "param983_2"
                    //     ]["info"][0]["detect"].toString()
                    //         ? `param983_2.${
                    //               this.activeChannel
                    //           }.info.0.detect.useless.useless.useless&主动安全设置/WIW/通道${
                    //               this.activeChannel
                    //           }/右后方注水报警/检测类型&${targetTypeArrays
                    //               .splice(",")
                    //               .join("、")}&${copyTargetTypeArrays
                    //               .splice(",")
                    //               .join("、")}`
                    //         : "";
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
            dialogClick: false,
            deviceId: this.$route.query.deviceId || "",
            activeName: "",
            deviceCapability: {},
            noneVideoPlay: false, // 是否显示控件
            webVersionControl: null,
            notLastVerson: false,
            form: {},
            copyForm: {},
            formData: {},
            dictionaryData: {},
            tabAndConfiguration: [],
            activeChannel: "",
            chooseType: "",
            chooseIndex: "",
            chanNoIndex: 0,
            openSurveyBol: false,
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
        this.$emit("setMenuActiveRefFormName", "PrivateWiwForm");
        //this.makeTabList()
    },
    methods: {
        beforeLeave(activeName, oldActiveName) {
            this.$refs.PrivateWiwForm.validate((valid) => {
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
            console.log(this.chooseType);
            let params = {
                deviceId: this.deviceId,
                param: {
                    type:
                        this.activeName == "WIW全局配置" ? "" : this.chooseType,
                    chanNo: this.activeChannel,
                },
                msgId: 983,
            };
            this.chooseType =
                this.activeName == "WIW全局配置" ? "" : this.chooseType;
            if (Boolean(this.isTemplate)) return;
            if (
                !this.form["param983"] ||
                !this.form["param983"][this.activeChannel] ||
                !this.form["param983"][this.activeChannel][
                    "param983_" + this.chooseType
                ]
            ) {
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
                        if (this.form["param983_"]) {
                            formData["enable"] =
                                this.form["param983_"]["enable"];
                            formData["cameraPos"] =
                                this.form["param983_"]["cameraPos"];
                        } else {
                            this.$set(this.form, `param983_`, formData);
                            this.$set(
                                this.copyForm,
                                `param983_`,
                                JSON.parse(JSON.stringify(formData))
                            );
                            if (!this.form["param983"])
                                this.$set(this.form, "param983", {});
                            if (
                                this.form["param983"] &&
                                !this.form["param983"][this.activeChannel]
                            )
                                this.$set(
                                    this.form["param983"],
                                    this.activeChannel,
                                    {}
                                );
                            if (
                                this.form["param983"] &&
                                this.form["param983"][this.activeChannel] &&
                                !this.form["param983"][this.activeChannel][
                                    `param983_`
                                ]
                            )
                                this.$set(
                                    this.form["param983"][this.activeChannel],
                                    `param983_`,
                                    formData
                                );
                            this.$set(
                                this.copyForm,
                                `param983_`,
                                JSON.parse(JSON.stringify(formData))
                            );
                            if (!this.copyForm["param983"])
                                this.$set(
                                    this.copyForm,
                                    "param983",
                                    JSON.parse(JSON.stringify({}))
                                );
                            if (
                                this.copyForm["param983"] &&
                                !this.copyForm["param983"][this.activeChannel]
                            )
                                this.$set(
                                    this.copyForm["param983"],
                                    this.activeChannel,
                                    JSON.parse(JSON.stringify({}))
                                );
                            if (
                                this.copyForm["param983"] &&
                                this.copyForm["param983"][this.activeChannel] &&
                                !this.copyForm["param983"][this.activeChannel][
                                    `param983_`
                                ]
                            )
                                this.$set(
                                    this.copyForm["param983"][
                                        this.activeChannel
                                    ],
                                    `param983_`,
                                    JSON.parse(JSON.stringify(formData))
                                );
                        }
                        this.$set(
                            this.form,
                            `param983_${this.chooseType}`,
                            formData
                        );
                        if (!this.form["param983"])
                            this.$set(this.form, "param983", {});
                        if (
                            this.form["param983"] &&
                            !this.form["param983"][this.activeChannel]
                        )
                            this.$set(
                                this.form["param983"],
                                this.activeChannel,
                                {}
                            );
                        if (
                            this.form["param983"] &&
                            this.form["param983"][this.activeChannel] &&
                            !this.form["param983"][this.activeChannel][
                                `param983_${this.chooseType}`
                            ]
                        )
                            this.$set(
                                this.form["param983"][this.activeChannel],
                                `param983_${this.chooseType}`,
                                formData
                            );
                        this.$set(
                            this.copyForm,
                            `param983_${this.chooseType}`,
                            JSON.parse(JSON.stringify(formData))
                        );
                        if (!this.copyForm["param983"])
                            this.$set(
                                this.copyForm,
                                "param983",
                                JSON.parse(JSON.stringify({}))
                            );
                        if (
                            this.copyForm["param983"] &&
                            !this.copyForm["param983"][this.activeChannel]
                        )
                            this.$set(
                                this.copyForm["param983"],
                                this.activeChannel,
                                JSON.parse(JSON.stringify({}))
                            );
                        if (
                            this.copyForm["param983"] &&
                            this.copyForm["param983"][this.activeChannel] &&
                            !this.copyForm["param983"][this.activeChannel][
                                `param983_${this.chooseType}`
                            ]
                        )
                            this.$set(
                                this.copyForm["param983"][this.activeChannel],
                                `param983_${this.chooseType}`,
                                JSON.parse(JSON.stringify(formData))
                            );
                        this.childConfigParams = false;
                        console.log(this.form);
                        console.log(this.copyForm);
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
            this.$refs.PrivateWiwForm.validate((valid) => {
                if (!valid) {
                    this.$message.warning("当前表单验证不通过，请先完善！");
                } else {
                    this.form = Object.assign(
                        {},
                        this.form,
                        this.form["param983"][chanNo]
                    );
                    this.activeChannel = chanNo;
                    //this.activeName = (this.deviceCapability['intelliDrive_WIW'][index]['enable'] && this.deviceCapability['intelliDrive_WIW'][index]['enable'].length) || this.deviceCapability['intelliDrive_WIW'][index]['speedCalibration'] ? 'WIW全局配置' : this.tabAndConfiguration[index]['tabList'][0]['name'];
                    this.activeName =
                        this.tabAndConfiguration[index]["tabList"][0]["name"];
                    this.chooseType =
                        (this.deviceCapability["intelliDrive_WIW"][index][
                            "enable"
                        ] &&
                            this.deviceCapability["intelliDrive_WIW"][index][
                                "enable"
                            ].length) ||
                        this.deviceCapability["intelliDrive_WIW"][index][
                            "speedCalibration"
                        ]
                            ? ""
                            : this.tabAndConfiguration[index]["tabList"][0][
                                  "types"
                              ][0];
                    this.chooseIndex = 0;
                    this.chanNoIndex = index;
                    this.getPrivateProcotol(
                        this.activeName,
                        this.tabAndConfiguration[this.chanNoIndex],
                        "",
                        ""
                    );
                }
            });
            // this.$refs.PrivateWiwForm.validate((valid) =>{
            //   if(!valid){
            //     this.$message.warning('当前表单验证不通过，请先完善！')
            //     return new Promise((resolve,reject) =>{
            //       valid == true;
            //     }).then(() =>{
            //       resolve()

            //     }).catch(reject(err))
            //   }
            // })
        },
        //切换报警等级
        changeAlarmLevel(item, _index, index, index_) {
            this.$refs.PrivateWiwForm.validate((valid) => {
                if (!valid) {
                    this.$message.warning("当前表单验证不通过，请先完善！");
                } else {
                    this.chooseType = item;
                    this.chooseIndex = _index;
                    this.tabIndex = index_;
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
            this.deviceCapability["intelliDrive_WIW"].forEach((item, index) => {
                this.tabAndConfiguration[index] = {};
                this.tabAndConfiguration[index]["chanNo"] = item["chanNo"];
                this.tabAndConfiguration[index]["tabList"] = [];
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "左后方注水报警",
                    1
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "右后方注水报警",
                    2
                );
            });
            console.log(this.tabAndConfiguration);
            //this.activeName = (this.deviceCapability['intelliDrive_WIW'][0]['enable'] && this.deviceCapability['intelliDrive_WIW'][0]['enable'].length) || this.deviceCapability['intelliDrive_WIW'][0]['speedCalibration'] ? 'WIW全局配置' : this.tabAndConfiguration[0]['tabList'][0]['name'];
            this.activeName = this.tabAndConfiguration[0]["tabList"][0]["name"];
            this.activeChannel = this.tabAndConfiguration[0]["chanNo"];
            this.chooseType =
                this.tabAndConfiguration[0]["tabList"][0]["types"][0];
            this.chooseIndex = 0;
            this.chanNoIndex = 0;
            this.tabAndConfiguration.forEach((i) => {
                i.tabList.forEach((j, index) => {
                    j.index = index;
                    j.capabilitys.forEach((k) => {
                        k.sensitivityList = [];
                        /* --------------------算法灵敏度 start-------------------------*/
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
                                            funcName: "SetWIWAreaParams",
                                            arguments: {
                                                devSerialNum: "E61911993",
                                                deviceType: "AE-AC3141-A",
                                                areas: item,
                                                horizonFrontDefault: [
                                                    {
                                                        typeName: "一级区域",
                                                        polygon: [
                                                            { x: 626, y: 351 },
                                                            { x: 187, y: 636 },
                                                            { x: 79, y: 964 },
                                                            { x: 627, y: 929 },
                                                            { x: 844, y: 504 },
                                                        ],
                                                    },
                                                    {
                                                        typeName: "二级区域",
                                                        polygon: [
                                                            { x: 594, y: 403 },
                                                            { x: 230, y: 686 },
                                                            { x: 144, y: 910 },
                                                            { x: 627, y: 929 },
                                                            { x: 844, y: 504 },
                                                        ],
                                                    },
                                                    {
                                                        typeName: "三级区域",
                                                        polygon: [
                                                            { x: 588, y: 425 },
                                                            { x: 323, y: 712 },
                                                            { x: 236, y: 846 },
                                                            { x: 627, y: 929 },
                                                            { x: 844, y: 504 },
                                                        ],
                                                    },
                                                ],
                                                overlookDefault: [
                                                    {
                                                        typeName: "一级区域",
                                                        polygon: [
                                                            { x: 967, y: 326 },
                                                            { x: 170, y: 454 },
                                                            { x: 60, y: 853 },
                                                            { x: 822, y: 1000 },
                                                            { x: 947, y: 671 },
                                                        ],
                                                    },
                                                    {
                                                        typeName: "二级区域",
                                                        polygon: [
                                                            { x: 925, y: 382 },
                                                            { x: 166, y: 492 },
                                                            { x: 66, y: 821 },
                                                            { x: 776, y: 950 },
                                                            { x: 937, y: 654 },
                                                        ],
                                                    },
                                                    {
                                                        typeName: "三级区域",
                                                        polygon: [
                                                            { x: 884, y: 468 },
                                                            { x: 212, y: 550 },
                                                            { x: 87, y: 810 },
                                                            { x: 763, y: 917 },
                                                            { x: 912, y: 667 },
                                                        ],
                                                    },
                                                ],
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
                // getWIWArea(){
                //   this.videoPlayControl.obj.JS_RequestInterface({
                //     funcName:'WIWAreaParamsChanged',
                //   })
                // },
                cbIntegrationCallBack(oData) {},
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
            let dataArr = [[], [], []];
            if (oData.responseMsg) {
                if (oData.responseMsg.event == "WIWAreaParamsChanged") {
                    oData.responseMsg.msg.areas.forEach((item) => {
                        switch (item.typeName) {
                            case "一级区域":
                                for (let i = 0; i < item.polygon.length; i++) {
                                    dataArr[0].push({
                                        x: item.polygon[i].x,
                                        y: item.polygon[i].y,
                                    });
                                }
                                break;
                            case "二级区域":
                                for (let i = 0; i < item.polygon.length; i++) {
                                    dataArr[1].push({
                                        x: item.polygon[i].x,
                                        y: item.polygon[i].y,
                                    });
                                }
                                break;
                            default: {
                                for (let i = 0; i < item.polygon.length; i++) {
                                    dataArr[2].push({
                                        x: item.polygon[i].x,
                                        y: item.polygon[i].y,
                                    });
                                }
                                break;
                            }
                        }
                    });
                    let newDataArr = dataArr.filter((item) => {
                        return item.length !== 0;
                    });
                    this.form["param983_" + this.chooseType]["info"][0][
                        "area"
                    ] = newDataArr;
                    switch (this.chooseType) {
                        case 0:
                            this.formData[
                                "param983_0." +
                                    this.activeChannel +
                                    ".info.0.area.useless.useless.useless"
                            ] = `param983_0.${this.activeChannel}.info.0.area.useless.useless.useless&主动安全设置/WIW/通道${this.activeChannel}/左后方注水报警/标定区域&新区域`;
                            break;
                        case 1:
                            this.formData[
                                "param983_1." +
                                    this.activeChannel +
                                    ".info.0.area.useless.useless.useless"
                            ] = `param983_1.${this.activeChannel}.info.0.area.useless.useless.useless&主动安全设置/WIW/通道${this.activeChannel}/左后方注水报警/标定区域&新区域`;
                            break;
                        case 2:
                            this.formData[
                                "param983_2." +
                                    this.activeChannel +
                                    ".info.0.area.useless.useless.useless"
                            ] = `param983_2.${this.activeChannel}.info.0.area.useless.useless.useless&主动安全设置/WIW/通道${this.activeChannel}/右后方注水报警/标定区域&新区域`;
                            break;
                        case 3:
                            this.formData[
                                "param983_3." +
                                    this.activeChannel +
                                    ".info.0.area.useless.useless.useless"
                            ] = `param983_3.${this.activeChannel}.info.0.area.useless.useless.useless&主动安全设置/WIW/通道${this.activeChannel}/右后方注水报警/标定区域&新区域`;
                            break;
                        case 4:
                            this.formData[
                                "param983_4." +
                                    this.activeChannel +
                                    ".info.0.area.useless.useless.useless"
                            ] = `param983_4.${this.activeChannel}.info.0.area.useless.useless.useless&主动安全设置/WIW/通道${this.activeChannel}/全区域（M2设备）/标定区域&新区域`;
                            break;
                        case 5:
                            this.formData[
                                "param983_5." +
                                    this.activeChannel +
                                    ".info.0.area.useless.useless.useless"
                            ] = `param983_5.${this.activeChannel}.info.0.area.useless.useless.useless&主动安全设置/WIW/通道${this.activeChannel}/前侧盲区/左后方注水报警/标定区域&新区域`;
                            break;
                        case 6:
                            this.formData[
                                "param983_6." +
                                    this.activeChannel +
                                    ".info.0.area.useless.useless.useless"
                            ] = `param983_6.${this.activeChannel}.info.0.area.useless.useless.useless&主动安全设置/WIW/通道${this.activeChannel}/前侧盲区/右后方注水报警/标定区域&新区域`;
                            break;
                        case 7:
                            this.formData[
                                "param983_7." +
                                    this.activeChannel +
                                    ".info.0.area.useless.useless.useless"
                            ] = `param983_7.${this.activeChannel}.info.0.area.useless.useless.useless&主动安全设置/WIW/通道${this.activeChannel}/后侧盲区/左后方注水报警/标定区域&新区域`;
                            break;
                        case 8:
                            this.formData[
                                "param983_8." +
                                    this.activeChannel +
                                    ".info.0.area.useless.useless.useless"
                            ] = `param983_8.${this.activeChannel}.info.0.area.useless.useless.useless&主动安全设置/WIW/通道${this.activeChannel}/后侧盲区/右后方注水报警/标定区域&新区域`;
                            break;
                    }

                    this.$message.success("设置成功，点击下发至终端生效");
                    this.openSurveyBol = false;
                } else if (oData.responseMsg.event == "CancelBtnClicked") {
                    this.openSurveyBol = false;
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
        openSurvey: throttle(function (e) {
            this.dialogClick = true;
            this.openSurveyBol = true;
            let areaContent = [
                {
                    typeName: "一级区域",
                    polygon: [],
                },
                {
                    typeName: "二级区域",
                    polygon: [],
                },
                {
                    typeName: "三级区域",
                    polygon: [],
                },
            ];
            let areaArr =
                this.form["param983_" + this.chooseType]["info"][0]["area"];
            console.log(areaArr);
            areaArr.forEach((item, index) => {
                switch (index + 1) {
                    case 1:
                        for (let i = 0; i < item.length; i++) {
                            areaContent[0].polygon.push({
                                x: parseInt(item[i].x),
                                y: parseInt(item[i].y),
                            });
                        }
                        break;
                    case 2:
                        for (let i = 0; i < item.length; i++) {
                            areaContent[1].polygon.push({
                                x: parseInt(item[i].x),
                                y: parseInt(item[i].y),
                            });
                        }
                        break;
                    default:
                        for (let i = 0; i < item.length; i++) {
                            areaContent[2].polygon.push({
                                x: parseInt(item[i].x),
                                y: parseInt(item[i].y),
                            });
                        }
                        break;
                }
            });
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
                    console.log(areaContent);
                    this.noneVideoPlay = false;
                    let box = document.getElementById("videoPlay");
                    console.log(box);
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
        }, 1000),
        SurveyBol() {
            // console.log(this.videoPlayControl);
            this.videoPlayControl.JS_DestroyWnd().then(
                () => {},
                () => {
                    console.log("控件销毁失败");
                }
            );
            this.openSurveyBol = false;
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
.surveyPlace {
    font-size: 18px;
    margin-bottom: 8px;
}
.divHeight {
    height: 500px;
    width: 800;
}
</style>
