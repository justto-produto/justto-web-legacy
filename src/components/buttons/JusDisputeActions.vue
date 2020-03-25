<template lang="html">
  <div :class="tableActions ? 'jus-dispute-actions--table' : 'jus-dispute-actions--dispute'" class="jus-dispute-actions">
    <el-tooltip v-if="!tableActions" content="Voltar">
      <router-link to="/management">
        <jus-icon class="back" icon="back"/>
      </router-link>
    </el-tooltip>
    <el-tooltip v-if="canSettled" content="Ganhar">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        data-testid="settled"
        @click="disputeAction('settled')">
        <jus-icon icon="win"/>
      </el-button>
    </el-tooltip>
    <el-tooltip v-if="canUnsettled" content="Perder">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        data-testid="unsettled"
        @click="disputeAction('unsettled')">
        <jus-icon icon="lose"/>
      </el-button>
    </el-tooltip>
    <el-tooltip v-if="dispute.paused" content="Retomar">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        data-testid="resume"
        @click="disputeAction('resume')">
        <jus-icon icon="start-again"/>
      </el-button>
    </el-tooltip>
    <el-tooltip v-else content="Pausar">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        data-testid="paused"
        @click="disputeAction('paused')">
        <jus-icon icon="pause"/>
      </el-button>
    </el-tooltip>
    <el-tooltip content="Reiniciar engajamento">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        data-testid="restart-engagement"
        @click="disputeAction('restart-engagement')">
        <jus-icon icon="refresh"/>
      </el-button>
    </el-tooltip>
    <el-tooltip v-if="!tableActions" content="Cancelar mensagens automáticas">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        data-testid="cancel-messages"
        @click="disputeAction('cancel-messages')">
        <jus-icon icon="cancel-messages"/>
      </el-button>
    </el-tooltip>
    <el-tooltip v-if="!tableActions" content="Alterar Negociador">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        @click="openEditNegotiatorsDialog()">
        <!-- @click="disputeAction('edit-negotiators')"> -->
        <jus-icon icon="delegate"/>
      </el-button>
    </el-tooltip>
    <el-tooltip v-if="!tableActions" content="Enriquecer disputa">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        @click="disputeAction('enrich')">
        <jus-icon icon="enrich"/>
      </el-button>
    </el-tooltip>
    <el-tooltip v-if="canSendCounterproposal" content="Contraproposta manual">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        @click="disputeAction('make-counterproposal')">
        <jus-icon icon="proposal2" />
      </el-button>
    </el-tooltip>
    <el-tooltip v-if="!canSendCounterproposal" content="Retornar para negociação">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        @click="disputeAction('renegotiate')">
        <jus-icon icon="move-to-running" />
      </el-button>
    </el-tooltip>
    <el-tooltip v-if="canMarkAsNotRead" content="Marcar como não lida">
      <el-button
        :type="tableActions ? 'text' : ''"
        :plain="!tableActions"
        @click="setAsUnread()">
        <jus-icon icon="unread"/>
      </el-button>
    </el-tooltip>
    <el-tooltip v-if="tableActions" content="Abrir disputa em nova aba">
      <el-button
        type="text"
        @click="openNewTab()">
        <jus-icon icon="external-link" />
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
    <el-tooltip v-if="!tableActions" :content="collapsed ? 'Exibir informações da disputa' : 'Ocultar informações da disputa'">
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
        placeholder="Escolha o motivo da perda">
        <el-option
          v-for="(type, index) in unsettledTypes"
          :key="index"
          :label="type"
          :value="index"/>
      </el-select>
      <span slot="footer">
        <el-button :disabled="modalLoading" plain @click="chooseUnsettledDialogVisible = false">Cancelar</el-button>
        <el-button
          :loading="modalLoading"
          :disabled="!unsettledType"
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="unsettledDispute('unsettled')">
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
          :titles="['Workspace', 'Disputa']"
          :button-texts="['Remover', 'Adicionar']"
          :data="workspaceNegotiators"
          v-model="disputeNegotiators"
          filter-placeholder="Buscar"
          filterable/>
      </el-form>
      <span slot="footer">
        <el-button :disabled="modalLoading" plain @click="editNegotiatorDialogVisible = false">Cancelar</el-button>
        <el-button :loading="modalLoading" type="primary" @click.prevent="disputeAction('edit-negotiators', disputeNegotiators)">Editar dados</el-button>
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
            <el-form-item label="Valor" prop="lastCounterOfferValue">
              <money
                v-model="counterOfferForm.lastCounterOfferValue"
                class="el-input__inner"
                data-testid="counterproposal-value-input"
                maxlength="16" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Proposto por" prop="selectedRoleId">
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
            <el-form-item label="Nota" prop="note">
              <el-input v-model="counterOfferForm.note" type="textarea" rows="4" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button :disabled="modalLoading" plain @click="counterproposalDialogVisible = false">Cancelar</el-button>
        <el-button :loading="modalLoading" type="primary" @click.prevent="disputeAction('send-counterproposal')">Atualizar contraproposta</el-button>
      </span>
    </el-dialog>


    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="insertSettledValueDialogVisible"
      append-to-body
      title="Ganhar"
      class="dispute-view-actions__choose-unsettled-dialog"
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
      <el-form>
        <el-form-item label="Valor do acordo:" >
          <money v-model="settledValue" class="el-input__inner" data-testid="proposal-value-input" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button :disabled="modalLoading" plain @click="insertSettledValueDialogVisible = false">Cancelar</el-button>
        <el-button
          :loading="modalLoading"
          :disabled="!settledValue"
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="showDisputeResume('settled')">
          Continuar
        </el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import { validateZero } from '@/utils/validations'
import { getRoles, getTracktitleByAction } from '@/utils/jusUtils'

export default {
  name: 'JusDisputeActions',
  props: {
    dispute: {
      type: Object,
      default: () => {}
    },
    tableActions: {
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
      settledValue: 0,
      unsettledType: null,
      unsettledTypes: {},
      negotiatorsForm: {},
      negotiatorsRules: {},
      disputeNegotiators: [],
      chooseUnsettledDialogVisible: false,
      editNegotiatorDialogVisible: false,
      counterproposalDialogVisible: false,
      insertSettledValueDialogVisible: false,
      modalLoading: false,
      counterOfferForm: {
        lastCounterOfferValue: '',
        selectedRoleId: '',
        note: ''
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
    canMarkAsNotRead () {
      return this.dispute && this.dispute.status && !['IMPORTED', 'ENRICHED', 'ENGAGEMENT'].includes(this.dispute.status)
    },
    canSendCounterproposal () {
      return this.dispute && this.dispute.status && !['CHECKOUT', 'ACCEPTED', 'SETTLED', 'UNSETTLED'].includes(this.dispute.status)
    },
    checkUpperRangeCounterOffer () {
      return this.counterOfferForm.lastCounterOfferValue > this.dispute.disputeUpperRange
    },
    workspaceNegotiators () {
      return this.$store.getters.workspaceMembers.map(member => {
        let newMember = {}
        newMember.key = member.person.id
        newMember.label = member.person.name
        newMember.value = member.person.id
        return newMember
      })
    },
    disputeClaimants () {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'CLAIMANT')
      }
      return []
    },
    authorsResume () {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'CLAIMANT', 'PARTY').map(role => {
          return role.name
        }).join(', ')
      }
      return []
    },
    lawyersResume () {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'CLAIMANT', 'LAWYER').map(role => {
          return role.name
        }).join(', ')
      }
      return []
    },
    respondentsResume () {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'RESPONDENT').map(role => {
          return role.name
        }).join(', ')
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
    disputeAction (action, additionParams) {
      let message
      switch (action) {
        case 'settled':
          message = ''

          break
        case 'unsettled':
          if (this.unsettledType === 'INSUFFICIENT_UPPER_RANGE' && !this.dispute.lastCounterOfferValue) {
            this.disputeAction('make-counterproposal')
          } else {
            message = ''
            // additionParams = { body:  }
            this.doAction(action, additionParams)
          }
          break
        case 'resume':
          message = ''
          this.doAction(action)
          break
        case 'paused':
          message = ''
          this.doAction(action)
          break
        case 'restart-engagement':
          this.restartEngagement(action).then(() => {
            message = ''
            this.doAction(action)
          })
          break
        case 'cancel-messages':
          message = ''
          this.doAction(action)
          break
        case 'edit-negotiators':
          message = ''
          additionParams = { negotiatorsId: additionParams }
          this.doAction(action, additionParams)
          break
        case 'enrich':
          message = ''
          this.doAction(action)
          break
        case 'renegotiate':
          message = ''
          this.doAction(action)
          break
        case 'make-counterproposal':
          if (this.dispute.paused) {
            message = ''
            this.doAction('resume').then(() => {
              this.openCounterproposalDialog()
            })
          } else {
            this.openCounterproposalDialog()
          }
          break
        case 'send-counterproposal':
          if (this.unsettledType === 'INSUFFICIENT_UPPER_RANGE') {
            this.sendCounterproposal().then(() => {
              message = ''
              this.doAction('unsettled')
            })
          } else {
            this.checkCounterproposal().then(() => {
              this.sendCounterproposal()
            })
          }
          break
        case 'favorite':
          message = ''
          this.doAction(action)
          break
        case 'disfavor':
          message = ''
          this.doAction(action)
          break
        default:

      }


    //
    //   if (action === 'unsettled') {
    //     this.chooseUnsettledDialogVisible = true
    //     this.unsettledType = null
    //
    //   } else if (action === 'settled' && !this.dispute.disputeDealValue) {
    //     this.insertSettledValueDialogVisible = true
    //     this.settledValue = 0
    //
    //   } else {
    //     let capAction = this.$t('action.' + action.toUpperCase())
    //     this.$confirm('Tem certeza que deseja realizar ação?', capAction.charAt(0).toUpperCase() + capAction.slice(1), {
    //       confirmButtonClass: 'confirm-action-btn',
    //       confirmButtonText: 'Continuar',
    //       cancelButtonText: 'Cancelar',
    //       type: 'warning',
    //       cancelButtonClass: 'is-plain'
    //     }).then(() => {
    //       this.doAction(action)
    //     })
    //   }
    },

    doAction (action, additionParams) {
      return new Promise((resolve, reject) => {
        let params = { action: action, disputeId: this.dispute.id }
        if (additionParams) params = {...params, ...additionParams}
        this.$store.dispatch('sendDisputeAction', params).then(() => {
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    },


    restartEngagement (action) {
      return new Promise((resolve, reject) => {
        if (action === 'restart-engagement' && (this.dispute.strategyId === 25 || this.dispute.strategyId === 26)) {
          this.$alert('Esta disputa está com uma estratégia de <b>engajamento manual</b>. Se deseja realizar engajamento automático, edite a disputa e escolha uma estratégia de engajamento adequada', 'Reiniciar Engajamento', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: 'OK',
            type: 'warning'
          })
          reject()
        } else {
          resolve()
        }
      })
    },
    setAsUnread () {
      this.$store.dispatch('disputeSetVisualized', {
        visualized: false,
        disputeId: this.dispute.id
      }).then(() => {
        this.$router.push('/management')
      }).catch(() => {
        this.$jusNotification({ type: 'error' })
      })
    },
    openNewTab () {
      let routeData = this.$router.resolve({ name: 'dispute', params: { id: this.dispute.id } })
      window.open(routeData.href, '_blank')
    },
    togleCollapsed () {
      this.collapsed = !this.collapsed
    },






    openEditNegotiatorsDialog () {
      this.modalLoading = false
      this.disputeNegotiators = this.dispute.disputeRoles.filter(member => {
        return member.roles.includes('NEGOTIATOR') && !member.archived
      }).map(member => member.personId)
      this.editNegotiatorDialogVisible = true
    },
    openCounterproposalDialog () {
      this.counterOfferForm.lastCounterOfferValue = ''
      this.counterOfferForm.selectedRoleId = this.disputeClaimants.length === 1 ? this.disputeClaimants[0].id : ''
      this.counterproposalDialogVisible = true
      if (this.$refs.counterOfferForm) {
        this.$refs.counterOfferForm.clearValidate()
      }
    },

    // doAction (action) {
    //   return new Promise((resolve, reject) => {
    //     this.modalLoading = true
    //     let translatedAction = this.$t('action.' + action.toUpperCase())
    //     let params = {
    //       action: action,
    //       disputeId: this.dispute.id
    //     }
    //     if (this.unsettledType) {
    //       params['body'] = { 'reason': this.unsettledTypes[this.unsettledType] }
    //     }
    //     if (action === 'settled' && this.settledValue) {
    //       params.value = this.settledValue
    //     }
    //     if (this.tableActions && action !== 'unsettled') {
    //       this.$jusNotification({
    //         title: 'Yay!',
    //         dangerouslyUseHTMLString: true,
    //         message: `Ação <strong>${translatedAction}</strong> realizada com sucesso. Em instantes o sistema atualizará com as novas informações`,
    //         type: 'success'
    //       })
    //     }
    //     this.$store.dispatch('sendDisputeAction', params).then(() => {
    //       resolve()
    //       // SEGMENT TRACK
    //       this.$jusSegment(getTracktitleByAction(action), { disputeId: params.disputeId })
    //       if (!this.tableActions || action === 'unsettled') {
    //         this.$jusNotification({
    //           title: 'Yay!',
    //           dangerouslyUseHTMLString: true,
    //           message: `Ação <strong>${translatedAction}</strong> realizada com sucesso.`,
    //           type: 'success'
    //         })
    //       }
    //       if (action === 'unsettled' && !this.tableActions) {
    //         setTimeout(() => {
    //           this.$jusNotification({
    //             title: 'Atenção!',
    //             message: 'Enviaremos para às contrapartes uma mensagem de encerramento de negociação.',
    //             type: 'info',
    //             duration: 0
    //           })
    //         }, 2000)
    //       }
    //       if (!this.tableActions) this.$emit('fetch-data')
    //     }).catch(e => {
    //       reject(e)
    //       console.error(e)
    //       if (e.response && e.response.data.reason.length) {
    //         this.$jusNotification({
    //           type: 'error',
    //           message: e.response.data.reason + '. Tente novamente ou entre em contato com o administrador do sistema.'
    //         })
    //       } else {
    //         this.$jusNotification({ type: 'error' })
    //       }
    //     }).finally(() => {
    //       this.chooseUnsettledDialogVisible = false
    //       this.insertSettledValueDialogVisible = false
    //       this.modalLoading = false
    //     })
    //   })
    // },
    //
    //


    // unsettledDispute (action) {
    //   if (this.unsettledType === 'INSUFFICIENT_UPPER_RANGE' && !this.dispute.lastCounterOfferValue) {
    //     this.openCounterproposalDialog()
    //   } else {
    //     this.doAction(action)
    //   }    // openCounterproposalDialog () {
    //   this.counterOfferForm.lastCounterOfferValue = ''
    //   this.counterOfferForm.selectedRoleId = this.disputeClaimants.length === 1 ? this.disputeClaimants[0].id : ''
    //   this.counterproposalDialogVisible = true
    //   if (this.$refs.counterOfferForm) {
    //     this.$refs.counterOfferForm.clearValidate()
    //   }
    // },
    // },

    checkCounterproposal () {
      return new Promise((resolve, reject) => {
        this.$refs.counterOfferForm.validate(valid => {
          if (valid) {
            if (this.checkUpperRangeCounterOffer) {
              this.$confirm('Valor de contraproposta é maior que alçada máxima, deseja continuar?', 'Atenção!', {
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Cancelar',
                cancelButtonClass: 'is-plain',
                type: 'info'
              })
              .then(() => { resolve() })
              .catch(e => { reject() })
            } else { resolve() }
          } else { reject() }
        })
      })
    },
    sendCounterproposal () {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('getDisputeDTO', this.dispute.id).then(disputeToEdit => {
          this.$store.dispatch('sendDisputeCounterProposal', {
            disputeId: this.dispute.id,
            objectId: disputeToEdit.objects[0].id,
            value: this.counterOfferForm.lastCounterOfferValue.toString(),
            roleId: this.counterOfferForm.selectedRoleId,
            note: this.counterOfferForm.note
          }).then(() => {
            if (this.counterOfferForm.note) {
              let people = this.disputeClaimants.filter(d => d.id === this.counterOfferForm.selectedRoleId)[0]
              let note = '<b>Contraproposta manual no valor de ' + this.$options.filters.currency(this.counterOfferForm.lastCounterOfferValue) + ', realizada por ' + people.name + ', com a nota:</b> <br/>' + this.counterOfferForm.note
              this.$store.dispatch('sendDisputeNote', {
                note,
                disputeId: this.dispute.id
              })
              .then(() => { resolve() })
              .catch(e => { reject(e) })
            } else {
              resolve()
            }
          }).catch(() => {
            reject()
          }).catch(e => {
            reject(e)
          })
        })
      })
    },
    showDisputeResume (action) {
      const h = this.$createElement
      let detailsMessage = [
        h('strong', { style: 'margin-bottom: 6px; display: flex' }, 'Confira os dados da disputa:'),
        h('p', null, [
          h('b', null, 'Nº da disputa: '),
          h('span', null, '#' + this.dispute.id)
        ]),
        h('p', null, [
          h('b', null, 'Nº do processo: '),
          h('span', null, this.dispute.code)
        ]),
        h('p', null, [
          h('b', null, 'Réu(s): '),
          h('span', null, this.respondentsResume.toUpperCase() || ' - ')
        ]),
        h('p', null, [
          h('b', null, 'Autor(es): '),
          h('span', null, this.authorsResume.toUpperCase() || ' - ')
        ]),
        h('p', null, [
          h('b', null, 'Advogado(s) do autor(es): '),
          h('span', null, this.lawyersResume.toUpperCase() || ' - ')
        ]),
        h('p', null, [
          h('b', null, 'Valor do acordo: '),
          h('span', null, this.$options.filters.currency(this.settledValue))
        ])
      ]
      this.$confirm(h('div', null, detailsMessage), 'Ganhar', {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then(() => {
        this.doAction(action)
      })
    }
  }
}
</script>

<style lang="scss">
.jus-dispute-actions {
  &__choose-unsettled-dialog {
    .el-message-box__content {
      padding: 10px 0;
    }
    .el-select {
      margin: 10px 0;
      width: 100%;
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
</style>
