<template>
    <div class="p-a-md">
        <el-form
            ref="Params"
            label-position="top"
            :model="form"
            label-width="120px"
            :rules="rules" 
        >
            <h2>实时流参数设置</h2>
            <div class="configurations">
              <div v-if="form['0075'] && form['0075'].realtimeStreamEncodeMode !==''" class="configuration-item">
                <el-form-item label="实时流编码模式">
                  <el-select v-model="form['0075'].realtimeStreamEncodeMode">
                    <el-option label="CBR(固定码率)" :value="0"></el-option>
                    <el-option label="VBR(可变码率)" :value="1"></el-option>
                    <el-option label="ABR(平均码率)" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div v-if="form['0075'] && form['0075'].realtimeResolutionRatio !==''" class="configuration-item">
                <el-form-item label="实时流分辨率">
                  <el-select @change="makeRealStoreSame(0)" v-model="form['0075'].realtimeResolutionRatio">
                    <el-option label="QCIF" :value="0"></el-option>
                    <el-option label="CIF" :value="1"></el-option>
                    <el-option label="WCIF" :value="2"></el-option>
                    <el-option label="D1" :value="3"></el-option>
                    <el-option label="WD1" :value="4"></el-option>
                    <el-option label="720P" :value="5"></el-option>
                    <el-option label="1080P" :value="6"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div v-if="form['0075'] && form['0075'].realtimeFrameInterval !==''" class="configuration-item">
                <el-form-item label="实时流关键帧间隔（1-1000）" prop="0075.realtimeFrameInterval">
                    <el-input v-model="form['0075'].realtimeFrameInterval"></el-input>
                </el-form-item>
              </div>
              <div v-if="form['0075'] && form['0075'].realtimeFramePerSecond !==''" class="configuration-item">
                <el-form-item label="实时流目标帧率（1-120）" prop="0075.realtimeFramePerSecond">
                    <el-input v-model="form['0075'].realtimeFramePerSecond"><span slot="suffix">帧/s</span></el-input>
                </el-form-item>
              </div>
              <div v-if="form['0075'] && form['0075'].realtimeCodeRate !==''" class="configuration-item">
                <el-form-item label="实时流目标码率" prop="0075.realtimeCodeRate">
                    <el-input v-model="form['0075'].realtimeCodeRate"><span slot="suffix">kbps</span></el-input>
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
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    
                </el-col>
                <el-col :span="7" >
                    
                </el-col>
                <el-col :span="7"></el-col>
            </el-row> -->
            <h2>存储流参数设置</h2>
            <div class="configurations">
              <div v-if="form['0075'] && form['0075'].storeStreamEncodeMode !==''" class="configuration-item">
                <el-form-item label="存储流编码模式">
                    <el-select v-model="form['0075'].storeStreamEncodeMode">
                      <el-option label="CBR(固定码率)" :value="0"></el-option>
                      <el-option label="VBR(可变码率)" :value="1"></el-option>
                      <el-option label="ABR(平均码率)" :value="2"></el-option>
                    </el-select>
                </el-form-item>
              </div>
              <div v-if="form['0075'] && form['0075'].storeResolutionRatio !==''" class="configuration-item">
                <el-form-item label="存储流分辨率">
                    <el-select @change="makeRealStoreSame(1)" v-model="form['0075'].storeResolutionRatio">
                      <el-option label="QCIF" :value="0"></el-option>
                      <el-option label="CIF" :value="1"></el-option>
                      <el-option label="WCIF" :value="2"></el-option>
                      <el-option label="D1" :value="3"></el-option>
                      <el-option label="WD1" :value="4"></el-option>
                      <el-option label="720P" :value="5"></el-option>
                      <el-option label="1080P" :value="6"></el-option>
                    </el-select>
                </el-form-item>
              </div>
              <div v-if="form['0075'] && form['0075'].storeFrameInterval !==''" class="configuration-item">
                <el-form-item label="存储流关键帧间隔（1-1000）" prop="0075.storeFrameInterval">
                    <el-input v-model="form['0075'].storeFrameInterval"></el-input>
                </el-form-item>
              </div>
              <div v-if="form['0075'] && form['0075'].storeFramePerSecond !==''" class="configuration-item">
                <el-form-item label="存储流目标帧率"  prop="0075.storeFramePerSecond">
                    <el-input v-model="form['0075'].storeFramePerSecond"><span slot="suffix">帧/s</span></el-input>
                </el-form-item>
              </div>
              <div v-if="form['0075'] && form['0075'].storeCodeRate !==''" class="configuration-item">
                <el-form-item label="存储流目标码率" prop="0075.storeCodeRate">
                    <el-input v-model="form['0075'].storeCodeRate"><span slot="suffix">kbps</span></el-input>
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
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    
                </el-col>
                <el-col :span="7" >
                    
                </el-col>
                <el-col :span="7"></el-col>
            </el-row> -->
            <h2>其他设置</h2>
            <div class="configurations">
                <div v-if="form['0075']" class="configuration-item">
                  <el-form-item label="OSD字幕叠加">
                    <el-checkbox-group v-model="form['0075'].osdDisplayOptions">
                      <el-checkbox label="date">日期和时间</el-checkbox>
                      <el-checkbox label="plateNum">车牌号码</el-checkbox>
                      <el-checkbox label="channelNum">逻辑通道号</el-checkbox>
                      <el-checkbox label="longitudeAndLatitude" >经纬度</el-checkbox>
                      <el-checkbox label="driveSpeed" >行驶记录速度</el-checkbox>
                      <el-checkbox label="satelliteSpeed" >卫星定位速度</el-checkbox>
                      <el-checkbox label="driveTime" >连续驾驶时间</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </div>
                <div v-if="form['0075']" class="configuration-item">
                  <el-form-item label="是否启用音频输出">
                      <el-select v-model="form['0075'].useAudioOutput">
                        <el-option label="关闭" :value="0"></el-option>
                        <el-option label="启用" :value="1"></el-option>
                      </el-select>
                  </el-form-item>
                </div>
              </div>
            <!-- <el-row type="flex" justify="space-between" style="margin-top: 10px">
                <el-col :span="24" >
                    
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
        '0075.realtimeFrameInterval': [ { validator: checkNumber.bind({type:'short',min:1,max:1000}), trigger: 'blur' }],
        '0075.realtimeFramePerSecond': [ { validator: checkNumber.bind({type:'byte',min:1,max:120}), trigger: 'blur' }],
        '0075.realtimeCodeRate': [ { validator: checkNumber.bind({type:'int',min:0,max:1000000}), trigger: 'blur' }],
        '0075.storeFrameInterval': [ { validator: checkNumber.bind({type:'short',min:1,max:1000}), trigger: 'blur' }],
        '0075.storeFramePerSecond': [ { validator: checkNumber.bind({type:'byte',min:1,max:120}), trigger: 'blur' }],
        '0075.storeCodeRate': [ { validator: checkNumber.bind({type:'int',min:0,max:1000000}), trigger: 'blur' }],
      }
    }
  },
  methods:{
    makeRealStoreSame(type){
      type == 0 ? this.form['0075'].storeResolutionRatio = this.form['0075'].realtimeResolutionRatio : this.form['0075'].realtimeResolutionRatio = this.form['0075'].storeResolutionRatio
    }
  }
}
</script>

<style scoped>

</style>