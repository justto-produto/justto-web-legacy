class CodedValueDomainDto {
  constructor({ id, code, description }) {
    this.id = id
    this.code = code
    this.description = description
  }
}

class EntityDto {
  constructor({ createAt, updateAt, archived }) {
    this.createAt = createAt
    this.updateAt = updateAt
    this.archived = archived
  }
}

class DateTime {
  constructor({ javaDate, dateTime }) {
    this.javaDate = javaDate
    this.dateTime = dateTime
  }
}

export default {
  CodedValueDomainDto,
  EntityDto,
  DateTime
}
