<template>
  <section class="dialog-actions">
    <el-dialog
      :visible.sync="offerDialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      title="Contraproposta manual"
      class="dialog-actions__manual-counterproposal"
      width="600px"
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
              label="Motivo da perda"
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
        <el-row
          v-if="offerFormType !== 'UNSETTLED' || isInsufficientUpperRange"
          :gutter="20"
        >
          <el-col :span="12">
            <el-form-item
              label="Valor"
              prop="value"
            >
              <money
                v-model="offerForm.value"
                maxlength="16"
                class="el-input__inner"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="Proposto por"
              prop="roleId"
            >
              <el-select
                v-model="offerForm.role.id"
                placeholder="Autor da contraproposta"
                style="width: 100%;"
              >
                <el-option
                  v-for="claimant in ticketRoles"
                  :key="claimant.id"
                  :value="claimant.id"
                  :label="claimant.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="Nota"
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
  </section>
</template>

<script>
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
      role: { id: null },
      value: '',
      note: '',
      unsettledType: ''
    },
    offerFormRules: {
      unsettledType: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      value: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      roleId: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    }
  }),
  computed: {
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
    }
  },
  methods: {
    openOfferDialog(action) {
      this.offerForm.unsettledType = ''
      this.offerForm.role.id = action === 'MANUAL_COUNTERPROPOSAL' ? null : this.ticket.plaintiffProposal.id
      this.offerForm.value = ''
      this.offerForm.note = ''

      this.offerFormType = action
      this.offerDialogVisible = true
      if (this.$refs.offerForm) this.$refs.offerForm.clearValidate()
    },

    openChangeNegotiatorDialog() {

    },

    openTicketResumeDialog(actionType) {
      const { disputeId, code } = this.ticket

      actionType = actionType === 'ACCEPT' ? 'Fechar acordo' : 'Ganhar'
      const h = this.$createElement
      const detailsMessage = [
        h('strong', { style: 'margin-bottom: 6px; display: flex' }, 'Confira os dados da disputa:'),
        h('p', null, [
          h('b', null, 'Nº da disputa: '),
          h('span', null, `#${disputeId}`)
        ]),
        h('p', null, [
          h('b', null, 'Nº do processo: '),
          h('span', null, code)
        ]),
        h('p', null, [
          h('b', null, 'Réu(s): '),
          h('span', null, this.respondentsResume.toUpperCase() || ' - ')
        ]),
        h('p', null, [
          h('b', null, 'Autor(es): '),
          h('span', null, this.authorsResume.toUpperCase() || ' - ')
        ]),
        h('p', null, [
          h('b', null, 'Advogado(s) do autor(es): '),
          h('span', null, this.lawyersResume.toUpperCase() || ' - ')
        ]),
        h('p', null, [
          h('b', null, 'Valor do acordo: '),
          h('span', null, this.$options.filters.currency(this.counterOfferForm.lastCounterOfferValue || this.dispute.disputeDealValue))
        ]),
        h('b', { style: 'margin-top: 16px' }, `${this.$t('dispute.labels.note')}:`)
      ]
      const options = {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        cancelButtonClass: 'is-plain',
        showClose: false
      }

      this.$prompt(h('div', null, detailsMessage), actionType, options)
        .then(({ value }) => {
          this.handleSettled()
          this.counterOfferForm.note = value ? this.scapeHtml(value) : ''
        })
    },

    handleDialogAction() {
      switch (this.offerFormType) {
        case 'MANUAL_COUNTERPROPOSAL':
          this.handleManualCounterproposal()
          break
        case 'SETTLED':
          this.handleSettled()
          break
        case 'UNSETTLED':
          this.handleUnsettled()
          break
      }
    },

    handleManualCounterproposal() {

    },
    handleSettled() {

    },
    handleUnsettled() {
      // if (this.isInsufficientUpperRange) {
      //   this.handleManualCounterproposal()
      // } else {
      //   additionParams = {
      //     body: {
      //       reason: this.disputeStatuses.UNSETTLED[this.unsettledType],
      //       note: this.scapeHtml(this.counterOfferForm.note)
      //     }
      //   }
      //   this.doAction('unsettled', message, additionParams).then(() => {
      //     this.chooseUnsettledDialogVisible = false
      //   }).finally(() => {
      //     this.unsettledType = null
      //     this.closeCounterProposalModal()
      //   })
      // }
    }
  }
}
</script>

<style lang="scss">

</style>
