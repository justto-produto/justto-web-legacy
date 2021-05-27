import axiosDispatch from './utils/axiosDispatch'
import buildQuery from './utils/buildQuery'
import filterByTerm from './utils/filterByTerm'
import getStringInitials from './utils/getStringInitials'
import isSimilarStrings from './utils/isSimilarStrings'
import stripHtml from './utils/stripHtml'
import scapeHtml from './utils/scapeHtml'
import normalizeString from './utils/normalizeString'
import registerServiceWorker from './utils/registerServiceWorker'
import showUnavailableLoading from './utils/showUnavailableLoading'
import uuidv4 from './utils/uuidv4'
import validateCurrentId from './utils/validateCurrentId'
import { eventBus } from './utils/eventBus'
import {
  getRoles,
  getRoleIcon,
  getFirstRole,
  buildRoleTitle,
  getDocumentStep,
  getFormatedDate,
  addInvisibleStatus,
  getLastInteraction,
  getInteractionIcon,
  getTracktitleByAction,
  getLastInteractionTooltip
} from './utils/others'

export {
  uuidv4,
  eventBus,
  getRoles,
  scapeHtml,
  stripHtml,
  buildQuery,
  getRoleIcon,
  getFirstRole,
  filterByTerm,
  axiosDispatch,
  buildRoleTitle,
  getDocumentStep,
  getFormatedDate,
  normalizeString,
  isSimilarStrings,
  validateCurrentId,
  getStringInitials,
  addInvisibleStatus,
  getLastInteraction,
  getInteractionIcon,
  getTracktitleByAction,
  registerServiceWorker,
  showUnavailableLoading,
  getLastInteractionTooltip
}
