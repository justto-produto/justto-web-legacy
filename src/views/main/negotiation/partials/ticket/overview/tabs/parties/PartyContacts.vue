<template>
  <article class="party-contacts">
    <TextInlineEditor
      v-for="contact in processedContacts"
      :key="contact.id"
      v-model="contact[model]"
      :mask="mask"
      :filter="filter"
      id-deletable
      class="party-contacts__infoline-data"
      @change="updateContact(contact.id, $event)"
      @delete="removeContact(contact.id)"
      @click="selectContact(contact.id, contact[model])"
    />
    <a
      v-if="contactsLength > 3"
      class="party-contacts__infoline-link"
      @click="toggleContactsVisible"
    >
      {{ !isAllContactsVisible ? `Ver mais (+${contactsLength - 3})` : 'Ver menos' }}
    </a>
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
    isAllContactsVisible: false
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
    updateContact(contactId, contactValue) {
      this.$emit('change', contactId, contactValue)
    },
    removeContact(contactId) {
      this.$emit('delete', contactId)
    },
    selectContact(contactId, contactValue) {
      this.$emit('click', contactId, contactValue)
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
}
</style>
