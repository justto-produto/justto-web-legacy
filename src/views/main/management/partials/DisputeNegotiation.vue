<template lang="html">
  <div class="dispute-view-negotiation">
    <div class="negotiation-box">
      <JusElementSlider :step="50" :max="(this.dispute.disputeUpperRange * 1.5)" v-model="value" :marks="marks" range />
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
      }
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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  .negotiation-box {
    width: 100%;
    min-height: 300px;
  }
  .el-slider__bar {
    // display: none;
  }
  .el-slider__runway {
    height: 200px;
    background-color: #f1f1f1;
  }
  .el-slider__stop {
    left: 100%;
    height: 100%;
    background-color: #c2c2c2;
    border-radius: 0;
    width: 4px;
    &:before {
      content: ' ';
      position: absolute;
      display: block;
      width: 36px;
      height: 36px;
      top: -44px;
      left: -16px;
      background-color: #c2c2c2;
      border-radius: 50% 50% 50% 0;
      transform: perspective(40px) rotateX(20deg) rotateZ(-45deg);
    }
    &:after {
      content: ' ';
      position: absolute;
      display: block;
      width: 12px;
      height: 12px;
      bottom: -11px;
      left: -4px;
      border-radius: 100%;
      background-color: #c2c2c2;
    }
  }
  .el-slider__marks-text {
    height: 100%;
    margin: 0;
    white-space: nowrap;
    > div {
      color: #c2c2c2;
      height: 266px;
      position: relative;
      top: -30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      span {
        align-self: center;
      }
      :first-child {
        color: white;
      }
    }
  }
  .el-slider__button-wrapper {
    top: -41px;
    height: 274px;
    width: 2px;
  }
  .el-slider__button {
    height: 200px;
    border-style: dashed;
    background-color: transparent;
    border-color: #c2c2c2;
    border-radius: 0;
    transform: none !important;
    position: absolute;
    top: 41px;
    border-width: 0 0 0 4px;
    &:after {
      content: '>';
      display: block;
      color: #c2c2c2;
      transform: scaleY(2.6);
      position: absolute;
      font-size: 28px;
      top: 43%;
      left: 8px;
    }
    &:before {
      content: '<';
      display: block;
      color: #c2c2c2;
      position: absolute;
      font-size: 28px;
      transform: scaleY(2.6);
      top: 43%;
      padding-right: 10px;
      left: -28px;
    }
  }
}
</style>
