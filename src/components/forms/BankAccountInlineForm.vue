<template>
  <article
    v-loadong="loading"
    class="bank-account-form"
  >
    <el-form
      v-if="account.type !== constants.PIX"
      ref="addBankForm"
      :model="account"
      :rules="addBankRules"
      label-position="top"
      @submit.native.prevent
    >
      <el-form-item
        label="Tipo de Conta"
        prop="type"
      >
        <el-select
          v-model="account.type"
          :disabled="denySavingDeposit"
          class="select-full-width"
        >
          <el-option
            v-for="type in accountTypes"
            :key="type.type"
            :label="type.label"
            :value="type.type"
          />
        </el-select>

        <span
          v-if="denySavingDeposit"
          class="form-item-alert"
        >
          Disputa só aceita cadastro de conta corrente.
        </span>
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

      <el-form-item>
        <el-checkbox v-model="toAssociate">
          Associar nesta disputa
        </el-checkbox>
      </el-form-item>
    </el-form>

    <el-form
      v-else-if="account.type === constants.PIX"
      ref="addBankForm"
      :model="account"
      :rules="addPixRules"
      label-position="top"
      @submit.native.prevent
    >
      <el-form-item
        label="Tipo de Conta"
        prop="type"
      >
        <el-select
          v-model="account.type"
          :disabled="denySavingDeposit"
          class="select-full-width"
        >
          <el-option
            v-for="type in accountTypes"
            :key="type.type"
            :label="type.label"
            :value="type.type"
          />
        </el-select>

        <span
          v-if="denySavingDeposit"
          class="form-item-alert"
        >
          Disputa só aceita cadastro de conta corrente.
        </span>
      </el-form-item>

      <el-form-item
        prop="document"
        :class="{ 'prevent-errors': pixKeySelected !== constants.DOCUMENT }"
      >
        <el-radio
          slot="label"
          v-model="pixKeySelected"
          :label="constants.DOCUMENT"
        >
          CPF/CNPJ
        </el-radio>

        <el-input
          v-if="pixKeySelected === constants.DOCUMENT"
          v-model="account.document"
          v-mask="['###.###.###-##', '##.###.###/####-##']"
        />

        <el-input
          v-else
          disabled
        />
      </el-form-item>

      <el-form-item
        prop="email"
        :class="{ 'prevent-errors': pixKeySelected !== constants.EMAIL }"
      >
        <el-radio
          slot="label"
          v-model="pixKeySelected"
          :label="constants.EMAIL"
        >
          E-mail
        </el-radio>

        <el-input
          v-if="pixKeySelected === constants.EMAIL"
          v-model="account.email"
        />

        <el-input
          v-else
          disabled
        />
      </el-form-item>

      <el-form-item
        prop="number"
        :required="pixKeySelected === constants.PHONE"
        :class="{ 'prevent-errors': pixKeySelected !== constants.PHONE }"
      >
        <el-radio
          slot="label"
          v-model="pixKeySelected"
          :label="constants.PHONE"
        >
          Telefone
        </el-radio>

        <el-input
          v-if="pixKeySelected === constants.PHONE"
          v-model="account.number"
          v-mask="['(##) ####-####', '(##) #####-####']"
          masked
        />

        <el-input
          v-else
          disabled
        />
      </el-form-item>

      <el-form-item
        prop="number"
        :required="pixKeySelected === constants.RANDOM"
        :class="{ 'prevent-errors': pixKeySelected !== constants.RANDOM }"
      >
        <el-radio
          slot="label"
          v-model="pixKeySelected"
          :label="constants.RANDOM"
        >
          Chave aleatória
        </el-radio>

        <el-input
          v-if="pixKeySelected === constants.RANDOM"
          v-model="account.number"
          v-mask="'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'"
          masked
        />

        <el-input
          v-else
          disabled
        />
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="toAssociate">
          Associar nesta disputa
        </el-checkbox>
      </el-form-item>
    </el-form>

    <span class="bank-account-form__container-footer">
      <el-button @click="hideForm()">
        Fechar
      </el-button>

      <el-button
        type="primary"
        :disabled="loading"
        @click="emitEvent(toAssociate)"
      >
        Cadastrar
      </el-button>
    </span>

    <el-divider />
  </article>
</template>

<script>
import { validateDocument, validatePhone, validatePixKeyRandom } from '@/utils/validations'
import { mapActions, mapGetters } from 'vuex'
import { CHECKING, SAVING, PIX } from '@/constants/bankAccountTypes'
import { DOCUMENT, EMAIL, PHONE, RANDOM } from '@/constants/pixKeyTypes'

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
      type: CHECKING
    },
    loading: false,
    toAssociate: true,
    pixKeySelected: '',
    addBankRules: {
      name: [{ required: false, message: 'Campo obrigatório', trigger }],
      email: [{ type: 'email', required: false, message: 'Insira um e-mail válido', trigger }],
      document: [
        { required: false, message: 'Campo obrigatório', trigger },
        { validator: validateDocument, message: 'CPF/CNPJ inválido.', trigger }
      ],
      number: [{ required: true, message: 'Campo obrigatório', trigger }],
      agency: [{ required: true, message: 'Campo obrigatório', trigger }],
      bank: [{ required: true, message: 'Campo obrigatório', trigger }],
      type: [{ required: true, message: 'Campo obrigatório', trigger }]
    },
    constants: {
      // Tipos de conta
      CHECKING,
      SAVING,
      PIX,

      // Tipos de chave pix
      DOCUMENT,
      EMAIL,
      PHONE,
      RANDOM
    }
  }),

  computed: {
    ...mapGetters({
      banks: 'banksList',
      ticketInfo: 'getTicketOverviewInfo',
      usePix: 'usePixAccountType'
    }),

    action() {
      return Object.keys(this.account).includes('id') ? 'edit' : 'create'
    },

    denySavingDeposit() {
      return Boolean(this.ticketInfo?.denySavingDeposit)
    },

    accountTypes() {
      return [
        { label: 'Corrente', type: CHECKING },
        ...(!this.ticketInfo?.denySavingDeposit ? [{ label: 'Poupança', type: SAVING }] : []),
        ...(!this.ticketInfo?.denySavingDeposit && this.usePix && !this.ticketInfo?.denyPixDeposit ? [{ label: 'Pix', type: PIX }] : [])
      ]
    },

    pixTypes() {
      return [
        { label: 'CPF/CNPJ', type: DOCUMENT },
        { label: 'Telefone', type: PHONE },
        { label: 'Email', type: EMAIL },
        { label: 'Chave aleatória', type: RANDOM }
      ]
    },

    addPixRules() {
      return {
        name: [{ required: false, message: 'Obrigatório', trigger }],
        agency: [{ required: false, message: 'Obrigatório', trigger }],
        bank: [{ required: false, message: 'Obrigatório', trigger }],
        type: [{ required: true, message: 'Obrigatório', trigger }],
        // Campos que representam chaves Pix
        email: [{ type: 'email', required: this.pixKeySelected === EMAIL, message: 'Insira um e-mail válido', trigger }],
        document: [
          { required: this.pixKeySelected === DOCUMENT, message: 'Obrigatório', trigger },
          { validator: validateDocument, message: 'CPF/CNPJ inválido.', trigger }
        ],
        number: this.pixKeySelected === RANDOM ? this.randonKeyPixRule : (this.pixKeySelected === PHONE ? this.phonePixRule : this.refaultPixRule)
      }
    },

    phonePixRule() {
      return [
        { required: true, message: 'Telefone é obrigatório', trigger },
        { validator: validatePhone, message: 'Telefone inválido.', trigger }
      ]
    },

    randonKeyPixRule() {
      return [
        { required: true, message: 'Chave-aleatória é obrigatória', trigger },
        { validator: validatePixKeyRandom, message: 'Chave-aleatória inválida.', trigger }
      ]
    },

    refaultPixRule() {
      return []
    }
  },

  watch: {
    pixKeySelected(key) {
      if ([RANDOM, PHONE].includes(key)) {
        this.$delete(this.account, 'number')
      }

      if (this.$refs.addBankForm) {
        this.$refs.addBankForm.clearValidate()
      }
    }
  },

  methods: {
    ...mapActions(['getTicketOverviewInfo']),

    async showForm(account) {
      this.$delete(this.account, 'bank')
      this.$delete(this.account, 'agency')
      this.$delete(this.account, 'number')

      if (!Object.keys(this.ticketInfo).length) {
        await this.getTicketOverviewInfo(this.$route.params.id)
      }

      this.$nextTick().then(() => {
        Object.keys(account).forEach(key => this.$set(this.account, key, account[key]))
        this.account.document = this.$options.filters.cpfCnpj(account.document)

        if (account?.type === PIX && (this.usePix && !this.ticketInfo?.denyPixDeposit)) {
          const isRandom = account?.number > 15
          const pixKey = isRandom ? RANDOM : account?.number ? PHONE : account?.email ? EMAIL : DOCUMENT

          this.$set(this, 'pixKeySelected', pixKey)

          this.$nextTick().then(() => this.$set(this.account, 'number', account?.number || ''))
        } else {
          this.$set(this.account, 'type', 'CHECKING')
          this.$set(this, 'pixKeySelected', '')
        }
      })

      if (account.document) {
        const { cpfCnpj } = this.$options.filters
        this.$set(this.account, 'document', cpfCnpj(account.document))
        this.$forceUpdate()
      }
    },

    hideForm() {
      this.$emit('close')
    },

    emitEvent(associate) {
      this.$refs.addBankForm.validate((isValid, error) => {
        if (isValid) {
          const account = { ...this.account }

          if (account.type === PIX) {
            if (this.pixKeySelected !== DOCUMENT) {
              this.$delete(account, 'document')
            }

            if (this.pixKeySelected !== EMAIL) {
              this.$delete(account, 'email')
            }

            if (![PHONE, RANDOM].includes(this.pixKeySelected)) {
              this.$delete(account, 'number')
            }
          }

          this.$emit(this.action, { account, associate })

          this.$refs.addBankForm.clearValidate()
          this.$refs.addBankForm.resetFields()
        } else {
          const erros = Object.values(error).reduce((acc, cur) => ([...acc, ...cur]), [])

          erros.forEach(({ message }, index) => this.$jusNotification({
            title: 'Ops!',
            message,
            type: 'error',
            offset: index * 96
          }))
        }
      })
    },

    handleValidateNumberField(rule, value, callback) {
      if (this.pixKeySelected === RANDOM) {
        validatePixKeyRandom({ ...rule, message: 'Chave-aleatória inválida' }, value, callback)
      } else {
        validatePhone(rule, value, callback)
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/variables.scss';

.bank-account-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .el-form {
    display: flex;
    flex-direction: column;

    gap: 8px;

    .el-form-item {
      margin: 0 !important;

      .el-form-item__label {
        font-size: 12px !important;
        line-height: 12px !important;
      }

      .el-form-item__content {
        line-height: 14px;

        .el-select {
          .el-input {
            width: 100%;
          }
        }

        .form-item-alert {
          font-size: 10px;
          font-style: oblique;
        }
      }

      &.prevent-errors {
        .el-form-item__label::before {
          visibility: hidden;
        }

        .el-form-item__content {
          .el-form-item__error {
            display: none;
          }
        }
      }
    }
  }

  .bank-account-form__container-footer{
    text-align: right;
  }

  .el-divider {
    margin: 0;
  }
}
</style>
