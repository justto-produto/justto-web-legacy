<template>
  <section
    class="interaction-container"
    :class="`${interaction.direction} ${type}`">
    <div class="interaction-container__out-avatar show-only-md">
      <JusAvatarUser v-bind="avatarProps" />
    </div>
    <div
      class="interaction-container__balloon"
      :class="interaction.direction">
      <div class="interaction-container__balloon-avatar show-only-sm">
        <JusAvatarUser v-bind="avatarProps" />
      </div>
      <div class="interaction-container__balloon-content">
        <component
          :is="type"
          :value="interaction"
        />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  components: {
    COMMUNICATION: () => import('./partials/Communication'),
    NEGOTIATOR: () => import('./partials/Negotiator')
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    type() {
      return this.value.interaction.type.split('_')[0]
    },
    interaction() {
      return this.value.interaction
    },
    personName() {
      return this.interaction.properties.PERSON_NAME
    },
    isInboundInteraction() {
      return this.interaction.direction === 'INBOUND'
    },
    avatarProps() {
      return {
        name: this.personName,
        size: 'md',
        purple: this.isInboundInteraction
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.interaction-container {
  display: flex;
  gap: 16px;

  height: auto;
  margin: 10px 24px 0px 24px;

  &.INBOUND {
    flex-direction: row;
  }

  &.OUTBOUND {
    flex-direction: row-reverse;
  }

  &.COMMUNICATION {
    .interaction-container__balloon {
      border: 5px solid #DFF4FE;
    }
  }

  &.NEGOTIATOR, &.MANUAL {
    .interaction-container__balloon {
      border: 1px solid #FFC5A5;
    }
  }

  .interaction-container__balloon {
    background: #FFFFFF 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #47454526;
    border-radius: 18px;
    padding: 12px;

    display: flex;
    flex-direction: row;
    gap: 16px;

    &.INBOUND {
      flex-direction: row;
    }

    &.OUTBOUND {
      flex-direction: row-reverse;
    }
  }
}
</style>
