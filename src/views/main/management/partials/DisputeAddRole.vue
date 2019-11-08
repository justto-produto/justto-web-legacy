<template lang="html">
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    title="Cadastrar parte"
    width="40%">
    <el-form
      v-loading="searchLoading || registerLoading"
      ref="newRole"
      :model="newRole"
      :rules="newRoleRules"
      label-position="top">
      <el-form-item label="Parte">
        <el-select v-model="newRole.party" clearable @change="clearDocuments">
          <el-option
            v-for="(party, index) in roleParty"
            :key="`${index}-${party}`"
            :label="$t('fields.' + party)"
            :value="party" />
        </el-select>
      </el-form-item>
      <div v-if="!secondStep" class="dispute-add-role__search">
        <el-form-item v-if="['claimantParty', 'respondentParty'].includes(newRole.party)" label="CPF/CNPJ" prop="searchDocumentNumber">
          <el-input v-mask="['###.###.###-##', '##.###.###/####-##']" v-model="newRole.searchDocumentNumber" />
        </el-form-item>
        <el-row v-else-if="newRole.party" :gutter="20">
          <el-col :span="12">
            <el-form-item class="oab" label="OAB" prop="searchOabNumber">
              <el-input v-model="newRole.searchOabNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="state" label="Estado" prop="searchOabState">
              <el-select v-model="newRole.searchOabState" placeholder="" filterable>
                <el-option
                  v-for="(state, index) in $store.state.statesList"
                  :key="`${index}-${state}`"
                  :label="state"
                  :value="state" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button v-if="newRole.party" type="primary" @click="searchPerson">
          <jus-icon icon="right" />
        </el-button>
      </div>
      <div v-else>
        <el-form-item label="CPF/CNPJ" prop="documentNumber">
          <el-input v-mask="['###.###.###-##', '##.###.###/####-##']" v-model="newRole.documentNumber" :disabled="disableDocumentNumber"/>
        </el-form-item>
        <el-form-item label="Nome" prop="name">
          <el-input v-model="newRole.name" />
        </el-form-item>
        <el-form-item label="Telefone" prop="phone">
          <el-input v-mask="['(##) ####-####', '(##) #####-####']" v-model="newRole.phone">
            <el-button slot="append" @click="addPhone()">
              <jus-icon icon="add-white" />
            </el-button>
          </el-input>
        </el-form-item>
        <el-table
          :data="newRole.phones"
          :show-header="false"
          fit
          class="el-table--list">
          <el-table-column>
            <template slot-scope="scope">
              {{ scope.row.number | phoneMask }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="right"
            width="48px"
            class-name="visible">
            <template slot-scope="scope">
              <a href="#" @click.prevent="removePhone(scope.$index)">
                <jus-icon icon="trash" />
              </a>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="newRole.email" data-testid="input-email">
            <el-button slot="append" data-testid="add-email" @click="addEmail()">
              <jus-icon icon="add-white" />
            </el-button>
          </el-input>
        </el-form-item>
        <el-table
          :data="newRole.emails"
          :show-header="false"
          fit
          class="el-table--list">
          <el-table-column>
            <template slot-scope="scope">
              {{ scope.row.address }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="right"
            width="48px"
            class-name="visible">
            <template slot-scope="scope">
              <a href="#" @click.prevent="removeEmail(scope.$index)">
                <jus-icon icon="trash" />
              </a>
            </template>
          </el-table-column>
        </el-table>
        <div class="dispute-overview-view__oab-form">
          <el-form-item class="oab" label="OAB" prop="oab">
            <el-input v-model="newRole.oab" />
          </el-form-item>
          <el-form-item class="state" label="Estado" prop="state">
            <el-select v-model="newRole.state" placeholder="" filterable>
              <el-option
                v-for="(state, index) in $store.state.statesList"
                :key="`${index}-${state}`"
                :label="state"
                :value="state" />
            </el-select>
          </el-form-item>
          <el-button class="button" type="primary" @click="addOab(newRole.personId, newRole.oabs)">
            <jus-icon icon="add-white" />
          </el-button>
        </div>
        <el-table
          :data="newRole.oabs"
          :show-header="false"
          fit
          class="el-table--list">
          <el-table-column>
            <template slot-scope="scope">
              {{ scope.row.number }} - {{ scope.row.state }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="right"
            width="48px"
            class-name="visible">
            <template slot-scope="scope">
              <a href="#" @click.prevent="removeOab(scope.$index)">
                <jus-icon icon="trash" />
              </a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <span slot="footer">
      <el-button plain @click="dialogVisible = false">Cancelar</el-button>
      <el-button :disabled="!secondStep || registerLoading" type="primary" @click="registerRole">Cadastrar</el-button>
    </span>
  </el-dialog>
</template>

<script>
import CPFCNPJ from 'cpf_cnpj'
const validateName = (rule, value, callback) => {
  if (value && value.length > 2) {
    callback()
  } else {
    callback(new Error())
  }
}
const validateCpf = (rule, value, callback) => {
  if (!value) callback()
  else if (value.length === 14) {
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

export default {
  name: 'DisputeAddRole',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    disputeId: {
      type: Number,
      default: 0
    },
    documentNumbers: {
      type: Array,
      default: () => []
    },
    oabs: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      secondStep: false,
      searchLoading: false,
      registerLoading: false,
      disableDocumentNumber: false,
      newRole: {
        name: '',
        phone: '',
        email: '',
        documentNumber: '',
        searchDocumentNumber: '',
        searchOabNumber: '',
        searchOabState: ''
      },
      newRoleRules: {
        name: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validateName, message: 'Nome precisa conter mais de 3 caracteres', trigger: 'submit' }
        ],
        phone: [
          { validator: validatePhone, message: 'Telefone inválido', trigger: 'submit' },
          { required: true, message: 'Campo obrigatório', trigger: 'submit' }
        ],
        email: [
          { type: 'email', message: 'E-mail inválido', trigger: 'submit' },
          { required: true, message: 'Campo obrigatório', trigger: 'submit' }
        ],
        oab: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' }
        ],
        state: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' }
        ],
        documentNumber: [
          { validator: validateCpf, message: 'CPF/CNPJ inválido.', trigger: 'submit' }
        ],
        searchDocumentNumber: [
          { validator: validateCpf, message: 'CPF/CNPJ inválido.', trigger: 'submit' },
          { required: true, message: 'Campo obrigatório', trigger: 'submit' }
        ],
        searchOabNumber: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        searchOabState: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      }
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    },
    roleParty: () => ['claimantParty', 'claimantLawyer', 'respondentParty', 'respondentLawyer'],
    partySelected () {
      if (this.newRole.party) {
        if (['claimantParty', 'respondentParty'].includes(this.newRole.party)) {
          return true
        }
        return false
      }
      return undefined
    }
  },
  watch: {
    dialogVisible () {
      this.secondStep = false
      this.newRole = {
        name: '',
        searchDocumentNumber: '',
        documentNumber: '',
        searchOabState: '',
        searchOabNumber: ''
      }
    }
  },
  methods: {
    searchPerson () {
      let isValid = true
      let fields
      if (this.partySelected === true) {
        fields = ['searchDocumentNumber']
      } else if (this.partySelected === false) {
        fields = ['searchOabNumber', 'searchOabState']
      } else {
        return
      }
      this.$refs.newRole.validateField(fields, errorMessage => {
        if (errorMessage) isValid = false
      })
      if (isValid) {
        this.searchLoading = true
        this.disableDocumentNumber = false
        this.newRole.oabs = []
        this.newRole.emails = []
        this.newRole.phones = []
        let params = {}
        if (this.newRole.searchDocumentNumber) {
          if (this.documentNumbers.includes(this.newRole.searchDocumentNumber.replace(/\D/g, ''))) {
            setTimeout(function () {
              this.$jusNotification({
                title: 'Ops!',
                message: 'Parte já cadastrada nesta disputa.',
                type: 'warning'
              })
              this.searchLoading = false
            }.bind(this), 300)
            return 0
          } else {
            params.document = this.newRole.searchDocumentNumber.replace(/\D/g, '')
          }
          this.newRole.documentNumber = this.newRole.searchDocumentNumber
          this.disableDocumentNumber = true
        } else if (this.newRole.searchOabNumber && this.newRole.searchOabState) {
          if (this.oabs.includes(this.newRole.searchOabNumber.replace(/\D/g, '') + this.newRole.searchOabState)) {
            setTimeout(function () {
              this.$jusNotification({
                title: 'Ops!',
                message: 'Parte já cadastrada nesta disputa.',
                type: 'warning'
              })
              this.searchLoading = false
            }.bind(this), 300)
            return 0
          } else {
            params.oabState = this.newRole.searchOabState
            params.oabNumber = this.newRole.searchOabNumber.replace(/\D/g, '')
          }
        }
        this.$store.dispatch('searchPerson', params)
          .then(response => {
            let self = this
            this.$confirm('Já existe uma parte cadastrada com o documento acima. Deseja utilizar os dados existentes?', 'Parte já existente no sistema', {
              confirmButtonText: 'Sim, utilizar',
              cancelButtonText: 'Não, preencher novamente',
              type: 'info',
              cancelButtonClass: 'is-plain'
            }).then(() => {
              self.newRole.name = response.name
              if (response.documentNumber) self.newRole.documentNumber = this.$options.filters.cpfCnpjMask(response.documentNumber)
              self.newRole.oabs = response.oabs
              self.newRole.emails = response.emails
              self.newRole.phones = response.phones
            })
            this.newRole.personId = response.id
            this.secondStep = true
          })
          .catch(error => {
            if (error.response.status === 400) this.secondStep = true
            console.error(error)
          }).finally(() => {
            if (this.newRole.searchOabNumber && this.newRole.searchOabState) {
              this.newRole.oabs.push({
                number: this.newRole.searchOabNumber,
                state: this.newRole.searchOabState
              })
            }
            setTimeout(function () {
              this.searchLoading = false
            }.bind(this), 500)
          })
      }
    },
    clearDocuments () {
      this.newRole.searchDocumentNumber = ''
      this.newRole.documentNumber = ''
      this.newRole.searchOabState = ''
      this.newRole.searchOabNumber = ''
      this.newRole.name = ''
      this.secondStep = false
    },
    addOab () {
      let isValid = true
      this.$refs.newRole.validateField(['oab', 'state'], errorMessage => {
        if (errorMessage) isValid = false
      })
      if (isValid) {
        let self = this
        let isDuplicated = this.newRole.oabs.findIndex(o => o.number === self.newRole.oab && o.state === self.newRole.state)
        if (isDuplicated < 0) {
          this.newRole.oabs.push({
            number: this.newRole.oab,
            state: this.newRole.state
          })
        }
        this.newRole.oab = ''
        this.newRole.state = ''
      }
    },
    removeOab (index) {
      this.newRole.oabs.splice(index, 1)
    },
    addPhone () {
      let isValid = true
      this.$refs.newRole.validateField('phone', errorMessage => {
        if (errorMessage) isValid = false
      })
      if (isValid) {
        let self = this
        let isDuplicated = this.newRole.phones.findIndex(p => {
          const number = p.number.startsWith('55') ? p.number.replace('55', '') : p.number
          return number.replace(/\D/g, '') === self.newRole.phone.replace(/\D/g, '')
        })
        if (isDuplicated < 0) this.newRole.phones.push({ number: this.newRole.phone })
        this.newRole.phone = ''
      }
    },
    removePhone (index) {
      this.newRole.phones.splice(index, 1)
    },
    addEmail () {
      let isValid = true
      this.$refs.newRole.validateField('email', errorMessage => {
        if (errorMessage) isValid = false
      })
      if (isValid) {
        let self = this
        let isDuplicated = this.newRole.emails.findIndex(e => e.address === self.newRole.email)
        if (isDuplicated < 0) this.newRole.emails.push({ address: this.newRole.email })
        this.newRole.email = ''
      }
    },
    removeEmail (index) {
      this.newRole.emails.splice(index, 1)
    },
    registerRole () {
      let isValid = true
      this.$refs.newRole.validateField(['documentNumber', 'name'], errorMessage => {
        if (errorMessage) isValid = false
      })
      if (isValid) {
        this.registerLoading = true
        let role = {}
        let disputeId = this.disputeId
        role.main = true
        if (this.newRole.documentNumber) role.documentNumber = this.newRole.documentNumber.replace(/\D/g, '')
        if (this.newRole.oabs) role.oabs = this.newRole.oabs
        if (this.newRole.emails) role.emails = this.newRole.emails
        if (this.newRole.phones) role.phones = this.newRole.phones
        if (this.newRole.name) role.name = this.newRole.name
        if (this.newRole.personId) role.personId = this.newRole.personId
        role.party = this.newRole.party.startsWith('respondent') ? 'RESPONDENT' : 'CLAIMANT'
        role.roles = [this.newRole.party.endsWith('Party') ? 'PARTY' : 'LAWYER']
        this.$store.dispatch('newDisputeRole', { role, disputeId }).then(response => {
          this.dialogVisible = false
          this.$jusNotification({
            title: 'Yay!',
            message: 'Nova parte cadastrada com sucesso.',
            type: 'success'
          })
          this.$store.dispatch('getDispute', this.disputeId)
          this.$store.dispatch('enrichPerson', response.personId)
          this.$confirm('Deseja já iniciar o engajamento para esta parte?', 'Atenção!', {
            confirmButtonText: 'Eengajar',
            cancelButtonText: 'Não',
            type: 'info',
            cancelButtonClass: 'is-plain'
          }).then(() => {
            this.$store.dispatch('restartDisputeRoleEngagement', {
              disputeId: this.disputeId,
              disputeRoleId: response.id
            }).then(() => {
              this.$jusNotification({
                title: 'Yay!',
                message: 'Engajamento realizado com sucesso.',
                type: 'success'
              })
            })
          })
        }).catch(() => {
          this.$jusNotification({ type: 'error' })
        }).finally(() => {
          this.registerLoading = false
        })
      }
    }
  }
}
</script>

<style lang="scss">
.dispute-add-role {
  &__search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-form-item, .el-row {
      width: 100%;
    }
    .el-button {
      margin-left: 20px;
      margin-top: 8px;
      padding: 9px 20px;
    }
  }
}
</style>
