<template lang="html">
  <div>
    <div class="onboarding-step-content">
      <div class="onboarding-step-content__title">
        <h2>Qual o nome do seu Escritório?</h2>
        <p>Você pode colocar o nome do seu escritório, por exemplo.</p>
      </div>
      <el-form ref="nameForm" :model="nameForm" :rules="nameFormRules" label-position="top" @submit.native.prevent="submitForm">
        <el-form-item label="Nome" prop="name">
          <el-input v-model="nameForm.name"/>
        </el-form-item>
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
      nameForm: {
        name: ''
      },
      nameFormRules: {
        name: [{ required: true, message: 'Este campo é obrigatório', trigger: 'submit' }]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs['nameForm'].validate((valid) => {
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
