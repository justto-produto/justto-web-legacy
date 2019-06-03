<template lang="html">
  <transition name="el-fade-in">
    <div v-show="componentKey" class="view-management__carousel-container">
      <owl-carousel
        :key="componentKey"
        :items="2"
        :nav="true"
        :dots="false"
        :loop="false"
        :rewind="true"
        :margin="20"
        :rtl="true"
        :mouse-drag="false"
        :touch-drag="false"
        :autoplay="false"
        :nav-text="carouselIcons()"
        class="view-management__carousel-slider">
        <div v-for="slide in slides" v-if="slide.length" :key="slide.title">
          <jus-carousel-card :slide="slide" />
        </div>
      </owl-carousel>
    </div>
  </transition>
</template>

<script>
import OwlCarousel from 'vue-owl-carousel'
import JusCarouselCard from '@/components/layouts/JusCarouselCard'

export default {
  name: 'ManagementCarousel',
  components: { OwlCarousel, JusCarouselCard },
  data () {
    return {
      componentKey: 0
    }
  },
  computed: {
    slides () {
      return [{
        title: 'caso(s) que a negociação encerra nos próximos 3 dias',
        subtitle: 'Entre em contato',
        button: 'Ver casos',
        to: 'review',
        color: 'orange',
        length: this.$store.getters.prescriptionOne.length
      }, {
        title: 'caso(s) sem e-mail válido',
        subtitle: 'Atualize os dados',
        button: 'Ver casos',
        to: 'review',
        color: 'orange',
        length: this.$store.getters.prescriptionTwo.length
      }, {
        title: 'caso(s) com contraproposta até 20% acima da alçada',
        subtitle: 'Entre em contato',
        button: 'Ver casos',
        to: 'review',
        color: 'orange',
        length: this.$store.getters.prescriptionThree.length
      }, {
        title: 'caso(s) com interações e sem contraproposta',
        subtitle: 'Entre em contato',
        button: 'Ver casos',
        to: 'review',
        color: 'orange',
        length: this.$store.getters.prescriptionFour.length
      }, {
        title: 'caso(s) sem celular válido',
        subtitle: 'Atualize os dados',
        button: 'Ver casos',
        to: 'review',
        color: 'orange',
        length: this.$store.getters.prescriptionFive.length
      }, {
        title: 'caso(s) que nossas tentativas de engajamento encerraram',
        subtitle: 'Reinicie ou entre em contato',
        button: 'Ver casos',
        to: 'review',
        color: 'orange',
        length: this.$store.getters.prescriptionSix.length
      }, {
        title: 'caso(s) que precisam de sua revisão',
        button: 'Ver casos',
        to: 'review',
        color: 'purple',
        length: this.$store.getters.prescriptionSeven.length
      }, {
        title: 'sincronize seu WhatsApp para garantir que seus casos terão mais engajamento',
        button: 'Resolver',
        to: 'profile',
        color: 'green',
        length: this.$store.getters.whatsappStatus !== 'CONNECTED'
      }]
    }
  },
  watch: {
    slides () {
      this.componentKey = this.componentKey + 1
    }
  },
  // created () {
  //   let promises = []
  //   this.slides.forEach((slide, index) => {
  //     let query = { query: { bool: { } }, from: 0, size: 3000, order_by: 'favorite DESC' }
  //     if (slide.filter) {
  //       query.query.bool.filter = slide.filter
  //     }
  //     if (slide.must) {
  //       query.query.bool.must = slide.must
  //     }
  //     if (slide.should) {
  //       query.query.bool.should = slide.should
  //     }
  //     if (slide.minimum_should_match) {
  //       query.query.bool.minimum_should_match = slide.minimum_should_match
  //     }
  //     promises.push(this.$store.dispatch('getDisputes', query).then(response => {
  //       slide.shows = response.length > 0
  //       slide.casesLength = response.length
  //     }))
  //   })
  //   promises.push(this.$store.dispatch('getWhatsappStatus').then((whatsapp) => {
  //     if (whatsapp.status !== 'CONNECTED') {
  //       this.slides.push({
  //         title: 'sincronize seu WhatsApp para garantir que seus casos terão mais engajamento',
  //         button: 'Resolver',
  //         to: 'profile',
  //         color: 'green',
  //         shows: true
  //       })
  //     }
  //   }))
  //   Promise.all(promises).finally(() => {
  //     setTimeout(function () {
  //       this.componentKey = this.componentKey + 1
  //     }.bind(this), 1000)
  //   })
  // },
  methods: {
    carouselIcons () {
      let nextIcon = require('@/assets/icons/ic-left.svg')
      let prevIcon = require('@/assets/icons/ic-right.svg')
      return ['<img src="' + prevIcon + '">', '<img src="' + nextIcon + '">']
    }
  }
}
</script>

<style lang="scss">
</style>
