<template>
    <div class="drawer-detail">
        <div class="top-content">
            <div class="left-content content-box">
                <div class="big-title">近24小时设备概览</div>
                <left-content :detailData="detailData"></left-content>
            </div>
            <div class="right-content content-box">
                <div class="big-title">近24小时设备动态</div>
                <right-content :detailData="detailData"></right-content>
            </div>
        </div>
        <div class="bottom-content content-box">
            <div class="big-title">近24小时故障项巡检状态</div>
            <bottom-content :detailData="detailData"></bottom-content>
        </div>
        <div>
            <el-button type="primary" @click="seeMore()"> 查看更多 </el-button>
            <el-button @click="closeDrawer()">关闭</el-button>
        </div>
        <el-button
            class="close-btn"
            type="primary"
            icon="el-icon-close"
            plain
            @click="closeDrawer"
        ></el-button>
    </div>
</template>
<script>
import leftContent from "./leftContent.vue";
import rightContent from "./rightContent.vue";
import bottomContent from "./bottomContent.vue";
export default {
    name: "",
    components: { leftContent, rightContent, bottomContent },
    props: {
        detailData: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {};
    },
    mounted() {
        console.log(
            "🚀 ~ detailData:",
            JSON.parse(JSON.stringify(this.detailData))
        );
    },
    computed: {},
    watch: {},
    methods: {
        closeDrawer() {
            this.$emit("closeDrawer");
        },
        seeMore() {
            this.$emit("seeMore");
        },
    },
};
</script>
<style lang="less" scoped>
.drawer-detail {
    height: 100%;
    padding: 14px;
    display: flex;
    flex-direction: column;
    overflow: auto;
    .content-box {
        border: 1px solid #dedede;
        border-radius: 6px;
        position: relative;
        padding: 24px 14px 14px 14px;
        .big-title {
            padding: 0px 12px;
            font-size: 14px;
            position: absolute;
            text-align: center;
            line-height: 20px;
            height: 20px;
            top: -10px;
            left: 50%;
            transform: translate(-50%, 0%);
            background: #ffffff;
        }
    }
    .top-content {
        display: flex;
        .left-content {
            flex: 1;
            margin-right: 14px;
            height: 438px;
        }
        .right-content {
            width: 350px;
            padding-top: 14px;
            padding-bottom: 0px;
            height: 438px;
        }
    }
    .bottom-content {
        margin-top: 24px;
        height: 380px;
    }
    & > div:nth-child(3) {
        margin-top: 14px;
    }
    /deep/.close-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 32px;
        height: 80px;
        background: #b3d8ff;
        border: 1px solid #1989fa;
        border-radius: 16px 0px 0px 16px;
        left: -42px;
        top: 50%;
        transform: translate(0%, -50%);
        i {
            font-size: 24px;
        }
        &:hover {
            background-color: #409eff;
            border-color: #409eff;
        }
    }
}
</style>
<style lang="less">
.conditionMonitoring-drawer {
    overflow: visible;
    .el-drawer__body {
        overflow: visible;
        height: 100%;
    }
}
</style>
