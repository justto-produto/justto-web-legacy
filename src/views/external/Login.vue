<template>
  <div class="external-view">
    <el-container>
      <el-aside width="50%" class="hidden-sm-and-down">
        <jus-sidenav-external />
      </el-aside>
      <el-main class="display-flex">
        <el-form
          v-loading="showLoading"
          v-if="!workspaces.length"
          ref="loginForm"
          :model="loginForm"
          :rules="rules"
          label-position="top"
          class="external-view__form"
          @submit.native.prevent="doLogin">
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
        <el-form
          v-loading="showLoading"
          ref="workspaceForm"
          :model="workspaceForm"
          :rules="workspaceRules"
          v-else
          label-position="top"
          class="external-view__form"
          @submit.native.prevent="selectWorkspace">
          <h1 class="external-view__title">Equipe</h1>
          <p>Selecione uma de suas equipes de trabalho para entrar.</p>
          <el-form-item label="Equipe" prop="selectedWorkspace">
            <el-select v-model="workspaceForm.selectedWorkspaceIndex" placeholder="Selecione">
              <el-option
                v-for="(w, index) in workspaces"
                :key="index"
                :value="index"
                :label="w.workspace.name" />
            </el-select>
          </el-form-item>
          <el-button
            native-type="submit"
            class="external-view__submit"
            type="primary"
            data-testid="submit">
            Selecionar e entrar
          </el-button>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Login',
  components: {
    JusSidenavExternal: () => import('@/components/layouts/JusSidenavExternal')
  },
  data () {
    return {
      workspaces: [],
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
      },
      workspaceForm: {
        selectedWorkspaceIndex: ''
      },
      workspaceRules: {
        selectedWorkspaceIndex: [{ required: true, message: 'Campo obrigatório', trigger: ['blur', 'submit'] }]
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
    doLogin () {
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
                  workspace: this.$store.getters.workspaceSubdomain
                })
                if (responses[1].length > 1) {
                  this.showLoading = false
                  this.workspaces = responses[1]
                } else {
                  this.getMembersAndRedirect(responses[1][0])
                }
              }).catch(error => {
                console.error(error)
                this.mountError()
              })
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
    getMembersAndRedirect (workspace) {
      this.$store.commit('updateWorkspace', workspace)
      if (workspace.person) this.$store.commit('setLoggedPerson', workspace.person)
      this.$store.dispatch('getWorkspaceMembers')
        .then(() => {
          this.$router.push('/management')
        }).catch(error => {
          console.error(error)
          this.mountError()
        })
    },
    selectWorkspace () {
      this.$refs['workspaceForm'].validate(valid => {
        if (valid) {
          this.getMembersAndRedirect(this.workspaces[this.workspaceForm.selectedWorkspaceIndex])
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
