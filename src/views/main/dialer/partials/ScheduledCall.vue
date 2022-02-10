<template>
  <li
    v-loading="loading"
    class="call"
  >
    <div class="call-container">
      <div class="call-container__info">
        <div class="call-container__info-top">
          <div>
            Para {{ receiverName | resumedName }}
          </div>
          <el-tag size="mini">
            {{ scheduledTo | moment('[hoje às ] HH:mm') }}
          </el-tag>
        </div>
        <div class="call-container__info-bottom">
          <el-tag size="mini">
            {{ receiverNumber | phoneNumber }}
          </el-tag>
        </div>
      </div>

      <div class="call-container__actions">
        <el-button
          type="primary"
          icon="el-icon-phone"
          size="mini"
          round
          @click="makeCall"
        >
          Ligar
        </el-button>

        <el-button
          type="danger"
          icon="el-icon-delete-solid"
          size="mini"
          round
          @click="unscheduleCall"
        >
          Remover
        </el-button>
      </div>
    </div>
  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
      return this.value?.receiverName || ''
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
          const newCall = {
            disputeId: call.dispute.id,
            disputeStatus: call.dispute.status,
            toRoleId: call.contact.roleId,
            toRoleName: call.contact.name,
            number: this.value?.phoneNumber,
            appInstance: this.appInstance,
            contacts: {
              emails: call.contact.phones,
              phones: call.contact.emails
            }
          }

          this.addCall(newCall).then(() => this.updatePhoneCallStatus(this.value?.disputeMessageId))
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
  width: 100%;
  border: none;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 6px;
  padding: 8px;

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
        justify-content: center;
      }
    }

    .call-container__actions {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 8px;

      .el-button {
        margin: 0;
      }
    }
  }
}
</style>

<style lang="scss">
.call-container__actions {
  .el-button {
    padding: 8px !important;

    span {
      display: none;
    }

    &:hover span {
      display: inline;
    }
  }
}
</style>