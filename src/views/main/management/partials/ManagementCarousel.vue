<template lang="html">
  <transition name="el-fade-in">
    <div v-show="componentKey > 0" class="view-management__carousel-container">
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
        <div v-for="(slide, index) in slides" v-if="slide.shows" :key="slide.title + index">
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
        title: 'sincronize seu WhatsApp para garantir que suas disputas terão mais engajamento',
        button: 'Resolver',
        to: 'profile',
        color: 'green',
        shows: this.$store.getters.whatsappStatus !== 'CONNECTED'
      }, {
        id: 'alertOne',
        title: 'disputas que a negociação encerra nos próximos 3 dias',
        subtitle: 'Entre em contato',
        button: 'Ver disputas',
        to: 'review',
        color: 'orange',
        shows: this.$store.getters.alertOne.length > 0
      }, {
        id: 'alertTwo',
        title: 'disputas sem e-mail válido',
        subtitle: 'Atualize os dados',
        button: 'Ver disputas',
        to: 'review',
        color: 'orange',
        shows: this.$store.getters.alertTwo.length > 0
      }, {
        id: 'alertThree',
        title: 'disputas com contraproposta até 20% acima da alçada',
        subtitle: 'Entre em contato',
        button: 'Ver disputas',
        to: 'review',
        color: 'orange',
        shows: this.$store.getters.alertThree.length > 0
      }, {
        id: 'alertFour',
        title: 'disputas com interações e sem contraproposta',
        subtitle: 'Entre em contato',
        button: 'Ver disputas',
        to: 'review',
        color: 'orange',
        shows: this.$store.getters.alertFour.length > 0
      }, {
        id: 'alertFive',
        title: 'disputas sem telefone válido',
        subtitle: 'Atualize os dados',
        button: 'Ver disputas',
        to: 'review',
        color: 'orange',
        shows: this.$store.getters.alertFive.length > 0
      }, {
        id: 'alertSix',
        title: 'disputas que nossas tentativas de engajamento encerraram',
        subtitle: 'Reinicie ou entre em contato',
        button: 'Ver disputas',
        to: 'review',
        color: 'orange',
        shows: this.$store.getters.alertSix.length > 0
      }, {
        id: 'alertSeven',
        title: 'disputas que precisam de sua revisão',
        button: 'Ver disputas',
        to: 'review',
        color: 'purple',
        shows: this.$store.getters.alertSeven.length > 0
      }]
    }
  },
  watch: {
    slides () {
      this.updateSlides()
    }
  },
  mounted () {
    this.updateSlides()
  },
  methods: {
    updateSlides () {
      this.componentKey = 0
      setTimeout(function () {
        this.componentKey = this.componentKey + 1
      }.bind(this), 800)
    },
    carouselIcons () {
      let nextIcon = require('@/assets/icons/ic-left.svg')
      let prevIcon = require('@/assets/icons/ic-right.svg')
      return ['<img src="' + prevIcon + '">', '<img src="' + nextIcon + '">']
    }
  }
}
</script>
