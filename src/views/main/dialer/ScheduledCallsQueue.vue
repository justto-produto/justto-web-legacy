<template>
  <article
    v-loading="loading"
    class="scheduled-call"
  >
    <div
      class="scheduled-call__update"
    >
      <el-button
        type="secondary"
        size="mini"
        :icon="loading ? 'el-icon-loading' : 'el-icon-refresh'"
        round
        class="scheduled-call__update-btn"
        @click="updatePhoneCalls"
      />
    </div>

    <el-collapse
      v-model="collapseState"
    >
      <el-collapse-item
        :title="collapseTitle"
        name="show"
        :disabled="!queue.length"
      >
        <ul class="scheduled-call_list">
          <call
            v-for="(call, callIndex) in queue"
            :key="`scheduledCall#${callIndex}`"
            v-model="queue[callIndex]"
            class="scheduled-call_list-item"
          />
        </ul>
      </el-collapse-item>
    </el-collapse>
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Call: () => import('./partials/ScheduledCall')
  },

  data: () => ({
    loading: false,
    collapseModel: ['show']
  }),

  computed: {
    ...mapGetters({
      queue: 'getScheduledCallsQueue'
    }),

    collapseTitle() {
      const isShowing = this.collapseState.includes('show')
      const countInfo = `(${this.queue?.length || 0} itens)`

      return `${isShowing ? 'Esconder' : 'Mostrar'} ${countInfo}`
    },

    collapseState: {
      get() {
        return this.queue.length ? this.collapseModel : []
      },
      set(model) {
        this.collapseModel = [...model]
      }
    }
  },

  methods: {
    ...mapActions({
      getPhoneCalls: 'getPhoneCalls'
    }),

    updatePhoneCalls() {
      this.loading = true

      this.getPhoneCalls().finally(() => {
        setTimeout(() => { this.loading = false }, 1000)
      })
    }
  }
}
</script>

<style lang="scss">
.scheduled-call {
  .scheduled-call__update {
    position: absolute;
    right: 0;

    .scheduled-call__update-btn {
      span {
        display: none;
      }

      &:hover span {
        display: inline;
      }
    }
  }

  .el-collapse {
    .el-collapse-item {
      div[role="tab"] {
        .el-collapse-item__header {
          height: 30px;
          border: none;

          i {
            display: none;
          }
        }
      }

      div[role="tabpanel"] {
        .el-collapse-item__content {
          padding: 0;

          .scheduled-call_list {
            padding: 0;
            width: calc(100% + 20px);
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.scheduled-call {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;

  .el-divider {
    margin: 8px 0;
  }

  .scheduled-call_list {
    margin: 0;
    list-style: none;
    padding: 0;
    max-height: 40vh;
    overflow-y: scroll;
    overflow-x: visible;

    .scheduled-call_list-item + .scheduled-call_list-item {
      margin-top: 16px;
    }
  }
}
</style>
