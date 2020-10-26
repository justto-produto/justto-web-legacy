<template>
  <section
    v-loading="loadingAttachments"
    class="dispute-attachments"
  >
    <div class="dispute-overview-view__attachment-buttons">
      <el-input
        v-model="attachmentFilterTerm"
        clearable
        placeholder="Busque por anexos"
        prefix-icon="el-icon-search"
      />
      <el-tooltip content="Atualizar anexos">
        <el-button
          plain
          @click="enrichDispute"
        >
          <jus-icon icon="refresh" />
        </el-button>
      </el-tooltip>
    </div>

    <jus-drag-area class="dispute-attachments__drag-area">
      <div
        v-if="filteredDisputeAttachments.length && !loadingAttachments"
        v-loading="deleteAttachmentLoading"
        class="dispute-attachments__attachment-list"
      >
        <el-card
          v-for="attachment in filteredDisputeAttachments"
          :key="attachment.url"
          class="dispute-attachments__attachment"
          shadow="never"
        >
          <div class="dispute-overview-view__attachment-main">
            <el-link
              :underline="false"
              :href="attachment.url"
              target="_blank"
              class="dispute-overview-view__attachment-link"
            >
              <i class="el-icon-document" />
              {{ attachment.name }}
            </el-link>
            <div class="dispute-overview-view__attachment-actions">
              <el-tooltip content="Copiar URL">
                <i
                  class="el-icon el-icon-copy-document"
                  @click="copyUrl(attachment.url)"
                />
              </el-tooltip>
              <el-tooltip content="Remover anexo">
                <i
                  v-if="!attachment.enriched"
                  class="el-icon el-icon-delete"
                  @click="removeAttachment(attachment)"
                />
              </el-tooltip>
            </div>
          </div>
          <span class="dispute-overview-view__attachment-details">
            {{ attachmentOrigin(attachment) }} - {{ attachment.createAt.dateTime | moment('DD/MM/YY') }}
          </span>
        </el-card>
      </div>
      <div
        v-else-if="loadingAttachments"
        class="dispute-attachments__without-attachment">
        Carregando Anexos
      </div>
      <div
        v-else
        class="dispute-attachments__without-attachment"
      >
        Sem Anexos
      </div>

      <div class="dispute-attachments__upload-button">
        <el-button
          :disabled="deleteAttachmentLoading"
          type="primary"
          size="medium"
          icon="el-icon-upload"
          @click="handleAttachmentDialogVisable()"
        >
          Adicionar anexos
        </el-button>
      </div>

      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="uploadAttacmentDialogVisable"
        append-to-body
        title="Envie anexos"
        class="dispute-attachments__upload-dialog"
        width="600px"
        data-testid="upload-file-dialog"
      >
        <jus-drag-area
          visible
          @closeDialog="handleAttachmentDialogVisable()"
        />
      </el-dialog>
    </jus-drag-area>
  </section>
</template>

<script>
import { filterByTerm } from '@/utils/jusUtils'
import { JusDragArea } from '@/components/JusDragArea'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'DisputeAttachments',
  components: {
    JusDragArea
  },
  props: {
    isAccepted: {
      type: Boolean,
      required: true
    },
    disputeId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      uploadAttacmentDialogVisable: false,
      deleteAttachmentLoading: false,
      attachmentFilterTerm: ''
    }
  },
  computed: {
    ...mapGetters(['disputeAttachments', 'loadingAttachments', 'hideLoadingAttachments']),

    filteredDisputeAttachments() {
      return filterByTerm(this.attachmentFilterTerm, this.disputeAttachments, 'name')
    }
  },
  watch: {
    disputeId() {
      this.initState()
    }
  },
  mounted() {
    this.initState()
  },
  methods: {
    ...mapActions(['deleteAttachment', 'getDisputeAttachments']),

    initState() {
      const { id } = this.$route.params
      this.getDisputeAttachments(id).finally(this.hideLoadingAttachments)
    },

    enrichDispute() {
      const message = {
        content: this.isAccepted
          ? 'Você está solicitando o <b>ENRIQUECIMENTO</b> de uma disputa que já foi finalizada. Este processo irá agendar novamente as mensagens para as partes quando finalizado. Você deseja enriquecer mesmo assim?'
          : 'Tem certeza que deseja realizar esta ação?',
        title: this.isAccepted ? 'Atenção!' : 'ENRIQUECER'
      }
      this.$confirm(message.content, message.title, {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        dangerouslyUseHTMLString: true,
        showClose: false
      }).then(() => {
        this.$store.dispatch('sendDisputeAction', {
          disputeId: this.disputeId,
          action: 'enrich'
        }).then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Ação <b>ENRIQUECER</b> realizada com sucesso.',
            type: 'success',
            dangerouslyUseHTMLString: true
          })
        })
      })
    },

    copyUrl(value) {
      navigator.clipboard.writeText(value)
      this.$jusNotification({
        title: 'Yay',
        message: 'URL copiada para o clipboard',
        type: 'success'
      })
    },

    removeAttachment(attachment) {
      this.deleteAttachmentLoading = true
      this.deleteAttachment({
        disputeId: attachment.disputeId,
        documentId: attachment.id
      }).then(() => {
        this.getDisputeAttachments(attachment.disputeId).then(() => {
          this.deleteAttachmentLoading = false
          this.$jusNotification({
            title: 'Yay!',
            message: 'Anexo removido com sucesso',
            type: 'success'
          })
        })
      })
    },

    attachmentOrigin(attachment) {
      return attachment.enriched ? 'Enriquecido' : 'Adicionado'
    },

    handleAttachmentDialogVisable() {
      this.uploadAttacmentDialogVisable = !this.uploadAttacmentDialogVisable
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.dispute-attachments {
  .dispute-overview-view__attachment-buttons {
    margin-bottom: 10px;
  }

  .dispute-attachments__attachment-list {
    overflow-y: auto;
    height: calc(95% - 116px);

    .dispute-attachments__attachment {
      margin-top: 10px;
      margin-right: 10px;
      &:first-child { margin-top: 0px; }

      .dispute-overview-view__attachment-main {
        display: flex;
        justify-content: space-between;

        .dispute-overview-view__attachment-link {
          display: block;
          word-break: break-all;
          width: 176px;
        }

        .dispute-overview-view__attachment-actions {
          .el-icon {
            cursor: pointer;
            margin-left: 4px;
            font-size: 16px;
          }

          .el-icon-delete {
            color: $--color-danger;
          }

          .el-icon-copy-document {
            color: $--color-primary;
          }
        }
      }

      .dispute-overview-view__attachment-details {
        color: $--color-text-secondary;
        font-weight: bold;
        display: block;
        margin-top: 2px;
      }
    }
  }

  .dispute-attachments__without-attachment {
    text-align: center;
    height: calc(95% - 116px);
  }

  .dispute-attachments__upload-button {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
}
</style>

<style lang="scss">
.dispute-attachments__upload-dialog {
  .el-dialog__body {
    height: 300px;
  }
}

.dispute-attachments__attachment {
  .el-card__body {
    padding: 14px;
  }
}
</style>
