<template>
  <el-dialog
    :visible.sync="isFormVisible"
    :title="`Contratos de ${form.customerName}`"
    :close-on-click-modal="false"
    class="contracts-modal"
  >
    <el-form
      v-if="form"
      ref="contractForm"
      :model="newContract"
      :rules="formRules"
    >
      <el-collapse>
        <el-collapse-item
          v-for="(contract, contractCount) in form.contracts"
          :key="contractCount"
          :name="contractCount"
          :title="makeContractName(contract)"
        >
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item
                label="Status"
              >
                <el-select
                  v-if="!!form.contracts.length"
                  v-model="contract.status"
                  placeholder="Ex.: ATIVO"
                >
                  <el-option
                    label="ATIVO"
                    value="ACTIVE"
                  />

                  <el-option
                    label="TRIAL"
                    value="TRIAL"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="Início da vigência"
              >
                <el-date-picker
                  v-model="contract.startedDate"
                  placeholder="Início da vigência"
                  type="date"
                  value-format="yyyy-MM-dd"
                />
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item
                label="Vencimento"
              >
                <el-select
                  v-model="contract.invoiceDueDays"
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
              <el-form-item
                label="Fechamento"
              >
                <el-select
                  v-model="contract.invoiceClosingDay"
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
                label="Plano"
              >
                <el-select
                  v-model="contract.planId"
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
                  class="el-input__inner"
                />
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col
              v-for="(tariffValue, tariffKey, tariffCount) in tariffTypes"
              :key="tariffCount"
              :span="12"
            >
              <el-form-item
                v-if="contract.tariffs"
                :label="tariffValue.label"
              >
                <money
                  v-model="contract.tariffs[tariffKey]"
                  class="el-input__inner"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

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
                  placeholder="Ex.: ATIVO"
                >
                  <el-option
                    label="ATIVO"
                    value="ACTIVE"
                  />

                  <el-option
                    label="TRIAL"
                    value="TRIAL"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                prop="startedDate"
                label="Início da vigência"
              >
                <el-date-picker
                  v-model="newContract.startedDate"
                  placeholder="Início da vigência"
                  type="date"
                  value-format="yyyy-MM-dd"
                />
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
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
              v-for="(tariffValue, tariffKey, tariffCount) in tariffTypes"
              :key="tariffCount"
              :span="12"
            >
              <el-form-item :label="tariffValue.label">
                <money
                  v-model="newContract.tariffs[tariffKey]"
                  class="el-input__inner"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="closeModal">Cancelar</el-button>
      <el-button
        type="primary"
        @click.native.prevent="validateForm"
      >
        Salvar
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { TARIFF_TYPES } from '@/constants/billing'
import { mapActions } from 'vuex'

export default {
  name: 'ContractsModal',
  props: {
    clientData: {
      type: Object,
      required: true,
    },
    plans: {
      type: Array,
      default: () => [],
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: this.clientData,
      isFormVisible: false,
      formRules: {
        invoiceClosingDay: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        invoiceDueDays: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        monthlySubscriptionFee: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        planId: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        startedDate: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        status: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      },
      tariffTypes: TARIFF_TYPES,
      newContract: {
        tariffs: {
          IMPORTED_DISPUTE: TARIFF_TYPES.IMPORTED_DISPUTE.defaultValue,
          INTERACTION: TARIFF_TYPES.INTERACTION.defaultValue,
          DISPUTE_ACCEPTED: TARIFF_TYPES.DISPUTE_ACCEPTED.defaultValue,
          SETTLED_DISPUTE: TARIFF_TYPES.SETTLED_DISPUTE.defaultValue,
        },
      },
    }
  },
  watch: {
    visible(current) {
      this.isFormVisible = true
    },
  },
  methods: {
    ...mapActions([
      'addContract',
      'updateContract',
    ]),
    makeContractName(contract) {
      return `Contrato #${contract.id} - ${contract.startedDate}`
    },
    validateForm() {
      const formRef = this.$refs.contractForm
      formRef.clearValidate()
      formRef.validate(isValid => isValid ? this.addNewContract() : false)

      this.saveContract()
    },
    addNewContract() {
      const {
        clientData: { customerId },
        newContract,
      } = this

      this.addContract({
        customerId,
        contract: newContract,
      }).then(() => this.$jusNotification({
        type: 'success',
        title: 'Yay!',
        message: 'Contrato adicionado com sucesso.',
      }),
      )
    },
    saveContract() {
      const {
        clientData: { customerId },
        form,
      } = this

      const formPromises = []

      form.contracts.map(contract => {
        formPromises.push(this.updateContract({
          customerId,
          contract,
        }))
      })

      Promise.all(formPromises).then(() => this.$jusNotification({
        type: 'success',
        title: 'Yay!',
        message: 'Contratos editados com sucesso.',
      }))

      this.closeModal()
    },
    closeModal() {
      this.isFormVisible = false
    },
  },
}
</script>

<style lang="scss">
.contracts-modal {
  .el-dialog {
    max-height: 100%;
    overflow: auto;
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
</style>
