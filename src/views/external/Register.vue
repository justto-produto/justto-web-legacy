<template>
  <div class="external-view">
    <el-container>
      <el-aside width="50%" class="hidden-sm-and-down">
        <JusSidenavExternal/>
      </el-aside>
      <el-main class="display-flex">
        <el-form
          v-loading="showLoading"
          ref="registerForm"
          :model="registerForm"
          :rules="rules"
          class="external-view__form"
          label-position="top"
          @submit.native.prevent="submitForm">
          <h1 class="external-view__title">Cadastre-se</h1>
          <el-alert
            v-show="showError"
            :title="errorMessage"
            type="error"
            @close="showError = false"/>
          <el-alert
            v-show="showSuccess"
            title="Cadastro realizado com sucesso! Acesse seu email para prosseguir."
            type="success"
            @close="showSuccess = false"/>
          <el-form-item label="Nome" prop="name">
            <el-input v-model="registerForm.name" name="register-name"/>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="registerForm.email" name="register-email"/>
          </el-form-item>
          <el-form-item label="Senha" prop="password">
            <el-input v-model="registerForm.password" :type="passwordType" name="register-password"/>
            <div class="el-button--input-float">
              <jus-icon
                :icon="showPassword ? 'hide' : 'eye'"
                class="external-view__show-password"
                @click.native="switchShowPassword"/>
            </div>
          </el-form-item>
          <el-button
            native-type="submit"
            class="external-view__submit"
            type="primary">
            Cadastrar
          </el-button>
          <el-row class="external-view__info">
            Ao clicar no botão, eu concordo com os <a href="#"> Termos de Uso</a> e <a href="#">Política de Privacidade.</a>
            <br><br>
            Já possui conta? <a href="login" @click.prevent="$router.push('login')"> Clique aqui para acessar.</a>
          </el-row>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import JusSidenavExternal from '@/components/layouts/JusSidenavExternal'

export default {
  name: 'Register',
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
      registerForm: {
        name: '',
        email: '',
        password: ''
      },
      rules: {
        name: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' }
        ],
        email: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { type: 'email', required: true, message: 'Insira um e-mail válido', trigger: 'submit' }
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
    this.$store.dispatch('logout', { redirect: false })
  },
  methods: {
    submitForm () {
      let self = this
      this.$refs['registerForm'].validate((valid) => {
        self.showError = false
        self.showSuccess = false
        if (valid) {
          self.showLoading = true
          this.$store.dispatch('register', this.registerForm)
            .then(() => {
              self.showSuccess = true
              self.registerForm.name = ''
              self.registerForm.email = ''
              self.registerForm.password = ''
              self.showLoading = false
            })
            .catch(error => {
              if (error.response && error.response.data.code === 'ALREADY_EXISTS') {
                this.errorMessage = 'Já existe um usuário cadastrado com este e-mail.'
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
