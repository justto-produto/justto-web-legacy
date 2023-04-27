<template>
  <div id="app">
    <transition name="fade">
      <router-view />
    </transition>
    <audio
      id="globalAudio"
      controls
      autoplay="autoplay"
      style="display: none;"
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'App',
  watch: {
    $route: {
      deep: true,
      handler: 'handleRoute'
    }
  },

  methods: {
    ...mapMutations(['setRoute']),

    handleRoute(to, _from) {
      document.title = to.meta.title + (['dispute', 'ticket'].includes(to.name) ? ` #${to.params.id}` : '') || 'ProJuris'
      this.setRoute(to)
    }
  }
}

</script>
