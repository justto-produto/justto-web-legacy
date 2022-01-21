<template>
  <article
    v-loading="isLoading"
    class="scheduled-calls-switch"
  >
    <div class="scheduled-calls-switch__container">
      <div class="scheduled-calls-switch__container-header">
        <label>
          {{ $tc('call.scheduled.label') }}:
        </label>
      </div>

      <div class="scheduled-calls-switch__container-body">
        <el-switch
          v-model="scheduledCallState"
          inactive-color="#FF4B54"
          active-color="#14CC30"
        />

        <span> {{ $tc('I_AM_AVAILABLE', scheduledCallState) }} </span>
      </div>
    </div>

    <el-divider />
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data: () => ({ isLoading: false }),

  computed: {
    ...mapGetters({
      prefs: 'userPreferences'
    }),

    scheduledCallState: {
      get() {
        return this.prefs?.properties?.AVAILABLE_SCHEDULED_CALLS !== 'UNAVAILABLE'
      },
      set(value) {
        this.isLoading = true
        this.setAccountProperty({
          AVAILABLE_SCHEDULED_CALLS: { true: 'AVAILABLE', false: 'UNAVAILABLE' }[value]
        }).finally(() => {
          this.isLoading = false
        })
      }
    }
  },

  methods: {
    ...mapActions(['setAccountProperty'])
  }
}
</script>

<style lang="scss" scoped>
.scheduled-calls-switch {
  width: 100%;

  .scheduled-calls-switch__container {
    display: flex;
    gap: 4px;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .scheduled-calls-switch__container-header {
      font-weight: 700;
    }
  }

  .el-divider.el-divider--horizontal {
    margin: 8px 0;
  }
}
</style>
