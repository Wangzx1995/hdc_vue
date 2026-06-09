<template>
    <div class="mycontent">
        <el-table
            :data="GPSData"
            border
            size="medium"
            height="calc(100% - 38px)"
            tooltip-effect="dark"
            ref="tableGPS"
            align="center"
            :row-class-name="rowIndex"
            @row-click="tableClick"
            highlight-current-row
        >
            <template v-for="(item, index) in tableColumnVoList">
                <template v-if="item.fieldNameEN === 'collectTime'">
                    <!-- 上报时间 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="collectTime"
                        min-width="150"
                        :label="$t('historyPlayback.collectTime')"
                        :key="item.fieldNameEN + index"
                    >
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'supplementSign'">
                    <!-- 上报类型 -->
                    <el-table-column
                        show-overflow-tooltip
                        min-width="110"
                        :label="$t('historyPlayback.supplementSign')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            <!-- { 0: "正常上报", 1: "补传" }[ -->
                            {{
                                {
                                    0: $t(
                                        "qualifiedProbability.supplementSignText2"
                                    ),
                                    1: $t(
                                        "qualifiedProbability.supplementSignText1"
                                    ),
                                }[scope.row.supplementSign]
                            }}
                        </template>
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'gpsStatus'">
                    <!-- 状态 -->
                    <el-table-column
                        show-overflow-tooltip
                        min-width="150"
                        :label="$t('historyPlayback.gpsStatus')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            <span v-show="scope.row.gpsStatus == 0">
                                <!-- ACC关&无定位 -->
                                {{ $t("qualifiedProbability.gpsStatusText1") }}
                            </span>
                            <span v-show="scope.row.gpsStatus == 1">
                                <!-- ACC关&有定位 -->
                                {{ $t("qualifiedProbability.gpsStatusText2") }}
                            </span>
                            <span v-show="scope.row.gpsStatus == 2">
                                <!-- ACC开&无定位 -->
                                {{ $t("qualifiedProbability.gpsStatusText3") }}
                            </span>
                            <span v-show="scope.row.gpsStatus == 3">
                                <!-- ACC开&有定位 -->
                                {{ $t("qualifiedProbability.gpsStatusText4") }}
                            </span>
                        </template>
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'createTime'">
                    <!-- 接收时间 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="createTime"
                        min-width="150"
                        :label="$t('historyPlayback.createTime')"
                        :key="item.fieldNameEN + index"
                    >
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'speed'">
                    <!-- GPS速度(km/h) -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="speed"
                        min-width="150"
                        :label="$t('historyPlayback.GPSSpeed') + '(km/h)'"
                        :key="item.fieldNameEN + index"
                    >
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'recorderSpeed'">
                    <!-- 行车记录仪速度(km/h) -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="recorderSpeed"
                        min-width="150"
                        :label="$t('historyPlayback.recorderSpeed') + '(km/h)'"
                        :key="item.fieldNameEN + index"
                    >
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'overSpeedWarning'">
                    <!-- 超速预警 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="overSpeedWarning"
                        min-width="100"
                        :label="$t('historyPlayback.overSpeedWarning')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            <!-- {{ scope.row.overSpeedWarning ? "是" : "否" }} -->
                            {{
                                scope.row.overSpeedWarning
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'overSpeedAlarm'">
                    <!-- 超速报警 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="overSpeedAlarm"
                        min-width="100"
                        :label="$t('historyPlayback.overSpeedAlarm')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.overSpeedAlarm
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'fatigueDrivingWarning'">
                    <!-- 超时驾驶预警 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="fatigueDrivingWarning"
                        min-width="100"
                        :label="$t('historyPlayback.fatigueDrivingWarning')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.fatigueDrivingWarning
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'fatigueDrivingAlarm'">
                    <!-- 超时驾驶报警 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="fatigueDrivingAlarm"
                        min-width="100"
                        :label="$t('historyPlayback.fatigueDrivingAlarm')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.fatigueDrivingAlarm
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'locateType'">
                    <!-- 定位类型 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="locateType"
                        min-width="100"
                        :label="$t('historyPlayback.locateType')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                locateTypeList.find(
                                    (e) =>
                                        Number(e.value) ==
                                        Number(scope.row.locateType)
                                )
                                    ? locateTypeList.find(
                                          (e) =>
                                              Number(e.value) ==
                                              Number(scope.row.locateType)
                                      ).key
                                    : "--"
                            }}
                        </template>
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'uploadMode'">
                    <!-- 上传类型 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="uploadMode"
                        min-width="100"
                        :label="$t('historyPlayback.uploadMode')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                uploadModeList.find(
                                    (e) =>
                                        Number(e.value) ==
                                        Number(scope.row.uploadMode)
                                )
                                    ? uploadModeList.find(
                                          (e) =>
                                              Number(e.value) ==
                                              Number(scope.row.uploadMode)
                                      ).key
                                    : "--"
                            }}
                        </template>
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'longitudeAndLatitude'">
                    <!-- 经纬度 -->
                    <el-table-column
                        show-overflow-tooltip
                        min-width="160"
                        :label="$t('historyPlayback.longitudeAndLatitude')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            <span
                                >{{
                                    scope.row.longitude
                                        | undefinedValue(0.0)
                                        | formatFloat(6)
                                }},{{
                                    scope.row.latitude
                                        | undefinedValue(0.0)
                                        | formatFloat(6)
                                }}</span
                            >
                        </template>
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'totalMileage'">
                    <!-- 总里程(km) -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="totalMileage"
                        :label="$t('historyPlayback.totalMileage') + '(km)'"
                        min-width="100"
                        :key="item.fieldNameEN + index"
                    >
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'geographyLocation'">
                    <!-- 地理位置 -->
                    <el-table-column
                        show-overflow-tooltip
                        min-width="220"
                        prop="address"
                        :label="$t('historyPlayback.geographyLocation')"
                        :key="item.fieldNameEN + index"
                    >
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'direction'">
                    <!-- 方向角(°) -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="direction"
                        :label="$t('historyPlayback.direction') + '(°)'"
                        min-width="80"
                        :key="item.fieldNameEN + index"
                    >
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'altitude'">
                    <!-- 海拔(m) -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="altitude"
                        :label="$t('historyPlayback.altitude') + '(m)'"
                        min-width="80"
                        :key="item.fieldNameEN + index"
                    >
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'locationSignal'">
                    <!-- 卫星数 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="locationSignal"
                        :label="$t('historyPlayback.locationSignal')"
                        min-width="100"
                        :key="item.fieldNameEN + index"
                    >
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'positionSignalStrength'">
                    <!-- 网络信号强度(dBm) -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="positionSignalStrength"
                        :label="
                            $t('historyPlayback.positionSignalStrength') +
                            '（dBm）'
                        "
                        min-width="160"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot="header" slot-scope="scope">
                            <span class="positionSignalStrength">
                                <!-- 网络信号强度 -->
                                {{
                                    $t(
                                        "qualifiedProbability.positionSignalStrength"
                                    )
                                }}
                                (dBm)</span
                            >
                            <el-tooltip
                                class="item"
                                effect="light"
                                placement="top"
                                :popper-class="'signal-popper'"
                            >
                                <div slot="content" class="signal-description">
                                    <div>
                                        <!-- 通讯信号强度说明 -->
                                        {{
                                            $t(
                                                "videoPlayback.explanationOfCommunication"
                                            )
                                        }}
                                    </div>
                                    <p>
                                        <signal :strength="5"></signal>
                                        <span>[-69, +∞)</span>
                                    </p>
                                    <p>
                                        <signal :strength="4"></signal>
                                        <span>[-77, -69)</span>
                                    </p>
                                    <p>
                                        <signal :strength="3"></signal>
                                        <span>[-87, -77)</span>
                                    </p>
                                    <p>
                                        <signal :strength="2"></signal>
                                        <span>[-93, -87)</span>
                                    </p>
                                    <p>
                                        <signal :strength="1"></signal>
                                        <span>[-103, -93)</span>
                                    </p>
                                    <p>
                                        <signal :strength="0"></signal>
                                        <span>(-∞, -103)</span>
                                    </p>
                                </div>
                                <i class="el-icon-warning-outline"></i>
                            </el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            <div
                                v-if="
                                    scope.row.hasOwnProperty(
                                        'positionSignalStrength'
                                    )
                                "
                                class="signal"
                            >
                                <signal
                                    :strength="
                                        calcDBM(
                                            scope.row.positionSignalStrength
                                        )
                                    "
                                ></signal>
                                <span>{{
                                    scope.row.positionSignalStrength
                                }}</span>
                            </div>
                        </template>
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'emergencyAlarm'">
                    <!-- 紧急报警 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="emergencyAlarm"
                        min-width="100"
                        :label="$t('historyPlayback.emergencyAlarm')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.emergencyAlarm
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column>
                </template>
                <template
                    v-if="item.fieldNameEN === 'cumulativeOvertimeDrivingAlarm'"
                >
                    <!-- 当天累计驾驶超时 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="cumulativeOvertimeDrivingAlarm"
                        min-width="120"
                        :label="
                            $t('historyPlayback.cumulativeOvertimeDrivingAlarm')
                        "
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.cumulativeOvertimeDrivingAlarm
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'vehicleIllegalIgnition'">
                    <!-- 车辆非法点火 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="vehicleIllegalIgnition"
                        min-width="100"
                        :label="$t('historyPlayback.vehicleIllegalIgnition')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.vehicleIllegalIgnition
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'vehicleIllegalMove'">
                    <!-- 车辆非法位移 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="vehicleIllegalMove"
                        min-width="100"
                        :label="$t('historyPlayback.vehicleIllegalMove')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.vehicleIllegalMove
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'illegalDrivingAlarm'">
                    <!-- 违规行驶报警 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="illegalDrivingAlarm"
                        min-width="100"
                        :label="$t('historyPlayback.illegalDrivingAlarm')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.illegalDrivingAlarm
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column>
                </template>

                <template v-if="item.fieldNameEN === 'gnnsModuleFault'">
                    <!-- GNSS模块故障 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="gnnsModuleFault"
                        min-width="120"
                        :label="$t('historyPlayback.gnnsModuleFault')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.gnnsModuleFault
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'gnnsAntennaUnconnected'">
                    <!-- GNSS天线未接或剪断 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="gnnsAntennaUnconnected"
                        min-width="140"
                        :label="$t('historyPlayback.gnnsAntennaUnconnected')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.gnnsAntennaUnconnected
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column> </template
                ><template
                    v-if="item.fieldNameEN === 'gnnsAntennaShortCircuit'"
                >
                    <!-- GNSS天线短路 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="gnnsAntennaShortCircuit"
                        min-width="120"
                        :label="$t('historyPlayback.gnnsAntennaShortCircuit')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.gnnsAntennaShortCircuit
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column> </template
                ><template
                    v-if="item.fieldNameEN === 'terminalMainPowerUndervoltage'"
                >
                    <!-- 终端主电源欠压 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="terminalMainPowerUndervoltage"
                        min-width="120"
                        :label="
                            $t('historyPlayback.terminalMainPowerUndervoltage')
                        "
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.terminalMainPowerUndervoltage
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column> </template
                ><template v-if="item.fieldNameEN === 'terminalMainPowerDown'">
                    <!-- 终端主电源掉电 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="terminalMainPowerDown"
                        min-width="120"
                        :label="$t('historyPlayback.terminalMainPowerDown')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.terminalMainPowerDown
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column> </template
                ><template v-if="item.fieldNameEN === 'terminalLcdFault'">
                    <!-- 终端LCD或显示器故障 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="terminalLcdFault"
                        min-width="160"
                        :label="$t('historyPlayback.terminalLcdFault')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.terminalLcdFault
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column> </template
                ><template v-if="item.fieldNameEN === 'ttsModuleFault'">
                    <!-- TTS模块故障 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="ttsModuleFault"
                        min-width="100"
                        :label="$t('historyPlayback.ttsModuleFault')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.ttsModuleFault
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column> </template
                ><template v-if="item.fieldNameEN === 'cameraFault'">
                    <!-- 摄像头故障 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="cameraFault"
                        min-width="100"
                        :label="$t('historyPlayback.cameraFault')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.cameraFault
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column> </template
                ><template v-if="item.fieldNameEN === 'icModuleFault'">
                    <!-- 道路运输证IC卡模块故障 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="icModuleFault"
                        min-width="160"
                        :label="$t('historyPlayback.icModuleFault')"
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.icModuleFault
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column> </template
                ><template
                    v-if="item.fieldNameEN === 'vehicleIllegalDoorOpeningAlarm'"
                >
                    <!-- 非法开门报警 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="vehicleIllegalDoorOpeningAlarm"
                        min-width="100"
                        :label="
                            $t('historyPlayback.vehicleIllegalDoorOpeningAlarm')
                        "
                        :key="item.fieldNameEN + index"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.vehicleIllegalDoorOpeningAlarm
                                    ? $t("common.yes")
                                    : $t("common.not")
                            }}
                        </template>
                    </el-table-column>
                </template>
                <template v-if="item.fieldNameEN === 'alarmStatusNum'">
                    <!-- 报警标志位 -->
                    <el-table-column
                        show-overflow-tooltip
                        prop="alarmStatusNum"
                        :label="$t('historyPlayback.alarmStatusNum')"
                        min-width="85"
                        :key="item.fieldNameEN + index"
                    >
                    </el-table-column>
                </template>
            </template>
        </el-table>
        <el-pagination
            small
            @size-change="pageSizeChange"
            @current-change="pageChange"
            :current-page="GpsParams.currentPage"
            :page-sizes="[20, 50, 100]"
            :page-size="GpsParams.pageSize"
            layout="total,  prev, pager, next, sizes, jumper"
            :total="GpsTotal || 0"
            class="p-a1 text-left"
            background
        >
        </el-pagination>
    </div>
</template>
<script>
import mixins from "../js/mixins";
import signal from "./signal";
import { transferAddress } from "@/utils/getMapLocation";
import gpsConverter from "../../../../utils/gpsConverter";
export default {
    components: {
        signal,
    },
    mixins: [mixins],
    props: {
        currentCar: {
            type: Object,
            default: {},
        },
        GpsDataTotal: {
            type: Array,
            default: () => {
                return [];
            },
        },
        tableColumnVoList: {
            type: Array,
            default: () => {
                return [];
            },
        },
        locateTypeList: {
            type: Array,
            default: () => {
                return [];
            },
        },
        uploadModeList: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    data() {
        return {
            GPSData: [],
            GpsParams: {
                currentPage: 1,
                pageSize: 100,
            },
            filterForm: {
                accStatus: 2,
                speedFilte: true,
            },
        };
    },
    computed: {
        GpsTotal() {
            return this.GpsDataTotal.length;
        },
        calcDBM: () => {
            return (val) => {
                let res;
                if (val >= -69) {
                    res = 5;
                } else if (val >= -77 && val < -69) {
                    res = 4;
                } else if (val >= -87 && val < -77) {
                    res = 3;
                } else if (val >= -93 && val < -87) {
                    res = 2;
                } else if (val >= -103 && val < -93) {
                    res = 1;
                } else {
                    res = 0;
                }
                return res;
            };
        },
    },
    watch: {
        GpsParams: {
            handler(val) {
                this.handGPStableData();
            },
            deep: true,
        },
        GpsDataTotal: {
            handler(val) {
                this.handGPStableData();
            },
            deep: true,
        },
    },
    created() {},
    methods: {
        tableClick({
            index,
            lngGaode,
            latGaode,
            collectTime,
            lng,
            lat,
            address,
            speed,
            direction,
        }) {
            let data = {
                lngGaode,
                latGaode,
                collectTime,
                address,
                speed,
                $index:
                    index +
                    this.GpsParams.pageSize * (this.GpsParams.currentPage - 1),
                lat,
                lng,
                direction,
            };
            let position = [lng, lat];
            this.$emit("getTipInform", {
                type: "gps",
                data,
                position,
            });
        },
        rowIndex({ row, rowIndex }) {
            row.index = rowIndex;
        },
        handGPStableData() {
            if (this.GpsTotal > 0) {
                let start =
                    (this.GpsParams.currentPage - 1) * this.GpsParams.pageSize;
                let end = this.GpsParams.currentPage * this.GpsParams.pageSize;
                let a = JSON.parse(JSON.stringify(this.GpsDataTotal));
                let data = a.slice(start, end);
                data.forEach((item) => {
                    item.address = "";
                });
                transferAddress(data, "longitude", "latitude", "address");
                // data.forEach((item, index) => {
                //     getBaiduAddress(item, "lngBaidu", "latBaidu", "address");
                // });
                this.GPSData = data;
            } else {
                this.GPSData = [];
            }
        },
        /**
         * @on-change 页码改变的回调，返回改变后的页码
         * */
        pageChange(page) {
            this.GpsParams.currentPage = page;
        },
        /**
         * @on-page-size-change 切换每页条数时的回调，返回切换后的每页条数
         * */
        pageSizeChange(limit) {
            this.GpsParams.currentPage = 1;
            this.GpsParams.pageSize = limit;
        },
        setColumn(collectTime) {
            let dataIndex = this.GpsDataTotal.findIndex(
                (item) => item.collectTime == collectTime
            );
            if (this.GpsTotal > 0) {
                this.GpsParams.currentPage =
                    Math.floor(dataIndex / this.GpsParams.pageSize) + 1;
                let start =
                    (this.GpsParams.currentPage - 1) * this.GpsParams.pageSize;
                let end = this.GpsParams.currentPage * this.GpsParams.pageSize;
                let a = JSON.parse(JSON.stringify(this.GpsDataTotal));
                let data = a.slice(start, end);
                data.forEach((item) => {
                    item.address = "";
                });
                transferAddress(data, "longitude", "latitude", "address");
                // data.forEach((item, index) => {
                //     getBaiduAddress(item, "lngBaidu", "latBaidu", "address");
                // });
                this.GPSData = data;
                this.$nextTick(() => {
                    this.$refs.tableGPS.setCurrentRow(
                        this.GPSData[dataIndex - start]
                    );
                    const tableBodyWrapper =
                        this.$refs.tableGPS.$el.querySelector(
                            ".el-table__body-wrapper"
                        );
                    tableBodyWrapper.scrollTop = 36 * (dataIndex - start);
                });
            }
        },
    },
};
</script>
<style lang="less" scoped>
.el-table {
    /deep/tbody tr:hover > td {
        cursor: pointer;
    }
}

.small {
    display: none;
}

.p-a1 {
    padding: 0.5rem !important;
}

.filter-form {
    padding: 6px;

    .el-form-item {
        margin: 0 24px 0 0 !important;
    }
}

/deep/.signal {
    display: flex;
    align-items: center;

    & > span {
        margin-left: 8px;
    }
}

/deep/.positionSignalStrength {
    margin-right: 4px;
}

.signal-description {
    & > div:first-child {
        border-bottom: 1px solid #cccccc;
        padding: 10px;
    }

    & > p {
        padding: 5px 15px;
        display: flex;
        align-items: center;

        & > span {
            margin-left: 20px;
        }
    }
}
</style>
<style lang="less">
.signal-popper {
    padding: 0px !important;
}

.mypopoverClass {
    min-width: 100px !important;

    .el-checkbox-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
}
.mycontent {
    .el-table__empty-block {
        min-height: 200px;
        height: 200px !important;
    }
    .el-table__empty-text {
        background: url(/static/images/noData.svg) no-repeat center center;
    }
}
</style>
