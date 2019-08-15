<template>
  <ul v-loading="loading" v-chat-scroll="{always: true, smooth: true, scrollonremoved: true }" class="dispute-view-messages">
    <li
      v-for="occurrence in occurrences"
      v-if="occurrence.message ? occurrence.message.status !== 'CANCELED' : true"
      v-show="hideScheduled(occurrence)"
      :key="occurrence.id"
      data-testid="message-index"
      class="dispute-view-messages__message">
      <div v-if="showAsCard(occurrence.type)" :class="directionClass(occurrence)" class="dispute-view-messages__message-box">
        <div>
          <div :class="directionClass(occurrence) + waitingClass(occurrence)" class="dispute-view-messages__message-content" data-testid="message-box">
            <div>{{ occurrence.description }}</div>
            <el-button
              v-if="occurrence.message && occurrence.message.communicationType === 'EMAIL'"
              type="text"
              data-testid="show-email"
              @click="showMessageDialog(occurrence.message.content)">
              Visualizar email
            </el-button>
            <span v-else v-html="occurrence.message && processMessage(occurrence.message.content)" />
            <i v-if="directionClass(occurrence) === 'NOTE'">
              <br>
              <jus-icon icon="eye" style="vertical-align: sub;"/>
              Esta mensagem é visível somente aos negociadores.
            </i>
            <i v-show="occurrence.message && occurrence.message.status === 'WAITING'">
              <br><br>
              <jus-icon icon="clock" is-active style="vertical-align: sub;"/>
              Esta é uma mensagem agendada que ainda não foi entregue.
            </i>
          </div>
          <div class="dispute-view-messages__message-time">
            <span v-if="occurrence.message && occurrence.message.schedulerTime && waitingClass(occurrence)">
              {{ occurrence.message.schedulerTime.dateTime | moment('DD [de] MMMM [às] HH:mm') }} •
            </span>
            <span v-else-if="occurrence.message && occurrence.message.executionTime">
              {{ occurrence.message.executionTime.dateTime | moment('DD [de] MMMM [às] HH:mm') }} •
            </span>
            <span v-else-if="occurrence.executionDateTime">
              {{ occurrence.executionDateTime.dateTime | moment('DD [de] MMMM [às] HH:mm') }} •
            </span>

            <span v-if="directionClass(occurrence) !== 'note'">
              <jus-icon :icon="getMessageIcon(occurrence.message)" />
              <span v-if="occurrence.message && occurrence.message.sender">
                • {{ getSenderName(occurrence.message) | firstName }}
              </span>
            </span>
            <span v-else>
              Nota
            </span>
          </div>
        </div>
        <jus-avatar-user
          v-if="occurrence.message"
          :name="getSenderName(occurrence.message)"
          :purple="directionClass(occurrence) === 'inbound'"
          size="sm" />
      </div>
      <div v-else class="dispute-view-messages__message-log">
        <div :class="occurrence.type === 'TYPING' ? 'typing' : ''">{{ occurrence.description }}</div>
        {{ occurrence.executionDateTime ? occurrence.executionDateTime.dateTime : '' | moment('DD/MM/YYYY - HH:mm') }}
      </div>
    </li>
    <el-dialog
      :visible.sync="showMessage"
      data-testid="email-dialog"
      width="80%">
      <span v-html="messageContent"/>
      <span slot="footer" class="dialog-footer">
        <el-button plain data-testid="close-button" @click="showMessage = false">Fechar</el-button>
      </span>
    </el-dialog>
  </ul>
</template>

<script>
import { isBase64 } from '@/plugins/jusUtils'

export default {
  name: 'DisputeMessages',
  props: {
    messagesProp: {
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
    }
  },
  data () {
    return {
      showMessage: false,
      messageContent: '',
      typing: '',
      typingTimeout: 0
    }
  },
  computed: {
    occurrences () {
      return this.messagesProp.filter(occurrence => {
        if (!occurrence) {
          return false
        }
        switch (this.currentTab) {
          case '1':
            return occurrence.type !== 'NOTE'
            // if (occurrence.type !== 'NOTE') {
            //   if (occurrence.message && occurrence.message.type === 'CHAT') {
            //     return false
            //   } else {
            //     return true
            //   }
            // } else {
            //   return false
            // }
          case '2':
            return occurrence.message && occurrence.message.type === 'CHAT'
          case '3':
            return occurrence.type === 'NOTE'
        }
      })
    }
  },
  watch: {
    typing (value) {
      if (value.sender.personId !== this.$store.getters.personId) {
        this.removeTypingMessage()
        this.messages.push({
          id: 0,
          description: value.sender.name + ' ' + this.$t('isTyping'),
          type: 'TYPING'
        })
        clearTimeout(this.typingTimeout)
        this.typingTimeout = setTimeout(() => {
          this.removeTypingMessage()
        }, 4000)
      }
    }
  },
  mounted () {
    this.$store.watch(state => state.socketModule.chat.typing, typing => {
      this.typing = typing
    })
    this.$store.watch(state => state.socketModule.chat.join, join => {
      setTimeout(() => {
        this.$emit('dispute:occurrences:get')
      }, 1000)
    })
    this.$store.watch(state => state.socketModule.chat.message, join => {
      setTimeout(() => {
        this.$emit('dispute:occurrences:get')
      }, 1000)
    })
    this.$store.watch(state => state.socketModule.chat.leave, join => {
      setTimeout(() => {
        this.$emit('dispute:occurrences:get')
      }, 1000)
    })
  },
  methods: {
    removeTypingMessage () {
      this.messages = this.messages.filter(function (obj) {
        return obj.id !== 0
      })
    },
    showAsCard (type) {
      if (type === 'INTERACTION' || type === 'COMMUNICATION' || type === 'NOTE') {
        return true
      } return false
    },
    processMessage (content) {
      if (isBase64(content)) {
        return '<center><img src="data:image/png;base64,' + content + '"/></center>'
      }
      return content
    },
    showMessageDialog (content) {
      this.messageContent = content
      this.showMessage = true
    },
    directionClass (occurrence) {
      if (occurrence.type === 'NOTE') return 'note'
      if (occurrence.message) {
        if (occurrence.message.direction === 'OUTBOUND') return 'outbound'
        if (occurrence.message.direction === 'INBOUND') return 'inbound'
      }
    },
    waitingClass (occurrence) {
      if (occurrence.message && occurrence.message.status === 'WAITING') {
        return ' waiting'
      }
      return ''
    },
    getSenderName (message) {
      if (message) {
        if (message.parameters && message.parameters.SENDER_NAME) {
          return message.parameters.SENDER_NAME
        }
        return message.sender
      }
      return ''
    },
    hideScheduled (occurrence) {
      if (this.showScheduled) {
        return true
      } else {
        if (occurrence.message && occurrence.message.status === 'WAITING') return false
        else return true
      }
    },
    getMessageIcon (occurrence) {
      if (occurrence) {
        switch (occurrence.type) {
          case 'EMAIL_CNA':
            return 'cna'
          case 'EMAIL':
            return 'email'
          case 'WHATSAPP':
            return 'whatsapp'
          case 'SMS':
            return 'sms'
          case 'TTS':
            return 'tts'
          case 'PUSH_NOTIFICATION':
            return 'notification'
          default:
            return 'chat'
        }
      } else {
        return 'chat'
      }
    }
  }
}
</script>

<style lang="scss">
.dispute-view-messages {
  overflow-y: auto;
  height: 100%;
  margin: 0;
  padding: 0;
  &__message {
    list-style: none;
  }
  &__message-box {
    display: flex;
    margin: 30px 20px;
    justify-content: flex-end;
    &.inbound {
      flex-direction: row-reverse;
      .dispute-view-messages__message-time {
        text-align: left;
      }
    }
  }
  &__message-content {
    box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.12);
    background-color: #e4e8ea;
    border-radius: 4px;
    padding: 10px 20px;
    position: relative;
    margin-right: 15px;
    &:after {
      content: '';
      position: absolute;
      right: 10px;
      top: 20px;
      width: 0;
      height: 0;
      border: 17px solid transparent;
      border-left-color: #e4e8ea;
      border-right: 0;
      margin-top: -17px;
      margin-right: -17px;
    }
    &.inbound {
      box-shadow: -4px 4px 24px 0 rgba(37, 38, 94, 0.12);
      margin-right: 0;
      margin-left: 15px;
      background-color: #fff;
      &:after {
        left: -10px;
        border: 17px solid transparent;
        border-right-color: #fff;
        border-left: 0;
      }
    }
    &.waiting {
      border: 1px dashed #9461f7;
    }
    &.note {
      background-color: #ffeba1;
      &:after {
        border-left-color: #ffeba1;
      }
    }
    div {
      font-weight: 500;
      word-break: break-all;
    }
    > span {
      display: block;
      margin-top: 10px;
      font-weight: 300;
    }
  }
  &__message-log {
    text-align: center;
    color: #adadad;
    margin: 20px;
  }
  &__message-time {
    font-size: 12px;
    text-align: right;
    margin: 10px 20px 0;
    font-weight: 500;
    word-spacing: 5px;
    img {
      vertical-align: bottom;
    }
  }
  .jus-avatar-user span, .jus-avatar-user img {
    width: 3rem;
    height: 3rem;
  }
  .el-button--text {
    padding-bottom: 0;
  }
  .typing:after {
    content: ' .';
    animation: dots 1s steps(5, end) infinite;
  }
}
</style>
