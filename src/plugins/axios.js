import Vue from 'vue'
import axios from 'axios'
import store from '@/store'

const AUTH_TOKEN = localStorage.justoken

if (AUTH_TOKEN) {
  axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
}

let config = {
  baseURL: process.env.VUE_APP_BASE_URL || location.origin,
  timeout: 60 * 1000,
  headers: {}
}

const _axios = axios.create(config)

_axios.CancelToken = axios.CancelToken
_axios.isCancel = axios.isCancel

_axios.interceptors.request.use(
  function (config) {
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
    if (error.response.status === 401) {
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
