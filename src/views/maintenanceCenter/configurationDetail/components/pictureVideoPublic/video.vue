<template>
  <div class="p-a-md">
    <el-form
      ref="PublicVideo"
      label-position="top"
      :model="form"
      label-width="120px"
    ></el-form>
      
  </div>
</template>

<script>
import {validateNum} from '@/utils/validate';
export default {
  props:{
    detail:{
      type: Object,
      default:()=>{
        return {}
      }
    },
    isTemplate: {
      type: String
    },
    configParams:{
      type:Boolean,
      default:false
    },
    allCopyData:{
      type: Object,
      default:()=>{
        return {}
      }
    },
    formDetail:{
      type: Object,
      default:()=>{
        return {}
      }
    },
    everyVolumeBol:{
      type:Boolean,
      default:false
    },
    deviceCapabilities:{
      type: Object,
      default:()=>{
        return {}
      }
    },
    postChannel:{
      type: Object,
      default:()=>{
        return {}
      }
    },
    postChannelData:{
      type: Object,
      default:()=>{
        return {}
      }
    }
  },
  watch:{
    
    detail: {
      handler (newVal,oldVal) {
        // console.log(newVal)
        this.form = newVal
      },
      deep: true,
      immediate:true,
    },
    formDetail:{
      handler (newVal,oldVal) {
        console.log(newVal)
        this.formData = newVal
      },
      deep: true,
      immediate:true,
    },
    allCopyData: {
      handler (newVal,oldVal) {
        console.log(newVal)
        this.copyForm = newVal
      },
      deep: true,
      immediate:true,
    },
    postChannel:{
      handler (newVal,oldVal) {
        console.log(newVal)
        this.channelForm = newVal
      },
      deep: true,
      immediate:true,
    },
    copyForm: {
      handler (val) {
        console.log(val)
        if (JSON.stringify(val) !== '{}'){
          this.$emit('changeCopy',val)
        }
      },
      deep: true,
      immediate:false,
    },
    form: {
      handler (val) {
        if (JSON.stringify(val) !== '{}'){
          
          this.$emit('change',val)
        }
      },
      deep: true,
      immediate:true,
    },
    channelForm:{
      handler(val){
        if (JSON.stringify(val) !== '{}'){
          this.$emit('changeChannels',val)
        }
      },
      deep: true,
      immediate:false,
    },
    copyChannelForm:{
      handler(val){
        if (JSON.stringify(val) !== '{}'){
          this.$emit('changeCopyChannel',val)
        }
      },
      deep: true,
      immediate:false,
    },
    postChannelData:{
      handler (newVal,oldVal) {
        console.log(newVal)
        this.copyChannelForm = newVal
      },
      deep: true,
      immediate:true,
    },
    dialogVisible:{
      handler(val){
        if(val){
          this.volume = 50;
        }
      }
    },
    capabilitiesEmit: {
      handler (val){
        if (JSON.stringify(val) !== '{}'){
          this.$emit('capabilitiesEmit',val)
        }
      }
    },
    currentCommandId: {
      handler (newVal, oldVal) {
        // console.log(newVal)
        this.$emit('adasCommandId',newVal)
      }
    },
    currentIsApiTriggerInfo: {
       handler (newVal, oldVal) {
        //  console.log(newVal)
        this.$emit('currentIsApiTriggerInfos',newVal)
      }
    },
    volume:{
      handler (newVal, oldVal) {
         this.$emit('everyVolume',true);
      },
    },
    configParams:{
        handler (val) {
        if(!val){
          this.getByIsApi(this.activeName,this.activeChannel,false);
        }
      },
      deep: true,
      immediate:true,
    },
    
  },
  data() {
    return {
      deviceCapability:'',
      channelList:[],
      activeChannel:'',
      alarmLevelCopy:1,
      currentCommandId: '',
      currentIsApiTriggerInfo:'',
      showDeploy:false,
      dialogVisible: false,
      form:{},
      forms:{},
      channelForm:{},
      copyChannelForm:{},
      copyForm:{},
      formData:{},
      capabilitiesEmit:{},
      volume: 50,
      everyVolume:false,
      sendEveryVolume:false,
      checkNumber :function (rule, value, callback) {
        if (value!=='' && value!==null && value!==undefined) {
            if (!validateNum(value)) {
                callback(new Error("请输入正确的整数"));
            } else if(value<this.min){
              callback(new Error(`最小值为${this.min}`));
            } else if(value>this.max){
              callback(new Error(`最大值为${this.max}`));
            } else if((this.type=='short' && value>32767)||(this.type=='byte' && value>127)||(this.type=='int' && value> Math.pow(2,31)-1)) {
              callback(new Error("输入的数值超出有效范围"));
            } else {
              callback();
            }
        } else {
            // callback(new Error("请输入"));
            callback();
        }
      },
      activeName:'first',
      tablist: [
        // {
        //   name: '前车碰撞（FCW）',
        //   shortName: '前车碰撞',
        //   commandId: 'IsApiFcwInfoList',
        //   IsApiTriggerInfo:'IsApiFcwTriggerInfo',
        //   capability:'IsApiFcwInfoListCapability',
        //   alarmLevel: 1
        // },
        // {
        //   name: '车距过近（HMW）',
        //   shortName: '车距过近',
        //   commandId:'IsApiHmwInfoList',
        //   IsApiTriggerInfo:'IsApiHmwTriggerInfo',
        //   capability:'IsApiHmwInfoListCapability',
        //   alarmLevel: 1
        // },
        // {
        //   name: '车道偏离（LDW）',
        //   shortName: '车道偏离',
        //   commandId:'IsApiLdwInfoList',
        //   IsApiTriggerInfo:'IsApiLdwTriggerInfo',
        //   capability:'IsApiLdwInfoListCapability',
        //   alarmLevel: 1
        // },
        // {
        //   name: '行人监测（PCW）',
        //   shortName: '行人监测',
        //   commandId:'IsApiPcwInfoList',
        //   IsApiTriggerInfo:'IsApiPcwTriggerInfo',
        //   capability:'IsApiPcwInfoListCapability',
        //   alarmLevel: 1
        // },
        // {
        //   name: '交通标识识别（TSR）',
        //   shortName: '交通标识识别',
        //   commandId:'IsApiTsrInfoList',
        //   IsApiTriggerInfo:':IsApiTsrTriggerInfo',
        //   alarmLevel: 1
        // },
      ]
    }
  },
  methods: {
    getByIsApi(tabName,channel,type) {
      if(Boolean(this.isTemplate) == true){
        this.tablist.forEach(tab => {
          if (tab.name == tabName) {
            // console.log(tab.name);
            // console.log(tab.commandId);
            // params.commandIds.push(tab.commandId,tab.IsApiTriggerInfo)
            this.currentCommandId = tab.commandId;
            this.currentIsApiTriggerInfo = tab.IsApiTriggerInfo;
            this.showDeploy = true
          }
       })
        return
      }
      let params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiVideoInfo'],
      };
      this.$api.getDeviceConfigParamsByIsApi(params).then(res =>{
        if(res.success && !JSON.parse(res.data)['IsApiVideoInfo'].statusCode){

        }else{
          this.$message.error('获取设备配置参数失败:' + res.msg)
        }
        
      })
    },
    beforeLeave(){

    }
  },
  created(){
    this.getByIsApi()
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
  .alarmLevelBox{
    padding-bottom: 8px;
  }
  .el-switch__label{
    opacity: 0;
  }
  .prompt{
    display: block;
    width: 36%;
    font-size: 14px;
    color: darkgray;
    margin-top: 10px;
  }
</style>