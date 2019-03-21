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
        :name="role.person.id"
        :title="buildTitle(role)">
        <div class="case-overview-view__info-line">
          <span>Status:</span>
          <span v-if="true">Offline <jus-status-dot type="danger"/></span>
          <span v-else>Online <jus-status-dot type="success"/></span>
        </div>
        <div class="case-overview-view__info-line">
          <span class="title">Nome:</span>
          <span>{{ role.person.name }}</span>
        </div>
        <div class="case-overview-view__info-line">
          <span>E-mails:</span>
          <a href="" @click.prevent="openEmailDialog(role.person.id)">
            <el-tooltip content="Adicionar email">
              <jus-icon icon="add" />
            </el-tooltip>
          </a>
        </div>
        <div class="case-overview-view__info-list">
          <div v-for="email in role.person.emails" :key="email.id">
            {{ email.address }}
            <a href="" @click.prevent="removeEmail({personId: role.person.id, id: email.id})">
              <el-tooltip content="Remover email">
                <jus-icon icon="trash" />
              </el-tooltip>
            </a>
          </div>
        </div>
        <div class="case-overview-view__info-line">
          <span>Telefones:</span>
          <a href="" @click.prevent="openPhoneDialog(role.person.id)">
            <el-tooltip content="Adicionar telefone">
              <jus-icon icon="add" />
            </el-tooltip>
          </a>
        </div>
        <div class="case-overview-view__info-list">
          <div v-for="phone in role.person.phones" :key="phone.id">
            {{ phone.number }}
            <a href="" @click.prevent="removePhone({personId: role.person.id, id: phone.id})">
              <el-tooltip content="Remover telefone">
                <jus-icon icon="trash" />
              </el-tooltip>
            </a>
          </div>
        </div>
        <div v-for="oab in role.person.oabs" :key="oab.id" class="case-overview-view__info-line">
          <span class="title">OAB:</span>
          <span>{{ oab.number }}</span>
        </div>
        <div v-show="role.person.documentNumber" class="case-overview-view__info-line">
          <span class="title">CPF:</span>
          <span>{{ role.person.documentNumber }}</span>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog
      :visible.sync="emailDialogVisible"
      title="Adicionar e-mail"
      width="30%">
      <el-form
        ref="newEmail"
        :model="newEmailBody"
        :rules="newEmailRules"
        label-position="top"
        @submit.native.prevent="addEmail">
        <el-form-item label="Email" prop="address">
          <el-input v-model="newEmailBody.address" type="email" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="emailDialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="addEmail">Adicionar</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="phoneDialogVisible"
      title="Adicionar telefone"
      width="30%">
      <el-form
        ref="newPhone"
        :model="newPhoneBody"
        :rules="newPhoneRules"
        label-position="top"
        @submit.native.prevent="addPhone">
        <el-form-item label="Telefone" prop="number">
          <el-input
            v-mask="['(##) ####-####', '(##) #####-####']"
            v-model="newPhoneBody.number"
            name="number"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="phoneDialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="addPhone">Adicionar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask'

export default {
  name: 'CaseOverview',
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
      newEmailBody: {},
      newEmailRules: { address: [
        { required: true, message: 'Campo obrigatório', trigger: 'submit' },
        { type: 'email', required: true, message: 'Insira um e-mail válido', trigger: 'submit' }
      ] },
      newPhoneBody: {},
      newPhoneRules: { number: [
        { required: true, message: 'Campo obrigatório', trigger: 'submit' },
        { validator: validatePhone, trigger: 'submit' }
      ] },
      emailDialogVisible: false,
      phoneDialogVisible: false
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
      } else { // if (role.party === 'CLAIMANT')
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
        this.active = val
      } else {
        this.active = null
      }
      this.$emit('update:activePersonId', this.active)
    },
    openEmailDialog (personId) {
      this.newEmailBody = {}
      this.newEmailBody.personId = personId
      this.emailDialogVisible = true
    },
    addEmail () {
      this.$refs['newEmail'].validate(valid => {
        if (valid) {
          this.$store.dispatch('createEmail', this.newEmailBody).then(response => {
            this.emailDialogVisible = false
            let self = this
            setTimeout(function () {
              self.$emit('case:refresh')
            }, 1000)
            this.$jusNotification({
              title: 'Yay!',
              message: 'Email adicionado com sucesso.',
              type: 'success'
            })
          }).catch(erro => {
            this.$jusNotification({
              title: 'Ops!',
              message: 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.',
              type: 'error'
            })
          })
        }
      })
    },
    openPhoneDialog (personId) {
      this.newPhoneBody = {}
      this.newPhoneBody.personId = personId
      this.phoneDialogVisible = true
    },
    addPhone () {
      this.$refs['newPhone'].validate(valid => {
        if (valid) {
          this.$store.dispatch('createPhone', {
            personId: this.newPhoneBody.personId,
            number: this.newPhoneBody.number.match(/\d+/g).join([])
          }).then(response => {
            this.phoneDialogVisible = false
            let self = this
            setTimeout(function () {
              self.$emit('case:refresh')
            }, 1000)
            this.$jusNotification({
              title: 'Yay!',
              message: 'Telefone adicionado com sucesso.',
              type: 'success'
            })
          }).catch(erro => {
            this.$jusNotification({
              title: 'Ops!',
              message: 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.',
              type: 'error'
            })
          })
        }
      })
    },
    removeEmail (emailBody) {
      this.$confirm('Tem certeza que deseja realizar esta ação?', 'Atenção!', {
        confirmButtonText: 'Remover',
        cancelButtonText: 'Cancelar',
        type: 'error'
      }).then(() => {
        this.$store.dispatch('removeEmail', emailBody).then(() => {
          let self = this
          setTimeout(function () {
            self.$emit('case:refresh')
          }, 1000)
          this.$jusNotification({
            title: 'Yay!',
            message: 'Email removido com sucesso.',
            type: 'success'
          })
        })
      })
    },
    removePhone (phoneBody) {
      this.$confirm('Tem certeza que deseja realizar esta ação?', 'Atenção!', {
        confirmButtonText: 'Remover',
        cancelButtonText: 'Cancelar',
        type: 'error'
      }).then(() => {
        this.$store.dispatch('removePhone', phoneBody).then(() => {
          let self = this
          setTimeout(function () {
            self.$emit('case:refresh')
          }, 1000)
          this.$jusNotification({
            title: 'Yay!',
            message: 'Telefone removido com sucesso.',
            type: 'success'
          })
        })
      })
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
  &__info-list {
    margin-top: 10px;
    font-weight: 500;
    img {
      float: right;
      width: 16px;
    }
  }
}
</style>
