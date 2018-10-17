<template>
  <JusViewMain class="view-import view-import--upload">
    <template slot="main">
      <JusButtonBack to="/import"/>
      <div class="view-import__container">
        <div class="view-import__title">
          <h2 v-show="!file">Insira a sua planilha</h2>
          <h2 v-show="file && processSuccess">Planilha carregada</h2>
          <h2 v-show="file && !processSuccess">Processando planilha</h2>
          <p v-show="!file">Formatos aceitos: XLSX, CSV, XLS, ODT e Google Sheets.</p>
        </div>
        <div class="view-import__content view-import__content---methods">
          <el-card :class="{'el-card--upload-progress': file, 'view-import__method--uploading': file}" shadow="never" class="view-import__method el-card--dashed el-card--vertical-content">
            <jus-icon v-show="!file" icon="upload-file" class="upload-icon"/>
            <a v-show="!file" href="#" @click.prevent="uploadMoockFile">Adicionar arquivo do computador</a>
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
                Caso a importação não tenha o número de casos que estão no arquivo,
                verifique se algum filtro está aplicado, e desative-o.
              </div>
            </div>
          </el-card>
          <el-card v-show="!file" class="view-import__method el-card--dashed el-card--vertical-content" shadow="never">
            <img src="@/assets/drive.png" class="upload-icon">
            <a href="#" @click.prevent="uploadMoockFile">Adicionar arquivo do Google Drive</a>
          </el-card>
          <el-card v-show="!file" class="view-import__method el-card--dashed el-card--vertical-content" shadow="never">
            <jus-icon icon="pencil" is-active/>
            <a href="#" @click.prevent="uploadMoockFile">Adicionar caso manualmente</a>
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
        Melhores práticas para importar casos
      </h3>
      <br>
      <p>
        Ao escolher uma opção para importação, certifique-se de que os dados estão inseridos corretamente.
        Dessa forma, o sistema irá reconhecer mais rapidamente os dados, e além disso, enriquecer com informações
        complementares colhidas diretamente do TJ.<br><br> Não se esqueça de preencher os dados mínimos da planilha
        <br><br> • Número do processo<br> • Empresa<br> • Alçadas da negociação <br> • Nome e CPF das partes
      </p>
      <br><br>
      <el-button type="primary" class="download-template">Download planilha modelo</el-button>
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
          message: 'Para prosseguir você deve adicionar um arquivo.',
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
        setTimeout(self.uploadCounter, 80)
      } else {
        this.processFile()
      }
    },
    processFile () {
      let self = this
      setTimeout(function () {
        self.inProgress = false
      }, 3000)
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
  max-width: 400px;
  &+.view-import__method {
    margin-left: 20px;
  }
  >.el-card__body {
    padding: 40px 20px;
  }
  a {
    text-align: center;
    margin-top: 20px;
  }
  hr {
    width: 100%;
    margin: 40px 0;
  }
  img {
    max-width: 80px;
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
    margin-top: 20px;
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
