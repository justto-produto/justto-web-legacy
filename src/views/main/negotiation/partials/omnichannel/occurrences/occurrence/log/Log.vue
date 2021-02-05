<template>
  <section class="log-container">
    <span class="log-container__occurrence">
      <span class="log-container__occurrence-text">
        <jus-icon
          v-if="leftIcon"
          class="log-container__occurrence-text-icon"
          :icon="leftIcon"
        />
        <span v-html="text" />
      </span>
      <span class="log-container__occurrence-about">
        <span class="log-container__occurrence-about-time">
          {{ time | moment('HH:mm') }}
        </span>
        <span v-if="status.icon">
          •
        </span>
        <el-tooltip :content="status.tooltip">
          <jus-icon
            class="log-container__occurrence-about-icon"
            :icon="status.icon"
          />
        </el-tooltip>
      </span>
    </span>
  </section>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    occurrence() {
      return this.value
    },
    text() {
      let text = this.occurrence.description
      if (this.occurrence?.type === 'INTERACTION' && this.occurrence?.interaction?.type === 'NEGOTIATOR_ACCESS') {
        text = 'Disputa visualizada'
      }
      return text + '<div style="width: 56px; visibility: hidden;">.</div>'
    },
    time() {
      if (this.occurrence?.updateAt?.dateTime) {
        return this.occurrence?.updateAt?.dateTime
      } else if (this.occurrence?.createAt?.dateTime) {
        return this.occurrence?.createAt?.dateTime
      }
      return ''
    },
    status() {
      return {
        icon: this.occurrence?.status?.toLowerCase() || '',
        tooltip: 'No momento desta ocorrência, esta disputa estava ' + this.$t('dispute.status.' + this.occurrence?.status)
      }
    },

    leftIcon() {
      const text = this.text.toLowerCase()
      if (text.includes('disputa dada como ganha')) {
        return 'win'
      } else if (text.includes('disputa pausada')) {
        return 'pause'
      } else if (text.includes('disputa alterada para perdido')) {
        return 'lose'
      } else if (text.includes('reiniciou o engajamento')) {
        return 'refresh'
      } else if (text.includes('disputa retomada')) {
        return 'start-again'
      } else if (text.includes('disputa marcada como favorita')) {
        return 'star'
      } else if (text.includes('disputa expirou')) {
        return 'calendar-clock'
      } else if (text.includes('disputa expirada')) {
        return 'calendar-clock'
      } else if (text.includes('leitura na mensagem')) {
        return 'eye'
      } else if (text.includes('disputa visualizada')) {
        return 'justto'
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.log-container {
  display: flex;
  justify-content: center;

  .log-container__occurrence {
    background-color: #fff4cc;
    word-break: break-word;
    border-radius: 8px;
    padding: 10px;
    margin: 10px;

    display: flex;
    flex-direction: column;

    .log-container__occurrence-text {
      display: flex;
      align-self: center;
      justify-content: center;
      align-items: center;
      gap: 6px;
      text-align: center;

      .log-container__occurrence-text-icon {
        align-self: flex-start;
        width: 14px;
      }
    }

    .log-container__occurrence-about {
      margin-top: -12px;
      font-size: 11px;
      align-self: flex-end;
      display: flex;
      gap: 6px;
      align-items: flex-end;

      .log-container__occurrence-about-time {
        word-break: keep-all;
      }

      .log-container__occurrence-about-icon {
        width: 14px;
      }
    }
  }
}
</style>
