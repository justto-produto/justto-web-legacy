<template>
  <span>
    <div>
      <div
        class="dispute-overview-view__info-line"
        data-testid="dispute-infoline"
      >
        <span class="title">Etiquetas:</span>
        <jus-tags />
      </div>
      <div
        v-if="dispute.createAt"
        class="dispute-overview-view__info-line"
        data-testid="dispute-infoline"
      >
        <span class="title">Data de importação:</span>
        <span>{{ dispute.createAt.dateTime | moment('DD/MM/YY') }}</span>
      </div>
      <div
        class="dispute-overview-view__info-line"
        data-testid="dispute-infoline"
      >
        <span class="title">Processo:</span>
        <dispute-code-link
          :code="dispute.code"
          :custom-style="{ fontSize: '14px', marginLeft: '12px'}"
          @openTimeline="openTimelineModal"
        />
      </div>

      <div
        v-if="campaign"
        class="dispute-overview-view__info-line"
        data-testid="dispute-infoline"
      >
        <span class="title">Campanha:</span>
        <span>{{ campaign.name }}</span>
      </div>

      <div
        v-if="dispute.strategyName"
        class="dispute-overview-view__info-line"
        data-testid="dispute-infoline"
      >
        <span class="title">Estratégia:</span>
        <span data-testid="overview-strategy">{{ dispute.strategyName }}</span>
      </div>
      <div
        class="dispute-overview-view__info-line"
        data-testid="dispute-infoline"
      >
        <span class="title">Status:</span>
        <el-tooltip
          :disabled="!statusTooltip"
          popper-class="info-line__status-tooltip"
        >
          <span
            slot="content"
            v-html="statusTooltip"
          />
          <span data-testid="overview-status">
            <span>{{ $t('occurrence.type.' + dispute.status) | capitalize }}</span>
            <span v-if="dispute.paused">(pausada)</span>
            <span
              v-if="statusTooltip"
              class="el-icon-question"
            />
          </span>
        </el-tooltip>
      </div>
      <div
        class="dispute-overview-view__info-line"
        data-testid="dispute-infoline"
      >
        <span class="title">{{ $tc('UPPER_RANGE', isRecoveryStrategy) }}:</span>
        <span data-testid="overview-upperrange">{{ dispute.disputeUpperRange | currency }}</span>
      </div>
      <div
        class="dispute-overview-view__info-line"
        data-testid="dispute-infoline"
      >
        <span class="title">Valor proposto<span v-if="dispute.lastOfferName"> por {{ dispute.lastOfferName | firstName }}</span>:</span>
        <span data-testid="overview-proposal">
          <el-tooltip
            v-if="dispute.lastOfferName"
            :content="'Proposto por: ' + dispute.lastOfferName"
          >
            <jus-avatar-user
              :name="dispute.lastOfferName"
              size="mini"
            />
          </el-tooltip>
          {{ dispute.lastOfferValue | currency }}
        </span>
      </div>
      <div
        v-if="dispute.lastCounterOfferValue > 0 && dispute.disputeUpperRange"
        class="dispute-overview-view__info-line"
        data-testid="dispute-infoline"
      >
        <span class="title">Contraproposta<span v-if="dispute.lastCounterOfferName"> por {{ dispute.lastCounterOfferName | firstName }}</span>:</span>
        <span data-testid="overview-counterproposal">
          <el-tooltip
            v-if="dispute.lastCounterOfferName"
            :content="'Proposto por: ' + dispute.lastCounterOfferName"
          >
            <jus-avatar-user
              :name="dispute.lastCounterOfferName"
              size="mini"
            />
          </el-tooltip>
          {{ dispute.lastCounterOfferValue | currency }}
        </span>
      </div>
      <div
        v-if="(dispute.status === 'ACCEPTED' || dispute.status === 'CHECKOUT' || dispute.status === 'SETTLED') && dispute.disputeDealValue"
        class="dispute-overview-view__info-line"
      >
        <span class="title">Valor do acordo:</span>
        <span>{{ dispute.disputeDealValue | currency }}</span>
      </div>
      <div
        class="dispute-overview-view__info-line"
        data-testid="dispute-infoline"
      >
        <span class="title">Fim da negociação:</span>
        <span
          v-if="dispute.expirationDate"
          data-testid="overview-expirationdate"
        >{{ dispute.expirationDate.dateTime | moment('DD/MM/YY') }}</span>
      </div>
      <div
        v-if="dispute.materialDamage"
        class="dispute-overview-view__info-line"
        data-testid="dispute-infoline"
      >
        <span class="title">Dano material:</span>
        <span
          v-if="dispute.materialDamage"
          data-testid="overview-materialdamage"
        >{{ dispute.materialDamage | currency }}</span>
      </div>
      <div
        v-if="dispute.moralDamage"
        class="dispute-overview-view__info-line"
        data-testid="dispute-infoline"
      >
        <span class="title">Dano moral:</span>
        <span
          v-if="dispute.moralDamage"
          data-testid="overview-moralDamage"
        >{{ dispute.moralDamage | currency }}</span>
      </div>
      <div
        v-if="dispute.provisionedValue > 0"
        class="dispute-overview-view__info-line"
        data-testid="dispute-infoline"
      >
        <span class="title">Valor provisionado:</span>
        <span data-testid="overview-provisioned-value">{{ dispute.provisionedValue | currency }}</span>
      </div>
      <div
        v-if="dispute.requestedValue"
        class="dispute-overview-view__info-line"
        data-testid="dispute-infoline"
      >
        <span class="title">Valor do processo:</span>
        <span
          v-if="dispute.requestedValue"
          data-testid="overview-requestedvalue"
        >{{ dispute.requestedValue | currency }}</span>
      </div>
      <div
        v-if="dispute.externalId"
        class="dispute-overview-view__info-line"
        data-testid="dispute-infoline"
      >
        <span class="title">Código interno:</span>
        <span
          v-if="dispute.externalId"
          data-testid="overview-externalid"
        >{{ dispute.externalId }}</span>
      </div>
      <div
        class="dispute-overview-view__info-line"
        data-testid="dispute-infoline"
      >
        <span class="title">Configurações:</span>
        <span
          v-if="dispute"
          class="configurations"
        >
          Enriquecer automaticamente na importação?
          <div><i :class="skipEnrichment ? 'el-icon-close' : 'el-icon-check'" /> {{ skipEnrichment ? 'Não' : 'Sim' }}</div>
          Somente depósito em conta-corrente?
          <div><i :class="dispute && dispute.campaign && dispute.campaign.denySavingDeposit ? 'el-icon-check' : 'el-icon-close'" /> {{ dispute && dispute.campaign && dispute.campaign.denySavingDeposit ? 'Sim' : 'Não ' }}</div>
          Mensagens somente em horário comercial?
          <div><i :class="dispute && dispute.campaign && dispute.campaign.businessHoursEngagement ? 'el-icon-check' : 'el-icon-close'" /> {{ dispute && dispute.campaign && dispute.campaign.businessHoursEngagement ? 'Sim' : 'Não' }}</div>
          Contatar autor?
          <div>
            <i :class="(dispute.contactPartyWhenNoLowyer || dispute.contactPartyWhenInvalidLowyer) ? 'el-icon-check' : 'el-icon-close'" />
            <span v-if="dispute.alwaysContactParty">
              Sempre
            </span>
            <span v-else-if="dispute.contactPartyWhenNoLowyer && dispute.contactPartyWhenInvalidLowyer">
              Quando não houver advogado ou não for possível contatar o advogado existente
            </span>
            <span v-else-if="dispute.contactPartyWhenNoLowyer && !dispute.contactPartyWhenInvalidLowyer">
              Somente quando não houver advogado constituído
            </span>
            <span v-else-if="!dispute.contactPartyWhenNoLowyer && dispute.contactPartyWhenInvalidLowyer">
              Somente quando não for possível contatar o advogado existente
            </span>
            <span v-else>
              Nunca
            </span>
          </div>
        </span>
      </div>
      <div
        v-if="computedDescription"
        class="dispute-overview-view__info-line"
      >
        <span class="title">Descrição:</span>
        <span>
          <span
            :class="{ 'right': computedDescription.length < 25 }"
            data-testid="overview-description"
          >
            {{ computedDescription }}
            <span v-if="dispute.description.length > 140">
              <a
                href="#"
                class="dispute-overview-view__see-more"
                @click.prevent="descriptionCollapse = !descriptionCollapse"
              >
                {{ descriptionCollapse ? 'ver mais': 'ver menos' }}
                <i :class="descriptionCollapse ? 'el-icon-arrow-down': 'el-icon-arrow-up'" />
              </a>
            </span>
          </span>
        </span>
      </div>
      <div
        v-if="dispute.classification"
        class="dispute-overview-view__info-line"
      >
        <span class="title">Classificação:</span>
        <span class="classification">
          {{ dispute.classification.name }}
          <div
            v-for="subClassification in dispute.classification.classificationDetails"
            :key="subClassification.id"
          >
            <i class="el-icon-right" />
            {{ subClassification.name }}
          </div>
        </span>
      </div>
      <div
        v-if="dispute.bankAccounts && dispute.bankAccounts.length"
        class="dispute-overview-view__info-line"
      >
        <span class="title">Conta(s) bancária(s):</span>
        <el-collapse value="0">
          <el-collapse-item
            v-for="(bankAccount, index) in dispute.bankAccounts"
            :key="`${index}-${bankAccount.id}`"
            :name="index"
            class="dispute-overview-view__bank-collapse"
          >
            <template slot="title">
              <div>
                {{ bankAccount.name || bankAccount.document | cpfCnpj }}
                <span>
                  {{ bankAccount.bank }} <span v-if="bankAccount.agency">|</span>
                  {{ bankAccount.agency }} <span v-if="bankAccount.number">|</span>
                  {{ bankAccount.number }}
                </span>
              </div>
            </template>
            <span class="bank-info">
              <span v-show="bankAccount.name">
                <strong>Nome:</strong> {{ bankAccount.name }} <br>
              </span>
              <span v-show="bankAccount.email">
                <strong>E-mail:</strong> {{ bankAccount.email }} <br>
              </span>
              <strong>Documento:</strong> {{ bankAccount.document | cpfCnpj }} <br>
              <strong>Banco:</strong> {{ bankAccount.bank }} <br>
              <strong>Agência:</strong> {{ bankAccount.agency }} <br>
              <strong>Conta:</strong> {{ bankAccount.number }} <br>
              <strong>Tipo:</strong> {{ bankAccount.type === 'SAVING' ? 'Poupança' : 'Corrente' }} <br>
            </span>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <el-tooltip
      :disabled="dispute.status !== 'PRE_NEGOTIATION'"
      content="Disputas em pré negociação não podem ser editadas"
    >
      <div class="dispute-overview-view__actions">
        <el-button
          :disabled="dispute.status === 'PRE_NEGOTIATION'"
          type="primary"
          data-testid="edit-dispute"
          @click="openDisputeDialog()"
        >
          Editar
        </el-button>
      </div>
    </el-tooltip>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    JusTags: () => import('@/components/others/JusTags'),
    DisputeCodeLink: () => import('@/components/buttons/DisputeCodeLink')
  },

  props: {
    dispute: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    descriptionCollapse: true
  }),

  computed: {
    ...mapGetters({
      isRecoveryStrategy: 'isWorkspaceRecovery'
    }),

    statusTooltip() {
      const { dispute } = this
      if (dispute.status === 'PRE_NEGOTIATION') {
        return dispute.properties['MOTIVO PRE NEGOCIACAO']
      } else if (dispute.status === 'PENDING') {
        return 'Faltam dados de contato da parte ou do advogado da parte'
      } else {
        return ''
      }
    },

    campaign() {
      return this.dispute?.campaign
    },

    skipEnrichment() {
      return this.dispute?.campaign?.skipEnrichment
    },

    computedDescription() {
      if (this.dispute.description && this.dispute.description.length > 140) {
        if (this.descriptionCollapse) {
          return this.dispute.description.substring(0, 140) + '...'
        }
      }
      return this.dispute.description
    }
  },

  methods: {
    openDisputeDialog() {
      this.$emit('openDispute')
    },

    openTimelineModal(event) {
      this.$emit('openTimeline', event)
    }
  }
}
</script>
