// eslint-disable-next-line no-unused-vars

/**
 * PauseReasonModel is a representation of reason to pause a call
 * @class
 * @constructor
 * @public
 */
export default class PauseReasonModel {
  _id;
  CompanyId;
  Description;
  Name;
  IsActive;
  RecordDate;
  ChangeDate;
  InactiveDate;

  constructor(obj) {
    if (obj) Object.keys(obj).forEach(key => (this[key] = obj[key]))
  }
}
