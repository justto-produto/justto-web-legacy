<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="editDisputeDialogVisible"
    title="Editar disputa"
    width="70%"
  >
    <el-form
      v-if="editDisputeDialogVisible"
      ref="disputeForm"
      v-loading="editDisputeDialogLoading"
      :model="disputeForm"
      :rules="disputeFormRules"
      label-position="top"
      @submit.native.prevent="editDispute"
    >
      <h3>Detalhes da Disputa</h3>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="Número do Processo"
            prop="disputeCode"
          >
            <el-input
              v-model="disputeForm.disputeCode"
              v-mask="['XXXXXXX-XX.XXXX.X.XX.XXXX', 'XXXXXXX-XX.XXXX.X.XX.XXXXX']"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="Código interno"
            prop="externalId"
          >
            <el-input v-model="disputeForm.externalId" />
          </el-form-item>
        </el-col>
      </el-row>

      <h3>Engajamento</h3>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="Estratégia"
            prop="disputeStrategy"
          >
            <el-select
              v-model="selectedStrategyId"
              placeholder="Escolha a nova estratégia"
              filterable
              data-testid="strategy-input"
            >
              <el-option
                v-for="(strategy, index) in strategies"
                :key="`${strategy.id}-${index}`"
                :label="strategy.name"
                :value="strategy.id"
                :disabled="strategy.disabled || false"
              />
              <el-option
                v-if="!isValidStrategie"
                :value="dispute.strategyId"
                label="A estratégia utilizada não está mais disponível para uso"
                selected
                disabled
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col
          :span="24"
          class="dispute-overview-view__select-switch"
        >
          <div class="content">
            <div>Sempre engajar o autor</div>
            <p>Deixando <b>selecionada</b> esta opção, <b>sempre</b> iremos enviar mensagens automáticas para o autor.</p>
          </div>
          <el-switch
            v-model="disputeForm.alwaysContactParty"
            @input="$forceUpdate()"
          />
        </el-col>
        <el-tooltip
          content="Sempre engaja autor está habilitado"
          :disabled="!disputeForm.alwaysContactParty"
        >
          <el-col
            :span="24"
            :style="disputeForm.alwaysContactParty ? 'cursor: not-allowed' : ''"
            class="dispute-overview-view__select-switch"
          >
            <div class="content">
              <div>Engajar autor se não tiver advogado</div>
              <p>
                Deixando <b>selecionada</b> esta opção, iremos enviar mensagens para o autor quando não houver advogado constituído.
              </p>
            </div>
            <el-switch
              v-model="disputeForm.contactPartyWhenNoLowyer"
              :disabled="disputeForm.alwaysContactParty"
            />
          </el-col>
        </el-tooltip>
        <el-tooltip
          content="Sempre engaja autor está habilitado"
          :disabled="!disputeForm.alwaysContactParty"
        >
          <el-col
            :span="24"
            :style="disputeForm.alwaysContactParty ? 'cursor: not-allowed' : ''"
            class="dispute-overview-view__select-switch"
          >
            <div class="content">
              <div>Engajar autor se advogado não possuir contatos válidos para ser engajado</div>
              <p>
                Deixando <b>selecionada</b> esta opção, iremos enviar mensagens para o autor se o <b>advogado não possuir dados válidos</b> para ser contatado.
              </p>
            </div>
            <el-switch
              v-model="disputeForm.contactPartyWhenInvalidLowyer"
              :disabled="disputeForm.alwaysContactParty"
            />
          </el-col>
        </el-tooltip>
      </el-row>

      <h3>Valor proposto</h3>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            :rules="validateLastOfferValue()"
            label="Valor"
            prop="lastOfferValue"
          >
            <el-tooltip
              :content="`${$tc('UPPER_RANGE', isRecoveryStrategy)} zerad${isRecoveryStrategy ? 'o' : 'a'}. Coloque um${isRecoveryStrategy ? '' : 'a'} ${$tc('UPPER_RANGE', isRecoveryStrategy)} para poder alterar o valor proposto.`"
              :disabled="!!disputeForm.disputeUpperRange"
            >
              <div
                class="el-input"
                :class="{ 'is-disabled': !disputeForm.disputeUpperRange }"
              >
                <money
                  v-model="disputeForm.lastOfferValue"
                  :disabled="!disputeForm.disputeUpperRange"
                  class="el-input__inner"
                  data-testid="proposal-value-input"
                  @change.native="lastOfferValueHasChanged = true"
                />
              </div>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item
            label="Proposto por"
            prop="lastOfferValueName"
          >
            <el-select
              v-model="selectedNegotiatorId"
              :disabled="!disputeForm.disputeUpperRange"
              filterable
              placeholder="Autor da contraproposta"
              data-testid="proposal-negotiator-input"
            >
              <el-option
                v-for="(negotiator, index) in disputeNegotiations"
                :key="`${index}-${negotiator.id}`"
                :label="negotiator.name"
                :value="negotiator.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <h3>Outras configurações</h3>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item
            :rules="validateDisputeUpperRange()"
            :label="$tc('UPPER_RANGE', isRecoveryStrategy)"
            prop="disputeUpperRange"
          >
            <money
              v-model="disputeForm.disputeUpperRange"
              class="el-input__inner"
              data-testid="bondary-input"
              @blur.native="checkZeroUpperRange"
              @change.native="disputeUpperRangeChangedHandler"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="Fim da negociação"
            prop="expirationDate"
          >
            <el-date-picker
              v-model="disputeForm.expirationDate"
              :clearable="false"
              data-testid="expiration-date-input"
              format="dd/MM/yyyy"
              type="date"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="Classificação"
            prop="classification"
          >
            <el-input v-model="disputeForm.classification" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="Dano material"
            prop="materialDamage"
          >
            <money
              v-model="disputeForm.materialDamage"
              class="el-input__inner"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="Dano moral"
            prop="moralDamage"
          >
            <money
              v-model="disputeForm.moralDamage"
              class="el-input__inner"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="Valor do processo"
            prop="requestedValue"
          >
            <money
              v-model="disputeForm.requestedValue"
              class="el-input__inner"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="Valor provisionado"
            prop="provisionedValue"
          >
            <money
              v-model="disputeForm.provisionedValue"
              class="el-input__inner"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="Descrição"
            prop="description"
          >
            <el-input
              v-model="disputeForm.description"
              type="textarea"
              rows="3"
              data-testid="description-input"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer">
      <el-button
        plain
        @click="editDisputeDialogVisible = false"
      >
        Cancelar
      </el-button>

      <el-button
        :loading="editDisputeDialogLoading"
        type="primary"
        data-testid="confirm-edit-data"
        @click="editDispute"
      >
        Editar dados
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { validateZero } from '@/utils/validations'
import { getRoles } from '@/utils'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      editDisputeDialogVisible: false,
      editDisputeDialogLoading: false,
      disputeUpperRangeHasChanged: false,
      lastOfferValueHasChanged: false,
      selectedClaimantId: '',
      selectedStrategyId: '',
      selectedNegotiatorId: '',
      disputeForm: {
        description: '',
        expirationDate: '',
        disputeUpperRange: '',
        lastOfferValue: '',
        classification: '',
        contactPartyWhenNoLowyer: false,
        contactPartyWhenInvalidLowyer: false,
        denySavingDeposit: false,
        disputeCode: '',
        zeroUpperRange: false,
        materialDamage: '',
        moralDamage: '',
        requestedValue: '',
        externalId: '',
        provisionedValue: ''
      },
      disputeFormRules: {
        disputeUpperRange: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        lastOfferValue: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      },
      dispute: {},
      strategies: []
    }
  },

  computed: {
    ...mapGetters({
      isRecoveryStrategy: 'isWorkspaceRecovery'
    }),

    isValidStrategie() { return (this.strategies || []).map(s => s.id).includes(this.dispute.strategyId) },

    disputeNegotiations() {
      if (this.dispute?.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'RESPONDENT', 'NEGOTIATOR')
      }
      return []
    }
  },

  methods: {
    ...mapActions({
      getDispute: 'getDisputeDTO',
      getStrategies: 'getMyStrategiesLite'
    }),

    show() {
      if (this.$route?.params?.id) {
        this.editDisputeDialogLoading = true
        this.getDispute(Number(this.$route.params.id)).then(dispute => {
          this.dispute = dispute
          this.selectedStrategyId = dispute.strategyId || ''

          this.getStrategies().then(strategies => {
            this.strategies = strategies

            if (!strategies.map(({ id }) => id).includes(this.selectedStrategyId)) {
              this.strategies.push({ id: this.dispute.strategyId, name: 'A estratégia utilizada não está mais disponível para uso', disabled: true })
            }
          })
        }).finally(() => {
          this.editDisputeDialogVisible = true
          this.handleOpenDialog()
        })
      }
    },

    handleOpenDialog() {
      this.disputeUpperRangeHasChanged = false
      this.lastOfferValueHasChanged = false
      const dispute = JSON.parse(JSON.stringify(this.dispute))

      //   this.selectedClaimantId = this.disputeClaimants && this.disputeClaimants.length ? this.disputeClaimants[0].id : ''
      this.selectedNegotiatorId = this.disputeNegotiations?.length ? this.disputeNegotiations[0].id : ''

      this.disputeForm = {
        id: dispute?.id,
        disputeCode: dispute?.code,
        disputeUpperRange: parseFloat(dispute?.disputeUpperRange),
        lastOfferValue: parseFloat(dispute?.lastOfferValue),
        expirationDate: dispute?.expirationDate?.dateTime,
        description: dispute?.description || '',
        materialDamage: dispute?.materialDamage || '',
        moralDamage: dispute?.moralDamage || '',
        requestedValue: dispute?.requestedValue || '',
        externalId: dispute?.externalId || '',
        provisionedValue: dispute?.provisionedValue || '',
        classification: dispute?.classification?.name || '',
        contactPartyWhenNoLowyer: Boolean(dispute?.contactPartyWhenNoLowyer),
        contactPartyWhenInvalidLowyer: Boolean(dispute?.contactPartyWhenInvalidLowyer),
        alwaysContactParty: Boolean(dispute?.alwaysContactParty),
        denySavingDeposit: Boolean(dispute?.denySavingDeposit),
        zeroUpperRange: !parseFloat(dispute?.disputeUpperRange)
      }

      this.editDisputeDialogLoading = false

      this.$nextTick(() => { this.$refs.disputeForm.clearValidate() })
    },

    editDispute(event) {
      console.log('editDispute', event)
    },

    disputeUpperRangeChangedHandler() {
      this.disputeUpperRangeHasChanged = true
      if (this.disputeForm.disputeUpperRange > 0) {
        this.disputeForm.lastOfferValue = this.disputeForm.disputeUpperRange
      }
    },

    // VALIDATIONS

    validateLastOfferValue() {
      if (this.lastOfferValueHasChanged && this.disputeForm.disputeUpperRange) {
        return [{ validator: validateZero, message: 'Valor precisa ser acima de 0', trigger: 'submit' }]
      }
      return []
    },

    validateDisputeUpperRange() {
      if (this.disputeUpperRangeHasChanged) {
        return [{ validator: validateZero, message: 'Valor precisa ser acima de 0', trigger: 'submit' }]
      }
      return []
    }
  }
}
</script>
