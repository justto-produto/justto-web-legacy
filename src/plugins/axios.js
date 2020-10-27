import * as Sentry from '@sentry/browser'
import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { showUnavailableLoading } from '@/utils'

const AUTH_TOKEN = localStorage.justoken

if (AUTH_TOKEN) {
  axios.defaults.headers.common.Authorization = AUTH_TOKEN
}

const config = {
  baseURL: process.env.VUE_APP_BASE_URL || location.origin,
  timeout: 60 * 11000,
  headers: {}
}

const _axios = axios.create(config)

_axios.CancelToken = axios.CancelToken
_axios.isCancel = axios.isCancel

_axios.interceptors.request.use(
  function(config) {
    const storageWorkspace = JSON.parse(localStorage.getItem('jusworkspace'))
    if (store.getters.isLoggedIn && store.getters.hasWorkspace && storageWorkspace && storageWorkspace.subDomain) {
      if (config.headers.common.Workspace !== storageWorkspace.subDomain) {
        window.location.reload()
      }
    }
    if (!axios.defaults.headers.common.UserLanguage) {
      axios.defaults.headers.common.UserLanguage = store.getters.getUserLanguage
    }
    if (!axios.defaults.headers.common.UserTimeZone) {
      axios.defaults.headers.common.UserTimeZone = store.getters.getUserTimeZone
    }
    if (!axios.defaults.headers.common.UserBrowserName) {
      axios.defaults.headers.common.UserBrowserName = store.getters.getUserBrowserName
    }
    if (!axios.defaults.headers.common.UserOS) {
      axios.defaults.headers.common.UserOS = store.getters.getUserOS
    }
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

_axios.interceptors.response.use(
  function(response) {
    if (response.status === 204 && response.config && response.config.__isRetryRequest) {
      response.config.__isRetryRequest = false
      setTimeout(function() {
        return axios(response.config)
      }, 2000)
    }
    return response
  },
  function(error) {
    if (process.env.NODE_ENV === 'production') Sentry.captureException(error)
    if (error.response.status === 503) {
      showUnavailableLoading()
    }
    if (error.response.status === 401 && error.response.data.code !== 'INVALID_CREDENTIALS') {
      store.dispatch('logout')
    }
    return Promise.reject(error)
  }
)

Plugin.install = function(Vue, options) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios
      }
    },
    $axios: {
      get() {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
