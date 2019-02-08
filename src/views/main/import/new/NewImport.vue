<template>
  <JusViewMain class="new-import-view">
    <template slot="title">
      <h1>
        Nova importação de casos
      </h1>
    </template>
    <template slot="main">
      <el-steps :active="activeStep" class="new-import-view__steps el-steps--circle" finish-status="success">
        <el-step/>
        <el-step/>
        <el-step/>
        <el-step/>
      </el-steps>
      <div class="new-import-view__content">
        <transition name="fade">
          <check-lines-step v-if="activeStep === 0" key="0"/>
          <columns-step v-if="activeStep === 1" key="1"/>
          <enrichment-step v-if="activeStep === 2" key="2" @import:step:next="nextStep"/>
          <feedback-step v-if="activeStep === 3" key="3" :mapped-campaigns="mappedCampaigns"/>
        </transition>
      </div>
      <div class="new-import-view__actions">
        <el-button plain @click="previousStep">Voltar</el-button>
        <el-button v-if="activeStep === 2" type="primary" @click="nextStep">Pular enriquecimento</el-button>
        <el-button v-else-if="activeStep === 3" type="primary" @click="finalStep">Iniciar negociação</el-button>
        <el-button
          v-else :disabled="$store.state.loading"
          type="primary"
          @click="nextStep">
          Próximo
        </el-button>
      </div>
    </template>
  </JusViewMain>
</template>

<script>
import CheckLinesStep from './steps/CheckLinesStep'
import ColumnsStep from './steps/ColumnsStep'
import EnrichmentStep from './steps/EnrichmentStep'
import FeedbackStep from './steps/FeedbackStep'

export default {
  name: 'NewImport',
  components: {
    CheckLinesStep,
    ColumnsStep,
    EnrichmentStep,
    FeedbackStep
  },
  data () {
    return {
      uploadId: undefined,
      activeStep: 0,
      mappedCampaigns: []
    }
  },
  beforeCreate () {
    if (!this.$store.getters.hasImportsFile) {
      this.$router.push('/import')
    }
  },
  methods: {
    nextStep () {
      if (this.activeStep === 1) {
        this.$store.dispatch('mapImportColumns', this.$store.state.importModule.map).then(response => {
          this.mappedCampaigns = response
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
      var promises = []
      for (let campaign of this.mappedCampaigns) {

        promises.push(this.$store.dispatch('createCampaign', campaign))
      }
      Promise.all(promises).then(() => {
        this.$router.push('/management')
      }).catch(error => {
        this.$notify(this.$errorMessage)
      })
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
.new-import-view__content {
  >*:not(.columns-step) {
    width: 500px;
  }
  .el-collapse--bordered {
    min-width: 100%;
  }
}
.new-import-view__steps {
  margin-top: 20px;
}
.new-import-view__content {
  margin-top: 40px;
  >p, h4 {
    text-align: center;
  }
  .enrichment-step .el-card {
    margin-top: 40px;
  }
  .el-collapse-item__header {
    height: 100%;
    line-height: inherit;
    padding: 10px 0;
    font-size: 14px;
  }
  .el-collapse-item__arrow {
    line-height: 20px;
    margin: 0;
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
