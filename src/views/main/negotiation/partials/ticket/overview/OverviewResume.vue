<template>
  <article class="overview-resume__container">
    <el-row
      type="flex"
      justify="center"
    >
      <el-col
        :span="6"
      >
        <h3>
          Disputa: {{ disputeId }}
        </h3>
      </el-col>
      <el-col
        :span="6"
      >
        <h3>
          Nº do processo: {{ processNumber }}
        </h3>
      </el-col>
    </el-row>
    <el-collapse>
      <PartyResumed
        v-for="(item, itemIndex) in parties"
        :key="`partie-${itemIndex}`"
        :party="item"
      />
      <PartyResumed
        v-for="(item, itemIndex) in lawyers"
        :key="`lawyer-${itemIndex}`"
        :party="item"
      />
      <PartyResumed
        v-for="(item, itemIndex) in negotiators"
        :key="`negotiator-${itemIndex}`"
        :party="item"
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
