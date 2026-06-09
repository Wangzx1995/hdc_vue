<template>
    <div class="p-a-md">
        <h2>位置汇报设置</h2>
        <el-form
            ref="PublicBasicSetting"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
            :rules="rules"
        >
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="位置汇报策略">
                        <el-select v-model="form['0020'].reportGpsStrategy">
                          <el-option label="定时汇报" :value="0"></el-option>
                          <el-option label="定距汇报" :value="1"></el-option>
                          <el-option label="定时和定距汇报" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="位置汇报方案">
                        <el-select v-model="form['0021'].reportGpsPlan">
                          <el-option label="根据ACC状态" :value="0"></el-option>
                          <el-option label="根据登陆状态和ACC状态" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7"></el-col>
            </el-row>

        <h2>拐点补传角度设置</h2>
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="拐点补传角度（<=180度）" prop="0030.replenishGpsAngle">
                        <el-input v-model="form['0030'].replenishGpsAngle"><span slot="suffix">度</span></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
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
        '0030.replenishGpsAngle': [ { validator: checkNumber.bind({ min:0,max:180}), trigger: 'blur' }],//0-180
      }
    }
  },
}
</script>

<style scoped>

</style>