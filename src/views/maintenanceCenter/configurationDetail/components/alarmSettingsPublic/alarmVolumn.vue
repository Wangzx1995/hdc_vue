<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
        <el-form
            ref="form"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top:10px"

        >
            <el-row type="flex" justify="space-between">
                <el-col :span="6" >
                    <el-form-item label="报警开关" class="m-r-md">
                        <el-select v-model="form.switch"></el-select>
                        <span style="color: #90a4ae;font-size: 10px" >开启后可统一设置报警音量</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6" >
                    <div class="block">
                        <span style="font-size: 14px">报警提示音量</span>
                        <el-slider v-model="value1"></el-slider>
                    </div>
                </el-col>
                <el-col :span="6" ></el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "alarmVolumn",
    data () {
        return {
            form : {
                switch: ''
            },
            value1: 40,
        }
    }
}
</script>

<style scoped>

</style>