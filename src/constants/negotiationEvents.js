export default {
  EDITOR_FOCUS: {
    show: true,
    keys: ['ctrl', 'm'],
    codes: ['ctrl', 'm'],
    callback: 'NEGOTIATION_EVENTS_EDITOR_FOCUS'
  },
  SEARCH_FOCUS: {
    show: true,
    keys: ['alt', 'f'],
    codes: ['alt', 'f'],
    callback: 'GLOBAL_EVENTS_SEARCH_FOCUS'
  },
  TICKET_UP: {
    show: true,
    keys: ['alt', 'arrowup'],
    codes: ['alt', '&#8679;'],
    callback: 'NEGOTIATION_EVENTS_TICKET_UP'
  },
  TICKET_DOWN: {
    show: true,
    keys: ['alt', 'arrowdown'],
    codes: ['alt', '&#8681;'],
    callback: 'NEGOTIATION_EVENTS_TICKET_DOWN'
  },
  TICKET_PREVIOUS_TAB: {
    show: true,
    keys: ['alt', 'arrowleft'],
    codes: ['alt', '&#8678;'],
    callback: 'NEGOTIATION_EVENTS_TICKET_PREVIOUS_TAB'
  },
  TICKET_NEXT_TAB: {
    show: true,
    keys: ['alt', 'arrowright'],
    codes: ['alt', '&#8680;'],
    callback: 'NEGOTIATION_EVENTS_TICKET_NEXT_TAB'
  },
  SHOW_SHORTCUTS_HELP_1: {
    show: true,
    keys: ['ctrl', '?'],
    codes: ['ctrl', '&#63;'],
    callback: 'SHOW_SHORTCUTS_HELP_1'
  },
  SHOW_SHORTCUTS_HELP_2: {
    show: false,
    keys: ['ctrl', '/'],
    codes: ['ctrl', '&#47;'],
    callback: 'SHOW_SHORTCUTS_HELP_2'
  }
}
