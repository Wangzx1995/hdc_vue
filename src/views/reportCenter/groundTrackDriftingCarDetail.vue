<template>
    <div class="detail">
        <div
            class="date-list"
            :style="{
                width: isOpen ? '330px' : '0px',
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
                <el-table-column
                    prop="showDate"
                    label="日期"
                    width="80px"
                ></el-table-column>
                <el-table-column
                    prop="driftRate"
                    label="轨迹漂移率"
                ></el-table-column>
                <el-table-column prop="orgId" label="操作" width="100px">
                    <template slot-scope="scope">
                        <a @click="searchGps(scope.row.date)">轨迹回放</a>
                    </template>
                </el-table-column>
            </el-table>
            <div
                class="close"
                :style="{
                    left: isOpen ? '310px' : '-20px',
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
                width: isOpen ? 'calc(100% - 330px)' : '100%',
            }"
            v-loading="loadingBut"
        >
            <div
                v-show="tablePosition !== 2"
                :style="{ height: containerHeight + 'px' }"
                id="container"
            ></div>
            <div class="tab-content">
                <div class="btn">
                    <el-button
                        class=""
                        tips-placement="bottom-end"
                        tips="将导出GPS和轨迹不完整明细"
                        @click="goExport"
                        :loading="loadingAll"
                        :disabled="loadingAll || loadingBut"
                        >导出</el-button
                    >
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
                    <el-tab-pane :label="`位置数据(${total})`" name="first">
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
                            border
                            stripe
                        >
                            <el-table-column
                                prop="collectTime"
                                label="上报时间"
                                width="180px"
                            ></el-table-column>
                            <el-table-column
                                prop="supplementSign"
                                label="上报类型"
                                width="120px"
                            >
                                <template slot-scope="scope">
                                    <span>{{
                                        scope.row.supplementSign
                                            ? "补报"
                                            : "正常上报"
                                    }}</span>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column prop="gpsValid" label="是否合格" width="100px">
                                <template slot-scope="scope">
                                    <span>{{scope.row.gpsValid ? "合格" : "不合格" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column  prop="upgradeStatus" label="不合格原因"  width="160px">
                                <template slot-scope="scope">
                                    <div>
                                        {{ upgradeStatusList[scope.row.upgradeStatus ] && upgradeStatusList[scope.row.upgradeStatus].name}}
                                    </div>
                                </template>
                            </el-table-column> -->
                            <el-table-column
                                prop="gpsStatus"
                                label="状态"
                                width="100px"
                                show-overflow-tooltip
                            >
                                <template slot-scope="scope">
                                    <span>{{
                                        !scope.row.gpsStatus
                                            ? "ACCOFF & 定位无效"
                                            : scope.row.gpsStatus == 1
                                            ? "ACCOFF & 定位有效"
                                            : scope.row.gpsStatus == 2
                                            ? "ACC ON & 定位无效"
                                            : "ACC ON & 定位有效"
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="createTime"
                                label="接收时间"
                                width="180px"
                            ></el-table-column>
                            <el-table-column
                                prop="speed"
                                label="GPS速度（km/h）"
                                width="150px"
                            ></el-table-column>
                            <el-table-column
                                prop="recorderSpeed"
                                label="行车记录仪速度（km/h）"
                                width="200px"
                            ></el-table-column>
                            <el-table-column
                                prop="longitude"
                                label="经纬度"
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
                            <el-table-column
                                prop="totalMileage"
                                label="总里程（km）"
                                width="150px"
                            ></el-table-column>
                            <el-table-column
                                prop="GDPosition"
                                label="地理位置"
                                width="200px"
                                show-overflow-tooltip
                            ></el-table-column>
                            <el-table-column
                                prop="direction"
                                label="方向角"
                                width="100px"
                            ></el-table-column>
                            <el-table-column
                                prop="altitude"
                                label="海拔"
                                width="100px"
                            ></el-table-column>
                            <el-table-column
                                prop="locationSignal"
                                label="卫星数"
                                width="150px"
                            ></el-table-column>
                            <el-table-column
                                prop="positionSignalStrength"
                                label="网络信号强度"
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
                                    <span v-else>未知</span>
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
            loadingAll: false,
            loadingBut: false,
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
            total: 0,
            geoJsonData: [],
            tableData: [],
            completeData: [],
            completeDataCopy: [],
            aMap: null,
            mass: null,
            locationMessage: {
                collectTime: "",
                speed: "",
                position: "",
            },
            allDateList: [],
            isOpen: true,
            activeName: "first",
            //不合格原因
            upgradeStatusList: {
                // 设备升级结果
                1: { name: "未定位", color: "text-warning" },
                2: { name: "经度错误", color: "text-warning" },
                3: { name: "维度错误", color: "text-warning" },
                4: { name: "速度错误", color: "text-warning" },
                5: { name: "海拔错误", color: "text-warning" },
                6: { name: "方向角错误", color: "text-success" },
                7: { name: "卫星时间", color: "text-error" },
            },
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
        this.setTableHeight();
        this.allDateList = this.getAllDateCN(
            this.$route.query.startDate,
            this.$route.query.endDate
        );
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
        } else {
            this.searchForm.operateTimeArr = [
                this.$route.query.startDate + " 00:00:00",
                this.$route.query.endDate + " 23:59:59",
            ];
            this.searchForm.startDate = this.$route.query.startDate;
            this.searchForm.endDate = this.$route.query.endDate;
            this.incompleteGPSInfo(1);
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
                .carDriftDataHistory(params)
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
                                    // const rate = Number(i.driftRate) * 100;
                                    // const newRate = rate % 1 === 0 ? rate : rate.toFixed(2);
                                    this.$set(this.allDateList, index, {
                                        ...item,
                                        driftRate: i.driftRate + "%",
                                    });
                                }
                            });
                        });
                    } else {
                        this.$message.error(
                            "获取轨迹完整历史列表失败:" + res.msg
                        );
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
            let lnglat = {
                Q: row["latitudeGcj"],
                R: row["longitudeGcj"],
                lat: row["latitudeGcj"],
                lng: row["longitudeGcj"],
            };
            this.locationMessage.collectTime = row.collectTime;
            this.locationMessage.speed = row.speed;
            this.locationMessage.position = row.GDPosition;
            if (this.locationMessage.position) {
                this.aMap.clearInfoWindow();
                let info = [];
                info.push(
                    `<p style="padding:4px 8px">上报时间: ${this.locationMessage["collectTime"]}</p>`
                );
                info.push(
                    `<p style="padding:4px 8px">车速（km/h）:${this.locationMessage["speed"]}</p>`
                );
                info.push(
                    `<p style="padding:4px 8px">位置: ${this.locationMessage["position"]}</p>`
                );
                let infoWindow = new AMap.InfoWindow({
                    content: info.join(""), //使用默认信息窗体框样式，显示信息内容
                });
                infoWindow.open(this.aMap, lnglat);
            } else {
                this.locationMessage.position = "";
            }
        },
        //上下按钮
        tableHeightAdd(type) {
            if (type) {
                this.tablePosition === 2 ? "" : this.tablePosition++;
            } else {
                this.tablePosition === 0 ? "" : this.tablePosition--;
            }
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
                                            _this.$message.error("导出GPS失败");
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
                        _this.$message.error("导出失败:" + _res.msg);
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
                this.$message.error("请将时间段控制在24小时以内");
            } else {
                this.driftPointArr = [];
                this.geoJsonData = [];
                this.completeData = [];
                this.total = 0;
                this.completeDataCopy = [];
                this.tableData = [];
                this.incompleteGPSInfo(1);
                if (this.mass) {
                    this.mass.setMap(null);
                    this.mass = null;
                }
                this.aMap.clearInfoWindow();
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
        //获取GPS数据
        incompleteGPSInfo(type) {
            let params = {};
            // if(type){
            this.searchForm["startTime"] = this.searchForm["operateTimeArr"][0];
            this.searchForm["endTime"] = this.searchForm["operateTimeArr"][1];
            params = Object.assign({}, this.searchForm, this.params, {
                pageSize: 6000,
            });
            this.loadingBut = true;
            this.$api.incompleteGPSInfo(params).then((res) => {
                console.log(res);
                if (res.success) {
                    this.$api.eventTrackTrigger({
                        menu: "GROUND_TRACK_DRIFTING",
                        business: "GROUND_TRACK_DRIFTING_TRACK_PLAYBACK",
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
                                        if (this_.locationMessage.position) {
                                            this_.aMap.clearInfoWindow();
                                            let info = [];
                                            info.push(
                                                `<p style="padding:4px 8px">上报时间: ${this_.locationMessage["collectTime"]}</p>`
                                            );
                                            info.push(
                                                `<p style="padding:4px 8px">车速（km/h）:${this_.locationMessage["speed"]}</p>`
                                            );
                                            info.push(
                                                `<p style="padding:4px 8px">位置: ${this_.locationMessage["position"]}</p>`
                                            );
                                            let infoWindow =
                                                new AMap.InfoWindow({
                                                    content: info.join(""), //使用默认信息窗体框样式，显示信息内容
                                                });
                                            infoWindow.open(this_.aMap, [
                                                e.data.longitudeGcj,
                                                e.data.latitudeGcj,
                                            ]);
                                        } else {
                                            this_.locationMessage.position = "";
                                        }
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
                    this.$message.error(`获取车辆GPS失败：${res.msg}`);
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
        changeLeftWidth() {
            this.isOpen = !this.isOpen;
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
        width: 330px;
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
            left: 310px;
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
        width: calc(~"100% - 330px");
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
