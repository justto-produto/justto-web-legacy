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

    handleRoute(to, from) {
      const prefix = this.workspaceTeamName ? `[${this.workspaceTeamName.trim()}] ` : ''
      const sufix = (['dispute', 'ticket'].includes(to.name) ? ` #${to.params.id}` : '')

      document.title = prefix + to.meta.title + sufix
      this.setRoute(to)
    }
  }
}

</script>
