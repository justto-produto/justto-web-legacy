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
      <TextInlineEditor
        v-model="contact[model]"
        :mask="mask"
        :filter="filter"
        is-deletable
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
    </span>
    <div
      v-if="(isAllContactsVisible || contactsLength <= 3) && !isAddingNewContact"
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
    />
    <div
      v-if="contactsLength > 3"
      class="party-contacts__infoline-link"
    >
      <a @click="toggleContactsVisible">
        {{ !isAllContactsVisible ? `Ver mais (+${contactsLength - 3})` : `Ver menos (-${contactsLength - 3})` }}
      </a>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PartyContacts',
  components: {
    TextInlineEditor: () => import('@/components/inputs/TextInlineEditor')
  },
  props: {
    contacts: {
      type: Array,
      default: () => ([])
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
      type: [Array, String],
      default: 'X'.repeat(255)
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
    mappedRecipients() {
      return this.recipients.map(({ value }) => (value))
    },
    contactsLength() {
      return this.contacts.length
    },
    processedContacts() {
      const { contacts } = this
      const arrayCut = this.isAllContactsVisible ? this.contactsLength : 3
      return contacts?.slice(0, arrayCut)
    }
  },
  methods: {
    toggleContactsVisible() {
      this.isAllContactsVisible = !this.isAllContactsVisible
    },
    startAddNewContact() {
      this.isAddingNewContact = true
      this.$nextTick(() => this.$refs.newContactInput.enableEdit())
    },
    stopAddNewContact() {
      this.isAddingNewContact = false
      this.newContactModel = ''
    },
    updateContact(contactId, contactValue) {
      this.$emit('change', contactId, contactValue)
    },
    removeContact(contactId) {
      console.log(contactId)
      this.$emit('delete', contactId)
    },
    addContact(contactValue) {
      this.$emit('post', contactValue)
    },
    selectContact(contactValue, isValid) {
      if (isValid) {
        this.$emit('click', contactValue, 'address')
      }
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

    .party-contacts__infoline-icon {
      position: absolute;
      left: 0;
      top: 0;
      padding: 3px 0;
    }

    .party-contacts__infoline-data {
      &--selected { color: $--color-text-regular !important; }
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
        cursor: not-allowed
      }
    }
  }
}
</style>
