<template lang="html">
  <div>
    <div class="onboarding-step-content onboarding-workspace-step">
      <div class="onboarding-step-content__title">
        <h2>Crie o seu espaço de trabalho na Justto</h2>
        <p>Abaixo você irá configurar o seu link de acesso ao sistema da Justto. Escolha um nome que seja fácil lembrar
           para você e sua equipe. Recomendamos o nome do seu escritório ou empresa.
           <br><br>
           Observação: Não é permitido usar acentuação ou caracteres especiais.
         </p>
      </div>
      <el-form ref="workspaceForm" :model="workspaceForm" :rules="workspaceFormRules" label-position="top" @submit.native.prevent="submitForm">
        <el-form-item label="Espaço de trabalho" prop="workspace">
          <el-input v-model="workspaceForm.workspace"/>
        </el-form-item>
        <span>.acordo.pro</span>
      </el-form>
    </div>
    <el-button type="primary" @click="submitForm">Próximo</el-button>
  </div>
</template>

<script>
export default {
  props: {
    isGuest: {
      type: Boolean,
      default: false
    }
  },
  data () {
    var validateWorkspace = (rule, value, callback) => {
      if (/[^A-Z0-9]/gi.test(value)) {
        callback(new Error('Formato inválido'))
      } else {
        callback()
      }
    }
    return {
      workspaceForm: {
        workspace: ''
      },
      workspaceFormRules: {
        workspace: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validateWorkspace, trigger: 'change' }]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs['workspaceForm'].validate((valid) => {
        if (valid) {
          this.$emit('onboarding:step:next')
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.onboarding-workspace-step {
  .el-form {
    display: flex;
    align-items: flex-end;
    span {
      margin-bottom: 10px;
    }
  }
  .el-form-item {
    width: 100%;
    margin: 0 5px;
  }
}
</style>
