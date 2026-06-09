<template>
  <div class="p-a-md">
    <!-- <h2>基本参数</h2> -->
    <el-form ref="PublicVehicleRegistration" label-position="top" :model="form" label-width="120px" :rules="rules" style="margin-top: 10px">
      <!-- <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-form-item label="车辆所在省域ID" prop="0081.provinceId">
			      <el-input v-model="form['0081'].provinceId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="车辆所在市域ID" prop="0082.cityId">
			      <el-input v-model="form['0082'].cityId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="机动车号牌" prop="0083.plateNum">
            <el-input v-model="form['0083'].plateNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="车牌颜色" prop="0084.color">
            <el-select v-model="form['0084'].color">
              <el-option label="未上牌" :value="0"></el-option>
              <el-option label="蓝" :value="1"></el-option>
              <el-option label="黄" :value="2"></el-option>
              <el-option label="黑" :value="3"></el-option>
              <el-option label="白" :value="4"></el-option>
              <el-option label="其他" :value="9"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>
    <h2 id="title">APN</h2>
    <el-form ref="PublicApn" label-position="top" :model="form" :rules="rules" style="margin-top: 10px">
    <template v-if="form['IsApiApnInfo']">
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
            <el-form-item label="第一中心使能">
              <el-switch v-model="form['IsApiApnInfo'].enabled"></el-switch></el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="接入点名称" :rules="{ validator: checkName.bind({min:form['IsApiApnInfoCapability'].apnNameLengthMin,max:form['IsApiApnInfoCapability'].apnNameLengthMax}), trigger: 'blur' }" prop="IsApiApnInfo.apnName">
            <el-input tips-placement="top-end" :tips="`键入值长度范围为${form['IsApiApnInfoCapability'].apnNameLengthMin}~${form['IsApiApnInfoCapability'].apnNameLengthMax},一个中文字等于2个字符`" v-model="form['IsApiApnInfo'].apnName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="拨号号码" :rules="{ validator: checkName.bind({min:form['IsApiApnInfoCapability'].dialNumLengthMin,max:form['IsApiApnInfoCapability'].dialNumLengthMax}), trigger: 'blur' }" prop="IsApiApnInfo.dialNum">
            <el-input tips-placement="top-end" :tips="`键入值长度范围为${form['IsApiApnInfoCapability'].dialNumLengthMin}~${form['IsApiApnInfoCapability'].dialNumLengthMax},一个中文字等于2个字符`" v-model="form['IsApiApnInfo'].dialNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-form-item label="用户名" :rules="{ validator: checkName.bind({min:form['IsApiApnInfoCapability'].userNameLengthMin,max:form['IsApiApnInfoCapability'].userNameLengthMax}), trigger: 'blur' }" prop="IsApiApnInfo.userName">
            <el-input tips-placement="top-end" :tips="`键入值长度范围为${form['IsApiApnInfoCapability'].userNameLengthMin}~${form['IsApiApnInfoCapability'].userNameLengthMax},一个中文字等于2个字符`" v-model="form['IsApiApnInfo'].userName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="密码" :rules="{ validator: checkName.bind({min:form['IsApiApnInfoCapability'].passwordLengthMin,max:form['IsApiApnInfoCapability'].passwordLengthMax}), trigger: 'blur' }" prop="IsApiApnInfo.password">
            <el-input tips-placement="top-end" :tips="`键入值长度范围为${form['IsApiApnInfoCapability'].passwordLengthMin}~${form['IsApiApnInfoCapability'].passwordLengthMax},一个中文字等于2个字符`" v-model="form['IsApiApnInfo'].password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="最大传输单元" :rules="{ validator: checkNumbers.bind({min:form['IsApiApnInfoCapability'].mtuMin,max:form['IsApiApnInfoCapability'].mtuMax}), trigger: 'blur' }" prop="IsApiApnInfo.mtu">
            <el-input tips-placement="top-end" :tips="`键入数值范围为${form['IsApiApnInfoCapability'].mtuMin}~${form['IsApiApnInfoCapability'].mtuMax}`" v-model="form['IsApiApnInfo'].mtu">
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
            <el-select v-model="form['IsApiApnInfo'].switchMethod">
              <el-option
                v-for="item in form['IsApiApnInfoCapability'].switchMethodList"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7"></el-col>
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
    },
    allCopyData:{
      type: Object,
      default:()=>{
        return {}
      }
    },
    formDetail:{
      type: Object,
      default:()=>{
        return {}
      }
    },
    isTemplate: {
      type: String
    },
  },
  watch:{
    detail: {
      handler (newVal,oldVal) {
        this.form = newVal
      },
      deep: true,
      immediate:true,
    },
    formDetail:{
      handler (newVal,oldVal) {
        console.log(newVal)
        this.formData = newVal
      },
      deep: true,
      immediate:true,
    },
    allCopyData: {
      handler (newVal,oldVal) {
        console.log(newVal)
        this.copyForm = newVal
      },
      deep: true,
      immediate:true,
    },
    configParams:{
      handler (val) {
        if(!val && !this.form['IsApiApnInfo'] && this.form['IsApiApnInfo'] != '{}' && this.isTemplate != 'true'){
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
    },
    copyForm: {
      handler (val) {
        console.log(val)
        if (JSON.stringify(val) !== '{}'){
          this.$emit('changeCopy',val)
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiApnInfo':{
      handler (val) {
        if(val!=undefined){
          this.$refs['PublicApn'].validate((valid) => {
            if (valid) {
              this.formData['IsApiApnInfo.enabled'] = val['enabled'] != this.copyForm['IsApiApnInfo']['enabled'] ? `IsApiApnInfo.enabled&注册参数/APN/第一中心使能&${val['enabled']?'开启':'关闭'}&${this.copyForm['IsApiApnInfo']['enabled']}` : '';
              this.formData['IsApiApnInfo.apnName'] = val['apnName'] != this.copyForm['IsApiApnInfo']['apnName'] ? `IsApiApnInfo.apnName&注册参数/APN/接入点名称&${val['apnName']}` : '';
              this.formData['IsApiApnInfo.dialNum'] = val['dialNum'] != this.copyForm['IsApiApnInfo']['dialNum'] ? `IsApiApnInfo.dialNum&注册参数/APN/拨号号码&${val['dialNum']}` : '';
              this.formData['IsApiApnInfo.userName'] = val['userName'] != this.copyForm['IsApiApnInfo']['userName'] ? `IsApiApnInfo.userName&注册参数/APN/用户名&${val['userName']}` : '';
              this.formData['IsApiApnInfo.password'] = val['password'] != this.copyForm['IsApiApnInfo']['password'] ? `IsApiApnInfo.password&注册参数/APN/用户名&${val['password']}` : '';
              this.formData['IsApiApnInfo.mtu'] = val['mtu'] != this.copyForm['IsApiApnInfo']['mtu'] ? `IsApiApnInfo.mtu&注册参数/APN/最大传输单元&${val['mtu']}` :'';
              this.formData['IsApiApnInfo.verifyProto'] = val['verifyProto'] != this.copyForm['IsApiApnInfo']['verifyProto'] ? `IsApiApnInfo.verifyProto&注册参数/APN/验证方式&${val['verifyProto']}` :'';
              this.formData['IsApiApnInfo.switchMethod'] = val['switchMethod'] != this.copyForm['IsApiApnInfo']['switchMethod'] ? `IsApiApnInfo.switchMethod&注册参数/APN/频段&${val['switchMethod']}` :'';
            } else {
              this.formData['IsApiApnInfo.enabled'] = ''
              this.formData['IsApiApnInfo.apnName'] = ''
              this.formData['IsApiApnInfo.dialNum'] = ''
              this.formData['IsApiApnInfo.userName'] = ''
              this.formData['IsApiApnInfo.password'] = ''
              this.formData['IsApiApnInfo.mtu'] = ''
              this.formData['IsApiApnInfo.verifyProto'] = ''
              this.formData['IsApiApnInfo.switchMethod'] = ''
            }
            this.$emit('changeData',this.formData)
          });
        }
      },
      deep: true,
      immediate:false,
    },
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
      checkName:function(rule,value,callback){
        let len = 0;
        for(let i = 0;i < value.length;i++){
          let c = value.charCodeAt(i);
          if((c>=0x0001 && c<=0x007e || 0xff60<=c && c<=0xff9f)){
            len++
          }else{
            len+=2
          }
        }
        if((len < this.min && len>0) || len>this.max){
          callback(new Error('取值范围为'+this.min+'~'+this.max+'一个中文字等于2个字符'))
        }else{
          callback()
        }

      },
      checkNumbers : function(rule, value, callback){
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
            callback(new Error("不能为空"));
            // callback();
        }
      },
      form:{},
      copyForm:{},
      formData:{},      
      rules: {
        '0081.provinceId': [ { validator: checkNumber.bind({type:'short',min:1,max:32767}), trigger: 'blur' }],
        '0082.cityId': [ { validator: checkNumber.bind({type:'short',min:1,max:32767}), trigger: 'blur' }],
        // '0083.plateNum':[{ required: true, message: '请输入', trigger: 'blur' }],
        // '0084.color':[{ required: true, type:'number', message: '请选择', trigger: 'change' }]
      }
    }
  },
  created(){
    // this.getByIsApi(1)
    console.log(this.isTemplate)
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
          this.$nextTick(() =>{
            if(!document.querySelector('#title')){
              this.$message.info('获取设备配置异常，请点击“刷新最新配置”')
            }
          })
          this.form = Object.assign({}, this.form, JSON.parse(res.data));
          this.copyForm = Object.assign({}, this.copyForm, JSON.parse(res.data)); 
        }else{
            this.$message.error('获取设备配置参数失败:' + res.msg)
        }
      })
    }
  }
 
}
</script>

<style lang="less" scoped>

</style>