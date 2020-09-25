<template>
  <div class="onboarding-step-content">
    <div
      data-testid="teamname-step"
      class="onboarding-step-content__title"
    >
      <h2>Qual o nome da sua equipe?</h2>
      <p>
        Você pode colocar o nome do seu escritório ou empresa.
        Por exemplo, Dias e Ramos Advogados Associados.
        <br>
        Não se preocupe, posteriormente você poderá alterar o nome da equipe.
      </p>
    </div>
    <el-form
      ref="nameForm"
      :model="nameForm"
      :rules="nameFormRules"
      label-position="top"
      @submit.native.prevent="submitForm"
    >
      <el-form-item
        label="Equipe"
        prop="name"
      >
        <el-input
          v-model="nameForm.name"
          :disabled="creatingWorkspace"
          name="name"
          data-testid="teamname-form"
        />
      </el-form-item>
    </el-form>
    <el-button
      type="primary"
      data-testid="teamname-next"
      @click="submitForm"
    >
      Próximo
    </el-button>
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
  data() {
    return {
      nameForm: {
        name: ''
      },
      nameFormRules: {
        name: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      }
    }
  },
  computed: {
    creatingWorkspace() {
      return this.$store.getters.creatingWorkspace
    }
  },
  mounted() {
    this.nameForm.name = this.creatingWorkspace ? this.$store.state.workspaceModule.name : ''
  },
  methods: {
    submitForm() {
      this.$refs.nameForm.validate(valid => {
        if (valid) {
          this.$emit('onboarding:createSubdomain', { team: this.nameForm.name })
        } else {
          return false
        }
      })
    }
  }
}
</script>
