<template lang="html">
  <div class="dispute-view-actions">
    <div class="dispute-view-actions__actions">
      <el-tooltip content="Voltar">
        <router-link to="/management">
          <jus-icon class="back" icon="back"/>
        </router-link>
      </el-tooltip>
      <el-tooltip content="Ganhar">
        <el-button
          :disabled="!canSettled"
          plain
          data-testid="settled"
          @click="disputeAction('settled')">
          <jus-icon icon="win"/>
        </el-button>
      </el-tooltip>
      <el-tooltip content="Perder">
        <el-button
          :disabled="!canUnsettled"
          plain
          data-testid="unsettled"
          @click="disputeAction('unsettled')">
          <jus-icon icon="lose"/>
        </el-button>
      </el-tooltip>
      <el-tooltip v-if="isPaused" content="Retomar">
        <el-button plain data-testid="resume" @click="disputeAction('resume')">
          <jus-icon icon="start-again"/>
        </el-button>
      </el-tooltip>
      <el-tooltip v-else content="Pausar">
        <el-button plain data-testid="paused" @click="disputeAction('paused')">
          <jus-icon icon="pause"/>
        </el-button>
      </el-tooltip>
      <el-tooltip content="Reiniciar engajamento">
        <el-button
          plain
          data-testid="restart-engagement"
          @click="disputeAction('restart-engagement')">
          <jus-icon icon="refresh"/>
        </el-button>
      </el-tooltip>
      <el-tooltip content="Cancelar mensagens automáticas">
        <el-button plain data-testid="cancel-messages" @click="disputeAction('cancel-messages')">
          <jus-icon icon="cancel-messages"/>
        </el-button>
      </el-tooltip>
      <el-tooltip content="Alterar Negociador">
        <el-button plain @click="editNegotiator()">
          <jus-icon icon="delegate"/>
        </el-button>
      </el-tooltip>
      <el-tooltip content="Enriquecer disputa">
        <el-button plain @click="disputeAction('enrich')">
          <jus-icon icon="enrich"/>
        </el-button>
      </el-tooltip>
      <el-tooltip content="Contraproposta manual">
        <el-button :disabled="!canSendCounterproposal" plain @click="counterproposalDialogOpen()">
          <jus-icon icon="proposal"/>
        </el-button>
      </el-tooltip>
      <el-tooltip content="Marcar como não lida">
        <el-button plain @click="setAsUnread()">
          <jus-icon icon="unread"/>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="isFavorite ? 'Desmarcar como favorito' : 'Marcar como favorito'">
        <el-button
          plain
          data-testid="favorite"
          @click="disputeAction(isFavorite ? 'disfavor' : 'favorite')">
          <jus-icon :icon="isFavorite ? 'golden-star' : 'star'"/>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="collapsed ? 'Exibir informações da disputa' : 'Ocultar informações da disputa'">
        <el-button
          :icon="collapsed ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"
          type="text"
          @click="togleCollapsed" />
      </el-tooltip>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="chooseUnsettledDialogVisible"
      append-to-body
      title="Perder"
      class="dispute-view__choose-unsettled-dialog"
      width="460px"
      data-testid="choose-unsettled-dialog">
      <div class="el-message-box__content">
        <div class="el-message-box__status el-icon-warning"/>
        <div class="el-message-box__message"><p>
          Tem certeza que deseja realizar esta ação?
        </p></div>
      </div>
      <el-select
        v-loading="$store.state.loading"
        v-model="unsettledType"
        data-testid="select-unsettled"
        placeholder="Escolha o motivo da perda">
        <el-option
          v-for="(type, index) in unsettledTypes"
          :key="index"
          :label="type"
          :value="index"/>
      </el-select>
      <span slot="footer">
        <el-button @click="chooseUnsettledDialogVisible = false">Cancelar</el-button>
        <el-button
          :disabled="!unsettledType"
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="doAction('unsettled')">
          Continuar
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editNegotiatorDialogVisible"
      append-to-body
      title="Editar negociadores da disputa"
      width="600px">
      <el-form
        ref="negotiatorsForm"
        :model="negotiatorsForm"
        :rules="negotiatorsRules"
        label-position="top"
        @submit.native.prevent="editNegotiator">
        <el-transfer
          :titles="['Workspace', 'Disputa']"
          :button-texts="['Remover', 'Adcionar']"
          :data="workspaceNegotiators"
          v-model="disputeNegotiators"
          filter-placeholder="Buscar"
          filterable/>
      </el-form>
      <span slot="footer">
        <el-button @click="editNegotiatorDialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click.prevent="editNegotiators()">Editar dados</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="counterproposalDialogVisible"
      :close-on-click-modal="false"
      append-to-body
      title="Enviar contraproposta manual"
      width="600px"
      class="dispute-view__counterproposal-dialog">
      <el-form
        v-loading="counterproposalLoading"
        ref="counterOfferForm"
        :model="counterOfferForm"
        :rules="counterOfferFormRules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Valor" prop="lastCounterOfferValue">
              <money v-model="counterOfferForm.lastCounterOfferValue" class="el-input__inner" data-testid="counterproposal-value-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Proposto por" prop="selectedRoleId">
              <el-select v-model="counterOfferForm.selectedRoleId" placeholder="Autor da contraproposta" data-testid="counterproposal-claimant-input">
                <el-option
                  v-for="(claimant, index) in disputeClaimants"
                  :key="`${index}-${claimant.id}`"
                  :label="claimant.name"
                  :value="claimant.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button plain @click="counterproposalDialogVisible = false">Cancelar</el-button>
        <el-button :loading="counterproposalLoading" type="primary" @click.prevent="checkCounterproposal">Enviar contraproposta</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validateZero } from '@/utils/validations'
import { getRoles } from '@/utils/jusUtils'

export default {
  name: 'DisputeActions',
  props: {
    dispute: {
      type: Object,
      default: () => {}
    },
    isPaused: {
      type: Boolean,
      default: false
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    isCollapsed: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      unsettledType: null,
      unsettledTypes: {},
      negotiatorsForm: {},
      negotiatorsRules: {},
      disputeNegotiators: [],
      chooseUnsettledDialogVisible: false,
      editNegotiatorDialogVisible: false,
      counterproposalDialogVisible: false,
      counterproposalLoading: false,
      counterOfferForm: {
        lastCounterOfferValue: '',
        selectedRoleId: ''
      },
      counterOfferFormRules: {
        lastCounterOfferValue: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validateZero, message: 'Valor precisa ser acima de 0', trigger: 'submit' }
        ],
        selectedRoleId: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      }
    }
  },
  computed: {
    collapsed: {
      get () {
        return this.isCollapsed
      },
      set (value) {
        this.$emit('update:isCollapsed', value)
      }
    },
    canSettled () {
      return this.dispute && this.dispute.status && this.dispute.status !== 'SETTLED'
    },
    canUnsettled () {
      return this.dispute && this.dispute.status && this.dispute.status !== 'UNSETTLED'
    },
    canSendCounterproposal () {
      if (this.dispute) {
        if (this.isPaused) {
          return false
        } else if (this.dispute.status && ['IMPORTED', 'ENRICHED', 'ENGAGEMENT', 'RUNNING', 'PENDING', 'REFUSED'].includes(this.dispute.status)) {
          return true
        } return false
      } return false
    },
    workspaceNegotiators () {
      return this.$store.state.workspaceModule.members.map(member => {
        let newMember = {}
        newMember.key = member.person.id
        newMember.label = member.person.name
        newMember.value = member
        return newMember
      })
    },
    disputeClaimants () {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'CLAIMANT')
      }
      return []
    }
  },
  created () {
    if (this.$store.getters.disputeStatuses.unsettled) {
      this.unsettledTypes = this.$store.getters.disputeStatuses.unsettled
    } else {
      this.$store.dispatch('getDisputeStatuses', 'unsettled').then(response => {
        this.unsettledTypes = response
      })
    }
  },
  methods: {
    disputeAction (action) {
      if (action === 'unsettled') {
        this.chooseUnsettledDialogVisible = true
        this.unsettledType = null
      } else if (action === 'favorite') {
        this.doAction(action)
      } else {
        let capAction = this.$t('action.' + action.toUpperCase())
        this.$confirm('Tem certeza que deseja realizar ação?', capAction.charAt(0).toUpperCase() + capAction.slice(1), {
          confirmButtonClass: 'confirm-action-btn',
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          type: 'warning',
          cancelButtonClass: 'is-plain'
        }).then(() => {
          this.doAction(action)
        })
      }
    },
    doAction (action) {
      let params = {
        action: action,
        disputeId: this.dispute.id
      }
      if (this.unsettledType) {
        params['body'] = { 'reason': this.unsettledTypes[this.unsettledType] }
      }
      this.$store.dispatch('sendDisputeAction', params).then(() => {
        let trackTitle
        if (action === 'unsettled') {
          trackTitle = 'Disputa ganha'
        } else if (action === 'settled') {
          trackTitle = 'Disputa perdida'
        } else if (action === 'paused') {
          trackTitle = 'Disputa pausada'
        } else if (action === 'resume') {
          trackTitle = 'Disputa despausada'
        } else if (action === 'favorite') {
          trackTitle = 'Disputa favoritada'
        } else if (action === 'disfavor') {
          trackTitle = 'Disputa desfavoritada'
        } else {
          trackTitle = 'Status Modificado'
        }
        window.analytics.track(trackTitle, {
          action: action
        })
        this.$jusNotification({
          title: 'Yay!',
          dangerouslyUseHTMLString: true,
          message: 'Ação <strong>' + this.$t('action.' + action.toUpperCase()) + '</strong> realizada com sucesso.',
          type: 'success'
        })
        if (action === 'unsettled') {
          setTimeout(() => {
            this.$jusNotification({
              title: 'Atenção!',
              message: 'Enviaremos para às contrapartes uma mensagem de encerramento de negociação.',
              type: 'info',
              duration: 0
            })
          }, 2000)
        }
        this.$emit('fetch-data')
      }).catch(() => {
        this.$jusNotification({ type: 'error' })
      }).finally(() => {
        this.chooseUnsettledDialogVisible = false
      })
    },
    editNegotiators () {
      this.$store.dispatch('editNegotiators', {
        negotiators: this.disputeNegotiators,
        disputeId: this.dispute.id
      }).then(() => {
        window.analytics.track('Negociadores alterados')
        this.$jusNotification({
          title: 'Yay!',
          message: 'Negociadores editados com sucesso.',
          type: 'success'
        })
        this.editNegotiatorDialogVisible = false
      }).catch(() => this.$jusNotification({ type: 'error' }))
    },
    editNegotiator () {
      this.disputeNegotiators = this.dispute.disputeRoles.filter((negotiator) => {
        return negotiator.roles.includes('NEGOTIATOR') === true
      }).map(member => {
        return member.personId
      })
      this.editNegotiatorDialogVisible = true
    },
    counterproposalDialogOpen () {
      this.counterOfferForm.lastCounterOfferValue = ''
      this.counterOfferForm.selectedRoleId = ''
      this.counterproposalDialogVisible = true
      if (this.$refs.counterOfferForm) {
        this.$refs.counterOfferForm.clearValidate()
      }
    },
    checkUpperRangeCounterOffer () {
      return this.counterOfferForm.lastCounterOfferValue > this.dispute.disputeUpperRange
    },
    checkCounterproposal () {
      this.$refs.counterOfferForm.validate(valid => {
        if (valid) {
          if (this.checkUpperRangeCounterOffer()) {
            this.$confirm('Valor de contraproposta é maior que alçada máxima, deseja continuar?', 'Atenção!', {
              confirmButtonText: 'Enviar contraproposta',
              cancelButtonText: 'Cancelar',
              type: 'info',
              cancelButtonClass: 'is-plain'
            }).then(() => {
              this.sendCounterproposal()
            })
          } else {
            this.sendCounterproposal()
          }
        } else {
          return false
        }
      })
    },
    sendCounterproposal () {
      this.counterproposalLoading = true
      this.$store.dispatch('getDisputeDTO', this.dispute.id).then(disputeToEdit => {
        this.$store.dispatch('sendDisputeCounterProposal', {
          disputeId: this.dispute.id,
          objectId: disputeToEdit.objects[0].id,
          value: this.counterOfferForm.lastCounterOfferValue.toString(),
          roleId: this.counterOfferForm.selectedRoleId
        }).then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Contraproposta enviada com sucesso.',
            type: 'success',
            onClose: () => {
              const action = this.checkUpperRangeCounterOffer() ? 'Em negociação' : 'Acordo'
              setTimeout(() => {
                this.$notify({
                  title: 'Atenção!',
                  message: 'A disputa foi movida para o status <strong>' + action + '</strong>.',
                  type: 'info',
                  customClass: 'info',
                  position: 'bottom-right',
                  offset: 84,
                  duration: 0,
                  dangerouslyUseHTMLString: true
                })
              }, 200)
            }
          })
          this.counterproposalDialogVisible = false
        }).catch(() => {
          this.$jusNotification({ type: 'error' })
        }).finally(() => {
          this.counterproposalLoading = false
        })
      }).catch(() => {
        this.$jusNotification({ type: 'error' })
        this.counterproposalLoading = false
        this.counterproposalDialogVisible = false
      })
    },
    togleCollapsed () {
      this.collapsed = !this.collapsed
    },
    setAsUnread () {
      this.$store.dispatch('disputeSetVisualized', {
        visualized: false, disputeId: this.dispute.id
      }).then(() => {
        this.$router.push('/management')
      }).catch(() => {
        this.$jusNotification({ type: 'error' })
      })
    }
  }
}
</script>

<style lang="scss">
.dispute-view-actions {
  &__actions {
    padding: 11px 0px 11px 20px;
    box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.06);
    z-index: 1;
    .el-button {
      border-radius: 5px;
      padding: 11px;
      &.el-button--text {
        color: #424242;
        padding: 7px 10px 0;
        float: right;
        i {
          font-size: 26px;
        }
      }
    }
    img {
      width: 16px;
      height: 16px;
    }
    .back {
      margin-right: 20px;
      vertical-align: text-top;
    }
  }
}
</style>
