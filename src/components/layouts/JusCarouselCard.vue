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
<<<<<<< HEAD
      if (this.slide && this.slide.title) {
        return this.slide.title + '.'
      }
      return ''
=======
      if (this.slide) {
        return this.slide.title + '.'
      }
>>>>>>> SAAS-449 Correge testes de components
    },
    subtitle () {
      if (this.slide && this.slide.subtitle) {
        return this.slide.subtitle + '.'
      }
      return ''
    },
    bgClass () {
<<<<<<< HEAD
      if (this.slide && this.slide.color) {
=======
      if (this.slide) {
>>>>>>> SAAS-449 Correge testes de components
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
<<<<<<< HEAD
=======
      }
    },
    button () {
      if (this.slide) {
        return this.slide.button
>>>>>>> SAAS-449 Correge testes de components
      }
    },
    button () {
      if (this.slide) {
        return this.slide.button
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
    max-width: 100px;
    padding: 12px 16px;
  }
}
</style>
