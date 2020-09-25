import Vue from 'vue'
import store from '@/store'

const JusSegment = {
  install(Vue, options) {
    function SegmentLog(event, proprieties) {
      this.event = event
      this.proprieties = proprieties
    }
    Vue.prototype.$jusSegment = (event, prop) => {
      const proprieties = {
        userId: store.getters.accountEmail,
        workspace: store.getters.workspaceName,
        team: store.getters.workspaceTeamName,
        source: 'front'
      }
      Object.assign(proprieties, prop)
      window.analytics.track(event, proprieties, () => {
        if (process.env.NODE_ENV === 'development') {
          console.table(new SegmentLog(event, proprieties))
        }
      })
    }
    Vue.prototype.$jusSegmentPage = (page) => {
      const proprieties = {
        userId: store.getters.accountEmail,
        workspace: store.getters.workspaceName,
        team: store.getters.workspaceTeamName,
        source: 'front'
      }
      window.analytics.page(page, () => {
        if (process.env.NODE_ENV === 'development') {
          console.table(new SegmentLog(page, proprieties))
        }
      })
    }
  }
}

Vue.use(JusSegment)
