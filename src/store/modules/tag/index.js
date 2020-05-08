import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const tagModule = {
  state: {
    workspaceTags: [],
    disputeTags: [],
    filteredTags: [],
    colors: [
      '#FFEEAA', // amarelo
      '#FDC3BC', // vermelho
      '#FFDFAD', // laranja
      '#CFECFE', // azul
      '#B3F0E4', // verde
      '#EAEAEA' // roxo
    ],
    icons: [
      'user',
      'phone',
      'warning',
      'video-pause',
      'view',
      'date',
      'chat-dot-square',
      'edit',
      'star-on',
      'success'
    ]
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default tagModule
