<template>
  <div class="onboarding-step-content onboarding-subdomain-step">
    <div class="onboarding-step-content__title">
      <h2>Crie o seu espaço de trabalho na Justto</h2>
      <p>
        Abaixo você irá configurar o seu link de acesso ao sistema da Justto. Escolha um nome que seja fácil lembrar
        para você e sua equipe. Recomendamos o nome do seu escritório ou empresa.
        <br><br>
        Observação: Não é permitido usar acentuação ou caracteres especiais.
      </p>
    </div>
    <el-form
      ref="subdomainForm"
      :model="subdomainForm"
      :rules="subdomainFormRules"
      label-position="top"
      @submit.native.prevent="submitForm">
      <span>https://</span>
      <el-form-item prop="subdomain">
        <el-input v-model="subdomainForm.subdomain" :readonly="creatingWorkspace" name="subdomain"/>
      </el-form-item>
      <span>.acordo.pro</span>
    </el-form>
    <br>
    <el-alert
      v-show="subdomainForm.subdomain.length >= 3 && !creatingWorkspace"
      :title="availabilityAlert.title"
      :type="availabilityAlert.type"
      :closable="false"/>
    <el-button type="primary" @click="submitForm">Próximo</el-button>
  </div>
</template>

<script>
export default {
  props: {
    isGuest: {
      type: Boolean,
      default: false
    }
  },
  data () {
    var validateSubdomainName = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('Necessário ao menos 3 caracteres.'))
      }
      if (/[^A-Z0-9]/gi.test(value)) {
        callback(new Error('Formato inválido'))
      } else {
        callback()
      }
    }
    var validateSubdomainAvailability = (rule, value, callback) => {
      if (value.length >= 3) {
        this.$store.dispatch('verifyAvailability', value)
          .then((available) => {
            if (available) {
              this.isAvailable = true
              callback()
            } else {
              this.isAvailable = false
              callback(new Error(' '))
            }
          })
          .catch(error => {
            callback(error)
          })
      }
    }
    return {
      isAvailable: true,
      subdomainForm: {
        subdomain: this.$store.state.workspace.subDomain
      },
      subdomainFormRules: {
        subdomain: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validateSubdomainName, trigger: 'submit' },
          { validator: validateSubdomainAvailability, trigger: 'submit' }
        ]
      }
    }
  },
  computed: {
    availabilityAlert: function () {
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
    creatingWorkspace: function () {
      return this.$store.getters.creatingWorkspace
    }
  },
  methods: {
    submitForm () {
      if (!this.creatingWorkspace) {
        this.$refs['subdomainForm'].validate((valid) => {
          if (valid) {
            this.$emit('onboarding:createSubdomain', { subDomain: this.subdomainForm.subdomain })
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
