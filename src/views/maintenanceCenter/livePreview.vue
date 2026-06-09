<template>
    <div class="live-preview">
        <div
            class="left-content"
            :class="isShowTree ? 'isShowTree' : 'isHideTree'"
        >
            <div ref="selectTree" class="car-select">
                <G-DeviceSearch
                    :valueKey="'deviceCode'"
                    :value.sync="searchForm.deviceCode"
                    :selectObj.sync="searchForm.selectObj"
                    :showDeviceStatus="true"
                    @showOption="showOption"
                ></G-DeviceSearch>
            </div>
            <div v-if="deviceInfo.channelList && deviceInfo.channelList.length">
                <p>
                    <!-- 请选择车辆通道后点击查询进行预览 -->
                    {{ $t("livePreview.selectVehicleChannel") }}
                </p>
                <el-radio-group v-model="channelCheckObj" ref="radio">
                    <el-radio
                        :label="item.channelNum"
                        :key="item.id"
                        v-for="item in deviceInfo.channelList"
                        >{{ item.channelName }}</el-radio
                    >
                </el-radio-group>
                <el-button
                    :disabled="loading"
                    size="medium"
                    type="primary"
                    @click="startPreView()"
                    class="button-div m-t"
                    :loading="loading"
                >
                    <!-- 播放 -->
                    {{ $t("videoPlayback.play") }}
                </el-button>
            </div>
            <div class="btn" @click="changeShowTree()">
                <i
                    :class="
                        isShowTree
                            ? 'el-icon-arrow-left'
                            : 'el-icon-arrow-right'
                    "
                ></i>
            </div>
        </div>
        <div
            class="live-preview-mode"
            v-show="isVideoPreview"
            :class="isShowTree ? 'isShowTable' : 'isHideTable'"
        >
            <div class="preview-title text-left">
                <span class="flex-layout flex-between" style="width: 100%">
                    <div>
                        <span class="inline m-x-md text-left text">
                            <!-- 预览画面 -->
                            {{ $t("livePreview.previewMonitor") }}
                        </span>
                        <!-- <span>车牌号 {{ previewCarNum }}</span> -->
                    </div>
                    <div class="m-r-lg">
                        <span
                            style="font-size: 10px"
                            v-if="!nonePlayControlSuitable"
                            >（
                            <!-- 当前无插件模式不适用 -->
                            {{ $t("livePreview.pluginModeNotApplicable") }}
                            <!-- content="原因：浏览器非谷歌浏览器，或者版本较低，请下载新版谷歌浏览器" -->
                            <el-tooltip
                                class="item"
                                effect="light"
                                :content="$t('livePreview.reasonGoogle')"
                                placement="top"
                            >
                                <i
                                    class="el-icon-question"
                                    style="font-size: 14px"
                                ></i> </el-tooltip
                            >）</span
                        >
                        <span>
                            <!-- 控件模式 -->
                            {{ $t("livePreview.controlPattern") }}
                        </span>
                        <el-switch
                            @change="changeControl"
                            :disabled="!nonePlayControlSuitable"
                            v-model="showControl"
                            active-color="#13ce66"
                            class="m-l-xs"
                        ></el-switch>
                    </div>
                </span>
                <!-- <span @click="closeWindow" class="text-inline close-pre-window">
                    <i class="el-icon el-icon-close text-white"></i>
                </span> -->
            </div>
            <div v-loading="loading" class="previewContent">
                <div
                    id="playControlNone"
                    class="video-preview-content"
                    v-show="!showControl"
                ></div>
                <div
                    id="playControlHave"
                    class="video-preview-content-control"
                    v-show="showControl"
                ></div>
                <div class="totalControl" v-show="!showControl">
                    <div
                        class="flex-layout flex-middle flex-end control-box"
                        style="height: 100%"
                    >
                        <!-- <div
                            class="stream pointer m-r-xs"
                            @click="toggleStreamType"
                        >
                            <span
                                :title="streamType ? '切换高清' : '切换标清'"
                                >{{ streamType ? "标清" : "高清" }}</span
                            >
                        </div> -->
                        <el-popover
                            ref="popover-coverPreview"
                            placement="top"
                            trigger="click"
                            popper-class="previewPopover pointer"
                        >
                            <!-- <div class="p-a-xs item-class" @click="toggleCoverType(0)">原始比例</div> -->
                            <div
                                class="p-a-xs item-class"
                                @click="toggleCoverType(1)"
                            >
                                4:3
                            </div>
                            <div
                                class="p-a-xs item-class"
                                @click="toggleCoverType(2)"
                            >
                                16:9
                            </div>
                            <div
                                class="p-a-xs item-class"
                                @click="toggleCoverType(3)"
                            >
                                <!-- 铺满 -->
                                {{ $t("videoPlayback.cover") }}
                            </div>
                        </el-popover>
                        <div
                            class="stream pointer"
                            v-popover:popover-coverPreview
                        >
                            <span
                                style="
                                    width: 40px;
                                    display: inline-block !important;
                                "
                                >{{
                                    coverTypeList[settingForm.coverType]
                                }}</span
                            >
                            <i class="el-icon-arrow-down"></i>
                        </div>
                        <el-popover
                            ref="popover-videoPreview"
                            placement="top"
                            trigger="click"
                            @hide="saveSetting"
                        >
                            <div class="m-b">
                                <!-- 参数配置 -->
                                {{ $t("videoPlayback.parameterConfiguration") }}
                            </div>
                            <div>
                                <el-form label-width="8rem">
                                    <!-- 倒计时时间（秒） -->
                                    <el-form-item
                                        :label="
                                            $t('livePreview.countdownTime') +
                                            '：'
                                        "
                                    >
                                        <G-Number-input
                                            :placeholder="$t('common.input')"
                                            :nautical="$t('common.sec')"
                                            width="76px"
                                            notNull
                                            v-model="settingForm.lastTime"
                                            :formDataList="[
                                                settingForm,
                                                'lastTime',
                                                86400,
                                                60,
                                            ]"
                                        >
                                        </G-Number-input>
                                    </el-form-item>
                                    <!-- 字幕默认位置 -->
                                    <el-form-item
                                        :label="
                                            $t(
                                                'videoPlayback.defaultSubtitlePosition'
                                            ) + '：'
                                        "
                                    >
                                        <el-select
                                            v-model="settingForm.textPosition"
                                            style="width: 76px"
                                        >
                                            <!-- 右上 -->
                                            <el-option
                                                :value="0"
                                                :label="
                                                    $t('videoPlayback.rightUp')
                                                "
                                            ></el-option>
                                            <!-- 右中 -->
                                            <el-option
                                                :value="1"
                                                :label="
                                                    $t('videoPlayback.rightMid')
                                                "
                                            ></el-option>
                                            <!-- 右下 -->
                                            <el-option
                                                :value="2"
                                                :label="
                                                    $t('videoPlayback.rightLow')
                                                "
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-popover>
                        <!-- 设置 -->
                        <img
                            src="/static/images/control/setting-black.svg"
                            v-popover:popover-videoPreview
                            :title="$t('videoPlayback.setUp')"
                        />
                        <!-- <div class="voice-class">
                        <el-slider v-model="settingForm.voice" vertical size="mini" height="80px" v-if="showVoice"
                            @change="changeVoice"></el-slider>
                        <img src="/static/images/control/voice-black.svg" title="音量" @click="showVoice = !showVoice" />
                    </div> -->
                        <!-- <img
                            src="/static/images/control/carmera-black.svg"
                            title="抓图"
                            @click="captureAll"
                        />
                        <img
                            src="/static/images/control/bigger-black.svg"
                            title="全屏"
                            @click="fullScreen"
                        /> -->
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            append-to-body
            width="450px"
            title=""
            :visible.sync="awakenVisible"
            :custom-class="'awaken-dialog'"
        >
            <div class="awaken-dialog">
                <i class="el-icon-warning"></i>
                <div class="right-box">
                    <div class="title-box m-b">
                        <p>
                            <!-- 确定要唤醒设备吗？ -->
                            {{ $t("videoPlayback.wakeUpDeviceNow") }}？
                        </p>
                        <p>
                            <!-- 当前车辆ACC关，下发唤醒指令会导致电源电量过度消耗，可能会导致车辆无法启动,是否继续唤醒？ -->
                            {{ $t("videoPlayback.wakeUpDeviceNowText") }}？
                        </p>
                    </div>
                    <el-form>
                        <!-- 唤醒时长 -->
                        <el-form-item
                            :label="$t('videoPlayback.awakenTime') + '：'"
                        >
                            <el-input-number
                                v-model="awakenTime"
                                :min="1"
                                :max="999"
                            ></el-input-number>
                            <!-- 分钟 -->
                            {{ $t("videoPlayback.minute") }}
                            <span class="tip-msg">
                                <!-- 请输入唤醒时长（1-999分钟） -->
                                {{ $t("videoPlayback.awakenTimePlaceholder") }}
                            </span>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer">
                <el-button @click="awakenVisible = false">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button
                    @click="awakenDevice"
                    :loading="loading"
                    type="primary"
                >
                    <!-- 唤醒 -->
                    {{ $t("videoPlayback.awaken") }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import JSPlugin_P from "../../components/webControlService/JSPlugin/JSPlugin_P";
import { debounce } from "@/utils/controlFn.js";
export default {
    name: "videoPreview",
    props: {
        // previewCarNum: {
        //     default: "",
        // },
        // videoPreviewDeviceCode: {
        //     type: [Number, String],
        //     default: "",
        // },
        deviceStatus: {
            default: "",
        },
        // deviceCode: {
        //     type: String,
        //     default: "",
        // },
    },
    model: {
        prop: "isVideoPreview",
        event: "changeVideoPreview",
    },
    data() {
        return {
            awakenVisible: false,
            awakenTime: 0,
            awakenDeviceId: "",
            previewCarNum: "",
            videoPreviewDeviceCode: "",
            isVideoPreview: false,
            coverTypeList: {
                0: this.$t("videoPlayback.original"), //"原始",
                1: "4:3",
                2: "16:9",
                3: this.$t("videoPlayback.cover"), // "铺满",
            },
            playControlNone: null,
            playControlHave: {},
            loading: false,
            streamType: 1,
            settingForm: {
                lastTime: 180,
                textPosition: 0,
                coverType: 3,
                voice: 65,
            },
            showVoice: false,
            showControl: false,
            videoPreviewStyle: "",
            nonePlayControlSuitable: false,
            carType: 1,
            carLoading: false,
            searchForm: {
                carId: "",
                deviceCode: "",
                selectObj: {},
                plateArr: [],
                plateJson: {},
            },
            deviceInfo: {},
            channelCheckObj: "",
            isShowTree: true,
            loading: false,
            showOptionHeight: 0,
        };
    },
    computed: {
        isShowMenu() {
            return this.$store.getters.getIsShowMenu;
        },
        downLoadOpen() {
            return this.$store.state.configView.downLoadOpen;
        },
        menuIndex() {
            return this.$store.getters.getMenuIndex;
        },
        isShowUserInfo() {
            return this.$store.getters.getIsShowUserInfo;
        },
        isShowDownLoad() {
            return this.$store.getters.getIsShowDownLoad;
        },
    },
    watch: {
        isShowDownLoad(newValue) {
            if (
                !checkKeys(this.playControlHave) ||
                !this.showControl ||
                !this.isVideoPreview
            )
                return;
            if (newValue) {
                this.playControlHave.cuttingPartWindow(0, 0, 9999, 99999);
            } else {
                this.playControlHave.repairPartWindow(0, 0, 9999, 99999);
            }
        },
        isShowUserInfo(newValue) {
            if (
                !checkKeys(this.playControlHave) ||
                !this.showControl ||
                !this.isVideoPreview
            )
                return;
            let obj = document
                .getElementById("userInfo-popper")
                .getBoundingClientRect();
            if (newValue) {
                this.playControlHave.cuttingPartWindow(
                    obj.left - 445,
                    0,
                    obj.width + 3,
                    obj.height - 88
                );
            } else {
                this.playControlHave.repairPartWindow(
                    obj.left - 445,
                    0,
                    obj.width + 3,
                    obj.height - 88
                );
            }
        },
        isShowMenu(newValue) {
            if (
                !checkKeys(this.playControlHave) ||
                !this.showControl ||
                !this.isVideoPreview
            )
                return;
            let h =
                document.getElementById("menu-box" + this.menuIndex)
                    .offsetHeight -
                52 -
                17;
            if (newValue) {
                this.playControlHave.cuttingPartWindow(0, 0, 9999, h);
            } else {
                this.playControlHave.repairPartWindow(0, 0, 9999, h);
            }
        },
        downLoadOpen(newValue) {
            if (
                !checkKeys(this.playControlHave) ||
                !this.showControl ||
                !this.isVideoPreview
            )
                return;
            if (newValue) {
                this.playControlHave.hideWebOcx();
            } else {
                this.playControlHave.showWebOcx();
            }
        },
        deviceStatus(newValue, oldVal) {
            if (this.isVideoPreview && newValue == 1 && oldVal != 1) {
                checkKeys(this.playControlHave) &&
                    this.playControlHave.onlineNotify();
                this.playControlNone && this.playControlNone.onlineNotify();
                return;
            }
            if (this.isVideoPreview && newValue == 0 && oldVal != 0) {
                checkKeys(this.playControlHave) &&
                    this.playControlHave.offlineNotify();
                this.playControlNone && this.playControlNone.offlineNotify();
                return;
            }
        },
        videoPreviewDeviceCode(newVal) {
            if (!this.isVideoPreview || !newVal) {
                return;
            }
            checkKeys(this.playControlHave) &&
                this.playControlHave.stopAllPreview();
            this.playControlNone && this.playControlNone.stopRealPlayAll();
            // if (this.deviceStatus !== 1) {
            //     this.$message.warning("车辆休眠或下线");
            //     this.closeWindow();
            //     return;
            // }
        },
        "searchForm.carId": {
            handler(val) {
                if (!val && this.query && this.query.length < 3) {
                    this.searchForm.plateArr = [];
                    this.deviceInfo = {};
                    this.channelCheckObj = "";
                }
                this.searchForm.plateNum =
                    this.searchForm.plateJson[this.searchForm.carId] || "";
                if (val) {
                    this.videoPreviewDeviceCode = val;
                    this.getDeviceChannelList();
                }
            },
            deep: true,
        },
        "searchForm.deviceCode": {
            handler(val) {
                if (val) {
                    this.videoPreviewDeviceCode = val;
                    this.getDeviceChannelList();
                    this.searchForm.selectObj = {
                        ...this.searchForm.selectObj,
                        label: this.searchForm.selectObj.plateNum,
                    };
                    this.$store.dispatch(
                        "SetDefaultMaintenanceCar",
                        this.searchForm.selectObj
                    );
                } else {
                    this.deviceInfo = {};
                    this.channelCheckObj = "";
                    this.videoPreviewDeviceCode = "";
                }
            },
            deep: true,
        },
    },
    methods: {
        //唤醒
        awakenDevice() {
            this.loading = true;
            let params = {
                deviceId: this.awakenDeviceId,
                time: this.awakenTime,
            };
            this.$api
                .awakenDevice(params)
                .then((res) => {
                    if (res.success) {
                        this.loading = false;
                        this.awakenVisible = false;
                        // "已向设备下发唤醒指令，静待1分钟左右设备将重新上线！"
                        this.$message.success(
                            this.$t("videoPlayback.issueWakeupCommand")
                        );
                    } else {
                        this.loading = false;
                        // 下发唤醒失败！
                        this.$message.error(
                            this.$t("videoPlayback.wakeupFailed")
                        );
                    }
                })
                .catch((err) => {
                    this.loading = false;
                    // 下发唤醒失败！
                    this.$message.error(this.$t("videoPlayback.wakeupFailed"));
                });
        },
        resizeFunc() {
            if (this.showControl && checkKeys(this.playControlHave)) {
                this.playControlHave.reInitSize();
            } else if (!this.showControl && checkKeys(this.playControlNone)) {
                this.playControlNone.reInitSize();
            }
        },
        changeShowTree() {
            this.isShowTree = !this.isShowTree;
            this.$nextTick(() => {
                this.resizeFunc();
            });
        },
        changeVoice() {
            let control = this.playControlNone.activeControlList.find(
                (item) => {
                    return item.voiceState;
                }
            );
            if (control) {
                this.playControlNone.setVolume(
                    control.iWndNum,
                    this.settingForm.voice
                );
            }
            this.saveSetting();
        },
        toggleCoverType(type) {
            this.settingForm.coverType = type;
            this.$refs["popover-coverPreview"].doClose();
            this.playControlNone.updateCoverType(type);
            this.saveSetting();
        },
        async closeWindow() {
            this.showVoice = false;
            this.streamType = 1;
            this.playControlNone &&
                (await this.playControlNone.stopRealPlayAll());
            if (checkKeys(this.playControlHave)) {
                this.playControlHave.stopAllPreview();
                this.playControlHave.hideWebOcx();
            }
            this.$emit("changeVideoPreview", false);
        },
        saveSetting() {
            let temp = this.$deepCopy(this.settingForm);
            delete temp.coverType;
            delete temp.textPosition;
            localStorage.setItem("preViewSetting", JSON.stringify(temp));
            this.playControlNone.toggleTextPosition();
        },
        captureAll() {
            this.playControlNone.capturePictureAll();
        },
        fullScreen() {
            this.playControlNone.fullScreenDisplay(true);
        },
        toggleStreamType() {
            debounce(() => {
                this.streamType = this.streamType === 1 ? 0 : 1;
                this.playControlNone.toggleStreamTypeAll(this.streamType);
            }, 300);
        },
        getDeviceChannelList() {
            return new Promise((resovle) => {
                let obj = {
                    // carId: this.videoPreviewDeviceCode,
                    // abilityCode: "preview",
                    deviceCode: this.searchForm.deviceCode,
                };
                this.$api
                    .getDeviceInfoByCarId(obj)
                    .then((res) => {
                        if (res.success) {
                            this.deviceInfo = res.data;
                            let channelListTotal = res.data.channelList;
                            let channelList = channelListTotal.map(
                                ({ channelNum }) => {
                                    return channelNum;
                                }
                            );
                            let channelCount = channelList.length;
                            if (channelCount === 0) {
                                // 通道数为0，预览失败
                                this.$message.error(
                                    this.$t("livePreview.previewFailed")
                                );
                                return resovle(null);
                            }
                            this.$nextTick(() => {
                                this.$refs.radio.$children.forEach((item) => {
                                    item.$refs.radio.removeAttribute(
                                        "aria-hidden"
                                    );
                                });
                            });
                            let livePreviewItem = JSON.parse(
                                sessionStorage.getItem("livePreviewItem")
                            );
                            if (
                                livePreviewItem &&
                                channelListTotal &&
                                channelListTotal.length
                            ) {
                                this.channelCheckObj =
                                    livePreviewItem.channelNum > -1
                                        ? livePreviewItem.channelNum
                                        : channelListTotal[0].channelNum;
                                this.startPreView();
                            }
                            sessionStorage.removeItem("livePreviewItem");
                            resovle(res);
                        } else {
                            resovle(null);
                            this.$message.error(res.msg);
                        }
                    })
                    .catch(() => {
                        resovle(null);
                    });
            });
        },
        initChannelList() {
            let channelListTotal = this.deviceInfo.channelList.filter(
                (item) => {
                    return item.channelNum == this.channelCheckObj;
                }
            );
            let channelList = channelListTotal.map(({ channelNum }) => {
                return channelNum;
            });
            let channelNamelist = channelListTotal.map(
                ({ channelNum, channelName }) => {
                    return { channelNum, channelName };
                }
            );
            // if (this.showControl) {
            //     if (channelList.length > 8) {
            //         this.$message.info(
            //             '当前预览最多支持8路通道，可前往 "多屏预览"查看更多'
            //         );
            //         channelList = channelList.slice(0, 8);
            //     }
            // } else {
            //     if (channelList.length > 9) {
            //         this.$message.info(
            //             '当前预览最多支持9路通道，可前往 "多屏预览"查看更多'
            //         );
            //         channelList = channelList.slice(0, 9);
            //     }
            // }
            let deviceChannelList = {
                deviceId: this.deviceInfo.id,
                // deviceCode: deviceInfo.deviceCode,
                // productKey: deviceInfo.productKey,
                protocolType: 3,
                streamType: 1,
                channelList,
                channelNamelist,
                previewCarNum: this.searchForm.selectObj.plateNum,
                // carId: this.videoPreviewDeviceCode,
            };
            return deviceChannelList;
        },
        async startPreView() {
            if (!this.channelCheckObj) {
                // 请先选择车辆通道
                this.$message.error(
                    this.$t("livePreview.selectVehicleChannelFirst")
                );
                return;
            }
            if (
                this.deviceInfo.deviceStatus === 2 &&
                this.deviceInfo.dormantStatus != 2
            ) {
                this.awakenVisible = true;
                this.awakenTime = 0;
                this.awakenDeviceId = this.deviceInfo.id;
                return;
            }
            this.isVideoPreview = true;
            this.$nextTick(() => {
                if (!this.showControl) {
                    this.playControlNone &&
                        this.playControlNone.stopRealPlayAll();
                    if (!this.deviceInfo) {
                        return;
                    }
                    let deviceChannelList = this.initChannelList();
                    if (!this.playControlNone) {
                        this.playControlNone = new JSPlugin_P(
                            "playControlNone",
                            {},
                            deviceChannelList,
                            this.settingForm
                        );
                        this.playControlNone.playAll();
                    } else {
                        setTimeout(async () => {
                            await this.playControlNone.setDeviceChannelList(
                                deviceChannelList
                            );
                            this.playControlNone.playAll();
                        }, 200);
                    }
                } else {
                    if (!checkKeys(this.playControlHave)) {
                        this.initPlayControl()
                            .then(() => {
                                this.playControlHave.setPreviewLayout(
                                    this.videoPreviewDeviceCode,
                                    {
                                        playAll: true,
                                        plate: this.searchForm.selectObj
                                            .plateNum,
                                    },
                                    this.deviceInfo.id,
                                    this.channelCheckObj
                                );
                            })
                            .catch(() => {});
                    } else {
                        this.playControlHave.showWebOcx();
                        this.playControlHave.setPreviewLayout(
                            this.videoPreviewDeviceCode,
                            {
                                playAll: true,
                                plate: this.searchForm.selectObj.plateNum,
                            },
                            this.deviceInfo.id,
                            this.channelCheckObj
                        );
                    }
                }
            });
        },
        initPlayControl() {
            return new Promise((resolve, reject) => {
                this.playControlHave = new WebPreview(
                    "playControlHave",
                    (msg) => {
                        if (msg === "success") {
                            resolve();
                        } else {
                            reject();
                        }
                    }
                );
            });
        },
        // createIOption(deviceChannelList) {
        //     let baseOpition = {};
        //     let channelLength = deviceChannelList.channelList.length;
        //     if (channelLength === 1) {
        //         baseOpition.iCurrentSplit = 1;
        //     } else if (channelLength <= 4 && channelLength > 1) {
        //         baseOpition.iCurrentSplit = 2;
        //     } else if (channelLength > 4 && channelLength <= 9) {
        //         baseOpition.iCurrentSplit = 3;
        //     } else {
        //         baseOpition.iCurrentSplit = 4;
        //     }
        //     return baseOpition
        // },
        changeControl(showControl) {
            this.$nextTick(async () => {
                if (showControl) {
                    if (this.playControlNone) {
                        await this.playControlNone.stopRealPlayAll();
                    }
                    if (!checkKeys(this.playControlHave)) {
                        this.initPlayControl()
                            .then(() => {
                                this.playControlHave.setPreviewLayout(
                                    this.videoPreviewDeviceCode,
                                    {
                                        playAll: true,
                                        plate: this.searchForm.selectObj
                                            .plateNum,
                                    },
                                    this.deviceInfo.id,
                                    this.channelCheckObj
                                );
                            })
                            .catch(() => {});
                    } else {
                        this.playControlHave.showWebOcx();
                        this.playControlHave.setPreviewLayout(
                            this.videoPreviewDeviceCode,
                            {
                                playAll: true,
                                plate: this.searchForm.selectObj.plateNum,
                            },
                            this.deviceInfo.id,
                            this.channelCheckObj
                        );
                    }
                } else {
                    this.playControlHave.stopAllPreview();
                    this.playControlHave.hideWebOcx();
                    if (!this.deviceInfo) {
                        return;
                    }
                    let deviceChannelList = this.initChannelList();
                    if (!this.playControlNone) {
                        this.playControlNone = new JSPlugin_P(
                            "playControlNone",
                            {},
                            deviceChannelList,
                            this.settingForm
                        );
                        this.playControlNone.playAll();
                    } else {
                        await this.playControlNone.setDeviceChannelList(
                            deviceChannelList
                        );
                        this.playControlNone.playAll();
                    }
                }
            });
        },
        //下拉框收取
        visibleHandler() {
            this.currentPageCar = 1; //手机号页码
            this.totalPagesCar = "";
            this.searchForm.plateArr = [];
        },
        carTypeChange() {
            this.searchForm.carId = "";
        },
        remoteMethod(query) {
            this.query = query;
            if (query.length >= 3) {
                this.getPlateNumList(query);
            }
        },
        getPlateNumList(query) {
            this.carLoading = true;
            let params = {
                queryType: this.carType,
            };
            if (this.carType === 1) {
                params.plateNum = query;
            } else {
                params.vin = query;
            }
            this.$api.getVideoCarList(params).then((res) => {
                this.searchForm.plateArr = res.data.carList;
                if (this.searchForm.plateArr.length) {
                    res.data.carList.forEach((item) => {
                        this.searchForm.plateJson[item.id] = item.plateNum;
                    });
                }
                this.carLoading = false;
            });
        },
        showOption(h) {
            if (
                !checkKeys(this.playControlHave) ||
                !this.showControl ||
                !this.isVideoPreview
            )
                return;
            this.playControlHave.repairPartWindow(
                0,
                5,
                164,
                this.showOptionHeight
            );
            if (h > -1) {
                this.showOptionHeight = h + 1;
                this.playControlHave.cuttingPartWindow(
                    0,
                    5,
                    164,
                    this.showOptionHeight
                );
            } else {
                this.playControlHave.repairPartWindow(
                    0,
                    5,
                    164,
                    this.showOptionHeight
                );
            }
        },
        setDeault() {
            let livePreviewItem = JSON.parse(
                sessionStorage.getItem("livePreviewItem")
            );
            if (livePreviewItem) {
                setTimeout(() => {
                    this.searchForm.deviceCode = livePreviewItem.deviceCode;
                    // this.searchForm.plateArr = [
                    //     {
                    //         plateNum: livePreviewItem.plateNum,
                    //         id: livePreviewItem.carId,
                    //     },
                    // ];
                    this.searchForm.selectObj = {
                        ...livePreviewItem,
                        deviceId: livePreviewItem.id,
                        html: `<span>${
                            livePreviewItem.plateNum || "--"
                        }</span>；<span>${
                            livePreviewItem.deviceCode || "--"
                        }</span>；<span>${
                            livePreviewItem.deviceSerialNum || "--"
                        }</span>；<span>${livePreviewItem.vin || "--"}</span>`,
                        title: `${livePreviewItem.plateNum || "--"}；${
                            livePreviewItem.deviceCode || "--"
                        }；${livePreviewItem.deviceSerialNum || "--"}；${
                            livePreviewItem.vin || "--"
                        }`,
                    };
                }, 500);
            } else if (this.$store.state.tree.defaultMaintenanceCar) {
                let defaultMaintenanceCar = JSON.parse(
                    this.$store.state.tree.defaultMaintenanceCar
                );
                this.searchForm.deviceCode = defaultMaintenanceCar.deviceCode;
                this.searchForm.selectObj = defaultMaintenanceCar;
            }
        },
    },

    mounted() {
        let verson = JSPlugin_P.judgeSuitable();
        if (verson !== "Unkonwn") {
            let [type, ver] = verson.split(":");
            if (type === "Chrome" || type === "edge") {
                if (ver.split(".")[0] > 45) {
                    this.nonePlayControlSuitable = true;
                }
            }
        }
        if (!this.nonePlayControlSuitable) {
            this.showControl = true;
        }
        if (localStorage.getItem("preViewSetting")) {
            Object.assign(
                this.settingForm,
                JSON.parse(localStorage.getItem("preViewSetting"))
            );
        }
        this.isVideoPreview = true;
        this.$nextTick(() => {
            this.playControlNone = new JSPlugin_P(
                "playControlNone",
                {},
                [],
                this.settingForm
            );
        });
        window.addEventListener("resize", this.resizeFunc);
        this.setDeault();
    },
    beforeDestroy() {
        checkKeys(this.playControlHave) &&
            this.playControlHave.disconnectWebOcx();
        window.removeEventListener("resize", this.resizeFunc);
    },
};
</script>

<style lang="less" scoped>
.previewContent {
    height: calc(~"100% - 52px");
}

// .live-preview-mode {
//     width: 40%;
//     height: 100%;
// }
.isShowTable {
    width: calc(~"100% - 444px") !important;
}
.isHideTable {
    width: calc(~"100% - 1px") !important;
}
.preview-title {
    background: #4886ff;
    color: #fff;
    margin-bottom: 0;
    font-size: 14px;
    line-height: 52px;
    height: 52px;
    display: flex;
    justify-content: space-between;
}

.video-preview-content {
    width: 100%;
    height: calc(~"100% - 35px");
}

.video-preview-content-control {
    width: 100%;
    height: calc(~"100% - 0px");
}

.close-pre-window {
    display: inline-block;
    height: 100%;
    width: 20px;
    margin-right: 10px;
    cursor: pointer;
}

.totalControl {
    padding-right: 12px;
    height: 35px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    img {
        cursor: pointer;
        &:hover {
            background: rgba(22, 22, 22, 0.2);
        }
        box-sizing: content-box;
        padding: 3px;
        width: 20px;
        height: 20px;
    }
}

.stream {
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
        background: rgba(22, 22, 22, 0.2);
    }

    line-height: 15px;
    font-size: 14px;
    height: 20px;
}

.previewPopover {
    padding: 0 !important;
}

.item-class {
    &:hover {
        background: #d1cfcf;
    }
}

.voice-class {
    position: relative;

    > .el-slider {
        position: absolute;
        bottom: 25px;
        left: 12px;

        /deep/ .el-slider__runway {
            margin: 0 !important;
            background: #777;
        }

        /deep/ .el-slider__button {
            border: rgba(0, 0, 0, 0.3);
        }

        /deep/.el-slider__bar {
            background: #fff;
        }
    }
}
.isShowTree {
    width: 424px;
}
.isHideTree {
    width: 0rem !important;
    padding: 0 !important;
    div {
        display: none;
    }
    .btn {
        display: flex;
    }
}
.btn {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 40px;
    border: 1px solid #e9e9e9;
    border-left: none;
    position: absolute;
    right: -16px;
    top: 50%;
    border-radius: 0 4px 4px 0;
    z-index: 1001;
    &:hover {
        color: #409eff;
    }
}
.live-preview {
    display: flex;
    .car-select {
        width: 424px;
        display: flex;
        .car-type {
            width: 85px;
            margin-right: -1px;
        }
    }
    .live-preview-mode {
        width: calc(~"100% - 444px");
        height: 100%;
    }
    .left-content {
        width: 424px;
        padding: 12px;
        position: relative;
        border-right: 1px solid #e9e9e9;
        margin-right: 20px;
        p {
            margin: 12px 0;
        }
        .el-radio-group {
            display: flex;
            flex-direction: column;
            .el-radio {
                margin-bottom: 8px;
            }
        }

        .button-div {
            width: 100%;
            height: 40px;
        }
    }
}
.control-box {
    & > div,
    & > img {
        margin-left: 8px;
    }
}
.flex-layout {
    display: flex;
}

.flex-middle {
    align-items: center;
}

.flex-center {
    justify-content: center;
}
.flex-between {
    justify-content: space-between;
}
.flex-around {
    justify-content: space-around;
}
.flex-end {
    justify-content: flex-end;
}
.deviceStatus-0 {
    color: #909399;
}
.deviceStatus-1 {
    color: #67c23a;
}
.deviceStatus-2 {
    color: #e6a23c;
}
/deep/.awaken-dialog {
    display: flex;
    padding-right: 12px;
    .el-icon-warning {
        font-size: 26px;
        margin-right: 12px;
        color: #ff952c;
    }
    .right-box {
        .title-box {
            p:nth-child(1) {
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 12px;
            }
        }
    }
    .el-input-number {
        line-height: 30px;
    }
    .el-form-item {
        margin-bottom: 0px;
    }
    .el-form-item__content {
        line-height: 36px;
    }
    .tip-msg {
        display: block;
        font-size: 12px;
        line-height: 10px;
        color: #ccc;
    }
    .slider-box {
        display: flex;
        align-items: center;
        & > div {
            flex: 1;
        }
        .dis-span {
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
            height: 6px;
            width: 50px;
            background-color: #c0c4cc;
        }
    }
}
</style>
<style lang="less">
.active-livePreview {
    width: 100% !important;
    height: 100% !important;
    position: absolute !important;
    z-index: 999 !important;
    left: 0 !important;
    top: 0 !important;
}
.awaken-dialog {
    .el-dialog__body {
        padding: 0px 20px !important;
    }
}
</style>
