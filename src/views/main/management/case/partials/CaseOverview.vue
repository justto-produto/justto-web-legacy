<template lang="html">
  <div class="case-overview-view">
    <el-collapse value="1">
      <el-collapse-item v-loading="loading" title="Informações gerais" name="1">
        <div class="case-view__info-line">
          <span>Nº do Processo:</span>
          <span>{{ dispute.code }}</span>
        </div>
        <div class="case-view__info-line">
          <span>Campanha:</span>
          <span v-if="Object.keys(dispute).length">{{ dispute.campaign.name }}</span>
        </div>
        <div class="case-view__info-line">
          <span>Estratégia:</span>
          <span v-if="Object.keys(dispute).length">{{ dispute.strategy.name }}</span>
        </div>
        <div class="case-view__info-line">
          <span>Alçada máxima:</span>
          <span>R$ {{ (dispute.upperRange.boundary ? dispute.upperRange.boundary : '-') }}</span>
        </div>
        <div class="case-view__info-line">
          <span>Contraproposta:</span>
          <span>R$ {{ (dispute.lastOffer ? dispute.lastOffer : '-') }}</span>
        </div>
        <div class="case-view__info-line">
          <span>Valor do acordo:</span>
          <span>R$ {{ (dispute.lastOffer ? dispute.lastOffer : '-') }}</span>
        </div>
        <div class="case-view__info-line">
          <span>Valor da causa:</span>
          <span>R$ {{ (dispute.valueOfClaim.value ? dispute.valueOfClaim.value : '-') }}</span>
        </div>
        <div class="case-view__info-line">
          <span>Fim da negociação:</span>
          <span>{{ dispute.expirationDate | moment('DD/MM/YY') }}</span>
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
          <span v-if="true">Offline <jus-status-dot type="danger"/></span>
          <span v-else>Online <jus-status-dot type="success"/></span>
        </div>
        <div class="case-view__info-line">
          <span>Nome:</span>
          <span>{{ role.person.name }}</span>
        </div>
        <div v-for="email in role.person.emails" :key="email.id" class="case-view__info-line">
          <span>E-mail:</span>
          <span>{{ email.address }}</span>
        </div>
        <div v-for="phone in role.person.phones" :key="phone.id" class="case-view__info-line">
          <span>Telefone:</span>
          <span>{{ phone.number }}</span>
        </div>
        <div v-for="oab in role.person.oabs" :key="oab.id" class="case-view__info-line">
          <span>OAB:</span>
          <span>{{ oab.number }}</span>
        </div>
        <div v-show="role.person.documentNumber" class="case-view__info-line">
          <span>CPF:</span>
          <span>{{ role.person.documentNumber }}</span>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'CaseOverview',
  props: {
    loading: {
      default: false,
      type: Boolean
    },
    dispute: {
      default: () => {},
      type: Object
    }
  },
  computed: {
    disputeRolesSort () {
      if (this.dispute.disputeRoles) {
        let sortedArray = this.dispute.disputeRoles.slice(0)
        return sortedArray.sort((a, b) => {
          if (a.party === b.party) {
            return (a.roles[0] > b.roles[0]) ? -1 : (a.roles[0] < b.roles[0]) ? 1 : 0
          } else {
            return (a.party < b.party) ? -1 : 1
          }
        })
      } return []
    }
  },
  methods: {
    buildTitle (role) {
      if (role.party === 'RESPONDENT') {
        switch (role.roles[0]) {
          case 'NEGOTIATOR':
            return 'Negociador'
          case 'PARTY':
            return 'Réu'
          case 'LAWYER':
            return 'Advogado do réu'
        }
      } else { // if (role.party === 'CLAIMANT')
        if (role.roles[0] === 'PARTY') {
          return 'Parte contrária'
        } else if (role.roles[0] === 'LAWYER') {
          return 'Advogado da parte'
        } else {
          return role.person.name
        }
      }
    }
  }
}
</script>

<style lang="scss">
.case-overview-view {
  .jus-status-dot {
    float: initial !important;
  }
}
</style>
