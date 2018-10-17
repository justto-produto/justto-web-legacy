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
          <h2>Visão geral da importação</h2>
          <p>
            Para cada grupo de casos, nós selecionamos a estratégia com mais chances de fechar acordos.
            Você pode editá-las se preferir, clicando na estretégia.
          </p>
        </div>
        <div class="view-import__content">
          <JusImportFeedbackCard company="Nestlé" color="#72cbff"/>
          <JusImportFeedbackCard :responsibles="responsibles" company="Cacau Show" color="#ff7a72"/>
        </div>
        <div class="view-import__actions">
          <el-button type="primary" @click="$router.push('/import/enrichment')">Próximo</el-button>
        </div>
      </div>
    </template>
    <!-- <template slot="aside">
      <el-carousel :interval="5000" :autoplay="false" arrow="always" height="107px" trigger="click" class="el-carousel__container--profile">
        <el-carousel-item v-for="item in 3" :key="item">
          <div class="el-carousel__item-main">
            <h2>1.000</h2>
            <span>casos importados</span>
          </div>
        </el-carousel-item>
      </el-carousel>
    </template> -->
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
