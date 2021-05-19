<template>
  <article class="party-details">
    <!-- Dialog para exclusão de parte cascateda ou não -->
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="chooseRemoveLawyerDialogVisible"
      title="Excluir parte"
      width="520px"
    >
      <div class="el-message-box__content">
        <div class="el-message-box__container">
          <div class="el-message-box__status el-icon-warning" />
          <div class="el-message-box__message">
            <p>Tem certeza que deseja excluir esta parte?</p>
            <p>Esta ação é irreversível.</p>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-tooltip
          :content="`Remover ${partName} de todas as disputas com mesmo réu.`"
          placement="top"
        >
          <el-button
            @click="removeLawyer(true)"
          >
            De todas as disputas
          </el-button>
        </el-tooltip>
        <el-tooltip
          :content="`Remover ${partName} somente desta disputa.`"
          placement="top"
        >
          <el-button
            @click="removeLawyer(false)"
          >
            Desta disputa
          </el-button>
        </el-tooltip>
        <el-button
          type="primary"
          @click="chooseRemoveLawyerDialogVisible = false"
        >
          Cancelar
        </el-button>
      </span>
    </el-dialog>

    <div
      v-if="!isNegotiator && !isPreNegotiation"
      class="party-details__infoline party-details__infoline--center"
    >
      <PopoverLinkInlineEditor
        v-model="party.polarity"
        :options="roleOptions"
        :width="200"
        class="party-details__infoline-link"
        label="Trocar polaridade"
        @change="updatePolarity"
      />
      <a
        v-if="!isNegotiator"
        class="party-details__infoline-link party-details__infoline-link--danger"
        @click="removeParty"
      >
        <i class="el-icon-delete" />
      </a>
    </div>

    <div class="party-details__infoline">
      <el-alert
        v-if="!resumedState.isDead"
        :closable="false"
        class="party-details__infoline-dead-alert mb10"
        title="Possível óbito"
        type="error"
      >
        Algumas de nossas bases de informações constam que a parte possivelmente encontra-se em óbito.
      </el-alert>

      <span class="party-details__infoline-label">Nome completo:</span>

      <JusVexatiousAlert
        v-if="party.polarity === 'CLAIMANT'"
        :document-number="party.documentNumber"
        :name="party.name"
      />

      <TextInlineEditor
        v-model="party.name"
        :is-editable="!isNegotiator && !isPreNegotiation"
        filter="ownName"
        class="party-details__infoline-data"
        @change="updateParty($event, 'name')"
      />
    </div>

    <div
      v-if="party.polarity === 'CLAIMANT'"
      class="party-details__infoline"
    >
      <span class="party-details__infoline-label">Data de nascimento:</span>
      <DateInlieEditor
        v-if="party.birthday || activeAddingData === 'birthday'"
        ref="birthday"
        v-model="party.birthday"
        :is-editable="!isNegotiator && !isPreNegotiation"
        :processed-date="$moment(new Date(party.birthday)).fromNow(true)"
        :is-date-time-format="false"
        class="party-details__infoline-data"
        @change="updateParty($event, 'birthday')"
        @blur="stopEditing"
        @enableEdit="enableEdit"
      />
      <div
        v-else-if="!isPreNegotiation"
        class="party-details__infoline-link"
      >
        <a @click="startEditing('birthday')">Adicionar</a>
      </div>
    </div>

    <div
      v-if="!isNegotiator || party.documentNumber"
      class="party-details__infoline"
    >
      <span class="party-details__infoline-label">{{ documentType }}:</span>
      <TextInlineEditor
        v-if="party.documentNumber || activeAddingData === 'documentNumber'"
        ref="documentNumber"
        v-model="party.documentNumber"
        :is-editable="!isNegotiator && !isPreNegotiation"
        :mask="() => ['###.###.###-##', '##.###.###/####-##']"
        filter="cpfCnpj"
        class="party-details__infoline-data"
        @change="updateParty($event, 'documentNumber')"
        @enableEdit="enableEdit"
      />
      <div
        v-else-if="!isPreNegotiation"
        class="party-details__infoline-link"
      >
        <a @click="startEditing('documentNumber')">Adicionar</a>
      </div>
    </div>

    <div
      v-if="!isNegotiator || phonesList.length"
      class="party-details__infoline"
    >
      <span class="party-details__infoline-label">Telefones:</span>
      <PartyContacts
        :contacts="phonesList"
        :disabled="isNegotiator || isPreNegotiation"
        filter="phoneNumber"
        model="number"
        :mask="phoneMask"
        @change="(...args)=>updateContacts(...args, 'phone')"
        @delete="removeContact($event, 'phone')"
        @post="addContact($event, 'phone')"
        @click="(...args)=>selectContact(...args, 'whatsapp')"
      />
    </div>

    <div
      v-if="!isNegotiator || emailsList.length"
      class="party-details__infoline"
    >
      <span class="party-details__infoline-label">Emails:</span>
      <PartyContacts
        :contacts="emailsList"
        :disabled="isNegotiator || isPreNegotiation"
        model="address"
        @change="(...args)=>updateContacts(...args, 'email')"
        @delete="removeContact($event, 'email')"
        @post="addContact($event, 'email')"
        @click="(...args)=>selectContact(...args, 'email')"
      />
    </div>

    <div
      v-if="!isNegotiator || mappedOabs.length"
      class="party-details__infoline"
    >
      <span class="party-details__infoline-label">Oab:</span>
      <PartyContacts
        :contacts="mappedOabs"
        :disabled="isNegotiator || isPreNegotiation"
        filter="oab"
        model="fullOab"
        :mask="oabMask"
        @change="(...args)=>updateContacts(...args, 'oab')"
        @delete="removeContact($event, 'oab')"
        @post="addContact($event, 'oab')"
      />
    </div>

    <div
      v-if="!isNegotiator"
      class="party-details__infoline"
    >
      <span class="party-details__infoline-label">Dados bancários:</span>
      <PartyBankAccounts
        :accounts="bankAccounts"
        :person-id="party.personId"
        :disabled="isPreNegotiation"
      />
      <!-- class="party-details__infoline-data" -->
    </div>
    <InfoMergeDialog
      ref="mergeInfoDialog"
      :party="party"
      :infos="mergePartyInfos"
      @update="handleMergePartyInfos"
    />
  </article>
</template>

<script>
import { mapActions } from 'vuex'
import { isSimilarStrings } from '@/utils'
import { isValid, strip } from '@fnando/cpf'

import preNegotiation from '@/utils/mixins/ticketPreNegotiation'
import TicketTicketOverviewPartyResumed from '@/models/negotiations/overview/TicketOverviewPartyResumed'

export default {
  name: 'PartyDetails',

  components: {
    PopoverLinkInlineEditor: () => import('@/components/inputs/PopoverLinkInlineEditor'),
    JusVexatiousAlert: () => import('@/components/dialogs/JusVexatiousAlert'),
    TextInlineEditor: () => import('@/components/inputs/TextInlineEditor'),
    DateInlieEditor: () => import('@/components/inputs/DateInlieEditor'),
    InfoMergeDialog: () => import('./partial/InfoMergeDialog'),
    PartyBankAccounts: () => import('./PartyBankAccounts'),
    PartyContacts: () => import('./PartyContacts')
  },

  mixins: [preNegotiation],

  props: {
    party: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    chooseRemoveLawyerDialogVisible: false,
    activeAddingData: '',
    mergePartyInfos: {}
  }),

  computed: {
    disputeId() {
      return Number(this.$route.params.id)
    },

    phonesList() {
      return this.party?.phonesDto || []
    },

    emailsList() {
      return this.party?.emailsDto || []
    },

    bankAccounts() {
      return this.party?.bankAccountsDto || []
    },

    documentType() {
      return this.resumedState.documentType
    },

    roleOptions() {
      const { roles } = this.party
      const partyOptions = [
        { value: 'RESPONDENT', label: this.$t('roles.PARTY.RESPONDENT') },
        { value: 'CLAIMANT', label: this.$t('roles.PARTY.CLAIMANT') }
      ]
      const lawyerOptions = [
        { value: 'RESPONDENT', label: this.$t('roles.LAWYER.RESPONDENT') },
        { value: 'CLAIMANT', label: this.$t('roles.LAWYER.CLAIMANT') }
      ]

      if (roles.includes('PARTY')) {
        return partyOptions
      } else if (roles.includes('LAWYER')) {
        return lawyerOptions
      } else if (roles.includes('NEGOTIATOR')) {
        return []
      } else {
        return [...partyOptions, ...lawyerOptions]
      }
    },

    mappedOabs() {
      const { oabsDto } = this.party
      return oabsDto?.map(oab => {
        const { number, state } = oab
        return { ...oab, fullOab: number + state }
      }) || []
    },

    isNegotiator() {
      return this.party.roles?.includes('NEGOTIATOR')
    },

    isLawyer() {
      return this.party.roles?.includes('LAWYER')
    },

    partName() {
      return this.party.name
    },

    resumedState() {
      return new TicketTicketOverviewPartyResumed(this.party)
    }
  },

  methods: {
    ...mapActions([
      'addRecipient',
      'searchPersonByOab',
      'setTicketOverviewParty',
      'deleteTicketOverviewParty',
      'setTicketOverviewPartyPolarity',
      'setTicketOverviewPartyContact',
      'deleteTicketOverviewPartyContact',
      'updateTicketOverviewPartyContact'
    ]),
    startEditing(key) {
      this.activeAddingData = key
    },
    enableEdit() {
      const { activeAddingData } = this
      if (activeAddingData) this.$refs[activeAddingData].enableEdit()
    },
    stopEditing() {
      this.activeAddingData = ''
    },
    updatePolarity(rolePolarity) {
      const params = {
        disputeId: this.disputeId,
        roleId: this.party.disputeRoleId,
        rolePolarity
      }

      this.setTicketOverviewPartyPolarity(params)
    },
    updateParty(value, key) {
      const { disputeId, party } = this
      const data = party.legacyDto
      data[key] = value

      this.setTicketOverviewParty({ disputeId, data })
    },
    removeParty() {
      if (this.isLawyer) {
        this.chooseRemoveLawyerDialogVisible = true
      } else {
        const { disputeId, party } = this
        this.$confirm('Tem certeza que deseja excluir esta parte da disputa? Está ação é irreversível', 'Atenção', {
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          cancelButtonClass: 'is-plain',
          showClose: false
        }).then(() => {
          this.deleteTicketOverviewParty({
            roleId: party.disputeRoleId,
            disputeId
          })
        })
      }
    },

    removeLawyer(forAllDisputes) {
      const { disputeId, party } = this
      const payload = {
        roleId: party.disputeRoleId,
        disputeId
      }
      if (!forAllDisputes) {
        payload.cancelPropagation = true
      }
      this.deleteTicketOverviewParty(payload).then(() => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Parte removida com sucesso!',
          type: 'success'
        })
      }).catch(error => {
        this.$jusNotification({ error })
      })
      this.chooseRemoveLawyerDialogVisible = false
    },

    handleMergePartyInfos(keys = []) {
      if (keys.length) {
        const data = Object.assign({}, this.party.legacyDto)
        const { disputeId } = this

        keys.forEach(key => {
          data[key] = this.mergePartyInfos[key]
        })

        this.setTicketOverviewParty({ disputeId, data }).then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Dados associados com sucesso',
            type: 'success'
          })
        }).catch(error => {
          this.$jusNotification({ error })
        }).finally(() => {
          this.mergePartyInfos = {} // Limpa o estado onde os dados à serem inseridos na parte.
        })
      }
    },

    addContact(contactValue, contactType) {
      const { disputeId, party } = this
      const params = {
        roleId: party.disputeRoleId,
        disputeId,
        contactType: contactType,
        contactData: { value: contactValue }
      }

      if (contactType === 'oab') {
        delete params.contactData.value
        const oabSplited = contactValue.split('/')
        params.contactData.number = oabSplited[0]
        params.contactData.state = oabSplited[1]

        let phones = []
        let emails = []

        this.searchPersonByOab({ // Busca os dados da pessoa pela OAB.
          oabNumber: params.contactData.number.replace('.', ''),
          oabState: params.contactData.state
        }).then(res => {
          if (res) { // Verifica se veio informação no GET.
            phones = res.phones.filter(newPhone => {
              return !newPhone.archived && newPhone.isValid && (this.phonesList.find(({ number }) => newPhone.number === number) === undefined)
            }) // Filtra telefones para serem adicionados na parte.

            emails = res.emails.filter(newEmail => {
              return !newEmail.archived && newEmail.isValid && (this.emailsList.find(({ address }) => address === newEmail.address) === undefined)
            }) // Filtra e-mails para serem adicionados na parte.

            // TODO: Refatorar isso.
            if (isValid(res.documentNumber)) {
              const resDocument = strip(res.documentNumber)
              const partyDocument = strip(this.party.documentNumber)

              if (partyDocument !== resDocument) {
                this.mergePartyInfos.documentNumber = res.documentNumber
              }
            }

            if (res.name?.length) {
              const resName = String(res.name).toLowerCase()
              const partyName = String(this.party.name).toLowerCase()

              if (!isSimilarStrings(resName, partyName, 90)) {
                this.mergePartyInfos.name = res.name
              }
            }
          }
        }).finally(() => {
          this.setTicketOverviewPartyContact(params).then(() => { // Salva a OAB
            console.log(phones, emails)
            Promise.all([
              // Salva todos os telefones novos encontrados pela OAB.
              ...phones.map(({ number }) => this.addContact(number, 'phone')),
              // Salva todos os emails novos encontrados pela OAB.
              ...emails.map(({ address }) => this.addContact(address, 'email'))
            ]).finally(() => {
              // Verifica se precisa mostrar algúm dado na modal.
              if (Object.values(this.mergePartyInfos).length) {
                this.$refs.mergeInfoDialog.show() // Abre a modal
              }
            })
          }).then(() => {
            this.$jusNotification({
              title: 'Yay!',
              message: 'Dados associados com sucesso',
              type: 'success'
            })
          }).catch(error => this.$jusNotification({ error }))
        })
      } else {
        this.setTicketOverviewPartyContact(params)
      }
    },

    updateContacts(contactId, contactValue, contactType) {
      if (!contactValue) {
        return
      }
      const { disputeId, party } = this
      const params = {
        roleId: party.disputeRoleId,
        disputeId,
        contactId,
        contactType,
        contactData: { value: contactValue }
      }

      if (contactType === 'oab') {
        delete params.contactData.value
        const oabSplited = contactValue.split('/')
        params.contactData.number = oabSplited[0]
        params.contactData.state = oabSplited[1]
      }

      this.updateTicketOverviewPartyContact(params)
    },
    removeContact(contactId, contactType) {
      const { disputeId, party } = this

      this.deleteTicketOverviewPartyContact({
        roleId: party.disputeRoleId,
        disputeId,
        contactId,
        contactType
      })
    },
    selectContact(value, key, type) {
      if (!this.isNegotiator) {
        this.addRecipient({ value, key, type })
      }
    },
    oabMask(value = '') {
      const oab = value?.replace(/[^\w*]/g, '').toUpperCase()

      if (/[ABDENPabdenp]/.test(oab.charAt(2))) {
        return '##D.###/AA'
      } else if (/[A-Z]/.test(oab.charAt(5))) {
        return '##.###/AA'
      } else {
        return '###.###/AA'
      }
    },
    phoneMask(value = '') {
      const number = value?.replace(/[^\w*]/g, '').toUpperCase()

      switch (number.length) {
        case 8:
          return '####-####'
        case 9:
          return '#####-####'
        case 10:
          return '(##) ####-####'
        case 11:
          return '(##) #####-####'
        case 12:
          return '+## (##) ####-####'
        case 13:
          return '+## (##) #####-####'
        default:
          return '####-####-####-####'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.party-details {
  .party-details__infoline {
    margin-top: 6px;
    line-height: normal;
    position: relative;

    .jus-vexatious-alert {
      position: absolute;
      left: 0;
      bottom: 0;
    }

    .party-details__infoline-label {
      line-height: normal;
      font-size: 13px;
      color: $--color-text-secondary;
    }

    .party-details__infoline-data,
    .party-details__infoline-link {
      line-height: normal;
      margin: 3px 0 3px 24px;
    }

    &--center {
      font-size: 13px;
      display: flex;
      justify-content: center;
      margin: 3px 0;
      position: relative;

      .party-details__infoline-link {
        margin: 0;
        margin-bottom: 3px;

        &--danger {
          color: $--color-danger;
          position: absolute;
          top: 0;
          right: 0;
          opacity: 0;
          transition: .2s ease-out;
          &:hover { color: $--color-danger-light-3; }
        }
      }
    }
  }

  &:hover {
    .party-details__infoline--center {
      .party-details__infoline-link--danger {
        opacity: 1;
      }
    }
  }
}
</style>
