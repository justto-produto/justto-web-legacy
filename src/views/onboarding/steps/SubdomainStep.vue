<template>
  <div class="onboarding-step-content onboarding-subdomain-step">
    <div class="onboarding-step-content__title">
      <h2>Crie o seu espaço de trabalho na Justto</h2>
      <p>
        Abaixo você irá configurar o seu link de acesso ao sistema da Justto. Escolha um nome que seja fácil lembrar
        para você e sua equipe. Recomendamos o nome do seu escritório ou empresa.
        <br><br>
        Observação: Não é permitido usar letras maiúsculas, acentuação ou caracteres especiais.
      </p>
    </div>
    <el-form
      ref="subdomainForm"
      :model="subdomainForm"
      :rules="subdomainFormRules"
      label-position="top"
      @submit.native.prevent="submitForm"
    >
      <span>https://</span>
      <el-form-item prop="subdomain">
        <el-input
          v-model="subdomainForm.subdomain"
          :disabled="creatingWorkspace"
          name="subdomain"
          data-testid="subdomain-form"
        />
      </el-form-item>
      <span>.justto.app</span>
    </el-form>
    <br>
    <el-alert
      v-show="showAlert"
      :title="availabilityAlert.title"
      :type="availabilityAlert.type"
      :closable="false"
    />
    <el-button
      type="primary"
      data-testid="subdomain-next"
      @click="submitForm"
    >
      Próximo
    </el-button>
  </div>
</template>

<script>
import { validateSubdomainName, validateSubdomainAvailability } from '@/utils/validations'

export default {
  props: {
    isGuest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isAvailable: false,
      isValid: false,
      subdomainForm: {
        subdomain: this.$store.state.workspaceModule.subdomain
      },
      subdomainFormRules: {
        subdomain: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validateSubdomainName, trigger: 'change' },
          { validator: validateSubdomainAvailability, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    availabilityAlert() {
      if (this.isAvailable) {
        return {
          title: 'Subdomínio disponível.',
          type: 'success'
        }
      }
      return {
        title: 'Este subdomínio já está em uso.',
        type: 'error'
      }
    },
    creatingWorkspace() {
      return this.$store.getters.creatingWorkspace
    },
    showAlert() {
      if (!this.creatingWorkspace) {
        if (this.isValid) {
          return true
        } return false
      } return false
    }
  },
  watch: {
    subdomainForm: {
      handler(value) {
        this.subdomainForm.subdomain = value.subdomain.toLowerCase()
      },
      deep: true
    }
  },
  methods: {
    submitForm() {
      if (!this.creatingWorkspace) {
        this.$refs.subdomainForm.validate(valid => {
          if (valid) {
            this.$emit('onboarding:createSubdomain', { subdomain: this.subdomainForm.subdomain })
          } else {
            return false
          }
        })
      } else this.$emit('onboarding:step:next')
    }
  }
}
</script>

<style lang="scss">
.onboarding-subdomain-step {
  .el-form {
    display: flex;
    align-items: flex-end;
    span {
      margin-bottom: 10px;
    }
  }
  .el-form-item {
    width: 100%;
    margin: 0 5px;
  }
  .el-alert{
    width: fit-content;
    text-align: center;
  }
  .el-alert__content {
    width: 400px;
  }
}
</style>
