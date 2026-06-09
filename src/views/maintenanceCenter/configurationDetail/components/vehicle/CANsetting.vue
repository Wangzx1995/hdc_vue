<template>
  <div class="p-a-md">
    <h2>基础设置</h2>
    <el-form ref="VehicleCANsetting" label-position="top" :model="form" :rules="rules" style="margin-top: 10px">
      <div class="configurations">
        <div v-if="form['0100']" class="configuration-item">
          <el-form-item label="CAN总线通道1采集时间间隔(0为不采集)" prop="0100.heartbeat">
            <el-input v-model="form['0100'].heartbeat">
                <span slot="suffix">ms</span>
            </el-input>
          </el-form-item>
        </div>
        <div v-if="form['0101']" class="configuration-item">
          <el-form-item label="CAN总线通道1上传时间间隔(0为不上传)" prop="0101.heartbeat">
            <el-input v-model="form['0101'].heartbeat">
                <span slot="suffix">ms</span>
            </el-input>
          </el-form-item>
        </div>
        <div v-if="form['0102']" class="configuration-item">
          <el-form-item label="CAN总线通道2采集时间间隔(0为不采集)" prop="0102.heartbeat">
            <el-input v-model="form['0102'].heartbeat">
              <span slot="suffix">s</span>
            </el-input>
          </el-form-item>
        </div>
        <div v-if="form['0103']" class="configuration-item">
          <el-form-item label="CAN总线通道2上传时间间隔(0为不上传)" prop="0103.heartbeat">
            <el-input v-model="form['0103'].heartbeat">
                <span slot="suffix">s</span>
            </el-input>
          </el-form-item>
        </div>
        <div v-if="form['0110']" class="configuration-item">
          <el-form-item label="CAN总线ID单独采集时间间隔(0为不采集)" prop="0110.heartbeat">
            <el-input v-model="form['0110'].heartbeat">
              <span slot="suffix">s</span>
            </el-input>
          </el-form-item>
        </div>
        <div v-if="form['0110']" class="configuration-item">
          <el-form-item label="CAN通道号" prop="0110.canChannelNum">
            <el-select v-model="form['0110'].canChannelNum">
               <el-option label="can1" :value="0"></el-option>
               <el-option label="can2" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="form['0110']" class="configuration-item">
          <el-form-item label="帧类型" prop="0110.frameType">
            <el-select v-model="form['0110'].frameType">
              <el-option label="标准帧" :value="0"></el-option>
              <el-option label="扩展帧" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="form['0110']" class="configuration-item">
          <el-form-item label="数据采集方式" prop="0110.collectType">
            <el-select v-model="form['0110'].collectType">
              <el-option label="原始数据" :value="0"></el-option>
              <el-option label="采集区间的计算值" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="form['0110']" class="configuration-item">
          <el-form-item label="can总线ID" prop="0110.canId">
            <el-input v-model="form['0110'].canId"></el-input>
          </el-form-item>
        </div>
      </div>
      <!-- <el-row type="flex" justify="space-between">
        <el-col :span="7">
          
        </el-col>
        <el-col :span="7">
          
        </el-col>
        <el-col :span="7">
          
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          
        </el-col>
        <el-col :span="7">
          
        </el-col>
        <el-col :span="7">
          
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          
        </el-col>
        <el-col :span="7">
          
        </el-col>
        <el-col :span="7">
          
        </el-col>
      </el-row> -->
      <!-- 这个不需要-->
      <!-- <h2 class="m-t-lg">设备操作</h2>
      <el-tabs v-model="activeName">
        <el-tab-pane label="车速" name="first">
            <el-row type="flex" justify="space-between">
              <el-col :span="6">
                <el-form-item label="CAN协议类型" class="m-r-md p-r">
                  <el-select v-model="form.CANprotocolType"></el-select>
                </el-form-item>
                <el-form-item label="起始位(1-8)" class="m-r-md p-r">
                  <el-input v-model="form.startPosition">
                    <span slot="suffix">bit</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="CAN信息开关开启数值" class="m-r-md p-r">
                  <el-input v-model="form.CANinformationSwitchOnValue"></el-input>
                </el-form-item>
                <el-form-item label="传输速率" class="m-r-md m-r-lg p-r">
                  <el-select v-model="form.transmissionSpeed"></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="CAN数据ID(OX00000001-OX1FFFFFFF)" class="m-r-md p-r">
                  <el-input v-model="form.CANdataID"></el-input>
                </el-form-item>
                <el-form-item label="结束字节" class="m-r-md p-r">
                  <el-input v-model="form.endByte">
                    <span slot="suffix">Byte</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="CAN信息开关关闭数值" class="m-r-md p-r">
                  <el-input v-model="form.CANinformationSwitchOffValue"></el-input>
                </el-form-item>
                <el-form-item label="CAN字节端大小" class="m-r-md p-r">
                  <el-select v-model="form.CANbyteSizeEnd"></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="起始字节" class="m-r-md p-r">
                  <el-input v-model="form.startByte">
                    <span slot="suffix">Byte</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="结束位(1-8)" class="m-r-md p-r">
                  <el-input v-model="form.endPosition">
                    <span slot="suffix">bit</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="比例系数" class="m-r-md p-r">
                  <el-input v-model="form.scaleFactor"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="左转" name="second">
            <el-row type="flex" justify="space-between">
              <el-col :span="6">
                <el-form-item label="CAN协议类型" class="m-r-md p-r">
                  <el-select v-model="form.CANprotocolType"></el-select>
                </el-form-item>
                <el-form-item label="起始位(1-8)" class="m-r-md p-r">
                  <el-input v-model="form.startPosition">
                    <span slot="suffix">bit</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="CAN信息开关开启数值" class="m-r-md p-r">
                  <el-input v-model="form.CANinformationSwitchOnValue"></el-input>
                </el-form-item>
                <el-form-item label="传输速率" class="m-r-md m-r-lg p-r">
                  <el-select v-model="form.transmissionSpeed"></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="CAN数据ID(OX00000001-OX1FFFFFFF)" class="m-r-md p-r">
                  <el-input v-model="form.CANdataID"></el-input>
                </el-form-item>
                <el-form-item label="结束字节" class="m-r-md p-r">
                  <el-input v-model="form.endByte">
                    <span slot="suffix">Byte</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="CAN信息开关关闭数值" class="m-r-md p-r">
                  <el-input v-model="form.CANinformationSwitchOffValue"></el-input>
                </el-form-item>
                <el-form-item label="CAN字节端大小" class="m-r-md p-r">
                  <el-select v-model="form.CANbyteSizeEnd"></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="起始字节" class="m-r-md p-r">
                  <el-input v-model="form.startByte">
                    <span slot="suffix">Byte</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="结束位(1-8)" class="m-r-md p-r">
                  <el-input v-model="form.endPosition">
                    <span slot="suffix">bit</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="比例系数" class="m-r-md p-r">
                  <el-input v-model="form.scaleFactor"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="右转" name="third">
            <el-row type="flex" justify="space-between">
              <el-col :span="6">
                <el-form-item label="CAN协议类型" class="m-r-md p-r">
                  <el-select v-model="form.CANprotocolType"></el-select>
                </el-form-item>
                <el-form-item label="起始位(1-8)" class="m-r-md p-r">
                  <el-input v-model="form.startPosition">
                    <span slot="suffix">bit</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="CAN信息开关开启数值" class="m-r-md p-r">
                  <el-input v-model="form.CANinformationSwitchOnValue"></el-input>
                </el-form-item>
                <el-form-item label="传输速率" class="m-r-md m-r-lg p-r">
                  <el-select v-model="form.transmissionSpeed"></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="CAN数据ID(OX00000001-OX1FFFFFFF)" class="m-r-md p-r">
                  <el-input v-model="form.CANdataID"></el-input>
                </el-form-item>
                <el-form-item label="结束字节" class="m-r-md p-r">
                  <el-input v-model="form.endByte">
                    <span slot="suffix">Byte</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="CAN信息开关关闭数值" class="m-r-md p-r">
                  <el-input v-model="form.CANinformationSwitchOffValue"></el-input>
                </el-form-item>
                <el-form-item label="CAN字节端大小" class="m-r-md p-r">
                  <el-select v-model="form.CANbyteSizeEnd"></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="起始字节" class="m-r-md p-r">
                  <el-input v-model="form.startByte">
                    <span slot="suffix">Byte</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="结束位(1-8)" class="m-r-md p-r">
                  <el-input v-model="form.endPosition">
                    <span slot="suffix">bit</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="比例系数" class="m-r-md p-r">
                  <el-input v-model="form.scaleFactor"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="刹车" name="forth">
            <el-row type="flex" justify="space-between">
              <el-col :span="6">
                <el-form-item label="CAN协议类型" class="m-r-md p-r">
                  <el-select v-model="form.CANprotocolType"></el-select>
                </el-form-item>
                <el-form-item label="起始位(1-8)" class="m-r-md p-r">
                  <el-input v-model="form.startPosition">
                    <span slot="suffix">bit</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="CAN信息开关开启数值" class="m-r-md p-r">
                  <el-input v-model="form.CANinformationSwitchOnValue"></el-input>
                </el-form-item>
                <el-form-item label="传输速率" class="m-r-md m-r-lg p-r">
                  <el-select v-model="form.transmissionSpeed"></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="CAN数据ID(OX00000001-OX1FFFFFFF)" class="m-r-md p-r">
                  <el-input v-model="form.CANdataID"></el-input>
                </el-form-item>
                <el-form-item label="结束字节" class="m-r-md p-r">
                  <el-input v-model="form.endByte">
                    <span slot="suffix">Byte</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="CAN信息开关关闭数值" class="m-r-md p-r">
                  <el-input v-model="form.CANinformationSwitchOffValue"></el-input>
                </el-form-item>
                <el-form-item label="CAN字节端大小" class="m-r-md p-r">
                  <el-select v-model="form.CANbyteSizeEnd"></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="起始字节" class="m-r-md p-r">
                  <el-input v-model="form.startByte">
                    <span slot="suffix">Byte</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="结束位(1-8)" class="m-r-md p-r">
                  <el-input v-model="form.endPosition">
                    <span slot="suffix">bit</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="比例系数" class="m-r-md p-r">
                  <el-input v-model="form.scaleFactor"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
        </el-tab-pane>
      </el-tabs> -->
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
           if(value.length>this.max){
            callback(new Error(`最大长度为${this.max}`));
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
        '0100.heartbeat': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
        '0101.heartbeat': [ { validator: checkNumber.bind({type:'short',min:0,max:32767}), trigger: 'blur' }],
        '0102.heartbeat': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
        '0103.heartbeat': [ { validator: checkNumber.bind({type:'short',min:0,max:32767}), trigger: 'blur' }],
        '0110.heartbeat': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
        // '0110.canChannelNum':[{ required: true, type:'number', message: '请选择', trigger: 'change' }],
        // '0110.frameType':[{ required: true, type:'number', message: '请选择', trigger: 'change' }],
        // '0110.collectType':[{ required: true, type:'number', message: '请选择', trigger: 'change' }],
        '0110.canId':[{ validator: checkString.bind({max:29}), trigger: 'blur' }]
      }
    }
  },
}
</script>

<style lang="less" scoped>

</style>