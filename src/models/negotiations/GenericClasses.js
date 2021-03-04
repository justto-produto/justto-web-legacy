export class CodedValueDomainDto {
  constructor({ id, code, description }) {
    this.id = id
    this.code = code
    this.description = description
  }
}

export class EntityDto {
  constructor({ createAt, updateAt, archived }) {
    this.createAt = createAt
    this.updateAt = updateAt
    this.archived = archived
  }
}

export class DateTime {
  constructor({ javaDate, dateTime }) {
    this.javaDate = javaDate
    this.dateTime = dateTime
  }
}
