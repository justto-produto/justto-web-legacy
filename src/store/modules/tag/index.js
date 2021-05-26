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
      '#9b59b6', //  5 roxo
      '#FFCA36',
      '#64CD32',
      '#966DF7',
      '#FFF1C8',
      '#DFF9E4',
      '#F4EFFE',
      '#F9932C',
      '#F24A53',
      '#4EBD9C',
      '#FFF1C8',
      '#FCE4E5',
      '#D4FBF7',
      '#1AABE5',
      '#707070',
      '#F1F1F3'
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
