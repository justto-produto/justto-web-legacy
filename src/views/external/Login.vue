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
            data-testid="register-success"
            @close="showSuccess = false"/>
          <el-form-item label="Email" prop="email">
            <el-input
              v-model="loginForm.email"
              type="email"
              name="login-email"
              data-testid="login-email"/>
          </el-form-item>
          <el-form-item label="Senha" prop="password">
            <el-input
              v-model="loginForm.password"
              :type="passwordType"
              name="login-password"
              data-testid="login-password"/>
            <div class="el-button--input-float">
              <jus-icon
                :icon="showPassword ? 'hide' : 'eye'"
                class="external-view__show-password"
                @click.native="switchShowPassword"/>
              <el-button
                type="text"
                tabindex="-1"
                data-testid="forgot-password"
                @click="$router.push('forgot-password')">
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
            <a data-testid="use-terms" href="https://justto.com.br/termos-de-uso/" target="_blank"> Termos de Uso</a> e com os
            <a data-testid="contract-terms" href="https://justto.com.br/termos-de-contratacao/" target="_blank">Termos Gerais de Contratação.</a>
            <br><br>
            Não possui conta?
            <a href="register" data-testid="register" @click.prevent="$router.push('register')">Cadastre-se agora mesmo.</a>
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
    if (this.$store.getters.isLoggedIn) {
      this.$store.dispatch('logout')
    }
  },
  created () {
    if (this.$route.query.token) {
      this.$store.dispatch('activate', this.$route.query.token)
        .then(() => {
          this.showSuccess = true
        })
        .finally(() => {
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
                let workspaceMember = responses[1][0]
                let { workspace } = workspaceMember
                if (workspaceMember && workspace.subDomain) {
                  Promise.all([
                    this.$store.dispatch('getWorkspaceMembers'),
                    this.$store.dispatch('myPerson')
                  ]).then(() => {
                    setTimeout(function () {
                      this.$router.push('/management')
                    }.bind(this), 1000)
                  }).catch(() => this.mountError())
                } else {
                  this.$router.push('/management')
                }
              }).catch(() => this.mountError())
            })
            .catch(error => {
              if (error.response && (error.response.status === 401 || error.response.data.code === 'INVALID_CREDENTIALS')) {
                this.mountError('E-mail não cadastrado ou senha incorreta.')
              } else {
                this.mountError()
              }
            })
        } else {
          return false
        }
      })
    },
    switchShowPassword () {
      this.showPassword = !this.showPassword
    },
    mountError (message) {
      this.errorMessage = message || `Houve uma falha de conexão com o servidor.
      Tente novamente ou entre em contato com o administrador do sistema.`
      this.showError = true
      this.showLoading = false
    }
  }
}
</script>

<style lang="scss">
  @import 'external.scss';
</style>
