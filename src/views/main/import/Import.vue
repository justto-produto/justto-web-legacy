<template>
  <div class="view-import view-import--main">
    <jus-view-main side-card-width="400">
      <template slot="title">Importação de casos</template>
      <template slot="main">
        <div class="view-import__container">
          <div class="view-import__title">
            <h2 v-show="!hasFile">Adicione novos casos</h2>
            <h2 v-show="hasFile">Planilha carregada com sucesso!</h2>
            <p v-show="!hasFile">Aqui você pode inserir novos casos para sua equipe negociar. Escolha abaixo
              <br>
              a forma de inclusão de novos casos em sua conta.
            </p>
          </div>
          <div class="view-import__content view-import__content---methods">
            <el-card :class="{'view-import__method-loading': hasFile}" class="view-import__method el-card--dashed-hover el-card--vertical-content" shadow="never">
              <el-upload
                ref="uploadMethod"
                :show-file-list="true"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                :on-error="handleError"
                :disabled="hasFile"
                accept=".csv,.xlsx,.xls"
                action="https://64bd150f-5317-4c5d-abc9-b8271f00f3c4.mock.pstmn.io/imports/upload">
                <jus-icon :icon="hasFile ? 'spreadsheet-xlsx' : 'upload-file'" class="upload-icon"/>
                <div v-if="!hasFile" class="view-import__method-info">Planilha nos formatos XLSX, CSV ou XLS</div>
              </el-upload>
            </el-card>
            <!-- <el-card v-if="!hasFile" class="view-import__method el-card--dashed-hover el-card--vertical-content" shadow="never">
              <jus-icon icon="insert" is-active/>
              <div class="view-import__method-info">Adicionar caso manualmente</div>
            </el-card> -->
          </div>
          <div v-if="hasFile" class="view-import__actions">
            <el-button plain @click="removeFile">Voltar</el-button>
            <el-button type="primary" @click="nextStep">Próximo</el-button>
          </div>
        </div>
      </template>
      <template slot="aside">
        <h2>
          Histórico de importaçãos
        </h2>
        <p>
          Aqui você encontra o registro de importações no sistema. Por enquanto, você não possui importações.
          Abaixo você pode baixar o nosso modelo de planilha:
        </p>
        <el-card
          v-for="imports in importsHistory"
          :key="imports.id"
          class="import-history"
          shadow="never">
          <jus-icon icon="spreadsheet-xlsx"/>
          <div style="margin: 0 20px;width: 100%;text-align: left;">
            <h4 style="margin: 0;margin-bottom: 10px;">{{ imports.file }}</h4>
            {{ imports.date | moment('DD/MM/YY') }} <br>
            {{ imports.date | moment('HH:mm') }} <br>
          </div>
          <a href="#" style="text-align: right;white-space: pre;">Ver casos</a>
        </el-card>
        <el-button type="primary" class="main-view__aside-action">Download planilha modelo</el-button>
      </template>
    </jus-view-main>
  </div>
</template>

<script>
export default {
  name: 'Import',
  data () {
    return {
      importsHistory: [],
      fileUrl: ''
    }
  },
  computed: {
    // TODO DEV RETIRAR
    hasFile () {
      return this.fileUrl !== ''
    }
  },
  beforeMount () {
    this.$store.dispatch('getImportsHistory').then(response => {
      this.importsHistory = response
    })
  },
  methods: {
    beforeUpload (file) {
      this.$notify.closeAll()
      const isValid =
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'text/csv'
      // file.type === 'application/vnd.oasis.opendocument.text'
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isValid) {
        this.$notify({
          title: 'Ops!',
          type: 'warning',
          position: 'bottom-right',
          message: `Arquivo em formato inválido.`,
          duration: 5000,
          customClass: 'warning'
        })
      }
      if (!isLt20M) {
        this.$notify({
          title: 'Ops!',
          type: 'warning',
          position: 'bottom-right',
          message: `Limite de 20 MB por arquivo.`,
          duration: 5000,
          customClass: 'warning'
        })
      }
      return isValid && isLt20M
    },
    // TODO DEV RETIRAR
    nextStep () {
      this.$router.push('/import/new')
    },
    handleSuccess (res, file) {
      this.fileUrl = URL.createObjectURL(file.raw)
    },
    handleError () {
      this.$notify({
        title: 'Ops!',
        type: 'error',
        position: 'bottom-right',
        message: `Houve uma falha de conexão com o servidor.
        Tente novamente ou entre em contato com o administrador do sistema.`,
        duration: 5000,
        customClass: 'danger'
      })
    },
    removeFile () {
      this.fileUrl = ''
      this.$refs['uploadMethod'].clearFiles()
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.view-import {
}

.view-import--main {
  .jus-main-view__side-card {
    text-align: center;
    .import-history .el-card__body {
      display: flex;
      align-items: center;
    }
  }
  .jus-main-view__main-card {
    display: flex;
    > .el-card__body {
      margin: auto;
      padding: 40px 20px;
    }
  }
}

.view-import__title {
  text-align: center;
  margin: auto;
  h2 {
    margin: 0;
  }
  p{
    margin: 10px 0;
  }
}

.view-import__content {
  margin: 40px 0 0;
}

.view-import__content---methods {
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

.view-import__method {
  max-width: 240px;
  transition: all ease .5s;
  &+.view-import__method {
    margin-left: 20px;
  }
  >.el-card__body {
    padding: 40px 20px;
  }
}

.el-card--dashed-hover:hover{
  cursor: pointer;
  .view-import__method-info {
    color: $--color-primary;
  }
}

.view-import__method-info {
  margin-top: 10px;
  text-align: center;
}

.view-import__method-loading {
  width: 400px;
  max-width: 400px;
}

.view-import__actions {
  display: flex;
  margin-top: 40px;
  button {
    width: 100%;
  }
}

// .view-import__progress{
//   display: flex;
//   width: 100%;
// }

// .view-import__progress-info {
//   width: 100%;
//   margin-left: 20px;
//   .el-progress {
//     margin: 5px 0;
//     margin-right: -20px;
//   }
// }

// .view-import__progress-success {
//   text-align: center;
//   .el-card {
//     color: #fff;
//     font-weight: normal;
//     width: 150px;
//     margin: auto;
//     span {
//       margin-bottom: 4px;
//       font-size: 20px;
//     }
//   }
//   .view-import__success-info {
//     margin-top: 30px;
//   }
//   .el-card__body {
//     text-align: center;
//   }
//   .el-card--background {
//     .el-card__body {
//       padding: 12px 10px;
//     }
//     h2 {
//       margin-top: 0;
//       margin-bottom: 8px;
//     }
//     span {
//       font-size: 12px;
//       margin: 0;
//     }
//   }
// }
</style>
