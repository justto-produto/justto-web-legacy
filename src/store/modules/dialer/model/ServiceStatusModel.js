/* eslint-disable camelcase */

/**
 * ServiceStatusModel is a representation of voice server state service
 * @class
 * @constructor
 * @public
 */
export default class ServiceStatusModel {
  service_id
  service_member_skill
  agent_ObjectId

  constructor(obj) {
    if (obj) Object.keys(obj).forEach(key => (this[key] = obj[key]))
  }
}
