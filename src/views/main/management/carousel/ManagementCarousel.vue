<template lang="html">
  <transition name="el-fade-in">
    <div v-show="componentKey" class="view-management__carousel-container">
      <owl-carousel
        :key="componentKey"
        :items="items"
        :nav="true"
        :dots="false"
        :loop="false"
        :rewind="true"
        :margin="20"
        :mouse-drag="false"
        :touch-drag="false"
        :autoplay="false"
        :nav-text="carouselIcons()"
        class="view-management__carousel-slider">
        <div v-for="slide in filteredSlides" :key="slide.title">
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
      slides: [{
        title: 'Casos que a negociação encerra nos próximos 3 dias',
        subtitle: 'Entre em contato',
        button: 'Ver casos',
        to: 'review',
        color: 'orange',
        must: [ { 'terms': { 'disputestatus': ['IMPORTED', 'PENDING', 'ENRICHED', 'ENGAGEMENT', 'RUNNING'] } }, { 'range': { 'disputeexpirationdate': { 'gte': 'now/d', 'lte': 'now/d+3d' } } } ],
        shows: false
      }, {
        title: 'Casos sem e-mail válido',
        subtitle: 'Atualize os dados',
        button: 'Ver casos',
        to: 'review',
        color: 'orange',
        must: [ { 'terms': { 'disputestatus': ['IMPORTED', 'PENDING', 'ENRICHED', 'ENGAGEMENT', 'RUNNING'] } }, { 'match': { 'hasvalidemail': false } } ],
        shows: false
      }, {
        title: 'Casos com contraproposta até 20% acima da alçada',
        subtitle: 'Entre em contato',
        button: 'Ver casos',
        to: 'review',
        color: 'orange',
        must: [{ 'terms': { 'disputestatus': ['IMPORTED', 'PENDING', 'ENRICHED', 'ENGAGEMENT', 'RUNNING'] } }],
        filter: { 'range': { 'lastofferbyupperrangepercent': { 'gte': 100, 'lte': 120 } } },
        shows: false
      }, {
        title: 'Casos com interações e sem contraproposta',
        subtitle: 'Entre em contato',
        button: 'Ver casos',
        to: 'review',
        color: 'orange',
        must: [ { 'terms': { 'disputestatus': ['IMPORTED', 'PENDING', 'ENRICHED', 'ENGAGEMENT', 'RUNNING'] } }, { 'match': { 'disputehasinteractions': true } } ],
        shows: false
      }, {
        title: 'Casos sem celular válido',
        subtitle: 'Atualize os dados',
        button: 'Ver casos',
        to: 'review',
        color: 'orange',
        must: [ { 'terms': { 'disputestatus': ['IMPORTED', 'PENDING', 'ENRICHED', 'ENGAGEMENT', 'RUNNING'] } }, { 'match': { 'hasvalidphone': false } } ],
        shows: false
      }, {
        title: 'Casos que nossas tentativas de engajamento encerraram',
        subtitle: 'Reinicie ou entre em contato',
        button: 'Ver casos',
        to: 'review',
        color: 'orange',
        must: [ { 'match': { 'disputestatus': 'ENGAGEMENT' } }, { 'match': { 'communicationmsgtotalallsented': true } } ],
        shows: false
      }],
      componentKey: 0
    }
  },
  computed: {
    filteredSlides () {
      return this.slides.filter(slide => {
        return slide.shows
      })
    },
    items () {
      if (this.filteredSlides.length === 1) {
        return 1
      }
      return 2
    }
  },
  created () {
    let promises = []
    this.slides.forEach((slide, index) => {
      let query = { query: { bool: { must: slide.must } }, from: 0, size: 3000, order_by: 'favorite DESC' }
      if (slide.filter) {
        query.query.bool.filter = slide.filter
      }
      promises.push(this.$store.dispatch('getDisputes', query).then(response => {
        slide.shows = response.length > 0
      }))
    })
    promises.push(this.$store.dispatch('whatsappStatus').then((whatsapp) => {
      if (whatsapp.status !== 'CONNECTED') {
        this.slides.push({
          title: 'Sincronize seu WhatsApp para garantir que seus casos terão mais engajamento',
          button: 'Resolver',
          to: 'profile',
          color: 'green',
          shows: true
        })
      }
    }))
    Promise.all(promises).finally(() => {
      setTimeout(function () {
        this.componentKey = this.componentKey + 1
      }.bind(this), 1000)
    })
  },
  methods: {
    carouselIcons () {
      let prevIcon = require('@/assets/icons/ic-left.svg')
      let nextIcon = require('@/assets/icons/ic-right.svg')
      return ['<img src="' + prevIcon + '">', '<img src="' + nextIcon + '">']
    }
  }
}
</script>

<style lang="scss">
</style>
