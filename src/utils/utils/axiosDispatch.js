import store from '@/store'

const axiosDispatch = (params) => {
  return new Promise((resolve, reject) => {
    const opt = { method: params.method || 'get' }
    if (params.url) opt.url = params.url
    else reject(new Error('Missing URL parameter.'))
    if (params.headers) opt.headers = params.headers
    if (params.data) opt.data = params.data
    if (params.params) opt.params = params.params
    // eslint-disable-next-line
    axios(opt).then(response => {
      if (params.mutation) {
        if (params.payload) store.commit(params.mutation, { data: response.data, payload: params.payload })
        else store.commit(params.mutation, response.data)
      }
      if (params.action) {
        if (params.payload) store.dispatch(params.action, { data: response.data, payload: params.payload })
        else store.dispatch(params.action, response.data)
      }
      resolve(response.data)
    }).catch(error => {
      reject(error)
    })
  })
}

export default axiosDispatch
