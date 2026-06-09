<template>
    <el-dialog
        title="上传小版本"
        :visible="minorVersionVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="close"
        :width="'650px'"
        class="firmware-upload"
    >
        <el-form
            :model="minorVersionForm"
            label-position="top"
            :rules="rules"
            ref="minorVersionForm"
            class="m-x-md"
        >
            <el-form-item
                :class="{
                    loading_:
                        uploadStatus ||
                        uploadStatus ||
                        (placeholderBol &&
                            deviceType != '00' &&
                            deviceType != '000'),
                }"
                prop="fileName"
                label="选择固件"
            >
                <div
                    :class="{
                        loading_:
                            uploadStatus ||
                            uploadStatus ||
                            (placeholderBol &&
                                deviceType != '00' &&
                                deviceType != '000'),
                    }"
                >
                    <Upload
                        v-if="minorVersionVisible"
                        :accept="'.dav,.bin,.zip,.apk,.ipa,.upd,.APP'"
                        ref="upload"
                        class="upload-demo"
                        :action="uploadUrl"
                        :data="uploadData"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :before-upload="beforeUpload"
                        :file-list="fileList"
                        :on-remove="handleRemove"
                        :multiple="false"
                        :limit="1"
                        :disabled="
                            uploadStatus ||
                            minorVersionForm.fileName != '' ||
                            (placeholderBol &&
                                deviceType != '00' &&
                                deviceType != '000')
                        "
                    >
                        <el-button
                            v-if="minorVersionForm.fileName == ''"
                            type="default"
                            icon="el-icon-upload"
                            class="w-sm"
                            :disabled="
                                uploadStatus || minorVersionForm.fileName != ''
                            "
                            >{{
                                readFileing ? "解析中..." : "选择文件"
                            }}</el-button
                        >
                    </Upload>
                    <div>
                        {{
                            placeholderBol &&
                            deviceType != "00" &&
                            deviceType != "000"
                                ? "请使用谷歌浏览器上传外设固件"
                                : "仅支持dav、bin、zip、apk、ipa、upd、APP格式"
                        }}
                    </div>
                </div>
            </el-form-item>

            <el-form-item prop="version" label="设备版本号">
                <el-input
                    :placeholder="
                        placeholderBol
                            ? '当前浏览器不支持自动获取设备版本+build号，请手动输入或切换浏览器'
                            : ''
                    "
                    v-model="minorVersionForm.version"
                    clearable
                ></el-input>
                <div>示例：V1.2.2 build210110</div>
            </el-form-item>
            <el-form-item prop="remark" label="备注信息">
                <el-input
                    type="textarea"
                    placeholder="请输入"
                    :rows="4"
                    maxlength="200"
                    show-word-limit
                    v-model="minorVersionForm.remark"
                    clearable
                ></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submit" :disabled="uploadStatus"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { validateVersionBuild } from "@/utils/validate";
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
    name: "minorVersion",
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        const checkVersionBuild = (rule, value, callback) => {
            if (value != "") {
                if (!validateVersionBuild(value)) {
                    callback(new Error("设备版本号+build号不合规范"));
                }
            } else {
                callback(new Error("请输入设备版本号+build号"));
            }
            callback();
        };
        return {
            searchLoading: true,
            readFileing: false,
            placeholderBol: "",
            deviceModelCode: this.$route.query.deviceModelCode,
            deviceType: this.$route.query.deviceType,
            deviceData: {
                time: "",
                version: "",
                orderNo: "",
                deviceModelCode: "",
                originalFileName: "",
            },
            rules: {
                fileName: [
                    { required: true, message: "请选择固件", trigger: "blur" },
                ],
                version: [
                    {
                        required: true,
                        validator: checkVersionBuild,
                        trigger: "blur",
                    },
                ],
            },
            minorVersionVisible: false,
            tableData: [],
            minorVersionForm: {
                originalFileName: "",
                version: "",
                remark: "",
                fileName: "",
                filePath: "",
                fileSize: "",
                firmwareId: this.$route.query.id,
                /*fileSize: null*/
            },
            uploadUrl:
                (process.env.BASE_API == "/" ? "" : process.env.BASE_API) +
                "/OSS/uploadFiles",
            uploadData: {
                businessType: 7,
            },
            fileList: [],
            fileTypeList: [
                ".dav",
                ".bin",
                ".zip",
                ".apk",
                ".ipa",
                ".upd",
                ".APP",
            ],
            fileType: ["dav", "bin", "zip", "apk", "ipa", "upd", "APP"],
            uploadStatus: false,
        };
    },
    watch: {
        visible: {
            handler(val) {
                this.minorVersionVisible = val;
                if (val) {
                    this.handleReset(this.$refs.minorVersionForm);
                    if (!this.deviceModelCode) this.productType = "";

                    this.minorVersionForm.fileName = "";
                    this.minorVersionForm.fileSize = null;
                    this.fileList = [];
                    this.uploadStatus = false;
                    // console.log(this.type)
                }
            },
            deep: true,
            immediate: true,
        },
    },
    created() {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            this.placeholderBol = true;
        } else {
            this.placeholderBol = false;
        }
    },
    methods: {
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
            }
        },
        handleRemove(file, fileList) {
            this.minorVersionForm.fileName = "";
            this.minorVersionForm.fileSize = "";
            this.uploadStatus = false;
            // console.log(fileList)
        },
        /*获取小版本固件信息列表*/
        getMinorFirmware() {
            this.searchLoading = true;
            this.param = {
                majorFirmwareId: this.$route.query.id,
            };
            this.$api
                .getMinorFirmware(this.param)
                .then((res) => {
                    // console.log(res)
                    if (res.success == true) {
                        this.deviceData.deviceModelCode =
                            res.data.deviceModelCode;
                        this.deviceData.time = res.data.majorCreateTime;
                        this.deviceData.originalFileName =
                            res.data.originalFileName;
                        this.deviceData.orderNo = res.data.orderNo;
                        this.deviceData.version = res.data.majorVersion;
                        this.tableData = res.data.minorFirmwareVoList;
                    } else {
                        this.$message.error("获取固件信息列表失败:" + res.msg);
                    }
                    this.searchLoading = false;
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        downLoad(url) {
            if (url.indexOf("ftp") != -1) {
                window.open(url);
            } else {
                let iframe = document.createElement("iframe");
                iframe.src = url;
                iframe.style.display = "none";
                document.body.appendChild(iframe);
            }
            // window.open(url);
        },
        /*弹框关闭后*/
        close() {
            this.resetForm();
            this.minorVersionVisible = false;
            this.handleRemove();
            this.$emit("close");
        },
        /*上传成功后*/
        handleSuccess(res, file) {
            this.uploadStatus = false;
            // console.log('file:'+ JSON.stringify(file) )
            // console.log(res,file)
            this.minorVersionForm.fileSize = file.size;
            this.minorVersionForm.fileName = file.name;
            this.$refs.minorVersionForm.clearValidate("fileName");
            this.versionVisible = true;
        },
        /*上传失败后的提示*/
        handleError(res) {
            if (res.message == undefined) {
                this.$message.error(this.$t("common.uploadFailed"));
            } else if (res.message.indexOf("400") > -1) {
                this.$message.error(this.$t("common.uploadFailed"));
            } else {
                this.$message.error(res.message);
            }
            this.minorVersionForm.fileName = "";
            this.minorVersionForm.originalFileName = "";
            this.minorVersionForm.fileSize = null;
            this.uploadStatus = false;
        },
        /*固件上传之前的验证*/

        beforeUpload(file) {
            if (file.name) {
                this.$refs.minorVersionForm.clearValidate("fileName");
            }
            if (this.uploadStatus) {
                this.$refs.upload.post("");
                return;
            }
            if (
                this.placeholderBol &&
                this.deviceType != "00" &&
                this.deviceType != "000"
            ) {
                return false;
            }
            let typeStr = this.fileType.join("、");
            let isTYPE = false;
            this.fileTypeList.map((i) => {
                if (file.name.includes(i)) {
                    isTYPE = true;
                }
            });
            const isLt2M = file.size < 5120000000;
            if (!isTYPE) {
                this.$message.error(`上传格式只能是 ${typeStr} 格式!`);
                return false;
            }
            if (!isLt2M) {
                this.$message.error("上传文件大小不能超过 500MB!");
                return false;
            }
            let this_ = this;
            this.file = file;
            let fileArray = file.name.split(".");
            if (fileArray[fileArray.length - 1] == "dav") {
                // this.calculateMd5(0, 64);
            }
            // console.log(file);
            let params = {
                businessType: 7,
                originalFileName: file.name,
                deviceType: this.$route.query.deviceType,
                fileMD5Code: "",
            };
            if (this.$route.query.firmwareType === "main") {
                params.deviceModelCode = this.$route.query.deviceModelCode;
            } else {
                params.deviceModelCodes =
                    this.$route.query.deviceModelCode.split(",");
            }
            this.calculateMd5(0, 1048576);
            if (!this.placeholderBol) {
                let this_ = this;
                this_.readFileing = true;
                let promise = new Promise((resolve, reject) => {
                    this_.listenButtonClick(file, async (file) => {
                        const { md5 } = await md5WasmMem(file);
                        if (md5) {
                            this_.$refs.upload.clearFiles();
                            resolve(md5);
                        } else {
                            reject();
                        }
                    });
                })
                    .then(function onFulfilled(data) {
                        if (
                            this_.deviceType == "00" ||
                            this_.deviceType == "000"
                        ) {
                            params.fileMD5Code =
                                "97c20f97f044716ca23691a5102b3e0d";
                        } else {
                            params.fileMD5Code = data;
                        }
                        return new Promise((resolve, reject) => {
                            this_.$api
                                .getFileUploadInfoByOriginalFileName(params)
                                .then((res) => {
                                    if (res.success == true) {
                                        this_.minorVersionForm.filePath =
                                            res.data.fileName;
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
                                this_.minorVersionForm.originalFileName =
                                    file.name;
                                this_.minorVersionForm.fileName = data.fileName;
                                this_.minorVersionForm.fileSize = file.size;
                                this_.$refs.upload.action = this_.uploadUrl;
                                this_.$refs.upload.data = this_.uploadData;
                                this_.$refs.upload.post(file);
                                this_.uploadStatus = true;
                                this_.readFileing = false;
                            })
                            .catch(function onRejected(error) {
                                this_.$message.error(
                                    "获取上传文件参数失败:" + error
                                );
                                return false;
                            });
                    })
                    .catch();
                return false;
            }

            // return new Promise((resolve, reject) => {
            //     this.$api.getFileUploadInfoByOriginalFileName(7,file.name).then((res)=>{
            //         if (res.success == true) {
            //             console.log(res)
            //             this.uploadUrl=res.data.host;
            //             this.uploadData.key= res.data.fileName;
            //             this.uploadData.OSSAccessKeyId=res.data.OSSAccessKeyId;
            //             this.uploadData.policy=res.data.policy;
            //             this.uploadData.Signature=res.data.Signature;

            //             this.minorVersionForm.filePath = res.data.fileName;

            //             this.uploadStatus=true;
            //             setTimeout(()=>{
            //                 return resolve(true)
            //             },1000)
            //         } else {
            //             this.$message.error(res.msg)
            //             setTimeout(()=>{
            //                 return reject(false);
            //             },1000)

            //         }
            //     });
            // });
        },
        async listenButtonClick(file, callback) {
            await callback(file);
        },
        /*重置表单*/
        resetForm() {
            this.$refs.minorVersionForm.resetFields(true);
            this.fileList = [];
        },
        /*点击确定后*/
        submit: throttle(function (e) {
            this.uploadStatus = true;
            let this_ = this;
            this.$refs.minorVersionForm.validate((valid, invalidFields) => {
                if (valid) {
                    let params = this_.minorVersionForm;
                    // console.log(params);
                    this.$api.uploadMinorFirmware(params).then((res) => {
                        // console.log(res)
                        // console.log(typeof this.minorVersionForm)
                        if (res.success == true) {
                            this.$message.success("添加固件成功!");
                            // this.$message.success('添加固件成功!');
                            this.resetForm();
                            this.getMinorFirmware();
                            this.uploadStatus = false;
                            this.$emit("close", true);
                        } else {
                            this.$message.error("添加固件失败:" + res.msg);
                            this.uploadStatus = false;
                            this.$emit("close", false);
                        }
                        this.minorVersionVisible = false;
                        this.$api.eventTrackTrigger({
                            menu: "FIRMWARE_MANAGE",
                            business: "FIRMWARE_UPLOAD",
                            eventResult: res.success,
                        });
                    });
                } else {
                    this.uploadStatus = false;
                    return false;
                }
            });
        }),
        calculateMd5(start, end) {
            // 申请空间
            this.$nextTick(() => {
                let result = "";
                if (this.file.size > 10485760) {
                    let arr = [
                        this.file.slice(start, end),
                        this.file.slice(-end),
                    ];
                    result = new File(arr, this.file.name);
                } else {
                    result = this.file;
                }
                var formData = new FormData(); // 可以增加表单数据
                formData.append("file", result);
                this.$api.getFirmwareVersion(formData).then((res) => {
                    if (res.success == true) {
                        this.minorVersionForm.version = res.data.version;
                    }
                });
                // const Parse = Module.cwrap("Parse", "number", [
                //     "array",
                //     "number",
                // ]);
                // const GetRes = Module.cwrap("GetRes", "string");
                // let this_ = this;
                // let result = this_.file.slice(start, end);
                // readerVersion.onload = function () {
                //     // 申请空间
                //     let buffer = new Int8Array(this.result);
                //     // 解析
                //     let iRes = Parse(buffer, buffer.length);
                //     if (iRes > 0) {
                //         if (iRes > 5000) {
                //             this_.$message.error(
                //                 "固件包解析失败，请手动输入设备版本号+build号"
                //             );
                //         } else {
                //             this_.calculateMd5(0, iRes); //从0开始读，解析需要把前面的一起读进来
                //         }
                //     } else if (iRes == 0) {
                //         let pstrRes = GetRes();
                //         let json = JSON.parse(pstrRes);

                //         let jsonArr = json["version"].split("");
                //         jsonArr.splice(-8, 2);
                //         this_.minorVersionForm.version = jsonArr.join("");
                //     } else {
                //         //错误
                //         this_.$message.error(
                //             "固件包解析失败，请手动输入设备版本号+build号"
                //         );
                //     }
                // };
                // readerVersion.readAsArrayBuffer(result);
            });
        },
    },
    mounted() {},
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
.wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.version {
    font-size: small;
    margin-right: 30px;
}
/deep/.upload-demo[disabled] {
    .ivu-upload-select {
        display: none;
    }
}
</style>
