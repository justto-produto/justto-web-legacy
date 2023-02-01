<template>
  <span
    v-if="isPix"
    class="bank-accounts__container-inner"
    @click="handleClick"
  >
    <div class="bank-accounts__account-info-title">
      <JusIcon
        icon="chain"
        is-active
      />
      {{ $t(`bank-account.type.${account.type}`) }}
    </div>

    <div class="bank-accounts__account-info">
      Chave: {{ pixKey }}
    </div>

    <slot />
  </span>

  <span
    v-else
    class="bank-accounts__container-inner"
    @click="handleClick"
  >
    <div class="bank-accounts__account-info-title">
      <JusIcon
        icon="chain"
        is-active
      />
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
    <slot />
  </span>
</template>

<script>
import { PIX } from '@/constants/bankAccountTypes'

export default {
  name: 'BankAccountInfo',

  props: {
    account: {
      type: Object,
      required: true
    }
  },

  computed: {
    isPix() {
      return this.account?.type === PIX
    },

    pixKey() {
      const { document, email, number } = this.account

      return document || email || number
    }
  },

  methods: {
    handleClick() {
      this.$emit('click', this.account)
    }
  }

}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.bank-accounts__container-inner {
  padding-left: 6px;

  .bank-accounts__account-info {
    line-height: normal;
    font-size: 13px;
    color: $--color-text-secondary;
  }
}
</style>
