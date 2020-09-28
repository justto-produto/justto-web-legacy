<template>
  <div class="external-view">
    <el-container>
      <el-aside
        width="50%"
        class="hidden-sm-and-down"
      >
        <jus-sidenav-external />
      </el-aside>
      <el-main class="display-flex position-relative">
        <jus-button-back to="/login" />
        <el-form
          ref="newPasswordForm"
          v-loading="showLoading"
          :model="newPasswordForm"
          :rules="rules"
          label-position="top"
          class="external-view__form"
          @submit.native.prevent="submitForm"
        >
          <h1 class="external-view__title">
            Nova senha
          </h1>
          <el-alert
            v-show="showSuccess"
            type="success"
            show-icon
            title=""
            data-testid="new-password-success"
            @close="showSuccess = false"
          >
            <template slot="title" />
            Senha alterada com sucesso!
            <br>
            <router-link
              to="/login"
              data-testid="go-login"
            >
              Clique aqui para acessar.
            </router-link>
          </el-alert>
          <el-alert
            v-show="showError"
            type="error"
            show-icon
            title=""
            data-testid="new-password-failure"
            @close="showError = false"
          >
            <template slot="title" />
            Não foi possível identificar sua requisição de alteração de senha.
            <br>
            <router-link
              to="/forgot-password"
              data-testid="try-again"
            >
              Clique aqui para tentar novamente.
            </router-link>
          </el-alert>
          <el-form-item
            label="Senha"
            prop="password"
          >
            <el-input
              v-model="newPasswordForm.password"
              type="password"
              data-testid="new-password"
            />
          </el-form-item>
          <el-form-item
            label="Confirmar senha"
            prop="confirmPassword"
          >
            <el-input
              v-model="newPasswordForm.confirmPassword"
              type="password"
              data-testid="confirm-password"
            />
          </el-form-item>
          <el-button
            native-type="submit"
            class="external-view__submit"
            type="primary"
            data-testid="submit"
          >
            Alterar
          </el-button>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'NewPassword',
  components: {
    JusSidenavExternal: () => import('@/components/layouts/JusSidenavExternal')
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value !== this.newPasswordForm.password) {
        callback(new Error('Campos não correspondem'))
      } else {
        callback()
      }
    }
    return {
      showSuccess: false,
      showError: false,
      showLoading: false,
      token: '',
      newPasswordForm: {
        password: '',
        confirmPassword: ''
      },
      rules: {
        password: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' }
        ],
        confirmPassword: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validatePassword, trigger: 'submit' }
        ]
      }
    }
  },
  beforeCreate() {
    // if (!this.$route.query.token) {
    //   this.$router.push('/')
    // }
  },
  created() {
    this.token = this.$route.params.token
  },
  methods: {
    submitForm() {
      this.$refs.newPasswordForm.validate(valid => {
        if (valid) {
          this.showLoading = true
          this.showSuccess = false
          this.showError = false
          this.$store.dispatch('resetPassword', { token: this.token, password: this.newPasswordForm.password })
            .then(() => {
              this.showSuccess = true
              this.showLoading = false
              this.newPasswordForm.password = ''
              this.newPasswordForm.confirmPassword = ''
            })
            .catch(() => {
              this.showError = true
              this.showLoading = false
            })
        } else {
          return false
        }
      })
    },
    switchShowPassword() {
      this.showPassword = !this.showPassword
    }
  }
}
</script>

<style lang="scss">
  @import 'external.scss';
</style>
