<template>
    <div>
        <div>
            <el-row>
                <el-col :span="4" class="p-a b-r">
                    <div :class="{ loading_: searchLoading }">
                        <el-input
                            class="searchBottom"
                            v-model="organizationName"
                            :placeholder="$t('common.inputOrganizationName')"
                            clearable
                        >
                            <i
                                slot="suffix"
                                class="el-input__icon el-icon-search"
                            ></i>
                        </el-input>
                        <el-tree
                            ref="tree"
                            :data="treeData"
                            :default-expanded-keys="expandedList"
                            @node-click="handleNodeClick"
                            default-icon="el-icon-folder"
                            highlight-current
                            node-key="id"
                            :props="defaultProps"
                            :current-node-key="searchForm.orgId"
                            :filter-node-method="filterNode"
                            :style="{ height: treeHeight + 'px' }"
                            :expand-on-click-node="false"
                        ></el-tree>
                    </div>
                </el-col>
                <el-col :span="20">
                    <div class="wrap">
                        <div ref="searchBox" class="search-module">
                            <div
                                class="search-form-content"
                                :class="{ hidden: !buttonClick }"
                                ref="wrap"
                            >
                                <el-form
                                    :rules="rules"
                                    :model="searchForm"
                                    inline
                                    ref="searchForm"
                                >
                                    <!-- 异常名称 -->
                                    <el-form-item
                                        :label="
                                            $t('anomalyDetails.exceptionName')
                                        "
                                    >
                                        <el-select
                                            v-model="
                                                searchForm.alarmAnalyseTypeList
                                            "
                                            multiple
                                            collapse-tags
                                            clearable
                                            :placeholder="$t('common.select')"
                                            class="alarmAnalyseTypeList"
                                        >
                                            <el-option
                                                v-for="item in alarmAnalyseTypeLists"
                                                :key="item.id"
                                                :value="item.sysDictCode"
                                                :label="item.sysDictName"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <!-- 车牌号 -->
                                    <el-form-item
                                        :label="$t('common.plateNum')"
                                        prop="plateNum"
                                    >
                                        <el-select
                                            :remote-method="remoteMethod"
                                            :loading="loading"
                                            filterable
                                            reserve-keyword
                                            remote
                                            clearable
                                            collapse-tags
                                            :placeholder="
                                                $t(
                                                    'devLog.enterThreeLicensePlateNumbers'
                                                )
                                            "
                                            v-model="searchForm.plateNum"
                                        >
                                            <el-option
                                                v-for="item in plateArr"
                                                :key="item.id"
                                                :value="item.plateNum"
                                                :label="item.plateNum"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <!-- 异常时间段 -->
                                    <el-form-item
                                        :label="
                                            $t(
                                                'anomalyDetails.abnormalTimePeriod'
                                            )
                                        "
                                    >
                                        <el-date-picker
                                            size="small"
                                            :clearable="false"
                                            v-model="searchForm.time"
                                            format="yyyy-MM-dd HH:mm:ss"
                                            type="datetimerange"
                                            :start-placeholder="
                                                $t('common.startTime')
                                            "
                                            :end-placeholder="
                                                $t('common.endTime')
                                            "
                                            :default-time="[
                                                '00:00:00',
                                                '23:59:59',
                                            ]"
                                            :picker-options="pickerOptions2"
                                        />
                                    </el-form-item>
                                    <!-- 处理状态 -->
                                    <el-form-item
                                        :label="
                                            $t(
                                                'anomalyDetails.processingStatus'
                                            )
                                        "
                                        prop="handleState"
                                    >
                                        <el-select
                                            class="widthShort"
                                            v-model="searchForm.handleState"
                                            :placeholder="$t('common.select')"
                                            clearable
                                        >
                                            <!-- 全部 -->
                                            <el-option
                                                value=""
                                                :label="$t('common.all')"
                                            ></el-option>
                                            <!-- 未处理 -->
                                            <el-option
                                                :value="Number(3)"
                                                :label="
                                                    $t(
                                                        'anomalyDetails.processingStatusTest3'
                                                    )
                                                "
                                            ></el-option>
                                            <!-- 已处理 -->
                                            <el-option
                                                :value="Number(1)"
                                                :label="
                                                    $t(
                                                        'anomalyDetails.processingStatusTest1'
                                                    )
                                                "
                                            ></el-option>
                                            <!-- 忽略 -->
                                            <el-option
                                                :value="Number(2)"
                                                :label="
                                                    $t(
                                                        'anomalyDetails.processingStatusTest2'
                                                    )
                                                "
                                            ></el-option>
                                        </el-select>
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
                                <el-button
                                    type="default"
                                    @click="handleReset()"
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
                        <div class="p-x" ref="searchBtn">
                            <el-button
                                type="primary"
                                class="goExport"
                                @click="doHandles"
                                :loading="loadingAll"
                                :disabled="
                                    loadingAll || selectableList.length == 0
                                "
                                v-btn="
                                    'anomalyDetailsBatchProcessingExceptions'
                                "
                            >
                                <!-- 处理 -->
                                {{ $t("anomalyDetails.handle") }}
                                {{
                                    selectableList.length
                                        ? "(" + selectableList.length + ")"
                                        : ""
                                }}</el-button
                            >
                            <!-- <el-button class="goExport" @click="goExport" :loading="loadingAll" :disabled="loadingAll" >导出</el-button> -->
                        </div>
                        <div>
                            <div class="m-x p-y table">
                                <el-table
                                    @sort-change="sortChange"
                                    @selection-change="handleSelectionChange"
                                    v-loading="searchLoading"
                                    :element-loading-text="
                                        $t('common.desperatelyLoading')
                                    "
                                    element-loading-color="#007213"
                                    :data="tableData"
                                    :height="tableHeight"
                                    label-width="auto"
                                    border
                                    stripe
                                >
                                    <el-table-column
                                        type="selection"
                                        :selectable="selectable"
                                    ></el-table-column>
                                    <!-- 异常名称 -->
                                    <el-table-column
                                        prop="alarmAnalyseName"
                                        :label="
                                            $t('anomalyDetails.exceptionName')
                                        "
                                        min-width="120px"
                                        show-overflow-tooltip
                                    ></el-table-column>
                                    <!-- 车牌号 -->
                                    <el-table-column
                                        prop="plateNum"
                                        :label="$t('common.plateNum')"
                                        min-width="140px"
                                    >
                                        <template slot-scope="scope">
                                            <div>
                                                {{ scope.row.plateNum }}
                                                <span
                                                    v-show="
                                                        scope.row.freeze == 1
                                                    "
                                                    class="freeze-icon"
                                                    >{{
                                                        $t("carManage.freeze")
                                                    }}</span
                                                >
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <!-- 所属组织 -->
                                    <el-table-column
                                        prop="orgTreeLevelName"
                                        :label="
                                            $t('common.belongingOrganization')
                                        "
                                        min-width="120px"
                                        show-overflow-tooltip
                                    ></el-table-column>
                                    <!-- 异常时间段 -->
                                    <el-table-column
                                        sortable="custom"
                                        prop="anomalyTime_"
                                        :label="
                                            $t(
                                                'anomalyDetails.abnormalTimePeriod'
                                            )
                                        "
                                        min-width="200px"
                                    ></el-table-column>
                                    <!-- 处理状态 -->
                                    <el-table-column
                                        prop="handleState"
                                        :label="
                                            $t(
                                                'anomalyDetails.processingStatus'
                                            )
                                        "
                                        min-width="140px"
                                    >
                                        <template slot-scope="scope">
                                            <div v-if="!scope.row.handleState">
                                                <span class="text-error"
                                                    >●</span
                                                >
                                                <span>
                                                    <!-- 未处理 -->
                                                    {{
                                                        $t(
                                                            "anomalyDetails.processingStatusTest3"
                                                        )
                                                    }}
                                                </span>
                                            </div>
                                            <div
                                                v-else-if="
                                                    scope.row.handleState == 1
                                                "
                                            >
                                                <span class="text-success"
                                                    >●</span
                                                >
                                                <span>
                                                    <!-- 已处理 -->
                                                    {{
                                                        $t(
                                                            "anomalyDetails.processingStatusTest1"
                                                        )
                                                    }}
                                                </span>
                                            </div>
                                            <div
                                                v-else-if="
                                                    scope.row.handleState == 2
                                                "
                                            >
                                                <span class="text-grey">●</span>
                                                <span>
                                                    <!-- 忽略 -->
                                                    {{
                                                        $t(
                                                            "anomalyDetails.processingStatusTest2"
                                                        )
                                                    }}
                                                </span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <!-- 处理人 -->
                                    <el-table-column
                                        prop="operatorName"
                                        :label="
                                            $t(
                                                'anomalyDetails.processingPersonnel'
                                            )
                                        "
                                        min-width="140px"
                                    ></el-table-column>
                                    <!-- 处理意见 -->
                                    <el-table-column
                                        prop="handleDesc"
                                        :label="
                                            $t(
                                                'anomalyDetails.handlingSuggestions'
                                            )
                                        "
                                        min-width="140px"
                                        show-overflow-tooltip
                                    >
                                    </el-table-column>
                                    <!-- 操作 -->
                                    <el-table-column
                                        prop="operate"
                                        :label="$t('common.operate')"
                                        width="150"
                                        fixed="right"
                                    >
                                        <template slot-scope="scope">
                                            <a
                                                v-if="!scope.row.handleState"
                                                @click="doHandle(scope.row)"
                                                v-btn="
                                                    'anomalyDetailsHandlingExceptions'
                                                "
                                                >处理</a
                                            >
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
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
                </el-col>
            </el-row>
        </div>
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            :width="'576px'"
            @close="handleExit"
        >
            <el-form
                content-width="480px"
                :rules="handlerules"
                :model="handleForm"
                label-position="top"
                ref="handleForm"
            >
                <!-- 处理状态 -->
                <el-form-item
                    :label="$t('anomalyDetails.processingStatus')"
                    prop="handleState"
                >
                    <el-radio-group v-model="handleForm.handleState">
                        <el-radio :label="Number(1)">
                            <!-- 处理 -->
                            {{ $t("anomalyDetails.handle") }}
                        </el-radio>
                        <el-radio :label="Number(2)">
                            <!-- 忽略 -->
                            {{ $t("anomalyDetails.processingStatusTest2") }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 处理意见 -->
                <el-form-item
                    :label="$t('anomalyDetails.handlingSuggestions')"
                    prop="handleDesc"
                >
                    <el-input
                        class="handleDescInput"
                        v-model="handleForm.handleDesc"
                        type="textarea"
                        :rows="4"
                        :cols="2"
                        :count="500"
                        :maxlength="500"
                        show-word-limit
                        clearable
                        :placeholder="$t('common.input')"
                    >
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleExit">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button type="primary" @click="handleSure">
                    <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import TimeUtil from "@/utils/time";
// import func from 'vue-editor-bridge';
export default {
    name: "faultSubsidiary",
    data() {
        let timeValite = (rule, value, callback) => {
            if (value && value.length) {
                if (value[1] - value[0] > 30 * 24 * 60 * 60 * 1000) {
                    // 时间跨度不得超过30天
                    callback(
                        new Error(this.$t("anomalyDetails.timeValiteText"))
                    );
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            query: "",
            title: "",
            dialogVisible: false,
            loading: false,
            alarmAnalyseTypeLists: [],
            searchForm: {
                alarmAnalyseTypeList: [],
                plateNum: "",
                handleState: "",
                anomalyTimeBegin: "",
                anomalyTimeEnd: "",
                time: [
                    new Date(
                        TimeUtil.getDate(new Date()) + " 00:00:00"
                    ).getTime(),
                    new Date(
                        TimeUtil.getDate(new Date()) + " 23:59:59"
                    ).getTime(),
                ],
                orderDir: "",
                orderColumn: "",
                orgId: "",
            },
            handleForm: {
                handleState: 1,
                handleDesc: "",
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
                shortcuts: [
                    {
                        // text: "最近3天",
                        text: this.$t("anomalyDetails.last3days"),
                        onClick(picker) {
                            const end = new Date(
                                new Date().setHours(0, 0, 0, 0) +
                                    24 * 60 * 60 * 1000 -
                                    1
                            ); //获取当天23:59:59的时间
                            const start = new Date(
                                new Date().setHours(0, 0, 0, 0)
                            ); //获取当天零点的时间
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 2
                            );
                            picker.$emit("pick", [start, end], true);
                        },
                    },
                    {
                        // text: "最近7天",
                        text: this.$t("anomalyDetails.last7days"),
                        onClick(picker) {
                            const end = new Date(
                                new Date().setHours(0, 0, 0, 0) +
                                    24 * 60 * 60 * 1000 -
                                    1
                            ); //获取当天23:59:59的时间
                            const start = new Date(
                                new Date().setHours(0, 0, 0, 0)
                            ); //获取当天零点的时间
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 6
                            );
                            picker.$emit("pick", [start, end], true);
                        },
                    },
                    {
                        // text: "最近30天",
                        text: this.$t("anomalyDetails.last30days"),
                        onClick(picker) {
                            const end = new Date(
                                new Date().setHours(0, 0, 0, 0) +
                                    24 * 60 * 60 * 1000 -
                                    1
                            ); //获取当天23:59:59的时间
                            const start = new Date(
                                new Date().setHours(0, 0, 0, 0)
                            ); //获取当天零点的时间
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 29
                            );
                            picker.$emit("pick", [start, end], true);
                        },
                    },
                ],
            },
            params: {
                pageSize: 20,
                currentPage: 1,
            },
            tableData: [],
            tableHeight: 500,
            treeArr: [],
            treeData: [],
            selectableList: [],
            selectableList2: [],
            plateArr: [],
            rules: {
                time: [{ validator: timeValite, trigger: "change" }],
            },
            handlerules: {
                handleState: {
                    required: true,
                    type: "number",
                    // message: "请选择处理状态",
                    message:
                        this.$t("common.select") +
                        this.$t("anomalyDetails.processingStatus"),
                    trigger: "blur",
                },
                handleDesc: {
                    required: true,
                    // message: "输入处理意见",
                    message:
                        this.$t("common.input") +
                        this.$t("anomalyDetails.handlingSuggestions"),
                    trigger: "blur",
                },
            },
            organizationName: "",
            treeData: [],
            expandedList: [],
            treeHeight: 500,
            buttonClick: false,
            iconShow: false,
        };
    },
    watch: {
        "searchForm.plateNum": {
            handler(val) {
                if (!val && this.query.length < 3) {
                    this.plateArr = [];
                }
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val.length < 3 && !this.searchForm.plateNum) {
                    this.plateArr = [];
                }
            },
            deep: true,
        },
        organizationName(val) {
            this.filterTree(this.treeData, val, 0);
            this.$nextTick(() => {
                this.$refs.tree.filter("show", !this.organizationName);
                if (!val) {
                    const nodes = this.$refs.tree.store._getAllNodes();
                    nodes.forEach((item) => {
                        if (item.data.id !== this.treeData[0].id) {
                            item.expanded = false;
                        }
                    });
                }
            });
        },
    },
    methods: {
        //对接接口的排序方法
        sortChange(column, prop, order) {
            this.searchForm.orderDir = !column.order
                ? ""
                : column.order === "ascending"
                ? "asc"
                : "desc";
            this.searchForm.orderColumn = !column.prop ? "" : "startTime";
            this.search();
        },
        //点击树
        handleNodeClick(data) {
            this.searchForm.orgId = data.id;
            this.params.currentPage = 1;
            this.$store.dispatch("SetDeviceFaultId", data.id);
            this.search();
        },
        //过滤树
        filterTree(data, val, type) {
            data.forEach((item) => {
                if (item.name.indexOf(val) !== -1) {
                    // item.show = true;
                    this.$set(item, "show", true);
                    this.itemChildren(item);
                } else {
                    this.$set(item, "show", false);
                    if (item.children && item.children.length > 0) {
                        this.filterTree(
                            item.children,
                            this.organizationName,
                            1
                        );
                    }
                }
            });
        },
        itemChildren(val) {
            if (val.children && val.children.length > 0) {
                val.children.forEach((item) => {
                    item.show = true;
                    if (item.children && item.children.length > 0) {
                        this.itemChildren(item);
                    }
                });
            }
        },
        filterNode(value, data) {
            return data[value];
        },
        //处理
        handleSure() {
            let param = {
                ids: this.selectableList2,
            };
            this.$refs.handleForm.validate((valid) => {
                if (valid) {
                    let params = Object.assign({}, param, this.handleForm);
                    this.$api.doHandleAnomaly(params).then((res) => {
                        if (res.success) {
                            // 处理成功
                            this.$message.success(
                                this.$t("anomalyDetails.processingSuccessful")
                            );
                            this.search();
                        } else {
                            this.$message.error(`${res.msg}`);
                        }
                        this.dialogVisible = false;
                    });
                }
            });
        },
        handleExit() {
            //this.selectableList = [];
            this.title = "";
            this.dialogVisible = false;
            this.$refs["handleForm"].clearValidate();
        },
        handleSelectionChange(selection) {
            this.selectableList = [];
            selection.forEach((item) => {
                this.selectableList.push(item.id);
            });
            // 处理
            this.title = `${this.$t("anomalyDetails.handle")}(${
                this.selectableList.length
            })`;
        },
        selectable(row, index) {
            return !row.handleState;
        },
        getPlateNumList(params) {
            this.loading = true;
            this.$api.getCarList(params).then((res) => {
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
        //获取当前异常名称
        getAlarmAnalyseTypeLists() {
            this.$api.getAlarmAnalyseTypeLists().then((res) => {
                if (res.success) {
                    this.alarmAnalyseTypeLists = res.data;
                } else {
                    this.$message.error(`${res.msg}`);
                }
            });
        },
        handleClick() {
            this.buttonClick = !this.buttonClick;
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchPagination.clientHeight -
                113;
            this.treeHeight = document.body.clientHeight - 150;
        },
        setWrap() {
            if (this.$refs.wrap.scrollHeight > 46) {
                this.iconShow = true;
            } else {
                this.iconShow = false;
            }
        },
        // 重置表单
        handleReset() {
            this.$refs["searchForm"].resetFields();
            // this.searchForm.anomalyTimeBegin = TimeUtil.getDateTime(this.searchForm.time[0]);
            // this.searchForm.anomalyTimeEnd = TimeUtil.getDateTime(this.searchForm.time[1]);
            this.searchForm.alarmAnalyseTypeList = [];
            //this.searchForm.time = [];
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
                    this.searchLoading = true;
                    // setTimeout(() => {
                    //设置延迟执行
                    this.getData();
                    // }, 250);
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
            this.searchForm.time = !this.searchForm.time
                ? [
                      new Date(
                          TimeUtil.getDate(new Date()) + " 00:00:00"
                      ).getTime(),
                      new Date(
                          TimeUtil.getDate(new Date()) + " 23:59:59"
                      ).getTime(),
                  ]
                : this.searchForm.time;
            this.searchForm.anomalyTimeBegin = TimeUtil.getDateTime(
                this.searchForm.time[0]
            );
            this.searchForm.anomalyTimeEnd = TimeUtil.getDateTime(
                this.searchForm.time[1]
            );
            let params = Object.assign({}, this.params, this.searchForm);
            this.$api
                .handleAnomalyDetailsPage(params)
                .then((res) => {
                    if (!this.searchLoading) {
                        this.searchLoading = true;
                    }
                    if (res.success == true) {
                        this.total = res.data.totalRecords;
                        if (res.data.results.length) {
                            res.data.results.forEach((item) => {
                                item["anomalyTime_"] = `${TimeUtil.getDateTime(
                                    item["startTime"]
                                )}~${TimeUtil.getDateTime(item["endTime"])}`;
                            });
                        }
                        this.tableData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableData;
                        this.searchLoading = false;
                        this.$nextTick(() => {
                            this.setTableHeight();
                        });
                    } else {
                        this.$message.error(res.msg);
                        this.searchLoading = false;
                    }
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        //批量处理
        doHandles() {
            // 处理
            this.title = `${this.$t("anomalyDetails.handle")}(${
                this.selectableList.length
            })`;
            this.selectableList2 = JSON.parse(
                JSON.stringify(this.selectableList)
            );
            this.dialogVisible = true;
            this.handleForm = {
                handleState: 1,
                handleDesc: "",
            };
        },
        //单个处理
        doHandle(item) {
            this.dialogVisible = true;
            this.selectableList2 = [item.id];
            // 处理
            this.title = this.$t("anomalyDetails.handle");
            this.handleForm = {
                handleState: 1,
                handleDesc: "",
            };
        },
        // 导出
        goExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                this.searchForm.anomalyTimeBegin = TimeUtil.getDateTime(
                    this.searchForm.time[0]
                );
                this.searchForm.anomalyTimeEnd = TimeUtil.getDateTime(
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
        //获取组织选项
        getFaultManagementOrgTree() {
            this.searchLoading = true;
            this.treeData = [];
            this.expandedList = [];
            this.$api.getOrgTree().then((res) => {
                this.setTableHeight();
                if (res.success == true) {
                    this.treeData = res.data;
                    if (res.data && res.data.length > 0) {
                        this.searchForm.orgId = this.$store.state.tree
                            .devicFaultId
                            ? this.$store.state.tree.devicFaultId
                            : res.data[0].id;
                        this.searchForm = this.$store.state.tree.searchForm
                            ? this.$store.state.tree.searchForm
                            : this.searchForm;
                        this.$nextTick(() => {
                            this.treeData.forEach((m) => {
                                this.expandedList.push(m.id);
                            });
                            this.$refs["tree"].setCurrentKey(
                                this.searchForm.orgId
                            );
                        });
                        this.setDeault();
                    }
                } else {
                    this.$message.error(res.msg);
                }
                this.searchLoading = false;
            });
        },
        // getOrgTree() {
        //     this.$api.getOrgTree().then(res => {
        //         if (res.success == true) {
        //             this.treeData = res.data
        //             this.treeDataToArr(res.data)
        //         }
        //     })
        // },
        // treeDataToArr(val,type){
        //     if(type){
        //         this.treeArr = [];
        //     }
        //     val.forEach(item =>{
        //         this.treeArr.push({
        //             id: item.id,
        //             name: item.name
        //         })
        //         if(item.children.length > 0){
        //             this.treeDataToArr(item.children,'')
        //         }
        //     })
        // },
        setDeault() {
            let anomalyDetailsCar = JSON.parse(
                sessionStorage.getItem("anomalyDetailsItem")
            );
            if (anomalyDetailsCar) {
                this.searchForm.plateNum = anomalyDetailsCar.plateNum;
                sessionStorage.removeItem("anomalyDetailsItem");
            }
            this.search();
        },
    },
    mounted() {
        this.setWrap();
        let that = this;
        window.onresize = () => {
            return (() => {
                that.setWrap();
                that.setTableHeight();
            })();
        };
    },
    created() {
        this.getAlarmAnalyseTypeLists();
        this.getFaultManagementOrgTree();
    },
};
</script>

<style scoped lang="less">
.handleDescInput {
    width: 100% !important;
}
.wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .flex {
            display: flex;
        }
        .el-form-item {
            margin-bottom: 14px !important;
        }
    }

    .hidden {
        height: 46px;
        overflow: hidden;
    }
    .wrap-bottom {
        border-top: 1px solid #e4e4e4;
    }
}
.searchBottom {
    margin-bottom: 8px;
}
.el-dialog__title {
    font-weight: 600 !important;
}
.handle-desc {
    display: inline-block;
    width: 140px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>
<style lang="less">
.handle-desc-title {
    max-width: 800px;
}
.alarmAnalyseTypeList {
    width: 250px !important;
    .el-input {
        width: 250px !important;
    }
}
</style>
