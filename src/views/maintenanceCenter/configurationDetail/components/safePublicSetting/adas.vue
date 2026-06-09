<template>
    <div class="p-a-md">
        <el-form
            ref="PublicAdas"
            label-position="top"
            :model="form"
            label-width="120px"
        >
            <el-dialog
                title="全局标定"
                :visible.sync="carbonateVisible"
            >
                <div class="carbonateContent">
                    <el-row type="flex" justify="space-between">
                        <el-col :span="7"> </el-col>
                        <el-col :span="7"> </el-col>
                        <el-col :span="7"> </el-col>
                    </el-row>
                </div>
                <div class="divHeight">
                    <!-- <div class="h-full inline" style="height:100%;width:100%;" id="videoPlay"></div> -->
                    <!--控件版本-->
                    <div
                        id="AEStreamWebVersion"
                        style="width: 0; height: 0"
                    ></div>
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
                <el-tab-pane
                    v-if="form['IsApiAdasGlobal'] != undefined"
                    label="ADAS全局配置"
                    name="first"
                >
                    <el-row
                        type="flex"
                        justify="space-between"
                        style="margin-top: 10px"
                    >
                        <el-col :span="7" v-if="isTemplate != 'true'">
                            <el-button @click="openDialog"
                                >ADAS全局音量配置</el-button
                            >
                            <span class="prompt"
                                >全局音量是为了方便用户统一设置各子项音量增加的配置，实际设备中无此项配置，故获取时此配置无意义。</span
                            >
                        </el-col>
                        <el-col :span="7">
                            <el-form-item
                                v-if="form['IsApiAdasGlobal']"
                                label="ADAS全局报警使能"
                                description="此项配置控制算法，不是统一配置子报警使能"
                            >
                                <el-switch
                                    v-model="form['IsApiAdasGlobal'].enabled"
                                    :active-value="Number(1)"
                                    :inactive-value="Number(0)"
                                ></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7"> </el-col>
                        <el-col v-if="isTemplate == 'true'" :span="7"> </el-col>
                    </el-row>
                </el-tab-pane>
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
                                        v-if="
                                            activeName != '交通标识识别（TSR）'
                                        "
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
                                    .adasAlarmInfoList"
                                :key="iIndex"
                            >
                                <template
                                    v-if="i.alarmLevel == item.alarmLevel"
                                >
                                    <el-row type="flex" justify="space-between">
                                        <el-col :span="7">
                                            <el-form-item
                                                v-if="isTemplate != 'true'"
                                                :label="
                                                    item.shortName + '报警使能'
                                                "
                                            >
                                                <el-switch
                                                    :disabled="
                                                        form['IsApiAdasGlobal']
                                                            .enabled != 1
                                                    "
                                                    v-model="i.alarmEnabled"
                                                    :active-value="Number(1)"
                                                    :inactive-value="Number(0)"
                                                ></el-switch>
                                                <!-- <el-select v-model="i.alarmEnabled">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="开启" :value="1"></el-option>
                            </el-select> -->
                                            </el-form-item>
                                            <el-form-item
                                                v-if="isTemplate == 'true'"
                                                :label="
                                                    item.shortName + '报警使能'
                                                "
                                            >
                                                <el-switch
                                                    v-if="
                                                        form[
                                                            'IsApiAdasGlobal'
                                                        ] == undefined
                                                    "
                                                    v-model="i.alarmEnabled"
                                                    :active-value="Number(1)"
                                                    :inactive-value="Number(0)"
                                                ></el-switch>
                                                <el-switch
                                                    v-if="
                                                        form[
                                                            'IsApiAdasGlobal'
                                                        ] != undefined
                                                    "
                                                    :disabled="
                                                        form['IsApiAdasGlobal']
                                                            .enabled != 1
                                                    "
                                                    v-model="i.alarmEnabled"
                                                    :active-value="Number(1)"
                                                    :inactive-value="Number(0)"
                                                ></el-switch>
                                                <!-- <el-select v-model="i.alarmEnabled">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="开启" :value="1"></el-option>
                            </el-select> -->
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7">
                                            <!-- <el-form-item label="报警判断速度阈值" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.speedLimit'"> -->
                                            <el-form-item
                                                description="一二级报警速度差不小于20"
                                                v-if="iIndex == 0"
                                                label="报警判断速度阈值"
                                                :rules="{
                                                    validator: checkNumber.bind(
                                                        {
                                                            type: 'int',
                                                            min: form[
                                                                item.commandId +
                                                                    'Capability'
                                                            ].capabilities[
                                                                item.alarmLevel -
                                                                    1
                                                            ].speedLimitMin,
                                                            max: form[
                                                                item.commandId
                                                            ]
                                                                .adasAlarmInfoList[1]
                                                                ? Number(
                                                                      form[
                                                                          item
                                                                              .commandId
                                                                      ]
                                                                          .adasAlarmInfoList[1][
                                                                          'speedLimit'
                                                                      ]
                                                                  ) - 20
                                                                : form[
                                                                      item.commandId +
                                                                          'Capability'
                                                                  ]
                                                                      .capabilities[
                                                                      item.alarmLevel -
                                                                          1
                                                                  ]
                                                                      .speedLimitMax,
                                                        }
                                                    ),
                                                    trigger: 'blur',
                                                }"
                                                :prop="
                                                    item.commandId +
                                                    '.adasAlarmInfoList.' +
                                                    iIndex +
                                                    '.speedLimit'
                                                "
                                            >
                                                <el-input
                                                    tips-placement="top-end"
                                                    :tips="`键入值范围为${
                                                        form[
                                                            item.commandId +
                                                                'Capability'
                                                        ].capabilities[
                                                            item.alarmLevel - 1
                                                        ].speedLimitMin
                                                    }~${
                                                        form[item.commandId]
                                                            .adasAlarmInfoList[1]
                                                            ? Number(
                                                                  form[
                                                                      item
                                                                          .commandId
                                                                  ]
                                                                      .adasAlarmInfoList[1][
                                                                      'speedLimit'
                                                                  ]
                                                              ) - 20
                                                            : form[
                                                                  item.commandId +
                                                                      'Capability'
                                                              ].capabilities[
                                                                  item.alarmLevel -
                                                                      1
                                                              ].speedLimitMax
                                                    }`"
                                                    v-model="i.speedLimit"
                                                    ><span slot="suffix"
                                                        >km/h</span
                                                    ></el-input
                                                >
                                            </el-form-item>
                                            <el-form-item
                                                description="一二级报警速度差不小于20"
                                                v-if="iIndex == 1"
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
                                                                    ]
                                                                        .adasAlarmInfoList[0]
                                                                        .speedLimit
                                                                ) + 20,
                                                            max: form[
                                                                item.commandId +
                                                                    'Capability'
                                                            ].capabilities[
                                                                item.alarmLevel -
                                                                    1
                                                            ].speedLimitMax,
                                                        }
                                                    ),
                                                    trigger: 'blur',
                                                }"
                                                :prop="
                                                    item.commandId +
                                                    '.adasAlarmInfoList.' +
                                                    iIndex +
                                                    '.speedLimit'
                                                "
                                            >
                                                <el-input
                                                    tips-placement="top-end"
                                                    :tips="`键入值范围为${
                                                        Number(
                                                            form[item.commandId]
                                                                .adasAlarmInfoList[0]
                                                                .speedLimit
                                                        ) + 20
                                                    }~${
                                                        form[
                                                            item.commandId +
                                                                'Capability'
                                                        ].capabilities[
                                                            item.alarmLevel - 1
                                                        ].speedLimitMax
                                                    }`"
                                                    v-model="i.speedLimit"
                                                    ><span slot="suffix"
                                                        >km/h</span
                                                    ></el-input
                                                >
                                            </el-form-item>
                                        </el-col>
                                        <!-- <el-col :span="7" > -->
                                        <!-- <el-form-item label="报警抑制时间 (100-600)" :rules="{ validator: checkNumber.bind({type:'int',min:100,max:600}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.interval'"> -->
                                        <!-- <el-form-item label="报警抑制时间" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].intervalMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].intervalMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.interval'">
                            <el-input v-model="i.interval"><span slot="suffix">ms</span></el-input>
                        </el-form-item> -->
                                        <!-- </el-col> -->
                                        <el-col :span="7">
                                            <!-- <el-form-item label="算法置信度（1-100）" :rules="{ validator: checkNumber.bind({type:'int',min:1,max:100}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.confidence'"> -->
                                            <el-form-item
                                                label="算法置信度"
                                                :rules="{
                                                    validator: checkNumber.bind(
                                                        {
                                                            type: 'int',
                                                            min: form[
                                                                item.commandId +
                                                                    'Capability'
                                                            ].capabilities[
                                                                item.alarmLevel -
                                                                    1
                                                            ].confidenceMin,
                                                            max: form[
                                                                item.commandId +
                                                                    'Capability'
                                                            ].capabilities[
                                                                item.alarmLevel -
                                                                    1
                                                            ].confidenceMax,
                                                        }
                                                    ),
                                                    trigger: 'blur',
                                                }"
                                                :prop="
                                                    item.commandId +
                                                    '.adasAlarmInfoList.' +
                                                    iIndex +
                                                    '.confidence'
                                                "
                                            >
                                                <el-input
                                                    tips-placement="top-end"
                                                    :tips="`键入值范围为${
                                                        form[
                                                            item.commandId +
                                                                'Capability'
                                                        ].capabilities[
                                                            item.alarmLevel - 1
                                                        ].confidenceMin
                                                    }~${
                                                        form[
                                                            item.commandId +
                                                                'Capability'
                                                        ].capabilities[
                                                            item.alarmLevel - 1
                                                        ].confidenceMax
                                                    }`"
                                                    v-model="i.confidence"
                                                    ><span slot="suffix"
                                                        >%</span
                                                    ></el-input
                                                >
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row type="flex" justify="space-between">
                                        <!-- <el-col :span="7" > -->
                                        <!-- <el-form-item label="碰撞时间" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.timeToCollision'"> -->
                                        <!-- <el-form-item label="碰撞时间" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].timeToCollisionMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].timeToCollisionMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.timeToCollision'">
                            <el-input v-model="i.timeToCollision"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col> -->
                                        <el-col :span="7">
                                            <!-- <el-form-item label="算法灵敏度（0-3）" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:3}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.sensitivity'"> -->
                                            <el-form-item
                                                label="算法灵敏度"
                                                :rules="{
                                                    validator: checkNumber.bind(
                                                        {
                                                            type: 'int',
                                                            min: form[
                                                                item.commandId +
                                                                    'Capability'
                                                            ].capabilities[
                                                                item.alarmLevel -
                                                                    1
                                                            ].sensitivityMin,
                                                            max: form[
                                                                item.commandId +
                                                                    'Capability'
                                                            ].capabilities[
                                                                item.alarmLevel -
                                                                    1
                                                            ].sensitivityMax,
                                                        }
                                                    ),
                                                    trigger: 'blur',
                                                }"
                                                :prop="
                                                    item.commandId +
                                                    '.adasAlarmInfoList.' +
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
                                                        ].capabilities[
                                                            item.alarmLevel - 1
                                                        ].sensitivityMin
                                                    }~${
                                                        form[
                                                            item.commandId +
                                                                'Capability'
                                                        ].capabilities[
                                                            item.alarmLevel - 1
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
                                                        'adasVolumeInfoList'
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
                                                        ]['adasVolumeInfoList'][
                                                            iIndex
                                                        ].volume
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
                                        <el-col :span="7">
                                            <el-form-item
                                                label="报警图片上传使能"
                                            >
                                                <el-switch
                                                    v-model="i.snapShotUpload"
                                                    :active-value="Number(1)"
                                                    :inactive-value="Number(0)"
                                                ></el-switch>
                                                <!-- <el-select v-model="i.snapShotUpload">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="上传" :value="1"></el-option>
                            </el-select> -->
                                            </el-form-item>
                                        </el-col>
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
                                        <el-col :span="7">
                                            <el-form-item
                                                label="报警视频上传使能"
                                            >
                                                <el-switch
                                                    v-model="i.clipUpload"
                                                    :active-value="Number(1)"
                                                    :inactive-value="Number(0)"
                                                ></el-switch>
                                                <!-- <el-select v-model="i.clipUpload">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="上传" :value="1"></el-option>
                            </el-select> -->
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-form-item
                                                v-if="
                                                    activeName ==
                                                    '车距过近（HMW）'
                                                "
                                                label="碰撞时间"
                                                :rules="{
                                                    validator: checkNumber.bind(
                                                        {
                                                            type: 'int',
                                                            min: form[
                                                                item.commandId +
                                                                    'Capability'
                                                            ].capabilities[
                                                                item.alarmLevel -
                                                                    1
                                                            ]
                                                                .timeToCollisionMin,
                                                            max: form[
                                                                item.commandId +
                                                                    'Capability'
                                                            ].capabilities[
                                                                item.alarmLevel -
                                                                    1
                                                            ]
                                                                .timeToCollisionMax,
                                                        }
                                                    ),
                                                    trigger: 'blur',
                                                }"
                                                :prop="
                                                    item.commandId +
                                                    '.adasAlarmInfoList.' +
                                                    iIndex +
                                                    '.timeToCollision'
                                                "
                                            >
                                                <el-input
                                                    tips-placement="top-end"
                                                    :tips="`键入值范围为${
                                                        form[
                                                            item.commandId +
                                                                'Capability'
                                                        ].capabilities[
                                                            item.alarmLevel - 1
                                                        ].timeToCollisionMin
                                                    }~${
                                                        form[
                                                            item.commandId +
                                                                'Capability'
                                                        ].capabilities[
                                                            item.alarmLevel - 1
                                                        ].timeToCollisionMax
                                                    }`"
                                                    v-model="i.timeToCollision"
                                                    ><span slot="suffix"
                                                        >ms</span
                                                    ></el-input
                                                >
                                                <!-- <el-select v-model="i.clipUpload">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="上传" :value="1"></el-option>
                            </el-select> -->
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7"></el-col>
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
        <el-dialog
            title="ADAS全局音量调整"
            :visible.sync="dialogVisible"
        >
            <div class="p-a-md">
                <p class="m-b-sm">
                    点击确定后ADAS所有报警项音量将调整为该值,下发至终端成功后生效。
                </p>
                <el-slider
                    v-model="volume"
                    :min="0"
                    :max="64"
                    :step="1"
                    show-input
                ></el-slider>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    :loading="sendEveryVolume"
                    :disabled="sendEveryVolume"
                    @click="send"
                    >{{ sendEveryVolume ? "设置中" : "确 定" }}</el-button
                >
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
function throttle(fn, interval = 500) {
    let last = 0;
    return function (...args) {
        let now = +new Date();
        if (now - last > interval) {
            last = now;
            fn.call(this, args);
        }
    };
}
import { validateNum } from "@/utils/validate";
export default {
    props: {
        isTemplate: {
            type: String,
        },
        detail: {
            type: Object,
            default: () => {
                return {};
            },
        },
        menuJson: {
            type: Object,
            default: () => {
                return {};
            },
        },
        configParams: {
            type: Boolean,
            default: false,
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
        everyVolumeBol: {
            type: Boolean,
            default: false,
        },
        deviceCapabilities: {
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
        menuJson: {
            handler(val) {
                if (val) {
                }
            },
        },
        deviceCapabilities: {
            handler(newVal, oldVal) {
                if (Boolean(this.isTemplate) == true) {
                } else {
                    this.channelList = [];
                    console.log(newVal);
                    let channelShow = ["FCW", "HMW", "LDW", "PCW", "TSR"];
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
                    this.channelList = [...new Set(channels)];
                    this.activeChannel = this.channelList[0];
                    this.deviceCapability = newVal;
                }
            },
            deep: true,
            immediate: true,
        },
        everyVolumeBol: {
            handler(val) {
                if (!val) {
                    this.everyVolume = false;
                }
            },
        },
        detail: {
            handler(newVal, oldVal) {
                console.log(newVal);
                this.form = newVal;
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
                this.channelForm = newVal;
                if (this.isTemplate == "true") {
                    if (JSON.stringify(newVal) != "{}") {
                        let channels = [];
                        let form = {};
                        for (let key in newVal) {
                            for (let key_ in newVal[key]) {
                                if (
                                    key_ == "IsApiAdasGlobal" ||
                                    key_ == "IsApiFcwInfoList" ||
                                    key_ == "IsApiHmwInfoList" ||
                                    key_ == "IsApiLdwInfoList" ||
                                    key_ == "IsApiPcwInfoList" ||
                                    key_ == "IsApiTsrInfoList"
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
        form: {
            handler(val) {
                if (JSON.stringify(val) !== "{}") {
                    if (
                        this.form[this.currentIsApiTriggerInfo] &&
                        this.form[this.currentCommandId] &&
                        this.currentCommandId != "IsApiAdasGlobal"
                    ) {
                        this.showDeploy = true;
                    } else {
                        this.showDeploy = false;
                    }
                    this.$emit("change", val);
                }
            },
            deep: true,
            immediate: true,
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
        dialogVisible: {
            handler(val) {
                if (val) {
                    this.volume = 50;
                }
            },
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
                // console.log(newVal)
                this.$emit("adasCommandId", newVal);
            },
        },
        currentIsApiTriggerInfo: {
            handler(newVal, oldVal) {
                //  console.log(newVal)
                this.$emit("currentIsApiTriggerInfos", newVal);
            },
        },
        volume: {
            handler(newVal, oldVal) {
                this.$emit("everyVolume", true);
            },
        },
        configParams: {
            handler(val) {
                if (!val) {
                    this.getByIsApi(this.activeName, this.activeChannel, false);
                }
            },
            deep: true,
            immediate: true,
        },
        //全局ADAS使能变化监听
        "form.IsApiAdasGlobal": {
            handler(val) {
                if (val != undefined) {
                    this.$refs["PublicAdas"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiAdasGlobal_" +
                                    val.channelId +
                                    ".enabled." +
                                    val.channelId
                            ] =
                                val["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiAdasGlobal"]["enabled"]
                                    ? `IsApiAdasGlobal_${
                                          val["channelId"]
                                      }.enabled.${
                                          val["channelId"]
                                      }&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/ADAS全局设置/ADAS全局报警使能&${
                                          val["enabled"] ? "开启" : "关闭"
                                      }`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiAdasGlobal_" +
                                    val.channelId +
                                    ".enabled." +
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
        //前车碰撞音量变化监听
        "form.IsApiFcwTriggerInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicAdas"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiFcwTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.0.volume." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasVolumeInfoList"][0]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiFcwTriggerInfo"][
                                    "adasVolumeInfoList"
                                ][0]["volume"]
                                    ? `IsApiFcwTriggerInfo_${val["channelId"]}.adasVolumeInfoList.0.volume.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/前车碰撞（FCW）/一级报警/前车碰撞报警音量&${val["adasVolumeInfoList"][0]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiFcwTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.1.volume." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasVolumeInfoList"][1]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiFcwTriggerInfo"][
                                    "adasVolumeInfoList"
                                ][1]["volume"]
                                    ? `IsApiFcwTriggerInfo_${val["channelId"]}.adasVolumeInfoList.1.volume.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/前车碰撞（FCW）/二级报警/前车碰撞报警音量&${val["adasVolumeInfoList"][1]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiFcwTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.0.volume." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiFcwTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.1.volume." +
                                    val.channelId +
                                    ".channel.useless"
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
        //车距过近音量变化监听
        "form.IsApiHmwTriggerInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicAdas"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiHmwTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.0.volume." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasVolumeInfoList"][0]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiHmwTriggerInfo"][
                                    "adasVolumeInfoList"
                                ][0]["volume"]
                                    ? `IsApiHmwTriggerInfo_${val["channelId"]}.adasVolumeInfoList.0.volume.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车距过近（HMW）/一级报警/车距过近报警音量&${val["adasVolumeInfoList"][0]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiHmwTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.1.volume." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasVolumeInfoList"][1]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiHmwTriggerInfo"][
                                    "adasVolumeInfoList"
                                ][1]["volume"]
                                    ? `IsApiHmwTriggerInfo_${val["channelId"]}.adasVolumeInfoList.1.volume.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车距过近（HMW）/二级报警/车距过近报警音量&${val["adasVolumeInfoList"][1]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiHmwTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.0.volume." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiHmwTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.1.volume." +
                                    val.channelId +
                                    ".channel.useless"
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
        //车道偏离音量变化监听
        "form.IsApiLdwTriggerInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicAdas"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiLdwTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.0.volume." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasVolumeInfoList"][0]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiLdwTriggerInfo"][
                                    "adasVolumeInfoList"
                                ][0]["volume"]
                                    ? `IsApiLdwTriggerInfo_${val["channelId"]}.adasVolumeInfoList.0.volume.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车道偏离（LDW）/一级报警/车道偏离报警音量&${val["adasVolumeInfoList"][0]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiLdwTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.1.volume." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasVolumeInfoList"][1]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiLdwTriggerInfo"][
                                    "adasVolumeInfoList"
                                ][1]["volume"]
                                    ? `IsApiLdwTriggerInfo_${val["channelId"]}.adasVolumeInfoList.1.volume.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车道偏离（LDW）/二级报警/车道偏离报警音量&${val["adasVolumeInfoList"][1]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiLdwTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.0.volume." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiLdwTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.1.volume." +
                                    val.channelId +
                                    ".channel.useless"
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
        //行人监测音量变化监听
        "form.IsApiPcwTriggerInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicAdas"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiPcwTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.0.volume." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasVolumeInfoList"][0]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiPcwTriggerInfo"][
                                    "adasVolumeInfoList"
                                ][0]["volume"]
                                    ? `IsApiPcwTriggerInfo_${val["channelId"]}.adasVolumeInfoList.0.volume.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/行人监测（PCW）/一级报警/行人监测报警音量&${val["adasVolumeInfoList"][0]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiPcwTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.1.volume." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasVolumeInfoList"][1]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiPcwTriggerInfo"][
                                    "adasVolumeInfoList"
                                ][1]["volume"]
                                    ? `IsApiPcwTriggerInfo_${val["channelId"]}.adasVolumeInfoList.1.volume.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/行人监测（PCW）/二级报警/行人监测报警音量&${val["adasVolumeInfoList"][1]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiPcwTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.0.volume." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiPcwTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.1.volume." +
                                    val.channelId +
                                    ".channel.useless"
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
        //交通标识提醒音量变化监听
        "form.IsApiTsrTriggerInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicAdas"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiTsrTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.0.volume." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasVolumeInfoList"][0]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiTsrTriggerInfo"][
                                    "adasVolumeInfoList"
                                ][0]["volume"]
                                    ? `IsApiTsrTriggerInfo_${val["channelId"]}.adasVolumeInfoList.0.volume.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/交通标识识别（TSR）/一级报警/行人监测报警音量&${val["adasVolumeInfoList"][0]["volume"]}`
                                    : "";
                            //this.formData['IsApiTsrTriggerInfo_'+val.channelId+'.adasVolumeInfoList.1.volume.'+val.channelId+'.channel.useless'] = val['adasVolumeInfoList'][1]['volume'] != this.copyChannelForm['channel_'+val.channelId]['IsApiTsrTriggerInfo']['adasVolumeInfoList'][1]['volume'] ? `IsApiTsrTriggerInfo_${val['channelId']}.adasVolumeInfoList.1.volume.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/行人监测（PCW）/二级报警/行人监测报警音量&${val['adasVolumeInfoList'][1]['volume']}` : '';
                        } else {
                            this.formData[
                                "IsApiTsrTriggerInfo_" +
                                    val.channelId +
                                    ".adasVolumeInfoList.0.volume." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            //this.formData['IsApiTsrTriggerInfo_'+val.channelId+'.adasVolumeInfoList.1.volume.'+val.channelId+'.channel.useless'] = ''
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //前车碰撞变化监听
        "form.IsApiFcwInfoList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicAdas"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["alarmEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiFcwInfoList"]["adasAlarmInfoList"][0][
                                    "alarmEnabled"
                                ]
                                    ? `IsApiFcwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.0.alarmEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/前车碰撞（FCW）/一级报警/前车碰撞报警使能&${
                                          val["adasAlarmInfoList"][0][
                                              "alarmEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["speedLimit"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiFcwInfoList"]["adasAlarmInfoList"][0][
                                    "speedLimit"
                                ]
                                    ? `IsApiFcwInfoList_${val["channelId"]}.adasAlarmInfoList.0.speedLimit.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/前车碰撞（FCW）/一级报警/报警判断速度阈值&${val["adasAlarmInfoList"][0]["speedLimit"]}`
                                    : "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["confidence"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiFcwInfoList"]["adasAlarmInfoList"][0][
                                    "confidence"
                                ]
                                    ? `IsApiFcwInfoList_${val["channelId"]}.adasAlarmInfoList.0.confidence.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/前车碰撞（FCW）/一级报警/算法置信度&${val["adasAlarmInfoList"][0]["confidence"]}`
                                    : "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiFcwInfoList"]["adasAlarmInfoList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiFcwInfoList_${val["channelId"]}.adasAlarmInfoList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/前车碰撞（FCW）/一级报警/算法灵敏度&${val["adasAlarmInfoList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["snapShotUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiFcwInfoList"]["adasAlarmInfoList"][0][
                                    "snapShotUpload"
                                ]
                                    ? `IsApiFcwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.0.snapShotUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/前车碰撞（FCW）/一级报警/报警图片上传使能&${
                                          val["adasAlarmInfoList"][0][
                                              "snapShotUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.clipUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["clipUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiFcwInfoList"]["adasAlarmInfoList"][0][
                                    "clipUpload"
                                ]
                                    ? `IsApiFcwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.0.clipUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/前车碰撞（FCW）/一级报警/报警视频上传使能&${
                                          val["adasAlarmInfoList"][0][
                                              "clipUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["alarmEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiFcwInfoList"]["adasAlarmInfoList"][1][
                                    "alarmEnabled"
                                ]
                                    ? `IsApiFcwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.1.alarmEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/前车碰撞（FCW）/二级报警/前车碰撞报警使能&${
                                          val["adasAlarmInfoList"][1][
                                              "alarmEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["speedLimit"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiFcwInfoList"]["adasAlarmInfoList"][1][
                                    "speedLimit"
                                ]
                                    ? `IsApiFcwInfoList_${val["channelId"]}.adasAlarmInfoList.1.speedLimit.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/前车碰撞（FCW）/二级报警/报警判断速度阈值&${val["adasAlarmInfoList"][1]["speedLimit"]}`
                                    : "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["confidence"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiFcwInfoList"]["adasAlarmInfoList"][1][
                                    "confidence"
                                ]
                                    ? `IsApiFcwInfoList_${val["channelId"]}.adasAlarmInfoList.1.confidence.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/前车碰撞（FCW）/二级报警/算法置信度&${val["adasAlarmInfoList"][1]["confidence"]}`
                                    : "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiFcwInfoList"]["adasAlarmInfoList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiFcwInfoList_${val["channelId"]}.adasAlarmInfoList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/前车碰撞（FCW）/二级报警/算法灵敏度&${val["adasAlarmInfoList"][1]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["snapShotUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiFcwInfoList"]["adasAlarmInfoList"][1][
                                    "snapShotUpload"
                                ]
                                    ? `IsApiFcwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.1.snapShotUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/前车碰撞（FCW）/二级报警/报警图片上传使能&${
                                          val["adasAlarmInfoList"][1][
                                              "snapShotUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.clipUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["clipUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiFcwInfoList"]["adasAlarmInfoList"][1][
                                    "clipUpload"
                                ]
                                    ? `IsApiFcwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.1.clipUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/前车碰撞（FCW）/二级报警/报警视频上传使能&${
                                          val["adasAlarmInfoList"][1][
                                              "clipUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.clipUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiFcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.clipUpload." +
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
        //车距过近变化监听
        "form.IsApiHmwInfoList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicAdas"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["alarmEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiHmwInfoList"]["adasAlarmInfoList"][0][
                                    "alarmEnabled"
                                ]
                                    ? `IsApiHmwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.0.alarmEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/车距过近（HMW）/一级报警/前车碰撞报警使能&${
                                          val["adasAlarmInfoList"][0][
                                              "alarmEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["speedLimit"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiHmwInfoList"]["adasAlarmInfoList"][0][
                                    "speedLimit"
                                ]
                                    ? `IsApiHmwInfoList_${val["channelId"]}.adasAlarmInfoList.0.speedLimit.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车距过近（HMW）/一级报警/报警判断速度阈值&${val["adasAlarmInfoList"][0]["speedLimit"]}`
                                    : "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["confidence"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiHmwInfoList"]["adasAlarmInfoList"][0][
                                    "confidence"
                                ]
                                    ? `IsApiHmwInfoList_${val["channelId"]}.adasAlarmInfoList.0.confidence.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车距过近（HMW）/一级报警/算法置信度&${val["adasAlarmInfoList"][0]["confidence"]}`
                                    : "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiHmwInfoList"]["adasAlarmInfoList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiHmwInfoList_${val["channelId"]}.adasAlarmInfoList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车距过近（HMW）/一级报警/算法灵敏度&${val["adasAlarmInfoList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["snapShotUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiHmwInfoList"]["adasAlarmInfoList"][0][
                                    "snapShotUpload"
                                ]
                                    ? `IsApiHmwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.0.snapShotUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/车距过近（HMW）/一级报警/报警图片上传使能&${
                                          val["adasAlarmInfoList"][0][
                                              "snapShotUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.clipUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["clipUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiHmwInfoList"]["adasAlarmInfoList"][0][
                                    "clipUpload"
                                ]
                                    ? `IsApiHmwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.0.clipUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/车距过近（HMW）/一级报警/报警视频上传使能&${
                                          val["adasAlarmInfoList"][0][
                                              "clipUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.timeToCollision." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0][
                                    "timeToCollision"
                                ] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiHmwInfoList"]["adasAlarmInfoList"][0][
                                    "timeToCollision"
                                ]
                                    ? `IsApiHmwInfoList_${val["channelId"]}.adasAlarmInfoList.0.timeToCollision.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车距过近（HMW）/一级报警/碰撞时间&${val["adasAlarmInfoList"][0]["timeToCollision"]}`
                                    : "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["alarmEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiHmwInfoList"]["adasAlarmInfoList"][1][
                                    "alarmEnabled"
                                ]
                                    ? `IsApiHmwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.1.alarmEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/车距过近（HMW）/二级报警/前车碰撞报警使能&${
                                          val["adasAlarmInfoList"][1][
                                              "alarmEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["speedLimit"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiHmwInfoList"]["adasAlarmInfoList"][1][
                                    "speedLimit"
                                ]
                                    ? `IsApiHmwInfoList_${val["channelId"]}.adasAlarmInfoList.1.speedLimit.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车距过近（HMW）/二级报警/报警判断速度阈值&${val["adasAlarmInfoList"][1]["speedLimit"]}`
                                    : "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["confidence"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiHmwInfoList"]["adasAlarmInfoList"][1][
                                    "confidence"
                                ]
                                    ? `IsApiHmwInfoList_${val["channelId"]}.adasAlarmInfoList.1.confidence.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车距过近（HMW）/二级报警/算法置信度&${val["adasAlarmInfoList"][1]["confidence"]}`
                                    : "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiHmwInfoList"]["adasAlarmInfoList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiHmwInfoList_${val["channelId"]}.adasAlarmInfoList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车距过近（HMW）/二级报警/算法灵敏度&${val["adasAlarmInfoList"][1]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["snapShotUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiHmwInfoList"]["adasAlarmInfoList"][1][
                                    "snapShotUpload"
                                ]
                                    ? `IsApiHmwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.1.snapShotUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/车距过近（HMW）/二级报警/报警图片上传使能&${
                                          val["adasAlarmInfoList"][1][
                                              "snapShotUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.clipUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["clipUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiHmwInfoList"]["adasAlarmInfoList"][1][
                                    "clipUpload"
                                ]
                                    ? `IsApiHmwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.1.clipUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/车距过近（HMW）/二级报警/报警视频上传使能&${
                                          val["adasAlarmInfoList"][1][
                                              "clipUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.timeToCollision." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1][
                                    "timeToCollision"
                                ] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiHmwInfoList"]["adasAlarmInfoList"][1][
                                    "timeToCollision"
                                ]
                                    ? `IsApiHmwInfoList_${val["channelId"]}.adasAlarmInfoList.1.timeToCollision.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车距过近（HMW）/二级报警/碰撞时间&${val["adasAlarmInfoList"][1]["timeToCollision"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.clipUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.timeToCollision." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.clipUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiHmwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.timeToCollision." +
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
        //车道偏离变化监听
        "form.IsApiLdwInfoList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicAdas"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["alarmEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiLdwInfoList"]["adasAlarmInfoList"][0][
                                    "alarmEnabled"
                                ]
                                    ? `IsApiLdwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.0.alarmEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/车道偏离（LDW）/一级报警/前车碰撞报警使能&${
                                          val["adasAlarmInfoList"][0][
                                              "alarmEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["speedLimit"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiLdwInfoList"]["adasAlarmInfoList"][0][
                                    "speedLimit"
                                ]
                                    ? `IsApiLdwInfoList_${val["channelId"]}.adasAlarmInfoList.0.speedLimit.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车道偏离（LDW）/一级报警/报警判断速度阈值&${val["adasAlarmInfoList"][0]["speedLimit"]}`
                                    : "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["confidence"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiLdwInfoList"]["adasAlarmInfoList"][0][
                                    "confidence"
                                ]
                                    ? `IsApiLdwInfoList_${val["channelId"]}.adasAlarmInfoList.0.confidence.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车道偏离（LDW）/一级报警/算法置信度&${val["adasAlarmInfoList"][0]["confidence"]}`
                                    : "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiLdwInfoList"]["adasAlarmInfoList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiLdwInfoList_${val["channelId"]}.adasAlarmInfoList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车道偏离（LDW）/一级报警/算法灵敏度&${val["adasAlarmInfoList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["snapShotUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiLdwInfoList"]["adasAlarmInfoList"][0][
                                    "snapShotUpload"
                                ]
                                    ? `IsApiLdwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.0.snapShotUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/车道偏离（LDW）/一级报警/报警图片上传使能&${
                                          val["adasAlarmInfoList"][0][
                                              "snapShotUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.clipUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["clipUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiLdwInfoList"]["adasAlarmInfoList"][0][
                                    "clipUpload"
                                ]
                                    ? `IsApiLdwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.0.clipUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/车道偏离（LDW）/一级报警/报警视频上传使能&${
                                          val["adasAlarmInfoList"][0][
                                              "clipUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["alarmEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiLdwInfoList"]["adasAlarmInfoList"][1][
                                    "alarmEnabled"
                                ]
                                    ? `IsApiLdwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.1.alarmEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/车道偏离（LDW）/二级报警/前车碰撞报警使能&${
                                          val["adasAlarmInfoList"][1][
                                              "alarmEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["speedLimit"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiLdwInfoList"]["adasAlarmInfoList"][1][
                                    "speedLimit"
                                ]
                                    ? `IsApiLdwInfoList_${val["channelId"]}.adasAlarmInfoList.1.speedLimit.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车道偏离（LDW）/二级报警/报警判断速度阈值&${val["adasAlarmInfoList"][1]["speedLimit"]}`
                                    : "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["confidence"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiLdwInfoList"]["adasAlarmInfoList"][1][
                                    "confidence"
                                ]
                                    ? `IsApiLdwInfoList_${val["channelId"]}.adasAlarmInfoList.1.confidence.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车道偏离（LDW）/二级报警/算法置信度&${val["adasAlarmInfoList"][1]["confidence"]}`
                                    : "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiLdwInfoList"]["adasAlarmInfoList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiLdwInfoList_${val["channelId"]}.adasAlarmInfoList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/车道偏离（LDW）/二级报警/算法灵敏度&${val["adasAlarmInfoList"][1]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["snapShotUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiLdwInfoList"]["adasAlarmInfoList"][1][
                                    "snapShotUpload"
                                ]
                                    ? `IsApiLdwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.1.snapShotUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/车道偏离（LDW）/二级报警/报警图片上传使能&${
                                          val["adasAlarmInfoList"][1][
                                              "snapShotUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.clipUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["clipUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiLdwInfoList"]["adasAlarmInfoList"][1][
                                    "clipUpload"
                                ]
                                    ? `IsApiLdwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.1.clipUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/车道偏离（LDW）/二级报警/报警视频上传使能&${
                                          val["adasAlarmInfoList"][1][
                                              "clipUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.clipUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiLdwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.clipUpload." +
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
        //行人监测变化监听
        "form.IsApiPcwInfoList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicAdas"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["alarmEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiPcwInfoList"]["adasAlarmInfoList"][0][
                                    "alarmEnabled"
                                ]
                                    ? `IsApiPcwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.0.alarmEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/行人监测（PCW）/一级报警/前车碰撞报警使能&${
                                          val["adasAlarmInfoList"][0][
                                              "alarmEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["speedLimit"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiPcwInfoList"]["adasAlarmInfoList"][0][
                                    "speedLimit"
                                ]
                                    ? `IsApiPcwInfoList_${val["channelId"]}.adasAlarmInfoList.0.speedLimit.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/行人监测（PCW）/一级报警/报警判断速度阈值&${val["adasAlarmInfoList"][0]["speedLimit"]}`
                                    : "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["confidence"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiPcwInfoList"]["adasAlarmInfoList"][0][
                                    "confidence"
                                ]
                                    ? `IsApiPcwInfoList_${val["channelId"]}.adasAlarmInfoList.0.confidence.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/行人监测（PCW）/一级报警/算法置信度&${val["adasAlarmInfoList"][0]["confidence"]}`
                                    : "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiPcwInfoList"]["adasAlarmInfoList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiPcwInfoList_${val["channelId"]}.adasAlarmInfoList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/行人监测（PCW）/一级报警/算法灵敏度&${val["adasAlarmInfoList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["snapShotUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiPcwInfoList"]["adasAlarmInfoList"][0][
                                    "snapShotUpload"
                                ]
                                    ? `IsApiPcwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.0.snapShotUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/行人监测（PCW）/一级报警/报警图片上传使能&${
                                          val["adasAlarmInfoList"][0][
                                              "snapShotUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.clipUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["clipUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiPcwInfoList"]["adasAlarmInfoList"][0][
                                    "clipUpload"
                                ]
                                    ? `IsApiPcwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.0.clipUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/行人监测（PCW）/一级报警/报警视频上传使能&${
                                          val["adasAlarmInfoList"][0][
                                              "clipUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["alarmEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiPcwInfoList"]["adasAlarmInfoList"][1][
                                    "alarmEnabled"
                                ]
                                    ? `IsApiPcwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.1.alarmEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/行人监测（PCW）/二级报警/前车碰撞报警使能&${
                                          val["adasAlarmInfoList"][1][
                                              "alarmEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["speedLimit"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiPcwInfoList"]["adasAlarmInfoList"][1][
                                    "speedLimit"
                                ]
                                    ? `IsApiPcwInfoList_${val["channelId"]}.adasAlarmInfoList.1.speedLimit.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/行人监测（PCW）/二级报警/报警判断速度阈值&${val["adasAlarmInfoList"][1]["speedLimit"]}`
                                    : "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["confidence"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiPcwInfoList"]["adasAlarmInfoList"][1][
                                    "confidence"
                                ]
                                    ? `IsApiPcwInfoList_${val["channelId"]}.adasAlarmInfoList.1.confidence.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/行人监测（PCW）/二级报警/算法置信度&${val["adasAlarmInfoList"][1]["confidence"]}`
                                    : "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiPcwInfoList"]["adasAlarmInfoList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiPcwInfoList_${val["channelId"]}.adasAlarmInfoList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/行人监测（PCW）/二级报警/算法灵敏度&${val["adasAlarmInfoList"][1]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["snapShotUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiPcwInfoList"]["adasAlarmInfoList"][1][
                                    "snapShotUpload"
                                ]
                                    ? `IsApiPcwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.1.snapShotUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/行人监测（PCW）/二级报警/报警图片上传使能&${
                                          val["adasAlarmInfoList"][1][
                                              "snapShotUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.clipUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][1]["clipUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiPcwInfoList"]["adasAlarmInfoList"][1][
                                    "clipUpload"
                                ]
                                    ? `IsApiPcwInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.1.clipUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/行人监测（PCW）/二级报警/报警视频上传使能&${
                                          val["adasAlarmInfoList"][1][
                                              "clipUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            // this.formData['IsApiPcwInfoList.adasAlarmInfoList.0.volume.'+val.channelId+'.channel.useless'] = '';
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.clipUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            // this.formData['IsApiPcwInfoList.adasAlarmInfoList.1.volume.'+val.channelId+'.channel.useless'] = '';
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiPcwInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.1.clipUpload." +
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
        //交通标识识别（TSR）变化监听
        "form.IsApiTsrInfoList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicAdas"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiTsrInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["alarmEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiTsrInfoList"]["adasAlarmInfoList"][0][
                                    "alarmEnabled"
                                ]
                                    ? `IsApiTsrInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.0.alarmEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/交通标识识别（TSR）/一级报警/前车碰撞报警使能&${
                                          val["adasAlarmInfoList"][0][
                                              "alarmEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiTsrInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["speedLimit"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiTsrInfoList"]["adasAlarmInfoList"][0][
                                    "speedLimit"
                                ]
                                    ? `IsApiTsrInfoList_${val["channelId"]}.adasAlarmInfoList.0.speedLimit.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/交通标识识别（TSR）/一级报警/报警判断速度阈值&${val["adasAlarmInfoList"][0]["speedLimit"]}`
                                    : "";
                            this.formData[
                                "IsApiTsrInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["confidence"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiTsrInfoList"]["adasAlarmInfoList"][0][
                                    "confidence"
                                ]
                                    ? `IsApiTsrInfoList_${val["channelId"]}.adasAlarmInfoList.0.confidence.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/交通标识识别（TSR）/一级报警/算法置信度&${val["adasAlarmInfoList"][0]["confidence"]}`
                                    : "";
                            this.formData[
                                "IsApiTsrInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiTsrInfoList"]["adasAlarmInfoList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiTsrInfoList_${val["channelId"]}.adasAlarmInfoList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/交通标识识别（TSR）/一级报警/算法灵敏度&${val["adasAlarmInfoList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiTsrInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["snapShotUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiTsrInfoList"]["adasAlarmInfoList"][0][
                                    "snapShotUpload"
                                ]
                                    ? `IsApiTsrInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.0.snapShotUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/交通标识识别（TSR）/一级报警/报警图片上传使能&${
                                          val["adasAlarmInfoList"][0][
                                              "snapShotUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiTsrInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.clipUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["adasAlarmInfoList"][0]["clipUpload"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiTsrInfoList"]["adasAlarmInfoList"][0][
                                    "clipUpload"
                                ]
                                    ? `IsApiTsrInfoList_${
                                          val["channelId"]
                                      }.adasAlarmInfoList.0.clipUpload.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/ADAS/通道${
                                          val.channelId
                                      }/交通标识识别（TSR）/一级报警/报警视频上传使能&${
                                          val["adasAlarmInfoList"][0][
                                              "clipUpload"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            // this.formData['IsApiTsrInfoList_'+val.channelId+'.adasAlarmInfoList.1.alarmEnabled.'+val.channelId+'.channel.useless'] = val['adasAlarmInfoList'][1]['alarmEnabled'] != this.copyChannelForm['channel_'+val.channelId]['IsApiTsrInfoList']['adasAlarmInfoList'][1]['alarmEnabled'] ? `IsApiTsrInfoList_${val['channelId']}.adasAlarmInfoList.1.alarmEnabled.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/交通标识识别（TSR）/二级报警/前车碰撞报警使能&${val['adasAlarmInfoList'][1]['alarmEnabled']?'开启':'关闭'}` : '';
                            // this.formData['IsApiTsrInfoList_'+val.channelId+'.adasAlarmInfoList.1.speedLimit.'+val.channelId+'.channel.useless'] = val['adasAlarmInfoList'][1]['speedLimit'] != this.copyChannelForm['channel_'+val.channelId]['IsApiTsrInfoList']['adasAlarmInfoList'][1]['speedLimit'] ? `IsApiTsrInfoList_${val['channelId']}.adasAlarmInfoList.1.speedLimit.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/交通标识识别（TSR）/二级报警/报警判断速度阈值&${val['adasAlarmInfoList'][1]['speedLimit']}` : '';
                            // this.formData['IsApiTsrInfoList_'+val.channelId+'.adasAlarmInfoList.1.confidence.'+val.channelId+'.channel.useless'] = val['adasAlarmInfoList'][1]['confidence'] != this.copyChannelForm['channel_'+val.channelId]['IsApiTsrInfoList']['adasAlarmInfoList'][1]['confidence'] ? `IsApiTsrInfoList_${val['channelId']}.adasAlarmInfoList.1.confidence.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/交通标识识别（TSR）/二级报警/算法置信度&${val['adasAlarmInfoList'][1]['confidence']}` : '';
                            // this.formData['IsApiTsrInfoList_'+val.channelId+'.adasAlarmInfoList.1.sensitivity.'+val.channelId+'.channel.useless'] = val['adasAlarmInfoList'][1]['sensitivity'] != this.copyChannelForm['channel_'+val.channelId]['IsApiTsrInfoList']['adasAlarmInfoList'][1]['sensitivity'] ? `IsApiTsrInfoList_${val['channelId']}.adasAlarmInfoList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/交通标识识别（TSR）/二级报警/算法灵敏度&${val['adasAlarmInfoList'][1]['sensitivity']}` : '';
                            // this.formData['IsApiTsrInfoList_'+val.channelId+'.adasAlarmInfoList.1.snapShotUpload.'+val.channelId+'.channel.useless'] = val['adasAlarmInfoList'][1]['snapShotUpload'] != this.copyChannelForm['channel_'+val.channelId]['IsApiTsrInfoList']['adasAlarmInfoList'][1]['snapShotUpload'] ? `IsApiTsrInfoList_${val['channelId']}.adasAlarmInfoList.1.snapShotUpload.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/交通标识识别（TSR）/二级报警/报警图片上传使能&${val['adasAlarmInfoList'][1]['snapShotUpload']?'开启':'关闭'}` : '';
                            // this.formData['IsApiTsrInfoList_'+val.channelId+'.adasAlarmInfoList.1.clipUpload.'+val.channelId+'.channel.useless'] = val['adasAlarmInfoList'][1]['clipUpload'] != this.copyChannelForm['channel_'+val.channelId]['IsApiTsrInfoList']['adasAlarmInfoList'][1]['clipUpload'] ? `IsApiTsrInfoList_${val['channelId']}.adasAlarmInfoList.1.clipUpload.${val.channelId}.channel.useless&主动安全设置/ADAS/通道${val.channelId}/交通标识识别（TSR）/二级报警/报警视频上传使能&${val['adasAlarmInfoList'][1]['clipUpload']?'开启':'关闭'}` : '';
                        } else {
                            this.formData[
                                "IsApiTsrInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.alarmEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiTsrInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.speedLimit." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiTsrInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.confidence." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiTsrInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            // this.formData['IsApiPcwInfoList.adasAlarmInfoList.0.volume.'+val.channelId+'.channel.useless'] = '';
                            this.formData[
                                "IsApiTsrInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.snapShotUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiTsrInfoList_" +
                                    val.channelId +
                                    ".adasAlarmInfoList.0.clipUpload." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            // this.formData['IsApiTsrInfoList_'+val.channelId+'.adasAlarmInfoList.1.alarmEnabled.'+val.channelId+'.channel.useless'] = '';
                            // this.formData['IsApiTsrInfoList_'+val.channelId+'.adasAlarmInfoList.1.speedLimit.'+val.channelId+'.channel.useless'] = '';
                            // this.formData['IsApiTsrInfoList_'+val.channelId+'.adasAlarmInfoList.1.confidence.'+val.channelId+'.channel.useless'] = '';
                            // this.formData['IsApiTsrInfoList_'+val.channelId+'.adasAlarmInfoList.1.sensitivity.'+val.channelId+'.channel.useless'] = '';
                            // // this.formData['IsApiPcwInfoList.adasAlarmInfoList.1.volume.'+val.channelId+'.channel.useless'] = '';
                            // this.formData['IsApiTsrInfoList_'+val.channelId+'.adasAlarmInfoList.1.snapShotUpload.'+val.channelId+'.channel.useless'] = '';
                            // this.formData['IsApiTsrInfoList_'+val.channelId+'.adasAlarmInfoList.1.clipUpload.'+val.channelId+'.channel.useless'] = '';
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
            notLastVerson: false,
            carbonateVisible: false,
            noneVideoPlay: false,
            deviceCapability: "",
            channelList: [],
            activeChannel: "",
            alarmLevelCopy: 1,
            currentCommandId: "",
            currentIsApiTriggerInfo: "",
            showDeploy: false,
            dialogVisible: false,
            form: {},
            channelForm: {},
            copyChannelForm: {},
            copyForm: {},
            formData: {},
            capabilitiesEmit: {},
            volume: 50,
            everyVolume: false,
            sendEveryVolume: false,
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
                    name: "前车碰撞（FCW）",
                    shortName: "前车碰撞",
                    commandId: "IsApiFcwInfoList",
                    IsApiTriggerInfo: "IsApiFcwTriggerInfo",
                    capability: "IsApiFcwInfoListCapability",
                    alarmLevel: 1,
                },
                {
                    name: "车距过近（HMW）",
                    shortName: "车距过近",
                    commandId: "IsApiHmwInfoList",
                    IsApiTriggerInfo: "IsApiHmwTriggerInfo",
                    capability: "IsApiHmwInfoListCapability",
                    alarmLevel: 1,
                },
                {
                    name: "车道偏离（LDW）",
                    shortName: "车道偏离",
                    commandId: "IsApiLdwInfoList",
                    IsApiTriggerInfo: "IsApiLdwTriggerInfo",
                    capability: "IsApiLdwInfoListCapability",
                    alarmLevel: 1,
                },
                {
                    name: "行人监测（PCW）",
                    shortName: "行人监测",
                    commandId: "IsApiPcwInfoList",
                    IsApiTriggerInfo: "IsApiPcwTriggerInfo",
                    capability: "IsApiPcwInfoListCapability",
                    alarmLevel: 1,
                },
                {
                    name: "交通标识识别（TSR）",
                    shortName: "交通标识识别",
                    commandId: "IsApiTsrInfoList",
                    IsApiTriggerInfo: "IsApiTsrTriggerInfo",
                    capability: "IsApiTsrInfoListCapability",
                    alarmLevel: 1,
                },
            ],
        };
    },
    methods: {
        send() {
            this.everyVolume = true;
            this.sendEveryVolume = true;
            let findFlag = 0;
            for (let i = 0; i < this.tablist.length; i++) {
                let params = {
                    deviceId: this.$route.query.deviceId || null,
                    channelId: this.activeChannel,
                    commandIds: [this.tablist[i].IsApiTriggerInfo],
                };
                if (
                    this.channelForm["channel_" + this.activeChannel][
                        this.tablist[i].IsApiTriggerInfo
                    ]
                ) {
                    this.channelForm["channel_" + this.activeChannel][
                        this.tablist[i].IsApiTriggerInfo
                    ]["adasVolumeInfoList"].forEach((item_) => {
                        item_["volume"] = this.volume;
                    });
                    this.dialogVisible = false;
                } else {
                    this.$api
                        .getDeviceConfigParamsByIsApi(params)
                        .then((res) => {
                            if (res.success == true) {
                                let resData = eval("(" + res.data + ")");
                                this.copyChannelForm[
                                    "channel_" + this.activeChannel
                                ] = Object.assign(
                                    {},
                                    this.copyChannelForm[
                                        "channel_" + this.activeChannel
                                    ],
                                    JSON.parse(JSON.stringify(resData))
                                );
                                this.form = Object.assign(
                                    {},
                                    this.form,
                                    resData
                                );
                                this.channelForm[
                                    "channel_" + this.activeChannel
                                ] = Object.assign(
                                    {},
                                    this.channelForm[
                                        "channel_" + this.activeChannel
                                    ],
                                    resData
                                );
                                console.log(this.channelForm);
                                if (
                                    !this.channelForm[
                                        "channel_" + this.activeChannel
                                    ][this.tablist[i].IsApiTriggerInfo][
                                        "statusCode"
                                    ]
                                ) {
                                    this.channelForm[
                                        "channel_" + this.activeChannel
                                    ][this.tablist[i].IsApiTriggerInfo][
                                        "adasVolumeInfoList"
                                    ].forEach((item_) => {
                                        item_["volume"] = this.volume;
                                    });
                                }
                                this.copyForm = Object.assign(
                                    {},
                                    this.copyForm,
                                    JSON.parse(JSON.stringify(resData))
                                );
                                this.capabilitiesEmit = JSON.parse(res.data)[
                                    this.currentCommandId
                                ];
                                if (i == this.tablist.length - 1) {
                                    this.$message.success(
                                        "全局音量设置成功，请先下发！"
                                    );
                                    this.sendEveryVolume = false;
                                    this.dialogVisible = false;
                                }
                            } else {
                                this.sendEveryVolume = false;
                                this.$message.error(
                                    "获取设备配置参数失败:" + res.msg
                                );
                            }
                        });
                }
            }
        },
        changeAlarmLevel(label, type) {
            if (label.alarmLevel == type) return;
            this.$refs.PublicAdas.validate((valid) => {
                if (!valid) {
                    this.$message.warning("当前表单验证不通过，请先完善！");
                    label.alarmLevel = type == 1 ? 2 : 1;
                } else {
                    label.alarmLevel = type;
                }
            });
        },
        openDialog() {
            this.dialogVisible = true;
        },
        changeChannel(channel) {
            this.activeChannel = channel;
            if (this.isTemplate == "true") {
            } else {
                this.getByIsApi(this.activeName, channel, false);
            }
        },
        //编辑模板时form表单变化
        templateForm() {},
        openSurvey: throttle(function (e) {
            this.dialogClick = true;
            this.carbonateVisible = true;

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
                        this.vanishPoint
                    );
                });
                // console.log(res)
            });
            this.carbonateVisible = true;
        }, 1000),
        SurveyBol() {
            // console.log(this.videoPlayControl);
            this.videoPlayControl.JS_DestroyWnd().then(
                () => {},
                () => {
                    console.log("控件销毁失败");
                }
            );
            this.carbonateVisible = false;
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
                            obj.JS_CreateWnd(id, width, height).then(
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
                                                            //     that.downloadOcx();
                                                            //   },
                                                            //   onCancel: () => { }
                                                            // });
                                                            that.$confirm(
                                                                "当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面。",
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
                                            funcName: "SetADASAreaParams",
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
        beforeLeave(activeName, oldActiveName) {
            this.$refs.PublicAdas.validate((valid) => {
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
            this.volume = 50;
            let params = {
                deviceId: this.$route.query.deviceId || null,
                commandIds: [],
                channelId: channel,
            };
            let findFlag = 0;
            if (tabName == "first") {
                this.currentCommandId = "IsApiAdasGlobal";
                if (this.channelForm["channel_" + channel] == undefined) {
                    params.commandIds.push("IsApiAdasGlobal");
                } else if (
                    this.channelForm["channel_" + channel]["IsApiAdasGlobal"]
                ) {
                    this.form["IsApiAdasGlobal"] =
                        this.channelForm["channel_" + channel][
                            "IsApiAdasGlobal"
                        ];
                } else {
                    params.commandIds.push("IsApiAdasGlobal");
                }
                findFlag++;
            } else {
                this.tablist.forEach((tab) => {
                    if (tab.name == tabName) {
                        console.log(this.copyChannelForm["channel_" + channel]);
                        // console.log(tab.name);
                        // console.log(tab.commandId);
                        if (type) {
                            if (
                                !this.channelForm["channel_" + channel][
                                    "IsApiAdasGlobal"
                                ]
                            ) {
                                params.commandIds.push("IsApiAdasGlobal");
                            } else {
                                this.form["IsApiAdasGlobal"] =
                                    this.channelForm["channel_" + channel][
                                        "IsApiAdasGlobal"
                                    ];
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
                            if (
                                !this.channelForm["channel_" + channel] ||
                                !this.channelForm["channel_" + channel][
                                    "IsApiAdasGlobal"
                                ]
                            ) {
                                params.commandIds.push("IsApiAdasGlobal");
                            } else {
                                this.form["IsApiAdasGlobal"] = JSON.parse(
                                    JSON.stringify(
                                        this.copyChannelForm[
                                            "channel_" + channel
                                        ]["IsApiAdasGlobal"]
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

                        console.log(this.form);
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
            if (!params.commandIds.length) return;
            if (!findFlag) return;
            this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
                if (res.success == true) {
                    // console.log(res.data);
                    let resData = eval("(" + res.data + ")");
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
                    this.showDeploy = true;
                    this.$nextTick(() => {
                        if (!document.querySelector("#title")) {
                            this.$message.info(
                                "获取设备配置异常，请点击“刷新最新配置”"
                            );
                        }
                    });
                } else {
                    this.$message.error("获取设备配置参数失败:" + res.msg);
                }
            });
        },
    },
    mounted() {},
};
</script>

<style lang="less" scoped>
.alarmLevelBox {
    padding-bottom: 8px;
}
.el-switch__label {
    opacity: 0;
}
.prompt {
    display: block;
    width: 36%;
    font-size: 14px;
    color: darkgray;
    margin-top: 10px;
}
</style>
