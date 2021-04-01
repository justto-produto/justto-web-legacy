<template>
  <article>
    <el-popover
      ref="quickReplyPopover"
      title="Respostas rápidas"
      trigger="click"
      placement="top"
      popper-class="dispute-view__templates-popover"
      class="dispute-view__templates"
      @hide="openTemplateMenu(null)"
    >
      <ul
        v-if="templates.length"
        class="dispute-view__templates-list"
      >
        <li
          v-for="template in templates"
          :key="template.template.referenceTemplateId"
          class="dispute-view__templates-list-item"
        >
          <div
            class="dispute-view__templates-item-title"
            @click="setTemplate(template)"
          >
            <jus-icon
              :icon="template.template.contentType === 'HTML' ? 'email' : 'whatsapp'"
              class="dispute-view__templates-list-icon"
            />
            {{ template.template.title }}
          </div>
          <el-popover
            :value="activeTemplateMenu === template.template.referenceTemplateId"
            trigger="manual"
            placement="right"
            popper-class="dispute-view__templates-option-popover"
            class="dispute-view__templates-item-options"
            @mouseleave="openTemplateMenu(null)"
          >
            <div
              class="dispute-view__templates-item-option"
              @click="openEditTemplateDialog(template.template)"
            >
              <i class="icon el-icon-edit" /> Editar
            </div>
            <div
              class="dispute-view__templates-item-option"
              @click="resetQuickReplyTemplate({ templateId: template.template.referenceTemplateId, disputeId: id }); openTemplateMenu(null)"
            >
              <i class="icon el-icon-refresh-left" /> Restaurar
            </div>
            <div
              class="dispute-view__templates-item-option"
              @click="archiveTemplate(template.template.referenceTemplateId); openTemplateMenu(null)"
            >
              <i class="icon el-icon-delete" /> Excluir
            </div>
            <el-button
              slot="reference"
              type="text"
              class="dispute-view__templates-item-menu"
              @click="openTemplateMenu(template.template.referenceTemplateId)"
            >
              <i class="el-icon-more" />
            </el-button>
          </el-popover>
        </li>
      </ul>
      <span
        v-else
        class="dispute-view__templates-list-empty"
      >
        Não há templates para esta estratégia
      </span>
      <el-button
        slot="reference"
        size="mini"
        class="dispute-view__templates-button"
      >
        <jus-icon
          class="dispute-view__templates-button-icon"
          icon="zap"
        />
        <span
          v-if="showTitle"
          class="dispute-view__templates-button-text"
        >
          Respostas rápidas
        </span>
      </el-button>
    </el-popover>
    <el-dialog
      :visible.sync="editTemplateQuickReply.visible"
      append-to-body
      width="40%"
      @close="closeEditTemplateDialog()"
    >
      <dispute-quick-reply-editor
        :dispute-id="disputeId"
        :template="editTemplateQuickReply.template"
        @cancel="closeEditTemplateDialog()"
        @input="setTemplate($event)"
        @update="getQuickReplyTemplates(disputeId)"
      />
    </el-dialog>
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    DisputeQuickReplyEditor: () => import('@/components/layouts/DisuteQuickReplyEditor')
  },
  props: {
    showTitle: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    activeTemplateMenu: null,
    editTemplateQuickReply: {
      visible: false,
      template: {}
    }
  }),
  computed: {
    ...mapGetters({
      templates: 'quickReplyTemplates'
    }),

    disputeId() {
      return Number(this.$route?.params?.id || '0')
    }
  },
  methods: {
    ...mapActions([
      'setEditorText',
      'setMessageType',
      'getQuickReplyTemplates',
      'resetQuickReplyTemplate',
      'archiveQuickReplyTemplate'
    ]),

    hideMainPopover() {
      this.$refs.quickReplyPopover.showPopper = false
    },

    setTemplate(template) {
      const { contentType, body } = template.parsed
      this.setMessageType(contentType)
      this.setEditorText(body)
      this.$emit('input', body)
      this.hideMainPopover()
    },

    openTemplateMenu(templateId) {
      this.activeTemplateMenu = this.activeTemplateMenu === templateId ? null : templateId
    },

    archiveTemplate(templateId) {
      this.archiveQuickReplyTemplate(templateId)
      this.getQuickReplyTemplates(this.$route.params.id).then(_ => {}).catch(_ => {})
    },

    closeEditTemplateDialog() {
      this.editTemplateQuickReply = {
        visible: false,
        template: {}
      }
    },

    openEditTemplateDialog(template) {
      this.editTemplateQuickReply = {
        visible: true,
        template
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.dispute-view__templates {
  .dispute-view__templates-button > span {
    display: flex;
    gap: 12px;

    .dispute-view__templates-button-icon {
      width: 10px !important;
      margin: 0px;
    }
  }

}

.dispute-view__templates-item-option {
  cursor: pointer;
}

.dispute-view__templates-list {
  list-style: none;
  margin: 0;
  padding: 0;

  .dispute-view__templates-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    .dispute-view__templates-item-title {
      padding: 8px 20px;
      flex: 1;

      .dispute-view__templates-list-icon {
        margin-right: 6px;
        margin-bottom: -2px;
      }
    }

    .dispute-view__templates-item-options {
      .dispute-view__templates-item-menu {
        padding: 0;
        visibility: hidden;
        &:focus { visibility: visible; }

        .el-icon-more {
          color: $--color-text-primary;
          margin-right: 20px;
          cursor: pointer;
          transform: rotate(90deg);
          &:hover { color: $--color-primary; }
        }
      }

    }

    &:hover {
      background-color: #fafafa;

      & .dispute-view__templates-item-menu {
        visibility: visible;
      }
    }
  }
}
</style>
