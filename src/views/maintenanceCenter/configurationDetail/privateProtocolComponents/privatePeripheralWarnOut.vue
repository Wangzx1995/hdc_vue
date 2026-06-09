<template>
  <div class="p-a-md">
    <el-form ref="PrivatealarmOutputForm" label-position="top" :model="form" label-width="120px" style="margin-top: 10px">
      <el-tabs v-model="activeChannel" :before-leave="beforeLeave" @tab-click="getPrivateProcotol(activeChannel)">
        <el-tab-pane v-for="(item,index) in deviceCapability['peripheral_warn_out']['alarmOutput']" :key="index" :name="item['chanNo']+''" :label="'通道'+item['chanNo']">
          <template v-if="form['param948_'+activeChannel]">
            <div class="configurations">
              <div v-if="item" class="configuration-item">
                <el-form-item label="报警使能">
                  <el-switch v-model="form['param948_'+activeChannel]['list'][0].enable" :active-value="Number(1)" :inactive-value="Number(0)"></el-switch>
                </el-form-item>
              </div>
              <div v-if="item && item['deviceList'] && item['deviceList'].length > 0" class="configuration-item">
                <el-form-item label="报警器类型">
                 <el-select v-model="form['param948_'+activeChannel]['list'][0].alarmIndex">
                    <el-option 
                    v-for="item_ in item['deviceList']"
                    :key="item_.alarmIndex"
                    :value="item_.alarmIndex"
                    :label="item_.name"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import {validateNum} from '@/utils/validate';
export default {
  props:{
    allCapability:{
      type: Object,
      default:()=>{
        return {}
      }
    },
    formDetail:{
      type:Object,
      default:() =>{
        return {}
      }
    },
    originalForm:{
      type:Object,
      default:() =>{
        return {}
      }
    },
    setStatisticsData:{
      type:Object,
      default:() =>{
        return {}
      }
    },
    allEnumerationData:{
      type:Object,
      default:() =>{
        return {}
      }
    },
    setConfigParams:{
      type:Boolean,
      default:false
    },
    isTemplate:{
      type:String
    }
  },
  watch:{
    allCapability:{
     handler(val){
        if(val){
          console.log(val)
          this.deviceCapability = val;
          this.activeChannel = String(val['peripheral_warn_out']['alarmOutput'][0]['chanNo']);
        }
      },
      deep: true,
      immediate: true
    },
    formDetail:{
     handler(val){
       if(val){
         this.form = val
        }
      },
      deep: true,
      immediate: true
    },
    originalForm:{
        handler(val){
        if(val){
          this.copyForm = val
        }
      },
      deep: true,
      immediate: true
    },
    form:{
      handler (val) {
        if (val){
          this.$emit('change',val)
        }
      },
      deep: true,
      immediate:true,
    },
    copyForm:{
      handler(val) {
        if (val){
          this.$emit('changeCopy',val)
        }
      },
      deep: true,
      immediate:false,
    },
    setStatisticsData:{
      handler(val){
        if(val){
          this.formData = val
        }
      },
      deep: true,
      immediate: true
    },
    allEnumerationData:{
      handler(val){
        if(val){
          this.dictionaryData = val
        }
      },
      deep: true,
      immediate: true
    },
    setConfigParams:{
      handler(val){
        if(val){
          this.childConfigParams = val;
          this.getPrivateProcotol(this.activeChannel)
        }
      },
      deep: true,
      immediate: true
    },
    childConfigParams:{
      handler(val){
        this.$emit('changeConfigParams',val)
      },
      deep: true,
      immediate: true
    },
    
    'form.param948_1':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          //['list'][0].enable
          this.formData['param948_1.list.0.enable.useless.useless.useless'] = val['list'][0]['enable'] !== this.copyForm['param948_1']['list'][0]['enable'] ? `param948_1.list.0.enable.useless.useless.useless&外设输出设置/声光报警器/通道1/报警使能&${val['list'][0]['enable'] ? '开启' : '关闭'}&${this.copyForm['param948_1']['list'][0]['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param948_1.list.0.alarmIndex.useless.useless.useless'] = val['list'][0]['alarmIndex'] !== this.copyForm['param948_1']['list'][0]['alarmIndex'] ? `param948_1.list.0.alarmIndex.useless.useless.useless&外设输出设置/声光报警器/通道1/报警使能&${this.alarmDic[this.activeChannel][val['list'][0]['alarmIndex']]}&${this.alarmDic[this.activeChannel][this.copyForm['param948_1']['list'][0]['alarmIndex']]}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param948_2':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          //['list'][0].enable
          this.formData['param948_2.list.0.enable.useless.useless.useless'] = val['list'][0]['enable'] !== this.copyForm['param948_2']['list'][0]['enable'] ? `param948_2.list.0.enable.useless.useless.useless&外设输出设置/声光报警器/通道2/报警使能&${val['list'][0]['enable'] ? '开启' : '关闭'}&${this.copyForm['param948_2']['list'][0]['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param948_2.list.0.alarmIndex.useless.useless.useless'] = val['list'][0]['alarmIndex'] !== this.copyForm['param948_2']['list'][0]['alarmIndex'] ? `param948_2.list.0.alarmIndex.useless.useless.useless&外设输出设置/声光报警器/通道2/报警使能&${this.alarmDic[this.activeChannel][val['list'][0]['alarmIndex']]}&${this.alarmDic[this.activeChannel][this.copyForm['param948_2']['list'][0]['alarmIndex']]}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param948_3':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          //['list'][0].enable
          this.formData['param948_3.list.0.enable.useless.useless.useless'] = val['list'][0]['enable'] !== this.copyForm['param948_3']['list'][0]['enable'] ? `param948_3.list.0.enable.useless.useless.useless&外设输出设置/声光报警器/通道3/报警使能&${val['list'][0]['enable'] ? '开启' : '关闭'}&${this.copyForm['param948_3']['list'][0]['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param948_3.list.0.alarmIndex.useless.useless.useless'] = val['list'][0]['alarmIndex'] !== this.copyForm['param948_3']['list'][0]['alarmIndex'] ? `param948_3.list.0.alarmIndex.useless.useless.useless&外设输出设置/声光报警器/通道3/报警使能&${this.alarmDic[this.activeChannel][val['list'][0]['alarmIndex']]}&${this.alarmDic[this.activeChannel][this.copyForm['param948_3']['list'][0]['alarmIndex']]}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param948_4':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          //['list'][0].enable
          this.formData['param948_4.list.0.enable.useless.useless.useless'] = val['list'][0]['enable'] !== this.copyForm['param948_4']['list'][0]['enable'] ? `param948_4.list.0.enable.useless.useless.useless&外设输出设置/声光报警器/通道4/报警使能&${val['list'][0]['enable'] ? '开启' : '关闭'}&${this.copyForm['param948_4']['list'][0]['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param948_4.list.0.alarmIndex.useless.useless.useless'] = val['list'][0]['alarmIndex'] !== this.copyForm['param948_4']['list'][0]['alarmIndex'] ? `param948_4.list.0.alarmIndex.useless.useless.useless&外设输出设置/声光报警器/通道4/报警使能&${this.alarmDic[this.activeChannel][val['list'][0]['alarmIndex']]}&${this.alarmDic[this.activeChannel][this.copyForm['param948_4']['list'][0]['alarmIndex']]}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param948_5':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          //['list'][0].enable
          this.formData['param948_5.list.0.enable.useless.useless.useless'] = val['list'][0]['enable'] !== this.copyForm['param948_5']['list'][0]['enable'] ? `param948_5.list.0.enable.useless.useless.useless&外设输出设置/声光报警器/通道5/报警使能&${val['list'][0]['enable'] ? '开启' : '关闭'}&${this.copyForm['param948_5']['list'][0]['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param948_5.list.0.alarmIndex.useless.useless.useless'] = val['list'][0]['alarmIndex'] !== this.copyForm['param948_5']['list'][0]['alarmIndex'] ? `param948_5.list.0.alarmIndex.useless.useless.useless&外设输出设置/声光报警器/通道5/报警使能&${this.alarmDic[this.activeChannel][val['list'][0]['alarmIndex']]}&${this.alarmDic[this.activeChannel][this.copyForm['param948_5']['list'][0]['alarmIndex']]}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param948_6':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          //['list'][0].enable
          this.formData['param948_6.list.0.enable.useless.useless.useless'] = val['list'][0]['enable'] !== this.copyForm['param948_6']['list'][0]['enable'] ? `param948_6.list.0.enable.useless.useless.useless&外设输出设置/声光报警器/通道6/报警使能&${val['list'][0]['enable'] ? '开启' : '关闭'}&${this.copyForm['param948_5']['list'][0]['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param948_6.list.0.alarmIndex.useless.useless.useless'] = val['list'][0]['alarmIndex'] !== this.copyForm['param948_6']['list'][0]['alarmIndex'] ? `param948_6.list.0.alarmIndex.useless.useless.useless&外设输出设置/声光报警器/通道6/报警使能&${this.alarmDic[this.activeChannel][val['list'][0]['alarmIndex']]}&${this.alarmDic[this.activeChannel][this.copyForm['param948_6']['list'][0]['alarmIndex']]}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param948_7':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          //['list'][0].enable
          this.formData['param948_7.list.0.enable.useless.useless.useless'] = val['list'][0]['enable'] !== this.copyForm['param948_7']['list'][0]['enable'] ? `param948_7.list.0.enable.useless.useless.useless&外设输出设置/声光报警器/通道7/报警使能&${val['list'][0]['enable'] ? '开启' : '关闭'}&${this.copyForm['param948_7']['list'][0]['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param948_7.list.0.alarmIndex.useless.useless.useless'] = val['list'][0]['alarmIndex'] !== this.copyForm['param948_7']['list'][0]['alarmIndex'] ? `param948_7.list.0.alarmIndex.useless.useless.useless&外设输出设置/声光报警器/通道7/报警使能&${this.alarmDic[this.activeChannel][val['list'][0]['alarmIndex']]}&${this.alarmDic[this.activeChannel][this.copyForm['param948_7']['list'][0]['alarmIndex']]}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param948_8':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          //['list'][0].enable
          this.formData['param948_8.list.0.enable.useless.useless.useless'] = val['list'][0]['enable'] !== this.copyForm['param948_8']['list'][0]['enable'] ? `param948_8.list.0.enable.useless.useless.useless&外设输出设置/声光报警器/通道8/报警使能&${val['list'][0]['enable'] ? '开启' : '关闭'}&${this.copyForm['param948_8']['list'][0]['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param948_8.list.0.alarmIndex.useless.useless.useless'] = val['list'][0]['alarmIndex'] !== this.copyForm['param948_8']['list'][0]['alarmIndex'] ? `param948_8.list.0.alarmIndex.useless.useless.useless&外设输出设置/声光报警器/通道8/报警使能&${this.alarmDic[this.activeChannel][val['list'][0]['alarmIndex']]}&${this.alarmDic[this.activeChannel][this.copyForm['param948_8']['list'][0]['alarmIndex']]}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param948_9':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          //['list'][0].enable
          this.formData['param948_9.list.0.enable.useless.useless.useless'] = val['list'][0]['enable'] !== this.copyForm['param948_9']['list'][0]['enable'] ? `param948_9.list.0.enable.useless.useless.useless&外设输出设置/声光报警器/通道9/报警使能&${val['list'][0]['enable'] ? '开启' : '关闭'}&${this.copyForm['param948_9']['list'][0]['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param948_9.list.0.alarmIndex.useless.useless.useless'] = val['list'][0]['alarmIndex'] !== this.copyForm['param948_9']['list'][0]['alarmIndex'] ? `param948_9.list.0.alarmIndex.useless.useless.useless&外设输出设置/声光报警器/通道9/报警使能&${this.alarmDic[this.activeChannel][val['list'][0]['alarmIndex']]}&${this.alarmDic[this.activeChannel][this.copyForm['param948_9']['list'][0]['alarmIndex']]}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param948_10':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          //['list'][0].enable
          this.formData['param948_10.list.0.enable.useless.useless.useless'] = val['list'][0]['enable'] !== this.copyForm['param948_10']['list'][0]['enable'] ? `param948_10.list.0.enable.useless.useless.useless&外设输出设置/声光报警器/通道10/报警使能&${val['list'][0]['enable'] ? '开启' : '关闭'}&${this.copyForm['param948_10']['list'][0]['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param948_10.list.0.alarmIndex.useless.useless.useless'] = val['list'][0]['alarmIndex'] !== this.copyForm['param948_10']['list'][0]['alarmIndex'] ? `param948_10.list.0.alarmIndex.useless.useless.useless&外设输出设置/声光报警器/通道10/报警使能&${this.alarmDic[this.activeChannel][val['list'][0]['alarmIndex']]}&${this.alarmDic[this.activeChannel][this.copyForm['param948_10']['list'][0]['alarmIndex']]}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param948_11':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          //['list'][0].enable
          this.formData['param948_11.list.0.enable.useless.useless.useless'] = val['list'][0]['enable'] !== this.copyForm['param948_11']['list'][0]['enable'] ? `param948_11.list.0.enable.useless.useless.useless&外设输出设置/声光报警器/通道11/报警使能&${val['list'][0]['enable'] ? '开启' : '关闭'}&${this.copyForm['param948_11']['list'][0]['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param948_11.list.0.alarmIndex.useless.useless.useless'] = val['list'][0]['alarmIndex'] !== this.copyForm['param948_11']['list'][0]['alarmIndex'] ? `param948_11.list.0.alarmIndex.useless.useless.useless&外设输出设置/声光报警器/通道11/报警使能&${this.alarmDic[this.activeChannel][val['list'][0]['alarmIndex']]}&${this.alarmDic[this.activeChannel][this.copyForm['param948_11']['list'][0]['alarmIndex']]}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param948_12':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          //['list'][0].enable
          this.formData['param948_12.list.0.enable.useless.useless.useless'] = val['list'][0]['enable'] !== this.copyForm['param948_12']['list'][0]['enable'] ? `param948_12.list.0.enable.useless.useless.useless&外设输出设置/声光报警器/通道12/报警使能&${val['list'][0]['enable'] ? '开启' : '关闭'}&${this.copyForm['param948_12']['list'][0]['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param948_12.list.0.alarmIndex.useless.useless.useless'] = val['list'][0]['alarmIndex'] !== this.copyForm['param948_12']['list'][0]['alarmIndex'] ? `param948_12.list.0.alarmIndex.useless.useless.useless&外设输出设置/声光报警器/通道12/报警使能&${this.alarmDic[this.activeChannel][val['list'][0]['alarmIndex']]}&${this.alarmDic[this.activeChannel][this.copyForm['param948_12']['list'][0]['alarmIndex']]}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param948_13':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          //['list'][0].enable
          this.formData['param948_13.list.0.enable.useless.useless.useless'] = val['list'][0]['enable'] !== this.copyForm['param948_13']['list'][0]['enable'] ? `param948_13.list.0.enable.useless.useless.useless&外设输出设置/声光报警器/通道13/报警使能&${val['list'][0]['enable'] ? '开启' : '关闭'}&${this.copyForm['param948_13']['list'][0]['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param948_13.list.0.alarmIndex.useless.useless.useless'] = val['list'][0]['alarmIndex'] !== this.copyForm['param948_13']['list'][0]['alarmIndex'] ? `param948_13.list.0.alarmIndex.useless.useless.useless&外设输出设置/声光报警器/通道13/报警使能&${this.alarmDic[this.activeChannel][val['list'][0]['alarmIndex']]}&${this.alarmDic[this.activeChannel][this.copyForm['param948_13']['list'][0]['alarmIndex']]}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param948_14':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          //['list'][0].enable
          this.formData['param948_14.list.0.enable.useless.useless.useless'] = val['list'][0]['enable'] !== this.copyForm['param948_14']['list'][0]['enable'] ? `param948_14.list.0.enable.useless.useless.useless&外设输出设置/声光报警器/通道14/报警使能&${val['list'][0]['enable'] ? '开启' : '关闭'}&${this.copyForm['param948_14']['list'][0]['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param948_14.list.0.alarmIndex.useless.useless.useless'] = val['list'][0]['alarmIndex'] !== this.copyForm['param948_14']['list'][0]['alarmIndex'] ? `param948_14.list.0.alarmIndex.useless.useless.useless&外设输出设置/声光报警器/通道14/报警使能&${this.alarmDic[this.activeChannel][val['list'][0]['alarmIndex']]}&${this.alarmDic[this.activeChannel][this.copyForm['param948_14']['list'][0]['alarmIndex']]}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param948_15':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          //['list'][0].enable
          this.formData['param948_15.list.0.enable.useless.useless.useless'] = val['list'][0]['enable'] !== this.copyForm['param948_15']['list'][0]['enable'] ? `param948_15.list.0.enable.useless.useless.useless&外设输出设置/声光报警器/通道15/报警使能&${val['list'][0]['enable'] ? '开启' : '关闭'}&${this.copyForm['param948_15']['list'][0]['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param948_15.list.0.alarmIndex.useless.useless.useless'] = val['list'][0]['alarmIndex'] !== this.copyForm['param948_15']['list'][0]['alarmIndex'] ? `param948_15.list.0.alarmIndex.useless.useless.useless&外设输出设置/声光报警器/通道16/报警使能&${this.alarmDic[this.activeChannel][val['list'][0]['alarmIndex']]}&${this.alarmDic[this.activeChannel][this.copyForm['param948_15']['list'][0]['alarmIndex']]}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param948_16':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          //['list'][0].enable
          this.formData['param948_16.list.0.enable.useless.useless.useless'] = val['list'][0]['enable'] !== this.copyForm['param948_16']['list'][0]['enable'] ? `param948_16.list.0.enable.useless.useless.useless&外设输出设置/声光报警器/通道16/报警使能&${val['list'][0]['enable'] ? '开启' : '关闭'}&${this.copyForm['param948_16']['list'][0]['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param948_16.list.0.alarmIndex.useless.useless.useless'] = val['list'][0]['alarmIndex'] !== this.copyForm['param948_16']['list'][0]['alarmIndex'] ? `param948_16.list.0.alarmIndex.useless.useless.useless&外设输出设置/声光报警器/通道16/报警使能&${this.alarmDic[this.activeChannel][val['list'][0]['alarmIndex']]}&${this.alarmDic[this.activeChannel][this.copyForm['param948_16']['list'][0]['alarmIndex']]}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
  },
  data() {
    return {
      alarmDic:{},
      deviceId:this.$route.query.deviceId || '',
      deviceCapability:{},
      form:{},
      copyForm:{},
      formData:{},      
      dictionaryData:{},
      activeChannel:'',
      chooseType:'',
      chooseIndex:'',
      chanNoIndex:0,
      childConfigParams:false,
      checkNumber: function (rule, value, callback) {
        if (value !== '' && value !== null && value !== undefined) {
          if (!validateNum(value)) {
            callback(new Error("请输入正确的整数"));
          } else if (value < this.min) {
            callback(new Error(`最小值为${this.min}`));
          } else if (value > this.max) {
            callback(new Error(`最大值为${this.max}`));
          }else {
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
    // this.getByIsApi(1)
    //console.log(this.isTemplate)
    this.$emit('setMenuActiveRefFormName','PrivatealarmOutputForm');
    this.makeDic();
  },
  methods:{
    //生成枚举
    makeDic(){
      this.deviceCapability['peripheral_warn_out']['alarmOutput'].forEach(item =>{
        this.alarmDic[item.chanNo] = {};
        item['deviceList'].forEach(item_ =>{
          this.alarmDic[item.chanNo][item_.alarmIndex] = item_.name;

        })
      });
      console.log(this.alarmDic)
    },
    beforeLeave(){

    },
    getPrivateProcotol(activeChannel){
      this.activeChannel = activeChannel;
      if(!this.form['param948_'+activeChannel]){
        let params = {
          deviceId:this.deviceId,
          param:{
            chanNo:Number(this.activeChannel),
            type:1
          },
          msgId:948
        }
        if(Boolean(this.isTemplate)) return
        this.$api.getEHomeConfig(params).then(res =>{
          if(res && res.data && res.data.param){
            let formData = JSON.parse(res.data.param);
            formData['chanNo'] = this.activeChannel;
            this.$set(this.form,`param948_${this.activeChannel}`,formData);
            this.$set(this.copyForm,`param948_${this.activeChannel}`,JSON.parse(JSON.stringify(formData)));
            this.childConfigParams = false;
          }else{
            this.$message.error('协议获取失败');
            this.childConfigParams = false;
          }
        })
      }else{
        this.childConfigParams = false;
      }
    }
  }
 
}
</script>

<style lang="less" scoped>
  .configuration-detail-submit{
    width: 100%;
    border-right: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;
    display: flex;
    position: fixed;
    bottom: 0;
    z-index: 500;
    right: 1%;
    background: white;
  }
  .maginBottom{
    margin-bottom: 10px;
  }
</style>