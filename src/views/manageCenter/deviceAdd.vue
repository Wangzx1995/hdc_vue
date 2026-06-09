<template>
    <div class="add-device">
        <div class="content">
            <el-form
                :model="addTerminalForm"
                label-position="top"
                :rules="formValidate"
                :gutter="20"
                ref="addTerminalForm"
            >
                <div class="container">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <!-- 设备序列号 -->
                            <el-form-item
                                prop="deviceSerialNum"
                                :label="$t('common.deviceSerialNum')"
                                class="device-num"
                            >
                                <el-input
                                    v-model="addTerminalForm.deviceSerialNum"
                                    @blur="deviceSerialNumBlur"
                                    :disabled="type === 'edit'"
                                    :clearable="type !== 'edit'"
                                    :placeholder="$t('common.input')"
                                ></el-input>
                                <a
                                    @click="exampleVisible = true"
                                    class="m-l-sm"
                                >
                                    <!-- 去哪里找？ -->
                                    {{ $t("deviceManage.whereCanIFindIt") }}
                                </a>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <!-- 终端手机号 -->
                            <el-form-item
                                :label="$t('common.deviceCode')"
                                prop="deviceCode"
                                :description="
                                    $t('deviceManage.deviceCodeDescription')
                                "
                                class="item"
                            >
                                <span slot="label" class="label-slot"
                                    >{{ $t("common.deviceCode") }}
                                    <el-tooltip
                                        :content="
                                            $t(
                                                'deviceManage.deviceCodeDescription'
                                            )
                                        "
                                    >
                                        <i
                                            class="el-icon-question"
                                        ></i> </el-tooltip
                                ></span>
                                <el-input
                                    v-model="addTerminalForm.deviceCode"
                                    :disabled="type === 'edit'"
                                    :clearable="type !== 'edit'"
                                    :placeholder="$t('common.input')"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <!-- 设备型号 -->
                            <el-form-item
                                prop="deviceModelCode"
                                class="device-num"
                                :label="$t('common.deviceModelCode')"
                            >
                                <!-- placeholder="请选择设备型号，支持输入自定义设备型号" -->
                                <el-select
                                    v-model="addTerminalForm.deviceModelCode"
                                    clearable
                                    style="width: 100%"
                                    allow-create
                                    filterable
                                    default-first-option
                                    :placeholder="
                                        $t(
                                            'deviceManage.deviceModelCodeDescription'
                                        )
                                    "
                                >
                                    <el-option
                                        v-for="(item, index) in deviceModelList"
                                        :key="index"
                                        :value="item.fieldNameEN"
                                        :label="item.fieldNameCN"
                                    ></el-option>
                                </el-select>
                                <a
                                    @click="clearNoUseDeviceModel"
                                    class="m-l-sm"
                                >
                                    <!-- 清除无用型号 -->
                                    {{ $t("deviceManage.clearUselessModels") }}
                                </a>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="8">
                            <el-form-item prop="deviceModelCode" label="接入协议">
                                <el-select
                                    v-model="addTerminalForm.deviceModelCode"
                                    clearable
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="(item, index) in deviceModelList"
                                        :key="index"
                                        :value="item.fieldNameEN"
                                        :label="item.fieldNameCN"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> -->
                    </el-row>
                    <el-row :gutter="20">
                        <!-- <el-col :span='6'>
                        <el-form-item prop="plateNum" label="车牌号" description="示例：浙A88888" class='item'>
                            <el-input v-model="addTerminalForm.plateNum" clearable></el-input>
                        </el-form-item>
                      </el-col> -->
                        <el-col :span="8">
                            <!-- SIM卡类型 -->
                            <el-form-item
                                prop="normalCard"
                                :label="$t('carManage.simType')"
                                class="item"
                            >
                                <el-select
                                    v-model="addTerminalForm.normalCard"
                                    clearable
                                    :placeholder="$t('common.select')"
                                    style="width: 100%"
                                >
                                    <el-option
                                        :value="0"
                                        :label="$t('carManage.directionalCard')"
                                    ></el-option>
                                    <el-option
                                        :value="1"
                                        :label="$t('carManage.normalCard')"
                                    ></el-option>
                                </el-select>
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
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <!-- 固件语言 -->
                            <el-form-item
                                prop="language"
                                :label="$t('carManage.firmwareLanguage')"
                                class="item"
                            >
                                <el-select
                                    v-model="addTerminalForm.language"
                                    :disabled="type === 'edit'"
                                    clearable
                                    style="width: 100%"
                                    :placeholder="$t('common.select')"
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
                        </el-col>
                        <el-col :span="8">
                            <!-- 设备名称 -->
                            <el-form-item
                                prop="deviceName"
                                :label="$t('common.deviceName')"
                                class="item"
                            >
                                <el-input
                                    v-model="addTerminalForm.deviceName"
                                    clearable
                                    :placeholder="$t('common.input')"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <!-- 视频通道数量 -->
                            <el-form-item
                                prop="videoChannels"
                                :label="$t('carManage.channelNumber')"
                            >
                                <div class="channel-edit">
                                    <el-row
                                        class="b-t b-b"
                                        style="background-color: #f2f2f2"
                                    >
                                        <el-col :span="6" class="text-center">
                                            <!-- 通道编号 -->
                                            {{
                                                $t("deviceManage.channelNumber")
                                            }}
                                        </el-col>
                                        <el-col :span="14" class="text-center">
                                            <!-- 通道名称 -->
                                            {{ $t("deviceManage.channelName") }}
                                        </el-col>

                                        <el-col :span="4" class="text-center">
                                            <!-- 操作 -->
                                            {{ $t("common.operate") }}
                                        </el-col>
                                    </el-row>
                                    <template>
                                        <el-row
                                            v-for="(
                                                item, index
                                            ) in addTerminalForm.videoChannels"
                                            :key="index"
                                            class="b-t b-b p-y-xs"
                                        >
                                            <el-col
                                                :span="6"
                                                class="p-r-sm text-center"
                                            >
                                                <el-input
                                                    v-model="item.channelNum"
                                                ></el-input>
                                            </el-col>
                                            <el-col
                                                :span="14"
                                                class="text-center"
                                            >
                                                <el-input
                                                    v-model="item.channelName"
                                                ></el-input>
                                            </el-col>
                                            <el-col
                                                :span="4"
                                                class="text-center"
                                            >
                                                <el-button
                                                    @click="deleteItem(index)"
                                                    icon="el-icon-delete"
                                                />
                                            </el-col>
                                        </el-row>
                                    </template>
                                    <div
                                        @click="addVedioChannel"
                                        class="channel-add p-y-sm"
                                    >
                                        <span>+</span
                                        ><span class="m-l">
                                            <!-- 添加 -->
                                            {{ $t("common.add") }}
                                            ({{
                                                addTerminalForm.videoChannels
                                                    .length
                                            }}/24)</span
                                        >
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- <el-form-item prop="customOrder" label="定制单号" class='item'>
                            <el-input v-model="addTerminalForm.customOrder" clearable></el-input>
                        </el-form-item> -->
                </div>
            </el-form>
        </div>
        <!-- 设备序列号 -->
        <el-dialog
            :title="$t('common.deviceSerialNum')"
            :visible="exampleVisible"
            append-to-body
            @close="exampleVisible = false"
        >
            <img :src="device_code" alt="" style="width: 100%" />
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="exampleVisible = false">
                    <!-- 知道了 -->
                    {{ $t("common.gotIt") }}
                </el-button>
            </span>
        </el-dialog>
        <!-- <el-tab-pane :label="type == 'edit' ? '编辑外设' : '添加外设'" name="second">
            <div>
                暂无
            </div>
        </el-tab-pane> -->
        <div class="footer">
            <div class="footer-btn">
                <el-button type="default" @click="cancelDialog">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button
                    type="primary"
                    @click="beforeSubmit"
                    :loading="loadSubmit"
                >
                    <!-- 确认 -->
                    {{ $t("common.ok") }}
                </el-button>
            </div>
        </div>
        <!-- <el-dialog title="提示" :visible.sync="showIfReAdd" :width="'800px'">
            车牌号:{{ addTerminalForm.plateNum }},已存在，是否继续添加？
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit"> 确 定 </el-button>
                <el-button @click="doTipCancel">取 消</el-button>
            </div>
        </el-dialog> -->
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
        <el-dialog
            title="查看资料"
            append-to-body
            :visible.sync="msgDialogVisible"
            width="800px"
        >
            <div style="padding: 1rem 0; font-size: 1rem; color: #000">
                808协议接入
            </div>
            <el-table
                :data="msgTableData1"
                style="width: 100%"
                class="domainName-table"
            >
                <el-table-column
                    prop="name"
                    label="域名/IP(推荐使用域名)"
                    width="260"
                >
                </el-table-column>
                <el-table-column prop="msg" label="描述"> </el-table-column>
                <el-table-column prop="need" label="是否必需" width="110">
                </el-table-column>
            </el-table>
            <!-- <div style="padding: 1rem 0; font-size: 1rem; color: #000">
                905协议接入（不推荐）
            </div>
            <el-table :data="msgTableData2" style="width: 100%">
                <el-table-column
                    prop="name"
                    label="域名/IP(推荐使用域名)"
                    width="260"
                >
                </el-table-column>
                <el-table-column prop="msg" label="描述"> </el-table-column>
                <el-table-column prop="need" label="是否必需" width="100">
                </el-table-column>
            </el-table> -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="copyText"
                    >复制域名/IP</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import device_code from "@/assets/images/device-code.jpg";
import {
    validateSpecial,
    validatePlateNum,
    validatePlateNum2,
} from "@/utils/validate";
export default {
    // name: "添加",
    components: {},
    props: {
        deviceDetails: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        let that = this;
        const checkDeviceName = (rule, value, callback) => {
            if (value != undefined && value.length > 0) {
                if (value.length > 32) {
                    // 设备名称长度不超过32个字符
                    callback(new Error(that.$t("deviceManage.deviceAddText1")));
                } else if (validateSpecial(value)) {
                    // callback(new Error("设备名称请勿包含字符：\\/:*?\"<|'&%>"));
                    callback(
                        new Error(
                            that.$t("deviceManage.deviceAddText2") +
                                "：\\/:*?\"<|'&%>"
                        )
                    );
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        const checkCustomOrder = (rule, value, callback) => {
            if (value != undefined && value.length > 0) {
                if (value.length > 32) {
                    // callback(new Error("定制单号长度不超过32个字符"));
                    callback(new Error(that.$t("deviceManage.deviceAddText3")));
                } else if (validateSpecial(value)) {
                    // callback(new Error("定制单号请勿包含字符：\\/:*?\"<|'&%>"));
                    callback(
                        new Error(
                            that.$t("deviceManage.deviceAddText4") +
                                "：\\/:*?\"<|'&%>"
                        )
                    );
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        const checkDeviceModelCode = (rule, value, callback) => {
            if (value != undefined && value.length > 0) {
                if (value.length > 30) {
                    // callback(new Error("设备型号不超过30个字符"));
                    callback(new Error(that.$t("deviceManage.deviceAddText5")));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        //车牌号校验
        const checkPlateNum = (rule, value, callback) => {
            if (value != undefined && value.length > 0) {
                if (value.length <= 20) {
                    callback();
                } else {
                    // callback(new Error("车牌号长度不能超过20"));
                    callback(new Error(that.$t("deviceManage.deviceAddText6")));
                }
            } else {
                // callback(new Error("车牌号不能为空"));
                callback(new Error(that.$t("deviceManage.deviceAddText7")));
            }
        };
        return {
            msgDialogVisible: false,
            loadSubmit: false,
            showIfReAdd: false,
            device_code,
            type: this.deviceDetails.type,
            exampleVisible: false,
            activeName: "first",
            deviceModelList: [],
            firmwareLanguageList: [
                {
                    value: "CN",
                    label: this.$t("carManage.simpleChinese"), //"简体中文"
                },
                {
                    value: "EN",
                    label: this.$t("carManage.english"), // "英文"
                },
            ],
            organizeId: this.deviceDetails.organizeId,
            addTerminalForm: {
                deviceModelCode: "",
                deviceCode: "",
                plateNum: "",
                customOrder: "",
                deviceSerialNum: "",
                language: "CN",
                videoChannels: [],
                deviceName: "",
                normalCard: "",
            },
            formValidate: {
                deviceModelCode: [
                    {
                        required: false,
                        validator: checkDeviceModelCode,
                        trigger: "blur",
                    },
                ],
                deviceSerialNum: [
                    {
                        required: true,
                        message: this.$t("deviceManage.deviceAddText8"), //"设备序列号不能为空",
                        trigger: "blur",
                    },
                ],
                deviceCode: [
                    {
                        required: true,
                        message: this.$t("deviceManage.deviceAddText9"), //"终端手机号不能为空",
                        trigger: "blur",
                    },
                ],
                plateNum: [
                    {
                        required: true,
                        validator: checkPlateNum,
                        trigger: "blur",
                    },
                ],
                language: [
                    {
                        required: true,
                        message: this.$t("deviceManage.deviceAddText10"), // "固件语言不能为空",
                        trigger: "change",
                    },
                ],
                normalCard: [
                    {
                        required: true,
                        type: "number",
                        message: this.$t("deviceManage.deviceAddText11"), //"SIM卡类型不能为空",
                        trigger: "change",
                    },
                ],
                deviceName: [{ validator: checkDeviceName, trigger: "blur" }],
                customOrder: [{ validator: checkCustomOrder, trigger: "blur" }],
            },
            protocol: "",
            deviceModelCode: "",
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
    watch: {
        // "addTerminalForm.deviceModelCode": {
        //     handler(val) {
        //         this.deviceModelList.forEach((i) => {
        //             if (i.fieldNameEN === val) {
        //                 this.protocol = i.agreement;
        //                 this.deviceModelCode = i.fieldNameCN.split("(")[0];
        //             }
        //         });
        //     },
        //     deep: true,
        // },
    },
    methods: {
        doTipCancel() {
            this.showIfReAdd = false;
            this.loadSubmit = false;
        },
        deviceSerialNumBlur(event) {
            if (event.target.value) {
                const params = {
                    protocol: this.protocol,
                    deviceSerialNum: event.target.value,
                };
                this.$api.generateDeviceCode(params).then((res) => {
                    if (res.success == true) {
                        this.addTerminalForm.deviceCode = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            }
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
            let channelList = this.addTerminalForm.videoChannels;
            let flag = true;
            let channelNumList = [];
            channelList.forEach((item) => {
                if (item.channelNum == "" || item.channelName == "") {
                    flag = false;
                }
                channelNumList.push(item.channelNum);
            });
            if (!flag) {
                // this.$message.warning("请完善通道信息");
                this.$message.warning(this.$t("deviceManage.deviceAddText12"));
                this.loadSubmit = false;
                return;
            }
            if (
                Array.from(new Set(channelNumList)).length !=
                channelNumList.length
            ) {
                // this.$message.warning("通道编号不能重复");
                this.$message.warning(this.$t("deviceManage.deviceAddText13"));
                this.loadSubmit = false;
                return;
            }
            this.$refs.addTerminalForm.validate((valid) => {
                if (valid) {
                    if (this.type === "add") {
                        const param = Object.assign(this.addTerminalForm, {
                            organizeId: this.organizeId,
                            protocol: this.protocol,
                        });
                        this.$api.addDeviceInfo(param).then((res) => {
                            // this.loading = false;
                            this.loadSubmit = false;
                            if (res.success == true) {
                                // this.$message.success("设备添加成功!");
                                this.$message.success(
                                    this.$t("deviceManage.deviceAddText14")
                                );
                                this.cancelDialog();
                                this.$emit("handleSuccess");
                                // this.$router.push("/manageCenter/deviceManage");
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                    } else {
                        const param = Object.assign(this.addTerminalForm, {
                            organizeId: this.deviceDetails.organizeId,
                            protocol: this.protocol,
                        });
                        this.$api.editDeviceInfo(param).then((res) => {
                            // this.loading = false;
                            this.loadSubmit = false;
                            if (res.success == true) {
                                // this.$message.success("设备编辑成功!");
                                this.$message.success(
                                    this.$t("deviceManage.deviceAddText15")
                                );
                                this.cancelDialog();
                                this.$emit("handleSuccess");
                                // this.$router.push("/manageCenter/deviceManage");
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                    }
                } else {
                    this.loadSubmit = false;
                }
            });
        },
        cancelDialog() {
            this.$emit("deviceVisibleClose");
            // this.$router.push("/manageCenter/deviceManage");
        },
        handleClick() {},
        ifReAdd() {
            this.$api.ifReAdd(this.addTerminalForm.plateNum).then((res) => {
                if (res.success == true) {
                    if (res.data == 1) {
                        this.showIfReAdd = true;
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
        addVedioChannel() {
            if (this.addTerminalForm.videoChannels.length == 0) {
                this.addTerminalForm.videoChannels.push({
                    channelNum: "1",
                    channelName: this.$t("deviceLoadTaskManage.channel") + "1", //"通道1",
                });
            } else {
                if (this.addTerminalForm.videoChannels.length >= 24) {
                    // this.$message.error("最多只能添加24个通道");
                    this.$message.error(
                        this.$t("deviceManage.deviceAddText16")
                    );
                } else {
                    let length = this.addTerminalForm.videoChannels.length;
                    this.addTerminalForm.videoChannels.push({
                        channelNum: length + 1 + "",
                        channelName:
                            this.$t("deviceLoadTaskManage.channel") +
                            (length + 1),
                    });
                }
            }
        },
        deleteItem(index) {
            this.addTerminalForm.videoChannels.splice(index, 1);
        },
        /**
         * 编辑获取详情
         */
        getDetail() {
            if (this.type === "edit") {
                // this.$route.meta.title = "编辑";
                const param = {
                    id: this.deviceDetails.id,
                };
                this.$api.getDeviceInfo(param).then((res) => {
                    if (res.success == true) {
                        this.addTerminalForm = res.data;
                        this.protocol = res.data.protocol;
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
                        Desc: "808接入18884端口；固件下载、参数配置文件对应的IP，19999端口；预览、录像回放",
                    },
                    {
                        IP: "47.114.190.241",
                        Desc: "设备打印日志上传、录像文件上传（万一客户平台无法下载录像文件，可通过运维平台下载）",
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
                    this.$message.success("信息已复制到剪贴板，可贴粘");
                },
                () => {
                    this.$message.error("复制失败，请重试");
                }
            );
        },
        clearNoUseDeviceModel() {
            this.$confirm(
                // "此操作将会清除项目中没有使用到的型号，确定要清除吗？",
                this.$t("deviceManage.deviceAddText17"),
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.$api.clearNoUseDeviceModel().then((res) => {
                        if (res.success == true) {
                            this.getDeviceModelList();
                            // this.$message.success("清除成功！");
                            this.$message.success(
                                this.$t("deviceManage.deviceAddText18")
                            );
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                })
                .catch(() => {});
        },
    },
    mounted() {
        this.getDeviceModelList();
        this.getDetail();
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
        height: 760px;
    }
    // /deep/ .el-input,.el-select {
    //     width: 500px;
    // }
    .container {
        padding: 0 24px;
    }

    .formItemRight {
        height: 60px;
        line-height: 88px;
    }
    .device-num {
        position: relative;
        .m-l-sm {
            position: absolute;
            top: -32px;
            right: 0px;
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
        width: 1150px;
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
</style>
