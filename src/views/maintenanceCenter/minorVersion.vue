<template>
    <div>
        <div class="wrap">
            <div class="wrap-top p-x-md p-t">
                <div class="text-md">
                    <span style="font-size: large"
                        >设备版本号：{{ deviceData.version }}</span
                    >
                </div>
                <div class="text-md" style="margin-top: 12px">
                    <span class="version">上传时间：{{ deviceData.time }}</span>
                    <!-- <span class="version"
                        >定制单号：{{ deviceData.orderNo }}</span
                    > -->
                    <span class="version"
                        >设备型号：{{ deviceData.deviceModelCode }}</span
                    >
                    <span class="version"
                        >固件名称：{{ deviceData.originalFileName }}</span
                    >
                </div>
            </div>
            <div class="p-x-md" style="margin-top: 20px">
                <el-button
                    type="primary"
                    :loading="searchLoading"
                    :disabled="searchLoading"
                    @click="openFirmwareUpload"
                    >上传小版本</el-button
                >
                <el-alert
                    title="设备升级时会按照小版本的上传先后顺序进行依次升级，请确保小版本先后顺序正确。"
                    type="warning"
                    simple
                    show-icon
                    class="m-t-sm"
                ></el-alert>
            </div>

            <div class="m-y p-x-md">
                <el-table
                    v-loading="searchLoading"
                    :element-loading-text="$t('common.desperatelyLoading')"
                    element-loading-color="#007213"
                    :data="tableData"
                    border
                    stripe
                >
                    <el-table-column
                        label="序号"
                        width="50px"
                        type="index"
                    ></el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="上传时间"
                        min-width="160px"
                        sortable
                    ></el-table-column>
                    <el-table-column
                        prop="version"
                        label="设备版本号"
                        min-width="160px"
                    ></el-table-column>
                    <el-table-column
                        prop="fileName"
                        label="固件名称"
                        min-width="120px"
                    ></el-table-column>
                    <el-table-column
                        prop="operateUserName"
                        label="上传人员"
                        min-width="100px"
                    ></el-table-column>
                    <el-table-column
                        prop="fileSize"
                        label="大小(MB)"
                        min-width="100px"
                    >
                        <template slot-scope="scope">
                            <div v-if="scope.row.fileSize">
                                {{
                                    `${parseFloat(
                                        scope.row.fileSize / (1024 * 1024)
                                    ).toFixed(2)}`
                                }}
                            </div>
                            <div v-else>--</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="remark"
                        label="备注"
                        min-width="160px"
                    ></el-table-column>
                    <el-table-column :label="$t('common.operate')" width="180px">
                        <template slot-scope="scope">
                            <a
                                @click="downLoad(scope.row.url)"
                                class="m-r-sm"
                                :disabled="scope.row.url.indexOf('ftp') != -1"
                                >下载</a
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div v-if="showFirmwareUpload">
            <minorVersionUpload
                @close="closeFirmwareUpload"
                :visible="firmwareVisible"
            ></minorVersionUpload>
        </div>
    </div>
</template>

<script>
import { validateVersionBuild } from "@/utils/validate";
import minorVersionUpload from "./minorVersionUpload";
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
    components: { minorVersionUpload },
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
            firmwareVisible: false,
            showFirmwareUpload: false,
            searchLoading: true,
            readFileing: false,
            placeholderBol: "",
            productKey: this.$route.query.productKey,
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
                    if (!this.productKey) this.productType = "";

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
        /*进入页面后马上获取小版本列表*/
        this.getMinorFirmware();
        // console.log(this.deviceType);
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
        openFirmwareUpload() {
            this.showFirmwareUpload = true;
            this.firmwareVisible = true;
        },
        closeFirmwareUpload(data) {
            this.firmwareVisible = false;
            setTimeout(() => {
                this.showFirmwareUpload = false;
            }, 300);
            if (data) {
                this.getMinorFirmware();
            }
        },
    },
    mounted() {
        let script = document.createElement("script");
        script.src = "/static/static/utils.js";
        document.head.appendChild(script);
        let scriptTwo = document.createElement("script");
        scriptTwo.src = "/static/lib/build/cutils.js";
        document.head.appendChild(scriptTwo);
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
