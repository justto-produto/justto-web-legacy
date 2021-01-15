<template>
  <main class="negotiations-container">
    <Tickets class="negotiations-container__tickets" />

    <section class="negotiations-container__ticket">
      <router-view v-if="$route.params.id" />
      <EmptyTicket v-else />
    </section>
  </main>
</template>

<script>
export default {
  name: 'Negotiation',
  components: {
    Tickets: () => import('./partials/tickets/Tickets'),
    EmptyTicket: () => import('./partials/EmptyTicket')
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.negotiations-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 100vh;
  background-color: $--color-white;
  overflow-x: hidden;
}
</style>

<style lang="scss">
.el-main {
  overflow-x: hidden;
}
</style>
