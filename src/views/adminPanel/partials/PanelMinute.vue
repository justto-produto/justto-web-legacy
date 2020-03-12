<template lang="html">
  <div class="panel-minute-view">
    <el-table v-loading="loadingMinutes" :data="filteredMinutes" width="100%">
      <el-table-column prop="name" label="Nome"/>
      <el-table-column align="right" width="400px">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            placeholder="Buscar"/>
          <el-button type="primary" icon="el-icon-plus" @click="addMinute">
            Adicionar
          </el-button>
        </template>
        <template slot-scope="props">
          <el-tooltip v-if="props.row.privateDocumentModel" content="Excluir">
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="deleteMinute(props.row.id)" />
          </el-tooltip>
          <el-tooltip content="Editar">
            <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="editMinute(props.row.url)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="editDialogVisible" title="Editar minuta">
      <iframe :src="editDialogUrl" />
      <el-card shadow="never" class="panel-minute-view__tips">
        <h2>Variáveis disponíveis</h2>
        <span v-pre class="list">
          <div>
            <span>Nome do autor</span>
            <!-- eslint-disable-next-line -->
            <div>{{CLAIMANT}}</div>
          </div>
          <div>
            <span>Nome do réu</span>
            <!-- eslint-disable-next-line -->
            <div>{{RESPONDENT}}</div>
          </div>
          <div>
            <span>Nome do negociador</span>
            <!-- eslint-disable-next-line -->
            <div>{{NEGOTIATOR_NAME}}</div>
          </div>
          <div>
            <span>Data na assinatura do contrato</span>
            <!-- eslint-disable-next-line -->
            <div>{{SIGN_DATE}}</div>
          </div>
          <div>
            <span>Cidade na assinatura do contrato</span>
            <!-- eslint-disable-next-line -->
            <div>{{SIGN_CITY}}</div>
          </div>
          <div>
            <span>Nome do banco para depósito</span>
            <!-- eslint-disable-next-line -->
            <div>{{BANK_NAME}}</div>
          </div>
          <div>
            <span>Agência do banco para depósito</span>
            <!-- eslint-disable-next-line -->
            <div>{{BANK_AGENCY}}</div>
          </div>
          <div>
            <span>Conta bancária para depósito</span>
            <!-- eslint-disable-next-line -->
            <div>{{BANK_ACCOUNT}}</div>
          </div>
          <div>
            <span>Nome do favorecido para depósito</span>
            <!-- eslint-disable-next-line -->
            <div>{{BANK_DEPOSIT_NAME}}</div>
          </div>
          <div>
            <span>Documento do favorecido para depósito</span>
            <!-- eslint-disable-next-line -->
            <div>{{BANK_DEPOSIT_DOCUMENT}}</div>
          </div>
          <div>
            <span>Dias para depósito</span>
            <!-- eslint-disable-next-line -->
            <div>{{DAYS_TO_DEPOSIT}}</div>
          </div>
          <div>
            <span>Valor a ser depositado (valor do acordo)</span>
            <!-- eslint-disable-next-line -->
            <div>{{VALUE_TO_DEPOSIT}}</div>
          </div>
          <div>
            <span>Número do processo</span>
            <!-- eslint-disable-next-line -->
            <div>{{DISPUTE_CODE}}</div>
          </div>
          <div>
            <span>Comarca</span>
            <!-- eslint-disable-next-line -->
            <div>{{DISPUTE_ORG}}</div>
          </div>
          <div>
            <span>Nome do advogado do réu</span>
            <!-- eslint-disable-next-line -->
            <div>{{RESPONDENT_LAWYER_NAME}}</div>
          </div>
          <div>
            <span>OAB do advogado do réu</span>
            <!-- eslint-disable-next-line -->
            <div>{{RESPONDENT_LAWYER_OABS}}</div>
          </div>
          <div>
            <span>Nome do advogado da parte</span>
            <!-- eslint-disable-next-line -->
            <div>{{CLAIMANT_LAWYER_NAME}}</div>
          </div>
          <div>
            <span>OAB do advogado da parte</span>
            <!-- eslint-disable-next-line -->
            <div>{{CLAIMANT_LAWYER_OABS}}</div>
          </div>
          <div>
            <span>Nome do assinador eletrônico do documento (ex: jurista, clicksign)</span>
            <!-- eslint-disable-next-line -->
            <div>{{ACTIVE_SIGNER}}</div>
          </div>
        </span>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PanelMinute',
  data () {
    return {
      loadingMinutes: true,
      search: '',
      editDialogVisible: false,
      editDialogUrl: '',
      minutes: []
    }
  },
  computed: {
    filteredMinutes () {
      return this.minutes.filter(minute => {
        if (minute.archived || !minute.name) {
          return false
        }
        return !this.search || minute.name.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  mounted () {
    this.fetchMinutes()
  },
  methods: {
    fetchMinutes () {
      this.loadingMinutes = true
      this.$store.dispatch('getDocumentModels').then(response => {
        this.minutes = response
      }).catch(error => {
        console.error(error)
      }).finally(() => {
        this.loadingMinutes = false
      })
    },
    addMinute () {
      this.$prompt('Insira a URL (Google Docs) do documento:', 'Adicionar minuta', {
        confirmButtonText: 'Adicionar',
        cancelButtonText: 'Cancelar',
        cancelButtonClass: 'is-plain',
        inputPattern: /.*docs\.google\.com.*/,
        inputErrorMessage: 'URL inválida',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$store.dispatch('addModel', instance.inputValue).then(response => {
              this.fetchMinutes()
            }).catch(error => {
              console.error(error)
              this.$jusNotification({
                title: 'Ops!',
                message: 'Houve uma falha ao adicionar minuta. Certifique-se de que o documento adicionado é público.',
                type: 'warning'
              })
            }).finally(() => {
              done()
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
      }).then(({ value }) => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Minuta adicionada com sucesso',
          type: 'success'
        })
      })
    },
    editMinute (url) {
      this.editDialogUrl = url
      this.editDialogVisible = true
    },
    deleteMinute (modelId) {
      this.$confirm('Tem certeza que deseja excluir?', 'Atenção!', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        cancelButtonClass: 'is-plain',
        confirmButtonClass: 'el-button--danger',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$store.dispatch('deleteModel', modelId).then(response => {
              done()
              this.fetchMinutes()
            }).catch(error => {
              console.error(error)
            }).finally(() => {
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
      }).then(() => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Minuta excluída com sucesso',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.panel-minute-view {
  th.is-right .cell {
    display: flex;
  }
  .el-dialog {
    width: calc(100% - 4vh);
    margin-top: 2vh !important;
    margin-bottom: 2vh;
    height: calc(100% - 4vh);
    overflow: auto;
  }
  .el-table::before  {
    content: none;
  }
  .el-dialog__body {
    display: flex;
    padding-bottom: 20px;
    height: calc(100% - 64px);
  }
  iframe {
    width: 100%;
  }
  &__tips {
    border: 0;
    background-color: $--color-secondary-light-9;
    margin-left: 10px;
    width: 360px;
    font-size: 13px;
    overflow-y: auto;
    * {
      border: 0;
    }
    h2 {
      margin-top: 0;
      margin-bottom: 10px;
    }
    .list {
      > div {
        margin-top: 6px;
        div {
          padding-left: 10px;
        }
      }
      display: flex;
      flex-direction: column;
      span {
        font-weight: 600;
      }
    }
  }
}
</style>
