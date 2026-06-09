<template>
    <div class="p-a-md">
        <!-- <div style="width: 100%;height: 500px;border: 2px solid #1a1a1a;" >
            预览画面区域
        </div> -->
        <el-form
            ref="PreviewSetting"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 15px"
            :rules="rules"
        >
          <div class="configurations">
            <div v-if="form['0070']" class="configuration-item">
              <el-form-item prop="0070.quality" label="图像/视频质量（1为最优）">
                           <el-slider v-model="form['0070'].quality" :min="0" :max="10" :step="1" show-input></el-slider>
                    </el-form-item>
            </div>
            <div v-if="form['0071']" class="configuration-item">
              <el-form-item prop="0071.brightness"  label="亮度（0-255）">
                            <el-slider v-model="form['0071'].brightness" :min="0" :max="255" :step="1" show-input></el-slider>
                    </el-form-item>
            </div>
            <div v-if="form['0072']" class="configuration-item">
              <el-form-item prop="0072.contrast" label="对比度（0-127）">
                            <el-slider v-model="form['0072'].contrast" :min="0" :max="127" :step="1" show-input></el-slider>
                    </el-form-item>
            </div>
            <div v-if="form['0073']" class="configuration-item">
              <el-form-item prop="0073.degreeOfSaturation" label="饱和度（0-127）">
                            <el-slider v-model="form['0073'].degreeOfSaturation" :min="0" :max="127" :step="1" show-input></el-slider>
                    </el-form-item>
            </div>
            <div v-if="form['0074']" class="configuration-item">
              <el-form-item prop="0074.chroma" label="色度（0-255）">
                            <el-slider v-model="form['0074'].chroma" :min="0" :max="255" :step="1" show-input></el-slider>
                    </el-form-item>
            </div>
          </div>
            <el-row type="flex" justify="space-between">
                <!-- <el-col :span="7" >
                    
                </el-col>
                <el-col :span="7" >
                    
                </el-col>
                <el-col :span="7" >
                    
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="7">
                    
                </el-col>
                <el-col :span="7" >
                    
                </el-col>
                <el-col :span="7" > -->
                    <!-- <el-form-item label="镜像" class="m-r-md">
                        <el-button type="default">左右翻转</el-button>
                        <el-button type="default">上下翻转</el-button>
                    </el-form-item> -->
                <!-- </el-col> -->
            </el-row>
         <!--   <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="OSD叠加" class="m-r-md">
                        <el-select v-model="form.osd"></el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7"></el-col>
                <el-col :span="7"></el-col>
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
      rules: {
        // '0070.quality':[{ required: true, type:'number', message: '请选择', trigger: 'change' }],
        // '0071.brightness':[{ required: true, type:'number', message: '请选择', trigger: 'change' }],
        // '0072.contrast':[{ required: true, type:'number', message: '请选择', trigger: 'change' }],
        // '0073.degreeOfSaturation':[{ required: true, type:'number', message: '请选择', trigger: 'change' }],
        // '0074.chroma':[{ required: true, type:'number', message: '请选择', trigger: 'change' }],
      }
    }
  },
}
</script>

<style scoped>

</style>