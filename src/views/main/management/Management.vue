<template>
  <JusViewMain class="view-management">
    <template slot="title">
      <h1>Gerenciamento</h1>
      <!-- <div class="view-management__carousel-container">
        <owl-carousel
          :items="2"
          :nav="true"
          :dots="false"
          :loop="true"
          :rewind="false"
          :margin="20"
          :nav-text="carouselIcons()"
          class="view-management__carousel-slider">
          <el-card class="view-management__info-card el-card--bg-secondary" shadow="never">
            10% das suas contrapropostas foram aceitas
            <el-button type="transparent">Ver casos</el-button>
          </el-card>
          <el-card class="view-management__info-card el-card--bg-primary" shadow="never">
            Você possui casos que precisam da sua revisão
            <el-button type="transparent" @click="$router.push('management/review')">Resolver</el-button>
          </el-card>
          <el-card class="view-management__info-card el-card--bg-primary" shadow="never">
            Você possui casos que precisam da sua revisão
            <el-button type="transparent">Resolver</el-button>
          </el-card>
        </owl-carousel>
      </div> -->
    </template>
    <template slot="main">
      <div :class="{'active': multiActive}" class="view-management__multi-actions">
        Casos selecionados: {{ selectedIds.length }}
        <div>
          <el-button plain @click="sendBatchAction('ACCEPTED')">Ganhar</el-button>
          <el-button plain @click="sendBatchAction('REFUSED')">Perder</el-button>
          <el-button plain @click="sendBatchAction('PAUSED')">Parar</el-button>
          <el-button plain @click="sendBatchAction('RESUME')">Reiniciar</el-button>
          <el-button plain @click="sendBatchAction('DELETE')">Excluir</el-button>
          <el-button plain @click="sendBatchAction('RESTART_ENGAGEMENT')">Reiniciar engajamento</el-button>
          <!-- <el-button plain @click="sendBatchAction('CHANGE_NEGOTIATOR')">Alterar responsável</el-button> -->
          <!-- <el-button plain @click="sendBatchAction('CHANGE_CAMPAIGN')">Alterar campanha</el-button> -->
        </div>
        <i class="el-icon-close" @click="clearSelection()"/>
      </div>
      <div class="view-management__actions">
        <el-button
          :plain="!Object.keys(filters).length"
          :type="Object.keys(filters).length ? 'primary' : ''"
          @click="showFilters = true">
          <jus-icon :is-white="Object.keys(filters).length !== 0" icon="filter" />
          Filtrar
        </el-button>
        <el-button plain>
          Exportar casos
        </el-button>
      </div>
      <el-tabs
        v-loading="$store.state.loading"
        ref="management-tabs"
        :before-leave="handleChangeTab"
        :value="0"
        class="view-management__tabs"
        style="min-height: 100%;">
        <el-tab-pane name="0" label="Engajamento">
          <!-- TABELA DE ENGAJAMENTO -->
          <el-table
            ref="engagementTable"
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
              <template slot-scope="scope">{{ scope.row._source.campaignname }}</template>
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
                  <span v-for="(claimant, index) in scope.row._source.claiments" slot="reference" :key="claimant + index">
                    {{ claimant.f1 }}
                  </span>
                  <ul>
                    <li v-for="(claimant, index) in scope.row._source.claiments" :key="claimant + index">
                      {{ claimant.f1 }}
                    </li>
                  </ul>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              label="Advogado(s) da parte"
              width="175px"
              class-name="fixed-width"
              label-class-name="fixed-width">
              <template slot-scope="scope">
                <el-popover
                  title="Advogados da parte"
                  trigger="hover">
                  <span v-for="(lawyer, index) in scope.row._source.claimentslawyer" slot="reference" :key="lawyer + index">
                    {{ lawyer.f1 }}
                  </span>
                  <ul>
                    <li v-for="(lawyer, index) in scope.row._source.claimentslawyer" :key="lawyer + index">
                      {{ lawyer.f1 }}
                    </li>
                  </ul>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="Alçada máxima">
              <template slot-scope="scope">R$ {{ scope.row._source.disputeobjectboundary }}</template>
            </el-table-column>
            <el-table-column label="Valor proposto">
              <template slot-scope="scope">R$ {{ scope.row._source.disputedealvalue }}</template>
            </el-table-column>
            <el-table-column label="Fim da negociação">
              <template slot-scope="scope">{{ scope.row._source.disputedealdate | moment('DD/MM/YY') }}</template>
            </el-table-column>
            <el-table-column label="Msgs enviadas">
              <template slot-scope="scope">
                <span v-if="!scope.row._source.communicationmsgtotalsent && !scope.row._source.communicationmsgtotalschedulled">
                  Enriquecendo
                </span>
                <span v-else>
                  {{ scope.row._source.communicationmsgtotalsent }} /
                  {{ scope.row._source.communicationmsgtotalschedulled }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="Ações"
              class-name="view-management__row-actions"
              width="90px"
              align="center">
              <template slot-scope="scope">
                <el-popover trigger="hover">
                  <div>
                    <strong>Responsáveis:</strong><br>
                    <span v-for="(negotiator, index) in scope.row._source.negotiators" :key="negotiator.f1 + index">
                      {{ negotiator.f1 }}
                    </span>
                  </div>
                  <br>
                  <div>
                    <strong>Estratégia:</strong><br>
                    {{ scope.row._source.strategyname }}
                  </div>
                  <jus-icon slot="reference" icon="more-info" />
                </el-popover>
                <el-tooltip content="Visualizar caso">
                  <router-link :to="{ name: 'case', params: {id: scope.row._source.disputeid} }">
                    <jus-icon icon="open-case" />
                  </router-link>
                </el-tooltip>
              </template>
            </el-table-column>
            <template slot="empty">
              <jus-icon icon="empty-screen-filter" class="view-management__empty-table"/>
              <h4 style="font-weight: normal">Não foram encontrados casos para<br>os filtros e aba selecionados.</h4>
            </template>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="1" label="Com interação">
          <!-- TABELA COM INTERAÇÃO -->
          <el-table
            ref="interationTable"
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
              <template slot-scope="scope">{{ scope.row._source.campaignname }}</template>
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
                  <span v-for="(claimant, index) in scope.row._source.claiments" slot="reference" :key="claimant + index">
                    {{ claimant.f1 }}
                  </span>
                  <ul>
                    <li v-for="(claimant, index) in scope.row._source.claiments" :key="claimant + index">
                      {{ claimant.f1 }}
                    </li>
                  </ul>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              label="Advogado(s) da parte"
              width="175px"
              class-name="fixed-width"
              label-class-name="fixed-width">
              <template slot-scope="scope">
                <el-popover
                  title="Advogados da parte"
                  trigger="hover">
                  <span v-for="(lawyer, index) in scope.row._source.claimentslawyer" slot="reference" :key="lawyer + index">
                    {{ lawyer.f1 }}
                  </span>
                  <ul>
                    <li v-for="(lawyer, index) in scope.row._source.claimentslawyer" :key="lawyer + index">
                      {{ lawyer.f1 }}
                    </li>
                  </ul>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="Alçada máxima">
              <template slot-scope="scope">R$ {{ scope.row._source.disputeobjectboundary }}</template>
            </el-table-column>
            <el-table-column label="Contraproposta">
              <template slot-scope="scope">R$ {{ scope.row._source.lastoffervalue }}</template>
            </el-table-column>
            <el-table-column label="Última interação">
              <template slot-scope="scope">{{ scope.row._source.lastinteractiondate | moment('DD/MM/YY') }}</template>
            </el-table-column>
            <el-table-column label="Fim da negociação">
              <template slot-scope="scope">
                {{ scope.row._source.disputedealdate | moment('DD/MM/YY') }}
              </template>
            </el-table-column>
            <el-table-column
              label="Ações"
              class-name="view-management__row-actions"
              width="90px"
              align="center">
              <template slot-scope="scope">
                <el-popover trigger="hover">
                  <div>
                    <strong>Responsáveis:</strong><br>
                    <span v-for="(negotiator, index) in scope.row._source.negotiators" :key="negotiator.f1 + index">
                      {{ negotiator.f1 }}
                    </span>
                  </div>
                  <br>
                  <div>
                    <strong>Estratégia:</strong><br>
                    {{ scope.row._source.strategyname }}
                  </div>
                  <jus-icon slot="reference" icon="more-info" />
                </el-popover>
                <el-tooltip content="Visualizar caso">
                  <router-link :to="{ name: 'case', params: {id: scope.row._source.disputeid} }">
                    <jus-icon icon="open-case" />
                  </router-link>
                </el-tooltip>
              </template>
            </el-table-column>
            <template slot="empty">
              <jus-icon icon="empty-screen-filter" class="view-management__empty-table"/>
              <h4 style="font-weight: normal">Não foram encontrados casos para<br>os filtros e aba selecionados.</h4>
            </template>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="2" label="Novos Acordos">
          <!-- NOVOS ACORDOS -->
          <el-table
            ref="newAgreementsTable"
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
              <template slot-scope="scope">{{ scope.row._source.campaignname }}</template>
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
                  <span v-for="(claimant, index) in scope.row._source.claiments" slot="reference" :key="claimant + index">
                    {{ claimant.f1 }}
                  </span>
                  <ul>
                    <li v-for="(claimant, index) in scope.row._source.claiments" :key="claimant + index">
                      {{ claimant.f1 }}
                    </li>
                  </ul>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              label="Advogado(s) da parte"
              width="175px"
              class-name="fixed-width"
              label-class-name="fixed-width">
              <template slot-scope="scope">
                <el-popover
                  title="Advogados da parte"
                  trigger="hover">
                  <span v-for="(lawyer, index) in scope.row._source.claimentslawyer" slot="reference" :key="lawyer + index">
                    {{ lawyer.f1 }}
                  </span>
                  <ul>
                    <li v-for="(lawyer, index) in scope.row._source.claimentslawyer" :key="lawyer + index">
                      {{ lawyer.f1 }}
                    </li>
                  </ul>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="Alçada máxima">
              <template slot-scope="scope">R$ {{ scope.row._source.disputeobjectboundary }}</template>
            </el-table-column>
            <el-table-column label="Valor do acordo">
              <template slot-scope="scope">{{ scope.row._source.disputedealvalue }}</template>
            </el-table-column>
            <el-table-column
              label="Ações"
              class-name="view-management__row-actions"
              width="90px"
              align="center">
              <template slot-scope="scope">
                <el-popover trigger="hover">
                  <div>
                    <strong>Responsáveis:</strong><br>
                    <span v-for="(negotiator, index) in scope.row._source.negotiators" :key="negotiator.f1 + index">
                      {{ negotiator.f1 }}
                    </span>
                  </div>
                  <br>
                  <div>
                    <strong>Estratégia:</strong><br>
                    {{ scope.row._source.strategyname }}
                  </div>
                  <jus-icon slot="reference" icon="more-info" />
                </el-popover>
                <el-tooltip content="Visualizar caso">
                  <router-link :to="{ name: 'case', params: {id: scope.row._source.disputeid} }">
                    <jus-icon icon="open-case" />
                  </router-link>
                </el-tooltip>
              </template>
            </el-table-column>
            <template slot="empty">
              <jus-icon icon="empty-screen-filter" class="view-management__empty-table"/>
              <h4 style="font-weight: normal">Não foram encontrados casos para<br>os filtros e aba selecionados.</h4>
            </template>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="3" label="Todos">
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
              <template slot-scope="scope">{{ scope.row._source.campaignname }}</template>
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
                  <span v-for="(claimant, index) in scope.row._source.claiments" slot="reference" :key="claimant + index">
                    {{ claimant.f1 }}
                  </span>
                  <ul>
                    <li v-for="(claimant, index) in scope.row._source.claiments" :key="claimant + index">
                      {{ claimant.f1 }}
                    </li>
                  </ul>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="Nº do caso">
              <template slot-scope="scope">{{ scope.row._source.disputecode }}</template>
            </el-table-column>
            <el-table-column label="Estratégia">
              <template slot-scope="scope">{{ scope.row._source.strategyname }}</template>
            </el-table-column>
            <el-table-column label="Status">
              <template v-if="scope.row._source.disputestatus" slot-scope="scope">
                {{ $t('occurrence.type.' + scope.row._source.disputestatus) }}
              </template>
            </el-table-column>
            <el-table-column
              label="Ações"
              class-name="view-management__row-actions"
              width="90px"
              align="center">
              <template slot-scope="scope">
                <el-popover trigger="hover">
                  <div>
                    <strong>Responsáveis:</strong><br>
                    <span v-for="(negotiator, index) in scope.row._source.negotiators" :key="negotiator.f1 + index">
                      {{ negotiator.f1 }}
                    </span>
                  </div>
                  <br>
                  <div>
                    <strong>Estratégia:</strong><br>
                    {{ scope.row._source.strategyname }}
                  </div>
                  <jus-icon slot="reference" icon="more-info" />
                </el-popover>
                <el-tooltip content="Visualizar caso">
                  <router-link :to="{ name: 'case', params: {id: scope.row._source.disputeid} }">
                    <jus-icon icon="open-case" />
                  </router-link>
                </el-tooltip>
              </template>
            </el-table-column>
            <template slot="empty">
              <jus-icon icon="empty-screen-filter" class="view-management__empty-table"/>
              <h4 style="font-weight: normal">Não foram encontrados casos para<br>os filtros e aba selecionados.</h4>
            </template>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-dialog :visible.sync="showFilters" @open="restoreFilters()">
        <template slot="title">
          <h2>Filtrar {{ activeTab.label }}</h2>
        </template>
        <jus-management-filters
          :tab-index="activeTab.index"
          :filters.sync="activeFilters"/>
        <span slot="footer">
          <el-button plain @click="clearFilters()">Limpar filtros</el-button>
          <el-button
            type="primary"
            @click="applyFilters()">
            Aplicar filtros
          </el-button>
        </span>
      </el-dialog>
    </template>
  </JusViewMain>
</template>

<script>
import OwlCarousel from 'vue-owl-carousel'
import JusManagementFilters from '@/components/others/JusManagementFilters'

export default {
  name: 'Management',
  components: {
    OwlCarousel,
    JusManagementFilters
  },
  data () {
    return {
      showFilters: false,
      cases: [],
      selectedIds: [],
      activeTab: {},
      filters: {},
      activeFilters: {}
    }
  },
  computed: {
    multiActive () {
      return this.selectedIds.length > 1
    }
  },
  methods: {
    getCases () {
      this.$store.dispatch('showLoading')
      this.cases = []
      this.$store.dispatch('getDisputes', this.buildQuery()).then(response => {
        this.$store.dispatch('hideLoading')
        this.cases = response.hits.hits
      })
    },
    buildQuery () {
      let query = { query: { bool: { must: [] } }, from: 0, size : 3000 }
      query.query.bool.must.push(
        { match: { workspaceid: this.$store.state.workspaceModule.id } }
      )
      if (this.activeTab.match) {
        for (let match of this.activeTab.match) {
          query.query.bool.must.push(
            { match: match }
          )
        }
      }
      Object.keys(this.filters).forEach(key => {
        let match = {}
        if (this.filters[key]) {
          match[key] = this.filters[key]
          query.query.bool.must.push({ match: match })
        }
      })
      return query.query.bool.must.length > 0 ? query : null
    },
    applyFilters () {
      this.showFilters = false
      this.filters = JSON.parse(JSON.stringify(this.activeFilters))
      this.getCases()
    },
    restoreFilters () {
      this.activeFilters = JSON.parse(JSON.stringify(this.filters))
    },
    clearSelection () {
      if (this.$refs.engagementTable) this.$refs.engagementTable.clearSelection()
      if (this.$refs.interationTable) this.$refs.interationTable.clearSelection()
      if (this.$refs.newAgreementsTable) this.$refs.newAgreementsTable.clearSelection()
      if (this.$refs.allTable) this.$refs.allTable.clearSelection()
    },
    handleSelectionChange (selected) {
      this.selectedIds = []
      for (let dispute of selected) {
        if (dispute._source && dispute._source.disputeid) {
          this.selectedIds.push(dispute._source.disputeid)
        }
      }
    },
    carouselIcons () {
      let prevIcon = require('@/assets/icons/ic-left.svg')
      let nextIcon = require('@/assets/icons/ic-right.svg')
      return ['<img src="' + prevIcon + '">', '<img src="' + nextIcon + '">']
    },
    setActiveTabLabel (newTab) {
      var newActive
      switch (newTab) {
        case '0':
          newActive = { index: 0, label: 'Engajamento', match: [{ disputestatus: 'ENGAGEMENT' }] }
          break
        case '1':
          newActive = { index: 1, label: 'Com interação', match: [{ disputestatus: 'ENGAGEMENT' }, { disputehasinteractions: true }] }
          break
        case '2':
          newActive = { index: 2, label: 'Novos acordos', match: [{ disputestatus: 'ACCEPTED' }] }
          break
        case '3':
          newActive = { index: 3, label: 'Todos' }
          break
        default:
          newActive = { index: 0, label: 'Engajamento', match: [{ disputestatus: 'ENGAGEMENT' }] }
      }
      this.activeTab = newActive
    },
    handleChangeTab (newTab, oldTab) {
      this.clearSelection()
      this.setActiveTabLabel(newTab)
      this.getCases()
      this.filters = {}
    },
    clearFilters () {
      this.showFilters = false
      this.filters = {}
      this.getCases()
    },
    sendBatchAction (action) {
      this.$confirm('Tem certeza que deseja realizar essa ação?', 'Atenção!', {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('sendBatchAction', {
          type: action, disputeIds: this.selectedIds
        }).then(response => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Ação ' + this.$t('action.' + action) + ' realizada com sucesso.',
            type: 'success'
          })
        })
      })
    }
  }
}
</script>

<style lang="scss">
.view-management {
  &__carousel-container{
    width: 67%;
    display: flex;
    align-items: center;
    > span {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 20px;
      width: 20px;
      font-size: 1.4rem;
      color: #adadad;
    }
    .owl-nav {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0px -31px 0 -41px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .owl-stage-outer {
      border-radius: 5px;
      z-index: 1;
    }
    .owl-prev, .owl-next {
      background: transparent !important;
    }
  }
  &__carousel-slider {
    width: calc(100% - 40px);
    margin: 0 10px;
  }
  &__interactionType-icon {
    margin-right: 10px;
  }
  &__tabs {
    .el-table__header {
      .fixed-width {
        .cell {
          width: 175px;
        }
      }
    }
    .el-table__body {
      .fixed-width {
        .cell {
          width: 175px;
          white-space: nowrap;
        }
      }
      .cell {
        text-transform: capitalize;
        &.names {
          max-width: 158px;
        }
      }
    }
    .el-tabs__header {
      width: fit-content;
      padding: 0 20px;
      margin: 0 0 35px;
    }
  }
  &__actions {
    display: inline-flex;
    position: absolute;
    right: 318px;
    right: 20px;
    top: 20px;
    .el-button {
      line-height: 14px;
      padding: 8px 18px;
    }
    img {
      vertical-align: sub;
      width: 14px;
    }
  }
  .view-management__info-card {
    width: 100%;
    font-weight: 300;
    height: 74px;
    + .view-management__info-card {
      margin-left: 20px;
    }
    .el-card__body {
      padding: 0px 20px;
      padding: 16px;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .el-button {
      margin-left: 20px;
      max-width: 100px;
    }
  }
  .jus-main-view__main-card > .el-card__body {
    position: relative;
    height: 100%;
    padding: 20px 0;
  }
  .el-carousel {
    width: 65%;
  }
  .el-carousel__item {
    display: flex;
  }
  > div:first-child {
    // display: flex;
    // align-items: center;
    // justify-content: space-between;
  }
  .el-tabs__active-bar {
    width: 97px;
  }
  &__multi-actions {
    position: absolute;
    background-color: #fff;
    width: 100%;
    z-index: 3;
    padding: 0 20px;
    transition: all 0.5s ease;
    box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.12);
    border-bottom: solid 1px #e4e8ea;
    display: flex;
    justify-content:space-between;
    align-items: center;
    margin-top: -44px;
    transform: translateY(-100%);
    div {
      display: flex;
    }
    &.active {
      margin-top: -20px;
      transform: translateY(0%);
    }
    i {
      cursor: pointer;
      text-align: right;
    }
    button {
      height: 68px;
      padding: 8px 20px;
      border: 0;
      border-radius: 0;
      &:hover {
        background-color: #fafafa !important;
      }
    }
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #fff;
  }
  &__row-actions {
    img {
      width: 20px;
      vertical-align: middle;
    }
    span + a {
      margin-left: 8px;
    }
  }
  &__empty-table {
    margin-top: 40px;
    width: 60px;
  }
}
</style>
