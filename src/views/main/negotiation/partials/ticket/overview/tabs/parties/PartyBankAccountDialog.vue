<template>
  <el-popover
    v-model="bankAccountDialogVisible"
    popper-class="bank-account__popover"
    title="Adicionar conta bancária"
    trigger="manual"
    :placement="placement"
  >
    <span
      v-if="bankAccountDialogVisible"
      class="bank-account__container"
    >
      <span class="bank-account__container-person">
        para:
        {{ (account.name || '') | firstName }}
      </span>

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

        <el-form-item>
          <el-checkbox
            v-model="toAssociate"
            size="mini"
          >
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
            v-if="denySavingDeposit"
            class="form-item-alert"
          >
            Disputa só aceita cadastro de conta corrente.
          </span>
        </el-form-item>

        <el-form-item
          label="Tipo de Chave Pix"
          prop="pixKeySelected"
        >
          <el-select
            v-model="pixKeySelected"
            class="select-full-width"
            size="mini"
          >
            <el-option
              v-for="type in pixTypes"
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
          v-if="pixKeySelected === constants.DOCUMENT"
          label="CPF/CNPJ"
          prop="document"
        >
          <el-input
            v-model="account.document"
            v-mask="['###.###.###-##', '##.###.###/####-##']"
            size="mini"
          />
        </el-form-item>

        <el-form-item
          v-else-if="pixKeySelected === constants.EMAIL"
          label="E-mail"
          prop="email"
        >
          <el-input
            v-model="account.email"
            size="mini"
          />
        </el-form-item>

        <el-form-item
          v-if="pixKeySelected === constants.PHONE"
          label="Telefone"
          prop="number"
        >
          <el-input
            v-model="account.number"
            v-mask="['(##) ####-####', '(##) #####-####']"
            size="mini"
            type="tel"
          />
        </el-form-item>

        <el-form-item
          v-if="pixKeySelected === constants.RANDOM"
          label="Chave aleatória"
          prop="number"
        >
          <div class="el-input el-input--mini">
            <input
              v-model="account.number"
              v-mask="'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'"
              class="el-input__inner"
              size="mini"
              type="tel"
            >
          </div>
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
import { validateDocument, validatePhone, validatePixKeyRandom } from '@/utils/validations'
import { mapActions, mapGetters } from 'vuex'
import { CHECKING, SAVING, PIX } from '@/constants/bankAccountTypes'
import { DOCUMENT, EMAIL, PHONE, RANDOM } from '@/constants/pixKeyTypes'

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
      type: CHECKING
    },
    toAssociate: true,
    pixKeySelected: 'DOCUMENT',
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
    bankAccountDialogVisible: false,
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
      ticketInfo: 'getTicketOverviewInfo'
    }),

    action() {
      return Object.keys(this.account).includes('id') ? 'edit' : 'create'
    },

    denySavingDeposit() {
      return Boolean(this.ticketInfo?.denySavingDeposit)
    },

    accountTypes() {
      return !this.ticketInfo?.denySavingDeposit ? [
        { label: 'Corrente', type: CHECKING },
        { label: 'Poupança', type: SAVING },
        { label: 'Pix', type: PIX }
      ] : [
        { label: 'Corrente', type: CHECKING }
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
        name: [{ required: false, message: 'Campo obrigatório', trigger }],
        agency: [{ required: false, message: 'Campo obrigatório', trigger }],
        bank: [{ required: false, message: 'Campo obrigatório', trigger }],
        type: [{ required: true, message: 'Campo obrigatório', trigger }],
        // Campos que representam chaves Pix
        email: [{ type: 'email', required: this.pixKeySelected === EMAIL, message: 'Insira um e-mail válido', trigger }],
        document: [
          { required: this.pixKeySelected === DOCUMENT, message: 'Campo obrigatório', trigger },
          { validator: validateDocument, message: 'CPF/CNPJ inválido.', trigger }
        ],
        number: [
          { required: [RANDOM, PHONE].includes(this.pixKeySelected), message: 'Campo obrigatório', trigger },
          { validator: this.pixKeySelected === RANDOM ? validatePixKeyRandom : validatePhone, message: 'Campo inválido.', trigger }
        ]
      }
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
