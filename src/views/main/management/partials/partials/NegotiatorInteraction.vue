<template>
  <section class="negotiator-interaction__container">
    <slot name="condition" />

    <div class="negotiator-interaction__alert-container">
      <span
        v-if="dispute.getDisputeHasFirstClaimant"
        class="alert-container__first-claimant"
      >
        A parte <span class="alert-container__name">{{ dispute.getDisputeFirstClaimantName.toLowerCase() }}</span>
        está <span class="alert-container__status">{{ dispute.getDisputeFirstClaimantStatus }}</span> no momento.
      </span>

      <span
        v-if="dispute.getDisputeHasFirstClaimantLawyer"
        class="alert-container__first-claimant-lawyer"
      >
        O advogado <span class="alert-container__name">{{ dispute.getDisputeFirstClaimantLawyerName }}</span>
        está <span class="alert-container__status">{{ dispute.getDisputeFirstClaimantLawyerStatus }}</span> no momento.
      </span>
    </div>

    <el-button
      v-if="!canShowReplyEditor"
      class="negotiator-interaction__reply-button"
      icon="el-icon-s-promotion"
      size="mini"
      @click="showReplyEditor()"
    >
      Enviar mensagem
    </el-button>

    <div
      v-else
      class="negotiator-interaction__reply-container"
    >
      <el-button
        class="reply-container__expand-button"
        type="text"
        size="mini"
        icon="el-icon-top-right"
        @click="handleVisibilityEditor()"
      >
        Expandir
      </el-button>

      <el-input
        v-model="messageDialogReplyEditor"
        type="textarea"
        rows="4"
        placeholder="Escreva alguma coisa"
        style="padding-bottom: 10px"
      />

      <div class="reply-container__footer">
        <el-button
          size="mini"
          @click="showReplyEditor()"
        >
          Cancelar
        </el-button>
        <el-button
          size="mini"
          icon="el-icon-s-promotion"
          @click="sendMessage()"
        >
          Enviar
        </el-button>
      </div>
    </div>
  </section>
</template>

<script>
import store from '@/store'

export default {
  props: {
    value: {
      type: Object,
      required: true
    },

    dialogVisibility: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      canShowReplyEditor: false,
      messageDialogReplyEditor: ''
    }
  },
  computed: {
    dispute() {
      return this.value
    },
    canShowDialogReplyEditor() {
      return this.dialogVisibility
    }
  },
  methods: {
    showReplyEditor(flag = !this.canShowReplyEditor) {
      this.canShowReplyEditor = flag
    },
    handleVisibilityEditor(flag = !this.dialogVisibility) {
      this.showReplyEditor(false)
      this.$emit('update:dialog-visibility', flag)
    },
    async sendMessage() {
      const disputeId = this.dispute.getDisputeId
      const lastReceivedMessage = this.dispute.getDisputeLastReceivedMessage
      let email = ''

      if (lastReceivedMessage && lastReceivedMessage.properties && lastReceivedMessage.properties.PERSON_NAME) {
        email = this.dispute.getDisputeLastReceivedMessageSender
      } else {
        await store.dispatch('getLastInteractions', disputeId).then(interactions => {
          email = interactions.length ? interactions[0].address || '' : ''
        })
      }

      const data = {
        message: this.messageDialogReplyEditor,
        roleId: null,
        email
      }

      store.dispatch('sendNegotiator', { disputeId, data }).then(() => {
        this.messageDialogReplyEditor = ''
        this.$jusNotification({
          title: 'Yay!',
          message: 'Mensagem enviada com sucesso!',
          type: 'success'
        })
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.handleVisibilityEditor(false)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.negotiator-interaction__container {
  background-color: $--color-text-primary;
  color: white;
  border-color: $--color-text-primary;
  font-size: 12px;

  .negotiator-interaction__reply-button {
    margin-top: 10px;
    float: right;
  }

  .negotiator-interaction__alert-container {
    display: flex;
    flex-direction: column;

    .alert-container__first-claimant, .alert-container__first-claimant-lawyer {
      .alert-container__name {
        text-transform: capitalize;
        font-weight: bold;
      }

      .alert-container__status {
        text-decoration: underline;
      }
    }
  }

  .negotiator-interaction__reply-container {
    .reply-container__expand-button {
      float: right;
    }

    .reply-container__footer {
      float: right;
    }
  }
}
</style>
