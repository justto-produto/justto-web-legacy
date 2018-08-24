<template>
  <div class="external-view">
    <el-row>
      <el-col :md="12" class="hidden-sm-and-down">
        <external-sidenav></external-sidenav>
      </el-col>
      <el-col :md="12">
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
            <el-row class="info">
              Ao clicar no botão, eu concordo com os <a href="#"> Termos de Uso</a> e <a href="#">Política de Privacidade.</a>
              <br><br>
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
