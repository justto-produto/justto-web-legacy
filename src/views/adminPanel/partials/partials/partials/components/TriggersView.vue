<template>
  <article class="trigger-view">
    <div
      v-for="(value, triggerKey) in triggers"
      :key="triggerKey"
      class="trigger-view__item"
    >
      <p class="trigger-view__item-title">
        Mensagens
      </p>

      <div class="trigger-view__item-communications">
        <span class="trigger-view__item-communications__indicator">
          {{ summary.emails }}

          <jus-icon
            icon="email"
            class="trigger-view__item-communications__indicator__icon"
          />
        </span>

        <span class="trigger-view__item-communications__indicator">
          {{ summary.sms }}

          <jus-icon
            icon="sms"
            class="trigger-view__item-communications__indicator__icon"
          />
        </span>

        <span class="trigger-view__item-communications__indicator">
          {{ summary.phoneCalls }}

          <jus-icon
            icon="phone"
            class="trigger-view__item-communications__indicator__icon"
          />
        </span>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    triggers: {
      type: Object,
      required: true
    }
  },

  computed: {
    summary() {
      if (this.triggers?.ENGAGEMENT) {
        return {
          emails: this.triggers?.ENGAGEMENT?.communicationsTypeSummary?.EMAIL || 0,
          sms: this.triggers?.ENGAGEMENT?.communicationsTypeSummary?.SMS || 0,
          phoneCalls: this.triggers?.ENGAGEMENT?.communicationsTypeSummary?.PHONE_CALL || 0
        }
      } return { emails: 0, sms: 0 }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';
.trigger-view {
  margin-top: 4px;

  .trigger-view__item {
    display: flex;
    flex-direction: column;
    border: none;
    border-radius: 1rem;
    padding: 4px 0 8px;
    gap: 8px;
    background-color: $--color-primary-light-9;

    .trigger-view__item-title {
      text-transform: capitalize;
      text-align: center;
      margin: 0;
    }

    .trigger-view__item-communications {
      display: flex;
      gap: 4px;
      justify-content: space-evenly;
      align-items: center;

      .trigger-view__item-communications__indicator {
        display: flex;
        gap: 2px;
      }
    }
  }
}
</style>
