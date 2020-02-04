import Vue from 'vue'

const JusSegment = {
  install (Vue, options) {
    function SegmentLog (method, identifier, args) {
      this.method = method
      this.args = args
      this.identifier = identifier
    }
    Vue.prototype.$jusSegment = (method, args) => {
      let identifier = args.id
      delete args.id
      window.analytics[method](identifier, args, () => {
        if (process.env.NODE_ENV === 'development') {
          console.table(new SegmentLog(method, identifier, args))
        }
      })
    }
  }
}

Vue.use(JusSegment)
