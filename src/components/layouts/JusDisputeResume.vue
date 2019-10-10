<template lang="html">
  <div :class="{ 'jus-dispute-resume__disabled': disabled }" class="jus-dispute-resume" @click="click">
    <h4 data-testid="dispute-title">
      Disputa #{{ dispute.id }} |
      Campanha: {{ dispute.campaignName | capitalize }} |
      Processo: {{ dispute.code }}
      <div v-if="disabled">
        Você não tem permissão para acessar esta disputa
      </div>
    </h4>
    <el-row :gutter="20" data-testid="dipute-info">
      <el-col :span="8">
        <div>Estratégia: {{ dispute.strategyName }}</div>
        <div>Status: <span>{{ $t('occurrence.type.' + dispute.status) | capitalize }}</span></div>
        <div v-for="(claiment, index) in getClaimants(dispute.disputeRoles, 'CLAIMANT', 'PARTY')" :key="dispute.id + claiment.name + index + 'claimant'">
          Parte contrária: {{ claiment.name }}
        </div>
        <div v-for="(lawyer, index) in getClaimants(dispute.disputeRoles, 'CLAIMANT', 'LAWYER')" :key="dispute.id + lawyer.name + index + 'lawyer'">
          Advogado: {{ lawyer.name }}
        </div>
      </el-col>
      <el-col :span="8">
        <div>Campanha: {{ dispute.campaignName }}</div>
        <div>Fim da negociação:
          <span v-if="dispute.expirationDate">{{ dispute.expirationDate.dateTime | moment('DD/MM/YY') }}</span>
        </div>
        <div>Data do acordo:
          <span v-if="dispute.disputeDealDate">{{ dispute.disputeDealDate.dateTime | moment('DD/MM/YY') }}</span>
        </div>
        <div>
          Última interação:
          <span v-if="dispute.lastInteraction">{{ getLastInteraction(dispute.lastInteraction.createAt.dateTime) }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div>Alçada máxima: {{ dispute.disputeUpperRange | currency }}</div>
        <div>Valor proposto: {{ dispute.lastOfferValue | currency }}</div>
        <div>Contraproposta: {{ dispute.lastCounterOfferValue | currency }}</div>
        <div>Valor do acordo: {{ dispute.disputeDealValue | currency }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRoles, getLastInteraction } from '@/plugins/jusUtils'

export default {
  name: 'JusDisputeResume',
  props: {
    dispute: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getLastInteraction: (i) => getLastInteraction(i),
    getClaimants (disputeRoles, party, role) {
      return getRoles(disputeRoles, party, role)
    },
    click () {
      if (!this.disabled) this.$router.push('/management/dispute/' + this.dispute.id)
    }
  }
}
</script>

<style lang="scss">
.jus-dispute-resume {
  line-height: 20px;
  margin: 10px 20px;
  white-space: initial;
  cursor: pointer;
  h4 {
    color: #9461f7;
    margin: 0;
    margin-bottom: 5px;
  }
  color: #adadad;
  span {
    text-transform: capitalize;
  }
  &__disabled {
    cursor: default;
    opacity: 0.3;
    h4 > div {
      color: red;
    }
  }
}
</style>
