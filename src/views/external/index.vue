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
            <el-input v-model="loginForm.password" type="password"/>
            <el-button type="text" class="el-button--input-float" @click="$router.push('forgot-password')">Esqueceu sua senha?</el-button>
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

<style lang="scss">

.external-view {

  height: 100%;
  main{
    background-color: #fff !important;
  }

  .external-view__title {
    font-size: 2rem;
    margin-bottom: 40px;
  }

  .external-view__form {
    margin: auto;
    width: 400px;
    padding: 20px;
  }

  .external-view__submit {
    width: 100%;
  }

  .external-view__info {
    font-size: 12px;
    text-align: center;
    margin-top: 20px;
  }

}

</style>
