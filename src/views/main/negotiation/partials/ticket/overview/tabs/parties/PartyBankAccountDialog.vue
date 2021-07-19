<template>
  <el-popover
    v-model="bankAccountDialogVisible"
    popper-class="bank-account__popover"
    title="Adicionar conta bancária"
    trigger="manual"
    :placement="placement"
  >
    <span class="bank-account__container">
      <span class="bank-account__container-person">
        para:
        {{ account.name | firstName }}
      </span>
      <el-form
        ref="addBankForm"
        :model="account"
        :rules="addBankRules"
        label-position="top"
        @submit.native.prevent
      >
        <el-form-item
          label="Banco"
          prop="bank"
        >
          <el-select
            v-model="account.bank"
            class="select-full-width"
            size="mini"
            filterable
          >
            <el-option
              v-for="bank in banks"
              :key="bank.code"
              :label="bank.code + ' - ' + bank.name"
              :value="bank.code + ' - ' + bank.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Agência"
          prop="agency"
        >
          <el-input
            v-model="account.agency"
            size="mini"
          />
        </el-form-item>
        <el-form-item
          label="Número do Conta"
          prop="number"
        >
          <el-input
            v-model="account.number"
            size="mini"
          />
        </el-form-item>

        <el-form-item
          label="Tipo de Conta"
          prop="type"
        >
          <el-select
            v-model="account.type"
            :disabled="accountTypes.length <= 1"
            class="select-full-width"
            size="mini"
          >
            <el-option
              v-for="type in accountTypes"
              :key="type.type"
              :label="type.label"
              :value="type.type"
            />
          </el-select>
          <span
            v-if="accountTypes.length <= 1"
            class="form-item-alert"
          >
            Disputa só aceita cadastro de conta corrente.
          </span>
        </el-form-item>

        <el-form-item>
          <el-checkbox
            v-model="toAssociate"
            size="mini"
          >
            Associar nesta disputa
          </el-checkbox>
        </el-form-item>
      </el-form>

      <span class="bank-account__container-footer">
        <el-button
          size="mini"
          @click="closeDialog()"
        >
          Fechar
        </el-button>

        <el-button
          type="primary"
          size="mini"
          @click="emitEvent(toAssociate)"
        >
          Cadastrar
        </el-button>
      </span>
    </span>

    <span slot="reference">
      <slot />
    </span>
  </el-popover>
</template>

<script>
import { validateDocument } from '@/utils/validations'
import { mapActions, mapGetters } from 'vuex'

const trigger = 'submit'

export default {
  name: 'PartyBankAccountsDialog',

  props: {
    placement: {
      type: String,
      default: () => 'top-start'
    }
  },

  data: () => ({
    account: {
      name: '',
      email: '',
      document: '',
      agency: '',
      bank: '',
      number: '',
      type: 'CHECKING'
    },
    toAssociate: true,
    addBankRules: {
      name: [{ required: false, message: 'Campo obrigatório', trigger }],
      email: [{ type: 'email', required: false, message: 'Insira um e-mail válido', trigger }],
      document: [
        { required: true, message: 'Campo obrigatório', trigger },
        { validator: validateDocument, message: 'CPF/CNPJ inválido.', trigger }
      ],
      agency: [{ required: true, message: 'Campo obrigatório', trigger }],
      bank: [{ required: true, message: 'Campo obrigatório', trigger }],
      number: [{ required: true, message: 'Campo obrigatório', trigger }],
      type: [{ required: true, message: 'Campo obrigatório', trigger }]
    },
    bankAccountDialogVisible: false
  }),

  computed: {
    ...mapGetters({
      banks: 'banksList',
      ticketInfo: 'getTicketOverviewInfo'
    }),

    action() {
      return Object.keys(this.account).includes('id') ? 'edit' : 'create'
    },

    accountTypes() {
      return !this.ticketInfo?.denySavingDeposit ? [
        { label: 'Corrente', type: 'CHECKING' },
        { label: 'Poupança', type: 'SAVING' }
      ] : [
        { label: 'Corrente', type: 'CHECKING' }
      ]
    }
  },

  watch: {
    bankAccountDialogVisible(visible) {
      if (visible) {
        this.$delete(this.account, 'bank')
        this.$delete(this.account, 'agency')
        this.$delete(this.account, 'number')
      }
    }
  },

  methods: {
    ...mapActions(['getTicketOverviewInfo']),

    async openBankAccountDialog(account) {
      if (!Object.keys(this.ticketInfo).length) {
        await this.getTicketOverviewInfo(this.$route.params.id)
      }

      this.bankAccountDialogVisible = true

      this.$nextTick().then(() => {
        Object.keys(account).forEach(key => this.$set(this.account, key, account[key]))

        this.$set(this.account, 'type', 'CHECKING')
      })

      if (account.document) {
        const { cpfCnpj } = this.$options.filters
        this.$set(this.account, 'document', cpfCnpj(account.document))
        this.$forceUpdate()
      }
    },

    closeDialog() {
      this.bankAccountDialogVisible = false
    },

    emitEvent(associate) {
      this.$refs.addBankForm.validate(isValid => {
        if (isValid) {
          this.$emit(this.action, { account: this.account, associate })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/variables.scss';

.bank-account__popover {
  border-width: 2px;
  border: solid $--color-light-gray thin;
  box-shadow: $--box-shadow-dark;
  border-radius: 8px;

  .bank-account__container {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .el-form {
      display: flex;
      flex-direction: column;

      gap: 8px;

      .el-form-item {
        margin: 0;

        .el-form-item__label {
          font-size: 12px !important;
          line-height: 12px !important;
        }

        .el-form-item__content {
          line-height: 14px;

          .el-select {
            .el-input {
              width: 102%;
            }
          }

          .form-item-alert {
            font-size: 10px;
            font-style: oblique;
          }
        }
      }
    }

    .bank-account__container-footer {
      display: flex;
      justify-content: space-between;
    }
  }

  .popper__arrow {
    border-top: $--color-light-gray solid 2px !important;
  }
}

</style>

<style lang="scss" scoped>
  .select-full-width {
    display: block;
  }
</style>
