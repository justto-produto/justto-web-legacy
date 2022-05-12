<template>
  <div
    :class="tableActions ? 'jus-dispute-actions--table' : 'jus-dispute-actions--dispute'"
    class="jus-dispute-actions"
  >
    <router-link
      v-if="!tableActions"
      to="/management"
    >
      <jus-icon
        class="jus-dispute-actions__back-button"
        icon="back"
      />
    </router-link>

    <span
      v-for="action in actionsList"
      :key="action.name"
    >
      <el-tooltip
        v-if="action.condition()"
        :content="action.tooltip"
        :open-delay="300"
      >
        <span>
          <el-button
            :disabled="action.disabled || modalLoading"
            :type="tableActions ? 'text' : ''"
            :plain="!tableActions"
            :data-testid="action.name"
            class="jus-dispute-actions__actions-buttons"
            @click="action.action()"
          >
            <jus-icon
              v-if="!action.isElementIcon"
              :icon="action.icon"
              class="jus-dispute-actions__actions-icons"
            />

            <i
              v-else
              :class="action.icon"
              class="jus-dispute-actions__actions-icons el-icon"
            />
          </el-button>
        </span>
      </el-tooltip>
    </span>

    <el-tooltip
      v-if="!tableActions"
      :content="collapsed ? 'Exibir informações da disputa' : 'Ocultar informações da disputa'"
    >
      <el-button
        :plain="!tableActions"
        :icon="collapsed ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"
        type="text"
        class="jus-dispute-actions__collapse-button"
        @click="togleCollapsed"
      />
    </el-tooltip>

    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="settledDialogVisible"
      append-to-body
      title="Acordo aceito"
      class="dispute-view-actions__choose-unsettled-dialog"
      width="600px"
      data-testid="choose-unsettled-dialog"
    >
      <p>Confirme o valor do acordo nos campos abaixo:</p>

      <el-form
        ref="counterOfferForm"
        v-loading="modalLoading"
        :model="counterOfferForm"
        :rules="counterOfferFormRules"
        label-position="top"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="Valor"
              prop="lastCounterOfferValue"
            >
              <money
                v-model="counterOfferForm.lastCounterOfferValue"
                class="el-input__inner"
                data-testid="counterproposal-value-input"
                maxlength="16"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="Proposto por"
              prop="selectedRoleId"
            >
              <el-select
                v-model="counterOfferForm.selectedRoleId"
                placeholder="Autor da contraproposta"
                style="width: 100%;"
                data-testid="counterproposal-claimant-input"
              >
                <el-option
                  v-for="(claimant, index) in disputeClaimants"
                  :key="`${index}-${claimant.id}`"
                  :label="claimant.name"
                  :value="claimant.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :hutter="20">
          <el-form>
            <el-form-item
              :label="`${$t('dispute.labels.note')}:`"
            >
              <el-input
                v-model="counterOfferForm.note"
                class="dialog__textarea-note"
                type="textarea"
                placeholder="Informe uma nota"
                :rows="4"
                :maxlength="255"
              />

              <div style="text-align: right;">
                {{ (counterOfferForm.note || '').length }}/255
              </div>
            </el-form-item>
          </el-form>
        </el-row>
      </el-form>

      <span slot="footer">
        <el-button
          :disabled="modalLoading"
          plain
          @click="settledDialogVisible = false"
        >
          Cancelar
        </el-button>

        <el-button
          :loading="modalLoading"
          type="primary"
          @click.prevent="disputeAction('send_settled', updateUpperRange = true)"
        >
          Continuar
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="chooseUnsettledDialogVisible"
      append-to-body
      title="Perder"
      class="jus-dispute-actions__choose-unsettled-dialog"
      width="460px"
      data-testid="choose-unsettled-dialog"
    >
      <div class="el-message-box__content">
        <div class="el-message-box__container">
          <div class="el-message-box__status el-icon-warning" />

          <div class="el-message-box__message">
            <p>Tem certeza que deseja realizar esta ação?</p>
          </div>
        </div>
      </div>

      <el-select
        v-model="unsettledType"
        filterable
        data-testid="select-unsettled"
        placeholder="Escolha o motivo da perda"
      >
        <el-option
          v-for="(type, index) in unsettledReasonsSorted"
          :key="index"
          :label="type[1]"
          :value="type[0]"
        />
      </el-select>

      <el-form
        v-if="isInsufficientUpperRange"
        ref="counterOfferForm"
        v-loading="modalLoading"
        :model="counterOfferForm"
        :rules="counterOfferFormRules"
        label-position="top"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="Valor"
              prop="lastCounterOfferValue"
            >
              <money
                v-model="counterOfferForm.lastCounterOfferValue"
                class="el-input__inner"
                data-testid="counterproposal-value-input"
                maxlength="16"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="Proposto por"
              prop="selectedRoleId"
            >
              <el-select
                v-model="counterOfferForm.selectedRoleId"
                placeholder="Autor da contraproposta"
                data-testid="counterproposal-claimant-input"
              >
                <el-option
                  v-for="(claimant, index) in disputeClaimants"
                  :key="`${index}-${claimant.id}`"
                  :label="claimant.name"
                  :value="claimant.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-form>
        <el-form-item
          :label="`${$t('dispute.labels.note')}:`"
        >
          <el-input
            v-model="counterOfferForm.note"
            type="textarea"
            placeholder="Informe uma nota"
            :rows="4"
            :maxlength="255"
          />

          <div style="text-align: right;">
            {{ (counterOfferForm.note || '').length }}/255
          </div>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button
          :disabled="modalLoading"
          plain
          @click="chooseUnsettledDialogVisible = false"
        >
          Cancelar
        </el-button>

        <el-button
          :loading="modalLoading"
          :disabled="!unsettledType"
          type="primary"
          @click.prevent="disputeAction('send-unsettled')"
        >
          Continuar
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="editNegotiatorDialogVisible"
      append-to-body
      title="Editar negociadores da disputa"
      width="604px"
    >
      <el-form
        ref="negotiatorsForm"
        v-loading="modalLoading"
        :model="negotiatorsForm"
        :rules="negotiatorsRules"
        label-position="top"
        @submit.native.prevent="editNegotiator"
      >
        <el-transfer
          v-model="disputeNegotiators"
          :titles="['Equipe', 'Disputa']"
          :button-texts="['Remover', 'Adicionar']"
          :data="workspaceNegotiators"
          filter-placeholder="Buscar"
          filterable
        />
      </el-form>

      <span slot="footer">
        <el-button
          :disabled="modalLoading"
          plain
          @click="editNegotiatorDialogVisible = false"
        >
          Cancelar
        </el-button>

        <el-button
          :loading="modalLoading"
          type="primary"
          @click.prevent="disputeAction('edit-negotiators', disputeNegotiators)"
        >
          Editar dados
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="counterproposalDialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      append-to-body
      title="Enviar contraproposta manual"
      width="600px"
      class="dispute-view__counterproposal-dialog"
    >
      <el-form
        ref="counterOfferForm"
        v-loading="modalLoading"
        :model="counterOfferForm"
        :rules="counterOfferFormRules"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="Valor"
              prop="lastCounterOfferValue"
            >
              <money
                v-model="counterOfferForm.lastCounterOfferValue"
                class="el-input__inner"
                data-testid="counterproposal-value-input"
                maxlength="16"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="Proposto por"
              prop="selectedRoleId"
            >
              <el-select
                v-model="counterOfferForm.selectedRoleId"
                placeholder="Autor da contraproposta"
                style="width: 100%;"
                data-testid="counterproposal-claimant-input"
              >
                <el-option
                  v-for="(claimant, index) in disputeClaimants"
                  :key="`${index}-${claimant.id}`"
                  :label="claimant.name"
                  :value="claimant.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              label="Nota:"
              prop="note"
            >
              <el-input
                v-model="counterOfferForm.note"
                type="textarea"
                rows="4"
                :maxlength="255"
              />

              <div style="text-align: right;">
                {{ (counterOfferForm.note || '').length }}/255
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer">
        <el-button
          :disabled="modalLoading"
          plain
          @click="counterproposalDialogVisible = false"
        >
          Cancelar
        </el-button>

        <el-button
          :loading="modalLoading"
          type="primary"
          @click.prevent="disputeAction('send_counterproposal')"
        >
          Atualizar contraproposta
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="uploadAttacmentDialogVisable"
      append-to-body
      title="Envie anexos"
      class="jus-dispute-actions__upload-dialog"
      width="600px"
      data-testid="upload-file-dialog"
    >
      <jus-drag-area
        :visible="true"
        @closeDialog="handleAttachmentDialogVisable()"
      />
    </el-dialog>

    <!-- Dialog para baixa definitiva -->
    <el-dialog
      :visible.sync="dropLawsuitDialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="604px"
      title="Cancelar disputa"
      class="dialog-actions__increase-alert"
    >
      <el-form
        ref="dropLawsuitForm"
        :model="dropLawsuitForm"
        :rules="dropLawsuitRules"
        :disabled="modalLoading"
        label-position="top"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              label="Motivo do cancelamento:"
              prop="reason"
            >
              <el-select
                v-model="dropLawsuitForm.reason"
                placeholder="Escolha o motivo"
                style="width: 100%;"
              >
                <el-option
                  v-for="(reason, reasonIndex) in dropLawsuitReasons"
                  :key="reasonIndex"
                  :value="Object.entries(reason)[0][0]"
                  :label="Object.entries(reason)[0][1]"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item
              label="Nota:"
              prop="note"
            >
              <el-input
                v-model="dropLawsuitForm.conclusionNote"
                type="textarea"
                rows="4"
                :maxlength="255"
              />

              <div style="text-align: right;">
                {{ (dropLawsuitForm.conclusionNote || '').length }}/255
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button
          plain
          @click="dropLawsuitDialogVisible = false"
        >
          Cancelar
        </el-button>
        <el-button
          v-loading="modalLoading"
          :disabled="modalLoading"
          type="primary"
          @click.prevent="handleDropLawsuit"
        >
          Confirmar
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="ticketResumeDialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="500px"
      title="Resumo da disputa"
      class="dialog-actions__ticket-resume"
    >
      <strong class="dialog-actions__ticket-resume-subtitle">
        Confira os dados da disputa:
      </strong>
      <p
        class="dialog-actions__ticket-resume-infoline"
      >
        <b>Nº da disputa: </b>
        <span>#{{ dispute.id }}</span>
      </p>
      <p
        class="dialog-actions__ticket-resume-infoline"
      >
        <b>Nº do processo: </b>
        <span>{{ dispute.code }}</span>
      </p>
      <p
        class="dialog-actions__ticket-resume-infoline"
      >
        <b>{{ $tc('PARTY_RESPONDENT', isRecovery) }}: </b>
        <span>{{ (respondentsResume || ' - ') | uppercase }}</span>
      </p>
      <p
        class="dialog-actions__ticket-resume-infoline"
      >
        <b>Autor(es): </b>
        <span>{{ authorsResume | uppercase }}</span>
      </p>
      <p
        class="dialog-actions__ticket-resume-infoline"
      >
        <b>Advogado(s) do autor(es): </b>
        <span>{{ lawyersResume | uppercase }}</span>
      </p>
      <p
        class="dialog-actions__ticket-resume-infoline"
      >
        <b>Valor do acordo: </b>
        <span>{{ (counterOfferForm.lastCounterOfferValue || dispute.disputeDealValue) | currency }}</span>
      </p>
      <el-input
        v-model="winNote"
        type="textarea"
        rows="4"
        :maxlength="255"
      />
      <div style="text-align: right;">
        {{ winNote.length }}/255
      </div>
      <div slot="footer">
        <el-button
          :disabled="modalLoading"
          plain
          @click="ticketResumeDialogVisible = false"
        >
          Cancelar
        </el-button>
        <el-button
          v-loading="modalLoading"
          :disabled="modalLoading"
          type="primary"
          @click.prevent="handleSettled"
        >
          Ganhar
        </el-button>
      </div>
    </el-dialog>

    <NotifyOnCompanyAnalysis
      ref="notifyOnCompanyAnalysis"
    />

    <ConfirmActionDialog
      ref="confirmActionDialog"
    />

    <SetSettledDialog
      ref="setSettledDialog"
    />
  </div>
</template>

<script>
import { getRoles } from '@/utils'
import { JusDragArea } from '@/components/JusDragArea'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'JusDisputeActions',

  components: {
    JusDragArea,
    ConfirmActionDialog: () => import('@/components/dialogs/ConfirmActionDialog'),
    NotifyOnCompanyAnalysis: () => import('@/components/dialogs/NotifyOnCompanyAnalysis'),
    SetSettledDialog: () => import('@/components/dialogs/SetSettledDialog')
  },

  props: {
    dispute: {
      type: Object,
      default: () => {}
    },
    tableActions: {
      type: Boolean,
      default: false
    },
    isCollapsed: {
      type: Boolean,
      default: false
    },
    tab: {
      type: String,
      default: '1'
    }
  },

  data() {
    return {
      settledValue: 0,
      unsettledType: null,
      negotiatorsForm: {},
      negotiatorsRules: {},
      disputeNegotiators: [],
      chooseUnsettledDialogVisible: false,
      editNegotiatorDialogVisible: false,
      counterproposalDialogVisible: false,
      uploadAttacmentDialogVisable: false,
      ticketResumeDialogVisible: false,
      settledDialogVisible: false,
      dropLawsuitDialogVisible: false,
      modalLoading: false,
      winNote: '',
      counterOfferForm: {
        lastCounterOfferValue: '',
        selectedRoleId: '',
        note: ''
      },
      dropLawsuitForm: {
        reason: null,
        conclusionNote: null
      },
      dropLawsuitRules: {
        reason: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      },
      counterOfferFormRules: {
        lastCounterOfferValue: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        selectedRoleId: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      }
    }
  },

  computed: {
    ...mapGetters({
      disputeStatuses: 'disputeStatuses',
      isJusttoAdmin: 'isJusttoAdmin',
      ghostMode: 'ghostMode',
      dropLawsuitReasons: 'getDropLawsuitReasonsArray',
      userPreferences: 'userPreferences',
      isRecovery: 'isWorkspaceRecovery',
      features: 'getMappedFeaturesAndModules'
    }),

    unsettledReasonsSorted() {
      return Object.entries(this.disputeStatuses.UNSETTLED || {}).sort((a, b) => (a[1] > b[1] ? 1 : -1))
    },

    collapsed: {
      get() {
        return this.isCollapsed
      },
      set(value) {
        this.$emit('update:isCollapsed', value)
      }
    },

    actionsList() {
      return [
        {
          name: 'settled',
          icon: 'win',
          disabled: this.isPaused || this.isCanceled,
          condition: () => this.canSettled,
          action: () => this.disputeAction('settled'),
          tooltip: this.dispute.status === 'CHECKOUT' || this.dispute.status === 'ACCEPTED' ? 'Ganhar' : 'Aceitar acordo'
        },
        {
          name: 'unsettled',
          icon: 'lose',
          disabled: this.isPaused || this.isCanceled,
          condition: () => this.canUnsettled,
          action: () => this.disputeAction('unsettled'),
          tooltip: 'Perder'
        },
        {
          name: 'resume',
          icon: 'start-again',
          disabled: this.isCanceled,
          condition: () => this.canResume,
          action: () => this.disputeAction('resume'),
          tooltip: 'Despausar'
        },
        {
          name: 'paused',
          icon: 'pause',
          disabled: this.isPaused || this.isCanceled,
          condition: () => this.canPause,
          action: () => this.disputeAction('paused'),
          tooltip: 'Pausar'
        },
        {
          name: 'restart-engagement',
          icon: 'refresh',
          disabled: this.isPaused || this.isCanceled || this.dispute?.favorite,
          condition: () => this.canRestartEngagement,
          action: () => this.disputeAction('restart-engagement'),
          tooltip: this.dispute?.favorite ? 'Disputa aguardando análise da empresa não permite reiniciar' : 'Reiniciar disputa'
        },
        {
          name: 'resend-messages',
          icon: 'resend-messages',
          condition: () => this.canResendMessages,
          disabled: !this.isInNegotiation || this.isPaused || this.isCanceled,
          action: () => this.disputeAction('resend-messages'),
          tooltip: (this.isInNegotiation ? 'Reenviar mensagens automáticas' : 'A disputa precisa estar em negociação para reagendar mensagens automáticas')
        },
        {
          name: 'cancel-messages',
          icon: 'cancel-messages',
          disabled: this.isPaused || this.isCanceled,
          condition: () => !this.tableActions && !this.isPreNegotiation,
          action: () => this.disputeAction('cancel-messages'),
          tooltip: 'Cancelar mensagens automáticas'
        },
        {
          name: 'change-negotiators',
          icon: 'delegate',
          disabled: this.isCanceled,
          condition: () => !this.tableActions && !this.isPreNegotiation,
          action: () => this.openEditNegotiatorsDialog(),
          tooltip: 'Alterar negociador'
        },
        {
          name: 'enrich',
          icon: 'enrich',
          disabled: this.isPaused || this.isCanceled || this.dispute?.favorite,
          condition: () => !this.tableActions && !this.isPreNegotiation,
          action: () => this.disputeAction('enrich'),
          tooltip: this.dispute?.favorite ? 'Disputa aguardando análise da empresa não permite enriquecer' : 'Enriquecer disputa'
        },
        {
          name: 'counterproposal',
          icon: 'proposal',
          disabled: this.isPaused || this.isCanceled,
          condition: () => this.canSendCounterproposal,
          action: () => this.disputeAction('counterproposal'),
          tooltip: 'Contraproposta manual'
        },
        {
          name: 'renegotiate',
          icon: 'move-to-running',
          disabled: this.isPaused,
          condition: () => this.canMoveToRunning,
          action: () => this.disputeAction('renegotiate'),
          tooltip: 'Retornar para negociação'
        },
        {
          name: 'set-unread',
          icon: 'unread',
          condition: () => this.canMarkAsNotRead || this.isCanceled,
          action: () => this.setAsUnread(),
          tooltip: 'Marcar como não lida'
        },
        {
          name: 'permanently-leave',
          icon: 'hammer',
          disabled: this.isCanceled,
          condition: () => this.isPreNegotiation || this.isCanceled,
          action: () => { this.dropLawsuitDialogVisible = true },
          tooltip: 'Cancelar negociação'
        },
        {
          name: 'start-negotiation',
          icon: 'right-arrow',
          disabled: this.isPaused,
          condition: () => this.isPreNegotiation,
          action: () => this.goToNegotiation(),
          tooltip: 'Iniciar negociação'
        },
        {
          name: 'open-new-tab',
          icon: 'external-link',
          condition: () => this.tableActions,
          action: () => this.openNewTab(),
          tooltip: 'Abrir disputa em nova aba'
        },
        {
          name: 'upload-file',
          icon: 'upload-file',
          condition: () => !this.isPreNegotiation,
          action: () => this.handleAttachmentDialogVisable(),
          tooltip: 'Enviar anexo'
        },
        {
          name: 'favorite',
          icon: this.dispute.favorite ? 'offices-tower-active' : 'offices-tower',
          condition: () => !this.isPreNegotiation,
          action: () => this.disputeAction(this.dispute.favorite ? 'disfavor' : 'favorite'),
          tooltip: `${this.$t('action.FAVORITE')}`
        },
        {
          name: 'export',
          icon: 'el-icon-printer',
          isElementIcon: true,
          condition: () => true,
          action: () => window.open(`/#/print/negotiation/${this.$route?.params?.id || this.dispute?.id}?tab=${this.disputeTabToTicketTab}`, '_blank'),
          tooltip: 'Imprimir disputa'
        },
        {
          name: 'redirect',
          icon: 'switch',
          condition: () => true,
          action: () => this.redirectNegotiation(),
          tooltip: 'Ir para negociação'
        }
      ]
    },

    disputeTabToTicketTab() {
      return { 1: 'MESSAGES', 2: 'NOTES', 3: 'OCCURRENCES' }[Number(this.tab)]
    },

    isPaused() {
      return this.dispute?.paused
    },

    isCanceled() {
      return this.dispute?.status === 'CANCELED'
    },

    canSettled() {
      return this.dispute?.status !== 'SETTLED' && !this.isPreNegotiation
    },

    canUnsettled() {
      return this.dispute?.status !== 'UNSETTLED' && !this.isPreNegotiation
    },

    canResume() {
      return this.dispute && this.dispute.paused && !this.isPreNegotiation
    },

    canPause() {
      return this.dispute && !this.dispute.paused && !this.isPreNegotiation && !['EXPIRED'].includes(this.dispute?.status)
    },

    canMarkAsNotRead() {
      return this.dispute?.status && !['IMPORTED', 'ENRICHED', 'ENGAGEMENT'].includes(this.dispute.status) && !this.isPreNegotiation
    },

    canSendCounterproposal() {
      return this.dispute?.status && !['CHECKOUT', 'ACCEPTED', 'SETTLED', 'UNSETTLED'].includes(this.dispute.status) && !this.isPreNegotiation
    },

    canMoveToRunning() {
      return this.dispute?.status && ['CHECKOUT', 'ACCEPTED', 'SETTLED', 'UNSETTLED', 'CANCELED'].includes(this.dispute.status) && !this.isPreNegotiation
    },

    canRestartEngagement() {
      return this.dispute?.status && !['CHECKOUT', 'ACCEPTED', 'SETTLED', 'UNSETTLED', 'EXPIRED'].includes(this.dispute.status) && !this.isPreNegotiation
    },

    isPreNegotiation() {
      return this.dispute.status === 'PRE_NEGOTIATION'
    },

    isInNegotiation() {
      return this.dispute.status === 'RUNNING'
    },

    canResendMessages() {
      return !this.tableActions && !this.isPreNegotiation
    },

    isAccepted() {
      return this.dispute ? ['CHECKOUT', 'ACCEPTED', 'SETTLED', 'UNSETTLED'].includes(this.dispute.status) : null
    },

    checkUpperRangeCounterOffer() {
      return this.isRecovery ? this.counterOfferForm.lastCounterOfferValue < this.dispute.disputeUpperRange : this.counterOfferForm.lastCounterOfferValue > this.dispute.disputeUpperRange
    },

    isInsufficientUpperRange() {
      return this.unsettledType === 'INSUFFICIENT_UPPER_RANGE'
    },

    workspaceNegotiators() {
      return this.$store.getters.workspaceMembers.map(member => {
        const newMember = {}
        newMember.key = member.person.id
        newMember.label = member.person.name
        newMember.value = member.person.id
        return newMember
      })
    },

    disputeClaimants() {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'CLAIMANT')
      }
      return []
    },

    authorsResume() {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'CLAIMANT', 'PARTY').map(role => {
          return role.name
        }).join(', ')
      }
      return []
    },

    lawyersResume() {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'CLAIMANT', 'LAWYER').map(role => {
          return role.name
        }).join(', ')
      }
      return []
    },

    respondentsResume() {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'RESPONDENT', 'PARTY').map(role => {
          return role.name
        }).join(', ')
      }
      return []
    }
  },

  beforeMount() {
    if (!Object.keys(this.dropLawsuitReasons).length) {
      this.getDropLawsuitReasons()
    }
  },

  methods: {
    ...mapActions([
      'deleteDocument',
      'disputeSetVisualized',
      'removeDispute',
      'sendDisputeAction',
      'sendDisputeNote',
      'startNegotiation',
      'getDropLawsuitReasons',
      'cancelTicket',
      'setAccountProperty',
      'getDisputeStatuses'
    ]),

    redirectNegotiation() {
      const negotiationRoute = `/negotiation/${this.dispute.id || this.$route.params.id}`
      this.$jusSegment('Chaveia de gerenciamento para negociação', {})
      this.$router.push({ path: negotiationRoute })
    },

    // TODO: Transformar isso em um util
    scapeHtml(text) {
      return text.replace(/(<([^>]+)>)/gi, '')
    },

    handleActionNotify(key, value) {
      const propertie = {}

      propertie[key] = value

      this.setAccountProperty(propertie)
    },

    disputeAction(action, additionParams) {
      let message = {
        content: 'Tem certeza que deseja realizar esta ação?',
        title: this.$options.filters.capitalize(this.$t('action.' + action.toUpperCase()))
      }

      this.offerFormType = action.toUpperCase()

      switch (action) {
        case 'settled':
          if (this.dispute.paused) {
            message = {
              content: 'A disputa está pausada, deseja despausar negociação para ganhar?',
              title: 'Despausar negociação'
            }
            this.doAction('resume', message).then(() => {
              if (this.dispute.status === 'CHECKOUT' || this.dispute.status === 'ACCEPTED') {
                this.ticketResumeDialogVisible = true
              } else {
                this.disputeAction(action, additionParams)
              }
            })
          } else {
            if (!this.features.DRAFT_MANAGEMENT && !['PRE_NEGOTIATION', 'CHECKOUT', 'SETTLED'].includes(this.dispute.status) && !additionParams?.forceStatus) {
              this.counterOfferForm.forceStatus = 'SETTLED'
              this.disputeAction(action, { ...additionParams, forceStatus: 'SETTLED' })

              // this.$refs.setSettledDialog.open((status) => {
              //   this.counterOfferForm.forceStatus = status
              //   this.disputeAction(action, { ...additionParams, forceStatus: status })
              // })
            } else if (this.dispute.status === 'CHECKOUT' || this.dispute.status === 'ACCEPTED') {
              this.ticketResumeDialogVisible = true
            } else {
              this.openSettledDialog(action)
            }
          }
          break
        case 'send_settled':
          this.sendCounterproposal(true)
          break
        case 'unsettled':
          this.unsettledType = null
          this.getDisputeStatuses('UNSETTLED')
          this.openSettledDialog(action)
          break
        case 'send-unsettled':
          if (this.isInsufficientUpperRange) {
            this.disputeAction('send_counterproposal')
          } else {
            additionParams = {
              body: {
                reason: this.disputeStatuses.UNSETTLED[this.unsettledType],
                conclusionNote: this.scapeHtml(this.counterOfferForm.note),
                note: this.scapeHtml(this.counterOfferForm.note)
              }
            }
            this.doAction('unsettled', message, additionParams).then(() => {
              this.chooseUnsettledDialogVisible = false
            }).finally(() => {
              this.unsettledType = null
              this.closeCounterProposalModal()
            })
          }
          break
        case 'resume':
          this.doAction(action, message)
          break
        case 'paused':
          this.doAction(action, message)
          break
        case 'restart-engagement':
          this.checkIsntManualStrategy(action).then(() => {
            this.doAction(action, message)
          })
          break
        case 'resend-messages':
          this.checkIsntManualStrategy(action).then(() => {
            this.doAction(action, message)
          })
          break
        case 'cancel-messages':
          this.checkIsntManualStrategy(action).then(() => {
            this.doAction(action, message)
          })
          break
        case 'edit-negotiators':
          additionParams = { negotiatorsId: additionParams }
          this.doAction(action, message, additionParams).then(() => {
            this.editNegotiatorDialogVisible = false
          })
          break
        case 'enrich':
          if (this.isAccepted) {
            message.title = 'Atenção!'
            message.content = `Você está solicitando o <b>ENRIQUECIMENTO</b> de uma disputa que já
          foi finalizada. Este processo irá agendar novamente as mensagens
          para as partes quando finalizado. Você deseja enriquecer mesmo assim?`
          }
          this.doAction(action, message)
          break
        case 'renegotiate':
          this.doAction(action, message).then(() => {
            if (this.dispute.hasDocument) {
              this.$confirm('Esta disputa possui documento gerado, deseja exclui-lo?', 'Excluir documento', {
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Cancelar',
                cancelButtonClass: 'is-plain',
                type: 'warning'
              }).then(() => {
                this.deleteDocument(this.dispute.id).then(() => {
                  this.$jusNotification({
                    type: 'success',
                    title: 'Yay!',
                    message: 'Documento excluido com sucesso'
                  })
                })
              })
            }
          })
          break
        case 'counterproposal':
          if (this.dispute.paused) {
            message = {
              content: 'A disputa está pausada, deseja despausar negociação para enviar uma contraproposta?',
              title: 'Despausar negociação'
            }
            this.doAction('resume', message).then(() => {
              this.openCounterproposalDialog()
            })
          } else {
            this.openCounterproposalDialog()
          }
          break
        case 'send_counterproposal':
          if (this.unsettledType === 'INSUFFICIENT_UPPER_RANGE') {
            this.sendCounterproposal().then(() => {
              additionParams = {
                body: {
                  reason: this.disputeStatuses.UNSETTLED[this.unsettledType],
                  conclusionNote: this.scapeHtml(this.counterOfferForm.note),
                  note: this.scapeHtml(this.counterOfferForm.note)
                }
              }
              this.doAction('unsettled', message, additionParams).then(() => {
                this.chooseUnsettledDialogVisible = false
              }).finally(() => {
                this.unsettledType = null
              })
            }).finally(this.closeCounterProposalModal)
          } else if (additionParams) {
            this.checkCounterproposal('WIN').then(() => {
              if (this.checkUpperRangeCounterOffer) {
                this.sendCounterproposal(additionParams).then().finally(this.closeCounterProposalModal)
              } else {
                this.sendCounterproposal().then().finally(this.closeCounterProposalModal)
              }
            })
          } else {
            this.checkCounterproposal('COUNTERPROPOSAL').then((updateUpperRange) => {
              this.sendCounterproposal(updateUpperRange).then().finally(this.closeCounterProposalModal)
            })
          }
          break
        case 'favorite':
          this.handleFavorite()
          break
        case 'disfavor':
          this.handleDisfavor()
          break
      }
    },

    handleFavorite() {
      const showNotify = this.userPreferences.properties?.FAVORITE_NOTIFICATION === 'ALWAYS'

      this.$refs.confirmActionDialog.handleNotify = (value) => this.handleActionNotify('FAVORITE_NOTIFICATION', value ? 'ALWAYS' : '')
      this.$refs.confirmActionDialog.handleConfirm = () => this.handleAction('favorite', {}).then(() => {
        this.$jusSegment('ACTIVE_fAVORITE', { ...this.dispute })
        this.$jusNotification({
          title: 'Yay!',
          message: 'Ação <b>' + this.$options.filters.capitalize(this.$t('actions.FAVORITE.name')) + '</b> realizada com sucesso.',
          type: 'success',
          dangerouslyUseHTMLString: true
        })

        this.$refs.notifyOnCompanyAnalysis.open('FAVORITE', this.dispute)
      })

      this.$refs.confirmActionDialog.open({
        visible: true,
        showNotifyInput: showNotify,
        title: this.$options.filters.capitalize(this.$t('actions.FAVORITE.name')),
        notify: showNotify,
        action: 'FAVORITE'
      })
    },

    handleDisfavor() {
      const showNotify = this.userPreferences.properties?.FAVORITE_NOTIFICATION === 'ALWAYS'

      this.$refs.confirmActionDialog.handleNotify = (value) => this.handleActionNotify('FAVORITE_NOTIFICATION', value ? 'ALWAYS' : '')
      this.$refs.confirmActionDialog.handleConfirm = () => this.handleAction('disfavor', {}).then(() => {
        this.$jusSegment('DEACTIVE_fAVORITE', { ...this.dispute })
        this.$jusNotification({
          title: 'Yay!',
          message: 'Ação <b>' + this.$options.filters.capitalize(this.$t('actions.DISFAVOR.name')) + '</b> realizada com sucesso.',
          type: 'success',
          dangerouslyUseHTMLString: true
        })

        this.$refs.notifyOnCompanyAnalysis.open('DISFAVOR', this.dispute)
      })

      this.$refs.confirmActionDialog.open({
        visible: true,
        showNotifyInput: showNotify,
        title: this.$options.filters.capitalize(this.$t('actions.DISFAVOR.name')),
        notify: showNotify
      })
    },

    handleSettled() {
      const message = {
        content: 'Tem certeza que deseja realizar esta ação?',
        title: this.$options.filters.capitalize(this.$t('action.SETTLED'))
      }
      this.counterOfferForm.note = this.winNote
      this.doAction('settled', message)
    },

    closeCounterProposalModal() {
      this.counterOfferForm.note = ''
      this.settledDialogVisible = false
    },

    handleAction(action, additionParams) {
      let params = {
        action,
        disputeId: this.dispute.id,
        body: {
          note: this.counterOfferForm.note,
          conclusionNote: this.counterOfferForm.note,
          forceStatus: this.counterOfferForm.forceStatus
        }
      }

      if (additionParams) params = { ...params, ...additionParams }

      return this.sendDisputeAction(params)
    },

    doAction(action, message, additionParams) {
      return new Promise((resolve, reject) => {
        this.$confirm(message.content, message.title, {
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          cancelButtonClass: 'is-plain',
          dangerouslyUseHTMLString: true,
          showClose: false
        }).then(() => {
          this.modalLoading = true

          this.handleAction(action, additionParams).then(() => {
            resolve()

            this.$jusNotification({
              title: 'Yay!',
              message: 'Ação <b>' + message.title.toUpperCase() + '</b> realizada com sucesso.',
              type: 'success',
              dangerouslyUseHTMLString: true
            })

            this.counterOfferForm.note = ''
            this.$delete(this.counterOfferForm, 'forceStatus')

            if (action === 'settled') {
              this.ticketResumeDialogVisible = false
            }

            if (['disfavor', 'favorite'].includes(action) && this.isJusttoAdmin) {
              this.$refs.notifyOnCompanyAnalysis.open(action.toUpperCase(), this.dispute)
            }
          }).catch(error => {
            reject(error)
            this.$jusNotification({ error })
          }).finally(() => {
            this.modalLoading = false
          })
        })
      })
    },

    checkIsntManualStrategy(action) {
      return new Promise((resolve, reject) => {
        if ((['restart-engagement', 'resend-messages', 'cancel-messages'].includes(action)) && (this.dispute.strategyId === 25 || this.dispute.strategyId === 26)) {
          this.$alert('Esta disputa está com uma estratégia de <b>engajamento manual</b>. Se deseja realizar engajamento automático, edite a disputa e escolha uma estratégia de engajamento adequada', {
            title: this.$options.filters.capitalize(this.$t('action.' + action.toUpperCase())),
            dangerouslyUseHTMLString: true,
            confirmButtonText: 'OK',
            showClose: false
          })
          reject(new Error('A estratégia dessa disputa é manual. Mude a estratégial para poder Reiniciar Dispute, Reiniciar Engajamento ou Cancelar Mensagens'))
        } else {
          resolve()
        }
      })
    },

    setAsUnread() {
      this.disputeSetVisualized({
        visualized: false,
        disputeId: this.dispute.id,
        anonymous: false
      }).then(() => {
        if (this.$store.state.disputeModule.tab === '9') this.$router.push('/management/all')
        else this.$router.push('/management')
      }).catch(error => {
        this.$jusNotification({ error })
      })
    },

    validateForm(ref) {
      return new Promise((resolve, reject) => {
        this.$refs[ref].validate(valid => {
          if (valid) resolve()
          else reject(new Error('Campos obrigatórios não preenchidos'))
        })
      })
    },

    handleDropLawsuit() {
      this.modalLoading = true
      const disputeId = this.$route?.params?.id || this?.dispute?.id
      const { reason, conclusionNote } = this.dropLawsuitForm
      this.validateForm('dropLawsuitForm')
        .then(() => {
          this.cancelTicket({ disputeId, reason, conclusionNote })
            .then(() => {
              this.$jusNotification({
                message: 'Disputa cancelada com sucesso.',
                title: 'Yay!',
                type: 'success'
              })
              this.dropLawsuitDialogVisible = false
              this.$jusSegment('Cancelamento de disputa pelo /management', { disputeId })
            })
            .catch(error => this.$jusNotification({ error }))
        })
        .finally(() => { this.modalLoading = false })
    },

    goToNegotiation() {
      this.startNegotiation(this.dispute.id)
      this.$jusSegment('Negociação iniciada na disputa', { disputeId: this.dispute.id })
    },

    openNewTab() {
      const routeData = this.$router.resolve({ name: 'dispute', params: { id: this.dispute.id } })
      window.open(routeData.href, '_blank')
      this.$emit('open:newtab')
    },

    togleCollapsed() {
      this.collapsed = !this.collapsed
    },

    openSettledDialog(action) {
      this.modalLoading = false
      this.counterOfferForm.lastCounterOfferValue = this.dispute.lastCounterOfferValue || this.dispute.lastOfferValue
      if (this.disputeClaimants.length === 1) {
        this.counterOfferForm.selectedRoleId = this.disputeClaimants[0].id
      } else if (this.dispute.lastCounterOfferName && this.disputeClaimants.map(c => c.name).includes(this.dispute.lastCounterOfferName)) {
        this.counterOfferForm.selectedRoleId = this.disputeClaimants.filter(c => {
          return c.name === this.dispute.lastCounterOfferName
        })[0].id
      } else {
        this.counterOfferForm.selectedRoleId = ''
      }
      if (action === 'settled') {
        this.settledDialogVisible = true
      } else {
        this.chooseUnsettledDialogVisible = true
      }
      if (this.$refs.counterOfferForm) {
        this.$refs.counterOfferForm.clearValidate()
      }
    },

    async openEditNegotiatorsDialog() {
      const workspaceNegotiatorsIds = this.workspaceNegotiators.map(({ value }) => value) || []

      this.modalLoading = false

      this.disputeNegotiators = this.dispute.disputeRoles.filter(member => {
        return member.roles.includes('NEGOTIATOR') && !member.archived && workspaceNegotiatorsIds.includes(member.personId)
      }).map(member => member.personId)

      this.editNegotiatorDialogVisible = true
    },

    openCounterproposalDialog() {
      this.modalLoading = false
      this.counterOfferForm.lastCounterOfferValue = ''
      this.counterOfferForm.selectedRoleId = this.disputeClaimants.length === 1 ? this.disputeClaimants[0].id : ''
      this.counterproposalDialogVisible = true
      if (this.$refs.counterOfferForm) {
        this.$refs.counterOfferForm.clearValidate()
      }
    },

    handleAttachmentDialogVisable() {
      this.uploadAttacmentDialogVisable = !this.uploadAttacmentDialogVisable
    },

    checkCounterproposal(actionType) {
      return new Promise((resolve, reject) => {
        this.$refs.counterOfferForm.validate(valid => {
          if (valid) {
            if (this.checkUpperRangeCounterOffer) {
              const winTxt = `O valor inserido <b>irá ${this.isRecovery ? 'adequar' : 'majorar'}</b> ${this.$tc('UPPER_RANGE', this.isRecovery)}. Deseja continuar?`
              if (actionType === 'WIN') {
                this.$confirm(winTxt, 'Atenção!', {
                  confirmButtonText: 'Continuar',
                  cancelButtonText: 'Cancelar',
                  cancelButtonClass: 'is-plain',
                  dangerouslyUseHTMLString: true,
                  showClose: false
                }).then(resolve).catch(e => {
                  reject(e)
                })
              } else {
                const tag = this.$createElement
                this.$confirm(tag('div', null, [
                  tag('p', null, `Valor da contraproposta é ${this.isRecovery ? 'menor' : 'maior'} que o d${this.$tc('UPPER_RANGE_WITH_ARTICLE', this.isRecovery)}!`),
                  tag('br', null, ''),
                  tag('p', null, [
                    tag('span', { style: { color: '#FF4B54' } }, '*'),
                    tag('small', null, [
                      'Ao clicar em ',
                      tag('strong', null, this.isRecovery ? 'Adequar' : 'Majorar'),
                      ', será feita a ',
                      tag('strong', null, 'contraproposta'),
                      (this.isRecovery ? ', o ' : ', a '),
                      tag('strong', null, this.$tc('UPPER_RANGE', this.isRecovery)),
                      ' será ' + (this.isRecovery ? 'adequado' : 'majorada') + ' para o ',
                      tag('strong', null, 'valor'),
                      ' da contraproposta e a disputa será alterada para ',
                      tag('strong', null, 'Proposta Aceita'),
                      '.'
                    ])
                  ]),
                  tag('br', null, ''),
                  tag('p', null, [
                    tag('span', { style: { color: '#FF4B54' } }, '*'),
                    tag('small', null, [
                      'Ao clicar em ',
                      tag('strong', null, `Não ${this.isRecovery ? 'adequar' : 'majorar'}`),
                      ', somente será feita a contraproposta, sem alterações no status da disputa.'
                    ])
                  ])
                ]), `${this.isRecovery ? 'Adequar' : 'Majorar'} ${this.$tc('UPPER_RANGE_WITH_ARTICLE', this.isRecovery)}?`, {
                  distinguishCancelAndClose: true,
                  dangerouslyUseHTMLString: true,
                  closeOnClickModal: false,
                  closeOnPressEscape: false,
                  showClose: false,
                  confirmButtonText: 'Não ' + (this.isRecovery ? 'Adequar' : 'Majorar'),
                  cancelButtonText: this.isRecovery ? 'Adequar' : 'Majorar'
                }).then(() => {
                  resolve(false)
                }).catch(() => {
                  resolve(true)
                })
              }
            } else {
              resolve()
            }
          } else {
            reject(new Error('Invalid Fields'))
          }
        })
      })
    },

    sendCounterproposal(updateUpperRange) {
      return new Promise((resolve, reject) => {
        this.$refs.counterOfferForm.validate(valid => {
          if (valid) {
            this.modalLoading = true
            this.$store.dispatch('getDisputeDTO', this.dispute.id).then(disputeToEdit => {
              this.$store.dispatch('sendDisputeCounterProposal', {
                disputeId: this.dispute.id,
                objectId: disputeToEdit.objects[0].id,
                value: this.counterOfferForm.lastCounterOfferValue.toString(),
                roleId: this.counterOfferForm.selectedRoleId,
                note: this.scapeHtml(this.counterOfferForm.note),
                updateUpperRange: updateUpperRange || false,
                action: this.offerFormType,
                forceStatus: this.counterOfferForm.forceStatus
              }).then(() => {
                resolve()
                this.counterproposalDialogVisible = false
                this.settledDialogVisible = false
                this.$jusNotification({
                  title: 'Yay!',
                  message: updateUpperRange ? 'Proposta aceita com sucesso.' : 'Contraproposta enviada com sucesso.',
                  type: 'success'
                })
              }).catch(error => {
                reject(error)
                this.$jusNotification({ error })
              }).finally(() => {
                this.modalLoading = false
              })
            })
          } else {
            reject(new Error('Invalid Fields'))
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.el-dialog__wrapper {
  div {
    .el-dialog__body {
      .dialog__textarea-note {
        margin: 8px 0px;
      }
    }
    .el-dialog__footer {
      margin-top: 8px;
    }
  }
}

.jus-dispute-actions {
  &__choose-unsettled-dialog {
    .el-message-box__content {
      padding: 10px 0;
    }
    .el-select {
      width: 100%;
    }
  }
  &__upload-dialog {
    .el-dialog__body {
      height: 300px;
    }
  }

  .jus-dispute-actions__actions-buttons {
    .jus-dispute-actions__actions-icons {
      width: 16px;
      height: 16px;

      &.el-icon {
        font-size: 19px;
        width: 19px;
        height: 19px;
      }
    }
  }

  &.jus-dispute-actions--dispute {
    padding: 12px 0px 12px 20px;
    box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.06);
    z-index: 1;

    .jus-dispute-actions__actions-buttons {
      border-radius: 6px;
      padding: 12px;
      margin-right: 8px;
    }

    .jus-dispute-actions__collapse-button {
      color: #424242;
      padding: 8px 10px 0;
      float: right;
      border-color: transparent !important;
      i { font-size: 26px; }
    }

    .jus-dispute-actions__back-button {
      margin-right: 20px;
      vertical-align: text-top;
    }
  }
  &.jus-dispute-actions--table {
    background: linear-gradient(to right, rgba(246,246,246,0) 0%, rgba(246,246,246,1) 10%);
    padding: 0 20px 0 28px;
    position: absolute;
    display: flex;
    align-items: center;
    height: 100%;
    right: 0;
    top: 0;

    .jus-dispute-actions__actions-buttons {
      margin-left: 6px;
    }
  }
}
.is-disabled-input {
  background-color: #f6f6f6;
  cursor: not-allowed;
  &:hover {
    border-color: #dcdfe6 !important;
  }
}
</style>
