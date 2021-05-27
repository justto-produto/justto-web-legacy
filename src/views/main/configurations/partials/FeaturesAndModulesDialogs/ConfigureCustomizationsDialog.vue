<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="configureCustomizationsDialogVisible"
    title="Customizar sua empresa ou escritório como ODR"
    append-to-body
    width="80%"
    class="configure-customizations"
  >
    <el-form
      ref="formCustomizations"
      :model="formCustomizations"
      :rules="rulesCustomizations"
      :disabled="modalLoading"
      label-position="top"
      class="configure-customizations__form"
    >
      <div
        class="configure-customizations__form-header"
      >
        <div
          class="configure-customizations__form-header-item"
        >
          <el-form-item
            class="configure-customizations__form-header-item-input"
            prop="email"
          >
            <label
              class="configure-customizations__form-header-item-input-label"
            >
              Email para envio das mensagens
            </label>
            <el-tooltip
              placement="right"
              effect="dark"
              :open-delay="500"
            >
              <div slot="content">
                Esta é uma configuração que exige intervenção dos times <br> de tecnologia da JUSTTO e do escritório/empresa.
              </div>
              <i class="el-icon-info" />
            </el-tooltip>
            <el-input
              v-model="formCustomizations.email"
            />
          </el-form-item>
        </div>
        <div
          class="configure-customizations__form-header-item"
        >
          <el-form-item
            class="configure-customizations__form-header-item-input"
            prop="link"
          >
            <label
              class="configure-customizations__form-header-item-input-label"
            >
              Link para portal de negociações
            </label>
            <el-tooltip
              placement="right"
              effect="dark"
              :open-delay="500"
            >
              <div slot="content">
                Exige intervenção da equipe de tecnologia para <br> criar um novo endereço na internet com o certificado.
              </div>
              <i class="el-icon-info" />
            </el-tooltip>
            <el-input
              v-model="formCustomizations.link"
            />
          </el-form-item>
        </div>
      </div>
      <el-form-item
        class="configure-customizations__form-ckeditor"
      >
        HERE WILL BE CKEDITOR
      </el-form-item>
    </el-form>
    <div class="configure-customizations__footer">
      <div class="configure-customizations__footer-info">
        <span class="configure-customizations__footer-info-span">
          Ao utilizar nossa plataforma você está ciente e concorda com nossa
          <a
            href="https://justto.com.br/poilitica-privacidade"
            target="_blank"
          >
            politica de privacidade
          </a>
          , nossos termos e condições de uso e está de acordo com nosso código de proteção de dados pessoais.
          Caso não queira mais receber mensagens da nossa plataforma descadastre seu email aqui.
        </span>
      </div>
      <el-button
        class="configure-customizations__footer-cancel"
        plain
        @click="dropLawsuitDialogVisible = false"
      >
        Cancelar
      </el-button>
      <el-button
        v-loading="modalLoading"
        :disabled="modalLoading"
        class="configure-customizations__footer-confirm"
        type="success"
        @click.prevent="saveCustomizedConfigurations"
      >
        Salvar configuração
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'ConfigureCustomizationsDialog',
  data: () => ({
    configureCustomizationsDialogVisible: true,
    modalLoading: false,
    formCustomizations: {
      email: '',
      link: '',
      emailFooter: ''
    },
    rulesCustomizations: {
      email: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      link: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      emailFooter: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    }
  }),
  computed: {
    ...mapActions({
      updateCustomizedConfigurations: 'updateCustomizedConfigurations'
    })
  },
  methods: {
    saveCustomizedConfigurations() {
      this.modalLoading = true
      this.validateForm('formCustomizations')
        .then(() => {
          console.log('then')
        })
        .finally(() => { this.modalLoading = true })
    },
    validateForm(ref) {
      return new Promise((resolve, reject) => {
        this.$refs[ref].validate(valid => {
          if (valid) resolve()
          else reject(new Error('Campos obrigatórios não preenchidos'))
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/colors.scss';
.configure-customizations {
  &__form {
    display: flex;
    flex-direction: column;
    &-header {
      display: flex;
      flex-direction: row;
      &-item {
        width: 50%;
        &-input {
          width: 70%;
          &-label {
            font-size: 12px;
          }
          i {
            color: $--color-primary;
            &:hover {
              color: $--color-primary-light-3;
            }
          }
        }
      }
    }
    // &-ckeditor {
    //   width: 50%;
    // }
  }
  &__footer {
    display: flex;
    &-info {
      &-span {
        font-size: 10px;
      }
    }
    &-confirm {
      .el-loading-mask {
        .el-loading-spinner .path {
          stroke: $--color-success;
        }
      }
    }
  }
}
</style>
