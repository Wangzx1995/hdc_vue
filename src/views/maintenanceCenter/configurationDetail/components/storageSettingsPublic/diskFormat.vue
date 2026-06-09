<template>
    <div class="p-a-md">
        <h2>格式化SD卡</h2>
        <el-row style="font-size: large;" >
            <el-col :span="2">SD卡1</el-col>
            <el-col :span="3">状态：正常</el-col>
            <el-col :span="4">存储介质属性：正常盘</el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="3">
                <template>
                    <span @click="dialogVisible = true" style="font-size: large;color: dodgerblue" >
                        格式化
                    </span>
                    <el-dialog :visible.sync="dialogVisible" >
                        确定格式化SD卡1吗？
                        <span slot="footer" class="dialog-footer">
                          <el-button type="primary" @click="dialogVisible = false">取消</el-button>
                          <el-button @click="dialogVisible = false">格式化</el-button>
                        </span>
                    </el-dialog>
                </template>
            </el-col>
        </el-row>
        <el-row>&nbsp;</el-row>
        <el-row style="font-size: large;" >
            <el-col :span="2">SD卡2</el-col>
            <el-col :span="3">状态：正常</el-col>
            <el-col :span="4">存储介质属性：正常盘</el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="3">
                <template>
                    <span @click="dialogVisible = true" style="font-size: large;color: dodgerblue" >
                        格式化
                    </span>
                    <el-dialog :visible.sync="dialogVisible" >
                        确定格式化SD卡2吗？
                        <span slot="footer" class="dialog-footer">
                          <el-button type="primary" @click="dialogVisible = false">取消</el-button>
                          <el-button @click="dialogVisible = false">格式化</el-button>
                        </span>
                    </el-dialog>
                </template>
            </el-col>
        </el-row>
        <el-row>&nbsp;</el-row>
        <h2>格式化磁盘</h2>
        <el-row style="font-size: large">
            <el-col :span="2">HDD</el-col>
            <el-col :span="3">状态：正常</el-col>
            <el-col :span="4">存储介质属性：正常盘</el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="3">
                <template>
                    <span @click="dialogVisible = true" style="font-size: large;color: dodgerblue" >
                        格式化
                    </span>
                    <el-dialog :visible.sync="dialogVisible" >
                        确定格式化HDD吗？
                        <span slot="footer" class="dialog-footer">
                          <el-button type="primary" @click="dialogVisible = false">取消</el-button>
                          <el-button @click="dialogVisible = false">格式化</el-button>
                        </span>
                    </el-dialog>
                </template>
            </el-col>
        </el-row>
    </div>

</template>

<script>
export default {
    name: "diskFormat",
    data() {
        return {
            dialogVisible: false
        };
    }
}
</script>

<style scoped>

</style>