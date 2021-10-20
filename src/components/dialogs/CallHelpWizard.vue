<template>
  <el-dialog
    title="Atenção - Em chamda"
    custom-class="call-help-dialog"
    :visible.sync="visible"
    :modal="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="false"
    :append-to-body="false"
    destroy-on-close
    show-close
    center
  >
    <section
      v-if="call"
      v-loading="isLoading"
      class="call-help__container"
    >
      <el-carousel
        ref="carousel"
        class="call-help__carousel"
        :autoplay="false"
        arrow="always"
        indicator-position="outside"
      >
        <el-carousel-item class="call-help__carousel-item">
          <h3 class="call-help__carousel-item-info">
            Se identifique e confirme com quem está falando!
          </h3>

          <div class="call-help__suggestion-balloon">
            <div class="call-help__suggestion-balloon-label">
              <span>
                Sugestão
              </span>
            </div>

            <ul class="call-help__suggestion-balloon-text">
              <li>Bom dia, meu nome é {{ thamirisName }}.</li>

              <li>Estou falando com {{ claimantName }}?</li>

              <li>É sobre um debito em abento com {{ respondentName }}!</li>
            </ul>
          </div>

          <div class="call-help__carousel-item-actions">
            <el-popover
              ref="incorrectContactPopover"
              placement="bottom"
              trigger="click"
              title="Qual o problema com o contato?"
              popper-class="incorrect-contact__popover"
            >
              <el-select
                v-model="invalidNumberReason"
                class="incorrect-contact__select"
                size="small"
              >
                <el-option
                  :label="$tc('call.interaction.status.DIFFERENT_OWNER')"
                  value="DIFFERENT_OWNER"
                />
                <el-option
                  :label="$tc('call.interaction.status.NONEXISTENT')"
                  value="NONEXISTENT"
                />
              </el-select>

              <el-button
                type="primary"
                size="small"
                :disabled="!invalidNumberReason"
                @click="registerProblemWithNumber()"
              >
                Registrar problema
              </el-button>

              <el-button
                slot="reference"
                type="danger"
                size="small"
              >
                Contato incorreto
              </el-button>
            </el-popover>

            <el-button
              type="success"
              size="small"
              @click="next()"
            >
              Contato correto
            </el-button>
          </div>
        </el-carousel-item>

        <el-carousel-item class="call-help__carousel-item">
          <h3 class="call-help__carousel-item-info">
            Informe {{ claimantName }} que a conversa está sendo gravada.
          </h3>

          <div class="call-help__suggestion-balloon">
            <div class="call-help__suggestion-balloon-label">
              <span>Sugestão</span>
            </div>

            <ul class="call-help__suggestion-balloon-text">
              <li>{{ claimantName }}, para fins de auditoria, nossa conversa está sendo gravada.</li>

              <li>
                Após o fim da chamada, estará disponível no portal de negociações, no endereço:
                <a
                  href="https://acordo.app"
                  target="_blank"
                >acordo.app</a>.
              </li>
            </ul>
          </div>

          <div class="call-help__carousel-item-actions">
            <el-popover
              ref="dontRecCallPopover"
              v-loading="isLoading"
              placement="top-start"
              trigger="click"
              title="Peça um contato válido!"
              popper-class="dont-rec-call__popover"
            >
              <p class="dont-rec-call__help">
                Qual outro canal de comunicação podemos conversar?
              </p>

              <el-radio-group
                v-model="newContactType"
                @input="() => {newContactModel = ''}"
              >
                <el-radio label="email">
                  E-mail
                </el-radio>

                <el-radio label="whatsapp">
                  WhatsApp
                </el-radio>
              </el-radio-group>

              <div class="dont-rec-call__add-contact">
                <div
                  v-if="newContactType === 'whatsapp'"
                  class="el-input el-input--mini"
                >
                  <input
                    v-model="newContactModel"
                    v-mask="['(##) ####-####', '(##) 9 ####-####']"
                    class="el-input__inner dont-rec-call__add-contact-input"
                    type="text"
                    size="small"
                  >
                </div>

                <el-input
                  v-else
                  v-model="newContactModel"
                  class="dont-rec-call__add-contact-input"
                  type="email"
                  size="mini"
                />

                <el-button
                  type="primary"
                  size="mini"
                  :disabled="!canSaveNewContact"
                  @click="addNewContact"
                >
                  Adicionar
                </el-button>
              </div>

              <!--  -->

              <div class="dont-rec-call__label-contacts">
                Contatos cadastratos:
              </div>

              <div
                v-for="(value, key, index) of call.contacts || {}"
                :key="`${key}-${index}`"
                class="dont-rec-call__contacts"
              >
                <div
                  v-for="(contact, contactId) in value"
                  :key="`contact-${key}-${contactId}`"
                  class="dont-rec-call__contacts-value"
                >
                  {{ contact.address || contact.number | phoneOrEmail }}
                </div>
              </div>

              <el-button
                type="danger"
                size="small"
                @click="closeCall()"
              >
                Encerrar chamada
              </el-button>

              <el-button
                slot="reference"
                type="danger"
                size="small"
              >
                Não concordou
              </el-button>
            </el-popover>

            <el-button
              type="success"
              size="small"
              @click="close()"
            >
              Concordou
            </el-button>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { CALL_STATUS } from '@/constants/callStatus'

export default {
  data: () => ({
    invalidNumberReason: '',
    isLoading: false,
    visible: false,
    newContactType: 'email',
    newContactModel: '',
    contactsAddedRecent: {
      emails: [],
      phones: []
    }
  }),

  computed: {
    ...mapGetters({
      call: 'getCurrentCall',
      thamirisName: 'loggedPersonName',
      ticketParties: 'getTicketOverviewParties'
    }),

    claimantName() {
      return this.call?.toRoleName || '[Nome da Parte aqui]'
    },

    respondentName() {
      let name = 'Nome do réu aqui'

      this.ticketParties.filter(({ polarity }) => ['RESPONDENT'].includes(polarity)).forEach((el, index) => {
        if (!index) name = el.name
      })

      return name
    },

    canSaveNewContact() {
      const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      return (this.newContactType === 'whatsapp' && this.newContactModel.length === 16) || emailRegEx.test(String(this.newContactModel).toLowerCase())
    }
  },

  watch: {
    call: {
      deep: true,
      handler(call) {
        this.visible = call?.status === CALL_STATUS.ACTIVE_CALL
      }
    }
  },

  methods: {
    ...mapActions([
      'setInvalidNumberInCall',
      'setTicketOverviewPartyContact',
      'setInteractionMessageContent'
    ]),

    next() {
      this.$refs.carousel.next()
    },

    close() {
      this.visible = false
    },

    closeCall() {
      const { emails, phones } = this.contactsAddedRecent

      const emailsTemplate = emails.length ? `<br>Email(s): ${emails.join(', ')}` : ''
      const phonesTemplate = phones.length ? `<br>Telefone(s): ${phones.join(', ')}` : ''
      const hasEnteredNewData = (emails.length || phones.length) ? '<br>Informou novos dados de contato para negociar:' : ''

      const template = `<p>${this.claimantName} atendeu, mas se recusou a prosseguir com ligação por estar sendo gravada.${hasEnteredNewData}${emailsTemplate}${phonesTemplate}</p>`

      this.saveMassageContent(template)
    },

    saveMassageContent(content) {
      this.isLoading = true

      this.setInteractionMessageContent({
        disputeId: this.call?.disputeId,
        content: content,
        communicationMessageId: this.call?.messageId
      }).then(() => {
        this.$emit('call:end')
        this.$refs.dontRecCallPopover.doClose()
      }).catch((error) => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.isLoading = false
      })
    },

    addNewContact() {
      const params = {
        roleId: this.call?.toRoleId,
        disputeId: this.call?.disputeId,
        contactType: this.newContactType === 'whatsapp' ? 'phone' : 'email',
        contactData: { value: this.newContactModel }
      }

      this.isLoading = true

      this.setTicketOverviewPartyContact(params).then(({ emails, phones }) => {
        const target = this.newContactType === 'whatsapp' ? 'phones' : 'emails'

        this.$set(this.call.contacts, target, this.newContactType === 'whatsapp' ? phones : emails)

        this.contactsAddedRecent[target] = [
          ...this.contactsAddedRecent[target],
          this.newContactModel
        ]
      }).catch((error) => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.isLoading = false
        this.newContactModel = ''
      })
    },

    registerProblemWithNumber() {
      this.isLoading = true

      this.setInvalidNumberInCall({ reason: this.invalidNumberReason }).then(() => {
        this.$emit('call:end')
        this.$refs.incorrectContactPopover.doClose()
      }).catch((error) => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.isLoading = false
        this.invalidNumberReason = ''
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.call-help-dialog {
  .el-dialog__body {
    .call-help__container {
      .call-help__carousel {
        .el-carousel__container {
          .el-carousel__item {
            display: flex;
            flex-direction: column;
            gap: 16px;

            .call-help__carousel-item-info {
              padding: 0;
              text-align: center;
              word-break: keep-all;
            }

            .call-help__suggestion-balloon {
              border: solid $--color-black 1px;
              border-radius: 10px;
              padding: 8px;

              .call-help__suggestion-balloon-label {
                text-align: center;
                margin-top: -18px;

                span {
                  padding: 0 8px;
                  background-color: white;
                  font-weight: 600;
                }
              }
            }

            .call-help__carousel-item-actions {
              display: flex;
              flex-direction: row;
              justify-content: space-around;
            }
          }
        }
      }
    }
  }
}

.incorrect-contact__popover,
.dont-rec-call__popover {
  padding: 16px !important;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .el-popover__title {
    margin: 0;
    font-weight: 600;
    text-align: center;
  }

  .dont-rec-call__label-contacts {
    font-weight: 600;
    text-transform: capitalize;
    margin-bottom: -16px;
    font-size: 14px;
  }

  .dont-rec-call__contacts {
    margin-bottom: -16px;
  }

  .dont-rec-call__contacts:last-of-type {
    margin-bottom: 16px;
  }

  .dont-rec-call__add-contact {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }
}
</style>
