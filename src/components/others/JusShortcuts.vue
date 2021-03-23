<template>
  <article>
    <span
      v-for="shortcut in shortcuts"
      :key="shortcut.callback"
      v-shortkey="shortcut.keys"
      @shortkey="doAction(shortcut)"
    />
  </article>
</template>

<script>
import events from '@/constants/negotiationEvents'
import { eventBus } from '@/utils'

export default {
  computed: {
    shortcuts() {
      return Object.values(events)
    }
  },
  methods: {
    doAction({ callback }) {
      eventBus.$emit(callback)
    }
  }
}
</script>
