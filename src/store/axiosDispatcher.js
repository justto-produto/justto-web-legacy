import store from '@/store'

const axiosDispatcher = (params) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line
    axios({
      url: params.url,
      method: params.method || 'get',
      params: params.params,
      data: params.data
    }).then(response => {
      if (params.mutation) store.commit(params.mutation, response.data)
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

export default axiosDispatcher
