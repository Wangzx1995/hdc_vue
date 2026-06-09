<template>
    <!-- title="服务到期提醒" -->
    <el-dialog
        :title="$t('promptUser.promptTest1')"
        :visible.sync="dialogVisible"
        :width="'500px'"
    >
        <div style="text-align: left">
            <p class="">
                <!-- 尊敬的客户 -->
                {{ $t("promptUser.promptTest2") }}
                ：
            </p>
            <p v-if="days <= 0" class="title">
                <!-- 您购买的车辆授权 -->
                {{ $t("promptUser.promptTest3") }}
                ，{{ endDate }}
                <!-- 已经全部到期，您还可以使用本产品 -->
                {{ $t("promptUser.promptTest4") }}
                <span class="numberTime"
                    >0
                    <!-- 天 -->
                    {{ $t("promptUser.promptTest5") }}
                </span>
                ，
                <!-- 请及时续费 -->
                {{ $t("promptUser.promptTest6") }}
                ！
            </p>
            <p v-else class="title">
                <!-- 您购买的车辆授权，即将全部到期，您还可以使用本产品 -->
                {{ $t("promptUser.promptTest7") }}
                <span class="numberTime"
                    >{{ days }}
                    <!-- 天 -->
                    {{ $t("promptUser.promptTest5") }}
                </span>
                ，
                <!-- 请及时续费 -->
                {{ $t("promptUser.promptTest6") }}
                ！
            </p>
            <p class="manage">
                <!-- 详情可咨询本地分公司销售 -->
                {{ $t("promptUser.promptTest8") }}
                。
            </p>
        </div>
        <span slot="footer">
            <el-button type="primary" @click="dialogVisible = false">
                <!-- 知道了 -->
                {{ $t("promptUser.promptTest9") }}
            </el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    name: "PromptUser",
    components: {},
    data() {
        return {
            days: "",
            dialogVisible: false,
            endDate: "",
        };
    },
    props: {
        showManage: {
            type: String,
            default: [],
        },
    },
    watch: {
        showManage: {
            handler(newVal, oldVal) {
                if (newVal) {
                    let newValue = JSON.parse(newVal);
                    this.dialogVisible = newValue.showWarn;
                    this.days = newValue.surplus;
                    this.endDate = newValue.useDate;
                }
            },
            deep: true,
            immediate: true,
        },
    },
};
</script>
<style scoped lang="less">
.title {
    text-indent: 28px;
    font-size: 14px;
    color: #000;
    .numberTime {
        color: #f00;
        font-size: 18px;
    }
    .numberTimeTold {
        font-size: 14px;
        color: #f00;
    }
}
.manage {
    text-indent: 28px;
    margin-top: 10px;
    font-size: 14px;
    color: #000;
    padding-bottom: 50px;
}
</style>
