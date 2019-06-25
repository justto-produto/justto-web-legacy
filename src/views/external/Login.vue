<template>
  <div class="external-view">
    <el-container>
      <el-aside width="50%" class="hidden-sm-and-down">
        <jus-sidenav-external />
      </el-aside>
      <el-main class="display-flex">
        <el-form
          v-loading="showLoading"
          ref="loginForm"
          :model="loginForm"
          :rules="rules"
          label-position="top"
          class="external-view__form"
          @submit.native.prevent="submitForm">
          <h1 class="external-view__title">Login</h1>
          <el-alert
            v-show="showError"
            :title="errorMessage"
            type="error"
            data-testid = "login-failure"
            @close="showError = false"/>
          <el-alert
            v-show="showSuccess"
            title="Cadastro ativado com sucesso!"
            type="success"
            @close="showSuccess = false"/>
          <el-form-item label="Email" prop="email">
            <el-input v-model="loginForm.email" type="email" name="login-email" data-testid="login-email"/>
          </el-form-item>
          <el-form-item label="Senha" prop="password">
            <el-input v-model="loginForm.password" :type="passwordType" name="login-password" data-testid="login-password"/>
            <div class="el-button--input-float">
              <jus-icon
                :icon="showPassword ? 'hide' : 'eye'"
                class="external-view__show-password"
                @click.native="switchShowPassword"/>
<<<<<<< HEAD
              <el-button type="text" @click="$router.push('forgot-password')" data-testid="forgot-password">
=======
              <el-button type="text" data-testid="forgot-password" @click="$router.push('forgot-password')">
>>>>>>> d203b33799ea528e2635b4247337ab222a97b958
                Esqueceu sua senha?
              </el-button>
            </div>
          </el-form-item>
          <el-button
            native-type="submit"
            class="external-view__submit"
            type="primary"
            data-testid="submit">
            Entrar
          </el-button>
          <el-row class="external-view__info">
            Ao clicar em Entrar, eu concordo com os
            <a href="https://drive.google.com/file/d/1PzrxBPZ4gL2o_UA01k5sSXnwgaXJ3dmu/view?usp=sharing"> Termos de Uso</a> e com os
            <a href="https://drive.google.com/file/d/1kTb1y8lwIeA_utrOOjIlhZ97iGRS3b-r/view" target="_blank">Termos Gerais de Contratação.</a>
            <br><br>
            Não possui conta?
<<<<<<< HEAD
            <a href="register" @click.prevent="$router.push('register')" data-testid="register"> Cadastre-se agora mesmo.</a>
=======
            <a href="register" data-testid="register" @click.prevent="$router.push('register')"> Cadastre-se agora mesmo.</a>
>>>>>>> d203b33799ea528e2635b4247337ab222a97b958
          </el-row>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import JusSidenavExternal from '@/components/layouts/JusSidenavExternal'

export default {
  name: 'Login',
  components: {
    JusSidenavExternal
  },
  data () {
    return {
      showPassword: false,
      showError: false,
      showSuccess: false,
      showLoading: false,
      errorMessage: '',
      loginForm: {
        email: '',
        password: ''
      },
      rules: {
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
  computed: {
    passwordType () {
      return this.showPassword ? 'text' : 'password'
    }
  },
  beforeMount () {
    this.$store.dispatch('logout')
  },
  created () {
    if (this.$route.query.token) {
      this.$store.dispatch('activate', this.$route.query.token)
        .then(() => {
          this.showSuccess = true
          this.$router.push('login')
        })
        .catch(() => {
          this.$router.push('login')
        })
    }
  },
  methods: {
    submitForm () {
      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          this.showError = false
          this.showLoading = true
          this.$store.dispatch('login', this.loginForm)
            .then(() => {
              Promise.all([
                this.$store.dispatch('myAccount'),
                this.$store.dispatch('myWorkspace')
              ]).then(responses => {
                window.analytics.identify(this.loginForm.email, {
                  action: 'LOGIN',
                  email: this.loginForm.email,
                  workspace: this.$store.state.workspaceModule.subdomain
                })
                window.analytics.group(this.$store.state.workspaceModule.subdomain)
                this.$router.push('/management')
              }).catch(() => {
                this.errorMessage = `Houve uma falha de conexão com o servidor.
                Tente novamente ou entre em contato com o administrador do sistema.`
                this.showError = true
                this.showLoading = false
              })
            })
            .catch(error => {
              if (error.response && (error.response.status === 401 || error.response.data.code === 'INVALID_CREDENTIALS')) {
                this.errorMessage = 'E-mail não cadastrado ou senha incorreta.'
              } else {
                this.errorMessage = `Houve uma falha de conexão com o servidor.
                Tente novamente ou entre em contato com o administrador do sistema.`
              }
              this.showError = true
              this.showLoading = false
            })
        } else {
          return false
        }
      })
    },
    switchShowPassword () {
      this.showPassword = !this.showPassword
    }
  }
}
</script>

<style lang="scss">
  @import 'external.scss';
</style>
