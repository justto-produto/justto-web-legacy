<template lang="html">
  <div>
    <div class="onboarding-step-content onboarding-workspace-step">
      <div class="onboarding-step-content__title">
        <h2>Crie o seu espaço de trabalho</h2>
        <p>Para acessar a plataforma, você e sua equipe utilizarão o link cadastrado abaixo. Você pode cadastrar o nome do seu escritório, por exemplo.</p>
      </div>
      <el-form ref="workspaceForm" :model="workspaceForm" :rules="workspaceFormRules" label-position="top" @submit.native.prevent="submitForm">
        <span>http://</span>
        <el-form-item label="" prop="workspace">
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
    return {
      workspaceForm: {
        workspace: ''
      },
      workspaceFormRules: {
        workspace: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
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
