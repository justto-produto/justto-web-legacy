<template>
  <div class="view-import view-import--main">
    <h1>Importação de casos</h1>
    <JusViewMain side-card>
      <template slot="main">
        <div class="view-import__container">
          <div class="view-import__title">
            <h2 v-show="!hasFile">Adicione novos casos</h2>
            <h2 v-show="hasFile">Carregando a sua planilha</h2>
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
                action="http://localhost:3000/import">
                <jus-icon :icon="hasFile ? 'spreadsheet-xlsx' : 'upload-file'" class="upload-icon"/>
                <div v-if="!hasFile" class="view-import__method-info">Planilha nos formatos XLSX, CSV, XLS ou ODT</div>
              </el-upload>
            </el-card>
            <el-card v-if="!hasFile" class="view-import__method el-card--dashed-hover el-card--vertical-content" shadow="never">
              <jus-icon icon="insert" is-active/>
              <div class="view-import__method-info">Adicionar caso manualmente</div>
            </el-card>
          </div>
          <div v-if="hasFile" class="view-import__actions">
            <el-button plain @click="removeFile">Voltar</el-button>
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
      fileUrl: ''
    }
  },
  computed: {
    hasFile () {
      return this.fileUrl !== ''
    }
  },
  methods: {
    nextStep () {
      this.$router.push('/import/new')
    },
    handleSuccess (res, file) {
      this.fileUrl = URL.createObjectURL(file.raw)
    },
    beforeUpload (file) {
      this.$notify.closeAll()
      const isValid =
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'text/csv' ||
      file.type === 'application/vnd.oasis.opendocument.text'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isValid) {
        this.$notify({
          title: 'Ops!',
          type: 'warning',
          position: 'bottom-right',
          message: `Arquivo em formato inválido!`,
          duration: 0,
          customClass: 'warning'
        })
      }
      // if (!isLt2M) {
      //   this.$message.error('Limite de 2M por arquivo.')
      // }
      return isValid //&& isLt2M
    },
    handleError () {
      this.$notify({
        title: 'Ops!',
        type: 'error',
        position: 'bottom-right',
        message: `Houve uma falha de conexão com o servidor.
        Tente novamente ou entre em contato com o administrador do sistema.`,
        duration: 0,
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
