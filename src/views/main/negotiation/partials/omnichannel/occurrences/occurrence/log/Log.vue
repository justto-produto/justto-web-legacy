<template>
  <section class="log-container">
    <span
      class="log-container__occurrence"
      :class="{ 'summary': isSummary }"
    >
      <span class="log-container__occurrence-text">
        <jus-icon
          v-if="leftIcon"
          class="log-container__occurrence-text__icon"
          :icon="leftIcon"
        />
        <span
          class="log-container__occurrence-text__content"
          v-html="text"
        />
        <span
          v-if="isSummary"
          class="log-container__occurrence-text__summary"
        >
          <span
            v-for="(summary, sIndex) in summaryDetail"
            :key="sIndex"
            class="log-container__occurrence-text__summary-iterator"
          >
            <span
              v-if="summary.email"
              class="log-container__occurrence-text__summary-iterator-item"
            >
              {{ summary.email }} {{ summary.email > 1 ? 'E-mails foram agendados para' : 'E-mail foi agendado para' }}  {{ summary.personName | resumedName }}
              <span
                class="log-container__occurrence-text__summary-iterator-item__see-more"
                @click="seeMore('EMAIL', summary.disputeRoleId)"
              >
                &#40;
                Ver e-mails
                &#41;
              </span>
            </span>
            <span
              v-if="summary.whatsApp"
              class="log-container__occurrence-text__summary-iterator-item"
            >
              {{ summary.whatsApp }} {{ summary.whatsApp > 1 ? 'Mensagens de WhatsApp foram agendadas para' : 'Mensagem de WhatsApp foi agendada para' }}  {{ summary.personName | resumedName }}
              <span
                class="log-container__occurrence-text__summary-iterator-item__see-more"
                @click="seeMore('WHATSAPP', summary.disputeRoleId)"
              >
                &#40;
                Ver whats
                &#41;
              </span>
            </span>
            <span
              v-if="summary.sms"
              class="log-container__occurrence-text__summary-iterator-item"
            >
              {{ summary.sms }} {{ summary.sms > 1 ? 'Mensagens  de texto foram agendadas para' : 'Mensagem de texto foi agendada para' }}  {{ summary.personName | resumedName }}
              <span
                class="log-container__occurrence-text__summary-iterator-item__see-more"
                @click="seeMore('SMS', summary.disputeRoleId)"
              >
                &#40;
                Ver sms
                &#41;
              </span>
            </span>
          </span>
        </span>
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
import { mapActions } from 'vuex'
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

    isSummary() {
      return this.occurrence?.properties?.ENGAGEMENT === 'SUMMARY'
    },

    summaryDetail() {
      return JSON.parse(this.occurrence?.properties?.SUMMARY_DETAIL)
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
  },
  methods: {
    ...mapActions(['getSummaryOccurrecies']),

    seeMore(type, summaryRoleId) {
      // disputeId, type, summaryRoleId, summaryOccurrenceId
      const disputeId = this.$route.params.id
      const summaryOccurrenceId = this.occurrence.id
      this.getSummaryOccurrecies({
        type,
        disputeId,
        summaryRoleId,
        summaryOccurrenceId
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

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

    &.summary {
      background-color: #fff;
      border: 5px solid #fff4cc;

      .log-container__occurrence-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .log-container__occurrence-text__content {
          color: #f19737;
          font-weight: bold;
        }

        .log-container__occurrence-text__summary {
          .log-container__occurrence-text__summary-iterator {
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .log-container__occurrence-text__summary-iterator-item {
              display: flex;
              flex-direction: row;
              gap: 2px;

              .log-container__occurrence-text__summary-iterator-item__see-more {
                color: $--color-primary;
                font-size: 12px;
                cursor: pointer;
                display: flex;
                align-items: flex-end;
                text-decoration: underline;
              }
            }
          }
        }

        /*.log-container__occurrence-text-text-summary {
          display: flex;
          flex-direction: column;

          align-items: flex-start;
        }*/
      }

      .log-container__occurrence-about {
        margin-top: 6px;
      }
    }

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
