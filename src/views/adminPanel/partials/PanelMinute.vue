<template lang="html">
  <div class="panel-minute-view">
    <el-table
      v-loading="loadingMinutes"
      :key="tableKey"
      :data="filteredMinutes"
      width="100%">
      <el-table-column
        class-name="panel-minute-view__name"
        prop="name"
        label="Nome">
        <template slot-scope="props">
          <el-input
            v-show="props.row.editing"
            :ref="'input' + props.row.id"
            v-model="props.row.name"
            @keyup.enter.native="props.row.editing = false, editMinuteName(props.row)"
            @blur="props.row.editing = false, editMinuteName(props.row)" />
          <div
            v-show="!props.row.editing"
            class="label panel-minute-view__editable-label"
            @click="props.row.editing = true ,focusInput(props.row.id, props.row.name)">
            {{ props.row.name }}
            <jus-icon icon="edit" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        width="400px">
        <template
          slot="header"
          slot-scope="scope">
          <el-input
            v-model="search"
            placeholder="Buscar"/>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addMinute">
            Adicionar
          </el-button>
        </template>
        <template slot-scope="props">
          <el-button
            v-if="props.row.privateDocumentModel"
            content="Excluir"
            size="mini"
            type="danger"
            plain
            icon="el-icon-delete"
            @click="deleteMinute(props.row.id)">
            Excluir
          </el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            icon="el-icon-edit"
            @click="editMinute(props.row.url)">
            Editar documento
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="editDialogVisible"
      :width="width"
      :close-on-click-modal="false"
      :class="{ 'panel-minute-view__dialog--full': fullscreen, 'panel-minute-view__dialog--large': !fullscreen }"
      title="Editar minuta"
      class="panel-minute-view__dialog">
      <i
        :class="fullscreen ? 'el-icon-bottom-left' : 'el-icon-top-right'"
        class="panel-minute-view__fullscreen-icon"
        @click="fullscreen = !fullscreen" />
      <iframe
        :src="editDialogUrl"
        frameborder="0"/>
      <el-card
        shadow="never"
        class="panel-minute-view__tips">
        <h2>Variáveis disponíveis</h2>
        <span class="list">
          <div
            v-for="(key, value) in types"
            :key="key">
            <span>{{ key }}</span>
            <div>
              <span>
                <span v-pre>{{</span>{{ value }}<span v-pre>}}</span>
              </span>
              <el-tooltip content="Copiar para o clipboard">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-copy-document"
                  @click="copy(value)"/>
              </el-tooltip>
            </div>
          </div>
        </span>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PanelMinute',
  data() {
    return {
      tableKey: 0,
      nameToEdit: '',
      loadingMinutes: true,
      search: '',
      editDialogVisible: false,
      editDialogUrl: '',
      minutes: [],
      types: {},
      fullscreen: false,
    }
  },
  computed: {
    filteredMinutes() {
      return this.minutes.filter(minute => {
        if (minute.archived || !minute.name) {
          return false
        }
        return !this.search || minute.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    width() {
      if (this.fullscreen === true) {
        return '100%'
      }
      return '90%'
    },
  },
  mounted() {
    this.fetchMinutes()
    this.$store.dispatch('getDocumentTypes').then(response => {
      this.types = response
    })
  },
  methods: {
    fetchMinutes() {
      this.loadingMinutes = true
      this.$store.dispatch('getDocumentModels').then(response => {
        this.minutes = response
      }).catch(error => {
        console.error(error)
      }).finally(() => {
        this.loadingMinutes = false
      })
    },
    addMinute() {
      this.$prompt('Insira a URL (Google Docs) do documento:', 'Adicionar minuta', {
        confirmButtonText: 'Adicionar',
        cancelButtonText: 'Cancelar',
        cancelButtonClass: 'is-plain',
        inputPattern: /.*docs\.google\.com.*/,
        inputErrorMessage: 'URL inválida',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$store.dispatch('addModel', instance.inputValue).then(response => {
              this.fetchMinutes()
            }).catch(error => {
              console.error(error)
              this.$jusNotification({
                title: 'Ops!',
                message: 'Houve uma falha ao adicionar minuta. Certifique-se de que o documento adicionado é público.',
                type: 'warning',
              })
            }).finally(() => {
              done()
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        },
      }).then(({ value }) => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Minuta adicionada com sucesso',
          type: 'success',
        })
      })
    },
    editMinute(url) {
      this.editDialogUrl = url
      this.editDialogVisible = true
    },
    deleteMinute(modelId) {
      this.$confirm('Tem certeza que deseja excluir?', 'Atenção!', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        cancelButtonClass: 'is-plain',
        confirmButtonClass: 'el-button--danger',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$store.dispatch('deleteModel', modelId).then(response => {
              done()
              this.fetchMinutes()
            }).catch(error => {
              console.error(error)
            }).finally(() => {
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        },
      }).then(() => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Minuta excluída com sucesso',
          type: 'success',
        })
      })
    },
    focusInput(minuteId, minuteName) {
      this.tableKey += 1
      this.nameToEdit = minuteName
      this.$nextTick(() => this.$refs['input' + minuteId].$el.children[0].focus())
    },
    editMinuteName(minute) {
      this.tableKey += 1
      if (minute.name !== this.nameToEdit) this.$store.dispatch('editModel', minute)
    },
    copy(value) {
      navigator.clipboard.writeText(`{{${value}}}`)
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.panel-minute-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  &__dialog {
    &--full {
      padding: 10px;
      .el-dialog {
        .el-dialog__body {
          height: calc(100vh - 134px);
        }
      }
    }
    &--large  {
      .el-dialog {
        .el-dialog__body {
          height: calc(100vh - 200px);
        }
      }
    }
  }
  &__fullscreen-icon {
    position: absolute;
    color: $--color-text-secondary;
    font-size: 16px;
    top: 31px;
    right: 53px;
    cursor: pointer;
    &:hover {
      color: $--color-primary
    }
  }
  th.is-right .cell {
    display: flex;
  }
  .el-dialog {
    overflow: auto;
  }
  .el-table::before  {
    content: none;
  }
  .el-dialog__body {
    display: flex;
    height: calc(100vh - 194px);
  }
  iframe {
    width: calc(100% - 280px);
  }
  &__name {
    .label {
      margin-top: 1px;
      border: 1px solid transparent;
    }
    .el-input  {
      margin-left: -5px;
    }
    .el-input__inner {
      padding-left: 5px;
      height: 28px;
      line-height: 28px;
    }
  }
  &__tips {
    border: 0;
    background-color: $--color-secondary-light-9;
    margin-left: 10px;
    width: 320px;
    font-size: 13px;
    overflow-y: auto;
    * {
      border: 0;
    }
    h2 {
      margin-top: 10px;
      margin-bottom: 14px;
    }
    .list {
      > div {
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        > span {
          font-weight: 600;
        }
        div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid black;
          font-size: 12px;
          margin-top: 3px;
          padding: 3px 6px;
          background-color: rgba(255, 255, 255, 0.75);
          border-color: #dcdfe6;
          border-radius: 2px;
          button {
            font-size: 20px;
            padding: 0;
          }
        }
      }
    }
    .el-card__body {
      padding: 16px;
    }
  }
  &__editable-label img {
    display: none;
    cursor: pointer;
    width: 16px;
  }
  &__editable-label:hover img {
    display: inline;
  }
}
</style>
