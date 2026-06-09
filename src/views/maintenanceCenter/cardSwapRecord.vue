<template>
    <div class="top wrap">
        <div ref="searchBox" class="search-module" style="padding: 0">
            <div
                class="search-form-content"
                :class="{ hidden: !buttonClick }"
                ref="wrap"
            >
                <el-form ref="form" :model="searchForm" inline>
                    <el-form-item
                        :label="$t('common.keywords')"
                        prop="deviceCode"
                    >
                        <G-DeviceSearch
                            :valueKey="'deviceCode'"
                            :value.sync="searchForm.deviceCode"
                            :selectObj.sync="searchForm.selectObj"
                            :organizeId="params.organizeId"
                        ></G-DeviceSearch>
                    </el-form-item>
                    <!-- 所属组织 -->
                    <el-form-item
                        :label="$t('common.orgPath')"
                        prop="organizeId"
                    >
                        <TreeSelect
                            :placeholder="$t('common.select')"
                            :treeData="treeData"
                            style="width: 280px"
                            :clearable="false"
                            filter
                            v-model="searchForm.organizeId"
                            :props="defaultProps"
                        >
                        </TreeSelect>
                    </el-form-item>
                    <!-- 时间范围 -->
                    <el-form-item
                        :label="$t('qualifiedProbability.timeFrame')"
                        prop="timeRange"
                    >
                        <el-date-picker
                            :picker-options="pickerOptions2"
                            :default-time="['00:00:00', '23:59:59']"
                            size="small"
                            v-model="timeRange"
                            type="datetimerange"
                            transfer
                            :popper-class="'no-clear'"
                            :clearable="false"
                            format="yyyy-MM-dd HH:mm:ss"
                            :start-placeholder="$t('common.startTime')"
                            :end-placeholder="$t('common.endTime')"
                        ></el-date-picker>
                    </el-form-item>
                    <!-- 操作类型 -->
                    <el-form-item
                        :label="$t('operationLog.operationType')"
                        prop="operation"
                    >
                        <el-select
                            class="widthShort"
                            v-model="searchForm.operation"
                            :placeholder="$t('common.select')"
                            clearable
                        >
                            <!-- 全部 -->
                            <el-option
                                :value="Number(0)"
                                :label="$t('common.all')"
                            ></el-option>
                            <!-- 插卡 -->
                            <el-option
                                :value="Number(1)"
                                :label="$t('cardSwapRecord.insertCard')"
                            ></el-option>
                            <!-- 拔卡 -->
                            <el-option
                                :value="Number(2)"
                                :label="$t('cardSwapRecord.unplugCard')"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div ref="searchBtn" class="search-btn">
                <el-button
                    class=""
                    type="primary"
                    :disabled="searchLoading"
                    :loading="searchLoading"
                    @click="getData()"
                >
                    <!-- 查询 -->
                    {{ $t("common.search") }}
                </el-button>
                <el-button
                    type="default"
                    @click="handleReset($refs.searchForm)"
                >
                    <!-- 清除条件 -->
                    {{ $t("common.reset") }}
                </el-button>
                <el-button
                    :icon="
                        !buttonClick
                            ? 'el-icon-d-arrow-left'
                            : 'el-icon-d-arrow-right'
                    "
                    @click="handleClick"
                    v-if="iconShow"
                />
            </div>
        </div>
        <div class="wrap-top m-b" ref="searchBtn">
            <el-button
                style="margin-left: 0px"
                @click="goExport"
                :loading="loadingAll2"
                :disabled="loadingAll2"
                v-btn="'cardSwapRecordExport'"
            >
                <!-- 导出 -->
                {{ $t("common.export") }}
            </el-button>
        </div>
        <el-table
            v-loading="searchLoading"
            :element-loading-text="$t('common.desperatelyLoading')"
            element-loading-color="#007213"
            :height="tableHeight"
            :data="tableData"
            force-scroll="horizontal"
            style="width: 100%"
            border
            stripe
        >
            <!-- 所属组织 -->
            <el-table-column
                prop="treeLevelName"
                :label="$t('common.orgPath')"
                min-width="300px"
            ></el-table-column>
            <!-- 车牌号 -->
            <el-table-column
                prop="plateNum"
                :label="$t('common.plateNum')"
                width="140px"
            ></el-table-column>
            <!-- 终端手机号 -->
            <el-table-column
                prop="deviceCode"
                :label="$t('common.deviceCode')"
            ></el-table-column>
            <!-- 设备序列号 -->
            <el-table-column
                prop="deviceSerialNum"
                :label="$t('common.deviceSerialNum')"
            ></el-table-column>
            <!-- 司机姓名 -->
            <el-table-column
                prop="driverName"
                :label="$t('cardSwapRecord.driverName')"
                width="100px"
            ></el-table-column>
            <!-- 证件类型 -->
            <el-table-column
                prop="certificateType"
                :label="$t('cardSwapRecord.certificateType')"
                width="100px"
            >
                <template slot-scope="scope">
                    <div>
                        <!-- {{ scope.row.certificateType == 0 ? "IC卡" : "未知" }} -->
                        {{
                            scope.row.certificateType == 0
                                ? $t("cardSwapRecord.ICCard")
                                : $t("common.unknown")
                        }}
                    </div>
                </template>
            </el-table-column>
            <!-- 证件号 -->
            <el-table-column
                prop="certificateNumber"
                :label="$t('cardSwapRecord.certificateNumber')"
                width="200px"
            ></el-table-column>
            <!-- 操作类型 -->
            <el-table-column
                prop="operation"
                :label="$t('operationLog.operationType')"
                width="100px"
            >
                <template slot-scope="scope">
                    <!-- <div>{{ scope.row.operation == 1 ? "插卡" : "拔卡" }}</div> -->
                    <div>
                        {{
                            scope.row.operation == 1
                                ? $t("cardSwapRecord.insertCard")
                                : $t("cardSwapRecord.unplugCard")
                        }}
                    </div>
                </template>
            </el-table-column>
            <!-- 操作时间 -->
            <el-table-column
                prop="operationTime"
                :label="$t('operationLog.operationTime')"
                width="170px"
            ></el-table-column>
            <!-- 创建时间 -->
            <el-table-column
                prop="createTime"
                :label="$t('cardSwapRecord.createTime')"
                width="170px"
            ></el-table-column>
        </el-table>
        <div class="wrap-bottom" ref="searchPagination">
            <el-pagination
                :current-page="params.currentPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[20, 50, 100]"
                :page-size="params.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import TimeUtil from "@/utils/time";
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
export default {
    name: "cardSwapRecord",
    components: {
        TreeSelect,
    },
    data() {
        return {
            buttonClick: false,
            iconShow: false,
            startTime: "",
            endTime: "",
            loading: false,
            searchLoading: false,
            searchForm: {
                deviceSerialNum: "",
                deviceCode: "",
                organizeId: "",
                plateNums: [],
                orderDir: "desc",
                operation: 0,
                selectObj: {},
            },
            dateTimes: "",
            defaultProps: {
                children: "children",
                label: "name",
            },
            loadingAll2: false,
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                //organizeId: null,
                //orderColumn: 'offlineDays', //排序列
                //orderDir: 'desc',   //排序方向
            },
            params2: {
                currentPage: 1, //页码，从1开始
                pageSize: 20,
            },
            total: 0,
            // date: new Date(new Date() - 24 * 60 * 60 * 1000),
            timeRange: [
                new Date(
                    TimeUtil.getDate(new Date() - 2 * 24 * 60 * 60 * 1000) +
                        " 00:00:00"
                ).getTime(),
                new Date(TimeUtil.getDate(new Date()) + " 23:59:59").getTime(),
            ],
            month: TimeUtil.oneMonthAgo(),
            tableHeight: 500,
            treeHeight: 500,
            reportType: 0,
            onlineTimeList: [],
            treeData: [],
            tableData: [],
            monthDayCount: 30,
            modalMap: false,
            rowData: {},
            treeArr: [],
            plateArr: [],
            query: "",
            pickerOptions2: {
                disabledDate(time) {
                    // 禁用以后的时间
                    return (
                        time.getTime() >
                        new Date(
                            TimeUtil.getDate(new Date()) + " 23:59:59"
                        ).getTime()
                    );
                },
            },
        };
    },
    computed: {
        monthDay() {
            return [...Array(this.monthDayCount).keys()].map((i) => i + 1);
        },
    },
    watch: {
        "searchForm.plateNums": {
            handler(val) {
                if (!val.length && this.query.length < 3) {
                    this.plateArr = [];
                }
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val.length < 3 && !this.searchForm.plateNums.length) {
                    this.plateArr = [];
                }
            },
            deep: true,
        },
    },
    methods: {
        getPlateNumList(params) {
            this.loading = true;
            this.$api.driverCarList(params).then((res) => {
                this.plateArr = res.data.carList;
                this.loading = false;
            });
        },
        remoteMethod(query) {
            this.query = query;
            if (query.length >= 3) {
                this.getPlateNumList({ plateNum: query });
            }
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getData();
        },
        handleSizeChange2(val) {
            this.params2.pageSize = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getData();
        },
        handleCurrentChange2(val) {
            this.params2.currentPage = val;
            this.getData();
        },
        changeWay(val) {
            this.params.currentPage = 1;
            this.params.pageSize = 20;
            this.params2.currentPage = 1;
            this.params2.pageSize = 20;
            this.$store.dispatch("RemoveCondition");
            this.$store.dispatch("RemoveTime");
            this.getData();
        },
        // 重置表单
        handleReset(ref) {
            this.$refs["form"].resetFields();
            this.timeRange = [
                new Date(
                    TimeUtil.getDate(new Date() - 2 * 24 * 60 * 60 * 1000) +
                        " 00:00:00"
                ).getTime(),
                new Date(TimeUtil.getDate(new Date()) + " 23:59:59").getTime(),
            ];
            this.searchForm.organizeId = this.treeData[0].id;
            this.$store.dispatch("SetCondtion", this.searchForm);
        },
        goExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                let param = {};
                //param['organizeId'] = '';
                param["startTime"] = this.timeRange.length
                    ? TimeUtil.getDateTime(this.timeRange[0])
                    : "";
                param["endTime"] = this.timeRange.length
                    ? TimeUtil.getDateTime(this.timeRange[1])
                    : "";
                param["plateNums"] = this.searchForm.plateNums | [];
                param = Object.assign(param, this.searchForm);
                this.loadingAll2 = true;
                this.$api.exportRecordDrive(param).then((res) => {
                    if (res.success == true) {
                        var fileName = res.data.fileName;
                        let _this = this;
                        _this.getExportResultInterval2 = window.setInterval(
                            function () {
                                _this.$api
                                    .isExportFinished(fileName)
                                    .then((res1) => {
                                        if (
                                            res1.success == true &&
                                            res1.data == true
                                        ) {
                                            var iframe =
                                                document.createElement(
                                                    "iframe"
                                                );
                                            iframe.src =
                                                (process.env.BASE_API == "/"
                                                    ? ""
                                                    : process.env.BASE_API) +
                                                "/excel?fileName=" +
                                                fileName;
                                            iframe.style.display = "none";
                                            document.body.appendChild(iframe);
                                            window.clearInterval(
                                                _this.getExportResultInterval2
                                            );
                                            _this.getExportResultInterval2 = "";
                                            _this.loadingAll2 = false;
                                        }
                                    });
                            },
                            2000
                        );
                    } else {
                        this.$message.error(
                            this.$t("common.exportFailed") + ":" + res.msg
                        );
                        this.loadingAll2 = false;
                    }
                });
            }
        },
        getData() {
            this.searchLoading = true;
            let params = {};
            if (this.timeRange && this.timeRange.length > 0) {
                params.startTime = TimeUtil.getDateTime(this.timeRange[0]);
                params.endTime = TimeUtil.getDateTime(this.timeRange[1]);
                this.startTime = TimeUtil.getDateTime(this.timeRange[0]);
                this.endTime = TimeUtil.getDateTime(this.timeRange[1]);
            } else {
                params.startTime = "";
                params.endTime = "";
                this.startTime = "";
                this.endTime = "";
            }
            let carParam = Object.assign(params, this.searchForm, this.params);
            //carParam['organizeId'] = ''
            delete params.selectObj;
            this.$api
                .drivePage(carParam)
                .then((res) => {
                    if (res.success == true) {
                        this.tableData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableData;
                        this.total = res.data.totalRecords;
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.searchLoading = false;
                    this.$nextTick(() => {
                        this.setTableHeight();
                    });
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },

        // 获取组织树
        // this.params.organizeId = this.$store.state.tree.devicFaultId ? this.$store.state.tree.devicFaultId : res.data[0].id;
        // this.searchForm = this.$store.state.tree.searchForm ? this.$store.state.tree.searchForm : this.searchForm;
        getOrgTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = res.data;
                    this.$nextTick(() => {
                        this.searchForm.organizeId = res.data[0].id;
                        this.$forceUpdate();
                    });
                    this.$nextTick(() => {
                        // this.searchForm = this.$store.state.tree.searchForm ? this.$store.state.tree.searchForm : this.searchForm;
                        // this.timeRange = this.$store.state.tree.time ? this.$store.state.tree.time : [new Date(new Date()-7*24*60*60*1000),new Date()]
                        this.getData();
                    });
                }
            });
        },
        // treeDataToArr(val,type){
        //   if(type){
        //     this.treeArr = [];
        //   }
        //   val.forEach(item =>{
        //     this.treeArr.push({
        //       id:item.id,
        //       name:item.name
        //     })
        //     if(item.children.length > 0){
        //       this.treeDataToArr(item.children,'')
        //     }
        //   })
        // },

        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchPagination.clientHeight -
                108;
            if (this.$refs.wrap.scrollHeight > 46) {
                this.iconShow = true;
            } else {
                this.iconShow = false;
            }
        },
        handleClick() {
            this.buttonClick = !this.buttonClick;
            this.$nextTick(() => {
                this.setTableHeight();
            });
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
        this.getOrgTree();
        // this.getData();
        //this.getPlateNumList()
        // this.changeMonthDayCount();
    },
};
</script>

<style lang="less" scoped>
.top {
    padding: 12px;
    .top-box {
        display: flex;
        justify-content: space-between;
    }
    .top-right {
        display: flex;
        margin-top: 28px;
        height: 32px;
    }
    .top-bottom {
        margin-bottom: 12px;
    }
}
.top-left {
    .el-form-item {
        margin-bottom: 12px !important;
    }
}
.wrap-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .flex {
        display: flex;
    }
    .el-form-item {
        margin-bottom: 20px !important;
    }
}
.hidden {
    height: 46px;
    overflow: hidden;
}
</style>
