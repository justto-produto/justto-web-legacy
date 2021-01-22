<template>
  <main class="negotiations-container">
    <Tickets
      :class="$route.params.id ? 'hide-section' : ''"
      class="negotiations-container__tickets"
    />

    <section
      :class="!$route.params.id ? 'hide-section' : ''"
      class="negotiations-container__ticket"
    >
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
  display: flex;
  height: 100vh;

  .negotiations-container__tickets {
    width: 360px;
    border-right: 1px solid $--light-gray;
  }

  .negotiations-container__ticket {
    flex: 1;
  }
}

@media (max-width: 900px) {
  .negotiations-container {
    .hide-section {
      display: none;
    }

    .negotiations-container__tickets {
      width: 100%;
    }

    .negotiations-container__ticket {
      width: 100%;
    }
  }
}
</style>
