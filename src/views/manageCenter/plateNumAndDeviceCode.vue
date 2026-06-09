<template>
    <div class="top main-content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 设备序列号异常 -->
            <el-tab-pane
                :label="
                    $t('plateNumAndDeviceCode.deviceSerialNumAbnormal') +
                    '(' +
                    this.deviceCodeNum +
                    ')'
                "
                name="first"
            ></el-tab-pane>
            <!-- 车牌号异常 -->
            <el-tab-pane
                :label="
                    $t('plateNumAndDeviceCode.plateNumAbnormal') +
                    '(' +
                    this.plateNum +
                    ')'
                "
                name="second"
            ></el-tab-pane>
            <!-- 异常修改记录 -->
            <el-tab-pane
                :label="$t('plateNumAndDeviceCode.abnormalModificationRecord')"
                name="third"
            ></el-tab-pane>
        </el-tabs>
        <!-- 搜索条件区域 -->
        <div>
            <div class="top-left">
                <el-form ref="form" :model="form" inline>
                    <!-- 类型 -->
                    <el-form-item
                        :label="$t('plateNumAndDeviceCode.type')"
                        v-if="activeName == 'third'"
                        prop="type"
                    >
                        <el-select
                            v-model="form.type"
                            :placeholder="$t('common.select')"
                            clearable
                        >
                            <el-option
                                :label="$t('common.all')"
                                :value="3"
                            ></el-option>
                            <!-- 设备序列号 -->
                            <el-option
                                :label="$t('common.deviceSerialNum')"
                                :value="1"
                            ></el-option>
                            <!-- 车牌号 -->
                            <el-option
                                :label="$t('common.plateNum')"
                                :value="2"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 车牌号 -->
                    <el-form-item
                        :label="$t('common.plateNum')"
                        v-if="activeName != 'first' && form.type == 2"
                        prop="plateNum"
                    >
                        <el-input
                            v-model="form.plateNum"
                            :placeholder="$t('common.input')"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <!-- 车牌号/设备序列号 -->
                    <el-form-item
                        :label="
                            $t('plateNumAndDeviceCode.plateNumSerialNumber')
                        "
                        v-if="activeName == 'third' && form.type == 3"
                        prop="plateNum"
                    >
                        <el-input
                            v-model="form.plateNum"
                            :placeholder="$t('common.input')"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <!-- 设备序列号 -->
                    <el-form-item
                        :label="$t('common.deviceSerialNum')"
                        v-if="activeName != 'second' && form.type == 1"
                        prop="deviceCode"
                    >
                        <el-input
                            v-model="form.deviceCode"
                            :placeholder="$t('common.input')"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <!-- 组织 -->
                    <el-form-item
                        :label="$t('common.organization')"
                        prop="organizationSigns"
                    >
                        <el-select
                            v-model="form.organizationSigns"
                            :placeholder="$t('common.select')"
                            filterable
                            multiple
                            collapse-tags
                            clearable
                            hover
                            @click="orgSelect()"
                            style="width: 320px"
                        >
                            <el-option
                                v-for="item in treeArr"
                                :key="item.id"
                                :value="item.id"
                                :label="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div class="top-right">
                <el-button
                    type="primary"
                    @click="
                        params.currentPage = 1;
                        search();
                    "
                    :loading="loadingTable"
                >
                     
                    <!-- 查询 -->
                    {{ $t("common.search") }}
                </el-button>
                <el-button type="default" @click="handleReset('form')">
                     <!-- 清除条件 -->
                    {{ $t("common.reset") }}
                </el-button>
            </div>
        </div>
        <!-- 导出 -->
        <div class="top-bottom">
            <el-button
                type="primary"
                v-if="activeName == 'first'"
                @click="batchDevice()"
                v-btn="'plateNumAndDeviceCodeDealSerial'"
            >
                <!-- 使用设备端 -->
                {{ $t("plateNumAndDeviceCode.usingDeviceEnd") }}
            </el-button>
            <!-- :title="'设备端车牌号为空或者长度大于20，不允许批量使用设备端修改'" -->
            <el-button
                type="primary"
                v-if="activeName == 'second'"
                @click="batchDevice()"
                :icon="'el-icon-warning'"
                :title="$t('plateNumAndDeviceCode.usingDeviceEndMsg')"
                v-btn="'plateNumAndDeviceCodeDealCarNum'"
            >
                <!-- 使用设备端 -->
                {{ $t("plateNumAndDeviceCode.usingDeviceEnd") }}
            </el-button>
            <el-button
                v-if="activeName == 'first' || activeName == 'second'"
                @click="goExport"
                :loading="loadingAll"
                :disabled="loadingAll"
                v-btn="'plateNumAndDeviceCodeExport'"
            >
                <!-- 导出 -->
                {{ $t("common.export") }}
            </el-button>
            <!-- 批量失败重发 -->

            <!-- <el-button
                type="primary"
                v-if="activeName == 'third'"
                @click="batchFailedIssue()"
            >
                {{ $t("plateNumAndDeviceCode.batchFailedIssue") }}
            </el-button> -->
            <!-- 批量终止下发 -->
            <!-- <el-button
                type="primary"
                v-if="activeName == 'third'"
                @click="batchTerminationDistribution()"
            >
                {{ $t("plateNumAndDeviceCode.batchTerminationDistribution") }}
            </el-button> -->
        </div>
        <!-- table表 -->
        <div>
            <el-table
                :data="tableDataFirst"
                border
                stripe
                row-key="id"
                key="first"
                style="width: 100%"
                v-if="activeName == 'first'"
                :loading="loadingTable"
                :height="tableHeight"
                @selection-change="handleSelect"
                @sort-change="sortChange"
            >
                <el-table-column
                    type="selection"
                    :reserve-selection="true"
                ></el-table-column>
                <!-- 平台端车牌号 -->
                <el-table-column
                    prop="plateNum"
                    :label="
                        $t('plateNumAndDeviceCode.platformSide') +
                        $t('common.plateNum')
                    "
                    width="140px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 平台端设备序列号 -->
                <el-table-column
                    prop="platformValue"
                    :label="
                        $t('plateNumAndDeviceCode.platformSide') +
                        $t('common.deviceSerialNum')
                    "
                    width="140px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 设备端设备序列号 -->
                <el-table-column
                    prop="deviceValue"
                    :label="
                        $t('plateNumAndDeviceCode.deviceEnd') +
                        $t('common.deviceSerialNum')
                    "
                    width="140px"
                ></el-table-column>
                <!-- 参数获取时间 -->
                <el-table-column
                    prop="acquisitionTime"
                    sortable
                    :label="$t('plateNumAndDeviceCode.acquisitionTime')"
                    width="170px"
                >
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.acquisitionTime | formatTime
                        }}</span>
                    </template>
                </el-table-column>
                <!-- 所属组织 -->
                <el-table-column
                    prop="organizationSignName"
                    :label="$t('common.orgPath')"
                    min-width="240px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 操作 -->
                <el-table-column
                    prop="operation"
                    :label="$t('common.operate')"
                    min-width="120px"
                >
                    <template slot-scope="scope">
                        <a
                            @click="
                                modifyVal(scope.row, 2);
                                oneDeviceCodeVisible = true;
                            "
                            v-btn="'plateNumAndDeviceCodeDealSerial'"
                        >
                            <!-- 使用设备端 -->
                            {{ $t("plateNumAndDeviceCode.usingDeviceEnd") }}
                        </a>
                    </template>
                </el-table-column>
            </el-table>
            <el-table
                :data="tableDataSecond"
                key="second"
                border
                stripe
                style="width: 100%"
                :height="tableHeight"
                :loading="loadingTable"
                @selection-change="handleSelect"
                @sort-change="sortChangeSecond"
                v-else-if="activeName == 'second'"
                row-key="id"
            >
                <el-table-column
                    type="selection"
                    :reserve-selection="true"
                    :selectable="selectable"
                ></el-table-column>
                <!-- 平台端车牌号 -->
                <el-table-column
                    prop="platformValue"
                    :label="
                        $t('plateNumAndDeviceCode.platformSide') +
                        $t('common.plateNum')
                    "
                    width="140px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 设备端车牌号 -->
                <el-table-column
                    prop="deviceValue"
                    :label="
                        $t('plateNumAndDeviceCode.deviceEnd') +
                        $t('common.plateNum')
                    "
                    show-overflow-tooltip
                    width="140px"
                    :render-header="
                        (h) => {
                            return h('span', { class: 'poptip' }, [
                                h(
                                    'span',
                                    $t('plateNumAndDeviceCode.deviceEnd') +
                                        $t('common.plateNum')
                                ), //表格当前列标题
                                h('Poptip', {
                                    props: {
                                        placement: 'top',
                                        width: '80px',
                                        trigger: 'hover',
                                        offset: 2,
                                        transfer: true,
                                    },
                                    style: {
                                        'font-weight': '400',
                                    },
                                }),
                            ]);
                        }
                    "
                ></el-table-column>
                <!-- 参数获取时间 -->
                <el-table-column
                    prop="acquisitionTime"
                    sortable
                    :label="$t('plateNumAndDeviceCode.acquisitionTime')"
                    width="170px"
                >
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.acquisitionTime | formatTime
                        }}</span>
                    </template>
                </el-table-column>
                <!-- 所属组织 -->
                <el-table-column
                    prop="organizationSignName"
                    :label="$t('common.orgPath')"
                    min-width="240px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 操作 -->
                <el-table-column
                    prop="operation"
                    :label="$t('common.operate')"
                    min-width="240px"
                >
                    <template slot-scope="scope">
                        <a
                            @click="
                                modifyVal(scope.row, 1);
                                oneDeviceCodeVisible = true;
                            "
                            v-btn="'plateNumAndDeviceCodeDealCarNum'"
                        >
                            <!-- 使用平台端 -->
                            {{ $t("plateNumAndDeviceCode.UsingPlatformSide") }}
                        </a>
                        &nbsp;&nbsp;&nbsp;
                        <a
                            @click="
                                modifyVal(scope.row, 2);
                                oneDeviceCodeVisible = true;
                            "
                            v-btn="'plateNumAndDeviceCodeDealCarNum'"
                        >
                            <!-- 使用设备端 -->
                            {{ $t("plateNumAndDeviceCode.usingDeviceEnd") }}
                        </a>
                    </template>
                </el-table-column>
            </el-table>
            <el-table
                v-else
                :data="tableDataThird"
                key="third"
                border
                stripe
                style="width: 100%"
                :loading="loadingTable"
                @sort-change="sortChangeThird"
                :height="tableHeight"
            >
                <!-- 类型 -->
                <el-table-column
                    prop="type"
                    :label="$t('plateNumAndDeviceCode.type')"
                    width="120px"
                    fixed="left"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.type == 1">
                            <!-- 设备序列号 -->
                            {{ $t("common.deviceSerialNum") }}
                        </span>
                        <span v-else-if="scope.row.type == 2">
                            <!-- 车牌号 -->
                            {{ $t("common.plateNum") }}
                        </span>
                    </template>
                </el-table-column>
                <!-- 修改项 -->
                <el-table-column
                    prop="modifyItem"
                    :label="$t('plateNumAndDeviceCode.modified')"
                    min-width="140px"
                    show-overflow-tooltip
                    fixed="left"
                ></el-table-column>
                <!-- 使用项 -->
                <el-table-column
                    prop="useItem"
                    :label="$t('plateNumAndDeviceCode.usageItems')"
                    min-width="140px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 所属组织 -->
                <el-table-column
                    prop="organizationSignName"
                    :label="$t('common.orgPath')"
                    min-width="240px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 操作人员 -->
                <el-table-column
                    prop="operatorName"
                    :label="$t('operationLog.operator')"
                    width="100px"
                ></el-table-column>
                <!-- 修改时间 -->
                <el-table-column
                    prop="updateTime"
                    :label="$t('plateNumAndDeviceCode.changeTime')"
                    sortable
                    width="170px"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.updateTime | formatTime }}</span>
                    </template>
                </el-table-column>
                <!-- 最近定位上报时间 -->
                <!-- <el-table-column
                    prop="latestLocationReportingTime"
                    :label="
                        $t('plateNumAndDeviceCode.latestLocationReportingTime')
                    "
                    width="170px"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.latestLocationReportingTime">
                            {{
                                scope.row.latestLocationReportingTime
                                    | formatTime
                            }}
                        </span>
                        <span v-else> --</span>
                    </template>
                </el-table-column> -->
                <!-- 修改状态 -->
                <el-table-column
                    prop="updateResult"
                    :label="$t('plateNumAndDeviceCode.changeResult')"
                    width="140px"
                    fixed="right"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.updateResult == 1" class="green"
                            >●</span
                        >
                        <span
                            v-else-if="scope.row.updateResult == 2"
                            class="red"
                            >●</span
                        >
                        <span
                            v-else-if="scope.row.updateResult == 3"
                            class="grey"
                            >●</span
                        >
                        <span v-if="scope.row.updateResult == 1">
                            <!-- 成功 -->
                            {{ $t("plateNumAndDeviceCode.updateResultText1") }}
                        </span>
                        <span v-else-if="scope.row.updateResult == 2">
                            <!-- 失败 -->
                            {{ $t("plateNumAndDeviceCode.updateResultText2") }}
                        </span>
                        <span v-else-if="scope.row.updateResult == 3">
                            <!-- 处理中 -->
                            {{ $t("plateNumAndDeviceCode.updateResultText3") }}
                        </span>
                        <span v-else-if="scope.row.updateResult == 0">
                            <!-- 未处理 -->
                            {{ $t("plateNumAndDeviceCode.updateResultText4") }}
                        </span>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    fixed="right"
                    prop="deviceStatus"
                    label="设备状态"
                    min-width="120px"
                    :render-header="renderHeader"
                >
                    <template slot-scope="scope">
                        <el-tag
                            type="success"
                            v-if="scope.row.deviceStatus === 1"
                        >
                            {{ $t("common.deviceStatus_1") }}
                        </el-tag>
                        <el-tag
                            type="warning"
                            v-else-if="
                                scope.row.deviceStatus === 2 &&
                                scope.row.dormantStatus == 2
                            "
                        >
                            {{ $t("common.deviceStatus_2") }}
                        </el-tag>
                        <span
                            class="littleYellow"
                            v-else-if="
                                scope.row.deviceStatus === 2 &&
                                scope.row.dormantStatus != 2
                            "
                        >
                            {{ $t("common.deviceStatus_2") }}
                        </span>
                        <el-tag
                            type="info"
                            v-else-if="scope.row.deviceStatus === 0"
                        >
                            {{ $t("common.deviceStatus_0") }}
                        </el-tag>
                        <span v-else>--</span>
                    </template>
                </el-table-column> -->
                <!-- 失败原因 -->
                <!-- <el-table-column
                    prop="errmsg"
                    :label="$t('deviceLoadReportVerify.activeCodeErrorMessage')"
                    min-width="140px"
                    show-overflow-tooltip
                    fixed="right"
                ></el-table-column> -->
                <!-- 操作 -->
                <el-table-column
                    prop="operation"
                    :label="$t('common.operate')"
                    min-width="140px"
                    fixed="right"
                >
                    <template slot-scope="scope">
                        <a
                            v-if="
                                scope.row.updateResult == 0 ||
                                scope.row.updateResult == 2
                            "
                            @click="
                                oneDeviceCodeVisible = true;
                                modifyVal(scope.row, scope.row.useValue);
                            "
                        >
                            <!-- 失败重发 -->
                            {{ $t("plateNumAndDeviceCode.reSpin") }}
                        </a>
                        <a
                            v-if="scope.row.updateResult == 3"
                            @click="
                                oneDeviceCodeVisible = true;
                                modifyVal(scope.row, scope.row.useValue);
                            "
                        >
                            <!-- 终止下发 -->
                            {{
                                $t(
                                    "plateNumAndDeviceCode.terminationDistribution"
                                )
                            }}
                        </a>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="params.currentPage"
                :page-sizes="[20, 50, 100]"
                :page-size="params.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>
        <!-- 批量使用设备端 -->
        <el-dialog
            :visible.sync="batchDeviceVisible"
            :title="$t('common.prompt')"
        >
            <span>
                <!-- 此操作将会使选中的设备端 -->
                {{ $t("plateNumAndDeviceCode.batchDeviceTest1") }}
                {{
                    activeName == "first"
                        ? $t("common.deviceSerialNum")
                        : $t("common.plateNum")
                }}

                <!-- 更新至平台，共计 -->
                {{ $t("plateNumAndDeviceCode.batchDeviceTest2") }}
                <span class="numColor">{{ this.ids.length }}</span>

                <!-- 个，是否确认修改 -->
                {{ $t("plateNumAndDeviceCode.batchDeviceTest3") }}
                ？</span
            >
            <span slot="footer" class="dialog-footer">
                <el-button @click="batchDeviceVisible = false">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button
                    type="primary"
                    @click="
                        batchDeviceVisible = false;
                        batchUpdateDataAbnormal();
                    "
                >
                     <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </span>
        </el-dialog>
        <!--操作-使用设备端/使用平台端 -->
        <el-dialog
            :visible.sync="oneDeviceCodeVisible"
            :title="$t('common.prompt')"
        >
            <div class="span-box">
                <span v-if="activeName == 'first'">
                    <!-- 确定使用设备端设备序列号 -->
                    {{ $t("plateNumAndDeviceCode.oneDeviceCodeTest1") }}
                    ：{{ this.tipDeviceCode }}

                    <!-- 吗？此操作将会使设备端设备序列号更新至平台 -->
                    {{ $t("plateNumAndDeviceCode.oneDeviceCodeTest2") }}
                    。</span
                >
                <span v-if="activeName == 'second' && this.tip.useValue == 2">
                    <!-- 确定使用设备端车牌号 -->
                    {{ $t("plateNumAndDeviceCode.oneDeviceCodeTest3") }}
                    ：<span>{{ this.tipDevicePlateNum }}</span>
                    <!-- 吗？此操作将会使设备端车牌号更新至平台 -->
                    {{ $t("plateNumAndDeviceCode.oneDeviceCodeTest4") }}
                    。</span
                >
                <span v-if="activeName == 'second' && this.tip.useValue == 1">
                    <!-- 确定使用平台端车牌号 -->
                    {{ $t("plateNumAndDeviceCode.oneDeviceCodeTest5") }}
                    ：{{ this.tipPlatformPlateNum }}
                    <!-- 吗？此操作将会使平台端车牌号更新至设备 -->
                    {{ $t("plateNumAndDeviceCode.oneDeviceCodeTest6") }}
                    。</span
                >
                <span v-if="activeName == 'third'">
                    <!-- 确定使用 -->
                    {{ $t("plateNumAndDeviceCode.oneDeviceCodeTest7") }}
                    {{
                        this.tip.useValue == 1
                            ? $t("plateNumAndDeviceCode.platformSide")
                            : $t("plateNumAndDeviceCode.deviceEnd")
                    }}{{
                        this.tipType == 1
                            ? $t("common.deviceSerialNum")
                            : $t("common.plateNum")
                    }}：{{ this.useItem }}
                    <!-- 吗？此操作将会使平台端车牌号更新至设备 -->
                    {{ $t("plateNumAndDeviceCode.oneDeviceCodeTest8") }}
                    。</span
                >
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="oneDeviceCodeVisible = false">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button
                    type="primary"
                    @click="
                        oneDeviceCodeVisible = false;
                        oneUpdateDataAbnormal();
                    "
                >
                     <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </span>
        </el-dialog>
        <el-dialog
            :title="`${
                activeName == 'first'
                    ? $t('plateNumAndDeviceCode.deviceSerialNumAbnormal')
                    : $t('plateNumAndDeviceCode.plateNumAbnormal')
            }（${gridData.length}）`"
            :visible.sync="dialogTableVisible"
            :width="'900px'"
        >
            <el-table :data="gridData" :height="400">
                <!-- 平台端设备序列号 -->
                <el-table-column
                    property="platformValue"
                    :label="
                        $t('plateNumAndDeviceCode.platformSide') +
                        $t('common.deviceSerialNum')
                    "
                ></el-table-column>
                <!-- 设备端设备序列号 -->
                <el-table-column
                    prop="deviceValue"
                    :label="
                        $t('plateNumAndDeviceCode.deviceEnd') +
                        $t('common.deviceSerialNum')
                    "
                ></el-table-column>
                <!-- 失败原因 -->
                <el-table-column
                    property="result"
                    :label="$t('plateNumAndDeviceCode.failureReason')"
                ></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "plateNumAndDeviceCode",
    data() {
        return {
            dialogTableVisible: false,
            gridData: [],
            defaultSortThird: {
                prop: "updateTime",
                order: "descending",
            },
            defaultSort: {
                prop: "acquisitionTime",
                order: "descending",
            },
            oneDeviceCodeVisible: false,
            batchDeviceVisible: false,
            labelModel: "",
            treeData: [],
            treeDataSelect: [],
            defaultProps: {
                children: "children",
                label: "name",
            },
            deviceCodeNum: 0,
            plateNum: 0,
            form: {
                type: 3,
                plateNum: this.$route.query.plateNum
                    ? this.$route.query.plateNum
                    : "",
                deviceCode: this.$route.query.deviceCode
                    ? this.$route.query.deviceCode
                    : "",
                orgIds: [],
                organizationSigns: "",
            },
            tableDataFirst: [],
            tableDataSecond: [],
            tableDataThird: [],
            total: 0,
            params: {
                currentPage: 1,
                pageSize: 20,
                listType: 1,
                orderDir: "",
                orderColumn: "",
            },
            tableHeight: 500,
            activeName: "first",
            loadingAll: false,
            loadingTable: false,
            ids: [],
            tipDeviceCode: "",
            tipDevicePlateNum: "",
            tipPlatformPlateNum: "",
            useItem: "",
            tipType: "",
            tip: {
                id: "",
                useValue: "",
            },
            treeArr: [],
        };
    },
    filters: {
        formatTime(time) {
            let currTime = new Date(time);
            let year = currTime.getFullYear(); // 年
            let month = currTime.getMonth() + 1; // 月
            let day = currTime.getDate(); // 日
            let hour = currTime.getHours(); // 时
            let minutes = currTime.getMinutes(); // 分
            let seconds = currTime.getSeconds(); //秒
            if (month <= 9) {
                month = "0" + month;
            } else {
                month = month;
            }

            if (day < 10) {
                day = "0" + day;
            }
            if (hour < 10) {
                hour = "0" + hour;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }

            currTime =
                year +
                "-" +
                month +
                "-" +
                day +
                " " +
                hour +
                ":" +
                minutes +
                ":" +
                seconds;
            return currTime;
        },
    },
    watch: {
        activeName: {
            handler(val) {
                if (val == "first") {
                    this.params.listType = "1";
                    this.form.type = 1;
                } else if (val == "second") {
                    this.params.listType = "2";
                    this.form.type = 2;
                } else if (val == "third") {
                    this.params.listType = "3";
                    this.form.type = 3;
                }
            },
            immediate: true,
        },
    },
    methods: {
        //自定义表头
        renderHeader(h, { column, $index }) {
            return h("span", { class: "poptip" }, [
                h("span", this.$t("common.deviceStatus")), //表格当前列标题
                h(
                    "Poptip",
                    {
                        props: {
                            placement: "top",
                            width: "80px",
                            trigger: "hover",
                            offset: 2,
                            transfer: true,
                            title: this.$t("common.deviceStatus"),
                        },
                        style: {
                            "font-weight": "400",
                        },
                    },
                    [
                        h("Icon", {
                            props: {
                                type: "information-circled",
                                color: "#B9BCCD",
                                size: "12",
                            },
                            style: {
                                "margin-left": "4px",
                                "margin-top": "10px",
                            },
                        }),
                        h(
                            "span",
                            { slot: "content" },
                            this.$t("common.deviceStatusDesc")
                            // "绿色为在线，深黄色是深休眠，浅黄色是浅休眠，灰色为离线"
                        ),
                    ]
                ),
            ]);
        },
        selectable(row, index) {
            if (row.deviceValue && row.deviceValue.length < 20) {
                return true;
            } else {
                return false;
            }
        },
        batchDevice() {
            if (this.ids.length !== 0) {
                this.batchDeviceVisible = true;
            } else {
                // 请选择一个设备修改！
                this.$message.warning(
                    this.$t("plateNumAndDeviceCode.selectDeviceModify")
                );
            }
        },
        //懒加载树节点
        // loadNode(node, resolve){
        //     console.log('11',node.data.id)
        //     //父节点
        //     if (node.level === 0) {
        //     }
        //     //子节点
        //     if (node.level >= 1) {
        //     }
        // },
        //获取组织选项
        getOrgTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = res.data;
                    this.treeDataToArr(res.data);
                    this.$nextTick(() => {
                        // this.form.organizationSigns = [this.treeData[0].id];
                        this.getTableData();
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
        setTableHeight() {
            if (this.activeName == "third") {
                this.tableHeight = document.body.clientHeight - 235;
            } else {
                this.tableHeight = document.body.clientHeight - 281;
            }
        },
        modifyVal(row, val) {
            this.tipDeviceCode = row.deviceValue;
            this.tipDevicePlateNum = row.deviceValue;
            this.tipPlatformPlateNum = row.platformValue;
            this.tipType = row.type;
            this.useItem = row.useItem;
            this.tip.id = row.id;
            this.tip.useValue = val;
        },
        //使用设备端功能-批量修改
        batchUpdateDataAbnormal() {
            this.$api[
                this.activeName == "first"
                    ? "batchUpdateDataAbnormal"
                    : "batchUpdatePlateDataAbnormal"
            ](this.ids).then((res) => {
                if (res.success == true) {
                    if (res.data.length) {
                        this.dialogTableVisible = true;
                        this.gridData = res.data;
                    } else {
                        // 修改成功！
                        this.$message.success(
                            this.$t("common.modifiedSuccess")
                        );
                    }
                } else {
                    this.$message.error(res.msg);
                }
                this.getTableData();
                this.getAbnormalNum();
            });
        },
        //使用设备端功能-设备序列号操作中
        oneUpdateDataAbnormal() {
            this.$api.updateDataAbnormal(this.tip).then((res) => {
                if (res.success == true) {
                    // 修改成功！
                    this.$message.success(this.$t("common.modifiedSuccess"));
                } else {
                    this.$message.error(res.msg);
                }
                this.getTableData();
                this.getAbnormalNum();
            });
        },
        handleSelect(selection) {
            let arr = [];
            selection.forEach((item) => {
                arr.push(item.id);
            });
            this.ids = arr;
        },
        sortChange(column, prop, order) {
            this.params.orderDir = !column.order
                ? ""
                : column.order === "ascending"
                ? "asc"
                : "desc";
            this.params.orderColumn = !column.prop ? "" : "acquisitionTime";
            this.search();
        },
        sortChangeSecond(column, prop, order) {
            this.params.orderDir = !column.order
                ? ""
                : column.order === "ascending"
                ? "asc"
                : "desc";
            this.params.orderColumn = !column.prop ? "" : "acquisitionTime";
            this.search();
        },
        sortChangeThird(column, prop, order) {
            this.params.orderDir = !column.order
                ? ""
                : column.order === "ascending"
                ? "asc"
                : "desc";
            this.params.orderColumn = !column.prop ? "" : "updateTime";
            this.search();
        },
        //导出
        goExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                // this.form.type = '';
                this.form.orgIds = this.form.organizationSigns.toString();
                let params = Object.assign(
                    { listType: this.params.listType },
                    this.form
                );
                this.$api.exportDeviceData(params).then((res) => {
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
                        this.$message.error(res.msg);
                        this.loadingAll = false;
                    }
                });
            }
        },
        orgSelect() {
            console.log();
        },
        handleNodeClick(data) {
            this.labelModel = data.name;
            this.form.organizationSigns = data.treeLevel;
        },
        //点击查询
        search() {
            this.loadingTable = true;
            this.getTableData();
        },
        //点击重置
        handleReset(name) {
            this.labelModel = "";
            this.$refs[name].resetFields();
            this.form.plateNum = "";
            this.form.deviceCode = "";
            if (this.activeName == "first") {
                this.params.listType = "1";
                this.form.type = 1;
            } else if (this.activeName == "second") {
                this.params.listType = "2";
                this.form.type = 2;
            } else if (this.activeName == "third") {
                this.params.listType = "3";
                this.form.type = 3;
            }
        },
        //获取异常数量
        getAbnormalNum() {
            this.$api.getAbnormalNum().then((res) => {
                if (res.success == true) {
                    this.deviceCodeNum = res.data.deviceCodeNum;
                    this.plateNum = res.data.plateNum;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //获取表格数据
        getTableData() {
            // if(this.params.listType==1||this.params.listType==2){
            //     this.form.type = '';
            // }else{
            //     this.form.type = 3;
            // }
            // switch(this.activeName){
            //   case 'first':
            //     this.params.listType = 1;
            //     this.form.type = 1;
            //   break;
            //   case 'second':
            //     this.params.listType = 2;
            //     this.form.type = 2;
            //   break;
            //   default:
            //     this.params.listType = 3;
            //     this.form.type = 3;
            //   break;
            // }
            // this.form.type = this.params.listType
            this.form.orgIds = this.form.organizationSigns.toString();
            let params = Object.assign(this.form, this.params);
            this.loadingTable = true;
            this.$api.getTableData(params).then((res) => {
                if (res.success == true) {
                    this.total = res.data.totalRecords;
                    if (this.params.listType == 1) {
                        this.tableDataFirst =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableDataFirst;
                    } else if (this.params.listType == 2) {
                        this.tableDataSecond =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableDataSecond;
                    } else if (this.params.listType == 3) {
                        this.tableDataThird =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableDataThird;
                    }
                } else {
                    this.$message.error(res.msg);
                }
                this.loadingTable = false;
            });
        },
        //切换tab页
        handleClick(tab, event) {
            this.setTableHeight();
            this.handleReset("form");
            this.ids = [];
            this.params.currentPage = 1;
            this.params.orderColumn = "";
            this.params.orderDir = "";
            // this.form.organizationSigns = [this.treeArr[0].id];
            if (tab.name == "first") {
                this.params.listType = "1";
                this.form.type = 1;
            } else if (tab.name == "second") {
                this.params.listType = "2";
                this.form.type = 2;
            } else if (tab.name == "third") {
                this.params.listType = "3";
                this.form.type = 3;
            }
            // this.form.plateNum = this.$route.query.plateNum ? this.$route.query.plateNum : '',
            // this.form.deviceCode =  this.$route.query.deviceCode ? this.$route.query.deviceCode : '',
            this.getTableData();
        },
        //当前页变化时
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getTableData();
        },
        //页数据条数变化时
        handleSizeChange(val) {
            this.params.currentPage = 1;
            this.params.pageSize = val;
            this.getTableData();
        },
        //批量终止下发
        batchTerminationDistribution() {},
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
        this.activeName = this.$route.query.plateNum ? "second" : "first";
        switch (this.activeName) {
            case "first":
                this.params.listType = 1;
                this.form.type = 1;
                break;
            case "second":
                this.params.listType = 2;
                this.form.type = 2;
                break;
            default:
                this.params.listType = 3;
                this.form.type = 3;
                break;
        }
        this.getOrgTree();
        this.getAbnormalNum();
        this.setTableHeight();
    },
};
</script>

<style scoped lang="less">
.span-box {
    span {
        white-space: wrap;
        word-wrap: break-word;
    }
}
/deep/.el-tabs {
    .el-tabs__header {
        margin: 0 0 12px !important;
    }
}

.top {
    padding: 0 14px 14px;

    .top-right {
        float: right;
        margin-top: -32px;
    }

    .top-bottom {
        margin: 14px 0;
    }
}

.red {
    color: #d50000;
}
.grey {
    color: grey;
}
.green {
    color: limegreen;
}
.numColor {
    color: #d50000;
}

.el-select-dropdown__item.selected.radio {
    background-color: #fff;
    color: #4d4d4d;
}
.top-left {
    .el-form-item {
        margin-bottom: 0px !important;
    }
}
</style>
