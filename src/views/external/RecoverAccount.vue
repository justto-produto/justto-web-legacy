<template>
  <div class="external-view">
    <el-container>
      <el-aside
        width="50%"
        class="hidden-sm-and-down"
      >
        <jus-sidenav-external />
      </el-aside>

      <el-main
        v-loading="loading"
        class="display-flex position-relative"
      >
        <jus-button-back to="login" />

        <div class="external-view__form">
          <p>
            Após várias tentativas de acesso com senha incorreta, iniciamos a recuperação da conta pra você.
            <br>
            <br>
            Um email será enviado para recriar sua senha. Siga as instruções, crie uma nova senha e conseguirá acessar o sistema.
          </p>

          <el-button
            class="to-login"
            type="text"
            plain
            @click="$router.push('login')"
          >
            Tentar entrar novamente
          </el-button>

          <p>
            Não recebeu o email para recriar a senha? Vamos tentar novamente <span v-if="timerEnabled">em {{ timerCount }} segundos</span>.
          </p>

          <el-button
            class="resend-email"
            :type="timerEnabled ? 'text' : 'secondary'"
            :disabled="timerEnabled"
            @click="resetPassword"
          >
            Reenviar email
          </el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'RecoverAccount',

  components: {
    JusSidenavExternal: () => import('@/components/layouts/JusSidenavExternal')
  },

  data: () => ({
    loading: false,
    timerEnabled: true,
    timerCount: 15
  }),

  created() {
    this.resetPassword()
  },

  methods: {
    ...mapActions(['forgotPassword']),

    timerAction() {
      if (this.timerEnabled) {
        if (this.timerCount > 0) {
          setTimeout(() => {
            this.timerCount -= 1
            this.timerAction()
          }, 1000)
        } else {
          this.timerEnabled = false
        }
      }
    },

    resetPassword() {
      this.loading = true

      this.forgotPassword(this.$route.query.email).then(() => {
        this.timerCount = 15
        this.timerEnabled = true
      }).finally(() => {
        this.loading = false
        this.timerAction()
      })
    }
  }
}
</script>

<style lang="scss">
  @import 'external.scss';
</style>
