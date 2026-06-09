<template>
    <div class="app-wrapper box-shadow box-shadow-z10">
        <Headbar></Headbar>
        <div class="app-content">
            <AppMain></AppMain>
        </div>
        <DownloadLead></DownloadLead>
    </div>
</template>

<script>
import { Headbar, AppMain } from "@/views/layout";
import { mapGetters } from "vuex";
    import DownloadLead from '@/components/downloadLead';
    export default {
    name: "layout",
    components: {
        Headbar,
        AppMain,
        DownloadLead
    },
    computed: {
        ...mapGetters(["current_page"]),
        sidebar() {
            return this.$store.state.app.sidebar;
        },
    },
};
</script>
