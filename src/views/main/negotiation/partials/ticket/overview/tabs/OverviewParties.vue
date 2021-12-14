<template>
  <section class="overview-parties">
    <a
      v-if="contactsMetadataCount"
      class="overview-parties__associated-contacts"
      @click="resetAssociatedContracts()"
    >
      {{ $tc('dispute.overview.label.contact-found', contactsMetadataCount, { count: contactsMetadataCount }) }} {{ $t('dispute.overview.label.in-the-attachments') }}
    </a>
    <div class="overview-parties__list">
      <el-collapse
        v-model="activeCollapseItem"
        accordion
        @change="getPartyDetails"
      >
        <PartyResumed
          v-for="party in (!isAllPartiesVisible ? ticketParties : filteredTicketParties)"
          :key="party.disputeRoleId"
          :active-collapse-item="activeCollapseItem"
          :party="party"
          @addRecipient="$emit('addRecipient', $event)"
        />
      </el-collapse>
      <div class="overview-parties__link">
        <a
          v-if="ticketParties.length > filteredTicketParties.length"
          @click="toggleVisibleParties"
        >
          {{ isAllPartiesVisible ? `Ver mais (+${ticketParties.length - filteredTicketParties.length})` : 'Ver menos' }}
        </a>
      </div>
    </div>

    <el-button
      v-if="!isPreNegotiation"
      type="primary"
      size="small"
      icon="el-icon-plus"
      @click="addParty"
    >
      Cadastrar parte
    </el-button>

    <DisputeAddRole
      :visible.sync="newPartyDialogVisible"
      :dispute-id="disputeId"
      :document-numbers="concatedPartiesDocumentNumbers"
      :oabs="concatedPartiesOabs"
    />
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import preNegotiation from '@/utils/mixins/ticketPreNegotiation'

export default {
  name: 'OverviewParties',

  components: {
    PartyResumed: () => import('./parties/PartyResumed'),
    DisputeAddRole: () => import('@/views/main/dispute/partials/DisputeAddRole')
  },

  mixins: [preNegotiation],

  data: () => ({
    activeCollapseItem: null,
    isAllPartiesVisible: false,
    loadedCollapseItems: [],
    newPartyDialogVisible: false
  }),

  computed: {
    ...mapGetters({
      ticketParties: 'getTicketOverviewParties',
      metadata: 'getTicketMetadata'
    }),

    filteredTicketParties() {
      return this.ticketParties.filter(party => {
        return !(party.polarity === 'RESPONDENT' && party.roles.includes('LAWYER'))
      })
    },

    disputeId() {
      return Number(this.$route.params.id)
    },

    contactsMetadataCount() {
      const { phones, emails } = this.metadata
      return phones.length + emails.length
    },

    concatedPartiesDocumentNumbers() {
      return this.ticketParties
        .filter(party => party.documentNumber)
        .map(party => party.documentNumber)
    },

    concatedPartiesOabs() {
      const filteredOabs = this.ticketParties
        .filter(party => party.oabs && party.oabs.length)

      if (filteredOabs.length) {
        return filteredOabs
          .map(party => party.oabs.map(oab => oab.number + oab.state))
          .reduce((acc, cur) => [...acc, ...cur])
      } else return []
    }
  },

  watch: {
    'disputeId'(disputeId) {
      this.loadedCollapseItems = []
      this.activeCollapseItem = null
    }
  },

  methods: {
    ...mapActions([
      'getTicketOverviewParty',
      'setDisputeProperty',
      'getAssociatedContacts'
    ]),

    resetAssociatedContracts() {
      this.setDisputeProperty({
        key: 'CONTATOS ASSOCIADOS',
        disputeId: this.disputeId,
        value: 'NAO'
      }).then(() => {
        this.getAssociatedContacts(this.disputeId)
      })
    },

    getPartyDetails(collapseItem) {
      const { disputeId, loadedCollapseItems } = this

      if (collapseItem && !loadedCollapseItems.includes(collapseItem)) {
        this.getTicketOverviewParty({ disputeId, disputeRoleId: collapseItem })
          .then(() => loadedCollapseItems.push(collapseItem))
      }
    },

    toggleVisibleParties() {
      this.isAllPartiesVisible = !this.isAllPartiesVisible
    },

    addParty() {
      this.newPartyDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.overview-parties {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  gap: 10px;

  .overview-parties__associated-contacts {
    margin-bottom: -12px;
    margin-top: 12px;
  }

  .overview-parties__list {
    overflow-y: auto;
    overflow-x: hidden;

    .overview-parties__link {
      margin: 6px 0;
      text-align: center;
    }

    .el-collapse .el-collapse-item {
      border-bottom: 1px solid #dcdfe6;
      &:last-child { border-bottom: none; }
    }
  }
}
</style>
