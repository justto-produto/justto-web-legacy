<template>
  <span>
    <el-dialog
      :visible.sync="visible"
      width="75%"
      modal-append-to-body
      append-to-body
      custom-class="new-contract-dialog"
    >
      <span slot="title">
        <h2>Criar contrato de <span class="upper">{{ customer.customerName }}</span> em <span class="upper">{{ contractDate | moment('L') }}</span></h2>
        <h3>com mensalidade de {{ customer.monthlySubscriptionFee | currency }}</h3>
      </span>

      <el-form
        ref="form"
        v-loading="saving"
        :model="form"
        :rules="formRules"
        class="new-contract__form"
      >
        <el-row :gutter="16">
          <el-col :span="24">
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
        </el-row>

        <el-row :gutter="16">
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

        <el-row :gutter="16">
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

        <el-row :gutter="16">
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
              label="Exclusivo"
              class="flex-item"
            >
              <div class="el-input">
                <el-checkbox
                  :value="workspaceId === form.workspaceId"
                  label="Exclusivo desta workspace"
                  border
                  class="el-input__inner"
                  @change="handleExclusive"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer">
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
      </span>
    </el-dialog>

    <el-button
      v-show="!visible"
      type="secondary"
      icon="el-icon-plus"
      @click="handleOpenDialog"
    >
      Criar novo contrato
    </el-button>
  </span>
</template>

<script>
import { TARIFF_TYPES } from '@/constants/billing'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'NewContractDialog',

  props: {
    plans: {
      type: Array,
      default: () => []
    },

    customer: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    visible: false,
    saving: false,
    form: {
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
      grossValueTax: null,
      tariffs: [],
      statusActive: false
    },
    tariffTypes: TARIFF_TYPES,
    discountsOfNewContract: [],
    formRules: {
      invoiceClosingDay: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      invoiceDueDays: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      planId: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      startedDate: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      status: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    }
  }),

  computed: {
    ...mapGetters(['workspaceId']),

    contractStatus: self => self.$t('billing.contract.status'),

    haveExclusiveContract() {
      return false
    },

    contractDate() {
      return this.form?.updateAt?.dateTime || this.form?.createAt?.dateTime || new Date().toISOString()
    }
  },

  methods: {
    ...mapActions(['addContract']),

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
        grossValueTax: null,
        tariffs: [],
        statusActive: false
      }
    },

    handleOpenDialog() {
      this.restoreForm()

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

      this.addContract({ customerId, contract }).then(_ => {
        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: 'Contrato adicionado com sucesso.'
        })

        this.handleCancel()
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.saving = false
      })
      // const {
      //   form: { customerId },
      //   newContract
      // } = this

      // this.addContract({
      //   customerId,
      //   contract: newContract
      // }).then((res) => {
      //   Promise.all(
      //     this.discountsOfNewContract.map((discount) => this.addDiscount({ contractId: res.id, discount }))
      //   ).then((res) => {
      //     this.$jusNotification({
      //       type: 'success',
      //       title: 'Yay!',
      //       message: 'Contrato adicionado com sucesso.'
      //     })
      //   })
      // }).catch(error => {
      //   this.$jusNotification({ error })
      // }).finally(() => {
      //   this.saving = false
      // })

      //
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.new-contract-dialog {
  .el-dialog__header {
    span {
      h2, h3 {
        font-weight: 700;
        color: $--color-black;
      }

      h2 {
        margin-bottom: 0;
      }

      h3 {
        margin-top: 0;
      }

      .upper {
        text-transform: uppercase;
      }
    }
  }

  .el-dialog__body {
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
            }
          }

          .el-form-item {
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
          }
        }
      }
    }
  }
}
</style>
