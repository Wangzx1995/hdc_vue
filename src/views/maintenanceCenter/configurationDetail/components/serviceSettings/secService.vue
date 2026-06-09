<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
        <el-form
            ref="form"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <el-row type="flex" justify="space-between">
                <el-col :span="6" >
                    <el-form-item label="从服务器APN" class="m-r-md">
                        <el-input v-model="form.apn"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" >
                    <el-form-item label="从服务器无线通信拨号用户名" class="m-r-md">
                        <el-input v-model="form.uname"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" >
                    <el-form-item label="从服务器无线通信密码" class="m-r-md">
                        <el-input v-model="form.pw"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="6" >
                    <el-form-item label="从服务器备份地址" class="m-r-md">
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "secService",
    data () {
        return {
            form: {
                apn: '',
                uname: '',
                pw: '',
                address: ''
            }
        }
    }
}
</script>

<style scoped>

</style>