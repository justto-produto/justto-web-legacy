<template>
  <div class="import-loading-view">
    <h1>Saiba os próximos passos</h1>
    <div class="import-loading-view__gifs">
      <transition name="el-zoom-in-center">
        <div v-show="showGif > 0" class="import-loading-view__gif">
          <img src="@/assets/gifs/strategy.gif">
          <h3>Campanha<br>configurada</h3>
        </div>
      </transition>
      <transition name="el-zoom-in-center">
        <div v-show="showGif > 1" class="import-loading-view__gif">
          <img src="@/assets/gifs/search.gif">
          <h3>Enriquecimento<br>de dados</h3>
        </div>
      </transition>
      <transition name="el-zoom-in-center">
        <div v-show="showGif > 2" class="import-loading-view__gif">
          <img src="@/assets/gifs/send.gif">
          <h3>Envio de<br>mensagens</h3>
        </div>
      </transition>
      <transition name="el-zoom-in-center">
        <div v-show="showGif > 3" class="import-loading-view__gif">
          <img src="@/assets/gifs/message.gif">
          <h3>Comece a<br>negociar</h3>
        </div>
      </transition>
      <transition name="el-zoom-in-center">
        <div v-show="showGif > 4" class="import-loading-view__gif">
          <img src="@/assets/gifs/deal.gif">
          <h3>Feche<br>acordos</h3>
        </div>
      </transition>
    </div>
    <el-button type="primary" :plain="showGif < 5" :loading="showGif < 5" @click="$router.push('/management')">
      Continuar
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'ImportLoading',
  data () {
    return {
      showGif: 0
    }
  },
  mounted () {
    this.increaseShow()
  },
  methods: {
    increaseShow () {
      let self = this
      if (self.showGif === 0) {
        setTimeout(function () {
          self.showGif++
          if (self.showGif < 5) {
            self.increaseShow()
          }
        }, 1000)
      } else {
        setTimeout(function () {
          self.showGif++
          if (self.showGif < 5) {
            self.increaseShow()
          }
        }, 2000)
      }
    }
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
