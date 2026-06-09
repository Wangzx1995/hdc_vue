<template>
    <div class="p-a-md">
        <div id="id" style="width: 0; height: 0"></div>
        <el-dialog
            title="全局标定检测区域"
            :visible.sync="dialogVisible"
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
            <!-- 加入控件 -->
            <a
                type="text"
                class="m-r"
                style="float: right; line-height: 32px"
                @click="reDownLoad"
                v-if="notLastVerson && !isTemplate"
                >发现新控件版本</a
            >
            <div class="divHeight" v-if="dialogVisible && !isPlugin">
                <WHDNoPlugin
                    ref="WHDNoPlugin"
                    :playUrl="playUrl"
                    @cancelSurveyBol="cancelSurveyBol"
                    @saveSurveyBol="saveSurveyBol"
                    :isTemplate="isTemplate"
                ></WHDNoPlugin>
            </div>
            <!-- <div class="h-full inline" style="height:100%;width:100%;" id="videoPlay"></div> -->
            <!--控件版本-->
            <div class="divHeight" v-if="dialogVisible && isPlugin">
                <div id="AEStreamWebVersion" style="width: 0; height: 0"></div>

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
        <div class="no_capability" v-if="noCapability">
            该设备暂不支持WHD/玩手机
        </div>
        <el-form
            ref="WhdPublic"
            label-position="top"
            :model="form"
            label-width="120px"
            v-if="!noCapability"
        >
            <div id="title" class="channels">
                <el-button
                    :type="item == activeChannel ? 'info' : ''"
                    v-for="item in channelList"
                    @click="changeChannel(item)"
                    :key="item"
                    >通道{{ item }}</el-button
                >
            </div>
            <el-tabs
                v-model="activeName"
                :before-leave="beforeLeave"
                @tab-click="getByIsApi(activeName, activeChannel, true)"
            >
                <el-tab-pane label="WHD全局标定检测区域" name="first">
                    <template v-if="form['IsApiWhdInfo']">
                        <el-row
                            type="flex"
                            justify="space-between"
                            style="margin-top: 10px"
                        >
                            <el-col :span="7">
                                <!-- <el-form-item label="ADAS报警使能" description="开启后可统一开启ADAS报警使能">
                        <el-select v-model="form['F364'].alarmEnable" placeholder="请选择">
                          <el-option label="关闭" :value="0"></el-option>
                          <el-option label="开启" :value="1"></el-option>
                        </el-select>
                    </el-form-item> -->
                                <el-button
                                    style="margin-top: 28px"
                                    :disabled="dialogClick"
                                    @click="openDialog"
                                    >全局标定检测区域</el-button
                                >
                            </el-col>
                            <el-col :span="7">
                                <el-form-item
                                    v-if="form['IsApiWhdInfo']"
                                    label="WHD报警使能"
                                    description="此项配置控制算法，不是统一配置子报警使能"
                                >
                                    <el-switch
                                        v-model="form['IsApiWhdInfo'].enable"
                                    ></el-switch>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7"></el-col>
                            <!-- <el-col :span="7" >
                    <el-form-item label="ADAS报警音量开关" prop="F364.speedThreshold" description="开启后可统一设置ADAS报警音量">
                      <el-select v-model="form['F364'].alarmEnable" placeholder="请选择">
                          <el-option label="关闭" :value="0"></el-option>
                          <el-option label="开启" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                        <el-form-item label="ADAS报警音量" prop="F364.alarmVolume">
                        <el-slider v-model="form['F364'].alarmVolume" :min="0" :max="8" :step="1"></el-slider>
                        </el-form-item>
                </el-col> -->
                        </el-row>
                    </template>
                </el-tab-pane>
                <!-- <el-tab-pane label="ADAS全局配置" name="first"> -->
                <!-- <el-row type="flex" justify="space-between" style="margin-top: 10px"> -->
                <!-- <el-col :span="7" > -->
                <!-- <el-form-item label="ADAS报警使能" description="开启后可统一开启ADAS报警使能">
                        <el-select v-model="form['F364'].alarmEnable" placeholder="请选择">
                          <el-option label="关闭" :value="0"></el-option>
                          <el-option label="开启" :value="1"></el-option>
                        </el-select>
                    </el-form-item> -->
                <!-- <el-button @click="openDialog">ADAS全局音量配置</el-button> -->
                <!-- </el-col> -->
                <!-- <el-col :span="7" >
                    <el-form-item label="ADAS报警音量开关" prop="F364.speedThreshold" description="开启后可统一设置ADAS报警音量">
                      <el-select v-model="form['F364'].alarmEnable" placeholder="请选择">
                          <el-option label="关闭" :value="0"></el-option>
                          <el-option label="开启" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                        <el-form-item label="ADAS报警音量" prop="F364.alarmVolume">
                        <el-slider v-model="form['F364'].alarmVolume" :min="0" :max="8" :step="1"></el-slider>
                        </el-form-item>
                </el-col> -->
                <!-- </el-row>
          </el-tab-pane> -->
                <el-tab-pane
                    :label="item.name"
                    :name="item.name"
                    v-for="item in tablist"
                    :key="item.index"
                >
                    <template v-if="form[item.commandId]">
                        <template v-if="showDeploy">
                            <el-row
                                type="flex"
                                justify="space-between"
                                class="m-t-sm"
                            >
                                <!-- <el-form-item>
                <el-radio-group v-model="item.alarmLevel" type="simple">
                  <el-radio-button :label="1">一级报警</el-radio-button>
                  <el-radio-button :label="2">二级报警</el-radio-button>
                </el-radio-group>                
              </el-form-item> -->
                                <div class="alarmLevelBox">
                                    <el-button
                                        @click="changeAlarmLevel(item, 1)"
                                        :type="
                                            item.alarmLevel == 1
                                                ? 'primary'
                                                : 'default'
                                        "
                                        >一级报警</el-button
                                    >
                                    <el-button
                                        @click="changeAlarmLevel(item, 2)"
                                        :type="
                                            item.alarmLevel == 2
                                                ? 'primary'
                                                : 'default'
                                        "
                                        >二级报警</el-button
                                    >
                                </div>
                            </el-row>
                            <div
                                v-for="(i, iIndex) in form[item.commandId]
                                    .whdList"
                                :key="iIndex"
                            >
                                <template
                                    v-if="i.alarmLevel == item.alarmLevel"
                                >
                                    <el-row type="flex" justify="space-between">
                                        <el-col :span="7">
                                            <el-form-item
                                                :label="
                                                    item.shortName + '报警使能'
                                                "
                                            >
                                                <el-switch
                                                    :disabled="
                                                        form['IsApiWhdInfo']
                                                            .enable != 1
                                                    "
                                                    v-model="i.enabled"
                                                ></el-switch>
                                                <!-- <el-select v-model="i.alarmEnabled">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="开启" :value="1"></el-option>
                            </el-select> -->
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-form-item
                                                label="报警视频上传使能"
                                            >
                                                <el-switch
                                                    v-model="
                                                        i.uploadVideoEnabled
                                                    "
                                                ></el-switch>
                                                <!-- <el-select v-model="i.clipUpload">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="上传" :value="1"></el-option>
                            </el-select> -->
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-form-item
                                                label="报警图片上传使能"
                                            >
                                                <el-switch
                                                    v-model="i.uploadPicEnabled"
                                                ></el-switch>
                                                <!-- <el-select v-model="i.snapShotUpload">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="上传" :value="1"></el-option>
                            </el-select> -->
                                            </el-form-item>
                                        </el-col>

                                        <!-- <el-col :span="7" > -->
                                        <!-- <el-form-item label="报警抑制时间 (100-600)" :rules="{ validator: checkNumber.bind({type:'int',min:100,max:600}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.interval'"> -->
                                        <!-- <el-form-item label="报警抑制时间" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].intervalMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].intervalMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.interval'">
                            <el-input v-model="i.interval"><span slot="suffix">ms</span></el-input>
                        </el-form-item> -->
                                        <!-- </el-col> -->
                                        <!-- <el-col :span="7" > -->
                                        <!-- <el-form-item label="算法置信度（1-100）" :rules="{ validator: checkNumber.bind({type:'int',min:1,max:100}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.confidence'"> -->
                                        <!-- <el-form-item label="报警间隔" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].intervalTimeMin,max:form[item.commandId+'Capability'].intervalTimeMax}), trigger: 'blur' }" :prop="item.commandId + '.whdList.' + iIndex + '.intervalTime'">
                              <el-input v-model="i.intervalTime"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col> -->
                                    </el-row>
                                    <el-row type="flex" justify="space-between">
                                        <!-- <el-col :span="7" > -->
                                        <!-- <el-form-item label="碰撞时间" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.timeToCollision'"> -->
                                        <!-- <el-form-item label="碰撞时间" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].timeToCollisionMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].timeToCollisionMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.timeToCollision'">
                            <el-input v-model="i.timeToCollision"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col> -->
                                        <el-col :span="7">
                                            <!-- <el-form-item label="报警判断速度阈值" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.speedLimit'"> -->
                                            <el-form-item
                                                v-if="iIndex == 0"
                                                label="报警判断速度阈值"
                                                description="一二级报警速度差不小于20"
                                                :rules="{
                                                    validator: checkNumber.bind(
                                                        {
                                                            type: 'int',
                                                            min: form[
                                                                item.commandId +
                                                                    'Capability'
                                                            ].limitSpeedMin,
                                                            max:
                                                                Number(
                                                                    form[
                                                                        item
                                                                            .commandId
                                                                    ].whdList[1]
                                                                        .limitSpeed
                                                                ) - 20,
                                                        }
                                                    ),
                                                    trigger: 'blur',
                                                }"
                                                :prop="
                                                    item.commandId +
                                                    '.whdList.' +
                                                    iIndex +
                                                    '.limitSpeed'
                                                "
                                            >
                                                <el-input
                                                    tips-placement="top-end"
                                                    :tips="`键入值范围为${
                                                        form[
                                                            item.commandId +
                                                                'Capability'
                                                        ].limitSpeedMin
                                                    }~${
                                                        Number(
                                                            form[item.commandId]
                                                                .whdList[1]
                                                                .limitSpeed
                                                        ) - 20
                                                    }`"
                                                    v-model="i.limitSpeed"
                                                    ><span slot="suffix"
                                                        >km/h</span
                                                    ></el-input
                                                >
                                            </el-form-item>
                                            <el-form-item
                                                v-if="iIndex == 1"
                                                description="一二级报警速度差不小于20"
                                                label="报警判断速度阈值"
                                                :rules="{
                                                    validator: checkNumber.bind(
                                                        {
                                                            type: 'int',
                                                            min:
                                                                Number(
                                                                    form[
                                                                        item
                                                                            .commandId
                                                                    ].whdList[0]
                                                                        .limitSpeed
                                                                ) + 20,
                                                            max: form[
                                                                item.commandId +
                                                                    'Capability'
                                                            ].limitSpeedMax,
                                                        }
                                                    ),
                                                    trigger: 'blur',
                                                }"
                                                :prop="
                                                    item.commandId +
                                                    '.whdList.' +
                                                    iIndex +
                                                    '.limitSpeed'
                                                "
                                            >
                                                <el-input
                                                    tips-placement="top-end"
                                                    :tips="`键入值范围为${
                                                        Number(
                                                            form[item.commandId]
                                                                .whdList[0]
                                                                .limitSpeed
                                                        ) + 20
                                                    }~${
                                                        form[
                                                            item.commandId +
                                                                'Capability'
                                                        ].limitSpeedMax
                                                    }`"
                                                    v-model="i.limitSpeed"
                                                    ><span slot="suffix"
                                                        >km/h</span
                                                    ></el-input
                                                >
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7">
                                            <!-- <el-form-item label="算法灵敏度（0-3）" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:3}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.sensitivity'"> -->
                                            <el-form-item
                                                label="灵敏度"
                                                :rules="{
                                                    validator: checkNumber.bind(
                                                        {
                                                            type: 'int',
                                                            min: form[
                                                                item.commandId +
                                                                    'Capability'
                                                            ].sensitivityMin,
                                                            max: form[
                                                                item.commandId +
                                                                    'Capability'
                                                            ].sensitivityMax,
                                                        }
                                                    ),
                                                    trigger: 'blur',
                                                }"
                                                :prop="
                                                    item.commandId +
                                                    '.whdList.' +
                                                    iIndex +
                                                    '.sensitivity'
                                                "
                                            >
                                                <el-input
                                                    tips-placement="top-end"
                                                    :tips="`键入值范围为${
                                                        form[
                                                            item.commandId +
                                                                'Capability'
                                                        ].sensitivityMin
                                                    }~${
                                                        form[
                                                            item.commandId +
                                                                'Capability'
                                                        ].sensitivityMax
                                                    }`"
                                                    v-model="i.sensitivity"
                                                ></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-form-item
                                                v-if="
                                                    form[
                                                        item.IsApiTriggerInfo
                                                    ] &&
                                                    form[item.IsApiTriggerInfo][
                                                        'EventRuleTriggerList'
                                                    ].length
                                                "
                                                :label="
                                                    item.shortName + '报警音量'
                                                "
                                            >
                                                <el-slider
                                                    v-model="
                                                        form[
                                                            item
                                                                .IsApiTriggerInfo
                                                        ][
                                                            'EventRuleTriggerList'
                                                        ][iIndex][
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
                                        <!-- <el-col :span="7" >
                        <el-form-item label="事件上传使能">
                            <el-select v-model="i.eventEnabled">
                              <el-option label="不上传" :value="0"></el-option>
                              <el-option label="上传" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                                        <!-- <el-col :span="7" > -->
                                        <!-- <el-form-item label="抓图张数" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].pictureNumMin,max:form[item.commandId+'Capability'].pictureNumMax}), trigger: 'blur' }" :prop="item.commandId + '.whdList.' + iIndex + '.pictureNum'"> -->

                                        <!-- <el-input v-model="i.pictureNum"></el-input> -->
                                        <!-- <el-select v-model="i.clipUpload">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="上传" :value="1"></el-option>
                            </el-select> -->
                                        <!-- </el-form-item> -->
                                        <!-- </el-col> -->
                                    </el-row>
                                    <el-row type="flex" justify="space-between">
                                        <!-- <el-col :span="7" >
                        <el-form-item label="抓图报警类型">
                            <el-select v-model="i.snapShotUpload">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="上传" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                                        <!-- <el-col :span="7" > -->
                                        <!-- <el-form-item label="抓图张数" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.snapShotNum'"> -->
                                        <!-- <el-form-item label="抓图张数" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].snapShotNumMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].snapShotNumMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.snapShotNum'">
                              <el-input v-model="i.snapShotNum"></el-input>
                        </el-form-item>
                    </el-col> -->
                                        <!-- <el-col :span="7" > -->
                                        <!-- <el-form-item label="抓图间隔" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.snapShotTime'"> -->
                                        <!-- <el-form-item label="抓图间隔" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].snapShotTimeMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].snapShotTimeMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.snapShotTime'">
                              <el-input v-model="i.snapShotTime"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col> -->
                                    </el-row>
                                    <el-row type="flex" justify="space-between">
                                        <el-col :span="7"></el-col>
                                        <!-- <el-col :span="7" > -->
                                        <!-- <el-form-item label="短视频前半部分时长" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.clipPreDuration'"> -->
                                        <!-- <el-form-item label="短视频前半部分时长" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].clipPreDurationMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].clipPreDurationMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.clipPreDuration'">
                              <el-input v-model="i.clipPreDuration"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col> -->
                                        <!-- <el-col :span="7" > -->
                                        <!-- <el-form-item label="短视频后半部分时长" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.clipPostDuration'"> -->
                                        <!-- <el-form-item label="短视频后半部分时长" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].clipPostDurationMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].clipPostDurationMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.clipPostDuration'">
                              <el-input v-model="i.clipPostDuration"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col> -->
                                    </el-row>
                                    <el-row type="flex" justify="space-between">
                                        <!-- <el-col :span="7" > -->
                                        <!-- <el-form-item label="算法置信度（1-100）" :rules="{ validator: checkNumber.bind({type:'int',min:1,max:100}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.confidence'"> -->
                                        <!-- <el-form-item label="算法置信度" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].confidenceMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].confidenceMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.confidence'">
                              <el-input v-model="i.confidence"><span slot="suffix">%</span></el-input>
                        </el-form-item>
                    </el-col> -->
                                        <!-- <el-col :span="7" > -->
                                        <!-- <el-form-item label="算法灵敏度（0-3）" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:3}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.sensitivity'"> -->
                                        <!-- <el-form-item label="算法灵敏度" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].sensitivityMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].sensitivityMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.sensitivity'">
                              <el-input v-model="i.sensitivity"></el-input>
                        </el-form-item>
                    </el-col> -->
                                        <el-col :span="7"> </el-col>
                                    </el-row>
                                </template>
                            </div>
                        </template>
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
import WHDNoPlugin from "@/components/webControlService/configuration/whd.vue";
export default {
    components: { WHDNoPlugin },
    props: {
        detail: {
            type: Object,
            default: () => {
                return {};
            },
        },
        isTemplate: {
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
                    this.$refs.WHDNoPlugin.cancel(false);
                }

                this.openDialog();
            },
            deep: true,
        },
        deviceCapabilities: {
            handler(newVal, oldVal) {
                if (Boolean(this.isTemplate) == true) {
                } else {
                    this.channelList = [];
                    this.bsdChannelList = [];
                    let bsdChannelShow = ["BSD"];
                    let bsdChannels = [];
                    let channelShow = [
                        "NoHand",
                        "SingleHand",
                        "PlayMobilePhone",
                    ];
                    let channels = [];
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
                            for (let j = 0; j < bsdChannelShow.length; j++) {
                                if (
                                    item.eventTypeArray[i] == bsdChannelShow[j]
                                ) {
                                    bsdChannels.push(item.channelId);
                                }
                            }
                        }
                    });
                    this.channelList = [...new Set(channels)];
                    this.bsdChannelList = [...new Set(bsdChannels)];
                    this.activeChannel = this.channelList[0];
                    this.bsdActiveChannel = this.bsdChannelList[0];
                    this.deviceCapability = newVal;
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
        detail: {
            handler(newVal, oldVal) {
                this.form = newVal;
            },
            deep: true,
            immediate: true,
        },
        form: {
            handler(val) {
                if (JSON.stringify(val) !== "{}") {
                    if (
                        this.form[this.currentIsApiTriggerInfo] &&
                        this.form[this.currentCommandId] &&
                        this.currentCommandId != "IsApiWhdInfo"
                    ) {
                        this.showDeploy = true;
                        // this.form[this.currentIsApiTriggerInfo]['EventRuleTriggerList'].forEach(item => {
                        //   for (let i = 0; i < this.form[this.currentCommandId]['whdList'].length; i++) {
                        //     if (item.ruleID == this.form[this.currentCommandId]['whdList'][i].ruleID) {
                        //       item['EventTriggerList'][0]['Audio']['volume'] = this.form[this.currentCommandId]['whdList'][i].volume
                        //     }
                        //   }
                        // })
                    } else {
                        this.showDeploy =
                            this.isTemplate == "true" ? true : false;
                    }
                    this.$emit("change", val);
                }
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
                                if (
                                    key_ == "IsApiWhdNoHandInfo" ||
                                    key_ == "IsApiWhdSingleHandInfo" ||
                                    key_ == "IsApiWhdPlayMobilePhoneInfo" ||
                                    key_ == "IsApiWhdInfo"
                                ) {
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
                        this.showDeploy = true;
                        console.log(this.form);
                    }
                }
            },
            deep: true,
            immediate: true,
        },
        capabilitiesEmit: {
            handler(val) {
                if (JSON.stringify(val) !== "{}") {
                    this.$emit("capabilitiesEmit", val);
                }
            },
        },
        currentCommandId: {
            handler(newVal, oldVal) {
                console.log(newVal);
                this.$emit("adasCommandId", newVal);
            },
        },
        currentIsApiTriggerInfo: {
            handler(newVal, oldVal) {
                //  console.log(newVal)
                this.$emit("currentIsApiTriggerInfos", newVal);
            },
        },
        dialogVisible: {
            handler(newVal) {
                if (!newVal) {
                    this.dialogClick = newVal;
                    this.SurveyBol();
                }
            },
        },
        configParams: {
            handler(val) {
                if (!val) {
                    this.getByIsApi(this.activeName, this.activeChannel, false);
                    console.log(this.bsdActiveChannel);
                    // this.getBsdByIsApi(this.bsdActiveChannel)
                }
            },
            deep: true,
            immediate: true,
        },
        //WHD/玩手机全局区域标定变化监听
        "form.IsApiWhdInfo": {
            handler(val) {
                console.log(this.copyChannelForm);
                if (val != undefined) {
                    this.$refs["WhdPublic"].validate((valid) => {
                        if (valid) {
                            console.log(val["DetectionRegionList"]);
                            console.log(
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdInfo"]["DetectionRegionList"]
                            );
                            //this.formData['IsApiWhdInfo_'+val.channelId+'.DetectionRegionList.'+val.channelId] = val['DetectionRegionList'].toString() != this.copyChannelForm['channel_'+val.channelId]['IsApiWhdInfo']['DetectionRegionList'].toString() ? `IsApiWhdInfo_${val['channelId']}.DetectionRegionList.${val['channelId']}&主动安全设置/WHD/玩手机/WHD全局标定检测区域/全局检测标定区域&重新标定` : '';
                            this.formData[
                                "IsApiWhdInfo_" +
                                    val.channelId +
                                    ".enable." +
                                    val.channelId
                            ] =
                                val["enable"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdInfo"]["enable"]
                                    ? `IsApiWhdInfo_${
                                          val["channelId"]
                                      }.enable.${
                                          val["channelId"]
                                      }&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/ADAS全局设置/ADAS全局报警使能&${
                                          val["enable"] ? "开启" : "关闭"
                                      }`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiWhdInfo_" +
                                    val.channelId +
                                    ".DetectionRegionList." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiWhdInfo_" +
                                    val.channelId +
                                    ".enable." +
                                    val.channelId
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //双手WHD声音变化监听
        "form.IsApiWhdNoHandTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["WhdPublic"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiWhdNoHandTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdNoHandTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiWhdNoHandTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/WHD/玩手机/通道${val.channelId}/双手WHD/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiWhdNoHandTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdNoHandTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiWhdNoHandTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/WHD/玩手机/通道${val.channelId}/双手WHD/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiWhdNoHandTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiWhdNoHandTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //单手WHD声音变化监听
        "form.IsApiWhdSingleHandTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["WhdPublic"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiWhdSingleHandTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdSingleHandTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiWhdSingleHandTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/WHD/玩手机/通道${val.channelId}/单手WHD/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiWhdSingleHandTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdSingleHandTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiWhdSingleHandTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/WHD/玩手机/通道${val.channelId}/单手WHD/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiWhdSingleHandTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiWhdSingleHandTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //玩手机声音变化监听
        "form.IsApiWhdPlayMobilePhoneTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["WhdPublic"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiWhdPlayMobilePhoneTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdPlayMobilePhoneTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiWhdPlayMobilePhoneTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/WHD/玩手机/通道${val.channelId}/玩手机/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdPlayMobilePhoneTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiWhdPlayMobilePhoneTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/WHD/玩手机/通道${val.channelId}/玩手机/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiWhdPlayMobilePhoneTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //双手WHD参数变化监听
        "form.IsApiWhdNoHandInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["WhdPublic"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdNoHandInfo"]["whdList"][0]["enabled"]
                                    ? `IsApiWhdNoHandInfo_${
                                          val["channelId"]
                                      }.whdList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/双手WHD/一级报警/双手WHD报警使能&${
                                          val["whdList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdNoHandInfo"]["whdList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiWhdNoHandInfo_${
                                          val["channelId"]
                                      }.whdList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/双手WHD/一级报警/报警视频上传使能&${
                                          val["whdList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdNoHandInfo"]["whdList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiWhdNoHandInfo_${
                                          val["channelId"]
                                      }.whdList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/双手WHD/一级报警/报警图片上传使能&${
                                          val["whdList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdNoHandInfo"]["whdList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiWhdNoHandInfo_${val["channelId"]}.whdList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/WHD/玩手机/通道${val.channelId}/双手WHD/一级报警/报警判断速度阈值&${val["whdList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdNoHandInfo"]["whdList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiWhdNoHandInfo_${val["channelId"]}.whdList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/WHD/玩手机/通道${val.channelId}/双手WHD/一级报警/灵敏度&${val["whdList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdNoHandInfo"]["whdList"][1]["enabled"]
                                    ? `IsApiWhdNoHandInfo_${
                                          val["channelId"]
                                      }.whdList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/双手WHD/二级报警/双手WHD报警使能&${
                                          val["whdList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdNoHandInfo"]["whdList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiWhdNoHandInfo_${
                                          val["channelId"]
                                      }.whdList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/双手WHD/二级报警/报警视频上传使能&${
                                          val["whdList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdNoHandInfo"]["whdList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiWhdNoHandInfo_${
                                          val["channelId"]
                                      }.whdList.1.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/双手WHD/二级报警/报警图片上传使能&${
                                          val["whdList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdNoHandInfo"]["whdList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiWhdNoHandInfo_${val["channelId"]}.whdList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/WHD/玩手机/通道${val.channelId}/双手WHD/二级报警/报警判断速度阈值&${val["whdList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdNoHandInfo"]["whdList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiWhdNoHandInfo_${val["channelId"]}.whdList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/WHD/玩手机/通道${val.channelId}/双手WHD/二级报警/灵敏度&${val["whdList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdNoHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.sensitivity." +
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
        //单手WHD参数变化监听
        "form.IsApiWhdSingleHandInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["WhdPublic"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdSingleHandInfo"]["whdList"][0][
                                    "enabled"
                                ]
                                    ? `IsApiWhdSingleHandInfo_${
                                          val["channelId"]
                                      }.whdList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/单手WHD/一级报警/单手WHD报警使能&${
                                          val["whdList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdSingleHandInfo"]["whdList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiWhdSingleHandInfo_${
                                          val["channelId"]
                                      }.whdList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/单手WHD/一级报警/报警视频上传使能&${
                                          val["whdList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdSingleHandInfo"]["whdList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiWhdSingleHandInfo_${
                                          val["channelId"]
                                      }.whdList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/单手WHD/一级报警/报警图片上传使能&${
                                          val["whdList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdSingleHandInfo"]["whdList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiWhdSingleHandInfo_${val["channelId"]}.whdList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/WHD/玩手机/通道${val.channelId}/单手WHD/一级报警/报警判断速度阈值&${val["whdList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdSingleHandInfo"]["whdList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiWhdSingleHandInfo_${val["channelId"]}.whdList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/WHD/玩手机/通道${val.channelId}/单手WHD/一级报警/灵敏度&${val["whdList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdSingleHandInfo"]["whdList"][1][
                                    "enabled"
                                ]
                                    ? `IsApiWhdSingleHandInfo_${
                                          val["channelId"]
                                      }.whdList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/单手WHD/二级报警/单手WHD报警使能&${
                                          val["whdList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdSingleHandInfo"]["whdList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiWhdSingleHandInfo_${
                                          val["channelId"]
                                      }.whdList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/单手WHD/二级报警/报警视频上传使能&${
                                          val["whdList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdSingleHandInfo"]["whdList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiWhdSingleHandInfo_${
                                          val["channelId"]
                                      }.whdList.1.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/单手WHD/二级报警/报警图片上传使能&${
                                          val["whdList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdSingleHandInfo"]["whdList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiWhdSingleHandInfo_${val["channelId"]}.whdList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/WHD/玩手机/通道${val.channelId}/单手WHD/二级报警/报警判断速度阈值&${val["whdList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdSingleHandInfo"]["whdList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiWhdSingleHandInfo_${val["channelId"]}.whdList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/WHD/玩手机/通道${val.channelId}/单手WHD/二级报警/灵敏度&${val["whdList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdSingleHandInfo_" +
                                    val.channelId +
                                    ".whdList.1.sensitivity." +
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
        //玩手机参数变化监听
        "form.IsApiWhdPlayMobilePhoneInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["WhdPublic"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdPlayMobilePhoneInfo"]["whdList"][0][
                                    "enabled"
                                ]
                                    ? `IsApiWhdPlayMobilePhoneInfo_${
                                          val["channelId"]
                                      }.whdList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/玩手机/一级报警/玩手机报警使能&${
                                          val["whdList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdPlayMobilePhoneInfo"]["whdList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiWhdPlayMobilePhoneInfo_${
                                          val["channelId"]
                                      }.whdList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/玩手机/一级报警/报警视频上传使能&${
                                          val["whdList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdPlayMobilePhoneInfo"]["whdList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiWhdPlayMobilePhoneInfo_${
                                          val["channelId"]
                                      }.whdList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/玩手机/一级报警/报警图片上传使能&${
                                          val["whdList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdPlayMobilePhoneInfo"]["whdList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiWhdPlayMobilePhoneInfo_${val["channelId"]}.whdList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/WHD/玩手机/通道${val.channelId}/玩手机/一级报警/报警判断速度阈值&${val["whdList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdPlayMobilePhoneInfo"]["whdList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiWhdPlayMobilePhoneInfo_${val["channelId"]}.whdList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/WHD/玩手机/通道${val.channelId}/玩手机/一级报警/灵敏度&${val["whdList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdPlayMobilePhoneInfo"]["whdList"][1][
                                    "enabled"
                                ]
                                    ? `IsApiWhdPlayMobilePhoneInfo_${
                                          val["channelId"]
                                      }.whdList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/玩手机/二级报警/玩手机报警使能&${
                                          val["whdList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdPlayMobilePhoneInfo"]["whdList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiWhdPlayMobilePhoneInfo_${
                                          val["channelId"]
                                      }.whdList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/玩手机/二级报警/报警视频上传使能&${
                                          val["whdList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdPlayMobilePhoneInfo"]["whdList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiWhdPlayMobilePhoneInfo_${
                                          val["channelId"]
                                      }.whdList.1.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/WHD/玩手机/通道${
                                          val.channelId
                                      }/玩手机/二级报警/报警图片上传使能&${
                                          val["whdList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdPlayMobilePhoneInfo"]["whdList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiWhdPlayMobilePhoneInfo_${val["channelId"]}.whdList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/WHD/玩手机/通道${val.channelId}/玩手机/二级报警/报警判断速度阈值&${val["whdList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["whdList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiWhdPlayMobilePhoneInfo"]["whdList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiWhdPlayMobilePhoneInfo_${val["channelId"]}.whdList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/WHD/玩手机/通道${val.channelId}/玩手机/二级报警/灵敏度&${val["whdList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiWhdPlayMobilePhoneInfo_" +
                                    val.channelId +
                                    ".whdList.1.sensitivity." +
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
            playUrl: "",
            alarmLevelCopy: 1,
            channelList: [],
            activeChannel: "",
            bsdActiveChannel: "",
            bsdChannelList: [],
            dialogClick: false,
            channelId: "",
            noneVideoPlay: false, // 是否显示控件
            webVersionControl: null,
            videoPlayControl: null,
            notLastVerson: false,
            showDeploy: false,
            currentCommandId: "",
            currentIsApiTriggerInfo: "",
            dialogVisible: false,
            notLastVerson: false,
            form: {},
            channelForm: {},
            copyChannelForm: {},
            copyForm: {},
            formData: {},
            capabilitiesEmit: {},
            noCapability: false,
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
            activeName: "first",
            tablist: [
                {
                    name: "双手WHD",
                    shortName: "双手WHD",
                    commandId: "IsApiWhdNoHandInfo",
                    IsApiTriggerInfo: "IsApiWhdNoHandTriggerList",
                    capability: "IsApiWhdNoHandInfoCapability",
                    alarmLevel: 1,
                },
                {
                    name: "单手WHD",
                    shortName: "单手WHD",
                    commandId: "IsApiWhdSingleHandInfo",
                    IsApiTriggerInfo: "IsApiWhdSingleHandTriggerList",
                    capability: "IsApiWhdSingleHandInfoCapability",
                    alarmLevel: 1,
                },
                {
                    name: "玩手机",
                    shortName: "玩手机",
                    commandId: "IsApiWhdPlayMobilePhoneInfo",
                    IsApiTriggerInfo: "IsApiWhdPlayMobilePhoneTriggerList",
                    capability: "IsApiWhdNoHandInfoCapability",
                    alarmLevel: 1,
                },
            ],
        };
    },
    methods: {
        handleClose(done) {
            if (!this.isPlugin) this.$refs.WHDNoPlugin.cancel(true);
            else {
                done();
            }
        },
        changeAlarmLevel(label, type) {
            if (label.alarmLevel == type) return;
            this.$refs.WhdPublic.validate((valid) => {
                if (!valid) {
                    this.$message.warning("当前表单验证不通过，请先完善！");
                    label.alarmLevel = type == 1 ? 2 : 1;
                } else {
                    label.alarmLevel = type;
                }
            });
        },
        SurveyBol() {
            // 插件忽略 202306
            if (this.isPlugin && this.videoPlayControl)
                this.videoPlayControl.JS_DestroyWnd().then(
                    () => {},
                    () => {}
                );
            this.dialogVisible = false;
        },
        openDialog: throttle(function (e) {
            this.dialogClick = true;
            this.dialogVisible = true;
            let areaContent = [];
            let areaArr =
                this.form["IsApiWhdInfo"]["DetectionRegionList"][0].Region;
            areaArr.forEach((item) => {
                areaContent.push({
                    x: parseInt(item.positionX * 1000),
                    y: parseInt(item.positionY * 1000),
                });
            });
            let params = {
                deviceId: this.$route.query.deviceId || null,
                channelNo: this.activeChannel,
                protocolType: this.isPlugin ? 0 : 3, //取流协议类型：0-RTSP，1-RTMP，2-HLS，3-WEBSOCKET，4-HTTP_FLV
            };
            this.$api.previewPlay(params).then((res) => {
                if (res.success) {
                    this.playUrl = res.data;
                    //
                } else {
                    //   this.$message.error('预览失败' + res.msg);
                }
                this.$nextTick(() => {
                    if (!this.isPlugin) {
                        this.$refs.WHDNoPlugin.openHatPlugin(
                            this.playUrl,
                            areaContent,
                            !this.isTemplate
                        );
                    } else {
                        // 插件忽略 202306
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
                    }
                });
                // console.log(res)
            });
            this.dialogVisible = true;
        }, 1000),
        beforeLeave(activeName, oldActiveName) {
            this.$refs.WhdPublic.validate((valid) => {
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
        changeChannel(channel) {
            this.activeChannel = channel;
            this.getByIsApi(this.activeName, channel, false);
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
                                                            // that.$message.info(
                                                            //     "当前Web控件版本已经是最新的！"
                                                            // );
                                                            that.notLastVerson = false;
                                                        } else {
                                                            that.notLastVerson = true;
                                                            document.body.scrollTop =
                                                                document.documentElement.scrollTop = 0;
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
        cancelSurveyBol() {
            this.dialogVisible = false;
        },
        saveSurveyBol(whdInfo) {
            let dataArr = [
                {
                    regionId: 1,
                    Region: [],
                },
            ];
            whdInfo.forEach((item) => {
                dataArr[0].Region.push({
                    positionX: item.x / 1000,
                    positionY: item.y / 1000,
                });
                this.form["IsApiWhdInfo"].DetectionRegionList = dataArr;
            });
            this.dialogVisible = false;
            this.formData[
                "IsApiWhdInfo_" +
                    this.activeChannel +
                    ".DetectionRegionList." +
                    this.activeChannel
            ] = `IsApiWhdInfo_${this.activeChannel}.DetectionRegionList.${this.activeChannel}&主动安全设置/WHD/玩手机/WHD全局标定检测区域/全局检测标定区域&新区域`;
            this.$message.success("设置成功，点击下发至终端生效");
            this.$emit("changeData", this.formData);
        },
        cbIntegrationCallBack(oData) {
            console.log(oData);
            let dataArr = [
                {
                    regionId: 1,
                    Region: [],
                },
            ];
            if (oData.responseMsg) {
                if (oData.responseMsg.event == "WHDAreaParamsChanged") {
                    oData.responseMsg.msg.polygon.forEach((item) => {
                        dataArr[0].Region.push({
                            positionX: item.x / 1000,
                            positionY: item.y / 1000,
                        });
                        this.form["IsApiWhdInfo"].DetectionRegionList = dataArr;
                    });
                    this.dialogVisible = false;
                    this.formData[
                        "IsApiWhdInfo_" +
                            this.activeChannel +
                            ".DetectionRegionList." +
                            this.activeChannel
                    ] = `IsApiWhdInfo_${this.activeChannel}.DetectionRegionList.${this.activeChannel}&主动安全设置/WHD/玩手机/WHD全局标定检测区域/全局检测标定区域&新区域`;
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
        // getBsdByIsApi (channel) {
        //   let params = {
        //     deviceId: this.$route.query.deviceId || null,
        //     commandIds: ['IsApiBsdInfo'],
        //     channelId: channel
        //   }
        //   this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
        //     if (res.success == true) {
        //       this.form = Object.assign({}, this.form, JSON.parse(res.data));
        //       this.$nextTick(() =>{
        //         if(!document.querySelector('#title')){
        //           this.$message.info('获取设备配置异常，请点击“刷新最新配置”')
        //         }
        //       })
        //     } else {
        //       this.$message.error('获取设备配置参数失败:' + res.msg)
        //     }
        //   })
        // },
        getByIsApi(tabName, channel, type) {
            if (Boolean(this.isTemplate) == true) {
                this.tablist.forEach((tab) => {
                    if (tab.name == tabName) {
                        // console.log(tab.name);
                        // console.log(tab.commandId);
                        // params.commandIds.push(tab.commandId,tab.IsApiTriggerInfo)
                        this.currentCommandId = tab.commandId;
                        this.currentIsApiTriggerInfo = tab.IsApiTriggerInfo;
                        this.showDeploy = true;
                    }
                });
                return;
            }
            let params = {
                deviceId: this.$route.query.deviceId || null,
                commandIds: [],
                channelId: channel,
            };
            let findFlag = 0;
            if (tabName == "first") {
                if (this.channelForm["channel_" + channel] == undefined) {
                    params.commandIds.push("IsApiWhdInfo");
                } else if (
                    this.channelForm["channel_" + channel]["IsApiWhdInfo"]
                ) {
                    this.form["IsApiWhdInfo"] =
                        this.channelForm["channel_" + channel]["IsApiWhdInfo"];
                } else {
                    params.commandIds.push("IsApiWhdInfo");
                }
                findFlag++;
            } else {
                this.tablist.forEach((tab) => {
                    if (tab.name == tabName) {
                        if (type) {
                            if (
                                this.channelForm["channel_" + channel] ==
                                undefined
                            ) {
                                params.commandIds.push("IsApiWhdInfo");
                            } else if (
                                this.channelForm["channel_" + channel][
                                    "IsApiWhdInfo"
                                ]
                            ) {
                                this.form["IsApiWhdInfo"] =
                                    this.channelForm["channel_" + channel][
                                        "IsApiWhdInfo"
                                    ];
                            } else {
                                params.commandIds.push("IsApiWhdInfo");
                            }
                            if (
                                !this.channelForm["channel_" + channel][
                                    tab.commandId
                                ]
                            ) {
                                params.commandIds.push(tab.commandId);
                            } else {
                                this.form[tab.commandId] =
                                    this.channelForm["channel_" + channel][
                                        tab.commandId
                                    ];
                                this.form[tab.capability] =
                                    this.channelForm["channel_" + channel][
                                        tab.capability
                                    ];
                            }
                            if (
                                !this.channelForm["channel_" + channel][
                                    tab.IsApiTriggerInfo
                                ]
                            ) {
                                params.commandIds.push(tab.IsApiTriggerInfo);
                            } else {
                                this.form[tab.IsApiTriggerInfo] =
                                    this.channelForm["channel_" + channel][
                                        tab.IsApiTriggerInfo
                                    ];
                            }
                        } else {
                            console.log(this.channelForm);
                            if (
                                !this.channelForm["channel_" + channel] ||
                                !this.channelForm["channel_" + channel][
                                    "IsApiWhdInfo"
                                ]
                            ) {
                                params.commandIds.push("IsApiWhdInfo");
                            } else {
                                this.form["IsApiWhdInfo"] = JSON.parse(
                                    JSON.stringify(
                                        this.copyChannelForm[
                                            "channel_" + channel
                                        ]["IsApiWhdInfo"]
                                    )
                                );
                            }
                            if (
                                !this.channelForm["channel_" + channel] ||
                                !this.channelForm["channel_" + channel][
                                    tab.commandId
                                ]
                            ) {
                                params.commandIds.push(tab.commandId);
                            } else {
                                this.form[tab.commandId] = JSON.parse(
                                    JSON.stringify(
                                        this.copyChannelForm[
                                            "channel_" + channel
                                        ][tab.commandId]
                                    )
                                );
                                this.form[tab.capability] = JSON.parse(
                                    JSON.stringify(
                                        this.copyChannelForm[
                                            "channel_" + channel
                                        ][tab.capability]
                                    )
                                );
                            }
                            if (
                                !this.channelForm["channel_" + channel] ||
                                !this.channelForm["channel_" + channel][
                                    tab.IsApiTriggerInfo
                                ]
                            ) {
                                params.commandIds.push(tab.IsApiTriggerInfo);
                            } else {
                                this.form[tab.IsApiTriggerInfo] = JSON.parse(
                                    JSON.stringify(
                                        this.copyChannelForm[
                                            "channel_" + channel
                                        ][tab.IsApiTriggerInfo]
                                    )
                                );
                            }
                        }
                        // params.commandIds.push('IsApiDBAGlobal');
                        // params.commandIds.push(tab.commandId,tab.IsApiTriggerInfo)
                        this.currentCommandId = tab.commandId;
                        this.currentIsApiTriggerInfo = tab.IsApiTriggerInfo;
                        findFlag++;
                    }
                });
            }
            if (!type) {
                this.$emit("adasCommandId", this.currentCommandId);
                this.$emit(
                    "currentIsApiTriggerInfos",
                    this.currentIsApiTriggerInfo
                );
            }
            if (!findFlag) return;
            if (!params.commandIds.length) return;
            this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
                if (res.success == true) {
                    console.log(res.data);
                    if (res.data === "{}") {
                        this.noCapability = true;
                    } else {
                        this.noCapability = false;
                    }
                    let resData = eval("(" + res.data + ")");
                    if (
                        resData[params.commandIds[1]] &&
                        resData[params.commandIds[1]]
                    ) {
                        // resData[params.commandIds[1]]['whdList'].forEach(item => {
                        //   for (let i = 0; i < resData[params.commandIds[2]]['EventRuleTriggerList'].length; i++) {
                        //     if (item.ruleID == resData[params.commandIds[2]]['EventRuleTriggerList'][i].ruleID) {
                        //       item.volume = resData[params.commandIds[2]]['EventRuleTriggerList'][i]['EventTriggerList'][0]['Audio']['volume']
                        //     }
                        //   }
                        // })
                    } else {
                        console.log(resData);
                        this.channelId = resData["IsApiWhdInfo"].ChannelID;
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
                            resData
                        );
                    this.copyChannelForm["channel_" + this.activeChannel] =
                        Object.assign(
                            {},
                            this.copyChannelForm[
                                "channel_" + this.activeChannel
                            ],
                            JSON.parse(JSON.stringify(resData))
                        );
                    this.capabilitiesEmit = JSON.parse(res.data)[
                        this.currentCommandId
                    ];
                } else {
                    this.$message.error("获取设备配置参数失败:" + res.msg);
                }
            });
        },
    },
    mounted() {
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
.no_capability {
    text-align: left;
    font-size: 18px;
    height: 100px;
    line-height: 100px;
}
.divHeight {
    height: 500px;
    width: 800;
}
.alarmLevelBox {
    padding-bottom: 8px;
}
.el-switch__label {
    opacity: 0;
}
</style>
