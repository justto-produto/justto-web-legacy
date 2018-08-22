<template>
  <div class="external-register-view">
    <el-row>
      <el-col :span="12">
        <external-sidenav></external-sidenav>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="center" align="middle">
          <el-form label-position="top" ref="registerForm" :model="registerForm" :rules="rules">
            <h1>Cadastre-se</h1>
            <el-form-item label="Nome" prop="name">
              <el-input v-model="registerForm.name"></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="registerForm.email"></el-input>
            </el-form-item>
            <el-form-item label="Senha" prop="password" type="password">
              <el-input v-model="registerForm.password"></el-input>
            </el-form-item>
            <el-button type="primary" @click="submitForm()">Cadastrar</el-button>
            <el-row class="register-info">
              Ao clicar no botão, eu concordo com os <a href="#"> Termos de Uso</a> e <a href="#">Política de Privacidade.</a>
            </el-row>
            <el-row class="register-info register">
              Já possui conta? <a href="#/login"> Acesse agora mesmo.</a>
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
  name: 'Register',
  components: {
    ExternalSidenav
  },
  data () {
    return {
      registerForm: {
        name: '',
        email: '',
        password: ''
      },
      rules: {
        name: [
          { required: true, message: 'Este campo é obrigatório', trigger: 'blur' }
        ],
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
      this.$refs['registerForm'].validate((valid) => {
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
.external-register-view{
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
    .el-button--primary{
      width: 100%;
    }
  }
  h1{
    color: #343c4b;
    font-size: 30px;
    margin-bottom: 40px;
  }
  .register-info{
    font-size: 12px;
    text-align: center;
    margin-top: 20px;
  }
}
</style>
