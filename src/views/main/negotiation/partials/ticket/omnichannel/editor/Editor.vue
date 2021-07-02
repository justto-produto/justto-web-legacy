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
      <div class="editor-container__after-tabs-align">
        <quick-reply
          v-if="activeTab === 'MESSAGES'"
          :show-title="!haveRecipients"
        />
        <el-popover
          placement="bottom"
          width="305"
          trigger="click"
        >
          <div class="editor-container__after-tabs-align-popover">
            <strong
              class="editor-container__after-tabs-align-popover-strong"
            >
              Dica importante!
            </strong>
            <span
              class="editor-container__after-tabs-align-popover-span"
            >
              Sabia que você <br> pode customizar suas mensagens rápidas?
            </span>
            <br>
            <strong
              class="editor-container__after-tabs-align-popover-button"
              @click="isVisibleSlider = true"
            >
              CLIQUE AQUI
            </strong>
            <span
              class="editor-container__after-tabs-align-popover-span"
            >
              e saiba como fazer!
            </span>
          </div>
          <div
            slot="reference"
            class="editor-container__after-tabs-info"
          >
            ?
          </div>
        </el-popover>
      </div>
      <recipients class="editor-container__recipients" />
    </div>
    <SlideInfo
      :images="itemsSlider"
      :is-visible="isVisibleSlider"
      @close="isVisibleSlider = false"
    />
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
    notes: () => import('./partials/Notes'),
    SlideInfo: () => import('@/components/dialogs/SlideInfo')
  },

  mixins: [ticketPreNegotiation],

  data: () => ({
    needFocus: false,
    isVisibleSlider: false,
    itemsSlider: [
      {
        title: 'Customizando suas mensagens rápidas',
        src: 'https://storage.googleapis.com/justto_app/conteudos/customizando-mensagens1.png'
      },
      {
        title: 'Customizando suas mensagens rápidas',
        src: 'https://storage.googleapis.com/justto_app/conteudos/customizando-mensagens-2.png'
      },
      {
        title: 'Customizando suas mensagens rápidas',
        src: 'https://storage.googleapis.com/justto_app/conteudos/customizando-mensagens3.png'
      }
    ]
  }),

  computed: {
    ...mapGetters({
      activeTab: 'getActiveTab',
      recipients: 'getEditorRecipients',
      isJusttoAdmin: 'isJusttoAdmin'
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
@import '@/styles/colors.scss';
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

    .editor-container__after-tabs-align {
      display: flex;
      flex-direction: row;
    }

    .editor-container__after-tabs-info {
      text-align: center;
      color: white;
      font-weight: bold;
      font-size: 16px;
      height: 20px;
      width: 20px;
      border-radius: 50px;
      background-color: $--color-primary;
      margin-top: 4px;
      margin-left: 10px;
    }
  }

  .el-tabs__item {
    padding: 0 18px !important;
  }
  .el-tabs__nav-wrap:after {
    display: none;
  }

}
.editor-container__after-tabs-align-popover {
  .editor-container__after-tabs-align-popover-span {
    font-size: 12px;
  }
  .editor-container__after-tabs-align-popover-strong {
    font-size: 12px;
  }

  .editor-container__after-tabs-align-popover-button {
    background-color: $--color-primary;
    color: white;
    padding: 1px 3px 3px 3px;
    border-radius: 4px;
    text-align: center;
    margin-right: 3px;
    cursor: pointer;
    font-size: 10px;
  }
}
</style>
