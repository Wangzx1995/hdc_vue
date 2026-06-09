<template>
  <div class="p-a-md">
    <el-form ref="PrivateVideoForm" label-position="top" :model="form" label-width="120px" style="margin-top: 10px">
      <div id="title" class="channels">
        <p class="titleChannels">通道号和码流类型</p>
        <el-select v-model="activeChannelType" @change="getPrivateProcotol(activeChannelType)">
          <el-option
            v-for="item in tabAndConfiguration"
            :key="item.id"
            :value="item.id"
            :label="item.label"
          >
          </el-option>
        </el-select>
      </div>
        <template v-if="form['param188_'+activeChannelType]">
          <div class="configurations">
            <div v-if="deviceCapability['compress'][0]['info'][chooseIndex]['resolution'] && deviceCapability['compress'][0]['info'][chooseIndex]['resolution'].length" class="configuration-item">
              <el-form-item label="分辨率">
                <el-select v-model="form['param188_'+activeChannelType].resolution">
                  <el-option
                    v-for="item in dictionaryData['resList'+activeChannelType.split('_')[0]+'_'+activeChannelType.split('_')[1]]"
                    :key="item.id"
                    :value="item.id"
                    :label="item.label"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div v-if="deviceCapability['compress'][0]['info'][chooseIndex]['frameRate'] && deviceCapability['compress'][0]['info'][chooseIndex]['frameRate'].length" class="configuration-item">
              <el-form-item label="帧率">
                <el-select v-model="form['param188_'+activeChannelType].frameRate">
                  <el-option
                    v-for="item in deviceCapability['compress'][0]['info'][chooseIndex]['frameRate']"
                    :key="item"
                    :value="item"
                    :label="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div v-if="deviceCapability['compress'][0]['info'][chooseIndex]['encodeMode'] && deviceCapability['compress'][0]['info'][chooseIndex]['encodeMode'].length" class="configuration-item">
              <el-form-item label="视频编码格式">
                <el-select v-model="form['param188_'+activeChannelType].encodeMode">
                  <el-option
                    v-for="item in deviceCapability['compress'][0]['info'][chooseIndex]['encodeMode']"
                    :key="item"
                    :value="item"
                    :label="item ? 'H265' : 'H264'"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div v-if="deviceCapability['compress'][0]['info'][chooseIndex]['bitRate'] && deviceCapability['compress'][0]['info'][chooseIndex]['bitRate'].length" class="configuration-item">
              <el-form-item label="码率上限">
                <el-select v-model="form['param188_'+activeChannelType].bitRate">
                  <el-option
                    v-for="item in deviceCapability['compress'][0]['info'][chooseIndex]['bitRate']"
                    :key="item"
                    :value="item"
                    :label="item+'kbps'"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div v-if="deviceCapability['compress'][0]['info'][chooseIndex]['imageQuality'] && deviceCapability['compress'][0]['info'][chooseIndex]['imageQuality'].length" class="configuration-item">
              <el-form-item description="品级越高，质量越好" label="画面质量">
                <el-select v-model="form['param188_'+activeChannelType].imageQuality">
                  <el-option
                    v-for="item in deviceCapability['compress'][0]['info'][chooseIndex]['imageQuality']"
                    :key="item"
                    :value="item"
                    :label="'品级'+item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </template>
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
          this.deviceCapability = val
          this.makeTabList()
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
          this.getPrivateProcotol(this.activeChannelType)
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
    'form.param188_1_0':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param188_1_0.resolution'] = val['resolution'] !== this.copyForm['param188_1_0']['resolution'] ? `param188_1_0.resolution&报警设置/通道1主码流/分辨率&${this.dictionaryData['resJson1_0'][val['resolution']]}&${this.dictionaryData['resJson1_0'][this.copyForm['param188_1_0']['resolution']]}` : '';
          this.formData['param188_1_0.frameRate'] = val['frameRate'] !== this.copyForm['param188_1_0']['frameRate'] ? `param188_1_0.frameRate&报警设置/通道1主码流/帧率&${val['frameRate']}&${this.copyForm['param188_1_0']['frameRate']}` : '';
          this.formData['param188_1_0.encodeMode'] = val['encodeMode'] !== this.copyForm['param188_1_0']['encodeMode'] ? `param188_1_0.encodeMode&报警设置/通道1主码流/视频编码格式&${val['encodeMode'] ? 'H265' : 'H264'}&${this.copyForm['param188_1_0']['encodeMode'] ? 'H265' : 'H264'}` : '';
          this.formData['param188_1_0.bitRate'] = val['bitRate'] !== this.copyForm['param188_1_0']['bitRate'] ? `param188_1_0.bitRate&报警设置/通道1主码流/码率上限&${val['bitRate']}&${this.copyForm['param188_1_0']['bitRate']}` : '';
          this.formData['param188_1_0.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_1_0']['imageQuality'] ? `param188_1_0.imageQuality&报警设置/通道1主码流/图像质量&品级${val['imageQuality']}&品级${this.copyForm['param188_1_0']['imageQuality']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param188_1_1':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param188_1_1.resolution'] = val['resolution'] !== this.copyForm['param188_1_1']['resolution'] ? `param188_1_1.resolution&报警设置/通道1子码流/分辨率&${this.dictionaryData['resJson1_1'][val['resolution']]}&${this.dictionaryData['resJson1_1'][this.copyForm['param188_1_1']['resolution']]}` : '';
          this.formData['param188_1_1.frameRate'] = val['frameRate'] !== this.copyForm['param188_1_1']['frameRate'] ? `param188_1_1.frameRate&报警设置/通道1子码流/帧率&${val['frameRate']}&${this.copyForm['param188_1_1']['frameRate']}` : '';
          this.formData['param188_1_1.encodeMode'] = val['encodeMode'] !== this.copyForm['param188_1_1']['encodeMode'] ? `param188_1_1.encodeMode&报警设置/通道1子码流/视频编码格式&${val['encodeMode'] ? 'H265' : 'H264'}&${this.copyForm['param188_1_1']['encodeMode'] ? 'H265' : 'H264'}` : '';
          this.formData['param188_1_1.bitRate'] = val['bitRate'] !== this.copyForm['param188_1_1']['bitRate'] ? `param188_1_1.bitRate&报警设置/通道1子码流/码率上限&${val['bitRate']}&${this.copyForm['param188_1_1']['bitRate']}` : '';
          this.formData['param188_1_1.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_1_1']['imageQuality'] ? `param188_1_1.imageQuality&报警设置/通道1子码流/图像质量&品级${val['imageQuality']}&品级${this.copyForm['param188_1_0']['imageQuality']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param188_2_0':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param188_2_0.resolution'] = val['resolution'] !== this.copyForm['param188_2_0']['resolution'] ? `param188_2_0.resolution&报警设置/通道2主码流/分辨率&${this.dictionaryData['resJson2_0'][val['resolution']]}&${this.dictionaryData['resJson2_0'][this.copyForm['param188_2_0']['resolution']]}` : '';
          this.formData['param188_2_0.frameRate'] = val['frameRate'] !== this.copyForm['param188_2_0']['frameRate'] ? `param188_2_0.frameRate&报警设置/通道2主码流/帧率&${val['frameRate']}&${this.copyForm['param188_2_0']['frameRate']}` : '';
          this.formData['param188_2_0.encodeMode'] = val['encodeMode'] !== this.copyForm['param188_2_0']['encodeMode'] ? `param188_2_0.encodeMode&报警设置/通道2主码流/视频编码格式&${val['encodeMode'] ? 'H265' : 'H264'}&${this.copyForm['param188_2_0']['encodeMode'] ? 'H265' : 'H264'}` : '';
          this.formData['param188_2_0.bitRate'] = val['bitRate'] !== this.copyForm['param188_2_0']['bitRate'] ? `param188_2_0.bitRate&报警设置/通道2主码流/码率上限&${val['bitRate']}&${this.copyForm['param188_2_0']['bitRate']}` : '';
          this.formData['param188_2_0.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_2_0']['imageQuality'] ? `param188_2_0.imageQuality&报警设置/通道2主码流/图像质量&品级${val['imageQuality']}&品级${this.copyForm['param188_1_0']['imageQuality']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param188_2_1':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param188_2_1.resolution'] = val['resolution'] !== this.copyForm['param188_2_1']['resolution'] ? `param188_2_1.resolution&报警设置/通道2子码流/分辨率&${this.dictionaryData['resJson2_1'][val['resolution']]}&${this.dictionaryData['resJson2_1'][this.copyForm['param188_2_1']['resolution']]}` : '';
          this.formData['param188_2_1.frameRate'] = val['frameRate'] !== this.copyForm['param188_2_1']['frameRate'] ? `param188_2_1.frameRate&报警设置/通道2子码流/帧率&${val['frameRate']}&${this.copyForm['param188_2_1']['frameRate']}` : '';
          this.formData['param188_2_1.encodeMode'] = val['encodeMode'] !== this.copyForm['param188_2_1']['encodeMode'] ? `param188_2_1.encodeMode&报警设置/通道2子码流/视频编码格式&${val['encodeMode'] ? 'H265' : 'H264'}&${this.copyForm['param188_2_1']['encodeMode'] ? 'H265' : 'H264'}` : '';
          this.formData['param188_2_1.bitRate'] = val['bitRate'] !== this.copyForm['param188_2_1']['bitRate'] ? `param188_2_1.bitRate&报警设置/通道2子码流/码率上限&${val['bitRate']}&${this.copyForm['param188_2_1']['bitRate']}` : '';
          this.formData['param188_2_1.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_2_1']['imageQuality'] ? `param188_2_1.imageQuality&报警设置/通道2子码流/图像质量&品级${val['imageQuality']}&品级${this.copyForm['param188_1_0']['imageQuality']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param188_3_0':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param188_3_0.resolution'] = val['resolution'] !== this.copyForm['param188_3_0']['resolution'] ? `param188_3_0.resolution&报警设置/通道3主码流/分辨率&${this.dictionaryData['resJson3_0'][val['resolution']]}&${this.dictionaryData['resJson3_0'][this.copyForm['param188_3_0']['resolution']]}` : '';
          this.formData['param188_3_0.frameRate'] = val['frameRate'] !== this.copyForm['param188_3_0']['frameRate'] ? `param188_3_0.frameRate&报警设置/通道3主码流/帧率&${val['frameRate']}&${this.copyForm['param188_3_0']['frameRate']}` : '';
          this.formData['param188_3_0.encodeMode'] = val['encodeMode'] !== this.copyForm['param188_3_0']['encodeMode'] ? `param188_3_0.encodeMode&报警设置/通道3主码流/视频编码格式&${val['encodeMode'] ? 'H265' : 'H264'}&${this.copyForm['param188_3_0']['encodeMode'] ? 'H265' : 'H264'}` : '';
          this.formData['param188_3_0.bitRate'] = val['bitRate'] !== this.copyForm['param188_3_0']['bitRate'] ? `param188_3_0.bitRate&报警设置/通道3主码流/码率上限&${val['bitRate']}&${this.copyForm['param188_3_0']['bitRate']}` : '';
          this.formData['param188_3_0.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_3_0']['imageQuality'] ? `param188_3_0.imageQuality&报警设置/通道3主码流/图像质量&品级${val['imageQuality']}&品级${this.copyForm['param188_1_0']['imageQuality']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param188_3_1':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param188_3_1.resolution'] = val['resolution'] !== this.copyForm['param188_3_1']['resolution'] ? `param188_3_1.resolution&报警设置/通道3子码流/分辨率&${this.dictionaryData['resJson3_1'][val['resolution']]}&${this.dictionaryData['resJson3_1'][this.copyForm['param188_2_1']['resolution']]}` : '';
          this.formData['param188_3_1.frameRate'] = val['frameRate'] !== this.copyForm['param188_3_1']['frameRate'] ? `param188_3_1.frameRate&报警设置/通道3子码流/帧率&${val['frameRate']}&${this.copyForm['param188_3_1']['frameRate']}` : '';
          this.formData['param188_3_1.encodeMode'] = val['encodeMode'] !== this.copyForm['param188_3_1']['encodeMode'] ? `param188_3_1.encodeMode&报警设置/通道3子码流/视频编码格式&${val['encodeMode'] ? 'H265' : 'H264'}&${this.copyForm['param188_3_1']['encodeMode'] ? 'H265' : 'H264'}` : '';
          this.formData['param188_3_1.bitRate'] = val['bitRate'] !== this.copyForm['param188_3_1']['bitRate'] ? `param188_3_1.bitRate&报警设置/通道3子码流/码率上限&${val['bitRate']}&${this.copyForm['param188_3_1']['bitRate']}` : '';
          this.formData['param188_3_1.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_3_1']['imageQuality'] ? `param188_3_1.imageQuality&报警设置/通道3子码流/图像质量&品级${val['imageQuality']}&品级${this.copyForm['param188_1_0']['imageQuality']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param188_4_0':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param188_4_0.resolution'] = val['resolution'] !== this.copyForm['param188_4_0']['resolution'] ? `param188_4_0.resolution&报警设置/通道4主码流/分辨率&${this.dictionaryData['resJson4_0'][val['resolution']]}&${this.dictionaryData['resJson4_0'][this.copyForm['param188_3_0']['resolution']]}` : '';
          this.formData['param188_4_0.frameRate'] = val['frameRate'] !== this.copyForm['param188_4_0']['frameRate'] ? `param188_4_0.frameRate&报警设置/通道4主码流/帧率&${val['frameRate']}&${this.copyForm['param188_4_0']['frameRate']}` : '';
          this.formData['param188_4_0.encodeMode'] = val['encodeMode'] !== this.copyForm['param188_4_0']['encodeMode'] ? `param188_4_0.encodeMode&报警设置/通道4主码流/视频编码格式&${val['encodeMode'] ? 'H265' : 'H264'}&${this.copyForm['param188_4_0']['encodeMode'] ? 'H265' : 'H264'}` : '';
          this.formData['param188_4_0.bitRate'] = val['bitRate'] !== this.copyForm['param188_4_0']['bitRate'] ? `param188_4_0.bitRate&报警设置/通道4主码流/码率上限&${val['bitRate']}&${this.copyForm['param188_4_0']['bitRate']}` : '';
          // this.formData['param188_4_0.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_4_0']['imageQuality'] ? `param188_4_0.imageQuality&报警设置/通道4主码流/图像质量&${val['imageQuality'] ? val['imageQuality'] == 1 ? '好' : '一般' : '极好'}&${this.copyForm['param188_4_0']['imageQuality'] ? this.copyForm['param188_4_0']['imageQuality'] == 1 ? '好' : '一般' : '极好'}` : '';
           this.formData['param188_4_0.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_4_0']['imageQuality'] ? `param188_4_0.imageQuality&报警设置/通道4主码流/图像质量&品级${val['imageQuality']}&品级${this.copyForm['param188_1_0']['imageQuality']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param188_4_1':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param188_4_1.resolution'] = val['resolution'] !== this.copyForm['param188_4_1']['resolution'] ? `param188_4_1.resolution&报警设置/通道4子码流/分辨率&${this.dictionaryData['resJson4_1'][val['resolution']]}&${this.dictionaryData['resJson4_1'][this.copyForm['param188_4_1']['resolution']]}` : '';
          this.formData['param188_4_1.frameRate'] = val['frameRate'] !== this.copyForm['param188_4_1']['frameRate'] ? `param188_4_1.frameRate&报警设置/通道4子码流/帧率&${val['frameRate']}&${this.copyForm['param188_4_1']['frameRate']}` : '';
          this.formData['param188_4_1.encodeMode'] = val['encodeMode'] !== this.copyForm['param188_4_1']['encodeMode'] ? `param188_4_1.encodeMode&报警设置/通道4子码流/视频编码格式&${val['encodeMode'] ? 'H265' : 'H264'}&${this.copyForm['param188_4_1']['encodeMode'] ? 'H265' : 'H264'}` : '';
          this.formData['param188_4_1.bitRate'] = val['bitRate'] !== this.copyForm['param188_4_1']['bitRate'] ? `param188_4_1.bitRate&报警设置/通道4子码流/码率上限&${val['bitRate']}&${this.copyForm['param188_4_1']['bitRate']}` : '';
          // this.formData['param188_4_1.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_4_1']['imageQuality'] ? `param188_4_1.imageQuality&报警设置/通道4子码流/图像质量&${val['imageQuality'] ? val['imageQuality'] == 1 ? '好' : '一般' : '极好'}&${this.copyForm['param188_4_1']['imageQuality'] ? this.copyForm['param188_4_1']['imageQuality'] == 1 ? '好' : '一般' : '极好'}` : '';
          this.formData['param188_4_1.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_4_1']['imageQuality'] ? `param188_4_1.imageQuality&报警设置/通道4子码流/图像质量&品级${val['imageQuality']}&品级${this.copyForm['param188_1_0']['imageQuality']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param188_5_0':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param188_5_0.resolution'] = val['resolution'] !== this.copyForm['param188_5_0']['resolution'] ? `param188_5_0.resolution&报警设置/通道5主码流/分辨率&${this.dictionaryData['resJson4_0'][val['resolution']]}&${this.dictionaryData['resJson4_0'][this.copyForm['param188_3_0']['resolution']]}` : '';
          this.formData['param188_5_0.frameRate'] = val['frameRate'] !== this.copyForm['param188_5_0']['frameRate'] ? `param188_5_0.frameRate&报警设置/通道5主码流/帧率&${val['frameRate']}&${this.copyForm['param188_5_0']['frameRate']}` : '';
          this.formData['param188_5_0.encodeMode'] = val['encodeMode'] !== this.copyForm['param188_5_0']['encodeMode'] ? `param188_5_0.encodeMode&报警设置/通道5主码流/视频编码格式&${val['encodeMode'] ? 'H265' : 'H264'}&${this.copyForm['param188_5_0']['encodeMode'] ? 'H265' : 'H264'}` : '';
          this.formData['param188_5_0.bitRate'] = val['bitRate'] !== this.copyForm['param188_5_0']['bitRate'] ? `param188_5_0.bitRate&报警设置/通道5主码流/码率上限&${val['bitRate']}&${this.copyForm['param188_5_0']['bitRate']}` : '';
          // this.formData['param188_5_0.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_5_0']['imageQuality'] ? `param188_5_0.imageQuality&报警设置/通道5主码流/图像质量&${val['imageQuality'] ? val['imageQuality'] == 1 ? '好' : '一般' : '极好'}&${this.copyForm['param188_5_0']['imageQuality'] ? this.copyForm['param188_5_0']['imageQuality'] == 1 ? '好' : '一般' : '极好'}` : '';
           this.formData['param188_5_0.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_5_0']['imageQuality'] ? `param188_5_0.imageQuality&报警设置/通道5主码流/图像质量&品级${val['imageQuality']}&品级${this.copyForm['param188_1_0']['imageQuality']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param188_5_1':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param188_5_1.resolution'] = val['resolution'] !== this.copyForm['param188_5_1']['resolution'] ? `param188_5_1.resolution&报警设置/通道5子码流/分辨率&${this.dictionaryData['resJson4_1'][val['resolution']]}&${this.dictionaryData['resJson4_1'][this.copyForm['param188_5_1']['resolution']]}` : '';
          this.formData['param188_5_1.frameRate'] = val['frameRate'] !== this.copyForm['param188_5_1']['frameRate'] ? `param188_5_1.frameRate&报警设置/通道5子码流/帧率&${val['frameRate']}&${this.copyForm['param188_5_1']['frameRate']}` : '';
          this.formData['param188_5_1.encodeMode'] = val['encodeMode'] !== this.copyForm['param188_5_1']['encodeMode'] ? `param188_5_1.encodeMode&报警设置/通道5子码流/视频编码格式&${val['encodeMode'] ? 'H265' : 'H264'}&${this.copyForm['param188_5_1']['encodeMode'] ? 'H265' : 'H264'}` : '';
          this.formData['param188_5_1.bitRate'] = val['bitRate'] !== this.copyForm['param188_5_1']['bitRate'] ? `param188_5_1.bitRate&报警设置/通道5子码流/码率上限&${val['bitRate']}&${this.copyForm['param188_5_1']['bitRate']}` : '';
          // this.formData['param188_5_1.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_5_1']['imageQuality'] ? `param188_5_1.imageQuality&报警设置/通道5子码流/图像质量&${val['imageQuality'] ? val['imageQuality'] == 1 ? '好' : '一般' : '极好'}&${this.copyForm['param188_5_1']['imageQuality'] ? this.copyForm['param188_5_1']['imageQuality'] == 1 ? '好' : '一般' : '极好'}` : '';
          this.formData['param188_5_1.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_5_1']['imageQuality'] ? `param188_5_1.imageQuality&报警设置/通道5子码流/图像质量&品级${val['imageQuality']}&品级${this.copyForm['param188_1_0']['imageQuality']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param188_6_0':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param188_6_0.resolution'] = val['resolution'] !== this.copyForm['param188_6_0']['resolution'] ? `param188_6_0.resolution&报警设置/通道6主码流/分辨率&${this.dictionaryData['resJson4_0'][val['resolution']]}&${this.dictionaryData['resJson4_0'][this.copyForm['param188_3_0']['resolution']]}` : '';
          this.formData['param188_6_0.frameRate'] = val['frameRate'] !== this.copyForm['param188_6_0']['frameRate'] ? `param188_6_0.frameRate&报警设置/通道6主码流/帧率&${val['frameRate']}&${this.copyForm['param188_6_0']['frameRate']}` : '';
          this.formData['param188_6_0.encodeMode'] = val['encodeMode'] !== this.copyForm['param188_6_0']['encodeMode'] ? `param188_6_0.encodeMode&报警设置/通道6主码流/视频编码格式&${val['encodeMode'] ? 'H265' : 'H264'}&${this.copyForm['param188_6_0']['encodeMode'] ? 'H265' : 'H264'}` : '';
          this.formData['param188_6_0.bitRate'] = val['bitRate'] !== this.copyForm['param188_6_0']['bitRate'] ? `param188_6_0.bitRate&报警设置/通道6主码流/码率上限&${val['bitRate']}&${this.copyForm['param188_6_0']['bitRate']}` : '';
          // this.formData['param188_6_0.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_6_0']['imageQuality'] ? `param188_6_0.imageQuality&报警设置/通道6主码流/图像质量&${val['imageQuality'] ? val['imageQuality'] == 1 ? '好' : '一般' : '极好'}&${this.copyForm['param188_6_0']['imageQuality'] ? this.copyForm['param188_6_0']['imageQuality'] == 1 ? '好' : '一般' : '极好'}` : '';
           this.formData['param188_6_0.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_6_0']['imageQuality'] ? `param188_6_0.imageQuality&报警设置/通道6主码流/图像质量&品级${val['imageQuality']}&品级${this.copyForm['param188_1_0']['imageQuality']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param188_6_1':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param188_6_1.resolution'] = val['resolution'] !== this.copyForm['param188_6_1']['resolution'] ? `param188_6_1.resolution&报警设置/通道6子码流/分辨率&${this.dictionaryData['resJson4_1'][val['resolution']]}&${this.dictionaryData['resJson4_1'][this.copyForm['param188_6_1']['resolution']]}` : '';
          this.formData['param188_6_1.frameRate'] = val['frameRate'] !== this.copyForm['param188_6_1']['frameRate'] ? `param188_6_1.frameRate&报警设置/通道6子码流/帧率&${val['frameRate']}&${this.copyForm['param188_6_1']['frameRate']}` : '';
          this.formData['param188_6_1.encodeMode'] = val['encodeMode'] !== this.copyForm['param188_6_1']['encodeMode'] ? `param188_6_1.encodeMode&报警设置/通道6子码流/视频编码格式&${val['encodeMode'] ? 'H265' : 'H264'}&${this.copyForm['param188_6_1']['encodeMode'] ? 'H265' : 'H264'}` : '';
          this.formData['param188_6_1.bitRate'] = val['bitRate'] !== this.copyForm['param188_6_1']['bitRate'] ? `param188_6_1.bitRate&报警设置/通道6子码流/码率上限&${val['bitRate']}&${this.copyForm['param188_6_1']['bitRate']}` : '';
          // this.formData['param188_6_1.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_6_1']['imageQuality'] ? `param188_6_1.imageQuality&报警设置/通道6子码流/图像质量&${val['imageQuality'] ? val['imageQuality'] == 1 ? '好' : '一般' : '极好'}&${this.copyForm['param188_6_1']['imageQuality'] ? this.copyForm['param188_6_1']['imageQuality'] == 1 ? '好' : '一般' : '极好'}` : '';
          this.formData['param188_6_1.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_6_1']['imageQuality'] ? `param188_6_1.imageQuality&报警设置/通道6子码流/图像质量&品级${val['imageQuality']}&品级${this.copyForm['param188_1_0']['imageQuality']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param188_7_0':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param188_7_0.resolution'] = val['resolution'] !== this.copyForm['param188_7_0']['resolution'] ? `param188_7_0.resolution&报警设置/通道7主码流/分辨率&${this.dictionaryData['resJson4_0'][val['resolution']]}&${this.dictionaryData['resJson4_0'][this.copyForm['param188_3_0']['resolution']]}` : '';
          this.formData['param188_7_0.frameRate'] = val['frameRate'] !== this.copyForm['param188_7_0']['frameRate'] ? `param188_7_0.frameRate&报警设置/通道7主码流/帧率&${val['frameRate']}&${this.copyForm['param188_7_0']['frameRate']}` : '';
          this.formData['param188_7_0.encodeMode'] = val['encodeMode'] !== this.copyForm['param188_7_0']['encodeMode'] ? `param188_7_0.encodeMode&报警设置/通道7主码流/视频编码格式&${val['encodeMode'] ? 'H275' : 'H274'}&${this.copyForm['param188_7_0']['encodeMode'] ? 'H275' : 'H274'}` : '';
          this.formData['param188_7_0.bitRate'] = val['bitRate'] !== this.copyForm['param188_7_0']['bitRate'] ? `param188_7_0.bitRate&报警设置/通道7主码流/码率上限&${val['bitRate']}&${this.copyForm['param188_7_0']['bitRate']}` : '';
          // this.formData['param188_7_0.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_7_0']['imageQuality'] ? `param188_7_0.imageQuality&报警设置/通道7主码流/图像质量&${val['imageQuality'] ? val['imageQuality'] == 1 ? '好' : '一般' : '极好'}&${this.copyForm['param188_7_0']['imageQuality'] ? this.copyForm['param188_7_0']['imageQuality'] == 1 ? '好' : '一般' : '极好'}` : '';
           this.formData['param188_7_0.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_7_0']['imageQuality'] ? `param188_7_0.imageQuality&报警设置/通道7主码流/图像质量&品级${val['imageQuality']}&品级${this.copyForm['param188_1_0']['imageQuality']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param188_7_1':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param188_7_1.resolution'] = val['resolution'] !== this.copyForm['param188_7_1']['resolution'] ? `param188_7_1.resolution&报警设置/通道7子码流/分辨率&${this.dictionaryData['resJson4_1'][val['resolution']]}&${this.dictionaryData['resJson4_1'][this.copyForm['param188_7_1']['resolution']]}` : '';
          this.formData['param188_7_1.frameRate'] = val['frameRate'] !== this.copyForm['param188_7_1']['frameRate'] ? `param188_7_1.frameRate&报警设置/通道7子码流/帧率&${val['frameRate']}&${this.copyForm['param188_7_1']['frameRate']}` : '';
          this.formData['param188_7_1.encodeMode'] = val['encodeMode'] !== this.copyForm['param188_7_1']['encodeMode'] ? `param188_7_1.encodeMode&报警设置/通道7子码流/视频编码格式&${val['encodeMode'] ? 'H275' : 'H274'}&${this.copyForm['param188_7_1']['encodeMode'] ? 'H275' : 'H274'}` : '';
          this.formData['param188_7_1.bitRate'] = val['bitRate'] !== this.copyForm['param188_7_1']['bitRate'] ? `param188_7_1.bitRate&报警设置/通道7子码流/码率上限&${val['bitRate']}&${this.copyForm['param188_7_1']['bitRate']}` : '';
          // this.formData['param188_7_1.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_7_1']['imageQuality'] ? `param188_7_1.imageQuality&报警设置/通道7子码流/图像质量&${val['imageQuality'] ? val['imageQuality'] == 1 ? '好' : '一般' : '极好'}&${this.copyForm['param188_7_1']['imageQuality'] ? this.copyForm['param188_7_1']['imageQuality'] == 1 ? '好' : '一般' : '极好'}` : '';
          this.formData['param188_7_1.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_7_1']['imageQuality'] ? `param188_7_1.imageQuality&报警设置/通道7子码流/图像质量&品级${val['imageQuality']}&品级${this.copyForm['param188_1_0']['imageQuality']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param188_8_0':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param188_8_0.resolution'] = val['resolution'] !== this.copyForm['param188_8_0']['resolution'] ? `param188_8_0.resolution&报警设置/通道8主码流/分辨率&${this.dictionaryData['resJson4_0'][val['resolution']]}&${this.dictionaryData['resJson4_0'][this.copyForm['param188_3_0']['resolution']]}` : '';
          this.formData['param188_8_0.frameRate'] = val['frameRate'] !== this.copyForm['param188_8_0']['frameRate'] ? `param188_8_0.frameRate&报警设置/通道8主码流/帧率&${val['frameRate']}&${this.copyForm['param188_8_0']['frameRate']}` : '';
          this.formData['param188_8_0.encodeMode'] = val['encodeMode'] !== this.copyForm['param188_8_0']['encodeMode'] ? `param188_8_0.encodeMode&报警设置/通道8主码流/视频编码格式&${val['encodeMode'] ? 'H285' : 'H284'}&${this.copyForm['param188_8_0']['encodeMode'] ? 'H285' : 'H284'}` : '';
          this.formData['param188_8_0.bitRate'] = val['bitRate'] !== this.copyForm['param188_8_0']['bitRate'] ? `param188_8_0.bitRate&报警设置/通道8主码流/码率上限&${val['bitRate']}&${this.copyForm['param188_8_0']['bitRate']}` : '';
          // this.formData['param188_8_0.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_8_0']['imageQuality'] ? `param188_8_0.imageQuality&报警设置/通道8主码流/图像质量&${val['imageQuality'] ? val['imageQuality'] == 1 ? '好' : '一般' : '极好'}&${this.copyForm['param188_8_0']['imageQuality'] ? this.copyForm['param188_8_0']['imageQuality'] == 1 ? '好' : '一般' : '极好'}` : '';
           this.formData['param188_8_0.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_8_0']['imageQuality'] ? `param188_8_0.imageQuality&报警设置/通道8主码流/图像质量&品级${val['imageQuality']}&品级${this.copyForm['param188_1_0']['imageQuality']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
    'form.param188_8_1':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param188_8_1.resolution'] = val['resolution'] !== this.copyForm['param188_8_1']['resolution'] ? `param188_8_1.resolution&报警设置/通道8子码流/分辨率&${this.dictionaryData['resJson4_1'][val['resolution']]}&${this.dictionaryData['resJson4_1'][this.copyForm['param188_8_1']['resolution']]}` : '';
          this.formData['param188_8_1.frameRate'] = val['frameRate'] !== this.copyForm['param188_8_1']['frameRate'] ? `param188_8_1.frameRate&报警设置/通道8子码流/帧率&${val['frameRate']}&${this.copyForm['param188_8_1']['frameRate']}` : '';
          this.formData['param188_8_1.encodeMode'] = val['encodeMode'] !== this.copyForm['param188_8_1']['encodeMode'] ? `param188_8_1.encodeMode&报警设置/通道8子码流/视频编码格式&${val['encodeMode'] ? 'H285' : 'H284'}&${this.copyForm['param188_8_1']['encodeMode'] ? 'H285' : 'H284'}` : '';
          this.formData['param188_8_1.bitRate'] = val['bitRate'] !== this.copyForm['param188_8_1']['bitRate'] ? `param188_8_1.bitRate&报警设置/通道8子码流/码率上限&${val['bitRate']}&${this.copyForm['param188_8_1']['bitRate']}` : '';
          // this.formData['param188_8_1.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_8_1']['imageQuality'] ? `param188_8_1.imageQuality&报警设置/通道8子码流/图像质量&${val['imageQuality'] ? val['imageQuality'] == 1 ? '好' : '一般' : '极好'}&${this.copyForm['param188_8_1']['imageQuality'] ? this.copyForm['param188_8_1']['imageQuality'] == 1 ? '好' : '一般' : '极好'}` : '';
          this.formData['param188_8_1.imageQuality'] = val['imageQuality'] !== this.copyForm['param188_8_1']['imageQuality'] ? `param188_8_1.imageQuality&报警设置/通道8子码流/图像质量&品级${val['imageQuality']}&品级${this.copyForm['param188_1_0']['imageQuality']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    },
  },
  data() {
    return {
      deviceId:this.$route.query.deviceId || '',
      deviceCapability:{},
      form:{},
      copyForm:{},
      formData:{},      
      dictionaryData:{},
      tabAndConfiguration:[],
      childConfigParams:false,
      activeChannelType:'',
      chooseIndex:1,
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
    this.$emit('setMenuActiveRefFormName','PrivateVideoForm');
    //this.makeTabList()
  },
  methods:{
    beforeLeave(){
      
    },
    getPrivateProcotol(activeChannelType){
      this.activeChannelType = activeChannelType;
      for(let i = 0;i < this.tabAndConfiguration.length;i++){
        if(this.activeChannelType == this.tabAndConfiguration[i].id){
          this.chooseIndex = i;
        }
      }
      if(!this.form['param188_'+activeChannelType]){
        let params = {
          deviceId:this.deviceId,
          param:{
            chanNo:Number(this.activeChannelType.split('_')[0]),
            streamType:Number(this.activeChannelType.split('_')[1])
          },  
          msgId:188
        }
        if(Boolean(this.isTemplate)) return
        this.$api.getEHomeConfig(params).then(res =>{
          console.log(res);
          if(res && res.data && res.data.param){
            let resData = JSON.parse(res.data.param);
            resData['chanNo'] = Number(this.activeChannelType.split('_')[0]);
            resData['streamType'] = Number(this.activeChannelType.split('_')[1]);
            this.$set(this.form,'param188_'+activeChannelType,resData);
            this.$set(this.copyForm,'param188_'+activeChannelType,JSON.parse(JSON.stringify(resData)));
            this.childConfigParams = false;
          }else{
            this.$message.error('协议获取失败');
            this.childConfigParams = false;
          }
        })
      }else{
        this.childConfigParams = false;
      }
    },
    //切换通道号
    changeChannel(chanNo,index){
      this.form = Object.assign({},this.form,this.form['param188'][chanNo]);
      this.activeChannel = chanNo;
      // this. = this.tabAndConfiguration[index]['tabList'][0]['types'][0];
      // this.chooseIndex = 0;
    },
    //切换报警等级
    changeAlarmLevel(item,index){
      // this. = item
    },
    makeTabList(){
      this.tabAndConfiguration = [];
      this.deviceCapability['compress'].forEach(item =>{
        item['info'].forEach((item_,index_) =>{
          this.tabAndConfiguration.push(
            {
              id:item_['chanNo']+'_'+item_['type'],
              label:`通道${item_['chanNo']}${item_['type'] ? '子' : '主'}码流`
            }
          )
        })
      })
      console.log(this.tabAndConfiguration);
      this.activeChannelType = this.tabAndConfiguration[0]['id'];      
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
  .channels{
    width: 32%;
    margin-bottom: 24px;
  }
  .titleChannels{
      height: 24px;
      line-height: 24px;
    };
</style>