<template>
  <div class="external-view">
    <el-container>
      <el-aside width="50%" class="hidden-sm-and-down">
        <jus-sidenav-external />
      </el-aside>
      <el-main class="display-flex position-relative">
        <jus-button-back to="login"/>
        <el-form
          v-loading="showLoading"
          ref="forgotForm"
          :model="forgotForm"
          :rules="rules"
          class="external-view__form"
          label-position="top"
          @submit.native.prevent="submitForm">
          <h1 class="external-view__title">Recuperar senha</h1>
          <el-alert
            v-show="showSuccess"
            title="Requisição de recuperação enviada com sucesso! Acesse seu email para prosseguir."
            type="success"
            data-testid="showSucess"
            @close="showSuccess = false" />
          <el-form-item label="Email" prop="email">
            <el-input v-model="forgotForm.email" data-testid="forgot-email"/>
          </el-form-item>
          <el-button
            native-type="submit"
            class="external-view__submit"
            type="primary"
            data-testid="submit">
            Recuperar
          </el-button>
          <el-row class="external-view__info">
            Ao clicar no botão, eu concordo com os
            <a href="#">Termos de Uso</a> e
            <a href="#">Política de Privacidade.</a>
          </el-row>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import JusSidenavExternal from '@/components/layouts/JusSidenavExternal'

export default {
  name: 'ForgotPassword',
  components: {
    JusSidenavExternal
  },
  data () {
    return {
      showSuccess: false,
      showLoading: false,
      forgotForm: {
        email: ''
      },
      rules: {
        email: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { type: 'email', required: true, message: 'Insira um e-mail válido', trigger: ['submit'] }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs['forgotForm'].validate(valid => {
        if (valid) {
          this.showSuccess = false
          this.showLoading = true
          this.$store.dispatch('forgotPassword', this.forgotForm.email)
            .then(() => {
              this.showSuccess = true
              this.forgotForm.email = ''
              this.showLoading = false
            })
            .catch(() => {
              this.$jusNotification({ type: 'error' })
              this.forgotForm.email = ''
              this.showLoading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import 'external.scss';
</style>
