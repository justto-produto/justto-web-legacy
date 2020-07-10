<template>
  <article class="strategy-communication">
    <ul class="strategy-communication__list">
      <el-popover
        v-for="(recipient, key, index) in recipients"
        :key="key + index"
        :title="recipient.name"
        :open-delay="200"
        placement="bottom-start"
        trigger="hover"
      >
        <CommunicationPopover
          :recipient="recipient"
          @edit-communication="handleEditCommunication"
        />

        <li
          slot="reference"
          class="strategy-communication__list-item"
        >
          <span class="strategy-communication__name">
            {{ recipient.name }}
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
      return this.concatedCommunications.filter(c => c && c.recipients.includes('PARTY'))
    },
    lowyerCommunications() {
      return this.concatedCommunications.filter(c => c && c.recipients.includes('LAWYER'))
    },
    recipients() {
      return {
        PARTY: {
          name: 'Parte',
          emails: this.partyCommunications.filter(c => c && ['EMAIL', 'EMAIL_CNA'].includes(c.type)).length,
          sms: this.partyCommunications.filter(c => c && c.type === 'SMS').length,
          communications: this.partyCommunications,
        },
        LAWYER: {
          name: 'Advogado',
          emails: this.lowyerCommunications.filter(c => c && ['EMAIL', 'EMAIL_CNA'].includes(c.type)).length,
          sms: this.lowyerCommunications.filter(c => c && c.type === 'SMS').length,
          communications: this.lowyerCommunications,
        },
      }
    },

    concatedCommunications() {
      if (this.communications.length) {
        let comm = []
        for (const c of this.communications) {
          comm = comm.concat(c.communications)
        }
        return comm
      } else {
        return []
      }
    },
  },
  methods: {
    handleEditCommunication(communication) {
      this.isVisible = true
      this.communicationData = communication
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
