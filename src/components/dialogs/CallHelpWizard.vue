<template>
  <el-dialog
    title="Atenção - Em chamada"
    custom-class="call-help-dialog"
    :visible.sync="visible"
    :modal="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    :lock-scroll="false"
    width="40%"
    destroy-on-close
    :show-close="false"
    center
  >
    <section
      v-if="visible"
      v-loading="isLoading"
      class="call-help__container"
    >
      <!-- <div class="call-help__call">
        <i class="el-icon-microphone el-icon-pulse" />

        <el-button
          :disabled="ending"
          type="danger"
          :icon="ending ? 'el-icon-loading' : ''"
          @click="$emit('call:end')"
        >
          {{ ending ? 'Desligando' : 'Desligar' }}
        </el-button>
      </div> -->

      <el-carousel
        ref="carousel"
        class="call-help__carousel"
        :autoplay="false"
        arrow="never"
        indicator-position="none"
      >
        <el-carousel-item
          ref="carouselItemCallHelp"
          class="call-help__carousel-item"
        >
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

              <li>É sobre um caso envolvendo {{ respondentName }}!</li>
            </ul>
          </div>

          <div
            v-if="showIncorrectContactForm"
            class="call-help__carousel-item-incorrect-contact"
          >
            <el-select
              v-model="invalidNumberReason"
              class="incorrect-contact__select"
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
              :disabled="!invalidNumberReason"
              @click="registerProblemWithNumber()"
            >
              Registrar problema
            </el-button>
          </div>

          <div class="call-help__carousel-item-actions">
            <el-button
              type="danger"
              @click="handleIncorrectContact"
            >
              Contato incorreto
            </el-button>

            <el-tooltip content="Ao termino da contagem, o contato será confirmado automaticamente!">
              <el-button
                type="success"
                class="call-help__carousel-item-actions__correct_contact"
                @click="next('contact')"
              >
                Contato correto
                <Countdown
                  ref="countdown"
                  :end="autoValidateContactTime"
                  :stop="ending"
                />
              </el-button>
            </el-tooltip>
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
            </ul>
          </div>

          <div class="call-help__carousel-item-actions">
            <el-button
              slot="reference"
              type="danger"
              @click="toggleDontRecCallForm()"
            >
              Não concordou
            </el-button>

            <el-button
              type="success"
              @click="close()"
            >
              Concordou
            </el-button>
          </div>

          <div
            v-if="showDontRecCallForm"
            class="call-help__dont-rec-call"
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
  components: {
    Countdown: () => import('@/components/buttons/Countdown')
  },

  props: {
    ending: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    invalidNumberReason: '',
    isLoading: false,
    visible: false,
    newContactType: 'email',
    newContactModel: '',
    showIncorrectContactForm: false,
    showDontRecCallForm: false,
    contactValidityBrand: false,
    contactsAddedRecent: {
      emails: [],
      phones: []
    },
    autoValidateContactTime: '',
    autocontactTimeout: null
  }),

  computed: {
    ...mapGetters({
      call: 'getCurrentCall',
      thamirisName: 'loggedPersonName',
      ticketParties: 'getTicketOverviewParties',
      isRecoveryStrategy: 'isWorkspaceRecovery'
    }),

    claimantName() {
      return this.call?.toRoleName || ''
    },

    respondentName() {
      let name = `Nome ${this.isRecoveryStrategy ? 'da' : 'do'} ${this.$tc('PARTY_RESPONDENT', this.isRecoveryStrategy)} aqui`

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
      handler(call, oldCall) {
        // this.autoValidateContactTime = this.$moment().add(2, 'm').format()

        clearTimeout(this.autocontactTimeout)
        // this.autocontactTimeout = setTimeout(() => {
        //   this.next('contact')
        // }, 2 * 60 * 1000)

        // TODO: Aceitar automaticamente após 2 mim.
        this.visible = call?.status === CALL_STATUS.ACTIVE_CALL

        if (this.visible) {
          this.contactValidityBrand = false
          this.showIncorrectContactForm = false
          this.$emit('queue:hide')

          this.autocontactTimeout = setTimeout(() => {
            this.next('contact')
          }, 2 * 60 * 1000)

          this.autoValidateContactTime = this.$moment().add(2, 'm').format()

          this.$nextTick().then(() => {
            console.log(this.$refs.countdown)
            this.$refs.countdown.reset()
          })
        }

        if (oldCall?.status === CALL_STATUS.COMPLETED_CALL && call === null) {
          // deprecated: Aconfirma validade da chamada.
          // this.handleCloseCall(oldCall)
        }
      }
    }
  },

  methods: {
    ...mapActions([
      'setValidNumberInCall',
      'updatePhoneCallStatus',
      'setInvalidNumberInCall',
      'setTicketOverviewPartyContact',
      'setInteractionMessageContent'
    ]),

    next(item) {
      if (item === 'contact') {
        this.setValidNumberInCall(this.call)
        this.contactValidityBrand = true
        clearTimeout(this.autocontactTimeout)

        // TODO: SAAS-4756 Se a chamada for agendada, Atualizar status da chamada.
        const callIsScheduled = false

        if (callIsScheduled) this.updatePhoneCallStatus(true)
      }

      this.$refs.carousel.next()
    },

    handleIncorrectContact() {
      this.showIncorrectContactForm = !this.showIncorrectContactForm
      this.contactValidityBrand = true

      // TODO: SAAS-4756 Se a chamada for agendada, Atualizar status da chamada.
      const callIsScheduled = false

      if (callIsScheduled) this.updatePhoneCallStatus(true)
    },

    handleCloseCall({ interactionId, disputeId }) {
      if (interactionId && disputeId) {
        this.setValidNumberInCall({ interactionId, disputeId })
      }
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
        // this.$refs.incorrectContactPopover.doClose()
        this.showIncorrectContactForm = false
      }).catch((error) => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.isLoading = false
        this.invalidNumberReason = ''
      })
    },

    toggleDontRecCallForm() {
      this.showDontRecCallForm = !this.showDontRecCallForm
      const ref = this.$refs?.carouselItemCallHelp?.$el

      if (ref) {
        if (this.showDontRecCallForm) {
          const maxScroll = ref.scrollHeight + 50
          ref.scrollTop = maxScroll

          // setTimeout(() => { ref.scrollTo(0, maxScroll) }, 2 * 1000)
        } else {
          ref.scrollTo(0, 0)
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.call-help-dialog {
  .el-dialog__header {
    background: #9461f7;
    color: white;

    .el-dialog__title {
      color: white;
    }
  }

  .el-dialog__body {
    margin: 0 !important;
    padding: 0 !important;

    .call-help__container {
      .call-help__call {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 16px 0 8px;
        gap: 8px;
      }

      .call-help__carousel {
        padding: 0;

        .el-carousel__container {
          .el-carousel__item {
            display: flex;
            flex-direction: column;
            gap: 16px;

            &.call-help__carousel-item {
              overflow-y: scroll;
              padding: 0 24px;
              width: 100%;
            }

            .call-help__carousel-item-info {
              padding: 0;
              text-align: center;
              word-break: keep-all;
            }

            .call-help__suggestion-balloon {
              border: none;
              box-shadow: 0px 3px 6px #00000029;
              border-radius: 10px;
              padding: 8px;
              word-break: break-word;

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

            .call-help__dont-rec-call {
              margin-top: 24px;
              display: flex;
              flex-direction: column;
              gap: 8px;
              align-items: center;

              border: none;
              box-shadow: 0px 3px 6px #00000029;
              border-radius: 10px;
              padding: 8px;

              .dont-rec-call__help {
                margin-top: -16px;
                background: white;
                padding: 0 8px;
                font-weight: 600;
              }

              .dont-rec-call__add-contact {
                display: flex;
                flex-direction: row;
                gap: 4px;
              }

              /*.dont-rec-call__contacts,
              .dont-rec-call__label-contacts {
                align-self: flex-start;
              }*/
            }

            .call-help__carousel-item-incorrect-contact {
              display: flex;
              justify-content: space-between;

              .el-select {
                flex: 3;
              }

              .el-button {
                flex: 1;
                height: 40px;
              }
            }

            .call-help__carousel-item-actions {
              display: flex;
              flex-direction: row;
              justify-content: space-around;

              .call-help__carousel-item-actions__correct_contact {
                span {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                }
              }
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
