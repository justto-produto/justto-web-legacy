<template>
  <el-dialog
    v-loading="isLoading"
    title="Tips"
    :visible.sync="dialogVisible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="engagement-limit-dialog"
    width="auto"
    center
    append-to-body
    destroy-on-close
  >
    <div class="engagement-limit-content">
      <div
        v-for="contact of summarizedPartyContacts"
        :key="`party#${contact.id}`"
      >
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate(contact.id)"
          @change="handleCheckAllChange"
        >
          <i class="el-icon-user-solid" />
          <span>{{ contact.name }}</span>
        </el-checkbox>
        <ul>
          <li
            v-for="phone of (contact.phones || [])"
            :key="`phone#${phone.id}`"
          >
            {{ phone.number | phoneNumber }}
          </li>
        </ul>
      </div>
    </div>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <!-- <el-button @click="dialogVisible = false">Cancel</el-button> -->
      <el-button
        type="primary"
        @click="dialogVisible = false"
      >
        Ligar
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    disputeId: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    isLoading: false,
    toCall: []
  }),

  computed: {
    ...mapGetters({
      engagementLimit: 'getEngagementLimit',
      dispute: 'dispute'
    }),

    dialogVisible: {
      get() {
        return this.engagementLimit
      },

      set(value) {
        this.setEngageLimit({ value: String(value) })
      }
    },

    summarizedPartyContacts() {
      return (this.dispute.disputeRoles || []).filter(({ party }) => party === 'CLAIMANT').map(({ id, name, phones }) => {
        return { id, name, phones }
      })
    },

    isIndeterminate() {
      return (contactId) => {
        return this.summarizedPartyContacts.filter(({ id, phones }) => {
          return contactId === id && phones.filter(({ number }) => this.toCall.includes(number)).length > 0
        }).length > 0
      }
    }
  },

  watch: {
    engagementLimit: {
      handler: 'fetchData',
      deep: true
    }
  },

  methods: {
    ...mapActions({ getDispute: 'getDispute' }),

    ...mapMutations({ setEngageLimit: 'handleEngageLimit' }),

    fetchData(visible) {
      if (visible) {
        this.isLoading = true

        this.getDispute(this.disputeId).finally(() => {
          this.isLoading = false
        })
      }
    }
  }
}
</script>
