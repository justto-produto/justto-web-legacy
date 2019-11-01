<template lang="html">
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    title="Cadastrar ator"
    width="50%">
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
        <el-form-item v-if="['claimantParty', 'respondentParty'].includes(newRole.party)" label="CPF/CNPJ" prop="documentNumber">
          <el-input v-mask="['###.###.###-##', '##.###.###/####-##']" v-model="newRole.documentNumber" @keyup.enter.native="searchPerson" />
        </el-form-item>
        <el-row v-else-if="newRole.party" :gutter="20">
          <el-col :span="12">
            <el-form-item class="oab" label="OAB" prop="oabNumber">
              <el-input v-model="newRole.oabNumber" @keyup.enter.native="searchPerson" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="state" label="Estado" prop="oabState">
              <el-select v-model="newRole.oabState" placeholder="UF">
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
          <el-input v-mask="['###.###.###-##', '##.###.###/####-##']" v-model="newRole.documentNumber" />
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
            <el-select v-model="newRole.state" placeholder="">
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
      <el-button :disabled="!secondStep || registerLoading" type="primary" data-testid="confirm-edit-data" @click="registerRole">Cadastrar</el-button>
    </span>
  </el-dialog>
</template>

<script>
import CPFCNPJ from 'cpf_cnpj'

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
      secondStep: false,
      searchLoading: false,
      registerLoading: false,
      newRole: {
        name: ''
      },
      newRoleRules: {
        name: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validateName, message: 'Nome precisa conter mais de 3 caracteres', trigger: 'submit' }
        ],
        phone: [
          { validator: validatePhone, message: 'Telefone inválido', trigger: 'submit' }
        ],
        email: [
          { type: 'email', message: 'E-mail inválido', trigger: 'submit' }
        ],
        documentNumber: [
          { validator: validateCpf, message: 'CPF/CNPJ inválido.', trigger: 'submit' },
          { required: true, message: 'Campo obrigatório', trigger: 'submit' }
        ],
        oabNumber: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        oabState: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
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
        name: ''
      }
    }
  },
  methods: {
    searchPerson () {
      let isValid = true
      let fields
      if (this.partySelected === true) {
        fields = ['documentNumber']
      } else if (this.partySelected === false) {
        fields = ['oabNumber', 'oabState']
      } else {
        return
      }
      this.$refs.newRole.validateField(fields, errorMessage => {
        if (errorMessage) isValid = false
      })
      if (isValid) {
        this.newRole.oabs = []
        this.newRole.emails = []
        this.newRole.phones = []
        let params = {}
        if (this.newRole.oabNumber) params.oabNumber = this.newRole.oabNumber.replace(/\D/g, '')
        if (this.newRole.oabState) params.oabState = this.newRole.oabState
        if (this.newRole.documentNumber) params.document = this.newRole.documentNumber.replace(/\D/g, '')
        this.searchLoading = true
        this.$store.dispatch('searchPerson', params)
          .then(response => {
            this.newRole.name = response.name
            this.newRole.personId = response.id
            this.newRole.documentNumber = response.documentNumber
            this.newRole.oabs = response.oabs
            this.newRole.emails = response.emails
            this.newRole.phones = response.phones
            this.secondStep = true
          })
          .catch(error => {
            if (error.response.status === 400) this.secondStep = true
            console.error(error)
          }).finally(() => {
            setTimeout(function () {
              this.searchLoading = false
            }.bind(this), 500)
          })
      }
    },
    clearDocuments () {
      delete this.newRole.documentNumber
      delete this.newRole.oabNumber
      delete this.newRole.oabState
      delete this.newRole.name
      this.secondStep = false
    },
    addOab () {
      let isValid = true
      this.$refs.newRole.validateField(['oab', 'state'], errorMessage => {
        if (errorMessage) isValid = false
      })
      if (isValid) {
        this.newRole.oabs.push({
          number: this.newRole.oab,
          state: this.newRole.state
        })
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
        this.newRole.phones.push({
          number: this.newRole.phone
        })
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
        this.newRole.emails.push({
          address: this.newRole.email
        })
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
            message: 'Novo ator cadastrado com sucesso.',
            type: 'success'
          })
          this.$store.dispatch('enrichPerson', response.personId)
          this.$store.dispatch('restartDisputeRoleEngagement', {
            disputeId: this.disputeId,
            disputeRoleId: response.id
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
