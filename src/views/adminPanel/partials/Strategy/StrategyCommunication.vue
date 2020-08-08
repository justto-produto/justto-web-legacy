<template>
  <article class="strategy-communication">
    <ul class="strategy-communication__list" @click="loadCommunications = true">
      <el-popover
        title="Mensagens"
        :open-delay="200"
        placement="right-end"
        trigger="manual"
        v-model="openMessages"
      >
        <CommunicationPopover v-if="loadCommunications"
          ref="communicationsPopover"
          :triggers="triggers"
          :strategyId="strategyId"
          @edit-communication="handleEditTemplate"
        />

        <li
          slot="reference"
          class="strategy-communication__list-item"
          @click="openMessages = !openMessages"
        >
          <p>Mensagens</p>
          <div class="strategy-communication__email">
            <jus-icon
              icon="email"
              class="strategy-communication__icon"
            />
            {{ summary.emails || 0 }}
          </div>
          <span class="strategy-communication__sms">
            <jus-icon
              icon="sms"
              class="strategy-communication__icon"
            />
            {{ summary.sms || 0 }}
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
import { mapActions } from 'vuex'

export default {
  name: 'StrategyCommunication',
  components: {
    CommunicationEditor: () => import('./CommunicationEditor'),
    CommunicationPopover: () => import('./CommunicationPopover'),
  },
  props: {
    triggers: {
      type: Object,
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
      communication: {},
      editorDialogIsVisible: false,
      loadCommunications: false,
      openMessages: false
    }
  },
  computed: {
    summary() {
      if (this.triggers.ENGAGEMENT) {
        return {
          emails: this.triggers.ENGAGEMENT.communicationsTypeSummary.EMAIL,
          sms: this.triggers.ENGAGEMENT.communicationsTypeSummary.SMS,
        }
      } return { emails: 0, sms: 0 }
    },
  },
  methods: {
    ...mapActions(['getCommunicationTemplate']),

    handlePopoverClick() {
      console.log(this.openedPopover)
      this.openedPopover = !this.openedPopover
      console.log(this.openedPopover)
    },
    handleEditTemplate(communication) {
      this.getCommunicationTemplate({ communicationId: communication.id, strategyId: this.strategyId }).then(response => {
        this.communication = communication
        this.communicationToEdit = response
        this.editorDialogIsVisible = true
      })
    },

    handleEditCommunication(params) {
      console.log(params)
      this.$refs.communicationsPopover.handleCommunicationRecipient(params.communication, params.recipient)
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
