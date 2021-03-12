<template>
  <article class="bank-accounts">
    <el-checkbox-group
      v-if="isVisible"
      v-model="accountsSelected"
      class="bank-accounts__container"
    >
      <el-checkbox
        v-for="(account, accountIndex) in value"
        :key="`account-${accountIndex}-party-${account.personId}`"
        :label="account.id"
        class="bank-accounts__container__account"
      >
        <span class="bank-accounts__container__account-type">
          Conta {{ account | accountType }}
        </span>
        <br>
        <span
          class="bank-accounts__container__account-info"
        >
          <div>Banco: {{ account.bank }}</div>
          <div>Agência: {{ account.agency }}</div>
          <div>Conta: {{ account.number }}</div>
        </span>
      </el-checkbox>
    </el-checkbox-group>

    <a
      class="bank-accounts__toggle"
      @click="toggleVisibility"
    >
      <span>
        {{ seeDataText }}
      </span>
      <span v-if="canShowQuantity">
        ({{ quantity }})
      </span>
    </a>
  </article>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'PartyBankAccounts',
  filters: {
    accountType(account) {
      return account.type === 'SAVING' ? 'Poupança' : 'Corrente'
    }
  },
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    isVisible: false
  }),
  computed: {
    disputeId() {
      return Number(this.$route.params.id)
    },
    seeDataText() {
      return (!this.isVisible ? 'Ver dados bancários' : 'Esconder dados bancários')
    },
    canShowQuantity() {
      return this.value.length > 0
    },
    availableIds() {
      return this.value.map(({ id }) => id)
    },
    quantity() {
      return (this.isVisible ? '-' : '+') + this.value.length
    },
    accountsSelected: {
      get() {
        return this.value.filter(({ associatedInDispute }) => associatedInDispute).map(({ id }) => id)
      },

      set(value) {
        const link = this.value.filter(({ id, associatedInDispute: associated }) => (value.includes(id) && !associated)).map(({ id, personId }) => ({ id, personId }))
        const unlink = this.value.filter(({ id, associatedInDispute: associated }) => (!value.includes(id) && associated)).map(({ id, personId }) => ({ id, personId }))

        this.updateBankAccounts(link, unlink)
      }
    }
  },
  methods: {
    ...mapActions({
      linkAccount: 'setTicketRoleBankAccount',
      unlinkAccount: 'deleteTicketRoleBankAccount'
    }),
    toggleVisibility() {
      this.isVisible = !this.isVisible
    },
    updateBankAccounts(link = [], unlink = []) {
      const { disputeId } = this

      Promise.all([
        ...link.map(({ id, personId }) => this.linkAccount({ bankAccountId: id, personId, disputeId })),
        ...unlink.map(({ id, personId }) => this.unlinkAccount({ bankAccountId: id, personId, disputeId }))
      ]).then(() => {
        this.$jusNotification({
          title: 'Yay!',
          dangerouslyUseHTMLString: true,
          message: 'Conta bancária atualizada com sucesso.',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.bank-accounts {
  display: flex;
  flex-direction: column;
  gap: 6px;

  .bank-accounts__container {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .bank-accounts__container__account {
      display: flex;
      align-items: center;

      .bank-accounts__container__account-type {
        font-size: 14px;
      }

      .bank-accounts__container__account-info {
        line-height: normal;
        font-size: 12px;
        color: $--color-text-secondary;
      }
    }
  }

  .bank-accounts__toggle {
    cursor: pointer;
  }
}
</style>
