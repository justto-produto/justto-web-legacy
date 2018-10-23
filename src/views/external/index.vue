<template>
  <div class="external-view">
    <el-container>
      <el-aside width="50%" class="hidden-sm-and-down">
        <JusSidenavExternal/>
      </el-aside>
      <el-main class="display-flex">
        <el-form ref="loginForm" :model="loginForm" :rules="rules" label-position="top" class="external-view__form">
          <h1 class="external-view__title">Login</h1>
          <el-form-item label="Email" prop="email">
            <el-input v-model="loginForm.email"/>
          </el-form-item>
          <el-form-item label="Senha" prop="password">
            <el-input v-model="loginForm.password" :type="passwordType"/>
            <div class="el-button--input-float">
              <jus-icon icon="eye" class="external-view__show-password" @click.native="switchShowPassword"/>
              <el-button type="text" @click="$router.push('forgot-password')">
                Esqueceu sua senha?
              </el-button>
            </div>
          </el-form-item>
          <el-button class="external-view__submit" type="primary" @click="submitForm()">Entrar</el-button>
          <el-row class="external-view__info">
            Ao clicar no botão, eu concordo com os <a href="#"> Termos de Uso</a> e <a href="#">Política de Privacidade.</a>
            <br><br>
            Não possui conta? <a href="#/register"> Cadastre-se agora mesmo.</a>
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
  methods: {
    submitForm () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          alert('submit!')
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
