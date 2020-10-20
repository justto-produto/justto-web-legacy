/* eslint-disable no-console */

import { register } from 'register-service-worker'

if ('serviceWorker' in navigator) {
  register(`${process.env.BASE_URL}serviceWorker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updated() {
      console.log('New content available. Plese update the page.')
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
