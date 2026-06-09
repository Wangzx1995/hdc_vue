<template>
    <div class="signal-strength">
        <ul>
            <li
                v-for="i in 5"
                :key="i"
                :style="{
                    background: '' + (i <= strength ? '#409eff' : '#cccccc') + ''
                }"
            ></li>
        </ul>
    </div>
</template>

<script>
export default {
    name: `SignalStrength`,
    props: {
        // 信号强度，默认满格信号
        strength: {
            type: Number,
            default: 0
        }
    }
};
</script>

<style lang="less" scoped>
.signal-strength {
    width: 24px;
    height: 18px;
    display: inline-block;
}
ul {
    position: relative;
    width: 100%;
    height: 100%;
}
li {
    width: 4px;
    position: absolute;
    bottom: 0;
    border-radius: 10px;
}
ul li:nth-child(1) {
    height: 6px;
    left: 0px;
}
ul li:nth-child(2) {
    height: 9px;
    left: 5px;
}
ul li:nth-child(3) {
    height: 12px;
    left: 10px;
}
ul li:nth-child(4) {
    height: 15px;
    left: 15px;
}
ul li:nth-child(5) {
    height: 18px;
    left: 20px;
}
</style>
