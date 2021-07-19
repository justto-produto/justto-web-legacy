<template>
  <!-- Dialog para edição de parte -->
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="40%"
  >
    <span
      slot="title"
      class="el-dialog__title"
    >
      Alterar dados de {{ party.title }}
    </span>
    <!-- <el-alert
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
    </el-alert> -->
    <el-form
      ref="party"
      v-loading="loading"
      :model="party"
      :rules="roleRules"
      label-position="top"
      @submit.native.prevent
    >
      <el-form-item
        label="Nome"
        prop="name"
      >
        <el-input
          v-model="party.name"
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
              v-model="party.documentNumber"
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
              v-model="party.birthday"
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
        v-if="party.roles && party.roles.includes('LAWYER')"
        class="dispute-overview-view__oab-form"
      >
        <el-form-item
          class="oab"
          label="OAB"
          prop="oab"
        >
          <el-input
            v-model="party.oab"
            @keydown.enter.native="addOab(party.personId, party.oabs)"
            @blur="addOab(party.personId, party.oabs)"
          />
        </el-form-item>
        <el-form-item
          class="state"
          label="Estado"
          prop="state"
        >
          <el-select
            v-model="party.state"
            :default-first-option="true"
            autocomplete="off"
            placeholder=""
            filterable
            @keydown.enter.native="addOab(party.personId, party.oabs)"
            @change="addOab(party.personId, party.oabs)"
            @blur="addOab(party.personId, party.oabs)"
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
          @click="addOab(party.personId, party.oabs)"
        >
          <i class="el-icon-plus icon--white" />
        </el-button>
      </div>
      <el-table
        v-if="party.roles && party.roles.includes('LAWYER')"
        :data="party.oabs"
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
          v-model="party.phone"
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
        :data="party.phones"
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
          v-model="party.email"
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
        :data="party.emails"
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
        :data="party.bankAccounts"
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
        :loading="loading"
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
import { validateName, validateDocument, validatePhone } from '@/utils/validations'
export default {
  props: {
    party: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      roleRules: {
        name: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validateName, message: 'Nome precisa conter mais de 3 caracteres', trigger: 'blur' }
        ],
        phone: [
          { required: false, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validatePhone, message: 'Telefone inválido', trigger: 'submit' }
        ],
        email: [
          { required: false, message: 'Campo obrigatório', trigger: 'submit' },
          { type: 'email', message: 'E-mail inválido', trigger: 'submit' }
        ],
        oab: [{ required: false, message: 'Campo obrigatório', trigger: 'submit' }],
        state: [{ required: false, message: 'Campo obrigatório', trigger: 'submit' }]
      }
    }
  },
  computed: {
    canEditBirthday() {
      return this.roleForm.party === 'CLAIMANT' && this.roleForm.personType === 'NATURAL' && this.roleForm.roles && (this.roleForm.roles.includes('LAWYER') || this.roleForm.roles.includes('PARTY'))
    }
  },
  methods: {
    validateDocumentNumber() {
      if (this.documentNumberHasChanged) {
        return [{ validator: validateDocument, message: 'CPF/CNPJ inválido.', trigger: 'submit' }]
      }
      return []
    }
  }
}
</script>

<style scoped>

</style>
