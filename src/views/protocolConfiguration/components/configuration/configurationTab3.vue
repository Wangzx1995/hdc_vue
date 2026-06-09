<template>
    <div>
        <G-SearchTableList
            ref="SearchTableList"
            :applicationJson="false"
            :columns="columns"
            :url="url"
            :customHeight="159"
            :highlightCurrentRow="true"
            @formatParams="formatParams"
            @currentChange="currentChange"
        >
            <template v-slot:operation="scope">
                <a class="m-r-sm colorBlue" @click="openDetail(scope.data)"
                    >查看</a
                >
            </template>
        </G-SearchTableList>
        <el-dialog
            title="查看"
            :visible.sync="visible"
            :close-on-click-modal="false"
            :width="'1500px'"
            :custom-class="'protocol-template-dialog'"
        >
            <div class="detail-content">
                <protocol-template
                    :isTemplateBol="true"
                    :key="timer"
                    :id="detailObj.id"
                    :type="detailObj.type"
                    :organizeId="detailObj.organizeId"
                ></protocol-template>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import protocolTemplate from "@/views/protocolConfiguration/components/protocolTemplate.vue";
export default {
    name: "",
    props: {
        tabPosition: {
            type: String,
        },
    },
    components: { protocolTemplate },
    data() {
        return {
            //列表请求url
            url: "/hikDevParamTemp/page",
            //表格列
            columns: [
                {
                    label: "模板名称",
                    prop: "templateName",
                },
                {
                    label: "上传时间",
                    prop: "createTime",
                },
                {
                    label: "设备型号",
                    prop: "deviceModelName",
                },
                {
                    label: "设备版本号",
                    prop: "version",
                },
                {
                    label: "备注",
                    prop: "templateRemark",
                },
                {
                    label: "操作",
                    slot: "operation",
                },
            ],
            timer: null,
            visible: false,
            detailObj: {},
        };
    },
    mounted() {},
    computed: {},
    watch: {
        tabPosition(newVal) {
            if (newVal === "tab3") {
                this.$nextTick(() => {
                    this.$refs.SearchTableList.$refs.GTable.tableResize();
                });
            }
        },
    },
    methods: {
        searchForm() {
            this.$refs.SearchTableList.searchForm({}, true);
        },
        formatParams(params) {
            params.protocolType = 1;
            params.templateType = 1;
            params.deviceModelCode = this.$route.query.deviceModelCode;
        },
        currentChange(row) {
            let param = {
                deviceModelCode: this.$route.query.deviceModelCode,
                organizeId: this.$route.query.organizeId,
                deviceIds: [this.$route.query.deviceId],
                paramType: 1,
                templateId: row.id,
            };
            this.$emit("templateObjChange", row);
        },
        cancel() {
            this.visible = false;
        },
        openDetail(data) {
            this.timer = new Date().getTime();
            this.detailObj = {
                id: data.id,
                type: data.type,
                organizeId: data.organizeId,
            };
            this.visible = true;
        },
    },
};
</script>
<style lang="less" scoped>
.detail-content {
    height: 600px;
}
</style>
<style lang="less">
.protocol-template-dialog {
    .el-dialog__body {
        padding: 0;
    }
}
</style>
