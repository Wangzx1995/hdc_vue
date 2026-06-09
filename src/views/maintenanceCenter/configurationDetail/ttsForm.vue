<template>
  <div>
    <div class="tts-form p-a-md">
      <h2 class="m-b">设备配置详情</h2>
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="rules"
        content-width="450px"
      >
        <el-form-item label="配置主题" prop="configTxtTitle">
          <el-input v-model="form.configTxtTitle" placeholder="请输入配置主题" type="textarea" :count="128" :rows="2"></el-input>
        </el-form-item>
        <el-form-item label="配置内容" prop="configTxtContent">
          <el-input v-model="form.configTxtContent" placeholder="请输入要下发的配置内容" type="textarea" :count="200" :rows="6"></el-input>
        </el-form-item>
        <!-- <el-form-item label="文本类型" prop="configTypes">
          <el-checkbox-group v-model="form.configTypes">
            <el-checkbox label="display">终端显示器信息</el-checkbox>
            <el-checkbox label="read">终端TTS播报</el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
      </el-form>
    </div>
    <div class="config-bottom b-a p-r-md">
      <el-button type="default" @click="goBack">返回</el-button>
      <el-button type="primary" @click="sendTtsConfig">下发至终端</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      form:{
        configTxtTitle:'',
        deviceId: this.$route.query.deviceId,
        configTxtContent:'',
        configProp: 0,
        configTypes:['display','read']
      },
      rules: {
          configTxtTitle:[
            {max: 128, message: '长度在128个字符内', trigger: 'blur'}
          ],
          configTxtContent: [
            { required: true, message: '请输入配置内容', trigger: 'blur' },
            { max: 200, message: '长度在200个字符内', trigger: 'blur' }
          ],
          // configTypes: [
          //   { required: true, type:'array', message: '请选择文本类型', trigger: 'change' },
          // ],
      }
    }
  },
  methods:{
    goBack(){
      this.$router.push('/maintenanceCenter/deviceConfiguration')
    },
    //刷新Session
    refreshSession(){
        var _this=this;
        this.refreshSessionHandle=setInterval(function(){
            _this.$api.refreshSession().then((res) => {
            });
        },1000*60)
    },
    sendTtsConfig(){
      this.$refs.form.validate((valid) => {
          if (valid) {
            console.log(this.form);
             this.$api.saveTtsTextConfig(this.form).then((res) =>{
            if(res.success == true) {
              this.$emit('ttsSuccess',res.data)
            } else {
                this.$message.error('TTS配置文本下发失败' + res.msg);
            }
        });
          }
        });
    }
  },
  mounted(){
    this.refreshSession()
  }
}
</script>
<style lang="less" scoped>
  .config-bottom{
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    justify-content: flex-end;
    margin: 0;
  }
</style>