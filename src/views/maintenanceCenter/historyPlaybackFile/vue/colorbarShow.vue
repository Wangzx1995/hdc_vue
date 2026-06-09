<template>
    <div class="flex-layout flex-middle" style="height:38px">
        <div>{{ range[0] }}</div>
        <div class="content-bar m-l flex-layout" id="bar" :style="{ width: width + 'px' }">
            <div class="bar" v-for="(style, index) in barStyleList" :style="style"></div>
            <div class="tip" v-for="(style, index) in styleList" :style="{ left: style.left }">{{ valueList[index] }}</div>
            <div class="slide" v-for="(style, index) in styleList" :style="style" :id="`bar-${index}`"></div>
        </div>
        <div class="m-l">{{ range[1] }}</div>
    </div>
</template>
<script>
import {debounce} from '@/utils/controlFn.js'
export default {
    name: "colorbarShow",
    props: {
        range: {
            type: Array,
            default: () => {
                return [0, 150];
            }
        },
        width: {
            type: Number,
            default: 200
        },
        colorList: {
            type: Array,
            default: () => {
                return ["black", "blue", "red", "yellow"];
            }
        },
        valueList: {
            type: Array,
            default: () => {
                return [20, 50];
            }
        }
    },
    model: {
        prop: "valueList",
        event: "changeValueList"
    },
    data() {
        return {
            zIndex: 100
        };
    },
    computed: {
        barStyleList() {
            if (this.colorList.length <= 1) {
                return [];
            }
            let barStyleList = [];
            this.colorList.forEach((color, index) => {
                let style = {
                    background: color,
                    height: "10px"
                };
                if (index !== this.colorList.length - 1) {
                    style.left = this.cusLeft(this.valueList[index]);
                }
                barStyleList.push(style);
            });
            barStyleList.forEach((item, index) => {
                if (index === 0) {
                    item.width = barStyleList[index].left + 8 + "px";
                } else if (index === barStyleList.length - 1) {
                    item.width = this.width - barStyleList[barStyleList.length - 2].left - 8 + "px";
                } else {
                    item.width = barStyleList[index].left - barStyleList[index - 1].left + "px";
                }
            });
            return barStyleList;
        },
        styleList() {
            if (this.colorList.length <= 1) {
                return [];
            }
            let styleList = [];
            this.colorList.forEach((color, index) => {
                if (index < this.colorList.length - 1) {
                    let style = {
                        borderTopColor: color,
                        borderLeftColor: color,
                        borderRightColor: this.colorList[index + 1],
                        borderBottomColor: this.colorList[index + 1],
                        left: this.cusLeft(this.valueList[index]) + "px"
                    };
                    styleList.push(style);
                }
            });
            return styleList;
        }
    },
    watch: {
        styleList: {
            handler() {
                this.$nextTick(() => {
                    debounce(this.bindMove, 500);
                });
            },
            deep: true
        }
    },
    methods: {
        cusValue(left) {
            return Math.ceil(((left + 8) / this.width) * (this.range[1] - this.range[0]));
        },
        cusLeft(value) {
            let total = this.range[1] - this.range[0];
            return Math.ceil(this.width * ((value - this.range[0]) / total)) - 8;
        },
        bindMove() {
            let domList = [...document.getElementsByClassName("slide")];
            domList.forEach(dom => {
                let index = Number(dom.id.split("-")[1]);
                dom.onmousedown = ({ clientX }) => {
                    this.zIndex++;
                    dom.style.zIndex = this.zIndex;
                    let xstart = clientX;
                    let oValue = this.cusLeft(this.valueList[index]);
                    document.onmousemove = e => {
                        let xend = e.clientX;
                        let move = xend - xstart;
                        let nValue = oValue + move;
                        let maxRange;
                        let minRange;
                        if (index === 0) {
                            maxRange = this.cusLeft(this.valueList[index + 1]);
                            minRange = -8;
                        } else if (index === this.valueList.length - 1) {
                            maxRange = this.width - 8;
                            minRange = this.cusLeft(this.valueList[index - 1]);
                        } else {
                            maxRange = this.cusLeft(this.valueList[index + 1]);
                            minRange = this.cusLeft(this.valueList[index - 1]);
                        }
                        if (nValue > maxRange) {
                            nValue = maxRange;
                        }
                        if (nValue < minRange) {
                            nValue = minRange;
                        }
                        this.$set(this.valueList, index, this.cusValue(nValue));
                        this.$emit("changeValueList", this.valueList);
                    };
                    document.onmouseup = () => {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                    return false; 
                };
            });
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.bindMove();
        });
    }
};
</script>

<style lang="less" scoped>
.content-bar {
    height: 10px;
    position: relative;
    border-radius: 6px;
    .slide {
        position: absolute;
        top: -2px;
        width: 16px;
        height: 16px;
        background: white;
        border-radius: 50%;
        cursor: pointer;
        border-style: solid;
        border-width: 2px;
        z-index: 100;
        transform: rotate(-45deg);
    }
    .slide-one {
        left: -7px;
    }
    .slide-two {
        left: 10px;
    }
    .slide-three {
        left: 30px;
    }
    .bar {
        height: 10px;
        border-radius: 6px;
    }
    .tip {
        position: absolute;
        top: -23px;
        width: 70px;
    }
}
</style>
