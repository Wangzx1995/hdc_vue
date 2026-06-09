<template>
    <!-- 无插件 -->
    <div
        class="hat-plugin-main m-t p-l p-r"
        v-loading="loading"
        element-loading-text="正在关闭中"
    >
        <div class="tip"></div>
        <div
            id="HATPluginPlay"
            class="m-t-sm m-b-sm"
            style="width: 100%; height: 400px"
        ></div>
        <div class="footer" v-if="!isTemplate">
            <div>
                <el-button @click="defaultConfig()">默认</el-button>
            </div>
            <div>
                <el-button @click="cancel(true)">取消</el-button>
                <el-button @click="save()" type="primary">保存</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import HATPlugin_C from "@/components/webControlService/HATPlugin_C";
export default {
    props: {
        playUrl: {
            type: String,
            default: "",
        },
        isTemplate: {
            type: [String, Boolean],
            default: false,
        },
    },
    data() {
        return {
            loading: false,
            playControlNone: null,
            defaultPolygon: [
                { x: 298, y: 253 },
                { x: 159, y: 507 },
                { x: 291, y: 682 },
                { x: 456, y: 507 },
            ],
        };
    },
    methods: {
        defaultConfig() {
            this.playControlNone.clearRegion();
            this.openHatPlugin(this.playUrl, this.defaultPolygon, false);
        },
        cancel() {
            this.loading = true;
            this.playControlNone
                .stopRealPlayAll()
                .then(() => {
                    this.playControlNone.clearRegion();
                    this.$emit("cancelSurveyBol");
                    this.playControlNone = null;
                    this.loading = false;
                })
                .catch((e) => {
                    this.playControlNone.clearRegion();
                    this.$emit("cancelSurveyBol");
                    this.playControlNone = null;
                    this.loading = false;
                });
        },
        save() {
            this.loading = true;
            this.playControlNone.getPolygonInfo().then((res) => {
                let data = res;
                let adList = [];
                data.map((i) => {
                    if (i.tips === "ad") {
                        i.points.map((j) => {
                            adList.push({ x: j[0] * 1000, y: j[1] * 1000 });
                        });
                    }
                });

                this.playControlNone
                    .stopRealPlayAll()
                    .then(() => {
                        this.playControlNone.clearRegion();
                        this.$emit("saveSurveyBol", adList);
                        this.loading = false;
                    })
                    .catch((e) => {
                        this.playControlNone.clearRegion();
                        this.$emit("saveSurveyBol", adList);
                        this.loading = false;
                    });
            });
        },
        openHatPlugin(playUrl, areaContent, replay, isPrivate) {
            // 初始化控件
            if (!this.playControlNone) {
                this.playControlNone = new HATPlugin_C("HATPluginPlay");
            }

            if (replay)
                // 预览
                this.playControlNone.play({ url: playUrl });
            this.playControlNone.clearRegion();

            //ad绘制
            let pointList = [];
            areaContent.map((i, index) => {
                pointList.push([i.x / 1000, i.y / 1000]);
            });
            let bPolygons = [
                {
                    iPolygonType: 1, //普通线-0, 越界侦测线-3, 过线统计-4, 5-WHD标定虚线
                    iEditType: 0, //0-可编辑，1-不可编辑
                    aPoint: pointList, //相对于设备原始分辨率的千分比坐标点
                    bClosed: true, //多边形闭合
                    szTips: "ad", //多边形名称
                    szDrawColor: "#25CEF7", //边框颜色
                    szFillColor: "#FFFF00", //填充颜色
                    iTranslucent: 0.0, //透明度
                },
            ];
            this.playControlNone.setPolygonInfo(bPolygons);
        },
    },
};
</script>
<style lang="less" scoped>
.hat-plugin-main {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    #HATPluginPlay {
        border: 1px solid black;
        flex: 1;
    }
    .footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
