<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
        <el-form
            ref="DataUp"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
            :rules="rules"
        >
          <div class="configurations">
            <div v-if="form['0094']" class="configuration-item">
              <el-form-item label="GNSS模块详细定位数据上传方式">
                <el-select v-model="form['0094'].positioningUploadType">
                  <el-option label="本地存储" :value="0"></el-option>
                  <el-option label="按时间间隔上传" :value="1"></el-option>
                  <el-option label="按距离间隔上传" :value="2"></el-option>
                  <el-option label="按累计时间上传" :value="11"></el-option>
                  <el-option label="按累计距离上传" :value="12"></el-option>
                  <el-option label="按累计条数上传" :value="13"></el-option>
                </el-select>
            </el-form-item>
            </div>
            <div v-if="form['0095']" class="configuration-item">
              <el-form-item label="GNSS模块详细定位数据上传设置">
                <el-input v-if="form['0094'].positioningUploadType == 0" :disabled="true" v-model="form['0093'].positioningInputFrequency"></el-input>
                <el-input v-else-if="form['0094'].positioningUploadType == 1 || form['0094'].positioningUploadType == 11" v-model="form['0093'].positioningInputFrequency"><span slot="suffix">秒</span></el-input>
                <el-input v-else-if="form['0094'].positioningUploadType == 2 || form['0094'].positioningUploadType == 12" v-model="form['0093'].positioningInputFrequency"><span slot="suffix">米</span></el-input>
                <el-input v-else-if="form['0094'].positioningUploadType == 13" v-model="form['0093'].positioningInputFrequency"><span slot="suffix">条</span></el-input>
              </el-form-item>
            </div>
            <div v-if="form['0092']" class="configuration-item">
              <el-form-item label="GNSS模块详细定位数据输出频率">
                <el-select v-model="form['0092'].positioningOutputFrequency">
                  <el-option label="500ms" :value="0"></el-option>
                  <el-option label="1000ms" :value="1"></el-option>
                  <el-option label="2000ms" :value="2"></el-option>
                  <el-option label="3000ms" :value="3"></el-option>
                  <el-option label="4000ms" :value="4"></el-option>
                </el-select>
            </el-form-item>
            </div>
            <div v-if="form['0093']" class="configuration-item">
              <el-form-item label="GNSS模块详细定位数据采集频率" prop="0093.positioningInputFrequency">
                  <el-input v-model="form['0093'].positioningInputFrequency"><span slot="suffix">s</span></el-input>
              </el-form-item>
            </div>
            <div v-if="form['0091']" class="configuration-item">
              <el-form-item label="GNSS波特率">
                <el-select v-model="form['0091'].baudRate">
                  <el-option label="4800" :value="0"></el-option>
                  <el-option label="9600" :value="1"></el-option>
                  <el-option label="19200" :value="2"></el-option>
                  <el-option label="38400" :value="3"></el-option>
                  <el-option label="57600" :value="4"></el-option>
                  <el-option label="115200" :value="5"></el-option>
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
                <el-col :span="7"></el-col>
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
        '0093.positioningInputFrequency': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
      }
    }
  },
}
</script>

<style scoped>

</style>