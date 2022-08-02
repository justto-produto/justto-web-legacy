<template>
  <el-dialog
    :visible.sync="visible"
    title="Email do seu escritório"
    :close-on-click-modal="false"
    :show-close="false"
    custom-class="init-domain"
    width="auto"
    append-to-body
    center
  >
    <el-form
      ref="initDomainForm"
      label-position="top"
      :model="form"
      :rules="formRules"
      status-icon
      inline-message
    >
      <el-form-item
        label="Informe o endereço de email utilizado no seu escritório:"
        prop="email"
      >
        <el-input
          v-model="form.email"
          size="mini"
          type="email"
        />
      </el-form-item>

      <el-form-item>
        <div slot="label">
          <el-checkbox
            v-model="form.enableCustomPath"
            size="mini"
          >
            Usar caminho de retorno personalizado
          </el-checkbox>
        </div>

        <el-input
          v-model="form.customPath"
          :disabled="!form.enableCustomPath"
          size="mini"
          type="text"
        />
      </el-form-item>

      <el-form-item>
        <div slot="label">
          <el-checkbox
            v-model="form.enableCustomDkim"
            size="mini"
          >
            Use um seletor DKIM personalizado
          </el-checkbox>
        </div>

        <el-input
          v-model="form.customDkim"
          :disabled="!form.enableCustomDkim"
          type="text"
          size="mini"
          max="3"
          maxlength="3"
        />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button
        size="mini"
        @click="handleCancel"
      >
        Cancelar
      </el-button>

      <el-button
        type="primary"
        size="mini"
        @click="handleSave"
      >
        Salvar
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data: () => ({
    visible: false,
    form: {
      email: '',
      customPath: '',
      enableCustomPath: false,
      customDkim: '',
      enableCustomDkim: false
    },

    formRules: {
      email: [
        { required: true, message: 'Insira um Email', trigger: 'blur' },
        { type: 'email', message: 'Email inválido', trigger: ['blur', 'change'] }
      ]
    },

    callback: () => {},

    fallback: () => {}
  }),

  methods: {
    handleSave() {
      this.$refs.initDomainForm.validate(valid => {
        if (valid) {
          this.callback({ ...this.form })
          this.visible = false
          this.clearForm()
        }
      })
    },

    handleCancel() {
      this.fallback()
      this.visible = false

      this.clearForm()
    },

    open(callback, fallback) {
      this.callback = callback
      this.fallback = fallback

      this.clearForm()

      this.visible = true
    },

    clearForm() {
      this.form = {
        email: '',
        customPath: '',
        enableCustomPath: false,
        customDkim: '',
        enableCustomDkim: false
      }

      if (this.$refs?.initDomainForm) {
        this.$refs.initDomainForm.resetFields()
      }
    }
  }
}
</script>

<style lang="scss">
.init-domain {
  .el-dialog__body {
    .el-form {
      .el-form-item {
        .el-form-item__label {
          div {
            line-height: 14px;

            .el-checkbox {
              .el-checkbox__label {
                font-size: 12px;
              }
            }
          }
        }

        .el-form-item__content {
          .el-form-item__error {
            top: -16px !important;
          }
        }
      }
    }
  }
}
</style>
