<template>
  <div>
    <div
      :class="{'active': active}"
      class="management-actions"
    >
      <div
        v-show="selectedLenghtToShow"
        class="management-actions__length"
      >
        <i class="el-icon-check" /> {{ selectedLenghtToShow }}
      </div>

      <div>
        <span
          v-for="action in actionsList.filter(({ main, tabs }) => (main && tabs.includes(activeTab)))"
          :key="action.name"
        >
          <el-button
            :data-testid="`batch-${action.name.toLowerCase()}`"
            :disabled="!canDoAction(action.name)"
            plain
            @click="sendBatchAction(action.name)"
          >
            <el-tooltip
              :disabled="!action.tooltip"
              :content="action.tooltip ? $tc(`action.tooltip.${action.tooltip}`, selectedLenghtToShow) : ''"
            >
              <jus-icon
                v-if="action.icon"
                :class="action.class"
                :icon="action.icon"
              />
              <span v-else>
                {{ $t(`action.${action.name}`) }}
              </span>
            </el-tooltip>
          </el-button>
        </span>

        <el-dropdown
          trigger="click"
          placement="bottom"
          class="management-action__dropdown"
          @command="sendBatchAction"
        >
          <el-button
            type="text"
            icon="el-icon-menu"
          />

          <el-dropdown-menu
            slot="dropdown"
            class="management-action__dropdown-menu"
          >
            <el-dropdown-item
              v-for="action in actionsList.filter(({ main, tabs }) => !main && tabs.includes(activeTab))"
              :key="action.name"
              :command="action.name"
              :disabled="!canDoAction(action.name)"
            >
              <el-tooltip
                :disabled="!action.tooltip"
                :content="action.tooltip ? $tc(`action.tooltip.${action.tooltip}`, selectedLenghtToShow) : ''"
              >
                <jus-icon
                  v-if="action.icon"
                  :class="action.class"
                  :icon="action.icon"
                />
                <span v-else>
                  {{ $t(`action.${action.name}`) }}
                </span>
              </el-tooltip>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <i
        class="el-icon-close"
        @click="clearSelection()"
      />
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="chooseSettledDialogVisible"
      title="Ganhar"
      class="management-actions__dialog"
      width="460px"
      data-testid="unsettled-dialog"
    >
      <div>
        <label>{{ $t('dispute.labels.note') }}:</label>
        <el-input
          v-model="note"
          placeholder="Insira uma nota."
          type="textarea"
          :row="8"
        />
      </div>
      <span slot="footer">
        <el-button
          plain
          @click="chooseSettledDialogVisible = false"
        >Cancelar</el-button>
        <el-button
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="doAction('SETTLED')"
        >
          Continuar
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showUpdateEngagementOptions"
      :title="$tc('action.UPDATE_ENGAGEMENT_OPTIONS')"
      class="management-actions__dialog"
    >
      <div>
        <div class="jus-import-feedback-card__switch">
          <i class="el-icon-circle-check el-input__icon--success" />

          <div class="content">
            <div>Enviar mensagem para autor e advogado</div>

            <p>
              Deixando <b>selecionada</b> esta opção, também iremos enviar mensagens para o autor.
            </p>
          </div>

          <el-switch
            v-model="engagementOptions.alwaysContactParty"
            @change="resetEngagementOptions"
          />
        </div>

        <div
          v-if="!engagementOptions.alwaysContactParty"
          class="jus-import-feedback-card__switch"
        >
          <i class="el-icon-circle-check el-input__icon--success" />

          <div class="content">
            <div>Enviar mensagem para o autor somente se não tiver advogado</div>

            <p>
              Deixando <b>selecionada</b> esta opção, iremos enviar mensagens para o autor quando não houver advogado constituído.
            </p>
          </div>

          <el-switch v-model="engagementOptions.onlyContactPartyWithoutLawyer" />
        </div>

        <div
          v-if="!engagementOptions.alwaysContactParty"
          class="jus-import-feedback-card__switch"
        >
          <i class="el-icon-circle-check el-input__icon--success" />

          <div class="content">
            <div>Enviar mensagem para autor somente se advogado não possuir contatos válidos para ser engajado</div>

            <p>
              Deixando <b>selecionada</b> esta opção, iremos enviar mensagens para o autor se o <b>advogado não possuir dados válidos</b> para ser contatado.
            </p>
          </div>

          <el-switch v-model="engagementOptions.onlyContactPartyWithInvalidLawyer" />
        </div>
      </div>

      <span slot="footer">
        <el-button
          plain
          @click="showUpdateEngagementOptions = false"
        >Cancelar</el-button>
        <el-button
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="doAction('UPDATE_ENGAGEMENT_OPTIONS')"
        >
          Continuar
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="chooseUnsettledDialogVisible"
      title="Perder"
      class="management-actions__dialog"
      width="460px"
      data-testid="unsettled-dialog"
    >
      <div class="el-message-box__content">
        <div class="el-message-box__container">
          <div class="el-message-box__status el-icon-warning" />
          <div class="el-message-box__message">
            <p>Tem certeza que deseja perder esta disputa?.</p>
          </div>
        </div>
      </div>
      <el-select
        v-model="unsettledType"
        v-loading="$store.state.loading"
        filterable
        data-testid="select-unsettled"
        placeholder="Escolha o motivo da perda"
      >
        <el-option
          v-for="(type, index) in disputeStatuses.UNSETTLED"
          :key="index"
          :label="type"
          :value="index"
        />
      </el-select>
      <div style="margin: 8px 0px;">
        <label>{{ $t('dispute.labels.note') }}:</label>
        <el-input
          v-model="note"
          placeholder="Insira uma nota."
          type="textarea"
          :row="4"
        />
      </div>
      <span slot="footer">
        <el-button
          plain
          @click="chooseUnsettledDialogVisible = false"
        >Cancelar</el-button>
        <el-button
          :disabled="!unsettledType"
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="doAction('UNSETTLED')"
        >
          Continuar
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="changeStrategyDialogVisible"
      title="Alterar estratégia"
      class="management-actions__dialog"
      width="460px"
      data-testid="strategy-dialog"
    >
      <el-select
        v-model="newStrategyId"
        placeholder="Escolha a nova estratégia"
        data-testid="select-unsettled"
      >
        <el-option
          v-for="strategy in strategies"
          :key="strategy.id"
          :value="strategy.id"
          :label="strategy.name"
        />
      </el-select>
      <span slot="footer">
        <el-button
          plain
          @click="changeStrategyDialogVisible = false"
        >Cancelar</el-button>
        <el-button
          :disabled="!newStrategyId"
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="doAction('CHANGE_STRATEGY')"
        >
          Alterar
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="changeExpirationDialogVisible"
      title="Alterar data limite da negociação"
      class="management-actions__dialog"
      width="460px"
      data-testid="expiration-dialog"
    >
      <el-date-picker
        v-model="newExpirationDate"
        :clearable="false"
        data-testid="expiration-date-input"
        format="dd/MM/yyyy"
        type="date"
        placeholder="Escolha a data limite"
        value-format="yyyy-MM-dd"
      />
      <span slot="footer">
        <el-button
          plain
          @click="changeExpirationDialogVisible = false"
        >Cancelar</el-button>
        <el-button
          :disabled="!newExpirationDate"
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="doAction('CHANGE_EXPIRATION_DATE')"
        >
          Alterar
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="changeNegotiatorDialogVisible"
      title="Alterar negociadores"
      class="management-actions__dialog"
      width="604px"
    >
      <div
        v-if="disputeNegotiatorMap.length"
        class="el-message-box__content"
      >
        <div class="el-message-box__container">
          <div class="el-message-box__status el-icon-info" />
          <div class="el-message-box__message">
            <p>
              Alterando
              {{ disputeNegotiatorMap[currentDisputeNegotiator].disputes.length }}
              disputas num total de
              {{ allSelectedDisputes }}.
            </p>
          </div>
        </div>
      </div>
      <br>
      <el-transfer
        v-model="disputeNegotiators"
        v-loading="changeNegotiatorDialogLoading"
        :titles="['Equipe', 'Disputa']"
        :button-texts="['Remover', 'Adicionar']"
        :data="workspaceNegotiators"
        filter-placeholder="Buscar"
        filterable
      />
      <span slot="footer">
        <el-button
          :disabled="changeNegotiatorDialogLoading"
          plain
          @click="changeNegotiatorDialogVisible = false"
        >Cancelar</el-button>
        <el-button
          :loading="changeNegotiatorDialogLoading"
          :disabled="!disputeNegotiators.length"
          type="primary"
          @click="changeNegotiator()"
        >
          Alterar
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="chooseDeleteDialogVisible"
      class="management-actions__dialog"
      title="Excluir disputa"
      width="460px"
    >
      <div class="el-message-box__content">
        <div class="el-message-box__container">
          <div class="el-message-box__status el-icon-warning" />
          <div class="el-message-box__message">
            <p>Tem certeza que deseja excluir esta disputa? Esta ação é irreversível.</p>
          </div>
        </div>
      </div>
      <el-select
        v-model="deleteType"
        style="width: 100%;"
        placeholder="Escolha o motivo da exclusão"
      >
        <el-option
          v-for="(type, index) in disputeStatuses.ARCHIVED"
          :key="index"
          :label="type"
          :value="index"
        />
      </el-select>
      <span slot="footer">
        <el-button
          plain
          @click="chooseDeleteDialogVisible = false"
        >
          Cancelar
        </el-button>
        <el-button
          :disabled="!deleteType"
          type="primary"
          @click.prevent="doAction('DELETE')"
        >
          Excluir
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      width="60%"
      :visible.sync="showBulkMessageDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog__bulk-message"
      append-to-body
      @before-close="closeBulkMessageDialog()"
    >
      <span class="dialog-body__header">
        <span class="dialog-body__header-text-info">
          <i class="el-icon-warning" />
          Essa mensagem será enviada para a(s) {{ selectedLenghtToShow }} disputa(s) selecionada(s)
        </span>

        <span class="dialog-body__header-recipients">
          <span class="dialog-body__recipients-label">
            Destinatarios:
          </span>

          <el-checkbox-group
            v-model="partyRoles"
            class="dialog-body__recipients-checkbox"
            size="mini"
            fill="#ffffff"
            @input="$set(hasError, 'partyRoles', false)"
          >
            <el-checkbox-button label="PARTY">
              <i class="el-icon-user-solid" />
              <span>Parte</span>
            </el-checkbox-button>

            <el-checkbox-button label="LAWYER">
              <i class="el-icon-s-custom" />
              <span>Advogado</span>
            </el-checkbox-button>
          </el-checkbox-group>

          <span
            v-if="hasError.partyRoles"
            class="dialog-body__recipients-error"
          >
            * Escolha um destinatário.
          </span>
        </span>
      </span>

      <div class="jus-ckeditor__parent">
        <ckeditor
          v-if="showBulkMessageDialog"
          ref="messageEditor"
          v-model="message"
          class="dialog-body__editor"
          :class="`ckeditor-${_uid}`"
          :editor="editor"
          :config="editorConfig"
          type="classic"
        />
      </div>

      <span slot="footer">
        <el-button @click="closeBulkMessageDialog()">Cancelar</el-button>
        <el-button
          type="primary"
          @click="sendBulkMessage()"
        >
          Enviar
        </el-button>
      </span>
    </el-dialog>

    <!-- DROP_LAWSUIT -->
    <el-dialog
      :visible.sync="showDropLawsuitDialog"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      destroy-on-close
      width="604px"
      title="Cancelar disputa"
      class="dialog-actions__increase-alert"
    >
      <DropLawsuitForm
        @cancel="showDropLawsuitDialog = false"
        @submit="handleDropLawsuit($event)"
      />
    </el-dialog>

    <ImageUploadDialog @input="setImgTag" />
  </div>
</template>

<script>
import { getTracktitleByAction, scapeHtml } from '@/utils'
import { mapGetters, mapActions } from 'vuex'

// Editores
import ckeditor from '@/utils/mixins/ckeditor'

export default {
  name: 'ManagementActions',

  components: {
    DropLawsuitForm: () => import('@/components/layouts/DropLawsuitForm'),
    ImageUploadDialog: () => import('@/components/dialogs/ImageUploadDialog.vue')
  },

  mixins: [ckeditor],

  props: {
    activeTab: {
      type: String,
      required: true
    },
    selectedIds: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      useMentionPlugin: true,
      usePreviewPlugin: true,
      useImageAttachmentPlugin: true,
      showDropLawsuitDialog: false,
      showBulkMessageDialog: false,
      showUpdateEngagementOptions: false,
      engagementOptions: {
        alwaysContactParty: true,
        onlyContactPartyWithoutLawyer: false,
        onlyContactPartyWithInvalidLawyer: false
      },
      chooseSettledDialogVisible: false,
      chooseUnsettledDialogVisible: false,
      changeStrategyDialogVisible: false,
      changeNegotiatorDialogVisible: false,
      changeExpirationDialogVisible: false,
      changeNegotiatorDialogLoading: false,
      chooseDeleteDialogVisible: false,
      disputeNegotiators: [],
      disputeNegotiatorMap: [],
      currentDisputeNegotiator: 0,
      allSelectedDisputes: 0,
      dropLawsuitReason: '',
      message: '',
      note: '',
      unsettledType: '',
      deleteType: '',
      newStrategyId: '',
      newExpirationDate: '',
      partyRoles: [],
      hasError: {}
    }
  },

  computed: {
    ...mapGetters({
      disputeStatuses: 'disputeStatuses',
      strategies: 'getMyStrategiesLite'
    }),

    canDoAction() {
      return (action) => {
        const batchActionsLastUse = JSON.parse(localStorage.getItem('BATCH_ACTIONS_LAST_USE') || '{}')

        const actionLastTime = this.$moment(batchActionsLastUse[action])
        const diferece = this.$moment().diff(actionLastTime, 'seconds')

        switch (action) {
          case 'CHANGE_NEGOTIATOR':
            return diferece >= 60 || diferece === 0
          default:
            return diferece >= 30 || diferece === 0
        }
      }
    },

    selectedIdsComp: {
      get() {
        return this.selectedIds
      },
      set(ids) {
        this.$emit('update:selectedIds', ids)
      }
    },

    disputeId() {
      return this.selectedIds[0]
    },

    active() {
      return this.selectedIdsComp.length >= 1
    },

    actionsList() {
      return [
        {
          name: 'SETTLED',
          tabs: ['1', '2', '3', '4', '9'],
          tooltip: 'SETTLE_DISPUTE',
          main: true
        },
        { name: 'UNSETTLED', tabs: ['1', '2', '3', '4', '9'], main: true },
        { name: 'PAUSED', tabs: ['1', '2', '3', '4', '9'], main: true },
        { name: 'RESUME', tabs: ['1', '2', '3', '4', '9'], main: true },
        { name: 'RESTART_ENGAGEMENT', tabs: ['1', '2', '4', '9'] },
        { name: 'CHANGE_EXPIRATION_DATE', tabs: ['1', '2', '3', '4', '9'] },
        { name: 'CHANGE_STRATEGY', tabs: ['1', '2', '3', '4', '9'] },
        { name: 'CHANGE_NEGOTIATOR', tabs: ['1', '2', '3', '4', '9'] },
        { name: 'ENRICH_DISPUTE', tabs: ['1', '2', '3', '4', '9'] },
        {
          name: 'UPDATE_ENGAGEMENT_OPTIONS',
          tabs: ['0', '1', '2', '9']
        },
        { name: 'DELETE', tabs: ['1', '2', '3', '4', '9'] },
        { name: 'RESEND_MESSAGE', tabs: ['1', '2', '3', '4', '9'] },
        { name: 'DROP_LAWSUIT', tabs: ['0'], main: true },
        { name: 'START_NEGOTIATION', tabs: ['0'], main: true },
        {
          name: 'SEND_BILK_MESSAGE',
          tabs: ['1', '2', '3', '4', '9'],
          tooltip: 'BULK_COMPOSE_MESSAGE',
          class: 'icon-in-bulk',
          icon: 'in-bulk'
        }
      ]
    },

    selectedIdsLength() {
      return this.selectedIdsComp.length
    },

    disputesTotalLength() {
      return this.$store.getters.disputeQuery.total
    },

    selectedLenghtToShow() {
      return this.isSelectedAll ? this.disputesTotalLength : this.selectedIdsLength
    },

    isSelectedAll() {
      return this.$store.getters.disputes.length === this.selectedIdsLength
    },

    workspaceNegotiators() {
      return this.$store.getters.workspaceMembers.map(member => {
        return {
          key: member.person.id,
          label: member.person.name,
          value: member.person.id
        }
      })
    }
  },

  created() {
    this.editorRedy = false
    if (!this.disputeStatuses.UNSETTLED || !Object.keys(this.disputeStatuses.UNSETTLED).length) {
      this.getDisputeStatuses('UNSETTLED')
    }
    if (!this.disputeStatuses.ARCHIVED || !Object.keys(this.disputeStatuses.ARCHIVED).length) {
      this.getDisputeStatuses('ARCHIVED')
    }
    this.$store.dispatch('getMyStrategiesLite')
  },

  methods: {
    ...mapActions([
      'getDisputeStatuses',
      'getFinishedDisputesCount'
    ]),

    teste(event) {
      console.log(event)
    },

    doAction(action) {
      const params = {
        type: action.toUpperCase(),
        disputeIds: this.selectedIds
      }
      switch (action) {
        case 'DROP_LAWSUIT':
          params.type = 'CANCEL_NEGOTIATION'
          params.reasonKey = 'dropLawsuitReason'
          break
        case 'CHANGE_STRATEGY':
          params.strategyId = this.newStrategyId
          break
        case 'CHANGE_EXPIRATION_DATE':
          params.expirationDate = { dateTime: this.$moment(this.newExpirationDate).endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]') }
          break
        case 'DELETE':
          if (this.deleteType) params.reasonKey = this.deleteType
          break
        case 'UNSETTLED':
          if (this.unsettledType) {
            Object.assign(params, {
              unsettledReasons: { [this.unsettledType]: this.disputeStatuses.UNSETTLED[this.unsettledType] },
              note: scapeHtml(this.note)
            })
          }
          break
        case 'SETTLED':
          Object.assign(params, { note: scapeHtml(this.note) })
          break
        case 'UPDATE_ENGAGEMENT_OPTIONS':
          params.engagementOptions = this.engagementOptions
          break
      }
      if (this.isSelectedAll) {
        params.allSelected = true
        params.disputeIds = []
      }
      this.dispatchAction(action, params)
    },

    resetEngagementOptions(value) {
      this.engagementOptions.alwaysContactParty = value
      this.engagementOptions.onlyContactPartyWithoutLawyer = false
      this.engagementOptions.onlyContactPartyWithInvalidLawyer = false
    },

    dispatchAction(action, params) {
      this.$store.dispatch('sendBatchAction', params).then(_response => {
        this.chooseDeleteDialogVisible = false
        this.chooseSettledDialogVisible = false
        this.chooseUnsettledDialogVisible = false
        this.changeStrategyDialogVisible = false
        this.changeExpirationDialogVisible = false
        this.showUpdateEngagementOptions = false
        this.$jusNotification({
          title: 'Yay!',
          message: 'Ação <strong>' + this.$t('action.' + action.toUpperCase()) + '</strong> realizada com sucesso.',
          type: 'success',
          dangerouslyUseHTMLString: true
        })
        // SEGMENT TRACK
        this.$jusSegment(getTracktitleByAction(action, true), { amount: this.selectedIds.length })
        if (action === 'UNSETTLED') {
          setTimeout(() => {
            this.$jusNotification({
              title: 'Atenção!',
              message: 'Enviaremos para às contrapartes uma mensagem de encerramento de negociação.',
              type: 'info',
              duration: 0
            })
          }, 2000)
        }
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.clearSelection()
      })
    },

    openBulkMessageCompose() {
      this.showBulkMessageDialog = true
    },

    closeBulkMessageDialog() {
      this.showBulkMessageDialog = false
      this.message = ''
    },

    sendBulkMessage() {
      const { message, partyRoles } = this

      if (partyRoles.length && message.length) {
        this.dispatchAction('SEND_MESSAGE', {
          type: 'SEND_MESSAGE',
          disputeIds: this.selectedIds,
          allSelected: this.isSelectedAll,
          partyRoles,
          message
        })
        this.closeBulkMessageDialog()
      } else {
        if (partyRoles.length === 0) {
          this.$set(this.hasError, 'partyRoles', true)
        }
      }
    },

    openDropLawsuitDialog() {
      this.showDropLawsuitDialog = true
    },

    handleDropLawsuit(form) {
      this.dispatchAction('CANCEL', {
        type: 'CANCEL',
        disputeIds: this.selectedIds,
        allSelected: this.isSelectedAll,
        ...form
      })
      this.showDropLawsuitDialog = false
    },

    sendBatchAction(action) {
      const message = {
        title: this.$options.filters.capitalize(this.$t('action.' + action.toUpperCase())),
        content: 'Tem certeza que deseja realizar esta ação em lote?'
      }

      const configs = {
        confirmButtonClass: 'confirm-action-btn',
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        dangerouslyUseHTMLString: true,
        cancelButtonClass: 'is-plain'
      }

      if (action === 'UNSETTLED') {
        this.chooseUnsettledDialogVisible = true
        this.unsettledType = ''
        this.note = ''
      } else if (action === 'SETTLED') {
        this.chooseSettledDialogVisible = true
        this.note = ''
      } else if (action === 'DELETE') {
        this.chooseDeleteDialogVisible = true
        this.deleteType = ''
      } else if (action === 'CHANGE_STRATEGY') {
        this.changeStrategyDialogVisible = true
        this.newStrategyId = ''
      } else if (action === 'CHANGE_EXPIRATION_DATE') {
        this.changeExpirationDialogVisible = true
        this.newExpirationDate = ''
      } else if (action === 'RESTART_ENGAGEMENT') {
        this.checkFinishedDisputes(action, message, configs)
      } else if (action === 'CHANGE_NEGOTIATOR') {
        this.checkDisputeNegotiators()
      } else if (action === 'SEND_BILK_MESSAGE') {
        this.openBulkMessageCompose()
      } else if (action === 'DROP_LAWSUIT') {
        this.openDropLawsuitDialog()
      } else if (action === 'UPDATE_ENGAGEMENT_OPTIONS') {
        this.resetEngagementOptions(false)
        this.showUpdateEngagementOptions = true
      } else {
        this.$confirm(message.content, message.title, configs).then(() => {
          this.doAction(action)
        })
      }
    },

    clearSelection() {
      this.$emit('disputes:clear')
      this.selectedIdsComp = []
    },

    checkFinishedDisputes(action, message, configs) {
      const req = {
        allSelected: this.isSelectedAll,
        id: !this.isSelectedAll ? this.selectedIdsComp : []
      }
      this.getFinishedDisputesCount(req).then(response => {
        if (response.value > 0) {
          message.content = `Voce possui ${response.value} disputas finalizadas que estão selecionadas e irao reiniciar. Tem certeza que deseja realizar esta ação?`
        }
        this.$confirm(message.content, message.title, configs).then(() => {
          this.doAction(action)
        })
      })
    },

    checkDisputeNegotiators() {
      const _ = require('lodash')
      let disputeNegotiatorMap = []
      this.disputeNegotiatorMap = []

      if (!this.isSelectedAll) this.$store.commit('updateDisputeQuery', { key: 'id', value: this.selectedIds })
      this.$store.dispatch('getNegotiators').then(response => {
        disputeNegotiatorMap = response

        let concatedDisputeIds = []
        for (const negotiator of disputeNegotiatorMap) {
          concatedDisputeIds = concatedDisputeIds.concat(negotiator.disputes)
        }

        const duplicatedDisputeIds = []
        concatedDisputeIds.map((dispute, i) => {
          if (concatedDisputeIds.indexOf(dispute) !== i) {
            duplicatedDisputeIds.push(dispute)
          }
        })

        this.allSelectedDisputes = concatedDisputeIds.length - duplicatedDisputeIds.length

        const multiNegotiatorsList = []

        disputeNegotiatorMap.map(negotiator => {
          const intersection = _.intersection(negotiator.disputes, duplicatedDisputeIds)
          if (intersection.length) {
            const currentNegotiatorIndex = multiNegotiatorsList.findIndex(n => {
              return !!_.intersection(negotiator.disputes, duplicatedDisputeIds).length
            })
            if (currentNegotiatorIndex === -1) {
              multiNegotiatorsList.push({
                disputes: intersection,
                negotiators: [negotiator.id]
              })
            } else {
              multiNegotiatorsList[currentNegotiatorIndex].negotiators.push(negotiator.id)
            }
            negotiator.disputes = _.difference(negotiator.disputes, intersection)
          }
        })

        disputeNegotiatorMap.map((negotiator, index) => {
          if (!negotiator.disputes.length) disputeNegotiatorMap.splice(index, 1)
        })

        const disputeNegotiatorList = disputeNegotiatorMap.map((negotiator, index) => {
          const { disputes, id } = negotiator
          return {
            disputes,
            negotiators: [id]
          }
        })

        const fullNegotiatorsList = multiNegotiatorsList.concat(disputeNegotiatorList)

        if (fullNegotiatorsList.length === 1) {
          this.disputeNegotiators = fullNegotiatorsList[0].negotiators
          this.changeNegotiatorDialogVisible = true
        } else {
          this.$confirm('As disputas selecionadas possuem negociadores diferentes. Deseja trata-los individualmente ou troca-los todos?', {
            title: 'Atenção! Múltiplos negociadores',
            confirmButtonText: 'Trocar todos',
            cancelButtonText: 'Escolher negociadores de cada disputa',
            cancelButtonClass: 'is-plain',
            distinguishCancelAndClose: true,
            customClass: 'el-message-box--lg'
          }).then(() => {
            this.disputeNegotiators = []
            this.changeNegotiatorDialogVisible = true
          }).catch(action => {
            if (action === 'cancel') {
              this.currentDisputeNegotiator = 0
              this.disputeNegotiators = fullNegotiatorsList[this.currentDisputeNegotiator].negotiators
              this.disputeNegotiatorMap = fullNegotiatorsList
              this.changeNegotiatorDialogVisible = true
            }
          })
        }
      })
      this.$store.commit('updateDisputeQuery', { key: 'id', value: [] })
    },

    changeNegotiator() {
      const isByGroup = !!this.disputeNegotiatorMap.length
      const params = {
        type: 'CHANGE_NEGOTIATOR',
        negotiatorsId: this.disputeNegotiators
      }
      if (this.isSelectedAll) {
        params.allSelected = true
        params.disputeIds = []
      } else if (isByGroup) {
        params.disputeIds = this.disputeNegotiatorMap[this.currentDisputeNegotiator].disputes
      } else {
        params.disputeIds = this.selectedIds
      }
      this.changeNegotiatorDialogLoading = true
      this.$store.dispatch('sendBatchAction', params).then(response => {
        this.changeNegotiatorDialogVisible = false
        this.$jusNotification({
          title: 'Yay!',
          message: 'Ação <strong>' + this.$t('action.CHANGE_NEGOTIATOR') + '</strong> realizada com sucesso.',
          type: 'success',
          dangerouslyUseHTMLString: true
        })
        // SEGMENT TRACK
        this.$jusSegment(getTracktitleByAction('CHANGE_NEGOTIATOR', true), { amount: this.selectedIds.length })
        setTimeout(() => {
          this.currentDisputeNegotiator += 1
          if (this.disputeNegotiatorMap.length > this.currentDisputeNegotiator) {
            this.disputeNegotiators = this.disputeNegotiators = this.disputeNegotiatorMap[this.currentDisputeNegotiator].negotiators
            this.changeNegotiatorDialogVisible = true
          } else {
            this.currentDisputeNegotiator = 0
          }
        }, 200)
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.changeNegotiatorDialogLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.management-actions__dialog {
  .el-dialog {
    .el-dialog__body {
      .jus-import-feedback-card__switch {
        width: 100%;
        display: flex;
        padding: 12px 13px;
        border-bottom: 1px solid #dcdfe6;

        .content  {
          width: 100%;
          word-break: break-word;

          strong { color: $--color-danger; }
        }

        p {
          font-style: italic;
          font-size: 12px;
          margin: 6px 20px 0 0;
        }

        .el-icon-circle-check-outline, .el-icon-circle-check {
          font-size: 1.3rem;
          margin-right: 9px;
        }
      }
    }
  }
}

.icon-in-bulk {
  height: 24px;
}

.dialog__bulk-message {
  .el-dialog__body {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .dialog-body__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-right: 16px;

      .dialog-body__header-text-info {
        color: $--color-primary;
      }

      .dialog-body__header-recipients {
        display: flex;
        flex-direction: column;
        align-items: center;
        align-items: flex-start;

        .dialog-body__recipients-label {
          margin-left: 16px;
        }

        .el-checkbox-group {
          .el-checkbox-button {
            .el-checkbox-button__inner {
              border: none;
              padding-bottom: 0px;

              span {
                color: $--color-text-secondary;
              }

              &:hover {
                color: $--color-text-primary;
              }

              i:before {
                font-size: 16px;
                color: $--color-text-secondary;
              }
            }

            &.is-checked {
              .el-checkbox-button__inner {
                span {
                  font-weight: 700;
                  color: $--color-primary;
                }

                i:before {
                  font-weight: 700;
                  color: $--color-primary;
                }
              }
            }
          }
        }

        .dialog-body__recipients-error {
          margin-top: 8px;
          margin-left: 16px;
          font-size: 12px;

          padding: 8px 16px;

          border-radius: 0px 10px 10px 10px;

          background-color: $--color-danger-light-3;
          font-weight: 600;
          color: $--color-white
        }
      }
    }

    .jus-ckeditor__parent {
      .ck-editor {
        height: 50vh;
        overflow: hidden;

        .ck-editor__main {
          height: 90%;

          .ck-editor__editable {
            height: 100%;
          }
        }
      }
    }

  }
}

.management-actions {
  overflow-x: auto;
  position: absolute;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 3;
  padding: 0 20px;
  transition: all 0.5s ease;
  display: flex;
  justify-content:space-between;
  align-items: center;
  margin: -44px 0px 0;
  transform: translateY(-100%);
  border-radius: 5px 5px 0 0;
  div {
    display: flex;
  }
  &.active {
    box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.12);
    margin: 0px;
    transform: translateY(-29%);
  }
  i {
    cursor: pointer;
    text-align: right;
  }
  button {
    margin-left: 0 !important;
    height: 68px;
    padding: 8px;
    font-size: 14px;
    border: 0;
    border-radius: 0;
    text-transform: uppercase;
    &:hover {
      background-color: #fafafa !important;
    }
  }
  &__length {
    color: $--color-primary;
    font-weight: 500;
    font-size: 14px;
    width: 42px;
    justify-content: center;
    align-items: center;
    margin-right: 8px;
    i {
      margin-right: 4px;
      font-weight: 600;
    }
  }
  .el-icon-close {
    padding: 0 20px 0px 8px;
    font-size: 16px;
  }
  &__dialog {
    .el-message-box__content {
        padding: 10px 0;
    }
    .el-select, .el-date-editor.el-input, .el-transfer {
      width: 100%;
    }
  }
}

.management-action__dropdown-menu {
  max-height: 75vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-left: 18px;

  .el-dropdown-menu__item {
    text-align: center;
    text-transform: uppercase;
  }
}
</style>
