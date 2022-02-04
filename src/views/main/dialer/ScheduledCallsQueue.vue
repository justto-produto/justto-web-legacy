<template>
  <article class="scheduled-call">
    <ul class="scheduled-call_list">
      <call
        v-for="(call, callIndex) in queue"
        :key="`scheduledCall#${call.id}`"
        v-model="queue[callIndex]"
        class="scheduled-call_list-item"
      />
    </ul>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    Call: () => import('./partials/ScheduledCall')
  },

  computed: {
    ...mapGetters({
      queue: 'getScheduledCallsQueue'
    })
  }
}
</script>

<style lang="scss" scoped>
.scheduled-call {
  display: flex;
  flex-direction: column;

  .el-divider {
    margin: 8px 0;
  }

  .scheduled-call_list {
    margin: 0;
    list-style: none;
    padding: 0;

    .scheduled-call_list-item + .scheduled-call_list-item {
      margin-top: 8px;
    }
  }
}
</style>
