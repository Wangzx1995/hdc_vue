<template>
    <div class="agreement-config p-a-md">
        <el-dialog
            title="输入密码解锁"
            :visible.sync="unlockBol"
            :width="'600px'"
            @close="unlockClose"
        >
            <div class="passwordBox">
                <el-input
                    v-model="checkPassword"
                    :type="passwordType"
                    prefix-icon="el-icon-lock"
                    placeholder="请输入密码解锁"
                    autoComplete="on"
                >
                    <i
                        slot="suffix"
                        class="el-input__icon"
                        style="margin-top: 2px"
                        :class="passwordIcon"
                        @mousedown="onMousedownClick"
                        @mouseup="onMouseupClick"
                    ></i>
                </el-input>
            </div>
            <span slot="footer">
                <el-button type="default" @click="unlockClose">取消</el-button>
                <el-button type="primary" @click="unlockSure">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="下发至终端"
            :visible.sync="updateBol"
            :width="'600px'"
            @close="close"
        >
            <p class="fontWeight">
                您修改的{{ dataList.length }}项配置将下发至终端
            </p>
            <ul style="height: 500px; overflow-y: auto">
                <li v-for="(item, index) in dataList" :key="index">
                    <el-row>
                        <el-col :span="23"
                            ><div class="deleteItem">
                                {{
                                    `${index + 1}、${item[1]}: 修改为 ${
                                        item[2]
                                    }`
                                }}
                            </div></el-col
                        >
                        <el-col :span="1"
                            ><i
                                @click="deleteItem(item, index)"
                                class="el-icon-close deleteBtn"
                            ></i
                        ></el-col>
                    </el-row>
                </li>
            </ul>
            <span slot="footer">
                <el-button type="default" @click="close">取消</el-button>
                <el-button
                    :disabled="!dataList.length"
                    type="primary"
                    @click="updateSure"
                    >确定</el-button
                >
            </span>
        </el-dialog>
        <el-dialog
            title="选择存为模板的模块"
            :top="5 + '%'"
            :visible.sync="moubleBol"
            :width="'1200px'"
            @close="closeMouble"
        >
            <div>
                <p>车辆设备</p>
                <el-row
                    type="flex"
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiApnInfo')"
                            v-if="moubleJson['isApiApnInfo'] != undefined"
                            v-model="moubleJson['isApiApnInfo']"
                            >注册参数/APN</el-checkbox
                        >
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiRegisterInfo')"
                            v-if="moubleJson['isApiRegisterInfo'] != undefined"
                            v-model="moubleJson['isApiRegisterInfo']"
                            >车辆信息/注册信息</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiVehicleRecord')"
                            v-if="moubleJson['isApiVehicleRecord'] != undefined"
                            v-model="moubleJson['isApiVehicleRecord']"
                            >车辆信息/车辆记录</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiDriverCard')"
                            v-if="moubleJson['isApiDriverCard'] != undefined"
                            v-model="moubleJson['isApiDriverCard']"
                            >车辆信息/IC卡写卡</el-checkbox
                        >
                    </el-col> -->
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiShutdownCfgInfo')"
                            v-if="
                                moubleJson['isApiShutdownCfgInfo'] != undefined
                            "
                            v-model="moubleJson['isApiShutdownCfgInfo']"
                            >延时关机时间</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiAlarmAudioInfo')"
                            v-if="
                                moubleJson['isApiAlarmAudioInfo'] != undefined
                            "
                            v-model="moubleJson['isApiAlarmAudioInfo']"
                            >音量设置/报警音频</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiSysAudioInfo')"
                            v-if="moubleJson['isApiSysAudioInfo'] != undefined"
                            v-model="moubleJson['isApiSysAudioInfo']"
                            >音量设置/系统音频</el-checkbox
                        >
                    </el-col>
                </el-row>
                <p>多中心设置</p>
                <el-row
                    type="flex"
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiPlatform')"
                            v-if="moubleJson['isApiPlatform'] != undefined"
                            v-model="moubleJson['isApiPlatform']"
                            >多中心</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6"></el-col>
                    <el-col :span="6"></el-col>
                    <el-col :span="6"></el-col>
                </el-row>
                <p>主动安全设置</p>
                <el-row
                    type="flex"
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiAdasGlobal',
                                    '',
                                    adasChannel
                                )
                            "
                            v-if="moubleJson['isApiAdasGlobal'] != undefined"
                            v-model="moubleJson['isApiAdasGlobal']"
                            >ADAS/ADAS全局设置</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiFcwInfoList',
                                    'IsApiFcwTriggerInfo',
                                    adasChannel
                                )
                            "
                            v-if="moubleJson['isApiFcwInfoList'] != undefined"
                            v-model="moubleJson['isApiFcwInfoList']"
                            >ADAS/前车碰撞（FCW）</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiHmwInfoList',
                                    'IsApiHmwTriggerInfo',
                                    adasChannel
                                )
                            "
                            v-if="moubleJson['isApiHmwInfoList'] != undefined"
                            v-model="moubleJson['isApiHmwInfoList']"
                            >ADAS/车距过近（HMW）</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiLdwInfoList',
                                    'IsApiLdwTriggerInfo',
                                    adasChannel
                                )
                            "
                            v-if="moubleJson['isApiLdwInfoList'] != undefined"
                            v-model="moubleJson['isApiLdwInfoList']"
                            >ADAS/车道偏离（LDW）</el-checkbox
                        >
                    </el-col>
                </el-row>
                <el-row
                    type="flex"
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiPcwInfoList',
                                    'IsApiPcwTriggerInfo',
                                    adasChannel
                                )
                            "
                            v-if="moubleJson['isApiPcwInfoList'] != undefined"
                            v-model="moubleJson['isApiPcwInfoList']"
                            >ADAS/行人监测（PCW）</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiTsrInfoList',
                                    'IsApiTsrTriggerInfo',
                                    adasChannel
                                )
                            "
                            v-if="moubleJson['isApiTsrInfoList'] != undefined"
                            v-model="moubleJson['isApiTsrInfoList']"
                            >ADAS/交通标识识别（TSR）</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6"></el-col>
                    <el-col :span="6"></el-col>
                </el-row>
                <el-row
                    type="flex"
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate('IsApiDBAGlobal', '', dbaChannel)
                            "
                            v-if="moubleJson['isApiDBAGlobal'] != undefined"
                            v-model="moubleJson['isApiDBAGlobal']"
                            >DBA/DBA全局配置</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiDriverEyeClosedInfo',
                                    'IsApiDriverEyeClosedTriggerList',
                                    dbaChannel
                                )
                            "
                            v-if="
                                moubleJson['isApiDriverEyeClosedInfo'] !=
                                undefined
                            "
                            v-model="moubleJson['isApiDriverEyeClosedInfo']"
                            >DBA/疲劳驾驶</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiDriverCallingInfo',
                                    'IsApiDriverCallingTriggerList',
                                    dbaChannel
                                )
                            "
                            v-if="
                                moubleJson['isApiDriverCallingInfo'] !=
                                undefined
                            "
                            v-model="moubleJson['isApiDriverCallingInfo']"
                            >DBA/打电话</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiDriverSmokingInfo',
                                    'IsApiDriverSmokingTriggerList',
                                    dbaChannel
                                )
                            "
                            v-if="
                                moubleJson['isApiDriverSmokingInfo'] !=
                                undefined
                            "
                            v-model="moubleJson['isApiDriverSmokingInfo']"
                            >DBA/抽烟</el-checkbox
                        >
                    </el-col>
                </el-row>
                <el-row
                    type="flex"
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiDriverInattentionInfo',
                                    'IsApiDriverInattentionTriggerList',
                                    dbaChannel
                                )
                            "
                            v-if="
                                moubleJson['isApiDriverInattentionInfo'] !=
                                undefined
                            "
                            v-model="moubleJson['isApiDriverInattentionInfo']"
                            >DBA/注意力不集中</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiDriverAbsentedInfo',
                                    'IsApiDriverAbsentedTriggerList',
                                    dbaChannel
                                )
                            "
                            v-if="
                                moubleJson['isApiDriverAbsentedInfo'] !=
                                undefined
                            "
                            v-model="moubleJson['isApiDriverAbsentedInfo']"
                            >DBA/驾驶员离岗</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiDriverBlockCameraInfo',
                                    'IsApiDriverBlockCameraTriggerList',
                                    dbaChannel
                                )
                            "
                            v-if="
                                moubleJson['isApiDriverBlockCameraInfo'] !=
                                undefined
                            "
                            v-model="moubleJson['isApiDriverBlockCameraInfo']"
                            >DBA/摄像头遮挡</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiDriverSafetyBeltInfo',
                                    'IsApiDriverSafetyBeltTriggerList',
                                    dbaChannel
                                )
                            "
                            v-if="
                                moubleJson['isApiDriverSafetyBeltInfo'] !=
                                undefined
                            "
                            v-model="moubleJson['isApiDriverSafetyBeltInfo']"
                            >DBA/未系安全带</el-checkbox
                        >
                    </el-col>
                </el-row>
                <el-row
                    type="flex"
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiDriverSunglassesInfo',
                                    'IsApiDriverSunglassesTriggerList',
                                    dbaChannel
                                )
                            "
                            v-if="
                                moubleJson['isApiDriverSunglassesInfo'] !=
                                undefined
                            "
                            v-model="moubleJson['isApiDriverSunglassesInfo']"
                            >DBA/墨镜</el-checkbox
                        >
                    </el-col>
                    <!-- <el-col :span="6">
            <el-checkbox @change="changeTemplate('IsApiRapidAccelerationInfo','IsApiRapidAccelerationTriggerList',dbaChannel)" v-if="moubleJson['isApiRapidAccelerationInfo'] != undefined" v-model="moubleJson['isApiRapidAccelerationInfo']">DBA/急加速</el-checkbox>
          </el-col>
          <el-col :span="6">
            <el-checkbox @change="changeTemplate('IsApiRapidDecelerationInfo','IsApiRapidDecelerationTriggerList',dbaChannel)" v-if="moubleJson['isApiRapidDecelerationInfo'] != undefined" v-model="moubleJson['isApiRapidDecelerationInfo']">DBA/急减速</el-checkbox>
          </el-col>
          <el-col :span="6">
            <el-checkbox @change="changeTemplate('IsApiRapidTurnInfo','IsApiRapidTurnTriggerList',dbaChannel)" v-if="moubleJson['isApiRapidTurnInfo'] != undefined" v-model="moubleJson['isApiRapidTurnInfo']">DBA/急转弯</el-checkbox>
          </el-col> -->
                </el-row>
                <!-- <el-row type="flex" justify="space-between" style="margin-top: 10px;">
          <el-col :span="6">
            <el-checkbox @change="changeTemplate('IsApiDriverAbnormaInfo','IsApiDriverAbnormaTriggerList',dbaChannel)" v-if="moubleJson['isApiDriverAbnormaInfo'] != undefined" v-model="moubleJson['isApiDriverAbnormaInfo']">DBA/驾驶员异常</el-checkbox>
          </el-col>
          <el-col :span="6">
            <el-checkbox @change="changeTemplate('IsApiDriveTimeInfo','IsApiDriveTimeTriggerList',dbaChannel)" v-if="moubleJson['isApiDriveTimeInfo'] != undefined" v-model="moubleJson['isApiDriveTimeInfo']">DBA/驾驶超时</el-checkbox>
          </el-col>
          <el-col :span="6">
            <el-checkbox @change="changeTemplate('IsApiDriveChangeInfo','IsApiDriveChangeTriggerList',dbaChannel)" v-if="moubleJson['isApiDriveChangeInfo'] != undefined" v-model="moubleJson['isApiDriveChangeInfo']">DBA/换人事件</el-checkbox>
          </el-col>
          <el-col :span="6"></el-col>
        </el-row> -->
                <el-row
                    type="flex"
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiBsdInfo',
                                    'IsApiBsdTriggerList',
                                    bsdChannel
                                )
                            "
                            v-if="moubleJson['isApiBsdInfo'] != undefined"
                            v-model="moubleJson['isApiBsdInfo']"
                            >BSD/右侧盲区</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6"></el-col>
                    <el-col :span="6"></el-col>
                    <el-col :span="6"></el-col>
                </el-row>
                <el-row
                    type="flex"
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate('IsApiWhdInfo', '', whdChannel)
                            "
                            v-if="moubleJson['isApiWhdInfo'] != undefined"
                            v-model="moubleJson['isApiWhdInfo']"
                            >WHD/玩手机/WHD全局标定检测区域</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiWhdNoHandInfo',
                                    'IsApiWhdNoHandTriggerList',
                                    whdChannel
                                )
                            "
                            v-if="moubleJson['isApiWhdNoHandInfo'] != undefined"
                            v-model="moubleJson['isApiWhdNoHandInfo']"
                            >WHD/玩手机/双手WHD</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiWhdSingleHandInfo',
                                    'IsApiWhdSingleHandTriggerList',
                                    whdChannel
                                )
                            "
                            v-if="
                                moubleJson['isApiWhdSingleHandInfo'] !=
                                undefined
                            "
                            v-model="moubleJson['isApiWhdSingleHandInfo']"
                            >WHD/玩手机/单手WHD</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    'IsApiWhdPlayMobilePhoneInfo',
                                    'IsApiWhdPlayMobilePhoneTriggerList',
                                    whdChannel
                                )
                            "
                            v-if="
                                moubleJson['isApiWhdPlayMobilePhoneInfo'] !=
                                undefined
                            "
                            v-model="moubleJson['isApiWhdPlayMobilePhoneInfo']"
                            >WHD/玩手机/玩手机</el-checkbox
                        >
                    </el-col>
                </el-row>
                <p>图像视频设置</p>
                <el-row
                    type="flex"
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiVideoInfo')"
                            v-if="moubleJson['isApiVideoInfo'] != undefined"
                            v-model="moubleJson['isApiVideoInfo']"
                            >视频设置</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6"></el-col>
                    <el-col :span="6"></el-col>
                    <el-col :span="6"></el-col>
                </el-row>
                <p>报警设置</p>
                <el-row
                    type="flex"
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiSpeedingOthers')"
                            v-if="
                                moubleJson['isApiSpeedingOthers'] != undefined
                            "
                            v-model="moubleJson['isApiSpeedingOthers']"
                            >超速报警</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate('IsApiFatigueDrivingOthers')
                            "
                            v-if="
                                moubleJson['isApiFatigueDrivingOthers'] !=
                                undefined
                            "
                            v-model="moubleJson['isApiFatigueDrivingOthers']"
                            >疲劳驾驶</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6"></el-col>
                    <el-col :span="6"></el-col>
                </el-row>
                <p>外设输出设置</p>
                <el-row
                    type="flex"
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiSerialInfo')"
                            v-if="moubleJson['isApiSerialInfo'] != undefined"
                            v-model="moubleJson['isApiSerialInfo']"
                            >声光报警器</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <!-- <el-checkbox @change="changeTemplate('IsApiProgramMgrInfo')" v-if="moubleJson['isApiProgramMgrInfo'] != undefined && (json['isApiSensorInInfoCapability'] == false || json['isApiSensorInInfoCapability'] == undefined)" v-model="moubleJson['isApiProgramMgrInfo']">视频输出设置</el-checkbox>
            <el-checkbox @change="changeTemplate('IsApiSensorInInfoCapability')" v-if="moubleJson['isApiSensorInInfoCapability'] != undefined" v-model="moubleJson['isApiSensorInInfoCapability']">视频输出设置</el-checkbox> -->
                    </el-col>
                    <el-col :span="6"></el-col>
                    <el-col :span="6"></el-col>
                </el-row>
                <p>渣土车配置</p>
                <el-row
                    type="flex"
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiZtWorkMode')"
                            v-if="moubleJson['isApiZtWorkMode'] != undefined"
                            v-model="moubleJson['isApiZtWorkMode']"
                            >工作模式</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiZtInvalidAlarm')"
                            v-if="
                                moubleJson['isApiZtInvalidAlarm'] != undefined
                            "
                            v-model="moubleJson['isApiZtInvalidAlarm']"
                            >业务报警</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiZtTcss')"
                            v-if="moubleJson['isApiZtTcss'] != undefined"
                            v-model="moubleJson['isApiZtTcss']"
                            >货箱状态</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiZtLed')"
                            v-if="moubleJson['isApiZtLed'] != undefined"
                            v-model="moubleJson['isApiZtLed']"
                            >外屏参数</el-checkbox
                        >
                    </el-col>
                </el-row>
                <el-row
                    type="flex"
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiZtVehctrl')"
                            v-if="moubleJson['isApiZtVehctrl'] != undefined"
                            v-model="moubleJson['isApiZtVehctrl']"
                            >控车参数</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiZtScreenCtrl')"
                            v-if="moubleJson['isApiZtScreenCtrl'] != undefined"
                            v-model="moubleJson['isApiZtScreenCtrl']"
                            >安卓屏控制</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiZtGsensor')"
                            v-if="moubleJson['isApiZtGsensor'] != undefined"
                            v-model="moubleJson['isApiZtGsensor']"
                            >路口报警</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('IsApiZtEcuProtocol')"
                            v-if="moubleJson['isApiZtEcuProtocol'] != undefined"
                            v-model="moubleJson['isApiZtEcuProtocol']"
                            >发动机控车</el-checkbox
                        >
                    </el-col>
                </el-row>
            </div>
            <span slot="footer">
                <el-button type="default" @click="closeMouble">取消</el-button>
                <el-button
                    type="primary"
                    @click="prepareOk"
                    :disabled="
                        isapiBol1 ||
                        isapiBol2 ||
                        isapiBol3 ||
                        isapiBol4 ||
                        isapiBol5 ||
                        isapiBol6 ||
                        isapiBol7
                    "
                    >选好了</el-button
                >
            </span>
        </el-dialog>
        <h2>版本信息</h2>
        <el-form label-position="top" label-width="120px">
            <el-row>
                <el-col :span="4">
                    <el-form-item label="更新时间">
                        <template slot="label">
                            更新时间
                            <el-tooltip
                                content="设备最后一次进行协议配置的时间"
                                placement="top"
                            >
                                <span>
                                    <i class="el-icon-question"></i>
                                </span>
                            </el-tooltip>
                        </template>
                        <span>{{
                            (deviceInfo.deviceParamLastTimeVo &&
                                deviceInfo.deviceParamLastTimeVo
                                    .protocolLastOne &&
                                deviceInfo.deviceParamLastTimeVo.protocolLastOne
                                    .time) ||
                            "--"
                        }}</span>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="4">
            <el-form-item label="协议类型">
              <span>{{deviceInfo.protocolName || '--'}}</span>
            </el-form-item>
          </el-col> -->
                <el-col :span="4">
                    <el-form-item label="设备状态">
                        <el-tag
                            type="success"
                            v-if="deviceInfo.deviceStatus === 1"
                            >在线</el-tag
                        >
                        <el-tag
                            type="warning"
                            v-else-if="
                                deviceInfo.deviceStatus === 2 &&
                                deviceInfo.dormantStatus == 2
                            "
                            >休眠</el-tag
                        >
                        <span
                            class="littleYellow"
                            v-else-if="
                                deviceInfo.deviceStatus === 2 &&
                                deviceInfo.dormantStatus != 2
                            "
                            >休眠</span
                        >
                        <el-tag
                            type="info"
                            v-else-if="deviceInfo.deviceStatus === 0"
                            >离线</el-tag
                        >
                        <span v-else>--</span>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="">
                        <!-- <div class="no-config"> -->
                        <el-button
                            icon="el-icon-refresh"
                            type="primary"
                            :disabled="configParams"
                            @click="getDeviceConfigParams(isApiDeciveBol)"
                            >{{
                                configParams ? "正在获取中…" : "刷新最新配置"
                            }}</el-button
                        >
                        <!-- <a @click="openDialog">未获取到？</a> -->
                        <!-- </div> -->
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="">
                        <el-tooltip
                            content="若近期有更换过终端手机号，或下发配置后，导致设备能力发生变化，请重新获取镜像参数更新！"
                            placement="top"
                        >
                            <el-button
                                icon="el-icon-warning"
                                @click="touchImageTask"
                            >
                                获取镜像参数
                            </el-button>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <h2>设备配置详情</h2>
        <!-- <template v-if="JSON.stringify(initData) == '{}'">
        <EmptyBox>
          <p slot="description" class="text-md">获取失败，请在设备在线时点击“刷新最新配置”按键获取设备配置详情～</p>
        </EmptyBox>
      </template>
      <template v-else> -->
        <el-alert
            title="协议配置下发时，设备必须为在线状态才可以下发配置。"
            type="info"
            simple
            show-icon
            class="m-y-sm"
        ></el-alert>
        <!-- <el-button type="primary" class="m-y-sm" @click="saveTemp(1)">存至模版</el-button> -->
        <el-row layout v-show="getDataSuccess" class="configuration-module">
            <el-col :span="4">
                <el-menu
                    :default-active="componentName"
                    class="menu-vertical"
                    unique-opened
                    ref="menu"
                >
                    <el-submenu
                        v-for="item in sideBarItem"
                        v-bind:key="item.index"
                        :index="item.index"
                    >
                        <span slot="title">{{ item.title }}</span>
                        <el-menu-item
                            :index="i.value"
                            v-for="i in item.children"
                            v-bind:key="i.index"
                            @click="changeLabel(i)"
                            >{{ i.label }}</el-menu-item
                        >
                    </el-submenu>
                </el-menu>
            </el-col>
            <el-col :span="20">
                <div class="configuration-detail-content">
                    <div v-if="true" class="configuration-detail-item">
                        <component
                            :menuJson="json"
                            @changeCopyChannel="getCopyChannel"
                            :postChannelData="copyChannelData"
                            @changeChannels="getChannel"
                            :postChannel="channelForm"
                            @changeData="changeData"
                            @aesEncrypt="aesEncrypt"
                            :nowCommandId="currentAdasCommandId"
                            :formDetail="formDatas"
                            @getActiveName="getActiveName"
                            :componentName="componentName"
                            :allCopyData="copyData"
                            :is="componentName"
                            :everyVolumeBol="everyVolumeBol"
                            :configParams="configParams"
                            :centerHasIot="hasIotHikvision"
                            :detail="initData"
                            :deviceCapabilities="deviceCapability"
                            @everyVolume="everyVolumeChange"
                            @capabilitiesEmit="capabilitiesEmit"
                            @change="changeVal"
                            @changeCopy="changeCopy"
                            v-if="detailShow"
                            ref="component"
                            @send="sendProtocol"
                            @adasCommandId="adasCommandId"
                            @currentIsApiTriggerInfos="currentIsApiTriggerInfos"
                            @currentCenter="currentCenter"
                            @getOthers="getOthers"
                        ></component>
                    </div>
                    <!--<div class="configuration-detail-submit p-y-sm p-x-md">
                <p style="display: inline-block">您已选择配置项“{{chooseItem}}”
                        <el-tooltip
                            class="item"
                            :content="msg"
                            placement="right-start"
                        >
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                </p>
                <div>
                  <el-button type="default" @click="goBack">返回</el-button>
                  <el-button type="default" @click="saveTemp(2)" :disabled="saveTemplateDisable">存至模版</el-button>
                  <el-button type="primary" @click="sendProtocol" :disabled="configParams">下发至终端</el-button>
                </div>
              </div>-->
                </div>
            </el-col>
        </el-row>

        <div class="configuration-detail-submit p-y-sm p-x-md">
            <el-popover
                ref="popover2"
                placement="top"
                width="500"
                trigger="click"
            >
                <p class="fontWeight">配置修改项({{ dataList.length }})</p>
                <div>
                    <el-scrollbar wrap-class="demo-scrollbar-wrap-2">
                        <ul style="padding-right: 10px">
                            <li v-for="(item, index) in dataList" :key="index">
                                <el-row>
                                    <el-col :span="23"
                                        ><div class="deleteItem">
                                            {{
                                                `${index + 1}、${
                                                    item[1]
                                                }: 修改为 ${item[2]}`
                                            }}
                                        </div></el-col
                                    >
                                    <el-col :span="1"
                                        ><i
                                            @click="deleteItem(item, index)"
                                            class="el-icon-close deleteBtn"
                                        ></i
                                    ></el-col>
                                </el-row>
                            </li>
                        </ul>
                    </el-scrollbar>
                </div>
            </el-popover>
            <div style="margin-left: auto">
                <p
                    v-show="isApiDeciveBols"
                    v-popover:popover2
                    style="
                        display: inline-block;
                        margin-right: 10px;
                        cursor: pointer;
                    "
                >
                    您已修改&nbsp;<span
                        style="color: red; font-weight: 600; font-size: 16px"
                        >{{ dataList.length }}</span
                    >&nbsp;项配置<i class="el-icon-arrow-down"></i>
                </p>
                <p v-show="!isApiDeciveBols" style="display: inline-block">
                    您已选择配置项“{{ chooseItem }}”
                    <el-tooltip
                        class="item"
                        :content="msg"
                        placement="top-start"
                    >
                        <i style="font-size: 16px" class="el-icon-question" />
                    </el-tooltip>
                </p>
                <p style="display: inline-block">
                    <el-button type="default" @click="goBack">返回</el-button>
                    <el-button
                        type="default"
                        @click="saveTemp(2)"
                        :disabled="saveTemplateDisable"
                        >存至模版</el-button
                    >
                    <el-button
                        type="primary"
                        @click="sendProtocol"
                        :disabled="
                            configParams || JSON.stringify(initData) == '{}'
                        "
                        >下发至终端</el-button
                    >
                </p>
            </div>
        </div>
        <!-- </template> -->

        <SaveTemplate
            :visible.sync="templateVisible"
            @submit="submitTemp"
            @showMouble="showMoubleContent"
        ></SaveTemplate>
    </div>
</template>
<script>
import AES from "@/utils/secret";
import EmptyBox from "@/components/coreManage/emptyBox";
import SaveTemplate from "@/components/coreManage/saveTemplate";
import VehicleRegistration from "./components/vehicle/registration";
import VehicleDeviceSetting from "./components/vehicle/deviceSetting";
import VehicleInfo from "./components/vehicle/vehicleInfo";
import VehicleTerminalLink from "./components/vehicle/terminalLink";
import VehicleCANsetting from "./components/vehicle/CANsetting";
import CallBarring from "./components/telephoneMonitor/callBarring";
import TeleNumber from "./components/telephoneMonitor/teleNumber";
import DataUp from "./components/gnssSettings/dataUp";
import GnssSetting from "./components/gnssSettings/gnssSetting";
import Params from "./components/audioVedioSettings/params";
import ChannelList from "./components/audioVedioSettings/channelList";
import ChannelParams from "./components/audioVedioSettings/channelParams";
import VedioParams from "./components/audioVedioSettings/vedioParams";
import AlarmAbility from "./components/audioVedioSettings/alarmAbility";
import ALarmParams from "./components/audioVedioSettings/aLarmParams";
import WakeupMode from "./components/audioVedioSettings/wakeupMode";
import BasicSetting from "./components/locateUpload/basicSetting";
import IntervalSetting from "./components/locateUpload/intervalSetting";
import Service from "./components/serviceSettings/service";
import AuthenticateIC from "./components/serviceSettings/authenticateIC";
import SecService from "./components/serviceSettings/secService";
import DiskFormat from "./components/storageSettings/diskFormat";
import BasicAlarm from "./components/alarmSettings/basicAlarm";
import Violation from "./components/alarmSettings/violation";
import Overspeed from "./components/alarmSettings/overspeed";
import FatigueDriving from "./components/alarmSettings/fatigueDriving";
import Crash from "./components/alarmSettings/crash";
import AlarmVolumn from "./components/alarmSettings/alarmVolumn";
import Elefence from "./components/alarmSettings/elefence";
import Adas from "./components/safeSettings/adas";
import Dsm from "./components/safeSettings/dsm";
import Bsd from "./components/safeSettings/bsd";
import TirePressure from "./components/safeSettings/tirePressure";
import AngularVelocity from "./components/safeSettings/angularVelocity";
import PreviewSetting from "./components/imageVideo/previewSetting";
import CaptureSetting from "./components/imageVideo/captureSetting";
import Ipc from "./components/imageVideo/ipc";
import VedioSetting from "./components/imageVideo/vedioSetting";
import CvbsParams from "./components/imageVideo/cvbsParams";
import ManyCenter from "./components/manyCenter/manyCenter";
import PraviteAdas from "./components/safePraviteSettings/adas";
import PraviteDba from "./components/safePraviteSettings/dba";
import PraviteBsd from "./components/safePraviteSettings/bsd";
import PublicAdas from "./components/safePublicSetting/adas";
import PublicDba from "./components/safePublicSetting/dba";
import PublicBsd from "./components/safePublicSetting/bsd";
// import PublicWhd from './components/safePublicSetting/whd.vue'
import PublicVehicleRegistration from "./components/vehiclePublic/registration";
import PublicVehicleDeviceSetting from "./components/vehiclePublic/deviceSetting";
import PublicVehicleInfo from "./components/vehiclePublic/vehicleInfo";
import PublicVehicleTerminalLink from "./components/vehiclePublic/terminalLink";
import PublicVehicleCANsetting from "./components/vehiclePublic/CANsetting";
import PublicShutDown from "./components/vehiclePublic/shutDown";
import PublicVolume from "./components/vehiclePublic/volume";
import PublicCallBarring from "./components/telephoneMonitorPublic/callBarring";
import PublicTeleNumber from "./components/telephoneMonitorPublic/teleNumber";
import PublicDataUp from "./components/gnssSettingsPublic/dataUp";
import PublicGnssSetting from "./components/gnssSettingsPublic/gnssSetting";
import PublicParams from "./components/audioVedioSettingsPublic/params";
import PublicChannelList from "./components/audioVedioSettingsPublic/channelList";
import PublicChannelParams from "./components/audioVedioSettingsPublic/channelParams";
import PublicVedioParams from "./components/audioVedioSettingsPublic/vedioParams";
import PublicAlarmAbility from "./components/audioVedioSettingsPublic/alarmAbility";
import PublicALarmParams from "./components/audioVedioSettingsPublic/aLarmParams";
import PublicWakeupMode from "./components/audioVedioSettingsPublic/wakeupMode";
import PublicBasicSetting from "./components/locateUploadPublic/basicSetting";
import PublicIntervalSetting from "./components/locateUploadPublic/intervalSetting";
import PublicService from "./components/serviceSettingsPublic/service";
import PublicAuthenticateIC from "./components/serviceSettingsPublic/authenticateIC";
import PublicSecService from "./components/serviceSettingsPublic/secService";
// import PublicApn from './components/serviceSettingsPublic/apn'
import PublicDiskFormat from "./components/storageSettingsPublic/diskFormat";
import PublicBasicAlarm from "./components/alarmSettingsPublic/basicAlarm";
import PublicViolation from "./components/alarmSettingsPublic/violation";
import PublicOverspeed from "./components/alarmSettingsPublic/overspeed";
import PublicFatigueDriving from "./components/alarmSettingsPublic/fatigueDriving";
import PublicCrash from "./components/alarmSettingsPublic/crash";
import PublicAlarmVolumn from "./components/alarmSettingsPublic/alarmVolumn";
import PublicElefence from "./components/alarmSettingsPublic/elefence";
import AdasPublic from "./components/safeSettingsPublic/adas";
import DsmPublic from "./components/safeSettingsPublic/dsm";
import BsdPublic from "./components/safeSettingsPublic/bsd";
import WhdPublic from "./components/safePublicSetting/whd";
import TirePressurePublic from "./components/safeSettingsPublic/tirePressure";
import AngularVelocityPublic from "./components/safeSettingsPublic/angularVelocity";
import PublicPreviewSetting from "./components/imageVideoPublic/previewSetting";
import PublicCaptureSetting from "./components/imageVideoPublic/captureSetting";
import PublicIpc from "./components/imageVideoPublic/ipc";
import PublicVedioSetting from "./components/imageVideoPublic/vedioSetting";
import PublicCvbsParams from "./components/imageVideoPublic/cvbsParams";
import firstCenterPublic from "./components/manyCenterPublic/firstCenter";
import secondCenterPublic from "./components/manyCenterPublic/secondCenter";
import thirdCenterPublic from "./components/manyCenterPublic/thirdCenter";
import forthCenterPublic from "./components/manyCenterPublic/forthCenter";
import fifthCenterPublic from "./components/manyCenterPublic/fifthCenter.vue";
import sixthCenterPublic from "./components/manyCenterPublic/sixthCenter";
import PublicManyCenter from "./components/manyCenterPublic/manyCenter";
import PublicSerial from "./components/outerSettingPublic/serial";
import PublicProgramMgr from "./components/outerSettingPublic/programMgr";
import PublicWorkMode from "./components/muckCarPublic/workMode";
import PublicVehctrl from "./components/muckCarPublic/vehctrl";
import PublicTcss from "./components/muckCarPublic/tcss";
import PublicLed from "./components/muckCarPublic/led";
import PublicInvalidAlarm from "./components/muckCarPublic/invalidAlarm";
import PublicGsensor from "./components/muckCarPublic/gsensor";
import PublicCtrl from "./components/muckCarPublic/ctrl";
import PublicEcu from "./components/muckCarPublic/ecu";
import PublicVideo from "./components/pictureVideoPublic/video";
export default {
    props: {
        isApiDeciveBols: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        EmptyBox,
        SaveTemplate,
        VehicleRegistration,
        VehicleDeviceSetting,
        VehicleInfo,
        VehicleTerminalLink,
        VehicleCANsetting,
        CallBarring,
        TeleNumber,
        DataUp,
        GnssSetting,
        Params,
        ChannelList,
        ChannelParams,
        VedioParams,
        AlarmAbility,
        ALarmParams,
        WakeupMode,
        BasicSetting,
        //车辆参数不需要模板
        IntervalSetting,
        Service,
        AuthenticateIC,
        SecService,
        DiskFormat,
        BasicAlarm,
        Violation,
        Overspeed,
        FatigueDriving,
        Crash,
        AlarmVolumn,
        Elefence,
        Adas,
        PreviewSetting,
        Dsm,
        Bsd,
        TirePressure,
        AngularVelocity,
        CaptureSetting,
        Ipc,
        VedioSetting,
        CvbsParams,
        ManyCenter,
        PraviteAdas,
        PraviteDba,
        PraviteBsd,
        PublicAdas,
        PublicDba,
        PublicBsd,
        WhdPublic,
        PublicVehicleRegistration,
        PublicVehicleDeviceSetting,
        PublicVehicleInfo,
        PublicVehicleTerminalLink,
        PublicVehicleCANsetting,
        PublicShutDown,
        PublicVolume,
        PublicCallBarring,
        PublicTeleNumber,
        PublicDataUp,
        PublicGnssSetting,
        PublicParams,
        PublicChannelList,
        PublicChannelParams,
        PublicVedioParams,
        PublicAlarmAbility,
        PublicALarmParams,
        PublicWakeupMode,
        PublicBasicSetting,
        PublicIntervalSetting,
        PublicService,
        PublicAuthenticateIC,
        PublicSecService,
        PublicDiskFormat,
        // PublicApn,
        PublicBasicAlarm,
        PublicViolation,
        PublicOverspeed,
        PublicFatigueDriving,
        PublicCrash,
        PublicAlarmVolumn,
        PublicElefence,
        AdasPublic,
        DsmPublic,
        BsdPublic,
        TirePressurePublic,
        AngularVelocityPublic,
        PublicPreviewSetting,
        PublicCaptureSetting,
        PublicIpc,
        PublicVedioSetting,
        PublicCvbsParams,
        PublicManyCenter,
        firstCenterPublic,
        secondCenterPublic,
        thirdCenterPublic,
        forthCenterPublic,
        fifthCenterPublic,
        sixthCenterPublic,
        PublicSerial,
        PublicProgramMgr,
        PublicWorkMode,
        PublicVehctrl,
        PublicTcss,
        PublicLed,
        PublicInvalidAlarm,
        PublicGsensor,
        PublicCtrl,
        PublicEcu,
        PublicVideo,
    },
    data() {
        return {
            updateBol: false,
            moubleBol: false,
            unlockBol: false,
            deviceCapability: "",
            Others: {},
            msg: `点击“下发至终端”按键仅下发选择的配置项`,
            activeNameProgramMgr: "",
            aesPassword: "",
            configParams: false,
            saveTemplateType: 1,
            templateVisible: false,
            detailShow: false,
            type: "1",
            componentName: "",
            componentCommandIdList: ["0081", "0082", "0083", "0084"],
            componentTriggerInfo: [],
            capabilityList: [],
            deviceInfo: {},
            // 初始化data
            initData: {},
            tempalteData: {},
            formDatas: {}, //保存已修改的配置项
            copyData: {}, //保存获取设备配置的原始参数
            dataList: [], //展示已改变的配置项
            dataListMoubles: {}, //保存模板数据
            moubleJson: {}, //保存模板json对象中的key
            copyMoubleJson: {},
            moubleMenu: [], //保存模板菜单
            channelForm: {}, //保存通道号配置参数
            copyChannelData: {}, //保存从设备获取的带有通道号的原始参数
            hasIotHikvision: null,
            capabilitiesEmits: "",
            isApiDeciveBol: false,
            getDataSuccess: false,
            sideBarItem: [],
            adasChannel: [],
            dbaChannel: [],
            bsdChannel: [],
            whdChannel: [],
            sideBarItem1: [
                {
                    title: "车辆设备",
                    index: "1",
                    children: [
                        {
                            label: "注册参数",
                            value: "VehicleRegistration",
                            commandIdList: ["0081", "0082", "0083", "0084"],
                        },
                        // {
                        //   label: '设备设置',
                        //   value: 'VehicleDeviceSetting',
                        //   commandId: '0076',
                        // },
                        // {
                        //   label: '车辆信息',
                        //   value: 'VehicleInfo',
                        //   commandIdList: ['IsApiRegisterInfo','IsApiVehicleRecord','IsApiDriverCard'],
                        //  },
                        {
                            label: "终端链路",
                            value: "VehicleTerminalLink",
                            commandIdList: [
                                "0001",
                                "0002",
                                "0003",
                                "0004",
                                "0005",
                                "0006",
                                "0007",
                            ],
                        },
                        {
                            label: "CAN设置",
                            value: "VehicleCANsetting",
                            commandIdList: [
                                "0100",
                                "0101",
                                "0102",
                                "0103",
                                "0110",
                            ],
                        },
                    ],
                },
                {
                    title: "图像视频设置",
                    index: "2",
                    children: [
                        {
                            label: "预览设置",
                            value: "PreviewSetting",
                            commandIdList: [
                                "0070",
                                "0071",
                                "0072",
                                "0073",
                                "0074",
                            ],
                        },
                        {
                            label: "抓拍设置",
                            value: "CaptureSetting",
                            commandIdList: ["0064", "0065"],
                        },
                        // {
                        //   label: 'IPC',
                        //   value: 'Ipc'
                        // },
                        // {
                        //   label: '视频设置',
                        //   value: 'VedioSetting'
                        // },
                        // {
                        //   label: 'CVBS参数',
                        //   value: 'CvbsParams'
                        // }
                    ],
                },
                {
                    title: "主动安全设置-苏标",
                    index: "3",
                    children: [
                        {
                            label: "ADAS",
                            value: "Adas",
                            commandIdList: ["F364"],
                        },
                        {
                            label: "DSM",
                            value: "Dsm",
                            commandIdList: ["F365"],
                        },
                        {
                            label: "BSD",
                            value: "Bsd",
                            commandIdList: ["F367"],
                        },
                        {
                            label: "胎压",
                            value: "TirePressure",
                            commandIdList: ["F366"],
                        },
                        {
                            label: "角速度加速度",
                            value: "AngularVelocity",
                            commandIdList: ["F368"],
                        },
                    ],
                },
                // {
                //   title:'主动安全设置',
                //   index: '3.1',
                //   children:[
                //     {
                //       label: 'ADAS',
                //       value: 'PraviteAdas',
                //       commandIdList: ['IsApiFcwInfoList', 'IsApiHmwInfoList', 'IsApiLdwInfoList', 'IsApiPcwInfoList', 'IsApiTsrInfoList']
                //     },
                // {
                //   label: 'DBA',
                //   value:'PraviteDba',
                //   commandIdList: ['IsApiDbaInfoList']
                // },
                // {
                //   label: 'BSD',
                //   value:'PraviteBsd',
                //   commandIdList: []
                // },
                //   ]
                // },

                {
                    title: "报警设置",
                    index: "4",
                    children: [
                        {
                            label: "基础报警",
                            value: "BasicAlarm",
                            commandIdList: [
                                "0050",
                                "0051",
                                "0052",
                                "0053",
                                "0054",
                            ],
                        },
                        // {
                        //   label: '违规行驶时段',
                        //   value: 'Violation'
                        // },
                        {
                            label: "超速报警",
                            value: "Overspeed",
                            commandIdList: ["0056", "005B", "0055"],
                        },
                        {
                            label: "疲劳驾驶",
                            value: "FatigueDriving",
                            commandIdList: [
                                "0057",
                                "0058",
                                "0059",
                                "005A",
                                "005C",
                                "IsApiFatigueDrive",
                            ],
                        },
                        {
                            label: "碰撞侧翻报警",
                            value: "Crash",
                            commandIdList: ["005D", "005E"],
                        },
                        // {
                        //   label: '报警音量',
                        //   value: 'AlarmVolumn'
                        // },
                        {
                            label: "电子围栏",
                            value: "Elefence",
                            commandIdList: ["0031"],
                        },
                    ],
                },
                // {
                //   title:'存储设置',
                //   index: '5',
                //   children:[
                // {
                //   label: '磁盘格式化',
                //   value: 'DiskFormat'
                // }
                //   ]
                // },
                {
                    title: "服务器设置",
                    index: "6",
                    children: [
                        {
                            label: "服务器配置",
                            value: "Service",
                            commandIdList: [
                                "0010",
                                "0011",
                                "0012",
                                "0013",
                                "0014",
                                "0015",
                                "0016",
                                "0017",
                            ],
                        },
                        {
                            label: "IC卡认证",
                            value: "AuthenticateIC",
                            commandIdList: ["001A", "001B", "001C", "001D"],
                        },
                        // {
                        //   label: '从服务器参数',
                        //   value: 'SecService'
                        // }
                    ],
                },
                {
                    title: "定位上传设置",
                    index: "7",
                    children: [
                        {
                            label: "基础设置",
                            value: "BasicSetting",
                            commandIdList: ["0020", "0021", "0030"],
                        },
                        {
                            label: "上报间隔设置",
                            value: "IntervalSetting",
                            commandIdList: [
                                "0027",
                                "0028",
                                "0029",
                                "0022",
                                "002C",
                                "002D",
                                "002E",
                                "002F",
                            ],
                        },
                    ],
                },
                {
                    title: "通话监听设置",
                    index: "8",
                    children: [
                        {
                            label: "通话限制参数",
                            value: "CallBarring",
                            commandIdList: [
                                "0045",
                                "0046",
                                "0047",
                                "0048",
                                "0049",
                            ],
                        },
                        {
                            label: "相关电话号码参数",
                            value: "TeleNumber",
                            commandIdList: [
                                "0040",
                                "0041",
                                "0042",
                                "0043",
                                "0044",
                            ],
                        },
                    ],
                },
                {
                    title: "GNSS设置",
                    index: "9",
                    children: [
                        {
                            label: "数据上传",
                            value: "DataUp",
                            commandIdList: [
                                "0094",
                                "0095",
                                "0093",
                                "0092",
                                "0091",
                            ],
                        },
                        {
                            label: "GNSS定位模式",
                            value: "GnssSetting",
                            commandIdList: ["0090"],
                        },
                    ],
                },
                {
                    title: "音视频设置",
                    index: "10",
                    children: [
                        {
                            label: "音视频参数",
                            value: "Params",
                            commandIdList: ["0075"],
                        },
                        {
                            label: "音视频通道列表",
                            value: "ChannelList",
                            commandIdList: ["0076"],
                        },
                        {
                            label: "单独视频通道参数",
                            value: "ChannelParams",
                            commandIdList: ["0077"],
                        },
                        {
                            label: "特殊报警录像参数",
                            value: "VedioParams",
                            commandIdList: ["0079"],
                        },
                        {
                            label: "视频相关报警使能",
                            value: "AlarmAbility",
                            commandIdList: ["007A"],
                        },
                        {
                            label: "图像分析报警参数",
                            value: "ALarmParams",
                            commandIdList: ["007B"],
                        },
                        {
                            label: "终端休眠唤醒模式",
                            value: "WakeupMode",
                            commandIdList: ["007C"],
                        },
                    ],
                },
                // {
                //   title:'多中心设置',
                //   index: '11',
                //   children:[
                //     {
                //       label: '多中心配置',
                //       value: 'ManyCenter',
                //       commandIdList: ['IsApiPlatform']
                //     }
                //   ]
                // }
            ],
            // json:{},
            isapiBol1: false,
            isapiBol2: false,
            isapiBol3: false,
            isapiBol4: false,
            isapiBol5: false,
            isapiBol6: false,
            isapiBol7: false,
            json: {
                isApiApnInfo: true,
                isApiDriverCard: true,
                isApiRegisterInfo: true,
                isApiVehicleRecord: true,
                isApiShutdownCfgInfo: true,
                isApiAlarmAudioInfo: true,
                isApiSysAudioInfo: true,
                isApiVideoInfo: false,
                isApiAdasGlobal: true,
                //isApiCalibrationInfo:true,
                isApiFcwInfoList: true,
                isApiHmwInfoList: true,
                isApiLdwInfoList: true,
                isApiPcwInfoList: true,
                isApiTsrInfoList: true,
                isApiDBAGlobal: true,
                isApiDriverEyeClosedInfo: true,
                isApiDriverCallingInfo: true,
                isApiDriverSmokingInfo: true,
                isApiDriverInattentionInfo: true,
                isApiDriverAbsentedInfo: true,
                isApiDriverBlockCameraInfo: true,
                isApiDriverSafetyBeltInfo: true,
                isApiDriverSunglassesInfo: true,
                isApiRapidAccelerationInfo: true,
                isApiRapidDecelerationInfo: true,
                isApiRapidTurnInfo: true,
                isApiDriverAbnormaInfo: true,
                //isApiDriveTimeInfo:true,
                //isApiDriveChangeInfo:true,
                isApiBsdInfo: true,
                isApiWhdInfo: true,
                isApiWhdNoHandInfo: true,
                isApiWhdSingleHandInfo: true,
                isApiWhdPlayMobilePhoneInfo: true,
                isApiSpeedingOthers: true,
                isApiFatigueDrivingOthers: true,
                //isApiFatigueDrivingInfo:true,
                isApiPlatform: true,
                //isApiPlatformAlarm:true,
                isApiSerialInfo: true,
                isApiProgramMgrInfo: true,
                isApiSensorInInfoCapability: true,
                //isApiPreviewSwitchInfoCapability:true,
                //isReboot:true,
                // isFactoryReset:true,
                // isStorageHdd:true,
                // isStorage:true,
                // isNetwork:true,
                // isLocation:true,
                //isDeviceInfo:true,
                isApiZtWorkMode: true,
                isApiZtInvalidAlarm: true,
                isApiZtTcss: true,
                isApiZtLed: true,
                isApiZtVehctrl: true,
                isApiZtScreenCtrl: true,
                isApiZtGsensor: true,
                isApiZtGsensorTurnCapability: true,
                isApiZtEcuProtocol: true,
                //isApiEngineeringInspection:true,
            },
            sideBarItem2: [
                {
                    title: "车辆设备",
                    index: "1.1",
                    children: [
                        {
                            label: "注册参数",
                            value: "PublicVehicleRegistration",
                            commandIdList: ["0081", "0082", "0083", "0084"],
                        },
                        // {
                        //   label: '设备设置',
                        //   value: 'VehicleDeviceSetting',
                        //   commandId: '0076',
                        // },
                        {
                            label: "车辆信息",
                            value: "PublicVehicleInfo",
                            commandIdList: [
                                "IsApiRegisterInfo",
                                "IsApiVehicleRecord",
                                "IsApiDriverCard",
                            ],
                        },
                        // {
                        //   label: '终端链路',
                        //   value: 'PublicVehicleTerminalLink',
                        //   commandIdList: ['0001','0002','0003','0004','0005','0006','0007'],
                        // },
                        // {
                        //   label: 'CAN设置',
                        //   value: 'PublicVehicleCANsetting',
                        //   commandIdList: ['0100','0101','0102','0103','0110']
                        // },
                        {
                            label: "延时关机时间",
                            value: "PublicShutDown",
                            commandIdList: ["IsApiShutdownCfgInfo"],
                        },
                        {
                            label: "音量设置",
                            value: "PublicVolume",
                            commandIdList: [
                                "IsApiAlarmAudioInfo",
                                "IsApiSysAudioInfo",
                            ],
                        },
                    ],
                },
                // {
                //   title:'图像视频设置',
                //   index: '2',
                //   children:[
                //     {
                //       label: '预览设置',
                //       value: 'PublicPreviewSetting',
                //       commandIdList: ['0070','0071','0072','0073','0074']
                //     },
                //     {
                //       label: '抓拍设置',
                //       value: 'PublicCaptureSetting',
                //       commandIdList: ['0064','0065']
                //     },
                // {
                //   label: 'IPC',
                //   value: 'Ipc'
                // },
                // {
                //   label: '视频设置',
                //   value: 'VedioSetting'
                // },
                // {
                //   label: 'CVBS参数',
                //   value: 'CvbsParams'
                // }
                //   ]
                // },
                // {
                //   title:'主动安全设置-苏标',
                //   index: '3',
                //   children:[
                //     {
                //       label: 'ADAS',
                //       value: 'AdasPublic',
                //       commandIdList: ['F364']
                //     },
                //     {
                //       label: 'DSM',
                //       value: 'DsmPublic',
                //       commandIdList: ['F365']
                //     },
                //     {
                //       label: 'BSD',
                //       value: 'BsdPublic',
                //       commandIdList: ['F367']
                //     },
                //     {
                //       label: '胎压',
                //       value: 'TirePressurePublic',
                //       commandIdList: ['F366']
                //     },
                //     {
                //       label: '角速度加速度',
                //       value: 'AngularVelocityPublic',
                //       commandIdList: ['F368']
                //     }
                //   ]
                // },
                // {
                //   title:'主动安全设置',
                //   index: '3.1',
                //   children:[
                //     {
                //       label: 'ADAS',
                //       value: 'PraviteAdas',
                //       commandIdList: ['IsApiFcwInfoList', 'IsApiHmwInfoList', 'IsApiLdwInfoList', 'IsApiPcwInfoList', 'IsApiTsrInfoList']
                //     },
                //     {
                //       label: 'DBA',
                //       value:'PraviteDba',
                //       commandIdList: ['IsApiDbaInfoList']
                //     },
                //     {
                //       label: 'BSD',
                //       value:'PraviteBsd',
                //       commandIdList: []
                //     },
                //   ]
                // },
                {
                    title: "多中心设置",
                    index: "11.1",
                    children: [
                        // {
                        //   label:'中心报警参数',
                        //   value:'PublicPlatFormAlarm',
                        //   commandIdList:['IsApiPlatformAlarm']
                        // },
                        {
                            label: "第1中心",
                            value: "firstCenterPublic",
                            commandIdList: ["IsApiPlatformOthers0"],
                        },
                        {
                            label: "第2中心",
                            value: "secondCenterPublic",
                            commandIdList: ["IsApiPlatformOthers1"],
                        },
                        {
                            label: "第3中心",
                            value: "thirdCenterPublic",
                            commandIdList: ["IsApiPlatformOthers2"],
                        },
                        {
                            label: "第4中心",
                            value: "forthCenterPublic",
                            commandIdList: ["IsApiPlatformOthers3"],
                        },
                        {
                            label: "第5中心",
                            value: "fifthCenterPublic",
                            commandIdList: ["IsApiPlatformOthers4"],
                        },
                        {
                            label: "第6中心",
                            value: "sixthCenterPublic",
                            commandIdList: ["IsApiPlatformOthers5"],
                        },
                    ],
                },
                {
                    title: "主动安全设置",
                    index: "3.1",
                    children: [
                        {
                            label: "ADAS",
                            value: "PublicAdas",
                            commandIdList: [
                                "IsApiFcwInfoList",
                                "IsApiHmwInfoList",
                                "IsApiLdwInfoList",
                                "IsApiPcwInfoList",
                                "IsApiTsrInfoList",
                            ],
                            IsApiTriggerInfoList: [
                                "IsApiFcwTriggerInfo",
                                "IsApiHmwTriggerInfo",
                                "IsApiLdwTriggerInfo",
                                "IsApiPcwTriggerInfo",
                                "IsApiTsrTriggerInfo",
                                "IsApiAdasGlobal",
                            ],
                            capabilityList: [
                                "IsApiFcwInfoListCapability",
                                "IsApiHmwInfoListCapability",
                                "IsApiLdwInfoListCapability",
                                "IsApiPcwInfoListCapability",
                                "IsApiTsrInfoListCapability",
                                "IsApiTsrInfoListCapability",
                            ],
                        },
                        {
                            label: "DBA",
                            value: "PublicDba",
                            commandIdList: [
                                "IsApiDriverAbsentedInfo",
                                "IsApiDriverBlockCameraInfo",
                                "IsApiDriverCallingInfo",
                                "IsApiDriverEyeClosedInfo",
                                "IsApiDriverInattentionInfo",
                                "IsApiDriverSafetyBeltInfo",
                                "IsApiDriverSmokingInfo",
                                "IsApiDriverSunglassesInfo",
                                "IsApiRapidAccelerationInfo",
                                "IsApiRapidDecelerationInfo",
                                "IsApiRapidTurnInfo",
                                "IsApiDriverAbnormaInfo",
                                "IsApiDriveTimeInfo",
                                "IsApiDriveChangeInfo",
                                "",
                            ],
                            IsApiTriggerInfoList: [
                                "IsApiDriverEyeClosedTriggerList",
                                "IsApiDriverCallingTriggerList",
                                "IsApiDriverSmokingTriggerList",
                                "IsApiDriverInattentionTriggerList",
                                "IsApiDriverAbsentedTriggerList",
                                "IsApiDriverBlockCameraTriggerList",
                                "IsApiDriverSafetyBeltTriggerList",
                                "IsApiDriverSunglassesTriggerList",
                                "IsApiDBAGlobal",
                                "IsApiRapidAccelerationTriggerList",
                                "IsApiRapidDecelerationTriggerList",
                                "IsApiRapidTurnTriggerList",
                                "IsApiDriverAbnormaTriggerList",
                                "IsApiDriveTimeTriggerList",
                                "IsApiDriveChangeTriggerList",
                            ],
                            capabilityList: [
                                "IsApiDriverAbsentedInfoCapability",
                                "IsApiDriverBlockCameraInfoCapability",
                                "IsApiDriverCallingInfoCapability",
                                "IsApiDriverEyeClosedInfoCapability",
                                "IsApiDriverInattentionInfoCapability",
                                "IsApiDriverSafetyBeltInfoCapability",
                                "IsApiDriverSmokingInfoCapability",
                                "IsApiDriverSunglassesInfoCapability",
                                "IsApiRapidAccelerationInfoCapability",
                                "IsApiRapidDecelerationInfoCapability",
                                "IsApiRapidTurnInfoCapability",
                                "IsApiDriverAbnormaInfoCapability",
                                "IsApiDriveTimeInfoCapability",
                                "IsApiDriveChangeInfoCapability",
                            ],
                        },
                        {
                            label: "BSD",
                            value: "PublicBsd",
                            commandIdList: ["IsApiBsdInfo"],
                            IsApiTriggerInfoList: ["IsApiBsdTriggerList"],
                            capabilityList: ["IsApiBsdInfoCapability"],
                        },
                        {
                            label: "WHD/玩手机",
                            value: "WhdPublic",
                            commandIdList: [
                                "IsApiWhdNoHandInfo",
                                "IsApiWhdSingleHandInfo",
                                "IsApiWhdPlayMobilePhoneInfo",
                            ],
                            IsApiTriggerInfoList: [
                                "IsApiWhdNoHandTriggerList",
                                "IsApiWhdSingleHandTriggerList",
                                "IsApiWhdPlayMobilePhoneTriggerList",
                                "IsApiWhdInfo",
                            ],
                            capabilityList: [
                                "IsApiWhdNoHandInfoCapability",
                                "IsApiWhdSingleHandInfoCapability",
                                "IsApiWhdPlayMobilePhoneInfoCapability",
                            ],
                        },
                    ],
                },
                // {
                //   title:'图像视频设置',
                //   index: '5',
                //   children:[
                //     {
                //       label: '视频设置',
                //       value: 'PublicVideo',
                //       commandIdList: ['IsApiVideoInfo']
                //     },
                //   ]
                // },
                {
                    title: "报警设置",
                    index: "4.1",
                    children: [
                        // {
                        //   label: '基础报警',
                        //   value: 'PublicBasicAlarm',
                        //   commandIdList: ['0050','0051','0052','0053','0054']
                        // },
                        // {
                        //   label: '违规行驶时段',
                        //   value: 'Violation'
                        // },
                        {
                            label: "超速报警",
                            value: "PublicOverspeed",
                            commandIdList: ["IsApiSpeedingOthers"],
                        },
                        {
                            label: "疲劳驾驶",
                            value: "PublicFatigueDriving",
                            commandIdList: ["IsApiFatigueDrivingOthers"],
                        },
                        // {
                        //   label: '碰撞侧翻报警',
                        //   value: 'PublicCrash',
                        //   commandIdList: ['005D','005E']
                        // },
                        // {
                        //   label: '报警音量',
                        //   value: 'AlarmVolumn'
                        // },
                        // {
                        //   label: '电子围栏',
                        //   value: 'PublicElefence',
                        //   commandIdList: ['0031']
                        // },
                    ],
                },
                // {
                //   title:'存储设置',
                //   index: '5',
                //   children:[
                // {
                //   label: '磁盘格式化',
                //   value: 'DiskFormat'
                // }
                //   ]
                // },
                // {
                //   title:'服务器设置',
                //   index: '6',
                //   children:[
                //     {
                //       label: '服务器配置',
                //       value: 'PublicService',
                //       commandIdList: ['0010','0011','0012','0013','0014','0015','0016','0017']
                //     },
                //     {
                //       label: 'IC卡认证',
                //       value: 'PublicAuthenticateIC',
                //       commandIdList: ['001A','001B','001C','001D']
                //     },
                // {
                //   label:'APN设置',
                //   value:'PublicApn',
                //   commandIdList:[]
                // }
                // {
                //   label: '从服务器参数',
                //   value: 'SecService'
                // }
                //   ]
                // },
                // {
                //   title:'定位上传设置',
                //   index: '7',
                //   children:[
                //     {
                //       label: '基础设置',
                //       value: 'PublicBasicSetting',
                //       commandIdList: ['0020','0021','0030']
                //     },
                //     {
                //       label: '上报间隔设置',
                //       value: 'PublicIntervalSetting',
                //       commandIdList: ['0027','0028','0029','0022','002C','002D','002E','002F']
                //     }
                //   ]
                // },
                // {
                //   title:'通话监听设置',
                //   index: '8',
                //   children:[
                //     {
                //       label: '通话限制参数',
                //       value: 'PublicCallBarring',
                //       commandIdList: ['0045','0046','0047','0048','0049']
                //     },
                //     {
                //       label: '相关电话号码参数',
                //       value: 'PublicTeleNumber',
                //       commandIdList: ['0040','0041','0042','0043','0044']
                //     }
                //   ]
                // },
                // {
                //   title:'GNSS设置',
                //   index: '9',
                //   children:[
                //     {
                //       label: '数据上传',
                //       value: 'PublicDataUp',
                //       commandIdList: ['0094','0095','0093','0092','0091']
                //     },
                //     {
                //       label: 'GNSS定位模式',
                //       value: 'PublicGnssSetting',
                //       commandIdList: ['0090']
                //     }
                //   ]
                // },
                // {
                //   title:'音视频设置',
                //   index: '10',
                //   children:[
                //     {
                //       label: '音视频参数',
                //       value: 'PublicParams',
                //       commandIdList: ['0075']
                //     },
                //     {
                //       label: '音视频通道列表',
                //       value: 'PublicChannelList',
                //       commandIdList: ['0076']
                //     },
                //     {
                //       label: '单独视频通道参数',
                //       value: 'PublicChannelParams',
                //       commandIdList: ['0077']
                //     },
                //     {
                //       label: '特殊报警录像参数',
                //       value: 'PublicVedioParams',
                //       commandIdList: ['0079']
                //     },
                //     {
                //       label: '视频相关报警使能',
                //       value: 'PublicAlarmAbility',
                //       commandIdList: ['007A']
                //     },
                //     {
                //       label: '图像分析报警参数',
                //       value: 'PublicALarmParams',
                //       commandIdList: ['007B']
                //     },
                //     {
                //       label: '终端休眠唤醒模式',
                //       value: 'PublicWakeupMode',
                //       commandIdList: ['007C']
                //     },
                //   ]
                // },

                {
                    title: "外设输出设置",
                    index: "12.1",
                    children: [
                        {
                            label: "声光报警器",
                            value: "PublicSerial",
                            commandIdList: ["IsApiSerialInfo"],
                        },
                        {
                            label: "视频输出设置",
                            value: "PublicProgramMgr",
                            commandIdList: ["IsApiProgramMgrInfo"],
                        },
                    ],
                },
                {
                    title: "渣土车配置",
                    index: "13.1",
                    children: [
                        {
                            label: "工作模式",
                            value: "PublicWorkMode",
                            commandIdList: ["IsApiZtWorkMode"],
                        },
                        {
                            label: "业务报警",
                            value: "PublicInvalidAlarm",
                            commandIdList: ["IsApiZtInvalidAlarm"],
                        },
                        {
                            label: "货箱状态",
                            value: "PublicTcss",
                            commandIdList: ["IsApiZtTcss"],
                        },
                        {
                            label: "外屏参数",
                            value: "PublicLed",
                            commandIdList: ["IsApiZtLed"],
                        },
                        {
                            label: "控车参数",
                            value: "PublicVehctrl",
                            commandIdList: ["IsApiZtVehctrl"],
                        },
                        {
                            label: "安卓屏控制",
                            value: "PublicCtrl",
                            commandIdList: ["IsApiZtScreenCtrl"],
                        },
                        {
                            label: "路口报警",
                            value: "PublicGsensor",
                            commandIdList: [
                                "IsApiZtGsensor",
                                "IsApiZtGsensorTurn",
                                "IsApiZtGsensorTriggers",
                            ],
                        },
                        {
                            label: "发动机控车",
                            value: "PublicEcu",
                            commandIdList: ["IsApiZtEcuProtocol"],
                        },
                    ],
                },
            ],
            chooseItem: "注册参数",
            currentAdasCommandId: "",
            currentIsApiTriggerInfo: "",
            currentCenterNum: "",
            everyVolumeBol: false,
            checkPassword: "",
            passwordType: "password",
            passwordIcon: "el-icon-view",
            templateJSON: {
                configParams: [],
                menuList: [],
            },
        };
    },
    watch: {
        initData: {
            handler(val) {
                if (
                    val["IsApiPlatform"] &&
                    val["IsApiPlatform"]["platformInfoList"] &&
                    val["IsApiPlatform"]["platformInfoList"].length
                ) {
                    for (
                        let i = 0;
                        i < val["IsApiPlatform"]["platformInfoList"].length;
                        i++
                    ) {
                        if (
                            val["IsApiPlatform"]["platformInfoList"][i][
                                "serverInfoList"
                            ][0].hostName == "iot81.hikvisionauto.com"
                        ) {
                            this.hasIotHikvision =
                                this.hasIotHikvision != null
                                    ? this.hasIotHikvision
                                    : i;
                            break;
                        } else {
                            this.hasIotHikvision = null;
                        }
                    }
                }
                this.tempalteData = JSON.parse(JSON.stringify(val));
            },
            deep: true,
            immediate: true,
        },
        isApiDeciveBols: {
            handler(val) {
                if (val) {
                    this.getChannelsCapability();
                    this.isApiDeciveBol = val;
                    let params = {
                        deviceId: this.$route.query.deviceId,
                        commandIds: ["IsApiDeviceCapability"],
                    };
                    //获取ISAPI全部能力集
                    this.$api
                        .getDeviceConfigParamsByIsApi(params)
                        .then((res) => {
                            if (res.success) {
                                if (
                                    JSON.parse(res.data) != "{}" &&
                                    JSON.parse(res.data)[
                                        "IsApiDeviceCapability"
                                    ]["statusCode"] != undefined &&
                                    JSON.parse(res.data)[
                                        "IsApiDeviceCapability"
                                    ]["statusCode"] == 0
                                ) {
                                    this.json = res.data;
                                    this.makeIsapiMenu(1);
                                    this.templateJsonGet(); //sideBarItem[0]['children'][0]['value']
                                } else {
                                    this.sideBarItem = this.sideBarItem2;
                                    this.templateJsonGet();
                                }
                            } else {
                                this.sideBarItem = this.sideBarItem2;
                                this.templateJsonGet();
                            }
                            this.$nextTick(() => {
                                if (this.$route.query.multicenter) {
                                    this.componentName = this.sideBarItem2.find(
                                        (e) => e.title === "多中心设置"
                                    )["children"][0]["value"];
                                } else {
                                    this.componentName =
                                        this.sideBarItem2[0]["children"][0][
                                            "value"
                                        ];
                                }
                            });
                        })
                        .catch((err) => {
                            this.sideBarItem = this.sideBarItem2;
                        });
                } else {
                    this.isApiDeciveBol = val;
                    this.componentName = "VehicleRegistration";
                    this.sideBarItem = this.sideBarItem1;
                }
            },
            immediate: true,
        },
        moubleBol: {
            handler(val) {
                if (!val) {
                    this.$nextTick(() => {
                        this.templateJsonGet();
                    });
                }
            },
        },
    },
    created() {
        //this.getChannelsCapability();
        // this.getIsApiDeviceCapability();
        // this.makeIsapiMenu()
    },
    methods: {
        //模板模块发生变化
        changeTemplate(isapi, isapiTri, channels) {
            if (
                this.moubleJson[isapi.replace(isapi[0], isapi[0].toLowerCase())]
            ) {
                if (
                    isapi == "IsApiFcwInfoList" ||
                    isapi == "IsApiHmwInfoList" ||
                    isapi == "IsApiLdwInfoList" ||
                    isapi == "IsApiPcwInfoList" ||
                    isapi == "IsApiTsrInfoList" ||
                    isapi == "IsApiBsdInfo" ||
                    isapi == "IsApiDriverEyeClosedInfo" ||
                    isapi == "IsApiDriverCallingInfo" ||
                    isapi == "IsApiDriverCallingInfo" ||
                    isapi == "IsApiDriverSmokingInfo" ||
                    isapi == "IsApiDriverInattentionInfo" ||
                    isapi == "IsApiDriverAbsentedInfo" ||
                    isapi == "IsApiDriverBlockCameraInfo" ||
                    isapi == "IsApiDriverSafetyBeltInfo" ||
                    isapi == "IsApiDriverSunglassesInfo" ||
                    isapi == "IsApiRapidAccelerationInfo" ||
                    isapi == "IsApiRapidDecelerationInfo" ||
                    isapi == "IsApiRapidTurnInfo" ||
                    isapi == "IsApiDriverAbnormaInfo" ||
                    isapi == "IsApiDriveTimeInfo" ||
                    isapi == "IsApiDriveChangeInfo" ||
                    isapi == "IsApiWhdNoHandInfo" ||
                    isapi == "IsApiWhdSingleHandInfo" ||
                    isapi == "IsApiWhdPlayMobilePhoneInfo"
                ) {
                    channels.forEach((item) => {
                        if (JSON.stringify(this.channelForm) != "{}") {
                            for (let key in this.channelForm) {
                                //channel_
                                if (item == key.substring(8, 9)) {
                                    if (this.channelForm[key][isapi]) {
                                        let isapiInfo = {};
                                        let isapiTriInfo = {};
                                        let isapiCap = {};
                                        isapiInfo[isapi] =
                                            this.channelForm[key][isapi];
                                        isapiTriInfo[isapiTri] =
                                            this.channelForm[key][isapiTri];
                                        isapiCap[isapi + "Capability"] =
                                            this.channelForm[key][
                                                isapi + "Capability"
                                            ];
                                        this.templateJSON["configParams"].push({
                                            protocol: [
                                                isapiInfo,
                                                isapiTriInfo,
                                                isapiCap,
                                            ],
                                            params: "",
                                            channelId: item,
                                            controlPwd: "",
                                        });
                                    } else {
                                        let params = {
                                            deviceId:
                                                this.$route.query.deviceId ||
                                                null,
                                            commandIds: [isapi, isapiTri],
                                            channelId: item,
                                        };
                                        this.isapiBol1 = true;
                                        this.$api
                                            .getDeviceConfigParamsByIsApi(
                                                params
                                            )
                                            .then((res) => {
                                                if (
                                                    res.success &&
                                                    res.data != "{}" &&
                                                    (JSON.parse(res.data)[
                                                        isapi
                                                    ]["statusCode"] == 0 ||
                                                        !JSON.parse(res.data)[
                                                            isapi
                                                        ]["statusCode"])
                                                ) {
                                                    let resData = JSON.parse(
                                                        res.data
                                                    );
                                                    let isapiInfo = {};
                                                    let isapiTriInfo = {};
                                                    let isapiCap = {};
                                                    isapiInfo[isapi] =
                                                        resData[isapi];
                                                    isapiTriInfo[isapiTri] =
                                                        resData[isapiTri];
                                                    isapiCap[
                                                        isapi + "Capability"
                                                    ] =
                                                        resData[
                                                            isapi + "Capability"
                                                        ];
                                                    this.templateJSON[
                                                        "configParams"
                                                    ].push({
                                                        protocol: [
                                                            isapiInfo,
                                                            isapiTriInfo,
                                                            isapiCap,
                                                        ],
                                                        params: "",
                                                        channelId: item,
                                                        controlPwd: "",
                                                    });
                                                } else {
                                                    this.moubleJson[
                                                        isapi.replace(
                                                            isapi[0],
                                                            isapi[0].toLowerCase()
                                                        )
                                                    ] = false;
                                                    this.$message.error(
                                                        "获取协议失败，请重新勾选！"
                                                    );
                                                }
                                                this.isapiBol1 = false;
                                            });
                                    }
                                } else {
                                    let params = {
                                        deviceId:
                                            this.$route.query.deviceId || null,
                                        commandIds: [isapi, isapiTri],
                                        channelId: item,
                                    };
                                    this.isapiBol1 = true;
                                    this.$api
                                        .getDeviceConfigParamsByIsApi(params)
                                        .then((res) => {
                                            if (
                                                res.success &&
                                                res.data != "{}" &&
                                                (JSON.parse(res.data)[isapi][
                                                    "statusCode"
                                                ] == 0 ||
                                                    !JSON.parse(res.data)[
                                                        isapi
                                                    ]["statusCode"])
                                            ) {
                                                let resData = JSON.parse(
                                                    res.data
                                                );
                                                let isapiInfo = {};
                                                let isapiTriInfo = {};
                                                let isapiCap = {};
                                                isapiInfo[isapi] =
                                                    resData[isapi];
                                                isapiTriInfo[isapiTri] =
                                                    resData[isapiTri];
                                                isapiCap[isapi + "Capability"] =
                                                    resData[
                                                        isapi + "Capability"
                                                    ];
                                                this.templateJSON[
                                                    "configParams"
                                                ].push({
                                                    protocol: [
                                                        isapiInfo,
                                                        isapiTriInfo,
                                                        isapiCap,
                                                    ],
                                                    params: "",
                                                    channelId: item,
                                                    controlPwd: "",
                                                });
                                            } else {
                                                this.moubleJson[
                                                    isapi.replace(
                                                        isapi[0],
                                                        isapi[0].toLowerCase()
                                                    )
                                                ] = false;
                                                this.$message.error(
                                                    "获取协议失败，请重新勾选！"
                                                );
                                            }
                                            this.isapiBol1 = false;
                                        })
                                        .catch((err) => {
                                            this.moubleJson[
                                                isapi.replace(
                                                    isapi[0],
                                                    isapi[0].toLowerCase()
                                                )
                                            ] = false;
                                            this.isapiBol1 = false;
                                        });
                                }
                            }
                        } else {
                            let params = {
                                deviceId: this.$route.query.deviceId || null,
                                commandIds: [isapi, isapiTri],
                                channelId: item,
                            };
                            this.isapiBol1 = true;
                            this.$api
                                .getDeviceConfigParamsByIsApi(params)
                                .then((res) => {
                                    if (
                                        res.success &&
                                        res.data != "{}" &&
                                        (JSON.parse(res.data)[isapi][
                                            "statusCode"
                                        ] == 0 ||
                                            !JSON.parse(res.data)[isapi][
                                                "statusCode"
                                            ])
                                    ) {
                                        let resData = JSON.parse(res.data);
                                        let isapiInfo = {};
                                        let isapiTriInfo = {};
                                        let isapiCap = {};
                                        isapiInfo[isapi] = resData[isapi];
                                        isapiTriInfo[isapiTri] =
                                            resData[isapiTri];
                                        isapiCap[isapi + "Capability"] =
                                            resData[isapi + "Capability"];
                                        this.templateJSON["configParams"].push({
                                            protocol: [
                                                isapiInfo,
                                                isapiTriInfo,
                                                isapiCap,
                                            ],
                                            params: "",
                                            channelId: item,
                                            controlPwd: "",
                                        });
                                    } else {
                                        this.moubleJson[
                                            isapi.replace(
                                                isapi[0],
                                                isapi[0].toLowerCase()
                                            )
                                        ] = false;
                                        this.$message.error(
                                            "获取协议失败，请重新勾选！"
                                        );
                                    }
                                    this.isapiBol1 = false;
                                })
                                .catch((err) => {
                                    this.moubleJson[
                                        isapi.replace(
                                            isapi[0],
                                            isapi[0].toLowerCase()
                                        )
                                    ] = false;
                                    this.isapiBol1 = false;
                                });
                        }
                    });
                } else if (isapi == "IsApiZtVehctrl") {
                    if (this.initData["IsApiZtVehctrl"] == undefined) {
                        this.unlockBol = true;
                    } else {
                        let isapiInfo = {
                            IsApiZtVehctrl: this.initData["IsApiZtVehctrl"],
                        };
                        let isapiCap = {
                            IsApiZtVehctrlCapability:
                                this.initData["IsApiZtVehctrlCapability"],
                        };
                        this.templateJSON["configParams"].push({
                            protocol: [isapiInfo, isapiCap],
                            params: "",
                            channelId: -1,
                            controlPwd: this.aesPassword,
                        });
                    }
                } else if (
                    isapi == "IsApiAdasGlobal" ||
                    isapi == "IsApiDBAGlobal" ||
                    isapi == "IsApiWhdInfo"
                ) {
                    channels.forEach((item) => {
                        if (JSON.stringify(this.channelForm) != "{}") {
                            for (let key in this.channelForm) {
                                //channel_
                                if (item == key.substring(8, 9)) {
                                    let isapiInfo = {};
                                    isapiInfo[isapi] =
                                        this.channelForm[key][isapi];
                                    this.templateJSON["configParams"].push({
                                        protocol: [isapiInfo],
                                        params: "",
                                        channelId: item,
                                        controlPwd: "",
                                    });
                                } else {
                                    let params = {
                                        deviceId:
                                            this.$route.query.deviceId || null,
                                        commandIds: [isapi],
                                        channelId: item,
                                    };
                                    this.isapiBol3 = true;
                                    this.$api
                                        .getDeviceConfigParamsByIsApi(params)
                                        .then((res) => {
                                            if (
                                                res.success &&
                                                res.data != "{}" &&
                                                (JSON.parse(res.data)[isapi][
                                                    "statusCode"
                                                ] == 0 ||
                                                    !JSON.parse(res.data)[
                                                        isapi
                                                    ]["statusCode"])
                                            ) {
                                                let resData = JSON.parse(
                                                    res.data
                                                );
                                                let isapiInfo = {};
                                                isapiInfo[isapi] =
                                                    resData[isapi];
                                                this.templateJSON[
                                                    "configParams"
                                                ].push({
                                                    protocol: [isapiInfo],
                                                    params: "",
                                                    channelId: item,
                                                    controlPwd: "",
                                                });
                                            } else {
                                                this.moubleJson[
                                                    isapi.replace(
                                                        isapi[0],
                                                        isapi[0].toLowerCase()
                                                    )
                                                ] = false;
                                                this.$message.error(
                                                    "获取协议失败，请重新勾选！"
                                                );
                                            }
                                            this.isapiBol3 = false;
                                        })
                                        .catch((err) => {
                                            this.moubleJson[
                                                isapi.replace(
                                                    isapi[0],
                                                    isapi[0].toLowerCase()
                                                )
                                            ] = false;
                                            this.isapiBol3 = false;
                                        });
                                }
                            }
                        } else {
                            let params = {
                                deviceId: this.$route.query.deviceId || null,
                                commandIds: [isapi],
                                channelId: item,
                            };
                            this.isapiBol3 = true;
                            this.$api
                                .getDeviceConfigParamsByIsApi(params)
                                .then((res) => {
                                    if (
                                        res.success &&
                                        res.data != "{}" &&
                                        (JSON.parse(res.data)[isapi][
                                            "statusCode"
                                        ] == 0 ||
                                            !JSON.parse(res.data)[isapi][
                                                "statusCode"
                                            ])
                                    ) {
                                        let resData = JSON.parse(res.data);
                                        let isapiInfo = {};
                                        isapiInfo[isapi] = resData[isapi];
                                        this.templateJSON["configParams"].push({
                                            protocol: [isapiInfo],
                                            params: "",
                                            channelId: item,
                                            controlPwd: "",
                                        });
                                    } else {
                                        this.moubleJson[
                                            isapi.replace(
                                                isapi[0],
                                                isapi[0].toLowerCase()
                                            )
                                        ] = false;
                                        this.$message.error(
                                            "获取协议失败，请重新勾选！"
                                        );
                                    }
                                    this.isapiBol3 = false;
                                })
                                .catch((err) => {
                                    this.moubleJson[
                                        isapi.replace(
                                            isapi[0],
                                            isapi[0].toLowerCase()
                                        )
                                    ] = false;
                                    this.isapiBol3 = false;
                                });
                        }
                    });
                } else if (isapi == "IsApiPlatform") {
                    if (this.initData["IsApiPlatform"] == undefined) {
                        let params = {
                            deviceId: this.$route.query.deviceId || null,
                            commandIds: ["IsApiPlatform"],
                        };
                        this.isapiBol4 = true;
                        this.$api
                            .getDeviceConfigParamsByIsApi(params)
                            .then((res) => {
                                if (
                                    res.success &&
                                    res.data != "{}" &&
                                    (JSON.parse(res.data)[isapi][
                                        "statusCode"
                                    ] == 0 ||
                                        !JSON.parse(res.data)[isapi][
                                            "statusCode"
                                        ])
                                ) {
                                    let resData = JSON.parse(res.data);
                                    let param0 = {
                                        deviceId:
                                            this.$route.query.deviceId || null,
                                        commandIds: [
                                            "IsApiLocationReportOthers0",
                                        ],
                                    };
                                    let param1 = {
                                        deviceId:
                                            this.$route.query.deviceId || null,
                                        commandIds: [
                                            "IsApiLocationReportOthers1",
                                        ],
                                    };
                                    let param2 = {
                                        deviceId:
                                            this.$route.query.deviceId || null,
                                        commandIds: [
                                            "IsApiLocationReportOthers2",
                                        ],
                                    };
                                    let param3 = {
                                        deviceId:
                                            this.$route.query.deviceId || null,
                                        commandIds: [
                                            "IsApiLocationReportOthers3",
                                        ],
                                    };
                                    let param4 = {
                                        deviceId:
                                            this.$route.query.deviceId || null,
                                        commandIds: [
                                            "IsApiLocationReportOthers4",
                                        ],
                                    };
                                    let param5 = {
                                        deviceId:
                                            this.$route.query.deviceId || null,
                                        commandIds: [
                                            "IsApiLocationReportOthers5",
                                        ],
                                    };
                                    Promise.all([
                                        this.$api.getDeviceConfigParamsByIsApi(
                                            param0
                                        ),
                                        this.$api.getDeviceConfigParamsByIsApi(
                                            param1
                                        ),
                                        this.$api.getDeviceConfigParamsByIsApi(
                                            param2
                                        ),
                                        this.$api.getDeviceConfigParamsByIsApi(
                                            param3
                                        ),
                                        this.$api.getDeviceConfigParamsByIsApi(
                                            param4
                                        ),
                                        this.$api.getDeviceConfigParamsByIsApi(
                                            param5
                                        ),
                                    ]).then((res_) => {
                                        if (
                                            res_[0].success == true ||
                                            res_[1].success == true ||
                                            res_[2].success == true ||
                                            res_[3].success == true ||
                                            res_[4].success == true ||
                                            res_[5].success == true
                                        ) {
                                            resData["IsApiPlatform"][
                                                "platformInfoList"
                                            ].forEach((item, index) => {
                                                item[
                                                    "IsApiLocationReportOthers" +
                                                        index
                                                ] = JSON.parse(
                                                    res_[index].data
                                                )[
                                                    "IsApiLocationReportOthers" +
                                                        index
                                                ];
                                                let isapiInfo = {
                                                    IsApiPlatform: {
                                                        platformInfoList: [],
                                                    },
                                                };
                                                let isapiOther = {};
                                                let isapiCap = {};
                                                isapiInfo["IsApiPlatform"][
                                                    "platformInfoList"
                                                ].push(item);
                                                isapiOther[
                                                    "IsApiLocationReportOthers" +
                                                        index
                                                ] =
                                                    item[
                                                        "IsApiLocationReportOthers" +
                                                            index
                                                    ];
                                                isapiCap[
                                                    "IsApiPlatformCapability"
                                                ] =
                                                    resData[
                                                        "IsApiPlatformCapability"
                                                    ];
                                                this.templateJSON[
                                                    "configParams"
                                                ].push({
                                                    protocol: [
                                                        isapiInfo,
                                                        isapiOther,
                                                        isapiCap,
                                                    ],
                                                    params: "",
                                                    channelId: -1,
                                                    controlPwd: "",
                                                });
                                            });
                                        }
                                        this.isapiBol4 = false;
                                    });
                                } else {
                                    this.$message.error(
                                        "获取设备配置参数失败:" + res.msg
                                    );
                                    this.moubleJson[
                                        isapi.replace(
                                            isapi[0],
                                            isapi[0].toLowerCase()
                                        )
                                    ] = false;
                                    this.isapiBol4 = false;
                                }
                            });
                    } else {
                        this.initData["IsApiPlatform"][
                            "platformInfoList"
                        ].forEach((item, index) => {
                            let isapiInfo = {
                                IsApiPlatform: { platformInfoList: [] },
                            };
                            let isapiOther = {};
                            let isapiCap = {};
                            isapiInfo["IsApiPlatform"]["platformInfoList"].push(
                                item
                            );
                            isapiOther["IsApiLocationReportOthers" + index] =
                                item["IsApiLocationReportOthers" + index];
                            isapiCap["IsApiPlatformCapability"] =
                                this.initData["IsApiPlatformCapability"];
                            this.templateJSON["configParams"].push({
                                protocol: [isapiInfo, isapiOther, isapiCap],
                                params: "",
                                channelId: -1,
                                controlPwd: "",
                            });
                        });
                    }
                } else if (isapi == "IsApiZtGsensor") {
                    if (this.initData["IsApiZtGsensor"] == undefined) {
                        let params = {
                            deviceId: this.$route.query.deviceId || null,
                            commandIds: [
                                "IsApiZtGsensor",
                                "IsApiZtGsensorTurnCapability",
                            ],
                        };
                        this.isapiBol5 = true;
                        this.$api
                            .getDeviceConfigParamsByIsApi(params)
                            .then((res) => {
                                if (
                                    res.success &&
                                    res.data != "{}" &&
                                    (JSON.parse(res.data)[
                                        "IsApiZtGsensorTurnCapability"
                                    ]["statusCode"] == 0 ||
                                        !JSON.parse(res.data)[
                                            "IsApiZtGsensorTurnCapability"
                                        ]["statusCode"])
                                ) {
                                    let resData = JSON.parse(res.data);
                                    let isapiInfo = {};
                                    let isapiCap = {};
                                    isapiInfo["IsApiZtGsensor"] =
                                        resData["IsApiZtGsensor"];
                                    isapiCap["IsApiZtGsensorTurnCapability"] =
                                        resData["IsApiZtGsensorTurnCapability"];
                                    this.templateJSON["configParams"].push({
                                        protocol: [isapiInfo],
                                        params: "",
                                        channelId: -1,
                                        controlPwd: "",
                                    });
                                    resData["IsApiZtGsensorTurnCapability"][
                                        "gsensorTurnType"
                                    ].forEach((item) => {
                                        let params = {
                                            deviceId:
                                                this.$route.query.deviceId ||
                                                null,
                                            commandIds: [
                                                "IsApiZtGsensorTurn",
                                                "IsApiZtGsensorTriggers",
                                                "IsApiZtGsensorTurnCapability",
                                            ],
                                            params: JSON.stringify({
                                                GsensorTurnType: String(item),
                                            }),
                                        };
                                        this.$api
                                            .getDeviceConfigParamsByIsApi(
                                                params
                                            )
                                            .then((res_) => {
                                                if (
                                                    res_.success &&
                                                    res_.data != "{}" &&
                                                    (JSON.parse(res_.data)[
                                                        "IsApiZtGsensorTurnCapability"
                                                    ]["statusCode"] == 0 ||
                                                        !JSON.parse(res_.data)[
                                                            "IsApiZtGsensorTurnCapability"
                                                        ]["statusCode"])
                                                ) {
                                                    let isapiTurn = {};
                                                    let isapiTurnTri = {};
                                                    let isapiTurnCap = {};
                                                    let resData_ = JSON.parse(
                                                        res_.data
                                                    );
                                                    isapiTurn[
                                                        "IsApiZtGsensorTurn"
                                                    ] =
                                                        resData_[
                                                            "IsApiZtGsensorTurn"
                                                        ];
                                                    isapiTurnTri[
                                                        "IsApiZtGsensorTriggers"
                                                    ] =
                                                        resData_[
                                                            "IsApiZtGsensorTriggers"
                                                        ];
                                                    isapiTurnCap[
                                                        "IsApiZtGsensorTurnCapability"
                                                    ] =
                                                        resData_[
                                                            "IsApiZtGsensorTurnCapability"
                                                        ];
                                                    this.templateJSON[
                                                        "configParams"
                                                    ].push({
                                                        protocol: [
                                                            isapiTurn,
                                                            isapiTurnTri,
                                                            isapiTurnCap,
                                                        ],
                                                        params: JSON.stringify({
                                                            GsensorTurnType:
                                                                item,
                                                        }),
                                                        channelId: -1,
                                                        controlPwd: "",
                                                    });
                                                } else {
                                                    this.$message.error(
                                                        `获取设备配置参数失败: ${res.msg}`
                                                    );
                                                    this.moubleJson[
                                                        isapi.replace(
                                                            isapi[0],
                                                            isapi[0].toLowerCase()
                                                        )
                                                    ] = false;
                                                }
                                                this.isapiBol5 = false;
                                            });
                                    });
                                } else {
                                    this.$message.error(
                                        `获取设备配置参数失败: ${res.msg}`
                                    );
                                    this.moubleJson[
                                        isapi.replace(
                                            isapi[0],
                                            isapi[0].toLowerCase()
                                        )
                                    ] = false;
                                    this.isapiBol5 = false;
                                }
                            });
                    } else {
                        let isapiInfo = {};
                        isapiInfo["IsApiZtGsensor"] =
                            this.initData["IsApiZtGsensor"];
                        this.templateJSON["configParams"].push({
                            protocol: [isapiInfo],
                            params: "",
                            channelId: -1,
                            controlPwd: "",
                        });
                        this.initData["IsApiZtGsensorTurnCapability"][
                            "gsensorTurnType"
                        ].forEach((item) => {
                            if (
                                this.initData["IsApiZtGsensorTurn_" + item] ==
                                undefined
                            ) {
                                let params = {
                                    deviceId:
                                        this.$route.query.deviceId || null,
                                    commandIds: [
                                        "IsApiZtGsensorTurn",
                                        "IsApiZtGsensorTriggers",
                                        "IsApiZtGsensorTurnCapability",
                                    ],
                                    params: JSON.stringify({
                                        GsensorTurnType: String(item),
                                    }),
                                };
                                this.$api
                                    .getDeviceConfigParamsByIsApi(params)
                                    .then((res) => {
                                        if (
                                            res.success &&
                                            res.data != "{}" &&
                                            (JSON.parse(res.data)[
                                                "IsApiZtGsensorTurnCapability"
                                            ]["statusCode"] == 0 ||
                                                !JSON.parse(res.data)[
                                                    "IsApiZtGsensorTurnCapability"
                                                ]["statusCode"])
                                        ) {
                                            let isapiTurn = {};
                                            let isapiTurnTri = {};
                                            let isapiCap = {};
                                            let resData = JSON.parse(res.data);
                                            isapiTurn["IsApiZtGsensorTurn"] =
                                                resData["IsApiZtGsensorTurn"];
                                            isapiTurnTri[
                                                "IsApiZtGsensorTriggers"
                                            ] =
                                                resData[
                                                    "IsApiZtGsensorTriggers"
                                                ];
                                            isapiCap[
                                                "IsApiZtGsensorTurnCapability"
                                            ] =
                                                this.initData[
                                                    "IsApiZtGsensorTurnCapability"
                                                ];
                                            this.templateJSON[
                                                "configParams"
                                            ].push({
                                                protocol: [
                                                    isapiTurn,
                                                    isapiTurnTri,
                                                    isapiCap,
                                                ],
                                                params: JSON.stringify({
                                                    GsensorTurnType: item,
                                                }),
                                                channelId: -1,
                                                controlPwd: "",
                                            });
                                        } else {
                                            this.$message.error(
                                                `获取设备配置参数失败: ${res.msg}`
                                            );
                                            this.moubleJson[
                                                isapi.replace(
                                                    isapi[0],
                                                    isapi[0].toLowerCase()
                                                )
                                            ] = false;
                                        }
                                    });
                            } else {
                                let isapiTurn = {};
                                let isapiTurnTri = {};
                                let isapiCap = {};
                                isapiTurn["IsApiZtGsensorTurn"] =
                                    this.initData["IsApiZtGsensorTurn_" + item];
                                isapiTurnTri["IsApiZtGsensorTriggers"] =
                                    this.initData[
                                        "IsApiZtGsensorTriggers_" + item
                                    ];
                                isapiCap["IsApiZtGsensorTurnCapability"] =
                                    this.initData[
                                        "IsApiZtGsensorTurnCapability"
                                    ];
                                this.templateJSON["configParams"].push({
                                    protocol: [
                                        isapiTurn,
                                        isapiTurnTri,
                                        isapiCap,
                                    ],
                                    params: JSON.stringify({
                                        GsensorTurnType: item,
                                    }),
                                    channelId: -1,
                                    controlPwd: "",
                                });
                            }
                        });
                    }
                } else if (isapi == "IsApiSensorInInfoCapability") {
                    if (
                        this.initData["IsApiSensorInInfoCapability"] ==
                        undefined
                    ) {
                        let params_ = {
                            deviceId: this.$route.query.deviceId || null,
                            commandIds: ["IsApiPreviewSwitchInfoCapability"],
                        };
                        this.isapiBol6 = true;
                        this.$api
                            .getDeviceConfigParamsByIsApi(params_)
                            .then((res_) => {
                                if (
                                    res_.success &&
                                    res_.data != "{}" &&
                                    (JSON.parse(res_.data)[
                                        "IsApiPreviewSwitchInfoCapability"
                                    ]["statusCode"] == 0 ||
                                        !JSON.parse(res_.data)[
                                            "IsApiPreviewSwitchInfoCapability"
                                        ]["statusCode"])
                                ) {
                                    let resData_ = JSON.parse(res_.data);
                                    let param = {
                                        deviceId:
                                            this.$route.query.deviceId || null,
                                        commandIds: ["IsApiPreviewSwitchInfo"],
                                        params: JSON.stringify({
                                            groupNo: "0",
                                            videoOutType: "CVBS",
                                        }),
                                    };
                                    this.$api
                                        .getDeviceConfigParamsByIsApi(param)
                                        .then((_res) => {
                                            if (
                                                _res.success &&
                                                _res.data != "{}" &&
                                                (JSON.parse(_res.data)[
                                                    "IsApiPreviewSwitchInfo"
                                                ]["statusCode"] == 0 ||
                                                    !JSON.parse(_res.data)[
                                                        "IsApiPreviewSwitchInfo"
                                                    ]["statusCode"])
                                            ) {
                                                let _resData = JSON.parse(
                                                    _res.data
                                                );
                                                let isapiInfo = {};
                                                let isapiCap = {};
                                                isapiInfo[
                                                    "IsApiPreviewSwitchInfo"
                                                ] =
                                                    _resData[
                                                        "IsApiPreviewSwitchInfo"
                                                    ];
                                                isapiCap[
                                                    "IsApiPreviewSwitchInfoCapability"
                                                ] =
                                                    resData_[
                                                        "IsApiPreviewSwitchInfoCapability"
                                                    ];
                                                this.templateJSON[
                                                    "configParams"
                                                ].push({
                                                    protocol: [
                                                        isapiInfo,
                                                        isapiCap,
                                                    ],
                                                    params: "",
                                                    channelId: -1,
                                                    controlPwd: "",
                                                });
                                            } else {
                                                this.$message.error(
                                                    "显示输出设置保存为模板时不会保存本地预览切换参数，该参数获取失败:" +
                                                        _res.msg
                                                );
                                            }
                                        });
                                } else {
                                    this.$message.error(
                                        "显示输出设置保存为模板时不会保存本地预览切换参数，该参数获取失败:" +
                                            res_.msg
                                    );
                                }
                                this.isapiBol6 = false;
                            });
                        let params = {
                            deviceId: this.$route.query.deviceId || null,
                            commandIds: ["IsApiSensorInInfoCapability"],
                        };
                        this.isapiBol6 = true;
                        this.$api
                            .getDeviceConfigParamsByIsApi(params)
                            .then((res) => {
                                if (
                                    res.success &&
                                    res.data != "{}" &&
                                    (JSON.parse(res.data)[
                                        "IsApiSensorInInfoCapability"
                                    ]["statusCode"] == 0 ||
                                        !JSON.parse(res.data)[
                                            "IsApiSensorInInfoCapability"
                                        ]["statusCode"])
                                ) {
                                    let resData = JSON.parse(res.data);
                                    if (
                                        resData["IsApiSensorInInfoCapability"][
                                            "sensorInCapabilityInfoList"
                                        ].length
                                    ) {
                                        resData["IsApiSensorInInfoCapability"][
                                            "sensorInCapabilityInfoList"
                                        ].forEach((item, index) => {
                                            let params_ = {
                                                deviceId:
                                                    this.$route.query
                                                        .deviceId || null,
                                                commandIds: [
                                                    "IsApiSensorInInfo",
                                                ],
                                                params: JSON.stringify({
                                                    sensorID: item["id"],
                                                }),
                                            };
                                            this.$api
                                                .getDeviceConfigParamsByIsApi(
                                                    params_
                                                )
                                                .then((res_) => {
                                                    if (
                                                        res_.success &&
                                                        res_.data != "{}" &&
                                                        (JSON.parse(res_.data)[
                                                            "IsApiSensorInInfo"
                                                        ]["statusCode"] == 0 ||
                                                            !JSON.parse(
                                                                res_.data
                                                            )[
                                                                "IsApiSensorInInfo"
                                                            ]["statusCode"])
                                                    ) {
                                                        let resData_ =
                                                            JSON.parse(
                                                                res_.data
                                                            );
                                                        let isapiInfo = {};
                                                        let isapiCap = {};
                                                        isapiCap[
                                                            "IsApiSensorInInfoCapability"
                                                        ] =
                                                            resData[
                                                                "IsApiSensorInInfoCapability"
                                                            ];
                                                        isapiInfo[
                                                            "IsApiSensorInInfo"
                                                        ] =
                                                            resData_[
                                                                "IsApiSensorInInfo"
                                                            ];
                                                        this.templateJSON[
                                                            "configParams"
                                                        ].push({
                                                            protocol: [
                                                                isapiInfo,
                                                                isapiCap,
                                                            ],
                                                            params: "",
                                                            channelId: -1,
                                                            controlPwd: "",
                                                        });
                                                    } else {
                                                        this.$message.error(
                                                            "获取设备配置参数失败:" +
                                                                res.msg
                                                        );
                                                        this.moubleJson[
                                                            isapi.replace(
                                                                isapi[0],
                                                                isapi[0].toLowerCase()
                                                            )
                                                        ] = false;
                                                    }
                                                    this.isapiBol6 = false;
                                                });
                                        });
                                    }
                                } else {
                                    this.$message.error(
                                        "获取设备配置参数失败:" + res.msg
                                    );
                                    this.moubleJson[
                                        isapi.replace(
                                            isapi[0],
                                            isapi[0].toLowerCase()
                                        )
                                    ] = false;
                                    this.isapiBol6 = false;
                                }
                            });
                    } else {
                        this.initData["IsApiSensorInInfoCapability"][
                            "sensorInCapabilityInfoList"
                        ].forEach((item, index) => {
                            if (
                                this.initData["IsApiSensorInInfo_" + index] !=
                                undefined
                            ) {
                                let isapiInfo = {};
                                let isapiCap = {};
                                isapiInfo["IsApiSensorInInfo"] =
                                    this.initData["IsApiSensorInInfo_" + index];
                                isapiCap["IsApiSensorInInfoCapability"] =
                                    this.initData[
                                        "IsApiSensorInInfoCapability"
                                    ];
                                this.templateJSON["configParams"].push({
                                    protocol: [isapiInfo, isapiCap],
                                    params: "",
                                    channelId: -1,
                                    controlPwd: "",
                                });
                            } else {
                                let params = {
                                    deviceId:
                                        this.$route.query.deviceId || null,
                                    commandIds: ["IsApiSensorInInfo"],
                                    params: JSON.stringify({
                                        sensorID: item["id"],
                                    }),
                                };
                                this.isapiBol6 = true;
                                this.$api
                                    .getDeviceConfigParamsByIsApi(params)
                                    .then((res) => {
                                        if (
                                            res.success &&
                                            res.data != "{}" &&
                                            (JSON.parse(res.data)[
                                                "IsApiSensorInInfo"
                                            ]["statusCode"] == 0 ||
                                                !JSON.parse(res.data)[
                                                    "IsApiSensorInInfo"
                                                ]["statusCode"])
                                        ) {
                                            let resData = JSON.parse(res.data);
                                            let isapiInfo = {};
                                            let isapiCap = {};
                                            isapiCap[
                                                "IsApiSensorInInfoCapability"
                                            ] =
                                                this.initData[
                                                    "IsApiSensorInInfoCapability"
                                                ];
                                            isapiInfo["IsApiSensorInInfo"] =
                                                resData["IsApiSensorInInfo"];
                                            this.templateJSON[
                                                "configParams"
                                            ].push({
                                                protocol: [isapiInfo, isapiCap],
                                                params: "",
                                                channelId: -1,
                                                controlPwd: "",
                                            });
                                        } else {
                                            this.$message.error(
                                                "获取设备配置参数失败:" +
                                                    res.msg
                                            );
                                            this.moubleJson[
                                                isapi.replace(
                                                    isapi[0],
                                                    isapi[0].toLowerCase()
                                                )
                                            ] = false;
                                        }
                                        this.isapiBol6 = false;
                                    });
                            }
                        });
                        //default页是否存在
                        if (
                            this.initData["IsApiPreviewSwitchInfo"] == undefined
                        ) {
                            let params_ = {
                                deviceId: this.$route.query.deviceId || null,
                                commandIds: [
                                    "IsApiPreviewSwitchInfoCapability",
                                ],
                            };
                            this.isapiBol6 = true;
                            this.$api
                                .getDeviceConfigParamsByIsApi(params_)
                                .then((res_) => {
                                    if (
                                        res_.success &&
                                        res_.data != "{}" &&
                                        (JSON.parse(res_.data)[
                                            "IsApiPreviewSwitchInfoCapability"
                                        ]["statusCode"] == 0 ||
                                            !JSON.parse(res_.data)[
                                                "IsApiPreviewSwitchInfoCapability"
                                            ]["statusCode"])
                                    ) {
                                        let resData_ = JSON.parse(res_.data);
                                        let params = {
                                            deviceId:
                                                this.$route.query.deviceId ||
                                                null,
                                            commandIds: [
                                                "IsApiPreviewSwitchInfo",
                                            ],
                                            params: JSON.stringify({
                                                groupNo: "0",
                                                videoOutType: "CVBS",
                                            }),
                                        };
                                        this.$api
                                            .getDeviceConfigParamsByIsApi(
                                                params
                                            )
                                            .then((res) => {
                                                if (
                                                    res.success &&
                                                    res.data != "{}" &&
                                                    (JSON.parse(res.data)[
                                                        "IsApiPreviewSwitchInfo"
                                                    ]["statusCode"] == 0 ||
                                                        !JSON.parse(res.data)[
                                                            "IsApiPreviewSwitchInfo"
                                                        ]["statusCode"])
                                                ) {
                                                    let resData = JSON.parse(
                                                        res.data
                                                    );
                                                    let isapiInfo = {};
                                                    let isapiCap = {};
                                                    isapiCap[
                                                        "IsApiPreviewSwitchInfoCapability"
                                                    ] =
                                                        resData_[
                                                            "IsApiPreviewSwitchInfoCapability"
                                                        ];
                                                    isapiInfo[
                                                        "IsApiPreviewSwitchInfo"
                                                    ] =
                                                        resData[
                                                            "IsApiPreviewSwitchInfo"
                                                        ];
                                                    this.templateJSON[
                                                        "configParams"
                                                    ].push({
                                                        protocol: [
                                                            isapiInfo,
                                                            isapiCap,
                                                        ],
                                                        params: "",
                                                        channelId: -1,
                                                        controlPwd: "",
                                                    });
                                                } else {
                                                    this.$message.error(
                                                        "显示输出设置保存为模板时不会保存本地预览切换参数，该参数获取失败:" +
                                                            res.msg
                                                    );
                                                }
                                                this.isapiBol6 = false;
                                            });
                                    } else {
                                        this.$message.error(
                                            "显示输出设置保存为模板时不会保存本地预览切换参数，该参数获取失败:" +
                                                res_.msg
                                        );
                                        this.isapiBol6 = false;
                                    }
                                });
                        } else {
                            let isapiInfo = {};
                            let isapiCap = {};
                            isapiCap["IsApiPreviewSwitchInfoCapability"] =
                                this.initData[
                                    "IsApiPreviewSwitchInfoCapability"
                                ];
                            isapiInfo["IsApiPreviewSwitchInfo"] =
                                this.initData["IsApiPreviewSwitchInfo"];
                            this.templateJSON["configParams"].push({
                                protocol: [isapiInfo, isapiCap],
                                params: "",
                                channelId: -1,
                                controlPwd: "",
                            });
                        }
                    }
                } else {
                    if (this.initData[isapi] == undefined) {
                        const params = {
                            deviceId: this.$route.query.deviceId || null,
                            commandIds: [isapi],
                        };
                        this.isapiBol7 = true;
                        this.$api
                            .getDeviceConfigParamsByIsApi(params)
                            .then((res) => {
                                if (
                                    res.success &&
                                    res.data != "{}" &&
                                    (JSON.parse(res.data)[isapi][
                                        "statusCode"
                                    ] == 0 ||
                                        !JSON.parse(res.data)[isapi][
                                            "statusCode"
                                        ])
                                ) {
                                    let resData = JSON.parse(res.data);
                                    let isapiInfo = {};
                                    let isapiCap = {};
                                    isapiInfo[isapi] = resData[isapi];
                                    isapiCap[isapi + "Capability"] =
                                        resData[isapi + "Capability"];
                                    this.templateJSON["configParams"].push({
                                        protocol: [isapiInfo, isapiCap],
                                        params: "",
                                        channelId: -1,
                                        controlPwd: "",
                                    });
                                } else {
                                    this.$message.error(
                                        "获取设备配置参数失败:" + res.msg
                                    );
                                    this.moubleJson[
                                        isapi.replace(
                                            isapi[0],
                                            isapi[0].toLowerCase()
                                        )
                                    ] = false;
                                }
                                this.isapiBol7 = false;
                            });
                    } else {
                        let isapiInfo = {};
                        let isapiCap = {};
                        isapiInfo[isapi] = this.initData[isapi];
                        isapiCap[isapi + "Capability"] =
                            this.initData[isapi + "Capability"];
                        this.templateJSON["configParams"].push({
                            protocol: [isapiInfo, isapiCap],
                            params: "",
                            channelId: -1,
                            controlPwd: this.aesPassword,
                        });
                    }
                }
            } else {
                this.templateJSON["configParams"].forEach((item, index) => {
                    if (isapi == "IsApiSensorInInfoCapability") {
                        for (let key in item["protocol"][0]) {
                            if (key == "IsApiSensorInInfo") {
                                this.templateJSON["configParams"].splice(
                                    index,
                                    1
                                );
                            }
                            if (key == "IsApiPreviewSwitchInfo") {
                                this.templateJSON["configParams"].splice(
                                    index,
                                    1
                                );
                            }
                        }
                    } else {
                        for (let key in item["protocol"][0]) {
                            if (key == isapi) {
                                this.templateJSON["configParams"].splice(
                                    index,
                                    1
                                );
                            }
                        }
                    }
                });
            }
        },
        //设备所支持的ISAPI协议转为模板协议
        templateJsonGet() {
            let json = {};
            for (let key in this.json) {
                json[key] = false;
            }
            this.moubleJson = json;
            this.copyMoubleJson = JSON.parse(JSON.stringify(json));
        },
        showMoubleContent(val) {
            this.moubleBol = val;
        },
        //依赖设备ISAPI协议能力集的左侧协议列表
        makeIsapiMenu(type) {
            let json;
            if (type) {
                json = JSON.parse(this.json)["IsApiDeviceCapability"];
                this.sideBarItem2 = [];
            } else {
                json = this.moubleJson;
                this.moubleMenu = [];
            }
            let carDeviceJson = {
                title: "车辆设备",
                index: "1",
                children: [],
            };
            json["isApiApnInfo"]
                ? carDeviceJson["children"].push({
                      label: "注册参数",
                      value: "PublicVehicleRegistration",
                      commandIdList: ["0081", "0082", "0083", "0084"],
                  })
                : "";
            let PublicVehicleInfoCommandIdList = [];
            json["isApiRegisterInfo"]
                ? PublicVehicleInfoCommandIdList.push("IsApiRegisterInfo")
                : "";
            json["isApiVehicleRecord"]
                ? PublicVehicleInfoCommandIdList.push("IsApiVehicleRecord")
                : "";
            json["isApiDriverCard"]
                ? PublicVehicleInfoCommandIdList.push("IsApiDriverCard")
                : "";
            json["isApiRegisterInfo"] ||
            json["isApiVehicleRecord"] ||
            json["isApiDriverCard"]
                ? carDeviceJson["children"].push({
                      label: "车辆信息",
                      value: "PublicVehicleInfo",
                      commandIdList: PublicVehicleInfoCommandIdList,
                  })
                : "";
            json["isApiShutdownCfgInfo"]
                ? carDeviceJson["children"].push({
                      label: "延时关机时间",
                      value: "PublicShutDown",
                      commandIdList: ["IsApiShutdownCfgInfo"],
                  })
                : "";
            let PublicShutDownInfoCommandIdList = [];
            json["isApiAlarmAudioInfo"]
                ? PublicShutDownInfoCommandIdList.push("IsApiAlarmAudioInfo")
                : "";
            json["isApiSysAudioInfo"]
                ? PublicShutDownInfoCommandIdList.push("IsApiSysAudioInfo")
                : "";
            json["isApiAlarmAudioInfo"] || json["isApiSysAudioInfo"]
                ? carDeviceJson["children"].push({
                      label: "音量设置",
                      value: "PublicVolume",
                      commandIdList: PublicShutDownInfoCommandIdList,
                  })
                : "";
            let moreCenterJson = {
                title: "多中心设置",
                index: "11",
                children: [],
            };
            //json['isApiPlatformAlarm'] ? moreCenterJson['children'].push({label:'中心报警参数',value:'PublicPlatFormAlarm',commandIdList:['IsApiPlatformAlarm']}) : '';
            json["isApiPlatform"]
                ? moreCenterJson["children"].push(
                      {
                          label: "第1中心",
                          value: "firstCenterPublic",
                          commandIdList: ["IsApiPlatformOthers0"],
                      },
                      {
                          label: "第2中心",
                          value: "secondCenterPublic",
                          commandIdList: ["IsApiPlatformOthers1"],
                      },
                      {
                          label: "第3中心",
                          value: "thirdCenterPublic",
                          commandIdList: ["IsApiPlatformOthers2"],
                      },
                      {
                          label: "第4中心",
                          value: "forthCenterPublic",
                          commandIdList: ["IsApiPlatformOthers3"],
                      },
                      {
                          label: "第5中心",
                          value: "fifthCenterPublic",
                          commandIdList: ["IsApiPlatformOthers4"],
                      },
                      {
                          label: "第6中心",
                          value: "sixthCenterPublic",
                          commandIdList: ["IsApiPlatformOthers5"],
                      }
                  )
                : "";
            let adasCommandIdList = [];
            let adasIsApiTriggerInfoList = [];
            let adasCapabilityList = [];
            let dbaCommandIdList = [];
            let dbaIsApiTriggerInfoList = [];
            let dbaCapabilityList = [];
            let bsdCommandIdList = [];
            let bsdIsApiTriggerInfoList = [];
            let bsdCapabilityList = [];
            let whdCommandIdList = [];
            let whdIsApiTriggerInfoList = [];
            let whdCapabilityList = [];
            let activeSaveJson = {
                title: "主动安全设置",
                index: "3.1",
                children: [],
            };
            json["isApiAdasGlobal"]
                ? adasIsApiTriggerInfoList.push("IsApiAdasGlobal")
                : "";
            json["isApiDBAGlobal"]
                ? dbaIsApiTriggerInfoList.push("IsApiDBAGlobal")
                : "";
            json["isApiWhdInfo"]
                ? whdIsApiTriggerInfoList.push("IsApiWhdInfo")
                : "";
            json["isApiFcwInfoList"]
                ? this.childrenList(
                      adasCommandIdList,
                      adasIsApiTriggerInfoList,
                      adasCapabilityList,
                      "IsApiFcwInfoList",
                      "IsApiFcwTriggerInfo",
                      "IsApiFcwInfoListCapability"
                  )
                : "";
            json["isApiHmwInfoList"]
                ? this.childrenList(
                      adasCommandIdList,
                      adasIsApiTriggerInfoList,
                      adasCapabilityList,
                      "IsApiHmwInfoList",
                      "IsApiHmwTriggerInfo",
                      "IsApiHmwInfoListCapability"
                  )
                : "";
            json["isApiLdwInfoList"]
                ? this.childrenList(
                      adasCommandIdList,
                      adasIsApiTriggerInfoList,
                      adasCapabilityList,
                      "IsApiLdwInfoList",
                      "IsApiLdwTriggerInfo",
                      "IsApiLdwInfoListCapability"
                  )
                : "";
            json["isApiPcwInfoList"]
                ? this.childrenList(
                      adasCommandIdList,
                      adasIsApiTriggerInfoList,
                      adasCapabilityList,
                      "IsApiPcwInfoList",
                      "IsApiPcwTriggerInfo",
                      "IsApiPcwInfoListCapability"
                  )
                : "";
            json["isApiTsrInfoList"]
                ? this.childrenList(
                      adasCommandIdList,
                      adasIsApiTriggerInfoList,
                      adasCapabilityList,
                      "IsApiTsrInfoList",
                      "IsApiTsrTriggerInfo",
                      "IsApiTsrInfoListCapability"
                  )
                : "";
            json["isApiDriverEyeClosedInfo"]
                ? this.childrenList(
                      dbaCommandIdList,
                      dbaIsApiTriggerInfoList,
                      dbaCapabilityList,
                      "IsApiDriverEyeClosedInfo",
                      "IsApiDriverEyeClosedTriggerList",
                      "IsApiDriverEyeClosedInfoCapability"
                  )
                : "";
            json["isApiDriverCallingInfo"]
                ? this.childrenList(
                      dbaCommandIdList,
                      dbaIsApiTriggerInfoList,
                      dbaCapabilityList,
                      "IsApiDriverCallingInfo",
                      "IsApiDriverCallingTriggerList",
                      "IsApiDriverCallingInfoCapability"
                  )
                : "";
            json["isApiDriverSmokingInfo"]
                ? this.childrenList(
                      dbaCommandIdList,
                      dbaIsApiTriggerInfoList,
                      dbaCapabilityList,
                      "IsApiDriverSmokingInfo",
                      "IsApiDriverSmokingTriggerList",
                      "IsApiDriverSmokingInfoCapability"
                  )
                : "";
            json["isApiDriverInattentionInfo"]
                ? this.childrenList(
                      dbaCommandIdList,
                      dbaIsApiTriggerInfoList,
                      dbaCapabilityList,
                      "IsApiDriverInattentionInfo",
                      "IsApiDriverInattentionTriggerList",
                      "IsApiDriverInattentionInfoCapability"
                  )
                : "";
            json["isApiDriverAbsentedInfo"]
                ? this.childrenList(
                      dbaCommandIdList,
                      dbaIsApiTriggerInfoList,
                      dbaCapabilityList,
                      "IsApiDriverAbsentedInfo",
                      "IsApiDriverAbsentedInfo",
                      "IsApiDriverAbsentedInfoCapability"
                  )
                : "";
            json["isApiDriverBlockCameraInfo"]
                ? this.childrenList(
                      dbaCommandIdList,
                      dbaIsApiTriggerInfoList,
                      dbaCapabilityList,
                      "IsApiDriverBlockCameraInfo",
                      "IsApiDriverBlockCameraTriggerList",
                      "IsApiDriverBlockCameraInfoCapability"
                  )
                : "";
            json["isApiDriverSafetyBeltInfo"]
                ? this.childrenList(
                      dbaCommandIdList,
                      dbaIsApiTriggerInfoList,
                      dbaCapabilityList,
                      "IsApiDriverSafetyBeltInfo",
                      "IsApiDriverSafetyBeltTriggerList",
                      "IsApiDriverSafetyBeltInfoCapability"
                  )
                : "";
            json["isApiDriverSunglassesInfo"]
                ? this.childrenList(
                      dbaCommandIdList,
                      dbaIsApiTriggerInfoList,
                      dbaCapabilityList,
                      "IsApiDriverSunglassesInfo",
                      "IsApiDriverSunglassesTriggerList",
                      "IsApiDriverSunglassesInfoCapability"
                  )
                : "";
            json["isApiRapidAccelerationInfo"]
                ? this.childrenList(
                      dbaCommandIdList,
                      dbaIsApiTriggerInfoList,
                      dbaCapabilityList,
                      "IsApiRapidAccelerationInfo",
                      "IsApiRapidAccelerationTriggerList",
                      "IsApiRapidAccelerationInfoCapability"
                  )
                : "";
            json["isApiRapidDecelerationInfo"]
                ? this.childrenList(
                      dbaCommandIdList,
                      dbaIsApiTriggerInfoList,
                      dbaCapabilityList,
                      "IsApiRapidDecelerationInfo",
                      "IsApiRapidDecelerationTriggerList",
                      "IsApiRapidDecelerationInfoCapability"
                  )
                : "";
            json["isApiRapidTurnInfo"]
                ? this.childrenList(
                      dbaCommandIdList,
                      dbaIsApiTriggerInfoList,
                      dbaCapabilityList,
                      "IsApiRapidTurnInfo",
                      "IsApiRapidTurnTriggerList",
                      "IsApiRapidTurnInfoCapability"
                  )
                : "";
            json["isApiDriverAbnormaInfo"]
                ? this.childrenList(
                      dbaCommandIdList,
                      dbaIsApiTriggerInfoList,
                      dbaCapabilityList,
                      "IsApiDriverAbnormaInfo",
                      "IsApiDriverAbnormaTriggerList",
                      "IsApiDriverAbnormaInfoCapability"
                  )
                : "";
            json["isApiBsdInfo"]
                ? this.childrenList(
                      bsdCommandIdList,
                      bsdIsApiTriggerInfoList,
                      bsdCapabilityList,
                      "IsApiBsdInfo",
                      "IsApiBsdTriggerList",
                      "IsApiBsdInfoCapability"
                  )
                : "";
            json["isApiWhdNoHandInfo"]
                ? this.childrenList(
                      whdCommandIdList,
                      whdIsApiTriggerInfoList,
                      whdCapabilityList,
                      "IsApiWhdNoHandInfo",
                      "IsApiWhdNoHandTriggerList",
                      "IsApiWhdNoHandInfoCapability"
                  )
                : "";
            json["isApiWhdSingleHandInfo"]
                ? this.childrenList(
                      whdCommandIdList,
                      whdIsApiTriggerInfoList,
                      whdCapabilityList,
                      "IsApiWhdSingleHandInfo",
                      "IsApiWhdSingleHandTriggerList",
                      "IsApiWhdNoHandInfoCapability"
                  )
                : "";
            json["isApiWhdPlayMobilePhoneInfo"]
                ? this.childrenList(
                      whdCommandIdList,
                      whdIsApiTriggerInfoList,
                      whdCapabilityList,
                      "IsApiWhdPlayMobilePhoneInfo",
                      "IsApiWhdPlayMobilePhoneTriggerList",
                      "IsApiWhdPlayMobilePhoneInfoCapability"
                  )
                : "";
            json["isApiAdasGlobal"] ||
            json["isApiFcwInfoList"] ||
            json["isApiHmwInfoList"] ||
            json["isApiLdwInfoList"] ||
            json["isApiPcwInfoList"] ||
            json["isApiTsrInfoList"]
                ? activeSaveJson["children"].push({
                      label: "ADAS",
                      value: "PublicAdas",
                      commandIdList: adasCommandIdList,
                      IsApiTriggerInfoList: adasIsApiTriggerInfoList,
                      capabilityList: adasCapabilityList,
                  })
                : "";
            json["isApiDBAGlobal"] ||
            json["isApiDriverAbnormaInfo"] ||
            json["isApiRapidTurnInfo"] ||
            json["isApiRapidDecelerationInfo"] ||
            json["isApiRapidAccelerationInfo"] ||
            json["isApiDriverEyeClosedInfo"] ||
            json["isApiDriverCallingInfo"] ||
            json["isApiDriverSmokingInfo"] ||
            json["isApiDriverInattentionInfo"] ||
            json["isApiDriverAbsentedInfo"] ||
            json["isApiDriverBlockCameraInfo"] ||
            json["isApiDriverSafetyBeltInfo"] ||
            json["isApiDriverSunglassesInfo"]
                ? activeSaveJson["children"].push({
                      label: "DBA",
                      value: "PublicDba",
                      commandIdList: dbaCommandIdList,
                      IsApiTriggerInfoList: dbaIsApiTriggerInfoList,
                      capabilityList: dbaCapabilityList,
                  })
                : "";
            json["isApiBsdInfo"]
                ? activeSaveJson["children"].push({
                      label: "BSD",
                      value: "PublicBsd",
                      commandIdList: bsdCommandIdList,
                      IsApiTriggerInfoList: bsdIsApiTriggerInfoList,
                      capabilityList: bsdCapabilityList,
                  })
                : "";
            json["isApiWhdInfo"] ||
            json["isApiWhdNoHandInfo"] ||
            json["isApiWhdSingleHandInfo"] ||
            json["isApiWhdPlayMobilePhoneInfo"]
                ? activeSaveJson["children"].push({
                      label: "WHD/玩手机",
                      value: "WhdPublic",
                      commandIdList: whdCommandIdList,
                      IsApiTriggerInfoList: whdIsApiTriggerInfoList,
                      capabilityList: whdCapabilityList,
                  })
                : "";
            let alarmIntercalateJson = {
                title: "报警设置",
                index: "4",
                children: [],
            };
            json["isApiSpeedingOthers"]
                ? alarmIntercalateJson["children"].push({
                      label: "超速报警",
                      value: "PublicOverspeed",
                      commandIdList: ["IsApiSpeedingOthers"],
                  })
                : "";
            json["isApiFatigueDrivingOthers"]
                ? alarmIntercalateJson["children"].push({
                      label: "疲劳驾驶",
                      value: "PublicFatigueDriving",
                      commandIdList: ["IsApiFatigueDrivingOthers"],
                  })
                : "";
            let peripheralOutJson = {
                title: "外设输出设置",
                index: "12",
                children: [],
            };
            json["isApiSerialInfo"]
                ? peripheralOutJson["children"].push({
                      label: "声光报警器",
                      value: "PublicSerial",
                      commandIdList: ["IsApiSerialInfo"],
                  })
                : "";
            json["isApiProgramMgrInfo"] || json["isApiSensorInInfoCapability"]
                ? peripheralOutJson["children"].push({
                      label: "视频输出设置",
                      value: "PublicProgramMgr",
                      commandIdList: ["IsApiProgramMgrInfo"],
                  })
                : "";
            let muckCarJson = {
                title: "渣土车配置",
                index: "13",
                children: [],
            };
            json["isApiZtWorkMode"]
                ? muckCarJson["children"].push({
                      label: "工作模式",
                      value: "PublicWorkMode",
                      commandIdList: ["IsApiZtWorkMode"],
                  })
                : "";
            json["isApiZtInvalidAlarm"]
                ? muckCarJson["children"].push({
                      label: "业务报警",
                      value: "PublicInvalidAlarm",
                      commandIdList: ["IsApiZtInvalidAlarm"],
                  })
                : "";
            json["isApiZtTcss"]
                ? muckCarJson["children"].push({
                      label: "货箱状态",
                      value: "PublicTcss",
                      commandIdList: ["IsApiZtTcss"],
                  })
                : "";
            json["isApiZtLed"]
                ? muckCarJson["children"].push({
                      label: "外屏参数",
                      value: "PublicLed",
                      commandIdList: ["IsApiZtLed"],
                  })
                : "";
            json["isApiZtVehctrl"]
                ? muckCarJson["children"].push({
                      label: "控车参数",
                      value: "PublicVehctrl",
                      commandIdList: ["IsApiZtVehctrl"],
                  })
                : "";
            json["isApiZtScreenCtrl"]
                ? muckCarJson["children"].push({
                      label: "安卓屏控制",
                      value: "PublicCtrl",
                      commandIdList: ["IsApiZtScreenCtrl"],
                  })
                : "";
            json["isApiZtGsensor"]
                ? muckCarJson["children"].push({
                      label: "路口报警",
                      value: "PublicGsensor",
                      commandIdList: [
                          "IsApiZtGsensor",
                          "IsApiZtGsensorTurn",
                          "IsApiZtGsensorTriggers",
                      ],
                  })
                : "";
            json["isApiZtEcuProtocol"]
                ? muckCarJson["children"].push({
                      label: "发动机控车",
                      value: "PublicEcu",
                      commandIdList: ["IsApiZtEcuProtocol"],
                  })
                : "";
            if (type) {
                carDeviceJson["children"].length
                    ? this.sideBarItem2.push(carDeviceJson)
                    : "";
                moreCenterJson["children"].length
                    ? this.sideBarItem2.push(moreCenterJson)
                    : "";
                activeSaveJson["children"].length
                    ? this.sideBarItem2.push(activeSaveJson)
                    : "";
                alarmIntercalateJson["children"].length
                    ? this.sideBarItem2.push(alarmIntercalateJson)
                    : "";
                peripheralOutJson["children"].length
                    ? this.sideBarItem2.push(peripheralOutJson)
                    : "";
                muckCarJson["children"].length
                    ? this.sideBarItem2.push(muckCarJson)
                    : "";
                if (!this.sideBarItem2.length) {
                    this.$message.error("该设备暂不支持所有ISAPI透传协议");
                }
            } else {
                carDeviceJson["children"].length
                    ? this.moubleMenu.push(carDeviceJson)
                    : "";
                moreCenterJson["children"].length
                    ? this.moubleMenu.push(moreCenterJson)
                    : "";
                activeSaveJson["children"].length
                    ? this.moubleMenu.push(activeSaveJson)
                    : "";
                alarmIntercalateJson["children"].length
                    ? this.moubleMenu.push(alarmIntercalateJson)
                    : "";
                peripheralOutJson["children"].length
                    ? this.moubleMenu.push(peripheralOutJson)
                    : "";
                muckCarJson["children"].length
                    ? this.moubleMenu.push(muckCarJson)
                    : "";
            }
        },
        //支持多个协议的children里的各个List处理
        childrenList(
            commandIdList,
            IsApiTriggerInfoList,
            capabilityList,
            isapi,
            isapiTriggerList,
            isapiCapability
        ) {
            commandIdList.push(isapi);
            IsApiTriggerInfoList.push(isapiTriggerList);
            capabilityList.push(isapiCapability);
        },
        //获取设备支持协议能力集
        // getIsApiDeviceCapability(){
        //   let params = {
        //     deviceId:this.$route.query.deviceId,
        //     commandIds:['IsApiDeviceCapability']
        //   }
        //   this.$api.getDeviceConfigParamsByIsApi(params).then(res =>{
        //     console.log(res)
        //   })
        // },
        getChannel(val) {
            this.channelForm = val;
        },
        getCopyChannel(val) {
            this.copyChannelData = val;
        },
        close() {
            this.updateBol = false;
        },
        closeMouble() {
            this.moubleBol = false;
        },
        unlockClose() {
            this.unlockBol = false;
            this.moubleJson["isApiZtVehctrl"] = false;
            // this.moubleJson = JSON.parse(JSON.stringify(this.copyMoubleJson));
            // this.templateJSON['configParams'].push(
            //   {
            //     protocol: [],
            //     params: '',
            //     channelId: -1,
            //     controlPwd: ''
            //   }
            // )
        },
        unlockSure() {
            let params = { controlPwd: AES.encrypt(this.checkPassword) };
            this.$api.checkZtControlPwd(params).then((res) => {
                if (res.success) {
                    this.$message.success("解锁成功");
                    let param = {
                        deviceId: this.$route.query.deviceId || null,
                        commandIds: ["IsApiZtVehctrl"],
                        controlPwd: AES.encrypt(this.checkPassword),
                    };
                    this.isapiBol2 = true;
                    this.$api
                        .getDeviceConfigParamsByIsApi(param)
                        .then((res_) => {
                            if (
                                res_.success &&
                                res_.data != "{}" &&
                                (JSON.parse(res_.data)["IsApiZtVehctrl"][
                                    "statusCode"
                                ] == 0 ||
                                    !JSON.parse(res_.data)["IsApiZtVehctrl"][
                                        "statusCode"
                                    ])
                            ) {
                                let resData = JSON.parse(res_.data);
                                let isapiInfo = {
                                    IsApiZtVehctrl: resData["IsApiZtVehctrl"],
                                };
                                let isapiCap = {
                                    IsApiZtVehctrlCapability:
                                        resData["IsApiZtVehctrlCapability"],
                                };
                                this.templateJSON["configParams"].push({
                                    protocol: [isapiInfo, isapiCap],
                                    params: "",
                                    channelId: -1,
                                    controlPwd: AES.encrypt(this.checkPassword),
                                });
                                this.unlockBol = false;
                                let this_ = this;
                                setTimeout(() => {
                                    this_.moubleJson["isApiZtVehctrl"] = true;
                                });
                            } else {
                                this.$message.error(
                                    "获取设备配置参数失败:" + res.msg
                                );
                                this.moubleJson["isApiZtVehctrl"] = false;
                                this.unlockBol = false;
                            }
                            this.isapiBol2 = false;
                        });
                } else {
                    this.$message.error(`解锁失败：${res.msg}`);
                    this.moubleJson["isApiZtVehctrl"] = false;
                    this.unlockBol = false;
                    this.isapiBol2 = false;
                }
            });
        },
        prepareOk() {
            let moubleJsonBol = false;
            for (let key in this.moubleJson) {
                if (this.moubleJson[key]) {
                    moubleJsonBol = true;
                }
            }
            if (!moubleJsonBol) {
                this.$message.info("请至少勾选一个模块存为模板");
                return;
            }
            this.makeIsapiMenu(0);
            this.moubleBol = false;
            this.templateVisible = true;
        },
        //批量下发
        updateSure() {
            if (!this.dataList.length) {
                this.$message.info("您未修改任何配置项，请修改后下发");
                return;
            }
            let keys = [];
            let dataListItem = [];
            this.dataList.forEach((item) => {
                if (item[0].split(".")[0] == "IsApiPlatform") {
                    keys.push("IsApiPlatform_" + item[0].split(".")[2]);
                    dataListItem.push([
                        "IsApiPlatform_" + item[0].split(".")[2],
                        "platformInfoList",
                        item[0].split(".")[2],
                        "protocolType",
                    ]);
                }
                keys.push(item[0].split(".")[0]);
                dataListItem.push(item[0].split("."));
            });
            //paramBefor:'dataList'
            //let configParamsKeys = [... new Set(keys)];
            let configParamsKeys = keys;
            let configParams = {};
            configParamsKeys.forEach((item, index) => {
                switch (dataListItem[index].length) {
                    case 3:
                        configParams[item] =
                            this.channelForm[
                                "channel_" + dataListItem[index][2]
                            ][item.substring(0, item.length - 2)];
                        break;
                    case 4:
                        switch (item) {
                            case "IsApiPlatform_0":
                                configParams[item] = JSON.parse(
                                    JSON.stringify(
                                        this.initData["IsApiPlatform"]
                                    )
                                );
                                configParams[item]["platformInfoList"] =
                                    this.initData["IsApiPlatform"][
                                        "platformInfoList"
                                    ][0];
                                break;
                            case "IsApiPlatform_1":
                                configParams[item] = JSON.parse(
                                    JSON.stringify(
                                        this.initData["IsApiPlatform"]
                                    )
                                );
                                configParams[item]["platformInfoList"] =
                                    this.initData["IsApiPlatform"][
                                        "platformInfoList"
                                    ][1];
                                break;
                            case "IsApiPlatform_2":
                                configParams[item] = JSON.parse(
                                    JSON.stringify(
                                        this.initData["IsApiPlatform"]
                                    )
                                );
                                configParams[item]["platformInfoList"] =
                                    this.initData["IsApiPlatform"][
                                        "platformInfoList"
                                    ][2];
                                break;
                            case "IsApiPlatform_3":
                                configParams[item] = JSON.parse(
                                    JSON.stringify(
                                        this.initData["IsApiPlatform"]
                                    )
                                );
                                configParams[item]["platformInfoList"] =
                                    this.initData["IsApiPlatform"][
                                        "platformInfoList"
                                    ][3];
                                break;
                            case "IsApiPlatform_4":
                                configParams[item] = JSON.parse(
                                    JSON.stringify(
                                        this.initData["IsApiPlatform"]
                                    )
                                );
                                configParams[item]["platformInfoList"] =
                                    this.initData["IsApiPlatform"][
                                        "platformInfoList"
                                    ][4];
                                break;
                            case "IsApiPlatform_5":
                                configParams[item] = JSON.parse(
                                    JSON.stringify(
                                        this.initData["IsApiPlatform"]
                                    )
                                );
                                configParams[item]["platformInfoList"] =
                                    this.initData["IsApiPlatform"][
                                        "platformInfoList"
                                    ][5];
                                break;
                            case "IsApiSysAudioInfo":
                                configParams[item] = JSON.parse(
                                    JSON.stringify(this.initData[item])
                                );
                                break;
                            default:
                                configParams[item] = JSON.parse(
                                    JSON.stringify(this.initData[item])
                                );
                                break;
                        }
                        break;
                    case 7:
                        configParams[item] =
                            this.channelForm[
                                "channel_" + dataListItem[index][4]
                            ][item.substring(0, item.length - 2)];
                        break;
                    case 8:
                        configParams[item] =
                            this.channelForm[
                                "channel_" + dataListItem[index][7]
                            ][item.substring(0, item.length - 2)];
                        break;
                    default:
                        configParams[item] = this.initData[item];
                        break;
                }
            });
            this.dataListMoubles = configParams;
            let specialConfigParams = {}; //下发或结构特殊协议
            let currencyConfigParams = {}; //下发或结构通用协议
            let centerConfigParams = {}; //多中心协议
            for (let key in configParams) {
                if (
                    key == "IsApiZtVehctrl" ||
                    key == "IsApiPlatform" ||
                    key == "IsApiZtGsensorTurn_3" ||
                    key == "IsApiZtGsensorTurn_4" ||
                    key == "IsApiZtGsensorTurn_5" ||
                    key == "IsApiZtGsensorTurn_6" ||
                    key == "IsApiZtGsensorTurn_7" ||
                    key == "IsApiZtGsensorTriggers_3" ||
                    key == "IsApiZtGsensorTriggers_4" ||
                    key == "IsApiZtGsensorTriggers_5" ||
                    key == "IsApiZtGsensorTriggers_6" ||
                    key == "IsApiZtGsensorTriggers_7"
                ) {
                    specialConfigParams[key] = configParams[key];
                } else if (
                    key == "IsApiPlatform_0" ||
                    key == "IsApiPlatform_1" ||
                    key == "IsApiPlatform_2" ||
                    key == "IsApiPlatform_3" ||
                    key == "IsApiPlatform_4" ||
                    key == "IsApiPlatform_5"
                ) {
                    centerConfigParams[key] = configParams[key];
                } else {
                    currencyConfigParams[key] = configParams[key];
                }
            }
            for (let key in specialConfigParams) {
                switch (key) {
                    case "IsApiZtGsensorTurn_3":
                        let type = key.substring(
                            key.indexOf("_") + 1,
                            key.length
                        );
                        let param = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify({
                                IsApiZtGsensorTurn_3: JSON.stringify(
                                    configParams["IsApiZtGsensorTurn_3"]
                                ),
                            }),
                            params: JSON.stringify({ GsensorTurnType: type }),
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(param)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发渣土车配置/路口报警/左转弯超速参数至设备失败:" +
                                            res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                    case "IsApiZtGsensorTurn_4":
                        type = key.substring(key.indexOf("_") + 1, key.length);
                        param = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify({
                                IsApiZtGsensorTurn_4: JSON.stringify(
                                    configParams["IsApiZtGsensorTurn_4"]
                                ),
                            }),
                            params: JSON.stringify({ GsensorTurnType: type }),
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(param)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发渣土车配置/路口报警/右转弯超速参数至设备失败:" +
                                            res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                    case "IsApiZtGsensorTurn_5":
                        type = key.substring(key.indexOf("_") + 1, key.length);
                        param = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify({
                                IsApiZtGsensorTurn_5: JSON.stringify(
                                    configParams["IsApiZtGsensorTurn_5"]
                                ),
                            }),
                            params: JSON.stringify({ GsensorTurnType: type }),
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(param)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发渣土车配置/路口报警/左转弯未打转向灯参数至设备失败:" +
                                            res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                    case "IsApiZtGsensorTurn_6":
                        type = key.substring(key.indexOf("_") + 1, key.length);
                        param = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify({
                                IsApiZtGsensorTurn_6: JSON.stringify(
                                    configParams["IsApiZtGsensorTurn_6"]
                                ),
                            }),
                            params: JSON.stringify({ GsensorTurnType: type }),
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(param)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发渣土车配置/路口报警/右转弯未打转向灯参数至设备失败:" +
                                            res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                    case "IsApiZtGsensorTurn_7":
                        type = key.substring(key.indexOf("_") + 1, key.length);
                        param = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify({
                                IsApiZtGsensorTurn_7: JSON.stringify(
                                    configParams["IsApiZtGsensorTurn_7"]
                                ),
                            }),
                            params: JSON.stringify({ GsensorTurnType: type }),
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(param)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发渣土车配置/路口报警/右转弯未停车参数至设备失败:" +
                                            res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                    //IsApiZtGsensorTriggers_3
                    case "IsApiZtGsensorTriggers_3":
                        type = key.substring(key.indexOf("_") + 1, key.length);
                        param = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify({
                                IsApiZtGsensorTriggers_3: JSON.stringify(
                                    configParams["IsApiZtGsensorTriggers_3"]
                                ),
                            }),
                            params: JSON.stringify({ GsensorTurnType: type }),
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(param)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发渣土车配置/路口报警/左转弯超速音量参数至设备失败:" +
                                            res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                    case "IsApiZtGsensorTriggers_4":
                        type = key.substring(key.indexOf("_") + 1, key.length);
                        param = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify({
                                IsApiZtGsensorTriggers_4: JSON.stringify(
                                    configParams["IsApiZtGsensorTriggers_4"]
                                ),
                            }),
                            params: JSON.stringify({ GsensorTurnType: type }),
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(param)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发渣土车配置/路口报警/右转弯超速音量参数至设备失败:" +
                                            res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                    case "IsApiZtGsensorTriggers_5":
                        type = key.substring(key.indexOf("_") + 1, key.length);
                        param = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify({
                                IsApiZtGsensorTriggers_5: JSON.stringify(
                                    configParams["IsApiZtGsensorTriggers_5"]
                                ),
                            }),
                            params: JSON.stringify({ GsensorTurnType: type }),
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(param)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发渣土车配置/路口报警/左转弯未打转向灯音量参数至设备失败:" +
                                            res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                    case "IsApiZtGsensorTriggers_6":
                        type = key.substring(key.indexOf("_") + 1, key.length);
                        param = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify({
                                IsApiZtGsensorTriggers_6: JSON.stringify(
                                    configParams["IsApiZtGsensorTriggers_6"]
                                ),
                            }),
                            params: JSON.stringify({ GsensorTurnType: type }),
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(param)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发渣土车配置/路口报警/右转弯未打转向灯音量参数至设备失败:" +
                                            res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                    case "IsApiZtGsensorTriggers_7":
                        type = key.substring(key.indexOf("_") + 1, key.length);
                        param = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify({
                                IsApiZtGsensorTriggers_7: JSON.stringify(
                                    configParams["IsApiZtGsensorTriggers_7"]
                                ),
                            }),
                            params: JSON.stringify({ GsensorTurnType: type }),
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(param)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发渣土车配置/路口报警/右转弯未停车音量参数至设备失败:" +
                                            res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                    case "IsApiZtVehctrl":
                        // let type = key.substring(key.indexOf('_')+1,key.length);
                        param = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify({
                                IsApiZtVehctrl: JSON.stringify(
                                    configParams["IsApiZtVehctrl"]
                                ),
                            }),
                            controlPwd: this.aesPassword,
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(param)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发渣土车配置/控车参数至设备失败:" +
                                            res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                }
            }
            for (let key in centerConfigParams) {
                switch (key) {
                    case "IsApiPlatform_0":
                        let paramsConfig = {};
                        paramsConfig = {
                            IsApiPlatform_0: centerConfigParams[key],
                            IsApiLocationReportOthers0:
                                centerConfigParams[key]["platformInfoList"][
                                    "IsApiLocationReportOthers0"
                                ],
                        };
                        paramsConfig["IsApiPlatform_0"]["platformInfoList"] = [
                            paramsConfig["IsApiPlatform_0"]["platformInfoList"],
                        ];
                        params = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify(paramsConfig),
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(params)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发多中心配置/第1中心失败:" + res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                    case "IsApiPlatform_1":
                        paramsConfig = {
                            IsApiPlatform_1: centerConfigParams[key],
                            IsApiLocationReportOthers1:
                                centerConfigParams[key]["platformInfoList"][
                                    "IsApiLocationReportOthers1"
                                ],
                        };
                        paramsConfig["IsApiPlatform_1"]["platformInfoList"] = [
                            paramsConfig["IsApiPlatform_1"]["platformInfoList"],
                        ];
                        params = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify(paramsConfig),
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(params)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发多中心配置/第2中心失败:" + res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                    case "IsApiPlatform_2":
                        paramsConfig = {
                            IsApiPlatform_2: centerConfigParams[key],
                            IsApiLocationReportOthers2:
                                centerConfigParams[key]["platformInfoList"][
                                    "IsApiLocationReportOthers2"
                                ],
                        };
                        paramsConfig["IsApiPlatform_2"]["platformInfoList"] = [
                            paramsConfig["IsApiPlatform_2"]["platformInfoList"],
                        ];
                        params = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify(paramsConfig),
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(params)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发多中心配置/第3中心失败:" + res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                    case "IsApiPlatform_3":
                        paramsConfig = {
                            IsApiPlatform_3: centerConfigParams[key],
                            IsApiLocationReportOthers3:
                                centerConfigParams[key]["platformInfoList"][
                                    "IsApiLocationReportOthers3"
                                ],
                        };
                        paramsConfig["IsApiPlatform_3"]["platformInfoList"] = [
                            paramsConfig["IsApiPlatform_3"]["platformInfoList"],
                        ];
                        params = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify(paramsConfig),
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(params)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发多中心配置/第4中心失败:" + res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                    case "IsApiPlatform_4":
                        paramsConfig = {
                            IsApiPlatform_4: centerConfigParams[key],
                            IsApiLocationReportOthers4:
                                centerConfigParams[key]["platformInfoList"][
                                    "IsApiLocationReportOthers4"
                                ],
                        };
                        paramsConfig["IsApiPlatform_4"]["platformInfoList"] = [
                            paramsConfig["IsApiPlatform_4"]["platformInfoList"],
                        ];
                        params = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify(paramsConfig),
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(params)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发多中心配置/第5中心失败:" + res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                    case "IsApiPlatform_5":
                        paramsConfig = {
                            IsApiPlatform_5: centerConfigParams[key],
                            IsApiLocationReportOthers5:
                                centerConfigParams[key]["platformInfoList"][
                                    "IsApiLocationReportOthers5"
                                ],
                        };
                        paramsConfig["IsApiPlatform_5"]["platformInfoList"] = [
                            paramsConfig["IsApiPlatform_5"]["platformInfoList"],
                        ];
                        params = {
                            deviceId: this.$route.query.deviceId,
                            configParams: JSON.stringify(paramsConfig),
                            paramBefore: JSON.stringify(this.formDatas),
                        };
                        this.$api
                            .saveDeviceConfigParamsToDevice(params)
                            .then((res) => {
                                if (res.success == true) {
                                    this.$emit("protocolSuccess", res.data);
                                } else {
                                    this.$message.error(
                                        "下发多中心配置/第6中心失败:" + res.msg
                                    );
                                }
                                this.updateBol = false;
                            });
                        break;
                }
            }
            let params = {
                deviceId: this.$route.query.deviceId,
                configParams: JSON.stringify(currencyConfigParams),
                paramBefore: JSON.stringify(this.formDatas),
            };
            if (params["configParams"] == "{}") return;
            this.$api.saveDeviceConfigParamsToDevice(params).then((res) => {
                if (res.success == true) {
                    this.$emit("protocolSuccess", res.data);
                } else {
                    this.$message.error("下发配置参数至设备失败:" + res.msg);
                }
                this.updateBol = false;
            });
        },

        //唤醒设备
        awakenDevice() {
            let params = { deviceId: this.$route.query.deviceId };
            this.$api
                .awakenDevice(params)
                .then((res) => {
                    if (res.success) {
                        this.$message.success("已向设备下发唤醒指令，设备");
                    } else {
                        this.$message.error(`设备唤醒失败:${res.msg}`);
                    }
                })
                .catch((err) => {
                    this.$message.error(`设备唤醒失败:${err}`);
                });
        },
        getChannelsCapability() {
            let params = {
                deviceId: this.$route.query.deviceId,
                commandIds: ["IsApiChannelsCapability"],
            };
            this.adasChannel = [];
            this.dbaChannel = [];
            this.bsdChannel = [];
            this.whdChannel = [];
            let adasChannelShow = ["FCW", "HMW", "LDW", "PCW", "TSR"];
            let dbaChannelShow = [
                "DriverCalling",
                "DriverEyeClosed",
                "DriverSmoking",
                "DriverInattention",
                "DriverAbsented",
                "DriverBlockCamera",
                "DriverSafetyBelt",
                "DriverSunglasses",
                "RapidAcceleration",
                "RapidDeceleration",
                "RapidTurn",
                "DriverAbnorma",
            ];
            let bsdChannelShow = ["BSD"];
            let whdChannelShow = ["NoHand", "SingleHand", "PlayMobilePhone"];
            this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
                if (
                    res.success == true &&
                    JSON.parse(res.data)["IsApiChannelsCapability"] &&
                    !JSON.parse(res.data)["IsApiChannelsCapability"][
                        "statusCode"
                    ]
                ) {
                    this.deviceCapability = JSON.parse(res.data);
                    let deviceChannel = JSON.parse(
                        JSON.stringify(JSON.parse(res.data))
                    );
                    this.adasChannel = this.makeChannel(
                        deviceChannel,
                        adasChannelShow
                    );
                    this.dbaChannel = this.makeChannel(
                        deviceChannel,
                        dbaChannelShow
                    );
                    this.bsdChannel = this.makeChannel(
                        deviceChannel,
                        bsdChannelShow
                    );
                    this.whdChannel = this.makeChannel(
                        deviceChannel,
                        whdChannelShow
                    );
                } else {
                    this.$message.error("获取设备通道能力集失败:" + res.msg);
                }
            });
        },
        makeChannel(deviceChannel, channelShwo) {
            let channels = [];
            deviceChannel["IsApiChannelsCapability"][
                "channelEventList"
            ].forEach((item) => {
                for (let i = 0; i < item.eventTypeArray.length; i++) {
                    for (let j = 0; j < channelShwo.length; j++) {
                        if (item.eventTypeArray[i] == channelShwo[j]) {
                            channels.push(item.channelId);
                        }
                    }
                }
            });
            return [...new Set(channels)];
        },
        currentCenter(num) {
            this.currentCenterNum = num;
        },
        adasCommandId(val) {
            this.currentAdasCommandId = val;
        },
        currentIsApiTriggerInfos(val) {
            this.currentIsApiTriggerInfo = val;
        },
        // 保存模板 1-全部 2-部分
        saveTemp(val) {
            this.$refs.component.$refs[this.componentName].validate((valid) => {
                if (valid) {
                    if (this.isApiDeciveBols) {
                        this.moubleBol = true;
                        this.saveTemplateType = val;
                        this.templateJSON = {
                            configParams: [],
                            menuList: [],
                        };
                    } else {
                        this.saveTemplateType = val;
                        this.templateVisible = true;
                    }
                    // for(let key in JSON.parse(JSON.stringify(this.initData))){
                    //   let keyLittle = key.replace(key[0],key[0].toLowerCase())
                    //   this.moubleJson[keyLittle] = true
                    // }
                    // this.makeIsapiMenu(0)
                    // console.log(this.moubleMenu);
                } else {
                    this.$message.warning("当前表单验证不通过，请先完善！");
                }
            });
        },
        submitTemp(temp) {
            if (this.saveTemplateType == 1) {
                let params = Object.assign(
                    {},
                    this.deviceInfo,
                    temp,
                    { templateType: 1, componentName: "" },
                    { templateContent: JSON.stringify(this.initData) }
                );
                this.$api.hikDevParamTempAdd(params).then((res) => {
                    if (res.success == true) {
                        this.$message.success("模板保存成功");
                        this.templateVisible = false;
                    } else {
                        this.$message.error("模板保存失败:" + res.msg);
                    }
                });
            } else {
                if (this.isApiDeciveBols) {
                    this.templateJSON["menuList"] = this.moubleMenu;
                    let params = Object.assign(
                        {},
                        this.deviceInfo,
                        temp,
                        { templateType: 1 },
                        { templateContent: JSON.stringify(this.templateJSON) }
                    );
                    this.$api.hikDevParamTempAdd(params).then((res) => {
                        if (res.success == true) {
                            this.$message.success("模板保存成功");
                            this.templateVisible = false;
                        } else {
                            this.$message.error("模板保存失败:" + res.msg);
                        }
                        this.templateJSON = {
                            configParams: [],
                            menuList: [],
                        };
                    });
                } else {
                    let configParams = {};
                    this.componentCommandIdList.forEach((i) => {
                        configParams[i] = this.initData[i];
                    });
                    this.componentTriggerInfo.forEach((i) => {
                        configParams[i] = this.initData[i];
                    });
                    this.capabilityList.forEach((i) => {
                        configParams[i] = this.initData[i];
                    });
                    // console.log(configParams);
                    let params = Object.assign(
                        {},
                        this.deviceInfo,
                        temp,
                        { templateType: 1, componentName: this.componentName },
                        { templateContent: JSON.stringify(configParams) }
                    );
                    this.$api.hikDevParamTempAdd(params).then((res) => {
                        if (res.success == true) {
                            this.$message.success("模板保存成功");
                            this.templateVisible = false;
                        } else {
                            this.$message.error("模板保存失败:" + res.msg);
                        }
                    });
                }
            }
        },
        //刷新Session
        refreshSession() {
            var _this = this;
            this.refreshSessionHandle = setInterval(function () {
                _this.$api.refreshSession().then((res) => {});
            }, 1000 * 60);
        },
        sendProtocol() {
            if (this.isApiDeciveBols) {
                if (!this.dataList.length) {
                    this.$message.info("您未修改任何配置项，请修改后下发");
                    return;
                }
                this.updateBol = true;
            } else {
                // 通道重复判断
                if (this.componentName == "ChannelList") {
                    const physicChannelNumList = [];
                    const logicChannelNumList = [];
                    this.initData["0076"].mediaChannelList.forEach((i) => {
                        physicChannelNumList.push(+i.physicChannelNum);
                        logicChannelNumList.push(+i.logicChannelNum);
                    });
                    if (
                        new Set(physicChannelNumList).size !==
                        physicChannelNumList.length
                    ) {
                        this.$message.error("音视频通道列表物理通道号重复！");
                        return;
                    }
                    if (
                        new Set(logicChannelNumList).size !==
                        logicChannelNumList.length
                    ) {
                        this.$message.error("音视频通道列表逻辑通道号重复！");
                        return;
                    }
                }
                if (this.componentName == "PublicVehicleRegistration") {
                    this.$refs.component.$refs["PublicApn"].validate(
                        (valid) => {
                            if (valid) {
                                let configParams = {};
                                configParams["IsApiApnInfo"] =
                                    this.initData["IsApiApnInfo"];
                                let params = {
                                    deviceId: +this.$route.query.deviceId,
                                    configParams: JSON.stringify(configParams),
                                };
                                this.$api
                                    .saveDeviceConfigParamsToDevice(params)
                                    .then((res) => {
                                        if (res.success == true) {
                                            this.$emit(
                                                "protocolSuccess",
                                                res.data
                                            );
                                        } else {
                                            this.$message.error(
                                                "下发配置参数至设备失败:" +
                                                    res.msg
                                            );
                                        }
                                    });
                            } else {
                                this.$message.warning(
                                    "当前表单验证不通过，请先完善！"
                                );
                            }
                        }
                    );
                } else {
                    this.$refs.component.$refs[this.componentName].validate(
                        (valid) => {
                            if (valid) {
                                let configParams = {};
                                // console.log(this.componentName);
                                if (
                                    this.componentName != "PraviteAdas" &&
                                    this.componentName != "PublicAdas" &&
                                    this.componentName != "ManyCenter" &&
                                    this.componentName != "firstCenterPublic" &&
                                    this.componentName !=
                                        "secondCenterPublic" &&
                                    this.componentName != "thirdCenterPublic" &&
                                    this.componentName != "forthCenterPublic" &&
                                    this.componentName != "fifthCenterPublic" &&
                                    this.componentName != "sixthCenterPublic" &&
                                    this.componentName != "PublicBsd" &&
                                    this.componentName != "PublicBsd" &&
                                    this.componentName != "PublicDba" &&
                                    this.componentName != "WhdPublic" &&
                                    this.componentName != "PublicShutDown" &&
                                    this.componentName != "PublicVolume" &&
                                    this.componentName != "PublicProgramMgr" &&
                                    this.componentName != "PublicGsensor"
                                ) {
                                    this.componentCommandIdList.forEach((i) => {
                                        configParams[i] = this.initData[i];
                                    });
                                    if (
                                        this.componentName ==
                                            "PublicVehicleRegistration" &&
                                        this.initData["IsApiApnInfo"]
                                    ) {
                                        configParams["IsApiApnInfo"] =
                                            this.initData["IsApiApnInfo"];
                                    }
                                } else if (
                                    this.componentName == "PraviteAdas" ||
                                    this.componentName == "PublicAdas" ||
                                    this.componentName == "PublicBsd" ||
                                    this.componentName == "PublicDba" ||
                                    this.componentName == "WhdPublic"
                                ) {
                                    if (
                                        this.currentAdasCommandId ==
                                        "IsApiWhdInfo"
                                    ) {
                                        configParams["IsApiWhdInfo"] =
                                            this.initData["IsApiWhdInfo"];
                                    } else if (
                                        this.currentAdasCommandId ==
                                        "IsApiDBAGlobal"
                                    ) {
                                        configParams["IsApiDBAGlobal"] =
                                            this.initData["IsApiDBAGlobal"];
                                    } else if (
                                        this.currentAdasCommandId ==
                                        "IsApiAdasGlobal"
                                    ) {
                                        configParams["IsApiAdasGlobal"] =
                                            this.initData["IsApiAdasGlobal"];
                                    } else {
                                        configParams[
                                            this.currentAdasCommandId
                                        ] =
                                            this.initData[
                                                this.currentAdasCommandId
                                            ];
                                        configParams[
                                            this.currentIsApiTriggerInfo
                                        ] =
                                            this.initData[
                                                this.currentIsApiTriggerInfo
                                            ];
                                    }
                                    if (this.everyVolumeBol) {
                                        configParams["IsApiFcwTriggerInfo"] =
                                            this.initData[
                                                "IsApiFcwTriggerInfo"
                                            ];
                                        configParams["IsApiHmwTriggerInfo"] =
                                            this.initData[
                                                "IsApiHmwTriggerInfo"
                                            ];
                                        configParams["IsApiLdwTriggerInfo"] =
                                            this.initData[
                                                "IsApiLdwTriggerInfo"
                                            ];
                                        configParams["IsApiPcwTriggerInfo"] =
                                            this.initData[
                                                "IsApiPcwTriggerInfo"
                                            ];
                                    }
                                } else if (
                                    this.componentName == "ManyCenter" ||
                                    this.componentName == "firstCenterPublic" ||
                                    this.componentName ==
                                        "secondCenterPublic" ||
                                    this.componentName == "thirdCenterPublic" ||
                                    this.componentName == "forthCenterPublic" ||
                                    this.componentName == "fifthCenterPublic" ||
                                    this.componentName == "sixthCenterPublic"
                                ) {
                                    const obj =
                                        this.initData["IsApiPlatform"]
                                            .platformInfoList[
                                            this.currentCenterNum
                                        ];
                                    if (
                                        obj.serverInfoList &&
                                        obj.serverInfoList[0].hostName &&
                                        obj.serverInfoList[0].hostName.substring(
                                            0,
                                            3
                                        ) == "iot"
                                    ) {
                                        this.$message.error(
                                            "前缀为“iot”的域名地址不允许下发！"
                                        );
                                        return;
                                    }
                                    configParams = {
                                        IsApiPlatform: {
                                            platformInfoList: [obj],
                                        },
                                        ["IsApiPlatformOthers" +
                                        this.currentCenterNum]:
                                            obj[
                                                "IsApiPlatformOthers" +
                                                    this.currentCenterNum
                                            ],
                                        ["IsApiLocationReportOthers" +
                                        this.currentCenterNum]:
                                            obj[
                                                "IsApiLocationReportOthers" +
                                                    this.currentCenterNum
                                            ],
                                    };
                                } else if (
                                    this.componentName == "PublicProgramMgr"
                                ) {
                                    if (this.initData["IsApiSensorInInfo"]) {
                                        if (
                                            this.activeNameProgramMgr !=
                                            "default"
                                        ) {
                                            configParams["IsApiSensorInInfo"] =
                                                this.initData[
                                                    "IsApiSensorInInfo"
                                                ];
                                        } else {
                                            let displayChannelNoArr = [];
                                            let channelArr = [];
                                            for (
                                                let i = 0;
                                                i <
                                                this.initData[
                                                    "IsApiPreviewSwitchInfo"
                                                ]["displayWindowList"].length;
                                                i++
                                            ) {
                                                if (
                                                    this.initData[
                                                        "IsApiPreviewSwitchInfo"
                                                    ]["displayWindowList"][i]
                                                        .displayChannelNo != 0
                                                ) {
                                                    displayChannelNoArr.push(
                                                        this.initData[
                                                            "IsApiPreviewSwitchInfo"
                                                        ]["displayWindowList"][
                                                            i
                                                        ].displayChannelNo
                                                    );
                                                }
                                            }
                                            channelArr = [
                                                ...new Set(displayChannelNoArr),
                                            ];
                                            if (
                                                displayChannelNoArr.length !==
                                                channelArr.length
                                            ) {
                                                this.$message.warning(
                                                    "存在重复通道，请检查后重新下发"
                                                );
                                                return;
                                            } else {
                                                configParams[
                                                    "IsApiPreviewSwitchInfo"
                                                ] =
                                                    this.initData[
                                                        "IsApiPreviewSwitchInfo"
                                                    ];
                                                configParams[
                                                    "IsApiPreviewSwitchInfo"
                                                ].params = {
                                                    groupNo: "0",
                                                    videoOutType: "CVBS",
                                                };
                                            }
                                        }
                                    } else {
                                        let index_ = 0;
                                        let channelNoArr = [];
                                        for (
                                            let i = 0;
                                            i <
                                            this.initData[
                                                "IsApiProgramMgrInfo"
                                            ]["pageList"].length;
                                            i++
                                        ) {
                                            if (
                                                this.initData[
                                                    "IsApiProgramMgrInfo"
                                                ]["pageList"][i].pageName ==
                                                this.activeNameProgramMgr
                                            ) {
                                                index_ = i;
                                            }
                                        }
                                        for (
                                            let i = 0;
                                            i <
                                            this.initData[
                                                "IsApiProgramMgrInfo"
                                            ]["pageList"][index_].windowList
                                                .length;
                                            i++
                                        ) {
                                            channelNoArr.push(
                                                this.initData[
                                                    "IsApiProgramMgrInfo"
                                                ]["pageList"][index_]
                                                    .windowList[i].inputChannel
                                            );
                                        }
                                        if (
                                            new Set(channelNoArr).size !=
                                            channelNoArr.length
                                        ) {
                                            this.$message.warning(
                                                "存在重复通道，请检查后重新下发"
                                            );
                                            return;
                                        }
                                        configParams["IsApiProgramMgrInfo"] =
                                            JSON.parse(
                                                JSON.stringify(
                                                    this.initData[
                                                        "IsApiProgramMgrInfo"
                                                    ]
                                                )
                                            );
                                        configParams["IsApiProgramMgrInfo"][
                                            "pageList"
                                        ] = [
                                            JSON.parse(
                                                JSON.stringify(
                                                    configParams[
                                                        "IsApiProgramMgrInfo"
                                                    ]["pageList"][index_]
                                                )
                                            ),
                                        ];
                                    }
                                } else if (
                                    this.componentName == "PublicGsensor"
                                ) {
                                    if (this.activeNameProgramMgr == "first") {
                                        configParams["IsApiZtGsensor"] =
                                            this.initData["IsApiZtGsensor"];
                                    } else {
                                        configParams["IsApiZtGsensorTurn"] =
                                            this.initData["IsApiZtGsensorTurn"];
                                        configParams["IsApiZtGsensorTriggers"] =
                                            this.initData[
                                                "IsApiZtGsensorTriggers"
                                            ];
                                    }
                                } else {
                                    configParams[this.currentAdasCommandId] =
                                        this.initData[
                                            this.currentAdasCommandId
                                        ];
                                }
                                let params;
                                if (configParams["IsApiZtGsensorTurn"]) {
                                    params = {
                                        deviceId: +this.$route.query.deviceId,
                                        configParams: JSON.stringify({
                                            IsApiZtGsensorTurn: JSON.stringify(
                                                configParams[
                                                    "IsApiZtGsensorTurn"
                                                ]
                                            ),
                                        }),
                                        params: JSON.stringify({
                                            GsensorTurnType: String(
                                                configParams[
                                                    "IsApiZtGsensorTurn"
                                                ]["gsensorTurnType"]
                                            ),
                                        }),
                                    };
                                } else {
                                    params = {
                                        deviceId: +this.$route.query.deviceId,
                                        configParams:
                                            JSON.stringify(configParams),
                                    };
                                }
                                if (configParams["IsApiZtVehctrl"]) {
                                    params = {
                                        deviceId: +this.$route.query.deviceId,
                                        configParams: JSON.stringify({
                                            IsApiZtVehctrl: JSON.stringify(
                                                configParams["IsApiZtVehctrl"]
                                            ),
                                        }),
                                        controlPwd: this.aesPassword,
                                    };
                                }
                                this.$api
                                    .saveDeviceConfigParamsToDevice(params)
                                    .then((res) => {
                                        if (res.success == true) {
                                            if (
                                                JSON.parse(
                                                    params["configParams"]
                                                )["IsApiZtGsensorTurn"]
                                            ) {
                                                let param = {
                                                    deviceId:
                                                        this.$route.query
                                                            .deviceId,
                                                    configParams:
                                                        JSON.stringify({
                                                            IsApiZtGsensorTriggers:
                                                                JSON.stringify(
                                                                    configParams[
                                                                        "IsApiZtGsensorTriggers"
                                                                    ]
                                                                ),
                                                        }),
                                                    params: JSON.stringify({
                                                        GsensorTurnType: String(
                                                            configParams[
                                                                "IsApiZtGsensorTurn"
                                                            ]["gsensorTurnType"]
                                                        ),
                                                    }),
                                                };
                                                this.$api
                                                    .saveDeviceConfigParamsToDevice(
                                                        param
                                                    )
                                                    .then((res) => {
                                                        if (
                                                            res.success == true
                                                        ) {
                                                            this.$emit(
                                                                "protocolSuccess",
                                                                res.data
                                                            );
                                                        }
                                                    });
                                            } else {
                                                this.$emit(
                                                    "protocolSuccess",
                                                    res.data
                                                );
                                            }
                                        } else {
                                            this.$message.error(
                                                "下发配置参数至设备失败:" +
                                                    res.msg
                                            );
                                        }
                                    });
                            } else {
                                this.$message.warning(
                                    "当前表单验证不通过，请先完善！"
                                );
                            }
                        }
                    );
                }
            }
        },
        changeVal(val) {
            this.initData = val;
        },
        changeCopy(val) {
            this.copyData = val;
        },
        capabilitiesEmit(val) {
            for (let key in val) {
                if (key.slice(-10) == "Capability") {
                    this.capabilitiesEmits = val[key];
                    this.componentCommandIdList.push(key);
                }
            }
        },
        everyVolumeChange(val) {
            this.everyVolumeBol = val;
        },
        getActiveName(val) {
            this.activeNameProgramMgr = val;
        },
        aesEncrypt(val) {
            this.aesPassword = val;
        },
        changeData(val) {
            this.dataList = [];
            this.formDatas = val;
            for (let x in val) {
                if (val[x]) {
                    this.dataList.push(val[x].split("&"));
                }
            }
            // this.dataList.push(['IsApiAdasGlobal.enabled.2'],['主动安全设置/ADAS/通道2/ADAS全局设置/ADAS全局报警使能'],['开启']);
        },
        //删除待修改配置项
        deleteItem(item, index) {
            let keys = item[0].split(".");
            this.dataList.splice(index, 1);
            this.formDatas[keys.join(".")] = "";
            switch (keys.length) {
                case 2:
                    this.initData[keys[0]][keys[1]] = JSON.parse(
                        JSON.stringify(this.copyData[keys[0]][keys[1]])
                    );
                    if (keys[0] == "IsApiPreviewSwitchInfo") {
                        this.initData[keys[0]] = JSON.parse(
                            JSON.stringify(this.copyData[keys[0]])
                        );
                    }
                    break;
                case 3:
                    this.channelForm["channel_" + keys[2]][
                        keys[0].substring(0, keys[0].indexOf("_"))
                    ][keys[1]] = JSON.parse(
                        JSON.stringify(
                            this.copyChannelData["channel_" + keys[2]][
                                keys[0].substring(0, keys[0].indexOf("_"))
                            ][keys[1]]
                        )
                    );
                    break;
                case 4:
                    if (keys[3] == "nothing") {
                        this.initData[keys[0]][keys[1]][keys[2]] = JSON.parse(
                            JSON.stringify(
                                this.copyData[keys[0]][keys[1]][keys[2]]
                            )
                        );
                        if (keys[0].substring(0, 19) == "IsApiProgramMgrInfo") {
                            this.initData[keys[0]] = JSON.parse(
                                JSON.stringify(this.copyData[keys[0]])
                            );
                            this.initData["IsApiProgramMgrInfo"][keys[1]][
                                keys[0].substring(20, 21)
                            ][keys[2]] = JSON.parse(
                                JSON.stringify(
                                    this.copyData["IsApiProgramMgrInfo"][
                                        keys[1]
                                    ][keys[0].substring(20, 21)][keys[2]]
                                )
                            );
                        }
                    } else {
                        this.initData[keys[0]][keys[1]][keys[2]][keys[3]] =
                            JSON.parse(
                                JSON.stringify(
                                    this.copyData[keys[0]][keys[1]][keys[2]][
                                        keys[3]
                                    ]
                                )
                            );
                    }
                    break;
                case 5:
                    this.initData[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]] =
                        JSON.parse(
                            JSON.stringify(
                                this.copyData[keys[0]][keys[1]][keys[2]][
                                    keys[3]
                                ][keys[4]]
                            )
                        );
                    break;
                case 6:
                    this.initData[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]][
                        keys[5]
                    ] = JSON.parse(
                        JSON.stringify(
                            this.copyData[keys[0]][keys[1]][keys[2]][keys[3]][
                                keys[4]
                            ][keys[5]]
                        )
                    );
                    break;
                case 7:
                    this.channelForm["channel_" + keys[4]][
                        keys[0].substring(0, keys[0].indexOf("_"))
                    ][keys[1]][keys[2]][keys[3]] = JSON.parse(
                        JSON.stringify(
                            this.copyChannelData["channel_" + keys[4]][
                                keys[0].substring(0, keys[0].indexOf("_"))
                            ][keys[1]][keys[2]][keys[3]]
                        )
                    );
                    break;
                case 8:
                    this.channelForm["channel_" + keys[7]][
                        keys[0].substring(0, keys[0].indexOf("_"))
                    ][keys[1]][keys[2]][keys[3]][keys[4]][keys[5]][keys[6]] =
                        JSON.parse(
                            JSON.stringify(
                                this.copyChannelData["channel_" + keys[7]][
                                    keys[0].substring(0, keys[0].indexOf("_"))
                                ][keys[1]][keys[2]][keys[3]][keys[4]][keys[5]][
                                    keys[6]
                                ]
                            )
                        );
                    break;
                case 9:
                    this.initData[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]][
                        keys[5]
                    ][keys[6]] = JSON.parse(
                        JSON.stringify(
                            this.copyData[keys[0]][keys[1]][keys[2]][keys[3]][
                                keys[4]
                            ][keys[5]][keys[6]]
                        )
                    );
                    break;
            }
        },
        openDialog() {
            this.$emit("open");
        },
        changeLabel(val) {
            // console.log(this.$refs.component.$refs[this.componentName],'this.$refs.component.$refs[this.componentName]')
            // this.$refs.component.$refs[this.componentName].validate((valid) => {
            //   if(valid){
            this.chooseItem = val.label;
            this.componentCommandIdList = val.commandIdList;
            this.componentName = val.value;
            if (
                val.value == "PublicAdas" ||
                val.value == "PublicDba" ||
                val.value == "PublicBsd" ||
                val.value == "WhdPublic"
            ) {
                this.componentTriggerInfo = val.IsApiTriggerInfoList;
                this.capabilityList = val.capabilityList;
            } else {
                this.componentTriggerInfo = [];
            }
            // } else {
            //   this.$message.warning(`当前表单验证不通过，请先完善！`)
            //   this.$refs.menu.activeIndex= this.componentName
            // }
            // })
        },
        // 获取设备详情
        getParamDeviceById() {
            let params = {
                deviceId: this.$route.query.deviceId,
            };
            this.$api.filegetParamDeviceById(params).then((res) => {
                if (res.success == true) {
                    this.deviceInfo = res.data.length > 0 ? res.data[0] : {};
                } else {
                    this.$message.error("获取设备信息失败:" + res.msg);
                }
            });
        },
        onMousedownClick(ev) {
            this.passwordType = "text";
            this.passwordIcon = "el-icon-view";
        },
        onMouseupClick(ev) {
            this.passwordType = "password";
            this.passwordIcon = "el-icon-view";
        },
        // 获取设备所有配置参数
        getDeviceConfigParams(type) {
            // this.getParamDeviceById();
            // if(!type){
            //   this.getISApiCapality();
            // }
            this.configParams = true;

            // //等待两个后端接口都有数据传回
            // Promise.all([this.$api.getDeviceConfigParams(params), this.$api.getDeviceConfigParamsByIsApi(params)]).then((res) => {
            //   //两个后端接口传回的res[0]和res[1]都为true
            //    if (res[0].success == true && res[1].success == true) {
            //       // let data=res.data
            //       // let newData={}
            //       // for (const key in data) {
            //       //   console.log(key,data[key],JSON.parse(data[key]),'key===')
            //       //   // newData[key]=JSON.parse(data[key])
            //       // }
            //     this.configParams=false
            //     //连接两个Json串
            //     this.initData=Object.assign(JSON.parse(res[0].data),JSON.parse(res[1].data))
            //     console.log(this.initData,'initData========')
            //     this.$nextTick(()=>{
            //       this.detailShow=true
            //     })
            //   } else {
            //     this.configParams=false
            //     this.$message.error('获取设备配置参数失败:' + res.msg)
            //   }
            // });
            if (this.componentName == "WhdPublic") {
                this.getChannelsCapability();
            }
            this.initData = {};
            this.formDatas = {}; //保存已修改的配置项
            // this.copyData = {};//保存获取设备配置的原始参数
            this.channelForm = {}; //保存通道号配置参数
            this.dataList = [];
            // this.copyChannelData = {}
            this.getParamDeviceById();
            if (type) {
                let params = {
                    deviceId: this.$route.query.deviceId || null,
                    commandIds: this.currentAdasCommandId,
                };

                let this_ = this;
                if (
                    this.currentAdasCommandId == "IsApiBsdInfo" ||
                    this.currentAdasCommandId == "IsApiAdasGlobal" ||
                    this.currentAdasCommandId == "IsApiFcwInfoList" ||
                    this.currentAdasCommandId == "IsApiHmwInfoList" ||
                    this.currentAdasCommandId == "IsApiLdwInfoList" ||
                    this.currentAdasCommandId == "IsApiPcwInfoList"
                ) {
                    setInterval(() => {
                        this_.configParams = false;
                    }, 500);
                } else {
                    this.$api
                        .getDeviceConfigParamsByIsApi(params)
                        .then((res) => {
                            // console.log(res);
                            if (res.success == true) {
                                this.initData = JSON.parse(res.data);

                                this.$nextTick(() => {
                                    this.detailShow = true;
                                });
                            } else {
                                this.$message.error(
                                    "获取设备配置参数失败:" + res.msg
                                );
                            }
                            this.configParams = false;
                            this.getDataSuccess = true;
                        });
                }
            } else {
                let params = {
                    deviceId: this.$route.query.deviceId,
                };
                this.$api.getDeviceConfigParams(params).then((res) => {
                    this.configParams = false;
                    this.everyVolumeBol = false;
                    if (res.success == true) {
                        this.initData = JSON.parse(res.data);
                        this.getDataSuccess = true;
                        this.$nextTick(() => {
                            this.detailShow = true;
                        });
                    } else {
                        this.getDataSuccess = false;
                        this.$message.error("获取设备配置参数失败:" + res.msg);
                    }
                    this.configParams = false;
                });
            }

            // this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
            //   if (res.success == true) {
            //     this.initData=Object.assign(this.initData, JSON.parse(res.data))
            //   } else {
            //     this.$message.error('获取设备配置参数失败:' + res.msg)
            //   }
            // });
            /*this.$api.getDeviceConfigParams(params).then((res) => {
         if (res.success == true) {
            // let data=res.data
            // let newData={}
            // for (const key in data) {
            //   console.log(key,data[key],JSON.parse(data[key]),'key===')
            //   // newData[key]=JSON.parse(data[key])
            // }

          this.configParams=false
          this.initData=JSON.parse(res.data)
          console.log(this.initData,'initData========')
          this.$nextTick(()=>{
            this.detailShow=true
          })
        } else {
          this.configParams=false
          this.$message.error('获取设备配置参数失败:' + res.msg)
        }
      });*/
        },
        goBack() {
            this.$router.push("/maintenanceCenter/deviceConfiguration");
        },
        getOthers(val) {
            this.Others = val;
        },
        touchImageTask() {
            this.$confirm(
                `1、重新获取镜像参数会导致备份的镜像和能力集均被清空，需等下一次备份完成后才可使用镜像功能。<br/>2、推荐设备在线时再点击获取镜像参数按钮，无需等待托管，直接可进行备份镜像操作。`,
                "是否重新获取镜像参数？",
                {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    if (!Number(this.$route.query.offline)) {
                        this.$message.success(
                            "镜像参数更新中，预计需要2-3分钟，请耐心等待！",
                            2000
                        );
                    }
                    this.$api
                        .touchImageTask({
                            deviceCode: this.$route.query.deviceCode,
                        })
                        .then((res) => {
                            if (
                                res.success &&
                                Number(this.$route.query.offline)
                            ) {
                                this.$message.success(
                                    "已生成托管任务，待设备上线后获取最新镜像参数！"
                                );
                            }
                        });
                })
                .catch(() => {});
        },
    },
    computed: {
        saveTemplateDisable() {
            if (this.isApiDeciveBols) {
                return !this.isApiDeciveBols;
            } else {
                return (
                    this.componentName != "Overspeed" &&
                    this.componentName != "Adas" &&
                    this.componentName != "Dsm" &&
                    this.componentName != "Bsd" &&
                    this.componentName != "TirePressure" &&
                    this.componentName != "AngularVelocity" &&
                    this.componentName != "PraviteAdas"
                );
            }
        },
    },
    mounted() {
        this.getParamDeviceById();
        if (this.isApiDeciveBol) {
            this.getDeviceConfigParams(this.isApiDeciveBol);
        } else {
            this.getDeviceConfigParams(false);
        }
        // this.getDeviceConfigParams(false)
        this.refreshSession();
    },
};
</script>

<style lang="less" scoped>
// .configuration-detail{
//   .no-config{
//     width: 140px;
//     display: flex;
//     flex-direction: column;
//     a {
//       text-align: right;
//     }
//   }
// .el-scrollbar_wrap{overflow-x: hidden;}
div /deep/ .el-input {
    // width: 100%!important;
    // .el-input__inner {
    //   padding-right:8px!important;
    // }
    .el-input__suffix {
        right: 8px !important;
    }
    // button {
    //   display: none;
    // }
}
.configuration-module {
    display: flex;
    border: 1px solid #f0f0f0;
    padding-bottom: 40px;
    .menu-vertical {
        height: 100%;
        .el-submenu.is-active:not(.is-opened) > .el-submenu__title {
            background-color: #f0f0f0 !important;
        }
        .el-submenu__title:hover {
            background: #f0f0f0 !important;
        }
    }
    .configuration-detail-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        .configuration-detail-item {
            flex-grow: 1;
        }
        /*.configuration-detail-submit{
        width: 100%;
        border-top: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }*/
    }
}
.littleYellow {
    border: 1px solid rgba(255, 149, 44, 1);
    background-color: rgba(255, 149, 44, 0.8);
    color: white;
    position: relative;
    display: inline-block;
    height: 24px;
    box-sizing: border-box;
    padding: 0 8px;
    border-radius: 2px;
    font-size: 14px;
    line-height: 24px;
    white-space: nowrap;
}
.templateItem {
    margin-bottom: 0px;
}
.el-submenu.is-opened {
    background-color: #ebebeb !important;
}
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
.fontWeight {
    font-size: 16px;
    color: black;
    cursor: pointer;
}
.el-row {
    margin: 8px 0;
}
.deleteBtn {
    cursor: pointer;
    font-weight: 900;
    font-size: 16px;
    color: black;
}
.deleteItem {
    color: black;
}
.el-icon-arrow-down {
    font-weight: 900;
}
.agreement-config {
    height: 100%;
    overflow-y: auto;
}
// }
</style>
<style lang="less">
.configuration-module {
    .el-select,
    .el-input {
        width: 100% !important;
    }
    .h-ip-input__verse.el-input {
        width: 25% !important;
    }
}
</style>
