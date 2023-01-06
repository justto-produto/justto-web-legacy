<template>
  <div class="external-view external-auth__container">
    <el-container>
      <el-aside
        width="50%"
        class="hidden-sm-and-down"
      >
        <jus-sidenav-external />
      </el-aside>

      <el-main class="display-flex">
        <amplify-authenticator class="authenticator__container">
          <div>
            Tela de selecionar Workspace.
            <amplify-sign-out />
          </div>
        </amplify-authenticator>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components'

export default {
  components: {
    JusSidenavExternal: () => import('@/components/layouts/JusSidenavExternal')
  },

  created() {
    onAuthUIStateChange((authState, authData) => {
      console.log({ authState, authData })
      switch (authState) {
        case 'signedin':
          this.handleSignedIn(authData)
          break
        case 'signedout':
          this.handleSignedOut()
          break
        default:
          console.log(authState, { authData })
          break
      }
    })
  },

  methods: {
    handleSignedIn(auth) {
      // TODO: Salvar informações e buscar Workspaces.
      console.log('handleSignedIn', auth)
    },

    handleSignedOut() {
      // TODO: Implementar Logout.
    }
  }
}
</script>

<style lang="scss">
.external-auth__container {
  height: 100vh;

  .authenticator__container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
