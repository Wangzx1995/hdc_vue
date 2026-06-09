<template>
   <div class="p-a-md">
    <h2 id="title" v-if="form['IsApiZtLed']">基本信息</h2>
    <el-form
      ref="PublicLed"
      label-position="top"
      :model="form"
      label-width="120px"
      v-if="form['IsApiZtLed']"
    >
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-form-item label="采集类型" class="m-r-md p-r">
              <el-select v-model="form['IsApiZtLed'].acquireType">
                <el-option
                 v-for="item in acquireTypes"
                 :key="item.id"
                 :value="item.id"
                 :label="item.label"
                ></el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="外屏亮度调节" class="m-r-md p-r">
              <el-select v-model="form['IsApiZtLed'].lightAdjust">
                 <el-option
                 v-for="item in lightAdjusts"
                 :key="item.id"
                 :value="item.id"
                 :label="item.label"
                ></el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="显示掩码" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtLedCapability'].showMaskMin,max:form['IsApiZtLedCapability'].showMaskMax}), trigger: 'blur'}" prop="IsApiZtLed.showMask" class="m-r-md p-r">
             <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtLedCapability'].showMaskMin}~${form['IsApiZtLedCapability'].showMaskMax}`" v-model.number="form['IsApiZtLed'].showMask"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-form-item label="广告显示控制" class="m-r-md p-r">
              <el-select v-model="form['IsApiZtLed'].advertShowCtrl">
                <el-option
                 v-for="item in advertShowCtrls"
                 :key="item.id"
                 :value="item.id"
                 :label="item.label"
                ></el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="稽查时间" class="m-r-md p-r" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtLedCapability'].checkTimeMin,max:form['IsApiZtLedCapability'].checkTimeMax}), trigger: 'blur'}" prop="IsApiZtLed.checkTime">
              <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtLedCapability'].checkTimeMin}~${form['IsApiZtLedCapability'].checkTimeMax}`" v-model.number="form['IsApiZtLed'].checkTime"><span slot="suffix">s</span></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { validateNum } from '@/utils/validate'
import { valid } from 'semver'

export default {
  name:'led',
  props: {
    isTemplate:{
      type:String
    },
    detail: {
      type: Object,
      default: () => ({}) 
    },
    configParams: {
      type: Boolean,
      default: false
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
    }
  },
   watch: {
    detail: {
      handler(newVal, oldVal) {
        this.form = newVal
      },
      deep: true,
      immediate: true
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
    configParams: {
      handler(val) {
        if (!val) {
          this.getDeviceConfigParamsByIsApi();
        }else{
          
        }
      },
      deep: true,
      immediate: true
    },
    form: {
      handler(val) {
        if (JSON.stringify(val) !== '{}') {
          this.$emit('change', val)
        }
      },
      deep: true,
      immediate: true
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
    'form.IsApiZtLed':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicLed'].validate((valid) =>{
              if(valid){
                this.formData['IsApiZtLed.acquireType'] = val['acquireType'] != this.copyForm['IsApiZtLed']['acquireType'] ? `IsApiZtLed.acquireType&渣土车配置/外屏参数/采集类型&${this.acquireTypeJson[val['acquireType']]}` : '';
                this.formData['IsApiZtLed.lightAdjust'] = val['lightAdjust'] != this.copyForm['IsApiZtLed']['lightAdjust'] ? `IsApiZtLed.lightAdjust&渣土车配置/外屏参数/外屏亮度调节&${this.lightAdjustJson[val['lightAdjust']]}` : ''
                this.formData['IsApiZtLed.showMask'] = val['showMask'] != this.copyForm['IsApiZtLed']['showMask'] ? `IsApiZtLed.showMask&渣土车配置/外屏参数/显示掩码&${val['showMask']}` : '';
                this.formData['IsApiZtLed.advertShowCtrl'] = val['advertShowCtrl'] != this.copyForm['IsApiZtLed']['advertShowCtrl'] ? `IsApiZtLed.advertShowCtrl&渣土车配置/外屏参数/广告显示控制&${this.advertShowCtrlJson[val['advertShowCtrl']]}` : ''
                this.formData['IsApiZtLed.checkTime'] = val['checkTime'] != this.copyForm['IsApiZtLed']['checkTime'] ? `IsApiZtLed.checkTime&渣土车配置/外屏参数/稽查时间&${val['checkTime']}` : '';
              }else{
                this.formData['IsApiZtLed.acquireType'] = '';
                this.formData['IsApiZtLed.lightAdjust'] = '';
                this.formData['IsApiZtLed.showMask'] = '';
                this.formData['IsApiZtLed.advertShowCtrl'] = '';
                this.formData['IsApiZtLed.checkTime'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    }
  },
  data(){
    return{
      form:{},
      copyForm:{},
      formData:{},
      acquireTypes:[],
      acquireTypeJson:{},
      lightAdjusts:[],
      lightAdjustJson:{},
      advertShowCtrls:[],
      advertShowCtrlJson:{},
      checkNumber :function (rule, value, callback) {
        if (value!=='' && value!==null && value!==undefined) {
            if (!validateNum(value)) {
                callback(new Error("请输入正确的整数"));
            } else if(value<this.min){
              callback(new Error(`最小值为${this.min}`));
            } else if(value>this.max){
              callback(new Error(`最大值为${this.max}`));
            } else {
              callback();
            }
        } else {
            // callback(new Error("请输入"));
            callback();
        }
      },
    }
  },
  created(){
    // this.form = Object.assign({}, this.form, this.forms)
  },
  methods:{
    getDeviceConfigParamsByIsApi(){
      if(this.isTemplate == 'true'){
        this.makeDictionary(this.form['IsApiZtLedCapability']['acquireType'],this.form['IsApiZtLedCapability']['lightAdjust'],this.form['IsApiZtLedCapability']['advertShowCtrl'])
        return
      }
      if(this.form['IsApiZtLed']){
        this.makeDictionary(this.form['IsApiZtLedCapability']['acquireType'],this.form['IsApiZtLedCapability']['lightAdjust'],this.form['IsApiZtLedCapability']['advertShowCtrl'])
      }
      const params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiZtLed']
      };
      this.$api.getDeviceConfigParamsByIsApi(params).then(res =>{
        if(res.success && !JSON.parse(res.data)['IsApiZtLed']['statusCode']){
          let resData = JSON.parse(res.data);
          this.makeDictionary(resData['IsApiZtLedCapability']['acquireType'],resData['IsApiZtLedCapability']['lightAdjust'],resData['IsApiZtLedCapability']['advertShowCtrl'])
          this.form = Object.assign({}, this.form, JSON.parse(res.data));
          this.copyForm = Object.assign({}, this.copyForm, JSON.parse(res.data));
        }else{
            this.$message.error('获取设备配置参数失败:' + (res.msg
                                        ? res.msg
                                        : this.getErrMsg(
                                            JSON.parse(res.data)['IsApiZtLed']['statusCode']
                                          )))
        }
      })
    },
    getErrMsg(code) {
            let obj = {
                2: "设备忙",
                3: "设备错误",
                4: "无效操作",
                5: "无效的Xml格式",
                6: "无效的Xml内容",
                7: "需要重启",
            };
            return obj[Number(code)];
        },
    //使能转换
    makeDictionary(acquireTypes,lightAdjusts,advertShowCtrls){
      this.acquireTypes = [];
      this.lightAdjusts = [];
      this.advertShowCtrls = [];
      this.acquireTypeJson = {};
      this.lightAdjustJson = {};
      this.advertShowCtrlJson = {};
      if(acquireTypes.length){
        acquireTypes.forEach(item =>{
          switch(item){
            case 0:
              this.acquireTypes.push({
                id:item,
                label:'串口'
              })
              this.acquireTypeJson[item] = '串口'
            break;
            case 1:
              this.acquireTypes.push({
                id:item,
                label:'can'
              })
              this.acquireTypeJson[item] = 'can'
            break;
            case 2:
              this.acquireTypes.push({
                id:item,
                label:'网口'
              })
              this.acquireTypeJson[item] = '网口'
            break;
          }
        })
      }
      if(lightAdjusts.length){
        lightAdjusts.forEach(item =>{
          switch(item){
            case 0:
              this.lightAdjusts.push({
                id:item,
                label:'固定模式'
              })
              this.lightAdjustJson[item] = '固定模式'
            break;
            case 1:
              this.lightAdjusts.push({
                id:item,
                label:'昼夜模式'
              })
              this.lightAdjustJson[item] = '昼夜模式'
            break;
            case 2:
              this.lightAdjusts.push({
                id:item,
                label:'灯光模式'
              })
              this.lightAdjustJson[item] = '灯光模式'
            break;
          }
        })
      }
      if(advertShowCtrls.length){
        advertShowCtrls.forEach(item =>{
          switch(item){
            case 0:
              this.advertShowCtrls.push({
                id:item,
                label:'立即广告'
              })
              this.advertShowCtrlJson[item] = '立即广告'
            break;
            case 1:
              this.advertShowCtrls.push({
                id:item,
                label:'存储消息'
              })
              this.advertShowCtrlJson[item] = '存储消息'
            break
          }
        })
      }
    }
  }

}
</script>
