<template>
    <div>
        <i class="el-icon-download download-icon" :style="ImgStyle" v-show="show"></i>
    </div>
</template>
<script>
export default {
    data() {
        return {
            ImgStyle: "",
            obj: {
                tx: null,
                ty: null,
                cx: null,
                cy: null
            },
            show: false,
            timer: null
        };
    },
    methods: {
        lead() {
            this.show = true;
            let OpticyIndex = 1.0;
            const OpticyStepSize = 0.1;
            this.ImgStyle = "opacity:1;left:" + this.obj.cx + "px" + ";top:" + this.obj.cy + "px";
            setTimeout(() => {
                this.timer = setInterval(() => {
                    OpticyIndex = OpticyIndex - OpticyStepSize;
                    this.ImgStyle =
                        "transition: all 0.5s linear;opacity:" +
                        OpticyIndex.toString() +
                        ";left:" +
                        this.obj.tx +
                        "px" +
                        ";top:" +
                        this.obj.ty +
                        "px";
                    if (OpticyIndex <= 0) {
                        window.clearInterval(this.timer);
                        this.timer = null;
                        this.show = false;
                    }
                }, 100);
            }, 1000);
        }
    },
    mounted() {
        this.$bas.$on("downloadEvent", data => {
            // this.obj = data;
            this.$set(this, "obj", data);
            this.$nextTick(() => {
                this.lead();
            });
            console.log("this.obj", this.obj);
        });
    }
};
</script>
<style lang="less">
.download-icon {
    opacity: 0;
    font-size: 18px;
    background: #00b400 100%;
    width: 32px;
    height: 32px;
    display: flex;
    line-height: 32px !important;
    align-items: center;
    justify-content: center;
    color: #fff;
    border-radius: 100%;
    position: absolute;
    z-index: 999999999999;
}
</style>
