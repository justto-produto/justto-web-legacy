<template lang="html">
  <div class="dispute-overview-view">
    <el-collapse value="1">
      <el-collapse-item v-loading="loading" title="Informações gerais" name="1">
        <div class="dispute-overview-view__info-line">
          <span class="title">Nº do Processo:</span>
          <span>{{ dispute.code }}</span>
        </div>
        <div class="dispute-overview-view__info-line">
          <span class="title">Campanha:</span>
          <span v-if="dispute.campaign">{{ dispute.campaign.name }}</span>
        </div>
        <div class="dispute-overview-view__info-line">
          <span class="title">Estratégia:</span>
          <span v-if="dispute.strategy">{{ dispute.strategy.name }}</span>
        </div>
        <div class="dispute-overview-view__info-line">
          <span class="title">Status:</span>
          <span>{{ $t('occurrence.type.' + dispute.status) | capitalize }}</span>
        </div>
        <div class="dispute-overview-view__info-line">
          <span class="title">Alçada máxima:</span>
          <span v-if="dispute.upperRange">{{ dispute.upperRange.boundary | currency }}</span>
          <span v-else>{{ 0 | currency }}</span>
        </div>
        <div class="dispute-overview-view__info-line">
          <span class="title">Contraproposta:</span>
          <span v-if="dispute.lastCounterOffer">{{ dispute.lastCounterOffer.boundary | currency }}</span>
          <span v-else>{{ 0 | currency }}</span>
        </div>
        <div
          v-if="dispute.status === 'ACCEPTED' || dispute.status === 'CHECKOUT' || dispute.status === 'SETTLED'"
          class="dispute-overview-view__info-line">
          <span class="title">Valor do acordo:</span>
          <span v-if="dispute.dealValue">{{ dispute.dealValue.boundary | currency }}</span>
          <span v-else>{{ 0 | currency }}</span>
        </div>
        <div class="dispute-overview-view__info-line">
          <span class="title">Valor proposto:</span>
          <span v-if="dispute.lastOffer">{{ dispute.lastOffer.boundary | currency }}</span>
        </div>
        <div class="dispute-overview-view__info-line">
          <span class="title">Fim da negociação:</span>
          <span>{{ dispute.expirationDate | moment('DD/MM/YY') }}</span>
        </div>
        <div class="dispute-overview-view__info-line">
          <span class="title">Descrição:</span>
          <span>{{ dispute.description }}</span>
        </div>
        <div class="dispute-overview-view__actions">
          <el-button type="primary" @click="openDisputeDialog()" data-testid="edit-dispute">Editar</el-button>
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
        data-testid="expand-party"
        v-for="role in disputeRolesSort"
        :key="role.person.id"
        :name="JSON.stringify({id: role.person.id, name: role.person.name})">
        <template slot="title">
          <div class="dispute-overview-view__name">
            {{ role.person.name }}
          </div>
        </template>
        <!-- <div class="dispute-overview-view__info-line">
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
        <div v-show="role.person.documentNumber" class="dispute-overview-view__info-line">
          <span class="title">CPF:</span>
          <span>{{ role.person.documentNumber }}</span>
        </div>
        <div class="dispute-overview-view__info-line">
          Função:
          <span>{{ buildTitle(role) }}</span>
        </div>
        <div v-show="role.person.phones.length" class="dispute-overview-view__info-line">
          Telefone(s):
        </div>
        <div v-show="role.person.phones.length" class="dispute-overview-view__info-list">
          <ul>
            <li v-for="phone in role.person.phones" :key="phone.id">
              {{ phone.number }}
            </li>
          </ul>
        </div>
        <div v-show="role.person.emails.length" class="dispute-overview-view__info-line">
          E-mail(s):
        </div>
        <div v-show="role.person.emails.length" class="dispute-overview-view__info-list">
          <ul>
            <li v-for="email in role.person.emails" :key="email.id">
              {{ email.address }}
            </li>
          </ul>
        </div>
        <div v-show="role.person.oabs.length" class="dispute-overview-view__info-line">
          OAB(s):
        </div>
        <div v-show="role.person.oabs.length" class="dispute-overview-view__info-list">
          <ul>
            <li v-for="oab in role.person.oabs" :key="oab.id">
              {{ oab.number }}
              <span v-if="oab.state">-</span>
              {{ oab.state }}
            </li>
          </ul>
        </div>
        <div v-if="buildTitle(role) !== 'Negociador'" class="dispute-overview-view__actions">
          <el-button plain @click="removeRole(role)">Excluir</el-button>
          <el-button type="primary" @click="openRoleDialog(role)" data-testid="edit-part">Editar</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog
      :visible.sync="editDisputeDialogVisible"
      title="Editar informações gerais"
      width="30%">
      <el-form
        ref="disputeForm"
        :model="disputeForm"
        :rules="disputeRules"
        label-position="top"
        @submit.native.prevent="editDispute">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Alçada máxima" prop="boundary">
              <money v-model="disputeForm.upperRange.boundary" v-bind="money" class="el-input__inner" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Fim da negociação" prop="deadline">
              <el-date-picker
                v-model="disputeForm.expirationDate"
                :clearable="false"
                type="date" />
            </el-form-item>
          </el-col>
          <el-col v-if="dispute.status == 'ACCEPTED' || dispute.status == 'CHECKOUT'" :span="24">
            <el-form-item label="Valor do acordo" prop="deal">
              <money v-model="disputeForm.lastOffer.boundary" v-bind="money" class="el-input__inner" />
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
        <el-button @click="editDisputeDialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="editDispute(disputeForm)" data-testid="confirm-edit-data">Editar dados</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="editRoleDialogVisible"
      width="40%">
      <span slot="title" class="el-dialog__title">
        Alterar dados de {{ roleForm.title }}
      </span>
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="personRules"
        label-position="top">
        <el-form-item label="Nome" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item v-show="partyRoles.party === true" label="CPF" prop="documentNumber">
          <the-mask v-model="roleForm.documentNumber" :mask="['###.###.###-##']" class="el-input__inner" />
        </el-form-item>
        <el-form-item v-show="partyRoles.legal === true" label="CNPJ" prop="documentNumber">
          <the-mask v-model="roleForm.documentNumber" :mask="['##.###.###/####-##']" class="el-input__inner" />
        </el-form-item>
      </el-form>
      <el-form
        v-show="partyRoles.lawyer === true"
        ref="oabForm"
        :model="oabForm"
        :rules="oabRules"
        label-position="top">
        <div class="dispute-overview-view__oab-form">
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
        <ul class="dispute-overview-view__list" style="margin-top: -10px">
          <li v-for="(oab, index) in roleForm.oabs" :key="oab.id">
            <img src="@/assets/icons/ic-check.svg">
            {{ oab.number }} {{ oab.state }}
            <a href="#" @click.prevent="removeOab({ disputeId: dispute.id, id: oab.id }, roleForm.oabs, index)">
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
        <ul class="dispute-overview-view__list">
          <li v-for="(phone, index) in roleForm.phones" :key="phone.id">
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
          <el-input v-model="emailForm.email" data-testid="input-email">
            <el-button slot="append" @click="addEmail(roleForm.personId, roleForm.emails)" data-testid="add-email">
              <jus-icon icon="add-white" />
            </el-button>
          </el-input>
        </el-form-item>
        <ul class="dispute-overview-view__list">
          <li v-for="(email, index) in roleForm.emails" :key="email.id">
            <img src="@/assets/icons/ic-check.svg">
            {{ email.address }}
            <a href="#" @click.prevent="removeEmail({ disputeId: dispute.id, id: email.id }, roleForm.emails, index)">
              <img src="@/assets/icons/ic-error.svg">
            </a>
          </li>
        </ul>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click.prevent="editRole(roleForm.personId, roleForm.name, roleForm.documentNumber)" data-testid="edit-data-part">Editar dados</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Money } from 'v-money'
import { mask, TheMask } from 'vue-the-mask'

export default {
  name: 'DisputeOverview',
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
    activePerson: {
      default: () => {},
      type: Object
    }
  },
  data () {
    var validateName = (rule, value, callback) => {
      if (value && value.length > 2) {
        callback()
      } else {
        callback(new Error('Nome precisa conter mais de 3 caracteres.'))
      }
    }
    var validatePhone = (rule, value, callback) => {
      if (value) {
        if (value && value.length > 13) {
          callback()
        } else callback(new Error('Insira um telefone válido.'))
      } else {
        callback()
      }
    }
    return {
      active: this.activePerson.id,
      partyRoles: {
        legal: false,
        party: false,
        lawyer: false
      },
      emailForm: { email: '' },
      phoneForm: { phone: '' },
      oabForm: { oab: '', state: '' },
      emailRules: { email: [
        { required: true, message: 'Campo obrigatório', trigger: 'submit' },
        { type: 'email', required: true, message: 'Insira um e-mail válido', trigger: 'submit' }
      ] },
      phoneRules: { phone: [
        { required: true, message: 'Campo obrigatório', trigger: 'submit' },
        { validator: validatePhone, trigger: 'submit' }
      ] },
      oabRules: {
        oab: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        state: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      },
      personRules: {
        name: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validateName, message: 'Nome precisa conter mais de 3 caracteres.', trigger: 'change' }
        ]
      },
      disputeForm: {
        disputeId: '',
        upperRange: { boundary: '', id: '' },
        lastOffer: { boundary: '', id: '' },
        expirationDate: '',
        description: ''
      },
      disputeRules: {

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
      editDisputeDialogVisible: false,
      editRoleDialogVisible: false,
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
        let sortedArray = this.dispute.disputeRoles.slice(0)
        return sortedArray.sort((a, b) => {
          if (a.party === b.party) {
            return (a.roles[0] > b.roles[0]) ? -1 : (a.roles[0] < b.roles[0]) ? 1 : 0
          } else {
            return (a.party < b.party) ? -1 : 1
          }
        })
      } return []
    }
  },
  watch: {
    activePerson (value) {
      if (Object.entries(value).length === 0) {
        this.$refs.roleCollapse.activeNames = []
      }
    }
  },
  methods: {
    openDisputeDialog () {
      this.editDisputeDialogVisible = true
      this.disputeForm.disputeId = this.dispute.id
      this.disputeForm.upperRange.boundary = parseFloat(this.dispute.upperRange.boundary)
      this.disputeForm.upperRange.id = this.dispute.upperRange.id
      this.disputeForm.expirationDate = this.dispute.expirationDate
      this.disputeForm.description = this.dispute.description
      if (this.dispute.lastOffer) {
        this.disputeForm.lastOffer.boundary = parseFloat(this.dispute.lastOffer.boundary)
        this.disputeForm.lastOffer.id = this.dispute.lastOffer.id
      }
    },
    editDispute (disputeForm) {
      this.$store.dispatch('editDispute', disputeForm)
        .then(response => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Os dados foram alterados com sucesso.',
            type: 'success'
          })
          setTimeout(function () {
            this.$emit('dispute:refresh')
          }.bind(this), 1000)
          this.editDisputeDialogVisible = false
        }).catch(() => {
          this.$jusNotification({ type: 'error' })
        })
    },
    removeDispute () {
      this.$confirm('Tem certeza que deseja excluir esta disputa? Esta ação é irreversível.', 'Atenção!', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'error'
      }).then(() => {
        this.$store.dispatch('removeDispute', this.dispute.id).then(() => {
          this.$router.push('/management')
        })
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
          return role.person.name
        }
      }
    },
    handleChange (val) {
      if (val) {
        this.active = JSON.parse(val)
      } else {
        this.active = {}
      }
      this.$emit('update:activePerson', this.active)
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
              this.$emit('dispute:refresh')
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
              this.$emit('dispute:refresh')
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
              this.$emit('dispute:refresh')
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
          setTimeout(function () {
            this.$emit('dispute:refresh')
          }.bind(this), 1000)
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
          setTimeout(function () {
            this.$emit('dispute:refresh')
          }.bind(this), 1000)
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
          setTimeout(function () {
            this.$emit('dispute:refresh')
          }.bind(this), 1000)
        })
      })
    },
    openRoleDialog (role) {
      this.editRoleDialogVisible = true
      var roles = role.roles
      var party = role.party
      this.roleForm.personId = role.person.id
      this.roleForm.title = this.buildTitle(role)
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
      if (name && name.length > 2) {
        this.$store.dispatch('editRole', {
          personId: personId,
          name: name,
          documentNumber: documentNumber
        }).then(responde => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Os dados foram alterados com sucesso.',
            type: 'success'
          })
          setTimeout(function () {
            this.$emit('dispute:refresh')
          }.bind(this), 1000)
          this.editRoleDialogVisible = false
        }).catch(() => {
          this.$jusNotification({ type: 'error' })
        })
      } else {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Nome precisa conter mais de 3 caracteres.',
          type: 'warning'
        })
      }
    },
    removeRole (role) {
      this.$confirm('Tem certeza que deseja realizar esta ação?', 'Atenção!', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'error'
      }).then(() => {
        this.$store.dispatch('removeRole', {
          disputeId: role.disputeId,
          roleId: role.id
        }).then(response => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Pessoa removida com sucesso.',
            type: 'success'
          })
          setTimeout(function () {
            this.$emit('dispute:refresh')
          }.bind(this), 1000)
        }).catch(() => this.$jusNotification({ type: 'error' }))
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
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
