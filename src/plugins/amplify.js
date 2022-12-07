import Vue from 'vue'
// import { Amplify } from 'aws-amplify'
import { Amplify } from 'aws-amplify'
// import { AmplifyPlugin } from 'aws-amplify-vue'
import awsExports from '@/aws-exports'
import '@aws-amplify/ui-components'
import {
  applyPolyfills,
  defineCustomElements
} from '@aws-amplify/ui-components/loader'

Vue.config.ignoredElements = [/amplify-\w*/]

applyPolyfills().then(() => (defineCustomElements(window)))

Amplify.configure(awsExports)

Vue.prototype.$Amplify = Amplify
// Vue.use(AmplifyPlugin, AmplifyModules)
