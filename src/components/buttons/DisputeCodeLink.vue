<template>
  <section
    id="dispute-code"
    class="dispute-code"
  >
    <el-tooltip
      :content="status.text"
      placement="right"
    >
      <span>
        <el-link
          class="dispute-code__proccess-link"
          :underline="false"
          @mouseover.native="handleHover"
        >
          <div :style="customStyle">
            <span @click="handleClick">
              {{ code }}
            </span>
            <i
              class="el-icon-copy-document dispute-code__icon"
              @click="copyProccessCode"
            />
          </div>
          <JusTjIdentifier
            :code="code"
            :disabled="!isJusttoAdmin"
            :placement="tjPlacement"
            class="dispute-code__icon"
          />
          <i
            :class="status.icon"
            class="dispute-code__icon"
            :style="customIconStyle"
          />
        </el-link>
      </span>
    </el-tooltip>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    JusTjIdentifier: () => import('@/components/others/JusTjIdentifier')
  },

  props: {
    code: {
      type: String,
      required: true
    },
    customStyle: {
      type: Object,
      default: () => ({})
    },
    customIconStyle: {
      type: Object,
      default: () => ({})
    },
    tjPlacement: {
      type: String,
      default: () => 'right'
    }
  },

  computed: {
    ...mapGetters({
      isJusttoAdmin: 'isJusttoAdmin',
      disputeTimeline: 'getDisputesTimeline'
    }),

    status() {
      const defaultMessage = 'Até este momento, não conseguimos capturar este processo.'
      if (this.disputeTimeline && this.disputeTimeline[this.code]) {
        if (this.disputeTimeline[this.code].lawsuits.length) {
          return {
            available: true,
            icon: 'el-icon-info',
            text: 'Abrir Timeline da disputa.'
          }
        } else if (this.disputeTimeline[this.code].error) {
          return {
            available: false,
            icon: 'el-icon-question',
            text: this.disputeTimeline[this.code].error?.description || defaultMessage
          }
        } else {
          return {
            available: false,
            icon: 'el-icon-error',
            text: defaultMessage
          }
        }
      } else {
        return {
          available: false,
          icon: 'el-icon-loading',
          text: 'Carregando dados da disputa.'
        }
      }
    }
  },
  methods: {
    handleHover() {
      this.$emit('hoverDisputeCode')
    },

    handleClick() {
      if (this.status.available) {
        this.$emit('openTimeline')
      }
    },

    copyProccessCode() {
      navigator.clipboard.writeText(this.code)
      this.$message({
        message: 'Copiado para a área de transferência.',
        type: 'info',
        center: true,
        showClose: true
      })
    }
  }
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
