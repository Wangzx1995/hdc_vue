<template>
    <div class="condition-monitoring">
        <div class="deviceMessage">
            <div class="device_box">
                <div class="device_div">
                    <!-- 车牌号、设备型号、设备版本号、所属组织、终端手机号、设备序列号、VIN码 -->
                    <span class="deviceLabel">车牌号:</span>
                    <span class="deviceContent">{{
                        deviceMessage.plateNum || "--"
                    }}</span>
                </div>
                <div class="device_div">
                    <span class="deviceLabel">设备型号:</span>
                    <span
                        class="deviceContent"
                        v-if="
                            deviceMessage.deviceModelCode ||
                            deviceMessage.protocolName
                        "
                        >{{ deviceMessage.deviceModelCode
                        }}<span v-if="deviceMessage.protocolName"
                            >({{ deviceMessage.protocolName }})</span
                        ></span
                    >
                    <span v-else> -- </span>
                </div>

                <div class="device_div">
                    <span class="deviceLabel">设备版本号:</span>
                    <span class="deviceContent">{{
                        deviceMessage.softwareVersion || "--"
                    }}</span>
                </div>

                <div class="device_div">
                    <span class="deviceLabel">所属组织:</span>
                    <span class="deviceContent">{{
                        deviceMessage.orgName || "--"
                    }}</span>
                </div>
                <div class="device_div">
                    <span class="deviceLabel">终端手机号:</span>
                    <span class="deviceContent">{{
                        deviceMessage.deviceCode || "--"
                    }}</span>
                </div>
                <div class="device_div">
                    <span class="deviceLabel">设备序列号:</span>
                    <span class="deviceContent">{{
                        deviceMessage.deviceSerialNum || "--"
                    }}</span>
                </div>
                <div class="device_div">
                    <span class="deviceLabel">VIN码:</span>
                    <span class="deviceContent">{{
                        deviceMessage.vin || "--"
                    }}</span>
                </div>
            </div>
            <div class="top">
                <div class="top-left">
                    <el-form
                        :model="searchForm"
                        inline
                        label-position="top"
                        ref="searchForm"
                    >
                        <el-form-item label="时间段">
                            <el-date-picker
                                v-model="time"
                                format="yyyy-MM-dd"
                                type="daterange"
                                :clearable="false"
                                :start-placeholder="$t('common.startTime')"
                                :end-placeholder="$t('common.endTime')"
                            />
                        </el-form-item>
                    </el-form>
                </div>
                <div class="top-right">
                    <el-button
                        class=""
                        type="primary"
                        :disabled="searchLoading"
                        :loading="searchLoading"
                        @click="getInspectionRecordByDevice()"
                        >查询</el-button
                    >
                    <el-button
                        type="default"
                        @click="handleReset($refs.searchForm)"
                        >清除条件</el-button
                    >
                </div>
                <div
                    style="
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                    "
                >
                    <div class="top-bottom">
                        <el-tooltip
                            content="将导出巡检历史数据及GPS数据"
                            placement="top-start"
                        >
                            <el-button
                                tips-placement="top-end"
                                tips="将导出巡检历史数据及GPS数据"
                                @click="goExport"
                                :loading="
                                    loadingAll ||
                                    !!getExportResultInterval_ ||
                                    !!getExportResultInterval ||
                                    !!getExportResultInterval2_
                                "
                                :disabled="loadingAll"
                                >导出原始数据</el-button
                            >
                        </el-tooltip>
                    </div>
                    <div
                        class="top-bottom m-l-lg"
                        style="
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            font-size: medium;
                        "
                    >
                        <div style="display: flex">故障:</div>
                        <div class="type-Pink" style="display: flex"></div>
                        <div style="display: flex">信号传入:</div>
                        <div class="type-Blue" style="display: flex"></div>
                    </div>
                </div>
            </div>
        </div>
        <div style="width: 100%">
            <div class="dateContent">
                <ul class="titleTh">
                    <li class="titleTdDate" title="日期">日期</li>
                    <li class="titleTd" title="信号状态">信号状态</li>
                    <li class="titleTd" title="存储状态">存储状态</li>
                    <li class="titleTd" title="定位状态">定位状态</li>
                    <li class="titleTd-hidden" title="视频信号状态">
                        视频信号状态
                    </li>
                    <li class="titleTd-hidden" title="视频信号丢失状态">
                        视频信号丢失状态
                    </li>
                    <li class="titleTd" title="录像状态">录像状态</li>
                    <li class="titleTd" title="左转向">左转向</li>
                    <li class="titleTd" title="右转向">右转向</li>
                    <li class="titleTd" title="刹车">刹车</li>
                    <li class="titleTd-hidden" title="ADAS架设状态">
                        ADAS架设状态
                    </li>
                    <li class="titleTd-hidden" title="DSM架设状态">
                        DSM架设状态
                    </li>
                    <li class="titleTd-hidden" title="BSD架设状态">
                        BSD前架设状态
                    </li>
                    <li class="titleTd-hidden" title="BSD架设状态">
                        BSD后架设状态
                    </li>
                    <li class="titleTd-hidden" title="BSD架设状态">
                        BSD左架设状态
                    </li>
                    <li class="titleTd-hidden" title="BSD架设状态">
                        BSD右架设状态
                    </li>
                    <li class="titleTd-hidden noBorder" title="WHD架设状态">
                        WHD架设状态
                    </li>
                </ul>
                <!-- <div class="contentHeight" :style="`height:${listHeight}px`"> -->
                <ul
                    v-for="(item, index) in listData"
                    :key="index"
                    class="contentTh"
                >
                    <li class="contentTdDate">{{ item.date }}</li>
                    <li class="contentTd">
                        <el-popover
                            v-if="item.showInspectionRecords[0].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[0]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="信号状态异常"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[0].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line"
                            ></div>
                        </el-popover>
                    </li>
                    <li class="contentTd">
                        <el-popover
                            v-if="item.showInspectionRecords[1].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[1]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="存储状态异常"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[1].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line"
                            ></div>
                        </el-popover>
                    </li>
                    <li class="contentTd">
                        <el-popover
                            v-if="item.showInspectionRecords[2].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[2]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="定位状态异常"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[2].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line"
                            ></div>
                        </el-popover>
                    </li>
                    <li class="contentTd">
                        <el-popover
                            v-if="item.showInspectionRecords[3].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[3]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="视频信号状态异常"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[3].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line"
                            ></div>
                        </el-popover>
                    </li>
                    <li class="contentTd">
                        <el-popover
                            v-if="item.showInspectionRecords[4].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[4]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="视频信号丢失状态异常"
                            overflow="hidden"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[4].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line"
                            ></div>
                        </el-popover>
                    </li>
                    <li class="contentTd">
                        <el-popover
                            v-if="item.showInspectionRecords[5].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[5]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="录像状态异常"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[5].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line"
                            ></div>
                        </el-popover>
                    </li>
                    <li class="contentTd">
                        <el-popover
                            v-if="item.showInspectionRecords[6].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[6]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="左转向异常"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[6].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line lineBlue"
                            ></div>
                        </el-popover>
                    </li>
                    <li class="contentTd">
                        <el-popover
                            v-if="item.showInspectionRecords[7].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[7]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="右转向异常"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[7].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line lineBlue"
                            ></div>
                        </el-popover>
                    </li>
                    <li class="contentTd">
                        <el-popover
                            v-if="item.showInspectionRecords[8].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[8]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="刹车异常"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[8].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line lineBlue"
                            ></div>
                        </el-popover>
                    </li>
                    <li class="contentTd">
                        <el-popover
                            v-if="item.showInspectionRecords[9].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[9]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="ADAS架设状态异常"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[9].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line"
                            ></div>
                        </el-popover>
                    </li>
                    <li class="contentTd">
                        <el-popover
                            v-if="item.showInspectionRecords[10].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[10]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="DSM架设状态异常"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[10].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line"
                            ></div>
                        </el-popover>
                    </li>
                    <li class="contentTd">
                        <el-popover
                            v-if="item.showInspectionRecords[14].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[14]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="BSD前架设状态异常"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[14].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line"
                            ></div>
                        </el-popover>
                    </li>
                    <li class="contentTd">
                        <el-popover
                            v-if="item.showInspectionRecords[15].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[15]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="BSD后架设状态异常"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[15].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line"
                            ></div>
                        </el-popover>
                    </li>
                    <li class="contentTd">
                        <el-popover
                            v-if="item.showInspectionRecords[16].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[16]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="BSD左架设状态异常"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[16].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line"
                            ></div>
                        </el-popover>
                    </li>
                    <li class="contentTd">
                        <el-popover
                            v-if="item.showInspectionRecords[11].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[11]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="BSD右架设状态异常"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[11].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line"
                            ></div>
                        </el-popover>
                        <el-popover
                            v-if="item.showInspectionRecords[17].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[17]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="BSD右架设状态异常"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[17].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line"
                            ></div>
                        </el-popover>
                    </li>
                    <li class="contentTd noBorder">
                        <el-popover
                            v-if="item.showInspectionRecords[12].length"
                            v-for="(item_, index_) in item
                                .showInspectionRecords[12]"
                            :key="index_"
                            placement="top"
                            width="400"
                            trigger="click"
                            title="WHD架设状态异常"
                        >
                            <p>
                                异常时间:{{
                                    item_.startTime + "~" + item_.endTime
                                }}
                            </p>
                            <p>异常原因:{{ item_.reason }}</p>
                            <p>解决建议:{{ item_.advice }}</p>
                            <div
                                v-if="item.showInspectionRecords[12].length"
                                :style="`height:${getFragmentHeight(
                                    item_
                                )}px; top:${getTop(
                                    item_.showStartTime,
                                    item.date
                                )}px`"
                                slot="reference"
                                class="line"
                            ></div>
                        </el-popover>
                    </li>
                </ul>
                <!-- </div> -->
            </div>
        </div>
    </div>
</template>
<script>
import TimeUtil from "@/utils/time";
// import func from 'vue-editor-bridge';
require("@/assets/style/base.scss");
export default {
    name: "conditionMonitoringPatrol",
    props: {
        patrolDetails: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            deviceMessage: {
                protocolName: this.patrolDetails.protocolName,
                plateNum: this.patrolDetails.plateNum,
                deviceModelCode: this.patrolDetails.deviceModelCode,
                softwareVersion: this.patrolDetails.softwareVersion,
                orgName: this.patrolDetails.orgName,
                deviceSerialNum: this.patrolDetails.deviceSerialNum,
                deviceCode: this.patrolDetails.deviceCode,
                vin: this.patrolDetails.vin,
            },
            params: {
                deviceCode: this.patrolDetails.deviceCode,
            },
            param: { productKey: this.patrolDetails.productKey },
            searchForm: {
                startTime: "",
                endTime: "",
            },
            searchLoading: false,
            loadingAll: false,
            time: [new Date(new Date() - 6 * 24 * 60 * 60 * 1000), new Date()],
            resData: [],
            listData: [],
            dateList: [],
            height: 61,
            listHeight: 500,
            getExportResultInterval: null,
            getExportResultInterval_: null,
            getExportResultInterval2_: null,
        };
    },
    watch: {},
    methods: {
        //数据重组
        outListData() {
            let listData = [];
            //以日期为基础的数组组成
            this.dateList.forEach((item) => {
                listData.push({
                    date: item,
                    inspectionRecords: [],
                    showInspectionRecords: [
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                    ],
                });
            });
            this.resData.forEach((item) => {
                if (this.dateList.indexOf(item.date) != -1) {
                    listData[
                        this.dateList.indexOf(item.date)
                    ].inspectionRecords = [
                        ...listData[this.dateList.indexOf(item.date)]
                            .inspectionRecords,
                        ...item.inspectionRecords,
                    ];
                }
            });
            listData.forEach((item) => {
                if (item.inspectionRecords.length) {
                    for (let i = 0; i < item.inspectionRecords.length; i++) {
                        item.showInspectionRecords[
                            item.inspectionRecords[i].type
                        ].push(item.inspectionRecords[i]);
                    }
                }
            });
            this.listData = listData;
        },
        //获取时间段内的所有日期
        getdateList(start, end) {
            let dateList = [];
            let startTime = this.gDate(start);
            let endTime = this.gDate(end);
            while (endTime.getTime() - startTime.getTime() >= 0) {
                let year = startTime.getFullYear();
                let month =
                    Number(startTime.getMonth().toString()) + 1 <= 9
                        ? "0" +
                          Number(Number(startTime.getMonth().toString()) + 1)
                        : Number(startTime.getMonth().toString()) + 1;
                let day =
                    startTime.getDate().toString().length == 1
                        ? "0" + startTime.getDate()
                        : startTime.getDate();
                dateList.push(year + "-" + month + "-" + day);
                startTime.setDate(startTime.getDate() + 1);
            }
            this.dateList = dateList;
        },
        gDate(datestr) {
            var temp = datestr.split("-");
            var date = new Date(datestr);
            return date;
        },
        //
        //获取历史巡检数据
        getInspectionRecordByDevice() {
            if (!this.time.length) {
                this.$message.info("请选择一个时间段！");
                return;
            }
            let params = {
                deviceCode: this.params.deviceCode,
                startTime: TimeUtil.getDate(this.time[0]),
                endTime: TimeUtil.getDate(this.time[1]),
            };
            this.getdateList(
                TimeUtil.getDate(this.time[0]),
                TimeUtil.getDate(this.time[1])
            );
            this.$api.getInspectionRecordByDevice(params).then((res) => {
                if (res.success) {
                    if (res.data.length) {
                        res.data.forEach((item) => {
                            item["inspectionRecords"].forEach((item_) => {
                                if (
                                    new Date(item_["startTime"]).getTime() <
                                    new Date(params["startTime"]).getTime() -
                                        8 * 60 * 60 * 1000
                                ) {
                                    item_["showStartTime"] =
                                        params["startTime"] + " 00:00:00";
                                    item["date"] = params["startTime"];
                                } else {
                                    item_["showStartTime"] = item_["startTime"];
                                }
                                if (
                                    new Date(item_["endTime"]).getTime() >
                                    new Date(params["endTime"]).getTime() +
                                        16 * 60 * 60 * 1000
                                ) {
                                    item_["showEndTime"] =
                                        params["endTime"] + " 23:59:59";
                                } else {
                                    item_["showEndTime"] = item_["endTime"];
                                }
                            });
                        });
                    }
                    this.resData = res.data;
                    this.outListData();
                } else {
                    this.$message.error("获取巡检列表失败:" + res.msg);
                }
            });
        },
        setTableHeight() {
            this.listHeight = document.body.clientHeight - 336;
        },
        //导出
        goExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                this.searchForm.startTime = TimeUtil.getDate(this.time[0]);
                this.searchForm.endTime = TimeUtil.getDate(this.time[1]);
                // let params = {deviceCode: this.searchForm.de,startTime: '2022-06-08',endTime: '2022-06-09'}
                let params = Object.assign({}, this.params, this.searchForm);
                this.$api.exportInspectionRecordHis(params).then((res) => {
                    if (res.success == true) {
                        let fileName = res.data.fileName;
                        let _this = this;
                        _this.getExportResultInterval = window.setInterval(
                            function () {
                                _this.$api
                                    .isExportFinished(fileName)
                                    .then((res1) => {
                                        if (res1.success == true) {
                                            if (res1.data == true) {
                                                let iframe =
                                                    document.createElement(
                                                        "iframe"
                                                    );
                                                iframe.src =
                                                    (process.env.BASE_API == "/"
                                                        ? ""
                                                        : process.env
                                                              .BASE_API) +
                                                    "/excel?fileName=" +
                                                    fileName;
                                                iframe.style.display = "none";
                                                document.body.appendChild(
                                                    iframe
                                                );
                                                window.clearInterval(
                                                    _this.getExportResultInterval
                                                );
                                                _this.getExportResultInterval =
                                                    "";
                                                _this.loadingAll = false;
                                            }
                                        } else {
                                            _this.loadingAll = false;
                                            window.clearInterval(
                                                _this.getExportResultInterval
                                            );
                                            _this.getExportResultInterval = "";
                                        }
                                    });
                            },
                            2000
                        );
                        let gpsParams = Object.assign(
                            {},
                            this.params,
                            this.searchForm,
                            this.param
                        );
                        _this.$api
                            .equipmentInspectionExportGps(gpsParams)
                            .then((_res) => {
                                if (_res.success == true) {
                                    let fileName_ = _res.data.fileName;
                                    _this.getExportResultInterval2_ =
                                        window.setInterval(function () {
                                            _this.$api
                                                .isExportFinished(fileName_)
                                                .then((res_1) => {
                                                    if (res_1.success == true) {
                                                        if (
                                                            res_1.data == true
                                                        ) {
                                                            let iframe_ =
                                                                document.createElement(
                                                                    "iframe"
                                                                );
                                                            iframe_.src =
                                                                (process.env
                                                                    .BASE_API ==
                                                                "/"
                                                                    ? ""
                                                                    : process
                                                                          .env
                                                                          .BASE_API) +
                                                                "/excel?fileName=" +
                                                                fileName_;
                                                            iframe_.style.display =
                                                                "none";
                                                            document.body.appendChild(
                                                                iframe_
                                                            );
                                                            window.clearInterval(
                                                                _this.getExportResultInterval2_
                                                            );
                                                            _this.getExportResultInterval2_ =
                                                                "";
                                                            _this.loadingAll = false;
                                                        }
                                                    } else {
                                                        _this.$message.error(
                                                            "导出GPS失败"
                                                        );
                                                        _this.loadingAll = false;
                                                        window.clearInterval(
                                                            _this.getExportResultInterval2_
                                                        );
                                                        _this.getExportResultInterval2_ =
                                                            "";
                                                    }
                                                });
                                        }, 2000);
                                } else {
                                    _this.$message.error(res.msg);
                                    _this.loadingAll = false;
                                }
                            });
                    } else {
                        this.$message.error(res.msg);
                        let gpsParams = Object.assign(
                            {},
                            this.params,
                            this.searchForm,
                            this.param
                        );
                        let _this = this;
                        _this.$api
                            .equipmentInspectionExportGps(gpsParams)
                            .then((_res) => {
                                if (_res.success == true) {
                                    let fileName_ = _res.data.fileName;
                                    _this.getExportResultInterval_ =
                                        window.setInterval(function () {
                                            _this.$api
                                                .isExportFinished(fileName_)
                                                .then((res_1) => {
                                                    if (res_1.success == true) {
                                                        if (
                                                            res_1.data == true
                                                        ) {
                                                            let iframe_ =
                                                                document.createElement(
                                                                    "iframe"
                                                                );
                                                            iframe_.src =
                                                                (process.env
                                                                    .BASE_API ==
                                                                "/"
                                                                    ? ""
                                                                    : process
                                                                          .env
                                                                          .BASE_API) +
                                                                "/excel?fileName=" +
                                                                fileName_;
                                                            iframe_.style.display =
                                                                "none";
                                                            document.body.appendChild(
                                                                iframe_
                                                            );
                                                            window.clearInterval(
                                                                _this.getExportResultInterval_
                                                            );
                                                            _this.getExportResultInterval_ =
                                                                "";
                                                            _this.loadingAll = false;
                                                        }
                                                    } else {
                                                        _this.$message.error(
                                                            "导出GPS失败"
                                                        );
                                                        _this.loadingAll = false;
                                                        window.clearInterval(
                                                            _this.getExportResultInterval_
                                                        );
                                                        _this.getExportResultInterval_ =
                                                            "";
                                                    }
                                                });
                                        }, 2000);
                                } else {
                                    _this.$message.error(res.msg);
                                    _this.loadingAll = false;
                                }
                            });
                    }
                });
            }
        },
        getFragmentHeight(item) {
            const ratio =
                (new Date(item.showEndTime).getTime() -
                    new Date(item.showStartTime).getTime()) /
                (1000 * 3600 * 24);
            return Math.ceil(ratio * this.height);
        },
        getTop(time, dayDate) {
            const ratio =
                (new Date(time).getTime() +
                    8 * 3600000 -
                    new Date(dayDate).getTime()) /
                (1000 * 3600 * 24);
            const top = parseInt(ratio * this.height);
            return top;
        },
        handleReset() {
            this.searchForm.startTime = "";
            this.searchForm.endTime = "";
            this.time = [
                new Date(new Date() - 6 * 24 * 60 * 60 * 1000),
                new Date(),
            ];
        },
    },
    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };
    },
    created() {
        this.getdateList(
            TimeUtil.getDate(this.time[0]),
            TimeUtil.getDate(this.time[1])
        );
        this.getInspectionRecordByDevice();
        this.setTableHeight();
    },
};
</script>
<style lang="less" scoped>
.condition-monitoring {
    height: 100%;
    overflow-y: auto;
}
.device_box {
    display: flex;
}
.device_div {
    padding: 0 1.5rem 1rem 1.5rem;
    font-size: 12px;
    margin-right: 1.5rem !important;
    .deviceLabel {
        color: rgb(153, 153, 153);
    }
    .deviceContent {
        color: rgb(153, 153, 153);
    }
}
.top {
    padding: 0 1.5rem 0px 1.5rem;

    .top-right {
        float: right;
        margin-top: -57px;
    }

    .top-bottom {
        margin-bottom: 10px;
    }
    .type-Blue {
        width: 20px;
        height: 12px;
        background: #82c6e2;
        margin-left: 10px;
    }
    .type-Pink {
        width: 20px;
        height: 12px;
        background: #ffcfcf;
        margin-left: 10px;
        margin-right: 15px;
    }
}
.dateContent {
    padding: 0 1.5rem 0px 1.5rem;
    min-width: 1280px;
    .titleTh {
        display: flex;
        flex-direction: row;
        width: 100%;
        border: 1px solid rgba(224, 224, 224, 1);
        background-color: #f7f7fa;
        .titleTdDate {
            font-size: 14px;
            width: 6%;
            height: 40px;
            text-align: center;
            line-height: 40px;
            border-right: 1px solid rgba(224, 224, 224, 1);
        }
        .titleTd {
            font-size: 14px;
            width: 7.2%;
            height: 40px;
            text-align: center;
            cursor: pointer;
            line-height: 40px;
            border-right: 1px solid rgba(224, 224, 224, 1);
        }
        .titleTd-hidden {
            font-size: 14px;
            width: 7.2%;
            height: 40px;
            text-align: center;
            cursor: pointer;
            line-height: 40px;
            border-right: 1px solid rgba(224, 224, 224, 1);
            white-space: nowrap; /* 设置文字在一行显示，不能换行 */
            overflow: hidden; /* 文字长度超出限定宽度，则隐藏超出的内容 */
            text-overflow: ellipsis;
        }

        .noBorder {
            border: none;
        }
    }
    .contentHeight {
        overflow-y: auto;
    }
    .contentTh {
        display: flex;
        flex-direction: row;
        width: 100%;
        border-left: 1px solid rgba(224, 224, 224, 1);
        border-right: 1px solid rgba(224, 224, 224, 1);
        border-bottom: 1px solid rgba(224, 224, 224, 1);
        .contentTdDate {
            width: 6%;
            height: 60px;
            font-size: 12px;
            text-align: center;
            line-height: 60px;
            border-right: 1px solid rgba(224, 224, 224, 1);
        }
        .contentTd {
            position: relative;
            width: 7.2%;
            height: 60px;
            border-right: 1px solid rgba(224, 224, 224, 1);
            .line {
                position: absolute;
                // height: 60px;
                cursor: pointer;
                z-index: 10;
                width: 100%;
                background: #ffcfcf;
            }
            .lineBlue {
                background: #82c6e2;
            }
        }
        .noBorder {
            border: none;
        }
    }
}
</style>
