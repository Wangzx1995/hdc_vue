<template>
  <div class="empty-box">
    <img :src="img">
    <slot name="description"></slot>
  </div>
</template>
<script>
import img from '@/assets/img/empty1.png'
export default {
  data(){
    return {
      img
    }
  }
}
</script>
<style lang="less" scoped>
.empty-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  img{
    width: 280px;
  }
}
</style>