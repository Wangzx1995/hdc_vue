<template>
    <div class="loadingTask-detail">
        <div class="title">
            <!-- 基本信息 -->
            {{ $t("deviceLoadTaskManage.basicInformation") }}
        </div>
        <div class="normal-info">
            <el-form
                :model="form"
                label-position="top"
                :rules="formValidate"
                :gutter="20"
                ref="form"
                :inline="true"
            >
                <!-- 任务名称 -->
                <el-form-item
                    prop="taskName"
                    :label="$t('deviceLoadTaskManage.taskName')"
                >
                    <el-input
                        v-model="form.taskName"
                        :disabled="type == 'detail'"
                        clearable
                        :maxlength="200"
                    >
                    </el-input>
                </el-form-item>
                <!-- 企业 -->
                <el-form-item
                    prop="orgId"
                    :label="$t('deviceLoadTaskManage.enterprise')"
                    class="device-num"
                >
                    <TreeSelect
                        :placeholder="$t('common.select')"
                        :disableParentNode="true"
                        :treeData="treeData"
                        filter
                        :clearable="true"
                        v-model="form.orgId"
                        :props="defaultProps"
                        :disabled="type == 'detail'"
                        @node-click="nodeClick"
                    >
                    </TreeSelect>
                </el-form-item>
                <!-- 关联装车师傅账号 -->
                <el-form-item
                    prop="userIds"
                    :label="$t('deviceLoadTaskManage.AssociateMasterAccount')"
                    class="item"
                >
                    <el-select
                        style="width: 100%"
                        v-model="form.userIds"
                        :disabled="type == 'detail'"
                        multiple
                        filterable
                        clearable
                        collapse-tags
                        :placeholder="$t('common.select')"
                    >
                        <el-option
                            :value="item.id"
                            :label="`${item.name}(${item.nickName || '--'})`"
                            v-for="item in loadUsersList"
                            v-bind:key="item.index"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <!-- 配置激活码 -->
                <el-form-item
                    prop="deviceActiveCode"
                    :label="$t('deviceLoadTaskManage.configureActivationCode')"
                    class="item"
                >
                    <el-input
                        v-model="form.deviceActiveCode"
                        :disabled="type == 'detail'"
                        clearable
                        :maxlength="15"
                    >
                    </el-input>
                </el-form-item>
                <!-- 安装时间 -->
                <el-form-item
                    prop="timeRange"
                    :label="$t('deviceLoadTaskManage.installationTime')"
                    class="item"
                >
                    <el-date-picker
                        size="small"
                        v-model="timeRange"
                        :picker-options="pickerOptions"
                        :disabled="type == 'detail'"
                        type="daterange"
                        :start-placeholder="$t('common.startTime')"
                        :end-placeholder="$t('common.endTime')"
                        format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-form-item>

                <!-- 装车车辆数 -->
                <el-form-item
                    prop="carNum"
                    :label="$t('deviceLoadTaskManage.numberOfLoadedVehicles')"
                    class="item"
                >
                    <el-input
                        v-model="form.carNum"
                        :disabled="type == 'detail'"
                        clearable
                    >
                    </el-input>
                </el-form-item>
                <!-- 是否需要审核 -->
                <el-form-item
                    prop="needCheck"
                    :label="$t('deviceLoadTaskManage.necessaryReview')"
                    class="item"
                >
                    <span slot="label" class="label-slot">
                        <!-- 是否需要审核 -->
                        {{ $t("deviceLoadTaskManage.necessaryReview") }}
                        <!-- 不需要审核，在装车报告提交后将自动审核通过 -->
                        <el-tooltip
                            :content="
                                $t('deviceLoadTaskManage.necessaryReviewMsg')
                            "
                        >
                            <i class="el-icon-question"></i> </el-tooltip
                    ></span>
                    <el-radio-group v-model="form.needCheck">
                        <el-radio :label="0">
                            <!-- 不需要 -->
                            {{ $t("deviceLoadTaskManage.notNeed") }}
                        </el-radio>
                        <el-radio :label="1">
                            <!-- 需要 -->
                            {{ $t("deviceLoadTaskManage.need") }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <div class="title">
            <!-- 验收标准 -->
            {{ $t("deviceLoadTaskManage.acceptanceCriteria") }}
            <div v-if="type !== 'detail'">
                <el-button
                    v-if="isCheckAll"
                    type="text"
                    @click="sumCheckAll(1)"
                >
                    <!-- 全选 -->
                    {{ $t("common.selectAll") }}
                </el-button>
                <el-button v-else type="text" @click="sumCheckAll(0)">
                    <!-- 取消全选 -->
                    {{ $t("common.deselectAll") }}
                </el-button>
            </div>
        </div>
        <div class="table-box">
            <el-table
                :data="
                    standardTable.filter((item) => item.typeCode !== 'platform')
                "
                :span-method="arraySpanMethod"
                border
                style="width: 100%"
            >
                <!-- 分类 -->
                <el-table-column
                    prop="typeName"
                    :label="$t('deviceLoadTaskManage.classification')"
                    width="100"
                >
                    <template slot-scope="scope">
                        <div class="type-name">
                            <span>
                                {{ scope.row.typeName }}
                            </span>
                            <span
                                v-if="
                                    type !== 'detail' &&
                                    scope.row.typeCode !== 'video'
                                "
                            >
                                <el-button
                                    v-if="!scope.row.checkAll"
                                    type="text"
                                    @click="checkAll(scope.row, 1)"
                                >
                                    <!-- 全选 -->
                                    {{ $t("common.selectAll") }}
                                </el-button>
                                <el-button
                                    v-else
                                    type="text"
                                    @click="checkAll(scope.row, 0)"
                                >
                                    <!-- 取消全选 -->
                                    {{ $t("common.deselectAll") }}
                                </el-button>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <!-- 验收明细 -->
                <el-table-column
                    prop="itemName"
                    :label="$t('deviceLoadTaskManage.acceptanceDetails')"
                    width="150"
                >
                </el-table-column>
                <!-- 设置 -->
                <el-table-column :label="$t('deviceLoadTaskManage.setUp')">
                    <template slot-scope="scope">
                        <div
                            class="sub-content"
                            v-if="
                                scope.row.hasOwnProperty('num') ||
                                scope.row.hasOwnProperty('capacity') ||
                                scope.row.hasOwnProperty('content') ||
                                scope.row.hasOwnProperty('channelArr')
                            "
                        >
                            <div
                                v-if="scope.row.hasOwnProperty('num')"
                                class="sub-item"
                            >
                                <!-- 个数 -->
                                {{ $t("deviceLoadTaskManage.number") }}
                                ：<el-input-number
                                    size="mini"
                                    v-model="scope.row.num"
                                    :disabled="type == 'detail'"
                                    style="width: 120px"
                                    :min="0"
                                    :max="
                                        scope.row.itemName === '灾备存储'
                                            ? 1
                                            : 2
                                    "
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                scope.row.num = Number(
                                                    e.target.ariaValueMin
                                                );
                                            }
                                        }
                                    "
                                ></el-input-number
                                >个
                            </div>
                            <div
                                v-if="scope.row.hasOwnProperty('capacity')"
                                class="sub-item"
                            >
                                <!-- 容量 -->
                                {{ $t("deviceLoadTaskManage.capacity") }}
                                ：<el-input-number
                                    size="mini"
                                    v-model="scope.row.capacity"
                                    :disabled="type == 'detail'"
                                    style="width: 120px"
                                    :min="0"
                                    :max="9999"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                scope.row.capacity = Number(
                                                    e.target.ariaValueMin
                                                );
                                            }
                                        }
                                    "
                                ></el-input-number
                                >MB
                            </div>
                            <div v-if="scope.row.hasOwnProperty('content')">
                                <el-input
                                    v-model="scope.row.content"
                                    :disabled="type == 'detail'"
                                    style="width: 200px"
                                ></el-input>
                            </div>
                            <div v-if="scope.row.hasOwnProperty('channelArr')">
                                <el-form
                                    :model="scope.row"
                                    label-position="top"
                                    :rules="channelArrValidate"
                                    ref="channelArrForm"
                                >
                                    <el-form-item prop="channelArr" label="">
                                        <el-select
                                            v-model="scope.row.channelArr"
                                            v-if="type !== 'detail'"
                                            multiple
                                            style="width: 350px"
                                            multiple-nowrap
                                            :placeholder="$t('common.select')"
                                            class="p-r-md"
                                            :disabled="type == 'detail'"
                                        >
                                            <!-- 通道 -->
                                            <el-option
                                                v-for="itemx in channelList"
                                                :key="itemx"
                                                :label="`${$t(
                                                    'deviceLoadTaskManage.channel'
                                                )}${itemx}`"
                                                :value="itemx"
                                            >
                                            </el-option>
                                        </el-select>
                                        <span v-else
                                            ><span
                                                v-for="(itemx, index) in scope
                                                    .row.channelArr"
                                                v-bind:key="index"
                                            >
                                                <!-- 通道 -->
                                                {{
                                                    $t(
                                                        "deviceLoadTaskManage.channel"
                                                    )
                                                }}
                                                {{ itemx
                                                }}<span
                                                    v-if="
                                                        index <
                                                        scope.row.channelArr
                                                            .length -
                                                            1
                                                    "
                                                    >、</span
                                                ></span
                                            ></span
                                        >
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <div v-else>--</div>
                    </template>
                </el-table-column>
                <!-- 是否验收 -->
                <el-table-column
                    prop="itemName"
                    :label="$t('deviceLoadTaskManage.whetherAccept')"
                    width="80"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-checkbox
                            :true-label="1"
                            :false-label="0"
                            v-model="scope.row.isSelected"
                            :disabled="
                                scope.row.itemName.indexOf('必选') > -1 ||
                                type == 'detail'
                            "
                        ></el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
            <div class="line"></div>
            <el-table
                :data="
                    standardTable.filter((item) => item.typeCode === 'platform')
                "
                :span-method="arraySpanMethod"
                border
                style="width: 100%"
            >
                <!-- 分类 -->
                <el-table-column
                    prop="typeName"
                    :label="$t('deviceLoadTaskManage.classification')"
                    width="100"
                >
                    <template slot-scope="scope">
                        <div class="type-name">
                            <span>
                                {{ scope.row.typeName }}
                            </span>
                            <span v-if="type !== 'detail'">
                                <el-button
                                    v-if="!scope.row.checkAll"
                                    type="text"
                                    @click="checkAll(scope.row, 1)"
                                >
                                    <!-- 全选 -->
                                    {{ $t("common.selectAll") }}
                                </el-button>
                                <el-button
                                    v-else
                                    type="text"
                                    @click="checkAll(scope.row, 0)"
                                >
                                    <!-- 取消全选 -->
                                    {{ $t("common.deselectAll") }}
                                </el-button>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <!-- 验收明细 -->
                <el-table-column
                    prop="itemName"
                    :label="$t('deviceLoadTaskManage.acceptanceDetails')"
                    width="150"
                >
                </el-table-column>
                <!-- 设置 -->
                <el-table-column :label="$t('deviceLoadTaskManage.setUp')">
                    <template slot-scope="scope">
                        <div
                            class="sub-content"
                            v-if="
                                (scope.row.num !== null &&
                                    scope.row.num !== undefined) ||
                                (scope.row.capacity !== null &&
                                    scope.row.capacity !== undefined) ||
                                (scope.row.content !== null &&
                                    scope.row.content !== undefined) ||
                                (scope.row.channelArr !== null &&
                                    scope.row.channelArr !== undefined)
                            "
                        >
                            <div
                                v-if="
                                    scope.row.num !== null &&
                                    scope.row.num !== undefined
                                "
                                class="sub-item"
                            >
                                <!-- 个数 -->
                                {{ $t("deviceLoadTaskManage.number") }}
                                ：<el-input-number
                                    size="mini"
                                    v-model="scope.row.num"
                                    :disabled="type == 'detail'"
                                    style="width: 120px"
                                ></el-input-number>
                                <!-- 个 -->
                                {{ $t("deviceLoadTaskManage.individual") }}
                            </div>
                            <div
                                v-if="
                                    scope.row.capacity !== null &&
                                    scope.row.capacity !== undefined
                                "
                                class="sub-item"
                            >
                                <!-- 容量 -->
                                {{ $t("deviceLoadTaskManage.capacity") }}
                                ：<el-input
                                    v-model="scope.row.capacity"
                                    :disabled="type == 'detail'"
                                    style="width: 120px"
                                    @blur="handleValidateNumber"
                                ></el-input
                                >MB
                            </div>
                            <div
                                v-if="
                                    scope.row.content !== null &&
                                    scope.row.content !== undefined
                                "
                            >
                                <el-input
                                    v-model="scope.row.content"
                                    :disabled="type == 'detail'"
                                    style="width: 200px"
                                ></el-input>
                            </div>
                            <div
                                v-if="
                                    scope.row.channelArr !== null &&
                                    scope.row.channelArr !== undefined
                                "
                            >
                                <el-select
                                    v-model="scope.row.channelArr"
                                    v-if="type !== 'detail'"
                                    multiple
                                    style="width: 350px"
                                    multiple-nowrap
                                    :placeholder="$t('common.select')"
                                    class="p-r-md"
                                    :disabled="type == 'detail'"
                                >
                                    <el-option
                                        v-for="itemx in channelList"
                                        :key="itemx"
                                        :label="`${$t(
                                            'deviceLoadTaskManage.channel'
                                        )}${itemx}`"
                                        :value="itemx"
                                    >
                                    </el-option>
                                </el-select>
                                <span v-else
                                    ><span
                                        v-for="(itemx, index) in scope.row
                                            .channelArr"
                                        v-bind:key="index"
                                    >
                                        <!-- 通道 -->
                                        {{ $t("deviceLoadTaskManage.channel") }}
                                        {{ itemx
                                        }}<span
                                            v-if="
                                                index <
                                                scope.row.channelArr.length - 1
                                            "
                                            >、</span
                                        ></span
                                    ></span
                                >
                            </div>
                        </div>
                        <div v-else>--</div>
                    </template>
                </el-table-column>
                <!-- 是否验收 -->
                <el-table-column
                    prop="itemName"
                    :label="$t('deviceLoadTaskManage.whetherAccept')"
                    width="80"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-checkbox
                            :true-label="1"
                            :false-label="0"
                            v-model="scope.row.isSelected"
                            :disabled="type == 'detail'"
                        ></el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="footer">
            <div class="footer-btn">
                <el-button type="default" @click="goBack">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button
                    type="primary"
                    v-if="type == 'detail'"
                    @click="copy"
                    v-btn="'deviceLoadTaskManageAdd'"
                >
                    <!-- 复制 -->
                    {{ $t("common.copy") }}
                </el-button>
                <el-button
                    type="primary"
                    @click="save"
                    :loading="loadSubmit"
                    v-if="type !== 'detail'"
                >
                    <!-- 保存 -->
                    {{ $t("common.save") }}
                </el-button>
            </div>
        </div>
    </div>
</template>
<script>
//import Vue from "vue";
import Vue from "vue/dist/vue.esm.js";
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import TimeUtil from "@/utils/time";
import {
    validateSpecial,
    validateNum,
    validateNumberAndDecimals,
    validateEnglishNumber,
    checkEnglishNumberAll,
} from "@/utils/validate";
export default {
    components: {
        TreeSelect,
    },
    data() {
        const checkTaskName = (rule, value, callback) => {
            if (value != undefined && value.length > 0) {
                if (validateSpecial(value)) {
                    // 请勿输入字符
                    callback(
                        new Error(
                            this.$t("userManage.checkSpeccial") +
                                "：\\/:*?\"<|'&%>"
                        )
                    );
                } else {
                    callback();
                }
            } else {
                // 请输入任务名称
                callback(
                    new Error(this.$t("deviceLoadTaskManage.taskValidateMsg1"))
                );
            }
        };
        const checkCarNum = (rule, value, callback) => {
            if (value !== "" && value !== null && value !== undefined) {
                if (!validateNum(value)) {
                    // 请输入正确的整数
                    callback(
                        new Error(
                            this.$t("deviceLoadTaskManage.taskValidateMsg2")
                        )
                    );
                } else if (Number(value) > 100000) {
                    // 装车车辆数不能大于100000辆
                    callback(
                        new Error(
                            this.$t("deviceLoadTaskManage.taskValidateMsg3")
                        )
                    );
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        const checkDeviceActiveCode = (rule, value, callback) => {
            if (value !== "" && value !== null && value !== undefined) {
                if (value.length < 8) {
                    // 激活码长度需为8~15
                    callback(
                        new Error(
                            this.$t("deviceLoadTaskManage.taskValidateMsg4")
                        )
                    );
                } else if (value.length > 15) {
                    // 激活码长度需为8~15
                    callback(
                        new Error(
                            this.$t("deviceLoadTaskManage.taskValidateMsg4")
                        )
                    );
                } else if (!validateEnglishNumber(value)) {
                    // 激活码只限数字，大小写字母
                    callback(
                        new Error(
                            this.$t("deviceLoadTaskManage.taskValidateMsg5")
                        )
                    );
                } else if (checkEnglishNumberAll(value) != 3) {
                    // "激活码必须包含数字、大写字母、小写字母三种字符"
                    callback(
                        new Error(
                            this.$t("deviceLoadTaskManage.taskValidateMsg6")
                        )
                    );
                } else {
                    callback();
                }
            } else {
                // 请输入激活码
                callback(
                    new Error(this.$t("deviceLoadTaskManage.taskValidateMsg7"))
                );
            }
        };
        return {
            channelList: [1, 2, 3, 4, 5, 6, 7, 8], // 通道
            pickerOptions: {
                disabledDate(time) {
                    // 禁用以后的时间
                    return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                },
            },
            channelArrValidate: {
                channelArr: [
                    {
                        required: true,
                        // message: "请选择安装通道号",
                        message: this.$t(
                            "deviceLoadTaskManage.taskValidateMsg8"
                        ),
                        trigger: "change",
                    },
                ],
            },
            formValidate: {
                taskName: [
                    {
                        required: true,
                        validator: checkTaskName,
                        trigger: "blur",
                    },
                ],
                orgId: [
                    {
                        required: true,
                        // message: "请选择企业",
                        message: this.$t(
                            "deviceLoadTaskManage.taskValidateMsg9"
                        ),
                        type: "number",
                        trigger: "change",
                    },
                ],
                userIds: [
                    {
                        required: true,
                        // message: "请选择关联装车师傅账号",
                        message: this.$t(
                            "deviceLoadTaskManage.taskValidateMsg10"
                        ),
                        trigger: "blur",
                    },
                ],
                carNum: [
                    { validator: checkCarNum, type: "number", trigger: "blur" },
                ],
                deviceActiveCode: [
                    {
                        required: true,
                        validator: checkDeviceActiveCode,
                        trigger: "blur",
                    },
                ],
            },
            type: this.$route.query.type,
            taskId: this.$route.query.taskId,
            treeData: [],
            loadUsersList: [],
            defaultProps: {
                children: "children",
                label: "name",
            },
            form: {
                taskName: "",
                orgId: "",
                startTime: "",
                endTime: "",
                deviceActiveCode: "",
                carNum: "",
                taskStatus: "",
                needCheck: 0,
                userIds: [],
            },
            timeRange: [],
            loadSubmit: false,
            standardList: [],
            standardTable: [],
            projects: [],
            loading: false,
        };
    },
    watch: {
        timeRange: {
            handler(val) {
                if (val && val.length > 0) {
                    this.form.startTime = TimeUtil.getDateTime(
                        this.timeRange[0]
                    );
                    this.form.endTime = TimeUtil.getDateTime(this.timeRange[1]);
                } else {
                    this.form.startTime = "";
                    this.form.endTime = "";
                }
            },
            deep: true,
            immediate: true,
        },
        "form.orgId": {
            handler(val) {
                if (val !== "") {
                    this.$refs.form.clearValidate("orgId");
                }
            },
            deep: true,
            immediate: true,
        },
        standardTable: {
            handler(val) {
                let obj = {};
                val.forEach((item) => {
                    if (obj[item.type]) {
                        obj[item.type].push(item.isSelected);
                    } else {
                        obj[item.type] = [item.isSelected];
                    }
                });
                this.standardTable.forEach((item) => {
                    item.checkAll = obj[item.type].includes(0) ? false : true;
                    if (item.itemName.indexOf("必选") > -1) {
                        item.isSelected = 1;
                    }
                });
            },
            deep: true,
            immediate: true,
        },
    },
    computed: {
        isCheckAll() {
            return (
                this.standardTable.findIndex((v) => {
                    return v.isSelected === 0;
                }) > -1
            );
        },
    },
    methods: {
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (row.childrenIndex === 0) {
                    return {
                        rowspan: row.childrenLength,
                        colspan: 1,
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0,
                    };
                }
            }
        },
        // 获取组织树
        getOrgTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = res.data;
                    this.treeData[0].disabled = true;
                    if (this.type !== "add") {
                        this.getDetail();
                    } else {
                        this.getInstallCheckStandard();
                    }
                }
            });
        },
        // 获取装车工人列表
        getLoadUsersList(orgId, userIds) {
            this.$api.getLoadUsers({ orgId: orgId }).then((res) => {
                if (res.success == true) {
                    this.loadUsersList = [...res.data];
                    this.$nextTick(() => {
                        if (userIds && userIds.length) {
                            let newArr = [];
                            userIds.forEach((i) => {
                                if (
                                    this.loadUsersList.find(
                                        (item) => item.id === i
                                    )
                                ) {
                                    newArr.push(
                                        this.loadUsersList.find(
                                            (item) => item.id === i
                                        ).id
                                    );
                                }
                            });
                            this.form.userIds = newArr;
                        }
                    });
                }
            });
        },
        goBack() {
            this.$router.push("/manageCenter/deviceLoadTaskManage");
        },
        getNewStandardList() {
            let newList = [];
            this.standardTable.forEach((item) => {
                let index = newList.findIndex((v) => {
                    return v.type == item.type;
                });
                let children = JSON.parse(JSON.stringify(item));
                delete children.type;
                delete children.typeCode;
                delete children.typeName;
                delete children.childrenLength;
                delete children.childrenIndex;
                if (index > -1) {
                    newList[index].installCheckStandardList.push(children);
                } else {
                    newList.push({
                        type: item.type,
                        typeCode: item.typeCode,
                        typeName: item.typeName,
                        installCheckStandardList: [children],
                    });
                }
            });
            return newList;
        },
        save() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$refs.channelArrForm.validate((valid2) => {
                        if (valid2 || !this.form.needCheck) {
                            let flag = false;
                            let flag2 = false;
                            this.standardList = this.getNewStandardList();
                            this.standardList.map((i) => {
                                if (i.typeCode == "storage") {
                                    i.installCheckStandardList.map((j) => {
                                        const value = j.capacity;
                                        if (
                                            value !== "" &&
                                            value !== null &&
                                            value !== undefined &&
                                            !validateNumberAndDecimals(value)
                                        ) {
                                            flag = true;
                                        }
                                    });
                                }
                                if (i.typeCode == "video") {
                                    i.installCheckStandardList.map((j) => {
                                        if (j.itemCode === "channelArr") {
                                            flag2 = !j.channelArr.length;
                                        }
                                    });
                                }
                            });
                            if (flag) {
                                // "请验证存储容量是否输入合法的数字！"
                                this.$message.warning(
                                    this.$t(
                                        "deviceLoadTaskManage.taskValidateMsg11"
                                    )
                                );
                                return;
                            }
                            if (flag2 && this.form.needCheck) {
                                // "请选择视频安装通道号！"
                                this.$message.warning(
                                    this.$t(
                                        "deviceLoadTaskManage.taskValidateMsg12"
                                    )
                                );
                                return;
                            }
                            this.loadSubmit = true;
                            const param = {
                                ...this.form,
                                installCheckSettings: this.standardList,
                            };
                            param.userIds = param.userIds.filter(
                                (i) => i !== 0
                            );
                            if (this.type == "edit") {
                                param.id = Number(this.taskId);
                            }
                            this.$api[
                                this.type == "edit"
                                    ? "deviceLoadTaskUpdate"
                                    : "deviceLoadTaskAdd"
                            ](param)
                                .then((res) => {
                                    if (res.success == true) {
                                        this.$message.success(
                                            `${
                                                this.type == "edit"
                                                    ? this.$t(
                                                          "deviceLoadTaskManage.taskValidateMsg13"
                                                      )
                                                    : this.$t(
                                                          "deviceLoadTaskManage.taskValidateMsg14"
                                                      )
                                            }！`
                                        );
                                        this.loadSubmit = false;
                                        this.$router.push(
                                            "/manageCenter/deviceLoadTaskManage"
                                        );
                                    } else {
                                        this.loadSubmit = false;
                                        this.$message.error(res.msg);
                                    }
                                })
                                .catch(() => {
                                    this.loadSubmit = false;
                                });
                        } else {
                            return false;
                        }
                    });
                }
            });
        },
        // 查询安装审核验收项
        getInstallCheckStandard() {
            this.$api.getAllCheckList().then((res) => {
                if (res.success == true) {
                    this.standardList = res.data;
                    this.standardList.map((i) => {
                        i.isAll = false;
                        i.isActive = false;
                    });
                    res.data.forEach((item) => {
                        item.installCheckStandardList.forEach((k, index) => {
                            this.standardTable.push({
                                checkAll: false,
                                type: item.type,
                                typeCode: item.typeCode,
                                typeName: item.typeName,
                                childrenLength:
                                    item.installCheckStandardList.length,
                                childrenIndex: index,
                                ...k,
                            });
                        });
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        getDetail() {
            this.$api
                .getDeviceLoadTaskDetails({ taskId: this.taskId })
                .then((res) => {
                    if (res.success == true) {
                        // 安装检测项
                        this.standardList = res.data.installCheckSettings;
                        res.data.installCheckSettings.forEach((item) => {
                            item.installCheckStandardList.forEach(
                                (k, index) => {
                                    this.standardTable.push({
                                        checkAll: false,
                                        type: item.type,
                                        typeCode: item.typeCode,
                                        typeName: item.typeName,
                                        childrenLength:
                                            item.installCheckStandardList
                                                .length,
                                        childrenIndex: index,
                                        ...k,
                                    });
                                }
                            );
                        });
                        this.form = {
                            taskName: res.data.taskName,
                            orgId: res.data.orgId,
                            startTime: res.data.startTime,
                            endTime: res.data.endTime,
                            deviceActiveCode: res.data.deviceActiveCode,
                            carNum: res.data.carNum,
                            needCheck: res.data.needCheck,
                            userIds: [],
                            taskStatus: Number(res.data.taskStatus),
                        };
                        this.getLoadUsersList(res.data.orgId, res.data.userIds);
                        if (res.data.startTime && res.data.endTime) {
                            this.timeRange.push(res.data.startTime);
                            this.timeRange.push(res.data.endTime);
                        }
                        if (this.$route.query.flag) {
                            this.copy();
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        checkAll(row, flag) {
            this.standardTable.map((item) => {
                if (item.type === row.type) {
                    item.isSelected = flag;
                    item.checkAll = flag;
                }
                if (item.itemName.indexOf("必选") > -1) {
                    item.isSelected = 1;
                }
            });
        },
        sumCheckAll(flag) {
            this.standardTable.map((item) => {
                item.isSelected = flag;
            });
        },
        copy() {
            this.type = "add";
            this.timeRange = [];
            this.loadUsersList = [];
            this.form = {
                ...{
                    taskName: "",
                    orgId: "",
                    startTime: "",
                    endTime: "",
                    deviceActiveCode: "",
                    carNum: "",
                    needCheck: 0,
                    userIds: [],
                },
                ...{
                    deviceActiveCode: this.form.deviceActiveCode,
                },
            };
        },
        nodeClick(data, node) {
            this.form.userIds = [];
            this.loadUsersList = [];
            this.getLoadUsersList(data.id);
        },
    },
    mounted() {
        this.getOrgTree();
        if (this.type === "add") {
            this.$route.meta.title = this.$t("deviceLoadTaskManage.metaTitle1"); //"新增任务";
        } else if (this.type === "edit") {
            this.$route.meta.title = this.$t("deviceLoadTaskManage.metaTitle2"); //"编辑任务";
        } else {
            this.$route.meta.title = this.$t("deviceLoadTaskManage.metaTitle3"); //"任务详情";
        }
    },
    destroyed() {
        this.$route.meta.title = undefined;
    },
};
</script>
<style lang="less">
.loadingTask-detail {
    padding: 0 40px;
    position: relative;
    overflow-y: auto;
    .el-form-item {
        min-width: 360px;
    }
    .title {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
        &::before {
            content: "";
            width: 2px;
            height: 16px;
            margin-right: 6px;
            color: rgba(0, 0, 0, 0.8);
            background: rgba(0, 0, 0, 0.8);
            display: inline-block;
        }
        .el-button--text {
            color: #409eff;
            font-size: 14px;
            font-weight: bold;
        }
    }
    .acceptance-standard {
        .standard-item {
            .top {
                background: rgba(0, 0, 0, 0.03);
                height: 54px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                // border-top: 1px solid rgba(0, 0, 0, 0.06);
                .left {
                    cursor: pointer;
                    display: flex;
                    flex: 1;
                    flex-direction: row;
                    align-items: center;
                    margin-left: -30px;
                    .collapse-item__arrow {
                        margin-right: 4px;
                        font-size: 24px;
                        font-weight: 300;
                        transition: transform 0.3s;
                    }
                    .collapse-item__arrow.is-active {
                        transform: rotate(90deg);
                    }
                }
                .title-name,
                .el-button--text {
                    font-size: 14px;
                    color: rgba(0, 0, 0, 0.85);
                    font-weight: 600;
                }
            }
            .middle {
                height: 54px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.65);
                font-weight: 400;
                background: #ffffff;
                border-top: 1px solid rgba(0, 0, 0, 0.06);
                .sub-content {
                    display: flex;
                    flex-direction: row;
                    flex: 1;
                    align-items: center;
                    .sub-title {
                        width: 10vw;
                        white-space: normal;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .sub-item {
                        width: 10vw;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        .el-input,
                        .el-input-number {
                            margin-right: 8px;
                            .el-input__inner {
                                text-align: center !important;
                            }
                        }
                    }
                    .sub-read {
                        width: 10vw;
                        white-space: normal;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .sub-note {
                        width: 68vw;
                        white-space: normal;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }
    .footer {
        width: 100%;
        height: 4rem;
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        position: fixed;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        background: #ffffff;
        left: 0;
        z-index: 9;
        .footer-btn {
            padding-right: 28px;
        }
    }
}
.sub-content {
    display: flex;
    flex-direction: row;
    flex: 1;
    align-items: center;
    .sub-title {
        width: 192px;
        white-space: normal;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .sub-item {
        width: 192px;
        display: flex;
        flex-direction: row;
        align-items: center;
        .el-input,
        .el-input-number {
            margin-right: 8px;
            .el-input__inner {
                text-align: center !important;
            }
        }
    }
    .sub-read {
        width: 192px;
        white-space: normal;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .sub-note {
        width: 350px;
        white-space: normal;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
.table-box {
    padding-bottom: 4rem !important;
}
@media screen and (max-width: 1450px) {
    .table-box {
        & > .line {
            display: none;
        }
    }
}

@media screen and (min-width: 1451px) {
    .table-box {
        display: flex;
        justify-content: space-between;
        & > .line {
            width: 96px;
        }
    }
}
.type-name {
    display: flex;
    flex-direction: column;
    .el-button--text {
        color: #409eff;
        font-size: 14px;
        font-weight: bold;
    }
}
</style>
