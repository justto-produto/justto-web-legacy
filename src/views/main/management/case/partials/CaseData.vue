<template lang="html">
  <div class="case-data-view">
    <el-collapse value="1">
      <el-collapse-item v-loading="loading" title="Informações gerais" name="1">
        <div class="case-view__info-line">
          <span>Nº do Processo:</span>
          <span>{{ dispute.code }}</span>
        </div>
        <div class="case-view__info-line">
          <span>Campanha:</span>
          <span>NESTLÉ - NATAL2018</span>
        </div>
        <div class="case-view__info-line">
          <span>Estratégia:</span>
          <span>Indenizatório</span>
        </div>
        <div class="case-view__info-line">
          <span>Alçada máxima:</span>
          <span>R$ {{ disputeSummary.boundary }}</span>
        </div>
        <div class="case-view__info-line">
          <span>Contraproposta:</span>
          <span>R$ {{ disputeSummary.lastProposal }}</span>
        </div>
        <div class="case-view__info-line">
          <span>Valor do acordo:</span>
          <span>R$ {{ disputeSummary.dealValue }}</span>
        </div>
        <div class="case-view__info-line">
          <span>Fim da negociação:</span>
          <span>28/10/2020</span>
        </div>
      </el-collapse-item>
    </el-collapse>
    <hr>
    <el-collapse v-loading="loading" accordion class="el-collapse--bordered">
      <el-collapse-item
        v-for="role in disputeRolesSort"
        :key="role.id"
        :name="role.id"
        :title="buildTitle(role)">
        <div class="case-view__info-line">
          <span>Status:</span>
          <span>Online <jus-status-dot type="success"/></span>
        </div>
        <div class="case-view__info-line">
          <span>Nome:</span>
          <span>{{ role.person.name }}</span>
        </div>
        <div class="case-view__info-line">
          <span>E-mail:</span>
          <span>{{ role.person.emailIds[0] }}</span>
        </div>
        <div class="case-view__info-line">
          <span>Telefone:</span>
          <span>{{ role.person.phoneIds[0] }}</span>
        </div>
        <div class="case-view__info-line">
          <span>CPF:</span>
          <span>{{ role.person.documentNumber }}</span>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'CaseData',
  props: {
    loading: {
      default: false,
      type: Boolean
    },
    dispute: {
      default: () => {},
      type: Object
    },
    disputeSummary: {
      default: () => {},
      type: Object
    },
    disputeRoles: {
      default: () => [],
      type: Array
    }
  },
  computed: {
    disputeRolesSort () {
      let sortedArray = this.disputeRoles.slice(0)
      return sortedArray.sort((a, b) => {
        if (a.party === b.party) {
          return (a.roles[0] > b.roles[0]) ? -1 : (a.roles[0] < b.roles[0]) ? 1 : 0
        } else {
          return (a.party < b.party) ? -1 : 1
        }
      })
    }
  },
  methods: {
    buildTitle (role) {
      if (role.party === 'CLAIMANT') {
        if (role.roles[0] === 'PARTY') {
          return 'Parte contrária'
        } else return 'Advogado da parte'
      } else {
        if (role.roles[0] === 'PARTY') {
          return 'Réu'
        } else return 'Advogado do réu'
      }
    }
  }
}
</script>

<style lang="scss">
.case-data-view {
  .jus-status-dot {
    float: initial !important;
  }
}
</style>
