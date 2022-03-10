<template>
  <article class="sign-attachment">
    <el-tooltip
      :open-delay="600"
      content="Assinar anexo"
    >
      <i
        class="overview-attachments__item-icon el-icon-document-checked"
        @click="openDialog"
      />
    </el-tooltip>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="visible"
      custom-class="sign-attachment__dialog"
      append-to-body
      center
    >
      <div class="sign-attachment__dialog--body">
        <div
          v-if="screen === 0"
          class="sign-attachment__dialog--body__attachemnt-view"
        >
          <h3>
            {{ attachment.name }}
          </h3>
          <h4>
            de {{ attachment.updatedBy || attachment.createdBy }}
          </h4>
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
            v-for="(sign, signIndex) in docSigners"
            :key="signIndex"
            class="attachemnt-view__signer"
          >
            {{ sign }}
          </div>
        </div>
      </div>

      <span slot="footer">
        <el-button
          type="danger"
          plain
          @click="closeDialog"
        >
          Cancelar
        </el-button>

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
          v-else
          type="primary"
          @click="nextScreen"
        >
          Avançar
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
    attachment: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    visible: false,
    screen: 0,
    signsList: [],
    signs: {},
    docSigners: []
  }),

  computed: {
    ...mapGetters({
      roles: 'getCommonDisputeRoles',
      defaultSigners: 'availableSigners'
    }),

    dialogTitle() {
      if (this.screen === 0) {
        return 'Anexo'
      } else if (this.screen === 1) {
        return 'Escolher Assinantes'
      } else return 'Padrão'
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
    }
  },

  methods: {
    ...mapActions([
      'getDefaultAssigners',
      'setAttachmentSigners',
      'getAttachmentSignInfo',
      'getTicketOverviewParty'
    ]),

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
      this.getAttachmentSignInfo(this.attachment.id).then(res => {
        if (res.signedDocumentId) {
          this.docSigners = res.signedDocument.signers
          this.screen = 2
        } else {
          this.screen = 0
        }
      }).finally(() => {
        this.visible = true
      })
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
        this.setAttachmentSigners({
          signers: Object.values(this.signs),
          documentId: this.attachment.id
        }).then(res => {
          this.openDialog()
        })
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

.sign-attachment__dialog {
  .el-dialog__body {
    .sign-attachment__dialog--body {
      .sign-attachment__dialog--body__attachemnt-view {
        display: flex;
        flex-direction: column;
        gap: 0;

        .attachemnt-view__signer {
          .attachemnt-view__signer-header {
            display: flex;
            justify-content: space-between;

            h3 {
              padding: 0;
              margin: 0;
              font-weight: 700;
              color: $--color-gray;
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
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.sign-attachment {
  display: inline;
}
</style>
