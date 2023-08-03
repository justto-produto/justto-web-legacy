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
          <el-table
            :data="webhooks"
            class="w100"
          >
            <el-table-column type="expand">
              <el-row
                slot-scope="props"
                :gutter="20"
              >
                <el-col
                  v-if="!Object.keys(props.row).includes('authType')"
                  :offset="1"
                  :span="23"
                >
                  Autenticação não definida.
                </el-col>

                <el-col
                  v-else
                  :offset="1"
                  :span="23"
                >
                  <el-row>
                    <el-col>
                      {{ $tc(`configurations.authorization.type.${props.row.authType}`) }}
                    </el-col>

                    <el-col v-if="props.row.username">
                      Username:
                      <el-tag size="mini">
                        {{ props.row.username }}
                      </el-tag>
                    </el-col>

                    <el-col v-if="props.row.username">
                      Senha:
                      <el-tag size="mini">
                        {{ '*'.repeat(props.row.password.length) }}
                      </el-tag>
                    </el-col>

                    <el-col v-if="props.row.token">
                      Token:
                      <el-tag size="mini">
                        {{ props.row.token }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-table-column>

            <el-table-column
              label="URL"
              prop="url"
            />

            <el-table-column
              fixed="right"
              width="135"
            >
              <span slot="header">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-plus"
                  class="float-right"
                  @click="handleAddWebhook"
                >
                  Adicionar
                </el-button>
              </span>

              <span slot-scope="scope">
                <span
                  class="is-pointer float-right"
                  @click="handleRemoveWebhook(scope.$index)"
                >
                  <i class="el-icon-delete" />
                </span>
              </span>
            </el-table-column>
          </el-table>
        </main>
      </div>
    </article>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="close">Voltar</el-button>
    </span>

    <DialogAdicionarWebhook ref="adicionarWebhook" />
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { copyToClipboard } from '@/utils'

export default {
  components: {
    DialogAdicionarWebhook: () => import('./partials/DialogAdicionarWebhook')
  },

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
      this.$refs.adicionarWebhook.open(webhook => {
        this.handleSaveWebhooks([...this.webhooks, webhook])
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
