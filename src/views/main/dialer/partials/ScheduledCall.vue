<template>
  <li
    v-loading="loading"
    class="call"
  >
    <div class="call-container">
      <div class="call-container__info">
        <div class="call-container__info-top">
          <router-link :to="`/management/dispute/${receiverDisputeId}`">
            {{ `#${receiverDisputeId}` }} ({{ $tc(`ticket-status.${receiverDisputeStatus}`) }})
          </router-link>

          <el-tag size="mini">
            {{ scheduledTo | moment('[hoje às ] HH:mm') }}
          </el-tag>
        </div>
        <div class="call-container__info-bottom">
          <div>
            {{ (receiverName) | resumedName }}
          </div>

          <el-tag size="mini">
            {{ receiverNumber | phoneNumber }}
          </el-tag>

          <div class="call-container__actions">
            <el-tooltip
              content="Ligar agora"
            >
              <el-button
                type="success"
                icon="el-icon-phone"
                size="mini"
                plain
                round
                @click="makeCall"
              />
            </el-tooltip>

            <el-tooltip
              :open-delay="500"
              content="Remover ligação"
            >
              <el-button
                type="danger"
                icon="el-icon-delete-solid"
                size="mini"
                plain
                round
                @click="unscheduleCall"
              />
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ScheduledCallModel } from '@/models/managementCall/scheduledCallInfo'

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    loading: false
  }),

  computed: {
    ...mapGetters({
      appInstance: 'getAppInstance'
    }),

    call: {
      get() { return this.value },
      set(call) {
        this.$emit('input', call)
      }
    },

    receiverName() {
      return this.value?.receiverName || 'Deivid Celso Barbosa'
    },

    receiverDisputeId() {
      return this.value?.disputeId || 390300
    },

    receiverDisputeStatus() {
      return this.value?.disputeStatus || 'PENDING'
    },

    receiverNumber() {
      return this.value?.phoneNumber
    },

    scheduledTo() {
      return this.value?.scheduledDate
    }
  },

  methods: {
    ...mapActions([
      'updatePhoneCallStatus',
      'unschedulePhoneCallStatus',
      'getPhoneCallInfo',
      'addCall'
    ]),

    makeCall() {
      if (this.value?.disputeMessageId) {
        if (!this.loading) this.toggleLoading()

        this.getPhoneCallInfo(this.value?.disputeMessageId).then(call => {
          const newCall = new ScheduledCallModel({
            ...call,
            phoneNumber: this.value?.phoneNumber,
            appInstance: this.appInstance,
            scheduling: this.value
          })

          this.addCall(newCall)
          // .then(() => this.updatePhoneCallStatus(this.value?.disputeMessageId))
        }).finally(this.toggleLoading)
      }
    },

    toggleLoading() {
      this.loading = !this.loading
    },

    unscheduleCall() {
      if (!this.loading) this.toggleLoading()

      this.unschedulePhoneCallStatus(this.value.disputeMessageId).finally(this.toggleLoading)
    }
  }
}
</script>

<style lang="scss" scoped>
.call {
  width: 96%;
  border: none;
  box-shadow: 0px 0px 8px #00000029 !important;
  // -webkit-box-shadow: 0px 0px 15px 5px rgba(0,0,0,0.3);
  // box-shadow: 0px 0px 15px 5px rgba(0,0,0,0.3);
  border-radius: 6px;
  padding: 4px;
  margin: 8px auto;

  .call-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    gap: 8px;

    .call-container__info {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 4px;

      div {
        display: flex;
        height: 100%;
        align-items: center;
      }

      .call-container__info-top {
        justify-content: space-between;
        gap: 8px;
      }

      .call-container__info-bottom {
        justify-content: space-between;
        gap: 8px;
        .call-container__actions {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          gap: 8px;

          .el-button {
            margin: 0;
          }
        }
      }
    }

  }
}
</style>

<style lang="scss">
.call-container__actions {
  .el-button {
    padding: 8px !important;
  }
}
</style>
