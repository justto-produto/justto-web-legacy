<template>
  <section
    id="dispute-code"
    class="dispute-code">
    <el-tooltip
      :content="status.text"
      placement="right">
      <span>
        <el-link
          class="dispute-code__proccess-link"
          :underline="false"
          @mouseover.native="handleHoverEvent">
          {{ code }}
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
  },
  computed: {
    ...mapGetters(['disputeTimeline']),

    status() {
      let icon, text
      if (this.disputeTimeline[this.code]) {
        if (this.disputeTimeline[this.code].lawsuits.length) {
          icon = 'el-icon-info'
          text = 'Abrir Timeline da disputa'
        } else {
          icon = 'el-icon-error'
          text = 'Disputa não encontrada no TJ.'
        }
      } else {
        icon = 'el-icon-loading'
        text = 'Carregando dados da disputa.'
      }

      return { icon, text }
    },
  },
  methods: {
    handleHoverEvent() {
      this.$emit('hover')
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
