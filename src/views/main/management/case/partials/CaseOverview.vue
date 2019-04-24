<template lang="html">
  <div class="case-overview-view">
    <el-collapse value="1">
      <el-collapse-item v-loading="loading" title="Informações gerais" name="1">
        <div class="case-overview-view__info-line">
          <span class="title">Nº do Processo:</span>
          <span>{{ dispute.code }}</span>
        </div>
        <div v-if="dispute.campaign" class="case-overview-view__info-line">
          <span class="title">Campanha:</span>
          <span>{{ dispute.campaign.name }}</span>
        </div>
        <div v-if="dispute.strategy" class="case-overview-view__info-line">
          <span class="title">Estratégia:</span>
          <span>{{ dispute.strategy.name }}</span>
        </div>
        <div v-if="dispute.upperRange" class="case-overview-view__info-line">
          <span class="title">Alçada máxima:</span>
          <span>{{ dispute.upperRange.boundary | currency }}</span>
        </div>
        <div class="case-overview-view__info-line">
          <span class="title">Contraproposta:</span>
          <span v-if="dispute.lastOffer">{{ dispute.lastOffer.boundary | currency }}</span>
          <span v-else>{{ 0 | currency }}</span>
        </div>
        <div
          v-if="dispute.lastOffer && (dispute.status === 'ACCEPTED' || dispute.status === 'CHECKOUT')"
          class="case-overview-view__info-line">
          <span class="title">Valor do acordo:</span>
          <span>{{ dispute.lastOffer.boundary | currency }}</span>
        </div>
        <div v-if="dispute.valueOfClaim" class="case-overview-view__info-line">
          <span class="title">Valor proposto:</span>
          <span>{{ dispute.valueOfClaim.value | currency }}</span>
        </div>
        <div class="case-overview-view__info-line">
          <span class="title">Fim da negociação:</span>
          <span>{{ dispute.expirationDate | moment('DD/MM/YY') }}</span>
        </div>
        <div class="case-overview-view__info-line">
          <span class="title">Descrição:</span>
          <span>{{ dispute.description }}</span>
        </div>
        <div class="case-overview-view__actions">
          <el-button type="primary" @click="editCaseDialogVisible = true">Editar</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <hr>
    <el-collapse
      v-loading="loading" accordion
      class="el-collapse--bordered"
      @change="handleChange">
      <el-collapse-item
        v-for="role in disputeRolesSort"
        :key="role.person.id"
        :name="role.person.id">
        <template slot="title">
          <div class="case-overview-view__name">
            <span>
              {{ role.person.name }}
            </span>
            <jus-status-dot type="danger"/>
          </div>
        </template>
        <div class="case-overview-view__info-line">
          <span>Status:</span>
          <el-popover
            placement="top-end"
            width="220"
            trigger="hover">
            <div class="case-overview-view__location">
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
        </div>
        <div class="case-overview-view__info-line">
          Função:
          <span>{{ buildTitle(role) }}</span>
        </div>
        <div v-show="role.person.phones.length" class="case-overview-view__info-line">
          <span>Telefone(s):</span>
        </div>
        <div v-show="role.person.phones.length" class="case-overview-view__info-list">
          <ul>
            <li v-for="phone in role.person.phones" :key="phone.id">
              {{ phone.number }}
            </li>
          </ul>
        </div>
        <div v-show="role.person.emails.length" class="case-overview-view__info-line">
          <span>E-mail(s):</span>
        </div>
        <div v-show="role.person.emails.length" class="case-overview-view__info-list">
          <ul>
            <li v-for="email in role.person.emails" :key="email.id">
              {{ email.address }}
            </li>
          </ul>
        </div>
        <div v-show="role.person.oabs.length" class="case-overview-view__info-line">
          <span>OAB(s):</span>
        </div>
        <div v-show="role.person.oabs.length" class="case-overview-view__info-list">
          <ul>
            <li v-for="oab in role.person.oabs" :key="oab.id">
              {{ oab.number }}
            </li>
          </ul>
        </div>
        <div v-show="role.person.documentNumber" class="case-overview-view__info-line">
          <span class="title">CPF:</span>
          <span>{{ role.person.documentNumber }}</span>
        </div>
        <div class="case-overview-view__actions">
          <el-button plain @click="removeRole(role)">Excluir</el-button>
          <el-button type="primary" @click="openRoleDialog(role)">Editar</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog
      :visible.sync="editCaseDialogVisible"
      title="Editar informações gerais"
      width="30%">
      <el-form
        ref="caseForm"
        :model="caseForm"
        :rules="caseRules"
        label-position="top"
        @submit.native.prevent="editCase">
        <el-row :gutter="20">
          <!-- <el-col :span="12">
            <el-form-item label="Campanha" prop="campaign">
              <el-select v-model="dispute.campaign.name" placeholder="Selecione">
                 <el-option
                   v-for="strategy in strategies"
                   :key="strategy.id"
                   :label="strategy.name"
                   :value="strategy">
                 </el-option>
               </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Estratégia" prop="strategy">
              <el-select v-model="dispute.strategy.name" placeholder="Selecione">
                 <el-option
                   v-for="campaign in campaigns"
                   :key="campaign.id"
                   :label="campaign.name"
                   :value="campaign">
                 </el-option>
               </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="Alçada máxima" prop="boundary">
              <!-- <el-input v-model="caseForm.upperRange"/> -->
              <money v-model="caseForm.upperRange" v-bind="money" class="el-input__inner" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Fim da negociação" prop="deadline">
              <el-date-picker
                v-model="dispute.expirationDate"
                :clearable="false"
                type="date" />
            </el-form-item>
          </el-col>
          <el-col v-if="dispute.lastOffer && (dispute.status === 'ACCEPTED' || dispute.status === 'CHECKOUT')" :span="24">
            <el-form-item label="Valor do acordo" prop="deal">
              <money v-model="dispute.lastOffer.boundary" v-bind="money" class="el-input__inner" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="Classificação" prop="classification">
              <el-select v-model="dispute.classification.name" placeholder="Selecione">
                 <el-option
                   v-for="item in options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
                 </el-option>
               </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="Descrição" prop="description">
              <el-input v-model="dispute.description" type="textarea" rows="4" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCaseDialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="editCase">Editar dados</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="editRoleDialogVisible"
      title="Alterar dados da Contraparte"
      width="40%">
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="personRules"
        label-position="top"
        @submit.native.prevent="editRole">
        <el-form-item label="Nome" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item v-show="partyRoles.party == true" label="CPF" prop="documentNumber">
          <the-mask v-model="roleForm.documentNumber" :mask="['###.###.###-##']" class="el-input__inner" />
        </el-form-item>
        <el-form-item v-show="partyRoles.legal == true" label="CNPJ" prop="documentNumber">
          <the-mask v-model="roleForm.documentNumber" :mask="['##.###.###/####-##']" class="el-input__inner" />
        </el-form-item>
      </el-form>
      <el-form
        v-show="partyRoles.lawyer == true"
        ref="oabForm"
        :model="oabForm"
        :rules="oabRules"
        label-position="top">
        <div class="case-overview-view__oab-form">
          <el-form-item class="oab" label="OAB" prop="oab">
            <el-input v-model="oabForm.oab" />
          </el-form-item>
          <el-form-item class="state" label="Estado" prop="state">
            <el-select v-model="oabForm.state" placeholder="">
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
        <ul class="case-overview-view__list" style="margin-top: -10px">
          <li v-for="(oab, index) in roleForm.oabs">
            <img src="@/assets/icons/ic-check.svg">
            {{ oab.number }} {{ oab.state }}
            <a href="#" @click.prevent="removeOab({disputeId: dispute.id, id: oab.id}, roleForm.oabs, index)">
              <img src="@/assets/icons/ic-error.svg">
            </a>
          </li>
        </ul>
      </el-form>
      <el-form
        ref="phoneForm"
        :model="phoneForm"
        :rules="phoneRules"
        label-position="top">
        <el-form-item label="Telefone" prop="phone">
          <el-input v-mask="['(##) ####-####', '(##) #####-####']" v-model="phoneForm.phone">
            <el-button slot="append" @click="addPhone(roleForm.personId, roleForm.phones)">
              <jus-icon icon="add-white" />
            </el-button>
          </el-input>
        </el-form-item>
        <ul class="case-overview-view__list">
          <li v-for="(phone, index) in roleForm.phones">
            <img src="@/assets/icons/ic-check.svg">
            {{ phone.number }}
            <a href="#" @click.prevent="removePhone({disputeId: dispute.id, id: phone.id}, roleForm.phones, index)">
              <img src="@/assets/icons/ic-error.svg">
            </a>
          </li>
        </ul>
      </el-form>
      <el-form
        ref="emailForm"
        :model="emailForm"
        :rules="emailRules"
        label-position="top">
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="emailForm.email">
            <el-button slot="append" @click="addEmail(roleForm.personId, roleForm.emails)">
              <jus-icon icon="add-white" />
            </el-button>
          </el-input>
        </el-form-item>
        <ul class="case-overview-view__list">
          <li v-for="(email, index) in roleForm.emails">
            <img src="@/assets/icons/ic-check.svg">
            {{ email.address }}
            <a href="#" @click.prevent="removeEmail({disputeId: dispute.id, id: email.id}, roleForm.emails, index)">
              <img src="@/assets/icons/ic-error.svg">
            </a>
          </li>
        </ul>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click.prevent="editRole(roleForm.personId, roleForm.name, roleForm.documentNumber)">Editar dados</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { TheMask } from 'vue-the-mask'
import { Money } from 'v-money'
import { mask } from 'vue-the-mask'

export default {
  name: 'CaseOverview',
  components: { TheMask, Money },
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
    activePersonId: {
      default: null,
      type: Number
    }
  },
  data () {
    var validatePhone = (rule, value, callback) => {
      if (value && value.length > 13) {
        callback()
      } else callback(new Error('Insira um telefone válido'))
    }
    return {
      active: this.activePersonId,
      partyRoles: {
        legal: false,
        party: false,
        lawyer: false
      },
      emailForm: { email: '' },
      phoneForm: { phone: '' },
      oabForm: { oab: '', state: '' },
      emailRules: { email: [
        { required: true, message: 'Campo obrigatório', trigger: 'change' },
        { type: 'email', required: true, message: 'Insira um e-mail válido', trigger: 'change' }
      ] },
      phoneRules: { phone: [
        { required: true, message: 'Campo obrigatório', trigger: 'change' },
        { validator: validatePhone, trigger: 'change' }
      ] },
      oabRules: {
        oab: [{ required: true, message: 'Campo obrigatório', trigger: 'change' }],
        state: [{ required: true, message: 'Campo obrigatório', trigger: 'change' }]
      },
      // personRules: {
      //   name: [
      //     { required: true, message: 'Campo obrigatório', trigger: 'change' }
      //   ],
      //   documentNumber: [
      //     { required: true, message: 'Campo obrigatório', trigger: 'change' },
      //     // { validator: validadeDocument, trigger: 'change' }
      //   ]
      // },
      caseForm: {
        upperRange: ''
      },
      caseRules: {

      },
      roleForm: {
        name: '',
        documentNumber: '',
        oabs: '',
        emails: '',
        phones: ''
      },
      roleRules: {},
      emailDialogVisible: false,
      phoneDialogVisible: false,
      editCaseDialogVisible: false,
      editRoleDialogVisible: false,
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        precision: 0
      }
    }
  },
  computed: {
    disputeRolesSort () {
      if (this.dispute.disputeRoles) {
        let sortedArray = this.dispute.disputeRoles.slice(0)
        return sortedArray.sort((a, b) => {
          if (a.party === b.party) {
            return (a.roles[0] > b.roles[0]) ? -1 : (a.roles[0] < b.roles[0]) ? 1 : 0
          } else {
            return (a.party < b.party) ? -1 : 1
          }
        })
      } return []
    },
    // strategies () {
    //   return this.$store.state.strategyModule.list
    // },
    // campaigns () {
    //   return this.$store.state.campaignModule.list
    // }
  },
  watch: {
    editCaseDialogVisible (value) {
      if (value) {
        this.caseForm.upperRange = this.dispute.upperRange.boundary
      }
    }
  },
  methods: {
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
      } else { // if (role.party === ‘CLAIMANT’)
        if (role.roles[0] === 'PARTY') {
          return 'Parte contrária'
        } else if (role.roles[0] === 'LAWYER') {
          return 'Advogado da parte'
        } else {
          return role.person.name
        }
      }
    },
    handleChange (val) {setPerson
      if (val) {
        this.active = val
      } else {
        this.active = null
      }
      this.$emit('update:activePersonId', this.active)
    },
    addEmail (personId, emails) {
      this.$refs['emailForm'].validate(valid => {
        if (valid) {
          this.$store.dispatch('createEmail', {
            personId: personId,
            address: this.emailForm.email
          }).then(response => {
            emails.push({ id: response.id, address: response.address })
            this.emailForm.email = ''
            setTimeout(function () {
              this.$emit('case:refresh')
            }.bind(this), 1000)
          })
        }
      })
    },
    addPhone (personId, phones) {
      this.$refs['phoneForm'].validate(valid => {
        if (valid) {
          this.$store.dispatch('createPhone', {
            personId: personId,
            number: this.phoneForm.phone.match(/\d+/g).join([])
          }).then(response => {
            phones.push({ id: response.id, number: response.number })
            this.phoneForm.phone = ''
            setTimeout(function () {
              this.$emit('case:refresh')
            }.bind(this), 1000)
          })
        }
      })
    },
    addOab (personId, oabs) {
      this.$refs['oabForm'].validate(valid => {
        if (valid) {
          this.$store.dispatch('addOab', {
            oab: this.oabForm.oab,
            state: this.oabForm.state,
            personId: personId
          }).then(response => {
            oabs.push({ id: response.id, number: response.number, state: response.state })
            this.oabForm.oab = ''
            this.oabForm.state = ''
            setTimeout(function () {
              this.$emit('case:refresh')
            }.bind(this), 1000)
          })
        }
      })
    },
    removeEmail (emailBody, list, index) {
      this.$confirm('Tem certeza que deseja realizar esta ação?', 'Atenção!', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'error'
      }).then(() => {
        this.$delete(list, index)
        this.$store.dispatch('removeEmail', emailBody).then(() => {
          let self = this
          setTimeout(function () {
            self.$emit('case:refresh')
          }, 1000)
        })
      })
    },
    removePhone (phoneBody, list, index) {
      this.$confirm('Tem certeza que deseja realizar esta ação?', 'Atenção!', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'error'
      }).then(() => {
        this.$delete(list, index)
        this.$store.dispatch('removePhone', phoneBody).then(() => {
          let self = this
          setTimeout(function () {
            self.$emit('case:refresh')
          }, 1000)
        })
      })
    },
    removeOab (oabBody, list, index) {
      this.$confirm('Tem certeza que deseja realizar esta ação?', 'Atenção!', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'error'
      }).then(() => {
        this.$delete(list, index)
        this.$store.dispatch('removeOab', oabBody).then(() => {
          let self = this
          setTimeout(function () {
            self.$emit('case:refresh')
          }, 1000)
        })
      })
    },
    editCase () {

    },
    openRoleDialog (role) {
      this.editRoleDialogVisible = true
      var roles = role.roles
      var party = role.party
      this.roleForm.personId = role.person.id
      this.roleForm.name = role.person.name
      this.roleForm.documentNumber = role.person.documentNumber
      this.roleForm.oabs = role.oabs
      this.roleForm.emails = role.person.emails
      this.roleForm.phones = role.person.phones
      this.roleForm.oabs = role.person.oabs
      this.oabForm.state = ''
      this.partyRoles.legal = false
      this.partyRoles.party = false
      this.partyRoles.lawyer = false
      if (roles.includes('LAWYER') === true) {
        this.partyRoles.lawyer = true
      }
      if ((roles.includes('NEGOTIATOR') === true) || (roles.includes('PARTY') === true && party.includes('CLAIMANT') === true)) {
        this.partyRoles.party = true
      }
      if (roles.includes('PARTY') === true && party.includes('RESPONDENT') === true) {
        this.partyRoles.legal = true
      }
    },
    editRole (personId, name, documentNumber) {
      this.$store.dispatch('editRole', {
        personId: personId,
        name: name,
        documentNumber: documentNumber
      }).then(responde => {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Arquivo em formato inválido.',
          type: 'success'
        })
        this.editRoleDialogVisible = false
        this.$emit('case:refresh')
      }).catch(error => {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Arquivo em formato inválido.',
          // type: 'dounger' (error)
        })
      })
    },
    removeRole () {

    }
  }
}
</script>

<style lang="scss">
.case-overview-view {
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
    *:last-child {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    a {
      line-height: 15px;
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
    img {
      float: right;
      width: 16px;
    }
    ul {
      margin-top: 6px;
      padding-left: 17px;
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
    display: flex;
    align-items: center;
    span:first-child {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    span:last-child {
      margin: 0 6px;
      min-width: 10px;
    }
  }
  &__list {
    margin: 20 0px;
    padding-left: 2px;
    li {
      margin-top: 12px;
      list-style: none;
      :first-child {
        margin-right: 10px;
      }
      :last-child {
        vertical-align: text-top;
        float: right;
      }
    }
  }
  &__oab-form {
    display: flex;
    width: 100%;
    .oab {
      flex: 1;
    }
    .state {
      margin-left: 16px;
      width: 120px;
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
}
</style>
