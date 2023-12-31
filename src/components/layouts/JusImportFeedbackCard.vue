<template>
  <div
    class="jus-import-feedback-card"
    :class="{'extra-margin-top': showReplicate}"
  >
    <div class="jus-import-feedback-card-header">
      <el-tag
        :color="color"
        class="el-tag--mapped-campaign-tag"
      >
        {{ campaignTitle }}
      </el-tag>

      <el-tooltip
        v-if="index === 2 && originalQuantity > 1"
        content="Replica a configuração da campanha acima para as demais."
        placement="top"
        :open-delay="500"
      >
        <el-checkbox-group
          v-model="replicates"
          size="small"
        >
          <el-checkbox-button
            @change="handleReplicate($event, mappedCampaign, index)"
          >
            Utilizar dados da campanha acima
          </el-checkbox-button>
        </el-checkbox-group>
      </el-tooltip>

      <el-tag
        :color="color"
        class="el-tag--mapped-campaign-tag"
        style="visibility: hidden;"
      >
        {{ campaignTitle }}
      </el-tag>
    </div>

    <el-card
      :class="{'hide': index > 1 && originalQuantity > 1 && !show}"
      :style="'border-left: solid 4px ' + color"
    >
      <!-- Respondent -->
      <el-input
        v-model="respondent"
        class="unhide"
        :class="{'has-error': errorFields.includes('respondent')}"
        data-testid="feedback-respondent"
        :placeholder="`Dê um nome para ${isWorkspaceRecovery ? 'a sua' : 'o seu'} ${$tc('PARTY_RESPONDENT', isWorkspaceRecovery)}`"
        @input="clearErrorField('respondent')"
      >
        <div slot="prefix">
          <pre-mapped-alert v-if="respondent !== initialCampaign.respondent && initialCampaign.respondent" />

          <i
            v-else-if="errorFields.includes('respondent')"
            class="el-icon-error el-input__icon has-error-icon"
          />
          <i
            v-else
            :class="respondent === '' ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
            class="el-input__icon"
          />
        </div>
      </el-input>

      <!-- Nome da campanha -->
      <el-input
        v-model="campaignName"
        class="select-strategy unhide"
        :validate-event="true"
        :class="{'has-error': errorFields.includes('name')}"
        data-testid="feedback-campaignName"
        placeholder="Dê um nome para a sua Campanha"
        @input="clearErrorField('name')"
      >
        <div slot="prefix">
          <i
            v-if="errorFields.includes('name')"
            class="el-icon-error el-input__icon has-error-icon"
          />
          <i
            v-else
            :class="campaignName === '' ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
            class="el-input__icon"
          />
        </div>
      </el-input>

      <div
        v-show="campaignNameDuplicated && campaignName !== ''"
        class="select-strategy__messages"
      >
        <div>
          Já existe uma campanha com este nome.
          <a @click.prevent="showDuplicatedAlert(campaignName)">
            Entenda melhor.
          </a>
        </div>
      </div>

      <!-- Estratégia -->
      <el-select
        ref="strategySelect"
        v-model="strategy"
        :default-first-option="false"
        value-key="name"
        clearable
        filterable
        class="select-strategy"
        :class="{'has-error': errorFields.includes('strategy')}"
        placeholder="Escolha uma estratégia"
        data-testid="feedback-strategy"
        @input="clearErrorField('strategy')"
      >
        <div slot="prefix">
          <pre-mapped-alert v-if="strategy !== initialCampaign.strategy && initialCampaign.strategy" />

          <i
            v-if="errorFields.includes('strategy')"
            class="el-icon-error el-input__icon has-error-icon"
          />
          <i
            v-else
            :class="!strategy.id ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
            class="el-input__icon"
          />
        </div>
        <el-option
          v-for="optionStrategy in strategies"
          :key="optionStrategy.id"
          :label="optionStrategy.name"
          :value="optionStrategy"
        />
      </el-select>

      <div
        v-show="Boolean(strategy.id)"
        class="select-strategy__messages"
      >
        <div>
          <a @click.prevent="openDialogEngagement">
            Ver estratégia de engajamento das partes
          </a>
        </div>
      </div>

      <!-- Data do pagamento -->
      <div
        v-if="isPaymentStrategy"
        class="jus-import-feedback-card__number"
      >
        <div>
          <pre-mapped-alert v-if="paymentDeadLine !== initialCampaign.paymentDeadLine && initialCampaign.paymentDeadLine" />

          <i
            v-else
            class="el-icon-circle-check el-input__icon--success"
          />
          Data do pagamento
        </div>
        <div>
          <el-input-number
            v-model="paymentDeadLine"
            :min="0"
            :max="9999"
            name="payment-deadline"
            controls-position="right"
          />
          <span class="jus-import-feedback-card__sufix">
            {{ $tc('import.label.business-day', 2) }} {{ $tc('import.label.business-day', 1).toLowerCase() }}
          </span>
        </div>
      </div>

      <el-date-picker
        v-model="deadline"
        :prefix-icon="errorFields.includes('deadline') ? 'el-icon-error' : deadline === null ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
        :picker-options="datePickerOptions"
        :class="{'has-error': errorFields.includes('deadline')}"
        class="unhide"
        type="date"
        format="dd/MM/yyyy"
        placeholder="Defina a data limite para a negociação"
        data-testid="feedback-datapicker"
        value-format="yyyy-MM-dd"
        @input="clearErrorField('deadline')"
      />

      <el-select
        v-model="negotiatorIds"
        value-key="name"
        size="large"
        multiple
        filterable
        placeholder="Escolha os negociadores"
        class="select-negotiator"
        :class="{'has-error': errorFields.includes('negotiatorIds')}"
        data-testid="feedback-negotiators"
        @input="clearErrorField('negotiatorIds')"
      >
        <div slot="prefix">
          <i
            v-if="errorFields.includes('negotiatorIds')"
            class="el-icon-error el-input__icon has-error-icon"
          />
          <i
            v-else
            :class="negotiatorIds.length === 0 ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
            class="el-input__icon"
          />
        </div>
        <el-option
          v-for="item in negotiatorsList"
          :key="item.person.id"
          :label="item.person.name"
          :value="item.person.id"
        >
          <jus-avatar-user
            :name="item.person.name"
            size="xs"
            style="vertical-align: middle"
          />
          <span style="vertical-align: middle;margin-left: 10px;">{{ item.person.name }}</span>
        </el-option>
      </el-select>

      <div
        v-if="!isWorkspaceRecovery"
        class="jus-import-feedback-card__switch"
      >
        <i class="el-icon-circle-check el-input__icon--success" />
        <div class="content">
          <div>Percentual da primeira proposta sobre {{ $tc('UPPER_RANGE_WITH_ARTICLE', isWorkspaceRecovery) }}</div>
          <el-slider
            v-model="initialOfferPercentage"
            :min="0"
            :max="100"
            :show-stops="true"
            :marks="marks"
            :label="`Percentual da primeira proposta sobre ${$tc('UPPER_RANGE_WITH_ARTICLE', isWorkspaceRecovery)}`"
          />
        </div>
      </div>

      <div class="jus-import-feedback-card__switch">
        <i class="el-icon-circle-check el-input__icon--success" />
        <div class="content">
          <div>Enviar mensagens somente em horário comercial</div>
          <p>
            Deixando <b>selecionada</b> esta opção, iremos agendar o envio das mensagens somente dentro do horário comercial.
          </p>
        </div>
        <el-switch v-model="businessHoursEngagement" />
      </div>

      <div class="jus-import-feedback-card__switch">
        <i class="el-icon-circle-check el-input__icon--success" />

        <div class="content">
          <div>Enviar mensagem para autor e advogado</div>

          <p>
            Deixando <b>selecionada</b> esta opção, também iremos enviar mensagens para o autor.
          </p>
        </div>

        <el-switch v-model="alwaysContactParty" />
      </div>

      <div
        v-if="!alwaysContactParty"
        class="jus-import-feedback-card__switch"
      >
        <i class="el-icon-circle-check el-input__icon--success" />

        <div class="content">
          <div>Enviar mensagem para o autor somente se não tiver advogado</div>

          <p>
            Deixando <b>selecionada</b> esta opção, iremos enviar mensagens para o autor quando não houver advogado constituído.
          </p>
        </div>

        <el-switch v-model="contactPartyWhenNoLowyer" />
      </div>

      <div
        v-if="!alwaysContactParty"
        class="jus-import-feedback-card__switch"
      >
        <i class="el-icon-circle-check el-input__icon--success" />

        <div class="content">
          <div>Enviar mensagem para autor somente se advogado não possuir contatos válidos para ser engajado</div>

          <p>
            Deixando <b>selecionada</b> esta opção, iremos enviar mensagens para o autor se o <b>advogado não possuir dados válidos</b> para ser contatado.
          </p>
        </div>

        <el-switch v-model="contactPartyWhenInvalidLowyer" />
      </div>

      <div class="jus-import-feedback-card__switch">
        <i class="el-icon-circle-check el-input__icon--success" />
        <div class="content">
          <div>Permitir somente depósito em conta-corrente</div>

          <p>
            Deixando <b>selecionada</b> esta opção, em caso de acordo fechado será bloqueado o depósito em conta poupança e pagamento via PIX, sendo permitido somente <b>depósito em conta corrente</b>.
          </p>
        </div>

        <el-switch v-model="denySavingDeposit" />
      </div>

      <div
        v-if="!denySavingDeposit"
        class="jus-import-feedback-card__switch"
      >
        <i class="el-icon-circle-check el-input__icon--success" />
        <div class="content">
          <div>Bloquear depósito via Pix</div>

          <p>
            Deixando <b>selecionada</b> esta opção, em caso de acordo fechado será <b>bloqueado</b> o depósito via Pix.
          </p>
        </div>

        <el-switch
          v-model="denyPixDeposit"
          :disabled="!usePixAccountType"
        />
      </div>

      <div class="jus-import-feedback-card__switch">
        <i class="el-icon-circle-check el-input__icon--success" />
        <div class="content">
          <div>Enriquecer disputas automaticamente <strong>(Atenção: informação importante)</strong></div>
          <p>
            Deixando <b>selecionada</b> esta opção, os dados das partes como email, telefone e OAB, <b>serão enriquecidos automaticamente</b>.
            <br>
            Esta opção é efetivada <b>somente mediante solicitação do usuário</b>, sendo a ação de sua total responsabilidade.
            <br>
            Coletamos os dados a fim exclusivamente de enriquecer a disputa e não somos detentores de tais informações.
            <br>
            Ao ativar você está de acordo com os nossos
            <a
              rel="noopener noreferrer"
              href="http://https://justto.com.br/termos-de-uso"
              target="_blank"
            >termos de uso</a>.
          </p>
        </div>

        <el-switch v-model="enrichDisputes" />
      </div>
    </el-card>

    <jus-engagements-dialog
      v-model="strategy"
      :dialog-visible.sync="dialogVisible"
      :is-manual="strategy.triggerType === 'MANUAL'"
    />
  </div>
</template>

<script>
import { normalizeString } from '@/utils'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'JusImportFeedbackCard',

  components: {
    JusEngagementsDialog: () => import('@/components/dialogs/JusEngagementsDialog'),
    PreMappedAlert: () => import('@/components/buttons/PreMappedAlert')
  },

  props: {
    mappedCampaign: {
      type: Object,
      default: () => {}
    },

    index: {
      type: Number,
      default: 1
    },

    show: {
      type: Boolean,
      default: true
    },

    originalQuantity: {
      type: Number,
      default: () => 1
    }
  },

  data() {
    return {
      replicateForAll: false,
      color: '#ff9300',
      initialCampaignName: '',
      mappedName: '',
      respondent: '',
      paymentDeadLine: 0,
      campaignName: '',
      campaignTimeout: null,
      campaignNameDebounce: 0,
      campaignNameDuplicated: false,
      strategy: { communications: [] },
      strategyId: '',
      dialogVisible: false,
      deadline: null,
      negotiatorIds: [],
      businessHoursEngagement: true,
      contactPartyWhenNoLowyer: false,
      alwaysContactParty: false,
      contactPartyWhenInvalidLowyer: false,
      skipEnrichment: true,
      enrichDisputes: true,
      denySavingDeposit: false,
      denyPixDeposit: false,
      replicates: [],
      datePickerOptions: {
        disabledDate(date) {
          return date < new Date()
        }
      },
      initialOfferPercentage: 60,
      marks: {
        10: '10%',
        20: '20%',
        30: '30%',
        40: '40%',
        50: '50%',
        60: '60%',
        70: '70%',
        80: '80%',
        90: '90%'
      },
      initialCampaign: {}
    }
  },

  computed: {
    ...mapGetters([
      'isJusttoDev',
      'errorFields',
      'isWorkspaceRecovery',
      'getMyStrategiesLite',
      'usePixAccountType'
    ]),

    strategies() {
      const activeSrategies = this.getMyStrategiesLite.filter(s => !s.archived)
      if (this.isJusttoDev) {
        return activeSrategies
      } else {
        return activeSrategies.filter(s => !s.name.startsWith('[TST]'))
      }
    },

    negotiatorsList() {
      return this.$store.getters.workspaceMembersSorted
    },

    campaignTitle() {
      return this.campaignName ? this.campaignName : `Campanha ${this.index}`
    },

    isPaymentStrategy() {
      let isStrategy = false
      if (this.strategy && this.strategy.types) {
        this.strategy.types.map(type => {
          if (type.includes('PAYMENT')) isStrategy = true
        })
        return isStrategy
      } else {
        return false
      }
    },

    showReplicate() {
      return this.index === 2 && this.originalQuantity > 1
    }
  },

  watch: {
    businessHoursEngagement(value) {
      this.mappedCampaign.businessHoursEngagement = value
    },
    contactPartyWhenNoLowyer(value) {
      this.mappedCampaign.contactPartyWhenNoLowyer = value
    },
    alwaysContactParty(value) {
      this.mappedCampaign.alwaysContactParty = value
    },
    contactPartyWhenInvalidLowyer(value) {
      this.mappedCampaign.contactPartyWhenInvalidLowyer = value
    },

    enrichDisputes(enrich) {
      this.mappedCampaign.skipEnrichment = !enrich
    },

    skipEnrichment(value) {
      this.mappedCampaign.skipEnrichment = value
    },
    denySavingDeposit(value) {
      this.mappedCampaign.denySavingDeposit = value

      this.denyPixDeposit = value
    },

    denyPixDeposit(value) {
      this.mappedCampaign.denyPixDeposit = value
    },

    respondent(value) {
      this.mappedCampaign.respondent = value
    },
    campaignName(value) {
      this.mappedCampaign.name = value

      if (value) {
        clearTimeout(this.campaignNameDebounce)
        this.campaignNameDebounce = setTimeout(() => {
          this.$store.dispatch('getCampaignByName', value).then(response => {
            this.campaignNameDuplicated = false
            response.content.forEach(campaign => {
              if (campaign.name.toLowerCase() === value.toLowerCase()) {
                this.campaignNameDuplicated = true
              }
            })
          })
        }, 800)
      } else {
        this.campaignNameDuplicated = false
      }
    },
    strategy(value) {
      if ([null, undefined].includes(value.communications)) {
        this.strategy.communications = []
      }
      this.mappedCampaign.strategy = value.name
      this.mappedCampaign.strategyId = value.id
    },
    deadline(value) {
      this.mappedCampaign.deadline = {
        dateTime: this.$moment(value).endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]')
      }
    },
    negotiatorIds(value) {
      this.mappedCampaign.negotiatorIds = value
    },
    paymentDeadLine(value) {
      this.mappedCampaign.paymentDeadLine = value
    },
    initialOfferPercentage(value) {
      this.mappedCampaign.initialOfferPercentage = value
    }
  },

  beforeMount() {
    const preferences = JSON.parse(localStorage.getItem('jusfeedbackpreferences')) || {}
    this.businessHoursEngagement = preferences.businessHoursEngagement || true
    this.contactPartyWhenNoLowyer = preferences.contactPartyWhenNoLowyer || false
    this.contactPartyWhenInvalidLowyer = preferences.contactPartyWhenInvalidLowyer || false
    this.skipEnrichment = false
    this.denySavingDeposit = preferences.denySavingDeposit || false
    this.denyPixDeposit = this.usePixAccountType ? (preferences.denyPixDeposit || false) : true
    this.mappedCampaign.businessHoursEngagement = this.businessHoursEngagement
    this.mappedCampaign.contactPartyWhenNoLowyer = this.contactPartyWhenNoLowyer
    this.mappedCampaign.contactPartyWhenInvalidLowyer = this.contactPartyWhenInvalidLowyer
    this.mappedCampaign.alwaysContactParty = this.alwaysContactParty
    this.mappedCampaign.skipEnrichment = this.skipEnrichment
    this.mappedCampaign.denySavingDeposit = this.denySavingDeposit
    this.mappedCampaign.denyPixDeposit = this.denyPixDeposit
    this.mappedCampaign.paymentDeadLine = this.paymentDeadLine
    this.mappedCampaign.initialOfferPercentage = this.isWorkspaceRecovery ? 100 : this.initialOfferPercentage

    this.campaignName = this.mappedCampaign.campaign || ''
    this.respondent = this.mappedCampaign.respondent || ''
    this.mapEmails(this.mappedCampaign.negotiatoremail)
    this.mapStrategy(this.mappedCampaign.strategy)

    this.initialCampaign = { ...this.mappedCampaign }

    if (this.mappedCampaign.deadline && this.$moment(new Date(this.mappedCampaign.deadline)).isValid()) {
      this.deadline = this.mappedCampaign.deadline
    }
  },

  methods: {
    ...mapActions(['clearErrorField']),

    openDialogEngagement(_event) {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.dialogVisible = true
      })
    },

    showDuplicatedAlert(campaignName) {
      this.$alert('', {
        title: 'Campanhas associadas',
        message: `Já existe uma campanha com o nome <strong>${campaignName}</strong>.<br>
        Ao importar novos casos para essa campanha as estratégias de comunicação definidas anteriormente não serão alteradas`,
        confirmButtonText: 'OK',
        dangerouslyUseHTMLString: true
      })
    },

    mapStrategy(strategy) {
      if (strategy) {
        const matchedStrategies = []
        for (const currentStrategy of this.strategies) {
          if (normalizeString(currentStrategy.name).indexOf(normalizeString(strategy)) > -1) {
            matchedStrategies.push(currentStrategy)
          }
        }
        if (matchedStrategies.length === 1) {
          this.strategy = matchedStrategies[0]
        }
      }
    },

    mapEmails(emails) {
      if (emails) {
        const emailsList = emails.split(',')
        const vefiryEmail = /\S+@\S+\.\S+/
        for (let email of emailsList) {
          email = email.trim()
          if (vefiryEmail.test(email)) {
            for (const negotiator of this.negotiatorsList) {
              if (email === negotiator.accountEmail) {
                this.negotiatorIds.push(negotiator.personId)
              }
            }
          }
        }
      }
    },

    handleReplicate(replicate, mappedCampaign, index) {
      if (replicate) {
        this.$set(mappedCampaign, 'replicateIndex', index - 2)
        this.$set(mappedCampaign, 'replicate', replicate)
      } else {
        this.$delete(mappedCampaign, 'replicateIndex')
        this.$delete(mappedCampaign, 'replicate')
      }
    }
  }
}
</script>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

.jus-import-feedback-card {
  width: 100%;
  margin-top: 30px;

  &.extra-margin-top {
    margin-top: 56px;

    .jus-import-feedback-card-header .el-checkbox-group {
      margin-top: -36px;
    }
  }

  .jus-import-feedback-card-header {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .el-tag--mapped-campaign-tag {
      margin-bottom: 10px;
      text-align: center;
      color: #ffffff;
    }
  }

  .el-autocomplete, .el-select, .el-input, .select-strategy__messages {
    width: 100%;
  }

  .el-card {
    .el-input__inner {
      border-bottom: 1px solid #dcdfe6 !important;
      border-radius: 0px;
      border-top: 0;
      border-left: 0;
      border-right: 0;
    }

    .el-card__body {
      .el-date-editor.unhide {
        width: 100% !important;
      }
    }
  }

  .el-card.hide {
    .el-card__body {
      div:not(.unhide) {
        display: none !important;
      }
    }
  }

  .el-input-number {
    margin: 0 8px;
    width: 100px;

    .el-input__inner {
      border-top: 0;
      border-bottom: 0;
    }
  }

  .el-card__body {
    padding: 0;

    .el-select:last-of-type {
      .el-input__inner {
        border-bottom: 0;
      }
    }
  }
  .el-select__tags {
    margin-left: 35px;
  }
  .el-icon-circle-check-outline {
    color: $--color-light-gray;
  }
  .select-strategy__messages {
    border-bottom: 1px solid #dcdfe6;
    min-height: 1.3px;
    > div {
      padding: 0px 0px 10px 16px;
    }
  }
  .select-negotiator {
    .el-select__input {
      margin-left: 5px;
    }
  }
  .el-icon-question {
    cursor: pointer;
  }
  &__sufix {
    width: 218px;
    display: inline-block;
  }
  &__number {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 13px;
    width: 100%;
    border-bottom: 1px solid #dcdfe6;
    .el-icon-circle-check-outline, .el-icon-circle-check {
      font-size: 1.3rem;
      margin-right: 5px;
    }
    .el-input__inner {
      border-left: 1px solid #dcdfe6 !important;
      border-right: 1px solid #dcdfe6 !important;
      border-top: 0 !important;
      border-bottom: 0 !important;
    }
  }
  &__switch {
    width: 100%;
    display: flex;
    padding: 12px 13px;
    border-bottom: 1px solid #dcdfe6;

    .content  {
      width: 100%;

      strong {
        color: $--color-danger;
      }
    }
    p {
      font-style: italic;
      font-size: 12px;
      margin: 6px 20px 0 0;
    }
    .el-icon-circle-check-outline, .el-icon-circle-check {
      font-size: 1.3rem;
      margin-right: 9px;
    }
  }
  .el-select {
    .el-select__tags-text {
      color: $--color-text-primary;
    }
    .el-tag__close.el-icon-close {
      background-color: $--color-text-secondary;
    }
  }
}

.el-message-box__title {
  text-transform: none;
}

.has-error {
  border-color: $--color-warning;

  > .el-input__inner::placeholder {
    color: $--color-warning;
  }

  > .el-input {

    > .el-input__inner::placeholder {
      color: $--color-warning;
    }

    > .el-input__prefix {
      color: $--color-warning;
    }
  }

  > .el-input__prefix {
    color: $--color-warning;
  }
}

.has-error-icon {
  color: $--color-warning;
}
</style>
