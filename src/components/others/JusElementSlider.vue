<template>
  <div
    :class="{ 'is-vertical': vertical, 'el-slider--with-input': showInput }"
    class="el-slider el-slider--negotiation"
    role="slider"
  >
    <div
      ref="slider"
      :class="{ 'show-input': showInput, 'disabled': sliderDisabled }"
      :style="runwayStyle"
      class="el-slider__runway"
      @click="onSliderClick"
    >
      <JusElementButton
        v-if="firstValue"
        ref="button1"
        v-model="firstValue"
        :vertical="vertical"
        :object="firstObj"
        :tooltip-class="tooltipClass"
      />
      <JusElementButton
        v-if="range && secondValue"
        ref="button2"
        v-model="secondValue"
        :vertical="vertical"
        :object="secondObj"
        :tooltip-class="tooltipClass"
      />
      <div
        v-for="(item, key) in stops"
        v-show="showStops"
        :key="key"
        :style="getStopStyle(item)"
        class="el-slider__stop"
      />
      <template v-if="markList.length > 0">
        <div>
          <div
            v-for="(item, key) in markList"
            :key="key"
            :style="getStopStyle(item.position)"
            class="el-slider__stop el-slider__marks-stop"
          />
        </div>
        <div class="el-slider__marks">
          <div
            v-for="(item, key) in markList"
            :key="key"
            class="hover"
          >
            <JusElementMarker
              :mark="item.mark"
              :style="getStopStyle(item.position, item.mark.zIndex)"
            />
            <div
              v-if="item.mark.details"
              :style="getStopStyle(item.position)"
              class="details"
            >
              <b>Data</b>
              <div>{{ item.mark.details.createAt.dateTime | moment('DD/MM/YY') }}</div>
              <b>Nome</b>
              <div>{{ item.mark.details.role.name }}</div>
              <b>Função</b>
              <div>{{ buildRoleTitle(item.mark.details.role.party, item.mark.details.role.roles[0]) }}</div>
              <b>Valor</b>
              <div>{{ item.mark.details.value | currency }}</div>
            </div>
            <div
              v-if="item.mark.details"
              :style="diffToAmBarStyle(item)"
              class="el-slider__diff-bar el-slider__bar bar"
            >
              <div
                :class="{ 'reverse': (amMark.point >= item.point) }"
                class="collapse"
              >
                <i
                  v-if="item.point >= amMark.point"
                  class="el-icon-top"
                />
                <i
                  v-else
                  class="el-icon-bottom"
                />
                {{ Math.round(((diffToAmBar(item)) * 100) / amMark.point) }}%
                <br>
                R$ {{ diffToAmBar(item) }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import JusElementButton from './JusElementButton.vue'
import JusElementMarker from './JusElementMarker'
import Emitter from 'element-ui/src/mixins/emitter'
import { buildRoleTitle } from '@/utils'

export default {
  name: 'JusElementSlider',
  components: {
    JusElementButton,
    JusElementMarker
  },
  mixins: [Emitter],
  inject: {
    elForm: {
      default: ''
    }
  },
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    value: {
      type: [Number, Array],
      default: 0
    },
    showInput: {
      type: Boolean,
      default: false
    },
    showInputControls: {
      type: Boolean,
      default: true
    },
    inputSize: {
      type: String,
      default: 'small'
    },
    showStops: {
      type: Boolean,
      default: false
    },
    showTooltip: {
      type: Boolean,
      default: true
    },
    formatTooltip: {
      type: Function,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    range: {
      type: Boolean,
      default: false
    },
    vertical: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: ''
    },
    debounce: {
      type: Number,
      default: 300
    },
    label: {
      type: String,
      default: ''
    },
    tooltipClass: {
      type: String,
      default: ''
    },
    marks: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      firstValue: null,
      firstObj: null,
      secondValue: null,
      secondObj: null,
      oldValue: null,
      dragging: false,
      sliderSize: 1
    }
  },
  computed: {
    // amValue () {
    //   return Math.abs(this.markList[0].point - this.maxValue)
    // },
    // am2Value () {
    //   return Math.abs(this.markList[0].point - this.minValue)
    // },
    // diffValue () {
    //   return Math.abs(this.firstValue - this.secondValue)
    // },
    stops() {
      if (!this.showStops || this.min > this.max) return []
      if (this.step === 0) {
        process.env.NODE_ENV !== 'production' &&
          console.warn('[Element Warn][Slider]step should not be 0.')
        return []
      }
      const stopCount = (this.max - this.min) / this.step
      const stepWidth = 100 * this.step / (this.max - this.min)
      const result = []
      for (let i = 1; i < stopCount; i++) {
        result.push(i * stepWidth)
      }
      if (this.range) {
        return result.filter(step => {
          return step < 100 * (this.minValue - this.min) / (this.max - this.min) ||
              step > 100 * (this.maxValue - this.min) / (this.max - this.min)
        })
      } else {
        return result.filter(step => step > 100 * (this.firstValue - this.min) / (this.max - this.min))
      }
    },
    markList() {
      if (!this.marks) {
        return []
      }
      const marksKeys = Object.keys(this.marks)
      return marksKeys.map(parseFloat)
        .sort((a, b) => a - b)
        .filter(point => point <= this.max && point >= this.min)
        .map(point => ({
          point,
          position: (point - this.min) * 100 / (this.max - this.min),
          mark: this.marks[point]
        }))
    },
    minValue() {
      return Math.min(this.firstValue, this.secondValue)
    },
    maxValue() {
      return Math.max(this.firstValue, this.secondValue)
    },
    // barSize () {
    //   return this.range
    //     ? `${100 * (this.maxValue - this.minValue) / (this.max - this.min)}%`
    //     : `${100 * (this.firstValue - this.min) / (this.max - this.min)}%`
    // },
    // amBarSize () {
    //   return `${100 * (this.markList[0].point - this.maxValue) / (this.max - this.min)}%`
    // },
    // am2BarSize () {
    //   return `${100 * (this.markList[0].point - this.minValue) / (this.max - this.min)}%`
    // },
    // barStart () {
    //   return this.range
    //     ? `${100 * (this.minValue - this.min) / (this.max - this.min)}%`
    //     : '0%'
    // },
    // amBarStart () {
    //   return `${100 * (this.maxValue - this.min) / (this.max - this.min)}%`
    // },
    // am2BarStart () {
    //   return `${100 * (this.minValue - this.min) / (this.max - this.min)}%`
    // },
    precision() {
      const precisions = [this.min, this.max, this.step].map(item => {
        const decimal = ('' + item).split('.')[1]
        return decimal ? decimal.length : 0
      })
      return Math.max.apply(null, precisions)
    },
    runwayStyle() {
      return this.vertical ? { height: this.height } : {}
    },
    // barStyle () {
    //   return this.vertical
    //     ? {
    //       height: this.barSize,
    //       bottom: this.barStart
    //     } : {
    //       width: this.barSize,
    //       left: this.barStart
    //     }
    // },
    // amBarStyle () {
    //   return {
    //     width: this.amBarSize,
    //     left: this.amBarStart
    //   }
    // },
    // am2BarStyle () {
    //   return {
    //     width: this.am2BarSize,
    //     left: this.am2BarStart
    //   }
    // },
    sliderDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    },
    amMark() {
      for (const value of Object.values(this.markList)) {
        if (value.mark && !value.mark.details) return value
      }
      return 0
    }
  },
  watch: {
    value(val, oldVal) {
      if (this.dragging ||
          (Array.isArray(val) &&
          Array.isArray(oldVal) &&
          val.every((item, index) => item === oldVal[index]))) {
        return
      }
      this.setValues()
    },
    dragging(val) {
      if (!val) {
        this.setValues()
      }
    },
    firstValue(val) {
      if (this.range) {
        this.$emit('input', [this.firstValue, this.secondValue])
      } else {
        this.$emit('input', val)
      }
    },
    secondValue() {
      if (this.range) {
        this.$emit('input', [this.firstValue, this.secondValue])
      }
    },
    min() {
      this.setValues()
    },
    max() {
      this.setValues()
    }
  },
  mounted() {
    if (this.range) {
      if (Array.isArray(this.value) && this.value.length) {
        this.firstValue = Math.max(this.min, this.value[0].value)
        this.firstObj = this.value[0]
        this.secondValue = Math.min(this.max, this.value[1].value)
        this.secondObj = this.value[1]
      } else {
        this.firstValue = this.min
        this.secondValue = this.max
      }
      this.oldValue = [this.firstValue, this.secondValue]
    } else {
      if (typeof this.value !== 'number' || isNaN(this.value)) {
        this.firstValue = this.min
      } else {
        this.firstValue = Math.min(this.max, Math.max(this.min, this.value))
      }
      this.oldValue = this.firstValue
    }
    this.resetSize()
    window.addEventListener('resize', this.resetSize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resetSize)
  },
  methods: {
    buildRoleTitle: (...i) => buildRoleTitle(...i),
    diffToAmBar(item) {
      return Math.abs(this.amMark.point - item.point)
    },
    diffToAmBarStyle(item) {
      const barSize = `${Math.abs(100 * (this.amMark.point - item.point) / (this.max - this.min))}%`
      let barStart
      if (item.point < this.amMark.point) {
        barStart = `${item.position}%`
      } else {
        barStart = `${this.amMark.position}%`
      }
      return {
        width: barSize,
        left: barStart
      }
    },
    valueChanged() {
      if (this.range) {
        return ![this.minValue, this.maxValue]
          .every((item, index) => item === this.oldValue[index])
      } else {
        return this.value !== this.oldValue
      }
    },
    setValues() {
      if (this.min > this.max) {
        console.error('[Element Error][Slider]min should not be greater than max.')
        return
      }
      const val = this.value
      if (this.range && Array.isArray(val)) {
        if (val[1] < this.min) {
          this.$emit('input', [this.min, this.min])
        } else if (val[0] > this.max) {
          this.$emit('input', [this.max, this.max])
        } else if (val[0] < this.min) {
          this.$emit('input', [this.min, val[1]])
        } else if (val[1] > this.max) {
          this.$emit('input', [val[0], this.max])
        } else {
          this.firstValue = val[0]
          this.secondValue = val[1]
          if (this.valueChanged()) {
            this.dispatch('ElFormItem', 'el.form.change', [this.minValue, this.maxValue])
            this.oldValue = val.slice()
          }
        }
      } else if (!this.range && typeof val === 'number' && !isNaN(val)) {
        if (val < this.min) {
          this.$emit('input', this.min)
        } else if (val > this.max) {
          this.$emit('input', this.max)
        } else {
          this.firstValue = val
          if (this.valueChanged()) {
            this.dispatch('ElFormItem', 'el.form.change', val)
            this.oldValue = val
          }
        }
      }
    },
    setPosition(percent) {
      const targetValue = this.min + percent * (this.max - this.min) / 100
      if (!this.range) {
        this.$refs.button1.setPosition(percent)
        return
      }
      let button
      if (Math.abs(this.minValue - targetValue) < Math.abs(this.maxValue - targetValue)) {
        button = this.firstValue < this.secondValue ? 'button1' : 'button2'
      } else {
        button = this.firstValue > this.secondValue ? 'button1' : 'button2'
      }
      this.$refs[button].setPosition(percent)
    },
    onSliderClick(event) {
      // if (this.sliderDisabled || this.dragging) return
      // this.resetSize()
      // if (this.vertical) {
      //   const sliderOffsetBottom = this.$refs.slider.getBoundingClientRect().bottom
      //   this.setPosition((sliderOffsetBottom - event.clientY) / this.sliderSize * 100)
      // } else {
      //   const sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left
      //   this.setPosition((event.clientX - sliderOffsetLeft) / this.sliderSize * 100)
      // }
      // this.emitChange()
    },
    resetSize() {
      if (this.$refs.slider) {
        this.sliderSize = this.$refs.slider[`client${this.vertical ? 'Height' : 'Width'}`]
      }
    },
    getStopStyle(position, zIndex) {
      return {
        left: position + '%',
        'z-index': zIndex
      }
    }
  }
}
</script>
