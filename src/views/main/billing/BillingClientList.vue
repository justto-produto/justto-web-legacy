<template>
  <jus-view-main>
    <div
      slot="main"
      class="billing-client-list"
    >
      <client-grid />
    </div>
  </jus-view-main>
</template>

<script>
export default {
  name: 'BillingCLientList',
  components: {
    ClientGrid: () => import('./partials/ClientGrid')
  }
}
</script>
