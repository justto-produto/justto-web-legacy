<template lang="html">
  <div class="panel-minute-view">
    <el-table v-loading="loadingMinutes" :key="tableKey" :data="filteredMinutes" width="100%">
      <el-table-column class-name="panel-minute-view__name" prop="name" label="Nome">
        <template slot-scope="props">
          <el-input
            v-show="props.row.editing"
            :ref="'input' + props.row.id"
            v-model="props.row.name"
            @keyup.enter.native="props.row.editing = false, editMinuteName(props.row)"
            @blur="props.row.editing = false, editMinuteName(props.row)" />
          <div
            v-show="!props.row.editing"
            class="label"
            @click="props.row.editing = true ,focusInput(props.row.id, props.row.name)">
            {{ props.row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right" width="400px">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            placeholder="Buscar"/>
          <el-button type="primary" icon="el-icon-plus" @click="addMinute">
            Adicionar
          </el-button>
        </template>
        <template slot-scope="props">
          <el-tooltip v-if="props.row.privateDocumentModel" content="Excluir">
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="deleteMinute(props.row.id)">
              Excluir
            </el-button>
          </el-tooltip>
          <el-tooltip content="Editar">
            <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="editMinute(props.row.url)">
              Editar documento
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="editDialogVisible" title="Editar minuta" width="100%">
      <iframe :src="editDialogUrl" />
      <el-card shadow="never" class="panel-minute-view__tips">
        <h2>Variáveis disponíveis</h2>
        <span class="list">
          <div v-for="(key, value) in types" :key="key">
            <span>{{ key }}</span>
            <div>
              <span v-pre>{{</span>{{ value }}<span v-pre>}}</span>
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
  data () {
    return {
      tableKey: 0,
      nameToEdit: '',
      loadingMinutes: true,
      search: '',
      editDialogVisible: false,
      editDialogUrl: '',
      minutes: [],
      types: {}
    }
  },
  computed: {
    filteredMinutes () {
      return this.minutes.filter(minute => {
        if (minute.archived || !minute.name) {
          return false
        }
        return !this.search || minute.name.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  mounted () {
    this.fetchMinutes()
    this.$store.dispatch('getDocumentTypes').then(response => {
      this.types = response.data
    })
  },
  methods: {
    fetchMinutes () {
      this.loadingMinutes = true
      this.$store.dispatch('getDocumentModels').then(response => {
        this.minutes = response
      }).catch(error => {
        console.error(error)
      }).finally(() => {
        this.loadingMinutes = false
      })
    },
    addMinute () {
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
                type: 'warning'
              })
            }).finally(() => {
              done()
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
      }).then(({ value }) => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Minuta adicionada com sucesso',
          type: 'success'
        })
      })
    },
    editMinute (url) {
      this.editDialogUrl = url
      this.editDialogVisible = true
    },
    deleteMinute (modelId) {
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
        }
      }).then(() => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Minuta excluída com sucesso',
          type: 'success'
        })
      })
    },
    focusInput (minuteId, minuteName) {
      this.tableKey += 1
      this.nameToEdit = minuteName
      this.$nextTick(() => this.$refs['input' + minuteId].$el.children[0].focus())
    },
    editMinuteName (minute) {
      this.tableKey += 1
      if (minute.name !== this.nameToEdit) this.$store.dispatch('editModel', minute)
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.panel-minute-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
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
    height: calc(100% - 116px);
  }
  iframe {
    width: 100%;
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
    width: 376px;
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
          padding-left: 10px;
          font-size: 12px;
        }
      }
    }
    .el-card__body {
      padding: 16px;
    }
  }
}
</style>
