<template lang="html">
  <div class="dispute-overview-view">
    <el-collapse value="1">
      <el-collapse-item v-loading="loading" title="Informações gerais" name="1">
        <div v-if="dispute.createAt" class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Data da importação:</span>
          <span>{{ dispute.createAt.dateTime | moment('DD/MM/YY') }}</span>
        </div>
        <div class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Código:</span>
          <span>{{ dispute.code }}</span>
        </div>
        <div class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Campanha:</span>
          <span>{{ dispute.campaignName }}</span>
        </div>
        <div class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Estratégia:</span>
          <span>{{ dispute.strategyName }}</span>
        </div>
        <div class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Status:</span>
          <span>{{ $t('occurrence.type.' + dispute.status) | capitalize }}</span>
        </div>
        <div v-if="dispute.classification" class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Classificação:</span>
          <span>{{ dispute.classification | capitalize }}</span>
        </div>
        <div class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Alçada máxima:</span>
          <span>{{ dispute.disputeUpperRange | currency }}</span>
        </div>
        <div class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Contraproposta:</span>
          <span>
            <el-tooltip v-if="dispute.lastCounterOfferName" :content="'Proposto por: ' + dispute.lastCounterOfferName">
              <jus-avatar-user :name="dispute.lastCounterOfferName" size="mini" />
            </el-tooltip>
            {{ dispute.lastCounterOfferValue | currency }}
          </span>
        </div>
        <div
          v-if="(dispute.status === 'ACCEPTED' || dispute.status === 'CHECKOUT' || dispute.status === 'SETTLED') && dispute.dealValue"
          class="dispute-overview-view__info-line">
          <span class="title">Valor do acordo:</span>
          <span>{{ dispute.disputeDealValue | currency }}</span>
        </div>
        <div class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Valor proposto:</span>
          <span>
            <el-tooltip v-if="dispute.lastOfferName" :content="'Proposto por: ' + dispute.lastOfferName">
              <jus-avatar-user :name="dispute.lastOfferName" size="mini" />
            </el-tooltip>
            {{ dispute.lastOfferValue | currency }}
          </span>
        </div>
        <div class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Fim da negociação:</span>
          <span v-if="dispute.expirationDate">{{ dispute.expirationDate.dateTime | moment('DD/MM/YY') }}</span>
        </div>
        <div v-if="dispute.description && dispute.description.trim()" class="dispute-overview-view__info-textarea">
          Descrição:
          <strong :class="{ 'right': dispute.description.length < 25 }">
            {{ dispute.description }}
          </strong>
        </div>
        <div class="dispute-overview-view__actions">
          <el-button type="primary" data-testid="edit-dispute" @click="openDisputeDialog()">Editar</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <hr>
    <el-collapse
      v-loading="loading"
      ref="roleCollapse"
      accordion
      class="el-collapse--bordered"
      style="margin: 20px 0;"
      @change="handleChange">
      <el-collapse-item
        v-for="role in disputeRolesSort"
        :key="role.personId"
        :name="role.id"
        data-testid="expand-party">
        <template slot="title">
          <div class="dispute-overview-view__name">
            {{ role.name }}
          </div>
        </template>
        <!-- <div class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span>Status:</span>
          <el-popover
            placement="top-end"
            width="220"
            trigger="hover">
            <div class="dispute-overview-view__location">
              <span>Localização</span>
              -
              <span>Aparelho</span>
              -
              <span>OS</span>
              -
            </div>
            <span slot="reference">
              Offline
            </span>
          </el-popover>
        </div> -->
        <div v-show="role.documentNumber" class="dispute-overview-view__info-line">
          <span class="title">CPF/CNPJ:</span>
          <span>{{ role.documentNumber | cpfCnpjMask }}</span>
        </div>
        <div class="dispute-overview-view__info-line">
          Função:
          <span>{{ buildTitle(role) }}</span>
        </div>
        <div v-show="role.phones.length" class="dispute-overview-view__info-line">
          Telefone(s):
        </div>
        <div v-show="role.phones.length" class="dispute-overview-view__info-list">
          <ul>
            <li v-for="phone in role.phones" :key="phone.id">
              <span>
                <el-checkbox v-model="phone.selected" />
                {{ phone.number | phoneMask }}
              </span>
              <div class="dispute-overview-view__list-actions">
                <el-tooltip content="Telefone inválido">
                  <jus-icon v-if="!phone.isValid" icon="warn-dark" />
                </el-tooltip>
              </div>
            </li>
          </ul>
        </div>
        <div v-show="role.emails.length" class="dispute-overview-view__info-line">
          E-mail(s):
        </div>
        <div v-show="role.emails.length" class="dispute-overview-view__info-list">
          <ul>
            <li v-for="email in role.emails" :key="email.id">
              <span>
                <el-checkbox v-model="email.selected" />
                {{ email.address }}
              </span>
              <div class="dispute-overview-view__list-actions">
                <el-tooltip content="E-mail inválido">
                  <jus-icon v-if="!email.isValid" icon="warn-dark" />
                </el-tooltip>
              </div>
            </li>
          </ul>
        </div>
        <div v-show="role.oabs.length" class="dispute-overview-view__info-line">
          OAB(s):
        </div>
        <div v-show="role.oabs.length" class="dispute-overview-view__info-list">
          <ul>
            <li v-for="oab in role.oabs" :key="oab.id">
              <div>
                <el-checkbox v-model="oab.selected" />
                {{ oab.number }}<span v-if="oab.state">-{{ oab.state }}</span>
              </div>
              <div class="dispute-overview-view__list-actions">
                <el-tooltip content="OAB inválido">
                  <jus-icon v-if="!oab.isValid" icon="warn-dark" />
                </el-tooltip>
              </div>
            </li>
          </ul>
        </div>
        <div class="dispute-overview-view__actions">
          <el-button plain @click="removeRole(role)">Excluir</el-button>
          <el-button type="primary" data-testid="edit-part" @click="openRoleDialog(role)">Editar</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDisputeDialogVisible"
      title="Editar disputa"
      width="50%">
      <el-form
        v-loading="editDisputeDialogLoading"
        ref="disputeForm"
        :model="disputeForm"
        label-position="top"
        @submit.native.prevent="editDispute">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Alçada máxima" prop="disputeUpperRange">
              <money v-model="disputeForm.disputeUpperRange" v-bind="money" class="el-input__inner" />
            </el-form-item>
          </el-col>
        </el-row>
        <h3>Contraproposta</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Valor" prop="lastCounterOfferValue">
              <money v-model="disputeForm.lastCounterOfferValue" v-bind="money" class="el-input__inner" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Proposto por" prop="lastCounterOfferValue">
              <el-select v-model="selectedClaimantId" placeholder="Autor da contraproposta">
                <el-option
                  v-for="claimant in disputeClaimants"
                  :key="claimant.id"
                  :label="claimant.name"
                  :value="claimant.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <h3>Valor proposto</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Valor" prop="lastOfferValue">
              <money v-model="disputeForm.lastOfferValue" v-bind="money" class="el-input__inner" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Proposto por" prop="lastCounterOfferValue">
              <el-select v-model="selectedNegotiatorId" placeholder="Autor da contraproposta">
                <el-option
                  v-for="negotiator in dispute.negotiators"
                  :key="negotiator.id"
                  :label="negotiator.name"
                  :value="negotiator.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Fim da negociação" prop="expirationDate">
              <el-date-picker
                v-model="disputeForm.expirationDate"
                :clearable="false"
                format="dd/MM/yyyy"
                type="date" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Descrição" prop="description">
              <el-input v-model="disputeForm.description" type="textarea" rows="4" data-testid="description"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="editDisputeDialogVisible = false">Cancelar</el-button>
        <el-button :loading="editDisputeDialogLoading" type="primary" data-testid="confirm-edit-data" @click="editDispute()">Editar dados</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editRoleDialogVisible"
      width="40%">
      <span slot="title" class="el-dialog__title">
        Alterar dados de {{ roleForm.title }}
      </span>
      <el-alert
        v-show="editRoleDialogError"
        type="error"
        @close="editRoleDialogError = false">
        <ul><li v-for="error in editRoleDialogErrorList" :key="error">
          {{ error }}
        </li></ul>
      </el-alert>
      <el-form
        v-loading="editRoleDialogLoading"
        ref="roleForm"
        :model="roleForm"
        :rules="roleRules"
        label-position="top"
        @submit.native.prevent>
        <el-form-item label="Nome" prop="name">
          <el-input v-model="roleForm.name" autofocus="" />
        </el-form-item>
        <el-form-item label="CPF/CNPJ" prop="documentNumber">
          <el-input v-mask="['###.###.###-##', '##.###.###/####-##']" v-model="roleForm.documentNumber" />
        </el-form-item>
        <div v-if="roleForm.roles && roleForm.roles.includes('LAWYER')" class="dispute-overview-view__oab-form">
          <el-form-item class="oab" label="OAB" prop="oab">
            <el-input v-model="roleForm.oab" />
          </el-form-item>
          <el-form-item class="state" label="Estado" prop="state">
            <el-select v-model="roleForm.state" placeholder="">
              <el-option
                v-for="state in $store.state.statesList"
                :key="state"
                :label="state"
                :value="state" />
            </el-select>
          </el-form-item>
          <el-button class="button" type="primary" @click="addOab(roleForm.personId, roleForm.oabs)">
            <jus-icon icon="add-white" />
          </el-button>
        </div>
        <el-table
          v-if="roleForm.roles && roleForm.roles.includes('LAWYER')"
          :data="roleForm.oabs"
          :show-header="false"
          fit
          class="el-table--list">
          <el-table-column>
            <template slot-scope="scope">
              {{ scope.row.number }} - {{ scope.row.state }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="right" width="48px">
            <template slot-scope="scope">
              <a href="#" @click.prevent="removeOab(scope.$index)">
                <jus-icon icon="trash" />
              </a>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item label="Telefone" prop="phone">
          <el-input v-mask="['(##) ####-####', '(##) #####-####']" v-model="roleForm.phone">
            <el-button slot="append" @click="addPhone()">
              <jus-icon icon="add-white" />
            </el-button>
          </el-input>
        </el-form-item>
        <el-table
          :data="roleForm.phones"
          :show-header="false"
          fit
          class="el-table--list">
          <el-table-column>
            <template slot-scope="scope">
              {{ scope.row.number | phoneMask }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="right" width="48px">
            <template slot-scope="scope">
              <a href="#" @click.prevent="removePhone(scope.$index)">
                <jus-icon icon="trash" />
              </a>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="roleForm.email" data-testid="input-email">
            <el-button slot="append" data-testid="add-email" @click="addEmail()">
              <jus-icon icon="add-white" />
            </el-button>
          </el-input>
        </el-form-item>
        <el-table
          :data="roleForm.emails"
          :show-header="false"
          fit
          class="el-table--list">
          <el-table-column>
            <template slot-scope="scope">
              {{ scope.row.address }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="right" width="48px">
            <template slot-scope="scope">
              <a href="#" @click.prevent="removeEmail(scope.$index)">
                <jus-icon icon="trash" />
              </a>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="editRoleDialogVisible = false">Cancelar</el-button>
        <el-button :loading="editRoleDialogLoading" type="primary" data-testid="edit-data-part" @click="editRole">
          Editar dados
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Money } from 'v-money'
import { mask } from 'vue-the-mask'
import { getRoles } from '@/plugins/jusUtils'
import CPFCNPJ from 'cpf_cnpj'

export default {
  name: 'DisputeOverview',
  components: { Money },
  directives: { mask },
  props: {
    loading: {
      default: false,
      type: Boolean
    },
    dispute: {
      default: () => {},
      type: Object
    },
    activeRoleId: {
      default: 0,
      type: Number
    }
  },
  data () {
    const validateName = (rule, value, callback) => {
      if (value && value.length > 2) {
        callback()
      } else {
        callback(new Error())
      }
    }
    const validateCpf = (rule, value, callback) => {
      if (!value) callback()
      if (value.length === 14) {
        if (CPFCNPJ.CPF.isValid(value)) {
          callback()
        } else callback(new Error())
      } else {
        if (CPFCNPJ.CNPJ.isValid(value)) {
          callback()
        } else callback(new Error())
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (value) {
        if (value && value.length > 13) {
          callback()
        } else callback(new Error())
      } else {
        callback()
      }
    }
    return {
      activeId: 0,
      selectedClaimantId: '',
      selectedNegotiatorId: '',
      disputeForm: {
        description: '',
        expirationDate: ''
      },
      roleForm: {},
      roleRules: {
        name: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validateName, message: 'Nome precisa conter mais de 3 caracteres', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validatePhone, message: 'Telefone inválido', trigger: 'submit' }
        ],
        email: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { type: 'email', message: 'E-mail inválido', trigger: 'submit' }
        ],
        documentNumber: [{ validator: validateCpf, message: 'CPF/CNPJ inválido.', trigger: 'submit' }],
        oab: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        state: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      },
      emailDialogVisible: false,
      phoneDialogVisible: false,
      editDisputeDialogVisible: false,
      editDisputeDialogLoading: false,
      editRoleDialogVisible: false,
      editRoleDialogLoading: false,
      editRoleDialogError: false,
      editRoleDialogErrorList: [],
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        precision: 2
      }
    }
  },
  computed: {
    disputeRolesSort () {
      if (this.dispute.disputeRoles) {
        let sortedArray = this.dispute.disputeRoles.slice(0) || []
        return sortedArray.sort((a, b) => {
          if (a.party === b.party) {
            return (a.roles[0] > b.roles[0]) ? -1 : (a.roles[0] < b.roles[0]) ? 1 : 0
          } else {
            return (a.party < b.party) ? -1 : 1
          }
        })
      } return []
    },
    disputeClaimants () {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'CLAIMANT')
      }
      return []
    }
  },
  methods: {
    openDisputeDialog () {
      this.editDisputeDialogLoading = false
      this.selectedClaimantId = this.disputeClaimants[0].id || ''
      this.selectedNegotiatorId = this.dispute.negotiators[0].id || ''
      this.editDisputeDialogVisible = true
      let dispute = Object.assign({}, this.dispute)
      this.disputeForm.id = dispute.id
      this.disputeForm.disputeUpperRange = parseFloat(dispute.disputeUpperRange)
      this.disputeForm.lastOfferValue = parseFloat(dispute.lastOfferValue)
      this.disputeForm.lastCounterOfferValue = parseFloat(dispute.lastCounterOfferValue)
      this.disputeForm.expirationDate = dispute.expirationDate.dateTime
      this.disputeForm.description = dispute.description
    },
    editDispute () {
      this.editDisputeDialogLoading = true
      const h = this.$createElement
      this.$msgbox({
        title: 'Atenção!',
        message: h('p', null, [
          h('div', null, '- As novas informações vão sobrescrever as antigas.'),
          this.disputeForm.lastOfferValue > this.disputeForm.disputeUpperRange
            ? h('div', null, '- Alçada máxima está abaixo do valor proposto.') : null,
          h('br', null, null),
          h('div', null, 'Deseja continuar?')
        ]),
        confirmButtonText: 'Continuar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then(() => {
        this.$store.dispatch('getDispute', this.dispute.id).then(disputeToEdit => {
          let promises = []
          if (this.disputeForm.disputeUpperRange) disputeToEdit.objects[0].respondentBoundary.boundary = this.disputeForm.disputeUpperRange + ''
          if (this.disputeForm.disputeUpperRange) disputeToEdit.objects[0].boundarys[0].boundary = this.disputeForm.disputeUpperRange + ''
          if (this.disputeForm.expirationDate !== this.dispute.expirationDate) disputeToEdit.expirationDate.dateTime = this.$moment(this.disputeForm.expirationDate).format('YYYY-MM-DD[T]HH:mm:ss[Z]')
          if (this.disputeForm.description) disputeToEdit.description = this.disputeForm.description
          promises.push(this.$store.dispatch('editDispute', disputeToEdit))
          if (this.disputeForm.lastCounterOfferValue !== this.dispute.lastCounterOfferValue) {
            if (this.selectedClaimantId) {
              promises.push(this.$store.dispatch('editDisputeOffer', {
                disputeId: this.dispute.id,
                objectId: this.dispute.objectId,
                value: this.disputeForm.lastCounterOfferValue.toString(),
                roleId: this.selectedClaimantId
              }))
            }
          }
          if (this.disputeForm.lastOfferValue !== this.dispute.lastOfferValue) {
            promises.push(this.$store.dispatch('editDisputeOffer', {
              disputeId: this.dispute.id,
              objectId: this.dispute.objectId,
              value: this.disputeForm.lastOfferValue.toString(),
              roleId: this.selectedNegotiatorId
            }))
          }
          Promise.all(promises).then(() => {
            this.editDisputeDialogVisible = false
            this.$jusNotification({
              title: 'Yay!',
              message: 'Os dados foram alterados com sucesso.',
              type: 'success'
            })
          }).catch(() => {
            this.$jusNotification({ type: 'error' })
          }).finally(() => {
            this.editDisputeDialogLoading = false
          })
        })
      }).catch(() => {
        this.editDisputeDialogLoading = false
      })
    },
    buildTitle (role) {
      if (role.party === 'RESPONDENT') {
        switch (role.roles[0]) {
          case 'NEGOTIATOR':
            return 'Negociador'
          case 'PARTY':
            return 'Réu'
          case 'LAWYER':
            return 'Advogado do réu'
        }
      } else {
        if (role.roles[0] === 'PARTY') {
          return 'Parte contrária'
        } else if (role.roles[0] === 'LAWYER') {
          return 'Advogado da parte'
        } else {
          return role.name
        }
      }
    },
    handleChange (val) {
      this.activeId = val || 0
      this.$emit('update:activeRoleId', this.activeId)
    },
    openRoleDialog (role) {
      this.editRoleDialogError = false
      this.editRoleDialogVisible = true
      this.roleForm = JSON.parse(JSON.stringify(role))
      this.roleForm.title = this.buildTitle(role)
      this.roleForm.documentNumber = this.$options.filters.cpfCnpjMask(this.roleForm.documentNumber)
      if (this.$refs.roleForm) this.$refs.roleForm.clearValidate()
    },
    editRole () {
      let isValid = true
      this.$refs.roleForm.validateField(['name', 'documentNumber'], errorMessage => {
        if (errorMessage)isValid = false
      })
      if (isValid) {
        let roleToEdit = JSON.parse(JSON.stringify(this.roleForm))
        delete roleToEdit.title
        this.editRoleDialogLoading = true
        this.$store.dispatch('editRole', {
          disputeId: this.dispute.id,
          disputeRole: roleToEdit
        }).then(responde => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Os dados foram alterados com sucesso.',
            type: 'success'
          })
          this.editRoleDialogVisible = false
        }).catch(error => {
          this.editRoleDialogError = true
          this.editRoleDialogErrorList = []
          if (error.status === 400) {
            this.editRoleDialogError = true
            this.editRoleDialogErrorList.push(error.data.message)
          } else this.$jusNotification({ type: 'error' })
        }).finally(() => {
          this.editRoleDialogLoading = false
        })
      }
    },
    addPhone () {
      let isValid = true
      this.$refs.roleForm.validateField('phone', errorMessage => {
        if (errorMessage) isValid = false
      })
      if (isValid) {
        this.roleForm.phones.push({
          number: this.roleForm.phone
        })
        this.roleForm.phone = ''
      }
    },
    removePhone (index) {
      this.roleForm.phones.splice(index, 1)
    },

    addEmail () {
      let isValid = true
      this.$refs.roleForm.validateField('email', errorMessage => {
        if (errorMessage) isValid = false
      })
      if (isValid) {
        this.roleForm.emails.push({
          address: this.roleForm.email
        })
        this.roleForm.email = ''
      }
    },
    removeEmail (index) {
      this.roleForm.emails.splice(index, 1)
    },
    addOab () {
      let isValid = true
      this.$refs.roleForm.validateField(['oab', 'state'], errorMessage => {
        if (errorMessage) isValid = false
      })
      if (isValid) {
        this.roleForm.oabs.push({
          number: this.roleForm.oab,
          state: this.roleForm.state
        })
        this.roleForm.oab = ''
        this.roleForm.state = ''
      }
    },
    removeOab (index) {
      this.roleForm.oabs.splice(index, 1)
    },
    removeRole (role) {
      this.$confirm('Tem certeza que deseja remover?', 'Atenção!', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar'
      }).then(() => {
        this.$store.dispatch('removeRole', {
          disputeId: role.id,
          roleId: role.id
        }).then(response => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Pessoa removida com sucesso.',
            type: 'success'
          })
        }).catch(() => {
          this.$jusNotification({ type: 'error' })
        })
      })
    }
  }
}
</script>

<style lang="scss">
.dispute-overview-view {
  margin-bottom: -20px;
  .jus-status-dot {
    float: initial !important;
  }
  .el-collapse-item__content {
    padding-bottom: 15px;
  }
  &__info-line {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      white-space: nowrap;
      margin-right: 10px;
    }
    span:last-child {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    a {
      line-height: 15px;
    }
  }
  &__info-textarea {
    text-align: justify;
    margin-top: 10px;
    strong {
      font-weight: 500;
      word-break: break-all;
    }
  }
  &__actions {
    margin-top: 20px;
    display: flex;
    button {
      width: 100%;
    }
  }
  &__info-list {
    font-weight: 500;
    ul {
      margin-top: 4px;
      padding-left: 0;
      li {
        display: flex;
        width: 100%;
        justify-content: space-between;
        span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  &__list-actions {
    img {
      margin-right: 8px;
      vertical-align: middle;
      width: 16px;
    }
  }
  &__location {
    span {
      font-weight: 600;
      display: block;
      margin-bottom: 10px;
    }
    span:not(:first-child) {
      margin-top: 20px;
    }
  }
  &__name {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__oab-form {
    display: flex;
    width: 100%;
    .oab {
      flex: 1;
    }
    .state {
      margin-left: 16px;
      flex: 1;
    }
    .button {
      margin-top: 30px;
      margin-bottom: 22px;
      margin-left: 16px;
      padding: 8px 20px;
      width: 62px;
    }
  }
  .el-input-group__append {
    border-color: #9462f7;
    background-color: #9462f7;
    img {
      margin-top: 1px;
    }
  }
  .el-collapse--bordered {
    .el-collapse-item {
      box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.06);
      &.is-active {
        border: 2px solid #9461f7;
      }
      &:last-child {
        margin-bottom: 20px;
      }
    }
  }
  .el-select, .el-date-editor, .el-radio-group {
    width: 100%;
  }
  .el-dialog {
    min-width: 500px;
    h3 {
      margin-bottom: 10px;
    }
  }
}
</style>
