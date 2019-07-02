<template>
  <ul v-loading="loading" v-chat-scroll="{always: true, smooth: true, scrollonremoved: true }" class="dispute-view-messages">
    <li
      v-for="message in messages"
      v-if="isntCanceled(message)"
      v-show="checkShowScheduled(message)"
      :key="message.id"
      class="dispute-view-messages__message">
      <div v-if="showAsCard(message.type)" :class="directionClass(message)" class="dispute-view-messages__message-box">
        <div>
          <div :class="directionClass(message) + waitingClass(message)" class="dispute-view-messages__message-content">
            <div>{{ message.description }}</div>
            <el-button v-if="message.message && message.message.type === 'EMAIL'" type="text" @click="showMessageDialog(message.message.content)">Visualizar email</el-button>
            <span v-else v-html="message.message && message.message.content" />
            <i v-if="directionClass(message) === 'note'">
              <br>
              <jus-icon icon="eye" style="vertical-align: sub;"/>
              Esta mensagem é visível somente aos negociadores.
            </i>
            <i v-show="message.message && message.message.status === 'WAITING'">
              <br><br>
              <jus-icon icon="clock" is-active style="vertical-align: sub;"/>
              Esta é uma mensagem agendada que ainda não foi entregue.
            </i>
          </div>
          <div class="dispute-view-messages__message-time">
            <span v-if="message.executionDateTime || message.message.schedulerTime">
              {{ message.executionDateTime != null ? message.executionDateTime : message.message.schedulerTime | moment('DD [de] MMMM [às] HH:mm') }} •
            </span>
            <span v-if="directionClass(message) !== 'note'">
              <jus-icon :icon="getMessageIcon(message.message)" />
              <span v-if="message.message && message.message.senderName">
                • {{ message.message.senderName | firstName }}
              </span>
            </span>
            <span v-else>
              Nota
            </span>
          </div>
        </div>
        <jus-avatar-user
          v-if="message.message"
          :name="message.message.senderName"
          :purple="directionClass(message) === 'inbound'"
          size="sm" />
      </div>
      <div v-else class="dispute-view-messages__message-log">
        <div :class="message.type === 'TYPING' ? 'loading' : ''">{{ message.description }}</div>
        {{ message.executionDateTime | moment('DD/MM/YYYY - HH:mm') }}
      </div>
    </li>
    <el-dialog
      :visible.sync="showMessage"
      width="80%">
      <span v-html="messageContent"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showMessage = false">Fechar</el-button>
      </span>
    </el-dialog>
  </ul>
</template>

<script>
export default {
  name: 'DisputeMessages',
  props: {
    messagesProp: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    showScheduled: {
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
    messages () {
      return this.messagesProp.filter(message => {
        if (this.currentTab === '3') {
          return message.type === 'NOTE'
        } else {
          return true
        }
      })
      // TRECHO DE CÓDIGO PRONTO ESPERANDO CHAT FUNCIONAR
      // switch (this.currentTab) {
      //   case '1':
      //     if (message.type !== 'NOTE') {
      //       if (message.message && message.message.type === 'CHAT') {
      //         return false
      //       } else {
      //         return true
      //       }
      //     } else {
      //       return false
      //     }
      //   case '2':
      //     return message.message && message.message.type === 'CHAT'
      //   case '3':
      //     return message.type === 'NOTE'
      // }
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
        this.$emit('dispute:refresh')
      }, 1000)
    })
    this.$store.watch(state => state.socketModule.chat.message, join => {
      setTimeout(() => {
        this.$emit('dispute:refresh')
      }, 1000)
    })
    this.$store.watch(state => state.socketModule.chat.leave, join => {
      setTimeout(() => {
        this.$emit('dispute:refresh')
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
    showMessageDialog (content) {
      this.messageContent = content
      this.showMessage = true
    },
    directionClass (message) {
      if (message.message && (message.message.direction === 'INBOUND' || message.message.senderParty === 'CLAIMANT')) {
        return 'inbound'
      } else if (message.message && message.message.type === 'NOTE') {
        return 'note'
      } else return 'outbound'
    },
    waitingClass (message) {
      if (message.message && message.message.status === 'WAITING') {
        return ' waiting'
      }
      return ''
    },
    checkShowScheduled (message) {
      if (!this.showScheduled) {
        if (message.message && message.message.status === 'WAITING') {
          return false
        } else return true
      } else return true
    },
    isntCanceled (message) {
      if (message.message) {
        if (message.message.status === 'CANCELED') {
          return false
        } return true
      } return true
    },
    getMessageIcon (message) {
      if (message) {
        switch (message.type) {
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
  .loading:after {
    content: ' .';
    animation: dots 1s steps(5, end) infinite;
  }
  @keyframes dots {
    0%, 20% {
      color: rgba(0,0,0,0);
      text-shadow:
        .25em 0 0 rgba(0,0,0,0),
        .5em 0 0 rgba(0,0,0,0);
    }
    40% {
      color: #adadad;
      text-shadow:
        .25em 0 0 rgba(0,0,0,0),
        .5em 0 0 rgba(0,0,0,0);
    }
    60% {
      text-shadow:
        .25em 0 0 #adadad,
        .5em 0 0 rgba(0,0,0,0);
    }
    80%, 100% {
      text-shadow:
        .25em 0 0 #adadad,
        .5em 0 0 #adadad;
    }
  }
}
</style>
