<template>
  <div class="client-grid">
    <jus-grid :columns="4">
      <div
        v-for="(user, index) in custumerList"
        :key="index"
        class="client-grid__card"
      >
        <h1 class="client-grid__card__holding center mb0">
          <el-autocomplete
            v-if="isEditingHoldingName === user.id"
            v-model="holdingName"
            :fetch-suggestions="holdingQuerySearch"
            placeholder="Digite o nome da holding"
            class="client-grid__autocomplete"
            value-key="name"
            @select="handleChangeHoldingName(user)"
          >
            <i
              slot="suffix"
              class="el-icon-close el-input__icon"
              @click="handleCleanHoldingEditing"
            />

            <i
              slot="suffix"
              class="el-icon-check el-input__icon"
              @click="handleChangeHoldingName(user)"
            />
          </el-autocomplete>

          <JusTextEditable
            v-else
            :value="getHoldingName(user.holdingId)"
            type="title"
            class="jus-user-card__title"
            @isEditing="handleEnableEditExistingHolding(user)"
          />
        </h1>

        <el-divider class="mb0" />

        <jus-user-card
          :user-data="user"
          class="client-grid__card__customer"
          @edit-title="handleEditTitle"
          @see-more="handleSeeMore"
          @edit="handleEdit"
          @close="handleClose"
        />
      </div>

      <el-card
        v-if="!formCardIsVisible"
        shadow="hover"
        class="client-grid__action-card"
        @click.native="showFormCard"
      >
        <span>Adicionar um cliente</span>

        <i class="el-icon-plus client-grid__icon" />
      </el-card>

      <el-card
        v-else
        shadow="always"
        class="client-grid__form-card"
      >
        <span class="client-grid__form-title">
          Digite o nome da Holding para buscar uma existente, ou criar uma nova.
        </span>

        <el-autocomplete
          v-model="holdingName"
          :fetch-suggestions="holdingQuerySearch"
          placeholder="Digite o nome da holding"
          class="client-grid__autocomplete"
          value-key="name"
          @input="handleHoldingChange"
        />

        <span
          v-if="holdingName"
          class="client-grid__form-title"
        >
          Digite o nome do cliente abaixo para buscar um existente ou criar um novo.
        </span>

        <el-autocomplete
          v-if="holdingName"
          v-model="inputValue"
          :fetch-suggestions="querySearch"
          placeholder="Ex.: José da Silva"
          class="client-grid__autocomplete"
          value-key="name"
          @input="handleValueChange"
        />

        <span
          v-if="inputValue"
          class="client-grid__form-title"
        >
          Tipo de cliente:
        </span>

        <el-select
          v-if="inputValue"
          v-model="negotiationType"
          placeholder="Tipo de cliente"
          class="client-grid__autocomplete"
        >
          <el-option
            label="Cobrança"
            value="COBRANCA"
          />

          <el-option
            label="Indenizatório"
            value="INDENIZATORIO"
          />
        </el-select>

        <span
          v-if="inputValue"
          class="client-grid__form-title"
        >
          Mensalidade:
        </span>

        <div
          v-if="inputValue"
          class="el-input"
        >
          <money
            v-if="inputValue"
            v-model="monthlySubscriptionFee"
            class="el-input__inner client-grid__autocomplete"
          />
        </div>

        <el-button
          v-if="inputValue"
          class="client-grid__btn"
          type="primary"
          @click.native="addClient"
        >
          Vincular cliente
        </el-button>
      </el-card>
    </jus-grid>

    <ContractsCardsModal
      :plans="plans"
      :visible="dialogFormVisible"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ClientGrid',

  components: {
    JusGrid: () => import('@/components/JusGrid/JusGrid'),
    JusUserCard: () => import('@/components/JusUserCard/JusUserCard'),
    // ContractsModal: () => import('./ContractsModal'),
    ContractsCardsModal: () => import('./ContractsCardsModal'),
    JusTextEditable: () => import('@/components/JusTextEditable/JusTextEditable')
  },

  data() {
    return {
      dialogFormVisible: false,
      formCardIsVisible: false,
      inputValue: '',
      monthlySubscriptionFee: 0,
      negotiationType: null,
      isEditingHoldingName: false,
      holdingName: ''
    }
  },

  computed: {
    ...mapGetters({
      custumerList: 'getMyCusomers',
      isJusttoAdmin: 'isJusttoAdmin',
      isAdminProfile: 'isAdminProfile',
      currentCustomer: 'getCurrentCustomer',
      custumerSuggestions: 'getAllCusomers',
      plans: 'getPlans',
      workspaceId: 'workspaceId',
      holdingSuggestions: 'getHoldingsList'
    }),

    isSuggestion() {
      return this.custumerSuggestions.filter(({ name }) => (name === this.inputValue)).length > 0
    },

    getHoldingName() {
      return (holdingId) => this.holdingSuggestions.find(({ id }) => Number(holdingId) === Number(id))?.name || ''
    }
  },

  created() {
    this.init()
  },

  methods: {
    ...mapActions([
      'addCustomer',
      'associateCustomer',
      'getAllCustomers',
      'getMyCusomers',
      'getPlans',
      'setCustomer',
      'setWorkspaceId',
      'unlinkCustomer',
      'updateCustomer',
      'getHoldings',
      'createHolding'
    ]),

    init() {
      if (this.isJusttoAdmin || this.isAdminProfile) {
        this.getPlans().then(() => {
          this.getMyCusomers().then(() => {
            this.getAllCustomers().then(() => {
              this.setWorkspaceId(this.workspaceId)
              this.$nextTick(() => {
                if (this.isAdminProfile && !this.isJusttoAdmin) {
                  this.getCustomerToRedirect().then(customer => {
                    this.setCustomer(customer)
                    this.$router.push(`/billing/${customer.id}`)
                  }).catch(() => {
                    this.$router.go(-1)
                    this.$jusNotification({
                      title: 'Ops!',
                      message: 'Nenhum cliente com contratos do tipo escritório nesta workspace.',
                      type: 'error'
                    })
                  })
                }
              })
            })
          })
        })

        this.getHoldings('').catch(error => this.$jusNotification({ error }))
      } else {
        this.$router.push('/management')
        this.$jusNotification({
          title: 'Ops!',
          message: 'Você não pode entra ai. Fale com um administrador',
          type: 'warning'
        })
      }
    },

    getCustomerToRedirect() {
      return new Promise((resolve, reject) => {
        if (this.custumerList.length === 1) {
          const customer = this.custumerList[0]
          resolve(customer)
        } else {
          // const planId = this.plans.find(plan => [10, 5, 8].includes(Number(plan.id))).id

          for (const plan of this.plans) {
            if (![10, 5, 8].includes(Number(plan.id))) {
              for (const customer of this.custumerList) {
                for (const contract of customer.contracts) {
                  if (contract.planId === plan.id) {
                    resolve(customer)
                  }
                }
              }
            }
          }

          reject(new Error('Sem customers com clientes com contratos do tipo Escritório.'))
        }
      })
    },

    handleEditTitle(userData) {
      this.updateCustomer(userData)
    },

    querySearch(queryString, cb) {
      const options = this.custumerSuggestions
      const results = queryString ? options.filter(this.createFilter(queryString)) : options

      cb(results)
    },

    holdingQuerySearch(queryString, cb) {
      const options = this.holdingSuggestions
      const results = queryString ? options.filter(this.createFilter(queryString)) : options

      cb(results)
    },

    createFilter(queryString) {
      return (option) => {
        return (option.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },

    handleSeeMore(userData) {
      this.setCustomer(userData)
      this.$router.push(`/billing/${userData.id}`)
    },

    handleEdit(userData) {
      this.setCustomer(userData)
      this.form = this.currentCustomer
      this.dialogFormVisible = !this.dialogFormVisible
    },

    handleClose(userData) {
      this.$confirm('Tem certeza que deseja desvincular este cliente dassa workspace?', 'Atenção', {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then(() => {
        this.unlinkCustomer(userData.id).then(() => {
          this.$jusNotification({
            type: 'success',
            title: 'Yay!',
            message: 'Cliente desvinculado com sucesso.'
          })
        })
      })
    },

    handleFilterHoldingByName() {
      const index = this.holdingSuggestions.map(({ name }) => name).indexOf(this.holdingName)

      return new Promise((resolve) => {
        if (index < 0) {
          resolve(this.createHolding(this.holdingName))
        }

        resolve(this.holdingSuggestions[index])
      })
    },

    async handleAssssiateHolding(holdingId, client) {
      if (client?.holdingId === holdingId) return Promise.resolve()

      return this.updateCustomer({
        ...client,
        holdingId
      })
    },

    async addClient() {
      const name = this.inputValue
      const holdingId = (await this.handleFilterHoldingByName())?.id
      const similarClient = this.custumerSuggestions.filter(val => val.name === name)
      const { negotiationType, monthlySubscriptionFee } = this

      if (similarClient.length) {
        await this.handleAssssiateHolding(holdingId, similarClient[0])
        this.associateCustomer(similarClient[0].id)
      } else {
        this.addCustomer({
          name,
          holdingId,
          negotiationType,
          monthlySubscriptionFee
        })
      }

      this.hideFormCard()
    },

    showFormCard() {
      this.formCardIsVisible = true
    },

    hideFormCard() {
      this.formCardIsVisible = false
      this.inputValue = ''
      this.negotiationType = null
    },

    handleValueChange() {
      (this.custumerSuggestions || []).forEach(({ name, negotiationType }) => {
        if (name === this.inputValue) this.negotiationType = negotiationType
      })
    },

    handleHoldingChange() {
      (this.holdingSuggestions || []).forEach(({ name }) => (name === this.holdingName))
    },

    handleEnableEditExistingHolding(customer) {
      this.isEditingHoldingName = customer.id
      this.holdingName = this.getHoldingName(customer.holdingId)
    },

    async handleChangeHoldingName(customer) {
      const holdingId = (await this.handleFilterHoldingByName())?.id

      console.log(holdingId, customer)

      this.$confirm(`Deseja realmente editar a holding do cliente${customer?.name ? ` ${customer?.name}` : ''}?`, {
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        showClose: false
      }).then(_ => {
        this.updateCustomer({
          ...customer,
          holdingId
        }).then(() => this.$jusNotification({ type: 'success', message: 'Holding editada com sucesso.' })).catch(error => this.$jusNotification({ error }))
      }).finally(this.handleCleanHoldingEditing)
    },

    handleCleanHoldingEditing() {
      this.isEditingHoldingName = false
      this.holdingName = ''
    }
  }
}
</script>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

.client-grid__action-card {

  & > .el-card__body {
    padding: 10px !important;
    background-color: $--color-success-light-5;
    color: mix($--color-black, $--color-success, 50%);
    cursor: pointer;
    display: flex;
    font-size: 18px;
    font-weight: 700;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

  .client-grid__icon {
    font-size: 24px;
    margin-left: 8px;
  }
}

.client-grid__form-card {
  & > .el-card__body {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;

    .client-grid__form-title {
      display: block;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .client-grid__autocomplete {
      margin-bottom: 16px;
      width: 100%;

      .el-input {
        overflow-x: hidden;
      }
    }

    .client-grid__btn {
      margin-top: 8px;
    }
  }
}

.client-grid__card {
  border: solid 1px $--pj-color-light-blue;
  border-radius: 11px 7px 7px 11px;
  background-color: $--pj-color-light-blue;

  .client-grid__card__holding {
    background-color: transparent;
    color: white;

    .jus-text-editable {
      .edit-icon {
        filter: invert(1);
      }
    }

    .client-grid__autocomplete {
      .el-input {
        overflow: hidden !important;
        .el-input__inner {
          background-color: #fff;
        }

        .el-input__suffix {
          .el-input__icon {
            cursor: pointer;
          }
        }
      }
    }
  }

  .client-grid__card__customer {
    border: none;
    border-radius: 11px 7px 7px 11px;
    background-color: $--color-white;
  }
}
</style>
