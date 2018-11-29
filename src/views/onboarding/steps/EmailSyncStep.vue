<template lang="html">
  <div class="onboarding-step-content onboarding-email-step" v-loading="loading">
    <div class="onboarding-step-content__title">
      <h2>Deseja sincronizar o seu e-mail com a plataforma?</h2>
      <p>
        Uma das formas que utilizamos para negociar seus casos é o e-mail. Mais adiante você poderá ver as mensagens
        que nosso sistema enviará. Contudo, é importante que você sincronize sua caixa de e-mails com o nosso sistema
        para que as respostas sejam capturadas pela plataforma.
      </p>
    </div>
    <el-form
      ref="syncForm"
      :model="syncForm"
      :rules="syncFormRules"
      label-position="top"
      @submit.native.prevent="submitForm">
      <el-form-item label="E-mail de trabalho" prop="email">
        <el-input v-model="syncForm.email"/>
      </el-form-item>
      <el-form-item label="Senha do e-mail" prop="password">
        <el-input v-model="syncForm.password" type="password"/>
      </el-form-item>
    </el-form>
    <!-- <el-checkbox v-model="checked1" border class="el-checkbox--active">
      <JusLogoCompany src="outlook.png" shape="square"/>
      <div class="el-checkbox__content">
        <h3>Microsoft</h3>
        <p>Suas informações estão protegidas e nunca serão compartilhadas com terceiros.</p>
      </div>
    </el-checkbox>
    <el-checkbox v-model="checked2" border class="el-checkbox--active">
      <JusLogoCompany src="inbox.png" shape="square"/>
      <div class="el-checkbox__content">
        <h3>Inbox</h3>
        <p>Suas informações estão protegidas e nunca serão compartilhadas com terceiros.</p>
      </div>
    </el-checkbox> -->
    <el-alert
      v-if="showSuccess"
      title="E-mail sincronizado com sucesso!"
      type="success"/>
    <el-alert
      v-if="showError"
      title="Não conseguimos sincronizar o seu e-mail. Verifique as credenciais e tente novamente."
      type="error"/>
    <el-button v-if="!synced" type="primary" @click="syncEmail">
      Sincronizar
    </el-button>
    <el-button v-if="synced" type="primary" @click="nextStep">
      Próximo
    </el-button>
    <el-button type="text" @click="$emit('onboarding:step:next')">Pular</el-button>
  </div>
</template>

<script>
import JusLogoCompany from '@/components/images/JusLogoCompany'

export default {
  components: {
    JusLogoCompany
  },
  data () {
    return {
      loading: false,
      synced: false,
      showSuccess: false,
      showError: false,
      syncForm: {
        email: '',
        password: ''
      },
      syncFormRules: {
        email: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { type: 'email', required: true, message: 'Insira um e-mail válido', trigger: ['submit'] }
        ],
        password: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' }
        ]
      }
    }
  },
  methods: {
    syncEmail () {
      this.showSuccess = false
      this.showError = false
      this.$refs['syncForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          // setTimeout(function () {
          //   this.loading = false
          //   this.showSuccess = true
          //   this.synced = true
          // }.bind(this), 1500)
          setTimeout(function () {
            this.loading = false
            this.showError = true
          }.bind(this), 1500);
        } else {
          return false
        }
      })
    },
    nextStep () {
      $emit('onboarding:step:next')
    }
  }
}
</script>

<style lang="scss">
.onboarding-email-step {
  .el-alert {
    max-width: 400px;
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
