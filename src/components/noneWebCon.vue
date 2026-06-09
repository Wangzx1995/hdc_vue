<template>
    <div>
        <div  :style="{height:height,width: width}" v-show="showType==='loading'" v-loading='loading'></div>
        <div class="b-a flex-my" :style="{height:height,width: width}" v-show="showType==='noneVideo'">
            暂无视频
        </div>
        <div  class="h-full flex-layout flex-middle flex-center"
            :style="{height:height,width: width,textAlign: 'center'}"
            v-show="showType==='noneWebCon'">
            <div>
                <h4>Web控件未运行</h4>
                <p class="text-xs text-muted m-y text-left">请尝试以下办法</p>
                <div class="text-xs text-left">
                    <p>1）本机尚未安装Web控件，请先安装，安装完成后刷新当前页面</p>
                    <el-button type="text" @click="downloadOcx"  class="m-t-ms"><span class="text-sm">安装</span></el-button>
                    <el-button type="text" @click="refreshPage" ><span class="text-sm">刷新</span></el-button>
                </div>
                <div class="text-xs text-left">
                    <p>2）本机已安装Web控件，请先启动服务后刷新当前页面！</p>
                    <el-button type="text" @click="wakeUpOcx"><span class="text-sm">启动</span></el-button>
                    <el-button type="text" @click="refreshPage"><span class="text-sm">刷新</span></el-button>
                </div>
                </div>
        </div>
    </div>
</template>


<script>
export default {
    name: "noneWebCon",
    props:{
        //loading,noneVideo,noneWebCon
        showType:{
            type:String,
            default:"noneWebCon",
        },
        width:{
            type:String,
            default:"100%"
        },
        height:{
            type:String,
            default:"23rem"
        }
    },
    data(){
        return {
            loading:true
        }
    },
    methods:{
        //控件下载
        downloadOcx() {
            this.$api.getPluginVersion().then((res) => {
                let url = '';
                if (res.success && !!res.data) {
                    url = res.data.pluginDownloadUrl;
                } else {
                    url = (process.env.VUE_APP_BASE_API == "/" ? "" : process.env.VUE_APP_BASE_API) + "/sys/downloadOcxPlugin";
                }
                let elemIF = document.createElement("iframe");
                elemIF.src = url;
                elemIF.style.display = "none";
                document.body.appendChild(elemIF);
                setTimeout(() => {
                    document.body.removeChild(elemIF);
                }, 2000);
            });
        },
        //唤醒控件
        wakeUpOcx() {
            WebControl.JS_WakeUp("HATWebCtrlPlugin://");
        },
        //刷新当前页面
        refreshPage() {
            location.reload();
        },
    }
}
</script>

<style lang="less" scoped>
.flex-my{
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>