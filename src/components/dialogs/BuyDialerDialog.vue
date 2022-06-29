<template>
  <el-dialog
    :visible.sync="isVisible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="60%"
    custom-class="buy-modal-dialog"
    title="Adquirir discadores dedicados"
    append-to-body
  >
    <main
      v-loading="isLoading"
      class="dialog-body"
    >
      <p>
        Os discadores gratuitos são um número fixo de linhas telefônicas compartilhadas com todos que utilizam o sistema da JUSTTO.
        <br>
        Em momentos de pico de uso, você pode demorar a ter uma linha disponível para utilizar.
      </p>

      <p>
        Caso queira, pode adquirir discadores dedicados para você ou para seu time. O valor unitário é de R$ 80,00 por mês por discador. Os valores irão ser debitados em sua fatura da JUSTTO.
      </p>

      <p>
        <br>
        Quantos discadores dedicados você precisa?
      </p>

      <div class="dialer-form">
        <el-input-number
          v-model="formState.dialers"
          :min="1"
          :disabled="formState.destination === 1"
          controls-position="right"
          type="number"
          size="mini"
        />

        <span>discador(es) dedicados para</span>

        <el-select
          v-model="formState.destination"
          placeholder="Selecione uma opção"
          size="mini"
          @change="changeDestinationHandle"
        >
          <el-option
            v-for="item in destinationOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </main>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="isVisible = false">
        Cancelar
      </el-button>

      <el-button
        type="primary"
        @click="buyDialers()"
      >
        Adquirir {{ formState.dialers }} discador(es)
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  data: () => ({
    formState: {
      dialers: 1,
      destination: 2
    },

    isLoading: false,

    destinationOptions: [
      {
        value: 1,
        label: 'Somente para meu usuário'
      },
      {
        value: 2,
        label: 'Esta workspace'
      },
      {
        value: 3,
        label: 'Todas as workspaces da minha empresa'
      }
    ]
  }),

  computed: {
    ...mapGetters({
      workspaceId: 'workspaceId',
      accountEmail: 'accountEmail',
      personName: 'loggedPersonName',
      workspaceName: 'workspaceName',
      showBuyDialog: 'isBuyDialogVisible'
    }),

    isVisible: {
      get() {
        return this.showBuyDialog
      },

      set(visible) {
        this.setBuyDialerVisible(visible)
      }
    }
  },

  methods: {
    ...mapActions(['requestBuyDialers']),

    ...mapMutations(['setBuyDialerVisible']),

    buyDialers() {
      const workspaceString = `${this.workspaceName} (id ${this.workspaceId})`
      const subject = 'Requisição de novos discadores'
      const address = 'parcerias@justto.com.br'
      const content = `
      <main>
        <p>
          Usuário ${this.personName} (${this.accountEmail}) solicitou discadores dedicados:
        </p>

        <ul>
          <li>
            ${this.formState.dialers} discador(es)
          </li>
          <li>
            ${this.destinationOptions[this.formState.destination - 1].label} ${this.formState.destination === 2 ? workspaceString : ''}
          </li>
        </ul>
      </main>
      `

      this.isLoading = true
      this.requestBuyDialers({ subject, content, address }).then(() => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Discador solicitado com sucesso!',
          type: 'success'
        })
        this.setBuyDialerVisible(false)
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.isLoading = false
      })
    },

    changeDestinationHandle(value) {
      if (value === 1) {
        this.formState.dialers = 1
      }
    }
  }
}
</script>

<style lang="scss">
.buy-modal-dialog {
  .el-dialog__body > .dialog-body {
    word-break: break-word;

    .dialer-form {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;

      .el-select {
        .el-input {
          padding: 0 !important;
        }
      }
    }
  }
}
</style>
