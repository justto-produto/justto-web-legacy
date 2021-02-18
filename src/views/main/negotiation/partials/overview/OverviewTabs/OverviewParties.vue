<template>
  <section class="overview-parties">
    <el-collapse
      v-model="activeCollapseItem"
      accordion
      @change="getPartyDetails"
    >
      <PartyResumed
        v-for="party in ticketParties"
        :key="party.disputeRoleId"
        :active-collapse-item="activeCollapseItem"
        :party="party"
      />
    </el-collapse>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'OverviewParties',
  components: {
    PartyResumed: () => import('./OverviewParties/PartyResumed')
  },
  data: () => ({
    activeCollapseItem: null,
    loadedCollapseItems: []
  }),
  computed: {
    ...mapGetters({
      ticketParties: 'getTicketOverviewParties'
    }),
    disputeId() {
      return Number(this.$route.params.id)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.overview-parties {
  .el-collapse {
    .el-collapse-item {
      border-bottom: 1px solid #dcdfe6;
      &:last-child { border-bottom: none; }
    }
  }
}
</style>
