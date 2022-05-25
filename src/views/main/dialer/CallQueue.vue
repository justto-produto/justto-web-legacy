<template>
  <article
    v-loading="loading"
    class="call-queue__container"
  >
    <div
      v-if="isActiveToCall || hasCallInQueue"
      class="call-queue__container-feedback"
    >
      <audio
        id="ringAudio"
        ref="ringAudio"
        src="https://s3.sa-east-1.amazonaws.com/novo.justto.app/notification-new-dialer.mp3"
        loop
      />

      <audio
        ref="endAudio"
        src="https://storage.googleapis.com/justto_app/audio/CallEndTuTuTu.mp3"
        loop
      />

      <div
        v-if="isActiveToCall && isOpenCall"
        class="call-queue__container-feedback-hangup"
      >
        <el-button
          class="in-call-btn"
          type="text"
        >
          {{ endingCall ? 'Encerrando chamada' : 'Em chamada' }}
        </el-button>

        <el-tooltip
          :content="netSpeedBtnText"
          :open-delay="500"
        >
          <el-button
            class="speed-btn"
            :type="netSpeedBtnStatus"
            size="mini"
            icon="el-icon-phone-outline"
            round
            plain
          >
            {{ netSpeedMbps }}
          </el-button>
        </el-tooltip>

        <br>

        <el-button
          :disabled="endingCall"
          type="danger"
          :icon="endingCall ? 'el-icon-loading' : ''"
          @click="hangUpCall()"
        >
          {{ endingCall ? 'Desligando' : 'Desligar' }}
        </el-button>
      </div>

      <div v-if="!isOpenCall && hasCallInQueue">
        <div v-if="isPendingToAnswerCurrentCall">
          <p>Entrando na chamada</p>
        </div>

        <div
          v-else
          class="waiting-dialer"
        >
          <p>
            <span>
              <!-- Aguardando discador -->
              Sua ligação está sendo realizada
              <el-tooltip
                content="Aguardando disponibilidade de um discador. Por favor aguarde!"
                placement="top-end"
              >
                <i class="el-icon-info" />
              </el-tooltip>
            </span>
          </p>

          <h4>
            Existem outras pessoas na sua frente utilizando o telefone.
            <br>
            Por favor aguarde ou adquira um telefone dedicado pra você.
          </h4>

          <p>
            <el-skeleton
              :rows="1"
              animated
              class="load-skeleton"
            />
          </p>

          <el-button
            v-if="isActiveToCall && (isAdminProfile || isJusttoAdmin)"
            type="primary"
            size="mini"
            @click="openBuyDialerDialog"
          >
            Adquira discadores dedicados
          </el-button>
        </div>
      </div>

      <div v-if="!isInCorrectDispute && hasCallInQueue">
        <el-button
          size="mini"
          type="secondary"
          icon="el-icon-phone-outline"
          @click="redirectToDispute"
        >
          <span>Ir para a disputa.</span>
        </el-button>
      </div>
    </div>

    <div
      v-for="(call, callIndex) in callQueue"
      :key="`callQueueItem-${callIndex}`"
      class="call-queue__container-call-queue"
    >
      <div class="call-queue__container-call-queue-line">
        <div class="call-queue__container-call-queue-line-item">
          #{{ call.disputeId }} ({{ $tc(`ticket-status.${call.disputeStatus}`) }})
        </div>

        <el-tag
          class="call-queue__container-call-queue-line-item"
          size="mini"
        >
          {{ $tc(`call.status.${call.status}`) }}
        </el-tag>
      </div>

      <div class="call-queue__container-call-queue-line">
        <div class="call-queue__container-call-queue-line-item">
          {{ call.toRoleName | resumedName }}
        </div>

        <div class="call-queue__container-call-queue-line-item">
          {{ call.number | phoneNumber }}
        </div>

        <el-button
          :disabled="endingCall"
          type="danger"
          :icon="endingCall ? 'el-icon-loading' : 'el-icon-delete'"
          size="mini"
          circle
          plain
          @click="remove(call.id)"
        />
      </div>
    </div>

    <div
      v-if="callQueue.length === 0"
      class="call-queue__container-empty-queue"
    >
      <i
        v-if="enabledScheduledCalls && scheduledCallsQueue.length > 0"
        class="el-icon-loading"
      />

      <jus-icon
        v-else
        class="call-queue__container-empty-queue-icon"
        :icon="enabledScheduledCalls ? 'clock' : 'checked'"
      />

      <div
        v-if="enabledScheduledCalls"
        class="call-queue__container-empty-queue-label"
      >
        {{ scheduledCallsQueue.length ? 'Localizando sua próxima chamada.' : 'Sem chamadas agendadas.' }}
      </div>

      <div
        v-else
        class="call-queue__container-empty-queue-label"
      >
        Sem ligações pendentes
      </div>
    </div>

    <ScheduledCallSwitch v-if="isJusttoDev" />

    <ScheduledCallsQueue v-if="isJusttoDev" />

    <CallHelp
      :ending="endingCall"
      @queue:hide="$emit('hide')"
      @call:end="hangUpCall()"
    />
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { CALL_STATUS } from '@/constants/callStatus'

export default {
  components: {
    CallHelp: () => import('@/components/dialogs/CallHelpWizard'),
    ScheduledCallSwitch: () => import('@/components/buttons/ScheduledCallSwitch'),
    ScheduledCallsQueue: () => import('./ScheduledCallsQueue')
  },

  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    endingCall: false,
    forwardedDisputeId: null
  }),

  computed: {
    ...mapGetters({
      dialer: 'getDialer',
      isOpenCall: 'isOpenCall',
      callQueue: 'getCallQueue',
      isJusttoDev: 'isJusttoDev',
      currentCall: 'getCurrentCall',
      isJusttoAdmin: 'isJusttoAdmin',
      backups: 'getMessagesBackupById',
      isAdminProfile: 'isAdminProfile',
      isActiveToCall: 'isActiveToCall',
      hasCallInQueue: 'hasCallInQueue',
      netSpeed: 'getSipConnectionSpeed',
      currentAppInstance: 'getAppInstance',
      disputeInterface: 'preferedInterface',
      scheduledCallsQueue: 'getScheduledCallsQueue',
      enabledScheduledCalls: 'canMakeScheduledCalls',
      isPendingToAnswerCurrentCall: 'isPendingToAnswerCurrentCall'
    }),

    netSpeedMbps() {
      return (this.netSpeed / 1024).toFixed(0) + ' Kbps'
    },

    netSpeedBtnStatus() {
      return this.netSpeed <= 1024 ? 'danger' : this.netSpeed <= (1024 * 5) ? 'warning' : 'success'
    },

    netSpeedBtnText() {
      const danger = 'Conexão muito instável.'
      const warning = 'Conexão instável.'
      const success = 'Conexão estável.'

      return this.netSpeed <= 1024 ? danger : this.netSpeed <= (1024 * 5) ? warning : success
    },

    currentDisputeId() {
      return this.$route.params?.id
    },

    isInDispute() {
      return ['dispute', 'ticket'].includes(this.$route?.name)
    },

    isInCorrectDispute() {
      return this.isInDispute && Number(this.currentCall?.disputeId) === Number(this.currentDisputeId)
    }
  },

  watch: {
    currentCall: {
      deep: true,
      handler: 'handleCallUpdate'
    }
  },

  methods: {
    ...mapActions({
      openBuyDialerDialog: 'openBuyDialerDialog',
      answerCurrentCall: 'answerCurrentCall',
      removeCall: 'SOCKET_REMOVE_CALL',
      callTerminated: 'callTerminated',
      endCall: 'endCall'
    }),

    answerCall(answer) {
      this.answerCurrentCall(answer).then(hasConected => {
        if (answer) {
          if (hasConected) {
            this.$jusSegment('START_DIALER_CALL', { ...this.currentCall })
            // this.redirectToDispute()
          } else {
            this.$jusNotification({
              title: 'Ops!',
              message: 'Não foi possível continuar a chamada.',
              type: 'warning'
            })
          }
        }
      })
    },

    redirectToDispute() {
      const { disputeId } = this.currentCall
      const path = this.disputeInterface === 'NEGOTIATION' ? `/negotiation/${disputeId}` : `management/dispute/${disputeId}`
      this.forwardedDisputeId = disputeId

      this.$router.push({ path })
    },

    backToFowwarded() {
      this.forwardedDisputeId = null
      history.back()
    },

    remove(id) {
      const { ACTIVE_CALL, RECEIVING_CALL } = CALL_STATUS
      const hasDialer = [ACTIVE_CALL, RECEIVING_CALL].includes(this.currentCall?.status)

      if (id === this.currentCall?.id && hasDialer) {
        this.hangUpCall()
      } else {
        this.removeCall({ callId: id })
      }
    },

    hangUpCall() {
      this.endingCall = true

      this.endCall({
        dialerId: this.dialer.id,
        callId: this.currentCall.id
      }).then(() => {
        const audio = this.$refs.endAudio

        audio.play()
        this.endingCall = false

        setTimeout(() => { audio.pause() }, 1500)
      })
    },

    handleCallUpdate(call, oldCall) {
      if ([oldCall?.status, call?.status].includes('COMPLETED_CALL')) {
        this.$jusSegment('END_DIALER_CALL', { ...(call || oldCall) })

        const { message, note } = this.backups(this.forwardedDisputeId)

        if (this.forwardedDisputeId && (message || note)) {
          this.$confirm(`Você estava trabalhando na disputa <b>#${this.forwardedDisputeId}</b> antes de fazer a ligação telefônica.<br><br><b>Deseja voltar para ela?<b>`, `Voltar pra disputa #${this.forwardedDisputeId}`, {
            confirmButtonText: `Sim, voltar pra disputa #${this.forwardedDisputeId}.`,
            cancelButtonText: 'Não, permanecer nesta disputa.',
            customClass: 'back-forward-dispute-confirm',
            dangerouslyUseHTMLString: true,
            closeOnClickModal: false,
            closeOnPressEscape: true,
            showClose: false,
            center: true
          }).then(this.backToFowwarded).finally(() => { this.forwardedDisputeId = null })
        } else { this.forwardedDisputeId = null }
      } else if (['RECEIVING_CALL'].includes(call?.status)) {
        this.$refs.ringAudio.play()
        setTimeout(() => this.answerCall(true), 4000)
      } else if (!['RECEIVING_CALL'].includes(call?.status) && this.$refs.ringAudio) {
        this.$refs.ringAudio.pause()
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.call-queue__container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 300px;
  width: 100%;

  .call-queue__container-feedback {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;

    * {
      text-align: center;
    }

    div {
      display: flex;
      justify-content: center;
      flex-direction: column;

      .in-call-btn {
        cursor: text;

        span {
          font-weight: 600;
        }
      }

      .speed-btn {
        position: absolute;
        top: 0;
        right: 0;

        border: none;
        margin: 4px 4px 0 0;
        padding: 4px 8px !important;

        span {
          font-size: 10px;
        }
      }

      p:not(.end-call__text) {
        font-size: 18px;
        font-weight: bold;
      }

      .end-call__text {
        color: $--color-danger;
        font-size: 12px;
      }

      .waiting-dialer {
        max-width: 25vw;
        word-break: break-word;
        display: flex;
        flex-direction: column;
        align-items: center;

        .load-skeleton {
          .el-skeleton {
            .is-first {
              width: 100%;
            }
          }
        }
      }
    }
  }

  .call-queue__container-feedback-time-running-call {
    display: block;
    text-align: center;
  }

  .call-queue__container-call-queue {
    border: none;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 6px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .call-queue__container-call-queue-line {
      display: flex;
      flex-direction: row;
      gap: 8px;
      justify-content: space-between;
      align-items: center;
      gap: 16px;

      .el-button:hover {
        border-color: white;

        .el-icon-delete::before {
          color: white;
        }
      }
    }
  }

  .call-queue__container-empty-queue {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;

    .call-queue__container-empty-queue-icon {
      height: 24px;
      width: 24px;
    }

    .call-queue__container-empty-queue-label {
      font-weight: 600;
    }

    .el-icon-loading::before {
      font-size: 24px;
    }
  }

  .call-queue__back-button {
    display: flex;
    justify-content: center;
  }

  // div:not(.el-dialog__wrapper):not(.el-collapse):not(.el-collapse>*) {
  //   z-index: 3000;
  // }
}

.back-forward-dispute-confirm {
  min-width: 50vw;
}
</style>
