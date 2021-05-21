<template>
  <section class="summary-container">
    <div
      v-for="(summaryItem, summaryItemIndex) in renderItems"
      :key="`summary-item-${summaryItemIndex}`"
      class="summary-container__item"
    >
      <span class="summary-container__item-header">
        {{ summaryItem.count }} {{ summaryItem.type }} para {{ summaryItem.personName }}
      </span>

      <span
        v-for="(occurrenceItem, occurrenceItemIndex) in summarys[summaryItem.type]"
        :key="`summary-occurrence-item-${occurrenceItemIndex}`"
        class="summary-container__item-occurrence-item"
      >
        <span class="summary-container__item-occurrence-item-title">
          Mensagem {{ occurrenceItemIndex + 1 }} do agendamento
        </span>

        <Scheduler
          :value="occurrenceItem.occurrence.interaction"
          :occurrence="occurrenceItem.occurrence"
          hidden-contact-info
          hidden-send-status
          class="summary-container__item-occurrence-item-body"
          :class="{ 'is-full': isInFullMessages(occurrenceItem.summaryOccurrence.messageId) }"
        />

        <div class="summary-container__item-occurrence-item-status">
          <span class="summary-container__item-occurrence-item-status-message">
            <i class="el-icon-edit" />
            <span class="summary-container__item-occurrence-item-status-message-body">
              <span class="summary-container__item-occurrence-item-status-message-body-normal">
                Mensagem criada em
              </span>
              <span class="summary-container__item-occurrence-item-status-message-body-date">
                {{ occurrenceItem.summaryOccurrence.createAt.dateTime | moment('DD/MM [às] HH:mm') }}
              </span>
            </span>
          </span>

          <span
            v-for="(messageStatus, statusIndex) in (occurrenceItem.summaryOccurrence.messagesStatus || [])"
            :key="`message-status-${statusIndex}`"
            class="summary-container__item-occurrence-item-status-message"
          >
            <i :class="messageStatus.status | getIconByStatus" />
            <span class="summary-container__item-occurrence-item-status-message-body">
              <!-- <span class="summary-container__item-occurrence-item-status-message-body-normal">
                Mensagem
              </span> -->
              <span class="summary-container__item-occurrence-item-status-message-body-status">
                {{ $t(`occurrence.interaction.message.status.${messageStatus.status}.label`) | capitalize }}
              </span>
              <span class="summary-container__item-occurrence-item-status-message-body-normal">
                em
              </span>
              <span class="summary-container__item-occurrence-item-status-message-body-date">
                {{ messageStatus.date | moment('DD/MM') }}
              </span>
              <span class="summary-container__item-occurrence-item-status-message-body-normal">
                {{ $t(`occurrence.interaction.message.status.${messageStatus.status}.preposition`) }}
              </span>
              <span class="summary-container__item-occurrence-item-status-message-body-adress">
                {{ messageStatus.receiver }}
              </span>
              <span class="summary-container__item-occurrence-item-status-message-body-date">
                {{ messageStatus.date | moment('[às] HH:mm') }}
              </span>
            </span>
          </span>

        </div>

        <el-divider class="summary-container__item-occurrence-item-divider" />
      </span>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  SummaryVM,
  SummaryOccurrence
} from './models/index'

export default {
  components: {
    Scheduler: () => import('@/views/main/negotiation/partials/ticket/omnichannel/occurrences/occurrence/interaction/partials/Scheduler')
  },

  filters: {
    getIconByStatus(status) {
      switch (status) {
        case 'WAITING':
          return 'el-icon-timer'
        case 'PROCESSED':
          return 'el-icon-check'
        default:
          return 'el-icon-close'
      }
    }
  },

  props: {
    occurrence: {
      type: Object,
      required: true
    },
    summary: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    communicationTypes: ['EMAIL', 'WHATSAPP', 'SMS']
  }),

  computed: {
    ...mapGetters({
      fullMessages: 'getFullMessages',
      summaryKeys: 'getOccurrencesSummaryKeys',
      summaryOccurrences: 'getOccurrencesSummary'
    }),

    renderItems() {
      return [
        ...(this.summary.email > 0 ? [new SummaryVM({ type: 'email', count: this.summary.email, ...this.summary })] : []),
        ...(this.summary.whatsApp > 0 ? [new SummaryVM({ type: 'whatsApp', count: this.summary.whatsApp, ...this.summary })] : []),
        ...(this.summary.sms > 0 ? [new SummaryVM({ type: 'sms', count: this.summary.sms, ...this.summary })] : [])
      ]
    },

    summarys() {
      return {
        email: (this.summaryOccurrences.EMAIL[this.occurrence.id] || []).map(item => ({
          occurrence: item,
          summaryOccurrence: new SummaryOccurrence(item)
        })),

        whatsApp: (this.summaryOccurrences.WHATSAPP[this.occurrence.id] || []).map(item => ({
          occurrence: item,
          summaryOccurrence: new SummaryOccurrence(item)
        })),

        sms: (this.summaryOccurrences.SMS[this.occurrence.id] || []).map(item => ({
          occurrence: item,
          summaryOccurrence: new SummaryOccurrence(item)
        }))
      }
    }
  },

  mounted() {
    this.communicationTypes.forEach(communicationType => {
      this.getOccurrences(communicationType)
    })
  },

  methods: {
    ...mapActions([
      'getSummaryOccurrecies'
    ]),

    getOccurrences(communicationType) {
      this.disputeId = this.$route.params.id

      this.getSummaryOccurrecies({
        disputeId: this.disputeId,
        summaryRoleId: this.summary.disputeRoleId,
        communicationType,
        summaryOccurrenceId: this.occurrence.id
      })
    },

    stateOccurrence(occurrence) {
      return new SummaryOccurrence(occurrence)
    },

    isInFullMessages(item) {
      return Object.keys(this.fullMessages).map(key => String(key)).includes(String(item))
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.summary-container {
  width: 85%;
  margin-top: 16px;

  .summary-container__item {
    width: 100%;
    border: 3px solid #FFF1C8;
    border-radius: 10px;
    padding: 0 16px 16px;

    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    .summary-container__item-header {
      background-color: #FFF1C8;
      color: $--color-black;
      padding: 8px;
      border-radius: 10px;

      margin-top: -18px;
      margin-bottom: 16px;
    }

    .summary-container__item-occurrence-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      &:last-child {
        .el-divider {
          display: none;
        }
      }

      .summary-container__item-occurrence-item-title {
        color: $--color-primary;
        font-weight: 600;
      }

      .summary-container__item-occurrence-item-body {
        width: 100%;

        &.is-full {
          width: 85%;
          overflow-x: scroll;
          overflow-y: hidden;
        }
      }

      .summary-container__item-occurrence-item-status {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: flex-start;

        font-size: 12px;

        .summary-container__item-occurrence-item-status-message {
          .el-icon-edit {
            font-weight: 800;
            color: #BBBBBB;
          }

          .el-icon-check {
            font-weight: 800;
            color: $--color-success;
          }

          .el-icon-timer {
            font-weight: 800;
            color: $--color-warning;
          }

          .el-icon-close {
            color: $--color-danger;
            font-weight: 800;
          }

          .summary-container__item-occurrence-item-status-message-body {
            .summary-container__item-occurrence-item-status-message-body-normal,
            .summary-container__item-occurrence-item-status-message-body-status,
            .summary-container__item-occurrence-item-status-message-body-date {
              color: $--color-text-secondary;
            }

            .summary-container__item-occurrence-item-status-message-body-adress {
              color: $--color-text-primary;
            }
          }
        }
      }

      .summary-container__item-occurrence-item-divider {
        height: 3px;
        background-color: #FFF1C8;
        width: 80%;
      }
    }
  }
}
</style>
