<template lang="html">
  <div class="case-view__side-content">
    <el-steps
      :active="0"
      direction="vertical"
      process-status="wait"
      class="case-view__steps el-steps--dots">
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
        <template slot="title">Contraproposta</template>
        <template slot="description">
          <div v-if="sliderProposal">
            {{ lastoffer | currency }}
            <!-- <el-slider v-model="sliderProposal" :show-tooltip="false" /> -->
          </div>
          <div v-else>
            Sem contraproposta
          </div>
        </template>
      </el-step>
      <el-step>
        <template slot="title">Acordo</template>
        <template slot="description">
          <div v-if="deal">
            {{ deal | currency }}
          </div>
          <div v-else>
            Sem valor de acordo
          </div>
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  name: 'CaseSummary',
  props: {
    id: {
      default: null,
      type: Number
    }
  },
  data () {
    return {
      summary: ''
    }
  },
  computed: {
    enriched () {
      return {
        email: this.summary.enrichedemails ? this.summary.enrichedemails : 0,
        phone: this.summary.enrichedphones ? this.summary.enrichedphones : 0
      }
    },
    interactions () {
      return {
        email: this.summary.emailinteractions ? this.summary.emailinteractions : 0,
        whatsapp: this.summary.whatsappinterations ? this.summary.whatsappinterations : 0,
        cna: this.summary.cnainteractions ? this.summary.cnainteractions : 0,
        views: this.summary.disputenegotiationviews ? this.summary.disputenegotiationviews : 0
      }
    },
    boundary () {
      return parseInt(this.summary.disputeobjectboundary ? this.summary.disputeobjectboundary : 0)
    },
    deal () {
      return this.summary.disputedealvalue
    },
    lastoffer () {
      return this.summary.lastoffervalue ? this.summary.lastoffervalue : 0
    },
    sliderProposal: {
      get () {
        return (this.lastoffer * 100) / this.boundary
      },
      set (val) { return val }
    }
  },
  watch: {
    id (val) {
      if (val) {
        this.$store.dispatch('getDisputes', {
          query: { bool: { must: [{ match: { disputeid: this.id } }] } }
        }).then(response => {
          if (response.length) {
            this.summary = response[0]
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.case-view__side-content {
  .el-step__description {
    padding: 0;
    margin-right: 20px;
    position: relative;
  }
  .el-slider {
    margin-top: 20px;
    pointer-events: none;
  }
}
</style>
