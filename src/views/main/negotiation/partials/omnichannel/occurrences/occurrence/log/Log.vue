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
        <!-- TODO: Quando implementar a data flutuante, deixar mostrando só a hora aqui. -->
        {{ time | moment('DD/MM/YY[ às ]HH:mm') }}
        •
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
      return this.occurrence.description
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
        icon: this.occurrence?.status.toLowerCase(),
        tooltip: 'No momento desta ocorrência, esta disputa estava ' + this.$t('dispute.status.' + this.occurrence?.status)
      }
    },
    leftIcon() {
      if (this.text.toLowerCase().includes('disputa dada como ganha')) {
        return 'win'
      }
      if (this.text.toLowerCase().includes('disputa pausada')) {
        return 'pause'
      }
      if (this.text.toLowerCase().includes('disputa alterada para perdido')) {
        return 'lose'
      }
      if (this.text.toLowerCase().includes('reiniciou o engajamento')) {
        return 'refresh'
      }
      if (this.text.toLowerCase().includes('disputa retomada')) {
        return 'start-again'
      }
      if (this.text.toLowerCase().includes('disputa marcada como favorita')) {
        return 'star'
      }
      if (this.text.toLowerCase().includes('disputa expirou')) {
        return 'calendar-clock'
      }
      if (this.text.toLowerCase().includes('disputa expirada')) {
        return 'calendar-clock'
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
      align-self: center;
      text-align: center;

      .log-container__occurrence-text-icon {
        width: 14px;
      }
    }

    .log-container__occurrence-about {
      font-size: 12px;
      align-self: flex-end;
      display: flex;
      gap: 6px;
      align-items: flex-end;

      .log-container__occurrence-about-icon {
        width: 14px;
      }
    }
  }
}
</style>
