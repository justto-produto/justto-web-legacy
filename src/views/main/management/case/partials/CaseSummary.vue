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
            <li v-if="parseInt(enriched.email)">
              Emails: {{ enriched.email }}
            </li>
            <li v-if="parseInt(enriched.phone)">
              Telefones: {{ enriched.phone }}
            </li>
          </ul>
        </template>
      </el-step>
      <el-step>
        <template slot="title">Interação</template>
        <template slot="description">
          <ul>
            <li v-if="parseInt(interactions.email)">
              Emails: {{ interactions.email }}
            </li>
            <li v-if="parseInt(interactions.cna)">
              CNA: {{ interactions.cna }}
            </li>
            <li v-if="parseInt(interactions.whatsapp)">
              Whatsapp: {{ interactions.whatsapp }}
            </li>
          </ul>
        </template>
      </el-step>
      <el-step>
        <template slot="title">Contraproposta</template>
        <template slot="description">
          <div :style="'left: calc(' + sliderProposal + '% - 27px)'" class="case-view__last-offer">
            R$ {{ lastoffer }}
          </div>
          <el-slider v-model="sliderProposal" :show-tooltip="false" />
        </template>
      </el-step>
      <el-step>
        <template slot="title">Acordo</template>
        <template slot="description">
          R$ {{ deal }}
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
        email: this.summary.enrichedemails,
        phone: this.summary.enrichedphones
      }
    },
    interactions () {
      return {
        email: this.summary.emailinteractions,
        whatsapp: this.summary.whatsappinterations,
        cna: this.summary.cnainteractions
      }
    },
    boundary () {
      return parseInt(this.summary.disputeobjectboundary)
    },
    deal () {
      if (this.summary.disputedealvalue) {
        return parseInt(this.summary.disputedealvalue)
      } return '-'
    },
    lastoffer () {
      return this.summary.lastoffervalue
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
          if (response.hits.hits.length) {
            this.summary = response.hits.hits[0]._source
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
.case-view__last-offer {
  position: absolute;
  top: -14px;
  white-space: nowrap;
}
</style>
