<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
        <el-form
            ref="GnssSetting"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
          <div class="configurations">
            <div v-if="form['0090']" class="configuration-item">
              <el-form-item label="GPS定位">
                  <el-select v-model="form['0090'].positioningGps">
                    <el-option label="禁用" :value="0"></el-option>
                    <el-option label="启用" :value="1"></el-option>
                  </el-select>
              </el-form-item>
            </div>
            <div v-if="form['0090']" class="configuration-item">
              <el-form-item label="北斗定位">
                  <el-select v-model="form['0090'].positioningBD">
                    <el-option label="禁用" :value="0"></el-option>
                    <el-option label="启用" :value="1"></el-option>
                  </el-select>
              </el-form-item>
            </div>
            <div v-if="form['0090']" class="configuration-item">
              <el-form-item label="GLONASS定位">
                  <el-select v-model="form['0090'].positioningGlonass">
                    <el-option label="禁用" :value="0"></el-option>
                    <el-option label="启用" :value="1"></el-option>
                  </el-select>
              </el-form-item>
            </div>
            <div v-if="form['0090']" class="configuration-item">
              <el-form-item label="Galileo定位">
                <el-select v-model="form['0090'].positioningGalileo">
                  <el-option label="禁用" :value="0"></el-option>
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
      form:{},
      activeName:'first'
    }
  },
}
</script>

<style scoped>

</style>