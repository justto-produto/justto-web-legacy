<template>
  <div class="import-loading-view">
    <h1>Saiba os próximos passos</h1>
    <div class="import-loading-view__gifs">
      <transition name="el-zoom-in-center">
        <div
          v-show="showGif > 0"
          class="import-loading-view__gif"
        >
          <img src="@/assets/gifs/strategy.gif">
          <h3>Campanha<br>configurada</h3>
        </div>
      </transition>
      <transition name="el-zoom-in-center">
        <div
          v-show="showGif > 1"
          class="import-loading-view__gif"
        >
          <img src="@/assets/gifs/search.gif">
          <h3>Enriquecimento<br>de dados</h3>
        </div>
      </transition>
      <transition name="el-zoom-in-center">
        <div
          v-show="showGif > 2"
          class="import-loading-view__gif"
        >
          <img src="@/assets/gifs/message.gif">
          <h3>Envio de<br>mensagens</h3>
        </div>
      </transition>
      <transition name="el-zoom-in-center">
        <div
          v-show="showGif > 3"
          class="import-loading-view__gif"
        >
          <img src="@/assets/gifs/send.gif">
          <h3>Comece a<br>negociar</h3>
        </div>
      </transition>
      <transition name="el-zoom-in-center">
        <div
          v-show="showGif > 4"
          class="import-loading-view__gif"
        >
          <img src="@/assets/gifs/deal.gif">
          <h3>Feche<br>acordos</h3>
        </div>
      </transition>
    </div>
    <el-button
      :plain="showGif < 6"
      :loading="showGif < 6"
      type="primary"
      data-testid="submit"
      @click="goToManagement"
    >
      Continuar
    </el-button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'ImportLoading',
  data() {
    return {
      showGif: 0
    }
  },
  mounted() {
    this.increaseShow()
  },
  methods: {
    ...mapMutations([
      'updateDisputeQuery',
      'addPrescription',
      'setDisputesTab'
    ]),

    increaseShow() {
      const self = this
      if (self.showGif === 0) {
        setTimeout(function() {
          self.showGif++
          self.increaseShow()
        }, 1000)
      } else if (self.showGif < 5) {
        setTimeout(function() {
          self.showGif++
          self.increaseShow()
        }, 2000)
      } else if (self.showGif === 5) {
        setTimeout(function() {
          self.showGif++
          self.increaseShow()
        }, Math.floor(Math.random() * 2000))
      }
    },
    goToManagement() {
      this.updateDisputeQuery({ key: 'status', value: ['IMPORTED', 'ENRICHED', 'ENGAGEMENT', 'PENDING'] })
      this.updateDisputeQuery({ key: 'sort', value: ['expirationDate,asc'] })
      this.addPrescription('NEWLY_IMPORTED')
      this.setDisputesTab('1')
      this.$router.push('/management')
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
