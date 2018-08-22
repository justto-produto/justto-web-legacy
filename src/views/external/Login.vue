<template>
  <div class="external-login-view">
    <el-row>
      <el-col :md="12" class="hidden-sm-and-down">
        <external-sidenav></external-sidenav>
      </el-col>
      <el-col :md="12">
        <el-row type="flex" justify="center" align="middle">
          <el-form label-position="top" ref="loginForm" :model="loginForm" :rules="rules">
            <h1>Login</h1>
            <el-form-item label="Email" prop="email">
              <el-input v-model="loginForm.email"></el-input>
            </el-form-item>
            <el-form-item label="Senha" prop="password">
              <el-input v-model="loginForm.password" type="password"></el-input>
              <el-button @click="$router.push('forgot-password')" type="text" class="forgot-password">Esqueceu sua senha?</el-button>
            </el-form-item>
            <el-button type="primary" @click="submitForm()">Entrar</el-button>
            <el-row class="login-info">
              Ao clicar no botão, eu concordo com os <a href="#"> Termos de Uso</a> e <a href="#">Política de Privacidade.</a>
            </el-row>
            <el-row class="login-info register">
              Não possui conta? <a href="#/register"> Cadastre-se agora mesmo.</a>
            </el-row>
          </el-form>
        </el-row>
      </el-col>
    </el-row>
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
          { required: true, message: 'Este campo é obrigatório', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Este campo é obrigatório', trigger: 'blur' }
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
.external-login-view{
  height: 100%;
  color: #adadad;
  >.el-row, >.el-row>.el-col, >.el-row>.el-col>.el-row {
    height: 100%
  }
  form{
    width: 400px;
    .el-form-item__label{
      color: #adadad;
      font-size: 12px;
      line-height: 30px;
      padding: 0;
    }
    .forgot-password{
      font-size: 12px;
      position: absolute;
      top: 2px;
      right: 8px;
    }
    .el-button--primary{
      width: 100%;
    }
  }
  h1{
    color: #343c4b;
    font-size: 30px;
    margin-bottom: 40px;
  }
  .login-info{
    font-size: 12px;
    text-align: center;
    margin-top: 20px;
  }
}
</style>
