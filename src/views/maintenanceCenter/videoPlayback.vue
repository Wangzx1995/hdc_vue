<template>
    <div
        class="video-palyback text-left white"
        :style="{ height: pageHeight + 'px' }"
    >
        <div
            class="tree-search-part video-content-left"
            :class="isShowTree ? 'isShowTree' : 'isHideTree'"
        >
            <div
                class="tree-div scrollable scrollable-xs"
                style=""
                ref="treeDiv"
            >
                <div ref="selectTree" class="car-select">
                    <G-DeviceSearch
                        :valueKey="'deviceCode'"
                        :value.sync="searchForm.deviceCode"
                        :selectObj.sync="currentWachCar"
                        :showDeviceStatus="true"
                    ></G-DeviceSearch>
                </div>
                <div style="display: flex; justify-content: center">
                    <date-pannel
                        :currentCar="currentWachCar"
                        @pick="dayPick"
                        :selectDay="selectDate"
                        ref="date-pannel"
                        :isRange="false"
                    ></date-pannel>
                </div>
                <div class="video-content-right">
                    <el-form
                        style="margin-top: 1rem"
                        ref="searchVideoForm"
                        :model="searchVideoForm"
                        :rules="searchVideoFormValidate"
                    >
                        <el-form-item
                            prop="sTime"
                            label-width="104px"
                            class="sTime-form"
                        >
                            <span slot="label">
                                <span>
                                    <!-- 开始时间 -->
                                    {{ $t("common.startTime") }}
                                </span>
                                <span
                                    style="display: inline-block; width: 2rem"
                                    >{{
                                        selectDate
                                            ? selectDate
                                                  .substring(5)
                                                  .replace("-", ".")
                                            : ""
                                    }}</span
                                >
                            </span>
                            <el-time-picker
                                popper-class="el-time-picker-search"
                                v-model="searchVideoForm.sTime"
                                default-value="00:00:00"
                                :clearable="false"
                                class="video-time-picker"
                            >
                            </el-time-picker>
                        </el-form-item>
                        <el-form-item
                            prop="eTime"
                            label-width="104px"
                            class="sTime-form"
                        >
                            <span slot="label">
                                <!-- 结束时间 -->
                                {{ $t("common.endTime") }}
                                <span
                                    style="display: inline-block; width: 2rem"
                                >
                                    {{
                                        selectDate
                                            ? selectDate
                                                  .substring(5)
                                                  .replace("-", ".")
                                            : ""
                                    }}
                                </span>
                            </span>
                            <el-time-picker
                                popper-class="el-time-picker-search"
                                v-model="searchVideoForm.eTime"
                                default-value="23:59:59"
                                :clearable="false"
                                class="video-time-picker"
                            >
                            </el-time-picker>
                        </el-form-item>
                        <div class="video-button-div">
                            <div v-btn="'videoPlaybackDownloadVideo'">
                                <el-popover
                                    placement="bottom-end"
                                    width="270"
                                    trigger="manual"
                                    :value="downLoadForm.downloadTimeVisible"
                                    popper-class="download-time-popover"
                                >
                                    <div class="b-b p-b-sm">
                                        <!-- 录像下载 -->
                                        {{ $t("videoPlayback.videoDownload") }}
                                    </div>
                                    <el-button
                                        class="m-t-sm m-b-sm"
                                        @click="enterDownloadMode"
                                    >
                                        <!-- 框选下载 -->
                                        {{
                                            $t(
                                                "videoPlayback.boxSelectionDownload"
                                            )
                                        }}
                                    </el-button>
                                    <div
                                        style="
                                            max-height: 270px;
                                            overflow-y: auto;
                                        "
                                    >
                                        <div
                                            class="p-t-sm flex-layout flex-middle"
                                            style="
                                                border-top: 1px dashed #d7dde4;
                                            "
                                        >
                                            <el-checkbox
                                                v-model="checked"
                                            ></el-checkbox>
                                            <div class="m-l-sm">
                                                <!-- 自定义时间/通道下载（最多10分钟） -->
                                                {{
                                                    $t(
                                                        "videoPlayback.customizeDownload"
                                                    )
                                                }}
                                            </div>
                                        </div>
                                        <el-form
                                            v-show="checked"
                                            class="m-t-sm"
                                            :model="downLoadForm"
                                            ref="downLoadForm"
                                            :rules="searchVideoFormValidate"
                                            label-position="top"
                                        >
                                            <div
                                                style="
                                                    font-size: 12px;
                                                    color: #666;
                                                "
                                                class="m-y-xs"
                                            >
                                                <!-- 当前选中日期 -->
                                                {{
                                                    $t(
                                                        "videoPlayback.currentSelectedDate"
                                                    )
                                                }}
                                                ：{{
                                                    searchVideoForm.startTime
                                                        ? searchVideoForm.startTime.substring(
                                                              0,
                                                              10
                                                          )
                                                        : ""
                                                }}
                                            </div>
                                            <!-- 选择时间 -->
                                            <el-form-item
                                                :label="
                                                    $t(
                                                        'videoPlayback.selectTime'
                                                    )
                                                "
                                                prop="downloadTime"
                                                class="item-style"
                                            >
                                                <el-time-picker
                                                    size="mini"
                                                    is-range
                                                    v-model="
                                                        downLoadForm.downloadTime
                                                    "
                                                    :clearable="false"
                                                    value-format="HH:mm:ss"
                                                    :start-placeholder="
                                                        $t('common.startTime')
                                                    "
                                                    :end-placeholder="
                                                        $t('common.endTime')
                                                    "
                                                    align="center"
                                                    popper-class="download-time-picker"
                                                    style="
                                                        width: 12rem;
                                                        height: 2rem;
                                                        line-height: 2rem;
                                                    "
                                                >
                                                </el-time-picker>
                                            </el-form-item>
                                            <!-- 选择通道 -->
                                            <el-form-item
                                                :label="
                                                    $t(
                                                        'videoPlayback.selectChannel'
                                                    )
                                                "
                                                prop="channelList"
                                                class="item-style error-item m-t"
                                            >
                                                <el-checkbox-group
                                                    v-model="
                                                        downLoadForm.channelList
                                                    "
                                                    class="video-radio-group"
                                                    style="width: 100%"
                                                    @change="changeChannelList2"
                                                >
                                                    <el-checkbox
                                                        v-for="item in channelList"
                                                        :key="item.id"
                                                        :label="item.channelNum"
                                                        class="channel-radio"
                                                        >{{
                                                            item.channelName
                                                        }}</el-checkbox
                                                    >
                                                </el-checkbox-group>
                                            </el-form-item>
                                        </el-form>
                                        <div
                                            class="flex-layout flex-end flex-row"
                                        >
                                            <el-button
                                                @click="
                                                    downLoadForm.downloadTimeVisible = false
                                                "
                                                class="m-y"
                                            >
                                                <!-- 取消 -->
                                                {{ $t("common.cancel") }}
                                            </el-button>
                                            <el-button
                                                type="primary"
                                                @click="
                                                    getDownloadVideoList($event)
                                                "
                                                class="m-y"
                                                v-if="checked"
                                            >
                                                <!-- 确定 -->
                                                {{ $t("common.ok") }}
                                            </el-button>
                                        </div>
                                    </div>
                                    <el-button
                                        slot="reference"
                                        @click="openDownloadVideo"
                                        v-show="videoBackList.length > 0"
                                    >
                                        <!-- 录像下载 -->
                                        {{ $t("videoPlayback.videoDownload") }}
                                    </el-button>
                                </el-popover>
                            </div>
                            <el-button
                                type="primary"
                                class="m-l-sm"
                                @click="preSearch()"
                                :loading="
                                    searchVideoLoading || traceDataLoading
                                "
                            >
                                <!-- "查询中": "查询" -->
                                {{
                                    searchVideoLoading || traceDataLoading
                                        ? $t("common.searching")
                                        : $t("common.search")
                                }}</el-button
                            >
                        </div>
                        <div style="font-weight: 700" class="m-t">
                            <!-- 通道选择 -->
                            {{ $t("videoPlayback.channelselect") }}
                        </div>
                        <div
                            v-show="channelList.length == 0"
                            style="margin: 1rem; color: #ccc"
                        >
                            <span class="el-icon-s-release">
                                <!-- 暂无通道 -->
                                {{ $t("videoPlayback.noChannel") }}
                            </span>
                        </div>
                        <div
                            v-show="channelList.length > 0"
                            class="video-channel"
                        >
                            <el-form-item label="" prop="channelNoList">
                                <el-checkbox-group
                                    v-model="searchVideoForm.channelNoList"
                                    class="video-group-noList"
                                    @change="changeChannelList"
                                >
                                    <el-checkbox
                                        v-for="item in channelList"
                                        :key="item.id"
                                        :label="item.channelNum"
                                        class="channel-radio"
                                        >{{ item.channelName }}</el-checkbox
                                    >
                                </el-checkbox-group>
                            </el-form-item>
                        </div>
                        <el-form-item label="" prop="path">
                            <el-checkbox v-model="isShowPath">
                                <!-- 同步显示轨迹 -->
                                {{
                                    $t(
                                        "videoPlayback.synchronizeDisplayTrajectory"
                                    )
                                }}
                            </el-checkbox>
                        </el-form-item>
                    </el-form>
                </div>
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
        <div class="video-content-center">
            <div
                class="video-play-page"
                v-loading="searchVideoLoading || traceDataLoading"
            >
                <div class="video-main">
                    <div class="video">
                        <div
                            class="h-full"
                            id="videoPlayTimeLineBack_ocx"
                            v-show="playControlMode === 'ocx'"
                        ></div>
                        <div class="h-full" v-show="playControlMode === 'js'">
                            <div
                                id="videoPlayTimeLineBack_Js"
                                :style="{ height: backHeght }"
                            ></div>
                            <el-popover
                                placement="top"
                                trigger="manual"
                                v-model="downLoadMode_js"
                                ref="downLoadMode_js_ref"
                                popper-class="downLoadMode_js"
                            >
                                <div
                                    style="font-size: 12px"
                                    class="flex-layout flex-between"
                                >
                                    <span
                                        class="pointer"
                                        @click="cancelDownLoadMode"
                                    >
                                        <!-- 取消 -->
                                        {{ $t("common.cancel") }}
                                    </span>
                                    <span
                                        class="text-info pointer"
                                        @click="openDownLoadFormEl"
                                    >
                                        <!-- 下载 -->
                                        {{ $t("common.download") }}
                                    </span>
                                </div>
                            </el-popover>
                            <div
                                id="videoTimeBar_Js"
                                :style="{ height: timeBarHeight }"
                                class="flex-layout"
                                v-popover:downLoadMode_js_ref
                            >
                                <div>
                                    <div
                                        style="
                                            background: #1b1b15;
                                            width: 70px;
                                            height: 100%;
                                            flex-shrink: 0;
                                        "
                                    >
                                        <div
                                            style="
                                                background: #212021;
                                                width: 100%;
                                                height: 30px;
                                                font-size: 15px;
                                                color: white;
                                                display: flex;
                                                align-items: center;
                                            "
                                        >
                                            <i
                                                class="el-icon-plus m-l pointer"
                                                id="down"
                                            ></i>
                                            <i
                                                class="el-icon-minus m-l pointer"
                                                id="up"
                                            ></i>
                                        </div>
                                        <div
                                            style="
                                                background: #181811;
                                                width: 100%;
                                                height: 5px;
                                            "
                                        ></div>
                                        <div
                                            style="
                                                background: #292c29;
                                                width: 100%;
                                                height: 24px;
                                                color: white;
                                                overflow: hidden;
                                                text-overflow: ellipsis;
                                                white-space: nowrap;
                                                line-height: 25px;
                                                text-align: center;
                                            "
                                            id="text0"
                                        ></div>
                                        <div
                                            style="
                                                background: #181811;
                                                width: 100%;
                                                height: 3px;
                                            "
                                        ></div>
                                        <div
                                            style="
                                                background: #292c29;
                                                width: 100%;
                                                height: 24px;
                                                color: white;
                                                overflow: hidden;
                                                text-overflow: ellipsis;
                                                white-space: nowrap;
                                                line-height: 25px;
                                                text-align: center;
                                            "
                                            id="text1"
                                        ></div>
                                    </div>
                                </div>
                                <canvas
                                    style="flex: 1; height: 90px"
                                    id="js_canvas"
                                ></canvas>
                            </div>
                            <div class="bt-op">
                                <div class="play-content">
                                    <!-- 下载 -->
                                    <img
                                        class="pointer"
                                        src="/static/images/control/downLoad.svg"
                                        @click="enterDownloadMode"
                                        :title="$t('common.download')"
                                        v-btn="'videoPlaybackDownloadVideo'"
                                    />
                                    <!-- '暂停' : '播放'" -->
                                    <img
                                        class="pointer"
                                        :src="`/static/images/control/${
                                            playState ? 'pause' : 'play'
                                        }.svg`"
                                        style="width: 24px; height: 24px"
                                        @click="togglePause"
                                        :title="
                                            playState
                                                ? $t('videoPlayback.pause')
                                                : $t('videoPlayback.play')
                                        "
                                    />
                                    <!-- 停止 -->
                                    <img
                                        class="pointer"
                                        src="/static/images/control/stop.svg"
                                        @click="stopRealPlayAll"
                                        :title="$t('videoPlayback.stop')"
                                    />
                                    <div class="currentPlayTime">
                                        {{ currentPlayTime }}
                                    </div>
                                </div>
                                <div class="totalControl">
                                    <el-popover
                                        ref="popover-speed"
                                        placement="top"
                                        trigger="click"
                                        popper-class="speedTypePopover pointer"
                                    >
                                        <div
                                            class="p-a-xs item-class"
                                            @click="toggleSpeedType(1)"
                                        >
                                            1x
                                        </div>
                                        <div
                                            class="p-a-xs item-class"
                                            @click="toggleSpeedType(2)"
                                        >
                                            2x
                                        </div>
                                        <div
                                            class="p-a-xs item-class"
                                            @click="toggleSpeedType(4)"
                                        >
                                            4x
                                        </div>
                                    </el-popover>
                                    <!-- 播放速率 -->
                                    <div
                                        :title="
                                            $t('videoPlayback.playbackRate')
                                        "
                                        class="stream pointer"
                                        v-popover:popover-speed
                                    >
                                        <span
                                            style="
                                                width: 20px;
                                                display: inline-block;
                                            "
                                            >{{
                                                speedTypeList[
                                                    settingForm.speedType
                                                ]
                                            }}</span
                                        >
                                        <i class="el-icon-arrow-down"></i>
                                    </div>
                                    <el-popover
                                        ref="popover-coverPreview"
                                        placement="top"
                                        trigger="click"
                                        popper-class="coverPopover pointer"
                                    >
                                        <!-- <div class="p-a-xs item-class" @click="toggleCoverType(0)">原始</div> -->
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
                                    <!-- 窗口比例 -->
                                    <div
                                        :title="$t('videoPlayback.windowRatio')"
                                        class="stream pointer"
                                        v-popover:popover-coverPreview
                                    >
                                        <span
                                            style="
                                                width: 30px;
                                                display: inline-block;
                                                text-align: center;
                                            "
                                            >{{
                                                coverTypeList[
                                                    settingForm.coverType
                                                ]
                                            }}</span
                                        >
                                        <i class="el-icon-arrow-down"></i>
                                    </div>
                                    <el-popover
                                        placement="top"
                                        trigger="manual"
                                        :width="240"
                                        ref="videoPlayback-popover"
                                        v-model="settingShow"
                                    >
                                        <div class="m-b">
                                            <!-- 参数配置 -->
                                            {{
                                                $t(
                                                    "videoPlayback.parameterConfiguration"
                                                )
                                            }}
                                        </div>
                                        <div>
                                            <el-form label-width="104px">
                                                <!-- 字幕默认位置 -->
                                                <el-form-item
                                                    :label="
                                                        $t(
                                                            'videoPlayback.defaultSubtitlePosition'
                                                        ) + '：'
                                                    "
                                                >
                                                    <el-select
                                                        v-model="
                                                            settingForm.textPosition
                                                        "
                                                        style="width: 88px"
                                                    >
                                                        <!-- 右上 -->
                                                        <el-option
                                                            :value="0"
                                                            :label="
                                                                $t(
                                                                    'videoPlayback.rightUp'
                                                                )
                                                            "
                                                        ></el-option>
                                                        <!-- 右中 -->
                                                        <el-option
                                                            :value="1"
                                                            :label="
                                                                $t(
                                                                    'videoPlayback.rightMid'
                                                                )
                                                            "
                                                        ></el-option>
                                                        <!-- 右下 -->
                                                        <el-option
                                                            :value="2"
                                                            :label="
                                                                $t(
                                                                    'videoPlayback.rightLow'
                                                                )
                                                            "
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-form>
                                        </div>
                                        <div class="text-right m-t-md">
                                            <el-button
                                                size="mini"
                                                @click="closeSetting"
                                            >
                                                <!-- 取消 -->
                                                {{ $t("common.cancel") }}
                                            </el-button>
                                            <el-button
                                                type="primary"
                                                size="mini"
                                                @click="saveSetting"
                                            >
                                                <!-- 保存 -->
                                                {{ $t("common.save") }}
                                            </el-button>
                                        </div>
                                    </el-popover>
                                    <!-- 设置 -->
                                    <img
                                        src="/static/images/control/setting.svg"
                                        :title="$t('videoPlayback.setUp')"
                                        @click="showSettingPopover"
                                        v-popover:videoPlayback-popover
                                    />
                                    <!-- <div class="voice-class">
                                        <el-slider
                                            v-model="settingForm.voice"
                                            vertical
                                            size="mini"
                                            height="80px"
                                            v-if="showVoice"
                                            @change="changeVoice"
                                        ></el-slider>
                                        <img
                                            src="/static/images/control/voice.svg"
                                            title="音量"
                                            @click="showVoice = !showVoice"
                                        />
                                    </div> -->
                                    <!-- <img
                                        src="/static/images/control/carmera.svg"
                                        title="抓图"
                                        @click="captureAll"
                                    /> -->
                                    <!-- 关键帧播放 -->
                                    <img
                                        :src="`/static/images/control/${
                                            !settingForm.keyFrame
                                                ? 'keyframe-close'
                                                : 'keyframe-open'
                                        }.svg`"
                                        :title="
                                            $t('videoPlayback.keyframePlayback')
                                        "
                                        @click="togglekeyFrame"
                                    />
                                    <!-- <img
                                        src="/static/images/control/bigger.svg"
                                        title="全屏"
                                        @click="fullScreen"
                                    /> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="path-map" v-show="isShowPath">
                        <HistoryTrace
                            :carPointTrajectory="carPointTrajectory"
                            :traceSlice="traceSlice"
                            :runTrace="runTrace"
                        ></HistoryTrace>
                    </div>
                </div>
                <div class="video-list">
                    <div class="channel-tabs">
                        <div
                            class="channel-item"
                            :class="{ active: nowChannelName == channelName }"
                            v-for="channelName in Object.keys(
                                videoBackListFormat
                            )"
                            v-bind:key="channelName"
                            @click="nowChannelName = channelName"
                        >
                            {{ channelName }}
                        </div>
                    </div>
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <!-- 文件列表 -->
                        <el-tab-pane
                            :label="$t('videoPlayback.fileList')"
                            name="first"
                        >
                            <el-table
                                :data="videoBackListFormat[nowChannelName]"
                                height="255"
                                :row-class-name="tableRowClassName"
                                border
                                ref="transcriptTable"
                            >
                                <el-table-column
                                    prop=""
                                    label=""
                                    :width="marginLeft"
                                    :min-width="1"
                                >
                                    <template slot-scope="scope">
                                        <div>&nbsp;</div>
                                    </template>
                                </el-table-column>
                                <!-- 开始时间 -->
                                <el-table-column
                                    prop="startTime"
                                    :label="$t('common.startTime')"
                                    min-width="140"
                                >
                                </el-table-column>
                                <!-- 结束时间 -->
                                <el-table-column
                                    prop="endTime"
                                    :label="$t('common.endTime')"
                                    min-width="140"
                                >
                                </el-table-column>
                                <!-- 时长 -->
                                <el-table-column
                                    :label="$t('videoPlayback.duration')"
                                    min-width="100"
                                >
                                    <template slot-scope="scope">
                                        {{
                                            scope.row.startTime
                                                | intervalTime(
                                                    scope.row.endTime
                                                )
                                        }}
                                    </template>
                                </el-table-column>
                                <!-- 清晰度 -->
                                <el-table-column
                                    :label="$t('videoPlayback.definition')"
                                    min-width="100"
                                >
                                    <!-- 高清 -->
                                    {{ $t("videoPlayback.highDefinition") }}
                                </el-table-column>
                                <!-- 通道号 -->
                                <el-table-column
                                    :label="$t('videoPlayback.channelNumber')"
                                    min-width="80"
                                >
                                    <template slot-scope="">
                                        {{ nowChannelName }}
                                    </template>
                                </el-table-column>
                                <!-- 通道号 -->
                                <el-table-column
                                    :label="$t('videoPlayback.fileSize')"
                                    min-width="80"
                                >
                                    <template slot-scope="scope">
                                        {{ scope.row.fileSize | fileSize }}
                                    </template>
                                </el-table-column>
                                <!-- 资源类型 -->
                                <el-table-column
                                    prop="mediaType"
                                    :label="$t('videoPlayback.mediaType')"
                                    min-width="80"
                                >
                                    <template slot-scope="scope">
                                        {{ mediaTypeMap[scope.row.mediaType] }}
                                    </template>
                                </el-table-column>
                                <!-- 存储类型 -->
                                <el-table-column
                                    prop="storeType"
                                    :label="$t('videoPlayback.storeType')"
                                    min-width="80"
                                >
                                    <template slot-scope="scope">
                                        {{ storeTypeMap[scope.row.storeType] }}
                                    </template>
                                </el-table-column>
                                <!-- 操作 -->
                                <el-table-column
                                    :label="$t('common.operate')"
                                    min-width="100"
                                >
                                    <template slot-scope="scope">
                                        <span
                                            class="pointer m-r-sm text-info"
                                            @click="getReplayUrl(scope.row)"
                                        >
                                            <!-- 播放 -->
                                            {{ $t("videoPlayback.play") }}
                                        </span>
                                        <span
                                            class="pointer m-r-sm text-success"
                                            v-if="scope.row.downType"
                                            >{{ scope.row.downType }}</span
                                        >
                                        <span
                                            v-btn="'videoPlaybackDownloadVideo'"
                                        >
                                            <el-popover
                                                :ref="`popover${scope.$index}`"
                                                placement="left"
                                                width="280"
                                                v-if="!scope.row.downType"
                                                trigger="click"
                                                @show="singPopoverShow(scope)"
                                            >
                                                <el-form
                                                    :model="singFileDownForm"
                                                    label-width="80px"
                                                    label-position="top"
                                                >
                                                    <!-- 时间范围 -->
                                                    <el-form-item
                                                        :label="
                                                            $t(
                                                                'qualifiedProbability.timeFrame'
                                                            ) + '：'
                                                        "
                                                        v-if="
                                                            singFileDownForm.pickTimeShow
                                                        "
                                                        label-position="top"
                                                        prop="startTimeH,endTimeH"
                                                        :rules="rules"
                                                    >
                                                        <div>
                                                            <el-time-picker
                                                                v-model="
                                                                    singFileDownForm.startTimeH
                                                                "
                                                                value-format="HH:mm:ss"
                                                                :picker-options="{
                                                                    selectableRange: `${
                                                                        singFileDownForm.minTime
                                                                    } - ${
                                                                        singFileDownForm.endTimeH
                                                                            ? singFileDownForm.endTimeH
                                                                            : singFileDownForm.maxTime
                                                                    }}`,
                                                                }"
                                                                :placeholder="
                                                                    $t(
                                                                        'common.startTime'
                                                                    )
                                                                "
                                                                style="
                                                                    width: 120px;
                                                                "
                                                                size="mini"
                                                                :clearable="
                                                                    false
                                                                "
                                                            >
                                                            </el-time-picker>
                                                            <span> - </span>
                                                            <el-time-picker
                                                                v-model="
                                                                    singFileDownForm.endTimeH
                                                                "
                                                                value-format="HH:mm:ss"
                                                                :picker-options="{
                                                                    selectableRange: `${
                                                                        singFileDownForm.startTimeH
                                                                            ? singFileDownForm.startTimeH
                                                                            : singFileDownForm.minTime
                                                                    } - ${
                                                                        singFileDownForm.maxTime
                                                                    }`,
                                                                }"
                                                                :placeholder="
                                                                    $t(
                                                                        'common.endTime'
                                                                    )
                                                                "
                                                                style="
                                                                    width: 120px;
                                                                "
                                                                size="mini"
                                                                :clearable="
                                                                    false
                                                                "
                                                            >
                                                            </el-time-picker>
                                                        </div>
                                                    </el-form-item>
                                                    <!-- <el-form-item label="文件格式：">
                                            <el-checkbox
                                                v-model="
                                                    singFileDownForm.fileDownLoadType
                                                "
                                                :false-label="2"
                                                :true-label="1"
                                            >
                                                是否转成MP4
                                                <el-tooltip
                                                    class="item"
                                                    effect="dark"
                                                    placement="right"
                                                >
                                                    <i
                                                        class="el-icon-question"
                                                    ></i>
                                                    <div slot="content">
                                                        <div>
                                                            若转换失败，文件将以原格式下载
                                                        </div>
                                                    </div>
                                                </el-tooltip>
                                            </el-checkbox>
                                        </el-form-item> -->
                                                </el-form>
                                                <div class="text-right m-t-xs">
                                                    <span
                                                        class="m-r pointer"
                                                        @click="
                                                            $refs[
                                                                `popover${scope.$index}`
                                                            ].doClose()
                                                        "
                                                    >
                                                        <!-- 取消 -->
                                                        {{
                                                            $t("common.cancel")
                                                        }}
                                                    </span>
                                                    <span
                                                        class="text-info pointer"
                                                        @click="
                                                            downLoadSingle(
                                                                scope,
                                                                $event
                                                            )
                                                        "
                                                    >
                                                        <!-- 确定 -->
                                                        {{ $t("common.ok") }}
                                                    </span>
                                                </div>
                                                <span
                                                    slot="reference"
                                                    class="pointer text-info"
                                                    v-show="
                                                        !scope.row.downType &&
                                                        scope.row.endTimeStamp -
                                                            scope.row
                                                                .startTimeStamp >
                                                            10 * 60 * 1000
                                                    "
                                                >
                                                    <!-- 下载 -->
                                                    {{ $t("common.download") }}
                                                </span>
                                            </el-popover>
                                            <span
                                                class="pointer text-info"
                                                v-show="
                                                    !scope.row.downType &&
                                                    scope.row.endTimeStamp -
                                                        scope.row
                                                            .startTimeStamp <=
                                                        10 * 60 * 1000
                                                "
                                                @click="
                                                    singPopoverShow(
                                                        scope,
                                                        true,
                                                        $event
                                                    )
                                                "
                                            >
                                                <!-- 下载 -->
                                                {{ $t("common.download") }}
                                            </span>
                                        </span>
                                        <!-- <span
                                    class="pointer text-info"
                                    v-popover="`popover${scope.$index}`"
                                    v-if="!scope.row.downType"
                                    >下载11</span
                                > -->
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <!-- 位置数据 -->
                        <el-tab-pane
                            :label="$t('videoPlayback.positionData')"
                            name="second"
                        >
                            <el-table :data="GPSData" height="209" border>
                                <el-table-column
                                    prop=""
                                    label=""
                                    :width="marginLeft"
                                    :min-width="1"
                                >
                                    <template slot-scope="scope">
                                        <div>&nbsp;</div>
                                    </template>
                                </el-table-column>
                                <!-- 上报时间 -->
                                <el-table-column
                                    prop="collectTime"
                                    min-width="150"
                                    :label="
                                        $t('qualifiedProbability.collectTime')
                                    "
                                >
                                </el-table-column>
                                <!-- 上报类型 -->
                                <el-table-column
                                    min-width="110"
                                    :label="
                                        $t(
                                            'qualifiedProbability.supplementSign'
                                        )
                                    "
                                >
                                    <template slot-scope="scope">
                                        <!-- {{
                                            { 0: "正常上报", 1: "补传" }[
                                                scope.row.supplementSign
                                            ]
                                        }} -->
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
                                <!-- 状态 -->
                                <el-table-column
                                    min-width="110"
                                    :label="
                                        $t('qualifiedProbability.gpsStatus')
                                    "
                                >
                                    <template slot-scope="scope">
                                        <span v-show="scope.row.gpsStatus == 0">
                                            <!-- ACC关&无定位 -->
                                            {{
                                                $t(
                                                    "qualifiedProbability.gpsStatusText1"
                                                )
                                            }}
                                        </span>
                                        <span v-show="scope.row.gpsStatus == 1">
                                            <!-- ACC关&有定位 -->
                                            {{
                                                $t(
                                                    "qualifiedProbability.gpsStatusText2"
                                                )
                                            }}
                                        </span>
                                        <span v-show="scope.row.gpsStatus == 2">
                                            <!-- ACC开&无定位 -->
                                            {{
                                                $t(
                                                    "qualifiedProbability.gpsStatusText3"
                                                )
                                            }}
                                        </span>
                                        <span v-show="scope.row.gpsStatus == 3">
                                            <!-- ACC开&有定位 -->
                                            {{
                                                $t(
                                                    "qualifiedProbability.gpsStatusText4"
                                                )
                                            }}
                                        </span>
                                    </template>
                                </el-table-column>
                                <!-- 接收时间 -->
                                <el-table-column
                                    prop="createTime"
                                    min-width="150"
                                    :label="
                                        $t('qualifiedProbability.createTime')
                                    "
                                >
                                </el-table-column>
                                <!-- GPS速度（km/h） -->
                                <el-table-column
                                    prop="speed"
                                    min-width="150"
                                    :label="
                                        $t('qualifiedProbability.speed') +
                                        '（km/h）'
                                    "
                                >
                                </el-table-column>
                                <!-- 行车记录仪速度（km/h） -->
                                <el-table-column
                                    prop="recorderSpeed"
                                    min-width="150"
                                    :label="
                                        $t(
                                            'qualifiedProbability.recorderSpeed'
                                        ) + '（km/h）'
                                    "
                                >
                                </el-table-column>
                                <!-- 经纬度 -->
                                <el-table-column
                                    min-width="160"
                                    :label="
                                        $t('qualifiedProbability.longitude')
                                    "
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
                                <!-- 方向角 -->
                                <el-table-column
                                    prop="direction"
                                    :label="
                                        $t('qualifiedProbability.direction')
                                    "
                                    min-width="80"
                                >
                                </el-table-column>
                                <!-- 海拔 -->
                                <el-table-column
                                    prop="altitude"
                                    :label="$t('qualifiedProbability.altitude')"
                                    min-width="80"
                                >
                                </el-table-column>
                                <!-- 卫星数 -->
                                <el-table-column
                                    prop="locationSignal"
                                    :label="
                                        $t(
                                            'qualifiedProbability.locationSignal'
                                        )
                                    "
                                    min-width="100"
                                >
                                </el-table-column>
                                <!-- 网络信号强度(dBm)-->
                                <el-table-column
                                    prop="positionSignalStrength"
                                    :label="
                                        $t(
                                            'qualifiedProbability.positionSignalStrength'
                                        )
                                    "
                                    min-width="160"
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
                                            <div
                                                slot="content"
                                                class="signal-description"
                                            >
                                                <div>
                                                    <!-- 通讯信号强度说明 -->
                                                    {{
                                                        $t(
                                                            "videoPlayback.explanationOfCommunication"
                                                        )
                                                    }}
                                                </div>
                                                <p>
                                                    <signal
                                                        :strength="5"
                                                    ></signal>
                                                    <span>[-69, +∞)</span>
                                                </p>
                                                <p>
                                                    <signal
                                                        :strength="4"
                                                    ></signal>
                                                    <span>[-77, -69)</span>
                                                </p>
                                                <p>
                                                    <signal
                                                        :strength="3"
                                                    ></signal>
                                                    <span>[-87, -77)</span>
                                                </p>
                                                <p>
                                                    <signal
                                                        :strength="2"
                                                    ></signal>
                                                    <span>[-93, -87)</span>
                                                </p>
                                                <p>
                                                    <signal
                                                        :strength="1"
                                                    ></signal>
                                                    <span>[-103, -93)</span>
                                                </p>
                                                <p>
                                                    <signal
                                                        :strength="0"
                                                    ></signal>
                                                    <span>(-∞, -103)</span>
                                                </p>
                                            </div>
                                            <i
                                                class="el-icon-warning-outline"
                                            ></i>
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
                                                        scope.row
                                                            .positionSignalStrength
                                                    )
                                                "
                                            ></signal>
                                            <span>{{
                                                scope.row.positionSignalStrength
                                            }}</span>
                                        </div>
                                    </template>
                                </el-table-column>
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
                        </el-tab-pane>
                        <!-- 上下线记录 -->
                        <el-tab-pane
                            :label="$t('videoPlayback.onlineOfflineRecords')"
                            name="third"
                            v-if="
                                $store.state.user.technicalSupportEngineerSign
                            "
                        >
                            <onlineOfflineRecords
                                ref="onlineOfflineRecords"
                                :videoData="videoBackListFormat[nowChannelName]"
                                :deviceCode="deviceInfo.deviceCode"
                                :selectDate="selectDate"
                            ></onlineOfflineRecords>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
        <!-- 下载 -->
        <el-dialog
            @close="closeEl"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            append-to-body
            width="400px"
            :title="$t('common.download')"
            :visible.sync="downLoadFormEl.visible"
        >
            <el-form>
                <!-- 时间范围 -->
                <el-form-item
                    :label="$t('qualifiedProbability.timeFrame') + '：'"
                >
                    <div>
                        {{ downLoadFormEl.startTime }} -
                        {{ downLoadFormEl.endTime }}
                    </div>
                </el-form-item>
                <!-- <el-form-item label="文件格式：">
                    <el-checkbox
                        v-model="downLoadFormEl.fileDownLoadType"
                        :false-label="2"
                        :true-label="1"
                    >
                        是否转成MP4
                        <el-tooltip
                            class="item"
                            effect="dark"
                            placement="right"
                        >
                            <i class="el-icon-question"></i>
                            <div slot="content">
                                <div>若转换失败，文件将以原格式下载</div>
                            </div>
                        </el-tooltip>
                    </el-checkbox>
                </el-form-item> -->
            </el-form>
            <div slot="footer">
                <el-button @click="downLoadFormEl.visible = false">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button @click="downloadByOwner($event)" type="primary">
                    <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </div>
        </el-dialog>
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
import { getTableHeight } from "@/utils/playBack";
import Timer from "@/utils/time";
import GpsConverter from "@/utils/gpsConverter";
import DatePannel from "@/components/datePannel.vue";
import HistoryTrace from "./videoPlayback/historyTrace.vue";
import onlineOfflineRecords from "./videoPlayback/onlineOfflineRecords.vue";
import signal from "@/views/maintenanceCenter/historyPlaybackFile/vue/signal.vue";

import {
    xhrPullFile,
    transFormAndDownLoad,
    formatDownLoadName,
    compareChange,
} from "@/utils/playBack";
import { TimeBar_C } from "../../components/webControlService/JSPlugin/lib/TimeBar_C";
import JSPlugin_B from "../../components/webControlService/JSPlugin/JSPlugin_B";
import { getGpsData, transferAddress } from "../../utils/getMapLocation";

import moment from "moment";

export default {
    components: { DatePannel, HistoryTrace, signal, onlineOfflineRecords },
    data() {
        return {
            activeName: "first",
            awakenVisible: false,
            awakenTime: 0,
            awakenDeviceId: "",
            loading: false,
            url: "/devicePortable/pagePortableTask",
            selectDayRange: { minDate: "", maxDate: "" }, //选择日期
            recordList: [],
            taskRecordVisible: false,
            taskDevice: "",
            deviceChose: "",
            searchCarList: [],
            cusTomTreeSetting: {
                apiName: "getGroupAndCarTreeNoGpsPortable",
                dataHanderFn: (res) => {
                    return res.data.tree;
                },
            },
            nowTable: "allCar",
            changeControlLoading: false,
            marginLeft: 1,
            nonePlayControlSuitable: false,
            playInfo_js: {
                firstPlayTime: null,
                deviceChannelList: {},
            },
            playInfo_ocx: {
                firstPlayTime: null,
                fileInfo: {},
            },
            downLoadMode_js: false,
            playControlMode: "js",
            playControl_js: null,
            playControl_ocx: {},
            openPopover: null,
            showVoice: false,
            settingShow: false,
            settingForm: {
                keyFrame: false,
                lastTime: 180,
                textPosition: 0,
                coverType: 3,
                speedType: 1,
                voice: 65,
            },
            settingForm_O: {},
            speedTypeList: {
                1: "1x",
                2: "2x",
                4: "4x",
            },
            coverTypeList: {
                0: this.$t("videoPlayback.original"), //"原始",
                1: "4:3",
                2: "16:9",
                3: this.$t("videoPlayback.cover"), // "铺满",
            },
            timeBarHeight: "62px",
            singFileDownForm: {
                fileDownLoadType: 2,
                startTimeH: "",
                endTimeH: "",
                minTime: "",
                maxTime: "",
                startTime: "",
                endTime: "",
                pickTimeShow: false,
            },
            sendAccMsgShow: false,
            mediaTypeMap: {
                0: this.$t("videoPlayback.audioAndVideo"), //"音视频",
                1: this.$t("videoPlayback.audio"), //"音频",
                2: this.$t("videoPlayback.video"), //"视频",
            },
            storeTypeMap: {
                1: this.$t("videoPlayback.mainMemory"), //"主存储器",
                2: this.$t("videoPlayback.disasterRecoveryMemory"), // "灾备存储器",
            },
            checked: false,
            nowChannelName: "",
            isShowTree: true,
            pageHeight: 800,
            //查询参数
            selectDate: "", //选择日期
            currentWachCar: {},
            channelList: [], //设备通道列表
            searchVideoForm: {
                //视频回放查询
                channelNoList: [],
                deviceCode: "",
                date: "",
                sTime: new Date(2016, 9, 10, 0, 0, 0),
                eTime: new Date(2016, 9, 10, 23, 59, 59),
                time: ["00:00:00", "23:59:59"],
            },
            rules: {
                validator: (_, __, callback) => {
                    let endTime = this.singFileDownForm.endTimeH;
                    let startTime = this.singFileDownForm.startTimeH;
                    if (
                        Timer.stringToSecond(endTime) -
                            Timer.stringToSecond(startTime) >
                        10 * 60
                    ) {
                        // 时间间隔超过10分钟
                        callback(
                            new Error(
                                this.$t(
                                    "videoPlayback.timeIntervalExceeding10Minutes"
                                )
                            )
                        );
                    } else {
                        callback();
                    }
                },
                trigger: "change",
            },
            searchVideoFormValidate: {
                channelNoList: [
                    {
                        required: true,
                        // message: "通道号不能为空",
                        message: this.$t("videoPlayback.channelNoListValidate"),
                        trigger: "blur",
                    },
                ],
                sTime: [
                    {
                        type: "date",
                        required: true,
                        // message: "开始时间不能为空",
                        message: this.$t("videoPlayback.sTimeValidate"),
                        trigger: "change",
                    },
                ],
                eTime: [
                    {
                        type: "date",
                        required: true,
                        // message: "结束时间不能为空",
                        message: this.$t("videoPlayback.eTimeValidate"),
                        trigger: "change",
                    },
                ],
                channelList: [
                    {
                        required: true,
                        // message: "请选择通道",
                        message: this.$t("videoPlayback.channelListValidate"),
                        trigger: "change",
                    },
                ],
                downloadTime: [
                    {
                        validator: (rule, value, callback) => {
                            if (
                                !value ||
                                value.length !== 2 ||
                                value[1] == "" ||
                                value[2] == ""
                            ) {
                                // callback(new Error("请选择时间!"));
                                callback(
                                    new Error(
                                        this.$t(
                                            "videoPlayback.downloadTimeValidate"
                                        )
                                    )
                                );
                            } else {
                                if (
                                    Timer.stringToSecond(value[1]) -
                                        Timer.stringToSecond(value[0]) >
                                    60 * 10
                                ) {
                                    // 时间间隔超过10分钟
                                    callback(
                                        new Error(
                                            this.$t(
                                                "videoPlayback.timeIntervalExceeding10Minutes"
                                            )
                                        )
                                    );
                                } else {
                                    callback();
                                }
                            }
                        },
                        trigger: "blur",
                    },
                    {
                        required: true,
                        // message: "请选择时间!",
                        message: this.$t("videoPlayback.downloadTimeValidate"),
                        trigger: "change",
                    },
                ],
            },
            isShowPath: false,
            searchVideoLoading: false,
            videoList: [], //录像列表
            videoBackList: [],
            deviceInfo: {
                productKey: "",
                deviceCode: "",
            }, //设备信息
            isCloseShow: true,
            currentPlayFile: {}, //当前播放文件
            currentPlayTime: "", //按时间轴回放，当前播放的时间点
            selectedRow: -1,
            scrollTimer: null,
            //地图
            traceSlice: [],
            runTrace: [],
            carPointTrajectory: null,
            historyTrajectoryTempData: [],
            historyTrajectory: [],
            startVideoTime: "",
            endVideoTime: "",
            heightTable: 0,
            downLoadForm: {
                downloadTimeVisible: false, //点击下载按钮，选择时间段弹框
                downloadTime: ["00:00:00", "23:59:59"],
                channelList: [],
                fileDownLoadType: 2,
            },
            downLoadFormEl: {
                visible: false,
                fileInfo: {},
                startTime: "",
                endTime: "",
                fileDownLoadType: 2,
            },
            traceDataLoading: false,
            statusInterval: null,
            searchForm: {
                deviceCode: "",
                plateArr: [],
                plateJson: {},
                carId: "",
            },
            carLoading: false,
            typeList: [
                {
                    // label: "车牌号",
                    label: this.$t("common.plateNum"),
                    value: 1,
                },
                {
                    // label: "VIN码",
                    label: this.$t("common.vin"),
                    value: 2,
                },
            ],
            carType: 1,
            GPSData: [],
            GpsParams: {
                currentPage: 1,
                pageSize: 100,
            },
        };
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
        "searchForm.deviceCode": {
            handler(val) {
                if (val) {
                    this.currentWachCar = {
                        ...this.currentWachCar,
                        label: this.currentWachCar.plateNum,
                    };
                    this.$store.dispatch(
                        "SetDefaultMaintenanceCar",
                        this.currentWachCar
                    );
                    this.$set(this.searchForm, "channelNo", "");
                    //选择日期默认为当天
                    let now = new Date();
                    this.selectDate =
                        now.getFullYear() +
                        "-" +
                        (now.getMonth() + 1) +
                        "-" +
                        now.getDate();
                    //获取设备通道号数
                    let obj = { deviceCode: val };
                    this.handleSelect(obj);
                } else {
                    this.searchVideoForm.deviceCode = "";
                }
            },
            deep: true,
        },
        "searchForm.carId": {
            handler(val) {
                if (!val) {
                    this.searchVideoForm.deviceCode = "";
                }
                if (!val && this.query && this.query.length < 3) {
                    this.searchForm.plateArr = [];
                }
                this.searchForm.plateNum =
                    this.searchForm.plateJson[this.searchForm.carId] || "";
                if (val) {
                    let carObj = this.searchForm.plateArr.find(
                        (item) => item.id === val
                    );
                    this.currentWachCar = {
                        ...carObj,
                        label: carObj.plateNum,
                    };
                    this.searchForm.deviceCode = val.deviceCode;
                    this.$set(this.searchForm, "channelNo", "");
                    //选择日期默认为当天
                    let now = new Date();
                    this.selectDate =
                        now.getFullYear() +
                        "-" +
                        (now.getMonth() + 1) +
                        "-" +
                        now.getDate();
                    //获取设备通道号数
                    let obj = { carId: this.currentWachCar.id };
                    this.handleSelect(obj);
                }
            },
            deep: true,
        },
        videoBackList() {
            if (!this.videoBackList.length) {
                this.marginLeft = 1;
            } else {
                this.$nextTick(() => {
                    this.marginLeft =
                        document.getElementsByClassName(
                            "channel-item"
                        )[0].clientWidth;
                });
            }
        },
        isLoginOut(val) {
            if (val) {
                checkKeys(this.playControl_ocx) &&
                    this.playControl_ocx.disconnectWebOcx();
            }
        },
        currentWachCar: {
            handler(newVal) {
                // let date = new Date();
                // let y = date.getFullYear();
                // let m = date.getMonth() + 1;
                // this.currentYear = y;
                // this.selectDate = today;
            },
        },
        selectedRow: {
            handler(newVal) {
                if (newVal >= 0) {
                    let that = this;
                    clearInterval(that.scrollTimer);
                    this.$nextTick(() => {
                        let vmEl = this.$refs.transcriptTable.$el;
                        if (vmEl) {
                            // 计算滚动条的位置
                            const targetTop = vmEl
                                .querySelectorAll(".el-table__body tr")
                                [newVal].getBoundingClientRect().top;
                            const containerTop = vmEl
                                .querySelector(".el-table__body")
                                .getBoundingClientRect().top;

                            let changeHeight = targetTop - containerTop;

                            that.scrollTimer = setInterval(() => {
                                let that = this;
                                if (that.$refs.transcriptTable)
                                    that.$refs.transcriptTable.bodyWrapper.scrollTop =
                                        this.heightTable;
                                if (this.heightTable == changeHeight) {
                                    clearInterval(that.scrollTimer);
                                }
                                if (changeHeight - this.heightTable > 0) {
                                    if (changeHeight - this.heightTable < 1) {
                                        this.heightTable = changeHeight;
                                    } else this.heightTable += 1;
                                } else if (
                                    changeHeight - this.heightTable <
                                    0
                                ) {
                                    if (changeHeight - this.heightTable > -1) {
                                        this.heightTable = changeHeight;
                                    } else this.heightTable += -1;
                                }
                            }, 1);
                        }
                    });
                }
            },
        },
        "searchVideoForm.sTime": {
            handler(newVal) {
                this.searchVideoForm.time[0] =
                    newVal.getHours() +
                    ":" +
                    newVal.getMinutes() +
                    ":" +
                    newVal.getSeconds();
            },
        },
        "searchVideoForm.eTime": {
            handler(newVal) {
                this.searchVideoForm.time[1] =
                    newVal.getHours() +
                    ":" +
                    newVal.getMinutes() +
                    ":" +
                    newVal.getSeconds();
            },
        },
        isShowPath: {
            handler(val) {
                setTimeout(() => {
                    this.playControlMode === "ocx" &&
                        this.playControl_ocx.pageResizeAdjust();
                    if (this.playControlMode === "js") {
                        this.closeSetting();
                        this.timeBar.resizeHander();
                        this.playControl_js.reSizeResize();
                        if (this.downLoadMode_js) {
                            // this.$refs.downLoadMode_js_ref.updatePopper();
                        }
                    }
                    setTimeout(() => {
                        if (val) {
                            this.sliceTraceArr();
                        }
                    }, 1000);
                }, 0);
            },
        },
        "searchVideoForm.channelNo": {
            //通道号改变时，直接查询数据，无缝切换通道视频
            handler(val, oldVal) {
                if (!val) {
                    return;
                }
                if (!oldVal) {
                    return;
                }
                this.searchVideoFun();
            },
        },
        isCloseShow(val) {
            this.$emit("isCloseShow", val);
        },
        isShowMenu(newVal) {
            let h =
                document.getElementById("menu-box" + this.menuIndex)
                    .offsetHeight - 32;
            if (newVal) {
                checkKeys(this.playControl_ocx) &&
                    this.playControl_ocx.cuttingPartWindow(0, 0, 9999, h);
            } else {
                checkKeys(this.playControl_ocx) &&
                    this.playControl_ocx.repairPartWindow(0, 0, 9999, h);
            }
        },
        userActionOpen: {
            handler(val) {
                let box = document.getElementById("videoPlayTimeLineBack_ocx");
                let offsetWidth = box.offsetWidth;
                if (!checkKeys(this.playControl_ocx)) {
                    return;
                }
                if (val && !this.isShowPath) {
                    this.playControl_ocx.cuttingPartWindow(
                        offsetWidth - 300,
                        0,
                        300,
                        8888
                    );
                } else {
                    this.playControl_ocx.repairPartWindow(
                        offsetWidth - 300,
                        0,
                        300,
                        8888
                    );
                }
            },
        },
        playControlOcxVis(val) {
            if (!checkKeys(this.playControl_ocx)) {
                return;
            }
            if (val.includes(true)) {
                this.playControl_ocx.hideWebOcx();
            } else if (this.playControlMode === "ocx") {
                this.playControl_ocx.showWebOcx();
            }
        },
        dealVisible: {
            handler(val) {
                if (!checkKeys(this.playControl_ocx)) {
                    return;
                }
                let box = document.getElementById("videoPlayTimeLineBack_ocx");
                let offsetWidth = box.offsetWidth;
                if (val) {
                    this.playControl_ocx.cuttingPartWindow(
                        offsetWidth - 800,
                        0,
                        800,
                        10000 - 30
                    );
                } else {
                    this.playControl_ocx.repairPartWindow(
                        offsetWidth - 800,
                        0,
                        800,
                        1000 - 30
                    );
                }
            },
        },
        unhanderOpen: {
            handler(val) {
                if (!checkKeys(this.playControl_ocx)) {
                    return;
                }
                let box = document.getElementById("videoPlayTimeLineBack_ocx");
                let offsetWidth = box.offsetWidth;
                if (this.isShowPath) {
                    return;
                }
                if (val) {
                    this.playControl_ocx.cuttingPartWindow(
                        offsetWidth - 305,
                        0,
                        130,
                        70
                    );
                } else {
                    this.playControl_ocx.repairPartWindow(
                        offsetWidth - 305,
                        0,
                        130,
                        70
                    );
                }
            },
        },
        playState: {
            //停止播放的时候调一下接口查询设备状态
            handler(val) {
                if (!val) {
                    // this.getDeviceStatus();
                }
            },
        },
    },
    computed: {
        GpsTotal() {
            return this.historyTrajectoryTempData.length;
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
        playState() {
            if (!this.playControl_js) {
                return false;
            }
            return this.playControl_js.playState;
        },
        backHeght() {
            let height = Number(this.timeBarHeight.split("p")[0]);
            return `calc(100% - ${height + 36}px)`;
        },
        playControlOcxVis() {
            return [
                this.$store.getters.getResetPassword,
                this.$store.getters.getUpdateTipVisible,
                this.$store.getters.getQrcodeVisible,
                this.$store.getters.getAbout,
                this.$store.getters.getDownloadManual,
                this.$store.getters.getFeedbackDialogVisible,
                this.$store.getters.getDownLoadOpen,
            ];
        },
        isShowMenu() {
            return this.$store.getters.getIsShowMenu;
        },
        userActionOpen() {
            return this.$store.getters.getUserActionOpen;
        },
        dealVisible() {
            return this.$store.getters.getDealVisible;
        },
        isLoginOut() {
            return this.$store.getters.getIsLoginOut;
        },
        divHeight() {
            return this.$refs.treeDiv.offsetHeight;
        },
        unhanderOpen() {
            return this.$store.getters.getUnhanderOpen;
        },
        menuIndex() {
            return this.$store.getters.getMenuIndex;
        },
        videoBackListFormat() {
            if (!this.videoBackList.length) {
                return {};
            }
            let videoListFormat = {};
            this.videoBackList.forEach(({ channelName, files }) => {
                videoListFormat[channelName] = [];
                files.sort((a, b) => {
                    return a.startTime - b.startTime;
                });
                videoListFormat[channelName] = files;
            });
            let name = null;
            for (let nameText in videoListFormat) {
                if (!name) {
                    name = nameText;
                }
            }
            this.nowChannelName = name;
            return videoListFormat;
        },
        userHeight() {
            return this.$store.getters.getUserHeight;
        },
    },
    methods: {
        getTaskData() {
            let params = this.searchVideoForm;
            let startTime =
                this.selectDate +
                " " +
                Timer.getTime(this.searchVideoForm.time[0]);
            let endTime =
                this.selectDate +
                " " +
                Timer.getTime(this.searchVideoForm.time[1]);
            params.startTime = Timer.getDateTime(startTime);
            params.endTime = Timer.getDateTime(endTime);
            if (
                this.$moment(params.endTime).valueOf() -
                    this.$moment(params.startTime).valueOf() <
                0
            ) {
                this.$message({
                    type: "error",
                    // message: "开始时间不得小于结束时间",
                    message: this.$t(
                        "videoPlayback.startTimeNotLessThanEndTime"
                    ),
                });
                return;
            }
            let obj = {
                id: this.searchVideoForm.id,
                taskStartTime: params.startTime,
                taskEndTime: params.endTime,
            };
            this.$refs["g-table"].searchTable(obj);
        },
        resHander(res) {
            // res.results.forEach((item) => {
            //     let taskStartTime = item.taskStartTime;
            //     let taskEndTime = item.taskEndTime;
            //     let taskStartTime_M = taskStartTime ? moment(taskStartTime).startOf('day'):moment().startOf('day');
            //     let taskEndTimeTime_M =taskEndTime ? moment(taskEndTime).startOf('day'):moment().startOf('day');
            //     let taskStartTime_T = taskStartTime_M.valueOf();
            //     let taskEndTimeTime_T =taskEndTimeTime_M .valueOf();
            //     let list = [];
            //     while (taskEndTimeTime_T >= taskStartTime_T) {
            //         let item  = {
            //             label: taskStartTime_M.format("M[.]D"),
            //             value: taskStartTime_M.format("YYYY-MM-DD HH:mm:ss"),
            //         }
            //         list.push(item);
            //         taskStartTime_M.add(1, "day");
            //         taskStartTime_T = taskStartTime_M.valueOf();
            //     }
            //     item.list = list;
            // })
            res.list = res.results;
            res.total = res.totalRecords;
        },
        back(file, dateStr, dayEndTime, dayStartTime) {
            this.taskRecordVisible = false;
            this.deviceInfo.productKey = file.productKey;
            this.deviceInfo.deviceCode = file.deviceCode;
            let time = dateStr.replace(".", "-");
            time = new Date().getFullYear() + " " + time + " " + "00:00:00";
            this.selectDate = moment(time).format("YYYY-M-D");
            this.searchVideoForm.deviceCode = file.deviceCode;
            this.searchVideoForm.sTime = new Date(dayStartTime);
            this.searchVideoForm.eTime = new Date(dayEndTime);
            this.currentWachCar.id = file.carId;
            setTimeout(() => {
                this.searchVideoFun();
            }, 0);
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
        clearInterval() {
            this.statusInterval && clearInterval(this.statusInterval);
        },
        changeVoice() {
            let control = this.playControl_js.activeControlList.find((item) => {
                return item.voiceState;
            });
            if (control) {
                this.playControl_js.setVolume(
                    control.iWndNum,
                    this.settingForm.voice
                );
            }
        },
        openDownLoadFormEl(type, info) {
            if (type === "ocx") {
                this.downLoadFormEl.fileInfo = info;
                this.downLoadFormEl.startTime = info.startTime;
                this.downLoadFormEl.endTime = info.endTime;
            } else {
                let { startTime, endTime, channel } =
                    this.timeBar.getRectTimeAndFile();
                if (channel.length === 0) {
                    // this.$message.info("当前时间没有文件");
                    this.$message.info(this.$t("videoPlayback.noFiles"));
                    this.cancelDownLoadMode();
                    return;
                }
                let fileInfo = {
                    channel,
                    startTime,
                    endTime,
                };
                this.downLoadFormEl.startTime = startTime;
                this.downLoadFormEl.endTime = endTime;
                this.downLoadFormEl.fileInfo = fileInfo;
                this.cancelDownLoadMode();
            }
            this.downLoadFormEl.visible = true;
        },
        changeControl(playControlMode) {
            this.changeControlLoading = true;
            this.playControlMode = playControlMode;
            setTimeout(async () => {
                if (this.playControlMode === "ocx") {
                    this.playControl_js.stopRealPlayAll();
                    this.closeSetting();
                    this.cancelDownLoadMode();
                    await this.setPlayControl_oxcFile(this.videoBackList);
                    setTimeout(() => {
                        this.changeControlLoading = false;
                    }, 1000);
                    if (!this.currentPlayTime) {
                        return;
                    }
                    this.playControl_ocx.startPlaybackDllAtTime(
                        this.currentPlayTime
                    );
                } else {
                    if (checkKeys(this.playControl_ocx)) {
                        let currentPlayTime =
                            await this.playControl_ocx.getCurrentTime();
                        if (currentPlayTime) {
                            this.currentPlayTime = currentPlayTime;
                        }
                        this.playControl_ocx.stopPlayback();
                        this.playControl_ocx.hideWebOcx();
                    }
                    await this.setPlayControl_JsFile(this.videoBackList);
                    setTimeout(() => {
                        this.changeControlLoading = false;
                    }, 1000);
                    if (!this.currentPlayTime) {
                        return;
                    }
                    this.playControl_js_play(this.currentPlayTime);
                }
            }, 100);
        },
        stopRealPlayAll() {
            this.playControl_js.stopRealPlayAll();
        },
        togglePause() {
            if (!this.playState) {
                let currentFileInfo = this.timeBar.findFile(
                    this.currentPlayTime
                );
                currentFileInfo.forEach((item) => {
                    if (item) {
                        item.startTime = this.currentPlayTime;
                    }
                });
                this.playControl_js.togglePlay(currentFileInfo);
                this.timeBar.setMidLineTime(this.currentPlayTime);
            } else {
                this.playControl_js.togglePause();
            }
        },
        rePlay() {
            let currentFileInfo = this.timeBar.findFile(this.currentPlayTime);
            currentFileInfo.forEach((item) => {
                if (item) {
                    item.startTime = this.currentPlayTime;
                }
            });
            this.playControl_js.togglePlay(currentFileInfo);
            this.timeBar.setMidLineTime(this.currentPlayTime);
        },
        downLoadSingle(scope, $event) {
            if (this.singFileDownForm.startTimeH) {
                this.singFileDownForm.startTime =
                    this.searchVideoForm.startTime.substring(0, 10) +
                    " " +
                    this.singFileDownForm.startTimeH;
                this.singFileDownForm.endTime =
                    this.searchVideoForm.startTime.substring(0, 10) +
                    " " +
                    this.singFileDownForm.endTimeH;
            }
            let row = this.$deepCopy(scope.row);
            Object.assign(row, this.singFileDownForm);
            let params = {
                deviceCode: this.deviceInfo.deviceCode,
                productKey: this.deviceInfo.productKey,
                startTime: this.singFileDownForm.startTime,
                endTime: this.singFileDownForm.endTime,
                channelNo: row.channelNo,
                fileDownLoadType: this.singFileDownForm.fileDownLoadType,
                carNumber:
                    this.currentWachCar.label || this.currentWachCar.carNumber,
            };
            this.infoed = false;
            this.urlgetMultiFileVideoDownloadUrl(params, $event);
            this.$refs[`popover${scope.$index}`].doClose();
        },
        togglekeyFrame() {
            this.settingForm.keyFrame = !this.settingForm.keyFrame;
            this.playControl_js.togglekeyFrame(this.settingForm.keyFrame);
        },
        singPopoverShow(scope, flag, $event) {
            this.singHide();
            setTimeout(() => {
                let { startTime, endTime } = scope.row;
                let startTimeStamp = this.$moment(startTime).valueOf();
                let endTimeStamp = this.$moment(endTime).valueOf();
                if (endTimeStamp - startTimeStamp > 10 * 60 * 1000) {
                    this.singFileDownForm.startTimeH = startTime.substring(11);
                    this.singFileDownForm.endTimeH = this.$moment(
                        startTimeStamp + 10 * 60 * 1000
                    ).format("HH:mm:ss");
                    this.singFileDownForm.minTime = startTime.substring(11);
                    this.singFileDownForm.maxTime = endTime.substring(11);
                    // this.singFileDownForm.downloadTimeArray = [startTime, this.$moment(startTimeStamp + 10 * 60 * 1000).format("YYYY-MM-DD HH:mm:ss")];
                    // this.singFileDownForm.pickerOptions.selectableRange = `${startTime.substring(11)} - ${endTime.substring(11)}`;
                    // this.$set(this.singFileDownForm, 'pickTimeShow', true);
                    this.singFileDownForm.pickTimeShow = true;
                } else {
                    this.singFileDownForm.startTime = startTime;
                    this.singFileDownForm.endTime = endTime;
                }
                this.openPopover = `popover${scope.$index}`;
                if (flag) {
                    this.downLoadSingle(scope, $event);
                }
            }, 0);
        },
        singHide() {
            this.singFileDownForm = {
                fileDownLoadType: 2,
                startTimeH: "",
                endTimeH: "",
                minTime: "",
                maxTime: "",
                startTime: "",
                endTime: "",
                pickTimeShow: false,
            };
            this.openPopover = null;
        },
        toggleCoverType(type) {
            this.settingForm.coverType = type;
            this.$refs["popover-coverPreview"].doClose();
            this.playControl_js.updateCoverType(type);
            this.saveSetting();
        },
        toggleSpeedType(type) {
            this.playControl_js.toggleSpeed(type);
            this.settingForm.speedType = type;
            this.$refs["popover-speed"].doClose();
            this.saveSetting();
        },
        captureAll() {
            this.playControl_js.capturePictureAll();
        },
        fullScreen() {
            this.playControl_js.fullScreenDisplay(true);
        },
        showSettingPopover() {
            this.settingShow = true;
            this.settingForm_O = this.$deepCopy(this.settingForm);
        },
        saveSetting() {
            let { keyList } = compareChange(
                this.settingForm_O,
                this.settingForm
            );
            if (keyList.includes("textPosition")) {
                this.playControl_js.toggleTextPosition();
            }
            let temp = this.$deepCopy(this.settingForm);
            delete temp.speedType;
            delete temp.coverType;
            delete temp.keyFrame;
            localStorage.setItem("videoBackSetting", JSON.stringify(temp));
            this.settingShow = false;
        },
        closeSetting() {
            this.settingShow = false;
            Object.assign(this.settingForm, this.settingForm_O);
            // this.settingForm = this.$deepCopy(this.settingForm_O);
            this.settingForm_O = {};
        },
        closeEl() {
            this.downLoadFormEl = {
                visible: false,
                fileInfo: {},
                startTime: "",
                endTime: "",
                fileDownLoadType: 2,
            };
            if (this.playControlMode === "ocx") {
                this.playControl_ocx.showWebOcx();
            }
        },
        downloadByOwner($event) {
            this.infoed = false;
            let { channel, endTime, startTime } = this.downLoadFormEl.fileInfo;
            let pArr = [];
            channel.forEach((channel) => {
                let params = {
                    deviceCode: this.deviceInfo.deviceCode,
                    productKey: this.deviceInfo.productKey,
                    startTime,
                    endTime,
                    channelNo: channel,
                    fileDownLoadType: this.downLoadFormEl.fileDownLoadType,
                    carNumber:
                        this.currentWachCar.label ||
                        this.currentWachCar.carNumber,
                };
                pArr.push(this.urlgetMultiFileVideoDownloadUrl(params, $event));
            });
            // Promise.any(pArr).then(res=>{
            //     this.$message.info("录像文件设备上传指平台中，该过程可能持续几分钟，请耐心等待，上传完毕请前往下载中心下载");
            // });
            this.downLoadFormEl.visible = false;
            if (this.playControlMode === "ocx") {
                this.playControl_ocx.showWebOcx();
            }
        },
        // 最多双通道播放
        changeChannelList(list) {
            if (list.length > 1) {
                this.searchVideoForm.channelNoList.shift();
            }
            // if (list.length > 1) {
            //     this.$message.warning("最多支持一路通道播放~");
            //     this.searchVideoForm.channelNoList =
            //         this.searchVideoForm.channelNoList.slice(0, -1);
            // }
        },
        // 最多双通道播放
        changeChannelList2(list) {
            if (list.length > 1) {
                this.downLoadForm.channelList.shift();
            }
            // if (list.length > 1) {
            //     this.$message.warning("最多支持一路通道播放~");
            //     this.searchVideoForm.channelNoList =
            //         this.searchVideoForm.channelNoList.slice(0, -1);
            // }
        },
        // 当前录像标识
        tableRowClassName({ row, rowIndex }) {
            // 获取当前进度条时间
            let currentPlayTimeSec = this.timeToSec(this.currentPlayTime);
            // 判断当前时间是否在录像文件的时间范围内，是则返回className为selected-row
            if (
                currentPlayTimeSec >= this.timeToSec(row.startTime) &&
                currentPlayTimeSec <= this.timeToSec(row.endTime)
            ) {
                this.selectedRow = rowIndex;
                return "selected-row";
            }
            return "un-selected-row";
        },
        // 刷新组织树
        visibleChange(visible) {
            if (visible) {
                this.reflash();
            }
        },
        setDeault() {
            let videoPlaybackCar = JSON.parse(
                sessionStorage.getItem("videoItem")
            );
            if (videoPlaybackCar) {
                setTimeout(() => {
                    this.searchForm.deviceCode = videoPlaybackCar.deviceCode;
                    // this.searchForm.plateArr = [
                    //     {
                    //         plateNum: videoPlaybackCar.plateNum,
                    //         id: videoPlaybackCar.carId,
                    //     },
                    // ];
                    this.currentWachCar = {
                        ...videoPlaybackCar,
                        deviceId: videoPlaybackCar.id,
                        html: `<span>${
                            videoPlaybackCar.plateNum || "--"
                        }</span>；<span>${
                            videoPlaybackCar.deviceCode || "--"
                        }</span>；<span>${
                            videoPlaybackCar.deviceSerialNum || "--"
                        }</span>；<span>${videoPlaybackCar.vin || "--"}</span>`,
                        title: `${videoPlaybackCar.plateNum || "--"}；${
                            videoPlaybackCar.deviceCode || "--"
                        }；${videoPlaybackCar.deviceSerialNum || "--"}；${
                            videoPlaybackCar.vin || "--"
                        }`,
                    };
                    setTimeout(() => {
                        if (videoPlaybackCar.collectTime) {
                            this.selectDate = this.$moment(
                                videoPlaybackCar.collectTime
                            ).format("YYYY-M-D");
                            this.searchVideoForm.sTime = new Date(
                                videoPlaybackCar.collectTime
                            );
                        }
                        if (
                            videoPlaybackCar.endTime &&
                            this.$moment(videoPlaybackCar.collectTime).format(
                                "YYYY-M-D"
                            ) ===
                                this.$moment(videoPlaybackCar.endTime).format(
                                    "YYYY-M-D"
                                )
                        ) {
                            this.searchVideoForm.eTime = new Date(
                                videoPlaybackCar.endTime
                            );
                        }
                        let month = this.$moment(
                            videoPlaybackCar.collectTime
                        ).format("M");
                        while (month < new Date().getMonth() + 1) {
                            this.$refs["date-pannel"].changeMonth(-1);
                            month++;
                        }
                        setTimeout(() => {
                            this.searchVideoFun();
                        }, 100);
                        sessionStorage.removeItem("videoItem");
                    }, 500);
                }, 500);
            } else if (this.$store.state.tree.defaultMaintenanceCar) {
                let defaultMaintenanceCar = JSON.parse(
                    this.$store.state.tree.defaultMaintenanceCar
                );
                this.searchForm.deviceCode = defaultMaintenanceCar.deviceCode;
                this.currentWachCar = defaultMaintenanceCar;
            }
            // sessionStorage.removeItem("videoItem");
        },
        enterDownloadMode() {
            this.downLoadForm.downloadTimeVisible = false;
            this.checked = false;
            if (this.playControlMode === "js") {
                this.timeBar.enterDownloadMode();
                this.downLoadMode_js = true;
            } else {
                this.playControl_ocx.enterDownloadMode();
            }
        },
        async confirmPre() {
            this.sendAccMsgShow = false;
            try {
                let res = await this.$api.getSleepByDeevicecode({
                    deviceCode: this.currentWachCar.deviceCode,
                });
                if (res && res.success && res.data) {
                    // 0-无法预览(离线),1-可以预览(在线/浅休眠),2-可唤醒预览(深睡眠可唤醒变浅休眠)
                    if (res.data.r19 == 1) {
                        this.searchVideoFun();
                    } else if (res.data.r24 === 1 && res.data.r19 == 2) {
                        this.$api
                            .wakeUpSleepingDevice({
                                deviceCode: this.searchVideoForm.deviceCode,
                            })
                            .then((res) => {
                                if (res.success) {
                                    // "已向设备下发唤醒指令，静待1分钟左右设备将重新上线！"
                                    this.$message.success(
                                        this.$t(
                                            "videoPlayback.issueWakeupCommand"
                                        )
                                    );
                                    this.sendAccMsgShow = false;
                                } else {
                                    // 下发唤醒失败！
                                    this.$message.error(
                                        this.$t("videoPlayback.wakeupFailed")
                                    );
                                }
                            });
                    }
                }
            } catch (e) {
                console.error(e);
            }
        },
        changeShowTree() {
            this.isShowTree = !this.isShowTree;
            // this.$forceUpdate();
            this.$nextTick(() => {
                this.playControl_js && this.playControl_js.reSizeResize();
                checkKeys(this.playControl_ocx) &&
                    this.playControl_ocx.pageResizeAdjust();
            });
        },
        getNameById(id, list, key, text) {
            let item = list.filter((val) => {
                return val[key] == id;
            });
            return item[0][text];
        },
        dayPick(date) {
            this.selectDate = date;
        },
        onEnterpriseSelected(data, node, nodeArr) {
            if (data.type == 3) {
                this.currentWachCar = { ...data };
                this.currentWachCar.carNumber = this.currentWachCar.label;
                this.searchVideoForm.deviceCode = data.deviceCode;
                this.$set(this.searchVideoForm, "channelNo", "");
                //选择日期默认为当天
                let now = new Date();
                this.selectDate =
                    now.getFullYear() +
                    "-" +
                    (now.getMonth() + 1) +
                    "-" +
                    now.getDate();
                //获取设备通道号数
                let obj = { carId: data.id };
                this.handleSelect(obj);
            } else {
                this.currentWachCar = {};
                this.searchVideoForm.deviceCode = "";
                //设备通道号数置空
                let obj = { carId: "" };
                this.handleSelect(obj);
            }
        },
        handleSelect(obj) {
            if (obj.deviceCode != "") {
                obj.abilityCode = "videolist";
                //获取设备通道数
                this.$api.getVideoPlayDeviceInfoByCarId(obj).then((res) => {
                    if (res.success) {
                        this.channelList = res.data.channelList;
                        this.deviceInfo.deviceCode = res.data.deviceCode;
                        this.deviceInfo.productKey = res.data.productKey;
                        this.searchVideoForm.deviceCode = res.data.deviceCode;
                        if (res.data.channelList.length > 0) {
                            this.$set(this.searchVideoForm, "channelNoList", [
                                res.data.channelList[0].channelNum,
                            ]);
                        }
                        let videoPlaybackCar = JSON.parse(
                            sessionStorage.getItem("videoItem")
                        );
                        if (
                            videoPlaybackCar &&
                            videoPlaybackCar.channelNum > 0
                        ) {
                            this.$set(this.searchVideoForm, "channelNoList", [
                                videoPlaybackCar.channelNum,
                            ]);
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            } else {
                this.channelList = [];
                this.$set(this.searchVideoForm, "channelNo", "");
            }
        },
        preSearch() {
            if (this.searchVideoForm.deviceCode == "") {
                this.$message({
                    type: "error",
                    // message: "车牌号不能为空",
                    message: this.$t(
                        "videoPlayback.licensePlateNumberCannotBeEmpty"
                    ),
                });
                return;
            }
            if (this.selectDate == "") {
                this.$message({
                    type: "error",
                    // message: "日期不能为空",
                    message: this.$t("videoPlayback.dateCannotBeEmpty"),
                });
                return;
            }
            if (this.currentWachCar.status === 2) {
                this.sendAccMsgShow = true;
                return;
            }
            if (
                this.currentWachCar.deviceStatus === 2 &&
                this.currentWachCar.dormantStatus != 2
            ) {
                this.awakenVisible = true;
                this.awakenTime = 0;
                this.awakenDeviceId = this.currentWachCar.deviceId;
                return;
            }
            this.clearInterval();
            this.playControl_js && this.playControl_js.stopRealPlayAll();
            checkKeys(this.playControl_ocx) &&
                this.playControl_ocx.stopPlayback();
            this.searchVideoFun();
        },
        cancelDownLoadMode() {
            this.downLoadMode_js = false;
            this.timeBar.cancelDownLoadMode();
        },
        searchVideoFun() {
            if (this.searchVideoForm.deviceCode == "") {
                this.$message({
                    type: "error",
                    // message: "车牌号不能为空",
                    message: this.$t(
                        "videoPlayback.licensePlateNumberCannotBeEmpty"
                    ),
                });
                return;
            }
            if (this.selectDate == "") {
                this.$message({
                    type: "error",
                    // message: "日期不能为空",
                    message: this.$t("videoPlayback.dateCannotBeEmpty"),
                });
                return;
            }
            this.$refs.searchVideoForm.validate(async (valid) => {
                if (valid) {
                    let params = this.searchVideoForm;
                    let startTime =
                        this.selectDate +
                        " " +
                        Timer.getTime(this.searchVideoForm.time[0]);
                    let endTime =
                        this.selectDate +
                        " " +
                        Timer.getTime(this.searchVideoForm.time[1]);
                    params.startTime = Timer.getDateTime(startTime);
                    params.endTime = Timer.getDateTime(endTime);
                    params.plateNum = this.currentWachCar.plateNum;
                    if (
                        this.$moment(params.endTime).valueOf() -
                            this.$moment(params.startTime).valueOf() <
                        0
                    ) {
                        this.$message({
                            type: "error",
                            // message: "开始时间不得小于结束时间",
                            message: this.$t(
                                "videoPlayback.startTimeNotLessThanEndTime"
                            ),
                        });
                        return;
                    }
                    this.searchVideoLoading = true;
                    this.traceDataLoading = true;
                    this.videoList = [];
                    this.videoBackList = [];
                    //初始化
                    this.currentPlayTime = "";
                    this.selectedRow = -1;
                    //初始化地图参数
                    this.traceSlice = [];
                    this.runTrace = [];
                    this.carPointTrajectory = null;
                    this.cancelDownLoadMode();
                    let p1 = this.getTraceData(params).finally(() => {
                        this.traceDataLoading = false;
                    });
                    let p2 = this.getvideoListFun(params).finally(() => {
                        this.searchVideoLoading = false;
                    });
                    Promise.all([p1, p2])
                        .then(() => {
                            if (this.playControlMode === "js") {
                                this.playControl_js.stopRealPlayAll();
                                this.setPlayControl_JsFile(this.videoBackList);
                                this.playControl_js_play(
                                    this.playInfo_js.firstPlayTime
                                );
                            } else {
                                this.playControl_ocx.stopPlayback();
                                this.setPlayControl_oxcFile(this.videoBackList);
                                this.playControl_ocx.startPlaybackDllAtTime(
                                    this.playInfo_ocx.firstPlayTime
                                );
                            }
                            if (this.videoBackList.length === 0) {
                                this.$refs.onlineOfflineRecords.equipmentInspectionDeviceOnlineRecord();
                                // this.$message.info("当前录像为空");
                                this.$message.info(
                                    this.$t(
                                        "videoPlayback.currentRecordingIsEmpty"
                                    )
                                );
                            }
                            if (this.isShowPath) {
                                this.sliceTraceArr();
                            }
                        })
                        .catch((e) => {
                            this.searchVideoLoading = false;
                        });
                }
            });
        },
        formatVideoList(videoBackList) {
            videoBackList.forEach(({ infos }) => {
                if (infos && infos.length > 0) {
                    let info = infos[0];
                    let s_startTimeStamp = this.$moment(
                        this.searchVideoForm.startTime
                    ).valueOf();
                    let e_endTimeStamp = this.$moment(
                        this.searchVideoForm.endTime
                    ).valueOf();
                    if (info.startTimeStamp < s_startTimeStamp) {
                        info.startTimeStamp = s_startTimeStamp;
                        info.startTime = this.searchVideoForm.startTime;
                    }
                    let infoLast = infos[infos.length - 1];
                    if (infoLast.endTime > e_endTimeStamp) {
                        infoLast.endTimeStamp = e_endTimeStamp;
                        info.endTime = this.searchVideoForm.endTime;
                    }
                }
            });
            return videoBackList;
        },
        getvideoListFun(params) {
            let p = (param) => {
                return new Promise((resovle, reject) => {
                    this.$api
                        .getVideoList(param)
                        .then((res) => {
                            if (res.success) {
                                this.$api.eventTrackTrigger({
                                    menu: "VIDEO_PLAYBACK",
                                    business: "VIDEO_PLAYBACK_LIST",
                                    eventResult: res.success,
                                });
                                resovle(res.data);
                            } else {
                                this.$message.error(res.msg);
                                reject();
                            }
                        })
                        .catch(() => {
                            reject();
                        });
                });
            };
            return new Promise((resolve, reject) => {
                let pList = [];
                params.channelNoList.forEach((channelNo) => {
                    let tempParam = { ...params };
                    tempParam.channelNo = channelNo;
                    pList.push(p(tempParam));
                });
                let videoBackList = [];
                Promise.all(pList)
                    .then(async (resList) => {
                        this.searchVideoLoading = false;
                        this.currentPlayTime = "";
                        resList.forEach((videoList) => {
                            let fileList = [];
                            if (JSON.stringify(videoList) !== "{}") {
                                let id = 0;
                                for (let key in videoList) {
                                    let timeVideo = videoList[key];
                                    timeVideo.forEach((item, index) => {
                                        videoList[key][index].startTimeStamp =
                                            this.$moment(
                                                item.startTime
                                            ).valueOf();
                                        videoList[key][index].endTimeStamp =
                                            this.$moment(
                                                item.endTime
                                            ).valueOf();
                                        videoList[key][index].id = id;
                                        videoList[key][index].downType = null;
                                        fileList.push(videoList[key][index]);
                                        id++;
                                    });
                                }
                                videoBackList.push({
                                    channel: fileList[0].channelNo,
                                    channelName: this.getNameById(
                                        fileList[0].channelNo,
                                        this.channelList,
                                        "channelNum",
                                        "channelName"
                                    ),
                                    files: [],
                                });
                                videoBackList[videoBackList.length - 1].files =
                                    fileList;
                            }
                        });
                        this.videoBackList =
                            this.formatVideoList(videoBackList);
                        // if (this.playControlMode === "js") {
                        //     this.playControl_js.stopRealPlayAll();
                        //     await this.setPlayControl_JsFile(
                        //         this.videoBackList
                        //     );
                        //     this.playControl_js_play(
                        //         this.playInfo_js.firstPlayTime
                        //     );
                        // } else {
                        //     this.playControl_ocx.stopPlayback();
                        //     await this.setPlayControl_oxcFile(
                        //         this.videoBackList
                        //     );
                        //     this.playControl_ocx.startPlaybackDllAtTime(
                        //         this.playInfo_ocx.firstPlayTime
                        //     );
                        // }
                        // if (this.videoBackList.length === 0) {
                        //     this.$message.info("当前录像为空");
                        // }
                        resolve();
                    })
                    .catch((e) => {
                        reject();
                    });
            });
        },
        playControl_js_play(currentPlayTime) {
            if (!currentPlayTime) {
                return;
            }
            let currentFileInfo = [null, null];
            let [fileOne, fileTwo] = this.timeBar.findFile(currentPlayTime);
            if (fileOne) {
                currentFileInfo[0] =
                    this.playControl_js.timeBarFileInfo[0][fileOne.j];
            }
            if (fileTwo) {
                currentFileInfo[1] =
                    this.playControl_js.timeBarFileInfo[1][fileTwo.j];
            }
            currentFileInfo.forEach((item) => {
                if (item) {
                    item.currentPlayTime = currentPlayTime;
                }
            });
            this.playControl_js.playAll(currentFileInfo);
            this.timeBar.setMidLineTime(currentPlayTime);
            this.currentPlayTime = currentPlayTime;
        },
        getReplayUrl(item) {
            this.currentPlayFile = { ...item };
            this.currentPlayTime = item.startTime;
            if (this.playControlMode === "js") {
                this.playControl_js.stopRealPlayAll();
                this.playControl_js_play(this.currentPlayTime);
            } else {
                this.playControl_ocx.startPlaybackDllAtTime(
                    this.currentPlayTime
                );
            }
            if (this.isShowPath) {
                this.sliceTraceArr();
            }
        },
        async setPlayControl_JsFile(videoBackList) {
            if (videoBackList && videoBackList.length > 0) {
                this.startVideoTime = videoBackList[0].files[0].startTime;
                this.endVideoTime =
                    videoBackList[0].files[
                        videoBackList[0].files.length - 1
                    ].endTime;
                let fileList = [[], []];
                videoBackList.forEach(
                    ({ channel, files, channelName }, index) => {
                        fileList[index] = files.map(
                            ({ startTime, endTime, fileSize, avEncoding }) => {
                                return {
                                    startTime,
                                    stopTime: endTime,
                                    iWndNum: channel,
                                    channelName,
                                    fileSize,
                                    avEncoding,
                                };
                            }
                        );
                    }
                );
                if (fileList[1].length === 0) {
                    this.changeTimebarHeight("one");
                } else {
                    this.changeTimebarHeight("two");
                }
                this.timeBar.clearFileList();
                let { currentPlayTime } = this.timeBar.addFileList(fileList);
                let channelList = videoBackList.map(({ channel }) => {
                    return channel;
                });
                let channelNamelist = this.channelList.map(
                    ({ channelNum, channelName }) => {
                        return { channelNum, channelName };
                    }
                );
                let deviceChannelList = {
                    deviceCode: this.deviceInfo.deviceCode,
                    productKey: this.deviceInfo.productKey,
                    protocolType: 1,
                    streamType: 1,
                    channelList,
                    channelNamelist,
                    plate:
                        this.currentWachCar.label ||
                        this.currentWachCar.carNumber,
                };
                this.playInfo_js.deviceChannelList = deviceChannelList;
                this.playControl_js.timeBarFileInfo = fileList;
                this.playInfo_js.firstPlayTime = currentPlayTime;
                await this.playControl_js.setDeviceChannelList(
                    this.playInfo_js.deviceChannelList
                );
                return Promise.resolve();
            } else {
                this.playInfo_js.deviceChannelList = {
                    deviceCode: this.deviceInfo.deviceCode,
                    productKey: this.deviceInfo.productKey,
                    protocolType: 1,
                    streamType: 1,
                    channelList: [],
                    plate:
                        this.currentWachCar.label ||
                        this.currentWachCar.carNumber,
                };
                this.changeTimebarHeight("one");
                this.timeBar.reinitTimeBar();
                this.playInfo_js.firstPlayTime = null;
                this.playInfo_js.timeBarFileInfo = null;
                await this.playControl_js.setDeviceChannelList(
                    this.playInfo_js.deviceChannelList
                );
                return Promise.resolve();
            }
        },
        async setPlayControl_oxcFile(videoBackList) {
            let fileInfo = {
                infos: [],
                minTime: this.searchVideoForm.startTime,
                maxTime: this.searchVideoForm.endTime,
                devSerialNum: this.deviceInfo.deviceCode,
                productKey: this.deviceInfo.productKey,
                plate:
                    this.currentWachCar.label || this.currentWachCar.carNumber,
            };
            if (videoBackList && videoBackList.length > 0) {
                fileInfo.infos = videoBackList;
            } else {
                fileInfo.infos = [];
            }
            if (!checkKeys(this.playControl_ocx)) {
                await this.initPlayControl_ocx();
            }
            this.playControl_ocx.showWebOcx();
            this.playInfo_ocx.firstPlayTime =
                await this.playControl_ocx.setPlaybackMultiChanFiles(fileInfo);
            return true;
        },
        changeTimebarHeight(type) {
            if (type === "one") {
                this.timeBarHeight = "62px";
                this.$nextTick(() => {
                    this.playControl_js.reSizeResize();
                });
            } else {
                this.timeBarHeight = "90px";
                this.$nextTick(() => {
                    this.playControl_js.reSizeResize();
                });
            }
        },
        getTraceData(params) {
            this.historyTrajectoryTempData = [];
            this.GPSData = [];
            params.carId = this.currentWachCar.id;
            return new Promise((resolve, reject) => {
                // getGpsListByCarId
                getGpsData(params)
                    .then((gpsList) => {
                        this.historyTrajectoryTempData =
                            this.historyTrajectoryTempData.concat(gpsList);
                        if (this.historyTrajectoryTempData.length == 0) {
                            resolve();
                            return;
                        }
                        this.historyTrajectoryTempData.forEach((item) => {
                            let { lng, lat } = GpsConverter.gps_gaode(
                                item.longitude,
                                item.latitude
                            );
                            item.lng = lng;
                            item.lat = lat;
                        });
                        this.historyTrajectory =
                            this.historyTrajectoryTempData.map((item) => {
                                return {
                                    lng: item.longitude,
                                    lat: item.latitude,
                                };
                            });
                        this.handGPStableData();
                        // this.center = new AMap.LngLat(this.historyTrajectoryTempData[0].lng, this.historyTrajectoryTempData[0].lat);
                        if (this.videoPlayType == 1) {
                            setTimeout(() => {
                                // let view = this.map.getViewport(this.historyTrajectoryTempData); //获取最佳视角
                                // let zoom = view.zoom; //获取最佳视角的缩放层级
                                // let centerPoint = view.center; //获取最佳视角的中心点
                                // this.map.centerAndZoom(centerPoint, zoom); //设置中心点和缩放层级,单个点缩放层级太大
                                // this.map.setFitView();
                            }, 200);
                        }

                        resolve();
                    })
                    .catch(() => {
                        this.historyTrajectoryLoading = false;
                    });
            });
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
        handGPStableData() {
            if (this.GpsTotal > 0) {
                let start =
                    (this.GpsParams.currentPage - 1) * this.GpsParams.pageSize;
                let end = this.GpsParams.currentPage * this.GpsParams.pageSize;
                let a = JSON.parse(
                    JSON.stringify(this.historyTrajectoryTempData)
                );
                let data = a.slice(start, end);
                // data.forEach((item) => {
                //     item.address = "";
                // });
                // transferAddress(data, "longitude", "latitude", "address");
                // data.forEach((item, index) => {
                //     getBaiduAddress(item, "lngBaidu", "latBaidu", "address");
                // });
                this.GPSData = data;
            } else {
                this.GPSData = [];
            }
        },
        sliceTraceArr() {
            if (this.traceDataLoading) {
                this.$message({
                    type: "warning",
                    // message: "轨迹加载中，请耐心等待~",
                    message: this.$t("videoPlayback.trajectoryLoading"),
                });
                return;
            }
            let startTimeS = this.timeToSec(this.startVideoTime);
            let endTimeS = this.timeToSec(this.endVideoTime);
            this.traceSlice = []; // 轨迹点数组
            let historyTrajectoryTempData = this.historyTrajectoryTempData;
            var startIndex = 0;
            let endIndex = 0;
            let historyTrajectoryStart =
                historyTrajectoryTempData.length > 0
                    ? this.timeToSec(historyTrajectoryTempData[0].collectTime)
                    : 0;
            let historyTrajectoryEnd =
                historyTrajectoryTempData.length > 0
                    ? this.timeToSec(
                          historyTrajectoryTempData[
                              historyTrajectoryTempData.length - 1
                          ].collectTime
                      )
                    : 0;
            if (
                historyTrajectoryEnd < startTimeS ||
                historyTrajectoryStart > endTimeS
            ) {
                setTimeout(() => {
                    this.$message({
                        type: "warning",
                        // message: "该时间段内轨迹点为空",
                        message: this.$t("videoPlayback.trajectoryPointsEmpty"),
                    });
                }, 1);
                return;
            } else {
                //如果视频开始时间小于轨迹开始时间，则第一个轨迹点作为起点
                if (startTimeS <= historyTrajectoryStart) {
                    startIndex = 0;
                }
                //如果视频结束时间大于轨迹结束时间，则最后一个轨迹点作为终点
                if (endTimeS >= historyTrajectoryEnd) {
                    endIndex = historyTrajectoryTempData.length - 1;
                }
            }
            if (historyTrajectoryTempData.length > 2) {
                for (let i = 0; i < historyTrajectoryTempData.length - 1; i++) {
                    let historyTrajectorySec = this.timeToSec(
                        this.historyTrajectoryTempData[i].collectTime
                    );
                    let historyTrajectorySecNext = this.timeToSec(
                        this.historyTrajectoryTempData[i + 1].collectTime
                    );
                    if (
                        historyTrajectorySec <= startTimeS &&
                        historyTrajectorySecNext > startTimeS
                    ) {
                        //起点为i
                        startIndex = i;
                    }
                    if (
                        historyTrajectorySec < endTimeS &&
                        historyTrajectorySecNext >= endTimeS
                    ) {
                        endIndex = i + 1;
                    }
                    if (startIndex < endIndex) {
                        break;
                    }
                }
            } else {
            }
            if (startIndex != undefined && endIndex != undefined) {
                this.traceSlice = historyTrajectoryTempData.slice(
                    startIndex,
                    endIndex + 1
                );
            }
        },
        getRunTraceArr(currentTime) {
            if (!currentTime) {
                return;
            }
            if (this.traceSlice.length == 0) {
                return;
            }
            let traceSlice = this.traceSlice;
            let currentTimeSec = this.timeToSec(currentTime);
            let index = 0;
            for (let i = 0; i < traceSlice.length - 1; i++) {
                let traceSliceSec = this.timeToSec(traceSlice[i].collectTime);
                let traceSliceSecNext = this.timeToSec(
                    traceSlice[i + 1].collectTime
                );
                if (
                    traceSliceSec <= currentTimeSec &&
                    traceSliceSecNext > currentTimeSec
                ) {
                    index = i;
                }
            }
            if (index != undefined) {
                this.runTrace = traceSlice.slice(0, index + 1);
                let point = new AMap.LngLat(
                    traceSlice[index].lng,
                    traceSlice[index].lat
                );
                point.direction = traceSlice[index].direction;
                this.carPointTrajectory = point;
            }
        },
        getvideoBackSetting() {
            let videoBackSetting = localStorage.getItem("videoBackSetting");
            if (videoBackSetting) {
                Object.assign(this.settingForm, JSON.parse(videoBackSetting));
            }
        },
        timeToSec(time) {
            time = time.replace("-", "/");
            var oDate1 = new Date(time);
            return oDate1.getTime();
        },
        openDownloadVideo() {
            this.downLoadForm.downloadTimeVisible = true;
            this.$refs["downLoadForm"].resetFields();
            this.checked = false;
        },
        getDownloadVideoList($event) {
            this.infoed = false;
            this.$refs["downLoadForm"].validate((validate) => {
                if (!validate) return;
                let pArr = [];
                this.downLoadForm.channelList.forEach((channel) => {
                    let params = {
                        deviceCode: this.deviceInfo.deviceCode,
                        productKey: this.deviceInfo.productKey,
                        startTime:
                            this.searchVideoForm.startTime.substring(0, 10) +
                            " " +
                            this.downLoadForm.downloadTime[0],
                        endTime:
                            this.searchVideoForm.startTime.substring(0, 10) +
                            " " +
                            this.downLoadForm.downloadTime[1],
                        channelNo: channel,
                        fileDownLoadType: this.downLoadForm.fileDownLoadType,
                        carNumber:
                            this.currentWachCar.label ||
                            this.currentWachCar.carNumber,
                    };
                    pArr.push(
                        this.urlgetMultiFileVideoDownloadUrl(params, $event)
                    );
                });
            });
        },
        downloadAvi(event) {
            // 提示文字
            // !this.infoed &&
            //     this.$message.info(
            //         "录像文件设备上传至平台中，该过程可能持续几分钟，请耐心等待，上传完毕请前往下载中心下载"
            //     ) &&
            //     (this.infoed = true);
            // 动效
            let self = document.getElementById("download-task");
            let left =
                self.getBoundingClientRect().left +
                document.documentElement.scrollLeft -
                6;
            let top =
                self.getBoundingClientRect().top +
                document.documentElement.scrollTop +
                self.offsetHeight -
                27;
            let obj = {
                tx: left,
                ty: top,
                cx: event.clientX,
                cy: event.clientY,
            };
            this.$bas.$emit("downloadEvent", obj);
        },
        getUpLoadUrl(item, $event) {
            let fileInfo = {
                mediaType: item.mediaType,
                storeType: item.storeType,
                streamType: item.streamType,
                eventCode: item.eventCode,
                deviceCode: this.deviceInfo.deviceCode,
                productKey: this.deviceInfo.productKey,
                channelNum: item.channelNo,
                startTime: item.startTime,
                endTime: item.endTime,
                fileSize: item.fileSize,
                fileDownLoadType: item.fileDownLoadType,
                carNumber:
                    this.currentWachCar.label || this.currentWachCar.carNumber,
                channelNo: item.channelNo,
            };
            this.$api.getVideoDownloadUrl(fileInfo).then(async (res) => {
                if (res.success) {
                    let data = res.data;
                    switch (Number(data.flag)) {
                        case 0:
                            this.downloadAvi($event); // 下载指引特效
                            this.$store.commit(
                                "setUploadingList",
                                (uploadingList) => {
                                    let exist = uploadingList.find((item) => {
                                        return item.id === res.data.id;
                                    });
                                    if (exist) return;
                                    uploadingList.push({
                                        id: res.data.id,
                                        params: fileInfo,
                                    });
                                }
                            );
                            break;
                        case 1:
                            this.downloadAvi($event); // 下载指引特效
                            if (
                                Object.keys(
                                    this.$store.state.downloadManage
                                        .downLoadingStatusMap
                                ).includes(data.id + "")
                            ) {
                                return;
                            }
                            for (let i = 0; i <= data.urlList.length - 1; i++) {
                                await xhrPullFile(
                                    data.urlList[i],
                                    ({ status, msg }) => {
                                        if (status === "progress") {
                                            this.$store.commit(
                                                "setDownLoadingStatusMap",
                                                (downLoadingStatusMap) => {
                                                    downLoadingStatusMap[
                                                        data.id
                                                    ].progress = msg;
                                                }
                                            );
                                        } else if (status === "success") {
                                            transFormAndDownLoad(
                                                msg,
                                                formatDownLoadName(
                                                    `${fileInfo.plateNum}_通道${fileInfo.channelNo}_${fileInfo.startTime}`,
                                                    data.urlList[i]
                                                ),
                                                fileInfo.fileDownLoadType ===
                                                    1 ||
                                                    fileInfo.fileDownLoadType ===
                                                        undefined
                                                    ? "5"
                                                    : "2"
                                            );
                                            this.$store.commit(
                                                "setDownLoadingStatusMap",
                                                (downLoadingStatusMap) => {
                                                    this.$delete(
                                                        downLoadingStatusMap,
                                                        data.id
                                                    );
                                                }
                                            );
                                        } else if (status === "begin") {
                                            this.$store.commit(
                                                "setDownLoadingStatusMap",
                                                (downLoadingStatusMap) => {
                                                    this.$set(
                                                        downLoadingStatusMap,
                                                        data.id,
                                                        {
                                                            progress: 0,
                                                            xhr: msg,
                                                        }
                                                    );
                                                }
                                            );
                                        } else if (status === "error") {
                                            // this.$message.error("录像下载失败");
                                            this.$message.error(
                                                this.$t(
                                                    "videoPlayback.videoDownloadFailed"
                                                )
                                            );
                                            this.$store.commit(
                                                "setDownLoadingStatusMap",
                                                (downLoadingStatusMap) => {
                                                    this.$delete(
                                                        downLoadingStatusMap,
                                                        data.id
                                                    );
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                            break;
                        case 2:
                            // this.$message.error("文件上传失败");
                            this.$message.error(
                                this.$t("videoPlayback.fileUploadFailed")
                            );
                            break;
                    }
                } else {
                    // this.$message.error("文件上传失败");
                    this.$message.error(
                        this.$t("videoPlayback.fileUploadFailed")
                    );
                }
            });
            // })
            // .catch(_ => {});
        },
        setPlatBackCallbacks(obj) {
            obj.JS_SetWindowControlCallback({
                cbIntegrationCallBack: this.cbPlatBackIntegrationCallBack,
            });
        },
        urlgetMultiFileVideoDownloadUrl(params, $event) {
            let pro = new Promise((resolve, reject) => {
                this.$api
                    .urlgetMultiFileVideoDownloadUrl(params)
                    .then(async (res) => {
                        if (res.success) {
                            this.$api.eventTrackTrigger({
                                menu: "VIDEO_PLAYBACK",
                                business: "VIDEO_PLAYBACK_DOWNLOAD",
                                eventResult: res.success,
                            });
                            let data = res.data;
                            this.downloadAvi($event);
                            let _this = this;
                            this.$message.success(
                                // "已向设备下发下载指令，请到下载中心查看任务！",
                                this.$t("videoPlayback.issueDownloadCommand"),
                                2000
                            );
                            // _this.downloadInterval = window.setInterval(
                            //     function () {
                            //         _this.$api
                            //             .getFileUploadStatus({
                            //                 key: data.key,
                            //                 deviceCode:
                            //                     _this.deviceInfo.deviceCode,
                            //                 productKey:
                            //                     _this.deviceInfo.productKey,
                            //             })
                            //             .then((res1) => {
                            //                 if (
                            //                     res1.success == true &&
                            //                     res1.data.status == true
                            //                 ) {
                            //                     var iframe =
                            //                         document.createElement(
                            //                             "iframe"
                            //                         );
                            //                     let indexNum =
                            //                         res1.data.url.indexOf(
                            //                             "fileUrl="
                            //                         );
                            //                     iframe.src = res1.data.url
                            //                         .substring(indexNum + 8)
                            //                         .replace(
                            //                             "47.114.190.241",
                            //                             "download.hikvisionauto.com"
                            //                         );
                            //                     iframe.style.display = "none";
                            //                     document.body.appendChild(
                            //                         iframe
                            //                     );
                            //                     window.clearInterval(
                            //                         _this.downloadInterval
                            //                     );
                            //                     _this.downloadInterval = "";
                            //                 } else if (res1.success == false) {
                            //                     _this.$message.error(res1.msg);
                            //                     window.clearInterval(
                            //                         _this.downloadInterval
                            //                     );
                            //                 }
                            //             });
                            //     },
                            //     3000
                            // );
                        } else if (res.code == "videos is empty") {
                            this.$message.warning(
                                `通道${params.channelNo} 当前时间段没有录像，请重新选择！`
                            );
                        } else {
                            this.$message.error(
                                `通道${params.channelNo}` + res.msg
                            );
                        }
                    })
                    .catch(() => {});
            });
            return pro;
        },
        initPageHeight() {
            this.pageHeight = getTableHeight.call(this);
            window.addEventListener(
                "resize",
                () => {
                    this.pageHeight = getTableHeight.call(this);
                },
                true
            );
            this.dom = this.$refs.transcriptTable.bodyWrapper;
            this.dom.addEventListener("scroll", () => {
                if (this.openPopover) {
                    this.$refs[this.openPopover].doClose();
                }
            });
        },
        initPlayControl_js() {
            this.$nextTick(() => {
                let fn = (currentPlayTime) => {
                    this.currentPlayTime = currentPlayTime;
                    this.playControl_js.stopRealPlayAll();
                    this.playControl_js_play(currentPlayTime);
                    // this.playControl_js.stopRealPlayAll();
                    // JSPlugin_B.secondType = JSPlugin_B.type;
                    // this.playControl_js.playAll(currentFileInfo);
                };
                JSPlugin_B.rePlay = this.rePlay.bind(this);
                this.playControl_js = new JSPlugin_B(
                    "videoPlayTimeLineBack_Js",
                    {},
                    this.settingForm
                );
                this.timeBar = new TimeBar_C("js_canvas", fn);
                let fn1 = (currentPlayTime) => {
                    if (
                        this.$moment(currentPlayTime).valueOf() <=
                        this.$moment(this.currentPlayTime).valueOf()
                    ) {
                        return;
                    }
                    if (this.isShowPath) {
                        this.getRunTraceArr(currentPlayTime);
                    }
                    this.currentPlayTime = currentPlayTime;
                    this.timeBar.setMidLineTime(currentPlayTime);
                };
                JSPlugin_B.playFn = fn1.bind(this);
                this.playControl_js.setTimeBar(this.timeBar);
            });
        },
        initPlayControl_ocx() {
            return new Promise((resolve) => {
                this.playControl_ocx = new WebPlayBack_TimeBase(
                    "videoPlayTimeLineBack_ocx",
                    (res) => {
                        resolve(res);
                    },
                    {
                        downloadShow: true,
                        startPlaybackNotifyFN: (info) => {
                            this.currentPlayTime = info.startTime;
                            if (this.isShowPath) {
                                this.getRunTraceArr(info.startTime);
                            }
                        },
                        playbackTrackNotifyFN: (info) => {
                            this.currentPlayTime = info.currentTime;
                            if (this.traceSlice.length > 0 && this.isShowPath) {
                                this.getRunTraceArr(info.currentTime);
                            }
                        },
                        playbackDownloadNotifyFN: (info) => {
                            this.playControl_ocx.hideWebOcx();
                            this.openDownLoadFormEl("ocx", info);
                        },
                    }
                );
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
                        // this.$message.success(
                        //     "已向设备下发唤醒指令，静待1分钟左右设备将重新上线"
                        // );
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
        handleClick() {
            if (this.activeName === "third") {
                setTimeout(() => {
                    this.$refs.onlineOfflineRecords.resize();
                }, 1);
            }
        },
    },
    mounted() {
        let verson = JSPlugin_B.judgeSuitable();
        if (verson !== "Unkonwn") {
            let [type, ver] = verson.split(":");
            if (type === "Chrome" || type === "edge") {
                if (ver.split(".")[0] > 45) {
                    this.nonePlayControlSuitable = true;
                }
            }
        }
        if (!this.nonePlayControlSuitable) {
            this.playControlMode = "ocx";
            this.$nextTick(() => {
                this.initPlayControl_ocx();
            });
        } else {
            this.initPlayControl_js();
        }
        // this.initPlayControl_js();
        this.initPageHeight();
        this.getvideoBackSetting();
        setTimeout(() => {
            this.setDeault();
        }, 1000);
        setTimeout(() => {
            let deviceBack = sessionStorage.getItem("deviceBack");
            if (deviceBack) {
                this.nowTable = "device";
                deviceBack = JSON.parse(deviceBack);
                this.deviceChose = deviceBack.carNumber;
                this.deviceInfo.productKey = deviceBack.productKey;
                this.deviceInfo.deviceCode = deviceBack.deviceCode;
                let startTime = deviceBack.taskStartTime;
                let endTime =
                    deviceBack.taskEndTime ||
                    this.$moment().format("YYYY-MM-DD HH:mm:ss");
                if (deviceBack.taskStartTime) {
                    this.selectDayRange = {
                        minDate: moment(startTime).format("YYYY-M-DD"),
                        maxDate: moment(endTime).format("YYYY-M-DD"),
                    };
                }
                this.searchVideoForm.sTime = new Date(startTime);
                this.searchVideoForm.eTime = new Date(endTime);
                this.searchVideoForm.deviceCode = deviceBack.deviceCode;
                this.currentWachCar.deviceId = deviceBack.id;
                this.currentWachCar.id = deviceBack.carId;
                this.currentWachCar.carNumber = deviceBack.carNumber;
                this.channelList = [
                    {
                        channelName: "通道1",
                        channelNum: 1,
                    },
                ];
                setTimeout(() => {
                    this.$refs["date-pannel"].markRange(
                        deviceBack.taskStartTime,
                        null
                    );
                }, 2000);
                this.$set(this.searchVideoForm, "channelNoList", [1]);
                this.searchVideoFun();
                sessionStorage.removeItem("deviceBack");
            }
        }, 500);
    },
    destroyed() {
        // clearInterval(this.statusInterval);
        checkKeys(this.playControl_ocx) &&
            this.playControl_ocx.disconnectWebOcx();
        if (this.playControl_js) {
            this.playControl_js.stopRealPlayAll();
            this.playControl_js.destroyWorker();
        }
        if (this.scrollTimer != null) {
            clearInterval(this.scrollTimer);
            this.scrollTimer = null;
        }
    },
};
</script>
<style lang="less" scoped>
.currentPlayTime {
    display: flex;
    height: 36px;
    align-items: center;
    position: absolute;
    left: -100px;
    color: white;
}

.voice-class {
    height: 22px;
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

.totalControl {
    width: 300px;
    display: flex;
    position: absolute;
    justify-content: flex-end;
    align-items: center;
    right: 0px;
    height: 35px;

    img {
        cursor: pointer;

        &:hover {
            background: rgba(22, 22, 22, 0.2);
        }

        box-sizing: content-box;
        margin: 0px 6px;
        padding: 2px;
        width: 18px;
        height: 18px;
    }
}

.stream {
    display: block;
    box-sizing: content-box;
    margin: 0px 6px;
    padding: 2px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;

    &:hover {
        background: rgba(22, 22, 22, 0.2);
    }

    line-height: 15px;
    font-size: 14px;
    height: 20px;
}

.item-class {
    &:hover {
        background: #d1cfcf;
    }
}

.bt-op {
    .leftContent {
        display: flex;
        position: absolute;
        left: 400px;
        color: #fff;
        align-items: center;
        height: 100%;
        font-size: 12px;
    }

    display: flex;
    justify-content: center;
    height: 36px;
    background: #333333;
    position: relative;

    .play-content {
        position: absolute;
        display: flex;
        width: 200px;
        justify-content: center;
        align-items: center;

        img {
            margin: 6px;
            width: 20px;
            height: 20px;
        }
    }
}

.car-icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 4px;
    // border-radius: 5px;
    background-size: contain;
}

.icon-can {
    background-image: url("/static/images/video_can.png");
}

.icon-pro {
    background-image: url("/static/images/video_pro.png");
}

.icon-not {
    background-image: url("/static/images/video_none.png");
}

/deep/.tree-content {
    display: flex;
    align-items: center;
    width: 100%;
}

.video-palyback {
    position: relative;
    display: flex;
    height: 100%;

    .isShowTree {
        width: 424px;
    }

    .isHideTree {
        width: 0rem !important;
        padding: 0 !important;
    }

    .video-content-left {
        // transition: width 0.2s;
        position: relative;
        border-right: 1px solid #e9e9e9;
        // width: 20rem;
        // display: flex;
        // flex-direction: column;
        height: 100%;
        margin-right: 20px;

        .filter-tree {
            height: 4rem;
        }

        .tree-div {
            // flex: 1;
            height: 100%;
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

            &:hover {
                color: #409eff;
            }
        }
    }

    .video-content-center {
        border-right: 1px solid #ccc;
        flex: 1;
        overflow: hidden;

        .switch-button {
            display: flex;
            padding-top: 0.5rem;

            div {
                width: 6rem;
                height: 2rem;
                text-align: center;
                line-height: 2rem;
                border: 1px solid #dcdfe6;
                cursor: pointer;
            }

            .time {
                border-radius: 4px 0 0 4px;
            }

            .list {
                border-radius: 0 4px 4px 0;
            }

            .active {
                background: #409eff;
                border-color: #409eff;
                color: #fff;
            }
        }

        .video-play-page {
            height: 100%;
            display: flex;
            flex-direction: column;

            // padding-top: 0.5rem;
            .back-button {
                height: 1.5rem;
                cursor: pointer;
            }

            .video-main {
                overflow: hidden;
                flex: 3;
                display: flex;
                flex-direction: row;
                width: 100%;

                .path-map {
                    flex: 2;
                    overflow: hidden;
                }

                .video {
                    min-width: 780px;
                    overflow: hidden;
                    flex: 3;

                    .h-full {
                        display: flex;
                        flex-direction: column;

                        #videoPlayTimeLineBack_Js {
                            width: 100%;
                        }

                        #videoTimeBar_Js {
                            width: 100%;
                            height: 62px;
                            overflow: hidden;
                        }
                    }
                }
            }

            .video-list {
                // flex: 2;
                height: 300px;
                overflow: hidden;
                position: relative;
                /deep/.el-tabs__header {
                    margin: 0 !important;
                }
                /deep/.el-tabs__content {
                    height: calc(~"100% - 45px");
                }
                /deep/ .el-table .selected-row {
                    background: oldlace !important;
                }

                /deep/
                    .el-table--enable-row-hover
                    .el-table__body
                    .selected-row:hover
                    > td {
                    background-color: oldlace !important;
                }

                .channel-tabs {
                    z-index: 999;
                    position: absolute;
                    left: 0px;
                    top: 66px;
                    display: flex;
                    flex-direction: column;

                    .channel-item {
                        font-size: 16px;
                        padding: 12px 12px 12px 4px;
                        color: #404040;
                        background: #ffffff;
                        box-shadow: -4px 0px 16px 0px rgba(0, 0, 0, 0.16);
                        border-radius: 0px 25.5px 25.5px 0px;
                        margin-bottom: 8px;
                        cursor: pointer;

                        &.active {
                            background: #1890ff;
                            color: #ffffff;
                        }
                    }
                }
            }
        }

        .video-list-page {
            margin-top: 0.5rem;
            height: calc(~"100% - 3.5rem");

            .first-Page {
                height: 100%;
                width: 100%;
                display: flex;
                align-items: center;
                border-left: 1px solid #ccc;

                span {
                    flex: 1;
                    text-align: center;
                    vertical-align: middle;
                }
            }
        }
    }

    .video-content-right {
        width: 424px;
        padding: 0 1rem;
        box-sizing: border-box;
        position: relative;
        .sTime-form {
            margin-bottom: 12px;
            &.el-form-item__label {
                display: flex;
            }
        }
        .video-time-picker {
            /deep/.el-input__inner {
                width: 100%;
                height: 2rem;
            }

            /deep/.el-input__icon {
                line-height: 2rem;
            }
        }

        .video-time-picker.el-date-editor.el-input {
            width: 100% !important;
        }

        .video-button-div {
            display: flex;
            justify-content: flex-end;
        }

        .video-channel {
            .el-checkbox {
                margin-right: 30px !important;
            }
            /deep/.video-radio-group {
                margin: 1rem 0;

                .el-radio {
                    width: 7rem;
                    margin-bottom: 0.5rem;
                    margin-right: 1rem;

                    .el-radio__label {
                        display: inline-block;
                        width: 6rem;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }
}
.car-select {
    padding: 12px;
    display: flex;
    .car-type {
        width: 85px;
        margin-right: -1px;
    }
    .G-SelectTree {
        // width: 256px !important;
    }
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
.sta {
    display: inline-block;
    padding: 2px 5px;
    border: 1px solid #d3d3d3;
}
.sta.online {
    border-color: #6fcf40;
    color: #6fcf40;
    background-color: #f6ffed;
}
.sta.offline {
    border-color: #d3d3d3;
    color: #686868;
    background-color: #f5f5f5;
}
.sta.sleep {
    border-color: #ff952c;
    color: #ff952c;
    background-color: #f5f5f5;
}
.flex-between {
    justify-content: space-between;
}
.flex-layout {
    display: flex;
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
.awaken-dialog {
    .el-dialog__body {
        padding: 0px 20px !important;
    }
}
.loadingClass {
    width: 50px;
    height: 20px;

    .el-loading-spinner {
        top: 100%;

        .circular {
            width: 50px;
            height: 20px;
        }
    }
}

.el-time-picker-search {
    width: 150px;
}

.download-time-picker {
    width: 245px !important;
}

.myel-popover-video {
    .G-Tree {
        height: calc(100% - 35px) !important;
    }

    width: 424px !important;

    .el-scrollbar__wrap {
        width: 260px !important;
    }
}

.popperClassResOut-video {
    width: 250px;
}

.flex-wrap {
    display: flex;
    flex-wrap: wrap !important;
    width: 100%;
}

.el-divider--horizontal {
    background: 0 0;
    border-top: 1px dashed #e8eaec;
}

.el-divider--horizontal {
    margin: 10px 0;
}

.speedTypePopover {
    width: 70px !important;
    min-width: 70px !important;
}

.coverPopover {
    width: 100px !important;
    min-width: 100px !important;
}

.item-style {
    margin-bottom: 0px !important;

    .el-form-item__label {
        padding: 0px !important;
    }
}

.error-item {
    .el-form-item__error {
        margin-top: -10px !important;
    }
}

.playcontrol-class {
    position: absolute;
    top: -24px;
    right: 15px;
}

.downLoadMode_js {
    min-width: 90px !important;
    width: 90px;
}
</style>
