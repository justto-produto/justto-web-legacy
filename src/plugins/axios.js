import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import axios from 'axios'
import store from '@/store'
import waitForConnection from '@/utils/loading'

const AUTH_TOKEN = localStorage.justoken

if (AUTH_TOKEN) {
  axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
}

let config = {
  baseURL: process.env.VUE_APP_BASE_URL || location.origin,
  timeout: 60 * 11000,
  headers: {}
}

const _axios = axios.create(config)

_axios.CancelToken = axios.CancelToken
_axios.isCancel = axios.isCancel

_axios.interceptors.request.use(
  function (config) {
    let storageWorkspace = JSON.parse(localStorage.getItem('jusworkspace'))
    if (store.getters.isLoggedIn && store.getters.hasWorkspace && storageWorkspace && storageWorkspace.subDomain) {
      if (config.headers.common.Workspace !== storageWorkspace.subDomain) {
        window.location.reload()
      }
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

_axios.interceptors.response.use(
  function (response) {
    if (response.status === 204 && response.config && !response.config.__isRetryRequest) {
      response.config.__isRetryRequest = true
      setTimeout(function () {
        return axios(response.config)
      }, 2000)
    }
    return response
  },
  function (error) {
    if (process.env.NODE_ENV === 'production') Sentry.captureException(error)
    if (error.response.status === 503) {
      if (waitForConnection()) return Promise.reject(error)
      else return 0
    }
    if (error.response.status === 401 && error.response.data.code !== 'INVALID_CREDENTIALS') {
      store.dispatch('logout')
    }
    return Promise.reject(error)
  }
)

Plugin.install = function (Vue, options) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios
      }
    },
    $axios: {
      get () {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
