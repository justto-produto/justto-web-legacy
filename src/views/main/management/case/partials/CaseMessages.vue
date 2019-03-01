<template>
  <ul v-loading="loading" v-chat-scroll="{always: true, smooth: true}" class="case-view-messages">
    <li
      v-for="message in messages"
      v-show="checkShowScheduled(message)"
      :key="message.id"
      class="case-view-messages__message">
      <div v-if="showAsCard(message.type)" :class="directionClass(message)" class="case-view-messages__message-box">
        <div>
          <div :class="directionClass(message) + waitingClass(message)" class="case-view-messages__message-content">
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
          <div class="case-view-messages__message-time">
            {{ message.executionDateTime | moment('DD/MM/YYYY - HH:mm') }}
          </div>
        </div>
        <jus-avatar-user
          :name="message.message && message.message.senderName"
          :purple="directionClass(message) === 'inbound'"
          size="sm" />
      </div>
      <div v-else class="case-view-messages__message-log">
        {{ message.description }} <br> {{ message.executionDateTime | moment('DD/MM/YYYY - HH:mm') }}
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
  name: 'CaseMessages',
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: true
    },
    showScheduled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showMessage: false,
      messageContent: ''
    }
  },
  methods: {
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
      if (message.message && message.message.direction === 'INBOUND') {
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
    }
  }
}
</script>

<style lang="scss">
.case-view-messages {
  overflow-y: auto;
  height: 100%;
  margin: 0;
  padding: 0;
  &__message {
    list-style: none;
  }
  &__message-box {
    display: flex;
    margin: 20px;
    justify-content: flex-end;
    &.inbound {
      flex-direction: row-reverse;
      .case-view-messages__message-time {
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
  }
  .jus-avatar-user span, .jus-avatar-user img {
    width: 3rem;
    height: 3rem;
  }
  .el-button--text {
    padding-bottom: 0;
  }
}
</style>
