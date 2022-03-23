<template>
  <article class="call-queue__container">
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

      <div v-if="isActiveToCall && isOpenCall">
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
          <p>Linha disponível</p>

          <el-button
            type="danger"
            size="mini"
            @click="answerCall(false)"
          >
            Não ligar
          </el-button>

          <el-button
            type="primary"
            size="mini"
            @click="answerCall(true)"
          >
            Ligar agora
          </el-button>
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
          type="danger"
          icon="el-icon-delete"
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
      <jus-icon
        class="call-queue__container-empty-queue-icon"
        icon="checked"
      />

      <div class="call-queue__container-empty-queue-label">
        Sem ligações pendentes
      </div>
    </div>

    <ScheduledCallSwitch v-if="isJusttoDev" />

    <ScheduledCallsQueue v-if="isJusttoDev" />

    <CallHelp
      @call:end="hangUpCall()"
    />
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    CallHelp: () => import('@/components/dialogs/CallHelpWizard'),
    ScheduledCallSwitch: () => import('@/components/buttons/ScheduledCallSwitch'),
    ScheduledCallsQueue: () => import('./ScheduledCallsQueue')
  },

  data: () => ({
    endingCall: false
  }),

  computed: {
    ...mapGetters({
      dialer: 'getDialer',
      callQueue: 'getCallQueue',
      currentAppInstance: 'getAppInstance',
      isActiveToCall: 'isActiveToCall',
      hasCallInQueue: 'hasCallInQueue',
      isOpenCall: 'isOpenCall',
      currentCall: 'getCurrentCall',
      isPendingToAnswerCurrentCall: 'isPendingToAnswerCurrentCall',
      isAdminProfile: 'isAdminProfile',
      isJusttoAdmin: 'isJusttoAdmin',
      netSpeed: 'getSipConnectionSpeed',
      isJusttoDev: 'isJusttoDev'
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
            this.redirectToDispute()
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
      if (this.$route.name === 'ticket' && Number(this.$route.params.id) === this.currentCall.disputeId) {
        // Está na rota certa
      } else {
        const path = `/negotiation/${this.currentCall.disputeId}`
        this.$router.push({ path })
      }
    },

    remove(id) {
      if (id === this.currentCall.id) {
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

    handleCallUpdate(call) {
      if (['COMPLETED_CALL'].includes(call?.status)) {
        this.$jusSegment('END_DIALER_CALL', { ...call })
      } else if (['RECEIVING_CALL'].includes(call?.status)) {
        this.$refs.ringAudio.play()
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

  .call-queue__container-feedback {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    * {
      text-align: center;
    }

    div {
      width: 100%;

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
    gap: 8px;

    .call-queue__container-empty-queue-icon {
      height: 24px;
      width: 24px;
    }

    .call-queue__container-empty-queue-label {
      font-weight: 600;
    }
  }

  // div:not(.el-dialog__wrapper):not(.el-collapse):not(.el-collapse>*) {
  //   z-index: 3000;
  // }
}
</style>
