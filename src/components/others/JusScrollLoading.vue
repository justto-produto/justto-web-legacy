<template v-loading="loading">
  <el-button
    v-if="loading"
    class="jus-scroll-loading__loading"
    type="transparent"
  >
    Carregando
    <i class="el-icon-loading" />
  </el-button>

  <el-button
    v-else-if="ended"
    type="transparent"
    class="jus-scroll-loading__end-btn"
  >
    {{ empty ? emptyText : endText }}
  </el-button>

  <el-button
    v-else
    type="transparent"
    class="jus-scroll-loading__end-btn"
  >
    <span class="hidden-text">
      JUSTTO
    </span>
  </el-button>
</template>

<script>
function debounce(func, wait, immediate) {
  let timeout

  return function() {
    const context = this
    const args = arguments
    const later = function() {
      timeout = null

      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

export default {
  name: 'JusScrollLoading',

  props: {
    target: {
      type: String,
      required: true
    },

    ended: {
      type: Boolean,
      required: true
    },

    endText: {
      type: String,
      default: () => 'Fim das disputas'
    },

    empty: {
      type: Boolean,
      default: false
    },

    emptyText: {
      type: String,
      default: () => 'Sem disputas'
    },

    loading: {
      type: Boolean,
      default: false
    },

    reverse: {
      type: Boolean,
      default: false
    }
  },

  data() {
    const storageEventCb = this.handleEvent
    const debouncedCb = debounce(storageEventCb, 250)

    return {
      debouncedCb,
      scrollTarget: null,
      localDebounce: null
    }
  },

  mounted() {
    this.addEventListener()
  },

  beforeDestroy() {
    this.removeEventListener()
  },

  methods: {
    handleEvent(event) {
      if (Boolean(this.loading) || Boolean(this.ended)) return

      const { target: { offsetHeight, scrollTop, scrollHeight } } = event
      const height = offsetHeight * (this.reverse ? -1 : 1)
      const heightPercentage = parseInt(((height + scrollTop) / scrollHeight) * 100)

      console.log({ heightPercentage })

      if (this.reverse ? heightPercentage <= 30 : heightPercentage >= 70) {
        this.startLoading()
        this.$emit('load', this.loaded)
      }
    },

    startLoading() {
      this.$emit('update:loading', true)
    },

    loaded() {
      this.$emit('update:loading', false)
    },

    addEventListener() {
      try {
        this.scrollTarget = document.querySelector(this.target || '.tickets-container__tabs>.el-tabs__content')

        this.scrollTarget.addEventListener('scroll', this.debouncedCb)
      } catch (error) {
        console.error('Scroll não encontrado.')
      }
    },

    removeEventListener() {
      this.scrollTarget.removeEventListener('scroll', this.debouncedCb)
    },

    async resetScrollTarget() {
      await this.removeEventListener()
      await this.addEventListener()
    }
  }
}
</script>

<style lang="scss">
  .jus-scroll-loading__end-btn,
  .jus-scroll-loading__loading {
    width: 100%;
    cursor: default;

    .el-icon-loading {
      font-size: 1rem;
    }

    .hidden-text {
      visibility: hidden;
    }
  }
</style>
