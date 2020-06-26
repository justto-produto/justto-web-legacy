<template>
  <el-dialog
    :visible.sync="visible"
    :title="`Contratos de ${form.customerName}`"
    class="contracts-modal"
  >
    <el-form
      v-if="form"
      :model="form"
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
                prop="status"
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
                prop="startedDate"
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
                prop="invoiceDueDays"
                label="Vencimento"
              >
                <el-select
                  v-model="contract.invoiceDueDays"
                  placeholder="Dia do mês"
                >
                  <el-option
                    v-for="(day, dayCount) in 31"
                    :key="dayCount"
                    :label="day"
                    :value="day"
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
                  v-model="contract.invoiceClosingDay"
                  placeholder="Dia do mês"
                >
                  <el-option
                    v-for="(day, dayCount) in 31"
                    :key="dayCount"
                    :label="day"
                    :value="day"
                  />
                </el-select>
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item
                prop="plan"
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
                prop="monthlySubscriptionFee"
                label="Mensalidade"
              >
                <el-input
                  v-model="contract.monthlySubscriptionFee"
                  placeholder="Valor da mensalidade"
                />
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col
              v-for="(tariffLabel, tariffKey, tariffCount) in tariffTypes"
              :key="tariffCount"
              :span="12"
            >
              <el-form-item
                v-if="contract.tariffs"
                :label="tariffLabel"
              >
                <el-input
                  v-model="contract.tariffs[tariffKey]"
                  placeholder="Valor em reais"
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
                    v-for="(day, dayCount) in 31"
                    :key="dayCount"
                    :label="day"
                    :value="day"
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
                    v-for="(day, dayCount) in 31"
                    :key="dayCount"
                    :label="day"
                    :value="day"
                  />
                </el-select>
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item
                prop="plan"
                label="Plano"
              >
                <el-select
                  v-model="newContract.planId"
                  placeholder="Plano"
                >
                  <el-option
                    :value="5"
                    label="teste"
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
                <el-input
                  v-model="newContract.monthlySubscriptionFee"
                  placeholder="Valor da mensalidade"
                />
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col
              v-for="(tariffLabel, tariffKey, tariffCount) in tariffTypes"
              :key="tariffCount"
              :span="12"
            >
              <el-form-item :label="tariffLabel">
                <el-input
                  v-model="newContract.tariffs[tariffKey]"
                  placeholder="Valor em reais"
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
        @click.native="saveContract"
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
      isFormVisible: this.visible,
      formRules: {
        status: '',
        startedDate: [{ required: true, message: 'Please input Activity name', trigger: 'blur' }],
        invoiceDueDays: 0,
        invoiceClosingDay: 0,
        plan: null,
        monthlySubscriptionFee: 0,
      },
      tariffTypes: TARIFF_TYPES,
      newContract: {
        tariffs: { },
      },
    }
  },
  methods: {
    ...mapActions([
      'addContract',
      'updateContract',
    ]),
    makeContractName(contract) {
      return `Contrato #${contract.id} - ${contract.startedDate}`
    },
    saveContract() {
      const {
        clientData: { customerId },
        form,
        newContract,
      } = this

      form.contracts.map(contract => this.updateContract({
        customerId,
        contract,
      }))

      if (newContract.status) {
        this.addContract({
          customerId,
          contract: newContract,
        })
      }

      this.closeModal()

      this.$jusNotification({
        type: 'success',
        title: 'Yay!',
        message: 'Contratos editados com sucesso.',
      })
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
