<template>
    <div>
        <div class="content">
            <el-form
                ref="uploadForm"
                :rules="rules"
                :model="uploadForm"
                label-width="100px"
            >
                <!-- 上传方式 -->
                <el-form-item
                    :label="$t('devLog.uploadMode')"
                    prop="uploadMode"
                >
                    <el-radio-group
                        v-model="uploadForm.uploadMode"
                        v-for="item in uploadMethodList"
                        :key="item.value"
                        @change="uploadMethodChange"
                    >
                        <el-radio :label="item.value">
                            {{ item.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 查询时间 -->
                <el-form-item
                    :label="$t('devLog.queryTime')"
                    v-if="uploadForm.uploadMode === 0"
                >
                    <el-date-picker
                        :default-time="['00:00:00', '23:59:59']"
                        v-model="timeRange"
                        type="datetimerange"
                        :start-placeholder="$t('common.startTime')"
                        :end-placeholder="$t('common.endTime')"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <!-- 结束日期 -->
                <el-form-item
                    :label="$t('devLog.endDate')"
                    prop="endTime"
                    v-if="
                        uploadForm.uploadMode === 1 ||
                        uploadForm.uploadMode === 2
                    "
                >
                    <el-date-picker
                        v-model="uploadForm.endTime"
                        type="date"
                        :placeholder="$t('common.select')"
                        :clearable="false"
                        :picker-options="{
                            disabledDate(time) {
                                return (
                                    time.getTime() <
                                    Date.now() - 24 * 60 * 60 * 1000
                                );
                            },
                        }"
                    />
                </el-form-item>
                <!-- 上传类型 -->
                <el-form-item
                    :label="$t('devLog.uploadType')"
                    prop="uploadType"
                    v-if="
                        uploadForm.uploadMode === 0 ||
                        uploadForm.uploadMode === 1
                    "
                >
                    <el-radio-group
                        v-model="uploadForm.uploadType"
                        v-for="item in uploadTypeList"
                        :key="item.value"
                    >
                        <el-radio :label="item.value">
                            {{ item.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 日志类型 -->
                <el-form-item
                    :label="$t('devLog.logTypeList')"
                    prop="logTypeList"
                    v-if="
                        uploadForm.uploadType === 0 ||
                        uploadForm.uploadMode === 2
                    "
                >
                    <el-checkbox-group
                        v-model="uploadForm.logTypeList"
                        v-for="item in uploadForm.uploadMode === 2
                            ? logTypeRealTimeList
                            : logTypeList"
                        :key="item.value"
                    >
                        <el-checkbox :label="item.sysDictCode">
                            {{ item.sysDictName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <!-- 文件路径 -->
                <el-form-item
                    :label="$t('devLog.filePath')"
                    prop="filePath"
                    v-if="uploadForm.uploadType === 1"
                >
                    <el-input
                        v-model="uploadForm.filePath"
                        :placeholder="$t('common.input')"
                    />
                </el-form-item>
            </el-form>
        </div>
        <div class="dialog-footer">
            <el-button @click="cancel()">
                {{ $t("common.cancel") }}
            </el-button>
            <el-button type="primary" @click="submit">
                {{ $t("common.ok") }}
            </el-button>
        </div>
    </div>
</template>
<script>
import enumeration from "./js/enumeration";
export default {
    name: "",
    components: {},
    props: {
        deviceCode: {
            type: [String, Array],
        },
        business: {
            type: String,
        },
    },

    data() {
        return {
            uploadMethodList: enumeration.uploadMethodList,
            uploadTypeList: enumeration.uploadTypeList,
            logTypeList: [],
            logTypeRealTimeList: [],
            uploadForm: {
                uploadMode: 0,
                endTime: "",
                uploadType: 0,
                logTypeList: [],
                filePath: "",
            },
            rules: {
                uploadMode: [
                    {
                        type: "number",
                        required: true,
                        trigger: "change",
                    },
                ],
                uploadType: [
                    {
                        type: "number",
                        required: true,
                        trigger: "change",
                    },
                ],
                endTime: [
                    {
                        type: "date",
                        required: true,
                        trigger: "change",
                    },
                ],
                logTypeList: [
                    {
                        type: "array",
                        required: true,
                        trigger: "change",
                        message: this.$t("devLog.logTypeListErrMsg"),
                    },
                ],
                filePath: [
                    {
                        required: true,
                        message: this.$t("devLog.filePathErrMsg"),
                        trigger: "blur",
                    },
                ],
            },
            timeRange: [],
        };
    },
    mounted() {
        this.getDevLogFileType();
    },
    computed: {},
    watch: {},
    methods: {
        submit() {
            this.$refs.uploadForm.validate((valid) => {
                if (valid) {
                    let params = {
                        ...this.uploadForm,
                        ...{
                            deviceList: Array.isArray(this.deviceCode)
                                ? this.deviceCode
                                : [this.deviceCode],
                            startTime: "",
                            endTime:
                                this.uploadForm.uploadMode > 0
                                    ? this.$moment(
                                          this.uploadForm.endTime
                                      ).format("YYYY-MM-DD")
                                    : "",
                        },
                    };
                    if (this.timeRange && this.timeRange.length > 0) {
                        params.startTime = this.$moment(
                            this.timeRange[0]
                        ).format("YYYY-MM-DD HH:mm:ss");
                        params.endTime = this.$moment(this.timeRange[1]).format(
                            "YYYY-MM-DD HH:mm:ss"
                        );
                    }
                    this.$api.addDevLogTask(params).then((res) => {
                        if (res.success == true) {
                            // "已向设备下发上传任务，请等待上传成功后查看！"
                            this.$message.success(
                                this.$t("devLog.addDevLogTaskSuccess")
                            );
                            this.cancel();
                        } else {
                            this.$message.error(res.msg);
                        }
                        this.$api.eventTrackTrigger({
                            menu: "DEVDEVICE_LOG",
                            business: this.business,
                            eventResult: res.success,
                        });
                    });
                }
            });
        },
        cancel() {
            this.$emit("cancel", false);
        },
        uploadMethodChange(val) {
            this.uploadForm = {
                uploadMode: val,
                endTime: val > 0 ? this.$moment().add(3, "days").toDate() : "",
                uploadType: 0,
                logTypeList: [],
                filePath: "",
            };
        },
        getDevLogFileType() {
            this.$api.getDictByType("devLogFileType").then((res) => {
                if (res.success == true) {
                    this.logTypeList = res.data;
                    console.log(res);
                } else {
                    this.$message.error(res.msg);
                }
            });
            this.$api.getDictByType("devLogFileTypeRealTime").then((res) => {
                if (res.success == true) {
                    this.logTypeRealTimeList = res.data;
                    console.log(res);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
    },
};
</script>
<style lang="less" scoped>
.content {
    padding: 12px;
}
.el-radio-group,
.el-checkbox-group {
    margin-right: 12px;
    display: inline-block;
}
.el-form-item {
    margin-bottom: 8px;
}
</style>
