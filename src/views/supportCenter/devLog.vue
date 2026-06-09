<template>
    <div class="bg">
        <el-tabs v-model="activeName">
            <!-- 单车查询日志 -->
            <el-tab-pane :label="$t('devLog.carQueryLog')" name="first">
                <car-query-log></car-query-log>
            </el-tab-pane>
            <!-- 批量上传日志 -->
            <el-tab-pane :label="$t('devLog.batchUploadLog')" name="second">
                <batch-upload-log></batch-upload-log>
            </el-tab-pane>
            <!-- 日志上传记录 -->
            <el-tab-pane
                :label="$t('devLog.devLogRecord')"
                name="third"
                v-if="$store.state.user.technicalSupportEngineerSign"
            >
                <dev-log-record></dev-log-record>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import carQueryLog from "./devLogComponent/carQueryLog.vue";
import batchUploadLog from "./devLogComponent/batchUploadLog.vue";
import devLogRecord from "./devLogRecord.vue";
export default {
    name: "devLog",
    components: { carQueryLog, batchUploadLog, devLogRecord },
    props: {},
    data() {
        return { activeName: "first" };
    },
    mounted() {},
    computed: {},
    watch: {},
    methods: {},
};
</script>
<style lang="less" scoped>
.bg {
    padding: 12px;
    background: #f5f5f5;
    /deep/.el-tabs {
        height: 100%;
        background: #ffffff;
        .el-tabs__content {
            height: calc(~"100% - 47px");
            .el-tab-pane {
                height: 100%;
            }
        }
    }
}
</style>
