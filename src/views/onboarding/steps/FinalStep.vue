<template>
  <div class="onboarding-step-content">
    <h1>
      Tudo pronto!
    </h1>
    <p v-if="!isGuest">
      Parabéns! Você configurou seu ambiente de trabalho na JUSTTO. Simples, não é mesmo? O próximo passo é inserir
      novas disputas na plataforma para negociação.
      <br><br>
      Durante seu período de teste de 15 dias, você e sua equipe poderão inserir até 100 disputas para negociação.
      Para inserir mais disputas você pode fazer o upgrade do seu plano a qualquer momento.
    </p>
    <el-alert
      v-if="showError"
      title="Houve uma falha de conexão com o servidor.
      Tente novamente ou entre em contato com o administrador do sistema."
      type="error"
    />
    <el-button
      type="primary"
      @click="readyWorkspace"
    >
      Inserir primeiras disputas
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
      showError: false
    }
  },
  methods: {
    readyWorkspace: function() {
      this.showError = false
      this.$store.dispatch('readyWorkspace', this.$store.state.workspaceModule.subdomain)
        .then(() => {
          // eslint-disable-next-line
          delete axios.defaults.headers.common['Workspace']
          this.$store.dispatch('myWorkspace')
            .then(response => {
              const currentWorkspace = response.find(w => {
                if (w.workspace &&
                  w.workspace.subDomain &&
                  w.workspace.subDomain === this.$store.getters.workspaceSubdomain) {
                  return true
                }
              })
              localStorage.setItem('jusworkspace', JSON.stringify(currentWorkspace.workspace))
              localStorage.setItem('jusprofile', currentWorkspace.profile)
              localStorage.setItem('jusperson', JSON.stringify(currentWorkspace.person))
              this.$router.go('/management')
            })
            .catch(() => {
              this.showError = true
            })
        })
        .catch(() => {
          this.showError = true
        })
    }
  }
}
</script>
