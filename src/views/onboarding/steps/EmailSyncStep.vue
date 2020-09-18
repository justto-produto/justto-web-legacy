<template>
  <div class="onboarding-step-content onboarding-email-step">
    <div class="onboarding-step-content__title">
      <h2>Deseja sincronizar o seu e-mail com a plataforma?</h2>
      <p>
        Uma das formas que utilizamos para negociar suas disputas é o e-mail. Mais adiante você poderá ver as mensagens
        que nosso sistema enviará. Contudo, é importante que você sincronize sua caixa de e-mails com o nosso sistema
        para que as respostas sejam capturadas pela plataforma.
      </p>
    </div>
    <el-form
      ref="syncForm"
      :model="syncForm"
      :rules="syncFormRules"
      label-position="top"
      @submit.native.prevent="submitForm"
    >
      <el-form-item
        label="E-mail de trabalho"
        prop="email"
        type="text"
      >
        <el-input
          v-model="syncForm.email"
          :readonly="synced"
          name="email"
        />
      </el-form-item>
      <el-form-item
        v-if="!synced"
        label="Senha do e-mail"
        prop="password"
      >
        <el-input
          v-model="syncForm.password"
          type="password"
          name="password"
        />
      </el-form-item>
    </el-form>
    <el-alert
      v-if="showSuccess"
      title="E-mail sincronizado com sucesso!"
      type="success"
    />
    <el-alert
      v-if="showError"
      title="Não conseguimos sincronizar o seu e-mail. Verifique as credenciais e tente novamente."
      type="error"
    />
    <div class="email-step--status">
      Status:
      <strong>{{ message }}</strong>
    </div>
    <el-button
      v-if="!synced"
      type="primary"
      @click="syncEmail"
    >
      Sincronizar
    </el-button>
    <el-button
      v-if="synced"
      type="primary"
      @click="$emit('onboarding:step:next')"
    >
      Próximo
    </el-button>
    <el-button
      v-if="!synced"
      type="text"
      @click="nextStep()"
    >
      Pular
    </el-button>
  </div>
</template>

<script>

export default {
  components: {
    JusLogoCompany: () => import('@/components/images/JusLogoCompany'),
  },
  data() {
    return {
      showSuccess: false,
      showError: false,
      synced: false,
      syncForm: {
        email: '',
        password: '',
      },
      syncFormRules: {
        email: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { type: 'email', required: true, message: 'Insira um e-mail válido', trigger: ['submit'] },
        ],
        password: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
        ],
      },
    }
  },
  onCreate() {
    if (this.$store.state.workspaceModule.emailAccount) {
      this.syncForm.email = this.$store.state.workspaceModule.emailAccount
    }
  },
  computed: {
    message() {
      return this.synced ? 'SINCRONIZADO' : 'AGUARDANDO SINCRONIZAÇÃO'
    },
    type() {
      return this.synced ? 'success' : 'warning'
    },
  },
  methods: {
    syncEmail() {
      this.showSuccess = false
      this.showError = false
      this.$refs.syncForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch('showLoading')
          this.$store.dispatch('syncInbox', this.syncForm)
            .then(response => {
              this.showSuccess = true
              this.synced = true
              this.$store.dispatch('myAccount')
            }).catch(() => {
              this.showError = true
            }).finally(() => {
              this.$store.dispatch('hideLoading')
            })
        } else {
          return false
        }
      })
    },
    nextStep() {
      this.$emit('onboarding:step:next')
    },
  },
}
</script>

<style lang="scss">
.onboarding-email-step {
  .el-alert {
    max-width: 400px;
    margin-bottom: 20px;
  }
  .email-step--status {
    margin-bottom: 20px;
    strong {
      margin: 0 8px 0 4px;
    }
  }
  @media (max-width: 991px) {
    p {
      display: none;
    }
    .el-checkbox__label {
      width: 100%;
    }
    img {
      width: 4rem !important;
      height: 4rem !important;
    }
  }
}
</style>
