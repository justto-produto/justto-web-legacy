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
          ref="disputeTable"
          :data="disputes"
          size="mini"
          class="el-table--disputes"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40px" />
          <el-table-column type="expand" width="40px">
            <template slot-scope="props">
              <jus-dispute-resume :dispute="props.row" />
            </template>
          </el-table-column>
          <el-table-column label="Disputa" min-width="70px">
            <template slot-scope="scope">#{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column label="Campanha" min-width="90px">
            <template slot-scope="scope">{{ scope.row.campaign.name | capitalize }}</template>
          </el-table-column>
          <el-table-column min-width="140px" class-name="text-ellipsis" label="Parte(s) contrária(s)">
            <template slot-scope="scope">
              {{ getClaimants(scope.row.disputeRoles, 'CLAIMANT', 'PARTY') }}
            </template>
          </el-table-column>
          <el-table-column class-name="text-ellipsis" label="Advogado(s) da parte" min-width="152px">
            <template slot-scope="scope">
              {{ getClaimants(scope.row.disputeRoles, 'CLAIMANT', 'LAWYER') }}
            </template>
          </el-table-column>
          <el-table-column label="Status" align="center" min-width="110px">
            <template slot-scope="scope">
              {{ $t('occurrence.type.' + scope.row.status) | capitalize }}
            </template>
          </el-table-column>
          <el-table-column v-if="showReviewColumn" label="Alertas">
            <template slot-scope="scope">
              <el-tooltip content="Expanda as informações da disputa para visualizar os detalhes dos alertas">
                <div>
                  <jus-icon icon="warn" style="vertical-align: sub;" />
                  ({{ getDisputeAlerts(scope.row).length }})
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            width="50px"
            class-name="view-management__row-actions"
            align="center">
            <template slot-scope="scope">
              <el-tooltip content="Abrir disputa em uma nova aba">
                <el-button
                  type="text"
                  @click="openNewTab(scope.row.id)">
                  <jus-icon icon="external-link" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <template v-if="!$store.state.loading" slot="empty">
            <jus-icon icon="empty-screen-filter" class="view-management__empty-table"/>
            <h4 style="font-weight: normal; line-height: initial;">
              Não foram encontradas disputas para<br>os filtros e aba selecionados.
            </h4>
          </template>
        </el-table>
      </div>
    </template>
  </JusViewMain>
</template>

<script>
import ManagementActions from './partials/ManagementActions'
import JusDisputeResume from '@/components/layouts/JusDisputeResume'
import { getFirstRole } from '@/plugins/jusUtils'

export default {
  name: 'Review',
  components: {
    ManagementActions,
    JusDisputeResume
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
        if (dispute && dispute.id) {
          this.selectedIds.push(dispute.id)
        }
      }
    },
    clearSelection () {
      if (this.$refs.allTable) this.$refs.allTable.clearSelection()
    },
    getLastInteraction (lastinteractiondate) {
      let date = this.$moment(lastinteractiondate)
      if (date.isValid()) {
        let now = this.$moment()
        if (now.diff(date, 'seconds') < 59) {
          return now.diff(date, 'seconds') + ' segundos'
        } else if (now.diff(date, 'minutes') < 59) {
          return now.diff(date, 'minutes') + ' minuto(s)'
        } else if (now.diff(date, 'hours') < 24) {
          return now.diff(date, 'hours') + ' hora(s)'
        } else if (now.diff(date, 'hours') < 48) {
          return '1 dia'
        } else {
          return date.format('DD/MM/YY')
        }
      }
      return ''
    },
    handleRowClick (row, column, event) {
      if (row.id && event.target.tagName !== 'IMG') {
        this.$router.push({ name: 'dispute', params: { id: row.id } })
      }
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
    openNewTab (disputeId) {
      let routeData = this.$router.resolve({ name: 'dispute', params: { id: disputeId } })
      window.open(routeData.href, '_blank')
    },
    getDisputeAlerts (dispute) {
      let alerts = []
      if (dispute.alerts && dispute.alerts.length) {
        for (let alert of dispute.alerts) {
          if (alert.f1) {
            alert.f1.label = 'Disputa'
            alerts.push(alert.f1)
          }
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
    },
    getClaimants (disputeRoles, party, role) {
      return getFirstRole(disputeRoles, party, role)
    }
    // getOnlyErrors (alerts) {
    //   return alerts.filter(alert => {
    //     return alert.type === 'ERROR'
    //   })
    // },
    // getOnlyWarns (alerts) {
    //   return alerts.filter(alert => {
    //     return alert.type === 'WARN'
    //   })
    // }
  }
}
</script>

<style lang="scss">
.view-management-review {
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    // background-color: #fff;
  }
  &__disputes {
    transition: ease .5s padding;
    &.batch-active {
      padding-top: 60px;
    }
  }
}
</style>
