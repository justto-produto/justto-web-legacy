<template>
  <div class="onboarding-step-content">
    <h1>
      Tudo pronto, {{ name }}!
    </h1>
    <p v-if="!isGuest">
      Parabéns! Você configurou seu ambiente de trabalho na JUSTTO. Simples, não é mesmo? O próximo passo é inserir
      novos casos na plataforma para negociação.
      <br><br>
      Durante seu período de teste de 15 dias, você e sua equipe poderão inserir até 20 casos para negociação.
      Para inserir mais casos você pode fazer o upgrade do seu plano a qualquer momento.
    </p>
    <el-alert
      v-if="showError"
      title="Houve uma falha de conexão com o servidor.
      Tente novamente ou entre em contato com o administrador do sistema."
      type="error"/>
    <el-button type="primary" @click="readyWorkspace">Inserir primeiros casos</el-button>
  </div>
</template>

<script>
import JusLogoCompany from '@/components/images/JusLogoCompany'

export default {
  components: {
    JusLogoCompany
  },
  props: {
    isGuest: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showError: false
    }
  },
  computed: {
    name () {
      return this.$store.state.accountModule.name
    }
  },
  methods: {
    readyWorkspace: function () {
      this.showError = false
      this.$store.dispatch('readyWorkspace', this.$store.state.workspaceModule.subdomain)
        .then(() => {
          this.$store.dispatch('myWorkspace')
            .then(() => {
              this.$router.push('import')
            })
            .catch(error => {
              this.showError = true
              console.error(error)
            })
        })
        .catch(error => {
          this.showError = true
          console.error(error)
        })
    }
  }
}
</script>
