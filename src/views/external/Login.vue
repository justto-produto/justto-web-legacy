<template>
  <div class="external-login">
    <el-row>
      <el-col :span="12">
        <external-sidenav></external-sidenav>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="center" align="middle">
          <el-form label-position="top" :model="formLabelAlign">
            <h1>Login</h1>
            <external-social-button type="facebook"></external-social-button>
            <external-social-button type="google"></external-social-button>
            <el-row type="flex" justify="center" style="margin: 32px 0 8px;">
              ou
            </el-row>
            <el-form-item label="Email">
              <el-input v-model="formLabelAlign.region"></el-input>
            </el-form-item>
            <el-form-item label="Senha">
              <el-input v-model="formLabelAlign.type"></el-input>
              <el-button type="text" class="forgot-password">Esqueceu sua senha?</el-button>
            </el-form-item>
            <el-button type="primary">Entrar</el-button>
            <el-row class="login-therms">
              Ao clicar no botão, eu concordo com os <a href="#"> Termos de Uso</a> e <a href="#">Política de Privacidade.</a>
            </el-row>
          </el-form>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ExternalSidenav from '@/components/layout/ExternalSidenav'
import ExternalSocialButton from '@/components/buttons/ExternalSocialButton'

export default {
  name: 'Login',
  components: {
    ExternalSidenav,
    ExternalSocialButton
  },
  data () {
    return {
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      }
    }
  }
}
</script>

<style lang="scss">
.external-login{
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
    }
    .forgot-password{
      font-size: 10px;
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
  .login-therms{
    font-size: 10px;
    text-align: center;
    margin-top: 20px;
  }
}
</style>
