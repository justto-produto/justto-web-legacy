<template>
  <article
    v-if="canAccessDialer"
    class="dialer"
  >
    <div
      class="dialer__button"
      @click="showPopover = !showPopover"
    >
      <el-popover
        v-model="showPopover"
        trigger="manual"
        placement="bottom-end"
      >
        <CallQueue />

        <JusIcon
          slot="reference"
          :icon="dialerIcon"
        />
      </el-popover>
    </div>

    <div
      v-if="isActiveToCall"
      class="dialer__container"
    >
      <audio
        id="remoteAudio"
        class="dialer__container-audio"
        controls
        autoplay="autoplay"
      />

      <audio
        v-if="isActiveToCall"
        id="speakerAudio"
        :src="activeRingtone"
        class="dialer__container-audio"
        controls
        loop
        autoplay="autoplay"
      />
    </div>
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { CALL_STATUS } from '@/constants/callStatus'
import { uuidv4 } from '@/utils'

import DialerUserModel from '@/store/modules/dialer/model/DialerUserModel'

export default {
  components: {
    CallQueue: () => import('./CallQueue.vue')
  },

  data() {
    const user = new DialerUserModel()
    return {
      loading: false,
      visible: false,
      showPopover: false,
      bodyVisible: true,
      top: 100,
      left: 450,
      number: '',
      configs: null,
      session: null,
      ua: null,
      sipStack: null,
      registerSession: null,
      user
    }
  },

  computed: {
    ...mapGetters({
      listCallQueue: 'getCallQueue',
      workspaceId: 'workspaceId',
      appInstance: 'getAppInstance',
      preferences: 'userPreferences',
      currentCall: 'getCurrentCallId',
      isActiveToCall: 'isActiveToCall',
      canAccessDialer: 'canAccessDialer',
      currentActiveCall: 'getCurrentCall',
      workspaceTeamName: 'workspaceTeamName',
      isPendingToAnswerCurrentCall: 'isPendingToAnswerCurrentCall'
    }),

    activeRingtone() {
      if ([CALL_STATUS.RECEIVING_CALL].includes(this.currentActiveCall)) {
        return 'https://storage.googleapis.com/justto_app/audio/justto_auto_answer_ring.wav'
      } else {
        return ''
      }
    },

    dialerIcon() {
      return !this.isActiveToCall ? 'not-main-phone-active' : [CALL_STATUS.ACTIVE_CALL].includes(this.currentActiveCall?.status) ? 'phone-active' : 'tts'
    },

    hasAcceptTerms() {
      return !!this.preferences.properties.ACCEPT_DIALER_TERMS
    },

    hasNotAcceptTerms() {
      return !!this.preferences.properties.REJECT_DIALER_TERMS
    }
  },

  watch: {
    visible(current) {
      if (current) {
        this.init()
      } else {
        this.activeAppToCall(true)
      }
    },

    isActiveToCall(is) {
      if (is) {
        this.showPopover = true
      }
    },

    listCallQueue: {
      deep: true,
      handler: 'handleQueueChange'
    }
  },

  created() {
    this.setAppInstance(uuidv4())
  },

  methods: {
    ...mapActions([
      'addCall',
      'dialerLogin',
      'createNewCall',
      'activeAppToCall',
      'setAppInstance',
      'loadVoiceServer',
      'loadVoiceServer',
      'clearCurrentCall',
      'deleteCurrentCall',
      'startServerStatus',
      'startServerStatus',
      'changeServerStatus',
      'setAccountProperty',
      'refreshServiceStatus',
      'startDialerRequester',
      'availableServerStatus',
      'availableServerStatus'
    ]),

    open(number) {
      this.number = number
      this.visible = true
      this.showPopover = true
    },

    handleQueueChange(current, old) {
      const isBigger = current.length > old.length
      const isWaiting = current.length > 0 && ![CALL_STATUS.ENQUEUED, CALL_STATUS.COMPLETED_CALL].includes(current[0].status)

      if (isBigger || isWaiting) {
        this.showPopover = true
      }
    },

    doLogin() {
      return this.dialerLogin(this.user)
    },

    drag(event) {
      const { x, y } = event

      this.top = (y - 15) > 0 ? (y - 15) : this.top
      this.left = (x - 140) > 0 ? (x - 140) : this.left
    },

    init() {
      this.activeAppToCall(true)
    },

    login() {
      this.registerSession = this.sipStack.newSession('register', {
        events_listener: {
          events: '*',
          listener: this.eventHub
        }
      })

      this.registerSession.register()
    },

    acceptCall(e) {
      e.newSession.accept({
        audio_remote: document.getElementById('remoteAudio'),
        events_listener: {
          events: '*',
          listener: this.eventHub
        }
      })
    },

    acceptedCallConditions() {
      this.loading = true

      this.setAccountProperty({
        ACCEPT_DIALER_TERMS: this.$moment().toISOString()
      }).then(() => this.setAccountProperty({
        REJECT_DIALER_TERMS: null
      }))
    },

    rejectedCallConditions() {
      this.loading = true

      this.setAccountProperty({
        ACCEPT_DIALER_TERMS: null
      }).then(() => this.setAccountProperty({
        REJECT_DIALER_TERMS: this.$moment().toISOString()
      })).finally(() => {
        this.close()
      })
    },

    validateCallTerms() {
      const text = 'Todas as ligações realizadas pela plataforma são gravadas e são disponibilizadas para os participantes da disputa e para os administradores dos times.<br><br>Você entende e concorda que a JUSTTO grave todas as suas ligações com as partes da disputa para auditorias futuras da negociação?'

      return this.$confirm(text, 'Iniciando ligação', {
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        showClose: false,
        center: true
      }).then(() => {
        this.acceptedCallConditions()
        this.startCall()
      }).catch(() => this.rejectedCallConditions())
    },

    revalidateCallTerms() {
      const rejectDate = this.$moment(this.preferences.properties.REJECT_DIALER_TERMS).format('DD/MM/YYYY')
      const text = `Não é possível realizar ligações porque em ${rejectDate} você não concordou em ter suas conversas gravadas e o sistema não oferece ligações sem monitoramento.`

      return this.$confirm(text, 'Ops! Você não pode fazer ligações.', {
        confirmButtonText: 'Ok, entendo',
        cancelButtonText: 'Quero aceitar',
        closeOnPressEscape: false,
        closeOnClickModal: false,
        showClose: false,
        center: true
      })
    },

    call() {
      if (!this.hasAcceptTerms && !this.hasNotAcceptTerms) {
        this.validateCallTerms()
      } else if (this.hasNotAcceptTerms) {
        this.revalidateCallTerms().then(this.close).catch(() => {
          this.validateCallTerms()
        })
      } else if (this.hasAcceptTerms) {
        this.startCall()
      }
    },

    startCall() {
      // this.loading = true

      // this.addCall({
      //   // disptueId,
      //   // toRoleId,
      //   // toRoleName,
      //   number: `+55${this.number}`,
      //   workspaceId: this.workspaceId,
      //   teamName: this.workspaceTeamName,
      //   appInstance: this.appInstance
      // }).finally(() => {
      //   this.loading = false
      // })

      // this.createNewCall(`+55${this.number}`).then(callInfo => {
      //   this.$jusSegment('ligação', {
      //     numebr: this.number,
      //     ...callInfo
      //   })
      // }).catch(() => {
      //   this.deleteCurrentCall()
      // }).finally(() => {
      //   this.loading = false
      // })
    },

    shutdownCall() {
      this.deleteCurrentCall()
    },

    eventHub(e) {
      switch (e.type) {
        case 'started':
          this.login()
          break
        case 'i_new_call':
          this.acceptCall(e)
          break
        case 'terminated':
          this.clearCurrentCall()
          break
        default:
          if (process.env.NODE_ENV === 'development') {
            console.log(e)
          }
          break
      }
    },

    close() {
      return new Promise((resolve) => {
        this.loading = false
        this.visible = false
        resolve()
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.dialer {
  .dialer__button {
    text-align: center;
    cursor: pointer;

    // margin: 0 auto 16px;

    margin: 8px 16px 8px 8px;
  }

  .dialer__container {

    background-color: white;
    border: solid $--color-primary 2px;
    border-radius: 10px;

    display: flex;
    flex-direction: column;

    .dialer__container-title {
      width: 100%;
      padding: 8px;

      border-bottom: solid $--color-primary 2px;

      display: flex;
      justify-content: space-between;
      align-items: center;

      .dialer__container-title-actions {
        display: flex;
        align-items: center;

        gap: 8px;

        i {
          cursor: pointer;

          &.el-icon-rank {
            cursor: move;
          }
        }

      }

      &.without-border {
        border: none;
      }
    }

    .dialer__container-audio {
      display: none;
    }

    .dialer__container-body {
      margin: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .el-input {
        .el-input-group__prepend {
          padding: 0 8px;
        }

        .el-input__inner {
          text-align: right;
        }
      }

      .dialer__container-body-buttons {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .dialer__container-body-buttons-line {
          display: flex;
          justify-content: space-around;

          .el-button {
            min-width: 48px;
          }
        }
      }
    }

    .dialer__container-footer {
      .dialer__container-footer-alert {
        font-size: 12px;
        text-align: center;

        sup {
          color: $--color-danger;
        }
      }
    }
  }
}
</style>
