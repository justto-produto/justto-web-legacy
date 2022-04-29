<template>
  <article
    v-if="type === 'switch'"
    v-loading="isLoading"
    class="scheduled-calls-switch"
  >
    <el-divider />

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

        <span> {{ $tc('call.scheduled.available', scheduledCallState) | capitalize }} </span>
      </div>
    </div>
  </article>

  <article
    v-else-if="type === 'button'"
    v-loading="isLoading"
    class="scheduled-calls-button"
  >
    <!-- <el-checkbox-group v-model="checkboxGroup4" size="mini" disabled> -->
    <el-checkbox
      v-model="scheduledCallState"
      size="small"
      border
    >
      <!-- <span>
        Ligação automática
      </span> -->
      <i
        :class="scheduledCallState ? 'el-icon-video-play' : 'el-icon-video-pause'"
      />
    </el-checkbox>
    <!-- </el-checkbox-group> -->
  </article>

  <article v-else />
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    type: {
      type: String,
      default: 'switch'
    }
  },

  data: () => ({ isLoading: false }),

  computed: {
    ...mapGetters({
      prefs: 'userPreferences',
      enabled: 'canMakeScheduledCalls'
    }),

    scheduledCallState: {
      get() {
        return this.enabled
      },
      set(value) {
        this.isLoading = true

        this.setAccountProperty({
          AVAILABLE_SCHEDULED_CALLS: { true: 'AVAILABLE', false: 'UNAVAILABLE' }[value]
        }).finally(() => { this.isLoading = false })
      }
    }
  },

  methods: {
    ...mapActions(['setAccountProperty']),

    toggleScheduledCallState(state) {
      if (this.scheduledCallState !== state) this.scheduledCallState = state
    }
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

.scheduled-calls-button {
  width: 100%;
  text-align: right;
}
</style>
