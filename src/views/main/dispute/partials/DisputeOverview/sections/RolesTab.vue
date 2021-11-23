<template>
  <div>
    <a
      v-if="contactsMetadataCount"
      @click="openAssociationModal()"
    >
      {{ $tc('dispute.overview.label.contact-found', contactsMetadataCount, { count: contactsMetadataCount }) }} {{ $t('dispute.overview.label.in-the-attachments') }}
    </a>

    <el-collapse
      ref="roleCollapse"
      v-model="selectedRoleModel"
      accordion
      class="el-collapse--bordered"
      style="margin: 20px 0 0"
      @change="handleChange"
    >
      <el-collapse-item
        v-for="(role, index) in disputeRolesSort"
        :key="`${index}-${role.personId}`"
        :name="role.id"
        class="dispute-overview-view__role-collapse"
        data-testid="expand-party"
      >
        <div
          slot="title"
          class="dispute-overview-view__person-title"
        >
          <i
            v-if="showNamesake(role) && !role.roles.includes('NEGOTIATOR')"
            class="el-icon-warning el-icon-pulse"
            style="{ color: '#FF9300'; position: absolute; top: 0px; left: 0px;}"
          />
          <JusIcon
            v-else-if="showVexatious(role.personProperties) && !role.roles.includes('NEGOTIATOR') "
            style="{ color: '#FF9300'; position: absolute; top: 0px; left: 0px;}"
            class="el-icon-pulse"
            icon="flat-alert-yellow"
          />
          <JusIcon
            v-else-if="showIsDead(role)"
            style="{ color: '#FF9300'; position: absolute; top: 0px; left: 0px;}"
            class="el-icon-pulse"
            icon="flat-alert"
          />
          <div class="dispute-overview-view__name">
            <span
              v-for="r in role.roles"
              :key="r.id"
              class="dispute-overview-view__role-icon"
            >
              <el-tooltip :content="buildRoleTitle(role.party, r)">
                <i :class="getRoleIcon(role.party, r)" />
              </el-tooltip>
            </span>
            <span
              v-if="role.name"
              @click="handleMessageToNegotiator(role)"
            >
              <el-tooltip
                v-if="onlineList.includes(role.documentNumber)"
                :content="`${$options.filters.capitalize(role.name.toLowerCase().split(' ')[0])} está online`"
              >
                <jus-icon
                  icon="online"
                  style="width: 10px; margin: 19px 0px; margin-left: 8px;"
                />
              </el-tooltip>
              <el-tooltip
                v-else-if="role.oabs.filter(oab => onlineList.includes(`${oab.number}-${oab.state}`)).length"
                :content="`${$options.filters.capitalize(role.name.toLowerCase().split(' ')[0])} está online`"
              >
                <jus-icon
                  icon="online"
                  style="width: 10px; margin: 19px 0px; margin-left: 8px;"
                />
              </el-tooltip>
            </span>
            {{ role.name }}
          </div>
        </div>
        <p
          v-if="showNamesake(role)"
          style="margin-top: 0"
        >
          <span v-if="namesakeProcessing">
            <i class="el-icon-warning" />
            Documento correto enviado para tratamento no sistema. Isso pode levar algum tempo.
          </span>
          <span v-else>
            Esta parte não foi enriquecida corretamente devido à existência de homônimos.
          </span>
        </p>
        <el-button
          v-if="showNamesake(role)"
          :loading="namesakeButtonLoading || namesakeProcessing"
          :type="namesakeProcessing ? 'success' : 'warning'"
          style="width: 100%; margin-bottom: 14px;"
          @click="namesakeDialog(role.name, role.personId)"
        >
          <span v-if="namesakeProcessing">Enriquecendo...</span>
          <span v-else>Tratar homônimos</span>
        </el-button>
        <el-alert
          v-if="showIsDead(role)"
          class="mb10"
          title="Possível óbito"
          type="error"
        >
          Algumas de nossas bases de informações constam que a parte possivelmente encontra-se em óbito.
        </el-alert>
        <div class="dispute-overview-view__info-line">
          <span class="title">Nome completo:</span>
          <div>
            <!-- TODO: Componente de busca no CNA. -->
            <el-popover
              v-if="role.roles.includes('LAWYER')"
              :ref="`popover-${role.name}`"
              popper-class="dispute-overview-view__info-popover-lawyer"
              :placement="'top-end'"
              trigger="click"
              @hide="deactivePopover(`popover-${role.name}`)"
            >
              <lawyer-detail
                @update="updateDisputeRoleField(role, $event)"
              />
              <i
                slot="reference"
                class="el-icon-info"
                @click="searchThisLawyer({ name: role.name, oabs: [] }, `popover-${role.name}`)"
              />
            </el-popover>
            {{ role.name }}
          </div>
        </div>
        <div class="dispute-overview-view__info-line">
          <span class="title">
            Função:
            <span
              v-if="!isToShowChangeParty(role) && !isNegotiator(role)"
              class="dispute-overview-view__edit-tooltip"
              @click="handleEditRule()"
            >
              <el-tooltip
                placement="top"
                content="Editar polaridade"
              >
                <jus-icon icon="edit" />
              </el-tooltip>
            </span>
          </span>
          <div
            v-if="isToShowChangeParty(role) && !isNegotiator(role)"
            class="dispute-overview-view__select-role"
          >
            <el-select
              v-model="role.party"
              size="mini"
              placeholder="Defina o polo desta parte"
              @change="setDisputeParty(role)"
            >
              <el-option
                v-for="party in getDisputePartys(role.roles)"
                :key="party.value"
                :label="party.label"
                :value="party.value"
              />
            </el-select>
            <span
              class="dispute-overview-view__tooltip-cancel-edit-role"
              @click="handleEditRule()"
            >
              <el-tooltip content="Cancelar edição da polaridade">
                <i class="el-icon-error" />
              </el-tooltip>
            </span>
          </div>

          <span
            v-for="(title, titleIndex) in roleTitleSort(role.roles)"
            v-show="!isEditingRole"
            :key="`${titleIndex}-${title.index}`"
            class="dispute-overview-view__info-line-description"
          >
            {{ buildRoleTitle(role.party, title) }}
            <jus-vexatious-alert
              v-if="showVexatious(role.personProperties) && !role.roles.includes('NEGOTIATOR')"
              :document-number="role.documentNumber"
              :name="role.name"
            />
          </span>

          <div
            v-if="role.party === 'UNKNOWN'"
            class="dispute-overview-view__select-role"
          >
            <el-select
              v-model="tempRole"
              size="mini"
              placeholder="Defina o polo desta parte"
              @change="handleUnknowParty(role)"
            >
              <el-option
                v-for="(party, partyKey) in dispuesToUnknownParties"
                :key="`UNKNOWN-${partyKey}`"
                :label="party.label"
                :value="partyKey"
              />
            </el-select>
          </div>
        </div>

        <div
          v-show="role.documentNumber"
          class="dispute-overview-view__info-line"
        >
          <span class="title">CPF/CNPJ:</span>
          <span>{{ role.documentNumber | cpfCnpj }}</span>
        </div>

        <div
          v-show="role.birthday"
          class="dispute-overview-view__info-line"
        >
          <span class="title">Data de nascimento:</span>
          <span v-if="role.birthday">{{ new Date(role.birthday) | moment('DD/MM/YYYY') }}</span>
        </div>

        <div
          v-show="role.party === 'CLAIMANT'"
          class="dispute-overview-view__info-line"
        >
          <span class="title">Portal de comunicação Justto:</span>
          <span
            v-if="role.party === 'CLAIMANT'"
            class="dispute-overview-view__negotiator-icon"
            @click="handleMessageToNegotiator(role)"
          >
            <jus-icon
              class="icon"
              icon="negotiation"
            />
            <span class="text">
              {{ role.name.toLowerCase() }}
            </span>
          </span>
        </div>

        <div
          v-show="role.phones.length"
          class="dispute-overview-view__info-line"
        >
          <span class="title">Telefone(s):</span>
          <span
            v-for="(phone, phone_index) in role.phones.filter(p => !p.archived)"
            :key="`${phone_index}-${phone.id}`"
            :class="{'is-main': phone.isMain}"
          >
            <el-radio
              v-model="selectedPhone"
              :label="phone.id"
              :disabled="!phone.isMobile"
              data-testid="radio-whatsapp"
              @change="handleUpdateDisputeRole({ activeRole: role, messageType: 'whatsapp'})"
            >
              <el-tooltip
                :content="buildContactStatus(phone)"
                :open-delay="500"
              >
                <span :class="phone.source === 'ENRICHMENT' ? 'dispute-overview-view__is-enriched' : ''">
                  {{ phone.number | phoneNumber }}<span v-if="phone.source === 'ENRICHMENT'">*</span>
                </span>
              </el-tooltip>
            </el-radio>
            <!-- <div class="alerts"> -->
            <el-tooltip content="Este telefone está desabilitado para receber mensagens automáticas, ao editar e habilitar o endereço, você está em desrespeito com a LGPD. ">
              <jus-icon
                v-show="!phone.isMain"
                icon="not-main-phone-active"
              />
            </el-tooltip>
            <el-tooltip content="Telefone inválido">
              <jus-icon
                v-show="!phone.isValid"
                icon="warn-dark"
              />
            </el-tooltip>
            <!-- </div> -->
          </span>
        </div>

        <div
          v-show="role.emails.length"
          class="dispute-overview-view__info-line"
        >
          <span class="title">E-mail(s):</span>
          <span
            v-for="(email, email_index) in role.emails.filter(e => !e.archived)"
            :key="`${email_index}-${email.id}`"
            :class="{'is-main': email.isMain && !email.blocked}"
          >
            <el-checkbox
              v-model="email.selected"
              data-testid="checkbox-email"
              @change="handleUpdateDisputeRole({ activeRole: role, messageType: 'email'})"
            />
            <el-tooltip
              :content="buildContactStatus(email)"
              :open-delay="500"
            >
              <span :class="email.source === 'ENRICHMENT' ? 'dispute-overview-view__is-enriched' : ''">
                {{ email.address }}<span v-if="email.source === 'ENRICHMENT'">*</span>
              </span>
            </el-tooltip>
            <div class="alerts">
              <el-tooltip content="Este email está desabilitado para receber mensagens automáticas, ao editar e habilitar o endereço, você está em desrespeito com a LGPD. ">
                <jus-icon
                  v-show="!email.isMain"
                  icon="not-main-email-active"
                />
              </el-tooltip>
              <el-tooltip content="E-mail inválido">
                <jus-icon
                  v-show="!email.isValid"
                  icon="warn-dark"
                />
              </el-tooltip>
            </div>
          </span>
        </div>

        <div
          v-show="role.oabs.length"
          class="dispute-overview-view__info-line"
        >
          <span class="title">OAB(s):</span>
          <span
            v-for="(oab, oab_index) in role.oabs.filter(o => !o.archived)"
            :key="`${oab_index}-${oab.id}`"
            :class="{'is-main': oab.isMain}"
          >
            <span>
              <!-- TODO: Componente de busca no CNA. -->
              <el-popover
                :ref="`popover-${oab.number}-${oab.state}`"
                popper-class="dispute-overview-view__info-popover-lawyer"
                placement="top"
                trigger="click"
                @hide="deactivePopover(`popover-${oab.number}-${oab.state}`)"
              >
                <lawyer-detail
                  @update="updateDisputeRoleField(role, $event)"
                />
                <i
                  slot="reference"
                  class="el-icon-info"
                  @click="searchThisLawyer({...role, oabs: [oab]}, `popover-${oab.number}-${oab.state}`)"
                />
              </el-popover>
              {{ oab.number + '-' + oab.state || '' }}
            </span>
            <div class="alerts">
              <el-tooltip content="OAB inválido">
                <jus-icon
                  v-show="!oab.isValid"
                  icon="warn-dark"
                />
              </el-tooltip>
            </div>
          </span>
        </div>

        <div
          v-if="role.bankAccounts && role.bankAccounts.length"
          class="dispute-overview-view__info-line"
        >
          <span class="title">Conta(s) bancária(s):</span>
          <el-tooltip content="Selecione as contas bancárias que serão vinculadas à Disputa">
            <i
              class="el-icon-question right"
              style="margin-top: 5px;"
            />
          </el-tooltip>
          <el-tooltip
            :disabled="dispute.status !== 'PRE_NEGOTIATION'"
            placement="left"
            content="Disputas em pré negociação não podem ser editadas"
          >
            <el-checkbox-group
              v-model="disputeBankAccountsIds"
              :disabled="dispute.status === 'PRE_NEGOTIATION'"
              class="dispute-overview-view__bank-checkbox"
            >
              <el-checkbox
                v-for="(bankAccount, bank_account_index) in role.bankAccounts.filter(b => !b.archived)"
                :key="`${bank_account_index}-${bankAccount.id}`"
                :label="bankAccount.id"
                border
                class="bordered"
              >
                <div v-show="bankAccount.name">
                  <strong>Nome:</strong> {{ bankAccount.name }}
                </div>
                <div v-show="bankAccount.email">
                  <strong>E-mail:</strong> {{ bankAccount.email }}
                </div>
                <div><strong>Documento:</strong> {{ bankAccount.document | cpfCnpj }}</div>
                <div><strong>Banco:</strong> {{ bankAccount.bank }}</div>
                <div><strong>Agência:</strong> {{ bankAccount.agency }}</div>
                <div><strong>Conta:</strong> {{ bankAccount.number }}</div>
                <div><strong>Tipo:</strong> {{ bankAccount.type === 'SAVING' ? 'Poupança' : 'Corrente' }}</div>
              </el-checkbox>
            </el-checkbox-group>
          </el-tooltip>
        </div>

        <el-tooltip
          :disabled="dispute.status !== 'PRE_NEGOTIATION'"
          content="Disputas em pré negociação não podem ser editadas"
        >
          <div
            v-if="!role.roles.includes('NEGOTIATOR')"
            class="dispute-overview-view__actions"
          >
            <el-button
              :disabled="dispute.status === 'PRE_NEGOTIATION'"
              plain
              @click="handleRemoveRole(role)"
            >
              Excluir
            </el-button>
            <el-button
              :disabled="dispute.status === 'PRE_NEGOTIATION'"
              type="primary"
              data-testid="edit-part"
              @click="openRoleDialog(role)"
            >
              Editar
            </el-button>
          </div>
        </el-tooltip>

        <!-- Dialog para exclusão de parte cascateda ou não -->
        <el-dialog
          append-to-body
          :close-on-click-modal="false"
          :show-close="false"
          :close-on-press-escape="false"
          :visible.sync="chooseRemoveLawyerDialogVisible"
          title="Excluir parte"
          width="520px"
        >
          <div class="el-message-box__content">
            <div class="el-message-box__container">
              <div class="el-message-box__status el-icon-warning" />
              <div class="el-message-box__message">
                <p>Tem certeza que deseja excluir esta parte?</p>
                <p>Esta ação é irreversível.</p>
              </div>
            </div>
          </div>
          <span slot="footer">
            <el-tooltip
              :content="`Remover ${deletingLawyer.name} de todas as disputas com ${isRecoveryStrategy ? 'a mesma' : 'o mesmo'} ${$tc('PARTY_RESPONDENT', isRecoveryStrategy)}.`"
              placement="top"
            >
              <el-button
                @click="removeLawyer(true)"
              >
                De todas as disputas
              </el-button>
            </el-tooltip>
            <el-tooltip
              :content="`Remover ${deletingLawyer.name} somente desta disputa.`"
              placement="top"
            >
              <el-button
                @click="removeLawyer(false)"
              >
                Desta disputa
              </el-button>
            </el-tooltip>
            <el-button
              type="primary"
              @click="chooseRemoveLawyerDialogVisible = false"
            >
              Cancelar
            </el-button>
          </span>
        </el-dialog>
      </el-collapse-item>

      <el-tooltip
        :disabled="dispute.status !== 'PRE_NEGOTIATION'"
        content="Disputas em pré negociação não podem ser editadas"
      >
        <span>
          <el-button
            :disabled="dispute.status === 'PRE_NEGOTIATION'"
            class="dispute-overview-view__add-role mb20"
            plain
            icon="el-icon-plus"
            @click.prevent="$emit('newRole', true)"
          >
            <!-- @click.prevent="newRoleDialogVisible = true" -->
            Cadastrar parte
          </el-button>
        </span>
      </el-tooltip>
    </el-collapse>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { buildRoleTitle, getRoleIcon } from '@/utils'

export default {
  components: {
    LawyerDetail: () => import('@/components/others/LawyerDetail'),
    JusVexatiousAlert: () => import('@/components/dialogs/JusVexatiousAlert')
  },

  props: {
    dispute: {
      type: Object,
      required: true
    },

    editingRole: {
      type: Boolean,
      required: true
    },

    removeLawyer: {
      type: Boolean,
      required: true
    },

    selectedRole: {
      type: Number,
      default: 0
    },

    deletingLawyer: {
      type: Object,
      default: () => ({ name: '' })
    },

    phoneSelected: {
      type: Number,
      default: 0
    },

    disputeRolesSort: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    ...mapGetters({
      disputeMetadata: 'disputeMetadata',
      onlineDocuments: 'onlineDocuments',
      isRecoveryStrategy: 'isWorkspaceRecovery'
    }),

    selectedRoleModel: {
      get() { return this.selectedRole },
      set(newSelectedRole) { this.$emit('update:selectedRole', newSelectedRole || 0) }
    },

    selectedPhone: {
      get() { return this.phoneSelected },
      set(model) { this.$emit('update:phoneSelected', model) }
    },

    chooseRemoveLawyerDialogVisible: {
      get() { return this.removeLawyer },
      set(model) { this.$emit('update:removeLawyer', model) }
    },

    isEditingRole: {
      get() { return this.editingRole },
      set(model) { this.$emit('update:editingRole', model) }
    },

    onlineList() {
      return Object.keys(this.onlineDocuments) || []
    },

    contactsMetadataCount() {
      const { phones, emails } = this.disputeMetadata
      return phones.length + emails.length
    }
  },

  methods: {
    ...mapActions([
      'searchLawyers',
      'setDisputeparty',
      'setDisputeProperty',
      'getDisputeProperties',
      'hideSearchLawyerLoading'
    ]),

    setDisputeParty(role) {
      this.$jusSegment('Definindo função em participante da disputa', {
        page: this.$route.name
      })
      this.setDisputeparty({
        disputeId: this.dispute.id,
        disputeRoleId: role.id,
        disputeParty: role.party
      })
        .then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Função definida com sucesso!',
            type: 'success',
            dangerouslyUseHTMLString: true
          })
        }).finally(() => {
          this.isEditingRole = false
          this.getDisputeProperties(this.dispute.id)
        })
    },

    buildRoleTitle: (...i) => buildRoleTitle(...i),

    getRoleIcon: (...i) => getRoleIcon(...i),

    showIsDead(role) {
      return role.dead
    },

    isToShowChangeParty({ party, roles }) {
      return this.isEditingRole && party !== 'UNKNOWN'
    },

    isNegotiator({ roles }) {
      return (roles || []).includes('NEGOTIATOR')
    },

    roleTitleSort(title) {
      if (title) {
        const sortedArray = title.slice(0) || []
        return sortedArray.sort((a, b) => {
          return (a[0] > b[0]) ? -1 : (a[0] < b[0]) ? 1 : 0
        })
      } return []
    },

    openAssociationModal() {
      this.setDisputeProperty({
        disputeId: this.dispute.id,
        key: 'CONTATOS ASSOCIADOS',
        value: 'NAO'
      })
    },

    searchThisLawyer(lawyer, ref) {
      if (!this.$refs[ref][0].showPopper) {
        this.$refs[ref][0].$el.classList.add('active-popover')
        this.searchLawyers(lawyer).finally(this.hideSearchLawyerLoading)
      }
    },

    deactivePopover(ref) {
      this.$refs[ref][0].$el.classList.remove('active-popover')
    },

    handleChange(event) {
      this.$emit('handleChange', event)
    },

    handleRemoveRole(event) {
      this.$emit('removeRole', event)
    },

    openRoleDialog(event) {
      this.$emit('openRoleDialog', event)
    },

    handleEditRule(event) {
      this.$emit('handleEditRule', event)
    },

    handleMessageToNegotiator(event) {
      this.$emit('messageToNegotiator', event)
    },

    handleUpdateDisputeRole(event) {
      this.$emit('updateDisputeRole', event)
    },

    showNamesake(role) {
      return role?.namesake && !role.documentNumber
    },

    showVexatious(personProperties) {
      if (personProperties?.IS_VEXATIOUS_AUTHOR === 'true' || personProperties?.IS_VEXATIOUS_LAWYER === 'true' || personProperties?.IS_VEXATIOUS_PARTY === 'true') return true
      return false
    },

    buildContactStatus(contact) {
      if (contact.blocked) {
        return 'Este contato foi bloqueado pelo usuário.'
      } else if (!contact.address && !contact.isMobile) {
        return 'Não é possível enviar WhatsApp para números de telefones fixo'
      } else if (contact.source === 'ENRICHMENT') {
        return 'Contato enriquecido pelo sistema Justto'
      } else {
        return 'Contato adicionado manualmente'
      }
    },

    getDisputePartys(roles) {
      if (roles.includes('PARTY')) {
        return [
          { value: 'RESPONDENT', label: this.$tc('PARTY_RESPONDENT', this.isRecoveryStrategy) },
          { value: 'CLAIMANT', label: this.$tc('fields.claimantParty', this.isRecoveryStrategy) }
        ]
      } else if (roles.includes('LAWYER')) {
        return [
          { value: 'RESPONDENT', label: this.$tc('LAWYER_RESPONDENT', this.isRecoveryStrategy) },
          { value: 'CLAIMANT', label: this.$tc('fields.claimantLawyer', this.isRecoveryStrategy) }
        ]
      } else {
        return []
      }
    }
  }
}
</script>
