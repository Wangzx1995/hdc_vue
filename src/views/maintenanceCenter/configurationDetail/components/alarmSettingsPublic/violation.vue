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
                    <el-form-item label="开始时间" class="m-r-md">
                        <el-input v-model="form.begin" suffix-icon="el-icon-time"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" >
                    <el-form-item label="结束时间" class="m-r-md">
                        <el-input v-model="form.end" suffix-icon="el-icon-time"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" ></el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "violation",
    data () {
        return {
            form: {
                begin: '05:00',
                end: '08:00'
            }
        }
    }
}
</script>

<style scoped>

</style>