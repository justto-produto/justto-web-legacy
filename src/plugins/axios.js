import Vue from 'vue'
import axios from 'axios'
import store from '@/store'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
const AUTH_TOKEN = localStorage.justoken
if (AUTH_TOKEN) {
  axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
}
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: process.env.baseURL || process.env.apiUrl || 'https://dev-env.acordo.pro/api',
  timeout: 60 * 100000, // Timeout
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
  // withCredentials: true, // Check cross-site Access-Control
}

const _axios = axios.create(config)

_axios.CancelToken = axios.CancelToken
_axios.isCancel = axios.isCancel

_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    if (response.status === 204 && response.config && !response.config.__isRetryRequest) {
      response.config.__isRetryRequest = true
      setTimeout(function () {
        return axios(response.config)
      }, 1000)
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
