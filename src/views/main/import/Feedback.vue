<template lang="html">
  <JusViewMain side-card class="view-import view-import--feedback">

    <template slot="main">
      <JusButtonBack to="/import/enrichment"/>
      <el-steps :active="active" class="el-steps--wizard" finish-status="finish">
        <el-step/>
        <el-step/>
        <el-step/>
      </el-steps>
      <div class="view-import__container">
        <div class="view-import__title">
          <h2>Resumo dos novos casos</h2>
          <p>
            Agrupamos seus casos por empresas. Nomeie abaixo cada um destes grupos, informe o tipo de negociação e a
            data limite para encerrar a negociação. Posteriormente, você poderá editar ou criar novos conjuntos de
            casos da forma que preferir, para que seja mais fácil identificar as suas campanhas de negociação.
          </p>
        </div>
        <div class="view-import__content">
          <JusImportFeedbackCard company="Nestlé" color="#72cbff"/>
          <JusImportFeedbackCard :responsibles="responsibles" company="Cacau Show" color="#ff7a72"/>
        </div>
        <div class="view-import__actions">
          <el-button type="primary" @click="$router.push('/management')">Próximo</el-button>
        </div>
      </div>
    </template>
  </JusViewMain>
</template>

<script>
import JusImportFeedbackCard from '@/components/layouts/JusImportFeedbackCard'

export default {
  name: 'ImportFeedback',
  components: {
    JusImportFeedbackCard
  },
  data () {
    return {
      active: 3,
      responsibles: ['HL', 'MR']
    }
  }
}
</script>

<style lang="scss">
</style>
