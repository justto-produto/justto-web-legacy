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
  constructor({ dateTime, javaDate }) {
    this.dateTime = dateTime
    this.javaDate = javaDate
  }
}

export {
  CodedValueDomainDto,
  EntityDto,
  DateTime
}
