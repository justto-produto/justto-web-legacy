<template lang="html">
  <div
    v-loading="loading"
    class="dispute-view-negotiation"
  >
    <JusElementSlider
      v-if="!loading"
      :key="sliderKey"
      v-model="value"
      :min="min"
      :max="max"
      :marks="marks"
      range
    />
    <div class="subtitle">
      <span>AM:</span> <b>Alçada máxima</b>
      <div
        v-for="(sub, index) in subtitles"
        :key="index + sub.label"
      >
        <span>{{ sub.label }}:</span> <b>{{ sub.value }}</b>
      </div>
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
  data() {
    return {
      loading: false,
      value: [0, 0],
      marks: {},
      subtitles: [],
      sliderKey: 0,
      max: 0,
      min: 100000000
    }
  },
  watch: {
    dispute: {
      handler(value) {
        this.fetch()
      },
      deep: true
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    fetch() {
      this.loading = true
      this.subtitles = []
      this.marks[this.dispute.disputeUpperRange] = {
        label: this.$createElement('div', [this.$createElement('span', 'AM'), this.$createElement('span', `R$ ${parseInt(this.dispute.disputeUpperRange)}`)])
      }
      this.$store.dispatch('getDisputeDTO', this.dispute.id).then(response => {
        this.max = 0
        this.min = 100000000
        let countP = 0
        let countCP = 0
        let zIndex = 1
        for (const offer of response.objects[0].offers.sort((a, b) => {
          a = this.$moment(a.createAt.dateTime).unix()
          b = this.$moment(b.createAt.dateTime).unix()
          return (a > b ? 1 : -1)
        })) {
          if (offer.value) {
            if (offer.role.party === 'RESPONDENT') {
              countP += 1
              this.marks[parseFloat(offer.value)] = {
                label: this.$createElement('div', [this.$createElement('span', `P${countP} ${this.$options.filters.moment(offer.createAt.dateTime, 'DD/MM')}`), this.$createElement('span', `R$ ${parseInt(offer.value)}`)]),
                details: offer,
                zIndex
              }
              this.subtitles.push({ label: `P${countP}`, value: `Proposta ${countP}` })
            } else {
              countCP += 1
              // if (offer.value === '3050') {
              //   offer.value = '2700'
              // }
              this.marks[parseFloat(offer.value)] = {
                label: this.$createElement('div', [this.$createElement('span', `CP${countCP} ${this.$options.filters.moment(offer.createAt.dateTime, 'DD/MM')}`), this.$createElement('span', `R$ ${parseInt(offer.value)}`)]),
                details: offer,
                zIndex
              }
              this.subtitles.push({ label: `CP${countCP}`, value: `Contraproposta ${countCP}` })
            }
          }
          zIndex += 1
        }
        for (const mark of Object.keys(this.marks)) {
          if (mark > this.max) this.max = parseInt(mark)
          if (mark < this.min) this.min = parseInt(mark)
        }
        if (this.dispute.disputeUpperRange > this.max) this.max = this.dispute.disputeUpperRange
        if (this.dispute.disputeUpperRange < this.min) this.min = this.dispute.disputeUpperRange
        this.min = this.min - (this.max * 0.03)
        this.max = this.max * 1.03
        setTimeout(() => {
          this.subtitles = [...this.subtitles.sort((a, b) => a.label > b.label ? 1 : -1)]
          this.loading = false
          this.sliderKey += 1
        }, 200)
      }).catch(error => {
        this.$jusNotification({ error })
      })
    }
  }
}
</script>

<style lang="scss">
.dispute-view-negotiation {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  margin: 60px 60px 20px;
  .subtitle {
    align-self: flex-start;
    margin-top: 80px;
    span {
      display: inline-block;
      width: 34px;
    }
  }
}
</style>
