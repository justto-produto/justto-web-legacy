<template>
  <div class="onboarding-step-content">
    <div class="onboarding-step-content__title">
      <h2>Para começar, qual o nome da sua equipe?</h2>
      <p>Você pode colocar o nome do seu escritório ou empresa, por exemplo.</p>
    </div>
    <el-form
      ref="nameForm"
      :model="nameForm"
      :rules="nameFormRules"
      label-position="top"
      @submit.native.prevent="submitForm">
      <el-form-item label="Equipe" prop="name">
        <el-input v-model="nameForm.name"/>
      </el-form-item>
    </el-form>
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
      nameForm: {
        name: ''
      },
      nameFormRules: {
        name: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs['nameForm'].validate((valid) => {
        if (valid) {
          this.$emit('onboarding:step:next', { team: this.nameForm.name })
        } else {
          return false
        }
      })
    }
  }
}
</script>
