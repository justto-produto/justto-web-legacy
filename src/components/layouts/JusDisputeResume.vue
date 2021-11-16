<template lang="html">
  <div
    :class="{ 'jus-dispute-resume--disabled': disabled }"
    class="jus-dispute-resume"
    @click="click"
  >
    <h4
      :class="{ 'jus-dispute-resume__header--archived': disabled }"
      class="jus-dispute-resume__header"
    >
      <span
        v-if="dispute.id"
        class="jus-dispute-resume__header-item"
      >
        Disputa: <b>#{{ dispute.id }}</b>
      </span> |
      <span
        v-if="dispute.campaign && dispute.campaign.name"
        class="jus-dispute-resume__header-item"
      >
        Campanha: <b>{{ dispute.campaign.name }}</b>
      </span> |
      <span
        v-if="dispute.code"
        class="jus-dispute-resume__header-item"
      >
        Processo: <b>{{ dispute.code }}</b>
      </span> |
      <span
        v-if="dispute.externalId"
        class="jus-dispute-resume__header-item"
      >
        Código interno: <b>{{ dispute.externalId }}</b>
      </span>

      <span v-if="disabled && archived">- <b>DISPUTA EXCLUÍDA</b></span>
      <span v-else-if="disabled && !archived">- Você não tem permissão para acessar esta disputa</span>
    </h4>

    <article class="jus-dispute-resume__body">
      <div class="jus-dispute-resume__main">
        <div
          v-if="dispute.campaign && dispute.campaign.strategy"
          class="jus-dispute-resume__body-item"
        >
          Estratégia: <b>{{ dispute.campaign.strategy }}</b>
        </div>
        <div
          v-if="dispute.status"
          class="jus-dispute-resume__body-item"
        >
          Status: <b>{{ $t(`occurrence.type.${dispute.status}`) | capitalize }}</b>
        </div>
        <div
          v-for="(claiment, index) in getClaimants(dispute.disputeRoles, 'CLAIMANT', 'PARTY')"
          :key="dispute.id + claiment.name + index + 'claimant'"
          class="jus-dispute-resume__body-item jus-dispute-resume__body-item--list"
        >
          Parte contrária: <b>{{ claiment.name | resumedName }}</b>
        </div>
        <div
          v-for="(lawyer, index) in getClaimants(dispute.disputeRoles, 'CLAIMANT', 'LAWYER')"
          :key="dispute.id + lawyer.name + index + 'lawyer'"
          class="jus-dispute-resume__body-item jus-dispute-resume__body-item--list"
        >
          Advogado: <b>{{ lawyer.name }}</b>
        </div>
      </div>

      <div class="jus-dispute-resume__dates">
        <div
          v-if="dispute.expirationDate"
          class="jus-dispute-resume__body-item"
        >
          Fim da negociação:
          <b>{{ dispute.expirationDate.dateTime | moment('DD/MM/YY') }}</b>
        </div>
        <div
          v-if="dispute.disputeDealDate"
          class="jus-dispute-resume__body-item"
        >
          Data do acordo:
          <b>{{ dispute.disputeDealDate.dateTime | moment('DD/MM/YY') }}</b>
        </div>
        <div
          v-if="dispute.lastInteraction && dispute.lastInteraction.createAt"
          class="jus-dispute-resume__body-item"
        >
          Última interação:
          <b>{{ getLastInteraction(dispute.lastInteraction.createAt.dateTime) }}</b>
        </div>
      </div>

      <div class="jus-dispute-resume__values">
        <div
          v-if="dispute.disputeUpperRange"
          class="jus-dispute-resume__body-item"
        >
          {{ $tc('UPPER_RANGE', isRecovery) }}: <b>{{ dispute.disputeUpperRange | currency }}</b>
        </div>
        <div
          v-if="dispute.lastOfferValue"
          class="jus-dispute-resume__body-item"
        >
          Valor proposto: <b>{{ dispute.lastOfferValue | currency }}</b>
        </div>
        <div
          v-if="dispute.lastCounterOfferValue"
          class="jus-dispute-resume__body-item"
        >
          Contraproposta: <b>{{ dispute.lastCounterOfferValue | currency }}</b>
        </div>
        <div
          v-if="dispute.disputeDealValue"
          class="jus-dispute-resume__body-item"
        >
          Valor do acordo: <b>{{ dispute.disputeDealValue | currency }}</b>
        </div>
        <div
          v-if="dispute.materialDamage"
          class="jus-dispute-resume__body-item"
        >
          Dano material: <b>{{ dispute.materialDamage | currency }}</b>
        </div>
        <div
          v-if="dispute.requestedValue"
          class="jus-dispute-resume__body-item"
        >
          Valor do processo: <b>{{ dispute.requestedValue | currency }}</b>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { getRoles, getLastInteraction } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'JusDisputeResume',
  props: {
    dispute: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters({
      isRecovery: 'isWorkspaceRecovery'
    }),

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

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.jus-dispute-resume {
  cursor: pointer;
  line-height: 20px;
  white-space: initial;
  margin: 12px;

  &--disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .jus-dispute-resume__header {
    color: $--color-primary;
    margin: 0 0 6px;
    &--archived { color: $--color-danger; }

    .jus-dispute-resume__header-item {
      display: inline-block;
      & > b { font-weight: 500; }
    }
  }

  .jus-dispute-resume__body {
    display: flex;
    gap: 20px;
    color: $--color-text-secondary;

    .jus-dispute-resume__main { flex: 4 }
    .jus-dispute-resume__values,
    .jus-dispute-resume__dates {
      flex: 3
    }

    .jus-dispute-resume__main,
    .jus-dispute-resume__values,
    .jus-dispute-resume__dates {
      .jus-dispute-resume__body-item {
        & > b { font-weight: 500; }
      }
    }
  }

  @media (max-width: 900px) {
    .jus-dispute-resume__values,
    .jus-dispute-resume__dates {
      display: none;

      .jus-dispute-resume__body-item {
        &--list:nth-child(n+2) {
          display: none;
        }
      }
    }
  }
}
</style>
