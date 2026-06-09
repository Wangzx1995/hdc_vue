<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
        <el-form
            ref="form"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 20px"
        >
            <el-row type="flex" justify="space-between">
                <el-col :span="6" >
                    <el-form-item label="预览模式" class="m-r-md">
                        <el-select v-model="form.pattern"></el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" >
                    <el-form-item label="单画面预览模式下通道号" class="m-r-md">
                        <el-input v-model="form.channel"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" >
                    <el-form-item label="通道切换周期" class="m-r-md">
                        <el-input v-model="form.period"><span slot="suffix">s</span></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="6">
                    <el-form-item label="显示速度阀值"  class="m-r-md">
                        <el-select v-model="form.threshold"></el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6"></el-col>
                <el-col :span="6"></el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "cvbsParams",
    data () {
        return {
            form: {
                pattern: '',
                channel: '2',
                period: '0',
                threshold: '',
            }
        }
    }
}
</script>

<style scoped>

</style>