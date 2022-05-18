<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    :title="$tc('configurations.DRAFT_NOTIFICATIONS.label')"
    width="auto"
    custom-class="draft-notifications-dialog"
    destroy-on-close
    center
    :before-close="handleClose"
  >
    <div class="draft-notifications__container">
      <el-switch
        v-model="draftNotCreatedNotification"
        active-text="Após 24 horas de ter aceito a disputa, se ainda não tiver gerado minuta, então deve alertar a Thamires."
      />

      <el-switch
        v-model="draftNotSentNotification"
        active-text="24 horas após a geração da minuta, se a Thamiris não enviar para assinatura, então deve alertar-la."
      />

      <el-switch
        v-model="draftNotSignedNotification"
        active-text="Após 48 horas de enviar para assinatura, se não tiver concluído (todas as assinaturas), então deve alertar a Thamires."
      />
    </div>

    <span
      slot="footer"
      v-loading="loading"
    >
      <el-button
        size="small"
        @click="closeDialog"
      >
        Cancelar
      </el-button>

      <el-button
        size="small"
        type="success"
        @click="handleSaveConfigs"
      >
        Salvar
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data: () => ({
    visible: false,
    loading: false,
    draftNotCreatedNotification: false,
    draftNotSentNotification: false,
    draftNotSignedNotification: false
  }),

  computed: {
    ...mapGetters({ properties: 'workspaceProperties' })
  },

  methods: {
    ...mapActions({
      editProperties: 'editWorkpaceProperties'
    }),

    openFeatureDialog() {
      this.visible = true

      this.draftNotCreatedNotification = !(this.properties?.DISABLE_DRAFT_NOT_CREATED_NOTIFICATION === 'true')
      this.draftNotSentNotification = !(this.properties?.DISABLE_DRAFT_NOT_SENT_NOTIFICATION === 'true')
      this.draftNotSignedNotification = !(this.properties?.DISABLE_DRAFT_NOT_SIGNED_NOTIFICATION === 'true')

      this.loading = false
    },

    handleClose(done) {
      done()
    },

    closeDialog() {
      this.visible = false
    },

    handleSaveConfigs() {
      this.loading = true

      this.editProperties({
        DISABLE_DRAFT_NOT_CREATED_NOTIFICATION: !this.draftNotCreatedNotification,
        DISABLE_DRAFT_NOT_SENT_NOTIFICATION: !this.draftNotSentNotification,
        DISABLE_DRAFT_NOT_SIGNED_NOTIFICATION: !this.draftNotSignedNotification
      }).then(() => {
        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: 'Salvo com sucesso'
        })
        this.closeDialog()
      }).catch(error => this.$jusNotification({ error })).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
.draft-notifications-dialog {
  .el-dialog__body {
    .draft-notifications__container {
      display: flex;
      flex-direction: column;
      gap: 24px;

      .el-switch {
        .el-switch__label {
          width: 100%;
          font-weight: normal;
        }
      }
    }
  }
}
</style>
