<template>
  <jus-view-main
    :loading-container="false"
    full-screen
    class="billing-view">
    <template slot="main">
      <JusTransactionsTable :transactions="transactions"/>
    </template>
  </jus-view-main>
</template>

<script>
export default {
  name: 'BillingDashboard',
  components: {
    JusTransactionsTable: () => import('@/components/tables/JusTransactionsTable'),
  },
  data() {
    return {
      transactions: [
        {
          occurredDate: [
            2020,
            3,
            30,
          ],
          note: null,
          type: 'SETTLED_DISPUTE',
          respondent: 'Delta Air Lines, Inc',
          code: '0012036-69.2019.8.19.0207',
          referenceId: 15955,
          externalId: null,
          value: 9999999.00,
        },
        {
          occurredDate: [
            2020,
            3,
            30,
          ],
          note: null,
          type: 'SETTLED_DISPUTE',
          respondent: 'DELTA AIR LINES, INC. - CITIBANK DTVM SA',
          code: '0062493-39.2019.8.17.8201',
          referenceId: 24532,
          externalId: null,
          value: 12.00,
        },
        {
          occurredDate: [
            2020,
            3,
            30,
          ],
          note: null,
          type: 'SETTLED_DISPUTE',
          respondent: 'Air Canada',
          code: '0710153-36.2020.8.07.0016',
          referenceId: 29185,
          externalId: null,
          value: 12.00,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.billing-view {}
</style>
