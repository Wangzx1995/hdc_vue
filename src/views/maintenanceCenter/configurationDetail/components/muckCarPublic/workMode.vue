<template>
   <div class="p-a-md">
    <h2 id="title" v-if="form['IsApiZtWorkMode']">基本信息</h2>
    <el-form
      ref="PublicWorkMode"
      label-position="top"
      :model="form"
      label-width="120px"
      v-if="form['IsApiZtWorkMode']" 
    >
      <el-row type="flex" justify="space-between">
          <el-col :span="7">
            <el-form-item label="工作模式" class="m-r-md p-r">
                <el-select v-model="form['IsApiZtWorkMode'].workMode">
                  <el-option 
                    v-for="item in formModelList"
                    :key="item.id"
                    :value="Number(item.id)"
                    :label="item.label"
                  ></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7"></el-col>
          <el-col :span="7"></el-col>
          </el-row>
    </el-form>
  </div>
</template>
<script>
import { validateNum } from '@/utils/validate'

export default {
  name:'workMode',
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
        if(!val){
          this.getDeviceConfigParamsByIsApi();
        }
        if(this.isTemplate == 'true'){
          this.getDeviceConfigParamsByIsApi();
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
    'form.IsApiZtWorkMode':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiZtWorkMode.workMode'] = val['workMode'] != this.copyForm['IsApiZtWorkMode']['workMode'] ? `IsApiZtWorkMode.workMode&渣土车配置/工作模式/工作模式&${this.formModelJson[val['workMode']]}` : '';
        }else{
          this.formData['IsApiZtWorkMode.workMode'] = '';
        }
        this.$emit('changeData',this.formData)
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
      formModelList:[],
      formModelJson:{},
    }
  },
  created(){
    // this.form = Object.assign({}, this.form, this.forms)
  },
  methods:{
    getDeviceConfigParamsByIsApi(){
      if(this.isTemplate == 'true'){
        this.makeDictionary(this.form['IsApiZtWorkModeCapability']['workModeList'])
        return
      }
      if(this.form['IsApiZtWorkMode']){
        this.makeDictionary(this.form['IsApiZtWorkModeCapability']['workModeList'])
      }
      const params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiZtWorkMode']
      }
      this.$api.getDeviceConfigParamsByIsApi(params).then(res =>{
        if(res.success && !JSON.parse(res.data)['IsApiZtWorkMode']['statusCode']){
          let resData = JSON.parse(res.data);
          if(resData['IsApiZtWorkModeCapability']['workModeList'].length){
            this.makeDictionary(resData['IsApiZtWorkModeCapability']['workModeList'])
          }
          this.form = Object.assign({}, this.form, JSON.parse(res.data));
          this.copyForm = Object.assign({}, this.copyForm, JSON.parse(res.data)); 
        }else{
          this.$message.error('获取设备配置参数失败:' + (res.msg
                                        ? res.msg
                                        : this.getErrMsg(
                                            JSON.parse(res.data)['IsApiZtWorkMode']['statusCode']
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
    makeDictionary(workModeList){
      this.formModelList = [];
      this.formModelJson = {};
      workModeList.forEach(item =>{
        switch(item){
          case 0:
            this.formModelList.push({
              id:item,
              label:'正常模式'
            })
            this.formModelJson[item] = '正常模式';
          break;
          case 1:
            this.formModelList.push({
              id:item,
              label:'调试模式'
            })
            this.formModelJson[item] = '调试模式';
          break;
          case 2:
            this.formModelList.push({
              id:item,
              label:'演示模式'
            })
            this.formModelJson[item] = '演示模式';
          break;
          default:
            this.formModelList.push({
              id:3,
              label:'其它模式'
            })
            this.formModelJson[item] = '其它模式';
          break;
        }
      })
    }
  }

}
</script>
<style lang='less' scoped>
  #title{
    margin-bottom: 5px;
  }
</style>