<template>
  <el-form
    v-if="visible"
    ref="form"
    v-loading="saving"
    :model="form"
    :rules="formRules"
    size="mini"
    class="new-contract__form"
  >
    <el-row :gutter="8">
      <el-col :span="12">
        <el-form-item
          prop="planId"
          label="Plano"
        >
          <el-select
            v-model="form.planId"
            placeholder="Plano"
          >
            <el-option
              v-for="(plan, index) in plans"
              :key="index"
              :value="plan.id"
              :label="plan.name"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          prop="tariffType"
          label="Tipo do Contrato"
        >
          <el-select
            v-model="form.tariffType"
            placeholder="Selecione..."
          >
            <el-option
              value="FRANCHISE"
              label="Franquia"
            />

            <el-option
              value="VOLUMETRY"
              label="Volumetria"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row
      :gutter="8"
      type="flex"
      align="bottom"
    >
      <el-col :span="12">
        <el-form-item
          prop="status"
          label="Status"
        >
          <el-select
            v-model="form.status"
            placeholder="Ex.: Ativo"
          >
            <el-option
              v-for="(status, key, index) in contractStatus"
              :key="index"
              :label="status"
              :value="key"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          prop="invoiceDueDays"
          label="Dias para vencimento da fatura"
          class="flex-item"
        >
          <el-input-number
            v-model="form.invoiceDueDays"
            :min="0"
            :max="90"
            :step="1"
            step-strictly
            controls-position="right"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :span="12">
        <el-form-item
          prop="startedDate"
          label="Início da vigência"
        >
          <el-date-picker
            v-model="form.startedDate"
            placeholder="Início da vigência"
            type="date"
            format="dd/MM/yyyy"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          label="Data do churn"
        >
          <el-date-picker
            v-model="form.inactivatedDate"
            placeholder="Data do churn"
            type="date"
            format="dd/MM/yyyy"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row
      :gutter="8"
      type="flex"
      align="bottom"
    >
      <el-col :span="12">
        <el-form-item
          prop="invoiceClosingDay"
          label="Dia de fechamento"
          class="flex-item"
        >
          <el-input-number
            v-model="form.invoiceClosingDay"
            :min="0"
            :max="31"
            step-strictly
            controls-position="right"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          prop="workspaceId"
          label="Exclusivo desta workspace"
          class="flex-item"
        >
          <div class="el-input el-input--mini">
            <el-checkbox
              :value="haveExclusiveContract"
              :disabled="disableExclusiveOption"
              label="Exclusivo"
              border
              size="mini"
              class="el-input__inner checkbox--mini"
              @change="handleExclusive"
            />
          </div>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row
      v-if="form.planId === 6"
      :gutter="8"
    >
      <el-col :span="12">
        <el-form-item
          label="Percentual de repasse"
          class="flex-item"
        >
          <el-input-number
            v-model="form.onlendingFee"
            :min="0"
            :max="100"
            step-strictly
            controls-position="right"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          label="Taxas sobre valor bruto"
          class="flex-item"
        >
          <el-input-number
            v-model="form.grossValueTax"
            :min="0"
            :max="100"
            :precision="3"
            :step="0.1"
            controls-position="right"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-form-item
          prop="note"
          label="Nota"
        >
          <div class="el-textarea">
            <textarea
              v-model="form.note"
              class="el-textarea__inner"
              rows="4"
            />
          </div>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :span="24">
        <el-form-item class="flex-end">
          <el-button @click="handleCancel">
            Cancelar
          </el-button>

          <el-button
            type="primary"
            :disabled="saving"
            @click="handleSave"
          >
            <i
              v-show="saving"
              class="el-icon-loading"
            />
            Salvar
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <el-descriptions
    v-else-if="contract.id"
    title="Dados do contrato"
    :column="1"
  >
    <el-descriptions-item label="Contrato">
      {{ $tc(`billing.contract.status.${contract.status}`) }}
    </el-descriptions-item>

    <el-descriptions-item label="Fechamento">
      {{ `no ${contract.invoiceClosingDay ? contract.invoiceClosingDay+'º' : 'último' } dia do més` }}
    </el-descriptions-item>

    <el-descriptions-item label="Plano">
      {{ planNameById(contract.planId) }}
    </el-descriptions-item>

    <el-descriptions-item label="Faturamento">
      {{ `${contract.invoiceDueDays} dias após fechamento` }}
    </el-descriptions-item>

    <el-descriptions-item label="Iniciado em">
      {{ contract.createAt.dateTime | moment('L') }}
    </el-descriptions-item>

    <el-descriptions-item>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-edit"
        @click="handleOpenDialog"
      >
        Editar
      </el-button>
    </el-descriptions-item>
  </el-descriptions>

  <el-descriptions
    v-else
    title="Novo contrato"
    :column="1"
  >
    <el-descriptions-item>
      <el-button
        type="secondary"
        icon="el-icon-plus"
        @click="handleOpenDialog"
      >
        Editar novo contrato
      </el-button>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'EditContractForm',

  props: {
    plans: {
      type: Array,
      default: () => []
    },

    customer: {
      type: Object,
      required: true
    },

    contract: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    visible: false,
    saving: false,
    form: {},
    formRules: {
      invoiceClosingDay: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      invoiceDueDays: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      planId: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      startedDate: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      status: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      tariffType: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    }
  }),

  computed: {
    ...mapGetters(['workspaceId']),

    contractStatus: self => self.$t('billing.contract.status'),

    haveExclusiveContract() {
      return this.workspaceId === this.form.workspaceId
    },

    disableExclusiveOption() {
      return this.contract?.id && this.contract?.workspaceId === this.workspaceId
    },

    contractDate() {
      return this.form?.updateAt?.dateTime || this.form?.createAt?.dateTime || new Date().toISOString()
    },

    planNameById() {
      return id => (this.plans.find(p => p.id === id)?.name || 'Não encontrado')
    }
  },

  methods: {
    ...mapActions(['addContract', 'updateContract', 'getContracts']),

    restoreForm() {
      this.form = {
        planId: null,
        status: '',
        invoiceDueDays: 0,
        startedDate: '',
        inactivatedDate: '',
        invoiceClosingDay: 0,
        workspaceId: null,
        archived: false,
        invoiceDay: 0,
        onlendingFee: 0,
        hasDiscounts: false,
        customerId: null,
        grossValueTax: 0,
        tariffs: [],
        statusActive: false,
        tariffType: '',
        note: ''
      }
    },

    populateForm() {
      this.form = {
        tariffType: '',
        ...this.contract
      }
    },

    handleOpenDialog() {
      this.contract?.id ? this.populateForm() : this.restoreForm()

      this.visible = true
      this.saving = false
    },

    handleExclusive(exclusive) {
      if (exclusive) {
        this.form.workspaceId = this.workspaceId
      } else {
        this.form.workspaceId = null
      }
    },

    handleCancel() {
      this.restoreForm()

      this.visible = false
      this.saving = false
    },

    handleInvalidForm() {
      this.$jusNotification({
        type: 'error',
        message: 'Preencha todos os campos obrigatórios!'
      })
    },

    handleSave() {
      const formRef = this.$refs.form

      formRef.clearValidate()
      formRef.validate(isValid => isValid ? this.addNewContract() : this.handleInvalidForm())
    },

    addNewContract() {
      this.saving = true

      const customerId = this.customer.customerId
      const contract = this.form
      const toEdit = Boolean(contract?.id)
      const method = toEdit ? this.updateContract : this.addContract

      method({ customerId, contract }).then(async _ => {
        await this.getContracts()

        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: `Contrato ${toEdit ? 'editado' : 'criado'}  com sucesso.`
        })

        this.handleCancel()
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.saving = false
        this.$emit('reload')
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.new-contract__form {
  .el-row {
    .el-col {
      .flex-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .el-form-item__content {
          width: 100%;

          div { width: 100%; }

          .checkbox--mini {
            border-radius: 0.6rem;
          }
        }
      }

      .el-form-item {
        .el-form-item__label {
          line-height: 1.5rem;
          text-align: start;
        }

        .el-form-item__content {
          .el-select, .el-date-editor {
            overflow-y: hidden !important;

            .el-input {
              overflow-y: hidden !important;
            }
          }

          .el-form-item__error {
            top: unset !important;
            bottom: 0 !important;
            right: unset !important;
            left: 0 !important;
          }
        }

        &.is-required {
          .el-form-item__label {
            &::before {
              display: none;
            }

            &::after {
              content: "*";
              color: $--pj-color-red;
              margin-left: 4px;
            }
          }
        }

        &.flex-end {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>
