<template>
  <div class="external-view">
    <el-container>
      <el-aside
        width="50%"
        class="hidden-sm-and-down"
      >
        <jus-sidenav-external />
      </el-aside>
      <el-main class="display-flex">
        <el-form
          v-if="!workspaces.length"
          ref="loginForm"
          v-loading="showLoading"
          :element-loading-text="loadingText"
          :model="loginForm"
          :rules="rules"
          label-position="top"
          class="external-view__form"
          @submit.native.prevent="doLogin"
        >
          <h1 class="external-view__title">
            Login
          </h1>
          <el-alert
            v-show="showError"
            :title="errorMessage"
            type="error"
            data-testid="login-failure"
            @close="showError = false"
          />
          <el-alert
            v-show="showSuccess"
            title="Cadastro ativado com sucesso!"
            type="success"
            data-testid="register-success"
            @close="showSuccess = false"
          />
          <el-form-item
            label="Email"
            prop="email"
          >
            <el-input
              v-model="loginForm.email"
              type="email"
              name="login-email"
              data-testid="login-email"
            />
          </el-form-item>
          <el-form-item
            label="Senha"
            prop="password"
          >
            <el-input
              v-model="loginForm.password"
              :type="passwordType"
              name="login-password"
              data-testid="login-password"
            />
            <div class="el-button--input-float">
              <jus-icon
                :icon="showPassword ? 'hide' : 'eye'"
                class="external-view__show-password"
                @click.native="switchShowPassword"
              />
              <el-button
                type="text"
                tabindex="-1"
                data-testid="forgot-password"
                @click="$router.push('forgot-password')"
              >
                Esqueceu sua senha?
              </el-button>
            </div>
          </el-form-item>
          <el-button
            native-type="submit"
            class="external-view__submit"
            type="primary"
            data-testid="submit-login"
          >
            Entrar
          </el-button>
          <el-row class="external-view__info">
            Ao clicar em Entrar, eu concordo com os
            <a
              data-testid="use-terms"
              href="https://justto.com.br/termos-de-uso/"
              target="_blank"
            > Termos de Uso</a>, com os
            <a
              data-testid="contract-terms"
              href="https://justto.com.br/termos-de-contratacao/"
              target="_blank"
            >Termos Gerais de Contratação</a> e a
            <a
              data-testid="contract-terms"
              href="https://justto.com.br/poilitica-privacidade/"
              target="_blank"
            >Política de Privacidade</a>.
          </el-row>
        </el-form>
        <el-form
          v-else
          ref="workspaceForm"
          v-loading="showLoading"
          :model="workspaceForm"
          :rules="workspaceRules"
          label-position="top"
          class="external-view__form"
          @submit.native.prevent="selectWorkspace"
        >
          <h1 class="external-view__title">
            Equipe
          </h1>
          <p>Selecione uma de suas equipes de trabalho para entrar.</p>
          <el-form-item
            label="Equipe"
            prop="selectedWorkspaceIndex"
          >
            <el-select
              v-model="workspaceForm.selectedWorkspaceIndex"
              placeholder="Selecione"
              filterable
              data-testid="select-workspace"
            >
              <el-option
                v-for="(w, index) in workspaces"
                :key="index"
                :value="index"
                :label="w.workspace.teamName"
                data-testid="select-workspace-item"
              />
            </el-select>
          </el-form-item>
          <el-button
            native-type="submit"
            class="external-view__submit"
            type="primary"
            data-testid="submit-workspace"
          >
            Selecionar e entrar
          </el-button>
          <br><br>
          <el-button
            v-if="$store.getters.isJusttoAdmin"
            class="external-view__submit"
            type="secondary"
            icon="el-icon-s-operation"
            @click="$router.push('admin-panel')"
          >
            Painel administrativo
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
  data() {
    return {
      loadingText: 'Autenticando...',
      loadingIndex: 0,
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
        selectedWorkspaceIndex:
        [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      }
    }
  },
  computed: {
    passwordType() {
      return this.showPassword ? 'text' : 'password'
    }
  },
  beforeMount() {
    if (this.$store.getters.isLoggedIn) {
      this.$store.dispatch('logout')
    }
  },
  created() {
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
    getErrorMessage() {
      const messages = [
        'Aguarde um momento que já iremos lhe autenticar',
        'O serviço de autenticação de usuários está sendo atualizado para aplicar melhorias e mais segurança',
        'Atualizando o serviço de autenticação de usuário'
      ]
      const msg = messages[this.loadingIndex % 3]
      this.loadingIndex += 1
      return msg
    },
    doLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.showError = false
          this.showLoading = true

          this.$store.dispatch('login', this.loginForm)
            .then(() => {
              this.$store.dispatch('myAccount').then(this.getMyWorkspaces).catch(error => {
                this.$jusNotification({ error })
                this.showLoading = false
              })
            })
            .catch(error => {
              localStorage.removeItem('justoken')
              if (error.response && (error.response.status === 401 || error.response.data.code === 'INVALID_CREDENTIALS')) {
                this.mountError('E-mail não cadastrado ou senha incorreta.')
              } else {
                this.loadingText = this.getErrorMessage()
                setTimeout(this.doLogin, 6000)
                // this.showLoading = false
                // this.$jusNotification({ error })
              }
            })
        } else {
          return false
        }
      })
    },
    getMyWorkspaces() {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('myWorkspace').then(response => {
          this.$jusSegment('Usuário logado')
          if (response.length > 1) {
            this.showLoading = false
            this.workspaces = response
          } else if (response.length === 0) {
            this.$router.push('/onboarding')
          } else {
            this.getMembersAndRedirect(response[0])
          }
          resolve(response)
        }).catch(error => {
          this.$jusNotification({ error })
          this.showLoading = false
          reject(error)
        })
      })
    },
    getMembersAndRedirect(response) {
      // SEGMENT TRACK
      this.$jusSegment('Seleção de Workspace', {
        workspace: response.workspace.name,
        team: response.workspace.teamName
      })
      if (response.workspace) this.$store.commit('setWorkspace', response.workspace)
      if (response.profile) this.$store.commit('setProfile', response.profile)
      if (response.person) {
        this.$store.commit('setLoggedPerson', response.person)
      }
      this.$store.dispatch('getWorkspaceMembers')
        .then(() => {
          if (window.innerWidth <= 900) {
            this.$router.push('/negotiation')
          } else {
            this.$router.push('/')
          }
        }).catch(error => {
          console.error(error)
          this.mountError()
        })
    },
    selectWorkspace() {
      this.$refs.workspaceForm.validate(valid => {
        if (valid) {
          const selectedWorkspace = this.workspaces[this.workspaceForm.selectedWorkspaceIndex]
          if (selectedWorkspace.person) {
            this.getMembersAndRedirect(selectedWorkspace)
          } else {
            this.$store.dispatch('ensureWorkspaceAccesss', selectedWorkspace.workspace.id).then((res) => {
              this.$store.commit('setToken', res)
              this.getMyWorkspaces().then((response) => {
                this.getMembersAndRedirect(response[this.workspaceForm.selectedWorkspaceIndex])
              })
            })
          }
        }
      })
    },
    switchShowPassword() {
      this.showPassword = !this.showPassword
    },
    mountError(message) {
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
