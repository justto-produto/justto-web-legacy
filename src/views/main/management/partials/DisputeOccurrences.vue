<template lang="html">
  <ul v-loading="loading" v-chat-scroll="{always: true, smooth: true, scrollonremoved: true }" class="dispute-view-occurrences">
    <li
      v-for="(occurrence, index) in occurrences"
      :key="occurrence.id + index"
      class="dispute-view-occurrences__occurrence">
        <el-card v-if="occurrence.type === 'LOG'" shadow="never" class="dispute-view-occurrences__log el-card--bg-warning">
          {{ occurrence.description }}
        </el-card>
        <div v-else-if="occurrence.interaction" class="dispute-view-occurrences__interaction" :class="occurrence.interaction.direction">
          <div class="dispute-view-occurrences__avatar">
            <jus-avatar-user shape="circle" size="sm" />
            <span>16:20</span>
          </div>
          <el-card :class="occurrence.interaction.type + ' ' + occurrence.interaction.message.communicationType" class="dispute-view-occurrences__card">
            <div slot="header">
              {{ occurrence.interaction.message.parameters.SENDER_NAME}}
              <span class="divider">•</span>
              <jus-icon icon="notification-justto" />
            </div>
            <div>
              {{ occurrence.description }}
              <div v-if="occurrence.interaction.type === 'COMMUNICATION'">
                <br>
                <a href="#" @click.prevent="showMessageDialog(occurrence.interaction.message.messageId)">Ver mensagem</a>
              </div>
            </div>
          </el-card>
        </div>
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
    currentTab: {
      type: String,
      default: '1'
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
    showMessageDialog (messageId) {
      this.messageDialogVisible = true
      this.message = ''
      this.$store.dispatch('getOccurrenceMessage', messageId)
        .then(message => {
          this.message = message.content
        }).catch(error => {
          console.error(error)
        })
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
  height: 100%;
  &__occurrence {
    display: flex;
    justify-content: center;
  }
  &__interaction {
    margin: 20px 20px 0;
    display: flex;
    width: 100%;
    &.OUTBOUND {
      flex-direction: row-reverse;
      .dispute-view-occurrences__avatar {
        margin: 0 0 0 20px;
      }
    }
  }
  &__card {
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
    &.VISUALIZATION {
      border: 1px solid #FFC5A5;
      .el-card__header {
        background-color: #FFC5A5;
      }
    }
    &.COMMUNICATION {
      &.WHATSAPP {
        background-color: $--color-success-light-5;
        .el-card__header {
          padding: 18px 20px 0;
        }
        .el-card__body {
          padding: 10px 20px 20px;
        }
      }
      background-color: $--color-cloudy-blue;
      .el-card__header {
        padding: 18px 20px 0;
      }
      .el-card__body {
        padding: 10px 20px 20px;
      }
    }
  }
  &__log {
    margin: 20px 20px 0;
    border: none;
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
  .el-dialog__body {
    min-height: 200px;
    .el-loading-parent--relative {
      height: 100%;
    }
  }
  .el-dialog__header {
    // padding-top: 10px;
  }
}
</style>
