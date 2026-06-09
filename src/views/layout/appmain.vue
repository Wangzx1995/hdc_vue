<template>
    <section class="app-body">
        <el-alert v-if="isIE" show-icon simple type="warning">
            <span slot="title">
                <!-- 为了更好的用户体验，并访问所有功能，我们建议您使用Chrome浏览器 -->
                {{ $t("appmain.useChrome") }}
                <a
                    href="https://www.google.cn/intl/zh-CN/chrome/"
                    target="_blank"
                    class="link"
                >
                     <!-- （点击下载） -->
                    （{{ $t("appmain.clickToDownload") }}）
                </a></span
            >
        </el-alert>
        <div class="p-y-sm b-b clearfix bread-crumb-main">
            <Breadcrumb class="m-l-xs"></Breadcrumb>
        </div>
        <el-popover placement="left" trigger="hover" v-if="isShowPrompt">
            <div class="prompt">
                <span>
                    <!-- 填写调查问卷赠送10天授权 -->
                    {{ $t("appmain.questionnaire") }}
                </span>
                <span @click="isShowPrompt = false">
                    <!-- 下次再说 -->
                    {{ $t("appmain.talkAboutItNextTime") }}
                </span>
            </div>
            <div
                class="wenjuan"
                slot="reference"
            >
                <!-- @click="getQuestionnaireSurveyUrl" -->
                <i class="iconfont icon-gift-full"></i>
            </div>
        </el-popover>
        <!-- <el-popover
            id="bbb"
            :tabindex="1"
            :offset="400"
            placement="left"
            trigger="manual"
            :popper-class="'assistant-popover'"
            :popper-options="{
                boundariesElement: 'viewport',
                removeOnDestroy: true,
            }"
            v-model="assistantVisible"
        >
            <deepseek @close="close"></deepseek>
            <div
                class="assistant"
                slot="reference"
                v-dragSwitch="{
                    click: assistantClick,
                    drag: close,
                }"
            >
                <svg-icon iconClass="ai" :width="52" :height="52" />
            </div>
        </el-popover> -->

        <transition name="fade" mode="out-in">
            <router-view
                :key="key"
                class="main-content"
                ref="components"
                v-if="isShow"
            ></router-view>
            <!-- <keep-alive>
                <router-view
                    v-if="$route.meta.keepAlive"
                    class="main-content"
                    ref="components"
                ></router-view>
                <router-view
                    v-if="!$route.meta.keepAlive"
                    :key="key"
                    class="main-content"
                    ref="components"
                ></router-view>
            </keep-alive> -->
        </transition>
    </section>
</template>

<script>
import Breadcrumb from "@/components/breadcrumb.vue";
import deepseek from "@/views/deepseek/deepseek.vue";
import Auth from "@/utils/auth";
import alarmWav from "@/assets/audio/alarmWav.flac";

export default {
    name: "AppMain",
    data() {
        return {
            isIE: false,
            userId: "",
            audio: null,
            tiemr: null,
            isShow: true,
            isShowPrompt: true,
            assistantVisible: false,
        };
    },
    components: {
        Breadcrumb,
        deepseek,
    },
    provide() {
        // 提供可注入子组件属性
        return {
            reload: this.reload,
        };
    },
    computed: {
        key() {
            return this.$route.name !== undefined
                ? this.$route.name + +new Date()
                : this.$route + +new Date();
        },
    },
    methods: {
        reload() {
            // 定义加载方式
            // 先取消当前路由的视图展示，待dom重新渲染完毕，再让当前路由视图展示
            this.isShow = false;
            this.$nextTick(() => {
                this.isShow = true;
            });
        },
        // 加提示音
        playAudio() {
            this.audio = new Audio();
            this.audio.src = alarmWav;
            const playPromise = this.audio.play();
            if (playPromise) {
                playPromise
                    .then(() => {
                        // 音频加载成功
                        // 音频的播放需要耗时
                        // this.tiemr = setInterval(() => {
                        //     second--;
                        //     if (second <= 0) {
                        //         this.audio.pause();
                        //         clearInterval(this.tiemr);
                        //     }
                        // }, 1000);
                    })
                    .catch((e) => {
                        // 音频加载失败
                        console.error(e);
                    });
            }
        },
        connectWebsocket() {
            let websocket;
            if (typeof WebSocket === "undefined") {
                console.log("您的浏览器不支持WebSocket");
                return;
            } else {
                let protocol = "ws";
                let url = "";
                if (window.location.protocol == "https:") {
                    protocol = "wss";
                }
                url = `${protocol}://${window.location.hostname}:${window.location.port}/hdcws`;
                // url = `wss://10.42.110.32:8444/hdcws`; //
                // 打开一个websocket
                websocket = new WebSocket(url, Auth.getToken());
                // 建立连接
                websocket.onopen = () => {
                    // 发送数据
                    websocket.send("发送数据");
                    console.log("websocket发送数据中");
                };
                // 客户端接收服务端返回的数据
                websocket.onmessage = (evt) => {
                    const data = evt.data;
                    let wsData = JSON.parse(data);
                    if (wsData.type === 1) {
                        this.$store.commit(
                            "getTaskRemind",
                            JSON.parse(wsData.message)
                        );
                    } else if (wsData.type === 0) {
                        this.playAudio();
                        //const parseData = JSON.parse(data)
                        //this.playAudio()
                        this.$notify({
                            title: this.$t("appmain.message"), //"消息",
                            message: wsData.message,
                            // message: `${parseData.plateNum != '' && parseData.plateNum != null && parseData.plateNum != undefined ? parseData.plateNum + '的' : ''}${parseData.deviceCode}设备已上传装车报告, 请前往装车报告审核页面处理！`,
                            size: "small",
                            duration: 10000,
                        });
                    }
                    // console.log("websocket返回的数据：", evt);
                };
                // 发生错误时
                websocket.onerror = (evt) => {
                    // console.log('websocket错误：', evt);
                };
                // 关闭连接
                websocket.onclose = (evt) => {
                    console.log("websocket关闭：", evt);
                };
            }
        },
        getUserInfo() {
            this.$api.getHdcUserInfo().then((res) => {
                if (res.success == true) {
                    this.userId = res.data.id;
                    this.connectWebsocket();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        getQuestionnaireSurveyUrl() {
            this.$api.getQuestionnaireSurveyUrl().then((res) => {
                if (res.success == true) {
                    window.open(res.data, "_blank");
                }
            });
        },
        assistantClick() {
            this.assistantVisible = !this.assistantVisible;
        },
        close() {
            this.assistantVisible = false;
        },
    },
    mounted() {
        this.getUserInfo();
    },
    created() {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            this.isIE = true;
        } else {
            this.isIE = false;
        }
    },
};
</script>
<style lang="less" scoped>
.bread-crumb-main {
    width: 100%;
    background: #fff;
    z-index: 800;
}
.main-content {
    width: 100%;
    height: calc(~"100% - 33px") !important;
    // overflow-y: auto;
}
.wenjuan {
    cursor: pointer;
    z-index: 999999999;
    background: #fff;
    position: fixed;
    right: 20px;
    bottom: 90px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.08);
    i {
        font-size: 18px;
        color: #f56c6c;
    }
}
.prompt {
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > span:nth-child(2) {
        margin-left: 24px;
        cursor: pointer;
        color: #409eff;
    }
}
@keyframes gradient {
    100% {
        transform: rotate(360deg);
    }
}
.assistant {
    cursor: pointer;
    z-index: 999999999999;
    background: #fff;
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-image: url("/static/images/deepseek/ai_btn.svg");
    // background-size: cover;
    .svg-icon {
        z-index: 1;
    }
    &&::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        animation: gradient 1s linear infinite;
        background-image: linear-gradient(
            to bottom right,
            #c270fe 30%,
            #15d2ff 100%
        );
    }
}
</style>
<style lang="less">
.assistant-popover {
    padding: 0;
    border: none;
    background: transparent;
    box-shadow: none;
}
</style>
