export default class ApiConfiguration {
  constructor({
    FINCH_ENDPOINT,
    FINCH_ACTIVE,
    FINCH_USERNAME,
    FINCH_PASSWORD,
    JUSTTO_ACTIVE,
    JUSTTO_ENDPOINT,
    workspaceId
  }) {
    this.workspaceId = workspaceId
    this.properties = [
      { key: 'FINCH_ACTIVE', value: FINCH_ACTIVE || 'false' },
      { key: 'JUSTTO_ACTIVE', value: JUSTTO_ACTIVE || 'false' }
    ]
    if (FINCH_ACTIVE === 'true') {
      this.properties.push({ key: 'FINCH_ENDPOINT', value: FINCH_ENDPOINT })
      this.properties.push({ key: 'FINCH_USERNAME', value: FINCH_USERNAME })
      if (FINCH_PASSWORD !== '******') {
        this.properties.push({ key: 'FINCH_PASSWORD', value: FINCH_PASSWORD })
      }
    }
    if (JUSTTO_ACTIVE === 'true') {
      this.properties.push({ key: 'JUSTTO_ENDPOINT', value: JUSTTO_ENDPOINT })
    }
  }
}
