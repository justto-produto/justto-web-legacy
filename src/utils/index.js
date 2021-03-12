import axiosDispatch from './utils/axiosDispatch'
import buildQuery from './utils/buildQuery'
import filterByTerm from './utils/filterByTerm'
import getStringInitials from './utils/getStringInitials'
import isSimilarStrings from './utils/isSimilarStrings'
import stripHtml from './utils/stripHtml'
import normalizeString from './utils/normalizeString'
import registerServiceWorker from './utils/registerServiceWorker'
import showUnavailableLoading from './utils/showUnavailableLoading'
import uuidv4 from './utils/uuidv4'
import { eventBus } from './utils/eventBus'
import {
  buildRoleTitle,
  getRoleIcon,
  getRoles,
  getFirstRole,
  getLastInteraction,
  getInteractionIcon,
  getLastInteractionTooltip,
  getDocumentStep,
  getTracktitleByAction
} from './utils/others'

export {
  eventBus,
  axiosDispatch,
  buildQuery,
  filterByTerm,
  getStringInitials,
  isSimilarStrings,
  normalizeString,
  registerServiceWorker,
  showUnavailableLoading,
  stripHtml,
  uuidv4,
  buildRoleTitle,
  getRoleIcon,
  getRoles,
  getFirstRole,
  getLastInteraction,
  getInteractionIcon,
  getLastInteractionTooltip,
  getDocumentStep,
  getTracktitleByAction
}
