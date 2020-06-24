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
        <i class="el-icon-plus client-grid__icon"/>
      </el-card>

      <el-card
        v-else
        shadow="always"
        class="client-grid__form-card"
      >
        <span class="client-grid__form-title">
          Escreva o nome do cliente!
        </span>

        <el-autocomplete
          v-model="inputValue"
          :fetch-suggestions="querySearch"
          placeholder="Ex.: José da Silva"
          class="client-grid__autocomplete"
          value-key="name"
        />

        <el-button
          type="primary"
          @click.native="addClient"
        >
          Ok!
        </el-button>
      </el-card>
    </jus-grid>

    <ContractsModal
      v-if="dialogFormVisible"
      :client-data="form"
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
    ContractsModal: () => import('./ContractsModal'),
  },
  data() {
    return {
      dialogFormVisible: false,
      form: null,
      formCardIsVisible: false,
      inputValue: '',
    }
  },
  computed: {
    ...mapGetters({
      currentCustomer: 'getCurrentCustomer',
      custumerList: 'getMyCusomers',
      custumerSuggestions: 'getAllCusomers',
      workspaceId: 'workspaceId',
      isJusttoAdmin: 'isJusttoAdmin',
    }),
  },
  beforeMount() {
    if (!this.isJusttoAdmin) this.$router.go(-1)

    this.getMyCusomers()
    this.getAllCustomers()
    this.setWorkspaceId(this.workspaceId)

    this.form = this.currentCustomer
  },
  methods: {
    ...mapActions([
      'addCustomer',
      'associateCustomer',
      'getAllCustomers',
      'getMyCusomers',
      'setCustomer',
      'setWorkspaceId',
      'unlinkCustomer',
      'updateCustomer',
    ]),
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
      this.dialogFormVisible = true
    },
    handleClose(userData) {
      this.unlinkCustomer(userData.id)
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
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.client-grid__action-card {
  & > .el-card__body {
    align-items: center;
    background-color: $--color-success-light-5;
    color: mix($--color-black, $--color-success, 50%);
    cursor: pointer;
    display: flex;
    font-size: 18px;
    font-weight: 700;
    height: 100%;
    min-height: 348px;
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
    min-height: 348px;
    justify-content: center;

    .client-grid__form-title {
      display: block;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .client-grid__autocomplete {
      margin-bottom: 24px;
    }
  }
}
</style>
