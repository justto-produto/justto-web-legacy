<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="editDisputeDialogVisible"
    custom-class="dispute-form-dialog"
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
      @submit.native.prevent="handleEditDispute"
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
        <el-col :span="12">
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

        <el-col :span="12">
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
      </el-row>

      <el-row :gutter="20">
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
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="Classificação"
            prop="classification"
          >
            <el-input v-model="disputeForm.classification" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="Subclassificação"
            prop="classificationDetails"
          >
            <el-select
              v-model="disputeForm.classificationDetails"
              class="el-input"
              multiple
              filterable
              allow-create
            >
              <el-option
                v-for="(sub, subIndex) in subClassifications"
                :key="`sub-classification-${subIndex}`"
                :label="sub.name"
                :value="subIndex"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
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
        @click="hide()"
      >
        Cancelar
      </el-button>

      <el-button
        :loading="editDisputeDialogLoading"
        type="primary"
        data-testid="confirm-edit-data"
        @click="handleEditDispute"
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
        provisionedValue: '',
        classificationDetails: []
      },
      disputeFormRules: {
        disputeUpperRange: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        lastOfferValue: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      },
      subClassifications: [],
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
      setDispute: 'editDispute',
      getDispute: 'getDispute',
      getStrategies: 'getMyStrategiesLite',
      setSubclassifications: 'setDisputeClassificationsDetails'
    }),

    show() {
      if (this.$route?.params?.id) {
        this.editDisputeDialogLoading = true
        this.getDispute(Number(this.$route.params.id)).then(dispute => {
          this.dispute = dispute
          this.selectedStrategyId = dispute.strategyId || ''
          this.subClassifications = dispute?.classification?.classificationDetails || [] // Monta lista de Subclassificações

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

    hide() {
      this.editDisputeDialogVisible = false
      this.editDisputeDialogLoading = false
      this.$refs.disputeForm.clearValidate()
      this.$emit('hide')
    },

    handleOpenDialog() {
      this.disputeForm = {
        id: this.dispute?.id,
        disputeCode: this.dispute?.code,
        disputeUpperRange: parseFloat(this.dispute?.disputeUpperRange),
        lastOfferValue: parseFloat(this.dispute?.lastOfferValue),
        expirationDate: this.dispute?.expirationDate?.dateTime,
        description: this.dispute?.description || '',
        materialDamage: this.dispute?.materialDamage || '',
        moralDamage: this.dispute?.moralDamage || '',
        requestedValue: this.dispute?.requestedValue || '',
        externalId: this.dispute?.externalId || '',
        provisionedValue: this.dispute?.provisionedValue || '',
        classification: this.dispute?.classification?.name || '',
        contactPartyWhenNoLowyer: Boolean(this.dispute?.contactPartyWhenNoLowyer),
        contactPartyWhenInvalidLowyer: Boolean(this.dispute?.contactPartyWhenInvalidLowyer),
        alwaysContactParty: Boolean(this.dispute?.alwaysContactParty),
        denySavingDeposit: Boolean(this.dispute?.denySavingDeposit),
        zeroUpperRange: !parseFloat(this.dispute?.disputeUpperRange),
        classificationDetails: (this.dispute?.classification?.classificationDetails || []).map(({ _ }, index) => index) // Atribui os indices das subclassificações ao model do select.
      }

      this.selectedNegotiatorId = this.disputeNegotiations?.length ? this.disputeNegotiations[0].id : ''
      this.disputeUpperRangeHasChanged = false
      this.lastOfferValueHasChanged = false
      this.editDisputeDialogLoading = false

      this.$nextTick(() => { this.$refs.disputeForm.clearValidate() })
    },

    handleEditDispute() {
      this.$refs.disputeForm.validate(valid => {
        if (valid) {
          this.editDisputeDialogLoading = true

          const tag = this.$createElement
          const hasUpperRangeProblem = this.isRecoveryStrategy ? this.disputeForm.lastOfferValue < this.disputeForm.disputeUpperRange : this.disputeForm.lastOfferValue > this.disputeForm.disputeUpperRange
          const hasUpperRangeProblemText = `- ${this.$tc('UPPER_RANGE', this.isRecoveryStrategy)} está ${this.isRecoveryStrategy ? 'acima' : 'abaixo'} do valor proposto.`

          this.$msgbox({
            title: 'Atenção!',
            message: tag('p', null, [
              tag('div', null, '- As novas informações vão sobrescrever as antigas.'),
              hasUpperRangeProblem ? tag('div', null, hasUpperRangeProblemText) : null,
              tag('br', null, null),
              tag('div', null, 'Deseja continuar?')
            ]),
            confirmButtonText: 'Continuar',
            confirmButtonClass: 'edit-case-confirm-button',
            cancelButtonClass: 'is-plain',
            showCancelButton: true,
            customClass: 'edit-case-confitm-dialog'
          }).then(this.editDispute).catch(() => {
            this.editDisputeDialogLoading = false
          })
        }
      })
    },

    editDispute() {
      const disputeToEdit = {
        ...JSON.parse(JSON.stringify(this.dispute)),
        strategyId: this.selectedStrategyId,
        code: this.disputeForm?.disputeCode,
        description: this.disputeForm?.description,
        lastOfferRoleId: this.selectedNegotiatorId,
        lastOfferValue: this.disputeForm?.lastOfferValue,
        externalId: this.disputeForm?.externalId || null,
        moralDamage: this.disputeForm?.moralDamage || null,
        provisionedValue: this.disputeForm?.provisionedValue,
        denySavingDeposit: this.disputeForm?.denySavingDeposit,
        disputeUpperRange: this.disputeForm?.disputeUpperRange,
        materialDamage: this.disputeForm?.materialDamage || null,
        requestedValue: this.disputeForm?.requestedValue || null,
        alwaysContactParty: this.disputeForm?.alwaysContactParty,
        classification: {
          name: this.disputeForm?.classification || '',
          classificationDetails: [
            ...(this.disputeForm?.classificationDetails.map(item => {
              return Number.isInteger(item) ? this.subClassifications[item] : { name: item }
            })) /* Cria a lista e classificationDetails para enviar ao back.
              Se o item for inteiro: O objeto já existe na lista subClassifications.
              Se o item for string: Cria o objeto novo.
            */
          ]
        },
        contactPartyWhenNoLowyer: this.disputeForm?.contactPartyWhenNoLowyer,
        contactPartyWhenInvalidLowyer: this.disputeForm?.contactPartyWhenInvalidLowyer,
        expirationDate: { dateTime: this.$moment(this.disputeForm?.expirationDate).endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]') }
      }

      this.editDisputeDialogLoading = false

      const currentDate = this.dispute.expirationDate.dateTime
      const newDate = disputeToEdit.expirationDate.dateTime

      this.setDispute(disputeToEdit).then(() => {
        this.$jusSegment('Editar disputa', { disputeId: disputeToEdit.id }) // SEGMENT TRACK
        this.$jusNotification({ title: 'Yay!', message: 'Os dados foram alterados com sucesso.', type: 'success' })
        this.handleSaveClassificationDetails().then(() => {
          this.$nextTick().then(() => this.$emit('fetch-data'))
          this.hide()
        })

        this.handleResendMessagesOnEdit({ ...this.dispute, currentDate, newDate })
      }).catch(this.handleSetDisputeError).finally(() => {
        this.editDisputeDialogLoading = false
      })
    },

    handleSaveClassificationDetails() {
      return new Promise((resolve, reject) => {
        if (!this.disputeForm?.classificationDetails?.length) { resolve() }

        this.getDispute(Number(this.$route.params.id)).then(dispute => {
          this.setSubclassifications({
            parentId: dispute?.classification?.id,
            data: this.disputeForm?.classificationDetails
          }).then(resolve)
        }).catch(reject)
      })
    },

    handleSetDisputeError(error) {
      if (error.response && error.response.data && error.response?.status === 412 && error.response.data.code === 'DUPLICATED_VALIDATION') {
        const { CAN_ACCESS_OTHER, OTHER_DISPUTE_ID, OTHER_NEGOTIATORS } = error.response.data.fields
        const message = CAN_ACCESS_OTHER
          ? `Este número de processo ja está sendo usado na disputa <a target="_blank" href="https://justto.app/#/management/dispute/${OTHER_DISPUTE_ID}">#OTHER_DISPUTE_ID</a>.`
          : `Este número de processo ja está sendo usado na disputa <b>#${OTHER_DISPUTE_ID}</b>. Você não possui acesso a essa disputa. Verifique com um negociador responsável: <b>${OTHER_NEGOTIATORS}</b>`

        this.$jusNotification({ title: 'Ops!', message: message, type: 'warning', dangerouslyUseHTMLString: true })
      } else {
        this.$jusNotification({ error })
      }
    },

    handleResendMessagesOnEdit({ currentDate, newDate, contactPartyWhenNoLowyer, contactPartyWhenInvalidLowyer, alwaysContactParty }) {
      const isExpirationDateChanged = this.$moment(currentDate).isBefore(this.$moment()) && this.$moment(newDate).isSameOrAfter(this.$moment())
      const contactPartyWhenNoLowyerHasChanged = this.disputeForm.contactPartyWhenNoLowyer !== contactPartyWhenNoLowyer
      const contactPartyWhenInvalidLowyerHasChanged = this.disputeForm.contactPartyWhenInvalidLowyer !== contactPartyWhenInvalidLowyer
      const alwaysContactPartyChanged = this.disputeForm.alwaysContactParty !== alwaysContactParty
      const contactPartyHasChanged = contactPartyWhenInvalidLowyerHasChanged || contactPartyWhenNoLowyerHasChanged || alwaysContactPartyChanged
      const onlyResendMessaged = this.dispute.status === 'RUNNING'

      if (contactPartyHasChanged || isExpirationDateChanged) {
        const action = onlyResendMessaged ? 'reenviar mensagens automáticas' : 'reiniciar esta disputa'
        const message = contactPartyHasChanged ? 'As configurações de engajamento foram alteradas. Deseja ' + action + '?' : 'A data de expiração foi alterada. Deseja ' + action + '?'

        this.$confirm(message, 'Atenção!', {
          confirmButtonText: onlyResendMessaged ? 'Reenviar' : 'Reiniciar',
          cancelButtonText: 'Cancelar',
          cancelButtonClass: 'is-plain',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('sendDisputeAction', {
            action: onlyResendMessaged ? 'resend-messages' : 'restart-engagement',
            disputeId: this.dispute.id
          }).then(() => {
            const actionDone = onlyResendMessaged ? 'Reenvio de mensagens' : 'Reengajamento'
            this.$jusNotification({ title: 'Yay!', message: `${actionDone} realizado com sucesso.`, type: 'success' })
          })
        })
      }
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
    },

    checkZeroUpperRange() {
      if (this.disputeForm.zeroUpperRange) {
        this.$nextTick(() => { this.$refs.disputeForm.validate() })
      }
    }
  }
}
</script>

<style lang="scss">
.dispute-form-dialog {
  .el-dialog__body {
    .el-form {
      .el-row {
        .dispute-overview-view__select-switch {
          display: flex;
          flex-direction: row;
          align-items: flex-end;

          .content {
            flex: 1;
            word-break: keep-all;

            div {
              font-weight: 600;
              padding-top: 2px;
            }

            p {
              font-style: italic;
              font-size: 12px;
              margin: 6px 20px 1em 0;
            }
          }

          .el-switch {
            margin-block-end: 1em;
          }
        }
      }
    }
  }
}
</style>
