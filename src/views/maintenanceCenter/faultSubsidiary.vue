<template>
    <div>
        <div class="wrap">
            <div ref="searchBox" class="search-module">
                <div class="search-form-content">
                    <el-form
                        :rules="rules"
                        :model="searchForm"
                        inline
                        ref="searchForm"
                    >
                        <!-- 组织 -->
                        <el-form-item :label="$t('common.orgPath')">
                            <TreeSelect
                                ref="TreeSelectOrgIds"
                                :treeData="treeData"
                                style="width: 244px"
                                filter
                                collapse-tags
                                show-checkbox
                                :check-strictly="true"
                                v-model="searchForm.orgIds"
                                :props="defaultProps"
                            >
                            </TreeSelect>
                        </el-form-item>
                        <!-- 故障类型 -->
                        <el-form-item
                            :label="$t('deviceHealthCondition.faultType')"
                        >
                            <TreeSelect
                                ref="TreeSelectFaultTypes"
                                :treeData="allFaultType"
                                show-checkbox
                                filter
                                style="width: 300px"
                                collapse-tags
                                check-model="child"
                                v-model="searchForm.faultTypes"
                            >
                            </TreeSelect>
                        </el-form-item>
                        <!-- 故障开始时间段 -->
                        <el-form-item
                            prop="time"
                            :label="$t('handleFault.faultStartTimePeriod')"
                        >
                            <el-date-picker
                                size="small"
                                :clearable="false"
                                v-model="searchForm.time"
                                format="yyyy-MM-dd HH:mm:ss"
                                type="datetimerange"
                                :start-placeholder="$t('common.startTime')"
                                :end-placeholder="$t('common.endTime')"
                                :default-time="['00:00:00', '23:59:59']"
                            />
                        </el-form-item>
                    </el-form>
                </div>
                <div ref="searchBtn" class="search-btn">
                    <el-button
                        type="primary"
                        :loading="searchLoading"
                        @click="
                            params.currentPage = 1;
                            search();
                        "
                    >
                        <!-- 查询 -->
                        {{ $t("common.search") }}
                    </el-button>
                    <el-button type="default" @click="handleReset()">
                        <!-- 清除条件 -->
                        {{ $t("common.reset") }}
                    </el-button>
                </div>
            </div>
            <div class="p-x" ref="searchBtn">
                <el-button
                    class="goExport"
                    @click="goExport"
                    :loading="loadingAll"
                    :disabled="loadingAll"
                    v-btn="'faultSubsidiaryExport'"
                >
                    <!-- 导出 -->
                    {{ $t("common.export") }}
                </el-button>
            </div>
            <div class="m-x p-y table">
                <el-table
                    v-loading="searchLoading"
                    :element-loading-text="$t('common.desperatelyLoading')"
                    element-loading-color="#007213"
                    :data="tableData"
                    :height="tableHeight"
                    label-width="auto"
                    border
                    stripe
                >
                    <!-- 所属组织 -->
                    <el-table-column
                        prop="orgName"
                        :label="$t('common.orgPath')"
                        min-width="300px"
                    ></el-table-column>
                    <!-- 车牌号 -->
                    <el-table-column
                        prop="plateNum"
                        :label="$t('common.plateNum')"
                        min-width="120px"
                    ></el-table-column>
                    <!-- 故障类型 -->
                    <el-table-column
                        prop="faultTypeDesc"
                        :label="$t('deviceHealthCondition.faultType')"
                        min-width="240px"
                    ></el-table-column>
                    <!-- 故障次数 -->
                    <el-table-column
                        prop="faultNum"
                        :label="$t('faultSubsidiary.failureFrequency')"
                        align="right"
                        min-width="240px"
                    ></el-table-column>
                    <!-- 操作 -->
                    <el-table-column
                        prop="operate"
                        :label="$t('common.operate')"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <a
                                @click="goDetail(scope.row)"
                                v-btn="'faultSubsidiaryFaultDetails'"
                            >
                                <!-- 详情 -->
                                {{ $t("common.detail") }}
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="p-x wrap-bottom" ref="searchPagination">
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
    </div>
</template>

<script>
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import TimeUtil from "@/utils/time";
// import func from 'vue-editor-bridge';
export default {
    name: "faultSubsidiary",
    components: {
        TreeSelect,
    },
    data() {
        let timeValite = (rule, value, callback) => {
            if (value && value.length) {
                if (
                    value[1].getTime() - value[0].getTime() >
                    90 * 24 * 60 * 60 * 1000
                ) {
                    // 时间跨度不得超过90天
                    callback(
                        new Error(this.$t("faultSubsidiary.timeValiteText"))
                    );
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            searchFormCopy: {},
            searchForm: {
                faultTypes: [],
                orgIds: [],
                startTime: "",
                endTime: "",
                time: [
                    new Date(new Date() - 1 * 24 * 60 * 60 * 1000),
                    new Date(),
                ],
            },
            searchLoading: false,
            defaultProps: {
                children: "children",
                label: "name",
            },
            loadingAll: false,
            allFaultType: [],
            total: 0,
            pickerOptions2: {
                disabledDate(time) {
                    // 禁用以后的时间
                    return time.getTime() > Date.now();
                },
            },
            params: {
                pageSize: 20,
                currentPage: 1,
            },
            tableData: [],
            tableHeight: 500,
            treeArr: [],
            treeData: [],
            rules: {
                time: [{ validator: timeValite, trigger: "blur" }],
            },
        };
    },
    watch: {
        "searchForm.time": {
            handler(val) {
                if (val && val.length > 0) {
                    this.searchForm.startTime = TimeUtil.getDateTime(
                        this.searchForm.time[0]
                    );
                    this.searchForm.endTime = TimeUtil.getDateTime(
                        this.searchForm.time[1]
                    );
                } else {
                    this.searchForm.startTime = "";
                    this.searchForm.endTime = "";
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        showStatus(status) {
            if (status == 0) {
                // return "待维护";
                return this.$t("maintainRecord.toBeMaintained");
            } else {
                // return "已解决";
                return this.$t("handleFault.resolved");
            }
        },
        goDetail(data) {
            this.$router.push({
                path: "/maintenanceCenter/faultSubsidiary/faultAccount",
                query: {
                    treeLevel: data.treeLevel,
                    plateNum: data.plateNum,
                    faultTypes: data.faultType,
                    time:
                        this.searchFormCopy.time &&
                        this.searchFormCopy.time.length
                            ? [
                                  TimeUtil.getDateTime(
                                      this.searchFormCopy.time[0]
                                  ),
                                  TimeUtil.getDateTime(
                                      this.searchFormCopy.time[1]
                                  ),
                              ].join("~")
                            : [],
                },
            });
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchPagination.clientHeight -
                111;
        },
        // 重置表单
        handleReset() {
            this.searchForm.faultTypes = [];
            this.searchForm.orgIds = [];
            this.$refs["searchForm"].resetFields();
            // this.searchForm.startTime = TimeUtil.getDateTime(this.searchForm.time[0]);
            // this.searchForm.endTime = TimeUtil.getDateTime(this.searchForm.time[1]);
            this.searchForm.time = [
                new Date(new Date() - 1 * 24 * 60 * 60 * 1000),
                new Date(),
            ];
            this.$store.dispatch("SetCondtion", this.searchForm);
        },
        handleSizeChange(val) {
            this.$refs.searchForm.validate((valid, invalidFields) => {
                if (valid) {
                    this.params.currentPage = 1;
                    this.params.pageSize = val;
                    this.getData();
                }
            });
        },
        handleCurrentChange(val) {
            this.$refs.searchForm.validate((valid, invalidFields) => {
                if (valid) {
                    this.params.currentPage = val;
                    this.getData();
                }
            });
        },
        search() {
            this.$refs.searchForm.validate((valid, invalidFields) => {
                if (valid) {
                    this.getData();
                }
            });
        },
        getData() {
            this.searchLoading = true;
            // this.searchForm.startTime = TimeUtil.getDateTime(
            //     this.searchForm.time[0]
            // );
            // this.searchForm.endTime = TimeUtil.getDateTime(
            //     this.searchForm.time[1]
            // );
            this.$store.dispatch("SetCondtion", this.searchForm);
            let params = Object.assign({}, this.params, this.searchForm);
            this.$api
                .getFaultDetailPage(params)
                .then((res) => {
                    if (res.success == true) {
                        this.searchFormCopy = JSON.parse(
                            JSON.stringify(this.searchForm)
                        );
                        this.total = res.data.totalRecords;
                        this.tableData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableData;
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
        // 导出
        goExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                this.searchForm.startTime = TimeUtil.getDateTime(
                    this.searchForm.time[0]
                );
                this.searchForm.endTime = TimeUtil.getDateTime(
                    this.searchForm.time[1]
                );
                let params = Object.assign({}, this.searchForm);
                this.$api.exportFaultDetail(params).then((res) => {
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
                                                _this.getExportResultInterval
                                            );
                                            _this.getExportResultInterval = "";
                                            _this.loadingAll = false;
                                        }
                                    });
                            },
                            2000
                        );
                    } else {
                        this.$message.error(
                            this.$t("common.exportFailed") + ":" + res.msg
                        );
                        this.loadingAll = false;
                    }
                });
            }
        },
        //获取故障类型
        getAllFaultType() {
            this.$api.getAllFaultType().then((res) => {
                if (res.success == true) {
                    let allFaultType = res.data;
                    let allFaultTypes = [];
                    allFaultType.map((i) => {
                        let flag = true;
                        let indexCurrent;
                        allFaultTypes.forEach((item, index) => {
                            if (i.faultGroup == -item.id) {
                                flag = false;
                                indexCurrent = index;
                            }
                        });
                        if (flag) {
                            let obj = {};
                            obj.id = -i.faultGroup;
                            obj.label = i.faultGroupDesc;
                            obj.children = [];
                            obj.children.push({
                                id: i.faultType,
                                label: i.faultName,
                            });
                            allFaultTypes.push(obj);
                        } else {
                            allFaultTypes[indexCurrent].children.push({
                                id: i.faultType,
                                label: i.faultName,
                            });
                        }
                    });
                    this.allFaultType = allFaultTypes;
                    this.$nextTick(() => {
                        if (
                            this.searchForm.faultTypes &&
                            this.searchForm.faultTypes.length
                        ) {
                            this.$refs.TreeSelectFaultTypes.setValue(
                                this.searchForm.faultTypes
                            );
                        }
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //获取组织选项
        getOrgTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = res.data;
                    this.treeDataToArr(res.data);
                    this.$nextTick(() => {
                        if (
                            this.searchForm.orgIds &&
                            this.searchForm.orgIds.length
                        ) {
                            this.$refs.TreeSelectOrgIds.setValue(
                                this.searchForm.orgIds
                            );
                        }
                    });
                }
            });
        },
        treeDataToArr(val, type) {
            if (type) {
                this.treeArr = [];
            }
            val.forEach((item) => {
                this.treeArr.push({
                    id: item.id,
                    name: item.name,
                });
                if (item.children.length > 0) {
                    this.treeDataToArr(item.children, "");
                }
            });
        },
    },
    mounted() {
        this.search();
        let that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };
    },
    created() {
        if (this.$store.state.tree.searchForm) {
            this.searchForm.faultTypes = this.$store.state.tree.searchForm
                .faultTypes
                ? this.$store.state.tree.searchForm.faultTypes
                : [];
            this.searchForm.orgIds = this.$store.state.tree.searchForm.orgIds
                ? this.$store.state.tree.searchForm.orgIds
                : [];
            this.searchForm.startTime = this.$store.state.tree.searchForm
                .startTime
                ? this.$store.state.tree.searchForm.startTime
                : "";
            this.searchForm.endTime = this.$store.state.tree.searchForm.endTime
                ? this.$store.state.tree.searchForm.endTime
                : "";
            if (this.$store.state.tree.searchForm.startTime) {
                this.searchForm.time = [
                    new Date(this.$store.state.tree.searchForm.startTime),
                    new Date(this.$store.state.tree.searchForm.endTime),
                ];
            }
        }
        this.getAllFaultType();
        this.getOrgTree();
    },
};
</script>

<style scoped lang="less">
.wrap-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .el-form-item {
        margin-bottom: 12px !important;
    }
}
.wrap-bottom {
    border-top: 1px solid #e4e4e4;
}
</style>
