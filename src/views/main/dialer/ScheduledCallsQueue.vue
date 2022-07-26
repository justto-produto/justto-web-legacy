<template>
  <article
    v-loading="loading"
    class="scheduled-call"
  >
    <div
      class="scheduled-call__update"
    >
      <el-tooltip
        content="Atualizar chamadas agendadas."
        :open-delay="500"
      >
        <el-button
          type="secondary"
          size="mini"
          :icon="loading ? 'el-icon-loading' : 'el-icon-refresh'"
          round
          class="scheduled-call__update-btn"
          @click="updatePhoneCalls"
        />
      </el-tooltip>

      <el-tooltip
        v-if="scheduledCallQueue.length > 0"
        content="Remover todas as chamadas agendadas."
        :open-delay="500"
      >
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete-solid"
          round
          class="scheduled-call__update-btn"
          @click="removeAllCalls"
        />
      </el-tooltip>
    </div>

    <el-collapse
      v-model="collapseState"
    >
      <el-collapse-item
        :title="collapseTitle"
        name="show"
        :disabled="!scheduledCallQueue.length"
      >
        <ul class="scheduled-call_list">
          <call
            v-for="(call, callIndex) in scheduledCallQueue"
            :key="`scheduledCall#${callIndex}`"
            v-model="scheduledCallQueue[callIndex]"
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
      queue: 'getScheduledCallsQueue',
      callQueue: 'getCallQueue'
    }),

    scheduledCallQueue() {
      const scheduledIds = this.callQueue.filter(({ scheduling }) => scheduling?.disputeMessageId).map(({ scheduling }) => scheduling?.disputeMessageId)

      return this.queue.filter(({ disputeMessageId: currentCallId }) => !scheduledIds.includes(currentCallId)) // Validar se o ID da chama atual está na lista
    },

    collapseTitle() {
      const isPlural = !(this.scheduledCallQueue?.length === 1)
      return `${this.scheduledCallQueue?.length || 0} ${isPlural ? 'ligações agendadas' : 'ligação agendada'}`
    },

    collapseState: {
      get() {
        return this.scheduledCallQueue.length ? this.collapseModel : []
      },
      set(model) {
        this.collapseModel = [...model]
      }
    }
  },

  methods: {
    ...mapActions({
      getPhoneCalls: 'getPhoneCalls',
      removeCall: 'unschedulePhoneCallStatus'
    }),

    updatePhoneCalls() {
      this.loading = true

      this.getPhoneCalls().finally(() => {
        setTimeout(() => { this.loading = false }, 1000)
      })
    },

    removeAllCalls() {
      const calls = this.scheduledCallQueue.map(({ disputeMessageId }) => disputeMessageId)

      if (calls.length) {
        this.$confirm(`Deseja remover todas as ${calls.length} chamadas agendadas?`, `${calls.length} chamadas agendadas`, {
          closeOnPressEscape: false,
          closeOnClickModal: false,
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não',
          center: true
        }).then(() => {
          this.loading = true

          Promise.all(calls.map(id => this.removeCall(id))).finally(() => {
            this.loading = false
          })
        })
      }
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

    .el-button + .el-button {
      margin-left: 4px;
    }
  }

  .el-collapse {
    .el-collapse-item {
      div[role="tab"] {
        .el-collapse-item__header {
          height: 30px;
          border: none;
          display: flex;
          gap: 4px;
          flex-direction: row-reverse;
          justify-content: flex-end;

          i {
            margin: 0;
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
