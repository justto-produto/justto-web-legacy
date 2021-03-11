<template lang="html">
  <article class="jus-tags">
    <el-popover
      v-if="showPopover"
      ref="main-popover"
      v-model="visible"
      width="310"
      trigger="manual"
      popper-class="jus-tags__popover"
      :placement="placement"
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
            class="jus-tags__select"
            popper-class="jus-tags__select-popper"
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
                class="jus-tags__option el-tag--etiqueta el-tag--etiqueta-select"
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
                class="jus-tags__add-button"
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
          class="jus-tags__new-tag-form"
        >
          <div class="jus-tags__title">
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
              popper-class="jus-tags__edit-tag"
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
          <div class="jus-tags__new-tag-actions">
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
      <el-tooltip
        id="idTagTooltip"
        slot="reference"
        content="Adicionar etiqueta"
      >
        <el-tag
          id="idTag"
          class="jus-tags__open-button"
          @click="visible = !visible"
        >
          <i
            id="idTagIcon"
            class="el-icon-plus"
          />
        </el-tag>
      </el-tooltip>
    </el-popover>

    <el-tag
      v-for="tag in disputeTags.slice(-4).reverse()"
      :key="tag.id"
      :color="tag.color"
      class="el-tag--etiqueta el-tag--click"
    >
      <div @click="filterByTag(tag.id)">
        <i :class="`el-icon-${tag.icon}`" />
        {{ tag.name }}
      </div>
      <el-button
        type="text"
        icon="el-icon-close"
        size="small"
        @click.prevent="removeTag(tag.id)"
      />
    </el-tag>

    <el-popover
      v-if="disputeTags.length > 4"
      ref="main-popover"
      width="310"
      popper-class="jus-tags__popover"
      :placement="placement"
      @show="getTags"
      @hide="resetFields"
    >
      <el-tag
        v-for="tag in disputeTags.slice(0, disputeTags.length - 4).reverse()"
        :key="tag.id"
        :color="tag.color"
        class="el-tag--etiqueta el-tag--click"
      >
        <div @click="filterByTag(tag.id)">
          <i :class="`el-icon-${tag.icon}`" />
          {{ tag.name }}
        </div>
        <el-button
          type="text"
          icon="el-icon-close"
          size="small"
          @click.prevent="removeTag(tag.id)"
        />
      </el-tag>
      <el-tag
        id="idTag"
        slot="reference"
        class="jus-tags__open-button"
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
    placement() {
      return this.$store.getters.windowHeight >= 580 ? 'bottom' : this.$store.getters.windowHeight >= 520 ? 'left' : 'top'
    },
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
  watch: {
    placement() {
      this.showPopover = false
      this.visible = false
      this.$nextTick(() => {
        this.showPopover = true
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
    ...mapActions(['deleteTag']),

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
      this.$store.commit('clearDisputeQuery')
      this.$store.commit('updateDisputeQuery', { key: 'status', value: [] })
      this.$store.commit('updateDisputeQuery', { key: 'tags', value: [tagId] })
      this.$store.commit('setDisputesTab', '9')
      this.$router.push('/management/all')
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.jus-tags {
  width: 100%;
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

.jus-tags__option {
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
