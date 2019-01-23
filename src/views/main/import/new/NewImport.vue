<template>
  <div class="view-import-new">
    <JusViewMain>
      <template slot="title">Nova importação de casos</template>
      <template slot="main">
        <el-steps :active="activeStep" class="view-import-new__steps el-steps--circle" finish-status="success">
          <el-step/>
          <el-step/>
          <el-step/>
          <el-step/>
        </el-steps>
        <div class="view-import-new__content">
          <transition name="fade">
            <check-lines-step v-if="activeStep === 0" key="0"/>
            <columns-step v-if="activeStep === 1" key="1"/>
            <enrichment-step v-if="activeStep === 2" key="2" @import:step:next="nextStep"/>
            <feedback-step v-if="activeStep === 3" key="3" :companies="companies"/>
          </transition>
        </div>
        <div class="view-import-new__actions">
          <el-button plain @click="previousStep">Voltar</el-button>
          <el-button v-if="activeStep === 2" type="primary" @click="nextStep">Pular enriquecimento</el-button>
          <el-button v-else-if="activeStep === 3" type="primary" @click="finalStep">Iniciar negociação</el-button>
          <el-button v-else type="primary" @click="nextStep">Próximo</el-button>
        </div>
      </template>
    </JusViewMain>
  </div>
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
      activeStep: 0,
      companies: []
    }
  },
  methods: {
    nextStep () {
      if (this.activeStep === 1) {
        this.$store.dispatch('mapImportColumns').then(response => {
          this.companies = response
        })
      }
      this.activeStep += 1
    },
    previousStep () {
      if (this.activeStep) {
        this.activeStep -= 1
      } else {
        this.$router.push('/import')
      }
    },
    finalStep () {
      this.$router.push('/management')
    }
  }
}
</script>

<style lang="scss">
.view-import-new .jus-main-view__main-card .el-card__body {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  min-height: min-content;
}
.view-import-new__steps, .view-import-new__actions {
  width: 500px;
}
.view-import-new__content {
  >*:not(.columns-step) {
    width: 500px;
  }
  .el-collapse--bordered {
    min-width: 100%;
  }
}
.view-import-new__steps {
  margin-top: 20px;
}
.view-import-new__content {
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
  }
  .el-collapse-item__arrow {
    line-height: 20px;
    margin: 0;
  }
}
.view-import-new__title {
  margin-bottom: 40px;
  text-align: center;
}
.view-import-new__actions {
  display: flex;
  margin: 40px 0 20px;
  button {
    width: 100%;
  }
}
</style>
