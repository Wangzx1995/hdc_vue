<template>
    <div class="p-a-md">
        <div id="id" style="width: 0; height: 0"></div>
        <el-dialog
            title="标定检测区域"
            :visible.sync="openSurveyBol"
            :before-close="handleClose"
        >
            <el-switch
                v-model="isPlugin"
                active-text="插件"
                inactive-text="无插件"
                class="m-l"
                v-if="!isTemplate"
            >
            </el-switch>
            <a
                type="text"
                class="m-r"
                style="float: right; line-height: 32px"
                @click="reDownLoad"
                v-if="notLastVerson && !isTemplate"
                >发现新控件版本</a
            >
            <div class="divHeight" v-if="openSurveyBol && !isPlugin">
                <BSDNoPlugin
                    ref="BSDNoPlugin"
                    :playUrl="playUrl"
                    @cancelSurveyBol="cancelSurveyBol"
                    @saveSurveyBol="saveSurveyBol"
                    :isTemplate="isTemplate"
                ></BSDNoPlugin>
            </div>
            <div class="divHeight" v-if="openSurveyBol && isPlugin">
                <!-- <div class="h-full inline" style="height:100%;width:100%;" id="videoPlay"></div> -->
                <!--控件版本-->
                <div id="AEStreamWebVersion" style="width: 0; height: 0"></div>
                <!-- 加入控件 -->

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
            ref="PublicBsd"
            label-position="top"
            :model="form"
            label-width="120px"
        >
            <div class="channels">
                <el-button
                    :type="item == activeChannel ? 'info' : ''"
                    v-for="item in channelList"
                    @click="changeChannel(item)"
                    :key="item"
                    >通道{{ item }}</el-button
                >
            </div>
            <template
                v-if="
                    form['IsApiBsdInfo'] &&
                    form['IsApiBsdInfo']['BSD'] &&
                    form['IsApiBsdInfo']['BSD'].length > 0
                "
            >
                <el-tabs
                    id="title"
                    v-model="activeName"
                    @tab-click="getByIsApi(activeChannel, false)"
                >
                    <!-- <el-tab-pane label="BSD全局配置" name="first">
            <el-row type="flex" justify="space-between" style="margin-top: 10px">
                <el-col :span="7" >
                    <el-form-item label="BSD报警使能" description="开启后可统一开启BSD报警使能">
                        <el-select v-model="form['F364'].alarmEnable" placeholder="请选择">
                          <el-option label="关闭" :value="0"></el-option>
                          <el-option label="开启" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="BSD报警音量开关" prop="F364.speedThreshold" description="开启后可统一设置BSD报警音量">
                      <el-select v-model="form['F364'].alarmEnable" placeholder="请选择">
                          <el-option label="关闭" :value="0"></el-option>
                          <el-option label="开启" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                        <el-form-item label="BSD报警音量" prop="F364.alarmVolume">
                        <el-slider v-model="form['F364'].alarmVolume" :min="0" :max="8" :step="1"></el-slider>
                        </el-form-item>
                </el-col>
            </el-row>
          </el-tab-pane> -->
                    <el-tab-pane
                        :label="item.name"
                        :name="item.commandId"
                        v-for="item in capabilityList"
                        :key="item.index"
                    >
                        <template v-if="form['IsApiBsdInfo']">
                            <el-row type="flex" justify="space-between">
                                <el-col :span="7">
                                    <el-form-item
                                        :label="item.shortName + '报警使能'"
                                    >
                                        <el-switch
                                            v-model="
                                                form['IsApiBsdInfo'].BSD[
                                                    item['indexItem']
                                                ].enabled
                                            "
                                        ></el-switch>
                                        <!-- <el-select v-model="form[item.commandId].enabled">
                          <el-option label="关闭" :value="0"></el-option>
                          <el-option label="开启" :value="1"></el-option>
                        </el-select> -->
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item
                                        label="报警判断速度阈值"
                                        :rules="{
                                            validator: checkNumber.bind({
                                                type: 'int',
                                                min: form[
                                                    'IsApiBsdInfoCapability'
                                                ].limitSpeedMin,
                                                max: maxSpeed
                                                    ? maxSpeed
                                                    : form[
                                                          'IsApiBsdInfoCapability'
                                                      ].limitSpeedMax,
                                            }),
                                            trigger: 'blur',
                                        }"
                                        :prop="
                                            'IsApiBsdInfo.BSD.' +
                                            item['indexItem'] +
                                            '.limitSpeed'
                                        "
                                    >
                                        <el-input
                                            tips-placement="top-end"
                                            :tips="`键入值范围为${
                                                form['IsApiBsdInfoCapability']
                                                    .limitSpeedMin
                                            }~${
                                                maxSpeed
                                                    ? maxSpeed
                                                    : form[
                                                          'IsApiBsdInfoCapability'
                                                      ].limitSpeedMax
                                            }`"
                                            v-model="
                                                form['IsApiBsdInfo'].BSD[
                                                    item['indexItem']
                                                ].limitSpeed
                                            "
                                            ><span slot="suffix"
                                                >km/h</span
                                            ></el-input
                                        >
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item
                                        v-if="
                                            form['IsApiBsdInfo'].BSD[
                                                item['indexItem']
                                            ].enableStatic === false ||
                                            form['IsApiBsdInfo'].BSD[
                                                item['indexItem']
                                            ].enableStatic === true
                                        "
                                        label="静止报警使能"
                                    >
                                        <el-switch
                                            v-model="
                                                form['IsApiBsdInfo'].BSD[
                                                    item['indexItem']
                                                ].enableStatic
                                            "
                                        ></el-switch>
                                        <!-- <el-select v-model="item.eventEnabled">
                        <el-option label="关闭" :value="0"></el-option>
                        <el-option label="开启" :value="1"></el-option>
                      </el-select> -->
                                    </el-form-item>
                                </el-col>
                                <!-- <el-col :span="7" >
                    <el-form-item label="报警抑制时间 (100-600)" :rules="{ validator: checkNumber.bind({type:'int',min:form['IsApiBsdInfoCapability'].intervalTimeMin,max:form['IsApiBsdInfoCapability'].intervalTimeMax}), trigger: 'blur' }" prop="IsApiBsdInfo.BSD[0].intervalTime">
                        <el-input v-model="form['IsApiBsdInfo'].BSD[0].intervalTime"><span slot="suffix">ms</span></el-input>
                    </el-form-item>
                  </el-col> -->
                            </el-row>
                            <el-row type="flex" justify="space-between">
                                <el-col :span="7">
                                    <el-form-item
                                        v-if="
                                            form['IsApiBsdTriggerList'][
                                                'EventRuleTriggerList'
                                            ][item['indexItem']][
                                                'EventTriggerList'
                                            ][0]['Audio'].volume !== ''
                                        "
                                        :label="item.shortName + '报警音量'"
                                    >
                                        <el-slider
                                            v-model="
                                                form['IsApiBsdTriggerList'][
                                                    'EventRuleTriggerList'
                                                ][item['indexItem']][
                                                    'EventTriggerList'
                                                ][0]['Audio'].volume
                                            "
                                            :min="0"
                                            :max="64"
                                            :step="1"
                                            show-input
                                        ></el-slider>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item
                                        v-if="
                                            form['IsApiBsdInfoCapability']
                                                .installTypeList.length !== 0
                                        "
                                        label="相机位置"
                                        :rules="{ trigger: 'blur' }"
                                        :prop="
                                            'IsApiBsdInfo.BSD.' +
                                            item['indexItem'] +
                                            '.installType'
                                        "
                                    >
                                        <!-- <el-switch v-model="item.timeToCollision" active-value="1" inactive-value="0"></el-switch> -->
                                        <el-select
                                            v-model="
                                                form['IsApiBsdInfo'].BSD[0]
                                                    .installType
                                            "
                                        >
                                            <!-- <el-option label="平视前置" value="horizonFront"></el-option>
                        <el-option label="平视后置" value="horizonBack"></el-option>
                        <el-option label="俯视前置" value="overlookFront"></el-option> -->
                                            <el-option
                                                v-for="item in form[
                                                    'IsApiBsdInfoCapability'
                                                ].installTypeList"
                                                :key="item.itemKey"
                                                :value="item.itemKey"
                                                :label="item.itemValue"
                                            ></el-option>
                                            <!-- <el-option label="俯视前置" value="overlookBack"></el-option> -->
                                            <!-- <el-option label="平视后置" :value="1"></el-option>
                        <el-option label="俯视后置" :value="2"></el-option> -->
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item
                                        v-if="
                                            form['IsApiBsdInfoCapability']
                                                .installHeightMax !== ''
                                        "
                                        label="相机安装高度"
                                        :rules="{
                                            validator: checkNumberOne.bind({
                                                type: 'int',
                                                min: form[
                                                    'IsApiBsdInfoCapability'
                                                ].installHeightMin,
                                                max: form[
                                                    'IsApiBsdInfoCapability'
                                                ].installHeightMax,
                                            }),
                                            trigger: 'blur',
                                        }"
                                        :prop="
                                            'IsApiBsdInfo.BSD.' +
                                            item['indexItem'] +
                                            '.installHeight'
                                        "
                                    >
                                        <el-input
                                            tips-placement="top-end"
                                            :tips="`键入值范围为${form['IsApiBsdInfoCapability'].installHeightMin}~${form['IsApiBsdInfoCapability'].installHeightMax}`"
                                            v-model="
                                                form['IsApiBsdInfo'].BSD[
                                                    item['indexItem']
                                                ].installHeight
                                            "
                                            ><span slot="suffix"
                                                >m</span
                                            ></el-input
                                        >
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row type="flex" justify="space-between">
                                <!-- <el-col :span="7" >
                  <el-form-item label="算法置信度(1-100)" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:100}), trigger: 'blur' }" prop="IsApiBsdInfo.BSD[0].confidence">
                    <el-input v-model="form['IsApiBsdInfo'].BSD[0].confidence"><span slot="suffix">%</span></el-input> -->
                                <!-- <el-select v-model="item.eventEnabled">
                        <el-option label="不上传" :value="0"></el-option>
                        <el-option label="上传" :value="1"></el-option>
                      </el-select> -->
                                <!-- </el-form-item>
                </el-col> -->
                                <!-- <el-col :span="7" >
                  <el-form-item label="抓图张数" :rules="{ validator: checkNumber.bind({type:'int',min:form['IsApiBsdInfoCapability'].pictureNumMin,max:form['IsApiBsdInfoCapability'].pictureNumMax}), trigger: 'blur' }" prop="IsApiBsdInfo.BSD[0].pictureNum">
                    <el-input v-model="form['IsApiBsdInfo'].BSD[0].pictureNum"></el-input>
                  </el-form-item>
                </el-col> -->
                                <el-col :span="7">
                                    <el-form-item
                                        v-if="
                                            form['IsApiBsdInfoCapability']
                                                .sensitivityMax !== ''
                                        "
                                        label="算法灵敏度"
                                        :rules="{
                                            validator: checkNumber.bind({
                                                type: 'int',
                                                min: form[
                                                    'IsApiBsdInfoCapability'
                                                ].sensitivityMin,
                                                max: form[
                                                    'IsApiBsdInfoCapability'
                                                ].sensitivityMax,
                                            }),
                                            trigger: 'blur',
                                        }"
                                        :prop="
                                            'IsApiBsdInfo.BSD.' +
                                            item['indexItem'] +
                                            '.sensitivity'
                                        "
                                    >
                                        <el-input
                                            tips-placement="top-end"
                                            :tips="`键入值范围为${form['IsApiBsdInfoCapability'].sensitivityMin}~${form['IsApiBsdInfoCapability'].sensitivityMax}`"
                                            v-model="
                                                form['IsApiBsdInfo'].BSD[
                                                    item['indexItem']
                                                ].sensitivity
                                            "
                                        ></el-input>
                                        <!-- <el-select v-model="item.snapShotUpload">
                        <el-option label="关闭" :value="0"></el-option>
                        <el-option label="打开" :value="1"></el-option>
                      </el-select> -->
                                    </el-form-item>
                                </el-col>
                                <!-- <el-col :span="7" > -->

                                <!-- <el-form-item label="报警图片存储使能" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" prop="IsApiBsdInfo.BSD[0].limitSpeed">
                    <el-switch v-model="form['IsApiBsdInfo'].BSD[0].snapShotNum" active-value="1" inactive-value="0"></el-switch>
                  </el-form-item> -->
                                <!-- </el-col> -->
                                <el-col :span="7">
                                    <el-form-item
                                        v-if="
                                            form['IsApiBsdInfo'].BSD[
                                                item['indexItem']
                                            ].uploadPicEnabled === false ||
                                            form['IsApiBsdInfo'].BSD[
                                                item['indexItem']
                                            ].uploadPicEnabled === true
                                        "
                                        label="报警图片上传使能"
                                    >
                                        <el-switch
                                            v-model="
                                                form['IsApiBsdInfo'].BSD[
                                                    item['indexItem']
                                                ].uploadPicEnabled
                                            "
                                        ></el-switch>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item
                                        v-if="
                                            form['IsApiBsdInfoCapability']
                                                .turnAngleMax !== ''
                                        "
                                        label="转向角"
                                        :rules="{
                                            validator: checkNumber.bind({
                                                type: 'int',
                                                min: form[
                                                    'IsApiBsdInfoCapability'
                                                ].turnAngleMin,
                                                max: form[
                                                    'IsApiBsdInfoCapability'
                                                ].turnAngleMax,
                                            }),
                                            trigger: 'blur',
                                        }"
                                        :prop="
                                            'IsApiBsdInfo.BSD.' +
                                            item['indexItem'] +
                                            '.turnAngle'
                                        "
                                    >
                                        <el-input
                                            tips-placement="top-end"
                                            :tips="`键入值范围为${form['IsApiBsdInfoCapability'].turnAngleMin}~${form['IsApiBsdInfoCapability'].turnAngleMax}`"
                                            v-model="
                                                form['IsApiBsdInfo'].BSD[
                                                    item['indexItem']
                                                ].turnAngle
                                            "
                                            ><span slot="suffix"
                                                >°</span
                                            ></el-input
                                        >
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row type="flex" justify="space-between">
                                <!-- <el-col :span="7" >
                <el-form-item label="抓图间隔" :rules="{ validator: checkNumber.bind({type:'int',min:form['IsApiBsdInfoCapability'].snapIntervalTimeMin,max:form['IsApiBsdInfoCapability'].snapIntervalTimeMax}), trigger: 'blur' }" prop="IsApiBsdInfo.BSD[0].snapIntervalTime">
                  <el-input v-model="form['IsApiBsdInfo'].BSD[0].snapIntervalTime"><span slot="suffix">s</span></el-input> -->
                                <!-- <el-select v-model="item.clipUpload">
                      <el-option label="关闭" :value="0"></el-option>
                      <el-option label="打开" :value="1"></el-option>
                    </el-select> -->
                                <!-- </el-form-item>
              </el-col> -->
                                <el-col :span="7">
                                    <el-form-item
                                        v-if="
                                            form['IsApiBsdInfo'].BSD[
                                                item['indexItem']
                                            ].uploadVideoEnabled === false ||
                                            form['IsApiBsdInfo'].BSD[
                                                item['indexItem']
                                            ].uploadVideoEnabled === true
                                        "
                                        label="报警视频上传使能"
                                    >
                                        <el-switch
                                            v-model="
                                                form['IsApiBsdInfo'].BSD[
                                                    item['indexItem']
                                                ].uploadVideoEnabled
                                            "
                                        ></el-switch>
                                    </el-form-item>
                                </el-col>
                                <!-- <el-col :span="7" > -->
                                <!-- <el-form-item label="报警视频存储使能" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" prop="IsApiBsdInfo.BSD[0].limitSpeed">
                  <el-switch v-model="form['IsApiBsdInfo'].BSD[0].snapShotNum" active-value="1" inactive-value="0"></el-switch>
                </el-form-item> -->
                                <!-- </el-col> -->
                                <el-col :span="7">
                                    <el-form-item
                                        v-if="
                                            form['IsApiBsdInfo'].BSD[
                                                item['indexItem']
                                            ].enableTurnAngle === false ||
                                            form['IsApiBsdInfo'].BSD[
                                                item['indexItem']
                                            ].enableTurnAngle === true
                                        "
                                        label="转向角关联使能"
                                    >
                                        <el-switch
                                            v-model="
                                                form['IsApiBsdInfo'].BSD[
                                                    item['indexItem']
                                                ].enableTurnAngle
                                            "
                                        ></el-switch>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item
                                        v-if="
                                            form['IsApiBsdInfo'].BSD[
                                                item['indexItem']
                                            ].enableTurnlight === false ||
                                            form['IsApiBsdInfo'].BSD[
                                                item['indexItem']
                                            ].enableTurnlight === true
                                        "
                                        label="转向灯关联使能"
                                    >
                                        <el-switch
                                            v-model="
                                                form['IsApiBsdInfo'].BSD[
                                                    item['indexItem']
                                                ].enableTurnlight
                                            "
                                        ></el-switch>
                                        <!-- <el-select v-model="item.eventEnabled">
                      <el-option label="关闭" :value="0"></el-option>
                      <el-option label="开启" :value="1"></el-option>
                    </el-select> -->
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row type="flex" justify="space-between">
                                <el-col :span="7">
                                    <el-form-item
                                        label="监测类型"
                                        :rules="{
                                            validator: checkString.bind({
                                                type: 'array',
                                            }),
                                            trigger: 'blur',
                                        }"
                                        :prop="
                                            'IsApiBsdInfo.BSD.' +
                                            item['indexItem'] +
                                            '.targetTypeArray'
                                        "
                                    >
                                        <el-select
                                            @change="showTargetType"
                                            multiple
                                            multiple-nowrap
                                            v-model="
                                                form['IsApiBsdInfo'].BSD[
                                                    item['indexItem']
                                                ].targetTypeArray
                                            "
                                        >
                                            <el-option
                                                v-for="item in targetTypeArrayList"
                                                :value="item.value"
                                                :key="item.value"
                                                :label="item.label"
                                            ></el-option>
                                            <!-- <el-option label="行人" value="pedestrian"></el-option>
                    <el-option label="自行车" value="bicycle"></el-option>
                    <el-option label="摩托车" value="motorcycle"></el-option>
                    <el-option label="机动车" value="vehicle"></el-option> -->
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <!-- <el-form-item label="短视频前半部分时长" :rules="{ validator: checkNumber.bind({type:'int',min:1,max:100}), trigger: 'blur' }" prop="IsApiBsdInfo.BSD[0].limitSpeed">
                    <el-input v-model="form['IsApiBsdInfo'].BSD[0].videoPreRecordTime"><span slot="suffix">s</span></el-input>
                  </el-form-item> -->
                                </el-col>
                                <el-col :span="7">
                                    <!-- <el-form-item label="短视频后半部分时长" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:3}), trigger: 'blur' }" prop="IsApiBsdInfo.BSD[0].limitSpeed">
                    <el-input v-model="form['IsApiBsdInfo'].BSD[0].videoDelayRecordTIme"></el-input>
                  </el-form-item> -->
                                </el-col>
                            </el-row>
                            <el-row type="flex" justify="space-between">
                                <el-col :span="7"> </el-col>
                            </el-row>
                            <el-row type="flex" justify="space-between">
                            </el-row>
                            <p class="surveyPlace">标定检测区域</p>
                            <el-button
                                :disabled="dialogClick"
                                @click="openSurvey"
                                >设置</el-button
                            >
                        </template>
                    </el-tab-pane>
                </el-tabs>
            </template>
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
import BSDNoPlugin from "@/components/webControlService/configuration/bsd.vue";
export default {
    components: { EmptyBox, BSDNoPlugin },
    props: {
        detail: {
            type: Object,
            default: () => {
                return {};
            },
        },
        componentName: {
            type: String,
        },
        configParams: {
            type: Boolean,
            default: false,
        },
        deviceCapabilities: {
            type: Object,
            default: () => {
                return {};
            },
        },
        isTemplate: {
            type: String,
        },
        allCopyData: {
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
        postChannel: {
            type: Object,
            default: () => {
                return {};
            },
        },
        postChannelData: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    watch: {
        isPlugin: {
            handler(val, oldVal) {
                if (this.videoPlayControl != null)
                    this.videoPlayControl.JS_DestroyWnd().then(
                        () => {},
                        () => {}
                    );

                if (val) {
                    this.$refs.BSDNoPlugin.cancel(false);
                }

                this.openSurvey();
            },
            deep: true,
        },
        deviceCapabilities: {
            handler(newVal, oldVal) {
                if (Boolean(this.isTemplate) == true) {
                } else {
                    this.channelList = [];
                    this.whdChannelList = [];
                    let channelShow = ["BSD"];
                    let channels = [];
                    let whdChannelShow = [
                        "NoHand",
                        "SingleHand",
                        "PlayMobilePhone",
                    ];
                    let whdChannels = [];
                    newVal["IsApiChannelsCapability"][
                        "channelEventList"
                    ].forEach((item) => {
                        for (let i = 0; i < item.eventTypeArray.length; i++) {
                            for (let j = 0; j < channelShow.length; j++) {
                                if (item.eventTypeArray[i] == channelShow[j]) {
                                    channels.push(item.channelId);
                                }
                            }
                        }
                    });
                    newVal["IsApiChannelsCapability"][
                        "channelEventList"
                    ].forEach((item) => {
                        for (let i = 0; i < item.eventTypeArray.length; i++) {
                            for (let j = 0; j < whdChannelShow.length; j++) {
                                if (
                                    item.eventTypeArray[i] == whdChannelShow[j]
                                ) {
                                    whdChannels.push(item.channelId);
                                }
                            }
                        }
                    });
                    this.channelList = [...new Set(channels)];
                    this.activeChannel = this.channelList[0];
                    this.whdChannelList = [...new Set(whdChannels)];
                    this.whdActiveChannel = this.whdChannelList[0];
                    this.deviceCapability = newVal;
                }
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
        // detail: {
        //   handler (newVal,oldVal) {
        //     if(newVal['IsApiBsdInfo']){
        //       console.log(newVal['IsApiBsdInfo']['BSD'][0]['TargetTypeList']);
        //       newVal['IsApiBsdTriggerList']['EventRuleTriggerList'][0]['EventTriggerList'][0]['Audio'].volume = newVal['IsApiBsdInfo']['BSD'][0].volume;
        //       this.form = newVal
        //     }
        //     // console.log(JSON.stringify(newVal['IsApiBsdInfo']).BSD[0].TargetTypeList);

        //   },
        //   deep: true,
        //   immediate:true,
        // },
        detail: {
            handler(newVal, oldVal) {
                this.form = newVal;
            },
            deep: true,
            immediate: true,
        },
        componentName: {
            handler(newVal, oldVal) {
                if (newVal == "PublicBsd") this.commandIds = "IsApiBsdInfo";
                // console.log(newVal)
            },
            deep: true,
            immediate: true,
        },

        form: {
            handler(val) {
                if (JSON.stringify(val) !== "{}") {
                    this.$emit("change", val);
                }
            },
            deep: true,
            immediate: true,
        },

        formDetail: {
            handler(newVal, oldVal) {
                console.log(newVal);
                this.formData = newVal;
            },
            deep: true,
            immediate: true,
        },
        allCopyData: {
            handler(newVal, oldVal) {
                console.log(newVal);
                this.copyForm = newVal;
            },
            deep: true,
            immediate: true,
        },
        postChannel: {
            handler(newVal, oldVal) {
                console.log(newVal);
                this.channelForm = newVal;
                if (this.isTemplate == "true") {
                    if (JSON.stringify(newVal) != "{}") {
                        let channels = [];
                        let form = {};
                        for (let key in newVal) {
                            for (let key_ in newVal[key]) {
                                if (key_ == "IsApiBsdInfo") {
                                    channels.push(key.substring(8, 9));
                                }
                            }
                        }
                        this.channelList = [...new Set(channels)];
                        this.activeChannel = this.channelList[0];
                        for (let key in newVal[
                            "channel_" + this.activeChannel
                        ]) {
                            form[key] =
                                newVal["channel_" + this.activeChannel][key];
                        }
                        this.form = Object.assign({}, this.form, form);
                        console.log(this.form);
                    }
                }
            },
            deep: true,
            immediate: true,
        },
        copyForm: {
            handler(val) {
                console.log(val);
                if (JSON.stringify(val) !== "{}") {
                    this.$emit("changeCopy", val);
                }
            },
            deep: true,
            immediate: false,
        },
        channelForm: {
            handler(val) {
                if (JSON.stringify(val) !== "{}") {
                    this.$emit("changeChannels", val);
                }
            },
            deep: true,
            immediate: false,
        },
        copyChannelForm: {
            handler(val) {
                if (JSON.stringify(val) !== "{}") {
                    this.$emit("changeCopyChannel", val);
                }
            },
            deep: true,
            immediate: false,
        },
        postChannelData: {
            handler(newVal, oldVal) {
                console.log(newVal);
                this.copyChannelForm = newVal;
            },
            deep: true,
            immediate: true,
        },
        configParams: {
            handler(val) {
                if (!val) {
                    this.getByIsApi(this.activeChannel);
                }
            },
            deep: true,
            immediate: true,
        },
        //BSD音量变化监听
        "form.IsApiBsdTriggerList": {
            handler(val) {
                if (val != undefined) {
                    this.$refs["PublicBsd"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiBsdTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channel
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiBsdTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiBsdTriggerList_${
                                          val["channelId"]
                                      }.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${
                                          val.channelId
                                      }&主动安全设置/BSD/通道${val.channelId}/${
                                          this.tabNameJson[this.activeName]
                                      }/${
                                          this.tabNameJson[this.activeName]
                                      }报警音量&${
                                          val["EventRuleTriggerList"][0][
                                              "EventTriggerList"
                                          ][0]["Audio"]["volume"]
                                      }`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiBsdTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channel
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //监听右侧盲区参数变化
        "form.IsApiBsdInfo": {
            handler(val) {
                if (val != undefined) {
                    let targetTypeArrays = [];
                    console.log(this.copyChannelForm);
                    this.$refs["PublicBsd"].validate((valid) => {
                        if (valid) {
                            this.channelForm["channel_" + val.channelId][
                                "IsApiBsdInfo"
                            ]["BSD"][0]["targetTypeArray"].forEach((item) => {
                                targetTypeArrays.push(
                                    this.targetTypeArrayJson[item]
                                );
                            });
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["BSD"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiBsdInfo"]["BSD"][0]["enabled"]
                                    ? `IsApiBsdInfo_${
                                          val["channelId"]
                                      }.BSD.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/BSD/通道${
                                          val.channelId
                                      }/${this.tabNameJson[this.activeName]}/${
                                          this.tabNameJson[this.activeName]
                                      }报警使能&${
                                          val["BSD"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["BSD"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiBsdInfo"]["BSD"][0]["limitSpeed"]
                                    ? `IsApiBsdInfo_${
                                          val["channelId"]
                                      }.BSD.0.limitSpeed.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/BSD/通道${
                                          val.channelId
                                      }/${
                                          this.tabNameJson[this.activeName]
                                      }/报警判断速度阈值&${
                                          val["BSD"][0]["limitSpeed"]
                                      }`
                                    : "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.enableStatic." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["BSD"][0]["enableStatic"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiBsdInfo"]["BSD"][0]["enableStatic"]
                                    ? `IsApiBsdInfo_${
                                          val["channelId"]
                                      }.BSD.0.enableStatic.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/BSD/通道${
                                          val.channelId
                                      }/${
                                          this.tabNameJson[this.activeName]
                                      }/静止报警使能&${
                                          val["BSD"][0]["enableStatic"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.installType." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["BSD"][0]["installType"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiBsdInfo"]["BSD"][0]["installType"]
                                    ? `IsApiBsdInfo_${
                                          val["channelId"]
                                      }.BSD.0.installType.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/BSD/通道${
                                          val.channelId
                                      }/${
                                          this.tabNameJson[this.activeName]
                                      }/相机位置&${
                                          this.copyChannelForm[
                                              "channel_" + val.channelId
                                          ]["IsApiBsdInfoCapability"]
                                              .installTypeLists[
                                              val["BSD"][0]["installType"]
                                          ]
                                      }`
                                    : "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.installHeight." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["BSD"][0]["installHeight"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiBsdInfo"]["BSD"][0]["installHeight"]
                                    ? `IsApiBsdInfo_${
                                          val["channelId"]
                                      }.BSD.0.installHeight.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/BSD/通道${
                                          val.channelId
                                      }/${
                                          this.tabNameJson[this.activeName]
                                      }/相机安装高度&${
                                          val["BSD"][0]["installHeight"]
                                      }`
                                    : "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["BSD"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiBsdInfo"]["BSD"][0]["sensitivity"]
                                    ? `IsApiBsdInfo_${
                                          val["channelId"]
                                      }.BSD.0.sensitivity.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/BSD/通道${
                                          val.channelId
                                      }/${
                                          this.tabNameJson[this.activeName]
                                      }/算法灵敏度&${
                                          val["BSD"][0]["sensitivity"]
                                      }`
                                    : "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["BSD"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiBsdInfo"]["BSD"][0]["uploadPicEnabled"]
                                    ? `IsApiBsdInfo_${
                                          val["channelId"]
                                      }.BSD.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/BSD/通道${
                                          val.channelId
                                      }/${
                                          this.tabNameJson[this.activeName]
                                      }/报警图片上传使能&${
                                          val["BSD"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.turnAngle." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["BSD"][0]["turnAngle"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiBsdInfo"]["BSD"][0]["turnAngle"]
                                    ? `IsApiBsdInfo_${
                                          val["channelId"]
                                      }.BSD.0.turnAngle.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/BSD/通道${
                                          val.channelId
                                      }/${
                                          this.tabNameJson[this.activeName]
                                      }/转向角&${val["BSD"][0]["turnAngle"]}`
                                    : "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["BSD"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiBsdInfo"]["BSD"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiBsdInfo_${
                                          val["channelId"]
                                      }.BSD.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/BSD/通道${
                                          val.channelId
                                      }/${
                                          this.tabNameJson[this.activeName]
                                      }/报警视频上传使能&${
                                          val["BSD"][0]["uploadVideoEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.enableTurnAngle." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["BSD"][0]["enableTurnAngle"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiBsdInfo"]["BSD"][0]["enableTurnAngle"]
                                    ? `IsApiBsdInfo_${
                                          val["channelId"]
                                      }.BSD.0.enableTurnAngle.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/BSD/通道${
                                          val.channelId
                                      }/${
                                          this.tabNameJson[this.activeName]
                                      }/转向角关联使能&${
                                          val["BSD"][0]["enableTurnAngle"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.enableTurnlight." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["BSD"][0]["enableTurnlight"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiBsdInfo"]["BSD"][0]["enableTurnlight"]
                                    ? `IsApiBsdInfo_${
                                          val["channelId"]
                                      }.BSD.0.enableTurnlight.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/BSD/通道${
                                          val.channelId
                                      }/${
                                          this.tabNameJson[this.activeName]
                                      }/转向灯关联使能&${
                                          val["BSD"][0]["enableTurnlight"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.targetTypeArray." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["BSD"][0]["targetTypeArray"].toString() !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiBsdInfo"]["BSD"][0][
                                    "targetTypeArray"
                                ].toString()
                                    ? `IsApiBsdInfo_${
                                          val["channelId"]
                                      }.BSD.0.targetTypeArray.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/BSD/通道${
                                          val.channelId
                                      }/${
                                          this.tabNameJson[this.activeName]
                                      }/监测类型&${targetTypeArrays
                                          .splice(",")
                                          .join("、")}`
                                    : "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.DetectionRegionList." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["BSD"][0][
                                    "DetectionRegionList"
                                ].toString() !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiBsdInfo"]["BSD"][0][
                                    "DetectionRegionList"
                                ].toString()
                                    ? `IsApiBsdInfo_${
                                          val["channelId"]
                                      }.BSD.0.DetectionRegionList.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/BSD/通道${
                                          val.channelId
                                      }/${
                                          this.tabNameJson[this.activeName]
                                      }/标定区域检测&新区域`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.enableStatic." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.installType." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.installHeight." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.turnAngle." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.enableTurnAngle." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.enableTurnlight." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.targetTypeArray." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiBsdInfo_" +
                                    val.channelId +
                                    "BSD.0.DetectionRegionList." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
    },
    data() {
        return {
            isPlugin: false,
            dialogClick: false,
            channelList: [],
            activeChannel: "",
            whdChannelList: [],
            whdActiveChannel: "",
            openSurveyBol: false,
            noneVideoPlay: false, // 是否显示控件
            webVersionControl: null,
            notLastVerson: false,
            form: {},
            channelForm: {},
            copyChannelForm: {},
            copyForm: {},
            formData: {},
            useKey: "BSD[0].TargetTypeList",
            commandIds: "IsApiBsdInfo",
            checkNumber: function (rule, value, callback) {
                if (value !== "" && value !== null && value !== undefined) {
                    if (!validateNum(value)) {
                        callback(new Error("请输入正确的整数"));
                    } else if (value < this.min) {
                        callback(new Error(`最小值为${this.min}`));
                    } else if (value > this.max) {
                        callback(new Error(`最大值为${this.max}`));
                    } else if (
                        (this.type == "short" && value > 32767) ||
                        (this.type == "byte" && value > 127) ||
                        (this.type == "int" && value > Math.pow(2, 31) - 1)
                    ) {
                        callback(new Error("输入的数值超出有效范围"));
                    } else {
                        callback();
                    }
                } else {
                    // callback(new Error("请输入"));
                    callback();
                }
            },
            checkString: function (rule, value, callback) {
                if (value.length != 0) {
                    callback();
                } else {
                    callback(new Error("检测类型不能为空"));
                }
            },
            checkNumberOne: function (rule, value, callback) {
                if (value !== "" && value !== null && value !== undefined) {
                    if (!validateNumberOne(value)) {
                        callback(
                            new Error("请输入正确的整数或保留小数点后一位")
                        );
                    } else if (value < this.min) {
                        callback(new Error(`最小值为${this.min}`));
                    } else if (value > this.max) {
                        callback(new Error(`最大值为${this.max}`));
                    } else if (
                        (this.type == "short" && value > 32767) ||
                        (this.type == "byte" && value > 127) ||
                        (this.type == "int" && value > Math.pow(2, 31) - 1)
                    ) {
                        callback(new Error("输入的数值超出有效范围"));
                    } else {
                        callback();
                    }
                } else {
                    // callback(new Error("请输入"));
                    callback();
                }
            },
            activeName: "rightInfo",
            bsdIndex: 0,
            targetTypeArray: [],
            targetTypeArrayList: [],
            targetTypeArrayJson: {},
            // isApiBsdItemInfoVo:['leftInfo','rightInfo','frontInfo','rearInfo'],
            capabilityList: [],
            playUrl: "",
            maxSpeed: null,
            tabNameJson: {
                leftInfo: "左侧盲区",
                rightInfo: "右侧盲区",
                frontInfo: "前侧盲区",
                rearInfo: "后侧盲区",
            },
            tablist: [
                {
                    name: "左侧盲区",
                    shortName: "左侧盲区",
                    commandId: "leftInfo",
                    capability: "",
                    indexItem: 0,
                    // alarmLevel: 1,
                    // enabled:'0',
                },
                {
                    name: "右侧盲区",
                    shortName: "右侧盲区",
                    commandId: "rightInfo",
                    indexItem: 0,
                    // alarmLevel: 1
                },
                {
                    name: "前侧盲区",
                    shortName: "前侧盲区",
                    commandId: "frontInfo",
                    indexItem: 0,
                    // alarmLevel: 1
                },
                {
                    name: "后侧盲区",
                    shortName: "后侧盲区",
                    commandId: "rearInfo",
                    indexItem: 0,
                    // alarmLevel: 1
                },
            ],
        };
    },
    methods: {
        handleClose(done) {
            if (!this.isPlugin) this.$refs.BSDNoPlugin.cancel(true);
            else {
                done();
            }
        },
        // getWhdByIsApi(channel){
        //   let params = {
        //       deviceId: this.$route.query.deviceId || null,
        //       channelId:channel,
        //       commandIds: ['IsApiWhdNoHandInfo','IsApiWhdSingleHandInfo','IsApiWhdPlayMobilePhoneInfo']
        //   };
        //   this.$api.getDeviceConfigParamsByIsApi(params).then(res =>{
        //     if(res.success == true){
        //       let resData = JSON.parse(res.data)
        //       this.maxSpeed = Math.min(...[resData['IsApiWhdNoHandInfo']['whdList'][0].limitSpeed,resData['IsApiWhdSingleHandInfo']['whdList'][0].limitSpeed,resData['IsApiWhdPlayMobilePhoneInfo']['whdList'][0].limitSpeed]);
        //       this.$nextTick(() =>{
        //         if(!document.querySelector('#title')){
        //           this.$message.info('获取设备配置异常，请点击“刷新最新配置”')
        //         }
        //       })
        //     }else{
        //       this.$message.error('获取设备配置参数失败:' + res.msg)
        //     }
        //   })
        // },
        getByIsApi(channel) {
            // console.log(this.form);
            if (Boolean(this.isTemplate) == true) {
                this.capabilityList = [
                    {
                        name: "右侧盲区",
                        shortName: "右侧盲区",
                        commandId: "rightInfo",
                        indexItem: 0,
                        // alarmLevel: 1
                    },
                ];
                this.tablist.forEach((tab) => {
                    if (tab.name == this.activeName) {
                        // console.log(tab.name);
                        // console.log(tab.commandId);
                        // params.commandIds.push(tab.commandId,tab.IsApiTriggerInfo)
                        this.currentCommandId = tab.commandId;
                        this.currentIsApiTriggerInfo = tab.IsApiTriggerInfo;
                        this.showDeploy = true;
                        this.bsdIndex = tab.indexItem;
                        this.makeDictionary(
                            this.form["IsApiBsdInfoCapability"]
                        );
                    }
                });
                return;
            }
            this.capabilityList = [];
            let params = {
                deviceId: this.$route.query.deviceId || null,
                channelId: channel,
                commandIds: [],
            };
            this.$emit("adasCommandId", "IsApiBsdInfo");
            this.$emit("currentIsApiTriggerInfos", "IsApiBsdTriggerList");
            if (this.channelForm["channel_" + channel] == undefined) {
                params.commandIds.push("IsApiBsdInfo");
                params.commandIds.push("IsApiBsdTriggerList");
            } else if (
                this.channelForm["channel_" + channel]["IsApiBsdInfo"]["BSD"][
                    this.bsdIndex
                ]
            ) {
                this.form["IsApiBsdInfo"] =
                    this.channelForm["channel_" + channel]["IsApiBsdInfo"];
                this.form["IsApiBsdTriggerList"] =
                    this.channelForm["channel_" + channel][
                        "IsApiBsdTriggerList"
                    ];
                this.form["IsApiBsdInfoCapability"] =
                    this.channelForm["channel_" + channel][
                        "IsApiBsdInfoCapability"
                    ];
                this.makeDictionary(this.form["IsApiBsdInfoCapability"]);
                this.bsdIndex = 0;
                this.tablist.forEach((item) => {
                    if (this.form["IsApiBsdInfo"][item.commandId]) {
                        item["indexItem"] = this.form["IsApiBsdInfo"][
                            item.commandId
                        ]["$ref"].substring(
                            this.form["IsApiBsdInfo"][item.commandId][
                                "$ref"
                            ].indexOf("[") + 1,
                            this.form["IsApiBsdInfo"][item.commandId]["$ref"]
                                .length - 1
                        );
                        this.capabilityList.push(item);
                    }
                });
                this.activeName = this.capabilityList[0].commandId;
            } else {
                params.commandIds.push("IsApiBsdInfo");
                params.commandIds.push("IsApiBsdTriggerList");
            }
            if (!params.commandIds.length) return;
            this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
                if (JSON.parse(res.data).IsApiBsdInfo) {
                    this.tablist.forEach((item) => {
                        if (JSON.parse(res.data).IsApiBsdInfo[item.commandId]) {
                            item["indexItem"] = JSON.parse(
                                res.data
                            ).IsApiBsdInfo[item.commandId]["$ref"].substring(
                                JSON.parse(res.data).IsApiBsdInfo[
                                    item.commandId
                                ]["$ref"].indexOf("[") + 1,
                                JSON.parse(res.data).IsApiBsdInfo[
                                    item.commandId
                                ]["$ref"].length - 1
                            );
                            this.capabilityList.push(item);
                        }
                    });
                    this.activeName = this.capabilityList[0].commandId;
                }
                console.log(this.capabilityList);
                this.makeDictionary(
                    JSON.parse(res.data).IsApiBsdInfoCapability
                );
                let resData = JSON.parse(res.data);
                this.targetTypeArray = [];
                if (resData["IsApiBsdInfo"]["BSD"][0].targetTypeArray) {
                    resData["IsApiBsdInfo"]["BSD"][0].targetTypeArray.forEach(
                        (item) => {
                            this.targetTypeArray.push(item.targetType);
                        }
                    );
                }
                resData["IsApiBsdInfoCapability"]["installTypeLists"] = {};
                if (resData["IsApiBsdInfoCapability"].installTypeList) {
                    resData["IsApiBsdInfoCapability"].installTypeList.forEach(
                        (item) => {
                            switch (item.itemKey) {
                                case "horizonFront":
                                    item.itemValue = "平视前置";
                                    resData["IsApiBsdInfoCapability"][
                                        "installTypeLists"
                                    ]["horizonFront"] = "平视前置";
                                    break;
                                case "horizonBack":
                                    item.itemValue = "平视后置 ";
                                    resData["IsApiBsdInfoCapability"][
                                        "installTypeLists"
                                    ]["horizonBack"] = "平视后置";
                                    break;
                                case "overlookFront":
                                    item.itemValue = "俯视前置";
                                    resData["IsApiBsdInfoCapability"][
                                        "installTypeLists"
                                    ]["overlookFront"] = "俯视前置";
                                    break;
                                case "overlookBack":
                                    item.itemValue = "俯视后置";
                                    resData["IsApiBsdInfoCapability"][
                                        "installTypeLists"
                                    ]["overlookBack"] = "俯视后置";
                                    break;
                                default:
                                    item.itemValue = "中间架设";
                                    //resData['IsApiBsdInfoCapability']['installTypeLists']['horizonFront'] = '平视前置';
                                    break;
                            }
                        }
                    );
                }
                this.form = Object.assign({}, this.form, resData);
                this.copyForm = Object.assign(
                    {},
                    this.copyForm,
                    JSON.parse(JSON.stringify(resData))
                );
                this.channelForm["channel_" + this.activeChannel] =
                    Object.assign(
                        {},
                        this.channelForm["channel_" + this.activeChannel],
                        this.form
                    );
                this.copyChannelForm["channel_" + this.activeChannel] =
                    Object.assign(
                        {},
                        this.copyChannelForm["channel_" + this.activeChannel],
                        JSON.parse(JSON.stringify(resData))
                    );
            });
        },
        changeChannel(channel) {
            this.activeChannel = channel;
            this.getByIsApi(channel, false);
        },
        makeDictionary(targetList) {
            this.targetTypeArrayList = [];
            this.targetTypeArrayJson = {};
            if (targetList) {
                for (
                    let i = 0;
                    i < targetList.targetTypeListCapList.length;
                    i++
                ) {
                    switch (targetList.targetTypeListCapList[i].itemKey) {
                        case "pedestrian":
                            this.targetTypeArrayList.push({
                                label: "行人",
                                value: "pedestrian",
                            });
                            this.targetTypeArrayJson["pedestrian"] = "行人";
                            break;
                        case "bicycle":
                            this.targetTypeArrayList.push({
                                label: "自行车",
                                value: "bicycle",
                            });
                            this.targetTypeArrayJson["bicycle"] = "自行车";
                            break;
                        case "motorcycle":
                            this.targetTypeArrayList.push({
                                label: "摩托车",
                                value: "motorcycle",
                            });
                            this.targetTypeArrayJson["motorcycle"] = "摩托车";
                            break;
                        default:
                            this.targetTypeArrayList.push({
                                label: "机动车",
                                value: "vehicle",
                            });
                    }
                    this.targetTypeArrayJson["vehicle"] = "机动车";
                }
            } else {
                this.targetTypeArrayList = [
                    {
                        label: "行人",
                        value: "pedestrian",
                    },
                    {
                        label: "自行车",
                        value: "bicycle",
                    },
                    {
                        label: "摩托车",
                        value: "motorcycle",
                    },
                    {
                        label: "机动车",
                        value: "vehicle",
                    },
                ];
                this.targetTypeArrayJson["pedestrian"] = "行人";
                this.targetTypeArrayJson["bicycle"] = "自行车";
                this.targetTypeArrayJson["motorcycle"] = "摩托车";
                this.targetTypeArrayJson["vehicle"] = "机动车";
            }
        },
        showTargetType() {
            this.form["IsApiBsdInfo"]["BSD"][0]["TargetTypeList"] = [];
            //form['IsApiBsdInfo'].BSD[item['indexItem']].targetTypeArray
            if (this.form["IsApiBsdInfo"]["BSD"][0]["targetTypeArray"].length) {
                this.form["IsApiBsdInfo"]["BSD"][0]["targetTypeArray"].forEach(
                    (item) => {
                        this.form["IsApiBsdInfo"]["BSD"][0][
                            "TargetTypeList"
                        ].push({
                            targetType: item,
                        });
                    }
                );
            }
            // if(this.targetTypeArray.length>1){
            //   //this.form['IsApiBsdInfo']['BSD'][0].targetTypeArray = [];

            //   this.targetTypeArray.forEach(item =>{
            //     this.form['IsApiBsdInfo']['BSD'][0].targetTypeArray.push({targetType:item})
            //   })
            // }
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
                                            funcName: "SetBSDAreaParams",
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
                // getBSDArea(){
                //   this.videoPlayControl.obj.JS_RequestInterface({
                //     funcName:'BSDAreaParamsChanged',
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
        cancelSurveyBol() {
            this.openSurveyBol = false;
        },
        saveSurveyBol(bsdInfo) {
            let dataArr = [
                {
                    regionId: 1,
                    Region: [],
                },
                {
                    regionId: 2,
                    Region: [],
                },
                {
                    regionId: 3,
                    Region: [],
                },
            ];
            bsdInfo.forEach((item) => {
                switch (item.tips) {
                    case "一级区域":
                        for (let i = 0; i < item.points.length; i++) {
                            dataArr[0].Region.push({
                                positionX: item.points[i][0],
                                positionY: item.points[i][1],
                            });
                        }
                        break;
                    case "二级区域":
                        for (let i = 0; i < item.points.length; i++) {
                            dataArr[1].Region.push({
                                positionX: item.points[i][0],
                                positionY: item.points[i][1],
                            });
                        }
                        break;
                    default: {
                        for (let i = 0; i < item.points.length; i++) {
                            dataArr[2].Region.push({
                                positionX: item.points[i][0],
                                positionY: item.points[i][1],
                            });
                        }
                        break;
                    }
                }
            });
            console.log("dataArr=======================>", dataArr);

            this.form["IsApiBsdInfo"]["BSD"][0].DetectionRegionList = dataArr;
            this.formData[
                "IsApiBsdInfo_" +
                    this.activeChannel +
                    ".BSD.0.DetectionRegionList." +
                    this.activeChannel +
                    ".channel.useless"
            ] = `IsApiBsdInfo_${this.activeChannel}.BSD.0.DetectionRegionList.${
                this.activeChannel
            }.channel.useless&主动安全设置/BSD/通道${this.activeChannel}/${
                this.tabNameJson[this.activeName]
            }/标定区域检测&新区域`;
            this.$message.success("设置成功，点击下发至终端生效");
            this.openSurveyBol = false;
        },
        cbIntegrationCallBack(oData) {
            console.log(oData);
            let dataArr = [
                {
                    regionId: 1,
                    Region: [],
                },
                {
                    regionId: 2,
                    Region: [],
                },
                {
                    regionId: 3,
                    Region: [],
                },
            ];
            if (oData.responseMsg) {
                if (oData.responseMsg.event == "BSDAreaParamsChanged") {
                    oData.responseMsg.msg.areas.forEach((item) => {
                        switch (item.typeName) {
                            case "一级区域":
                                for (let i = 0; i < item.polygon.length; i++) {
                                    dataArr[0].Region.push({
                                        positionX: item.polygon[i].x / 1000,
                                        positionY: item.polygon[i].y / 1000,
                                    });
                                }
                                break;
                            case "二级区域":
                                for (let i = 0; i < item.polygon.length; i++) {
                                    dataArr[1].Region.push({
                                        positionX: item.polygon[i].x / 1000,
                                        positionY: item.polygon[i].y / 1000,
                                    });
                                }
                                break;
                            default: {
                                for (let i = 0; i < item.polygon.length; i++) {
                                    dataArr[2].Region.push({
                                        positionX: item.polygon[i].x / 1000,
                                        positionY: item.polygon[i].y / 1000,
                                    });
                                }
                                break;
                            }
                        }
                    });
                    this.form["IsApiBsdInfo"]["BSD"][0].DetectionRegionList =
                        dataArr;
                    this.formData[
                        "IsApiBsdInfo_" +
                            this.activeChannel +
                            ".BSD.0.DetectionRegionList." +
                            this.activeChannel +
                            ".channel.useless"
                    ] = `IsApiBsdInfo_${
                        this.activeChannel
                    }.BSD.0.DetectionRegionList.${
                        this.activeChannel
                    }.channel.useless&主动安全设置/BSD/通道${
                        this.activeChannel
                    }/${this.tabNameJson[this.activeName]}/标定区域检测&新区域`;
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
                this.form["IsApiBsdInfo"]["BSD"][0]["DetectionRegionList"];
            areaArr.forEach((item) => {
                switch (item.regionId) {
                    case 1:
                        for (let i = 0; i < item.Region.length; i++) {
                            areaContent[0].polygon.push({
                                x: parseInt(item.Region[i].positionX * 1000),
                                y: parseInt(item.Region[i].positionY * 1000),
                            });
                        }
                        break;
                    case 2:
                        for (let i = 0; i < item.Region.length; i++) {
                            areaContent[1].polygon.push({
                                x: parseInt(item.Region[i].positionX * 1000),
                                y: parseInt(item.Region[i].positionY * 1000),
                            });
                        }
                        break;
                    default:
                        for (let i = 0; i < item.Region.length; i++) {
                            areaContent[2].polygon.push({
                                x: parseInt(item.Region[i].positionX * 1000),
                                y: parseInt(item.Region[i].positionY * 1000),
                            });
                        }
                        break;
                }
            });
            let params = {
                deviceId: this.$route.query.deviceId || null,
                channelNo: this.activeChannel,
                protocolType: this.isPlugin ? 0 : 3, //取流协议类型：0-RTSP，1-RTMP，2-HLS，3-WEBSOCKET，4-HTTP_FLV
            };
            this.$api.previewPlay(params).then((res) => {
                if (res.success) {
                    this.playUrl = res.data;
                } else {
                    this.$message.error("预览失败" + res.msg);
                }
                this.$nextTick(() => {
                    if (!this.isPlugin) {
                        this.$refs.BSDNoPlugin.openHatPlugin(
                            this.playUrl,
                            areaContent,
                            !this.isTemplate
                        );
                    } else {
                        // 插件忽略 202306
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
                    }
                });
            });
        }, 1000),
        SurveyBol() {
            // 插件忽略 202306
            if (this.isPlugin && this.videoPlayControl)
                this.videoPlayControl.JS_DestroyWnd().then(
                    () => {},
                    () => {}
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
                                                            // that.$message.info(
                                                            //     "当前Web控件版本已经是最新的！"
                                                            // );
                                                            that.notLastVerson = false;
                                                        } else {
                                                            that.notLastVerson = true;
                                                            document.body.scrollTop =
                                                                document.documentElement.scrollTop = 0;
                                                            // that.$Modal.confirm({
                                                            //   content: '<h3 class="m-b-sm">当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面</h3>',
                                                            //   styles: 'MessageTop',
                                                            //   onOk: () => {
                                                            //       that.downloadOcx();
                                                            //   },
                                                            //   onCancel: () => {}
                                                            // });
                                                            that.$confirm(
                                                                "当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面",
                                                                {
                                                                    confirmButtonText:
                                                                        this.$t("common.ok"),
                                                                    cancelButtonText:
                                                                        this.$t("common.cancel"),
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
    },
    created() {
        // this.getByIsApi()
    },
    mounted() {
        let script = document.createElement("script");
        script.src = "/static/js/jsWebControl-1.0.0.min.js";
        document.head.appendChild(script);
        // 插件忽略 202306
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
.surveyPlace {
    font-size: 18px;
    margin-bottom: 8px;
}
.divHeight {
    height: 500px;
    width: 800;
}
</style>
