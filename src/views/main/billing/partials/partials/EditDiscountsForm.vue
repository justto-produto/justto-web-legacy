<template>
  <el-form
    v-if="visible"
    :model="form"
    size="mini"
    class="discounts__form"
  >
    <el-row class="mb10">
      <el-col :span="24">
        <h3 class="mb0 mt0">
          Descontos por importação
        </h3>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col
        v-for="(discount, dIndex) in form.discounts"
        :key="`discount#${dIndex}`"
        :span="24"
      >
        <SingleDiscountForm
          v-model="form.discounts[dIndex]"
          @delete="handleRemoveDiscount(dIndex)"
        />
      </el-col>

      <el-col :span="24">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="handleAddDiscount"
        >
          Adicionar desconto
        </el-button>
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
            :disabled="loading"
            @click="handleSave"
          >
            <i
              v-show="loading"
              class="el-icon-loading"
            />

            Salvar
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <DiscountsDescription
    v-else
    v-loading="loading"
    :discounts="discounts"
    @click="handleenableEdit"
  />
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'EditDiscountsForm',

  components: {
    DiscountsDescription: () => import('./partials/DiscountsDescription.vue'),
    SingleDiscountForm: () => import('./partials/SingleDiscountForm')
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
    loading: false,
    visible: false,
    form: {
      discounts: []
    }
  }),

  computed: {
    ...mapGetters({
      discountsById: 'contractDiscountList'
    }),

    discounts() {
      return this.discountsById[this.contract?.id] || []
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    ...mapActions([
      'addContractDiscount',
      'changeContractDiscount',
      'deleteContractDiscount',
      'getContractDiscountList'
    ]),

    handleUpdateDiscountsList() {
      this.form.discounts = [...this.discountsById[this.contract?.id]]
    },

    handleShowLoading() {
      this.loading = true
    },

    init() {
      if (!this.contract?.id) return

      this.handleShowLoading()

      this.getContractDiscountList(this.contract?.id).then(_ => {
        this.handleUpdateDiscountsList()

        if (this.form.discounts.length === 0) this.handleAddDiscount()
      }).catch(error => this.$jusNotification({ error })).finally(() => { this.loading = false })
    },

    handleCancel() {
      this.loading = false
      this.visible = false
    },

    handleSave() {
      this.handleShowLoading()

      const promises = this.form.discounts.map(discount => ({
        fn: discount?.id ? this.changeContractDiscount : this.addContractDiscount,
        payload: { contractId: this.contract.id, discountId: discount?.id, discount }
      }))

      Promise.all(promises.map(({ fn, payload }) => fn(payload))).then(async _ => {
        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: 'Contrato editado com sucesso.'
        })

        this.handleUpdateDiscountsList()
        this.handleCancel()
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.loading = false
      })
    },

    handleAddDiscount() {
      this.form.discounts.push({
        minVolume: 0,
        value: 0,
        type: 'MONTHLY_SUBSCRIPTION_VALUE'
      })
    },

    handleRemoveDiscount(index) {
      console.log('handleRemoveDiscount', index)

      if (this.form.discounts[index]?.id) {
        this.handleShowLoading()

        this.deleteContractDiscount({
          contractId: this.contract.id,
          discountId: this.form.discounts[index]?.id
        })
          .catch(error => this.$jusNotification({ error }))
          .finally(() => { this.loading = false })
      }

      this.form.discounts.splice(index, 1)
    },

    async handleenableEdit() {
      await this.init()

      this.visible = true
    }
  }
}
</script>

<style lang="scss">
.discounts__form {
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

                  .el-form-item__label {
                    font-weight: normal !important;
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
}
</style>
