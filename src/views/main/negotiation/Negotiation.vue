<template>
  <main class="negotiations-container">
    <span
      v-shortkey="['ctrl', 'm']"
      @shortkey="theAction"
    />
    <Tickets
      :class="{ 'hide-section': $route.params.id }"
      class="negotiations-container__tickets"
    />

    <section
      :class="{ 'hide-section': !$route.params.id }"
      class="negotiations-container__ticket"
    >
      <router-view v-if="$route.params.id" />
      <EmptyTicket v-else />
    </section>
  </main>
</template>

<script>
import { eventBus } from '@/utils'

export default {
  name: 'Negotiation',
  components: {
    Tickets: () => import('./partials/tickets/Tickets'),
    EmptyTicket: () => import('./partials/ticket/TicketEmpty')
  },
  methods: {
    theAction(_) {
      eventBus.$emit('NEGOTIATION_SHORCUT_EDITOR_FOCUS')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.negotiations-container {
  display: flex;
  overflow: hidden;
  flex: 1;

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
      max-width: 100%;
      border-right: none;
    }

    .negotiations-container__ticket {
      width: 100%;
      max-width: 100%;
    }
  }
}
</style>
