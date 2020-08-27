<template>
  <section
    id="dispute-code"
    class="dispute-code"
    @click="handleEvent('click')">
    <el-tooltip
      :content="status.text"
      placement="right">
      <span>
        <el-link
          class="dispute-code__proccess-link"
          :underline="false"
          @mouseover.native="handleEvent('hover')">
          <span :style="customStyle">
            {{ code }}
          </span>
          <i
            :class="status.icon"
            class="dispute-code__icon"
          />
        </el-link>
      </span>
    </el-tooltip>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    code: {
      type: String,
      required: true,
    },
    customStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapGetters(['disputeTimeline']),

    status() {
      let res = {}
      if (this.disputeTimeline[this.code]) {
        if (this.disputeTimeline[this.code].lawsuits.length) {
          res = {
            available: true,
            icon: 'el-icon-info',
            text: 'Abrir Timeline da disputa.',
          }
        } else {
          res = {
            available: false,
            icon: 'el-icon-error',
            text: 'Disputa não encontrada no TJ.',
          }
        }
      } else {
        res = {
          available: false,
          icon: 'el-icon-loading',
          text: 'Carregando dados da disputa.',
        }
      }

      return res
    },
  },
  methods: {
    handleEvent(event) {
      this.$emit(event)
    },
    handleClick() {
      if (this.status.available) {
        this.$emit('click')
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.dispute-code {
  background: transparent !important;
  width: 100%;

  .dispute-code__proccess-link {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-link--inner {
      font-size: 12px;
      width: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .el-icon-loading { color: $--color-text-secondary; }
      .el-icon-error { color: $--color-danger; }
    }

    .dispute-code__icon { visibility: hidden; }
    .el-link--inner { word-break: break-all; }
  }

  &:hover .dispute-code__proccess-link .dispute-code__icon {
    visibility: visible;
  }
}
</style>
