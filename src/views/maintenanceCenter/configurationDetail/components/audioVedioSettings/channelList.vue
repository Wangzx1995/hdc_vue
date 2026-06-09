<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
        <el-form
            ref="ChannelList"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
         <div  class="channel-edit">
                <el-row class="b-t b-b" style="background-color: #f2f2f2;height:38px;display: flex;align-items: center;">
                    <el-col :span="5" class="text-center">通道类型</el-col>
                    <el-col :span="5" class="text-center">物理通道号</el-col>
                    <el-col :span="5" class="text-center">逻辑通道号</el-col>
                    <el-col :span="5" class="text-center">是否连接云台</el-col>
                    <el-col :span="4" class="text-center">操作</el-col>
                </el-row>
                <template v-for="(item, index) in form['0076'].mediaChannelList" >
                    <el-row :key="index" class="b-t b-b p-y-xs">
                      <el-col :span="5" class="p-r-sm text-center">
                          <el-select v-model="item.channelType">
                            <el-option :value="0" label="音视频"></el-option>
                            <el-option :value="1" label="音频"></el-option>
                            <el-option :value="2" label="视频"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="5" class="p-r-sm text-center">
                          <el-form-item :rules="{ validator: checkNumber.bind({type:'byte',min:1,max:16}), trigger: 'blur' }" :prop="'0076.mediaChannelList.' + index + '.physicChannelNum'">
                            <el-input v-model="item.physicChannelNum"></el-input>
                          </el-form-item >
                        </el-col>
                        <el-col :span="5"  class="text-center">
                          <el-form-item :rules="{ validator: checkNumber.bind({type:'byte',min:1,max:16}), trigger: 'blur' }" :prop="'0076.mediaChannelList.' + index + '.logicChannelNum'">
                            <el-input v-model="item.logicChannelNum" ></el-input>
                          </el-form-item >
                        </el-col>
                        <el-col :span="5"  class="text-center">
                          <el-switch v-model="item.isConnectCloudPlatform" size="mini" :active-value="1" :inactive-value="0"></el-switch>
                        </el-col>
                        
                        <el-col :span="4"  class="text-center">
                          <el-button @click="deleteItem(index)" icon="el-icon-delete" />
                        </el-col>
                    </el-row>
                </template>
                <div @click="addVedioChannel"  class="channel-add p-y-sm">
                  <span>+</span><span class="m-l">添加</span>
                </div>
              </div>
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
    return {
      form:{},
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
  methods:{
    deleteItem(index){
        this.form['0076'].mediaChannelList.splice(index,1);
      },
      addVedioChannel(){
        if(this.form['0076'].mediaChannelList.length>=16){
          this.$message.warning('最多允许添加16个通道！')
          return
        }
        this.form['0076'].mediaChannelList.push(
          {
            physicChannelNum:0,
            logicChannelNum:0,
            channelType:0,
            isConnectCloudPlatform:0,
          }
        )
      }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
    /deep/ .el-input,.el-select {
      width: 100%;
  }
  /deep/ .el-form-item {
    // margin-bottom: 0!important;
  }
  .channel-add{
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f2f2f2;
    cursor:pointer;
  }
}
</style>