<template>
  <el-dialog
    :visible.sync="isFormVisible"
    :title="`Contratos de ${form.customerName}`"
    :close-on-click-modal="false"
    class="contracts-modal"
    width="50%"
  >
    <el-form
      v-if="form"
      ref="contractForm"
      :model="newContract"
      :rules="formRules"
    >
      <el-collapse
        ref="mainCollapse"
        accordion
        class="transition-none"
        @item-click="resetNewContract"
      >
        <el-collapse-item
          v-for="(contract, contractCount) in filteredContracts"
          :key="contractCount"
          :name="contractCount"
          class="transition-none"
        >
          <template #title>
            <span>{{ contract.customTitle }}</span>
            <el-tag
              v-for="(flag, i) in contract.flags"
              :key="i"
              :type="flag.theme"
              effect="dark"
              size="mini"
              class="contract-modal__flag transition-none"
            >
              {{ flag.label }}
            </el-tag>
          </template>
          <!-- Campos do formulário -->
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item
                label="Status"
              >
                <el-select
                  v-if="!!form.contracts.length"
                  v-model="contract.status"
                  :disabled="isContractInactive(contract)"
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
                label="Vencimento"
              >
                <el-select
                  v-model="contract.invoiceDueDays"
                  :disabled="isContractInactive(contract)"
                  placeholder="Dia do mês"
                >
                  <el-option
                    v-for="(day, dayCount) in 29"
                    :key="dayCount - 1"
                    :label="day - 1"
                    :value="day - 1"
                  />
                </el-select>
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- Linha 2 -->
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item
                label="Início da vigência"
              >
                <el-date-picker
                  v-model="contract.startedDate"
                  :disabled="isContractInactive(contract)"
                  placeholder="Início da vigência"
                  type="date"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                />
                <el-form-item />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Data do churn"
              >
                <el-date-picker
                  v-model="contract.inactivatedDate"
                  :disabled="isContractInactive(contract)"
                  placeholder="Data do churn"
                  type="date"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                />
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- Linha 3 -->
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item
                label="Fechamento"
              >
                <el-select
                  v-model="contract.invoiceClosingDay"
                  :disabled="isContractInactive(contract)"
                  placeholder="Dia do mês"
                >
                  <el-option
                    v-for="(day, dayCount) in 29"
                    :key="dayCount - 1"
                    :label="day - 1"
                    :value="day - 1"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Percentual de repasse">
                <div class="el-input el-input--suffix">
                  <input
                    v-model="contract.onlendingFee"
                    type="number"
                    class="el-input__inner custom_input_number"
                    :step="0.5"
                  >
                  <span class="el-input__suffix el-input__suffix-inner">%</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- Linha 4 -->
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item
                label="Plano"
              >
                <el-select
                  v-model="contract.planId"
                  :disabled="isContractInactive(contract)"
                  placeholder="Plano"
                >
                  <el-option
                    v-for="(plan, index) in plans"
                    :key="index"
                    :value="plan.id"
                    :label="plan.name"
                  />
                </el-select>
                <el-form-item />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="Mensalidade"
              >
                <money
                  v-model="contract.monthlySubscriptionFee"
                  :disabled="isContractInactive(contract)"
                  :class="{'is-inactive': isContractInactive(contract)}"
                  class="el-input__inner"
                />
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 4 últimos campos de baixo do formulário -->
          <el-row :gutter="24">
            <el-col
              v-for="(tariffValue, tariffKey, tariffCount) in tariffTypes"
              :key="tariffCount"
              :span="12"
            >
              <el-form-item :label="tariffValue.label">
                <money
                  v-model="contract.tariffs[getTariffIndex(contract, tariffKey)].value"
                  :disabled="isContractInactive(contract)"
                  :readonly="isContractInactive(contract)"
                  :class="{'is-inactive': isContractInactive(contract)}"
                  class="el-input__inner"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            :gutter="24"
          >
            <el-col class="text-right">
              <el-button
                type="primary"
                @click.native.prevent="saveSingleContract(contract, contractCount)"
              >
                Salvar
              </el-button>
            </el-col>
          </el-row>
        </el-collapse-item>

        <!-- Novo Contrato -->
        <el-collapse-item
          name="newContract"
          title="Novo contrato"
        >
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item
                prop="status"
                label="Status"
              >
                <el-select
                  v-model="newContract.status"
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
                label="Vencimento"
              >
                <el-select
                  v-model="newContract.invoiceDueDays"
                  placeholder="Dia do mês"
                >
                  <el-option
                    v-for="(day, dayCount) in 29"
                    :key="dayCount - 1"
                    :label="day - 1"
                    :value="day - 1"
                  />
                </el-select>
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item
                prop="startedDate"
                label="Início da vigência"
              >
                <el-date-picker
                  v-model="newContract.startedDate"
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
                  v-model="newContract.inactivatedDate"
                  placeholder="Data do churn"
                  type="date"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                />
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item
                prop="invoiceClosingDay"
                label="Fechamento"
              >
                <el-select
                  v-model="newContract.invoiceClosingDay"
                  placeholder="Dia do mês"
                >
                  <el-option
                    v-for="(day, dayCount) in 29"
                    :key="dayCount - 1"
                    :label="day - 1"
                    :value="day - 1"
                  />
                </el-select>
                <el-form-item />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Percentual de repasse">
                <div class="el-input el-input--suffix">
                  <input
                    v-model="newContract.onlendingFee"
                    type="number"
                    class="el-input__inner custom_input_number"
                    :step="0.5"
                  >
                  <span class="el-input__suffix el-input__suffix-inner">%</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item
                prop="planId"
                label="Plano"
              >
                <el-select
                  v-model="newContract.planId"
                  placeholder="Plano"
                >
                  <el-option
                    v-for="(plan, index) in plans"
                    :key="index"
                    :value="plan.id"
                    :label="plan.name"
                  />
                </el-select>
                <el-form-item />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                prop="monthlySubscriptionFee"
                label="Mensalidade"
              >
                <money
                  v-model="newContract.monthlySubscriptionFee"
                  class="el-input__inner"
                />
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col
              v-for="(tariff, tariffCount) in newContract.tariffs"
              :key="tariffCount"
              :span="12"
            >
              <el-form-item :label="tariffTypes[tariff.type].label">
                <money
                  v-model="tariff.value"
                  class="el-input__inner"
                />
              </el-form-item>
            </el-col>

            <el-col>
              <el-form-item>
                <el-switch
                  v-model="hasWorkspace"
                  :disabled="haveExclusiveContract"
                  active-text="Exclusivo desta workspace"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="text-right">
              <el-button
                type="primary"
                @click.native.prevent="validateForm"
              >
                Salvar
              </el-button>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </el-dialog>
</template>

<script>
import { CONTRACT_STATUS, TARIFF_TYPES } from '@/constants/billing'
import { mapActions, mapGetters } from 'vuex'
import { ContractModel } from '@/models/billing/Contract.model'
import { TariffModel } from '@/models/billing/Tariff.model'

export default {
  name: 'ContractsModal',
  props: {
    plans: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: { },
      isFormVisible: false,
      formRules: {
        invoiceClosingDay: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        invoiceDueDays: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        monthlySubscriptionFee: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        planId: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        startedDate: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        status: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      },
      tariffTypes: TARIFF_TYPES,
      newContract: { },
      hasWorkspace: false
    }
  },
  computed: {
    ...mapGetters({
      clientData: 'getCurrentCustomer',
      workspaceId: 'currentWorkspace'
    }),
    contractStatus: self => self.$t('billing.contract.status'),
    filteredContracts() {
      const filteredContracts = this.form.contracts
        .filter(contract => contract.status === CONTRACT_STATUS.ACTIVE.key || contract.status === CONTRACT_STATUS.INACTIVE.key)

      // filteredContracts
      return (filteredContracts.length ? filteredContracts : this.form.contracts).map(contract => ({
        ...contract,
        flags: this.getFlags(contract),
        customTitle: this.makeContractName(contract)
      }))
    },
    haveExclusiveContract() {
      const { newContract } = this
      const conditional = this.filteredContracts.some(c => c.workspaceIdNull === false)
      this.changeHasWorkspaceValue(conditional)
      conditional
        ? newContract.workspaceId = this.workspaceId
        : newContract.workspaceId = null
      return conditional
    },
    haveContracts() {
      return this.filteredContracts.length > 0
    }
  },
  watch: {
    clientData(current) {
      this.form = current
      this.form.contracts.map(contract => {
        const types = Object.keys(TARIFF_TYPES)

        types.map(type => {
          const tariffAlreadyExists = contract.tariffs.filter(tariff => tariff.type === type).length > 0

          if (!tariffAlreadyExists) {
            contract.tariffs.push({
              type,
              value: 0
            })
          }
        })
      })

      this.openNewContract()
    },
    hasWorkspace(current) {
      const { newContract } = this
      current
        ? newContract.workspaceId = this.workspaceId
        : newContract.workspaceId = null
    },
    visible(current) {
      this.resetNewContract()
      this.isFormVisible = true
    }
  },
  beforeMount() {
    this.form = this.clientData
    this.resetNewContract()
  },
  methods: {
    ...mapActions([
      'addContract',
      'updateContract'
    ]),
    changeHasWorkspaceValue(newValue) {
      this.hasWorkspace = newValue
    },
    resetNewContract() {
      const tariffs = []
      Object.keys(TARIFF_TYPES).map(key => tariffs.push(new TariffModel({ type: key })))
      this.newContract = new ContractModel({ tariffs })
    },
    getTariffIndex(contract, tariffType) {
      let tariffIndex

      contract.tariffs.map((tariff, index) => {
        if (tariff.type === tariffType) return (tariffIndex = index)
      })

      // console.table({ tariffIndex, tariffType })

      return tariffIndex
    },
    makeContractName(contract) {
      return `Contrato #${contract.id} - ${contract.startedDate}`
    },
    validateForm() {
      const formRef = this.$refs.contractForm
      formRef.clearValidate()
      formRef.validate(isValid => isValid ? this.addNewContract() : false)
    },
    addNewContract() {
      const {
        form: { customerId },
        newContract
      } = this

      this.addContract({
        customerId,
        contract: newContract
      }).then(() => this.$jusNotification({
        type: 'success',
        title: 'Yay!',
        message: 'Contrato adicionado com sucesso.'
      })
      )

      this.hideCollapseItems()
    },
    /**
     * Valida se o contrato está com status Inativo
     */
    isContractInactive(contract) {
      return contract.status === 'INACTIVE'
    },
    /**
     * Esconde todos os collapse-item
     */
    hideCollapseItems() {
      this.$refs.mainCollapse.setActiveNames([])
    },
    /**
     * Salva um único contrato
     */
    saveSingleContract(contract, index) {
      const { form } = this
      this.updateContract({
        customerId: form.customerId,
        contract: contract
      }).then(() => {
        this.hideCollapseItems()
        this.$forceUpdate()
        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: 'Contrato salvo com sucesso.'
        })
      })
    },
    /**
     * Salva todos os contratos
     * @deprecated
     */
    saveContract() {
      const {
        form
      } = this

      const formPromises = []

      form.contracts.map(contract => {
        formPromises.push(this.updateContract({
          customerId: form.customerId,
          contract
        }))
      })

      Promise.all(formPromises).then(() => this.$jusNotification({
        type: 'success',
        title: 'Yay!',
        message: 'Contratos editados com sucesso.'
      }))

      this.closeModal()
    },
    closeModal() {
      this.isFormVisible = false
    },
    getFlags(contract) {
      const flags = []
      if (contract.workspaceId === this.workspaceId) {
        flags.push({
          label: 'Exclusivo desta Workspace',
          theme: 'info'
        })
      }

      if (contract.status === CONTRACT_STATUS.INACTIVE.key) {
        flags.push({
          ...CONTRACT_STATUS.INACTIVE,
          theme: 'danger'
        })
      }

      return flags
    },
    openNewContract() {
      if (this.haveContracts) {
        this.newContract.startedDate = new Date()
      }
    }
  }
}
</script>

<style lang="scss">
.contracts-modal {
  .el-dialog {
    max-height: 100%;
    overflow: auto;
  }

  .contract-modal__flag {
    margin-left: 8px;
  }

  .el-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &::before,
    &::after {
      display: none;
    }

    &:last-child {
      margin-bottom: 0;
    }

    .el-col {
      .el-form-item__content {
        & > * {
          width: 100%;
        }
      }
    }
  }
}

.is-inactive {
  background-color: #f6f6f6;
  border-color: #e4e7ed;
  color: #424242;

  cursor: not-allowed;
  &:hover {
    border-color: #e4e7ed;
  }
}

.transition-none {
  transition: none !important;
}

.custom_input_number {
  -moz-appearance: textfield;
  // text-align: right;
}
.custom_input_number::-webkit-outer-spin-button,
.custom_input_number::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

</style>
