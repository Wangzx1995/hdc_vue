<template>
    <div>
        <div
        class="siginOnPageBg"         
        v-loading="loading"
        element-loading-text="Loading..."
        element-loading-spinner="el-icon-loading">

        </div>
    </div>
</template>
<script>
    import Storage from '@/utils/sessionStorage'
    import store from '@/store'
    export default {
        name: 'signOnPage',
        components: {},
        data (){
            return{
                loading:true,
            }
        },
        watch: {},
        computed: {},
        methods: {
          loginWithToken(data){
            //如果没有参数
            // console.log(data.join(''));
            if(!data){
                this.$router.push({ path: '/login' });
                // window.location.href = data.upcUrl;
                return;
            }
            localStorage.removeItem('otatoken')   
            this.$store.dispatch('LoginWithToken', data.upc).then(response => {
              if(data.code=="200" && data.success==true){
                this.loading = false;
                this.$router.push({ path: '/' });
                // window.location.reload();
                Storage.set('urlPrefix', process.env.VUE_APP_BASE_API);
                Storage.set('platformType',0)
                try {
                    var reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
                    Storage.set('requestIp', reg.exec(window.location.href)[0]);
                }catch (e) {
                    Storage.set('requestIp', '/');
                }
              }else{
                  this.$router.push({ path: '/login' });
              }
            }).catch(response => {
              this.loading = false;
            });
          },
        },
        mounted(){
        },
        created(){
            //获取问号后的参数
            let data = this.$route.query;
            console.log(data);
            if(!!data.userLanguage){
                this.$i18n.locale = data.userLanguage ;
                window.localStorage.setItem('userLanguage', data.userLanguage)
            }
            if(!!data.upcUrl){
                window.localStorage.setItem('upcUrl', data.upcUrl)
            }
            this.loginWithToken(data);
        }
    }
</script>
<style lang="less" scoped>
.siginOnPageBg{
    min-height: 100vh;
}

</style>
