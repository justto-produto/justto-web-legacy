<template>
  <article class="party-details">
    <!-- Dialog de warning para LGPD -->
    <WarningLGPD
      :lgpd-dialog-visible="LGPDWarningDialogVisible"
      :is-phone-number="selectContactObj.type === 'whatsapp' || selectContactObj.type === 'sms'"
      :party-name="party.name"
      @click="(ok) => handleLgpdWarning(ok)"
    />

    <JusEditRole
      v-if="Boolean(party.legacyDto) && !isNegotiator && isJusttoAdmin"
      :visible="editRoleDialogVisible"
      :party="party.legacyDto"
      @closeEdit="editRoleDialogVisible = false"
    />

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
    </div>

    <div class="party-details__infoline">
      <el-alert
        v-if="resumedState.isDead"
        :closable="false"
        class="party-details__infoline-dead-alert mb10"
        title="Possível óbito"
        type="error"
      >
        Algumas de nossas bases de informações constam que a parte possivelmente encontra-se em óbito.
      </el-alert>

      <span class="party-details__infoline-label">Nome completo:</span>
      <div class="party-details__icon-info-lawyer">
        <el-tooltip
          :open-delay="600"
          effect="dark"
          placement="left"
          content="Ver mais informações"
        >
          <el-popover
            v-if="isLawyer && !resumedState.isVexatious"
            :ref="`popover-${party.name}`"
            popper-class="party-details__info-popover-lawyer"
            :placement="'top-end'"
            trigger="click"
            @hide="deactivePopover(`popover-${party.name}`)"
          >
            <lawyer-detail
              @update="updateDisputeRoleField(party, $event)"
            />
            <i
              slot="reference"
              class="el-icon-info"
              @click="searchThisLawyer({ name: party.name, oabs: [] }, `popover-${party.name}`)"
            />
          </el-popover>
        </el-tooltip>

        <JusVexatiousAlert
          v-if="resumedState.isVexatious && resumedState.isClaimant"
          :document-number="party.documentNumber"
          :name="party.name"
          icon="flat-alert"
        />

        <TextInlineEditor
          v-model="party.name"
          :is-editable="!isNegotiator && !isPreNegotiation"
          filter="ownName"
          class="party-details__infoline-data"
          @change="updateParty($event, 'name')"
        />
      </div>
    </div>

    <div
      v-if="resumedState.isClaimant"
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
      v-if="resumedState.isNamesake"
      class="party-details__infoline"
    >
      <el-button
        class="party-details__infoline-namesake-button"
        type="warning"
        @click="showNamesakeDialog"
      >
        <span>Tratar homônimos</span>
      </el-button>
    </div>

    <div
      v-if="!isNegotiator || party.documentNumber"
      class="party-details__infoline"
    >
      <span
        ref="spanDocumentNumber"
        class="party-details__infoline-label"
      >
        {{ documentType }}:
      </span>
      <TextInlineEditor
        v-if="party.documentNumber || activeAddingData === 'documentNumber'"
        ref="documentNumber"
        v-model="party.documentNumber"
        :is-editable="!isNegotiator && !isPreNegotiation"
        :mask="() => ['###.###.###-##', '##.###.###/####-##']"
        filter="cpfCnpj"
        class="party-details__infoline-data"
        @blur="startEditing('')"
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
        :party-name="party.name"
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
        :party-name="party.name"
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
        :party="party"
        filter="oab"
        model="fullOab"
        :mask="oabMask"
        @update="updateDisputeRoleField(party, $event)"
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
        :person-id="resumedState.personId"
        :disabled="isPreNegotiation"
        :can-open="resumedState.hasDocumentNumber"
        :account-mockup="bankAccountMockup"
        @validateOpen="validateDocumentNumber"
      />
      <!-- class="party-details__infoline-data" -->
    </div>

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
          :open-delay="600"
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
          :open-delay="600"
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

    <div class="party-details__edit">
      <el-button
        v-if="!isNegotiator"
        class="party-details__edit-button--danger"
        type="text"
        icon="el-icon-delete"
        @click="removeParty"
      >
        Excluir
      </el-button>

      <el-button
        v-if="!isNegotiator && isJusttoAdmin"
        class="party-details__edit-button"
        type="text"
        icon="el-icon-edit"
        @click="editRoleDialogVisible = true"
      >
        Editar
      </el-button>
    </div>

    <InfoMergeDialog
      ref="mergeInfoDialog"
      :party="party"
      :infos="mergePartyInfos"
      @update="handleMergePartyInfos"
    />

    <NamesakeDialog ref="namesakeDialog" />
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { isSimilarStrings } from '@/utils'
import { isValid, strip } from '@fnando/cpf'

import brazilianStates from '@/constants/brazilianStates'

import restartEngagement from '@/utils/mixins/restartEngagement'
import preNegotiation from '@/utils/mixins/ticketPreNegotiation'
import TicketTicketOverviewPartyResumed from '@/models/negotiations/overview/TicketOverviewPartyResumed'

export default {
  name: 'PartyDetails',

  components: {
    PopoverLinkInlineEditor: () => import('@/components/inputs/PopoverLinkInlineEditor'),
    JusVexatiousAlert: () => import('@/components/dialogs/JusVexatiousAlert'),
    TextInlineEditor: () => import('@/components/inputs/TextInlineEditor'),
    DateInlieEditor: () => import('@/components/inputs/DateInlieEditor'),
    NamesakeDialog: () => import('@/components/dialogs/NamesakeDialog'),
    InfoMergeDialog: () => import('./partial/InfoMergeDialog'),
    PartyBankAccounts: () => import('./PartyBankAccounts'),
    PartyContacts: () => import('./PartyContacts'),
    LawyerDetail: () => import('@/components/others/LawyerDetail'),
    WarningLGPD: () => import('@/components/dialogs/WarningLGPD'),
    JusEditRole: () => import('@/components/dialogs/JusEditRole')
  },

  mixins: [preNegotiation, restartEngagement],

  props: {
    party: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    chooseRemoveLawyerDialogVisible: false,
    LGPDWarningDialogVisible: false,
    editRoleDialogVisible: false,
    activeAddingData: '',
    mergePartyInfos: {},
    selectContactObj: {}
  }),

  computed: {
    ...mapGetters({
      ticketStatus: 'getticketOverviewStatus',
      isJusttoAdmin: 'isJusttoAdmin'
    }),

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
    },

    firstEmail() {
      return this.emailsList.find(({ archived, isMain, isValid }) => (!archived && isMain && isValid))?.address || ''
    },

    bankAccountMockup() {
      return {
        ...this.resumedState.bankAccountMockup,
        email: this.firstEmail
      }
    }
  },

  methods: {
    ...mapActions([
      'getDispute',
      'searchLawyers',
      'addRecipient',
      'verifyRecipient',
      'searchPersonByOab',
      'setTicketOverviewParty',
      'deleteTicketOverviewParty',
      'setTicketOverviewPartyPolarity',
      'setTicketOverviewPartyContact',
      'deleteTicketOverviewPartyContact',
      'updateTicketOverviewPartyContact',
      'addPhoneToDisputeRole',
      'addOabToDisputeRole',
      'hideSearchLawyerLoading'
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

    isValidOab(oab) {
      const oabState = oab.split('/')[1] || ''

      return (oab.length >= 8 && oab.length <= 10) && brazilianStates.map(({ value }) => value).includes(oabState)
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

        if (!this.isValidOab(contactValue)) {
          this.$jusNotification({
            title: 'Ops!',
            message: 'OAB inválida',
            type: 'error'
          })
          return
        }

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
        if (!this.isValidOab(contactValue)) {
          this.$jusNotification({
            title: 'Ops!',
            message: 'OAB inválida',
            type: 'error'
          })
          return
        }

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

    handleLgpdWarning(ok) {
      if (ok) {
        const { value, key, type } = this.selectContactObj
        this.selectContact(value, key, true, type)
      }
      this.LGPDWarningDialogVisible = false
    },

    selectContact(value, key, isMain, type) {
      const reply = {
        disputeId: this.$route.params.id,
        type,
        value,
        key
      }
      if (!isMain) {
        this.selectContactObj = reply
        this.LGPDWarningDialogVisible = true
      } else {
        this.verifyRecipient(reply)
          .then((data) => {
            if (data.value === 'AUTHORIZED') {
              delete reply.disputeId
              this.addRecipient({ value, key, type })
            } else {
              this.LGPDWarningDialogVisible = true
            }
          })
      }
    },

    oabMask(value = '') {
      const oab = value?.replace(/[^\w*]/g, '').toUpperCase()

      if (/[ABDENPabdenp]/.test(oab.charAt(2))) {
        return '##D.###/AA'
      } else if (/[A-Z]/.test(oab.charAt(4))) {
        return '#.###/AA'
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
    },

    showNamesakeDialog() {
      if (['CHECKOUT', 'ACCEPTED', 'SETTLED', 'UNSETTLED'].includes(this.ticketStatus)) {
        this.$confirm(`Você está solicitando o tratamento de homônimo de uma disputa que já
        foi finalizada. Este processo irá agendar novamente as mensagens
        para a parte quando finalizado.<br /><br />Você deseja continuar mesmo assim?`,
        'Atenção!', {
          confirmButtonClass: 'confirm-action-btn',
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          dangerouslyUseHTMLString: true,
          cancelButtonClass: 'is-plain'
        }).then(() => this.openNamesakeDialog())
      } else {
        this.openNamesakeDialog()
      }
    },

    openNamesakeDialog() {
      this.$refs.namesakeDialog.show(this.resumedState.name, this.resumedState.personId)
    },

    searchThisLawyer(lawyer, ref) {
      if (!this.$refs[ref].showPopper) {
        this.$refs[ref].$el.classList.add('active-popover')
        this.searchLawyers(lawyer).finally(this.hideSearchLawyerLoading)
      }
    },

    deactivePopover(ref) {
      this.$refs[ref].$el.classList.remove('active-popover')
    },

    updateDisputeRoleField(disputeRole, { field, value }) {
      let message = ''
      const id = this.$route.params.id
      if (field === 'oab') {
        const { number, state } = value

        const alreadyExists = disputeRole.oabsDto.filter(oab => {
          return number === oab.number && state === oab.state && !oab.archived
        }).length > 0

        if (!alreadyExists) {
          this.addOabToDisputeRole({
            disputeId: id,
            disputeRoleId: disputeRole.id || disputeRole.disputeRoleId,
            number,
            state
          }).then(() => {
            this.$jusNotification({
              title: 'Yay!',
              message: 'Nº de OAB adicionada.',
              type: 'success'
            })
          }).catch(error => {
            this.$jusNotification({ error })
          }).finally(this.$forceUpdate)
        } else {
          message = 'Este nº de OAB já esta em uso.'
        }
      } else if (field === 'documentNumber') {
        if (disputeRole.documentNumber !== value) {
          this.addNewDocumentNumber(disputeRole, value)
        } else {
          message = 'Este documento já esta em uso.'
        }
      } else if (field === 'phone') {
        const lawyerNumber = `55 ${value}`.split(' ').join('')

        const alreadyExistsNumber = disputeRole.phonesDto.filter(({ number }) => number.includes(lawyerNumber)).length > 0

        if (!alreadyExistsNumber) {
          this.addPhoneToDisputeRole({
            disputeId: id,
            disputeRoleId: disputeRole.id || disputeRole.disputeRoleId,
            value
          }).then(() => {
            this.$jusNotification({
              title: 'Yay!',
              message: 'Nº de Telefone adicionada.',
              type: 'success'
            })
          }).catch(error => {
            this.$jusNotification({ error })
          }).finally(this.$forceUpdate)
        } else {
          message = 'Este telefone já esta em uso.'
        }
      }
      if (message) {
        this.$jusNotification({
          title: 'Yay!',
          message: message,
          type: 'success'
        })
      }
    },

    addNewDocumentNumber(disputeRole, documentNumber) {
      const newRole = {
        ...disputeRole,
        documentNumber
      }
      this.$store.dispatch('editRole', {
        disputeId: this.$route.params.id,
        disputeRole: newRole
      }).then(() => {
        this.getDispute(this.$route.params.id)
        this.$jusNotification({
          title: 'Yay!',
          message: 'Documento Adicionado.',
          type: 'success'
        })
      }).catch(error => {
        this.$jusNotification({ error })
      })
    },

    validateDocumentNumber(_dialogVisibility) {
      if (!this.resumedState.hasDocumentNumber) {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Informe CPF/CNPJ.',
          type: 'warning',
          onClose: () => {
            if (this.$refs.documentNumber) {
              this.$refs.documentNumber.enableEdit()
            } else {
              this.startEditing('documentNumber')
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.jus-vexatious-alert {
  .el-popover__reference-wrapper {
    img {
      width: 20px;
    }
  }
}
</style>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.party-details {
  .party-details__edit {
    display: flex;
    justify-content: space-evenly;
    margin: 16px 0 0;

    .party-details__edit-button--danger {
      color: $--color-danger;
    }
  }

  .party-details__infoline {
    margin-top: 6px;
    line-height: normal;
    position: relative;

    .party-details__infoline-namesake-button {
      width: 100%;
      margin: 8px 0;
      background: #FF9300;
    }

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

    .party-details__icon-info-lawyer {
      display: flex;
      flex-direction: row;
      align-items: center;
      span {
        &:hover {
          color: $--color-primary;
        }
      }
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

<style lang="scss">
.party-details__info-popover-lawyer {
  width: 500px;
  min-height: 20vh;
  max-height: 50vh;
}
</style>
