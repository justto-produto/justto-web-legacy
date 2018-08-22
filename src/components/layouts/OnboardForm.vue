<template>
  <div class="onboard-form-layout">
    <swiper :options="swiperOption">
      <swiper-slide>
        <slot name="child1"></slot>
      </swiper-slide>
       <swiper-slide>
         <slot name="child2"></slot>
       </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
export default {
  name: 'OnboardForm',
  data () {
    return {
      swiperOption: {
        direction: 'vertical',
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      }
    }
  }
}
</script>

<style lang="scss">
.onboard-form-layout{
}
</style>
