<template>
  <article class="party-contacts">
    <span
      v-for="contact in processedContacts"
      :key="contact.id"
      class="party-contacts__infoline-container"
    >
      <i
        v-if="mappedRecipients.includes(contact[model])"
        class="party-contacts__infoline-icon el-icon-s-promotion"
      />

      <div v-else-if="!contact.isMain">
        <el-tooltip
          :open-delay="600"
          effect="dark"
          placement="bottom"
          :content="LGPDMessage"
        >
          <jusIcon
            v-if="isPhoneNumber"
            icon="not-main-phone-active"
            class="party-contacts__infoline-icon"
          />
          <jusIcon
            v-else
            icon="not-main-email-active"
            class="party-contacts__infoline-icon"
          />
        </el-tooltip>
      </div>

      <div class="party-contacts__popover">
        <el-tooltip
          :open-delay="600"
          effect="dark"
          placement="left"
          content="Ver mais informações"
        >
          <el-popover
            v-if="isOabContacts"
            :ref="`popover-${contact.number}-${contact.state}`"
            popper-class="party-contacts__info-popover-lawyer"
            :placement="'top-end'"
            trigger="click"
            @hide="deactivePopover(`popover-${contact.number}-${contact.state}`)"
          >
            <lawyer-detail
              @update="emitUpdate"
            />
            <i
              slot="reference"
              class="el-icon-info icon-info-popover"
              @click="searchThisLawyer({ name: party.name, oabs: [contact] }, `popover-${contact.number}-${contact.state}`)"
            />
          </el-popover>
        </el-tooltip>

        <el-popover
          v-if="contact.blocked || party.optOutType"
          :open-delay="500"
          placement="top-end"
          trigger="hover"
        >
          <div>
            {{ getBlockText(contact) }}
          </div>

          <div slot="reference">
            <TextInlineEditor
              v-model="contact[model]"
              :mask="mask"
              :filter="filter"
              :is-editable="!disabled && !(contact.blocked || party.optOutType)"
              :is-deletable="!disabled"
              :class="{
                'party-contacts__infoline-data--selected': mappedRecipients.includes(contact[model]),
                'party-contacts__infoline-data--disabled': !contact.isValid || contact.blocked || party.optOutType,
                'party-contacts__infoline-data--secondary': !contact.isMain || contact.blocked || party.optOutType
              }"
              class="party-contacts__infoline-data"
              @call="makeCall"
              @change="updateContact(contact.id, $event)"
              @delete="removeContact(contact.id)"
              @click="selectContact(contact[model], contact.isValid, (contact.isMain && !(contact.blocked || party.optOutType)), contact)"
            />
          </div>
        </el-popover>

        <TextInlineEditor
          v-else
          v-model="contact[model]"
          :mask="mask"
          :filter="filter"
          :is-editable="!disabled && !(contact.blocked || party.optOutType)"
          :is-deletable="!disabled"
          :class="{
            'party-contacts__infoline-data--selected': mappedRecipients.includes(contact[model]),
            'party-contacts__infoline-data--disabled': !contact.isValid || contact.blocked || party.optOutType,
            'party-contacts__infoline-data--secondary': !contact.isMain || contact.blocked || party.optOutType
          }"
          class="party-contacts__infoline-data"
          @call="makeCall"
          @change="updateContact(contact.id, $event)"
          @delete="removeContact(contact.id)"
          @click="selectContact(contact[model], contact.isValid, (contact.isMain && !(contact.blocked || party.optOutType)), contact)"
        />
      </div>
    </span>

    <div
      v-if="(isAllContactsVisible || contactsLength <= 3) && !isAddingNewContact && !disabled"
      class="party-contacts__infoline-link"
    >
      <a @click="startAddNewContact">Adicionar</a>
    </div>

    <TextInlineEditor
      v-if="isAddingNewContact"
      ref="newContactInput"
      v-model="newContactModel"
      :mask="mask"
      :filter="filter"
      class="party-contacts__infoline-data"
      @change="addContact"
      @blur="stopAddNewContact"
      @enableEdit="enableEdit"
    />

    <div
      v-if="contactsLength > 3"
      class="party-contacts__infoline-link"
    >
      <a @click="toggleContactsVisible">
        {{ expandLinkText }}
      </a>
    </div>
  </article>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'PartyContacts',

  components: {
    TextInlineEditor: () => import('@/components/inputs/TextInlineEditor'),
    LawyerDetail: () => import('@/components/others/LawyerDetail')
  },

  props: {
    party: {
      type: Object,
      required: false,
      default: () => ({})
    },

    contacts: {
      type: Array,
      default: () => ([])
    },

    disabled: {
      type: Boolean,
      default: false
    },

    model: {
      type: String,
      required: true
    },

    filter: {
      type: String,
      default: ''
    },

    mask: {
      type: [Function, String],
      default: () => 'X'.repeat(255)
    },

    partyName: {
      type: String,
      required: false,
      default: () => ''
    }
  },

  data: () => ({
    isAllContactsVisible: false,
    isAddingNewContact: false,
    newContactModel: '',
    modalLoading: false,
    blocks: {}
    // LGPDDialogVisible: false,
    // currentContactValue: '',
    // currentValid: false
  }),

  computed: {
    ...mapGetters({
      appInstance: 'getAppInstance',
      recipients: 'getEditorRecipients',
      ticketStatus: 'getTicketOverviewStatus'
    }),

    isPhoneNumber() {
      return this.model === 'number'
    },

    LGPDMessage() {
      const type = this.isPhoneNumber ? 'telefone' : 'e-mail'
      return `Este ${type} está desabilitado para receber mensagens automáticas`
    },

    contactsFiltered() {
      return this.contacts.filter(({ archived }) => !archived)
    },

    mappedRecipients() {
      return this.recipients.map(({ value }) => (value))
    },

    contactsLength() {
      return this.contactsFiltered.length
    },

    expandLinkText() {
      const { isAllContactsVisible, contactsLength } = this
      return !isAllContactsVisible ? `Ver mais (+${contactsLength - 3})` : `Ver menos (-${contactsLength - 3})`
    },

    processedContacts() {
      const { contactsFiltered, isAllContactsVisible, contactsLength } = this
      const arrayCut = isAllContactsVisible ? contactsLength : 3

      return contactsFiltered?.slice(0, arrayCut)
    },

    isOabContacts() {
      return Object.values(this.party).length > 0 && this.filter === 'oab'
    },

    getBlockText() {
      return (contact) => {
        const isEmail = (contact.address || '').length > 0

        return Object.keys(this.blocks).includes(String(contact.id)) ? this.blocks[contact.id] : this.$tc(`blocked.${isEmail ? 'email' : 'phone'}.${contact.blockedType || this.party.optOutType || 'UNKNOW'}`)
      }
    }
  },

  watch: {
    contacts: {
      deep: true,
      handler: 'handleValidateContacts'
    }
  },

  methods: {
    ...mapActions([
      'addCall',
      'searchLawyers',
      'getContactBlockReason',
      'hideSearchLawyerLoading'
    ]),

    handleValidateContacts() {
      this.contacts.forEach(contact => {
        if (contact.blocked) {
          const disputeId = Number(this.$route?.params?.id)
          const { blockedType, id } = contact

          const addressType = {
            number: 'phone',
            address: 'email',
            fullOab: 'oab'
          }[this.model]

          const params = {
            disputeId,
            blockedType,
            addressType,
            contactId: id
          }

          this.getContactBlockReason(params).then(({ reason }) => {
            const message = reason || this.$tc(`blocked.${addressType}.${contact.blockedType || 'UNKNOW'}`)

            this.$set(this.blocks, Number(id), message)
          })
        }
      })
    },

    toggleContactsVisible() {
      this.isAllContactsVisible = !this.isAllContactsVisible
    },

    startAddNewContact() {
      this.isAddingNewContact = true
    },

    enableEdit() {
      if (this.isAddingNewContact) this.$refs.newContactInput.enableEdit()
    },

    stopAddNewContact() {
      this.isAddingNewContact = false
      this.newContactModel = ''
    },

    updateContact(contactId, contactValue) {
      this.$emit('change', contactId, contactValue)
    },

    removeContact(contactId) {
      this.$emit('delete', contactId)
    },

    addContact(contactValue) {
      this.$emit('post', contactValue)
    },

    selectContact(contactValue, isValid, isMain, contact) {
      if (!['COMMUNICATION_OPT_OUT'].includes(contact?.blockedType)) this.emitClick(contactValue, isValid, isMain)
    },

    emitClick(contactValue, isValid, isMain) {
      if (isValid) {
        this.$emit('click', contactValue, 'address', isMain)
      }
      // this.LGPDDialogVisible = false
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

    emitUpdate(payload) {
      this.$emit('update', payload)
    },

    makeCall(number) {
      const contact = this.party.phonesDto.find(({ number: phone }) => phone.includes(number))

      if (!contact?.blocked) {
        this.addCall({
          disputeId: Number(this.$route.params.id),
          disputeStatus: this.ticketStatus,
          toRoleId: this.party.disputeRoleId,
          toRoleName: this.party.name,
          number: `+55${number}`,
          appInstance: this.appInstance,
          contacts: {
            emails: this.party.emailsDto,
            phones: this.party.phonesDto
          }
        }).then(_ => {
          this.$jusNotification({
            type: 'success',
            title: 'Yay!',
            message: 'Sua ligação entrou na fila, assim que tiver um telefone disponível para você usar, nós emitiremos um aviso sonoro'
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.party-contacts {
  .party-contacts__infoline-data,
  .party-contacts__infoline-link {
    margin-left: 18px;
    margin-bottom: 3px;
    line-height: normal;
  }
  .party-contacts__infoline-container {
    position: relative;
    .party-contacts__popover {
      i:hover {
        color: $--color-primary;
      }
    }
    .icon-info-popover {
      position: absolute;
    }

    .party-contacts__infoline-icon {
      position: absolute;
      left: 0;
      top: 0;
      padding: 3px 0;
    }

    .party-contacts__infoline-data {
      &--selected { color: $--color-text-primary !important; }
      &--secondary { color: $--color-text-secondary; }
      &--disabled { color: $--color-text-secondary; }
    }

  }

  .party-contacts__infoline-link {
    border-bottom: 2px solid transparent;
  }
}
.party-contacts__lgpd-header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 10px;
  .party-contacts__lgpd-header__icon {
    width: 28px;
    height: 28px;
    margin-right: 8px;
  }
  .party-contacts__lgpd-header__label {
    color: $--color-secondary;
    font-weight: bold;
    font-size: 22px;
  }
}

.party-contacts__lgpd-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  .party-contacts__lgpd-body-item {
    margin-bottom: 5px;

    .party-contacts__lgpd-body-item-person-name {
      text-transform: capitalize;
    }
  }
  .party-contacts__lgpd-body-item-alert {
    font-size: 18px;
    margin-bottom: 8px;
    font-weight: bold;
  }
}
.party-contacts__lgpd-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 12px;
}
</style>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

.party-contacts {
  .party-contacts__infoline-container {
    .party-contacts__infoline-data {
      &--selected .text-inline-editor__inner {
        font-weight: 500;
      }
      &--disabled .text-inline-editor__inner {
        text-decoration: line-through;
        cursor: not-allowed;
      }
    }
  }
}
.party-contacts__info-popover-lawyer {
  width: 500px;
  min-height: 20vh;
  max-height: 50vh;
}
</style>
