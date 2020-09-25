import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const tagModule = {
  state: {
    workspaceTags: [],
    disputeTags: [],
    filteredTags: [],
    colors: [
      '#f1c40f', // 0 amarelo
      '#e74c3c', // 1 vermelho
      '#f39c12', // 2 laranja
      '#3498db', // 3 azul
      '#1abc9c', // 4 verde
      '#9b59b6' //  5 roxo
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
