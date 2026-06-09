<template>
  <div class="p-a-md">
    <el-form
      ref="PublicVolume"
      label-position="top"
      :model="form"
      label-width="120px"
    >
    <template v-if="showDeploy">
      <el-tabs id="title" v-model="activeName" :before-leave="beforeLeave" @tab-click="getByIsApi(activeName,true)">
          <el-tab-pane :label="item.name" :name="item.name" v-for="item in tablist" :key="item.index">
             <template v-if="form[currentCommandId]">
            <el-row type="flex" justify="space-between" class="m-t-sm">
              <!-- <el-form-item>
                <el-radio-group v-model="item.alarmLevel" type="simple">
                  <el-radio-button :label="1">一级报警</el-radio-button>
                  <el-radio-button :label="2">二级报警</el-radio-button>
                </el-radio-group>                
              </el-form-item> -->
              <!-- <div class="alarmLevelBox">
              <el-button @click="changeAlarmLevel(item,1)" :type="item.alarmLevel==1 ? 'primary' : 'default'">一级报警</el-button>
              <el-button @click="changeAlarmLevel(item,2)" :type="item.alarmLevel==2 ? 'primary' : 'default'">二级报警</el-button>
            </div> -->
            </el-row>
              <div> 
                <el-row type="flex" justify="space-between">
                  <el-col :span="7" >
                       <el-form-item label="音频模式" >
                            <el-select v-show="form[currentCommandId] && activeName =='系统音频'" v-model="form[currentCommandId].audioOutputInterfaceMode">
                            <el-option
                                v-for="item in capabilitiesModeSys"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select class="111" v-show="form[currentCommandId] && activeName =='报警音频'" v-model="form[currentCommandId].audioOutputInterfaceMode">
                            <el-option
                                v-for="item in capabilitiesMode"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="音频输出口类型" >
                            <el-select v-show="form[currentCommandId] && activeName =='系统音频'" :disabled="form[currentCommandId].audioOutputInterfaceMode == 'auto'" v-model="form[currentCommandId].audioOutputInterfaceType">
                            <el-option
                                v-for="item in capabilitiesArrSys"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select class="111" v-show="form[currentCommandId] && activeName =='报警音频'" :disabled="form[currentCommandId].audioOutputInterfaceMode == 'auto'" v-model="form[currentCommandId].audioOutputInterfaceType">
                            <el-option
                                v-for="item in capabilitiesArr"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="7" >
                       <el-form-item v-if="activeName =='系统音频'" label="音量" >
                           <el-slider v-show="form[currentCommandId]" v-model="form['IsApiSysAudioInfo']['audioOutVolumeList'][0].volume" :min="form['IsApiSysAudioInfoCapability'].volumeMin" :max="form['IsApiSysAudioInfoCapability'].volumeMax" :step="1" show-input></el-slider>
                        </el-form-item>
                    </el-col>
                </el-row>
              </div>
             </template>
          </el-tab-pane>
      </el-tabs>
    </template>
  </el-form>
      
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
    componentName:{
      type:String,
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
    nowCommandId:{
      type:String,
      default:()=>{
        return {}
      }
    }
  },
  watch:{
    nowCommandId:{
      handler (newVal,oldVal) {
        this.currentCommandId = newVal
      },
      deep: true,
      immediate:true,
    },
     detail: {
      handler (newVal,oldVal) {
        if(newVal['IsApiDriverEyeClosedInfo']){
          console.log(newVal['IsApiDriverEyeClosedInfo'].dbaList)
        }
        this.form = newVal
        this.showDeploy = this.form[this.currentCommandId] ? true : false;
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
    componentName:{
      handler(newVal,oldVal){
        if(newVal == 'PublicDba')
        this.commandIds = 'IsApiDbaInfoList';
      },
      deep: true,
      immediate:true,
    },
    form: {
      handler (val) {
        if (JSON.stringify(val) !== '{}'){
          this.$emit('change',val)
        }
      },
      deep: true,
      immediate:false,
    },
    configParams:{
        handler (val) {
        if(!val){
          this.getByIsApi(this.activeName,false);
        }
      },
      deep: true,
      immediate:true,
   },
    currentCommandId: {
      handler (newVal, oldVal) {
        this.$emit('adasCommandId',newVal)
      }
    },
    currentIsApiTriggerInfo: {
       handler (newVal, oldVal) {
        this.$emit('currentIsApiTriggerInfos',newVal)
      }
    },
    'form.IsApiAlarmAudioInfo':{
      handler (val) {
        if(val!=undefined){
          this.$refs['PublicVolume'].validate((valid) => {
            if(valid){
              this.formData['IsApiAlarmAudioInfo.audioOutputInterfaceMode'] = val['audioOutputInterfaceMode'] != this.copyForm['IsApiAlarmAudioInfo']['audioOutputInterfaceMode'] ? `IsApiAlarmAudioInfo.audioOutputInterfaceMode&音量设置/报警音频/音频模式&${this.capabilitiesModeJson[val['audioOutputInterfaceMode']]}` : '';
              this.formData['IsApiAlarmAudioInfo.audioOutputInterfaceType'] = val['audioOutputInterfaceType'] != this.copyForm['IsApiAlarmAudioInfo']['audioOutputInterfaceType'] ? `IsApiAlarmAudioInfo.audioOutputInterfaceType&音量设置/报警音频/音频输出口类型&${this.capabilitiesArrJson[val['audioOutputInterfaceType']]}` : '';
            }else{
              this.formData['IsApiAlarmAudioInfo.audioOutputInterfaceMode'] = '';
              this.formData['IsApiAlarmAudioInfo.audioOutputInterfaceType'] = '';
            }
            this.$emit('changeData',this.formData)
          })
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiSysAudioInfo':{
      handler (val) {
        if(val!=undefined){
          this.$refs['PublicVolume'].validate((valid) => {
            if(valid){
              this.formData['IsApiSysAudioInfo.audioOutputInterfaceMode'] = val['audioOutputInterfaceMode'] != this.copyForm['IsApiSysAudioInfo']['audioOutputInterfaceMode'] ? `IsApiSysAudioInfo.audioOutputInterfaceMode&音量设置/系统音频/音频模式&${this.capabilitiesModeJsonSys[val['audioOutputInterfaceMode']]}` : '';
              this.formData['IsApiSysAudioInfo.audioOutputInterfaceType'] = val['audioOutputInterfaceType'] != this.copyForm['IsApiSysAudioInfo']['audioOutputInterfaceType'] ? `IsApiSysAudioInfo.audioOutputInterfaceType&音量设置/系统音频/音频输出口类型&${this.capabilitiesArrJsonSys[val['audioOutputInterfaceType']]}` : '';
              this.formData['IsApiSysAudioInfo.audioOutVolumeList.0.volume'] = val['audioOutVolumeList'][0]['volume'] != this.copyForm['IsApiSysAudioInfo']['audioOutVolumeList'][0]['volume'] ? `IsApiSysAudioInfo.audioOutVolumeList.0.volume&音量设置/系统音频/音量&${val['audioOutVolumeList'][0]['volume']}` : '';
            }else{
              this.formData['IsApiSysAudioInfo.audioOutputInterfaceMode'] = '';
              this.formData['IsApiSysAudioInfo.audioOutputInterfaceType'] = '';
              this.formData['IsApiSysAudioInfo.audioOutVolumeList.0.volume'] = '';
            }
            this.$emit('changeData',this.formData)
          })
        }
      },
      deep: true,
      immediate:false,
    }
  },
  data() {
    return {
      form:{},
      capabilitiesArrJson:{},
      capabilitiesModeJson:{},
      capabilitiesArr:[],
      capabilitiesMode:[],
      capabilitiesArrJsonSys:{},
      capabilitiesModeJsonSys:{},
      capabilitiesArrSys:[],
      capabilitiesModeSys:[],
      copyForm:{},
      formData:{},
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
      activeName:'报警音频',
      showDeploy:false,
      currentCommandId:'',
    //   currentIsApiTriggerInfo:'',
      tablist: [
        {
          name: '报警音频',
          shortName: '报警音频',
          commandId: 'IsApiAlarmAudioInfo',
          capability:'IsApiAlarmAudioInfoCapability'
        },
        {
          name: '系统音频',
          shortName: '系统音频',
          commandId:'IsApiSysAudioInfo',
          capability:'IsApiSysAudioInfoCapability'
        },
      ]
    }
  },
  methods:{
    getByIsApi(tabName,type){
      if(Boolean(this.isTemplate) == true){
        this.makeDictionary(this.form);
        this.showDeploy = true;
        this.currentCommandId = tabName == '报警音频' ? 'IsApiAlarmAudioInfo' : 'IsApiSysAudioInfo';
        return
      } 
        let params = {
          deviceId: this.$route.query.deviceId || null,
          commandIds: [],
      }
      let findFlag = 0
      this.tablist.forEach(tab => {
        if (tab.name == tabName) {
          this.currentCommandId = tab.commandId;
          if(!type){
            this.$emit('adasCommandId',this.currentCommandId);
            // this.$emit('currentIsApiTriggerInfos',this.currentIsApiTriggerInfo)
          }
          if(this.form[tab.commandId]){
            // this.form[tab.commandId] = JSON.parse(JSON.stringify(this.copyForm[tab.commandId]));
            // this.form[tab.capability] = JSON.parse(JSON.stringify(this.copyForm[tab.capability]));
            this.copyForm = Object.assign({}, this.copyForm, JSON.parse(JSON.stringify(this.form)))
            this.capabilitiesEmit = this.form[this.currentCommandId];
            this.makeDictionary(this.copyForm)
          }else{
            params.commandIds.push(tab.commandId)
          }
          
          // params.commandIds.push(tab.commandId)
          
        //   this.currentIsApiTriggerInfo = tab.IsApiTriggerInfo;
          findFlag++
        }
      })
      if(!params.commandIds.length) return
      this.$api.getDeviceConfigParamsByIsApi(params).then(res =>{
        if (res.success == true) {
          let resData = JSON.parse(res.data);
          this.makeDictionary(resData)
          if(!this.form[params.commandIds[0]]){
            this.form = Object.assign({}, this.form, resData);
          }
          this.copyForm = Object.assign({}, this.copyForm, JSON.parse(JSON.stringify(resData)))
          this.capabilitiesEmit = JSON.parse(res.data)[this.currentCommandId];
          this.$nextTick(() =>{
            if(!document.querySelector('#title')){
              this.$message.info('获取设备配置异常，请点击“刷新最新配置”')
              return
            }
          })
          } else {
          this.$message.error('获取设备配置参数失败:' + res.msg)
        }
      })
    },
    makeDictionary(targetList){
      if(targetList['IsApiAlarmAudioInfo'] && this.activeName == '报警音频'){
        this.capabilitiesArrJson = {};
        this.capabilitiesModeJson = {};
        this.capabilitiesArr = [];
        this.capabilitiesMode = [];
        targetList['IsApiAlarmAudioInfoCapability']['audioOutputInterfaceTypeArray'].forEach(item =>{
          switch(item){
            case "RCA0":
              this.capabilitiesArr.push({
                value:item,
                label:'ADAS相机'
              })
              this.capabilitiesArrJson[item] = 'ADAS相机'
            break;
            case "RCA1":
              this.capabilitiesArr.push({
                value:item,
                label:'BDA相机'
              })
              this.capabilitiesArrJson[item] = 'BDA相机'
            break;
            case "RCA8":
              this.capabilitiesArr.push({
                value:item,
                label:'内置扬声器'
              })
              this.capabilitiesArrJson[item] = '内置扬声器'
            break;
            case "RCA9":
              this.capabilitiesArr.push({
                value:item,
                label:'手麦'
              })
              this.capabilitiesArrJson[item] = '手麦'
            break;
            case "RCA10":
              this.capabilitiesArr.push({
                value:item,
                label:'外置扬声器'
              })
              this.capabilitiesArrJson[item] = '外置扬声器'
            break;
            case "RCA15":
              this.capabilitiesArr.push({
                value:item,
                label:'ADAS和DBA相机'
              })
              this.capabilitiesArrJson[item] = 'ADAS和DBA相机'
            break;
          }
        })
        targetList['IsApiAlarmAudioInfoCapability']['audioOutputInterfaceModeArray'].forEach(item =>{
          switch(item){
            case "manual":
              this.capabilitiesMode.push({
                value:item,
                label:'手动'
              })
              this.capabilitiesModeJson[item] = '手动'
            break;
            case "auto":
              this.capabilitiesMode.push({
                value:item,
                label:'自动'
              })
              this.capabilitiesModeJson[item] = '自动'
            break;
          }
        })
      }
      if(targetList['IsApiSysAudioInfo'] && this.activeName == '系统音频'){
        this.capabilitiesArrJsonSys = {};
        this.capabilitiesModeJsonSys = {};
        this.capabilitiesArrSys = []
        this.capabilitiesModeSys = [];
        targetList['IsApiSysAudioInfoCapability']['audioOutputInterfaceTypeArray'].forEach(item =>{
          switch(item){
            case "RCA0":
              this.capabilitiesArrSys.push({
                value:item,
                label:'ADAS相机'
              })
              this.capabilitiesArrJsonSys[item] = 'ADAS相机'
            break;
            case "RCA1":
              this.capabilitiesArrSys.push({
                value:item,
                label:'BDA相机'
              })
              this.capabilitiesArrJsonSys[item] = 'BDA相机'
            break;
            case "RCA8":
              this.capabilitiesArrSys.push({
                value:item,
                label:'内置扬声器'
              })
              this.capabilitiesArrJsonSys[item] = '内置扬声器'
            break;
            case "RCA9":
              this.capabilitiesArrSys.push({
                value:item,
                label:'手麦'
              })
              this.capabilitiesArrJsonSys[item] = '手麦'
            break;
            case "RCA10":
              this.capabilitiesArrSys.push({
                value:item,
                label:'外置扬声器'
              })
              this.capabilitiesArrJsonSys[item] = '外置扬声器'
            break;
            case "RCA15":
              this.capabilitiesArrSys.push({
                value:item,
                label:'ADAS和DBA相机'
              })
              this.capabilitiesArrJsonSys[item] = 'ADAS和DBA相机'
            break;
          }
        })
        targetList['IsApiSysAudioInfoCapability']['audioOutputInterfaceModeArray'].forEach(item =>{
          switch(item){
            case "manual":
              this.capabilitiesModeSys.push({
                value:item,
                label:'手动'
              })
              this.capabilitiesModeJsonSys[item] = '手动'
            break;
            case "auto":
              this.capabilitiesModeSys.push({
                value:item,
                label:'自动'
              })
              this.capabilitiesModeJsonSys[item] = '自动'
            break;
          }
        })
      }
    },
    beforeLeave(activeName,oldActiveName){
      this.$refs.PublicVolume.validate((valid) =>{
        if(!valid){
          this.$message.warning('当前表单验证不通过，请先完善！')
          return new Promise((resolve,reject) =>{
            valid == true;
          }).then(() =>{
            resolve()
          }).catch(reject(err))
        }
      })
    },
    changeAlarmLevel(label,type){
      if (label.alarmLevel == type) return;
      this.$refs.PublicDba.validate((valid) =>{
        if(!valid){
          this.$message.warning('当前表单验证不通过，请先完善！')
          label.alarmLevel = type == 1 ? 2 : 1
        }else{
          label.alarmLevel = type;
        }
      })
    },
  },
  created(){
    // this.getByIsApi();
  },
  mounted(){
    // console.log(this.form)
    
  }
}
</script>

<style lang="less" scoped>
  .alarmLevelBox{
    padding-bottom: 8px;
  }
</style>