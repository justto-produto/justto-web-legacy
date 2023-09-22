<template>
  <el-tabs
    v-model="activeTab"
    stretch
    class="call-text-content__tabs"
  >
    <el-tab-pane>
      <div slot="label">
        <i class="el-icon-chat-dot-square" />
        <span>Resumo</span>
      </div>

      <div
        class="call-text-content__message"
        v-html="resumo"
      />

      <span
        class="call-text-content__copy-btn"
        @click="handleCopyResume"
      >
        <i class="el-icon-document-copy" />
      </span>
    </el-tab-pane>

    <el-tab-pane>
      <div slot="label">
        <i class="el-icon-chat-line-square" />

        <span>Transcrição</span>
      </div>

      <div
        class="call-text-content__message"
        v-html="transcricao"
      />

      <span
        class="call-text-content__copy-btn"
        @click="handleCopyResume"
      >
        <i class="el-icon-document-copy" />
      </span>
    </el-tab-pane>

    <el-tab-pane>
      <div slot="label">
        <i class="el-icon-edit" />
        <span>Anotações</span>
      </div>
      <slot />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: 'CallTextContent',

  props: {
    resume: {
      type: String,
      required: false,
      default: ''
    },

    transcription: {
      type: String,
      required: false,
      default: ''
    },

    note: {
      type: String,
      required: false,
      default: ''
    }
  },

  data: () => ({
    activeTab: ''
  }),

  computed: {
    resumo() {
      return (this.resume ?? '').replaceAll('\n', '<br />')
    },

    transcricao() {
      return (this.transcription ?? '').replaceAll('\n', '<br />')
    },

    nota: {
      get() { return this.note },
      set(value) { this.$emit('update:note', 'value') }
    }
  },

  methods: {
    handleCopyResume() {
      console.log('Copiar resumo')
    }
  }
}
</script>

<style lang="scss">
  @import '~projuris-acordos-theme/src/common/colors.scss';

  .call-text-content__tabs {
    margin-top: 1rem;

    .el-tabs__header {
      .el-tabs__nav-wrap {
        &::after {
          display: none !important;
        }

        .el-tabs__nav-scroll {
          .el-tabs__nav {
            .el-tabs__active-bar {
              display: none !important;
            }

            .el-tabs__item.is-active {
              border-style: solid;
              border-radius: 1rem;
              padding: 0;
              text-align: center;
            }
          }
        }
      }
    }

    .el-tabs__content {
      .el-tab-pane {
        position: relative;

        .call-text-content__message {
          font-size: 1em;
          padding: 8px 24px 8px 8px;
          border-radius: 8px;
          color: $--color-text-primary;
          background-color: $--color-email-bg;
          max-height: 300px;
          overflow-y: auto;
        }

        .call-text-content__copy-btn {
          position: absolute;
          right: 0;
          top: 0;
          z-index: 10;
          margin: 4px 20px 0 0;

          i {
            color: $--color-text-primary;
            font-size: 14px;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
