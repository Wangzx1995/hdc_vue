<template>
  <div class="p-a-md">
    <h2>复位号码</h2>
    <el-form ref="form" label-position="top" :model="form" label-width="120px">
        <div class="configurations">
            <div v-if="form.resetPhoneNumber !==''" class="configuration-item">
                <el-form-item class="m-r-md p-r">
                    <template #tips>
                        复位电话号码
                        <el-tooltip
                            class="item"
                            content="可采用此电话号码拨打终端电话让终端复位。"
                            placement="right-start"
                        >
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </template>
                    <el-input v-model="form.resetPhoneNumber"></el-input>
                </el-form-item>
            </div>
            <div v-if="form.restoreFactorySetupNumber !==''" class="configuration-item">
                <el-form-item class="m-r-md p-r">
                    <template #tips>
                        恢复出厂设置号码
                        <el-tooltip
                            class="item"
                            content="可采用此电话号码拨打终端电话让终端恢复出厂设置。"
                            placement="right-start"
                        >
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </template>
                    <el-input v-model="form.restoreFactorySetupNumber"></el-input>
                </el-form-item>
            </div>
        </div>
      <!-- <el-row type="flex" justify="space-between">
        <el-col :span="6">
          
        </el-col>
        <el-col :span="6">
          
        </el-col>
        <el-col :span="6"></el-col>
      </el-row> -->
    </el-form>
    <h2 class="m-t-lg">设备操作</h2>
    <el-form label-position="top">
        <div class="configurations">
            <div class="configuration-item">
                <el-form-item class="m-r-md p-r">
                    <template #tips>
                        部分恢复出厂设置
                        <el-tooltip
                            class="item"
                            content="保留wifi、智能算法标定、ADAS相机标定、平台、NTP校时、升级平台参数。"
                            placement="right-start"
                        >
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </template>
                    <el-popover
                        ref="popover"
                        placement="top"
                        width="200"
                        v-model="partVisible">
                        <p class="popover-text">确定部分恢复出厂设置吗？</p>
                        <div style="text-align: right;" class="m-t-md">
                            <el-button size="mini" type="default" @click="partVisible = false">取消</el-button>
                            <el-button type="primary" size="mini" @click="partVisible = false">确定</el-button>
                        </div>
                        <el-button slot="reference" :max-width="500" style="width:100%">部分恢复出厂设置</el-button>
                    </el-popover>
                </el-form-item>
            </div>
            <div class="configuration-item">
                <el-form-item label="恢复出厂设置" class="m-r-md p-r">
                    <el-popover
                        ref="popover"
                        placement="top"
                        width="200"
                        v-model="allVisible">
                        <p class="popover-text">确定恢复出厂设置吗？</p>
                        <div style="text-align: right;" class="m-t-md">
                            <el-button size="mini" type="default" @click="allVisible = false">取消</el-button>
                            <el-button type="primary" size="mini" @click="allVisible = false">确定</el-button>
                        </div>
                        <el-button slot="reference" :max-width="500" style="width:100%">恢复出厂设置</el-button>
                    </el-popover>
                </el-form-item>
            </div>
            <div class="configuration-item">
                <el-form-item label="重启设备" class="m-r-md p-r">
                    <el-popover
                        ref="popover"
                        placement="top"
                        width="200"
                        v-model="restartVisible">
                        <p class="popover-text">确定重启设备吗？</p>
                        <div style="text-align: right;" class="m-t-md">
                            <el-button size="mini" type="default" @click="restartVisible = false">取消</el-button>
                            <el-button type="primary" size="mini" @click="restartVisible = false">确定</el-button>
                        </div>
                        <el-button slot="reference" :max-width="500" style="width:100%">重启设备</el-button>
                    </el-popover>
                </el-form-item>
            </div>
        </div>
        <!-- <el-row type="flex" justify="space-between">
            <el-col :span="6">
                
            </el-col>
            <el-col :span="6">
                
            </el-col>
            <el-col :span="6">
                
            </el-col>
        </el-row> -->
    </el-form>
  </div>
</template>

<script>
export default {
    name: 'deviceSetting',
    data() {
        return {
        partVisible: false,
        allVisible: false,
        restartVisible: false,
        form:{
            resetPhoneNumber:'18811786789',
            restoreFactorySetupNumber:'18811786789',
        }
        }
    },
}
</script>

<style lang="less" scoped>
.question{
    position: absolute;
    top: 4%;
    left: 85%;
    font-size: 20px;
}
.question-button{
    position: absolute;
    top: 4%;
    left: 11rem;
    font-size: 20px;
}
</style>