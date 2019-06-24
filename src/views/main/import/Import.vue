<template>
  <jus-view-main right-card-width="400" class="import-view">
    <template slot="title">
      <h1>Importação de disputas</h1>
    </template>
    <template slot="main">
      <div class="import-view__container">
        <div class="import-view__title">
          <h2 v-show="!hasFile">Adicione novas disputas</h2>
          <h2 v-show="hasFile">Planilha carregada com sucesso!</h2>
          <p v-show="!hasFile">
            Aqui você pode inserir novas disputas para sua equipe negociar. Escolha abaixo
            a forma de inclusão de novas disputas em sua conta.
          </p>
        </div>
        <div class="import-view__content import-view__content---methods">
          <el-card :class="{'import-view__method-loading': hasFile}" class="import-view__method el-card--dashed-hover el-card--vertical-content" shadow="never">
            <el-upload
              v-loading="processingFile"
              ref="uploadMethod"
              :show-file-list="true"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :on-error="handleError"
              :disabled="hasFile"
              :headers="uploadHeaders"
              accept=".csv,.xlsx,.xls"
              action="/api/imports/upload">
              <jus-icon :icon="hasFile ? 'spreadsheet-xlsx' : 'upload-file'" class="upload-icon"/>
              <div v-if="!hasFile && !processingFile" class="import-view__method-info">Planilha nos formatos XLSX, CSV ou XLS</div>
            </el-upload>
            <div v-if="processingFile" style="margin-top: 20px; margin-bottom: -20px;">
              Carregando...
            </div>
          </el-card>
          <!-- <el-card v-if="!hasFile" class="import-view__method el-card--dashed-hover el-card--vertical-content" shadow="never">
            <jus-icon icon="insert" is-active/>
            <div class="import-view__method-info">Adicionar disputas manualmente</div>
          </el-card> -->
        </div>
        <div v-if="hasFile" class="import-view__actions">
          <el-button plain @click="removeFile">Voltar</el-button>
          <el-button type="primary" @click="startImport">Próximo</el-button>
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
            <el-button type="primary" class="right" @click="downloadModel()">
              <jus-icon icon="download-white" />
            </el-button>
          </el-tooltip>
        </div>
        <p v-if="importsHistory.length === 0">
          Aqui você encontra o registro de importações no sistema. Por enquanto, você não possui importações.
          Abaixo você pode baixar o nosso modelo de planilha:
        </p>
        <div class="import-view__cards">
          <el-card
            v-for="imports in importsHistory"
            :key="imports.id"
            class="import-view__card">
            <div>
              <jus-icon icon="spreadsheet-xlsx"/>
            </div>
            <div class="import-view__card-content">
              <h4><a href="#" @click="downloadItem(imports.file_name)">{{ imports.file_name }}</a></h4>
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
export default {
  name: 'Import',
  data () {
    return {
      importsHistory: [],
      fileUrl: '',
      processingFile: false
    }
  },
  computed: {
    hasFile () {
      return this.fileUrl !== ''
    },
    uploadHeaders () {
      return {
        'Authorization': this.$store.state.accountModule.token,
        'Workspace': this.$store.state.workspaceModule.subdomain
      }
    }
  },
  beforeMount () {
    this.$store.dispatch('getImportsHistory').then(response => {
      this.importsHistory = response.sort(function (a, b) {
        if (a.id < b.id) return 1
        if (a.id > b.id) return -1
        return 0
      })
    })
  },
  beforeCreate () {
    this.$store.commit('removeImportsFile')
  },
  methods: {
    beforeUpload (file) {
      this.$notify.closeAll()
      this.processingFile = true
      const isValid =
      file.name.toLowerCase().endsWith('.xlsx') ||
      file.name.toLowerCase().endsWith('.xls') ||
      file.name.toLowerCase().endsWith('.csv')
      const isLt20M = file.size / 1024 / 1024 < 20
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
      return isValid && isLt20M
    },
    startImport () {
      this.$router.push('/import/new')
      this.$store.dispatch('hideLoading')
    },
    handleSuccess (res, file) {
      this.processingFile = false
      this.$store.commit('setImportsFile', res)
      this.fileUrl = URL.createObjectURL(file.raw)
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
      this.fileUrl = ''
      this.$store.commit('removeImportsFile')
      this.$refs['uploadMethod'].clearFiles()
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
    overflow-y: scroll;
    padding: 0 20px 20px;
    margin-bottom: -20px;
  }
  &__method-info {
    margin-top: 10px;
    text-align: center;
    transition: all ease .5s;
  }
  &__method-loading {
    width: 400px;
    max-width: 400px;
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
    }
  }
  &__content {
    margin: 40px 0 0;
  }
  &__content---methods {
    display: flex;
    justify-content: center;
    text-align: center;
    .el-upload-list {
      max-width: 210px;
      &.is-disabled {
        max-width: 368px;
      }
    }
    .el-icon-document {
      display: none;
    }
  }
  &__method {
    max-width: 240px;
    transition: all ease .5s;
    &+.import-view__method {
      margin-left: 20px;
    }
    >.el-card__body {
      padding: 40px 20px;
    }
  }
}
.el-card--dashed-hover:hover{
  cursor: pointer;
  .import-view__method-info {
    color: $--color-primary;
  }
}

</style>
