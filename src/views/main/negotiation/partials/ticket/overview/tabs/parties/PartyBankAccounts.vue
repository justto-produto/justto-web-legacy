<template>
  <article class="bank-accounts">
    <el-checkbox-group
      v-if="isVisible"
      v-model="model"
      class="bank-accounts__container"
    >
      <el-checkbox
        v-for="account in value"
        :key="`account-${account.id}-party-${account.personId}`"
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
    isVisible: false,
    model: []
  }),
  computed: {
    seeDataText() {
      return (!this.isVisible ? 'Ver dados bancários' : 'Esconder dados bancários')
    },
    canShowQuantity() {
      return this.value.length > 0
    },
    quantity() {
      return (this.isVisible ? '-' : '+') + this.value.length
    }
  },
  methods: {
    toggleVisibility() {
      this.isVisible = !this.isVisible
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
