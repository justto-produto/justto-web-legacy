<template>
  <el-dialog
    :visible.sync="isFormVisible"
    :title="`Contratos de ${form.customerName}`"
    :close-on-click-modal="false"
    class="contracts-modal"
    width="75%"
  >
    <article class="contracts-cards-container">
      <div
        v-for="contract in filteredContracts"
        :key="`contract#${contract.id}`"
        class="contract-card__container"
      >
        <div class="contract-card__title">
          <h4>Contrato de {{ form.customerName }} {{ ((contract.updateAt && contract.updateAt.dateTime) || (contract.createAt && contract.createAt.dateTime)) | moment('L') }} &#60;{{ !contract.workspaceId ? 'COMPARTILHADO' : 'EXCLUSIVO' }}&#62;</h4>
          <h4>com mensalidade de {{ form.monthlySubscriptionFee | currency }}</h4>
        </div>

        <div class="contract-card__data">
          <el-descriptions
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
              >
                Editar
              </el-button>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <NewContractDialog
        v-if="isFormVisible"
        :plans="plans"
        :customer="form"
      />
    </article>
  </el-dialog>
</template>

<script>
import { CONTRACT_STATUS, TARIFF_TYPES } from '@/constants/billing'
import { mapActions, mapGetters } from 'vuex'
import { ContractModel } from '@/models/billing/Contract.model'
import { TariffModel } from '@/models/billing/Tariff.model'

export default {
  name: 'ContractsCardsModal',

  components: {
    NewContractDialog: () => import('./partials/NewContractDialog')
  },

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
      discountForm: {},
      discountsOfNewContract: [],
      form: {},
      isFormVisible: false,
      formRules: {
        invoiceClosingDay: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        invoiceDueDays: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        planId: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        startedDate: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        status: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      },
      tariffTypes: TARIFF_TYPES,
      newContract: {},
      allFilteredContracts: {},
      hasWorkspace: false,
      saving: false,
      creatingNewContract: false
    }
  },

  computed: {
    ...mapGetters({
      clientData: 'getCurrentCustomer',
      workspaceId: 'currentWorkspace',
      contractDiscountList: 'contractDiscountList'
    }),

    contractStatus: self => self.$t('billing.contract.status'),

    filteredContracts() {
      const filteredContracts = this.form.contracts
        .filter(contract => contract.status === CONTRACT_STATUS.ACTIVE.key || contract.status === CONTRACT_STATUS.INACTIVE.key)

      // filteredContracts
      const allFilteredContracts = (filteredContracts.length ? filteredContracts : this.form.contracts).map(contract => ({
        ...contract,
        flags: this.getFlags(contract),
        customTitle: this.makeContractName(contract)
      }))
      this.changeAllFilteredContracts(allFilteredContracts)
      return allFilteredContracts
    },

    haveExclusiveContract() {
      const { newContract } = this

      const conditional = this.filteredContracts.some(c => c.workspaceId !== null)

      this.changeHasWorkspaceValue(conditional)

      newContract.workspaceId = conditional ? this.workspaceId : null

      return conditional
    },

    haveContracts() {
      return this.filteredContracts.length > 0
    },

    planNameById() {
      return id => (this.plans.find(p => p.id === id).name || 'Não encontrado')
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
      'updateContract',
      'getContractDiscountList',
      'addContractDiscount',
      'changeContractDiscount',
      'deleteContractDiscount'
    ]),
    changeHasWorkspaceValue(newValue) {
      this.hasWorkspace = newValue
    },
    changeAllFilteredContracts(newValue) {
      this.allFilteredContracts = newValue
    },
    resetNewContract(here) {
      const tariffs = []
      Object.keys(TARIFF_TYPES).map(key => tariffs.push(new TariffModel({ type: key })))
      this.newContract = new ContractModel({ tariffs })
    },
    handleCurrentContract(index) {
      const currentContract = this.allFilteredContracts[index] || {}
      const hasDiscounts = currentContract.hasDiscounts
      if (hasDiscounts) {
        this.getContractDiscountList(currentContract.id)
      }
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
      this.saving = true
      const {
        form: { customerId },
        newContract
      } = this

      this.addContract({
        customerId,
        contract: newContract
      }).then((res) => {
        Promise.all(
          this.discountsOfNewContract.map((discount) => this.addDiscount({ contractId: res.id, discount }))
        ).then((res) => {
          this.$jusNotification({
            type: 'success',
            title: 'Yay!',
            message: 'Contrato adicionado com sucesso.'
          })
        })
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.saving = false
      })

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
    saveSingleContract(contract, _index) {
      this.saving = true
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
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.saving = false
      })
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
    },

    addDiscount(data) {
      this.discountForm = {}
      this.addContractDiscount(data)
        .then((res) => {
          this.$jusNotification({
            type: 'success',
            title: 'Yay!',
            message: 'Desconto criado com sucesso.'
          })
        })
    },

    changeDiscount(data) {
      this.changeContractDiscount(data)
        .then((res) => {
          this.$jusNotification({
            type: 'success',
            title: 'Yay!',
            message: 'Desconto alterado com sucesso.'
          })
        })
    },

    deleteDiscount(data) {
      this.deleteContractDiscount(data)
        .then((res) => {
          this.$jusNotification({
            type: 'success',
            title: 'Yay!',
            message: 'Desconto deletado com sucesso.'
          })
        })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.contracts-modal {
  div[role="dialog"] {
    .el-dialog__body {
      .contracts-cards-container {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        justify-content: flex-start;
        align-items: stretch;

        .contract-card__container {
          border: solid lightgray 2px;
          border-radius: 8px;
          padding: 8px;
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 16px;

          .contract-card__title {
            h4 {
              margin: 0;
              font-weight: 600;
            }

            h4 + h4 {
              font-weight: normal;
              text-indent: 0.5rem;
            }
          }

          .contract-card__data {
            .el-descriptions {
              .el-descriptions__header { margin: 0; }

              .el-descriptions__body {
                padding-left: 0.5rem;

                .el-descriptions__table {
                  tbody {
                    .el-descriptions-row {
                      .el-descriptions-item {
                        padding: 0;

                        .el-descriptions-item__container {
                          .el-descriptions-item__label {
                            margin: 0;

                            &::after {
                              content: '\00a0';
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        span:has(.el-button) {
          display: flex;
        }
      }
    }
  }
}
// .contracts-modal {
//   .el-dialog {
//     max-height: 100%;
//     overflow: auto;
//   }

//   .contract-modal__flag {
//     margin-left: 8px;
//   }

//   .el-row {
//     display: flex;
//     flex-wrap: wrap;
//     justify-content: space-between;

//     &::before,
//     &::after {
//       display: none;
//     }

//     &:last-child {
//       margin-bottom: 0;
//     }

//     .el-col {
//       .el-form-item__content {
//         & > * {
//           width: 100%;
//         }
//       }
//     }
//   }
// }

// .is-inactive {
//   background-color: #f6f6f6;
//   border-color: #e4e7ed;
//   color: #424242;

//   cursor: not-allowed;
//   &:hover {
//     border-color: #e4e7ed;
//   }
// }

// .transition-none {
//   transition: none !important;
// }

// .custom_input_number {
//   -moz-appearance: textfield;
//   appearance: textfield;
// }
// .custom_input_number::-webkit-outer-spin-button,
// .custom_input_number::-webkit-inner-spin-button {
//   -webkit-appearance: none;
//   margin: 0;
// }

// .flex-row {
//   display: flex;
//   width: 100%;
//   align-items: flex-end;
//   margin-bottom: 40px;

//   .el-form-item {
//     display: flex;
//     flex-direction: column;
//     margin-bottom: 0 !important;

//     .el-form-item__label {
//       line-height: 1em;
//       margin-bottom: 12px;
//       word-break: break-word;
//       text-align: left;
//     }

//     .el-form-item__content {
//       line-height: 1em;

//       .el-button {
//         width: 100%;
//       }
//     }
//   }

//   &:last-child {
//     margin-bottom: 0;
//   }
// }

</style>
