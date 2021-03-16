<template>
  <section class="log-container">
    <span
      class="log-container__occurrence"
      :class="{ 'summary': isSummary, 'normal': !isSummary }"
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
              {{ summary.email }} {{ $tc('negotiation.ticket.omnichannel.occurrence.summary.count-email', summary.email) }} {{ summary.personName | resumedName }}
              <i
                v-if="loading === 'EMAIL'"
                class="el-icon-loading"
              />
              <span
                v-else
                class="log-container__occurrence-text__summary-iterator-item__see-more"
                @click="seeMore('EMAIL', summary.disputeRoleId)"
              >
                &#40;
                <span>
                  {{ seeEmails ? 'ver' : 'esconder' }} e-mails
                </span>
                &#41;
              </span>
            </span>
            <span
              v-if="summary.whatsApp"
              class="log-container__occurrence-text__summary-iterator-item"
            >
              {{ summary.whatsApp }} {{ $tc('negotiation.ticket.omnichannel.occurrence.summary.count-whatsapp', summary.whatsApp) }} {{ summary.personName | resumedName }}
              <span
                class="log-container__occurrence-text__summary-iterator-item__see-more"
                @click="seeMore('WHATSAPP', summary.disputeRoleId)"
              >
                &#40;
                <i
                  v-if="loading === 'WHATSAPP'"
                  class="el-icon-loading"
                />
                <span v-else>
                  {{ seeWhats ? 'ver' : 'esconder' }} whats
                </span>
                &#41;
              </span>
            </span>
            <span
              v-if="summary.sms"
              class="log-container__occurrence-text__summary-iterator-item"
            >
              {{ summary.sms }} {{ $tc('negotiation.ticket.omnichannel.occurrence.summary.count-sms', summary.sms) }} {{ summary.personName | resumedName }}
              <span
                class="log-container__occurrence-text__summary-iterator-item__see-more"
                @click="seeMore('SMS', summary.disputeRoleId)"
              >
                &#40;
                <i
                  v-if="loading === 'SMS'"
                  class="el-icon-loading"
                />
                <span v-else>
                  {{ seeSms ? 'ver' : 'esconder' }} sms
                </span>
                &#41;
              </span>
            </span>
          </span>
          <span
            v-if="!summaryDetail.length && oldSummary.length"
            v-html="oldSummary"
          />
        </span>
      </span>

      <span class="log-container__occurrence-about negotiation-occurrence-about">
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

      <Scheduler
        v-for="({ interaction }, summaryOccurrenceIndex) in groupedOccurrences"
        :key="`summary-occurrence-${summaryOccurrenceIndex}`"
        class="log-container__occurrence summary log-container__summary-scheduler"
        :value="interaction"
        :hide-content="summaryOccurrenceIndex > 0"
      />
    </span>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { addInvisibleStatus } from '@/utils'

export default {
  components: {
    Scheduler: () => import('../interaction/partials/Scheduler')
  },

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    loading: '',
    summaryTypes: ['EMAIL', 'WHATSAPP', 'SMS']
  }),

  computed: {
    ...mapGetters({
      summaryKeys: 'getOccurrencesSummaryKeys',
      summaryOccurrences: 'getOccurrencesSummary'
    }),

    occurrence() {
      return this.value
    },

    groupedOccurrences() {
      let list = []
      const { id } = this.occurrence

      this.summaryTypes.forEach(type => {
        if (this.summaryKeys[type].includes(id)) {
          this.summaryOccurrences[type][id].forEach(({ occurrences }) => {
            list = [...list, ...occurrences]
          })
        }
      })

      return list
    },

    seeEmails() {
      return !this.summaryKeys.EMAIL.includes(this.occurrence.id)
    },

    seeWhats() {
      return !this.summaryKeys.WHATSAPP.includes(this.occurrence.id)
    },

    seeSms() {
      return !this.summaryKeys.SMS.includes(this.occurrence.id)
    },

    text() {
      let text = this.occurrence.description
      if (this.occurrence?.type === 'INTERACTION' && this.occurrence?.interaction?.type === 'NEGOTIATOR_ACCESS') {
        text = 'Disputa visualizada'
      }
      return addInvisibleStatus(text)
    },

    isSummary() {
      return this.occurrence?.properties?.ENGAGEMENT === 'SUMMARY'
    },

    oldSummary() {
      let res = ''
      if (this.occurrence?.properties?.SUMMARY_EMAIL_QUANTITY) {
        const { SUMMARY_EMAIL_QUANTITY } = this.occurrence?.properties
        const messagePlural = Number(SUMMARY_EMAIL_QUANTITY) > 1 ? 'Mensagens' : 'Mensagem'
        res += `<span>${SUMMARY_EMAIL_QUANTITY} ${messagePlural} de Email foram agendada(s).</span>`
      } if (this.occurrence?.properties?.SUMMARY_WHATSAPP_QUANTITY) {
        const { SUMMARY_WHATSAPP_QUANTITY } = this.occurrence?.properties
        const messagePlural = Number(SUMMARY_WHATSAPP_QUANTITY) > 1 ? 'Mensagens' : 'Mensagem'
        res += `<span>${this.occurrence?.properties?.SUMMARY_WHATSAPP_QUANTITY} ${messagePlural} de WhatsApp foram agendada(s).</span>`
      } if (this.occurrence?.properties?.SUMMARY_SMS_QUANTITY) {
        const { SUMMARY_SMS_QUANTITY } = this.occurrence?.properties
        const messagePlural = Number(SUMMARY_SMS_QUANTITY) > 1 ? 'Mensagens' : 'Mensagem'
        res += `<span>${this.occurrence?.properties?.SUMMARY_SMS_QUANTITY} ${messagePlural} de SMS foram agendada(s).</span>`
      }
      return res
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

    seeMore(communicationType, summaryRoleId) {
      const disputeId = this.$route.params.id
      const summaryOccurrenceId = this.occurrence.id
      this.loading = communicationType
      this.getSummaryOccurrecies({
        disputeId,
        summaryRoleId,
        communicationType,
        summaryOccurrenceId
      }).then(() => (this.loading = '')).finally(() => (this.loading = ''))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.log-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 10px 20px;
  gap: 0px;

  .log-container__occurrence {
    background-color: #fff4cc;
    word-break: break-word;
    border-radius: 8px;
    padding: 10px 0px 0px;

    display: flex;
    flex-direction: column;

    &.summary {
      max-width: 80%;
      background-color: #fff;
      border: 3px solid #fff4cc;
      align-self: flex-end;

      .log-container__occurrence-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px 10px;

        .log-container__occurrence-text__icon {
          width: 16px !important;
        }

        .log-container__occurrence-text__content {
          color: #f19737;
          font-weight: bold;
          font-size: 16px;

          @media (max-height: 680px) {
            font-size: 14px;
          }
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
      }

      .log-container__occurrence-about {
        margin: 6px 10px;
      }
    }

    &.normal {
      padding: 12px;
    }

    .log-container__occurrence-text {
      display: flex;
      align-self: center;
      justify-content: center;
      align-items: center;
      gap: 6px;
      text-align: center;

      .log-container__occurrence-text__icon {
        align-self: flex-start;
        width: 16px;
      }

      .log-container__occurrence-text__content {
        font-size: 16px;

        @media (max-height: 680px) {
          font-size: 14px;
        }
      }
    }

    .log-container__occurrence-about {
      .log-container__occurrence-about-time {
        word-break: keep-all;
      }

      .log-container__occurrence-about-icon {
        width: 14px;
      }
    }

    .log-container__summary-scheduler {
      border-right: none;
      border-bottom: none;
      border-left: none;
      margin: 0px;
      padding: 10px;
      border-radius: 0px;
      max-width: 100%;
      width: 100%;
    }
  }
}
</style>
