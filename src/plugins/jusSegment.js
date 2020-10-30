import Vue from 'vue'
import store from '@/store'

const JusSegment = {
  install(Vue, options) {
    function SegmentLog(event, properties) {
      this.event = event
      this.properties = properties
    }
    Vue.prototype.$jusSegment = (event, prop) => {
      const properties = {
        userId: store.getters.accountEmail,
        workspace: store.getters.workspaceName,
        team: store.getters.workspaceTeamName,
        source: 'front'
      }
      Object.assign(properties, prop)
      window.analytics.track(event, properties, () => {
        if (process.env.NODE_ENV === 'development') {
          console.table(new SegmentLog(event, properties))
        }
      })
    }
    Vue.prototype.$jusSegmentPage = (page) => {
      const properties = {
        userId: store.getters.accountEmail,
        workspace: store.getters.workspaceName,
        team: store.getters.workspaceTeamName,
        source: 'front'
      }
      window.analytics.page(page, () => {
        if (process.env.NODE_ENV === 'development') {
          console.table(new SegmentLog(page, properties))
        }
      })
    }
  }
}

Vue.use(JusSegment)
