<template>
  <article class="party-details">
    <div
      v-if="!party.roles.includes('NEGOTIATOR')"
      class="party-details__infoline party-details__infoline--center"
    >
      <PopoverLinkInlineEditor
        v-if="!party.roles.includes('NEGOTIATOR')"
        v-model="party.polarity"
        :options="roleOptions"
        :width="200"
        label="Trocar polaridade"
        @change="updatePolarity"
      />
    </div>

    <div class="party-details__infoline">
      <span class="party-details__infoline-label">Nome completo:</span>
      <TextInlineEditor
        v-model="party.name"
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
        :processed-date="$moment(party.birthday).fromNow(true)"
        :is-date-time-format="false"
        class="party-details__infoline-data"
        @change="updateParty($event, 'birthday')"
        @blur="stopEditing"
      />
      <div
        v-else
        class="party-details__infoline-link"
      >
        <a @click="startEditing('birthday')">Adicionar</a>
      </div>
    </div>

    <div class="party-details__infoline">
      <span class="party-details__infoline-label">{{ documentType }}:</span>
      <TextInlineEditor
        v-if="party.documentNumber || activeAddingData === 'documentNumber'"
        ref="documentNumber"
        v-model="party.documentNumber"
        :mask="['###.###.###-##', '##.###.###/####-##']"
        filter="cpfCnpj"
        class="party-details__infoline-data"
        @change="updateParty($event, 'documentNumber')"
      />
      <div
        v-else
        class="party-details__infoline-link"
      >
        <a @click="startEditing('documentNumber')">Adicionar</a>
      </div>
    </div>
    <div class="party-details__infoline">
      <span class="party-details__infoline-label">Telefones:</span>
      <PartyContacts
        :contacts="party.phonesDto"
        filter="phoneNumber"
        model="number"
        :mask="[
          '####-####',
          '#####-####',
          '(##) ####-####',
          '(##) #####-####',
          '+## (##) ####-####',
          '+## (##) #####-####'
        ]"
        @change="(...args)=>updateContacts(...args, 'phone')"
        @delete="removeContact($event, 'phone')"
        @post="addContact($event, 'phone')"
        @click="(...args)=>selectContact(...args, 'whatsapp')"
      />
    </div>
    <div class="party-details__infoline">
      <span class="party-details__infoline-label">Emails:</span>
      <PartyContacts
        :contacts="party.emailsDto"
        model="address"
        @change="(...args)=>updateContacts(...args, 'email')"
        @delete="removeContact($event, 'email')"
        @post="addContact($event, 'email')"
        @click="(...args)=>selectContact(...args, 'email')"
      />
    </div>
    <div class="party-details__infoline">
      <span class="party-details__infoline-label">Oab:</span>
      <PartyContacts
        :contacts="mappedOabs"
        filter="oab"
        model="fullOab"
        :mask="[
          '##d.###/AA',
          '##.###/AA',
        ]"
        @change="(...args)=>updateContacts(...args, 'oab')"
        @delete="removeContact($event, 'oab')"
        @post="addContact($event, 'oab')"
      />
    </div>
    <div
      v-if="!party.roles.includes('NEGOTIATOR')"
      class="party-details__infoline party-details__infoline--center"
    >
      <a
        class="party-details__infoline-link party-details__infoline-link--danger"
        @click="removeParty"
      >
        Excluir
      </a>
    </div>
  </article>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'PartyDetails',
  components: {
    PopoverLinkInlineEditor: () => import('@/components/inputs/PopoverLinkInlineEditor'),
    TextInlineEditor: () => import('@/components/inputs/TextInlineEditor'),
    DateInlieEditor: () => import('@/components/inputs/DateInlieEditor'),
    PartyContacts: () => import('./PartyContacts')
  },
  props: {
    party: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    activeAddingData: ''
  }),
  computed: {
    disputeId() {
      return Number(this.$route.params.id)
    },
    documentType() {
      return this.party.documentNumber?.length <= 14 ? 'CPF' : 'CNPJ'
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
      })
    }
  },
  methods: {
    ...mapActions([
      'addRecipient',
      'setTicketOverviewParty',
      'deleteTicketOverviewParty',
      'setTicketOverviewPartyPolarity',
      'setTicketOverviewPartyContact',
      'deleteTicketOverviewPartyContact',
      'updateTicketOverviewPartyContact'
    ]),
    startEditing(key) {
      this.activeAddingData = key
      this.$forceUpdate()
      this.$nextTick(() => {
        setTimeout(() => {
          this.$forceUpdate()
          this.$refs[key].enableEdit()
        }, 10)
      })
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
      const { disputeId, party } = this
      this.$confirm('Tem certeza que deseja excluir est parte da dispute? Está ação é irreversível', 'Atenção', {
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
    },
    addContact(contactValue, contactType) {
      const { disputeId, party } = this
      const params = {
        roleId: party.disputeRoleId,
        disputeId,
        contactType,
        contactData: { value: contactValue }
      }

      if (contactType === 'oab') {
        delete params.contactData.value
        const oabSplited = contactValue.split('/')
        params.contactData.number = oabSplited[0]
        params.contactData.state = oabSplited[1]
      }

      this.setTicketOverviewPartyContact(params)
    },
    updateContacts(contactId, contactValue, contactType) {
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
      this.addRecipient({ value, key, type })
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

    .party-details__infoline-label {
      line-height: normal;
      font-size: 13px;
      color: $--color-text-secondary;
    }

    .party-details__infoline-data,
    .party-details__infoline-link {
      line-height: normal;
      margin: 3px 0 3px 18px;
      &--danger {
        color: $--color-danger;
        &:hover { color: $--color-danger-light-3 }
      }
    }

    &--center {
      font-size: 13px;
      display: flex;
      justify-content: center;
      margin: 3px 0;
    }
  }
}
</style>
