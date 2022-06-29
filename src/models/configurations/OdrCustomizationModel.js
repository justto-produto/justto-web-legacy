export default class OdrCustomizationModel {
  constructor({ FOOTER_EMAIL_TEMPLATE_ID, CUSTOM_EMAIL_SENDER, DEAL_URL }) {
    this.link = DEAL_URL || 'https://acordo.app'
    this.email = CUSTOM_EMAIL_SENDER || 'acordo@justto.app'
    this.emailFooterId = FOOTER_EMAIL_TEMPLATE_ID || 3054
    this.emailFooter = ''
  }

  get saveNew() {
    return Number(this.emailFooterId) === 3054
  }

  set emailFooterTemplate({ body }) {
    this.emailFooter = body
  }
}
