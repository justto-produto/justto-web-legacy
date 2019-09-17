import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

Sentry.init({
  dsn: 'https://df34dd16a4864c36a2b7557e1365a378@sentry.io/1366224',
  integrations: [new Integrations.Vue({ Vue, attachProps: true })]
})
