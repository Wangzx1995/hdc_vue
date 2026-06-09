<template>
    <div class="p-a-md">
    <h2>通道设置</h2>
        <el-tabs v-model="activeName">
            <el-tab-pane label="通道1" name="first">
                <div style="margin-top: 16px;margin-bottom: 20px;">
                    <el-radio-group v-model="radio">
                        <el-radio-button label="主码流"></el-radio-button>
                        <el-radio-button label="子码流"></el-radio-button>
                    </el-radio-group>
                </div>
                <el-form
                    ref="form"
                    label-position="top"
                    :model="form"
                    label-width="120px"
                >
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="6" >
                            <el-form-item label="码率类型" class="m-r-md">
                                <el-select v-model="form.coderatetype"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="码流类型" class="m-r-md">
                                <el-select v-model="form.codestreamtype"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="分辨率" class="m-r-md">
                                <el-select v-model="form.distinguish"></el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="6" >
                            <el-form-item label="图像质量（1级质量最高）" class="m-r-md">
                                <el-select v-model="form.quality"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="视频帧率" class="m-r-md">
                                <el-select v-model="form.framerate"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="码率上限" class="m-r-md">
                                <el-select v-model="form.upperlimit"></el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="通道2" name="second">
                <div style="margin-top: 16px;margin-bottom: 20px;">
                    <el-radio-group v-model="radio">
                        <el-radio-button label="主码流"></el-radio-button>
                        <el-radio-button label="子码流"></el-radio-button>
                    </el-radio-group>
                </div>
                <el-form
                    ref="secform"
                    label-position="top"
                    :model="secform"
                    label-width="120px"
                >
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="6" >
                            <el-form-item label="码率类型" class="m-r-md">
                                <el-select v-model="secform.coderatetype"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="码流类型" class="m-r-md">
                                <el-select v-model="secform.codestreamtype"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="分辨率" class="m-r-md">
                                <el-select v-model="secform.distinguish"></el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="6" >
                            <el-form-item label="图像质量（1级质量最高）" class="m-r-md">
                                <el-select v-model="secform.quality"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="视频帧率" class="m-r-md">
                                <el-select v-model="secform.framerate"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="码率上限" class="m-r-md">
                                <el-select v-model="secform.upperlimit"></el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="通道3" name="third">
                <div style="margin-top: 16px;margin-bottom: 20px;">
                    <el-radio-group v-model="radio">
                        <el-radio-button label="主码流"></el-radio-button>
                        <el-radio-button label="子码流"></el-radio-button>
                    </el-radio-group>
                </div>
                <el-form
                    ref="thirform"
                    label-position="top"
                    :model="thirform"
                    label-width="120px"
                >
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="6" >
                            <el-form-item label="码率类型" class="m-r-md">
                                <el-select v-model="thirform.coderatetype"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="码流类型" class="m-r-md">
                                <el-select v-model="thirform.codestreamtype"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="分辨率" class="m-r-md">
                                <el-select v-model="thirform.distinguish"></el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="6" >
                            <el-form-item label="图像质量（1级质量最高）" class="m-r-md">
                                <el-select v-model="thirform.quality"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="视频帧率" class="m-r-md">
                                <el-select v-model="thirform.framerate"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="码率上限" class="m-r-md">
                                <el-select v-model="thirform.upperlimit"></el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="通道4" name="fourth">
                <div style="margin-top: 16px;margin-bottom: 20px;">
                    <el-radio-group v-model="radio">
                        <el-radio-button label="主码流"></el-radio-button>
                        <el-radio-button label="子码流"></el-radio-button>
                    </el-radio-group>
                </div>
                <el-form
                    ref="fouform"
                    label-position="top"
                    :model="fouform"
                    label-width="120px"
                >
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="6" >
                            <el-form-item label="码率类型" class="m-r-md">
                                <el-select v-model="fouform.coderatetype"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="码流类型" class="m-r-md">
                                <el-select v-model="fouform.codestreamtype"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="分辨率" class="m-r-md">
                                <el-select v-model="fouform.distinguish"></el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="6" >
                            <el-form-item label="图像质量（1级质量最高）" class="m-r-md">
                                <el-select v-model="fouform.quality"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="视频帧率" class="m-r-md">
                                <el-select v-model="fouform.framerate"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="码率上限" class="m-r-md">
                                <el-select v-model="fouform.upperlimit"></el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="IPC01" name="fifth">
                <div style="margin-top: 16px;margin-bottom: 20px;">
                    <el-radio-group v-model="radio">
                        <el-radio-button label="主码流"></el-radio-button>
                        <el-radio-button label="子码流"></el-radio-button>
                    </el-radio-group>
                </div>
                <el-form
                    ref="fifform"
                    label-position="top"
                    :model="fifform"
                    label-width="120px"
                >
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="6" >
                            <el-form-item label="码率类型" class="m-r-md">
                                <el-select v-model="fifform.coderatetype"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="码流类型" class="m-r-md">
                                <el-select v-model="fifform.codestreamtype"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="分辨率" class="m-r-md">
                                <el-select v-model="fifform.distinguish"></el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="6" >
                            <el-form-item label="图像质量（1级质量最高）" class="m-r-md">
                                <el-select v-model="fifform.quality"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="视频帧率" class="m-r-md">
                                <el-select v-model="fifform.framerate"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="码率上限" class="m-r-md">
                                <el-select v-model="fifform.upperlimit"></el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>

</template>

<script>
export default {
    name: "vedioSetting",
    data () {
        return {
            activeName: 'first',
            form: {
                coderatetype: '',
                codestreamtype: '',
                distinguish: '',
                quality: '',
                framerate: '',
                upperlimit: '',
            },
            secform: {
                coderatetype: '',
                codestreamtype: '',
                distinguish: '',
                quality: '',
                framerate: '',
                upperlimit: '',
            },
            thirform: {
                coderatetype: '',
                codestreamtype: '',
                distinguish: '',
                quality: '',
                framerate: '',
                upperlimit: '',
            },
            fouform: {
                coderatetype: '',
                codestreamtype: '',
                distinguish: '',
                quality: '',
                framerate: '',
                upperlimit: '',
            },
            fifform: {
                coderatetype: '',
                codestreamtype: '',
                distinguish: '',
                quality: '',
                framerate: '',
                upperlimit: '',
            },
            radio: '主码流'
        }
    }
}
</script>

<style scoped>

</style>