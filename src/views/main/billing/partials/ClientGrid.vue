<template>
  <div class="client-grid">
    <jus-grid :columns="4">
      <jus-user-card
        v-for="(user, index) in custumerList"
        :key="index"
        :user-data="user"
        @edit-title="handleEditTitle"
        @see-more="handleSeeMore"
        @edit="handleEdit"
        @close="handleClose"
      />

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

    <ContractsModal
      :client-data="currentCustomer"
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
    ContractsModal: () => import('./ContractsModal')
  },

  data() {
    return {
      dialogFormVisible: false,
      formCardIsVisible: false,
      inputValue: '',
      monthlySubscriptionFee: 0,
      negotiationType: null,
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

        this.getHoldings(this.holdingName).catch(error => this.$jusNotification({ error }))
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
      this.getHoldings(this.holdingName)
        .then(options => {
          const results = queryString ? options.filter(this.createFilter(queryString)) : options

          cb(results)
        }).catch(error => this.$jusNotification({ error }))
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

    async addClient() {
      const name = this.inputValue
      const holdingId = (await this.handleFilterHoldingByName())?.id
      const similarClient = this.custumerSuggestions.filter(val => val.name === name)
      const { negotiationType, monthlySubscriptionFee } = this

      // TODO: Adicionar Holding à customer já existente.

      if (similarClient.length) {
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
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

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
</style>
