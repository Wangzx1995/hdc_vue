<template>
    <div>
        <!-- 上传固件包 -->
        <el-dialog
            :title="$t('firmware.uploadFirmwarePackage')"
            :visible="firmwareVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="close"
            :width="'650px'"
            :top="'5vh'"
            class="firmware-upload"
        >
            <div style="height: 540px; overflow-y: auto">
                <el-form
                    :model="firmwareForm"
                    :rules="rules"
                    ref="firmwareForm"
                    class="m-x-md"
                    label-width="135px"
                >
                    <!-- 固件类型 -->
                    <el-form-item
                        prop="type"
                        :label="$t('firmware.firmwareType')"
                    >
                        <el-radio-group
                            v-model="firmwareForm.type"
                            @change="changeFirmwareType"
                        >
                            <el-radio class="radio" label="main">
                                <!-- 主机 -->
                                {{ $t("firmware.host") }}
                            </el-radio>
                            <el-radio class="radio" label="peripheral">
                                <!-- 外设 -->
                                {{ $t("firmware.peripherals") }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- '设备型号': '主机型号' -->
                    <el-form-item
                        :prop="
                            firmwareForm.type === 'main'
                                ? 'deviceModelCode'
                                : 'deviceModelCode2'
                        "
                        :label="
                            firmwareForm.type === 'main'
                                ? $t('common.deviceModelCode')
                                : $t('firmware.hostModel')
                        "
                        v-if="refresh"
                    >
                        <el-select
                            style="width: 100%"
                            v-model="firmwareForm.deviceModelCode"
                            :placeholder="
                                $t('firmware.deviceModelCodePlaceholder')
                            "
                            @change="handleChange"
                            :disabled="
                                !!firmwareForm.fileName ||
                                (!!$route.query.deviceModelCode &&
                                    firmwareForm.type === 'main')
                            "
                            :collapse-tags="firmwareForm.type === 'peripheral'"
                            clearable
                            filterable
                        >
                            <el-option
                                v-for="(item, index) in !!$route.query
                                    .deviceModelCode
                                    ? deviceModelList.filter(
                                          (k) =>
                                              k.fieldNameEN ===
                                              $route.query.deviceModelCode
                                      )
                                    : deviceModelList"
                                :key="index"
                                :value="item.fieldNameEN"
                                :label="item.fieldNameCN"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 选择服务器类型 -->
                    <el-form-item
                        prop="serverType"
                        :label="$t('firmware.selectServerType')"
                        v-show="firmwareForm.type == 'main'"
                    >
                        <el-radio-group
                            v-model="firmwareForm.serverType"
                            @change="changeServerType"
                        >
                            <el-radio
                                :disabled="
                                    uploadStatus || firmwareForm.fileName != ''
                                "
                                class="radio"
                                label="0"
                                >HTTP</el-radio
                            >
                            <el-radio
                                v-if="firmwareForm.type == 'main'"
                                :disabled="
                                    uploadStatus || firmwareForm.fileName != ''
                                "
                                class="radio"
                                label="1"
                                >FTP</el-radio
                            >
                        </el-radio-group>
                        <div
                            class="warning-box"
                            v-if="firmwareForm.serverType == 1"
                        >
                            <i class="el-icon-warning"></i>
                            <span class="warning-msg">
                                <!-- 请确认设备支持ftp固件升级方式！ -->
                                {{ $t("firmware.selectServerTypeDesc") }}！
                            </span>
                        </div>
                    </el-form-item>
                    <!-- 是否分享给子账号 -->
                    <el-form-item
                        prop="shareOpen"
                        v-if="isAdmin && firmwareForm.serverType == '0'"
                    >
                        <template slot="label">
                            <span>
                                <!-- 是否分享给子账号 -->
                                {{ $t("firmware.shareWithSubAccount") }}
                            </span>
                            <!-- 分享后所有子账号均能查看到该固件包 -->
                            <el-tooltip
                                :content="$t('firmware.shareWithSubAccountSec')"
                            >
                                <i class="el-icon-warning-outline"></i>
                            </el-tooltip>
                        </template>
                        <el-radio-group v-model="firmwareForm.shareOpen">
                            <el-radio class="radio" :label="0">
                                <!-- 否 -->
                                {{ $t("common.not") }}
                            </el-radio>
                            <el-radio class="radio" :label="1">
                                <!-- 是 -->
                                {{ $t("common.yes") }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 外设名称 -->
                    <el-form-item
                        prop="peripheralType"
                        :label="$t('firmware.peripheralName')"
                        v-if="firmwareForm.type == 'peripheral'"
                    >
                        <el-select
                            style="width: 100%"
                            v-model="firmwareForm.peripheralType"
                            :placeholder="$t('common.select')"
                            clearable
                            :disabled="!!firmwareForm.fileName"
                        >
                            <el-option
                                v-for="(item, index) in deviceTypeList"
                                :key="index"
                                :value="item.sysDictCode"
                                :label="item.sysDictName"
                            ></el-option>
                        </el-select>
                        <!-- <el-input v-model="firmwareForm.peripheralType" v-else clearable></el-input> -->
                    </el-form-item>
                    <!-- 选择固件 -->
                    <el-form-item
                        :class="{
                            loading_: uploadStatus,
                        }"
                        prop="fileName"
                        :label="$t('firmware.selectFirmware')"
                        v-if="
                            (firmwareForm.type === 'main' &&
                                firmwareForm.serverType == '0') ||
                            firmwareForm.type === 'peripheral'
                        "
                    >
                        <div
                            :class="{
                                loading_: uploadStatus,
                            }"
                        >
                            <Upload
                                v-if="
                                    firmwareVisible &&
                                    ((firmwareForm.type === 'main' &&
                                        firmwareForm.serverType == '0' &&
                                        firmwareForm.deviceModelCode) ||
                                        (firmwareForm.type === 'peripheral' &&
                                            firmwareForm.peripheralType))
                                "
                                ref="upload"
                                class="upload-demo"
                                :accept="'.dav,.bin,.zip,.apk,.ipa,.upd,.APP'"
                                :action="uploadUrl"
                                :data="uploadData"
                                single-file
                                :on-success="handleSuccess"
                                :on-error="handleError"
                                :before-upload="handleBeforeUpload"
                                :on-remove="handleRemove"
                                :file-list="fileList"
                                :limit="1"
                                :multiple="false"
                                :disabled="
                                    firmwareForm.fileName != '' ||
                                    (placeholderBol &&
                                        firmwareForm.type == 'peripheral') ||
                                    (firmwareForm.type == 'peripheral' &&
                                        !firmwareForm.peripheralType)
                                "
                            >
                                <div
                                    :class="{
                                        loading_:
                                            firmwareForm.fileName != '' ||
                                            (firmwareForm.type ==
                                                'peripheral' &&
                                                !firmwareForm.peripheralType),
                                    }"
                                >
                                    <el-button
                                        v-if="firmwareForm.fileName == ''"
                                        type="default"
                                        icon="el-icon-upload"
                                        class="w-sm"
                                        :disabled="
                                            firmwareForm.fileName != '' ||
                                            (firmwareForm.type ==
                                                'peripheral' &&
                                                !firmwareForm.peripheralType)
                                        "
                                    >
                                        <!-- "解析中..." ： "选择文件" -->
                                        {{
                                            readFileing
                                                ? $t(
                                                      "firmware.analyzingInProgress"
                                                  ) + "..."
                                                : $t("firmware.selectFile")
                                        }}
                                    </el-button>
                                </div>
                            </Upload>
                            <div v-else>
                                <el-button
                                    icon="el-icon-upload"
                                    @click="beforeUploadWarning"
                                >
                                    <!-- 选择文件 -->
                                    {{ $t("firmware.selectFile") }}
                                </el-button>
                            </div>
                            <div>
                                <!-- "请使用谷歌浏览器上传外设固件" : "仅支持dav、bin、zip、apk、ipa、upd、APP格式" -->
                                {{
                                    placeholderBol &&
                                    firmwareForm.type == "peripheral"
                                        ? $t("firmware.selectFileText1")
                                        : $t("firmware.selectFileText2")
                                }}
                            </div>
                        </div>
                    </el-form-item>
                    <!-- FTP URL地址 -->
                    <el-form-item
                        prop="ftpUrl"
                        :label="$t('firmware.FTPURLAddress')"
                        v-if="
                            firmwareForm.serverType == '1' &&
                            firmwareForm.type != 'peripheral'
                        "
                    >
                        <el-input
                            :placeholder="$t('common.input')"
                            v-model="firmwareForm.ftpUrl"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <!-- '设备版本号': '外设版本号' -->
                    <el-form-item
                        prop="firmwareVersion"
                        :label="
                            firmwareForm.type === 'main'
                                ? $t('firmware.deviceVersionNumber')
                                : $t('firmware.peripheralVersionNumber')
                        "
                        v-if="refresh"
                    >
                        <!-- 当前浏览器不支持自动获取设备版本+build号，请手动输入或切换浏览器 -->
                        <el-input
                            :placeholder="
                                placeholderBol
                                    ? $t('firmware.buildFirmwareVersionText1')
                                    : ''
                            "
                            v-model="firmwareForm.firmwareVersion"
                            :disabled="isGetVersion"
                            clearable
                        ></el-input>
                        <div v-if="firmwareForm.type === 'main'">
                            <!-- 示例：V1.2.2 -->
                            {{ $t("firmware.buildFirmwareVersionText2") }}
                            <!-- build210110(版本号与build号之间保持一个空格) -->
                            {{ $t("firmware.buildFirmwareVersionText3") }}
                        </div>
                    </el-form-item>
                    <!-- 备注 -->
                    <el-form-item prop="remark" :label="$t('firmware.notes')">
                        <el-input
                            style="white-space: pre-wrap"
                            type="textarea"
                            :placeholder="remarkPlaceholder"
                            :rows="5"
                            maxlength="200"
                            show-word-limit
                            v-model="firmwareForm.remark"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="close">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button
                    type="primary"
                    :loading="uploadStatus"
                    :disabled="uploadStatus"
                    @click="submit"
                >
                    <!-- "添加中" : "确 定"  -->
                    {{
                        uploadStatus ? $t("firmware.addingIn") : $t("common.ok")
                    }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { validateVersionBuild, validateFTP } from "@/utils/validate";
// import {Upload} from 'iview'
import { Axios } from "axios";
// import func from 'vue-editor-bridge';
const readerVersion = new FileReader();
function throttle(fn, interval = 500) {
    let last = 0;
    return function (...args) {
        let now = +new Date();
        if (now - last > interval) {
            last = now;
            fn.call(this, args);
        }
    };
}
export default {
    props: {
        isAdmin: {
            type: Boolean,
            default: false,
        },
        visible: {
            type: Boolean,
            default: false,
        },
        defaultType: {
            type: String,
            default: "",
        },
        action: {
            type: String,
            default:
                (process.env.BASE_API == "/" ? "" : process.env.BASE_API) +
                "OSS/uploadFiles",
        },
    },
    // components:{'iUpload':Upload},
    watch: {
        visible: {
            handler(val) {
                this.firmwareVisible = val;
                if (val) {
                    if (!!this.$route.query.deviceModelCode) {
                        if (this.defaultType === "main") {
                            this.deviceModelCode =
                                this.$route.query.deviceModelCode;
                            this.productKeyCopy = this.deviceModelCode;
                        }
                    }
                    this.handleReset(this.$refs.firmwareForm);
                    if (!this.deviceModelCode) this.productType = "";
                    this.readFileing = false;
                    this.firmwareForm = {
                        shareOpen: 0,
                        deviceModelCode: this.productKeyCopy
                            ? this.productKeyCopy
                            : "",
                        serverType: "0",
                        type: this.defaultType,
                        firmwareVersion: "",
                        orderNo: "",
                        remark: "",
                        peripheralType: "",
                        ftpUrl: "",
                        fileName: "",
                        originalFileName: "",
                        fileSize: null,
                        firmwareGuid: "",
                        language: "CN",
                    };
                    this.fileList = [];
                    this.uploadStatus = false;
                }
            },
            deep: true,
            immediate: true,
        },
        deviceModelCode: {
            handler(val) {
                if (val) {
                    this.handleChange(val);
                }
            },
            deep: true,
            immediate: true,
        },
        productType: {
            handler(val) {
                if (val) {
                    this.getDeviceType();
                }
            },
            deep: true,
            immediate: true,
        },
        diffPackage: 0,
    },
    data() {
        const checkFileName = (rule, value, callback) => {
            if (this.networkError) {
                // 上传失败，请检查网络是否正常
                callback(
                    new Error(this.$t("firmware.firmwareUploadValidatorText1"))
                );
            }
            if (this.diffPackage === 1) {
                callback(
                    // 上传失败，仅支持上传全量包，不支持上传差分包
                    new Error(this.$t("firmware.firmwareUploadValidatorText2"))
                );
            }
            this.diffPackage = 0;
            if (value != "") {
                callback();
            } else {
                // 请选择固件
                callback(
                    new Error(this.$t("firmware.firmwareUploadValidatorText3"))
                );
            }
        };
        const checkVersionBuild = (rule, value, callback) => {
            if (value) {
                if (
                    this.firmwareForm.type === "main" &&
                    !validateVersionBuild(value)
                ) {
                    // 设备版本号+build号不合规范
                    callback(
                        new Error(
                            this.$t("firmware.firmwareUploadValidatorText4")
                        )
                    );
                } else {
                    callback();
                }
            } else {
                // 请输入设备版本号+build号
                callback(
                    new Error(this.$t("firmware.firmwareUploadValidatorText5"))
                );
            }
        };
        const checkFTP = (rule, value, callback) => {
            if (value != undefined && value.length > 0) {
                if (!validateFTP(value)) {
                    // FTP URL地址不合规范
                    callback(
                        new Error(
                            this.$t("firmware.firmwareUploadValidatorText7")
                        )
                    );
                } else {
                    callback();
                }
            } else {
                // 请输入FTP URL地址
                callback(
                    new Error(this.$t("firmware.firmwareUploadValidatorText8"))
                );
            }
        };
        return {
            remarkPlaceholder: this.$t("firmware.remarkPlaceholder"), //"请描述本次活动\n例如：\n1、该版本优化了XXXXXX\n2、该版本修复了XXXXXX\n3、该版本新增了XXXXXX",
            refresh: true,
            networkError: false,
            rules: {
                deviceModelCode: [
                    {
                        required: true,
                        // message: "请选择设备型号",
                        message: this.$t(
                            "firmware.firmwareUploadValidatorText9"
                        ),
                    },
                ],
                fileName: [
                    {
                        required: true,
                        validator: checkFileName,
                        trigger: "blur",
                    },
                ],
                ftpUrl: [
                    { required: true, validator: checkFTP, trigger: "blur" },
                ],
                serverType: [
                    {
                        required: true,
                        // message: "请选择服务器类型",
                        message: this.$t(
                            "firmware.firmwareUploadValidatorText10"
                        ),
                        trigger: "change",
                    },
                ],
                shareOpen: [
                    {
                        required: true,
                        // message: "请选择是否分享给子账号",
                        message: this.$t(
                            "firmware.firmwareUploadValidatorText11"
                        ),
                        trigger: "change",
                    },
                ],
                type: [
                    {
                        required: true,
                        // message: "请选择固件类型",
                        message: this.$t(
                            "firmware.firmwareUploadValidatorText12"
                        ),
                        trigger: "change",
                    },
                ],
                firmwareVersion: [
                    {
                        required: true,
                        validator: checkVersionBuild,
                        trigger: "blur",
                    },
                ],
                orderNo: [
                    {
                        max: 32,
                        // message: "定制单号长度不超过32个字符",
                        message: this.$t(
                            "firmware.firmwareUploadValidatorText13"
                        ),
                        trigger: "blur",
                    },
                ],
                peripheralType: [
                    {
                        required: true,
                        // message: "请选择外设名称",
                        message: this.$t(
                            "firmware.firmwareUploadValidatorText14"
                        ),
                        trigger: "blur change",
                    },
                ],
            },
            deviceModelList: [],
            readFileing: false,
            placeholderBol: "",
            deviceModelCode: "",
            productType: "",
            firmwareVisible: false,
            firmwareForm: {
                shareOpen: 0,
                deviceModelCode: "",
                serverType: "0",
                type: "main",
                firmwareVersion: "",
                orderNo: "",
                remark: "",
                peripheralType: "",
                ftpUrl: "",
                fileName: "",
                originalFileName: "",
                fileSize: null,
                firmwareGuid: "",
                language: "CN",
            },
            fileList: [],
            fileType: ["dav", "bin", "zip", "apk", "ipa", "upd", "APP"],
            fileTypeList: [
                ".dav",
                ".bin",
                ".zip",
                ".apk",
                ".ipa",
                ".upd",
                ".APP",
            ],
            uploadData: {
                businessType: 7,
            },
            uploadUrl: this.action,
            file: null,
            peripheraNameList905: [],
            deviceTypeList: [],
            uploadStatus: false,
            productKeyCopy: this.deviceModelCode,
            isGetVersion: false,
            omsProjectFileSpace: {},
        };
    },
    methods: {
        getDeviceType() {
            this.$api.newFirmwareGetPeripheralList().then((res) => {
                if (res.success == true) {
                    this.deviceTypeList = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        get905PeripheraNameList() {
            this.$api.get905PeripheraNameList().then((res) => {
                if (res.success == true) {
                    this.peripheraNameList905 = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        changeServerType() {
            if (this.$refs.upload) {
                this.$refs.upload.clearFiles();
                this.handleRemove();
            }
            this.firmwareForm.ftpUrl = "";
            this.$refs.firmwareForm.clearValidate();
        },
        changeFirmwareType(val) {
            this.refresh = false;
            this.isGetVersion = false;
            this.firmwareForm.fileName = "";
            this.firmwareForm.originalFileName = "";
            this.firmwareForm.firmwareVersion = "";
            this.firmwareForm.deviceModelCode = null;
            this.firmwareForm.fileSize = null;
            this.$refs.firmwareForm.clearValidate();
            if (!!this.$route.query.deviceModelCode) {
                if (val === "main") {
                    this.deviceModelCode = this.$route.query.deviceModelCode;
                    this.firmwareForm.deviceModelCode =
                        this.$route.query.deviceModelCode;
                }
            }
            this.uploadStatus = false;
            this.$forceUpdate();
            this.$nextTick(() => {
                this.refresh = true;
            });
        },
        handleBeforeUpload(file) {
            // const check = this.file.length < 1;
            if (file.name) {
                // this.$refs.firmwareForm.clearValidate()
                this.$refs.firmwareForm.clearValidate("fileName");
            }
            // this.$refs['firmwareForm'].clearValidate();
            // this.$refs.firmwareForm.clearValidate(['fileName'])
            if (this.uploadStatus) {
                this.$refs.upload.post("");
                return;
            }
            this.file = file;

            if (this.placeholderBol && this.firmwareForm.type != "main") {
                return false;
            }

            let this_ = this;
            let typeStr = this.fileType.join("、");
            let isTYPE = false;
            this.fileTypeList.map((i) => {
                if (file.name.includes(i)) {
                    isTYPE = true;
                }
            });
            const isLt2M = file.size < 5120000000;

            if (!isTYPE) {
                // this.$message.error(`上传格式只能是 ${typeStr} 格式!`);
                this.$message.error(
                    this.$t("firmware.fileTypeText1", { typeStr: typeStr })
                );
                return false;
            }
            if (!isLt2M) {
                // this.$message.error("上传文件大小不能超过 500MB!");
                this.$message.error(this.$t("firmware.fileTypeText2"));
                return false;
            }
            // if (
            //     file.size + this.omsProjectFileSpace.totalFileSize >
            //     this.omsProjectFileSpace.projectFileSpaceSize
            // ) {
            //     this.$message.error(
            //         "固件上传失败，已到达限制大小，请清理不常用的固件包！"
            //     );
            //     return false;
            // }
            for (let i = 0; i < this.deviceModelList.length; i++) {
                if (
                    this.firmwareForm.type === "main" &&
                    this.deviceModelList[i].fieldNameEN ==
                        this.firmwareForm.deviceModelCode
                ) {
                    this.deviceModelCode =
                        this.deviceModelList[i].fieldNameCN.split("(")[0];
                }
            }
            let params = {
                businessType: 7,
                originalFileName: file.name,
                deviceType: "",
                deviceModelCode: this.deviceModelCode,
                fileMD5Code: "",
            };
            if (this.firmwareForm.type == "main") {
                params.deviceModelCode = this.deviceModelCode;
            } else {
                params.deviceModelCode = this.firmwareForm.deviceModelCode;
            }
            let fileArray = file.name.split(".");
            if (this.firmwareForm.type == "main") {
                params.deviceType = "00";
                if (fileArray[fileArray.length - 1] == "dav") {
                    // this.calculateMd5(0, 64);
                }
            } else if (this.firmwareForm.type == "peripheral") {
                params.deviceType = this.firmwareForm.peripheralType;
                this.firmwareForm.fileName = file.name;
            }
            return new Promise((allResolve, allReject) => {
                this.calculateMd5()
                    .then(() => {
                        if (!this.placeholderBol) {
                            let this_ = this;
                            this_.readFileing = true;
                            let promise = new Promise((resolve, reject) => {
                                this_.listenButtonClick(file, async (file) => {
                                    //回调完成md5加密完毕后的文件MD5值
                                    const { md5 } = await md5WasmMem(file); //赋值
                                    if (md5) {
                                        this_.$refs.upload.clearFiles();
                                        resolve(md5);
                                    } else {
                                        reject();
                                    }
                                });
                            })
                                .then(function onFulfilled(data) {
                                    if (this_.firmwareForm.type == "main") {
                                        params.fileMD5Code =
                                            "97c20f97f044716ca23691a5102b3e0d";
                                    } else {
                                        params.fileMD5Code = data;
                                    }
                                    return new Promise((resolve, reject) => {
                                        this_.$api
                                            .getFileUploadInfoByOriginalFileName(
                                                params
                                            )
                                            .then((res) => {
                                                if (res.success == true) {
                                                    resolve(res.data);
                                                } else {
                                                    reject(res.msg);
                                                }
                                            });
                                    })
                                        .then(function onFulfilled(data) {
                                            this_.uploadUrl = data.host;
                                            for (let item in data) {
                                                this_.uploadData[item] =
                                                    data[item];
                                            }
                                            // this_.uploadData.key=data.fileName;
                                            // this_.uploadData.OSSAccessKeyId=data.OSSAccessKeyId;
                                            // this_.uploadData.policy=data.policy;
                                            // this_.uploadData.Signature=data.Signature;
                                            this_.firmwareForm.originalFileName =
                                                file.name;
                                            this_.firmwareForm.fileName =
                                                data.fileName;
                                            this_.firmwareForm.fileSize =
                                                file.size;
                                            this_.$nextTick(() => {
                                                this_.$refs.upload.action =
                                                    this_.uploadUrl;
                                                this_.$refs.upload.data =
                                                    this_.uploadData;
                                                this_.$refs.upload.post(file);
                                                this_.uploadStatus = true;
                                                this_.readFileing = false;
                                            });
                                            // this_.$refs.upload.action = this_.uploadUrl;
                                        })
                                        .catch(function onRejected(error) {
                                            this_.$message.error(error);
                                            return false;
                                        });
                                })
                                .catch();
                            return false;
                        } else {
                            if (this_.firmwareForm.type == "main") {
                                params.fileMD5Code =
                                    "97c20f97f044716ca23691a5102b3e0d";
                                let promise = new Promise((resolve, reject) => {
                                    this_.$api
                                        .getFileUploadInfoByOriginalFileName(
                                            params
                                        )
                                        .then((res) => {
                                            if (res.success == true) {
                                                resolve(res.data);
                                            } else {
                                                reject(res.msg);
                                            }
                                        });
                                })
                                    .then(function onFulfilled(data) {
                                        this_.uploadUrl = data.host;
                                        for (let item in data) {
                                            this_.uploadData[item] = data[item];
                                        }

                                        // this_.uploadData.key=data.fileName;
                                        // this_.uploadData.OSSAccessKeyId=data.OSSAccessKeyId;
                                        // this_.uploadData.policy=data.policy;
                                        // this_.uploadData.Signature=data.Signature;
                                        this_.firmwareForm.originalFileName =
                                            file.name;
                                        this_.firmwareForm.fileName =
                                            data.fileName;
                                        this_.firmwareForm.fileSize = file.size;
                                        this_.$nextTick(() => {
                                            this_.$refs.upload.action =
                                                this_.uploadUrl;
                                            this_.$refs.upload.data =
                                                this_.uploadData;
                                            this_.$refs.upload.post(file);
                                            this_.uploadStatus = true;
                                        });
                                        // this_.$refs.upload.action = this_.uploadUrl;
                                    })
                                    .catch(function onRejected(error) {
                                        this_.$message.error(error);
                                        return false;
                                    });
                            } else {
                                return false;
                            }
                            return false;
                        }
                    })
                    .catch((err) => {
                        this.handleError(err);
                        allReject();
                        return false;
                    });
            });
        },
        async listenButtonClick(file, callback) {
            await callback(file);
        },
        calculateMd5() {
            return new Promise((resolve, reject) => {
                this.$nextTick(() => {
                    let result = "";
                    if (this.file.size > 5120) {
                        let arr = [
                            this.file.slice(0, 4096),
                            this.file.slice(-1024),
                        ];
                        result = new File(arr, this.file.name);
                    } else {
                        result = this.file;
                    }
                    var formData = new FormData(); // 可以增加表单数据
                    formData.append("file", result);
                    formData.append("fileSize", result.size);
                    this.$api
                        .newFirmwareGetFirmwareInfo(formData)
                        .then((res) => {
                            //差分包不允许上传
                            if (res.success == true) {
                                this.diffPackage = res.data.diffPackage;
                                if (this.diffPackage === 1) {
                                    if (this.$refs.upload) {
                                        this.$refs.upload.clearFiles();
                                        this.handleRemove();
                                    }
                                    this.firmwareForm.ftpUrl = "";
                                    this.$refs.firmwareForm.clearValidate();
                                    this.$refs.firmwareForm.validateField(
                                        "fileName"
                                    );
                                    reject();
                                } else {
                                    this.firmwareForm.firmwareGuid =
                                        res.data.firmwareGuid || "";
                                    this.firmwareForm.firmwareVersion = res.data
                                        ? res.data.version
                                        : "";
                                    this.isGetVersion = !!res.data.version;
                                    resolve();
                                }
                            } else {
                                // reject(res);
                                this.firmwareForm.firmwareGuid = "";
                                this.firmwareForm.firmwareVersion = "";
                                resolve();
                            }
                        });
                });
            });
            // 申请空间
        },
        resetForm() {
            this.$refs.firmwareForm.resetFields();
        },
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
            }
        },
        submit: throttle(function (e) {
            this.uploadStatus = true;
            this.$refs.firmwareForm.validate((valid, invalidFields) => {
                if (valid) {
                    let params = JSON.parse(JSON.stringify(this.firmwareForm));
                    if (params.type === "main" && params.serverType == "1") {
                        params.fileName = params.ftpUrl;
                    }
                    delete params.orderNo;
                    delete params.ftpUrl;
                    this.$api.newFirmwareAddFirmware(params).then((res) => {
                        if (res.success == true) {
                            this.$emit("close", true);
                            // 添加固件成功！
                            this.$message.success(
                                this.$t("firmware.addFirmwareSuccess")
                            );
                        } else {
                            this.$message.error(res.msg);
                        }
                        this.uploadStatus = false;
                        this.$api.eventTrackTrigger({
                            menu: "FIRMWARE_MANAGE",
                            business: "FIRMWARE_UPLOAD",
                            eventResult: res.success,
                        });
                    });
                    // if (this.firmwareForm.type == "peripheral") {
                    //     delete params.deviceModelCode;
                    //     this.$api
                    //         .upgradeAddPeripheralFirmwareTemp(params)
                    //         .then((res) => {
                    //             if (res.success == true) {
                    //                 this.$emit("close", true);
                    //                 this.$message.success("添加固件成功！");
                    //             } else {
                    //                 this.$message.error(
                    //                     "添加固件失败:" + res.msg
                    //                 );
                    //             }
                    //             this.uploadStatus = false;
                    //             this.$api.eventTrackTrigger({
                    //                 menu: "FIRMWARE_MANAGE",
                    //                 business: "FIRMWARE_UPLOAD",
                    //                 eventResult: res.success,
                    //             });
                    //         });
                    // } else {
                    //     delete params.deviceModelCodes;
                    //     this.$api.upgradeAddFirmwareTemp(params).then((res) => {
                    //         if (res.success == true) {
                    //             this.$emit("close", true);
                    //             this.$message.success("添加固件成功！");
                    //         } else {
                    //             this.$message.error("添加固件失败:" + res.msg);
                    //         }
                    //         this.uploadStatus = false;
                    //         this.$api.eventTrackTrigger({
                    //             menu: "FIRMWARE_MANAGE",
                    //             business: "FIRMWARE_UPLOAD",
                    //             eventResult: res.success,
                    //         });
                    //     });
                    // }
                } else {
                    this.uploadStatus = false;
                    // return false;
                }
            });
        }),
        handleChange(val) {
            // let type = this.firmwareForm.type;
            this.productType = "808";
            // if (val && val.includes("808")) {
            //     this.productType = "808";
            // } else if (val && val.includes("905")) {
            //     this.productType = "905";
            // } else {
            //     this.productType = "";
            // }
            // this.$refs.firmwareForm && this.$refs.firmwareForm.resetFields();
            // this.firmwareForm.deviceModelCode = val;
            // this.firmwareForm.type = type;
            // this.firmwareForm.serverType = "0";
            // this.firmwareForm.shareOpen = 0;
        },
        // 获取设备型号下拉列表数据
        getDeviceModelList() {
            this.$api.getProductList_upgrade().then((res) => {
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
        close() {
            this.$emit("close");
            this.firmwareForm.deviceModelCode = "";
            this.firmwareForm.peripheralType = "";
            this.firmwareForm.fileName = "";
            this.firmwareForm.originalFileName = "";
            this.firmwareForm.fileSize = null;
            this.firmwareForm.firmwareVersion = "";
            this.firmwareForm.serverType = "0";
            this.firmwareForm.shareOpen = 0;
            this.$nextTick(() => {
                this.refresh = true;
            });
        },
        handleRemove(file, fileList) {
            this.firmwareForm.originalFileName = "";
            this.firmwareForm.fileName = "";
            this.firmwareForm.fileSize = "";
            this.uploadStatus = false;
            this.isGetVersion = false;
        },
        handleError(res) {
            this.networkError = true;
            if (res.msg == undefined) {
                this.$refs.firmwareForm.validateField("fileName");
                // this.$message.error(this.$t("common.uploadFailed"));
            } else if (res.msg.indexOf("400") > -1) {
                this.$refs.firmwareForm.validateField("fileName");
                // this.$message.error(this.$t("common.uploadFailed"));
            } else {
                this.$message.error(res.msg);
            }
            this.$refs.upload.clearFiles();
            this.firmwareForm.fileName = "";
            this.firmwareForm.originalFileName = "";
            this.firmwareForm.fileSize = null;
            this.uploadStatus = false;
        },
        handleSuccess(res, file) {
            this.networkError = false;
            this.uploadStatus = false;
            this.$refs.firmwareForm.clearValidate("fileName");

            // const reader = new FileReader();
            // reader.readAsArrayBuffer(file.raw.slice(0,108));
            // reader.addEventListener('load', e => {
            //   const arrayBuffer = e.target.result
            //   this.calculateMd5(arrayBuffer)
            // })
        },
        beforeUploadWarning() {
            this.$message.warning(
                // `请先选择${
                //     this.firmwareForm.type == "main" ? "设备型号" : "外设名称"
                // }`
                `${this.$t("firmware.pleaseChooseFirst")}${
                    this.firmwareForm.type == "main"
                        ? this.$t("common.deviceModelCode")
                        : this.$t("common.peripheralName")
                }`
            );
        },
        newFirmwareGetOmsProjectFileSpace() {
            this.$api.newFirmwareGetOmsProjectFileSpace().then((res) => {
                if (res.success == true) {
                    this.omsProjectFileSpace = {
                        totalFileSize: res.data.totalFileSize,
                        projectFileSpaceSize: res.data.projectFileSpaceSize,
                    };
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
    },
    created() {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            this.placeholderBol = true;
        } else {
            this.placeholderBol = false;
        }
        this.getDeviceType();
    },
    mounted() {
        // this.newFirmwareGetOmsProjectFileSpace();
        this.getDeviceModelList();
        let script = document.createElement("script");
        script.src = "/static/static/utils.js";
        document.head.appendChild(script);
        let scriptTwo = document.createElement("script");
        scriptTwo.src = "/static/lib/build/cutils.js";
        document.head.appendChild(scriptTwo);
        // this.get905PeripheraNameList();
        if (!!this.$route.query.deviceModelCode) {
            this.deviceModelCode = this.$route.query.deviceModelCode;
        }
    },
};
</script>
<style scoped lang="less">
.loading_ {
    pointer-events: none;
}
.firmware-upload {
    .el-button.is-icon {
        border: 1px solid #cccccc !important;
    }
}
.alert-tip {
    padding: 0 21px 12px;
}
/deep/.upload-demo {
    .ivu-upload-list {
        margin-top: 0px !important;
    }
    .ivu-upload-list-remove {
        margin-top: 7px;
        // display: flex;
        // justify-content: space-between;
        // align-items: center;
    }
}

/deep/.upload-demo[disabled] {
    .ivu-upload-select {
        display: none;
    }
}
.warning-box {
    font-size: 14px;
    .el-icon-warning {
        color: #ff952c;
    }
    .warning-msg {
        color: #ff952c;
        font-weight: normal;
    }
}
</style>
