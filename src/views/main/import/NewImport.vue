<template>
  <JusViewMain class="new-import-view">
    <template slot="title">
      <h1>
        Nova importação de disputas
      </h1>
    </template>
    <template slot="main">
      <el-steps
        :active="activeStep"
        class="new-import-view__steps el-steps--circle"
        finish-status="success"
      >
        <el-step />
        <el-step />
        <el-step />
      </el-steps>
      <div class="new-import-view__content">
        <transition name="fade">
          <check-lines-step
            v-if="activeStep === 0"
            key="0"
          />
          <columns-step
            v-if="activeStep === 1"
            key="1"
          />
          <campaign-step
            v-if="activeStep === 2"
            key="2"
            :mapped-campaigns="mappedCampaigns"
            :campaign-is-mapped="isMapped"
            :duplicated-action.sync="duplicatedAction"
          />
        </transition>
      </div>
      <div class="new-import-view__actions">
        <el-button
          plain
          @click="previousStep"
        >
          Voltar
        </el-button>
        <el-button
          v-if="activeStep === 2"
          :disabled="validationInProgress"
          type="primary"
          data-testid="start-negotiation"
          @click="finalStep"
        >
          Iniciar negociação
        </el-button>
        <el-button
          v-else
          :disabled="$store.state.loading"
          type="primary"
          data-testid="submit"
          @click="nextStep"
        >
          Próximo
        </el-button>
      </div>
    </template>
  </JusViewMain>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
/* eslint-disable no-prototype-builtins */
export default {
  name: 'NewImport',
  components: {
    CheckLinesStep: () => import('./partials/CheckLinesStep'),
    ColumnsStep: () => import('./partials/ColumnsStep'),
    CampaignStep: () => import('./partials/CampaignStep')
  },
  data() {
    return {
      uploadId: undefined,
      activeStep: 0,
      mappedCampaigns: [],
      campaignIsMapped: false,
      duplicatedAction: 'IGNORE'
    }
  },
  computed: {
    ...mapGetters(['errorFields', 'validationInProgress']),

    isMapped() {
      return this.campaignIsMapped
    }
  },
  beforeCreate() {
    this.$store.commit('removeImportsMap')
    if (!this.$store.getters.hasImportsFile) {
      this.$router.push('/import')
    }
  },
  methods: {
    ...mapActions(['setErrorFields']),

    nextStep() {
      if (this.activeStep === 1) {
        this.$store.dispatch('mapImportColumns', this.$store.state.importModule.map).then(response => {
          // SEGMENT TRACK
          this.$jusSegment('Importação 3/4 Mapeamento concluido', {
            fileName: this.$store.getters.importedFileName
          })
          this.mappedCampaigns = response

          this.campaignIsMapped = true
        })
      }
      this.activeStep += 1
    },
    previousStep() {
      this.$store.dispatch('hideLoading')
      if (this.activeStep) {
        this.activeStep -= 1
      } else {
        this.$router.push('/import')
      }
    },
    finalStep() {
      const campaignsTrack = []
      let allValid = true
      let checked = false
      const promises = []
      for (const mappedCampaign of this.mappedCampaigns) {
        const campaign = JSON.parse(JSON.stringify(mappedCampaign))
        this.setErrorFields(this.campaignErrorFields(campaign))
        if (!this.checkValidCampaign(campaign)) {
          allValid = false
        }
        checked = true
      }
      if (checked && allValid) {
        for (const mappedCampaign of this.mappedCampaigns) {
          const campaign = JSON.parse(JSON.stringify(mappedCampaign))
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
          if (this.duplicatedAction === 'IGNORE') {
            campaign.allowDuplicateDispute = false
            campaign.allowUpdateDispute = false
          }
          if (this.duplicatedAction === 'UPDATE') {
            campaign.allowDuplicateDispute = false
            campaign.allowUpdateDispute = true
          }
          if (this.duplicatedAction === 'DUPLICATE') {
            campaign.allowDuplicateDispute = true
            campaign.allowUpdateDispute = false
          }

          promises.push(this.$store.dispatch('createCampaign', campaign))
        }
        Promise.all(promises).then(() => {
          // SEGMENT TRACK
          this.$jusSegment('Importação 4/4 Importação Concluída', {
            fileName: this.$store.getters.importedFileName
          })
          this.$store.dispatch('startGeneseRunner').finally(() => {
            this.$store.commit('removeImportsFile')
          })
          this.$router.push('/import/loading')
        }).catch(error => {
          this.$jusNotification({ error })
        })
      } else {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Para prosseguir você deve configurar todos os campos de todas as campanhas.',
          type: 'warning'
        })
      }
      const range = this.mappedCampaigns.length - 1
      localStorage.setItem('jusfeedbackpreferences', JSON.stringify({
        businessHoursEngagement: this.mappedCampaigns[range].businessHoursEngagement,
        contactPartyWhenNoLowyer: this.mappedCampaigns[range].contactPartyWhenNoLowyer,
        contactPartyWhenInvalidLowyer: this.mappedCampaigns[range].contactPartyWhenInvalidLowyer,
        skipEnrichment: this.mappedCampaigns[range].skipEnrichment,
        denySavingDeposit: this.mappedCampaigns[range].denySavingDeposit
      }))
    },
    campaignErrorFields(campaign) {
      const validations = [
        { value: 'respondent', validation: field => !!field.respondent },
        { value: 'name', validation: field => !!field.name },
        { value: 'cluster', validation: field => !!field.cluster },
        { value: 'deadline', validation: field => !!field.deadline && this.$moment(field.deadline.dateTime).isValid() === true },
        { value: 'negotiatorIds', validation: field => !!field.negotiatorIds.length },
        { value: 'strategy', validation: field => !!field.strategy }
      ]
      return validations.filter(validator => {
        const { value, validation } = validator
        return !(campaign.hasOwnProperty(value) && validation(campaign))
      }).map(err => err.value)
    },
    checkValidCampaign(campaign) {
      if (
        campaign.hasOwnProperty('respondent') &&
        !!campaign.respondent &&
        campaign.hasOwnProperty('name') &&
        !!campaign.name &&
        campaign.hasOwnProperty('cluster') &&
        !!campaign.cluster &&
        campaign.hasOwnProperty('deadline') &&
        !!campaign.deadline &&
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
  beforeRouteLeave(to, from, next) {
    if (to.path === '/import/loading') {
      next()
    } else if (this.$store.getters.hasImportsFile && to.path !== '/login') {
      this.$confirm('Tem certeza que deseja sair? Todos os dados serão perdidos.', {
        confirmButtonText: 'Sair da importação',
        cancelButtonText: 'Cancelar',
        title: 'Atenção!',
        type: 'warning',
        cancelButtonClass: 'is-plain'
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
  width: 80%;
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
