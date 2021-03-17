<template>
  <article class="bank-accounts">
    <div class="bank-accounts__container">
      <div
        v-for="account in accounts"
        :key="account.id"
        :class="{
          'is-checked': selectedAccounts.includes(account.id),
          'is-not-checked': !selectedAccounts.includes(account.id)
        }"
        class="bank-accounts__container-account"
      >
        <span
          class="bank-accounts__container-inner"
          @click="handleClick(account)"
        >
          <div class="bank-accounts__account-info-title">
            Conta {{ $t(`bank-account.type.${account.type}`) }}
          </div>
          <div class="bank-accounts__account-info">
            Banco: {{ account.bank }}
          </div>
          <div class="bank-accounts__account-info">
            Agência: {{ account.agency }}
          </div>
          <div class="bank-accounts__account-info">
            Conta: {{ account.number }}
          </div>
          <span class="bank-accounts__account-icons">
            <i
              class="bank-accounts__account-icon el-icon-edit"
              @click.stop="openBankAccountDialog(account)"
            />
            <i
              class="bank-accounts__account-icon el-icon-delete"
              @click.stop="deleteAccount(account)"
            />
          </span>
        </span>
      </div>
    </div>

    <a
      v-if="isAllAccountsVisible || !accountsLength"
      class="bank-accounts__link"
      @click="openBankAccountDialog"
    >
      Adicionar
    </a>
    <a
      v-if="accountsLength"
      class="bank-accounts__link"
      @click="toggleAccountsVisible"
    >
      {{ expandLinkText }}
    </a>

    <PartyBankAccountDialog
      ref="partyBankAccountDialog"
    />
  </article>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'PartyBankAccounts',
  components: {
    PartyBankAccountDialog: () => import('./PartyBankAccountDialog')
  },
  props: {
    accounts: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    isAllAccountsVisible: false
  }),
  computed: {
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
      deleteBankAccount: 'deleteTicketRoleBankAccount'
    }),

    handleClick({ id, personId }) {
      if (this.selectedAccounts.includes(id)) {
        this.updateBankAccounts([], [{ id, personId }])
      } else {
        this.updateBankAccounts([{ id, personId }], [])
      }
    },

    deleteAccount(account) {
      const { disputeId } = this
      const { id: bankAccountId, personId } = account

      this.deleteBankAccount({ disputeId, personId, bankAccountId })
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

    openBankAccountDialog(account) {
      console.log(this.$refs.partyBankAccountDialog)
      this.$refs.partyBankAccountDialog.openBankAccountDialog(account)
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
        background-image: linear-gradient(to left, rgba(255, 255, 255, 145) 45%, rgba(255, 255, 255, 0) );
        position: absolute;
        opacity: 0;
        right: 6px;
        top: 6px;
        padding-left: 30px;
        transition: .2s ease-out all;

        .bank-accounts__account-icon {
          cursor: pointer;
          margin-left: 3px;
          transition: .2s ease-out all;
          &:hover {
            color: $--color-primary;
            &.el-icon-delete { color: $--color-danger; }
          }
        }
      }

      &:hover {
        background-color: $--light-gray;
        .bank-accounts__container-inner { opacity: .85; }
        .bank-accounts__account-icons { opacity: 1; }
      }

      &.is-checked {
        background-color: $--light-gray;

        .bank-accounts__container-inner {
          border-left: solid $--color-primary 2px;
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;

          .el-checkbox__label .bank-accounts__account-info-title {
            font-weight: 500;
          }
        }
      }

      &.is-not-checked {
        .bank-accounts__container-inner {
          border-left: solid $--color-text-secondary 1px;
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
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
@import '@/styles/colors.scss';

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
