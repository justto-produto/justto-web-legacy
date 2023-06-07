export default class ApiConfiguration {
  constructor({
    FINCH_ENDPOINT,
    FINCH_ACTIVE,
    FINCH_USERNAME,
    FINCH_PASSWORD,
    JUSTTO_WEBHOOK_ACTIVE,
    JUSTTO_WEBHOOK_ENDPOINT,
    JUSTTO_WEBHOOK_USERNAME,
    JUSTTO_WEBHOOK_PASSWORD,
    PROJURIS_SOAP_ACTIVE,
    PROJURIS_SOAP_PASSWORD,
    PROJURIS_SOAP_TOKEN,
    PROJURIS_SOAP_URL,
    PROJURIS_SOAP_USERNAME,
    workspaceId
  }) {
    this.workspaceId = workspaceId

    // debugger

    this.properties = [
      { key: 'FINCH_ACTIVE', value: FINCH_ACTIVE || 'false' },
      { key: 'JUSTTO_WEBHOOK_ACTIVE', value: JUSTTO_WEBHOOK_ACTIVE || 'false' },
      { key: 'PROJURIS_SOAP_ACTIVE', value: PROJURIS_SOAP_ACTIVE || 'false' }
    ]

    if (FINCH_ACTIVE === 'true') {
      this.properties.push({ key: 'FINCH_ENDPOINT', value: FINCH_ENDPOINT })
      this.properties.push({ key: 'FINCH_USERNAME', value: FINCH_USERNAME })

      if (FINCH_PASSWORD !== '******') {
        this.properties.push({ key: 'FINCH_PASSWORD', value: FINCH_PASSWORD })
      }
    }

    if (JUSTTO_WEBHOOK_ACTIVE === 'true') {
      this.properties.push({ key: 'JUSTTO_WEBHOOK_ENDPOINT', value: JUSTTO_WEBHOOK_ENDPOINT })
      this.properties.push({ key: 'JUSTTO_WEBHOOK_USERNAME', value: JUSTTO_WEBHOOK_USERNAME })

      if (JUSTTO_WEBHOOK_PASSWORD !== '******') {
        this.properties.push({ key: 'JUSTTO_WEBHOOK_PASSWORD', value: JUSTTO_WEBHOOK_PASSWORD })
      }
    }

    if (PROJURIS_SOAP_ACTIVE === 'true') {
      this.properties.push({ key: 'PROJURIS_SOAP_TOKEN', value: PROJURIS_SOAP_TOKEN })
      this.properties.push({ key: 'PROJURIS_SOAP_URL', value: PROJURIS_SOAP_URL })
      this.properties.push({ key: 'PROJURIS_SOAP_USERNAME', value: PROJURIS_SOAP_USERNAME })

      if (PROJURIS_SOAP_PASSWORD !== '******') {
        this.properties.push({ key: 'PROJURIS_SOAP_PASSWORD', value: PROJURIS_SOAP_PASSWORD })
      }
    }
  }
}
