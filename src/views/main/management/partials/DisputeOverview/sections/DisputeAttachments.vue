<template>
  <section class="dispute-attachments">
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
          @click="enrichDispute">
          <jus-icon icon="refresh" />
        </el-button>
      </el-tooltip>
    </div>

    <jus-drag-area class="dispute-attachments__drag-area">
      <ul
        v-if="filteredDisputeAttachments.length"
        class="dispute-attachments__attachment-list"
      >
        <li
          v-for="attachment in filteredDisputeAttachments"
          :key="attachment.url"
          class="dispute-attachments__attachment">
          <el-link
            :underline="false"
            :href="attachment.url"
            target="_blank"
            class="dispute-overview-view__attachment-link">
            <i class="el-icon-document"/>
            {{ attachment.name }}
          </el-link>
          <i
            class="el-icon-delete"
            @click="removeAttachment(attachment)"
          />
        </li>
      </ul>

      <div
        v-else
        class="center">
        <br>
        Sem anexos
      </div>

      <div class="dispute-attachments__action-container">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-upload"
          @click="uploadAttacmentDialogVisable = true"
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
        <jus-drag-area :visible="true" />
      </el-dialog>
    </jus-drag-area>
  </section>
</template>

<script>
import { JusDragArea } from '@/components/JusDragArea'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'DisputeAttachments',
  components: {
    JusDragArea,
  },
  props: {
    isAccepted: {
      type: Boolean,
      required: true,
    },
    disputeId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      uploadAttacmentDialogVisable: false,
      attachmentFilterTerm: '',
    }
  },
  computed: {
    ...mapGetters(['disputeAttachments']),

    filteredDisputeAttachments() {
      if (this.disputeAttachments) {
        return this.disputeAttachments.filter(a =>
          a.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
            this.attachmentFilterTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          )
        )
      } return []
    },
  },
  methods: {
    ...mapActions(['deleteAttachment', 'getDisputeAttachments']),

    removeAttachment(attachment) {
      this.deleteAttachment({
        disputeId: attachment.disputeId,
        documentId: attachment.id,
      }).then(() => {
        this.getDisputeAttachments(attachment.disputeId)
      })
    },

    enrichDispute() {
      const message = {
        content: this.isAccepted
          ? 'Você está solicitando o <b>ENRIQUECIMENTO</b> de uma disputa que já foi finalizada. Este processo irá agendar novamente as mensagens para as partes quando finalizado. Você deseja enriquecer mesmo assim?'
          : 'Tem certeza que deseja realizar esta ação?',
        title: this.isAccepted ? 'Atenção!' : 'ENRIQUECER',
      }
      this.$confirm(message.content, message.title, {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        dangerouslyUseHTMLString: true,
        showClose: false,
      }).then(() => {
        this.$store.dispatch('sendDisputeAction', {
          disputeId: this.disputeId,
          action: 'enrich',
        }).then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Ação <b>ENRIQUECER</b> realizada com sucesso.',
            type: 'success',
            dangerouslyUseHTMLString: true,
          })
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.dispute-attachments {
  height: calc(100% - 54px);
  position: relative;

  .dispute-attachments__drag-area {
    height: 100%;
  }

  .dispute-attachments__attachment-list {
    list-style: none;
    max-height: calc(100% - 70px);
    overflow-y: auto;
    padding: 0;

    .dispute-attachments__attachment {
      padding: 8px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:hover .el-icon-delete {
        display: block;
      }
    }
  }

  .dispute-attachments__action-container {
    align-items: center;
    bottom: 20px;
    left: 0;
    display: flex;
    justify-content: center;
    position: absolute;
    width: 100%;
  }
}
</style>

<style lang="scss">
.dispute-attachments__upload-dialog {
  .el-dialog__body {
    height: 300px;
  }
}
</style>
