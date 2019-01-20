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
      // map: []
    }
  },
  beforeMount () {
    // this.$store.dispatch('showLoading')
    // this.$store.dispatch('getCompaniesMap').then(map => {
    //   this.map = map
    // }).catch(() => {
    //   this.$notify.closeAll()
    //   this.$notify({
    //     title: 'Ops!',
    //     message: 'Houve uma falha de conexão com o servidor.',
    //     position: 'bottom-right',
    //     customClass: 'danger',
    //     type: 'error',
    //     duration: 5000
    //   })
    // }).finally(() => {
    //   this.$store.dispatch('hideLoading')
    // })
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
  .view-import__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .el-input__prefix {
    font-size: 1.3rem;
    left: 10px;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 40px;
  }
  .el-input--suffix .el-input__inner {
    padding-right: 40px;
  }
}
</style>
