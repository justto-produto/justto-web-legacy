import { axiosDispatch } from '@/utils'

const socketActions = {
  sendMessageEvent(_, params) {
    return axiosDispatch({
      url: `api/disputes/${params.id}/chat/message`,
      method: 'PUT',
      data: params.data
    })
  }
}

export default socketActions
