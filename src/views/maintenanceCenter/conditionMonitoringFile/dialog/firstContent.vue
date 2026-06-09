<template>
    <div class="first-content">
        <div class="left-box">
            <div class="equipment-overview content-box">
                <div class="big-title">设备概览</div>
                <div class="status-list">
                    <div
                        class="small-box"
                        :class="`status_${situation.storageStatus}`"
                    >
                        <div>
                            <span>存储状态</span>
                            <em></em>
                        </div>
                        <template
                            v-if="situation.hasOwnProperty('storageStatus')"
                        >
                            <div>{{ statusObj[situation.storageStatus] }}</div>
                            <div>
                                近24小时故障：{{
                                    situation.latest24StorageFaultCount
                                }}次
                            </div>
                        </template>
                        <div v-else>未知</div>
                    </div>
                    <div
                        class="small-box"
                        :class="`status_${situation.lostVideoChannelStatus}`"
                    >
                        <div>
                            <span>视频状态</span>
                            <em></em>
                        </div>
                        <template
                            v-if="
                                situation.hasOwnProperty(
                                    'lostVideoChannelStatus'
                                )
                            "
                        >
                            <div>
                                {{
                                    statusObj[situation.lostVideoChannelStatus]
                                }}
                            </div>
                            <div>
                                近24小时故障：{{
                                    situation.latest24LostVideoChannelFaultCount
                                }}次
                            </div>
                        </template>
                        <div v-else>未知</div>
                    </div>
                    <div
                        class="small-box"
                        :class="`status_${situation.videoRecordStatus}`"
                    >
                        <div>
                            <span>录像状态</span>
                            <em></em>
                        </div>
                        <template
                            v-if="situation.hasOwnProperty('videoRecordStatus')"
                        >
                            <div>
                                {{ statusObj[situation.videoRecordStatus] }}
                            </div>
                            <div>
                                近24小时故障：{{
                                    situation.latest24VideoRecordFaultCount
                                }}次
                            </div>
                        </template>
                        <div v-else>未知</div>
                    </div>
                    <div
                        class="small-box"
                        :class="`status_${situation.gpsStatus}`"
                    >
                        <div>
                            <span>定位状态</span>
                            <em></em>
                        </div>
                        <template v-if="situation.hasOwnProperty('gpsStatus')">
                            <div>{{ statusObj[situation.gpsStatus] }}</div>
                            <div>
                                近24小时故障：{{
                                    situation.latest24GpsFaultCount
                                }}次
                            </div>
                        </template>
                        <div v-else>未知</div>
                    </div>
                    <div
                        class="small-box"
                        :class="`status_${situation.algStatus}`"
                    >
                        <div>
                            <span>架设状态</span>
                            <em></em>
                        </div>
                        <template v-if="situation.hasOwnProperty('algStatus')">
                            <div>{{ statusObj[situation.algStatus] }}</div>
                            <div>
                                近24小时故障：{{
                                    situation.latest24AlgFaultCount
                                }}次
                            </div>
                        </template>
                        <div v-else>未知</div>
                    </div>
                </div>
                <timeLine :detailData="detailData"></timeLine>
            </div>
            <div class="status-table">
                <div class="content-box">
                    <div class="big-title">存储状态</div>
                    <div
                        class="btn-title"
                        @click="openFormatRecord"
                        v-btn="'conditionMonitoringFormattingRecords'"
                    >
                        格式化记录
                    </div>
                    <div class="time-title" v-if="storageStatusObj.updateTime">
                        {{ storageStatusObj.updateTime }}更新
                    </div>
                    <el-table :data="storageStatusObj.hddVoList" :height="215">
                        <el-table-column prop="hddName" label="存储介质">
                        </el-table-column>
                        <el-table-column prop="hddStatusString" label="状态">
                            <template slot-scope="scope">
                                <div class="status-enumeration">
                                    <i
                                        :class="
                                            scope.row.hddStatus === 0
                                                ? 'success'
                                                : 'muted'
                                        "
                                    ></i>
                                    <span>
                                        {{ scope.row.hddStatusString || "--" }}
                                    </span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="capacity" label="容量">
                            <template slot="header">
                                <span>容量</span>
                                <el-tooltip
                                    placement="top"
                                    content="使用海康威视安防级文件预分配存储技术，格式化时即根据存储卡总容量预置录像文件"
                                >
                                    <i class="el-icon-warning"></i>
                                </el-tooltip>
                            </template>
                            <template slot-scope="scope">
                                <span>{{
                                    scope.row.capacity == 0 ||
                                    scope.row.capacity
                                        ? scope.row.capacity + "GB"
                                        : "--"
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <div v-if="!scope.row.hddName.includes('BACK')">
                                    <el-button
                                        v-if="
                                            !scope.row.sdFormatSchedule ||
                                            scope.row.sdFormatSchedule === 100
                                        "
                                        type="text"
                                        @click="formatting(scope.row)"
                                        :disabled="
                                            !!(
                                                scope.row.sdFormatSchedule ||
                                                (scope.row.hddStatus != 3 &&
                                                    scope.row.hddStatus != 2)
                                            )
                                        "
                                        v-btn="
                                            'conditionMonitoringFormatStorageMedia'
                                        "
                                    >
                                        格式化
                                    </el-button>
                                    <a
                                        v-else
                                        :disabled="true"
                                        class="formatting"
                                    >
                                        格式化中({{
                                            scope.row.sdFormatSchedule
                                        }}%)
                                    </a>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="content-box">
                    <div class="big-title">视频状态</div>
                    <div
                        class="time-title"
                        v-if="videoInfo.lostVideoChannelStatusTime"
                    >
                        {{ videoInfo.lostVideoChannelStatusTime }}更新
                    </div>
                    <el-table
                        :data="videoInfo.videoChannelStatus"
                        :height="215"
                    >
                        <el-table-column prop="name" label="通道号">
                        </el-table-column>
                        <el-table-column prop="type" label="类型">
                        </el-table-column>
                        <el-table-column prop="status" label="视频信号状态">
                            <template slot-scope="scope">
                                <div
                                    class="status-enumeration"
                                    v-if="
                                        scope.row.enable != 0 &&
                                        scope.row.status === 1
                                    "
                                >
                                    <i class="success"></i>
                                    <span>正常</span>
                                </div>
                                <div
                                    class="status-enumeration"
                                    v-else-if="
                                        scope.row.enable != 0 &&
                                        scope.row.status === 0
                                    "
                                >
                                    <i class="error"></i>
                                    <span>未接入</span>
                                </div>
                                <div v-else>--</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="shelter" label="视频遮挡状态">
                            <template slot-scope="scope">
                                <div v-if="scope.row.installationStatus == 0">
                                    --
                                </div>
                                <template v-else>
                                    <div
                                        class="status-enumeration"
                                        v-if="scope.row.shelter === 1"
                                    >
                                        <i class="success"></i>
                                        <span>正常</span>
                                    </div>
                                    <div
                                        class="status-enumeration"
                                        v-else-if="scope.row.shelter === 0"
                                    >
                                        <i class="error"></i>
                                        <span>异常</span>
                                    </div>
                                    <div v-else>--</div>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="status-form">
                <div class="double-layer">
                    <div class="content-box">
                        <div class="big-title">网络信号</div>
                        <div
                            class="time-title"
                            v-if="networkInfo.signalIntensityTime"
                        >
                            {{ networkInfo.signalIntensityTime }}更新
                        </div>
                        <div class="form-box">
                            <div>
                                <span>信号强度：</span>
                                <span>
                                    <signal
                                        v-if="
                                            networkInfo.signalIntensity >= 0 &&
                                            networkInfo.signalIntensity <= 5
                                        "
                                        :strength="networkInfo.signalIntensity"
                                    ></signal>
                                    <div v-else>未知</div>
                                </span>
                            </div>
                            <div>
                                <span>网络状态：</span>
                                <span>{{
                                    networkInfo.signalType || "--"
                                }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="content-box">
                        <div class="big-title">录像状态</div>
                        <div
                            class="time-title"
                            v-if="videoRecordStatus.updateTime"
                        >
                            {{ videoRecordStatus.updateTime }}更新
                        </div>
                        <div class="form-box">
                            <div>
                                <span>录像状态：</span>
                                <span>
                                    {{
                                        statusObj[videoRecordStatus.status] ||
                                        "--"
                                    }}
                                </span>
                            </div>
                            <div>
                                <span>灾备录像状态：</span>
                                <span>
                                    {{
                                        statusObj[
                                            videoRecordStatus.boxStatus
                                        ] || "--"
                                    }}</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content-box">
                    <div class="big-title">上下线状态</div>
                    <div class="time-title" v-if="deviceOnlineInfo.updateTime">
                        {{ deviceOnlineInfo.updateTime }}更新
                    </div>
                    <div class="form-box">
                        <div>
                            <span>最后上线时间：</span>
                            <span class="online-time">
                                {{ deviceOnlineInfo.onlineTime || "--" }}
                            </span>
                        </div>
                        <div>
                            <span>最后下线时间：</span>
                            <span class="online-time">
                                {{ deviceOnlineInfo.offlineTime || "--" }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="content-box">
                    <div class="big-title">定位状态</div>
                    <div class="time-title" v-if="locationInfo.gpsStatusTime">
                        {{ locationInfo.gpsStatusTime }}更新
                    </div>
                    <div class="form-box">
                        <div>
                            <span>定位状态：</span>
                            <span>{{
                                statusObj[locationInfo.gpsStatus] || "--"
                            }}</span>
                        </div>
                        <div>
                            <span>定位方式：</span>
                            <span>{{
                                gpsTypeObj[locationInfo.gpsType] || "--"
                            }}</span>
                        </div>
                        <div>
                            <span>精度因子：</span>
                            <span>{{
                                locationInfo.gpsPrecisionFactor || "--"
                            }}</span>
                        </div>
                        <div>
                            <span>可用卫星数：</span>
                            <span>{{
                                locationInfo.gnssSatellitesNum || "--"
                            }}</span>
                        </div>
                        <div>
                            <span>最强4颗卫星信噪比：</span>
                            <span>{{ locationInfo.gpsHss || "--" }}</span>
                        </div>
                        <div>
                            <span>其他异常：</span>
                            <span>{{
                                (locationInfo.link != null ||
                                    locationInfo.link != undefined) &&
                                locationInfo.link != 2
                                    ? "天线" + links[Number(locationInfo.link)]
                                    : "无"
                            }}</span>
                        </div>
                    </div>
                </div>
                <div class="content-box">
                    <div class="big-title">架设状态</div>
                    <div class="time-title" v-if="algInfo.algStatusUpdateTime">
                        {{ algInfo.algStatusUpdateTime }}更新
                    </div>
                    <div class="form-box">
                        <div>
                            <span>ADAS架设状态：</span>
                            <span :title="algInfo.adasAlgStatusDesc">
                                {{ algInfo.adasAlgStatusDesc || "--" }}
                            </span>
                        </div>
                        <div>
                            <span>DSM架设状态：</span>
                            <span :title="algInfo.dbaAlgStatusDesc">
                                {{ algInfo.dbaAlgStatusDesc || "--" }}
                            </span>
                        </div>
                        <div>
                            <span>WHD架设状态：</span>
                            <span :title="algInfo.whdAlgStatusDesc">
                                {{ algInfo.whdAlgStatusDesc || "--" }}
                            </span>
                        </div>
                        <div>
                            <span>BSD架设状态：</span>
                        </div>
                        <p>
                            <span>前：</span>
                            <span :title="algInfo.frontBsdStatusDesc">
                                {{ algInfo.frontBsdStatusDesc || "--" }}
                            </span>
                        </p>
                        <p>
                            <span>后：</span>
                            <span :title="algInfo.backBsdStatusDesc">
                                {{ algInfo.backBsdStatusDesc || "--" }}
                            </span>
                        </p>
                        <p>
                            <span>左：</span>
                            <span :title="algInfo.leftBsdStatusDesc">
                                {{ algInfo.leftBsdStatusDesc || "--" }}
                            </span>
                        </p>
                        <p>
                            <span>右：</span>
                            <span :title="algInfo.rightBsdStatusDesc">
                                {{ algInfo.rightBsdStatusDesc || "--" }}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="multicenter">
                <div class="content-box">
                    <div class="big-title">多中心连接状态</div>
                    <div
                        class="time-title"
                        v-if="devicePlatformInfo.updateTime"
                    >
                        {{ devicePlatformInfo.updateTime }}更新
                    </div>
                    <el-table
                        :data="devicePlatformInfo.platformInfo"
                        :height="215"
                    >
                        <el-table-column label="中心名称">
                            <template slot-scope="scope">
                                <span
                                    >第{{
                                        scope.row.platformOrder + 1
                                    }}中心</span
                                >
                            </template>
                        </el-table-column>
                        <el-table-column label="使能">
                            <template slot-scope="scope">
                                <el-switch
                                    disabled
                                    :active-value="Number(1)"
                                    :inactive-value="Number(0)"
                                    v-model="scope.row.enable"
                                >
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ip" label="连接地址">
                        </el-table-column>
                        <el-table-column prop="port" label="连接端口">
                        </el-table-column>
                        <el-table-column label="连接状态">
                            <template slot-scope="scope">
                                <span>{{
                                    scope.row.status === 1 ? "未连接" : "已连接"
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="离线原因" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{ scope.row.offlineReason }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template>
                                <el-button
                                    type="text"
                                    v-if="detailData.deviceStatus == 1"
                                    @click="goCenterSetting()"
                                >
                                    编辑
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <div class="right-box">
            <div class="content-box">
                <div class="big-title">设备信息</div>
                <div class="form-box">
                    <div>
                        <span>车牌号：</span>
                        <span>{{ equipmentDeviceInfo.plateNum || "--" }}</span>
                    </div>
                    <div>
                        <span>VIN：</span>
                        <span>{{ equipmentDeviceInfo.vin || "--" }}</span>
                    </div>
                    <div>
                        <span>设备序列号：</span>
                        <span>{{
                            equipmentDeviceInfo.deviceSerialNum || "--"
                        }}</span>
                    </div>
                    <div>
                        <span>终端手机号：</span>
                        <span>{{
                            equipmentDeviceInfo.deviceCode || "--"
                        }}</span>
                    </div>
                    <div>
                        <span>设备型号：</span>
                        <span>{{
                            equipmentDeviceInfo.deviceModelCode || "--"
                        }}</span>
                    </div>
                    <div>
                        <span>接入协议：</span>
                        <span>{{
                            equipmentDeviceInfo.protocolName || "--"
                        }}</span>
                    </div>
                    <div>
                        <span>版本号：</span>
                        <span>{{
                            equipmentDeviceInfo.deviceVersion || "--"
                        }}</span>
                    </div>
                    <div>
                        <span>ICCID：</span>
                        <span>{{ equipmentDeviceInfo.iccId || "--" }}</span>
                    </div>
                    <div>
                        <span>安装服务商：</span>
                        <span>{{
                            equipmentDeviceInfo.installServiceProvider || "--"
                        }}</span>
                    </div>
                    <div>
                        <span>设备厂商：</span>
                        <span>{{
                            equipmentDeviceInfo.manufacturerNameString || "--"
                        }}</span>
                    </div>
                </div>
            </div>
            <div class="content-box">
                <div class="big-title">外设信息</div>
                <div
                    class="form-box outDevVer"
                    v-if="
                        equipmentDeviceInfo &&
                        equipmentDeviceInfo.devResourceVer &&
                        equipmentDeviceInfo.devResourceVer.outDevVer &&
                        equipmentDeviceInfo.devResourceVer.outDevVer.length
                    "
                >
                    <div
                        v-for="(item, index) in equipmentDeviceInfo
                            .devResourceVer.outDevVer"
                        :key="index"
                    >
                        <div>
                            <span>外设类型：</span>
                            <span :title="item.outDevType">
                                {{ item.outDevType || "--" }}
                            </span>
                        </div>
                        <div>
                            <span>外设名称： </span>
                            <span :title="item.outDevName">
                                {{ item.outDevName || "--" }}
                            </span>
                        </div>
                        <div>
                            <span> 外设版本： </span>
                            <span :title="item.outDevVersion">
                                {{ item.outDevVersion || "--" }}
                            </span>
                        </div>
                    </div>
                </div>
                <el-empty
                    v-else
                    :image="emptyImage"
                    :image-size="56"
                    :description="'暂无数据'"
                ></el-empty>
            </div>
            <div class="content-box">
                <div class="big-title">版本信息</div>
                <div
                    class="form-box"
                    v-if="
                        equipmentDeviceInfo &&
                        equipmentDeviceInfo.devResourceVer
                    "
                >
                    <div
                        v-for="(
                            val, key, index
                        ) in equipmentDeviceInfo.devResourceVer"
                        :key="index"
                        v-show="key !== 'outDevVer'"
                    >
                        <span>
                            {{
                                key === "powerMcuVer"
                                    ? "电源板MCU版本"
                                    : key.replace("Ver", "版本").toUpperCase()
                            }}：
                        </span>
                        <span>{{ val }}</span>
                    </div>
                </div>
                <el-empty
                    v-else
                    :image="emptyImage"
                    :image-size="56"
                    :description="'暂无数据'"
                ></el-empty>
            </div>
        </div>
        <el-dialog
            title="格式化记录"
            :visible.sync="formatRecordVisible"
            append-to-body
            :width="'960px'"
        >
            <el-table
                stripe
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                :data="formatLogData"
                :height="500"
                border
            >
                <el-table-column
                    prop="hddName"
                    label="存储介质"
                ></el-table-column>
                <el-table-column prop="createTime" label="操作时间">
                    <template slot-scope="scope">
                        <span>{{
                            $moment(scope.row.createTime).format(
                                "YYYY-MM-DD HH:mm:ss"
                            )
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="operateUserName"
                    label="操作人员"
                ></el-table-column>
                <el-table-column
                    prop="operateIp"
                    label="操作人IP"
                ></el-table-column>
                <el-table-column prop="result" label="操作结果">
                    <template slot-scope="scope"
                        ><div class="status-box">
                            <span v-if="scope.row.result === 1"
                                ><i class="status-1"></i>成功</span
                            >
                            <span v-if="scope.row.result === 2"
                                ><i class="status-2"></i>失败<span
                                    :title="scope.row.failReason"
                                    >({{ scope.row.failReason }})</span
                                ></span
                            >
                            <span v-if="scope.row.result === 3"
                                ><i class="status-3"></i>
                                <span v-if="isApi"> 已下发 </span>
                                <span v-else>
                                    进行中({{ scope.row.schedule || 0 }}%)
                                </span>
                            </span>
                            <span v-if="scope.row.result === 0"
                                ><i class="status-0"></i>未开始</span
                            >
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="pageSizeChange"
                @current-change="pageChange"
                :current-page="formatLogParams.currentPage"
                :page-sizes="[20, 50, 100]"
                :page-size="formatLogParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="formatLogTotal"
            >
            </el-pagination>
        </el-dialog>
    </div>
</template>
<script>
import timeLine from "./timeLine.vue";
import signal from "@/views/maintenanceCenter/historyPlaybackFile/vue/signal.vue";
export default {
    name: "",
    components: { timeLine, signal },
    props: {
        detailData: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            emptyImage: require("@/assets/images/icon_empty.png"),
            situation: {},
            statusObj: {
                0: "异常",
                1: "正常",
                2: "不支持",
            },
            gpsTypeObj: {
                1: "单GPS",
                2: "单BD",
                3: "双模（GPS+BD）",
            },
            links: ["短路", "检测状态--", "正常", "开路"],
            storageStatusObj: {
                updateTime: "",
                hddVoList: [],
            },
            videoInfo: {
                lostVideoChannelStatusTime: "",
                videoChannelStatus: [],
            },
            networkInfo: {},
            videoRecordStatus: {},
            deviceOnlineInfo: {},
            locationInfo: {},
            algInfo: {},
            devicePlatformInfo: {
                updateTime: "",
                platformInfo: [],
            },
            equipmentDeviceInfo: {},
            //格式化记录
            formatRecordVisible: false,
            searchLoading: false,
            formatLogParams: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "createTime", //排序列
                orderDir: "desc", //排序方向
                deviceCode: this.detailData.deviceCode,
            },
            formatLogData: [],
            formatLogTotal: 0,
            isApi: false,
        };
    },
    mounted() {
        this.init();
    },
    computed: {},
    watch: {
        formatLogParams: {
            handler(val) {
                this.equipmentInspectionFormatLog();
            },
            deep: true,
        },
        "$store.state.app.sdFormatSchedule": {
            handler(val) {
                if (
                    this.storageStatusObj &&
                    this.storageStatusObj.hddVoList &&
                    this.storageStatusObj.hddVoList.length
                ) {
                    if (this.detailData.deviceCode == val.deviceCode) {
                        val.hddVoList.forEach((item) => {
                            this.storageStatusObj.hddVoList.map((k) => {
                                if (k.hddName === item.hddName) {
                                    k.capacity = item.capacity;
                                    k.hddStatus = item.hddStatus;
                                    k.sdFormatSchedule = item.sdFormatSchedule;
                                    this.$forceUpdate();
                                }
                            });
                        });
                    }
                }
            },
            deep: true,
        },
    },
    methods: {
        init() {
            this.equipmentInspectionSituation();
            this.equipmentInspectionStorageStatus();
            this.equipmentInspectionVideoInfo();
            this.equipmentInspectionNetworkInfo();
            this.newEquipmentInspectionDeviceOnlineInfo();
            this.equipmentInspectionLocationInfo();
            this.equipmentInspectionAlgInfo();
            this.equipmentInspectionDevicePlatformInfo();
            this.equipmentInspectionGetEquipmentDeviceInfo();
            this.equipmentInspectionVideoRecordStatus();
            this.formatCapacity();
        },
        //设备概览
        formatCapacity() {
            this.$api
                .formatCapacity({
                    deviceCode: this.detailData.deviceCode,
                })
                .then((res) => {
                    this.isApi = !res.data;
                });
        },
        //设备概览
        equipmentInspectionSituation() {
            this.$api
                .equipmentInspectionSituation({
                    deviceId: this.detailData.id,
                    startTime: this.$moment()
                        .subtract(1, "days")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    endTime: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
                })
                .then((res) => {
                    if (res.success == true) {
                        this.situation = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        //存储状态
        equipmentInspectionStorageStatus() {
            this.$api
                .equipmentInspectionStorageStatus({
                    deviceId: this.detailData.id,
                })
                .then((res) => {
                    if (res.success == true) {
                        if (res.data) {
                            this.storageStatusObj = {
                                updateTime: res.data.updateTime,
                                hddVoList: res.data.hddVoList || [],
                            };
                        }
                    } else {
                        // this.$message.error(res.msg);
                    }
                });
        },
        //视频状态
        equipmentInspectionVideoInfo() {
            this.$api
                .equipmentInspectionVideoInfo({
                    deviceId: this.detailData.id,
                })
                .then((res) => {
                    if (res.success == true) {
                        if (res.data) {
                            this.videoInfo = {
                                lostVideoChannelStatusTime:
                                    res.data.lostVideoChannelStatusTime,
                                videoChannelStatus:
                                    res.data.videoChannelStatus || [],
                            };
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        //网络信号
        equipmentInspectionNetworkInfo() {
            this.$api
                .equipmentInspectionNetworkInfo({
                    deviceId: this.detailData.id,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.networkInfo = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        //录像及灾备状态
        equipmentInspectionVideoRecordStatus() {
            this.$api
                .equipmentInspectionVideoRecordStatus({
                    deviceId: this.detailData.id,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.videoRecordStatus = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        //设备上下线状态
        newEquipmentInspectionDeviceOnlineInfo() {
            this.$api
                .newEquipmentInspectionDeviceOnlineInfo({
                    deviceId: this.detailData.id,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.deviceOnlineInfo = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        //定位状态
        equipmentInspectionLocationInfo() {
            this.$api
                .equipmentInspectionLocationInfo({
                    deviceId: this.detailData.id,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.locationInfo = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        //架设状态
        equipmentInspectionAlgInfo() {
            this.$api
                .equipmentInspectionAlgInfo({
                    deviceId: this.detailData.id,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.algInfo = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        //多中心连接状态
        equipmentInspectionDevicePlatformInfo() {
            this.$api
                .equipmentInspectionDevicePlatformInfo({
                    deviceId: this.detailData.id,
                })
                .then((res) => {
                    if (res.success == true) {
                        if (res.data) {
                            this.devicePlatformInfo = {
                                updateTime: res.data.updateTime,
                                platformInfo: res.data.platformInfo || [],
                            };
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        //设备信息及版本信息显示
        equipmentInspectionGetEquipmentDeviceInfo() {
            this.$api
                .equipmentInspectionGetEquipmentDeviceInfo({
                    deviceId: this.detailData.id,
                })
                .then((res) => {
                    if (res.success == true) {
                        if (res.data) {
                            this.equipmentDeviceInfo = res.data;
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        //存储状态--格式化
        formatting(data) {
            this.$confirm(`确定格式化${data.hddName}吗？`, {
                confirmButtonText: "格式化",
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
            })
                .then(() => {
                    this.$api
                        .equipmentInspectionFormatHdd({
                            deviceCode: this.detailData.deviceCode,
                            productKey: this.detailData.productKey,
                            hddName: data.hddName,
                            harddiskID: data.id,
                            password: data.password,
                        })
                        .then((res) => {
                            if (res.success == true) {
                                this.$message.success(`格式化指令下发成功`);
                                this.equipmentInspectionStorageStatus();
                            } else {
                                this.$message.error(
                                    "格式化指令下发失败：" + res.msg
                                );
                            }
                        });
                })
                .catch(() => {});
        },
        //多中心连接状态----操作
        goCenterSetting() {
            let params = {
                deviceId: this.detailData.id,
            };
            this.$api.getDeviceConfigParamWay(params).then((res) => {
                if (res && res.data) {
                    this.$api
                        .getDeviceEHomeCapacity({
                            deviceId: this.detailData.id,
                            param: "",
                            msgId: 4401,
                        })
                        .then((res2) => {
                            if (res2 && res2.data && res2.data.param) {
                                this.$router.push({
                                    path: "/maintenanceCenter/deviceConfiguration/protocolConfiguration",
                                    query: {
                                        deviceModelCode:
                                            this.detailData.deviceModelCode,
                                        productKey: this.detailData.productKey,
                                        organizeId: this.detailData.organizeId,
                                        deviceId: this.detailData.id,
                                        carList: JSON.stringify([
                                            this.detailData,
                                        ]),
                                        multicenter: true,
                                    },
                                });
                            } else {
                                this.$router.push({
                                    path: "/maintenanceCenter/deviceConfiguration/configurationDetail/agreementIndex",
                                    query: {
                                        deviceId: this.detailData.id,
                                        deviceCode: this.detailData.deviceCode,
                                        organizeId: this.detailData.organizeId,
                                        multicenter: true,
                                    },
                                });
                            }
                        });
                } else {
                    this.$router.push({
                        path: "/maintenanceCenter/deviceConfiguration/configurationDetail/agreementIndex",
                        query: {
                            deviceId: this.detailData.id,
                            deviceCode: this.detailData.deviceCode,
                            organizeId: this.detailData.organizeId,
                            multicenter: true,
                        },
                    });
                }
            });
        },
        //格式化记录
        openFormatRecord() {
            this.formatRecordVisible = true;
            this.listData = [];
            this.total = 0;
            this.formatLogParams = {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "createTime", //排序列
                orderDir: "desc", //排序方向
                deviceCode: this.detailData.deviceCode,
            };
            this.equipmentInspectionFormatLog();
        },
        equipmentInspectionFormatLog() {
            this.searchLoading = true;
            this.$api
                .equipmentInspectionFormatLog(this.formatLogParams)
                .then((res) => {
                    if (res.success == true) {
                        this.formatLogData = res.data.results;
                        this.formatLogTotal = res.data.totalRecords;
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.searchLoading = false;
                });
        },
        pageChange(page) {
            this.formatLogParams.currentPage = page;
        },
        pageSizeChange(limit) {
            this.formatLogParams.pageSize = limit;
        },
    },
};
</script>
<style lang="less" scoped>
@import "./../boxless.less";
.muted {
    background: rgba(0, 0, 0, 0.54);
}
.success {
    background: #52c41a;
}
.error {
    background: #ff4d4f;
}
.first-content {
    display: flex;
    padding-bottom: 24px;
    .left-box {
        width: calc(~"100% - 424px");
    }
    .content-box {
        border: 1px solid #bababa;
        border-radius: 6px;
        position: relative;
        padding: 24px;
        .big-title {
            padding: 0px 12px;
            font-size: 14px;
            position: absolute;
            text-align: center;
            line-height: 20px;
            height: 20px;
            top: -10px;
            left: 12px;
            background: #ffffff;
            font-weight: bold;
        }
        .btn-title {
            padding: 0px 12px;
            font-size: 12px;
            position: absolute;
            text-align: center;
            line-height: 20px;
            height: 20px;
            top: -10px;
            left: 120px;
            background: #ffffff;
            color: #2196f3;
            cursor: pointer;
        }
        .time-title {
            padding: 0px 12px;
            font-size: 12px;
            position: absolute;
            text-align: center;
            line-height: 20px;
            height: 20px;
            top: -10px;
            right: 24px;
            background: #ffffff;
        }
        .status-enumeration {
            display: flex;
            align-items: center;
            i {
                width: 8px;
                height: 8px;
                display: inline-block;
                border-radius: 50%;
                margin-right: 8px;
            }
        }
    }
    .equipment-overview {
        height: 160px;
        .status-list {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            .small-box {
                width: calc(~"(100% - 120px) / 5");
                // width: 193px;
                margin-bottom: 0px;
            }
        }
    }
    .status-table {
        margin-top: 24px;
        display: flex;
        justify-content: space-between;
        & > div {
            width: calc(~"(100% - 24px) / 2");
            // width: 588px;
        }
    }
    .status-form {
        margin-top: 24px;
        display: flex;
        justify-content: space-between;
        .big-title {
            left: 12px;
        }
        .time-title {
            right: 12px;
        }
        & > div {
            width: calc(~"(100% - 72px) / 4");
            // width: 282px;
            height: 254px;
        }
    }
    .form-box {
        & > div {
            margin-bottom: 12px;
            display: flex;
            &:last-of-type {
                margin-bottom: 0;
            }
            span:nth-child(1) {
                font-size: 14px;
                font-weight: bold;
            }
            span:nth-child(2) {
                flex: 1;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .online-time {
                font-size: 12px;
                line-height: 21px;
            }
        }
        &.outDevVer {
            & > div {
                border-bottom: 1px dashed #979797;
                flex-direction: column;
                &:last-of-type {
                    border-bottom: none;
                }
                & > div {
                    margin-bottom: 12px;
                }
            }
        }
        & > p {
            margin-top: 3px;
        }
    }
    .multicenter {
        margin-top: 24px;
        display: flex;
        & > div {
            width: 100%;
        }
    }
    .right-box {
        width: 400px;
        margin-left: 24px;
        .content-box {
            .form-box {
                height: 100%;
                overflow-y: auto;
            }
            &:not(:last-child) {
                margin-bottom: 24px;
            }
            // width: 100%;
            &:nth-child(1) {
                height: 449px;
            }
            &:nth-child(2) {
                height: 254px;
            }
            &:nth-child(3) {
                height: 265px;
            }
        }
    }
    .left-box {
        .double-layer {
            .content-box {
                height: 115px;
                &:not(:last-child) {
                    margin-bottom: 24px;
                }
            }
        }
    }
}
@media screen and (max-width: 1500px) {
    .first-content {
        // color: red;
        flex-direction: column;
        .left-box {
            width: 100%;
        }
        .right-box {
            margin-top: 24px;
            margin-left: 0px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            .content-box {
                width: calc(~"(100% - 48px) / 3");
                // width: 384px;
                height: auto !important;
                margin-bottom: 0px !important;
            }
        }
    }
}
.status-box {
    display: flex;
    align-items: center;
    white-space: nowrap;
    span {
        display: flex;
        align-items: center;
        span {
            display: inline-block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 120px;
        }
    }
    i {
        display: block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 8px;
    }
    .status-0 {
        background: #cccccc;
    }
    .status-1 {
        background: #77ca67;
    }
    .status-2 {
        background: #ff7777;
    }
    .status-3 {
        background: #ff952c;
    }
}
.formatting {
    color: rgba(0, 0, 0, 0.7);
}
</style>
<style lang="less">
.first-content {
    .el-table__empty-block {
        min-height: 180px;
        height: 180px !important;
        .el-table__empty-text {
            height: 180px !important;
            background: url(/static/images/icon_empty.png) no-repeat center
                center;
        }
    }
}
</style>
