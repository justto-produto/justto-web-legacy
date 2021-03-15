import moment from 'moment'

const buildRoleTitle = function(party, title) {
  if (party === 'UNKNOWN') {
    switch (title) {
      case 'PARTY':
        return 'Parte desconhecida'
      case 'LAWYER':
        return 'Advogado desconhecido'
    }
  } else if (party === 'RESPONDENT') {
    switch (title) {
      case 'NEGOTIATOR':
        return 'Negociador'
      case 'PARTY':
        return 'Réu'
      case 'LAWYER':
        return 'Advogado do réu'
    }
  } else {
    if (title === 'PARTY') {
      return 'Parte contrária'
    } else if (title === 'LAWYER') {
      return 'Advogado da parte'
    } else {
      return ''
    }
  }
}

const getRoleIcon = function(party, title) {
  if (party === 'RESPONDENT' || party === 'UNKNOWN') {
    switch (title) {
      case 'NEGOTIATOR':
        return 'el-icon-service'
      case 'PARTY':
        return 'el-icon-office-building'
      case 'LAWYER':
        return 'el-icon-s-custom'
    }
  } else {
    if (title === 'PARTY') {
      return 'el-icon-user-solid'
    } else if (title === 'LAWYER') {
      return 'el-icon-s-custom'
    } else {
      return ''
    }
  }
}

const getRoles = function(disputeRoles, party, role) {
  let roles
  if (party) {
    if (Array.isArray(party)) roles = disputeRoles.filter(disputeRole => party.includes(disputeRole.party))
    else roles = disputeRoles.filter(disputeRole => disputeRole.party === party)
  }
  if (role) roles = roles.filter(disputeRole => disputeRole.roles.includes(role))
  return roles
}

const getFirstRole = function(disputeRoles, party, role) {
  const roles = getRoles(disputeRoles, party, role)
  if (roles.length === 0) return ''
  else if (roles.length === 1) return roles[0].name
  else return roles[0].name + ' (+ ' + (roles.length - 1) + ')'
}

const getLastInteraction = function(lastinteractiondate) {
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

const getInteractionIcon = function(interaction) {
  if (interaction) {
    switch (interaction.type) {
      case 'COMMUNICATION': {
        if (interaction.message) {
          switch (interaction.message.communicationType) {
            case 'EMAIL': return 'email'
            case 'EMAIL_CNA': return 'email-cna'
            case 'SMS': return 'sms'
            case 'CALL': return 'call'
            case 'CHAT': return 'chat'
            case 'TTS': return 'tts'
            case 'DELAY': return 'delay'
            case 'WHATSAPP': return 'whatsapp'
          }
        }
        return 'email'
      }
      case 'VISUALIZATION': return 'eye'
      case 'NEGOTIATOR_ACCESS': return 'justto'
      case 'NEGOTIATOR_PROPOSAL': return 'proposal'
      case 'NEGOTIATOR_CHECKOUT': return 'checkout'
      case 'NEGOTIATOR_ACCEPTED': return 'accepted-negotiation'
      case 'NEGOTIATOR_REJECTED': return 'rejected'
      case 'CLICK': return 'click'
      default: return 'eye'
    }
  } else {
    return 'eye'
  }
}

const getLastInteractionTooltip = function(interaction) {
  if (interaction) {
    switch (interaction.type) {
      case 'COMMUNICATION': {
        if (interaction.message) {
          switch (interaction.message.communicationType) {
            case 'EMAIL': return 'E-mail'
            case 'EMAIL_CNA': return 'E-mail CNA'
            case 'SMS': return 'SMS'
            case 'CALL': return 'Call'
            case 'CHAT': return 'Chat'
            case 'TTS': return 'TTS'
            case 'WHATSAPP': return 'Whatsapp'
          }
        }
        return 'email'
      }
      case 'VISUALIZATION': return 'Visualização sistema Justto'
      case 'NEGOTIATOR_ACCESS': return 'Acesso sistema Justto'
      case 'NEGOTIATOR_PROPOSAL': return 'Proposta de acordo'
      case 'NEGOTIATOR_CHECKOUT': return 'Aceite de acordo'
      case 'NEGOTIATOR_ACCEPTED': return 'Aceite de negociação'
      case 'NEGOTIATOR_REJECTED': return 'Rejeição de acordo'
      case 'CLICK': return 'Click na mensagem'
      default: return 'Visualização sistema Justto'
    }
  } else {
    return 'Visualização sistema Justto'
  }
}

const getDocumentStep = function(hasDocument, signStatus) {
  if (hasDocument) {
    if (signStatus) {
      if (signStatus === 'SIGNING') {
        return 2
      } return 3
    } return 1
  } return 0
}

const getTracktitleByAction = function(action, batch) {
  action = action.toUpperCase().replace('-', '_')
  let title
  if (action === 'SETTLED') title = 'Ação marcar como disputa GANHA'
  else if (action === 'UNSETTLED') title = 'Ação marcar disputa como PERDIDA'
  else if (action === 'PAUSED') title = 'Ação marcar disputa como PAUSADA'
  else if (action === 'RESUME') title = 'Ação marcar disputa como RETOMADA'
  else if (action === 'FAVORITE') title = 'Ação marcar disputa como FAVORITA'
  else if (action === 'DISFAVOR') title = 'Ação remover disputa como FAVORITA'
  else if (action === 'RESTART_ENGAGEMENT') title = 'Ação REINICIAR DISPUTA'
  else if (action === 'ENRICH') title = 'Ação ENRIQUECIMENTO'
  else if (action === 'CHANGE_EXPIRATION_DATE') title = 'Ação ALTERAR DATA LIMITE'
  else if (action === 'DELETE') title = 'Ação EXCLUIR'
  else if (action === 'CHANGE_STRATEGY') title = 'Ação ALTERAR FIM DA NEGOCIAÇÃO'
  else title = `Ação ${action} realizada`
  if (batch) title += ' em massa'
  else title += ' manual'
  return title
}

const getFormatedDate = (occurrence, customFormat = 'YYYY-MM-DD') => {
  const onlyDate = (occurrence.updateAt?.dateTime || occurrence.createAt?.dateTime).replace('T', ' ')
  return moment(onlyDate).format(customFormat)
}

export {
  getRoles,
  getRoleIcon,
  getFirstRole,
  buildRoleTitle,
  getFormatedDate,
  getDocumentStep,
  getLastInteraction,
  getInteractionIcon,
  getTracktitleByAction,
  getLastInteractionTooltip
}
