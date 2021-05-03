<template>
  <section class="workspace-data-container">
    <h2 class="workspace-data-container__title">
      Informações da conta
    </h2>

    <article class="workspace-data-container__form">
      <div class="workspace-data-container__form-group">
        <div class="workspace-data-container__form-item">
          <span class="workspace-data-container__input-label">
            Nome da <b>equipe</b> ou <b>time</b> de necogiação
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
          v-if="keyAccount"
          class="workspace-data-container__form-item"
        >
          <span class="workspace-data-container__input-label">
            Key Account
          </span>

          <span class="el-input__inner">
            <strong>{{ keyAccount.name }}</strong>
            <span>
              &lt;
              {{ keyAccount.email }}
              &gt;
            </span>
          </span>
        </div>
        <div class="workspace-data-container__form-item">
          <a
            class="workspace-data-container__form-item-link"
            @click="handleOpenAssociateKeyAccountDialog"
          >
            Associar Key Account
          </a>
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

    <el-dialog
      title="Associar key accounts"
      :visible.sync="associateKeyAccountDialogVisible"
      width="30%"
    >
      <span>This is a message</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="associateKeyAccountDialogVisible = false">
          Cancel
        </el-button>
        <el-button
          type="primary"
          @click="associateKeyAccountDialogVisible = false"
        >
          Confirm
        </el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'WorkspaceData',

  data: () => ({
    teamName: '',
    workspaceName: '',
    imageUrl: '',
    isUploadingFile: false,
    associateKeyAccountDialogVisible: false
  }),

  computed: {
    ...mapGetters([
      'workspace',
      'accountToken',
      'isJusttoAdmin'
    ]),

    requestHeaders() {
      return {
        Workspace: this.workspace?.subDomain,
        Authorization: this.accountToken
      }
    },

    keyAccount() {
      return undefined
      // return {
      //   name: 'Lucas Israel',
      //   email: 'lucas@Justto.com.br'
      // }
    }
  },

  beforeMount() {
    const { teamName, name, logoUrl } = this.workspace
    this.imageUrl = logoUrl
    this.teamName = teamName
    this.workspaceName = name
  },

  methods: {
    ...mapActions([
      'editWorkpace',
      'changeTeamName',
      'updateWorkspaceLogoUrl'
    ]),

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

    handleOpenAssociateKeyAccountDialog(_event) {
      this.associateKeyAccountDialogVisible = true
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
