<template>
  <div class="external-view">
    <el-container>
      <el-aside width="50%" class="hidden-sm-and-down">
        <JusSidenavExternal />
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
            @close="showError = false"/>
          <el-alert
            v-show="showSuccess"
            title="Cadastro ativado com sucesso!"
            type="success"
            @close="showSuccess = false"/>
          <el-form-item label="Email" prop="email">
            <el-input v-model="loginForm.email" type="email" name="login-email"/>
          </el-form-item>
          <el-form-item label="Senha" prop="password">
            <el-input v-model="loginForm.password" :type="passwordType" name="login-password"/>
            <div class="el-button--input-float">
              <jus-icon
                :icon="showPassword ? 'hide' : 'eye'"
                class="external-view__show-password"
                @click.native="switchShowPassword"/>
              <el-button type="text" @click="$router.push('forgot-password')">
                Esqueceu sua senha?
              </el-button>
            </div>
          </el-form-item>
          <el-button
            native-type="submit"
            class="external-view__submit"
            type="primary">
            Entrar
          </el-button>
          <el-row class="external-view__info">
            Ao clicar no botão, eu concordo com os
            <a href="#"> Termos de Uso</a> e
            <a href="#">Política de Privacidade.</a>
            <br><br>
            Não possui conta?
            <a href="register" @click.prevent="$router.push('register')"> Cadastre-se agora mesmo.</a>
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
  beforeCreate () {
    this.$store.dispatch('logout')
  },
  created () {
    if (this.$route.query.token) {
      this.$store.dispatch('activate', this.$route.query.token)
        .then(() => {
          this.showSuccess = true
          this.$router.push('login')
        })
        .catch(error => {
          console.error(error)
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
              ]).then(() => {
                this.$router.push('/')
                this.$store.dispatch('myPerson')
                this.$store.dispatch('getWorkspaceMembers')
              }).catch(error => {
                console.error(error)
                this.errorMessage = `Houve uma falha de conexão com o servidor.
                Tente novamente ou entre em contato com o administrador do sistema.`
                this.showError = true
                this.showLoading = false
              })
            })
            .catch(error => {
              console.error(error.response)
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
