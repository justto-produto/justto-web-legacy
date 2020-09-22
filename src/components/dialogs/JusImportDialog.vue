<template lang="html">
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="jus-import-dialog"
    title="Nova importação de disputas"
  >
    <label
      for="fileupload"
      @dragover.prevent
      @drop.prevent="handleFile($event)"
    >
      <el-card
        class="el-card--dashed-hover"
        shadow="never"
      >
        <div v-if="isInitial">
          <jus-icon
            icon="upload-file"
            is-active
          />
          <div>
            <br>
            Clique aqui e importe sua planilha nos<br> formatos XLSX, CSV ou XLS.
          </div>
        </div>
        <div v-if="isSaving">
          <br><br>
          <div
            v-loading="true"
            class="import-view__loading"
          />
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
        class="jus-import-dialog__upload"
        @change="handleFile($event)"
      >
    </label>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        plain
        @click="closeDialog"
      >Cancelar</el-button>
      <el-button
        :disabled="!isSuccess"
        type="primary"
        @click="startImport"
      >Importar</el-button>
    </span>
  </el-dialog>
</template>

<script>
const STATUS_INITIAL = 0
const STATUS_SAVING = 1
const STATUS_SUCCESS = 2

export default {
  name: 'JusImportDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentStatus: 0,
      uploadedFile: null,
      uploadError: null
    }
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible
      },
      set(visible) {
        this.$emit('update:dialogVisible', visible)
      }
    },
    isInitial() {
      return this.currentStatus === STATUS_INITIAL
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS
    }
  },
  methods: {
    startImport() {
      // SEGMENT TRACK
      this.$jusSegment('Importação 2/4 Importação iniciada', { fileName: this.uploadedFile.file_name })
      this.$router.push('/import/new')
      this.$store.dispatch('hideLoading')
    },
    handleFile(e) {
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
        // SEGMENT TRACK
        this.$jusSegment('Importação 1/4 Ulpoad concluido', { fileName: file.name })
      } else {
        this.removeFile()
      }
    },
    saveFile(formData) {
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
    handleError(error) {
      const errorMessage = {}
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
    closeDialog() {
      this.visible = false
      this.removeFile()
    },
    removeFile() {
      const input = this.$refs.fileupload
      input.type = 'text'
      input.type = 'file'
      this.$store.commit('removeImportsFile')
      this.currentStatus = STATUS_INITIAL
      this.uploadedFile = null
      this.uploadError = null
    }
  }
}
</script>

<style lang="scss">
.jus-import-dialog {
  .el-card {
    padding: 30px;
    margin: 20px 0;
    cursor: pointer;
  }
  img {
    width: 60px;
  }
  .el-card__body > div{
    text-align: center;
  }
  &__upload {
    display: none
  }
}
</style>
