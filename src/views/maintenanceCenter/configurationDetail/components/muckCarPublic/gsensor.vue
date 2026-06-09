<template>
   <div class="p-a-md">
    <el-form
      ref="PublicGsensor"
      label-position="top"
      :model="form"
      label-width="120px"
    >
      <el-tabs v-model="activeName" :before-leave="beforeLeave" @tab-click="getByIsApi(activeName)">
        <el-tab-pane :disabled='tabBol' label="路口报警使能" name="first">
          <template v-if="form['IsApiZtGsensor']">
            <el-form-item label="算法使能" class="m-r-md p-r">
              <el-switch v-model="form['IsApiZtGsensor'].enable"></el-switch>
            </el-form-item>
          </template>
        </el-tab-pane>
        <el-tab-pane :disabled='tabBol' :label="item.name" :name="item.name" v-for="item in tablist" :key="item.index">
          <template v-if="form['IsApiZtGsensorTurn_'+item.GsensorTurnType]">
            <el-row type="flex" justify="space-between" class="m-t-sm">
              <el-col :span="7" >
                <el-form-item :label="item.shortName+'报警使能'">
                  <el-switch v-model="form['IsApiZtGsensorTurn_'+item.GsensorTurnType].turnAlarm.enabled"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="7" >
                <el-form-item label="车速限制速度" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtGsensorTurnCapability']['gsensor'].limitSpeedMin,max:form['IsApiZtGsensorTurnCapability']['gsensor'].limitSpeedMax}), trigger: 'blur'}" :prop="'IsApiZtGsensorTurn_'+item.GsensorTurnType+'.turnAlarm.limitSpeed'">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtGsensorTurnCapability']['gsensor'].limitSpeedMin}~${form['IsApiZtGsensorTurnCapability']['gsensor'].limitSpeedMax}`" v-model.number="form['IsApiZtGsensorTurn_'+item.GsensorTurnType].turnAlarm.limitSpeed"><span slot="suffix">km/h</span></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7" >
                <el-form-item label="报警音量" :rules="{validator: checkNumber.bind({type:'int',min:0,max:100}), trigger: 'blur'}" prop="IsApiZtGsensorTriggers.eventRuleTriggerList[0].eventTriggerList[0].audio.volume">
                  <el-slider v-model="form['IsApiZtGsensorTriggers_'+item.GsensorTurnType]['eventRuleTriggerList'][0]['eventTriggerList'][0].audio.volume"
                    :min="0"
                    :max="100"
                    :step="1"
                    show-input>
                  </el-slider>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-between" class="m-t-sm">
              <el-col :span="7" >
                <el-form-item label="车辆目标灵敏度" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtGsensorTurnCapability']['gsensor'].sensitivityMin,max:form['IsApiZtGsensorTurnCapability']['gsensor'].sensitivityMax}), trigger: 'blur'}" :prop="'IsApiZtGsensorTurn_'+item.GsensorTurnType+'.turnAlarm.sensitivity'">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtGsensorTurnCapability']['gsensor'].sensitivityMin}~${form['IsApiZtGsensorTurnCapability']['gsensor'].sensitivityMax}`" v-model.number="form['IsApiZtGsensorTurn_'+item.GsensorTurnType].turnAlarm.sensitivity"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7" >
                <el-form-item label="报警间隔时间" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtGsensorTurnCapability']['gsensor'].intervalTimeMin,max:form['IsApiZtGsensorTurnCapability']['gsensor'].intervalTimeMax}), trigger: 'blur'}" :prop="'IsApiZtGsensorTurn_'+item.GsensorTurnType+'.turnAlarm.intervalTime'">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtGsensorTurnCapability']['gsensor'].intervalTimeMin}~${form['IsApiZtGsensorTurnCapability']['gsensor'].intervalTimeMax}`" v-model.number="form['IsApiZtGsensorTurn_'+item.GsensorTurnType].turnAlarm.intervalTime"><span slot="suffix">s</span></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7" >
                <el-form-item label="图片上报使能">
                  <el-switch v-model="form['IsApiZtGsensorTurn_'+item.GsensorTurnType].turnAlarm.uploadPicEnabled"></el-switch>
                </el-form-item>
              </el-col>
              
            </el-row>
            <el-row type="flex" justify="space-between" class="m-t-sm">
              <el-col :span="7" >
                <el-form-item label="抓图张数" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtGsensorTurnCapability']['gsensor'].pictureNumMin,max:form['IsApiZtGsensorTurnCapability']['gsensor'].pictureNumMax}), trigger: 'blur'}" :prop="'IsApiZtGsensorTurn_'+item.GsensorTurnType+'.turnAlarm.pictureNum'">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtGsensorTurnCapability']['gsensor'].pictureNumMin}~${form['IsApiZtGsensorTurnCapability']['gsensor'].pictureNumMax}`" v-model.number="form['IsApiZtGsensorTurn_'+item.GsensorTurnType].turnAlarm.pictureNum"><span slot="suffix">张</span></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7" >
                <el-form-item label="抓图间隔时间" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtGsensorTurnCapability']['gsensor'].snapIntervalTimeMin,max:form['IsApiZtGsensorTurnCapability']['gsensor'].snapIntervalTimeMax}), trigger: 'blur'}" :prop="'IsApiZtGsensorTurn_'+item.GsensorTurnType+'.turnAlarm.snapIntervalTime'">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtGsensorTurnCapability']['gsensor'].snapIntervalTimeMin}~${form['IsApiZtGsensorTurnCapability']['gsensor'].snapIntervalTimeMax}`" v-model.number="form['IsApiZtGsensorTurn_'+item.GsensorTurnType].turnAlarm.snapIntervalTime"><span slot="suffix">s</span></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7" >
                <el-form-item label="视频上报使能">
                  <el-switch v-model="form['IsApiZtGsensorTurn_'+item.GsensorTurnType].turnAlarm.uploadVideoEnabled"></el-switch>
                </el-form-item>
              </el-col>
              
            </el-row>
            <el-row type="flex" justify="space-between" class="m-t-sm">
              <el-col :span="7" >
                <el-form-item label="小视频预录时间" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtGsensorTurnCapability']['gsensor'].videoPreRecordTimeMin,max:form['IsApiZtGsensorTurnCapability']['gsensor'].videoPreRecordTimeMax}), trigger: 'blur'}" :prop="'IsApiZtGsensorTurn_'+item.GsensorTurnType+'.turnAlarm.videoPreRecordTime'">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtGsensorTurnCapability']['gsensor'].videoPreRecordTimeMin}~${form['IsApiZtGsensorTurnCapability']['gsensor'].videoPreRecordTimeMax}`" v-model.number="form['IsApiZtGsensorTurn_'+item.GsensorTurnType].turnAlarm.videoPreRecordTime"><span slot="suffix">s</span></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7" >
                <el-form-item label="小视频延录时间" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtGsensorTurnCapability']['gsensor'].videoDelayRecordTimeMin,max:form['IsApiZtGsensorTurnCapability']['gsensor'].videoDelayRecordTimeMax}), trigger: 'blur'}" :prop="'IsApiZtGsensorTurn_'+item.GsensorTurnType+'.turnAlarm.videoDelayRecordTime'">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtGsensorTurnCapability']['gsensor'].videoDelayRecordTimeMin}~${form['IsApiZtGsensorTurnCapability']['gsensor'].videoDelayRecordTimeMax}`" v-model.number="form['IsApiZtGsensorTurn_'+item.GsensorTurnType].turnAlarm.videoDelayRecordTime"><span slot="suffix">s</span></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7" >
                <el-form-item label="转向角度" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtGsensorTurnCapability']['gsensor'].angleMin,max:form['IsApiZtGsensorTurnCapability']['gsensor'].angleMax}), trigger: 'blur'}" :prop="'IsApiZtGsensorTurn_'+item.GsensorTurnType+'.turnAlarm.angle'">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtGsensorTurnCapability']['gsensor'].angleMin}~${form['IsApiZtGsensorTurnCapability']['gsensor'].angleMax}`" v-model.number="form['IsApiZtGsensorTurn_'+item.GsensorTurnType].turnAlarm.angle"><span slot="suffix">°</span></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>
<script>
import { validateNum } from '@/utils/validate'
import { valid } from 'semver'

export default {
  name:'gsensor',
  props: {
    isTemplate:{
      type:String
    },
    detail: {
      type: Object,
      default: () => ({}) 
    },
    configParams: {
      type: Boolean,
      default: false
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
    }
  },
   watch: {
    detail: {
      handler(newVal, oldVal) {
        this.form = newVal
      },
      deep: true,
      immediate: true
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
  configParams: {
      handler(val) {
        if (!val) {
          this.getByIsApi(this.activeName);
        }
      },
      deep: true,
      immediate: true
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
    //算法使能
    'form.IsApiZtGsensor':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicGsensor'].validate((valid) =>{
              if(valid){
                this.formData['IsApiZtGsensor.enable'] = val['enable'] != this.copyForm['IsApiZtGsensor']['enable'] ? `IsApiZtGsensor.enable&渣土车配置/路口报警/路口报警使能/算法使能&${val['enable'] ? '开启' : '关闭'}` : '';
              }else{
                this.formData['IsApiZtGsensor.enable'] = ''
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    //左转弯超速音量监听
    'form.IsApiZtGsensorTriggers_3':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicGsensor'].validate((valid) =>{
              if(valid){
                this.formData['IsApiZtGsensorTriggers_3.eventRuleTriggerList.0.eventTriggerList.0.audio.volume.nothing.nothing'] = val['eventRuleTriggerList'][0]['eventTriggerList'][0]['audio']['volume'] != this.copyForm['IsApiZtGsensorTriggers_3']['eventRuleTriggerList'][0]['eventTriggerList'][0]['audio']['volume'] ? `IsApiZtGsensorTriggers_3.eventRuleTriggerList.0.eventTriggerList.0.audio.volume.nothing.nothing&渣土车配置/路口报警/左转弯超速/报警音量&${val['eventRuleTriggerList'][0]['eventTriggerList'][0]['audio']['volume']}` : '';
              }else{
                this.formData['IsApiZtGsensorTriggers_3.eventRuleTriggerList.0.eventTriggerList.0.audio.volume.nothing.nothing'] = ''
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    //右转弯超速音量监听
    'form.IsApiZtGsensorTriggers_4':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicGsensor'].validate((valid) =>{
              if(valid){
                this.formData['IsApiZtGsensorTriggers_4.eventRuleTriggerList.0.eventTriggerList.0.audio.volume.nothing.nothing'] = val['eventRuleTriggerList'][0]['eventTriggerList'][0]['audio']['volume'] != this.copyForm['IsApiZtGsensorTriggers_4']['eventRuleTriggerList'][0]['eventTriggerList'][0]['audio']['volume'] ? `IsApiZtGsensorTriggers_4.eventRuleTriggerList.0.eventTriggerList.0.audio.volume.nothing.nothing&渣土车配置/路口报警/右转弯超速/报警音量&${val['eventRuleTriggerList'][0]['eventTriggerList'][0]['audio']['volume']}` : '';
              }else{
                this.formData['IsApiZtGsensorTriggers_4.eventRuleTriggerList.0.eventTriggerList.0.audio.volume.nothing.nothing'] = ''
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    //左转弯未打转向灯音量监听
    'form.IsApiZtGsensorTriggers_5':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicGsensor'].validate((valid) =>{
              if(valid){
                this.formData['IsApiZtGsensorTriggers_5.eventRuleTriggerList.0.eventTriggerList.0.audio.volume.nothing.nothing'] = val['eventRuleTriggerList'][0]['eventTriggerList'][0]['audio']['volume'] != this.copyForm['IsApiZtGsensorTriggers_5']['eventRuleTriggerList'][0]['eventTriggerList'][0]['audio']['volume'] ? `IsApiZtGsensorTriggers_5.eventRuleTriggerList.0.eventTriggerList.0.audio.volume.nothing.nothing&渣土车配置/路口报警/左转弯未打转向灯/报警音量&${val['eventRuleTriggerList'][0]['eventTriggerList'][0]['audio']['volume']}` : '';
              }else{
                this.formData['IsApiZtGsensorTriggers_5.eventRuleTriggerList.0.eventTriggerList.0.audio.volume.nothing.nothing'] = ''
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    //右转弯未打转向灯音量监听
    'form.IsApiZtGsensorTriggers_6':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicGsensor'].validate((valid) =>{
              if(valid){
                this.formData['IsApiZtGsensorTriggers_6.eventRuleTriggerList.0.eventTriggerList.0.audio.volume.nothing.nothing'] = val['eventRuleTriggerList'][0]['eventTriggerList'][0]['audio']['volume'] != this.copyForm['IsApiZtGsensorTriggers_6']['eventRuleTriggerList'][0]['eventTriggerList'][0]['audio']['volume'] ? `IsApiZtGsensorTriggers_6.eventRuleTriggerList.0.eventTriggerList.0.audio.volume.nothing.nothing&渣土车配置/路口报警/右转弯未打转向灯/报警音量&${val['eventRuleTriggerList'][0]['eventTriggerList'][0]['audio']['volume']}` : '';
              }else{
                this.formData['IsApiZtGsensorTriggers_6.eventRuleTriggerList.0.eventTriggerList.0.audio.volume.nothing.nothing'] = ''
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    //右转弯未打转向灯音量监听
    'form.IsApiZtGsensorTriggers_7':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicGsensor'].validate((valid) =>{
              if(valid){
                this.formData['IsApiZtGsensorTriggers_7.eventRuleTriggerList.0.eventTriggerList.0.audio.volume.nothing.nothing'] = val['eventRuleTriggerList'][0]['eventTriggerList'][0]['audio']['volume'] != this.copyForm['IsApiZtGsensorTriggers_7']['eventRuleTriggerList'][0]['eventTriggerList'][0]['audio']['volume'] ? `IsApiZtGsensorTriggers_7.eventRuleTriggerList.0.eventTriggerList.0.audio.volume.nothing.nothing&渣土车配置/路口报警/右转弯未停车/报警音量&${val['eventRuleTriggerList'][0]['eventTriggerList'][0]['audio']['volume']}` : '';
              }else{
                this.formData['IsApiZtGsensorTriggers_7.eventRuleTriggerList.0.eventTriggerList.0.audio.volume.nothing.nothing'] = ''
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    //左转弯超速
    'form.IsApiZtGsensorTurn_3.turnAlarm':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicGsensor'].validate((valid) =>{
              if(valid){
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.enabled.nothing'] = val['enabled'] != this.copyForm['IsApiZtGsensorTurn_3']['turnAlarm']['enabled'] ? `IsApiZtGsensorTurn_3.turnAlarm.enabled.nothing&渣土车配置/路口报警/左转弯超速/左转弯超速报警使能&${val['enabled'] ? '开启' : '关闭'}` : '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.limitSpeed.nothing'] = val['limitSpeed'] != this.copyForm['IsApiZtGsensorTurn_3']['turnAlarm']['limitSpeed'] ? `IsApiZtGsensorTurn_3.turnAlarm.limitSpeed.nothing&渣土车配置/路口报警/左转弯超速/车速限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.sensitivity.nothing'] = val['sensitivity'] != this.copyForm['IsApiZtGsensorTurn_3']['turnAlarm']['sensitivity'] ? `IsApiZtGsensorTurn_3.turnAlarm.sensitivity.nothing&渣土车配置/路口报警/左转弯超速/车辆目标灵敏度&${val['sensitivity']}` : '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.intervalTime.nothing'] = val['intervalTime'] != this.copyForm['IsApiZtGsensorTurn_3']['turnAlarm']['intervalTime'] ? `IsApiZtGsensorTurn_3.turnAlarm.intervalTime.nothing&渣土车配置/路口报警/左转弯超速/报警间隔时间&${val['intervalTime']}` : '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.uploadPicEnabled.nothing'] = val['uploadPicEnabled'] != this.copyForm['IsApiZtGsensorTurn_3']['turnAlarm']['uploadPicEnabled'] ? `IsApiZtGsensorTurn_3.turnAlarm.uploadPicEnabled.nothing&渣土车配置/路口报警/左转弯超速/图片上报使能&${val['uploadPicEnabled'] ? '开启' : '关闭'}` : '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.pictureNum.nothing'] = val['pictureNum'] != this.copyForm['IsApiZtGsensorTurn_3']['turnAlarm']['pictureNum'] ? `IsApiZtGsensorTurn_3.turnAlarm.pictureNum.nothing&渣土车配置/路口报警/左转弯超速/抓图张数&${val['pictureNum']}` : '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.snapIntervalTime.nothing'] = val['snapIntervalTime'] != this.copyForm['IsApiZtGsensorTurn_3']['turnAlarm']['snapIntervalTime'] ? `IsApiZtGsensorTurn_3.turnAlarm.snapIntervalTime.nothing&渣土车配置/路口报警/左转弯超速/抓图张数&${val['snapIntervalTime']}` : '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.uploadVideoEnabled.nothing'] = val['uploadVideoEnabled'] != this.copyForm['IsApiZtGsensorTurn_3']['turnAlarm']['uploadVideoEnabled'] ? `IsApiZtGsensorTurn_3.turnAlarm.uploadVideoEnabled.nothing&渣土车配置/路口报警/左转弯超速/视频上报使能&${val['uploadVideoEnabled'] ? '开启' : '关闭'}` : '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.videoPreRecordTime.nothing'] = val['videoPreRecordTime'] != this.copyForm['IsApiZtGsensorTurn_3']['turnAlarm']['videoPreRecordTime'] ? `IsApiZtGsensorTurn_3.turnAlarm.videoPreRecordTime.nothing&渣土车配置/路口报警/左转弯超速/小视频预录时间&${val['videoPreRecordTime']}` : '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.videoDelayRecordTime.nothing'] = val['videoDelayRecordTime'] != this.copyForm['IsApiZtGsensorTurn_3']['turnAlarm']['videoDelayRecordTime'] ? `IsApiZtGsensorTurn_3.turnAlarm.videoDelayRecordTime.nothing&渣土车配置/路口报警/左转弯超速/小视频延录时间&${val['videoDelayRecordTime']}` : '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.angle.nothing'] = val['angle'] != this.copyForm['IsApiZtGsensorTurn_3']['turnAlarm']['angle'] ? `IsApiZtGsensorTurn_3.turnAlarm.angle.nothing&渣土车配置/路口报警/左转弯超速/转向角度&${val['angle']}` : '';
              }else{
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.enabled.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.limitSpeed.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.sensitivity.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.intervalTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.uploadPicEnabled.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.pictureNum.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.snapIntervalTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.uploadVideoEnabled.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.videoPreRecordTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.videoDelayRecordTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_3.turnAlarm.angle.nothing'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    //右转弯超速
    'form.IsApiZtGsensorTurn_4.turnAlarm':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicGsensor'].validate((valid) =>{
              if(valid){
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.enabled.nothing'] = val['enabled'] != this.copyForm['IsApiZtGsensorTurn_4']['turnAlarm']['enabled'] ? `IsApiZtGsensorTurn_4.turnAlarm.enabled.nothing&渣土车配置/路口报警/右转弯超速/右转弯超速报警使能&${val['enabled'] ? '开启' : '关闭'}` : '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.limitSpeed.nothing'] = val['limitSpeed'] != this.copyForm['IsApiZtGsensorTurn_4']['turnAlarm']['limitSpeed'] ? `IsApiZtGsensorTurn_4.turnAlarm.limitSpeed.nothing&渣土车配置/路口报警/右转弯超速/车速限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.sensitivity.nothing'] = val['sensitivity'] != this.copyForm['IsApiZtGsensorTurn_4']['turnAlarm']['sensitivity'] ? `IsApiZtGsensorTurn_4.turnAlarm.sensitivity.nothing&渣土车配置/路口报警/右转弯超速/车辆目标灵敏度&${val['sensitivity']}` : '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.intervalTime.nothing'] = val['intervalTime'] != this.copyForm['IsApiZtGsensorTurn_4']['turnAlarm']['intervalTime'] ? `IsApiZtGsensorTurn_4.turnAlarm.intervalTime.nothing&渣土车配置/路口报警/右转弯超速/报警间隔时间&${val['intervalTime']}` : '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.uploadPicEnabled.nothing'] = val['uploadPicEnabled'] != this.copyForm['IsApiZtGsensorTurn_4']['turnAlarm']['uploadPicEnabled'] ? `IsApiZtGsensorTurn_4.turnAlarm.uploadPicEnabled.nothing&渣土车配置/路口报警/右转弯超速/图片上报使能&${val['uploadPicEnabled'] ? '开启' : '关闭'}` : '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.pictureNum.nothing'] = val['pictureNum'] != this.copyForm['IsApiZtGsensorTurn_4']['turnAlarm']['pictureNum'] ? `IsApiZtGsensorTurn_4.turnAlarm.pictureNum.nothing&渣土车配置/路口报警/右转弯超速/抓图张数&${val['pictureNum']}` : '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.snapIntervalTime.nothing'] = val['snapIntervalTime'] != this.copyForm['IsApiZtGsensorTurn_4']['turnAlarm']['snapIntervalTime'] ? `IsApiZtGsensorTurn_4.turnAlarm.snapIntervalTime.nothing&渣土车配置/路口报警/右转弯超速/抓图张数&${val['snapIntervalTime']}` : '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.uploadVideoEnabled.nothing'] = val['uploadVideoEnabled'] != this.copyForm['IsApiZtGsensorTurn_4']['turnAlarm']['uploadVideoEnabled'] ? `IsApiZtGsensorTurn_4.turnAlarm.uploadVideoEnabled.nothing&渣土车配置/路口报警/右转弯超速/视频上报使能&${val['uploadVideoEnabled'] ? '开启' : '关闭'}` : '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.videoPreRecordTime.nothing'] = val['videoPreRecordTime'] != this.copyForm['IsApiZtGsensorTurn_4']['turnAlarm']['videoPreRecordTime'] ? `IsApiZtGsensorTurn_4.turnAlarm.videoPreRecordTime.nothing&渣土车配置/路口报警/右转弯超速/小视频预录时间&${val['videoPreRecordTime']}` : '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.videoDelayRecordTime.nothing'] = val['videoDelayRecordTime'] != this.copyForm['IsApiZtGsensorTurn_4']['turnAlarm']['videoDelayRecordTime'] ? `IsApiZtGsensorTurn_4.turnAlarm.videoDelayRecordTime.nothing&渣土车配置/路口报警/右转弯超速/小视频延录时间&${val['videoDelayRecordTime']}` : '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.angle.nothing'] = val['angle'] != this.copyForm['IsApiZtGsensorTurn_4']['turnAlarm']['angle'] ? `IsApiZtGsensorTurn_4.turnAlarm.angle.nothing&渣土车配置/路口报警/右转弯超速/转向角度&${val['angle']}` : '';
              }else{
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.enabled.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.limitSpeed.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.sensitivity.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.intervalTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.uploadPicEnabled.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.pictureNum.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.snapIntervalTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.uploadVideoEnabled.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.videoPreRecordTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.videoDelayRecordTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_4.turnAlarm.angle.nothing'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    //左转弯未打转向灯
    'form.IsApiZtGsensorTurn_5.turnAlarm':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicGsensor'].validate((valid) =>{
              if(valid){
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.enabled.nothing'] = val['enabled'] != this.copyForm['IsApiZtGsensorTurn_5']['turnAlarm']['enabled'] ? `IsApiZtGsensorTurn_5.turnAlarm.enabled.nothing&渣土车配置/路口报警/左转弯未打转向灯/左转弯未打转向灯报警使能&${val['enabled'] ? '开启' : '关闭'}` : '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.limitSpeed.nothing'] = val['limitSpeed'] != this.copyForm['IsApiZtGsensorTurn_5']['turnAlarm']['limitSpeed'] ? `IsApiZtGsensorTurn_5.turnAlarm.limitSpeed.nothing&渣土车配置/路口报警/左转弯未打转向灯/车速限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.sensitivity.nothing'] = val['sensitivity'] != this.copyForm['IsApiZtGsensorTurn_5']['turnAlarm']['sensitivity'] ? `IsApiZtGsensorTurn_5.turnAlarm.sensitivity.nothing&渣土车配置/路口报警/左转弯未打转向灯/车辆目标灵敏度&${val['sensitivity']}` : '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.intervalTime.nothing'] = val['intervalTime'] != this.copyForm['IsApiZtGsensorTurn_5']['turnAlarm']['intervalTime'] ? `IsApiZtGsensorTurn_5.turnAlarm.intervalTime.nothing&渣土车配置/路口报警/左转弯未打转向灯/报警间隔时间&${val['intervalTime']}` : '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.uploadPicEnabled.nothing'] = val['uploadPicEnabled'] != this.copyForm['IsApiZtGsensorTurn_5']['turnAlarm']['uploadPicEnabled'] ? `IsApiZtGsensorTurn_5.turnAlarm.uploadPicEnabled.nothing&渣土车配置/路口报警/左转弯未打转向灯/图片上报使能&${val['uploadPicEnabled'] ? '开启' : '关闭'}` : '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.pictureNum.nothing'] = val['pictureNum'] != this.copyForm['IsApiZtGsensorTurn_5']['turnAlarm']['pictureNum'] ? `IsApiZtGsensorTurn_5.turnAlarm.pictureNum.nothing&渣土车配置/路口报警/左转弯未打转向灯/抓图张数&${val['pictureNum']}` : '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.snapIntervalTime.nothing'] = val['snapIntervalTime'] != this.copyForm['IsApiZtGsensorTurn_5']['turnAlarm']['snapIntervalTime'] ? `IsApiZtGsensorTurn_5.turnAlarm.snapIntervalTime.nothing&渣土车配置/路口报警/左转弯未打转向灯/抓图张数&${val['snapIntervalTime']}` : '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.uploadVideoEnabled.nothing'] = val['uploadVideoEnabled'] != this.copyForm['IsApiZtGsensorTurn_5']['turnAlarm']['uploadVideoEnabled'] ? `IsApiZtGsensorTurn_5.turnAlarm.uploadVideoEnabled.nothing&渣土车配置/路口报警/左转弯未打转向灯/视频上报使能&${val['uploadVideoEnabled'] ? '开启' : '关闭'}` : '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.videoPreRecordTime.nothing'] = val['videoPreRecordTime'] != this.copyForm['IsApiZtGsensorTurn_5']['turnAlarm']['videoPreRecordTime'] ? `IsApiZtGsensorTurn_5.turnAlarm.videoPreRecordTime.nothing&渣土车配置/路口报警/左转弯未打转向灯/小视频预录时间&${val['videoPreRecordTime']}` : '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.videoDelayRecordTime.nothing'] = val['videoDelayRecordTime'] != this.copyForm['IsApiZtGsensorTurn_5']['turnAlarm']['videoDelayRecordTime'] ? `IsApiZtGsensorTurn_5.turnAlarm.videoDelayRecordTime.nothing&渣土车配置/路口报警/左转弯未打转向灯/小视频延录时间&${val['videoDelayRecordTime']}` : '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.angle.nothing'] = val['angle'] != this.copyForm['IsApiZtGsensorTurn_5']['turnAlarm']['angle'] ? `IsApiZtGsensorTurn_5.turnAlarm.angle.nothing&渣土车配置/路口报警/左转弯未打转向灯/转向角度&${val['angle']}` : '';
              }else{
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.enabled.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.limitSpeed.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.sensitivity.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.intervalTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.uploadPicEnabled.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.pictureNum.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.snapIntervalTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.uploadVideoEnabled.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.videoPreRecordTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.videoDelayRecordTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_5.turnAlarm.angle.nothing'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    //右转弯未打转向灯
    'form.IsApiZtGsensorTurn_6.turnAlarm':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicGsensor'].validate((valid) =>{
              if(valid){
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.enabled.nothing'] = val['enabled'] != this.copyForm['IsApiZtGsensorTurn_6']['turnAlarm']['enabled'] ? `IsApiZtGsensorTurn_6.turnAlarm.enabled.nothing&渣土车配置/路口报警/右转弯未打转向灯/右转弯未打转向灯报警使能&${val['enabled'] ? '开启' : '关闭'}` : '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.limitSpeed.nothing'] = val['limitSpeed'] != this.copyForm['IsApiZtGsensorTurn_6']['turnAlarm']['limitSpeed'] ? `IsApiZtGsensorTurn_6.turnAlarm.limitSpeed.nothing&渣土车配置/路口报警/右转弯未打转向灯/车速限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.sensitivity.nothing'] = val['sensitivity'] != this.copyForm['IsApiZtGsensorTurn_6']['turnAlarm']['sensitivity'] ? `IsApiZtGsensorTurn_6.turnAlarm.sensitivity.nothing&渣土车配置/路口报警/右转弯未打转向灯/车辆目标灵敏度&${val['sensitivity']}` : '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.intervalTime.nothing'] = val['intervalTime'] != this.copyForm['IsApiZtGsensorTurn_6']['turnAlarm']['intervalTime'] ? `IsApiZtGsensorTurn_6.turnAlarm.intervalTime.nothing&渣土车配置/路口报警/右转弯未打转向灯/报警间隔时间&${val['intervalTime']}` : '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.uploadPicEnabled.nothing'] = val['uploadPicEnabled'] != this.copyForm['IsApiZtGsensorTurn_6']['turnAlarm']['uploadPicEnabled'] ? `IsApiZtGsensorTurn_6.turnAlarm.uploadPicEnabled.nothing&渣土车配置/路口报警/右转弯未打转向灯/图片上报使能&${val['uploadPicEnabled'] ? '开启' : '关闭'}` : '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.pictureNum.nothing'] = val['pictureNum'] != this.copyForm['IsApiZtGsensorTurn_6']['turnAlarm']['pictureNum'] ? `IsApiZtGsensorTurn_6.turnAlarm.pictureNum.nothing&渣土车配置/路口报警/右转弯未打转向灯/抓图张数&${val['pictureNum']}` : '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.snapIntervalTime.nothing'] = val['snapIntervalTime'] != this.copyForm['IsApiZtGsensorTurn_6']['turnAlarm']['snapIntervalTime'] ? `IsApiZtGsensorTurn_6.turnAlarm.snapIntervalTime.nothing&渣土车配置/路口报警/右转弯未打转向灯/抓图张数&${val['snapIntervalTime']}` : '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.uploadVideoEnabled.nothing'] = val['uploadVideoEnabled'] != this.copyForm['IsApiZtGsensorTurn_6']['turnAlarm']['uploadVideoEnabled'] ? `IsApiZtGsensorTurn_6.turnAlarm.uploadVideoEnabled.nothing&渣土车配置/路口报警/右转弯未打转向灯/视频上报使能&${val['uploadVideoEnabled'] ? '开启' : '关闭'}` : '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.videoPreRecordTime.nothing'] = val['videoPreRecordTime'] != this.copyForm['IsApiZtGsensorTurn_6']['turnAlarm']['videoPreRecordTime'] ? `IsApiZtGsensorTurn_6.turnAlarm.videoPreRecordTime.nothing&渣土车配置/路口报警/右转弯未打转向灯/小视频预录时间&${val['videoPreRecordTime']}` : '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.videoDelayRecordTime.nothing'] = val['videoDelayRecordTime'] != this.copyForm['IsApiZtGsensorTurn_6']['turnAlarm']['videoDelayRecordTime'] ? `IsApiZtGsensorTurn_6.turnAlarm.videoDelayRecordTime.nothing&渣土车配置/路口报警/右转弯未打转向灯/小视频延录时间&${val['videoDelayRecordTime']}` : '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.angle.nothing'] = val['angle'] != this.copyForm['IsApiZtGsensorTurn_6']['turnAlarm']['angle'] ? `IsApiZtGsensorTurn_6.turnAlarm.angle.nothing&渣土车配置/路口报警/右转弯未打转向灯/转向角度&${val['angle']}` : '';
              }else{
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.enabled.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.limitSpeed.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.sensitivity.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.intervalTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.uploadPicEnabled.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.pictureNum.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.snapIntervalTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.uploadVideoEnabled.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.videoPreRecordTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.videoDelayRecordTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_6.turnAlarm.angle.nothing'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    //右转弯未停车
    'form.IsApiZtGsensorTurn_7.turnAlarm':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicGsensor'].validate((valid) =>{
              if(valid){
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.enabled.nothing'] = val['enabled'] != this.copyForm['IsApiZtGsensorTurn_7']['turnAlarm']['enabled'] ? `IsApiZtGsensorTurn_7.turnAlarm.enabled.nothing&渣土车配置/路口报警/右转弯未停车/右转弯未停车报警使能&${val['enabled'] ? '开启' : '关闭'}` : '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.limitSpeed.nothing'] = val['limitSpeed'] != this.copyForm['IsApiZtGsensorTurn_7']['turnAlarm']['limitSpeed'] ? `IsApiZtGsensorTurn_7.turnAlarm.limitSpeed.nothing&渣土车配置/路口报警/右转弯未停车/车速限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.sensitivity.nothing'] = val['sensitivity'] != this.copyForm['IsApiZtGsensorTurn_7']['turnAlarm']['sensitivity'] ? `IsApiZtGsensorTurn_7.turnAlarm.sensitivity.nothing&渣土车配置/路口报警/右转弯未停车/车辆目标灵敏度&${val['sensitivity']}` : '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.intervalTime.nothing'] = val['intervalTime'] != this.copyForm['IsApiZtGsensorTurn_7']['turnAlarm']['intervalTime'] ? `IsApiZtGsensorTurn_7.turnAlarm.intervalTime.nothing&渣土车配置/路口报警/右转弯未停车/报警间隔时间&${val['intervalTime']}` : '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.uploadPicEnabled.nothing'] = val['uploadPicEnabled'] != this.copyForm['IsApiZtGsensorTurn_7']['turnAlarm']['uploadPicEnabled'] ? `IsApiZtGsensorTurn_7.turnAlarm.uploadPicEnabled.nothing&渣土车配置/路口报警/右转弯未停车/图片上报使能&${val['uploadPicEnabled'] ? '开启' : '关闭'}` : '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.pictureNum.nothing'] = val['pictureNum'] != this.copyForm['IsApiZtGsensorTurn_7']['turnAlarm']['pictureNum'] ? `IsApiZtGsensorTurn_7.turnAlarm.pictureNum.nothing&渣土车配置/路口报警/右转弯未停车/抓图张数&${val['pictureNum']}` : '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.snapIntervalTime.nothing'] = val['snapIntervalTime'] != this.copyForm['IsApiZtGsensorTurn_7']['turnAlarm']['snapIntervalTime'] ? `IsApiZtGsensorTurn_7.turnAlarm.snapIntervalTime.nothing&渣土车配置/路口报警/右转弯未停车/抓图张数&${val['snapIntervalTime']}` : '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.uploadVideoEnabled.nothing'] = val['uploadVideoEnabled'] != this.copyForm['IsApiZtGsensorTurn_7']['turnAlarm']['uploadVideoEnabled'] ? `IsApiZtGsensorTurn_7.turnAlarm.uploadVideoEnabled.nothing&渣土车配置/路口报警/右转弯未停车/视频上报使能&${val['uploadVideoEnabled'] ? '开启' : '关闭'}` : '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.videoPreRecordTime.nothing'] = val['videoPreRecordTime'] != this.copyForm['IsApiZtGsensorTurn_7']['turnAlarm']['videoPreRecordTime'] ? `IsApiZtGsensorTurn_7.turnAlarm.videoPreRecordTime.nothing&渣土车配置/路口报警/右转弯未停车/小视频预录时间&${val['videoPreRecordTime']}` : '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.videoDelayRecordTime.nothing'] = val['videoDelayRecordTime'] != this.copyForm['IsApiZtGsensorTurn_7']['turnAlarm']['videoDelayRecordTime'] ? `IsApiZtGsensorTurn_7.turnAlarm.videoDelayRecordTime.nothing&渣土车配置/路口报警/右转弯未停车/小视频延录时间&${val['videoDelayRecordTime']}` : '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.angle.nothing'] = val['angle'] != this.copyForm['IsApiZtGsensorTurn_7']['turnAlarm']['angle'] ? `IsApiZtGsensorTurn_7.turnAlarm.angle.nothing&渣土车配置/路口报警/右转弯未停车/转向角度&${val['angle']}` : '';
              }else{
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.enabled.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.limitSpeed.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.sensitivity.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.intervalTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.uploadPicEnabled.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.pictureNum.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.snapIntervalTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.uploadVideoEnabled.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.videoPreRecordTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.videoDelayRecordTime.nothing'] = '';
                this.formData['IsApiZtGsensorTurn_7.turnAlarm.angle.nothing'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    }
  },
  data(){
    return{
      activeName:'first',
      tabBol:false,
      currentCommandId: '',
      currentIsApiTriggerInfo:'',
      tablist: [],
      form: {},
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
    }
  },
  created(){
    // this.form = Object.assign({}, this.form, this.forms)
  },
  methods:{
    getByIsApi(activeName){
      if(this.isTemplate == 'true'){
        this.tablist = [
          {
            name:'左转弯超速',
            shortName:'左转弯超速',
            GsensorTurnType:3
          },
          {
            name:'右转弯超速',
            shortName:'右转弯超速',
            GsensorTurnType:4
          },
          {
            name:'左转弯未打转向灯',
            shortName:'左转弯未打转向灯',
            GsensorTurnType:5
          },
          {
            name:'右转弯未打转向灯',
            shortName:'右转弯未打转向灯',
            GsensorTurnType:6
          },
          {
            name:'右转弯未停车',
            shortName:'右转弯未停车',
            GsensorTurnType:7
          }
        ];
        
        return
      }
      let params = {
        deviceId : this.$route.query.deviceId || null,
        commandIds:[]
      }
      this.$emit('getActiveName',this.activeName);
      switch(activeName){
        case 'first':
          if(!this.form['IsApiZtGsensor']){
            params.commandIds.push('IsApiZtGsensor','IsApiZtGsensorTurnCapability')
          }
        break;
        case '左转弯超速':
          if(!this.form['IsApiZtGsensorTurn_3']){
            params.commandIds.push('IsApiZtGsensorTurn','IsApiZtGsensorTriggers','IsApiZtGsensorTurnCapability');
            params['params'] = JSON.stringify({GsensorTurnType:'3'})
          }else{
            this.form['IsApiZtGsensorTurn'] = this.form['IsApiZtGsensorTurn_3'];
            this.form['IsApiZtGsensorTriggers'] = this.form['IsApiZtGsensorTriggers_3']
          }
        break;
        case '右转弯超速':
          if(!this.form['IsApiZtGsensorTurn_4']){
            params.commandIds.push('IsApiZtGsensorTurn','IsApiZtGsensorTriggers','IsApiZtGsensorTurnCapability');
            params['params'] = JSON.stringify({GsensorTurnType:'4'})
          }else{
            this.form['IsApiZtGsensorTurn'] = this.form['IsApiZtGsensorTurn_4'];
            this.form['IsApiZtGsensorTriggers'] = this.form['IsApiZtGsensorTriggers_4']
          }
        break;
        case '左转弯未打转向灯':
          if(!this.form['IsApiZtGsensorTurn_5']){
            params.commandIds.push('IsApiZtGsensorTurn','IsApiZtGsensorTriggers','IsApiZtGsensorTurnCapability');
            params['params'] = JSON.stringify({GsensorTurnType:'5'})
          }else{
            this.form['IsApiZtGsensorTurn'] = this.form['IsApiZtGsensorTurn_5'];
            this.form['IsApiZtGsensorTriggers'] = this.form['IsApiZtGsensorTriggers_5']
          }
        break;
        case '右转弯未打转向灯':
          if(!this.form['IsApiZtGsensorTurn_6']){
            params.commandIds.push('IsApiZtGsensorTurn','IsApiZtGsensorTriggers','IsApiZtGsensorTurnCapability');
            params['params'] = JSON.stringify({GsensorTurnType:'6'})
          }else{
            this.form['IsApiZtGsensorTurn'] = this.form['IsApiZtGsensorTurn_6'];
            this.form['IsApiZtGsensorTriggers'] = this.form['IsApiZtGsensorTriggers_6']
          }
        break;
        case '右转弯未停车':
          if(!this.form['IsApiZtGsensorTurn_7']){
            params.commandIds.push('IsApiZtGsensorTurn','IsApiZtGsensorTriggers','IsApiZtGsensorTurnCapability');
            params['params'] = JSON.stringify({GsensorTurnType:'7'})
          }else{
            this.form['IsApiZtGsensorTurn'] = this.form['IsApiZtGsensorTurn_7'];
            this.form['IsApiZtGsensorTriggers'] = this.form['IsApiZtGsensorTriggers_7']
          }
        break;
      }
      // const params = {
      //   deviceId: this.$route.query.deviceId || null,
      //   commandIds: ['IsApiZtGsensor','IsApiZtGsensorTurnCapability']
      // };
      if(!params.commandIds.length){
        if(!this.tablist.length){
          if(this.form['IsApiZtGsensorTurnCapability']['gsensorTurnType'].length){
            this.form['IsApiZtGsensorTurnCapability']['gsensorTurnType'].forEach(item =>{
              switch(item){
                case 3:
                  this.tablist.push({
                    name:'左转弯超速',
                    shortName:'左转弯超速',
                    GsensorTurnType:item
                  })
                break;
                case 4:
                  this.tablist.push({
                    name:'右转弯超速',
                    shortName:'右转弯超速',
                    GsensorTurnType:item
                  })
                break;
                case 5:
                  this.tablist.push({
                    name:'左转弯未打转向灯',
                    shortName:'左转弯未打转向灯',
                    GsensorTurnType:item
                  })
                break;
                case 6:
                  this.tablist.push({
                    name:'右转弯未打转向灯',
                    shortName:'右转弯未打转向灯',
                    GsensorTurnType:item
                  })
                break;
                case 7:
                  this.tablist.push({
                    name:'右转弯未停车',
                    shortName:'右转弯未停车',
                    GsensorTurnType:item
                  })
                break;
              }
            })
          }
        }
          console.log(this.tablist)
          switch(this.activeName){
            case '左转弯超速' :
              this.form['IsApiZtGsensorTurn_3'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTurn']));
              this.form['IsApiZtGsensorTriggers_3'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTriggers']))
              this.copyForm['IsApiZtGsensorTurn_3'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTurn']));
              this.copyForm['IsApiZtGsensorTriggers_3'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTriggers']))
            break;
            case '右转弯超速' :
              this.form['IsApiZtGsensorTurn_4'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTurn']));
              this.form['IsApiZtGsensorTriggers_4'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTriggers']))
              this.copyForm['IsApiZtGsensorTurn_4'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTurn']));
              this.copyForm['IsApiZtGsensorTriggers_4'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTriggers']))
            break;
            case '左转弯未打转向灯' :
              this.form['IsApiZtGsensorTurn_5'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTurn']));
              this.form['IsApiZtGsensorTriggers_5'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTriggers']))
              this.copyForm['IsApiZtGsensorTurn_5'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTurn']));
              this.copyForm['IsApiZtGsensorTriggers_5'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTriggers']))
            break;
            case '右转弯未打转向灯' :
              this.form['IsApiZtGsensorTurn_6'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTurn']));
              this.form['IsApiZtGsensorTriggers_6'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTriggers']))
              this.copyForm['IsApiZtGsensorTurn_6'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTurn']));
              this.copyForm['IsApiZtGsensorTriggers_6'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTriggers']))
            break;
            case '右转弯未停车' :
              this.form['IsApiZtGsensorTurn_7'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTurn']));
              this.form['IsApiZtGsensorTriggers_7'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTriggers']))
              this.copyForm['IsApiZtGsensorTurn_7'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTurn']));
              this.copyForm['IsApiZtGsensorTriggers_7'] = JSON.parse(JSON.stringify(this.form['IsApiZtGsensorTriggers']))
            break
          }
        return
      } 
      this.tabBol = true
      this.$api.getDeviceConfigParamsByIsApi(params).then(res =>{
        if(res.success && !JSON.parse(res.data)['IsApiZtGsensorTurnCapability']['statusCode']){
          let resData = JSON.parse(res.data);
          this.tablist = [];
          if(resData['IsApiZtGsensorTurnCapability']['gsensorTurnType'].length){
            resData['IsApiZtGsensorTurnCapability']['gsensorTurnType'].forEach(item =>{
              switch(item){
                case 3:
                  this.tablist.push({
                    name:'左转弯超速',
                    shortName:'左转弯超速',
                    GsensorTurnType:item
                  })
                break;
                case 4:
                  this.tablist.push({
                    name:'右转弯超速',
                    shortName:'右转弯超速',
                    GsensorTurnType:item
                  })
                break;
                case 5:
                  this.tablist.push({
                    name:'左转弯未打转向灯',
                    shortName:'左转弯未打转向灯',
                    GsensorTurnType:item
                  })
                break;
                case 6:
                  this.tablist.push({
                    name:'右转弯未打转向灯',
                    shortName:'右转弯未打转向灯',
                    GsensorTurnType:item
                  })
                break;
                case 7:
                  this.tablist.push({
                    name:'右转弯未停车',
                    shortName:'右转弯未停车',
                    GsensorTurnType:item
                  })
                break;
              }
            })
          }
          console.log(this.tablist)
          switch(this.activeName){
            case '左转弯超速' :
              this.form['IsApiZtGsensorTurn_3'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTurn']));
              this.form['IsApiZtGsensorTriggers_3'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTriggers']))
              this.copyForm['IsApiZtGsensorTurn_3'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTurn']));
              this.copyForm['IsApiZtGsensorTriggers_3'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTriggers']))
            break;
            case '右转弯超速' :
              this.form['IsApiZtGsensorTurn_4'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTurn']));
              this.form['IsApiZtGsensorTriggers_4'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTriggers']))
              this.copyForm['IsApiZtGsensorTurn_4'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTurn']));
              this.copyForm['IsApiZtGsensorTriggers_4'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTriggers']))
            break;
            case '左转弯未打转向灯' :
              this.form['IsApiZtGsensorTurn_5'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTurn']));
              this.form['IsApiZtGsensorTriggers_5'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTriggers']))
              this.copyForm['IsApiZtGsensorTurn_5'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTurn']));
              this.copyForm['IsApiZtGsensorTriggers_5'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTriggers']))
            break;
            case '右转弯未打转向灯' :
              this.form['IsApiZtGsensorTurn_6'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTurn']));
              this.form['IsApiZtGsensorTriggers_6'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTriggers']))
              this.copyForm['IsApiZtGsensorTurn_6'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTurn']));
              this.copyForm['IsApiZtGsensorTriggers_6'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTriggers']))
            break;
            case '右转弯未停车' :
              this.form['IsApiZtGsensorTurn_7'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTurn']));
              this.form['IsApiZtGsensorTriggers_7'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTriggers']))
              this.copyForm['IsApiZtGsensorTurn_7'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTurn']));
              this.copyForm['IsApiZtGsensorTriggers_7'] = JSON.parse(JSON.stringify(resData['IsApiZtGsensorTriggers']))
            break
          }
          this.form = Object.assign({}, this.form, resData);
          this.copyForm = Object.assign({},this.copyForm,JSON.parse(JSON.stringify(resData)));
          // this.channelForm['channel_'+params.params] = Object.assign({},this.channelForm['channel_'+this.activeChannel],resData);
          // this.copyChannelForm['channel_'+this.activeChannel] = Object.assign({},this.copyChannelForm['channel_'+this.activeChannel],JSON.parse(JSON.stringify(resData)));
          this.tabBol = false
        }else{
            this.$message.error('获取设备配置参数失败:' + (res.msg
                                        ? res.msg
                                        : this.getErrMsg(
                                            JSON.parse(res.data)['IsApiZtGsensorTurnCapability']['statusCode']
                                          )))
          this.tabBol = false
        }
      })
    },
    getErrMsg(code) {
            let obj = {
                2: "设备忙",
                3: "设备错误",
                4: "无效操作",
                5: "无效的Xml格式",
                6: "无效的Xml内容",
                7: "需要重启",
            };
            return obj[Number(code)];
        },
    beforeLeave(){

    },
    changeAlarmLevel(label,type){
      if (label.alarmLevel == type) return;
      this.$refs.PublicGsensor.validate((valid) =>{
        if(!valid){
          this.$message.warning('当前表单验证不通过，请先完善！')
          label.alarmLevel = type == 1 ? 2 : 1
        }else{
          label.alarmLevel = type;
        }
      })
    },
  }

}
</script>
<style lang="less" scoped>
  .alarmLevelBox{
    margin-bottom: 10px;
  }
</style>