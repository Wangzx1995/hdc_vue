<template>
    <div class="navbar-brand">
        <div class="logo">
            <img
                v-if="!!state.app.logo"
                :src="state.app.logo"
                height="30"
                width="65"
                alt=""
                class="m-r-md"
            />
            <span class="">
                <span>{{ state.app.name }}</span
                >{{ state.app.title }}
            </span>
            <el-tag v-if="!!state.app.version">{{ state.app.version }}</el-tag>
        </div>
    </div>
</template>

<script>
export default {
    name: "brand",
    computed: {
        state() {
            return this.$store.state.app;
        },
    },
};
</script>
