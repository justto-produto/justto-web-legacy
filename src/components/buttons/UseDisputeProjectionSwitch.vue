<template>
  <el-tooltip
    content="Utilizar nova listagem de disputas."
    placement="right"
  >
    <el-switch
      v-model="value"
      active-value="ENABLED"
      inactive-value="DISABLED"
      class="dispute-projection__switch"
    />
  </el-tooltip>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UseDisputeProjectionSwitch',

  computed: {
    ...mapGetters({
      properties: 'userProperties'
    }),

    value: {
      get() {
        return this.properties?.USE_DISPUTE_PROJECTION || 'DISABLED'
      },

      set(USE_DISPUTE_PROJECTION) {
        this.setAccountProperty({ USE_DISPUTE_PROJECTION })
        window.location.reload()
      }
    }
  },

  methods: {
    ...mapActions(['setAccountProperty'])
  }
}
</script>

<style lang="scss" scoped>
.dispute-projection__switch {
  justify-content: center;
  margin: 8px 0;
}
</style>
