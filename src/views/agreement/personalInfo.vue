<template>
    <div class="personal-info">
        <h3 class="head">已收集个人信息清单</h3>
        <div class="paragraph">
            海康威视将尽全力保护您的个人信息安全，并保障您在个人信息处理过程中的相关利益。为了向您提供产品的基本功能，我们需要对您的个人信息进行收集。以下我们将逐一说明我们的收集情况，方便您快速查阅。<br />
            <span class="bold">1、手机号 </span><br />
            使用目的：用于登录账号<br />
            使用场景：用户登录时 <br />
            信息内容： <br />
            信息来源：直接收集<br />
            <span class="bold">2、账号名</span><br />
            使用目的：用于登录账号 <br />
            使用场景：用户登录时 <br />
            信息内容： <br />
            信息来源：直接收集<br />
            <span class="bold">3、密码</span><br />
            使用目的：用于登录账号<br />
            使用场景：用户登录时、修改密码时<br />
            信息内容： <br />
            信息来源：直接收集<br />
            <span class="bold">4、记录仪视频、图片</span><br />
            使用目的：用于实时预览、回放、下载记录仪视频及图片 <br />
            使用场景：用户实时预览、回放、下载记录仪视频及图片时 <br />
            信息内容： <br />
            信息来源：直接收集<br />
            <span class="bold">5、记录仪位置信息</span><br />
            使用目的：用于展示记录仪运行轨迹、展示记录仪位置、规划导航路线<br />
            使用场景：查看记录仪运行轨迹时、使用聚合地图、查找地点、规划导航路线时
            <br />
            信息内容： <br />
            信息来源：直接收集<br />
            <span class="bold">6、对讲语音</span><br />
            使用目的：用于与车辆对讲<br />
            使用场景：用户与车辆对讲时<br />
            信息内容： <br />
            信息来源：直接收集<br />
            <span class="bold">7、下发文本内容</span><br />
            使用目的：用于向车辆下发文本 <br />
            使用场景：用户向车辆下发文本时<br />
            信息内容： <br />
            信息来源：直接收集<br />
            <span class="bold">8、推送消息内容</span><br />
            使用目的：用于向用户推送消息、展示消息、进行消息管理 <br />
            使用场景：进行消息推送时<br />
            信息内容： <br />
            信息来源：直接收集<br />
            <span class="bold"
                >9、设备型号、设备厂商、设备序列号、设备类型、终端手机号、设备名称、SIM卡号、设备软件版本、设备视频通道数</span
            ><br />
            使用目的：用于绑定设备、展示设备信息 <br />
            使用场景：用户绑定设备时<br />
            信息内容： <br />
            信息来源：直接收集<br />
            <span class="bold"
                >10、车牌号、车辆类型、所属公司、车辆状态、车辆位置、车速、运行时长、行驶里程</span
            ><br />
            使用目的：用于展示车辆状态、生成数据报表 <br />
            使用场景：用户查看车辆信息、数据报表时<br />
            信息内容： <br />
            信息来源：直接收集<br />
            <span class="bold">11、移动终端设备位置信息</span><br />
            使用目的：用于展示用户当前位置、规划导航路线<br />
            使用场景：查看用户当前位置、规划导航路线时 <br />
            信息内容： <br />
            信息来源：直接收集<br />
            <span class="bold">12、司机信息</span><br />
            使用目的：用于展示车辆绑定的司机信息 <br />
            使用场景：用户查看司机信息时 <br />
            信息内容： <br />
            信息来源：直接收集<br />
            <span class="bold">13、数据报表内容</span><br />
            使用目的：用于生成、查看、下载及管理数据报表 <br />
            使用场景：用户生成、查看、下载及管理数据报表时 <br />
            信息内容： <br />
            信息来源：直接收集<br />
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        goPolicy() {
            window.open("/#/privacyPolicy");
        },
    },
};
</script>
<style lang="less" scoped>
.personal-info {
    color: rgba(0, 0, 0, 0.85);
    line-height: 32px;
    font-size: 16px;
    padding: 66px 200px;
    font-family: PingFangSC-Regular !important;
    .head {
        font-size: 30px;
        font-weight: 500;
    }
    .content {
        text-align: left;
        margin: 18px 0 0 0;
        display: flex;
        flex-direction: column;
    }
    .paragraph {
        text-align: left;
        margin-top: 30px;
        .bold {
            font-weight: bold;
        }
        .title {
            font-weight: bold;
            font-size: 20px;
            line-height: 36px;
        }
    }
}
</style>
