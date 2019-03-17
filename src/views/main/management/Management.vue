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
          icon="el-icon-refresh"
          plain
          @click="refresh">
          Atualizar
        </el-button>
        <el-button
          :plain="!Object.keys(filters).length"
          :type="Object.keys(filters).length ? 'primary' : ''"
          @click="showFilters = true">
          <jus-icon :is-white="Object.keys(filters).length !== 0" icon="filter" />
          Filtrar
        </el-button>
        <el-button
          :loading="loadingExport"
          :disabled="cases.length === 0"
          plain
          icon="el-icon-download"
          @click="exportDisputes">
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
                  <span v-for="(claimant, index) in scope.row.claiments" slot="reference" :key="claimant + index">
                    {{ claimant.f1 }}
                  </span>
                  <ul>
                    <li v-for="(claimant, index) in scope.row.claiments" :key="claimant + index">
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
                  <span v-for="(lawyer, index) in scope.row.claimentslawyer" slot="reference" :key="lawyer + index">
                    {{ lawyer.f1 }}
                  </span>
                  <ul>
                    <li v-for="(lawyer, index) in scope.row.claimentslawyer" :key="lawyer + index">
                      {{ lawyer.f1 }}
                    </li>
                  </ul>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="Alçada máxima">
              <template slot-scope="scope">R$ {{ scope.row.disputeupperrange }}</template>
            </el-table-column>
            <el-table-column label="Valor proposto">
              <template slot-scope="scope">R$ {{ scope.row.disputelastrespondentoffer }}</template>
            </el-table-column>
            <el-table-column label="Fim da negociação">
              <template slot-scope="scope">{{ scope.row.disputeexpirationdate | moment('DD/MM/YY') }}</template>
            </el-table-column>
            <el-table-column label="Msgs enviadas">
              <template slot-scope="scope">
                <span v-if="!scope.row.communicationmsgtotalsent && !scope.row.communicationmsgtotalschedulled">
                  Enriquecendo
                </span>
                <span v-else>
                  {{ scope.row.communicationmsgtotalsent }} /
                  {{ scope.row.communicationmsgtotalschedulled }}
                </span>
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
                <el-tooltip :content="scope.row.favorite ? 'Desmarcar como favorito' : 'Marcar como favorito'">
                  <el-button
                    type="text"
                    class="favorite"
                    @click="setFavorite(scope.row.favorite ? 'disfavor' : 'favorite', scope.row.disputeid, 'ENGAJAMENTO')">
                    <jus-icon :icon="scope.row.favorite ? 'golden-star' : 'star'" />
                  </el-button>
                </el-tooltip>
                <el-tooltip content="Visualizar caso">
                  <router-link :to="{ name: 'case', params: { id: scope.row.disputeid } }">
                    <jus-icon icon="open-case" />
                  </router-link>
                </el-tooltip>
              </template>
            </el-table-column>
            <template v-if="!$store.state.loading" slot="empty">
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
                  <span v-for="(claimant, index) in scope.row.claiments" slot="reference" :key="claimant + index">
                    {{ claimant.f1 }}
                  </span>
                  <ul>
                    <li v-for="(claimant, index) in scope.row.claiments" :key="claimant + index">
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
                  <span v-for="(lawyer, index) in scope.row.claimentslawyer" slot="reference" :key="lawyer + index">
                    {{ lawyer.f1 }}
                  </span>
                  <ul>
                    <li v-for="(lawyer, index) in scope.row.claimentslawyer" :key="lawyer + index">
                      {{ lawyer.f1 }}
                    </li>
                  </ul>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="Alçada máxima">
              <template slot-scope="scope">R$ {{ scope.row.disputeupperrange }}</template>
            </el-table-column>
            <el-table-column label="Contraproposta">
              <template slot-scope="scope">R$ {{ scope.row.lastoffervalue }}</template>
            </el-table-column>
            <el-table-column label="Última interação">
              <template slot-scope="scope">{{ scope.row.lastinteractiondate | moment('DD/MM/YY') }}</template>
            </el-table-column>
            <el-table-column label="Fim da negociação">
              <template slot-scope="scope">
                {{ scope.row.disputedealdate | moment('DD/MM/YY') }}
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
                <el-tooltip :content="scope.row.favorite ? 'Desmarcar como favorito' : 'Marcar como favorito'">
                  <el-button
                    type="text"
                    class="favorite"
                    @click="setFavorite(scope.row.favorite ? 'disfavor' : 'favorite', scope.row.disputeid, 'COM INTERAÇÃO')">
                    <jus-icon :icon="scope.row.favorite ? 'golden-star' : 'star'" />
                  </el-button>
                </el-tooltip>
                <el-tooltip content="Visualizar caso">
                  <router-link :to="{ name: 'case', params: {id: scope.row.disputeid} }">
                    <jus-icon icon="open-case" />
                  </router-link>
                </el-tooltip>
              </template>
            </el-table-column>
            <template v-if="!$store.state.loading" slot="empty">
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
                  <span v-for="(claimant, index) in scope.row.claiments" slot="reference" :key="claimant + index">
                    {{ claimant.f1 }}
                  </span>
                  <ul>
                    <li v-for="(claimant, index) in scope.row.claiments" :key="claimant + index">
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
                  <span v-for="(lawyer, index) in scope.row.claimentslawyer" slot="reference" :key="lawyer + index">
                    {{ lawyer.f1 }}
                  </span>
                  <ul>
                    <li v-for="(lawyer, index) in scope.row.claimentslawyer" :key="lawyer + index">
                      {{ lawyer.f1 }}
                    </li>
                  </ul>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="Alçada máxima">
              <template slot-scope="scope">R$ {{ scope.row.disputeupperrange }}</template>
            </el-table-column>
            <el-table-column label="Valor do acordo">
              <template slot-scope="scope">{{ scope.row.disputedealvalue }}</template>
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
                <el-tooltip :content="scope.row.favorite ? 'Desmarcar como favorito' : 'Marcar como favorito'">
                  <el-button
                    type="text"
                    class="favorite"
                    @click="setFavorite(scope.row.favorite ? 'disfavor' : 'favorite', scope.row.disputeid, 'NOVOS ACORDOS')">
                    <jus-icon :icon="scope.row.favorite ? 'golden-star' : 'star'" />
                  </el-button>
                </el-tooltip>
                <el-tooltip content="Visualizar caso">
                  <router-link :to="{ name: 'case', params: {id: scope.row.disputeid} }">
                    <jus-icon icon="open-case" />
                  </router-link>
                </el-tooltip>
              </template>
            </el-table-column>
            <template v-if="!$store.state.loading" slot="empty">
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
                  <span v-for="(claimant, index) in scope.row.claiments" slot="reference" :key="claimant + index">
                    {{ claimant.f1 }}
                  </span>
                  <ul>
                    <li v-for="(claimant, index) in scope.row.claiments" :key="claimant + index">
                      {{ claimant.f1 }}
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
                <el-tooltip :content="scope.row.favorite ? 'Desmarcar como favorito' : 'Marcar como favorito'">
                  <el-button
                    type="text"
                    class="favorite"
                    @click="setFavorite(scope.row.favorite ? 'disfavor' : 'favorite', scope.row.disputeid, 'TODOS')">
                    <jus-icon :icon="scope.row.favorite ? 'golden-star' : 'star'" />
                  </el-button>
                </el-tooltip>
                <el-tooltip content="Visualizar caso">
                  <router-link :to="{ name: 'case', params: {id: scope.row.disputeid} }">
                    <jus-icon icon="open-case" />
                  </router-link>
                </el-tooltip>
              </template>
            </el-table-column>
            <template v-if="!$store.state.loading" slot="empty">
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
      filters: {},
      selectedIds: [],
      activeTab: {},
      activeFilters: {},
      currentQuery: '',
      loadingExport: false
    }
  },
  computed: {
    multiActive () {
      return this.selectedIds.length >= 1
    }
  },
  mounted () {
    const savedFilters = JSON.parse(localStorage.getItem('jusfilters'))
    if (savedFilters && savedFilters.accountId === this.$store.getters.accountId) {
      this.activeFilters = savedFilters.filters
      this.filters = savedFilters.filters
    }
    this.setActiveTabLabel('0')
    this.getCases()
  },
  methods: {
    getCases () {
      this.$store.dispatch('showLoading')
      this.cases = []
      this.currentQuery = this.buildQuery()
      this.$store.dispatch('getDisputes', this.currentQuery).then(response => {
        this.cases = response
      }).catch(error => {
        console.error(error)
        this.$jusNotification({
          title: 'Ops!',
          message: 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.',
          type: 'error'
        })
      }).finally(() => {
        this.$store.dispatch('hideLoading')
      })
    },
    buildQuery () {
      let query = { query: { bool: { must: [] } }, from: 0, size: 3000 }
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
      if (this.activeTab.terms) {
        for (let terms of this.activeTab.terms) {
          query.query.bool.must.push(
            { terms: terms }
          )
        }
      }
      Object.keys(this.filters).forEach(key => {
        let match = {}
        if (this.filters[key]) {
          match[key] = this.filters[key]
          query.query.bool.must.push({ match: match })
          // if (Array.isArray(match[key])) {
          //   if (match[key].length) query.query.bool.must.push({ match: match })
          // } else query.query.bool.must.push({ match: match })
        }
      })
      return query.query.bool.must.length > 0 ? query : null
    },
    applyFilters () {
      var stringfilters = JSON.stringify({
        accountId: this.$store.getters.accountId,
        filters: this.activeFilters
      })
      localStorage.setItem('jusfilters', stringfilters)
      this.showFilters = false
      this.filters = JSON.parse(JSON.stringify(this.activeFilters))
      this.getCases()
      window.analytics.track('Filtro aplicado', {
        filters: this.filters,
        tab: this.activeTab.label ? this.activeTab.label : this.activeTab.label = 'Engajamento'
      })
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
        if (dispute && dispute.disputeid) {
          this.selectedIds.push(dispute.disputeid)
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
          newActive = { index: 2, label: 'Novos acordos', terms: [{ disputestatus: ['ACCEPTED', 'CHECKOUT'] }] }
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
      if (oldTab !== undefined) {
        this.clearSelection()
        this.setActiveTabLabel(newTab)
        this.getCases()
        this.filters = {}
      }
    },
    clearFilters () {
      localStorage.removeItem('jusfilters')
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
          type: action,
          disputeIds: this.selectedIds
        }).then(response => {
          window.analytics.track('Ação em massa realizada', {
            action: action,
            tab: this.activeTab.label ? this.activeTab.label : this.activeTab.label = 'Engajamento',
            selecteds: this.selectedIds.length
          })
          var self = this
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
        })
      })
    },
    refresh () {
      this.getCases()
    },
    setFavorite (action, id, aba) {
      let label = action === 'favorite' ? 'favoritado' : 'removido de favoritos'
      this.$store.dispatch('sendDisputeAction', {
        action: action,
        disputeId: id
      }).then(() => {
        window.analytics.track('Caso em "' + aba + '" ' + label, {
          aba: aba,
          action: label
        })
        this.$jusNotification({
          title: 'Yay!',
          message: 'Caso ' + label + ' com sucesso.',
          type: 'success'
        })
        var self = this
        setTimeout(function () {
          self.getCases()
        }, 1500)
      }).catch(error => {
        console.error(error)
        this.$jusNotification({
          title: 'Ops!',
          message: 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.',
          type: 'error'
        })
      })
    },
    exportDisputes () {
      this.loadingExport = true
      this.$store.dispatch('exportDisputes', this.currentQuery).then(response => {
        // eslint-disable-next-line
        window.open(axios.defaults.baseURL + '/api/export/' + response)
        window.analytics.track('Planilha de "' + this.activeTab.label + '" exportada')
      }).finally(() => {
        this.loadingExport = false
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
    span + button, button + a {
      margin-left: 6px;
    }
  }
  &__empty-table {
    margin-top: 40px;
    width: 60px;
  }
}
</style>
