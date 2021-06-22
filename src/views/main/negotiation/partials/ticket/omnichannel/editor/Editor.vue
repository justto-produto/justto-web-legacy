<template>
  <section
    id="editorOmnichannelNegotiation"
    class="editor-container"
    :class="activeTab"
  >
    <el-tabs
      class="editor-container__tabs"
      :value="activeTab"
      @tab-click="setTab"
    >
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label"
      >
        <JusDragArea>
          <component
            :is="tab.component.name"
            v-if="tab.component && activeTab === tab.name"
            :focus-on-startup.sync="needFocus"
            :is-in-pre-negotiation="isPreNegotiation"
          />
        </JusDragArea>
      </el-tab-pane>
    </el-tabs>
    <div
      v-if="!isPreNegotiation"
      class="editor-container__after-tabs"
    >
      <quick-reply
        v-if="activeTab === 'MESSAGES'"
        :show-title="!haveRecipients"
      />
      <!-- ADICIONAR O ICONE AQUI -->
      <recipients class="editor-container__recipients" />
    </div>
  </section>
</template>

<script>
import { eventBus } from '@/utils'
import { mapActions, mapGetters } from 'vuex'
import EDITOR_CONSTANTS from '@/constants/editor'
import events from '@/constants/negotiationEvents'
import ticketPreNegotiation from '@/utils/mixins/ticketPreNegotiation'

export default {
  components: {
    JusDragArea: () => import('@/components/JusDragArea/JusDragArea'),
    QuickReply: () => import('./partials/QuickReply'),
    recipients: () => import('./partials/Recipients'),
    messages: () => import('./partials/Messages'),
    notes: () => import('./partials/Notes')
  },

  mixins: [ticketPreNegotiation],

  data: () => ({
    needFocus: false
  }),

  computed: {
    ...mapGetters({
      activeTab: 'getActiveTab',
      recipients: 'getEditorRecipients'
    }),

    tabs() {
      return [
        {
          name: EDITOR_CONSTANTS.MESSAGES,
          label: this.$tc('negotiation.ticket.omnichannel.editor.tab.message', 1),
          component: {
            name: 'messages',
            props: {}
          }
        },
        {
          name: EDITOR_CONSTANTS.NOTES,
          label: this.$tc('negotiation.ticket.omnichannel.editor.tab.note', 1),
          component: {
            name: 'notes',
            props: {}
          }
        },
        {
          name: EDITOR_CONSTANTS.OCCURRENCES,
          label: this.$tc('negotiation.ticket.omnichannel.editor.tab.occurrence', 1),
          component: null
        }
      ]
    },

    haveRecipients() {
      return this.recipients.length > 0
    }
  },

  mounted() {
    eventBus.$on(events.EDITOR_FOCUS.callback, this.validateTabOnBeforeFocus)
  },

  beforeDestroy() {
    eventBus.$off(events.EDITOR_FOCUS.callback, this.validateTabOnBeforeFocus)
  },

  methods: {
    ...mapActions([
      'setOmnichannelActiveTab'
    ]),

    setTab(tab, _event) {
      this.setOmnichannelActiveTab(tab.name)
    },

    validateTabOnBeforeFocus() {
      if (this.activeTab === 'OCCURRENCES') {
        this.setOmnichannelActiveTab('MESSAGES').finally(_ => {
          this.needFocus = true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.editor-container {
  border-top: 2px solid $--color-light-gray;
  height: auto;
}
</style>

<style lang="scss">
.editor-container {
  .el-tabs__header {
    margin-bottom: 0px !important;

    @media (max-height: 780px) {
      .el-tabs__nav {
        .el-tabs__item {
          line-height: 30px;
          height: auto;
        }
      }
    }
  }
}

.editor-container {
  position: relative;

  .editor-container__tabs {
    flex: 1;
  }

  .editor-container__after-tabs {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    padding-left: 312px;
    padding-right: 12px;
    height: 48px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    @media (max-height: 780px) {
      height: 36px;
    }
  }

  .el-tabs__item {
    padding: 0 18px !important;
  }
  .el-tabs__nav-wrap:after {
    display: none;
  }
}
</style>
