<template>
  <article class="call-queue__container">
    <div
      v-if="isActiveToCall || hasCallInQueue"
      class="call-queue__container-feedback"
    >
      <div v-if="isActiveToCall && isOpenCall">
        <p>
          Ligação ativa
          <spam class="call-queue__container-feedback-time-running-call">
            3:15
          </spam>
        </p>
      </div>
      <div v-if="!isOpenCall && hasCallInQueue">
        <div v-if="isPendingToAnswerCurrentCall">
          <p>Linha disponível</p>
          <el-button
            type="danger"
            size="mini"
            @click="answerCurrentCall(false)"
          >
            Não ligar
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="answerCurrentCall(true)"
          >
            Ligar agora
          </el-button>
        </div>
        <div v-else>
          <p>
            Aguardando disponibilidade de discador
            <el-button
              v-if="isActiveToCall"
              type="info"
              size="mini"
              plain
              @click="openBuyDialerDialog"
            >
              Adquira discadores dedicados
            </el-button>
          </p>
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
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      dialer: 'getDialer',
      callQueue: 'getCallQueue',
      currentAppInstance: 'getAppInstance',
      isActiveToCall: 'isActiveToCall',
      hasCallInQueue: 'hasCallInQueue',
      isOpenCall: 'isOpenCall',
      isPendingToAnswerCurrentCall: 'isPendingToAnswerCurrentCall'
    })
  },

  methods: {
    ...mapActions({
      openBuyDialerDialog: 'openBuyDialerDialog',
      removeCall: 'SOCKET_REMOVE_CALL',
      answerCurrentCall: 'answerCurrentCall'
    }),
    remove(id) {
      this.removeCall({ callId: id })
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

  .call-queue__container-feedback-time-running-call {
    display: block;
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
}
</style>
