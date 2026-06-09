<template>
    <div>
        <!-- 导入 -->
        <el-dialog
            :visible="thisModal"
            :title="title"
            :width="'500px'"
            class="modal-nopadding"
            @close="doCancel"
        >
            <div class="padding p-b-0">
                <el-form
                    ref="importForm"
                    :model="importForm"
                    :rules="formValidate"
                    inline
                >
                    <el-row>
                        <!-- <el-col :span="16"> -->
                        <!-- 上传文件 -->
                        <el-form-item
                            :label="$t('deviceManage.importDialog1')"
                            class="pos-rlt"
                            prop="file"
                            content-width="160px"
                        >
                            <el-upload
                                ref="upload"
                                :action="action"
                                :file-list="fileList"
                                :data="params"
                                :on-success="handleSuccess"
                                :on-error="handleError"
                                :headers="headers"
                                :before-upload="handleBeforeUpload"
                                :on-change="onChange"
                                :on-remove="onRemove"
                                :multiple="false"
                                :on-exceed="onExceed"
                                :limit="1"
                                :auto-upload="false"
                            >
                                <el-button
                                    type="default"
                                    icon="el-icon-upload"
                                    class="w-sm"
                                    >{{
                                        $t("deviceManage.importDialog2")
                                    }}</el-button
                                >
                            </el-upload>
                        </el-form-item>
                        <!-- </el-col> -->
                        <!-- <el-col :span="8"> -->
                        <el-form-item>
                            <a
                                href="javascript:void(0)"
                                @click="downloadTemplate"
                                class="text-link"
                                >{{ $t("deviceManage.importDialog3") }}</a
                            >
                        </el-form-item>
                        <!-- </el-col> -->
                    </el-row>
                    <!-- <el-form  v-if="file !== null" label="文件名称：" class="pos-rlt">
                        <div>{{ file.name }}</div>
                    </el-form> -->
                </el-form>
                <p v-if="showWarning">
                    <!-- 设备序列号、设备手机号、车牌号、VIN四选一导入下发TTS指令 -->
                    {{ $t("deviceManage.importDialog4") }}
                </p>
            </div>
            <div slot="footer">
                <el-button @click="doCancel">
                    {{ $t("common.cancel") }}</el-button
                >
                <el-button
                    :loading="loadingStatus"
                    type="primary"
                    @click="doOk"
                    >{{
                        loadingStatus
                            ? $t("common.uploading")
                            : $t("common.upload")
                    }}</el-button
                >
            </div>
        </el-dialog>
        <!-- 导入/ -->
        <!-- 正在导入 -->
        <el-dialog
            :visible="processModal"
            :close-on-press-escape="false"
            @close="processModal = false"
            :width="'240px'"
            class="no-padding no-border"
        >
            <div class="padding text-center">
                <el-progress
                    type="circle"
                    :percentage="percent"
                    :color="getColor"
                    :status="progressStatus"
                ></el-progress>
                <p v-html="processText"></p>
            </div>
            <div slot="footer">
                <el-button
                    size="small"
                    style="width: 100%"
                    :type="importResult"
                    :disabled="importing"
                    @click="doFinish"
                    :max-width="500"
                    >{{ importText }}</el-button
                >
            </div>
        </el-dialog>
        <!-- 正在导入/ -->
        <!-- <div id="divWin" v-if="divWin"> -->
        <div id="divWin" v-if="true">
            <!--导出错误结果-->
            <el-dialog
                :visible="resultModal"
                :title="importResultTitle"
                top="50px"
                @close="resultModal = false"
            >
                <el-table
                    stripe
                    :data="importListData"
                    ref="table"
                    height="500"
                >
                    <!-- 行号 -->
                    <el-table-column
                        prop="columnNum"
                        :label="$t('carManage.lineNumber')"
                    ></el-table-column>
                    <!-- 终端手机号 -->
                    <el-table-column
                        prop="mainColumn"
                        :label="$t('common.deviceCode')"
                    ></el-table-column>
                    <!-- 导入结果 -->
                    <el-table-column :label="$t('carManage.importResults')">
                        <template slot-scope="scope">
                            <span
                                class="params.row.msg=='成功'?'text-success':'text-error'"
                                >{{ scope.row.msg }}</span
                            >
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    :current-page="impResultParams.currentPage"
                    :page-sizes="[20, 50, 100]"
                    :page-size="impResultParams.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="importTotal || 0"
                    @current-change="pageChange"
                    @size-change="PageSizeChange"
                >
                </el-pagination>
                <div slot="footer">
                    <div class="pull-left" style="line-height: 35px">
                        {{ $t("common.success")
                        }}<span class="text-success m-x-sm">{{
                            successSum
                        }}</span
                        >{{ $t("common.individual") }}，
                        {{ $t("common.failed") }}
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
    </div>
</template>
<script>
import Auth from "@/utils/auth";
import i18n from "@/i18n/i18n.js";
export default {
    name: "VmDialog",
    components: {},
    props: {
        /* @params
         * :on-finish  导入成功后点击“完成”按钮的回调函数
         * :on-error   导入失败后点击“查看导入结果”按钮的回调函数
         * */
        showWarning: {
            type: Boolean,
            default: false,
        },
        // 模态窗口开/关状态
        isOpen: {
            type: Boolean,
            default: false,
        },
        // 是：加载状态，否：正常状态
        importColumns: {
            type: Array,
            default: [],
        },
        // 标题
        title: {
            type: String,
            default: i18n.t("common.import"), //导入
        },
        importResultTitle: {
            type: String,
            default: i18n.t("carManage.importResults"), //导入结果
        },
        moduleCode: {
            type: String,
            default: "carInfo",
        },
        templateCode: {
            type: String,
            default: "carInfo",
        },
        groupId: {
            type: Number,
            default: null,
        },
        extraData: {
            type: Object,
            default: function () {
                return {};
            },
        },
        action: {
            type: String,
            default: process.env.BASE_API + "/fileUpload",
        },
    },
    data() {
        return {
            renderFileList: [], // 是否有文件
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
            progressStatus: "", //进度条状态
            importText: "",
            importForm: {},
            fileList: [],
            file: null,
            divWin: false,
            loadingStatus: false,
            importTotal: 0,
            headers: { "X-Token": Auth.getToken() },
            formValidate: {
                file: [
                    {
                        required: true,
                        message: this.$t("deviceManage.importDialog5"),
                        trigger: "change",
                    },
                ],
            },
            params: {
                moduleCode: this.moduleCode,
                templateCode: this.templateCode,
                groupId: this.groupId,
            },
            impResultParams: {
                currentPage: 1,
                pageSize: 20,
            },
        };
    },
    computed: {
        getColor() {
            return this.$store.state.app.color[this.importResult];
        },
    },
    created() {},
    methods: {
        pageChange(page) {
            this.impResultParams.currentPage = page;
        },
        PageSizeChange(limit) {
            this.impResultParams.pageSize = limit;
        },
        doOk() {
            if (this.renderFileList.length == 0) {
                this.$message({
                    message: this.$t("deviceManage.importDialog5"),
                    type: "warning",
                });
            }
            this.$refs.upload.submit();
        },
        resultModalCancel() {
            this.resultModal = false;
            this.$emit("on-finish");
        },
        doCancel() {
            this.thisModal = false;
            this.$emit("on-cancel");
        },
        downloadTemplate() {
            this.$emit("on-downloadTemplate");
        },
        doFinish() {
            this.divWin = false;
            this.$nextTick(() => {
                this.divWin = true;
            });
            if (this.importing == true) {
                return;
            }
            if (this.importResult == "success") {
                this.processModal = false;
                this.progressStatus = "success";
                this.$emit("on-finish");
            }
            if (this.importResult == "error") {
                this.processModal = false;
                this.resultModal = true;
                this.progressStatus = "exception";
                this.$emit("on-error");
            }
        },
        handleError(err, file) {
            this.$message.error(this.$t("common.uploadFailed"));
        },
        handleSuccess(res, file) {
            if (res.success == true) {
                this.$message.success(this.$t("common.success"));
                this.batchCode = res.data.batchCode;
            } else {
                this.$message.error(res.msg);
                this.processModal = false;
                this.importing = false;
                this.doCancel();
                return;
            }
            let _this = this;
            this.importResult = "primary";
            this.processText = this.$t("carManage.importingData");
            this.percent = 0;
            this.progressStatus = "";
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
                                `</span>${_this.$t("carManage.articleData")}`;
                            _this.successSum = data.successSum;
                            _this.total = data.total;
                            _this.importText = _this.$t("common.complete");
                            _this.importFinish(i);
                        } else if (
                            true == data.finish &&
                            data.successSum != data.total
                        ) {
                            _this.percent = (data.nowIndex / data.total) * 100;
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
                                ((data.nowIndex / data.total) * 100).toFixed(
                                    2
                                ) * 1;
                        }
                    });
            }, 2500);
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
        onChange(file, fileList) {
            this.renderFileList = fileList;
            this.$nextTick(() => {
                document.querySelector(".el-upload-list__item-name").title =
                    file.name;
            });
        },
        onExceed(file, fileList) {
            this.$message({
                message: this.$t("deviceManage.importDialog6"),
                type: "warning",
            });
        },
        onRemove(file, fileList) {
            this.renderFileList = fileList;
            //   console.log(file, fileList,'file, fileList REMOVE')
        },
        handleBeforeUpload(file) {
            //   console.log(file,'file')
            this.file = file;
            if (!this.file) {
                this.$message({
                    message: this.$t("deviceManage.importDialog5"),
                    type: "warning",
                });
            } else {
                // 获取文件后缀
                let filesuffix = file.name.substring(
                    file.name.lastIndexOf(".") + 1
                );
                // 是不是excel文件
                const fileFormat1 = filesuffix === "xls";
                const fileFormat2 = filesuffix === "xlsx";
                // 判断文件大小是否小于2M
                const fileMaxSize = file.size / 1024 < 2048;
                if (!fileFormat1 && !fileFormat2) {
                    this.handleFormatError(file);
                    return false;
                }
                if (!fileMaxSize) {
                    this.handleMaxSize(file);
                    return false;
                }
                if (file.name.length > 32) {
                    this.$message({
                        message: this.$t("deviceManage.importDialog7"),
                        type: "warning",
                    });
                    return false;
                }
            }

            // return false;
        },
        /**
         * 重置表单
         * */
        handleReset(name) {
            if (this.$refs.name !== undefined) {
                this.$refs.name.resetFields();
            }
        },
    },
    mounted() {},
    watch: {
        isOpen: {
            handler(val) {
                this.impResultParams.currentPage = 1;
                this.impResultParams.pageSize = 20;
                this.thisModal = val;
                if (val == true) {
                    this.importListData = [];
                    this.handleReset("importForm");
                }
                this.fileList = [];
                this.file = null;
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
        groupId: {
            handler(val) {
                this.params.groupId = val;
            },
            deep: true,
        },
    },
};
</script>
