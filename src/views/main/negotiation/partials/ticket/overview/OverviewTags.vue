<template>
  <article class="overview-tags">
    <el-popover
      v-if="showPopover"
      ref="main-popover"
      v-model="visible"
      width="310"
      trigger="manual"
      popper-class="overview-tags__popover"
      @show="getTags"
      @hide="resetFields"
    >
      <div v-loading="loading">
        <!-- ADICIONAR ETIQUETA -->
        <div v-if="!showForm">
          <el-select
            ref="selectTag"
            v-model="selectedTag"
            filterable
            placeholder="Buscar ou cadastrar nova etiqueta"
            class="overview-tags__select"
            popper-class="overview-tags__select-popper"
            @change="addTag"
          >
            <el-option
              v-for="tag in workspaceTags"
              :key="tag.id"
              :label="tag.name"
              :value="tag"
            >
              <el-tag
                :color="tag.color"
                :style="{ color: isDarkColor(tag.color) ? '#FFFFFF' : '#424242'}"
                class="overview-tags__option el-tag--etiqueta el-tag--etiqueta-select"
              >
                <div>
                  <i :class="`el-icon-${tag.icon}`" />
                  {{ tag.name }}
                </div>
                <i
                  class="el-icon-delete"
                  @click.stop.prevent="handleDeleteTag(tag.id)"
                />
              </el-tag>
            </el-option>
            <div slot="empty">
              <el-button
                type="text"
                class="overview-tags__add-button"
                size="small"
                @click="showNewTagForm"
              >
                <i class="el-icon-plus" /> Adicionar nova etiqueta
              </el-button>
            </div>
          </el-select>
        </div>
        <!-- NOVA ETIQUETA -->
        <div
          v-if="showForm"
          class="overview-tags__new-tag-form"
        >
          <div class="overview-tags__title">
            Nova etiqueta
          </div>
          <el-tag
            :color="tagForm.color"
            class="el-tag--new"
          >
            <i :class="`el-icon-${tagForm.icon}`" />
            <el-input
              v-model="tagForm.name"
              :maxlength="24"
              size="small"
              @keyup.enter.native="saveTag"
            />
            <el-popover
              trigger="hover"
              width="200"
              popper-class="overview-tags__edit-tag"
            >
              <div class="title">
                Personalizar etiqueta
              </div>
              <div class="icon">
                <i
                  v-for="icon in icons"
                  :key="icon"
                  :class="`el-icon-${icon}`"
                  @click="tagForm.icon = icon"
                />
              </div>
              <div class="color">
                <el-tag
                  v-for="color in colors"
                  :key="color"
                  :color="color"
                  class="el-tag--click"
                  @click="tagForm.color = color"
                />
              </div>
              <el-button
                slot="reference"
                type="text"
                icon="el-icon-more"
              />
            </el-popover>
          </el-tag>
          <div class="overview-tags__new-tag-actions">
            <el-button
              plain
              size="mini"
              @click="resetFields"
            >
              Cancelar
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="saveTag"
            >
              Adicionar
            </el-button>
          </div>
        </div>
      </div>
      <el-tag
        id="popoverTagReference"
        slot="reference"
        class="overview-tags__tag-button overview-tags__tag-button--is-first"
        @click="visible = !visible"
      >
        <i
          id="popoverTagReferenceIcon"
          class="el-icon-plus"
        />
      </el-tag>
    </el-popover>

    <el-tag
      v-for="tag in disputeTags.slice(-3).reverse()"
      :key="tag.id"
      :color="tag.color"
      :style="{ color: isDarkColor(tag.color) ? '#FFFFFF' : '#424242'}"
      :class="{
        'overview-tags__tag--inclusive-is-active': tag.activeType === 'inclusive',
        'overview-tags__tag--exclusive-is-active': tag.activeType === 'exclusive'
      }"
      class="overview-tags__tag el-tag--etiqueta el-tag--click"
      @click="nextTagState(tag.id)"
    >
      <i :class="`el-icon-${tag.icon}`" />
      <span class="overview-tags__label">{{ tag.name }}</span>

      <el-button
        type="text"
        icon="el-icon-delete-solid"
        size="small"
        class="overview-tags__button"
        @click.stop.prevent="handleDeleteTagWorkspaceDialog(tag)"
      />

      <el-button
        type="text"
        icon="el-icon-close"
        size="small"
        class="overview-tags__button"
        @click.stop.prevent="removeTag(tag.id)"
      />
    </el-tag>

    <el-popover
      v-if="disputeTags.length > 3"
      width="310"
      popper-class="overview-tags__all-tags"
      @show="getTags"
      @hide="resetFields"
    >
      <el-tag
        v-for="tag in disputeTags.slice(0, disputeTags.length - 3).reverse()"
        :key="tag.id"
        :color="tag.color"
        :style="{ color: isDarkColor(tag.color) ? '#FFFFFF' : '#424242'}"
        :class="{
          'overview-tags__tag--inclusive-is-active': tag.activeType === 'inclusive',
          'overview-tags__tag--exclusive-is-active': tag.activeType === 'exclusive'
        }"
        class="el-tag--etiqueta el-tag--click"
        @click="nextTagState(tag.id)"
      >
        <span>
          <i :class="`el-icon-${tag.icon}`" />
          {{ tag.name }}
        </span>
        <el-button
          type="text"
          icon="el-icon-close"
          size="small"
          @click.stop.prevent="removeTag(tag.id)"
        />
      </el-tag>
      <el-tag
        slot="reference"
        class="overview-tags__tag-button overview-tags__tag-button--is-last"
      >
        <i class="el-icon-more" />
      </el-tag>
    </el-popover>

    <!-- Remove tag from Workspace -->
    <el-dialog
      :visible.sync="deleteTagWorkspaceDialogVisible"
      :show-close="false"
      title="Remover etiqueta de todas as disputas?"
      custom-class="remove-tag-dialog"
      modal-append-to-body
      center
    >
      <h3>
        Deseja remover a etiqueta <b>&quot;{{ deleteTagWorkspaceForm.name || '' }}&quot;</b> de todas as disputas ou somente desta disputa?
      </h3>

      <span slot="footer">
        <el-button @click="handleDeleteTagWorkspace('cancel')">Cancelar</el-button>
        <el-button
          type="secondary"
          @click="handleDeleteTagWorkspace('all')"
        >
          Remover de todas
        </el-button>
        <el-button
          type="primary"
          @click="handleDeleteTagWorkspace('current')"
        >
          Somente desta disputa
        </el-button>
      </span>
    </el-dialog>
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { calcBrightness } from '@/utils'
const _ = require('lodash')

export default {
  name: 'OverviewTags',

  data: () => ({
    loading: false,
    visible: false,
    selectedTag: null,
    showForm: false,
    tagForm: {
      name: '',
      color: '',
      icon: ''
    },
    showPopover: true,
    deleteTagWorkspaceDialogVisible: false,
    deleteTagWorkspaceForm: {}
  }),

  computed: {
    ...mapGetters({
      ticketsQuery: 'getTicketsQuery',
      allColors: 'getTagsColors',
      icons: 'getTagsIcons',
      ticketTags: 'disputeTags'
    }),
    colors() {
      return this.allColors
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value)
    },
    filteredTags() {
      return this.ticketsQuery.tags
    },
    disputeId() {
      return this.$route.params.id
    },
    disputeTags: {
      get() {
        return this.ticketTags.map(t => {
          if (this.filteredTags && this.filteredTags.includes(t.id)) {
            t.activeType = 'inclusive'
          } else if (this.ticketsQuery.noTags && this.ticketsQuery.noTags.includes(t.id)) {
            t.activeType = 'exclusive'
          } else {
            t.activeType = ''
          }
          return t
        }).sort((a, b) => {
          if (!!a.activeType === !!b.activeType) {
            return 0
          } else if (!!a.activeType > !!b.activeType) {
            return 1
          } else {
            return -1
          }
        })
      },
      set(tags) {
        this.loading = true
        this.$store.dispatch('editDisputeTags', {
          disputeId: this.disputeId,
          data: tags
        }).then(() => {
          this.tagForm.name = ''
          this.showForm = false
          this.$store.dispatch('getWorkspaceTags')
        }).catch(error => {
          this.$jusNotification({ error })
        }).finally(() => {
          this.loading = false
          this.visible = false
        })
      }
    },
    workspaceTags() {
      return this.$store.getters.workspaceTags.filter(t => {
        return !this.disputeTags.map(t => t.id).includes(t.id)
      })
    }
  },

  mounted() {
    this.tagForm.color = this.colors[0]
    this.tagForm.icon = this.icons[0]
    window.addEventListener('click', this.closeOnCLick)
  },

  destroyed() {
    window.removeEventListener('click', this.closeOnCLick)
  },

  methods: {
    ...mapActions([
      'deleteTag',
      'setTicketsQuery',
      'getTickets',
      'getWorkspaceTags'
    ]),

    isDarkColor(color) {
      return calcBrightness(color) <= 175
    },

    getFontColor(bgColor) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(bgColor)
      const red = parseInt(result[1], 16).toFixed(4)
      const green = parseInt(result[2], 16).toFixed(4)
      const blue = parseInt(result[3], 16).toFixed(4)

      return ((red * 0.299 + green * 0.587 + blue * 0.114) / 255).toFixed(4) - 0.5
    },

    nextTagState(tagId) {
      const currentTags = _.cloneDeep(this.ticketsQuery.tags || [])
      const currentNoTags = _.cloneDeep(this.ticketsQuery.noTags || [])

      if (!currentTags.includes(tagId) && !currentNoTags.includes(tagId)) {
        this.setTagFilters(tagId, 'changeInclusive', currentTags, currentNoTags)
      } else if (currentTags.includes(tagId)) {
        this.setTagFilters(tagId, 'changeExclusive', currentTags, currentNoTags)
      } else if (currentNoTags.includes(tagId)) {
        this.unsetTagFilters(tagId, currentTags, currentNoTags)
      }
    },

    setTagFilters(tagId, command, currentTags, currentNoTags) {
      if (command === 'changeInclusive') {
        currentNoTags = currentNoTags.filter(t => t !== tagId)
        currentTags.push(tagId)
      }
      if (command === 'changeExclusive') {
        currentTags = currentTags.filter(t => t !== tagId)
        currentNoTags.push(tagId)
      }
      this.updateTagFilters(currentTags, currentNoTags)
    },

    unsetTagFilters(tagId, currentTags, currentNoTags) {
      currentNoTags = currentNoTags.filter(t => t !== tagId)
      currentTags = currentTags.filter(t => t !== tagId)
      this.updateTagFilters(currentTags, currentNoTags)
    },

    updateTagFilters(currentTags, currentNoTags) {
      this.setTicketsQuery({ key: 'tags', value: currentTags })
      this.setTicketsQuery({ key: 'noTags', value: currentNoTags })
      this.getTickets()
    },

    closeOnCLick(event) {
      if (
        !event.target.id.startsWith('popoverTagReference') &&
        !event.target.textContent.includes('Adicionar nova etiqueta')
      ) {
        this.visible = false
      }
    },

    saveTag() {
      if (this.tagForm.name) {
        // SEGMENT TRACK
        this.$jusSegment('Criação de TAG', {
          tagName: this.tagForm.name,
          tagIcon: this.tagForm.icon,
          tagColor: this.tagForm.color,
          page: this.$route.name
        })
        const disputeTags = JSON.parse(JSON.stringify(this.disputeTags))
        disputeTags.push(this.tagForm)
        this.disputeTags = disputeTags
      }
    },

    addTag(tag) {
      // SEGMENT TRACK
      this.$jusSegment('Vinculação de TAG', {
        tagName: this.tagForm.name,
        tagIcon: this.tagForm.icon,
        tagColor: this.tagForm.color,
        page: this.$route.name
      })
      const disputeTags = JSON.parse(JSON.stringify(this.disputeTags))
      disputeTags.push(tag)
      this.disputeTags = disputeTags
    },

    applyDeleteTag(tagId) {
      return this.deleteTag(tagId).then(() => {
        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: 'Tag excluída com sucesso.'
        })
      }, () => {
        this.$jusNotification({
          type: 'warning',
          title: 'Ops!',
          message: 'Não foi possível excluir a tag'
        })
      })
    },

    handleDeleteTag(tagId) {
      this.$confirm('Tem certeza que deseja exluir essa tag?', 'Excluír tag', {
        type: 'warning',
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar'
      }).then(() => this.applyDeleteTag(tagId))
    },

    removeTag(tagId) {
      // SEGMENT TRACK
      const tagToRemove = this.disputeTags.find(t => t.id === tagId)
      this.$jusSegment('Desvinculação de TAG', {
        tagName: tagToRemove.name,
        tagIcon: tagToRemove.icon,
        tagColor: tagToRemove.color,
        page: this.$route.name
      })
      this.disputeTags = this.disputeTags.filter(t => t.id !== tagId)
    },

    changeIcon(icon) {
      this.tagForm.icon = icon
    },

    changeColor(color) {
      this.tagForm.color = color
    },

    showNewTagForm() {
      this.tagForm.name = this.$refs.selectTag.selectedLabel.slice(0, 24)
      this.$nextTick(() => { this.showForm = true })
    },

    getTags() {
      // SEGMENT TRACK
      this.$jusSegment('Visualização de TAG', { page: this.$route.name })
      this.loading = true
      this.$store.dispatch('getWorkspaceTags').finally(() => {
        this.loading = false
        this.$refs.selectTag.focus()
      })
    },

    resetFields() {
      this.$nextTick(() => { this.showForm = false })
    },

    resetDeleteTagWorkspaceFields() {
      this.deleteTagWorkspaceDialogVisible = false
      this.deleteTagWorkspaceForm = {}
    },

    handleDeleteTagWorkspaceDialog(tag) {
      this.deleteTagWorkspaceDialogVisible = true
      this.deleteTagWorkspaceForm = { ...tag }
    },

    handleDeleteTagWorkspace(action) {
      if (action === 'all') {
        this.applyDeleteTag(this.deleteTagWorkspaceForm.id)
        this.removeTag(this.deleteTagWorkspaceForm.id)
      } else if (action === 'current') {
        this.removeTag(this.deleteTagWorkspaceForm.id)
      }

      this.resetDeleteTagWorkspaceFields()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

@mixin selected-tag($--border-color, $--icon-url) {
  border: 2px solid $--border-color;
  position: relative;
  padding: 0 9px;

  &::after {
    content: url($--icon-url);
    position: absolute;
    bottom: -3px;
    right: -3px;
    width: 12px;
    height: 12px;
  }
}

.overview-tags {
  display: flex;

  .overview-tags__tag {
    display: flex;
    align-items: center;
    max-width: 36px;
    transition: .2s ease-out;

    &--inclusive-is-active {
      @include selected-tag($--color-success, '/src/assets/icons/ic-checked.svg');
    }
    &--exclusive-is-active {
      @include selected-tag($--color-danger, '/src/assets/icons/ic-blocked.svg');
    }

    .overview-tags__label {
      overflow-x: hidden;
      white-space: nowrap;
      display: inline;
      text-overflow: ellipsis;
      width: 0px;
      flex: 1;
      margin-left: 2px;
    }

    .overview-tags__button {
      width: 0px;
      opacity: 0;
      border: none;
      transition: .2s ease-out;
    }

    &:hover {
      flex: 1;
      max-width: 260px;

      .overview-tags__button {
        width: 16px;
        opacity: 1;
      }
    }
  }

  .overview-tags__tag-button {
    margin: 3px;
    height: 28px;
    line-height: 28px;
    &:--is-first { margin-left: 0; }
    &:--is-last { margin-right: 0; }
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

@mixin selected-tag($--border-color, $--icon-url) {
  border: 2px solid $--border-color;
  position: relative;
  padding: 0 9px;
  &::after {
    content: url($--icon-url);
    position: absolute;
    z-index: 10;
    bottom: -3px;
    right: -3px;
    width: 12px;
    height: 12px;
  }
}

.remove-tag-dialog {
  .el-dialog__body {
    h3 {
      text-align: center;
      word-break: keep-all;
    }
  }
}

.overview-tags__all-tags {
  padding: 10px;

  .overview-tags__tag {
    display: flex;
    align-items: center;
    max-width: 36px;
    transition: .2s ease-out;

    &--inclusive-is-active {
      @include selected-tag($--color-success, '/src/assets/icons/ic-checked.svg');
    }
    &--exclusive-is-active {
      @include selected-tag($--color-danger, '/src/assets/icons/ic-blocked.svg');
    }
  }
}

.overview-tags {
  // width: 100%;
  &__popover {
    padding: 10px;
  }
  &__select {
    width: 100%;
  }
  &__select-popper {
    width: 310px;
    margin-left: -10px;
    .el-select-dropdown__list {
      padding-top: 10px;
      padding-right: 10px;
    }
    .el-select-dropdown__item {
      padding: 0 10px;
      height: 32px;
      line-height: 32px;
    }
    .el-scrollbar__bar.is-vertical {
      opacity: 1;
      width: 8px;
      .el-scrollbar__thumb {
        background-color: #c8c8c8;
      }
    }
  }
  &__add-button {
    padding: 10px;
    font-size: 13px;
    .el-icon-plus {
      margin-right: 2px;
    }
  }
  &__open-button {
    cursor: pointer;
    margin: 3px;
    height: 28px;
    line-height: 28px;
  }
  &__title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
  }
  &__new-tag-form {
    padding: 10px 5px;
  }

  &__new-tag-actions {
    text-align: right;
    margin-top: 16px;
  }
  &__edit-tag {
    padding: 10px 12px;
    text-align: center;
    .title {
      font-size: 15px;
      font-weight: 600;
    }
    .icon, .color {
      padding-top: 15px;
      display: flex;
      flex-wrap: wrap;
      margin: -2px;
    }
    .icon i {
      cursor: pointer;
      flex: 1 0 17%;
      padding: 5px;
    }
    .color .el-tag {
      flex: 1 0 17%;
      margin: 2px;
    }
  }
}

.overview-tags__option {
  display:  flex;
  justify-content: space-between;

  .el-icon-delete {
    margin-left: 2px;
    visibility: hidden;
    &:hover { font-weight: bold; }
  }

  &:hover .el-icon-delete {
    visibility: visible;
  }
}

.overview-tags__select-popper {
  .el-scrollbar {
    .el-select-dropdown__wrap.el-scrollbar__wrap {
      .el-scrollbar__view.el-select-dropdown__list {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .el-select-dropdown__item {
          display: flex;
          width: 100%;

          .overview-tags__option {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
