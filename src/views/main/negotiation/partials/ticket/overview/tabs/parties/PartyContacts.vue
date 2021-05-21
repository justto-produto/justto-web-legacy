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
      <div class="party-contacts__popover">
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
        <TextInlineEditor
          v-model="contact[model]"
          :mask="mask"
          :filter="filter"
          :is-editable="!disabled"
          :is-deletable="!disabled"
          :class="{
            'party-contacts__infoline-data--selected': mappedRecipients.includes(contact[model]),
            'party-contacts__infoline-data--disabled': contact.isValid === false,
            'party-contacts__infoline-data--secondary': contact.isMain === false
          }"
          class="party-contacts__infoline-data"
          @change="updateContact(contact.id, $event)"
          @delete="removeContact(contact.id)"
          @click="selectContact(contact[model], contact.isValid)"
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
    }
  },
  data: () => ({
    isAllContactsVisible: false,
    isAddingNewContact: false,
    newContactModel: ''
  }),
  computed: {
    ...mapGetters({
      recipients: 'getEditorRecipients'
    }),
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
      return Object.values(this.party).length > 0
    }
  },
  methods: {
    ...mapActions([
      'searchLawyers',
      'hideSearchLawyerLoading'
    ]),
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
    selectContact(contactValue, isValid) {
      if (isValid) {
        this.$emit('click', contactValue, 'address')
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

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
</style>

<style lang="scss">
@import '@/styles/colors.scss';

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
