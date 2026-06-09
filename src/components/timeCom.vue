<template>
    <div class="record-wrap" @click="openDialog">
        <div class="record-list">
            <div class="online-fragment-wrap">
                <ul class="online-fragment-list">
                    <li
                        v-for="item in fragment"
                        :key="item.id"
                        class="fragment-item"
                        :style="`width:${getFragmentWidth(
                            item
                        )}px; left:${getLeft(item.startTime)}px`"
                    ></li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "timeCom",
    props: {
        onlineTimeList: { type: Array, default: () => [] },
    },
    data() {
        return {
            width: 100,
        };
    },
    computed: {
        fragment() {
            return this.onlineTimeList.map((item, index) => {
                const startTime = item.startTime.replace(
                    new RegExp(/-/gm),
                    "/"
                );
                const endTime = item.endTime.replace(new RegExp(/-/gm), "/");
                return {
                    id: index,
                    startTime: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate(),
                        new Date(startTime).getHours(),
                        new Date(startTime).getMinutes(),
                        new Date(startTime).getSeconds()
                    ),
                    endTime: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate(),
                        new Date(endTime).getHours(),
                        new Date(endTime).getMinutes(),
                        new Date(endTime).getSeconds()
                    ),
                };
            });
        },
    },
    methods: {
        initData() {
            this.fragment = this.onlineTimeList.map((item, index) => {
                return {
                    id: index,
                    startTime: new Date(item.startTime),
                    endTime: new Date(item.endTime),
                };
            });
        },
        getFragmentWidth(item) {
            const ratio =
                (new Date(item.endTime).getTime() -
                    new Date(item.startTime).getTime()) /
                (1000 * 3600 * 24);
            return parseInt(ratio * this.width) == 0
                ? 0.1
                : parseInt(ratio * this.width);
        },
        getLeft(time) {
            const ratio =
                (new Date(time).getTime() -
                    new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate(),
                        0,
                        0,
                        0
                    ).getTime()) /
                (1000 * 3600 * 24);
            const left = parseInt(ratio * this.width);
            return left;
        },
        openDialog() {
            this.$emit("openDialog");
        },
    },
};
</script>
<style lang="scss" scoped>
.record-wrap {
    width: 100px;
    position: relative;
    // padding: 20px 0;
    cursor: pointer;
    .record-list {
        height: 15px;
        .online-fragment-wrap {
            position: relative;
            width: 100%;
            left: 0;
            height: 16px;
            background: rgba(228, 228, 228, 1);
            .online-fragment-list {
                position: absolute;
                padding: 0px;
                margin: 0px;
                .fragment-item {
                    position: absolute;
                    cursor: pointer;
                    height: 15px;
                    background-color: rgba(0, 204, 51, 1);
                    display: block;
                }
            }
        }
    }
}
</style>
