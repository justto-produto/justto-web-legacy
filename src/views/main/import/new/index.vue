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
            <feedback-step v-if="activeStep === 3" key="3"/>
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
      activeStep: 0
    }
  },
  methods: {
    nextStep () {
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
