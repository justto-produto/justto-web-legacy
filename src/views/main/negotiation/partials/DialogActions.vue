<template>
  <section class="dialog-actions">
    <el-dialog
      :visible.sync="offerDialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="600px"
      title="Contraproposta manual"
      class="dialog-actions__manual-offer"
    >
      <el-form
        ref="offerForm"
        :model="offerForm"
        :rules="offerFormRules"
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
              >
                <el-option
                  v-for="type in []"
                  :key="type"
                  :value="type"
                  :label="$t(`unsettled-types.${type}`)"
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
              <money
                v-model="offerForm.value"
                maxlength="16"
                class="el-input__inner"
              />
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
                  v-for="partie in ticketParties"
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
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button
          plain
          @click="offerDialogVisible = false"
        >
          Cancelar
        </el-button>
        <el-button
          type="primary"
          @click.prevent="handleDialogAction"
        >
          Atualizar contraproposta
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
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          plain
          @click="ticketResumeDialogVisible = false"
        >
          Cancelar
        </el-button>
        <el-button
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
            Ao clicar em <strong>mão majorar</strong>, somente será feita a <strong>contraproposta</strong>, sem alterações no status da disputa.
          </small>
        </p>
      </div>
      <div slot="footer">
        <el-button
          plain
          @click="confirmIncreaseUpperrangeDialogVisible = false"
        >
          Cancelar
        </el-button>
        <el-button
          v-if="!isSettledIncreaseAlertType"
          plain
          @click.prevent="sendManualOffer(true)"
        >
          Majorar
        </el-button>
        <el-button
          type="primary"
          @click.prevent="sendManualOffer(isSettledIncreaseAlertType)"
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
      title="Editar negociadores da disputa"
      class="dialog-actions__increase-alert"
    >
      <el-form
        ref="editNegotiatorsForm"
        label-position="top"
      >
        <el-transfer
          v-model="editNegotiatorsForm"
          :titles="['Equipe', 'Disputa']"
          :button-texts="['Remover', 'Adicionar']"
          :data="workspaceMembers"
          filter-placeholder="Buscar"
          filterable
        />
      </el-form>
      <div slot="footer">
        <el-button
          plain
          @click="editNegotiatorsDialogVisible = false"
        >
          Cancelar
        </el-button>
        <el-button
          type="primary"
          @click.prevent="handleEditNegotiators"
        >
          Editar dados
        </el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'DialogActions',
  props: {
    ticket: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    offerDialogVisible: false,
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
    ticketResumeDialogVisible: false,
    ticketResumeType: 'Ganhar',
    confirmIncreaseUpperrangeDialogVisible: false,
    isSettledIncreaseAlertType: false,
    editNegotiatorsDialogVisible: false,
    editNegotiatorsForm: []
  }),
  computed: {
    ...mapGetters({
      ticketParties: 'getTicketOverviewParties',
      workspaceMembers: 'workspaceMembers'
    }),

    ticketRoles() {
      return [{ name: 'teste', id: 1 }, { name: 'teste2', id: 2 }]
    },

    isInsufficientUpperRange() {
      const { unsettledType, ticket } = this

      return ticket &&
        unsettledType &&
        unsettledType === 'INSUFFICIENT_UPPER_RANGE' &&
        (
          (!ticket.plaintiffProposal) ||
          (!ticket.plaintiffProposal.value) ||
          (ticket.plaintiffProposal.value <= ticket.upperRange)
        )
    },

    ticketResume() {
      const { disputeId, code, plaintiffProposal } = this.ticket

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
        {
          key: 'defendant',
          label: 'Réu(s)',
          value: 'Teste'
        },
        {
          key: 'plaintiff',
          label: 'Autor(es)',
          value: 'Teste'
        },
        {
          key: 'lawyer',
          label: 'Advogado(s) do autor(es)',
          value: 'Teste'
        },
        {
          key: 'value',
          label: 'Valor do acordo',
          value: this.$options.filters.currency(plaintiffProposal.value)
        }
      ]
    }
  },
  methods: {
    ...mapActions([
      'sendTicketAction',
      'sendOffer'
    ]),

    confirmAction(action, message = 'Tem certeza que deseja realizar está ação?') {
      const title = this.$options.filters.capitalize(this.$t(`actions.${action}`))
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

    openOfferDialog(action) {
      this.offerForm.unsettledType = ''
      this.offerForm.roleId = action === 'MANUAL_COUNTERPROPOSAL' ? null : this.ticket.plaintiffProposal.id
      this.offerForm.value = ''
      this.offerForm.note = ''

      this.offerFormType = action
      this.offerDialogVisible = true
      if (this.$refs.offerForm) this.$refs.offerForm.clearValidate()
    },

    openEditNegotiatorsDialog(action) {
      this.editNegotiatorsForm = this.ticketParties
      this.editNegotiatorsDialogVisible = true
    },

    openTicketResumeDialog(action, actionType) {
      this.offerFormType = action
      this.ticketResumeType = actionType === 'WIN' ? 'Ganhar' : 'Fechar acordo'
      this.ticketResumeDialogVisible = true
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
      this.validateOfferForm()
        .then(() => {
          if (this.offerForm.value > this.ticket.upperRange) {
            this.isSettledIncreaseAlertType = action === 'SETTLED'
            this.confirmIncreaseUpperrangeDialogVisible = true
          } else {
            this.confirmAction()
              .then(() => this.sendManualOffer())
          }
        })
    },

    sendManualOffer(updateUpperRange = false) {
      return new Promise((resolve, reject) => {
        const { disputeId } = this.ticket
        const { value, roleId, note } = this.offerForm
        const payload = {
          // attribute,
          value,
          note,
          roleId,
          updateUpperRange
        }

        this.sendOffer({ disputeId, payload })
          .then(success => resolve(success))
          .catch(error => reject(error))
      })
    },

    handleEditNegotiators() {
      const { disputeId } = this.ticket
      const action = 'EDIT_NEGOTIATORS'
      const payload = {
        negotiatorsId: this.editNegotiatorsForm
      }

      this.sendTicketAction({ disputeId, action, payload })
    },

    handleSettled() {
      const { disputeId } = this.ticket
      const action = 'SETTLED'

      this.confirmAction()
        .then(() => this.sendTicketAction({ disputeId, action }))
    },

    handleUnsettled() {
      const { disputeId } = this.ticket
      const { note, unsettledType } = this.offerForm
      const payload = { note, reason: unsettledType }
      const action = 'UNSETTLED'

      if (this.isInsufficientUpperRange) {
        this.validateOfferForm()
          .then(() => this.confirmAction()
            .then(() => this.sendManualOffer()
              .then(() => this.sendTicketAction({ disputeId, action, payload }))
            )
          )
      } else {
        this.confirmAction()
          .then(() => this.sendTicketAction({ disputeId, action, payload }))
      }
    },

    validateOfferForm(actionType) {
      return new Promise((resolve, reject) => {
        this.$refs.offerForm.validate(valid => {
          if (valid) resolve()
          else reject(new Error('Campos obrigatórios não preenchidos'))
        })
      })
    }

    // sendCounterproposal(updateUpperRange) {
    //     this.$store.dispatch('getDisputeDTO', this.dispute.id).then(disputeToEdit => {
    //       this.$store.dispatch('sendDisputeCounterProposal')
    //         .then(() => {
    //           if (this.counterOfferForm.note) {
    //             const people = this.disputeClaimants.filter(d => d.id === this.counterOfferForm.selectedRoleId)[0]
    //             const note = '<b>Contraproposta manual no valor de ' + this.$options.filters.currency(this.counterOfferForm.lastCounterOfferValue) + ', realizada por ' + people.name + ', com a nota:</b> <br/>' + this.counterOfferForm.note
    //             this.sendDisputeNote({
    //               note,
    //               disputeId: this.dispute.id
    //             })
    //           }
    //         })
    //     })
    // }
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
