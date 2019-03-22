<template>
  <div class="import-loading-view">
    <h1>Saiba os próximos passos</h1>
    <div class="import-loading-view__gifs">
      <div class="import-loading-view__gif">
        <img src="@/assets/gifs/strategy.gif">
        <h3>Campanha<br>configurada</h3>
      </div>
      <div class="import-loading-view__gif">
        <img src="@/assets/gifs/search.gif">
        <h3>Enriquecimento<br>de dados</h3>
      </div>
      <div class="import-loading-view__gif">
        <img src="@/assets/gifs/send.gif">
        <h3>Envio de<br>mensagens</h3>
      </div>
      <div class="import-loading-view__gif">
        <img src="@/assets/gifs/message.gif">
        <h3>Comece a<br>negociar</h3>
      </div>
      <div class="import-loading-view__gif">
        <img src="@/assets/gifs/deal.gif">
        <h3>Feche<br>acordos</h3>
      </div>
    </div>
    <el-button type="primary" :plain="loading" :loading="loading" @click="$router.push('/management')">
      Continuar
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'ImportLoading',
  data () {
    return {
      loading: true
    }
  },
  beforeMount() {
    let self = this
    setTimeout(function () {
      self.loading = false
    }, 5000)
  }
}
</script>

<style lang="scss">
.import-loading-view {
  position: fixed;
  top: 0px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fcfcfc;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: 80px 0;
  &__gifs {
    display: flex;
  }
  &__gif {
    text-align: center;
    margin: 0 30px;
  }
  img {
    height: 150px;
  }
  button {
    width: 400px;
  }
}
</style>
