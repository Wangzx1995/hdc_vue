<template>
  <div class="p-a-md">
    <h2>基础设置</h2>
    <el-form ref="PublicApn" label-position="top" :model="form" :rules="rules" style="margin-top: 10px">
    <template v-if="form['IsApiApnInfo']">
      <el-row type="flex" justify="space-between">
          <el-col :span="7">
              <el-form-item label="APN开启">
                <el-switch v-model="form['IsApiApnInfo'].enabled"></el-switch></el-form-item>
          </el-col>
        <el-col :span="7">
          <el-form-item label="接入点名称" prop="IsApiApnInfo.apnName">
            <el-input v-model="form['IsApiApnInfo'].apnName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="拨号号码" prop="IsApiApnInfo.dialNum">
            <el-input v-model="form['IsApiApnInfo'].dialNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-form-item label="用户名" prop="IsApiApnInfo.userName">
            <el-input v-model="form['IsApiApnInfo'].userName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="密码" prop="IsApiApnInfo.password">
            <el-input v-model="form['IsApiApnInfo'].password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="最大传输单元" prop="IsApiApnInfo.mtu">
            <el-input v-model="form['IsApiApnInfo'].mtu">
                <span slot="suffix">单位</span>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-form-item label="验证方式">
            <el-select v-model="form['IsApiApnInfo'].verifyProto">
              <el-option
                v-for="item in form['IsApiApnInfoCapability'].verifyProtoList"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="频段" prop="IsApiApnInfo.switchMethod">
            <el-input v-model="form['IsApiApnInfo'].switchMethod"><span slot="suffix">单位</span></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          
        </el-col>
      </el-row>
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
    </template>
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
    },
     configParams:{
      type:Boolean,
      default:false
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
    configParams:{
        handler (val) {
        if(!val){
          this.getByIsApi();
        }
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
  methods:{
    getByIsApi(){
        if(Boolean(this.isTemplate) == true) return
        let params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: 'IsApiApnInfo',
        }
        this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
            // console.log(res);
            if (res.success == true && !JSON.parse(res.data)['IsApiApnInfo']['statusCode']) {
                this.form = Object.assign({}, this.form, JSON.parse(res.data));
            }else{
                this.$message.error('获取设备配置参数失败:' + res.msg)
            }
        })
    }
  },
}
</script>

<style lang="less" scoped>

</style>