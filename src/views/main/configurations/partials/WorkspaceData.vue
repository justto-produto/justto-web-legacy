<template>
  <section class="workspace-data-container">
    <h2 class="workspace-data-container__title">
      Informações da conta
    </h2>

    <article class="workspace-data-container__form">
      <div class="workspace-data-container__form-group">
        <div class="workspace-data-container__form-item">
          <span class="workspace-data-container__input-label">
            Nome da <b>equipe</b> ou <b>time</b> de negogiação
          </span>
          <el-input v-model="teamName">
            <el-button
              slot="append"
              @click.prevent="handleChangeTeamName"
            >
              Alterar time
            </el-button>
          </el-input>
          <el-alert
            :closable="false"
            type="info"
            show-icon
            class="workspace-data-container__input-alert"
          >
            <span slot="title">
              Este nome <strong>NÃO</strong> irá aparecer nas mensagens automáticas. Utilize-o para organização interna.
            </span>
          </el-alert>
        </div>

        <div class="workspace-data-container__form-item">
          <span class="workspace-data-container__input-label">
            Nome da <b>empresa</b> ou <b>escritório</b>
          </span>
          <el-input v-model="workspaceName">
            <el-button
              slot="append"
              @click.prevent="handleChangeWorkspaceName"
            >
              Alterar nome
            </el-button>
          </el-input>
          <el-alert
            :closable="false"
            type="info"
            show-icon
            class="workspace-data-container__input-alert"
          >
            <span slot="title">
              Este nome <strong>IRÁ</strong> aparecer em todas as mensagens automáticas enviadas pela Justto.
            </span>
          </el-alert>
        </div>

        <div
          v-if="isJusttoAdmin"
          class="workspace-data-container__form-item"
        >
          <span class="workspace-data-container__input-label">
            Key Account
          </span>

          <span class="workspace-data-container__form-item-input el-input el-input-group el-input-group--append">
            <el-select
              v-model="selectedKeyAccountId"
              filterable
              style="width: 100%;"
              @input="$forceUpdate()"
            >
              <el-option
                :value="undefined"
                :label="'Nenhum Key Account selecionado.'"
                disabled
              />
              <el-option
                v-for="ka in workspaceKeyAccounts"
                :key="ka.id"
                :disabled="ka.id === selectedKeyAccountId"
                :value="ka.id"
                :label="ka | buildKAName"
              />
            </el-select>
            <div class="workspace-data-container__form-item-input-append el-input-group__append">
              <span
                class="el-input-group__form-item-input-append-link"
                @click="connectKeyAccount"
              >
                {{ hasAssociatedKeyAccount ? 'Alterar Key Account' : 'Associar Key Account' }}
              </span>
            </div>
          </span>
        </div>
      </div>

      <el-upload
        v-loading="isUploadingFile"
        :show-file-list="false"
        :on-success="handleChangeWorkspaceLogoSuccess"
        :on-error="handleChangeWorkspaceLogoError"
        :before-upload="handleChangeWorkspace"
        :headers="requestHeaders"
        action="https://justto.app/api/workspaces/logo"
        class="workspace-data-container__input-file"
        drag
      >
        <img
          v-if="imageUrl"
          :src="imageUrl"
          class="workspace-data-container__input-file-image"
        >
        <span
          v-else
          class="workspace-data-container__input-file-icon"
        >
          <JusIcon icon="upload-file-active" />
          <div>
            Clique aqui ou arraste a logo da empresa
          </div>
        </span>
      </el-upload>
    </article>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'WorkspaceData',

  filters: {
    buildKAName(ka) {
      return (ka.name ? `${ka.name} - ` : '') + `${ka.email}`
    }
  },

  data: () => ({
    teamName: '',
    workspaceName: '',
    imageUrl: '',
    isUploadingFile: false,
    associateKeyAccountDialogVisible: false,
    selectedKeyAccountId: undefined
  }),

  computed: {
    ...mapGetters(
      {
        workspace: 'workspace',
        accountToken: 'accountToken',
        isJusttoAdmin: 'isJusttoAdmin',
        workspaceKeyAccounts: 'getWorkspaceKeyAccounts',
        associatedKeyAccount: 'getAssociatedKeyAccount'
      }
    ),

    requestHeaders() {
      return {
        Workspace: this.workspace?.subDomain,
        Authorization: this.accountToken
      }
    },

    hasAssociatedKeyAccount() {
      return Boolean(this.associatedKeyAccount?.id)
    }
  },

  beforeMount() {
    const { teamName, name, logoUrl } = this.workspace
    this.imageUrl = logoUrl
    this.teamName = teamName
    this.workspaceName = name
  },

  mounted() {
    if (this.isJusttoAdmin) {
      this.init()
    }
  },

  methods: {
    ...mapActions([
      'editWorkpace',
      'changeTeamName',
      'updateWorkspaceLogoUrl',
      'getWorkspaceKeyAccounts',
      'updateWorkspaceKeyAccount',
      'getAssociatedKeyAccount'
    ]),

    init() {
      this.getWorkspaceKeyAccounts()
      this.getAssociatedKeyAccount().then(({ keyAccount }) => {
        if (keyAccount) {
          this.selectedKeyAccountId = keyAccount.id
        }
      })
    },

    connectKeyAccount(_event) {
      if (this.selectedKeyAccountId) {
        this.updateWorkspaceKeyAccount({ keyAccountId: this.selectedKeyAccountId }).then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Key Account associado com sucesso.',
            type: 'success'
          })
          this.handleToggleAssociateKeyAccountDialog()
        }).catch(error => {
          this.$jusNotification({ error })
        })
      }
    },

    handleChangeTeamName() {
      const { teamName, workspace } = this

      if (teamName) {
        this.changeTeamName({
          teamName,
          id: workspace.id
        }).then(() => {
          this.$jusSegment('Nome da equipe/time alterado')
          this.$jusNotification({
            title: 'Yay!',
            message: 'Nome da equipe alterado com sucesso.',
            type: 'success'
          })
        }).catch(error => {
          this.$jusNotification({ error })
        })
      } else {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Nome da equipe ou time de negociação não pode ficar em branco.',
          type: 'warning'
        })
      }
    },

    handleChangeWorkspaceName() {
      const { workspaceName } = this

      if (workspaceName) {
        this.editWorkpace({
          name: workspaceName
        }).then(() => {
          this.$jusSegment('Nome do escritório/empresa alterado')
          this.$jusNotification({
            title: 'Yay!',
            message: 'Nome do escritório/empresa alterado com sucesso.',
            type: 'success'
          })
        }).catch(error => {
          this.$jusNotification({ error })
        })
      } else {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Nome da empresa ou escritório não pode ficar em branco.',
          type: 'warning'
        })
      }
    },

    handleChangeWorkspace() {
      this.isUploadingFile = true
    },

    handleChangeWorkspaceLogoSuccess(response) {
      this.$jusSegment('Logo da workspace alterado')
      this.$jusNotification({
        title: 'Yay!',
        message: 'Logo alterado com sucesso.',
        type: 'success'
      })
      this.updateWorkspaceLogoUrl(response)
      this.imageUrl = response
      this.isUploadingFile = false
    },

    handleChangeWorkspaceLogoError(error) {
      this.$jusNotification({ error })
      this.isUploadingFile = false
    },

    handleToggleAssociateKeyAccountDialog(_event) {
      if (this.hasAssociatedKeyAccount) {
        this.selectedKeyAccountId = this.associatedKeyAccount.id
      }

      this.associateKeyAccountDialogVisible = !this.associateKeyAccountDialogVisible
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.workspace-data-container {
  .workspace-data-container__title {
    margin: 15px 0 30px;
  }

  .workspace-data-container__form {
    display: flex;
    gap: 24px;

    .workspace-data-container__form-group {
      flex: 2;
    }

    .workspace-data-container__form-item {
      margin-top: 24px;
      &:first-child { margin-top: 0; }

      .workspace-data-container__form-item-input {
        .workspace-data-container__form-item-input-append {
          cursor: pointer;
        }
      }

      .workspace-data-container__input-alert {
        padding: 12px 16px;
      }

      .workspace-data-container__input-label {
        color: $--color-text-secondary;
        display: inline-block;
        margin-bottom: 6px;
        font-size: 16px;
      }
    }

    .workspace-data-container__input-file {
      flex: 1;

      .workspace-data-container__input-file-image {
        max-width: 100%;
        max-height: 100%;
        height: 100%;
        padding: 12px;
      }

      .workspace-data-container__input-file-icon {
        & > div {
          margin-top: 24px;
          color: $--color-text-secondary;
        }
      }
    }
  }
}

@media (max-height: 1400px) {
  .workspace-data-container {
    max-width: 1400px;
    margin: auto
  }
}

@media (max-width: 900px) {
  .workspace-data-container {
    .workspace-data-container__form {
      flex-direction: column;

      .workspace-data-container__form-item {
        .workspace-data-container__input-label {
          font-size: 14px;
        }
      }

      .workspace-data-container__input-file {
        height: 220px;
      }
    }
  }
}

</style>

<style lang="scss">
.workspace-data-container {
  .workspace-data-container__input-file {
    .el-upload {
      height: 100%;
      width: 100%;

      .el-upload-dragger {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
    }
  }
}
</style>
