<template>
  <article>
    <span
      v-for="shortcut in shortcuts"
      :key="shortcut.callback"
      v-shortkey="shortcut.keys"
      @shortkey="doAction(shortcut)"
    />
    <el-dialog
      title="Atalhos"
      :visible.sync="helpIsVisible"
      append-to-body
      destroy-on-close
      custom-class="shortcut-dialog"
    >
      <ul class="shortcut-dialog__list">
        <li
          v-for="shortcut in shortcuts"
          :key="`shortcut-help-${shortcut.callback}`"
          class="shortcut-dialog__list-item"
        >
          <div class="shortcut-dialog__list-item-buttons">
            <span
              v-for="code in shortcut.codes"
              :key="code"
              class="shortcut-dialog__list-item-buttons-list"
            >
              <span
                class="kbc-button kbc-button-sm shortcut-dialog__list-item-buttons-list-code"
                v-html="code"
              />
              <span
                class="shortcut-dialog__list-item-buttons-list-plus"
                v-text="'+'"
              />
            </span>
          </div>

          <span class="shortcut-dialog__list-item-text">
            {{ $t('events.' + shortcut.callback) }}
          </span>
        </li>
      </ul>
    </el-dialog>
  </article>
</template>

<script>
import events from '@/constants/negotiationEvents'
import { eventBus } from '@/utils'

export default {
  data: () => ({
    helpIsVisible: false
  }),

  computed: {
    shortcuts() {
      return Object.values(events)
    }
  },

  mounted() {
    eventBus.$on(events.SHOW_SHORTCUTS_HELP_1.callback, this.showHelp)
    eventBus.$on(events.SHOW_SHORTCUTS_HELP_2.callback, this.showHelp)
  },

  methods: {
    doAction({ callback }) {
      eventBus.$emit(callback, {})
    },

    showHelp() {
      this.helpIsVisible = true
    }
  }
}
</script>

<style lang="scss">
.shortcut-dialog {
  .el-dialog__header {
    margin: 12px 0;
  }

  .el-dialog__body {
    margin: 6px 0;

    .shortcut-dialog__list {
      padding: 0px;

      .shortcut-dialog__list-item {
        list-style-type: none;
        display: flex;
        gap: 16px;
        align-items: center;
        margin: 6px 0px;

        .shortcut-dialog__list-item-buttons {
          .shortcut-dialog__list-item-buttons-list:last-child {
            .shortcut-dialog__list-item-buttons-list-plus {
              display: none;
            }
          }
        }

        .shortcut-dialog__list-item-text {
          font-weight: 600;
        }
      }
    }
  }
}
</style>
