<template>
  <div class="client-grid">
    <jus-grid
      :columns="4"
    >
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
          Digite o nome do cliente abaixo para buscar um existente ou criar um novo.
        </span>

        <el-autocomplete
          v-model="inputValue"
          :fetch-suggestions="querySearch"
          placeholder="Ex.: José da Silva"
          class="client-grid__autocomplete"
          value-key="name"
        />

        <el-button
          v-if="inputValue"
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
      inputValue: ''
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
      workspaceId: 'workspaceId'
    })
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
      'updateCustomer'
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
          const planId = this.plans.find(plan => plan.name === 'Escritório').id
          for (const customer of this.custumerList) {
            for (const contract of customer.contracts) {
              if (contract.planId === planId) {
                resolve(customer)
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
    addClient() {
      const name = this.inputValue
      const similarClient = this.custumerSuggestions.filter(val => val.name === name)

      if (similarClient.length) {
        this.associateCustomer(similarClient[0].id)
      } else {
        this.addCustomer({ name })
      }

      this.hideFormCard()
    },
    showFormCard() {
      this.formCardIsVisible = true
    },
    hideFormCard() {
      this.formCardIsVisible = false
      this.inputValue = ''
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
      margin-bottom: 24px;
      width: 100%;
    }
  }
}
</style>
