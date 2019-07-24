<template>
  <jus-view-main right-card-width="400" class="import-view">
    <template slot="title">
      <h1>Importação de disputas</h1>
    </template>
    <template slot="main">
      <div class="import-view__container">
        <div class="import-view__title">
          <h2 v-show="!isSuccess">Adicione novas disputas</h2>
          <p v-show="!isSuccess">
            Aqui você pode inserir novas disputas para você sua equipe negociarem.
          </p>
          <h2 v-show="isSuccess">Planilha carregada com sucesso!</h2>
        </div>
        <div class="import-view__content import-view__content--upload">
          <label for="fileupload">
            <el-card class="import-view__method el-card--dashed-hover el-card--vertical-content" shadow="never">
              <div v-if="isInitial">
                <jus-icon icon="upload-file" />
                <div>
                  <br>
                  Planilha nos formatos XLSX, CSV ou XLS
                </div>
              </div>
              <div v-if="isSaving">
                <div v-loading="true" class="import-view__loading" />
                <div>
                  <br>
                  Carregando...
                </div>
              </div>
              <div v-if="isSuccess">
                <jus-icon icon="spreadsheet-xlsx" />
                <div>
                  <br>
                  {{ uploadedFile.file_name }}
                </div>
              </div>
            </el-card>
            <input
              id="fileupload"
              ref="fileupload"
              type="file"
              class="import-view__upload"
              @change="handleFile($event.target.files)">
          </label>
        </div>
        <div v-if="isSuccess" class="import-view__actions">
          <el-button plain @click="removeFile">Remover arquivo</el-button>
          <el-button type="primary" data-testid="submit" @click="startImport">Próximo</el-button>
        </div>
      </div>
    </template>
    <template slot="right-card">
      <div class="import-view__history-container">
        <div class="import-view__history-title">
          <h2>
            Histórico de importação
          </h2>
          <el-tooltip content="Download da planilha modelo">
            <el-button
              class="right"
              data-testid="download-model"
              @click="downloadModel()">
              <jus-icon icon="download-sheet" />
            </el-button>
          </el-tooltip>
        </div>
        <p v-if="importsHistory.length === 0" data-testid="empty-history">
          Aqui você encontra o registro de importações no sistema. Por enquanto, você não possui importações.
          <br><br>
          Faça o download da planilha modelo no ícone acima.
        </p>
        <div v-if="importsHistory.length" class="import-view__cards">
          <el-card
            v-for="imports in importsHistory"
            :key="imports.id"
            class="import-view__card"
            data-testid="spreadsheet-card">
            <div>
              <jus-icon icon="spreadsheet-xlsx"/>
            </div>
            <div class="import-view__card-content">
              <h4>
                <a href="#" @click="downloadItem(imports.file_name)">
                  {{ imports.file_name }}
                </a>
              </h4>
              <p>Data: {{ imports.date | moment('DD/MM/YY - HH:mm') }} <br></p>
              <p>Linhas: {{ imports.rows }}</p>
            </div>
          </el-card>
        </div>
      </div>
    </template>
  </jus-view-main>
</template>

<script>
const STATUS_INITIAL = 0
const STATUS_SAVING = 1
const STATUS_SUCCESS = 2
const STATUS_FAILED = 3

export default {
  name: 'Import',
  data () {
    return {
      importsHistory: [],
      uploadedFile: null,
      uploadError: null,
      currentStatus: 0
    }
  },
  computed: {
    isInitial () {
      return this.currentStatus === STATUS_INITIAL
    },
    isSaving () {
      return this.currentStatus === STATUS_SAVING
    },
    isSuccess () {
      return this.currentStatus === STATUS_SUCCESS
    },
    isFailed () {
      return this.currentStatus === STATUS_FAILED
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
    this.$store.commit('removeImportsFile')
  },
  methods: {
    handleFile (files) {
      this.$notify.closeAll()
      const file = files[0]
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
        this.processingFile = false
        this.$jusNotification({
          title: 'Ops!',
          message: 'Arquivo não pode ultrapassar 20MB.',
          type: 'warning'
        })
      }
      if (isLt20M && isValid) {
        const formData = new FormData()
        formData.append('file', file)
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
        this.currentStatus = STATUS_FAILED
      })
    },
    handleError (error) {
      let errorMessage = {}
      if (error.status === 400) {
        errorMessage.message = 'Arquivo vazio ou fora do formato padrão. Verifique o seu conteúdo e tente novamente.'
        errorMessage.type = 'warning'
      } else {
        errorMessage.message = 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.'
        errorMessage.type = 'error'
      }
      this.processingFile = false
      this.$jusNotification({
        title: 'Ops!',
        message: errorMessage.message,
        type: errorMessage.type
      })
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
    startImport () {
      this.$router.push('/import/new')
      this.$store.dispatch('hideLoading')
    },
    downloadModel () {
      window.analytics.track('Planilha modelo baixada')
      window.open('Planilha-Modelo-Justto.xlsx', '_blank')
    },
    downloadItem (fileName) {
      window.open('imported/' + fileName, '_blank')
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.import-view {
  &__history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    margin-top: -20px;
    h2 {
      padding: 20px 0;
      display: block;
      margin: 0;
    }
    .el-button {
      border-radius: 5px;
      padding: 11px;
    }
    img {
      width: 16px;
      height: 16px;
    }
  }
  &__card {
    margin-top: 20px;
    .el-card__body {
      display: flex;
      align-items: center;
    }
  }
  &__card-content {
    margin-left: 20px;
    text-align: left;
    h4 {
      word-break: break-all;
      margin: 0;
    }
    p {
      margin: 3px 0 0;
    }
  }
  .jus-main-view__right-card {
    text-align: center;
  }
  .jus-main-view__main-card {
    display: flex;
    > .el-card__body {
      margin: auto;
      padding: 40px 20px;
    }
  }
  &__history-container {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    margin: 0 -20px;
  }
  &__cards {
    overflow-y: auto;
    padding: 0 20px 20px;
    margin-bottom: -20px;
  }
  &__actions {
    display: flex;
    margin-top: 40px;
    button {
      width: 100%;
    }
  }
  &__title {
    text-align: center;
    margin: auto;
    h2 {
      margin: 0;
    }
    p{
      margin: 10px 0;
      max-width: 400PX;
    }
  }
  &__content {
    margin: 40px 0 0;
  }
  &__content--upload {
    display: flex;
    justify-content: center;
    text-align: center;
    .el-card {
      width: 400px;
      max-width: 400px;
      transition: all ease .5s;
      &+.import-view__method {
        margin-left: 20px;
      }
      >.el-card__body {
        padding: 40px 20px;
      }
      &:hover {
        cursor: pointer;
        color: $--color-primary;
      }
    }
  }
  &__upload {
    display: none
  }
  &__upload-label {
    background-color: #3498db;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    margin: 10px;
    padding: 6px 20px
  }
  &__loading {
    height: 55px;
  }
}
</style>
