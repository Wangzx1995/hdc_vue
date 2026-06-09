<template>
    <div class="p-a-md">
        <h2>休眠唤醒设置</h2>
        <el-form
            ref="PublicWakeupMode"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <el-row type="flex" justify="space-between">
                <el-col :span="24" >
                    <el-form-item label="休眠唤醒模式" >
                         <el-checkbox-group v-model="form['007C'].wakeModelOptions">
                          <el-checkbox label="condition">条件唤醒</el-checkbox>
                          <el-checkbox label="schedule">定时唤醒</el-checkbox>
                          <el-checkbox label="operation">手动唤醒</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="24" >
                    <el-form-item label="休眠条件类型" >
                      <el-checkbox-group v-model="form['007C'].wakeConditionTypeOptions">
                          <el-checkbox label="urgency">紧急报警</el-checkbox>
                          <el-checkbox label="crash">车辆开门</el-checkbox>
                          <el-checkbox label="openDoor">碰撞侧翻报警</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="24" >
                    <el-form-item label="定时唤醒日设置" >
                      <el-checkbox-group v-model="form['007C'].wakeDayOptions">
                          <el-checkbox label="monday">周一</el-checkbox>
                          <el-checkbox label="tuesday">周二</el-checkbox>
                          <el-checkbox label="wednesday">周三</el-checkbox>
                          <el-checkbox label="thursday">周四</el-checkbox>
                          <el-checkbox label="friday">周五</el-checkbox>
                          <el-checkbox label="saturday">周六</el-checkbox>
                          <el-checkbox label="sunday">周日</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </el-row>
          <h2>日唤醒时间段设置</h2>
          <el-row type="flex" justify="space-between" style="margin-top: 10px">
                <el-col :span="7" >
                    <el-form-item label="日唤醒时间段1" >
                        <el-time-picker
                          is-range
                          v-model="time1"
                          value-format="HH:mm"
                          format="HH:mm"
                          :start-placeholder="$t('common.startTime')"
                          :end-placeholder="$t('common.endTime')"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="日唤醒时间段2" >
                        <el-time-picker
                          is-range
                          v-model="time2"
                          value-format="HH:mm"
                          format="HH:mm"
                          :start-placeholder="$t('common.startTime')"
                          :end-placeholder="$t('common.endTime')"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="日唤醒时间段3" >
                        <el-time-picker
                          is-range
                          v-model="time3"
                          value-format="HH:mm"
                          format="HH:mm"
                          :start-placeholder="$t('common.startTime')"
                          :end-placeholder="$t('common.endTime')"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
              <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="日唤醒时间段4" >
                        <el-time-picker
                          is-range
                          v-model="time4"
                          value-format="HH:mm"
                          format="HH:mm"
                          :start-placeholder="$t('common.startTime')"
                          :end-placeholder="$t('common.endTime')"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
      </el-form>
    </div>
</template>

<script>
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
        if(newVal['007C'] && newVal['007C'].wakeTime1 && newVal['007C'].closeTime1){
          this.time1=[newVal['007C'].wakeTime1,newVal['007C'].closeTime1]
        }
        if(newVal['007C'] && newVal['007C'].wakeTime2 && newVal['007C'].closeTime2){
          this.time2=[newVal['007C'].wakeTime2,newVal['007C'].closeTime2]
        }
        if(newVal['007C'] && newVal['007C'].wakeTime3 && newVal['007C'].closeTime3){
          this.time3=[newVal['007C'].wakeTime3,newVal['007C'].closeTime3]
        }
        if(newVal['007C'] && newVal['007C'].wakeTime4 && newVal['007C'].closeTime4){
          this.time4=[newVal['007C'].wakeTime4,newVal['007C'].closeTime4]
        }
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
    time1:{
      handler (val) {
        if (val.length>0){
          this.form['007C'].wakeTime1=val[0]
          this.form['007C'].closeTime1=val[1]
        }else {
          this.form['007C'].wakeTime1=''
          this.form['007C'].closeTime1=''
        }
      },
      deep: true,
      immediate:true,
    },
    time2:{
      handler (val) {
        if (val.length>0){
          this.form['007C'].wakeTime2=val[0]
          this.form['007C'].closeTime2=val[1]
        }else {
          this.form['007C'].wakeTime2=''
          this.form['007C'].closeTime2=''
        }
      },
      deep: true,
      immediate:true,
    },
    time3:{
      handler (val) {
        if (val.length>0){
          this.form['007C'].wakeTime3=val[0]
          this.form['007C'].closeTime3=val[1]
        }else {
          this.form['007C'].wakeTime3=''
          this.form['007C'].closeTime3=''
        }
      },
      deep: true,
      immediate:true,
    },
    time4:{
      handler (val) {
        if (val.length>0){
          this.form['007C'].wakeTime4=val[0]
          this.form['007C'].closeTime4=val[1]
        }else {
          this.form['007C'].wakeTime4=''
          this.form['007C'].closeTime4=''
        }
      },
      deep: true,
      immediate:true,
    },
  },
  data() {
    return {
      form:{},
      time1:[],
      time2:[],
      time3:[],
      time4:[],
    }
  },
}
</script>

<style scoped>

</style>