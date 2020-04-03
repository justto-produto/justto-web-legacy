<template lang="html">
  <div class="jus-tags">
    <el-tag
      v-for="tag in disputeTags"
      :key="tag.id"
      :color="tag.color"
      class="el-tag--etiqueta">
      <i :class="`el-icon-${tag.icon}`"/>
      {{ tag.name }}
      <el-button type="text" icon="el-icon-close" size="mini" @click="removeTag(tag.id)" />
    </el-tag>
    <el-popover
      v-model="visible"
      width="400"
      trigger="manual"
      @show="getTags"
      @hide="resetFields">
      <div v-loading="loading">
        <button type="button" class="el-dialog__headerbtn jus-tags__close" @click="visible = false">
          <i class="el-dialog__close el-icon el-icon-close" />
        </button>
        <!-- ADICIONAR ETIQUETA -->
        <div v-if="!showForm">
          <div class="jus-tags__title">Adicionar etiqueta</div>
          <el-select
            ref="selectTag"
            v-model="selectedTag"
            filterable
            placeholder="Buscar"
            class="jus-tags__select"
            @change="addTag">
            <el-option
              v-for="tag in workspaceTags"
              :key="tag.id"
              :label="tag.label"
              :value="tag">
              <el-tag
                :color="tag.color"
                class="el-tag--etiqueta el-tag--etiqueta-select">
                <i :class="`el-icon-${tag.icon}`"/>
                {{ tag.name }}
              </el-tag>
            </el-option>
            <div slot="empty">
              <el-button type="text" class="jus-tags__add-button" size="small" @click="showNewTagForm">
                <i class="el-icon-plus" /> Adicionar nova tag
              </el-button>
            </div>
          </el-select>
        </div>
        <!-- NOVA ETIQUETA -->
        <div v-if="showForm" class="mt20">
          <div class="jus-tags__title">Nova etiqueta</div>
          <el-tag :color="tagForm.color" class="jus-tags__new-tag">
            <el-dropdown class="jus-tags__select-icon" @command="changeIcon">
              <span><i :class="`el-icon-${tagForm.icon}`"/></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="icon in icons"
                  :key="icon"
                  :command="icon">
                  <i :class="`el-icon-${icon}`"/>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-input
              v-model="tagForm.name"
              :maxlength="24"
              size="small"
              class="jus-tags__name"
              @keyup.enter.native="saveTag"/>
            <el-dropdown class="jus-tags__select-color" @command="changeColor">
              <span><i class="el-icon-brush"/></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="color in colors"
                  :key="color"
                  :command="color"
                  :style="{ backgroundColor: color, color: 'transparent' }">
                  {{ color }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tag>
          <!-- <div class="jus-tags__new-tag-actions">
            <el-button plain size="mini" @click="tagForm = false">Cancelar</el-button>
            <el-button type="primary" size="mini" @click="saveTag">Adicionar</el-button>
          </div> -->
        </div>
        <!-- ETIQUETAS DA DISPUTA -->
        <div v-if="disputeTags.length" class="jus-tags__list">
          <div class="jus-tags__title">Etiquetas da disputa</div>
          <el-tag
            v-for="tag in disputeTags"
            :key="tag.id"
            :color="tag.color"
            class="el-tag--etiqueta el-tag--etiqueta-list">
            <i :class="`el-icon-${tag.icon}`"/>
            {{ tag.name }}
            <el-button type="text" icon="el-icon-close" size="mini" @click="removeTag(tag.id)" />
          </el-tag>
        </div>
      </div>
      <el-tooltip slot="reference" content="Adicionar etiqueta">
        <el-tag class="jus-tags__open-button" @click="visible = !visible">
          <i class="el-icon-plus" />
        </el-tag>
      </el-tooltip>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'JusTags',
  data () {
    return {
      loading: false,
      visible: false,
      selectedTag: null,
      showForm: false,
      tagForm: {
        name: '', color: '', icon: ''
      }
    }
  },
  computed: {
    disputeTags: {
      get () {
        return this.$store.getters.disputeTags
      },
      set (tags) {
        this.loading = true
        this.$store.dispatch('editDisputeTags', {
          disputeId: this.$store.getters.disputeId,
          data: tags
        }).then(() => {
          this.tagForm.name = ''
          this.showForm = false
        }).catch(error => {
          this.$jusNotification({ error })
        }).finally(() => {
          this.loading = false
        })
      }
    },
    workspaceTags () {
      return this.$store.getters.workspaceTags.filter(t => {
        return !this.disputeTags.map(t => t.id).includes(t.id)
      })
    },
    colors () {
      return this.$store.state.tagModule.colors
    },
    icons () {
      return this.$store.state.tagModule.icons
    }
  },
  mounted () {
    this.tagForm.color = this.colors[0]
    this.tagForm.icon = this.icons[0]
  },
  methods: {
    saveTag () {
      if (this.tagForm.name) {
        // SEGMENT TRACK
        this.$jusSegment('Criação de TAG', {
          tagName: this.tagForm.name,
          tagIcon: this.tagForm.icon,
          tagColor: this.tagForm.color,
          page: this.$route.name
        })
        let disputeTags = JSON.parse(JSON.stringify(this.disputeTags))
        disputeTags.push(this.tagForm)
        this.disputeTags = disputeTags
      }
    },
    addTag (tag) {
      // SEGMENT TRACK
      this.$jusSegment('Vinculação de TAG', {
        tagName: this.tagForm.name,
        tagIcon: this.tagForm.icon,
        tagColor: this.tagForm.color,
        page: this.$route.name
      })
      let disputeTags = JSON.parse(JSON.stringify(this.disputeTags))
      disputeTags.push(tag)
      this.disputeTags = disputeTags
    },
    removeTag (tagId) {
      // SEGMENT TRACK
      let tagToRemove = this.disputeTags.find(t => t.id === tagId)
      this.$jusSegment('Desvinculação de TAG', {
        tagName: tagToRemove.name,
        tagIcon: tagToRemove.icon,
        tagColor: tagToRemove.color,
        page: this.$route.name
      })
      this.disputeTags = this.disputeTags.filter(t => t.id !== tagId)
    },
    changeIcon (icon) {
      this.tagForm.icon = icon
    },
    changeColor (color) {
      this.tagForm.color = color
    },
    showNewTagForm () {
      this.tagForm.name = this.$refs.selectTag.selectedLabel.slice(0, 24)
      this.$nextTick(() => {
        this.showForm = true
      })
    },
    getTags () {
      // SEGMENT TRACK
      this.$jusSegment('Visualização de TAG', { page: this.$route.name })
      this.loading = true
      this.$store.dispatch('getWorkspaceTags').finally(() => {
        this.loading = false
      })
    },
    resetFields () {
      this.showForm = false
    }
  }
}
</script>

<style lang="scss">
.jus-tags {
  width: 100%;
  margin: 2px 0 5px;
  &__select {
    width: 100%;
  }
  &__add-button {
    padding: 10px;
  }
  &__open-button {
    cursor: pointer;
    margin: 3px;
    margin-left: 3px;
  }
  &__list {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    .el-tag--etiqueta {
      margin: 3px 0;
    }
  }
  &__title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
  }
  &__new-tag {
    width: 100%;
    padding: 4px 10px;
    height: auto;
    display: flex;
  }
  &__new-tag-actions {
    text-align: right;
    margin-top: 10px;
  }
  &__select-icon, &__select-color {
    color: rgba(247, 247, 247, 0.6);
    cursor: pointer;
    font-size: 20px;
  }
  &__select-color {
    border: 1px solid rgba(247, 247, 247, 0.6);
    border-radius: 4px;
    padding: 0px 6px;
  }
  &__name .el-input__inner {
    font-size: 18px;
    color: rgba(247, 247, 247, 0.8);
    background-color: transparent;
    border: 0;
    font-weight: 600;
  }
  &__pick-color {
    flex-direction: column;
    align-items: center;
    width: auto;
    padding: 10px;
    .el-color-predefine {
      width: auto;
    }
    .el-color-dropdown__main-wrapper,
    .el-color-dropdown__value,
    .el-color-dropdown__link-btn {
      display: none;
    }
  }
  &__close {
    top: 12px;
    right: 22px;
  }
}
</style>
