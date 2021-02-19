<template>
  <section class="overview-attachments">
    <JusDragArea class="overview-attachments__drag-area">
      <el-input
        v-model="filterTerm"
        clearable
        class="overview-attachments__filter-input"
        placeholder="Busque por anexos"
        prefix-icon="el-icon-search"
      />

      <ul
        v-if="filteredDisputeAttachments.length"
        class="overview-attachments__list"
      >
        <li
          v-for="attachment in filteredDisputeAttachments"
          :key="attachment.url"
          class="overview-attachments__list-item"
        >
          <el-link
            :underline="false"
            :href="attachment.url"
            target="_blank"
            class="overview-attachments__item-link"
          >
            <i class="el-icon-document" />
            {{ attachment.name }}
          </el-link>
          <span class="overview-attachments__item-actions">
            <el-tooltip
              :open-delay="600"
              content="Copiar URL"
            >
              <i
                class="overview-attachments__item-icon el-icon-copy-document"
                @click="copyUrl(attachment.url)"
              />
            </el-tooltip>
            <i
              v-if="!attachment.enriched && attachment.direction !== 'INBOUND'"
              class="overview-attachments__item-icon el-icon-delete"
              @click="removeAttachment(attachment)"
            />
          </span>
          <div class="overview-attachments__item-details">
            {{ attachmentOrigin(attachment) }} - {{ attachment.createAt.dateTime | moment('DD/MM/YY') }}
          </div>
        </li>
      </ul>
      <div
        v-else
        class="dispute-attachments__empty"
      >
        Sem anexos
      </div>

      <el-button
        type="primary"
        size="medium"
        icon="el-icon-upload"
        @click="handleAttachmentDialogVisable"
      >
        Adicionar anexos
      </el-button>

      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="uploadAttacmentDialogVisable"
        append-to-body
        title="Envie anexos"
        class="dispute-attachments__upload-dialog"
        width="600px"
        data-testid="upload-file-dialog"
      >
        <JusDragArea
          visible
          @closeDialog="handleAttachmentDialogVisable()"
        />
      </el-dialog>
    </JusDragArea>
  </section>
</template>

<script>
import { filterByTerm } from '@/utils'
import { JusDragArea } from '@/components/JusDragArea'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'OverviewAttachments',
  components: {
    JusDragArea
  },
  props: {
    isAccepted: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadAttacmentDialogVisable: false,
      filterTerm: ''
    }
  },
  computed: {
    ...mapGetters({
      ticketAttachments: 'getTicketOverviewAttachments'
    }),

    filteredDisputeAttachments() {
      return filterByTerm(this.filterTerm, this.ticketAttachments, 'name')
    }
  },
  methods: {
    ...mapActions(['deleteAttachment', 'getDisputeAttachments']),

    copyUrl(value) {
      navigator.clipboard.writeText(value)
      this.$jusNotification({
        title: 'Yay',
        message: 'URL copiada para o clipboard',
        type: 'success'
      })
    },

    removeAttachment(attachment) {
      this.$confirm('O anexo será deletado permanentemente. Tem certeza que deja fazer isso?', 'Excluir anexo', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then(() => {
        this.deleteAttachment({
          disputeId: attachment.disputeId,
          documentId: attachment.id
        }).then(() => {
          this.getDisputeAttachments(attachment.disputeId).then(() => {
            this.$jusNotification({
              title: 'Yay!',
              message: 'Anexo removido com sucesso',
              type: 'success'
            })
          })
        }).catch(error => {
          this.$jusNotification({ error })
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

.overview-attachments {
  .overview-attachments__drag-area {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .overview-attachments__list {
    list-style: none;
    overflow-y: auto;
    flex: 1;
    margin: 0;
    padding: 0;

    .overview-attachments__list-item {
      margin-top: 10px;
      padding: 12px;
      border: 1px solid #dcdfe6;
      border-radius: 6px;
      position: relative;
      &:first-child { margin-top: 0; }

      .overview-attachments__item-link {
        word-break: break-all;
        transition: .2s ease-out;
      }

      .overview-attachments__item-actions {
        background-image: linear-gradient(to left, rgba(255, 255, 255, 145) 45%, rgba(255, 255, 255, 0));
        position: absolute;
        top: 12px;
        right: 12px;
        padding-left: 42px;
        opacity: 0;
        transition: .2s ease-out;

        .overview-attachments__item-icon {
          cursor: pointer;
          margin-left: 3px;
          font-size: 16px;
          opacity: .7;
          transition: .2s ease-out;
          &.el-icon-delete { color: $--color-danger; }
          &.el-icon-copy-document { color: $--color-primary; }
          &:hover { opacity: 1; }
        }
      }

      &:hover .overview-attachments__item-actions {
        opacity: 1;
      }

      .overview-attachments__item-details {
        margin-top: 6px;
        font-weight: 500;
        color: $--color-text-secondary;
      }
    }
  }

  .dispute-attachments__empty {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
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

.overview-attachments {
  .overview-attachments__filter-input {
    .el-input__inner { border-radius: 6px; }
  }
}
</style>
