<template>
  <el-carousel
    :interval="5000"
    :autoplay="false"
    arrow="always"
    height="107px"
    trigger="click"
    class="el-carousel__container--profile"
  >
    <el-carousel-item
      v-for="item in items"
      :key="item.title"
    >
      <div class="el-carousel__item-main">
        <h2>{{ item.title }}</h2>
        <span>Metas cumpridas<br>no mês</span>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: 'JusCarouselInfo',
  props: {
    items: {
      default: undefined,
      type: Array
    }
  }
}
</script>

<style lang="scss">
</style>
