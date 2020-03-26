<template lang="html">
  <div class="panel-minute-view">
    <el-table v-loading="loadingMinutes" :data="filteredMinutes" width="100%">
      <el-table-column prop="name" label="Nome"/>
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
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="deleteMinute(props.row.id)" />
          </el-tooltip>
          <el-tooltip content="Editar">
            <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="editMinute(props.row.url)" />
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
              <span v-pre>{{ </span>
              {{ value }}
              <span v-pre>}}</span>
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
