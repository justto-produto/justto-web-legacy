<template>
  <article class="jus-dispute-code">
    <el-tooltip
      :open-delay="800"
      :content="timelineStatus.text"
    >
      <div
        class="jus-dispute-code__container show-right-icon"
        @mouseover="handleHover"
      >
        <span
          class="jus-dispute-code__link"
          @click="handleClick"
        >
          {{ code.trim() }}{{ timelineState }}
        </span>
        <span class="jus-dispute-code__icons">
          <i
            :class="timelineStatus.icon"
            class="jus-dispute-code__icon"
          />
          <i
            class="jus-dispute-code__icon el-icon-copy-document hidden-icon"
            @click.stop="copyProccessCode"
          />
          <JusTjIdentifier
            :code="code"
            :disabled="!isJusttoAdmin"
            class="jus-dispute-code__icon hidden-icon"
          />
        </span>
      </div>
    </el-tooltip>

    <TicketTimeline
      v-if="code && disputesTimeline[code]"
      v-model="showTimelineDialog"
      :code="code"
    />
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import brazilianStates from '@/constants/brazilianStates'
import JusTjIdentifier from '../others/JusTjIdentifier.vue'

export default {
  name: 'JusDisputeCode',
  components: {
    JusTjIdentifier,
    TicketTimeline: () => import('./TicketTimeline')
  },
  props: {
    code: {
      type: String,
      required: true,
      default: ''
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
      isJusttoAdmin: 'isJusttoAdmin',
      disputesTimeline: 'getDisputesTimeline'
    }),

    currentDiputeTimeline() {
      return this.disputesTimeline[this.code] || { lawsuits: [] }
    },

    timelineState() {
      if (this.currentDiputeTimeline?.lawsuits?.length > 0) {
        const source = this.currentDiputeTimeline.lawsuits[0].source || ''
        const state = brazilianStates.find(({ value }) => source.includes(value))
        return state ? `/${state.value}` : ''
      }

      return ''
    },

    timelineStatus() {
      if (this.currentDiputeTimeline?.lawsuits?.length) {
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
  display: inline-block;

  .jus-dispute-code__container {
    .jus-dispute-code__link,
    .jus-dispute-code__icon {
      cursor: pointer;
      transition: .2s ease-out;
      &:hover { color: $--color-primary; }
    }

    .jus-dispute-code__link {
      display: inline-block;
      text-decoration: underline;
      margin-right: 4px;
    }

    .jus-dispute-code__icons {
      display: inline-block;
      // word-break: keep-all;
      .jus-dispute-code__icon {
        margin-left: 4px;
        &:first-child { margin-left: 0; }
        &.el-icon-info { color: $--color-primary; }
        &.el-icon-error { color: $--color-danger; }
        &.el-icon-loading { color: $--color-text-secondary; }
      }
    }
  }
}
</style>
