<template>
  <article class="sign-attachment">
    <el-tooltip
      v-if="canShow && showType === 'icon'"
      :open-delay="600"
      content="Assinar anexo"
    >
      <i
        class="overview-attachments__item-icon el-icon-document-checked"
        @click="openDialog"
      />
    </el-tooltip>

    <div
      v-else-if="canShow && showType === 'timeline' && false"
      class="sign-attachment__timeline"
    >
      <el-button
        type="text"
        size="mini"
        class="sign-steps"
        @click="openDialog"
      >
        Assinar

        <el-steps
          :active="0"
          finish-status="success"
        >
          <el-step />
          <el-step />
          <el-step />
        </el-steps>
      </el-button>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="visible"
      custom-class="sign-attachment__dialog"
      append-to-body
      center
    >
      <div
        v-loading="loading"
        class="sign-attachment__dialog--body"
      >
        <div
          v-if="screen === 0"
          class="sign-attachment__dialog--body__attachemnt-view"
        >
          <h3 class="sign-attachment__dialog--body__attachemnt-view-info">
            {{ attachmentName }}

            <span>
              Enviado por {{ attachment.updatedBy || attachment.createdBy }}
            </span>
          </h3>
        </div>

        <div
          v-if="screen === 1"
          class="sign-attachment__dialog--body__attachemnt-view"
        >
          <div
            v-for="(sign, signIndex) in mappedSignes"
            :key="signIndex"
            class="attachemnt-view__signer"
          >
            <div class="attachemnt-view__signer-header">
              <h3>
                {{ sign.name }}
              </h3>

              <el-checkbox
                v-if="sign.defaultSigner"
                v-model="sign.defaultSigner"
                disabled
              >
                Assinante padrão
              </el-checkbox>
            </div>

            <h4 v-if="sign.documentNumber">
              {{ sign.documentNumber | cpfCnpj }}
            </h4>

            <div class="attachemnt-view__signer-emails">
              <el-checkbox
                v-for="email in (sign.emails || [])"
                :key="`${signIndex}-${email.address}`"
                :value="(signs[sign.name] || {}).email === email.address"
                class="attachemnt-view__signer-email"
                @change="checkSigner(sign, email.address)"
              >
                <i class="el-icon-message" />
                <span>{{ email.address }}</span>
              </el-checkbox>
            </div>

            <span v-if="!(sign.emails || []).length">
              Sem emails disponíveis.
            </span>
            <el-divider />
          </div>
        </div>

        <div
          v-if="screen === 2"
          class="sign-attachment__dialog--body__attachemnt-view"
        >
          <div
            v-for="(signer, signIndex) in docSigners"
            :key="signIndex"
            class="attachemnt-view__signer"
          >
            <div class="attachemnt-view__signer__status">
              <div class="attachemnt-view__signer__status-role">
                <div class="attachemnt-view__signer__status-role-name">
                  {{ signer.name }}<br>
                </div>
                <div class="attachemnt-view__signer__status-role-email">
                  {{ signer.email }}
                </div>
              </div>

              <div class="attachemnt-view__signer__status-icon">
                <span v-if="signer.signatureStatus">
                  {{ $tc(`document.signature.status.${signer.signatureStatus}.text`) }}
                  <jus-icon :icon="$tc(`document.signature.status.${signer.signatureStatus}.icon`)" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <span
        v-if="!loading"
        slot="footer"
      >
        <el-button
          v-if="screen === 0"
          type="primary"
          @click="nextScreen"
        >
          Escolher Assinantes
        </el-button>

        <el-button
          v-else-if="screen === 1"
          type="primary"
          @click="setSigners"
        >
          Assinar
        </el-button>

        <el-button
          v-else-if="screen < 2"
          type="primary"
          @click="nextScreen"
        >
          Avançar
        </el-button>

        <el-button
          v-if="screen >= 2"
          type="danger"
          icon="el-icon-delete-solid"
          @click="deleteSubscriptions"
        >
          Remover assinatura(s)
        </el-button>

        <el-button
          icon="el-icon-refresh-right"
          type="secondary"
          @click="refreshAttachmentSign"
        >
          Atualizar
        </el-button>

        <el-button
          type="danger"
          icon="el-icon-error"
          plain
          @click="closeDialog"
        >
          Fechar
        </el-button>

        <!-- <el-button
          type="primary"
          @click="visible = false"
        >
          Confirmar
        </el-button> -->
      </span>
    </el-dialog>
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    attachmentId: {
      type: [Number, String],
      required: true
    },
    attachmentName: {
      type: String,
      required: true
    },
    showType: {
      type: String,
      default: 'icon'
    }
  },

  data: () => ({
    visible: false,
    loading: false,
    screen: 0,
    signsList: [],
    signs: {},
    docSigners: [],
    attachment: {}
  }),

  computed: {
    ...mapGetters({
      roles: 'getCommonDisputeRoles',
      defaultSigners: 'availableSigners'
    }),

    dialogTitle() {
      if (this.loading) {
        return 'Carregando anexo'
      } else if (this.screen === 0) {
        return 'Anexo'
      } else if (this.screen === 1) {
        return 'Escolher Assinantes'
      } else return 'Assinantes'
    },

    mappedSignes() {
      return [
        ...this.roles.map(p => ({
          defaultSigner: false,
          name: p.name || '',
          emails: p.emails?.map(({ address }) => address) || p.emailsDto?.map(({ address }) => ({ address })) || [],
          documentNumber: p.documentNumber
        })),

        ...this.defaultSigners.map(p => ({
          defaultSigner: !!p._defaultSigner,
          name: p.name || '',
          emails: p.emails || [],
          documentNumber: p.documentNumber
        }))
      ]
    },

    canShow() {
      return (this.attachmentName || '').toLowerCase() // .incudes('.pdf') || Boolean(this.attachment?.signedDocumentId)
    }
  },

  methods: {
    ...mapActions([
      'getDefaultAssigners',
      'setAttachmentSigners',
      'getAttachmentSignInfo',
      'deleteSignedAttachment',
      'getTicketOverviewParty'
    ]),

    deleteSubscriptions() {
      this.loading = true

      this.deleteSignedAttachment(this.attachmentId).then(this.refreshAttachmentSign)
    },

    refreshAttachmentSign() {
      this.visible = true
      this.loading = true

      return this.getAttachmentSignInfo(this.attachmentId).then(res => {
        this.attachment = res

        if (res.signedDocumentId) {
          this.docSigners = res?.signedDocument?.signers || []
          this.screen = 2
        } else {
          this.screen = 0
        }

        this.loading = false
      })
    },

    openDialog() {
      this.getDefaultAssigners()

      this.roles.forEach(({ disputeRoleId }) => {
        if (disputeRoleId) {
          this.getTicketOverviewParty({
            disputeId: this.$route.params.id,
            disputeRoleId
          })
        } else {
          console.error('disputeRoleId não definido')
        }
      })

      // TODO SAAS-2735 Adicionar validação de status pra saber qual tela iniciar
      this.visible = true
      this.loading = true

      this.refreshAttachmentSign()
    },

    checkSigner(sign, email) {
      const signer = {
        defaultSigner: sign.defaultSigner,
        name: sign.name,
        documentNumber: sign.documentNumber,
        email
      }

      if (this.signs[sign.name]?.email === email) {
        this.$delete(this.signs, sign.name)
      } else {
        this.$set(this.signs, sign.name, signer)
      }
    },

    setSigners() {
      if (Object.keys(this.signs).length === 0) {
        this.$jusNotification({
          type: 'warning',
          title: 'Ops!',
          message: 'Escolha negociadores'
        })
      } else {
        this.loading = true
        this.setAttachmentSigners({
          signers: Object.values(this.signs),
          documentId: this.attachmentId
        }).then(this.refreshAttachmentSign)
      }
    },

    closeDialog() {
      this.visible = false
    },

    nextScreen() {
      this.screen += this.screen >= 0 && this.screen < 2 ? 1 : 0
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.sign-attachment {
  .sign-attachment__timeline {
    .sign-steps {
      span {
        .el-steps--horizontal {
          .is-success {
            border-color: $--color-primary !important;

            .is-text {
              background-color: $--color-primary !important;;
            }
          }

          .is-wait {
            border-color: $--color-primary !important;
            color: white !important;
          }

          .is-process {
            border-color: $--color-primary !important;
            color: white !important;
          }

          .el-step__icon {
            width: 16px;
            height: 16px;
            font-size: 8px;
            color: $--color-primary;
          }
        }
      }
    }
  }
}

.sign-attachment__dialog {
  .el-dialog__header {
    background: $--color-primary;

    .el-dialog__title {
      color: white;
    }

    .el-dialog__headerbtn {
      .el-icon::before {
        color: white;
      }
    }
  }

  .el-dialog__body {
    .sign-attachment__dialog--body {
      .sign-attachment__dialog--body__attachemnt-view {
        display: flex;
        flex-direction: column;
        gap: 0;

        .sign-attachment__dialog--body__attachemnt-view-info {
          margin: 0;
          color: $--color-primary;
          padding: 8px 4px;
          font-weight: 600;

          display: flex;
          flex-direction: column;

          span {
            font-weight: normal;
            font-size: 12px;
            color: $--color-text-secondary;
          }
        }

        .attachemnt-view__signer {
          .attachemnt-view__signer-header {
            display: flex;
            justify-content: space-between;
            color: $--color-primary;

            h3 {
              padding: 0;
              margin: 0;
              font-weight: 700;
              // color: $--color-gray;
            }
          }

          h4 {
            margin: 16px 0;
          }

          .attachemnt-view__signer-emails {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .attachemnt-view__signer-email {
              display: flex;
              gap: 4px;

              .el-checkbox__label {
                display: flex;
                gap: 8px;
              }
            }
          }

          .attachemnt-view__signer__status {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 24px 8px;
            margin: 0;

            &:hover {
              background-color: #f6f6f6;
            }

            .attachemnt-view__signer__status-role {
              display: flex;
              flex-direction: column;
              margin-left: 10px;
              font-weight: 600;

              &-name {
                color: $--color-primary;
              }
            }

            .attachemnt-view__signer__status-icon {
              color: $--color-text-secondary;
              display: flex;
              align-items: center;
              gap: 16px;

              img {
                width: 14px;
                vertical-align: middle;
                margin-bottom: 2px;
              }
            }
          }

        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.sign-attachment {
  display: inline;

  .sign-attachment__timeline {
    display: flex;

    .sign-steps {
      width: 100%;

      span {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
      }
    }
  }
}
</style>
