import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const tagModule = {
  state: {
    workspaceTags: [],
    disputeTags: [],
    colors: [
      '#f1c40f', // amarelo
      '#e74c3c', // vermelho
      '#f39c12', // laranja
      '#3498db', // azul
      '#1abc9c', // verde
      '#9b59b6' // roxo
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
