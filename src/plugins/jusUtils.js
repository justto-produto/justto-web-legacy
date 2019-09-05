import Fuse from 'fuse.js'
import moment from 'moment'

const getRoles = function (disputeRoles, party, role) {
  let roles
  if (party) {
    roles = disputeRoles.filter(disputeRole => {
      return disputeRole.party === party
    })
  }
  if (role) {
    roles = roles.filter(disputeRole => {
      return disputeRole.roles.includes(role)
    })
  }
  return roles
}

const getFirstRole = function (disputeRoles, party, role) {
  const roles = getRoles(disputeRoles, party, role)
  if (roles.length === 0) {
    return ''
  } else if (roles.length === 1) {
    return roles[0].name
  } else {
    return roles[0].name + ' (+ ' + (roles.length - 1) + ')'
  }
}

const fuseSearchDisputes = function (disputes, term) {
  const fuse = new Fuse(disputes, {
    shouldSort: true,
    tokenize: true,
    matchAllTokens: true,
    threshold: 0.1,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      'id',
      'code',
      'campaign.name',
      'disputeRoles.name',
      'disputeRoles.name',
      'disputeRoles.documentNumber',
      'disputeRoles.oabs.number',
      'campaign.strategy'
    ]
  })
  const list = fuse.search(term)
  return list
}

const fuseSearchOccurrences = function (occurrences, term) {
  const fuse = new Fuse(occurrences, {
    shouldSort: true,
    tokenize: true,
    matchAllTokens: true,
    threshold: 0.1,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      'description',
      'code',
      'message.content',
      'message.sender',
      'message.receiver'
    ]
  })
  const list = fuse.search(term)
  return list
}

const getLastInteraction = function (lastinteractiondate) {
  if (!lastinteractiondate) return ''
  const now = moment()
  const date = moment(lastinteractiondate)
  if (now.diff(date, 'seconds') < 0) {
    return ''
  } else if (now.diff(date, 'seconds') < 59) {
    return 'há ' + now.diff(date, 'seconds') + ' segundos'
  } else if (now.diff(date, 'minutes') < 59) {
    return 'há ' + now.diff(date, 'minutes') + ' minuto(s)'
  } else if (now.diff(date, 'hours') < 24) {
    return 'há ' + now.diff(date, 'hours') + ' hora(s)'
  } else if (now.diff(date, 'hours') < 48) {
    return 'há 1 dia'
  } else {
    return date.format('DD/MM/YY')
  }
}

const getLastInteractionIcon = function (type) {
  switch (type) {
    case 'EMAIL_CNA':
      return 'cna'
    case 'EMAIL':
      return 'email'
    case 'WHATSAPP':
      return 'whatsapp'
    case 'SMS':
      return 'sms'
    case 'TTS':
      return 'tts'
    case 'NEGOTIATION':
      return 'eye'
    default:
      return 'eye'
  }
}

const getLastInteractionTooltip = function (type) {
  switch (type) {
    case 'EMAIL_CNA':
      return 'Última interação via CNA'
    case 'EMAIL':
      return 'Última interação via E-mail'
    case 'WHATSAPP':
      return 'Última interação via WhatsApp'
    case 'SMS':
      return 'Última interação via SMS'
    case 'TTS':
      return 'Última interação via WhatsApp'
    case 'NEGOTIATION':
      return 'Última visualização'
    default:
      return 'Última visualização'
  }
}

const isBase64 = function (str) {
  if (!str) return false
  if (str === '' || str.trim() === '') return false
  try {
    return btoa(atob(str)) === str
  } catch (err) {
    return false
  }
}

const uuidv4 = function () {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // eslint-disable-next-line
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export {
  getRoles,
  getFirstRole,
  fuseSearchDisputes,
  fuseSearchOccurrences,
  getLastInteraction,
  getLastInteractionIcon,
  getLastInteractionTooltip,
  isBase64,
  uuidv4
}

// import Vue from 'vue'
// const JusUtils = {
//   install (Vue, options) {
//     Vue.prototype.$jusUtils = (method, args = {}) => {
//       switch (method) {
//         case 'fuseSearchDisputes':
//         console.log(args);
//           return () => {
//             const fuse = new Fuse(args.disputes, {
//               shouldSort: true,
//               tokenize: true,
//               matchAllTokens: true,
//               threshold: 0.1,
//               location: 0,
//               distance: 100,
//               maxPatternLength: 32,
//               minMatchCharLength: 1,
//               keys: [
//                 'id',
//                 'code',
//                 'campaign.name',
//                 'disputeRoles.name',
//                 'disputeRoles.name',
//                 'disputeRoles.documentNumber',
//                 'disputeRoles.oabs.number',
//                 'campaign.strategy'
//               ]
//             })
//             const list = fuse.search(args.term)
//             console.log(list);
//             return list
//           }
//       }
//     }
//   }
// }
// Vue.use(JusUtils)
