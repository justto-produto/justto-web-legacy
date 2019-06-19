<template>
  <el-card :class="bgClass" class="jus-carousel-card el-card--bg-primary" shadow="never">
    {{ title | capitalize }} {{ subtitle }}
    <el-button type="transparent" @click="$router.push({name: slide.to, params: {slide: slide}})">
      {{ button }}
    </el-button>
  </el-card>
</template>

<script>
export default {
  name: 'JusCarouselCard',
  props: {
    slide: {
      type: Object,
      // eslint-disable-next-line
      default () { return new Object() }
    }
  },
  computed: {
    title () {
      if (this.slide && this.slide.title) {
        return this.slide.title + '.'
      }
      return ''
    },
    subtitle () {
      if (this.slide && this.slide.subtitle) {
        return this.slide.subtitle + '.'
      }
      return ''
    },
    button () {
      if (this.slide && this.slide.button) {
        return this.button
      }
      return ''
    },
    bgClass () {
      if (this.slide && this.slide.color) {
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
      return ''
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
    max-width: 100px;
    padding: 12px 16px;
  }
}
</style>
