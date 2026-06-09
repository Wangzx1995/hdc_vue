<template>
  <div class="configuration-detail">
    <AgreementConfig v-if="showAgreenMeentConfigBol" :isApiDeciveBols="$route.query.isBubiao?false:isApiDeciveBol" @open="openDialog" @protocolSuccess="configSuccess"></AgreementConfig>
    <StartConfig :visible.sync="startConfigVisible" :organizeId="organizeId" :batchCode="batchCode" :configType="configType" :top="configType=='file'?'200px':'middle'"></StartConfig>
  </div>
  
</template>

<script>
// import TtsForm from './ttsForm'
// import FileConfig from './fileConfig'
import AgreementConfig from './agreementConfig'
// import HttpConfig from './httpConfig'
// import StartConfig from '@/components/coreManage/startConfig'
import StartConfig from '@/components/coreManage/startConfig'

export default {
  components: {
    AgreementConfig,StartConfig
  },
  name:'AgreementIndex',
  data() {
    return {
      showAgreenMeentConfigBol:false,
      dialogVisible:false,
      typeVisible:false,
      startConfigVisible: false,
      organizeId: +this.$route.query.organizeId,
      batchCode:'',
      configType:'',
      isApiDeciveBol:false
    }
  },
  created(){
    this.getISApiCapality();
  },
  methods: {
    openDialog(){
      this.dialogVisible=true
    },
    configSuccess(data){
      if(!this.startConfigVisible){
        this.startConfigVisible=true
        this.configType="protocol"
        this.batchCode=data
      }      
    },
    configFileSuccess(data) {
      this.startConfigVisible=true
      this.configType="file"
      this.batchCode=data
    },
    configTTSSuccess(data){
      this.startConfigVisible=true
      this.batchCode=data
      this.configType="tts"
    },
    getISApiCapality(){
      let params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiChannelsCapability'],
      }
      this.showAgreenMeentConfigBol = false;
      this.$api.getDeviceConfigParamsByIsApi(params).then(res =>{
        if(res.success == true){
          if(JSON.stringify(JSON.parse(res.data)) != '{}' && !JSON.parse(res.data)['IsApiChannelsCapability']['statusCode'] && JSON.parse(res.data)['IsApiChannelsCapability']['channelEventList'].length>0){
            this.isApiDeciveBol = true;
          }else{
            this.isApiDeciveBol = false;
          }
        }
        this.showAgreenMeentConfigBol = true
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>