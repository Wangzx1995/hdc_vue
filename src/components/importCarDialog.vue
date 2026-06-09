<template>
    <div>
        <!-- 导入 -->
        <el-dialog
            :visible.sync="thisModal"
            :title="title"
            append-to-body
            :close-on-click-modal="false"
            width="650px"
            class="el-no-padding import-dialog"
            @close="doCancel"
        >
            <div class="padding p-b-0 text-left">
                <div
                    class="message-div flex-layout flex-between m-b"
                    v-if="note && moduleCode == 'carInfo'"
                >
                    <span>
                        <span class="el-icon-warning"></span>
                        <span class="font-14">
                            <!-- 请先下载模板，按模板格式填写完整后，再导入数据 -->
                            {{ $t("carManage.importCarDialogWarnning") }}
                        </span>
                    </span>
                    <span class="pointer inline">
                        <i class="el-icon-close" @click="note = false"></i>
                    </span>
                </div>
                <el-form
                    ref="importForm"
                    :model="importForm"
                    :rules="formValidate"
                >
                    <el-form-item>
                        <p>
                            <span class="title">
                                <!-- 模版文件 -->
                                {{ $t("carManage.templateFile") }}：</span
                            >
                            <a
                                href="javascript:void(0)"
                                @click="downloadTemplate('carInfo', 4)"
                                class="text-link"
                            >
                                <!-- 下载《通用型车辆导入模板》 -->
                                {{ $t("carManage.downloadTemplate") }}</a
                            >
                        </p>
                    </el-form-item>
                    <el-form-item class="pos-rlt" prop="file">
                        <p class="title">
                            <!-- 请选择填写好的模版文件 -->
                            {{ $t("carManage.selectTemplate") }}
                        </p>
                        <p>
                            <el-upload
                                ref="upload"
                                :action="action"
                                :data="params"
                                :on-success="handleSuccess"
                                :on-error="handleError"
                                :multiple="false"
                                :accept="
                                    moduleCode === 'transportTasksTemplate'
                                        ? '.txt'
                                        : '.xlsx, .xls'
                                "
                                :headers="headers"
                                :show-file-list="false"
                                :file-list="uploadFileList"
                                :auto-upload="false"
                                :on-change="changeFile"
                            >
                                <el-button type="ghost" icon="el-icon-upload">
                                    <!-- 上传模版文件 -->
                                    {{ $t("carManage.uploadTemplateFile") }}
                                </el-button>
                            </el-upload>
                        </p>
                    </el-form-item>
                    <!-- 文件名称 -->
                    <el-form-item
                        v-if="file !== null"
                        :label="$t('carManage.fileName')"
                        class="pos-rlt"
                    >
                        <div>{{ file.name }}</div>
                    </el-form-item>
                    <el-form-item v-if="file !== null">
                        <p class="title">
                            <!-- 选择车辆导入所属组织的方式 -->
                            {{ $t("carManage.vehicleUseFileLabel") }}
                        </p>
                        <el-radio-group v-model="useFileOrg" class="text-14">
                            <el-radio :label="true" class="paramsItem">
                                <!-- 使用模版中填写的组织 -->
                                {{ $t("carManage.vehicleUseFileLabel1") }}
                            </el-radio>
                            <el-radio :label="false" class="paramsItem">
                                <!-- 使用当前选择的组织 -->
                                {{ $t("carManage.vehicleUseFileLabel2") }}
                            </el-radio>
                        </el-radio-group>
                        <p class="title" v-show="!useFileOrg">
                            <span>
                                <!-- 组织信息 -->
                                {{
                                    $t("carManage.organizationInformation")
                                }}：</span
                            >{{ carOrg }}
                        </p>
                    </el-form-item>
                    <el-form-item v-if="file !== null">
                        <p class="title">
                            <!-- 请选择对重复车辆的处理方式（若表格中有与平台重复的车辆即执行以下操作） -->
                            {{ $t("carManage.vehicleSkipRepetitionCar") }}
                        </p>
                        <el-radio-group
                            v-model="skipRepetitionCar"
                            class="paramsItem text-14"
                        >
                            <el-radio :label="true" class="paramsItem">
                                <!-- 跳过已存在的车辆（表格中车牌号重复的，车辆信息不导入跳过处理） -->
                                {{ $t("carManage.vehicleSkipRepetitionCar1") }}
                            </el-radio>
                            <el-radio :label="false" class="paramsItem">
                                <!-- 覆盖已存在的车辆（表格中车牌号重复的，车辆信息将覆盖平台原有的车辆信息） -->
                                {{ $t("carManage.vehicleSkipRepetitionCar2") }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button type="text" @click="doCancel">{{
                    $t("common.cancel")
                }}</el-button>
                <el-button
                    :loading="loadingStatus"
                    type="primary"
                    @click="doOk"
                >
                    {{
                        isCarManage
                            ? $t("common.ok")
                            : loadingStatus
                            ? $t("common.uploading")
                            : $t("common.upload")
                    }}
                </el-button>
            </div>
        </el-dialog>
        <!-- 导入/ -->
        <!-- 正在导入 -->
        <el-dialog
            :visible.sync="processModal"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="350px"
            height="240px"
            class="no-padding no-border"
        >
            <div class="padding text-center">
                <!--<Circle :percent="percent" :size="96" class="m-y" :stroke-color="getColor">
                    <Icon v-if="percent == 100 && importResult != 'error'" type="ios-checkmark-empty" size="60" class="text-success"></Icon>
                    <span v-if="percent < 100 && importResult != 'error'" class="text-md">{{ percent }}%</span>
                    <Icon v-if="importResult == 'error'" type="ios-close-empty" size="60" class="text-error"></Icon>
                </Circle>-->
                <el-progress
                    type="circle"
                    v-if="percent < 100 && importResult != 'error'"
                    :percentage="percent"
                    >{{ percent }}%</el-progress
                >
                <el-progress
                    type="circle"
                    v-else
                    :percentage="percent"
                    :status="importResult != 'error' ? 'success' : 'exception'"
                ></el-progress>
                <p v-html="processText"></p>
            </div>
            <div slot="footer">
                <el-button
                    :type="importResult"
                    :disabled="importing"
                    @click="doFinish"
                    long
                    >{{ importText }}</el-button
                >
            </div>
        </el-dialog>
        <!-- 正在导入/ -->

        <!--导出错误结果-->
        <el-dialog
            :visible.sync="resultModal"
            :title="importResultTitle"
            width="800"
            @on-cancel="resultModalCancel"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            class="text-left export"
        >
            <el-button
                @click="doExoprt"
                class="m-b"
                v-if="isCarManage"
                :disabled="carResultExportLoading || !importListData.length"
                :loading="carResultExportLoading"
                >{{
                    carResultExportLoading
                        ? $t("common.dataPreparation")
                        : $t("common.export")
                }}</el-button
            >
            <el-table
                :data="importListData"
                border
                size="medium"
                tooltip-effect="dark"
                align="center"
                :columns="importColumns"
                ref="table"
                height="500"
            >
                <el-table-column
                    v-for="item in importColumns"
                    :key="item.prop"
                    :prop="item.prop"
                    :label="item.label"
                >
                </el-table-column>
            </el-table>
            <el-pagination
                class="p-a"
                @size-change="PageSizeChange"
                @current-change="pageChange"
                :current-page="impResultParams.currentPage"
                :page-sizes="[20, 50, 100]"
                :page-size="impResultParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total || 0"
            >
            </el-pagination>
            <div slot="footer">
                <div class="pull-left" style="line-height: 35px">
                    {{ $t("common.success")
                    }}<span class="text-success m-x-sm">{{ successSum }}</span
                    >{{ $t("common.individual") }}， {{ $t("common.failed") }}
                    <span class="text-error m-x-sm">{{
                        total - successSum
                    }}</span
                    >{{ $t("common.individual") }}
                </div>
                <el-button type="text" @click="resultModalCancel">
                    {{ $t("common.cancel") }}</el-button
                >
                <el-button type="primary" @click="resultModalCancel()">
                    {{ $t("common.ok") }}</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Storage from "@/utils/sessionStorage";
import Auth from "@/utils/auth";
import { exportHander } from "@/utils/exportUtil";
export default {
    name: "VmImport",
    components: {},
    props: {
        /* @params
         * :on-finish  导入成功后点击“完成”按钮的回调函数
         * :on-error   导入失败后点击“查看导入结果”按钮的回调函数
         * */
        carOrg: {
            type: String,
            default: "",
        },
        isCarManage: {
            type: Boolean,
            default: false,
        },
        // 模态窗口开/关状态
        isOpen: {
            type: Boolean,
            default: false,
        },
        orgId: {
            type: [Number, String],
            default: -1,
        },
        // 是：加载状态，否：正常状态
        importColumns: {
            type: Array,
            default: [],
        },
        // 标题
        title: {
            type: String,
            default() {
                return "";
            },
        },
        importResultTitle: {
            type: String,
            default() {
                return "";
            },
        },
        moduleCode: {
            type: String,
            default: "carInfo",
        },
        templateCode: {
            type: String,
            default: "carInfo",
        },
        extraData: {
            type: Object,
            default: function () {
                return {};
            },
        },
        action: {
            type: String,
            default: process.env.VUE_APP_BASE_API + "/fileUpload",
        },
    },
    data() {
        return {
            skipRepetitionCar: true,
            note: true,
            importListData: [], //错误结果数据
            thisModal: this.isOpen,
            processModal: false,
            resultModal: false,
            importing: false,
            successSum: 0,
            total: 0,
            batchCode: "",
            percent: 0,
            processText: this.$t("carManage.importingData"),
            importResult: "primary",
            importText: "",
            importForm: {
                type: "",
            },
            fileList: [],
            file: null,
            loadingStatus: false,
            importTotal: 0,
            headers: {
                "X-Token": Auth.getToken(),
            },
            formValidate: {
                file: [
                    {
                        required: true,
                        message: this.$t("carManage.formValidateFile"),
                        trigger: "change",
                    },
                ],
            },
            params: {
                templateCode: this.templateCode,
                orgId: this.orgId,
            },
            impResultParams: {
                currentPage: 1,
                pageSize: 20,
            },
            uploadFileList: [], //上传的文件,只上传最后一个
            projectType: "",
            useFileOrg: false,
            getExportResultInterval: null,
            exportLoading: false,
        };
    },
    computed: {
        getColor() {
            return this.$store.state.app.color[this.importResult];
        },
        carResultExportLoading() {
            return this.$store.state.exportManage.carResultExport.loading;
        },
    },
    created() {
        //项目类型
        this.projectType = Storage.get("projectType");
        if (
            this.projectType == 1 ||
            this.projectType == 2 ||
            this.projectType == 4
        ) {
            this.importForm.type = this.projectType;
        }
    },
    methods: {
        doExoprt() {
            let param = {
                batchCode: this.batchCode,
            };
            // exportHander.call(
            //     this,
            //     "exportImportResult",
            //     param,
            //     "导出车辆结果",
            //     "carResultExport"
            // );
            let notifyMy = this.$notify({
                customClass: "export-style",
                iconClass: "el-icon-loading",
                message: this.$t("carManage.importCarExportMessage"),
                duration: 0,
                offset: 55,
            });
            this.exportLoading = true;
            this.$api.exportImportResult(param).then((res) => {
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
                                        notifyMy.close();
                                        var iframe =
                                            document.createElement("iframe");
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
                                        _this.exportLoading = false;
                                    }
                                });
                        },
                        2000
                    );
                } else {
                    notifyMy.close();
                    this.exportLoading = false;
                    this.$message.error(res.msg);
                }
            });
        },
        pageChange(page) {
            this.impResultParams.currentPage = page;
        },
        PageSizeChange(limit) {
            this.impResultParams.pageSize = limit;
            this.impResultParams.currentPage = 1;
        },
        doOk() {
            // this.params.type = this.importForm.type;
            if (this.isCarManage) {
                this.params.useFileOrg = this.useFileOrg;
                this.params.skipRepetitionCar = this.skipRepetitionCar;
            }
            if (this.file) {
                this.handleUpload();
            } else {
                this.$message.error(this.$t("carManage.formValidateFile"));
            }
        },
        resultModalCancel() {
            this.resultModal = false;
            this.$emit("on-finish");
        },
        doCancel() {
            this.thisModal = false;
            this.$emit("on-cancel");
        },
        downloadTemplate(code, type) {
            this.$emit("on-downloadTemplate", code, type);
        },
        doFinish() {
            if (this.importing == true) {
                return;
            }
            if (this.importResult == "success") {
                this.processModal = false;
                this.$emit("on-finish");
            }
            if (this.importResult == "error") {
                this.processModal = false;
                this.resultModal = true;
                this.$emit("on-error");
            }
        },
        handleError(res, file) {
            this.$message.error(this.$t("common.uploadFailed"));
        },
        handleSuccess(res, file) {
            /* 配后后台，导入txt逻辑不太一样 */
            if (this.moduleCode === "transportTasksTemplate") {
                if (res.success === true) {
                    this.$message.success(this.$t("common.success"));
                    this.$emit("on-finish");
                } else {
                    this.$message.error(res.msg);
                    this.$emit("on-error");
                }
            } else {
                if (res.success == true) {
                    this.$message.success(this.$t("common.uploadSuccess"));
                    this.batchCode = res.data.batchCode;
                } else {
                    this.$message({
                        message: this.$t("carManage.fileImportError") + res.msg,
                        type: "error",
                    });
                    this.processModal = false;
                    this.importing = false;
                    this.doCancel();
                    return;
                }
                let _this = this;
                this.importResult = "primary";
                this.processText = this.$t("carManage.importingData");
                this.percent = 0;
                this.processModal = true;
                this.importing = true;
                this.importText = this.$t("carManage.importing");
                let i = window.setInterval(function () {
                    _this.$api
                        .getImportResult(
                            _this.batchCode,
                            _this.impResultParams.currentPage,
                            _this.impResultParams.pageSize
                        )
                        .then((res) => {
                            let data = res.data;
                            if (!res.data) {
                                return;
                            }
                            if (
                                true == data.finish &&
                                data.successSum == data.total
                            ) {
                                _this.percent = 100;
                                _this.importing = false;
                                _this.importResult = "success";
                                _this.processText =
                                    `${_this.$t(
                                        "carManage.successfullyImported"
                                    )}<span class="text-success m-x-sm">` +
                                    data.successSum +
                                    `</span>${_this.$t(
                                        "carManage.articleData"
                                    )}`;
                                _this.successSum = data.successSum;
                                _this.total = data.total;
                                _this.importText = _this.$t("common.complete");
                                _this.importFinish(i);
                            } else if (
                                true == data.finish &&
                                data.successSum != data.total
                            ) {
                                _this.percent =
                                    (data.nowIndex / data.total) * 100;
                                _this.importing = false;
                                _this.importResult = "error";
                                _this.processText = `<span class="text-error">${_this.$t(
                                    "carManage.partialDataImportFailed"
                                )}</span>`;
                                _this.importText = _this.$t(
                                    "carManage.viewImportResults"
                                );
                                _this.successSum = data.successSum;
                                _this.total = data.total;
                                _this.importFinish(
                                    i,
                                    data.resultList.results,
                                    data.errorList
                                ); //后台没有errorList
                                _this.importTotal = data.total;
                            } else {
                                _this.percent =
                                    (
                                        (data.nowIndex / data.total) *
                                        100
                                    ).toFixed(2) * 1;
                            }
                        });
                }, 2500);
            }
        },
        importFinish(intervalId, resultList, errorList) {
            window.clearInterval(intervalId);
            this.importListData = [];
            if (resultList) {
                this.impResultParams.currentPage = 1;
                this.impResultParams.pageSize = 20;
                for (let i = 0; i < resultList.length; i++) {
                    let rowData = {};
                    rowData.columnNum = i + 1;
                    rowData.mainColumn = resultList[i].mainColumn;
                    let tempMsg = "";
                    for (let j = 0; j < resultList[i].errorReason.length; j++) {
                        let errorRea = resultList[i].errorReason[j];
                        tempMsg += errorList[errorRea] + ",";
                    }
                    rowData.msg = tempMsg.substr(0, tempMsg.length - 1);
                    this.importListData.push(rowData);
                }
            }
        },
        handleFormatError(file) {
            this.$message({
                message:
                    this.$t("carManage.handleFormatError1") +
                    file.name +
                    this.$t("carManage.handleFormatError2"),
                type: "warning",
            });
        },
        handleMaxSize(file) {
            this.$message({
                message:
                    this.$t("carManage.handleMaxSize1") +
                    file.name +
                    this.$t("carManage.handleMaxSize2"),
                type: "warning",
            });
        },
        handleBeforeUpload(file) {
            if (file.name.length > 100) {
                this.$message({
                    message: this.$t("carManage.handleBeforeUploadName"),
                    type: "warning",
                });
                return false;
            }
            //上传前获取文件格式和大小
            let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
            let isLt5M = file.size / 1024 / 1024;
            //上传文件不能大于10M
            if (isLt5M > 10) {
                this.$message({
                    message: this.$t("carManage.handleBeforeUploadSize"),
                    type: "warning",
                });
                return false;
            }
            //格式
            let imgType = ["xls", "xlsx"];
            if (imgType.indexOf(testmsg) == -1) {
                this.$message({
                    message: this.$t("carManage.handleBeforeUploadType"),
                    type: "warning",
                });
                return false;
            }
            this.file = file;
            return false;
        },
        handleUpload() {
            //this.$refs.upload.post(this.file);
            this.$refs.upload.submit();
        },
        //文件改变时执行,判断文件格式
        changeFile(file, fileList) {
            if (file.name.length > 100) {
                this.$message({
                    message: this.$t("carManage.handleBeforeUploadName"),
                    type: "warning",
                });
                return false;
            }
            //上传前获取文件格式和大小
            let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
            let isLt5M = file.size / 1024 / 1024;
            //上传文件不能大于10M
            if (isLt5M > 10) {
                this.$message({
                    message: this.$t("carManage.handleBeforeUploadSize"),
                    type: "warning",
                });
                return false;
            }
            //格式
            let imgType =
                this.moduleCode === "transportTasksTemplate"
                    ? ["txt"]
                    : ["xls", "xlsx"];
            if (imgType.indexOf(testmsg) == -1) {
                this.$message({
                    message: this.$t("carManage.handleBeforeUploadType"),
                    type: "warning",
                });
                return false;
            }
            if (fileList.length > 0) {
                this.uploadFileList = [fileList[fileList.length - 1]]; // 这一步，是 展示最后一次选择的文件
            }
            this.file = file;
        },
        /**
         * 重置表单
         * */
        handleReset(name) {
            if (this.$refs[name]) {
                this.$refs[name].resetFields();
            }
        },
    },
    mounted() {},
    watch: {
        isOpen: {
            handler(val) {
                this.params.orgId = this.orgId;
                if (
                    this.moduleCode == "labelPoints" ||
                    this.moduleCode == "siteManagements"
                ) {
                    delete this.params.orgId;
                }
                this.impResultParams.currentPage = 1;
                this.impResultParams.pageSize = 20;
                this.thisModal = val;
                if (!!val) {
                    this.importListData = [];
                } else {
                    //关闭的时候清理
                    this.handleReset("importForm");
                }
                this.fileList = [];
                this.file = null;
                this.uploadFileList = [];
            },
            deep: true,
        },
        impResultParams: {
            handler() {
                this.$api
                    .getImportResult(
                        this.batchCode,
                        this.impResultParams.currentPage,
                        this.impResultParams.pageSize
                    )
                    .then((res) => {
                        this.importListData = [];
                        if (res.success == true) {
                            let startIndex = res.data.resultList.startIndex;
                            let resultList = res.data.resultList.results;
                            let errorList = res.data.errorList;
                            if (resultList) {
                                for (let i = 0; i < resultList.length; i++) {
                                    let rowData = {};
                                    rowData.columnNum = startIndex + i + 1;
                                    rowData.mainColumn =
                                        resultList[i].mainColumn;
                                    let tempMsg = "";
                                    for (
                                        let j = 0;
                                        j < resultList[i].errorReason.length;
                                        j++
                                    ) {
                                        let errorRea =
                                            resultList[i].errorReason[j];
                                        tempMsg += errorList[errorRea] + ",";
                                    }
                                    rowData.msg = tempMsg.substr(
                                        0,
                                        tempMsg.length - 1
                                    );
                                    this.importListData.push(rowData);
                                }
                            }
                            this.importTotal = res.data.total;
                            this.dataReady = true;
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
            },
            deep: true,
        },
        extraData: {
            handler(val) {
                let params = Object.assign(this.params, val);
                this.uploadParams = params;
            },
            deep: true,
        },
    },
};
</script>
<style lang="less" scoped>
.message-div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 8px;
    border: 1px solid rgb(255, 228, 129);
    background: rgb(255, 251, 228);
}
.el-icon-warning {
    font-size: 14px;
    color: rgb(255, 169, 0) !important;
    margin-right: 5px;
}
.title {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    font-family: PingFangSC-Regular;
    font-size: 500;
    margin-bottom: 8px;
    padding: 0px;
}
.el-form-item {
    margin-bottom: 14px !important;
}
.paramsItem {
    margin-bottom: 12px;
    /deep/ .el-radio__label {
        font-size: 14px !important;
    }
}
.import-dialog {
    /deep/ .el-dialog__header {
        border: 1px solid rgba(0, 0, 0, 0.06);
    }
    /deep/ .el-dialog__body {
        padding: 0px;
    }
    /deep/ .el-dialog__footer {
        border: 1px solid rgba(0, 0, 0, 0.06);
    }
}
.export {
    /deep/ .el-dialog__body {
        padding-top: 0px;
    }
}
.tip {
    padding: 0 8px;
    margin-bottom: 10px;
    border: 2px solid rgb(255, 228, 129);
    background: rgb(255, 251, 228);
    .el-icon-warning {
        font-size: 16px;
        color: rgb(255, 169, 0) !important;
    }
}
</style>
