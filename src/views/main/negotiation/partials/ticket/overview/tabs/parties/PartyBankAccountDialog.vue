<template>
  <el-dialog
    title="Conta bancária"
    :visible.sync="bankAccountDialogVisible"
    append-to-body
  >
    <span class="bank-account__container">
      <el-form
        ref="addBankForm"
        :model="account"
        :rules="addBankRules"
        label-position="top"
        @submit.native.prevent
      >
        <el-form-item
          label="Nome"
          prop="name"
        >
          <el-input v-model="account.name" />
        </el-form-item>
        <el-form-item
          label="Email"
          prop="email"
        >
          <el-input v-model="account.email" />
        </el-form-item>
        <el-form-item
          label="CPF ou CNPJ"
          prop="document"
        >
          <el-input
            ref="accountDocumentInput"
            v-model="account.document"
            v-mask="['###.###.###-##', '##.###.###/####-##']"
          />
        </el-form-item>
        <el-form-item
          label="Banco"
          prop="bank"
        >
          <el-select
            v-model="account.bank"
            class="select-full-width"
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
          <el-input v-model="account.agency" />
        </el-form-item>
        <el-form-item
          label="Número do Conta"
          prop="number"
        >
          <el-input v-model="account.number" />
        </el-form-item>
        <el-form-item
          label="Tipo de Conta"
          prop="type"
        >
          <el-select
            v-model="account.type"
            class="select-full-width"
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
    </span>

    <span slot="footer">
      <el-button
        plain
        @click="closeDialog()"
      >
        Cancelar
      </el-button>
      <el-button
        type="primary"
        @click="emitEvent()"
      >
        Salvar
      </el-button>
    </span>
  </el-dialog>
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
    accountTypes: [
      { label: 'Poupança', type: 'SAVING' },
      { label: 'Corrente', type: 'CHECKING' }
    ],
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
    }
  },

  methods: {
    openBankAccountDialog(account) {
      console.log(account)
      Object.keys(account).forEach(key => this.$set(this.account, key, account[key]))
      this.bankAccountDialogVisible = true
      if (account.document) {
        const { cpfCnpj } = this.$options.filters
        this.$set(this.account, 'document', cpfCnpj(account.document))
      }
    },

    closeDialog() {
      Object.keys(this.account).forEach(key => this.$set(this.account, key, ''))
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

<style lang="scss" scoped>
  .select-full-width {
    display: block;
  }
</style>
