<template>
    <div class="condition-monitoring-detail p-a">
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="主机" name="first"> -->
        <formDetail :carDetails="carDetails"></formDetail>
        <!-- </el-tab-pane>
      <el-tab-pane label="外设" name="second">外设</el-tab-pane>
    </el-tabs> -->
    </div>
</template>

<script>
import formDetail from "../../components/statusMonitor/formDetail.vue";
export default {
    components: { formDetail },
    props: {
        carDetails: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            activeName: "first",
        };
    },
    methods: {
        handleClick(tab, event) {
            // console.log(tab, event);
        },
    },
};
</script>

<style lang="less" scoped>
.condition-monitoring-detail {
}
</style>
