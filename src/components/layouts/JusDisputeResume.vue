<template lang="html">
  <div
    :class="{ 'jus-dispute-resume__disabled': disabled }"
    class="jus-dispute-resume"
    @click="click"
  >
    <h4 data-testid="dispute-title">
      Disputa #{{ dispute.id }} |
      Campanha: {{ dispute.campaign.name | capitalize }} |
      Processo: {{ dispute.code }}
      <span v-if="dispute.externalId">
        | Código interno: {{ dispute.externalId }}
      </span>
      <div v-if="disabled">
        <span v-if="archived">
          Disputa excluída
        </span>
        <span v-else>
          Você não tem permissão para acessar esta disputa
        </span>
      </div>
    </h4>
    <el-row
      :gutter="20"
      data-testid="dipute-info"
    >
      <el-col :span="10">
        <div>Estratégia: {{ dispute.campaign.strategy }}</div>
        <div>Status: <span>{{ $t('occurrence.type.' + dispute.status) | capitalize }}</span></div>
        <div
          v-for="(claiment, index) in getClaimants(dispute.disputeRoles, 'CLAIMANT', 'PARTY')"
          :key="dispute.id + claiment.name + index + 'claimant'"
        >
          Parte contrária: {{ claiment.name }}
        </div>
        <div
          v-for="(lawyer, index) in getClaimants(dispute.disputeRoles, 'CLAIMANT', 'LAWYER')"
          :key="dispute.id + lawyer.name + index + 'lawyer'"
        >
          Advogado: {{ lawyer.name }}
        </div>
      </el-col>
      <el-col :span="7">
        <div>Campanha: {{ dispute.campaign.name }}</div>
        <div v-if="dispute.expirationDate">
          Fim da negociação:
          <span>{{ dispute.expirationDate.dateTime | moment('DD/MM/YY') }}</span>
        </div>
        <div v-if="dispute.disputeDealDate">
          Data do acordo:
          <span>{{ dispute.disputeDealDate.dateTime | moment('DD/MM/YY') }}</span>
        </div>
        <div v-if="dispute.lastInteraction">
          Última interação:
          <span>{{ getLastInteraction(dispute.lastInteraction.createAt.dateTime) }}</span>
        </div>
      </el-col>
      <el-col :span="7">
        <div>Alçada máxima: {{ dispute.disputeUpperRange | currency }}</div>
        <div>Valor proposto: {{ dispute.lastOfferValue | currency }}</div>
        <div v-if="dispute.lastCounterOfferValue">
          Contraproposta: {{ dispute.lastCounterOfferValue | currency }}
        </div>
        <div v-if="dispute.disputeDealValue">
          Valor do acordo: {{ dispute.disputeDealValue | currency }}
        </div>
        <div v-if="dispute.materialDamage">
          Dano material: {{ dispute.materialDamage | currency }}
        </div>
        <div v-if="dispute.requestedValue">
          Valor do processo: {{ dispute.requestedValue | currency }}
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRoles, getLastInteraction } from '@/utils'

export default {
  name: 'JusDisputeResume',
  props: {
    dispute: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    disabled() {
      return this.dispute.isMy === false || this.dispute.archived === true
    },
    archived() {
      return this.dispute.archived
    }
  },
  methods: {
    getLastInteraction: (i) => getLastInteraction(i),
    getClaimants(disputeRoles, party, role) {
      return getRoles(disputeRoles, party, role)
    },
    click() {
      if (!this.disabled) {
        this.$emit('click', {
          disputeId: this.dispute.id,
          disputeStatus: this.dispute.status
        })
      }
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
  > div span {
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
