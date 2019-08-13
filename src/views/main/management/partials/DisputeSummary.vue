<template lang="html">
  <div v-loading="!dispute" class="dispute-view__side-content">
    <el-steps
      :active="0"
      direction="vertical"
      process-status="wait"
      class="dispute-view__steps el-steps--dots">
      <el-step>
        <template slot="title">Enriquecimento</template>
        <template slot="description">
          <ul>
            <li>Emails: {{ dispute.enrichedEmails }}</li>
            <li>Telefones: {{ dispute.enrichedPhones }}</li>
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
            <li>Emails: {{ dispute.sentEmailMessages }}</li>
            <li>CNA: {{ dispute.sentCnaMessages }}</li>
            <li>Whatsapp: {{ dispute.sendWhatsappMessages }}</li>
          </ul>
        </template>
      </el-step>
      <el-step>
        <template slot="title">
          <span v-if="dispute.isDeal">Valor do acordo</span>
          <span v-else>Último valor proposto</span>
        </template>
        <template slot="description">
          <div v-if="dispute.disputeDealValue">
            {{ dispute.disputeDealValue | currency }}
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
    dispute () {
      return this.$store.getters.findById(this.id)
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
  methods: {
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
