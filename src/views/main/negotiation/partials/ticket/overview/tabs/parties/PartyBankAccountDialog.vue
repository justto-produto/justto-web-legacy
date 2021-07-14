<template>
  <el-popover
    v-model="bankAccountDialogVisible"
    popper-class="bank-account__popover"
    placement="top-start"
    title="Adicionar conta bancária"
    trigger="manual"
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
        <!-- <el-form-item
          label="Nome"
          prop="name"
        >
          <el-input
            v-model="account.name"
            size="mini"
            disabled
          />
        </el-form-item> -->

        <!-- <el-form-item
          label="Email"
          prop="email"
        >
          <el-input
            v-model="account.email"
            disabled
          />
        </el-form-item> -->

        <!-- <el-form-item
          label="CPF ou CNPJ"
          prop="document"
        >
          <el-input
            ref="accountDocumentInput"
            v-model="account.document"
            v-mask="['###.###.###-##', '##.###.###/####-##']"
            size="mini"
            disabled
          />
        </el-form-item> -->

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
        </el-form-item>
      </el-form>

      <span class="bank-account__container-footer">
        <el-button
          size="mini"
          @click="closeDialog()"
        >
          Cancelar
        </el-button>

        <el-dropdown>
          <el-button
            type="primary"
            size="mini"
          >
            Cadastrar
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>

          <!-- TODO: Falta salvar, ou salvar e vincular. -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>Cadastrar</el-dropdown-item>
            <el-dropdown-item>Cadastrar e associar</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </span>

    <span slot="reference">
      <slot />
    </span>
  </el-popover>
</template>

<script>
import { validateDocument } from '@/utils/validations'
import { mapGetters } from 'vuex'

const trigger = 'submit'

export default {
  name: 'PartyBankAccountsDialog',

  data: () => ({
    account: {
      name: '',
      email: '',
      document: '',
      agency: '',
      bank: '',
      number: '',
      type: ''
    },

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
      banks: 'banksList'
    }),

    action() {
      return Object.keys(this.account).includes('id') ? 'edit' : 'create'
    },

    accountTypes() {
      return [
        { label: 'Poupança', type: 'SAVING' },
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
        this.$delete(this.account, 'type')
      }
    }
  },

  methods: {
    openBankAccountDialog(account) {
      this.bankAccountDialogVisible = true
      Object.keys(account).forEach(key => this.$set(this.account, key, account[key]))
      if (account.document) {
        const { cpfCnpj } = this.$options.filters
        this.$set(this.account, 'document', cpfCnpj(account.document))
        this.$forceUpdate()
      }
    },

    closeDialog() {
      this.bankAccountDialogVisible = false
    },

    emitEvent() {
      this.$refs.addBankForm.validate(isValid => {
        if (isValid) {
          this.$emit(this.action, this.account)
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
  border: $--color-primary-light-7 solid 1px;
  /* box-shadow: 0 2px 8px 0 $--color-primary-light-5; */
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
        }
      }
    }

    .bank-account__container-footer {
      display: flex;
      justify-content: space-between;
    }
  }

  .popper__arrow {
    border-top: $--color-primary-light-7 solid 2px !important;
  }
}

</style>

<style lang="scss" scoped>
  .select-full-width {
    display: block;
  }
</style>
