<template>
    <div class="p-a-md">
      <el-form
        ref="TirePressurePublic"
        label-position="top"
        :model="form"
        label-width="120px"
        :rules="rules"
      >
        <el-tabs v-model="activeName">
            <el-tab-pane label="胎压监测系统设置" name="first">
              <el-row type="flex" justify="space-between" style="margin-top: 10px">
                  <el-col :span="7" >
                      <el-form-item label="胎压规格型号" prop="F366.tyreModel">
                          <el-input v-model="form['F366'].tyreModel"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="7" >
                      <el-form-item label="胎压单位"  prop="F366.tyrePressureUnit">
                          <el-select v-model="form['F366'].tyrePressureUnit">
                            <el-option label="kg/cm2" :value="0"></el-option>
                            <el-option label="bar" :value="1"></el-option>
                            <el-option label="kpa" :value="2"></el-option>
                            <el-option label="psi" :value="3"></el-option>
                          </el-select>
                      </el-form-item>
                  </el-col>
                  <el-col :span="7" >
                      <el-form-item label="正常胎压值" prop="F366.normalTyrePressureValue">
                          <el-input v-model="form['F366'].normalTyrePressureValue"><span slot="suffix">PSI</span></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row type="flex" justify="space-between" style="margin-top: 10px">
                  <el-col :span="7" >
                      <el-form-item label="胎压不平衡门限" prop="F366.tyrePressureImbalanceThreshold">
                          <el-input v-model="form['F366'].tyrePressureImbalanceThreshold"><span slot="suffix">%</span></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="7" >
                      <el-form-item label="慢漏气门限" prop="F366.slowAirLeakThreshold">
                          <el-input v-model="form['F366'].slowAirLeakThreshold"><span slot="suffix">%</span></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="7" >
                      <el-form-item label="低压阈值" prop="F366.lowPressureThreshold">
                          <el-input v-model="form['F366'].lowPressureThreshold"><span slot="suffix">PSI</span></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row type="flex" justify="space-between" style="margin-top: 10px">
                  <el-col :span="7" >
                      <el-form-item label="高压阈值" prop="F366.highPressureThreshold">
                          <el-input v-model="form['F366'].highPressureThreshold"><span slot="suffix">PSI</span></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="7" >
                      <el-form-item label="高温阈值" prop="F366.highTemperatureThreshold">
                          <el-input v-model="form['F366'].highTemperatureThreshold"><span slot="suffix">℃</span></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="7" >
                      <el-form-item label="电压阈值" prop="F366.voltageThreshold">
                          <el-input v-model="form['F366'].voltageThreshold"><span slot="suffix">%</span></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row type="flex" justify="space-between" style="margin-top: 10px">
                  <el-col :span="7" >
                      <el-form-item label="定时上报时间间隔" prop="F366.scheduleUploadTimeInterval">
                          <el-input v-model="form['F366'].scheduleUploadTimeInterval"><span slot="suffix">s</span></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="7"></el-col>
                  <el-col :span="7"></el-col>
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
    const checkString = function (rule, value, callback) {
      if (value!=='' && value!==null && value!==undefined) {
           if(value.length!=this.length){
            callback(new Error(`必须为${this.length}个字符`));
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
        'F366.tyreModel':[{ validator: checkString.bind({length:12}), trigger: 'blur' }],
        'F366.normalTyrePressureValue': [ { validator: checkNumber.bind({type:'short',min:0,max:32767}), trigger: 'blur' }],
        'F366.tyrePressureImbalanceThreshold': [ { validator: checkNumber.bind({ min:0,max:100}), trigger: 'blur' }],
        'F366.slowAirLeakThreshold': [ { validator: checkNumber.bind({ min:0,max:100}), trigger: 'blur' }],
        'F366.lowPressureThreshold': [ { validator: checkNumber.bind({type:'short',min:0,max:32767}), trigger: 'blur' }],
        'F366.highPressureThreshold': [ { validator: checkNumber.bind({type:'short',min:0,max:32767}), trigger: 'blur' }],
        'F366.highTemperatureThreshold': [ { validator: checkNumber.bind({type:'short',min:0,max:32767}), trigger: 'blur' }],
        'F366.voltageThreshold': [ { validator: checkNumber.bind({ min:0,max:100}), trigger: 'blur' }],
        'F366.scheduleUploadTimeInterval': [ { validator: checkNumber.bind({ min:0,max:3600}), trigger: 'blur' }],
      }
    }
  },
}
</script>

<style scoped>

</style>