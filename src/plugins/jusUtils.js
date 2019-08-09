import Fuse from 'fuse.js'

const getRoles = function (disputeRoles, party, role) {
  let roles = disputeRoles.filter(disputeRole => {
    return disputeRole.party === party && disputeRole.roles.includes(role)
  })
  return roles
}

const getFirstRole = function (disputeRoles, party, role) {
  let roles = getRoles(disputeRoles, party, role)
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
  let list = fuse.search(term)
  return list
}

const getLastInteraction = function (lastinteractiondate) {
  if (!lastinteractiondate) return ''
  let date = this.$moment(lastinteractiondate + 'Z')
  if (date.isValid()) {
    let now = this.$moment()
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
  return ''
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
      return 'negotiation2'
    default:
      return ''
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
      return 'Última interação via Sistema Justto'
    default:
      return ''
  }
}

export {
  getRoles,
  getFirstRole,
  fuseSearchDisputes,
  getLastInteraction,
  getLastInteractionIcon,
  getLastInteractionTooltip
}
