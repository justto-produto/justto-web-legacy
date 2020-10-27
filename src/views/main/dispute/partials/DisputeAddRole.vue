<template lang="html">
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="dialogVisible"
    title="Cadastrar parte"
    width="40%"
  >
    <el-form
      ref="newRole"
      v-loading="searchLoading || registerLoading"
      :model="newRole"
      :rules="newRoleRules"
      label-position="top"
    >
      <el-form-item label="Parte">
        <el-select
          v-model="newRole.party"
          clearable
          @change="clearDocuments"
        >
          <el-option
            v-for="(party, index) in roleParty"
            :key="`${index}-${party}`"
            :label="$t('fields.' + party)"
            :value="party"
          />
        </el-select>
      </el-form-item>
      <div v-if="!secondStep">
        <div class="dispute-add-role__search">
          <el-form-item
            v-if="['claimantParty', 'respondentParty'].includes(newRole.party)"
            label="CPF/CNPJ"
            prop="searchDocumentNumber"
          >
            <el-input
              v-model="newRole.searchDocumentNumber"
              v-mask="['###.###.###-##', '##.###.###/####-##']"
              @keyup.enter.native="searchPerson"
            />
          </el-form-item>
          <el-row
            v-else-if="newRole.party"
            :gutter="20"
          >
            <el-col :span="12">
              <el-form-item
                class="oab"
                label="OAB"
                prop="searchOabNumber"
              >
                <el-input
                  v-model="newRole.searchOabNumber"
                  @keyup.enter.native="searchPerson"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                class="state"
                label="Estado"
                prop="searchOabState"
              >
                <el-select
                  v-model="newRole.searchOabState"
                  placeholder=""
                  filterable
                >
                  <el-option
                    v-for="state in $store.state.brazilianStates"
                    :key="state.value"
                    :label="state.value"
                    :value="state.value"
                    @keyup.enter.native="searchPerson"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-button
            v-if="newRole.party"
            type="primary"
            @click="searchPerson"
          >
            <jus-icon icon="right" />
          </el-button>
        </div>
        <el-button
          v-if="newRole.party"
          type="text"
          @click="continueWithoutDocument"
        >
          Continuar sem documento
        </el-button>
      </div>
      <div v-else>
        <el-form-item
          label="CPF/CNPJ"
          prop="documentNumber"
        >
          <el-input
            v-model="newRole.documentNumber"
            v-mask="['###.###.###-##', '##.###.###/####-##']"
            :disabled="disableDocumentNumber"
          />
        </el-form-item>
        <el-form-item
          label="Nome"
          prop="name"
        >
          <el-input v-model="newRole.name" />
        </el-form-item>
        <el-form-item
          label="Telefone"
          prop="phone"
        >
          <el-input
            v-model="newRole.phone"
            v-mask="['(##) ####-####', '(##) #####-####']"
            @keydown.enter.native="addPhone()"
            @blur="addPhone()"
          >
            <el-button
              slot="append"
              @click="addPhone()"
            >
              <jus-icon icon="add-white" />
            </el-button>
          </el-input>
        </el-form-item>
        <el-table
          :data="phonesList"
          :show-header="false"
          fit
          class="el-table--list"
        >
          <el-table-column>
            <template slot-scope="scope">
              {{ scope.row.number | phoneNumber }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="right"
            width="48px"
            class-name="visible"
          >
            <template slot-scope="scope">
              <a
                href="#"
                @click.prevent="removePhone(scope.$index)"
              >
                <jus-icon icon="trash" />
              </a>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item
          label="E-mail"
          prop="email"
        >
          <el-input
            v-model="newRole.email"
            data-testid="input-email"
            @keydown.enter.native="addEmail()"
            @blur="addEmail()"
          >
            <el-button
              slot="append"
              data-testid="add-email"
              @click="addEmail()"
            >
              <jus-icon icon="add-white" />
            </el-button>
          </el-input>
        </el-form-item>
        <el-table
          :data="emailsList"
          :show-header="false"
          fit
          class="el-table--list"
        >
          <el-table-column>
            <template slot-scope="scope">
              <span>
                {{ scope.row.address }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="right"
            width="48px"
            class-name="visible"
          >
            <template slot-scope="scope">
              <a
                href="#"
                @click.prevent="removeEmail(scope.$index)"
              >
                <jus-icon icon="trash" />
              </a>
            </template>
          </el-table-column>
        </el-table>
        <div class="dispute-overview-view__oab-form">
          <el-form-item
            class="oab"
            label="OAB"
            prop="oab"
          >
            <el-input
              v-model="newRole.oab"
              @input="$forceUpdate()"
              @keydown.enter.native="addOab(newRole.personId, newRole.oabs)"
              @blur="addOab(newRole.personId, newRole.oabs)"
            />
          </el-form-item>
          <el-form-item
            class="state"
            label="Estado"
            prop="state"
          >
            <el-select
              v-model="newRole.state"
              :default-first-option="true"
              autocomplete="off"
              placeholder=""
              filterable
              @input="$forceUpdate()"
              @keydown.enter.native="addOab(newRole.personId, newRole.oabs)"
              @change="addOab(newRole.personId, newRole.oabs)"
              @blur="addOab(newRole.personId, newRole.oabs)"
            >
              <el-option
                v-for="state in $store.state.brazilianStates"
                :key="state.value"
                :label="state.value"
                :value="state.value"
              />
            </el-select>
          </el-form-item>
          <el-button
            class="button"
            type="primary"
            @click="addOab(newRole.personId, newRole.oabs)"
          >
            <jus-icon icon="add-white" />
          </el-button>
        </div>
        <el-table
          :data="newRole.oabs"
          :show-header="false"
          fit
          class="el-table--list"
        >
          <el-table-column>
            <div slot-scope="scope">
              {{ scope.row.number }} - {{ scope.row.state }}
            </div>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="right"
            width="48px"
            class-name="visible"
          >
            <div slot-scope="scope">
              <a
                href="#"
                @click.prevent="removeOab(scope.$index)"
              >
                <jus-icon icon="trash" />
              </a>
            </div>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <span slot="footer">
      <el-button
        plain
        @click="dialogVisible = false"
      >
        Cancelar
      </el-button>
      <el-button
        :loading="registerLoading"
        :disabled="!secondStep"
        type="primary"
        @click="registerRole"
      >
        Cadastrar
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { validateName, validateDocument, validatePhone } from '@/utils/validations'

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
  data() {
    return {
      secondStep: false,
      searchLoading: false,
      registerLoading: false,
      disableDocumentNumber: false,
      emailsList: [],
      phonesList: [],
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
        phone: [{ validator: validatePhone, message: 'Telefone inválido', trigger: 'submit' }],
        email: [{ type: 'email', message: 'E-mail inválido', trigger: 'submit' }],
        documentNumber: [{ validator: validateDocument, message: 'CPF/CNPJ inválido', trigger: 'submit' }],
        searchDocumentNumber: [
          { validator: validateDocument, message: 'CPF/CNPJ inválido', trigger: 'submit' },
          { required: true, message: 'Campo obrigatório', trigger: 'submit' }
        ],
        searchOabNumber: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        searchOabState: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    },
    roleParty: () => ['claimantParty', 'claimantLawyer', 'respondentParty', 'respondentLawyer'],
    partySelected() {
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
    dialogVisible() {
      this.secondStep = false
      this.disableDocumentNumber = false
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
    continueWithoutDocument() {
      this.newRole.documentNumber = this.newRole.searchDocumentNumber
      this.newRole.oab = this.newRole.searchOabNumber
      this.newRole.state = this.newRole.searchOabState
      this.secondStep = true
    },
    searchPerson() {
      let isValid = true
      let fields
      let searchAction
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
        this.emailsList = []
        this.phonesList = []
        const params = {}
        if (this.newRole.searchDocumentNumber) {
          if (this.documentNumbers.includes(this.newRole.searchDocumentNumber.replace(/\D/g, ''))) {
            setTimeout(function() {
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
            searchAction = 'searchPersonByDocument'
          }
          this.newRole.documentNumber = this.newRole.searchDocumentNumber
          this.disableDocumentNumber = true
        } else if (this.newRole.searchOabNumber && this.newRole.searchOabState) {
          if (this.oabs.includes(this.newRole.searchOabNumber.replace(/\D/g, '') + this.newRole.searchOabState)) {
            setTimeout(function() {
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
            searchAction = 'searchPersonByOab'
          }
        }
        this.$store.dispatch(searchAction, params)
          .then(response => {
            if (response) {
              const self = this
              this.$confirm('Já existem informações no sistema da parte a ser cadastrada. Deseja utilizar os dados existentes?', 'Parte encontrada no sistema', {
                confirmButtonText: 'Sim, utilizar',
                cancelButtonText: 'Não',
                type: 'info',
                cancelButtonClass: 'is-plain'
              }).then(() => {
                self.newRole.name = response.name
                if (response.documentNumber) self.newRole.documentNumber = this.$options.filters.cpfCnpj(response.documentNumber)
                self.newRole.oabs = response.oabs
                self.emailsList = response.emails
                self.phonesList = response.phones
              })
              this.newRole.personId = response.id
            }
            this.secondStep = true
          })
          .catch(error => {
            console.error(error)
          }).finally(() => {
            if (this.newRole.searchOabNumber && this.newRole.searchOabState) {
              this.newRole.oabs.push({
                number: this.newRole.searchOabNumber,
                state: this.newRole.searchOabState
              })
            }
            setTimeout(function() {
              this.searchLoading = false
            }.bind(this), 500)
          })
      }
    },
    clearDocuments() {
      this.newRole.searchDocumentNumber = ''
      this.newRole.documentNumber = ''
      this.newRole.searchOabState = ''
      this.newRole.searchOabNumber = ''
      this.newRole.name = ''
      this.secondStep = false
      this.disableDocumentNumber = false
    },
    addOab(personId, oabs) {
      let isValid = true
      this.$refs.newRole.validateField(['oab', 'state'], errorMessage => {
        if (errorMessage || !this.newRole.oab || !this.newRole.state) isValid = false
      })
      if (isValid) {
        const self = this
        this.newRole.oab = this.newRole.oab.replace(/ /g, '')
        this.newRole.personId = personId
        this.newRole.oabs = (oabs || [])
        const isDuplicated = this.newRole.oabs.findIndex(o => o.number === self.newRole.oab && o.state === self.newRole.state)
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
    removeOab(index) {
      this.newRole.oabs.splice(index, 1)
    },
    addPhone() {
      let isValid = true
      this.$refs.newRole.validateField('phone', errorMessage => {
        if (errorMessage || !this.newRole.phone) isValid = false
      })
      if (isValid) {
        this.newRole.phone = this.newRole.phone.replace(/ /g, '').replace(/\D/g, '')
        const isDuplicated = this.phonesList.findIndex(p => {
          const number = p.number.startsWith('55') ? p.number.replace('55', '') : p.number
          return number === this.newRole.phone
        })
        if (isDuplicated < 0) this.phonesList.push({ number: this.newRole.phone, isMain: true })
        this.newRole.phone = ''
      }
    },
    removePhone(index) {
      this.phonesList.splice(index, 1)
    },
    addEmail() {
      let isValid = true
      this.newRole.email = this.newRole.email.trim()
      this.$refs.newRole.validateField('email', errorMessage => {
        if (errorMessage || !this.newRole.email) isValid = false
      })
      if (isValid) {
        const self = this
        const isDuplicated = this.emailsList.findIndex(e => e.address === self.newRole.email)
        if (isDuplicated < 0) this.emailsList.push({ address: this.newRole.email })
        this.newRole.email = ''
      }
    },
    removeEmail(index) {
      this.emailsList.splice(index, 1)
    },
    registerRole() {
      let isValid = true
      this.$refs.newRole.validateField(['documentNumber', 'name'], errorMessage => {
        if (errorMessage) isValid = false
      })
      if (isValid) {
        this.registerLoading = true
        const role = {}
        const disputeId = this.disputeId
        role.main = true
        if (this.newRole.documentNumber) role.documentNumber = this.newRole.documentNumber.replace(/\D/g, '')
        if (this.newRole.oabs) role.oabs = this.newRole.oabs
        if (this.emailsList) role.emails = this.emailsList
        if (this.phonesList) role.phones = this.phonesList
        if (this.newRole.name) role.name = this.newRole.name
        if (this.newRole.personId) role.personId = this.newRole.personId
        role.party = this.newRole.party.startsWith('respondent') ? 'RESPONDENT' : 'CLAIMANT'
        role.roles = [this.newRole.party.endsWith('Party') ? 'PARTY' : 'LAWYER']
        this.$store.dispatch('newDisputeRole', { role, disputeId }).then(response => {
          // SEGMENT TRACK
          this.$jusSegment('Cadastrar nova parte', { description: `Nome: ${role.name}, documento: ${role.documentNumber}` })
          this.dialogVisible = false
          this.$jusNotification({
            title: 'Yay!',
            message: 'Nova parte cadastrada com sucesso.',
            type: 'success'
          })
          this.$store.dispatch('getDispute', this.disputeId)
          this.$confirm('Deseja iniciar o engajamento para esta parte?', 'Atenção!', {
            confirmButtonText: 'Engajar',
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
        }).catch(error => {
          this.$jusNotification({ error })
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
      margin-left: 10px;
      margin-top: 8px;
      padding: 9px 20px;
    }
  }
}
</style>
