<template>
  <jus-view-main class="import-view">
    <template slot="title">
      <h1>Importação de disputas</h1>
    </template>
    <template slot="main">
      <h2 class="import-view__action">
        Histórico de importações
        <div>
          <el-button plain @click="downloadModel()">Baixar planilha modelo</el-button>
          <el-button type="primary" @click="dialogVisible = true">Nova importação de disputas</el-button>
        </div>
      </h2>
      <el-table
        :data="importsHistoryPaged"
        height="100%"
        style="width: 100%">
        <el-table-column label="Arquivo">
          <template slot-scope="scope">{{ scope.row.file_name }}</template>
        </el-table-column>
        <el-table-column label="Importado por">
          <template v-if="scope.row.created_name" slot-scope="scope">
            {{ scope.row.created_name }}
            <span v-if="scope.row.created_by">({{ scope.row.created_by }})</span>
          </template>
        </el-table-column>
        <el-table-column label="Data">
          <template slot-scope="scope">
            {{ scope.row.date | moment('DD/MM/YYYY [às] HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="Status">
          <template slot-scope="scope">
            <i :class="setStatusIcon(scope.row.status)" />
            {{ $t('import.status.' + scope.row.status ) | capitalize }}
          </template>
        </el-table-column>
        <el-table-column width="90" label="Linhas" align="center">
          <template slot-scope="scope">{{ scope.row.rows }}</template>
        </el-table-column>
        <el-table-column width="90" align="center" label="Baixar">
          <template slot-scope="scope">
            <a :href="scope.row.file_url" target="_blank">
              <jus-icon icon="download-sheet" />
            </a>
          </template>
        </el-table-column>
        <infinite-loading
          slot="append"
          :distance="1"
          spinner="spiral"
          force-use-infinite-wrapper=".el-table__body-wrapper"
          @infinite="infiniteHandler">
          <div slot="no-more" />
          <div slot="no-results" />
        </infinite-loading>
      </el-table>
      <el-dialog
        :visible.sync="dialogVisible"
        class="import-view__dialog"
        title="Nova importação de disputas">
        <label for="fileupload" @dragover.prevent @drop.prevent="handleFile($event)">
          <el-card class="el-card--dashed-hover" shadow="never">
            <div v-if="isInitial">
              <jus-icon icon="upload-file" />
              <div>
                <br>
                Clique aqui e importe sua planilha nos<br> formatos XLSX, CSV ou XLS.
              </div>
            </div>
            <div v-if="isSaving">
              <br><br>
              <div v-loading="true" class="import-view__loading" />
              <div>
                <br><br><br>
                Carregando...
              </div>
            </div>
            <div v-if="isSuccess">
              <jus-icon icon="spreadsheet-xlsx" />
              <div>
                <br><br>
                {{ uploadedFile.file_name }}
              </div>
            </div>
          </el-card>
          <input
            id="fileupload"
            ref="fileupload"
            type="file"
            class="import-view__upload"
            @change="handleFile($event)">
        </label>
        <span slot="footer" class="dialog-footer">
          <el-button plain @click="closeDialog">Cancelar</el-button>
          <el-button :disabled="!isSuccess" type="primary" @click="startImport">Importar</el-button>
        </span>
      </el-dialog>
    </template>
  </jus-view-main>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
const STATUS_INITIAL = 0
const STATUS_SAVING = 1
const STATUS_SUCCESS = 2

export default {
  name: 'Import',
  components: { InfiniteLoading },
  data () {
    return {
      importsHistory: [],
      page: 1,
      dialogVisible: false,
      currentStatus: 0,
      uploadedFile: null,
      uploadError: null
    }
  },
  computed: {
    importsHistoryPaged () {
      return this.importsHistory.slice(0, this.page * 20)
    },
    isInitial () {
      return this.currentStatus === STATUS_INITIAL
    },
    isSaving () {
      return this.currentStatus === STATUS_SAVING
    },
    isSuccess () {
      return this.currentStatus === STATUS_SUCCESS
    }
  },
  beforeMount () {
    this.$store.dispatch('getImportsHistory').then(response => {
      if (response && response.length) {
        this.importsHistory = response.sort(function (a, b) {
          if (a.id < b.id) return 1
          if (a.id > b.id) return -1
          return 0
        })
      }
    })
  },
  beforeCreate () {
  },
  methods: {
    setStatusIcon (status) {
      switch (status) {
        case 'FINISHED':
          return 'el-icon-folder-checked'
        case 'ERROR': case 'IN_QUEUE': case 'PROCESSED':
          return 'el-icon-folder-delete'
        case 'READY': case 'PROCESSING':
          return 'el-icon-folder-remove'
        default:
          return 'el-icon-folder-delete'
      }
    },
    startImport () {
      this.$router.push('/import/new')
      this.$store.dispatch('hideLoading')
    },
    infiniteHandler ($state) {
      setTimeout(() => {
        this.page = this.page + 1
        if (this.importsHistory.length === this.importsHistoryPaged.length) {
          $state.complete()
        } else {
          $state.loaded()
        }
      }, 600)
    },
    handleFile (e) {
      this.$notify.closeAll()
      const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0]
      const isLt20M = file.size / 1024 / 1024 < 20
      const isValid =
        file.name.toLowerCase().endsWith('.xlsx') ||
        file.name.toLowerCase().endsWith('.xls') ||
        file.name.toLowerCase().endsWith('.csv')
      if (!isValid) {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Arquivo em formato inválido.',
          type: 'warning'
        })
      }
      if (!isLt20M) {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Arquivo não pode ultrapassar 20MB.',
          type: 'warning'
        })
      }
      if (isLt20M && isValid) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('created_person_id', this.$store.getters.loggedPersonId)
        formData.append('created_name', this.$store.getters.loggedPersonName)
        formData.append('created_by', this.$store.getters.accountEmail)
        this.saveFile(formData)
      } else {
        this.removeFile()
      }
    },
    saveFile (formData) {
      this.currentStatus = STATUS_SAVING
      this.$store.dispatch('uploadImportFile', formData).then(response => {
        this.currentStatus = STATUS_SUCCESS
        this.uploadedFile = response
        this.$store.commit('setImportsFile', response)
      }).catch(error => {
        this.handleError(error.response)
        this.removeFile()
        this.currentStatus = STATUS_INITIAL
      })
    },
    handleError (error) {
      let errorMessage = {}
      if (error.status === 406) {
        errorMessage.message = error.data.error
        errorMessage.type = 'warning'
      } else if (error.data.error) {
        errorMessage.message = 'Arquivo vazio ou fora do formato padrão. Verifique o seu conteúdo e tente novamente.'
        errorMessage.type = 'warning'
      } else {
        errorMessage.message = 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.'
        errorMessage.type = 'error'
      }
      this.currentStatus = STATUS_INITIAL
      this.$jusNotification({
        title: 'Ops!',
        message: errorMessage.message,
        type: errorMessage.type
      })
    },
    closeDialog () {
      this.dialogVisible = false
      this.removeFile()
    },
    removeFile () {
      const input = this.$refs.fileupload
      input.type = 'text'
      input.type = 'file'
      this.$store.commit('removeImportsFile')
      this.currentStatus = STATUS_INITIAL
      this.uploadedFile = null
      this.uploadError = null
    },
    downloadModel () {
      window.analytics.track('Planilha modelo baixada')
      window.open('Planilha-Modelo-Justto.xlsx', '_blank')
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.import-view {
  .el-table {
    img {
      width: 14px;
    }
    .cell {
      word-break: break-all;
    }
  }
  &__action {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__upload {
    display: none
  }
  &__dialog {
    .el-card {
      padding: 30px;
      margin: 20px 0;
    }
    img {
      width: 60px;
    }
    .el-card__body > div{
      text-align: center;
    }
  }
  .el-card__body {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .el-icon-folder-delete {
    font-size: 18px;
    color: $--color-danger-light-5;
  }
  .el-icon-folder-checked {
    font-size: 18px;
  }
}
</style>
