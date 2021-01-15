class PersonDataDto {
  constructor({ enriched, isValid, isMain, source, ranking }) {
    this.enriched = enriched
    this.isValid = isValid
    this.isMain = isMain
    this.source = source
    this.ranking = ranking
  }
}

class PhoneDto extends PersonDataDto {
  constructor({ number, mobile, service }) {
    super()
    this.number = number
    this.mobile = mobile
    this.service = service
  }
}

class EmailDto extends PersonDataDto {
  constructor({ address }) {
    super()
    this.address = address
  }
}

class OabDto extends PersonDataDto {
  constructor({ number, state }) {
    super()
    this.number = number
    this.state = state
  }
}

class BankAccountDto {
  constructor({ personId, name, document, email, number, agency, bank, type }) {
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

export class DisputeOverviewPartiesVm {
  constructor({ personId, name, alias, documentNumber, personType, party, roles, phones, emails, oabs, bankAccounts }) {
    this.personId = personId
    this.name = name
    this.alias = alias
    this.documentNumber = documentNumber
    this.personType = personType
    this.party = party
    this.roles = roles
    this.phones = phones.map(phone => new PhoneDto(phone))
    this.emails = emails.map(email => new EmailDto(email))
    this.oabs = oabs.map(oab => new OabDto(oab))
    this.bankAccounts = bankAccounts.map(bankAccount => new BankAccountDto(bankAccount))

    // main: boolean;
    // disputeId: number;
    // personProperties: { [index: string]: string };
    // roleNameParty: boolean;
    // roleNameLawyer: boolean;
    // roleNameNegotiator: boolean;
    // namesake: boolean;
    // dead: boolean;
    // online: boolean;
    // lastAccess: Date;
  }
}
