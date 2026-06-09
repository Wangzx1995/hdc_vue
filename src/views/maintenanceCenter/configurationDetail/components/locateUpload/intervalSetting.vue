<template>
    <div class="p-a-md">
        <h2>上报时间间隔设置</h2>
        <el-form
            ref="IntervalSetting"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
            :rules="rules"
        >
          <div class="configurations">
            <div v-if="form['0027']" class="configuration-item">
              <el-form-item label="休眠汇报时间间隔" prop="0027.reportTimeIntervalDuringSleep">
                  <el-input v-model="form['0027'].reportTimeIntervalDuringSleep"><span slot="suffix">s</span></el-input>
              </el-form-item>
            </div>
            <div v-if="form['0028']" class="configuration-item">
              <el-form-item label="紧急报警汇报时间间隔" prop="0028.reportTimeIntervalDuringAlarm">
                  <el-input v-model="form['0028'].reportTimeIntervalDuringAlarm"><span slot="suffix">s</span></el-input>
              </el-form-item>
            </div>
            <div v-if="form['0029']" class="configuration-item">
              <el-form-item label="缺省时间汇报时间间隔" prop="0029.reportTimeIntervalDuringDefault">
                  <el-input v-model="form['0029'].reportTimeIntervalDuringDefault"><span slot="suffix">s</span></el-input>
              </el-form-item>
            </div>
            <div v-if="form['0022']" class="configuration-item">
              <el-form-item label="驾驶员未登录汇报时间间隔" prop="0022.driverUnloginUploadTimeInterval">
                  <el-input v-model="form['0022'].driverUnloginUploadTimeInterval"><span slot="suffix">s</span></el-input>
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
            </el-row> -->

        <h2>上报距离间隔设置</h2>
        <div class="configurations">
          <div v-if="form['002C']" class="configuration-item">
            <el-form-item label="缺省距离汇报间隔" prop="002C.defaultDistanceReportingInterval">
                <el-input v-model="form['002C'].defaultDistanceReportingInterval"><span slot="suffix">m</span></el-input>
            </el-form-item>
          </div>
          <div v-if="form['002D']" class="configuration-item">
            <el-form-item label="驾驶员未登录汇报距离间隔" prop="002D.driverNotLoggedInReportingInterval">
                <el-input v-model="form['002D'].driverNotLoggedInReportingInterval"><span slot="suffix">m</span></el-input>
            </el-form-item>
          </div>
          <div v-if="form['002E']" class="configuration-item">
            <el-form-item label="休眠时汇报距离间隔" prop="002E.sleepDistanceReportingInterval">
                <el-input v-model="form['002E'].sleepDistanceReportingInterval"><span slot="suffix">m</span></el-input>
            </el-form-item>
          </div>
          <div v-if="form['002F']" class="configuration-item">
            <el-form-item label="紧急报警时汇报距离间隔" prop="002F.alarmDistanceReportingInterval">
                <el-input v-model="form['002F'].alarmDistanceReportingInterval"><span slot="suffix">m</span></el-input>
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
            </el-row> -->
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
      rules: {
        '0027.reportTimeIntervalDuringSleep': [ { validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'blur' }],
        '0028.reportTimeIntervalDuringAlarm': [ { validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'blur' }],
        '0029.reportTimeIntervalDuringDefault': [ { validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'blur' }],
        '0022.driverUnloginUploadTimeInterval': [ { validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'blur' }],
        '002C.defaultDistanceReportingInterval': [ { validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'blur' }],
        '002D.driverNotLoggedInReportingInterval': [ { validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'blur' }],
        '002E.sleepDistanceReportingInterval': [ { validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'blur' }],
        '002F.alarmDistanceReportingInterval': [ { validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'blur' }],
      }
    }
  },
}
</script>

<style scoped>

</style>