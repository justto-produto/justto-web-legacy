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
import calcBrightness from './utils/calcBrightness'
import validateCurrentId from './utils/validateCurrentId'
import extractMentions from './utils/extractMentions'
import { eventBus } from './utils/eventBus'
import normalizeDateToISO from './utils/normalizeDateToISO'
import {
  getRoles,
  formatHtml,
  getRoleIcon,
  getFirstRole,
  buildRoleTitle,
  approximateDate,
  approximateTime,
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
  formatHtml,
  buildQuery,
  getRoleIcon,
  getFirstRole,
  filterByTerm,
  axiosDispatch,
  calcBrightness,
  buildRoleTitle,
  approximateDate,
  approximateTime,
  extractMentions,
  getDocumentStep,
  getFormatedDate,
  normalizeString,
  isSimilarStrings,
  validateCurrentId,
  getStringInitials,
  addInvisibleStatus,
  getLastInteraction,
  getInteractionIcon,
  normalizeDateToISO,
  getTracktitleByAction,
  registerServiceWorker,
  showUnavailableLoading,
  getLastInteractionTooltip
}
