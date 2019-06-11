<template>
  <JusViewMain class="view-management-review view-management">
    <template slot="title">
      <h1 class="ticket-view__title">
        <router-link to="/management">
          <jus-icon icon="back" />
        </router-link>
        {{ slide.title | capitalize }}
      </h1>
    </template>
    <template slot="actions">
      <management-actions
        :active="multiActive"
        :selected-ids="selectedIds"
        @disputes:clear="clearSelection"
      />
    </template>
    <template slot="main">
      <div :class="{'batch-active': multiActive}" class="view-management-review__disputes">
        <el-table
          ref="allTable"
          :data="disputes"
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
              <div v-for="(claimant, index) in scope.row.claiments" slot="reference" :key="claimant + index">
                {{ claimant.name }}
              </div>
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
              {{ $t('occurrence.type.' + scope.row.disputestatus) | capitalize }}
            </template>
          </el-table-column>
          <el-table-column v-if="showReviewColumn" label="Revisar">
            <template slot-scope="scope">
              <div v-for="(item, index) in getDisputeAlerts(scope.row)" :key="item.child_id + item.id + index ">
                <jus-icon :icon="item.type === 'ERROR' ? 'alert' : 'warn'" style="vertical-align: sub;" />
                {{ item.label }}: {{ item.message }}
              </div>
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
                <router-link :to="{ name: 'dispute', params: {id: scope.row.disputeid} }">
                  <jus-icon icon="open-case" style="margin-left: 10px;" />
                </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <template v-if="!$store.state.loading" slot="empty">
            <jus-icon icon="empty-screen-filter" class="view-management__empty-table"/>
            <h4 style="font-weight: normal; line-height: initial;">
              Não foram encontrados casos para<br>os filtros e aba selecionados.
            </h4>
          </template>
        </el-table>
      </div>
    </template>
  </JusViewMain>
</template>

<script>
import ManagementActions from './partials/ManagementActions'

export default {
  name: 'Review',
  components: {
    ManagementActions
  },
  data () {
    return {
      disputes: [],
      selectedIds: []
    }
  },
  computed: {
    slide () {
      return this.$route.params.slide
    },
    multiActive () {
      return this.selectedIds.length >= 1
    },
    showReviewColumn () {
      return this.slide.color === 'purple'
    }
  },
  beforeMount () {
    if (this.$route.params.slide) {
      this.disputes = this.$store.getters[this.slide.id]
    } else {
      this.$router.push('/management')
    }
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
          window.analytics.track('Ação em massa realizada', {
            action: action,
            tab: this.activeTab.label ? this.activeTab.label : this.activeTab.label = 'Engajamento',
            selecteds: this.selectedIds.length
          })
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
                  type: 'info'
                })
              }, 300)
            }
          })
        }).catch(() => {
          this.$jusNotification({ type: 'error' })
        })
      })
    },
    getDisputeAlerts (dispute) {
      let alerts = []
      if (dispute.alerts && dispute.alerts.length) {
        for (let alert of dispute.alerts) {
          alert.f1.label = 'Caso'
          alerts.push(alert.f1)
        }
      }
      if (dispute.claiments && dispute.claiments.length) {
        for (let claimant of dispute.claiments) {
          if (claimant.alerts && claimant.alerts.length) {
            for (let alert of claimant.alerts) {
              alert.label = 'Parte contrária'
              alerts.push(alert)
            }
          }
        }
      }
      if (dispute.claimentslawyer && dispute.claimentslawyer.length) {
        for (let claimant of dispute.claimentslawyer) {
          if (claimant.alerts && claimant.alerts.length) {
            for (let alert of claimant.alerts) {
              alert.label = 'Advogado da parte'
              alerts.push(alert)
            }
          }
        }
      }
      return alerts
    }
  }
}
</script>

<style lang="scss">
.view-management-review {
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #fff;
  }
  &__disputes {
    transition: ease .5s padding;
    &.batch-active {
      padding-top: 60px;
    }
  }
}
</style>
