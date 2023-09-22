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
import { mapGetters, mapMutations } from 'vuex'
import cookies from '@/utils/mixins/cookies'

export default {
  name: 'App',

  mixins: [cookies],

  computed: {
    ...mapGetters(['workspaceTeamName'])
  },

  watch: {
    $route: {
      deep: true,
      handler: 'handleRoute'
    }
  },

  methods: {
    ...mapMutations([
      'setRoute',
      'syncWorkspace'
    ]),

    handleRoute(to, _from) {
      document.title = `${this.workspaceTeamName} - ` + to.meta.title + (['dispute', 'ticket'].includes(to.name) ? ` #${to.params.id}` : '') || 'ProJuris'
      this.setRoute(to)
    }
  }
}

</script>
