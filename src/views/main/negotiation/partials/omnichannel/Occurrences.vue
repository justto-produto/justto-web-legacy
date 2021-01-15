<template>
  <section
    id="occurrencesOmnichanelNegotiation"
    class="occurrences-container"
  >
    <ul>
      <li>
        Email
        <el-checkbox
          :value="messageType === 'email'"
          @change="setMessageType('email')"
        />
      </li>
      <li>
        Whatsapp
        <el-checkbox
          :value="messageType === 'whatsapp'"
          @change="setMessageType('whatsapp')"
        />
      </li>
      <li>
        Negotiator
        <el-checkbox
          :value="messageType === 'negotiation'"
          @change="setMessageType('negotiation')"
        />
      </li>
      <li>
        SMS
        <el-checkbox
          :value="messageType === 'sms'"
          @change="setMessageType('sms')"
        />
      </li>
    </ul>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      messageType: 'getEditorMessageType'
    }),
  },
  methods: {
    ...mapActions([
      'setMessageType'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.occurrences-container {
  // display: flex;
  // justify-content: center;
  // align-items: center;

  background-color: transparent;
}
</style>
