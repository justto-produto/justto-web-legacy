<template>
  <article class="bank-accounts">
    <div
      v-if="isAllAccountsVisible"
      class="bank-accounts__container"
    >
      <div
        v-for="account in accounts"
        :key="account.id"
        :class="{
          'is-checked': selectedAccounts.includes(account.id),
          'is-not-checked': !selectedAccounts.includes(account.id),
          'is-not-checkable': ticketInfo.denySavingDeposit === true && account.type === 'SAVING'
        }"
        class="bank-accounts__container-account"
      >
        <BankAccountInfo
          :account="account"
          @click="handleClick"
        >
          <span class="bank-accounts__account-icons">
            <i
              v-if="!disabled"
              class="bank-accounts__account-icon el-icon-delete"
              @click.stop="removeBankAccount(account)"
            />
          </span>
        </BankAccountInfo>
      </div>
    </div>

    <PartyBankAccountDialog
      ref="partyBankAccountDialog"
      @create="handleNewBankAccount"
      @edit="editBankAccount"
    >
      <a
        v-if="(isAllAccountsVisible || !accountsLength) && !disabled"
        class="bank-accounts__link"
        @click="openBankAccountDialog()"
      >
        Adicionar
      </a>
    </PartyBankAccountDialog>

    <a
      v-if="accountsLength"
      class="bank-accounts__link"
      @click="toggleAccountsVisible"
    >
      {{ expandLinkText }}
    </a>

    <SavingsAccountAlert
      ref="savingAccountAlert"
      @save="addBankAccount"
      @close="closeBankAccountDialog()"
    />
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { isSameBankAccount } from '@/utils'

export default {
  name: 'PartyBankAccounts',

  components: {
    BankAccountInfo: () => import('./partial/BankAccountInfo'),
    PartyBankAccountDialog: () => import('./PartyBankAccountDialog'),
    SavingsAccountAlert: () => import('@/components/dialogs/SavingsAccountAlert.vue')
  },

  props: {
    accounts: {
      type: Array,
      required: true
    },
    personId: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    canOpen: {
      type: Boolean,
      default: true
    },
    accountMockup: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    isAllAccountsVisible: true
  }),

  computed: {
    ...mapGetters({
      ticketInfo: 'getTicketOverviewInfo'
    }),

    disputeId() {
      return Number(this.$route.params.id)
    },

    accountsLength() {
      return this.accounts.length
    },

    expandLinkText() {
      const { isAllAccountsVisible, accountsLength } = this
      return !isAllAccountsVisible ? `Ver dados bancários (+${accountsLength})` : `Esconder dados bancários (-${accountsLength})`
    },

    selectedAccounts() {
      return this.accounts.filter(({ associatedInDispute }) => associatedInDispute).map(({ id }) => id)
    }
  },

  methods: {
    ...mapActions({
      linkAccount: 'setTicketRoleBankAccount',
      unlinkAccount: 'unlinkTicketRoleBankAccount',
      createBankAccount: 'createTicketRoleBankAccount',
      deleteBankAccount: 'deleteTicketRoleBankAccount',
      updateBankAccount: 'updateTicketRoleBankAccount'
    }),

    handleClick(account) {
      const { id, personId, type } = account

      if (type === 'SAVING' && this.ticketInfo.denySavingDeposit) {
        this.$refs.savingAccountAlert.open()
      } else {
        if (this.selectedAccounts.includes(id)) {
          this.updateBankAccounts([], [{ id, personId }])
        } else {
          this.updateBankAccounts([{ id, personId }], [])
        }
      }
    },

    removeBankAccount(account) {
      const { disputeId } = this
      const { id: bankAccountId, personId } = account

      this.deleteBankAccount({ disputeId, personId, bankAccountId }).then(_ => {
        this.$jusNotification({
          title: 'Yay!',
          dangerouslyUseHTMLString: true,
          message: 'Conta bancária <strong>excluída</strong> com sucesso.',
          type: 'success'
        })
      }).catch(err => {
        this.$jusNotification(err)
      })
    },

    handleNewBankAccount(model) {
      this.addBankAccount(model)
    },

    addBankAccount({ account, associate }) {
      const { disputeId, personId } = this

      this.createBankAccount({ disputeId, account, personId }).then(response => {
        if (associate) {
          const baccount = response.bankAccounts.find(bAccount => {
            return isSameBankAccount(bAccount, account)
          })

          this.linkAccount({ bankAccountId: baccount.id, personId, disputeId })
        }

        this.$jusNotification({
          title: 'Yay!',
          dangerouslyUseHTMLString: true,
          message: 'Conta bancária <strong>criada</strong> com sucesso.',
          type: 'success'
        })
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(_ => {
        this.closeBankAccountDialog()
      })
    },

    editBankAccount({ account, associate }) {
      const { disputeId, personId } = this

      this.updateBankAccount({ disputeId, account, personId }).then(response => {
        if (associate) {
          const baccount = response.bankAccounts.find(bAccount => {
            return isSameBankAccount(bAccount, account)
          })

          this.linkAccount({ bankAccountId: baccount.id, personId, disputeId })
        }

        this.$jusNotification({
          title: 'Yay!',
          dangerouslyUseHTMLString: true,
          message: 'Conta bancária <strong>editada</strong> com sucesso.',
          type: 'success'
        })
      }).catch(err => {
        this.$jusNotification(err)
      }).finally(_ => {
        this.closeBankAccountDialog()
      })
    },

    toggleAccountsVisible() {
      this.isAllAccountsVisible = !this.isAllAccountsVisible
    },

    updateBankAccounts(link = [], unlink = []) {
      const { disputeId } = this

      Promise.all([
        ...link.map(({ id, personId }) => this.linkAccount({ bankAccountId: id, personId, disputeId })),
        ...unlink.map(({ id, personId }) => this.unlinkAccount({ bankAccountId: id, personId, disputeId }))
      ]).then(() => {
        const text = link.length > 0 ? 'Conta bancária <strong>vinculada</strong> com sucesso.' : 'Conta bancária <strong>desvinculada</strong> com sucesso.'

        this.$jusNotification({
          title: 'Yay!',
          dangerouslyUseHTMLString: true,
          message: text,
          type: 'success'
        })
      })
    },

    openBankAccountDialog() {
      if (this.canOpen) {
        this.$refs.partyBankAccountDialog.openBankAccountDialog(this.accountMockup)
      } else {
        this.$emit('validateOpen', this.isAllAccountsVisible)
      }
    },

    closeBankAccountDialog() {
      this.$refs.partyBankAccountDialog.closeDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.bank-accounts {
  display: flex;
  flex-direction: column;
  gap: 6px;

  .bank-accounts__container {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .bank-accounts__container-account {
      margin: 0;
      display: flex;
      padding: 6px 3px 6px 18px;
      border-radius: 4px;
      transition: .2s ease-out all;
      cursor: pointer;
      position: relative;

      .bank-accounts__container-inner {
        padding-left: 6px;
      }

      .bank-accounts__account-info {
        line-height: normal;
        font-size: 13px;
        color: $--color-text-secondary;
      }

      .bank-accounts__account-icons {
        position: absolute;
        opacity: 0;
        right: 0;
        top: 0;
        margin: 6px 6px 0 0;
        padding-left: 30px;
        transition: .2s ease-out all;

        .bank-accounts__account-icon {
          cursor: pointer;
          margin-left: 3px;
          transition: .2s ease-out all;

          &:hover {
            color: $--color-primary;

            &.el-icon-delete {
              color: $--color-danger;
            }
          }
        }
      }

      &:not(.is-checked) .bank-accounts__container-inner .bank-accounts__account-info-title img {
        display: none;
      }

      &:not(.is-not-checkable):hover {
        background-color: $--color-light-gray;
        .bank-accounts__container-inner { opacity: .85; }
        .bank-accounts__account-icons { opacity: 1; }
      }

      &.is-checked {
        background-color: $--color-light-gray;

        .bank-accounts__container-inner {
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;

          .bank-accounts__account-info-title {
            font-weight: 600;
          }
        }
      }

      &.is-not-checked {
        .bank-accounts__container-inner {
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
        }
      }

      &.is-not-checkable {
        cursor: not-allowed;

        .bank-accounts__container-inner {
          .bank-accounts__account-info-title {
            color: $--color-text-secondary;
          }
        }
      }
    }
  }

  .bank-accounts__link {
    margin-left: 18px
  }
}
</style>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

.bank-accounts {
  .bank-accounts__container {
    .bank-accounts__container-account {
      .el-checkbox__input {
        .el-checkbox__inner {
          width: 1px;
          height: calc(100% - 2px);
          margin-top: 2px;
          border: none;
          border-radius: 0;
          opacity: .6;
          background-color: $--color-text-secondary;
          &:after {
            display: none;
          }
        }

        &.is-checked .el-checkbox__inner {
          background-color: $--color-primary !important;
          opacity: 1;
        }
      }
    }
  }
}
</style>
