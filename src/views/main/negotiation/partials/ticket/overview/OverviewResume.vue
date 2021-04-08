<template>
  <article class="overview-resume__container">
    <el-table
      :data="[ticket]"
      style="width: 100vw"
    >
      <el-table-column
        prop="disputeId"
        label="DIsputa"
        align="center"
      />
      <el-table-column
        prop="code"
        label="Número do processo"
        align="center"
      />
      <el-table-column
        align="center"
      />
    </el-table>

    <el-collapse>
      <PartyResumed
        v-for="(item, itemIndex) in parties"
        :key="`partie-${itemIndex}`"
        :party="item"
        hide-arrows
      />
      <PartyResumed
        v-for="(item, itemIndex) in lawyers"
        :key="`lawyer-${itemIndex}`"
        :party="item"
        hide-arrows
      />
      <PartyResumed
        v-for="(item, itemIndex) in negotiators"
        :key="`negotiator-${itemIndex}`"
        :party="item"
        hide-arrows
      />
    </el-collapse>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    PartyResumed: () => import('./tabs/parties/PartyResumed')
  },

  computed: {
    ...mapGetters({
      ticket: 'getTicketOverview',
      ticketParties: 'getTicketOverviewParties'
    }),

    disputeId() {
      return '#' + this.$route.params.id
    },

    processNumber() {
      return this.ticket?.code || ''
    },

    parties() {
      return this.ticketParties.filter(({ polarity, roles }) => (polarity === 'CLAIMANT' && roles.includes('PARTY')))
    },

    lawyers() {
      return this.ticketParties.filter(({ polarity, roles }) => (polarity === 'CLAIMANT' && roles.includes('LAWYER')))
    },

    negotiators() {
      return this.ticketParties.filter(({ roles }) => roles.includes('NEGOTIATOR'))
    }
  }
}
</script>

<style lang="scss" scoped>
  .overview-resume__container {
    margin: 8px 16px;
  }
</style>
