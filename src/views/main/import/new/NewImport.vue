<template>
  <JusViewMain class="new-import-view">
    <template slot="title">
      <h1>
        Nova importação de disputas
      </h1>
    </template>
    <template slot="main">
      <el-steps :active="activeStep" class="new-import-view__steps el-steps--circle" finish-status="success">
        <el-step/>
        <el-step/>
        <el-step/>
      </el-steps>
      <div class="new-import-view__content">
        <transition name="fade">
          <check-lines-step v-if="activeStep === 0" key="0"/>
          <columns-step v-if="activeStep === 1" key="1"/>
          <campaign-step v-if="activeStep === 2" key="2" :mapped-campaigns="mappedCampaigns"/>
        </transition>
      </div>
      <div class="new-import-view__actions">
        <el-button plain @click="previousStep">Voltar</el-button>
        <el-button
          v-if="activeStep === 2"
          type="primary"
          data-testid="start-negotiation"
          @click="finalStep">
          Iniciar negociação
        </el-button>
        <el-button
          v-else
          :disabled="$store.state.loading"
          type="primary"
          data-testid="submit"
          @click="nextStep">
          Próximo
        </el-button>
      </div>
    </template>
  </JusViewMain>
</template>

<script>
export default {
  name: 'NewImport',
  components: {
    CheckLinesStep: () => import('./steps/CheckLinesStep'),
    ColumnsStep: () => import('./steps/ColumnsStep'),
    CampaignStep: () => import('./steps/CampaignStep')
  },
  data () {
    return {
      uploadId: undefined,
      activeStep: 0,
      mappedCampaigns: []
    }
  },
  beforeCreate () {
    this.$store.commit('removeImportsMap')
    if (!this.$store.getters.hasImportsFile) {
      this.$router.push('/import')
    }
  },
  methods: {
    nextStep () {
      if (this.activeStep === 1) {
        this.$store.dispatch('mapImportColumns', this.$store.state.importModule.map).then(response => {
          window.analytics.track('Mapeamento concluido')
          this.mappedCampaigns = response
        })
      } else if (this.activeStep === 0) {
        window.analytics.track('Importação Iniciada', {
          action: 'Planilha Importada',
          lines: this.$store.state.importModule.file.rows
        })
      }
      this.activeStep += 1
    },
    previousStep () {
      this.$store.dispatch('hideLoading')
      if (this.activeStep) {
        this.activeStep -= 1
      } else {
        this.$router.push('/import')
      }
    },
    finalStep () {
      let campaignsTrack = []
      let allValid = true
      let promises = []
      for (let mappedCampaign of this.mappedCampaigns) {
        let campaign = JSON.parse(JSON.stringify(mappedCampaign))
        if (this.checkValidCampaign(campaign)) {
          campaignsTrack.push({
            name: campaign.name,
            strategy: campaign.strategy
          })
          campaign.paymentDeadLine = 'P' + campaign.paymentDeadLine + 'D'
          delete campaign.campaign
          delete campaign.rows
          delete campaign.createdAt
          delete campaign.createdBy
          delete campaign.id
          delete campaign.updatedAt
          delete campaign.updatedBy
          promises.push(this.$store.dispatch('createCampaign', campaign))
        }
        else {
          allValid = false
        }
        checked = true
      }
      if (checked && allValid) {
        for (let mappedCampaign of this.mappedCampaigns) {
          let campaign = JSON.parse(JSON.stringify(mappedCampaign))
          if (this.checkValidCampaign(campaign)) {
            promises.push(this.$store.dispatch('createCampaign', campaign))
          }
        }
        Promise.all(promises).then(() => {
          window.analytics.track('Configuração de campanha concluida', {
            campaign: campaignsTrack
          })
          window.analytics.track('Importação Concluída', {
            campaign: campaignsTrack
          })
          this.$store.dispatch('startGeneseRunner').finally(() => {
            this.$store.commit('removeImportsFile')
          })
          this.$router.push('/import/loading')
        }).catch(() => {
          this.$jusNotification({ type: 'error' })
        })
      } else {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Para prosseguir você deve configurar todos os campos.',
          type: 'warning'
        })
      }
    },
    checkValidCampaign (campaign) {
      if (
        campaign.hasOwnProperty('respondent') &&
        !!campaign.respondent &&
        campaign.hasOwnProperty('name') &&
        !!campaign.name &&
        campaign.hasOwnProperty('cluster') &&
        !!campaign.cluster &&
        campaign.hasOwnProperty('deadline') &&
        !!campaign.deadline &&
        // campaign.hasOwnProperty('protocolDeadLine') &&
        // !!campaign.protocolDeadLine &&
        campaign.hasOwnProperty('paymentDeadLine') &&
        !!campaign.paymentDeadLine &&
        campaign.hasOwnProperty('negotiatorIds') &&
        !!campaign.negotiatorIds &&
        campaign.negotiatorIds.length > 0 &&
        campaign.hasOwnProperty('strategy') &&
        !!campaign.strategy
      ) {
        return true
      } else return false
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/import/loading') {
      next()
    } else if (this.$store.getters.hasImportsFile) {
      this.$confirm('Tem certeza que deseja sair da importação? Todos os dados serão perdidos.', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancelar',
        title: 'Atenção!'
      }).then(() => {
        next()
      })
    } else {
      next()
    }
  }
}
</script>

<style lang="scss">
.new-import-view .jus-main-view__main-card .el-card__body {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  min-height: min-content;
}
.new-import-view__steps, .new-import-view__actions {
  width: 500px;
}
.new-import-view__steps {
  margin-top: 20px;
}
.new-import-view__content {
  margin-top: 32px;
  >p, h4 {
    text-align: center;
  }
  .enrichment-step .el-card {
    margin-top: 40px;
  }
}
.new-import-view__title {
  margin-bottom: 40px;
  text-align: center;
}
.new-import-view__actions {
  display: flex;
  margin: 40px 0 20px;
  button {
    width: 100%;
  }
}
</style>
