<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="editRoleDialogVisible"
    width="40%"
  >
    <span
      slot="title"
      class="el-dialog__title"
    >
      Alterar dados de {{ roleForm.title }}
    </span>
    <el-alert
      v-show="editRoleDialogError"
      type="error"
      @close="editRoleDialogError = false"
    >
      <ul>
        <li
          v-for="(error, index) in editRoleDialogErrorList"
          :key="`${index}-${error}`"
        >
          {{ error }}
        </li>
      </ul>
    </el-alert>
    <el-form
      ref="roleForm"
      v-loading="editRoleDialogLoading"
      :model="roleForm"
      :rules="roleRules"
      label-position="top"
      @submit.native.prevent
    >
      <el-form-item
        label="Nome"
        prop="name"
      >
        <el-input
          v-model="roleForm.name"
          autofocus=""
        />
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            :rules="validateDocumentNumber"
            label="CPF/CNPJ"
            prop="documentNumber"
          >
            <el-input
              v-model="roleForm.documentNumber"
              v-mask="['###.###.###-##', '##.###.###/####-##']"
              @change="documentNumberHasChanged = true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="Data de nascimento"
            prop="birthday"
          >
            <el-date-picker
              v-model="roleForm.birthday"
              :disabled="!canEditBirthday"
              :clearable="false"
              format="dd/MM/yyyy"
              type="date"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div
        v-if="roleForm.roles && roleForm.roles.includes('LAWYER')"
        class="dispute-overview-view__oab-form"
      >
        <el-form-item
          class="oab"
          label="OAB"
          prop="oab"
        >
          <el-input
            v-model="roleForm.oab"
            @keydown.enter.native="addOab(roleForm.personId, roleForm.oabs)"
            @blur="addOab(roleForm.personId, roleForm.oabs)"
          />
        </el-form-item>
        <el-form-item
          class="state"
          label="Estado"
          prop="state"
        >
          <el-select
            v-model="roleForm.state"
            :default-first-option="true"
            autocomplete="off"
            placeholder=""
            filterable
            @keydown.enter.native="addOab(roleForm.personId, roleForm.oabs)"
            @change="addOab(roleForm.personId, roleForm.oabs)"
            @blur="addOab(roleForm.personId, roleForm.oabs)"
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
          @click="addOab(roleForm.personId, roleForm.oabs)"
        >
          <i class="el-icon-plus icon--white" />
        </el-button>
      </div>
      <el-table
        v-if="roleForm.roles && roleForm.roles.includes('LAWYER')"
        :data="roleForm.oabs"
        :show-header="false"
        fit
        class="el-table--list"
      >
        <el-table-column>
          <div slot-scope="scope">
            {{ scope.row.number + '-' + scope.row.state || '' }}
          </div>
        </el-table-column>
        <el-table-column
          fixed="right"
          align="right"
          width="48px"
          class-name="visible"
        >
          <template v-slot="scope">
            <a
              href="#"
              @click.prevent="removeOab(scope.$index)"
            >
              <jus-icon icon="trash" />
            </a>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item
        label="Telefone"
        prop="phone"
      >
        <el-input
          v-model="roleForm.phone"
          v-mask="['(##) ####-####', '(##) #####-####']"
          @keydown.enter.native="addPhone()"
          @blur="addPhone()"
        >
          <el-button
            slot="append"
            @click="addPhone()"
          >
            <i class="el-icon-plus icon--white" />
          </el-button>
        </el-input>
      </el-form-item>
      <el-table
        :data="roleForm.phones"
        :show-header="false"
        fit
        class="el-table--list"
      >
        <el-table-column>
          <div slot-scope="scope">
            {{ scope.row.number | phoneNumber }}
          </div>
        </el-table-column>
        <el-table-column
          fixed="right"
          align="right"
          width="114px"
          class-name="visible slot-scope"
        >
          <template v-slot="scope">
            <el-tooltip
              :open-delay="500"
              :content="scope.row.isMain ? 'Este número receberá mensagens automáticas' : 'Este número não recberá mensagens automáticas'"
            >
              <span class="dispute-overview-view__switch-main">
                <jus-icon
                  v-if="scope.row.isMain"
                  icon="phone-active"
                />
                <jus-icon
                  v-else
                  icon="not-main-phone-active"
                />
                <el-switch v-model="scope.row.isMain" />
              </span>
            </el-tooltip>
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
          v-model="roleForm.email"
          data-testid="input-email"
          @keydown.enter.native="addEmail()"
          @blur="addEmail()"
        >
          <el-button
            slot="append"
            data-testid="add-email"
            @click="addEmail()"
          >
            <i class="el-icon-plus icon--white" />
          </el-button>
        </el-input>
      </el-form-item>
      <el-table
        :data="roleForm.emails"
        :show-header="false"
        fit
        class="el-table--list"
      >
        <el-table-column>
          <span slot-scope="scope">
            {{ scope.row.address }}
          </span>
        </el-table-column>
        <el-table-column
          fixed="right"
          align="right"
          width="114px"
          class-name="visible slot-scope"
        >
          <template v-slot="scope">
            <el-tooltip
              :open-delay="500"
              :content="scope.row.isMain ? 'Este e-mail receberá mensagens automáticas' : 'Este e-mail não recberá mensagens automáticas'"
            >
              <span class="dispute-overview-view__switch-main">
                <jus-icon
                  v-if="scope.row.isMain"
                  icon="email-active"
                />
                <jus-icon
                  v-else
                  icon="not-main-email-active"
                />
                <el-switch v-model="scope.row.isMain" />
              </span>
            </el-tooltip>
            <a
              href="#"
              @click.prevent="removeEmail(scope.$index)"
            >
              <jus-icon icon="trash" />
            </a>
          </template>
        </el-table-column>
      </el-table>
      <h4>
        Contas bancárias
        <a
          href="#"
          style="float: right;width: 16px;margin-top: 1px;margin-right: 23px;"
          @click.prevent="openAddBankDialog()"
        >
          <el-tooltip content="Adicionar conta bancária">
            <i class="el-icon-plus icon-white" />
          </el-tooltip>
        </a>
      </h4>
      <el-table
        :data="roleForm.bankAccounts"
        :show-header="false"
        fit
        class="el-table--list"
      >
        <el-table-column>
          <section slot-scope="scope">
            <span>
              {{ scope.row.name }}
            </span>
            <div style="font-size: 12px;">
              {{ scope.row.bank }} | {{ scope.row.agency }} | {{ scope.row.number }}
            </div>
          </section>
        </el-table-column>
        <el-table-column
          fixed="right"
          align="right"
          width="48px"
          class-name="visible"
        >
          <template v-slot="scope">
            <a
              href="#"
              @click.prevent="removeBankData(scope.$index, scope.row.id)"
            >
              <jus-icon icon="trash" />
            </a>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer">
      <el-button
        plain
        @click="editRoleDialogVisible = false"
      >Cancelar</el-button>
      <el-button
        :loading="editRoleDialogLoading"
        type="primary"
        data-testid="edit-data-part"
        @click="editRole"
      >
        Editar dados
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { validateDocument } from '@/utils/validations'

export default {
  props: {
    form: {
      type: Object,
      required: true
    },

    visible: {
      type: Boolean,
      default: false
    },

    loading: {
      type: Boolean,
      default: false
    },

    hasError: {
      type: Boolean,
      default: false
    },

    hasChanged: {
      type: Boolean,
      default: false
    },

    errors: {
      type: Array,
      default: () => []
    },

    rules: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    editRoleDialogVisible: {
      get() {
        return this.visible
      },

      set(visibility) {
        this.$emit('update:visible', visibility)
      }
    },

    editRoleDialogError: {
      get() {
        return this.hasError
      },

      set(hasError) {
        this.$emit('update:hasError', hasError)
      }
    },

    roleForm: {
      get() {
        return this.form
      },

      set(form) {
        this.$emit('update:form', form)
      }
    },

    editRoleDialogErrorList: {
      get() {
        return this.errors
      },

      set(errors) {
        this.$emit('update:errors', errors)
      }
    },

    editRoleDialogLoading: {
      get() {
        return this.loading
      },

      set(loading) {
        this.$emit('update:loading', loading)
      }
    },

    roleRules: {
      get() {
        return this.rules
      },

      set(rules) {
        this.$emit('update:rules', rules)
      }
    },

    documentNumberHasChanged: {
      get() {
        return this.hasChanged
      },

      set(hasChanged) {
        this.$emit('update:hasChanged', hasChanged)
      }
    },

    validateDocumentNumber() {
      if (this.documentNumberHasChanged) {
        return [{ validator: validateDocument, message: 'CPF/CNPJ inválido.', trigger: 'submit' }]
      }
      return []
    },

    canEditBirthday() {
      return this.roleForm.party === 'CLAIMANT' && this.roleForm.personType === 'NATURAL' && this.roleForm.roles && (this.roleForm.roles.includes('LAWYER') || this.roleForm.roles.includes('PARTY'))
    }
  },

  methods: {
    editRole() {
      this.$emit('edit', this.$refs.roleForm)
    },

    addOab(personId, oabs) {
      this.$emit('addOab', { personId, oabs })
    },

    openAddBankDialog() {
      this.$emit('addBankAccount', this.$refs.roleForm)
    },

    clearValidate() {
      if (this.$refs?.roleForm) {
        this.$refs.roleForm.clearValidate()
      }
    },

    validateField(...i) {
      if (this.$refs?.roleForm) {
        this.$refs.roleForm.validateField(...i)
      }
    },

    addPhone() {
      let isValid = true
      this.roleForm.phone = this.roleForm.phone.trim()
      this.$refs.roleForm.validateField('phone', errorMessage => {
        if (errorMessage || !this.roleForm.phone) isValid = false
      })
      if (isValid) {
        const self = this
        this.roleForm.phone = this.roleForm.phone.replace(/ /g, '').replace(/\D/g, '')
        const isDuplicated = this.roleForm.phones.findIndex(p => {
          const number = p.number.startsWith('55') ? p.number.replace('55', '') : p.number
          return number === self.roleForm.phone
        })
        if (isDuplicated < 0) this.roleForm.phones.push({ number: this.roleForm.phone, isMain: true })
        this.roleForm.phone = ''
      }
    },

    addEmail() {
      let isValid = true
      this.roleForm.email = this.roleForm.email.trim()
      this.$refs.roleForm.validateField('email', errorMessage => {
        if (errorMessage || !this.roleForm.email) isValid = false
      })
      if (isValid) {
        const self = this
        const isDuplicated = this.roleForm.emails.findIndex(e => e.address === self.roleForm.email)
        if (isDuplicated < 0) this.roleForm.emails.push({ address: this.roleForm.email, isMain: true })
        this.roleForm.email = ''
      }
    },

    removeBankData(...i) {
      this.$emit('removeBankData', i)
    },

    removePhone(index) {
      this.roleForm.phones.splice(index, 1)
    },

    removeEmail(index) {
      this.roleForm.emails.splice(index, 1)
    }
  }
}
</script>
