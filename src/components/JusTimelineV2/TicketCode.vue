<template>
  <article class="jus-dispute-code">
    <el-tooltip :content="timelineStatus.text">
      <div
        class="jus-dispute-code__container"
        @mouseover="handleHover"
      >
        <span
          class="jus-dispute-code__link"
          @click="handleClick"
        >
          {{ code }}
        </span>
        <span class="jus-dispute-code__icons">
          <i
            class="jus-dispute-code__icon el-icon-copy-document"
            @click.stop="copyProccessCode"
          />
          <i
            :class="timelineStatus.icon"
            class="jus-dispute-code__icon"
          />
        </span>
      </div>
    </el-tooltip>

    <TicketTimeline
      v-if="disputesTimeline[code]"
      v-model="showTimelineDialog"
      :code="code"
    />
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'JusDisputeCode',
  components: {
    TicketTimeline: () => import('./TicketTimeline')
  },
  props: {
    code: {
      type: String,
      required: true
    },
    getBeforMount: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    showTimelineDialog: false
  }),
  computed: {
    ...mapGetters({
      disputesTimeline: 'getDisputesTimeline'
    }),

    currentDiputeTimeline() {
      return this.disputesTimeline[this.code] || { lawsuits: [] }
    },

    timelineStatus() {
      if (this.currentDiputeTimeline.lawsuits.length) {
        return {
          available: true,
          icon: 'el-icon-info',
          text: 'Abrir Timeline da disputa.'
        }
      } else if (!this.currentDiputeTimeline.lawsuits.length) {
        return {
          available: false,
          icon: 'el-icon-error',
          text: 'Disputa não encontrada no TJ.'
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
  watch: {
    'code'(current) {
      this.getDisputeTimeline(current)
    }
  },
  beforeMount() {
    if (this.getBeforMount) {
      this.getDisputeTimeline(this.code)
    }
  },
  methods: {
    ...mapActions(['getDisputeTimeline']),

    handleHover() {
      if (this.disputesTimeline && !this.currentDiputeTimeline) {
        this.getDisputeTimeline(this.code)
      }
    },

    handleClick() {
      if (this.currentDiputeTimeline.lawsuits.length) {
        this.$nextTick(() => (this.showTimelineDialog = true))
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

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.jus-dispute-code {
  display: inline-flex;

  .jus-dispute-code__link,
  .jus-dispute-code__icon {
    cursor: pointer;
    &:hover { color: $--color-primary; }
  }

  .jus-dispute-code__link {
    text-decoration: underline;
  }

  .jus-dispute-code__icon {
    margin-left: 4px;
    &.el-icon-copy-document { margin-left: 0; }
    &.el-icon-info { color: $--color-primary; }
    &.el-icon-error { color: $--color-danger; }
    &.el-icon-loading { color: $--color-text-secondary; }
  }
}
</style>
