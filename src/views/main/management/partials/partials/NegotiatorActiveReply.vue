<template>
  <el-dialog
    title="Enviar mensagem para"
    :visible.sync="visible"
    width="50%"
    append-to-body
  >
    <div
      v-loading="isLoading"
      class="dialog-reply-negotiator__alert-container"
    >
      <span
        v-if="dispute.getDisputeHasFirstClaimant"
        class="alert-container__first-claimant"
      >
        <i class="icon el-icon-info" />
        {{ $tc('ARTICLE', !isRecovery).toUpperCase() }} {{ $tc('PARTY_RESPONDENT', isRecovery) }} <span class="alert-container__name">{{ dispute.getDisputeFirstClaimantName }}</span>
        está <span class="alert-container__status">{{ dispute.getDisputeFirstClaimantStatus }}</span> no momento.
      </span>

      <span
        v-if="dispute.getDisputeHasFirstClaimantLawyer"
        class="alert-container__first-claimant-lawyer"
      >
        <i class="icon el-icon-info" />
        O advogado <span class="alert-container__name">{{ dispute.getDisputeFirstClaimantLawyerName }}</span>
        está <span class="alert-container__status">{{ dispute.getDisputeFirstClaimantLawyerStatus }}</span> no momento.
      </span>

      <span class="alert-container__message">
        Envie uma mensagem pelo chat de comunicação da ProJuris.
      </span>

      <div class="dialog-reply-negotiator__container">
        <el-input
          v-model="messageDialogReplyEditor"
          type="textarea"
          rows="4"
          :placeholder="`Escreva alguma coisa para ${isRecovery ? 'a' : 'o'} ${$tc('PARTY_RESPONDENT', isRecovery)}`"
          style="padding-bottom: 10px"
        />

        <div class="dialog-reply-negotiator__footer">
          <el-button
            size="mini"
            @click="visible = false"
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
import { mapGetters } from 'vuex'

export default {
  mixins: [negotiatorActiveContact],

  props: {
    value: {
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

  computed: {
    ...mapGetters({
      isRecovery: 'isWorkspaceRecovery'
    }),

    visible: {
      get() { return this.value },
      set() { this.$emit('close') }
    }
  }
}
</script>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

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
