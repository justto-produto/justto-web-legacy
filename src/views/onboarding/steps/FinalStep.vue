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
import { setLocalWorkspace } from '@/utils'
import { mapGetters } from 'vuex'
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
  computed: {
    ...mapGetters({
      workspace: 'workspace'
    })
  },
  methods: {
    readyWorkspace: function() {
      this.showError = false

      this.$store.dispatch('readyWorkspace', this.workspace.subDomain)
        .then(() => {
          // eslint-disable-next-line no-undef
          delete axios.defaults.headers.common.Workspace
          this.$store.dispatch('myWorkspace')
            .then(response => {
              const currentWorkspace = response.find(w => {
                if (w?.workspace?.subDomain && w?.workspace?.subDomain === this.workspace.subDomain) {
                  return true
                }
              })

              this.$store.commit('setWorkspace', currentWorkspace.workspace)
              setLocalWorkspace(currentWorkspace.workspace)
              localStorage.setItem('jusprofile', currentWorkspace.profile)
              localStorage.setItem('jusperson', JSON.stringify(currentWorkspace.person))
              this.$router.push({ name: 'import' })
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
