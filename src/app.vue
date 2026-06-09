<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "app",
    mounted() {
        this.$nextTick(() => {
            // 先判断是不是微信端打开的
            if (/(micromessenger)/i.test(navigator.userAgent)) {
            } else {
                // 判断h5还是pc true就是h5
                let client =
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                        navigator.userAgent
                    );
                if (client) {
                    document.body.classList.add("h5-class");
                }
            }
        });
    },
};
</script>
