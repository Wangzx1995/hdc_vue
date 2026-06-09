<template>
    <div
        class="white history-palyback historyPlaybackStyle"
        :style="{ height: pageHeight + 'px' }"
    >
        <div
            class="history-left b-r scrollable scrollable-xs"
            :style="{ width: leftWidth }"
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
                    :selectDayRange="selectDayRange"
                    :isRange="true"
                    ref="datePannel"
                >
                </date-pannel>
            </div>

            <el-form
                class="formClass"
                ref="historyTrajectoryForm"
                :model="historyTrajectoryForm"
                :rules="historyTrajectoryValidate"
            >
                <div class="timechose">
                    <span>
                        <!-- 开始时间 -->
                        {{ $t("common.startTime") }}
                    </span>
                    <span>{{ startDay ? startDay.substring(5) : "" }}</span>
                    <el-time-picker
                        value-format="HH:mm:ss"
                        size="mini"
                        v-model="historyTrajectoryForm.sTime"
                        default-value="00:00:00"
                        :clearable="false"
                    ></el-time-picker>
                </div>
                <div class="timechose m-t">
                    <span>
                        <!-- 结束时间 -->
                        {{ $t("common.endTime") }}
                    </span>
                    <span>{{ endDay ? endDay.substring(5) : "" }}</span>
                    <el-time-picker
                        value-format="HH:mm:ss"
                        size="mini"
                        v-model="historyTrajectoryForm.eTime"
                        default-value="23:59:59"
                        :clearable="false"
                    ></el-time-picker>
                </div>
                <div class="search-param m-t">
                    <span class="text-left">
                        <!-- 定位点过滤 -->
                        {{ $t("historyPlayback.pointFiltering") }}
                    </span>
                    <div class="position-style m-t">
                        <el-checkbox-group
                            v-model="historyTrajectoryForm.locationPointFilter"
                        >
                            <el-checkbox :label="1">
                                <!-- 无效 -->
                                {{ $t("historyPlayback.invalid") }}
                                <el-popover
                                    placement="top-end"
                                    trigger="hover"
                                    :width="350"
                                >
                                    <div class="text-left">
                                        <p>
                                            <!-- 未定位数据为无效。设备为何显示无效定位 -->
                                            {{
                                                $t(
                                                    "historyPlayback.invalidText1"
                                                )
                                            }}
                                            ？
                                        </p>
                                        <p>
                                            1：
                                            <!-- 根据 JT/T808协议，平台接收终端的上传数据，在终端上传的定位数据中，有个位标识该条数据是否有效，如果无效，平台展示为无效； -->
                                            {{
                                                $t(
                                                    "historyPlayback.invalidText2"
                                                )
                                            }}
                                        </p>
                                        <p>
                                            2：
                                            <!-- 出现无效定位的情况，可能存在以下几种情况 -->
                                            {{
                                                $t(
                                                    "historyPlayback.invalidText3"
                                                )
                                            }}：
                                        </p>
                                        <p>
                                            2.1：
                                            <!-- GPS信号不好 -->
                                            {{
                                                $t(
                                                    "historyPlayback.invalidText4"
                                                )
                                            }}
                                        </p>
                                        <p>
                                            2.2：
                                            <!-- 终端定位模块存在故障 -->
                                            {{
                                                $t(
                                                    "historyPlayback.invalidText5"
                                                )
                                            }}
                                        </p>
                                        <p>
                                            2.3：
                                            <!-- 终端的GPS天线可能有问题 -->
                                            {{
                                                $t(
                                                    "historyPlayback.invalidText6"
                                                )
                                            }}
                                        </p>
                                        <p>
                                            3：
                                            <!-- 出现该种情况，只能联系终端厂家来解决，平台无法处理 -->
                                            {{
                                                $t(
                                                    "historyPlayback.invalidText7"
                                                )
                                            }}
                                        </p>
                                    </div>
                                    <i
                                        class="el-icon-question"
                                        slot="reference"
                                        style="color: #66b1ff"
                                    ></i> </el-popover
                            ></el-checkbox>
                            <el-checkbox :label="2">
                                <!-- 不合格 -->
                                {{ $t("historyPlayback.unqualified") }}
                                <el-popover
                                    placement="top-end"
                                    trigger="hover"
                                    :width="300"
                                >
                                    <div class="text-left">
                                        <p>
                                            <!-- 数据合格规则 -->
                                            {{
                                                $t(
                                                    "historyPlayback.unqualifiedText1"
                                                )
                                            }}:
                                        </p>
                                        <p>
                                            1、
                                            <!-- 经度合格，范围73°33E-135°05E -->
                                            {{
                                                $t(
                                                    "historyPlayback.unqualifiedText2"
                                                )
                                            }}
                                        </p>
                                        <p>
                                            2、
                                            <!-- 纬度合格，范围3°51N-53°33N -->
                                            {{
                                                $t(
                                                    "historyPlayback.unqualifiedText3"
                                                )
                                            }}
                                        </p>
                                        <p>
                                            3、
                                            <!-- 海拔合格，范围-200-6500m -->
                                            {{
                                                $t(
                                                    "historyPlayback.unqualifiedText4"
                                                )
                                            }}
                                        </p>
                                        <p>
                                            4、
                                            <!-- 方向合格，范围0°-359°之间且数值取整 -->
                                            {{
                                                $t(
                                                    "historyPlayback.unqualifiedText5"
                                                )
                                            }}
                                        </p>
                                        <p>
                                            5、
                                            <!-- 速度合格，范围0至160间 -->
                                            {{
                                                $t(
                                                    "historyPlayback.unqualifiedText6"
                                                )
                                            }}
                                        </p>
                                        <p>
                                            6、
                                            <!-- 卫星时间合格：GPS上报时间相对于定位时间不超过20小时 -->
                                            {{
                                                $t(
                                                    "historyPlayback.unqualifiedText7"
                                                )
                                            }}
                                        </p>
                                    </div>
                                    <i
                                        class="el-icon-question"
                                        slot="reference"
                                        style="color: #66b1ff"
                                    ></i>
                                </el-popover>
                            </el-checkbox>
                            <!-- check-box bug  要字符传0 -->
                            <el-checkbox :label="3">
                                <!-- 补报 -->
                                {{ $t("historyPlayback.makeReportEvent") }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="search-param m-t">
                    <span class="text-left">
                        <!-- ACC状态 -->
                        {{ $t("historyPlayback.ACCStatus") }}
                    </span>
                    <div class="position-style m-t">
                        <el-checkbox-group
                            v-model="historyTrajectoryForm.accStatus"
                        >
                            <el-checkbox :label="1">
                                <!-- ACC开 -->
                                {{ $t("historyPlayback.ACCOpen") }}
                            </el-checkbox>
                            <el-checkbox :label="0">
                                <!-- ACC关 -->
                                {{ $t("historyPlayback.ACCClose") }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="search-param m-t">
                    <span class="text-left">
                        <!-- 定位类型 -->
                        {{ $t("historyPlayback.positioningType") }}
                    </span>
                    <div class="position-style m-t">
                        <el-checkbox-group
                            v-model="historyTrajectoryForm.locateType"
                        >
                            <el-checkbox
                                class="m-b-xs"
                                v-for="(item, index) in locateTypeList"
                                :key="index"
                                :label="item.value"
                                >{{ item.key }}</el-checkbox
                            >
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="search-param">
                    <span class="text-left">
                        <!-- 上传类型 -->
                        {{ $t("historyPlayback.uploadType") }}
                    </span>
                    <div class="position-style m-t">
                        <el-checkbox-group
                            v-model="historyTrajectoryForm.uploadMode"
                        >
                            <el-checkbox
                                class="m-b-xs"
                                v-for="(item, index) in uploadModeList"
                                :key="index"
                                :label="item.value"
                                >{{ item.key }}</el-checkbox
                            >
                        </el-checkbox-group>
                    </div>
                </div>
                <el-button
                    :disabled="loading"
                    size="mini"
                    type="primary"
                    @click="searchHistoryTrajectory()"
                    class="button-div m-t"
                    :loading="loading"
                >
                    <!-- 查询 -->
                    {{ $t("common.search") }}
                </el-button>
            </el-form>
        </div>
        <div class="history-content-right" id="history-content-right">
            <div
                class="history-content-top"
                id="history-content-top"
                v-loading="loadingMap"
            >
                <div class="history-content-top-left">
                    <div class="address-text p-a-xs" v-if="addressText.show">
                        <div class="flex-layout m-t-xs">
                            <div class="begin-icon">
                                <!-- 起 -->
                                {{ $t("historyPlayback.begin") }}
                            </div>
                            <div class="m-l">
                                <div class="text-break">
                                    <!-- 时间 -->
                                    {{ $t("historyPlayback.time") }}

                                    :{{ addressText.startInfo.time }}
                                </div>
                                <div class="text-break">
                                    <!-- 位置 -->
                                    {{ $t("historyPlayback.address") }}
                                    :{{ addressText.startInfo.address }}
                                </div>
                            </div>
                        </div>
                        <div class="flex-layout m-t-xs">
                            <div class="end-icon">
                                <!-- 终 -->
                                {{ $t("historyPlayback.end") }}
                            </div>
                            <div class="m-l">
                                <div class="text-break">
                                    <!-- 时间 -->
                                    {{ $t("historyPlayback.time") }}
                                    :{{ addressText.endInfo.time }}
                                </div>
                                <div class="text-break">
                                    <!-- 位置 -->
                                    {{ $t("historyPlayback.address") }}
                                    :{{ addressText.endInfo.address }}
                                </div>
                            </div>
                        </div>
                        <i
                            class="el-icon-close pointer"
                            @click="addressText.show = false"
                        ></i>
                    </div>
                    <div id="openLayer"></div>
                    <div class="titleLeftClass2">
                        <p>
                            <span>
                                <!--  车速 -->
                                {{ $t("historyPlayback.speed") }} :
                                <span class="titleLeftClass2-inspan">{{
                                    driverGpsData.speed
                                }}</span
                                >km/h
                            </span>
                            <span class="shuxian m-x-xs"> | </span>
                            <span>
                                <!-- 时间 -->
                                {{ $t("historyPlayback.time") }} :
                                <span>{{ driverGpsData.collectTime }}</span>
                            </span>
                        </p>
                    </div>
                    <div class="bottomRightClass">
                        <div class="styleBottom">
                            <span>
                                <!-- 有效定位点 -->
                                {{
                                    $t(
                                        "historyPlayback.effectivePositioningPoint"
                                    )
                                }}
                                ：
                                <span style="color: #328af7">
                                    {{ gpsTimeStatus.validGpsNum }}
                                </span>
                                <!-- 个 -->
                                {{ $t("historyPlayback.ge") }}
                            </span>
                            <span>
                                <!-- 无效定位点 -->
                                {{
                                    $t(
                                        "historyPlayback.invalidPositioningPoint"
                                    )
                                }}
                                :
                                <span style="color: #328af7">
                                    {{ gpsTimeStatus.invalidGpsNum }}
                                </span>
                                <!-- 个 -->
                                {{ $t("historyPlayback.ge") }}
                            </span>
                            <span>
                                <!-- 补报定位点 -->
                                {{
                                    $t("historyPlayback.reportPositioningPoint")
                                }}
                                :
                                <span style="color: #328af7">
                                    {{ gpsTimeStatus.supplementGpsNum }}
                                </span>
                                <!-- 个 -->
                                {{ $t("historyPlayback.ge") }}
                            </span>
                        </div>
                    </div>
                    <div
                        :class="{
                            'play-content flex-layout p-x flex-middle': true,
                            'not-allowed': loading,
                        }"
                        style="bottom: 4px; left: 16px"
                    >
                        <el-image
                            style="width: 22px; height: 22px"
                            :src="
                                playInfo.isPlay == false
                                    ? '/static/images/historyPlay/play.png'
                                    : '/static/images/historyPlay/pause.png'
                            "
                            fit="contain"
                            :class="loading ? 'not-allowed' : 'pointer'"
                            @click="playOrPauseHistoryTrajectory"
                        ></el-image>
                        <div class="flex-layout flex-middle number">
                            <span>
                                <!-- 慢 -->
                                {{ $t("historyPlayback.slow") }}
                            </span>
                            <el-slider
                                v-model="playInfo.speed"
                                :step="1"
                                :min="1"
                                :max="16"
                                class="no-margin"
                                style="width: 100px"
                            ></el-slider>
                            <span class="m-l-xs">
                                <!-- 快 -->
                                {{ $t("historyPlayback.fast") }}
                            </span>
                        </div>
                        <div class="flex-layout flex-middle">
                            <el-slider
                                style="margin-left: 1rem"
                                :disabled="
                                    !historyTrajectoryTempData.length || loading
                                "
                                v-model="playInfo.frontIndex"
                                @change="getEchartsIndex"
                                :step="1"
                                :min="0"
                                :max="
                                    historyTrajectoryTempData.length > 0
                                        ? historyTrajectoryTempData.length - 1
                                        : 0
                                "
                                :format-tooltip="
                                    (val) => {
                                        if (
                                            historyTrajectoryTempData.length > 0
                                        ) {
                                            return historyTrajectoryTempData[
                                                val
                                            ].collectTime;
                                        }
                                    }
                                "
                                class="no-margin"
                                :style="{ width: slideWidth + 'px' }"
                            ></el-slider>
                        </div>
                        <el-image
                            src="/static/images/historyPlay/setting.png"
                            fit="contain"
                            :class="loading ? 'm-l not-allowed' : 'm-l pointer'"
                            @click="openSetting"
                            style="width: 16px; height: 16px"
                        ></el-image>
                    </div>
                </div>
            </div>
            <div class="drag-resize" id="monitor-resize"></div>
            <div
                class="history-content-bottom"
                ref="historyContentBottom"
                id="history-content-bottom"
                :style="{ height: commonHeight + 'px' }"
            >
                <div class="full-screen">
                    <el-button
                        size="mini"
                        type="primary"
                        @click="openSetModal"
                        v-show="contentActiveName === 'GPSTable'"
                    >
                        <!-- 设置表头 -->
                        {{ $t("historyPlayback.setHeader") }}
                    </el-button>
                    <el-button
                        size="mini"
                        type="primary"
                        @click="exportData"
                        :loading="exportLoading"
                        v-if="contentActiveName === 'GPSTable'"
                        v-btn="'historyPlaybackExport'"
                    >
                        <!-- 导出 -->
                        {{ $t("common.export") }}
                    </el-button>
                    <el-button
                        size="mini"
                        type="primary"
                        @click="changeStateShow('bigger')"
                    >
                        <span class="el-icon-arrow-up"></span>
                    </el-button>
                    <el-button
                        size="mini"
                        type="primary"
                        @click="changeStateShow('smaller')"
                    >
                        <span class="el-icon-arrow-down"></span>
                    </el-button>
                </div>
                <el-tabs
                    v-model="contentActiveName"
                    class="myel-class"
                    v-loading="loading"
                    element-loading-background="rgba(0, 0, 0, 0.2)"
                >
                    <el-tab-pane name="GPSTable">
                        <span slot="label">
                            <!-- 位置数据 -->
                            {{ $t("historyPlayback.positionData") }}
                            <span>
                                ({{
                                    playInfo.indexType === "normal"
                                        ? historyTrajectoryTempData.length
                                        : historyTrajectoryTempData_bak.length ||
                                          0
                                }})
                            </span>
                        </span>
                        <gps-table
                            :locateTypeList="locateTypeList"
                            :uploadModeList="uploadModeList"
                            :currentCar="currentWachCar"
                            :GpsDataTotal="
                                playInfo.indexType === 'normal'
                                    ? historyTrajectoryTempData
                                    : historyTrajectoryTempData_bak
                            "
                            @getTipInform="getTipInform"
                            ref="gpsTable"
                            :tableColumnVoList="tableSelect.tableColumnVoList"
                        >
                        </gps-table>
                    </el-tab-pane>
                    <!-- 速度分析 -->
                    <el-tab-pane
                        :label="$t('historyPlayback.velocityAnalysis')"
                        name="speedCurve"
                    >
                        <speed-curve
                            :historyTrajectoryForm="historyTrajectoryForm"
                            :commonHeight="commonHeight"
                            :GpsData="
                                playInfo.indexType === 'normal'
                                    ? historyTrajectoryTempData
                                    : historyTrajectoryTempData_bak
                            "
                            :maxSpeed="gpsTimeStatus.maxSpeed"
                            :avgSpeed="gpsTimeStatus.avgSpeed"
                            @getEchartsIndex="getEchartsIndex"
                            @getOverSpeedNum="getOverSpeedNum"
                            ref="speed"
                        ></speed-curve>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <!-- :title="leftWidth === '424px' ? '收起' : '展开'" -->
            <el-image
                :title="
                    leftWidth === '424px'
                        ? $t('historyPlayback.retract')
                        : $t('historyPlayback.expand')
                "
                :src="
                    leftWidth === '424px'
                        ? '/static/images/historyPlay/collapse.png'
                        : '/static/images/historyPlay/expand.png'
                "
                fit="contain"
                class="i-class pointer"
                @click="collapse"
            ></el-image>
        </div>
        <!-- 设置窗口是否展示温度、二氧化碳浓度、正反转状态 -->
        <!-- 自定义显示 -->
        <el-dialog
            :visible.sync="setCarInfoShow"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            append-to-body
            width="980px"
            :destroy-on-close="true"
            :title="$t('historyPlayback.customizeDisplay')"
        >
            <sort-header
                :defaultUnvisible="defaultUnvisible"
                :tableHeadSelection="tableHeadSelection"
                v-model="tableSelect.tableColumnVoList"
                ref="sortHeader"
                @comfirm="comfirmSetModel"
            ></sort-header>
        </el-dialog>
        <!-- 导出轨迹 -->
        <el-dialog
            :visible.sync="exportConfig"
            :close-on-click-modal="false"
            :cless-escape="false"
            append-to-boose-on-prdy
            width="600px"
            :title="$t('historyPlayback.exportTrajectory')"
        >
            <div>
                <el-form label-width="100px" :size="'mini'">
                    <!-- 时间段 -->
                    <el-form-item
                        :label="$t('vehicleTrackIntegrityRate.timeSlot')"
                    >
                        <el-date-picker
                            :clearable="false"
                            popperClass="oilDynamicDetails-timerange"
                            :pickerOptions="timeOPtions"
                            v-model="gpsExportHistoryTrajectoryForm.timeArr"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetimerange"
                            :start-placeholder="$t('common.startTime')"
                            :end-placeholder="$t('common.endTime')"
                            :default-time="['00:00:00', '23:59:59']"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <!-- 定位点过滤 -->
                    <el-form-item :label="$t('historyPlayback.pointFiltering')">
                        <el-checkbox-group
                            v-model="
                                gpsExportHistoryTrajectoryForm.locationPointFilter
                            "
                        >
                            <el-checkbox :label="1">
                                <!-- 无效 -->
                                {{ $t("historyPlayback.invalid") }}
                            </el-checkbox>
                            <el-checkbox :label="2">
                                <!-- 不合格 -->
                                {{ $t("historyPlayback.unqualified") }}
                            </el-checkbox>
                            <!-- check-box bug  要字符传0 -->
                            <el-checkbox :label="3">
                                <!-- 补报 -->
                                {{ $t("historyPlayback.makeReportEvent") }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <!-- ACC状态 -->
                    <el-form-item :label="$t('historyPlayback.ACCStatus')">
                        <el-checkbox-group
                            v-model="gpsExportHistoryTrajectoryForm.accStatus"
                        >
                            <el-checkbox :label="1">
                                <!-- ACC开 -->
                                {{ $t("historyPlayback.ACCOpen") }}
                            </el-checkbox>
                            <el-checkbox :label="0">
                                <!-- ACC关 -->
                                {{ $t("historyPlayback.ACCClose") }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <!-- 定位类型 -->
                    <el-form-item
                        :label="$t('historyPlayback.positioningType')"
                    >
                        <el-checkbox-group
                            v-model="gpsExportHistoryTrajectoryForm.locateType"
                        >
                            <el-checkbox
                                style="width: 80px"
                                v-for="(item, index) in locateTypeList"
                                :key="index"
                                :label="item.value"
                                >{{ item.key }}</el-checkbox
                            >
                        </el-checkbox-group>
                    </el-form-item>
                    <!-- 上传类型 -->
                    <el-form-item :label="$t('historyPlayback.uploadType')">
                        <el-checkbox-group
                            v-model="gpsExportHistoryTrajectoryForm.uploadMode"
                        >
                            <el-checkbox
                                style="width: 80px"
                                v-for="(item, index) in uploadModeList"
                                :key="index"
                                :label="item.value"
                                >{{ item.key }}</el-checkbox
                            >
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button type="text" @click="exportConfig = false">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button type="primary" @click="exportGps">
                    <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </div>
        </el-dialog>
        <!-- 高级设置 -->
        <el-dialog
            :visible.sync="settingModel"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            append-to-body
            width="490px"
            :title="$t('historyPlayback.advancedSetting')"
        >
            <div class="setting-box">
                <div class="btn-box">
                    <span>
                        <!-- 定位类型颜色 -->
                        {{ $t("historyPlayback.positioningTypeColor") }}
                        ：
                    </span>
                    <el-switch
                        :active-value="1"
                        :inactive-value="2"
                        v-model="advanceSetForm.polylineShowType"
                    >
                    </el-switch>
                </div>
                <div
                    class="color-list"
                    v-if="advanceSetForm.polylineShowType === 1"
                >
                    <div>
                        <el-color-picker
                            size="mini"
                            v-model="advanceSetForm.colorList[0]"
                        ></el-color-picker>
                        <span>
                            <!-- 无定位类型 -->
                            {{ $t("historyPlayback.noPositioningType") }}
                        </span>
                    </div>
                    <div v-for="(item, index) in locateTypeList" :key="index">
                        <el-color-picker
                            size="mini"
                            v-model="advanceSetForm.colorList[index + 1]"
                        ></el-color-picker>
                        <span>
                            {{ item.key }}
                        </span>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <el-button type="text" @click="closeSetting">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button type="primary" @click="saveAdvanceSetting">
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
import O_Map from "./historyPlaybackFile/js/mapClass/O_Map";
import GpsTable from "./historyPlaybackFile/vue/GPSTable.vue";
import SpeedCurve from "./historyPlaybackFile/vue/speedCurve.vue";
import { exportHander } from "@/utils/exportUtil";
import DatePannel from "@/components/datePannel.vue";
import gpsConverter from "@/utils/gpsConverter";

import Timer from "@/utils/time";
import utils from "@/utils/base";
import { dragTwoRowDiv, dragMoveDiv } from "@/utils/drag";
import Base_Map from "./historyPlaybackFile/js/mapClass/Base_Map";
import SortHeader from "../../components/sortHeader.vue";
import { fromLonLat } from "ol/proj";
import { transferAddress } from "@/utils/getMapLocation";
import { debounce } from "@/utils/controlFn.js";
const today =
    new Date().getFullYear() +
    "-" +
    (new Date().getMonth() + 1) +
    "-" +
    new Date().getDate();

export default {
    name: "historyPlayback",
    components: {
        DatePannel,
        GpsTable,
        SpeedCurve,
        SortHeader,
    },
    data() {
        let _minTime, _maxTime;
        return {
            awakenVisible: false,
            awakenTime: 0,
            awakenDeviceId: "",
            url: "/devicePortable/pagePortableTask",
            timeOPtions: {
                onPick({ maxDate, minDate }) {
                    if (!maxDate) {
                        let timeRange = 3 * 24 * 60 * 60 * 1000;
                        _minTime = minDate.getTime() - timeRange;
                        _maxTime = minDate.getTime() + timeRange;
                    } else {
                        _minTime = _maxTime = null;
                    }
                },
                disabledDate(time) {
                    if (_minTime && _maxTime) {
                        return (
                            time.getTime() <= _minTime ||
                            time.getTime() >= _maxTime
                        );
                    }
                },
            },
            deviceChose: "",
            exportLoading: false,
            trackPlaybackCar: null,
            historyTrajectoryTempData_bak: null,
            queryState: {
                queryCount: 0,
                queryTotal: null,
            },
            queryStateTime: {
                queryCount: 0,
                queryTotal: null,
            },
            playInfo: {
                polylineWidth: 3,
                isPlay: false,
                path: [],
                timeTotal: 0,
                playGap: 1,
                speed: 8,
                frontIndex: 0,
                lineF: null,
                playMode: 2,
                playRate: 0,
                filterGps: [],
                indexType: "normal",
                projectGpsPointerColor: "#1516e7",
            },
            loading: false,
            addressText: {
                startInfo: null,
                endInfo: null,
                show: false,
            },
            tableSelect: {
                createId: null,
                tableColumnVoList: [],
                tableType: 1,
            },
            defaultUnvisible: [
                "emergencyAlarm",
                "cumulativeOvertimeDrivingAlarm",
                "vehicleIllegalIgnition",
                "vehicleIllegalMove",
                "illegalDrivingAlarm",
                "gnnsModuleFault",
                "gnnsAntennaUnconnected",
                "gnnsAntennaShortCircuit",
                "terminalMainPowerUndervoltage",
                "terminalMainPowerDown",
                "terminalLcdFault",
                "ttsModuleFault",
                "cameraFault",
                "icModuleFault",
                "vehicleIllegalDoorOpeningAlarm",
                "alarmStatusNum",
            ],
            tableHeadSelection: [
                {
                    // fieldNameCN: "上报时间",
                    fieldNameCN: this.$t("historyPlayback.collectTime"),
                    fieldNameEN: "collectTime",
                },
                {
                    // fieldNameCN: "上报类型",
                    fieldNameCN: this.$t("historyPlayback.supplementSign"),
                    fieldNameEN: "supplementSign",
                },
                {
                    // fieldNameCN: "状态",
                    fieldNameCN: this.$t("historyPlayback.gpsStatus"),
                    fieldNameEN: "gpsStatus",
                },
                {
                    // fieldNameCN: "接收时间",
                    fieldNameCN: this.$t("historyPlayback.createTime"),
                    fieldNameEN: "createTime",
                },
                {
                    // fieldNameCN: "GPS速度（km/h）",
                    fieldNameCN: this.$t("historyPlayback.GPSSpeed") + "(km/h)",
                    fieldNameEN: "GPSSpeed",
                },
                {
                    // fieldNameCN: "行车记录仪速度(km/h)",
                    fieldNameCN:
                        this.$t("historyPlayback.recorderSpeed") + "(km/h)",
                    fieldNameEN: "recorderSpeed",
                },
                {
                    // fieldNameCN: "超速预警",
                    fieldNameCN: this.$t("historyPlayback.overSpeedWarning"),
                    fieldNameEN: "overSpeedWarning",
                },
                {
                    // fieldNameCN: "超速报警",
                    fieldNameCN: this.$t("historyPlayback.overSpeedAlarm"),
                    fieldNameEN: "overSpeedAlarm",
                },
                {
                    // fieldNameCN: "超时驾驶预警",
                    fieldNameCN: this.$t(
                        "historyPlayback.fatigueDrivingWarning"
                    ),
                    fieldNameEN: "fatigueDrivingWarning",
                },
                {
                    // fieldNameCN: "超时驾驶报警",
                    fieldNameCN: this.$t("historyPlayback.fatigueDrivingAlarm"),
                    fieldNameEN: "fatigueDrivingAlarm",
                },
                {
                    // fieldNameCN: "定位类型",
                    fieldNameCN: this.$t("historyPlayback.locateType"),
                    fieldNameEN: "locateType",
                },
                {
                    // fieldNameCN: "上传类型",
                    fieldNameCN: this.$t("historyPlayback.uploadMode"),
                    fieldNameEN: "uploadMode",
                },
                {
                    // fieldNameCN: "经纬度",
                    fieldNameCN: this.$t(
                        "historyPlayback.longitudeAndLatitude"
                    ),
                    fieldNameEN: "longitudeAndLatitude",
                },
                {
                    // fieldNameCN: "总里程(km)",
                    fieldNameCN:
                        this.$t("historyPlayback.totalMileage") + "(km)",
                    fieldNameEN: "totalMileage",
                },
                {
                    // fieldNameCN: "地理位置",
                    fieldNameCN: this.$t("historyPlayback.geographyLocation"),
                    fieldNameEN: "geographyLocation",
                },
                {
                    // fieldNameCN: "方向角(°)",
                    fieldNameCN: this.$t("historyPlayback.direction") + "(°)",
                    fieldNameEN: "direction",
                },
                {
                    // fieldNameCN: "海拔(m)",
                    fieldNameCN: this.$t("historyPlayback.altitude") + "(m)",
                    fieldNameEN: "altitude",
                },
                {
                    // fieldNameCN: "卫星数",
                    fieldNameCN: this.$t("historyPlayback.locationSignal"),
                    fieldNameEN: "locationSignal",
                },
                {
                    // fieldNameCN: "网络信号强度（dBm）",
                    fieldNameCN:
                        this.$t("historyPlayback.positionSignalStrength") +
                        "（dBm）",
                    fieldNameEN: "positionSignalStrength",
                },
                {
                    // fieldNameCN: "紧急报警",
                    fieldNameCN: this.$t("historyPlayback.emergencyAlarm"),
                    fieldNameEN: "emergencyAlarm",
                },
                {
                    // fieldNameCN: "当天累计驾驶超时",
                    fieldNameCN: this.$t(
                        "historyPlayback.cumulativeOvertimeDrivingAlarm"
                    ),
                    fieldNameEN: "cumulativeOvertimeDrivingAlarm",
                },
                {
                    // fieldNameCN: "车辆非法点火",
                    fieldNameCN: this.$t(
                        "historyPlayback.vehicleIllegalIgnition"
                    ),
                    fieldNameEN: "vehicleIllegalIgnition",
                },
                {
                    // fieldNameCN: "车辆非法位移",
                    fieldNameCN: this.$t("historyPlayback.vehicleIllegalMove"),
                    fieldNameEN: "vehicleIllegalMove",
                },
                {
                    // fieldNameCN: "违规行驶报警",
                    fieldNameCN: this.$t("historyPlayback.illegalDrivingAlarm"),
                    fieldNameEN: "illegalDrivingAlarm",
                },
                // --------------
                {
                    // fieldNameCN: "GNSS模块故障",
                    fieldNameCN: this.$t("historyPlayback.gnnsModuleFault"),
                    fieldNameEN: "gnnsModuleFault",
                },
                {
                    // fieldNameCN: "GNSS天线未接或剪断",
                    fieldNameCN: this.$t(
                        "historyPlayback.gnnsAntennaUnconnected"
                    ),
                    fieldNameEN: "gnnsAntennaUnconnected",
                },
                {
                    // fieldNameCN: "GNSS天线短路",
                    fieldNameCN: this.$t(
                        "historyPlayback.gnnsAntennaShortCircuit"
                    ),
                    fieldNameEN: "gnnsAntennaShortCircuit",
                },
                {
                    // fieldNameCN: "终端主电源欠压",
                    fieldNameCN: this.$t(
                        "historyPlayback.terminalMainPowerUndervoltage"
                    ),
                    fieldNameEN: "terminalMainPowerUndervoltage",
                },
                {
                    // fieldNameCN: "终端主电源掉电",
                    fieldNameCN: this.$t(
                        "historyPlayback.terminalMainPowerDown"
                    ),
                    fieldNameEN: "terminalMainPowerDown",
                },
                {
                    // fieldNameCN: "终端LCD或显示器故障",
                    fieldNameCN: this.$t("historyPlayback.terminalLcdFault"),
                    fieldNameEN: "terminalLcdFault",
                },
                {
                    // fieldNameCN: "TTS模块故障",
                    fieldNameCN: this.$t("historyPlayback.ttsModuleFault"),
                    fieldNameEN: "ttsModuleFault",
                },
                {
                    // fieldNameCN: "摄像头故障",
                    fieldNameCN: this.$t("historyPlayback.cameraFault"),
                    fieldNameEN: "cameraFault",
                },
                {
                    // fieldNameCN: "道路运输证IC卡模块故障",
                    fieldNameCN: this.$t("historyPlayback.icModuleFault"),
                    fieldNameEN: "icModuleFault",
                },
                {
                    // fieldNameCN: "非法开门报警",
                    fieldNameCN: this.$t(
                        "historyPlayback.vehicleIllegalDoorOpeningAlarm"
                    ),
                    fieldNameEN: "vehicleIllegalDoorOpeningAlarm",
                },
                {
                    // fieldNameCN: "报警标志位",
                    fieldNameCN: this.$t("historyPlayback.alarmStatusNum"),
                    fieldNameEN: "alarmStatusNum",
                },
            ],
            leftWidth: "424px",
            slideWidth: 500,
            commonHeight: 290,
            fixHight: 290,
            currentNodeKey: "",
            timeIntervalList: [
                {
                    // label: "默认",
                    label: this.$t("historyPlayback.default"),
                    value: "",
                },
                {
                    label: "15秒",
                    value: 15,
                },
                {
                    label: "30秒",
                    value: 30,
                },
                {
                    label: "1分钟",
                    value: 60,
                },
                {
                    label: "3分钟",
                    value: 180,
                },
                {
                    label: "5分钟",
                    value: 300,
                },
                {
                    label: "10分钟",
                    value: 600,
                },
            ],
            advanceSetForm: {
                polylineWidth: 3 /* 线宽 */,
                valueList: [30, 60, 80] /* 速度区间 */,
                polylineColorType: 1 /* 颜色种类 */,
                colorList: [
                    "#1B8BF1",
                    "#00D0F5",
                    "#9123A6",
                    "#FF8D06",
                    "#018B7D",
                    "#C6D732",
                    "#F23A2E",
                    "#3748AC",
                    "#92655D",
                ],
                polylineShowType: 1 /* 展示点还是方向 */,
                trajectorySetting: false,
                filterOrgionGps: false,
                openAlarmMarker: false,
                openStayMarker: true,
                speed: 0,
                playMode: 2, //1 视角跟随车辆，2不更随,
                stayCreateRule: ["0", "1"],
                parkSpeed: 0,
                projectGpsPointer: false,
                projectGpsPointerColor: "#1516e7",
            },
            setForm: {
                temperature: 0,
                frontBack: 0,
                humidity: 0,
            },
            settingModel: false,
            settingLoading: false,
            setCarInfoShow: false,
            customIndex: 0,
            showPointerLabel: false,
            pageHeight: 800,
            alarmTypeList: null,
            loadingMap: false,
            loadingMapNum: 0,
            gpsTimeStatus: {
                mileage: 0,
                onlineTime: 0,
                runningTime: 0,
                carParkingTime: 0,
                validGpsNum: 0,
                invalidGpsNum: 0,
                supplementGpsNum: 0,
                maxSpeed: null,
                minSpeed: null,
                totalSpeed: 0,
                avgSpeed: 0,
            },
            gpsExportHistoryTrajectoryForm: {
                timeArr: [],
                locationPointFilter: [1, 2],
                /* 轨迹点时间间隔 */
                deviceCode: "",
                plateNum: "",
                carId: "",
                sTime: "00:00:00",
                eTime: "23:59:59",
                startTime: "",
                endTime: "",
                accStatus: [1, 0],
                speed: 0,
                locateType: [],
                uploadMode: [],
            },
            historyTrajectoryTempData: [],
            alarmList: null,
            regionList: null,
            openLayer: null,
            //查询参数
            selectDayRange: { minDate: "", maxDate: "" }, //选择日期
            currentWachCar: {},
            historyTrajectoryForm: {
                locationPointFilter: [1, 2],
                /* 轨迹点时间间隔 */
                deviceCode: "",
                plateNum: "",
                carId: "",
                sTime: "00:00:00",
                eTime: "23:59:59",
                startTime: "",
                endTime: "",
                accStatus: [1, 0],
                speed: 0,
                locateType: [],
                uploadMode: [],
            },
            historyTrajectoryValidate: {
                sTime: [
                    {
                        required: true,
                        // message: "开始时间不能为空",
                        message: this.$t("videoPlayback.sTimeValidate"),
                        trigger: "change",
                    },
                ],
                eTime: [
                    {
                        required: true,
                        // message: "结束时间不能为空",
                        message: this.$t("videoPlayback.eTimeValidate"),
                        trigger: "change",
                    },
                ],
            },
            contentActiveName: "GPSTable", //切换tab名称
            alarmNum: 0, //底部报警数量
            stayNum: 0,
            overSpeedNum: 0,
            exportConfig: false,
            showCarNumber: "",
            carLoading: false,
            searchForm: {
                plateArr: [],
                plateJson: {},
                carId: "",
                deviceCode: "",
            },
            carType: 1,
            query: "",
            polylineShowType: 1,
            locateTypeList: [],
            uploadModeList: [],
        };
    },
    computed: {
        driverGpsData() {
            if (
                !this.historyTrajectoryTempData.length ||
                this.playInfo.indexType !== "normal"
            ) {
                return {
                    collectTime: "",
                    speed: 0,
                };
            }
            let { collectTime, speed } =
                this.historyTrajectoryTempData[this.playInfo.frontIndex];
            return {
                collectTime,
                speed,
            };
        },
        startDay() {
            return this.selectDayRange.minDate;
        },
        endDay() {
            return this.selectDayRange.maxDate;
        },
    },
    watch: {
        "searchForm.deviceCode": {
            handler(val) {
                if (val) {
                    this.historyTrajectoryForm = {
                        ...this.historyTrajectoryForm,
                        ...{
                            deviceCode: this.currentWachCar.deviceCode,
                            plateNum: this.currentWachCar.plateNum,
                            carId: this.currentWachCar.id,
                        },
                    };
                    this.currentWachCar = {
                        ...this.currentWachCar,
                        label: this.currentWachCar.plateNum,
                    };
                    this.$store.dispatch(
                        "SetDefaultMaintenanceCar",
                        this.currentWachCar
                    );
                    //选择日期默认为当天
                    if (this.trackPlaybackCar) {
                        this.trackPlaybackCar = null;
                        return;
                    }
                    this.selectDayRange = {
                        minDate: today,
                        maxDate: today,
                    };
                    this.$refs.datePannel.markRange(
                        this.selectDayRange.minDate,
                        this.selectDayRange.maxDate
                    );
                } else {
                    this.historyTrajectoryForm.deviceCode = "";
                }
            },
            deep: true,
        },
        // "searchForm.carId": {
        //     handler(val) {
        //         if (!val) {
        //             this.historyTrajectoryForm.deviceCode = "";
        //         }
        //         if (!val && this.query && this.query.length < 3) {
        //             this.searchForm.plateArr = [];
        //         }
        //         this.searchForm.plateNum =
        //             this.searchForm.plateJson[this.searchForm.carId] || "";
        //         if (val) {
        //             let carObj = this.searchForm.plateArr.find(
        //                 (item) => item.id === val
        //             );
        //             // let { id, label, deviceCode } = carObj;
        //             // val.plateNum = label;
        //             this.currentWachCar = this.searchForm.plateArr.find(
        //                 (item) => item.id === val
        //             );
        //             Object.assign(this.historyTrajectoryForm, {
        //                 deviceCode: this.currentWachCar.deviceCode,
        //                 plateNum: this.currentWachCar.plateNum,
        //                 carId: this.currentWachCar.id,
        //             });
        //             //选择日期默认为当天
        //             if (this.trackPlaybackCar) {
        //                 this.trackPlaybackCar = null;
        //                 return;
        //             }
        //             this.selectDayRange = {
        //                 minDate: today,
        //                 maxDate: today,
        //             };
        //             this.$refs.datePannel.markRange(
        //                 this.selectDayRange.minDate,
        //                 this.selectDayRange.maxDate
        //             );
        //         }
        //     },
        //     deep: true,
        // },
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
        tabClick() {
            this.$refs.selectTree.clear();
            this.deviceChose = "";
            this.searchForm.plateNum = "";
            this.searchForm.deviceCode = "";
            this.currentWachCar.id = "";
        },
        choseCarNumber(value) {
            this.currentWachCar = {
                plateNum: value,
            };
            this.selectDayRange.minDate = today;
            this.selectDayRange.maxDate = today;
        },
        closeSetting() {
            this.settingModel = false;
        },
        clickLevel() {
            this.$refs.dropdown.show();
        },
        clickTool(type) {
            switch (type) {
                case "earth":
                    this.openLayer.changBaseMap(true);
                    break;
                case "road":
                    this.openLayer.changBaseMap(undefined, true);
                    break;
                case "range":
                    this.openLayer.measure();
                    break;
                case "level":
                    break;
            }
        },
        openSetting() {
            if (this.loadingMap || this.loading) return;
            this.settingLoading = false;
            this.settingModel = true;
        },
        openSetModal() {
            this.setCarInfoShow = true;
        },
        comfirmSetModel() {
            let api = "updateTableConfig";
            let param = {
                ...this.tableSelect,
                tableShowContent: JSON.stringify(
                    this.tableSelect.tableColumnVoList
                ),
            };
            delete param.tableColumnVoList;
            this.$api[api](param)
                .then((res) => {
                    if (res.success) {
                        // this.$message.success("成功!");
                        this.$message.success(this.$t("common.success"));
                        this.setCarInfoShow = false;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(() => {});
        },
        getTableConfig() {
            let list = [];
            this.tableHeadSelection.splice(5, 0, ...list);
            this.$api.getTableConfig({ tableType: 1 }).then((res) => {
                if (res.success == true) {
                    this.tableSelect.createId = res.data.createId;
                    if (
                        res.data.tableColumnVoList &&
                        res.data.tableColumnVoList.length
                    ) {
                        this.tableSelect.tableColumnVoList =
                            res.data.tableColumnVoList;
                    } else {
                        this.tableSelect.tableColumnVoList = this.$deepCopy(
                            this.tableHeadSelection
                        );
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        getStayNum(num) {
            this.stayNum = num;
        },
        addLabel_R(newCheckedLabel) {
            this.openLayer.addLabel_R(newCheckedLabel, this.showPointerLabel);
        },
        deleteLabel_R(deleteLabelArr) {
            this.openLayer.deleteLabel_R(deleteLabelArr);
        },
        labelRowClick(currentRow) {
            this.openLayer.labelRowClick(currentRow);
        },
        getOverSpeedNum(num) {
            this.overSpeedNum = num;
        },
        changeStateShow(data) {
            let fn = () => {
                if (data === "bigger") {
                    if (this.commonHeight === document.body.clientHeight - 81) {
                        return;
                    }
                    if (this.commonHeight === 41) {
                        this.commonHeight = this.fixHight;
                    } else {
                        this.commonHeight = document.body.clientHeight - 81;
                    }
                }
                if (data === "smaller") {
                    if (this.commonHeight === 41) {
                        return;
                    }
                    if (this.commonHeight === document.body.clientHeight - 81) {
                        this.commonHeight = this.fixHight;
                    } else {
                        this.commonHeight = 41;
                    }
                }
            };
            debounce(fn, 200);
        },
        exportGps() {
            let tableColumnVoList = this.tableSelect.tableColumnVoList.map(
                (item) => {
                    //状态，停车时长、持续驾驶时长导出时，后台需要转换字段，因此不能与原字段重复，后面加上Str
                    if (
                        item.fieldNameEN == "continuousDrivingDuration" ||
                        item.fieldNameEN == "status" ||
                        item.fieldNameEN == "parkingDuration"
                    ) {
                        let item0 = { ...item };
                        item0.fieldNameEN = item0.fieldNameEN + "Str";
                        return item0;
                    }
                    return item;
                    // return item.fieldNameEN !== "continuousDrivingDuration" && item.fieldNameEN !== "status" && item.fieldNameEN !== "parkingDuration";
                }
            );
            tableColumnVoList.unshift({
                // fieldNameCN: "车牌号",
                fieldNameCN: this.$t("common.plateNum"),
                fieldNameEN: "plateNum",
            });
            let params = {
                ...this.gpsExportHistoryTrajectoryForm,
                startTime: this.gpsExportHistoryTrajectoryForm.timeArr[0],
                endTime: this.gpsExportHistoryTrajectoryForm.timeArr[1],
                exportTitle: tableColumnVoList,
            };
            let notifyMy = this.$notify({
                customClass: "export-style",
                iconClass: "el-icon-loading",
                // message: `轨迹回放GPS数据准备中，该过程可能持续几分钟，请勿刷新页面，耐心等待...`,
                message: this.$t("historyPlayback.trackGPSProgress"),
                duration: 0,
                offset: 55,
            });
            this.exportLoading = true;
            this.$api.exportGpsTrack(params).then((res) => {
                if (res.success == true) {
                    var fileName = res.data.fileName;
                    let _this = this;
                    _this.getExportResultInterval = window.setInterval(
                        function () {
                            _this.$api
                                .isExportFinished(fileName)
                                .then((res1) => {
                                    if (
                                        res1.success == true &&
                                        res1.data == true
                                    ) {
                                        notifyMy.close();
                                        var iframe =
                                            document.createElement("iframe");
                                        iframe.src =
                                            (process.env.BASE_API == "/"
                                                ? ""
                                                : process.env.BASE_API) +
                                            "/excel?fileName=" +
                                            fileName;
                                        iframe.style.display = "none";
                                        document.body.appendChild(iframe);
                                        window.clearInterval(
                                            _this.getExportResultInterval
                                        );
                                        _this.getExportResultInterval = "";
                                        _this.exportLoading = false;
                                    }
                                });
                        },
                        2000
                    );
                } else {
                    notifyMy.close();
                    this.exportLoading = false;
                    this.$message.error(
                        this.$t("common.exportFailed") + ":" + res.msg
                    );
                }
            });
            // exportHander.call(
            //     this,
            //     "exportGpsTrack",
            //     params,
            //     `轨迹回放GPS`,
            //     null,
            //     true
            // );
            this.exportConfig = false;
        },
        async exportData() {
            if (this.contentActiveName === "GPSTable") {
                if (this.historyTrajectoryForm.deviceCode == "") {
                    this.$message({
                        type: "error",
                        // message: "车牌号不能为空",
                        message: this.$t("carManage.checkPlateNum2"),
                    });
                    return;
                }
                Object.assign(
                    this.gpsExportHistoryTrajectoryForm,
                    this.historyTrajectoryForm
                );
                let startTime = null;
                let endTime = null;
                if (this.startDay && this.endDay) {
                    startTime =
                        this.startDay + " " + this.historyTrajectoryForm.sTime;
                    endTime =
                        this.endDay + " " + this.historyTrajectoryForm.eTime;
                } else {
                    startTime = today + " " + this.historyTrajectoryForm.sTime;
                    endTime = today + " " + this.historyTrajectoryForm.eTime;
                }
                this.gpsExportHistoryTrajectoryForm.timeArr = [
                    startTime,
                    endTime,
                ];
                this.exportConfig = true;
                // if (this.historyTrajectoryTempData > 30000) {
                //     this.$message({
                //         message: "每次导出数据最多30000条,请缩小导出范围!",
                //         type: "warning"
                //     });
                //     return;
                // }
                // exportHander.call(this, "exportGps", this.historyTrajectoryForm, "轨迹回放GPS", "histroyByGpsExport", true);
            }
        },
        replaceTrakLine() {
            if (Base_Map.trajectoryCorrection) {
                this.playInfo.indexType = "trak";
                this.historyTrajectoryTempData_bak = this.$deepCopy(
                    this.historyTrajectoryTempData
                );
                let { collectTime } =
                    this.historyTrajectoryTempData[this.playInfo.frontIndex];
                this.historyTrajectoryTempData.length = 0;
                this.historyTrajectoryTempData.push(
                    ...Base_Map.trajectoryCorrection
                );
                let index_play = 0;
                this.historyTrajectoryTempData.forEach((item, index) => {
                    if (item.collectTime === collectTime) {
                        index_play = index;
                    }
                });
                this.openLayer.calculatePlayInfo();
                this.playInfo.frontIndex = index_play;
                this.playInfo.tempRate = null;
                this.openLayer.tempRate = null;
            }
        },
        trunBackLine() {
            if (!this.historyTrajectoryTempData_bak) {
                return;
            }
            this.playInfo.indexType = "normal";
            let { collectTime } =
                this.historyTrajectoryTempData[this.playInfo.frontIndex];
            let index_play = 0;
            this.historyTrajectoryTempData.forEach((item, index) => {
                if (item.collectTime === collectTime) {
                    index_play = index;
                }
            });
            this.historyTrajectoryTempData.length = 0;
            this.historyTrajectoryTempData.push(
                ...this.historyTrajectoryTempData_bak
            );
            this.openLayer.calculatePlayInfo();
            this.playInfo.frontIndex = index_play;
            this.playInfo.tempRate = null;
            this.openLayer.tempRate = null;
            this.historyTrajectoryTempData_bak = null;
        },
        getEchartsIndex($index) {
            if (this.playInfo.indexType !== "normal") {
                return;
            }
            let data = this.historyTrajectoryTempData[$index];
            this.playInfo.frontIndex = $index;
            this.playInfo.tempRate = null;
            this.openLayer.tempRate = null;
            if (this.advanceSetForm.polylineColorType === 1) {
                this.openLayer.routeLine
                    .getFeatureById("runLine")
                    .getGeometry()
                    .setCoordinates(
                        this.historyTrajectoryTempData
                            .slice(0, $index)
                            .map(({ lng, lat }) => {
                                return [lng, lat];
                            })
                    );
            }
            if (!this.playInfo.isPlay) {
                this.openLayer.drawMarker("car", data);
            } else {
                this.openLayer.stop();
                this.openLayer.play(this.advanceSetForm);
            }
            this.openLayer.infoWindowShow &&
                this.openLayer.drawInfoWindow({
                    type: "gps",
                    data,
                    position: [data.lng, data.lat],
                });
            // this.openLayer.setCenter(data);
        },
        getTipInform(info) {
            let { type, data, position } = info;
            let { $index } = data;
            this.openLayer.setCenter(position);
            switch (type) {
                case "gps":
                    if (this.playInfo.indexType !== "normal") {
                        return;
                    }
                    this.openLayer.drawInfoWindow(info);
                    let gps = this.historyTrajectoryTempData[$index];
                    if (this.advanceSetForm.polylineColorType === 1) {
                        // this.openLayer.routeLine
                        //     .getFeatureById("runLine")
                        //     .getGeometry()
                        //     .setCoordinates(
                        //         this.historyTrajectoryTempData
                        //             .slice(0, $index)
                        //             .map(({ lng, lat }) => {
                        //                 return [lng, lat];
                        //             })
                        //     );
                    }
                    this.playInfo.frontIndex = $index;
                    this.playInfo.tempRate = null;
                    this.openLayer.tempRate = null;
                    if (!this.playInfo.isPlay) {
                        this.openLayer.drawMarker("car", gps);
                    } else {
                        this.openLayer.stop();
                        this.openLayer.play(this.advanceSetForm);
                    }
                    // this.openLayer.drawMarker("car", data);
                    break;
            }
        },
        dayPick(date) {
            var startTime = date.minDate
                ? new Date(Date.parse(date.minDate.replace(/-/g, "\/")))
                : null;
            var endTime = date.maxDate
                ? new Date(Date.parse(date.maxDate.replace(/-/g, "\/")))
                : null;
            if (
                startTime <= endTime ||
                date.minDate === null ||
                date.maxDate === null
            ) {
                this.selectDayRange = date;
            } else {
                this.selectDayRange = {
                    maxDate: date.minDate,
                    minDate: date.maxDate,
                };
            }
        },
        reInitSearchForm() {
            this.openLayer && this.openLayer.clear();
            this.customIndex++;
            this.addressText = {
                startInfo: null,
                endInfo: null,
                show: false,
            };
            if (this.$refs.gpsTable && this.$refs.gpsTable.GpsParams)
                this.$refs.gpsTable.GpsParams.currentPage = 1;
            this.alarmNum = 0;
            (this.gpsTimeStatus = {
                mileage: 0,
                onlineTime: 0,
                runningTime: 0,
                carParkingTime: 0,
                validGpsNum: 0,
                invalidGpsNum: 0,
                supplementGpsNum: 0,
                maxSpeed: null,
                minSpeed: null,
                totalSpeed: 0,
                avgSpeed: 0,
            }),
                (this.queryState = {
                    queryCount: 0,
                    queryTotal: null,
                });
            this.queryStateTime = {
                queryCount: 0,
                queryTotal: null,
            };
            this.advanceSetForm.trajectorySetting = false;
            this.advanceSetForm.filterOrgionGps = false;
        },
        getCarTraceDataStatsList(params, startTimeTimestamp, endTimeTimestamp) {
            return new Promise((resolve, reject) => {
                let param = {
                    ...params,
                    startTime: Timer.getDateTime(startTimeTimestamp),
                    endTime: Timer.getDateTime(endTimeTimestamp),
                };
                this.$api
                    .carTraceDataStats(param)
                    .then((res) => {
                        if (res.success) {
                            resolve(res.data);
                        } else {
                            this.$message.error(res.msg);
                            reject(res.msg);
                        }
                    })
                    .catch(() => {
                        reject();
                    });
            });
        },
        searchDeviceTrajectory() {
            this.contentActiveName = "GPSTable";
            if (this.currentWachCar.deviceChose == "") {
                this.$message({
                    type: "error",
                    // message: "车牌号不能为空",
                    message: this.$t("carManage.checkPlateNum2"),
                });

                return;
            }
            if (
                !this.startDay ||
                !this.endDay ||
                !this.historyTrajectoryForm.sTime ||
                !this.historyTrajectoryForm.eTime
            ) {
                this.$message({
                    type: "error",
                    // message: "日期不能为空",
                    message: this.$t("videoPlayback.dateCannotBeEmpty"),
                });
                return;
            }
            let startTime =
                this.startDay + " " + this.historyTrajectoryForm.sTime;
            let endTime = this.endDay + " " + this.historyTrajectoryForm.eTime;
            if (startTime == "" || endTime == "") {
                // this.$message.error("请选择轨迹回放时间范围");
                this.$message.error(
                    this.$t("videoPlayback.selectTrajectoryPlaybackTime")
                );
                return;
            } else if (
                new Date(startTime.replace(/-/g, "/")) >
                new Date(endTime.replace(/-/g, "/"))
            ) {
                // this.$message.error("开始时间不能晚于结束时间");
                this.$message.error(
                    this.$t("videoPlayback.starttimeNotLaterThanEndTime")
                );
                return;
            }
            this.$nextTick(() => {
                // let params = this.searchVideoForm;
                let startTime =
                    this.startDay + " " + this.historyTrajectoryForm.sTime;
                let endTime =
                    this.endDay + " " + this.historyTrajectoryForm.eTime;
                // let startTime = this.selectDate + " " + Timer.getTime(this.historyTrajectoryForm.time[0]);
                // let endTime = this.selectDate + " " + Timer.getTime(this.historyTrajectoryForm.time[1]);
                // params.startTime = Timer.getDateTime(startTime);
                // params.endTime = Timer.getDateTime(endTime);
                // if (this.$moment(params.endTime).valueOf() - this.$moment(params.startTime).valueOf() < 0) {
                //     this.$message({ type: "error", message: "开始时间不得小于结束时间" });
                //     return;
                // }
                let obj = {
                    plateNum: this.currentWachCar.plateNum,
                    taskStartTime: startTime,
                    taskEndTime: endTime,
                };
                this.$refs["g-table"].searchTable(obj, true);
            });
            // this.currentWachCar.taskStartTime = this.historyTrajectoryForm.startTime;
            // this.currentWachCar.taskEndTime = this.historyTrajectoryForm.endTime;
            // this.$api.pagePortableTask(this.currentWachCar).then((res) => {
            //     if (res.success) {
            //         this.recordList = res.data.results;
            //     } else {
            //         this.$message.error(res.msg);
            //     }
            // }).catch(() => { });
        },
        searchHistoryTrajectory() {
            if (this.currentWachCar && this.currentWachCar.isFrozen) {
                // this.$message.warning(
                //     "当前车辆欠费冻结状态，请缴费解冻后使用该功能!"
                // );
                this.$message.warning(this.$t("videoPlayback.vehicleFrozen"));
                return;
            }
            this.contentActiveName = "GPSTable";
            if (this.historyTrajectoryForm.deviceCode == "") {
                this.$message({
                    type: "error",
                    // message: "车牌号不能为空",
                    message: this.$t("carManage.checkPlateNum2"),
                });
                return;
            }
            // if (
            //     this.currentWachCar.deviceStatus === 2 &&
            //     this.currentWachCar.dormantStatus != 2
            // ) {
            //     this.awakenVisible = true;
            //     this.awakenTime = 0;
            //     this.awakenDeviceId = this.currentWachCar.deviceId;
            //     return;
            // }
            if (
                !this.startDay ||
                !this.endDay ||
                !this.historyTrajectoryForm.sTime ||
                !this.historyTrajectoryForm.eTime
            ) {
                this.$message({
                    type: "error",
                    // message: "日期不能为空",
                    message: this.$t("videoPlayback.dateCannotBeEmpty"),
                });
                return;
            }
            let startTime =
                this.startDay + " " + this.historyTrajectoryForm.sTime;
            let endTime = this.endDay + " " + this.historyTrajectoryForm.eTime;
            if (startTime == "" || endTime == "") {
                // this.$message.error("请选择轨迹回放时间范围");
                this.$message.error(
                    this.$t("videoPlayback.selectTrajectoryPlaybackTime")
                );
                return;
            } else if (
                new Date(startTime.replace(/-/g, "/")) >
                new Date(endTime.replace(/-/g, "/"))
            ) {
                // this.$message.error("开始时间不能晚于结束时间");
                this.$message.error(
                    this.$t("videoPlayback.starttimeNotLaterThanEndTime")
                );
                return;
            }
            this.historyTrajectoryForm.startTime = startTime;
            this.historyTrajectoryForm.endTime = endTime;
            let startTimeTimestamp = parseInt(
                this.$moment(this.historyTrajectoryForm.startTime).format("x")
            );
            let endTimeTimestamp = parseInt(
                this.$moment(this.historyTrajectoryForm.endTime).format("x")
            );
            let diff = endTimeTimestamp - startTimeTimestamp;
            if (diff > 3 * 24 * 3600 * 1000) {
                // this.$message.warning("查询时间不能超过3天");
                this.$message.warning(
                    this.$t("historyPlayback.queryTimeCannotExceed3days")
                );
                return;
            }
            this.showCarNumber = this.historyTrajectoryForm.plateNum;
            this.reInitSearchForm();
            this.openLayer.clear();
            this.loading = true;
            this.loadingMapNum = 0;
            this.getGpsData(this.historyTrajectoryForm, async (info, msg) => {
                if (info instanceof Array) {
                    info.forEach((item, index) => {
                        item.index = index;
                        if (item.gpsValid === 1) {
                            this.gpsTimeStatus.validGpsNum =
                                this.gpsTimeStatus.validGpsNum + 1;
                        } else {
                            this.gpsTimeStatus.invalidGpsNum =
                                this.gpsTimeStatus.invalidGpsNum + 1;
                        }
                        if (item.supplementSign === 1) {
                            this.gpsTimeStatus.supplementGpsNum =
                                this.gpsTimeStatus.supplementGpsNum + 1;
                        }
                        if (item.speed !== undefined) {
                            if (this.gpsTimeStatus.maxSpeed === null) {
                                this.gpsTimeStatus.maxSpeed = item.speed;
                            } else if (
                                item.speed > this.gpsTimeStatus.maxSpeed
                            ) {
                                this.gpsTimeStatus.maxSpeed = item.speed;
                            }
                            if (this.gpsTimeStatus.minSpeed === null) {
                                this.gpsTimeStatus.minSpeed = item.speed;
                            } else if (
                                item.speed < this.gpsTimeStatus.minSpeed
                            ) {
                                this.gpsTimeStatus.minSpeed = item.speed;
                            }
                            this.gpsTimeStatus.totalSpeed =
                                this.gpsTimeStatus.totalSpeed + item.speed;
                        }
                        let { lng: lngGaode, lat: latGaode } =
                            gpsConverter.gps_gaode(
                                item.longitude,
                                item.latitude
                            );
                        let { lng: lngBaidu, lat: latBaidu } =
                            gpsConverter.gaode_baidu(
                                item.longitudeGcj,
                                item.latitudeGcj
                            );
                        let [lng, lat] = fromLonLat([
                            item.longitude,
                            item.latitude,
                        ]);

                        let res = {
                            lng,
                            lat,
                            lngGaode,
                            latGaode,
                            lngBaidu,
                            latBaidu,
                            address: "",
                        };
                        Object.assign(item, res);
                    });
                    this.openLayer.addPath(info, this.advanceSetForm, false);
                    this.openLayer.drawMarker(
                        "start",
                        this.historyTrajectoryTempData[0]
                    );
                } else {
                    if (info === "last" || info === "error") {
                        if (info === "error") {
                            this.$message.error(msg);
                        }
                        this.loading = false;
                        this.openLayer.addPath([], this.advanceSetForm, true);
                        if (this.historyTrajectoryTempData.length > 0) {
                            this.gpsTimeStatus.avgSpeed =
                                this.gpsTimeStatus.totalSpeed /
                                this.historyTrajectoryTempData.length;
                            this.openLayer.calculatePlayInfo();
                            let gpsStart = this.historyTrajectoryTempData[0];
                            let gpsEnd =
                                this.historyTrajectoryTempData[
                                    this.historyTrajectoryTempData.length - 1
                                ];
                            // this.openLayer.drawMarker("car", this.historyTrajectoryTempData[0]);
                            this.openLayer.drawMarker(
                                "end",
                                this.historyTrajectoryTempData[
                                    this.historyTrajectoryTempData.length - 1
                                ]
                            );
                            let gpsList = [gpsStart, gpsEnd];
                            await transferAddress(
                                gpsList,
                                "longitude",
                                "latitude",
                                "address"
                            );
                            let startInfo = {
                                address: gpsStart.address,
                                time: gpsStart.collectTime,
                            };
                            let endInfo = {
                                address: gpsEnd.address,
                                time: gpsEnd.collectTime,
                            };
                            this.addressText = {
                                show: true,
                                startInfo,
                                endInfo,
                            };
                            if (this.advanceSetForm.polylineShowType === 1) {
                                this.openLayer.toggleGpsMarkers(true);
                            }
                        } else if (info !== "error") {
                            // this.$message.info("暂无轨迹");
                            this.$message.info(
                                this.$t("historyPlayback.noTrajectory")
                            );
                        }
                    }
                }
            });
        },
        async getGpsData(historyTrajectoryForm, cb) {
            let promisePage = (params, cb) => {
                this.$api
                    .getGpsTrackPage(params)
                    .then((res) => {
                        if (res.success) {
                            this.queryState.queryCount++;
                            cb(res.data.results);
                            if (this.queryState.queryCount === 1) {
                                this.queryState.queryTotal =
                                    res.data.totalPages;
                                params.queryData = true;
                            }
                            if (
                                this.queryState.queryCount >=
                                this.queryState.queryTotal
                            ) {
                                cb("last");
                            } else {
                                params.currentPage++;
                                promisePage(params, cb);
                            }
                        } else {
                            cb("error", res.msg);
                        }
                    })
                    .catch((err) => {});
            };
            let params = {
                ...historyTrajectoryForm,
                ...{
                    pageSize: 2000,
                    currentPage: 1,
                    queryData: false,
                },
            };
            promisePage(params, cb);
        },
        playOrPauseHistoryTrajectory() {
            if (
                !this.historyTrajectoryTempData.length ||
                this.loading ||
                this.loadingMap
            ) {
                return;
            }
            if (this.playInfo.isPlay) {
                this.openLayer.stop();
            } else {
                if (this.loadingMapNum === 0) {
                    this.loadingMap = true;
                    this.loadingMapNum++;
                }
                this.openLayer.addAllPath(
                    this.playInfo.filterGps,
                    this.advanceSetForm,
                    "gray"
                );
                this.openLayer.play(this.advanceSetForm);
                setTimeout(() => {
                    this.loadingMap = false;
                }, 1000);
            }
        },
        pageResize() {
            this.pageHeight = utils.getTableHeight.call(this);
            let dom = document.getElementById("history-content-right");
            if (dom) {
                this.slideWidth = dom.offsetWidth - 800;
            }
        },
        clear() {
            Object.assign(this.historyTrajectoryForm, {
                id: "",
                deviceCode: "",
                plateNum: "",
                carId: "",
            });
        },
        getAdvanceSetting() {
            if (localStorage.getItem("advanceSetting")) {
                let advanceSetting = JSON.parse(
                    localStorage.getItem("advanceSetting")
                );
                let advanceSetForm = {
                    ...advanceSetting,
                    ...{ trajectorySetting: false, filterOrgionGps: false },
                };
                Object.assign(this.advanceSetForm, advanceSetForm);
                if (advanceSetting.playMode !== undefined) {
                    this.playInfo.playMode = advanceSetting.playMode;
                }
                if (advanceSetting.polylineWidth !== undefined) {
                    this.playInfo.polylineWidth = advanceSetting.polylineWidth;
                }
                if (advanceSetting.projectGpsPointerColor !== undefined) {
                    this.playInfo.projectGpsPointerColor =
                        advanceSetting.projectGpsPointerColor;
                }
            }
        },
        // setDeault() {
        //     let trackPlaybackCar = sessionStorage.getItem("trackPlaybackCar");
        //     if (trackPlaybackCar) {
        //         this.trackPlaybackCar = JSON.parse(trackPlaybackCar);
        //         this.trackPlaybackCar.isFrozen = this.trackPlaybackCar.freeze;
        //         this.currentNodeKey = this.trackPlaybackCar.actCarNumber;
        //         this.historyTrajectoryForm.deviceCode =
        //             this.trackPlaybackCar.deviceCode;
        //         this.historyTrajectoryForm.carId = this.trackPlaybackCar.id;
        //         this.historyTrajectoryForm.plateNum =
        //             this.trackPlaybackCar.actCarNumber;
        //         if (this.trackPlaybackCar.date) {
        //             this.selectDayRange = {
        //                 minDate: this.trackPlaybackCar.date,
        //                 maxDate: this.trackPlaybackCar.date,
        //             };
        //         } else {
        //             this.selectDayRange = { minDate: today, maxDate: today };
        //         }
        //         setTimeout(() => {
        //             this.searchHistoryTrajectory();
        //         }, 0);
        //         sessionStorage.removeItem("trackPlaybackCar");
        //     }
        // },
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
        collapse() {
            this.leftWidth = this.leftWidth === "424px" ? "0px" : "424px";
            this.$nextTick(() => {
                const event = new Event("resize");
                window.dispatchEvent(event);
            });
        },
        saveAdvanceSetting() {
            if (this.historyTrajectoryTempData.length) {
                this.openLayer.stop();
                this.openLayer.removeOverlay("routeLine");
                this.openLayer.toggleGpsMarkers(false);
                this.openLayer.addAllPath(
                    this.playInfo.filterGps,
                    this.advanceSetForm,
                    this.advanceSetForm.polylineShowType === 1
                        ? "gray"
                        : "#409eff"
                );

                if (this.advanceSetForm.polylineShowType === 1) {
                    this.openLayer.initGpsMakersLayer(
                        this.advanceSetForm.colorList
                    );
                    this.openLayer.toggleGpsMarkers(true);
                }
            }

            let save = this.$deepCopy(this.advanceSetForm);
            delete save.trajectorySetting;
            delete save.filterOrgionGps;
            localStorage.setItem("advanceSetting", JSON.stringify(save));
            this.settingModel = false;
        },
        getGpsTrackEnum() {
            this.$api.getGpsTrackEnum({ type: 2 }).then((res) => {
                if (res.success) {
                    this.locateTypeList = res.data;
                }
            });
            this.$api.getGpsTrackEnum({ type: 3 }).then((res) => {
                if (res.success) {
                    this.uploadModeList = res.data;
                }
            });
        },
        setDeault() {
            let historyItem = JSON.parse(sessionStorage.getItem("historyItem"));
            if (historyItem) {
                setTimeout(() => {
                    this.searchForm.deviceCode = historyItem.deviceCode;
                    // this.searchForm.plateArr = [
                    //     {
                    //         plateNum: historyItem.plateNum,
                    //         id: historyItem.carId,
                    //     },
                    // ];
                    this.currentWachCar = {
                        ...historyItem,
                        deviceId: historyItem.id,
                        html: `<span>${
                            historyItem.plateNum || "--"
                        }</span>；<span>${
                            historyItem.deviceCode || "--"
                        }</span>；<span>${
                            historyItem.deviceSerialNum || "--"
                        }</span>；<span>${historyItem.vin || "--"}</span>`,
                        title: `${historyItem.plateNum || "--"}；${
                            historyItem.deviceCode || "--"
                        }；${historyItem.deviceSerialNum || "--"}；${
                            historyItem.vin || "--"
                        }`,
                    };
                    setTimeout(() => {
                        this.selectDayRange = {
                            minDate: this.$moment(
                                historyItem.collectTime
                            ).format("YYYY-M-D"),
                            maxDate: this.$moment(historyItem.endTime).format(
                                "YYYY-M-D"
                            ),
                        };
                        let startTimeTimestamp = parseInt(
                            this.$moment(historyItem.collectTime).format("x")
                        );
                        this.historyTrajectoryForm.sTime = this.$moment(
                            historyItem.collectTime
                        ).format("HH:mm:ss");
                        let endTimeTimestamp = parseInt(
                            this.$moment(historyItem.endTime).format("x")
                        );
                        let diff = endTimeTimestamp - startTimeTimestamp;
                        if (diff > 3 * 24 * 3600 * 1000) {
                            this.historyTrajectoryForm.eTime = this.$moment(
                                historyItem.collectTime
                            )
                                .add(2, "d")
                                .format("HH:mm:ss");
                            this.selectDayRange.maxDate = this.$moment(
                                historyItem.collectTime
                            )
                                .add(2, "d")
                                .format("YYYY-M-D");
                        } else {
                            this.historyTrajectoryForm.eTime = this.$moment(
                                historyItem.endTime
                            ).format("HH:mm:ss");
                        }

                        //选择日期
                        this.$refs.datePannel.markRange(
                            this.selectDayRange.minDate,
                            this.selectDayRange.maxDate
                        );
                        let month = this.$moment(
                            historyItem.collectTime
                        ).format("M");
                        while (month < new Date().getMonth() + 1) {
                            this.$refs.datePannel.changeMonth(-1);
                            month++;
                        }
                        this.searchHistoryTrajectory();
                        sessionStorage.removeItem("historyItem");
                    }, 500);
                }, 500);
            } else if (this.$store.state.tree.defaultMaintenanceCar) {
                let defaultMaintenanceCar = JSON.parse(
                    this.$store.state.tree.defaultMaintenanceCar
                );
                this.searchForm.deviceCode = defaultMaintenanceCar.deviceCode;
                this.currentWachCar = defaultMaintenanceCar;
            }
        },
        makerClick(data) {
            this.$refs.gpsTable.setColumn(data.collectTime);
        },
    },
    created() {
        this.setDeault();
    },
    mounted() {
        let utilMethods = {
            toggleCheck: () => {},
            makerClick: (data) => {
                this.makerClick(data);
            },
        };
        this.getGpsTrackEnum();
        this.getAdvanceSetting();
        this.openLayer = new O_Map(
            "openLayer",
            this.playInfo,
            utilMethods,
            this.advanceSetForm.colorList
        );
        this.getTableConfig();
        this.historyTrajectoryTempData = this.playInfo.path;
        dragTwoRowDiv(
            "history-content-right",
            "history-content-top",
            "monitor-resize",
            "history-content-bottom",
            (bottomHeight) => {
                this.commonHeight = bottomHeight;
                this.fixHight = this.commonHeight;
            },
            {
                minHeight: 41,
                ifTopBoxHeight: false,
            }
        );
        dragMoveDiv(
            document.getElementsByClassName("play-content")[0],
            document.getElementsByClassName("number")[0]
        );
        this.$nextTick(() => {
            this.pageResize();
        });
        window.addEventListener("resize", this.pageResize, true);
        setTimeout(() => {
            this.setDeault();
        }, 1000);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.pageResize, true);
    },
};
</script>
<style lang="less">
.triangle {
    position: absolute;
    bottom: -8px;
    left: calc(50% - 10px);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid white;
}

.iclass {
    position: absolute;
    right: 10px;
    top: 5px;
    width: 5px;
    height: 5px;
}

.info-class {
    position: relative;
    box-shadow: 0 0 4px 2px rgba(100, 100, 100, 0.2);
    box-sizing: content-box;
    padding: 10px;
    background: white;
    top: -10px;
    left: 20px;
}

.model {
    background: rgb(222, 222, 222);
    opacity: 0.5;
    pointer-events: none;
}

.informClass {
    background: white;
    height: 100%;
    width: 300px;
    flex-direction: column;
    display: flex;
    justify-content: space-around;
    font-size: 13px;
    line-height: 20px;
    // > p {
    //     overflow: hidden;
    //     white-space: nowrap;
    //     text-overflow: ellipsis;
    // }
}

.amapclass {
    .amap-info-close {
        position: absolute;
        top: 2px !important;
        right: 2px !important;
    }
}

.history-content-top-left {
    .custom-tag-marker,
    .custom-tag-marker-noLabel {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: -12px;
        margin-top: -15px;

        .tag-name {
            display: inline-block;
            max-width: 15rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
        }

        .tag-name-text {
            font-size: 10px;
            color: #000;
            background-color: #fff;
            border: 1px solid #ccc;
            display: inline-block;
            width: 4rem;
            text-align: center;
            margin-top: -4px;
            margin-left: 4px;
            padding: 3px 0;
            white-space: normal;
            word-break: break-all;
        }

        .marker-icon {
            font-size: 20px;
            display: inline-block;
            width: 24px;
            height: 30px;
            background-size: contain;
        }
    }
}

.custom-loading-none {
    .el-loading-spinner .circular {
        display: none !important;
    }
}
</style>
<style lang="less" scoped>
.deviceStatus-0 {
    color: #909399;
}
.deviceStatus-1 {
    color: #67c23a;
}
.deviceStatus-2 {
    color: #e6a23c;
}
.error-Item {
    /deep/ .el-form-item__error {
        margin-top: -10px;
    }
}

.G-input-number-in {
    /deep/ .el-input__inner {
        height: 24px;
        width: 60px;
    }
}

.G-Number-input {
    /deep/.el-input {
        width: 110px !important;
    }
}

.address-text {
    font-size: 14px;
    line-height: 20px;
    position: absolute;
    left: 16px;
    bottom: 50px;
    width: 300px;
    background: white;
    z-index: 1000;
    box-shadow: 0px 3px 5px 0 rgb(160, 160, 189, 0.5) !important;

    .el-icon-close {
        position: absolute;
        right: 6px;
        top: 5px;
        font-size: 16px;
    }
}

.i-class {
    position: absolute;
    top: 45%;
    left: -5px;
    z-index: 999;
}

.play-content {
    box-shadow: 0 0 2px 1px rgba(160, 160, 189, 0.5);
    position: absolute;
    background: white;
    height: 32px;

    .number {
        height: 100%;
        margin-left: 16px;
        width: 144px;
        display: flex;
        justify-content: space-between;
        line-height: 8px;
    }

    .number-in {
        justify-content: center;
        flex: 1;
        height: 100%;
        align-items: center;
    }

    .el-slider {
        // margin-left: 1rem;
        height: 10px;

        /deep/.el-slider__runway {
            margin: 3px;
        }

        /deep/.el-slider__button-wrapper {
            width: 18px;
            height: 18px;
            top: -7px;
        }

        /deep/.el-slider__button-wrapper {
            z-index: 999;
        }
    }
}

.dashbord-nav-right {
    position: absolute;
    right: 0.4rem;
    top: 3rem;
    z-index: 0;
    padding: 5px;

    .map-tool {
        z-index: 0;
        width: 24px;
        height: 25px;
        text-align: center;
        background-color: #ffffff;
        cursor: pointer;
        border-bottom: 1px solid #c0c4cc;
    }

    .img-icon {
        width: 24px;
        height: 24px;
    }

    .map-switch {
        .iconfont {
            line-height: 24px;
            font-size: 18px;
        }
    }

    .checked {
        background-color: #2080f7;

        .icon-map_icon_small:before {
            color: #fff;
        }
    }
}

.history-palyback {
    display: flex;
    text-align: left;

    .history-content-right {
        position: relative;
        overflow: auto;
        flex: 1;
        display: flex;
        flex-direction: column;

        .history-content-top {
            flex: 1;
            display: flex;

            .history-content-top-left {
                display: flex;
                position: relative;
                flex: 1;
                border-right: 1px solid #ccc;

                #openLayer {
                    flex: 1;
                }
            }
        }

        .history-content-bottom {
            position: relative;
            // height: 16rem;
            border-top: 1px solid #ccc;

            .full-screen {
                .el-button {
                    margin-left: 10px;
                }

                position: absolute;
                height: 40px;
                line-height: 40px;
                top: 0;
                right: 1rem;
                cursor: pointer;
                z-index: 10;
            }
        }
    }
}

.history-content-bottom /deep/.el-tabs__header {
    margin: 0px;
    padding: 0;

    .el-tabs__nav {
        margin: 0 1rem;
    }
}

.styleTitle {
    box-shadow: 3px 3px 3px #888888;
    padding: 10px;

    p {
        font-size: 14px;
    }

    span {
        font-size: 14px;
    }

    color: #606266;
}

.styleBottom {
    padding-right: 0.5rem;
    font-size: 0.8rem;
    display: flex;
    color: #606266;
    font-size: 14px;

    > span {
        width: 150px;
    }
}

.ltemClass {
    padding: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-image {
        width: 30px;
        height: 30px;
    }
}

.titleRight {
    display: flex;
    justify-content: center;
    align-items: center;

    .el-image {
        width: 1.5rem;
        height: 1.5rem;
    }

    &:hover {
        cursor: pointer;
    }
}

.titleRightClass {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    width: 20rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px 0px 5px 0 rgba(160, 160, 189, 0.5) !important;
    // box-shadow: 3px 3px 3px #888888;
}

.bottomRightClass {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 40px;
    width: 100%;
    background-image: linear-gradient(
        270deg,
        #ffffff 0%,
        rgba(255, 255, 255, 0) 100%
    );
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.flex-middle {
    align-items: center;
}
.flex-layout {
    display: flex;
}
.flex-wrap {
    flex-wrap: wrap;
}
.search-param {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    .el-checkbox {
        width: 110px;
    }
}
.titleLeftClass {
    justify-content: space-between;
    box-shadow: 0px -3px 5px 0 rgba(160, 160, 189, 0.5) !important;
    font-size: 0.8rem;
    color: #ffffff;
    align-items: center;
    display: flex;
    padding: 0 0.4rem;
    background-image: linear-gradient(90deg, #63a6f9 0%, #2080f7 100%);
    position: absolute;
    top: 0.6rem;
    left: 1rem;
    width: 19rem;
    height: 3.1rem;

    p {
        font-size: 0.8rem;
        line-height: 1.2rem;
    }

    > div:nth-child(2) {
        margin-right: 0.2rem;
    }

    > div {
        width: 33.3%;

        > p {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}

.titleLeftClass2 {
    border-radius: 6px;
    box-shadow: 0px 3px 5px 0 rgba(160, 160, 189, 0.5) !important;
    background-color: #ffffff;
    position: absolute;
    font-size: 13px;
    padding: 0 8px;
    top: 10px;
    left: 16px;
    width: 300px;
    height: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .titleLeftClass2-inspan {
        color: #328af7;
    }

    .shuxian {
        color: gray;
    }
}

.formClass {
    padding: 0 0.95rem;
    margin: 1rem 0;
}

.my-elbt {
    width: 6rem !important;
    height: 2rem !important;
}

.alarmCheckedStyle {
    display: block;

    /deep/.el-checkbox__label {
        font-size: 0.8rem !important;
    }
}

.button-div {
    width: 100%;
    height: 40px;
}

.myline {
    display: flex;
    background: rgba(0, 0, 0, 0.08);
    width: 0.1rem;
    height: 1rem;
}

.timechose {
    font-size: 14px;
    .el-input__prefix {
        padding: 0px;
    }
    display: flex;
    justify-content: space-between;
    align-items: center;

    .el-date-editor.el-input {
        width: 120px;
    }
}

.el-input-number--mini {
    width: 100px !important;
}

.popoverContent {
    width: 100%;
    display: flex;
    justify-content: center;
}

.el-divider--horizontal {
    margin: 0px !important;
}

.btStyle {
    text-align: right;

    .el-link:nth-child(2) {
        margin-left: 15px;
    }
}

.amap-info-close {
    top: 2px !important;
    left: 2px !important;
}

.el-form-content {
    margin-bottom: 0px !important;

    .el-slider {
        width: 9rem;
    }
}

.history-palyback {
    .full {
        height: calc(100vh - 126px);
    }

    .nofull {
        height: 250px;
    }
}

.cutom-map-div {
    position: fixed;
    right: 0;
    top: 80px;
    height: calc(~"100% - 80px");
    z-index: 2100;
    width: 16rem;
    text-align: center;
}
.drag-resize {
    z-index: 9;
    height: 5px;
    width: 100%;
    background-color: #eaeaea;
}

.drag-resize:hover {
    cursor: ns-resize;
    background-color: #b7d0e0;
}

.myel-class {
    background: white;
    height: 100%;

    /deep/.el-tabs__content {
        height: calc(~"100% - 44px");
    }

    /deep/ .el-tab-pane {
        height: 100%;
    }

    .el-tabs__nav-wrap {
        margin-bottom: 0 !important;
    }
}

.mycontent {
    height: 100%;
}

.test-class {
    color: "red";
}

.polyline-width /deep/ .el-slider__runway {
    margin: 11px 0px !important;
}

.box {
    box-shadow: 0 0 1px 2px rgba(100, 100, 100, 0.2);
}

.position-style {
    .el-checkbox {
        margin-right: 10px;
    }
}

.checked-status {
    color: #2080f7;
}

.board {
    left: 80px;
    top: 20px;
    position: absolute;
    height: 100px;
    width: 100px;
    background: white;
}

.remind {
    box-sizing: content-box;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 100px;
    left: 50%;
    width: 300px;
    height: 40px;
    background: white;
    z-index: 10000;
    font-size: 14px;
    box-shadow: 0 0 4px 2px rgba(100, 100, 100, 0.2);
    padding: 2px 2px;
    border-radius: 5px;
}

.begin-icon {
    flex-shrink: 0;
    flex-grow: 0;
    padding-left: 4px;
    width: 22px;
    height: 22px;
    background: #1890ff;
    line-height: 22px;
    color: white;
    border-radius: 50%;
    font-size: 14px;
}

.end-icon {
    flex-shrink: 0;
    flex-grow: 0;
    padding-left: 4px;
    width: 22px;
    height: 22px;
    line-height: 22px;
    background: red;
    color: white;
    border-radius: 50%;
}
.car-select {
    padding: 12px;
    display: flex;
    .car-type {
        width: 85px;
        margin-right: -1px;
    }
}
.setting-box {
    .btn-box {
        display: flex;
        align-items: center;
    }
    .color-list {
        margin-top: 12px;
        display: flex;
        flex-wrap: wrap;
        .el-color-picker {
            margin-right: 4px;
        }
        & > div {
            display: flex;
            align-items: center;
            width: 150px;
            margin-bottom: 12px;
        }
    }
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
.awaken-dialog {
    .el-dialog__body {
        padding: 0px 20px !important;
    }
}
</style>
