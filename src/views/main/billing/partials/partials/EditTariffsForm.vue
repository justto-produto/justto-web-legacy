<template>
  <article>
    <el-form
      v-if="visible"
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

      <el-row
        v-if="form.tariffType === 'FRANCHISE'"
        :gutter="16"
      >
        <el-col
          v-for="(tariffValue, tariffKey, tariffCount) in franchiseTariffTypes"
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
                <el-col :span="12">
                  <el-form-item label="Franquia">
                    <el-input-number
                      v-model="form.tariffs[getTariffIndex(tariffKey)].volumeLimit"
                      controls-position="right"
                      type="number"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
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
              </el-row>
            </el-form>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row
        v-else-if="form.tariffType === 'VOLUMETRY'"
        :gutter="16"
      >
        <el-col
          v-for="(tariffValue, tariffKey, tariffCount) in volumetryTariffTypes"
          :key="tariffCount"
          :span="12"
        >
          <el-form-item :label="tariffValue.label">
            <div class="el-input">
              <money
                v-model="tariffValue.value"
                class="el-input__inner"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item>
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
      v-else-if="contract.tariffType === 'FRANCHISE'"
      title="Valores por franquia"
      :column="1"
    >
      <el-descriptions-item
        v-for="(tariffValue, tariffKey, tariffCount) in franchiseTariffTypes"
        :key="tariffCount"
        :label="tariffValue.label"
      >
        <span v-if="getTariffByKey(tariffKey).value > 0">
          {{ getTariffByKey(tariffKey).value | currency }} acima de {{ getTariffByKey(tariffKey).volumeLimit || 1 }} casos.
        </span>

        <span v-else> não cobrado.</span>
      </el-descriptions-item>

      <el-descriptions-item>
        <el-button
          type="primary"
          size="mini"
          @click="open"
        >
          Editar
        </el-button>
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions
      v-else-if="contract.tariffType === 'VOLUMETRY'"
      title="`Valores por volume"
      :column="1"
    >
      <el-descriptions-item
        v-for="(tariffValue, tariffKey, tariffCount) in volumetryTariffTypes"
        :key="tariffCount"
        :label="tariffValue.label"
      >
        <span v-if="getTariffByKey(tariffKey).value > 0">
          {{ getTariffByKey(tariffKey).value | currency }} acima de {{ getTariffByKey(tariffKey).volumeLimit || 1 }} casos.
        </span>

        <span v-else> não cobrado.</span>
      </el-descriptions-item>

      <el-descriptions-item>
        <el-button
          type="primary"
          size="mini"
          @click="open"
        >
          Editar
        </el-button>
      </el-descriptions-item>
    </el-descriptions>
  </article>
</template>

<script>
import { FRANCHISE_TARIFF_TYPES, TARIFF_TYPES } from '@/constants/billing'
import { mapActions } from 'vuex'

export default {
  name: 'EditTariffsForm',

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
    franchiseTariffTypes: FRANCHISE_TARIFF_TYPES,
    volumetryTariffTypes: TARIFF_TYPES
  }),

  computed: {
    isContractInactive() {
      return this.contract?.status === 'INACTIVE'
    },

    contractDate() {
      return this.contract?.updateAt?.dateTime || this.contract?.createAt?.dateTime || new Date().toISOString()
    },

    getTariffByKey() {
      return (key) => {
        return (this.contract?.tariffs || []).find(({ type }) => type === key) || {
          type: key,
          value: 0,
          volumeLimit: 0
        }
      }
    }
  },

  methods: {
    ...mapActions(['updateContract']),

    populateForm() {
      ['tariffType', 'tariffs'].forEach(key => {
        this.form[key] = this.contract[key]
      })
    },

    populateTariffs() {
      const types = Object.keys({
        ...FRANCHISE_TARIFF_TYPES,
        ...TARIFF_TYPES
      })

      const tariffs = []

      types.map(type => {
        const tariffAlreadyExists = this.form.tariffs.filter(tariff => tariff.type === type).length > 0

        if (!tariffAlreadyExists) {
          tariffs.push({
            type,
            value: 0,
            volumeLimit: 0
          })
        }
      })

      this.form.tariffs = [
        ...(this.form.tariffs || []),
        ...tariffs
      ]
    },

    open() {
      this.populateForm()
      this.populateTariffs()

      this.visible = true
    },

    handleResetForm() {
      this.form = { tariffType: '', tariffs: [] }

      return Promise.resolve()
    },

    handleClose(done) {
      done()

      this.visible = false
    },

    handleCancel() {
      this.saving = true
      this.handleResetForm().finally(_ => {
        this.saving = false
        this.visible = false
      })
    },

    handleSave() {
      this.saving = true

      this.updateContract({
        customerId: this.customer.customerId,
        contract: {
          ...this.contract,
          ...this.form
        }
      }).then(async _ => {
        await this.getContracts()

        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: 'Contrato editado com sucesso.'
        })

        this.handleCancel()
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.saving = false
      })
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
</style>
