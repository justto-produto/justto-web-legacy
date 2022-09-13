<template>
  <el-dialog
    :close-on-click-modal="false"
    :show-close="false"
    :visible.sync="deleteTicketDialogVisible"
    append-to-body
    title="Atenção"
    width="460px"
  >
    <p>Tem certeza que deseja excluir esta disputa? Essa ação é irreversível.</p>
    <el-select
      v-model="reason"
      :disabled="status === 'PRE_NEGOTIATION'"
      placeholder="Escolha o motivo da exclusão"
      style="width: 100%;"
    >
      <el-option
        v-for="(value, key) in archivedOutcomeReasons"
        :key="key"
        :label="value"
        :value="key"
      />
    </el-select>
    <span slot="footer">
      <el-button
        plain
        @click="deleteTicketDialogVisible = false"
      >
        Cancelar
      </el-button>
      <el-button
        :disabled="!reason"
        type="primary"
        @click.stop="removeTicket"
      >
        Excluir
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'DeleteTicketDialog',
  props: {
    status: {
      type: String,
      required: true
    },
    disputeId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    deleteTicketDialogVisible: false,
    reason: ''
  }),
  computed: {
    ...mapGetters({
      outcomeReasons: 'getOutcomeReasons'
    }),

    archivedOutcomeReasons() {
      return this.outcomeReasons.ARCHIVED
    }
  },
  methods: {
    ...mapActions([
      'getOutcomeReasons',
      'deleteTicket'
    ]),

    openDeleteTicketDialog() {
      const { archivedOutcomeReasons, status } = this

      this.reason = status === 'PRE_NEGOTIATION' ? 'DROPPED' : ''
      if (!archivedOutcomeReasons || !Object.keys(archivedOutcomeReasons).length) {
        this.getOutcomeReasons('ARCHIVED')
          .then(() => (this.deleteTicketDialogVisible = true))
      } else {
        this.deleteTicketDialogVisible = true
      }
    },
    removeTicket() {
      const { disputeId, reason } = this

      this.deleteTicket({ disputeId, reason })
        .then(() => this.$router.push('/negotiation'))
        .catch(error => this.$jusNotification({ error }))
        .finally(() => (this.deleteTicketDialogVisible = false))
    }
  }
}
</script>
