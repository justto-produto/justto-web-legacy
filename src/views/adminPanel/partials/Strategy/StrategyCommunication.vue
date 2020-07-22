<template>
  <article class="strategy-communication">
    <ul class="strategy-communication__list">
      <el-popover
        v-for="(recipient, key, index) in recipients"
        :key="key + index"
        :title="translateRecipientName(recipient.name)"
        :open-delay="200"
        placement="bottom-start"
        trigger="hover"
      >
        <CommunicationPopover
          :recipient="recipient"
          :strategyId="strategyId"
          @edit-communication="handleEditCommunication"
        />

        <li
          slot="reference"
          class="strategy-communication__list-item"
        >
          <span class="strategy-communication__name">
            {{ translateRecipientName(recipient.name) }}
          </span>
          <div class="strategy-communication__email">
            <jus-icon
              icon="email"
              class="strategy-communication__icon"
            />
            {{ recipient.emails }}
          </div>
          <span class="strategy-communication__sms">
            <jus-icon
              icon="sms"
              class="strategy-communication__icon"
            />
            {{ recipient.sms }}
          </span>
        </li>
      </el-popover>
    </ul>

    <communication-editor
      :communication-data="communication"
      :visible="editorIsVisible"
      :variables="variables"
    />
  </article>
</template>

<script>
export default {
  name: 'StrategyCommunication',
  components: {
    CommunicationEditor: () => import('./CommunicationEditor'),
    CommunicationPopover: () => import('./CommunicationPopover'),
  },
  props: {
    communications: {
      type: Array,
      default: () => [],
    },
    strategyId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      communicationData: null,
      isVisible: false,
      variables: {
        teste1: 'teste 1',
        teste2: 'teste 2',
      },
    }
  },
  computed: {
    editorIsVisible() {
      return this.isVisible
    },
    communication() {
      return this.communicationData
    },
    partyCommunications() {
      return this.communications.filter(c => c && (c.recipients.includes('PARTY') || c.type === 'DELAY'))
    },
    lawyerCommunications() {
      return this.communications.filter(c => c && (c.recipients.includes('LAWYER') || c.type === 'DELAY'))
    },
    recipients() {
      return {
        PARTY: {
          name: 'PARTY',
          emails: this.partyCommunications.filter(c => c && ['EMAIL', 'EMAIL_CNA'].includes(c.type)).length,
          sms: this.partyCommunications.filter(c => c && c.type === 'SMS').length,
          communications: this.partyCommunications,
        },
        LAWYER: {
          name: 'LAWYER',
          emails: this.lawyerCommunications.filter(c => c && ['EMAIL', 'EMAIL_CNA'].includes(c.type)).length,
          sms: this.lawyerCommunications.filter(c => c && c.type === 'SMS').length,
          communications: this.lawyerCommunications,
        },
      }
    },
  },
  methods: {
    handleEditCommunication(communication) {
      this.isVisible = true
      this.communicationData = communication
    },

    translateRecipientName(name) {
      return this.$options.filters.capitalize(this.$t(`recipients.${name}`))
    },
  },
}
</script>

<style lang="scss" scopped>
@import '@/styles/colors.scss';

.strategy-communication {
  color: $--color-text-regular;

  .strategy-communication__icon {
    width: 20px;
    position: relative;
    top: 2px;
    margin-right: 4px;
  }

  ul.strategy-communication__list {
    list-style-type: none;
    margin: 0;
    padding: 0;

    li.strategy-communication__list-item {
      align-items: center;
      background-color: $--color-primary-light-9;
      border-radius: 4px;
      cursor: pointer;
      display: grid;
      font-weight: 700;
      gap: 16px;
      grid-template-areas: 'name-area email-area sms-area';
      grid-template-columns: auto repeat(2, 56px);
      margin-bottom: 8px;
      padding: 8px 16px;
      width: 100%;

      .strategy-communication__name {
        font-weight: 400;
        grid-area: name-area;
      }

      .strategy-communication__email {
        grid-area: email-area;
      }

      .strategy-communication__sms {
        grid-area: sms-area;
      }
    }
  }
}
</style>
