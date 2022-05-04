<template>
  <section
    id="headerTicketNegotiation"
    class="ticket-header-container"
  >
    <article class="ticket-header-container__title">
      <div class="ticket-header-container__process-code">
        <span>Processo:&nbsp;</span>

        <TicketCode
          :code="ticket.code"
          get-befor-mount
          class="ticket-header-container__process-link"
        />
      </div>

      <div
        class="ticket-header-container__overview-link"
        @click="handleShowOverview"
      >
        <span class="ticket-header-container__additional-info">Informações adicionais</span>

        <i class="ticket-header-container__additional-info-icon el-icon-arrow-right" />
      </div>
    </article>

    <TicketActions
      :ticket="ticket"
      class="ticket-header-container__actions"
    />

    <Dialer
      v-if="!isOverviewActive"
      class="ticket-header-container__dialer"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TicketHeader',

  components: {
    TicketCode: () => import('@/components/JusTimelineV2/TicketCode'),
    TicketActions: () => import('./TicketActions'),
    Dialer: () => import('@/views/main/dialer/Dialer')
  },

  props: {
    showOverview: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      ticket: 'getTicketOverview',
      innerWidth: 'getWindowWidth'
    }),

    isOverviewActive() {
      return this.innerWidth > 1200 ? !this.showOverview : this.showOverview
    }
  },

  methods: {
    handleShowOverview() {
      this.$emit('toggle-show-overview')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.ticket-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  height: auto;

  .ticket-header-container__title {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    font-weight: 600;
    color: $--color-text-primary;
    font-size: 18px;

    .ticket-header-container__overview-link {
      display: none;
    }
  }

  .ticket-header-container__dialer {
    border-radius: 6px;
    padding: 8px 2px;
    margin-left: 8px;
    border: solid lightgray thin;
    cursor: pointer;
  }
}

@media (max-height: 900px) {
  .ticket-header-container {
    padding: 8px 12px;

    .ticket-header-container__title {
    font-size: 16px;
    }
  }
}

@media (max-width: 1200px) {
  .ticket-header-container {
    .ticket-header-container__title {
      font-size: 14px;

      .ticket-header-container__process-code {
        margin-bottom: 6px;

        .ticket-header-container__process-link {
          font-size: 13px;
        }
      }

      .ticket-header-container__overview-link {
        color: $--color-primary;
        display: flex;
        align-items: center;

        .ticket-header-container__additional-info {
          text-decoration: underline;
        }

        .ticket-header-container__additional-info-icon {
          font-size: 16px;
          margin-top: 2px;
        }

        &:hover {
          cursor: pointer;
          color: $--color-primary-light-1;
        }
      }
    }
  }
}
</style>
