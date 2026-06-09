<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
        <el-form
            ref="Elefence"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
            :rules="rules"
        >
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="电子围栏半径" class="m-r-md" prop="0031.radiusOfElectronicFence">
                        <el-input v-model="form['0031'].radiusOfElectronicFence"><span slot="suffix">m</span></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7" ></el-col>
                <el-col :span="7" ></el-col>
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
        '0031.radiusOfElectronicFence': [ { validator: checkNumber.bind({type:'short',min:0,max:32767}), trigger: 'blur' }],
      }
    }
  },
}
</script>

<style scoped>

</style>