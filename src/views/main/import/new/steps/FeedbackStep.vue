<template>
  <div class="feedback-step">
    <h2>Resumo</h2>
    <p>
      Agrupamos seus casos por empresas. Cada empresa possui a sua Campanha, que você poderá, posteriormente, editar
      as existentes ou criar novas Campanhas.
      <br><br>
      <a href="#">Entenda o que são, e como funcionam as Campanhas.</a>
    </p>
    <div class="view-import__container">
      <div class="view-import__content">
        <jus-import-feedback-card company="Nestlé" color="#72cbff"/>
        <jus-import-feedback-card :responsibles="responsibles" company="Cacau Show" color="#ff7a72"/>
      </div>
    </div>
  </div>
</template>

<script>
import JusImportFeedbackCard from '@/components/layouts/JusImportFeedbackCard'

export default {
  name: 'FeedbackStep',
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
.feedback-step {
  p {
    text-align: center;
    max-width: 600px;
    margin: auto;
  }
  // width: 100%;
  // max-width: 400px;
  // margin: auto;
}
.feedback-step {
  .view-import__content {
    display: flex;
    justify-content: center;
  }
}
</style>
