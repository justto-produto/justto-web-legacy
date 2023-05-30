<template>
  <article>
    <el-form
      v-if="visible"
      ref="form"
      v-loading="saving"
      :model="form"
      size="mini"
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
        class="mb10"
      >
        <el-col
          v-for="(tariff, tIndex) in franchiseTariffsOnForm"
          :key="`edit-tariff#${tIndex}`"
          :span="24"
        >
          <el-form-item
            :label="franchiseTariffTypes[tariff.type].label"
            class="flex-item small-label"
          >
            <SingleTariffForm
              v-model="form.tariffs[getTariffIndex(tariff.type)]"
              :contract-inactive="isContractInactive"
              @delete="handleRemoveTariff(getTariffIndex(tariff.type))"
            />
          </el-form-item>
        </el-col>

        <el-col
          v-if="contract.tariffType === 'FRANCHISE' && franchiseTariffsNotOnForm.length"
          :span="24"
        >
          <TariffTypeDropdown
            :tariffs="franchiseTariffsNotOnForm"
            @command="handleAddTariff"
          />
        </el-col>

        <el-col
          v-else-if="contract.tariffType === 'VOLUMETRY' && volumetryTariffsNotOnForm.length"
          :span="24"
        >
          <TariffTypeDropdown
            :tariffs="volumetryTariffsNotOnForm"
            @command="handleAddTariff"
          />
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

    <FranchiseTariffsDescription
      v-else-if="contract.tariffType === 'FRANCHISE'"
      :tariffs="filteredFranchiseTariffs"
      @click="open"
    />

    <VolumetryTariffsDescription
      v-else-if="contract.tariffType === 'VOLUMETRY'"
      :tariffs="filteredVolumetryTariffs"
      @click="open"
    />
  </article>
</template>

<script>
import { FRANCHISE_TARIFF_TYPES, TARIFF_TYPES } from '@/constants/billing'
import { mapActions } from 'vuex'

export default {
  name: 'EditTariffsForm',

  components: {
    SingleTariffForm: () => import('./partials/SingleTariffForm'),
    TariffTypeDropdown: () => import('./partials/TariffTypeDropdown'),
    FranchiseTariffsDescription: () => import('./partials/FranchiseTariffsDescription'),
    VolumetryTariffsDescription: () => import('./partials/VolumetryTariffsDescription')
  },

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
    franchiseTariffKeys: Object.keys(FRANCHISE_TARIFF_TYPES),
    volumetryTariffTypes: TARIFF_TYPES,
    volumetryTariffKeys: Object.keys(TARIFF_TYPES)
  }),

  computed: {
    isContractInactive() {
      return this.contract?.status === 'INACTIVE'
    },

    contractDate() {
      return this.contract?.updateAt?.dateTime || this.contract?.createAt?.dateTime || new Date().toISOString()
    },

    filteredTariffs() { return (this.contract.tariffs || []).filter(({ value }) => Boolean(value)) },

    filteredFranchiseTariffs() {
      return (this.contract.tariffs || []).filter(({ value, type }) => (Boolean(value) && this.franchiseTariffKeys.includes(type)))
    },

    filteredVolumetryTariffs() {
      return (this.contract.tariffs || []).filter(({ value, type }) => (Boolean(value) && this.volumetryTariffKeys.includes(type)))
    },

    haveTariffs() {
      return this.filteredTariffs.length > 0
    },

    franchiseTariffsOnForm() {
      return this.form.tariffs.filter(({ type }) => this.franchiseTariffKeys.includes(type))
    },

    franchiseTariffsNotOnForm() {
      return this.franchiseTariffKeys.filter(key => !this.franchiseTariffsOnForm.map(({ type }) => type).includes(key))
    },

    volumetryTariffsOnForm() {
      return this.form.tariffs.filter(({ type }) => this.volumetryTariffKeys.includes(type))
    },

    volumetryTariffsNotOnForm() {
      return this.volumetryTariffKeys.filter(key => !this.volumetryTariffsOnForm.map(({ type }) => type).includes(key))
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
    ...mapActions([
      'updateContract'
    ]),

    populateForm() {
      ['tariffType', 'tariffs'].forEach(key => {
        this.form[key] = this.contract[key]
      })
    },

    populateTariffs() {
      this.form.tariffs = [
        ...(this.form.tariffs || [])
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
    },

    handleAddTariff(tariffType) {
      this.form.tariffs.push({
        type: tariffType,
        value: 0,
        volumeLimit: 1
      })
    },

    handleRemoveTariff(index) {
      this.form.tariffs.splice(index, 1)
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

        &.small-label {
          .el-form-item__label {
            font-size: 1rem !important;
          }
        }
      }

      .el-form-item.flex-end {
        margin: 0;

        .el-form-item__content {
          display: flex;
          justify-content: flex-end;
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

  .el-descriptions {
    .el-descriptions__body {
      .el-descriptions__table {
        tbody {
          .el-descriptions-row {
            .el-descriptions-item {
              .el-descriptions-item__container {}
            }
          }
        }
      }
    }
  }
}
</style>
