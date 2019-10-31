<template lang="html">
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    title="Cadastrar ator"
    width="50%">
    <el-form
      ref="newRole"
      :model="newRole"
      :rules="newRoleRules"
      label-position="top">
      <el-form-item label="Parte">
        <el-select v-model="newRole.party" @change="clearDocuments">
          <el-option
            v-for="(party, index) in roleParty"
            :key="`${index}-${party}`"
            :label="$t('fields.' + party)"
            :value="party" />
        </el-select>
      </el-form-item>
      <div v-if="!secondStep">
        <el-form-item v-if="['claimantParty', 'respondentParty'].includes(newRole.party)" label="CPF/CNPJ">
          <el-input v-mask="['###.###.###-##', '##.###.###/####-##']" v-model="newRole.documentNumber" />
        </el-form-item>
        <el-row v-else-if="newRole.party" :gutter="20">
          <el-col :span="18">
            <el-form-item class="oab" label="OAB" prop="oab">
              <el-input v-model="newRole.oabNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="state" label="Estado" prop="state">
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
      </div>
      <div v-if="secondStep">
        <el-form-item label="Nome">
          <el-input v-model="newRole.name" />
        </el-form-item>
        <el-form-item label="CPF/CNPJ">
          <el-input v-mask="['###.###.###-##', '##.###.###/####-##']" v-model="newRole.documentNumber" />
        </el-form-item>
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
      </div>
    </el-form>
    <span slot="footer">
      <el-button plain @click="dialogVisible = false">Cancelar</el-button>
      <el-button v-if="secondStep" type="primary" data-testid="confirm-edit-data" @click="">Cadastrar</el-button>
      <el-button v-else :disabled="!validToSearch" type="primary" @click="searchPerson">Buscar</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'DisputeAddRole',
  props: {
    visible: {
      type: Boolean,
      default: false
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
      newRole: {},
      newRoleRules: {
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
    validToSearch () {
      if (this.newRole.party) {
        if (['claimantParty', 'respondentParty'].includes(this.newRole.party)) {
          if (this.newRole.documentNumber) return true
          return false
        } else {
          if (this.newRole.oabNumber && this.newRole.oabState) return true
          return false
        }
      }
      return false
    },
    roleParty: () => ['claimantParty', 'claimantLawyer', 'respondentParty', 'respondentLawyer']
  },
  watch: {
    dialogVisible () {
      this.newRole = {}
    }
  },
  methods: {
    searchPerson () {
      let params = {}
      if (this.newRole.oabNumber) params.oabNumber = this.newRole.oabNumber.replace(/\D/g,'')
      if (this.newRole.oabState) params.oabState = this.newRole.oabState
      if (this.newRole.documentNumber) params.document = this.newRole.documentNumber.replace(/\D/g,'')
      this.$store.dispatch('searchPerson', params)
        .then(response => {
          this.newRole.name = response.name
          this.secondStep = true
        })
        .catch(error => {
          if (error.response.status === 400) {
            this.secondStep = true
            this.$jusNotification({
              title: 'Não encontrado',
              message: 'Continue o cadastro de um novo ator.',
              type: 'info'
            })
          }
          console.error(error)
        })
    },
    clearDocuments () {
      delete this.newRole.documentNumber
      delete this.newRole.oabNumber
      delete this.newRole.oabState
      this.secondStep = false
    },
    addOab () {
      let isValid = true
      this.$refs.newRole.validateField(['oab', 'state'], errorMessage => {
        if (errorMessage) isValid = false
      })
      if (isValid) {
        if (!this.newRole.oabs) this.newRole.oabs = []
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
        if (!this.newRole.phones) this.newRole.phones = []
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
        if (!this.newRole.emails) this.newRole.emails = []
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
      this.$store.dispatch('newDisputeRole', this.roleForm)
    }
  }
}
</script>
