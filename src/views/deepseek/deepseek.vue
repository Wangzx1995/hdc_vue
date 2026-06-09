<template>
    <div class="deepseek" v-dialogDrag>
        <div class="chat-container">
            <div class="deepseek-top-content">
                <span>运维小助理</span>
                <div>
                    <el-button
                        type="primary"
                        icon="el-icon-refresh"
                        @click="refresh()"
                    >
                    </el-button>
                    <el-button
                        type="primary"
                        icon="el-icon-close"
                        @click="$emit('close')"
                    >
                    </el-button>
                </div>
            </div>

            <div class="mid-content" id="chat-box">
                <div class="welcome" v-if="!messageSum">
                    <div></div>
                    <div>您好，我是您的运维小助理</div>
                    <div>有什么可以帮您？</div>
                </div>
            </div>
            <div class="bot-content">
                <textarea
                    class="search-textarea"
                    type="textarea"
                    placeholder="有什么需要帮助吗？"
                    v-model="textarea"
                    @keyup.enter="send()"
                >
                </textarea>
                <el-button
                    @click="send()"
                    :disabled="!textarea"
                    v-if="chatStatus === 0"
                >
                    <svg-icon iconClass="send" :width="24" :height="24" />
                </el-button>
                <el-button v-if="chatStatus === 1">
                    <i class="el-icon-loading"></i>
                </el-button>
                <el-button @click="close" v-if="chatStatus === 2">
                    <svg-icon iconClass="stop" :width="24" :height="24" />
                </el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { EventSourcePolyfill } from "event-source-polyfill";
import Auth from "@/utils/auth";

export default {
    name: "",
    components: {},
    props: {},
    data() {
        return {
            eventSource: null,
            textarea: "打开浙A111的录像",
            chatText: null,
            chatStatus: 0,
            messageSum: 0,
            aiChatUrl: "",
            openNewPageBtn: false,
        };
    },
    mounted() {
        this.getAiChatApplicationUrl();
    },
    computed: {},
    watch: {},
    methods: {
        getAiChatApplicationUrl() {
            this.$api.getAiChatApplicationUrl().then((res) => {
                if (res.success == true) {
                    this.aiChatUrl = res.data;
                }
            });
        },
        close() {
            if (this.eventSource) this.eventSource.close();
            this.chatStatus = 0;
            let element = document.getElementById("loading-pic");
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        },
        connect() {
            this.messageSum++;
            this.chatStatus = 1;
            const message = this.textarea.trim();
            const sessionId =
                localStorage.getItem("sessionId") || this.generateUUID();

            this.eventSource = new EventSourcePolyfill(
                `${this.aiChatUrl}?prompt=${message}&sessionId=${sessionId}`,
                {
                    headers: {
                        "X-Token": Auth.getToken(),
                    },
                }
            );
            this.eventSource.addEventListener("open", (e) => {});
            this.eventSource.addEventListener("message", (e) => {
                let element = document.getElementById("loading-pic");
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
                this.chatStatus = 2;
            });
            this.eventSource.addEventListener("error", (err) => {
                this.chatStatus = 0;
                this.close();
            });
        },
        generateUUID() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                /[xy]/g,
                (c) => {
                    const r = (Math.random() * 16) | 0;
                    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
                }
            );
        },
        send() {
            const message = this.textarea.trim();
            const newId = "box" + Date.now();
            this.close();
            if (message) {
                this.addMessageToChat(message, "right", newId);
                this.connect();
                this.chatText = "";
                this.eventSource.onmessage = (event) => {
                    if (this.openNewPageBtn) {
                        return;
                    }
                    this.chatText += JSON.parse(event.data).data;
                    if (this.chatText.indexOf("###") == 0) {
                        this.openNewPageBtn = true;
                        let msg = "该功能正在开发中，请稍等...";
                        this.addMessageToChat(msg, "left", newId);
                    } else {
                        this.addMessageToChat(this.chatText, "left", newId);
                    }
                };

                this.eventSource.onerror = (err) => {
                    this.eventSource.close();
                    this.openNewPageBtn = false;
                };
                this.textarea = "";
            }
        },
        addMessageToChat(text, type, newId) {
            const chatBoxDiv = document.getElementById("chat-box");
            let caseDiv = null;
            let messageDiv = null;

            if (document.getElementById(newId)) {
                caseDiv = document.getElementById(newId);
            } else {
                caseDiv = document.createElement("div");
                caseDiv.setAttribute("id", newId);
                caseDiv.classList.add(`case-div`);
            }
            chatBoxDiv.appendChild(caseDiv);

            if (type === "left") {
                if (document.getElementById(newId + "-chat")) {
                    messageDiv = document.getElementById(newId + "-chat");
                } else {
                    messageDiv = document.createElement("div");
                    messageDiv.setAttribute("id", newId + "-chat");
                }
            } else {
                messageDiv = document.createElement("div");
            }
            messageDiv.classList.add(`wechat-box`);
            messageDiv.classList.add(type);

            messageDiv.innerHTML = `<span class='head'></span><div class='chat-content aa'>${marked.parse(
                text
            )}</div>`;
            messageDiv.innerHTML += `<div id='loading-pic'><i class="el-icon-loading"></i></div>`;
            caseDiv.appendChild(messageDiv);
            chatBoxDiv.scrollTop = chatBoxDiv.scrollHeight;
        },
        refresh() {
            this.messageSum = 0;
            this.close();
            const divs = document.querySelectorAll(".case-div");
            divs.forEach((div) => div.remove());
        },
    },
};
</script>
<style lang="css" scoped>
@import "./style.less";
</style>
<style lang="less">
.deepseek {
    display: flex;
    position: fixed;
    z-index: 999999;
    bottom: 60px;
    right: 55px;
    color: #666666;

    width: 400px;
    height: 650px;
}
@keyframes gradient {
    100% {
        transform: rotate(360deg);
    }
}
@keyframes gradient-text {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: 120px 0px;
    }
}
.chat-container {
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;

    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(6px);
    .deepseek-top-content {
        padding: 0 26px;
        width: 100%;
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: space-between;
        color: #ffffff;
        & > span {
            background-image: linear-gradient(
                to right,
                #c270fe 20%,
                #62a7fe 50%,
                #15d2ff 100%
            );
            animation: gradient-text 2.5s cubic-bezier(0.17, 1.3, 0.91, -0.17)
                infinite;
            -webkit-background-clip: text;
            color: transparent;
            font-size: 18px;
            font-weight: 600;
        }
        .el-button {
            background-color: transparent;
            border-color: transparent;
            padding: 4px;
            i {
                color: #666;
                font-size: 16px;
            }
        }
    }

    .bot-content {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: space-between;
        display: flex;
        align-items: center;
        padding: 12px 14px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        background-color: rgba(230, 230, 230, 0.5);
        .search-textarea {
            border: none;
            outline: none;
            width: calc(~"100% - 46px");
            line-height: 34px;
            height: 36px;
            resize: none;
            cursor: pointer;
            padding: 0px 28px 0px 12px;
            border: 1px solid #f3f3f3;
            border-radius: 24px;
        }
        .el-button {
            width: 32px;
            height: 32px;
            padding: 0px;
            border: none;
            outline: none;
            background: none;
            i {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                color: #666666;
                &.el-icon-loading {
                    font-size: 24px;
                }
            }
        }
    }
    .mid-content {
        width: 100%;
        height: calc(~"100% - 120px");
        padding: 20px;
        overflow-y: auto;
        position: relative;
        #loading-pic {
            display: flex;
            align-items: center;
            height: 48px;
            width: 100%;
            padding-left: 4px;
            i {
                font-size: 24px;
            }
        }
        .wechat-box {
            display: flex;
            align-items: flex-end;
            margin-bottom: 8px;
            flex-wrap: wrap;
            .head {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                background-color: #f4f4f5;
                background-size: cover;
            }
            .chat-content {
                width: calc(~"100% - 120px");
                padding: 8px 15px;
                text-align: left;
                color: #555;
                border-radius: 8px;
            }
        }
        .right {
            flex-direction: row-reverse;
            .chat-content {
                background: #fff8f0;
            }
            .head {
                margin-left: 8px;
                background-image: url("/static/images/deepseek/user.svg");
            }
        }
        .left {
            .chat-content {
                background: #eef9f5;
            }
            .head {
                margin-right: 8px;
                background-image: url("/static/images/deepseek/ai_btn.svg");
            }
            table {
                border-collapse: collapse; /* 可选，使边框合并为一条 */
            }
            table,
            th,
            td {
                border: 1px solid black;
            }
        }
        .welcome {
            padding-top: 50px;
            & > div:nth-child(1) {
                width: 48px;
                height: 48px;
                background-image: url("/static/images/deepseek/ai_btn.svg");
                background-size: cover;
            }
            & > div:nth-child(2) {
                font-size: 26px;
                background: linear-gradient(270deg, #ae79cc 3%, #1366ec 96%);
                color: transparent;
                background-clip: text;
                font-weight: 600;
            }
            & > div:nth-child(3) {
                margin-top: 16px;
                color: #666;
                font-size: 15px;
                font-weight: 400;
            }
        }
    }
}
</style>
