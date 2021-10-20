<template>
  <article class="call-queue__container">
    <div
      v-if="isActiveToCall || hasCallInQueue"
      class="call-queue__container-feedback"
    >
      <!-- v-if="currentCall && ['RECEIVING_CALL'].includes(currentCall.status)" -->
      <audio
        ref="ringAudio"
        src="https://storage.googleapis.com/justto_app/audio/ChamadaEsperaJustto.mp3"
        loop
      />

      <div v-if="isActiveToCall && isOpenCall">
        <p>Em chamada</p>

        <el-button
          type="danger"
          size="mini"
          @click="hangUpCall()"
        >
          Desligar
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

        <div v-else>
          <p>
            Aguardando disponibilidade de discador
            <i class="el-icon-loading" />
          </p>
          <el-button
            v-if="isActiveToCall"
            type="info"
            size="mini"
            plain
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

      <div v-if="!hasCallInQueue">
        <el-button
          type="info"
          size="mini"
          plain
          @click="openBuyDialerDialog"
        >
          Adquira discadores dedicados
        </el-button>
      </div>
    </div>

    <CallHelp
      @call:end="hangUpCall()"
    />
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    CallHelp: () => import('@/components/dialogs/CallHelpWizard.vue')
  },

  computed: {
    ...mapGetters({
      dialer: 'getDialer',
      callQueue: 'getCallQueue',
      currentAppInstance: 'getAppInstance',
      isActiveToCall: 'isActiveToCall',
      hasCallInQueue: 'hasCallInQueue',
      isOpenCall: 'isOpenCall',
      currentCall: 'getCurrentCall',
      isPendingToAnswerCurrentCall: 'isPendingToAnswerCurrentCall'
    })
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
      this.endCall({
        dialerId: this.dialer.id,
        callId: this.currentCall.id
      })
    },

    handleCallUpdate(call) {
      if (['RECEIVING_CALL'].includes(call?.status) && document.hidden) {
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

  .call-queue__container-feedback {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    * {
      text-align: center;
    }
  }

  .call-queue__container-feedback-time-running-call {
    display: block;
    text-align: center;
  }

  .call-queue__container-call-queue {
    border: solid thin $--color-gray;
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

  div:not(.el-dialog__wrapper) {
    z-index: 3000;
  }
}
</style>