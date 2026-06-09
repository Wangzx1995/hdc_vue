<template>
  <div class="agreement-config p-a-md">
      <h2>版本信息</h2>
      <el-form
        label-position="top"
        label-width="120px"
      >
        <el-row>
          <el-col :span="4">
            <el-form-item label="更新时间">
              <span>{{deviceInfo.deviceParamLastTimeVo && deviceInfo.deviceParamLastTimeVo.httpParamQueryLastOne && deviceInfo.deviceParamLastTimeVo.httpParamQueryLastOne.time ||'--'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="">
                <el-button icon="el-icon-refresh" type="primary" @click="syncHttpDeviceConfigParams">查询最新参数</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <h2>设备参数</h2>
      <template v-if="JSON.stringify(httpDeviceConfigParams) == '{}'">
        <EmptyBox>
          <p slot="description" class="text-md">获取失败，请点击“查询最新参数”按键获取设备参数详情～</p>
        </EmptyBox>
      </template>
      <template v-else>
        <el-row v-for="(value,key,index) in httpDeviceConfigParams" v-bind:key="index" class="text-md m-y-sm">
          <el-col :span="4">参数项：{{key}}</el-col> 
          <el-col :span="4">参数值：{{value}}</el-col> 
        </el-row>
      </template>
  </div>
</template>
<script>
import EmptyBox from '@/components/coreManage/emptyBox'
export default {
  components:{EmptyBox},
  data() {
    return {
      deviceInfo: {},
      httpDeviceConfigParams: {}
    }
  },
  methods: {
    // 获取设备详情
    getParamDeviceById(){
      let params={
        deviceId: this.$route.query.deviceId
      }
      this.$api.getParamDeviceById(params).then((res) => {
         if (res.success == true) {
          this.deviceInfo=res.data.length>0?res.data[0]:{}
        } else {
          this.$message.error('获取设备信息失败:' + res.msg)
        }
      });
    },
    getHttpDeviceConfigParams(){
      let params={
        deviceId: this.$route.query.deviceId
      }
      this.$api.getHttpDeviceConfigParams(params).then((res) => {
         if (res.success == true) {
          this.httpDeviceConfigParams=JSON.parse(res.data)
        } else {
          this.$message.error('获取设备的HTTP配置参数失败:' + res.msg)
        }
      });
    },
    syncHttpDeviceConfigParams(){
      let params={
        deviceIds: this.$route.query.deviceId,
        organizeId: this.$route.query.organizeId,
      }
      this.$api.syncHttpDeviceConfigParams(params).then((res) => {
         if (res.success == true) {
          this.$message('已向设备发送请求，请等待…')
        } else {
          this.$message.error('通知设备以HTTP形式上报配置参数失败:' + res.msg)
        }
      });
    },
  },
  mounted(){
    this.getParamDeviceById()
    this.getHttpDeviceConfigParams()
  },
}
</script>

<style lang="less" scoped>
.agreement-config{
    height: 100%;
    overflow-y: auto;
}
</style>