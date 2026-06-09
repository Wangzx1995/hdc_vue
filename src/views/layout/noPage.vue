<template>
    <div class="no-page" style="height:calc(100vh-94px)">
        <img src="/static/images/empty_image.png" alt="">
        <div>程序员正在加班处理中...</div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.no-page{
  height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img{
        width: 200px;
        height:200px;
    }
} 
</style>