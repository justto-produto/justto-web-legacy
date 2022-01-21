<template>
  <article class="strategy-communication">
    <ul
      class="strategy-communication__list"
      @click="setActiveStrategy(strategyId)"
    >
      <el-popover
        :value="showPopover"
        :open-delay="200"
        placement="right-end"
        trigger="manual"
      >
        <div class="strategy-communication__popover-header">
          <span class="strategy-communication__title-popover">Mensagens</span>
          <i
            class="el-icon-close strategy-communication__close-icon"
            @click="setActiveStrategy(null)"
          />
        </div>
        <CommunicationPopover
          v-if="showPopover"
          ref="communicationsPopover"
          :triggers="triggers"
          :strategy-id="strategyId"
          @edit-communication="handleEditTemplate"
        />

        <li
          slot="reference"
          class="strategy-communication__list-item"
        >
          <p>Mensagens</p>
          <div class="strategy-communication__email">
            <jus-icon
              icon="email"
              class="strategy-communication__icon"
            />
            {{ summary.emails || 0 }}
          </div>
          <span
            v-if="summary.sms || !summary.phoneCalls"
            class="strategy-communication__sms"
          >
            <jus-icon
              icon="sms"
              class="strategy-communication__icon"
            />
            {{ summary.sms || 0 }}
          </span>
          <span
            v-else
            class="strategy-communication__sms"
          >
            <jus-icon
              icon="phone"
              class="strategy-communication__icon"
            />
            {{ summary.phoneCalls || 0 }}
          </span>
        </li>
      </el-popover>
    </ul>

    <CommunicationEditor
      :template-to-edit="communicationToEdit"
      :strategy-id="strategyId"
      :communication="communication"
      :visible.sync="editorDialogIsVisible"
      @change-communication-recipient="handleEditCommunication"
    />
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'StrategyCommunication',
  components: {
    CommunicationEditor: () => import('./CommunicationEditor'),
    CommunicationPopover: () => import('./CommunicationPopover')
  },
  props: {
    triggers: {
      type: Object,
      default: () => []
    },
    strategyId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      communicationToEdit: {},
      communication: {},
      editorDialogIsVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'activeStrategy'
    ]),
    summary() {
      if (this.triggers?.ENGAGEMENT) {
        return {
          emails: this.triggers?.ENGAGEMENT?.communicationsTypeSummary?.EMAIL || 0,
          sms: this.triggers?.ENGAGEMENT?.communicationsTypeSummary?.SMS || 0,
          phoneCalls: this.triggers?.ENGAGEMENT?.communicationsTypeSummary?.PHONE_CALL
        }
      } return { emails: 0, sms: 0 }
    },
    showPopover: {
      get() {
        return this.activeStrategy === this.strategyId
      },
      set(val) {}
    }
  },
  methods: {
    ...mapActions([
      'getCommunicationTemplate',
      'setActiveStrategy'
    ]),
    handlePopoverClick() {
      this.openedPopover = !this.openedPopover
    },
    handleEditTemplate(communication) {
      this.getCommunicationTemplate({ communicationId: communication.id, strategyId: this.strategyId }).then(response => {
        this.communication = communication
        this.communicationToEdit = response
        this.editorDialogIsVisible = true
      })
    },
    handleEditCommunication(params) {
      this.$refs.communicationsPopover.handleCommunicationRecipient(params.communication, params.recipient)
    },

    translateRecipientName(name) {
      return this.$options.filters.capitalize(this.$t(`recipients.${name}`))
    }
  }
}
</script>

<style lang="scss" scopped>
@import '@/styles/colors.scss';

.strategy-communication__popover-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: $--color-text-secondary;

  .strategy-communication__close-icon:hover {
    cursor: pointer;
    color: $--color-text-primary;
  }

  .strategy-communication__title-popover {
    font-weight: bold;
  }
}

.strategy-communication {
  color: $--color-text-primary;

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
