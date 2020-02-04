import Vue from 'vue'
import store from '@/store'

const JusSegment = {
  install (Vue, options) {
    function SegmentLog (event, proprieties) {
      this.event = event
      this.proprieties = proprieties
    }
    Vue.prototype.$jusSegment = (event, prop) => {
      let proprieties = {
        userId: prop && prop.userId ? prop.userId : store.getters.accountEmail,
        workspace: prop && prop.workspace ? prop.workspace : store.getters.workspaceName,
        team: prop && prop.team ? prop.team : store.getters.workspaceTeamName,
        source: 'front',
        description: prop && prop.description ? prop.description : ''
      }
      window.analytics.track(event, proprieties, () => {
        if (process.env.NODE_ENV === 'development') {
          console.table(new SegmentLog(event, proprieties))
        }
      })
    }
  }
}

Vue.use(JusSegment)
