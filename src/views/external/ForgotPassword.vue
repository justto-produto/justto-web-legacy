<template>
  <div class="external-view">
    <el-container>
      <el-aside width="50%" class="hidden-sm-and-down">
        <external-sidenav></external-sidenav>
      </el-aside>
      <el-main class="display-flex position-relative">
        <back-button to="login"></back-button>
        <el-form class="external-view__form" label-position="top" ref="forgotForm" :model="forgotForm" :rules="rules">
          <h1 class="external-view__title">Recuperar senha</h1>
          <el-form-item label="Email" prop="email">
            <el-input v-model="forgotForm.email"></el-input>
          </el-form-item>
          <el-button class="external-view__submit" type="primary">Recuperar</el-button>
          <el-row class="external-view__info">
            Ao clicar no botão, eu concordo com os <a href="#"> Termos de Uso</a> e <a href="#">Política de Privacidade.</a>
          </el-row>
        </el-form>
      </el-main>
    </el-container>
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
      forgotForm: {
        email: ''
      },
      rules: {}
    }
  }
}
</script>
