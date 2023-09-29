<!-- eslint-disable vue/no-mutating-props -->
<template>
  <!-- Dialog para edição de parte -->
  <el-dialog
    :close-on-click-modal="false"
    :show-close="false"
    :visible.sync="visible"
    width="45%"
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
        <el-col :span="party.birthday ? 12 : 24">
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

        <el-col
          v-if="party.birthday"
          :span="12"
        >
          <el-form-item
            label="Data de nascimento"
            prop="birthday"
          >
            <div class="el-input">
              <DateInlieEditor
                :value="party.birthday"
                :is-editable="canEditBirthday"
                :processed-date="$moment(new Date(party.birthday)).fromNow(true)"
                :is-date-time-format="false"
                edit-on-click
                class="el-input__inner birthday-editor"
                @change="setBirthday"
              />
            </div>
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
            v-show="showInputMultiple"
            ref="multiplePhones"
            v-model="inputMultiplePhones"
            type="textarea"
            :autosize="{ minRows: 1 }"
          />

          <el-input
            v-show="!showInputMultiple"
            ref="singlePhone"
            v-model="party.phone"
            v-mask="['(##) ####-####', '(##) #####-####']"
            @keydown.enter.native="addPhone()"
            @input="$forceUpdate()"
          />

          <el-button
            type="primary"
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
        align="left"
      >
        <el-table-column align="left">
          <div slot-scope="scope">
            <el-tooltip
              v-if="!scope.row.id"
              placement="left"
              content="Contato recém adicionado, ainda não está salvo."
            >
              <i class="el-icon-info" />
            </el-tooltip>

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
            v-show="showInputMultiple"
            ref="multipleEmails"
            v-model="inputMultipleEmails"
            type="textarea"
            :autosize="{ minRows: 1 }"
          />

          <el-input
            v-show="!showInputMultiple"
            ref="singleEmail"
            v-model="party.email"
            data-testid="input-email"
            @keydown.enter.native="addEmail()"
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
            <el-tooltip
              v-if="!scope.row.id"
              placement="left"
              content="Contato recém adicionado, ainda não está salvo."
            >
              <i class="el-icon-info" />
            </el-tooltip>

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
          style="float: right;width: 16px;margin-top: 1px;margin-right: 23px;"
          @click.prevent="openTabEditBank()"
        >
          <a
            id="bankAccountRef"
            class="bank-accounts__link"
          >
            <i class="el-icon-plus icon-white" />
          </a>
        </a>
      </h4>

      <BankAccountInlineForm
        v-show="showBankAccountForm"
        ref="partyBankAccountDialog"
        @create="handleNewBankAccount"
        @close="event => showBankAccountForm = false"
      />

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

            <div
              v-if="scope.row.type === 'PIX'"
              style="font-size: 12px;"
            >
              PIX | {{ scope.row.document || scope.row.email || scope.row.number }}
            </div>

            <div
              v-else
              style="font-size: 12px;"
            >
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
            <a @click.prevent="removeBankData(scope.$index, scope.row.id)">
              <jus-icon icon="trash" />
            </a>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <span slot="footer">
      <el-button @click="$emit('closeEdit')">
        Cancelar
      </el-button>

      <el-button
        :loading="loading"
        type="primary"
        data-testid="edit-data-part"
        @click="handleEditRole"
      >
        Editar dados
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { phone as phoneValidator } from 'phone'
import * as EmailValidator from 'email-validator'
import { validateName, validateDocument, validatePhone } from '@/utils/validations'

import restartEngagement from '@/utils/mixins/restartEngagement'

export default {
  components: {
    DateInlieEditor: () => import('@/components/inputs/DateInlieEditor'),
    BankAccountInlineForm: () => import('@/components/forms/BankAccountInlineForm')
  },

  mixins: [restartEngagement],

  props: {
    party: {
      type: Object,
      required: true
    },

    visible: {
      type: Boolean,
      required: true
    },

    ticketStatus: {
      type: String,
      default: () => ''
    }
  },

  data() {
    return {
      originalRole: {},
      bankAccountIdstoUnlink: [],
      loading: false,
      showBankAccountForm: false,
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
      },
      showInputMultiple: false,
      inputMultiplePhones: '',
      inputMultipleEmails: ''
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
    this.originalRole = { ...this.party }

    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
  },

  methods: {
    ...mapActions([
      'editRole',
      'addPhoneToDisputeRole',
      'addOabToDisputeRole',
      'createTicketRoleBankAccount',
      'setTicketRoleBankAccount',
      'getTicketOverviewParty'
    ]),

    setBirthday(newDate) {
      if (['string'].includes(typeof newDate)) this.$set(this.party, 'birthday', newDate.split('-').map(Number))
    },

    openTabEditBank() {
      this.showBankAccountForm = true
      this.$refs.partyBankAccountDialog.showForm({
        name: this.party?.name || ''
      })
    },

    splitString(string) {
      const list = []
      const separators = ['\n', '\t', '\r', ';', ',', '|', '\\', '/', '&']
      let currentWord = ''

      for (const char of string) {
        if (separators.includes(char)) {
          if (currentWord !== '') {
            list.push(currentWord)
          }
          currentWord = ''
        } else {
          currentWord += char
        }
      }

      if (currentWord !== '') {
        list.push(currentWord)
      }

      return list
    },

    addMultiplesPhone() {
      return new Promise((resolve, reject) => {
        let hasAnyValid = false
        const phones = this.splitString(this.inputMultiplePhones).filter(phone => {
          return phoneValidator(phone, { country: 'BRA' }).isValid
        }).map(phone => phoneValidator(phone, { country: 'BRA' }).phoneNumber)

        if (phones.length) {
          const tag = this.$createElement
          this.$confirm(tag('div', {}, [
            tag('p', {}, `Os ${phones.length} contatos abaixo serão adicionados:`),
            tag('ul', {}, phones.map(phone => tag('li', {}, this.$options.filters.phoneNumber(phone))))
          ]), 'Atenção!', {
            confirmButtonText: 'Adicionar',
            cancelButtonText: 'Cancelar',
            closeOnClickModal: false,
            showClose: false,
            closeOnPressEscape: false
          }).then(() => {
            phones.map(phone => {
              hasAnyValid = true
              // eslint-disable-next-line vue/no-mutating-props
              this.party.phone = phone
              this.addPhone()
            })
            this.$message({
              type: 'success',
              message: phones.length > 1 ? `${phones.length} contatos foram adicionados com sucesso.` : `${phones.length} contato foi adicionado com sucesso.`
            })
          }).catch(() => {
            this.$jusNotification({
              title: 'Atenção!',
              message: 'Nenhum número foi adicionado.',
              type: 'warning'
            })
          })
        }

        this.inputMultiplePhones = ''

        if (hasAnyValid) resolve()
        else reject(new Error('Nenhum número válido foi adicionado.'))
      })
    },

    addPhone() {
      let isValid = true

      // eslint-disable-next-line vue/no-mutating-props
      this.party.phone = this.party.phone.trim()
      this.$refs.party.validateField('phone', errorMessage => {
        if (errorMessage || !this.party.phone) isValid = false
      })

      if (isValid) {
        const self = this

        // eslint-disable-next-line vue/no-mutating-props
        this.party.phone = this.party.phone.replace(/ /g, '').replace(/\D/g, '')
        const duplicatedIndex = this.party.phones.findIndex(p => {
          const number = p.number.startsWith('55') ? p.number.replace('55', '') : p.number
          return number === self.party.phone
        })

        // eslint-disable-next-line vue/no-mutating-props
        if (duplicatedIndex < 0) this.party.phones.push({ number: this.party.phone, isMain: true })

        // eslint-disable-next-line vue/no-mutating-props
        this.party.phone = ''
      }
    },

    removePhone(index) {
      // eslint-disable-next-line vue/no-mutating-props
      this.party.phones.splice(index, 1)
    },

    addMultiplesEmails() {
      return new Promise((resolve, reject) => {
        let hasAnyValid = false
        const emails = this.splitString(this.inputMultipleEmails).filter(email => EmailValidator.validate(email))

        const tag = this.$createElement
        this.$confirm(tag('div', {}, [
          tag('p', {}, `Os ${emails.length} contatos abaixo serão adicionados:`),
          tag('ul', {}, emails.map(email => tag('li', {}, this.$options.filters.phoneOrEmail(email))))
        ]), 'Atenção!', {
          confirmButtonText: 'Adicionar',
          cancelButtonText: 'Cancelar',
          closeOnClickModal: false,
          showClose: false,
          closeOnPressEscape: false
        }).then(() => {
          emails.map(email => {
            hasAnyValid = true
            // eslint-disable-next-line vue/no-mutating-props
            this.party.email = email
            this.addEmail()
          })
          this.$message({
            type: 'success',
            message: emails.length > 1 ? `${emails.length} contatos foram adicionados com sucesso.` : `${emails.length} contato foi adicionado com sucesso.`
          })
        }).catch(() => {
          this.$jusNotification({
            title: 'Atenção!',
            message: 'Nenhum número foi adicionado.',
            type: 'warning'
          })
        })

        this.inputMultipleEmails = ''

        if (hasAnyValid) resolve()
        else reject(new Error('Nenhum e-mail válido foi adicionado.'))
      })
    },

    addEmail() {
      let isValid = true

      // eslint-disable-next-line vue/no-mutating-props
      this.party.email = this.party.email.trim()
      this.$refs.party.validateField('email', errorMessage => {
        if (errorMessage || !this.party.email) isValid = false
      })

      if (isValid) {
        const self = this
        const duplicatedIndex = this.party.emails.findIndex(e => e.address === self.party.email)

        // eslint-disable-next-line vue/no-mutating-props
        if (duplicatedIndex < 0) this.party.emails.push({ address: this.party.email, isMain: true })

        // eslint-disable-next-line vue/no-mutating-props
        this.party.email = ''
      }
    },

    removeEmail(index) {
      // eslint-disable-next-line vue/no-mutating-props
      this.party.emails.splice(index, 1)
    },

    addOab() {
      let isValid = true
      this.$refs.party.validateField(['oab', 'state'], errorMessage => {
        if (errorMessage || !this.party.oab || !this.party.state) isValid = false
      })
      if (isValid) {
        const self = this
        // eslint-disable-next-line vue/no-mutating-props
        this.party.oab = this.party.oab.replace(/ /g, '')
        const isDuplicated = this.party.oabs.findIndex(o => o.number === self.party.oab && o.state === self.party.state)
        if (isDuplicated < 0) {
          // eslint-disable-next-line vue/no-mutating-props
          this.party.oabs.push({
            number: this.party.oab,
            state: this.party.state
          })
        }
        // eslint-disable-next-line vue/no-mutating-props
        this.party.oab = ''
        // eslint-disable-next-line vue/no-mutating-props
        this.party.state = ''
      }
    },

    removeOab(index) {
      // eslint-disable-next-line vue/no-mutating-props
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

          this.setTicketRoleBankAccount({ bankAccountId: baccount.id, personId, disputeId })
        }

        this.$jusNotification({
          title: 'Yay!',
          dangerouslyUseHTMLString: true,
          message: 'Conta bancária <strong>criada</strong> com sucesso.',
          type: 'success'
        })
      }).catch(error => this.$jusNotification({ error })).finally(_ => this.closeBankAccountDialog())
    },

    removeBankData(index, id) {
      this.bankAccountIdstoUnlink.push(id)
      // eslint-disable-next-line vue/no-mutating-props
      this.party.bankAccounts.splice(index, 1)
    },

    closeBankAccountDialog() {
      this.$refs.partyBankAccountDialog.hideForm()
    },

    handleEditRole() {
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
      const disputeRoleId = roleToEdit?.id
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
        this.verifyRestartEngagement({
          name: this.party.name,
          status: this.ticketStatus,
          party: this.party.party,
          disputeId: Number(this.$route.params.id),
          disputeRoleId: this.party.id
        })
        if (roleDataDifference.length) {
          this.$confirm(this.$t('dispute.overview.confirm.restart.engagement.question'), 'Atenção!', {
            confirmButtonText: this.$t('dispute.overview.confirm.restart.engagement.confirm'),
            cancelButtonText: this.$t('dispute.overview.confirm.restart.engagement.cancel'),
            type: 'warning'
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
                  disputeId: this.$route.params.id,
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
            type: 'warning'
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
    },

    onKeyUp(event) {
      if (event.keyCode === 17) {
        let ref = null

        if (this.$refs?.multiplePhones?.focused) {
          this.addMultiplesPhone().then(_ => this.$jusNotification({
            title: 'Yay!',
            message: 'Os números foram adicionados com sucesso.',
            type: 'success'
          }))

          if (this.$refs?.singlePhone) ref = this.$refs.singlePhone
        } else if (this.$refs?.multipleEmails?.focused) {
          this.addMultiplesEmails().then(_ => this.$jusNotification({
            title: 'Yay!',
            message: 'Os e-mails foram adicionados com sucesso.',
            type: 'success'
          }))

          if (this.$refs?.singleEmail) ref = this.$refs.singleEmail
        }

        this.showInputMultiple = false
        if (ref) this.$nextTick(ref.focus)
      }
    },

    onKeyDown(event) {
      if (event.keyCode === 17) {
        this.showInputMultiple = true

        this.$nextTick(() => {
          if (this.$refs?.multiplePhones && this.$refs?.singlePhone?.focused) this.$refs.multiplePhones.focus()
          if (this.$refs?.multipleEmails && this.$refs?.singleEmail?.focused) this.$refs.multipleEmails.focus()
        })
      }
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

.birthday-editor {
  .date-inline-editor__value {
    border: none !important;
    padding: 0 15px;

    .date-inline-editor__icons {
      background-image: none !important;
      background-color: transparent !important;
    }
  }

  .date-inline-editor__input {
    .el-input__inner {
      border: none !important;
    }
  }
}

</style>
