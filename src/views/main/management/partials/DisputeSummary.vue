<template lang="html">
  <div v-loading="!summary" class="dispute-view__side-content">
    <el-steps
      :active="0"
      direction="vertical"
      process-status="wait"
      class="dispute-view__steps el-steps--dots">
      <el-step>
        <template slot="title">Enriquecimento</template>
        <template slot="description">
          <ul>
            <li>Emails: {{ enriched.email }}</li>
            <li>Telefones: {{ enriched.phone }}</li>
          </ul>
        </template>
      </el-step>
      <el-step>
        <template slot="title">Engajamento</template>
        <template slot="description">
          <el-checkbox v-model="scheduled" class="dispute-view__show-scheduled">
            Exibir mensagens agendadas
          </el-checkbox>
        </template>
      </el-step>
      <el-step>
        <template slot="title">Interação</template>
        <template slot="description">
          <ul>
            <li>Emails: {{ interactions.email }}</li>
            <li>CNA: {{ interactions.cna }}</li>
            <li>Whatsapp: {{ interactions.whatsapp }}</li>
            <li>Visualizações: {{ interactions.views }} </li>
          </ul>
        </template>
      </el-step>
      <el-step>
        <template slot="title">
          <span v-if="isDeal">Valor do acordo</span>
          <span v-else>Último valor proposto</span>
        </template>
        <template slot="description">
          <div v-if="deal">
            {{ deal | currency }}
          </div>
          <div v-else>
            Sem contraproposta
          </div>
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<script>

export default {
  name: 'DisputeSummary',
  props: {
    id: {
      default: 0,
      type: Number
    },
    strategyId: {
      default: null,
      type: Number
    },
    showScheduled: {
      default: false,
      type: Boolean
    },
    unsettledTypes: {
      default: () => {},
      type: Object
    }
  },
  data () {
    return {
      summary: null,
      scheduled: false,
      unsettledType: null,
      unsettledTypeId: null
    }
  },
  computed: {
    isDeal () {
      if (this.summary && Object.keys(this.summary).length) {
        return this.summary.disputestatus === 'ACCEPTED' || this.summary.disputestatus === 'CHECKOUT' || this.summary.disputestatus === 'SETTLED'
      }
      return false
    },
    enriched () {
      return {
        email: this.summary && this.summary.enrichedemails ? this.summary.enrichedemails : 0,
        phone: this.summary && this.summary.enrichedphones ? this.summary.enrichedphones : 0
      }
    },
    interactions () {
      return {
        email: this.summary && this.summary.emailinteractions ? this.summary.emailinteractions : 0,
        whatsapp: this.summary && this.summary.whatsappinterations ? this.summary.whatsappinterations : 0,
        cna: this.summary && this.summary.cnainteractions ? this.summary.cnainteractions : 0,
        views: this.summary && this.summary.disputenegotiationviews ? this.summary.disputenegotiationviews : 0
      }
    },
    boundary () {
      return parseInt(this.summary.disputeobjectboundary ? this.summary.disputeobjectboundary : 0)
    },
    deal () {
      return this.summary && this.summary.disputedealvalue ? this.summary.disputedealvalue : null
    }
  },
  watch: {
    showScheduled (value) {
      this.scheduled = value
    },
    scheduled (value) {
      this.$emit('update:showScheduled', value)
    }
  },
  beforeMount () {
    this.getSummary(this.$store.state.disputeModule.disputes)
    this.$store.watch(state => state.disputeModule.disputes, disputes => {
      if (!this.summary) {
        this.getSummary(disputes)
      }
    })
  },
  methods: {
    getSummary (disputes) {
      if (disputes.length) {
        this.summary = disputes.find((dispute) => {
          return dispute.disputeid === this.id
        })
      }
    }
    // changeReasonStatus () {
    //   this.$store.dispatch('editDisputeReason', {
    //     body: { 'reason': this.unsettledTypes[this.unsettledType] },
    //     disputeId: this.id,
    //     reasonId: this.unsettledTypeId
    //   }).then(() => {
    //     setTimeout(function () {
    //       this.$emit('dispute:refresh')
    //     }.bind(this), 2000)
    //     this.$jusNotification({
    //       title: 'Yay!',
    //       message: 'Motivo de perda alterado com sucesso.',
    //       type: 'success'
    //     })
    //   }).catch(() => this.$jusNotification({ type: 'error' }))
    // }
  }
}
</script>

<style lang="scss">
.dispute-view__side-content {
  .el-step__description {
    padding: 0;
    margin-right: 20px;
    position: relative;
  }
  .el-slider {
    margin-top: 20px;
    pointer-events: none;
  }
  .dispute-view__unsettled-types {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
