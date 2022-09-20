<template>
  <div class="countdown">
    <span
      v-if="days > 0"
      class="countdown__digit"
    >
      {{ days | twoDigits }}
    </span>

    <span
      v-if="days > 0"
      class="countdown__separator"
    >:</span>

    <span
      v-if="hours > 0"
      class="countdown__digit"
    >
      {{ hours | twoDigits }}
    </span>

    <span
      v-if="hours > 0"
      class="countdown__separator"
    >:</span>

    <span
      class="countdown__digit"
    >
      {{ minutes | twoDigits }}
    </span>

    <span
      class="countdown__separator"
    >:</span>

    <span
      class="countdown__digit"
    >
      {{ seconds | twoDigits }}
    </span>
  </div>
</template>

<!-- Copyleft: https://github.com/getanwar/vuejs-countdown -->

<script>
let interval = null

export default {
  filters: {
    twoDigits(value) {
      if (value.toString().length <= 1) {
        return '0' + value.toString()
      }
      return value.toString()
    }
  },

  props: {
    end: {
      type: String,
      required: true
    },

    stop: {
      type: Boolean
    }
  },

  data() {
    return {
      now: Math.trunc(new Date().getTime() / 1000),
      date: null,
      diff: 0
    }
  },

  computed: {
    seconds() {
      return Math.trunc(this.diff) % 60
    },

    minutes() {
      return Math.trunc(this.diff / 60) % 60
    },

    hours() {
      return Math.trunc(this.diff / 60 / 60) % 24
    },

    days() {
      return Math.trunc(this.diff / 60 / 60 / 24)
    }
  },

  watch: {
    now(value) {
      this.diff = this.date - this.now
      if (this.diff <= 0 || this.stop) {
        this.diff = 0

        if (!this.stop) this.$emit('deadline')
        // Remove interval
        clearInterval(interval)
      }
    }
  },

  created() {
    if (!this.end) {
      throw new Error("Missing prop 'end'")
    }

    const endTime = this.end
    this.date = Math.trunc(Date.parse(endTime) / 1000)

    if (!this.date) {
      throw new Error("Invalid prop value, correct is 'end'")
    }

    interval = setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000)
    }, 1000)
  },

  destroyed() {
    clearInterval(interval)
  }
}
</script>

<style lang="scss" scoped>
.countdown {
  display: flex;
}
</style>
