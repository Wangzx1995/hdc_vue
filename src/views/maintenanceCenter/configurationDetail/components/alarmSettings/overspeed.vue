<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
        <el-form
            ref="Overspeed"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top:10px"
            :rules="rules"
        >
          <div class="configurations">
            <div v-if="form['0056']" class="configuration-item">
              <el-form-item label="超速持续时间" prop="0056.overSpeedDurationTime">
                  <el-input v-model="form['0056'].overSpeedDurationTime"><span slot="suffix">s</span></el-input>
              </el-form-item>
            </div>
            <div v-if="form['005B']" class="configuration-item">
              <el-form-item label="超速预警差值" prop="005B.overSpeedAlarmWarningValue">
                  <el-input v-model="form['005B'].overSpeedAlarmWarningValue"><span slot="suffix">0.1 km/h</span></el-input>
              </el-form-item>
            </div>
            <div v-if="form['0055']" class="configuration-item">
              <el-form-item label="超速阈值" prop="0055.maxSpeed">
                  <el-input v-model="form['0055'].maxSpeed"><span slot="suffix">km/h</span></el-input>
              </el-form-item>
            </div>
          </div>
            <!-- <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    
                </el-col>
                <el-col :span="7" >
                    
                </el-col>
               <el-col :span="7" >
                    
                </el-col> -->
                <!-- <el-col :span="7" ></el-col> -->
            <!-- </el-row> -->
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
        '0056.overSpeedDurationTime': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
        '005B.overSpeedAlarmWarningValue': [ { validator: checkNumber.bind({type:'short',min:0,max:32767}), trigger: 'blur' }],
        '0055.maxSpeed': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
      }
    }
  },
}
</script>

<style scoped>

</style>