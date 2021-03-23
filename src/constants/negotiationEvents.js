export default {
  EDITOR_FOCUS: {
    keys: ['ctrl', 'm'],
    callback: 'NEGOTIATION_EVENTS_EDITOR_FOCUS'
  },
  SEARCH_FOCUS: {
    keys: ['alt', 'f'],
    callback: 'NEGOTIATION_EVENTS_SEARCH_FOCUS'
  },
  TICKET_DOWN: {
    keys: ['alt', 'arrowdown'],
    callback: 'NEGOTIATION_EVENTS_TICKET_DOWN'
  },
  TICKET_UP: {
    keys: ['alt', 'arrowup'],
    callback: 'NEGOTIATION_EVENTS_TICKET_UP'
  },
  TICKET_NEXT_TAB: {
    keys: ['alt', 'arrowright'],
    callback: 'NEGOTIATION_EVENTS_TICKET_NEXT_TAB'
  },
  TICKET_PREVIOUS_TAB: {
    keys: ['alt', 'arrowleft'],
    callback: 'NEGOTIATION_EVENTS_TICKET_PREVIOUS_TAB'
  },
  SHOW_SHORTCUTS_HELP_1: {
    keys: ['ctrl', '?'],
    callback: 'NEGOTIATION_EVENTS_SHOW_SHORTCUTS_HELP_1'
  },
  SHOW_SHORTCUTS_HELP_2: {
    keys: ['ctrl', '/'],
    callback: 'NEGOTIATION_EVENTS_SHOW_SHORTCUTS_HELP_2'
  }
}
