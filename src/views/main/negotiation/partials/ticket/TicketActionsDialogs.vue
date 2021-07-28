<template>
  <section class="dialog-actions">
    <el-dialog
      :title="offerDialogTitle"
      :visible.sync="offerDialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="600px"
      class="dialog-actions__manual-offer"
    >
      <el-form
        ref="offerForm"
        :model="offerForm"
        :rules="offerFormRules"
        :disabled="modalLoading"
        label-position="top"
      >
        <el-row
          v-if="offerFormType === 'UNSETTLED'"
          :gutter="20"
        >
          <el-col :span="24">
            <el-form-item
              label="Motivo da perda:"
              prop="unsettledType"
            >
              <el-select
                v-model="offerForm.unsettledType"
                placeholder="Escolha o motivo da perda"
                style="width: 100%;"
                @change="handleUnsettledTypeChange"
              >
                <el-option
                  v-for="(label, key) in unsettledOutcomeReasons"
                  :key="key"
                  :value="key"
                  :label="label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col
            v-if="offerFormType !== 'UNSETTLED' || isInsufficientUpperRange"
            :span="12"
          >
            <el-form-item
              label="Valor:"
              prop="value"
            >
              <div :class="{ 'el-input is-disabled': modalLoading }">
                <money
                  v-model="offerForm.value"
                  :disabled="modalLoading"
                  maxlength="16"
                  class="el-input__inner"
                />
              </div>
            </el-form-item>
          </el-col>

          <el-col
            v-if="offerFormType !== 'UNSETTLED' || isInsufficientUpperRange"
            :span="12"
          >
            <el-form-item
              label="Proposto por:"
              prop="roleId"
            >
              <el-select
                v-model="offerForm.roleId"
                placeholder="Autor da contraproposta"
                style="width: 100%;"
              >
                <el-option
                  v-for="partie in ticketPlaintiffs"
                  :key="partie.disputeRoleId"
                  :value="partie.disputeRoleId"
                  :label="partie.name"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              label="Nota:"
              prop="note"
            >
              <el-input
                v-model="offerForm.note"
                type="textarea"
                rows="4"
                :maxlength="255"
              />

              <div style="text-align: right;">
                {{ (offerForm.note || '').length }}/255
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer">
        <el-button
          :disabled="modalLoading"
          plain
          @click="offerDialogVisible = false"
        >
          Cancelar
        </el-button>

        <el-button
          v-loading="modalLoading"
          :disabled="modalLoading"
          type="primary"
          @click.prevent="handleDialogAction"
        >
          Continuar
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
        Confira os dados da disputa para {{ ticketResumeType.toLowerCase() }}:
      </strong>

      <div class="dialog-actions__ticket-resume-infobox">
        <p
          v-for="resume in ticketResume"
          :key="resume.key"
          class="dialog-actions__ticket-resume-infoline"
        >
          <b>{{ resume.label }}</b>:

          <span>{{ resume.value }}</span>
        </p>
      </div>

      <el-form
        ref="offerForm"
        :model="offerForm"
        :rules="offerFormRules"
        :disabled="modalLoading"
        label-position="top"
      >
        <el-form-item
          label="Nota:"
          prop="note"
        >
          <el-input
            v-model="offerForm.note"
            type="textarea"
            rows="4"
            :maxlength="255"
          />
          <div style="text-align: right;">
            {{ offerForm.note.length }}/255
          </div>
        </el-form-item>
      </el-form>

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
          {{ ticketResumeType }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="confirmIncreaseUpperrangeDialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="400px"
      title="Majorar a alçada máxima?"
      class="dialog-actions__increase-alert"
    >
      <strong class="dialog-actions__increase-alert-subtitle">
        Valor da contraproposta é maior que o da alçada máxima!
      </strong>

      <div class="dialog-actions__increase-alert-infobox">
        <p class="dialog-actions__increase-alert-infoline">
          <span>*</span>

          <small>
            Ao clicar em <strong>majorar</strong>, será feita a <strong>contraproposta</strong>. A <strong>alçada máxima</strong> será majorada para o <strong>valor</strong> da contraproposta e a disputa será alterada para <strong>proposta aceita</strong>.
          </small>
        </p>

        <p class="dialog-actions__increase-alert-infoline">
          <span>*</span>

          <small>
            Ao clicar em <strong>não majorar</strong>, somente será feita a <strong>contraproposta</strong>, sem alterações no status da disputa.
          </small>
        </p>
      </div>

      <div slot="footer">
        <el-button
          :disabled="modalLoading"
          plain
          @click="confirmIncreaseUpperrangeDialogVisible = false"
        >
          Cancelar
        </el-button>

        <el-button
          v-if="!isSettledIncreaseAlertType"
          v-loading="modalLoading"
          :disabled="modalLoading"
          plain
          @click.prevent="handleIncreaseManualOffer(true)"
        >
          Majorar
        </el-button>

        <el-button
          v-loading="modalLoading"
          :disabled="modalLoading"
          type="primary"
          @click.prevent="handleIncreaseManualOffer(isSettledIncreaseAlertType)"
        >
          {{ isSettledIncreaseAlertType ? 'Majorar' : 'Não majorar' }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="editNegotiatorsDialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="604px"
      title="Editar negociadores"
      class="dialog-actions__increase-alert"
    >
      <el-form
        ref="editNegotiatorsForm"
        label-position="top"
        :disabled="modalLoading"
      >
        <el-transfer
          v-model="editNegotiatorsForm"
          :titles="['Equipe', 'Disputa']"
          :button-texts="['Remover', 'Adicionar']"
          :data="mappedWorkspaceMembers"
          filter-placeholder="Buscar"
          filterable
        />
      </el-form>

      <div slot="footer">
        <el-button
          :disabled="modalLoading"
          plain
          @click="editNegotiatorsDialogVisible = false"
        >
          Cancelar
        </el-button>

        <el-button
          v-loading="modalLoading"
          :disabled="modalLoading"
          type="primary"
          @click.prevent="handleEditNegotiators"
        >
          Trocar negociadores
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-loading="modalLoading"
      :visible.sync="attachmentDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="600px"
      title="Enviar anexo"
      class="dialog-actions__increase-alert"
    >
      <span />
    </el-dialog>

    <el-dialog
      :visible.sync="dropLawsuitDialogVisible"
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
        :loading="modalLoading"
        @cancel="dropLawsuitDialogVisible = false"
        @submit="handleDropLawsuit($event)"
      />
    </el-dialog>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'DialogActions',

  components: {
    DropLawsuitForm: () => import('@/components/layouts/DropLawsuitForm')
  },

  props: {
    ticket: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    modalLoading: false,
    offerDialogVisible: false,
    sendNotificationAwaitingCompanyAnalysisVisible: false,
    offerFormType: 'MANUAL_COUNTERPROPOSAL',
    offerForm: {
      roleId: null,
      value: '',
      note: '',
      unsettledType: ''
    },
    offerFormRules: {
      unsettledType: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      value: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      roleId: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    },
    isSettledIncreaseAlertType: false,
    ticketResumeDialogVisible: false,
    ticketResumeType: 'Ganhar',
    editNegotiatorsDialogVisible: false,
    editNegotiatorsForm: [],
    confirmIncreaseUpperrangeDialogVisible: false,
    attachmentDialogVisible: false,
    dropLawsuitDialogVisible: false
  }),

  computed: {
    ...mapGetters({
      ticketParties: 'getTicketOverviewParties',
      workspaceMembers: 'workspaceMembers',
      outcomeReasons: 'getOutcomeReasons',
      lastTicketOffers: 'getLastTicketOffers',
      activeTab: 'getActiveTab'
    }),

    isInsufficientUpperRange() {
      return this.offerForm.unsettledType === 'INSUFFICIENT_UPPER_RANGE'
    },

    ticketResume() {
      const { disputeId, code } = this.ticket
      const { plaintiffOffer } = this.lastTicketOffers
      return [
        {
          key: 'id',
          label: 'Nº da disputa',
          value: `#${disputeId}`
        },
        {
          key: 'code',
          label: 'Nº do processo',
          value: code
        },
        ...this.ticketParties.filter(({ polarity, roles }) => {
          return (polarity === 'CLAIMANT' && roles.includes('PARTY'))
        }).map(({ name }, i) => ({
          key: `plaintiff-${i + 1}`,
          label: 'Autor',
          value: this.$options.filters.capitalize(name)
        })),
        // Advogado do autor
        ...this.ticketParties.filter(({ polarity, roles }) => {
          return (polarity === 'CLAIMANT' && roles.includes('LAWYER'))
        }).map(({ name }, i) => ({
          key: `lawyer-${i + 1}`,
          label: 'Advogado do autor',
          value: this.$options.filters.capitalize(name)
        })),
        // Reu
        ...this.ticketParties.filter(({ polarity, roles }) => {
          return (polarity === 'RESPONDENT' && roles.includes('PARTY'))
        }).map(({ name }, i) => ({
          key: `defendant-${i + 1}`,
          label: 'Réu',
          value: this.$options.filters.capitalize(name)
        })),
        {
          key: 'value',
          label: 'Valor do acordo',
          value: this.$options.filters.currency(plaintiffOffer?.value)
        }
      ]
    },

    offerDialogTitle() {
      switch (this.offerFormType) {
        case 'SETTLED':
          return 'Aceitar acordo'
        case 'UNSETTLED':
          return 'Perder'
        case 'MANUAL_COUNTERPROPOSAL':
        default:
          return 'Contraproposta manual'
      }
    },

    unsettledOutcomeReasons() {
      return this.outcomeReasons.UNSETTLED
    },

    ticketPlaintiffs() {
      return this.ticketParties?.filter(part => part.polarity === 'CLAIMANT')
    },

    ticketNegotiators() {
      return this.ticketParties?.filter(part => part.roles.includes('NEGOTIATOR'))
    },

    mappedWorkspaceMembers() {
      return this.workspaceMembers.map(member => {
        const { id, name } = member.person

        return {
          key: id,
          label: name,
          value: id
        }
      })
    }
  },

  beforeMount() {
    const { unsettledOutcomeReasons } = this
    if (!unsettledOutcomeReasons || !Object.keys(unsettledOutcomeReasons).length) {
      this.getOutcomeReasons('UNSETTLED')
    }
  },

  methods: {
    ...mapActions([
      'getOutcomeReasons',
      'sendTicketAction',
      'sendOffer',
      'cancelTicket',
      'setAccountProperty',
      'getAccountProperty'
    ]),

    confirmAction(action, message = 'Tem certeza que deseja realizar está ação?') {
      const { status } = this.ticket
      let title = this.$options.filters.capitalize(this.$tc(`actions.${action}.name`, 1))
      if (action === 'SETTLED') {
        if (status === 'ACCEPTED' || status === 'CHECKOUT') {
          title = this.$options.filters.capitalize(this.$tc(`actions.${action}.name`, 1))
        } else {
          title = this.$options.filters.capitalize(this.$tc(`actions.${action}.name`, 0))
        }
      }
      const options = {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        cancelButtonClass: 'is-plain',
        dangerouslyUseHTMLString: true,
        showClose: false
      }
      return new Promise((resolve, reject) => {
        this.$confirm(message, title, options)
          .then(success => resolve(success))
          .catch(error => reject(error))
      })
    },

    concludeAction(action, disputeId, param = false) {
      if (action === 'MANUAL_COUNTERPROPOSAL' || action === 'SETTLED') param = !param
      const message = this.$tc(`actions.${action}.feedback-message`, param)

      this.$jusNotification({
        message: `${message} com sucesso.`,
        title: 'Yay!',
        type: 'success',
        dangerouslyUseHTMLString: true
      })
      this.$jusSegment(message, { disputeId })

      this.offerDialogVisible = false
      this.ticketResumeDialogVisible = false
      this.editNegotiatorsDialogVisible = false
      this.confirmIncreaseUpperrangeDialogVisible = false
    },

    openOfferDialog(action) {
      const { ticketPlaintiffs } = this
      const { plaintiffProposal } = this.ticket

      let roleId
      if (ticketPlaintiffs.length === 1) roleId = ticketPlaintiffs[0].disputeRoleId
      else if (action === 'MANUAL_COUNTERPROPOSAL') roleId = null
      else if (plaintiffProposal) {
        roleId = ticketPlaintiffs.find(({ name }) => name === plaintiffProposal.ownerName)?.disputeRoleId
      } else roleId = null

      this.offerForm.unsettledType = ''
      this.offerForm.roleId = roleId
      this.offerForm.value = ''
      this.offerForm.note = ''
      this.offerFormType = action
      this.offerDialogVisible = true
      if (this.$refs.offerForm) this.$refs.offerForm.clearValidate()
    },

    handleUnsettledTypeChange(value) {
      if (value === 'INSUFFICIENT_UPPER_RANGE') {
        const { ticketPlaintiffs } = this
        const { plaintiffProposal } = this.ticket

        if (plaintiffProposal) {
          this.offerForm.roleId = ticketPlaintiffs.find(({ name }) => name === plaintiffProposal.ownerName)?.disputeRoleId
          this.offerForm.value = plaintiffProposal.value
        }
      }
    },

    openEditNegotiatorsDialog(action) {
      this.editNegotiatorsForm = this.ticketNegotiators.map(negotiator => negotiator.person.id)
      this.editNegotiatorsDialogVisible = true
    },

    openTicketResumeDialog(action, actionType) {
      this.offerFormType = action
      this.ticketResumeType = actionType === 'WIN' ? 'Ganhar' : 'Aceitar acordo'
      this.ticketResumeDialogVisible = true
    },

    openAttachmentDialog(action) {
      this.attachmentDialogVisible = true
    },

    openDropLawsuitDialog(action) {
      this.dropLawsuitDialogVisible = true
    },

    handleDialogAction() {
      const { offerFormType } = this

      switch (offerFormType) {
        case 'MANUAL_COUNTERPROPOSAL':
          this.handleManualOffer(offerFormType)
          break
        case 'SETTLED':
          this.handleManualOffer(offerFormType)
          break
        case 'UNSETTLED':
          this.handleUnsettled()
          break
      }
    },

    handleManualOffer(action) {
      const { disputeId } = this.ticket
      this.validateOfferForm()
        .then(() => {
          if (this.offerForm.value > this.ticket.upperRange) {
            this.isSettledIncreaseAlertType = action === 'SETTLED'
            this.confirmIncreaseUpperrangeDialogVisible = true
          } else {
            this.confirmAction(action)
              .then(() => {
                this.modalLoading = true
                this.sendManualOffer()
                  .then(_success => this.concludeAction(action, disputeId, true))
                  .catch(error => this.$jusNotification({ error }))
                  .finally(() => (this.modalLoading = false))
              })
          }
        })
    },

    handleIncreaseManualOffer(updateUpperRange = false) {
      const { offerFormType } = this
      const { disputeId } = this.ticket

      this.modalLoading = true
      this.sendManualOffer(updateUpperRange)
        .then(success => this.concludeAction(offerFormType, disputeId, updateUpperRange))
        .catch(error => this.$jusNotification({ error }))
        .finally(() => (this.modalLoading = false))
    },

    sendManualOffer(updateUpperRange = false) {
      return new Promise((resolve, reject) => {
        const { disputeId } = this.ticket

        const { value, roleId, note } = this.offerForm
        const data = { value, note, conclusionNote: note, roleId, updateUpperRange }
        const polarityObjectKey = 'plaintiffOffer'
        this.sendOffer({ disputeId, data, polarityObjectKey, change: updateUpperRange })
          .then(success => resolve(success))
          .catch(error => {
            return reject(error)
          })
      })
    },

    handleEditNegotiators() {
      const { disputeId } = this.ticket
      const data = { negotiatorsId: this.editNegotiatorsForm }
      const action = 'NEGOTIATORS'

      this.modalLoading = true
      this.sendTicketAction({ disputeId, action, data })
        .then(_success => this.concludeAction(action, disputeId))
        .catch(error => this.$jusNotification({ error }))
        .finally(() => (this.modalLoading = false))
    },

    handleSettled() {
      const { disputeId } = this.ticket
      const action = 'SETTLED'
      const { note } = this.offerForm
      const data = { note, conclusionNote: note }

      this.confirmAction(action)
        .then(() => {
          this.modalLoading = true
          this.sendTicketAction({ disputeId, action, data })
            .then(_success => this.concludeAction(action, disputeId))
            .catch(error => this.$jusNotification({ error }))
            .finally(() => (this.modalLoading = false))
        })
    },

    handleUnsettled() {
      const { ticket, offerForm, unsettledOutcomeReasons } = this
      const { note, unsettledType } = offerForm
      const { disputeId } = ticket
      const data = { note, reason: unsettledOutcomeReasons[unsettledType] }
      const action = 'UNSETTLED'
      if (this.isInsufficientUpperRange) {
        this.validateOfferForm()
          .then(() => this.confirmAction(action)
            .then(() => {
              this.modalLoading = true
              this.sendManualOffer()
                .then(() => this.sendTicketAction({ disputeId, action, data })
                  .then(success => this.concludeAction(action, disputeId))
                  .catch(error => this.$jusNotification({ error }))
                  .finally(() => (this.modalLoading = false))
                )
                .catch(error => {
                  this.$jusNotification({ error })
                  this.modalLoading = false
                })
            })
          )
      } else {
        this.confirmAction(action)
          .then(() => {
            this.modalLoading = true
            this.sendTicketAction({ disputeId, action, data })
              .then(success => this.concludeAction(action, disputeId))
              .catch(error => this.$jusNotification({ error }))
              .finally(() => (this.modalLoading = false))
          })
      }
    },

    validateOfferForm(_actionType) {
      return new Promise((resolve, reject) => {
        this.$refs.offerForm.validate(valid => {
          if (valid) resolve()
          else reject(new Error('Campos obrigatórios não preenchidos'))
        })
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

    handleDropLawsuit(dropLawsuitForm) {
      this.modalLoading = true

      const disputeId = this.$route.params.id
      const { reason, conclusionNote } = dropLawsuitForm

      this.cancelTicket({
        disputeId,
        reason,
        conclusionNote
      }).then(() => {
        this.$jusNotification({
          message: 'Disputa cancelada com sucesso.',
          title: 'Yay!',
          type: 'success'
        })

        this.dropLawsuitDialogVisible = false
        this.$jusSegment('Cancelamento de disputa na tela /negotiation', { disputeId })
      }).catch(error => this.$jusNotification({ error })).finally(() => {
        this.modalLoading = false
      })
    },

    // TODO fazer função que trata botões da analise da empresa
    sendNotificationAwaitingCompanyAnalysis(frequency) {
      // do something
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.dialog-actions__ticket-resume {
  .dialog-actions__ticket-resume-subtitle {
    color: $--color-text-secondary;
  }
  .dialog-actions__ticket-resume-infobox {
    margin-top: 12px;

    .dialog-actions__ticket-resume-infoline {
      margin: 6px 0;
    }
  }
}

.dialog-actions__increase-alert {
  .el-dialog__header {}

  .el-dialog__body {
    .dialog-actions__increase-alert-body {
    }
  }

  .el-dialog__footer {
    .dialog-actions__increase-alert-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  }

  .dialog-actions__increase-alert-subtitle {
    color: $--color-text-secondary;
  }

  .dialog-actions__increase-alert-infobox {
    margin: 12px 0 24px;

    .dialog-actions__increase-alert-infoline {
      & > span { color: $--color-danger }
    }
  }
}
</style>
