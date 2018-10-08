<template>
  <div class="external-view">
    <el-container>
      <el-aside width="50%" class="hidden-sm-and-down">
        <JusSidenavExternal/>
      </el-aside>
      <el-main class="display-flex">
        <el-form ref="registerForm" :model="registerForm" :rules="rules" class="external-view__form" label-position="top">
          <h1 class="external-view__title">Cadastre-se</h1>
          <el-form-item label="Nome" prop="name">
            <el-input v-model="registerForm.name"/>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="registerForm.email"/>
          </el-form-item>
          <el-form-item label="Senha" prop="password" type="password">
            <el-input v-model="registerForm.password"/>
          </el-form-item>
          <el-button class="external-view__submit" type="primary" @click="submitForm()">Cadastrar</el-button>
          <el-row class="external-view__info">
            Ao clicar no botão, eu concordo com os <a href="#"> Termos de Uso</a> e <a href="#">Política de Privacidade.</a>
            <br><br>
            Já possui conta? <a href="#/login"> Acesse agora mesmo.</a>
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
      registerForm: {
        name: '',
        email: '',
        password: ''
      },
      rules: {
        name: [
          { required: true, message: 'Campo obrigatório', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Campo obrigatório', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Campo obrigatório', trigger: 'blur' }
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
