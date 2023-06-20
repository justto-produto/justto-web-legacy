<template>
  <el-dialog
    :visible.sync="isFormVisible"
    :title="`Contratos de ${form.customerName}`"
    :close-on-click-modal="false"
    class="contracts-modal"
    width="50%"
  >
    <article class="contracts-cards-container">
      <el-collapse
        v-if="filteredContracts.length"
        v-model="contractsVisibleList"
      >
        <el-collapse-item
          v-for="(contract, cIndex) in filteredContracts"
          :key="`contract#${cIndex}`"
          :ref="`contract#${cIndex}`"
          :name="`contract#${cIndex}`"
          class="contract-card__container"
        >
          <div
            slot="title"
            class="contract-card__title"
          >
            <h4>
              <span>
                Contrato de {{ form.customerName }} {{ contract.startedDate | moment('L') }}
              </span>

              <el-tag
                v-if="contract.workspaceId"
                size="mini"
              >
                exclusivo
              </el-tag>
            </h4>

            <h4>
              com mensalidade de {{ cusomersMap[form.customerId].monthlySubscriptionFee | currency }}
            </h4>
          </div>

          <div class="contract-card__data">
            <EditContractForm
              :plans="plans"
              :customer="form"
              :contract="contract"
            />

            <EditTariffsForm
              :contract="contract"
              :customer="form"
            />

            <EditDiscountsForm
              v-if="contract.tariffType === 'VOLUMETRY'"
              :contract="contract"
              :customer="form"
            />

            <div
              v-if="!(contract.id)"
              class="remove-contract__btn"
            >
              <el-tooltip content="Remover contrato não salvo.">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  plain
                  circle
                  @click="handleRemoveUnsavedContract"
                />
              </el-tooltip>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <div class="new-contract__action">
        <el-button
          type="primary"
          :disabled="haveUnsavedContracts"
          @click="handleCreateNewContract"
        >
          Adicionar contrato
        </el-button>
      </div>
    </article>
  </el-dialog>
</template>

<script>
import { CONTRACT_STATUS, TARIFF_TYPES, FRANCHISE_TARIFF_TYPES } from '@/constants/billing'
import { mapGetters } from 'vuex'

export default {
  name: 'ContractsCardsModal',

  components: {
    EditContractForm: () => import('./partials/EditContractForm'),
    EditTariffsForm: () => import('./partials/EditTariffsForm'),
    EditDiscountsForm: () => import('./partials/EditDiscountsForm')
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
      form: {},
      isFormVisible: false,
      tariffTypes: TARIFF_TYPES,
      franchiseTariffTypes: FRANCHISE_TARIFF_TYPES,
      allFilteredContracts: {},
      saving: false,
      contractsVisibleList: []
    }
  },

  computed: {
    ...mapGetters({
      clientData: 'getCurrentCustomer',
      workspaceId: 'currentWorkspace',
      contractDiscountList: 'contractDiscountList',
      cusomersMap: 'cusomersMappedById'
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

    haveContracts() {
      return this.filteredContracts.length > 0
    },

    contractTariffByKey() {
      return (contract, key) => {
        return (contract.tariffs || []).find(({ type }) => type === key) || { type: key, value: 0, volumeLimit: 0 }
      }
    },

    haveUnsavedContracts() {
      return this.filteredContracts.filter(({ id }) => !id).length > 0
    }
  },

  watch: {
    clientData(current) {
      this.form = current
    },

    visible(current) {
      this.isFormVisible = true
    }
  },

  beforeMount() {
    this.form = this.clientData
  },

  methods: {
    changeAllFilteredContracts(newValue) {
      this.allFilteredContracts = newValue
    },

    makeContractName(contract) {
      return `Contrato #${contract.id} - ${contract.startedDate}`
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

    handleCreateNewContract() {
      const contractRef = `contract#${this.filteredContracts.length}`
      this.form.contracts.push({ status: CONTRACT_STATUS.ACTIVE.key })

      this.contractsVisibleList.push(contractRef)
    },

    handleRemoveUnsavedContract() {
      const unsavedIndex = this.form.contracts.findIndex(({ id }) => (!id))

      if (unsavedIndex < 0) return

      this.$delete(this.form.contracts, unsavedIndex)
    }
  }
}
</script>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

.contracts-modal {
  div[role="dialog"] {
    .el-dialog__body {
      .contracts-cards-container {
        div[role="tablist"].el-collapse {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .el-collapse-item.contract-card__container {
            width: 100%;
            flex: 1 !important;
            border: solid lightgray 2px !important;
            border-radius: 8px !important;
            position: relative;

            div[role="tab"] {
              div[role="button"].el-collapse-item__header {
                .contract-card__title {
                  width: 100%;

                  h4 {
                    line-height: 2rem;
                    margin: 0;
                    font-weight: 600;
                  }

                  h4 + h4 {
                    font-weight: normal;
                    text-indent: 0.5rem;
                    line-height: 1.5rem;
                  }
                }
              }
            }

            div[role="tabpanel"] {
              .el-collapse-item__content {
                padding: 0;

                .contract-card__data {
                  display: flex;
                  flex-direction: column;
                  gap: 16px;

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

                  .remove-contract__btn {
                    position: absolute;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    z-index: 10;
                    margin: 4px;

                    .el-button {
                      z-index: 10;
                    }
                  }
                }
              }
            }
          }
        }

        .contract-card__container {
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .new-contract__action {
          padding: 8px;
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 16px;
        }
      }
    }
  }
}
</style>
