<template>
  <JusViewMain class="view-management-review view-management">
    <template slot="title">
      <h1 class="ticket-view__title">
        <router-link to="/management">
          <jus-icon icon="back" />
        </router-link>
        {{ slide.title }}
      </h1>
    </template>
    <template slot="actions">
      <div :class="{'active': multiActive}" class="view-management__multi-actions">
        Casos selecionados: {{ selectedIds.length }}
        <div>
          <el-button plain @click="sendBatchAction('SETTLED')">{{ $t('action.SETTLED') }}</el-button>
          <el-button plain @click="sendBatchAction('UNSETTLED')">{{ $t('action.UNSETTLED') }}</el-button>
          <el-button plain @click="sendBatchAction('PAUSED')">{{ $t('action.PAUSED') }}</el-button>
          <el-button plain @click="sendBatchAction('RESUME')">{{ $t('action.RESUME') }}</el-button>
          <el-button plain @click="sendBatchAction('DELETE')">{{ $t('action.DELETE') }}</el-button>
          <el-button plain @click="sendBatchAction('RESTART_ENGAGEMENT')">{{ $t('action.RESTART_ENGAGEMENT') }}</el-button>
          <!-- <el-button plain @click="sendBatchAction('CHANGE_NEGOTIATOR')">Alterar responsável</el-button> -->
          <!-- <el-button plain @click="sendBatchAction('CHANGE_CAMPAIGN')">Alterar campanha</el-button> -->
        </div>
        <i class="el-icon-close" @click="clearSelection()"/>
      </div>
    </template>
    <template slot="main">
      <div :class="{'batch-active': multiActive}" class="view-management-review__cases">
        <el-table
          ref="allTable"
          :data="cases"
          size="small"
          class="el-table--card"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" />
          <el-table-column
            label="Campanha"
            width="175px"
            class-name="fixed-width"
            label-class-name="fixed-width">
            <template slot-scope="scope">{{ scope.row.campaignname }}</template>
          </el-table-column>
          <el-table-column
            label="Parte(s) contrária(s)"
            width="175px"
            class-name="fixed-width"
            label-class-name="fixed-width">
            <template slot-scope="scope">
              <el-popover
                title="Partes contrárias"
                trigger="hover">
                <div v-for="(claimant, index) in scope.row.claiments" slot="reference" :key="claimant + index">
                  {{ claimant.name }}
                </div>
                <ul>
                  <li v-for="(claimant, index) in scope.row.claiments" :key="claimant + index">
                    {{ claimant.name }}
                  </li>
                </ul>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="Nº do caso">
            <template slot-scope="scope">{{ scope.row.disputecode }}</template>
          </el-table-column>
          <el-table-column label="Estratégia">
            <template slot-scope="scope">{{ scope.row.strategyname }}</template>
          </el-table-column>
          <el-table-column label="Status">
            <template v-if="scope.row.disputestatus" slot-scope="scope">
              {{ $t('occurrence.type.' + scope.row.disputestatus) }}
            </template>
          </el-table-column>
          <el-table-column
            label="Ações"
            class-name="view-management__row-actions"
            width="110px"
            align="center">
            <template slot-scope="scope">
              <el-popover trigger="hover">
                <div>
                  <strong>Responsáveis:</strong><br>
                  <span v-for="(negotiator, index) in scope.row.negotiators" :key="negotiator.f1 + index">
                    {{ negotiator.f1 }}
                  </span>
                </div>
                <br>
                <div>
                  <strong>Estratégia:</strong><br>
                  {{ scope.row.strategyname }}
                </div>
                <jus-icon slot="reference" icon="more-info" />
              </el-popover>
              <el-tooltip content="Visualizar caso">
                <router-link :to="{ name: 'case', params: {id: scope.row.disputeid} }">
                  <jus-icon icon="open-case" style="margin-left: 10px;" />
                </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <template v-if="!$store.state.loading" slot="empty">
            <jus-icon icon="empty-screen-filter" class="view-management__empty-table"/>
            <h4 style="font-weight: normal">Não foram encontrados casos para<br>os filtros e aba selecionados.</h4>
          </template>
        </el-table>
      </div>
    </template>
  </JusViewMain>
</template>

<script>
export default {
  name: 'Review',
  data () {
    return {
      cases: [],
      selectedIds: []
    }
  },
  computed: {
    slide () {
      return this.$route.params.slide
    },
    multiActive () {
      return this.selectedIds.length >= 1
    }
  },
  beforeCreate () {
    if (!this.$route.params.slide) {
      this.$router.push('/management')
    }
  },
  beforeMount () {
    this.$store.dispatch('showLoading')
    this.cases = []
    let query = { query: { bool: { must: this.slide.must } }, from: 0, size: 3000, order_by: 'favorite DESC' }
    this.$store.dispatch('getDisputes', query).then(response => {
      this.cases = response
    }).catch(() => {
      this.$jusNotification({ type: 'error' })
    }).finally(() => {
      this.$store.dispatch('hideLoading')
    })
  },
  methods: {
    handleSelectionChange (selected) {
      this.selectedIds = []
      for (let dispute of selected) {
        if (dispute && dispute.disputeid) {
          this.selectedIds.push(dispute.disputeid)
        }
      }
    },
    clearSelection () {
      if (this.$refs.allTable) this.$refs.allTable.clearSelection()
    },
    sendBatchAction (action) {
      this.$confirm('Tem certeza que deseja realizar esta ação?', 'Atenção!', {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('sendBatchAction', {
          type: action,
          disputeIds: this.selectedIds
        }).then(response => {
          let self = this
          this.$jusNotification({
            title: 'Yay!',
            message: 'Ação ' + this.$t('action.' + action) + ' realizada com sucesso.',
            type: 'success',
            onClose () {
              setTimeout(function () {
                self.$jusNotification({
                  title: 'Fique atento!',
                  message: `Algumas ações em lote podem demorar até serem executadas em nosso sistema.
                  Caso sua ação ainda não tenha refletido em seus casos, aguarde um pouco mais e utilize o botão de atualizar os casos.`,
                  type: 'info',
                  duration: 0
                })
              }, 300)
            }
          })
        }).catch(() => {
          this.$jusNotification({ type: 'error' })
        })
      })
    }
  }
}
</script>

<style lang="scss">
.view-management-review {
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #fff;
  }
  &__cases {
    transition: ease .5s padding;
    &.batch-active {
      padding-top: 60px;
    }
  }
}
</style>
