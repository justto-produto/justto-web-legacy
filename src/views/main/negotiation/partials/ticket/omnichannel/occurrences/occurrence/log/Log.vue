<template>
  <section class="log-container">
    <span
      v-if="!isSummary"
      class="log-container__occurrence normal"
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
      </span>

      <UnknownPartyButton
        v-if="isUnknown"
        v-model="value"
      />

      <!-- Validação -->
      <div
        v-if="havePartsUnknow"
        class="log-container__occurrence-unknowns"
      >
        <UnknownPolarityButton
          v-for="party in unknownParts"
          :key="party.disputeRoleId"
          :occurrence="value"
          :party="party"
          class="unknown-item"
        />
      </div>

      <span class="log-container__occurrence-about negotiation-occurrence-about">
        <span class="log-container__occurrence-about-time">
          {{ time | moment('HH:mm') }}
        </span>
        <span v-if="status.icon">
          •
        </span>
        <el-tooltip
          :open-delay="600"
          :content="status.tooltip"
        >
          <jus-icon
            class="log-container__occurrence-about-icon"
            :icon="status.icon"
          />
        </el-tooltip>
      </span>
    </span>

    <Summary
      v-for="(summary, summaryIndex) in (isSummary ? summaryDetail : [])"
      :key="`summary-${summaryIndex}`"
      :occurrence="occurrence"
      :summary="summary"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    Summary: () => import('./Summary'),
    UnknownPartyButton: () => import('@/components/buttons/UnknownPartyButton'),
    UnknownPolarityButton: () => import('@/components/buttons/UnknownPolarityButton')
  },

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      parties: 'getTicketOverviewParties'
    }),

    occurrence() {
      return this.value
    },

    isCanceled() {
      return this.occurrence?.status === 'CANCELED'
    },

    isUnknown() {
      return this.value?.properties?.PARTY === 'UNKNOWN' && this.value?.properties?.ROLE_NAME === 'LAWYER'
    },

    havePartsUnknow() {
      return this.value?.properties?.HANDLE_UNKNOW_PARTY === 'TRUE' && JSON.parse(this.value?.properties?.UNKNOW_ROLE_IDS || '[]').length > 0
    },

    unknownRoleIds() {
      return JSON.parse(this.value?.properties?.UNKNOW_ROLE_IDS || '[]')
    },

    unknownParts() {
      return (this.parties || []).filter(r => this.unknownRoleIds.includes(r.disputeRoleId) && r.polarity === 'UNKNOWN')
    },

    text() {
      let text = this.isCanceledText(this.occurrence.description) ? this.handleCanceledText(this.occurrence.description) : this.occurrence.description
      if (this.occurrence?.type === 'INTERACTION' && this.occurrence?.interaction?.type === 'NEGOTIATOR_ACCESS') {
        text = 'Disputa visualizada'
      }
      return text
    },

    isSummary() {
      return this.occurrence?.properties?.ENGAGEMENT === 'SUMMARY'
    },

    summaryDetail() {
      return JSON.parse(this.occurrence?.properties?.SUMMARY_DETAIL || '{}')
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
        tooltip: 'No momento desta ocorrência, esta disputa estava ' + this.$tc('dispute.status.' + this.occurrence?.status)
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

  updated() {
    this.$set(this.value, 'renderCompleted', true)
  },

  mounted() {
    this.$set(this.value, 'renderCompleted', true)
  },

  methods: {
    handleCanceledText(description) {
      const [handledDescription, reason] = description.split(':')
      return `${handledDescription}: ${this.$tc(`canceled.reason.${reason.trim()}`)}.`
    },

    isCanceledText(description) {
      return description.includes('Disputa cancelada por')
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

          @media (max-height: 900px) {
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
                min-width: 66px;
                cursor: pointer;
                display: flex;
                align-items: flex-end;
                text-decoration: underline;
                align-self: flex-start;
                justify-content: flex-end;

                &.visible {
                  min-width: 114px;
                }
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

    .log-container__occurrence-unknowns {
      display: flex;
      flex-direction: column;
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

        @media (max-height: 900px) {
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

    .unkbown-party-resolved {
      text-align: center;
      text-decoration: underline;
    }
  }
}
</style>
