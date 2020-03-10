<template lang="html">
  <div class="dispute-view-negotiation">
    <JusElementSlider
      :key="sliderKey"
      v-model="value"
      :step="50"
      :max="(dispute.disputeUpperRange * 1.5)"
      :marks="marks"
      range />
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
      value: [0, 0
        // {
        //   label: '1P',
        //   value: this.dispute.lastOfferValue,
        //   date: '01/01/20'
        // },
        // {
        //   label: '1CP',
        //   value: this.dispute.lastCounterOfferValue,
        //   date: '02/01/20'
        // }
      ],
      marks: {},
      sliderKey: 0
    }
  },
  mounted () {
    this.marks[this.dispute.disputeUpperRange] = {
      label: this.$createElement('div', [this.$createElement('span', 'AM'), this.$createElement('span', this.$options.filters.currency(this.dispute.disputeUpperRange))])
    }
    this.$store.dispatch('getDisputeDTO', this.dispute.id).then(response => {
      let countP = 0
      let countCP = 0
      for (let offer of response.objects[0].offers) {
        if (parseFloat(offer.value)) {
          if (offer.role.party === 'RESPONDENT') {
            countP += 1
            this.marks[offer.value] = {
              label: this.$createElement('div', [this.$createElement('span', `P${countP}`), this.$createElement('span', this.$options.filters.currency(offer.value))])
            }
          } else {
            countCP += 1
            this.marks[offer.value] = {
              label: this.$createElement('div', [this.$createElement('span', `CP${countCP}`), this.$createElement('span', this.$options.filters.currency(offer.value))])
            }
          }
        }
      }
      this.sliderKey += 1
    })
  },
}
</script>

<style lang="scss">
.dispute-view-negotiation {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 60px;
}
</style>
