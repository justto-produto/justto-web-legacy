<template>
  <article class="call-queue__container">
    <div>
      {{ tabCanMakeCalls }}
    </div>

    <div
      v-for="(call, callIndex) in callQueue"
      :key="`callQueueItem-${callIndex}`"
      class="call-queue__container-call-queue"
    >
      <div class="call-queue__container-call-queue-line">
        <div class="call-queue__container-call-queue-line-item">
          #{{ call.disputeId }} ({{ $tc(`ticket-status.${call.disputeStatus}`) }})
        </div>
        <el-tag
          class="call-queue__container-call-queue-line-item"
          size="mini"
        >
          {{ $tc(`call.status.${call.status}`) }}
        </el-tag>
      </div>

      <div class="call-queue__container-call-queue-line">
        <div class="call-queue__container-call-queue-line-item">
          {{ call.toRoleName | resumedName }}
        </div>

        <div class="call-queue__container-call-queue-line-item">
          {{ call.number | phoneNumber }}
        </div>

        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          circle
          plain
          @click="remove"
        />
      </div>
    </div>

    <div class="call-queue__container-feedback">
      feedback aqui
    </div>

    <div>
      <!-- v-if="tabCanMakeCalls === 'CURRENT'" -->
      <el-button
        type="primary"
        size="mini"
      >
        Desabilitar discador
      </el-button>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      sharedManagementCall: null
    }
  },

  computed: {
    ...mapGetters({
      dialer: 'getDialer',
      callQueue: 'getCallQueue',
      currentAppInstance: 'getAppInstance'
    }),

    tabCanMakeCalls() {
      if (this.sharedManagementCall === null) {
        return 'NONE'
      } else if (this.sharedManagementCall?.appInstance === this.currentAppInstance) {
        return 'CURRENT'
      } else {
        return 'ANOTHER'
      }
    }
  },

  created() {
    this.sharedManagementCall = JSON.parse(localStorage.getItem('JUSTTO_MANAGEMENT_CALL'))
  },

  updated() {
    this.sharedManagementCall = JSON.parse(localStorage.getItem('JUSTTO_MANAGEMENT_CALL'))
  },

  methods: {
    remove() {
      // TODO: Remove discador da fila.
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.call-queue__container {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .call-queue__container-call-queue {
    border: solid thin $--color-gray;
    border-radius: 6px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .call-queue__container-call-queue-line {
      display: flex;
      flex-direction: row;
      gap: 8px;
      justify-content: space-between;
      align-items: center;
      gap: 16px;

      .el-button:hover {
        border-color: white;

        .el-icon-delete::before {
          color: white;
        }
      }
    }
  }
}
</style>
