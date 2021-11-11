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
        label="Nome da Equipe"
        prop="name"
      >
        <el-input
          v-model="nameForm.name"
          :disabled="creatingWorkspace"
          name="name"
          data-testid="teamname-form"
        />
      </el-form-item>

      <el-form-item
        label="Qual tipo de carteira irá negociar?"
        prop="negotiationType"
      >
        <el-select
          v-model="nameForm.negotiationType"
          filterable
          placeholder="Selecione um tipo"
        >
          <el-option
            v-for="(type, index) in defaultStrategyTypes"
            :key="index"
            :label="$t(`strategyTypes.${type}`).toUpperCase()"
            :value="type"
          />
        </el-select>
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
        name: '',
        negotiationType: ''
      },
      nameFormRules: {
        name: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        negotiationType: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      },
      defaultStrategyTypes: ['PAYMENT', 'RECOVERY']
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
          this.$emit('onboarding:createSubdomain', {
            team: this.nameForm.name,
            negotiationType: this.nameForm.negotiationType
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
