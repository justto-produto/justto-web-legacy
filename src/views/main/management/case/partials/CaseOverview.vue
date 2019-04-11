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
          <el-button plain>Excluir</el-button>
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
        :name="role.person.id"
        :title="buildTitle(role)">
        <div class="case-overview-view__info-line">
          <span>Status:</span>
          <el-popover
            placement="top-end"
            width="220"
            trigger="hover">
            <div class="case-overview-view__location">
              <span>Localização</span>
              São José dos Campos, SP
              <span>Aparelho</span>
              Iphone 7
              <span>OS</span>
              12.0
            </div>
            <span slot="reference">
              Online <jus-status-dot type="success"/>
            </span>
          </el-popover>
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
            <a href="" @click.prevent="removeEmail({personId: role.person.id, id: email.id, disputeId: dispute.id})">
              <el-tooltip content="Excluir email">
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
            <a href="" @click.prevent="removePhone({personId: role.person.id, id: phone.id, disputeId: dispute.id})">
              <el-tooltip content="Excluir telefone">
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
    <el-dialog
      :visible.sync="editCaseDialogVisible"
      title="Editar informações gerais"
      width="50%">
      <el-form
        ref="newPhone"
        :model="caseForm"
        :rules="caseRules"
        label-position="top"
        @submit.native.prevent="editCase">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Campanha" prop="campaign">
              <el-select
                v-model="caseForm.campaignId"
                placeholder="Selecione uma opção">
                <el-option
                  v-for="campaign in campaigns"
                  :key="campaign.id"
                  :value="campaign.id"
                  :label="campaign.name"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Estratégia" prop="strategy">
              <el-select
                v-model="caseForm.strategyId"
                placeholder="Selecione uma opção">
                <el-option
                  v-for="strategy in strategies"
                  :key="strategy.id"
                  :value="strategy.id"
                  :label="strategy.name"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Alçada máxima" prop="boundary">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Fim da negociação" prop="deadline">
              <el-date-picker
                v-model="dispute.expirationDate"
                :clearable="false"
                type="date"
                placeholder="Pick a day" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Valor do acordo" prop="deal">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Classificação" prop="classification">
              <el-input v-model="dispute.classification" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Estratégia" prop="strategy">
              <el-input v-model="dispute.description" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCaseDialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="editCase">Editar dados</el-button>
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
      caseForm: {
        campaignId: 0,
        strategyId: 0
      },
      caseRules: {},
      emailDialogVisible: false,
      phoneDialogVisible: false,
      editCaseDialogVisible: false
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
    strategies () {
      return this.$store.state.strategyModule.list
    },
    campaigns () {
      return this.$store.state.campaignModule.list
    }
  },
  watch: {
    editCaseDialogVisible (value) {
      if (value) {
        this.caseForm.campaignId = this.dispute.campaign.id
        this.caseForm.strategyId = this.dispute.strategy.id
      }
    }
  },
  beforeMount () {
    this.$store.dispatch('getCampaigns')
    this.$store.dispatch('getStrategies')
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
        confirmButtonText: 'Excluir',
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
        confirmButtonText: 'Excluir',
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
    },
    editCase () {

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
    margin-top: 10px;
    font-weight: 500;
    img {
      float: right;
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
