<template>
    <div class="p-a-md" style="height:100%">
      
        <el-form
          ref="ChannelParams"
          label-position="top"
          :model="form"
          label-width="120px"
          style="height:100%"
        ><template v-if="form['0077'] && form['0077'].mediaChannelParams && form['0077'].mediaChannelParams.length>0">
              <h2>基本设置</h2>
              <el-tabs v-model="activeName" >
                  <el-tab-pane :label="'通道' + (+index+1)" :name="'通道' + (+index+1)" v-for="(item,index) in form['0077'].mediaChannelParams" v-bind:key="index">
                          <h2>实时流参数设置</h2>
                          <el-row type="flex" justify="space-between" style="margin-top: 10px;">
                              <el-col :span="7" >
                                  <el-form-item label="实时流编码模式" >
                                      <el-select v-model="item.realtimeStreamEncodeMode">
                                        <el-option label="CBR(固定码率)" :value="0"></el-option>
                                          <el-option label="VBR(可变码率)" :value="1"></el-option>
                                          <el-option label="ABR(平均码率)" :value="2"></el-option>
                                      </el-select>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="7" >
                                  <el-form-item label="实时流分辨率" >
                                      <el-select v-model="item.realtimeResolutionRatio">
                                        <el-option label="QCIF" :value="0"></el-option>
                                        <el-option label="CIF" :value="1"></el-option>
                                        <el-option label="WCIF" :value="2"></el-option>
                                        <el-option label="D1" :value="3"></el-option>
                                        <el-option label="WD1" :value="4"></el-option>
                                        <el-option label="720P" :value="5"></el-option>
                                        <el-option label="1080P" :value="6"></el-option>
                                      </el-select>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="7" >
                                  <el-form-item label="实时流关键帧间隔（1-1000）" :rules="{ validator: checkNumber.bind({type:'short',min:1,max:1000}), trigger: 'blur' }" :prop="'0077.mediaChannelParams.' + index + '.realtimeFrameInterval'">
                                      <el-input v-model="item.realtimeFrameInterval"></el-input>
                                  </el-form-item>
                              </el-col>
                          </el-row>
                          <el-row type="flex" justify="space-between">
                              <el-col :span="7" >
                                  <el-form-item label="实时流目标帧率（1-120）" :rules="{ validator: checkNumber.bind({type:'byte',min:1,max:120}), trigger: 'blur' }" :prop="'0077.mediaChannelParams.' + index + '.realtimeFrameSecond'">
                                      <el-input v-model="item.realtimeFrameSecond"><span slot="suffix">帧/s</span></el-input>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="7" >
                                  <el-form-item label="实时流目标码率" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:1000000}), trigger: 'blur' }" :prop="'0077.mediaChannelParams.' + index + '.realtimeCodeRate'">
                                      <el-input v-model="item.realtimeCodeRate"><span slot="suffix">kbps</span></el-input>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="7"></el-col>
                          </el-row>
                          <h2>存储流参数设置</h2>
                          <el-row type="flex" justify="space-between" style="margin-top: 10px;">
                              <el-col :span="7" >
                                  <el-form-item label="存储流编码模式" >
                                      <el-select v-model="item.storeStreamEncodeMode">
                                        <el-option label="CBR(固定码率)" :value="0"></el-option>
                                        <el-option label="VBR(可变码率)" :value="1"></el-option>
                                        <el-option label="ABR(平均码率)" :value="2"></el-option>
                                      </el-select>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="7" >
                                  <el-form-item label="存储流分辨率" >
                                      <el-select v-model="item.storeResolutionRatio">
                                        <el-option label="QCIF" :value="0"></el-option>
                                        <el-option label="CIF" :value="1"></el-option>
                                        <el-option label="WCIF" :value="2"></el-option>
                                        <el-option label="D1" :value="3"></el-option>
                                        <el-option label="WD1" :value="4"></el-option>
                                        <el-option label="720P" :value="5"></el-option>
                                        <el-option label="1080P" :value="6"></el-option>
                                      </el-select>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="7" >
                                  <el-form-item label="存储流关键帧间隔（1-1000）" :rules="{ validator: checkNumber.bind({type:'short',min:1,max:1000}), trigger: 'blur' }" :prop="'0077.mediaChannelParams.' + index + '.storeFrameInterval'">
                                      <el-input v-model="item.storeFrameInterval"></el-input>
                                  </el-form-item>
                              </el-col>
                          </el-row>
                          <el-row type="flex" justify="space-between">
                              <el-col :span="7" >
                                  <el-form-item label="存储流目标帧率" :rules="{ validator: checkNumber.bind({type:'byte',min:1,max:120}), trigger: 'blur' }" :prop="'0077.mediaChannelParams.' + index + '.storeFramePerSecond'">
                                      <el-input v-model="item.storeFramePerSecond"><span slot="suffix">帧/s</span></el-input>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="7" >
                                  <el-form-item label="存储流目标码率" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:1000000}), trigger: 'blur' }" :prop="'0077.mediaChannelParams.' + index + '.storeCodeRate'">
                                      <el-input v-model="item.storeCodeRate"><span slot="suffix">kbps</span></el-input>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="7"></el-col>
                          </el-row>
                          <h2>OSD字幕叠加</h2>
                          <el-row type="flex" justify="space-between" style="margin-top: 10px;">
                              <el-col :span="24" >
                                  <el-form-item label="OSD字幕叠加" >
                                      <el-checkbox-group v-model="item.osdDisplayOptions">
                                        <el-checkbox label="date">日期和时间</el-checkbox>
                                        <el-checkbox label="plateNum">车牌号码</el-checkbox>
                                        <el-checkbox label="channelNum">逻辑通道号</el-checkbox>
                                        <el-checkbox label="longitudeAndLatitude" >经纬度</el-checkbox>
                                        <el-checkbox label="driveSpeed" >行驶记录速度</el-checkbox>
                                        <el-checkbox label="satelliteSpeed" >卫星定位速度</el-checkbox>
                                        <el-checkbox label="driveTime" >连续驾驶时间</el-checkbox>
                                      </el-checkbox-group>
                                  </el-form-item>
                              </el-col>
                          </el-row>
                  </el-tab-pane>
              </el-tabs>
      </template>
            <EmptyBox v-else style="height:100%">
        <p slot="description" class="text-md">暂无数据～</p>
      </EmptyBox>
        </el-form>

    </div>
</template>

<script>
import EmptyBox from '@/components/coreManage/emptyBox'
import {validateNum} from '@/utils/validate';
export default {
  components: {
    EmptyBox
  },
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
    return {
      form:{},
      activeName:'通道1',
      checkNumber :function (rule, value, callback) {
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
      }
    }
  },
}
</script>

<style scoped>

</style>