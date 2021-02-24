<template>
  <article class="party-details">
    <PopoverLinkInlineEditor
      v-if="!party.roles.includes('NEGOTIATOR')"
      v-model="party.polarity"
      :options="roleOptions"
      :width="200"
      label="Trocar polaridade"
      class="party-details__infoline-data"
      @change="updatePolarity"
    />

    <div class="party-details__infoline">
      <span class="party-details__infoline-label">Nome completo:</span>
      <TextInlineEditor
        v-model="party.name"
        filter="ownName"
        class="party-details__infoline-data"
        @change="updateName"
      />
    </div>
    <div
      v-if="party.documentNumber"
      class="party-details__infoline"
    >
      <span class="party-details__infoline-label">{{ documentType }}:</span>
      <TextInlineEditor
        v-model="party.documentNumber"
        :mask="['###.###.###-##', '##.###.###/####-##']"
        filter="cpfCnpj"
        class="party-details__infoline-data"
        @change="updateDocument"
      />
    </div>
    <div
      v-if="party.phonesDto && party.phonesDto.length"
      class="party-details__infoline"
    >
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
        @click="selectContact($event, 'phone')"
      />
    </div>
    <div
      v-if="party.emailsDto && party.emailsDto.length"
      class="party-details__infoline"
    >
      <span class="party-details__infoline-label">Emails:</span>
      <PartyContacts
        :contacts="party.emailsDto"
        model="address"
        @change="(...args)=>updateContacts(...args, 'email')"
        @delete="removeContact($event, 'email')"
        @click="selectContact($event, 'email')"
      />
    </div>
    <div
      v-if="party.oabsDto && party.oabsDto.length"
      class="party-details__infoline"
    >
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
      />
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
    PartyContacts: () => import('./PartyContacts')
  },
  props: {
    party: {
      type: Object,
      required: true
    }
  },
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
      'deleteTicketOverviewPartyContact',
      'setTicketOverviewPartyContact',
      'setTicketOverviewParty',
      'setTicketOverviewPartyPolarity'
    ]),
    updatePolarity(rolePolarity) {
      const params = {
        disputeId: this.disputeId,
        roleId: this.party.disputeRoleId,
        rolePolarity
      }

      this.setTicketOverviewPartyPolarity(params)
    },
    updateName(value) {
      const { disputeId, party } = this
      const data = party.legacyDto
      data.name = value

      this.setTicketOverviewParty({ disputeId, data })
    },
    updateDocument(value) {
      const { disputeId, party } = this
      const data = party.legacyDto
      data.documentNumber = value

      this.setTicketOverviewParty({ disputeId, data })
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
      this.removeContact(contactId, contactType)
      this.addContact(contactValue, contactType)
    },
    removeContact(contactId, contactType) {
      const { disputeId, party } = this
      const params = {
        roleId: party.disputeRoleId,
        disputeId,
        contactId,
        contactType
      }

      this.deleteTicketOverviewPartyContact(params)
    },
    selectContact(contactValue, contactType) {
      console.log(contactValue, contactType)
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
      margin: 3px 0 3px 18px;
      line-height: normal;
    }
  }
}
</style>