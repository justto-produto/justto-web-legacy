<template>
  <div class="management-table__container">
    <jus-protocol-dialog
      :protocol-dialog-visible.sync="protocolDialogVisible"
      :dispute-id.sync="selectedDisputeId"
      :dispute-roles.sync="selectedDisputeRoles"
    />
    <el-table
      ref="disputeTable"
      :key="disputeKey"
      v-loading="responseBoxLoading"
      :data.sync="disputes"
      :row-class-name="tableRowClassName"
      :element-loading-text="responseBoxLoading ? 'Enviando mensagem...' : 'Atualizando informações...'"
      size="mini"
      empty-text=" "
      height="100%"
      class="management-table el-table--disputes"
      data-testid="dispute-index"
      @cell-mouse-enter="cellMouseEnter"
      @cell-click="openTimelineModal($event)"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="44px"
      />
      <el-table-column
        v-if="tab1"
        :sortable="false"
        min-width="68px"
        align="center"
        class-name="management-table__row-info"
      >
        <template slot-scope="scope">
          <el-popover
            v-if="!!scope.row.lastOutboundInteraction"
            trigger="hover"
            popper-class="el-popover--dark"
            @show="getMessageSummary(scope.row.lastOutboundInteraction, scope.row.id)"
            @hide="messageSummary = {}">
            <strong>
              <jus-icon
                :icon="getInteractionIcon(scope.row.lastOutboundInteraction)"
                is-white
              />
              Último {{ getLastInteractionTooltip(scope.row.lastOutboundInteraction) }}
              em {{ scope.row.lastOutboundInteraction.createAt.dateTime | moment('DD/MM/YYYY [às] HH:mm') }}
            </strong><br>
            <div v-if="scope.row.lastOutboundInteraction.message.sender">
              De: {{ scope.row.lastOutboundInteraction.message.sender | phoneMask }}
            </div>
            <div v-if="scope.row.lastOutboundInteraction.message.receiver">
              Para: {{ scope.row.lastOutboundInteraction.message.receiver | phoneMask }}
            </div>
            <span v-if="scope.row.lastOutboundInteraction.message.parameters.READ_DATE && Object.keys(messageSummary).length">
              <div v-if="messageSummary.countVisualization !== null">
                Total de visualizações: {{ messageSummary.countVisualization }}
              </div>
              <div v-if="messageSummary.countClick !== null">
                Total de clicks: {{ messageSummary.countClick }}
              </div>
              <div v-if="messageSummary.firstVisualizationDate !== null">
                Primeira visualização: {{ messageSummary.firstVisualizationDate.dateTime | moment('DD/MM/YYYY [às] HH:mm') }}
              </div>
              <div v-if="messageSummary.lastVisualizationDate !== null">
                Última visualização: {{ messageSummary.lastVisualizationDate.dateTime | moment('DD/MM/YYYY [às] HH:mm') }}
              </div>
              <div v-if="messageSummary.firstClickDate !== null">
                Primeiro click: {{ messageSummary.firstClickDate.dateTime | moment('DD/MM/YYYY [às] HH:mm') }}
              </div>
              <div v-if="messageSummary.lastClickDate !== null">
                Último click: {{ messageSummary.lastClickDate.dateTime | moment('DD/MM/YYYY [às] HH:mm') }}
              </div>
            </span>
            <jus-icon
              slot="reference"
              :icon="'status-' + (scope.row.lastOutboundInteraction.message.parameters.READ_DATE ? 2 : 0)"
            />
          </el-popover>
          <span
            v-else
            style="color: #adadad;margin-right: 8px;font-size: 22px;vertical-align: sub;"
          >-</span>
          <el-tooltip>
            <div slot="content">
              <span v-if="!!scope.row.lastNegotiatorAccess">
                Último acesso ao sistema Justto: <strong>{{ scope.row.lastNegotiatorAccess.createAt.dateTime | moment('DD/MM/YYYY [às] HH:mm') }}</strong>
              </span>
              <span v-else>
                Ainda não houve acesso ao sistema Justto de Negociação
              </span>
            </div>
            <jus-icon
              :is-active="!!scope.row.lastNegotiatorAccess"
              icon="justto-access"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        :sortable="false"
        label="Processo"
        min-width="100px"
        class-name="management-table__row-code"
        prop="code"
      >
        <template slot-scope="scope">
          <dispute-code-link
            :code="scope.row.code"
            @hover="hoverDisputeCode(scope.row.code)"
          />
        </template>
      </el-table-column>
      <el-table-column
        :sortable="false"
        prop="campaignName"
        label="Campanha"
        min-width="94px"
      >
        <template
          v-if="scope.row.campaign"
          slot-scope="scope"
        >
          {{ scope.row.campaign.name | capitalize }}
        </template>
      </el-table-column>
      <el-table-column
        :sortable="false"
        prop="firstClaimant"
        min-width="140px"
        class-name="text-ellipsis"
        label="Parte(s) contrária(s)"
      >
        <template slot-scope="scope">
          <jus-vexatious-alert
            v-if="scope.row.firstClaimantAlerts && scope.row.firstClaimantAlerts.length"
            :document-number="scope.row.firstClaimantDocumentNumber"
            :name="scope.row.firstClaimant"
            style="display: flex;"
          />
          {{ scope.row.firstClaimant }}
        </template>
      </el-table-column>
      <el-table-column
        :sortable="false"
        prop="firstClaimantLawyer"
        class-name="text-ellipsis"
        label="Advogado(s) da parte"
        min-width="154px"
      >
        <template slot-scope="scope">
          <jus-vexatious-alert
            v-if="scope.row.firstClaimantLawyerAlerts && scope.row.firstClaimantLawyerAlerts.length"
            :document-number="scope.row.firstClaimantLawyerDocumentNumber"
            :alerts="scope.row.firstClaimantLawyerAlerts"
            style="display: flex;"
          />
          {{ scope.row.firstClaimantLawyer }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab0 || tab1"
        :sortable="false"
        label="Alçada máxima"
        align="center"
        prop="disputeUpperRange"
        min-width="118px"
      >
        <template slot-scope="scope">
          {{ scope.row.disputeUpperRange | currency }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab0"
        :sortable="false"
        label="Valor proposto"
        prop="lastOfferValue"
        align="center"
        min-width="114px"
      >
        <template slot-scope="scope">
          {{ scope.row.lastOfferValue | currency }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab1 || tab2"
        label="Última mensagem"
        min-width="136px"
        align="center"
      >
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.lastReceivedMessage"
            trigger="hover"
            popper-class="el-popover--dark"
            @after-enter="startResponseBox(scope.row.id)"
            @hide="hideResponseBox(scope.row.id)"
          >
            <div>
              <strong>
                <jus-icon
                  :icon="getInteractionIcon(scope.row.lastReceivedMessage)"
                  is-white
                />
                {{ getLastInteractionTooltip(scope.row.lastReceivedMessage) }}
                recebido em
                {{ scope.row.lastReceivedMessage.createAt.dateTime | moment('DD/MM/YYYY [às] HH:mm') }}
              </strong><br>
              <div v-if="scope.row.lastReceivedMessage && scope.row.lastReceivedMessage.message">
                <span v-if="scope.row.lastReceivedMessage.message.sender">
                  De: {{ scope.row.lastReceivedMessage.message.sender | phoneMask }}
                </span>
                <br>
                <span
                  v-if="scope.row.lastReceivedMessage.message.resume"
                  class="management-table__last-interaction-tooltip"
                  v-html="'Resumo: ' + scope.row.lastReceivedMessage.message.resume + (scope.row.lastReceivedMessage.message.resume.length > 139 ? '...' : '')"
                />
              </div>
              <div
                class=""
                style="width: 100%;text-align: right;min-width:300px"
              >
                <el-button
                  v-if="!responseBoxVisible"
                  size="mini"
                  icon="el-icon-s-promotion"
                  style="margin-top: 10px;"
                  @click="showResponseBox(scope.row.id)"
                >
                  Responder
                </el-button>
                <div v-else>
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-top-right"
                    @click="openResponseDialog(scope.row)"
                  >
                    Expandir
                  </el-button>
                  <el-input
                    v-model="message"
                    type="textarea"
                    rows="4"
                    placeholder="Escreva alguma coisa"
                    style="padding-bottom: 10px"
                  />
                  <el-button
                    size="mini"
                    @click="hideResponseBox(scope.row.id, true)"
                  >
                    Cancelar
                  </el-button>
                  <el-button
                    size="mini"
                    icon="el-icon-s-promotion"
                    @click="sendMessage(scope.row)"
                  >
                    Enviar
                  </el-button>
                </div>
              </div>
            </div>
            <div slot="reference">
              <span
                class="position-relative"
                style="vertical-align: middle;"
              >
                <jus-icon
                  v-if="scope.row.lastReceivedMessage"
                  :icon="getInteractionIcon(scope.row.lastReceivedMessage)"
                  class="management-table__interaction-icon"
                />
                <i
                  v-if="!scope.row.visualized"
                  class="management-table__interaction-pulse el-icon-warning el-icon-pulse el-icon-primary"
                />
              </span>
              <span style="margin-left: 4px;">
                {{ getLastInteraction(scope.row.lastReceivedMessage.createAt.dateTime) }}
              </span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab2"
        label="Minuta"
        width="110px"
        class-name="management-table__row-actions"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            class="management-table__protocol_button"
            @click="showProtocolModal(scope.row)"
          >
            Minuta
            <div :class="'management-table__protocol_button--step-' + getDocumentStep(scope.row.hasDocument, scope.row.signStatus)">
              <span /><span /><span />
            </div>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab1"
        :sortable="false"
        label="Contraproposta"
        align="center"
        prop="lastCounterOfferValue"
        min-width="120px"
      >
        <template slot-scope="scope">
          {{ scope.row.lastCounterOfferValue | currency }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab || tab0 || tab1 || tab3"
        :sortable="false"
        prop="expirationDate"
        label="Fim da negociação"
        align="center"
        min-width="140px"
      >
        <template slot-scope="scope">
          <el-tooltip content="Negociação encerra nos próximos 3 dias">
            <span
              v-if="(disputeNextToExpire(scope.row.expirationDate.dateTime) || scope.row.disputeNextToExpire) && scope.row.status !== 'EXPIRED'"
              data-testid="expiration-notify"
              class="management-table__expiration-icon position-relative"
            >
              <jus-icon icon="clock" />
              <i class="management-table__interaction-pulse el-icon-warning el-icon-pulse el-icon-primary" />
            </span>
          </el-tooltip>
          <span v-if="scope.row.expirationDate">{{ scope.row.expirationDate.dateTime | moment('DD/MM/YY') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab2"
        :sortable="false"
        label="Valor do acordo"
        prop="disputeDealValue"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          {{ scope.row.disputeDealValue | currency }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab2"
        :sortable="false"
        prop="disputeDealDate"
        label="Data do acordo"
        min-width="118px"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.disputeDealDate">{{ scope.row.disputeDealDate.dateTime | moment('DD/MM/YY') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab3"
        :sortable="false"
        label="Status"
        prop="status"
        align="center"
        min-width="90px"
      >
        <template slot-scope="scope">
          {{ $t('occurrence.type.' + scope.row.status) | capitalize }}
          <span v-if="scope.row.paused">(pausada)</span>
        </template>
      </el-table-column>
      <el-table-column
        class-name="hidden-actions"
        width="1px"
      >
        <template slot-scope="scope">
          <jus-dispute-actions
            v-if="disputeActionsRow === scope.row.id"
            :dispute="scope.row"
            table-actions
          />
        </template>
      </el-table-column>
      <template slot="empty">
        <transition name="el-fade-in-linear">
          <span v-show="showEmpty">
            <jus-icon
              icon="empty-screen-filter"
              class="management-table__empty-table"
              data-testid="cases-empty-icon"
            />
            <h4 data-testid="cases-empty-text">
              Não foram encontradas disputas para<br>os filtros selecionados.
            </h4>
          </span>
        </transition>
      </template>
      <infinite-loading
        v-if="disputes.length >= 20"
        slot="append"
        :distance="20"
        spinner="spiral"
        force-use-infinite-wrapper=".el-table__body-wrapper"
        @infinite="infiniteHandler"
      >
        <div slot="no-more">
          Fim das disputas
        </div>
        <div slot="no-results">
          Fim das disputas
        </div>
      </infinite-loading>
    </el-table>
    <el-dialog
      :visible.sync="responseDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="`Resposta ao processo ${responseRow.code}`"
      class="management-table__response-dialog">
      <div v-if="Object.keys(responseRow).length">
        Negociável até <b>{{ responseRow.expirationDate.dateTime | moment('DD/MM/YY') }}</b>.
        <br>
        Alçada máxima é de <b>{{ responseRow.disputeUpperRange | currency }}</b>
        <br>
        Última proposta foi de <b>{{ responseRow.lastOfferValue | currency }}</b>
        <br>
        <span v-if="responseRow.lastCounterOfferValue">
          Contra proposta de <b>{{ responseRow.lastCounterOfferValue | currency }}</b>
        </span>
        <span v-else>
          <b>Ainda não houve contraproposta</b>
        </span>
        <br><br>
        Resposta via:
        <jus-icon :icon="responseRow.lastReceivedMessage.message.communicationType.toLowerCase()" />
        <b>{{ responseRow.lastReceivedMessage.message.communicationType.toLowerCase() | capitalize }}</b>
        <br>
        Destinatário: <b>{{ responseRow.lastReceivedMessage.message.sender | phoneMask }}</b>
        <br><br>
        <quill-editor
          v-if="responseDialogVisible"
          ref="messageEditor"
          v-model="richMessage"
          v-loading="responseBoxLoading"
          :class="{ 'show-toolbar': responseRow.lastReceivedMessage.message.communicationType === 'EMAIL' }"
          :options="editorOptions"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :disabled="responseBoxLoading"
          plain
          @click="responseDialogVisible = false"
        >Cancelar</el-button>
        <el-button
          :loading="responseBoxLoading"
          type="primary"
          icon="el-icon-s-promotion"
          @click="sendMessage(responseRow)"
        >
          Enviar
        </el-button>
      </span>
    </el-dialog>
    <jus-timeline
      v-if="currentDisputeCode"
      v-model="disputeTimelineModal"
      :code="currentDisputeCode"
    />
  </div>
</template>

<script>
import {
  getLastInteraction,
  getInteractionIcon,
  getLastInteractionTooltip,
  getDocumentStep,
} from '@/utils/jusUtils'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Quill from 'quill'
import { mapGetters, mapActions } from 'vuex'
const SizeStyle = Quill.import('attributors/style/size')
const AlignStyle = Quill.import('attributors/style/align')
Quill.register(AlignStyle, true)
Quill.register(SizeStyle, true)

export default {
  name: 'ManagementTable',
  components: {
    DisputeCodeLink: () => import('./DisputeCodeLink'),
    JusTimeline: () => import('@/components/JusTimeline/JusTimeline'),
    JusDisputeActions: () => import('@/components/buttons/JusDisputeActions'),
    JusProtocolDialog: () => import('@/components/dialogs/JusProtocolDialog'),
    InfiniteLoading: () => import('vue-infinite-loading'),
    JusVexatiousAlert: () => import('@/components/dialogs/JusVexatiousAlert'),
    quillEditor,
  },
  props: {
    activeTab: {
      type: String,
      default: '0',
    },
    selectedIds: {
      type: Array,
      default: () => [],
    },
    loadingDisputes: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentDisputeCode: null,
      disputeTimelineModal: false,
      showEmpty: false,
      showEmptyDebounce: '',
      disputeActionsRow: 0,
      protocolDialogVisible: false,
      selectedDisputeId: 0,
      selectedDisputeRoles: [],
      disputeKey: 0,
      messageSummary: {},
      message: '',
      richMessage: '',
      messageCache: {},
      responseBoxVisible: false,
      responseBoxLoading: false,
      responseDialogVisible: false,
      responseRow: {},
      editorOptions: {
        placeholder: 'Escreva alguma coisa',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote'],
            ['clean'],
          ],
        },
      },
    }
  },
  computed: {
    ...mapGetters(['disputeTimeline', 'loading']),
    selectedIdsComp: {
      get() {
        return this.selectedIds
      },
      set(ids) {
        this.$emit('update:selectedIds', ids)
      },
    },
    disputes() {
      return this.$store.getters.disputes
    },
    tab() {
      return this.activeTab === '-1'
    },
    tab0() {
      return this.activeTab === '0'
    },
    tab1() {
      return this.activeTab === '1'
    },
    tab2() {
      return this.activeTab === '2'
    },
    tab3() {
      return this.activeTab === '3'
    },
  },
  watch: {
    disputes: {
      handler() {
        this.$refs.disputeTable.doLayout()
      },
      deep: true,
    },
    loadingDisputes(value) {
      if (!value) {
        clearTimeout(this.showEmptyDebounce)
        this.showEmptyDebounce = setTimeout(() => {
          this.showEmpty = true
        }, 2000)
      }
    },
  },
  beforeCreate() {
    this.$store.commit('resetDisputeQueryPage')
  },
  methods: {
    ...mapActions(['getDisputeTimeline']),

    hoverDisputeCode(code) {
      if (!this.disputeTimeline[code]) {
        this.getDisputeTimeline(code)
      }
    },
    openTimelineModal(dispute) {
      const { code } = dispute
      if (!this.disputeTimeline[code] || this.disputeTimeline[code].lawsuits.length === 0) {
        return
      }
      this.currentDisputeCode = code
      this.$nextTick(() => {
        this.disputeTimelineModal = true
      })
      this.$jusSegment('Linha do tempo visualizada pelo gerenciamento', { disputeId: dispute.id })
    },
    cellMouseEnter(row, column, cell, event) {
      this.disputeActionsRow = row.id
    },
    startResponseBox(id) {
      this.message = ''
      if (this.messageCache[id]) {
        this.message = this.messageCache[id]
        this.responseBoxVisible = true
      }
    },
    showResponseBox(id) {
      this.responseBoxVisible = true
    },
    hideResponseBox(id, cancel) {
      if (cancel) {
        delete this.messageCache[id]
      } else if (this.message) {
        this.messageCache[id] = this.message
      }
      this.message = ''
      this.responseBoxVisible = false
    },
    openResponseDialog(row) {
      this.responseRow = row
      this.responseDialogVisible = true
      this.richMessage = this.message + ''
    },
    sendMessage(dispute) {
      if (this.message.trim().replace('\n', '') || this.richMessage.trim().replace('\n', '')) {
        const message = this.richMessage ? this.richMessage : this.message
        this.responseBoxLoading = true
        this.$store.dispatch('send' + dispute.lastReceivedMessage.message.communicationType.toLowerCase(), {
          to: [{ address: dispute.lastReceivedMessage.message.sender }],
          message,
          disputeId: dispute.id,
        }).then(() => {
          this.message = ''
          this.richMessage = ''
          delete this.messageCache[dispute.id]
          this.responseDialogVisible = false
          this.$jusNotification({
            title: 'Yay!',
            message: 'Mensagem enviada com sucesso.',
            type: 'success',
          })
        }).catch(error => {
          this.$jusNotification({ error })
        }).finally(() => {
          this.responseBoxLoading = false
        })
      }
    },
    getLastInteraction: (i) => getLastInteraction(i),
    getInteractionIcon: (i) => getInteractionIcon(i),
    getLastInteractionTooltip: (i) => getLastInteractionTooltip(i),
    getDocumentStep: (hasDocument, signStatus) => getDocumentStep(hasDocument, signStatus),
    tableRowClassName({ row, rowIndex }) {
      if (!row.visualized && !this.tab0) {
        return 'el-table__row--visualized-row'
      }
    },
    handleRowClick(row, column, event) {
      if (row.id && !['IMG', 'SPAN', 'BUTTON', 'I'].includes(event.target.tagName)) {
        this.$router.push({ name: 'dispute', params: { id: row.id } })
      }
    },
    clearSelection() {
      this.$refs.disputeTable.clearSelection()
    },
    handleSelectionChange(selected) {
      const ids = []
      for (const dispute of selected) {
        if (dispute && dispute.id) {
          ids.push(dispute.id)
        }
      }
      this.selectedIdsComp = ids
    },
    disputeNextToExpire(date) {
      return this.$moment(date).isBetween(this.$moment(), this.$moment().add(4, 'day'))
    },
    showProtocolModal(dispute) {
      this.selectedDisputeId = dispute.id
      this.selectedDisputeRoles = dispute.disputeRoles
      this.protocolDialogVisible = true
    },
    getMessageSummary(lastOutboundInteraction, disputeId) {
      if (lastOutboundInteraction.message && lastOutboundInteraction.message.parameters.READ_DATE) {
        const messageResume = this.$store.getters.getMessageResumeByDisputeId(disputeId)
        if (messageResume) {
          this.messageSummary = messageResume.resume
        } else {
          this.$store.dispatch('getMessageSummary', lastOutboundInteraction.message.messageId).then(resume => {
            this.$store.commit('addMessageResume', { resume, disputeId })
            this.messageSummary = resume
          })
        }
      }
    },
    infiniteHandler($state) {
      this.$store.commit('addDisputeQueryPage')
      this.$store.dispatch('getDisputes', 'nextPage').then(response => {
        if (response.last) {
          $state.complete()
        } else {
          $state.loaded()
        }
      })
    },
  },
}
</script>

<style lang="scss">
.management-table__container {
  height: calc(100% - 114px);

  @media (max-height: 680px) {
    height: calc(100% - 93px);
  }
}

.management-table {
  @media (max-height: 680px) {
    margin-bottom: 0;
  }

  th {
    @media (max-height: 680px) {
      padding: 2px 0 4px 0;
      height: 100%;
    }
  }

  &__interaction-icon {
    vertical-align: middle;
    margin-right: 4px;
    max-height: 18px;
    max-width: 18px;
  }
  &__expiration-icon {
    margin-right: 6px;
    img {
      vertical-align: middle;
      margin-right: 4px;
      max-height: 16px;
      max-width: 16px;
    }
  }
  &__interaction-pulse {
    position: absolute;
    font-size: 16px;
    bottom: -5px;
    right: -3px;
  }
  &__expiration-pulse {
    vertical-align: sub;
  }
  &__row-actions {
    img {
      width: 20px;
      vertical-align: middle;
    }
    .el-button--text {
      margin-left: 6px;
    }
  }
  &__row-info {
    img {
      vertical-align: middle !important;
      width: 22px;
    }
    span + img {
      margin-left: 8px;
      width: 16px;
    }
  }
  &__empty-table {
    margin-top: 40px;
    width: 60px;
  }
  &__protocol_button {
    position: relative;
    div {
      display: flex;
      position: absolute;
      bottom: -1px;
      left: -1px;
      right: -1px;
      span {
        height: 3px;
        border: 1px solid #dcdfe6;
        width: 100%;
        &:first-child {
          border-radius: 0 0 0 1px;
        }
        &:last-child {
          border-radius: 0 0 1px 0;
        }
      }
    }
    &:hover div span {
      border: 1px solid #9461f7;
    }
  }
  &__last-interaction-tooltip {
    display: flex;
    max-width: 400px;
  }
  &__protocol_button--step {
    &-1 {
      span:first-child {
        background-color: #9461f7;
        border-color: #9461f7;
      }
    }
    &-2 {
      span:first-child, span:nth-child(2) {
        background-color: #9461f7;
        border-color: #9461f7;
      }
    }
    &-3 {
      span {
        background-color: #9461f7;
        border-color: #9461f7;
      }
    }
  }
  .el-table__empty-block {
    width: auto !important;
  }
  &__response-dialog {
    .quill-editor {
      background-color: #eaeaed;
      padding: 0 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      min-height: 300px;
      height: 30vh;
      &.show-toolbar .ql-toolbar {
        display: inherit !important;
      }
    }
    img {
      width: 14px;
      margin: 0 4px 0 2px;
    }
  }
  th.hidden-actions {
    position: relative;
  }
  td.hidden-actions {
    .cell {
      display: none;
    }
  }
  tr:hover {
    td.hidden-actions .cell{
      display: contents;
    }
  }
  th.gutter {
    display: table-cell !important;
  }
  td {
    height: 46px;
  }
  .infinite-loading-container {
    font-style: italic;
    margin: 20px 0 10px;
    color: #adadad;
    font-size: 1rem;
  }
}
.dialog-timeline {
  .dialog-timeline__title {
    text-align: center;
    padding-top: 20px;
    font: normal normal medium 17px/22px Montserrat;
    letter-spacing: 0px;
    color: #424242;
    font-weight: bold;
  }

  .el-dialog__body {
    margin-top: 0px;
  }
}
</style>
