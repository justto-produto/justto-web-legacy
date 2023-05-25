<template>
  <el-dialog
    v-if="visible"
    :visible.sync="visible"
    :show-close="false"
    width="70%"
    modal-append-to-body
    append-to-body
    custom-class="contract-tariffs__dialog"
  >
    <span slot="title">
      <h2>Editando contrato de <span class="upper">{{ customer.customerName }}</span> em <span class="upper">{{ contractDate | moment('L') }}</span></h2>
      <h3>com mensalidade de {{ customer.monthlySubscriptionFee | currency }}</h3>
    </span>

    <el-form
      ref="form"
      v-loading="saving"
      :model="form"
      class="contract__form"
    >
      <el-row :gutter="16">
        <el-col :span="24">
          <el-form-item
            prop="tariffType"
            label="Modelo de cobrança:"
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

      <el-row :gutter="16">
        <el-col
          v-for="(tariffValue, tariffKey, tariffCount) in tariffTypes"
          :key="tariffCount"
          :span="24"
        >
          <el-form-item
            :label="tariffValue.label"
            class="flex-item"
          >
            <el-form
              :inline="true"
              :model="form.tariffs[getTariffIndex(tariffKey)]"
            >
              <el-row :gutter="16">
                <el-col :span="11">
                  <el-form-item label="Franquia">
                    <el-input-number
                      v-model="form.tariffs[getTariffIndex(tariffKey)].volumeLimit"
                      controls-position="right"
                      type="number"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="11">
                  <el-form-item label="Valor Adicional">
                    <div class="el-input">
                      <money
                        v-model="form.tariffs[getTariffIndex(tariffKey)].value"
                        :disabled="isContractInactive"
                        :readonly="isContractInactive"
                        :class="{'is-inactive': isContractInactive}"
                        class="el-input__inner"
                      />
                    </div>
                  </el-form-item>
                </el-col>

                <el-col :span="2">
                  <el-form-item
                    label="a"
                    class="labelless"
                  >
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      plain
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
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
    v-else
    type="primary"
    size="mini"
    @click="open"
  >
    Editar
  </el-button>
</template>

<script>
import { FRANCHISE_TARIFF_TYPES } from '@/constants/billing'

export default {
  props: {
    contract: {
      type: Object,
      required: true
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
      tariffType: '',
      tariffs: []
    },
    tariffTypes: FRANCHISE_TARIFF_TYPES
  }),

  computed: {
    isContractInactive() {
      return this.contract?.status === 'INACTIVE'
    },

    contractDate() {
      return this.contract?.updateAt?.dateTime || this.contract?.createAt?.dateTime || new Date().toISOString()
    }
  },

  methods: {
    populateForm() {
      ['tariffType', 'tariffs'].forEach(key => {
        this.form[key] = this.contract[key]
      })
    },

    populateTariffs() {
      const types = Object.keys(FRANCHISE_TARIFF_TYPES)
      const tariffs = []

      types.map(type => {
        const tariffAlreadyExists = this.form.tariffs.filter(tariff => tariff.type === type).length > 0

        if (!tariffAlreadyExists) {
          tariffs.push({
            type,
            value: 0,
            volumeLimit: 1
          })
        }
      })

      this.form.tariffs = tariffs
    },

    open() {
      this.populateForm()
      this.populateTariffs()

      this.visible = true
    },

    handleCancel() {
      this.visible = false
    },

    handleSave() {
      console.log(this.form)
    },

    getTariffIndex(tariffType) {
      let tariffIndex

      this.form.tariffs.map((tariff, index) => {
        if (tariff.type === tariffType) return (tariffIndex = index)
      })

      return tariffIndex
    }
  }
}
</script>

<style lang="scss">
.contract-tariffs__dialog {
  border: solid lightgray 0.2rem;

  .el-dialog__header {
    span {
      h2 {
        margin-bottom: 0;
      }

      h2 + h3 {
        margin-top: 0;
      }
    }
  }

  .contract__form {
    .el-row {
      .el-col {
        .el-form-item.flex-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .el-form-item__content {
            width: 100%;

            .el-form--inline {
              .el-row {
                .el-col {
                  .el-form-item {
                    width: 100% !important;
                    line-height: 0;

                    .el-form-item__label {
                      font-weight: normal !important;
                      line-height: 1.5rem;
                    }

                    .el-form-item__content {
                      .el-input-number {
                        width: 100% !important;
                      }
                    }
                  }

                  .labelless {
                    .el-form-item__label  {
                      visibility: hidden;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    .el-row + .el-row {
      .el-col {
        .el-form-item.flex-item > .el-form-item__label {
          font-weight: 600;
          font-size: 1.25rem;
        }
      }
    }
  }
}
</style>
