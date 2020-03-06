<template lang="html">
  <div class="dispute-view-negotiation">
    <div>
      <h2>Valor (R$)</h2>
      <br>
      <JusElementSlider
        v-model="value"
        :step="50"
        :max="(dispute.disputeUpperRange * 1.5)"
        :marks="marks"
        range />
    </div>
    <br><br><br>
    <div>
      <h2>Obrigação a fazer</h2>
      <br>
      <el-slider
        v-model="value2"
        :step="10"
        show-stops />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DisputeNegotiation',
  components: {
    JusElementSlider: () => import('@/components/others/JusElementSlider')
  },
  props: {
    dispute: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      offers: [],
      boundaries: [],
      value: [{
        label: '1P',
        value: this.dispute.lastOfferValue,
        date: '01/01/20'
      },
      {
        label: '1CP',
        value: this.dispute.lastCounterOfferValue,
        date: '02/01/20'
      }],
      marks: {
        [this.dispute.disputeUpperRange]: {
          label: this.$createElement('div', [this.$createElement('span', 'AM'), this.$createElement('span', 'R$' + this.dispute.disputeUpperRange)])
        }
      },
      value2: 0
    }
  },
  mounted () {
    this.$store.dispatch('getDisputeDTO', this.dispute.id).then(response => {
      this.offers = response.objects[0].offers
      this.boundaries = response.objects[0].boundarys
    })
  }
}
</script>

<style lang="scss">
.dispute-view-negotiation {
  height: 100%;
  padding: 30px 60px;
}
</style>
