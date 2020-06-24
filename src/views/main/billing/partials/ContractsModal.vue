<template>
  <el-dialog
    :visible.sync="isFormVisible"
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
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="status"
              >
                <el-select
                  v-if="!!form.contracts.length"
                  v-model="contract.status"
                  placeholder="Status"
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

            <el-col :span="11">
              <el-form-item
                prop="startedDate"
              >
                <el-date-picker
                  v-model="contract.startedDate"
                  type="date"
                  placeholder="Início da vigência"
                />
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="invoiceDueDays"
              >
                <el-select
                  v-model="contract.invoiceDueDays"
                  placeholder="Vencimento"
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

            <el-col :span="11">
              <el-form-item
                prop="invoiceClosingDay"
              >
                <el-select
                  v-model="contract.invoiceClosingDay"
                  placeholder="Fechamento"
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

          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="plan"
              >
                <el-select
                  v-model="contract.planId"
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

            <el-col :span="11">
              <el-form-item
                prop="monthlySubscriptionFee"
              >
                <el-input
                  v-model="contract.monthlySubscriptionFee"
                  placeholder="Mensalidade"
                />
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col
              v-for="(tariffLabel, tariffKey, tariffCount) in tariffTypes"
              :key="tariffCount"
              :span="11"
            >
              <el-form-item
                v-if="contract.tariffs"
                :label="tariffLabel"
              >
                <el-input v-model="contract.tariffs[tariffKey]" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <el-collapse-item
          name="newContract"
          title="Novo contrato"
        >
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="status"
              >
                <el-select
                  v-model="newContract.status"
                  placeholder="Status"
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

            <el-col :span="11">
              <el-form-item
                prop="startedDate"
              >
                <el-date-picker
                  v-model="newContract.startedDate"
                  type="date"
                  placeholder="Início da vigência"
                />
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="invoiceDueDays"
              >
                <el-select
                  v-model="newContract.invoiceDueDays"
                  placeholder="Vencimento"
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

            <el-col :span="11">
              <el-form-item
                prop="invoiceClosingDay"
              >
                <el-select
                  v-model="newContract.invoiceClosingDay"
                  placeholder="Fechamento"
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

          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="plan"
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

            <el-col :span="11">
              <el-form-item
                prop="monthlySubscriptionFee"
              >
                <el-input
                  v-model="newContract.monthlySubscriptionFee"
                  placeholder="Mensalidade"
                />
                <el-form-item />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col
              v-for="(tariffLabel, tariffKey, tariffCount) in tariffTypes"
              :key="tariffCount"
              :span="11"
            >
              <el-form-item :label="tariffLabel">
                <el-input v-model="newContract.tariffs[tariffKey]" />
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
      <el-button @click="dialogFormVisible = false">Cancelar</el-button>
      <el-button
        type="primary"
        @click="dialogFormVisible = false"
      >Salvar</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { TARIFF_TYPES } from '@/constants/billing'

export default {
  name: 'ContractsModal',
  props: {
    clientData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: this.clientData,
      isFormVisible: true,
      formRules: {
        status: '',
        startedDate: '',
        invoiceDueDays: 0,
        invoiceClosingDay: 0,
        plan: 0,
        monthlySubscriptionFee: 0,
      },
      tariffTypes: TARIFF_TYPES,
      newContract: {
        tariffs: { },
      },
    }
  },
  methods: {
    makeContractName(contract) {
      return `Contrato #${contract.id} - ${contract.startedDate}`
    },
  },
}
</script>

<style lang="scss">
.contracts-modal {
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
