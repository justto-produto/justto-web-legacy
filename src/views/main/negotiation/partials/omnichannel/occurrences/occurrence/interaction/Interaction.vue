<template>
  <section
    class="interaction-container"
    :class="`${interaction.direction} ${type}`">
    <div class="interaction-container__out-avatar show-only-md">
      <JusAvatarUser v-bind="avatarProps" />
    </div>
    <div
      class="interaction-container__balloon"
      :class="`${interaction.direction} ballon-${messageType}`">
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
    NEGOTIATOR: () => import('./partials/Negotiator'),
    MANUAL: () => import('./partials/Manual')
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
    messageType() {
      const mapCommunicationTypes = {
        EMAIL: 'email',
        WHATSAPP: 'whatsapp',
        NEGOTIATOR_MESSAGE: 'negotiatior'
      }
      if (this.interaction?.message?.communicationType) {
        const { communicationType } = this.interaction.message
        if (Object.keys(mapCommunicationTypes).includes(communicationType)) {
          return mapCommunicationTypes[communicationType]
        }
      }
      return 'default'
    },
    interaction() {
      return this.value.interaction
    },
    personName() {
      if (this.type === 'MANUAL') {
        return this.interaction?.properties?.USER
      }

      if (this.interaction?.properties?.PERSON_NAME) {
        return this.interaction.properties.PERSON_NAME
      } else if (this.interaction?.message?.parameters?.SENDER_NAME) {
        return this.interaction.message.parameters.SENDER_NAME
      }
      return ''
    },
    isInboundInteraction() {
      return this.interaction.direction === 'INBOUND'
    },
    avatarProps() {
      return {
        name: this.personName,
        size: 'md',
        purple: this.isInboundInteraction && this.type !== 'MANUAL'
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

  &.MANUAL {
    flex-direction: row-reverse;
  }

  .interaction-container__balloon {
    overflow-x: hidden;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #47454526;
    max-width: 80%;
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

    &.ballon-email {
      border-color: #DFF4FE;
    }

    &.ballon-negotiatior {
      border-color: #f4be72;
    }

    &.ballon-whatsapp {
      border-color: #85eb94;
    }
  }

}
</style>
