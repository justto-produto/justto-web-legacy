<template>
  <article>
    <el-popover
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
            <div @click="openEditTemplateDialog(template.template)">
              <i class="el-icon-edit" /> Editar
            </div>
            <div @click="resetQuickReplyTemplate({ templateId: template.template.referenceTemplateId, disputeId: id }); activeTemplateMenu = null">
              <i class="el-icon-refresh-left" /> Restaurar
            </div>
            <div @click="archiveTemplate(template.template.referenceTemplateId); activeTemplateMenu = null">
              <i class="el-icon-delete" /> Excluir
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
      </el-button>
    </el-popover>
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data: () => ({
    activeTemplateMenu: null
  }),
  computed: {
    ...mapGetters({
      templates: 'quickReplyTemplates'
    })
  },
  methods: {
    ...mapActions([
      'getQuickReplyTemplates',
      'resetQuickReplyTemplate',
      'archiveQuickReplyTemplate'
    ]),
    setTemplate(template) {
      console.log(template)
    },
    openTemplateMenu(templateId) {
      this.activeTemplateMenu = this.activeTemplateMenu === templateId ? null : templateId
    },
    archiveTemplate(templateId) {
      this.archiveQuickReplyTemplate(templateId)
      this.getQuickReplyTemplates(this.$route.params.id)
    },
  }
}
</script>

<style lang="scss" scoped>
.dispute-view__templates-button-icon {
  width: 10px !important;
  margin: 0px;
}
</style>
