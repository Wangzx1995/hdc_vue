<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
        <el-form
            ref="AlarmAbility"
            label-position="top"
            :model="form"
            label-width="260px"
            content-width="260px"
            style="margin-top: 10px"
        >
          <div class="configurations">
            <div v-if="form['007A']" class="configuration-item">
              <el-form-item label="视频信号丢失报警" >
                  <el-select v-model="form['007A'].videoSignalLost">
                    <el-option label="关闭" :value="0"></el-option>
                    <el-option label="启用" :value="1"></el-option>
                  </el-select>
              </el-form-item>
            </div>
            <div v-if="form['007A']" class="configuration-item">
              <el-form-item label="视频信号遮挡报警" >
                  <el-select v-model="form['007A'].videoSignalBlock">
                    <el-option label="关闭" :value="0"></el-option>
                    <el-option label="启用" :value="1"></el-option>
                  </el-select>
              </el-form-item>
            </div>
            <div v-if="form['007A']" class="configuration-item">
              <el-form-item label="存储单元故障报警" >
                  <el-select v-model="form['007A'].storeUnitFault">
                    <el-option label="关闭" :value="0"></el-option>
                    <el-option label="启用" :value="1"></el-option>
                  </el-select>
              </el-form-item>
            </div>
            <div v-if="form['007A']" class="configuration-item">
              <el-form-item label="其他视频设备故障报警" >
                  <el-select v-model="form['007A'].deviceVideoFault">
                    <el-option label="关闭" :value="0"></el-option>
                    <el-option label="启用" :value="1"></el-option>
                  </el-select>
              </el-form-item>
            </div>
            <div v-if="form['007A']" class="configuration-item">
              <el-form-item label="客车超员报警" >
                  <el-select v-model="form['007A'].busOverMan">
                    <el-option label="关闭" :value="0"></el-option>
                    <el-option label="启用" :value="1"></el-option>
                  </el-select>
              </el-form-item>
            </div>
            <div v-if="form['007A']" class="configuration-item">
              <el-form-item label="异常驾驶行为报警" >
                  <el-select v-model="form['007A'].exceptionDrive">
                    <el-option label="关闭" :value="0"></el-option>
                    <el-option label="启用" :value="1"></el-option>
                  </el-select>
              </el-form-item>
            </div>
            <div v-if="form['007A']" class="configuration-item">
              <el-form-item label="特殊报警录像达到存储阈值报警" >
                  <el-select v-model="form['007A'].videoReachStoreThreshold">
                    <el-option label="关闭" :value="0"></el-option>
                    <el-option label="启用" :value="1"></el-option>
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
                <el-col :span="7" >
                    
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
      form:{}
    }
  },
}
</script>

<style scoped>

</style>