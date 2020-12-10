<template>
  <el-dialog
    title="Enviar mensagem para"
    :visible.sync="visible"
    width="50%"
    append-to-body
    :before-close="handleClose"
  >
    <div
      v-loading="isLoading"
      class="dialog-reply-negotiator__alert-container"
    >
      <span
        v-if="dispute.firstClaimant"
        class="alert-container__first-claimant"
      >
        <i class="icon el-icon-info" />
        O réu <span class="alert-container__name">{{ dispute.firstClaimant.toLowerCase() }}</span>
        está <span class="alert-container__status">{{ dispute.firstClaimantStatus || 'OFFLINE' }}</span> no momento.
      </span>
      <span
        v-if="dispute.firstClaimantLawyer"
        class="alert-container__first-claimant-lawyer"
      >
        <i class="icon el-icon-info" />
        O advogado <span class="alert-container__name">{{ dispute.firstClaimantLawyer }}</span>
        está <span class="alert-container__status">{{ dispute.firstClaimantLawyerStatus || 'OFFLINE' }}</span> no momento.
      </span>
      <span class="alert-container__message">
        Envie uma mensagem pelo chat de comunicação da Justto.
      </span>
      <div class="dialog-reply-negotiator__container">
        <el-input
          v-model="messageDialogReplyEditor"
          type="textarea"
          rows="4"
          placeholder="Escreva alguma coisa para o réu"
          style="padding-bottom: 10px"
        />
        <div class="dialog-reply-negotiator__footer">
          <el-button
            size="mini"
            @click="handleShowDialogReplyEditor(false)"
          >
            Cancelar
          </el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-s-promotion"
            @click="sendMessage()"
          >
            Enviar
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import negotiatorActiveContact from '@/utils/mixins/negotiatorActiveContact'

export default {
  mixins: [negotiatorActiveContact],
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    dispute: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      messageDialogReplyEditor: ''
    }
  },
  methods: {
    async handleClose(done) {
      await this.handleVisibilityEditor(false)
      done()
    },

    handleVisibilityEditor(flag) {
      this.$emit('update:visible', flag)
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.dialog-reply-negotiator__alert-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;

  .alert-container__first-claimant, .alert-container__first-claimant-lawyer {
    .icon {
      color: $--color-secondary;
    }

    .alert-container__name {
      text-transform: capitalize;
      font-weight: bold;
    }

    .alert-container__status {
      text-decoration: underline;
    }
  }

  .alert-container__message {
    padding: 8px 0px;
    color: $--color-primary;
    font-weight: 500;
  }
}
.dialog-reply-negotiator__container {
  padding-bottom: 16px;

  .dialog-reply-negotiator__footer {
    float: right;
  }
}
</style>
