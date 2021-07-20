<template>
  <!-- Dialog para edição de parte -->
  <el-dialog
    close-on-click-modal
    :show-close="false"
    :visible.sync="visible"
    width="40%"
    class="party__form"
  >
    <el-form
      v-if="Boolean(party)"
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
        class="flex-row"
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
          style="height: 40px; margin-top: 30px;"
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
        <div class="flex-row">
          <el-input
            v-model="party.phone"
            v-mask="['(##) ####-####', '(##) #####-####']"
            @keydown.enter.native="addPhone()"
            @blur="addPhone()"
          />
          <el-button
            type="primary"
            :plain="false"
            @click="addPhone()"
          >
            <i class="el-icon-plus icon--white" />
          </el-button>
        </div>
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
              style="margin-left: 5px;"
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
        <div class="flex-row">
          <el-input
            v-model="party.email"
            data-testid="input-email"
            @keydown.enter.native="addEmail()"
            @blur="addEmail()"
          />
          <el-button
            type="primary"
            data-testid="add-email"
            @click="addEmail()"
          >
            <i class="el-icon-plus icon--white" />
          </el-button>
        </div>
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
              style="margin-left: 5px;"
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
          @click.prevent="openTabEditBank()"
        >
          <PartyBankAccountDialog
            ref="partyBankAccountDialog"
            @create="handleNewBankAccount"
          >
            <a
              class="bank-accounts__link"
            >
              <i class="el-icon-plus icon-white" />
            </a>
          </PartyBankAccountDialog>
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
        @click="$emit('closeEdit')"
      >
        Cancelar
      </el-button>
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
import { mapActions } from 'vuex'
import { validateName, validateDocument, validatePhone } from '@/utils/validations'
export default {
  components: {
    PartyBankAccountDialog: () => import('@/views/main/negotiation/partials/ticket/overview/tabs/parties/PartyBankAccountDialog.vue')
  },

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
      originalRole: {},
      bankAccountIdstoUnlink: [],
      loading: false,
      documentNumberHasChanged: false,
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
      return this.party.party === 'CLAIMANT' && this.party.personType === 'NATURAL' && this.party.roles && (this.party.roles.includes('LAWYER') || this.party.roles.includes('PARTY'))
    },

    validateDocumentNumber() {
      if (this.documentNumberHasChanged) {
        return [{ validator: validateDocument, message: 'CPF/CNPJ inválido.', trigger: 'submit' }]
      }
      return []
    }
  },

  mounted() {
    this.originalRole = this.party
  },

  methods: {
    ...mapActions([
      'editRole',
      'addPhoneToDisputeRole',
      'addOabToDisputeRole',
      'createTicketRoleBankAccount',
      'getTicketOverviewParty'
    ]),

    openTabEditBank() {
      this.$refs.partyBankAccountDialog.openBankAccountDialog({})
    },

    addPhone() {
      let isValid = true
      this.party.phone = this.party.phone.trim()
      this.$refs.party.validateField('phone', errorMessage => {
        if (errorMessage || !this.party.phone) isValid = false
      })
      if (isValid) {
        const self = this
        this.party.phone = this.party.phone.replace(/ /g, '').replace(/\D/g, '')
        const isDuplicated = this.party.phones.findIndex(p => {
          const number = p.number.startsWith('55') ? p.number.replace('55', '') : p.number
          return number === self.party.phone
        })
        if (isDuplicated < 0) this.party.phones.push({ number: this.party.phone, isMain: true })
        this.party.phone = ''
      }
    },

    removePhone(index) {
      this.party.phones.splice(index, 1)
    },

    addEmail() {
      let isValid = true
      this.party.email = this.party.email.trim()
      this.$refs.party.validateField('email', errorMessage => {
        if (errorMessage || !this.party.email) isValid = false
      })
      if (isValid) {
        const self = this
        const isDuplicated = this.party.emails.findIndex(e => e.address === self.party.email)
        if (isDuplicated < 0) this.party.emails.push({ address: this.party.email, isMain: true })
        this.party.email = ''
      }
    },

    removeEmail(index) {
      this.party.emails.splice(index, 1)
    },

    addOab() {
      let isValid = true
      this.$refs.party.validateField(['oab', 'state'], errorMessage => {
        if (errorMessage || !this.party.oab || !this.party.state) isValid = false
      })
      if (isValid) {
        const self = this
        this.party.oab = this.party.oab.replace(/ /g, '')
        const isDuplicated = this.party.oabs.findIndex(o => o.number === self.party.oab && o.state === self.party.state)
        if (isDuplicated < 0) {
          this.party.oabs.push({
            number: this.party.oab,
            state: this.party.state
          })
        }
        this.party.oab = ''
        this.party.state = ''
      }
    },

    removeOab(index) {
      this.party.oabs.splice(index, 1)
    },

    handleNewBankAccount(model) {
      if (model.account?.type === 'SAVING' && model.associate) {
        this.$refs.savingAccountAlert.open(model)
      } else {
        this.addBankAccount(model)
      }
    },

    addBankAccount({ account, associate }) {
      const { personId } = this.party
      const disputeId = this.$route.params.id

      this.createTicketRoleBankAccount({ disputeId, account, personId }).then(response => {
        if (associate) {
          const baccount = response.bankAccounts.find(baccount => {
            return baccount.agency === account.agency &&
              baccount.document === account.document &&
              baccount.number === account.number &&
              baccount.bank === account.bank &&
              baccount.type === account.type
          })

          this.linkAccount({ bankAccountId: baccount.id, personId, disputeId })
        }

        this.$jusNotification({
          title: 'Yay!',
          dangerouslyUseHTMLString: true,
          message: 'Conta bancária <strong>criada</strong> com sucesso.',
          type: 'success'
        })
      }).catch(err => {
        this.$jusNotification(err)
      }).finally(_ => {
        this.closeBankAccountDialog()
      })
    },

    removeBankData(index, id) {
      this.bankAccountIdstoUnlink.push(id)
      this.party.bankAccounts.splice(index, 1)
    },

    closeBankAccountDialog() {
      this.$refs.partyBankAccountDialog.closeDialog()
    },

    editRole() {
      let isValid = true
      this.$refs.party.validateField(['name', 'documentNumber'], errorMessage => {
        if (errorMessage) isValid = false
      })
      if (isValid) {
        if (this.bankAccountIdstoUnlink.length) {
          this.linkBankAccountLoading = true
          const promise = []
          for (const id of this.bankAccountIdstoUnlink) {
            promise.push(
              this.$store.dispatch('unlinkDisputeBankAccounts', {
                disputeId: this.$route.params.id,
                bankAccountId: id
              })
            )
          }
          Promise.all(promise).then(() => {
            this.editRoleAction()
          }).catch(error => {
            this.$jusNotification({ error })
          }).finally(() => {
            this.linkBankAccountLoading = false
          })
        } else {
          this.editRoleAction()
        }
      }
    },

    editRoleAction() {
      const hasNewBankAccount = this.party.bankAccounts.filter(account => !account.id).length
      delete this.party.personProperties.BIRTHDAY
      const roleToEdit = JSON.parse(JSON.stringify(this.party))
      delete roleToEdit.title
      this.editRoleDialogLoading = true

      const disputeId = this.$route.params.id
      const disputeRole = roleToEdit
      const disputeRoleId = { roleToEdit }
      this.$store.dispatch('editRole', {
        disputeId,
        disputeRole
      }).then(response => {
        // SEGMENT TRACK
        this.$jusSegment('Editar partes da disputa', { description: `Usuário ${roleToEdit.name} alterado` })
        this.$jusNotification({
          title: 'Yay!',
          message: 'Os dados foram alterados com sucesso.',
          type: 'success'
        })
        const roleDataDifference = this.verifyChangedRoleData(this.party, this.originalRole)
        if (roleDataDifference.length) {
          this.$confirm(this.$t('dispute.overview.confirm.restart.engagement.question'), 'Atenção!', {
            confirmButtonText: this.$t('dispute.overview.confirm.restart.engagement.confirm'),
            cancelButtonText: this.$t('dispute.overview.confirm.restart.engagement.cancel'),
            type: 'warning',
            cancelButtonClass: 'is-plain'
          }).then(() => this.$jusNotification({
            title: 'Cuidado!',
            message: this.$t('dispute.notification.will-not-restart'),
            type: 'warning',
            dangerouslyUseHTMLString: true
          })).catch(() => {
            const contacts = []
            for (const contact of roleDataDifference) {
              contacts.push(
                this.$store.dispatch('restartEngagementByContact', {
                  disputeId: this.dispute.id,
                  contact: contact.address || contact.number
                })
              )
            }
            Promise.all(contacts).then(() => {
              this.$jusNotification({
                title: 'Yay!',
                message: this.$t('dispute.notification.restarted'),
                type: 'success'
              })
            })
          })
        }
        if (hasNewBankAccount) {
          this.$confirm('Você adicionou contas bancárias a esta parte. Deseja vincular estas contas a disputa?', 'Atenção', {
            confirmButtonText: 'Vincular',
            cancelButtonText: 'Cancelar',
            type: 'warning',
            cancelButtonClass: 'is-plain'
          }).then(() => {
            const bankAccounts = response.bankAccounts
            const newBankAccounts = bankAccounts.sort((accountA, accountB) => {
              if (accountA.createdAt > accountB.createdAt) {
                return 1
              } else if (accountA.createdAt < accountB.createdAt) {
                return -1
              } else {
                return 0
              }
            }).slice(-hasNewBankAccount).map(ba => ba.id)
            this.disputeBankAccountsIds = ([...this.disputeBankAccountsIds, ...newBankAccounts])
            // this.updateDisputeBankAccounts(newBankAccount.id)
          }).finally(() => {
            this.linkBankAccountLoading = false
          })
        }
        this.editRoleDialogVisible = false
        setTimeout(function() {
          this.$emit('fetch-data')
        }.bind(this), 200)
      }).catch(error => {
        console.error(error)
        if (error.status === 400) {
          this.editRoleDialogError = true
          this.editRoleDialogErrorList.push(error.data.message)
        } else this.$jusNotification({ error })
      }).finally(() => {
        this.getTicketOverviewParty({ disputeId, disputeRoleId })
        this.$emit('closeEdit')
      })
    },

    verifyChangedRoleData(editedRole, originalRole) {
      const changed = {
        newPhones: [],
        newEmails: []
      }
      if (editedRole.phones.length) {
        const mappedPhones = originalRole.phones.map(phone => phone.number)
        changed.newPhones = editedRole.phones.filter(phone => {
          if (!mappedPhones.includes(phone.number)) return phone.number
        })
      }
      if (editedRole.emails.length) {
        const mappedEmails = originalRole.emails.map(email => email.address)
        changed.newEmails = editedRole.emails.filter(email => {
          if (!mappedEmails.includes(email.address)) return email.address
        })
      }
      return [...changed.newPhones, ...changed.newEmails]
    }
  }
}
</script>

<style lang="scss">
.party__form {
  .el-dialog__header {
    padding: 0;
    margin: 0;
  }
  .flex-row {
    display: flex;
    gap: 1vw;
  }
}

</style>
