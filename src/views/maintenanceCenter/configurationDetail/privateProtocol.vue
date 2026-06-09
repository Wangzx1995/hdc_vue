<template>
    <div class="agreement-config p-a-md">
        <!-- 修改的配置项弹窗 -->
        <el-dialog
            title="下发至终端"
            :visible.sync="updateBol"
            :width="'600px'"
            @close="close"
        >
            <p class="fontWeight">
                您修改的{{ dataList.length }}项配置将下发至终端
            </p>
            <ul>
                <li v-for="(item, index) in dataList" :key="index">
                    <el-row>
                        <el-col :span="23">
                            <div class="deleteItem">
                                {{
                                    `${index + 1}、${item[1]}: 修改为 ${
                                        item[2]
                                    }`
                                }}
                            </div>
                        </el-col>
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
                            @change="changeTemplate('192_shutdownDelay')"
                            v-if="
                                moubleJson['192_shutdownDelay'] !== '' &&
                                moubleJson['192_shutdownDelay'] !== undefined &&
                                moubleJson['192_shutdownDelay'] !== null
                            "
                            v-model="moubleJson['192_shutdownDelay']"
                            >延时关机时间</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('2205_audioOutput')"
                            v-if="
                                moubleJson['2205_audioOutput'] !== '' &&
                                moubleJson['2205_audioOutput'] !== undefined &&
                                moubleJson['2205_audioOutput'] !== null
                            "
                            v-model="moubleJson['2205_audioOutput']"
                            >音量设置/报警音频</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('2205_voiceCallOutput')"
                            v-if="
                                moubleJson['2205_voiceCallOutput'] !== '' &&
                                moubleJson['2205_voiceCallOutput'] !==
                                    undefined &&
                                moubleJson['2205_voiceCallOutput'] !== null
                            "
                            v-model="moubleJson['2205_voiceCallOutput']"
                            >音量设置/系统音频</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6"></el-col>
                </el-row>
                <p>多中心设置</p>
                <el-row
                    type="flex"
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('705')"
                            v-if="
                                moubleJson['705'] !== '' &&
                                moubleJson['705'] !== undefined &&
                                moubleJson['705'] !== null
                            "
                            v-model="moubleJson['705']"
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
                    v-if="
                        capability['intelliDrive_ADAS'] &&
                        capability['intelliDrive_ADAS'].length > 0
                    "
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '901_' +
                                        capability['intelliDrive_ADAS'][0]
                                            .chanNo
                                )
                            "
                            v-if="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}`
                                ] !== '' &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}`
                                ] !== undefined &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}`
                                ]
                            "
                            >ADAS/ADAS全局设置</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '901_' +
                                        capability['intelliDrive_ADAS'][0]
                                            .chanNo +
                                        '_0_4'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_0_4`
                                ] !== '' &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_0_4`
                                ] !== undefined &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_0_4`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_0_4`
                                ]
                            "
                            >ADAS/前车碰撞（FCW）</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '901_' +
                                        capability['intelliDrive_ADAS'][0]
                                            .chanNo +
                                        '_0'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_0`
                                ] !== '' &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_0`
                                ] !== undefined &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_0`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_0`
                                ]
                            "
                            >ADAS/前车碰撞（FCW）</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '901_' +
                                        capability['intelliDrive_ADAS'][0]
                                            .chanNo +
                                        '_4'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_4`
                                ] !== '' &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_4`
                                ] !== undefined &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_4`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_4`
                                ]
                            "
                            >ADAS/前车碰撞（FCW）</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '901_' +
                                        capability['intelliDrive_ADAS'][0]
                                            .chanNo +
                                        '_1_5'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_1_5`
                                ] !== '' &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_1_5`
                                ] !== undefined &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_1_5`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_1_5`
                                ]
                            "
                            >ADAS/车道偏离（LDW）</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '901_' +
                                        capability['intelliDrive_ADAS'][0]
                                            .chanNo +
                                        '_1'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_1`
                                ] !== '' &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_1`
                                ] !== undefined &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_1`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_1`
                                ]
                            "
                            >ADAS/车道偏离（LDW）</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '901_' +
                                        capability['intelliDrive_ADAS'][0]
                                            .chanNo +
                                        '_5'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_5`
                                ] !== '' &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_5`
                                ] !== undefined &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_5`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_5`
                                ]
                            "
                            >ADAS/车道偏离（LDW）</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '901_' +
                                        capability['intelliDrive_ADAS'][0]
                                            .chanNo +
                                        '_2_6'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_2_6`
                                ] !== '' &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_2_6`
                                ] !== undefined &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_2_6`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_2_6`
                                ]
                            "
                            >ADAS/车距检测（HMW）</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '901_' +
                                        capability['intelliDrive_ADAS'][0]
                                            .chanNo +
                                        '_2'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_2`
                                ] !== '' &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_2`
                                ] !== undefined &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_2`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_2`
                                ]
                            "
                            >ADAS/车距检测（HMW）</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '901_' +
                                        capability['intelliDrive_ADAS'][0]
                                            .chanNo +
                                        '_6'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_6`
                                ] !== '' &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_6`
                                ] !== undefined &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_6`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_6`
                                ]
                            "
                            >ADAS/车距检测（HMW）</el-checkbox
                        >
                    </el-col>
                </el-row>
                <el-row
                    type="flex"
                    v-if="
                        capability['intelliDrive_ADAS'] &&
                        capability['intelliDrive_ADAS'].length > 0
                    "
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '901_' +
                                        capability['intelliDrive_ADAS'][0]
                                            .chanNo +
                                        '_3_7'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_3_7`
                                ] !== '' &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_3_7`
                                ] !== undefined &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_3_7`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_3_7`
                                ]
                            "
                            >ADAS/行人监测（PCW）</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '901_' +
                                        capability['intelliDrive_ADAS'][0]
                                            .chanNo +
                                        '_3'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_3`
                                ] !== '' &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_3`
                                ] !== undefined &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_3`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_3`
                                ]
                            "
                            >ADAS/行人监测（PCW）</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '901_' +
                                        capability['intelliDrive_ADAS'][0]
                                            .chanNo +
                                        '_7'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_7`
                                ] !== '' &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_7`
                                ] !== undefined &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_7`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_7`
                                ]
                            "
                            >ADAS/行人监测（PCW）</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '901_' +
                                        capability['intelliDrive_ADAS'][0]
                                            .chanNo +
                                        '_8_9'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_8_9`
                                ] !== '' &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_8_9`
                                ] !== undefined &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_8_9`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_8_9`
                                ]
                            "
                            >ADAS/交通标识识别（TSR）</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '901_' +
                                        capability['intelliDrive_ADAS'][0]
                                            .chanNo +
                                        '_8'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_8`
                                ] !== '' &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_8`
                                ] !== undefined &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_8`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_8`
                                ]
                            "
                            >ADAS/交通标识识别（TSR）</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '901_' +
                                        capability['intelliDrive_ADAS'][0]
                                            .chanNo +
                                        '_9'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_9`
                                ] !== '' &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_9`
                                ] !== undefined &&
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_9`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `901_${capability['intelliDrive_ADAS'][0].chanNo}_9`
                                ]
                            "
                            >ADAS/交通标识识别（TSR）</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6"></el-col>
                    <el-col :span="6"></el-col>
                </el-row>
                <el-row
                    type="flex"
                    v-if="
                        capability['intelliDrive_DBA'] &&
                        capability['intelliDrive_DBA'].length > 0
                    "
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0].chanNo
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}`
                                ]
                            "
                            >DBA/DBA全局设置</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_0_7'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_0_7`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_0_7`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_0_7`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_0_7`
                                ]
                            "
                            >DBA/疲劳驾驶</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_0'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_0`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_0`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_0`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_0`
                                ]
                            "
                            >DBA/疲劳驾驶</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_7'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_7`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_7`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_7`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_7`
                                ]
                            "
                            >DBA/疲劳驾驶</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_1_15'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_1_15`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_1_15`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_1_15`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_1_15`
                                ]
                            "
                            >DBA/打电话</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_1'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_1`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_1`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_1`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_1`
                                ]
                            "
                            >DBA/打电话</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_15'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_15`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_15`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_15`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_15`
                                ]
                            "
                            >DBA/打电话</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_2_16'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_2_16`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_2_16`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_2_16`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_2_16`
                                ]
                            "
                            >DBA/抽烟</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_2'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_2`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_2`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_2`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_2`
                                ]
                            "
                            >DBA/抽烟</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_16'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_16`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_16`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_16`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_16`
                                ]
                            "
                            >DBA/抽烟</el-checkbox
                        >
                    </el-col>
                </el-row>
                <el-row
                    type="flex"
                    v-if="
                        capability['intelliDrive_DBA'] &&
                        capability['intelliDrive_DBA'].length > 0
                    "
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_3_8'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_3_8`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_3_8`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_3_8`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_3_8`
                                ]
                            "
                            >DBA/注意力不集中</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_3'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_3`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_3`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_3`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_3`
                                ]
                            "
                            >DBA/注意力不集中</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_8'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_8`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_8`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_8`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_8`
                                ]
                            "
                            >DBA/注意力不集中</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_4_17'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_4_17`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_4_17`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_4_17`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_4_17`
                                ]
                            "
                            >DBA/离岗</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_4'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_4`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_4`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_4`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_4`
                                ]
                            "
                            >DBA/离岗</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_17'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_17`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_17`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_17`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_17`
                                ]
                            "
                            >DBA/离岗</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_5_18'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_5_18`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_5_18`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_5_18`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_5_18`
                                ]
                            "
                            >DBA/视频遮挡</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_5'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_5`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_5`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_5`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_5`
                                ]
                            "
                            >DBA/视频遮挡</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_18'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_18`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_18`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_18`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_18`
                                ]
                            "
                            >DBA/视频遮挡</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_6_19'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_6_19`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_6_19`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_6_19`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_6_19`
                                ]
                            "
                            >DBA/未系安全带</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_6'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_6`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_6`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_6`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_6`
                                ]
                            "
                            >DBA/未系安全带</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_19'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_19`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_19`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_19`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_19`
                                ]
                            "
                            >DBA/未系安全带</el-checkbox
                        >
                    </el-col>
                </el-row>
                <el-row
                    type="flex"
                    v-if="
                        capability['intelliDrive_DBA'] &&
                        capability['intelliDrive_DBA'].length > 0
                    "
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_9_20'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_9_20`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_9_20`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_9_20`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_9_20`
                                ]
                            "
                            >DBA/急加速</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_9'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_9`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_9`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_9`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_9`
                                ]
                            "
                            >DBA/急加速</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_20'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_20`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_20`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_20`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_20`
                                ]
                            "
                            >DBA/急加速</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_10_21'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_10_21`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_10_21`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_10_21`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_10_21`
                                ]
                            "
                            >DBA/急减速</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_10'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_10`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_10`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_10`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_10`
                                ]
                            "
                            >DBA/急减速</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_21'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_21`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_21`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_21`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_21`
                                ]
                            "
                            >DBA/急减速</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_11_22'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_11_22`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_11_22`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_11_22`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_11_22`
                                ]
                            "
                            >DBA/急转弯</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_11'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_11`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_11`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_11`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_11`
                                ]
                            "
                            >DBA/急转弯</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_22'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_22`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_22`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_22`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_22`
                                ]
                            "
                            >DBA/急转弯</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_12_23'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_12_23`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_12_23`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_12_23`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_12_23`
                                ]
                            "
                            >DBA/驾驶员异常</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_12'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_12`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_12`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_12`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_12`
                                ]
                            "
                            >DBA/驾驶员异常</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_23'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_23`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_23`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_23`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_23`
                                ]
                            "
                            >DBA/驾驶员异常</el-checkbox
                        >
                    </el-col>
                </el-row>
                <el-row
                    type="flex"
                    v-if="
                        capability['intelliDrive_DBA'] &&
                        capability['intelliDrive_DBA'].length > 0
                    "
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_13_24'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_13_24`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_13_24`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_13_24`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_13_24`
                                ]
                            "
                            >DBA/超时驾驶</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_13'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_13`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_13`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_13`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_13`
                                ]
                            "
                            >DBA/超时驾驶</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_24'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_24`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_24`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_24`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_24`
                                ]
                            "
                            >DBA/超时驾驶</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_14_25'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_14_25`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_14_25`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_14_25`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_14_25`
                                ]
                            "
                            >DBA/换人提醒</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_14'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_14`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_14`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_14`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_14`
                                ]
                            "
                            >DBA/换人提醒</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_25'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_25`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_25`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_25`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_25`
                                ]
                            "
                            >DBA/换人提醒</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_26_27'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_26_27`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_26_27`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_26_27`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_26_27`
                                ]
                            "
                            >DBA/墨镜</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_26'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_26`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_26`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_26`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_26`
                                ]
                            "
                            >DBA/墨镜</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_27'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_27`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_27`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_27`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_27`
                                ]
                            "
                            >DBA/墨镜</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_28_29'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_28_29`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_28_29`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_28_29`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_28_29`
                                ]
                            "
                            >DBA/面部遮挡</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_28'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_12`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_28`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_28`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_28`
                                ]
                            "
                            >DBA/面部遮挡</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '905_' +
                                        capability['intelliDrive_DBA'][0]
                                            .chanNo +
                                        '_29'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_29`
                                ] !== '' &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_29`
                                ] !== undefined &&
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_29`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `905_${capability['intelliDrive_DBA'][0].chanNo}_29`
                                ]
                            "
                            >DBA/面部遮挡</el-checkbox
                        >
                    </el-col>
                </el-row>
                <el-row
                    type="flex"
                    v-if="
                        capability['intelliDrive_BSD'] &&
                        capability['intelliDrive_BSD'].length > 0
                    "
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '920_' +
                                        capability['intelliDrive_BSD'][0]
                                            .chanNo +
                                        '_1_3'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_1_3`
                                ] !== '' &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_1_3`
                                ] !== undefined &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_1_3`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_1_3`
                                ]
                            "
                            >BSD/右侧盲区</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '920_' +
                                        capability['intelliDrive_BSD'][0]
                                            .chanNo +
                                        '_1'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_1`
                                ] !== '' &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_1`
                                ] !== undefined &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_1`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_1`
                                ]
                            "
                            >BSD/右侧盲区</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '920_' +
                                        capability['intelliDrive_BSD'][0]
                                            .chanNo +
                                        '_3'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_3`
                                ] !== '' &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_3`
                                ] !== undefined &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_3`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_3`
                                ]
                            "
                            >BSD/右侧盲区</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '920_' +
                                        capability['intelliDrive_BSD'][0]
                                            .chanNo +
                                        '_0_2'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_0_2`
                                ] !== '' &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_0_2`
                                ] !== undefined &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_0_2`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_0_2`
                                ]
                            "
                            >BSD/左侧盲区</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '920_' +
                                        capability['intelliDrive_BSD'][0]
                                            .chanNo +
                                        '_0'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_0`
                                ] !== '' &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_0`
                                ] !== undefined &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_0`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_0`
                                ]
                            "
                            >BSD/左侧盲区</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '920_' +
                                        capability['intelliDrive_BSD'][0]
                                            .chanNo +
                                        '_2'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_2`
                                ] !== '' &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_2`
                                ] !== undefined &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_2`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_2`
                                ]
                            "
                            >BSD/左侧盲区</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '920_' +
                                        capability['intelliDrive_BSD'][0]
                                            .chanNo +
                                        '_5_6'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_5_6`
                                ] !== '' &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_5_6`
                                ] !== undefined &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_5_6`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_5_6`
                                ]
                            "
                            >BSD/前侧盲区</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '920_' +
                                        capability['intelliDrive_BSD'][0]
                                            .chanNo +
                                        '_5'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_5`
                                ] !== '' &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_5`
                                ] !== undefined &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_5`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_5`
                                ]
                            "
                            >BSD/前侧盲区</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '920_' +
                                        capability['intelliDrive_BSD'][0]
                                            .chanNo +
                                        '_6'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_6`
                                ] !== '' &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_6`
                                ] !== undefined &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_6`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_6`
                                ]
                            "
                            >BSD/前侧盲区</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '920_' +
                                        capability['intelliDrive_BSD'][0]
                                            .chanNo +
                                        '_7_8'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_7_8`
                                ] !== '' &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_7_8`
                                ] !== undefined &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_7_8`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_7_8`
                                ]
                            "
                            >BSD/后侧盲区</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '920_' +
                                        capability['intelliDrive_BSD'][0]
                                            .chanNo +
                                        '_7'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_7`
                                ] !== '' &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_7`
                                ] !== undefined &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_7`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_7`
                                ]
                            "
                            >BSD/后侧盲区</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '920_' +
                                        capability['intelliDrive_BSD'][0]
                                            .chanNo +
                                        '_8'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_8`
                                ] !== '' &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_8`
                                ] !== undefined &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_8`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_8`
                                ]
                            "
                            >BSD/后侧盲区</el-checkbox
                        >
                    </el-col>
                </el-row>
                <el-row
                    type="flex"
                    v-if="
                        capability['intelliDrive_BSD'] &&
                        capability['intelliDrive_BSD'].length > 0
                    "
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '920_' +
                                        capability['intelliDrive_BSD'][0]
                                            .chanNo +
                                        '_4'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_4`
                                ] !== '' &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_4`
                                ] !== undefined &&
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_4`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `920_${capability['intelliDrive_BSD'][0].chanNo}_4`
                                ]
                            "
                            >BSD/全区域（M2设备）</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6"></el-col>
                    <el-col :span="6"></el-col>
                    <el-col :span="6"></el-col>
                </el-row>
                <el-row
                    type="flex"
                    v-if="
                        capability['intelliDrive_WHD'] &&
                        capability['intelliDrive_WHD'].length > 0
                    "
                    justify="space-between"
                    style="margin-top: 10px"
                >
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '938_' +
                                        capability['intelliDrive_WHD'][0].chanNo
                                )
                            "
                            v-if="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}`
                                ] !== '' &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}`
                                ] !== undefined &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}`
                                ]
                            "
                            >WHD/玩手机/WHD全局设置</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '938_' +
                                        capability['intelliDrive_WHD'][0]
                                            .chanNo +
                                        '_1_2'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_1_2`
                                ] !== '' &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_1_2`
                                ] !== undefined &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_1_2`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_1_2`
                                ]
                            "
                            >WHD/玩手机/双手脱离方向盘</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '938_' +
                                        capability['intelliDrive_WHD'][0]
                                            .chanNo +
                                        '_1'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_1`
                                ] !== '' &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_1`
                                ] !== undefined &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_1`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_1`
                                ]
                            "
                            >WHD/玩手机/双手脱离方向盘</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '938_' +
                                        capability['intelliDrive_WHD'][0]
                                            .chanNo +
                                        '_2'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_2`
                                ] !== '' &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_2`
                                ] !== undefined &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_2`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_2`
                                ]
                            "
                            >WHD/玩手机/双手脱离方向盘</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '938_' +
                                        capability['intelliDrive_WHD'][0]
                                            .chanNo +
                                        '_3_4'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_3_4`
                                ] !== '' &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_3_4`
                                ] !== undefined &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_3_4`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_3_4`
                                ]
                            "
                            >WHD/玩手机/单手脱离方向盘</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '938_' +
                                        capability['intelliDrive_WHD'][0]
                                            .chanNo +
                                        '_3'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_3`
                                ] !== '' &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_3`
                                ] !== undefined &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_3`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_3`
                                ]
                            "
                            >WHD/玩手机/单手脱离方向盘</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '938_' +
                                        capability['intelliDrive_WHD'][0]
                                            .chanNo +
                                        '_4'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_4`
                                ] !== '' &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_4`
                                ] !== undefined &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_4`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_4`
                                ]
                            "
                            >WHD/玩手机/单手脱离方向盘</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '938_' +
                                        capability['intelliDrive_WHD'][0]
                                            .chanNo +
                                        '_5_6'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_5_6`
                                ] !== '' &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_5_6`
                                ] !== undefined &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_5_6`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_5_6`
                                ]
                            "
                            >WHD/玩手机/玩手机</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '938_' +
                                        capability['intelliDrive_WHD'][0]
                                            .chanNo +
                                        '_5'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_5`
                                ] !== '' &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_5`
                                ] !== undefined &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_5`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_5`
                                ]
                            "
                            >WHD/玩手机/玩手机</el-checkbox
                        >
                        <el-checkbox
                            @change="
                                changeTemplate(
                                    '938_' +
                                        capability['intelliDrive_WHD'][0]
                                            .chanNo +
                                        '_6'
                                )
                            "
                            v-if="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_6`
                                ] !== '' &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_6`
                                ] !== undefined &&
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_6`
                                ] !== null
                            "
                            v-model="
                                moubleJson[
                                    `938_${capability['intelliDrive_WHD'][0].chanNo}_6`
                                ]
                            "
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
                            @change="changeTemplate('188')"
                            v-if="
                                moubleJson['188'] !== '' &&
                                moubleJson['188'] !== undefined &&
                                moubleJson['188'] !== null
                            "
                            v-model="moubleJson['188']"
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
                            @change="changeTemplate('957')"
                            v-if="
                                moubleJson['957'] !== '' &&
                                moubleJson['957'] !== undefined &&
                                moubleJson['957'] !== null
                            "
                            v-model="moubleJson['957']"
                            >超速报警</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('924')"
                            v-if="
                                moubleJson['924'] !== '' &&
                                moubleJson['924'] !== undefined &&
                                moubleJson['924'] !== null
                            "
                            v-model="moubleJson['924']"
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
                            @change="changeTemplate('948')"
                            v-if="
                                moubleJson['948'] !== '' &&
                                moubleJson['948'] !== undefined &&
                                moubleJson['948'] !== null
                            "
                            v-model="moubleJson['948']"
                            >声光报警器</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox
                            @change="changeTemplate('950')"
                            v-if="
                                moubleJson['950'] !== '' &&
                                moubleJson['950'] !== undefined &&
                                moubleJson['950'] !== null
                            "
                            v-model="moubleJson['950']"
                            >视频输出设置</el-checkbox
                        >
                    </el-col>
                    <el-col :span="6"></el-col>
                    <el-col :span="6"></el-col>
                </el-row>
            </div>
            <span slot="footer">
                <el-button type="default" @click="closeMouble">取消</el-button>
                <el-button
                    type="primary"
                    @click="prepareOk"
                    :disabled="
                        paramBol1 ||
                        paramBol2 ||
                        paramBol3 ||
                        paramBol4 ||
                        paramBol5 ||
                        paramBol6 ||
                        paramBol7 ||
                        paramBol8 ||
                        paramBol9 ||
                        paramBol10 ||
                        paramBol11 ||
                        paramBol12 ||
                        paramBol13 ||
                        paramBol14
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
                        <div class="no-config">
                            <el-button
                                icon="el-icon-refresh"
                                type="primary"
                                :disabled="configParams"
                                @click="getDeviceConfigParams()"
                                >{{
                                    configParams
                                        ? "正在获取中…"
                                        : "刷新最新配置"
                                }}</el-button
                            >
                            <!-- <a @click="openDialog">未获取到？</a> -->
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <h2>设备配置详情</h2>
        <el-alert
            title="协议配置下发时，设备必须为在线状态才可以下发配置。"
            type="info"
            simple
            show-icon
            class="m-y-sm"
        ></el-alert>
        <el-row layout class="configuration-module">
            <el-col :span="4">
                <el-menu
                    v-if="menuList.length"
                    :default-active="componentName"
                    class="menu-vertical"
                    unique-opened
                    ref="menu"
                >
                    <el-submenu
                        v-for="item in menuList"
                        :title="item.title"
                        v-bind:key="item.index"
                        :index="item.index"
                    >
                        <el-menu-item
                            :index="item_.value + ''"
                            v-for="item_ in item.children"
                            v-bind:key="item_.value"
                            @click="changeLabel(item_)"
                            >{{ item_.label }}</el-menu-item
                        >
                    </el-submenu>
                </el-menu>
            </el-col>
            <el-col :span="20">
                <div class="configuration-detail-content">
                    <div v-if="true" class="configuration-detail-item">
                        <component
                            ref="component"
                            @changeConfigParams="changeConfigParam"
                            @changeCopy="changeCopyForm"
                            @change="changeForm"
                            @formDataChange="changeFormData"
                            @setMenuActiveRefFormName="getMenuActiveRefFormName"
                            :is="componentName"
                            :setConfigParams="configParams"
                            :allEnumerationData="enumerationData"
                            :formDetail="initData"
                            :originalForm="originalInitData"
                            :setStatisticsData="statisticsData"
                            :allCapability="capability"
                        ></component>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div class="configuration-detail-submit p-y-sm p-x-md">
            <div style="margin-left: auto">
                <el-popover
                    ref="popover2"
                    placement="top"
                    style=""
                    width="500"
                    trigger="click"
                >
                    <p class="fontWeight">配置修改项({{ dataList.length }})</p>
                    <div>
                        <el-scrollbar wrap-class="demo-scrollbar-wrap-2">
                            <ul style="padding-right: 10px">
                                <li
                                    v-for="(item, index) in dataList"
                                    :key="index"
                                >
                                    <el-row>
                                        <el-col :span="23">
                                            <div class="deleteItem">
                                                {{
                                                    `${index + 1}、${
                                                        item[1]
                                                    }: 修改为 ${item[2]}`
                                                }}
                                            </div>
                                        </el-col>
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
                    <p
                        slot="reference"
                        style="
                            display: inline-block;
                            margin-right: 10px;
                            cursor: pointer;
                        "
                    >
                        您已修改&nbsp;<span
                            style="
                                color: red;
                                font-weight: 600;
                                font-size: 16px;
                            "
                            >{{ dataList.length }}</span
                        >&nbsp;项配置<i class="el-icon-arrow-down"></i>
                    </p>
                </el-popover>
                <p style="display: inline-block">
                    <el-button type="default" @click="goBack">返回</el-button>
                    <el-button type="default" @click="saveTemp()"
                        >存至模板</el-button
                    >
                    <el-button
                        type="primary"
                        @click="sendProtocol"
                        :disabled="JSON.stringify(initData) == '{}'"
                        >下发至终端</el-button
                    >
                </p>
            </div>
        </div>
        <StartConfig
            :visible.sync="startConfigVisible"
            :organizeId="organizeId"
            :batchCode="batchCode"
            :configType="configType"
            :top="configType == 'file' ? '200px' : 'middle'"
        ></StartConfig>
        <SaveTemplate
            :visible.sync="templateVisible"
            @submit="submitTemp"
        ></SaveTemplate>
    </div>
</template>
<script>
import AES from "@/utils/secret";
import StartConfig from "@/components/coreManage/startConfig";
import SaveTemplate from "@/components/coreManage/saveTemplate";
import PrivateRegister from "./privateProtocolComponents/privateRegister";
import PrivateVehicleInfo from "./privateProtocolComponents/privateVehicleInfo";
import PrivateShutDown from "./privateProtocolComponents/privateShutDown";
import PrivateVolume from "./privateProtocolComponents/privateVolume";
import PrivateFirstCenter from "./privateProtocolComponents/privateFirstCenter";
import PrivateSecondCenter from "./privateProtocolComponents/privateSecondCenter";
import PrivateThirdCenter from "./privateProtocolComponents/privateThirdCenter";
import PrivateForthCenter from "./privateProtocolComponents/privateForthCenter";
import PrivateFifthCenter from "./privateProtocolComponents/privateFifthCenter";
import PrivateSixthCenter from "./privateProtocolComponents/privateSixthCenter";
import PrivateAdas from "./privateProtocolComponents/privateAdas";
import PrivateDba from "./privateProtocolComponents/privateDba";
import PrivateBsd from "./privateProtocolComponents/privateBsd";
import PrivateWhd from "./privateProtocolComponents/privateWhd";
import PrivateVideo from "./privateProtocolComponents/privateVideo";
import PrivateOverSpeed from "./privateProtocolComponents/privateOverSpeed";
import PrivateOvertimeDriving from "./privateProtocolComponents/privateOvertimeDriving";
import PrivateIOOutput from "./privateProtocolComponents/privateIOOutput";
import PrivateIOOutput2 from "./privateProtocolComponents/privateIOOutput2";
import PrivateEventDisplay from "./privateProtocolComponents/privateEventDisplay";
import PrivateWorkMode from "./privateProtocolComponents/privateWorkMode";
import PrivateLed from "./privateProtocolComponents/privateLed";
import PrivateInvalidAlarm from "./privateProtocolComponents/privateInvalidAlarm";
import PrivateAndroidScreen from "./privateProtocolComponents/privateAndroidScreen";
import PrivateEcu from "./privateProtocolComponents/privateEcu";
import PrivateVehicleCtrl from "./privateProtocolComponents/privateVehicleCtrl";
import PrivateTcss from "./privateProtocolComponents/privateTcss";
import PrivateGsensor from "./privateProtocolComponents/privateGsensor";
import PrivateProgramme from "./privateProtocolComponents/privateProgramme";
import PrivateWiw from "./privateProtocolComponents/privateWiw";
import PrivateTurnSensor from "./privateProtocolComponents/privateTurnSensor";
import PrivateFuelSensor from "./privateProtocolComponents/privateFuelSensor";
import PrivatePeripheralWarnOut from "./privateProtocolComponents/privatePeripheralWarnOut";

import { valid } from "semver";
export default {
    props: {
        // isApiDeciveBols:{
        //   type:Boolean,
        //   default:false
        // }
    },
    components: {
        SaveTemplate,
        StartConfig,
        PrivateRegister,
        PrivateVehicleInfo,
        PrivateShutDown,
        PrivateVolume,
        PrivateFirstCenter,
        PrivateSecondCenter,
        PrivateThirdCenter,
        PrivateForthCenter,
        PrivateFifthCenter,
        PrivateSixthCenter,
        PrivateAdas,
        PrivateDba,
        PrivateBsd,
        PrivateWhd,
        PrivateVideo,
        PrivateOverSpeed,
        PrivateOvertimeDriving,
        PrivateIOOutput,
        PrivateIOOutput2,
        PrivateEventDisplay,
        PrivateWorkMode,
        PrivateLed,
        PrivateInvalidAlarm,
        PrivateAndroidScreen,
        PrivateEcu,
        PrivateVehicleCtrl,
        PrivateTcss,
        PrivateGsensor,
        PrivateProgramme,
        PrivateWiw,
        PrivateTurnSensor,
        PrivateFuelSensor,
        PrivatePeripheralWarnOut,
    },
    data() {
        return {
            organizeId: +this.$route.query.organizeId,
            configType: "protocol",
            batchCode: "",
            startConfigVisible: false,
            deviceId: this.$route.query.deviceId,
            configParams: true,
            validatorBol: false,
            updateBol: false, // 是否展示修改的配置项弹窗
            moubleBol: false, // 是否展示存至模板弹窗
            menuActiveRefFormName: "",
            deviceInfo: {},
            capability: {},
            menuList: [],
            manyCenter: [
                "PrivateFirstCenter",
                "PrivateSecondCenter",
                "PrivateThirdCenter",
                "PrivateForthCenter",
                "PrivateFifthCenter",
                "PrivateSixthCenter",
            ],
            manyCenterFormName: [
                "PrivateFirstForm",
                "PrivateSecondForm",
                "PrivateThirdForm",
                "PrivateForthForm",
                "PrivateFifthForm",
                "PrivateSixthForm",
            ],
            componentName: "",
            initData: {}, // 页面协议
            originalInitData: {}, // 原始协议
            statisticsData: {}, // 记录修改项
            dataList: [], // 修改的配置项
            enumerationData: {
                // 配置页面下拉框枚举
                verifyInternetList: [],
                verifyInternetJson: {},
                bandInternetList: [],
                bandInternetJson: {},
                pulseSettingSpeedSourceList: [],
                pulseSettingSpeedSourceJson: {},
                audioOutPutList: [],
                audioOutPutJson: {},
                voiceCallOutputList: [],
                voiceCallOutputJson: {},
                reportStrategyList0: [],
                reportStrategyJson0: {},
                reportStrategyList1: [],
                reportStrategyJson1: {},
                reportStrategyList2: [],
                reportStrategyJson2: {},
                reportStrategyList3: [],
                reportStrategyJson3: {},
                reportStrategyList4: [],
                reportStrategyJson4: {},
                reportStrategyList5: [],
                reportStrategyJson5: {},
                accessProtocolList0: [],
                accessProtocolJson0: {},
                extensionProtocolList0: [[], [], [], []],
                extensionProtocolJson0: [{}, {}, {}, {}],
                accessProtocolList1: [],
                accessProtocolJson1: {},
                extensionProtocolList1: [[], [], [], []],
                extensionProtocolJson1: [{}, {}, {}, {}],
                accessProtocolList2: [],
                accessProtocolJson2: {},
                extensionProtocolList2: [[], [], [], []],
                extensionProtocolJson2: [{}, {}, {}, {}],
                accessProtocolList3: [],
                accessProtocolJson3: {},
                extensionProtocolList3: [[], [], [], []],
                extensionProtocolJson3: [{}, {}, {}, {}],
                accessProtocolList4: [],
                accessProtocolJson4: {},
                extensionProtocolList4: [[], [], [], []],
                extensionProtocolJson4: [{}, {}, {}, {}],
                accessProtocolList5: [],
                accessProtocolJson5: {},
                extensionProtocolList5: [[], [], [], []],
                extensionProtocolJson5: [{}, {}, {}, {}],
                plateColorGenericList: [],
                plateColorGenericJson: {},
                workModeList: [], // 渣土车支持的工作模式
                workModeJson: {}, // 渣土车支持的工作模式json
                alarmInfoList: [], // 渣土车业务报警
                alarmInfoJson: {}, // 渣土车业务报警json
                acquireTypeList: [], // 渣土车支持的采集类型
                acquireTypeJson: [], // 渣土车支持的采集类型Json
                lightAdjustList: [], // 渣土车支持的外屏亮度调节
                lightAdjustJson: [], // 渣土车支持的外屏亮度调节json
                showMaskList: [], // 渣土车支持的显示类型
                showMaskJson: [], // 渣土车支持的显示类型Json
                advertShowCtrlList: [], // 渣土车支持的广告显示控制
                advertShowCtrlJson: [], // 渣土车支持的广告显示控制Json

                turnSensorList: [], // 正反转传感器
                turnSensorJson: [], // 正反转传感器Json
                fuelSensorList: [], // 油量传感器
                fuelSensorJson: [], // 油量传感器Json
                schemeTypeList: [], // 渣土车方案选择
                schemeTypeJson: [], // 渣土车方案选择Json

                vehCtrlModesList: [], // 渣土车支持的广告显示控制
                vehCtrlModesJson: [], // 渣土车支持的广告显示控制Json
                gsensorTurnList: [], // 渣土车支持的路口报警
                gsensorTurnJson: [], // 渣土车支持的路口报警Json
                osdEnableList: [], // 渣土车支持货箱状态 车厢状态OSD开关
                osdEnableJson: [], // 渣土车支持货箱状态 车厢状态OSD开关Json
                tcssList: [], // 渣土车货箱检测列表
                tcssJson: [], // 渣土车货箱检测列表Json

                screenTypeList: [], // 渣土车---安卓屏类型
                screenTypeJson: [], // 渣土车---安卓屏类型
                certTypeList: [], // 渣土车---证件类型
                certTypeJson: [], // 渣土车---证件类型
                defaultCertList: [], // 渣土车---默认证件
                defaultCertJson: [], // 渣土车---默认证件
                defaultShowList: [], // 渣土车---安卓屏默认界面
                defaultShowJson: [], // 渣土车---安卓屏默认界面
                notifyCtrlList: [], // 渣土车---安卓屏控制
                notifyCtrlJson: [], // 渣土车---安卓屏控制

                ecuTypeList: [], // 渣土车---ECU方案
                ecuTypeJson: [], // 渣土车---ECU方案

                plateTypeGenericList: [],
                plateTypeGenericJson: {},
                bsdDetectList0: [],
                bsdDetectJson0: {},
                bsdDetectList1: [],
                bsdDetectJson1: {},
                bsdDetectList2: [],
                bsdDetectJson2: {},
                bsdDetectList3: [],
                bsdDetectJson3: {},
                bsdDetectList4: [],
                bsdDetectJson4: {},
                bsdDetectList5: [],
                bsdDetectJson5: {},
                bsdDetectList6: [],
                bsdDetectJson6: {},
                bsdDetectList7: [],
                bsdDetectJson7: {},
                bsdDetectList8: [],
                bsdDetectJson8: {},
                resList1_0: [],
                resJson1_0: {},
                resList1_1: [],
                resJson1_1: {},
                resList2_0: [],
                resJson2_0: {},
                resList2_1: [],
                resJson2_1: {},
                resList3_0: [],
                resJson3_0: {},
                resList3_1: [],
                resJson3_1: {},
                resList4_0: [],
                resJson4_0: {},
                resList4_1: [],
                resJson4_1: {},
                resList5_0: [],
                resJson5_0: {},
                resList5_1: [],
                resJson5_1: {},
                resList6_0: [],
                resJson6_0: {},
                resList6_1: [],
                resJson6_1: {},
                resList7_0: [],
                resJson7_0: {},
                resList7_1: [],
                resJson7_1: {},
                resList8_0: [],
                resJson8_0: {},
                resList8_1: [],
                resJson8_1: {},
                resList9_0: [],
                resJson9_0: {},
                resList9_1: [],
                resJson9_1: {},
                resList10_0: [],
                resJson10_0: {},
                resList10_1: [],
                resJson10_1: {},
                resList11_0: [],
                resJson11_0: {},
                resList11_1: [],
                resJson11_1: {},
                resList12_0: [],
                resJson12_0: {},
                resList12_1: [],
                resJson12_1: {},
                resList13_0: [],
                resJson13_0: {},
                resList13_1: [],
                resJson13_1: {},
                resList14_0: [],
                resJson14_0: {},
                resList14_1: [],
                resJson14_1: {},
                resList11_0: [],
                resJson15_0: {},
                resList15_1: [],
                resJson15_1: {},
                resList16_0: [],
                resJson16_0: {},
                resList16_1: [],
                resJson16_1: {},
            },
            moubleJson: {}, // 可设置为模板的配置项统计
            originalInitMoubleJson: {}, // 可设置为模板的配置项统计原始数据
            templateData: {
                menuList: "",
                ehomeParams: [],
                capability: "",
            },
            templateVisible: false,
            paramBol1: false,
            paramBol2: false,
            paramBol3: false,
            paramBol4: false,
            paramBol5: false,
            paramBol6: false,
            paramBol7: false,
            paramBol8: false,
            paramBol9: false,
            paramBol10: false,
            paramBol11: false,
            paramBol12: false,
            paramBol13: false,
            paramBol14: false,
        };
    },
    watch: {
        moubleBol: {
            handler(val) {
                if (!val && !this.templateVisible) {
                    this.$nextTick(() => {
                        this.moubleJson = JSON.parse(
                            JSON.stringify(this.originalInitMoubleJson)
                        );
                        this.templateData = {
                            menuList: this.menuList,
                            ehomeParams: [],
                            capability: this.capability,
                        };
                    });
                } else if (val && !this.templateVisible) {
                    this.moubleJson = JSON.parse(
                        JSON.stringify(this.originalInitMoubleJson)
                    );
                }
            },
        },
        moubleJson: {
            handler(val) {
                for (const key in val) {
                    if (!val[key]) {
                        switch (key) {
                            case "2205_voiceCallOutput":
                                const itemArr = [
                                    "2205_voiceCallOutput",
                                    "2205_volume",
                                ];
                                this.templateData.ehomeParams.forEach(
                                    (item_, index) => {
                                        if (item_.markKey == itemArr[0]) {
                                            this.templateData.ehomeParams.splice(
                                                index,
                                                1
                                            );
                                        }
                                        if (item_.markKey == itemArr[1]) {
                                            this.templateData.ehomeParams.splice(
                                                index,
                                                1
                                            );
                                        }
                                    }
                                );
                                break;
                            case "2205_volume":
                                // 不可删
                                break;
                            default:
                                let index =
                                    this.templateData.ehomeParams.length;
                                while (index--) {
                                    if (
                                        this.templateData.ehomeParams[index]
                                            .markKey == key
                                    ) {
                                        this.templateData.ehomeParams.splice(
                                            index,
                                            1
                                        );
                                    }
                                }
                                break;
                        }
                    }
                }
            },
            deep: true,
            immediate: true,
        },
    },
    created() {
        this.getDeviceEHomeCapacity();
    },
    methods: {
        // 制作私有协议配置菜单栏以及配置页面下拉框配置项枚举
        makeMenu() {
            const menuLists = [
                {
                    title: "车辆设备",
                    index: "1",
                    children: [],
                },
                {
                    title: "多中心设置",
                    index: "2",
                    children: [],
                },
                {
                    title: "主动安全设置",
                    index: "3",
                    children: [],
                },
                {
                    title: "图像视频设置",
                    index: "4",
                    children: [],
                },
                {
                    title: "报警设置",
                    index: "5",
                    children: [],
                },
                {
                    title: "外设输出设置",
                    index: "6",
                    children: [],
                },
                {
                    title: "传感器设置",
                    index: "7",
                    children: [],
                },
                {
                    title: "工程车配置",
                    index: "8",
                    children: [],
                },
            ];
            for (const key in this.capability) {
                switch (key) {
                    case "network":
                        for (const key_ in this.capability[key]) {
                            switch (key_) {
                                case "internet":
                                    if (this.capability[key][key_].length) {
                                        menuLists[0].children.push({
                                            label: "注册参数",
                                            value: "PrivateRegister",
                                            formName: "PrivateRegisterForm",
                                            index: "1-1",
                                        });
                                    }
                                    if (
                                        this.capability[key][key_][0].verify &&
                                        this.capability[key][key_][0].verify
                                            .length
                                    ) {
                                        this.capability[key][
                                            key_
                                        ][0].verify.forEach((item) => {
                                            switch (item) {
                                                case 0:
                                                    this.enumerationData.verifyInternetList.push(
                                                        {
                                                            id: item,
                                                            label: "自动选择",
                                                        }
                                                    );
                                                    this.enumerationData.verifyInternetJson[
                                                        item
                                                    ] = "自动选择";
                                                    break;
                                                case 1:
                                                    this.enumerationData.verifyInternetList.push(
                                                        {
                                                            id: item,
                                                            label: "CHAP",
                                                        }
                                                    );
                                                    this.enumerationData.verifyInternetJson[
                                                        item
                                                    ] = "CHAP";
                                                    break;
                                                case 2:
                                                    this.enumerationData.verifyInternetList.push(
                                                        {
                                                            id: item,
                                                            label: "PAP",
                                                        }
                                                    );
                                                    this.enumerationData.verifyInternetJson[
                                                        item
                                                    ] = "PAP";
                                                    break;
                                            }
                                        });
                                    }
                                    if (
                                        this.capability[key][key_][0].band &&
                                        this.capability[key][key_][0].band
                                            .length
                                    ) {
                                        this.capability[key][
                                            key_
                                        ][0].band.forEach((item) => {
                                            switch (item) {
                                                case 0:
                                                    this.enumerationData.bandInternetList.push(
                                                        {
                                                            id: item,
                                                            label: "自动切换",
                                                        }
                                                    );
                                                    this.enumerationData.bandInternetJson[
                                                        item
                                                    ] = "自动切换";
                                                    break;
                                                case 1:
                                                    this.enumerationData.bandInternetList.push(
                                                        {
                                                            id: item,
                                                            label: "ADJUST切换",
                                                        }
                                                    );
                                                    this.enumerationData.bandInternetJson[
                                                        item
                                                    ] = "ADJUST切换";
                                                    break;
                                                case 2:
                                                    this.enumerationData.bandInternetList.push(
                                                        {
                                                            id: item,
                                                            label: "强制2G",
                                                        }
                                                    );
                                                    this.enumerationData.bandInternetJson[
                                                        item
                                                    ] = "强制2G";
                                                    break;
                                                case 3:
                                                    this.enumerationData.bandInternetList.push(
                                                        {
                                                            id: item,
                                                            label: "强制3G",
                                                        }
                                                    );
                                                    this.enumerationData.bandInternetJson[
                                                        item
                                                    ] = "强制3G";
                                                    break;
                                                case 4:
                                                    this.enumerationData.bandInternetList.push(
                                                        {
                                                            id: item,
                                                            label: "强制4G",
                                                        }
                                                    );
                                                    this.enumerationData.bandInternetJson[
                                                        item
                                                    ] = "强制4G";
                                                    break;
                                                case 5:
                                                    this.enumerationData.bandInternetList.push(
                                                        {
                                                            id: item,
                                                            label: "强制5G",
                                                        }
                                                    );
                                                    this.enumerationData.bandInternetJson[
                                                        item
                                                    ] = "强制5G";
                                                    break;
                                            }
                                        });
                                    }
                                    break;
                                case "platformInfo":
                                    this.$set(this.moubleJson, "705", false);
                                    if (this.capability[key][key_]) {
                                        let number = 0;
                                        for (
                                            let i = 0;
                                            i <
                                            this.capability[key][key_].length;
                                            i++
                                        ) {
                                            if (
                                                this.capability[key][key_][i]
                                                    .platformType == 1
                                            ) {
                                                for (
                                                    let j =
                                                        this.capability[key][
                                                            key_
                                                        ][i].platformCount;
                                                    j > 0;
                                                    j--
                                                ) {
                                                    number += j;
                                                    menuLists[1].children.push({
                                                        label: `第${number}中心`,
                                                        value: this.manyCenter[
                                                            number - 1
                                                        ],
                                                        formName:
                                                            this
                                                                .manyCenterFormName[
                                                                number - 1
                                                            ],
                                                        index: "2-" + number,
                                                    });
                                                }
                                            }
                                            if (
                                                this.capability[key][key_][i]
                                                    .locationReport &&
                                                this.capability[key][key_][i]
                                                    .locationReport
                                                    .reportStrategy &&
                                                this.capability[key][key_][i]
                                                    .locationReport
                                                    .reportStrategy.length
                                            ) {
                                                this.capability[key][key_][
                                                    i
                                                ].locationReport.reportStrategy.forEach(
                                                    (item) => {
                                                        switch (item) {
                                                            case 1:
                                                                this.enumerationData[
                                                                    "reportStrategyList" +
                                                                        i
                                                                ].push({
                                                                    id: item,
                                                                    label: "定时汇报",
                                                                });
                                                                this.enumerationData[
                                                                    "reportStrategyJson" +
                                                                        i
                                                                ][item] =
                                                                    "定时汇报";
                                                                break;
                                                            case 2:
                                                                this.enumerationData[
                                                                    "reportStrategyList" +
                                                                        i
                                                                ].push({
                                                                    id: item,
                                                                    label: "定距汇报",
                                                                });
                                                                this.enumerationData[
                                                                    "reportStrategyJson" +
                                                                        i
                                                                ][item] =
                                                                    "定距汇报";
                                                                break;
                                                            case 3:
                                                                this.enumerationData[
                                                                    "reportStrategyList" +
                                                                        i
                                                                ].push({
                                                                    id: item,
                                                                    label: "定时汇报和定距汇报",
                                                                });
                                                                this.enumerationData[
                                                                    "reportStrategyJson" +
                                                                        i
                                                                ][item] =
                                                                    "定时汇报和定距汇报";
                                                                break;
                                                        }
                                                    }
                                                );
                                            }
                                            if (
                                                this.capability[key][key_][i]
                                                    .platformDetail &&
                                                this.capability[key][key_][i]
                                                    .platformDetail.length
                                            ) {
                                                this.capability[key][key_][
                                                    i
                                                ].platformDetail.forEach(
                                                    (item) => {
                                                        switch (
                                                            item.accessProtocol
                                                        ) {
                                                            case 0:
                                                                this.enumerationData[
                                                                    "accessProtocolList" +
                                                                        i
                                                                ].push({
                                                                    id: item.accessProtocol,
                                                                    label: "JT808_2011",
                                                                });
                                                                this.enumerationData[
                                                                    "accessProtocolJson" +
                                                                        i
                                                                ][
                                                                    item.accessProtocol
                                                                ] =
                                                                    "JT808_2011";
                                                                item.extensionProtocol.forEach(
                                                                    (item_) => {
                                                                        switch (
                                                                            item_
                                                                        ) {
                                                                            case 0:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "不使用",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "不使用";
                                                                                break;
                                                                            case 3:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "部标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "部标协议";
                                                                                break;
                                                                            case 4:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "苏标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "苏标协议";
                                                                                break;
                                                                            case 5:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "浙标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "浙标协议";
                                                                                break;
                                                                            case 6:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "陕标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "陕标协议";
                                                                                break;
                                                                            case 7:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "渝标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "渝标协议";
                                                                                break;
                                                                            case 8:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "川标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "川标协议";
                                                                                break;
                                                                            case 9:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "RTSM",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "RTSM";
                                                                                break;
                                                                            case 10:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "HATC",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "HATC";
                                                                                break;
                                                                            case 11:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "宇通V+平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "宇通V+平台";
                                                                                break;
                                                                            case 12:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "沪标平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "沪标平台";
                                                                                break;
                                                                            case 13:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "粤标平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "粤标平台";
                                                                                break;
                                                                            case 14:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "黑标平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "黑标平台";
                                                                                break;
                                                                            case 55:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "中联",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "中联";
                                                                                break;
                                                                            case 56:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "辽标平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "辽标平台";
                                                                                break;
                                                                            case 99:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "其他平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "其他平台";
                                                                                break;
                                                                        }
                                                                    }
                                                                );
                                                                break;
                                                            case 1:
                                                                this.enumerationData[
                                                                    "accessProtocolList" +
                                                                        i
                                                                ].push({
                                                                    id: item.accessProtocol,
                                                                    label: "JT905",
                                                                });
                                                                this.enumerationData[
                                                                    "accessProtocolJson" +
                                                                        i
                                                                ][
                                                                    item.accessProtocol
                                                                ] = "JT905";
                                                                item.extensionProtocol.forEach(
                                                                    (item_) => {
                                                                        switch (
                                                                            item_
                                                                        ) {
                                                                            case 0:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "不使用",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "不使用";
                                                                                break;
                                                                            case 3:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "部标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "部标协议";
                                                                                break;
                                                                            case 4:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "苏标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "苏标协议";
                                                                                break;
                                                                            case 5:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "浙标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "浙标协议";
                                                                                break;
                                                                            case 6:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "陕标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "陕标协议";
                                                                                break;
                                                                            case 7:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "渝标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "渝标协议";
                                                                                break;
                                                                            case 8:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "川标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "川标协议";
                                                                                break;
                                                                            case 9:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "RTSM",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "RTSM";
                                                                                break;
                                                                            case 10:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "HATC",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "HATC";
                                                                                break;
                                                                            case 11:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "宇通V+平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "宇通V+平台";
                                                                                break;
                                                                            case 12:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "沪标平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "沪标平台";
                                                                                break;
                                                                            case 13:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "粤标平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "粤标平台";
                                                                                break;
                                                                            case 14:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "黑标平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "黑标平台";
                                                                                break;
                                                                            case 55:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "中联",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "中联";
                                                                                break;
                                                                            case 56:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "辽标平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "辽标平台";
                                                                                break;
                                                                            case 99:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "其他平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "其他平台";
                                                                                break;
                                                                        }
                                                                    }
                                                                );
                                                                break;
                                                            case 2:
                                                                this.enumerationData[
                                                                    "accessProtocolList" +
                                                                        i
                                                                ].push({
                                                                    id: item.accessProtocol,
                                                                    label: "JT808_2019",
                                                                });
                                                                this.enumerationData[
                                                                    "accessProtocolJson" +
                                                                        i
                                                                ][
                                                                    item.accessProtocol
                                                                ] =
                                                                    "JT808_2019";
                                                                item.extensionProtocol.forEach(
                                                                    (item_) => {
                                                                        switch (
                                                                            item_
                                                                        ) {
                                                                            case 0:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "不使用",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "不使用";
                                                                                break;
                                                                            case 3:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "部标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "部标协议";
                                                                                break;
                                                                            case 4:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "苏标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "苏标协议";
                                                                                break;
                                                                            case 5:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "浙标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "浙标协议";
                                                                                break;
                                                                            case 6:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "陕标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "陕标协议";
                                                                                break;
                                                                            case 7:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "渝标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "渝标协议";
                                                                                break;
                                                                            case 8:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "川标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "川标协议";
                                                                                break;
                                                                            case 9:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "RTSM",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "RTSM";
                                                                                break;
                                                                            case 10:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "HATC",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "HATC";
                                                                                break;
                                                                            case 11:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "宇通V+平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "宇通V+平台";
                                                                                break;
                                                                            case 12:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "沪标平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "沪标平台";
                                                                                break;
                                                                            case 13:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "粤标平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "粤标平台";
                                                                                break;
                                                                            case 14:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "黑标平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "黑标平台";
                                                                                break;
                                                                            case 55:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "中联",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "中联";
                                                                                break;
                                                                            case 56:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "辽标平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "辽标平台";
                                                                                break;
                                                                            case 99:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "其他平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "其他平台";
                                                                                break;
                                                                        }
                                                                    }
                                                                );
                                                                break;
                                                            case 3:
                                                                this.enumerationData[
                                                                    "accessProtocolList" +
                                                                        i
                                                                ].push({
                                                                    id: item.accessProtocol,
                                                                    label: "JT808_2013",
                                                                });
                                                                this.enumerationData[
                                                                    "accessProtocolJson" +
                                                                        i
                                                                ][
                                                                    item.accessProtocol
                                                                ] =
                                                                    "JT808_2013";
                                                                item.extensionProtocol.forEach(
                                                                    (item_) => {
                                                                        switch (
                                                                            item_
                                                                        ) {
                                                                            case 0:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "不使用",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "不使用";
                                                                                break;
                                                                            case 3:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "部标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "部标协议";
                                                                                break;
                                                                            case 4:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "苏标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "苏标协议";
                                                                                break;
                                                                            case 5:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "浙标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "浙标协议";
                                                                                break;
                                                                            case 6:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "陕标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "陕标协议";
                                                                                break;
                                                                            case 7:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "渝标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "渝标协议";
                                                                                break;
                                                                            case 8:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "川标协议",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "川标协议";
                                                                                break;
                                                                            case 9:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "RTSM",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "RTSM";
                                                                                break;
                                                                            case 10:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "HATC",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "HATC";
                                                                                break;
                                                                            case 11:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "宇通V+平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "宇通V+平台";
                                                                                break;
                                                                            case 12:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "沪标平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "沪标平台";
                                                                                break;
                                                                            case 13:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "粤标平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "粤标平台";
                                                                                break;
                                                                            case 14:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "黑标平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "黑标平台";
                                                                                break;
                                                                            case 55:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "中联",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "中联";
                                                                                break;
                                                                            case 56:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "辽标平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "辽标平台";
                                                                                break;
                                                                            case 99:
                                                                                this.enumerationData[
                                                                                    "extensionProtocolList" +
                                                                                        i
                                                                                ][
                                                                                    item
                                                                                        .accessProtocol
                                                                                ].push(
                                                                                    {
                                                                                        id: item_,
                                                                                        label: "其他平台",
                                                                                    }
                                                                                );
                                                                                this.enumerationData[
                                                                                    "extensionProtocolJson" +
                                                                                        i
                                                                                ][
                                                                                    item.accessProtocol
                                                                                ][
                                                                                    item_
                                                                                ] =
                                                                                    "其他平台";
                                                                                break;
                                                                        }
                                                                    }
                                                                );
                                                                break;
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    }
                                    break;
                            }
                        }
                        break;
                    case "generic":
                        if (
                            this.capability[key] &&
                            this.capability[key].vehicleDetail
                        ) {
                            menuLists[0].children.push({
                                label: "车辆信息",
                                value: "PrivateVehicleInfo",
                                formName: "PrivateVehicleInfoForm",
                                index: "1-2",
                            });
                            if (
                                this.capability[key].vehicleDetail.plateColor &&
                                this.capability[key].vehicleDetail.plateColor
                                    .length
                            ) {
                                this.capability[
                                    key
                                ].vehicleDetail.plateColor.forEach((item) => {
                                    switch (item) {
                                        case 0:
                                            this.enumerationData.plateColorGenericList.push(
                                                {
                                                    id: item,
                                                    label: "未上牌",
                                                }
                                            );
                                            this.enumerationData.plateColorGenericJson[
                                                item
                                            ] = "未上牌";
                                            break;
                                        case 1:
                                            this.enumerationData.plateColorGenericList.push(
                                                {
                                                    id: item,
                                                    label: "蓝",
                                                }
                                            );
                                            this.enumerationData.plateColorGenericJson[
                                                item
                                            ] = "蓝";
                                            break;
                                        case 2:
                                            this.enumerationData.plateColorGenericList.push(
                                                {
                                                    id: item,
                                                    label: "黄",
                                                }
                                            );
                                            this.enumerationData.plateColorGenericJson[
                                                item
                                            ] = "黄";
                                            break;
                                        case 3:
                                            this.enumerationData.plateColorGenericList.push(
                                                {
                                                    id: item,
                                                    label: "黑",
                                                }
                                            );
                                            this.enumerationData.plateColorGenericJson[
                                                item
                                            ] = "黑";
                                            break;
                                        case 4:
                                            this.enumerationData.plateColorGenericList.push(
                                                {
                                                    id: item,
                                                    label: "白",
                                                }
                                            );
                                            this.enumerationData.plateColorGenericJson[
                                                item
                                            ] = "白";
                                            break;
                                        case 5:
                                            this.enumerationData.plateColorGenericList.push(
                                                {
                                                    id: item,
                                                    label: "绿",
                                                }
                                            );
                                            this.enumerationData.plateColorGenericJson[
                                                item
                                            ] = "绿";
                                            break;
                                        case 6:
                                            this.enumerationData.plateColorGenericList.push(
                                                {
                                                    id: item,
                                                    label: "黄绿",
                                                }
                                            );
                                            this.enumerationData.plateColorGenericJson[
                                                item
                                            ] = "黄绿";
                                            break;
                                        case 99:
                                            this.enumerationData.plateColorGenericList.push(
                                                {
                                                    id: item,
                                                    label: "其他",
                                                }
                                            );
                                            this.enumerationData.plateColorGenericJson[
                                                item
                                            ] = "其他";
                                            break;
                                    }
                                });
                            }
                            if (
                                this.capability[key].vehicleDetail.plateType &&
                                this.capability[key].vehicleDetail.plateType
                                    .length
                            ) {
                                this.capability[
                                    key
                                ].vehicleDetail.plateType.forEach((item) => {
                                    switch (item) {
                                        case 1:
                                            this.enumerationData.plateTypeGenericList.push(
                                                {
                                                    id: item,
                                                    label: "小型车辆",
                                                }
                                            );
                                            this.enumerationData.plateTypeGenericJson[
                                                item
                                            ] = "小型车辆";
                                            break;
                                        case 2:
                                            this.enumerationData.plateTypeGenericList.push(
                                                {
                                                    id: item,
                                                    label: "大型车辆",
                                                }
                                            );
                                            this.enumerationData.plateTypeGenericJson[
                                                item
                                            ] = "大型车辆";
                                            break;
                                        case 3:
                                            this.enumerationData.plateTypeGenericList.push(
                                                {
                                                    id: item,
                                                    label: "挂车",
                                                }
                                            );
                                            this.enumerationData.plateTypeGenericJson[
                                                item
                                            ] = "挂车";
                                            break;
                                        case 4:
                                            this.enumerationData.plateTypeGenericList.push(
                                                {
                                                    id: item,
                                                    label: "营运载客汽车",
                                                }
                                            );
                                            this.enumerationData.plateTypeGenericJson[
                                                item
                                            ] = "营运载客汽车";
                                            break;
                                        case 5:
                                            this.enumerationData.plateTypeGenericList.push(
                                                {
                                                    id: item,
                                                    label: "危险货物运输车辆",
                                                }
                                            );
                                            this.enumerationData.plateTypeGenericJson[
                                                item
                                            ] = "危险货物运输车辆";
                                            break;
                                        case 6:
                                            this.enumerationData.plateTypeGenericList.push(
                                                {
                                                    id: item,
                                                    label: "货车",
                                                }
                                            );
                                            this.enumerationData.plateTypeGenericJson[
                                                item
                                            ] = "货车";
                                            break;
                                        case 7:
                                            this.enumerationData.plateTypeGenericList.push(
                                                {
                                                    id: item,
                                                    label: "重型厢式货车",
                                                }
                                            );
                                            this.enumerationData.plateTypeGenericJson[
                                                item
                                            ] = "重型厢式货车";
                                            break;
                                        case 8:
                                            this.enumerationData.plateTypeGenericList.push(
                                                {
                                                    id: item,
                                                    label: "校车",
                                                }
                                            );
                                            this.enumerationData.plateTypeGenericJson[
                                                item
                                            ] = "校车";
                                            break;
                                        case 9:
                                            this.enumerationData.plateTypeGenericList.push(
                                                {
                                                    id: item,
                                                    label: "特种工程车",
                                                }
                                            );
                                            this.enumerationData.plateTypeGenericJson[
                                                item
                                            ] = "特种工程车";
                                            break;
                                        case 10:
                                            this.enumerationData.plateTypeGenericList.push(
                                                {
                                                    id: item,
                                                    label: "重型载货汽车",
                                                }
                                            );
                                            this.enumerationData.plateTypeGenericJson[
                                                item
                                            ] = "重型载货汽车";
                                            break;
                                        case 11:
                                            this.enumerationData.plateTypeGenericList.push(
                                                {
                                                    id: item,
                                                    label: "半挂牵引车",
                                                }
                                            );
                                            this.enumerationData.plateTypeGenericJson[
                                                item
                                            ] = "半挂牵引车";
                                            break;
                                        case 12:
                                            this.enumerationData.plateTypeGenericList.push(
                                                {
                                                    id: item,
                                                    label: "散装物料车",
                                                }
                                            );
                                            this.enumerationData.plateTypeGenericJson[
                                                item
                                            ] = "散装物料车";
                                            break;
                                        case 13:
                                            this.enumerationData.plateTypeGenericList.push(
                                                {
                                                    id: item,
                                                    label: "教练车",
                                                }
                                            );
                                            this.enumerationData.plateTypeGenericJson[
                                                item
                                            ] = "教练车";
                                            break;
                                    }
                                });
                            }
                        }
                        if (
                            this.capability[key] &&
                            (this.capability[key].shutdownDelay ||
                                this.capability[key].shutdownDelayCustom)
                        ) {
                            this.$set(
                                this.moubleJson,
                                "192_shutdownDelay",
                                false
                            );
                            menuLists[0].children.push({
                                label: "延时关机时间",
                                value: "PrivateShutDown",
                                formName: "PrivateShutDownForm",
                                index: "1-3",
                            });
                        }
                        if (
                            (this.capability[key] &&
                                this.capability[key].audioOutput) ||
                            (this.capability[key] &&
                                this.capability[key].voiceCallOutput)
                                ||
                            (this.capability[key] &&
                                this.capability[key].volume)
                        ) {
                            menuLists[0].children.push({
                                label: "音量设置",
                                value: "PrivateVolume",
                                formName: "PrivateVolumeForm",
                                index: "1-4",
                            });
                            if (
                                this.capability[key].audioOutput &&
                                this.capability[key].audioOutput.length
                            ) {
                                this.$set(
                                    this.moubleJson,
                                    "2205_audioOutput",
                                    false
                                );
                                this.capability[key].audioOutput.forEach(
                                    (item) => {
                                        switch (item) {
                                            case 0:
                                                this.enumerationData.audioOutPutList.push(
                                                    {
                                                        id: String(item),
                                                        label: "ADAS相机",
                                                    }
                                                );
                                                this.enumerationData.audioOutPutJson[
                                                    String(item)
                                                ] = "ADAS相机";
                                                break;
                                            case 1:
                                                this.enumerationData.audioOutPutList.push(
                                                    {
                                                        id: String(item),
                                                        label: "DBA相机",
                                                    }
                                                );
                                                this.enumerationData.audioOutPutJson[
                                                    String(item)
                                                ] = "DBA相机";
                                                break;
                                            case 2:
                                                this.enumerationData.audioOutPutList.push(
                                                    {
                                                        id: String(item),
                                                        label: "外置扬声器（报警终端）",
                                                    }
                                                );
                                                this.enumerationData.audioOutPutJson[
                                                    String(item)
                                                ] = "外置扬声器（报警终端）";
                                                break;
                                            case 3:
                                                this.enumerationData.audioOutPutList.push(
                                                    {
                                                        id: String(item),
                                                        label: "手麦",
                                                    }
                                                );
                                                this.enumerationData.audioOutPutJson[
                                                    String(item)
                                                ] = "手麦";
                                                break;
                                            case 4:
                                                this.enumerationData.audioOutPutList.push(
                                                    {
                                                        id: String(item),
                                                        label: "内置扬声器",
                                                    }
                                                );
                                                this.enumerationData.audioOutPutJson[
                                                    String(item)
                                                ] = "内置扬声器";
                                                break;
                                            case 9:
                                                this.enumerationData.audioOutPutList.push(
                                                    {
                                                        id: String(item),
                                                        label: "ADAS和DBA相机",
                                                    }
                                                );
                                                this.enumerationData.audioOutPutJson[
                                                    String(item)
                                                ] = "ADAS和DBA相机";
                                                break;
                                            case 16:
                                                this.enumerationData.audioOutPutList.push(
                                                    {
                                                        id: String(item),
                                                        label: "自适应",
                                                    }
                                                );
                                                this.enumerationData.audioOutPutJson[
                                                    String(item)
                                                ] = "自适应";
                                                break;
                                        }
                                    }
                                );
                            }
                            if (
                                this.capability[key].voiceCallOutput &&
                                this.capability[key].voiceCallOutput.length
                            ) {
                                this.$set(
                                    this.moubleJson,
                                    "2205_voiceCallOutput",
                                    false
                                );
                                this.$set(
                                    this.moubleJson,
                                    "2205_volume",
                                    false
                                );
                                this.capability[key].voiceCallOutput.forEach(
                                    (item) => {
                                        switch (item) {
                                            case 0:
                                                this.enumerationData.voiceCallOutputList.push(
                                                    {
                                                        id: String(item),
                                                        label: "手麦",
                                                    }
                                                );
                                                this.enumerationData.voiceCallOutputJson[
                                                    String(item)
                                                ] = "手麦";
                                                break;
                                            case 1:
                                                this.enumerationData.voiceCallOutputList.push(
                                                    {
                                                        id: String(item),
                                                        label: "外置扬声器",
                                                    }
                                                );
                                                this.enumerationData.voiceCallOutputJson[
                                                    String(item)
                                                ] = "外置扬声器";
                                                break;
                                            case 2:
                                                this.enumerationData.voiceCallOutputList.push(
                                                    {
                                                        id: String(item),
                                                        label: "内置扬声器",
                                                    }
                                                );
                                                this.enumerationData.voiceCallOutputJson[
                                                    String(item)
                                                ] = "内置扬声器";
                                                break;
                                            case 3:
                                                this.enumerationData.voiceCallOutputList.push(
                                                    {
                                                        id: String(item),
                                                        label: "ADAS相机",
                                                    }
                                                );
                                                this.enumerationData.voiceCallOutputJson[
                                                    String(item)
                                                ] = "ADAS相机";
                                                break;
                                            case 4:
                                                this.enumerationData.voiceCallOutputList.push(
                                                    {
                                                        id: String(item),
                                                        label: "DBA相机",
                                                    }
                                                );
                                                this.enumerationData.voiceCallOutputJson[
                                                    String(item)
                                                ] = "DBA相机";
                                                break;
                                            case 9:
                                                this.enumerationData.voiceCallOutputList.push(
                                                    {
                                                        id: String(item),
                                                        label: "ADAS和DBA相机",
                                                    }
                                                );
                                                this.enumerationData.voiceCallOutputJson[
                                                    String(item)
                                                ] = "ADAS和DBA相机";
                                                break;
                                            case 16:
                                                this.enumerationData.voiceCallOutputList.push(
                                                    {
                                                        id: String(item),
                                                        label: "自适应",
                                                    }
                                                );
                                                this.enumerationData.voiceCallOutputJson[
                                                    String(item)
                                                ] = "自适应";
                                                break;
                                        }
                                    }
                                );
                            }
                        }
                        if (
                            this.capability[key] &&
                            this.capability[key].schemeType &&
                            this.capability[key].schemeType.length
                        ) {
                            this.capability[key].schemeType.forEach((item) => {
                                this.enumerationData.schemeTypeList.push({
                                    type: item.type,
                                    name: item.name,
                                });
                                this.enumerationData.schemeTypeJson[item.type] =
                                    item.name;
                            });
                            menuLists[7].children.push({
                                label: "方案配置",
                                value: "PrivateProgramme",
                                formName: "PrivateProgrammeForm",
                                index: "8-9",
                            });
                        }
                        break;
                    case "intelliDrive_sensor":
                        if (
                            this.capability[key] &&
                            this.capability[key].pulseSetting &&
                            this.capability[key].pulseSetting.length
                        ) {
                            this.capability[
                                key
                            ].pulseSetting[0].speedSource.forEach((item) => {
                                switch (item) {
                                    case 0:
                                        this.enumerationData.pulseSettingSpeedSourceList.push(
                                            {
                                                id: item,
                                                label: "自动更新",
                                            }
                                        );
                                        this.enumerationData.pulseSettingSpeedSourceJson[
                                            item
                                        ] = "自动更新";
                                        break;
                                    case 1:
                                        this.enumerationData.pulseSettingSpeedSourceList.push(
                                            {
                                                id: item,
                                                label: "GPS",
                                            }
                                        );
                                        this.enumerationData.pulseSettingSpeedSourceJson[
                                            item
                                        ] = "GPS";
                                        break;
                                    case 2:
                                        this.enumerationData.pulseSettingSpeedSourceList.push(
                                            {
                                                id: item,
                                                label: "硬线手动",
                                            }
                                        );
                                        this.enumerationData.pulseSettingSpeedSourceJson[
                                            item
                                        ] = "硬线手动";
                                        break;
                                    case 3:
                                        this.enumerationData.pulseSettingSpeedSourceList.push(
                                            {
                                                id: item,
                                                label: "硬线自动",
                                            }
                                        );
                                        this.enumerationData.pulseSettingSpeedSourceJson[
                                            item
                                        ] = "硬线自动";
                                        break;
                                    case 4:
                                        this.enumerationData.pulseSettingSpeedSourceList.push(
                                            {
                                                id: item,
                                                label: "CAN速度",
                                            }
                                        );
                                        this.enumerationData.pulseSettingSpeedSourceJson[
                                            item
                                        ] = "CAN速度";
                                        break;
                                }
                            });
                        }
                        if (
                            this.capability[key].IOOutput &&
                            this.capability[key].IOOutput.length
                        ) {
                            this.$set(this.moubleJson, "948", false);
                            menuLists[5].children.push({
                                label: "声光报警器(外置)",
                                value: "PrivateIOOutput",
                                formName: "PrivateIOOutputForm",
                                index: "6-1",
                            });
                            menuLists[5].children.push({
                                label: "声光报警器(内置)",
                                value: "PrivateIOOutput2",
                                formName: "PrivateIOOutputForm2",
                                index: "6-3",
                            });
                        }
                        if (
                            this.capability[key].eventDisplay &&
                            this.capability[key].eventDisplay.length
                        ) {
                            this.$set(this.moubleJson, "950", false);
                            menuLists[5].children.push({
                                label: "视频输出设置",
                                value: "PrivateEventDisplay",
                                formName: "PrivateEventDisplayForm",
                                index: "6-2",
                            });
                        }
                        if (this.capability[key].turnSensor) {
                            menuLists[6].children.push({
                                label: "正反转传感器",
                                value: "PrivateTurnSensor",
                                formName: "PrivateTurnSensorForm",
                                index: "7-1",
                            });
                            if (
                                this.capability[key].turnSensor
                                    .turnSensorList &&
                                this.capability[key].turnSensor.turnSensorList
                                    .length
                            ) {
                                this.capability[
                                    key
                                ].turnSensor.turnSensorList.forEach((item) => {
                                    this.enumerationData.turnSensorList.push({
                                        id: item.type,
                                        label: item.name,
                                    });
                                });
                            }
                        }
                        if (this.capability[key].fuelSensor) {
                            menuLists[6].children.push({
                                label: "油量传感器",
                                value: "PrivateFuelSensor",
                                formName: "PrivateFuelSensorForm",
                                index: "7-2",
                            });
                            if (
                                this.capability[key].fuelSensor
                                    .fuelSensorList &&
                                this.capability[key].fuelSensor.fuelSensorList
                                    .length
                            ) {
                                this.capability[
                                    key
                                ].fuelSensor.fuelSensorList.forEach((item) => {
                                    this.enumerationData.fuelSensorList.push({
                                        id: item.type,
                                        label: item.name,
                                    });
                                });
                            }
                        }
                        break;
                    case "intelliDrive_ADAS":
                        if (
                            this.capability[key] &&
                            this.capability[key].length
                        ) {
                            this.capability[key].forEach((item) => {
                                this.$set(
                                    this.moubleJson,
                                    `901_${item.chanNo}`,
                                    false
                                );
                                this.makeMoubleJson(
                                    901,
                                    item.chanNo,
                                    item.supportType,
                                    0,
                                    4
                                );
                                this.makeMoubleJson(
                                    901,
                                    item.chanNo,
                                    item.supportType,
                                    1,
                                    5
                                );
                                this.makeMoubleJson(
                                    901,
                                    item.chanNo,
                                    item.supportType,
                                    2,
                                    6
                                );
                                this.makeMoubleJson(
                                    901,
                                    item.chanNo,
                                    item.supportType,
                                    3,
                                    7
                                );
                                this.makeMoubleJson(
                                    901,
                                    item.chanNo,
                                    item.supportType,
                                    8,
                                    9
                                );
                                this.makeMoubleJson(
                                    901,
                                    item.chanNo,
                                    item.supportType,
                                    12,
                                    13
                                );
                                this.makeMoubleJson(
                                    901,
                                    item.chanNo,
                                    item.supportType,
                                    18,
                                    19
                                );
                                this.makeMoubleJson(
                                    901,
                                    item.chanNo,
                                    item.supportType,
                                    32,
                                    33
                                );
                            });
                            menuLists[2].children.push({
                                label: "ADAS",
                                value: "PrivateAdas",
                                formName: "PrivateAdasForm",
                                index: "2-1",
                            });
                        }
                        break;
                    case "intelliDrive_WIW":
                        if (
                            this.capability[key] &&
                            this.capability[key].length
                        ) {
                            this.capability[key].forEach((item) => {
                                this.$set(
                                    this.moubleJson,
                                    `983_${item.chanNo}`,
                                    false
                                );
                                this.makeMoubleJson(
                                    983,
                                    item.chanNo,
                                    item.supportType,
                                    1,
                                    2
                                );
                            });
                            menuLists[2].children.push({
                                label: "WIW",
                                value: "PrivateWiw",
                                formName: "PrivateWiwForm",
                                index: "2-5",
                            });
                        }
                        break;
                    case "intelliDrive_DBA":
                        if (
                            this.capability[key] &&
                            this.capability[key].length
                        ) {
                            this.capability[key].forEach((item) => {
                                this.$set(
                                    this.moubleJson,
                                    `905_${item.chanNo}`,
                                    false
                                );
                                this.makeMoubleJson(
                                    905,
                                    item.chanNo,
                                    item.supportType,
                                    0,
                                    7
                                );
                                this.makeMoubleJson(
                                    905,
                                    item.chanNo,
                                    item.supportType,
                                    1,
                                    15
                                );
                                this.makeMoubleJson(
                                    905,
                                    item.chanNo,
                                    item.supportType,
                                    2,
                                    16
                                );
                                this.makeMoubleJson(
                                    905,
                                    item.chanNo,
                                    item.supportType,
                                    3,
                                    8
                                );
                                this.makeMoubleJson(
                                    905,
                                    item.chanNo,
                                    item.supportType,
                                    4,
                                    17
                                );
                                this.makeMoubleJson(
                                    905,
                                    item.chanNo,
                                    item.supportType,
                                    5,
                                    18
                                );
                                this.makeMoubleJson(
                                    905,
                                    item.chanNo,
                                    item.supportType,
                                    6,
                                    19
                                );
                                this.makeMoubleJson(
                                    905,
                                    item.chanNo,
                                    item.supportType,
                                    9,
                                    20
                                );
                                this.makeMoubleJson(
                                    905,
                                    item.chanNo,
                                    item.supportType,
                                    10,
                                    21
                                );
                                this.makeMoubleJson(
                                    905,
                                    item.chanNo,
                                    item.supportType,
                                    11,
                                    22
                                );
                                this.makeMoubleJson(
                                    905,
                                    item.chanNo,
                                    item.supportType,
                                    12,
                                    23
                                );
                                this.makeMoubleJson(
                                    905,
                                    item.chanNo,
                                    item.supportType,
                                    13,
                                    24
                                );
                                this.makeMoubleJson(
                                    905,
                                    item.chanNo,
                                    item.supportType,
                                    14,
                                    25
                                );
                                this.makeMoubleJson(
                                    905,
                                    item.chanNo,
                                    item.supportType,
                                    26,
                                    27
                                );
                                this.makeMoubleJson(
                                    905,
                                    item.chanNo,
                                    item.supportType,
                                    28,
                                    29
                                );
                            });
                            menuLists[2].children.push({
                                label: "DBA",
                                value: "PrivateDba",
                                formName: "PrivateDbaForm",
                                index: "2-2",
                            });
                        }
                        break;
                    case "intelliDrive_BSD":
                        if (
                            this.capability[key] &&
                            this.capability[key].length
                        ) {
                            this.capability[key].forEach((item) => {
                                this.$set(
                                    this.moubleJson,
                                    `920_${item.chanNo}`,
                                    false
                                );
                                this.makeMoubleJson(
                                    920,
                                    item.chanNo,
                                    item.supportType,
                                    0,
                                    2
                                );
                                this.makeMoubleJson(
                                    920,
                                    item.chanNo,
                                    item.supportType,
                                    1,
                                    3
                                );
                                this.makeMoubleJson(
                                    920,
                                    item.chanNo,
                                    item.supportType,
                                    4
                                );
                                this.makeMoubleJson(
                                    920,
                                    item.chanNo,
                                    item.supportType,
                                    5,
                                    6
                                );
                                this.makeMoubleJson(
                                    920,
                                    item.chanNo,
                                    item.supportType,
                                    7,
                                    8
                                );
                            });
                            menuLists[2].children.push({
                                label: "BSD",
                                value: "PrivateBsd",
                                formName: "PrivateBsdForm",
                                index: "2-3",
                            });
                            this.capability[key].forEach((item) => {
                                if (item.cameraPos && item.cameraPos.length) {
                                    const positionList = [];
                                    const positionJson = {};
                                    item.cameraPos.forEach((item_) => {
                                        switch (item_) {
                                            case 0:
                                                positionList.push({
                                                    id: item_,
                                                    label: "平视前置",
                                                });
                                                positionJson[item_] =
                                                    "平视前置";
                                                break;
                                            case 1:
                                                positionList.push({
                                                    id: item_,
                                                    label: "平视后置",
                                                });
                                                positionJson[item_] =
                                                    "平视后置";
                                                break;
                                            case 2:
                                                positionList.push({
                                                    id: item_,
                                                    label: "俯视前置",
                                                });
                                                positionJson[item_] =
                                                    "俯视前置";
                                                break;
                                            case 3:
                                                positionList.push({
                                                    id: item_,
                                                    label: "俯视后置",
                                                });
                                                positionJson[item_] =
                                                    "俯视后置";
                                                break;
                                        }
                                    });
                                    this.$set(
                                        this.enumerationData,
                                        "bsdcameraPosList" + item.chanNo,
                                        positionList
                                    );
                                    this.$set(
                                        this.enumerationData,
                                        "bsdcameraPosJson" + item.chanNo,
                                        positionJson
                                    );
                                }
                            });
                            for (
                                let i = 0;
                                i < this.capability[key].length;
                                i++
                            ) {
                                if (
                                    this.capability[key][i].info &&
                                    this.capability[key][i].info.length
                                ) {
                                    this.capability[key][i].info.forEach(
                                        (item) => {
                                            if (
                                                item.detect &&
                                                item.detect.length
                                            ) {
                                                item.detect.forEach((item_) => {
                                                    switch (item_) {
                                                        case 1:
                                                            this.enumerationData[
                                                                "bsdDetectList" +
                                                                    item.type
                                                            ].push({
                                                                id: item_,
                                                                label: "行人",
                                                            });
                                                            this.enumerationData[
                                                                "bsdDetectJson" +
                                                                    item.type
                                                            ][item_] = "行人";
                                                            break;
                                                        case 2:
                                                            this.enumerationData[
                                                                "bsdDetectList" +
                                                                    item.type
                                                            ].push({
                                                                id: item_,
                                                                label: "自行车",
                                                            });
                                                            this.enumerationData[
                                                                "bsdDetectJson" +
                                                                    item.type
                                                            ][item_] = "自行车";
                                                            break;
                                                        case 3:
                                                            this.enumerationData[
                                                                "bsdDetectList" +
                                                                    item.type
                                                            ].push({
                                                                id: item_,
                                                                label: "摩托车",
                                                            });
                                                            this.enumerationData[
                                                                "bsdDetectJson" +
                                                                    item.type
                                                            ][item_] = "摩托车";
                                                            break;
                                                        case 4:
                                                            this.enumerationData[
                                                                "bsdDetectList" +
                                                                    item.type
                                                            ].push({
                                                                id: item_,
                                                                label: "机动车",
                                                            });
                                                            this.enumerationData[
                                                                "bsdDetectJson" +
                                                                    item.type
                                                            ][item_] = "机动车";
                                                            break;
                                                        case 5:
                                                            this.enumerationData[
                                                                "bsdDetectList" +
                                                                    item.type
                                                            ].push({
                                                                id: item_,
                                                                label: "非机动车",
                                                            });
                                                            this.enumerationData[
                                                                "bsdDetectJson" +
                                                                    item.type
                                                            ][item_] =
                                                                "非机动车";
                                                            break;
                                                    }
                                                });
                                            }
                                        }
                                    );
                                }
                            }
                        }
                        break;
                    case "intelliDrive_WHD":
                        if (
                            this.capability[key] &&
                            this.capability[key].length
                        ) {
                            this.capability[key].forEach((item) => {
                                this.$set(
                                    this.moubleJson,
                                    `938_${item.chanNo}`,
                                    false
                                );
                                this.makeMoubleJson(
                                    938,
                                    item.chanNo,
                                    item.supportType,
                                    1,
                                    2
                                );
                                this.makeMoubleJson(
                                    938,
                                    item.chanNo,
                                    item.supportType,
                                    3,
                                    4
                                );
                                this.makeMoubleJson(
                                    938,
                                    item.chanNo,
                                    item.supportType,
                                    5,
                                    6
                                );
                            });
                            menuLists[2].children.push({
                                label: "WHD/玩手机",
                                value: "PrivateWhd",
                                formName: "PrivateWhdForm",
                                index: "2-4",
                            });
                        }
                        break;
                    case "compress":
                        if (
                            this.capability[key] &&
                            this.capability[key].length
                        ) {
                            this.$set(this.moubleJson, "188", false);
                            menuLists[3].children.push({
                                label: "视频设置",
                                value: "PrivateVideo",
                                formName: "PrivateVideoForm",
                                index: "4-1",
                            });
                            if (
                                this.capability[key][0].info &&
                                this.capability[key][0].info.length
                            ) {
                                this.capability[key][0].info.forEach((item) => {
                                    if (
                                        item.resolution &&
                                        item.resolution.length
                                    ) {
                                        item.resolution.forEach((item_) => {
                                            switch (item_) {
                                                case 0:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "4096*2160",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "4096*2160";
                                                    break;
                                                case 1:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "2560*1440",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "2560*1440";
                                                    break;
                                                case 2:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "1920*1280",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "1920*1280";
                                                    break;
                                                case 3:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "1920*1080",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "1920*1080";
                                                    break;
                                                case 4:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "1280*720",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "1280*720";
                                                    break;
                                                case 5:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "720*576",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "720*576";
                                                    break;
                                                case 6:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "640*480",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "640*480";
                                                    break;
                                                case 7:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "704*576",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "704*576";
                                                    break;
                                                case 8:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "960*576",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "960*576";
                                                    break;
                                                case 9:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "352*576",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "352*576";
                                                    break;
                                                case 10:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "352*288",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "352*288";
                                                    break;
                                                case 11:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "1280*960",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "1280*960";
                                                    break;
                                                case 12:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "2944*1656",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "2944*1656";
                                                    break;
                                                case 13:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "3072*2048",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "3072*2048";
                                                    break;
                                                case 14:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "3072*1728",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "3072*1728";
                                                    break;
                                                case 15:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "320*240",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "320*240";
                                                    break;
                                                case 16:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "640*360",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "640*360";
                                                    break;
                                                case 17:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "2560*1600",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "2560*1600";
                                                    break;
                                                case 18:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "2304*1296",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "2304*1296";
                                                    break;
                                                case 19:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "3840*2160",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "3840*2160";
                                                    break;
                                                case 20:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "720*480",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "720*480";
                                                    break;
                                                case 21:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "2880*1620",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "2880*1620";
                                                    break;
                                                case 22:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "1024*576",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "1024*576";
                                                    break;
                                                case 23:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "2304*1296",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "2304*1296";
                                                    break;
                                                case 24:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "1440*900",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "1440*900";
                                                    break;
                                                case 25:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "1920*1200",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "1920*1200";
                                                    break;
                                                case 26:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "1280*1280",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "1280*1280";
                                                    break;
                                                case 27:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "2048*2048",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "2048*2048";
                                                    break;
                                                case 28:
                                                    this.enumerationData[
                                                        "resList" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ].push({
                                                        id: item_,
                                                        label: "3072*2048",
                                                    });
                                                    this.enumerationData[
                                                        "resJson" +
                                                            item.chanNo +
                                                            "_" +
                                                            item.type
                                                    ][item_] = "3072*2048";
                                                    break;
                                            }
                                        });
                                    }
                                });
                            }
                        }
                        break;
                    case "intelliDrive_warn":
                        if (
                            this.capability[key] &&
                            this.capability[key].overSpeed
                        ) {
                            this.$set(this.moubleJson, "957", false);
                            menuLists[4].children.push({
                                label: "超速报警",
                                value: "PrivateOverSpeed",
                                formName: "PrivateOverSpeedForm",
                                index: "5-1",
                                // capability:this.capability[key]['vehicleDetail']
                            });
                        }
                        if (
                            this.capability[key] &&
                            this.capability[key].overtimeDriving
                        ) {
                            this.$set(this.moubleJson, "924", false);
                            menuLists[4].children.push({
                                label: "疲劳驾驶",
                                value: "PrivateOvertimeDriving",
                                formName: "PrivateOvertimeDrivingForm",
                                index: "5-2",
                                // capability:this.capability[key]['vehicleDetail']
                            });
                        }
                        break;
                    case "peripheral_warn_out":
                        if (
                            this.capability[key] &&
                            this.capability[key].alarmOutput
                        ) {
                            this.capability[key].alarmOutput.forEach((item) => {
                                item.typeList1 = [];
                                item.typeList2 = [];
                                if (item.deviceList && item.deviceList.length) {
                                    item.deviceList.forEach((k) => {
                                        if (k.type === 1) {
                                            item.typeList1.push(k);
                                        }
                                        if (k.type === 2) {
                                            item.typeList2.push(k);
                                        }
                                    });
                                }
                            });
                        }
                        break;
                    case "zhatu":
                        if (
                            this.capability[key] &&
                            this.capability[key].workMode
                        ) {
                            menuLists[7].children.push({
                                label: "工作模式",
                                value: "PrivateWorkMode",
                                formName: "PrivateWorkModeForm",
                                index: "8-1",
                            });
                            if (
                                this.capability[key].workMode &&
                                this.capability[key].workMode.length
                            ) {
                                this.capability[key].workMode.forEach(
                                    (item) => {
                                        switch (item) {
                                            case 0:
                                                this.enumerationData.workModeList.push(
                                                    {
                                                        id: item,
                                                        label: "正常模式",
                                                    }
                                                );
                                                this.enumerationData.workModeJson[
                                                    item
                                                ] = "正常模式";
                                                break;
                                            case 1:
                                                this.enumerationData.workModeList.push(
                                                    {
                                                        id: item,
                                                        label: "调试模式",
                                                    }
                                                );
                                                this.enumerationData.workModeJson[
                                                    item
                                                ] = "调试模式";
                                                break;
                                            case 2:
                                                this.enumerationData.workModeList.push(
                                                    {
                                                        id: item,
                                                        label: "演示模式",
                                                    }
                                                );
                                                this.enumerationData.workModeJson[
                                                    item
                                                ] = "演示模式";
                                                break;
                                            case 3:
                                                this.enumerationData.workModeList.push(
                                                    {
                                                        id: item,
                                                        label: "其他模式",
                                                    }
                                                );
                                                this.enumerationData.workModeJson[
                                                    item
                                                ] = "其他模式";
                                                break;
                                        }
                                    }
                                );
                            }
                        }
                        if (
                            this.capability[key] &&
                            this.capability[key].alarmInfo
                        ) {
                            menuLists[7].children.push({
                                label: "业务报警",
                                value: "PrivateInvalidAlarm",
                                formName: "PrivateInvalidAlarmForm",
                                index: "8-2",
                            });
                            if (
                                this.capability[key].alarmInfo &&
                                this.capability[key].alarmInfo.length
                            ) {
                                this.capability[key].alarmInfo.forEach(
                                    (item) => {
                                        switch (item.modelType) {
                                            case 0:
                                                let obj0 = {
                                                    modelType: item.modelType,
                                                    label: "平台下发控制指令",
                                                    enabledList: [],
                                                };
                                                if (
                                                    item.enabled &&
                                                    item.enabled.length
                                                ) {
                                                    item.enabled.forEach(
                                                        (k) => {
                                                            switch (k) {
                                                                case 0:
                                                                    obj0.enabledList.push(
                                                                        {
                                                                            id: 0,
                                                                            label: "锁车",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 1:
                                                                    obj0.enabledList.push(
                                                                        {
                                                                            id: 1,
                                                                            label: "限速",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 2:
                                                                    obj0.enabledList.push(
                                                                        {
                                                                            id: 2,
                                                                            label: "限举",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 3:
                                                                    obj0.enabledList.push(
                                                                        {
                                                                            id: 3,
                                                                            label: "模型",
                                                                        }
                                                                    );
                                                                    break;
                                                            }
                                                        }
                                                    );
                                                }
                                                this.enumerationData.alarmInfoList.push(
                                                    obj0
                                                );
                                                this.enumerationData.alarmInfoJson[
                                                    item.modelType
                                                ] = "平台下发控制指令";
                                                break;
                                            case 1:
                                                let obj1 = {
                                                    modelType: item.modelType,
                                                    label: "区域控制",
                                                    enabledList: [],
                                                };
                                                if (
                                                    item.enabled &&
                                                    item.enabled.length
                                                ) {
                                                    item.enabled.forEach(
                                                        (k) => {
                                                            switch (k) {
                                                                case 0:
                                                                    obj1.enabledList.push(
                                                                        {
                                                                            id: 0,
                                                                            label: "锁车",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 1:
                                                                    obj1.enabledList.push(
                                                                        {
                                                                            id: 1,
                                                                            label: "限速",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 2:
                                                                    obj1.enabledList.push(
                                                                        {
                                                                            id: 2,
                                                                            label: "限举",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 3:
                                                                    obj1.enabledList.push(
                                                                        {
                                                                            id: 3,
                                                                            label: "模型",
                                                                        }
                                                                    );
                                                                    break;
                                                            }
                                                        }
                                                    );
                                                }
                                                this.enumerationData.alarmInfoList.push(
                                                    obj1
                                                );
                                                this.enumerationData.alarmInfoJson[
                                                    item.modelType
                                                ] = "区域控制";
                                                break;
                                            case 2:
                                                let obj2 = {
                                                    modelType: item.modelType,
                                                    label: "超速限速",
                                                    enabledList: [],
                                                };
                                                if (
                                                    item.enabled &&
                                                    item.enabled.length
                                                ) {
                                                    item.enabled.forEach(
                                                        (k) => {
                                                            switch (k) {
                                                                case 0:
                                                                    obj2.enabledList.push(
                                                                        {
                                                                            id: 0,
                                                                            label: "锁车",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 1:
                                                                    obj2.enabledList.push(
                                                                        {
                                                                            id: 1,
                                                                            label: "限速",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 2:
                                                                    obj2.enabledList.push(
                                                                        {
                                                                            id: 2,
                                                                            label: "限举",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 3:
                                                                    obj2.enabledList.push(
                                                                        {
                                                                            id: 3,
                                                                            label: "模型",
                                                                        }
                                                                    );
                                                                    break;
                                                            }
                                                        }
                                                    );
                                                }
                                                this.enumerationData.alarmInfoList.push(
                                                    obj2
                                                );
                                                this.enumerationData.alarmInfoJson[
                                                    item.modelType
                                                ] = "超速限速";
                                                break;
                                            case 3:
                                                let obj3 = {
                                                    modelType: item.modelType,
                                                    label: "厢盖未密闭",
                                                    enabledList: [],
                                                };
                                                if (
                                                    item.enabled &&
                                                    item.enabled.length
                                                ) {
                                                    item.enabled.forEach(
                                                        (k) => {
                                                            switch (k) {
                                                                case 0:
                                                                    obj3.enabledList.push(
                                                                        {
                                                                            id: 0,
                                                                            label: "锁车",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 1:
                                                                    obj3.enabledList.push(
                                                                        {
                                                                            id: 1,
                                                                            label: "限速",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 2:
                                                                    obj3.enabledList.push(
                                                                        {
                                                                            id: 2,
                                                                            label: "限举",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 3:
                                                                    obj3.enabledList.push(
                                                                        {
                                                                            id: 3,
                                                                            label: "模型",
                                                                        }
                                                                    );
                                                                    break;
                                                            }
                                                        }
                                                    );
                                                }
                                                this.enumerationData.alarmInfoList.push(
                                                    obj3
                                                );
                                                this.enumerationData.alarmInfoJson[
                                                    item.modelType
                                                ] = "厢盖未密闭";
                                                break;
                                            case 4:
                                                let obj4 = {
                                                    modelType: item.modelType,
                                                    label: "越界",
                                                    enabledList: [],
                                                };
                                                if (
                                                    item.enabled &&
                                                    item.enabled.length
                                                ) {
                                                    item.enabled.forEach(
                                                        (k) => {
                                                            switch (k) {
                                                                case 0:
                                                                    obj4.enabledList.push(
                                                                        {
                                                                            id: 0,
                                                                            label: "锁车",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 1:
                                                                    obj4.enabledList.push(
                                                                        {
                                                                            id: 1,
                                                                            label: "限速",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 2:
                                                                    obj4.enabledList.push(
                                                                        {
                                                                            id: 2,
                                                                            label: "限举",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 3:
                                                                    obj4.enabledList.push(
                                                                        {
                                                                            id: 3,
                                                                            label: "模型",
                                                                        }
                                                                    );
                                                                    break;
                                                            }
                                                        }
                                                    );
                                                }
                                                this.enumerationData.alarmInfoList.push(
                                                    obj4
                                                );
                                                this.enumerationData.alarmInfoJson[
                                                    item.modelType
                                                ] = "越界";
                                                break;
                                            case 5:
                                                let obj5 = {
                                                    modelType: item.modelType,
                                                    label: "非指定区域",
                                                    enabledList: [],
                                                };
                                                if (
                                                    item.enabled &&
                                                    item.enabled.length
                                                ) {
                                                    item.enabled.forEach(
                                                        (k) => {
                                                            switch (k) {
                                                                case 0:
                                                                    obj5.enabledList.push(
                                                                        {
                                                                            id: 0,
                                                                            label: "锁车",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 1:
                                                                    obj5.enabledList.push(
                                                                        {
                                                                            id: 1,
                                                                            label: "限速",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 2:
                                                                    obj5.enabledList.push(
                                                                        {
                                                                            id: 2,
                                                                            label: "限举",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 3:
                                                                    obj5.enabledList.push(
                                                                        {
                                                                            id: 3,
                                                                            label: "模型",
                                                                        }
                                                                    );
                                                                    break;
                                                            }
                                                        }
                                                    );
                                                }
                                                this.enumerationData.alarmInfoList.push(
                                                    obj5
                                                );
                                                this.enumerationData.alarmInfoJson[
                                                    item.modelType
                                                ] = "非指定区域";
                                                break;
                                            case 6:
                                                let obj6 = {
                                                    modelType: item.modelType,
                                                    label: "外设故障",
                                                    enabledList: [],
                                                };
                                                if (
                                                    item.enabled &&
                                                    item.enabled.length
                                                ) {
                                                    item.enabled.forEach(
                                                        (k) => {
                                                            switch (k) {
                                                                case 0:
                                                                    obj6.enabledList.push(
                                                                        {
                                                                            id: 0,
                                                                            label: "锁车",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 1:
                                                                    obj6.enabledList.push(
                                                                        {
                                                                            id: 1,
                                                                            label: "限速",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 2:
                                                                    obj6.enabledList.push(
                                                                        {
                                                                            id: 2,
                                                                            label: "限举",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 3:
                                                                    obj6.enabledList.push(
                                                                        {
                                                                            id: 3,
                                                                            label: "模型",
                                                                        }
                                                                    );
                                                                    break;
                                                            }
                                                        }
                                                    );
                                                }
                                                this.enumerationData.alarmInfoList.push(
                                                    obj6
                                                );
                                                this.enumerationData.alarmInfoJson[
                                                    item.modelType
                                                ] = "外设故障";
                                                break;
                                            case 7:
                                                let obj7 = {
                                                    modelType: item.modelType,
                                                    label: "gps信号故障",
                                                    enabledList: [],
                                                };
                                                if (
                                                    item.enabled &&
                                                    item.enabled.length
                                                ) {
                                                    item.enabled.forEach(
                                                        (k) => {
                                                            switch (k) {
                                                                case 0:
                                                                    obj7.enabledList.push(
                                                                        {
                                                                            id: 0,
                                                                            label: "锁车",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 1:
                                                                    obj7.enabledList.push(
                                                                        {
                                                                            id: 1,
                                                                            label: "限速",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 2:
                                                                    obj7.enabledList.push(
                                                                        {
                                                                            id: 2,
                                                                            label: "限举",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 3:
                                                                    obj7.enabledList.push(
                                                                        {
                                                                            id: 3,
                                                                            label: "模型",
                                                                        }
                                                                    );
                                                                    break;
                                                            }
                                                        }
                                                    );
                                                }
                                                this.enumerationData.alarmInfoList.push(
                                                    obj7
                                                );
                                                this.enumerationData.alarmInfoJson[
                                                    item.modelType
                                                ] = "gps信号故障";
                                                break;
                                            case 8:
                                                let obj8 = {
                                                    modelType: item.modelType,
                                                    label: "证件无效",
                                                    enabledList: [],
                                                };
                                                if (
                                                    item.enabled &&
                                                    item.enabled.length
                                                ) {
                                                    item.enabled.forEach(
                                                        (k) => {
                                                            switch (k) {
                                                                case 0:
                                                                    obj8.enabledList.push(
                                                                        {
                                                                            id: 0,
                                                                            label: "锁车",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 1:
                                                                    obj8.enabledList.push(
                                                                        {
                                                                            id: 1,
                                                                            label: "限速",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 2:
                                                                    obj8.enabledList.push(
                                                                        {
                                                                            id: 2,
                                                                            label: "限举",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 3:
                                                                    obj8.enabledList.push(
                                                                        {
                                                                            id: 3,
                                                                            label: "模型",
                                                                        }
                                                                    );
                                                                    break;
                                                            }
                                                        }
                                                    );
                                                }
                                                this.enumerationData.alarmInfoList.push(
                                                    obj8
                                                );
                                                this.enumerationData.alarmInfoJson[
                                                    item.modelType
                                                ] = "证件无效";
                                                break;
                                            case 9:
                                                let obj9 = {
                                                    modelType: item.modelType,
                                                    label: "未联网",
                                                    enabledList: [],
                                                };
                                                if (
                                                    item.enabled &&
                                                    item.enabled.length
                                                ) {
                                                    item.enabled.forEach(
                                                        (k) => {
                                                            switch (k) {
                                                                case 0:
                                                                    obj9.enabledList.push(
                                                                        {
                                                                            id: 0,
                                                                            label: "锁车",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 1:
                                                                    obj9.enabledList.push(
                                                                        {
                                                                            id: 1,
                                                                            label: "限速",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 2:
                                                                    obj9.enabledList.push(
                                                                        {
                                                                            id: 2,
                                                                            label: "限举",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 3:
                                                                    obj9.enabledList.push(
                                                                        {
                                                                            id: 3,
                                                                            label: "模型",
                                                                        }
                                                                    );
                                                                    break;
                                                            }
                                                        }
                                                    );
                                                }
                                                this.enumerationData.alarmInfoList.push(
                                                    obj9
                                                );
                                                this.enumerationData.alarmInfoJson[
                                                    item.modelType
                                                ] = "未联网";
                                                break;
                                            case 10:
                                                let obj10 = {
                                                    modelType: item.modelType,
                                                    label: "人脸识别",
                                                    enabledList: [],
                                                };
                                                if (
                                                    item.enabled &&
                                                    item.enabled.length
                                                ) {
                                                    item.enabled.forEach(
                                                        (k) => {
                                                            switch (k) {
                                                                case 0:
                                                                    obj10.enabledList.push(
                                                                        {
                                                                            id: 0,
                                                                            label: "锁车",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 1:
                                                                    obj10.enabledList.push(
                                                                        {
                                                                            id: 1,
                                                                            label: "限速",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 2:
                                                                    obj10.enabledList.push(
                                                                        {
                                                                            id: 2,
                                                                            label: "限举",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 3:
                                                                    obj10.enabledList.push(
                                                                        {
                                                                            id: 3,
                                                                            label: "模型",
                                                                        }
                                                                    );
                                                                    break;
                                                            }
                                                        }
                                                    );
                                                }
                                                this.enumerationData.alarmInfoList.push(
                                                    obj10
                                                );
                                                this.enumerationData.alarmInfoJson[
                                                    item.modelType
                                                ] = "人脸识别";
                                                break;
                                            case 11:
                                                let obj11 = {
                                                    modelType: item.modelType,
                                                    label: "违规区域卸载",
                                                    enabledList: [],
                                                };
                                                if (
                                                    item.enabled &&
                                                    item.enabled.length
                                                ) {
                                                    item.enabled.forEach(
                                                        (k) => {
                                                            switch (k) {
                                                                case 0:
                                                                    obj11.enabledList.push(
                                                                        {
                                                                            id: 0,
                                                                            label: "锁车",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 1:
                                                                    obj11.enabledList.push(
                                                                        {
                                                                            id: 1,
                                                                            label: "限速",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 2:
                                                                    obj11.enabledList.push(
                                                                        {
                                                                            id: 2,
                                                                            label: "限举",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 3:
                                                                    obj11.enabledList.push(
                                                                        {
                                                                            id: 3,
                                                                            label: "模型",
                                                                        }
                                                                    );
                                                                    break;
                                                            }
                                                        }
                                                    );
                                                }
                                                this.enumerationData.alarmInfoList.push(
                                                    obj11
                                                );
                                                this.enumerationData.alarmInfoJson[
                                                    item.modelType
                                                ] = "违规区域卸载";
                                                break;
                                            case 12:
                                                let obj12 = {
                                                    modelType: item.modelType,
                                                    label: "闯禁",
                                                    enabledList: [],
                                                };
                                                if (
                                                    item.enabled &&
                                                    item.enabled.length
                                                ) {
                                                    item.enabled.forEach(
                                                        (k) => {
                                                            switch (k) {
                                                                case 0:
                                                                    obj12.enabledList.push(
                                                                        {
                                                                            id: 0,
                                                                            label: "锁车",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 1:
                                                                    obj12.enabledList.push(
                                                                        {
                                                                            id: 1,
                                                                            label: "限速",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 2:
                                                                    obj12.enabledList.push(
                                                                        {
                                                                            id: 2,
                                                                            label: "限举",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 3:
                                                                    obj12.enabledList.push(
                                                                        {
                                                                            id: 3,
                                                                            label: "模型",
                                                                        }
                                                                    );
                                                                    break;
                                                            }
                                                        }
                                                    );
                                                }
                                                this.enumerationData.alarmInfoList.push(
                                                    obj12
                                                );
                                                this.enumerationData.alarmInfoJson[
                                                    item.modelType
                                                ] = "闯禁";
                                                break;
                                            case 13:
                                                let obj13 = {
                                                    modelType: item.modelType,
                                                    label: "传感器状态",
                                                    enabledList: [],
                                                };
                                                if (
                                                    item.enabled &&
                                                    item.enabled.length
                                                ) {
                                                    item.enabled.forEach(
                                                        (k) => {
                                                            switch (k) {
                                                                case 0:
                                                                    obj13.enabledList.push(
                                                                        {
                                                                            id: 0,
                                                                            label: "锁车",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 1:
                                                                    obj13.enabledList.push(
                                                                        {
                                                                            id: 1,
                                                                            label: "限速",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 2:
                                                                    obj13.enabledList.push(
                                                                        {
                                                                            id: 2,
                                                                            label: "限举",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 3:
                                                                    obj13.enabledList.push(
                                                                        {
                                                                            id: 3,
                                                                            label: "模型",
                                                                        }
                                                                    );
                                                                    break;
                                                            }
                                                        }
                                                    );
                                                }
                                                this.enumerationData.alarmInfoList.push(
                                                    obj13
                                                );
                                                this.enumerationData.alarmInfoJson[
                                                    item.modelType
                                                ] = "传感器状态";
                                                break;
                                            case 14:
                                                let obj14 = {
                                                    modelType: item.modelType,
                                                    label: "超载",
                                                    enabledList: [],
                                                };
                                                if (
                                                    item.enabled &&
                                                    item.enabled.length
                                                ) {
                                                    item.enabled.forEach(
                                                        (k) => {
                                                            switch (k) {
                                                                case 0:
                                                                    obj14.enabledList.push(
                                                                        {
                                                                            id: 0,
                                                                            label: "锁车",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 1:
                                                                    obj14.enabledList.push(
                                                                        {
                                                                            id: 1,
                                                                            label: "限速",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 2:
                                                                    obj14.enabledList.push(
                                                                        {
                                                                            id: 2,
                                                                            label: "限举",
                                                                        }
                                                                    );
                                                                    break;
                                                                case 3:
                                                                    obj14.enabledList.push(
                                                                        {
                                                                            id: 3,
                                                                            label: "模型",
                                                                        }
                                                                    );
                                                                    break;
                                                            }
                                                        }
                                                    );
                                                }
                                                this.enumerationData.alarmInfoList.push(
                                                    obj14
                                                );
                                                this.enumerationData.alarmInfoJson[
                                                    item.modelType
                                                ] = "超载";
                                                break;
                                        }
                                    }
                                );
                            }
                        }
                        if (
                            this.capability[key] &&
                            this.capability[key].containerStatus
                        ) {
                            menuLists[7].children.push({
                                label: "货箱状态",
                                value: "PrivateTcss",
                                formName: "PrivateTcssForm",
                                index: "8-3",
                            });
                            if (
                                this.capability[key].containerStatus.tcssList &&
                                this.capability[key].containerStatus.tcssList
                                    .length
                            ) {
                                this.capability[
                                    key
                                ].containerStatus.tcssList.forEach((item) => {
                                    switch (item.tcssType) {
                                        case 1:
                                            let obj0 = {
                                                tcssType: item.tcssType,
                                                label: "举升",
                                                acquireTypeList: [],
                                                manualStatusList: [],
                                                curStatusList: [],
                                            };
                                            if (
                                                item.acquireType &&
                                                item.acquireType.length
                                            ) {
                                                item.acquireType.forEach(
                                                    (k) => {
                                                        switch (k) {
                                                            case 0:
                                                                obj0.acquireTypeList.push(
                                                                    {
                                                                        id: 0,
                                                                        label: "手动",
                                                                    }
                                                                );
                                                                break;
                                                            case 1:
                                                                obj0.acquireTypeList.push(
                                                                    {
                                                                        id: 1,
                                                                        label: "ADC传感器",
                                                                    }
                                                                );
                                                                break;
                                                            case 2:
                                                                obj0.acquireTypeList.push(
                                                                    {
                                                                        id: 2,
                                                                        label: "串口外设",
                                                                    }
                                                                );
                                                                break;
                                                            case 3:
                                                                obj0.acquireTypeList.push(
                                                                    {
                                                                        id: 3,
                                                                        label: "相机",
                                                                    }
                                                                );
                                                                break;
                                                            case 4:
                                                                obj0.acquireTypeList.push(
                                                                    {
                                                                        id: 4,
                                                                        label: "IPC",
                                                                    }
                                                                );
                                                                break;
                                                            case 5:
                                                                obj0.acquireTypeList.push(
                                                                    {
                                                                        id: 5,
                                                                        label: "测距模块",
                                                                    }
                                                                );
                                                                break;
                                                            case 6:
                                                                obj0.acquireTypeList.push(
                                                                    {
                                                                        id: 6,
                                                                        label: "CAN协议",
                                                                    }
                                                                );
                                                                break;
                                                            case 7:
                                                                obj0.acquireTypeList.push(
                                                                    {
                                                                        id: 7,
                                                                        label: "F3协议传感器",
                                                                    }
                                                                );
                                                                break;
                                                            case 8:
                                                                obj0.acquireTypeList.push(
                                                                    {
                                                                        id: 8,
                                                                        label: "zzh协议传感器",
                                                                    }
                                                                );
                                                                break;
                                                        }
                                                    }
                                                );
                                            }
                                            if (
                                                item.manualStatus &&
                                                item.manualStatus.length
                                            ) {
                                                item.manualStatus.forEach(
                                                    (k) => {
                                                        switch (k) {
                                                            case 0:
                                                                obj0.manualStatusList.push(
                                                                    {
                                                                        id: 0,
                                                                        label: "未举升",
                                                                    }
                                                                );
                                                                break;
                                                            case 1:
                                                                obj0.manualStatusList.push(
                                                                    {
                                                                        id: 1,
                                                                        label: "举升",
                                                                    }
                                                                );
                                                                break;
                                                            case 255:
                                                                obj0.manualStatusList.push(
                                                                    {
                                                                        id: 255,
                                                                        label: "异常",
                                                                    }
                                                                );
                                                                break;
                                                        }
                                                    }
                                                );
                                            }
                                            if (
                                                item.curStatus &&
                                                item.curStatus.length
                                            ) {
                                                item.curStatus.forEach((k) => {
                                                    switch (k) {
                                                        case 0:
                                                            obj0.curStatusList.push(
                                                                {
                                                                    id: 0,
                                                                    label: "未举升",
                                                                }
                                                            );
                                                            break;
                                                        case 1:
                                                            obj0.curStatusList.push(
                                                                {
                                                                    id: 1,
                                                                    label: "举升",
                                                                }
                                                            );
                                                            break;
                                                        case 255:
                                                            obj0.curStatusList.push(
                                                                {
                                                                    id: 255,
                                                                    label: "异常",
                                                                }
                                                            );
                                                            break;
                                                    }
                                                });
                                            }
                                            this.enumerationData.tcssList.push(
                                                obj0
                                            );
                                            this.enumerationData.tcssJson[
                                                item.tcssType
                                            ] = "举升";
                                            break;
                                        case 2:
                                            let obj1 = {
                                                tcssType: item.tcssType,
                                                label: "密闭",
                                                acquireTypeList: [],
                                                manualStatusList: [],
                                                curStatusList: [],
                                            };
                                            if (
                                                item.acquireType &&
                                                item.acquireType.length
                                            ) {
                                                item.acquireType.forEach(
                                                    (k) => {
                                                        switch (k) {
                                                            case 0:
                                                                obj1.acquireTypeList.push(
                                                                    {
                                                                        id: 0,
                                                                        label: "手动",
                                                                    }
                                                                );
                                                                break;
                                                            case 1:
                                                                obj1.acquireTypeList.push(
                                                                    {
                                                                        id: 1,
                                                                        label: "ADC传感器",
                                                                    }
                                                                );
                                                                break;
                                                            case 2:
                                                                obj1.acquireTypeList.push(
                                                                    {
                                                                        id: 2,
                                                                        label: "串口外设",
                                                                    }
                                                                );
                                                                break;
                                                            case 3:
                                                                obj1.acquireTypeList.push(
                                                                    {
                                                                        id: 3,
                                                                        label: "相机",
                                                                    }
                                                                );
                                                                break;
                                                            case 4:
                                                                obj1.acquireTypeList.push(
                                                                    {
                                                                        id: 4,
                                                                        label: "IPC",
                                                                    }
                                                                );
                                                                break;
                                                            case 5:
                                                                obj1.acquireTypeList.push(
                                                                    {
                                                                        id: 5,
                                                                        label: "测距模块",
                                                                    }
                                                                );
                                                                break;
                                                            case 6:
                                                                obj1.acquireTypeList.push(
                                                                    {
                                                                        id: 6,
                                                                        label: "CAN协议",
                                                                    }
                                                                );
                                                                break;
                                                            case 7:
                                                                obj1.acquireTypeList.push(
                                                                    {
                                                                        id: 7,
                                                                        label: "F3协议传感器",
                                                                    }
                                                                );
                                                                break;
                                                            case 8:
                                                                obj1.acquireTypeList.push(
                                                                    {
                                                                        id: 8,
                                                                        label: "zzh协议传感器",
                                                                    }
                                                                );
                                                                break;
                                                        }
                                                    }
                                                );
                                            }
                                            if (
                                                item.manualStatus &&
                                                item.manualStatus.length
                                            ) {
                                                item.manualStatus.forEach(
                                                    (k) => {
                                                        switch (k) {
                                                            case 0:
                                                                obj1.manualStatusList.push(
                                                                    {
                                                                        id: 0,
                                                                        label: "未密闭",
                                                                    }
                                                                );
                                                                break;
                                                            case 1:
                                                                obj1.manualStatusList.push(
                                                                    {
                                                                        id: 1,
                                                                        label: "密闭",
                                                                    }
                                                                );
                                                                break;
                                                            case 255:
                                                                obj1.manualStatusList.push(
                                                                    {
                                                                        id: 255,
                                                                        label: "异常",
                                                                    }
                                                                );
                                                                break;
                                                        }
                                                    }
                                                );
                                            }
                                            if (
                                                item.curStatus &&
                                                item.curStatus.length
                                            ) {
                                                item.curStatus.forEach((k) => {
                                                    switch (k) {
                                                        case 0:
                                                            obj1.curStatusList.push(
                                                                {
                                                                    id: 0,
                                                                    label: "未密闭",
                                                                }
                                                            );
                                                            break;
                                                        case 1:
                                                            obj1.curStatusList.push(
                                                                {
                                                                    id: 1,
                                                                    label: "密闭",
                                                                }
                                                            );
                                                            break;
                                                        case 255:
                                                            obj1.curStatusList.push(
                                                                {
                                                                    id: 255,
                                                                    label: "异常",
                                                                }
                                                            );
                                                            break;
                                                    }
                                                });
                                            }
                                            this.enumerationData.tcssList.push(
                                                obj1
                                            );
                                            this.enumerationData.tcssJson[
                                                item.tcssType
                                            ] = "密闭";
                                            break;
                                        case 3:
                                            let obj2 = {
                                                tcssType: item.tcssType,
                                                label: "载重",
                                                acquireTypeList: [],
                                                manualStatusList: [],
                                                curStatusList: [],
                                            };
                                            if (
                                                item.acquireType &&
                                                item.acquireType.length
                                            ) {
                                                item.acquireType.forEach(
                                                    (k) => {
                                                        switch (k) {
                                                            case 0:
                                                                obj2.acquireTypeList.push(
                                                                    {
                                                                        id: 0,
                                                                        label: "手动",
                                                                    }
                                                                );
                                                                break;
                                                            case 1:
                                                                obj2.acquireTypeList.push(
                                                                    {
                                                                        id: 1,
                                                                        label: "ADC传感器",
                                                                    }
                                                                );
                                                                break;
                                                            case 2:
                                                                obj2.acquireTypeList.push(
                                                                    {
                                                                        id: 2,
                                                                        label: "串口外设",
                                                                    }
                                                                );
                                                                break;
                                                            case 3:
                                                                obj2.acquireTypeList.push(
                                                                    {
                                                                        id: 3,
                                                                        label: "相机",
                                                                    }
                                                                );
                                                                break;
                                                            case 4:
                                                                obj2.acquireTypeList.push(
                                                                    {
                                                                        id: 4,
                                                                        label: "IPC",
                                                                    }
                                                                );
                                                                break;
                                                            case 5:
                                                                obj2.acquireTypeList.push(
                                                                    {
                                                                        id: 5,
                                                                        label: "测距模块",
                                                                    }
                                                                );
                                                                break;
                                                            case 6:
                                                                obj2.acquireTypeList.push(
                                                                    {
                                                                        id: 6,
                                                                        label: "CAN协议",
                                                                    }
                                                                );
                                                                break;
                                                            case 7:
                                                                obj2.acquireTypeList.push(
                                                                    {
                                                                        id: 7,
                                                                        label: "F3协议传感器",
                                                                    }
                                                                );
                                                                break;
                                                            case 8:
                                                                obj2.acquireTypeList.push(
                                                                    {
                                                                        id: 8,
                                                                        label: "zzh协议传感器",
                                                                    }
                                                                );
                                                                break;
                                                        }
                                                    }
                                                );
                                            }
                                            if (
                                                item.manualStatus &&
                                                item.manualStatus.length
                                            ) {
                                                item.manualStatus.forEach(
                                                    (k) => {
                                                        switch (k) {
                                                            case 0:
                                                                obj2.manualStatusList.push(
                                                                    {
                                                                        id: 0,
                                                                        label: "空载",
                                                                    }
                                                                );
                                                                break;
                                                            case 1:
                                                                obj2.manualStatusList.push(
                                                                    {
                                                                        id: 1,
                                                                        label: "满载",
                                                                    }
                                                                );
                                                                break;
                                                            case 2:
                                                                obj2.manualStatusList.push(
                                                                    {
                                                                        id: 2,
                                                                        label: "超载",
                                                                    }
                                                                );
                                                                break;
                                                            case 3:
                                                                obj2.manualStatusList.push(
                                                                    {
                                                                        id: 3,
                                                                        label: "轻载",
                                                                    }
                                                                );
                                                                break;
                                                            case 255:
                                                                obj2.manualStatusList.push(
                                                                    {
                                                                        id: 255,
                                                                        label: "异常",
                                                                    }
                                                                );
                                                                break;
                                                        }
                                                    }
                                                );
                                            }
                                            if (
                                                item.curStatus &&
                                                item.curStatus.length
                                            ) {
                                                item.curStatus.forEach((k) => {
                                                    switch (k) {
                                                        case 0:
                                                            obj2.curStatusList.push(
                                                                {
                                                                    id: 0,
                                                                    label: "空载",
                                                                }
                                                            );
                                                            break;
                                                        case 1:
                                                            obj2.curStatusList.push(
                                                                {
                                                                    id: 1,
                                                                    label: "满载",
                                                                }
                                                            );
                                                            break;
                                                        case 2:
                                                            obj2.curStatusList.push(
                                                                {
                                                                    id: 2,
                                                                    label: "超载",
                                                                }
                                                            );
                                                            break;
                                                        case 3:
                                                            obj2.curStatusList.push(
                                                                {
                                                                    id: 3,
                                                                    label: "轻载",
                                                                }
                                                            );
                                                            break;
                                                        case 255:
                                                            obj2.curStatusList.push(
                                                                {
                                                                    id: 255,
                                                                    label: "异常",
                                                                }
                                                            );
                                                            break;
                                                    }
                                                });
                                            }
                                            this.enumerationData.tcssList.push(
                                                obj2
                                            );
                                            this.enumerationData.tcssJson[
                                                item.tcssType
                                            ] = "载重";
                                            break;
                                    }
                                });
                            }
                            if (
                                this.capability[key].containerStatus
                                    .osdEnable &&
                                this.capability[key].containerStatus.osdEnable
                                    .length
                            ) {
                                // ].containerStatus.osdEnable[0].chanNo.forEach(
                                this.capability[
                                    key
                                ].containerStatus.osdEnable.forEach(
                                    (k, index) => {
                                        this.enumerationData.osdEnableList[
                                            index
                                        ] = [];
                                        k.chanNo.forEach((item) => {
                                            switch (item) {
                                                case 1:
                                                    this.enumerationData.osdEnableList[
                                                        index
                                                    ].push({
                                                        id: item,
                                                        label: "通道1",
                                                    });
                                                    this.enumerationData.osdEnableJson[
                                                        item
                                                    ] = "通道1";
                                                    break;
                                                case 2:
                                                    this.enumerationData.osdEnableList[
                                                        index
                                                    ].push({
                                                        id: item,
                                                        label: "通道2",
                                                    });
                                                    this.enumerationData.osdEnableJson[
                                                        item
                                                    ] = "通道2";
                                                    break;
                                                case 3:
                                                    this.enumerationData.osdEnableList[
                                                        index
                                                    ].push({
                                                        id: item,
                                                        label: "通道3",
                                                    });
                                                    this.enumerationData.osdEnableJson[
                                                        item
                                                    ] = "通道3";
                                                    break;
                                                case 4:
                                                    this.enumerationData.osdEnableList[
                                                        index
                                                    ].push({
                                                        id: item,
                                                        label: "通道4",
                                                    });
                                                    this.enumerationData.osdEnableJson[
                                                        item
                                                    ] = "通道4";
                                                    break;
                                                case 5:
                                                    this.enumerationData.osdEnableList[
                                                        index
                                                    ].push({
                                                        id: item,
                                                        label: "通道5",
                                                    });
                                                    this.enumerationData.osdEnableJson[
                                                        item
                                                    ] = "通道5";
                                                    break;
                                                case 6:
                                                    this.enumerationData.osdEnableList[
                                                        index
                                                    ].push({
                                                        id: item,
                                                        label: "通道6",
                                                    });
                                                    this.enumerationData.osdEnableJson[
                                                        item
                                                    ] = "通道6";
                                                    break;
                                                case 7:
                                                    this.enumerationData.osdEnableList[
                                                        index
                                                    ].push({
                                                        id: item,
                                                        label: "通道7",
                                                    });
                                                    this.enumerationData.osdEnableJson[
                                                        item
                                                    ] = "通道7";
                                                    break;
                                                case 8:
                                                    this.enumerationData.osdEnableList[
                                                        index
                                                    ].push({
                                                        id: item,
                                                        label: "通道8",
                                                    });
                                                    this.enumerationData.osdEnableJson[
                                                        item
                                                    ] = "通道8";
                                                    break;
                                                case 9:
                                                    this.enumerationData.osdEnableList[
                                                        index
                                                    ].push({
                                                        id: item,
                                                        label: "通道9",
                                                    });
                                                    this.enumerationData.osdEnableJson[
                                                        item
                                                    ] = "通道9";
                                                    break;
                                                case 10:
                                                    this.enumerationData.osdEnableList[
                                                        index
                                                    ].push({
                                                        id: item,
                                                        label: "通道10",
                                                    });
                                                    this.enumerationData.osdEnableJson[
                                                        item
                                                    ] = "通道10";
                                                    break;
                                                case 11:
                                                    this.enumerationData.osdEnableList[
                                                        index
                                                    ].push({
                                                        id: item,
                                                        label: "通道11",
                                                    });
                                                    this.enumerationData.osdEnableJson[
                                                        item
                                                    ] = "通道11";
                                                    break;
                                                case 12:
                                                    this.enumerationData.osdEnableList[
                                                        index
                                                    ].push({
                                                        id: item,
                                                        label: "通道12",
                                                    });
                                                    this.enumerationData.osdEnableJson[
                                                        item
                                                    ] = "通道12";
                                                    break;
                                                case 13:
                                                    this.enumerationData.osdEnableList[
                                                        index
                                                    ].push({
                                                        id: item,
                                                        label: "通道13",
                                                    });
                                                    this.enumerationData.osdEnableJson[
                                                        item
                                                    ] = "通道13";
                                                    break;
                                                case 14:
                                                    this.enumerationData.osdEnableList[
                                                        index
                                                    ].push({
                                                        id: item,
                                                        label: "通道14",
                                                    });
                                                    this.enumerationData.osdEnableJson[
                                                        item
                                                    ] = "通道14";
                                                    break;
                                                case 15:
                                                    this.enumerationData.osdEnableList[
                                                        index
                                                    ].push({
                                                        id: item,
                                                        label: "通道15",
                                                    });
                                                    this.enumerationData.osdEnableJson[
                                                        item
                                                    ] = "通道15";
                                                    break;
                                                case 16:
                                                    this.enumerationData.osdEnableList[
                                                        index
                                                    ].push({
                                                        id: item,
                                                        label: "通道16",
                                                    });
                                                    this.enumerationData.osdEnableJson[
                                                        item
                                                    ] = "通道16";
                                                    break;
                                            }
                                        });
                                    }
                                );
                            }
                        }
                        if (
                            this.capability[key] &&
                            this.capability[key].externalInfo
                        ) {
                            menuLists[7].children.push({
                                label: "外屏参数",
                                value: "PrivateLed",
                                formName: "PrivateLedForm",
                                index: "8-4",
                            });
                            if (
                                this.capability[key].externalInfo.acquireType &&
                                this.capability[key].externalInfo.acquireType
                                    .length
                            ) {
                                this.capability[
                                    key
                                ].externalInfo.acquireType.forEach((item) => {
                                    switch (item) {
                                        case 0:
                                            this.enumerationData.acquireTypeList.push(
                                                {
                                                    id: item,
                                                    label: "串口",
                                                }
                                            );
                                            this.enumerationData.acquireTypeJson[
                                                item
                                            ] = "串口";
                                            break;
                                        case 1:
                                            this.enumerationData.acquireTypeList.push(
                                                {
                                                    id: item,
                                                    label: "CAN",
                                                }
                                            );
                                            this.enumerationData.acquireTypeJson[
                                                item
                                            ] = "CAN";
                                            break;
                                    }
                                });
                            }
                            if (
                                this.capability[key].externalInfo.lightAdjust &&
                                this.capability[key].externalInfo.lightAdjust
                                    .length
                            ) {
                                this.capability[
                                    key
                                ].externalInfo.lightAdjust.forEach((item) => {
                                    switch (item) {
                                        case 0:
                                            this.enumerationData.lightAdjustList.push(
                                                {
                                                    id: item,
                                                    label: "固定模式",
                                                }
                                            );
                                            this.enumerationData.lightAdjustJson[
                                                item
                                            ] = "固定模式";
                                            break;
                                        case 1:
                                            this.enumerationData.lightAdjustList.push(
                                                {
                                                    id: item,
                                                    label: "昼夜模式",
                                                }
                                            );
                                            this.enumerationData.lightAdjustJson[
                                                item
                                            ] = "昼夜模式";
                                            break;
                                        case 2:
                                            this.enumerationData.lightAdjustList.push(
                                                {
                                                    id: item,
                                                    label: "灯光模式",
                                                }
                                            );
                                            this.enumerationData.lightAdjustJson[
                                                item
                                            ] = "灯光模式";
                                            break;
                                    }
                                });
                            }
                            if (
                                this.capability[key].externalInfo.showMask &&
                                this.capability[key].externalInfo.showMask
                                    .length
                            ) {
                                this.capability[
                                    key
                                ].externalInfo.showMask.forEach((item) => {
                                    switch (item) {
                                        case 0:
                                            this.enumerationData.showMaskList.push(
                                                {
                                                    id: item,
                                                    label: "实时速度",
                                                }
                                            );
                                            this.enumerationData.showMaskJson[
                                                item
                                            ] = "实时速度";
                                            break;
                                        case 1:
                                            this.enumerationData.showMaskList.push(
                                                {
                                                    id: item,
                                                    label: "区域限速",
                                                }
                                            );
                                            this.enumerationData.showMaskJson[
                                                item
                                            ] = "区域限速";
                                            break;
                                        case 2:
                                            this.enumerationData.showMaskList.push(
                                                {
                                                    id: item,
                                                    label: "您已超速",
                                                }
                                            );
                                            this.enumerationData.showMaskJson[
                                                item
                                            ] = "您已超速";
                                            break;
                                        case 3:
                                            this.enumerationData.showMaskList.push(
                                                {
                                                    id: item,
                                                    label: "顶盖未密闭",
                                                }
                                            );
                                            this.enumerationData.showMaskJson[
                                                item
                                            ] = "顶盖未密闭";
                                            break;
                                        case 4:
                                            this.enumerationData.showMaskList.push(
                                                {
                                                    id: item,
                                                    label: "车辆越界",
                                                }
                                            );
                                            this.enumerationData.showMaskJson[
                                                item
                                            ] = "车辆越界";
                                            break;
                                        case 5:
                                            this.enumerationData.showMaskList.push(
                                                {
                                                    id: item,
                                                    label: "车辆在非指定区域",
                                                }
                                            );
                                            this.enumerationData.showMaskJson[
                                                item
                                            ] = "车辆在非指定区域";
                                            break;
                                        case 6:
                                            this.enumerationData.showMaskList.push(
                                                {
                                                    id: item,
                                                    label: "外设异常",
                                                }
                                            );
                                            this.enumerationData.showMaskJson[
                                                item
                                            ] = "外设异常";
                                            break;
                                        case 7:
                                            this.enumerationData.showMaskList.push(
                                                {
                                                    id: item,
                                                    label: "定位传感器异常",
                                                }
                                            );
                                            this.enumerationData.showMaskJson[
                                                item
                                            ] = "定位传感器异常";
                                            break;
                                        case 8:
                                            this.enumerationData.showMaskList.push(
                                                {
                                                    id: item,
                                                    label: "证件无效",
                                                }
                                            );
                                            this.enumerationData.showMaskJson[
                                                item
                                            ] = "证件无效";
                                            break;
                                        case 9:
                                            this.enumerationData.showMaskList.push(
                                                {
                                                    id: item,
                                                    label: "未联网",
                                                }
                                            );
                                            this.enumerationData.showMaskJson[
                                                item
                                            ] = "未联网";
                                            break;
                                        case 10:
                                            this.enumerationData.showMaskList.push(
                                                {
                                                    id: item,
                                                    label: "驾驶员身份不符",
                                                }
                                            );
                                            this.enumerationData.showMaskJson[
                                                item
                                            ] = "驾驶员身份不符";
                                            break;
                                        case 11:
                                            this.enumerationData.showMaskList.push(
                                                {
                                                    id: item,
                                                    label: "违规区域卸载",
                                                }
                                            );
                                            this.enumerationData.showMaskJson[
                                                item
                                            ] = "违规区域卸载";
                                            break;
                                        case 12:
                                            this.enumerationData.showMaskList.push(
                                                {
                                                    id: item,
                                                    label: "车辆闯禁",
                                                }
                                            );
                                            this.enumerationData.showMaskJson[
                                                item
                                            ] = "车辆闯禁";
                                            break;
                                    }
                                });
                            }
                            if (
                                this.capability[key].externalInfo
                                    .advertShowCtrl &&
                                this.capability[key].externalInfo.advertShowCtrl
                                    .length
                            ) {
                                this.capability[
                                    key
                                ].externalInfo.advertShowCtrl.forEach(
                                    (item) => {
                                        switch (item) {
                                            case 0:
                                                this.enumerationData.advertShowCtrlList.push(
                                                    {
                                                        id: item,
                                                        label: "立即显示",
                                                    }
                                                );
                                                this.enumerationData.advertShowCtrlJson[
                                                    item
                                                ] = "立即显示";
                                                break;
                                            case 1:
                                                this.enumerationData.advertShowCtrlList.push(
                                                    {
                                                        id: item,
                                                        label: "存储信息",
                                                    }
                                                );
                                                this.enumerationData.advertShowCtrlJson[
                                                    item
                                                ] = "存储信息";
                                                break;
                                        }
                                    }
                                );
                            }
                        }
                        if (
                            this.capability[key] &&
                            this.capability[key].vehicleControl
                        ) {
                            menuLists[7].children.push({
                                label: "控车参数",
                                value: "PrivateVehicleCtrl",
                                formName: "PrivateVehicleCtrlForm",
                                index: "8-5",
                            });
                            if (
                                this.capability[key].vehicleControl &&
                                this.capability[key].vehicleControl
                                    .vehCtrlList &&
                                this.capability[key].vehicleControl.vehCtrlList
                                    .length
                            ) {
                                this.capability[
                                    key
                                ].vehicleControl.vehCtrlList.forEach((item) => {
                                    switch (item.ctrlType) {
                                        case 1:
                                            this.enumerationData.vehCtrlModesList.push(
                                                {
                                                    id: item.ctrlType,
                                                    label: "锁车指令",
                                                }
                                            );
                                            this.enumerationData.vehCtrlModesJson[
                                                item.ctrlType
                                            ] = "锁车指令";
                                            break;
                                        case 2:
                                            this.enumerationData.vehCtrlModesList.push(
                                                {
                                                    id: item.ctrlType,
                                                    label: "限速指令",
                                                }
                                            );
                                            this.enumerationData.vehCtrlModesJson[
                                                item.ctrlType
                                            ] = "限速指令";
                                            break;
                                        case 3:
                                            this.enumerationData.vehCtrlModesList.push(
                                                {
                                                    id: item.ctrlType,
                                                    label: "限举指令",
                                                }
                                            );
                                            this.enumerationData.vehCtrlModesJson[
                                                item.ctrlType
                                            ] = "限举指令";
                                            break;
                                    }
                                });
                            }
                        }
                        if (
                            this.capability[key] &&
                            this.capability[key].androidScreen
                        ) {
                            menuLists[7].children.push({
                                label: "安卓屏控制",
                                value: "PrivateAndroidScreen",
                                formName: "PrivateAndroidScreenForm",
                                index: "8-6",
                            });
                            if (
                                this.capability[key].androidScreen.screenType &&
                                this.capability[key].androidScreen.screenType
                                    .length
                            ) {
                                this.capability[
                                    key
                                ].androidScreen.screenType.forEach((item) => {
                                    switch (item) {
                                        case 0:
                                            this.enumerationData.screenTypeList.push(
                                                {
                                                    id: item,
                                                    label: "不使用安卓屏",
                                                }
                                            );
                                            this.enumerationData.screenTypeJson[
                                                item
                                            ] = "不使用安卓屏";
                                            break;
                                        case 1:
                                            this.enumerationData.screenTypeList.push(
                                                {
                                                    id: item,
                                                    label: "万航安卓屏",
                                                }
                                            );
                                            this.enumerationData.screenTypeJson[
                                                item
                                            ] = "万航安卓屏";
                                            break;
                                        case 2:
                                            this.enumerationData.screenTypeList.push(
                                                {
                                                    id: item,
                                                    label: "自研安卓屏",
                                                }
                                            );
                                            this.enumerationData.screenTypeJson[
                                                item
                                            ] = "自研安卓屏";
                                            break;
                                    }
                                });
                            }
                            if (
                                this.capability[key].androidScreen.certType &&
                                this.capability[key].androidScreen.certType
                                    .length
                            ) {
                                this.capability[
                                    key
                                ].androidScreen.certType.forEach((item) => {
                                    switch (item) {
                                        case 0:
                                            this.enumerationData.certTypeList.push(
                                                {
                                                    id: item,
                                                    label: "准运证",
                                                }
                                            );
                                            this.enumerationData.certTypeJson[
                                                item
                                            ] = "准运证";
                                            break;
                                        case 1:
                                            this.enumerationData.certTypeList.push(
                                                {
                                                    id: item,
                                                    label: "运输证",
                                                }
                                            );
                                            this.enumerationData.certTypeJson[
                                                item
                                            ] = "准运证";
                                            break;
                                        case 2:
                                            this.enumerationData.certTypeList.push(
                                                {
                                                    id: item,
                                                    label: "排放证",
                                                }
                                            );
                                            this.enumerationData.certTypeJson[
                                                item
                                            ] = "排放证";
                                            break;
                                        case 3:
                                            this.enumerationData.certTypeList.push(
                                                {
                                                    id: item,
                                                    label: "处置通行证",
                                                }
                                            );
                                            this.enumerationData.certTypeJson[
                                                item
                                            ] = "处置通行证";
                                            break;
                                        case 4:
                                            this.enumerationData.certTypeList.push(
                                                {
                                                    id: item,
                                                    label: "电子运单",
                                                }
                                            );
                                            this.enumerationData.certTypeJson[
                                                item
                                            ] = "电子运单";
                                            break;
                                    }
                                });
                            }
                            if (
                                this.capability[key].androidScreen
                                    .defaultCert &&
                                this.capability[key].androidScreen.defaultCert
                                    .length
                            ) {
                                this.capability[
                                    key
                                ].androidScreen.defaultCert.forEach((item) => {
                                    switch (item) {
                                        case 0:
                                            this.enumerationData.defaultCertList.push(
                                                {
                                                    id: item,
                                                    label: "准运证",
                                                }
                                            );
                                            this.enumerationData.defaultCertJson[
                                                item
                                            ] = "准运证";
                                            break;
                                        case 1:
                                            this.enumerationData.defaultCertList.push(
                                                {
                                                    id: item,
                                                    label: "运输证",
                                                }
                                            );
                                            this.enumerationData.defaultCertJson[
                                                item
                                            ] = "运输证";
                                            break;
                                        case 2:
                                            this.enumerationData.defaultCertList.push(
                                                {
                                                    id: item,
                                                    label: "排放证",
                                                }
                                            );
                                            this.enumerationData.defaultCertJson[
                                                item
                                            ] = "排放证";
                                            break;
                                        case 3:
                                            this.enumerationData.defaultCertList.push(
                                                {
                                                    id: item,
                                                    label: "处置通行证",
                                                }
                                            );
                                            this.enumerationData.defaultCertJson[
                                                item
                                            ] = "处置通行证";
                                            break;
                                        case 4:
                                            this.enumerationData.defaultCertList.push(
                                                {
                                                    id: item,
                                                    label: "电子运单",
                                                }
                                            );
                                            this.enumerationData.defaultCertJson[
                                                item
                                            ] = "电子运单";
                                            break;
                                    }
                                });
                            }
                            if (
                                this.capability[key].androidScreen
                                    .defaultShow &&
                                this.capability[key].androidScreen.defaultShow
                                    .length
                            ) {
                                this.capability[
                                    key
                                ].androidScreen.defaultShow.forEach((item) => {
                                    switch (item) {
                                        case 0:
                                            this.enumerationData.defaultShowList.push(
                                                {
                                                    id: item,
                                                    label: "主界面",
                                                }
                                            );
                                            this.enumerationData.defaultShowJson[
                                                item
                                            ] = "主界面";
                                            break;
                                        case 1:
                                            this.enumerationData.defaultShowList.push(
                                                {
                                                    id: item,
                                                    label: "车辆状态画面",
                                                }
                                            );
                                            this.enumerationData.defaultShowJson[
                                                item
                                            ] = "车辆状态画面";
                                            break;
                                        case 2:
                                            this.enumerationData.defaultShowList.push(
                                                {
                                                    id: item,
                                                    label: "实时视频画面",
                                                }
                                            );
                                            this.enumerationData.defaultShowJson[
                                                item
                                            ] = "实时视频画面";
                                            break;
                                        case 3:
                                            this.enumerationData.defaultShowList.push(
                                                {
                                                    id: item,
                                                    label: "证件界面",
                                                }
                                            );
                                            this.enumerationData.defaultShowJson[
                                                item
                                            ] = "证件界面";
                                            break;
                                        case 4:
                                            this.enumerationData.defaultShowList.push(
                                                {
                                                    id: item,
                                                    label: "地图界面",
                                                }
                                            );
                                            this.enumerationData.defaultShowJson[
                                                item
                                            ] = "地图界面";
                                            break;
                                        case 5:
                                            this.enumerationData.defaultShowList.push(
                                                {
                                                    id: item,
                                                    label: "导航界面",
                                                }
                                            );
                                            this.enumerationData.defaultShowJson[
                                                item
                                            ] = "导航界面";
                                            break;
                                        case 6:
                                            this.enumerationData.defaultShowList.push(
                                                {
                                                    id: item,
                                                    label: "设备界面",
                                                }
                                            );
                                            this.enumerationData.defaultShowJson[
                                                item
                                            ] = "设备界面";
                                            break;
                                        case 7:
                                            this.enumerationData.defaultShowList.push(
                                                {
                                                    id: item,
                                                    label: "消息界面",
                                                }
                                            );
                                            this.enumerationData.defaultShowJson[
                                                item
                                            ] = "消息界面";
                                            break;
                                        case 8:
                                            this.enumerationData.defaultShowList.push(
                                                {
                                                    id: item,
                                                    label: "设置界面",
                                                }
                                            );
                                            this.enumerationData.defaultShowJson[
                                                item
                                            ] = "设置界面";
                                            break;
                                    }
                                });
                            }
                            if (
                                this.capability[key].androidScreen.notifyCtrl &&
                                this.capability[key].androidScreen.notifyCtrl
                                    .length
                            ) {
                                this.capability[
                                    key
                                ].androidScreen.notifyCtrl.forEach((item) => {
                                    switch (item) {
                                        case 0:
                                            this.enumerationData.notifyCtrlList.push(
                                                {
                                                    id: item,
                                                    label: "任何消息都不发",
                                                }
                                            );
                                            this.enumerationData.notifyCtrlJson[
                                                item
                                            ] = "任何消息都不发";
                                            break;
                                        case 1:
                                            this.enumerationData.notifyCtrlList.push(
                                                {
                                                    id: item,
                                                    label: "仅发送消息",
                                                }
                                            );
                                            this.enumerationData.notifyCtrlJson[
                                                item
                                            ] = "仅发送消息";
                                            break;
                                        case 2:
                                            this.enumerationData.notifyCtrlList.push(
                                                {
                                                    id: item,
                                                    label: "发送消息和弹窗",
                                                }
                                            );
                                            this.enumerationData.notifyCtrlJson[
                                                item
                                            ] = "发送消息和弹窗";
                                            break;
                                        case 3:
                                            this.enumerationData.notifyCtrlList.push(
                                                {
                                                    id: item,
                                                    label: "发送消息和安卓屏语音",
                                                }
                                            );
                                            this.enumerationData.notifyCtrlJson[
                                                item
                                            ] = "发送消息和安卓屏语音";
                                            break;
                                        case 4:
                                            this.enumerationData.notifyCtrlList.push(
                                                {
                                                    id: item,
                                                    label: "发送消息和设备自身语音",
                                                }
                                            );
                                            this.enumerationData.notifyCtrlJson[
                                                item
                                            ] = "发送消息和设备自身语音";
                                            break;
                                        case 5:
                                            this.enumerationData.notifyCtrlList.push(
                                                {
                                                    id: item,
                                                    label: "发送消息, 弹窗, 安卓屏语音",
                                                }
                                            );
                                            this.enumerationData.notifyCtrlJson[
                                                item
                                            ] = "发送消息, 弹窗, 安卓屏语音";
                                            break;
                                    }
                                });
                            }
                        }
                        if (
                            this.capability[key] &&
                            (this.capability[key].gsensor ||
                                this.capability[key].gsensorTurn)
                        ) {
                            menuLists[7].children.push({
                                label: "路口报警",
                                value: "PrivateGsensor",
                                formName: "PrivateGsensorForm",
                                index: "8-7",
                            });
                            if (
                                this.capability[key].gsensorTurn &&
                                this.capability[key].gsensorTurn.length
                            ) {
                                this.capability[key].gsensorTurn.forEach(
                                    (item) => {
                                        switch (item.gsensorTurnType) {
                                            case 3:
                                                this.enumerationData.gsensorTurnList.push(
                                                    {
                                                        gsensorTurnType:
                                                            item.gsensorTurnType,
                                                        label: "左转弯超速",
                                                    }
                                                );
                                                this.enumerationData.gsensorTurnJson[
                                                    item.gsensorTurnType
                                                ] = "左转弯超速";
                                                break;
                                            case 4:
                                                this.enumerationData.gsensorTurnList.push(
                                                    {
                                                        gsensorTurnType:
                                                            item.gsensorTurnType,
                                                        label: "右转弯超速",
                                                    }
                                                );
                                                this.enumerationData.gsensorTurnJson[
                                                    item.gsensorTurnType
                                                ] = "右转弯超速";
                                                break;
                                            case 5:
                                                this.enumerationData.gsensorTurnList.push(
                                                    {
                                                        gsensorTurnType:
                                                            item.gsensorTurnType,
                                                        label: "左转弯未打转向灯",
                                                    }
                                                );
                                                this.enumerationData.gsensorTurnJson[
                                                    item.gsensorTurnType
                                                ] = "左转弯未打转向灯";
                                                break;
                                            case 6:
                                                this.enumerationData.gsensorTurnList.push(
                                                    {
                                                        gsensorTurnType:
                                                            item.gsensorTurnType,
                                                        label: "右转弯未打转向灯",
                                                    }
                                                );
                                                this.enumerationData.gsensorTurnJson[
                                                    item.gsensorTurnType
                                                ] = "右转弯未打转向灯";
                                                break;
                                            case 7:
                                                this.enumerationData.gsensorTurnList.push(
                                                    {
                                                        gsensorTurnType:
                                                            item.gsensorTurnType,
                                                        label: "右转弯未停车",
                                                    }
                                                );
                                                this.enumerationData.gsensorTurnJson[
                                                    item.gsensorTurnType
                                                ] = "右转弯未停车";
                                                break;
                                        }
                                    }
                                );
                            }
                        }
                        if (
                            this.capability[key] &&
                            this.capability[key].engineVehicleControl
                        ) {
                            menuLists[7].children.push({
                                label: "发动机控车",
                                value: "PrivateEcu",
                                formName: "PrivateEcuForm",
                                index: "8-8",
                            });
                            if (
                                this.capability[key].engineVehicleControl
                                    .ecuType &&
                                this.capability[key].engineVehicleControl
                                    .ecuType.length
                            ) {
                                this.capability[
                                    key
                                ].engineVehicleControl.ecuType.forEach(
                                    (item) => {
                                        switch (item) {
                                            case 0:
                                                this.enumerationData.ecuTypeList.push(
                                                    {
                                                        id: item,
                                                        label: "无控车",
                                                    }
                                                );
                                                this.enumerationData.ecuTypeJson[
                                                    item
                                                ] = "无控车";
                                                break;
                                            case 1:
                                                this.enumerationData.ecuTypeList.push(
                                                    {
                                                        id: item,
                                                        label: "方案1",
                                                    }
                                                );
                                                this.enumerationData.ecuTypeJson[
                                                    item
                                                ] = "方案1";
                                                break;
                                            case 2:
                                                this.enumerationData.ecuTypeList.push(
                                                    {
                                                        id: item,
                                                        label: "方案2",
                                                    }
                                                );
                                                this.enumerationData.ecuTypeJson[
                                                    item
                                                ] = "方案2";
                                                break;
                                            case 3:
                                                this.enumerationData.ecuTypeList.push(
                                                    {
                                                        id: item,
                                                        label: "方案3",
                                                    }
                                                );
                                                this.enumerationData.ecuTypeJson[
                                                    item
                                                ] = "方案3";
                                                break;
                                            case 4:
                                                this.enumerationData.ecuTypeList.push(
                                                    {
                                                        id: item,
                                                        label: "方案4",
                                                    }
                                                );
                                                this.enumerationData.ecuTypeJson[
                                                    item
                                                ] = "方案4";
                                                break;
                                            case 5:
                                                this.enumerationData.ecuTypeList.push(
                                                    {
                                                        id: item,
                                                        label: "方案5",
                                                    }
                                                );
                                                this.enumerationData.ecuTypeJson[
                                                    item
                                                ] = "方案5";
                                                break;
                                            case 6:
                                                this.enumerationData.ecuTypeList.push(
                                                    {
                                                        id: item,
                                                        label: "方案6",
                                                    }
                                                );
                                                this.enumerationData.ecuTypeJson[
                                                    item
                                                ] = "方案6";
                                                break;
                                        }
                                    }
                                );
                            }
                        }
                        break;
                }
            }
            this.menuList = menuLists.filter(
                (item) => item.children.length > 0
            );
            this.templateData.menuList = this.menuList;
            this.originalInitMoubleJson = JSON.parse(
                JSON.stringify(this.moubleJson)
            );
            this.$nextTick(() => {
                this.componentName = this.menuList[0].children[0].value + "";
                this.menuActiveRefFormName =
                    this.menuList[0].children[0].formName;
                this.configParams = true;
            });
        },
        // 接收子组件的form表单ref属性
        getMenuActiveRefFormName(val) {
            this.menuActiveRefFormName = val;
        },
        // 接收子组件的统计变更数据
        changeFormData(val) {
            this.dataList = [];
            this.statisticsData = val; // 记录当前已经修改的所有项，然后传给子组件，子组件的修改项在这基础上加
            // console.log("this.statisticsData===", this.statisticsData);
            for (const x in val) {
                if (val[x]) {
                    this.dataList.push(val[x].split("&")); // 结构为字段名 + 修改前的记录 + 修改后的记录
                }
            }
        },
        // 接收子组织的表单变化
        changeForm(val) {
            this.initData = val;
        },
        // 接收子组件的原始表单信息
        changeCopyForm(val) {
            this.originalInitData = val;
        },
        // 接收子组件获取协议是否结束
        changeConfigParam(val) {
            this.configParams = val;
        },
        // 切换菜单栏
        changeLabel(index) {
            if (this.menuActiveRefFormName.includes("PrivateGsensorTurnForm")) {
                this.$refs.component.$refs[
                    this.menuActiveRefFormName
                ][0].validate((valid, invalidFields) => {
                    if (!valid) {
                        this.$message.info("当前不符合规则的配置项已恢复原值");
                        for (const key in invalidFields) {
                            switch (key.split(".").length) {
                                case 2:
                                    this.initData[key.split(".")[0]][
                                        key.split(".")[1]
                                    ] = JSON.parse(
                                        JSON.stringify(
                                            this.originalInitData[
                                                key.split(".")[0]
                                            ][key.split(".")[1]]
                                        )
                                    );
                                    break;
                                case 3:
                                    this.initData[key.split(".")[0]][
                                        key.split(".")[1]
                                    ][key.split(".")[2]] = JSON.parse(
                                        JSON.stringify(
                                            this.originalInitData[
                                                key.split(".")[0]
                                            ][key.split(".")[1]][
                                                key.split(".")[2]
                                            ]
                                        )
                                    );
                                    break;
                                case 4:
                                    this.initData[key.split(".")[0]][
                                        key.split(".")[1]
                                    ][key.split(".")[2]][key.split(".")[3]] =
                                        JSON.parse(
                                            JSON.stringify(
                                                this.originalInitData[
                                                    key.split(".")[0]
                                                ][key.split(".")[1]][
                                                    key.split(".")[2]
                                                ][key.split(".")[3]]
                                            )
                                        );
                                    break;
                                case 5:
                                    this.initData[key.split(".")[0]][
                                        key.split(".")[1]
                                    ][key.split(".")[2]][key.split(".")[3]][
                                        key.split(".")[4]
                                    ] = JSON.parse(
                                        JSON.stringify(
                                            this.originalInitData[
                                                key.split(".")[0]
                                            ][key.split(".")[1]][
                                                key.split(".")[2]
                                            ][key.split(".")[3]][
                                                key.split(".")[4]
                                            ]
                                        )
                                    );
                                    break;
                            }
                        }
                    }
                    const this_ = this;
                    setTimeout(() => {
                        this_.componentName = index.value;
                        this_.configParams = true;
                    }, 1);
                });
            } else {
                this.$refs.component.$refs[this.menuActiveRefFormName].validate(
                    (valid, invalidFields) => {
                        if (!valid) {
                            this.$message.info(
                                "当前不符合规则的配置项已恢复原值"
                            );
                            for (const key in invalidFields) {
                                switch (key.split(".").length) {
                                    case 2:
                                        this.initData[key.split(".")[0]][
                                            key.split(".")[1]
                                        ] = JSON.parse(
                                            JSON.stringify(
                                                this.originalInitData[
                                                    key.split(".")[0]
                                                ][key.split(".")[1]]
                                            )
                                        );
                                        break;
                                    case 3:
                                        this.initData[key.split(".")[0]][
                                            key.split(".")[1]
                                        ][key.split(".")[2]] = JSON.parse(
                                            JSON.stringify(
                                                this.originalInitData[
                                                    key.split(".")[0]
                                                ][key.split(".")[1]][
                                                    key.split(".")[2]
                                                ]
                                            )
                                        );
                                        break;
                                    case 4:
                                        this.initData[key.split(".")[0]][
                                            key.split(".")[1]
                                        ][key.split(".")[2]][
                                            key.split(".")[3]
                                        ] = JSON.parse(
                                            JSON.stringify(
                                                this.originalInitData[
                                                    key.split(".")[0]
                                                ][key.split(".")[1]][
                                                    key.split(".")[2]
                                                ][key.split(".")[3]]
                                            )
                                        );
                                        break;
                                    case 5:
                                        this.initData[key.split(".")[0]][
                                            key.split(".")[1]
                                        ][key.split(".")[2]][key.split(".")[3]][
                                            key.split(".")[4]
                                        ] = JSON.parse(
                                            JSON.stringify(
                                                this.originalInitData[
                                                    key.split(".")[0]
                                                ][key.split(".")[1]][
                                                    key.split(".")[2]
                                                ][key.split(".")[3]][
                                                    key.split(".")[4]
                                                ]
                                            )
                                        );
                                        break;
                                }
                            }
                        }
                        const this_ = this;
                        setTimeout(() => {
                            this_.componentName = index.value;
                            this_.configParams = true;
                        }, 1);
                    }
                );
            }
        },
        // 刷新Session
        refreshSession() {
            const _this = this;
            this.refreshSessionHandle = setInterval(() => {
                _this.$api.refreshSession().then((res) => {});
            }, 1000 * 60);
        },
        // 恢复配置项原值
        deleteItem(item, index) {
            const keys = item[0].split(".");
            this.dataList.splice(index, 1);
            this.statisticsData[keys.join(".")] = ""; // ？
            switch (keys.length) {
                case 2:
                    this.initData[keys[0]][keys[1]] = JSON.parse(
                        JSON.stringify(this.originalInitData[keys[0]][keys[1]])
                    );

                    if (keys[0].includes("param950")) {
                        this.initData[keys[0]].splitType = JSON.parse(
                            JSON.stringify(
                                this.originalInitData[keys[0]].splitType
                            )
                        );
                    }
                    break;
                case 3:
                    this.initData[keys[0]][keys[1]][keys[2]] = JSON.parse(
                        JSON.stringify(
                            this.originalInitData[keys[0]][keys[1]][keys[2]]
                        )
                    );
                    break;
                case 4:
                    if (keys[0] === "param1303" || keys[0] === "param1305") {
                        this.initData[keys[0]][keys[1]][keys[2]][keys[3]] =
                            JSON.parse(
                                JSON.stringify(
                                    this.originalInitData[keys[0]][keys[1]][
                                        keys[2]
                                    ][keys[3]]
                                )
                            );
                    } else {
                        this.initData[
                            keys[0].substring(0, keys[0].indexOf("_"))
                        ][keys[1]][keys[0]][keys[2]] = JSON.parse(
                            JSON.stringify(
                                this.originalInitData[
                                    keys[0].substring(0, keys[0].indexOf("_"))
                                ][keys[1]][keys[0]][keys[2]]
                            )
                        );
                    }
                    break;
                case 5:
                    if (keys[0] === "param1315") {
                        this.initData[keys[0]][keys[1]][keys[2]][keys[3]][
                            keys[4]
                        ] = JSON.parse(
                            JSON.stringify(
                                this.originalInitData[keys[0]][keys[1]][
                                    keys[2]
                                ][keys[3]][keys[4]]
                            )
                        );
                    } else {
                        this.initData[
                            keys[0].substring(0, keys[0].indexOf("_"))
                        ][keys[1]][keys[0]].info[0][keys[2]] = JSON.parse(
                            JSON.stringify(
                                this.originalInitData[
                                    keys[0].substring(0, keys[0].indexOf("_"))
                                ][keys[1]][keys[0]].info[0][keys[2]]
                            )
                        );
                    }
                    break;
                case 6:
                    this.initData[keys[0].substring(0, keys[0].indexOf("_"))][
                        keys[1]
                    ][keys[0]].info[0][keys[2]][keys[3]] = JSON.parse(
                        JSON.stringify(
                            this.originalInitData[
                                keys[0].substring(0, keys[0].indexOf("_"))
                            ][keys[1]][keys[0]].info[0][keys[2]][keys[3]]
                        )
                    );
                    break;
                case 7:
                    if (keys[0] === "param1315") {
                        this.initData[keys[0]][keys[1]][keys[2]][keys[3]][
                            keys[4]
                        ][keys[5]][keys[6]] = JSON.parse(
                            JSON.stringify(
                                this.originalInitData[keys[0]][keys[1]][
                                    keys[2]
                                ][keys[3]][keys[4]][keys[5]][keys[6]]
                            )
                        );
                    } else {
                        this.initData[keys[0]][keys[1]][keys[2]][keys[3]] =
                            JSON.parse(
                                JSON.stringify(
                                    this.originalInitData[keys[0]][keys[1]][
                                        keys[2]
                                    ][keys[3]]
                                )
                            );
                    }
                    break;
                case 8:
                    this.initData[keys[0].substring(0, keys[0].indexOf("_"))][
                        keys[1]
                    ][keys[0]][keys[2]][keys[3]][keys[4]] = JSON.parse(
                        JSON.stringify(
                            this.originalInitData[
                                keys[0].substring(0, keys[0].indexOf("_"))
                            ][keys[1]][keys[0]][keys[2]][keys[3]][keys[4]]
                        )
                    );
                    break;
                case 9:
                    this.initData[keys[0].substring(0, keys[0].indexOf("_"))][
                        keys[1]
                    ][keys[0]][keys[2]][keys[3]][keys[4]][keys[5]] = JSON.parse(
                        JSON.stringify(
                            this.originalInitData[
                                keys[0].substring(0, keys[0].indexOf("_"))
                            ][keys[1]][keys[0]][keys[2]][keys[3]][keys[4]][
                                keys[5]
                            ]
                        )
                    );
                    break;
            }
        },
        // 模板数据构成
        changeTemplate(item) {
            if (this.moubleJson[item]) {
                if (item == "192_shutdownDelay") {
                    if (!this.initData.param192) {
                        this.paramBol1 = true;
                        const params = {
                            deviceId: this.deviceId,
                            param: "",
                            msgId: 192,
                        };
                        this.$api.getEHomeConfig(params).then((res) => {
                            if (res && res.data && res.data.param) {
                                const formData = JSON.parse(res.data.param);
                                this.templateData.ehomeParams.push({
                                    markKey: "192_shutdownDelay",
                                    msgId: 193,
                                    params: formData,
                                });
                            } else {
                                this.$message.error("协议获取失败请，重新勾选");
                                this.moubleJson[item] = false;
                            }
                            this.paramBol1 = false;
                        });
                    } else {
                        this.templateData.ehomeParams.push({
                            markKey: "192_shutdownDelay",
                            params: this.initData.param192,
                            msgId: 193,
                        });
                    }
                } else if (item == "2205_audioOutput") {
                    if (!this.initData.param2205_audioOutput) {
                        this.paramBol2 = true;
                        const params = {
                            deviceId: this.deviceId,
                            param: {
                                chanNo: 1,
                                type: "audioOutput",
                            },
                            msgId: 2205,
                        };
                        this.$api.getEHomeConfig(params).then((res) => {
                            if (res && res.data && res.data.param) {
                                const formData = JSON.parse(res.data.param);
                                this.templateData.ehomeParams.push({
                                    markKey: "2205_audioOutput",
                                    msgId: 2206,
                                    params: formData,
                                });
                            } else {
                                this.$message.error("协议获取失败请，重新勾选");
                                this.moubleJson[item] = false;
                            }
                            this.paramBol2 = false;
                        });
                    } else {
                        this.templateData.ehomeParams.push({
                            markKey: "2205_audioOutput",
                            msgId: 2206,
                            params: this.initData.param2205_audioOutput,
                        });
                    }
                } else if (item == "2205_voiceCallOutput") {
                    if (!this.initData.param2205_voiceCallOutput) {
                        this.paramBol3 = true;
                        const params = {
                            deviceId: this.deviceId,
                            param: {
                                chanNo: 1,
                                type: "voiceCallOutput",
                            },
                            msgId: 2205,
                        };
                        this.$api.getEHomeConfig(params).then((res) => {
                            if (res && res.data && res.data.param) {
                                const formData = JSON.parse(res.data.param);
                                this.templateData.ehomeParams.push({
                                    markKey: "2205_voiceCallOutput",
                                    params: formData,
                                    msgId: 2206,
                                });
                            } else {
                                this.$message.error("协议获取失败请，重新勾选");
                                this.moubleJson[item] = false;
                            }
                            this.paramBol3 = false;
                            this.paramBol4 = true;
                            const paramsVolume = {
                                deviceId: this.deviceId,
                                param: {
                                    chanNo: 1,
                                    type: "volume",
                                },
                                msgId: 2205,
                            };
                            this.$api
                                .getEHomeConfig(paramsVolume)
                                .then((res) => {
                                    if (res && res.data && res.data.param) {
                                        const resJosn = {};
                                        for (const key in JSON.parse(
                                            res.data.param
                                        )) {
                                            if (key == "value") {
                                                resJosn[key] = Number(
                                                    JSON.parse(res.data.param)[
                                                        key
                                                    ]
                                                );
                                            } else {
                                                resJosn[key] = JSON.parse(
                                                    res.data.param
                                                )[key];
                                            }
                                        }
                                        const formDataVolume = resJosn;
                                        this.templateData.ehomeParams.push({
                                            markKey: "2205_volume",
                                            params: formDataVolume,
                                            msgId: 2206,
                                        });
                                    } else {
                                        this.$message.error(
                                            "协议获取失败请，重新勾选"
                                        );
                                        this.moubleJson[item] = false;
                                    }
                                    this.paramBol4 = false;
                                });
                        });
                    } else {
                        this.templateData.ehomeParams.push({
                            markKey: "2205_voiceCallOutput",
                            params: this.initData.param2205_voiceCallOutput,
                            msgId: 2206,
                        });
                        this.templateData.ehomeParams.push({
                            markKey: "2205_volume",
                            params: this.initData.param2205_volume,
                            msgId: 2206,
                        });
                    }
                    // if(!this.initData['param2205_volume']){

                    // }else{

                    // }
                } else if (item == "705") {
                    const itemArr = [
                        "705_0",
                        "705_1",
                        "705_2",
                        "705_3",
                        "705_4",
                        "705_5",
                    ];
                    this.paramBol5 = true;
                    for (let i = 0; i < 6; i++) {
                        if (!this.initData[`param${itemArr[i]}`]) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    platformOrder: i,
                                },
                                msgId: 705,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    this.templateData.ehomeParams.push({
                                        markKey: "705",
                                        params: formData,
                                        msgId: 706,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                                this.paramBol5 = false;
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: "705",
                                params: this.initData[`param${itemArr[i]}`],
                                msgId: 706,
                            });
                            this.paramBol5 = false;
                        }
                    }
                } else if (item == "188") {
                    const videoArr = [];
                    if (
                        this.capability.compress &&
                        this.capability.compress.length &&
                        this.capability.compress[0].info &&
                        this.capability.compress[0].info.length
                    ) {
                        this.capability.compress[0].info.forEach((item_) => {
                            videoArr.push(
                                `param188_${item_.chanNo}_${item_.type}`
                            );
                        });
                    }
                    this.paramBol6 = true;
                    for (let i = 0; i < videoArr.length; i++) {
                        if (!this.initData[videoArr[i]]) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    chanNo: Number(videoArr[i].split("_")[1]),
                                    streamType: Number(
                                        videoArr[i].split("_")[2]
                                    ),
                                },
                                msgId: 188,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        videoArr[i].split("_")[1]
                                    );
                                    formData.streamType = Number(
                                        videoArr[i].split("_")[2]
                                    );
                                    this.templateData.ehomeParams.push({
                                        msgId: 189,
                                        markKey: "188",
                                        params: formData,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                                this.paramBol6 = false;
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: "188",
                                msgId: 189,
                                params: this.initData[videoArr[i]],
                            });
                            this.paramBol6 = false;
                        }
                    }
                } else if (item == "948") {
                    const ioArr = [];
                    if (
                        this.capability.intelliDrive_sensor &&
                        this.capability.intelliDrive_sensor.IOOutput &&
                        this.capability.intelliDrive_sensor.IOOutput.length
                    ) {
                        this.capability.intelliDrive_sensor.IOOutput.forEach(
                            (item_) => {
                                ioArr.push(`param948_${item_.index}`);
                            }
                        );
                    }
                    this.paramBol7 = true;
                    for (let i = 0; i < ioArr.length; i++) {
                        if (!this.initData[ioArr[i]]) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    chanNo: Number(ioArr[i].split("_")[1]),
                                    type: 1,
                                },
                                msgId: 948,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        ioArr[i].split("_")[1]
                                    );
                                    for (const key in formData) {
                                        if (key !== "chanNo") {
                                            formData.list.forEach((item_) => {
                                                for (const key_ in item_) {
                                                    formData[key_] =
                                                        item_[key_];
                                                }
                                            });
                                        }
                                    }
                                    this.templateData.ehomeParams.push({
                                        msgId: 949,
                                        markKey: "948",
                                        params: formData,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                                this.paramBol7 = false;
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: "948",
                                msgId: 949,
                                params: this.initData[ioArr[i]],
                            });
                            this.paramBol7 = false;
                        }
                    }
                } else if (item == "950") {
                    const eveArr = [];
                    if (
                        this.capability.intelliDrive_sensor &&
                        this.capability.intelliDrive_sensor.eventDisplay &&
                        this.capability.intelliDrive_sensor.eventDisplay.length
                    ) {
                        this.capability.intelliDrive_sensor.eventDisplay.forEach(
                            (item_) => {
                                eveArr.push(`param950_${item_.type}`);
                            }
                        );
                    }
                    this.paramBol8 = true;
                    for (let i = 0; i < eveArr.length; i++) {
                        if (!this.initData[eveArr[i]]) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    chanNo: 1,
                                    type: Number(eveArr[i].split("_")[1]),
                                },
                                msgId: 950,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = 1;
                                    this.templateData.ehomeParams.push({
                                        msgId: 951,
                                        markKey: "950",
                                        params: formData,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                                this.paramBol8 = false;
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                msgId: 951,
                                markKey: "950",
                                params: this.initData[eveArr[i]],
                            });
                            this.paramBol8 = false;
                        }
                    }
                } else if (item.includes("957")) {
                    if (!this.initData.param957) {
                        this.paramBol9 = true;
                        const params = {
                            deviceId: this.deviceId,
                            param: "",
                            msgId: 957,
                        };
                        this.$api.getEHomeConfig(params).then((res) => {
                            if (res && res.data && res.data.param) {
                                const formData = JSON.parse(res.data.param);
                                this.templateData.ehomeParams.push({
                                    msgId: 958,
                                    markKey: "957",
                                    params: formData,
                                });
                            } else {
                                this.$message.error("协议获取失败请，重新勾选");
                                this.moubleJson[item] = false;
                            }
                            this.paramBol9 = false;
                        });
                    } else {
                        this.templateData.ehomeParams.push({
                            markKey: "957",
                            msgId: 958,
                            params: this.initData.param957,
                        });
                    }
                } else if (item.includes("924")) {
                    if (!this.initData.param924) {
                        this.paramBol10 = true;
                        const params = {
                            deviceId: this.deviceId,
                            param: "",
                            msgId: 924,
                        };
                        this.$api.getEHomeConfig(params).then((res) => {
                            if (res && res.data && res.data.param) {
                                const formData = JSON.parse(res.data.param);
                                this.templateData.ehomeParams.push({
                                    markKey: "924",
                                    msgId: 925,
                                    params: formData,
                                });
                            } else {
                                this.$message.error("协议获取失败请，重新勾选");
                                this.moubleJson[item] = false;
                            }
                            this.paramBol10 = false;
                        });
                    } else {
                        this.templateData.ehomeParams.push({
                            markKey: "924",
                            msgId: 925,
                            params: this.initData.param924,
                        });
                    }
                } else if (item.includes("901")) {
                    if (item.split("_").length == 2) {
                        this.paramBol11 = true;
                        if (
                            !this.initData.param901 ||
                            !this.initData.param901[item.split("_")[1]] ||
                            !this.initData.param901[item.split("_")[1]] ||
                            !this.initData.param901[item.split("_")[1]]
                                .param901_
                        ) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    type: 0,
                                    chanNo: item.split("_")[1],
                                },
                                msgId: 901,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        item.split("_")[1]
                                    );
                                    this.templateData.ehomeParams.push({
                                        markKey: item,
                                        params: formData,
                                        msgId: 902,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                                this.paramBol11 = false;
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: item,
                                params: this.initData.param901[
                                    item.split("_")[1]
                                ].param901_,
                                msgId: 902,
                            });
                            this.paramBol11 = false;
                        }
                    } else if (item.split("_").length == 3) {
                        this.paramBol11 = true;
                        if (
                            !this.initData.param901 ||
                            !this.initData.param901[item.split("_")[1]] ||
                            !this.initData.param901[item.split("_")[1]] ||
                            !this.initData.param901[item.split("_")[1]][
                                `param901_${item.split("_")[2]}`
                            ]
                        ) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    type: item.split("_")[2],
                                    chanNo: item.split("_")[1],
                                },
                                msgId: 901,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        item.split("_")[1]
                                    );
                                    this.templateData.ehomeParams.push({
                                        markKey: item,
                                        params: formData,
                                        msgId: 902,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                                this.paramBol11 = false;
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: item,
                                params: this.initData.param901[
                                    item.split("_")[1]
                                ][`param901_${item.split("_")[2]}`],
                                msgId: 902,
                            });
                            this.paramBol11 = false;
                        }
                    } else if (item.split("_").length == 4) {
                        this.paramBol11 = true;
                        if (
                            !this.initData.param901 ||
                            !this.initData.param901[item.split("_")[1]] ||
                            !this.initData.param901[item.split("_")[1]] ||
                            !this.initData.param901[item.split("_")[1]][
                                `param901_${item.split("_")[2]}`
                            ]
                        ) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    type: item.split("_")[2],
                                    chanNo: item.split("_")[1],
                                },
                                msgId: 901,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        item.split("_")[1]
                                    );
                                    this.templateData.ehomeParams.push({
                                        markKey: item,
                                        params: formData,
                                        msgId: 902,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                                this.paramBol11 = false;
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: item,
                                params: this.initData.param901[
                                    item.split("_")[1]
                                ][`param901_${item.split("_")[2]}`],
                                msgId: 902,
                            });
                            this.paramBol11 = false;
                        }
                        if (
                            !this.initData.param901 ||
                            !this.initData.param901[item.split("_")[1]] ||
                            !this.initData.param901[item.split("_")[1]] ||
                            !this.initData.param901[item.split("_")[1]][
                                `param901_${item.split("_")[3]}`
                            ]
                        ) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    type: item.split("_")[3],
                                    chanNo: item.split("_")[1],
                                },
                                msgId: 901,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        item.split("_")[1]
                                    );
                                    this.templateData.ehomeParams.push({
                                        markKey: item,
                                        params: formData,
                                        msgId: 902,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: item,
                                params: this.initData.param901[
                                    item.split("_")[1]
                                ][`param901_${item.split("_")[3]}`],
                                msgId: 902,
                            });
                            this.paramBol11 = false;
                        }
                    }
                } else if (item.includes("905")) {
                    if (item.split("_").length == 2) {
                        this.paramBol12 = true;
                        if (
                            !this.initData.param905 ||
                            !this.initData.param905[item.split("_")[1]] ||
                            !this.initData.param905[item.split("_")[1]] ||
                            !this.initData.param905[item.split("_")[1]]
                                .param905_
                        ) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    type: 0,
                                    chanNo: item.split("_")[1],
                                },
                                msgId: 905,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        item.split("_")[1]
                                    );
                                    this.templateData.ehomeParams.push({
                                        markKey: item,
                                        params: formData,
                                        msgId: 906,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                                this.paramBol12 = false;
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: item,
                                params: this.initData.param905[
                                    item.split("_")[1]
                                ].param905_,
                                msgId: 906,
                            });
                            this.paramBol12 = false;
                        }
                    } else if (item.split("_").length == 3) {
                        this.paramBol12 = true;
                        if (
                            !this.initData.param905 ||
                            !this.initData.param905[item.split("_")[1]] ||
                            !this.initData.param905[item.split("_")[1]] ||
                            !this.initData.param905[item.split("_")[1]][
                                `param905_${item.split("_")[2]}`
                            ]
                        ) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    type: item.split("_")[2],
                                    chanNo: item.split("_")[1],
                                },
                                msgId: 905,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        item.split("_")[1]
                                    );
                                    this.templateData.ehomeParams.push({
                                        markKey: item,
                                        params: formData,
                                        msgId: 906,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                                this.paramBol12 = false;
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: item,
                                params: this.initData.param905[
                                    item.split("_")[1]
                                ][`param905_${item.split("_")[2]}`],
                                msgId: 906,
                            });
                            this.paramBol12 = false;
                        }
                    } else if (item.split("_").length == 4) {
                        this.paramBol12 = true;
                        if (
                            !this.initData.param905 ||
                            !this.initData.param905[item.split("_")[1]] ||
                            !this.initData.param905[item.split("_")[1]] ||
                            !this.initData.param905[item.split("_")[1]][
                                `param905_${item.split("_")[2]}`
                            ]
                        ) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    type: item.split("_")[2],
                                    chanNo: item.split("_")[1],
                                },
                                msgId: 905,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        item.split("_")[1]
                                    );
                                    this.templateData.ehomeParams.push({
                                        markKey: item,
                                        params: formData,
                                        msgId: 906,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                                this.paramBol12 = false;
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: item,
                                params: this.initData.param905[
                                    item.split("_")[1]
                                ][`param905_${item.split("_")[2]}`],
                                msgId: 906,
                            });
                            this.paramBol12 = false;
                        }
                        if (
                            !this.initData.param905 ||
                            !this.initData.param905[item.split("_")[1]] ||
                            !this.initData.param905[item.split("_")[1]] ||
                            !this.initData.param905[item.split("_")[1]][
                                `param905_${item.split("_")[3]}`
                            ]
                        ) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    type: item.split("_")[3],
                                    chanNo: item.split("_")[1],
                                },
                                msgId: 905,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        item.split("_")[1]
                                    );
                                    this.templateData.ehomeParams.push({
                                        markKey: item,
                                        params: formData,
                                        msgId: 906,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: item,
                                params: this.initData.param905[
                                    item.split("_")[1]
                                ][`param905_${item.split("_")[3]}`],
                                msgId: 906,
                            });
                            this.paramBol12 = false;
                        }
                    }
                } else if (item.includes("920")) {
                    if (item.split("_").length == 2) {
                        this.paramBol13 = true;
                        if (
                            !this.initData.param920 ||
                            !this.initData.param920[item.split("_")[1]] ||
                            !this.initData.param920[item.split("_")[1]] ||
                            !this.initData.param920[item.split("_")[1]]
                                .param920_
                        ) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    type: 0,
                                    chanNo: item.split("_")[1],
                                },
                                msgId: 920,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        item.split("_")[1]
                                    );
                                    this.templateData.ehomeParams.push({
                                        markKey: item,
                                        params: formData,
                                        msgId: 921,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                                this.paramBol13 = false;
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: item,
                                params: this.initData.param920[
                                    item.split("_")[1]
                                ].param920_,
                                msgId: 921,
                            });
                            this.paramBol13 = false;
                        }
                    } else if (item.split("_").length == 3) {
                        this.paramBol13 = true;
                        if (
                            !this.initData.param920 ||
                            !this.initData.param920[item.split("_")[1]] ||
                            !this.initData.param920[item.split("_")[1]] ||
                            !this.initData.param920[item.split("_")[1]][
                                `param920_${item.split("_")[2]}`
                            ]
                        ) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    type: item.split("_")[2],
                                    chanNo: item.split("_")[1],
                                },
                                msgId: 920,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        item.split("_")[1]
                                    );
                                    this.templateData.ehomeParams.push({
                                        markKey: item,
                                        params: formData,
                                        msgId: 921,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                                this.paramBol13 = false;
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: item,
                                params: this.initData.param920[
                                    item.split("_")[1]
                                ][`param920_${item.split("_")[2]}`],
                                msgId: 921,
                            });
                            this.paramBol13 = false;
                        }
                    } else if (item.split("_").length == 4) {
                        this.paramBol13 = true;
                        if (
                            !this.initData.param920 ||
                            !this.initData.param920[item.split("_")[1]] ||
                            !this.initData.param920[item.split("_")[1]] ||
                            !this.initData.param920[item.split("_")[1]][
                                `param920_${item.split("_")[2]}`
                            ]
                        ) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    type: item.split("_")[2],
                                    chanNo: item.split("_")[1],
                                },
                                msgId: 920,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        item.split("_")[1]
                                    );
                                    this.templateData.ehomeParams.push({
                                        markKey: item,
                                        params: formData,
                                        msgId: 921,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                                this.paramBol13 = false;
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: item,
                                params: this.initData.param920[
                                    item.split("_")[1]
                                ][`param920_${item.split("_")[2]}`],
                                msgId: 921,
                            });
                            this.paramBol13 = false;
                        }
                        if (
                            !this.initData.param920 ||
                            !this.initData.param920[item.split("_")[1]] ||
                            !this.initData.param920[item.split("_")[1]] ||
                            !this.initData.param920[item.split("_")[1]][
                                `param920_${item.split("_")[3]}`
                            ]
                        ) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    type: item.split("_")[3],
                                    chanNo: item.split("_")[1],
                                },
                                msgId: 920,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        item.split("_")[1]
                                    );
                                    this.templateData.ehomeParams.push({
                                        markKey: item,
                                        params: formData,
                                        msgId: 921,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: item,
                                params: this.initData.param920[
                                    item.split("_")[1]
                                ][`param920_${item.split("_")[3]}`],
                                msgId: 921,
                            });
                        }
                    }
                } else if (item.includes("938")) {
                    if (item.split("_").length == 2) {
                        this.paramBol14 = true;
                        if (
                            !this.initData.param938 ||
                            !this.initData.param938[item.split("_")[1]] ||
                            !this.initData.param938[item.split("_")[1]] ||
                            !this.initData.param938[item.split("_")[1]]
                                .param938_
                        ) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    type: 1,
                                    chanNo: item.split("_")[1],
                                },
                                msgId: 938,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        item.split("_")[1]
                                    );
                                    this.templateData.ehomeParams.push({
                                        markKey: item,
                                        params: formData,
                                        msgId: 939,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                                this.paramBol14 = false;
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: item,
                                params: this.initData.param938[
                                    item.split("_")[1]
                                ].param938_,
                                msgId: 939,
                            });
                            this.paramBol14 = false;
                        }
                    } else if (item.split("_").length == 3) {
                        this.paramBol14 = true;
                        if (
                            !this.initData.param938 ||
                            !this.initData.param938[item.split("_")[1]] ||
                            !this.initData.param938[item.split("_")[1]] ||
                            !this.initData.param938[item.split("_")[1]][
                                `param938_${item.split("_")[2]}`
                            ]
                        ) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    type: item.split("_")[2],
                                    chanNo: item.split("_")[1],
                                },
                                msgId: 938,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        item.split("_")[1]
                                    );
                                    this.templateData.ehomeParams.push({
                                        markKey: item,
                                        params: formData,
                                        msgId: 939,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                                this.paramBol14 = false;
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: item,
                                params: this.initData.param938[
                                    item.split("_")[1]
                                ][`param938_${item.split("_")[2]}`],
                                msgId: 939,
                            });
                            this.paramBol14 = false;
                        }
                    } else if (item.split("_").length == 4) {
                        this.paramBol14 = true;
                        if (
                            !this.initData.param938 ||
                            !this.initData.param938[item.split("_")[1]] ||
                            !this.initData.param938[item.split("_")[1]] ||
                            !this.initData.param938[item.split("_")[1]][
                                `param938_${item.split("_")[2]}`
                            ]
                        ) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    type: item.split("_")[2],
                                    chanNo: item.split("_")[1],
                                },
                                msgId: 938,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        item.split("_")[1]
                                    );
                                    this.templateData.ehomeParams.push({
                                        markKey: item,
                                        params: formData,
                                        msgId: 939,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                                this.paramBol14 = false;
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: item,
                                params: this.initData.param938[
                                    item.split("_")[1]
                                ][`param938_${item.split("_")[2]}`],
                                msgId: 939,
                            });
                            this.paramBol14 = false;
                        }
                        if (
                            !this.initData.param938 ||
                            !this.initData.param938[item.split("_")[1]] ||
                            !this.initData.param938[item.split("_")[1]] ||
                            !this.initData.param938[item.split("_")[1]][
                                `param938_${item.split("_")[3]}`
                            ]
                        ) {
                            const params = {
                                deviceId: this.deviceId,
                                param: {
                                    type: item.split("_")[3],
                                    chanNo: item.split("_")[1],
                                },
                                msgId: 938,
                            };
                            this.$api.getEHomeConfig(params).then((res) => {
                                if (res.success && res.data.param) {
                                    const formData = JSON.parse(res.data.param);
                                    formData.chanNo = Number(
                                        item.split("_")[1]
                                    );
                                    this.templateData.ehomeParams.push({
                                        markKey: item,
                                        params: formData,
                                        msgId: 939,
                                    });
                                } else {
                                    this.$message.error(
                                        "协议获取失败请，重新勾选"
                                    );
                                    this.moubleJson[item] = false;
                                }
                            });
                        } else {
                            this.templateData.ehomeParams.push({
                                markKey: item,
                                params: this.initData.param938[
                                    item.split("_")[1]
                                ][`param938_${item.split("_")[3]}`],
                                msgId: 939,
                            });
                        }
                    }
                }
            }
        },
        get4302() {
            return new Promise((resolve, reject) => {
                this.$api
                    .getEHomeConfig({
                        deviceId: this.deviceId,
                        param: "",
                        msgId: 4302,
                    })
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        resolve(err);
                    });
            });
        },
        // 设备私有协议配置操作 获取能力集
        getDeviceEHomeCapacity() {
            Promise.all([
                this.$api.getDeviceEHomeCapacity({
                    deviceId: this.deviceId,
                    param: "",
                    msgId: 4401,
                }),
                this.get4302(),
                // this.$api.getEHomeConfig({
                //     deviceId: this.deviceId,
                //     param: "",
                //     msgId: 4302,
                // }),
            ]).then((res) => {
                if (res[0] && res[0].data && res[0].data.param) {
                    this.capability = {
                        ...this.capability,
                        ...JSON.parse(res[0].data.param),
                    };
                    this.templateData.capability = {
                        ...this.templateData.capability,
                        ...JSON.parse(res[0].data.param),
                    };
                } else {
                    this.$message.error("获取设备能力集失败，请重试。");
                }
                if (res[1] && res[1].data && res[1].data.param) {
                    this.capability = {
                        ...this.capability,
                        zhatu: JSON.parse(res[1].data.param),
                    };
                    this.templateData.capability = {
                        ...this.templateData.capability,
                        zhatu: JSON.parse(res[1].data.param),
                    };
                } else {
                    // this.$message.error("获取渣土车能力集失败，请重试。");
                }
                this.makeMenu();
                this.configParams = false;
            });
        },
        // 获取设备详情
        getParamDeviceById() {
            const params = {
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
        // 重新获取设备协议配置
        getDeviceConfigParams() {
            this.initData = {};
            this.originalInitData = {};
            this.statisticsData = {};
            this.configParams = true;
            this.getParamDeviceById();
            if (JSON.stringify(this.capability) == "{}") {
                this.getDeviceEHomeCapacity();
            }
        },
        // 保存模板
        submitTemp(temp) {
            const params = Object.assign(
                {},
                this.deviceInfo,
                temp,
                { templateType: 3 },
                { templateContent: JSON.stringify(this.templateData) }
            );
            this.$api.hikDevParamTempAdd(params).then((res) => {
                if (res.success == true) {
                    this.$message.success("模板保存成功");
                    this.templateVisible = false;
                } else {
                    this.$message.error("模板保存失败:" + res.msg);
                }
                this.templateData.ehomeParams = [];
            });
        },
        saveTemp() {
            if (this.menuActiveRefFormName.includes("PrivateGsensorTurnForm")) {
                this.$refs.component.$refs[
                    this.menuActiveRefFormName
                ][0].validate((valid, invalidFields) => {
                    if (!valid) {
                        this.$message.info(
                            "当前配置界面内有不符合规范的配置项，请检查修改后存为模板！"
                        );
                    } else {
                        this.moubleBol = true;
                    }
                });
            } else {
                this.$refs.component.$refs[this.menuActiveRefFormName].validate(
                    (valid, invalidFields) => {
                        if (!valid) {
                            this.$message.info(
                                "当前配置界面内有不符合规范的配置项，请检查修改后存为模板！"
                            );
                        } else {
                            this.moubleBol = true;
                        }
                    }
                );
            }
        },
        goBack() {
            this.$router.push("/maintenanceCenter/deviceConfiguration");
        },
        sendProtocol() {
            if (!this.dataList.length) {
                this.$message.info("请至少修改一个配置项后再下发至设备");
                return;
            } else {
                if (
                    this.menuActiveRefFormName.includes(
                        "PrivateGsensorTurnForm"
                    )
                ) {
                    this.$refs.component.$refs[
                        this.menuActiveRefFormName
                    ][0].validate((valid, invalidFields) => {
                        if (!valid) {
                            this.$message.info(
                                "当前配置界面内有不符合规范的配置项，请检查修改后下发！"
                            );
                        } else {
                            this.updateBol = true;
                        }
                    });
                } else {
                    this.$refs.component.$refs[
                        this.menuActiveRefFormName
                    ].validate((valid, invalidFields) => {
                        if (!valid) {
                            this.$message.info(
                                "当前配置界面内有不符合规范的配置项，请检查修改后下发！"
                            );
                        } else {
                            this.updateBol = true;
                        }
                    });
                }
            }
        },
        // 关闭修改的配置项弹窗
        close() {
            this.updateBol = false;
        },
        // 关闭存至模板弹窗
        closeMouble() {
            this.moubleBol = false;
        },
        // 存至模板
        prepareOk() {
            let moubleJsonBol = false;
            for (const key in this.moubleJson) {
                if (this.moubleJson[key]) {
                    moubleJsonBol = true;
                }
            }
            if (!moubleJsonBol) {
                this.$message.info("请至少勾选一个模块存为模板");
                return;
            }
            this.moubleBol = false;
            this.templateVisible = true;
        },
        // 创建模板主动安全设置的moubleJson901_1_0_4
        makeMoubleJson(msgId, chanNo, itemArr, type1, type2) {
            if (itemArr.indexOf(type1) != -1 && itemArr.indexOf(type2) != -1) {
                this.$set(
                    this.moubleJson,
                    `${msgId}_${chanNo}_${type1}_${type2}`,
                    false
                );
            } else if (itemArr.indexOf(type1) != -1) {
                this.$set(
                    this.moubleJson,
                    `${msgId}_${chanNo}_${type1}`,
                    false
                );
            } else if (itemArr.indexOf(type2) != -1) {
                this.$set(
                    this.moubleJson,
                    `${msgId}_${chanNo}_${type2}`,
                    false
                );
            }
        },
        // 下发至终端
        updateSure() {
            console.log(this.dataList);
            const noChanNoList = [];
            const chanNoList = [];
            this.dataList.forEach((item) => {
                if (
                    item[0].includes("param901") ||
                    item[0].includes("param905") ||
                    item[0].includes("param920") ||
                    item[0].includes("param938")
                ) {
                    chanNoList.push(item);
                } else {
                    noChanNoList.push(item);
                }
            });
            const chanNoProcolArr = [];
            let noRepeatChanNoProcolArr = [];
            const chanNoProtocol = [];
            if (chanNoList.length) {
                chanNoList.forEach((item) => {
                    chanNoProcolArr.push(
                        item[0].split(".").slice(0, 2).join(".")
                    );
                });
                noRepeatChanNoProcolArr = [...new Set(chanNoProcolArr)];
                noRepeatChanNoProcolArr.forEach((item) => {
                    chanNoProtocol.push({
                        msgId:
                            Number(
                                item
                                    .split("_")[0]
                                    .substring(5, item.split("_")[0].length)
                            ) + 1,
                        param: this.initData[item.split("_")[0]][
                            item.split(".")[1]
                        ][item.split(".")[0]],
                    });
                });
            }
            const noChanNoProcolArr = [];
            let noRepeatNoChanNoProcolArr = [];
            const noChanNoProtocol = [];
            if (noChanNoList) {
                noChanNoList.forEach((item) => {
                    noChanNoProcolArr.push(item[0].split(".")[0]);
                });
                noRepeatNoChanNoProcolArr = [...new Set(noChanNoProcolArr)];
                noRepeatNoChanNoProcolArr.forEach((item) => {
                    if (item.includes("_")) {
                        if (item.includes("volume")) {
                            const updateJson = {};
                            for (const key in this.initData.param2205_volume) {
                                if (key == "value") {
                                    updateJson[key] = String(
                                        this.initData.param2205_volume[key]
                                    );
                                } else {
                                    updateJson[key] =
                                        this.initData.param2205_volume[key];
                                }
                            }
                            noChanNoProtocol.push({
                                msgId:
                                    Number(
                                        item
                                            .substring(
                                                5,
                                                item.split(".")[0].length
                                            )
                                            .split("_")[0]
                                    ) + 1,
                                param: updateJson,
                            });
                        } else if (item.includes("948")) {
                            const updateJson = {};
                            for (const key in this.initData[
                                item.split(".")[0]
                            ]) {
                                if (key == "chanNo") {
                                    updateJson[key] = Number(
                                        this.initData[item.split(".")[0]][key]
                                    );
                                } else {
                                    this.initData[item.split(".")[0]][
                                        key
                                    ].forEach((item_) => {
                                        for (const key_ in item_) {
                                            updateJson[key_] = item_[key_];
                                        }
                                    });
                                    updateJson[key] =
                                        this.initData[item.split(".")[0]][key];
                                }
                            }
                            noChanNoProtocol.push({
                                msgId: 949,
                                param: updateJson,
                            });
                        } else {
                            noChanNoProtocol.push({
                                msgId:
                                    Number(
                                        item
                                            .substring(
                                                5,
                                                item.split(".")[0].length
                                            )
                                            .split("_")[0]
                                    ) + 1,
                                param: this.initData[item.split(".")[0]],
                            });
                        }
                    } else {
                        noChanNoProtocol.push({
                            msgId:
                                Number(
                                    item.substring(5, item.split(".")[0].length)
                                ) + 1,
                            param: this.initData[item.split(".")[0]],
                        });
                    }
                });
            }
            let allChangProtocol = [...chanNoProtocol, ...noChanNoProtocol];
            let lukou = allChangProtocol.find((item) => item.msgId === 1316);
            if (lukou) {
                for (let i = 0; i < allChangProtocol.length; i++) {
                    if (allChangProtocol[i].msgId === 1316) {
                        allChangProtocol.splice(i, 1);
                    }
                }
                let lukouParams = [];
                let arr = [];
                this.dataList.forEach((item) => {
                    if (item[0].includes("param1315")) {
                        arr.push(item[0].split(".")[1]);
                    }
                });
                arr = [...new Set(arr)];
                lukou.param.forEach((item, index) => {
                    if (arr.find((i) => Number(i) === index)) {
                        lukouParams.push({
                            msgId: 1316,
                            param: item,
                        });
                    }
                });
                allChangProtocol = [...allChangProtocol, ...lukouParams];
            }
            allChangProtocol.forEach((item) => {
                if (
                    item.msgId === 906 ||
                    item.msgId === 902 ||
                    item.msgId === 921 ||
                    item.msgId === 939 ||
                    item.msgId === 984
                ) {
                    item.param.info.forEach((k) => {
                        if (k.snapshot.save === 0 && k.snapshot.upload === 1) {
                            k.snapshot.save = 1;
                        }
                        if (k.clip.save === 0 && k.clip.upload === 1) {
                            k.clip.save = 1;
                        }
                    });
                }
            });
            const params = {
                deviceIds: [Number(this.deviceId)],
                params2: allChangProtocol,
                params: JSON.stringify(allChangProtocol),
                paramBefore: JSON.stringify(this.statisticsData),
            };
            this.$api.saveEHomeConfig(params).then((res) => {
                if (res.success) {
                    this.startConfigVisible = true;
                    this.batchCode = res.data;
                } else {
                    this.$message.error("下发配置参数至设备失败:" + res.msg);
                }
                this.updateBol = false;
            });
        },
        openDialog() {
            this.$emit("open");
        },
    },
    computed: {},
    mounted() {
        this.refreshSession();
        this.getParamDeviceById();
    },
};
</script>

<style lang="less" scoped>
.agreement-config{
    height: 100%;
    overflow-y: auto;
}
.configuration-module {
    display: flex;
    border: 1px solid #f0f0f0;
    padding-bottom: 40px;
    .menu-vertical {
        height: 100%;
    }
    .configuration-detail-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        .configuration-detail-item {
            flex-grow: 1;
        }
    }
}
.el-submenu.is-active:not(.is-opened) > .el-submenu__title {
    background-color: #f0f0f0 !important;
}
.el-submenu__title:hover {
    background: #f0f0f0 !important;
}
.el-submenu.is-opened {
    background: #ebebeb !important;
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
</style>
