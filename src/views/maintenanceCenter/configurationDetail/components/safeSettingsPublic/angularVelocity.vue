<template>
    <div class="p-a-md">
      <el-form
        ref="AngularVelocityPublic"
        label-position="top"
        :model="form"
        label-width="120px"
        :rules="rules"
      >
        <el-tabs v-model="activeName">
            <el-tab-pane label="角速度加速度报警" name="first">
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                      <el-col :span="7" >
                            <el-form-item label="是否启用">
                                <el-select v-model="form['F368'].isUsed">
                                  <el-option label="关闭" :value="0"></el-option>
                                  <el-option label="启用" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="监测灵敏度" prop="F368.monitorSensitivity">
                                <el-input v-model="form['F368'].monitorSensitivity"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="报警提示方式">
                                <el-select v-model="form['F368'].alarmRemindMode">
                                  <el-option label="固定提示音" :value="0"></el-option>
                                  <el-option label="文字转语言" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <div class="block">
                                <span style="font-size: 14px">报警提示音量</span>
                                <el-slider style="padding-left: 12px;" v-model="form['F368'].alarmRemindVolume" :min="0" :max="100" :step="1" show-input></el-slider>
                            </div>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="报警提示内容长度" prop="F368.alarmRemindContentLength">
                                <el-input v-model="form['F368'].alarmRemindContentLength"><span slot="suffix">n</span></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="报警提示内容" prop="F368.alarmRemindContent">
                                <el-input v-model="form['F368'].alarmRemindContent"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <el-form-item label="车辆正前方向对应的Gsensor轴方向长度" prop="F368.sensorDirectionLength">
                                <el-input v-model="form['F368'].sensorDirectionLength"><span slot="suffix">m</span></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="车辆正前方向对应的Gsensor轴方向" prop="F368.sensorDirection">
                                <el-input v-model="form['F368'].sensorDirection"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="角速度报警阈值" prop="F368.angularVelocityAlarmThreshold">
                                <el-input v-model="form['F368'].angularVelocityAlarmThreshold"><span slot="suffix">dm/s^2</span></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <el-form-item label="加速度报警阈值" prop="F368.acceleratedVelocityAlarmThreshold">
                                <el-input v-model="form['F368'].acceleratedVelocityAlarmThreshold"><span slot="suffix">10*rad/s</span></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="报警触发持续时间阈值" prop="F368.alarmTriggerDurationTimeThreshold">
                                <el-input v-model="form['F368'].alarmTriggerDurationTimeThreshold"><span slot="suffix">s</span></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7"></el-col>
                    </el-row>
            </el-tab-pane>
            <el-tab-pane label="拍照设置" name="second">
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <el-form-item label="是否联动拍照">
                                <el-select v-model="form['F368'].isLinkagePhoto" placeholder="请选择">
                                  <el-option label="不联动录像" :value="0"></el-option>
                                  <el-option label="联动本通道录像" :value="1"></el-option>
                                  <el-option label="联动所有通道录像" :value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="联动拍照的逻辑通道">
                                <el-select v-model="form['F368'].linkagePhotoLogicChannels" placeholder="请选择">
                                  <el-option label="不联动" :value="0"></el-option>
                                  <el-option label="联动" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="报警拍照张数" prop="F368.alarmPhotoNumber">
                                <el-input v-model="form['F368'].alarmPhotoNumber"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <el-form-item label="报警拍照间隔" prop="F368.alarmPhotoInterval">
                                <el-input v-model="form['F368'].alarmPhotoInterval"><span slot="suffix">100ms</span></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="拍照分辨率">
                                <el-select v-model="form['F368'].cameraResolution" placeholder="请选择">
                                  <el-option label="CIF" :value="1"></el-option>
                                  <el-option label="HD1" :value="2"></el-option>
                                  <el-option label="D1" :value="3"></el-option>
                                  <el-option label="WD1" :value="4"></el-option>
                                  <el-option label="VGA" :value="5"></el-option>
                                  <el-option label="720P" :value="6"></el-option>
                                  <el-option label="1080P" :value="7"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7"></el-col>
                    </el-row>
            </el-tab-pane>
            <el-tab-pane label="录像设置" name="third">
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <el-form-item label="是否联动录像">
                                <el-select v-model="form['F368'].isLinkageVideo" placeholder="请选择">
                                  <el-option label="不联动录像" :value="0"></el-option>
                                  <el-option label="联动本通道录像" :value="1"></el-option>
                                  <el-option label="联动所有通道录像" :value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="联动录像的逻辑通道">
                                <el-select v-model="form['F368'].linkageVideoLogicChannels" placeholder="请选择">
                                   <el-option label="不联动" :value="0"></el-option>
                                   <el-option label="联动" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="报警前后视频录制时间" prop="F368.alarmVideoRecordTime">
                                <el-input v-model="form['F368'].alarmVideoRecordTime"><span slot="suffix">s</span></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <el-form-item label="视频录制分辨率">
                                <el-select v-model="form['F368'].videoRecordingResolution" placeholder="请选择">
                                  <el-option label="CIF" :value="1"></el-option>
                                  <el-option label="HD1" :value="2"></el-option>
                                  <el-option label="D1" :value="3"></el-option>
                                  <el-option label="WD1" :value="4"></el-option>
                                  <el-option label="VGA" :value="5"></el-option>
                                  <el-option label="720P" :value="6"></el-option>
                                  <el-option label="1080P" :value="7"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7"></el-col>
                        <el-col :span="7" ></el-col>
                    </el-row>
            </el-tab-pane>
        </el-tabs>
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
    }
  },
  watch:{
    detail: {
      handler (newVal,oldVal) {
        this.form = newVal
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
      immediate:true,
    }
  },
  data() {
    const checkNumber = function (rule, value, callback) {
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
    };
    // const checkAlarmRemindContent = function (rule, value, callback) {
    //   if (value!=='' && value!==null && value!==undefined && this.form['F368'].alarmRemindContentLength!=='') {
    //        if(value.length!= +this.form['F368'].alarmRemindContentLength){
    //         callback(new Error(`报警提示内容长度应为${this.form['F368'].alarmRemindContentLength}`));
    //       } else {
    //         callback();
    //       }
    //   } else {
    //       callback();
    //   }
    // };
    // const checkSensorDirection = function (rule, value, callback) {
    //   if (value!=='' && value!==null && value!==undefined && this.form['F368'].sensorDirectionLength!=='') {
    //        if(value.length!= +this.form['F368'].sensorDirectionLength){
    //         callback(new Error(`车辆正前方向对应的Gsensor轴方向长度应为${this.form['F368'].sensorDirectionLength}`));
    //       } else {
    //         callback();
    //       }
    //   } else {
    //       callback();
    //   }
    // };
    return {
      form:{},
      activeName:'first',
      rules: {
        'F368.monitorSensitivity': [ { validator: checkNumber.bind({ min:1,max:100}), trigger: 'blur' }], //1-100
        'F368.alarmRemindContentLength': [ { validator: checkNumber.bind({ min:0,max:127}), trigger: 'blur' }], // 0-100
        'F368.sensorDirectionLength': [ { validator: checkNumber.bind({ min:0,max:127}), trigger: 'blur' }], // 0-127
        'F368.angularVelocityAlarmThreshold': [ { validator: checkNumber.bind({ min:0,max:500}), trigger: 'blur' }], // 0-10
        'F368.acceleratedVelocityAlarmThreshold': [ { validator: checkNumber.bind({ min:0,max:10}), trigger: 'blur' }], // 0-10
        'F368.alarmTriggerDurationTimeThreshold': [ { validator: checkNumber.bind({ min:0,max:60}), trigger: 'blur' }], // 0-60
        'F368.alarmPhotoNumber': [ { validator: checkNumber.bind({ min:0,max:10}), trigger: 'blur' }], // 0-10
        'F368.alarmPhotoInterval': [ { validator: checkNumber.bind({ min:0,max:10}), trigger: 'blur' }], // 0-10
        'F368.alarmVideoRecordTime': [ { validator: checkNumber.bind({ min:0,max:60}), trigger: 'blur' }], // 0-60
        // 'F368.alarmRemindContent':[{ validator: checkAlarmRemindContent, trigger: 'blur' }],
        // 'F368.sensorDirection':[{ validator: checkSensorDirection, trigger: 'blur' }]
      }
    }
  },
}
</script>

<style scoped>

</style>