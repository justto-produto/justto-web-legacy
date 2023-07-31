<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="60%"
    append-to-body
    destroy-on-close
    custom-class="webhook-config__modal"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <header slot="title">
      <span class="webhook-config__title">Configurações de integração</span>

      <JusIcon
        icon="webhook"
        size="48px"
      />
    </header>

    <article
      v-loading="loading"
      class="webhook-config__body"
    >
      <span>Configure as chamadas webhooks entre os sistemas.</span>

      <div class="webhook-config__tipo-disputa">
        <main>
          <el-switch
            v-model="integracaoTipoDeDisputas"
            active-text="Processo"
            active-value="PROCESSO"
            inactive-text="Procon"
            inactive-value="PROCON"
            class="webhook-config__url__switch"
            @change="open"
          />
        </main>
      </div>

      <div class="webhook-config__url">
        <header>
          Utilize o enderego abaixo para configurar o envio de eventos do Projuris Empresa que sero recebidos aqui no Projuris Acordos:
        </header>

        <main>
          <el-input
            :value="url"
            size="mini"
            disabled
          >
            <el-button
              slot="append"
              type="transparent"
              class="is-pointer"
              icon="el-icon-copy-document"
              @click="copyToClipboard(url)"
            />
          </el-input>
        </main>
      </div>

      <div class="webhook-config__list">
        <header>
          Adicione abaixo os endereços dos sistemas que deseja receber eventos de disputas desta workspace. Seus callbacks irão receber um JSON contendo a disputa inteira.
        </header>

        <main>
          <el-input
            v-for="(webhook, index) in webhooks"
            :key="index"
            v-model="webhooks[index]"
            size="mini"
          >
            <el-button
              slot="append"
              type="transparent"
              class="is-pointer"
              icon="el-icon-delete"
              @click="handleRemoveWebhook(index)"
            />
          </el-input>
        </main>

        <footer>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="handleAddWebhook"
          >
            Adicionar recebimentos de eventos
          </el-button>
        </footer>
      </div>
    </article>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="close">Voltar</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { copyToClipboard } from '@/utils'

export default {
  data: () => ({
    dialogVisible: false,
    loading: false,
    integracaoTipoDeDisputas: 'PROCESSO'
  }),

  computed: {
    ...mapGetters({
      fields: 'getIntegrationConfigs',
      webhooks: 'getIntegrationWebhooks',
      url: 'getUrlIntegracaoReceberEventos'
    })
  },

  methods: {
    ...mapActions([
      'getUrlIntegracaoReceberEventos',
      'saveIntegrationWebhooks',
      'getIntegrationWebhooks'
    ]),

    copyToClipboard,

    open() {
      this.loading = true
      this.dialogVisible = true

      this.handlePopulateWebhooks().finally(() => setTimeout(() => {
        this.loading = false
      }, 500))
    },

    close() {
      this.dialogVisible = false
    },

    handlePopulateWebhooks() {
      return Promise.all([
        this.getUrlIntegracaoReceberEventos({ tipo: this.integracaoTipoDeDisputas }),
        this.getIntegrationWebhooks()
      ])
    },

    handleAddWebhook() {
      this.$prompt('Adicione abaixo os endereços dos sistemas que deseja receber eventos de disputas desta workspace.', 'Adicionar recebimentos de eventos', {
        confirmButtonText: 'Adicionar',
        cancelButtonText: 'Cancelar',
        inputPattern: /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/,
        inputErrorMessage: 'URL inválida'
      }).then(({ value }) => {
        this.handleSaveWebhooks([...this.webhooks, value])
      })
    },

    handleRemoveWebhook(index) {
      this.handleSaveWebhooks(this.webhooks.filter((_, wIndex) => wIndex !== index))
    },

    handleSaveWebhooks(webhook = []) {
      return this.saveIntegrationWebhooks(webhook)
        .then(() => this.$jusNotification({ type: 'success', message: 'Sucesso.' }))
        .catch(error => this.$jusNotification({ error }))
    }
  }
}
</script>

<style lang="scss" scoped>
.webhook-config__modal {
  .el-dialog__header {
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .webhook-config__title {
        font-size: 1.25rem;
        font-weight: 700;
      }
    }
  }

  .el-dialog__body {
    .webhook-config__body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .webhook-config__url,
      .webhook-config__list {
        display: flex;
        flex-direction: column;
        gap: 8px;

        main {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        footer {
          display: flex;
          justify-content: center;
        }
      }

      .webhook-config__tipo-disputa {
        text-align: center;
      }
    }
  }
}
</style>
