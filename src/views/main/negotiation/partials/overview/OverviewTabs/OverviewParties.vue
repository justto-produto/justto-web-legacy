<template>
  <section class="overview-parties">
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
      type="primary"
      size="medium"
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

export default {
  name: 'OverviewParties',
  components: {
    PartyResumed: () => import('./OverviewParties/PartyResumed'),
    DisputeAddRole: () => import('@/views/main/dispute/partials/DisputeAddRole')
  },
  data: () => ({
    activeCollapseItem: null,
    isAllPartiesVisible: false,
    loadedCollapseItems: [],
    newPartyDialogVisible: false
  }),
  computed: {
    ...mapGetters({
      ticketParties: 'getTicketOverviewParties'
    }),

    filteredTicketParties() {
      return this.ticketParties.filter(party => {
        return !(party.polarity === 'RESPONDENT' && party.roles.includes('LAWYER'))
      })
    },

    disputeId() {
      return Number(this.$route.params.id)
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
    }
  },
  methods: {
    ...mapActions([
      'getTicketOverviewParty'
    ]),

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
  gap: 10px;

  .overview-parties__list {
    overflow-y: auto;

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
