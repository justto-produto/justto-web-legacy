<template>
  <el-card :class="bgClass" class="jus-carousel-card el-card--bg-primary" shadow="never">
    {{ title | capitalize }} {{ subtitle }}
    <el-button type="transparent" @click="$router.push({name: slide.to, params: {slide: slide}})">
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
    title () {
      return this.slide.title + '.'
    },
    subtitle () {
      if (this.slide.subtitle) {
        return this.slide.subtitle + '.'
      }
    },
    bgClass () {
      switch (this.slide.color) {
        case 'purple':
          return 'el-card--bg-primary'
        case 'orange':
          return 'el-card--bg-secondary'
        case 'green':
          return 'el-card--bg-green'
        case 'blue':
          return 'el-card--bg-blue'
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
  direction: ltr;
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
    max-width: 121px;
    padding: 12px 16px;
  }
}
</style>
