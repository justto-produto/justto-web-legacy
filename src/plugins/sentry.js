import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'

Sentry.init({
  dsn: 'https://f6d1b05e655a4df3a33eb9f9692171cc@o382953.ingest.sentry.io/5212577',
  integrations: [new VueIntegration({ Vue, attachProps: true, logErrors: true })],
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV !== 'production'
})
