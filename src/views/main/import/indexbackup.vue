<template>
  <div class="view-import view-import--main">
    <h1>Importação de casos</h1>
    <JusViewMain side-card>
      <template slot="main">
        <div class="view-import__container">
          <div class="view-import__title">
            <h2 v-show="!file">Adicione novos casos</h2>
            <h2 v-show="file && processSuccess">Planilha carregada</h2>
            <h2 v-show="file && !processSuccess">Processando planilha</h2>
            <p v-show="!file">Aqui você pode inserir novos casos para sua equipe negociar. Escolha abaixo a forma de
              <br>
              inclusão de novos casos em sua conta.
            </p>
          </div>
          <div class="view-import__content view-import__content---methods">
            <el-card :class="{'el-card--upload-progress': file, 'view-import__method--uploading': file}" shadow="never" class="view-import__method el-card--dashed ">
              <jus-icon v-show="!file" icon="upload-file" class="upload-icon" />
              <span v-show="!file" @click.prevent="uploadMoockFile">Planilha nos formatos XLSX, CSV, XLS ou ODT</span>
              <div v-show="file" class="view-import__progress">
                <jus-icon icon="spreadsheet-xlsx"/>
                <div class="view-import__progress-info">
                  <strong>planilha-casos.xlsx</strong>
                  <el-progress :stroke-width="4" :percentage="progress" :status="uploadStatus"/>
                  <span v-show="!processSuccess">
                    <span v-if="progress !== 100">Carregando...</span>
                    <span v-else>Processando...</span>
                    <i class="el-icon-loading"/>
                  </span>
                  <span v-show="processSuccess">
                    Documento carregado com sucesso.
                  </span>
                </div>
              </div>
              <div v-show="processSuccess" class="view-import__progress-success">
                <hr>
                <h3>Total de casos importados: 100</h3>
                <div class="view-import__success-info">
                  Caso haja, na sua importação, mais casos do que você tinha planejado, verifique se foi aplicado algum
                  filtro na sua planilha. Clique em voltar, retire as linhas indesejadas e importe a planilha novamente.
                </div>
              </div>
            </el-card>
            <el-card v-show="!file" class="view-import__method el-card--dashed " shadow="never">
              <jus-icon icon="insert" is-active/>
              <span @click.prevent="uploadMoockFile">Adicionar caso manualmente</span>
            </el-card>
          </div>
          <div v-show="processSuccess" class="view-import__actions">
            <el-button plain @click="file = false">Voltar</el-button>
            <el-button type="primary" @click="nextStep">Próximo</el-button>
          </div>
        </div>
      </template>
      <template slot="aside">
        <h3>
          Histórico de Importaçãos
        </h3>
        <br>
        Aqui você encontra o registro de importações no sistema. Por enquanto, você não possui importações.
        Abaixo você pode baixar o nosso modelo de planilha:
        <br><br>
        <el-button type="primary" class="main-view__aside-action">Download planilha modelo</el-button>
      </template>
    </JusViewMain>
  </div>
</template>

<script>
export default {
  name: 'Import',
  data () {
    return {
      file: false,
      progress: 0,
      inProgress: false
    }
  },
  computed: {
    uploadStatus () {
      return this.progress === 100 ? 'success' : ''
    },
    processSuccess () {
      if (this.file && !this.inProgress && this.progress === 100) {
        return true
      }
      return false
    }
  },
  methods: {
    nextStep () {
      if (this.file) {
        this.$router.push('/import/new')
      }
    },
    uploadMoockFile () {
      this.file = true
      this.progress = 0
      this.uploadCounter()
      this.inProgress = true
    },
    uploadCounter () {
      if (this.progress < 100) {
        this.progress = this.progress + 1
        let self = this
        setTimeout(self.uploadCounter, 80)
      } else {
        this.processFile()
      }
    },
    processFile () {
      let self = this
      setTimeout(function () {
        self.inProgress = false
      }, 4000)
    }
  }
}
</script>w
