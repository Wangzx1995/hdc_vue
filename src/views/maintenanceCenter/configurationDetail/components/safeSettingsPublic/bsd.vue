<template>
    <div class="p-a-md">
         <el-form
              ref="BsdPublic"
              label-position="top"
              :model="form"
              label-width="120px"
              :rules="rules"
          >
          <el-tabs v-model="activeName">
            <el-tab-pane label="盲区监测系统设置" name="first">
              <div class="configurations">
                <div v-if="form['F367']" class="configuration-item">
                  <el-form-item label="后方接近报警时间阈值" prop="F367.backApproachAlarmTimeThreshold">
                    <el-input v-model="form['F367'].backApproachAlarmTimeThreshold"><span slot="suffix">s</span></el-input>
                  </el-form-item>
                </div>
                <div v-if="form['F367']" class="configuration-item">
                  <el-form-item label="侧后方接近报警时间阈值" prop="F367.sideBackApproachAlarmTimeThreshold">
                    <el-input v-model="form['F367'].sideBackApproachAlarmTimeThreshold"><span slot="suffix">s</span></el-input>
                  </el-form-item>
                </div>
              </div>
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
          'F367.backApproachAlarmTimeThreshold': [
            { validator: checkNumber.bind({ min:1,max:10}), trigger: 'blur' }
          ],
          'F367.sideBackApproachAlarmTimeThreshold': [
            { validator: checkNumber.bind({ min:1,max:10}), trigger: 'blur' }
          ],
      }
    }
  },
}
</script>

<style scoped>

</style>