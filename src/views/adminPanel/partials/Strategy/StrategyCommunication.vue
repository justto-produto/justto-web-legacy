<template>
  <article class="strategy-communication">
    <ul class="strategy-communication__list">
      <el-popover
        title="Mensagens"
        :open-delay="200"
        placement="bottom-start"
        trigger="click"
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
            Mensagens
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

    <CommunicationEditor
      :communication-template="communicationToEdit"
      :strategy-id="strategyId"
      :communication-id="activeCommunicationId"
      :communication-name="communicationName"
      :visible.sync="editorDialogIsVisible"
    />
  </article>
</template>

<script>
import { mapActions } from 'vuex'

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
      communicationToEdit: {},
      activeCommunicationId: 0,
      communicationName: '',
      editorDialogIsVisible: false,
    }
  },
  computed: {
    recipient() {
      return {
        emails: this.communications.filter(c => c && ['EMAIL', 'EMAIL_CNA'].includes(c.type)).length,
        sms: this.communications.filter(c => c && c.type === 'SMS').length,
        communications: this.communications,
      }
    },
  },
  methods: {
    ...mapActions(['getCommunicationTemplate']),

    handleEditCommunication(communicationId, communicationName) {
      this.getCommunicationTemplate({ communicationId, strategyId: this.strategyId }).then(response => {
        this.communicationName = communicationName
        this.activeCommunicationId = communicationId
        this.communicationToEdit = response
        this.editorDialogIsVisible = true
      })
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
