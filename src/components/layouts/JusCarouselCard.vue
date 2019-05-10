<template>
  <el-card :class="bgClass" class="jus-carousel-card el-card--bg-primary" shadow="never">
    {{ slide.title }} {{ slide.subtitle }}
    <el-button type="transparent" @click="$router.push({name: 'review', params: {slide: slide}})">
      {{ slide.button }}
    </el-button>
  </el-card>
</template>

<script>
export default {
  name: 'JusCarouselCard',
  props: {
    slide: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    bgClass () {
      switch (this.slide.color) {
        case 'orange':
        return 'el-card--bg-secondary'
        default:
        return 'el-card--bg-primary'
      }
    }
  }
}
</script>

<style lang="scss">
.jus-carousel-card {
  width: 100%;
  font-weight: 300;
  height: 90px;
  .el-card__body {
    text-align: justify;
    padding: 0px 20px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-button {
    margin-left: 20px;
    max-width: 100px;
    padding: 12px 16px;
  }
}
</style>
