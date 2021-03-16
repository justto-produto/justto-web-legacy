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
        <component
          :is="tab.component.name"
          v-if="tab.component && activeTab === tab.name"
        />
      </el-tab-pane>
    </el-tabs>
    <div class="editor-container__after-tabs">
      <quick-reply v-if="activeTab === 'MESSAGES'" />
      <recipients class="editor-container__recipients" />
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import EDITOR_CONSTANTS from '@/constants/editor'

export default {
  components: {
    QuickReply: () => import('./partials/QuickReply'),
    recipients: () => import('./partials/Recipients'),
    messages: () => import('./partials/Messages'),
    notes: () => import('./partials/Notes')
  },
  computed: {
    ...mapGetters({
      activeTab: 'getActiveTab'
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
    }
  },
  methods: {
    ...mapActions([
      'setOmnichannelActiveTab'
    ]),
    setTab(tab, _event) {
      this.setOmnichannelActiveTab(tab.name)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.editor-container {
  border-top: 2px solid $--light-gray;
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
