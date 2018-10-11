<template>
  <JusViewMain class="import-upload">
    <template slot="main">
      <JusButtonBack to="/import"/>
      <div class="upload-container">
        <h2 v-show="!file">Insira a sua planilha</h2>
        <p v-show="!file">Formatos aceitos: XLSX, CSV, XLS, ODT e Google Sheets.</p>
        <div class="upload-methods">
          <el-card :class="{'el-card--upload-progress': file}" shadow="never" class="el-card--dashed el-card--vertical-content">
            <JusIcon v-if="!file" icon="upload-file" class="upload-icon"/>
            <a v-if="!file" href="#" @click.prevent="uploadMoockFile">Adicionar arquivo do computador</a>
            <el-row v-if="file">
              <el-col :span="5">
                <JusIcon icon="spreadsheet-xlsx"/>
              </el-col>
              <el-col :span="19">
                <strong>planilha-casos.xlsx</strong>
                <el-progress :stroke-width="4" :percentage="progress" :status="uploadStatus"/>
                <p v-show="inProgress && progress === 100">
                  Processando...
                  <i class="el-icon-loading"/>
                </p>
                <p v-show="processSuccess">
                  Documento carregado com sucesso.
                </p>
              </el-col>
            </el-row>
            <div v-if="processSuccess" class="process-success">
              <hr>
              <el-card class="el-card--background">
                <span>1.000</span>
                casos importados
              </el-card>
              <p>
                Caso a importação não tenha o número de casos que estão no arquivo,
                verifique se algum filtro está aplicado, e desative-o.
              </p>
            </div>
          </el-card>
          <el-card v-show="!file" class="el-card--dashed el-card--vertical-content" shadow="never">
            <img src="@/assets/drive.png" class="upload-icon">
            <a href="#" @click.prevent="uploadMoockFile">Adicionar arquivo do Google Drive</a>
          </el-card>
        </div>
        <div class="display-flex">
          <el-button v-if="processSuccess" plain @click="file = false">Voltar</el-button>
          <el-button :disabled="inProgress" type="primary" @click="nextStep">Próximo</el-button>
        </div>
      </div>
    </template>
    <template slot="aside">
      <JusIcon icon="best-practices"/>
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
        this.$notify.closeAll()
        this.$router.push('/import/columns')
      } else {
        this.$notify.closeAll()
        this.$notify({
          title: 'Ops!',
          message: 'Para prosseguir você deve adicionar um arquivo.',
          position: 'bottom-right',
          duration: 2000,
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
        setTimeout(self.uploadCounter, 50)
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
  // drop (event) {
  //   console.log(event)
  // },
  // next () {
  //   if (this.active++ > 3) this.active = 1
  // },
  // notify () {
  //   this.$notify({
  //     title: 'Ops!',
  //     message: 'Para prosseguir você deve adicionar um arquivo',
  //     position: 'bottom-right',
  //     duration: 0,
  //     customClass: 'success'
  //   })
  // },
  // confirm () {
  //   this.$confirm(`Um arquivo ainda está carregando. Ao sair da tela, este arquivo não será importado.
  //     Você tem certeza de que quer abandonar o carregamento?`, 'Atenção!', {
  //     confirmButtonText: 'Parar importação',
  //     cancelButtonText: 'Cancelar'
  //   }).then(() => {
  //     this.$message({
  //       type: 'success',
  //       message: 'Delete completed'
  //     })
  //   }).catch(() => {
  //     this.$message({
  //       type: 'info',
  //       message: 'Delete canceled'
  //     })
  //   })
  // }
}
</script>

<style lang="scss">
.upload-container {
  text-align: center;
  width: 400px;
  margin: 40px auto;
  .upload-methods {
    display: flex;
    margin: 40px 0;
    >.el-card {
      &+.el-card {
        margin-left: 20px;
      }
      .upload-icon {
        max-width: 80px;
        margin-bottom: 20px;
      }
    }
  }
  .el-card--vertical-content {
    max-width: 400px;
    min-height: 190px;
    .el-row {
      width: 100%;
    }
    img {
      width: 50px;
    }
  }
  .el-card--upload-progress {
    .el-card__body {
      padding: 40px 20px;
    }
    p {
      margin-top: 8px;
      font-size: 12px;
      margin-bottom: 0;
    }
  }
  .el-progress {
    margin: 10px 0;
  }
  .process-success {
    .el-card {
      color: #fff;
      font-size: 12px;
      font-weight: normal;
      width: 150px;
      margin: auto;
      span {
        margin-bottom: 4px;
        font-size: 20px;
      }
    }
    p{
      margin-top: 20px;
    }
  }
  hr {
    width: 100%;
    margin: 40px 0;
  }
  .display-flex {
    button {
      width: 100%;
    }
  }
}
.download-template {
  width: 100%;
}
</style>
