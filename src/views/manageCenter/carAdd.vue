<template>
    <div class="add-device">
        <!-- //检索设备弹窗 -->
        <!-- 选择已有设备 -->
        <el-dialog
            :title="$t('carManage.selectExistingDevice')"
            :visible="processModal"
            append-to-body
            @close="closeDio"
            :custom-class="'no-padding-dialog'"
            :width="'1100px'"
        >
            <div class="m-x-md m-b">
                <!-- 弹窗搜索区域 -->
                <div class="directionRow">
                    <div class="m-t">
                        <el-form
                            :model="searchForm"
                            inline
                            label-position="top"
                            ref="searchForm"
                        >
                            <!-- 设备序列号 -->
                            <el-form-item
                                class=""
                                prop="deviceSerialNum"
                                :label="$t('common.deviceSerialNum')"
                            >
                                <el-input
                                    v-model="searchForm.deviceSerialNum"
                                    :placeholder="$t('common.input')"
                                    clearable
                                ></el-input>
                            </el-form-item>
                            <!-- 终端手机号 -->
                            <el-form-item
                                class=""
                                prop="deviceCode"
                                :label="$t('common.deviceCode')"
                            >
                                <el-input
                                    v-model="searchForm.deviceCode"
                                    :placeholder="$t('common.input')"
                                    clearable
                                ></el-input>
                            </el-form-item>
                            <!-- 设备型号 -->
                            <el-form-item
                                class="widthProduct"
                                prop="deviceModelCode"
                                :label="$t('common.deviceModelCode')"
                            >
                                <el-select
                                    v-model="searchForm.deviceModelCode"
                                    clearable
                                    filterable
                                >
                                    <el-option
                                        v-for="(item, index) in deviceModelList"
                                        :key="index"
                                        :value="item.fieldNameEN"
                                        :label="item.fieldNameCN"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <!-- class="m-t-md m-l-lg" -->
                            <div style="float: right" class="m-t-md">
                                <el-button
                                    type="primary"
                                    class="m-t-sm"
                                    :disabled="searchLoading"
                                    :loading="searchLoading"
                                    @click="
                                        params.currentPage = 1;
                                        search();
                                    "
                                    >{{ $t("common.search") }}
                                </el-button>
                                <el-button
                                    class="m-t-sm"
                                    type="default"
                                    @click="handleReset($refs.searchForm)"
                                    >{{ $t("common.reset") }}</el-button
                                >
                            </div>
                        </el-form>
                    </div>
                </div>
                <!-- 弹窗列表区域 -->
                <div class="m-b">
                    <el-table
                        v-loading="searchLoading"
                        :element-loading-text="$t('common.desperatelyLoading')"
                        element-loading-color="#007213"
                        :data="listData"
                        :height="tableHeight"
                        border
                        stripe
                        @selection-change="onSelectionChange"
                        @filter-change="filterChange"
                        style="width: 99.9% !important"
                    >
                        <!-- 设备序列号 -->
                        <el-table-column
                            prop="deviceSerialNum"
                            :label="$t('common.deviceSerialNum')"
                            min-width="120px"
                        >
                        </el-table-column>
                        <!-- 终端手机号 -->
                        <el-table-column
                            prop="deviceCode"
                            :label="$t('common.deviceCode')"
                            min-width="140px"
                        ></el-table-column>
                        <!-- 设备型号 -->
                        <el-table-column
                            prop="deviceModelCode"
                            :label="$t('common.deviceModelCode')"
                            min-width="160px"
                            :show-overflow-tooltip="true"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="protocolName"
                            :label="$t('common.protocolName')"
                            min-width="100px"
                            :show-overflow-tooltip="true"
                        >
                        </el-table-column>
                        <!-- SIM卡类型 -->
                        <el-table-column
                            prop="normalCard"
                            :label="$t('carManage.simType')"
                            min-width="100px"
                        >
                            <template slot-scope="scope">
                                <div>
                                    {{
                                        scope.row.normalCard == 0
                                            ? $t("carManage.directionalCard")
                                            : $t("carManage.normalCard")
                                    }}
                                </div>
                            </template>
                        </el-table-column>
                        <!-- 固件语言 -->
                        <el-table-column
                            prop="language"
                            :label="$t('carManage.firmwareLanguage')"
                            min-width="80px"
                        >
                            <template slot-scope="scope">
                                <div>
                                    {{
                                        scope.row.language == "CN"
                                            ? $t("carManage.simpleChinese")
                                            : $t("carManage.english")
                                    }}
                                </div>
                            </template>
                        </el-table-column>
                        <!-- 操作 -->
                        <el-table-column
                            :label="$t('common.operate')"
                            width="120px"
                        >
                            <template slot-scope="scope">
                                <el-button
                                    type="text"
                                    class="text-info"
                                    @click="doBatchBind(scope.row)"
                                >
                                    <!-- 选择设备 -->
                                    {{ $t("carManage.selectDevice") }}
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="wrap-bottom">
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
        </el-dialog>
        <div class="content">
            <el-form
                :model="addTerminalForm"
                label-position="top"
                :gutter="20"
                ref="addTerminalForm"
            >
                <div class="container">
                    <el-row type="flex" justify="space-between" class="m-t">
                        <el-col :span="7">
                            <!-- 车牌号 -->
                            <el-form-item
                                prop="plateNum"
                                :label="$t('common.plateNum')"
                                class="item"
                                :rules="{
                                    required: true,
                                    validator: checkPlateNum,
                                    trigger: 'blur',
                                }"
                            >
                                <el-input
                                    :placeholder="$t('common.input')"
                                    v-model.trim="addTerminalForm.plateNum"
                                    clearable
                                    :maxlength="20"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <!-- 所属组织 -->
                            <el-form-item
                                v-if="carDetails.organizedName"
                                :label="$t('common.orgPath')"
                                prop="orgId"
                                :rules="{
                                    required: true,
                                    validator: checkOrgid,
                                    trigger: 'blur',
                                }"
                            >
                                <el-input
                                    placeholder=""
                                    v-model="addTerminalForm.organizedName"
                                    disabled
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                v-if="!carDetails.organizedName"
                                :label="$t('common.orgPath')"
                                prop="orgId"
                                :rules="{
                                    required: true,
                                    validator: checkOrgid,
                                    trigger: 'blur',
                                }"
                            >
                                <TreeSelect
                                    :placeholder="$t('common.select')"
                                    :treeData="treeData"
                                    filter
                                    v-model="addTerminalForm.orgId"
                                    :props="defaultProps"
                                    disabled
                                >
                                </TreeSelect>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <!-- :disabled="type === 'edit'" -->
                            <!-- 车牌颜色 -->
                            <el-form-item
                                class="item"
                                prop="plateColor"
                                :label="$t('carManage.plateColor')"
                            >
                                <el-select
                                    style="width: 100%"
                                    v-model="addTerminalForm.plateColor"
                                    :placeholder="$t('common.select')"
                                    clearable
                                >
                                    <el-option
                                        v-for="(item, index) in plateColorList"
                                        :key="index"
                                        :value="item.colorCode"
                                        :label="item.colorName"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <!-- 车辆类型 -->
                            <el-form-item
                                class="item"
                                prop="carType"
                                :label="$t('carManage.carType')"
                            >
                                <el-select
                                    style="width: 100%"
                                    v-model="addTerminalForm.carType"
                                    :placeholder="$t('common.select')"
                                    clearable
                                >
                                    <el-option-group
                                        v-for="(group, index) in carTypeList"
                                        :key="index"
                                        :label="group.carType"
                                    >
                                        <el-option
                                            v-for="item in group.carSubTypes"
                                            :key="item.value"
                                            :label="item.typeName"
                                            :value="item.typeCode"
                                        >
                                        </el-option>
                                    </el-option-group>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- //设备信息 -->
                    <!-- //设备终端手机号/设备序列号/设备型号/设备名称/视频通道号/SIM卡类型 -->
                    <div>
                        <el-row
                            type="flex"
                            justify="space-between"
                            class="equip-list"
                        >
                            <el-col :span="2">
                                <!-- 设备列表 -->
                                <div style="font-size: small">
                                    {{ $t("carManage.devicesList") }}
                                </div>
                            </el-col>
                            <el-col :span="18">
                                <div class="jinggao">
                                    <i class="iconfont icon-jinggao"></i>
                                    <span>
                                        <!-- SIM卡类型：若安装时，设备绑定的物联网卡，需联系运营商开通相关的域名或IP -->
                                        {{ $t("carManage.simTypeMsg") }}
                                    </span>
                                    <el-button
                                        type="text"
                                        @click="getSimCardPdfUrl()"
                                    >
                                        <!-- 查看资料 -->
                                        {{
                                            $t("carManage.viewProfile")
                                        }}</el-button
                                    >
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div
                                    class="colorBlue"
                                    style="font-size: small; float: right"
                                    @click="showDetails"
                                    v-btn="'carManageBindDevice'"
                                >
                                    <!-- 选择已有设备 -->
                                    {{ $t("carManage.selectExistingDevice") }}
                                </div>
                            </el-col>
                        </el-row>
                        <!-- //修改为表格 -->
                        <div
                            class="m-t m-b"
                            v-show="addTerminalForm.deviceList.length !== 0"
                        >
                            <el-table
                                :data="addTerminalForm['deviceList']"
                                border
                                style="width: 100%"
                            >
                                <!-- 设备型号 -->
                                <el-table-column
                                    :label="$t('common.deviceModelCode')"
                                >
                                    <template slot="header">
                                        <span>{{
                                            $t("common.deviceModelCode")
                                        }}</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-form-item
                                            :prop="
                                                'deviceList.' +
                                                scope.$index +
                                                '.deviceModelCode'
                                            "
                                            :rules="{
                                                required: false,
                                                validator: checkDeviceModelCode,
                                                trigger: 'change',
                                            }"
                                        >
                                            <el-select
                                                :disabled="!scope.row.isAdd"
                                                v-model="
                                                    scope.row.deviceModelCode
                                                "
                                                clearable
                                                filterable
                                                @change="
                                                    changedeviceModelCode(
                                                        scope.row
                                                            .deviceModelCode,
                                                        scope.$index
                                                    )
                                                "
                                                :placeholder="
                                                    $t('common.select')
                                                "
                                                allow-create
                                                default-first-option
                                            >
                                                <el-option
                                                    v-for="(
                                                        item_, index_
                                                    ) in deviceModelList"
                                                    :key="index_"
                                                    :value="item_.fieldNameEN"
                                                    :label="item_.fieldNameCN"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <!-- 设备序列号 -->
                                <el-table-column
                                    :label="$t('common.deviceSerialNum')"
                                >
                                    <template slot="header">
                                        <span class="star">*</span>
                                        <span>{{
                                            $t("common.deviceSerialNum")
                                        }}</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-form-item
                                            :prop="
                                                'deviceList.' +
                                                scope.$index +
                                                '.deviceSerialNum'
                                            "
                                            :rules="{
                                                required: true,
                                                validator: checkDeviceSerialNum,
                                                trigger: 'blur input',
                                            }"
                                        >
                                            <el-input
                                                :disabled="!scope.row.isAdd"
                                                v-model="
                                                    scope.row.deviceSerialNum
                                                "
                                                :placeholder="
                                                    $t('common.input')
                                                "
                                                @blur="deviceSerialNumBlur"
                                                :clearable="type !== 'edit'"
                                                oninput="if(value.length>9)value=value.slice(0,9)"
                                            ></el-input>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <!-- 终端手机号 -->
                                <el-table-column
                                    :label="$t('common.deviceCode')"
                                >
                                    <template slot="header">
                                        <span class="star">*</span>
                                        <span>{{
                                            $t("common.deviceCode")
                                        }}</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-form-item
                                            :prop="
                                                'deviceList.' +
                                                scope.$index +
                                                '.deviceCode'
                                            "
                                            :rules="{
                                                required: true,
                                                message: $t(
                                                    'carManage.deviceCode_message'
                                                ),
                                                trigger: 'blur',
                                            }"
                                        >
                                            <el-input
                                                :disabled="!scope.row.isAdd"
                                                v-model="scope.row.deviceCode"
                                                :placeholder="
                                                    $t('common.input')
                                                "
                                                :clearable="type !== 'edit'"
                                            ></el-input>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <!-- SIM卡类型 -->
                                <el-table-column
                                    :label="$t('carManage.simType')"
                                >
                                    <template slot="header">
                                        <span class="star">*</span>
                                        <span>{{
                                            $t("carManage.simType")
                                        }}</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-form-item
                                            :prop="
                                                'deviceList.' +
                                                scope.$index +
                                                '.normalCard'
                                            "
                                            :rules="{
                                                required: true,
                                                validator: checkSimType,
                                                trigger: 'change',
                                            }"
                                        >
                                            <el-select
                                                v-model="scope.row.normalCard"
                                                clearable
                                                :placeholder="
                                                    $t('common.select')
                                                "
                                                :disabled="!scope.row.isAdd"
                                            >
                                                <el-option
                                                    :value="0"
                                                    :label="
                                                        $t(
                                                            'carManage.directionalCard'
                                                        )
                                                    "
                                                ></el-option>
                                                <el-option
                                                    :value="1"
                                                    :label="
                                                        $t(
                                                            'carManage.normalCard'
                                                        )
                                                    "
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <!-- 视频通道数量 -->
                                <el-table-column
                                    :label="$t('carManage.channelNumber')"
                                >
                                    <template slot="header">
                                        <span class="star">*</span>
                                        <span>{{
                                            $t("carManage.channelNumber")
                                        }}</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-form-item
                                            :prop="
                                                'deviceList.' +
                                                scope.$index +
                                                '.videoChannelNum'
                                            "
                                            :rules="{
                                                required: true,
                                                validator: checkLanguage,
                                                trigger: 'blur',
                                            }"
                                        >
                                            <el-input-number
                                                size="mini"
                                                style="width: 90%"
                                                :max="24"
                                                :min="0"
                                                :disabled="!scope.row.isAdd"
                                                v-model="
                                                    scope.row.videoChannelNum
                                                "
                                            ></el-input-number>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <!-- 固件语言 -->
                                <el-table-column
                                    :label="$t('carManage.firmwareLanguage')"
                                >
                                    <template slot="header">
                                        <span class="star">*</span>
                                        <span>{{
                                            $t("carManage.firmwareLanguage")
                                        }}</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-form-item
                                            :prop="
                                                'deviceList.' +
                                                scope.$index +
                                                '.language'
                                            "
                                            :rules="{
                                                required: true,
                                                validator: checkLanguage,
                                                trigger: 'change',
                                            }"
                                        >
                                            <el-select
                                                v-model="scope.row.language"
                                                :disabled="!scope.row.isAdd"
                                                clearable
                                            >
                                                <el-option
                                                    v-for="(
                                                        item, index
                                                    ) in firmwareLanguageList"
                                                    :value="item.value"
                                                    :label="item.label"
                                                    :key="index"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </template>
                                </el-table-column>

                                <el-table-column
                                    :label="$t('common.operate')"
                                    width="120px"
                                >
                                    <template slot-scope="scope">
                                        <el-button
                                            v-if="
                                                scope.row.isAdd && !scope.row.id
                                            "
                                            type="text"
                                            class="text-info colorBlue"
                                            @click="
                                                isAddClick(
                                                    scope.$index,
                                                    scope.row
                                                )
                                            "
                                        >
                                            <!-- 保存 -->
                                            {{ $t("common.save") }}
                                        </el-button>
                                        <el-button
                                            v-if="
                                                !scope.row.isAdd &&
                                                !scope.row.id
                                            "
                                            type="text"
                                            class="text-info colorBlue"
                                            @click="
                                                editDevice(
                                                    scope.$index,
                                                    scope.row
                                                )
                                            "
                                        >
                                            <!-- 编辑 -->
                                            {{ $t("common.edit") }}
                                        </el-button>
                                        <!-- :disabled="scope.$index == 0" -->
                                        <el-button
                                            v-if="!scope.row.id"
                                            type="text"
                                            class="text-info colorBlue"
                                            @click="cancel(scope.$index)"
                                        >
                                            <!-- 取消 -->
                                            {{ $t("common.cancel") }}
                                        </el-button>
                                        <el-button
                                            v-if="
                                                scope.row.id != '' &&
                                                !scope.row.isClick
                                            "
                                            type="text"
                                            class="text-info colorBlue"
                                            @click="deleteDevice(scope.$index)"
                                            v-btn="'carManageUnbindDevice'"
                                        >
                                            <!-- 解绑设备 -->
                                            {{ $t("common.unbindDevice") }}
                                        </el-button>
                                        <el-button
                                            v-if="
                                                scope.row.isClick &&
                                                scope.row.id != ''
                                            "
                                            type="text"
                                            class="text-info colorBlue"
                                            @click="cancel(scope.$index)"
                                        >
                                            <!-- 删除 -->
                                            {{ $t("common.delete") }}
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <el-row
                            class="ligth"
                            type="flex"
                            style="
                                width: 100%;
                                background-color: #ebebeb;
                                justify-content: center;
                            "
                        >
                            <el-button
                                type="text"
                                @click="addDevice"
                                style="padding: 8px 20px"
                                v-btn="'carManageAddDevice'"
                            >
                                <!-- 添加新设备 -->
                                {{ $t("carManage.addNewDevice") }}</el-button
                            >
                        </el-row>
                    </div>
                </div>
            </el-form>
        </div>
        <!-- 设备序列号 -->
        <el-dialog
            :title="$t('common.deviceSerialNum')"
            :visible="exampleVisible"
            @close="exampleVisible = false"
        >
            <img :src="device_code" alt="" style="width: 100%" />
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="exampleVisible = false">{{
                    $t("common.gotIt")
                }}</el-button>
            </span>
        </el-dialog>
        <div class="footer">
            <div class="footer-btn">
                <el-button type="default" @click="cancelDialog">{{
                    $t("common.cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    @click="beforeSubmit"
                    :loading="loadSubmit"
                    >{{ $t("common.ok") }}</el-button
                >
            </div>
        </div>
        <!-- 提示 -->
        <el-dialog
            :title="$t('common.prompt')"
            :visible.sync="showIfReAdd"
            :width="'800px'"
        >
            {{ $t("common.plateNum") }}:{{ addTerminalForm.plateNum
            }}{{ $t("carManage.alreadyExists") }}
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit">{{
                    $t("common.ok")
                }}</el-button>
                <el-button @click="doTipCancel">{{
                    $t("common.cancel")
                }}</el-button>
            </div>
        </el-dialog>
        <!-- 查看资料 -->
        <el-dialog
            :title="$t('carManage.viewProfile')"
            append-to-body
            :visible.sync="msgDialogVisible"
            width="800px"
        >
            <div style="padding: 1rem 0; font-size: 1rem; color: #000">
                <!-- 808协议接入 -->
                {{ $t("carManage.viewProfileTitle") }}
            </div>
            <el-table
                :data="msgTableData1"
                style="width: 100%"
                class="domainName-table"
            >
                <!-- 域名/IP(推荐使用域名) -->
                <el-table-column
                    prop="name"
                    :label="$t('carManage.viewProfileColumn1')"
                    width="260"
                >
                </el-table-column>
                <!-- 描述 -->
                <el-table-column
                    prop="msg"
                    :label="$t('carManage.viewProfileColumn2')"
                >
                </el-table-column>
                <!-- 是否必需 -->
                <el-table-column
                    prop="need"
                    :label="$t('carManage.viewProfileColumn3')"
                    width="110"
                >
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="copyText">
                    <!-- 复制域名/IP -->
                    {{ $t("carManage.viewProfileColumn4") }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import device_code from "@/assets/images/device-code.jpg";
export default {
    // name: "添加",
    components: {
        TreeSelect,
    },
    props: {
        carDetails: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        let that = this;
        return {
            checkDeviceModelCode: function (rule, value, callback) {
                if (value != undefined && value.length > 0) {
                    if (value.length > 30) {
                        that.$message.error(
                            that.$t("carManage.checkDeviceModelCode")
                        );
                        callback(
                            new Error(that.$t("carManage.checkDeviceModelCode"))
                        );
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            },
            //设备序列号校验
            checkDeviceSerialNum: function (rule, value, callback) {
                if (value.length < 9) {
                    callback(
                        new Error(that.$t("carManage.checkDeviceSerialNum"))
                    );
                } else {
                    callback();
                }
            },
            //车牌号校验
            checkPlateNum: function (rule, value, callback) {
                if (value != undefined && value.length > 0) {
                    const vinRegex =
                        /^[\u4e00-\u9fa5_a-zA-Z0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’'，。、]+$/;
                    // const vinRegex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}/;
                    if (!vinRegex.test(value)) {
                        callback(
                            new Error(that.$t("carManage.checkPlateNum1"))
                        );
                    } else {
                        callback();
                    }
                } else {
                    callback(new Error(that.$t("carManage.checkPlateNum2")));
                }
            },
            //所属组织校验
            checkOrgid: function (rule, value, callback) {
                if (window.location.href.includes("type=edit")) {
                    callback();
                } else {
                    if (value !== "" && value !== null) {
                        callback();
                    } else {
                        callback(new Error(that.$t("carManage.checkOrgid")));
                    }
                }
            },
            //校验SIM卡类型
            checkSimType: function (rule, value, callback) {
                if (value !== "" && value !== null) {
                    callback();
                } else {
                    // if (window.location.href.includes("type=edit") ) {
                    //   callback();
                    // } else {
                    callback(new Error(that.$t("carManage.checkSimType")));
                    // }
                }
            },
            //校验固件语言
            checkLanguage: function (rule, value, callback) {
                if (value !== "" && value !== null) {
                    callback();
                } else {
                    // if (window.location.href.includes("type=edit") ) {
                    //   callback();
                    // } else {
                    callback(new Error(that.$t("carManage.checkLanguage")));
                    // }
                }
            },
            //校验设备终端手机号
            checkNumber: function (rule, value, callback) {
                if (value !== undefined && value.length > 0) {
                    const reg = /^[0-9]*$/;
                    if (!reg.test(value)) {
                        callback(new Error(that.$t("carManage.checkNumber1")));
                    } else {
                        if (value.length <= 20) {
                            callback();
                        } else {
                            callback(
                                new Error(that.$t("carManage.checkNumber2"))
                            );
                        }
                    }
                } else {
                    callback(new Error(that.$t("carManage.checkNumber3")));
                }
            },
            //校验视频通道号
            checkChannel: function (rule, value, callback) {
                // if (window.location.href.includes("type=edit")) {
                //     callback();
                // } else {
                if (value !== undefined && value.length > 0) {
                    const reg = /^[0-9]*$/;
                    if (!reg.test(value)) {
                        callback(new Error(that.$t("carManage.checkChannel1")));
                    } else {
                        if (value <= 24) {
                            callback();
                        } else {
                            callback(
                                new Error(that.$t("carManage.checkChannel2"))
                            );
                        }
                    }
                } else {
                    callback(new Error(that.$t("carManage.checkChannel3")));
                }
                // }
            },
            isAdd: true,
            loading: false,
            syncModel: false,
            syncResult: false,
            syncNum: 0,
            synctotal: 0,
            syncForm: {
                startDate: "",
                endDate: "",
            },
            syncParams: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                beginDate: "",
                endDate: "",
            },
            timeRange: [],
            protocol: "", //协议类型
            numIndex: 0, //deviceList的index
            filterList: [],
            selection: [],
            tableHeight: 400,
            listData: [],
            searchLoading: true,
            searchForm: {
                deviceCode: "",
                deviceSerialNum: "",
                deviceModelCode: "",
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "plateNum", //排序列
                orderDir: "asc", //排序方向
                organizeId: null,
            },
            total: 0,
            deviceMessage: [],
            externModInfoVoListShow: false,
            processModal: false,
            loadSubmit: false,
            showIfReAdd: false,
            device_code,
            type: this.carDetails.type,
            exampleVisible: false,
            activeName: "first",
            deviceModelList: [],
            firmwareLanguageList: [
                { value: "CN", label: this.$t("carManage.simpleChinese") },
                { value: "EN", label: this.$t("carManage.english") },
            ],
            plateColorList: [],
            carTypeList: [],
            defaultProps: {
                children: "children",
                label: "name",
            },
            activeNames: ["1"],
            organizeId: this.carDetails.orgId,
            addTerminalForm: {
                plateNum: "", //车牌号
                orgId: this.carDetails.orgId,
                organizedName: this.carDetails.organizedName,
                plateColor: "",
                carType: "",
                deviceList: [
                    // {
                    // id: "", //id字段有无表示是已存在还是新增
                    // deviceCode: "", //设备终端手机号
                    // deviceSerialNum: "", //设备序列号
                    // deviceModelCode: "", //设备型号
                    // videoChannelNum: 4, //视频通道数
                    // language: "", //固件语言
                    // normalCard: "", //sim卡类型
                    // isAdd: true
                    // }
                ],
            },
            treeData: [],
            msgDialogVisible: false,
            msgTableData1: [
                {
                    name: this.$t("carManage.msgTableDataMsg6"),
                    msg: this.$t("carManage.msgTableDataMsg1"),
                    need: this.$t("carManage.msgTableDataMsg4"),
                    // name: "iot81.hikvisionauto.com或47.110.152.146",
                    // msg: "JT/T 808设备接入（接入18884端口）；\n固件下载、参数配置文件对应的IP，19999端口；\n预览、录像回放；",
                    // need: "必需",
                },
                {
                    name: "47.114.190.241",
                    msg: this.$t("carManage.msgTableDataMsg2"),
                    need: this.$t("carManage.msgTableDataMsg4"),
                    // msg: "设备上传调试日志到ftp服务器；\n设备上传录像文件到ftp（万一客户平台无法下载录像文件，可通过运维平台下载；）",
                    // need: "必需",
                },
                {
                    name: "*.aliyuncs.com",
                    msg: this.$t("carManage.msgTableDataMsg3"),
                    need: this.$t("carManage.msgTableDataMsg5"),
                    // msg: "设备上传各类日志到对象存储服务，通过运维平台去操作设备上传的日志；",
                    // need: "按实际情况配置",
                },
            ],
            // msgTableData2: [
            //     {
            //         name: "iot81.hikvision.com或47.110.152.146",
            //         msg: "905接入18882端口；固件下载19999端口；预览、对讲、录像回放、图片抓拍",
            //         need: "必需",
            //     },
            //     {
            //         name: "47.114.190.241",
            //         msg: "打印日志上传、录像上传、主动安全报警附件上传",
            //         need: "必需",
            //     },
            // ],
        };
    },
    watch: {},
    methods: {
        closeDio() {
            this.processModal = false;
            this.listData = [];
        },
        //新增绑定设备
        addDevice() {
            // 保证只有一个在编辑状态
            if (this.addTerminalForm.deviceList.some((item) => item.isAdd)) {
                this.$message({
                    type: "warning",
                    // message: "请先保存正在编辑的条件模板内容!",
                    message: this.$t("carManage.addDeviceMsg"),
                });
            } else {
                this.addTerminalForm.deviceList.push({
                    id: "", //id字段有无表示是已存在还是新增
                    deviceCode: "", //设备终端手机号
                    deviceSerialNum: "", //设备序列号
                    deviceModelCode: "", //设备型号
                    videoChannelNum: 1, //视频通道数
                    language: "", //固件语言
                    normalCard: "", //sim卡类型
                    isAdd: true,
                });
            }
            // for(let i =0;i<this.addTerminalForm.deviceList.length; i++){
            //   this.numIndex = i
            // }
        },
        // 绑定
        doBatchBind(value) {
            value["isClick"] = "true";
            this.addTerminalForm.deviceList.push(value);
            this.processModal = false;
            this.listData = [];
        },
        //获取终端手机号
        deviceSerialNumBlur(event) {
            if (event.target.value) {
                const params = {
                    protocol: this.protocol,
                    deviceSerialNum: event.target.value,
                };
                this.$api.generateDeviceCode(params).then((res) => {
                    if (res.success == true) {
                        this.addTerminalForm.deviceList[
                            this.numIndex
                        ].deviceCode = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            }
        },
        //弹窗获取信息
        showDetails() {
            //基本信息为空不能绑定设备
            // if(!this.addTerminalForm.plateNum) {
            //   this.$message.error('请填写车牌号信息')
            // } else {
            if (!this.carDetails.orgId) {
                // this.$message.info("请稍后再试");
                this.$message.info(this.$t("carManage.tryAgainLater"));
            } else {
                this.$refs["addTerminalForm"].clearValidate();
                this.searchForm = {
                    deviceCode: "",
                    deviceSerialNum: "",
                    deviceModelCode: "",
                };
                this.search();
            }
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.search();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.search();
        },
        //选择设备序列号
        changedeviceModelCode(val, num) {
            this.numIndex = num;
            this.deviceModelList.forEach((i) => {
                if (i.fieldNameEN === val) {
                    this.protocol = i.agreement;
                }
            });
        },
        isAddClick(index, item) {
            if (!item.deviceCode || !item.deviceSerialNum || !item.language) {
                this.$message.warning(this.$t("carManage.isAddClick1"));
            } else {
                if (item.normalCard == "0" || item.normalCard == "1") {
                    this.addTerminalForm.deviceList[index] = item;
                    this.addTerminalForm.deviceList[index].isAdd = false;
                    this.$refs["addTerminalForm"].clearValidate();
                } else {
                    this.$message.warning(this.$t("carManage.isAddClick2"));
                }
            }
        },
        // 编辑
        editDevice(index, item) {
            this.numIndex = index;
            const currIndex = this.addTerminalForm.deviceList.findIndex(
                (item) => item.isAdd
            );
            // 保证只有一个在编辑状态
            if (currIndex !== -1) {
                // this.cancel(currIndex)
                this.$message({
                    type: "warning",
                    message: this.$t("carManage.editDeviceMsg"),
                });
            } else {
                this.addTerminalForm.deviceList[index].isAdd = true;
            }
        },
        //删除
        deleteDevice(index) {
            this.$confirm(this.$t("carManage.deleteDevice"), {
                confirmButtonText: this.$t("common.ok"),
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
            })
                .then(() => {
                    this.addTerminalForm.deviceList.splice(index, 1);
                })
                .catch(() => {
                    this.$message({
                        type: "success",
                        message: this.$t("carManage.cancelDelete"),
                    });
                });
        },
        // 取消
        cancel(index) {
            // 取消操作
            this.addTerminalForm.deviceList.splice(index, 1);
            this.$refs["addTerminalForm"].clearValidate();
            // this.$message({type: 'success',message: '已取消!'});
        },
        // 获取组织树
        getOrgTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = res.data;
                    this.$nextTick(() => {
                        this.addTerminalForm.orgId = this.carDetails.orgId;
                        this.$forceUpdate();
                    });
                }
            });
        },
        // 表格搜索
        search() {
            //搜索框中的数据
            this.searchLoading = true;
            const param = {
                orgId: this.addTerminalForm.orgId
                    ? this.addTerminalForm.orgId
                    : this.carDetails.orgId,
                bind: true,
                deviceCode: this.searchForm.deviceCode,
                deviceSerialNum: this.searchForm.deviceSerialNum,
                deviceModelCode: this.searchForm.deviceModelCode,
            };
            let params = Object.assign(this.params, param);
            this.$api.getDeviceDropDown(params).then((res) => {
                if (res.success == true) {
                    this.listData = res.data.results;
                    this.processModal = true;
                    this.total = res.data.totalRecords; //数量
                    this.searchLoading = false;
                } else {
                    this.$message.error(res.msg);
                }
            });
            //判断是否在数组中存在
            //   let filter=(condition,data)=>{
            //     return data.filter( item => {
            //     return Object.keys( condition ).every( key => {
            //        return String( item[ key ] ).toLowerCase().includes(
            //                String( condition[ key ] ).trim().toLowerCase() )
            //         } )
            //  } )
            // }
            //   var condition = {deviceCode: this.searchForm.deviceCode}
            //   this.listData = filter(condition,this.deviceMessage)
            //   this.searchLoading = false;
        },
        // 多选事件
        onSelectionChange(selection) {
            this.selection = selection;
        },
        filterChange(val) {
            for (let i in val) {
                this.filterTagLength = val[i].length;
            }
        },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
                this.searchForm = {
                    deviceCode: "",
                    deviceSerialNum: "",
                    deviceModelCode: "",
                };
            }
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
            this.tableHeight = document.body.clientHeight - 306;
            this.treeHeight = document.body.clientHeight - 156;
        },
        // goDetail(orgId, timeString) {
        //   this.$router.push({
        //     path: "qualifiedProbability/detail",
        //     query: {
        //       orgId: orgId,
        //       time: timeString,
        //     },
        //   });
        // },
        doTipCancel() {
            this.showIfReAdd = false;
            this.loadSubmit = false;
        },
        // 获取车牌颜色列表
        getPlateColorList() {
            this.$api.getPlateColorList().then((res) => {
                if (res.success == true) {
                    this.plateColorList = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 获取车辆类型列表
        getCarTypeList() {
            this.$api.getCarTypeList().then((res) => {
                if (res.success == true) {
                    this.carTypeList = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        getDeviceModelList() {
            this.$api.getProductListByOrgId().then((res) => {
                if (res.success == true) {
                    this.deviceModelList = [];
                    res.data.forEach((item) => {
                        this.deviceModelList.push({
                            fieldNameEN: item,
                            fieldNameCN: item,
                        });
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        submit() {
            this.$refs.addTerminalForm.validate((valid) => {
                if (valid) {
                    if (this.addTerminalForm.deviceList.length > 1) {
                        this.$message.info(
                            this.$t("carManage.carAddSubmitMsg1")
                        );
                        this.loadSubmit = false;
                        return;
                    }
                    if (
                        this.addTerminalForm.deviceList.some(
                            (item) => item.isAdd
                        )
                    ) {
                        this.$message({
                            type: "warning",
                            message: this.$t("carManage.carAddSubmitMsg2"),
                        });
                        this.loadSubmit = false;
                    } else {
                        if (this.type === "add") {
                            const params = {
                                plateNum: this.addTerminalForm.plateNum,
                                orgId: this.addTerminalForm.orgId,
                                plateColor: this.addTerminalForm.plateColor,
                                carType: this.addTerminalForm.carType,
                                deviceList: this.addTerminalForm.deviceList,
                            };
                            this.$api.addCarInfo(params).then((res) => {
                                // this.loading = false;
                                this.loadSubmit = false;
                                if (res.success == true) {
                                    this.$message.success(
                                        this.$t("carManage.carAddSubmitMsg3")
                                    );
                                    this.cancelDialog();
                                    this.$emit("handleSuccess");
                                    // this.$router.push(
                                    //     "/manageCenter/carManage"
                                    // );
                                } else {
                                    this.$message.error(res.msg);
                                }
                            });
                        } else {
                            const params = {
                                plateNum: this.addTerminalForm.plateNum,
                                id: this.addTerminalForm.carId,
                                orgId: this.carDetails.orgId,
                                plateColor: this.addTerminalForm.plateColor,
                                carType: this.addTerminalForm.carType,
                                deviceList: this.addTerminalForm.deviceList,
                            };
                            this.$api.editCarInfo(params).then((res) => {
                                // this.loading = false;
                                this.loadSubmit = false;
                                if (res.success == true) {
                                    this.$message.success(
                                        this.$t("carManage.carAddSubmitMsg4")
                                    );
                                    this.cancelDialog();
                                    this.$emit("handleSuccess");
                                } else {
                                    this.$message.error(res.msg);
                                }
                            });
                        }
                    }
                } else {
                    this.loadSubmit = false;
                }
            });
        },
        cancelDialog() {
            this.$emit("carVisibleClose");
            // this.$router.push("/manageCenter/carManage");
        },
        handleClick() {},
        ifReAdd() {
            this.$api.ifReAdd(this.addTerminalForm.plateNum).then((res) => {
                if (res.success == true) {
                    if (res.data == 1) {
                        this.loadSubmit = false;
                        this.$message.error(this.$t("carManage.ifReAdd"));
                        // this.showIfReAdd = true;
                    } else {
                        this.submit();
                    }
                } else {
                    this.submit();
                }
            });
        },
        beforeSubmit() {
            this.loadSubmit = true;
            if (this.type === "edit") {
                this.submit();
            } else {
                this.ifReAdd();
            }
        },
        /**
         * 编辑获取详情
         */
        getDetail() {
            if (this.type === "edit") {
                // this.$route.meta.title = "编辑";
                const param = {
                    orgId: this.carDetails.orgId,
                    id: this.carDetails.carId,
                };
                this.$api.getCarDetails(param).then((res) => {
                    if (res.success == true) {
                        this.addTerminalForm.plateNum = res.data.plateNum;
                        this.addTerminalForm.orgId = res.data.orgId;
                        this.addTerminalForm.carId = res.data.carId;
                        this.addTerminalForm.plateColor = res.data.plateColor;
                        this.addTerminalForm.carType = res.data.carType;
                        // if(!res.data.deviceList.length) {
                        //   this.addTerminalForm.deviceList =[]
                        //    this.addTerminalForm.deviceList.push({
                        //     id: "", //id字段有无表示是已存在还是新增
                        //     deviceCode: "", //设备终端手机号
                        //     deviceSerialNum: "", //设备序列号
                        //     deviceModelCode: "", //设备型号
                        //     videoChannelNum: 4, //视频通道数
                        //     language: "", //固件语言
                        //     normalCard: "", //sim卡类型
                        //     isAdd: true
                        //   });
                        // } else{
                        //    this.addTerminalForm.deviceList = res.data.deviceList
                        // }
                        this.addTerminalForm.deviceList = res.data.deviceList;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            }
        },
        copyText() {
            let address = {
                808: [
                    {
                        IP: "iot81.hikvisionauto.com或47.110.152.146",
                        Desc: this.$t("carManage.msgTableDataMsg7"),
                        // Desc: "808接入18884端口；固件下载、参数配置文件对应的IP，19999端口；预览、录像回放",
                    },
                    {
                        IP: "47.114.190.241",
                        Desc: this.$t("carManage.msgTableDataMsg8"),
                        // Desc: "设备打印日志上传、录像文件上传（万一客户平台无法下载录像文件，可通过运维平台下载）",
                    },
                ],
            };
            let content = "";
            for (let key in address) {
                content = content + key + "协议\n";
                let sim = address[key];
                sim.forEach((item) => {
                    content += item.IP + "\n";
                });
            }
            this.$copyText(content).then(
                () => {
                    this.$message.success(this.$t("carManage.copySuccess"));
                },
                () => {
                    this.$message.error(this.$t("carManage.copyError"));
                }
            );
        },
        getSimCardPdfUrl() {
            this.$api.getSimCardPdfUrl().then((res) => {
                if (res.success == true) {
                    if (res.data) {
                        window.open(res.data, "_blank");
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
    },
    mounted() {
        if (this.type === "edit") {
            this.getDetail();
        }
        // if (this.type !== "add") {
        //     this.$route.meta.title = "编辑";
        // } else {
        //     this.$route.meta.title = "添加";
        // }
    },
    created() {
        this.getOrgTree();
        this.getDeviceModelList();
        this.getPlateColorList();
        this.getCarTypeList();
    },
};
</script>

<style lang="less" scoped>
.add-device {
    .content {
        height: 420px;
        overflow-y: auto;
    }
    .add-device-tab {
        height: 904px;
    }
    // /deep/ .el-input,.el-select {
    //     width: 500px;
    // }
    .container {
        padding: 0 24px;
    }
    .alicen {
        align-items: center;
        display: flex;
    }
    .devbt {
        position: absolute;
        right: 0;
    }
    .directionRow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .flex {
            display: flex;
        }
        .wrap-bottom {
            border-top: 1px solid #e4e4e4;
        }
        .btn-style {
            float: right;
        }
    }
    .title {
        font-size: large;
        align-items: center;
        display: flex;
        color: black;
        border-bottom: 1px solid grey;
    }
    .formItemRight {
        height: 60px;
        line-height: 88px;
    }
    .device-num {
        position: relative;
        .m-l-sm {
            position: absolute;
            top: 0;
            right: 65px;
        }
    }
    .dialog-template {
        &:first-child {
            border-top: none;
        }
        &:last-child {
            border-bottom: none;
        }
    }
    .footer {
        width: 100%;
        height: 4rem;
        border-top: 1px solid #9ea3b1;
        // position: fixed;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        background: #ffffff;
        padding: 0 24px;
        position: relative !important;
        .footer-btn {
            text-align: right;
        }
    }
    .channel-edit {
        width: 1080px;
        /deep/ .el-input,
        .el-select {
            width: 100%;
        }
        .channel-add {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f2f2f2;
            cursor: pointer;
        }
    }
}
.colorBlue {
    cursor: pointer;
    color: #0099ff !important;
}
.star {
    color: #f56c6c;
    font-size: 14px;
    margin-left: 4px;
}

.starName {
    font-size: 14px;
    font-weight: bold;
}
.jinggao {
    color: #ffa900;
    display: flex;
    align-items: center;
    & > span {
        white-space: nowrap;
    }
    & > .el-button {
        margin-left: 12px;
    }
}
.equip-list {
    .el-col > div {
        height: 24px;
        line-height: 24px;
    }
}
/deep/.el-table {
    .el-form-item {
        margin-bottom: 0px;
        .el-form-item__error {
            display: contents;
        }
    }
}
</style>
