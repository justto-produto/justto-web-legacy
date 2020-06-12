<template lang="html">
  <div
    :class="tableActions ? 'jus-dispute-actions--table' : 'jus-dispute-actions--dispute'"
    class="jus-dispute-actions">
    <el-tooltip
      v-if="!tableActions"
      content="Voltar">
      <router-link to="/management">
        <jus-icon
          class="back"
          icon="back"/>
      </router-link>
    </el-tooltip>
    <el-tooltip
      v-if="canSettled"
      :content="dispute.status === 'CHECKOUT' || dispute.status === 'ACCEPTED' ? 'Ganhar' : 'Aceitar acordo'">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        data-testid="settled"
        @click="disputeAction('settled')">
        <jus-icon icon="win"/>
      </el-button>
    </el-tooltip>
    <el-tooltip
      v-if="canUnsettled"
      content="Perder">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        data-testid="unsettled"
        @click="disputeAction('unsettled')">
        <jus-icon icon="lose"/>
      </el-button>
    </el-tooltip>
    <el-tooltip
      v-if="dispute.paused"
      content="Retomar">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        data-testid="resume"
        @click="disputeAction('resume')">
        <jus-icon icon="start-again"/>
      </el-button>
    </el-tooltip>
    <el-tooltip
      v-else
      content="Pausar">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        data-testid="paused"
        @click="disputeAction('paused')">
        <jus-icon icon="pause"/>
      </el-button>
    </el-tooltip>
    <el-tooltip content="Reiniciar disputa">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        data-testid="restart-engagement"
        @click="disputeAction('restart-engagement')">
        <jus-icon icon="refresh"/>
      </el-button>
    </el-tooltip>
    <el-tooltip
      v-if="canResendMessage"
      content="Reenviar mensagens automáticas">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        data-testid="resend-messages"
        @click="disputeAction('resend-messages')">
        <jus-icon icon="resend-messages"/>
      </el-button>
    </el-tooltip>
    <el-tooltip
      v-if="!tableActions"
      content="Cancelar mensagens automáticas">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        data-testid="cancel-messages"
        @click="disputeAction('cancel-messages')">
        <jus-icon icon="cancel-messages"/>
      </el-button>
    </el-tooltip>
    <el-tooltip
      v-if="!tableActions"
      content="Alterar negociador">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        @click="openEditNegotiatorsDialog()">
        <!-- @click="disputeAction('edit-negotiators')"> -->
        <jus-icon icon="delegate"/>
      </el-button>
    </el-tooltip>
    <el-tooltip
      v-if="!tableActions"
      content="Enriquecer disputa">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        @click="disputeAction('enrich')">
        <jus-icon icon="enrich"/>
      </el-button>
    </el-tooltip>
    <el-tooltip
      v-if="canSendCounterproposal"
      content="Contraproposta manual">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        @click="disputeAction('counterproposal')">
        <jus-icon icon="proposal2" />
      </el-button>
    </el-tooltip>
    <el-tooltip
      v-if="!canSendCounterproposal"
      content="Retornar para negociação">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        @click="disputeAction('renegotiate')">
        <jus-icon icon="move-to-running" />
      </el-button>
    </el-tooltip>
    <el-tooltip
      v-if="canMarkAsNotRead"
      content="Marcar como não lida">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        @click="setAsUnread()">
        <jus-icon icon="unread"/>
      </el-button>
    </el-tooltip>
    <el-tooltip
      v-if="tableActions"
      content="Abrir disputa em nova aba">
      <el-button
        type="text"
        @click="openNewTab()">
        <jus-icon icon="external-link" />
      </el-button>
    </el-tooltip>
    <el-tooltip
      content="Enviar anexo">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        @click="uploadAttacmentDialogVisable = true">
        <jus-icon icon="upload-file" />
      </el-button>
    </el-tooltip>
    <el-tooltip :content="dispute.favorite ? 'Desmarcar como favorito' : 'Marcar como favorito'">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        data-testid="favorite"
        @click="disputeAction(dispute.favorite ? 'disfavor' : 'favorite')">
        <jus-icon :icon="dispute.favorite ? 'golden-star' : 'star'"/>
      </el-button>
    </el-tooltip>
    <!-- TAGS -->
    <!-- <el-tooltip v-if="tableActions" content="Gerenciar etiquetas">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        @click="disputeAction(dispute.favorite ? 'disfavor' : 'favorite')">
        <i class="el-icon-collection-tag" />
      </el-button>
    </el-tooltip> -->
    <el-tooltip
      v-if="!tableActions"
      :content="collapsed ? 'Exibir informações da disputa' : 'Ocultar informações da disputa'">
      <el-button
        :plain="!tableActions"
        :icon="collapsed ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"
        type="text"
        @click="togleCollapsed" />
    </el-tooltip>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="settledDialogVisible"
      append-to-body
      title="Acordo aceito"
      class="dispute-view-actions__choose-unsettled-dialog"
      width="600px"
      data-testid="choose-unsettled-dialog">
      <p>Confirme o valor do acordo nos campos abaixo:</p>
      <el-form
        v-loading="modalLoading"
        ref="counterOfferForm"
        :model="counterOfferForm"
        :rules="counterOfferFormRules"
        label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="Valor"
              prop="lastCounterOfferValue">
              <money
                v-model="counterOfferForm.lastCounterOfferValue"
                class="el-input__inner"
                data-testid="counterproposal-value-input"
                maxlength="16" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="Proposto por"
              prop="selectedRoleId">
              <el-select
                v-model="counterOfferForm.selectedRoleId"
                placeholder="Autor da contraproposta"
                style="width: 100%;"
                data-testid="counterproposal-claimant-input">
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
        <el-button
          :disabled="modalLoading"
          plain
          @click="settledDialogVisible = false">Cancelar</el-button>
        <el-button
          :loading="modalLoading"
          type="primary"
          @click.prevent="disputeAction('send-counterproposal', updateUpperRange = true)">Continuar</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="chooseUnsettledDialogVisible"
      append-to-body
      title="Perder"
      class="jus-dispute-actions__choose-unsettled-dialog"
      width="460px"
      data-testid="choose-unsettled-dialog">
      <div class="el-message-box__content">
        <div class="el-message-box__container">
          <div class="el-message-box__status el-icon-warning"/>
          <div class="el-message-box__message">
            <p>Tem certeza que deseja realizar esta ação?</p>
          </div>
        </div>
      </div>
      <el-select
        v-model="unsettledType"
        data-testid="select-unsettled"
        style="margin: 10px 0px;"
        placeholder="Escolha o motivo da perda">
        <el-option
          v-for="(type, index) in unsettledTypes"
          :key="index"
          :label="type"
          :value="index"/>
      </el-select>
      <el-form
        v-loading="modalLoading"
        v-if="isInsufficientUpperRange"
        ref="counterOfferForm"
        :model="counterOfferForm"
        :rules="counterOfferFormRules"
        label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="Valor"
              prop="lastCounterOfferValue">
              <money
                v-model="counterOfferForm.lastCounterOfferValue"
                class="el-input__inner"
                data-testid="counterproposal-value-input"
                maxlength="16" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="Proposto por"
              prop="selectedRoleId">
              <el-select
                v-model="counterOfferForm.selectedRoleId"
                placeholder="Autor da contraproposta"
                data-testid="counterproposal-claimant-input">
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
        <el-button
          :disabled="modalLoading"
          plain
          @click="chooseUnsettledDialogVisible = false">Cancelar</el-button>
        <el-button
          :loading="modalLoading"
          :disabled="!unsettledType"
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="disputeAction('send-unsettled')">
          Continuar
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="editNegotiatorDialogVisible"
      append-to-body
      title="Editar negociadores da disputa"
      width="604px">
      <el-form
        v-loading="modalLoading"
        ref="negotiatorsForm"
        :model="negotiatorsForm"
        :rules="negotiatorsRules"
        label-position="top"
        @submit.native.prevent="editNegotiator">
        <el-transfer
          :titles="['Equipe', 'Disputa']"
          :button-texts="['Remover', 'Adicionar']"
          :data="workspaceNegotiators"
          v-model="disputeNegotiators"
          filter-placeholder="Buscar"
          filterable/>
      </el-form>
      <span slot="footer">
        <el-button
          :disabled="modalLoading"
          plain
          @click="editNegotiatorDialogVisible = false">Cancelar</el-button>
        <el-button
          :loading="modalLoading"
          type="primary"
          @click.prevent="disputeAction('edit-negotiators', disputeNegotiators)">Editar dados</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="counterproposalDialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      append-to-body
      title="Enviar contraproposta manual"
      width="600px"
      class="dispute-view__counterproposal-dialog">
      <el-form
        v-loading="modalLoading"
        ref="counterOfferForm"
        :model="counterOfferForm"
        :rules="counterOfferFormRules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="Valor"
              prop="lastCounterOfferValue">
              <money
                v-model="counterOfferForm.lastCounterOfferValue"
                class="el-input__inner"
                data-testid="counterproposal-value-input"
                maxlength="16" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="Proposto por"
              prop="selectedRoleId">
              <el-select
                v-model="counterOfferForm.selectedRoleId"
                placeholder="Autor da contraproposta"
                style="width: 100%;"
                data-testid="counterproposal-claimant-input">
                <el-option
                  v-for="(claimant, index) in disputeClaimants"
                  :key="`${index}-${claimant.id}`"
                  :label="claimant.name"
                  :value="claimant.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              label="Nota"
              prop="note">
              <el-input
                v-model="counterOfferForm.note"
                type="textarea"
                rows="4" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button
          :disabled="modalLoading"
          plain
          @click="counterproposalDialogVisible = false">Cancelar</el-button>
        <el-button
          :loading="modalLoading"
          type="primary"
          @click.prevent="disputeAction('send-counterproposal')">Atualizar contraproposta</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="uploadAttacmentDialogVisable"
      append-to-body
      title="Envie anexos"
      class="jus-dispute-actions__upload-dialog"
      width="600px"
      data-testid="upload-file-dialog"
    >
      <jus-drag-area :visible="true" />
    </el-dialog>
  </div>
</template>

<script>
import { getRoles } from '@/utils/jusUtils'
import { JusDragArea } from '@/components/JusDragArea'

export default {
  name: 'JusDisputeActions',
  components: {
    JusDragArea,
  },
  props: {
    dispute: {
      type: Object,
      default: () => {},
    },
    tableActions: {
      type: Boolean,
      default: false,
    },
    isCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      settledValue: 0,
      unsettledType: null,
      unsettledTypes: {},
      negotiatorsForm: {},
      negotiatorsRules: {},
      disputeNegotiators: [],
      chooseUnsettledDialogVisible: false,
      editNegotiatorDialogVisible: false,
      counterproposalDialogVisible: false,
      uploadAttacmentDialogVisable: false,
      settledDialogVisible: false,
      modalLoading: false,
      counterOfferForm: {
        lastCounterOfferValue: '',
        selectedRoleId: '',
        note: '',
      },
      counterOfferFormRules: {
        lastCounterOfferValue: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        selectedRoleId: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      },
    }
  },
  computed: {
    collapsed: {
      get() {
        return this.isCollapsed
      },
      set(value) {
        this.$emit('update:isCollapsed', value)
      },
    },
    isInsufficientUpperRange() {
      return this.unsettledType && this.unsettledType === 'INSUFFICIENT_UPPER_RANGE' && ((this.dispute && !this.dispute.lastCounterOfferValue) || (this.dispute && this.dispute.lastCounterOfferValue <= this.dispute.disputeUpperRange))
    },
    canSettled() {
      return this.dispute && this.dispute.status && this.dispute.status !== 'SETTLED'
    },
    canUnsettled() {
      return this.dispute && this.dispute.status && this.dispute.status !== 'UNSETTLED'
    },
    canResendMessage() {
      return this.dispute && this.dispute.status && this.dispute.status === 'RUNNING'
    },
    canMarkAsNotRead() {
      return this.dispute && this.dispute.status && !['IMPORTED', 'ENRICHED', 'ENGAGEMENT'].includes(this.dispute.status)
    },
    canSendCounterproposal() {
      return this.dispute && this.dispute.status && !['CHECKOUT', 'ACCEPTED', 'SETTLED', 'UNSETTLED'].includes(this.dispute.status)
    },
    checkUpperRangeCounterOffer() {
      return this.counterOfferForm.lastCounterOfferValue > this.dispute.disputeUpperRange
    },
    isAccepted() {
      return this.dispute ? ['CHECKOUT', 'ACCEPTED', 'SETTLED', 'UNSETTLED'].includes(this.dispute.status) : null
    },
    workspaceNegotiators() {
      return this.$store.getters.workspaceMembers.map(member => {
        const newMember = {}
        newMember.key = member.person.id
        newMember.label = member.person.name
        newMember.value = member.person.id
        return newMember
      })
    },
    disputeClaimants() {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'CLAIMANT')
      }
      return []
    },
    authorsResume() {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'CLAIMANT', 'PARTY').map(role => {
          return role.name
        }).join(', ')
      }
      return []
    },
    lawyersResume() {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'CLAIMANT', 'LAWYER').map(role => {
          return role.name
        }).join(', ')
      }
      return []
    },
    respondentsResume() {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'RESPONDENT').map(role => {
          return role.name
        }).join(', ')
      }
      return []
    },
  },
  created() {
    if (this.$store.getters.disputeStatuses.unsettled) {
      this.unsettledTypes = this.$store.getters.disputeStatuses.unsettled
    } else {
      this.$store.dispatch('getDisputeStatuses', 'unsettled').then(response => {
        this.unsettledTypes = response
      })
    }
  },
  methods: {
    disputeAction(action, additionParams) {
      let message = {
        content: 'Tem certeza que deseja realizar esta ação?',
        title: this.$options.filters.capitalize(this.$t('action.' + action.toUpperCase())),
      }
      switch (action) {
        case 'settled':
          if (this.dispute.status === 'CHECKOUT' || this.dispute.status === 'ACCEPTED') {
            this.showDisputeResume('WIN').then(() => {
              this.doAction(action, message)
            })
          } else {
            this.openSettledDialog(action)
          }
          break
        case 'unsettled':
          this.unsettledType = null
          this.openSettledDialog(action)
          break
        case 'send-unsettled':
          if (this.isInsufficientUpperRange) {
            this.disputeAction('send-counterproposal')
          } else {
            additionParams = { body: { reason: this.unsettledTypes[this.unsettledType] } }
            this.doAction('unsettled', message, additionParams).then(() => {
              this.chooseUnsettledDialogVisible = false
            }).finally(() => {
              this.unsettledType = null
            })
          }
          break
        case 'resume':
          this.doAction(action, message)
          break
        case 'paused':
          this.doAction(action, message)
          break
        case 'restart-engagement':
          this.checkIsntManualStrategy(action).then(() => {
            this.doAction(action, message)
          })
          break
        case 'resend-messages':
          this.checkIsntManualStrategy(action).then(() => {
            this.doAction(action, message)
          })
          break
        case 'cancel-messages':
          this.checkIsntManualStrategy(action).then(() => {
            this.doAction(action, message)
          })
          break
        case 'edit-negotiators':
          additionParams = { negotiatorsId: additionParams }
          this.doAction(action, message, additionParams).then(() => {
            this.editNegotiatorDialogVisible = false
          })
          break
        case 'enrich':
          if (this.isAccepted) {
            message.title = 'Atenção!'
            message.content = `Você está solicitando o <b>ENRIQUECIMENTO</b> de uma disputa que já
          foi finalizada. Este processo irá agendar novamente as mensagens
          para as partes quando finalizado. Você deseja enriquecer mesmo assim?`
          }
          this.doAction(action, message)
          break
        case 'renegotiate':
          this.doAction(action, message)
          break
        case 'counterproposal':
          if (this.dispute.paused) {
            message = {
              content: 'A disputa está pausada, deseja retomar negociação para enviar uma contraproposta?',
              title: 'Retomar negociação',
            }
            this.doAction('resume', message).then(() => {
              this.openCounterproposalDialog()
            })
          } else {
            this.openCounterproposalDialog()
          }
          break
        case 'send-counterproposal':
          if (this.unsettledType === 'INSUFFICIENT_UPPER_RANGE') {
            this.sendCounterproposal().then(() => {
              additionParams = { body: { reason: this.unsettledTypes[this.unsettledType] } }
              this.doAction('unsettled', message, additionParams).then(() => {
                this.chooseUnsettledDialogVisible = false
              }).finally(() => {
                this.unsettledType = null
              })
            })
          } else if (additionParams) {
            this.checkCounterproposal('WIN').then(() => {
              if (this.checkUpperRangeCounterOffer) {
                this.sendCounterproposal(additionParams)
              } else {
                this.sendCounterproposal()
              }
            })
          } else {
            this.checkCounterproposal('COUNTERPROPOSAL').then(() => {
              this.sendCounterproposal()
            })
          }
          break
        case 'favorite':
          this.doAction(action, message)
          break
        case 'disfavor':
          this.doAction(action, message)
          break
      }
    },
    doAction(action, message, additionParams) {
      return new Promise((resolve, reject) => {
        this.$confirm(message.content, message.title, {
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          cancelButtonClass: 'is-plain',
          dangerouslyUseHTMLString: true,
          showClose: false,
        }).then(() => {
          this.modalLoading = true
          let params = { action: action, disputeId: this.dispute.id }
          if (additionParams) params = { ...params, ...additionParams }
          this.$store.dispatch('sendDisputeAction', params).then(() => {
            resolve()
            this.$jusNotification({
              title: 'Yay!',
              message: 'Ação <b>' + message.title.toUpperCase() + '</b> realizada com sucesso.',
              type: 'success',
              dangerouslyUseHTMLString: true,
            })
          }).catch(error => {
            reject(error)
            this.$jusNotification({ error })
          }).finally(() => {
            this.modalLoading = false
          })
        })
      })
    },
    checkIsntManualStrategy(action) {
      return new Promise((resolve, reject) => {
        if ((['restart-engagement', 'resend-messages', 'cancel-messages'].includes(action)) && (this.dispute.strategyId === 25 || this.dispute.strategyId === 26)) {
          this.$alert('Esta disputa está com uma estratégia de <b>engajamento manual</b>. Se deseja realizar engajamento automático, edite a disputa e escolha uma estratégia de engajamento adequada', {
            title: this.$options.filters.capitalize(this.$t('action.' + action.toUpperCase())),
            dangerouslyUseHTMLString: true,
            confirmButtonText: 'OK',
            showClose: false,
          })
          reject(new Error('A estratégia dessa disputa é manual. Mude a estratégial para poder Reiniciar Dispute, Reiniciar Engajamento ou Cancelar Mensagens'))
        } else {
          resolve()
        }
      })
    },
    setAsUnread() {
      this.$store.dispatch('disputeSetVisualized', {
        visualized: false,
        disputeId: this.dispute.id,
      }).then(() => {
        this.$router.push('/management')
      }).catch(error => {
        this.$jusNotification({ error })
      })
    },
    openNewTab() {
      const routeData = this.$router.resolve({ name: 'dispute', params: { id: this.dispute.id } })
      window.open(routeData.href, '_blank')
    },
    togleCollapsed() {
      this.collapsed = !this.collapsed
    },
    openSettledDialog(action) {
      this.modalLoading = false
      this.counterOfferForm.lastCounterOfferValue = this.dispute.lastCounterOfferValue || this.dispute.lastOfferValue
      if (this.disputeClaimants.length === 1) {
        this.counterOfferForm.selectedRoleId = this.disputeClaimants[0].id
      } else if (this.dispute.lastCounterOfferName && this.disputeClaimants.map(c => c.name).includes(this.dispute.lastCounterOfferName)) {
        this.counterOfferForm.selectedRoleId = this.disputeClaimants.filter(c => {
          return c.name === this.dispute.lastCounterOfferName
        })[0].id
      } else {
        this.counterOfferForm.selectedRoleId = ''
      }
      if (action === 'settled') {
        this.settledDialogVisible = true
      } else {
        this.chooseUnsettledDialogVisible = true
      }
      if (this.$refs.counterOfferForm) {
        this.$refs.counterOfferForm.clearValidate()
      }
    },
    openEditNegotiatorsDialog() {
      this.modalLoading = false
      this.disputeNegotiators = this.dispute.disputeRoles.filter(member => {
        return member.roles.includes('NEGOTIATOR') && !member.archived
      }).map(member => member.personId)
      this.editNegotiatorDialogVisible = true
    },
    openCounterproposalDialog() {
      this.modalLoading = false
      this.counterOfferForm.lastCounterOfferValue = ''
      this.counterOfferForm.selectedRoleId = this.disputeClaimants.length === 1 ? this.disputeClaimants[0].id : ''
      this.counterproposalDialogVisible = true
      if (this.$refs.counterOfferForm) {
        this.$refs.counterOfferForm.clearValidate()
      }
    },
    checkCounterproposal(actionType) {
      return new Promise((resolve, reject) => {
        this.$refs.counterOfferForm.validate(valid => {
          if (valid) {
            if (this.checkUpperRangeCounterOffer) {
              actionType = actionType === 'WIN' ? 'O valor inserido <b>irá mojorar</b> alçada máxima. Deseja continuar?' : 'Valor de contraproposta é maior que alçada máxima, deseja continuar?'
              this.$confirm(actionType, 'Atenção!', {
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Cancelar',
                cancelButtonClass: 'is-plain',
                dangerouslyUseHTMLString: true,
                showClose: false,
              }).then(() => {
                resolve()
              }).catch(e => {
                reject(e)
              })
            } else {
              resolve()
            }
          } else {
            reject(new Error('Invalid Fields'))
          }
        })
      })
    },
    sendCounterproposal(updateUpperRange) {
      return new Promise((resolve, reject) => {
        this.$refs.counterOfferForm.validate(valid => {
          if (valid) {
            this.modalLoading = true
            this.$store.dispatch('getDisputeDTO', this.dispute.id).then(disputeToEdit => {
              this.$store.dispatch('sendDisputeCounterProposal', {
                disputeId: this.dispute.id,
                objectId: disputeToEdit.objects[0].id,
                value: this.counterOfferForm.lastCounterOfferValue.toString(),
                roleId: this.counterOfferForm.selectedRoleId,
                note: this.counterOfferForm.note,
                updateUpperRange: updateUpperRange || false,
              }).then(() => {
                if (this.counterOfferForm.note) {
                  this.modalLoading = true
                  const people = this.disputeClaimants.filter(d => d.id === this.counterOfferForm.selectedRoleId)[0]
                  const note = '<b>Contraproposta manual no valor de ' + this.$options.filters.currency(this.counterOfferForm.lastCounterOfferValue) + ', realizada por ' + people.name + ', com a nota:</b> <br/>' + this.counterOfferForm.note
                  this.$store.dispatch('sendDisputeNote', {
                    note,
                    disputeId: this.dispute.id,
                  }).then(() => {
                    resolve()
                    this.counterproposalDialogVisible = false
                  }).catch(e => {
                    reject(e)
                  }).finally(() => {
                    this.modalLoading = false
                  })
                } else {
                  resolve()
                  this.counterproposalDialogVisible = false
                  this.settledDialogVisible = false
                  this.$jusNotification({
                    title: 'Yay!',
                    message: updateUpperRange ? 'Proposta aceita com sucesso.' : 'Contraproposta enviada com sucesso.',
                    type: 'success',
                  })
                }
              }).catch(error => {
                reject(error)
                this.$jusNotification({ error })
              }).finally(() => {
                this.modalLoading = false
              })
            })
          } else {
            reject(new Error('Invalid Fields'))
          }
        })
      })
    },
    showDisputeResume(actionType) {
      return new Promise((resolve, reject) => {
        const h = this.$createElement
        const detailsMessage = [
          h('strong', { style: 'margin-bottom: 6px; display: flex' }, 'Confira os dados da disputa:'),
          h('p', null, [
            h('b', null, 'Nº da disputa: '),
            h('span', null, '#' + this.dispute.id),
          ]),
          h('p', null, [
            h('b', null, 'Nº do processo: '),
            h('span', null, this.dispute.code),
          ]),
          h('p', null, [
            h('b', null, 'Réu(s): '),
            h('span', null, this.respondentsResume.toUpperCase() || ' - '),
          ]),
          h('p', null, [
            h('b', null, 'Autor(es): '),
            h('span', null, this.authorsResume.toUpperCase() || ' - '),
          ]),
          h('p', null, [
            h('b', null, 'Advogado(s) do autor(es): '),
            h('span', null, this.lawyersResume.toUpperCase() || ' - '),
          ]),
          h('p', null, [
            h('b', null, 'Valor do acordo: '),
            h('span', null, this.$options.filters.currency(this.counterOfferForm.lastCounterOfferValue || this.dispute.disputeDealValue)),
          ]),
        ]
        actionType = actionType === 'ACCEPT' ? 'Fechar acordo' : 'Ganhar'
        this.$confirm(h('div', null, detailsMessage), actionType, {
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          cancelButtonClass: 'is-plain',
          showClose: false,
        }).then(() => {
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    },
  },
}
</script>

<style lang="scss">
.jus-dispute-actions {
  &__choose-unsettled-dialog {
    .el-message-box__content {
      padding: 10px 0;
    }
    .el-select {
      width: 100%;
    }
  }
  &__upload-dialog {
    .el-dialog__body {
      height: 300px;
    }
  }
  img {
    width: 16px;
    height: 16px;
  }
  &--dispute {
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
        border-color: transparent !important;
        i {
          font-size: 26px;
        }
      }
    }
    .back {
      margin-right: 20px;
      vertical-align: text-top;
    }
    .el-button + span, span + .el-button {
      margin-left: 10px;
    }
  }
  &--table {
    background: linear-gradient(to right, rgba(246,246,246,0) 0%, rgba(246,246,246,1) 10%);
    padding: 0 20px 0 28px;
    position: absolute;
    display: flex;
    height: 100%;
    right: 0;
    top: 0;
  }
}
.is-disabled-input {
  background-color: #f6f6f6;
  cursor: not-allowed;
  &:hover {
    border-color: #dcdfe6 !important;
  }
}
</style>
