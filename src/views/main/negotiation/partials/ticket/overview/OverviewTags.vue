<template lang="html">
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
        id="idTag"
        slot="reference"
        class="overview-tags__tag-button overview-tags__tag-button--is-first"
        @click="visible = !visible"
      >
        <i class="el-icon-plus" />
      </el-tag>
    </el-popover>

    <el-tag
      v-for="tag in disputeTags.slice(-3).reverse()"
      :key="tag.id"
      :color="tag.color"
      class="overview-tags__tag el-tag--etiqueta el-tag--click"
      @click="filterByTag(tag.id)"
    >
      <i :class="`el-icon-${tag.icon}`" />
      <span class="overview-tags__label">{{ tag.name }}</span>
      <el-button
        type="text"
        icon="el-icon-close"
        size="small"
        class="overview-tags__button"
        @click.stop.prevent="removeTag(tag.id)"
      />
    </el-tag>

    <el-popover
      v-if="disputeTags.length > 4"
      width="310"
      popper-class="overview-tags__all-tags"
      @show="getTags"
      @hide="resetFields"
    >
      <el-tag
        v-for="tag in disputeTags.slice(0, disputeTags.length - 3).reverse()"
        :key="tag.id"
        :color="tag.color"
        class="el-tag--etiqueta el-tag--click"
        @click="filterByTag(tag.id)"
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
  </article>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'OverviewTags',
  data: () => ({
    loading: false,
    visible: false,
    selectedTag: null,
    showForm: false,
    tagForm: {
      name: '', color: '', icon: ''
    },
    showPopover: true
  }),
  computed: {
    disputeId() {
      return this.$route.params.id
    },
    disputeTags: {
      get() {
        return this.$store.getters.disputeTags
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
    },
    colors() {
      return this.$store.state.tagModule.colors
    },
    icons() {
      return this.$store.state.tagModule.icons
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
      'getTickets'
    ]),

    closeOnCLick(e) {
      if (!e.target.id.startsWith('idTag') && !e.target.textContent.includes('Adicionar nova etiqueta')) {
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
    handleDeleteTag(tagId) {
      this.$confirm('Tem certeza que deseja exluir essa tag?', 'Excluír tag', {
        type: 'warning',
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar'
      }).then(() => {
        this.deleteTag(tagId).then(() => {
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
      })
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
    filterByTag(tagId) {
      this.setTicketsQuery({ key: 'tags', value: [tagId] })
      this.getTickets()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.overview-tags {
  display: flex;

  .overview-tags__tag {
    display: flex;
    align-items: center;
    max-width: 36px;
    transition: .2s ease-out;

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

.overview-tags__all-tags {
  padding: 10px;
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
      flex: 1 0 31%;
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
</style>
