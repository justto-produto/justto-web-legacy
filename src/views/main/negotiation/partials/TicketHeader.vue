<template>
  <section
    id="headerTicketNegotiation"
    class="ticket-header-container"
  >
    <article class="ticket-header-container__title">
      <span class="ticket-header-container__process-code">
        Processo:
        <JusTimeline code="123456987456" />
      </span>
    </article>
  </section>
</template>

<script>
export default {
  name: 'TicketHeader',
  components: {
    JusTimeline: () => import('@/components/JusTimeline/JusTimeline')
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.ticket-header-container {
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
  height: 60px;
  padding: 12px;
  line-height: 36px;

  .ticket-header-container__title {
    display: flex;
    align-items: center;
  }

  .ticket-header-container__process-code {
    color: $--color-text-secondary;
    font-size: 18px;
    font-weight: 600;
  }
}

@media (max-height: 680px) {
  .ticket-header-container {
    height: 40px;
  }
}

@media (max-width: 900px) {
  .ticket-header-container {
    .ticket-header-container__title {
      .ticket-header-container__icon-back {
        display: inline-block;
      }
    }
  }
}
</style>
