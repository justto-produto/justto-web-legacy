<template>
  <section
    id="dispute-code"
    class="dispute-code"
  >
    <el-popover
      slot="reference"
      class="dispute-code__popover"
      :content="status.text"
      popper-class="el-popover--dark"
      :visible-arrow="false"
      placement="right"
      trigger="hover"
    >
      <div
        slot="reference"
        class="dispute-code__popover-reference"
      >
        <el-link
          :ref="`dispute-code-${code}`"
          class="dispute-code__proccess-link"
          :underline="false"
          @mouseover.native="handleHoverEvent"
        >
          {{ code }}
          <i
            :class="status.icon"
            class="dispute-code__icon"
          />
        </el-link>
      </div>
    </el-popover>
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
    ...mapGetters([
      'disputeTimeline',
    ]),
    status() {
      let icon = ''
      let text = ''
      if (this.disputeTimeline[this.code]) {
        if (this.disputeTimeline[this.code].lawsuits.length) {
          icon = 'el-icon-info'
          text = 'Abrir Timeline da disputa'
        } else {
          icon = 'el-icon-error'
          text = 'Código da disputa não encontrada no TJ.'
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

.dispute-code {
  background: transparent !important;
  width: 100%;
  &:hover {
    .dispute-code__popover .dispute-code__popover-reference .dispute-code__proccess-link .dispute-code__icon {
      visibility: visible;
    }
  }

  .dispute-code__popover {
    .dispute-code__popover-reference {
      .dispute-code__proccess-link {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-link--inner {
          width: 100%;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .el-icon-loading {
            color: #909399;
          }

          .el-icon-error {
            color: #F56C6C;
          }
        }

        .dispute-code__icon {
          visibility: hidden;
        }

        .el-link--inner {
          word-break: break-all;
        }
      }
    }
  }
}
</style>
