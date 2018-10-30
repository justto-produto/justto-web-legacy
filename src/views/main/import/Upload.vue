<template>
  <JusViewMain class="view-import view-import--upload">
    <template slot="main">
      <JusButtonBack v-if="$store.state.importList.length !== 0" to="/import"/>
      <div class="view-import__container">
        <div class="view-import__title">
          <h2 v-show="!file">Adicione novos casos</h2>
          <h2 v-show="file && processSuccess">Planilha carregada</h2>
          <h2 v-show="file && !processSuccess">Processando planilha</h2>
          <p v-show="!file">Aqui você pode inserir novos casos para sua equipe negociar. Escolha abaixo a forma de inclusão de novos casos em sua conta.</p>
        </div>
        <div class="view-import__content view-import__content---methods">
          <el-card :class="{'el-card--upload-progress': file, 'view-import__method--uploading': file}" shadow="never" class="view-import__method el-card--dashed el-card--vertical-content">
            <jus-icon v-show="!file" icon="upload-file" class="upload-icon"/>
            <span v-show="!file" @click.prevent="uploadMoockFile">Planilha nos formatos XLSX, CSV, XLS ou ODT</span>
            <div v-show="file" class="view-import__progress">
              <jus-icon icon="spreadsheet-xlsx"/>
              <div class="view-import__progress-info">
                <strong>planilha-casos.xlsx</strong>
                <el-progress :stroke-width="4" :percentage="progress" :status="uploadStatus"/>
                <span v-show="!processSuccess">
                  Processando...
                  <i class="el-icon-loading"/>
                </span>
                <span v-show="processSuccess">
                  Documento carregado com sucesso.
                </span>
              </div>
            </div>
            <div v-show="processSuccess" class="view-import__progress-success">
              <hr>
              <el-card class="el-card--background">
                <h2>1.285</h2>
                <span>casos importados</span>
              </el-card>
              <div class="view-import__success-info">
                Se sua planilha tinha mais linhas do que o número acima, a negociação irá iniciar com o número de casos
                indicados acima e você poderá analisar posteriormente porque os outros casos não foram importados no
                sistema e corrigir eventuais problemas.
                <br><br>
                Se foram importados mais casos do que você tinha planejado, verifique se foi aplicado algum filtro na sua planilha. Clique em voltar, retire as linhas indesejadas e importe a planilha novamente.
              </div>
            </div>
          </el-card>
          <el-card v-show="!file" class="view-import__method el-card--dashed el-card--vertical-content" shadow="never">
            <img src="@/assets/drive.png" class="upload-icon">
            <span @click.prevent="uploadMoockFile">Adicionar arquivo do Google Drive</span>
          </el-card>
          <el-card v-show="!file" class="view-import__method el-card--dashed el-card--vertical-content" shadow="never">
            <jus-icon icon="insert" is-active/>
            <span @click.prevent="uploadMoockFile">Adicionar caso manualmente</span>
          </el-card>
        </div>
        <div class="view-import__actions">
          <el-button v-show="processSuccess" plain @click="file = false">Voltar</el-button>
          <el-button :disabled="inProgress" type="primary" @click="nextStep">Próximo</el-button>
        </div>
      </div>
    </template>
    <template slot="aside">
      <jus-icon icon="best-practices"/>
      <h3>
        Melhores práticas para importar uma planilha
      </h3>
      <br>
      <p>
        Ao inserir novos casos através de uma planilha, certifique-se de que os dados estão inseridos corretamente em
        cada coluna. Dessa forma, o sistema irá reconhecer mais rapidamente os dados, e além disso, enriquecer com
        informações das partes e advogados (se houver).
        <br><br>
        Os dados mínimos para inserir casos de uma planilha são (em colunas separadas):
        <br><br>
        • Número do processo (se for judicial)
        <br>
        • Nome da Empresa (seu cliente)
        <br>
        • Alçadas máximas para negociação
        <br>
        • Nome das partes
        <br>
        • CPF das partes
        <br>
        • Nomes dos Advogados (se for judicial)
      </p>
      <br><br>
      <el-button type="primary" class="main-view__aside-action">Download planilha modelo</el-button>
    </template>
  </JusViewMain>
</template>

<script>
export default {
  name: 'ImportUpload',
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
        this.$notify.closeAll()
        this.$router.push('/import/columns')
      } else {
        this.$notify.closeAll()
        this.$notify({
          title: 'Ops!',
          message: 'Para prosseguir você deve escolher uma das opções de importação de novos casos.',
          position: 'bottom-right',
          duration: 3000,
          customClass: 'danger'
        })
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
        setTimeout(self.uploadCounter, 8)
      } else {
        this.processFile()
      }
    },
    processFile () {
      let self = this
      setTimeout(function () {
        self.inProgress = false
      }, 300)
    }
  }
}
</script>

<style lang="scss">
.view-import__content---methods {
  display: flex;
  justify-content: center;
}

.view-import__method {
  min-height: 240px;
  max-width: 240px;
  &+.view-import__method {
    margin-left: 20px;
  }
  >.el-card__body {
    padding: 40px 20px;
    >span {
      text-align: center;
      margin-top: 20px;
      cursor: pointer;
    }
  }
  hr {
    width: 100%;
    margin: 40px 0;
  }
  img {
    height: 70px;
  }
}

.view-import__method--uploading {
  margin: auto;
  display: grid;
}

.view-import__progress{
  display: flex;
  width: 100%;
}

.view-import__progress-info {
  width: 100%;
  margin-left: 20px;
  .el-progress {
    margin: 5px 0;
    margin-right: -20px;
  }
}

.view-import__progress-success{
  .el-card {
    color: #fff;
    font-weight: normal;
    width: 150px;
    margin: auto;
    h4 {

    }
    span {
      margin-bottom: 4px;
      font-size: 20px;
    }
  }
  .view-import__success-info{
    margin-top: 30px;
  }
  .el-card__body {
    text-align: center;
  }
  .el-card--background {
    .el-card__body {
      padding: 12px 10px;
    }
    h2 {
      margin-top: 0;
      margin-bottom: 8px;
    }
    span {
      font-size: 12px;
      margin: 0;
    }
  }
}
</style>
