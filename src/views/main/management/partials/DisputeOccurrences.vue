<template lang="html">
  <ul v-loading="loading" v-chat-scroll="{always: true, smooth: true, scrollonremoved: true }" class="dispute-view-occurrences">
    <li
      v-if="!loading && occurrences.length"
      v-for="(occurrence, index) in occurrences"
      :key="index + new Date().getTime()"
      class="dispute-view-occurrences__occurrence">
        <el-card v-if="occurrence.type === 'NOTE'" shadow="never" class="dispute-view-occurrences__log el-card--bg-warning">
          {{ occurrence.description.replace('.', ':') }}
        </el-card>
        <el-card v-else-if="occurrence.type === 'LOG'" shadow="never" class="dispute-view-occurrences__log el-card--bg-warning">
          {{ occurrence.description }}
        </el-card>
        <el-card v-else-if="occurrence.interaction && occurrence.interaction.type === 'NEGOTIATOR_ACCESS'" shadow="never" class="dispute-view-occurrences__log el-card--bg-warning">
          {{ occurrence.description }}
        </el-card>
        <div v-else-if="hideScheduled(occurrence)" class="dispute-view-occurrences__interaction" :class="occurrence.interaction ? occurrence.interaction.direction : ''">
          <div class="dispute-view-occurrences__avatar">
            <jus-avatar-user :name="buildName(occurrence)" shape="circle" size="sm" />
            <span v-html="buildHour(occurrence)" />
          </div>
          <el-card :class="(occurrence.interaction ? occurrence.interaction.type : '') + ' ' + buildCommunicationType(occurrence)" class="dispute-view-occurrences__card">
            <div slot="header">
              {{ buildName(occurrence) }}
              <span class="divider">•</span>
              <jus-icon :icon="buildIcon(occurrence)" />
              {{ occurrence.id }}
            </div>
            <div>
              <span v-html="buildContent(occurrence)" />
              <div v-if="occurrence.interaction && occurrence.interaction.type === 'COMMUNICATION'">
                <br>
                <a href="#" @click.prevent="showMessageDialog(occurrence.interaction.message.messageId)">Ver mensagem</a>
              </div>
            </div>
          </el-card>
        </div>
    </li>
    <li v-if="!loading && !occurrences.length" class="dispute-view-occurrences__empty">
      <jus-icon icon="empty-screen-filter" />
      Não foram encontradas ocorrências.
    </li>
    <el-dialog
      :visible.sync="messageDialogVisible"
      data-testid="email-dialog"
      width="70%">
      <span slot="title">
        <h2>Mensagem</h2>
      </span>
      <div v-loading="!message">
        <span v-html="message"/>
      </div>
      <span slot="footer">
        <el-button plain data-testid="close-button" @click="messageDialogVisible = false">Fechar</el-button>
      </span>
    </el-dialog>
  </ul>
</template>

<script>
import { isBase64 } from '@/plugins/jusUtils'

export default {
  name: 'DisputeOccurrences',
  props: {
    occurrences: {
      type: Array,
      default: () => []
    },
    showScheduled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disputeId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      messageDialogVisible: false,
      message: ''
    }
  },
  methods: {
    hideScheduled (occurrence) {
      if (this.showScheduled) {
        return true
      } else {
        if (occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.status === 'WAITING') return false
        else return true
      }
    },
    showMessageDialog (messageId) {
      this.messageDialogVisible = true
      this.message = ''
      this.$store.dispatch('getOccurrenceMessage', messageId)
        .then(message => {
          this.message = message.content
        }).catch(error => {
          console.error(error)
        })
    },
    buildIcon (occurrence) {
      if (occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.communicationType) {
        return occurrence.interaction.message.communicationType.toLowerCase()
      }
      return 'negotiation2'
      // return occurrence.description.substr(0, occurrence.description.indexOf(' ')).toLowerCase()
    },
    buildName (occurrence) {
      if (occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.parameters) {
        return occurrence.interaction.message.parameters.SENDER_NAME ? occurrence.interaction.message.parameters.SENDER_NAME : occurrence.interaction.message.parameters.SENDER
      }
      if (occurrence.interaction && occurrence.interaction.properties) {
        return occurrence.interaction.properties.PERSON_NAME
      }
    },
    buildContent (occurrence) {
      if (occurrence.interaction && Object.keys(occurrence.interaction.properties).length) {
        if (occurrence.interaction.type === 'NEGOTIATOR_CHECKOUT') {
          return '<strong>Dados bancários alterados:</strong> <br>' + occurrence.interaction.properties.BANK_INFO.replace(/,/g, '<br>')
        }
        return 'Proposta ' + this.$t(occurrence.interaction.type) + ' R$ ' + occurrence.interaction.properties.VALUE.toUpperCase()
      }
      return occurrence.description
    },
    buildHour (occurrence) {
      if (occurrence.executionDateTime) {
        return this.$moment(occurrence.executionDateTime.dateTime).format('DD-MM[<br>]HH:mm')
      }
      if (occurrence.interaction && occurrence.interaction.message.scheduledTime.dateTime) {
        return this.$moment(occurrence.interaction.message.scheduledTime.dateTime).format('DD-MM[<br>]HH:mm')
      }
      return this.$moment(occurrence.createAt.dateTime).format('DD-MM[<br>]HH:mm')
    },
    buildCommunicationType (occurrence) {
      if (occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.communicationType) {
        return occurrence.interaction.message.communicationType
      }
      return occurrence.description.substr(0, occurrence.description.indexOf(' '))
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.dispute-view-occurrences {
  list-style: none;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  height: 100%;
  padding-bottom: 20px;
  &__occurrence {
    display: flex;
    justify-content: center;
  }
  &__interaction {
    margin: 20px 20px 0;
    display: flex;
    width: 100%;
    &.INBOUND {
      .VISUALIZATION {
        border: 1px solid #FFC5A5;
        .el-card__header {
          background-color: #FFC5A5;
          padding: 12px 20px;
        }
        .el-card__body {
          padding: 10px 20px 20px;
        }
      }
      .NEGOTIATOR_REJECTED, .NEGOTIATOR_PROPOSAL, .NEGOTIATOR_ACCEPTED {
        border: 1px solid #FFC5A5;
        .el-card__header {
          font-weight: bold;
          background-color: #FFC5A5;
          padding: 12px 20px;
        }
        .el-card__body {
          font-weight: bold;
          padding: 10px 20px 20px;
          color: #FFC5A5;
        }
      }
      .NEGOTIATOR_CHECKOUT {
        border: 1px solid #B691FB;
        .el-card__header {
          font-weight: bold;
          background-color: #B691FB;
          padding: 12px 20px;
        }
        .el-card__body {
          padding: 10px 20px 20px;
        }
        strong {
          color: #B691FB;
        }
      }
    }
    &.OUTBOUND {
      flex-direction: row-reverse;
      .dispute-view-occurrences__avatar {
        margin: 0 0 0 20px;
      }
      .COMMUNICATION {
        &.WHATSAPP {
          background-color: $--color-success-light-5;
          .el-card__header {
            font-weight: bold;
            padding: 18px 20px 0;
          }
          .el-card__body {
            padding: 10px 20px 20px;
          }
        }
        &.EMAIL {
          border: 1px solid #FFC5A5;
          background-color: #fff;
          .el-card__header {
            font-weight: bold;
            background-color: #FFC5A5;
            padding: 12px 20px;
          }
          .el-card__body {
            padding: 10px 20px 20px;
          }
        }
      }
    }
  }
  &__card {
    border-radius: 24px;
    .el-card__header {
      border: 0;
      font-size: 15px;
      img {
        width: 15px;
      }
      .divider {
        padding: 0 6px 0 3px;
      }
    }
    .el-card__body {
      font-size: 16px;
    }
  }
  &__log {
    border-radius: 24px;
    margin: 20px 20px 0;
    border: none;
    .el-card__body {
      padding: 8px 20px;
    }
  }
  &__avatar {
    margin: 0 20px 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: max-content;
    span {
      font-size: 12px;
      margin-top: 8px;
    }
  }
  &__empty {
    width: 100%;
    height: 100%;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: $--color-text-secondary;
    img {
      margin-bottom: 20px;
      width: 60px;
    }
  }
  .el-dialog__body {
    min-height: 200px;
    .el-loading-parent--relative {
      height: 100%;
    }
  }
}
</style>
