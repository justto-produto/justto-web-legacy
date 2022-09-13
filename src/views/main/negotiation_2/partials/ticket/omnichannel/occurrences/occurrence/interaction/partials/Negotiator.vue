<template>
  <section class="negotiator-container">
    <div
      v-if="toPrint"
      class="date-to-print"
    >
      {{ sendDate | moment('[Em] DD/MM [-] HH:mm') }}
    </div>
    <div class="negotiator-container__contact">
      <JusIcon
        class="negotiator-container__email-icon"
        icon="negotiator-message-2"
      />
      <span
        v-if="contact.length"
        class="negotiator-container__email-prefix"
      >
        {{ prefix }}
      </span>

      {{ contact }}
    </div>
    <div
      class="negotiator-container__content"
      v-html="message"
    />
    <span
      v-if="!toPrint"
      class="negotiator-container__about negotiation-occurrence-about"
    >
      <span class="negotiator-container__about__time">
        {{ sendDate | moment('HH:mm') }}
      </span>

      <span v-if="status.icon">
        •
      </span>

      <el-tooltip
        :open-delay="600"
        :content="status.tooltip"
      >
        <jus-icon
          class="negotiator-container__about__icon"
          :icon="status.icon"
        />
      </el-tooltip>
    </span>

    <PartyBankAccountDialog
      v-if="showRegisterBankAccountButton"
      ref="partyBankAccountDialog"
      placement="right"
      @create="handleAddAccount"
    >
      <el-button
        class="negotiator-container__checkout_btn"
        :class="{ 'has-error': denyRegister }"
        :disabled="denyRegister"
        type="text"
        size="small"
        @click="registerBankAccount()"
      >
        <span v-if="denyRegister">
          Esta disputa não permite cadastro de conta poupança
        </span>
        <span v-else>
          Cadastrar
        </span>
      </el-button>
    </PartyBankAccountDialog>

    <el-button
      v-if="!showRegisterBankAccountButton && isBankAccountCheckout && partyBankAccount.length"
      class="negotiator-container__checkout_btn"
      :class="{ 'registered': !needAssociate.length }"
      :disabled="!needAssociate.length"
      type="text"
      size="small"
      @click="assicateBankAccount()"
    >
      <span v-if="needAssociate.length > 0">
        Associar
      </span>
      <span v-else>
        Conta associada!
      </span>
    </el-button>

    <SavingsAccountAlert
      ref="savingAccountAlert"
      @save="addBankAccount"
      @close="hideBankAccountDialog()"
    />
  </section>
</template>

<script>
import communicationSendStatus from '@/utils/mixins/communicationSendStatus'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    SavingsAccountAlert: () => import('@/components/dialogs/SavingsAccountAlert.vue'),
    PartyBankAccountDialog: () => import('@/views/main/negotiation/partials/ticket/overview/tabs/parties/PartyBankAccountDialog.vue')
  },

  mixins: [communicationSendStatus],

  props: {
    value: {
      type: Object,
      required: true
    },
    occurrence: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      ticketParties: 'getTicketOverviewParties',
      ticketInfo: 'getTicketOverviewInfo'
    }),

    interaction() {
      return this.value
    },

    denyRegister() {
      return this.ticketInfo?.denySavingDeposit && this.bankAccount.type === 'SAVING'
    },

    isBankAccountCheckout() {
      return ['NEGOTIATOR_CHECKOUT'].includes(this.interaction.type)
    },

    bankAccount() {
      function extractInfo(str, token, defaultValue = '') {
        return str.split(`${token}: `)[1].split(',')[0] || defaultValue
      }

      const accountTypes = {
        Corrente: 'CHECKING',
        Poupança: 'SAVING'
      }

      return this.isBankAccountCheckout ? {
        name: extractInfo(this.interaction.properties.BANK_INFO, 'Nome'),
        email: extractInfo(this.interaction.properties.BANK_INFO, 'E-mail'),
        document: extractInfo(this.interaction.properties.BANK_INFO, 'Documento'),
        agency: extractInfo(this.interaction.properties.BANK_INFO, 'Agência'),
        bank: extractInfo(this.interaction.properties.BANK_INFO, 'Banco'),
        number: extractInfo(this.interaction.properties.BANK_INFO, 'Conta'),
        type: accountTypes[extractInfo(this.interaction.properties.BANK_INFO, 'Tipo')]
      } : {}
    },

    partyBankAccount() {
      return this.ticketParties.filter(partie => {
        return partie.documentNumber === this.bankAccount.document && partie.polarity === 'CLAIMANT' && Object.keys(partie).includes('bankAccountsDto')
      }).map(({ bankAccountsDto }) => (bankAccountsDto || []))
    },

    showRegisterBankAccountButton() {
      return this.isBankAccountCheckout && this.partyBankAccount.length && !this.partyBankAccount.filter(baccounts => {
        return baccounts.filter(baccount => this.isSameBankAccount(baccount, this.bankAccount)).length
      }).length
    },

    needAssociate() {
      if (this.partyBankAccount.length) {
        return this.partyBankAccount
          .find(baccounts => baccounts
            .filter(baccount => baccount.associatedInDispute))
          .filter(baccount => !baccount.associatedInDispute && this.isSameBankAccount(baccount, this.bankAccount))
      } else {
        return []
      }
    },

    message() {
      const { PERSON_NAME, VALUE, NOTE, BANK_INFO } = this.interaction.properties
      let text = `<b>${this.interaction.type}</b>`
      switch (this.interaction.type) {
        case 'NEGOTIATOR_COUNTERPROSAL':
          text = `Contraproposta realizada por <b>${PERSON_NAME}</b>, no valor de <b>${VALUE}</b>`
          if (NOTE) {
            text += `, com a nota: ${NOTE}`
          } else {
            text += '.'
          }
          break
        case 'NEGOTIATOR_PROPOSAL':
          text = `Proposta realizada por <b>${PERSON_NAME}</b>, no valor de <b>${VALUE}</b>`
          if (NOTE) {
            text += `, com a nota: ${NOTE}`
          } else {
            text += '.'
          }
          break
        case 'NEGOTIATOR_ACCEPTED':
          text = `Proposta no valor de <b>${VALUE}</b> foi aceita através do portal de negociações da JUSTTO por <b>${PERSON_NAME}</b>`
          break
        case 'NEGOTIATOR_CHECKOUT':
          text = `<b>Dados Bancários</b>:</br>${BANK_INFO}`.replace(/,/g, '</br>')
          break
      }

      return text
    },

    messageType() {
      const mapCommunicationTypes = {
        EMAIL: 'email',
        WHATSAPP: 'whatsapp',
        NEGOTIATOR_MESSAGE: 'negotiator-message-2'
      }
      if (this.interaction?.message?.communicationType) {
        const { communicationType } = this.interaction.message
        if (Object.keys(mapCommunicationTypes).includes(communicationType)) {
          return mapCommunicationTypes[communicationType]
        }
      }
      return 'email'
    },

    prefix() {
      return this.directionIn ? 'de' : 'para'
    },

    contact() {
      return this.interaction?.properties?.PERSON_EMAIL || ''
    },

    status() {
      const status = this.value?.properties?.DISPUTE_STATUS

      return {
        icon: status?.toLowerCase() || '',
        tooltip: status ? `No momento desta ocorrência, esta disputa estava ${this.$tc('dispute.status.' + status)}.` : ''
      }
    }
  },

  updated() {
    this.$set(this.occurrence, 'renderCompleted', true)
  },

  mounted() {
    this.$set(this.value, 'renderCompleted', true)
  },

  methods: {
    ...mapActions([
      'getTicketOverviewParties',
      'setTicketRoleBankAccount',
      'createTicketRoleBankAccount'
    ]),

    isSameBankAccount(baccount = {}, bankAccount) {
      return baccount.agency === bankAccount.agency &&
        baccount.number === bankAccount.number &&
        baccount.bank === bankAccount.bank &&
        baccount.type === bankAccount.type
    },

    registerBankAccount() {
      this.$refs.partyBankAccountDialog.openBankAccountDialog(this.bankAccount)
    },

    handleAddAccount(model) {
      if (model.account.type === 'SAVING' && model.associate) {
        this.$refs.savingAccountAlert.open(model)
      } else {
        this.addBankAccount(model)
      }
    },

    addBankAccount({ account, associate }) {
      const { cpfCnpj } = this.$options.filters
      const disputeId = Number(this.$route.params.id)

      const party = this.ticketParties.find(({ documentNumber, polarity }) => cpfCnpj(documentNumber) === cpfCnpj(account.document) && polarity === 'CLAIMANT')
      const personId = party.person.id

      console.table({ account, personId, disputeId })

      this.createTicketRoleBankAccount({ account, personId, disputeId }).then(response => {
        if (associate) {
          const baccount = response.bankAccounts.find(baccount => {
            return baccount.agency === account.agency &&
              baccount.document === account.document &&
              baccount.number === account.number &&
              baccount.bank === account.bank &&
              baccount.type === account.type
          })

          this.setTicketRoleBankAccount({ bankAccountId: baccount.id, personId, disputeId })
        }
      }).finally(() => {
        this.hideBankAccountDialog()
      })
    },

    assicateBankAccount() {
      const disputeId = Number(this.$route.params.id)

      this.needAssociate.forEach(account => {
        const { personId, id } = account

        this.setTicketRoleBankAccount({ bankAccountId: id, personId, disputeId })
      })
    },

    hideBankAccountDialog() {
      this.$refs.partyBankAccountDialog.closeDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.negotiator-container {
  overflow-y: hidden;
  margin: 12px;

  .negotiator-container__content {
    display: block;
    font-size: 16px;
    color: $--color-text-primary;

    @media (max-height: 900px) {
      font-size: 14px;
    }
  }

  .negotiator-container__contact {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 6px;
    font-weight: 600;
    color: $--color-text-primary;

    .negotiator-container__email-icon {
      width: 16px;
      margin-bottom: -3px;
    }
  }

  .negotiator-container__about {
    color: #3C3B3B;

    .negotiator-container__about__time {
      word-break: keep-all;
    }

    .negotiator-container__about__icon {
      width: 14px;
    }
  }

  .negotiator-container__checkout_btn {
    display: flex;
    margin: 0 auto;

    &.has-error {
      color: $--color-danger;
    }

    &.registered {
      color: $--color-success;
    }
  }
}
</style>
