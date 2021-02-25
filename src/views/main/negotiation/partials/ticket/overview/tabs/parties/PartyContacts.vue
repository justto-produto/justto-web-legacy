<template>
  <article class="party-contacts">
    <TextInlineEditor
      v-for="contact in processedContacts"
      :key="contact.id"
      v-model="contact[model]"
      :mask="mask"
      :filter="filter"
      is-deletable
      class="party-contacts__infoline-data"
      @change="updateContact(contact.id, $event)"
      @delete="removeContact(contact.id)"
      @click="selectContact(contact[model])"
    />
    <div
      v-if="(isAllContactsVisible || contactsLength <= 3) && !isAddingNewContact"
      class="party-contacts__infoline-link"
    >
      <a @click="startAddNewContact">Adicionar</a>
    </div>
    <TextInlineEditor
      v-else
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
        {{ !isAllContactsVisible ? `Ver mais (+${contactsLength - 3})` : 'Ver menos' }}
      </a>
    </div>
  </article>
</template>

<script>
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
      this.$emit('delete', contactId)
    },
    addContact(contactValue) {
      this.$emit('post', contactValue)
    },
    selectContact(contactValue) {
      this.$emit('click', contactValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.party-contacts {
  .party-contacts__infoline-data,
  .party-contacts__infoline-link {
    margin-left: 18px;
    margin-bottom: 3px;
    line-height: normal;
  }

  .party-contacts__infoline-link {
    border-bottom: 2px solid transparent;
  }
}
</style>
