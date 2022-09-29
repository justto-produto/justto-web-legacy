<template>
  <div>{{ tickets }}</div>
</template>

<script>
export default {
  props: {
    tab: {
      type: String,
      default: 'running'
    },

    tickets: {
      type: Object,
      required: true
    }
  }
}
</script>
