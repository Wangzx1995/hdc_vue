<template>
  <div class="p-a-md">
    <el-form
      ref="AdasPublic"
      label-position="top"
      :model="form"
      label-width="120px"
      :rules="rules"
    >
      <el-tabs v-model="activeName">
          <el-tab-pane label="报警设置" name="first">
                      <el-row type="flex" justify="space-between" style="margin-top: 10px">
                          <el-col :span="7" >
                              <el-form-item label="ADAS报警使能">
                                  <el-select v-model="form['F364'].alarmEnable" placeholder="请选择">
                                    <el-option label="关闭" :value="0"></el-option>
                                    <el-option label="开启" :value="1"></el-option>
                                  </el-select>
                              </el-form-item>
                          </el-col>
                          <el-col :span="7" >
                              <el-form-item label="ADAS报警判断速度阈值（0-60）" prop="F364.speedThreshold">
                                  <el-input v-model="form['F364'].speedThreshold"><span slot="suffix">km/h</span></el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="7" >
                                  <el-form-item label="ADAS报警提示音量" prop="F364.alarmVolume">
                                  <el-slider v-model="form['F364'].alarmVolume" :min="0" :max="8" :step="1" show-input></el-slider>
                                   </el-form-item>
                          </el-col>
                      </el-row>
                  
          </el-tab-pane>
          <el-tab-pane label="拍照设置" name="second">
                  <el-row type="flex" justify="space-between">
                      <el-col :span="7" >
                          <el-form-item label="主动拍照策略">
                              <el-select v-model="form['F364'].activePhotoStrategy"><span slot="suffix">s</span>
                                <el-option label="不开启" :value="0"></el-option>
                                <el-option label="定时拍照" :value="1"></el-option>
                                <el-option label="定距拍照" :value="2"></el-option>
                                <el-option label="保留" :value="3"></el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="主动定时拍照时间间隔" prop="F364.timeIntervalOfActiveTimingPhotography">
                              <el-input v-model="form['F364'].timeIntervalOfActiveTimingPhotography"><span slot="suffix">s</span></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="主动定距拍照距离间隔" prop="F364.distanceIntervalOfActiveDistancePhotographing">
                              <el-input v-model="form['F364'].distanceIntervalOfActiveDistancePhotographing"><span slot="suffix">m</span></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row type="flex" justify="space-between">
                      <el-col :span="7" >
                          <el-form-item label="单次主动拍照张数" prop="F364.numberOfActivePhotosTakenAtOneTime">
                              <el-input v-model="form['F364'].numberOfActivePhotosTakenAtOneTime"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="单次主动拍照时间间隔" prop="F364.timeIntervalOfSingleActivePhotographing">
                              <el-input v-model="form['F364'].timeIntervalOfSingleActivePhotographing"><span slot="suffix">ms</span></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="事件使能">
                              <el-select v-model="form['F364'].eventEnable">
                                <el-option label="关闭" :value="0"></el-option>
                                <el-option label="打开" :value="1"></el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                  </el-row>
          </el-tab-pane>
          <el-tab-pane label="分辨率设置" name="third">
                <el-row type="flex" justify="space-between" style="margin-top: 10px">
                      <el-col :span="7" >
                          <el-form-item label="拍照分辨率">
                              <el-select v-model="form['F364'].cameraResolution">
                                <el-option label="352x288" :value="1"></el-option>
                                <el-option label="704x288" :value="2"></el-option>
                                <el-option label="704x576" :value="3"></el-option>
                                <el-option label="640x480" :value="4"></el-option>
                                <el-option label="1280x720" :value="5"></el-option>
                                <el-option label="1920x1080" :value="6"></el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="视频录制分辨率">
                              <el-select v-model="form['F364'].videoRecordingResolution">
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
                      <el-col :span="7" ></el-col>
                  </el-row>
          </el-tab-pane>
          <el-tab-pane label="障碍物报警" name="fourth">
                      <el-row type="flex" justify="space-between">
                          <el-col :span="7" >
                              <el-form-item label="障碍物报警距离阈值" prop="F364.obstacleWarningDistanceThreshold">
                                  <el-input v-model="form['F364'].obstacleWarningDistanceThreshold"><span slot="suffix">ms</span></el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="7" >
                              <el-form-item label="障碍物报警分级速度阈值" prop="F364.classificationSpeedThresholdOfObstacleAlarm">
                                  <el-input v-model="form['F364'].classificationSpeedThresholdOfObstacleAlarm"><span slot="suffix">km/h</span></el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="7" >
                              <el-form-item label="障碍物报警前后视频录制时间" prop="F364.videoRecordingTimeBeforeAndAfterObstacleAlarm">
                                  <el-input v-model="form['F364'].videoRecordingTimeBeforeAndAfterObstacleAlarm"><span slot="suffix">s</span></el-input>
                              </el-form-item>
                          </el-col>
                      </el-row>
                      <el-row type="flex" justify="space-between">
                          <el-col :span="7" >
                              <el-form-item label="障碍物报警拍照张数" prop="F364.numberOfPhotosOfObstacleAlarm">
                                  <el-input v-model="form['F364'].numberOfPhotosOfObstacleAlarm"></el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="7" >
                              <el-form-item label="障碍物报警拍照间隔" prop="F364.photoIntervalOfObstacleAlarm">
                                  <el-input v-model="form['F364'].photoIntervalOfObstacleAlarm"><span slot="suffix">100ms</span></el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="7"></el-col>
                      </el-row>
          </el-tab-pane>
          <el-tab-pane label="频繁变道报警" name="fifth">
                  <el-row type="flex" justify="space-between">
                      <el-col :span="7" >
                          <el-form-item label="频繁变道报警判断时间段" prop="F364.judgmentTimePeriodOfFrequentLaneChangeAlarm">
                              <el-input v-model="form['F364'].judgmentTimePeriodOfFrequentLaneChangeAlarm"><span slot="suffix">s</span></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="频繁变道报警判断次数" prop="F364.alarmJudgmentTimesOfFrequentLaneChange">
                              <el-input v-model="form['F364'].alarmJudgmentTimesOfFrequentLaneChange"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="频繁变道报警分级速度阈值" prop="F364.classificationSpeedThresholdOfFrequentLaneChangeAlarm">
                              <el-input v-model="form['F364'].classificationSpeedThresholdOfFrequentLaneChangeAlarm"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row type="flex" justify="space-between">
                      <el-col :span="7" >
                          <el-form-item label="频繁变道报警前后视频录制时间" prop="F364.videoRecordingTimeBeforeAndAfterFrequentLaneChangeAlarm">
                              <el-input v-model="form['F364'].videoRecordingTimeBeforeAndAfterFrequentLaneChangeAlarm"><span slot="suffix">s</span></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="频繁变道报警拍照张数" prop="F364.numberOfFrequentLaneChangeAlarmPhotos">
                              <el-input v-model="form['F364'].numberOfFrequentLaneChangeAlarmPhotos"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7">
                          <el-form-item label="频繁变道报警拍照间隔" prop="F364.frequentLaneChangeAlarmInterval">
                              <el-input v-model="form['F364'].frequentLaneChangeAlarmInterval"><span slot="suffix">100ms</span></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
          </el-tab-pane>
          <el-tab-pane label="车道偏离报警" name="sixth">
                  <el-row type="flex" justify="space-between">
                      <el-col :span="7" >
                          <el-form-item label="车道偏离报警分级速度阈值" prop="F364.laneDepartureWarningClassificationSpeedThreshold">
                              <el-input v-model="form['F364'].laneDepartureWarningClassificationSpeedThreshold"><span slot="suffix">km/h</span></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="车道偏离报警前后视频录制时间" prop="F364.videoRecordingTimeBeforeAndAfterLaneDepartureAlarm">
                              <el-input v-model="form['F364'].videoRecordingTimeBeforeAndAfterLaneDepartureAlarm"><span slot="suffix">s</span></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="车道偏离报警拍照张数" prop="F364.numberOfPhotosOfLaneDepartureAlarm">
                              <el-input v-model="form['F364'].numberOfPhotosOfLaneDepartureAlarm"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row type="flex" justify="space-between">
                      <el-col :span="7" >
                          <el-form-item label="车道偏离报警拍照间隔" prop="F364.laneDepartureWarningCameraInterval">
                              <el-input v-model="form['F364'].laneDepartureWarningCameraInterval"><span slot="suffix">100ms</span></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" ></el-col>
                      <el-col :span="7"></el-col>
                  </el-row>
          </el-tab-pane>
          <el-tab-pane label="前向碰撞报警" name="seventh">
                  <el-row type="flex" justify="space-between">
                      <el-col :span="7" >
                          <el-form-item label="前向碰撞报警时间阈值" prop="F364.forwardCollisionAlarmTimeThreshold">
                              <el-input v-model="form['F364'].forwardCollisionAlarmTimeThreshold"><span slot="suffix">100ms</span></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="前向碰撞报警分级速度阈值" prop="F364.forwardCollisionWarningClassificationSpeedThreshold">
                              <el-input v-model="form['F364'].forwardCollisionWarningClassificationSpeedThreshold"><span slot="suffix">km/h</span></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="前向碰撞报警前后视频录制时间" prop="F364.videoRecordingTimeBeforeAndAfterForwardCollisionAlarm">
                              <el-input v-model="form['F364'].videoRecordingTimeBeforeAndAfterForwardCollisionAlarm"><span slot="suffix">s</span></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row type="flex" justify="space-between">
                      <el-col :span="7" >
                          <el-form-item label="前向碰撞报警拍照张数" prop="F364.numberOfForwardCollisionAlarmPhotos">
                              <el-input v-model="form['F364'].numberOfForwardCollisionAlarmPhotos"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="前向碰撞报警拍照间隔" prop="F364.forwardCollisionAlarmPhotographingInterval">
                              <el-input v-model="form['F364'].forwardCollisionAlarmPhotographingInterval"><span slot="suffix">100ms</span></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7"></el-col>
                  </el-row>
          </el-tab-pane>
          <el-tab-pane label="行人碰撞报警" name="eighth">
                  <el-row type="flex" justify="space-between">
                      <el-col :span="7" >
                          <el-form-item label="行人碰撞报警时间阈值" prop="F364.pedestrianCollisionWarningTimeThreshold">
                              <el-input v-model="form['F364'].pedestrianCollisionWarningTimeThreshold"><span slot="suffix">100ms</span></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="行人碰撞报警使能速度阈值" prop="F364.pedestrianCollisionAlarmEnableSpeedThreshold">
                              <el-input v-model="form['F364'].pedestrianCollisionAlarmEnableSpeedThreshold"><span slot="suffix">km/h</span></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="行人碰撞报警前后视频录制时间" prop="F364.videoRecordingTimeBeforeAndAfterPedestrianCollisionAlarm">
                              <el-input v-model="form['F364'].videoRecordingTimeBeforeAndAfterPedestrianCollisionAlarm"><span slot="suffix">s</span></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row type="flex" justify="space-between">
                      <el-col :span="7" >
                          <el-form-item label="行人碰撞报警拍照张数" prop="F364.numberOfPhotosOfPedestrianCollisionAlarm">
                              <el-input v-model="form['F364'].numberOfPhotosOfPedestrianCollisionAlarm"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="行人碰撞报警拍照间隔" prop="F364.pedestrianCollisionAlarmPhotoInterval">
                              <el-input v-model="form['F364'].pedestrianCollisionAlarmPhotoInterval"><span slot="suffix">100ms</span></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7"></el-col>
                  </el-row>
          </el-tab-pane>
          <el-tab-pane label="车距报警" name="nineth">
                  <el-row type="flex" justify="space-between">
                      <el-col :span="7" >
                          <el-form-item label="车距监控报警距离阈值" prop="F364.distanceThresholdOfVehicleDistanceMonitoringAlarm">
                              <el-input v-model="form['F364'].distanceThresholdOfVehicleDistanceMonitoringAlarm"><span slot="suffix">100ms</span></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="车距监控报警分级速度阈值" prop="F364.classificationSpeedThresholdOfDistanceMonitoringAlarm">
                              <el-input v-model="form['F364'].classificationSpeedThresholdOfDistanceMonitoringAlarm"><span slot="suffix">km/h</span></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="车距过近报警前后视频录制时间" prop="F364.videoRecordingTimeBeforeAndAfterTheAlarmWhenTheDistanceBetweenVehiclesIsTooClose">
                              <el-input v-model="form['F364'].videoRecordingTimeBeforeAndAfterTheAlarmWhenTheDistanceBetweenVehiclesIsTooClose"><span slot="suffix">s</span></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row type="flex" justify="space-between">
                      <el-col :span="7" >
                          <el-form-item label="车距过近报警拍照张数" prop="F364.numberOfPhotosTakenWhenTheCarIsTooCloseToTheAlarm">
                              <el-input v-model="form['F364'].numberOfPhotosTakenWhenTheCarIsTooCloseToTheAlarm"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="车距过近报警拍照间隔" prop="F364.theDistanceBetweenTheCarAndTheCameraIsTooClose">
                              <el-input v-model="form['F364'].theDistanceBetweenTheCarAndTheCameraIsTooClose"><span slot="suffix">100ms</span></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7"></el-col>
                  </el-row>
          </el-tab-pane>
          <el-tab-pane label="道路标识识别" name="tenth">
              <el-row type="flex" justify="space-between">
                      <el-col :span="7" >
                          <el-form-item label="道路标志识别拍照张数" prop="F364.numberOfRoadSignRecognitionPhotos">
                              <el-input v-model="form['F364'].numberOfRoadSignRecognitionPhotos"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" >
                          <el-form-item label="道路标志识别拍照间隔" prop="F364.photoIntervalOfRoadSignRecognition">
                              <el-input v-model="form['F364'].photoIntervalOfRoadSignRecognition"><span slot="suffix">100ms</span></el-input>
                          </el-form-item>
                      </el-col>
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
    return {
      form:{},
      activeName:'first',
      rules: {
        // 'F364.alarmVolume':[{ required: true, type:'number', message: '请选择', trigger: 'change' }],
        'F364.speedThreshold': [ { validator: checkNumber.bind({ min:0,max:60}), trigger: 'blur' }],//0-60
        'F364.timeIntervalOfActiveTimingPhotography': [ { validator: checkNumber.bind({ min:0,max:3600}), trigger: 'blur' }],// 0-3600
        'F364.distanceIntervalOfActiveDistancePhotographing': [ { validator: checkNumber.bind({ min:0,max:32767}), trigger: 'blur' }],// 0-32767
        'F364.numberOfActivePhotosTakenAtOneTime': [ { validator: checkNumber.bind({ min:1,max:10}), trigger: 'blur' }],// 1-10
        'F364.timeIntervalOfSingleActivePhotographing': [ { validator: checkNumber.bind({ min:1,max:5}), trigger: 'blur' }],// 1-5
        'F364.obstacleWarningDistanceThreshold': [ { validator: checkNumber.bind({ min:10,max:50}), trigger: 'blur' }],// 10-50
        'F364.classificationSpeedThresholdOfObstacleAlarm': [ { validator: checkNumber.bind({ min:0,max:127}), trigger: 'blur' }],// 0-127
        'F364.videoRecordingTimeBeforeAndAfterObstacleAlarm': [ { validator: checkNumber.bind({ min:0,max:60}), trigger: 'blur' }],// 0-60
        'F364.numberOfPhotosOfObstacleAlarm': [ { validator: checkNumber.bind({ min:0,max:10}), trigger: 'blur' }],// 0-10
        'F364.photoIntervalOfObstacleAlarm': [ { validator: checkNumber.bind({ min:1,max:10}), trigger: 'blur' }],// 1-10
        'F364.judgmentTimePeriodOfFrequentLaneChangeAlarm': [ { validator: checkNumber.bind({ min:30,max:120}), trigger: 'blur' }],// 30-120
        'F364.alarmJudgmentTimesOfFrequentLaneChange': [ { validator: checkNumber.bind({ min:3,max:10}), trigger: 'blur' }],// 3-10
        'F364.classificationSpeedThresholdOfFrequentLaneChangeAlarm': [ { validator: checkNumber.bind({ min:0,max:127}), trigger: 'blur' }],// 0-127
        'F364.videoRecordingTimeBeforeAndAfterFrequentLaneChangeAlarm': [ { validator: checkNumber.bind({ min:0,max:60}), trigger: 'blur' }],// 0-60
        'F364.numberOfFrequentLaneChangeAlarmPhotos': [ { validator: checkNumber.bind({ min:0,max:10}), trigger: 'blur' }],// 0-10
        'F364.frequentLaneChangeAlarmInterval': [ { validator: checkNumber.bind({ min:1,max:10}), trigger: 'blur' }],// 1-10
        'F364.laneDepartureWarningClassificationSpeedThreshold': [ { validator: checkNumber.bind({ min:0,max:127}), trigger: 'blur' }],// 0-127
        'F364.videoRecordingTimeBeforeAndAfterLaneDepartureAlarm': [ { validator: checkNumber.bind({ min:0,max:60}), trigger: 'blur' }],// 0-60
        'F364.numberOfPhotosOfLaneDepartureAlarm': [ { validator: checkNumber.bind({ min:0,max:10}), trigger: 'blur' }],// 0-10
        'F364.laneDepartureWarningCameraInterval': [ { validator: checkNumber.bind({ min:1,max:10}), trigger: 'blur' }],// 1-10
        'F364.forwardCollisionAlarmTimeThreshold': [ { validator: checkNumber.bind({ min:10,max:50}), trigger: 'blur' }],// 10-50
        'F364.forwardCollisionWarningClassificationSpeedThreshold': [ { validator: checkNumber.bind({ min:0,max:127}), trigger: 'blur' }],// 0-127
        'F364.videoRecordingTimeBeforeAndAfterForwardCollisionAlarm': [ { validator: checkNumber.bind({ min:0,max:60}), trigger: 'blur' }],// 0-60
        'F364.numberOfForwardCollisionAlarmPhotos': [ { validator: checkNumber.bind({ min:0,max:10}), trigger: 'blur' }],// 0-10
        'F364.forwardCollisionAlarmPhotographingInterval': [ { validator: checkNumber.bind({ min:1,max:10}), trigger: 'blur' }],// 1-10
        'F364.pedestrianCollisionWarningTimeThreshold': [ { validator: checkNumber.bind({ min:10,max:50}), trigger: 'blur' }],// 10-50
        'F364.pedestrianCollisionAlarmEnableSpeedThreshold': [ { validator: checkNumber.bind({ min:0,max:127}), trigger: 'blur' }],// 0-127
        'F364.videoRecordingTimeBeforeAndAfterPedestrianCollisionAlarm': [ { validator: checkNumber.bind({ min:0,max:60}), trigger: 'blur' }],// 0-60
        'F364.numberOfPhotosOfPedestrianCollisionAlarm': [ { validator: checkNumber.bind({ min:0,max:10}), trigger: 'blur' }],// 0-10
        'F364.pedestrianCollisionAlarmPhotoInterval': [ { validator: checkNumber.bind({ min:1,max:10}), trigger: 'blur' }],// 1-10
        'F364.distanceThresholdOfVehicleDistanceMonitoringAlarm': [ { validator: checkNumber.bind({ min:10,max:50}), trigger: 'blur' }],// 10-50
        'F364.classificationSpeedThresholdOfDistanceMonitoringAlarm': [ { validator: checkNumber.bind({ min:0,max:127}), trigger: 'blur' }],// 0-127
        'F364.videoRecordingTimeBeforeAndAfterTheAlarmWhenTheDistanceBetweenVehiclesIsTooClose': [ { validator: checkNumber.bind({ min:0,max:60}), trigger: 'blur' }],// 0-60
        'F364.numberOfPhotosTakenWhenTheCarIsTooCloseToTheAlarm': [ { validator: checkNumber.bind({ min:0,max:10}), trigger: 'blur' }],// 1-10
        'F364.theDistanceBetweenTheCarAndTheCameraIsTooClose': [ { validator: checkNumber.bind({ min:1,max:10}), trigger: 'blur' }], // 1-10
        'F364.numberOfRoadSignRecognitionPhotos': [ { validator: checkNumber.bind({ min:0,max:10}), trigger: 'blur' }],// 0-10
        'F364.photoIntervalOfRoadSignRecognition': [ { validator: checkNumber.bind({ min:1,max:10}), trigger: 'blur' }],// 1-10
      }
    }
  },
}
</script>

<style scoped>

</style>