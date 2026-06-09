<template>
    <div class="p-a-md">                
      <el-form
        ref="Dsm"
        label-position="top"
        :model="form"
        label-width="120px"
        :rules="rules"
      >
        <el-tabs v-model="activeName">
            <el-tab-pane label="报警设置" name="first">
                <div class="configurations">
                    <!-- <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="DSM报警使能">
                            <el-select v-model="form['F365'].alarmEnable" placeholder="请选择">
                                <el-option label="关闭" :value="0"></el-option>
                                <el-option label="开启" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </div> -->
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="报警判断速度阈值（0-60）" prop="F365.speedThreshold">
                            <el-input v-model="form['F365'].speedThreshold"><span slot="suffix">km/h</span></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <div class="block">
                            <span style="font-size: 14px">报警提示音量</span>
                            <el-slider v-model="form['F365'].alarmVolume" :min="0" :max="8" :step="1" show-input></el-slider>
                        </div>
                    </div>
                </div>
                    <!-- <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                    </el-row> -->
            </el-tab-pane>
            <el-tab-pane label="拍照设置" name="second">
                <div class="configurations">
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="主动拍照策略">
                            <el-select v-model="form['F365'].activePhotoStrategy"><span slot="suffix">s</span>
                                <el-option label="不开启" :value="0"></el-option>
                                <el-option label="定时拍照" :value="1"></el-option>
                                <el-option label="定距拍照" :value="2"></el-option>
                                <el-option label="插卡出发" :value="3"></el-option>
                                <el-option label="保留" :value="4"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="主动定时拍照时间间隔" prop="F365.timeIntervalOfActiveTimingPhotography">
                            <el-input v-model="form['F365'].timeIntervalOfActiveTimingPhotography"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="主动定距拍照距离间隔" prop="F365.distanceIntervalOfActiveDistancePhotographing">
                                <el-input v-model="form['F365'].distanceIntervalOfActiveDistancePhotographing"><span slot="suffix">m</span></el-input>
                            </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="单次主动拍照张数" prop="F365.numberOfActivePhotosTakenAtOneTime">
                            <el-input v-model="form['F365'].numberOfActivePhotosTakenAtOneTime"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="单次主动拍照时间间隔" prop="F365.timeIntervalOfSingleActivePhotographing">
                            <el-input v-model="form['F365'].timeIntervalOfSingleActivePhotographing"><span slot="suffix">ms</span></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="事件使能">
                            <el-select v-model="form['F365'].eventEnable">
                                <el-option label="关闭" :value="0"></el-option>
                                <el-option label="开启" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                    <!-- <el-row type="flex" justify="space-between">
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between">
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                    </el-row> -->
            </el-tab-pane>
            <el-tab-pane label="分辨率设置" name="third">
                <div class="configurations">
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="拍照分辨率">
                            <el-select v-model="form['F365'].cameraResolution">
                                <el-option label="352x288" :value="1"></el-option>
                                <el-option label="704x288" :value="2"></el-option>
                                <el-option label="704x576" :value="3"></el-option>
                                <el-option label="640x480" :value="4"></el-option>
                                <el-option label="1280x720" :value="5"></el-option>
                                <el-option label="1920x1080" :value="6"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="视频录制分辨率">
                            <el-select v-model="form['F365'].videoRecordingResolution">
                                <el-option label="CIF" :value="1"></el-option>
                                <el-option label="HD1" :value="2"></el-option>
                                <el-option label="D1" :value="3"></el-option>
                                <el-option label="WD1" :value="4"></el-option>
                                <el-option label="VGA" :value="5"></el-option>
                                <el-option label="720P" :value="6"></el-option>
                                <el-option label="1080P" :value="7"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                    <!-- <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" ></el-col>
                    </el-row> -->
            </el-tab-pane>
            <el-tab-pane label="疲劳驾驶报警" name="fourth">
                <div class="configurations">
                    <div v-if="form['F365']" class="configuration-item">
                      <el-form-item label="疲劳驾驶一级报警" >
                        <!-- <el-input v-model="form['F364'].obstacleWarningDistanceThreshold"><span slot="suffix">ms</span></el-input> -->
                        <el-switch v-model="alarmArr[0]"></el-switch>
                    </el-form-item>
                  </div>
                  <div v-if="form['F365']" class="configuration-item">
                    <el-form-item label="疲劳驾驶二级报警" >
                        <el-switch v-model="alarmArr[1]"></el-switch>
                    </el-form-item>
                  </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="疲劳驾驶报警分级速度阈值" prop="F365.fatiguedDriveAlarmSpeedThreshold">
                            <el-input v-model="form['F365'].fatiguedDriveAlarmSpeedThreshold"><span slot="suffix">km/h</span></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="疲劳驾驶报警前后视频录制时间" prop="F365.fatiguedDriveAlarmVideoRecordTime">
                            <el-input v-model="form['F365'].fatiguedDriveAlarmVideoRecordTime"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="疲劳驾驶报警拍照张数" prop="F365.fatiguedDriveAlarmPhotoNumber">
                            <el-input v-model="form['F365'].fatiguedDriveAlarmPhotoNumber"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="疲劳驾驶报警拍照间隔时间" prop="F365.fatiguedDriveAlarmPhotoIntervalTime">
                            <el-input v-model="form['F365'].fatiguedDriveAlarmPhotoIntervalTime"><span slot="suffix">100ms</span></el-input>
                        </el-form-item>
                    </div>
                </div>
                    <!-- <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" ></el-col>
                        <el-col :span="7" ></el-col>
                    </el-row> -->
            </el-tab-pane>
            <el-tab-pane label="接打电话报警" name="fifth">
                <div class="configurations">
                    <div v-if="form['F365']" class="configuration-item">
                      <el-form-item label="接打电话一级报警" >
                        <!-- <el-input v-model="form['F364'].obstacleWarningDistanceThreshold"><span slot="suffix">ms</span></el-input> -->
                        <el-switch v-model="alarmArr[2]"></el-switch>
                    </el-form-item>
                  </div>
                  <div v-if="form['F365']" class="configuration-item">
                    <el-form-item label="接打电话二级报警" >
                        <el-switch v-model="alarmArr[3]"></el-switch>
                    </el-form-item>
                  </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="接打电话报警分级速度阈值" prop="F365.phoneAlarmSpeedThreshold">
                            <el-input v-model="form['F365'].phoneAlarmSpeedThreshold"><span slot="suffix">km/h</span></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="接打电话报警前后视频录制时间" prop="F365.phoneAlarmVideoRecordTime">
                            <el-input v-model="form['F365'].phoneAlarmVideoRecordTime"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="接打电话报警拍驾驶员面部特征照片张数" prop="F365.phoneAlarmDriverFaceCharacterPhotoNumber">
                            <el-input v-model="form['F365'].phoneAlarmDriverFaceCharacterPhotoNumber"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="接打电话报警判断时间间隔" prop="F365.phoneAlarmJudgeTimeInterval">
                            <el-input v-model="form['F365'].phoneAlarmJudgeTimeInterval"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="接打电话报警拍驾驶员面部特征照片间隔时间" prop="F365.phoneAlarmDriverFaceCharacterPhotoIntervalTime">
                            <el-input v-model="form['F365'].phoneAlarmDriverFaceCharacterPhotoIntervalTime"><span slot="suffix">100ms</span></el-input>
                        </el-form-item>
                    </div>
                </div>
                    <!-- <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" ></el-col>
                    </el-row> -->
            </el-tab-pane>
            <el-tab-pane label="抽烟报警" name="sixth">
                <div class="configurations">
                  <div v-if="form['F365']" class="configuration-item">
                      <el-form-item label="抽烟一级报警" >
                        <!-- <el-input v-model="form['F364'].obstacleWarningDistanceThreshold"><span slot="suffix">ms</span></el-input> -->
                        <el-switch v-model="alarmArr[4]"></el-switch>
                    </el-form-item>
                  </div>
                  <div v-if="form['F365']" class="configuration-item">
                    <el-form-item label="抽烟二级报警" >
                        <el-switch v-model="alarmArr[5]"></el-switch>
                    </el-form-item>
                  </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="抽烟报警分级车速阈值" prop="F365.smokeAlarmSpeedThreshold">
                            <el-input v-model="form['F365'].smokeAlarmSpeedThreshold"><span slot="suffix">km/h</span></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="抽烟报警前后视频录制时间" prop="F365.smokeAlarmVideoRecordTime">
                            <el-input v-model="form['F365'].smokeAlarmVideoRecordTime"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="抽烟报警拍驾驶员面部特征照片张数" prop="F365.smokeAlarmDriverFaceCharacterPhotoNumber">
                            <el-input v-model="form['F365'].smokeAlarmDriverFaceCharacterPhotoNumber"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="抽烟报警拍驾驶员面部特征照片间隔时间" prop="F365.smokeAlarmDriverFaceCharacterPhotoIntervalTime">
                            <el-input v-model="form['F365'].smokeAlarmDriverFaceCharacterPhotoIntervalTime"><span slot="suffix">100ms</span></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="抽烟报警判断时间间隔" prop="F365.smokeAlarmJudgeTimeInterval">
                            <el-input v-model="form['F365'].smokeAlarmJudgeTimeInterval"><span slot="suffix">100ms</span></el-input>
                        </el-form-item>
                    </div>
                </div>
                    <!-- <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                          
                        </el-col>
                        <el-col :span="7" ></el-col>
                    </el-row> -->
            </el-tab-pane>
            <el-tab-pane label="分神驾驶报警" name="seventh">
                <div class="configurations">
                  <div v-if="form['F365']" class="configuration-item">
                      <el-form-item label="分神驾驶一级报警" >
                        <!-- <el-input v-model="form['F364'].obstacleWarningDistanceThreshold"><span slot="suffix">ms</span></el-input> -->
                        <el-switch v-model="alarmArr[6]"></el-switch>
                    </el-form-item>
                  </div>
                  <div v-if="form['F365']" class="configuration-item">
                    <el-form-item label="分神驾驶二级报警" >
                        <el-switch v-model="alarmArr[7]"></el-switch>
                    </el-form-item>
                  </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="分神驾驶报警分级车速阈值" prop="F365.distractDriveAlarmSpeedThreshold">
                            <el-input v-model="form['F365'].distractDriveAlarmSpeedThreshold"><span slot="suffix">km/h</span></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="分神驾驶报警前后视频录制时间" prop="F365.distractDriveAlarmVideoRecordTime">
                            <el-input v-model="form['F365'].distractDriveAlarmVideoRecordTime"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="分神驾驶报警拍照张数" prop="F365.distractDriveAlarmPhotoNumber">
                            <el-input v-model="form['F365'].distractDriveAlarmPhotoNumber"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="分神驾驶报警拍照间隔时间" prop="F365.distractDriveAlarmPhotoIntervalTime">
                            <el-input v-model="form['F365'].distractDriveAlarmPhotoIntervalTime"><span slot="suffix">100ms</span></el-input>
                        </el-form-item>
                    </div>
                </div>
                    <!-- <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" ></el-col>
                        <el-col :span="7" ></el-col>
                    </el-row> -->
            </el-tab-pane>
            <el-tab-pane label="驾驶行为异常报警" name="eighth">
                <div class="configurations">
                  <div v-if="form['F365']" class="configuration-item">
                      <el-form-item label="驾驶行为异常一级报警" >
                        <!-- <el-input v-model="form['F364'].obstacleWarningDistanceThreshold"><span slot="suffix">ms</span></el-input> -->
                        <el-switch v-model="alarmArr[8]"></el-switch>
                    </el-form-item>
                  </div>
                  <div v-if="form['F365']" class="configuration-item">
                    <el-form-item label="驾驶行为异常二级报警" >
                        <el-switch v-model="alarmArr[9]"></el-switch>
                    </el-form-item>
                  </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="驾驶行为异常分级速度阈值" prop="F365.driveBehaviorAbnormalSpeedThreshold">
                            <el-input v-model="form['F365'].driveBehaviorAbnormalSpeedThreshold"><span slot="suffix">km/h</span></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="驾驶行为异常视频录制时间" prop="F365.driveBehaviorAbnormalVideoRecordTime">
                            <el-input v-model="form['F365'].driveBehaviorAbnormalVideoRecordTime"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="驾驶行为异常抓拍照片张数" prop="F365.driveBehaviorAbnormalPhotoNumber">
                            <el-input v-model="form['F365'].driveBehaviorAbnormalPhotoNumber"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="驾驶行为异常拍照间隔" prop="F365.driveBehaviorAbnormalPhotoIntervalTime">
                            <el-input v-model="form['F365'].driveBehaviorAbnormalPhotoIntervalTime"><span slot="suffix">100ms</span></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="form['F365']" class="configuration-item">
                        <el-form-item label="驾驶员身份识别触发">
                            <el-select v-model="form['F365'].driverIdentityRecognizeTrigger">
                                <el-option label="不开启" :value="0"></el-option>
                                <el-option label="定时触发" :value="1"></el-option>
                                <el-option label="定距触发" :value="2"></el-option>
                                <el-option label="插卡开始形式触发" :value="3"></el-option>
                                <el-option label="保留" :value="4"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                    <!-- <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" >
                            
                        </el-col>
                        <el-col :span="7" ></el-col>
                    </el-row> -->
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
    },
    alarmArr:{
      handler(val){
        this.form['F365'].alarmEnable = 0
        console.log(val);
        val.forEach((item,index) =>{
          if(item){
            this.form['F365'].alarmEnable += Math.pow(2,index)
          }
        })
      }
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
    return {
      alarmArr:[false,false,false,false,false,false,false,false,false,false],
      form:{},
      activeName:'first',
      rules: {
        'F365.speedThreshold': [ { validator: checkNumber.bind({ min:0,max:60}), trigger: 'blur' }],//0-60
        'F365.timeIntervalOfActiveTimingPhotography': [ { validator: checkNumber.bind({ min:60,max:32767}), trigger: 'blur' }],// 60-32767
        'F365.distanceIntervalOfActiveDistancePhotographing': [ { validator: checkNumber.bind({ min:0,max:32767}), trigger: 'blur' }],// 0-32767
        'F365.numberOfActivePhotosTakenAtOneTime': [ { validator: checkNumber.bind({ min:1,max:10}), trigger: 'blur' }],// 1-10
        'F365.timeIntervalOfSingleActivePhotographing': [ { validator: checkNumber.bind({ min:1,max:5}), trigger: 'blur' }],// 1-5
        'F365.fatiguedDriveAlarmSpeedThreshold': [ { validator: checkNumber.bind({ min:0,max:127}), trigger: 'blur' }],// 0-127
        'F365.fatiguedDriveAlarmVideoRecordTime': [ { validator: checkNumber.bind({ min:0,max:60}), trigger: 'blur' }],// 0-60
        'F365.fatiguedDriveAlarmPhotoNumber': [ { validator: checkNumber.bind({ min:0,max:60}), trigger: 'blur' }],// 0-60
        'F365.fatiguedDriveAlarmPhotoIntervalTime': [ { validator: checkNumber.bind({ min:1,max:5}), trigger: 'blur' }],// 1-5
        'F365.phoneAlarmSpeedThreshold': [ { validator: checkNumber.bind({ min:0,max:127}), trigger: 'blur' }],// 0-127
        'F365.phoneAlarmVideoRecordTime': [ { validator: checkNumber.bind({ min:0,max:60}), trigger: 'blur' }],// 0-60
        'F365.phoneAlarmDriverFaceCharacterPhotoNumber': [ { validator: checkNumber.bind({ min:1,max:10}), trigger: 'blur' }],// 1-10
        'F365.phoneAlarmJudgeTimeInterval': [ { validator: checkNumber.bind({ min:0,max:3600}), trigger: 'blur' }],// 0-3600
        'F365.phoneAlarmDriverFaceCharacterPhotoIntervalTime': [ { validator: checkNumber.bind({ min:1,max:5}), trigger: 'blur' }],// 1-5
        'F365.smokeAlarmSpeedThreshold': [ { validator: checkNumber.bind({ min:0,max:127}), trigger: 'blur' }],// 0-127
        'F365.smokeAlarmVideoRecordTime': [ { validator: checkNumber.bind({ min:0,max:60}), trigger: 'blur' }],// 0-60
        'F365.smokeAlarmDriverFaceCharacterPhotoNumber': [ { validator: checkNumber.bind({ min:1,max:10}), trigger: 'blur' }],// 1-10
        'F365.smokeAlarmDriverFaceCharacterPhotoIntervalTime': [ { validator: checkNumber.bind({ min:1,max:5}), trigger: 'blur' }],// 1-5
        'F365.distractDriveAlarmSpeedThreshold': [ { validator: checkNumber.bind({ min:0,max:127}), trigger: 'blur' }],// 0-127
        'F365.distractDriveAlarmVideoRecordTime': [ { validator: checkNumber.bind({ min:0,max:60}), trigger: 'blur' }],// 0-60
        'F365.distractDriveAlarmPhotoNumber': [ { validator: checkNumber.bind({ min:1,max:10}), trigger: 'blur' }],// 1-10
        'F365.distractDriveAlarmPhotoIntervalTime': [ { validator: checkNumber.bind({ min:1,max:5}), trigger: 'blur' }],// 1-5
        'F365.driveBehaviorAbnormalSpeedThreshold': [ { validator: checkNumber.bind({ min:0,max:127}), trigger: 'blur' }],// 0-127
        'F365.driveBehaviorAbnormalVideoRecordTime': [ { validator: checkNumber.bind({ min:0,max:60}), trigger: 'blur' }],// 0-60
        'F365.driveBehaviorAbnormalPhotoNumber': [ { validator: checkNumber.bind({ min:1,max:10}), trigger: 'blur' }],// 1-10
        'F365.driveBehaviorAbnormalPhotoIntervalTime': [ { validator: checkNumber.bind({ min:1,max:5}), trigger: 'blur' }],// 1-5
        'F365.smokeAlarmJudgeTimeInterval': [ { validator: checkNumber.bind({ min:0,max:3600}), trigger: 'blur' }],// 1-5
      }
    }
  },
  created(){
    if(this.form['F365'].alarmEnable){
      this.getLog2(Number(this.form['F365'].alarmEnable))
    }
  },
  methods:{
    getLog2(number){
      if(number & (number-1)){
        this.alarmArr[Math.floor(Math.log2(number & (number-1)))] = true
        this.getLog2(number - Math.pow(2,Math.floor(Math.log2(number & (number-1)))))
      }else{
        this.alarmArr[Math.log2(number)] = true
      }
    }
  }
}
</script>

<style scoped>

</style>