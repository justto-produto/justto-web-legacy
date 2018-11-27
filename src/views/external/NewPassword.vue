<template>
  <div class="external-view">
    <el-container>
      <el-aside width="50%" class="hidden-sm-and-down">
        <JusSidenavExternal/>
      </el-aside>
      <el-main class="display-flex position-relative">
        <JusButtonBack to="login"/>
        <el-form
          v-loading="showLoading"
          ref="newPasswordForm"
          :model="newPasswordForm"
          :rules="rules"
          label-position="top"
          class="external-view__form"
          @submit.native.prevent="submitForm">
          <h1 class="external-view__title">Nova senha</h1>
          <el-alert
            v-show="showSuccess"
            type="success"
            show-icon
            title=""
            @close="showSuccess = false">
            <template slot="title"/>
            Senha alterada com sucesso!
            <br>
            <a href="#" @click.prevent="$router.push('login')"> Clique aqui para acessar.</a>
          </el-alert>
          <el-alert
            v-show="showError"
            type="error"
            show-icon
            title=""
            @close="showError = false">
            <template slot="title"/>
            Não foi possível identificar sua requisição de alteração de senha.
            <br>
            <a href="#" @click.prevent="$router.push('forgot-password')"> Clique aqui para tentar novamente.</a>
          </el-alert>
          <el-form-item label="Senha" prop="password">
            <el-input v-model="newPasswordForm.password" type="password"/>
          </el-form-item>
          <el-form-item label="Confirmar senha" prop="confirmPassword">
            <el-input v-model="newPasswordForm.confirmPassword" type="password"/>
          </el-form-item>
          <el-button
            native-type="submit"
            class="external-view__submit"
            type="primary">
            Alterar
          </el-button>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import JusSidenavExternal from '@/components/layouts/JusSidenavExternal'

export default {
  name: 'NewPassword',
  components: {
    JusSidenavExternal
  },
  data () {
    var validatePassword = (rule, value, callback) => {
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
  beforeCreate () {
    if (!this.$route.query.token) {
      this.$router.push('/')
    }
  },
  created () {
    this.token = this.$route.query.token
  },
  methods: {
    submitForm () {
      this.$refs['newPasswordForm'].validate((valid) => {
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
            .catch(error => {
              this.showError = true
              this.showLoading = false
              console.log(error)
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
