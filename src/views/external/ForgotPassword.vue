<template>
  <div class="forgot-password">
    <el-row>
      <el-col :span="12">
        <external-sidenav></external-sidenav>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="center" align="middle">
          <div class="back-button" @click="$router.push('login')">
            <img src="@/assets/icons/ic-back.svg"> Voltar
          </div>
          <el-form label-position="top" :model="formLabelAlign">
            <h1>Recuperar senha</h1>
            <el-form-item label="Email">
              <el-input v-model="formLabelAlign.region"></el-input>
            </el-form-item>
            <el-button type="primary">Recuperar</el-button>
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
  name: 'ForgotPassword',
  components: {
    ExternalSidenav
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
.forgot-password{
  height: 100%;
  color: #adadad;
  >.el-row, >.el-row>.el-col, >.el-row>.el-col>.el-row {
    height: 100%
  }
  .back-button{
    position: absolute;
    top: 36px;
    left: 36px;
    color: initial;
    cursor: pointer;
    img{
      vertical-align: middle;
      margin-right: 4px;
    }
  }
  form{
    margin: auto;
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
