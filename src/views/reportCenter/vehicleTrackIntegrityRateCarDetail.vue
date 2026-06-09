<template>
    <div class="detail">
        <div
            class="date-list"
            :style="{
                width: isOpen ? '340px' : '0px',
            }"
        >
            <el-table
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :height="dateListHeight"
                :data="allDateList"
                force-scroll="horizontal"
                style="width: 100%"
                stripe
            >
                <!-- 日期 -->
                <el-table-column
                    prop="showDate"
                    :label="$t('qualifiedProbability.date')"
                    width="80px"
                ></el-table-column>
                <!-- 缺失段数 -->
                <el-table-column
                    prop="trackMissSegment"
                    :label="$t('vehicleTrackIntegrityRate.missSegment')"
                    width="80px"
                ></el-table-column>
                <!-- 轨迹完整率 -->
                <el-table-column
                    prop="trackCompletenessRate"
                    :label="$t('vehicleTrackIntegrityRate.trajectoryIntegrity')"
                    width="100px"
                ></el-table-column>
                <!-- 操作 -->
                <el-table-column
                    prop="orgId"
                    :label="$t('common.operate')"
                    width="80px"
                >
                    <template slot-scope="scope">
                        <a @click="searchGps(scope.row.date)">
                            <!-- 轨迹回放 -->
                            {{ $t("qualifiedProbability.trackPlayback") }}
                        </a>
                    </template>
                </el-table-column>
            </el-table>
            <div
                class="close"
                :style="{
                    left: isOpen ? '320px' : '-20px',
                }"
            >
                <i
                    @click="changeLeftWidth()"
                    :class="
                        isOpen ? 'el-icon-arrow-left' : 'el-icon-arrow-right'
                    "
                ></i>
            </div>
        </div>
        <div
            class="right-content"
            :style="{
                width: isOpen ? 'calc(100% - 340px)' : '100%',
            }"
            v-loading="loadingBut"
        >
            <div
                v-show="tablePosition !== 2"
                :style="{ height: containerHeight + 'px' }"
                id="container"
            >
                <div class="mark">
                    <el-checkbox
                        v-model="isShowDriftPoint"
                        @change="changeShowDriftPoint"
                    >
                        <!-- 标记漂移点 -->
                        {{ $t("vehicleTrackIntegrityRate.markDriftPoints") }}
                    </el-checkbox>
                    <el-checkbox
                        v-model="isShowPolylineArr"
                        @change="changeShowPolylineArr"
                    >
                        <!-- 标记缺失段数 -->
                        {{
                            $t("vehicleTrackIntegrityRate.markMissingSegments")
                        }}
                    </el-checkbox>
                </div>
            </div>
            <div class="tab-content">
                <div class="btn">
                    <el-button
                        class=""
                        @click="goExport"
                        :loading="loadingAll || loadingAll2"
                        :disabled="loadingAll || loadingAll2 || loadingBut"
                    >
                        <!-- 导出 -->
                        {{ $t("common.export") }}
                    </el-button>
                    <i
                        @click="tableHeightAdd(true)"
                        class="fontSize el-icon-arrow-up"
                    ></i>
                    <i
                        @click="tableHeightAdd(false)"
                        class="fontSize el-icon-arrow-down"
                    ></i>
                </div>
                <el-tabs v-model="activeName">
                    <!-- 位置数据 -->
                    <el-tab-pane
                        :label="`${$t(
                            'qualifiedProbability.positionData'
                        )}(${total})`"
                        name="first"
                    >
                        <el-table
                            @row-click="rowClick"
                            v-show="tablePosition !== 0"
                            v-loading="searchLoading"
                            :element-loading-text="
                                $t('common.desperatelyLoading')
                            "
                            element-loading-color="#007213"
                            :height="tableHeight"
                            :data="tableData"
                            force-scroll="horizontal"
                            style="width: 100%"
                            highlight-current-row
                            border
                            stripe
                        >
                            <!-- 上报时间 -->
                            <el-table-column
                                prop="collectTime"
                                :label="$t('qualifiedProbability.collectTime')"
                                width="180px"
                            ></el-table-column>
                            <!-- 上报类型 -->
                            <el-table-column
                                prop="supplementSign"
                                :label="
                                    $t('qualifiedProbability.supplementSign')
                                "
                                width="100px"
                                show-overflow-tooltip
                            >
                                <template slot-scope="scope">
                                    <span>{{
                                        // scope.row.supplementSign
                                        //     ? "补报"
                                        //     : "正常上报"
                                        scope.row.supplementSign
                                            ? $t(
                                                  "qualifiedProbability.supplementSignText1"
                                              )
                                            : $t(
                                                  "qualifiedProbability.supplementSignText2"
                                              )
                                    }}</span>
                                </template>
                            </el-table-column>
                            <!-- 状态 -->
                            <el-table-column
                                prop="gpsStatus"
                                :label="$t('qualifiedProbability.gpsStatus')"
                                width="100px"
                                show-overflow-tooltip
                            >
                                <template slot-scope="scope">
                                    <span>{{
                                        // !scope.row.gpsStatus
                                        //     ? "ACCOFF & 定位无效"
                                        //     : scope.row.gpsStatus == 1
                                        //     ? "ACCOFF & 定位有效"
                                        //     : scope.row.gpsStatus == 2
                                        //     ? "ACC ON & 定位无效"
                                        //     : "ACC ON & 定位有效"

                                        !scope.row.gpsStatus
                                            ? $t(
                                                  "qualifiedProbability.gpsStatusText1"
                                              )
                                            : scope.row.gpsStatus == 1
                                            ? $t(
                                                  "qualifiedProbability.gpsStatusText2"
                                              )
                                            : scope.row.gpsStatus == 2
                                            ? $t(
                                                  "qualifiedProbability.gpsStatusText3"
                                              )
                                            : $t(
                                                  "qualifiedProbability.gpsStatusText4"
                                              )
                                    }}</span>
                                </template>
                            </el-table-column>
                            <!-- 接收时间 -->
                            <el-table-column
                                prop="createTime"
                                :label="$t('qualifiedProbability.createTime')"
                                width="180px"
                            ></el-table-column>
                            <!-- GPS速度（km/h） -->
                            <el-table-column
                                prop="speed"
                                :label="
                                    $t('qualifiedProbability.speed') +
                                    '（km/h）'
                                "
                                width="150px"
                            ></el-table-column>
                            <!-- 行车记录仪速度（km/h） -->
                            <el-table-column
                                prop="recorderSpeed"
                                :label="
                                    $t('qualifiedProbability.recorderSpeed') +
                                    '（km/h）'
                                "
                                width="200px"
                            ></el-table-column>
                            <!-- 经纬度 -->
                            <el-table-column
                                prop="longitude"
                                :label="$t('qualifiedProbability.longitude')"
                                width="100px"
                                show-overflow-tooltip
                            >
                                <template slot-scope="scope">
                                    <span
                                        >{{ scope.row.longitude }}，{{
                                            scope.row.latitude
                                        }}</span
                                    >
                                </template>
                            </el-table-column>
                            <!-- 总里程（km） -->
                            <el-table-column
                                prop="totalMileage"
                                :label="
                                    $t('qualifiedProbability.totalMileage') +
                                    '（km）'
                                "
                                width="150px"
                            ></el-table-column>
                            <!-- 地理位置 -->
                            <el-table-column
                                prop="GDPosition"
                                :label="$t('qualifiedProbability.GDPosition')"
                                width="200px"
                                show-overflow-tooltip
                            ></el-table-column>
                            <!-- 方向角 -->
                            <el-table-column
                                prop="direction"
                                :label="$t('qualifiedProbability.direction')"
                                width="100px"
                            ></el-table-column>
                            <!-- 海拔 -->
                            <el-table-column
                                prop="altitude"
                                :label="$t('qualifiedProbability.altitude')"
                                width="100px"
                            ></el-table-column>
                            <!-- 卫星数 -->
                            <el-table-column
                                prop="locationSignal"
                                :label="
                                    $t('qualifiedProbability.locationSignal')
                                "
                                width="150px"
                            ></el-table-column>
                            <!-- 网络信号强度 -->
                            <el-table-column
                                prop="positionSignalStrength"
                                :label="
                                    $t(
                                        'qualifiedProbability.positionSignalStrength'
                                    )
                                "
                                width="150px"
                            >
                                <template slot-scope="scope">
                                    <div
                                        class="position-signal"
                                        v-if="
                                            scope.row.positionSignalStrength ===
                                                '' ||
                                            scope.row.positionSignalStrength ===
                                                null
                                        "
                                    >
                                        <img
                                            class="image"
                                            src="/static/images/5G_0.png"
                                        />{{ scope.row.positionSignalStrength }}
                                    </div>
                                    <div
                                        class="position-signal"
                                        v-else-if="
                                            scope.row.positionSignalStrength >
                                                0 &&
                                            scope.row.positionSignalStrength <=
                                                85
                                        "
                                    >
                                        <img
                                            class="image"
                                            src="/static/images/5G_5.png"
                                        />
                                        {{ scope.row.positionSignalStrength }}
                                    </div>
                                    <div
                                        class="position-signal"
                                        v-else-if="
                                            scope.row.positionSignalStrength >
                                                85 &&
                                            scope.row.positionSignalStrength <=
                                                90
                                        "
                                    >
                                        <img
                                            class="image"
                                            src="/static/images/5G_4.png"
                                        />
                                        {{ scope.row.positionSignalStrength }}
                                    </div>
                                    <div
                                        class="position-signal"
                                        v-else-if="
                                            scope.row.positionSignalStrength >
                                                90 &&
                                            scope.row.positionSignalStrength <=
                                                95
                                        "
                                    >
                                        <img
                                            class="image"
                                            src="/static/images/5G_3.png"
                                        />
                                        {{ scope.row.positionSignalStrength }}
                                    </div>
                                    <div
                                        class="position-signal"
                                        v-else-if="
                                            scope.row.positionSignalStrength >
                                                95 &&
                                            scope.row.positionSignalStrength <=
                                                100
                                        "
                                    >
                                        <img
                                            class="image"
                                            src="/static/images/5G_2.png"
                                        />
                                        {{ scope.row.positionSignalStrength }}
                                    </div>
                                    <div
                                        class="position-signal"
                                        v-else-if="
                                            scope.row.positionSignalStrength >
                                                100 &&
                                            scope.row.positionSignalStrength <=
                                                105
                                        "
                                    >
                                        <img
                                            class="image"
                                            src="/static/images/5G_1.png"
                                        />
                                        {{ scope.row.positionSignalStrength }}
                                    </div>
                                    <span v-else>
                                        <!-- 未知 -->
                                        {{ $t("common.unknown") }}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                            v-show="tablePosition !== 0"
                            :current-page="params.currentPage"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[20, 50, 100]"
                            :page-size="params.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                        >
                        </el-pagination>
                    </el-tab-pane>
                    <!-- 缺失段数 -->
                    <el-tab-pane
                        :label="`${$t('vehicleTrackIntegrityRate.missSegment')}
                        (${total2})`"
                        name="second"
                    >
                        <el-table
                            @row-click="rowSecondClick"
                            v-show="tablePosition !== 0"
                            v-loading="searchLoading"
                            :element-loading-text="
                                $t('common.desperatelyLoading')
                            "
                            element-loading-color="#007213"
                            :height="tableHeight"
                            :data="incompleteData"
                            force-scroll="horizontal"
                            style="width: 100%"
                            highlight-current-row
                            border
                            stripe
                        >
                            <!-- 开始时间 -->
                            <el-table-column
                                :label="$t('common.startTime')"
                                min-width="150px"
                            >
                                <template slot-scope="scope">
                                    <span>
                                        {{
                                            $moment(scope.row.startTime).format(
                                                "YYYY-MM-DD HH:mm:ss"
                                            )
                                        }}
                                    </span>
                                </template>
                            </el-table-column>
                            <!-- 结束时间 -->
                            <el-table-column
                                :label="$t('common.endTime')"
                                min-width="150px"
                            >
                                <template slot-scope="scope">
                                    <span>
                                        {{
                                            $moment(scope.row.endTime).format(
                                                "YYYY-MM-DD HH:mm:ss"
                                            )
                                        }}
                                    </span>
                                </template></el-table-column
                            >
                            <!-- 持续时长 -->
                            <el-table-column
                                prop="durationTime"
                                :label="
                                    $t('vehicleTrackIntegrityRate.duration')
                                "
                                min-width="100px"
                            ></el-table-column>
                            <!-- 不完整里程（km） -->
                            <el-table-column
                                prop="mileage"
                                :label="
                                    $t(
                                        'vehicleTrackIntegrityRate.incompleteMileage'
                                    ) + '（km）'
                                "
                                min-width="100px"
                            ></el-table-column>
                            <!-- 开始位置 -->
                            <el-table-column
                                prop="startLocation"
                                :label="
                                    $t(
                                        'vehicleTrackIntegrityRate.startLocation'
                                    )
                                "
                                min-width="100px"
                                show-overflow-tooltip
                            ></el-table-column>
                            <!-- 结束位置 -->
                            <el-table-column
                                prop="endLocation"
                                :label="
                                    $t('vehicleTrackIntegrityRate.endLocation')
                                "
                                min-width="100px"
                                show-overflow-tooltip
                            ></el-table-column>
                            <!-- 开始里程（km） -->
                            <el-table-column
                                prop="startMileage"
                                :label="
                                    $t(
                                        'vehicleTrackIntegrityRate.startMileage'
                                    ) + '（km）'
                                "
                                min-width="100px"
                            ></el-table-column>
                            <!-- 结束里程（km） -->
                            <el-table-column
                                prop="endMileage"
                                :label="
                                    $t('vehicleTrackIntegrityRate.endMileage') +
                                    '（km）'
                                "
                                min-width="100px"
                            ></el-table-column>
                        </el-table>
                        <el-pagination
                            v-show="tablePosition !== 0"
                            :current-page="params2.currentPage"
                            @size-change="handleSizeChange2"
                            @current-change="handleCurrentChange2"
                            :page-sizes="[20, 50, 100]"
                            :page-size="params2.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total2"
                        >
                        </el-pagination>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>
<script>
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import TimeUtil from "@/utils/time";
import timeCom from "@/components/timeCom";
import AttendenceRecord from "@/components/AttendenceRecord";
import { getAddressSingle, transferAddress } from "@/utils/getMapLocation";

import {
    BaiduMap,
    BmControl,
    BmCityList,
    BmMarker,
    BmlMarkerClusterer,
    BmCircle,
    BmPolyline,
    BmPolygon,
} from "vue-baidu-map";
require("@/assets/style/base.scss");
export default {
    components: {
        TimeUtil,
        timeCom,
        AttendenceRecord,
        BaiduMap,
        BmMarker,
        BmlMarkerClusterer,
        BmCircle,
        BmPolyline,
        BmPolygon,
        TreeSelect,
    },
    data() {
        return {
            tablePosition: 1,
            loadingAll2: false,
            loadingAll: false,
            loadingBut: false,
            updateBol: false,
            searchLoading: false,
            containerHeight: 420,
            tableHeight: 0,
            dateListHeight: 0,
            showColorBol: false,
            searchForm: {
                operateTimeArr: "",
                deviceCode: this.$route.query.deviceCode || "",
                startTime: this.$route.query.startDate + " 00:00:00",
                endTime: this.$route.query.endDate + " 23:59:59",
                startDate: "",
                endDate: "",
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },
            params2: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },
            total: 0,
            total2: 0,
            geoJsonData: [],
            tableData: [],
            incompleteData: [],
            incompleteDataCopy: [],
            completeData: [],
            completeDataCopy: [],
            hiatusData: [],
            aMap: null,
            mass: null,
            openInfo: null,
            locationMessage: {
                collectTime: "",
                speed: "",
                position: "",
            },
            polylineArr: [],
            allDateList: [],
            isOpen: true,
            activeName: "first",
            checked: true,
            isShowPolylineArr: false,
            isShowDriftPoint: false,
            driftPointArr: [],
            polylineArrRow: [],
        };
    },
    watch: {
        tablePosition: {
            handler(val) {
                this.setTableHeight();
            },
            immediate: true,
        },
    },
    created() {
        //this.incompleteGPSInfo(1);
        this.allDateList = this.getAllDateCN(
            this.$route.query.startDate,
            this.$route.query.endDate
        );
        this.setTableHeight();
        this.getAllTable();
    },
    mounted() {
        if (!this.aMap) {
            this.aMap = new AMap.Map("container", {
                viewMode: "3D", // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D',
                zoom: 11, //初始化地图层级
                resizeEnable: true,
                //center: [116.397428, 39.90923] //初始化地图中心点
                center: [120.204969, 30.187477], //初始化地图中心点
            });
        }
        const that = this;
        //that.setTableHeight();
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };

        let startTime = this.$route.query.startDate + " 00:00:00";
        let endTime = this.$route.query.endDate + " 23:59:59";
        if (
            new Date(endTime).getTime() - new Date(startTime).getTime() >
            24 * 60 * 60 * 1000
        ) {
            this.searchForm.operateTimeArr = [
                this.$route.query.endDate + " 00:00:00",
                this.$route.query.endDate + " 23:59:59",
            ];
            this.searchForm.startDate = this.$route.query.endDate;
            this.searchForm.endDate = this.$route.query.endDate;
            this.incompleteGPSInfo(1);
            this.getIncomplatePage();
            this.getPageCarDriftDetails();
        } else {
            this.searchForm.operateTimeArr = [
                this.$route.query.startDate + " 00:00:00",
                this.$route.query.endDate + " 23:59:59",
            ];
            this.searchForm.startDate = this.$route.query.startDate;
            this.searchForm.endDate = this.$route.query.endDate;
            this.incompleteGPSInfo(1);
            this.getIncomplatePage();
            this.getPageCarDriftDetails();
        }
    },
    methods: {
        getAllTable() {
            let params = {
                plateNum: this.$route.query.plateNum,
                startDate: this.$route.query.startDate,
                endDate: this.$route.query.endDate,
            };
            this.$api
                .carTrackCompletenessHistory(params)
                .then((res) => {
                    if (res.success == true) {
                        if (!this.allDateList) {
                            this.allDateList = this.getAllDateCN(
                                this.$route.query.startDate,
                                this.$route.query.endDate
                            );
                        }
                        this.allDateList.forEach((item, index) => {
                            res.data.results.map((i) => {
                                if (item.date == i.date) {
                                    // const rate = Number(i.trackCompletenessRate) * 100;
                                    // const newRate = rate % 1 === 0 ? rate : rate.toFixed(2);
                                    this.$set(this.allDateList, index, {
                                        ...item,
                                        trackMissSegment: i.trackMissSegment,
                                        trackCompletenessRate:
                                            i.trackCompletenessRate + "%",
                                    });
                                }
                            });
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {});
        },
        getAllDateCN(start, end) {
            const startTime = new Date(start); // 开始日期
            const endTime = new Date(end); // 结束日期
            const arr = [];
            while (endTime >= startTime) {
                const date = startTime.toLocaleString("zh", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                });
                const [showYear, showMonth, showDate] = date.split("/");
                arr.push({
                    showDate: `${showMonth.padStart(
                        2,
                        "0"
                    )}-${showDate.padStart(2, "0")}`,
                    date: date.replace(/\//g, "-"),
                });
                startTime.setDate(startTime.getDate() + 1); //开始日期加1
            }
            arr.reverse();
            return arr;
        },
        rowClick(row, event, column) {
            console.log("row--", row);
            let lnglat = {
                Q: row["latitudeGcj"],
                R: row["longitudeGcj"],
                lat: row["latitudeGcj"],
                lng: row["longitudeGcj"],
            };
            this.locationMessage.collectTime = row.collectTime;
            this.locationMessage.speed = row.speed;
            this.locationMessage.position = row.GDPosition
                ? row.GDPosition
                : "--";
            this.aMap.clearInfoWindow();
            let info = [];
            // 上报时间
            info.push(
                `<p style="padding:4px 8px">${this.$t(
                    "qualifiedProbability.collectTime"
                )}
                    : ${this.locationMessage["collectTime"]}</p>`
            );
            // 车速（km/h）
            info.push(
                `<p style="padding:4px 8px">${this.$t(
                    "qualifiedProbability.carSpeed"
                )}（km/h）:${this.locationMessage["speed"]}</p>`
            );
            //位置
            info.push(
                `<p style="padding:4px 8px">${this.$t(
                    "qualifiedProbability.position"
                )}: ${this.locationMessage["position"]}</p>`
            );
            let infoWindow = new AMap.InfoWindow({
                content: info.join(""), //使用默认信息窗体框样式，显示信息内容
            });
            infoWindow.open(this.aMap, lnglat);
            this.aMap.setFitView();
        },
        rowSecondClick(row, event, column) {
            this.aMap.remove(this.polylineArrRow);
            this.aMap.clearInfoWindow();
            let lnglat = {
                Q: row["startLatitudeGcj"],
                R: row["startLongitudeGcj"],
                lat: row["startLatitudeGcj"],
                lng: row["startLongitudeGcj"],
            };
            this.locationMessage.collectTime = row.startTime;
            this.locationMessage.speed = row.durationTime;
            this.locationMessage.position = row.startLocation
                ? row.startLocation
                : "";
            let info = [];
            // 开始时间
            info.push(
                `<p style="padding:4px 8px">${this.$t(
                    "common.startTime"
                )}：${this.$moment(this.locationMessage["collectTime"]).format(
                    "YYYY-MM-DD HH:mm:ss"
                )}</p>`
            );
            // 持续时长
            info.push(
                `<p style="padding:4px 8px">${this.$t(
                    "vehicleTrackIntegrityRate.duration"
                )}：${this.locationMessage["speed"]}</p>`
            );
            // 开始位置
            info.push(
                `<p style="padding:4px 8px">${this.$t(
                    "vehicleTrackIntegrityRate.startLocation"
                )}：${this.locationMessage["position"]}</p>`
            );
            // 创建 InfoWindow，并设置其内容和位置
            let infoWindow = new AMap.InfoWindow({
                content: info.join(""),
                offset: new AMap.Pixel(0, 2),
                position: [lnglat.lng, lnglat.lat],
                autoMove: true,
            });

            // 将 InfoWindow 加入地图中，并显示
            infoWindow.setMap(this.aMap);
            infoWindow.open(this.aMap);

            this.polylineArrRow = [];
            let linePath = [];
            linePath = [
                [row.startLongitude, row.startLatitudeGcj],
                [row.endLongitudeGcj, row.endLatitudeGcj],
            ];
            let polyline = new AMap.Polyline({
                path: linePath,
                isOutline: true,
                outlineColor: "rgb(0,143,255)",
                borderWeight: 1,
                strokeColor: "rgb(0,143,255)",
                strokeOpacity: 1,
                strokeWeight: 3,
                // 折线样式还支持 'dashed'
                strokeStyle: "solid",
                // strokeStyle是dashed时有效
                strokeDasharray: [15, 5],
                lineJoin: "round",
                lineCap: "round",
                zIndex: 5,
            });
            this.polylineArrRow.push(polyline);

            this.aMap.add(this.polylineArrRow);
            this.aMap.setFitView();
        },
        //上下按钮
        tableHeightAdd(type) {
            if (type) {
                this.tablePosition === 2 ? "" : this.tablePosition++;
            } else {
                this.tablePosition === 0 ? "" : this.tablePosition--;
            }
        },
        choosetTime() {
            this.updateBol = true;
        },
        dateChange(time) {
            let date = new Date(time);
            date =
                date.getFullYear() +
                "-" +
                (date.getMonth() + 1) +
                "-" + // 这里加1是因为getMonth()的返回值是为0~11
                date.getDate() +
                " " +
                date.getHours() +
                ":" +
                date.getMinutes() +
                ":" +
                date.getSeconds();
            date = Date.parse(new Date(date)) / 1000; // 转换成时间戳，返回值是ms，除1000后转化成秒
            date += 86400 * 1; // 一天是86400秒
            let newDate = new Date(parseInt(date) * 1000); // 把时间戳转换成日期
            var mouth;
            if (newDate.getMonth() + 1 > 9) {
                mouth = newDate.getMonth() + 1;
            } else {
                mouth = "0" + (newDate.getMonth() + 1);
            }
            let changeData =
                newDate.getFullYear() +
                "-" +
                mouth +
                "-" +
                (newDate.getDate() > 9
                    ? newDate.getDate()
                    : "0" + newDate.getDate()) +
                " " +
                newDate.getHours() +
                ":" +
                newDate.getMinutes() +
                ":" +
                newDate.getSeconds();

            return changeData;
        },
        goExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                let _this = this;
                this.loadingAll = true;
                _this.$api.reportExportGps(this.searchForm).then((_res) => {
                    if (_res.success == true) {
                        let fileName_ = _res.data.fileName;
                        _this.getExportResultInterval_ = window.setInterval(
                            function () {
                                _this.$api
                                    .isExportFinished(fileName_)
                                    .then((res_1) => {
                                        if (res_1.success == true) {
                                            if (res_1.data == true) {
                                                let iframe_ =
                                                    document.createElement(
                                                        "iframe"
                                                    );
                                                iframe_.src =
                                                    (process.env.BASE_API == "/"
                                                        ? ""
                                                        : process.env
                                                              .BASE_API) +
                                                    "/excel?fileName=" +
                                                    fileName_;
                                                iframe_.style.display = "none";
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
                                            // 导出GPS失败
                                            _this.$message.error(
                                                this.$t(
                                                    "vehicleTrackIntegrityRate.GPSExportError"
                                                )
                                            );
                                            _this.loadingAll = false;
                                            window.clearInterval(
                                                _this.getExportResultInterval_
                                            );
                                        }
                                    });
                            },
                            2000
                        );
                    } else {
                        _this.$message.error(_res.msg);
                        _this.loadingAll = false;
                    }
                });
                var strStar = this.searchForm.operateTimeArr[0];
                var a1 = strStar.indexOf(" ");
                this.searchForm.startDate =
                    this.searchForm.operateTimeArr[0].substring(0, a1);
                this.searchForm.endDate = this.dateChange(
                    this.searchForm.operateTimeArr[0]
                ).substring(0, a1);
                let carParam = Object.assign({}, this.searchForm, {
                    plateNum: this.$route.query.plateNum || "",
                    pageSize: 1000,
                });
                this.loadingAll2 = true;
                _this.$api.exportIncompleteTabulate(carParam).then((res) => {
                    if (res.success == true) {
                        let fileName = res.data.fileName;
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
                                                _this.loadingAll2 = false;
                                            }
                                        } else {
                                            // _this.$message.error('导出失败');
                                            _this.loadingAll2 = false;
                                            window.clearInterval(
                                                _this.getExportResultInterval
                                            );
                                        }
                                    });
                            },
                            2000
                        );
                    } else {
                        _this.$message.error(res.msg);
                        _this.loadingAll2 = false;
                    }
                });
            }
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.tableData = this.completeDataCopy.slice(
                this.params.pageSize * (this.params.currentPage - 1),
                this.params.pageSize * this.params.currentPage
            );
            transferAddress(
                this.tableData,
                "longitude",
                "latitude",
                "GDPosition",
                false
            );
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.tableData = this.completeDataCopy.slice(
                this.params.pageSize * (this.params.currentPage - 1),
                this.params.pageSize * this.params.currentPage
            );
            transferAddress(
                this.tableData,
                "longitude",
                "latitude",
                "GDPosition",
                false
            );
        },
        handleSizeChange2(val) {
            this.params2.pageSize = val;
            this.incompleteData = this.incompleteDataCopy.slice(
                this.params2.pageSize * (this.params2.currentPage - 1),
                this.params2.pageSize * this.params2.currentPage
            );
        },
        handleCurrentChange2(val) {
            this.params2.currentPage = val;
            this.incompleteData = this.incompleteDataCopy.slice(
                this.params2.pageSize * (this.params2.currentPage - 1),
                this.params2.pageSize * this.params2.currentPage
            );
        },
        searchGps(date) {
            this.searchForm.operateTimeArr[0] = date + " 00:00:00";
            this.searchForm.operateTimeArr[1] = date + " 23:59:59";
            this.updateSure();
        },
        updateSure() {
            if (
                !this.searchForm.operateTimeArr[0] ||
                !this.searchForm.operateTimeArr[1] ||
                new Date(this.searchForm.operateTimeArr[1]).getTime() -
                    new Date(this.searchForm.operateTimeArr[0]).getTime() >
                    24 * 60 * 60 * 1000
            ) {
                // 请将时间段控制在24小时以内
                this.$message.error(
                    this.$t("vehicleTrackIntegrityRate.keep24hours")
                );
            } else {
                this.isShowPolylineArr = false;
                this.isShowDriftPoint = false;
                this.changeShowDriftPoint();
                this.driftPointArr = [];
                this.geoJsonData = [];
                this.completeData = [];
                this.total = 0;
                this.total2 = 0;
                this.completeDataCopy = [];
                this.tableData = [];
                this.incompleteData = [];
                this.incompleteDataCopy = [];
                this.incompleteGPSInfo(1);
                this.getIncomplatePage();
                this.getPageCarDriftDetails();
                if (this.mass) {
                    this.mass.setMap(null);
                    this.mass = null;
                }
                if (this.polylineArr) {
                    this.aMap.remove(this.polylineArr);
                }
                if (this.driftPointArr) {
                    this.aMap.remove(this.driftPointArr);
                }
                this.aMap.remove(this.polylineArrRow);
                this.aMap.clearInfoWindow();
                // this.incompleteGPSInfo(1)
                // this.getIncomplatePage()

                // this.updateBol = false;
                this.showColorBol = false;
            }
        },
        setTableHeight() {
            if (this.tablePosition === 1) {
                this.tableHeight = document.body.clientHeight - 613;
                this.containerHeight = 420;
            } else if (this.tablePosition === 2) {
                this.tableHeight = document.body.clientHeight - 193;
            } else {
                this.containerHeight = document.body.clientHeight - 130;
            }
            this.dateListHeight = document.body.clientHeight - 83;
        },
        //获取轨迹不完整率
        getIncomplatePage() {
            var strStar = this.searchForm.operateTimeArr[0];
            var a1 = strStar.indexOf(" ");
            this.searchForm.startDate =
                this.searchForm.operateTimeArr[0].substring(0, a1);
            this.searchForm.endDate = this.dateChange(
                this.searchForm.operateTimeArr[0]
            ).substring(0, a1);
            //新增标识draw，接口接收到标识会转化坐标点为高德坐标点，方便在高德地图上绘制线条；字段已Gcj结尾的是经过转化的高德地图的点
            let carParam = Object.assign({ draw: true }, this.searchForm, {
                plateNum: this.$route.query.plateNum || "",
                pageSize: 10000,
            });
            this.$api
                .incompletePage(carParam)
                .then((res) => {
                    if (res.success == true) {
                        this.polylineArr = [];
                        if (res.data.results.length) {
                            let linePath = [];
                            res.data.results.forEach((item) => {
                                item.startLocation = "";
                                item.endLocation = "";
                            });
                            this.incompleteDataCopy = JSON.parse(
                                JSON.stringify(res.data.results)
                            );

                            this.total2 = res.data.totalRecords;
                            this.incompleteData = this.incompleteDataCopy.slice(
                                this.params2.pageSize *
                                    (this.params2.currentPage - 1),
                                this.params2.pageSize * this.params2.currentPage
                            );
                            transferAddress(
                                this.incompleteData,
                                "startLongitude",
                                "startLatitude",
                                "startLocation",
                                false
                            );
                            transferAddress(
                                this.incompleteData,
                                "endLongitude",
                                "endLatitude",
                                "endLocation",
                                false
                            );

                            // this.incompleteData.forEach((item) => {
                            //     if(!item.startLocation){
                            //         getAddressSingle([item.startLongitudeGcj, item.startLatitudeGcj],false).then((result) => {
                            //             this.$set(item, "startLocation", result);
                            //         });
                            //         console.log('item.startLocation==',item)
                            //     }
                            // })
                            res.data.results.forEach((item) => {
                                linePath = [
                                    [
                                        item.startLongitude,
                                        item.startLatitudeGcj,
                                    ],
                                    [item.endLongitudeGcj, item.endLatitudeGcj],
                                ];
                                let polyline = new AMap.Polyline({
                                    path: linePath,
                                    isOutline: true,
                                    outlineColor: "rgb(255,93,101)",
                                    borderWeight: 1,
                                    strokeColor: "rgb(255,93,101)",
                                    strokeOpacity: 1,
                                    strokeWeight: 3,
                                    // 折线样式还支持 'dashed'
                                    strokeStyle: "solid",
                                    // strokeStyle是dashed时有效
                                    strokeDasharray: [15, 5],
                                    lineJoin: "round",
                                    lineCap: "round",
                                    zIndex: 5,
                                });
                                this.polylineArr.push(polyline);
                            });
                            this.$nextTick(() => {
                                if (!this.aMap) {
                                    this.aMap = new AMap.Map("container", {
                                        viewMode: "3D", // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D',
                                        zoom: 11, //初始化地图层级
                                        resizeEnable: true,
                                        //center: [116.397428, 39.90923] //初始化地图中心点
                                        center: [120.204969, 30.187477], //初始化地图中心点
                                    });
                                }
                                // this.aMap.add(this.polylineArr);
                            });
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {});
        },
        //获取GPS数据
        incompleteGPSInfo(type) {
            let params = {};
            // if(type){
            this.searchForm["startTime"] = this.searchForm["operateTimeArr"][0];
            this.searchForm["endTime"] = this.searchForm["operateTimeArr"][1];
            params = Object.assign({}, this.searchForm, this.params, {
                pageSize: 6000,
            });
            // }else{
            //   params = Object.assign({},this.searchForm,this.params)
            // }
            this.loadingBut = true;
            this.$api.incompleteGPSInfo(params).then((res) => {
                if (res.success) {
                    this.$api.eventTrackTrigger({
                        menu: "VEHICLE_TRACK_INTEGRITYRATE",
                        business: "VEHICLE_TRACK_INTEGRITYRATE_TRACK_PLAYBACK",
                        eventResult: res.success,
                    });
                    if (params["pageSize"] === 6000) {
                        res.data.results.forEach((item) => {
                            item.GDPosition = "";
                        });
                        this.completeData = res.data.results;
                        this.total = res.data.totalRecords;
                        this.completeDataCopy = JSON.parse(
                            JSON.stringify(this.completeData)
                        );

                        this.tableData = this.completeDataCopy.slice(
                            this.params.pageSize *
                                (this.params.currentPage - 1),
                            this.params.pageSize * this.params.currentPage
                        );
                        transferAddress(
                            this.tableData,
                            "longitude",
                            "latitude",
                            "GDPosition",
                            false
                        );
                        if (this.completeData.length) {
                            console.log("completeData===", this.completeData);
                            this.completeData.forEach((item, index) => {
                                this.geoJsonData.push({
                                    lnglat: [
                                        item["longitudeGcj"],
                                        item["latitudeGcj"],
                                    ],
                                    latitude: item["latitude"],
                                    longitude: item["longitude"],
                                    longitudeGcj: item["longitudeGcj"],
                                    latitudeGcj: item["latitudeGcj"],
                                    collectTime: item["collectTime"],
                                    speed: item["speed"],
                                    style:
                                        index === 0
                                            ? 0
                                            : index + 1 ===
                                              this.completeData.length
                                            ? 2
                                            : 1,
                                    //style:index
                                });
                            });
                            this.$nextTick(() => {
                                if (!this.aMap) {
                                    this.aMap = new AMap.Map("container", {
                                        viewMode: "3D", // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D',
                                        zoom: 11, //初始化地图层级
                                        resizeEnable: true,
                                        //center: [116.397428, 39.90923] //初始化地图中心点
                                        center: [120.204969, 30.187477], //初始化地图中心点
                                    });
                                }
                                let style = [
                                    {
                                        url: "../../../../static/images/map/map_begin.png",
                                        anchor: new AMap.Pixel(14, 40),
                                        size: new AMap.Size(28, 40),
                                        zIndex: 3,
                                    },
                                    {
                                        // 样式
                                        url: "../../../../static/images/line2.png",
                                        anchor: new AMap.Pixel(0, 0),
                                        size: new AMap.Size(8, 8),
                                        zIndex: 2,
                                    },
                                    {
                                        // 样式
                                        url: "../../../../static/images/map/map_end.png",
                                        anchor: new AMap.Pixel(14, 40),
                                        size: new AMap.Size(28, 40),
                                        zIndex: 3,
                                    },
                                ];
                                let this_ = this;
                                if (!this.mass) {
                                    this.mass = new AMap.MassMarks(
                                        this_.geoJsonData,
                                        {
                                            opacity: 1,
                                            zIndex: 1111,
                                            cursor: "pointer",
                                            style: style,
                                        }
                                    );

                                    //添加点击事件
                                    this_.mass.on("click", (e) => {
                                        this_.locationMessage.collectTime =
                                            e.data.collectTime;
                                        this_.locationMessage.speed =
                                            e.data.speed;
                                        getAddressSingle(
                                            [
                                                e.data.longitudeGcj,
                                                e.data.latitudeGcj,
                                            ],
                                            false
                                        ).then((result) => {
                                            this.$set(
                                                this_.locationMessage,
                                                "position",
                                                result
                                            );
                                        });
                                        this_.locationMessage.position = this_
                                            .locationMessage.position
                                            ? this_.locationMessage.position
                                            : "--";
                                        this_.aMap.clearInfoWindow();
                                        let info = [];
                                        // 上报时间
                                        info.push(
                                            `<p style="padding:4px 8px">${this_.$t(
                                                "qualifiedProbability.collectTime"
                                            )}: ${
                                                this_.locationMessage[
                                                    "collectTime"
                                                ]
                                            }</p>`
                                        );
                                        // 车速（km/h）
                                        info.push(
                                            `<p style="padding:4px 8px">${this_.$t(
                                                "qualifiedProbability.carSpeed"
                                            )}（km/h）:${
                                                this_.locationMessage["speed"]
                                            }</p>`
                                        );
                                        //位置
                                        info.push(
                                            `<p style="padding:4px 8px">${this_.$t(
                                                "qualifiedProbability.position"
                                            )}: ${
                                                this_.locationMessage[
                                                    "position"
                                                ]
                                            }</p>`
                                        );
                                        let infoWindow = new AMap.InfoWindow({
                                            content: info.join(""), //使用默认信息窗体框样式，显示信息内容
                                        });
                                        infoWindow.open(this_.aMap, [
                                            e.data.longitudeGcj,
                                            e.data.latitudeGcj,
                                        ]);
                                    });

                                    let pointS = new AMap.Marker({
                                        position: [
                                            this_.geoJsonData[0].longitudeGcj,
                                            this_.geoJsonData[0].latitudeGcj,
                                        ],
                                    });
                                    let pointE = new AMap.Marker({
                                        position: [
                                            this_.geoJsonData[
                                                this_.geoJsonData.length - 1
                                            ].longitudeGcj,
                                            this_.geoJsonData[
                                                this_.geoJsonData.length - 1
                                            ].latitudeGcj,
                                        ],
                                    });
                                    this_.mass.setMap(this_.aMap);
                                    this_.aMap.setFitView([pointS, pointE]);
                                }
                            });
                        } else {
                            if (!this.aMap) {
                                this.aMap = new AMap.Map("container", {
                                    viewMode: "3D", // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D',
                                    zoom: 11, //初始化地图层级
                                    resizeEnable: true,
                                    //center: [116.397428, 39.90923] //初始化地图中心点
                                    center: [120.204969, 30.187477], //初始化地图中心点
                                });
                            }
                        }
                        //this.incompleteGPSInfo(0);
                    }
                    this.loadingBut = false;
                } else {
                    this.$message.error(`${res.msg}`);
                    if (!this.aMap) {
                        this.aMap = new AMap.Map("container", {
                            viewMode: "3D", // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D',
                            zoom: 11, //初始化地图层级
                            resizeEnable: true,
                            //center: [116.397428, 39.90923] //初始化地图中心点
                            center: [120.204969, 30.187477], //初始化地图中心点
                        });
                    }
                    this.loadingBut = false;
                }
            });
        },
        getPageCarDriftDetails() {
            let params = {
                startDate: this.searchForm["operateTimeArr"][0],
                endDate: this.searchForm["operateTimeArr"][1],
                plateNums: [this.$route.query.plateNum],
                currentPage: 1,
                pageSize: 99999,
            };
            this.$api.pageCarDriftDetails(params).then((res) => {
                if (res.success == true) {
                    transferAddress(
                        res.data.results,
                        "startLongitude",
                        "startLatitude",
                        "position",
                        true
                    );
                    res.data.results.forEach((item) => {
                        let marker = new AMap.Marker({
                            position: new AMap.LngLat(
                                item.startLongitude,
                                item.startLatitude
                            ),
                            icon: new AMap.Icon({
                                image: require("@/assets/images/red.png"),
                                imageOffset: new AMap.Pixel(0, 0),
                            }),
                            extData: item,
                        });
                        marker.on("click", this.markerClick);
                        this.driftPointArr.push(marker);
                    });
                } else {
                }
            });
        },
        markerClick(e) {
            let iconData = e.target.getExtData();
            this.driftPointArr.forEach((item) => {
                item.setIcon(
                    new AMap.Icon({
                        image: require("@/assets/images/red.png"),
                        imageOffset: new AMap.Pixel(0, 0),
                    })
                );
            });
            e.target.setIcon(
                new AMap.Icon({
                    image: require("@/assets/images/blue.png"),
                    imageOffset: new AMap.Pixel(0, 0),
                })
            );
            let info = [];
            if (iconData.position) {
                // 上报时间
                info.push(
                    `<p style="padding:4px 8px">${this.$t(
                        "qualifiedProbability.collectTime"
                    )}
                    : ${iconData.startTime}</p>`
                );
                // 车速（km/h）
                info.push(
                    `<p style="padding:4px 8px">${this.$t(
                        "qualifiedProbability.carSpeed"
                    )}（km/h）:${iconData.speed}</p>`
                );
                //位置
                info.push(
                    `<p style="padding:4px 8px">${this.$t(
                        "qualifiedProbability.position"
                    )}: ${response.data["position"]}</p>`
                );
                let infoWindow = new AMap.InfoWindow({
                    content: info.join(""), //使用默认信息窗体框样式，显示信息内容
                });
                infoWindow.open(this.aMap, [e.lnglat.lng, e.lnglat.lat]);
            } else {
                iconData.position = "";
            }
        },
        changeLeftWidth() {
            this.isOpen = !this.isOpen;
        },
        //标记趋势段数
        changeShowPolylineArr() {
            this.aMap.clearInfoWindow();
            console.log("this.isShowPolylineArr==", this.isShowPolylineArr);
            if (this.isShowPolylineArr) {
                this.aMap.add(this.polylineArr);
                this.aMap.setFitView();
            } else {
                this.aMap.remove(this.polylineArr);
            }
        },
        //标记漂移点
        changeShowDriftPoint() {
            this.aMap.clearInfoWindow();
            console.log("this.isShowDriftPoint==", this.isShowDriftPoint);
            if (this.isShowDriftPoint) {
                this.aMap.add(this.driftPointArr);
                this.aMap.setFitView();
            } else {
                this.aMap.remove(this.driftPointArr);
            }
        },
    },
};
</script>
<style lang="less" scoped>
.demonstration {
    font-size: 16px;
    line-height: 32px;
}
.timeLength {
    width: 378px;
    margin-right: 10px;
}
.showColor {
    color: red;
}
.showBorder {
    border: red solid 1px !important;
}
#container {
    width: 100%;
    position: relative;
    .mark {
        position: absolute;
        top: 12px;
        left: 12px;
        z-index: 99;
        background: #ffffff;
        border: 1px solid #ebebeb;
        display: flex;
        flex-direction: column;
        padding: 12px;
        .el-checkbox {
            margin-left: 0px !important;
        }
    }
}
.statisticsData {
    padding: 10px 0;
    overflow: hidden;
    display: flex;
    justify-content: space-between;

    .positionNum {
        font-weight: 400;
        font-size: 18px;
        color: black;
    }
    .exportBtn {
        display: flex;
        justify-content: flex-end;
        margin-left: 12px;
    }
}
.fontSize {
    font-size: 28px;
    cursor: pointer;
    margin-left: 12px;
}
.image {
    width: 20px;
    margin-right: 8px;
}
.position-signal {
    display: flex;
    align-items: center;
}
.detail {
    display: flex;
    .date-list {
        width: 340px;
        position: relative;
        transition: all 0.2s;
        .el-table {
            z-index: 100;
        }
        .close {
            width: 40px;
            height: 40px;
            position: absolute;
            top: 45%;
            left: 320px;
            margin-top: -20px;
            padding-left: 14px;
            background: #ffffff;
            z-index: 99;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #ebebeb;
            cursor: pointer;
            transition: all 0.2s;
            &:hover {
                i {
                    color: #2e87ff !important;
                }
            }
        }
    }
    .right-content {
        width: calc(~"100% - 340px");
        .tab-content {
            position: relative;
            .btn {
                position: absolute;
                top: 4px;
                right: 24px;
                z-index: 999;
                display: flex;
                align-items: center;
            }
        }
    }
}
</style>
<style lang="less">
.amap-logo {
    display: none;
    opacity: 0 !important;
}
.amap-copyright {
    opacity: 0;
}
</style>
