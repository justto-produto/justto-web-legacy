import { DateTime } from '../GenericClasses'
import PersonDto from './TicketOverviewPartyResumedPerson'

class PersonContactDataDto {
  constructor({ id, archived, enriched, isValid, isMain, source, ranking, createAt, updateAt }) {
    this.id = id
    this.archived = archived
    this.enriched = enriched
    this.isValid = isValid
    this.isMain = isMain
    this.source = source
    this.ranking = ranking
    this.createAt = new DateTime(createAt || {})
    this.updateAt = new DateTime(updateAt || {})
  }
}

class PhoneDto extends PersonContactDataDto {
  constructor(phone) {
    const { number, mobile, service } = phone
    super(phone)
    this.number = number
    this.mobile = mobile
    this.service = service
  }
}

class EmailDto extends PersonContactDataDto {
  constructor(email) {
    const { address } = email
    super(email)
    this.address = address
  }
}

class OabDto extends PersonContactDataDto {
  constructor(oab) {
    const { number, state } = oab
    super(oab)
    this.number = number
    this.state = state
  }
}

class BankAccountDto {
  constructor({ personId, name, document, email, number, agency, bank, type, id, associatedInDispute }) {
    this.id = id
    this.associatedInDispute = Boolean(associatedInDispute)
    this.personId = personId
    this.name = name
    this.document = document
    this.email = email
    this.number = number
    this.agency = agency
    this.bank = bank
    this.type = type
  }
}

export default class DisputeOverviewPartiesVm {
  constructor(role) {
    const {
      personId,
      disputeRoleId,
      id,
      name,
      dead,
      namesake,
      birthday,
      documentNumber,
      polarity, party,
      status, online,
      roles,
      phones,
      emails,
      oabs,
      bankAccounts,
      personProperties
    } = role

    this.personId = personId
    this.disputeRoleId = disputeRoleId || id
    this.name = name
    this.birthday = birthday
    this.documentNumber = documentNumber
    this.polarity = polarity || party
    this.status = status || (online ? 'ONLINE' : 'OFFLINE')
    this.roles = roles
    this.oabs = oabs.map(oab => `${oab.number}/${oab.state}`)
    this.phonesDto = phones.map(phone => new PhoneDto(phone))
    this.emailsDto = emails.map(email => new EmailDto(email))
    this.oabsDto = oabs.map(oab => new OabDto(oab))
    this.bankAccountsDto = bankAccounts.map(bankAccount => new BankAccountDto(bankAccount))
    this.person = new PersonDto({
      dead,
      id: personId,
      namesake,
      name,
      documentNumber,
      vexatiousParty: personProperties.IS_VEXATIOUS_PARTY === 'true',
      vexatiousAuthor: personProperties.IS_VEXATIOUS_AUTHOR === 'true',
      vexatiousLawyer: personProperties.IS_VEXATIOUS_LAWYER === 'true'
    })
    this.legacyDto = role
  }
}
