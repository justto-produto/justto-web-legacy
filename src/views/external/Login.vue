<template>
  <div class="external-view">
    <el-container>
      <el-aside width="50%" class="hidden-sm-and-down">
        <external-sidenav></external-sidenav>
      </el-aside>
      <el-main class="el-main--flex">
        <el-form class="external-view__form" label-position="top" ref="loginForm" :model="loginForm" :rules="rules">
          <h1 class="external-view__title">Login</h1>
          <el-form-item label="Email" prop="email">
            <el-input v-model="loginForm.email"></el-input>
          </el-form-item>
          <el-form-item label="Senha" prop="password">
            <el-input v-model="loginForm.password" type="password"></el-input>
            <el-button @click="$router.push('forgot-password')" type="text" class="external-view__forgot">Esqueceu sua senha?</el-button>
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
import ExternalSidenav from '@/components/layouts/ExternalSidenav'

export default {
  name: 'Login',
  components: {
    ExternalSidenav
  },
  data () {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          { required: true, message: 'Este campo é obrigatório', trigger: 'submit' },
          { type: 'email', required: true, message: 'Insira um e-mail válido', trigger: ['submit'] }
        ],
        password: [
          { required: true, message: 'Este campo é obrigatório', trigger: 'submit' }
        ]
      }
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
    }
  }
}
</script>
